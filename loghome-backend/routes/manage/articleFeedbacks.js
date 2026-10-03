let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

// 章节错字反馈列表
router.get('/', auth, async function (req, res) {
	try {
		const status =
			req.query.status === undefined || req.query.status === ''
				? undefined
				: toInt(req.query.status);
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT f.*, u.name AS user_name, a.title AS article_title, n.name AS novel_name
			FROM article_feedback f
			LEFT JOIN users u ON f.user_id = u.user_id
			LEFT JOIN articles a ON f.article_id = a.article_id
			LEFT JOIN novels n ON a.novel_id = n.novel_id
			WHERE 1 = 1
		`;
		let params = [];

		if (status !== undefined) {
			sql += ' AND f.status = ?';
			params.push(status);
		}
		if (keyword) {
			sql += ' AND (u.name LIKE ? OR a.title LIKE ? OR f.feedback_content LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY f.status ASC, f.create_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 标记处理状态
router.put('/:id/status', auth, async function (req, res) {
	try {
		let feedbackId = Number(req.params.id);
		if (!feedbackId) {
			return res.status(400).json({ msg: 'invalid feedback id' });
		}

		let status = toInt(req.body.status);

		let result = await query(
			'UPDATE article_feedback SET status = ?, update_time = NOW() WHERE feedback_id = ?',
			[status, feedbackId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'feedback not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
