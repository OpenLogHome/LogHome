const mysql = require('mysql');
const config = require('../config.js');

// 作品举报：为 novels 表增加下架标记列 is_banned
async function addNovelsIsBannedColumn() {
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
		const columns = await query('SHOW COLUMNS FROM novels');
		if (!columns.some((column) => column.Field === 'is_banned')) {
			// novels 表存在遗留的非法默认值列，严格模式下任何 ALTER 都会因整表定义校验而失败。
			// 与 execute_users_language_column.js 相同，仅在本会话摘除 NO_ZERO_*（其余 sql_mode 保留）。
			const [modeRow] = await query('SELECT @@SESSION.sql_mode AS m');
			const relaxed = String(modeRow.m)
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item !== 'NO_ZERO_IN_DATE' && item !== 'NO_ZERO_DATE')
				.join(',');
			await query(`SET SESSION sql_mode = '${relaxed}'`);
			await query(
				"ALTER TABLE novels ADD COLUMN is_banned tinyint(4) NOT NULL DEFAULT 0 COMMENT '是否被举报下架 0-正常 1-已下架'",
			);
			console.log('novels.is_banned 列已添加。');
		} else {
			console.log('novels.is_banned 列已存在，跳过。');
		}

		// comm_reports 线上库缺少防重复举报的唯一索引，一并补上
		const indexes = await query('SHOW INDEX FROM comm_reports');
		if (!indexes.some((index) => index.Key_name === 'idx_user_target')) {
			const duplicates = await query(
				'SELECT user_id, target_id, target_type FROM comm_reports GROUP BY user_id, target_id, target_type HAVING COUNT(*) > 1',
			);
			if (duplicates.length > 0) {
				console.warn(
					`comm_reports 存在 ${duplicates.length} 组重复举报记录，需先清理才能添加唯一索引，本次跳过。`,
				);
			} else {
				await query(
					'ALTER TABLE comm_reports ADD UNIQUE KEY idx_user_target (user_id, target_id, target_type)',
				);
				console.log('comm_reports 唯一索引 idx_user_target 已添加。');
			}
		} else {
			console.log('comm_reports 唯一索引 idx_user_target 已存在，跳过。');
		}
	} finally {
		connection.end();
	}
}

addNovelsIsBannedColumn().catch((error) => {
	console.error('添加 novels.is_banned 列失败:', error.message);
	process.exitCode = 1;
});
