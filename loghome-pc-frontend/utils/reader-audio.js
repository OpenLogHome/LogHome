import { readerParagraphs } from './reader-paragraphs'
import { DEFAULT_TTS_VOICE, TTS_VOICES } from './reader-tts'

export function audioParagraphs(article) {
  return readerParagraphs(article.content, article.article_type).filter(row => row.type === 'text' && row.value.trim())
}
export function speechChunk(text, offset = 0) {
  let chunk = text.slice(offset, offset + 300)
  if (offset + chunk.length < text.length) {
    const boundary = Math.max(...['。', '！', '？', '；', '\n', '.', '!', '?'].map(mark => chunk.lastIndexOf(mark)))
    if (boundary >= 150) chunk = chunk.slice(0, boundary + 1)
    if (/^[\uDC00-\uDFFF]/.test(text.slice(offset + chunk.length))) chunk = chunk.slice(0, -1)
  }
  return chunk
}
function segmentAt(text, offset = 0) {
  let start = 0
  while (start < text.length) {
    const input = speechChunk(text, start), end = start + input.length
    if (offset < end) return { input, start, end }
    start = end
  }
  return null
}
const aborted = () => Object.assign(new Error('播放请求已取消'), { name: 'AbortError' })
export function createAudioState() {
  return { visible: false, status: 'idle', speechStarted: false, error: '', notice: '', bookId: 0, bookTitle: '', cover: '', chapterId: 0, chapterTitle: '', chapters: [], chapterIndex: -1, paragraphs: [], paragraphIndex: 0, paragraphId: 0, charOffset: 0, positionSeconds: 0, durationSeconds: 0, rate: 1, voiceURI: DEFAULT_TTS_VOICE, voices: TTS_VOICES.map(voice => ({ ...voice })), sleepUntil: 0, sleepAtChapterEnd: false, follow: true, supported: false, charactersPerSecond: 5, timingMeasured: false, resumeCandidate: null, resumeLoading: false, storageError: '', bufferedParagraphs: 0 }
}

// The queue and media element outlive reader pages. No system-speech fallback.
export class ReaderAudio {
  constructor(state, environment) {
    this.state = state; this.env = environment; this.generation = 0; this.loadVersion = 0
    this.cache = new Map(); this.audioCache = new Map(); this.requests = new Map(); this.listeners = new Set()
    this.prefetchEpoch = 0; this.sleepTimer = null; this.session = null
    state.supported = Boolean(environment.createAudio && environment.session && environment.speech)
  }
  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  progress() { this.listeners.forEach(listener => listener(this.state)) }
  interrupt() {
    this.generation++; this.state.speechStarted = false
    if (this.audio) {
      for (const event of ['playing', 'timeupdate', 'loadedmetadata', 'ended', 'error', 'pause']) this.audio[`on${event}`] = null
      this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); this.audio = null
    }
    this.active = null
  }
  abortRequests() {
    this.prefetchEpoch++
    this.requests.forEach(item => item.controller.abort()); this.requests.clear()
  }
  clearAudioCache() {
    this.audioCache.forEach(item => this.env.revokeObjectURL(item.url)); this.audioCache.clear()
    this.state.bufferedParagraphs = 0
  }
  async ensureSession(force = false) {
    const login = this.env.token()
    if (!login) throw Error('请先登录后使用听书。')
    if (!force && this.session && this.session.login === login) return this.session
    if (this.sessionRequest && this.sessionRequest.login === login) return this.sessionRequest.promise
    const request = { login }
    request.promise = (async () => {
      const data = await this.env.session(login)
      if (login !== this.env.token()) throw aborted()
      if (!data || !Number.isSafeInteger(Number(data.user_id)) || Number(data.user_id) <= 0 || typeof data.token !== 'string' || !data.token.startsWith('sk-tts-')) throw Error('听书凭证无效，请重新登录。')
      const voices = new Map((data.voices || []).map(voice => [voice.id, voice.voice_id]))
      if (TTS_VOICES.some(voice => !voices.get(voice.voiceURI))) throw Error('听书音色暂时不可用，请稍后重试。')
      this.session = { login, userId: Number(data.user_id), token: data.token, voices }
      this.account = login
      return this.session
    })().finally(() => { if (this.sessionRequest === request) this.sessionRequest = null })
    this.sessionRequest = request
    return request.promise
  }
  async syncAccount() {
    if (this.account === this.env.token()) return true
    if (this.syncingAccount) return this.syncingAccount
    const resume = this.state.status === 'playing'
    this.pause()
    this.syncingAccount = (async () => {
      try {
        const session = await this.ensureSession()
        if (this.accountId != null && session.userId !== this.accountId) { this.close(); return false }
        if (resume && this.state.visible) await this.play()
        return true
      } catch (_) { this.close(); this.session = null; return false }
    })().finally(() => { this.syncingAccount = null })
    return this.syncingAccount
  }
  async open(book, chapters, article, paragraphId, options = {}) {
    const ordered = chapters.filter(row => row.article_type !== 'spliter').map(row => ({ article_id: Number(row.article_id), title: row.title }))
    if (this.account && this.account !== this.env.token()) this.pause()
    const version = ++this.loadVersion
    try {
      if (!this.state.supported) throw Error('此浏览器不支持在线音频播放。')
      const session = await this.ensureSession()
      if (version !== this.loadVersion) return
      const sameQueue = this.state.visible && this.accountId === session.userId && Number(book.novel_id) === this.state.bookId && ordered.length === this.state.chapters.length && ordered.every((row, index) => row.article_id === this.state.chapters[index].article_id)
      if (sameQueue && !options.forceSeek) { if (options.autoplay !== false) await this.play(); this.progress(); return }
      if (sameQueue && Number(article.article_id) === this.state.chapterId && paragraphId != null) {
        const index = this.state.paragraphs.findIndex(row => Number(row.id) === Number(paragraphId))
        if (index >= 0) { await this.seekParagraph(index, options.autoplay !== false); return }
      }
      this.interrupt(); this.abortRequests(); this.clearSleep(); this.cache.clear(); this.failedChapterIndex = null
      if (this.accountId !== session.userId) this.clearAudioCache()
      this.accountId = session.userId
      Object.assign(this.state, { visible: true, status: 'ready', error: '', notice: '', bookId: Number(book.novel_id), bookTitle: book.name, cover: book.picUrl || '', chapters: ordered, paragraphs: [], paragraphIndex: 0, paragraphId: 0, charOffset: 0 })
      if (Number(article.novel_id) !== this.state.bookId || !ordered.some(row => row.article_id === Number(article.article_id)) || (!this.env.privatePlayback && Number(article.is_draft) === 1)) throw Error('章节不属于当前公开播放列表。')
      this.cache.set(Number(article.article_id), article); this.setArticle(article, paragraphId)
      if (!this.state.paragraphs.length) throw Error('本章没有可朗读的正文。')
      if (options.autoplay !== false) await this.play()
      else this.prefetch()
    } catch (error) {
      if (version !== this.loadVersion || error.name === 'AbortError') return
      this.interrupt(); this.abortRequests(); this.state.visible = true; this.state.status = 'error'; this.state.error = error.message || '听书启动失败，请重试。'; this.progress()
    }
  }
  setArticle(article, paragraphId) {
    this.pendingResumeTime = null
    this.currentArticle = article
    const paragraphs = audioParagraphs(article), target = paragraphId == null ? -1 : paragraphs.findIndex(row => Number(row.id) === Number(paragraphId))
    Object.assign(this.state, { chapterId: Number(article.article_id), chapterTitle: article.title, chapterIndex: this.state.chapters.findIndex(row => row.article_id === Number(article.article_id)), paragraphs, paragraphIndex: Math.max(0, target), charOffset: 0, positionSeconds: 0, durationSeconds: 0 })
    this.state.paragraphId = paragraphs[this.state.paragraphIndex]?.id || 0; this.progress()
  }
  async chapter(index, autoplay = true) {
    if (index < 0 || index >= this.state.chapters.length) return
    const version = ++this.loadVersion, id = this.state.chapters[index].article_id
    this.failedChapterIndex = index; this.interrupt(); this.abortRequests(); this.state.status = 'loading'; this.state.error = ''; this.progress()
    try {
      const session = await this.ensureSession()
      if (this.accountId !== session.userId) { this.close(); return }
      let article = this.cache.get(id)
      if (!article) { const result = await this.env.article(id); article = result && result[0] }
      if (version !== this.loadVersion) return
      if (this.account !== this.env.token()) { if (!await this.syncAccount()) return }
      if (!article || Number(article.article_id) !== id || Number(article.novel_id) !== this.state.bookId || (!this.env.privatePlayback && Number(article.is_draft) === 1)) throw Error('章节不可播放或已失效')
      this.cache.set(id, article); this.failedChapterIndex = null
      if (this.cache.size > 4) this.cache.delete(this.cache.keys().next().value)
      this.setArticle(article); this.state.status = 'ready'
      if (!this.state.paragraphs.length) {
        if (autoplay && index + 1 < this.state.chapters.length) return this.chapter(index + 1, true)
        throw Error('本章没有可朗读的正文。')
      }
      if (autoplay) await this.play()
      else this.prefetch()
    } catch (error) {
      if (version !== this.loadVersion || error.name === 'AbortError') return
      this.state.status = 'error'; this.state.error = error.message || '章节加载失败，请重试。'; this.progress()
    }
  }
  cacheKey(segment, session = this.session) { return JSON.stringify([session.userId, session.voices.get(this.state.voiceURI), segment.input]) }
  async audioFor(segment, session) {
    const key = this.cacheKey(segment, session)
    if (this.audioCache.has(key)) { const value = this.audioCache.get(key); this.audioCache.delete(key); this.audioCache.set(key, value); return value }
    if (this.requests.has(key)) return this.requests.get(key).promise
    const item = { controller: new AbortController() }, voice = session.voices.get(this.state.voiceURI)
    item.promise = (async () => {
      let blob
      for (let attempt = 0; attempt < 3; attempt++) {
        if (item.controller.signal.aborted) throw aborted()
        try { blob = await this.env.speech({ input: segment.input, voice, token: session.token, signal: item.controller.signal }); break }
        catch (error) {
          if (item.controller.signal.aborted) throw aborted()
          if (error.status === 401 && attempt === 0) {
            session = await this.ensureSession(true)
            if (session.userId !== this.accountId) { this.close(); throw aborted() }
          } else if (error.status === 429 && attempt < 2) {
            await new Promise(resolve => this.env.setTimeout(resolve, (attempt + 1) * 1000))
          } else throw error
        }
      }
      if (!blob || !blob.size) throw Error('听书服务返回空音频。')
      if (item.controller.signal.aborted || session.userId !== this.accountId) throw aborted()
      const entry = { key, url: this.env.createObjectURL(blob), size: blob.size }
      this.audioCache.set(key, entry)
      let bytes = [...this.audioCache.values()].reduce((sum, value) => sum + value.size, 0)
      for (const [oldKey, value] of this.audioCache) {
        if (this.audioCache.size <= 24 && bytes <= 32 * 1024 * 1024) break
        if (oldKey !== key && oldKey !== this.active?.key) { this.env.revokeObjectURL(value.url); this.audioCache.delete(oldKey); bytes -= value.size }
      }
      return entry
    })().finally(() => { if (this.requests.get(key) === item) this.requests.delete(key) })
    this.requests.set(key, item)
    return item.promise
  }
  async play() {
    if (!this.state.supported || !this.state.paragraphs.length || this.state.status === 'loading' || this.checkSleep()) return
    if (this.account !== this.env.token() && !await this.syncAccount()) return
    if (this.state.status === 'playing' && this.audio && !this.audio.paused && !this.audio.ended) return
    this.state.status = 'playing'; this.state.error = ''; this.state.notice = ''; this.progress()
    if (this.audio && !this.audio.ended) { await this.startAudio(this.audio); return }
    const generation = ++this.generation
    await this.speak(generation)
  }
  async speak(generation) {
    if (generation !== this.generation || this.state.status !== 'playing') return
    const paragraph = this.state.paragraphs[this.state.paragraphIndex]
    if (!paragraph) return this.finishChapter()
    this.state.paragraphId = paragraph.id; this.state.speechStarted = false; this.progress()
    const segment = segmentAt(paragraph.value, this.state.charOffset)
    if (!segment) return this.advance()
    try {
      const session = await this.ensureSession()
      if (session.userId !== this.accountId) { this.close(); return }
      const entry = await this.audioFor(segment, session)
      if (generation !== this.generation || this.state.status !== 'playing') return
      const offset = this.state.charOffset, audio = this.env.createAudio()
      this.audio = audio; this.active = { ...segment, key: entry.key }
      const active = () => this.audio === audio && this.active?.key === entry.key && this.state.visible
      audio.preload = 'auto'; audio.playbackRate = this.state.rate
      audio.onloadedmetadata = () => {
        if (!active() || !Number.isFinite(audio.duration)) return
        const exact = this.pendingResumeTime
        const seconds = exact && exact.voiceURI === this.state.voiceURI && exact.segmentStart === segment.start ? exact.audioOffset : (offset - segment.start) / (segment.end - segment.start) * audio.duration
        audio.currentTime = Math.max(0, Math.min(audio.duration, seconds || 0)); this.pendingResumeTime = null
        this.state.durationSeconds = audio.duration
        if (audio.duration > .5) { this.state.charactersPerSecond = segment.input.length / audio.duration; this.state.timingMeasured = true }
      }
      audio.onplaying = () => { if (active() && this.state.status === 'playing') { this.state.speechStarted = true; this.progress() } }
      audio.ontimeupdate = () => { if (!active()) return; if (this.account !== this.env.token()) { this.syncAccount(); return }; this.updatePosition(); this.progress() }
      audio.onended = () => {
        if (!active() || this.state.status !== 'playing') return
        this.state.charOffset = segment.end; this.interrupt()
        if (this.account !== this.env.token()) { this.syncAccount(); return }
        this.state.status = 'playing'
        if (this.state.charOffset >= paragraph.value.length) this.advance()
        else this.speak(this.generation)
      }
      audio.onpause = () => { if (active() && this.state.status === 'playing' && !audio.ended) this.suspend('播放已暂停，点击播放继续。') }
      audio.onerror = () => { if (active()) { this.interrupt(); this.state.status = 'error'; this.state.error = '音频播放失败，请重试。'; this.progress() } }
      audio.src = entry.url
      this.prefetch()
      await this.startAudio(audio)
    } catch (error) {
      if (generation !== this.generation || error.name === 'AbortError') return
      this.state.status = 'error'; this.state.speechStarted = false; this.state.error = error.message || '语音生成失败，请重试。'; this.progress()
    }
  }
  async startAudio(audio) {
    try { audio.playbackRate = this.state.rate; await audio.play() }
    catch (error) {
      if (this.audio !== audio || this.state.status !== 'playing') return
      this.state.speechStarted = false
      if (error.name === 'NotAllowedError') { this.state.status = 'paused'; this.state.notice = '浏览器阻止了自动播放，请点击播放继续。' }
      else { this.state.status = 'error'; this.state.error = '音频播放失败，请重试。' }
      this.progress()
    }
  }
  updatePosition() {
    if (!this.audio || !this.active || !Number.isFinite(this.audio.duration) || !this.audio.duration) return
    const paragraph = this.state.paragraphs[this.state.paragraphIndex], ratio = Math.min(1, this.audio.currentTime / this.audio.duration)
    this.state.charOffset = this.active.start + Math.floor((this.active.end - this.active.start) * ratio)
    if (paragraph && /^[\uDC00-\uDFFF]/.test(paragraph.value.slice(this.state.charOffset))) this.state.charOffset--
    this.state.positionSeconds = this.audio.currentTime; this.state.durationSeconds = this.audio.duration
  }
  prefetch() {
    if (this.prefetchJob || !this.session || !this.state.visible) return
    const epoch = this.prefetchEpoch
    this.prefetchJob = (async () => {
      const failed = new Set(), failedChapters = new Set()
      while (epoch === this.prefetchEpoch && this.state.visible && this.account === this.env.token()) {
        const paragraph = this.state.paragraphs[this.state.paragraphIndex]
        if (!paragraph) break
        const segment = segmentAt(paragraph.value, this.state.charOffset), targets = []
        if (segment) { targets.push(segment); const next = segmentAt(paragraph.value, segment.end); if (next) targets.push(next) }
        const upcoming = this.state.paragraphs.slice(this.state.paragraphIndex + 1, this.state.paragraphIndex + 4)
        const nextChapter = this.state.chapters[this.state.chapterIndex + 1]
        if (upcoming.length < 3 && nextChapter && this.cache.has(nextChapter.article_id)) upcoming.push(...audioParagraphs(this.cache.get(nextChapter.article_id)).slice(0, 3 - upcoming.length))
        for (const row of upcoming) { const first = segmentAt(row.value); if (first) targets.push(first) }
        this.state.bufferedParagraphs = upcoming.filter(row => { const first = segmentAt(row.value); return first && this.audioCache.has(this.cacheKey(first)) }).length
        const target = targets.find(value => !this.audioCache.has(this.cacheKey(value)) && !failed.has(this.cacheKey(value)))
        if (!target) {
          if (upcoming.length < 3 && nextChapter && !this.cache.has(nextChapter.article_id) && !failedChapters.has(nextChapter.article_id)) {
            try {
              const rows = await this.env.article(nextChapter.article_id), next = rows && rows[0]
              if (epoch !== this.prefetchEpoch || this.account !== this.env.token()) break
              if (!next || Number(next.article_id) !== nextChapter.article_id || Number(next.novel_id) !== this.state.bookId || (!this.env.privatePlayback && Number(next.is_draft) === 1)) throw Error('预加载章节不可阅读')
              this.cache.set(nextChapter.article_id, next)
            } catch (_) { failedChapters.add(nextChapter.article_id) }
            continue
          }
          break
        }
        const key = this.cacheKey(target)
        try { await this.audioFor(target, this.session) } catch (_) { failed.add(key) }
      }
    })().finally(() => { this.prefetchJob = null; if (epoch !== this.prefetchEpoch && this.state.visible) this.prefetch() })
  }
  advance() { this.state.paragraphIndex++; this.state.charOffset = 0; this.state.positionSeconds = 0; this.state.durationSeconds = 0; if (this.state.paragraphIndex >= this.state.paragraphs.length) return this.finishChapter(); return this.speak(this.generation) }
  finishChapter() {
    if (this.state.sleepAtChapterEnd) { this.state.paragraphIndex = Math.max(0, this.state.paragraphs.length - 1); this.state.charOffset = this.state.paragraphs[this.state.paragraphIndex]?.value.length || 0; this.clearSleep(); this.pause(); return }
    if (this.state.chapterIndex + 1 < this.state.chapters.length) return this.chapter(this.state.chapterIndex + 1)
    this.interrupt(); this.state.status = 'ended'; this.state.charOffset = 0; this.state.paragraphIndex = Math.max(0, this.state.paragraphs.length - 1); this.progress()
  }
  pause() { if (this.state.status === 'loading') this.loadVersion++; this.updatePosition(); this.state.status = 'paused'; this.state.speechStarted = false; if (this.audio) this.audio.pause(); else this.generation++; this.progress() }
  suspend(message = '页面暂停后已保留听书位置，点击播放继续。') { if (!this.state.visible || !['playing', 'loading'].includes(this.state.status)) return; this.pause(); this.state.notice = message; this.progress() }
  async wake() { if (!await this.syncAccount() || this.checkSleep()) return; if (this.state.status === 'playing' && this.audio?.paused) this.suspend() }
  toggle() { if (this.state.status === 'playing') return this.pause(); if (this.state.status === 'loading') return; if (this.state.status === 'ended') { this.state.paragraphIndex = 0; this.state.charOffset = 0 }; if (this.failedChapterIndex != null) return this.chapter(this.failedChapterIndex); return this.play() }
  async seekParagraph(index, autoplay = this.state.status === 'playing') {
    if (!this.state.paragraphs.length || this.state.status === 'loading') return
    this.interrupt(); this.abortRequests(); this.pendingResumeTime = null
    this.state.paragraphIndex = Math.max(0, Math.min(this.state.paragraphs.length - 1, Math.floor(Number(index)) || 0)); this.state.charOffset = 0
    this.state.paragraphId = this.state.paragraphs[this.state.paragraphIndex].id; this.state.positionSeconds = 0; this.state.durationSeconds = 0; this.state.status = 'paused'; this.progress()
    if (autoplay) await this.play(); else this.prefetch()
  }
  seekRelative(seconds) {
    if (!this.state.paragraphs.length || this.state.status === 'loading' || !Number.isFinite(Number(seconds))) return
    if (this.audio && Number.isFinite(this.audio.duration) && this.audio.currentTime + Number(seconds) >= 0 && this.audio.currentTime + Number(seconds) < this.audio.duration) { this.audio.currentTime += Number(seconds); this.updatePosition(); this.progress(); return }
    const playing = this.state.status === 'playing'
    this.updatePosition()
    let remaining = Math.round(Number(seconds) * this.state.charactersPerSecond * this.state.rate), index = Math.min(this.state.paragraphIndex, this.state.paragraphs.length - 1), offset = this.state.charOffset
    while (remaining > 0) { const available = this.state.paragraphs[index].value.length - offset; if (remaining < available || index === this.state.paragraphs.length - 1) { offset = Math.min(this.state.paragraphs[index].value.length - 1, offset + remaining); break }; remaining -= available; index++; offset = 0 }
    while (remaining < 0) { if (-remaining <= offset || index === 0) { offset = Math.max(0, offset + remaining); break }; remaining += offset; index--; offset = this.state.paragraphs[index].value.length }
    this.seekParagraph(index, false); this.state.charOffset = offset
    if (/^[\uDC00-\uDFFF]/.test(this.state.paragraphs[index].value.slice(offset))) this.state.charOffset = Math.max(0, offset - 1)
    this.progress(); if (playing) return this.play()
  }
  configure(patch) {
    if (patch.rate != null) this.state.rate = Math.max(.5, Math.min(2, Number(patch.rate) || 1))
    if (this.audio) this.audio.playbackRate = this.state.rate
    if (patch.voiceURI != null) {
      const next = TTS_VOICES.some(voice => voice.voiceURI === patch.voiceURI) ? patch.voiceURI : DEFAULT_TTS_VOICE
      if (next !== this.state.voiceURI) { const playing = this.state.status === 'playing'; this.updatePosition(); this.interrupt(); this.abortRequests(); this.pendingResumeTime = null; this.state.voiceURI = next; this.state.status = this.state.visible ? 'paused' : 'idle'; if (playing) this.play(); else this.prefetch() }
    }
    this.progress()
  }
  setSleep(minutes) {
    this.clearSleep()
    if (minutes === 'chapter') { this.state.sleepAtChapterEnd = true; return }
    const duration = Number(minutes)
    if (!Number.isFinite(duration) || duration <= 0) return
    this.state.sleepUntil = this.env.now() + duration * 60000
    this.sleepTimer = this.env.setTimeout(() => { this.clearSleep(); if (['playing', 'loading'].includes(this.state.status)) this.pause(); this.state.notice = '定时听书已结束。'; this.progress() }, duration * 60000)
  }
  checkSleep() { if (!this.state.sleepUntil || this.env.now() < this.state.sleepUntil) return false; this.clearSleep(); if (['playing', 'loading'].includes(this.state.status)) this.pause(); this.state.notice = '定时听书已结束。'; this.progress(); return true }
  clearSleep() { if (this.sleepTimer) this.env.clearTimeout(this.sleepTimer); this.sleepTimer = null; this.state.sleepUntil = 0; this.state.sleepAtChapterEnd = false }
  close() { this.loadVersion++; this.interrupt(); this.abortRequests(); this.clearSleep(); this.clearAudioCache(); this.pendingResumeTime = null; this.state.visible = false; this.state.status = 'idle'; this.state.notice = ''; this.cache.clear(); this.accountId = null; this.progress() }
  destroy() { this.close(); this.session = null; this.listeners.clear() }
}
