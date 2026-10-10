import { readerParagraphs } from './reader-paragraphs'

export function audioParagraphs(article) {
  return readerParagraphs(article.content, article.article_type).filter(row => row.type === 'text' && row.value.trim())
}
export function speechChunk(text, offset = 0) {
  let chunk = text.slice(offset, offset + 110)
  if (offset + chunk.length < text.length) {
    const punctuation = Math.max(chunk.lastIndexOf('。'), chunk.lastIndexOf('！'), chunk.lastIndexOf('？'), chunk.lastIndexOf('；'), chunk.lastIndexOf('，'), chunk.lastIndexOf(' '))
    if (punctuation >= 50) chunk = chunk.slice(0, punctuation + 1)
    if (/^[\uDC00-\uDFFF]/.test(text.slice(offset + chunk.length))) chunk = chunk.slice(0, -1)
  }
  return chunk
}
export function createAudioState() {
  return { visible: false, status: 'idle', error: '', notice: '', bookId: 0, bookTitle: '', cover: '', chapterId: 0, chapterTitle: '', chapters: [], chapterIndex: -1, paragraphs: [], paragraphIndex: 0, paragraphId: 0, charOffset: 0, rate: 1, voiceURI: '', voices: [], sleepUntil: 0, sleepAtChapterEnd: false, follow: true, supported: false, charactersPerSecond: 5, timingMeasured: false, resumeCandidate: null, resumeLoading: false, storageError: '' }
}

// Playback owns its queue independently of Nuxt page instances, like the mobile native player.
export class ReaderAudio {
  constructor(state, environment) {
    this.state = state; this.env = environment; this.generation = 0; this.loadVersion = 0; this.cache = new Map(); this.listeners = new Set(); this.sleepTimer = null; this.timings = new Map()
    state.supported = Boolean(environment.synthesis && environment.Utterance)
    this.updateVoices = this.updateVoices.bind(this)
    if (state.supported) { this.updateVoices(); environment.synthesis.addEventListener('voiceschanged', this.updateVoices) }
  }
  updateVoices() {
    const voices = this.env.synthesis.getVoices()
    this.state.voices = voices.map(voice => ({ name: voice.name, lang: voice.lang, voiceURI: voice.voiceURI, local: voice.localService }))
    if (!voices.some(voice => voice.voiceURI === this.state.voiceURI)) {
      const selected = voices.find(voice => /^zh[-_]CN$/i.test(voice.lang)) || voices.find(voice => /^zh/i.test(voice.lang)) || voices.find(voice => voice.default) || voices[0]
      this.state.voiceURI = selected ? selected.voiceURI : ''
    }
    const speed = this.timings.get(this.state.voiceURI)
    this.state.charactersPerSecond = speed || 5; this.state.timingMeasured = Boolean(speed)
  }
  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  progress() { this.listeners.forEach(listener => listener(this.state)) }
  interrupt() { this.generation++; if (this.state.supported) this.env.synthesis.cancel() }
  async open(book, chapters, article, paragraphId) {
    const ordered = chapters.filter(row => row.article_type !== 'spliter').map(row => ({ article_id: Number(row.article_id), title: row.title }))
    const sameQueue = this.state.visible && this.account === this.env.token() && Number(book.novel_id) === this.state.bookId && ordered.length === this.state.chapters.length && ordered.every((row,index) => row.article_id === this.state.chapters[index].article_id)
    if (sameQueue && paragraphId == null) { this.state.visible = true; this.progress(); return }
    if (sameQueue && Number(article.article_id) === this.state.chapterId && paragraphId != null) {
      const index = this.state.paragraphs.findIndex(row => Number(row.id) === Number(paragraphId))
      if (index >= 0) { this.seekParagraph(index, true); return }
    }
    this.interrupt(); this.loadVersion++; this.clearSleep(); this.cache.clear(); this.failedChapterIndex = null
    this.account = this.env.token()
    Object.assign(this.state, { visible: true, status: 'ready', error: '', notice: '', bookId: Number(book.novel_id), bookTitle: book.name, cover: book.picUrl || '', chapters: ordered, paragraphs: [], paragraphIndex: 0, paragraphId: 0, charOffset: 0 })
    if (!this.state.supported) { this.state.status = 'error'; this.state.error = '此浏览器未提供语音合成，请使用支持语音合成的桌面浏览器。'; return }
    if (Number(article.novel_id) !== this.state.bookId || !ordered.some(row => row.article_id === Number(article.article_id)) || (!this.env.privatePlayback && Number(article.is_draft)===1)) { this.state.status = 'error'; this.state.error = '章节不属于当前公开播放列表。'; return }
    this.cache.set(Number(article.article_id), article)
    this.setArticle(article, paragraphId)
    if (!this.state.paragraphs.length) { this.state.status = 'error'; this.state.error = '本章没有可朗读的正文。'; return }
    if (paragraphId != null) this.play()
  }
  setArticle(article, paragraphId) {
    this.currentArticle = article
    const paragraphs = audioParagraphs(article)
    const target = paragraphs.findIndex(row => Number(row.id) === Number(paragraphId))
    Object.assign(this.state, { chapterId: Number(article.article_id), chapterTitle: article.title, chapterIndex: this.state.chapters.findIndex(row => row.article_id === Number(article.article_id)), paragraphs, paragraphIndex: Math.max(0, target), charOffset: 0 })
    this.state.paragraphId = paragraphs[this.state.paragraphIndex] ? paragraphs[this.state.paragraphIndex].id : 0
    this.progress()
  }
  async chapter(index, autoplay = true) {
    if (index < 0 || index >= this.state.chapters.length) return
    const version = ++this.loadVersion, token = this.env.token(), id = this.state.chapters[index].article_id
    this.failedChapterIndex = index
    this.interrupt(); this.state.status = 'loading'; this.state.error = ''
    try {
      let article = this.cache.get(id)
      if (!article) { const result = await this.env.article(id); article = result && result[0] }
      if (version !== this.loadVersion) return
      if (token !== this.env.token()) { this.close(); return }
      if (!article || Number(article.article_id) !== id || Number(article.novel_id) !== this.state.bookId || (!this.env.privatePlayback && Number(article.is_draft) === 1)) throw new Error('章节不可播放或已失效')
      this.cache.set(id, article)
      this.failedChapterIndex = null
      // Bound the queue's memory without dropping the current article.
      if (this.cache.size > 4) this.cache.delete(this.cache.keys().next().value)
      this.setArticle(article)
      this.state.status = 'ready'
      if (!this.state.paragraphs.length) {
        if (autoplay && index + 1 < this.state.chapters.length) return this.chapter(index + 1, true)
        this.state.status = 'error'; this.state.error = '本章没有可朗读的正文。'; return
      }
      if (autoplay) this.play()
    } catch (error) {
      if (version !== this.loadVersion) return
      if (token !== this.env.token()) { this.close(); return }
      this.state.status = 'error'; this.state.error = error.message || '章节加载失败，请重试。'
      this.progress()
    }
  }
  play() {
    if (!this.state.supported || !this.state.paragraphs.length || this.state.status === 'loading') return
    if (this.checkSleep()) return
    this.interrupt(); this.state.error = ''; this.state.notice = ''; this.state.status = 'playing'
    if (this.env.synthesis.paused && this.env.synthesis.resume) this.env.synthesis.resume()
    this.speak(this.generation)
  }
  speak(generation) {
    if (generation !== this.generation || this.state.status !== 'playing') return
    if (this.account !== this.env.token()) { this.close(); return }
    if (this.checkSleep()) return
    const paragraph = this.state.paragraphs[this.state.paragraphIndex]
    if (!paragraph) return this.finishChapter()
    this.state.paragraphId = paragraph.id; this.progress()
    const offset = Math.max(0, Math.min(Math.floor(this.state.charOffset), paragraph.value.length)), text = speechChunk(paragraph.value, offset)
    if (!text) { this.advance(); return }
    const utterance = new this.env.Utterance(text)
    const voices = this.env.synthesis.getVoices()
    utterance.voice = voices.find(voice => voice.voiceURI === this.state.voiceURI) || null
    utterance.lang = utterance.voice ? utterance.voice.lang : 'zh-CN'; utterance.rate = this.state.rate
    this.utterance = utterance // Retain it for browsers that otherwise collect active utterances.
    let completed = false
    const active = () => !completed && generation===this.generation && this.utterance===utterance && this.state.status==='playing'
    const startedAt = this.env.now()
    utterance.onboundary = event => { if(!active())return; if(this.account!==this.env.token()){this.close();return} if(Number.isFinite(event.charIndex)) { this.state.charOffset = offset + Math.min(text.length, Math.max(0, Math.floor(event.charIndex))); this.progress() } }
    utterance.onend = event => {
      if (!active()) return
      if (this.account !== this.env.token()) { this.close(); return }
      completed = true
      // Some engines report an immediate end without speaking. Never mark a long
      // passage as read or cascade through the entire book on that callback.
      if (text.replace(/[^A-Za-z0-9\u3400-\u9fff]/g,'').length >= 20 && event && Number.isFinite(event.elapsedTime) && event.elapsedTime < .05 && this.env.now()-startedAt < 100) {
        this.state.status='error'; this.state.error='语音引擎未正常播放，请更换音色后重试。'; this.progress(); return
      }
      this.measureTiming(text.length, event && event.elapsedTime, utterance.rate)
      this.state.charOffset = offset + text.length
      if (this.state.charOffset >= paragraph.value.length) this.advance()
      else this.speak(generation)
    }
    utterance.onerror = event => {
      if (!active()) return
      if (this.account !== this.env.token()) { this.close(); return }
      completed = true
      if (['canceled', 'interrupted'].includes(event.error)) { this.suspend('语音播放被中断，点击播放继续。'); return }
      this.state.status = 'error'; this.state.error = event.error === 'not-allowed' ? '浏览器阻止了自动播放，请点击播放继续。' : '语音播放失败，请更换音色或重试。'
      this.progress()
    }
    this.env.synthesis.speak(utterance)
  }
  advance() {
    this.state.paragraphIndex++; this.state.charOffset = 0
    if (this.state.paragraphIndex >= this.state.paragraphs.length) this.finishChapter()
    else this.speak(this.generation)
  }
  finishChapter() {
    if (this.state.sleepAtChapterEnd) { this.state.paragraphIndex = Math.max(0,this.state.paragraphs.length-1); this.state.charOffset = this.state.paragraphs[this.state.paragraphIndex]?.value.length || 0; this.clearSleep(); this.pause(); return }
    if (this.state.chapterIndex + 1 < this.state.chapters.length) this.chapter(this.state.chapterIndex + 1)
    else { this.state.status = 'ended'; this.state.charOffset = 0; this.state.paragraphIndex = Math.max(0, this.state.paragraphs.length - 1); this.progress() }
  }
  pause() { if(this.state.status==='loading')this.loadVersion++; this.interrupt(); this.state.status = 'paused'; this.progress() }
  suspend(message = '页面暂停后已保留听书位置，点击播放继续。') { if(!this.state.visible || !['playing','loading'].includes(this.state.status))return; this.pause(); this.state.notice=message; this.progress() }
  wake() { if(this.account!==this.env.token()){this.close();return} if(this.checkSleep())return; if(this.state.status==='playing' && (!this.env.synthesis.speaking || this.env.synthesis.paused))this.suspend() }
  toggle() {
    if (this.state.status === 'playing') return this.pause()
    if (this.state.status === 'loading') return
    if (this.state.status === 'ended') { this.state.paragraphIndex = 0; this.state.charOffset = 0 }
    if (this.failedChapterIndex != null) return this.chapter(this.failedChapterIndex)
    this.play()
  }
  seekParagraph(index, autoplay = this.state.status === 'playing') {
    if (!this.state.paragraphs.length || this.state.status === 'loading') return
    this.interrupt(); this.state.paragraphIndex = Math.max(0, Math.min(this.state.paragraphs.length - 1, Math.floor(Number(index)) || 0)); this.state.charOffset = 0
    this.state.paragraphId = this.state.paragraphs[this.state.paragraphIndex].id; this.state.status = 'paused'; this.progress()
    if (autoplay) this.play()
  }
  seekRelative(seconds) {
    const playing = this.state.status === 'playing'
    if (!this.state.paragraphs.length || this.state.status === 'loading') return
    if (!Number.isFinite(Number(seconds))) return
    let remaining = Math.round(Number(seconds) * this.state.charactersPerSecond * this.state.rate), index = Math.min(this.state.paragraphIndex, this.state.paragraphs.length - 1), offset = this.state.charOffset
    while (remaining > 0) {
      const available = this.state.paragraphs[index].value.length - offset
      if (remaining < available || index === this.state.paragraphs.length - 1) { offset = Math.min(this.state.paragraphs[index].value.length - 1, offset + remaining); break }
      remaining -= available; index++; offset = 0
    }
    while (remaining < 0) {
      if (-remaining <= offset || index === 0) { offset = Math.max(0, offset + remaining); break }
      remaining += offset; index--; offset = this.state.paragraphs[index].value.length
    }
    this.seekParagraph(index, false); this.state.charOffset = offset
    if (/^[\uDC00-\uDFFF]/.test(this.state.paragraphs[index].value.slice(offset))) this.state.charOffset = Math.max(0,offset-1)
    this.progress()
    if (playing) this.play()
  }
  measureTiming(characters, seconds, rate) {
    if (!Number.isFinite(seconds) || seconds < .5 || characters < 10 || seconds > 300) return
    const measured = characters / (seconds * rate)
    if (measured < .5 || measured > 30) return
    const old = this.timings.get(this.state.voiceURI)
    const speed = old ? old * .75 + measured * .25 : measured
    this.timings.set(this.state.voiceURI,speed)
    this.state.charactersPerSecond = speed; this.state.timingMeasured = true
  }
  configure(patch) {
    if (patch.rate != null) this.state.rate = Math.max(.5, Math.min(2, Number(patch.rate) || 1))
    if (patch.voiceURI != null && (!this.state.voices.length || this.state.voices.some(voice=>voice.voiceURI===String(patch.voiceURI)))) this.state.voiceURI = String(patch.voiceURI)
    const speed = this.timings.get(this.state.voiceURI)
    this.state.charactersPerSecond = speed || 5; this.state.timingMeasured = Boolean(speed)
    if (this.state.status === 'playing') this.play()
  }
  setSleep(minutes) {
    this.clearSleep()
    if (minutes === 'chapter') { this.state.sleepAtChapterEnd = true; return }
    const duration = Number(minutes)
    if (!Number.isFinite(duration) || duration <= 0) return
    this.state.sleepUntil = this.env.now() + duration * 60000
    this.sleepTimer = this.env.setTimeout(() => { this.clearSleep(); if(['playing','loading'].includes(this.state.status))this.pause(); this.state.notice='定时听书已结束。'; this.progress() }, duration * 60000)
  }
  checkSleep() { if(!this.state.sleepUntil || this.env.now()<this.state.sleepUntil)return false; this.clearSleep(); if(['playing','loading'].includes(this.state.status))this.pause(); this.state.notice='定时听书已结束。'; this.progress(); return true }
  clearSleep() { if (this.sleepTimer) this.env.clearTimeout(this.sleepTimer); this.sleepTimer = null; this.state.sleepUntil = 0; this.state.sleepAtChapterEnd = false }
  close() { this.loadVersion++; this.interrupt(); this.clearSleep(); this.state.visible = false; this.state.status = 'idle'; this.state.notice=''; this.cache.clear(); this.progress() }
  destroy() { this.close(); if (this.state.supported) this.env.synthesis.removeEventListener('voiceschanged', this.updateVoices); this.listeners.clear() }
}
