const { query } = require('../sql');
function publishedWords(content, type) {
	try {
		const value = typeof content === 'string' ? JSON.parse(content) : content;
		const plain = text =>
			String(text || '')
				.replace(/<[^>]*>/g, '')
				.replace(/\s/g, '').length;
		if (type === 'worldVocabulary') return plain(value.desc);
		if (Array.isArray(value))
			return value.reduce(
				(n, item) => n + (item.type === 'text' ? plain(item.value) : 0),
				0,
			);
	} catch (_) {}
	return 0;
}
function hasPublishedContent(content, type) {
	try {
		const value = typeof content === 'string' ? JSON.parse(content) : content;
		if (type === 'mangaStrip' || type === 'mangaPage')
			return (
				Array.isArray(value.pages) &&
				value.pages.some(
					page => page && /^https?:\/\//.test(String(page.url || '')),
				)
			);
		if (type === 'worldVocabulary') return publishedWords(value, type) > 0;
		return (
			Array.isArray(value) &&
			value.some(item =>
				item.type === 'text'
					? publishedWords([item], type) > 0
					: !!(item.value || item.url),
			)
		);
	} catch (_) {
		return false;
	}
}
async function recordFirstPublication(articleId, runQuery = query) {
	const rows = await runQuery(
		'SELECT a.*,n.is_personal,n.is_banned FROM articles a JOIN novels n ON n.novel_id=a.novel_id WHERE a.article_id=?',
		[articleId],
	);
	const article = rows[0];
	if (
		!article ||
		Number(article.is_draft) !== 0 ||
		Number(article.deleted) !== 0 ||
		article.article_type === 'spliter'
	)
		return;
	const known =
		Number(article.is_personal) === 0 && Number(article.is_banned) === 0;
	await runQuery(
		`INSERT IGNORE INTO novel_publish_record
  (article_id,novel_id,article_type,first_published_at,first_publication_known,words_at_publish,content_valid)
  VALUES(?,?,?,IF(?,CURRENT_TIMESTAMP,NULL),?,?,?)`,
		[
			article.article_id,
			article.novel_id,
			article.article_type,
			known ? 1 : 0,
			known ? 1 : 0,
			publishedWords(article.content, article.article_type),
			hasPublishedContent(article.content, article.article_type) ? 1 : 0,
		],
	);
}
module.exports = {
	recordFirstPublication,
	publishedWords,
	hasPublishedContent,
};
