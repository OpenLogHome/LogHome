// Match the published word-count convention without counting JSON or image URLs.
function articleTextCount(content, articleType) {
	try {
		const value = typeof content === 'string' ? JSON.parse(content) : content;
		if (articleType === 'worldVocabulary') {
			return value && typeof value.desc === 'string' ? value.desc.length : null;
		}
		if (!['richtext', 'worldOutline'].includes(articleType) || !Array.isArray(value)) return null;
		return value.reduce((count, block) => count + (
			block && block.type === 'text' && typeof block.value === 'string' ? block.value.length : 0
		), 0);
	} catch (_) {
		return null;
	}
}

module.exports = { articleTextCount };
