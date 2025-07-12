// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let moment = require('moment');
let message = require('../bin/message.js');
var md5 = require('js-md5');
let bank = require('../bin/bank.js')
const SECRET = require('../bin/SECRET.js');
const AfdianAPI = require('../bin/afdian');
const afdian = new AfdianAPI(SECRET.afdianUserId, SECRET.afdianUserToken);

let payType = [{
	number: '300',
	money: '3',
	url: "https://afdian.com/item/2c2b071e6bf011eeaeda5254001e7c00"
},
{
	number: '520',
	money: '5',
	url: "https://afdian.com/item/ae822b0c6bf011eea29652540025c377"
},
{
	number: '1725',
	money: '15',
	url: "https://afdian.com/item/bb7eb0646bf011ee961552540025c377"
},
{
	number: '3840',
	money: '32',
	url: "https://afdian.com/item/e34d448e6bf011ee969d52540025c377"
},
{
	number: '8840',
	money: '68',
	url: "https://afdian.com/item/f3b4dae46bf011ee9b0e52540025c377"
}]

// 创建路由对象
let router = express.Router();

// router.get('/get_user_pay_code', auth, async function (req, res) {
// 	try {
// 		let user = req.user;
// 		user = JSON.parse(JSON.stringify(user))[0];
// 		if (user.pay_code == undefined) {
// 			let pay_code = randomRange(11, 11);
// 			await query("UPDATE users set pay_code = ? WHERE user_id = ?", [pay_code, user.user_id]);
// 			res.end(pay_code);
// 		} else {
// 			res.end(user.pay_code);
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		res.json(400, { msg: 'bad request' });
// 	}
// });

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

// router.post('/receive_payment', async function (req, res) {
// 	try {
// 		res.end(JSON.stringify({ ec: 200 }));
// 		let total_amount = Number(req.body.data.order.total_amount);
// 		let plan_title = req.body.data.order.plan_title;
// 		let remark = req.body.data.order.remark;
// 		let log_amount = /(?!支持原木社区（兑换)\d*(?=原木）)/.exec(plan_title)[0];
// 		let user = await query("SELECT * FROM users WHERE pay_code = ?", [remark]);
// 		if(user.length > 0){
// 			user = user[0];
// 			for(let item of payType){
// 				if(item.number == log_amount){
// 					let mult = total_amount / item.money;
// 					bank.addAmount(user, "log", Number(log_amount)*mult);
// 					message.sendMail(-1, user.user_id, `感谢信\n您支持了原木社区${total_amount}元，兑换原木${Number(log_amount)*mult}已到账，请注意查收。原木社区开发团队全体感谢您对社区运营和发展的支持！`,"None",false)
// 				}
// 			}
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		res.json(400, { msg: 'bad request' });
// 	}
// });

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

router.post('/create_order', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		// 生成订单号：年月日时分秒 + 12位随机数
		const now = new Date();
		const timestamp = now.getFullYear().toString() +
			String(now.getMonth() + 1).padStart(2, '0') +
			String(now.getDate()).padStart(2, '0') +
			String(now.getHours()).padStart(2, '0') +
			String(now.getMinutes()).padStart(2, '0') +
			String(now.getSeconds()).padStart(2, '0');
		const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
		const payment_id = timestamp + random;

		// 插入订单记录
		const result = await query(
			'INSERT INTO recharge_payments (payment_id, log_amount, pay_amount, user_id, status) VALUES (?, ?, ?, ?, ?)',
			[payment_id, req.body.log_amount, req.body.pay_amount, user.user_id, 'created']
		);

		res.json({
			code: 200,
			data: {
				payment_id: payment_id,
				log_amount: req.body.log_amount,
				pay_amount: req.body.pay_amount,
				status: 'created',
				create_time: new Date()
			}
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: '创建订单失败' });
	}
});

// 获取用户历史订单列表
router.get('/order_history', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		// 可选分页参数
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		
		// 查询订单总数
		const countResult = await query(
			'SELECT COUNT(*) as total FROM recharge_payments WHERE user_id = ?',
			[user.user_id]
		);
		const total = countResult[0].total;
		
		// 查询订单列表
		const orders = await query(
			'SELECT payment_id, log_amount, pay_amount, status, create_time, update_time FROM recharge_payments WHERE user_id = ? ORDER BY create_time DESC LIMIT ?, ?',
			[user.user_id, offset, pageSize]
		);
		
		res.json({
			code: 200,
			data: {
				total: total,
				page: page,
				pageSize: pageSize,
				list: orders
			}
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: '获取订单历史失败' });
	}
});

// 查询单个订单状态
router.get('/order_status', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		const payment_id = req.query.payment_id;
		if (!payment_id) {
			res.json(400, { msg: '订单号不能为空' });
			return;
		}
		
		// 查询订单信息
		const order = await query(
			'SELECT payment_id, log_amount, pay_amount, status, create_time, update_time FROM recharge_payments WHERE payment_id = ? AND user_id = ?',
			[payment_id, user.user_id]
		);
		
		if (order.length === 0) {
			res.json(404, { msg: '订单不存在' });
			return;
		}
		
		// 如果订单状态不是已支付，通过爱发电API查询最新状态
		if (order[0].status !== 'paid') {
			try {
				// 调用爱发电API查询订单状态
				const afdianResponse = await afdian.queryOrder(1, 10, payment_id);
				
				// 检查API返回结果
				if (afdianResponse && afdianResponse.ec === 200) {
					const orderList = afdianResponse.data.list;
					
					// 如果在爱发电找到了该订单
					if (orderList && orderList.length == 1) {
						const afdianOrder = orderList.find(item => (item.custom_order_id === payment_id || item.remark === payment_id));
						
						if (afdianOrder && afdianOrder.status === 2) { // 爱发电支付成功状态
							// 更新本地订单状态
							const payTime = new Date();
							await query(
								'UPDATE recharge_payments SET status = ?, update_time = ? WHERE payment_id = ?',
								['paid', payTime, payment_id]
							);
							
							// 更新返回给前端的订单信息
							order[0].status = 'paid';
							order[0].update_time = payTime;
							
							// 增加用户原木数量
							await bank.addAmount(user, "log", Number(order[0].log_amount));
							
							// 发送消息通知
							await message.sendMail(
								-1, 
								user.user_id, 
								`充值成功\n您已成功充值${order[0].pay_amount}元，兑换原木${order[0].log_amount}已到账，请注意查收。`,
								"None",
								false
							);
						}
					}
				}
			} catch (error) {
				console.log('查询爱发电API失败:', error);
				// 查询失败不影响返回本地订单信息
			}
		}
		
		res.json({
			code: 200,
			data: order[0]
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: '查询订单状态失败' });
	}
});

// 用户取消订单
router.post('/cancel_order', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		const payment_id = req.body.payment_id;
		if (!payment_id) {
			res.json(400, { msg: '订单号不能为空' });
			return;
		}
		
		// 查询订单信息
		const orderQuery = await query(
			'SELECT * FROM recharge_payments WHERE payment_id = ? AND user_id = ?',
			[payment_id, user.user_id]
		);
		
		if (orderQuery.length === 0) {
			res.json(404, { msg: '订单不存在' });
			return;
		}
		
		const order = orderQuery[0];
		if (order.status !== 'created') {
			res.json(400, { msg: '只能取消待支付的订单' });
			return;
		}
		
		// 更新订单状态为已取消
		await query(
			'UPDATE recharge_payments SET status = ?, update_time = ? WHERE payment_id = ?',
			['cancelled', new Date(), payment_id]
		);
		
		res.json({
			code: 200,
			msg: '订单已取消',
			data: {
				payment_id: payment_id,
				status: 'cancelled'
			}
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: '取消订单失败' });
	}
});

// 礼品卡兑换原木
router.post('/redeem_gift_card', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		const card_code = req.body.card_code;
		if (!card_code) {
			res.json(400, { msg: '礼品卡兑换码不能为空' });
			return;
		}
		
		// 查询礼品卡信息
		const giftCard = await query(
			'SELECT * FROM log_gift_card WHERE card_code = ? AND is_used = 0',
			[card_code]
		);
		
		if (giftCard.length === 0) {
			res.json(404, { msg: '礼品卡不存在或已被使用' });
			return;
		}
		
		// 开始事务
		await query('START TRANSACTION');
		
		try {
			// 标记礼品卡为已使用状态
			await query(
				'UPDATE log_gift_card SET is_used = 1, used_time = ?, used_by = ? WHERE card_code = ?',
				[new Date(), user.user_id, card_code]
			);
			
			// 给用户添加相应数量的原木
			const logAmount = giftCard[0].log_amount;
			await bank.addAmount(user, "log", logAmount);
			
			// 记录兑换日志
			await query(
				'INSERT INTO recharge_payments (payment_id, log_amount, pay_amount, user_id, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[`GIFT-${Date.now()}`, logAmount, 0, user.user_id, 'paid', new Date(), new Date()]
			);
			
			// 发送消息通知
			await message.sendMail(
				-1, 
				user.user_id, 
				`礼品卡兑换成功\n您已成功兑换礼品卡，获得${logAmount}原木已到账，请注意查收。`,
				"None",
				false
			);
			
			// 提交事务
			await query('COMMIT');
			
			res.json({
				code: 200,
				msg: '礼品卡兑换成功',
				data: {
					log_amount: logAmount
				}
			});
		} catch (error) {
			// 发生错误，回滚事务
			await query('ROLLBACK');
			throw error;
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: '礼品卡兑换失败' });
	}
});

// 去皮原木兑换原木
router.post('/exchange_logs', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		
		const cropped_log_amount = parseFloat(req.body.cropped_log_amount);
		if (!cropped_log_amount || cropped_log_amount <= 0) {
			res.json(400, { msg: '兑换数量必须大于0' });
			return;
		}
		
		// 获取用户当前资源情况
		const userBank = await query(
			'SELECT * FROM user_bank WHERE user_id = ?',
			[user.user_id]
		);
		
		if (userBank.length === 0) {
			res.json(404, { msg: '用户资源记录不存在' });
			return;
		}
		
		const currentCroppedLog = parseInt(userBank[0].cropped_log) || 0;
		
		// 检查余额是否足够
		if (currentCroppedLog < cropped_log_amount) {
			res.json(400, { msg: '去皮原木余额不足' });
			return;
		}
		
		// 计算兑换结果 (1:1.25 比例)，舍去小数部分
		const log_amount = Math.floor(cropped_log_amount * 1.25);
		
		// 开始事务
		await query('START TRANSACTION');
		
		try {
			// 扣除去皮原木
			await query(
				'UPDATE user_bank SET cropped_log = cropped_log - ? WHERE user_id = ?',
				[cropped_log_amount, user.user_id]
			);
			
			// 增加普通原木
			await query(
				'UPDATE user_bank SET log = log + ? WHERE user_id = ?',
				[log_amount, user.user_id]
			);
			
			// 记录兑换日志
			await query(
				'INSERT INTO recharge_payments (payment_id, log_amount, pay_amount, user_id, status, create_time, update_time, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
				[`EXCHANGE-${Date.now()}`, log_amount, 0, user.user_id, 'paid', new Date(), new Date(), `从 ${cropped_log_amount} 去皮原木兑换`]
			);
			
			// 发送消息通知
			await message.sendMail(
				-1, 
				user.user_id, 
				`去皮原木兑换成功\n您已成功将 ${cropped_log_amount} 去皮原木兑换为 ${log_amount} 原木（兑换比例1:1.25，小数部分已舍去），已到账，请注意查收。`,
				"None",
				false
			);
			
			// 提交事务
			await query('COMMIT');
			
			res.json({
				code: 200,
				msg: '兑换成功',
				data: {
					cropped_log_amount: cropped_log_amount,
					log_amount: log_amount
				}
			});
		} catch (error) {
			// 发生错误，回滚事务
			await query('ROLLBACK');
			throw error;
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: '兑换失败' });
	}
});

module.exports = router;
