<template>
  <div class="manga-reader" :class="'reader-' + readerBackground">
    <!-- 顶栏 -->
    <div class="top-bar">
      <button class="bar-icon" type="button" title="返回" @click="goBack">
        <manga-icon name="back" />
      </button>
      <div class="bar-title">
        <span class="bar-novel">{{ novelName }}</span>
        <span class="bar-episode">第 {{ currentEpisodeNo }} 话 / 共 {{ articles.length }} 话</span>
      </div>
      <el-popover placement="bottom-end" width="280" trigger="click" popper-class="reader-settings-pop">
        <div class="settings-panel">
          <div class="setting-head">阅读设置</div>
          <div class="setting-label">阅读方式</div>
          <el-radio-group v-model="mode" size="mini" @change="onModeChange">
            <el-radio-button label="strip">上下滚动</el-radio-button>
            <el-radio-button label="paged">左右翻页</el-radio-button>
          </el-radio-group>
          <template v-if="mode === 'paged'">
            <div class="setting-label">翻页方向</div>
            <el-radio-group v-model="readingDirection" size="mini" @change="savePreferences">
              <el-radio-button label="ltr">从左到右</el-radio-button>
              <el-radio-button label="rtl">从右到左</el-radio-button>
            </el-radio-group>
          </template>
          <div class="setting-label">阅读背景</div>
          <el-radio-group v-model="readerBackground" size="mini" @change="savePreferences">
            <el-radio-button label="white">白色</el-radio-button>
            <el-radio-button label="warm">暖色</el-radio-button>
            <el-radio-button label="black">黑色</el-radio-button>
          </el-radio-group>
          <div class="setting-label">图片清晰度</div>
          <el-radio-group v-model="imageQuality" size="mini" @change="savePreferences">
            <el-radio-button label="standard">流畅</el-radio-button>
            <el-radio-button label="original">原图</el-radio-button>
          </el-radio-group>
        </div>
        <button slot="reference" class="bar-icon" type="button" title="阅读设置">
          <manga-icon name="settings" />
        </button>
      </el-popover>
    </div>

    <!-- 阅读区 -->
    <div class="reader-stage">
      <!-- 条漫：原生滚动 + 懒加载 -->
      <div v-if="mode === 'strip'" ref="stripScroll" class="strip-scroll" @scroll.passive="onStripScroll">
        <div v-for="(page, idx) in pages" :key="articleId + '-' + idx" class="strip-page">
          <img
            v-if="!pageErrors[idx]"
            class="strip-img"
            :src="pageSrc(page, idx)"
            loading="lazy"
            draggable="false"
            alt=""
            @error="onPageError(idx)" />
          <button v-else class="page-retry" type="button" @click="retryPage(idx)">
            <manga-icon name="retry" /> 第 {{ idx + 1 }} 页加载失败，重试
          </button>
        </div>
        <div class="episode-end">
          <button v-if="hasNextEpisode" class="end-next" type="button" @click="nextEpisode">
            阅读下一话 <manga-icon name="next" />
          </button>
          <span v-else class="end-tip">本话完 · 感谢阅读</span>
        </div>
      </div>

      <!-- 页漫：单页缩放 + 左右翻页 -->
      <div v-else class="paged-area">
        <button
          class="page-arrow left"
          type="button"
          :disabled="!canGoPrev"
          title="上一页"
          @click="stepPage(-1)">
          <manga-icon name="previous" />
        </button>
        <div class="paged-frame">
          <manga-reader-image
            v-if="currentPageObj"
            :key="articleId + '-' + currentPage"
            :src="pageSrc(currentPageObj, currentPage)"
            :reset-key="zoomResetKey"
            @interaction="zoomed = $event"
            @error="onPageError(currentPage)" />
          <button v-if="pageErrors[currentPage]" class="page-retry paged" type="button" @click="retryPage(currentPage)">
            <manga-icon name="retry" /> 本页加载失败，重试
          </button>
        </div>
        <button
          class="page-arrow right"
          type="button"
          :disabled="!canGoNext"
          title="下一页"
          @click="stepPage(1)">
          <manga-icon name="next" />
        </button>
      </div>

      <!-- 弹幕层 -->
      <manga-danmu-layer
        v-if="danmuEnabled && !zoomed && currentPageDanmus.length"
        :key="'danmu-' + articleId + '-' + currentPage + '-' + danmuReplayTick"
        :danmus="currentPageDanmus"
        :current-user-id="currentUserId"
        :work-author-id="workAuthorId"
        @remove="removeDanmu" />

      <div v-if="mode === 'paged' && pages.length" class="floating-page">{{ currentPage + 1 }} / {{ pages.length }}</div>
    </div>

    <!-- 底栏 -->
    <div class="bottom-bar">
      <div class="danmu-row">
        <button
          class="danmu-toggle"
          :class="{ off: !danmuEnabled }"
          type="button"
          :title="danmuEnabled ? '关闭弹幕' : '开启弹幕'"
          @click="toggleDanmu">
          <manga-icon name="danmu" />
        </button>
        <input
          v-model="danmuInput"
          class="danmu-input"
          type="text"
          maxlength="100"
          placeholder="发条弹幕见证此刻..."
          :disabled="danmuSending"
          @keyup.enter="submitDanmu" />
        <button
          class="danmu-sync"
          :class="{ on: danmuSyncComment }"
          type="button"
          title="同时发送为本话评论"
          @click="danmuSyncComment = !danmuSyncComment">
          同步评论
        </button>
        <button class="danmu-send" type="button" :disabled="danmuSending || !danmuInput.trim()" @click="submitDanmu">发送</button>
      </div>

      <div class="progress-row">
        <span class="progress-label">{{ progressLabel }}</span>
        <el-slider
          class="progress-slider"
          :min="1"
          :max="Math.max(2, pages.length)"
          :value="currentPage + 1"
          :disabled="pages.length < 2"
          :show-tooltip="false"
          @change="onPageSlider" />
      </div>

      <div class="reader-actions">
        <button class="act-btn" type="button" @click="openCatalog = true"><manga-icon name="list" /><span>目录</span></button>
        <button class="act-btn" type="button" @click="openCommentPanel"><manga-icon name="comment" /><span>{{ commentAmount ? '评论 ' + commentAmount : '评论' }}</span></button>
        <button class="act-btn" type="button" :disabled="!hasPrevEpisode" @click="prevEpisode"><manga-icon name="previous" /><span>上一话</span></button>
        <button class="act-btn" type="button" :disabled="!hasNextEpisode" @click="nextEpisode"><manga-icon name="next" /><span>下一话</span></button>
        <button class="act-btn" type="button" @click="resetZoom"><manga-icon name="zoom" /><span>复位</span></button>
      </div>
    </div>

    <!-- 目录抽屉 -->
    <el-drawer title="漫画目录" :visible.sync="openCatalog" direction="rtl" size="420px" custom-class="catalog-drawer">
      <div class="catalog-list">
        <button
          v-for="(item, idx) in articles"
          :key="item.article_id"
          class="catalog-row"
          :class="{ current: idx === currentIdx }"
          type="button"
          @click="jumpToEpisode(idx)">
          <span class="catalog-no">{{ item.article_chapter }}</span>
          <span class="catalog-name">{{ item.title }}</span>
          <manga-icon v-if="idx === currentIdx" name="check" />
        </button>
      </div>
    </el-drawer>

    <!-- 本话评论 -->
    <manga-comment-panel
      :key="'cmt-' + articleId"
      :visible.sync="commentVisible"
      :novel-id="novelId"
      :article-id="articleId"
      :work-author-id="workAuthorId"
      @changed="loadCommentAmount" />

    <!-- 加载 / 错误遮罩 -->
    <div v-if="loading" class="state-mask">正在加载漫画…</div>
    <div v-else-if="loadError" class="state-mask">
      <span>{{ loadError }}</span>
      <div class="state-actions">
        <button class="state-btn" type="button" @click="retryEpisode"><manga-icon name="retry" /> 重试</button>
        <button class="state-btn" type="button" @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import MangaIcon from '~/components/manga/MangaIcon.vue'
import MangaDanmuLayer from '~/components/manga/MangaDanmuLayer.vue'
import MangaReaderImage from '~/components/manga/MangaReaderImage.vue'
import MangaCommentPanel from '~/components/manga/MangaCommentPanel.vue'
import { fetchMangaCommentAmount, publishMangaComment, getMangaCommentErrorMessage } from '~/common/manga-comment-api.js'
import {
  currentDanmuUserId,
  fetchMangaDanmus,
  sendMangaDanmu,
  deleteMangaDanmu,
  getMangaDanmuErrorMessage
} from '~/common/manga-danmu-api.js'

const baseUrl = process.env.baseUrl

export default {
  name: 'MangaReaderPage',
  components: { MangaIcon, MangaDanmuLayer, MangaReaderImage, MangaCommentPanel },
  layout: 'empty',
  data() {
    return {
      articleId: null,
      novelId: null,
      novelName: '漫画',
      workAuthorId: null,
      articles: [],
      currentIdx: -1,
      articleData: null,
      pages: [],
      mode: 'strip',
      readingDirection: 'ltr',
      readerBackground: 'white',
      imageQuality: 'standard',
      userModeChosen: false,
      currentPage: 0,
      loading: true,
      loadError: '',
      loadRequestId: 0,
      requestedIdx: -1,
      pageErrors: {},
      retryCount: {},
      zoomed: false,
      zoomResetKey: 0,
      preloadedChapter: null,
      // 进度
      progressTimer: null,
      pendingProgress: false,
      syncingProgress: false,
      queuedProgress: null,
      // 评论
      commentVisible: false,
      commentAmount: 0,
      // 弹幕
      danmuEnabled: true,
      danmuList: [],
      danmuInput: '',
      danmuSending: false,
      danmuSyncComment: false,
      danmuReplayTick: 0,
      // 目录
      openCatalog: false
    }
  },
  computed: {
    currentEpisodeNo() {
      if (this.currentIdx >= 0 && this.articles[this.currentIdx]) return this.articles[this.currentIdx].article_chapter
      return '-'
    },
    hasPrevEpisode() {
      return this.currentIdx > 0
    },
    hasNextEpisode() {
      return this.currentIdx >= 0 && this.currentIdx < this.articles.length - 1
    },
    progressLabel() {
      if (!this.pages.length) return '-'
      return `${Math.min(this.currentPage, this.pages.length - 1) + 1} / ${this.pages.length} 页`
    },
    currentPageObj() {
      return this.pages[this.currentPage] || null
    },
    canGoPrev() {
      return this.currentPage > 0 || this.hasPrevEpisode
    },
    canGoNext() {
      return this.currentPage < this.pages.length - 1 || this.hasNextEpisode
    },
    currentPageDanmus() {
      return this.danmuList.filter(item => item.pageIdx === this.currentPage)
    },
    currentUserId() {
      return currentDanmuUserId()
    }
  },
  mounted() {
    this.loadPreferences()
    const q = this.$route.query
    this.articleId = this.$route.params.articleId
    this.novelId = q.novelId
    this.initPageIdx = Math.max(0, parseInt(q.pageIdx) || 0)
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('beforeunload', this.onBeforeUnload)
    this.bootstrap()
  },
  beforeDestroy() {
    this.loadRequestId += 1
    clearTimeout(this.progressTimer)
    this.progressTimer = null
    this.syncProgress(true)
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('beforeunload', this.onBeforeUnload)
  },
  methods: {
    onBeforeUnload() {
      this.syncProgress(true)
    },
    getToken() {
      try {
        const parsed = JSON.parse(localStorage.getItem('token'))
        return parsed ? parsed.tk : null
      } catch (e) {
        return null
      }
    },
    loadPreferences() {
      try {
        const s = JSON.parse(localStorage.getItem('MangaReaderSettings')) || {}
        if (s.mode === 'strip' || s.mode === 'paged') {
          this.mode = s.mode
          this.userModeChosen = true
        }
        if (s.direction === 'rtl') this.readingDirection = 'rtl'
        if (['white', 'warm', 'black'].includes(s.background)) this.readerBackground = s.background
        if (s.quality === 'original') this.imageQuality = 'original'
        this.danmuEnabled = s.danmu !== false
      } catch (e) {}
    },
    savePreferences() {
      try {
        localStorage.setItem(
          'MangaReaderSettings',
          JSON.stringify({
            mode: this.mode,
            direction: this.readingDirection,
            background: this.readerBackground,
            quality: this.imageQuality,
            danmu: this.danmuEnabled
          })
        )
      } catch (e) {}
    },
    onModeChange() {
      this.resetZoom()
      this.userModeChosen = true
      this.savePreferences()
      if (this.mode === 'strip') this.$nextTick(() => this.seekStripPage(this.currentPage))
    },
    resetZoom() {
      this.zoomed = false
      this.zoomResetKey += 1
    },
    // ===== 加载 =====
    async bootstrap() {
      await Promise.all([this.loadNovelName(), this.loadChapters()])
      if (!this.articles.length) {
        this.loading = false
        this.loadError = this.loadError || '还没有可阅读的话数'
        return
      }
      let idx = this.articles.findIndex(a => String(a.article_id) === String(this.articleId))
      if (idx < 0) idx = 0
      await this.openArticle(this.articles[idx].article_id, this.initPageIdx || 0, idx)
    },
    async loadNovelName() {
      try {
        const res = await fetch(`${baseUrl}/library/get_novel_by_id?id=${this.novelId}`)
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          this.novelName = data[0].name || '漫画'
          this.workAuthorId = data[0].auther_id || data[0].author_id
        }
      } catch (e) {
        console.error('loadNovelName failed', e)
      }
    },
    async loadChapters() {
      try {
        const res = await fetch(`${baseUrl}/library/get_articles?id=${this.novelId}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          this.articles = data.filter(a => a.article_type === 'mangaStrip' || a.article_type === 'mangaPage')
        }
      } catch (e) {
        console.error('loadChapters failed', e)
        this.loadError = '目录加载失败'
      }
    },
    parseMangaContent(content) {
      let parsed = content
      if (typeof content === 'string') {
        try {
          parsed = JSON.parse(content)
        } catch (e) {
          parsed = null
        }
      }
      if (parsed && Array.isArray(parsed.pages)) return parsed.pages
      return []
    },
    async openArticle(articleId, pageIdx, episodeIdx) {
      this.syncProgress(true)
      clearTimeout(this.progressTimer)
      this.progressTimer = null
      this.pendingProgress = false
      const requestId = ++this.loadRequestId
      this.requestedIdx = episodeIdx
      this.loading = true
      this.loadError = ''
      try {
        const res = await fetch(`${baseUrl}/articles/get_article?id=${articleId}&isCaching=false`)
        if (requestId !== this.loadRequestId) return
        const data = await res.json()
        if (!Array.isArray(data) || !data.length) throw new Error('话数加载失败')
        const article = data[0]
        if (this.novelId && String(article.novel_id) !== String(this.novelId)) throw new Error('话数不属于当前作品')
        const pages = this.parseMangaContent(article.content)
        if (!pages.length) throw new Error('本话暂无可阅读页面')
        this.resetZoom()
        this.currentIdx = episodeIdx
        this.articleId = article.article_id
        this.articleData = article
        if (!this.novelId) this.novelId = article.novel_id
        this.pages = pages
        this.pageErrors = {}
        this.retryCount = {}
        this.preloadedChapter = null
        this.currentPage = Math.min(Math.max(0, Number(pageIdx) || 0), pages.length - 1)
        if (!this.userModeChosen) this.mode = article.article_type === 'mangaPage' ? 'paged' : 'strip'
        this.resetChapterDanmus()
        this.loadCommentAmount()
        // 更新地址栏，便于刷新/分享保持位置
        this.$router.replace({ path: `/manga/read/${this.articleId}`, query: { novelId: this.novelId, pageIdx: this.currentPage } }).catch(() => {})
        if (this.mode === 'strip') {
          this.$nextTick(() => {
            if (requestId === this.loadRequestId) this.seekStripPage(this.currentPage)
          })
        }
        this.syncProgress(true)
      } catch (e) {
        if (requestId !== this.loadRequestId) return
        console.error('openArticle failed', e)
        this.loadError = e.message || '话数加载失败'
      } finally {
        if (requestId === this.loadRequestId) this.loading = false
      }
    },
    retryEpisode() {
      if (!this.articles.length) {
        this.loadError = ''
        this.loading = true
        this.bootstrap()
        return
      }
      const idx = this.requestedIdx >= 0 ? this.requestedIdx : this.currentIdx
      this.openArticle(this.articles[idx].article_id, 0, idx)
    },
    pageSrc(page, idx) {
      if (!page || !page.url) return ''
      const url = this.imageQuality === 'original' ? page.url : page.readingUrl || page.url
      const retry = this.retryCount[idx]
      if (!retry) return url
      return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'mret=' + retry
    },
    onPageError(idx) {
      this.$set(this.pageErrors, idx, true)
    },
    retryPage(idx) {
      this.$set(this.pageErrors, idx, false)
      this.$set(this.retryCount, idx, (this.retryCount[idx] || 0) + 1)
    },
    // ===== 条漫滚动 =====
    onStripScroll() {
      if (this.loading) return
      const el = this.$refs.stripScroll
      if (!el) return
      const focus = el.scrollTop + el.clientHeight * 0.4
      const els = el.querySelectorAll('.strip-page')
      let idx = 0
      for (let i = 0; i < els.length; i++) {
        if (els[i].offsetTop <= focus) idx = i
        else break
      }
      if (idx !== this.currentPage) this.currentPage = idx
      this.scheduleSync()
    },
    seekStripPage(idx) {
      const el = this.$refs.stripScroll
      if (!el) return
      const target = el.querySelectorAll('.strip-page')[idx]
      if (target) el.scrollTop = target.offsetTop
    },
    // ===== 页漫翻页 =====
    stepPage(delta) {
      const dirDelta = this.readingDirection === 'rtl' ? -delta : delta
      this.goToPage(this.currentPage + dirDelta)
    },
    goToPage(idx) {
      this.resetZoom()
      if (!this.pages.length) return
      if (idx < 0) {
        if (this.hasPrevEpisode) this.prevEpisode()
        return
      }
      if (idx >= this.pages.length) {
        if (this.hasNextEpisode) this.nextEpisode()
        else this.$message.info('已是最后一页')
        return
      }
      this.currentPage = idx
      this.scheduleSync()
    },
    onPageSlider(value) {
      this.resetZoom()
      const idx = Math.min(this.pages.length - 1, Math.max(0, Number(value) - 1))
      this.currentPage = idx
      if (this.mode === 'strip') this.seekStripPage(idx)
      this.scheduleSync()
    },
    // ===== 话数切换 =====
    prevEpisode() {
      if (!this.hasPrevEpisode) {
        this.$message.info('已经是第一话了')
        return
      }
      const idx = this.currentIdx - 1
      this.openArticle(this.articles[idx].article_id, 0, idx)
    },
    nextEpisode() {
      if (!this.hasNextEpisode) {
        this.$message.info('已经是最后一话了')
        return
      }
      const idx = this.currentIdx + 1
      this.openArticle(this.articles[idx].article_id, 0, idx)
    },
    jumpToEpisode(idx) {
      this.openCatalog = false
      if (idx === this.currentIdx) return
      this.openArticle(this.articles[idx].article_id, 0, idx)
    },
    async preloadNextEpisode() {
      if (!this.hasNextEpisode) return
      const id = this.articles[this.currentIdx + 1].article_id
      if (this.preloadedChapter === id) return
      this.preloadedChapter = id
      try {
        const res = await fetch(`${baseUrl}/articles/get_article?id=${id}&isCaching=true`)
        const data = await res.json()
        const article = Array.isArray(data) && data[0]
        const page = article && this.parseMangaContent(article.content)[0]
        if (!page) return
        const url = this.imageQuality === 'original' ? page.url : page.readingUrl || page.url
        const img = new Image()
        img.src = url
      } catch (e) {
        this.preloadedChapter = null
      }
    },
    // ===== 进度上报 =====
    scheduleSync() {
      if (this.currentPage >= this.pages.length - 2) this.preloadNextEpisode()
      if (this.progressTimer) {
        this.pendingProgress = true
        return
      }
      this.progressTimer = setTimeout(() => {
        this.progressTimer = null
        this.syncProgress(true)
        if (this.pendingProgress) {
          this.pendingProgress = false
          this.scheduleSync()
        }
      }, 3000)
    },
    async syncProgress(force) {
      if (!this.articleData || !this.novelId || !this.pages.length) return
      const payload = {
        novel_id: Number(this.novelId),
        article_id: Number(this.articleId),
        article_chapter: Number(this.articles[this.currentIdx] ? this.articles[this.currentIdx].article_chapter : 0) || null,
        page_idx: Math.min(Math.max(0, this.currentPage), this.pages.length - 1)
      }
      try {
        localStorage.setItem(
          'MangaHistory_' + this.novelId,
          JSON.stringify({
            last_article_id: payload.article_id,
            last_article_chapter: payload.article_chapter,
            last_page_idx: payload.page_idx
          })
        )
      } catch (e) {}
      if (!force) return
      if (!this.getToken()) return
      this.queuedProgress = payload
      await this.flushProgress()
    },
    async flushProgress() {
      if (this.syncingProgress || !this.queuedProgress) return
      const payload = this.queuedProgress
      this.queuedProgress = null
      const tk = this.getToken()
      if (!tk) return
      this.syncingProgress = true
      try {
        await fetch(`${baseUrl}/library/update_reading_progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` },
          body: JSON.stringify(payload)
        })
      } catch (e) {
        console.error('syncProgress failed', e)
      } finally {
        this.syncingProgress = false
        if (this.queuedProgress) this.flushProgress()
      }
    },
    // ===== 评论 =====
    openCommentPanel() {
      this.commentVisible = true
    },
    async loadCommentAmount() {
      try {
        this.commentAmount = await fetchMangaCommentAmount(baseUrl, this.novelId, this.articleId)
      } catch (e) {
        console.error('loadCommentAmount failed', e)
      }
    },
    // ===== 弹幕 =====
    toggleDanmu() {
      this.danmuEnabled = !this.danmuEnabled
      this.savePreferences()
    },
    resetChapterDanmus() {
      this.danmuList = []
      this.danmuInput = ''
      this.loadDanmus()
    },
    async loadDanmus() {
      try {
        this.danmuList = await fetchMangaDanmus(baseUrl, this.novelId, this.articleId)
      } catch (e) {
        console.error('loadDanmus failed', e)
      }
    },
    requireLogin() {
      if (this.getToken()) return true
      this.$message.info('请先登录')
      return false
    },
    async submitDanmu() {
      if (!this.requireLogin() || this.danmuSending) return
      const content = this.danmuInput.trim()
      if (!content) return
      this.danmuSending = true
      try {
        const danmu = await sendMangaDanmu(baseUrl, {
          novelId: this.novelId,
          articleId: this.articleId,
          pageIdx: this.currentPage,
          content
        })
        this.danmuList = this.danmuList.concat(danmu)
        this.danmuInput = ''
        this.danmuReplayTick += 1
        if (this.danmuSyncComment) {
          try {
            await publishMangaComment(baseUrl, { novelId: this.novelId, articleId: this.articleId, content, images: [] })
            this.loadCommentAmount()
            this.$message.success('已同步至本话评论')
          } catch (e) {
            this.$message.error(getMangaCommentErrorMessage(e, '同步评论失败，请稍后重试'))
          }
        }
      } catch (e) {
        this.$message.error(getMangaDanmuErrorMessage(e))
      } finally {
        this.danmuSending = false
      }
    },
    removeDanmu(danmuId) {
      const target = this.danmuList.find(item => item.danmuId === danmuId)
      if (!target) return
      this.$confirm('确定删除这条弹幕吗？', '删除弹幕', { type: 'warning' })
        .then(async () => {
          try {
            await deleteMangaDanmu(baseUrl, danmuId)
            this.danmuList = this.danmuList.filter(item => item.danmuId !== danmuId)
            this.danmuReplayTick += 1
            this.$message.success('已删除')
          } catch (e) {
            this.$message.error(getMangaDanmuErrorMessage(e, '删除失败，请稍后重试'))
          }
        })
        .catch(() => {})
    },
    // ===== 交互 =====
    handleKeydown(e) {
      const tag = e.target && e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'Escape') {
        if (this.commentVisible) this.commentVisible = false
        else if (this.openCatalog) this.openCatalog = false
        else if (this.zoomed) this.resetZoom()
        return
      }
      if (this.zoomed) return
      if (this.mode !== 'paged') return
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.stepPage(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.stepPage(-1)
      } else if (e.key === ' ') {
        e.preventDefault()
        this.stepPage(1)
      }
    },
    goBack() {
      if (this.novelId) {
        this.$router.push(`/manga/${this.novelId}`)
      } else {
        this.$router.back()
      }
    }
  }
}
</script>

<style scoped>
.manga-reader {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
.reader-warm { background: #f6efdf; }
.reader-black { background: #101113; }

/* 顶栏 */
.top-bar {
  flex: none;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e6d8cf;
  z-index: 40;
}
.reader-black .top-bar { background: rgba(24, 26, 29, 0.96); border-bottom-color: #2c2f33; }
.bar-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border: none;
  background: none;
  color: #704c35;
  font-size: 20px;
  cursor: pointer;
  border-radius: 8px;
}
.bar-icon:hover { background: #f3ece6; }
.reader-black .bar-icon { color: #d8d2cc; }
.reader-black .bar-icon:hover { background: #2c2f33; }
.bar-title { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; }
.bar-novel { font-size: 15px; font-weight: 700; color: #3a2b21; max-width: 60vw; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.bar-episode { margin-top: 2px; font-size: 12px; color: #947358; }
.reader-black .bar-novel { color: #ece7e1; }
.reader-black .bar-episode { color: #9a938b; }

/* 阅读区 */
.reader-stage { position: relative; flex: 1; min-height: 0; overflow: hidden; }
.strip-scroll { width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; position: relative; }
.strip-page { width: 100%; display: flex; justify-content: center; }
.strip-img { width: 100%; max-width: 900px; display: block; }
.episode-end { padding: 40px 20px 60px; text-align: center; }
.end-next {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 28px;
  border: none;
  border-radius: 100px;
  background: #947358;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}
.end-next:hover { background: #7d5f47; }
.end-tip { color: #a99; font-size: 14px; }
.reader-black .end-tip { color: #7a736b; }

.paged-area { width: 100%; height: 100%; display: flex; align-items: stretch; }
.paged-frame { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; justify-content: center; }
.page-arrow {
  flex: none;
  width: 64px;
  border: none;
  background: transparent;
  color: #947358;
  font-size: 26px;
  cursor: pointer;
  transition: background 0.2s;
}
.page-arrow:hover:not(:disabled) { background: rgba(148, 115, 88, 0.08); }
.page-arrow:disabled { opacity: 0.25; cursor: default; }
.reader-black .page-arrow { color: #cfc7be; }

.page-retry {
  margin: 40px auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid #e6d8cf;
  border-radius: 12px;
  background: #fff1e8;
  color: #947358;
  font-size: 14px;
  cursor: pointer;
}
.page-retry.paged { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0; }

.floating-page {
  position: absolute;
  right: 20px;
  bottom: 16px;
  z-index: 35;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(19, 22, 25, 0.72);
  color: #fff;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

/* 底栏 */
.bottom-bar {
  flex: none;
  padding: 10px 20px 12px;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid #e6d8cf;
  z-index: 40;
}
.reader-black .bottom-bar { background: rgba(24, 26, 29, 0.96); border-top-color: #2c2f33; }
.danmu-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.danmu-toggle {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border: none;
  border-radius: 50%;
  background: #f3ece6;
  color: #947358;
  font-size: 18px;
  cursor: pointer;
}
.danmu-toggle.off { color: #b6aca2; opacity: 0.6; }
.reader-black .danmu-toggle { background: #2c2f33; }
.danmu-input {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #e6d8cf;
  border-radius: 100px;
  background: #fff;
  color: #3a2b21;
  font-size: 14px;
  outline: none;
}
.danmu-input:focus { border-color: #947358; }
.reader-black .danmu-input { background: #1b1d20; border-color: #2c2f33; color: #ece7e1; }
.danmu-sync {
  flex: none;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #e6d8cf;
  border-radius: 100px;
  background: #fff;
  color: #947358;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}
.danmu-sync.on { background: #fff1e8; border-color: #d9b79c; font-weight: 600; }
.reader-black .danmu-sync { background: #1b1d20; border-color: #2c2f33; }
.danmu-send {
  flex: none;
  height: 38px;
  padding: 0 22px;
  border: none;
  border-radius: 100px;
  background: #947358;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.danmu-send:disabled { opacity: 0.5; cursor: default; }
.danmu-send:hover:not(:disabled) { background: #7d5f47; }

.progress-row { display: flex; align-items: center; gap: 14px; padding: 0 4px; }
.progress-label { flex: none; font-size: 13px; color: #947358; font-variant-numeric: tabular-nums; min-width: 84px; }
.reader-black .progress-label { color: #9a938b; }
.progress-slider { flex: 1; min-width: 0; }

.reader-actions { display: flex; align-items: center; justify-content: space-around; margin-top: 6px; }
.act-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 14px;
  border: none;
  background: none;
  color: #704c35;
  font-size: 12px;
  cursor: pointer;
  border-radius: 8px;
}
.act-btn:hover:not(:disabled) { background: #f3ece6; }
.act-btn:disabled { opacity: 0.35; cursor: default; }
.act-btn .manga-icon { font-size: 20px; }
.reader-black .act-btn { color: #d8d2cc; }
.reader-black .act-btn:hover:not(:disabled) { background: #2c2f33; }

/* 目录 */
.catalog-list { padding: 0 8px; }
.catalog-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid #f0e7df;
  background: none;
  text-align: left;
  font-size: 14px;
  color: #3a2b21;
  cursor: pointer;
}
.catalog-row:hover { background: #faf6f2; }
.catalog-row.current { color: #947358; background: #fff1e8; font-weight: 700; }
.catalog-no { flex: none; width: 40px; color: #a99; font-variant-numeric: tabular-nums; }
.catalog-name { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

/* 设置面板 */
.settings-panel { padding: 4px 2px; }
.setting-head { font-size: 15px; font-weight: 700; color: #3a2b21; margin-bottom: 8px; }
.setting-label { font-size: 12px; color: #947358; font-weight: 600; margin: 12px 0 6px; }

/* 遮罩 */
.state-mask {
  position: absolute;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: #f5f2ef;
  color: #704c35;
  font-size: 15px;
}
.state-actions { display: flex; gap: 12px; }
.state-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border: 1px solid #e6d8cf;
  border-radius: 100px;
  background: #fff;
  color: #947358;
  font-size: 14px;
  cursor: pointer;
}
.state-btn:hover { background: #fff1e8; }
</style>
