const { PUBLIC_ARTICLE } = require('./readingVisibility');
const { findReaderParagraph } = require('./readerParagraphs');

function positiveInteger(value) {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}
function identity(req) { return positiveInteger(Array.isArray(req.user) ? req.user[0] && req.user[0].user_id : req.user && req.user.user_id); }

function registerReaderExcerpts(router, { auth, query }) {
  router.get('/get_my_article_cento', auth, async (req, res) => {
    const articleId = positiveInteger(req.query.article_id), userId = identity(req);
    if (!userId) return res.status(401).json({ msg:'请先登录' });
    if (!articleId) return res.status(400).json({ msg:'章节编号无效' });
    try {
      const rows = await query(`SELECT ac.* FROM article_cento ac
        JOIN articles a ON a.article_id = ac.article_id JOIN novels n ON n.novel_id = a.novel_id
        WHERE a.article_id = ? AND ac.user_id = ? AND ac.is_delete = 0 AND ${PUBLIC_ARTICLE}
        ORDER BY ac.article_cento_id`, [articleId,userId]);
      return res.json(rows);
    } catch (_) { return res.status(503).json({ msg:'划线书摘暂不可用，请重试' }); }
  });

  router.get('/get_my_novel_centos', auth, async (req, res) => {
    const novelId = positiveInteger(req.query.novel_id), userId = identity(req);
    if (!userId) return res.status(401).json({ msg:'请先登录' });
    if (!novelId) return res.status(400).json({ msg:'作品编号无效' });
    try {
      const rows = await query(`SELECT ac.*, a.title, a.article_chapter FROM article_cento ac
        JOIN articles a ON a.article_id = ac.article_id JOIN novels n ON n.novel_id = a.novel_id
        WHERE a.novel_id = ? AND ac.user_id = ? AND ac.is_delete = 0 AND ${PUBLIC_ARTICLE}
        ORDER BY a.article_chapter, a.article_id, ac.article_cento_id`, [novelId,userId]);
      return res.json(rows);
    } catch (_) { return res.status(503).json({ msg:'我的书摘暂不可用，请重试' }); }
  });

  router.get('/get_hot_novel_centos', async (req, res) => {
    const novelId = positiveInteger(req.query.novel_id), limit = req.query.limit === undefined ? 10 : positiveInteger(req.query.limit);
    if (!novelId || !limit || limit > 50) return res.status(400).json({ msg:'书摘查询参数无效' });
    try {
      // Aggregate comments once: joining raw comments repeatedly scans an unindexed cento_id.
      const rows = await query(`SELECT ac.paragraph_id, ac.paragraph,
        COUNT(ac.article_cento_id) AS highlight_count, COALESCE(SUM(nc.comment_count),0) AS comment_count,
        a.title AS article_title, a.article_chapter, a.article_id
        FROM article_cento ac JOIN articles a ON a.article_id = ac.article_id
        JOIN novels n ON n.novel_id = a.novel_id
        LEFT JOIN (SELECT cento_id, COUNT(*) AS comment_count FROM novel_comments
          WHERE deleted = 0 AND cento_id > 0 GROUP BY cento_id) nc ON nc.cento_id = ac.article_cento_id
        WHERE a.novel_id = ? AND ac.is_delete = 0 AND ${PUBLIC_ARTICLE}
        GROUP BY ac.paragraph_id, ac.paragraph, a.title, a.article_chapter, a.article_id
        ORDER BY highlight_count DESC, comment_count DESC, a.article_id, ac.paragraph_id
        LIMIT ?`, [novelId,limit]);
      return res.json(rows);
    } catch (_) { return res.status(503).json({ msg:'热门书摘暂不可用，请重试' }); }
  });

  router.post('/add_article_cento', auth, async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const userId = identity(req), articleId = positiveInteger(body.article_id), paragraphId = positiveInteger(body.paragraph_id);
    if (!userId) return res.status(401).json({ msg:'请先登录' });
    if (!articleId || !paragraphId) return res.status(400).json({ msg:'章节或段落编号无效' });
    try {
      const articles = await query(`SELECT a.content, a.article_type FROM articles a JOIN novels n ON n.novel_id = a.novel_id
        WHERE a.article_id = ? AND ${PUBLIC_ARTICLE}`, [articleId]);
      if (!articles.length) return res.status(404).json({ msg:'章节不存在或不可阅读' });
      const paragraph = findReaderParagraph(articles[0],paragraphId);
      if (!paragraph || !paragraph.value.trim()) return res.status(404).json({ msg:'段落不存在或不可划线' });
      await query('INSERT INTO article_cento(user_id, article_id, paragraph_id, paragraph) VALUES(?, ?, ?, ?)', [userId,articleId,paragraphId,paragraph.value]);
      return res.end('success');
    } catch (_) { return res.status(503).json({ msg:'划线未能保存，请重试' }); }
  });
}
module.exports = { registerReaderExcerpts };
