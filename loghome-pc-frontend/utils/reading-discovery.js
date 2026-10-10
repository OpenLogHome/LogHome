export const READING_BOARDS = [
  { key: 'update', label: '更新榜', description: '近 7 天更新的作品，按更新时间排序' },
  { key: 'logpower', label: '原木力榜', description: '根据阅读与互动贡献计算的原木力排行' },
  { key: 'complete', label: '完结榜', description: '已完结作品，按最近更新时间排序' },
  { key: 'new', label: '新作榜', description: '近三个月上线的作品，按原木力排序' }
]
export const READING_ZONES = [
  { key: 'all', label: '全部' }, { key: 'novel', label: '小说' },
  { key: 'manga', label: '漫画' }, { key: 'world', label: '世界' }
]
export const enabledFlag = value => value === true || Number(value) === 1
export const asList = value => Array.isArray(value) ? value : []

export function workUrl(work) {
  const id = Number(work.novel_id)
  return `/${work.novel_type === 'world' ? 'world' : work.novel_type === 'manga' ? 'manga' : 'novel'}/${id}`
}
export function normalizeWork(work) {
  return {
    ...work,
    novel_id: Number(work.novel_id),
    author_name: work.author_name || work.user_name || work.username || '佚名',
    author_avatar: work.auther_avatar || work.avatar_url || work.author_avatar || '',
    is_complete: enabledFlag(work.is_complete),
    is_haycraft: enabledFlag(work.is_haycraft) || asList(work.tags || work.tag_names).some(tag =>
      /haycraft/i.test(typeof tag === 'object' ? tag.tag_name || tag.name || '' : String(tag)))
  }
}
export function uniqueWorks(works) {
  const seen = new Set()
  return asList(works).filter(work => {
    const id = Number(work && work.novel_id)
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) return false
    seen.add(id)
    return true
  }).map(normalizeWork)
}
export function activeCollections(collections) {
  return asList(collections).filter(item => enabledFlag(item.isValid))
    .sort((a, b) => Number(a.collection_id) - Number(b.collection_id))
}
export function collectionUrl(title) {
  if (title === '原木力爆棚') return '/read/rank?board=logpower&zone=all'
  if (title === '最近更新') return '/read/rank?board=update&zone=all'
  return `/read/collections?title=${encodeURIComponent(title)}`
}
export function numberText(value) {
  const number = Number(value) || 0
  return number >= 10000 ? `${(number / 10000).toFixed(1)}万` : number.toLocaleString('zh-CN')
}
export function dateText(value) {
  if (!value) return '暂无更新'
  return String(value).replace('T', ' ').slice(0, 16)
}

// Index tags are configured with uni-app URLs. Resolve supported destinations natively.
export function discoveryLink(raw, mobileBase = 'https://m.loghome.ink') {
  if (!raw || raw === 'None') return null
  const value = String(raw).trim()
  if (/^https?:\/\//i.test(value)) return { href: value, external: true }
  if (!value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return null
  const [path, query = ''] = value.split('?')
  const QueryParams = process.server ? require('url').URLSearchParams : URLSearchParams
  const params = new QueryParams(query)
  const id = Number(params.get('id') || params.get('novel_id'))
  const exact = {
    '/pages/library': '/read', '/pages/bookcase/index': '/read/bookcase',
    '/pages/bookcase/manage': '/read/bookcase', '/pages/readers/tags': '/tags',
    '/pages/readers/rankBoard': '/read/rank', '/pages/readers/logPowerRank': '/read/rank?board=logpower',
    '/pages/readers/collections': '/read/collections', '/pages/readers/tagCollections': '/tag/collections',
    '/pages/community/search': '/search', '/pages/community/message': '/me/messages',
    '/pages/community/index': '/community'
  }
  let target = exact[path]
  if (id > 0) {
    if (path === '/pages/readers/bookInfo') target = `/novel/${id}`
    if (path === '/pages/readers/mangaInfo') target = `/manga/${id}`
    if (path === '/pages/worlds/worldPage') target = `/world/${id}`
    if (path === '/pages/users/personalPage') target = `/users/${id}`
  }
  if (target) {
    params.delete('id'); params.delete('novel_id'); params.delete('noneAnimation')
    const suffix = params.toString()
    return { href: target + (suffix ? (target.includes('?') ? '&' : '?') + suffix : ''), external: false }
  }
  if (path.startsWith('/pages/')) return { href: `${mobileBase.replace(/\/$/, '')}/#${value}`, external: true }
  return { href: value, external: false }
}

export function mergeShelf(likes, history, updates = []) {
  const records = new Map(uniqueWorks(history).map((book, index) => [book.novel_id, { ...book, historyIndex: index }]))
  const updateMap = new Map(asList(updates).map(update => [Number(update.novel_id), update]))
  const merged = uniqueWorks(likes).map(book => ({
    ...records.get(book.novel_id), ...book,
    historyIndex: (records.get(book.novel_id) || {}).historyIndex,
    last_article_id: (records.get(book.novel_id) || {}).last_article_id,
    last_article_chapter: (records.get(book.novel_id) || {}).last_article_chapter,
    last_page_idx: (records.get(book.novel_id) || {}).last_page_idx,
    novel_type: book.novel_type || (records.get(book.novel_id) || {}).novel_type,
    inShelf: true, updateInfo: updateMap.get(book.novel_id)
  }))
  const present = new Set(merged.map(book => book.novel_id))
  records.forEach(book => { if (!present.has(book.novel_id)) merged.push(book) })
  return merged.sort((a, b) => {
    const aUpdated = enabledFlag((a.updateInfo || {}).has_updates)
    const bUpdated = enabledFlag((b.updateInfo || {}).has_updates)
    if (aUpdated !== bUpdated) return aUpdated ? -1 : 1
    if (aUpdated) return new Date(b.updateInfo.latest_update_time || 0) - new Date(a.updateInfo.latest_update_time || 0)
    return (a.historyIndex == null ? Infinity : a.historyIndex) - (b.historyIndex == null ? Infinity : b.historyIndex)
  })
}

export function mergeReadingHistory(cloud, local) {
  const records = new Map()
  for (const book of [...uniqueWorks(cloud), ...uniqueWorks(local)]) {
    const previous = records.get(book.novel_id)
    const timestamp = new Date(book.last_read_time || 0).getTime() || 0
    const previousTime = previous ? new Date(previous.last_read_time || 0).getTime() || 0 : 0
    if (!previous || (book.last_article_id && (!previous.last_article_id || timestamp > previousTime))) records.set(book.novel_id, book)
  }
  return [...records.values()].sort((a, b) => (new Date(b.last_read_time || 0).getTime() || 0) - (new Date(a.last_read_time || 0).getTime() || 0))
}
