const crypto = require('crypto');
const { withTransaction } = require('../sql');

const FREE_MONTHLY_REDSTONE_GRANT = 6;

function createBillingError(message, statusCode = 400, code = 'REDSTONE_BILLING_ERROR') {
	const error = new Error(message);
	error.statusCode = statusCode;
	error.code = code;
	error.isBillingError = true;
	return error;
}

function getMonthlyPeriodKey(dateValue = new Date()) {
	const date = new Date(dateValue);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildRequestKey(userId, feature, requestId) {
	const source = `${String(feature || '')}:${String(requestId || '')}`;
	const digest = crypto.createHash('sha256').update(source).digest('hex');
	return `ai-usage:${Number(userId)}:${digest}`;
}

async function ensureMonthlyFreeGrant(transactionalQuery, userId) {
	const activeRows = await transactionalQuery(
		`SELECT subscription_id
		 FROM membership_subscriptions
		 WHERE user_id = ? AND status = 'active' AND starts_at <= NOW() AND expires_at > NOW()
		 LIMIT 1`,
		[userId],
	);
	if (activeRows.length > 0) return 0;
	const periodKey = getMonthlyPeriodKey();
	const insertResult = await transactionalQuery(
		`INSERT IGNORE INTO redstone_transactions
		 (user_id, amount, log_cost, transaction_type, reference_id, period_key,
		  request_key, description, created_at)
		 VALUES (?, ?, 0, 'monthly_free_grant', ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
		[
			userId,
			FREE_MONTHLY_REDSTONE_GRANT,
			`ordinary-user:${userId}`,
			periodKey,
			`monthly-free:${userId}:${periodKey}`,
			`${periodKey} 普通用户每月赠送${FREE_MONTHLY_REDSTONE_GRANT}红石`,
		],
	);
	if (insertResult.affectedRows === 0) return 0;
	await transactionalQuery(
		'UPDATE user_bank SET redstone = redstone + ? WHERE user_id = ?',
		[FREE_MONTHLY_REDSTONE_GRANT, userId],
	);
	return FREE_MONTHLY_REDSTONE_GRANT;
}

async function consumeRedstone(options) {
	const userId = Number(options.userId);
	const amount = Number(options.amount);
	if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(amount) || amount <= 0) {
		throw createBillingError('红石计费参数无效', 422, 'INVALID_REDSTONE_BILLING');
	}
	const feature = String(options.feature || 'ai').slice(0, 96);
	const requestKey = buildRequestKey(userId, feature, options.requestId);

	return withTransaction(async (transactionalQuery) => {
		await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [userId]);
		await ensureMonthlyFreeGrant(transactionalQuery, userId);
		const bankRows = await transactionalQuery(
			'SELECT redstone FROM user_bank WHERE user_id = ? LIMIT 1 FOR UPDATE',
			[userId],
		);
		const replayRows = await transactionalQuery(
			'SELECT transaction_id, amount FROM redstone_transactions WHERE request_key = ? LIMIT 1',
			[requestKey],
		);
		if (replayRows.length > 0) {
			return { replayed: true, amount: Math.abs(Number(replayRows[0].amount)), redstone_balance: Number(bankRows[0].redstone || 0) };
		}
		if (options.freeForMembers) {
			const memberRows = await transactionalQuery(
				`SELECT subscription_id
				 FROM membership_subscriptions
				 WHERE user_id = ? AND status = 'active' AND starts_at <= NOW() AND expires_at > NOW()
				 LIMIT 1`,
				[userId],
			);
			if (memberRows.length > 0) {
				return {
					replayed: false,
					amount: 0,
					membership_free: true,
					redstone_balance: Number(bankRows[0].redstone || 0),
				};
			}
		}
		const balance = Number(bankRows[0].redstone || 0);
		if (balance < amount) {
			throw createBillingError(`红石不足，本次需要${amount}红石，当前余额${balance}红石`, 402, 'INSUFFICIENT_REDSTONE');
		}
		const updateResult = await transactionalQuery(
			'UPDATE user_bank SET redstone = redstone - ? WHERE user_id = ? AND redstone >= ?',
			[amount, userId, amount],
		);
		if (updateResult.affectedRows === 0) {
			throw createBillingError('红石余额不足', 402, 'INSUFFICIENT_REDSTONE');
		}
		await transactionalQuery(
			`INSERT INTO redstone_transactions
			 (user_id, amount, log_cost, transaction_type, reference_id, period_key,
			  request_key, description, created_at)
			 VALUES (?, ?, 0, 'ai_usage', ?, NULL, ?, ?, CURRENT_TIMESTAMP)`,
			[userId, -amount, feature, requestKey, String(options.description || `${feature}消耗${amount}红石`).slice(0, 255)],
		);
		return { replayed: false, amount, redstone_balance: balance - amount };
	});
}

function sendBillingError(res, error) {
	if (!error || !error.isBillingError || res.headersSent) return false;
	res.status(error.statusCode || 400).json({ code: error.code, msg: error.message, message: error.message });
	return true;
}

module.exports = {
	FREE_MONTHLY_REDSTONE_GRANT,
	consumeRedstone,
	sendBillingError,
};
