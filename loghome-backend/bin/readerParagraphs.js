// Public reader, paragraph comments and typo reports must agree on paragraph identity.
function readerParagraphs(rawContent, articleType = 'richtext') {
  let content = rawContent;
  if (typeof content === 'string') {
    try { content = JSON.parse(content); } catch (_) { /* Legacy plain text. */ }
  }
  if (articleType === 'worldVocabulary') {
    return [{ type: 'text', id: 1, value: String((content && content.desc) || '') }];
  }
  if (content && !Array.isArray(content) && Array.isArray(content.content)) content = content.content;
  if (typeof content === 'string') content = content.replace(/\r\n/g, '\n').split('\n').map(value => ({ type: 'text', value }));
  if (!Array.isArray(content)) return [];
  const reserved = new Set(content.filter(item => item && (!item.type || item.type === 'text')).map(item => Number(item.id ?? item.paragraph_id)).filter(id => Number.isSafeInteger(id) && id > 0));
  let autoId = 1;
  return content.map(item => {
    if (item && item.type && item.type !== 'text') return { ...item };
    const explicit = Number(item && (item.id ?? item.paragraph_id));
    let id = explicit;
    if (!Number.isSafeInteger(id) || id <= 0) { while (reserved.has(autoId)) autoId++; id = autoId++; reserved.add(id); }
    const value = item && item.value;
    return { ...(item || {}), type: 'text', id, value: Array.isArray(value) ? value.join('') : String(value == null ? '' : value) };
  });
}
function findReaderParagraph(article, paragraphId) {
  const id = Number(paragraphId);
  if (!Number.isSafeInteger(id) || id <= 0 || /^manga/.test(article.article_type || '')) return null;
  return readerParagraphs(article.content, article.article_type).find(item => item.type === 'text' && item.id === id) || null;
}
module.exports = { readerParagraphs, findReaderParagraph };
