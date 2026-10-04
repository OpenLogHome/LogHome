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
			// 生产库 users 表存在遗留列 online_time TIMESTAMP DEFAULT '0000-00-00'，
			// 严格模式（NO_ZERO_DATE）下任何 ALTER 都会因整表定义校验而失败。
			// 仅在本会话摘除 NO_ZERO_IN_DATE/NO_ZERO_DATE（其余 sql_mode 保留，不影响全局），
			// 本脚本只加新列，不改动任何既有列的定义与数据。
			const [modeRow] = await query('SELECT @@SESSION.sql_mode AS m');
			const relaxed = String(modeRow.m)
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item !== 'NO_ZERO_IN_DATE' && item !== 'NO_ZERO_DATE')
				.join(',');
			await query(`SET SESSION sql_mode = '${relaxed}'`);
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
