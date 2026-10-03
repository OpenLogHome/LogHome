const mysql = require('mysql');
const config = require('../config.js');

async function executeActivityRestrictUpdate() {
	const connection = mysql.createConnection({
		...config.database,
		multipleStatements: true,
	});
	const query = (sql, values = []) => new Promise((resolve, reject) => {
		connection.query(sql, values, (error, results) => (error ? reject(error) : resolve(results)));
	});

	try {
		await new Promise((resolve, reject) => {
			connection.connect((error) => (error ? reject(error) : resolve()));
		});

		const activityColumns = await query('SHOW COLUMNS FROM activity');
		const columnNames = new Set(activityColumns.map((column) => column.Field));
		if (!columnNames.has('restrict_complete_update')) {
			await query(
				"ALTER TABLE activity ADD COLUMN restrict_complete_update TINYINT NOT NULL DEFAULT 0 COMMENT '活动进行中时，作品完结后禁止新增/编辑章节及退回连载状态'",
			);
		}

		console.log('创作活动完结限制迁移完成');
	} finally {
		connection.end();
	}
}

executeActivityRestrictUpdate().catch((error) => {
	console.error('创作活动完结限制迁移失败:', error);
	process.exitCode = 1;
});
