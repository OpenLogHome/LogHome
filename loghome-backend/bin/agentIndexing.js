const { query } = require('../sql.js');
const config = require('../config');

const memoryDatabase = config.memoryDatabase || 'loghome-agent-memory';
const READER_MEMORY_TABLE = 'agent_memory';
const AUTHOR_MEMORY_TABLE = 'agent_writer_memory';
const MANUAL_QUEUE_PRIORITY = 100;
let ensureAgentMemorySchemaPromise = null;

const LATEST_WRITER_VERSION_SUBQUERY = `
	SELECT
		aw1.id,
		aw1.article_id,
		aw1.title,
		aw1.content_hash,
		aw1.create_time,
		aw1.novel_id
	FROM articles_writer aw1
	INNER JOIN (
		SELECT MAX(aw2.id) AS max_id
		FROM articles_writer aw2
		INNER JOIN (
			SELECT article_id, MAX(create_time) AS max_create_time
			FROM articles_writer
			GROUP BY article_id
		) latest ON aw2.article_id = latest.article_id AND aw2.create_time = latest.max_create_time
		GROUP BY aw2.article_id
	) latest_unique ON aw1.id = latest_unique.max_id
`;

const LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY = `
	SELECT
		latest_writer.article_id,
		latest_writer.id AS writer_id,
		latest_writer.novel_id,
		latest_writer.title,
		latest_writer.content_hash,
		latest_writer.create_time
	FROM (${LATEST_WRITER_VERSION_SUBQUERY}) latest_writer
	INNER JOIN articles published_article ON published_article.article_id = latest_writer.article_id
	WHERE published_article.deleted = 0
		AND published_article.is_draft = 0
		AND published_article.article_type = 'richtext'
		AND (
			NOT (latest_writer.content_hash <=> published_article.content_hash)
			OR NOT (latest_writer.title <=> published_article.title)
		)
`;

function buildReaderMemoryValidityCondition(memoryAlias = 'm', articleAlias = 'a') {
	return [
		`${memoryAlias}.article_id = ${articleAlias}.article_id`,
		`${memoryAlias}.source_content_hash <=> ${articleAlias}.content_hash`,
		`${memoryAlias}.source_title <=> ${articleAlias}.title`,
		`${memoryAlias}.source_updated_at <=> ${articleAlias}.update_time`,
	].join(' AND ');
}

function buildAuthorMemoryValidityCondition(memoryAlias = 'm', writerAlias = 'w') {
	return [
		`${memoryAlias}.article_id = ${writerAlias}.article_id`,
		`${memoryAlias}.writer_id = ${writerAlias}.writer_id`,
		`${memoryAlias}.source_content_hash <=> ${writerAlias}.content_hash`,
		`${memoryAlias}.source_title <=> ${writerAlias}.title`,
		`${memoryAlias}.source_updated_at <=> ${writerAlias}.create_time`,
	].join(' AND ');
}

async function hasColumn(tableName, columnName) {
	const results = await query(
		`SELECT 1
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = ?
			AND TABLE_NAME = ?
			AND COLUMN_NAME = ?
		LIMIT 1`,
		[memoryDatabase, tableName, columnName],
	);
	return results.length > 0;
}

async function ensureColumn(tableName, columnName, definition) {
	if (await hasColumn(tableName, columnName)) {
		return;
	}

	await query(
		`ALTER TABLE \`${memoryDatabase}\`.\`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`,
	);
}

async function ensureAgentMemorySchema() {
	if (!ensureAgentMemorySchemaPromise) {
		ensureAgentMemorySchemaPromise = (async () => {
			await query(
				`CREATE TABLE IF NOT EXISTS \`${memoryDatabase}\`.\`${READER_MEMORY_TABLE}\` (
					memory_id INT AUTO_INCREMENT PRIMARY KEY,
					novel_id INT NOT NULL,
					article_id INT NOT NULL UNIQUE,
					source_title VARCHAR(255) NULL,
					source_content_hash VARCHAR(64) NULL,
					source_updated_at TIMESTAMP NULL DEFAULT NULL,
					long_summary TEXT,
					short_summary VARCHAR(255),
					characters JSON,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					INDEX idx_novel_id (novel_id),
					INDEX idx_article_id (article_id)
				)`,
			);
			await ensureColumn(READER_MEMORY_TABLE, 'source_title', 'VARCHAR(255) NULL AFTER article_id');
			await ensureColumn(READER_MEMORY_TABLE, 'source_content_hash', 'VARCHAR(64) NULL AFTER source_title');
			await ensureColumn(READER_MEMORY_TABLE, 'source_updated_at', 'TIMESTAMP NULL DEFAULT NULL AFTER source_content_hash');
			await query(
				`UPDATE \`${memoryDatabase}\`.\`${READER_MEMORY_TABLE}\` m
				INNER JOIN articles a ON a.article_id = m.article_id
				SET
					m.source_title = a.title,
					m.source_content_hash = a.content_hash,
					m.source_updated_at = a.update_time
				WHERE (m.source_title IS NULL OR m.source_content_hash IS NULL OR m.source_updated_at IS NULL)
					AND a.deleted = 0
					AND m.updated_at >= a.update_time`,
			);
			await query(
				`CREATE TABLE IF NOT EXISTS \`${memoryDatabase}\`.\`${AUTHOR_MEMORY_TABLE}\` (
					memory_id INT AUTO_INCREMENT PRIMARY KEY,
					novel_id INT NOT NULL,
					article_id INT NOT NULL UNIQUE,
					writer_id BIGINT NULL,
					source_title VARCHAR(255) NULL,
					source_content_hash VARCHAR(64) NULL,
					source_updated_at TIMESTAMP NULL DEFAULT NULL,
					long_summary TEXT,
					short_summary VARCHAR(255),
					characters JSON,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					INDEX idx_novel_id (novel_id),
					INDEX idx_article_id (article_id),
					INDEX idx_writer_id (writer_id)
				)`,
			);
			await query(
				`CREATE TABLE IF NOT EXISTS \`${memoryDatabase}\`.agent_index_queue (
					queue_id BIGINT AUTO_INCREMENT PRIMARY KEY,
					novel_id INT NOT NULL UNIQUE,
					status ENUM('queued', 'indexing') NOT NULL DEFAULT 'queued',
					trigger_source ENUM('auto', 'manual') NOT NULL DEFAULT 'auto',
					priority INT NOT NULL DEFAULT 0,
					requested_by_user_id INT NULL,
					requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
					current_article_id INT NULL,
					current_article_title VARCHAR(255) NULL,
					total_chapters INT NOT NULL DEFAULT 0,
					pending_chapters INT NOT NULL DEFAULT 0,
					completed_chapters INT NOT NULL DEFAULT 0,
					last_started_at TIMESTAMP NULL DEFAULT NULL,
					last_finished_at TIMESTAMP NULL DEFAULT NULL,
					last_heartbeat_at TIMESTAMP NULL DEFAULT NULL,
					available_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
					last_error TEXT NULL,
					created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					INDEX idx_status_available (status, available_at, priority, requested_at),
					INDEX idx_trigger_source (trigger_source),
					INDEX idx_last_heartbeat (last_heartbeat_at)
				)`,
			);
		})().catch((error) => {
			ensureAgentMemorySchemaPromise = null;
			throw error;
		});
	}

	return ensureAgentMemorySchemaPromise;
}

function getMemoryDatabase() {
	return memoryDatabase;
}

function normalizeIndexQueueRow(row) {
	if (!row) {
		return {
			status: 'none',
			queue: null,
		};
	}

	return {
		status: row.status,
		queue: {
			queue_id: Number(row.queue_id),
			novel_id: Number(row.novel_id),
			status: row.status,
			trigger_source: row.trigger_source,
			priority: Number(row.priority || 0),
			requested_by_user_id: row.requested_by_user_id
				? Number(row.requested_by_user_id)
				: null,
			requested_at: row.requested_at || null,
			current_article_id: row.current_article_id
				? Number(row.current_article_id)
				: null,
			current_article_title: row.current_article_title || null,
			total_chapters: Number(row.total_chapters || 0),
			pending_chapters: Number(row.pending_chapters || 0),
			completed_chapters: Number(row.completed_chapters || 0),
			last_started_at: row.last_started_at || null,
			last_finished_at: row.last_finished_at || null,
			last_heartbeat_at: row.last_heartbeat_at || null,
			available_at: row.available_at || null,
			last_error: row.last_error || null,
			created_at: row.created_at || null,
			updated_at: row.updated_at || null,
			ahead_count: Number(row.ahead_count || 0),
		},
	};
}

async function getQueueAheadCount(row) {
	if (!row || row.status !== 'queued') {
		return 0;
	}

	const results = await query(
		`SELECT
			(
				SELECT COUNT(*)
				FROM \`${memoryDatabase}\`.agent_index_queue q_indexing
				WHERE q_indexing.status = 'indexing'
					AND q_indexing.novel_id != ?
			) +
			(
				SELECT COUNT(*)
				FROM \`${memoryDatabase}\`.agent_index_queue q_queued
				WHERE q_queued.status = 'queued'
					AND q_queued.available_at <= CURRENT_TIMESTAMP
					AND q_queued.novel_id != ?
					AND (
						q_queued.priority > ?
						OR (
							q_queued.priority = ?
							AND (
								q_queued.requested_at < ?
								OR (
									q_queued.requested_at = ?
									AND q_queued.queue_id < ?
								)
							)
						)
					)
			) AS ahead_count`,
		[
			row.novel_id,
			row.novel_id,
			row.priority,
			row.priority,
			row.requested_at,
			row.requested_at,
			row.queue_id,
		],
	);

	return Number(results[0]?.ahead_count || 0);
}

async function getPendingChapterCount(novelId) {
	await ensureAgentMemorySchema();
	const results = await query(
		`SELECT COUNT(*) AS pending_chapters
		FROM (
			SELECT a.article_id
			FROM articles a
			LEFT JOIN \`${memoryDatabase}\`.\`${READER_MEMORY_TABLE}\` m ON ${buildReaderMemoryValidityCondition('m', 'a')}
			WHERE a.novel_id = ?
				AND a.article_type = 'richtext'
				AND a.is_draft = 0
				AND a.deleted = 0
				AND m.memory_id IS NULL

			UNION ALL

			SELECT w.article_id
			FROM (${LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY}) w
			LEFT JOIN \`${memoryDatabase}\`.\`${AUTHOR_MEMORY_TABLE}\` wm ON ${buildAuthorMemoryValidityCondition('wm', 'w')}
			WHERE w.novel_id = ?
				AND wm.memory_id IS NULL
		) pending`,
		[novelId, novelId],
	);

	return Number(results[0]?.pending_chapters || 0);
}

async function getNovelIndexingStatus(novelId) {
	await ensureAgentMemorySchema();
	const results = await query(
		`SELECT *
		FROM \`${memoryDatabase}\`.agent_index_queue
		WHERE novel_id = ?
		LIMIT 1`,
		[novelId],
	);

	const row = results[0] || null;
	if (!row) {
		return normalizeIndexQueueRow(null);
	}

	row.ahead_count = await getQueueAheadCount(row);
	return normalizeIndexQueueRow(row);
}

async function requestNovelIndexing(novelId, requestedByUserId = null) {
	await ensureAgentMemorySchema();
	const pendingChapters = await getPendingChapterCount(novelId);
	const totalChapters = pendingChapters;

	await query(
		`INSERT INTO \`${memoryDatabase}\`.agent_index_queue (
			novel_id,
			status,
			trigger_source,
			priority,
			requested_by_user_id,
			requested_at,
			total_chapters,
			pending_chapters,
			completed_chapters,
			available_at,
			last_error
		) VALUES (?, 'queued', 'manual', ?, ?, CURRENT_TIMESTAMP, ?, ?, 0, CURRENT_TIMESTAMP, NULL)
		ON DUPLICATE KEY UPDATE
			status = IF(status = 'indexing', status, 'queued'),
			trigger_source = 'manual',
			priority = GREATEST(priority, VALUES(priority)),
			requested_by_user_id = VALUES(requested_by_user_id),
			requested_at = CURRENT_TIMESTAMP,
			total_chapters = IF(status = 'indexing', total_chapters, VALUES(total_chapters)),
			pending_chapters = IF(status = 'indexing', pending_chapters, VALUES(pending_chapters)),
			completed_chapters = IF(status = 'indexing', completed_chapters, 0),
			available_at = CURRENT_TIMESTAMP,
			last_error = NULL`,
		[
			novelId,
			MANUAL_QUEUE_PRIORITY,
			requestedByUserId,
			totalChapters,
			pendingChapters,
		],
	);

	return getNovelIndexingStatus(novelId);
}

module.exports = {
	ensureAgentMemorySchema,
	getMemoryDatabase,
	getNovelIndexingStatus,
	requestNovelIndexing,
};
