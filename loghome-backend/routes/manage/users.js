// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');

// 创建路由对象
let router = express.Router();

router.post('/send_message', auth, async function (req, res) {
	try {
		message.sendMsg(
			req.body.from_id,
			req.body.to_id,
			req.body.msg,
			req.body.navigate_to,
			"mention",
			true,
		);
		res.end('success');
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_user_amount', auth, async function (req, res) {
	try {
		let result = await query('SELECT COUNT(*) count FROM users');
		res.end(JSON.stringify(result));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_users', auth, async function (req, res) {
	try {
		let result = await query('SELECT * FROM users LIMIT ?,20', [
			(Number(req.query.page) - 1) * 20,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_user_by_id', auth, async function (req, res) {
	try {
		let result = await query('SELECT * FROM users WHERE user_id = ?', [
			req.query.user_id,
		]);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/user_activating_set', auth, async function (req, res) {
	try {
		let result = await query(
			'UPDATE users SET activated = ? WHERE user_id = ?',
			[req.body.activate, req.body.user_id],
		);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
