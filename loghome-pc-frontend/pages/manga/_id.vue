<template>
  <div class="manga-page">
    <div v-if="error" class="error-container">
      <p>{{ error }}</p>
      <nuxt-link to="/read" class="back-button">返回书库</nuxt-link>
    </div>

    <div class="manga-container" v-else>
      <div class="manga-header">
        <div class="manga-cover" v-if="novel.picUrl" :style="`background-image: url(${novel.picUrl})`"></div>
        <div class="manga-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`"></div>
        <div class="book-id-tag">ID {{ novel.novel_id }}</div>

        <div class="manga-info">
          <h1 class="manga-title">{{ novel.name }}</h1>
          <div class="manga-meta">
            <nuxt-link class="author-info" :to="`/users/${novel.auther_id || novel.author_id}`">
              <img v-if="novel.auther_avatar" :src="novel.auther_avatar" class="author-avatar" alt="作者头像">
              <div v-else class="author-avatar-placeholder">{{ novel.author_name ? novel.author_name.charAt(0) : '作' }}</div>
              <span class="author-name">{{ novel.author_name || '佚名' }}</span>
            </nuxt-link>
            <span class="type-pill">漫画</span>
          </div>

          <div class="manga-stats">
            <div class="stat-item">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ formatNumber(novel.clicks || 0) }}</span>
              <span class="stat-label">阅读量</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ formatNumber(nice_amount || 0) }}</span>
              <span class="stat-label">喜欢</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📖</span>
              <span class="stat-value">{{ chapters.length }}</span>
              <span class="stat-label">话数</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📚</span>
              <span class="stat-value">{{ novel.is_complete == 1 ? '已完结' : '连载中' }}</span>
              <span class="stat-label">状态</span>
            </div>
          </div>

          <div class="manga-tags" v-if="tags.length">
            <nuxt-link class="tag" v-for="tag in tags" :key="tag.tag_id" :to="`/tag/collections?tag_id=${tag.tag_id}`" :class="{ activity: Number(tag.is_activity_tag) === 1 }">{{ tag.tag_name }}</nuxt-link>
          </div>

          <div class="manga-actions">
            <button class="action-button primary" @click="startReading" :disabled="!chapters.length">
              {{ readButtonText }}
            </button>
            <BookSupport class="inline-support" :book="novel" @liked="onSupportLike" @tipped="refreshFans" @account-change="loadProgress" />
          </div>
        </div>
      </div>

      <CollaborativeAuthors :novel-id="novel.novel_id" />
      <div class="manga-content">
        <div class="content-tabs">
          <button class="tab-button" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">作品简介</button>
          <button class="tab-button" :class="{ active: activeTab === 'chapters' }" @click="activeTab = 'chapters'">目录 ({{ chapters.length }})</button>
          <button class="tab-button" :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">读者评论 ({{ commentAmount }})</button>
          <button class="tab-button" :class="{ active: activeTab === 'fans' }" @click="activeTab = 'fans'">粉丝榜</button>
          <button class="tab-button" :class="{ active: activeTab === 'author' }" @click="activeTab = 'author'" v-if="authorWorks.length || authorWorksError">作者的其他漫画<template v-if="authorWorks.length"> ({{ authorWorks.length }})</template></button>
        </div>

        <div class="tab-content">
          <!-- 作品简介 -->
          <div v-show="activeTab === 'intro'" class="intro-content">
            <p v-if="novel.content" class="intro-text">{{ novel.content }}</p>
            <p v-else class="empty-content">作者还没有填写简介</p>
          </div>

          <!-- 目录 -->
          <div v-show="activeTab === 'chapters'" class="chapters-content">
            <div class="chapters-toolbar" v-if="chapters.length">
              <span class="chapters-count">共 {{ chapters.length }} 话</span>
              <button class="sort-toggle" @click="catalogReversed = !catalogReversed">
                {{ catalogReversed ? '倒序' : '正序' }}
              </button>
            </div>
            <div v-if="!chapters.length" class="empty-content">还没有已发布的话数</div>
            <div v-else class="chapter-list">
              <nuxt-link v-for="chapter in orderedChapters" :key="chapter.article_id" :to="`/manga/read/${chapter.article_id}?novelId=${novel.novel_id}`" class="chapter-item" @click.native.prevent="openChapter(chapter)">
                <span class="chapter-number">{{ chapter.article_chapter }}</span>
                <span class="chapter-title">{{ chapter.title }}</span>
                <span class="chapter-type">{{ chapter.article_type === 'mangaPage' ? '页漫' : '条漫' }}</span>
                <span class="chapter-comments" v-if="articleCommentAmounts[chapter.article_id]">
                  💬 {{ articleCommentAmounts[chapter.article_id] }}
                </span>
                <span class="chapter-badge" v-if="isCurrentChapter(chapter)">读至</span>
                <span class="chapter-date">{{ formatDate(chapter.update_time) }}</span>
              </nuxt-link>
            </div>
          </div>

          <!-- 读者评论 -->
          <div v-if="activeTab === 'comments'" class="comments-content"><MangaCommentPanel ref="bookReviews" inline :visible="true" :novel-id="novel.novel_id" :work-author-id="novel.auther_id || novel.author_id" :anchor-id="commentAnchor" @changed="loadCommentAmount" /></div>

          <!-- 粉丝榜 -->
          <div v-show="activeTab === 'fans'" class="fans-content">
            <NovelFansList ref="fansList" :novelId="novel.novel_id" :limit="3" />
          </div>

          <!-- 作者的其他漫画 -->
          <div v-show="activeTab === 'author'" class="author-content">
            <p v-if="authorWorksError" class="author-works-notice" role="alert">作者作品暂时未能加载。<button :disabled="authorWorksLoading" @click="loadAuthorWorks">{{ authorWorksLoading ? '加载中…' : '重试' }}</button></p>
            <div class="works-grid">
              <nuxt-link class="mini-work-card" v-for="work in authorWorks" :key="work.novel_id" :to="`/manga/${work.novel_id}`">
                <div class="mini-work-cover" v-if="work.picUrl" :style="`background-image: url(${work.picUrl})`"></div>
                <div class="mini-work-cover" v-else :style="`background-color: hsl(${work.novel_id * 30 % 360}, 70%, 80%)`"></div>
                <div class="mini-work-info">
                  <h3 class="mini-work-title">{{ work.name }}</h3>
                  <p class="mini-work-status">{{ Number(work.is_complete) === 1 ? '已完结' : '连载中' }}</p>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { readingCommentId } from '~/utils/reader-comment-links'
import { localReadingProgress, recordLocalReading } from '~/utils/reading-history'
import NovelFansList from '~/components/NovelFansList.vue'
import MangaCommentPanel from '~/components/manga/MangaCommentPanel.vue'
import CollaborativeAuthors from '~/components/read/CollaborativeAuthors.vue'
import { readingToken } from '~/plugins/api/reading'
import BookSupport from '~/components/read/BookSupport.vue'
import { readingHead, bookSchema } from '~/utils/reading-seo'
import { fetchMangaCommentAmount, fetchMangaArticleCommentAmounts } from '~/common/manga-comment-api.js'

function otherAuthorMangas(works, novelId) {
  if (!Array.isArray(works)) throw new Error('作者作品数据暂不可用')
  const seen = new Set()
  return works.filter(work => {
    if (!work || work.novel_type !== 'manga' || Number(work.is_personal) !== 0 || !Number.isSafeInteger(Number(work.novel_id)) || Number(work.novel_id) <= 0 || String(work.novel_id) === String(novelId) || seen.has(Number(work.novel_id))) return false
    seen.add(Number(work.novel_id)); return true
  }).slice(0, 6)
}

export default {
  name: 'MangaDetail',
  components: { NovelFansList, MangaCommentPanel, CollaborativeAuthors, BookSupport },
  async asyncData({ params, $api, error, redirect }) {
    try {
      const novel = await $api.reader.book(params.id)
      if (!novel || novel.length === 0) {
        return error({ statusCode: 404, message: '找不到该漫画' })
      }
      const novelData = novel[0]
      // 非漫画作品交回对应的详情页
      if (novelData.novel_type === 'world') return redirect(`/world/${novelData.novel_id}`)
      if (novelData.novel_type !== 'manga') return redirect(`/novel/${novelData.novel_id}`)

      const loadAuthorWorks = async () => {
        const authorId = novelData.auther_id || novelData.author_id
        if (!authorId) return { authorWorks: [], authorWorksError: false }
        try { return { authorWorks: otherAuthorMangas(await $api.reader.authorWorks(authorId), novelData.novel_id), authorWorksError: false } }
        catch (_) { return { authorWorks: [], authorWorksError: true } }
      }
      const [articles, tags, authorResult] = await Promise.all([$api.reader.chapters(novelData.novel_id), $api.novels.getNovelTags(novelData.novel_id), loadAuthorWorks()])
      const chapters = (articles || []).filter(a => a.article_type === 'mangaStrip' || a.article_type === 'mangaPage')

      return { error: null, novel: novelData, chapters, tags: tags || [], ...authorResult }
    } catch (err) {
      console.error('服务端获取漫画数据失败', err)
      return error({ statusCode: err.status || 503, message: err.status === 404 ? '作品不存在或不可阅读' : '加载漫画数据失败，请稍后重试' })
    }
  },
  data() {
    return {
      error: null,
      activeTab: 'intro',
      catalogReversed: false,
      isInBookcase: false,
      niceStatus: false,
      nice_amount: 0,
      hasFans: false,
      progress: null,
      authorWorks: [],
      authorWorksError: false,
      authorWorksLoading: false,
      authorWorksVersion: 0,
      commentAmount: 0,
      articleCommentAmounts: {},
    }
  },
  head() {
    return readingHead({ title: `${this.novel.name} - 漫画 - 原木社区`, description: this.novel.content, path: `/manga/${this.novel.novel_id}`, image: this.novel.picUrl, type: 'book', schema: bookSchema(this.novel, `/manga/${this.novel.novel_id}`) })
  },
  computed: {
    commentAnchor() { return readingCommentId(this.$route.query) },
    orderedChapters() {
      return this.catalogReversed ? this.chapters.slice().reverse() : this.chapters
    },
    readButtonText() {
      if (!this.chapters.length) return '暂未发布'
      if (this.progress && this.progress.last_article_id) {
        const target = this.chapters.find(a => String(a.article_id) === String(this.progress.last_article_id))
        if (target) return `继续阅读 第${target.article_chapter}话`
      }
      return '开始阅读'
    }
  },
  watch: { commentAnchor(id) { if (id) this.activeTab = 'comments' } },
  mounted() {
    if (this.commentAnchor) this.activeTab = 'comments'
    this.fetchClientData()
  },
  beforeDestroy() { this.authorWorksVersion++ },
  methods: {
    onSupportLike(state) { this.nice_amount = state.count; this.niceStatus = state.liked },
    refreshFans() { this.loadFans(); if (this.$refs.fansList) this.$refs.fansList.getFansList() },
    async fetchClientData() {
      this.getNices()
      this.checkBookcaseStatus()
      this.loadProgress()
      this.loadFans()
      this.loadCommentAmount()
      this.loadArticleCommentAmounts()
      this.addReaderHistory(this.novel)
    },
    async getNices() {
      try {
        const nices = await this.$api.novels.getNicesById(this.novel.novel_id)
        if (nices && nices.length > 0) this.nice_amount = nices[0].nices
        if (localStorage.getItem('token')) {
          const status = await this.$api.novels.getNiceStatus(this.novel.novel_id)
          this.niceStatus = !!(status && status.length > 0 && status[0].nices > 0)
        }
      } catch (e) {
        console.error('获取点赞状态失败', e)
      }
    },
    async checkBookcaseStatus() {
      if (!localStorage.getItem('token')) return
      try {
        const likes = await this.$api.bookcase.getLikesOf()
        if (likes) this.isInBookcase = likes.some(item => String(item.novel_id) === String(this.novel.novel_id))
      } catch (e) {
        console.error('获取收藏状态失败', e)
      }
    },
    async loadProgress() {
      const token=readingToken(),id=this.novel.novel_id;this.progress=localReadingProgress(id,token)||null
      try{const rows=await this.$api.reading.getProgress(id),remote=Array.isArray(rows)?rows[0]:null;if(token!==readingToken()||Number(id)!==Number(this.novel.novel_id))return;if(remote&&Number(remote.novel_id)===Number(id)&&(!this.progress||!this.progress.last_read_time||new Date(remote.last_read_time)>=new Date(this.progress.last_read_time)))this.progress=remote}catch(_){}
    },
    async loadFans() {
      try {
        const fans = await this.$api.novels.getNovelFans(this.novel.novel_id)
        this.hasFans = !!(fans && fans.length)
      } catch (e) {
        this.hasFans = false
      }
    },
    async loadAuthorWorks() {
      const authorId = this.novel.auther_id || this.novel.author_id
      if (!authorId) return
      const novelId = this.novel.novel_id, version = ++this.authorWorksVersion
      const current = () => version === this.authorWorksVersion && String(novelId) === String(this.novel.novel_id)
      this.authorWorksLoading = true; this.authorWorksError = false
      try {
        const works = otherAuthorMangas(await this.$api.reader.authorWorks(authorId), novelId)
        if (current()) this.authorWorks = works
      } catch (_) { if (current()) this.authorWorksError = true }
      finally { if (current()) this.authorWorksLoading = false }
    },
    async loadCommentAmount() {
      try {
        this.commentAmount = await fetchMangaCommentAmount(process.env.baseUrl, this.novel.novel_id)
      } catch (e) {
        console.error('加载评论数失败', e)
      }
    },
    async loadArticleCommentAmounts() {
      try {
        this.articleCommentAmounts = await fetchMangaArticleCommentAmounts(process.env.baseUrl, this.novel.novel_id)
      } catch (e) {
        this.articleCommentAmounts = {}
      }
    },
    isCurrentChapter(chapter) {
      return this.progress && String(this.progress.last_article_id) === String(chapter.article_id)
    },
    startReading() {
      if (!this.chapters.length) {
        this.$message.info('还没有可阅读的话数')
        return
      }
      let target = this.chapters[0]
      let pageIdx = 0
      if (this.progress && this.progress.last_article_id) {
        const matched = this.chapters.find(a => String(a.article_id) === String(this.progress.last_article_id))
        if (matched) {
          target = matched
          pageIdx = Number(this.progress.last_page_idx) || 0
        }
      }
      this.openChapter(target, pageIdx)
    },
    openChapter(chapter, pageIdx) {
      if (!chapter || !chapter.article_id) return
      const isSame = this.isCurrentChapter(chapter)
      const idx = pageIdx !== undefined ? pageIdx : (isSame && this.progress ? Number(this.progress.last_page_idx) || 0 : 0)
      this.$router.push({
        path: `/manga/read/${chapter.article_id}`,
        query: { novelId: this.novel.novel_id, ...(idx ? { pageIdx: idx } : {}) }
      })
    },
    async toggleNice() {
      if (!localStorage.getItem('token')) {
        this.$router.push('/login')
        return
      }
      try {
        await this.$api.novels.niceNovel(this.novel.novel_id)
        this.getNices()
      } catch (e) {
        this.$message.error('操作失败，请稍后重试')
      }
    },
    async toggleLike() {
      if (!localStorage.getItem('token')) {
        this.$router.push('/login')
        return
      }
      try {
        if (this.isInBookcase) {
          await this.$api.bookcase.removeLikeNovel(this.novel.novel_id)
          this.$message.success('已从书架移除')
        } else {
          await this.$api.bookcase.likeNovel(this.novel.novel_id)
          this.$message.success('成功添加到书架')
        }
        this.isInBookcase = !this.isInBookcase
      } catch (e) {
        this.$message.error('操作失败，请稍后重试')
      }
    },
    shareBook() {
      const content = `我正在原木社区看漫画《${this.novel.name}》，你也一起来看看吧！\nhttps://loghome.ink/novel/${this.novel.novel_id}`
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content)
          .then(() => this.$message.success('分享链接已复制到剪贴板'))
          .catch(() => this.$message.error('复制失败，请手动复制'))
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = content
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        this.$message.success('分享链接已复制到剪贴板')
      }
    },
    report() {
      // Phase 1：举报复用移动端浮窗（移动端漫画详情页内含举报入口）
      this.$openMobileWindow(`/pages/readers/mangaInfo?id=${this.novel.novel_id}`, { title: '举报作品' })
    },
    previewImage(url) {
      if (this.$preview) this.$preview([url], 0)
      else window.open(url, '_blank')
    },
    gotoManga(novelId) {
      this.$router.push(`/manga/${novelId}`)
    },
    gotoUserProfile(userId) {
      if (userId) this.$router.push(`/users/${userId}`)
    },
    addReaderHistory(book) { recordLocalReading(book) },
    formatNumber(num) {
      if (num >= 10000) return (num / 10000).toFixed(1) + '万'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
      return num
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.manga-page { padding-bottom: 40px; }
.error-container { text-align: center; padding: 60px 20px; color: #666; }
.back-button { display: inline-block; margin-top: 16px; color: #947358; }

.manga-container { background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); }

.manga-header { display: flex; gap: 30px; position: relative; }
.manga-cover { width: 220px; height: 300px; flex: none; border-radius: 8px; background-size: cover; background-position: center; background-color: #eee; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); }
.book-id-tag { position: absolute; top: 8px; left: 8px; background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 12px; padding: 2px 10px; border-radius: 10px; }

.manga-info { flex: 1; min-width: 0; }
.manga-title { font-size: 28px; font-weight: 700; color: #2c2c2c; margin: 0 0 14px; }
.manga-meta { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.author-info { display: flex; align-items: center; gap: 8px; cursor: pointer; color: inherit; text-decoration: none; }
.author-avatar, .author-avatar-placeholder { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.author-avatar-placeholder { display: grid; place-items: center; background: #947358; color: #fff; font-size: 14px; }
.author-name { color: #666; font-size: 14px; }
.author-info:hover .author-name { color: #947358; }
.type-pill { background: #f5f2ef; color: #947358; border: 1px solid #e6d8cf; border-radius: 12px; padding: 2px 12px; font-size: 12px; }

.manga-stats { display: flex; gap: 34px; margin-bottom: 18px; }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.stat-icon { font-size: 18px; }
.stat-value { font-size: 16px; font-weight: 600; color: #333; margin: 2px 0; }
.stat-label { font-size: 12px; color: #999; }

.manga-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
.tag { background: #f5f2ef; color: #947358; border: 1px solid #e6d8cf; border-radius: 14px; padding: 4px 14px; font-size: 13px; }
.tag.activity { background: #fff1e8; color: #c14a16; border-color: #ffd8bf; }

.manga-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.action-button { min-width: 96px; padding: 10px 22px; border: 1px solid #d8c9bd; border-radius: 22px; background: #fff; color: #704c35; font-size: 15px; cursor: pointer; transition: all 0.25s; }
.action-button:hover { border-color: #947358; color: #947358; }
.action-button:disabled { opacity: 0.5; cursor: not-allowed; }
.action-button.primary { background: #947358; border-color: #947358; color: #fff; }
.action-button.primary:hover { background: #704c35; border-color: #704c35; color: #fff; }

.manga-content { margin-top: 30px; }
.content-tabs { display: flex; flex-wrap: wrap; gap: 6px; border-bottom: 2px solid #f0e9e2; margin-bottom: 22px; }
.tab-button { padding: 10px 20px; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; font-size: 15px; color: #666; cursor: pointer; transition: all 0.25s; }
.tab-button:hover { color: #947358; }
.tab-button.active { color: #947358; font-weight: 600; border-bottom-color: #947358; }

.intro-text { color: #555; line-height: 1.9; white-space: pre-line; font-size: 15px; }
.empty-content { color: #999; text-align: center; padding: 40px 0; }

.chapters-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.chapters-count { color: #999; font-size: 13px; }
.sort-toggle { background: none; border: 1px solid #e6d8cf; color: #947358; border-radius: 14px; padding: 4px 14px; font-size: 13px; cursor: pointer; }
.chapter-list { display: flex; flex-direction: column; }
.chapter-item { display: flex; align-items: center; gap: 14px; padding: 14px 8px; border-bottom: 1px solid #f2ece6; cursor: pointer; transition: background 0.2s; }
.chapter-item:hover { background: #faf7f4; }
.chapter-number { width: 42px; flex: none; color: #947358; font-weight: 700; text-align: center; }
.chapter-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #333; font-size: 15px; }
.chapter-type { flex: none; font-size: 12px; color: #999; background: #f5f2ef; border-radius: 10px; padding: 2px 8px; }
.chapter-comments { flex: none; font-size: 12px; color: #999; }
.chapter-badge { flex: none; font-size: 12px; color: #c14a16; background: #fff1e8; border-radius: 10px; padding: 2px 8px; }
.chapter-date { flex: none; font-size: 12px; color: #bbb; width: 90px; text-align: right; }

.comment-list { display: flex; flex-direction: column; gap: 18px; }
.comment-item { padding: 16px; background: #faf7f4; border-radius: 10px; }
.comment-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.comment-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.comment-author { font-size: 14px; font-weight: 600; color: #333; }
.comment-time { font-size: 12px; color: #aaa; }
.comment-content { color: #444; line-height: 1.7; font-size: 14px; white-space: pre-line; }
.comment-images { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.comment-image { width: 96px; height: 96px; object-fit: cover; border-radius: 6px; cursor: pointer; }
.comment-footer { display: flex; gap: 18px; margin-top: 10px; font-size: 12px; color: #999; }
.view-all-comments { text-align: center; margin-top: 20px; color: #947358; cursor: pointer; font-size: 14px; }
.view-all-comments:hover { text-decoration: underline; }

.works-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 18px; }
.mini-work-card { cursor: pointer; color: inherit; text-decoration: none; }
.mini-work-card:focus-visible,.author-info:focus-visible { outline: 2px solid #947358; outline-offset: 4px; }
.author-works-notice { margin-bottom: 16px; color: #947358; font-size: 13px; }
.author-works-notice button { margin-left: 8px; color: inherit; background: white; border: 1px solid #d9cbbb; padding: 4px 12px; border-radius: 4px; cursor: pointer; }
.mini-work-cover { width: 100%; height: 190px; border-radius: 8px; background-size: cover; background-position: center; background-color: #eee; }
.mini-work-info { margin-top: 8px; }
.mini-work-title { font-size: 14px; font-weight: 600; color: #333; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mini-work-status { font-size: 12px; color: #999; margin: 4px 0 0; }
.mini-work-card:hover .mini-work-title { color: #947358; }

@media (max-width: 768px) {
  .manga-header { flex-direction: column; align-items: center; text-align: center; }
  .manga-cover { width: 180px; height: 246px; }
  .manga-meta, .manga-actions { justify-content: center; }
}
</style>
