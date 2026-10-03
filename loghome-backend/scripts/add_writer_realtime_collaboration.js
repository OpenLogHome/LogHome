const { query } = require('../sql.js');

const statements = [
	`CREATE TABLE IF NOT EXISTS article_collaboration_modes (
		article_id INT NOT NULL,
		mode ENUM('legacy_lock', 'realtime_crdt') NOT NULL DEFAULT 'legacy_lock',
		enabled_by INT NULL DEFAULT NULL,
		enabled_at DATETIME NULL DEFAULT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (article_id),
		KEY idx_article_collaboration_modes_mode (mode)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	`CREATE TABLE IF NOT EXISTS article_collab_documents (
		article_id INT NOT NULL,
		document_name VARCHAR(128) NOT NULL,
		ydoc_state MEDIUMBLOB NOT NULL,
		schema_version INT NOT NULL DEFAULT 1,
		revision BIGINT UNSIGNED NOT NULL DEFAULT 0,
		live_writer_id BIGINT NULL DEFAULT NULL,
		checkpoint_writer_id BIGINT NULL DEFAULT NULL,
		checkpoint_revision BIGINT UNSIGNED NULL DEFAULT NULL,
		content_hash VARCHAR(64) NULL DEFAULT NULL,
		last_editor_user_id INT NULL DEFAULT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (article_id),
		UNIQUE KEY uq_article_collab_documents_name (document_name),
		KEY idx_article_collab_documents_live_writer (live_writer_id),
		KEY idx_article_collab_documents_checkpoint_writer (checkpoint_writer_id),
		KEY idx_article_collab_documents_updated_at (updated_at)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	`CREATE TABLE IF NOT EXISTS article_paragraph_id_sequences (
		article_id INT NOT NULL,
		next_id BIGINT UNSIGNED NOT NULL,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (article_id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

async function main() {
	console.log('start writer realtime collaboration schema migration');
	for (const statement of statements) await query(statement);
	console.log('writer realtime collaboration schema migration completed');
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('writer realtime collaboration schema migration failed', error);
		process.exit(1);
	});
