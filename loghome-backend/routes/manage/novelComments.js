let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

// 章评列表
router.get('/comments', auth, async function (req, res) {
	try {
		const deleted =
			req.query.deleted === undefined || req.query.deleted === ''
				? 0
				: toInt(req.query.deleted);
		const novelId = Number(req.query.novel_id) || 0;
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT c.essay_comment_id, c.user_id, c.novel_id, c.article_id, c.content, c.reply_to_id, c.father_comment_id, c.is_topped, c.comment_time, c.deleted, c.media_urls,
				u.name AS user_name, n.name AS novel_name
			FROM novel_comments c
			LEFT JOIN users u ON c.user_id = u.user_id
			LEFT JOIN novels n ON c.novel_id = n.novel_id
			WHERE c.deleted = ?
		`;
		let params = [deleted];

		if (novelId > 0) {
			sql += ' AND c.novel_id = ?';
			params.push(novelId);
		}
		if (keyword) {
			sql += ' AND (c.content LIKE ? OR u.name LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY c.comment_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 章评软删/恢复
router.post('/comments/:id/toggle-delete', auth, async function (req, res) {
	try {
		let commentId = Number(req.params.id);
		if (!commentId) {
			return res.status(400).json({ msg: 'invalid comment id' });
		}

		let isDeleted = toInt(req.body.deleted);

		let result = await query(
			'UPDATE novel_comments SET deleted = ? WHERE essay_comment_id = ?',
			[isDeleted, commentId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'comment not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 划线(cento)列表
router.get('/centos', auth, async function (req, res) {
	try {
		const isDelete =
			req.query.is_delete === undefined || req.query.is_delete === ''
				? 0
				: toInt(req.query.is_delete);
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT c.article_cento_id, c.user_id, c.article_id, c.paragraph_id, c.paragraph, c.is_delete,
				u.name AS user_name
			FROM article_cento c
			LEFT JOIN users u ON c.user_id = u.user_id
			WHERE c.is_delete = ?
		`;
		let params = [isDelete];

		if (keyword) {
			sql += ' AND (c.paragraph LIKE ? OR u.name LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY c.article_cento_id DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 划线软删/恢复
router.post('/centos/:id/toggle-delete', auth, async function (req, res) {
	try {
		let centoId = Number(req.params.id);
		if (!centoId) {
			return res.status(400).json({ msg: 'invalid cento id' });
		}

		let isDelete = toInt(req.body.is_delete);

		let result = await query(
			'UPDATE article_cento SET is_delete = ? WHERE article_cento_id = ?',
			[isDelete, centoId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'cento not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
