const crypto = require('crypto');
const { query, withTransaction } = require('../sql.js');
const message = require('./message.js');
const redstone = require('./redstone.js');

const MEMBERSHIP_ROUTE = 'membership/index';
const MEMBERSHIP_GIFT_CARD_BACKGROUND = '/static/membership/membership-gift-card.svg';
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const BILLING_CYCLE_DAYS = Object.freeze({ monthly: 30, yearly: 365 });
const MEMBERSHIP_PLANS = Object.freeze({
	standard: Object.freeze({
		key: 'standard',
		name: '原木通行证',
		plans: Object.freeze({
			monthly: Object.freeze({ billing_cycle: 'monthly', name: '连续包月', cost_log: 660 }),
			yearly: Object.freeze({ billing_cycle: 'yearly', name: '购买年卡', cost_log: 7200 }),
		}),
	}),
	super: Object.freeze({
		key: 'super',
		name: '超级原木通行证',
		plans: Object.freeze({
			monthly: Object.freeze({ billing_cycle: 'monthly', name: '连续包月', cost_log: 880 }),
			yearly: Object.freeze({ billing_cycle: 'yearly', name: '购买年卡', cost_log: 9600 }),
		}),
	}),
});

function createBusinessError(messageText, statusCode = 400, code = 'MEMBERSHIP_ERROR') {
	const error = new Error(messageText);
	error.isBusinessError = true;
	error.statusCode = statusCode;
	error.code = code;
	return error;
}

function toBoolean(value, fallback = false) {
	if (value === undefined || value === null || value === '') return fallback;
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value === 1;
	return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function getPlan(membershipType, billingCycle) {
	const tier = MEMBERSHIP_PLANS[String(membershipType || '').toLowerCase()];
	const plan = tier && tier.plans[String(billingCycle || '').toLowerCase()];
	if (!tier || !plan) {
		throw createBusinessError('会员档位或订阅周期无效', 422, 'INVALID_MEMBERSHIP_PLAN');
	}
	return { tier, plan };
}

function getPlanList() {
	return Object.values(MEMBERSHIP_PLANS).map((tier) => ({
		key: tier.key,
		name: tier.name,
		plans: Object.values(tier.plans).map((plan) => ({ ...plan })),
	}));
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
		throw createBusinessError('暂不支持该订阅周期', 422, 'INVALID_BILLING_CYCLE');
	}
	const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
	result.setDate(Math.min(originalDay, lastDay));
	return result;
}

function addDays(baseDate, days) {
	const result = new Date(baseDate);
	result.setDate(result.getDate() + Number(days));
	return result;
}

function normalizeRedeemCode(value) {
	return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function hashRedeemCode(value) {
	return crypto.createHash('sha256').update(normalizeRedeemCode(value)).digest('hex');
}

function maskRedeemCode(value) {
	const normalized = normalizeRedeemCode(value);
	return `${normalized.slice(0, 7)}…${normalized.slice(-4)}`;
}

function getUpgradeQuote(subscription, nowValue = new Date()) {
	if (!subscription || subscription.membership_type !== 'standard') {
		throw createBusinessError('当前订阅不符合升级条件', 409, 'MEMBERSHIP_UPGRADE_NOT_AVAILABLE');
	}
	const billingCycle = subscription.billing_cycle;
	const cycleDays = BILLING_CYCLE_DAYS[billingCycle];
	if (!cycleDays) {
		throw createBusinessError('当前订阅周期暂不支持补差价升级', 409, 'MEMBERSHIP_UPGRADE_CYCLE_UNSUPPORTED');
	}
	const now = new Date(nowValue);
	const expiresAt = new Date(subscription.expires_at);
	const remainingMilliseconds = Math.max(0, expiresAt.getTime() - now.getTime());
	if (!Number.isFinite(expiresAt.getTime()) || remainingMilliseconds <= 0) {
		throw createBusinessError('当前订阅已经到期，无法补差价升级', 409, 'MEMBERSHIP_UPGRADE_EXPIRED');
	}
	const standardPlan = MEMBERSHIP_PLANS.standard.plans[billingCycle];
	const superPlan = MEMBERSHIP_PLANS.super.plans[billingCycle];
	const cycleDifference = superPlan.cost_log - standardPlan.cost_log;
	const costLog = Math.max(
		1,
		Math.ceil(cycleDifference * remainingMilliseconds / (cycleDays * MILLISECONDS_PER_DAY)),
	);
	return {
		from_membership_type: 'standard',
		membership_type: 'super',
		billing_cycle: billingCycle,
		remaining_days: Math.ceil(remainingMilliseconds / MILLISECONDS_PER_DAY),
		expires_at: subscription.expires_at,
		cost_log: costLog,
		cycle_difference_log: cycleDifference,
		standard_cycle_cost_log: standardPlan.cost_log,
		super_cycle_cost_log: superPlan.cost_log,
		renewal_cost_log: superPlan.cost_log,
		auto_renew: Boolean(subscription.auto_renew),
	};
}

function generateOrderNo(prefix = 'MS') {
	const now = new Date();
	const timestamp =
		now.getFullYear().toString() +
		String(now.getMonth() + 1).padStart(2, '0') +
		String(now.getDate()).padStart(2, '0') +
		String(now.getHours()).padStart(2, '0') +
		String(now.getMinutes()).padStart(2, '0') +
		String(now.getSeconds()).padStart(2, '0');
	const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
	return `${prefix}${timestamp}${random}`;
}

function buildRequestKey(purchaserUserId, rawRequestKey) {
	const normalized = String(rawRequestKey || '').trim();
	if (normalized.length < 8 || normalized.length > 72) {
		throw createBusinessError('client_request_id 长度需要在 8 到 72 个字符之间', 422, 'INVALID_REQUEST_KEY');
	}
	return `${purchaserUserId}:${normalized}`;
}

function serializeSubscription(row) {
	if (!row) return null;
	return {
		subscription_id: Number(row.subscription_id),
		user_id: Number(row.user_id),
		purchaser_user_id: row.purchaser_user_id == null ? null : Number(row.purchaser_user_id),
		membership_type: row.membership_type,
		billing_cycle: row.billing_cycle,
		cost_log: Number(row.cost_log || 0),
		renewal_cost_log: Number(row.renewal_cost_log || row.cost_log || 0),
		redstone_grant_amount: Number(row.redstone_grant_amount || 0),
		next_redstone_grant_at: row.next_redstone_grant_at,
		status: row.status,
		starts_at: row.starts_at,
		expires_at: row.expires_at,
		auto_renew: Boolean(row.auto_renew),
		cancel_at_period_end: Boolean(row.cancel_at_period_end),
		cancelled_at: row.cancelled_at,
		order_no: row.order_no,
		source: row.source,
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
}

async function expireStaleSubscriptions(userId, databaseQuery = query) {
	const params = [];
	let where = '';
	if (userId !== undefined && userId !== null) {
		where = ' AND user_id = ?';
		params.push(Number(userId));
	}
	await databaseQuery(
		`UPDATE membership_subscriptions
		 SET status = 'expired', updated_at = CURRENT_TIMESTAMP
		 WHERE status = 'active' AND auto_renew = 0
		   AND expires_at IS NOT NULL AND expires_at <= NOW()${where}`,
		params,
	);
}

async function getCurrentSubscription(userId, databaseQuery = query, lockForUpdate = false) {
	await expireStaleSubscriptions(userId, databaseQuery);
	const rows = await databaseQuery(
		`SELECT *
		 FROM membership_subscriptions
		 WHERE user_id = ?
		   AND status = 'active'
		   AND starts_at <= NOW()
		   AND expires_at > NOW()
		 ORDER BY FIELD(membership_type, 'super', 'standard'), expires_at DESC, subscription_id DESC
		 LIMIT 1${lockForUpdate ? ' FOR UPDATE' : ''}`,
		[Number(userId)],
	);
	return rows[0] || null;
}

async function getCurrentMembershipTypes(userIds, databaseQuery = query) {
	const ids = [...new Set(
		(userIds || [])
			.map(Number)
			.filter((id) => Number.isInteger(id) && id > 0),
	)];
	if (ids.length === 0) return new Map();

	const rows = await databaseQuery(
		`SELECT user_id, membership_type
		 FROM membership_subscriptions
		 WHERE user_id IN (?)
		   AND status = 'active'
		   AND starts_at <= NOW()
		   AND expires_at > NOW()
		   AND membership_type IN ('standard', 'super')
		 ORDER BY user_id ASC, FIELD(membership_type, 'super', 'standard'), expires_at DESC`,
		[ids],
	);
	const membershipTypes = new Map();
	for (const row of rows) {
		const userId = Number(row.user_id);
		if (!membershipTypes.has(userId)) {
			membershipTypes.set(userId, row.membership_type);
		}
	}
	return membershipTypes;
}

async function decorateRows(rows, mappings, databaseQuery = query) {
	const safeRows = Array.isArray(rows) ? rows : [];
	const safeMappings = Array.isArray(mappings) ? mappings : [];
	const userIds = [];
	for (const row of safeRows) {
		for (const mapping of safeMappings) userIds.push(row[mapping.userIdField]);
	}
	const membershipTypes = await getCurrentMembershipTypes(userIds, databaseQuery);
	for (const row of safeRows) {
		for (const mapping of safeMappings) {
			row[mapping.targetField] =
				membershipTypes.get(Number(row[mapping.userIdField])) || '';
		}
	}
	return safeRows;
}

async function getSubscriptionStatus(userId) {
	const current = await getCurrentSubscription(userId);
	const bankRows = await query('SELECT log FROM user_bank WHERE user_id = ? LIMIT 1', [Number(userId)]);
	const upgradeQuote = current && current.membership_type === 'standard' && BILLING_CYCLE_DAYS[current.billing_cycle]
		? getUpgradeQuote(current)
		: null;
	return {
		active: Boolean(current),
		subscription: serializeSubscription(current),
		upgrade_quote: upgradeQuote,
		log_balance: bankRows.length > 0 ? Number(bankRows[0].log || 0) : 0,
	};
}

async function listSubscriptions(userId, page = 1, pageSize = 20) {
	await expireStaleSubscriptions(userId);
	const safePage = Math.max(1, Number(page) || 1);
	const safePageSize = Math.max(1, Math.min(50, Number(pageSize) || 20));
	const offset = (safePage - 1) * safePageSize;
	const countRows = await query('SELECT COUNT(*) AS total FROM membership_subscriptions WHERE user_id = ?', [Number(userId)]);
	const rows = await query(
		`SELECT * FROM membership_subscriptions
		 WHERE user_id = ?
		 ORDER BY created_at DESC, subscription_id DESC
		 LIMIT ?, ?`,
		[Number(userId), offset, safePageSize],
	);
	return {
		total: Number(countRows[0].total || 0),
		page: safePage,
		pageSize: safePageSize,
		list: rows.map(serializeSubscription),
	};
}

async function listGiftFriends(userIdValue) {
	const userId = Number(userIdValue);
	if (!Number.isInteger(userId) || userId <= 0) {
		throw createBusinessError('用户参数无效', 422, 'INVALID_USER');
	}
	const rows = await query(
		`SELECT u.user_id, u.name, u.avatar_url, u.motto,
		        MAX(CASE WHEN f.user_id = ? AND f.follow_id = u.user_id THEN 1 ELSE 0 END) AS is_following,
		        MAX(CASE WHEN f.follow_id = ? AND f.user_id = u.user_id THEN 1 ELSE 0 END) AS is_follower
		 FROM user_follow f
		 JOIN users u
		   ON u.user_id = CASE WHEN f.user_id = ? THEN f.follow_id ELSE f.user_id END
		 WHERE (f.user_id = ? OR f.follow_id = ?)
		   AND u.user_id <> ?
		   AND u.activated = 1
		 GROUP BY u.user_id, u.name, u.avatar_url, u.motto
		 ORDER BY
		   (MAX(CASE WHEN f.user_id = ? AND f.follow_id = u.user_id THEN 1 ELSE 0 END) +
		    MAX(CASE WHEN f.follow_id = ? AND f.user_id = u.user_id THEN 1 ELSE 0 END)) DESC,
		   u.name ASC, u.user_id ASC`,
		[userId, userId, userId, userId, userId, userId, userId, userId],
	);
	return rows.map((row) => ({
		user_id: Number(row.user_id),
		name: row.name,
		avatar_url: row.avatar_url,
		motto: row.motto || '',
		is_following: Boolean(row.is_following),
		is_follower: Boolean(row.is_follower),
		relation: row.is_following && row.is_follower
			? 'mutual'
			: row.is_following ? 'following' : 'follower',
	}));
}

async function ensureGiftFriend(purchaserUserId, beneficiaryUserId, databaseQuery = query) {
	const rows = await databaseQuery(
		`SELECT 1
		 FROM user_follow
		 WHERE (user_id = ? AND follow_id = ?)
		    OR (user_id = ? AND follow_id = ?)
		 LIMIT 1`,
		[purchaserUserId, beneficiaryUserId, beneficiaryUserId, purchaserUserId],
	);
	if (rows.length === 0) {
		throw createBusinessError('只能向关注列表或粉丝列表中的好友赠送通行证', 422, 'BENEFICIARY_NOT_FRIEND');
	}
}

async function listRedeemHistory(userIdValue, page = 1, pageSize = 20) {
	const userId = Number(userIdValue);
	const safePage = Math.max(1, Number(page) || 1);
	const safePageSize = Math.max(1, Math.min(50, Number(pageSize) || 20));
	const offset = (safePage - 1) * safePageSize;
	const countRows = await query('SELECT COUNT(*) AS total FROM membership_redeem_uses WHERE user_id = ?', [userId]);
	const rows = await query(
		`SELECT r.redemption_id, r.redeemed_at, c.code_hint, c.membership_type, c.duration_days,
		        s.subscription_id, s.starts_at, s.expires_at
		 FROM membership_redeem_uses r
		 JOIN membership_redeem_codes c ON c.code_id = r.code_id
		 JOIN membership_subscriptions s ON s.subscription_id = r.subscription_id
		 WHERE r.user_id = ?
		 ORDER BY r.redeemed_at DESC, r.redemption_id DESC
		 LIMIT ?, ?`,
		[userId, offset, safePageSize],
	);
	return {
		total: Number(countRows[0].total || 0),
		page: safePage,
		pageSize: safePageSize,
		list: rows.map((row) => ({
			redemption_id: Number(row.redemption_id),
			code_hint: row.code_hint,
			membership_type: row.membership_type,
			duration_days: Number(row.duration_days),
			subscription_id: Number(row.subscription_id),
			starts_at: row.starts_at,
			expires_at: row.expires_at,
			redeemed_at: row.redeemed_at,
		})),
	};
}

async function redeemMembership(userIdValue, codeValue) {
	const userId = Number(userIdValue);
	const normalizedCode = normalizeRedeemCode(codeValue);
	if (!Number.isInteger(userId) || userId <= 0) {
		throw createBusinessError('用户参数无效', 422, 'INVALID_USER');
	}
	if (normalizedCode.length < 8 || normalizedCode.length > 32) {
		throw createBusinessError('兑换码格式不正确', 422, 'INVALID_REDEEM_CODE_FORMAT');
	}
	const codeHash = hashRedeemCode(normalizedCode);
	const result = await withTransaction(async (transactionalQuery) => {
		const codeRows = await transactionalQuery(
			'SELECT * FROM membership_redeem_codes WHERE code_hash = ? LIMIT 1 FOR UPDATE',
			[codeHash],
		);
		if (codeRows.length === 0) {
			throw createBusinessError('兑换码不存在或输入有误', 404, 'REDEEM_CODE_NOT_FOUND');
		}
		const redeemCode = codeRows[0];
		const previousUses = await transactionalQuery(
			`SELECT r.redemption_id, r.subscription_id, s.*
			 FROM membership_redeem_uses r
			 JOIN membership_subscriptions s ON s.subscription_id = r.subscription_id
			 WHERE r.code_id = ? AND r.user_id = ?
			 LIMIT 1`,
			[redeemCode.code_id, userId],
		);
		if (previousUses.length > 0) {
			return {
				replayed: true,
				redeem_code: redeemCode,
				subscription: previousUses[0],
			};
		}
		if (redeemCode.status !== 'active') {
			throw createBusinessError('兑换码已失效', 409, 'REDEEM_CODE_INACTIVE');
		}
		if (redeemCode.expires_at && new Date(redeemCode.expires_at).getTime() <= Date.now()) {
			throw createBusinessError('兑换码已过期', 409, 'REDEEM_CODE_EXPIRED');
		}
		if (Number(redeemCode.used_count) >= Number(redeemCode.usage_limit)) {
			throw createBusinessError('兑换码已被使用', 409, 'REDEEM_CODE_EXHAUSTED');
		}
		const durationDays = Number(redeemCode.duration_days);
		if (!Number.isInteger(durationDays) || durationDays <= 0 || durationDays > 3650) {
			throw createBusinessError('兑换码有效期配置异常', 409, 'REDEEM_CODE_DURATION_INVALID');
		}

		const current = await getCurrentSubscription(userId, transactionalQuery, true);
		if (current && current.membership_type === 'super' && redeemCode.membership_type === 'standard') {
			throw createBusinessError(
				'当前超级原木通行证有效期内不能兑换普通通行证，请在到期后使用',
				409,
				'REDEEM_MEMBERSHIP_DOWNGRADE_NOT_ALLOWED',
			);
		}
		const now = new Date();
		const finalMembershipType = current && current.membership_type === 'super'
			? 'super'
			: redeemCode.membership_type;
		const currentExpiry = current && current.expires_at ? new Date(current.expires_at) : null;
		const expiryBase = currentExpiry && currentExpiry > now ? currentExpiry : now;
		const expiresAt = addDays(expiryBase, durationDays);
		const billingCycle = current && ['monthly', 'yearly'].includes(current.billing_cycle)
			? current.billing_cycle
			: 'custom';
		const canAutoRenew = billingCycle !== 'custom';
		const autoRenew = canAutoRenew && current ? Boolean(current.auto_renew) : false;
		const renewalPlan = canAutoRenew ? getPlan(finalMembershipType, billingCycle).plan : null;
		const renewalCostLog = renewalPlan ? renewalPlan.cost_log : 0;
		const redstoneGrantAmount = redstone.getMembershipGrantAmount(finalMembershipType);
		const nextRedstoneGrantAt = current && current.billing_cycle === 'yearly'
			? current.next_redstone_grant_at
			: null;

		if (current) {
			await transactionalQuery(
				`UPDATE membership_subscriptions
				 SET status = 'replaced', auto_renew = 0, cancel_at_period_end = 1,
				     updated_at = CURRENT_TIMESTAMP
				 WHERE subscription_id = ?`,
				[current.subscription_id],
			);
		}
		const orderNo = generateOrderNo('MC');
		const requestKey = `redeem:${redeemCode.code_id}:${userId}`;
		const insertResult = await transactionalQuery(
			`INSERT INTO membership_subscriptions
			 (user_id, purchaser_user_id, membership_type, billing_cycle, cost_log, renewal_cost_log,
			  redstone_grant_amount, next_redstone_grant_at, status,
			  starts_at, expires_at, auto_renew, cancel_at_period_end, renewal_parent_id,
			  order_no, request_key, source, remark, created_at, updated_at)
			 VALUES (?, ?, ?, ?, 0, ?, ?, ?, 'active', ?, ?, ?, 0, ?, ?, ?, 'redeem_code', ?,
			         CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			[
				userId,
				userId,
				finalMembershipType,
				billingCycle,
				renewalCostLog,
				redstoneGrantAmount,
				nextRedstoneGrantAt,
				now,
				expiresAt,
				autoRenew ? 1 : 0,
				current ? current.subscription_id : null,
				orderNo,
				requestKey,
				`兑换码 ${redeemCode.code_hint}`,
			],
		);
		await transactionalQuery(
			`INSERT INTO membership_redeem_uses (code_id, user_id, subscription_id)
			 VALUES (?, ?, ?)`,
			[redeemCode.code_id, userId, insertResult.insertId],
		);
		await transactionalQuery(
			`UPDATE membership_redeem_codes
			 SET used_count = used_count + 1,
			     status = CASE WHEN used_count + 1 >= usage_limit THEN 'exhausted' ELSE status END,
			     updated_at = CURRENT_TIMESTAMP
			 WHERE code_id = ?`,
			[redeemCode.code_id],
		);
		const subscriptionRows = await transactionalQuery(
			'SELECT * FROM membership_subscriptions WHERE subscription_id = ? LIMIT 1',
			[insertResult.insertId],
		);
		const redstoneGrant = await redstone.grantRedstone(transactionalQuery, {
			userId,
			amount: redstoneGrantAmount,
			transactionType: 'membership_grant',
			referenceId: insertResult.insertId,
			periodKey: 'initial',
			requestKey: `membership:${insertResult.insertId}:redstone:initial`,
			description: `${MEMBERSHIP_PLANS[finalMembershipType].name}兑换码激活赠送${redstoneGrantAmount}红石`,
		});
		return {
			replayed: false,
			redeem_code: redeemCode,
			subscription: subscriptionRows[0],
			redstone_granted: redstoneGrant.amount,
		};
	}, 'redeem membership');

	if (!result.replayed) {
		const tierName = MEMBERSHIP_PLANS[result.subscription.membership_type].name;
		message.sendMsg(
			-1,
			userId,
			`${tierName}兑换成功，已增加${Number(result.redeem_code.duration_days)}天有效期，并赠送${Number(result.redstone_granted || 0)}红石（到账后3个月内有效），请前往会员中心查看。`,
			MEMBERSHIP_ROUTE,
			'notification',
			true,
		).catch((error) => console.log('发送会员兑换通知失败:', error.message));
	}
	return {
		replayed: result.replayed,
		code_hint: result.redeem_code.code_hint || maskRedeemCode(normalizedCode),
		membership_type: result.subscription.membership_type,
		duration_days: Number(result.redeem_code.duration_days),
		redstone_granted: Number(result.redstone_granted || 0),
		subscription: serializeSubscription(result.subscription),
	};
}

async function purchaseMembership(options) {
	const purchaserUserId = Number(options.purchaserUserId);
	const beneficiaryUserId = Number(options.beneficiaryUserId || purchaserUserId);
	if (!Number.isInteger(purchaserUserId) || purchaserUserId <= 0 || !Number.isInteger(beneficiaryUserId) || beneficiaryUserId <= 0) {
		throw createBusinessError('用户参数无效', 422, 'INVALID_USER');
	}
	const { tier, plan } = getPlan(options.membershipType, options.billingCycle);
	const source = options.source === 'gift' ? 'gift' : 'purchase';
	const giftMessage = String(options.giftMessage || '').trim().slice(0, 60);
	const requestKey = buildRequestKey(purchaserUserId, options.clientRequestId);
	const autoRenew = source === 'purchase'
		? toBoolean(options.autoRenew, plan.billing_cycle === 'monthly')
		: false;
	const replayRows = await query(
		'SELECT * FROM membership_subscriptions WHERE request_key = ? LIMIT 1',
		[requestKey],
	);
	if (replayRows.length > 0) {
		const balanceRows = await query('SELECT log FROM user_bank WHERE user_id = ? LIMIT 1', [purchaserUserId]);
		return {
			replayed: true,
			subscription: serializeSubscription(replayRows[0]),
			log_balance: balanceRows.length > 0 ? Number(balanceRows[0].log || 0) : 0,
			beneficiary: { user_id: Number(replayRows[0].user_id), name: null },
		};
	}

	const result = await withTransaction(async (transactionalQuery) => {
		if (source === 'gift') {
			await ensureGiftFriend(purchaserUserId, beneficiaryUserId, transactionalQuery);
		}
		const beneficiaryRows = await transactionalQuery(
			'SELECT user_id, name FROM users WHERE user_id = ? AND activated = 1 LIMIT 1 FOR UPDATE',
			[beneficiaryUserId],
		);
		if (beneficiaryRows.length === 0) {
			throw createBusinessError('接收用户不存在或账号未激活', 404, 'BENEFICIARY_NOT_FOUND');
		}

		await transactionalQuery(
			`UPDATE membership_subscriptions
			 SET status = 'expired', auto_renew = 0, cancel_at_period_end = 1,
			     updated_at = CURRENT_TIMESTAMP
			 WHERE user_id = ? AND status = 'active'
			   AND expires_at IS NOT NULL AND expires_at <= NOW()`,
			[beneficiaryUserId],
		);
		const current = await getCurrentSubscription(beneficiaryUserId, transactionalQuery, true);

		await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?),(?)', [purchaserUserId, beneficiaryUserId]);
		const bankRows = await transactionalQuery(
			`SELECT user_id, log, redstone
			 FROM user_bank
			 WHERE user_id IN (?, ?)
			 ORDER BY user_id
			 FOR UPDATE`,
			[purchaserUserId, beneficiaryUserId],
		);
		const purchaserBank = bankRows.find((row) => Number(row.user_id) === purchaserUserId);
		const existingRequestRows = await transactionalQuery(
			'SELECT * FROM membership_subscriptions WHERE request_key = ? LIMIT 1',
			[requestKey],
		);
		if (existingRequestRows.length > 0) {
			return {
				replayed: true,
				subscription: existingRequestRows[0],
				log_balance: Number(purchaserBank.log || 0),
			};
		}

		if (current && current.membership_type === 'super' && tier.key === 'standard') {
			throw createBusinessError(
				'超级原木通行证有效期内暂不支持降级购买',
				409,
				'MEMBERSHIP_DOWNGRADE_NOT_ALLOWED',
			);
		}

		const isUpgrade = source === 'purchase' && current &&
			current.membership_type === 'standard' && tier.key === 'super';
		const upgradeQuote = isUpgrade ? getUpgradeQuote(current) : null;
		const effectiveBillingCycle = isUpgrade ? current.billing_cycle : plan.billing_cycle;
		const chargeCostLog = isUpgrade ? upgradeQuote.cost_log : plan.cost_log;
		const renewalCostLog = isUpgrade ? upgradeQuote.renewal_cost_log : plan.cost_log;
		const effectiveAutoRenew = isUpgrade ? Boolean(current.auto_renew) : autoRenew;
		const redstoneGrantAmount = redstone.getMembershipGrantAmount(tier.key);
		const previousRedstoneGrantAmount = current
			? Number(current.redstone_grant_amount || redstone.getMembershipGrantAmount(current.membership_type))
			: 0;
		const initialRedstoneGrant = isUpgrade
			? Math.max(0, redstoneGrantAmount - previousRedstoneGrantAmount)
			: redstoneGrantAmount;

		const bankBalance = Number(purchaserBank.log || 0);
		if (bankBalance < chargeCostLog) {
			throw createBusinessError('原木余额不足', 409, 'INSUFFICIENT_LOG_BALANCE');
		}
		const debitResult = await transactionalQuery(
			'UPDATE user_bank SET log = log - ? WHERE user_id = ? AND log >= ?',
			[chargeCostLog, purchaserUserId, chargeCostLog],
		);
		if (debitResult.affectedRows === 0) {
			throw createBusinessError('原木余额不足', 409, 'INSUFFICIENT_LOG_BALANCE');
		}

		const now = new Date();
		const currentExpiry = current && current.expires_at ? new Date(current.expires_at) : null;
		const expiryBase = currentExpiry && currentExpiry > now ? currentExpiry : now;
		const expiresAt = isUpgrade ? currentExpiry : addBillingCycle(expiryBase, plan.billing_cycle);
		let nextRedstoneGrantAt = null;
		if (effectiveBillingCycle === 'yearly') {
			nextRedstoneGrantAt = isUpgrade && current.next_redstone_grant_at
				? new Date(current.next_redstone_grant_at)
				: addBillingCycle(now, 'monthly');
			if (nextRedstoneGrantAt >= expiresAt) nextRedstoneGrantAt = null;
		}
		if (current) {
			await transactionalQuery(
				`UPDATE membership_subscriptions
				 SET status = 'replaced', auto_renew = 0, cancel_at_period_end = 1, updated_at = CURRENT_TIMESTAMP
				 WHERE user_id = ? AND status = 'active' AND expires_at > NOW()`,
				[beneficiaryUserId],
			);
		}

		const orderNo = generateOrderNo(source === 'gift' ? 'MG' : 'MS');
		const insertResult = await transactionalQuery(
			`INSERT INTO membership_subscriptions
			 (user_id, purchaser_user_id, membership_type, billing_cycle, cost_log, renewal_cost_log,
			  redstone_grant_amount, next_redstone_grant_at, status,
			  starts_at, expires_at, auto_renew, cancel_at_period_end, renewal_parent_id,
			  order_no, request_key, source, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, 0, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			[
				beneficiaryUserId,
				purchaserUserId,
				tier.key,
				effectiveBillingCycle,
				chargeCostLog,
				renewalCostLog,
				redstoneGrantAmount,
				nextRedstoneGrantAt,
				now,
				expiresAt,
				effectiveAutoRenew ? 1 : 0,
				current ? current.subscription_id : null,
				orderNo,
				requestKey,
				source,
			],
		);

		const subscriptionRows = await transactionalQuery(
			'SELECT * FROM membership_subscriptions WHERE subscription_id = ? LIMIT 1',
			[insertResult.insertId],
		);
		const redstoneGrant = await redstone.grantRedstone(transactionalQuery, {
			userId: beneficiaryUserId,
			amount: initialRedstoneGrant,
			transactionType: isUpgrade ? 'membership_upgrade_grant' : 'membership_grant',
			referenceId: insertResult.insertId,
			periodKey: 'initial',
			requestKey: `membership:${insertResult.insertId}:redstone:initial`,
			description: isUpgrade
				? `升级超级原木通行证补赠${initialRedstoneGrant}红石`
				: `${tier.name}本期赠送${initialRedstoneGrant}红石`,
		});
		return {
			replayed: false,
			subscription: subscriptionRows[0],
			log_balance: bankBalance - chargeCostLog,
			beneficiary_name: beneficiaryRows[0].name,
			upgrade_quote: upgradeQuote,
			operation: isUpgrade ? 'upgrade' : current ? 'renew' : source === 'gift' ? 'gift' : 'subscribe',
			redstone_granted: redstoneGrant.amount,
		};
	}, 'purchase membership');

	if (!result.replayed && source === 'gift') {
		const purchaserRows = await query('SELECT name FROM users WHERE user_id = ? LIMIT 1', [purchaserUserId]);
		const purchaserName = purchaserRows.length > 0 ? purchaserRows[0].name : `用户${purchaserUserId}`;
		const giftMessageSuffix = giftMessage ? ` 赠言：${giftMessage}` : '';
		message.sendMsg(
			-1,
			beneficiaryUserId,
			`${purchaserName}送给你一份${tier.name}，会员礼品卡已经到账。${giftMessageSuffix}`,
			MEMBERSHIP_ROUTE,
			'activity',
			true,
			MEMBERSHIP_GIFT_CARD_BACKGROUND,
		).catch((error) => console.log('发送会员赠送通知失败:', error.message));
	} else if (!result.replayed && source === 'purchase') {
		const action = result.operation === 'upgrade'
			? '升级成功'
			: result.operation === 'renew' ? '续费成功' : '开通成功';
		message.sendMsg(
			-1,
			beneficiaryUserId,
			`${tier.name}${action}，已扣除${Number(result.subscription.cost_log || 0)}原木，并赠送${Number(result.redstone_granted || 0)}红石（到账后3个月内有效）。`,
			MEMBERSHIP_ROUTE,
			'notification',
			true,
		).catch((error) => console.log('发送会员开通通知失败:', error.message));
	}

	return {
		replayed: result.replayed,
		subscription: serializeSubscription(result.subscription),
		log_balance: result.log_balance,
		beneficiary: {
			user_id: beneficiaryUserId,
			name: result.beneficiary_name || null,
		},
		upgrade: result.upgrade_quote || null,
		operation: result.operation || null,
		redstone_granted: Number(result.redstone_granted || 0),
	};
}

async function setAutoRenew(userId, enabledValue) {
	const enabled = toBoolean(enabledValue);
	const subscription = await withTransaction(async (transactionalQuery) => {
		const current = await getCurrentSubscription(userId, transactionalQuery, true);
		if (!current) {
			throw createBusinessError('当前没有生效中的会员订阅', 404, 'ACTIVE_SUBSCRIPTION_NOT_FOUND');
		}
		await transactionalQuery(
			`UPDATE membership_subscriptions
			 SET auto_renew = ?, cancel_at_period_end = ?, cancelled_at = ?,
			     renewal_failure_count = 0, renewal_last_error = NULL, updated_at = CURRENT_TIMESTAMP
			 WHERE subscription_id = ?`,
			[enabled ? 1 : 0, enabled ? 0 : 1, enabled ? null : new Date(), current.subscription_id],
		);
		const rows = await transactionalQuery(
			'SELECT * FROM membership_subscriptions WHERE subscription_id = ? LIMIT 1',
			[current.subscription_id],
		);
		return rows[0];
	}, 'update membership auto renew');
	return serializeSubscription(subscription);
}

module.exports = {
	MEMBERSHIP_PLANS,
	createBusinessError,
	decorateRows,
	getPlanList,
	getCurrentSubscription,
	getCurrentMembershipTypes,
	getSubscriptionStatus,
	listSubscriptions,
	listGiftFriends,
	listRedeemHistory,
	redeemMembership,
	purchaseMembership,
	setAutoRenew,
	serializeSubscription,
	addBillingCycle,
	getUpgradeQuote,
};
