<template>
  <section class="work-collection">
    <header><div><p>{{ tagId ? '按标签发现' : '精选专题' }}</p><h1>{{ heading }}</h1></div><nuxt-link :to="tagId ? '/tags' : '/read'">{{ tagId ? '所有标签' : '返回书库' }} →</nuxt-link></header>
    <div class="toolbar"><span>{{ tagId ? `${books.length} 部作品` : '小说 · 漫画 · 世界' }}</span><button :disabled="loading" @click="loadFirst">刷新</button></div>
    <p v-if="error" class="notice" role="alert">{{ error }} <button @click="retry">重试</button></p>
    <div v-if="visibleBooks.length" class="grid"><WorkCard v-for="book in visibleBooks" :key="book.novel_id" :work="book" /></div>
    <p v-else class="empty">{{ loading ? '正在加载作品…' : error ? '暂时无法加载作品。' : '这里还没有作品。' }}</p>
    <div v-if="books.length" class="more"><button v-if="hasMore" :disabled="loading" @click="loadMore">{{ loading ? '加载中…' : '加载更多作品' }}</button><span v-else>已展示全部作品</span></div>
    <nav class="page-links" aria-label="作品分页"><nuxt-link v-if="requestedPage > 1" :to="pageUrl(requestedPage - 1)" rel="prev">上一页</nuxt-link><nuxt-link v-if="hasMore" :to="pageUrl(page + 1)" rel="next">第 {{ page + 1 }} 页 →</nuxt-link></nav>
  </section>
</template>
<script>
import WorkCard from './WorkCard.vue'
import { asList, uniqueWorks } from '~/utils/reading-discovery'
import { readingHead, readingPage, workListSchema, readingResponseStatus } from '~/utils/reading-seo'
const AMOUNT = 24
export default {
  components: { WorkCard }, props: { title: { type: String, default: '' }, tagId: { type: Number, default: 0 } },
  data: () => ({ books: [], tagName: '', loading: true, error: '', page: 1, shown: AMOUNT, firstShown: 0, hasMore: false, version: 0, failedPage: 1 }),
  head() { return readingHead({ title: `${this.heading}${this.requestedPage > 1 ? ` · 第 ${this.requestedPage} 页` : ''} - 原木社区`, description: `阅读「${this.heading}」中的小说、漫画与世界设定，发现更多精彩作品。`, path: this.tagId ? '/tag/collections' : '/read/collections', query: this.$route.query, schema: workListSchema(this.visibleBooks, this.heading, (this.requestedPage - 1) * AMOUNT), noindex: !!this.error || (this.requestedPage > 1 && !this.visibleBooks.length) }) },
  computed: {
    heading() { return this.tagId ? this.tagName || '标签作品' : this.title },
    requestedPage() { return readingPage(this.$route.query.page) },
    resourceKey() { return `${this.tagId}:${this.title}` },
    visibleBooks() { return this.tagId ? this.books.slice(this.firstShown, this.shown) : this.books }
  },
  async fetch() { await this.loadFirst() },
  watch: { resourceKey() { this.books = []; this.tagName = ''; this.loadFirst() }, requestedPage() { this.books = []; this.loadFirst() } },
  beforeDestroy() { this.version++ },
  methods: {
    pageUrl(page) { return { path: this.tagId ? '/tag/collections' : '/read/collections', query: { ...(this.tagId ? { tag_id: this.tagId } : { title: this.title }), ...(page > 1 ? { page } : {}) } } },
    async loadFirst() {
      const version = ++this.version
      const page = this.requestedPage
      this.loading = true; this.error = ''; this.failedPage = page
      try {
        if (this.tagId) {
          const [tag, books] = await Promise.all([this.$api.reading.getTag(this.tagId), this.$api.reading.getTagBooks(this.tagId)])
          if (version !== this.version) return
          this.tagName = tag.tag_name || '标签作品'; this.books = uniqueWorks(books)
          this.firstShown = (page - 1) * AMOUNT; this.shown = page * AMOUNT; this.hasMore = this.books.length > this.shown
        } else {
          const books = await this.$api.reading.getCollectionBooks(this.title, page, AMOUNT)
          if (version !== this.version) return
          this.books = uniqueWorks(books); this.hasMore = asList(books).length === AMOUNT
        }
        this.page = page
        if (page > 1 && !this.visibleBooks.length) readingResponseStatus(this, 404)
      } catch (failure) { if (version === this.version) { this.error = '加载失败，请稍后重试。'; readingResponseStatus(this, failure.status === 404 ? 404 : 503) } }
      finally { if (version === this.version) this.loading = false }
    },
    retry() { return this.failedPage <= this.requestedPage ? this.loadFirst() : this.loadMore() },
    async loadMore() {
      if (this.loading || !this.hasMore) return
      if (this.tagId) { this.shown += AMOUNT; this.page++; this.hasMore = this.books.length > this.shown; return }
      const version = this.version, page = this.page + 1
      this.loading = true; this.error = ''; this.failedPage = page
      try {
        const books = await this.$api.reading.getCollectionBooks(this.title, page, AMOUNT)
        if (version !== this.version) return
        this.books = uniqueWorks([...this.books, ...asList(books)]); this.page = page
        this.hasMore = asList(books).length === AMOUNT
      } catch (_) { if (version === this.version) this.error = '后续作品加载失败，已保留当前列表。' }
      finally { if (version === this.version) this.loading = false }
    }
  }
}
</script>
<style scoped>
.work-collection { max-width: 1220px; margin: 0 auto; padding: 30px 24px 60px; min-height: 70vh; }
header { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-bottom: 22px; border-bottom: 1px solid #e6e1da; }
header p { margin-bottom: 5px; font-size: 12px; color: #aa9783; } h1 { font-size: 27px; color: #594738; }
header a { font-size: 13px; color: #947358; text-decoration: none; }
.toolbar { display: flex; justify-content: space-between; margin: 20px 0; font-size: 12px; color: #a19487; }
button { font: inherit; cursor: pointer; border: 1px solid #e6ddd3; border-radius: 6px; background: white; padding: 6px 16px; color: #947358; }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.empty, .more { text-align: center; padding: 35px; font-size: 13px; color: #a89b8c; }
.page-links { display: flex; justify-content: center; gap: 20px; font-size: 13px; }.page-links a { color: #947358; text-decoration: none; }
.notice { background: #fff6ed; padding: 14px; margin-bottom: 16px; color: #a37955; font-size: 13px; }
button:disabled { opacity: .5; } button:focus-visible, a:focus-visible { outline: 2px solid #947358; outline-offset: 3px; }
@media (max-width: 950px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .work-collection { padding: 20px 16px; } h1 { font-size: 22px; } }
</style>
