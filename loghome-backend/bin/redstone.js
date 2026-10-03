const crypto = require('crypto');
const { query, withTransaction } = require('../sql.js');

const LOGS_PER_REDSTONE = 10;
const MEMBERSHIP_REDSTONE_GRANTS = Object.freeze({
	standard: 100,
	super: 200,
});
const FREE_MONTHLY_REDSTONE_GRANT = 6;
const GIFT_REDSTONE_VALIDITY_MONTHS = 3;
const EXPIRING_GRANT_TYPES = new Set([
	'membership_grant',
	'membership_upgrade_grant',
	'annual_refresh',
	'monthly_free_grant',
]);

function createBusinessError(message, statusCode = 400, code = 'REDSTONE_ERROR') {
	const error = new Error(message);
	error.isBusinessError = true;
	error.statusCode = statusCode;
	error.code = code;
	return error;
}

function getMembershipGrantAmount(membershipType) {
	const amount = MEMBERSHIP_REDSTONE_GRANTS[String(membershipType || '').toLowerCase()];
	if (!amount) throw createBusinessError('会员档位无效', 422, 'INVALID_MEMBERSHIP_TYPE');
	return amount;
}

function buildClientRequestKey(userId, rawRequestKey) {
	const normalized = String(rawRequestKey || '').trim();
	if (normalized.length < 8 || normalized.length > 72) {
		throw createBusinessError('client_request_id 长度需要在 8 到 72 个字符之间', 422, 'INVALID_REQUEST_KEY');
	}
	return `redstone-exchange:${userId}:${normalized}`;
}

function buildAiUsageRequestKey(userId, feature, rawRequestKey) {
	const digest = crypto.createHash('sha256')
		.update(`${String(feature || '')}:${String(rawRequestKey || '')}`)
		.digest('hex');
	return `ai-usage:${Number(userId)}:${digest}`;
}

function isExpiringGrantType(transactionType) {
	return EXPIRING_GRANT_TYPES.has(String(transactionType || ''));
}

async function createRedstoneLot(databaseQuery, options) {
	const amount = Number(options.amount);
	if (!Number.isInteger(amount) || amount <= 0) return null;
	const expires = Boolean(options.expires);
	const result = await databaseQuery(
		`INSERT INTO redstone_lots
		 (user_id, source_transaction_id, granted_amount, remaining_amount, expires_at, created_at, updated_at)
		 VALUES (?, ?, ?, ?,
		         CASE WHEN ? = 1 THEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${GIFT_REDSTONE_VALIDITY_MONTHS} MONTH) ELSE NULL END,
		         CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
		[Number(options.userId), options.sourceTransactionId || null, amount, amount, expires ? 1 : 0],
	);
	return Number(result.insertId);
}

async function expireRedstoneLots(databaseQuery, userIdValue) {
	const userId = Number(userIdValue);
	const lots = await databaseQuery(
		`SELECT lot_id, remaining_amount, expires_at
		 FROM redstone_lots
		 WHERE user_id = ? AND remaining_amount > 0
		   AND expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP
		 ORDER BY expires_at ASC, lot_id ASC
		 FOR UPDATE`,
		[userId],
	);
	let expiredAmount = 0;
	for (const lot of lots) {
		const amount = Number(lot.remaining_amount || 0);
		if (amount <= 0) continue;
		const transactionResult = await databaseQuery(
			`INSERT IGNORE INTO redstone_transactions
			 (user_id, amount, log_cost, transaction_type, reference_id, period_key,
			  request_key, description, created_at)
			 VALUES (?, ?, 0, 'expiration', ?, NULL, ?, ?, CURRENT_TIMESTAMP)`,
			[
				userId,
				-amount,
				String(lot.lot_id),
				`redstone-expiration:${lot.lot_id}`,
				`赠送红石有效期届满，过期${amount}红石`,
			],
		);
		if (transactionResult.affectedRows === 0) continue;
		await databaseQuery(
			'UPDATE redstone_lots SET remaining_amount = 0, updated_at = CURRENT_TIMESTAMP WHERE lot_id = ?',
			[lot.lot_id],
		);
		expiredAmount += amount;
	}
	if (expiredAmount > 0) {
		const updateResult = await databaseQuery(
			'UPDATE user_bank SET redstone = redstone - ? WHERE user_id = ? AND redstone >= ?',
			[expiredAmount, userId, expiredAmount],
		);
		if (updateResult.affectedRows === 0) throw new Error('红石到期扣减时账户余额与批次余额不一致');
	}
	return expiredAmount;
}

async function consumeRedstoneLots(databaseQuery, userIdValue, amountValue, transactionId) {
	const userId = Number(userIdValue);
	let remaining = Number(amountValue);
	const lots = await databaseQuery(
		`SELECT lot_id, remaining_amount
		 FROM redstone_lots
		 WHERE user_id = ? AND remaining_amount > 0
		   AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
		 ORDER BY expires_at IS NULL ASC, expires_at ASC, created_at ASC, lot_id ASC
		 FOR UPDATE`,
		[userId],
	);
	for (const lot of lots) {
		if (remaining <= 0) break;
		const used = Math.min(remaining, Number(lot.remaining_amount || 0));
		if (used <= 0) continue;
		await databaseQuery(
			'UPDATE redstone_lots SET remaining_amount = remaining_amount - ?, updated_at = CURRENT_TIMESTAMP WHERE lot_id = ?',
			[used, lot.lot_id],
		);
		if (transactionId) {
			await databaseQuery(
				`INSERT INTO redstone_lot_consumptions (transaction_id, lot_id, amount, created_at)
				 VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
				[transactionId, lot.lot_id, used],
			);
		}
		remaining -= used;
	}
	if (remaining > 0) {
		throw new Error(`红石批次余额与账户余额不一致，缺少${remaining}红石`);
	}
}

async function getRedstoneLotSummary(databaseQuery, userId) {
	const rows = await databaseQuery(
		`SELECT
		   COALESCE(SUM(CASE WHEN expires_at IS NULL THEN remaining_amount ELSE 0 END), 0) AS permanent_balance,
		   COALESCE(SUM(CASE WHEN expires_at IS NOT NULL AND expires_at > CURRENT_TIMESTAMP THEN remaining_amount ELSE 0 END), 0) AS expiring_balance,
		   MIN(CASE WHEN remaining_amount > 0 AND expires_at > CURRENT_TIMESTAMP THEN expires_at ELSE NULL END) AS next_expiration_at
		 FROM redstone_lots
		 WHERE user_id = ? AND remaining_amount > 0`,
		[Number(userId)],
	);
	return {
		permanent_balance: Number(rows[0].permanent_balance || 0),
		expiring_balance: Number(rows[0].expiring_balance || 0),
		next_expiration_at: rows[0].next_expiration_at || null,
	};
}

async function grantRedstone(databaseQuery, options) {
	const userId = Number(options.userId);
	const amount = Number(options.amount);
	if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(amount) || amount <= 0) {
		return { granted: false, amount: 0 };
	}
	await databaseQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [userId]);
	const insertResult = await databaseQuery(
		`INSERT IGNORE INTO redstone_transactions
		 (user_id, amount, log_cost, transaction_type, reference_id, period_key,
		  request_key, description, created_at)
		 VALUES (?, ?, 0, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
		[
			userId,
			amount,
			options.transactionType,
			String(options.referenceId || ''),
			String(options.periodKey || ''),
			String(options.requestKey),
			String(options.description || '').slice(0, 255),
		],
	);
	if (insertResult.affectedRows === 0) return { granted: false, amount: 0 };
	await createRedstoneLot(databaseQuery, {
		userId,
		amount,
		sourceTransactionId: insertResult.insertId,
		expires: options.expires === undefined
			? isExpiringGrantType(options.transactionType)
			: Boolean(options.expires),
	});
	await databaseQuery('UPDATE user_bank SET redstone = redstone + ? WHERE user_id = ?', [amount, userId]);
	return { granted: true, amount, expires_in_months: isExpiringGrantType(options.transactionType) ? GIFT_REDSTONE_VALIDITY_MONTHS : null };
}

function getMonthlyPeriodKey(dateValue = new Date()) {
	const date = new Date(dateValue);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

async function ensureMonthlyFreeGrant(userIdValue, databaseQuery = query) {
	const userId = Number(userIdValue);
	if (!Number.isInteger(userId) || userId <= 0) return { granted: false, amount: 0 };
	const activeRows = await databaseQuery(
		`SELECT subscription_id
		 FROM membership_subscriptions
		 WHERE user_id = ? AND status = 'active' AND starts_at <= NOW() AND expires_at > NOW()
		 LIMIT 1`,
		[userId],
	);
	if (activeRows.length > 0) return { granted: false, amount: 0 };
	const periodKey = getMonthlyPeriodKey();
	return grantRedstone(databaseQuery, {
		userId,
		amount: FREE_MONTHLY_REDSTONE_GRANT,
		transactionType: 'monthly_free_grant',
		referenceId: `ordinary-user:${userId}`,
		periodKey,
		requestKey: `monthly-free:${userId}:${periodKey}`,
		description: `${periodKey} 普通用户每月赠送${FREE_MONTHLY_REDSTONE_GRANT}红石`,
	});
}

async function getAccount(userId) {
	return withTransaction(async (transactionalQuery) => {
		await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [Number(userId)]);
		await ensureMonthlyFreeGrant(userId, transactionalQuery);
		await transactionalQuery('SELECT redstone FROM user_bank WHERE user_id = ? FOR UPDATE', [Number(userId)]);
		await expireRedstoneLots(transactionalQuery, userId);
		const rows = await transactionalQuery('SELECT log, redstone FROM user_bank WHERE user_id = ? LIMIT 1', [Number(userId)]);
		const lotSummary = await getRedstoneLotSummary(transactionalQuery, userId);
		return {
			log_balance: Number(rows[0].log || 0),
			redstone_balance: Number(rows[0].redstone || 0),
			...lotSummary,
			exchange_rate: { log: LOGS_PER_REDSTONE, redstone: 1 },
			membership_grants: { ...MEMBERSHIP_REDSTONE_GRANTS },
			ordinary_monthly_grant: FREE_MONTHLY_REDSTONE_GRANT,
			gift_validity_months: GIFT_REDSTONE_VALIDITY_MONTHS,
		};
	}, 'get redstone account');
}

async function listTransactions(userId, page = 1, pageSize = 20) {
	const safePage = Math.max(1, Number(page) || 1);
	const safePageSize = Math.max(1, Math.min(50, Number(pageSize) || 20));
	const offset = (safePage - 1) * safePageSize;
	return withTransaction(async (transactionalQuery) => {
		await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [Number(userId)]);
		await ensureMonthlyFreeGrant(userId, transactionalQuery);
		await transactionalQuery('SELECT redstone FROM user_bank WHERE user_id = ? FOR UPDATE', [Number(userId)]);
		await expireRedstoneLots(transactionalQuery, userId);
		const countRows = await transactionalQuery('SELECT COUNT(*) AS total FROM redstone_transactions WHERE user_id = ?', [Number(userId)]);
		const rows = await transactionalQuery(
			`SELECT rt.transaction_id, rt.amount, rt.log_cost, rt.transaction_type, rt.reference_id,
			        rt.period_key, rt.description, rt.created_at,
			        rl.remaining_amount, rl.expires_at
			 FROM redstone_transactions rt
			 LEFT JOIN redstone_lots rl ON rl.source_transaction_id = rt.transaction_id
			 WHERE rt.user_id = ?
			 ORDER BY rt.created_at DESC, rt.transaction_id DESC
			 LIMIT ?, ?`,
			[Number(userId), offset, safePageSize],
		);
		return {
			total: Number(countRows[0].total || 0),
			page: safePage,
			pageSize: safePageSize,
			list: rows.map((row) => ({ ...row, transaction_id: Number(row.transaction_id), amount: Number(row.amount), log_cost: Number(row.log_cost) })),
		};
	}, 'list redstone transactions');
}

async function exchangeLogsForRedstone(userIdValue, redstoneAmountValue, clientRequestId) {
	const userId = Number(userIdValue);
	const redstoneAmount = Number(redstoneAmountValue);
	if (!Number.isInteger(userId) || userId <= 0) {
		throw createBusinessError('用户参数无效', 422, 'INVALID_USER');
	}
	if (!Number.isInteger(redstoneAmount) || redstoneAmount <= 0 || redstoneAmount > 100000) {
		throw createBusinessError('红石兑换数量需要是 1 到 100000 的整数', 422, 'INVALID_REDSTONE_AMOUNT');
	}
	const logCost = redstoneAmount * LOGS_PER_REDSTONE;
	const requestKey = buildClientRequestKey(userId, clientRequestId);

	return withTransaction(async (transactionalQuery) => {
		await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [userId]);
		const bankRows = await transactionalQuery(
			'SELECT log, redstone FROM user_bank WHERE user_id = ? LIMIT 1 FOR UPDATE',
			[userId],
		);
		const replayRows = await transactionalQuery(
			'SELECT transaction_id, amount, log_cost FROM redstone_transactions WHERE request_key = ? LIMIT 1',
			[requestKey],
		);
		if (replayRows.length > 0) {
			return {
				replayed: true,
				redstone_amount: Number(replayRows[0].amount),
				log_cost: Number(replayRows[0].log_cost),
				log_balance: Number(bankRows[0].log || 0),
				redstone_balance: Number(bankRows[0].redstone || 0),
			};
		}

		const logBalance = Number(bankRows[0].log || 0);
		const redstoneBalance = Number(bankRows[0].redstone || 0);
		if (logBalance < logCost) {
			throw createBusinessError('原木余额不足', 409, 'INSUFFICIENT_LOG_BALANCE');
		}
		const updateResult = await transactionalQuery(
			`UPDATE user_bank
			 SET log = log - ?, redstone = redstone + ?
			 WHERE user_id = ? AND log >= ?`,
			[logCost, redstoneAmount, userId, logCost],
		);
		if (updateResult.affectedRows === 0) {
			throw createBusinessError('原木余额不足', 409, 'INSUFFICIENT_LOG_BALANCE');
		}
		const transactionResult = await transactionalQuery(
			`INSERT INTO redstone_transactions
			 (user_id, amount, log_cost, transaction_type, reference_id, period_key,
			  request_key, description, created_at)
			 VALUES (?, ?, ?, 'log_exchange', NULL, NULL, ?, ?, CURRENT_TIMESTAMP)`,
			[userId, redstoneAmount, logCost, requestKey, `使用${logCost}原木兑换${redstoneAmount}红石`],
		);
		await createRedstoneLot(transactionalQuery, {
			userId,
			amount: redstoneAmount,
			sourceTransactionId: transactionResult.insertId,
			expires: false,
		});
		return {
			replayed: false,
			redstone_amount: redstoneAmount,
			log_cost: logCost,
			log_balance: logBalance - logCost,
			redstone_balance: redstoneBalance + redstoneAmount,
		};
	}, 'exchange logs for redstone');
}

async function consumeRedstone(userIdValue, amountValue, options = {}) {
	const userId = Number(userIdValue);
	const amount = Number(amountValue);
	if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(amount) || amount <= 0) {
		throw createBusinessError('红石计费参数无效', 422, 'INVALID_REDSTONE_BILLING');
	}
	const feature = String(options.feature || 'ai').slice(0, 96);
	const requestKey = buildAiUsageRequestKey(userId, feature, options.requestId);
	return withTransaction(async (transactionalQuery) => {
		await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [userId]);
		await ensureMonthlyFreeGrant(userId, transactionalQuery);
		const bankRows = await transactionalQuery(
			'SELECT redstone FROM user_bank WHERE user_id = ? LIMIT 1 FOR UPDATE', [userId],
		);
		await expireRedstoneLots(transactionalQuery, userId);
		const replayRows = await transactionalQuery(
			'SELECT transaction_id, amount FROM redstone_transactions WHERE request_key = ? LIMIT 1', [requestKey],
		);
		const refreshedBankRows = await transactionalQuery(
			'SELECT redstone FROM user_bank WHERE user_id = ? LIMIT 1', [userId],
		);
		const balance = Number(refreshedBankRows[0].redstone || 0);
		if (replayRows.length > 0) {
			return { replayed: true, amount: Math.abs(Number(replayRows[0].amount)), redstone_balance: balance };
		}
		if (balance < amount) {
			throw createBusinessError(`红石不足，本次需要${amount}红石，当前余额${balance}红石`, 402, 'INSUFFICIENT_REDSTONE');
		}
		const transactionResult = await transactionalQuery(
			`INSERT INTO redstone_transactions
			 (user_id, amount, log_cost, transaction_type, reference_id, period_key, request_key, description, created_at)
			 VALUES (?, ?, 0, 'ai_usage', ?, NULL, ?, ?, CURRENT_TIMESTAMP)`,
			[userId, -amount, feature, requestKey, String(options.description || `${feature}消耗${amount}红石`).slice(0, 255)],
		);
		await consumeRedstoneLots(transactionalQuery, userId, amount, transactionResult.insertId);
		const updateResult = await transactionalQuery(
			'UPDATE user_bank SET redstone = redstone - ? WHERE user_id = ? AND redstone >= ?',
			[amount, userId, amount],
		);
		if (updateResult.affectedRows === 0) throw new Error('红石余额扣减失败');
		return { replayed: false, amount, redstone_balance: balance - amount };
	}, 'consume redstone');
}

module.exports = {
	LOGS_PER_REDSTONE,
	MEMBERSHIP_REDSTONE_GRANTS,
	FREE_MONTHLY_REDSTONE_GRANT,
	GIFT_REDSTONE_VALIDITY_MONTHS,
	createBusinessError,
	getMembershipGrantAmount,
	isExpiringGrantType,
	createRedstoneLot,
	expireRedstoneLots,
	consumeRedstoneLots,
	getRedstoneLotSummary,
	grantRedstone,
	ensureMonthlyFreeGrant,
	getAccount,
	listTransactions,
	exchangeLogsForRedstone,
	consumeRedstone,
};
