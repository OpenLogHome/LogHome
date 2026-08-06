const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const config = require('../config.js');

async function executeWriterBackgroundSkinsTable() {
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
		const sqlPath = path.join(__dirname, 'create_writer_background_skins_table.sql');
		await query(fs.readFileSync(sqlPath, 'utf8'));
		const columns = await query('SHOW COLUMNS FROM writer_background_skins');
		if (!columns.some((column) => column.Field === 'theme_key')) {
			await query(
				'ALTER TABLE writer_background_skins ADD COLUMN theme_key VARCHAR(64) NOT NULL DEFAULT \'yellow\' COMMENT \'Base theme key applied with this image skin\' AFTER skin_name',
			);
		}
		if (!columns.some((column) => column.Field === 'required_membership')) {
			await query(
				'ALTER TABLE writer_background_skins ADD COLUMN required_membership ENUM(\'none\', \'standard\', \'super\') NOT NULL DEFAULT \'none\' COMMENT \'Minimum membership required to use this skin\' AFTER background_repeat',
			);
		}
		const seedSqlPath = path.join(__dirname, 'seed_writer_background_skins.sql');
		await query(fs.readFileSync(seedSqlPath, 'utf8'));
		await query(
			'UPDATE writer_background_skins SET image_url = \'/static/reader-skins/premium/block-epoch.jpg?v=2\' WHERE skin_key = \'block_epoch\'',
		);
		console.log('writer_background_skins 表已创建或已存在。');
	} finally {
		connection.end();
	}
}

executeWriterBackgroundSkinsTable().catch((error) => {
	console.error('创建 writer_background_skins 表失败:', error.message);
	process.exitCode = 1;
});
