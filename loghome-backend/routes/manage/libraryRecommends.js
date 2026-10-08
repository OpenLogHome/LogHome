let express = require('express');
let { query, withTransaction } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

// 推荐位相关
router.get('/titles', auth, async function (req, res) {
	try {
		let results = await query(
			`SELECT titles.title, COUNT(r.recommend_id) AS cnt FROM
			 (SELECT collection_title AS title FROM library_recommend_collections UNION SELECT title FROM library_recommend) titles
			 LEFT JOIN library_recommend r ON r.title = titles.title GROUP BY titles.title ORDER BY cnt DESC, titles.title ASC`,
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.get('/', auth, async function (req, res) {
	try {
		let title = String(req.query.title || '').trim();
		if (!title) {
			return res.status(400).json({ msg: 'title is required' });
		}

		let results = await query(
			`SELECT c.recommend_id, c.novel_id, c.title, c.router, c.ranking, n.name AS novel_name, n.deleted AS novel_deleted
			 FROM library_recommend c
			 LEFT JOIN novels n ON c.novel_id = n.novel_id
			 WHERE c.title = ?
			 ORDER BY c.ranking DESC, c.recommend_id DESC
			 LIMIT 500`,
			[title],
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/', auth, async function (req, res) {
	try {
		let title = String(req.body.title || '').trim();
		let novelId = Number(req.body.novel_id);
		let routerPath = String(req.body.router || '').trim();
		let ranking = req.body.ranking === undefined || req.body.ranking === null
			? 0
			: Number(req.body.ranking);

		if (!title) {
			return res.status(400).json({ msg: '榜单名称不能为空' });
		}
		if (!Number.isInteger(novelId) || novelId <= 0) {
			return res.status(400).json({ msg: '请选择小说' });
		}

		if (!Number.isFinite(ranking)) {
			return res.status(400).json({ msg: '排序值必须为数字' });
		}

		let novel = await query('SELECT novel_id FROM novels WHERE novel_id = ?', [novelId]);
		if (novel.length === 0) {
			return res.status(400).json({ msg: '小说不存在' });
		}

		let exists = await query(
			'SELECT recommend_id FROM library_recommend WHERE title = ? AND novel_id = ?',
			[title, novelId],
		);
		if (exists.length > 0) {
			return res.status(400).json({ msg: '该小说已在榜单中' });
		}

		await query(
			'INSERT INTO library_recommend (novel_id, title, router, ranking) VALUES (?, ?, ?, ?)',
			[novelId, title, routerPath, ranking],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/:id', auth, async function (req, res) {
	try {
		let recommendId = Number(req.params.id);
		if (!Number.isSafeInteger(recommendId) || recommendId <= 0) {
			return res.status(400).json({ msg: 'invalid recommend id' });
		}

		let result = await query(
			'DELETE FROM library_recommend WHERE recommend_id = ?',
			[recommendId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'recommend record not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

// 合集相关
router.get('/collections', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM library_recommend_collections ORDER BY collection_id ASC',
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.post('/collections', auth, async function (req, res) {
	try {
		let collectionTitle = String(req.body.collection_title || '').trim();
		let collectionType = String(req.body.collection_type || '').trim();
		let icon = String(req.body.icon || '').trim();
		let isValid = toInt(req.body.isValid);

		if (!collectionTitle || !['slide', 'cards', 'dense_card'].includes(collectionType)) {
			return res.status(400).json({ msg: '合集名称与类型不能为空' });
		}

		const duplicate = await query('SELECT collection_id FROM library_recommend_collections WHERE collection_title = ?', [collectionTitle]);
		if (duplicate.length) return res.status(409).json({ msg: '合集名称已存在' });

		await query(
			'INSERT INTO library_recommend_collections (isValid, collection_title, collection_type, icon) VALUES (?, ?, ?, ?)',
			[isValid, collectionTitle, collectionType, icon],
		);

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/collections/:id', auth, async function (req, res) {
	try {
		let collectionId = Number(req.params.id);
		if (!Number.isSafeInteger(collectionId) || collectionId <= 0) {
			return res.status(400).json({ msg: 'invalid collection id' });
		}

		let collectionTitle = String(req.body.collection_title || '').trim();
		let collectionType = String(req.body.collection_type || '').trim();
		let icon = String(req.body.icon || '').trim();
		let isValid = toInt(req.body.isValid);

		if (!collectionTitle || !['slide', 'cards', 'dense_card'].includes(collectionType)) {
			return res.status(400).json({ msg: '合集名称与类型不能为空' });
		}

		const outcome = await withTransaction(async trx => {
			const rows = await trx('SELECT * FROM library_recommend_collections WHERE collection_id = ? FOR UPDATE', [collectionId]);
			if (!rows.length) return { status: 404, msg: 'collection not found' };
			const duplicates = await trx('SELECT collection_id FROM library_recommend_collections WHERE collection_title = ? AND collection_id <> ? FOR UPDATE', [collectionTitle, collectionId]);
			if (duplicates.length) return { status: 409, msg: '合集名称已存在' };
			// Titles are the legacy association key: migrate records atomically with the collection.
			if (rows[0].collection_title !== collectionTitle) {
				await trx('UPDATE library_recommend SET title = ? WHERE title = ?', [collectionTitle, rows[0].collection_title]);
			}
			await trx('UPDATE library_recommend_collections SET isValid = ?, collection_title = ?, collection_type = ?, icon = ? WHERE collection_id = ?', [isValid, collectionTitle, collectionType, icon, collectionId]);
			return null;
		});
		if (outcome) return res.status(outcome.status).json({ msg: outcome.msg });

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.delete('/collections/:id', auth, async function (req, res) {
	try {
		let collectionId = Number(req.params.id);
		if (!Number.isSafeInteger(collectionId) || collectionId <= 0) {
			return res.status(400).json({ msg: 'invalid collection id' });
		}

		let result = await query(
			'DELETE FROM library_recommend_collections WHERE collection_id = ?',
			[collectionId],
		);
		if (!result.affectedRows) {
			return res.status(404).json({ msg: 'collection not found' });
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
