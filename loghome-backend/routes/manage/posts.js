// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');
let axios = require('axios');

// 创建路由对象
let router = express.Router();

router.get('/get_posts_amount', auth, async function (req, res) {
	try {
		let results = await query('SELECT COUNT(*) count FROM posts');
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_all_posts', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT p.post_id,p.title,u.name FROM posts p,users u WHERE p.author_id = u.user_id ORDER BY p.post_id DESC LIMIT ?,20',
			[(Number(req.query.page) - 1) * 20],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_post_by_id', auth, async function (req, res) {
	try {
		let results = await query('SELECT * FROM posts WHERE post_id = ?', [
			req.query.post_id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/edit_post', auth, async function (req, res) {
	try {
		//判断是新增还是修改
		if (req.body.post_id) {
			if (req.body.title != undefined) {
				await query('UPDATE posts SET title = ? WHERE post_id = ?', [
					req.body.title,
					req.body.post_id,
				]);
			}
			if (req.body.content != undefined) {
				await query('UPDATE posts SET content = ? WHERE post_id = ?', [
					req.body.content,
					req.body.post_id,
				]);
			}
			res.end('success');
		} else {
			if (req.body.title != undefined && req.body.content != undefined) {
				await query(
					'INSERT INTO posts(title,content,author_id) VALUES(?,?,?)',
					[req.body.title, req.body.content, 0],
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

router.post('/delete_post', auth, async function (req, res) {
	try {
		if (!req.body.post_id) {
			return res.json(400, { msg: 'missing post_id' });
		}
		// 删除帖子
		await query('UPDATE posts SET deleted = 1 WHERE post_id = ?', [req.body.post_id]);
		
		res.end('success');
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
