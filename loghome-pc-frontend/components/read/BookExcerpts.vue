<template>
  <section class="book-excerpts">
    <header><h2>书摘</h2><div><button v-for="item in tabs" :key="item.key" :aria-pressed="tab === item.key" :class="{ active: tab === item.key }" @click="tab = item.key">{{ item.label }}</button><button :disabled="loading" @click="load">刷新</button></div></header>
    <p v-if="error" class="notice" role="alert">{{ error }} <nuxt-link v-if="(!loggedIn || authExpired) && tab === 'my'" :to="loginUrl">登录</nuxt-link><button v-else @click="load">重试</button></p>
    <p v-if="!items.length && !error" class="empty">{{ loading ? '正在加载书摘…' : tab === 'my' ? '阅读时右键段落，添加划线即可收藏为书摘。' : '暂无热门书摘。' }}</p>
    <div v-else class="excerpts-grid"><article v-for="(excerpt, index) in items" :key="excerpt.article_cento_id || `${excerpt.article_id}:${excerpt.paragraph_id}:${index}`">
      <nuxt-link :to="`/article/${excerpt.article_id}?paragraphId=${excerpt.paragraph_id}`" @click.native="navigateExcerpt($event,excerpt)"><blockquote>{{ excerpt.paragraph }}</blockquote><p>第 {{ excerpt.article_chapter }} 章 · {{ excerpt.title || excerpt.article_title }}</p></nuxt-link>
      <div class="excerpt-actions"><span v-if="tab === 'hot'">{{ excerpt.highlight_count || 0 }} 次划线 · {{ excerpt.comment_count || 0 }} 条段评</span><button v-if="tab === 'my'" :disabled="!!removing" @click="remove(excerpt)">移除划线</button></div>
    </article></div>
  </section>
</template>
<script>
import { readingToken } from '~/plugins/api/reading'
export default {
  props: { novelId: { type: [Number, String], required: true } },
  data: () => ({ tabs: [{ key: 'my', label: '我的书摘' }, { key: 'hot', label: '热门书摘' }], tab: 'hot', items: [], loading: false, error: '', loggedIn: false, authExpired: false, removing: null, version: 0, removeVersion: 0, accountToken: null, accountEpoch: 0 }),
  computed: { loginUrl() { return { path: '/login', query: { redirect: this.$route.fullPath } } } },
  async fetch() { await this.load() },
  mounted() {
    this.checkAccount()
    window.addEventListener('storage', this.checkAccount)
    window.addEventListener('focus', this.checkAccount)
    window.addEventListener('auth-state-changed', this.checkAccount)
  },
  watch: { tab() { this.resetScope(); this.load() }, novelId() { this.resetScope(); this.load() } },
  beforeDestroy() {
    this.resetScope()
    window.removeEventListener('storage', this.checkAccount)
    window.removeEventListener('focus', this.checkAccount)
    window.removeEventListener('auth-state-changed', this.checkAccount)
  },
  methods: {
    navigateExcerpt(event, excerpt) { if (event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; this.$emit('navigate',excerpt) },
    resetScope() { this.version++; this.removeVersion++; this.items = []; this.error = ''; this.loading = false; this.removing = null; this.authExpired = false },
    checkAccount() {
      const token = readingToken()
      if (token === this.accountToken) return
      this.accountToken = token; this.accountEpoch++; this.loggedIn = !!token; this.resetScope()
      const tab = token ? 'my' : 'hot'
      if (tab !== this.tab) this.tab = tab
      else this.load()
    },
    currentScope(token, epoch, novelId, tab) { return token === readingToken() && epoch === this.accountEpoch && String(novelId) === String(this.novelId) && tab === this.tab },
    async load() {
      const version = ++this.version, token = readingToken(), epoch = this.accountEpoch, novelId = this.novelId, tab = this.tab
      const current = () => version === this.version && this.currentScope(token, epoch, novelId, tab)
      this.loading = true; this.error = ''; this.loggedIn = !!token; this.authExpired = false
      try {
        const items = await (tab === 'my' ? this.$api.reader.excerpts(novelId) : this.$api.reader.hotExcerpts(novelId))
        if (!Array.isArray(items)) throw new Error('书摘数据暂不可用，请重试。')
        if (current()) this.items = items
      } catch (error) { if (current()) { this.error = error.message || '书摘加载失败。'; if (tab === 'my' && [401,403].includes(error.status)) { this.items = []; this.authExpired = true; this.error = '登录状态已过期，请重新登录后查看我的书摘。' } } }
      finally { if (current()) this.loading = false }
    },
    async remove(excerpt) {
      if (this.removing || this.tab !== 'my' || !readingToken()) return
      const token = readingToken(), epoch = this.accountEpoch, novelId = this.novelId, tab = this.tab, version = ++this.removeVersion
      const current = () => version === this.removeVersion && this.currentScope(token, epoch, novelId, tab)
      this.removing = excerpt.article_cento_id
      try {
        await this.$confirm('移除这条划线书摘？', '移除书摘', { type: 'warning' })
        if (!current()) return
        await this.$api.reader.unhighlight(excerpt.article_cento_id)
        if (!current()) return
        await this.load(); if (current()) this.$emit('changed')
      } catch (error) { if (current() && error !== 'cancel' && error !== 'close') { this.error = error.message || '移除失败，请重试。'; if ([401,403].includes(error.status)) { this.items = []; this.authExpired = true; this.error = '登录状态已过期，请重新登录后查看我的书摘。' } } }
      finally { if (current()) this.removing = null }
    }
  }
}
</script>
<style scoped>
.book-excerpts { padding: 24px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); border-radius: 12px; }
header { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 24px; flex-wrap: wrap; }
h2 { color: var(--reading-ink, #302f2a); font-size: 20px; font-weight: 600; }
header div { display: flex; gap: 6px; flex-wrap: wrap; }
button { padding: 9px 12px; border: 1px solid var(--reading-line, #e4e3de); border-radius: 6px; background: none; color: var(--reading-accent, #79573c); cursor: pointer; font: inherit; font-size: 13px; }
button.active { background: var(--reading-accent, #79573c); border-color: var(--reading-accent, #79573c); color: white; }
button:disabled { opacity: .5; }
.empty { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8; }
.notice { color: #9d503b; font-size: 13px; margin-bottom: 16px; line-height: 1.8; }
.excerpts-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; }
article { padding: 24px; background: var(--reading-hover, #f5f4f0); border: 0; border-radius: 8px; min-width: 0; }
a { color: inherit; text-decoration: none; }
blockquote { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 15px; line-height: 1.95; color: var(--reading-ink, #302f2a); border-left: 2px solid var(--reading-accent, #79573c); padding-left: 18px; }
article p, .excerpt-actions { color: var(--reading-muted, #73716a); font-size: 12px; line-height: 1.8; margin-top: 20px; }
.excerpt-actions { display: flex; justify-content: flex-end; }
.excerpt-actions button { border: 0; font-size: 12px; padding: 4px 0; }
button:focus-visible,a:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px; }
@media(max-width:700px) { .excerpts-grid { grid-template-columns: 1fr; } .book-excerpts { padding: 20px 16px; } article { padding: 20px; } }
</style>
