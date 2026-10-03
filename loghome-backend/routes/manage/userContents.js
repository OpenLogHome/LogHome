let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

// ---------- 收藏夹 ----------

router.get('/collections', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT c.*, u.name AS user_name
			FROM comm_collections c
			LEFT JOIN users u ON c.user_id = u.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (keyword) {
			sql += ' AND (u.name LIKE ? OR c.name LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY c.create_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/collections/:id', auth, async function (req, res) {
	try {
		let collectionId = Number(req.params.id);
		if (!collectionId) {
			return res.status(400).json({ msg: 'invalid collection id' });
		}

		await query('DELETE FROM comm_favorites WHERE collection_id = ?', [collectionId]);

		let result = await query('DELETE FROM comm_collections WHERE collection_id = ?', [
			collectionId,
		]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'collection not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 分享口令 ----------

router.get('/share-codes', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT s.*, u.name AS user_name
			FROM share_codes s
			LEFT JOIN users u ON s.share_user_id = u.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (keyword) {
			sql += ' AND (s.code LIKE ? OR u.name LIKE ? OR s.share_content LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY s.created_at DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/share-codes/:id', auth, async function (req, res) {
	try {
		let shareCodeId = Number(req.params.id);
		if (!shareCodeId) {
			return res.status(400).json({ msg: 'invalid share code id' });
		}

		let result = await query('DELETE FROM share_codes WHERE id = ?', [shareCodeId]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'share code not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 定时发布任务 ----------

router.get('/scheduled-tasks', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT t.*, a.title AS article_title, n.name AS novel_name, u.name AS author_name
			FROM scheduled_publish_tasks t
			LEFT JOIN articles a ON t.article_id = a.article_id
			LEFT JOIN novels n ON a.novel_id = n.novel_id
			LEFT JOIN users u ON n.author_id = u.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (keyword) {
			sql += ' AND (a.title LIKE ? OR n.name LIKE ? OR u.name LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY t.publish_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/scheduled-tasks/:id/cancel', auth, async function (req, res) {
	try {
		let taskId = Number(req.params.id);
		if (!taskId) {
			return res.status(400).json({ msg: 'invalid task id' });
		}

		let result = await query(
			'UPDATE scheduled_publish_tasks SET status = \'cancelled\' WHERE task_id = ? AND status = \'pending\'',
			[taskId],
		);
		if (!result.affectedRows) {
			return res.status(400).json({ msg: '任务不存在或已不可取消' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
