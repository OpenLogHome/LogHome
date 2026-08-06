const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const config = require('../config.js');

const REQUIRED_TABLES = ['avatar_frames', 'user_avatar_frame_selections'];
const REQUIRED_FOREIGN_KEYS = ['fk_user_avatar_frame_user', 'fk_user_avatar_frame_frame'];

function splitSqlStatements(source) {
	return source
		.split(';')
		.map((statement) => statement.trim())
		.filter(Boolean);
}

async function executeAvatarFramesTables() {
	const connection = mysql.createConnection({
		host: config.database.host,
		port: config.database.port,
		user: config.database.user,
		password: config.database.password,
		database: config.database.database,
	});
	const query = (sql, values = []) => new Promise((resolve, reject) => {
		connection.query(sql, values, (error, results) => error ? reject(error) : resolve(results));
	});

	try {
		await new Promise((resolve, reject) => connection.connect((error) => error ? reject(error) : resolve()));
		const sqlPath = path.join(__dirname, 'create_avatar_frames_tables.sql');
		for (const statement of splitSqlStatements(fs.readFileSync(sqlPath, 'utf8'))) {
			await query(statement);
		}

		const tables = await query(
			`SELECT TABLE_NAME FROM information_schema.TABLES
			 WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN (?)`,
			[config.database.database, REQUIRED_TABLES],
		);
		if (tables.length !== REQUIRED_TABLES.length) throw new Error('头像挂件数据表创建不完整');

		const frameCountRows = await query('SELECT COUNT(*) AS total FROM avatar_frames WHERE status = \'active\'');
		if (Number(frameCountRows[0].total) !== 25) {
			throw new Error(`头像挂件种子数据数量异常：${frameCountRows[0].total}`);
		}

		const foreignKeys = await query(
			`SELECT CONSTRAINT_NAME FROM information_schema.REFERENTIAL_CONSTRAINTS
			 WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = 'user_avatar_frame_selections'`,
			[config.database.database],
		);
		const foreignKeyNames = new Set(foreignKeys.map((item) => item.CONSTRAINT_NAME));
		const missingForeignKeys = REQUIRED_FOREIGN_KEYS.filter((name) => !foreignKeyNames.has(name));
		if (missingForeignKeys.length > 0) throw new Error(`头像挂件选择表缺少外键：${missingForeignKeys.join(', ')}`);

		console.log('头像挂件数据表已创建并验证，已录入 25 个头像挂件。');
	} finally {
		connection.end();
	}
}

executeAvatarFramesTables().catch((error) => {
	console.error('创建头像挂件数据表失败:', error.message);
	process.exitCode = 1;
});
