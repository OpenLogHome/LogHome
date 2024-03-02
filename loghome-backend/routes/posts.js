// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let moment = require('moment');
let message = require('../bin/message.js');

// 创建路由对象
let router = express.Router();

router.get('/get_post', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM posts WHERE post_id = ? AND deleted = 0',
			[req.query.id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
