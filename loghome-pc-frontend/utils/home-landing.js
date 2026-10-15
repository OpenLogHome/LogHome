import { activeCollections, asList, enabledFlag, uniqueWorks } from './reading-discovery'

// Reuse public discovery feeds. The optional 首页精选 collection lets editors
// curate the landing page without introducing another configuration service.
export async function loadLandingWorks(reading, authorFallback) {
  const [collections, feed] = await Promise.allSettled([
    reading.getCollections(), reading.getBooks(1, 8)
  ])
  const candidates = activeCollections(collections.status === 'fulfilled' ? collections.value : [])
    .filter(item => !['banner', '最近更新'].includes(item.collection_title))
  const selected = candidates.find(item => item.collection_title === '首页精选') ||
    candidates.find(item => item.collection_title === '入站必读') || candidates[0]
  if (selected) {
    try {
      const works = publicWorks(await reading.getCollectionBooks(selected.collection_title, 1, 8), authorFallback)
      if (works.length) return { works: works.slice(0, 4), collection: selected.collection_title, error: false }
    } catch (_) { /* The public feed remains usable if a collection is unavailable. */ }
  }
  return {
    works: publicWorks(feed.status === 'fulfilled' ? feed.value : [], authorFallback).slice(0, 4),
    collection: '', error: feed.status === 'rejected'
  }
}

export function publicWorks(value, authorFallback) {
  const works = asList(value).map(work => work && ({ ...work, author_name: work.author_name || work.user_name || work.username || authorFallback }))
  return uniqueWorks(works).filter(work =>
    !enabledFlag(work.is_personal) && !enabledFlag(work.is_banned) && !enabledFlag(work.deleted))
}

export function landingPosts(value) {
  const seen = new Set()
  return asList(value && value.list).filter(post => {
    const id = Number(post && post.post_id)
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id) ||
      (post.status != null && Number(post.status) !== 1)) return false
    seen.add(id)
    return true
  }).slice(0, 3)
}

export function plainText(value, limit = 120) {
  return String(value || '').replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ').trim().slice(0, limit)
}

export function downloadInfo(value) {
  const release = asList(value)[0]
  if (!release || typeof release.update_url !== 'string') return null
  try {
    const url = new URL(release.update_url)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null
    return { url: url.href, version: String(release.version || '') }
  } catch (_) { return null }
}
