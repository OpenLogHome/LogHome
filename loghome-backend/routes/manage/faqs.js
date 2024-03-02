// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');

// 创建路由对象
let router = express.Router();

router.get('/get_faqs_amount', auth, async function (req, res) {
	try {
		let results = await query('SELECT COUNT(*) count FROM faqs');
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_faqs_amount_to_solve', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT COUNT(*) count FROM faqs WHERE solved = 0',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_all_faqs', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT f.*,u.name FROM faqs f,users u WHERE f.user_id = u.user_id ORDER BY faq_id DESC LIMIT ?,20',
			[(Number(req.query.page) - 1) * 20],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_faq_by_id', auth, async function (req, res) {
	try {
		let results = await query('SELECT * FROM faqs WHERE faq_id = ?', [
			req.query.faq_id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/set_typical', auth, async function (req, res) {
	try {
		let results = await query(
			'UPDATE faqs SET is_typical = ? WHERE faq_id = ?',
			[req.body.is_typical, req.body.faq_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/submit_answer', auth, async function (req, res) {
	try {
		let results = await query(
			'UPDATE faqs SET answer = ? , solved = 1 , admin_id = ? , answer_time = ? WHERE faq_id = ?',
			[req.body.answer, req.body.me_id, new Date(), req.body.faq_id],
		);
		let result = await query('SELECT * FROM faqs WHERE faq_id = ?', [
			req.body.faq_id,
		]);
		message.sendMsg(
			-1,
			result[0].user_id,
			'你的反馈已经被回复，快来看看吧！',
			'apps/faqs/feedback?id=' + result[0].faq_id,
			true,
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
