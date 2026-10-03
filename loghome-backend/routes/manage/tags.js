let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

function normalizeBody(body) {
	let data = {
		tag_name: String(body.tag_name || '').trim(),
		is_activity_tag: toInt(body.is_activity_tag),
		is_suggested: toInt(body.is_suggested),
	};

	if (!data.tag_name) {
		return { error: '标签名称不能为空' };
	}

	return { data };
}

router.get('/', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();
		const deleted =
			req.query.is_deleted === undefined || req.query.is_deleted === ''
				? undefined
				: toInt(req.query.is_deleted);
		const activityTag =
			req.query.is_activity_tag === undefined || req.query.is_activity_tag === ''
				? undefined
				: toInt(req.query.is_activity_tag);
		const suggested =
			req.query.is_suggested === undefined || req.query.is_suggested === ''
				? undefined
				: toInt(req.query.is_suggested);

		let sql = `
			SELECT t.*,
				(SELECT COUNT(*) FROM novel_tag nt
				 JOIN novels n ON nt.novel_id = n.novel_id AND n.deleted = 0
				 WHERE nt.tag_id = t.tag_id) AS usage_count
			FROM tags t
			WHERE 1 = 1
		`;
		let params = [];

		if (keyword) {
			sql += ' AND t.tag_name LIKE ?';
			params.push(`%${keyword}%`);
		}
		if (deleted !== undefined) {
			sql += ' AND t.is_deleted = ?';
			params.push(deleted);
		}
		if (activityTag !== undefined) {
			sql += ' AND t.is_activity_tag = ?';
			params.push(activityTag);
		}
		if (suggested !== undefined) {
			sql += ' AND t.is_suggested = ?';
			params.push(suggested);
		}

		sql += ' ORDER BY t.is_deleted ASC, usage_count DESC, t.tag_id DESC LIMIT 500';

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

		let exists = await query(
			'SELECT * FROM tags WHERE tag_name = ? AND is_deleted = 0',
			[data.tag_name],
		);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '同名标签已存在' });
		}

		// 若存在已删除的同名标签则恢复
		let deleted = await query(
			'SELECT * FROM tags WHERE tag_name = ? AND is_deleted = 1 LIMIT 1',
			[data.tag_name],
		);
		if (deleted.length > 0) {
			await query(
				'UPDATE tags SET is_deleted = 0, is_activity_tag = ?, is_suggested = ? WHERE tag_id = ?',
				[data.is_activity_tag, data.is_suggested, deleted[0].tag_id],
			);
			return res.json({ msg: 'success', restored: true, tag_id: deleted[0].tag_id });
		}

		let adminUser = req.user && req.user[0] ? req.user[0].user_id : 1;

		await query(
			'INSERT INTO tags (tag_name, create_user_id, is_deleted, is_activity_tag, is_suggested) VALUES (?, ?, 0, ?, ?)',
			[data.tag_name, adminUser, data.is_activity_tag, data.is_suggested],
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

		let duplicate = await query(
			'SELECT * FROM tags WHERE tag_name = ? AND is_deleted = 0 AND tag_id != ?',
			[data.tag_name, tagId],
		);
		if (duplicate.length > 0) {
			return res.status(400).json({ msg: '同名标签已存在' });
		}

		let result = await query(
			'UPDATE tags SET tag_name = ?, is_activity_tag = ?, is_suggested = ? WHERE tag_id = ?',
			[data.tag_name, data.is_activity_tag, data.is_suggested, tagId],
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

router.post('/:id/toggle-delete', auth, async function (req, res) {
	try {
		let tagId = Number(req.params.id);
		if (!tagId) {
			return res.status(400).json({ msg: 'invalid tag id' });
		}

		let isDeleted = toInt(req.body.is_deleted);

		let result = await query(
			'UPDATE tags SET is_deleted = ? WHERE tag_id = ?',
			[isDeleted, tagId],
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
