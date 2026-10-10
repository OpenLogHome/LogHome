<template>
  <div class="reading-discovery">
    <nav v-if="requestedPage === 1 && configuredTags.length" class="discovery-tags" aria-label="精选分类">
      <template v-for="tag in configuredTags">
        <a v-if="tag.link.external" :key="tag.tag_id" :href="tag.link.href" target="_blank" rel="noopener noreferrer" :style="{ color: tag.tag_color }"><img v-if="tag.tag_icon" :src="tag.tag_icon" alt="">{{ tag.tag_name }} ↗</a>
        <nuxt-link v-else :key="tag.tag_id" :to="tag.link.href" :style="{ color: tag.tag_color }"><img v-if="tag.tag_icon" :src="tag.tag_icon" alt="">{{ tag.tag_name }} →</nuxt-link>
      </template>
    </nav>
    <p v-if="errors.tags" class="discovery-notice" role="alert">分类入口暂时未能加载。<button @click="loadDiscovery">重试</button></p>
    <div class="discovery-layout">
      <div class="discovery-main">
        <BannerSwiper v-if="requestedPage === 1 && chartList.length" class="discovery-carousel" :chart-list="chartList" :show-navigation="false" />
        <p v-if="errors.collections" class="discovery-notice" role="alert">推荐内容暂时未能更新，已保留可用内容。<button @click="loadDiscovery">重试</button></p>
        <div v-if="refreshing && !collections.length" class="discovery-loading">正在寻找好作品…</div>
        <template v-for="block in requestedPage === 1 ? collections : []">
          <RankPanel v-if="block.collection_title === '最近更新'" :key="block.collection_id" ref="rankPanels" />
          <Banner v-else-if="block.collection_title === 'banner'" :key="block.collection_id" page="library" />
          <section v-else-if="block.novels.length || block.error" :key="block.collection_id" class="discovery-block">
            <header class="block-header">
              <h2><img v-if="block.icon" :src="block.icon" alt=""><template v-if="block.collection_title.startsWith('原木力')"><LogPowerWordmark />{{ block.collection_title.slice(3) }}</template><template v-else>{{ block.collection_title }}</template></h2>
              <nuxt-link :to="collectionUrl(block.collection_title)">查看全部 →</nuxt-link>
            </header>
            <p v-if="block.error" class="discovery-notice">这个专题未能加载。<button @click="retryCollection(block)">重试</button></p>
            <div class="discovery-works">
              <WorkCard v-for="(work, index) in block.novels" :key="work.novel_id" :work="work" :compact="block.collection_type !== 'cards'" :rank="block.collection_type === 'dense_card' ? index + 1 : 0" />
            </div>
          </section>
        </template>
        <section class="discovery-block" aria-label="更多作品">
          <header class="block-header"><h2>更多作品</h2><span>小说 · 漫画 · 世界设定</span></header>
          <div v-if="feedLoading && !books.length" class="discovery-loading">正在加载作品…</div>
          <div v-else-if="books.length" class="discovery-works"><WorkCard v-for="work in books" :key="work.novel_id" :work="work" /></div>
          <p v-else-if="!errors.feed" class="discovery-loading">暂时还没有公开作品。</p>
          <p v-if="errors.feed" class="discovery-notice" role="alert">{{ errors.feed }} <button @click="retryFeed">重试</button></p>
          <div v-if="books.length" class="discovery-pagination"><button v-if="hasMore" :disabled="feedLoading" @click="loadMore">{{ feedLoading ? '加载中…' : '加载更多作品' }}</button><span v-else>已显示全部作品</span></div>
          <nav class="discovery-page-links" aria-label="作品分页"><nuxt-link v-if="requestedPage > 1" :to="{ path: '/read', query: requestedPage > 2 ? { page: requestedPage - 1 } : {} }" rel="prev">上一页</nuxt-link><nuxt-link v-if="hasMore" :to="{ path: '/read', query: { page: page + 1 } }" rel="next">第 {{ page + 1 }} 页 →</nuxt-link></nav>
        </section>
      </div>
      <aside class="discovery-sidebar" aria-label="阅读侧栏">
        <ReadingShelf ref="shelf" />
        <section class="discovery-block">
          <header class="block-header"><h2>热门标签</h2><nuxt-link to="/tags">全部 →</nuxt-link></header>
          <div class="popular-tag-list"><nuxt-link v-for="tag in popularTags" :key="tag.tag_id" :to="`/tag/collections?tag_id=${tag.tag_id}`">{{ tag.tag_name }} <small>{{ tag.count }}</small></nuxt-link></div>
          <p v-if="!popularTags.length" class="sidebar-hint">{{ errors.tags ? '标签暂时不可用' : '暂时没有标签' }}</p>
        </section>
        <section v-if="recommendationLinks.length" class="discovery-block">
          <header class="block-header"><h2>推荐专题</h2></header>
          <nav class="topic-links"><nuxt-link v-for="block in recommendationLinks" :key="block.collection_id" :to="collectionUrl(block.collection_title)">{{ block.collection_title }} <span>→</span></nuxt-link></nav>
        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import BannerSwiper from '~/components/read/BannerSwiper.vue'
import Banner from '~/components/Banner.vue'
import LogPowerWordmark from '~/components/LogPowerWordmark.vue'
import WorkCard from '~/components/read/WorkCard.vue'
import RankPanel from '~/components/read/RankPanel.vue'
import ReadingShelf from '~/components/read/ReadingShelf.vue'
import { asList, activeCollections, uniqueWorks, collectionUrl, discoveryLink } from '~/utils/reading-discovery'
import { readingHead, readingPage, workListSchema, readingResponseStatus } from '~/utils/reading-seo'
const CACHE_KEY = 'loghome_pc_library_v1'
export default {
  components: { BannerSwiper, Banner, LogPowerWordmark, WorkCard, RankPanel, ReadingShelf },
  head() { return readingHead({ title: `${this.requestedPage > 1 ? `公开作品 第 ${this.requestedPage} 页` : '阅读书库'} - 原木社区`, description: '浏览原木社区最新小说、漫画与世界设定，查看推荐专题和作品排行榜。', path: '/read', query: this.$route.query, schema: workListSchema(this.books, '原木社区公开作品', (this.requestedPage - 1) * this.pageSize), noindex: (this.requestedPage > 1 && !this.books.length) || (!!this.errors.feed && !this.books.length) }) },
  data: () => ({ indexTags: [], tags: [], chartList: [], collections: [], books: [], page: 1, pageSize: 24,
    refreshing: false, feedLoading: false, hasMore: false, version: 0, feedVersion: 0,
    failedFeedPage: 1, errors: { tags: false, collections: false, feed: '' } }),
  async fetch() { await this.loadDiscovery() },
  computed: {
    requestedPage() { return readingPage(this.$route.query.page) },
    configuredTags() { return this.indexTags.map(tag => ({ ...tag, link: discoveryLink(tag.jump_url_pc && tag.jump_url_pc !== 'None' ? tag.jump_url_pc : tag.jump_url, process.env.mobileUrl) })).filter(tag => tag.link) },
    popularTags() { return [...this.tags].sort((a, b) => Number(b.count) - Number(a.count)).slice(0, 16) },
    recommendationLinks() { return this.collections.filter(block => !['banner', '最近更新'].includes(block.collection_title)) }
  },
  watch: { requestedPage() { this.books = []; this.loadDiscovery() } },
  mounted() { if (this.errors.collections || this.errors.feed || this.errors.tags) this.restoreCache(); else this.persistCache() },
  beforeDestroy() { this.version++; this.feedVersion++ },
  methods: {
    collectionUrl,
    async loadDiscovery() {
      const version = ++this.version
      ++this.feedVersion
      const firstPage = this.requestedPage
      this.refreshing = true; this.feedLoading = true; this.failedFeedPage = firstPage
      const results = await Promise.allSettled([this.$api.reading.getIndexTags(), this.$api.reading.getTags(),
        this.$api.reading.getCollections(), this.$api.reading.getBooks(firstPage, this.pageSize), this.$api.novels.getLibraryRoulousChart()])
      if (version !== this.version) return
      this.errors.tags = results[0].status === 'rejected' || results[1].status === 'rejected'
      if (results[0].status === 'fulfilled') this.indexTags = asList(results[0].value)
      if (results[1].status === 'fulfilled') this.tags = asList(results[1].value)
      if (results[4].status === 'fulfilled') this.chartList = asList(results[4].value).filter(item => Number(item.isValid) === 1).map(item => ({ img: item.image, title: item.title || '', Subtitle: item.name, navigate_to: item.navigate_to_pc && item.navigate_to_pc !== 'None' ? item.navigate_to_pc : item.navigate_to }))
      if (results[3].status === 'fulfilled') {
        const rawBooks = asList(results[3].value)
        this.books = uniqueWorks(rawBooks); this.page = firstPage; this.hasMore = rawBooks.length >= this.pageSize; this.errors.feed = ''
        if (firstPage > 1 && !rawBooks.length) readingResponseStatus(this, 404)
      } else { this.errors.feed = '作品列表加载失败，请重试。'; if (firstPage > 1) readingResponseStatus(this, 503) }
      this.feedLoading = false; this.errors.collections = results[2].status === 'rejected'
      if (firstPage === 1 && results[2].status === 'fulfilled') {
        const previous = this.collections
        const blocks = await Promise.all(activeCollections(results[2].value).map(async block => {
          if (['banner', '最近更新'].includes(block.collection_title)) return { ...block, novels: [], error: false }
          try { return { ...block, novels: uniqueWorks(await this.$api.reading.getCollectionBooks(block.collection_title, 1, 12)), error: false } }
          catch (_) { return { ...block, novels: (previous.find(item => item.collection_id === block.collection_id) || {}).novels || [], error: true } }
        }))
        if (version !== this.version) return
        this.collections = blocks
      }
      this.refreshing = false
      if (!this.errors.collections && !this.errors.feed) this.persistCache()
    },
    async retryCollection(block) {
      const version = this.version
      try {
        const books = await this.$api.reading.getCollectionBooks(block.collection_title, 1, 12)
        if (version !== this.version) return
        this.$set(block, 'novels', uniqueWorks(books)); this.$set(block, 'error', false); this.persistCache()
      } catch (_) { if (version === this.version) this.$set(block, 'error', true) }
    },
    async loadMore() {
      if (this.feedLoading || !this.hasMore || this.refreshing) return
      const version = this.feedVersion, next = this.page + 1
      this.feedLoading = true; this.errors.feed = ''; this.failedFeedPage = next
      try {
        const books = asList(await this.$api.reading.getBooks(next, this.pageSize))
        if (version !== this.feedVersion) return
        this.books = uniqueWorks([...this.books, ...books]); this.page = next; this.hasMore = books.length >= this.pageSize
      } catch (_) { if (version === this.feedVersion) this.errors.feed = '下一页加载失败，已有作品已保留。' }
      finally { if (version === this.feedVersion) this.feedLoading = false }
    },
    retryFeed() { return this.failedFeedPage > this.requestedPage ? this.loadMore() : this.loadDiscovery() },
    persistCache() {
      if (!process.client || this.requestedPage !== 1) return
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version: 1, savedAt: Date.now(), indexTags: this.indexTags, tags: this.tags, chartList: this.chartList, collections: this.collections, books: this.books.slice(0, this.pageSize), hasMore: this.books.length >= this.pageSize })) } catch (_) {}
    },
    restoreCache() {
      if (this.requestedPage !== 1) return
      try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
        if (!cache || cache.version !== 1 || Date.now() - cache.savedAt > 86400000) return
        if (this.errors.collections) this.collections = activeCollections(cache.collections).map(block => ({ ...block, novels: uniqueWorks(block.novels) }))
        if (this.errors.feed) { this.books = uniqueWorks(cache.books); this.page = 1; this.hasMore = !!cache.hasMore }
        if (this.errors.tags) { this.tags = asList(cache.tags); this.indexTags = asList(cache.indexTags) }
        if (!this.chartList.length) this.chartList = asList(cache.chartList)
      } catch (_) {}
    }
  }
}
</script>

<style scoped>
button { cursor: pointer; font: inherit; }
.discovery-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 24px; }
.discovery-tags a { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--reading-line, #e4e3de); border-radius: 6px; padding: 10px 16px; background: var(--reading-surface, #fff); font-size: 13px; font-weight: 500; text-decoration: none; color: var(--reading-accent, #79573c); transition: background .18s ease; }
.discovery-tags a:hover { background: var(--reading-tint, #eee7de); }
.discovery-tags img { width: 18px; height: 18px; object-fit: contain; }
.discovery-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 28px; align-items: start; }
.discovery-main, .discovery-sidebar { min-width: 0; display: grid; gap: 28px; }
.discovery-sidebar { align-self: start; }
.discovery-block { padding: 26px; border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-surface, #fff); border-radius: 12px; }
.block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 14px; }
.block-header h2 { display: flex; align-items: center; gap: 6px; color: var(--reading-ink, #302f2a); font-size: 21px; font-weight: 600; letter-spacing: -.4px; }
.block-header h2 img { width: 20px; height: 20px; object-fit: contain; margin-right: 4px; }
.block-header a, .block-header > span { font-size: 13px; color: var(--reading-accent, #79573c); text-decoration: none; }
.block-header > span { color: var(--reading-muted, #73716a); }
.discovery-works { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; }
.discovery-loading { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8; }
.discovery-notice { font-size: 13px; color: #9d503b; padding: 14px 0; line-height: 1.8; }
.discovery-notice button { color: var(--reading-accent, #79573c); background: none; border: none; text-decoration: underline; }
.discovery-pagination { display: flex; justify-content: center; margin-top: 26px; color: var(--reading-muted, #73716a); font-size: 13px; }
.discovery-pagination button { padding: 11px 28px; border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); border-radius: 6px; }
.discovery-page-links { display: flex; justify-content: center; gap: 24px; margin-top: 18px; font-size: 13px; }.discovery-page-links a { color: var(--reading-accent, #79573c); text-decoration: none; }
.discovery-sidebar .discovery-block { padding: 22px; }
.discovery-sidebar .block-header h2 { font-size: 18px; }
.popular-tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
.popular-tag-list a { padding: 7px 10px; border-radius: 5px; background: var(--reading-hover, #f5f4f0); color: var(--reading-secondary, #615e57); font-size: 12px; text-decoration: none; }
.popular-tag-list a:hover { background: var(--reading-tint, #eee7de); color: var(--reading-accent, #79573c); }
.popular-tag-list small { color: var(--reading-muted, #73716a); margin-left: 4px; font-variant-numeric: tabular-nums; }
.topic-links { display: grid; gap: 16px; }
.topic-links a { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; line-height: 1.7; color: var(--reading-secondary, #615e57); text-decoration: none; }
.sidebar-hint { font-size: 13px; color: var(--reading-muted, #73716a); }
.discovery-carousel ::v-deep .swiper-container { height: clamp(190px, 17vw, 250px); border-radius: 12px; box-shadow: none; }
button:disabled { opacity: .5; cursor: wait; }
a:focus-visible, button:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px; }
@media (min-width: 1440px) { .discovery-works { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 1024px) { .discovery-layout { grid-template-columns: minmax(0, 1fr); } .discovery-sidebar { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .discovery-works, .discovery-sidebar { grid-template-columns: 1fr; } .discovery-block { padding: 20px 16px; } .discovery-tags { gap: 6px; margin-bottom: 18px; } .discovery-tags a { padding: 9px 12px; } .block-header { align-items: flex-start; flex-wrap: wrap; } .block-header h2 { font-size: 19px; } .discovery-main, .discovery-sidebar, .discovery-layout { gap: 20px; } }
@media (prefers-reduced-motion: reduce) { .discovery-tags a { transition: none; } }
</style>
