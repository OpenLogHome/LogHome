/**
 * 首页榜单快照建表：rank_snapshot
 * 4 榜（update/logpower/complete/new）× 3 专区（novel/manga/world），每榜 Top 50，按日快照
 */
const mysql = require('mysql');
const config = require('../config.js');

async function createRankSnapshotTable() {
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
		await query(`CREATE TABLE IF NOT EXISTS rank_snapshot (
			snapshot_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
			board VARCHAR(20) NOT NULL COMMENT '榜单 update-更新榜 logpower-原木力榜 complete-完结榜 new-新作榜',
			zone VARCHAR(20) NOT NULL COMMENT '专区 novel-小说 manga-漫画 world-世界',
			novel_id INT NOT NULL,
			position SMALLINT UNSIGNED NOT NULL COMMENT '榜内名次 1 起',
			score INT NOT NULL DEFAULT 0 COMMENT '当期排序分值（原木力等，无分值榜为 0）',
			snapshot_date DATE NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (snapshot_id),
			UNIQUE KEY uk_board_zone_date_position (board, zone, snapshot_date, position),
			KEY idx_board_zone_novel (board, zone, novel_id)
		) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '首页榜单快照'`);
		console.log('rank_snapshot 表已就绪。');
	} finally {
		connection.end();
	}
}

createRankSnapshotTable().catch((error) => {
	console.error('创建 rank_snapshot 表失败:', error.message);
	process.exitCode = 1;
});
