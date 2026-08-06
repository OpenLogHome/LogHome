const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const config = require('../config.js');

const REQUIRED_COLUMNS = [
	'subscription_id',
	'user_id',
	'purchaser_user_id',
	'membership_type',
	'billing_cycle',
	'cost_log',
	'renewal_cost_log',
	'redstone_grant_amount',
	'next_redstone_grant_at',
	'status',
	'starts_at',
	'expires_at',
	'auto_renew',
	'cancel_at_period_end',
	'cancelled_at',
	'renewal_parent_id',
	'order_no',
	'request_key',
	'source',
	'remark',
	'last_renewal_attempt_at',
	'renewal_failure_count',
	'renewal_last_error',
	'created_at',
	'updated_at',
];

const REQUIRED_INDEXES = [
	'uniq_membership_order_no',
	'uniq_membership_request_key',
	'uniq_membership_renewal_parent',
	'idx_membership_user_status_expiry',
	'idx_membership_user_created',
	'idx_membership_purchaser_created',
	'idx_membership_type_status',
];

const REQUIRED_FOREIGN_KEYS = [
	'fk_membership_subscription_user',
	'fk_membership_subscription_purchaser',
	'fk_membership_subscription_parent',
];

const COLUMN_MIGRATIONS = {
	purchaser_user_id: 'ADD COLUMN purchaser_user_id INT NULL COMMENT \'实际付款用户ID，赠送时与权益用户不同\' AFTER user_id',
	renewal_cost_log: 'ADD COLUMN renewal_cost_log INT UNSIGNED NOT NULL DEFAULT 0 COMMENT \'下次自动续费应扣除的原木价格快照\' AFTER cost_log',
	redstone_grant_amount: 'ADD COLUMN redstone_grant_amount INT UNSIGNED NOT NULL DEFAULT 0 COMMENT \'每个会员发放周期赠送的红石数量\' AFTER renewal_cost_log',
	next_redstone_grant_at: 'ADD COLUMN next_redstone_grant_at DATETIME NULL COMMENT \'年付会员下一次红石发放时间\' AFTER redstone_grant_amount',
	request_key: 'ADD COLUMN request_key VARCHAR(96) NULL COMMENT \'用户维度幂等请求键\' AFTER order_no',
	last_renewal_attempt_at: 'ADD COLUMN last_renewal_attempt_at DATETIME NULL COMMENT \'最近一次自动续费尝试时间\' AFTER remark',
	renewal_failure_count: 'ADD COLUMN renewal_failure_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT \'自动续费连续失败次数\' AFTER last_renewal_attempt_at',
	renewal_last_error: 'ADD COLUMN renewal_last_error VARCHAR(255) NULL COMMENT \'最近一次自动续费失败原因\' AFTER renewal_failure_count',
};

async function executeMembershipSubscriptionsTable() {
	const connection = mysql.createConnection({
		host: config.database.host,
		port: config.database.port,
		user: config.database.user,
		password: config.database.password,
		database: config.database.database,
	});

	const query = (sql, values = []) =>
		new Promise((resolve, reject) => {
			connection.query(sql, values, (error, results) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(results);
			});
		});

	try {
		await new Promise((resolve, reject) => {
			connection.connect((error) => (error ? reject(error) : resolve()));
		});

		const sqlPath = path.join(__dirname, 'create_membership_subscriptions_table.sql');
		await query(fs.readFileSync(sqlPath, 'utf8'));
		const redeemSqlPath = path.join(__dirname, 'create_membership_redeem_codes.sql');
		const redeemStatements = fs.readFileSync(redeemSqlPath, 'utf8')
			.split(';')
			.map((statement) => statement.trim())
			.filter(Boolean);
		for (const statement of redeemStatements) {
			await query(statement);
		}

		let columns = await query('SHOW COLUMNS FROM membership_subscriptions');
		let columnNames = new Set(columns.map((column) => column.Field));
		for (const [columnName, migration] of Object.entries(COLUMN_MIGRATIONS)) {
			if (!columnNames.has(columnName)) {
				await query(`ALTER TABLE membership_subscriptions ${migration}`);
			}
		}
		await query(
			`UPDATE membership_subscriptions
			 SET renewal_cost_log = cost_log
			 WHERE renewal_cost_log = 0 AND cost_log > 0`,
		);
		await query(
			`UPDATE membership_subscriptions
			 SET redstone_grant_amount = CASE membership_type WHEN 'super' THEN 200 ELSE 100 END,
			     next_redstone_grant_at = CASE
			       WHEN billing_cycle = 'yearly' AND next_redstone_grant_at IS NULL THEN NOW()
			       ELSE next_redstone_grant_at
			     END
			 WHERE status = 'active' AND redstone_grant_amount IN (0, 300, 500)`,
		);

		columns = await query('SHOW COLUMNS FROM membership_subscriptions');
		columnNames = new Set(columns.map((column) => column.Field));
		const sourceColumn = columns.find((column) => column.Field === 'source');
		if (sourceColumn && !String(sourceColumn.Type).includes('auto_renewal')) {
			await query(
				'ALTER TABLE membership_subscriptions MODIFY COLUMN source ENUM(\'purchase\', \'gift\', \'redeem_code\', \'auto_renewal\', \'admin\', \'migration\') NOT NULL DEFAULT \'purchase\' COMMENT \'订阅来源\'',
			);
		}
		const missingColumns = REQUIRED_COLUMNS.filter((column) => !columnNames.has(column));
		if (missingColumns.length > 0) {
			throw new Error(`membership_subscriptions 缺少字段: ${missingColumns.join(', ')}`);
		}

		let indexes = await query('SHOW INDEX FROM membership_subscriptions');
		let indexNames = new Set(indexes.map((index) => index.Key_name));
		if (!indexNames.has('uniq_membership_request_key')) {
			await query('ALTER TABLE membership_subscriptions ADD UNIQUE KEY uniq_membership_request_key (request_key)');
		}
		if (!indexNames.has('uniq_membership_renewal_parent')) {
			await query('ALTER TABLE membership_subscriptions ADD UNIQUE KEY uniq_membership_renewal_parent (renewal_parent_id)');
		}
		if (!indexNames.has('idx_membership_purchaser_created')) {
			await query('ALTER TABLE membership_subscriptions ADD KEY idx_membership_purchaser_created (purchaser_user_id, created_at)');
		}

		indexes = await query('SHOW INDEX FROM membership_subscriptions');
		indexNames = new Set(indexes.map((index) => index.Key_name));
		const missingIndexes = REQUIRED_INDEXES.filter((index) => !indexNames.has(index));
		if (missingIndexes.length > 0) {
			throw new Error(`membership_subscriptions 缺少索引: ${missingIndexes.join(', ')}`);
		}

		let foreignKeys = await query(
			`SELECT CONSTRAINT_NAME
			 FROM information_schema.REFERENTIAL_CONSTRAINTS
			 WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = 'membership_subscriptions'`,
			[config.database.database],
		);
		let foreignKeyNames = new Set(foreignKeys.map((foreignKey) => foreignKey.CONSTRAINT_NAME));
		if (!foreignKeyNames.has('fk_membership_subscription_purchaser')) {
			await query(
				`ALTER TABLE membership_subscriptions
				 ADD CONSTRAINT fk_membership_subscription_purchaser
				 FOREIGN KEY (purchaser_user_id) REFERENCES users (user_id)
				 ON DELETE SET NULL ON UPDATE CASCADE`,
			);
			foreignKeys = await query(
				`SELECT CONSTRAINT_NAME
				 FROM information_schema.REFERENTIAL_CONSTRAINTS
				 WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = 'membership_subscriptions'`,
				[config.database.database],
			);
			foreignKeyNames = new Set(foreignKeys.map((foreignKey) => foreignKey.CONSTRAINT_NAME));
		}
		const missingForeignKeys = REQUIRED_FOREIGN_KEYS.filter((foreignKey) => !foreignKeyNames.has(foreignKey));
		if (missingForeignKeys.length > 0) {
			throw new Error(`membership_subscriptions 缺少外键: ${missingForeignKeys.join(', ')}`);
		}
		const redeemTables = await query(
			`SELECT TABLE_NAME
			 FROM information_schema.TABLES
			 WHERE TABLE_SCHEMA = ?
			   AND TABLE_NAME IN ('membership_redeem_codes', 'membership_redeem_uses')`,
			[config.database.database],
		);
		if (redeemTables.length !== 2) {
			throw new Error('会员兑换码数据表创建不完整');
		}

		console.log(
			`会员订阅与兑换码数据表已创建并验证（订阅表 ${columns.length} 个字段、${REQUIRED_INDEXES.length} 个业务索引、${foreignKeys.length} 个外键）。`,
		);
	} finally {
		connection.end();
	}
}

executeMembershipSubscriptionsTable().catch((error) => {
	console.error('创建 membership_subscriptions 表失败:', error.message);
	process.exitCode = 1;
});
