import { memoryPool, secret } from './db.js';

const articlesDb = secret.DB_CONFIG.database;
const READER_SCOPE = 'reader';
const AUTHOR_SCOPE = 'author';
const READER_MEMORY_TABLE = 'agent_memory';
const AUTHOR_MEMORY_TABLE = 'agent_writer_memory';

const LATEST_WRITER_VERSION_SUBQUERY = `
  SELECT
    aw1.id,
    aw1.article_id,
    aw1.title,
    aw1.content,
    aw1.content_hash,
    aw1.create_time,
    aw1.novel_id,
    aw1.editor_user_id,
    aw1.edit_session_id
  FROM ${articlesDb}.articles_writer aw1
  INNER JOIN (
    SELECT MAX(aw2.id) AS max_id
    FROM ${articlesDb}.articles_writer aw2
    INNER JOIN (
      SELECT article_id, MAX(create_time) AS max_create_time
      FROM ${articlesDb}.articles_writer
      GROUP BY article_id
    ) latest ON aw2.article_id = latest.article_id AND aw2.create_time = latest.max_create_time
    GROUP BY aw2.article_id
  ) latest_unique ON aw1.id = latest_unique.max_id
`;

const LATEST_WRITER_VERSION_METADATA_SUBQUERY = `
  SELECT
    aw1.id,
    aw1.article_id,
    aw1.title,
    aw1.content_hash,
    aw1.create_time,
    aw1.novel_id,
    aw1.editor_user_id,
    aw1.edit_session_id
  FROM ${articlesDb}.articles_writer aw1
  INNER JOIN (
    SELECT MAX(aw2.id) AS max_id
    FROM ${articlesDb}.articles_writer aw2
    INNER JOIN (
      SELECT article_id, MAX(create_time) AS max_create_time
      FROM ${articlesDb}.articles_writer
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
    latest_writer.content,
    latest_writer.content_hash,
    latest_writer.create_time,
    latest_writer.editor_user_id,
    latest_writer.edit_session_id
  FROM (${LATEST_WRITER_VERSION_SUBQUERY}) latest_writer
  INNER JOIN ${articlesDb}.articles published_article ON published_article.article_id = latest_writer.article_id
  WHERE published_article.deleted = 0
    AND published_article.is_draft = 0
    AND published_article.article_type = 'richtext'
    AND (
      NOT (latest_writer.content_hash <=> published_article.content_hash)
      OR NOT (latest_writer.title <=> published_article.title)
    )
`;

const LATEST_DISTINCT_WRITER_METADATA_SUBQUERY = `
  SELECT
    writer_source.article_id,
    writer_source.writer_id,
    writer_source.novel_id,
    writer_source.title,
    writer_source.content_hash,
    writer_source.create_time,
    writer_source.editor_user_id,
    writer_source.edit_session_id
  FROM (
    SELECT
      latest_writer.article_id,
      latest_writer.id AS writer_id,
      latest_writer.novel_id,
      latest_writer.title,
      latest_writer.content_hash,
      latest_writer.create_time,
      latest_writer.editor_user_id,
      latest_writer.edit_session_id
    FROM (${LATEST_WRITER_VERSION_METADATA_SUBQUERY}) latest_writer
    INNER JOIN ${articlesDb}.articles published_article ON published_article.article_id = latest_writer.article_id
    WHERE published_article.deleted = 0
      AND published_article.is_draft = 0
      AND published_article.article_type = 'richtext'
      AND (
        NOT (latest_writer.content_hash <=> published_article.content_hash)
        OR NOT (latest_writer.title <=> published_article.title)
      )
  ) writer_source
`;

function normalizeKeywords(input) {
  const values = Array.isArray(input) ? input : [input];
  return [...new Set(
    values
      .flatMap((value) => String(value || '').split(/\s+/))
      .map((item) => item.trim())
      .filter(Boolean)
  )];
}

function normalizePhrases(input) {
  const values = Array.isArray(input) ? input : [input];
  return [...new Set(
    values
      .map((value) => String(value || '').trim())
      .filter(Boolean)
  )];
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

function stringifyCharacters(value) {
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value || []);
  } catch (error) {
    return '[]';
  }
}

function normalizeMemoryScope(scope, fallback = READER_SCOPE) {
  if (!scope) {
    return fallback;
  }

  const normalized = String(scope).trim().toLowerCase();
  if (normalized === AUTHOR_SCOPE || normalized === 'writer') {
    return AUTHOR_SCOPE;
  }
  return READER_SCOPE;
}

function isAuthorScope(scope) {
  return normalizeMemoryScope(scope) === AUTHOR_SCOPE;
}

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

function countMatches(text, terms) {
  const lower = String(text || '').toLowerCase();
  let count = 0;
  for (const term of terms) {
    const needle = term.toLowerCase();
    if (!needle) continue;
    count += lower.split(needle).length - 1;
  }
  return count;
}

function buildEvidenceSnippet(row, keywords) {
  const candidates = [
    row.short_summary || '',
    row.long_summary || '',
    row.title || '',
    stringifyCharacters(row.characters),
  ];

  for (const text of candidates) {
    const normalized = String(text || '').replace(/\s+/g, ' ').trim();
    if (!normalized) continue;

    const lower = normalized.toLowerCase();
    let index = -1;
    for (const keyword of keywords) {
      const foundIndex = lower.indexOf(keyword.toLowerCase());
      if (foundIndex !== -1 && (index === -1 || foundIndex < index)) {
        index = foundIndex;
      }
    }

    if (index === -1) {
      if (text === candidates[0] || text === candidates[1]) {
        return normalized.slice(0, 180);
      }
      continue;
    }

    const start = Math.max(0, index - 40);
    const end = Math.min(normalized.length, start + 180);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < normalized.length ? '...' : '';
    return `${prefix}${normalized.slice(start, end)}${suffix}`;
  }

  return '';
}

function scoreMemoryRow(row, keywords, phrases) {
  const title = row.title || '';
  const shortSummary = row.short_summary || '';
  const longSummary = row.long_summary || '';
  const charactersText = stringifyCharacters(row.characters);

  const titleMatchCount = countMatches(title, keywords);
  const shortMatchCount = countMatches(shortSummary, keywords);
  const longMatchCount = countMatches(longSummary, keywords);
  const characterMatchCount = countMatches(charactersText, keywords);

  const matchedFields = [];
  if (titleMatchCount > 0) matchedFields.push('title');
  if (shortMatchCount > 0) matchedFields.push('short_summary');
  if (longMatchCount > 0) matchedFields.push('long_summary');
  if (characterMatchCount > 0) matchedFields.push('characters');

  let score = 0;
  score += titleMatchCount * 8;
  score += shortMatchCount * 5;
  score += characterMatchCount * 4;
  score += longMatchCount * 2;

  for (const phrase of phrases) {
    const lower = phrase.toLowerCase();
    if (!lower) continue;
    if (title.toLowerCase().includes(lower)) score += 6;
    if (shortSummary.toLowerCase().includes(lower)) score += 5;
    if (longSummary.toLowerCase().includes(lower)) score += 3;
    if (charactersText.toLowerCase().includes(lower)) score += 4;
  }

  const combinedLower = `${title}\n${shortSummary}\n${longSummary}\n${charactersText}`.toLowerCase();
  const matchedKeywords = keywords.filter((keyword) => combinedLower.includes(keyword.toLowerCase()));
  if (matchedKeywords.length === keywords.length && keywords.length > 1) {
    score += 4;
  }

  return {
    ...row,
    score,
    matched_fields: matchedFields,
    matched_keywords: matchedKeywords,
    evidence_snippet: buildEvidenceSnippet(row, keywords),
  };
}

async function hasColumn(tableName, columnName) {
  const [rows] = await memoryPool.query(
    `
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [tableName, columnName]
  );
  return rows.length > 0;
}

async function ensureColumn(tableName, columnName, definition) {
  if (await hasColumn(tableName, columnName)) {
    return;
  }

  await memoryPool.query(
    `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`
  );
}

async function initReaderMemoryTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${READER_MEMORY_TABLE} (
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
    );
  `;
  await memoryPool.query(createTableSQL);
  await ensureColumn(READER_MEMORY_TABLE, 'source_title', 'VARCHAR(255) NULL AFTER article_id');
  await ensureColumn(READER_MEMORY_TABLE, 'source_content_hash', 'VARCHAR(64) NULL AFTER source_title');
  await ensureColumn(READER_MEMORY_TABLE, 'source_updated_at', 'TIMESTAMP NULL DEFAULT NULL AFTER source_content_hash');
}

async function initAuthorMemoryTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${AUTHOR_MEMORY_TABLE} (
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
    );
  `;
  await memoryPool.query(createTableSQL);
}

async function backfillReaderMemorySourceMetadata() {
  await memoryPool.query(
    `
      UPDATE ${READER_MEMORY_TABLE} m
      INNER JOIN ${articlesDb}.articles a ON a.article_id = m.article_id
      SET
        m.source_title = a.title,
        m.source_content_hash = a.content_hash,
        m.source_updated_at = a.update_time
      WHERE (m.source_title IS NULL OR m.source_content_hash IS NULL OR m.source_updated_at IS NULL)
        AND a.deleted = 0
        AND m.updated_at >= a.update_time
    `
  );
}

async function initMemoryTable() {
  await initReaderMemoryTable();
  await initAuthorMemoryTable();
  await backfillReaderMemorySourceMetadata();
}

function resolveSourceUpdatedAt(source) {
  return source?.source_updated_at || source?.update_time || source?.create_time || null;
}

function normalizeChapterSource(source, scope = READER_SCOPE) {
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
    editor_user_id: source.editor_user_id ? Number(source.editor_user_id) : null,
    edit_session_id: source.edit_session_id || null,
  };
}

async function getReaderChapterSource(articleId) {
  const [rows] = await memoryPool.query(
    `
      SELECT
        a.article_id,
        a.novel_id,
        a.article_chapter,
        a.title,
        a.content,
        a.content_hash,
        a.update_time AS source_updated_at
      FROM ${articlesDb}.articles a
      WHERE a.article_id = ?
        AND a.deleted = 0
        AND a.is_draft = 0
        AND a.article_type = 'richtext'
      LIMIT 1
    `,
    [articleId]
  );

  return normalizeChapterSource(rows[0] || null, READER_SCOPE);
}

async function getAuthorChapterSource(articleId, writerId = null) {
  const params = [articleId];
  let whereClause = 'w.article_id = ?';
  if (writerId) {
    whereClause += ' AND w.writer_id = ?';
    params.push(writerId);
  }

  const [rows] = await memoryPool.query(
    `
      SELECT
        w.article_id,
        w.writer_id,
        w.novel_id,
        a.article_chapter,
        w.title,
        w.content,
        w.content_hash,
        w.create_time AS source_updated_at,
        w.editor_user_id,
        w.edit_session_id
      FROM (${LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY}) w
      INNER JOIN ${articlesDb}.articles a ON a.article_id = w.article_id
      WHERE ${whereClause}
      LIMIT 1
    `,
    params
  );

  return normalizeChapterSource(rows[0] || null, AUTHOR_SCOPE);
}

async function getChapterSource(input, options = {}) {
  const articleId = Number(
    typeof input === 'number'
      ? input
      : input?.article_id || options.article_id || 0
  );
  const scope = normalizeMemoryScope(
    options.scope || input?.memory_scope || input?.scope,
    READER_SCOPE
  );
  const writerId = Number(
    typeof input === 'object' && input
      ? input.writer_id || 0
      : options.writer_id || 0
  );

  if (!articleId) {
    return null;
  }

  if (scope === AUTHOR_SCOPE) {
    return getAuthorChapterSource(articleId, writerId || null);
  }

  return getReaderChapterSource(articleId);
}

async function saveMemory(source, summary, options = {}) {
  const scope = normalizeMemoryScope(options.scope || source?.scope, READER_SCOPE);
  const normalizedSource = normalizeChapterSource(source, scope);

  if (!normalizedSource || !normalizedSource.article_id || !normalizedSource.novel_id) {
    throw new Error('saveMemory requires a valid source descriptor');
  }

  const charactersStr = typeof summary.characters === 'string'
    ? summary.characters
    : JSON.stringify(summary.characters || []);

  if (scope === AUTHOR_SCOPE) {
    await memoryPool.query(
      `
        INSERT INTO ${AUTHOR_MEMORY_TABLE} (
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

  await memoryPool.query(
    `
      INSERT INTO ${READER_MEMORY_TABLE} (
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

async function getMemory(articleId, options = {}) {
  const source = await getChapterSource(articleId, options);
  if (!source) {
    return null;
  }

  const scope = normalizeMemoryScope(options.scope || source.scope, READER_SCOPE);
  let sql;
  let params;

  if (scope === AUTHOR_SCOPE) {
    sql = `
      SELECT *
      FROM ${AUTHOR_MEMORY_TABLE}
      WHERE article_id = ?
        AND writer_id = ?
        AND source_content_hash <=> ?
        AND source_title <=> ?
        AND source_updated_at <=> ?
      LIMIT 1
    `;
    params = [
      source.article_id,
      source.writer_id,
      source.content_hash,
      source.title,
      source.source_updated_at,
    ];
  } else {
    sql = `
      SELECT *
      FROM ${READER_MEMORY_TABLE}
      WHERE article_id = ?
        AND source_content_hash <=> ?
        AND source_title <=> ?
        AND source_updated_at <=> ?
      LIMIT 1
    `;
    params = [
      source.article_id,
      source.content_hash,
      source.title,
      source.source_updated_at,
    ];
  }

  const [rows] = await memoryPool.query(sql, params);
  return rows[0] || null;
}

async function getNovelBaseRows(novelId) {
  const [rows] = await memoryPool.query(
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
      FROM ${articlesDb}.articles a
      LEFT JOIN (${LATEST_DISTINCT_WRITER_METADATA_SUBQUERY}) w ON w.article_id = a.article_id
      LEFT JOIN ${READER_MEMORY_TABLE} rm ON ${buildReaderMemoryValidityCondition('rm', 'a')}
      LEFT JOIN ${AUTHOR_MEMORY_TABLE} wm ON ${buildAuthorMemoryValidityCondition('wm', 'w')}
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

function resolveScopedChapterRow(baseRow, options = {}) {
  const scope = normalizeMemoryScope(options.scope, READER_SCOPE);
  const fallbackToReaderWhenDraftMissing = scope === AUTHOR_SCOPE
    && options.fallbackToReaderWhenDraftMissing === true;
  const articleId = Number(baseRow.article_id);
  const chapter = Number(baseRow.article_chapter);
  const hasReaderMemory = !!baseRow.reader_memory_id;
  const hasWriterSource = !!baseRow.writer_id;
  const hasWriterMemory = !!baseRow.writer_memory_id;

  if (scope === AUTHOR_SCOPE && hasWriterSource) {
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
      memory_scope: AUTHOR_SCOPE,
      summary_scope: hasWriterMemory ? AUTHOR_SCOPE : useReaderFallback ? READER_SCOPE : AUTHOR_SCOPE,
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
    memory_scope: READER_SCOPE,
    summary_scope: READER_SCOPE,
    writer_id: null,
    has_current_draft: false,
    is_reader_fallback: false,
  };
}

async function getNovelMemories(novelId, options = {}) {
  const rows = await getNovelBaseRows(novelId);
  return rows
    .map((row) => resolveScopedChapterRow(row, options))
    .filter((row) => row.has_memory);
}

async function getNovelChapterIndex(novelId, options = {}) {
  const rows = await getNovelBaseRows(novelId);
  return rows.map((row) => {
    const resolved = resolveScopedChapterRow(row, options);
    return {
      article_id: resolved.article_id,
      chapter: resolved.chapter,
      title: resolved.title,
      update_time: resolved.update_time || null,
      short_summary: resolved.short_summary || '',
      memory_updated_at: resolved.memory_updated_at || null,
      has_summary: !!resolved.short_summary,
      memory_scope: resolved.memory_scope,
      has_current_draft: resolved.has_current_draft,
      is_reader_fallback: resolved.is_reader_fallback,
    };
  });
}

async function searchMemoriesByKeywords(novelId, keywords, page = 1, limit = 10, options = {}) {
  const flatKeywords = normalizeKeywords(keywords);
  const phrases = normalizePhrases(keywords);

  if (flatKeywords.length === 0) {
    return { page, total: 0, count: 0, results: [] };
  }

  const rows = await getNovelMemories(novelId, options);
  const rankedRows = rows
    .map((row) => scoreMemoryRow(row, flatKeywords, phrases))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.article_chapter - a.article_chapter;
    });

  const start = Math.max(0, (page - 1) * limit);
  const results = rankedRows.slice(start, start + limit).map((row) => ({
    article_id: row.article_id,
    chapter: row.article_chapter,
    title: row.title,
    update_time: row.update_time || null,
    long_summary: row.long_summary,
    short_summary: row.short_summary,
    characters: row.characters,
    matched_fields: row.matched_fields,
    matched_keywords: row.matched_keywords,
    evidence_snippet: row.evidence_snippet,
    score: row.score,
    memory_scope: row.memory_scope,
    summary_scope: row.summary_scope,
    has_current_draft: row.has_current_draft,
    is_reader_fallback: row.is_reader_fallback,
  }));

  return {
    page,
    total: rankedRows.length,
    count: results.length,
    results,
  };
}

async function getPriorityNovels(limit = 50) {
  const sql = `SELECT * FROM ${articlesDb}.novels WHERE update_time > DATE_SUB(NOW(), INTERVAL 1 MONTH) ORDER BY update_time DESC LIMIT ?`;
  const [rows] = await memoryPool.query(sql, [limit]);
  return rows;
}

async function getPriorityNovel() {
  const novels = await getPriorityNovels(1);
  return novels.length > 0 ? novels[0] : null;
}

async function getPendingChapters(novelId) {
  const [rows] = await memoryPool.query(
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
          '${READER_SCOPE}' AS memory_scope,
          NULL AS writer_id,
          0 AS scope_order
        FROM ${articlesDb}.articles a
        LEFT JOIN ${READER_MEMORY_TABLE} rm ON ${buildReaderMemoryValidityCondition('rm', 'a')}
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
          '${AUTHOR_SCOPE}' AS memory_scope,
          w.writer_id,
          1 AS scope_order
        FROM (${LATEST_DISTINCT_WRITER_SOURCE_SUBQUERY}) w
        INNER JOIN ${articlesDb}.articles a ON a.article_id = w.article_id
        LEFT JOIN ${AUTHOR_MEMORY_TABLE} wm ON ${buildAuthorMemoryValidityCondition('wm', 'w')}
        WHERE w.novel_id = ?
          AND wm.memory_id IS NULL
      ) pending
      ORDER BY pending.article_chapter ASC, pending.scope_order ASC
    `,
    [novelId, novelId]
  );

  return rows.map((row) => ({
    article_id: Number(row.article_id),
    title: row.title || '',
    article_chapter: Number(row.article_chapter),
    source_update_time: row.source_update_time || null,
    memory_scope: normalizeMemoryScope(row.memory_scope, READER_SCOPE),
    writer_id: row.writer_id ? Number(row.writer_id) : null,
  }));
}

async function getChapterContext(novelId, options = {}) {
  const scope = normalizeMemoryScope(options.scope, READER_SCOPE);
  const rows = await getNovelBaseRows(novelId);
  const resolvedRows = rows.map((row) => resolveScopedChapterRow(row, options));
  const articleId = Number(options.article_id || 0);
  const chapter = Number(options.chapter || 0);
  const radius = Math.max(1, Math.min(Number(options.radius || 2), 5));

  let centerRow = null;
  if (articleId) {
    centerRow = resolvedRows.find((row) => row.article_id === articleId) || null;
  } else if (chapter) {
    centerRow = resolvedRows.find((row) => row.chapter === chapter) || null;
  }

  if (!centerRow) {
    return {
      success: false,
      error: 'chapter not found',
      results: [],
    };
  }

  const startChapter = Math.max(1, centerRow.chapter - radius);
  const endChapter = centerRow.chapter + radius;

  return {
    success: true,
    center: {
      article_id: centerRow.article_id,
      chapter: centerRow.chapter,
      title: centerRow.title || '',
    },
    radius,
    scope,
    results: resolvedRows
      .filter((row) => row.chapter >= startChapter && row.chapter <= endChapter)
      .map((row) => ({
        article_id: row.article_id,
        chapter: row.chapter,
        title: row.title || '',
        update_time: row.update_time || null,
        short_summary: row.short_summary || '',
        long_summary: row.long_summary || '',
        characters: row.characters,
        has_memory: row.has_memory,
        is_center: row.article_id === centerRow.article_id,
        memory_scope: row.memory_scope,
        summary_scope: row.summary_scope,
        has_current_draft: row.has_current_draft,
        is_reader_fallback: row.is_reader_fallback,
      })),
  };
}

export {
  AUTHOR_SCOPE,
  READER_SCOPE,
  getChapterContext,
  getChapterSource,
  getMemory,
  getNovelChapterIndex,
  getNovelMemories,
  getPendingChapters,
  getPriorityNovel,
  getPriorityNovels,
  initMemoryTable,
  normalizeMemoryScope,
  saveMemory,
  searchMemoriesByKeywords,
};
