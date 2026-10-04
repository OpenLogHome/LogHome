const { createHash } = require('crypto');

function mangaRevision(article) {
	return createHash('sha256').update(JSON.stringify([
		article.title,
		article.content,
		article.article_type,
		Number(article.is_draft),
		article.update_time,
	])).digest('hex');
}

// Check the snapshot atomically in UPDATE, including title-only changes and legacy null hashes.
const MANGA_REVISION_CONDITION = ' AND BINARY `title` <=> BINARY ? AND BINARY `content` <=> BINARY ? AND `article_type` <=> ? AND `is_draft` <=> ? AND `update_time` <=> ?';
function mangaRevisionValues(article) {
	return [article.title, article.content, article.article_type, article.is_draft, article.update_time];
}

module.exports = { mangaRevision, MANGA_REVISION_CONDITION, mangaRevisionValues };
