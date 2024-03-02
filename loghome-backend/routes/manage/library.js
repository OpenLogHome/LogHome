// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let moment = require('moment');
let message = require('../../bin/message.js');
let bank = require('../../bin/bank.js');

// 创建路由对象
let router = express.Router();

router.get('/get_library_roulous_chart', auth, async function (req, res) {
	try {
		let roulous_chart = await query('SELECT * FROM library_roulous_chart');
		res.end(JSON.stringify(roulous_chart));
	} catch (e) {
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/edit_library_roulous_chart', auth, async function (req, res) {
	try {
		//判断是新增还是修改
		if (req.body.id) {
			if (req.body.name != undefined) {
				await query('UPDATE library_roulous_chart SET name = ? WHERE id = ?', [
					req.body.name,
					req.body.id,
				]);
			}
			if (req.body.image != undefined) {
				await query('UPDATE library_roulous_chart SET image = ? WHERE id = ?', [
					req.body.image,
					req.body.id,
				]);
			}
			if (req.body.title != undefined) {
				await query('UPDATE library_roulous_chart SET title = ? WHERE id = ?', [
					req.body.title,
					req.body.id,
				]);
			}
			if (req.body.navigate_to != undefined) {
				await query(
					'UPDATE library_roulous_chart SET navigate_to = ? WHERE id = ?',
					[req.body.navigate_to, req.body.id],
				);
			}
			if (req.body.isValid != undefined) {
				await query(
					'UPDATE library_roulous_chart SET isValid = ? WHERE id = ?',
					[req.body.isValid, req.body.id],
				);
				console.log(req.body.isValid);
			}
			res.end('success');
		} else {
			if (
				req.body.name != undefined &&
				req.body.image != undefined &&
				req.body.title != undefined &&
				req.body.navigate_to != undefined
			) {
				await query(
					'INSERT INTO library_roulous_chart(name,image,title,navigate_to,isValid) VALUES(?,?,?,?,?)',
					[
						req.body.name,
						req.body.image,
						req.body.title,
						req.body.navigate_to,
						1,
					],
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

module.exports = router;
