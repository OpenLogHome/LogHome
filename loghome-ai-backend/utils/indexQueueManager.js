/**
 * Index queue manager for the chapter comprehension worker.
 * Manages the agent_index_queue table and provides job claiming/heartbeat/etc.
 */

const { query } = require('../sql');
const config = require('../config');

const memoryDatabase = config.memoryDatabase || 'loghome-agent-memory';
const memDb = () => `\`${memoryDatabase}\``;
const READER_MEMORY_TABLE = 'agent_memory';
const AUTHOR_MEMORY_TABLE = 'agent_writer_memory';
const AUTO_QUEUE_PRIORITY = 10;
const MANUAL_QUEUE_PRIORITY = 100;

const LATEST_WRITER_VERSION_SUBQUERY = `
  SELECT
    aw1.id,
    aw1.article_id,
    aw1.title,
    aw1.content_hash,
    aw1.create_time,
    aw1.novel_id
  FROM articles_writer aw1
  WHERE aw1.id = (
    SELECT aw2.id
    FROM articles_writer aw2
    WHERE aw2.article_id = aw1.article_id
    ORDER BY COALESCE(aw2.updated_at, STR_TO_DATE(aw2.create_time, '%Y%m%d%H%i%s')) DESC, aw2.id DESC
    LIMIT 1
  )
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

async function initIndexQueueTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${memDb()}.agent_index_queue (
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
    );
  `;
  await query(createTableSQL);
}

function normalizeQueueRow(row) {
  if (!row) {
    return null;
  }

  return {
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
  };
}

async function hasQueuedManualJob(excludeNovelId = null) {
  let sql = `
    SELECT 1
    FROM ${memDb()}.agent_index_queue
    WHERE status = 'queued'
      AND trigger_source = 'manual'
      AND available_at <= CURRENT_TIMESTAMP
  `;
  const values = [];

  if (excludeNovelId) {
    sql += ' AND novel_id != ?';
    values.push(excludeNovelId);
  }

  sql += ' LIMIT 1';

  const results = await query(sql, values);
  return results.length > 0;
}

async function getPendingChapterCount(novelId) {
  const results = await query(
    `
    SELECT COUNT(*) AS pending_chapters
    FROM (
      SELECT a.article_id
      FROM articles a
      LEFT JOIN ${memDb()}.${READER_MEMORY_TABLE} m ON ${buildReaderMemoryValidityCondition('m', 'a')}
      WHERE a.novel_id = ?
        AND a.article_type = 'richtext'
        AND a.is_draft = 0
        AND a.deleted = 0
        AND m.memory_id IS NULL

      UNION ALL

      SELECT w.article_id
      FROM (${LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY}) w
      LEFT JOIN ${memDb()}.${AUTHOR_MEMORY_TABLE} wm ON ${buildAuthorMemoryValidityCondition('wm', 'w')}
      WHERE w.novel_id = ?
        AND wm.memory_id IS NULL
    ) pending
  `,
    [novelId, novelId]
  );
  return Number(results[0]?.pending_chapters || 0);
}

async function getAutoQueueCandidates(limit = 100) {
  const results = await query(
    `
    SELECT
      candidate.novel_id,
      n.name,
      COUNT(*) AS pending_chapters,
      MAX(candidate.activity_time) AS latest_activity_time
    FROM (
      SELECT
        a.novel_id,
        a.article_id,
        a.update_time AS activity_time
      FROM articles a
      LEFT JOIN ${memDb()}.${READER_MEMORY_TABLE} m ON ${buildReaderMemoryValidityCondition('m', 'a')}
      WHERE a.article_type = 'richtext'
        AND a.is_draft = 0
        AND a.deleted = 0
        AND a.update_time > DATE_SUB(NOW(), INTERVAL 1 MONTH)
        AND m.memory_id IS NULL

      UNION ALL

      SELECT
        w.novel_id,
        w.article_id,
        w.create_time AS activity_time
      FROM (${LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY}) w
      LEFT JOIN ${memDb()}.${AUTHOR_MEMORY_TABLE} wm ON ${buildAuthorMemoryValidityCondition('wm', 'w')}
      WHERE w.create_time > DATE_SUB(NOW(), INTERVAL 1 MONTH)
        AND wm.memory_id IS NULL
    ) candidate
    INNER JOIN novels n ON n.novel_id = candidate.novel_id
    WHERE n.deleted = 0
    GROUP BY candidate.novel_id, n.name
    ORDER BY latest_activity_time DESC
    LIMIT ?
  `,
    [limit]
  );
  return (results || []).map((row) => ({
    novel_id: Number(row.novel_id),
    name: row.name,
    pending_chapters: Number(row.pending_chapters || 0),
  }));
}

async function upsertAutoQueueCandidate(candidate) {
  const totalChapters = Number(candidate.pending_chapters || 0);

  await query(
    `
      INSERT INTO ${memDb()}.agent_index_queue (
        novel_id,
        status,
        trigger_source,
        priority,
        requested_at,
        total_chapters,
        pending_chapters,
        completed_chapters,
        available_at,
        last_error
      ) VALUES (?, 'queued', 'auto', ?, CURRENT_TIMESTAMP, ?, ?, 0, CURRENT_TIMESTAMP, NULL)
      ON DUPLICATE KEY UPDATE
        trigger_source = IF(trigger_source = 'manual', trigger_source, 'auto'),
        priority = GREATEST(priority, VALUES(priority)),
        status = IF(status = 'indexing', status, 'queued'),
        total_chapters = IF(status = 'indexing', total_chapters, VALUES(total_chapters)),
        pending_chapters = IF(status = 'indexing', pending_chapters, VALUES(pending_chapters)),
        completed_chapters = IF(status = 'indexing', completed_chapters, 0),
        available_at = IF(status = 'indexing', available_at, CURRENT_TIMESTAMP),
        last_error = IF(status = 'indexing', last_error, NULL)
    `,
    [candidate.novel_id, AUTO_QUEUE_PRIORITY, totalChapters, totalChapters]
  );
}

async function pruneAutoQueue(candidateNovelIds) {
  if (!candidateNovelIds || candidateNovelIds.length === 0) {
    await query(
      `DELETE FROM ${memDb()}.agent_index_queue WHERE trigger_source = 'auto' AND status != 'indexing'`
    );
    return;
  }

  await query(
    `DELETE FROM ${memDb()}.agent_index_queue
     WHERE trigger_source = 'auto'
       AND status != 'indexing'
       AND novel_id NOT IN (?)`,
    [candidateNovelIds]
  );
}

async function syncAutoQueue(limit = 100) {
  const candidates = await getAutoQueueCandidates(limit);

  for (const candidate of candidates) {
    await upsertAutoQueueCandidate(candidate);
  }

  await pruneAutoQueue(candidates.map((candidate) => candidate.novel_id));
  return candidates;
}

async function requeueStaleJobs(staleMinutes = 5) {
  await query(
    `
      UPDATE ${memDb()}.agent_index_queue
      SET status = 'queued',
          current_article_id = NULL,
          current_article_title = NULL,
          available_at = CURRENT_TIMESTAMP,
          last_error = COALESCE(last_error, 'stale job recovered')
      WHERE status = 'indexing'
        AND (
          last_heartbeat_at IS NULL
          OR last_heartbeat_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? MINUTE)
        )
    `,
    [staleMinutes]
  );
}

async function resetQueueOnStartup() {
  await query(
    `
      UPDATE ${memDb()}.agent_index_queue
      SET status = 'queued',
          current_article_id = NULL,
          current_article_title = NULL,
          completed_chapters = 0,
          last_finished_at = IF(status = 'indexing', CURRENT_TIMESTAMP, last_finished_at),
          last_heartbeat_at = NULL,
          available_at = CURRENT_TIMESTAMP,
          last_error = IF(
            status = 'indexing' AND (last_error IS NULL OR last_error = ''),
            'agent restarted',
            last_error
          )
    `
  );
}

async function getQueueJobByNovelId(novelId) {
  const results = await query(
    `SELECT * FROM ${memDb()}.agent_index_queue WHERE novel_id = ? LIMIT 1`,
    [novelId]
  );
  return normalizeQueueRow(results[0] || null);
}

async function claimNextQueueJob() {
  const results = await query(
    `
      SELECT *
      FROM ${memDb()}.agent_index_queue
      WHERE status = 'queued'
        AND available_at <= CURRENT_TIMESTAMP
      ORDER BY priority DESC, requested_at ASC, updated_at ASC
      LIMIT 1
    `
  );

  if (results.length === 0) {
    return null;
  }

  const queuedJob = normalizeQueueRow(results[0]);
  const pendingChapters = await getPendingChapterCount(queuedJob.novel_id);

  if (pendingChapters <= 0) {
    await query(
      `DELETE FROM ${memDb()}.agent_index_queue WHERE novel_id = ?`,
      [queuedJob.novel_id]
    );
    return null;
  }

  const updateResult = await query(
    `
      UPDATE ${memDb()}.agent_index_queue
      SET status = 'indexing',
          total_chapters = ?,
          pending_chapters = ?,
          completed_chapters = 0,
          current_article_id = NULL,
          current_article_title = NULL,
          last_started_at = CURRENT_TIMESTAMP,
          last_heartbeat_at = CURRENT_TIMESTAMP,
          last_error = NULL
      WHERE novel_id = ?
        AND status = 'queued'
    `,
    [pendingChapters, pendingChapters, queuedJob.novel_id]
  );

  if (!updateResult || updateResult.affectedRows === 0) {
    return null;
  }

  return getQueueJobByNovelId(queuedJob.novel_id);
}

async function heartbeatQueueJob(novelId, fields = {}) {
  const updates = ['last_heartbeat_at = CURRENT_TIMESTAMP'];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(fields, 'status')) {
    updates.push('status = ?');
    values.push(fields.status);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'currentArticleId')) {
    updates.push('current_article_id = ?');
    values.push(fields.currentArticleId);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'currentArticleTitle')) {
    updates.push('current_article_title = ?');
    values.push(fields.currentArticleTitle);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'totalChapters')) {
    updates.push('total_chapters = ?');
    values.push(fields.totalChapters);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'pendingChapters')) {
    updates.push('pending_chapters = ?');
    values.push(fields.pendingChapters);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'completedChapters')) {
    updates.push('completed_chapters = ?');
    values.push(fields.completedChapters);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'availableAtDelayMinutes')) {
    updates.push('available_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE)');
    values.push(fields.availableAtDelayMinutes);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'lastFinished')) {
    updates.push(
      `last_finished_at = ${fields.lastFinished ? 'CURRENT_TIMESTAMP' : 'last_finished_at'}`
    );
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'lastError')) {
    updates.push('last_error = ?');
    values.push(fields.lastError);
  }

  values.push(novelId);

  await query(
    `UPDATE ${memDb()}.agent_index_queue SET ${updates.join(', ')} WHERE novel_id = ?`,
    values
  );
}

async function requeueQueueJob(novelId, lastError = null, retryDelayMinutes = 5) {
  const pendingChapters = await getPendingChapterCount(novelId);

  if (pendingChapters <= 0) {
    await removeQueueJob(novelId);
    return null;
  }

  await query(
    `
      UPDATE ${memDb()}.agent_index_queue
      SET status = 'queued',
          current_article_id = NULL,
          current_article_title = NULL,
          total_chapters = ?,
          pending_chapters = ?,
          completed_chapters = 0,
          available_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE),
          last_finished_at = CURRENT_TIMESTAMP,
          last_heartbeat_at = CURRENT_TIMESTAMP,
          last_error = ?
      WHERE novel_id = ?
    `,
    [pendingChapters, pendingChapters, retryDelayMinutes, lastError, novelId]
  );

  return getQueueJobByNovelId(novelId);
}

async function removeQueueJob(novelId) {
  await query(`DELETE FROM ${memDb()}.agent_index_queue WHERE novel_id = ?`, [novelId]);
}

module.exports = {
  claimNextQueueJob,
  getPendingChapterCount,
  getQueueJobByNovelId,
  hasQueuedManualJob,
  heartbeatQueueJob,
  initIndexQueueTable,
  MANUAL_QUEUE_PRIORITY,
  removeQueueJob,
  requeueQueueJob,
  resetQueueOnStartup,
  requeueStaleJobs,
  syncAutoQueue,
};