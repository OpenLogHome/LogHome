const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const config = require('../config.js');

async function executeNovelWritingActivityTables() {
	const connection = mysql.createConnection({
		...config.database,
		timezone: '+08:00',
		charset: 'utf8mb4',
		multipleStatements: true,
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
		const sqlPath = path.join(
			__dirname,
			'create_novel_writing_activity_tables.sql',
		);
		await query(fs.readFileSync(sqlPath, 'utf8'));
		console.log('作品创作日历数据表已创建或已存在。');
	} finally {
		connection.end();
	}
}

executeNovelWritingActivityTables().catch((error) => {
	console.error('创建作品创作日历数据表失败:', error.message);
	process.exitCode = 1;
});
