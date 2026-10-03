let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

// 世界观列表
router.get('/', auth, async function (req, res) {
	try {
		const keyword = String(req.query.keyword || '').trim();
		const isDelete =
			req.query.is_delete === undefined || req.query.is_delete === ''
				? 0
				: toInt(req.query.is_delete);

		let sql = `
			SELECT w.world_id, w.creator_id, w.allow_fork, w.is_delete, w.forked_from, w.asso_novel_id,
				n.name AS world_name, n.deleted AS novel_deleted, u.name AS creator_name
			FROM world w
			LEFT JOIN novels n ON w.asso_novel_id = n.novel_id
			LEFT JOIN users u ON w.creator_id = u.user_id
			WHERE w.is_delete = ?
		`;
		let params = [isDelete];

		if (keyword) {
			sql += ' AND (n.name LIKE ? OR u.name LIKE ?)';
			params.push(`%${keyword}%`, `%${keyword}%`);
		}

		sql += ' ORDER BY w.world_id DESC LIMIT 500';

		let results = await query(sql, params);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 世界观关联小说列表
router.get('/:id/novels', auth, async function (req, res) {
	try {
		let worldId = Number(req.params.id);
		if (!worldId) {
			return res.status(400).json({ msg: 'invalid world id' });
		}

		let results = await query(
			`SELECT w.novel_id, n.name AS novel_name, u.name AS author_name, n.deleted
			 FROM world_novel w
			 LEFT JOIN novels n ON w.novel_id = n.novel_id
			 LEFT JOIN users u ON n.author_id = u.user_id
			 WHERE w.world_id = ?
			 ORDER BY w.novel_id ASC`,
			[worldId],
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 软删/恢复世界观
router.post('/:id/toggle-delete', auth, async function (req, res) {
	try {
		let worldId = Number(req.params.id);
		if (!worldId) {
			return res.status(400).json({ msg: 'invalid world id' });
		}

		let isDelete = toInt(req.body.is_delete);

		let result = await query('UPDATE world SET is_delete = ? WHERE world_id = ?', [
			isDelete,
			worldId,
		]);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'world not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
