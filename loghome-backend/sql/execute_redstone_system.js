const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const config = require('../config.js');

async function executeRedstoneSystem() {
	const connection = mysql.createConnection({
		...config.database,
	});
	const query = (sql, values = []) => new Promise((resolve, reject) => {
		connection.query(sql, values, (error, results) => (error ? reject(error) : resolve(results)));
	});

	try {
		await new Promise((resolve, reject) => {
			connection.connect((error) => (error ? reject(error) : resolve()));
		});

		const bankColumns = await query('SHOW COLUMNS FROM user_bank');
		if (!bankColumns.some((column) => column.Field === 'redstone')) {
			await query(
				"ALTER TABLE user_bank ADD COLUMN redstone INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用于AI功能的红石余额' AFTER log",
			);
		}

		const sqlPath = path.join(__dirname, 'create_redstone_system.sql');
		await query(fs.readFileSync(sqlPath, 'utf8'));

		let columns = await query('SHOW COLUMNS FROM redstone_transactions');
		const transactionTypeColumn = columns.find((column) => column.Field === 'transaction_type');
		if (transactionTypeColumn && !String(transactionTypeColumn.Type).includes('monthly_free_grant')) {
			await query(
				`ALTER TABLE redstone_transactions
				 MODIFY COLUMN transaction_type ENUM(
				   'membership_grant', 'membership_upgrade_grant', 'annual_refresh', 'monthly_free_grant',
				   'log_exchange', 'ai_usage', 'admin_adjustment', 'refund'
				 ) NOT NULL COMMENT '流水类型'`,
			);
			columns = await query('SHOW COLUMNS FROM redstone_transactions');
		}
		const indexes = await query('SHOW INDEX FROM redstone_transactions');
		const foreignKeys = await query(
			`SELECT CONSTRAINT_NAME
			 FROM information_schema.REFERENTIAL_CONSTRAINTS
			 WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = 'redstone_transactions'`,
			[config.database.database],
		);
		const requiredColumns = [
			'transaction_id', 'user_id', 'amount', 'log_cost', 'transaction_type',
			'reference_id', 'period_key', 'request_key', 'description', 'created_at',
		];
		const columnNames = new Set(columns.map((column) => column.Field));
		const missingColumns = requiredColumns.filter((column) => !columnNames.has(column));
		if (missingColumns.length > 0) {
			throw new Error(`redstone_transactions 缺少字段: ${missingColumns.join(', ')}`);
		}
		const indexNames = new Set(indexes.map((index) => index.Key_name));
		if (!indexNames.has('uniq_redstone_request_key')) {
			throw new Error('redstone_transactions 缺少幂等唯一索引');
		}
		if (!foreignKeys.some((key) => key.CONSTRAINT_NAME === 'fk_redstone_transaction_user')) {
			throw new Error('redstone_transactions 缺少用户外键');
		}

		console.log(`红石系统已创建并验证（余额字段、${columns.length} 个流水字段）。`);
	} finally {
		connection.end();
	}
}

executeRedstoneSystem().catch((error) => {
	console.error('创建红石系统失败:', error.message);
	process.exitCode = 1;
});
