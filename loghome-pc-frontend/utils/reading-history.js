import { readingToken } from '~/plugins/api/reading'
import { asList, uniqueWorks } from './reading-discovery'

export function readingAccountKey(token = readingToken()) {
  if (!token) return 'guest'
  let hash = 2166136261
  for (const character of token) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16)
}
export function historyKey(token = readingToken()) { return `loghome_pc_history_${readingAccountKey(token)}` }
export function progressKey(novelId, token = readingToken()) { return `loghome_pc_progress_${readingAccountKey(token)}_${novelId}` }
function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback } catch (_) { return fallback }
}
export function localReadingHistory(token = readingToken()) {
  // Legacy records have no account identity; expose them only to guests.
  return uniqueWorks(asList(read(historyKey(token), token ? [] : read('loghomeReaderHistory', []))).slice().reverse())
}
export function localReadingProgress(novelId, token = readingToken()) {
  const scoped = read(progressKey(novelId, token), null)
  if (scoped || token) return scoped
  const manga = read(`MangaHistory_${novelId}`, null)
  return manga || { last_article_chapter: Number(read(`ReaderHistory_${novelId}`, 0)) || 0 }
}
export function recordLocalReading(work, progress = {}) {
  const token = readingToken(), key = historyKey(token)
  const history = localReadingHistory(token).filter(book => Number(book.novel_id) !== Number(work.novel_id)).reverse()
  const previous = localReadingProgress(work.novel_id, token) || {}
  const existing = localReadingHistory(token).find(book => book.novel_id === Number(work.novel_id))
  const record = { ...work, ...previous, ...progress, last_read_time: progress.last_article_id || !existing ? new Date().toISOString() : existing.last_read_time }
  history.push(record)
  try {
    localStorage.setItem(key, JSON.stringify(history.slice(-100)))
    if (progress.last_article_id) localStorage.setItem(progressKey(work.novel_id, token), JSON.stringify({ ...progress, last_read_time: record.last_read_time }))
  } catch (_) {}
}
