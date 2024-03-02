// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
const jwt = require('jsonwebtoken');
let axios = require('axios');
const SECRET = require('../SECRET.js').SECRET;
let bank = require('../bin/bank.js');

// 创建路由对象
let router = express.Router();

router.get('/get_resources', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		await bank.checkAccount(user);
		let results = await query('SELECT * FROM user_bank WHERE user_id = ?', [
			user.user_id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
