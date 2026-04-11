const { query } = require('../sql.js');

async function hasTable(tableName) {
	const rows = await query(
		`SELECT COUNT(*) AS count
		FROM INFORMATION_SCHEMA.TABLES
		WHERE TABLE_SCHEMA = DATABASE()
			AND TABLE_NAME = ?`,
		[tableName],
	);
	return Number(rows[0].count) > 0;
}

async function hasColumn(tableName, columnName) {
	const rows = await query(
		`SELECT COUNT(*) AS count
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = DATABASE()
			AND TABLE_NAME = ?
			AND COLUMN_NAME = ?`,
		[tableName, columnName],
	);
	return Number(rows[0].count) > 0;
}

async function hasIndex(tableName, indexName) {
	const rows = await query(
		`SELECT COUNT(*) AS count
		FROM INFORMATION_SCHEMA.STATISTICS
		WHERE TABLE_SCHEMA = DATABASE()
			AND TABLE_NAME = ?
			AND INDEX_NAME = ?`,
		[tableName, indexName],
	);
	return Number(rows[0].count) > 0;
}

async function ensureTableNovelCollaborators() {
	if (await hasTable('novel_collaborators')) {
		console.log('table novel_collaborators already exists');
		return;
	}

	await query(
		`CREATE TABLE novel_collaborators (
			id BIGINT NOT NULL AUTO_INCREMENT,
			novel_id INT NOT NULL,
			user_id INT NOT NULL,
			role VARCHAR(32) NOT NULL DEFAULT 'collaborator',
			status VARCHAR(32) NOT NULL DEFAULT 'pending',
			invited_by INT NOT NULL,
			invited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			accepted_at DATETIME NULL DEFAULT NULL,
			create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY uq_novel_collaborators_novel_user (novel_id, user_id),
			KEY idx_novel_collaborators_user_status (user_id, status),
			KEY idx_novel_collaborators_novel_status (novel_id, status)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	);
	console.log('created table novel_collaborators');
}

async function ensureNovelCollaboratorPermissionColumns() {
	const columns = [
		{
			name: 'can_edit_article',
			sql: 'ALTER TABLE novel_collaborators ADD COLUMN can_edit_article TINYINT(1) NOT NULL DEFAULT 1 AFTER status',
		},
		{
			name: 'can_add_article',
			sql: 'ALTER TABLE novel_collaborators ADD COLUMN can_add_article TINYINT(1) NOT NULL DEFAULT 0 AFTER can_edit_article',
		},
		{
			name: 'can_delete_article',
			sql: 'ALTER TABLE novel_collaborators ADD COLUMN can_delete_article TINYINT(1) NOT NULL DEFAULT 0 AFTER can_add_article',
		},
		{
			name: 'can_sort_article',
			sql: 'ALTER TABLE novel_collaborators ADD COLUMN can_sort_article TINYINT(1) NOT NULL DEFAULT 0 AFTER can_delete_article',
		},
		{
			name: 'can_publish_article',
			sql: 'ALTER TABLE novel_collaborators ADD COLUMN can_publish_article TINYINT(1) NOT NULL DEFAULT 0 AFTER can_sort_article',
		},
	];

	for (const column of columns) {
		if (await hasColumn('novel_collaborators', column.name)) {
			console.log(`column novel_collaborators.${column.name} already exists`);
			continue;
		}
		await query(column.sql);
		console.log(`added column novel_collaborators.${column.name}`);
	}
}

async function ensureTableArticleEditLocks() {
	if (await hasTable('article_edit_locks')) {
		console.log('table article_edit_locks already exists');
		return;
	}

	await query(
		`CREATE TABLE article_edit_locks (
			lock_id BIGINT NOT NULL AUTO_INCREMENT,
			article_id INT NOT NULL,
			novel_id INT NOT NULL,
			user_id INT NOT NULL,
			session_id VARCHAR(64) NOT NULL,
			status VARCHAR(32) NOT NULL DEFAULT 'active',
			expires_at DATETIME NOT NULL,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (lock_id),
			KEY idx_article_edit_locks_article_status_expires (article_id, status, expires_at),
			KEY idx_article_edit_locks_novel_status_expires (novel_id, status, expires_at),
			KEY idx_article_edit_locks_user_status (user_id, status),
			KEY idx_article_edit_locks_session (session_id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	);
	console.log('created table article_edit_locks');
}

async function ensureArticlesWriterColumns() {
	const columns = [
		{
			name: 'editor_user_id',
			sql: 'ALTER TABLE articles_writer ADD COLUMN editor_user_id INT NULL DEFAULT NULL AFTER novel_id',
		},
		{
			name: 'edit_session_id',
			sql: 'ALTER TABLE articles_writer ADD COLUMN edit_session_id VARCHAR(64) NULL DEFAULT NULL AFTER editor_user_id',
		},
	];

	for (const column of columns) {
		if (await hasColumn('articles_writer', column.name)) {
			console.log(`column articles_writer.${column.name} already exists`);
			continue;
		}
		await query(column.sql);
		console.log(`added column articles_writer.${column.name}`);
	}
}

async function ensureArticlesWriterIndexes() {
	const indexes = [
		{
			name: 'idx_articles_writer_article_create_time',
			sql: 'ALTER TABLE articles_writer ADD INDEX idx_articles_writer_article_create_time (article_id, create_time)',
		},
		{
			name: 'idx_articles_writer_editor_user_id',
			sql: 'ALTER TABLE articles_writer ADD INDEX idx_articles_writer_editor_user_id (editor_user_id)',
		},
		{
			name: 'idx_articles_writer_edit_session_id',
			sql: 'ALTER TABLE articles_writer ADD INDEX idx_articles_writer_edit_session_id (edit_session_id)',
		},
	];

	for (const index of indexes) {
		if (await hasIndex('articles_writer', index.name)) {
			console.log(`index ${index.name} already exists`);
			continue;
		}
		await query(index.sql);
		console.log(`added index ${index.name}`);
	}
}

async function main() {
	console.log('start collaboration schema migration');
	await ensureTableNovelCollaborators();
	await ensureNovelCollaboratorPermissionColumns();
	await ensureTableArticleEditLocks();
	await ensureArticlesWriterColumns();
	await ensureArticlesWriterIndexes();
	console.log('collaboration schema migration completed');
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('collaboration schema migration failed', error);
		process.exit(1);
	});
