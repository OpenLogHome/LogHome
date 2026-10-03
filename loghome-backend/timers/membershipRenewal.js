const { query, withTransaction } = require('../sql.js');
const { sendMsg: sendSystemMsg } = require('../bin/message.js');

// 原 SCF 版 message.js 的 sendMsg 不做去重检查，这里通过 ignoreRepeat=true 保持同样行为
async function sendMsg(toId, content, router = 'membership/index') {
	await sendSystemMsg(-1, toId, content, router, 'notification', true);
}

const BATCH_SIZE = 100;
const MEMBERSHIP_ROUTE = 'membership/index';
const TIER_NAMES = {
	standard: '原木通行证',
	super: '超级原木通行证',
};
const REDSTONE_GRANTS = {
	standard: 100,
	super: 200,
};
const FREE_MONTHLY_REDSTONE_GRANT = 6;
const GIFT_REDSTONE_VALIDITY_MONTHS = 3;

function isSchemaMissingError(error) {
	if (!error) return false;
	return error.code === 'ER_NO_SUCH_TABLE' ||
    error.code === 'ER_BAD_FIELD_ERROR' ||
    /doesn't exist/i.test(String(error.message || ''));
}

function addBillingCycle(baseDate, billingCycle) {
	const source = new Date(baseDate);
	const result = new Date(source.getTime());
	const originalDay = result.getDate();
	result.setDate(1);
	if (billingCycle === 'monthly') {
		result.setMonth(result.getMonth() + 1);
	} else if (billingCycle === 'yearly') {
		result.setFullYear(result.getFullYear() + 1);
	} else {
		throw new Error(`unsupported billing cycle: ${billingCycle}`);
	}
	const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
	result.setDate(Math.min(originalDay, lastDay));
	return result;
}

function generateOrderNo() {
	const now = new Date();
	const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
	const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
	return `MR${timestamp}${random}`;
}

function formatPeriodKey(dateValue) {
	const date = new Date(dateValue);
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, '0'),
		String(date.getDate()).padStart(2, '0'),
		String(date.getHours()).padStart(2, '0'),
		String(date.getMinutes()).padStart(2, '0'),
		String(date.getSeconds()).padStart(2, '0'),
	].join('');
}

function formatMonthlyPeriodKey(dateValue = new Date()) {
	const date = new Date(dateValue);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

async function grantOrdinaryMonthlyRedstone(userId, periodKey) {
	return withTransaction(async (transactionalQuery) => grantRedstone(transactionalQuery, {
		userId,
		amount: FREE_MONTHLY_REDSTONE_GRANT,
		transactionType: 'monthly_free_grant',
		referenceId: `ordinary-user:${userId}`,
		periodKey,
		requestKey: `monthly-free:${userId}:${periodKey}`,
		description: `${periodKey} 普通用户每月赠送${FREE_MONTHLY_REDSTONE_GRANT}红石`,
	}));
}

async function grantRedstone(transactionalQuery, options) {
	const amount = Number(options.amount || 0);
	if (!Number.isInteger(amount) || amount <= 0) return 0;
	await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [options.userId]);
	const insertResult = await transactionalQuery(
		`INSERT IGNORE INTO redstone_transactions
     (user_id, amount, log_cost, transaction_type, reference_id, period_key,
      request_key, description, created_at)
     VALUES (?, ?, 0, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
		[
			options.userId,
			amount,
			options.transactionType,
			String(options.referenceId),
			String(options.periodKey),
			String(options.requestKey),
			String(options.description || '').slice(0, 255),
		],
	);
	if (insertResult.affectedRows === 0) return 0;
	await transactionalQuery(
		`INSERT INTO redstone_lots
     (user_id, source_transaction_id, granted_amount, remaining_amount, expires_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${GIFT_REDSTONE_VALIDITY_MONTHS} MONTH),
             CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
		[options.userId, insertResult.insertId, amount, amount],
	);
	await transactionalQuery('UPDATE user_bank SET redstone = redstone + ? WHERE user_id = ?', [amount, options.userId]);
	return amount;
}

async function expireRedstoneLot(lotId) {
	const ownerRows = await query('SELECT user_id FROM redstone_lots WHERE lot_id = ? LIMIT 1', [lotId]);
	if (ownerRows.length === 0) return 0;
	const userId = Number(ownerRows[0].user_id);
	return withTransaction(async (transactionalQuery) => {
		await transactionalQuery('SELECT redstone FROM user_bank WHERE user_id = ? LIMIT 1 FOR UPDATE', [userId]);
		const lotRows = await transactionalQuery(
			`SELECT lot_id, remaining_amount
       FROM redstone_lots
       WHERE lot_id = ? AND user_id = ? AND remaining_amount > 0
         AND expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP
       LIMIT 1 FOR UPDATE`,
			[lotId, userId],
		);
		if (lotRows.length === 0) return 0;
		const amount = Number(lotRows[0].remaining_amount || 0);
		const insertResult = await transactionalQuery(
			`INSERT IGNORE INTO redstone_transactions
       (user_id, amount, log_cost, transaction_type, reference_id, period_key,
        request_key, description, created_at)
       VALUES (?, ?, 0, 'expiration', ?, NULL, ?, ?, CURRENT_TIMESTAMP)`,
			[userId, -amount, String(lotId), `redstone-expiration:${lotId}`, `赠送红石有效期届满，过期${amount}红石`],
		);
		if (insertResult.affectedRows === 0) return 0;
		await transactionalQuery(
			'UPDATE redstone_lots SET remaining_amount = 0, updated_at = CURRENT_TIMESTAMP WHERE lot_id = ?',
			[lotId],
		);
		const updateResult = await transactionalQuery(
			'UPDATE user_bank SET redstone = redstone - ? WHERE user_id = ? AND redstone >= ?',
			[amount, userId, amount],
		);
		if (updateResult.affectedRows === 0) throw new Error('红石到期扣减时账户余额与批次余额不一致');
		return amount;
	});
}

async function ensureSchemaReady() {
	try {
		await query(
			`SELECT subscription_id, purchaser_user_id, request_key, renewal_cost_log,
              redstone_grant_amount, next_redstone_grant_at, renewal_failure_count
       FROM membership_subscriptions LIMIT 1`,
		);
		await query('SELECT transaction_id FROM redstone_transactions LIMIT 1');
		await query('SELECT lot_id, remaining_amount, expires_at FROM redstone_lots LIMIT 1');
		return true;
	} catch (error) {
		if (isSchemaMissingError(error)) return false;
		throw error;
	}
}

async function renewSubscription(subscriptionId) {
	return withTransaction(async (transactionalQuery) => {
		const rows = await transactionalQuery(
			`SELECT * FROM membership_subscriptions
       WHERE subscription_id = ?
       LIMIT 1 FOR UPDATE`,
			[subscriptionId],
		);
		const subscription = rows[0];
		if (!subscription || subscription.status !== 'active' || !subscription.auto_renew) {
			return { status: 'skipped', reason: 'not_renewable', user_id: subscription && subscription.user_id };
		}
		if (!subscription.expires_at || new Date(subscription.expires_at).getTime() > Date.now()) {
			return { status: 'skipped', reason: 'not_due', user_id: subscription.user_id };
		}

		const childRows = await transactionalQuery(
			'SELECT subscription_id FROM membership_subscriptions WHERE renewal_parent_id = ? LIMIT 1',
			[subscription.subscription_id],
		);
		if (childRows.length > 0) {
			await transactionalQuery(
				`UPDATE membership_subscriptions
         SET status = 'replaced', auto_renew = 0, updated_at = CURRENT_TIMESTAMP
         WHERE subscription_id = ?`,
				[subscription.subscription_id],
			);
			return { status: 'skipped', reason: 'already_renewed', user_id: subscription.user_id };
		}

		const costLog = Number(subscription.renewal_cost_log || subscription.cost_log || 0);
		const billingCycleSupported = subscription.billing_cycle === 'monthly' || subscription.billing_cycle === 'yearly';
		if (!Number.isFinite(costLog) || costLog <= 0 || !billingCycleSupported) {
			const failureReason = billingCycleSupported ? '续费价格无效' : '续费周期无效';
			await transactionalQuery(
				`UPDATE membership_subscriptions
         SET status = 'expired', auto_renew = 0, cancel_at_period_end = 1,
             last_renewal_attempt_at = NOW(), renewal_failure_count = renewal_failure_count + 1,
             renewal_last_error = ?, updated_at = CURRENT_TIMESTAMP
         WHERE subscription_id = ?`,
				[failureReason, subscription.subscription_id],
			);
			return {
				status: 'failed',
				reason: billingCycleSupported ? 'invalid_price' : 'invalid_billing_cycle',
				user_id: subscription.user_id,
			};
		}

		await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [subscription.user_id]);
		const bankRows = await transactionalQuery(
			'SELECT log FROM user_bank WHERE user_id = ? LIMIT 1 FOR UPDATE',
			[subscription.user_id],
		);
		const balance = Number(bankRows[0].log || 0);
		if (balance < costLog) {
			await transactionalQuery(
				`UPDATE membership_subscriptions
         SET status = 'expired', auto_renew = 0, cancel_at_period_end = 1,
             last_renewal_attempt_at = NOW(), renewal_failure_count = renewal_failure_count + 1,
             renewal_last_error = '原木余额不足', updated_at = CURRENT_TIMESTAMP
         WHERE subscription_id = ?`,
				[subscription.subscription_id],
			);
			return {
				status: 'failed',
				reason: 'insufficient_balance',
				user_id: subscription.user_id,
				balance,
				required: costLog,
			};
		}

		const debitResult = await transactionalQuery(
			'UPDATE user_bank SET log = log - ? WHERE user_id = ? AND log >= ?',
			[costLog, subscription.user_id, costLog],
		);
		if (debitResult.affectedRows === 0) {
			throw new Error('membership auto renewal debit lost race');
		}

		const now = new Date();
		const previousExpiry = new Date(subscription.expires_at);
		const startsAt = previousExpiry > now ? previousExpiry : now;
		const expiresAt = addBillingCycle(startsAt, subscription.billing_cycle);
		const redstoneGrantAmount = Number(subscription.redstone_grant_amount || REDSTONE_GRANTS[subscription.membership_type] || 0);
		let nextRedstoneGrantAt = null;
		if (subscription.billing_cycle === 'yearly') {
			const candidate = addBillingCycle(startsAt, 'monthly');
			if (candidate < expiresAt) nextRedstoneGrantAt = candidate;
		}
		const orderNo = generateOrderNo();

		await transactionalQuery(
			`UPDATE membership_subscriptions
       SET status = 'replaced', auto_renew = 0, cancel_at_period_end = 0,
           last_renewal_attempt_at = NOW(), renewal_last_error = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE subscription_id = ?`,
			[subscription.subscription_id],
		);
		const insertResult = await transactionalQuery(
			`INSERT INTO membership_subscriptions
       (user_id, purchaser_user_id, membership_type, billing_cycle, cost_log, renewal_cost_log,
        redstone_grant_amount, next_redstone_grant_at, status,
        starts_at, expires_at, auto_renew, cancel_at_period_end, renewal_parent_id,
        order_no, request_key, source, renewal_failure_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, 1, 0, ?, ?, NULL, 'auto_renewal', 0,
               CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			[
				subscription.user_id,
				subscription.user_id,
				subscription.membership_type,
				subscription.billing_cycle,
				costLog,
				costLog,
				redstoneGrantAmount,
				nextRedstoneGrantAt,
				startsAt,
				expiresAt,
				subscription.subscription_id,
				orderNo,
			],
		);
		const redstoneGranted = await grantRedstone(transactionalQuery, {
			userId: subscription.user_id,
			amount: redstoneGrantAmount,
			transactionType: 'membership_grant',
			referenceId: insertResult.insertId,
			periodKey: 'initial',
			requestKey: `membership:${insertResult.insertId}:redstone:initial`,
			description: `${TIER_NAMES[subscription.membership_type] || '会员通行证'}自动续费赠送${redstoneGrantAmount}红石`,
		});

		return {
			status: 'renewed',
			user_id: subscription.user_id,
			subscription_id: insertResult.insertId,
			membership_type: subscription.membership_type,
			billing_cycle: subscription.billing_cycle,
			cost_log: costLog,
			expires_at: expiresAt,
			balance: balance - costLog,
			redstone_granted: redstoneGranted,
		};
	});
}

async function notifyRenewalResult(result) {
	if (!result || !result.user_id) return;
	try {
		if (result.status === 'renewed') {
			const tierName = TIER_NAMES[result.membership_type] || '会员通行证';
			await sendMsg(
				result.user_id,
				`${tierName}已自动续费，扣除${result.cost_log}原木，并赠送${result.redstone_granted || 0}红石（到账后3个月内有效），新的有效期已生效。`,
				MEMBERSHIP_ROUTE,
			);
		} else if (result.status === 'failed' && result.reason === 'insufficient_balance') {
			await sendMsg(
				result.user_id,
				`会员自动续费失败：原木余额不足，需要${result.required}原木。自动续费已关闭。`,
				MEMBERSHIP_ROUTE,
			);
		} else if (result.status === 'failed' && result.reason === 'invalid_price') {
			await sendMsg(
				result.user_id,
				'会员自动续费失败：订阅价格异常。自动续费已关闭，请联系客服处理。',
				MEMBERSHIP_ROUTE,
			);
		} else if (result.status === 'failed' && result.reason === 'invalid_billing_cycle') {
			await sendMsg(
				result.user_id,
				'会员自动续费失败：订阅周期异常。自动续费已关闭，请联系客服处理。',
				MEMBERSHIP_ROUTE,
			);
		}
	} catch (error) {
		console.log(`Membership Timer: notify failed for user=${result.user_id}`, error);
	}
}

async function refreshAnnualRedstone(subscriptionId) {
	return withTransaction(async (transactionalQuery) => {
		const rows = await transactionalQuery(
			`SELECT * FROM membership_subscriptions
       WHERE subscription_id = ?
       LIMIT 1 FOR UPDATE`,
			[subscriptionId],
		);
		const subscription = rows[0];
		if (!subscription || subscription.status !== 'active' || subscription.billing_cycle !== 'yearly') {
			return { status: 'skipped', user_id: subscription && subscription.user_id };
		}
		const expiresAt = new Date(subscription.expires_at);
		let nextGrantAt = subscription.next_redstone_grant_at
			? new Date(subscription.next_redstone_grant_at)
			: null;
		const now = new Date();
		const grantAmount = Number(subscription.redstone_grant_amount || REDSTONE_GRANTS[subscription.membership_type] || 0);
		if (!nextGrantAt || nextGrantAt > now || nextGrantAt >= expiresAt || grantAmount <= 0) {
			return { status: 'skipped', user_id: subscription.user_id };
		}

		let granted = 0;
		let periods = 0;
		while (nextGrantAt <= now && nextGrantAt < expiresAt && periods < 24) {
			const periodKey = formatPeriodKey(nextGrantAt);
			granted += await grantRedstone(transactionalQuery, {
				userId: subscription.user_id,
				amount: grantAmount,
				transactionType: 'annual_refresh',
				referenceId: subscription.subscription_id,
				periodKey,
				requestKey: `membership:${subscription.subscription_id}:redstone:${periodKey}`,
				description: `${TIER_NAMES[subscription.membership_type] || '会员通行证'}年付会员每月赠送${grantAmount}红石`,
			});
			nextGrantAt = addBillingCycle(nextGrantAt, 'monthly');
			periods += 1;
		}

		await transactionalQuery(
			`UPDATE membership_subscriptions
       SET next_redstone_grant_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE subscription_id = ?`,
			[nextGrantAt < expiresAt ? nextGrantAt : null, subscription.subscription_id],
		);
		return {
			status: granted > 0 ? 'granted' : 'skipped',
			user_id: subscription.user_id,
			membership_type: subscription.membership_type,
			redstone_granted: granted,
			periods,
		};
	});
}

async function notifyAnnualRedstone(result) {
	if (!result || result.status !== 'granted' || !result.user_id) return;
	try {
		const tierName = TIER_NAMES[result.membership_type] || '会员通行证';
		await sendMsg(
			result.user_id,
			`${tierName}本月红石已到账：${result.redstone_granted}红石（到账后3个月内有效），可用于社区内的AI功能。`,
			MEMBERSHIP_ROUTE,
		);
	} catch (error) {
		console.log(`Membership Timer: annual redstone notify failed for user=${result.user_id}`, error);
	}
}

async function runMembershipRenewal() {
	const ready = await ensureSchemaReady();
	if (!ready) {
		console.log('Membership Timer: schema not ready, skip.');
		return { scanned: 0, renewed: 0, failed: 0, skipped: 'schema_not_ready' };
	}

	const dueRows = await query(
		`SELECT subscription_id
     FROM membership_subscriptions
     WHERE status = 'active'
       AND auto_renew = 1
       AND expires_at IS NOT NULL
       AND expires_at <= NOW()
     ORDER BY expires_at ASC
     LIMIT ?`,
		[BATCH_SIZE],
	);

	const summary = {
		scanned: dueRows.length,
		renewed: 0,
		failed: 0,
		skipped: 0,
		redstone_scanned: 0,
		redstone_refreshed: 0,
		ordinary_grant_scanned: 0,
		ordinary_granted: 0,
		expiration_scanned: 0,
		redstone_expired: 0,
	};
	for (const row of dueRows) {
		try {
			const result = await renewSubscription(row.subscription_id);
			if (result.status === 'renewed') summary.renewed += 1;
			else if (result.status === 'failed') summary.failed += 1;
			else summary.skipped += 1;
			await notifyRenewalResult(result);
		} catch (error) {
			summary.failed += 1;
			console.log(`Membership Timer: renewal failed for subscription=${row.subscription_id}`, error);
		}
	}

	const redstoneRows = await query(
		`SELECT subscription_id
     FROM membership_subscriptions
     WHERE status = 'active'
       AND billing_cycle = 'yearly'
       AND redstone_grant_amount > 0
       AND next_redstone_grant_at IS NOT NULL
       AND next_redstone_grant_at <= NOW()
       AND expires_at > NOW()
     ORDER BY next_redstone_grant_at ASC
     LIMIT ?`,
		[BATCH_SIZE],
	);
	summary.redstone_scanned = redstoneRows.length;
	for (const row of redstoneRows) {
		try {
			const result = await refreshAnnualRedstone(row.subscription_id);
			if (result.status === 'granted') summary.redstone_refreshed += 1;
			await notifyAnnualRedstone(result);
		} catch (error) {
			summary.failed += 1;
			console.log(`Membership Timer: redstone refresh failed for subscription=${row.subscription_id}`, error);
		}
	}

	const monthlyPeriodKey = formatMonthlyPeriodKey();
	const ordinaryRows = await query(
		`SELECT u.user_id
     FROM users u
     WHERE u.activated = 1
       AND NOT EXISTS (
         SELECT 1 FROM membership_subscriptions ms
         WHERE ms.user_id = u.user_id AND ms.status = 'active'
           AND ms.starts_at <= NOW() AND ms.expires_at > NOW()
       )
       AND NOT EXISTS (
         SELECT 1 FROM redstone_transactions rt
         WHERE rt.user_id = u.user_id
           AND rt.transaction_type = 'monthly_free_grant'
           AND rt.period_key = ?
       )
     ORDER BY u.user_id ASC
     LIMIT ?`,
		[monthlyPeriodKey, BATCH_SIZE],
	);
	summary.ordinary_grant_scanned = ordinaryRows.length;
	for (const row of ordinaryRows) {
		try {
			const granted = await grantOrdinaryMonthlyRedstone(row.user_id, monthlyPeriodKey);
			if (granted > 0) summary.ordinary_granted += 1;
		} catch (error) {
			summary.failed += 1;
			console.log(`Membership Timer: ordinary monthly grant failed for user=${row.user_id}`, error);
		}
	}

	const expiredLotRows = await query(
		`SELECT lot_id
     FROM redstone_lots
     WHERE remaining_amount > 0
       AND expires_at IS NOT NULL
       AND expires_at <= CURRENT_TIMESTAMP
     ORDER BY expires_at ASC, lot_id ASC
     LIMIT ?`,
		[BATCH_SIZE],
	);
	summary.expiration_scanned = expiredLotRows.length;
	for (const row of expiredLotRows) {
		try {
			summary.redstone_expired += await expireRedstoneLot(row.lot_id);
		} catch (error) {
			summary.failed += 1;
			console.log(`Membership Timer: redstone expiration failed for lot=${row.lot_id}`, error);
		}
	}

	await query(
		`UPDATE membership_subscriptions
     SET status = 'expired', updated_at = CURRENT_TIMESTAMP
     WHERE status = 'active'
       AND auto_renew = 0
       AND expires_at IS NOT NULL
       AND expires_at <= NOW()`,
	);

	console.log(
		`Membership Timer: scanned=${summary.scanned}, renewed=${summary.renewed}, failed=${summary.failed}, skipped=${summary.skipped}, redstone_refreshed=${summary.redstone_refreshed}, ordinary_granted=${summary.ordinary_granted}, redstone_expired=${summary.redstone_expired}`,
	);
	return summary;
}

async function run() {
	return runMembershipRenewal();
}

module.exports = {
	run,
	_test: {
		addBillingCycle,
		generateOrderNo,
	},
};
