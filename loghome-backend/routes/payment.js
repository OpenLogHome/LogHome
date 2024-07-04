// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let moment = require('moment');
let message = require('../bin/message.js');
var md5 = require('js-md5');
let bank = require('../bin/bank.js')

function randomRange(min, max) {
	var returnStr = "",
		range = (max ? Math.round(Math.random() * (max - min)) + min : min),
		charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < range; i++) {
		var index = Math.round(Math.random() * (charStr.length - 1));
		returnStr += charStr.substring(index, index + 1);
	}
	return returnStr;
}

let payType = [{
	number: '300',
	money: '3',
	url: "https://afdian.net/item/2c2b071e6bf011eeaeda5254001e7c00"
},
{
	number: '520',
	money: '5',
	url: "https://afdian.net/item/ae822b0c6bf011eea29652540025c377"
},
{
	number: '1725',
	money: '15',
	url: "https://afdian.net/item/bb7eb0646bf011ee961552540025c377"
},
{
	number: '3840',
	money: '32',
	url: "https://afdian.net/item/e34d448e6bf011ee969d52540025c377"
},
{
	number: '8840',
	money: '68',
	url: "https://afdian.net/item/f3b4dae46bf011ee9b0e52540025c377"
}]

// 创建路由对象
let router = express.Router();

router.get('/get_user_pay_code', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		if (user.pay_code == undefined) {
			let pay_code = randomRange(11, 11);
			await query("UPDATE users set pay_code = ? WHERE user_id = ?", [pay_code, user.user_id]);
			res.end(pay_code);
		} else {
			res.end(user.pay_code);
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_payment_url', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		for (let item of payType) {
			if (item.number == req.query.log && item.money == req.query.money) {
				res.end(item.url);
			}
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/receive_payment', async function (req, res) {
	try {
		res.end(JSON.stringify({ ec: 200 }));
		let total_amount = Number(req.body.data.order.total_amount);
		let plan_title = req.body.data.order.plan_title;
		let remark = req.body.data.order.remark;
		let log_amount = /(?!支持原木社区（兑换)\d*(?=原木）)/.exec(plan_title)[0];
		let user = await query("SELECT * FROM users WHERE pay_code = ?", [remark]);
		if(user.length > 0){
			user = user[0];
			for(let item of payType){
				if(item.number == log_amount){
					let mult = total_amount / item.money;
					bank.addAmount(user, "log", Number(log_amount)*mult);
					message.sendMail(-1, user.user_id, `感谢信\n您支持了原木社区${total_amount}元，兑换原木${Number(log_amount)*mult}已到账，请注意查收。原木社区开发团队全体感谢您对社区运营和发展的支持！`,"None",false)
				}
			}
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/request_earning_service', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query("SELECT * FROM earning_service WHERE user_id = ? AND finished = 0", [user.user_id]);
		if (results.length > 0) {
			res.json(400, { msg: '您还有进行中的提现服务未结束，当前服务结束后方可发起新提现服务。' });
			return;
		}
		results = await query(
			'INSERT INTO earning_service(money_amount, wechat, user_id) VALUES(?,?,?)',
			[req.query.money_amount, req.query.wechat, user.user_id],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_earning_service_records', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query("SELECT * FROM earning_service WHERE user_id = ?", [user.user_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
