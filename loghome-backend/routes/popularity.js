let express = require('express');
let { query, withTransaction } = require('../sql.js');
let auth = require('../bin/auth.js');

let router = express.Router();

function parseRules(value) {
	if (!value) {
		return [];
	}
	if (Array.isArray(value)) {
		return value;
	}
	try {
		let parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		return [];
	}
}

function requireCompleted(rules) {
	return rules.some(
		(rule) => rule && rule.type === 'require_completed' && (rule.value === true || rule.value === 1),
	);
}

// 查询某本小说关联的、已启用人气票的活动（含小说完结状态）
async function getPopularityActivities(tquery, novelId, forUpdate) {
	let sql = `
		SELECT a.tag_id, a.activity_name, a.is_active, a.popularity_quota, a.popularity_rules,
		       n.is_complete, n.is_personal, n.deleted, n.author_id
		FROM novel_tag nt
		JOIN tags t ON t.tag_id = nt.tag_id AND t.is_activity_tag = 1 AND t.is_deleted = 0
		JOIN activity a ON a.tag_id = t.tag_id AND a.popularity_enabled = 1
		JOIN novels n ON n.novel_id = nt.novel_id
		WHERE nt.novel_id = ?
		ORDER BY a.is_active DESC, a.tag_id ASC
	`;
	if (forUpdate) {
		sql += ' FOR UPDATE';
	}
	return tquery(sql, [novelId]);
}

// 获取当前用户在该小说各启票活动中的投票状态
router.get('/novel_status', auth, async function (req, res) {
	const userId = req.user[0].user_id;
	const novelId = Number(req.query.novel_id) || 0;
	try {
		if (!novelId) {
			return res.status(400).json({ msg: 'invalid novel_id' });
		}
		let activities = await getPopularityActivities(query, novelId, false);
		if (activities.length === 0) {
			return res.json([]);
		}
		let tagIds = activities.map((row) => row.tag_id);
		let votes = await query(
			`SELECT tag_id, COUNT(*) AS used, SUM(novel_id = ?) AS voted_this_novel
			 FROM activity_popularity_vote
			 WHERE user_id = ? AND tag_id IN (${tagIds.map(() => '?').join(',')})
			 GROUP BY tag_id`,
			[novelId, userId, ...tagIds],
		);
		let voteMap = {};
		votes.forEach((row) => {
			voteMap[row.tag_id] = row;
		});

		let result = activities.map((row) => {
			let quota = Number(row.popularity_quota) || 2;
			let used = Number((voteMap[row.tag_id] || {}).used || 0);
			let votedThisNovel = Number((voteMap[row.tag_id] || {}).voted_this_novel || 0) > 0;
			let rules = parseRules(row.popularity_rules);
			let onlyCompleted = requireCompleted(rules);

			let reason = '';
			if (Number(row.is_active) !== 1) {
				reason = '活动已结束';
			} else if (Number(row.author_id) === Number(userId)) {
				reason = '不能为自己的作品投票';
			} else if (votedThisNovel) {
				reason = '您已为该作品投过票';
			} else if (onlyCompleted && Number(row.is_complete) !== 1) {
				reason = '本活动仅允许为完结作品投票';
			} else if (used >= quota) {
				reason = '您的票数已用完';
			}

			return {
				tag_id: row.tag_id,
				activity_name: row.activity_name,
				quota,
				used,
				remaining: Math.max(quota - used, 0),
				voted_this_novel: votedThisNovel,
				only_completed: onlyCompleted,
				rules,
				can_vote: reason === '',
				reason,
			};
		});
		res.json(result);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 投出一票（不可撤回）
router.post('/vote', auth, async function (req, res) {
	const userId = req.user[0].user_id;
	const tagId = Number(req.body.tag_id) || 0;
	const novelId = Number(req.body.novel_id) || 0;
	try {
		if (!tagId || !novelId) {
			return res.status(400).json({ msg: 'invalid params' });
		}

		let result = await withTransaction(async (tquery) => {
			let activities = await getPopularityActivities(tquery, novelId, true);
			let activity = activities.find((row) => row.tag_id === tagId);
			if (!activity) {
				return { error: '该作品不在本活动内或未启用人气票' };
			}
			if (Number(activity.is_personal) === 1 || Number(activity.deleted) === 1) {
				return { error: '作品未发布' };
			}
			if (Number(activity.is_active) !== 1) {
				return { error: '活动已结束' };
			}
			if (Number(activity.author_id) === Number(userId)) {
				return { error: '不能为自己的作品投票' };
			}
			let rules = parseRules(activity.popularity_rules);
			if (requireCompleted(rules) && Number(activity.is_complete) !== 1) {
				return { error: '本活动仅允许为完结作品投票' };
			}

			let usedRows = await tquery(
				'SELECT COUNT(*) AS used, SUM(novel_id = ?) AS voted FROM activity_popularity_vote WHERE user_id = ? AND tag_id = ?',
				[novelId, userId, tagId],
			);
			let used = Number(usedRows[0].used || 0);
			if (Number(usedRows[0].voted || 0) > 0) {
				return { error: '您已为该作品投过票' };
			}
			let quota = Number(activity.popularity_quota) || 2;
			if (used >= quota) {
				return { error: '您的票数已用完' };
			}

			await tquery(
				'INSERT INTO activity_popularity_vote (tag_id, user_id, novel_id) VALUES (?, ?, ?)',
				[tagId, userId, novelId],
			);
			return { ok: true, used: used + 1, remaining: Math.max(quota - used - 1, 0) };
		});

		if (result.error) {
			return res.status(400).json({ msg: result.error });
		}
		res.json({ msg: 'success', used: result.used, remaining: result.remaining });
	} catch (e) {
		console.log(e);
		if (e && e.code === 'ER_DUP_ENTRY') {
			return res.status(400).json({ msg: '您已为该作品投过票' });
		}
		res.status(400).json({ msg: '投票失败，请稍后重试' });
	}
});

module.exports = router;
