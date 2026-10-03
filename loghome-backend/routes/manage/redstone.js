// 红石余额管理（管理侧）
let crypto = require('crypto');
let express = require('express');
let { query, withTransaction } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
let redstone = require('../../bin/redstone.js');

let router = express.Router();

// 获取红石账户列表
router.get('/accounts', auth, async function (req, res) {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 20);
		const offset = (page - 1) * pageSize;
		const keyword = String(req.query.keyword || '').trim();
		const minBalance = req.query.min_balance === '' || req.query.min_balance === undefined
			? null
			: Number(req.query.min_balance);

		let whereClause = 'WHERE 1 = 1';
		let params = [];

		if (keyword) {
			whereClause += ' AND (b.user_id = ? OR u.name LIKE ?)';
			params.push(keyword, `%${keyword}%`);
		}

		if (minBalance !== null && Number.isFinite(minBalance)) {
			whereClause += ' AND b.redstone >= ?';
			params.push(minBalance);
		}

		const list = await query(
			`SELECT b.user_id, u.name, u.avatar_url, u.motto, u.activated,
			        b.log, b.redstone
			 FROM user_bank b
			 LEFT JOIN users u ON u.user_id = b.user_id
			 ${whereClause}
			 ORDER BY b.redstone DESC, b.user_id ASC
			 LIMIT ?, ?`,
			[...params, offset, pageSize],
		);

		const totalRows = await query(
			`SELECT COUNT(*) AS total
			 FROM user_bank b
			 LEFT JOIN users u ON u.user_id = b.user_id
			 ${whereClause}`,
			params,
		);

		res.json({
			code: 200,
			data: {
				list,
				total: totalRows[0] ? totalRows[0].total : 0,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 获取指定用户的红石流水
router.get('/accounts/:userId/transactions', auth, async function (req, res) {
	try {
		const userId = Number(req.params.userId);
		if (!Number.isInteger(userId) || userId <= 0) {
			return res.json(400, { msg: 'user_id 参数无效' });
		}
		const type = String(req.query.type || '').trim();
		const data = await redstone.listTransactions(userId, req.query.page, req.query.pageSize);
		const list = type
			? data.list.filter((item) => item.transaction_type === type)
			: data.list;
		res.json({
			code: 200,
			data: {
				...data,
				list,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 调整用户红石余额
router.post('/adjust', auth, async function (req, res) {
	try {
		const userId = Number(req.body.user_id);
		const amount = Number(req.body.amount);
		const reason = String(req.body.reason || '').trim().slice(0, 255) || '管理员调整';

		if (!Number.isInteger(userId) || userId <= 0) {
			return res.json(400, { msg: 'user_id 参数无效' });
		}
		if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 1000000) {
			return res.json(400, { msg: '调整数量必须是绝对值不超过 1000000 的非零整数' });
		}

		const userRows = await query('SELECT user_id FROM users WHERE user_id = ? LIMIT 1', [userId]);
		if (userRows.length === 0) {
			return res.json(404, { msg: '用户不存在' });
		}

		const adminUser = req.user && req.user[0] ? req.user[0] : null;
		const adminId = adminUser ? adminUser.user_id : 0;
		const requestKey = `admin-adjust:${adminId}:${userId}:${Date.now()}:${crypto.randomBytes(6).toString('hex')}`;

		const result = await withTransaction(async (transactionalQuery) => {
			await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [userId]);
			await transactionalQuery(
				'SELECT redstone FROM user_bank WHERE user_id = ? LIMIT 1 FOR UPDATE',
				[userId],
			);
			await redstone.expireRedstoneLots(transactionalQuery, userId);
			const bankRows = await transactionalQuery(
				'SELECT redstone FROM user_bank WHERE user_id = ? LIMIT 1',
				[userId],
			);
			const currentBalance = Number(bankRows[0].redstone || 0);

			if (amount < 0 && currentBalance < Math.abs(amount)) {
				const error = new Error('用户红石余额不足，无法扣除');
				error.balanceError = true;
				throw error;
			}

			const transactionResult = await transactionalQuery(
				`INSERT INTO redstone_transactions
				 (user_id, amount, log_cost, transaction_type, reference_id, period_key,
				  request_key, description, created_at)
				 VALUES (?, ?, 0, 'admin_adjustment', ?, NULL, ?, ?, CURRENT_TIMESTAMP)`,
				[
					userId,
					amount,
					adminId ? String(adminId) : null,
					requestKey,
					`管理员(${adminId})${amount > 0 ? '发放' : '扣除'}${Math.abs(amount)}红石：${reason}`,
				],
			);
			if (amount > 0) {
				await redstone.createRedstoneLot(transactionalQuery, {
					userId,
					amount,
					sourceTransactionId: transactionResult.insertId,
					expires: false,
				});
			} else {
				await redstone.consumeRedstoneLots(
					transactionalQuery,
					userId,
					Math.abs(amount),
					transactionResult.insertId,
				);
			}
			await transactionalQuery(
				'UPDATE user_bank SET redstone = redstone + ? WHERE user_id = ?',
				[amount, userId],
			);
			return {
				user_id: userId,
				amount,
				balance: currentBalance + amount,
				reason,
			};
		}, 'admin adjust redstone');

		res.json({ code: 200, data: result });
	} catch (e) {
		if (e && e.balanceError) {
			return res.json(400, { msg: e.message });
		}
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
