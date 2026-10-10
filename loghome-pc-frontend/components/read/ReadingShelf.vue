<template>
  <section class="reading-shelf" :class="{ full }" aria-label="我的书架">
    <header class="shelf-header">
      <h2>我的书架</h2>
      <nuxt-link v-if="!full" to="/read/bookcase">全部 →</nuxt-link>
      <nuxt-link v-else to="/read">返回书库</nuxt-link>
    </header>
    <div class="shelf-toolbar">
      <div class="shelf-tabs">
        <button v-for="item in tabs" :key="item.key" :class="{ active: tab === item.key }" :aria-pressed="tab === item.key" @click="tab = item.key">{{ item.label }}</button>
      </div>
      <button class="shelf-refresh" :disabled="loading" @click="load">{{ loading ? '同步中…' : '刷新' }}</button>
    </div>
    <label v-if="full" class="shelf-search">查找书架作品 <input v-model="keyword" type="search" placeholder="书名或作者"></label>
    <p v-if="!loggedIn" class="shelf-hint"><nuxt-link to="/login">登录</nuxt-link>后同步收藏与阅读进度。</p>
    <p v-if="error" class="shelf-error" role="alert">{{ error }} <nuxt-link v-if="authExpired" :to="loginUrl">重新登录</nuxt-link><button v-else @click="load">重试</button></p>
    <div v-if="visibleBooks.length" class="shelf-grid">
      <div v-for="book in visibleBooks" :key="book.novel_id" class="shelf-item">
        <WorkCard :work="book" :compact="!full" :destination="resumeUrl(book)" />
        <div v-if="full" class="shelf-item-actions">
          <nuxt-link :to="workUrl(book)">作品详情</nuxt-link>
          <button v-if="book.inShelf && loggedIn" :disabled="loading || !!removing || authExpired" @click="remove(book)">{{ removing === book.novel_id ? '处理中…' : '移出书架' }}</button>
        </div>
      </div>
    </div>
    <div v-else class="shelf-empty">{{ loading ? '正在整理书架…' : keyword ? '没有找到匹配的作品。' : tab === 'history' ? '阅读过的作品会显示在这里。' : '收藏喜欢的作品，随时回来接着读。' }}</div>
    <p v-if="!full && filteredBooks.length > 4" class="shelf-count">还有 {{ filteredBooks.length - 4 }} 部作品在书架中</p>
  </section>
</template>

<script>
import { textReaderResumeUrl } from '~/utils/reader-position'
import WorkCard from './WorkCard.vue'
import { readingToken } from '~/plugins/api/reading'
import { readingAccountKey, localReadingHistory, localReadingProgress } from '~/utils/reading-history'
import { asList, mergeShelf, mergeReadingHistory, uniqueWorks, workUrl } from '~/utils/reading-discovery'
import { loginReturnPath } from '~/utils/login-return'

function storageRead(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback } catch (_) { return fallback }
}
export default {
  components: { WorkCard }, props: { full: Boolean },
  data: () => ({
    tabs: [{ key: 'all', label: '全部' }, { key: 'favorites', label: '收藏' }, { key: 'history', label: '最近阅读' }],
    tab: 'all', books: [], keyword: '', loading: true, error: '', loggedIn: false,
    version: 0, removing: null, account: null, identityVersion: 0, removeVersion: 0, authExpired: false
  }),
  computed: {
    filteredBooks() {
      const keyword = this.keyword.trim().toLowerCase()
      return this.books.filter(book => (this.tab !== 'favorites' || book.inShelf) &&
        (this.tab !== 'history' || book.historyIndex != null) &&
        (!keyword || `${book.name} ${book.author_name}`.toLowerCase().includes(keyword)))
    },
    visibleBooks() { return this.full ? this.filteredBooks : this.filteredBooks.slice(0, 4) },
    loginUrl() { return { path: '/login', query: { redirect: loginReturnPath(this.$route.fullPath) } } }
  },
  mounted() { this.load(); window.addEventListener('storage', this.onStorage); window.addEventListener('focus', this.checkAccount); window.addEventListener('auth-state-changed', this.checkAccount) },
  beforeDestroy() { this.version++; this.identityVersion++; this.removeVersion++; this.books = []; window.removeEventListener('storage', this.onStorage); window.removeEventListener('focus', this.checkAccount); window.removeEventListener('auth-state-changed', this.checkAccount) },
  methods: {
    workUrl,
    checkAccount() { if (this.account === readingToken()) return false; this.load(); return true },
    expired(error) { return [401, 403].includes(Number(error && (error.status || error.response && error.response.status))) },
    clearExpiredShelf(token) {
      this.authExpired = true; this.books = []; this.error = '登录状态已过期，请重新登录后同步书架。'
      try { localStorage.removeItem(`loghome_pc_shelf_${readingAccountKey(token)}`) } catch (_) {}
    },
    onStorage(event) { if (event.key === 'token' || event.key === 'loghomeReaderHistory' || (event.key || '').startsWith('loghome_pc_history_')) this.load() },
    resumeUrl(book) {
      if (Number(book.last_article_id) > 0 && book.novel_type !== 'world') {
        return book.novel_type === 'manga' ? `/manga/read/${book.last_article_id}?novelId=${book.novel_id}&pageIdx=${Number(book.last_page_idx) || 0}` : textReaderResumeUrl(book)
      }
      return workUrl(book)
    },
    async load() {
      const token = readingToken()
      if (token !== this.account) { this.account = token; this.identityVersion++; this.removeVersion++; this.removing = null; this.keyword = '' }
      const version = ++this.version
      this.loggedIn = !!token; this.loading = true; this.error = ''; this.authExpired = false; this.books = []
      const localHistory = localReadingHistory(token)
      if (!token) { this.books = mergeShelf([], localHistory); this.loading = false; return }
      const key = `loghome_pc_shelf_${readingAccountKey(token)}`, cache = storageRead(key, null)
      this.books = cache && cache.version === 1 ? uniqueWorks(cache.books) : mergeShelf([], localHistory)
      const results = await Promise.allSettled([this.$api.reading.getShelf(), this.$api.reading.getHistory()])
      if (version !== this.version || token !== readingToken()) return
      if (results.some(result => result.status === 'rejected' && this.expired(result.reason))) { this.clearExpiredShelf(token); this.loading = false; return }
      if (results.some(result => result.status === 'fulfilled' && !Array.isArray(result.value))) { this.error = '部分书架数据暂不可用，请重试。' }
      const likes = results[0].status === 'fulfilled' && Array.isArray(results[0].value) ? results[0].value : this.books.filter(book => book.inShelf)
      const cloudHistory = results[1].status === 'fulfilled' && Array.isArray(results[1].value) ? results[1].value : this.books.filter(book => book.historyIndex != null)
      const history = mergeReadingHistory(cloudHistory, localHistory)
      this.books = mergeShelf(likes, history)
      if (results.some(result => result.status === 'rejected')) this.error = '部分书架数据未能同步，已保留可用记录。'
      try {
        const checked = uniqueWorks(likes).map(book => {
          const record = history.find(item => item.novel_id === book.novel_id)
          let chapter = 0
          chapter = Number((localReadingProgress(book.novel_id, token) || {}).last_article_chapter) || 0
          return { novel_id: book.novel_id, latest_chapter: Math.max(chapter, Number((record || {}).last_article_chapter) || 0) }
        })
        const updates = checked.length ? await this.$api.reading.getUpdates(checked) : { updates: [] }
        if (version !== this.version || token !== readingToken()) return
        this.books = mergeShelf(likes, history, updates.updates)
        localStorage.setItem(key, JSON.stringify({ version: 1, books: this.books }))
      } catch (_) { if (version === this.version && !this.error) this.error = '更新提示暂时不可用，作品仍可正常打开。' }
      finally { if (version === this.version) this.loading = false }
    },
    async remove(book) {
      if (this.checkAccount()) return
      if (!this.loggedIn || this.authExpired) { this.$router.push(this.loginUrl); return }
      const id = Number(book && book.novel_id)
      if (!Number.isSafeInteger(id) || id < 1 || !this.books.some(row => Number(row.novel_id) === id && row.inShelf) || this.removing || this.loading) return
      const token = this.account, identity = this.identityVersion, operation = ++this.removeVersion
      const current = () => identity === this.identityVersion && operation === this.removeVersion && token === this.account && token === readingToken()
      this.removing = id
      try {
        await this.$confirm('确定将这部作品移出书架？', '取消收藏', { type: 'warning' })
        if (!current() || !this.books.some(row => Number(row.novel_id) === id && row.inShelf)) return
        await this.$api.reading.removeFavorite(id)
        if (current()) await this.load()
      }
      catch (error) { if (current() && error !== 'cancel' && error !== 'close') { if (this.expired(error)) this.clearExpiredShelf(token); else this.error = '未能移出书架，请重试。' } }
      finally { if (current()) this.removing = null }
    }
  }
}
</script>

<style scoped>
.reading-shelf { padding: 22px; border-radius: 12px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); }
.shelf-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.shelf-header h2 { font-size: 18px; font-weight: 600; color: var(--reading-ink, #302f2a); letter-spacing: -.3px; }
.shelf-header a, .shelf-hint a, .shelf-item-actions a { font-size: 13px; color: var(--reading-accent, #79573c); text-decoration: none; }
.shelf-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px; }
.shelf-tabs { display: flex; gap: 2px; }
button { cursor: pointer; font: inherit; }
.shelf-tabs button { padding: 7px 8px; font-size: 12px; color: var(--reading-muted, #73716a); background: none; border: 0; border-radius: 5px; white-space: nowrap; }
.shelf-tabs .active { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de); font-weight: 600; }
.shelf-refresh { padding: 6px 0 6px 6px; font-size: 12px; background: none; border: 0; color: var(--reading-muted, #73716a); white-space: nowrap; }
.shelf-grid { display: grid; gap: 4px; }
.shelf-item { min-width: 0; }
.full { padding: 32px; min-height: 60vh; }
.full .shelf-header { padding-bottom: 20px; border-bottom: 1px solid var(--reading-line, #e4e3de); }
.full .shelf-header h2 { font-size: 28px; }
.full .shelf-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 28px; }
.full .shelf-tabs button { font-size: 14px; padding: 9px 14px; }
.shelf-empty { padding: 40px 12px; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8; text-align: center; }
.shelf-hint, .shelf-count { font-size: 12px; color: var(--reading-muted, #73716a); margin: 16px 0 0; line-height: 1.8; }
.shelf-error { font-size: 13px; color: #9d503b; line-height: 1.8; margin-bottom: 12px; }
.shelf-error button { color: var(--reading-accent, #79573c); border: 0; background: none; text-decoration: underline; }
.shelf-search { display: flex; gap: 14px; align-items: center; font-size: 13px; color: var(--reading-secondary, #615e57); margin: 20px 0 24px; flex-wrap: wrap; }
.shelf-search input { border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-hover, #f5f4f0); border-radius: 6px; padding: 11px 14px; width: min(320px, 100%); font: inherit; color: var(--reading-ink, #302f2a); }
.shelf-item-actions { display: flex; justify-content: space-between; gap: 10px; padding: 8px 10px; }
.shelf-item-actions button { font-size: 12px; color: var(--reading-muted, #73716a); background: none; border: 0; }
.shelf-item-actions button:hover { color: #9d503b; }
button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px; }
button:disabled { opacity: .5; }
@media (max-width: 1024px) { .full .shelf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .full .shelf-grid { grid-template-columns: 1fr; gap: 16px; } .full { padding: 20px 16px; } .full .shelf-header h2 { font-size: 24px; } }
</style>
