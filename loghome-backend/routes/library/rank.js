/**
 * 首页榜单查询接口
 * 数据源：完整的榜单与标签批次；首次生成前保留旧快照/实时兜底
 */
let express = require('express');
let { query } = require('../../sql.js');
const {
	BOARDS,
	ZONES,
	RANK_LIMIT,
	getLiveBoardSql,
} = require('../../bin/rankBoards.js');

// 创建路由对象
let router = express.Router();

router.get('/get_rank_board', async function (req, res) {
	try {
		const board = String(req.query.board || '');
		const zone = String(req.query.zone || '');
		if (!BOARDS.includes(board) || !(zone in ZONES)) {
			return res.status(400).json({ msg: 'bad request' });
		}
		const page = Math.max(1, parseInt(req.query.page, 10) || 1);
		const amount = Math.min(
			RANK_LIMIT,
			Math.max(1, parseInt(req.query.amount, 10) || 10),
		);

		const { ensureRankBadgeSchema } = require('../../bin/rankBadgeSchema');
		await ensureRankBadgeSchema();
		const requestedBatch =
			req.query.batch_id == null ? null : Number(req.query.batch_id);
		if (
			requestedBatch !== null &&
			(!Number.isSafeInteger(requestedBatch) || requestedBatch <= 0)
		)
			return res.status(400).json({ msg: 'invalid batch' });
		const batches = await query(
			`SELECT batch_id,snapshot_date,generated_at FROM rank_batch
		 WHERE status='complete' AND expires_at>CURRENT_TIMESTAMP ${
				requestedBatch ? 'AND batch_id=?' : ''
			} ORDER BY batch_id DESC LIMIT 1`,
			requestedBatch ? [requestedBatch] : [],
		);
		if (requestedBatch && !batches.length)
			return res
				.status(410)
				.json({ code: 'RANK_BATCH_EXPIRED', msg: '榜单已更新，请刷新' });
		const batch = batches[0];
		let snapshotDate = batch ? batch.generated_at : null,
			items;
		if (batch) {
			const rows = await query(
				`SELECT s.item_json,s.badges_json FROM rank_badge_snapshot s
			 JOIN novels n ON n.novel_id=s.novel_id AND n.deleted=0 AND n.is_personal=0 AND n.is_banned=0
			 WHERE s.batch_id=? AND s.board=? AND s.zone=? ORDER BY s.position LIMIT ?,?`,
				[batch.batch_id, board, zone, (page - 1) * amount, amount],
			);
			items = rows.map(row => ({
				...JSON.parse(row.item_json),
				badges: JSON.parse(row.badges_json).filter(
					badge =>
						!badge.expires_at ||
						new Date(badge.expires_at).getTime() > Date.now(),
				),
			}));
		} else {
			// Before the first complete label batch, preserve existing snapshot ranks without inventing history badges.
			const latest = await query(
				'SELECT MAX(snapshot_date) AS snapshot_date FROM rank_snapshot WHERE board=? AND zone=?',
				[board, zone],
			);
			snapshotDate = latest[0] && latest[0].snapshot_date;
			if (snapshotDate) {
				items = await query(
					`SELECT rs.position,rs.score,n.novel_id,n.name,n.picUrl,n.novel_type,n.is_complete,n.update_time,n.clicks,u.name user_name,u.avatar_url,
                 EXISTS(SELECT 1 FROM novel_tag nt JOIN tags t ON t.tag_id=nt.tag_id WHERE nt.novel_id=n.novel_id AND t.is_deleted=0 AND LOWER(TRIM(t.tag_name)) LIKE '%haycraft%') is_haycraft
				 FROM rank_snapshot rs JOIN novels n ON n.novel_id=rs.novel_id AND n.deleted=0 AND n.is_personal=0 AND n.is_banned=0 LEFT JOIN users u ON u.user_id=n.author_id
				 WHERE rs.board=? AND rs.zone=? AND rs.snapshot_date=? ORDER BY rs.position LIMIT ?,?`,
					[board, zone, snapshotDate, (page - 1) * amount, amount],
				);
			} else {
				items = await query(
					getLiveBoardSql(board, zone, (page - 1) * amount, amount),
				);
				items = items.map((item, index) => ({
					...item,
					position: (page - 1) * amount + index + 1,
				}));
			}
			items = items.map(item => ({ ...item, badges: [] }));
		}

		res.end(
			JSON.stringify({
				batch_id: batch ? batch.batch_id : null,
				board,
				zone,
				snapshot_date: snapshotDate,
				items,
			}),
		);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
