import { readingAccountKey } from './reading-history'

export function audioResumeKey(token) {
  let account = readingAccountKey(token)
  // Stable through JWT renewal; this namespace never replaces server authorization.
  try {
    const value = String(token || '').split('.')[1]
    if (value && typeof atob === 'function') {
      const payload = JSON.parse(atob(value.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(value.length/4)*4,'=')))
      const id = Number(payload.user_id || payload.id)
      if (Number.isSafeInteger(id) && id > 0) account = `user-${id}`
    }
  } catch (_) {}
  return `loghome_pc_audio_resume_${account}`
}
export function audioTextSignature(text) {
  let hash = 2166136261
  const value = String(text)
  for (let index=0;index<value.length;index++) hash = Math.imul(hash ^ value.charCodeAt(index),16777619)
  return (hash >>> 0).toString(16)
}
export function readAudioResume(storage, token, now = Date.now()) {
  let item
  try { item = JSON.parse(storage.getItem(audioResumeKey(token)) || 'null') } catch (error) { if(error instanceof SyntaxError)return null;throw error }
  if (!item || item.version !== 1 || !['bookId','chapterId','paragraphId'].every(key=>Number.isSafeInteger(item[key]) && item[key]>0) || !Number.isSafeInteger(item.charOffset) || item.charOffset<0 || item.charOffset>1000000 || !Number.isFinite(item.savedAt) || now-item.savedAt>30*86400000 || item.savedAt>now+60000 || typeof item.signature!=='string') return null
  return { ...item, bookTitle:String(item.bookTitle || '').slice(0,200), chapterTitle:String(item.chapterTitle || '').slice(0,200) }
}
export function saveAudioResume(storage, token, player, now = Date.now()) {
  const state = player.state, paragraph = state.paragraphs[state.paragraphIndex]
  if (!state.visible || state.status === 'ended' || !paragraph || player.env.privatePlayback) return null
  const item = { version:1, bookId:state.bookId, chapterId:state.chapterId, paragraphId:Number(paragraph.id), charOffset:Math.max(0,Math.floor(state.charOffset)), signature:audioTextSignature(paragraph.value), bookTitle:state.bookTitle, chapterTitle:state.chapterTitle, savedAt:now }
  storage.setItem(audioResumeKey(token),JSON.stringify(item))
  return item
}
export function restoreAudioOffset(player, item) {
  const state = player.state
  const index = state.paragraphs.findIndex(row=>Number(row.id)===item.paragraphId)
  player.seekParagraph(index < 0 ? 0 : index,false)
  const paragraph = state.paragraphs[state.paragraphIndex]
  const unchanged = paragraph && index >= 0 && audioTextSignature(paragraph.value) === item.signature
  if (unchanged) {
    state.charOffset = Math.min(item.charOffset,paragraph.value.length)
    if (/^[\uDC00-\uDFFF]/.test(paragraph.value.slice(state.charOffset))) state.charOffset = Math.max(0,state.charOffset-1)
  }
  return Boolean(unchanged)
}
