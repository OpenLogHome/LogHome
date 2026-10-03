let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

// ---------- 打赏记录 ----------

router.get('/records', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();
		const novelId = Number(req.query.novel_id) || 0;

		let sql = `
			SELECT t.*, u.name AS from_name, n.name AS novel_name
			FROM tipping t
			LEFT JOIN users u ON t.from_id = u.user_id
			LEFT JOIN novels n ON t.novel_id = n.novel_id
			WHERE 1 = 1
		`;
		let params = [];

		if (novelId > 0) {
			sql += ' AND t.novel_id = ?';
			params.push(novelId);
		}
		if (keyword) {
			sql += ' AND (u.name LIKE ? OR n.name LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY t.tipping_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 打赏档位配置 ----------

router.get('/items', auth, async function (req, res) {
	try {
		let results = await query('SELECT * FROM tipping_list ORDER BY sort_id ASC');
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

function normalizeItem(body) {
	let data = {
		item_name: String(body.item_name || '').trim(),
		item_cost: Number(body.item_cost),
		is_log_free: toInt(body.is_log_free),
		img_url: String(body.img_url || '').trim(),
		sort_id: Number(body.sort_id),
	};

	if (!data.item_name) {
		return { error: '档位名称不能为空' };
	}
	if (!Number.isInteger(data.item_cost) || data.item_cost <= 0) {
		return { error: '原木价格必须为正整数' };
	}
	if (!data.img_url) {
		return { error: '请上传档位图标' };
	}

	return { data };
}

router.post('/items', auth, async function (req, res) {
	try {
		let { data, error } = normalizeItem(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let exists = await query(
			'SELECT item_name FROM tipping_list WHERE item_name = ?',
			[data.item_name],
		);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '该档位已存在' });
		}

		await query(
			'INSERT INTO tipping_list (item_name, item_cost, is_log_free, img_url, sort_id) VALUES (?, ?, ?, ?, ?)',
			[data.item_name, data.item_cost, data.is_log_free, data.img_url, data.sort_id],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/items/:id', auth, async function (req, res) {
	try {
		let itemName = String(req.params.id || '');
		if (!itemName) {
			return res.status(400).json({ msg: 'invalid item name' });
		}

		let { data, error } = normalizeItem(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let result = await query(
			'UPDATE tipping_list SET item_name = ?, item_cost = ?, is_log_free = ?, img_url = ?, sort_id = ? WHERE item_name = ?',
			[
				data.item_name,
				data.item_cost,
				data.is_log_free,
				data.img_url,
				data.sort_id,
				itemName,
			],
		);

		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'tipping item not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/items/:id', auth, async function (req, res) {
	try {
		let itemName = String(req.params.id || '');
		if (!itemName) {
			return res.status(400).json({ msg: 'invalid item name' });
		}

		let result = await query('DELETE FROM tipping_list WHERE item_name = ?', [itemName]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'tipping item not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// ---------- 粉丝团留言 ----------

router.get('/fan-messages', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();
		const novelId = Number(req.query.novel_id) || 0;

		let sql = `
			SELECT f.*, u.name AS user_name, n.name AS novel_name
			FROM novel_fans_messages f
			LEFT JOIN users u ON f.user_id = u.user_id
			LEFT JOIN novels n ON f.novel_id = n.novel_id
			WHERE 1 = 1
		`;
		let params = [];

		if (novelId > 0) {
			sql += ' AND f.novel_id = ?';
			params.push(novelId);
		}
		if (keyword) {
			sql += ' AND (u.name LIKE ? OR f.message LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY f.create_time DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/fan-messages/:id', auth, async function (req, res) {
	try {
		let messageId = Number(req.params.id);
		if (!messageId) {
			return res.status(400).json({ msg: 'invalid message id' });
		}

		let result = await query('DELETE FROM novel_fans_messages WHERE id = ?', [
			messageId,
		]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'fan message not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
