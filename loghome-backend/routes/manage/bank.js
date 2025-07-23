// 引入依赖包
let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let bank = require('../../bin/bank.js');
let messageController = require('../../bin/message.js');

// 创建路由对象
let router = express.Router();

// 获取用户银行账户总数
router.get('/get_bank_accounts_amount', auth, async function (req, res) {
	try {
		const keyword = req.query.keyword || null;
		
		let sql = 'SELECT COUNT(*) count FROM users u LEFT JOIN user_bank b ON u.user_id = b.user_id';
		let params = [];
		
		if (keyword) {
			sql += ' WHERE u.user_id LIKE ? OR u.name LIKE ? OR u.account LIKE ?';
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
		}
		
		let result = await query(sql, params);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 分页获取用户银行账户列表
router.get('/get_bank_accounts', auth, async function (req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 20;
		const offset = (page - 1) * pageSize;
		const keyword = req.query.keyword || null;
		
		// 联合查询用户信息和银行账户信息
		let sql = 'SELECT u.user_id, u.name, u.account, u.avatar_url, b.log, b.apple, b.cropped_log ' +
			'FROM users u ' +
			'LEFT JOIN user_bank b ON u.user_id = b.user_id ';
		
		let params = [];
		
		if (keyword) {
			sql += 'WHERE u.user_id LIKE ? OR u.name LIKE ? OR u.account LIKE ? ';
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
		}
		
		sql += 'ORDER BY u.user_id LIMIT ?, ?';
		params.push(offset, pageSize);
		
		let result = await query(sql, params);
		
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 根据用户ID获取银行账户信息
router.get('/get_bank_account_by_user_id', auth, async function (req, res) {
	try {
		const userId = req.query.user_id;
		if (!userId) {
			res.json(400, { msg: '用户ID不能为空' });
			return;
		}
		
		// 联合查询用户信息和银行账户信息
		let result = await query(
			'SELECT u.user_id, u.name, u.account, u.avatar_url, b.log, b.apple, b.cropped_log ' +
			'FROM users u ' +
			'LEFT JOIN user_bank b ON u.user_id = b.user_id ' +
			'WHERE u.user_id = ?',
			[userId]
		);
		
		if (result.length === 0) {
			res.json(404, { msg: '用户不存在' });
			return;
		}
		
		res.end(JSON.stringify(result[0]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 修改用户银行账户余额
router.post('/update_bank_account', auth, async function (req, res) {
	try {
		const { user_id, item_name, amount, operation, message, send_message } = req.body;
		
		if (!user_id || !item_name || amount === undefined || !operation) {
			res.json(400, { msg: '参数不完整' });
			return;
		}
		
		// 检查item_name是否有效
		if (!['log', 'apple', 'cropped_log'].includes(item_name)) {
			res.json(400, { msg: '无效的资源类型' });
			return;
		}
		
		// 获取用户信息
		const userResult = await query('SELECT * FROM users WHERE user_id = ?', [user_id]);
		if (userResult.length === 0) {
			res.json(404, { msg: '用户不存在' });
			return;
		}
		
		const user = userResult[0];
		let success = false;
		
		// 执行操作
		if (operation === 'add') {
			success = await bank.addAmount(user, item_name, Number(amount));
		} else if (operation === 'subtract') {
			success = await bank.useAmount(user, item_name, Number(amount), false);
		} else {
			res.json(400, { msg: '无效的操作类型' });
			return;
		}
		
		if (success) {
			// 获取更新后的账户信息
			const updatedAccount = await query('SELECT * FROM user_bank WHERE user_id = ?', [user_id]);
			
			// 如果需要发送消息给用户
			if (send_message && message) {
				const operationText = operation === 'add' ? '增加' : '减少';
				const itemText = item_name === 'log' ? '原木' : (item_name === 'apple' ? '苹果' : '裁剪原木');
				const msgContent = `管理员已${operationText}您的${itemText}数量：${amount}。${message}`;
				
				// 发送消息给用户
				await messageController.sendMsg('-1', user_id, msgContent, '', 'notification', true);
			}
			
			res.json({
				code: 200,
				msg: '操作成功',
				data: updatedAccount[0]
			});
		} else {
			res.json(400, { msg: '操作失败，可能是余额不足' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取充值订单总数
router.get('/get_payment_orders_amount', auth, async function (req, res) {
	try {
		const status = req.query.status || null;
		const keyword = req.query.keyword || null;
		
		let sql = 'SELECT COUNT(*) count FROM recharge_payments p';
		let params = [];
		
		if (status || keyword) {
			sql += ' WHERE ';
			
			if (status) {
				sql += 'p.status = ?';
				params.push(status);
			}
			
			if (keyword) {
				if (status) sql += ' AND ';
				sql += '(p.payment_id LIKE ? OR p.user_id LIKE ?)';
				params.push(`%${keyword}%`, `%${keyword}%`);
			}
		}
		
		let result = await query(sql, params);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 分页获取充值订单列表
router.get('/get_payment_orders', auth, async function (req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 20;
		const offset = (page - 1) * pageSize;
		const status = req.query.status || null;
		const keyword = req.query.keyword || null;
		
		let sql = 'SELECT p.payment_id, p.log_amount, p.pay_amount, p.user_id, p.status, ' +
			'p.create_time, p.update_time, p.remark, u.name, u.account, u.avatar_url ' +
			'FROM recharge_payments p ' +
			'LEFT JOIN users u ON p.user_id = u.user_id ';
		
		let params = [];
		let whereAdded = false;
		
		if (status || keyword) {
			sql += 'WHERE ';
			whereAdded = true;
			
			if (status) {
				sql += 'p.status = ? ';
				params.push(status);
			}
			
			if (keyword) {
				if (status) sql += 'AND ';
				sql += '(p.payment_id LIKE ? OR p.user_id LIKE ?) ';
				params.push(`%${keyword}%`, `%${keyword}%`);
			}
		}
		
		sql += 'ORDER BY p.create_time DESC LIMIT ?, ?';
		params.push(offset, pageSize);
		
		let result = await query(sql, params);
		res.end(JSON.stringify(result));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 根据订单ID获取订单详情
router.get('/get_payment_order_by_id', auth, async function (req, res) {
	try {
		const paymentId = req.query.payment_id;
		if (!paymentId) {
			res.json(400, { msg: '订单ID不能为空' });
			return;
		}
		
		let result = await query(
			'SELECT p.payment_id, p.log_amount, p.pay_amount, p.user_id, p.status, ' +
			'p.create_time, p.update_time, p.remark, u.name, u.account, u.avatar_url ' +
			'FROM recharge_payments p ' +
			'LEFT JOIN users u ON p.user_id = u.user_id ' +
			'WHERE p.payment_id = ?',
			[paymentId]
		);
		
		if (result.length === 0) {
			res.json(404, { msg: '订单不存在' });
			return;
		}
		
		res.end(JSON.stringify(result[0]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 更新订单状态
router.post('/update_payment_order_status', auth, async function (req, res) {
	try {
		const { payment_id, status, remark, send_message } = req.body;
		
		if (!payment_id || !status) {
			res.json(400, { msg: '参数不完整' });
			return;
		}
		
		// 检查状态是否有效
		if (!['created', 'paid', 'cancelled'].includes(status)) {
			res.json(400, { msg: '无效的订单状态' });
			return;
		}
		
		// 获取订单信息
		const orderResult = await query(
			'SELECT * FROM recharge_payments WHERE payment_id = ?',
			[payment_id]
		);
		
		if (orderResult.length === 0) {
			res.json(404, { msg: '订单不存在' });
			return;
		}
		
		const order = orderResult[0];
		
		// 如果订单已经是目标状态，直接返回成功
		if (order.status === status) {
			res.json({
				code: 200,
				msg: '订单状态已经是' + status,
				data: order
			});
			return;
		}
		
		// 如果订单已经是终态（paid或cancelled），不允许修改
		if (order.status === 'paid' || order.status === 'cancelled') {
			res.json(400, { msg: '订单已经是终态，不能修改状态' });
			return;
		}
		
		// 更新订单状态
		await query(
			'UPDATE recharge_payments SET status = ?, update_time = ?, remark = ? WHERE payment_id = ?',
			[status, new Date(), remark || order.remark, payment_id]
		);
		
		// 如果状态更新为已支付，增加用户原木数量
		if (status === 'paid') {
			// 获取用户信息
			const userResult = await query('SELECT * FROM users WHERE user_id = ?', [order.user_id]);
			if (userResult.length > 0) {
				const user = userResult[0];
				await bank.addAmount(user, 'log', Number(order.log_amount));
				
				// 发送消息给用户
				if (send_message !== false) {
					const messageContent = `您的充值订单(ID: ${payment_id})已成功支付，${order.log_amount}原木已添加到您的账户。${remark ? '备注: ' + remark : ''}`;
					await messageController.sendMsg('-1', order.user_id, messageContent, '', 'notification', true);
				}
			}
		} else if (status === 'cancelled') {
			// 如果订单被取消，发送消息给用户
			if (send_message !== false) {
				const messageContent = `您的充值订单(ID: ${payment_id})已被取消。${remark ? '取消原因: ' + remark : ''}`;
				await messageController.sendMsg('-1', order.user_id, messageContent, '', 'notification', true);
			}
		}
		
		// 获取更新后的订单信息
		const updatedOrder = await query(
			'SELECT * FROM recharge_payments WHERE payment_id = ?',
			[payment_id]
		);
		
		res.json({
			code: 200,
			msg: '订单状态更新成功',
			data: updatedOrder[0]
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;