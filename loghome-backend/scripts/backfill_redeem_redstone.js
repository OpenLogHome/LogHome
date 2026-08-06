// 补发兑换码激活缺失的红石（一次性数据修复脚本）
const crypto = require('crypto');
const { query, withTransaction } = require('../sql.js');

const TIER_NAMES = { standard: '原木通行证', super: '超级原木通行证' };

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
	await transactionalQuery('UPDATE user_bank SET redstone = redstone + ? WHERE user_id = ?', [amount, options.userId]);
	return amount;
}

async function main() {
	const rows = await query(
		`SELECT subscription_id, user_id, membership_type, redstone_grant_amount, status
		 FROM membership_subscriptions
		 WHERE source = 'redeem_code' AND status = 'active'`,
	);

	let totalGranted = 0;
	let skipped = 0;
	for (const row of rows) {
		const subscriptionId = Number(row.subscription_id);
		const userId = Number(row.user_id);
		const amount = Number(row.redstone_grant_amount || 0);
		const requestKey = `membership:${subscriptionId}:redstone:initial`;

		const existing = await query(
			'SELECT transaction_id FROM redstone_transactions WHERE request_key = ? LIMIT 1',
			[requestKey],
		);
		if (existing.length > 0) {
			skipped += 1;
			console.log(`#${subscriptionId} 用户${userId} 已有初始红石记录，跳过`);
			continue;
		}

		const granted = await withTransaction(async (transactionalQuery) => grantRedstone(transactionalQuery, {
			userId,
			amount,
			transactionType: 'membership_grant',
			referenceId: subscriptionId,
			periodKey: 'initial',
			requestKey,
			description: `${TIER_NAMES[row.membership_type] || '会员通行证'}兑换码激活赠送${amount}红石（补发）`,
		}), 'backfill redeem redstone');

		totalGranted += granted;
		console.log(`#${subscriptionId} 用户${userId} 补发 ${granted} 红石`);
	}
	console.log(`补发完成：共发放 ${totalGranted} 红石，跳过 ${skipped} 条`);
	process.exit(0);
}

main().catch((error) => {
	console.error('补发红石失败:', error.message);
	process.exit(1);
});
