const { query, withTransaction } = require('../sql');
let ready;
function ensureRankBadgeSchema() {
	if (!ready)
		ready = create().catch(error => {
			ready = null;
			throw error;
		});
	return ready;
}
async function create() {
	await query(`CREATE TABLE IF NOT EXISTS rank_batch (
  batch_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  snapshot_date DATE NOT NULL, generated_at DATETIME NOT NULL,
  rule_version INT NOT NULL, status VARCHAR(16) NOT NULL,
  expires_at DATETIME NOT NULL,
  KEY idx_complete (status, batch_id), KEY idx_date (snapshot_date)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
	await query(`CREATE TABLE IF NOT EXISTS rank_badge_snapshot (
  batch_id BIGINT UNSIGNED NOT NULL, board VARCHAR(20) NOT NULL, zone VARCHAR(20) NOT NULL,
  novel_id INT NOT NULL, position SMALLINT UNSIGNED NOT NULL, score INT NOT NULL DEFAULT 0,
  item_json MEDIUMTEXT NOT NULL, badges_json TEXT NOT NULL,
  PRIMARY KEY(batch_id,board,zone,position), KEY idx_novel(novel_id),
  KEY idx_board_batch(board,zone,batch_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
	await query(`CREATE TABLE IF NOT EXISTS novel_publish_record (
  article_id INT PRIMARY KEY, novel_id INT NOT NULL, article_type VARCHAR(32) NOT NULL,
  first_published_at DATETIME NULL, first_publication_known TINYINT NOT NULL DEFAULT 0,
  words_at_publish INT UNSIGNED NOT NULL DEFAULT 0, content_valid TINYINT NOT NULL DEFAULT 0,
  KEY idx_novel_time(novel_id,first_published_at)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
	const columns = await query(
		"SHOW COLUMNS FROM novel_publish_record LIKE 'content_valid'",
	);
	if (!columns.length)
		await query(
			'ALTER TABLE novel_publish_record ADD content_valid TINYINT NOT NULL DEFAULT 0',
		);
	await query(`CREATE TABLE IF NOT EXISTS rank_entry_history (
  board VARCHAR(20) NOT NULL, zone VARCHAR(20) NOT NULL, novel_id INT NOT NULL,
  first_seen_at DATETIME NOT NULL, first_seen_known TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY(board,zone,novel_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
	// Seed the pre-feature baseline once, including drafts and deleted articles:
	// they may previously have been published, so later restore/republication is not a new release.
	await query(`CREATE TABLE IF NOT EXISTS rank_badge_migration (
  migration_key VARCHAR(64) PRIMARY KEY, completed_at DATETIME NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
	await withTransaction(async trx => {
		await trx(
			"INSERT IGNORE INTO rank_badge_migration(migration_key) VALUES('publication-baseline-v1')",
		);
		const rows = await trx(
			"SELECT completed_at FROM rank_badge_migration WHERE migration_key='publication-baseline-v1' FOR UPDATE",
		);
		if (rows[0].completed_at) return;
		await trx(`INSERT IGNORE INTO novel_publish_record(article_id,novel_id,article_type)
   SELECT article_id,novel_id,article_type FROM articles WHERE article_type <> 'spliter'`);
		await trx(`INSERT IGNORE INTO rank_entry_history(board,zone,novel_id,first_seen_at)
   SELECT board,zone,novel_id,MIN(snapshot_date) FROM rank_snapshot GROUP BY board,zone,novel_id`);
		await trx(
			"UPDATE rank_badge_migration SET completed_at=CURRENT_TIMESTAMP WHERE migration_key='publication-baseline-v1'",
		);
	}, 'rank-badge-baseline');
}
module.exports = { ensureRankBadgeSchema };
