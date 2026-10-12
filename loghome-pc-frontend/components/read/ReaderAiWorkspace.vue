<template>
  <section class="reader-ai" aria-labelledby="reader-ai-title">
    <header class="ai-page-head">
      <div><nuxt-link :to="bookUrl">← 返回作品</nuxt-link><h1 id="reader-ai-title">向原木娘提问</h1><p>与原木娘一起读懂《{{ book.name }}》</p></div>
      <div class="ai-resource-links"><nuxt-link v-if="ready && !disabled" to="/read/redstone">红石中心</nuxt-link><nuxt-link to="/me/settings">AI 辅助设置</nuxt-link></div>
    </header>
    <div v-if="!ready" class="ai-gate">正在加载会话…</div>
    <div v-else-if="disabled" class="ai-gate"><h2>AI 辅助已关闭</h2><p>在账号设置中开启后，可以使用原木娘助读。</p><nuxt-link to="/me/settings">前往设置</nuxt-link></div>
    <div v-else-if="authorDisabled" class="ai-gate"><h2>作者已关闭本作品的 AI 助读</h2><p>你仍然可以阅读正文、查看书摘和参与评论。</p><nuxt-link :to="bookUrl">返回作品</nuxt-link></div>
    <div v-else-if="!accountToken || authExpired" class="ai-gate"><h2>{{ authExpired ? '登录已失效，请重新登录' : '登录后与原木娘聊聊这本书' }}</h2><nuxt-link :to="loginUrl">登录后提问</nuxt-link></div>
    <div v-else class="ai-workspace">
      <aside class="ai-sidebar" aria-label="历史会话">
        <div class="sidebar-head"><h2>会话</h2><button @click="newSession">＋ 新会话</button></div>
        <label class="history-search">搜索历史<input v-model="keyword" type="search" placeholder="作品、问题或回复" /></label>
        <div class="history-list">
          <section v-for="group in historyGroups" :key="group.id" class="history-group">
            <h3>{{ group.name }}</h3>
            <div v-for="item in group.sessions" :key="item.id" class="history-row" :class="{ selected: session && item.id === session.id }">
              <button class="history-item" :aria-current="session && item.id === session.id ? 'true' : null" @click="selectSession(item)"><strong>{{ item.title }}</strong><small>{{ historyTime(item.updatedAt) }}{{ item.pendingTask ? ' · 待接收' : '' }}</small></button>
              <button class="history-delete" :aria-label="`删除会话 ${item.title}`" @click="deleteSession(item)">×</button>
            </div>
          </section>
          <p v-if="!historyGroups.length" class="quiet">未找到相关会话</p>
        </div>
        <button class="clear-history" @click="clearHistory">清空本账号的会话历史</button>
      </aside>
      <main v-if="session" class="ai-main">
        <div class="conversation-head">
          <div><h2>{{ session.title }}</h2><p>当前作品：{{ session.activeNovel.novelName }}<span v-if="session.activeNovel.novelId !== session.novelId"> · 临时上下文</span></p></div>
          <button v-if="session.activeNovel.novelId !== session.novelId" :disabled="busy || !!session.pendingTask" @click="restoreBook">回到《{{ book.name }}》</button>
        </div>
        <div class="ai-metrics">
          <details><summary>作品索引 {{ index ? Math.round(index.percent) + '%' : '—' }}</summary><p v-if="index">已索引摘要 {{ index.indexed }} / {{ index.total }} 章，待索引 {{ index.pending }} 章<span v-if="index.queueStatus">；队列 {{ index.queueStatus }}</span>。</p><p v-else>尚未读取索引信息。</p><p v-if="indexError" role="alert">{{ indexError }}</p><button :disabled="indexLoading" @click="loadIndex">{{ indexLoading ? '读取中…' : '刷新索引状态' }}</button></details>
          <details><summary>上下文 {{ Math.round(session.context.percent) }}%</summary><p>{{ session.context.usedTokens.toLocaleString() }} / {{ session.context.limitTokens.toLocaleString() }} tokens</p><p>达到 {{ session.context.thresholdTokens.toLocaleString() }} tokens 后，服务会压缩上下文以继续对话。已压缩 {{ session.context.compressedCount }} 次。</p></details>
          <span class="quiet">{{ busy ? '正在接收回复' : session.pendingTask ? '接收已暂停' : '可以提问' }}</span>
        </div>
        <div ref="messages" class="ai-messages" tabindex="0" aria-label="问答内容" @scroll="onScroll">
          <div v-if="!session.messages.length" class="chat-welcome"><SiteIcon class="welcome-mark" name="sparkle" /><h2>从一个问题开始</h2><p>可以讨论情节、人物和世界设定。原木娘会检索作品，并附上可回到正文的引用。</p><p class="quiet">回答可能涉及后续情节；AI 内容仅供参考。</p><div class="question-chips"><button v-for="question in suggestions" :key="question" @click="chooseQuestion(question)">{{ question }}</button></div></div>
          <article v-for="message in session.messages" :key="message.id" class="ai-message" :class="message.role">
            <div class="message-label"><strong>{{ message.role === 'user' ? '你' : '原木娘' }}</strong><div class="message-actions"><button :disabled="!message.content" @click="copyMessage(message)">复制</button><button :disabled="busy || !!session.pendingTask" @click="deleteMessage(message)">删除</button><button v-if="message.role === 'user'" :disabled="busy || !!session.pendingTask" @click="rollback(message)">回滚</button></div></div>
            <details v-if="message.thinkingSteps.length || message.currentThinkingText" class="thinking"><summary>思考与检索过程</summary><ol><li v-for="(step, i) in message.thinkingSteps" :key="i">{{ step }}</li><li v-if="message.currentThinkingText">{{ message.currentThinkingText }}</li></ol></details>
            <p v-if="message.role === 'user'" class="user-text">{{ message.content }}</p>
            <div v-else class="ai-markdown" v-html="markdown(message)"></div>
            <p v-if="!message.content && !message.error && session.pendingTask && session.pendingTask.messageId === message.id" class="quiet">{{ busy ? '正在阅读和整理…' : '等待继续接收回复' }}</p>
            <details v-if="message.citations.length" class="citations"><summary>参考引用 · {{ message.citations.length }}</summary><ol><li v-for="(citation, i) in message.citations" :key="citation.id + '-' + i"><a v-if="citationUrl(citation)" :href="citationUrl(citation)" target="_blank" rel="noopener">[{{ citation.displayIndex }}] {{ citation.title }}{{ citation.paragraphId ? ` · 第 ${citation.paragraphId} 段` : '' }} ↗</a><span v-else>[{{ citation.displayIndex }}] {{ citation.title }}</span><blockquote v-if="citation.snippet">{{ citation.snippet }}</blockquote></li></ol></details>
            <p v-if="message.error" class="ai-error" role="alert">{{ message.error }}</p>
          </article>
        </div>
        <button v-if="!atBottom" class="jump-bottom" @click="scrollBottom(true)">回到最新回复 ↓</button>
        <div class="ai-composer">
          <p v-if="error" class="ai-error" role="alert">{{ error }}</p><p v-if="storageError" class="ai-error" role="alert">{{ storageError }}</p>
          <div v-if="redstoneError" class="resource-help"><nuxt-link to="/read/redstone">兑换红石</nuxt-link><a href="https://m.loghome.ink/#/pages/membership/index" target="_blank" rel="noopener">开通通行证 ↗</a></div>
          <div v-if="session.pendingTask && !busy" class="resume-row"><span>回复接收未完成，可从上次位置继续。暂停接收时，服务仍可能继续生成回复。</span><button @click="receive">继续接收</button><button @click="discardTask">结束此次回复</button></div>
          <label for="reader-ai-question" class="sr-only">向原木娘提问</label><textarea id="reader-ai-question" ref="draft" v-model="session.draft" :disabled="busy || !!session.pendingTask" rows="3" placeholder="输入你想了解的情节、人物或设定…" @input="scheduleSave" @keydown="onDraftKey" />
          <div class="composer-footer"><fieldset :disabled="busy || !!session.pendingTask"><legend class="sr-only">检索模式</legend><label><input v-model="session.mode" type="radio" value="fast" @change="persist" /> 快速 <small>1 红石 / 次</small></label><label><input v-model="session.mode" type="radio" value="deep" @change="persist" /> 深入 <small>2 红石 / 次</small></label></fieldset><button v-if="busy" class="send" @click="pause(true)">暂停接收</button><button v-else class="send" :disabled="!session.draft.trim() || !!session.pendingTask" @click="submit">发送 ↑</button></div>
          <p class="composer-hint">Ctrl / ⌘ + Enter 发送。继续接收复用同一任务，不创建新提问。</p>
        </div>
      </main>
    </div>
  </section>
</template>

<script>
import SiteIcon from '~/components/ui/SiteIcon.vue'
import { readingToken } from '~/plugins/api/reading'
import { workUrl } from '~/utils/reading-discovery'
import { readerAiDisabled, AI_PREFERENCE_EVENT, aiSession, aiNovel, aiMessage, createAiTask, aiPayload, applyAiEvent, loadAiHistory, saveAiHistory, streamReaderAi, fetchAiIndex, aiCitationUrl, stripAiCitations } from '~/utils/reader-ai'
import { renderAiMarkdown } from '~/utils/reader-ai-markdown'
export default {
  components: { SiteIcon },
  props: { book: { type: Object, required: true } },
  data: () => ({ ready: false, disabled: false, accountToken: null, authExpired: false, authorDisabled: false, sessions: [], selectedId: '', keyword: '', busy: false, error: '', storageError: '', redstoneError: false, index: null, indexError: '', indexLoading: false, runVersion: 0, indexVersion: 0, atBottom: true }),
  computed: {
    bookUrl() { return workUrl(this.book) },
    loginUrl() { return { path: '/login', query: { redirect: `/read/ask/${this.book.novel_id}` } } },
    session() { return this.sessions.find(item => item.id === this.selectedId) || null },
    suggestions() { return ['这本书讲了怎样的故事？', '帮我梳理主要人物之间的关系', '解释一下故事中的世界设定'] },
    historyGroups() {
      const keyword = this.keyword.trim().toLocaleLowerCase(), groups = new Map()
      this.sessions.slice().sort((a,b) => b.updatedAt - a.updatedAt).forEach(session => {
        if (keyword && ![session.novelName, session.title, ...session.messages.map(item => stripAiCitations(item.content))].join('\n').toLocaleLowerCase().includes(keyword)) return
        if (!groups.has(session.novelId)) groups.set(session.novelId, { id: session.novelId, name: session.novelName, sessions: [] })
        groups.get(session.novelId).sessions.push(session)
      })
      return [...groups.values()]
    }
  },
  mounted() {
    this.syncIdentity()
    window.addEventListener('storage', this.syncIdentity); window.addEventListener('focus', this.syncIdentity)
    window.addEventListener(AI_PREFERENCE_EVENT, this.syncIdentity); document.addEventListener('visibilitychange', this.onVisibility)
    this.identityTimer = setInterval(this.syncIdentity, 1000)
  },
  beforeDestroy() {
    this.pause(); this.indexVersion++; if (this.indexController) this.indexController.abort()
    clearInterval(this.identityTimer); clearTimeout(this.saveTimer)
    window.removeEventListener('storage', this.syncIdentity); window.removeEventListener('focus', this.syncIdentity)
    window.removeEventListener(AI_PREFERENCE_EVENT, this.syncIdentity); document.removeEventListener('visibilitychange', this.onVisibility)
  },
  methods: {
    markdown: renderAiMarkdown, citationUrl: aiCitationUrl,
    historyTime(time) { return new Date(time).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) },
    syncIdentity() {
      const token = readingToken(), disabled = readerAiDisabled(), first = !this.ready
      if (!first && token === this.accountToken && disabled === this.disabled) return
      this.pause(); this.indexVersion++; if (this.indexController) this.indexController.abort()
      this.disabled = disabled; this.ready = true; this.error = ''; this.redstoneError = false; this.index = null; this.indexError = ''; this.indexLoading = false
      if (token !== this.accountToken || first) {
        this.accountToken = token; this.sessions = token ? loadAiHistory(token) : []; this.selectedId = ''; this.keyword = ''; this.storageError = ''
        this.authExpired = false
        if (token) {
          const requested = this.$route && this.$route.query.session
          const belongs = item => item.novelId === Number(this.book.novel_id)
          const latest = this.sessions.find(item => belongs(item) && item.id === requested) || this.sessions.find(item => belongs(item) && item.chosen) || this.sessions.find(belongs)
          if (latest) this.selectedId = latest.id
          else { const session = aiSession(this.book); this.sessions.unshift(session); this.selectedId = session.id }
        }
      }
      this.authorDisabled = Number(this.book.disable_reader_ai) === 1
      if (!disabled && token && !this.authorDisabled) { this.loadIndex(); if (this.session && this.session.pendingTask && this.session.pendingTask.status !== 'paused') this.receive() }
    },
    valid() { this.syncIdentity(); return !!this.accountToken && !this.authExpired && !this.disabled && !this.authorDisabled && !!this.session },
    persist() {
      clearTimeout(this.saveTimer)
      if (this.accountToken !== readingToken() || !this.accountToken) return false
      this.sessions.forEach(item => { if (item.novelId === Number(this.book.novel_id)) item.chosen = item.id === this.selectedId })
      try { saveAiHistory(this.accountToken, this.sessions); this.storageError = ''; return true }
      catch (_) { this.storageError = '会话或草稿未能保存，请检查浏览器存储空间。关闭页面后可能丢失本次内容。'; return false }
    },
    scheduleSave() { clearTimeout(this.saveTimer); this.saveTimer = setTimeout(() => this.persist(), 250) },
    onVisibility() { if (document.hidden) this.pause(); else { this.syncIdentity(); if (this.valid() && this.session.pendingTask && this.session.pendingTask.status !== 'paused' && !this.busy) this.receive() } },
    onScroll() { const area = this.$refs.messages; this.atBottom = !area || area.scrollHeight - area.scrollTop - area.clientHeight < 150 },
    scrollBottom(force = false) { if (!force && !this.atBottom) return; this.$nextTick(() => { const area = this.$refs.messages; if (area) { area.scrollTop = area.scrollHeight; this.atBottom = true } }) },
    chooseQuestion(question) { if (!this.valid() || this.busy || this.session.pendingTask) return; this.session.draft = question; this.persist(); this.$refs.draft.focus() },
    onDraftKey(event) { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.isComposing) { event.preventDefault(); this.submit() } },
    newSession() {
      this.syncIdentity()
      if (!this.accountToken || this.authExpired || this.disabled || this.authorDisabled) return
      this.pause(); const session = aiSession(this.book); this.sessions.unshift(session); this.selectedId = session.id
      this.error = ''; this.redstoneError = false; this.index = null; this.persist(); this.loadIndex(); this.scrollBottom(true)
    },
    selectSession(item) {
      if (!this.valid()) return
      this.pause()
      if (item.novelId !== Number(this.book.novel_id)) { this.$router.push({ path: `/read/ask/${item.novelId}`, query: { session: item.id } }); return }
      this.selectedId = item.id; this.error = ''; this.redstoneError = false; this.index = null; this.persist(); this.loadIndex(); this.scrollBottom(true)
      if (item.pendingTask && item.pendingTask.status !== 'paused') this.receive()
    },
    async confirm(message) { try { await this.$confirm(message, '会话管理', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }); return true } catch (_) { return false } },
    async deleteSession(item) {
      if (!this.valid()) return
      const token = this.accountToken
      if (!await this.confirm(`删除「${item.title}」及其全部问答？`) || token !== readingToken()) return
      if (item.id === this.selectedId) this.pause()
      this.sessions = this.sessions.filter(session => session.id !== item.id)
      if (item.id === this.selectedId) {
        const next = this.sessions.find(session => session.novelId === Number(this.book.novel_id))
        if (next) { this.selectedId = next.id; this.index = null; this.loadIndex() }
        else this.newSession()
      }
      this.persist()
    },
    async clearHistory() {
      if (!this.valid()) return
      const token = this.accountToken
      if (!await this.confirm('清空本账号在此浏览器中的所有作品会话和草稿？') || token !== readingToken()) return
      this.pause(); this.sessions = []; this.newSession()
    },
    async deleteMessage(message) {
      if (!this.valid() || this.busy || this.session.pendingTask) return
      const token = this.accountToken, session = this.session
      if (!await this.confirm('删除这条消息？') || token !== readingToken() || this.session !== session || this.busy || session.pendingTask) return
      session.messages = session.messages.filter(item => item.id !== message.id); session.updatedAt = Date.now(); this.persist()
    },
    async rollback(message) {
      if (!this.valid() || this.busy || this.session.pendingTask || message.role !== 'user') return
      const token = this.accountToken, session = this.session
      if (!await this.confirm('删除此问题及之后的回复，并把问题放回输入框？') || token !== readingToken() || this.session !== session || this.busy || session.pendingTask) return
      const index = session.messages.findIndex(item => item.id === message.id); if (index < 0) return
      session.messages.splice(index); session.draft = message.content; session.updatedAt = Date.now(); this.persist(); this.$refs.draft.focus()
    },
    async copyMessage(message) {
      if (!this.valid()) return
      try { await navigator.clipboard.writeText(stripAiCitations(message.content)); this.$message.success('已复制') }
      catch (_) { this.error = '复制失败，可选中消息文字手动复制。' }
    },
    restoreBook() { if (!this.valid() || this.busy || this.session.pendingTask) return; this.session.activeNovel = aiNovel(this.book); this.persist(); this.loadIndex() },
    pause(manual = false) { this.runVersion++; if (this.streamController) this.streamController.abort(); this.streamController = null; this.busy = false; if (manual && this.session && this.session.pendingTask) this.session.pendingTask.status = 'paused'; this.persist() },
    async discardTask() {
      if (!this.valid() || this.busy || !this.session.pendingTask) return
      const token = this.accountToken, session = this.session
      if (!await this.confirm('结束接收这次回复？已有内容会保留。此操作不会撤销已经产生的红石扣费。') || token !== readingToken() || this.session !== session || this.busy) return
      session.pendingTask = null; this.error = ''; this.persist()
    },
    async loadIndex() {
      if (!this.valid()) return
      const session = this.session, novelId = session.activeNovel.novelId, token = this.accountToken, version = ++this.indexVersion
      if (this.indexController) this.indexController.abort()
      const controller = new AbortController(); this.indexController = controller; this.indexLoading = true; this.indexError = ''
      const timeout = setTimeout(() => controller.abort(), 15000)
      try { const index = await fetchAiIndex(novelId, { token, signal: controller.signal }); if (version === this.indexVersion && token === readingToken() && this.session === session) this.index = index }
      catch (error) {
        if (version !== this.indexVersion || token !== readingToken() || this.session !== session) return
        this.indexError = error.name === 'AbortError' ? '读取索引超时，请重试。' : error.message
        if (error.status === 401) { this.authExpired = true; this.pause() }
        if (error.code === 'READER_AI_DISABLED' && novelId === Number(this.book.novel_id)) { this.authorDisabled = true; this.pause() }
      } finally { clearTimeout(timeout); if (version === this.indexVersion) this.indexLoading = false }
    },
    async submit() {
      if (!this.valid() || this.busy || this.session.pendingTask || !this.session.draft.trim()) return
      const session = this.session, text = session.draft.trim()
      session.messages.push(aiMessage('user', text)); session.draft = ''; if (session.title === '新会话') session.title = text.slice(0, 24)
      const assistant = aiMessage('assistant'); session.messages.push(assistant); session.pendingTask = createAiTask(session, assistant); session.updatedAt = Date.now()
      // Require a durable task id before starting a paid request.
      if (!this.persist()) return
      this.scrollBottom(true); await this.receive()
    },
    async receive() {
      if (!this.valid() || this.busy || !this.session.pendingTask || !this.persist()) return
      const session = this.session, token = this.accountToken, version = ++this.runVersion, task = session.pendingTask
      task.status = 'running'
      const current = () => version === this.runVersion && token === readingToken() && !readerAiDisabled() && this.session === session
      const controller = new AbortController(); this.streamController = controller; this.busy = true; this.error = ''; this.redstoneError = false
      try {
        // Check the current author setting before every send/resume; the AI service also enforces it.
        const books = await this.$api.reader.book(this.book.novel_id)
        if (!current()) return
        if (!books[0]) throw new Error('作品不存在或不可阅读。')
        if (Number(books[0].disable_reader_ai) === 1) { this.authorDisabled = true; throw new Error('作者已关闭本作品的 AI 助读。') }
        await streamReaderAi(aiPayload(session, task), { token, signal: controller.signal, current: () => current() && session.pendingTask === task, onEvent: event => {
          if (!current()) return
          const previousNovel = session.activeNovel.novelId
          if (!applyAiEvent(session, event)) return
          session.updatedAt = Date.now(); this.scheduleSave(); this.scrollBottom()
          if (session.activeNovel.novelId !== previousNovel) { this.index = null; this.loadIndex() }
          if (event.type === 'error') { this.error = event.message || event.msg || '回复生成失败'; this.redstoneError = event.code === 'INSUFFICIENT_REDSTONE' || /红石.*不足/.test(this.error); if (event.code === 'READER_AI_DISABLED' && session.activeNovel.novelId === session.novelId) this.authorDisabled = true }
        } })
        if (current() && session.pendingTask) this.error = '连接已断开，回复接收未完成。请继续接收。'
      } catch (error) {
        if (!current() || error.name === 'AbortError') return
        this.error = error.message; this.redstoneError = error.code === 'INSUFFICIENT_REDSTONE' || /红石.*不足/.test(error.message)
        if (error.status === 401) this.authExpired = true
        if ([400, 401, 403, 404, 409].includes(error.status)) {
          const target = session.messages.find(message => message.id === task.messageId); if (target) target.error = error.message
          session.pendingTask = null
          if (error.code === 'READER_AI_DISABLED' && session.activeNovel.novelId === session.novelId) this.authorDisabled = true
        }
      } finally { if (version === this.runVersion) { this.busy = false; this.streamController = null; this.persist() } }
    }
  }
}
</script>

<style scoped>
.ai-resource-links{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:12px 20px;font-size:13px}
.reader-ai{max-width:1320px;margin:0 auto;padding:30px 28px 45px;color:#4e493f}.ai-page-head{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px}.ai-page-head h1{font-size:28px;margin:10px 0}.ai-page-head p{color:#938b7f;font-size:14px;margin:0}a{color:#88724f;text-decoration:none}a:hover{text-decoration:underline}button,input,textarea{font:inherit}button{cursor:pointer;border:1px solid #e5ded3;border-radius:7px;background:#fff;color:#685b48;padding:7px 11px;font-size:13px}button:hover{background:#f6f2ec}button:disabled{opacity:.5;cursor:default}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:2px solid #8d9d63;outline-offset:3px}.ai-gate{background:#fff;border:1px solid #e8e4dc;border-radius:14px;padding:64px 30px;text-align:center;line-height:1.8}.ai-workspace{display:grid;grid-template-columns:252px minmax(0,1fr);border:1px solid #e5dfd5;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 5px 25px #453a2510;min-height:620px}.ai-sidebar{background:#faf8f4;border-right:1px solid #e5dfd5;padding:20px 15px;display:flex;flex-direction:column;min-width:0}.sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.sidebar-head h2{font-size:17px;margin:0}.history-search{font-size:12px;color:#94897b;display:grid;gap:7px;margin:20px 0 12px}.history-search input{min-width:0;box-sizing:border-box;width:100%;padding:9px;border:1px solid #ded8cf;background:#fff;border-radius:7px;color:#4e493f}.history-list{max-height:570px;overflow:auto;flex:1}.history-group h3{font-size:12px;color:#9a8d7b;font-weight:500;margin:18px 4px 8px;overflow-wrap:anywhere}.history-row{display:flex;border-radius:8px;margin-bottom:4px}.history-row.selected{background:#eaeede}.history-item{flex:1;text-align:left;background:transparent;border:0;min-width:0;display:grid;gap:7px;padding:12px 8px}.history-item strong{font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.history-item small{font-size:11px;color:#a09789}.history-delete{padding:5px;background:transparent;border:0;align-self:center;color:#a99e8d;font-size:18px}.clear-history{margin-top:20px;font-size:11px;background:transparent}.ai-main{position:relative;min-width:0;display:flex;flex-direction:column}.conversation-head{padding:22px 28px 17px;display:flex;justify-content:space-between;gap:15px;align-items:center;border-bottom:1px solid #eee9e0}.conversation-head h2{font-size:17px;margin:0 0 7px;overflow-wrap:anywhere}.conversation-head p{font-size:12px;color:#918472;margin:0}.conversation-head button{flex-shrink:0;max-width:220px;overflow-wrap:anywhere}.ai-metrics{padding:12px 28px;display:flex;align-items:start;flex-wrap:wrap;gap:12px 20px;background:#fcfbf8;font-size:12px;border-bottom:1px solid #eee9e0}.ai-metrics details{flex:0 1 230px}.ai-metrics p{line-height:1.7;margin:12px 0 8px}summary{cursor:pointer;color:#8c795f}.quiet{color:#a29686;font-size:12px;line-height:1.8}.ai-messages{height:min(54vh,590px);min-height:290px;overflow:auto;overscroll-behavior:contain;padding:20px 28px 30px;scrollbar-gutter:stable}.chat-welcome{max-width:500px;margin:44px auto;text-align:center}.welcome-mark{display:inline-grid;place-content:center;font-size:32px;background:#eff1e5;color:#809454;width:65px;height:65px;border-radius:18px}.chat-welcome h2{font-size:22px;margin:20px 0 14px}.chat-welcome p{line-height:1.8;font-size:14px;color:#8e8578}.question-chips{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:23px 0}.question-chips button{font-size:12px;border-color:#e2e7d4;background:#f8faf1;color:#778452}.ai-message{padding:22px 0;border-bottom:1px solid #f0ebe3;overflow-wrap:anywhere}.message-label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.message-label strong{font-size:13px;color:#889652}.ai-message.user .message-label strong{color:#9a8567}.message-actions{display:flex;gap:12px}.message-actions button{background:none;border:0;padding:0;font-size:11px;color:#9a8d79}.user-text{white-space:pre-wrap;font-size:14px;line-height:1.8;background:#f7f4ef;border-radius:9px;padding:14px 16px;margin:0}.ai-markdown{font-size:14px;line-height:1.8;overflow-wrap:anywhere;min-width:0}.ai-markdown ::v-deep a.ai-citation{font-size:11px;color:#7c934f;padding:1px 5px;background:#eef3e1;border-radius:4px;margin:0 3px}.ai-markdown ::v-deep table{max-width:100%}.thinking,.citations{font-size:12px;line-height:1.8;margin:12px 0;padding:10px 13px;border:1px solid #eee7db;border-radius:7px;background:#faf8f4}.thinking ol,.citations ol{padding-left:20px;color:#948a7c;white-space:pre-wrap}.thinking li{margin:6px 0}.citations blockquote{border-left:2px solid #d4c8b3;padding-left:12px;margin:9px 0 14px;color:#9b8a72}.ai-composer{padding:18px 28px 16px;border-top:1px solid #e9e2d7;background:#fff}.ai-composer textarea{display:block;width:100%;box-sizing:border-box;resize:vertical;border:1px solid #e2d9cb;border-radius:10px;background:#fcfbf8;padding:14px;color:#4c453a;font-size:14px;line-height:1.7;min-height:90px;max-height:250px}.composer-footer{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:12px}.composer-footer fieldset{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:16px;font-size:13px}.composer-footer fieldset label{cursor:pointer;display:flex;align-items:center;gap:5px}.composer-footer small{font-size:11px;color:#a68d6b}.send{background:#839556;color:#fff;border-color:#839556;min-width:92px;padding:10px 15px}.send:hover{background:#748649;color:#fff}.composer-hint{font-size:11px;color:#aa9f91;margin:10px 0 0}.ai-error{font-size:13px;color:#b65341;line-height:1.7;white-space:pre-wrap;margin:0 0 12px}.resource-help{display:flex;gap:20px;font-size:13px;margin:10px 0}.resume-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:#f9f4e9;padding:12px;border-radius:8px;margin-bottom:12px;font-size:12px;color:#a08b65}.resume-row span{flex:1 1 280px;line-height:1.8}.jump-bottom{position:absolute;right:32px;bottom:245px;box-shadow:0 2px 12px #0001;z-index:1}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:950px){.reader-ai{padding:22px 16px}.ai-workspace{grid-template-columns:210px minmax(0,1fr)}.conversation-head,.ai-composer{padding:18px}.ai-messages{padding:16px 18px}.ai-metrics{padding:10px 18px}.composer-footer{align-items:end}.composer-footer fieldset{gap:8px}}@media(max-width:700px){.reader-ai{padding:18px 10px}.ai-page-head h1{font-size:23px}.ai-page-head>a{font-size:12px}.ai-workspace{display:flex;flex-direction:column}.ai-sidebar{border-right:0;border-bottom:1px solid #e5dfd5;padding:12px}.history-search{margin:10px 0}.history-list{max-height:130px;display:flex;gap:16px}.history-group{min-width:170px;max-width:230px}.history-group h3{margin-top:2px}.clear-history{margin-top:8px;align-self:start}.conversation-head{flex-wrap:wrap}.ai-messages{height:430px}.message-actions{gap:8px}.composer-footer fieldset{font-size:12px}.composer-footer small{font-size:10px}.send{min-width:75px}.jump-bottom{right:18px}.chat-welcome{margin:25px auto}}
</style>
