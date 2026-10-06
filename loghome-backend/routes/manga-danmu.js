// 漫画弹幕路由：弹幕与作品（novel_id）、话数（article_id）及阅读页码（page_idx，0 基）绑定。
// 挂载在 /community 前缀下，与漫画评论接口同级。
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');

let router = express.Router();

const MAX_CONTENT_LENGTH = 100;

router.post('/manga_danmu', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	const content = String(req.body.content || '').trim();
	if (!content) {
		res.json(400, { msg: '弹幕内容不能为空' });
		return;
	}
	if (content.length > MAX_CONTENT_LENGTH) {
		res.json(400, { msg: '弹幕最多' + MAX_CONTENT_LENGTH + '个字' });
		return;
	}
	try {
		let results = await query(
			'INSERT INTO manga_danmus(user_id, novel_id, article_id, page_idx, content) VALUES(?,?,?,?,?)',
			[user.user_id, req.body.novel_id, req.body.article_id, Number(req.body.page_idx) || 0, content],
		);
		let rows = await query(
			`SELECT d.danmu_id, d.user_id, d.novel_id, d.article_id, d.page_idx, d.content, d.danmu_time, u.name
			 FROM manga_danmus d, users u
			 WHERE d.user_id = u.user_id AND d.danmu_id = ?`,
			[results.insertId],
		);
		res.end(JSON.stringify(rows[0]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 拉取某话弹幕（默认整话返回，前端按 page_idx 分组；也可用 pageIdx 只取一页）
router.get('/manga_danmus', async function (req, res) {
	try {
		let condition = 'd.novel_id = ? AND d.article_id = ? AND d.deleted = 0';
		let params = [req.query.id, req.query.articleId];
		if (req.query.pageIdx !== undefined) {
			condition += ' AND d.page_idx = ?';
			params.push(Number(req.query.pageIdx) || 0);
		}
		let results = await query(
			`SELECT d.danmu_id, d.user_id, d.novel_id, d.article_id, d.page_idx, d.content, d.danmu_time, u.name
			 FROM manga_danmus d, users u
			 WHERE d.user_id = u.user_id AND ${condition}
			 ORDER BY d.danmu_id`,
			params,
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 删除弹幕（软删）：发送者本人或作品作者均可删除
router.get('/delete_manga_danmu', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let rows = await query(
			`SELECT d.user_id, n.author_id
			 FROM manga_danmus d, novels n
			 WHERE d.danmu_id = ? AND d.deleted = 0 AND n.novel_id = d.novel_id`,
			[req.query.id],
		);
		rows = JSON.parse(JSON.stringify(rows));
		if (rows.length == 0) {
			res.json(400, { msg: 'bad request' });
			return;
		}
		const canDelete = rows[0].user_id == Number(user.user_id) || rows[0].author_id == Number(user.user_id);
		if (!canDelete) {
			res.json(400, { msg: '没有权限删除这条弹幕' });
			return;
		}
		let results = await query(
			'UPDATE manga_danmus SET deleted = 1 WHERE danmu_id = ?',
			[req.query.id],
		);
		if (results.affectedRows > 0) {
			res.json(200, { msg: 'success' });
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
