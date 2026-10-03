let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

// 荣誉用户列表
router.get('/', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();

		let sql = `
			SELECT g.user_id, g.great_info, u.name, u.avatar_url
			FROM great_users g
			LEFT JOIN users u ON g.user_id = u.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (keyword) {
			sql += ' AND (u.name LIKE ? OR g.user_id LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY g.user_id ASC';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 添加荣誉用户
router.post('/', auth, async function (req, res) {
	try {
		let userId = Number(req.body.user_id);
		let greatInfo = String(req.body.great_info || '').trim();

		if (!Number.isInteger(userId) || userId <= 0) {
			return res.status(400).json({ msg: '请选择用户' });
		}
		if (!greatInfo) {
			return res.status(400).json({ msg: '荣誉介绍不能为空' });
		}

		let user = await query('SELECT user_id FROM users WHERE user_id = ?', [userId]);
		if (user.length === 0) {
			return res.status(400).json({ msg: '用户不存在' });
		}

		let exists = await query('SELECT user_id FROM great_users WHERE user_id = ?', [userId]);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '该用户已在荣誉用户列表中' });
		}

		await query('INSERT INTO great_users (user_id, great_info) VALUES (?, ?)', [
			userId,
			greatInfo,
		]);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 更新荣誉介绍
router.put('/:id', auth, async function (req, res) {
	try {
		let userId = Number(req.params.id);
		if (!userId) {
			return res.status(400).json({ msg: 'invalid user id' });
		}

		let greatInfo = String(req.body.great_info || '').trim();
		if (!greatInfo) {
			return res.status(400).json({ msg: '荣誉介绍不能为空' });
		}

		let result = await query(
			'UPDATE great_users SET great_info = ? WHERE user_id = ?',
			[greatInfo, userId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'honor user not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 移除荣誉用户
router.delete('/:id', auth, async function (req, res) {
	try {
		let userId = Number(req.params.id);
		if (!userId) {
			return res.status(400).json({ msg: 'invalid user id' });
		}

		let result = await query('DELETE FROM great_users WHERE user_id = ?', [userId]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'honor user not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
