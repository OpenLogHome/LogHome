/**
 * 协作待办看板建表：todo_project / todo_task / todo_comment / todo_attachment
 * 同时初始化四个项目分类，任务、评论、附件均从空数据开始。
 */
const mysql = require('mysql');
const config = require('../config.js');

const TABLES = ['todo_project', 'todo_task', 'todo_comment', 'todo_attachment'];

const CREATE_STATEMENTS = [
	`CREATE TABLE IF NOT EXISTS todo_project (
		project_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		name VARCHAR(40) NOT NULL,
		color VARCHAR(20) NOT NULL DEFAULT '#8d6e63',
		bg_color VARCHAR(20) NOT NULL DEFAULT '#f3edeb',
		sort_order INT NOT NULL DEFAULT 0,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (project_id),
		UNIQUE KEY uk_todo_project_name (name)
	) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '协作待办项目分类'`,
	`CREATE TABLE IF NOT EXISTS todo_task (
		task_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		title VARCHAR(120) NOT NULL,
		description TEXT NULL,
		status VARCHAR(10) NOT NULL DEFAULT 'todo' COMMENT 'todo/doing/done',
		priority VARCHAR(10) NOT NULL DEFAULT 'mid' COMMENT 'high/mid/low',
		project_id INT UNSIGNED NOT NULL,
		assignee_id INT NOT NULL COMMENT '负责人 users.user_id',
		created_by INT NOT NULL COMMENT '创建人 users.user_id',
		due_date DATE NULL,
		completed_at DATETIME NULL,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (task_id),
		KEY idx_todo_task_status (status),
		KEY idx_todo_task_assignee (assignee_id),
		KEY idx_todo_task_project (project_id),
		CONSTRAINT fk_todo_task_project FOREIGN KEY (project_id) REFERENCES todo_project (project_id)
	) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '协作待办任务'`,
	`CREATE TABLE IF NOT EXISTS todo_comment (
		comment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		task_id INT UNSIGNED NULL,
		project_id INT UNSIGNED NULL,
		author_id INT NOT NULL COMMENT '评论人 users.user_id',
		content VARCHAR(1000) NOT NULL,
		is_system TINYINT NOT NULL DEFAULT 0,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (comment_id),
		KEY idx_todo_comment_task (task_id, created_at),
		KEY idx_todo_comment_project (project_id, created_at),
		CONSTRAINT fk_todo_comment_task FOREIGN KEY (task_id) REFERENCES todo_task (task_id) ON DELETE CASCADE,
		CONSTRAINT fk_todo_comment_project FOREIGN KEY (project_id) REFERENCES todo_project (project_id) ON DELETE CASCADE
	) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '协作待办评论与系统动态'`,
	`CREATE TABLE IF NOT EXISTS todo_attachment (
		attachment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		task_id INT UNSIGNED NULL,
		project_id INT UNSIGNED NULL,
		name VARCHAR(200) NOT NULL,
		resource_id VARCHAR(64) NOT NULL,
		size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
		is_image TINYINT NOT NULL DEFAULT 0,
		uploaded_by INT NOT NULL COMMENT '上传人 users.user_id',
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (attachment_id),
		KEY idx_todo_attachment_task (task_id),
		KEY idx_todo_attachment_project (project_id),
		CONSTRAINT fk_todo_attachment_task FOREIGN KEY (task_id) REFERENCES todo_task (task_id) ON DELETE CASCADE,
		CONSTRAINT fk_todo_attachment_project FOREIGN KEY (project_id) REFERENCES todo_project (project_id) ON DELETE CASCADE
	) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '协作待办任务附件与项目文档'`,
];

const DEFAULT_PROJECTS = [
	[1, '实验室', '#8d6e63', '#f3edeb', 1],
	[2, '后台', '#409eff', '#ecf5ff', 2],
	[3, '主站', '#67c23a', '#f0f9eb', 3],
	[4, '其他', '#909399', '#f4f4f5', 4],
];

async function createTodoBoardTables() {
	const connection = mysql.createConnection({
		host: config.database.host,
		port: config.database.port,
		user: config.database.user,
		password: config.database.password,
		database: config.database.database,
		multipleStatements: false,
	});

	const query = (sql, values = []) =>
		new Promise((resolve, reject) => {
			connection.query(sql, values, (error, results) => {
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

		for (const statement of CREATE_STATEMENTS) {
			await query(statement);
		}

		const tables = await query(
			`SELECT TABLE_NAME FROM information_schema.TABLES
			 WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN (?)`,
			[config.database.database, TABLES],
		);
		if (tables.length !== TABLES.length) {
			throw new Error('协作待办数据表创建不完整');
		}

		await query(
			`INSERT IGNORE INTO todo_project (project_id, name, color, bg_color, sort_order)
			 VALUES ?`,
			[DEFAULT_PROJECTS],
		);

		const projectRows = await query('SELECT COUNT(*) AS total FROM todo_project');
		console.log(
			`协作待办数据表已就绪，项目分类 ${projectRows[0].total} 个。`,
		);
	} finally {
		connection.end();
	}
}

createTodoBoardTables().catch((error) => {
	console.error('创建协作待办数据表失败:', error.message);
	process.exitCode = 1;
});
