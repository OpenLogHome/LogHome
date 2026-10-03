let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

// 表情包列表
router.get('/', auth, async function (req, res) {
	try {
		const scope = req.query.scope || '';
		const isPrivate =
			req.query.is_private === undefined || req.query.is_private === ''
				? undefined
				: toInt(req.query.is_private);

		let sql = `
			SELECT s.*, u.name AS user_name,
				(SELECT COUNT(*) FROM sticker_favorites f WHERE f.sticker_id = s.sticker_id) AS favorite_count
			FROM stickers s
			LEFT JOIN users u ON s.user_id = u.user_id
			WHERE 1 = 1
		`;
		let params = [];

		if (scope === 'global') {
			sql += ' AND s.is_private = 0';
		} else if (scope === 'user') {
			sql += ' AND s.is_private = 1';
		}
		if (isPrivate !== undefined && scope === '') {
			sql += ' AND s.is_private = ?';
			params.push(isPrivate);
		}

		sql += ' ORDER BY s.sticker_id DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 新增表情包（管理员上传，作为全局表情）
router.post('/', auth, async function (req, res) {
	try {
		let url = String(req.body.url || '').trim();
		if (!url) {
			return res.status(400).json({ msg: '请上传表情包文件' });
		}

		let adminUser = req.user && req.user[0] ? req.user[0].user_id : 1;

		await query(
			'INSERT INTO stickers (user_id, url, is_private, created_at, updated_at) VALUES (?, ?, 0, NOW(), NOW())',
			[adminUser, url],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 删除表情包
router.delete('/:id', auth, async function (req, res) {
	try {
		let stickerId = Number(req.params.id);
		if (!stickerId) {
			return res.status(400).json({ msg: 'invalid sticker id' });
		}

		await query('DELETE FROM sticker_favorites WHERE sticker_id = ?', [stickerId]);

		let result = await query('DELETE FROM stickers WHERE sticker_id = ?', [stickerId]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'sticker not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
