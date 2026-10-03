const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const config = require('../config.js');

async function executeActivityPopularity() {
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
		if (!columnNames.has('popularity_enabled')) {
			await query(
				"ALTER TABLE activity ADD COLUMN popularity_enabled TINYINT NOT NULL DEFAULT 0 COMMENT '是否启用人气票'",
			);
		}
		if (!columnNames.has('popularity_quota')) {
			await query(
				"ALTER TABLE activity ADD COLUMN popularity_quota INT UNSIGNED NOT NULL DEFAULT 2 COMMENT '每个用户在本活动中的票数上限'",
			);
		}
		if (!columnNames.has('popularity_rules')) {
			await query(
				"ALTER TABLE activity ADD COLUMN popularity_rules TEXT NULL COMMENT '投票限制规则JSON数组，如 [{\"type\":\"require_completed\",\"value\":true}]'",
			);
		}

		await query(fs.readFileSync(path.join(__dirname, 'create_activity_popularity.sql'), 'utf8'));

		const voteColumns = await query('SHOW COLUMNS FROM activity_popularity_vote');
		const requiredVoteColumns = ['vote_id', 'tag_id', 'user_id', 'novel_id', 'create_time'];
		const voteColumnNames = new Set(voteColumns.map((column) => column.Field));
		const missingVoteColumns = requiredVoteColumns.filter((column) => !voteColumnNames.has(column));
		if (missingVoteColumns.length > 0) {
			throw new Error(`activity_popularity_vote 缺少字段: ${missingVoteColumns.join(', ')}`);
		}
		const voteIndexes = await query('SHOW INDEX FROM activity_popularity_vote');
		const voteIndexNames = new Set(voteIndexes.map((index) => index.Key_name));
		if (!voteIndexNames.has('uniq_activity_vote')) {
			throw new Error('activity_popularity_vote 缺少唯一索引 uniq_activity_vote');
		}

		console.log('活动人气票系统迁移完成');
	} finally {
		connection.end();
	}
}

executeActivityPopularity().catch((error) => {
	console.error('活动人气票系统迁移失败:', error);
	process.exitCode = 1;
});
