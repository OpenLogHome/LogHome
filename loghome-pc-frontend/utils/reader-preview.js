import { readingAccountKey } from './reading-history'

export const PREVIEW_PREFIX = 'loghome:reader:preview:'
export const PREVIEW_MAX_AGE = 24 * 60 * 60 * 1000
const MAX_BYTES = 8 * 1024 * 1024
export function normalizePreview(value) {
  if (!value || !value.article || typeof value.article !== 'object' || !value.novel || typeof value.novel !== 'object') throw new Error('预览数据不完整')
  const article = JSON.parse(JSON.stringify(value.article)), novel = JSON.parse(JSON.stringify(value.novel))
  if (!Number.isSafeInteger(Number(article.article_id)) || !(Number(article.article_id) > 0) || !Number.isSafeInteger(Number(novel.novel_id)) || !(Number(novel.novel_id) > 0) || Number(article.novel_id) !== Number(novel.novel_id) || !['richtext','text','worldOutline','worldVocabulary','mangaPage','mangaStrip'].includes(article.article_type)) throw new Error('预览章节不属于当前作品或类型不支持')
  if (typeof article.content !== 'string' && !Array.isArray(article.content) && (!article.content || typeof article.content !== 'object')) throw new Error('预览正文不完整')
  if (JSON.stringify({article,novel}).length > MAX_BYTES) throw new Error('预览内容过大')
  article.is_draft = 1
  return { article, novel }
}
export function clearExpiredPreviews(storage, now = Date.now()) {
  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i)
    if (!key || !key.startsWith(PREVIEW_PREFIX)) continue
    try {
      const value = JSON.parse(storage.getItem(key))
      if (!value || value.version !== 1 || !Number.isFinite(value.createdAt) || value.createdAt > now + 60000 || now - value.createdAt > PREVIEW_MAX_AGE) storage.removeItem(key)
    } catch (_) { storage.removeItem(key) }
  }
}
export function storeReaderPreview(value, environment = {}) {
  const storage = environment.storage || window.localStorage, now = environment.now == null ? Date.now() : environment.now
  const preview = normalizePreview(value)
  const key = environment.key || (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `${now.toString(36)}_${Math.random().toString(36).slice(2)}`)
  clearExpiredPreviews(storage, now)
  storage.setItem(PREVIEW_PREFIX + key, JSON.stringify({ ...preview, version: 1, createdAt: now, account: environment.account || readingAccountKey() }))
  return key
}
export function readReaderPreview(key, environment = {}) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(String(key || ''))) return null
  const storage = environment.storage || window.localStorage, now = environment.now == null ? Date.now() : environment.now
  try {
    const value = JSON.parse(storage.getItem(PREVIEW_PREFIX + key) || 'null')
    if (!value || value.version !== 1 || !Number.isFinite(value.createdAt) || value.createdAt > now + 60000 || now - value.createdAt > PREVIEW_MAX_AGE) { storage.removeItem(PREVIEW_PREFIX + key); return null }
    if (value.account !== (environment.account || readingAccountKey())) return null
    return { ...normalizePreview(value), createdAt: value.createdAt, account: value.account }
  } catch (_) { return null }
}
// Only the current editor frame at the configured origin can submit a draft.
export function trustedPreviewMessage(event, frameWindow, mobileUrl, workId) {
  if (!event || event.source !== frameWindow || !frameWindow || !event.data || event.data.type !== 'reader_preview' || event.data.source !== 'chapterEditor') return null
  try {
    if (event.origin !== new URL(mobileUrl).origin) return null
    const preview = normalizePreview(event.data.data)
    return Number(preview.novel.novel_id) === Number(workId) ? preview : null
  } catch (_) { return null }
}
