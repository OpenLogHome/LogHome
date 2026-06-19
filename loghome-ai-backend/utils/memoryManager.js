/**
 * Memory management module for chapter summaries.
 */

const { query } = require('../sql');
const config = require('../config');

const memoryDatabase = config.memoryDatabase || 'loghome-agent-memory';
const memDb = () => `\`${memoryDatabase}\``;
const READER_MEMORY_TABLE = 'agent_memory';
const AUTHOR_MEMORY_TABLE = 'agent_writer_memory';
const WRITER_LEGACY_TIME_SQL_FORMAT = '%Y%m%d%H%i%s';

function buildWriterUpdatedAtExpression(alias = 'aw') {
  return `COALESCE(${alias}.updated_at, STR_TO_DATE(${alias}.create_time, '${WRITER_LEGACY_TIME_SQL_FORMAT}'))`;
}

const LATEST_WRITER_VERSION_SUBQUERY = `
  SELECT
    aw1.id,
    aw1.article_id,
    aw1.title,
    aw1.content,
    aw1.content_hash,
    aw1.create_time,
    aw1.updated_at,
    aw1.novel_id
  FROM articles_writer aw1
  WHERE aw1.id = (
    SELECT aw2.id
    FROM articles_writer aw2
    WHERE aw2.article_id = aw1.article_id
    ORDER BY ${buildWriterUpdatedAtExpression('aw2')} DESC, aw2.id DESC
    LIMIT 1
  )
`;

const LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY = `
  SELECT
    latest_writer.article_id,
    latest_writer.id AS writer_id,
    latest_writer.novel_id,
    latest_writer.title,
    latest_writer.content,
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
}

function normalizeMemoryScope(scope, fallback = 'reader') {
  if (!scope) {
    return fallback;
  }

  const normalized = String(scope).trim().toLowerCase();
  if (normalized === 'author' || normalized === 'writer') {
    return 'author';
  }
  return 'reader';
}

function resolveSourceUpdatedAt(source) {
  return source?.source_updated_at || source?.update_time || source?.create_time || null;
}

function normalizeChapterSource(source, scope = 'reader') {
  if (!source) {
    return null;
  }

  return {
    scope: normalizeMemoryScope(scope),
    article_id: Number(source.article_id),
    novel_id: Number(source.novel_id),
    article_chapter: Number(source.article_chapter || 0),
    title: source.title || '',
    content: source.content || '',
    content_hash: source.content_hash || '',
    source_updated_at: resolveSourceUpdatedAt(source),
    writer_id: source.writer_id ? Number(source.writer_id) : null,
  };
}

async function getReaderChapterSource(articleId) {
  const rows = await query(
    `
      SELECT
        a.article_id,
        a.novel_id,
        a.article_chapter,
        a.title,
        a.content,
        a.content_hash,
        a.update_time AS source_updated_at
      FROM articles a
      WHERE a.article_id = ?
        AND a.deleted = 0
        AND a.is_draft = 0
        AND a.article_type = 'richtext'
      LIMIT 1
    `,
    [articleId]
  );

  return normalizeChapterSource(rows[0] || null, 'reader');
}

async function getAuthorChapterSource(articleId, writerId = null) {
  const params = [articleId];
  let whereClause = 'w.article_id = ?';
  if (writerId) {
    whereClause += ' AND w.writer_id = ?';
    params.push(writerId);
  }

  const rows = await query(
    `
      SELECT
        w.article_id,
        w.writer_id,
        w.novel_id,
        a.article_chapter,
        w.title,
        w.content,
        w.content_hash,
        w.create_time AS source_updated_at
      FROM (${LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY}) w
      INNER JOIN articles a ON a.article_id = w.article_id
      WHERE ${whereClause}
      LIMIT 1
    `,
    params
  );

  return normalizeChapterSource(rows[0] || null, 'author');
}

async function getChapterSource(input, options = {}) {
  const articleId = Number(
    typeof input === 'number'
      ? input
      : input?.article_id || options.article_id || 0
  );
  const scope = normalizeMemoryScope(
    options.scope || input?.memory_scope || input?.scope,
    'reader'
  );
  const writerId = Number(
    typeof input === 'object' && input
      ? input.writer_id || 0
      : options.writer_id || 0
  );

  if (!articleId) {
    return null;
  }

  if (scope === 'author') {
    return getAuthorChapterSource(articleId, writerId || null);
  }

  return getReaderChapterSource(articleId);
}

async function saveMemory(source, summary, options = {}) {
  const scope = normalizeMemoryScope(options.scope || source?.scope, 'reader');
  const normalizedSource = normalizeChapterSource(source, scope);

  if (!normalizedSource || !normalizedSource.article_id || !normalizedSource.novel_id) {
    throw new Error('saveMemory requires a valid source descriptor');
  }

  const charactersStr = typeof summary.characters === 'string'
    ? summary.characters
    : JSON.stringify(summary.characters || []);

  if (scope === 'author') {
    await query(
      `
        INSERT INTO ${memDb()}.${AUTHOR_MEMORY_TABLE} (
          novel_id,
          article_id,
          writer_id,
          source_title,
          source_content_hash,
          source_updated_at,
          long_summary,
          short_summary,
          characters
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          novel_id = VALUES(novel_id),
          writer_id = VALUES(writer_id),
          source_title = VALUES(source_title),
          source_content_hash = VALUES(source_content_hash),
          source_updated_at = VALUES(source_updated_at),
          long_summary = VALUES(long_summary),
          short_summary = VALUES(short_summary),
          characters = VALUES(characters)
      `,
      [
        normalizedSource.novel_id,
        normalizedSource.article_id,
        normalizedSource.writer_id,
        normalizedSource.title,
        normalizedSource.content_hash,
        normalizedSource.source_updated_at,
        summary.long_summary,
        summary.short_summary,
        charactersStr,
      ]
    );
    return;
  }

  await query(
    `
      INSERT INTO ${memDb()}.${READER_MEMORY_TABLE} (
        novel_id,
        article_id,
        source_title,
        source_content_hash,
        source_updated_at,
        long_summary,
        short_summary,
        characters
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        novel_id = VALUES(novel_id),
        source_title = VALUES(source_title),
        source_content_hash = VALUES(source_content_hash),
        source_updated_at = VALUES(source_updated_at),
        long_summary = VALUES(long_summary),
        short_summary = VALUES(short_summary),
        characters = VALUES(characters)
    `,
    [
      normalizedSource.novel_id,
      normalizedSource.article_id,
      normalizedSource.title,
      normalizedSource.content_hash,
      normalizedSource.source_updated_at,
      summary.long_summary,
      summary.short_summary,
      charactersStr,
    ]
  );
}

function safeJsonParse(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function resolveScopedChapterRow(baseRow, options = {}) {
  const scope = normalizeMemoryScope(options.scope, 'reader');
  const fallbackToReaderWhenDraftMissing = scope === 'author'
    && options.fallbackToReaderWhenDraftMissing === true;
  const articleId = Number(baseRow.article_id);
  const chapter = Number(baseRow.article_chapter || 0);
  const hasReaderMemory = !!baseRow.reader_memory_id;
  const hasWriterSource = !!baseRow.writer_id;
  const hasWriterMemory = !!baseRow.writer_memory_id;

  if (scope === 'author' && hasWriterSource) {
    const useReaderFallback = !hasWriterMemory && fallbackToReaderWhenDraftMissing && hasReaderMemory;
    const characters = hasWriterMemory
      ? safeJsonParse(baseRow.writer_characters, [])
      : useReaderFallback
        ? safeJsonParse(baseRow.reader_characters, [])
        : [];

    return {
      article_id: articleId,
      article_chapter: chapter,
      chapter,
      title: baseRow.writer_title || baseRow.reader_title || '',
      update_time: baseRow.writer_update_time || baseRow.reader_update_time || null,
      long_summary: hasWriterMemory
        ? baseRow.writer_long_summary || ''
        : useReaderFallback
          ? baseRow.reader_long_summary || ''
          : '',
      short_summary: hasWriterMemory
        ? baseRow.writer_short_summary || ''
        : useReaderFallback
          ? baseRow.reader_short_summary || ''
          : '',
      characters,
      memory_updated_at: hasWriterMemory
        ? baseRow.writer_memory_updated_at || null
        : useReaderFallback
          ? baseRow.reader_memory_updated_at || null
          : null,
      has_memory: hasWriterMemory || useReaderFallback,
      memory_scope: 'author',
      summary_scope: hasWriterMemory ? 'author' : useReaderFallback ? 'reader' : 'author',
      writer_id: Number(baseRow.writer_id),
      has_current_draft: true,
      is_reader_fallback: useReaderFallback,
    };
  }

  return {
    article_id: articleId,
    article_chapter: chapter,
    chapter,
    title: baseRow.reader_title || '',
    update_time: baseRow.reader_update_time || null,
    long_summary: hasReaderMemory ? baseRow.reader_long_summary || '' : '',
    short_summary: hasReaderMemory ? baseRow.reader_short_summary || '' : '',
    characters: hasReaderMemory ? safeJsonParse(baseRow.reader_characters, []) : [],
    memory_updated_at: hasReaderMemory ? baseRow.reader_memory_updated_at || null : null,
    has_memory: hasReaderMemory,
    memory_scope: 'reader',
    summary_scope: 'reader',
    writer_id: null,
    has_current_draft: false,
    is_reader_fallback: false,
  };
}

async function getNovelBaseRows(novelId) {
  const rows = await query(
    `
      SELECT
        a.article_id,
        a.article_chapter,
        a.title AS reader_title,
        a.update_time AS reader_update_time,
        rm.memory_id AS reader_memory_id,
        rm.long_summary AS reader_long_summary,
        rm.short_summary AS reader_short_summary,
        rm.characters AS reader_characters,
        rm.updated_at AS reader_memory_updated_at,
        w.writer_id,
        w.title AS writer_title,
        w.create_time AS writer_update_time,
        wm.memory_id AS writer_memory_id,
        wm.long_summary AS writer_long_summary,
        wm.short_summary AS writer_short_summary,
        wm.characters AS writer_characters,
        wm.updated_at AS writer_memory_updated_at
      FROM articles a
      LEFT JOIN (
        SELECT DISTINCT article_id, id AS writer_id, title, content_hash, create_time
        FROM articles_writer
        WHERE (article_id, COALESCE(updated_at, STR_TO_DATE(create_time, '%Y%m%d%H%i%s'))  ) IN (
          SELECT article_id, MAX(COALESCE(updated_at, STR_TO_DATE(create_time, '%Y%m%d%H%i%s'))) AS max_time
          FROM articles_writer
          GROUP BY article_id
        )
        AND article_id IN (
          SELECT article_id FROM articles WHERE deleted = 0 AND is_draft = 0 AND article_type = 'richtext'
        )
      ) w ON w.article_id = a.article_id
      LEFT JOIN ${memDb()}.${READER_MEMORY_TABLE} rm ON ${buildReaderMemoryValidityCondition('rm', 'a')}
      LEFT JOIN ${memDb()}.${AUTHOR_MEMORY_TABLE} wm ON ${buildAuthorMemoryValidityCondition('wm', 'w')}
      WHERE a.novel_id = ?
        AND a.deleted = 0
        AND a.is_draft = 0
        AND a.article_type = 'richtext'
      ORDER BY a.article_chapter ASC
    `,
    [novelId]
  );

  return rows;
}

async function getNovelMemories(novelId, options = {}) {
  const rows = await getNovelBaseRows(novelId);
  return rows
    .map((row) => resolveScopedChapterRow(row, options))
    .filter((row) => row.has_memory);
}

async function getNovelPreferredShortSummaries(novelId) {
  const rows = await query(
    `
      SELECT
        a.article_id,
        a.article_chapter,
        a.title AS reader_title,
        rm.memory_id AS reader_memory_id,
        rm.short_summary AS reader_short_summary,
        rm.updated_at AS reader_memory_updated_at,
        w.id AS writer_id,
        w.title AS writer_title,
        wm.memory_id AS writer_memory_id,
        wm.short_summary AS writer_short_summary,
        wm.updated_at AS writer_memory_updated_at
      FROM articles a
      LEFT JOIN articles_writer w ON w.id = (
        SELECT aw2.id
        FROM articles_writer aw2
        WHERE aw2.article_id = a.article_id
        ORDER BY aw2.updated_at DESC, aw2.create_time DESC, aw2.id DESC
        LIMIT 1
      )
        AND (
          NOT (w.content_hash <=> a.content_hash)
          OR NOT (w.title <=> a.title)
        )
      LEFT JOIN ${memDb()}.${AUTHOR_MEMORY_TABLE} wm
        ON wm.article_id = w.article_id
        AND wm.writer_id = w.id
        AND wm.source_content_hash <=> w.content_hash
        AND wm.source_title <=> w.title
        AND wm.source_updated_at <=> w.create_time
      LEFT JOIN ${memDb()}.${READER_MEMORY_TABLE} rm
        ON ${buildReaderMemoryValidityCondition('rm', 'a')}
      WHERE a.novel_id = ?
        AND a.deleted = 0
        AND a.is_draft = 0
        AND a.article_type = 'richtext'
      ORDER BY a.article_chapter ASC
    `,
    [novelId]
  );

  return rows
    .map((row) => {
      const writerSummary = row.writer_memory_id ? row.writer_short_summary || '' : '';
      const readerSummary = row.reader_memory_id ? row.reader_short_summary || '' : '';
      const summaryScope = writerSummary ? 'author' : readerSummary ? 'reader' : '';
      const shortSummary = writerSummary || readerSummary;
      if (!shortSummary) {
        return null;
      }

      return {
        article_id: Number(row.article_id),
        article_chapter: Number(row.article_chapter || 0),
        chapter: Number(row.article_chapter || 0),
        title: summaryScope === 'author'
          ? row.writer_title || row.reader_title || ''
          : row.reader_title || row.writer_title || '',
        short_summary: shortSummary,
        summary_scope: summaryScope,
        memory_updated_at: summaryScope === 'author'
          ? row.writer_memory_updated_at || null
          : row.reader_memory_updated_at || null,
        writer_id: row.writer_id ? Number(row.writer_id) : null,
      };
    })
    .filter(Boolean);
}

async function initMemoryTable() {
  await ensureAgentMemorySchema();
}

async function getPendingChapters(novelId) {
  const rows = await query(
    `
      SELECT
        pending.article_id,
        pending.title,
        pending.article_chapter,
        pending.source_update_time,
        pending.memory_scope,
        pending.writer_id
      FROM (
        SELECT
          a.article_id,
          a.title,
          a.article_chapter,
          a.update_time AS source_update_time,
          'reader' AS memory_scope,
          NULL AS writer_id,
          0 AS scope_order
        FROM articles a
        LEFT JOIN ${memDb()}.${READER_MEMORY_TABLE} rm ON ${buildReaderMemoryValidityCondition('rm', 'a')}
        WHERE a.novel_id = ?
          AND a.article_type = 'richtext'
          AND a.is_draft = 0
          AND a.deleted = 0
          AND rm.memory_id IS NULL

        UNION ALL

        SELECT
          a.article_id,
          w.title,
          a.article_chapter,
          w.create_time AS source_update_time,
          'author' AS memory_scope,
          w.writer_id,
          1 AS scope_order
        FROM (${LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY}) w
        INNER JOIN articles a ON a.article_id = w.article_id
        LEFT JOIN ${memDb()}.${AUTHOR_MEMORY_TABLE} wm ON ${buildAuthorMemoryValidityCondition('wm', 'w')}
        WHERE w.novel_id = ?
          AND wm.memory_id IS NULL
      ) pending
      ORDER BY pending.article_chapter ASC, pending.scope_order ASC
    `,
    [novelId, novelId]
  );

  return (rows || []).map((row) => ({
    article_id: Number(row.article_id),
    title: row.title || '',
    article_chapter: Number(row.article_chapter),
    source_update_time: row.source_update_time || null,
    memory_scope: normalizeMemoryScope(row.memory_scope, 'reader'),
    writer_id: row.writer_id ? Number(row.writer_id) : null,
  }));
}

module.exports = {
  initMemoryTable,
  getChapterSource,
  getNovelMemories,
  getNovelPreferredShortSummaries,
  getPendingChapters,
  normalizeMemoryScope,
  saveMemory,
};
