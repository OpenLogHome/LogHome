// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let sysLog = require('../bin/log.js');
let statistics = require('../bin/statistics.js');
const { PUBLIC_ARTICLE } = require('../bin/readingVisibility.js');
const { findReaderParagraph } = require('../bin/readerParagraphs.js');
const { registerReaderExcerpts } = require('../bin/readerExcerpts.js');

// 创建路由对象
let router = express.Router();

function toYMD(dateLike) {
	if (!dateLike) return null;
	if (typeof dateLike === 'string') return dateLike.slice(0, 10);
	try {
		return new Date(dateLike).toISOString().slice(0, 10);
	} catch (e) {
		return null;
	}
}

function addDaysYMD(ymd, days) {
	const d = new Date(ymd + 'T00:00:00');
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}

function ymdOf(date) {
	return (
		date.getFullYear() +
		'-' +
		(date.getMonth() > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
		'-' +
		(date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
	);
}

function clampDaysParam(raw, fallback, max) {
	let days = parseInt(raw, 10);
	if (!Number.isFinite(days) || days <= 0) days = fallback;
	if (days > max) days = max;
	return days;
}

// 实时统计某部作品的累计数据，口径与每日快照任务一致，
// 用于在快照（每日 3 点写入昨日数据）之外提供当天实时的数据。
async function getLiveNovelStats(novelId) {
	const rows = await query(
		`SELECT n.clicks,
			(SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id) nices,
			(SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id) likes,
			(SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id) comments,
			(SELECT IFNULL(SUM(item_amount*item_cost),0) FROM tipping WHERE novel_id = n.novel_id) tippings
		 FROM novels n WHERE n.novel_id = ? AND n.deleted = 0 AND n.is_personal = 0`,
		[novelId],
	);
	return rows && rows[0] ? rows[0] : null;
}

// 组装一条以今天为 statistic_date 的实时数据行
async function buildLiveStatRow(novelId) {
	const live = await getLiveNovelStats(novelId);
	if (!live) return null;
	return {
		novel_id: Number(novelId),
		statistic_date: ymdOf(new Date()) + ' 00:00:00',
		clicks: Number(live.clicks) || 0,
		nices: Number(live.nices) || 0,
		likes: Number(live.likes) || 0,
		comments: Number(live.comments) || 0,
		tippings: Number(live.tippings) || 0,
	};
}

async function attachNovelShareCounts(statRows, novelId) {
	if (!Array.isArray(statRows) || statRows.length === 0) return statRows;
	if (novelId === undefined || novelId === null) return statRows;

	const days = statRows
		.map((r) => toYMD(r && r.statistic_date))
		.filter(Boolean);
	if (days.length === 0) return statRows;

	const minDay = days.reduce((a, b) => (a < b ? a : b));
	const maxDay = days.reduce((a, b) => (a > b ? a : b));
	const endExclusive = addDaysYMD(maxDay, 1);
	const targetUrlLike = `/pages/readers/bookInfo?id=${novelId}%`;

	const baseRows = await query(
		`SELECT COUNT(*) AS share_count
		 FROM share_codes
		 WHERE share_type = 'book'
		   AND target_url LIKE ?
		   AND created_at < ?`,
		[targetUrlLike, minDay + ' 00:00:00'],
	);
	const baseCount =
		baseRows && baseRows[0] ? Number(baseRows[0].share_count) || 0 : 0;

	const shareRows = await query(
		`SELECT DATE(created_at) AS day, COUNT(*) AS share_count
		 FROM share_codes
		 WHERE share_type = 'book'
		   AND target_url LIKE ?
		   AND created_at >= ?
		   AND created_at < ?
		 GROUP BY DATE(created_at)
		 ORDER BY day ASC`,
		[targetUrlLike, minDay + ' 00:00:00', endExclusive + ' 00:00:00'],
	);

	const perDay = new Map();
	for (const row of shareRows) {
		const day = toYMD(row && row.day);
		if (!day) continue;
		perDay.set(day, Number(row.share_count) || 0);
	}

	const uniqueDaysSorted = Array.from(new Set(days)).sort();
	let running = baseCount;
	const cumulative = new Map();
	for (const day of uniqueDaysSorted) {
		running += perDay.get(day) || 0;
		cumulative.set(day, running);
	}

	for (const row of statRows) {
		const day = toYMD(row && row.statistic_date);
		row.shares = cumulative.get(day) || 0;
	}

	return statRows;
}

router.get('/get_article_novel_id', async function (req, res) {
	try {
		let results = await query(
			`SELECT a.novel_id FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.query.id],
		);
		if (results.length > 0) res.end(JSON.stringify(results));
		else res.json(400, { msg: 'bad request' });
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article_info', async function (req, res) {
	try {
		let results = await query(
			`SELECT a.article_id, a.article_type, a.title, a.novel_id, a.article_chapter, a.is_draft, a.deleted, a.update_time, a.text_count FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.query.id],
		);
		if (results.length > 0) res.end(JSON.stringify(results));
		else res.json(400, { msg: 'bad request' });
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article', async function (req, res) {
	try {
		let results = await query(
			`SELECT a.* FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.query.id],
		);
		if (!results.length) return res.status(404).json({ msg: '作品或章节不可阅读' });
		if (req.query.isCaching == undefined || req.query.isCaching == 'false') {
			await statistics.novel_clicked(
				JSON.parse(JSON.stringify(results))[0].novel_id,
				req.query.id,
				req.ip,
			);
			sysLog('READ_ARTICLE', '-1', req.ip, req.query.id);
		}
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/novel_clicked', async function (req, res) {
	try {
		let results = await query(
			`SELECT a.novel_id FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.query.id],
		);
		if (!results.length) return res.status(404).json({ msg: '作品或章节不可阅读' });
		await statistics.novel_clicked(
			JSON.parse(JSON.stringify(results))[0].novel_id,
			req.query.id,
			req.ip,
		);
		sysLog('READ_ARTICLE', '-1', req.ip, req.query.id);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

registerReaderExcerpts(router, { auth, query });

router.post('/remove_article_cento', auth, async function (req, res) {
	try {
		await query(
			'UPDATE article_cento SET is_delete = 1 WHERE article_cento_id = ? AND user_id = ?',
			[req.body.article_cento_id, req.user[0].user_id],
		);
		res.end('success');
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/get_paragraph_comment_amount', async function(req, res){
	try{
		let result = await query(`SELECT COUNT(*) count FROM novel_comments n, article_cento c WHERE n.cento_id != 0
        AND n.deleted = 0 AND n.cento_id = c.article_cento_id AND c.paragraph_id = ? AND c.article_id = ?`, [
			req.body.paragraph_id, req.body.article_id,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/get_paragraph_comment_amounts', async function(req, res){
	try{
		let articleId = Number(req.body.article_id);
		let paragraphIds = Array.isArray(req.body.paragraph_ids)
			? Array.from(new Set(req.body.paragraph_ids
				.map((item) => Number(item))
				.filter((item) => Number.isInteger(item) && item > 0)))
			: [];
		if (!Number.isInteger(articleId) || articleId <= 0 || paragraphIds.length == 0) {
			res.end(JSON.stringify([]));
			return;
		}
		let result = await query(`SELECT c.paragraph_id, COUNT(*) count
			FROM novel_comments n
			INNER JOIN article_cento c ON n.cento_id = c.article_cento_id
			WHERE n.cento_id != 0
			  AND n.deleted = 0
			  AND c.article_id = ?
			  AND c.paragraph_id IN (?)
			GROUP BY c.paragraph_id`, [
			articleId,
			paragraphIds,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_article_comment_amount', async function(req, res){
	try{
		let result = await query('SELECT COUNT(*) count FROM novel_comments WHERE article_id = ?', [
			req.query.article_id,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


router.get('/get_novel_statistics', async function (req, res) {
	try {
		let time = new Date().getTime();
		let today = new Date(time);
		let yesterday = new Date(time - 24 * 60 * 60 * 1000);
		today = ymdOf(today);
		yesterday = ymdOf(yesterday);
		let results_yesterday = await query(
			'SELECT * FROM novel_statistics WHERE novel_id = ? AND statistic_date = ?',
			[req.query.novel_id, yesterday + ' 00:00:00'],
		);

		// 今天的数据实时计算，不再等待凌晨快照
		let results = [];
		const liveRow = await buildLiveStatRow(req.query.novel_id);
		if (liveRow) results.push(liveRow);
		results = results.concat(results_yesterday);
		await attachNovelShareCounts(results, req.query.novel_id);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_novel_specific_statistics', async function (req, res) {
	try {
		// days: 需要返回的天数（含今天的实时数据），默认 30，最大 365
		const days = clampDaysParam(req.query.days, 30, 365);
		let time = new Date().getTime();
		let startDay = new Date(time - 24 * 60 * 60 * 1000 * days);
		const startStr = ymdOf(startDay);
		const todayStr = ymdOf(new Date(time));

		let results = await query(
			'SELECT * FROM novel_statistics WHERE novel_id = ? AND statistic_date >= ? AND statistic_date <= ? ORDER BY statistic_date ASC',
			[req.query.novel_id, startStr + ' 00:00:00', todayStr + ' 00:00:00'],
		);

		// 今天的数据实时计算，不再等待凌晨快照
		const liveRow = await buildLiveStatRow(req.query.novel_id);
		if (liveRow) results.push(liveRow);
		results.sort((a, b) =>
			String(a.statistic_date).localeCompare(String(b.statistic_date)),
		);
		await attachNovelShareCounts(results, req.query.novel_id);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 作品近期的章节发布/更新事件，供数据趋势页对照「更新后数据变化」
router.get('/get_novel_article_events', async function (req, res) {
	try {
		const days = clampDaysParam(req.query.days, 90, 365);
		let time = new Date().getTime();
		const startStr = ymdOf(new Date(time - 24 * 60 * 60 * 1000 * days));
		const events = await query(
			`SELECT a.article_id, a.article_chapter, a.title, a.update_time
			 FROM articles a JOIN novels n ON n.novel_id = a.novel_id
			 WHERE a.novel_id = ? AND ${PUBLIC_ARTICLE} AND a.update_time >= ?
			 ORDER BY a.update_time DESC
			 LIMIT 30`,
			[req.query.novel_id, startStr + ' 00:00:00'],
		);
		res.end(JSON.stringify(events));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 作品数据盒 · 扩展聚合接口：一次返回原木力透视、转化漏斗、写作数据、
// 章节阅读、打赏榜、读者画像、站外来源、成就里程碑
router.get('/get_novel_data_overview', async function (req, res) {
	try {
		const novelId = req.query.novel_id;
		const live = await getLiveNovelStats(novelId);
		const overview = {};

		// ---- 原木力：当前值 + 权重构成（与 bin/statistics.js 的公式口径一致）----
		let ranking = 0;
		let novelName = '';
		const novelRows = await query(
			'SELECT ranking, name FROM novels WHERE novel_id = ?',
			[novelId],
		);
		if (novelRows && novelRows[0]) {
			ranking = Number(novelRows[0].ranking) || 0;
			novelName = novelRows[0].name || '';
		}
		overview.novelName = novelName;
		const clicks = live ? Number(live.clicks) || 0 : 0;
		const nices = live ? Number(live.nices) || 0 : 0;
		const likes = live ? Number(live.likes) || 0 : 0;
		const comments = live ? Number(live.comments) || 0 : 0;
		const tippings = live ? Number(live.tippings) || 0 : 0;
		overview.logpower = {
			value: ranking,
			composition: [
				{ key: 'clicks', label: '阅读', weight: 8, value: clicks * 8 },
				{ key: 'nices', label: '点赞', weight: 12, value: nices * 12 },
				{ key: 'bookcase', label: '收藏', weight: 200, value: likes * 200 },
				{ key: 'comments', label: '评论', weight: 20, value: comments * 20 },
				{ key: 'tips', label: '打赏', weight: 10, value: tippings * 10 },
			],
		};

		// 原木力历史：近 14 天快照（新表从上线起积累，早期可能只有今天的实时点）
		let powerHistory = [];
		try {
			powerHistory = await query(
				`SELECT statistic_date, ranking FROM novel_logpower_daily
				 WHERE novel_id = ? AND statistic_date >= ?
				 ORDER BY statistic_date ASC`,
				[novelId, ymdOf(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) + ' 00:00:00'],
			);
			powerHistory = powerHistory.map((h) => ({
				date: String(h.statistic_date || '').slice(5, 10),
				value: Number(h.ranking) || 0,
			}));
			const todayLabel = ymdOf(new Date()).slice(5, 10);
			if (!powerHistory.length || powerHistory[powerHistory.length - 1].date !== todayLabel) {
				powerHistory.push({ date: todayLabel, value: ranking });
			}
		} catch (e) {
			powerHistory = [];
		}
		overview.logpower.history = powerHistory;

		// ---- 转化漏斗：以累计阅读为基数 ----
		overview.funnel = {
			likeRate: clicks > 0 ? Number((nices / clicks).toFixed(4)) : 0,
			favRate: clicks > 0 ? Number((likes / clicks).toFixed(4)) : 0,
			commentRate: clicks > 0 ? Number((comments / clicks).toFixed(4)) : 0,
		};

		// 全站基准：以阅读量 >= 100 的公开作品的平均转化率作为对照
		try {
			const benchRows = await query(
				`SELECT AVG(nices / clicks) like_rate,
					AVG(likes / clicks) fav_rate,
					AVG(comments / clicks) comment_rate,
					COUNT(*) sample
				 FROM novels
				 WHERE deleted = 0 AND is_personal = 0 AND clicks >= 100`,
			);
			if (benchRows && benchRows[0]) {
				const b = benchRows[0];
				overview.funnel.benchmark = {
					likeRate: Number(Number(b.like_rate).toFixed(4)) || 0,
					favRate: Number(Number(b.fav_rate).toFixed(4)) || 0,
					commentRate: Number(Number(b.comment_rate).toFixed(4)) || 0,
					sampleSize: Number(b.sample) || 0,
				};
			}
		} catch (e) {
			// 基准查询失败不影响主数据
		}

		// 同类对比：与同体量（按总字数分档）的公开作品比转化率分位数
		try {
			const wordRows = await query(
				'SELECT IFNULL(SUM(text_count),0) w FROM articles WHERE novel_id = ? AND deleted = 0 AND is_draft = 0',
				[novelId],
			);
			const totalWords = wordRows && wordRows[0] ? Number(wordRows[0].w) || 0 : 0;
			const bucket = totalWords < 50000 ? 'lt50k' : totalWords <= 200000 ? 'mid' : 'gt200k';
			// 快照表由每晚任务维护；若尚未建表或为空则当场重建，保证功能上线即用
			await query(
				`CREATE TABLE IF NOT EXISTS novel_rate_snapshot (
					novel_id INT NOT NULL,
					bucket VARCHAR(16) NOT NULL,
					like_rate DOUBLE DEFAULT 0,
					fav_rate DOUBLE DEFAULT 0,
					comment_rate DOUBLE DEFAULT 0,
					reads_30d INT DEFAULT 0,
					total_words INT DEFAULT 0,
					PRIMARY KEY (novel_id),
					INDEX idx_nrs_bucket (bucket)
				)`,
			);
			const snapCount = await query('SELECT COUNT(*) c FROM novel_rate_snapshot');
			if (!snapCount.length || Number(snapCount[0].c) === 0) {
				await rebuildNovelRateSnapshot();
			}
			const snapRows = await query(
				`SELECT like_rate, fav_rate, comment_rate
				 FROM novel_rate_snapshot
				 WHERE bucket = ? AND reads_30d >= 100`,
				[bucket],
			);
			const pctOf = (rows, field, selfValue) => {
				if (!rows.length) return null;
				const values = rows.map((r) => Number(r[field]) || 0);
				const below = values.filter((v) => v < selfValue).length;
				return Math.round((below / values.length) * 100);
			};
			const likeRate = clicks > 0 ? Number((nices / clicks).toFixed(4)) : 0;
			const favRate = clicks > 0 ? Number((likes / clicks).toFixed(4)) : 0;
			const commentRate = clicks > 0 ? Number((comments / clicks).toFixed(4)) : 0;
			overview.funnel.percentile = {
				sampleSize: snapRows.length,
				likeRate: pctOf(snapRows, 'like_rate', likeRate),
				favRate: pctOf(snapRows, 'fav_rate', favRate),
				commentRate: pctOf(snapRows, 'comment_rate', commentRate),
			};
		} catch (e) {
			// 同类对比失败不影响主数据
		}

		// ---- 打赏榜：粉丝累计打赏金额前五 ----
		let supporters = [];
		try {
			supporters = await query(
				`SELECT t.from_id user_id, u.name, u.avatar_url,
					SUM(t.item_amount * t.item_cost) fans_value
				 FROM tipping t
				 JOIN open_users u ON u.user_id = t.from_id
				 WHERE t.novel_id = ?
				 GROUP BY t.from_id, u.name, u.avatar_url
				 ORDER BY fans_value DESC
				 LIMIT 5`,
				[novelId],
			);
			supporters = supporters.map((s) => ({
				user_id: s.user_id,
				name: s.name,
				avatar_url: s.avatar_url,
				value: Number(s.fans_value) || 0,
			}));
		} catch (e) {
			supporters = [];
		}
		overview.topSupporters = supporters;

		// ---- 写作数据 ----
		let writing = {
			chapter_count: 0,
			total_words: 0,
			words_30: 0,
			update_days_30: 0,
			first_update: null,
			serial_days: 0,
			avg_daily_words: 0,
		};
		try {
			const startStr = ymdOf(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
			const wRows = await query(
				`SELECT COUNT(*) chapter_count,
					IFNULL(SUM(text_count), 0) total_words,
					IFNULL(SUM(CASE WHEN update_time >= ? THEN text_count ELSE 0 END), 0) words_30,
					COUNT(DISTINCT CASE WHEN update_time >= ? THEN DATE(update_time) END) update_days_30,
					MIN(update_time) first_update
				 FROM articles
				 WHERE novel_id = ? AND deleted = 0 AND is_draft = 0`,
				[startStr + ' 00:00:00', startStr + ' 00:00:00', novelId],
			);
			if (wRows && wRows[0]) {
				const w = wRows[0];
				writing.chapter_count = Number(w.chapter_count) || 0;
				writing.total_words = Number(w.total_words) || 0;
				writing.words_30 = Number(w.words_30) || 0;
				writing.update_days_30 = Number(w.update_days_30) || 0;
				writing.first_update = w.first_update || null;
				if (writing.first_update) {
					const days =
						Math.floor(
							(Date.now() - new Date(writing.first_update).getTime()) /
								(24 * 60 * 60 * 1000),
						) + 1;
					writing.serial_days = days > 0 ? days : 0;
					writing.avg_daily_words =
						writing.serial_days > 0
							? Math.round(writing.total_words / writing.serial_days)
							: 0;
				}
			}
		} catch (e) {
			// 保持默认值
		}
		overview.writing = writing;

		// ---- 章节阅读：近30天各章节阅读次数（聚合表 + 今日实时日志）----
		let chapters = [];
		try {
			const startStr = ymdOf(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
			const todayStr = ymdOf(new Date());
			chapters = await query(
				`SELECT a.article_id, a.article_chapter, a.title,
					IFNULL(s.reads, 0) + IFNULL(live.cnt, 0) reads
				 FROM articles a
				 LEFT JOIN (
					SELECT article_id, SUM(reads) reads
					FROM novel_chapter_reads_daily
					WHERE statistic_date >= ?
					GROUP BY article_id
				 ) s ON s.article_id = a.article_id
				 LEFT JOIN (
					SELECT CAST(content AS UNSIGNED) article_id, COUNT(*) cnt
					FROM \`log\`
					WHERE operation = 'READ_ARTICLE'
					  AND content REGEXP '^[0-9]+$'
					  AND time >= ?
					GROUP BY CAST(content AS UNSIGNED)
				 ) live ON live.article_id = a.article_id
				 WHERE a.novel_id = ? AND a.deleted = 0 AND a.is_draft = 0
				 ORDER BY a.article_chapter ASC`,
				[startStr + ' 00:00:00', todayStr + ' 00:00:00', novelId],
			);

			// 阅读深度：每章打开人数与读完（进度 >= 80%）人数
			let depthRows = [];
			try {
				depthRows = await query(
					`SELECT p.article_id,
						COUNT(DISTINCT p.user_id) opened,
						COUNT(DISTINCT CASE WHEN p.progress >= 0.8 THEN p.user_id END) completed
					 FROM article_reading_progress p
					 JOIN articles a ON a.article_id = p.article_id
					 WHERE a.novel_id = ? AND a.deleted = 0
					 GROUP BY p.article_id`,
					[novelId],
				);
			} catch (e) {
				depthRows = [];
			}
			const depthMap = new Map();
			for (const d of depthRows) depthMap.set(d.article_id, d);

			chapters = chapters.map((c) => {
				const row = {
					article_id: c.article_id,
					chapter: c.article_chapter,
					title: c.title,
					reads: Number(c.reads) || 0,
				};
				const depth = depthMap.get(c.article_id);
				if (depth && Number(depth.opened) > 0) {
					row.opened = Number(depth.opened) || 0;
					row.completed = Number(depth.completed) || 0;
					row.completionRate = Number(
						((Number(depth.completed) || 0) / Number(depth.opened)).toFixed(4),
					);
				}
				return row;
			});
		} catch (e) {
			chapters = [];
		}
		overview.chapters = chapters;

		// ---- 数据来源：站外分享总量与近30天 + 站内入口分布 ----
		let sources = { externalTotal: 0, external30d: 0, internal: [] };
		try {
			const targetUrlLike = `/pages/readers/bookInfo?id=${novelId}%`;
			const startStr = ymdOf(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
			const totalRows = await query(
				`SELECT COUNT(*) count FROM share_codes
				 WHERE share_type = 'book' AND target_url LIKE ?`,
				[targetUrlLike],
			);
			const recentRows = await query(
				`SELECT COUNT(*) count FROM share_codes
				 WHERE share_type = 'book' AND target_url LIKE ? AND created_at >= ?`,
				[targetUrlLike, startStr + ' 00:00:00'],
			);
			sources.externalTotal =
				(totalRows && totalRows[0] ? Number(totalRows[0].count) : 0) || 0;
			sources.external30d =
				(recentRows && recentRows[0] ? Number(recentRows[0].count) : 0) || 0;

			let internalRows = [];
			try {
				internalRows = await query(
					`SELECT source, SUM(count) total,
						SUM(CASE WHEN statistic_date >= ? THEN count ELSE 0 END) recent
					 FROM book_source_stats
					 WHERE novel_id = ?
					 GROUP BY source
					 ORDER BY total DESC`,
					[startStr + ' 00:00:00', novelId],
				);
			} catch (e) {
				internalRows = [];
			}
			sources.internal = internalRows.map((r) => ({
				source: r.source,
				total: Number(r.total) || 0,
				recent: Number(r.recent) || 0,
			}));
		} catch (e) {
			// 保持默认值
		}
		overview.sources = sources;

		// ---- 读者画像：收藏过本作品的人也收藏 ----
		let audience = [];
		try {
			audience = await query(
				`SELECT n2.novel_id, n2.name, n2.picUrl, COUNT(*) cnt
				 FROM bookcase b1
				 JOIN bookcase b2 ON b2.user_id = b1.user_id AND b2.novel_id <> ?
				 JOIN novels n2 ON n2.novel_id = b2.novel_id
				 WHERE b1.novel_id = ? AND n2.deleted = 0 AND n2.is_personal = 0
				 GROUP BY n2.novel_id, n2.name, n2.picUrl
				 ORDER BY cnt DESC
				 LIMIT 5`,
				[novelId, novelId],
			);
			audience = audience.map((a) => ({
				novel_id: a.novel_id,
				name: a.name,
				picUrl: a.picUrl,
				count: Number(a.cnt) || 0,
			}));
		} catch (e) {
			audience = [];
		}
		overview.audience = audience;

		// ---- 成就里程碑：已达成阈值 ----
		const thresholds = [
			{ type: 'fav', values: [100, 500, 1000, 5000, 10000], current: likes },
			{ type: 'read', values: [10000, 50000, 100000, 500000, 1000000], current: clicks },
			{ type: 'like', values: [100, 500, 1000, 5000], current: nices },
			{ type: 'comment', values: [100, 500, 1000], current: comments },
			{ type: 'tip', values: [100, 500, 1000, 5000], current: tippings },
		];
		const reached = [];
		for (const t of thresholds) {
			for (const v of t.values) {
				if (t.current >= v) reached.push({ type: t.type, value: v });
			}
		}
		overview.milestones = reached;

		res.end(JSON.stringify(overview));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

let schedule = require('node-schedule');

// 重建同类对比快照表：全站公开作品的转化率、近30天阅读、总字数（按字数分档）
async function rebuildNovelRateSnapshot() {
	try {
		await query(
			`CREATE TABLE IF NOT EXISTS novel_rate_snapshot (
				novel_id INT NOT NULL,
				bucket VARCHAR(16) NOT NULL,
				like_rate DOUBLE DEFAULT 0,
				fav_rate DOUBLE DEFAULT 0,
				comment_rate DOUBLE DEFAULT 0,
				reads_30d INT DEFAULT 0,
				total_words INT DEFAULT 0,
				PRIMARY KEY (novel_id),
				INDEX idx_nrs_bucket (bucket)
			)`,
		);
		const yesterday = ymdOf(new Date(Date.now() - 24 * 60 * 60 * 1000));
		const rows = await query(
			`SELECT n.novel_id, n.clicks,
				(SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id) nices,
				(SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id) likes,
				(SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id) comments,
				IFNULL((SELECT SUM(text_count) FROM articles WHERE novel_id = n.novel_id AND deleted = 0 AND is_draft = 0), 0) total_words
			 FROM novels n
			 WHERE n.deleted = 0 AND n.is_personal = 0`,
		);
		// 30 天阅读增量：昨天快照 - 31 天前快照
		const recentRows = await query(
			`SELECT s.novel_id,
				MAX(CASE WHEN s.statistic_date = ? THEN s.clicks END) cur,
				MAX(CASE WHEN s.statistic_date = ? THEN s.clicks END) prev
			 FROM novel_statistics s
			 GROUP BY s.novel_id`,
			[yesterday + ' 00:00:00', ymdOf(new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)) + ' 00:00:00'],
		);
		const recentMap = new Map();
		for (const r of recentRows) {
			const cur = Number(r.cur) || 0;
			const prev = Number(r.prev) || 0;
			recentMap.set(r.novel_id, Math.max(0, cur - prev));
		}
		for (const n of rows) {
			const clicks = Number(n.clicks) || 0;
			const nices = Number(n.nices) || 0;
			const likes = Number(n.likes) || 0;
			const comments = Number(n.comments) || 0;
			const totalWords = Number(n.total_words) || 0;
			const bucket = totalWords < 50000 ? 'lt50k' : totalWords <= 200000 ? 'mid' : 'gt200k';
			const likeRate = clicks > 0 ? nices / clicks : 0;
			const favRate = clicks > 0 ? likes / clicks : 0;
			const commentRate = clicks > 0 ? comments / clicks : 0;
			const reads30d = recentMap.get(n.novel_id) || 0;
			await query(
				`INSERT INTO novel_rate_snapshot
					(novel_id, bucket, like_rate, fav_rate, comment_rate, reads_30d, total_words)
				 VALUES (?, ?, ?, ?, ?, ?, ?)
				 ON DUPLICATE KEY UPDATE
				   bucket = VALUES(bucket), like_rate = VALUES(like_rate),
				   fav_rate = VALUES(fav_rate), comment_rate = VALUES(comment_rate),
				   reads_30d = VALUES(reads_30d), total_words = VALUES(total_words)`,
				[n.novel_id, bucket, likeRate, favRate, commentRate, reads30d, totalWords],
			);
		}
	} catch (e) {
		console.log('[novel_rate_snapshot]', e);
	}
}

async function novelStatistics() {
	try {
		let time = new Date().getTime() - 24 * 60 * 60 * 1000;
		let yesterday = new Date(time);
		yesterday =
			yesterday.getFullYear() +
			'-' +
			(yesterday.getMonth() > 9
				? yesterday.getMonth() + 1
				: '0' + (yesterday.getMonth() + 1)) +
			'-' +
			(yesterday.getDate() > 9
				? yesterday.getDate()
				: '0' + yesterday.getDate());
		await query(
			`INSERT INTO novel_statistics(novel_id,statistic_date,clicks,nices,likes,comments,tippings) 
                    SELECT novel_id,?,clicks,(SELECT COUNT(*) FROM novel_nice WHERE novel_id = n.novel_id) nices,
                    (SELECT COUNT(*) FROM bookcase WHERE novel_id = n.novel_id) likes,
                    (SELECT COUNT(*) FROM novel_comments WHERE novel_id = n.novel_id) comments,
                    (SELECT IFNULL(SUM(item_amount*item_cost),0) FROM tipping WHERE novel_id = n.novel_id) tippings FROM novels n WHERE deleted = 0 AND is_personal = 0`,
			[yesterday + ' 00:00:00'],
		);

		// 原木力历史：每晚把当天的 ranking 快照写入 novel_logpower_daily，供「原木力透视」展示
		await query(
			`CREATE TABLE IF NOT EXISTS novel_logpower_daily (
				novel_id INT NOT NULL,
				statistic_date DATETIME NOT NULL,
				ranking DOUBLE DEFAULT 0,
				PRIMARY KEY (novel_id, statistic_date)
			)`,
		);
		await query(
			`INSERT INTO novel_logpower_daily (novel_id, statistic_date, ranking)
			 SELECT novel_id, ?, IFNULL(ranking, 0) FROM novels
			 WHERE deleted = 0 AND is_personal = 0
			 ON DUPLICATE KEY UPDATE ranking = VALUES(ranking)`,
			[yesterday + ' 00:00:00'],
		);

		// 同类对比快照：每晚重建全站公开作品的转化率/30天阅读/总字数，
		// 供「同类对比基准」按字数分档计算分位数
		await rebuildNovelRateSnapshot();

		// 章节阅读聚合：把 READ_ARTICLE 日志按天聚合成章节阅读表，供章节漏斗/留存查询
		await query(
			`CREATE TABLE IF NOT EXISTS novel_chapter_reads_daily (
				article_id INT NOT NULL,
				statistic_date DATETIME NOT NULL,
				reads INT DEFAULT 0,
				PRIMARY KEY (article_id, statistic_date),
				INDEX idx_ncrd_date (statistic_date)
			)`,
		);
		// 首次运行（或表为空）时回填近 30 天日志，保证切换后立即可用
		try {
			const emptyCheck = await query(
				'SELECT COUNT(*) c FROM novel_chapter_reads_daily',
			);
			if (!emptyCheck.length || Number(emptyCheck[0].c) === 0) {
				const backfillStart = ymdOf(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
				const todayStr = ymdOf(new Date());
				await query(
					`INSERT IGNORE INTO novel_chapter_reads_daily (article_id, statistic_date, reads)
					 SELECT CAST(content AS UNSIGNED), DATE(time), COUNT(*)
					 FROM \`log\`
					 WHERE operation = 'READ_ARTICLE'
					   AND content REGEXP '^[0-9]+$'
					   AND time >= ? AND time < ?
					 GROUP BY CAST(content AS UNSIGNED), DATE(time)`,
					[backfillStart + ' 00:00:00', todayStr + ' 00:00:00'],
				);
			}
		} catch (e) {
			console.log('[novel_chapter_reads_daily backfill]', e);
		}
		// 聚合昨日增量
		await query(
			`INSERT INTO novel_chapter_reads_daily (article_id, statistic_date, reads)
			 SELECT CAST(content AS UNSIGNED), ?, COUNT(*)
			 FROM \`log\`
			 WHERE operation = 'READ_ARTICLE'
			   AND content REGEXP '^[0-9]+$'
			   AND time >= ? AND time < ?
			 GROUP BY CAST(content AS UNSIGNED)
			 ON DUPLICATE KEY UPDATE reads = VALUES(reads)`,
			[yesterday + ' 00:00:00', yesterday + ' 00:00:00', ymdOf(new Date()) + ' 00:00:00'],
		);
	} catch (e) {
		console.log(e);
	}
}

//每晚凌晨三点的小说数据统计功能,记录全站小说数据情况
schedule.scheduleJob('0 0 3 * * *', novelStatistics);

// ---------- 数据周报：每周一早 9 点推送上周数据摘要 + 数据洞察 ----------
function ymdOffset(offsetDays) {
	return ymdOf(new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000));
}

function formatReportNumber(value) {
	const n = Number(value) || 0;
	if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
	return String(n);
}

async function weeklyNovelReport() {
	try {
		const message = require('../bin/message.js');
		const s1 = ymdOffset(-1); // 昨日快照（上周最后一天）
		const s8 = ymdOffset(-8); // 上周起点前一日
		const s15 = ymdOffset(-15); // 上上周起点前一日

		const rows = await query(
			`SELECT n.novel_id, n.name, n.author_id,
				s1.clicks c1, s1.nices n1, s1.likes l1, s1.comments m1, s1.tippings t1,
				s8.clicks c8, s8.nices n8, s8.likes l8, s8.comments m8, s8.tippings t8,
				s15.clicks c15, s15.nices n15, s15.likes l15, s15.comments m15, s15.tippings t15
			 FROM novels n
			 LEFT JOIN novel_statistics s1 ON s1.novel_id = n.novel_id AND s1.statistic_date = ?
			 LEFT JOIN novel_statistics s8 ON s8.novel_id = n.novel_id AND s8.statistic_date = ?
			 LEFT JOIN novel_statistics s15 ON s15.novel_id = n.novel_id AND s15.statistic_date = ?
			 WHERE n.deleted = 0 AND n.is_personal = 0`,
			[s1 + ' 00:00:00', s8 + ' 00:00:00', s15 + ' 00:00:00'],
		);

		// 每日点击序列（用于找最佳单日）
		const dailyRows = await query(
			`SELECT novel_id, statistic_date, clicks FROM novel_statistics
			 WHERE statistic_date >= ? AND statistic_date <= ?
			 ORDER BY statistic_date ASC`,
			[s8 + ' 00:00:00', s1 + ' 00:00:00'],
		);
		const dailyByNovel = new Map();
		for (const r of dailyRows) {
			if (!dailyByNovel.has(r.novel_id)) dailyByNovel.set(r.novel_id, []);
			dailyByNovel.get(r.novel_id).push(r);
		}

		// 上周更新事件（用于洞察「更新带动增长」）
		const updateRows = await query(
			`SELECT novel_id, DATE(time) d FROM novel_updates
			 WHERE time >= ? AND time <= ?`,
			[s8 + ' 00:00:00', s1 + ' 23:59:59'],
		);
		const updatesByNovel = new Map();
		for (const r of updateRows) {
			if (!updatesByNovel.has(r.novel_id)) updatesByNovel.set(r.novel_id, []);
			updatesByNovel.get(r.novel_id).push(String(r.d).slice(5));
		}

		const powerDelta = (a, b) =>
			(Number(a.c1) - Number(a.c8)) * 8 +
			(Number(a.n1) - Number(a.n8)) * 12 +
			(Number(a.l1) - Number(a.l8)) * 200 +
			(Number(a.m1) - Number(a.m8)) * 20 +
			(Number(a.t1) - Number(a.t8)) * 10;

		let sent = 0;
		for (const r of rows) {
			if (!r.author_id) continue;
			const inc = {
				clicks: Math.max(0, (Number(r.c1) || 0) - (Number(r.c8) || 0)),
				nices: Math.max(0, (Number(r.n1) || 0) - (Number(r.n8) || 0)),
				likes: Math.max(0, (Number(r.l1) || 0) - (Number(r.l8) || 0)),
				comments: Math.max(0, (Number(r.m1) || 0) - (Number(r.m8) || 0)),
				tippings: Math.max(0, (Number(r.t1) || 0) - (Number(r.t8) || 0)),
			};
			const totalInc = inc.clicks + inc.nices + inc.likes + inc.comments + inc.tippings;
			if (totalInc <= 0) continue;

			// 本周内已发过则跳过（防重跑）
			const sentBefore = await query(
				`SELECT * FROM \`log\` WHERE operation = 'WEEKLY_REPORT' AND content = ?
				 AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(\`time\`) < 518400`,
				[String(r.novel_id)],
			);
			if (sentBefore.length > 0) continue;

			// 最佳单日（按阅读增量）
			let bestDay = '';
			let bestInc = 0;
			const seq = dailyByNovel.get(r.novel_id) || [];
			for (let i = 0; i < seq.length; i++) {
				const prev = i > 0 ? Number(seq[i - 1].clicks) || 0 : Number(r.c8) || 0;
				const diff = (Number(seq[i].clicks) || 0) - prev;
				if (diff > bestInc) {
					bestInc = diff;
					bestDay = String(seq[i].statistic_date).slice(5);
				}
			}

			// 环比（按原木力口径的周增量对比）
			const thisWeek = powerDelta(r);
			const lastWeek =
				(Number(r.c8) - Number(r.c15)) * 8 +
				(Number(r.n8) - Number(r.n15)) * 12 +
				(Number(r.l8) - Number(r.l15)) * 200 +
				(Number(r.m8) - Number(r.m15)) * 20 +
				(Number(r.t8) - Number(r.t15)) * 10;
			let wowText = '';
			if (lastWeek > 0) {
				const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
				wowText = pct >= 0 ? `较上周上升 ${pct}%` : `较上周下降 ${Math.abs(pct)}%`;
			} else if (thisWeek > 0) {
				wowText = '较上周从零起步';
			}

			// 洞察（基于真实数据生成，不依赖外部服务）
			const updateDays = updatesByNovel.get(r.novel_id) || [];
			let insight = '';
			let updatedNearBest = false;
			if (bestDay) {
				const bd = new Date(ymdOf(new Date()).slice(0, 4) + '-' + bestDay + 'T00:00:00');
				bd.setDate(bd.getDate() - 1);
				const prevBest = (bd.getMonth() > 8 ? bd.getMonth() + 1 : '0' + (bd.getMonth() + 1)) + '-' + (bd.getDate() > 9 ? bd.getDate() : '0' + bd.getDate());
				updatedNearBest = updateDays.some((d) => d === bestDay || d === prevBest);
			}
			if (bestDay && updatedNearBest) {
				insight = '更新当天阅读增长明显，建议保持当前更新节奏。';
			} else {
				const relGains = [
					{ name: '收藏', v: inc.likes / 200 },
					{ name: '点赞', v: inc.nices / 12 },
					{ name: '评论', v: inc.comments / 20 },
					{ name: '打赏', v: inc.tippings / 10 },
				].sort((a, b) => b.v - a.v);
				const top = relGains[0];
				if (top && top.v > 0) {
					insight = `本周${top.name}贡献最大，可以多引导读者${top.name === '收藏' ? '加入书架' : top.name === '点赞' ? '点赞' : top.name === '评论' ? '参与讨论' : '支持作品'}。`;
				} else if (thisWeek < lastWeek) {
					insight = '本周数据有所回落，恢复更新频率通常会带来回升。';
				} else {
					insight = '数据稳中有升，继续保持。';
				}
			}

			let content =
				`《${r.name}》上周数据：阅读 +${formatReportNumber(inc.clicks)}，收藏 +${formatReportNumber(inc.likes)}，` +
				`点赞 +${formatReportNumber(inc.nices)}，评论 +${formatReportNumber(inc.comments)}，打赏 +${formatReportNumber(inc.tippings)}`;
			if (wowText) content += `，${wowText}`;
			if (bestDay) content += `。最佳单日 ${bestDay.replace('-', '月')}日（阅读 +${formatReportNumber(bestInc)}）`;
			content += `。${insight}点击查看完整数据。`;

			await message.sendMsg(
				-1,
				r.author_id,
				content,
				'writers/novel_statistics?id=' + r.novel_id,
				'notification',
				true,
			);
			await query(
				'INSERT INTO log(operation,user_id,req_ip,content) VALUES(?,?,?,?)',
				['WEEKLY_REPORT', r.author_id, '0', String(r.novel_id)],
			);
			sent++;
		}
		console.log('[weeklyNovelReport] sent:', sent);
	} catch (e) {
		console.log('[weeklyNovelReport] error:', e);
	}
}

// 每周一早 9 点推送数据周报
schedule.scheduleJob('0 9 * * 1', weeklyNovelReport);

// ---------- 数据异常提醒：每天上午 10 点对比昨日阅读增量与近 7 天日均 ----------
async function novelAnomalyAlert() {
	try {
		const message = require('../bin/message.js');
		const yesterday = ymdOf(new Date(Date.now() - 24 * 60 * 60 * 1000));
		const baseStart = ymdOf(new Date(Date.now() - 9 * 24 * 60 * 60 * 1000));
		// 全站公开作品昨天与近 7 天的阅读增量
		const rows = await query(
			`SELECT n.novel_id, n.name, n.author_id,
				MAX(CASE WHEN s.statistic_date = ? THEN s.clicks END) y,
				MAX(CASE WHEN s.statistic_date = ? THEN s.clicks END) y0,
				MAX(CASE WHEN s.statistic_date = ? THEN s.clicks END) b
			 FROM novels n
			 LEFT JOIN novel_statistics s ON s.novel_id = n.novel_id
			   AND s.statistic_date IN (?, ?, ?)
			 WHERE n.deleted = 0 AND n.is_personal = 0
			 GROUP BY n.novel_id, n.name, n.author_id`,
			[
				yesterday + ' 00:00:00',
				ymdOf(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) + ' 00:00:00',
				baseStart + ' 00:00:00',
				yesterday + ' 00:00:00',
				ymdOf(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) + ' 00:00:00',
				baseStart + ' 00:00:00',
			],
		);
		let sent = 0;
		for (const r of rows) {
			const y = Number(r.y) || 0;
			const y0 = Number(r.y0) || 0;
			const b = Number(r.b) || 0;
			const yesterdayInc = Math.max(0, y - y0);
			const baselineAvg = Math.max(0, Math.round((y0 - b) / 7));
			if (baselineAvg < 20) continue; // 基数太小，波动无参考意义
			let kind = '';
			if (yesterdayInc >= baselineAvg * 2) kind = 'surge';
			else if (yesterdayInc <= baselineAvg * 0.5) kind = 'drop';
			if (!kind) continue;
			// 同作品同类型提醒每天只发一次
			const recent = await query(
				`SELECT COUNT(*) c FROM \`log\`
				 WHERE operation = 'ANOMALY_ALERT' AND content = ?
				   AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(time) < 86400`,
				[`${r.novel_id}|${kind}`],
			);
			if (recent.length && Number(recent[0].c) > 0) continue;
			const content =
				kind === 'surge'
					? `《${r.name}》昨日阅读 +${formatReportNumber(yesterdayInc)}，明显高于近 7 天日均（${formatReportNumber(baselineAvg)}），势头不错，可以趁热更新！`
					: `《${r.name}》昨日阅读 +${formatReportNumber(yesterdayInc)}，低于近 7 天日均（${formatReportNumber(baselineAvg)}），数据有所回落，更新一章或参与社区互动或许能拉回读者。`;
			await message.sendMsg(
				-1,
				r.author_id,
				content,
				'writers/novel_statistics?id=' + r.novel_id,
				'notification',
				true,
			);
			await query(
				'INSERT INTO log(operation,user_id,req_ip,content) VALUES(?,?,?,?)',
				['ANOMALY_ALERT', r.author_id, '0', `${r.novel_id}|${kind}`],
			);
			sent++;
		}
		console.log('[novelAnomalyAlert] sent:', sent);
	} catch (e) {
		console.log('[novelAnomalyAlert] error:', e);
	}
}

schedule.scheduleJob('0 10 * * *', novelAnomalyAlert);

// ---------- 作者目标：设定目标值并跟踪进度 ----------
const GOAL_TYPES = {
	daily_words: { label: '日均码字', max: 100000 },
	monthly_words: { label: '月更字数', max: 5000000 },
	clicks: { label: '累计阅读', max: 100000000 },
};

router.get('/get_author_goals', auth, async function (req, res) {
	try {
		const user = req.user[0];
		const novelId = req.query.novel_id;
		if (!novelId) return res.json({ goals: [] });
		await query(
			`CREATE TABLE IF NOT EXISTS author_goals (
				goal_id INT AUTO_INCREMENT PRIMARY KEY,
				author_id INT NOT NULL,
				novel_id INT NOT NULL,
				goal_type VARCHAR(32) NOT NULL,
				target_value INT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				UNIQUE KEY uq_author_novel_type (author_id, novel_id, goal_type),
				INDEX idx_ag_novel (novel_id)
			)`,
		);
		const rows = await query(
			'SELECT goal_type, target_value FROM author_goals WHERE author_id = ? AND novel_id = ?',
			[user.user_id, novelId],
		);
		// 当前进度（口径与数据盒一致）
		const live = await getLiveNovelStats(novelId);
		const clicks = live ? Number(live.clicks) || 0 : 0;
		const startStr = ymdOf(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
		const wRows = await query(
			`SELECT IFNULL(SUM(text_count), 0) total_words,
				IFNULL(SUM(CASE WHEN update_time >= ? THEN text_count ELSE 0 END), 0) words_30,
				COUNT(DISTINCT CASE WHEN update_time >= ? THEN DATE(update_time) END) update_days_30
			 FROM articles
			 WHERE novel_id = ? AND deleted = 0 AND is_draft = 0`,
			[startStr + ' 00:00:00', startStr + ' 00:00:00', novelId],
		);
		const w = (wRows && wRows[0]) || {};
		const totalWords = Number(w.total_words) || 0;
		const words30 = Number(w.words_30) || 0;
		const days30 = Math.max(1, Number(w.update_days_30) || 1);
		const currentMap = {
			daily_words: Math.round(words30 / days30),
			monthly_words: words30,
			clicks,
		};
		const goals = rows.map((g) => ({
			goal_type: g.goal_type,
			target_value: Number(g.target_value) || 0,
			current_value: currentMap[g.goal_type] || 0,
		}));
		res.json({ goals });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/set_author_goal', auth, async function (req, res) {
	try {
		const user = req.user[0];
		const novelId = req.body.novel_id;
		const goalType = String(req.body.goal_type || '');
		const targetValue = Number(req.body.target_value);
		if (!GOAL_TYPES[goalType]) return res.status(400).json({ msg: '不支持的目标类型' });
		if (!Number.isFinite(targetValue) || targetValue < 1 || targetValue > GOAL_TYPES[goalType].max) {
			return res.status(400).json({ msg: '目标值超出合理范围' });
		}
		const novel = await query(
			'SELECT author_id FROM novels WHERE novel_id = ? AND deleted = 0',
			[novelId],
		);
		if (!novel.length || Number(novel[0].author_id) !== Number(user.user_id)) {
			return res.status(403).json({ msg: '只有作者本人可以设置目标' });
		}
		await query(
			`INSERT INTO author_goals (author_id, novel_id, goal_type, target_value)
			 VALUES (?, ?, ?, ?)
			 ON DUPLICATE KEY UPDATE target_value = VALUES(target_value)`,
			[user.user_id, novelId, goalType, targetValue],
		);
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// ---------- 数据导出：CSV（作者本人） ----------
router.get('/export_novel_statistics', auth, async function (req, res) {
	try {
		const user = req.user[0];
		const novelId = req.query.novel_id;
		const days = clampDaysParam(req.query.days, 30, 365);
		const novel = await query(
			'SELECT author_id, name FROM novels WHERE novel_id = ? AND deleted = 0',
			[novelId],
		);
		if (!novel.length || Number(novel[0].author_id) !== Number(user.user_id)) {
			return res.status(403).json({ msg: '只有作者本人可以导出数据' });
		}
		const startStr = ymdOf(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
		const rows = await query(
			`SELECT statistic_date, clicks, nices, likes, comments, tippings
			 FROM novel_statistics
			 WHERE novel_id = ? AND statistic_date >= ?
			 ORDER BY statistic_date ASC`,
			[novelId, startStr + ' 00:00:00'],
		);
		const live = await buildLiveStatRow(novelId);
		if (live) rows.push(live);
		const head =
			'日期,累计阅读,阅读增量,累计点赞,点赞增量,累计收藏,收藏增量,累计评论,评论增量,累计打赏,打赏增量';
		const lines = [head];
		for (let i = 0; i < rows.length; i++) {
			const r = rows[i];
			const p = i > 0 ? rows[i - 1] : null;
			const inc = (field) => {
				if (!p) return '';
				return Math.max(0, (Number(r[field]) || 0) - (Number(p[field]) || 0));
			};
			lines.push(
				[
					String(r.statistic_date || '').slice(0, 10),
					Number(r.clicks) || 0,
					inc('clicks'),
					Number(r.nices) || 0,
					inc('nices'),
					Number(r.likes) || 0,
					inc('likes'),
					Number(r.comments) || 0,
					inc('comments'),
					Number(r.tippings) || 0,
					inc('tippings'),
				].join(','),
			);
		}
		const csv = '\uFEFF' + lines.join('\n');
		res.setHeader('Content-Type', 'text/csv; charset=utf-8');
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="novel_${novelId}_stats_${ymdOf(new Date())}.csv"`,
		);
		res.end(csv);
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 作者一键感谢打赏读者
router.post('/thank_supporter', auth, async function (req, res) {
	try {
		const user = req.user[0];
		const novelId = req.body.novel_id;
		const supporterId = req.body.user_id;
		const novel = await query(
			'SELECT author_id, name FROM novels WHERE novel_id = ? AND deleted = 0',
			[novelId],
		);
		if (!novel.length || Number(novel[0].author_id) !== Number(user.user_id)) {
			return res.status(403).json({ msg: '只有作者本人可以感谢读者' });
		}
		const tips = await query(
			'SELECT SUM(item_amount * item_cost) total FROM tipping WHERE novel_id = ? AND from_id = ?',
			[novelId, supporterId],
		);
		if (!tips.length || !(Number(tips[0].total) > 0)) {
			return res.status(400).json({ msg: '该读者暂无打赏记录' });
		}
		// 同一读者 24 小时内只感谢一次
		const recent = await query(
			`SELECT * FROM \`log\` WHERE operation = 'THANK_SUPPORTER' AND content = ?
			 AND unix_timestamp(CURRENT_TIMESTAMP()) - unix_timestamp(\`time\`) < 86400`,
			[novelId + '|' + supporterId],
		);
		if (recent.length > 0) {
			return res.json({ success: true, repeated: true });
		}
		const message = require('../bin/message.js');
		await message.sendMsg(
			user.user_id,
			supporterId,
			`《${novel[0].name}》的作者感谢你的打赏支持！`,
			'readers/bookInfo?id=' + novelId,
			'notification',
			false,
		);
		sysLog('THANK_SUPPORTER', user.user_id, '0', novelId + '|' + supporterId);
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 站内来源埋点：书详情页打开时上报入口来源，按天聚合计数
router.post('/report_book_source', async function (req, res) {
	try {
		const novelId = Number(req.body.novel_id);
		const source = String(req.body.source || 'other').slice(0, 20);
		if (!novelId || !/^[a-zA-Z0-9_-]+$/.test(source)) {
			return res.json({ success: false });
		}
		await query(
			`CREATE TABLE IF NOT EXISTS book_source_stats (
				novel_id INT NOT NULL,
				source VARCHAR(20) NOT NULL,
				statistic_date DATETIME NOT NULL,
				count INT DEFAULT 0,
				PRIMARY KEY (novel_id, source, statistic_date)
			)`,
		);
		await query(
			`INSERT INTO book_source_stats (novel_id, source, statistic_date, count)
			 VALUES (?, ?, ?, 1)
			 ON DUPLICATE KEY UPDATE count = count + 1`,
			[novelId, source, ymdOf(new Date()) + ' 00:00:00'],
		);
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 阅读深度埋点：读者上报单章阅读进度与本次停留时长（按人按章取最大进度、累计时长）
router.post('/report_reading_progress', auth, async function (req, res) {
	try {
		const user = req.user[0];
		const articleId = Number(req.body.article_id);
		const progress = Math.max(0, Math.min(1, Number(req.body.progress) || 0));
		const duration = Math.max(0, Math.min(86400, Number(req.body.duration) || 0));
		if (!articleId) return res.json({ success: false });
		await query(
			`CREATE TABLE IF NOT EXISTS article_reading_progress (
				user_id INT NOT NULL,
				article_id INT NOT NULL,
				progress DOUBLE DEFAULT 0,
				duration_sec INT DEFAULT 0,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				PRIMARY KEY (user_id, article_id),
				INDEX idx_arp_article (article_id)
			)`,
		);
		await query(
			`INSERT INTO article_reading_progress (user_id, article_id, progress, duration_sec)
			 VALUES (?, ?, ?, ?)
			 ON DUPLICATE KEY UPDATE
			   progress = IF(VALUES(progress) > progress, VALUES(progress), progress),
			   duration_sec = duration_sec + VALUES(duration_sec)`,
			[user.user_id, articleId, progress, duration],
		);
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 提交文本错误反馈
router.post('/submit_feedback', auth, async function (req, res) {
	try {
		// 首先获取段落内容
		let articleInfo = await query(
			`SELECT a.* FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`,
			[req.body.article_id],
		);
        
		if (articleInfo.length === 0) {
			return res.status(404).json({ msg: '文章不存在' });
		}
        
		let article = articleInfo[0];
		let paragraphText = '';

		// 漫画章节（条漫/页漫）没有段落结构，不支持段评反馈
		if (article.article_type === 'mangaStrip' || article.article_type === 'mangaPage') {
			return res.status(400).json({ msg: '漫画章节暂不支持段落反馈' });
		}

		const paragraph = findReaderParagraph(article, req.body.paragraph_id);
		paragraphText = paragraph ? paragraph.value : '';
        
		if (!paragraphText) {
			return res.status(404).json({ msg: '未找到指定段落' });
		}
        
		// 插入反馈记录
		await query(
			'INSERT INTO article_feedback (article_id, paragraph_id, user_id, feedback_content, paragraph_text) VALUES (?, ?, ?, ?, ?)',
			[
				req.body.article_id,
				req.body.paragraph_id,
				req.user[0].user_id,
				req.body.feedback_content,
				paragraphText,
			],
		);
        
		// 获取作者ID并发送消息通知
		let novelInfo = await query(
			'SELECT n.author_id, n.name FROM novels n JOIN articles a ON n.novel_id = a.novel_id WHERE a.article_id = ?',
			[req.body.article_id],
		);
        
		if (novelInfo.length > 0) {
			const message = require('../bin/message.js');
			message.sendMsg(
				req.user[0].user_id,
				novelInfo[0].author_id,
				`您的作品《${novelInfo[0].name}》收到了一条文本错误反馈，点击查看。`,
				'writers/articleFeedbacks?id=' + article.article_id,
				'notification',
				true,
			);
		}
        
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
