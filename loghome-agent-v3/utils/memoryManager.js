import { memoryPool, secret } from './db.js';

const articlesDb = secret.DB_CONFIG.database;

// Initialize the agent_memory table
async function initMemoryTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS agent_memory (
      memory_id INT AUTO_INCREMENT PRIMARY KEY,
      novel_id INT NOT NULL,
      article_id INT NOT NULL UNIQUE,
      chapter_comprehension JSON,
      character_comprehension JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_novel_id (novel_id),
      INDEX idx_article_id (article_id)
    );
  `;
  await memoryPool.query(createTableSQL);
}

// Save or update memory for a chapter
async function saveMemory(novelId, articleId, chapterComp, characterComp) {
  const sql = `
    INSERT INTO agent_memory (novel_id, article_id, chapter_comprehension, character_comprehension)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      novel_id = VALUES(novel_id),
      chapter_comprehension = VALUES(chapter_comprehension),
      character_comprehension = VALUES(character_comprehension)
  `;
  
  // Ensure we are storing JSON strings if the input is object
  const chapterCompStr = typeof chapterComp === 'string' ? chapterComp : JSON.stringify(chapterComp);
  const characterCompStr = typeof characterComp === 'string' ? characterComp : JSON.stringify(characterComp);
  
  await memoryPool.query(sql, [novelId, articleId, chapterCompStr, characterCompStr]);
}

// Get memory for a specific article
async function getMemory(articleId) {
  const [rows] = await memoryPool.query('SELECT * FROM agent_memory WHERE article_id = ?', [articleId]);
  if (rows.length === 0) return null;
  return rows[0];
}

// Get all memories for a novel, sorted by chapter order
// Also returns the article_chapter info for context
async function getNovelMemories(novelId) {
  // We need to join with articles table which is in the main database
  // We assume the user has permissions to access the main database from the memory connection
  const sql = `
    SELECT m.*, a.article_chapter, a.title
    FROM agent_memory m
    JOIN ${articlesDb}.articles a ON m.article_id = a.article_id
    WHERE m.novel_id = ?
    ORDER BY a.article_chapter ASC
  `;
  const [rows] = await memoryPool.query(sql, [novelId]);
  return rows;
}

// Search memories by keywords
async function searchMemoriesByKeywords(novelId, keywords, page = 1, limit = 10) {
  if (!keywords || keywords.length === 0) return [];
  
  // Split keywords by space and remove duplicates/empty
  const flatKeywords = [...new Set(
      keywords.flatMap(k => k.split(/\s+/)).filter(k => k.trim().length > 0)
  )];
  
  if (flatKeywords.length === 0) return [];

  // Construct the WHERE clause
  const conditions = [];
  const params = [novelId];
  
  flatKeywords.forEach(kw => {
    conditions.push(`(m.chapter_comprehension LIKE ? OR m.character_comprehension LIKE ? OR a.title LIKE ?)`);
    params.push(`%${kw}%`, `%${kw}%`, `%${kw}%`);
  });
  
  const whereClause = conditions.join(' OR ');
  
  const sql = `
    SELECT m.*, a.article_chapter, a.title
    FROM agent_memory m
    JOIN ${articlesDb}.articles a ON m.article_id = a.article_id
    WHERE m.novel_id = ?
    AND (${whereClause})
  `;
  
  const [rows] = await memoryPool.query(sql, params);
  
  // Rank in JS
  const rankedRows = rows.map(row => {
    let score = 0;
    const text = (
        (typeof row.chapter_comprehension === 'string' ? row.chapter_comprehension : JSON.stringify(row.chapter_comprehension)) + 
        (typeof row.character_comprehension === 'string' ? row.character_comprehension : JSON.stringify(row.character_comprehension)) +
        row.title
    ).toLowerCase();
    
    flatKeywords.forEach(kw => {
        const k = kw.toLowerCase();
        // Count occurrences
        const parts = text.split(k);
        score += (parts.length - 1);
    });
    
    return { ...row, score };
  });
  
  rankedRows.sort((a, b) => b.score - a.score);
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return rankedRows.slice(start, end);
}

// Get priority novels (active in last month)
async function getPriorityNovels(limit = 50) {
  const sql = `SELECT * FROM ${articlesDb}.novels WHERE update_time > DATE_SUB(NOW(), INTERVAL 1 MONTH) ORDER BY update_time DESC LIMIT ?`;
  const [rows] = await memoryPool.query(sql, [limit]);
  return rows;
}

// Get the novel with the latest update_time
async function getPriorityNovel() {
  const novels = await getPriorityNovels(1);
  return novels.length > 0 ? novels[0] : null;
}

// Get chapters that need processing (not in memory or outdated)
async function getPendingChapters(novelId) {
  const sql = `
    SELECT a.article_id, a.title, a.article_chapter, a.update_time
    FROM ${articlesDb}.articles a
    LEFT JOIN agent_memory m ON a.article_id = m.article_id
    WHERE a.novel_id = ?
      AND (m.memory_id IS NULL OR m.updated_at < a.update_time)
      AND a.article_type = 'richtext'
      AND a.is_draft = 0
      AND a.deleted = 0
    ORDER BY a.article_chapter ASC
  `;
  const [rows] = await memoryPool.query(sql, [novelId]);
  return rows;
}

export { initMemoryTable, saveMemory, getMemory, getNovelMemories, getPriorityNovel, getPriorityNovels, getPendingChapters, searchMemoriesByKeywords };
