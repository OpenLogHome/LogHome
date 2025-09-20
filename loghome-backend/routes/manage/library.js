// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');

/**
 * 计算内容的MD5哈希值
 * @param {string} content - 要计算哈希的内容
 * @returns {string} MD5哈希值
 */
function calculateContentHash(content) {
    if (!content) return '';
    return crypto.createHash('md5').update(content).digest('hex');
}

// 创建路由对象
let router = express.Router();

router.get('/get_library_roulous_chart', auth, async function (req, res) {
	try {
		// 添加分页参数和筛选条件
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		const isValid = req.query.isValid !== undefined ? parseInt(req.query.isValid) : undefined;
		
		let sql = 'SELECT * FROM library_roulous_chart';
		let countSql = 'SELECT COUNT(*) as total FROM library_roulous_chart';
		let params = [];
		let countParams = [];
		
		// 添加筛选条件
		if (isValid !== undefined) {
			sql += ' WHERE isValid = ?';
			countSql += ' WHERE isValid = ?';
			params.push(isValid);
			countParams.push(isValid);
		}
		
		// 按order排序
		sql += ' ORDER BY `order` ASC';
		
		// 添加分页
		sql += ' LIMIT ?, ?';
		params.push(offset, pageSize);
		
		let roulous_chart = await query(sql, params);
		let totalCount = await query(countSql, countParams);
		
		res.json({
			data: roulous_chart,
			pagination: {
				total: totalCount[0].total,
				page,
				pageSize
			}
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/edit_library_roulous_chart', auth, async function (req, res) {
	try {
		//判断是新增还是修改
		if (req.body.id) {
			if (req.body.name != undefined) {
				await query('UPDATE library_roulous_chart SET name = ? WHERE id = ?', [
					req.body.name,
					req.body.id,
				]);
			}
			if (req.body.image != undefined) {
				await query('UPDATE library_roulous_chart SET image = ? WHERE id = ?', [
					req.body.image,
					req.body.id,
				]);
			}
			if (req.body.title != undefined) {
				await query('UPDATE library_roulous_chart SET title = ? WHERE id = ?', [
					req.body.title,
					req.body.id,
				]);
			}
			if (req.body.navigate_to != undefined) {
				await query(
					'UPDATE library_roulous_chart SET navigate_to = ? WHERE id = ?',
					[req.body.navigate_to, req.body.id],
				);
			}
			if (req.body.isValid != undefined) {
				await query(
					'UPDATE library_roulous_chart SET isValid = ? WHERE id = ?',
					[req.body.isValid, req.body.id],
				);
				console.log(req.body.isValid);
			}
			// 添加order字段更新
			if (req.body.order != undefined) {
				await query(
					'UPDATE library_roulous_chart SET `order` = ? WHERE id = ?',
					[req.body.order, req.body.id],
				);
			}
			res.end('success');
		} else {
			if (
				req.body.name != undefined &&
				req.body.image != undefined &&
				req.body.title != undefined &&
				req.body.navigate_to != undefined
			) {
				// 获取最大order值
				const maxOrderResult = await query('SELECT MAX(`order`) as maxOrder FROM library_roulous_chart');
				const newOrder = (maxOrderResult[0].maxOrder || 0) + 10; // 默认间隔10，便于将来调整顺序
				
				await query(
					'INSERT INTO library_roulous_chart(name,image,title,navigate_to,isValid,`order`) VALUES(?,?,?,?,?,?)',
					[
						req.body.name,
						req.body.image,
						req.body.title,
						req.body.navigate_to,
						1,
						newOrder,
					],
				);
				res.end('success');
			} else {
				res.json(400, { msg: 'bad request' });
			}
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 增加删除轮播图接口
router.post('/delete_library_roulous_chart', auth, async function (req, res) {
	try {
		if (!req.body.id) {
			return res.json(400, { msg: 'missing id parameter' });
		}
		
		await query('DELETE FROM library_roulous_chart WHERE id = ?', [req.body.id]);
		res.end('success');
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加更新轮播图顺序的接口
router.post('/update_roulous_chart_order', auth, async function (req, res) {
	try {
		if (!req.body.id || req.body.order === undefined) {
			return res.json(400, { msg: 'missing required parameters' });
		}
		
		await query('UPDATE library_roulous_chart SET `order` = ? WHERE id = ?', [
			req.body.order,
			req.body.id,
		]);
		res.end('success');
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加获取所有小说接口
router.get('/get_all_novels', auth, async function (req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		const keyword = req.query.keyword ? `%${req.query.keyword}%` : null;
		const authorName = req.query.authorName ? `%${req.query.authorName}%` : null;
		
		let sql = `SELECT n.*, u.name author_name FROM novels n 
				JOIN users u ON n.author_id = u.user_id 
				WHERE n.deleted = 0`;
		let countSql = `SELECT COUNT(*) as total FROM novels n 
					   JOIN users u ON n.author_id = u.user_id
					   WHERE n.deleted = 0`;
		let params = [];
		let countParams = [];
		
		// 添加关键词搜索
		if (keyword) {
			sql += ` AND (n.name LIKE ? OR n.content LIKE ?)`;
			countSql += ` AND (n.name LIKE ? OR n.content LIKE ?)`;
			params.push(keyword, keyword);
			countParams.push(keyword, keyword);
		}
		
		// 添加作者搜索
		if (authorName) {
			sql += ` AND u.name LIKE ?`;
			countSql += ` AND u.name LIKE ?`;
			params.push(authorName);
			countParams.push(authorName);
		}
		
		// 按创建时间排序
		sql += ` ORDER BY n.update_time DESC, n.create_time DESC LIMIT ?, ?`;
		params.push(offset, pageSize);
		
		const novels = await query(sql, params);
		const totalCount = await query(countSql, countParams);
		
		res.json({
			data: novels,
			pagination: {
				total: totalCount[0].total,
				page,
				pageSize
			}
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加获取小说文章列表接口
router.get('/get_novel_articles', auth, async function (req, res) {
	try {
		if (!req.query.novel_id) {
			return res.json(400, { msg: 'missing novel_id parameter' });
		}
		
		const novelId = req.query.novel_id;
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		
		// 先检查小说是否存在
		const novel = await query('SELECT * FROM novels WHERE novel_id = ? AND deleted = 0', [novelId]);
		if (novel.length === 0) {
			return res.json(404, { msg: 'novel not found' });
		}
		
		const sql = `SELECT a.* FROM articles a 
				   WHERE a.novel_id = ? AND a.deleted = 0 
				   ORDER BY a.article_chapter ASC 
				   LIMIT ?, ?`;
		const countSql = `SELECT COUNT(*) as total FROM articles a 
						 WHERE a.novel_id = ? AND a.deleted = 0`;
		
		const articles = await query(sql, [novelId, offset, pageSize]);
		const totalCount = await query(countSql, [novelId]);
		
		res.json({
			data: articles,
			novel: novel[0],
			pagination: {
				total: totalCount[0].total,
				page,
				pageSize
			}
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加获取单篇文章详情接口
router.get('/get_article_detail', auth, async function (req, res) {
	try {
		if (!req.query.article_id) {
			return res.json(400, { msg: 'missing article_id parameter' });
		}
		
		const articleId = req.query.article_id;
		const article = await query('SELECT * FROM articles WHERE article_id = ? AND deleted = 0', [articleId]);
		
		if (article.length === 0) {
			return res.json(404, { msg: 'article not found' });
		}
		
		res.json(article[0]);
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加更新文章接口
router.post('/update_article', auth, async function (req, res) {
	try {
		if (!req.body.article_id) {
			return res.json(400, { msg: 'missing article_id parameter' });
		}
		
		const article = await query('SELECT * FROM articles WHERE article_id = ?', [req.body.article_id]);
		if (article.length === 0) {
			return res.json(404, { msg: 'article not found' });
		}
		
		const updateFields = [];
		const params = [];
		
		if (req.body.title !== undefined) {
			updateFields.push('title = ?');
			params.push(req.body.title);
		}
		
		if (req.body.content !== undefined) {
			updateFields.push('content = ?');
			params.push(req.body.content);
			// 计算新的content_hash
			const contentHash = calculateContentHash(req.body.content);
			updateFields.push('content_hash = ?');
			params.push(contentHash);
		}
		
		if (req.body.is_draft !== undefined) {
			updateFields.push('is_draft = ?');
			params.push(req.body.is_draft);
		}
		
		if (req.body.article_type !== undefined) {
			updateFields.push('article_type = ?');
			params.push(req.body.article_type);
		}
		
		if (updateFields.length === 0) {
			return res.json(400, { msg: 'no fields to update' });
		}
		
		// 添加更新时间
		updateFields.push('update_time = ?');
		params.push(new Date());
		
		// 添加文章ID参数
		params.push(req.body.article_id);
		
		const sql = `UPDATE articles SET ${updateFields.join(', ')} WHERE article_id = ?`;
		await query(sql, params);
		
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 添加获取小说详情接口
router.get('/get_novel_detail', auth, async function (req, res) {
	try {
		if (!req.query.novel_id) {
			return res.json(400, { msg: 'missing novel_id parameter' });
		}
		
		const novelId = req.query.novel_id;
		const novel = await query(`
			SELECT n.*, u.name author_name 
			FROM novels n 
			JOIN users u ON n.author_id = u.user_id 
			WHERE n.novel_id = ? AND n.deleted = 0
		`, [novelId]);
		
		if (novel.length === 0) {
			return res.json(404, { msg: 'novel not found' });
		}
		
		// 获取小说标签
		const tags = await query(`
			SELECT t.* FROM novel_tag nt 
			JOIN tags t ON nt.tag_id = t.tag_id 
			WHERE nt.novel_id = ?
		`, [novelId]);
		
		// 统计文章数
		const articlesCount = await query('SELECT COUNT(*) as count FROM articles WHERE novel_id = ? AND deleted = 0', [novelId]);
		
		res.json({
			novel: novel[0],
			tags,
			articlesCount: articlesCount[0].count
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
