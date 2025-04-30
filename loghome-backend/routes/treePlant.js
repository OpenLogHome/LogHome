// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let axios = require('axios');
const { htmlToText } = require('html-to-text');
let message = require('../bin/message.js');
// 创建路由对象
let router = express.Router();
let schedule = require('node-schedule');
let bank = require('../bin/bank.js');

function getInervalHour(startDate, endDate) {
	let ms = endDate.getTime() - startDate.getTime();
	if (ms < 0) return 0;
	return Math.floor(ms / 1000 / 60 / 60);
}

router.get('/get_treePlant_of', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
			[user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/plant_tree', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
			[user.user_id],
		);
		if (results.length > 0) {
			res.json(400, { msg: 'bad request' });
		} else {
			let results = await query(
				'INSERT INTO treeplant(treeType,user_id) VALUES(?,?)',
				[req.query.tree_type, user.user_id],
			);
			res.end(JSON.stringify(results));
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/got_tree', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
			[user.user_id],
		);
		if (results.length > 0) {
			switch (results[0].tree_status) {
			case '种植':
				await query('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ?', [
					user.user_id,
				]);
				res.end('已铲除树苗');
				return;
			case '开花':
				let amount = Math.floor(3 + Math.random() * 5);
				await query('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ?', [
					user.user_id,
				]);
				bank.addAmount(user, 'log', amount);
				res.end('已收获，获得原木 ×' + amount);
				return;
			case '结果':
				let amount1 = Math.floor(1 + Math.random() * 4);
				let amount2 = Math.floor(4 + Math.random() * 10);
				await query('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ?', [
					user.user_id,
				]);
				bank.addAmount(user, 'log', amount1);
				bank.addAmount(user, 'apple', amount2);
				res.end('已收获，获得原木 × ' + amount1 + ' 苹果 × ' + amount2);
				return;
			default:
				res.json(400, { msg: 'bad request' });
			}
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
