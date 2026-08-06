let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

const LIST_FIELDS =
	'tag_id, tag_name, tag_icon, tag_color, jump_url, order_index, is_active, create_time, update_time';

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

function normalizeBody(body) {
	let data = {
		tag_name: String(body.tag_name || '').trim(),
		tag_icon: String(body.tag_icon || '').trim(),
		tag_color: String(body.tag_color || '').trim(),
		jump_url: String(body.jump_url || '').trim(),
		order_index: Number.isInteger(Number(body.order_index))
			? Number(body.order_index)
			: 0,
		is_active: toInt(body.is_active),
	};

	if (!data.tag_name) {
		return { error: '标签名称不能为空' };
	}
	if (!data.jump_url) {
		return { error: '跳转链接不能为空' };
	}
	if (!data.tag_color) {
		data.tag_color = '#999999';
	}

	return { data };
}

router.get('/', auth, async function (req, res) {
	try {
		const isActive =
			req.query.is_active === undefined || req.query.is_active === ''
				? undefined
				: toInt(req.query.is_active);

		let sql = `SELECT ${LIST_FIELDS} FROM library_index_tags`;
		let params = [];
		if (isActive !== undefined) {
			sql += ' WHERE is_active = ?';
			params.push(isActive);
		}
		sql += ' ORDER BY order_index ASC, tag_id ASC';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/', auth, async function (req, res) {
	try {
		let { data, error } = normalizeBody(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		await query(
			`INSERT INTO library_index_tags (tag_name, tag_icon, tag_color, jump_url, order_index, is_active, create_time, update_time)
			 VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
			[
				data.tag_name,
				data.tag_icon,
				data.tag_color,
				data.jump_url,
				data.order_index,
				data.is_active,
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

		let { data, error } = normalizeBody(req.body);
		if (error) {
			return res.status(400).json({ msg: error });
		}

		let result = await query(
			`UPDATE library_index_tags
			 SET tag_name = ?, tag_icon = ?, tag_color = ?, jump_url = ?, order_index = ?, is_active = ?, update_time = NOW()
			 WHERE tag_id = ?`,
			[
				data.tag_name,
				data.tag_icon,
				data.tag_color,
				data.jump_url,
				data.order_index,
				data.is_active,
				tagId,
			],
		);

		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'tag not found' });
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

		let result = await query(
			'DELETE FROM library_index_tags WHERE tag_id = ?',
			[tagId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'tag not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
