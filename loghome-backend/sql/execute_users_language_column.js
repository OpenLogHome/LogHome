const mysql = require('mysql');
const config = require('../config.js');

// i18n P0：为 users 表增加账号级语言偏好列（NULL = 跟随设备）
async function executeUsersLanguageColumn() {
	const connection = mysql.createConnection({
		host: config.database.host,
		port: config.database.port,
		user: config.database.user,
		password: config.database.password,
		database: config.database.database,
	});

	const query = (sql) =>
		new Promise((resolve, reject) => {
			connection.query(sql, (error, results) => {
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
		const columns = await query('SHOW COLUMNS FROM users');
		if (!columns.some((column) => column.Field === 'language')) {
			await query(
				"ALTER TABLE users ADD COLUMN language VARCHAR(10) NULL COMMENT 'UI language preference (zh-CN/en), NULL = follow device' AFTER push_set_status",
			);
			console.log('users.language 列已添加。');
		} else {
			console.log('users.language 列已存在，跳过。');
		}
	} finally {
		connection.end();
	}
}

executeUsersLanguageColumn().catch((error) => {
	console.error('添加 users.language 列失败:', error.message);
	process.exitCode = 1;
});
