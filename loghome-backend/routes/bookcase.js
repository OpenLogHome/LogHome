// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let message = require('../bin/message.js');

const HAYCRAFT_TAG_FLAG_SQL = `EXISTS (
	SELECT 1
	FROM novel_tag haycraft_nt
	JOIN tags haycraft_t ON haycraft_t.tag_id = haycraft_nt.tag_id
	WHERE haycraft_nt.novel_id = n.novel_id
		AND haycraft_t.is_deleted = 0
		AND LOWER(TRIM(haycraft_t.tag_name)) LIKE '%haycraft%'
)`;

// 创建路由对象
let router = express.Router();

router.get('/get_likes_of', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`SELECT
				n.*,
				u.user_id auther_id,
				u.name author_name,
				u.avatar_url auther_avatar,
				${HAYCRAFT_TAG_FLAG_SQL} AS is_haycraft
			FROM bookcase b
			INNER JOIN novels n ON b.novel_id = n.novel_id
			LEFT JOIN users u ON n.author_id = u.user_id
			WHERE b.user_id = ?`,
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
