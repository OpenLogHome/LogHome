const { PUBLIC_NOVEL, PUBLIC_ARTICLE } = require('./readingVisibility');
const { findReaderParagraph } = require('./readerParagraphs');

function invalid(message, status = 400) { return Object.assign(new Error(message), { status }); }
async function createReadingComment(body, userId, withTransaction) {
  const novelId = Number(body.novel_id), articleId = Number(body.article_id) || 0, paragraphId = Number(body.paragraph_id) || -1;
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const media = Array.isArray(body.media_urls) ? body.media_urls : [];
  if (!Number.isSafeInteger(novelId) || novelId <= 0 || !Number.isSafeInteger(articleId) || articleId < 0 || (!content && !media.length)) throw invalid('评论参数不完整');
  return withTransaction(async query => {
    const novels = await query(`SELECT n.* FROM novels n WHERE n.novel_id = ? AND ${PUBLIC_NOVEL}`, [novelId]);
    if (!novels.length) throw invalid('作品不存在或不可阅读', 404);
    let paragraph = null;
    if (articleId > 0) {
      const articles = await query(`SELECT a.* FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.article_id = ? AND a.novel_id = ? AND ${PUBLIC_ARTICLE}`, [articleId, novelId]);
      if (!articles.length) throw invalid('章节不存在或不属于本作品', 404);
      if (paragraphId > 0) { paragraph = findReaderParagraph(articles[0], paragraphId); if (!paragraph) throw invalid('未找到指定段落', 404); }
    } else if (paragraphId > 0) throw invalid('段落评论必须指定章节');
    let centoId = 0;
    if (paragraph) {
      const rows = await query('SELECT article_cento_id FROM article_cento WHERE article_id = ? AND paragraph_id = ? AND user_id = ? AND is_delete = 0 LIMIT 1', [articleId, paragraph.id, userId]);
      if (rows.length) centoId = rows[0].article_cento_id;
      else { const cento = await query('INSERT INTO article_cento(user_id, article_id, paragraph_id, paragraph) VALUES(?, ?, ?, ?)', [userId, articleId, paragraph.id, paragraph.value]); centoId = cento.insertId; }
    }
    const inserted = await query('INSERT INTO novel_comments(user_id,novel_id,content,article_id,media_urls,cento_id) VALUES(?,?,?,?,?,?)', [userId, novelId, content, articleId, media.length ? JSON.stringify(media) : null, centoId]);
    const comments = await query('SELECT n.*,u.name,u.avatar_url FROM novel_comments n JOIN users u ON n.user_id = u.user_id WHERE n.essay_comment_id = ?', [inserted.insertId]);
    return { novel: novels[0], comment: { ...comments[0], author_id: novels[0].author_id } };
  });
}
module.exports = { createReadingComment };
