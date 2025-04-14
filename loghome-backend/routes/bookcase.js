// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let message = require('../bin/message.js');

// 创建路由对象
let router = express.Router();

router.get('/get_likes_of', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT novels.* FROM bookcase,novels WHERE user_id = ? AND bookcase.`novel_id` = novels.`novel_id`',
			[user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/like_novel', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'INSERT INTO bookcase(user_id,novel_id) VALUES(?,?)',
			[user.user_id, req.body.novel_id],
		);
		let novel = JSON.parse(
			JSON.stringify(
				await query('SELECT * FROM novels WHERE novel_id = ?', [
					req.body.novel_id,
				]),
			),
		)[0];
		message.sendMsg(
			user.user_id,
			novel.author_id,
			'等朋友收藏了你的作品《' + novel.name + '》',
			'readers/bookInfo?id=' + req.body.novel_id,
			'like_collect',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/remove_like_novel', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'DELETE FROM bookcase WHERE user_id = ? AND novel_id = ?',
			[user.user_id, req.body.novel_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
