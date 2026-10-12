import { workUrl } from './reading-discovery'

export const SITE_ORIGIN = 'https://loghome.ink'
export function readingPage(value) {
  const page = Number(value)
  return Number.isSafeInteger(page) && page > 0 && page <= 10000 ? page : 1
}
export function readingResponseStatus(component, status) {
  const context = component.$nuxt && component.$nuxt.context
  if (process.server && context && context.res) context.res.statusCode = status
}
export function publicReadingPath(path) {
  return /^\/(read(?:\/rank|\/collections|\/resources|\/(?:end|ask|comment|power)\/\d+)?|tags|tag\/collections|novel\/\d+|article\/\d+|manga\/\d+|manga\/read\/\d+|world\/(?:relations\/)?\d+)\/?$/.test(path)
}
export function canonicalReadingUrl(path, query = {}) {
  const pairs = []
  if (path === '/read/rank') {
    if (['update', 'logpower', 'complete', 'new'].includes(query.board) && query.board !== 'update') pairs.push(['board', query.board])
    if (['all', 'novel', 'manga', 'world'].includes(query.zone) && query.zone !== 'all') pairs.push(['zone', query.zone])
  }
  if (path === '/read/collections' && query.title) pairs.push(['title', String(query.title).slice(0, 120)])
  if (path === '/tag/collections' && Number.isSafeInteger(Number(query.tag_id)) && Number(query.tag_id) > 0) pairs.push(['tag_id', String(Number(query.tag_id))])
  if (['/read', '/read/rank', '/read/collections', '/tag/collections'].includes(path) && readingPage(query.page) > 1) pairs.push(['page', String(readingPage(query.page))])
  return SITE_ORIGIN + path.replace(/\/$/, '') + (pairs.length ? '?' + pairs.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&') : '')
}
export function readingHead({ title, description, path, query, image, type = 'website', schema, noindex = false }) {
  const url = canonicalReadingUrl(path, query)
  const summary = String(description || '在原木社区阅读小说、漫画与世界设定，发现方块世界的故事。').replace(/\s+/g, ' ').slice(0, 160)
  const head = {
    title,
    link: [{ hid: 'reading-canonical', rel: 'canonical', href: url }],
    meta: [
      { hid: 'description', name: 'description', content: summary },
      { hid: 'robots', name: 'robots', content: noindex ? 'noindex,follow' : 'index,follow' },
      { hid: 'og:title', property: 'og:title', content: title },
      { hid: 'og:description', property: 'og:description', content: summary },
      { hid: 'og:url', property: 'og:url', content: url },
      { hid: 'og:type', property: 'og:type', content: type },
      { hid: 'og:site_name', property: 'og:site_name', content: '原木社区' }
    ]
  }
  if (image && /^https?:\/\//i.test(image)) head.meta.push({ hid: 'og:image', property: 'og:image', content: image })
  if (schema) {
    // Preserve JSON text (vue-meta's HTML entity escaping changes names such as A&B).
    // Escape script delimiters first; only this inert JSON-LD tag bypasses HTML escaping.
    const json = JSON.stringify(schema).replace(/[<>&\u2028\u2029]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
    head.script = [{ hid: 'reading-schema', type: 'application/ld+json', innerHTML: json }]
    head.__dangerouslyDisableSanitizersByTagID = { 'reading-schema': ['innerHTML'] }
  }
  return head
}
export function workListSchema(works, name, offset = 0) {
  return { '@context': 'https://schema.org', '@type': 'ItemList', name,
    itemListElement: works.map((work, index) => ({ '@type': 'ListItem', position: offset + index + 1, name: work.name, url: SITE_ORIGIN + workUrl(work) })) }
}
export function bookSchema(book, path) {
  return { '@context': 'https://schema.org', '@type': 'Book', name: book.name, description: book.content || '',
    url: canonicalReadingUrl(path), inLanguage: 'zh-CN', author: { '@type': 'Person', name: book.author_name || book.user_name || '佚名' },
    ...(book.picUrl && /^https?:\/\//i.test(book.picUrl) ? { image: book.picUrl } : {}) }
}
