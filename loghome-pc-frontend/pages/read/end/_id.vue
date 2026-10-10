<template>
  <main class="reading-end">
    <nav class="end-breadcrumb" aria-label="阅读导航"><nuxt-link to="/read">书库</nuxt-link><span>/</span><nuxt-link :to="workUrl(book)">{{ book.name }}</nuxt-link><span>/</span><span>读至最后</span></nav>
    <div class="end-layout">
      <div class="end-main">
        <section class="end-summary">
          <img class="end-cover" :src="book.picUrl || '/default-book-cover.png'" :alt="book.name + '封面'" @error="coverError">
          <div class="end-copy">
            <span class="end-status">{{ book.is_complete ? '故事已完结' : '已读至最新章节' }}</span>
            <h1>{{ book.is_complete ? '已完结，感谢陪伴' : '尚未完结 · 敬请期待' }}</h1>
            <nuxt-link class="end-book-name" :to="workUrl(book)">{{ book.name }}</nuxt-link>
            <p>{{ book.author_name }} · {{ chapters.length }} 章</p>
            <p class="end-message">{{ book.is_complete ? '把读完后的感受留给作者，也把这段故事留在书架。' : '收藏作品，方便下次查看更新。也欢迎给作者留下一句鼓励。' }}</p>
            <div class="end-actions">
              <a :href="`/read/end/${book.novel_id}#book-reviews`" class="primary-action" @click.prevent="focusReviews">写个书评</a>
              <button :disabled="favoriteBusy || (!!account && !favoriteKnown)" @click="toggleFavorite">{{ favoriteBusy ? '正在同步…' : account && !favoriteKnown ? favoriteError ? '收藏状态未读取' : '正在读取收藏…' : favorite ? '已收藏 · 取消' : '收藏作品' }}</button>
              <nuxt-link :to="workUrl(book)">返回详情</nuxt-link>
            </div>
            <p v-if="favoriteError" class="end-error" role="alert">{{ favoriteError }} <button @click="loadFavorite">重试</button></p>
            <nuxt-link v-if="lastChapter" class="last-chapter" :to="`/article/${lastChapter.article_id}?edge=end`">← 返回最后一章：{{ lastChapter.title }}</nuxt-link>
          </div>
        </section>
        <MangaCommentPanel id="book-reviews" ref="reviews" inline :visible="true" :novel-id="book.novel_id" :work-author-id="book.author_id || book.auther_id" scope-title="作品书评" />
      </div>
      <aside class="end-recommendations" aria-label="推荐作品">
        <div class="recommend-heading"><h2>猜你喜欢</h2><nuxt-link to="/read">更多作品 →</nuxt-link></div>
        <p class="recommend-note">接着打开另一段故事</p>
        <p v-if="recommendationError" class="end-error" role="alert">{{ recommendationError }} <button :disabled="recommendationsLoading" @click="reloadRecommendations">{{ recommendationsLoading ? '加载中…' : '重试' }}</button></p>
        <div v-else-if="recommendations.length" class="recommendation-grid"><WorkCard v-for="work in recommendations" :key="work.novel_id" :work="work" /></div>
        <p v-else class="recommend-empty">暂时没有推荐作品，去书库看看吧。</p>
      </aside>
    </div>
  </main>
</template>

<script>
import MangaCommentPanel from '~/components/manga/MangaCommentPanel.vue'
import WorkCard from '~/components/read/WorkCard.vue'
import { normalizeWork, uniqueWorks, workUrl } from '~/utils/reading-discovery'
import { readingHead } from '~/utils/reading-seo'
import { readingToken } from '~/plugins/api/reading'

const RECOMMENDATION_TITLE = '原木力飙升'
const recommendationsFor = (rows, id) => uniqueWorks(rows).filter(work => work.novel_id !== Number(id)).slice(0, 4)

export default {
  components: { MangaCommentPanel, WorkCard },
  async asyncData({ params, $api, error, redirect }) {
    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id <= 0) return error({ statusCode: 404, message: '作品不存在' })
    try {
      const rows = await $api.reader.book(id)
      if (!rows || !rows[0]) return error({ statusCode: 404, message: '作品不存在' })
      const book = normalizeWork(rows[0])
      if (book.novel_type === 'manga' || book.novel_type === 'world') return redirect(workUrl(book))
      const chapters = (await $api.reader.chapters(id)).filter(chapter => chapter.article_type !== 'spliter' && Number(chapter.article_id) > 0)
      if (!chapters.length) return redirect(workUrl(book))
      // Recommendations are secondary: an outage must not hide the work or its navigation.
      let recommendations = [], recommendationError = ''
      try { recommendations = recommendationsFor(await $api.reading.getCollectionBooks(RECOMMENDATION_TITLE, 1, 5), id) }
      catch (_) { recommendationError = '推荐作品暂时加载失败' }
      return { book, chapters, recommendations, recommendationError }
    } catch (failure) {
      return error({ statusCode: failure.status === 404 ? 404 : 503, message: failure.status === 404 ? '作品不存在' : '作品加载失败，请稍后重试' })
    }
  },
  data() {
    return { book: {}, chapters: [], recommendations: [], recommendationError: '', recommendationsLoading: false, recommendationVersion: 0, account: null, favorite: false, favoriteKnown: false, favoriteBusy: false, favoriteError: '', favoriteVersion: 0 }
  },
  computed: { lastChapter() { return this.chapters[this.chapters.length - 1] || null } },
  head() {
    return readingHead({ title: `${this.book.name || '作品'} - 读至最后 - 原木社区`, description: `${this.book.name}：${this.book.is_complete ? '已完结，感谢陪伴' : '尚未完结，敬请期待'}。收藏作品、发表书评，发现更多故事。`, path: `/read/end/${this.book.novel_id}`, image: this.book.picUrl, noindex: true })
  },
  mounted() {
    this.loadFavorite()
    window.addEventListener('focus', this.checkAccount)
    window.addEventListener('storage', this.checkAccount)
  },
  beforeDestroy() {
    this.favoriteVersion++; this.recommendationVersion++
    window.removeEventListener('focus', this.checkAccount)
    window.removeEventListener('storage', this.checkAccount)
  },
  watch: { 'book.novel_id'() { this.recommendationVersion++; this.recommendationsLoading = false; this.loadFavorite() } },
  methods: {
    workUrl,
    coverError(event) { if (!event.target.src.endsWith('/default-book-cover.png')) event.target.src = '/default-book-cover.png' },
    checkAccount() { if (this.account !== readingToken()) this.loadFavorite() },
    async loadFavorite() {
      const version = ++this.favoriteVersion, id = Number(this.book.novel_id), account = readingToken()
      this.account = account; this.favorite = false; this.favoriteKnown = !account; this.favoriteBusy = false; this.favoriteError = ''
      if (!account) return
      try {
        const shelf = await this.$api.reading.getShelf()
        if (version !== this.favoriteVersion || account !== readingToken() || id !== Number(this.book.novel_id)) return
        this.favorite = shelf.some(work => Number(work.novel_id) === id); this.favoriteKnown = true
      } catch (_) {
        if (version === this.favoriteVersion && account === readingToken()) this.favoriteError = '无法读取收藏状态，请重试'
      }
    },
    async toggleFavorite() {
      const account = readingToken(), id = Number(this.book.novel_id)
      if (!account) { this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } }); return }
      if (account !== this.account) { this.loadFavorite(); return }
      if (this.favoriteBusy || !this.favoriteKnown) return
      const version = this.favoriteVersion, removing = this.favorite
      this.favoriteBusy = true; this.favoriteError = ''
      try {
        if (removing) await this.$confirm('确定从书架移除这部作品吗？', '取消收藏', { type: 'warning', confirmButtonText: '移除', cancelButtonText: '保留' })
        if (version !== this.favoriteVersion || account !== readingToken() || id !== Number(this.book.novel_id)) return
        await (removing ? this.$api.reading.removeFavorite(id) : this.$api.reading.addFavorite(id))
        if (version !== this.favoriteVersion || account !== readingToken() || id !== Number(this.book.novel_id)) return
        this.favorite = !removing
        this.$message.success(removing ? '已从书架移除' : '收藏成功')
      } catch (failure) {
        if (failure !== 'cancel' && failure !== 'close' && version === this.favoriteVersion && account === readingToken()) this.favoriteError = failure.message || '收藏操作失败，请重试'
      } finally { if (version === this.favoriteVersion) this.favoriteBusy = false }
    },
    focusReviews() {
      this.$nextTick(() => { const panel = this.$refs.reviews; if (panel && panel.$refs.composer) panel.$refs.composer.focus() })
    },
    async reloadRecommendations() {
      if (this.recommendationsLoading) return
      const version = ++this.recommendationVersion, id = Number(this.book.novel_id)
      this.recommendationsLoading = true
      try {
        const rows = await this.$api.reading.getCollectionBooks(RECOMMENDATION_TITLE, 1, 5)
        if (version !== this.recommendationVersion || id !== Number(this.book.novel_id)) return
        this.recommendations = recommendationsFor(rows, id); this.recommendationError = ''
      } catch (_) { if (version === this.recommendationVersion) this.recommendationError = '推荐作品暂时加载失败' }
      finally { if (version === this.recommendationVersion) this.recommendationsLoading = false }
    }
  }
}
</script>

<style scoped>
.reading-end { max-width: 1250px; margin: 0 auto; padding: 30px 26px 60px; color: #453b31; }
.end-breadcrumb { display: flex; gap: 10px; align-items: center; color: #988d80; font-size: 12px; margin-bottom: 22px; flex-wrap: wrap; }
a { color: #88694d; text-decoration: none; }a:hover { color: #5b4634; }
.end-layout { display: grid; grid-template-columns: minmax(0, 1fr) 350px; gap: 26px; align-items: start; }.end-main { min-width: 0; }
.end-summary { display: flex; gap: 26px; padding: 30px; background: #fff; border: 1px solid #e9e4dd; border-radius: 12px; margin-bottom: 24px; }
.end-cover { width: 105px; height: 148px; object-fit: cover; border-radius: 5px; background: #f1ece6; flex: none; }.end-copy { min-width: 0; }
.end-status { color: #728359; font-size: 12px; letter-spacing: 1px; }h1 { font-size: 26px; line-height: 1.5; margin: 8px 0 14px; overflow-wrap: anywhere; }
.end-book-name { font-size: 16px; font-weight: 600; }.end-copy p { font-size: 12px; color: #978b7c; line-height: 1.9; margin: 8px 0; }.end-copy .end-message { color: #75695b; margin: 18px 0; }
.end-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }.end-actions a,.end-actions button { border: 1px solid #e1d8cc; border-radius: 6px; padding: 10px 15px; font-size: 13px; background: #fff; color: #765b43; cursor: pointer; line-height: 1.5; }
.end-actions .primary-action { background: #947358; border-color: #947358; color: white; }.end-actions button:disabled { cursor: default; opacity: .6; }.last-chapter { display: inline-block; font-size: 12px; margin-top: 22px; overflow-wrap: anywhere; }
.end-recommendations { padding: 22px; background: #fff; border: 1px solid #e9e4dd; border-radius: 12px; }.recommend-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; }.recommend-heading h2 { font-size: 18px; margin: 0; }.recommend-heading a { font-size: 12px; white-space: nowrap; }
.recommend-note,.recommend-empty { font-size: 12px; color: #978b7c; line-height: 1.8; margin: 10px 0 18px; }.recommendation-grid { display: grid; gap: 10px; min-width: 0; }.end-error,.end-copy .end-error { color: #b15c48; font-size: 12px; line-height: 1.8; }.end-error button { background: none; border: none; text-decoration: underline; color: inherit; cursor: pointer; }
a:focus-visible,button:focus-visible { outline: 2px solid #947358; outline-offset: 3px; }#book-reviews { scroll-margin-top: 110px; }
@media(max-width:1100px) { .end-layout { grid-template-columns: minmax(0, 1fr) 300px; gap: 18px; }.end-summary { padding: 24px; gap: 18px; }.end-cover { width: 80px; height: 112px; }h1 { font-size: 22px; }.end-recommendations { padding: 18px; } }
@media(max-width:850px) { .end-layout { grid-template-columns: minmax(0, 1fr); }.recommendation-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media(max-width:540px) { .reading-end { padding: 20px 14px 40px; }.end-summary { padding: 20px; }.end-cover { width: 60px; height: 84px; }h1 { font-size: 20px; }.recommendation-grid { grid-template-columns: minmax(0,1fr); }.end-actions { gap: 8px; }.end-actions a,.end-actions button { padding: 8px 10px; } }
</style>
