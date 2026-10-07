/**
 * 首页榜单口径与计算（4 榜 × 4 专区）
 *
 * 榜单：update 更新榜 / logpower 原木力榜 / complete 完结榜 / new 新作榜
 * 专区：all 全部混排 / novel 小说 / manga 漫画 / world 世界（同存 novels 表）
 *
 * 统一过滤：deleted = 0 AND is_personal = 0 AND is_banned = 0
 * 更新榜：近 7 天有更新，按最新更新时间倒序（novels.update_time 仅在话数发布时刷新，草稿不影响）
 * 原木力榜：novels.ranking 降序
 * 完结榜：is_complete = 1，按完结（最后更新）时间倒序
 * 新作榜：上线 90 天内，按原木力降序
 */
const { query, withTransaction } = require('../sql.js');

const BOARDS = ['update', 'logpower', 'complete', 'new'];
const ZONES = { all: null, novel: 'novel', manga: 'manga', world: 'world' };
const RANK_LIMIT = 50;
const UPDATE_WINDOW_DAYS = 7;
const NEW_WINDOW_DAYS = 90;

const PUBLIC_FILTER = 'n.deleted = 0 AND n.is_personal = 0 AND n.is_banned = 0';

// 与 statistics.update_logpower / recommand.js 中的原木力公式保持一致（勿单独改动一侧）
const LOGPOWER_FORMULA = `ROUND(
	(n.clicks * 8 +
	(SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id) * 12 +
	(SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id) * 200 +
	(SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id AND deleted = 0) * 20 +
	(SELECT IFNULL(SUM(item_amount * item_cost), 0) FROM tipping WHERE novel_id = n.novel_id) * 10)
	* IF((1 + (DATEDIFF(n.update_time, CURRENT_TIMESTAMP) + 5) * 0.33 * 0.2) > 0.4,
		(1 + (DATEDIFF(n.update_time, CURRENT_TIMESTAMP) + 5) * 0.33 * 0.2), 0.4)
	* IF((1 + (DATEDIFF(n.update_time, CURRENT_TIMESTAMP)) * 0.07 * 0.05) > 0.6,
		(1 + (DATEDIFF(n.update_time, CURRENT_TIMESTAMP)) * 0.07 * 0.05), 0.6)
)`;

const HAYCRAFT_TAG_FLAG_SQL = `EXISTS (
	SELECT 1
	FROM novel_tag haycraft_nt
	JOIN tags haycraft_t ON haycraft_t.tag_id = haycraft_nt.tag_id
	WHERE haycraft_nt.novel_id = n.novel_id
		AND haycraft_t.is_deleted = 0
		AND LOWER(TRIM(haycraft_t.tag_name)) LIKE '%haycraft%'
)`;

const BOARD_RULES = {
	update: {
		where:
			'AND n.update_time >= DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL ' +
			UPDATE_WINDOW_DAYS +
			' DAY)',
		order: 'n.update_time DESC',
		score: '0',
	},
	logpower: {
		where: '',
		order: 'n.ranking DESC',
		score: 'n.ranking',
	},
	complete: {
		where: 'AND n.is_complete = 1',
		order: 'n.update_time DESC',
		score: '0',
	},
	new: {
		where:
			'AND n.create_time >= DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL ' +
			NEW_WINDOW_DAYS +
			' DAY)',
		order: 'n.ranking DESC',
		score: 'n.ranking',
	},
};

function assertBoardZone(board, zone) {
	if (!BOARDS.includes(board) || !(zone in ZONES)) {
		throw new Error(`未知的榜单或专区: board=${board}, zone=${zone}`);
	}
}

function getZoneFilter(zone) {
	return zone === 'all'
		? "n.novel_type IN ('novel', 'manga', 'world')"
		: `n.novel_type = '${ZONES[zone]}'`;
}

// 榜单候选查询：novel_id + 排序分值，供快照任务写入 rank_snapshot
function getBoardCandidatesSql(board, zone) {
	assertBoardZone(board, zone);
	const rule = BOARD_RULES[board];
	return `SELECT n.novel_id, ${rule.score} AS score
		FROM novels n
		WHERE ${PUBLIC_FILTER} AND ${getZoneFilter(zone)} ${rule.where}
		ORDER BY ${rule.order}, n.novel_id DESC
		LIMIT ${RANK_LIMIT}`;
}

// 实时兜底查询：快照缺失时直接返回带展示字段的榜单（API 用）
function getLiveBoardSql(board, zone, offset, amount) {
	assertBoardZone(board, zone);
	const rule = BOARD_RULES[board];
	return `SELECT n.novel_id, n.name, n.picUrl, n.novel_type, n.is_complete, n.create_time, n.update_time, n.clicks,
			${rule.score} AS score,
			u.name user_name, u.avatar_url,
			${HAYCRAFT_TAG_FLAG_SQL} AS is_haycraft
		FROM novels n
		LEFT JOIN users u ON u.user_id = n.author_id
		WHERE ${PUBLIC_FILTER} AND ${getZoneFilter(zone)} ${rule.where}
		ORDER BY ${rule.order}, n.novel_id DESC
		LIMIT ${Number(offset)}, ${Number(amount)}`;
}

// 全量重算公开作品的原木力（补上原被动触发不重算的缺口）
async function refreshLogPower() {
	await query(`UPDATE novels n SET n.ranking = ${LOGPOWER_FORMULA}
		WHERE n.deleted = 0 AND n.is_personal = 0 AND n.is_banned = 0`);
}

// 单榜单专区快照：同日重跑先删后插
async function snapshotBoard(board, zone) {
	const rows = await query(getBoardCandidatesSql(board, zone));
	await query(
		'DELETE FROM rank_snapshot WHERE board = ? AND zone = ? AND snapshot_date = CURDATE()',
		[board, zone],
	);
	for (let i = 0; i < rows.length; i++) {
		await query(
			'INSERT INTO rank_snapshot (board, zone, novel_id, position, score, snapshot_date) VALUES (?, ?, ?, ?, ?, CURDATE())',
			[board, zone, rows[i].novel_id, i + 1, rows[i].score || 0],
		);
	}
	return rows.length;
}

async function run() {
	const { ensureRankBadgeSchema } = require('./rankBadgeSchema');
	const {
		collectFeatures,
		collectHistory,
		buildBadges,
		dayString,
		rules,
	} = require('./rankBadges');
	await ensureRankBadgeSchema();
	await refreshLogPower();
	const now = new Date();
	const date = new Date(now.getTime() + 8 * 3600000)
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');
	const day = dayString(now),
		groups = [],
		counts = {};
	for (const board of BOARDS)
		for (const zone of Object.keys(ZONES)) {
			const items = await query(getLiveBoardSql(board, zone, 0, RANK_LIMIT));
			groups.push({
				board,
				zone,
				items: items.map((item, index) => ({ ...item, position: index + 1 })),
			});
			counts[`${board}:${zone}`] = items.length;
		}
	const ids = [
		...new Set(groups.flatMap(group => group.items.map(item => item.novel_id))),
	];
	const features = await collectFeatures(ids, date),
		history = await collectHistory(ids, date);
	const batchId = await withTransaction(async trx => {
		const result = await trx(
			`INSERT INTO rank_batch(snapshot_date,generated_at,rule_version,status,expires_at)
		 VALUES(?,?,?,'building',DATE_ADD(?,INTERVAL 7 DAY))`,
			[day, date, rules.version, date],
		);
		const batch = result.insertId;
		for (const { board, zone, items } of groups) {
			await trx(
				'DELETE FROM rank_snapshot WHERE board=? AND zone=? AND snapshot_date=?',
				[board, zone, day],
			);
			for (const item of items) {
				const key = `${board}:${zone}:${item.novel_id}`;
				const h = history.get(key) || {
					firstSeenAt: date,
					firstSeenKnown: true,
				};
				const badges = buildBadges(item, features.get(item.novel_id), h, now);
				await trx(
					`INSERT IGNORE INTO rank_entry_history(board,zone,novel_id,first_seen_at,first_seen_known) VALUES(?,?,?,?,1)`,
					[board, zone, item.novel_id, date],
				);
				await trx(
					'INSERT INTO rank_snapshot(board,zone,novel_id,position,score,snapshot_date) VALUES(?,?,?,?,?,?)',
					[board, zone, item.novel_id, item.position, item.score || 0, day],
				);
				await trx(
					`INSERT INTO rank_badge_snapshot(batch_id,board,zone,novel_id,position,score,item_json,badges_json) VALUES(?,?,?,?,?,?,?,?)`,
					[
						batch,
						board,
						zone,
						item.novel_id,
						item.position,
						item.score || 0,
						JSON.stringify(item),
						JSON.stringify(badges),
					],
				);
			}
		}
		await trx("UPDATE rank_batch SET status='complete' WHERE batch_id=?", [
			batch,
		]);
		return batch;
	}, 'rank-badges');
	// Daily rank_snapshot / entry history are retained. Only expired hourly presentation data is removed.
	await query(
		`DELETE s FROM rank_badge_snapshot s JOIN rank_batch b ON b.batch_id=s.batch_id WHERE b.expires_at<CURRENT_TIMESTAMP`,
	);
	console.log('榜单与标签批次发布完成:', batchId, JSON.stringify(counts));
	return counts;
}

module.exports = {
	BOARDS,
	ZONES,
	RANK_LIMIT,
	LOGPOWER_FORMULA,
	getBoardCandidatesSql,
	getLiveBoardSql,
	refreshLogPower,
	snapshotBoard,
	run,
};
