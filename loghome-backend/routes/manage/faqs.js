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
		let sqlQuery = 'SELECT COUNT(*) count FROM faqs f';
		let sqlParams = [];
		let hasCondition = false;
		
		// 如果需要筛选用户名，需要联表
		if (req.query.name) {
			sqlQuery = 'SELECT COUNT(*) count FROM faqs f, users u WHERE f.user_id = u.user_id';
			hasCondition = true;
		}
		
		// 添加过滤条件
		if (req.query.filter === 'unsolved') {
			sqlQuery += hasCondition ? ' AND f.solved = 0' : ' WHERE f.solved = 0';
			hasCondition = true;
		} else if (req.query.filter === 'typical') {
			sqlQuery += hasCondition ? ' AND f.is_typical = 1' : ' WHERE f.is_typical = 1';
			hasCondition = true;
		}
		
		// 添加名称筛选
		if (req.query.name) {
			sqlQuery += ' AND u.name LIKE ?';
			sqlParams.push('%' + req.query.name + '%');
		}
		
		let results = await query(sqlQuery, sqlParams);
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

router.get('/get_faqs_amount_typical', auth, async function (req, res) {
	try {
		let results = await query(
			'SELECT COUNT(*) count FROM faqs WHERE is_typical = 1',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_all_faqs', auth, async function (req, res) {
	try {
		let sqlQuery = 'SELECT f.*,u.name FROM faqs f,users u WHERE f.user_id = u.user_id';
		let sqlParams = [];
		
		// 添加过滤条件
		if (req.query.filter === 'unsolved') {
			sqlQuery += ' AND f.solved = 0';
		} else if (req.query.filter === 'typical') {
			sqlQuery += ' AND f.is_typical = 1';
		}
		
		// 添加名称筛选
		if (req.query.name) {
			sqlQuery += ' AND u.name LIKE ?';
			sqlParams.push('%' + req.query.name + '%');
		}
		
		// 添加排序和分页
		sqlQuery += ' ORDER BY f.faq_id DESC LIMIT ?,20';
		sqlParams.push((Number(req.query.page) - 1) * 20);
		
		let results = await query(sqlQuery, sqlParams);
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
			'notification',
			true,
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
