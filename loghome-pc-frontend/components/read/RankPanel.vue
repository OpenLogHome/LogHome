<template>
  <section class="rank-panel" :class="{ full }" aria-label="作品排行榜">
    <header class="rank-heading">
      <div><h1 v-if="full">{{ selectedBoard.label }} · {{ selectedZone.label }}作品{{ requestedPage > 1 ? ` · 第 ${requestedPage} 页` : '' }}</h1><h2 v-else>发现好作品</h2><p v-if="full">{{ selectedBoard.description }}</p></div>
      <div class="rank-actions">
        <button type="button" :disabled="loading" @click="loadFirst(true)">刷新</button>
        <nuxt-link v-if="!full" :to="`/read/rank?board=${board}&zone=${zone}`">完整榜单 →</nuxt-link>
        <nuxt-link v-else to="/read">返回书库</nuxt-link>
      </div>
    </header>
    <div class="rank-controls">
      <div class="board-buttons" aria-label="选择榜单">
        <nuxt-link v-for="item in boards" :key="item.key" :to="rankUrl(item.key, zone)" :aria-current="board === item.key ? 'page' : null" :class="{ active: board === item.key }" @click.native.prevent="select(item.key, zone)">
          <template v-if="item.key === 'logpower'"><LogPowerWordmark />榜</template><template v-else>{{ item.label }}</template>
        </nuxt-link>
      </div>
      <div class="zone-buttons" aria-label="选择作品类型">
        <nuxt-link v-for="item in zones" :key="item.key" :to="rankUrl(board, item.key)" :aria-current="zone === item.key ? 'page' : null" :class="{ active: zone === item.key }" @click.native.prevent="select(board, item.key)">{{ item.label }}</nuxt-link>
      </div>
    </div>
    <p v-if="snapshot && items.length" class="rank-snapshot">更新于 {{ dateText(snapshot) }} · {{ items.length }} 部作品</p>
    <div v-if="loading && !items.length" class="rank-skeleton" aria-label="榜单加载中" aria-busy="true"><div v-for="n in full ? 12 : 9" :key="n"></div></div>
    <div v-else-if="items.length" class="rank-grid">
      <WorkCard v-for="(work, index) in items" :key="work.novel_id" :work="work" :rank="Number(work.position) || index + 1" :compact="!full" :show-score="board === 'logpower' || board === 'new'" />
    </div>
    <p v-else-if="!error" class="rank-state">这个榜单还没有作品，换个分类看看。</p>
    <div v-if="error" class="rank-state rank-error" role="alert">{{ error }} <button @click="retry">重试</button></div>
    <div v-if="full && items.length" class="rank-bottom">
      <button v-if="hasMore" :disabled="loading" @click="loadMore">{{ loading ? '正在加载…' : '加载更多' }}</button>
      <span v-else>已显示全部上榜作品</span>
      <nav class="rank-page-links" aria-label="榜单分页"><nuxt-link v-if="requestedPage > 1" :to="rankUrl(board, zone, requestedPage - 1)" rel="prev">上一页</nuxt-link><nuxt-link v-if="hasMore" :to="rankUrl(board, zone, page + 1)" rel="next">第 {{ page + 1 }} 页 →</nuxt-link></nav>
    </div>
  </section>
</template>

<script>
import WorkCard from './WorkCard.vue'
import LogPowerWordmark from '~/components/LogPowerWordmark.vue'
import { READING_BOARDS, READING_ZONES, uniqueWorks, dateText } from '~/utils/reading-discovery'
import { readingHead, readingPage, workListSchema, readingResponseStatus } from '~/utils/reading-seo'
export default {
  components: { WorkCard, LogPowerWordmark }, props: { full: Boolean },
  data() {
    const query = this.full ? this.$route.query : {}
    return {
      boards: READING_BOARDS, zones: READING_ZONES,
      board: READING_BOARDS.some(item => item.key === query.board) ? query.board : 'update',
      zone: READING_ZONES.some(item => item.key === query.zone) ? query.zone : 'all',
      items: [], page: 1, snapshot: '', batchId: null, loading: false, hasMore: false,
      error: '', version: 0, failedPage: 1, cache: {}
    }
  },
  async fetch() { await this.loadFirst() },
  head() { return this.full ? readingHead({ title: `${this.selectedBoard.label} · ${this.selectedZone.label}作品${this.requestedPage > 1 ? ` 第 ${this.requestedPage} 页` : ''} - 原木社区`, description: this.selectedBoard.description, path: '/read/rank', query: this.$route.query, schema: workListSchema(this.items, this.selectedBoard.label, (this.requestedPage - 1) * this.amount), noindex: !!this.error || (this.requestedPage > 1 && !this.items.length) }) : {} },
  computed: { amount() { return this.full ? 20 : 12 }, selectedBoard() { return this.boards.find(item => item.key === this.board) }, selectedZone() { return this.zones.find(item => item.key === this.zone) }, requestedPage() { return this.full ? readingPage(this.$route.query.page) : 1 } },
  watch: {
    '$route.query': function (query) {
      if (!this.full) return
      const board = this.boards.some(item => item.key === query.board) ? query.board : 'update'
      const zone = this.zones.some(item => item.key === query.zone) ? query.zone : 'all'
      if (board !== this.board || zone !== this.zone) { this.board = board; this.zone = zone; this.loadFirst() }
    },
    requestedPage() { if (this.full) this.loadFirst() }
  },
  beforeDestroy() { this.version++ },
  methods: {
    dateText,
    rankUrl(board, zone, page = 1) { return { path: '/read/rank', query: { board, zone, ...(page > 1 ? { page } : {}) } } },
    select(board, zone) {
      if (board === this.board && zone === this.zone) return
      this.board = board; this.zone = zone
      if (this.full) this.$router.replace(this.rankUrl(board, zone))
      this.loadFirst()
    },
    async loadFirst(force = false) {
      const version = ++this.version
      const key = `${this.board}:${this.zone}`
      const requestedPage = this.requestedPage
      const cached = this.cache[key]
      this.items = cached && Date.now() - cached.savedAt < 600000 ? cached.items : []
      this.page = 1; this.batchId = null; this.snapshot = ''; this.hasMore = false; this.error = ''; this.failedPage = 1
      if (!force && !this.full && this.items.length) { this.loading = false; this.snapshot = cached.snapshot; return }
      this.loading = true
      try {
        let payload = await this.$api.reading.getRank({ board: this.board, zone: this.zone, page: 1, amount: this.amount })
        if (version !== this.version) return
        if (requestedPage > 1) {
          try { payload = await this.$api.reading.getRank({ board: this.board, zone: this.zone, page: requestedPage, amount: this.amount, batch_id: payload.batch_id }) }
          catch (error) {
            if (error.status !== 410) throw error
            const fresh = await this.$api.reading.getRank({ board: this.board, zone: this.zone, page: 1, amount: this.amount })
            if (version !== this.version) return
            payload = await this.$api.reading.getRank({ board: this.board, zone: this.zone, page: requestedPage, amount: this.amount, batch_id: fresh.batch_id })
          }
        }
        if (version !== this.version) return
        this.items = uniqueWorks(payload.items); this.snapshot = payload.snapshot_date || ''; this.batchId = payload.batch_id || null; this.page = requestedPage
        this.hasMore = this.items.length >= this.amount
        if (requestedPage > 1 && !this.items.length) readingResponseStatus(this, 404)
        this.$set(this.cache, key, { items: this.items, snapshot: this.snapshot, savedAt: Date.now() })
      } catch (_) { if (version === this.version) { this.error = '榜单暂时加载失败，请重试。'; if (this.full) readingResponseStatus(this, 503) } }
      finally { if (version === this.version) this.loading = false }
    },
    async loadMore() {
      if (this.loading || !this.hasMore) return
      const version = this.version, next = this.page + 1
      this.loading = true; this.error = ''; this.failedPage = next
      try {
        const payload = await this.$api.reading.getRank({ board: this.board, zone: this.zone, page: next, amount: this.amount, batch_id: this.batchId })
        if (version !== this.version) return
        this.items = uniqueWorks([...this.items, ...payload.items]); this.page = next
        this.hasMore = payload.items.length >= this.amount
      } catch (error) {
        if (version !== this.version) return
        if (error.status === 410) { this.loading = false; return this.loadFirst(true) }
        this.error = '未能加载下一页，已保留当前榜单。'
      } finally { if (version === this.version) this.loading = false }
    },
    retry() { return this.failedPage > 1 ? this.loadMore() : this.loadFirst(true) }
  }
}
</script>

<style scoped>
.rank-panel { padding: 26px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); border-radius: 12px; }
.rank-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 22px; }
.rank-heading h1, .rank-heading h2 { font-size: 21px; font-weight: 600; letter-spacing: -.4px; color: var(--reading-ink, #302f2a); }
.rank-heading h1 { font-size: 28px; line-height: 1.4; }
.rank-heading p { font-size: 14px; line-height: 1.7; color: var(--reading-muted, #73716a); margin-top: 8px; }
.rank-actions { display: flex; gap: 16px; align-items: center; font-size: 13px; flex-shrink: 0; }
.rank-actions a { color: var(--reading-accent, #79573c); text-decoration: none; }
button { font: inherit; cursor: pointer; }
.rank-actions button { color: var(--reading-muted, #73716a); border: 0; background: none; padding: 8px 4px; }
.rank-controls { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; padding-bottom: 18px; border-bottom: 1px solid var(--reading-line, #e4e3de); }
.board-buttons, .zone-buttons { display: flex; gap: 4px; flex-wrap: wrap; }
.board-buttons { background: var(--reading-hover, #f5f4f0); padding: 4px; border-radius: 8px; }
.board-buttons a, .zone-buttons a { padding: 8px 12px; font-size: 13px; border: 0; border-radius: 5px; color: var(--reading-secondary, #615e57); text-decoration: none; white-space: nowrap; transition: background .18s ease, color .18s ease; }
.board-buttons a:hover, .zone-buttons a:hover { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de); }
.board-buttons a.active { color: #fff; background: var(--reading-accent, #79573c); }
.zone-buttons a { padding: 8px 10px; background: none; }
.zone-buttons a.active { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de); font-weight: 600; }
.rank-grid, .rank-skeleton { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 22px; margin-top: 12px; }
.full .rank-grid, .full .rank-skeleton { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 24px; }
.rank-skeleton div { height: 110px; border-radius: 8px; background: var(--reading-hover, #f5f4f0); }
.rank-snapshot { font-size: 12px; color: var(--reading-muted, #73716a); margin-top: 16px; font-variant-numeric: tabular-nums; }
.rank-state { padding: 40px 16px; font-size: 14px; line-height: 1.8; text-align: center; color: var(--reading-muted, #73716a); }
.rank-error { color: #9d503b; }
.rank-state button, .rank-bottom button { border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); padding: 10px 20px; border-radius: 6px; }
.rank-bottom { text-align: center; font-size: 13px; color: var(--reading-muted, #73716a); margin-top: 28px; }
.rank-page-links { display: flex; justify-content: center; gap: 24px; margin-top: 18px; font-size: 13px; }.rank-page-links a { color: var(--reading-accent, #79573c); text-decoration: none; }
button:disabled { opacity: .5; cursor: wait; }
button:focus-visible, a:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px; }
.full { padding: 32px; }
@media (min-width: 1440px) { .rank-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 1100px) { .full .rank-grid, .full .rank-skeleton { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .rank-grid, .full .rank-grid, .rank-skeleton, .full .rank-skeleton { grid-template-columns: 1fr; } .rank-panel, .full { padding: 20px 16px; } .rank-heading { align-items: flex-start; flex-wrap: wrap; } .rank-heading h1 { font-size: 24px; } .rank-actions { gap: 14px; } .rank-controls { gap: 12px; } .board-buttons a { padding: 8px 10px; } }
@media (prefers-reduced-motion: reduce) { .board-buttons a, .zone-buttons a { transition: none; } }
</style>
