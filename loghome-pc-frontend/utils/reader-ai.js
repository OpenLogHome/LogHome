import { readingToken } from '~/plugins/api/reading'
import { readingAccountKey } from './reading-history'

export const AI_PREFERENCE_KEY = 'LogHomeAiAssistanceDisabled'
export const AI_PREFERENCE_EVENT = 'loghome-ai-preference'
export function readerAiDisabled() {
  try { return typeof localStorage !== 'undefined' && localStorage.getItem(AI_PREFERENCE_KEY) === 'true' } catch (_) { return true }
}
export function setReaderAiDisabled(disabled) {
  localStorage.setItem(AI_PREFERENCE_KEY, disabled ? 'true' : 'false')
  window.dispatchEvent(new Event(AI_PREFERENCE_EVENT))
}
export function aiStorageKey(token) {
  // JWT account id remains stable when heartbeat rotates the credential. This is
  // only a local storage namespace; authorization is always enforced by the API.
  let account = readingAccountKey(token)
  try {
    if (token && token.split('.').length === 3) {
      const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const id = Number(JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '='))).id)
      if (Number.isSafeInteger(id) && id > 0) account = `user-${id}`
    }
  } catch (_) {}
  return `loghome_pc_reader_ai_v1_${account}`
}
export function aiId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}` }
const positive = value => Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : 0
const count = value => Math.max(0, Number(value) || 0)
export function stripAiCitations(text) { return String(text || '').replace(/\[\[cite:[^\]]*\]\]/g, '').trim() }
export function aiNovel(raw = {}, fallback = {}) {
  return { novelId: positive(raw.novelId || raw.novel_id) || positive(fallback.novelId || fallback.novel_id),
    novelName: String(raw.novelName || raw.novel_name || raw.name || fallback.novelName || fallback.name || '未命名作品'),
    authorName: String(raw.authorName || raw.author_name || ''), description: String(raw.description || raw.content || '') }
}
export function aiContext(raw = {}) {
  const usedTokens = count(raw.usedTokens ?? raw.used_tokens), limitTokens = count(raw.limitTokens ?? raw.limit_tokens) || 200000
  return { usedTokens, limitTokens, thresholdTokens: count(raw.thresholdTokens ?? raw.threshold_tokens) || limitTokens * .8,
    percent: Math.min(100, Math.max(0, Number(raw.percent ?? (usedTokens / limitTokens * 100)) || 0)),
    compressed: raw.compressed === true, compressedCount: count(raw.compressedCount ?? raw.compressed_count) }
}
export function aiIndex(raw = {}) {
  const total = count(raw.totalChapters ?? raw.total_chapters), indexed = count(raw.indexedSummaryChapters ?? raw.indexed_summary_chapters)
  return { total, indexed, pending: count(raw.pendingSummaryChapters ?? raw.pending_summary_chapters),
    percent: Math.min(100, Math.max(0, Number(raw.percent ?? (total ? indexed / total * 100 : 0)) || 0)),
    queueStatus: String(raw.queueStatus || raw.queue_status || ''), queue: raw.queue || null }
}
export function aiCitationId(value) {
  const source = String(value || '').trim(), matched = source.match(/a(\d+)(?:p(\d+))?/i)
  if (matched) return `a${matched[1]}${matched[2] ? `p${matched[2]}` : ''}`
  if (/^\d+$/.test(source)) return `a${source}`
  return source.replace(/[^\w-]/g, '')
}
export function aiCitations(items) {
  return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object').map((item, index) => ({
    id: aiCitationId(item.citation_id || item.id) || `citation-${index + 1}`,
    articleId: positive(item.article_id || item.articleId), paragraphId: positive(item.paragraph_id || item.paragraphId),
    novelId: positive(item.novel_id || item.novelId), title: String(item.title || '引用章节'),
    chapter: positive(item.chapter), snippet: String(item.snippet || ''), source: String(item.source || ''),
    displayIndex: positive(item.displayIndex || item.display_index) || index + 1
  }))
}
export function aiCitationUrl(item) {
  return item.articleId ? `/article/${item.articleId}${item.paragraphId ? `?paragraphId=${item.paragraphId}` : ''}` : ''
}
export function aiMessage(role, content = '') {
  return { id: aiId('msg'), role: role === 'user' ? 'user' : 'assistant', content: String(content), citations: [], thinkingSteps: [], currentThinkingText: '', error: '' }
}
export function aiSession(book) {
  return { id: aiId('session'), novelId: positive(book.novel_id || book.novelId), novelName: book.name || book.novelName,
    title: '新会话', chosen: false, createdAt: Date.now(), updatedAt: Date.now(), activeNovel: aiNovel(book), draft: '', mode: 'fast',
    context: aiContext(), pendingTask: null, messages: [] }
}
export function aiPayload(session, task = session.pendingTask) {
  return { novel_id: session.novelId, active_novel_id: task.activeNovelId, retriever_mode: task.mode,
    session_id: session.id, message_id: task.messageId, task_id: task.id,
    resume_from_event_id: task.cursor, messages: task.messages }
}
export function createAiTask(session, message) {
  return { id: `reader-ai:${session.novelId}:${session.id}:${message.id}:${aiId('task')}`.slice(0, 160),
    messageId: message.id, activeNovelId: session.activeNovel.novelId, mode: session.mode, cursor: 0, status: 'running',
    // The server validates this immutable input on resume, even after active_novel changes.
    messages: session.messages.filter(item => item.id !== message.id).map(item => ({ role: item.role, content: stripAiCitations(item.content) })).filter(item => item.content) }
}
function thought(message, text) {
  const value = String(text || '').trim()
  if (value && message.thinkingSteps[message.thinkingSteps.length - 1] !== value) message.thinkingSteps.push(value)
  message.thinkingSteps = message.thinkingSteps.slice(-80)
}
function commitThought(message) { thought(message, message.currentThinkingText); message.currentThinkingText = '' }
function eventText(event) {
  const value = event.message ?? event.text ?? event.content ?? event.delta ?? event.reasoning ?? event.thinking ?? ''
  return typeof value === 'object' && value ? String(value.text || value.content || value.message || '') : String(value)
}
export function applyAiEvent(session, event) {
  const task = session.pendingTask
  if (!task || !event || typeof event !== 'object') return false
  if ((event.task_id && event.task_id !== task.id) || (event.message_id && event.message_id !== task.messageId) || (event.session_id && event.session_id !== session.id)) return false
  const message = session.messages.find(item => item.id === task.messageId)
  if (!message) return false
  if (event.type === 'task') {
    if (event.created === true && task.cursor > 0) {
      message.content = ''; message.citations = []; message.thinkingSteps = []; message.currentThinkingText = ''; message.error = ''
      session.context = aiContext(); session.activeNovel = aiNovel({ novel_id: task.activeNovelId }, session.activeNovel); task.cursor = 0
    }
    task.status = String(event.status || 'running')
    return true
  }
  const cursor = positive(event.event_id)
  if (cursor && cursor <= task.cursor) return false
  // Commit cursor and content in the same persisted snapshot; replay cannot duplicate text.
  if (cursor) task.cursor = cursor
  if (event.type === 'status') { commitThought(message); message.currentThinkingText = eventText(event) }
  else if (['trace', 'tool', 'tool_call', 'tool_result', 'reasoning', 'thinking', 'reasoning_summary', 'thinking_summary'].includes(event.type)) thought(message, eventText(event))
  else if (['reasoning_delta', 'thinking_delta', 'thought_delta'].includes(event.type)) message.currentThinkingText += eventText(event)
  else if (['reasoning_done', 'thinking_done', 'thought_done'].includes(event.type)) commitThought(message)
  else if (event.type === 'context_usage') session.context = aiContext(event)
  else if (event.type === 'active_novel') session.activeNovel = aiNovel(event, session.activeNovel)
  else if (event.type === 'citations') message.citations = aiCitations(event.items)
  else if (event.type === 'delta') message.content += String(event.content || '')
  else if (event.type === 'replace') message.content = String(event.content || '')
  else if (event.type === 'error') { commitThought(message); message.error = eventText(event) || '回复生成失败'; session.pendingTask = null }
  else if (event.type === 'done') { commitThought(message); session.pendingTask = null }
  return true
}
export function loadAiHistory(token) {
  try {
    const raw = JSON.parse(localStorage.getItem(aiStorageKey(token)) || '[]')
    return (Array.isArray(raw) ? raw : []).filter(session => session && positive(session.novelId) && typeof session.id === 'string').map(session => {
      const normalized = { ...aiSession({ novel_id: session.novelId, name: session.novelName }), ...session, context: aiContext(session.context), activeNovel: aiNovel(session.activeNovel, { novel_id: session.novelId, name: session.novelName }), mode: session.mode === 'deep' ? 'deep' : 'fast' }
      normalized.messages = (Array.isArray(session.messages) ? session.messages : []).filter(item => item && typeof item.id === 'string').map(item => ({ ...aiMessage(item.role), ...item, content: String(item.content || ''), thinkingSteps: Array.isArray(item.thinkingSteps) ? item.thinkingSteps.map(String).slice(-80) : [], currentThinkingText: String(item.currentThinkingText || ''), citations: aiCitations(Array.isArray(item.citations) ? item.citations.map(citation => ({ ...citation, citation_id: citation.id })) : []) }))
      const task = session.pendingTask
      normalized.pendingTask = task && typeof task.id === 'string' && positive(task.activeNovelId) && normalized.messages.some(item => item.id === task.messageId) && Array.isArray(task.messages) ? { ...task, cursor: count(task.cursor), mode: task.mode === 'deep' ? 'deep' : 'fast' } : null
      return normalized
    }).sort((a, b) => b.updatedAt - a.updatedAt)
  } catch (_) { return [] }
}
export function saveAiHistory(token, sessions) {
  // Storage failure is surfaced; no silent successful draft/history save.
  localStorage.setItem(aiStorageKey(token), JSON.stringify(sessions))
}
export function aiBaseUrl() { return String(process.env.readerAiUrl || 'https://ai.loghome.ink').replace(/\/$/, '') }
async function checkedAiResponse(response) {
  if (response.ok) return response
  let payload = {}; try { payload = await response.json() } catch (_) {}
  const error = new Error(payload.msg || payload.message || `AI 服务暂不可用（${response.status}）`)
  error.code = payload.code || ''; error.status = response.status; throw error
}
export async function fetchAiIndex(novelId, { token = readingToken(), signal } = {}) {
  const response = await checkedAiResponse(await fetch(`${aiBaseUrl()}/library/reader_novel_summary_index_status?novel_id=${positive(novelId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {}, signal }))
  const payload = await response.json(); return aiIndex(payload.data || payload)
}
export async function streamReaderAi(payload, { token = readingToken(), signal, onEvent, current = () => true } = {}) {
  if (!token) throw new Error('请先登录后再提问')
  if (readerAiDisabled()) throw new Error('AI 辅助已关闭，请在账号设置中开启')
  const response = await checkedAiResponse(await fetch(`${aiBaseUrl()}/library/reader_novel_ai_chat_stream`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/x-ndjson' }, body: JSON.stringify(payload), signal
  }))
  const deliver = line => {
    if (!line.trim() || !current()) return
    let event; try { event = JSON.parse(line) } catch (_) { throw new Error('AI 回复格式异常，可继续接收重试') }
    onEvent(event)
  }
  if (!response.body || !response.body.getReader) { (await response.text()).split('\n').forEach(deliver); return }
  const reader = response.body.getReader(), decoder = new TextDecoder('utf-8')
  let buffer = ''
  try {
    while (current()) {
      const chunk = await reader.read()
      if (chunk.done) break
      buffer += decoder.decode(chunk.value, { stream: true })
      let end
      while ((end = buffer.indexOf('\n')) !== -1) { deliver(buffer.slice(0, end)); buffer = buffer.slice(end + 1) }
    }
    if (current()) { buffer += decoder.decode(); if (buffer.trim()) deliver(buffer) }
  } finally { try { await reader.cancel() } catch (_) {}; reader.releaseLock() }
}
