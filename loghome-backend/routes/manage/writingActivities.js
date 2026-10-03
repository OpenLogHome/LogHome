let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

function parseJsonArray(value) {
	// activity_news / required_fields 是 JSON 列，空值必须写成合法 JSON
	if (typeof value === 'string') {
		return value.trim() || '[]';
	}
	if (!value) {
		return '[]';
	}
	return JSON.stringify(value);
}

const POPULARITY_RULE_TYPES = ['require_completed'];

function normalizePopularityRules(value) {
	let rules = value;
	if (typeof rules === 'string') {
		try {
			rules = JSON.parse(rules || '[]');
		} catch (e) {
			rules = [];
		}
	}
	if (!Array.isArray(rules)) {
		rules = [];
	}
	let normalized = rules
		.filter((rule) => rule && POPULARITY_RULE_TYPES.includes(rule.type))
		.map((rule) => ({ type: rule.type, value: rule.value === true || rule.value === 1 }));
	// 同一类型只保留最后一条
	let seen = new Set();
	normalized = normalized
		.reverse()
		.filter((rule) => (seen.has(rule.type) ? false : (seen.add(rule.type), true)));
	return JSON.stringify(normalized);
}

// ---------- 活动配置 ----------

router.get('/', auth, async function (req, res) {
	try {
		let results = await query(
			`SELECT a.*, (
				SELECT COUNT(*) FROM activity_popularity_vote v WHERE v.tag_id = a.tag_id
			) AS popularity_votes
			FROM activity a
			ORDER BY a.is_active DESC, a.activity_name ASC`,
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

function normalizeActivity(body) {
	let popularityQuota = parseInt(body.popularity_quota, 10);
	if (!Number.isInteger(popularityQuota) || popularityQuota < 1 || popularityQuota > 100) {
		popularityQuota = 2;
	}

	let data = {
		tag_id: Number(body.tag_id),
		activity_name: String(body.activity_name || '').trim(),
		activity_description: String(body.activity_description || '').trim(),
		activity_news: parseJsonArray(body.activity_news),
		required_fields: parseJsonArray(body.required_fields),
		is_active: toInt(body.is_active),
		restrict_complete_update: toInt(body.restrict_complete_update),
		popularity_enabled: toInt(body.popularity_enabled),
		popularity_quota: popularityQuota,
		popularity_rules: normalizePopularityRules(body.popularity_rules),
	};

	if (!Number.isInteger(data.tag_id) || data.tag_id <= 0) {
		return { error: '活动标签ID必须为正整数' };
	}
	if (!data.activity_name) {
		return { error: '活动名称不能为空' };
	}

	return { data };
}

router.post('/', auth, async function (req, res) {
	try {
		let { data, error } = normalizeActivity(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let exists = await query('SELECT tag_id FROM activity WHERE tag_id = ?', [
			data.tag_id,
		]);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '该活动标签ID已存在' });
		}

		await query(
			'INSERT INTO activity (tag_id, activity_name, activity_description, activity_news, required_fields, is_active, restrict_complete_update, popularity_enabled, popularity_quota, popularity_rules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				data.tag_id,
				data.activity_name,
				data.activity_description,
				data.activity_news,
				data.required_fields,
				data.is_active,
				data.restrict_complete_update,
				data.popularity_enabled,
				data.popularity_quota,
				data.popularity_rules,
			],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/:id', auth, async function (req, res) {
	try {
		let tagId = Number(req.params.id);
		if (!tagId) {
			return res.status(400).json({ msg: 'invalid tag id' });
		}

		let { data, error } = normalizeActivity(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let result = await query(
			'UPDATE activity SET activity_name = ?, activity_description = ?, activity_news = ?, required_fields = ?, is_active = ?, restrict_complete_update = ?, popularity_enabled = ?, popularity_quota = ?, popularity_rules = ? WHERE tag_id = ?',
			[
				data.activity_name,
				data.activity_description,
				data.activity_news,
				data.required_fields,
				data.is_active,
				data.restrict_complete_update,
				data.popularity_enabled,
				data.popularity_quota,
				data.popularity_rules,
				tagId,
			],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'activity not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/:id', auth, async function (req, res) {
	try {
		let tagId = Number(req.params.id);
		if (!tagId) {
			return res.status(400).json({ msg: 'invalid tag id' });
		}

		let result = await query('DELETE FROM activity WHERE tag_id = ?', [tagId]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'activity not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 人气票 ----------

// 重置某个活动的全部人气票
router.post('/:id/popularity/reset', auth, async function (req, res) {
	try {
		let tagId = Number(req.params.id);
		if (!tagId) {
			return res.status(400).json({ msg: 'invalid tag id' });
		}

		let exists = await query('SELECT tag_id FROM activity WHERE tag_id = ?', [tagId]);
		if (!exists.length) {
			return res.status(404).json({ msg: 'activity not found' });
		}

		let result = await query('DELETE FROM activity_popularity_vote WHERE tag_id = ?', [
			tagId,
		]);

		res.json({ msg: 'success', deleted: result.affectedRows });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 活动报名信息 ----------

router.get('/submissions', auth, async function (req, res) {
	try {
		const tagId = Number(req.query.tag_id) || 0;
		const status =
			req.query.status === undefined || req.query.status === ''
				? undefined
				: toInt(req.query.status);

		let sql = `
			SELECT ai.*, u.name AS user_name, n.name AS novel_name
			FROM activity_information ai
			LEFT JOIN users u ON ai.user_id = u.user_id
			LEFT JOIN novels n ON ai.novel_id = n.novel_id
			WHERE 1 = 1
		`;
		let params = [];

		if (tagId > 0) {
			sql += ' AND ai.tag_id = ?';
			params.push(tagId);
		}
		if (status !== undefined) {
			sql += ' AND ai.status = ?';
			params.push(status);
		}

		sql += ' ORDER BY ai.submit_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 更新报名信息状态
router.put('/submissions/:id/status', auth, async function (req, res) {
	try {
		let submissionId = Number(req.params.id);
		if (!submissionId) {
			return res.status(400).json({ msg: 'invalid submission id' });
		}

		let status = toInt(req.body.status);

		let result = await query(
			'UPDATE activity_information SET status = ?, update_time = NOW() WHERE id = ?',
			[status, submissionId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'submission not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
