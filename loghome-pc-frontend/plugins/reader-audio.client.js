import Vue from 'vue'
import { ReaderAudio, createAudioState } from '~/utils/reader-audio'
import { readingToken } from '~/plugins/api/reading'
import { recordLocalReading } from '~/utils/reading-history'
import { audioResumeKey, readAudioResume, saveAudioResume, restoreAudioOffset } from '~/utils/reader-audio-resume'

export default ({ app }, inject) => {
  const state = Vue.observable(createAudioState())
  const player = new ReaderAudio(state, { synthesis:window.speechSynthesis, Utterance:window.SpeechSynthesisUtterance, article:id=>app.$api.reader.article(id), token:readingToken, now:Date.now, setTimeout:(fn,ms)=>window.setTimeout(fn,ms), clearTimeout:id=>window.clearTimeout(id) })
  let account = readingToken(), lastProgress = '', lastSaved = 0, lastSnapshot = 0, resumeVersion = 0, disposing = false
  const originalOpen = player.open.bind(player), originalClose = player.close.bind(player)
  const loadResume = () => {
    try { state.resumeCandidate = readAudioResume(localStorage,account); state.storageError = '' }
    catch (_) { state.resumeCandidate = null; state.storageError = '本机听书位置暂时无法读取。' }
  }
  const snapshot = (force = false) => {
    if (account !== readingToken() || player.account !== account || !state.visible || state.status==='ended' || (!force && Date.now()-lastSnapshot<3000)) return
    try { saveAudioResume(localStorage,account,player); lastSnapshot = Date.now(); state.storageError = '' }
    catch (_) { state.storageError = '本机听书位置未能保存，刷新后可能无法恢复。' }
  }
  const removeResume = () => {
    state.resumeCandidate = null
    try { localStorage.removeItem(audioResumeKey(account)); state.storageError = '' }
    catch (_) { state.storageError = '本机听书位置未能清除。' }
  }
  loadResume()
  player.subscribe(current => {
    if (current.status === 'ended') removeResume()
    else snapshot(current.status !== 'playing')
    const key = `${current.chapterId}:${current.paragraphId}`
    if (!current.visible || current.status !== 'playing' || !current.speechStarted || key === lastProgress || account !== readingToken()) return
    lastProgress = key
    const article = player.currentArticle
    if (article && player.book) {
      recordLocalReading(player.book, { last_article_id:current.chapterId, last_article_chapter:Number(article.article_chapter)||0, last_paragraph_id:current.paragraphId, last_char_offset:current.charOffset })
      if (Date.now()-lastSaved>=10000) { lastSaved=Date.now(); app.$api.reading.saveProgress({novel_id:current.bookId,article_id:current.chapterId}).catch(()=>{}) }
    }
  })
  player.open = (...args) => {
    resumeVersion++; state.resumeLoading=false; state.resumeCandidate=null
    player.book=args[0]; lastProgress=''; lastSaved=0; lastSnapshot=0
    return originalOpen(...args)
  }
  player.dismissResume = () => { resumeVersion++; state.resumeLoading=false; removeResume() }
  player.close = () => { resumeVersion++; state.resumeLoading=false; if(!disposing && account===readingToken())removeResume(); originalClose() }
  player.resumeLast = async () => {
    checkAccount()
    const candidate=state.resumeCandidate
    if (!candidate || state.resumeLoading) return
    const version=++resumeVersion, token=readingToken()
    state.resumeLoading=true; state.error=''
    try {
      // Only position metadata is stored. Read public book/catalog/body again before playback.
      const [books,chapters,articles] = await Promise.all([app.$api.reader.book(candidate.bookId),app.$api.reader.chapters(candidate.bookId),app.$api.reader.article(candidate.chapterId)])
      if (version!==resumeVersion || token!==readingToken()) return
      const book=books&&books[0], article=articles&&articles[0]
      if (!book || Number(book.novel_id)!==candidate.bookId || !article || Number(article.article_id)!==candidate.chapterId || Number(article.novel_id)!==candidate.bookId || Number(article.is_draft)===1 || !Array.isArray(chapters) || !chapters.some(row=>Number(row.article_id)===candidate.chapterId && Number(row.is_draft)!==1)) throw Error('上次听书的作品或章节已不可阅读。')
      player.book=book; lastProgress=''; lastSaved=0; lastSnapshot=0
      await originalOpen(book,chapters,article,null)
      if (version!==resumeVersion || token!==readingToken()) return
      if (state.status==='error') throw Error(state.error)
      const unchanged=restoreAudioOffset(player,candidate)
      state.resumeCandidate=null; player.play()
      if(!unchanged){state.notice='正文已更新，从对应段落开头继续。';player.progress()}
    } catch(error) { if(version===resumeVersion && token===readingToken())state.error=error.message||'听书位置恢复失败，请重试。' }
    finally { if(version===resumeVersion)state.resumeLoading=false }
  }
  player.saveSettings = () => {
    try { localStorage.setItem('loghome:reader:audio',JSON.stringify({rate:state.rate,voiceURI:state.voiceURI,follow:state.follow})); state.storageError='' }
    catch (_) { state.storageError='听书偏好未能保存。' }
  }
  try { const saved=JSON.parse(localStorage.getItem('loghome:reader:audio')||'{}'); player.configure({rate:saved.rate,voiceURI:saved.voiceURI == null ? state.voiceURI : saved.voiceURI}); state.follow=saved.follow!==false } catch (_) {}
  const checkAccount = () => {
    const token=readingToken()
    if(token!==account){resumeVersion++;state.resumeLoading=false;originalClose();account=token;lastProgress='';lastSaved=0;lastSnapshot=0;loadResume()}
  }
  const storage = event => { if(event.key==='token')checkAccount() }
  const wake = () => { checkAccount(); if(state.visible)player.wake() }
  const freeze = () => { player.suspend(); snapshot(true) }
  const pagehide = () => { player.suspend(); snapshot(true) }
  const visibility = () => { if(document.visibilityState==='hidden')snapshot(true);else wake() }
  window.addEventListener('storage',storage);window.addEventListener('focus',wake);window.addEventListener('pageshow',wake);window.addEventListener('pagehide',pagehide)
  document.addEventListener('visibilitychange',visibility);document.addEventListener('freeze',freeze);document.addEventListener('resume',wake)
  const removeRouteHook=app.router.afterEach(checkAccount)
  if ('mediaSession' in navigator) {
    const session=navigator.mediaSession
    const actions={play:()=>{if(state.status!=='playing')player.toggle()},pause:()=>player.pause(),previoustrack:()=>player.chapter(state.chapterIndex-1),nexttrack:()=>player.chapter(state.chapterIndex+1),seekbackward:detail=>player.seekRelative(-(detail.seekOffset||15)),seekforward:detail=>player.seekRelative(detail.seekOffset||15),stop:()=>player.close()}
    Object.keys(actions).forEach(action=>{try{session.setActionHandler(action,actions[action])}catch(_){}})
    let metadataChapter=0
    player.subscribe(current=>{
      try {
        session.playbackState=current.status==='playing'?'playing':current.visible?'paused':'none'
        if(current.visible && current.chapterId!==metadataChapter && window.MediaMetadata){metadataChapter=current.chapterId;session.metadata=new window.MediaMetadata({title:current.chapterTitle,album:current.bookTitle,artwork:current.cover&&/^https?:\/\//i.test(current.cover)?[{src:current.cover}]:[]})}
        if(!current.visible){session.metadata=null;metadataChapter=0}
      } catch (_) {}
    })
  }
  if(module.hot)module.hot.dispose(()=>{
    snapshot(true);disposing=true;player.destroy();removeRouteHook()
    window.removeEventListener('storage',storage);window.removeEventListener('focus',wake);window.removeEventListener('pageshow',wake);window.removeEventListener('pagehide',pagehide)
    document.removeEventListener('visibilitychange',visibility);document.removeEventListener('freeze',freeze);document.removeEventListener('resume',wake)
  })
  inject('readerAudio',player)
}
