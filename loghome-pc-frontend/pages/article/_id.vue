<template>
  <div class="article-page" :class="{ 'reading-page-mode': readerReady && readerPreferences.mode === 'page' }">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载内容...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="goBack" class="back-button">返回</button>
    </div>

    <div v-else class="article-container">
      <!-- 固定的顶部导航栏 -->
      <div class="article-header sticky">
        <div class="header-content">
          <div class="novel-info">
            <nuxt-link class="novel-title" :to="workUrl(novel)">{{ novel.name }}</nuxt-link>
            <div class="chapter-nav">
              <nuxt-link v-if="hasPrevious" :to="`/article/${chapters[currentChapterIndex - 1].article_id}`" class="nav-btn" rel="prev"><span class="nav-icon">←</span> 上一章</nuxt-link><button v-else class="nav-btn" disabled>← 上一章</button>
              <button class="chapter-btn" @click="readerNavigationVisible = true"><span class="nav-icon">≡</span> 目录</button>
              <nuxt-link v-if="hasNext" :to="`/article/${chapters[currentChapterIndex + 1].article_id}`" class="nav-btn" rel="next">下一章 <span class="nav-icon">→</span></nuxt-link><nuxt-link v-else-if="canFinish" :to="`/read/end/${novel.novel_id}`" class="nav-btn">已读至最后 →</nuxt-link><button v-else class="nav-btn" disabled>下一章 →</button>
            </div>
          </div>
          <div class="reading-controls">
            <button class="reader-control-btn" @click="openReaderExcerpts"><i class="el-icon-collection" aria-hidden="true" /> 书摘</button>
            <button class="reader-control-btn" :aria-label="readerNightMode ? '切换到日间阅读' : '切换到夜间阅读'" :aria-pressed="readerNightMode ? 'true' : 'false'" @click="toggleReaderNightMode"><i :class="readerNightMode ? 'el-icon-sunny' : 'el-icon-moon'" aria-hidden="true" /> {{ readerNightMode ? '日间' : '夜间' }}</button>
            <button class="reader-control-btn" @click="openReaderAudio()"><i class="el-icon-headset" aria-hidden="true" /> 听书</button>
            <button class="reader-control-btn" @click="readerSettingsVisible = true"><i class="el-icon-setting" aria-hidden="true" /> 阅读设置</button>
            <button class="reader-control-btn" @click="openParagraphCommentWindow(0)"><i class="el-icon-chat-line-round" aria-hidden="true" /> 章节评论</button>
          </div>
        </div>
      </div>

      <div class="article-content-wrapper" :class="{ 'reader-dark': readerTheme.isBlack, 'block-epoch-skin': currentReaderSkin && currentReaderSkin.skin_key === 'block_epoch' }" :style="readerAppearance">

        <!-- 文章标题 -->
        <div class="article-title-container">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span>作者: {{ novel.author_name || '佚名' }}</span>
            <span>更新: {{ formatDate(article.update_time) }}</span>
            <span>字数: {{ formatNumber(article.text_count || 0) }}</span>
          </div>
        </div>

        <ReaderPager ref="pager" :article="article" :typography="readerTypography" :paged="readerReady && readerPreferences.mode === 'page'" :counts="paragraphCommentsCount" :highlights="highlights" :speaking-id="audioSpeakingId" :initial-position="readerInitialPosition" :has-previous="hasPrevious" :has-next="hasNext" :can-finish="canFinish" :chapter-percent="chapterPercent" :navigation-blocked="readerSettingsVisible || readerNavigationVisible || readerExcerptsVisible || showCommentDrawer || feedbackVisible || selectionMode" @paragraph-menu="handleParagraphRightClick($event.event, $event.element)" @comment="openParagraphCommentWindow" @position="onReaderPosition" @boundary="navigatePageBoundary" @finish="finishReading" />

        <div v-if="highlightError" class="reader-highlight-status" role="status">
          <span>{{ highlightError }}</span>
          <nuxt-link v-if="highlightAuthExpired" :to="{ path: '/login', query: { redirect: $route.fullPath } }">重新登录</nuxt-link>
          <button v-else class="reader-control-btn" @click="loadHighlights">重试划线</button>
        </div>

        <!-- 文章底部导航 -->
        <div class="article-footer">
          <div class="chapter-nav">
            <nuxt-link v-if="hasPrevious" :to="`/article/${chapters[currentChapterIndex - 1].article_id}`" class="nav-btn" rel="prev"><span class="nav-icon">←</span> 上一章</nuxt-link><button v-else class="nav-btn" disabled>← 上一章</button>
            <nuxt-link :to="workUrl(novel)" class="chapter-btn"><span class="nav-icon">≡</span> 目录</nuxt-link>
            <nuxt-link v-if="hasNext" :to="`/article/${chapters[currentChapterIndex + 1].article_id}`" class="nav-btn" rel="next">下一章 <span class="nav-icon">→</span></nuxt-link><nuxt-link v-else-if="canFinish" :to="`/read/end/${novel.novel_id}`" class="nav-btn">已读至最后 →</nuxt-link><button v-else class="nav-btn" disabled>下一章 →</button>
          </div>
        </div>
      </div>

      <MangaCommentPanel ref="chapterReviews" class="chapter-reviews" inline :visible="true" :novel-id="novel.novel_id" :article-id="article.article_id" :work-author-id="novel.author_id || novel.auther_id" scope-title="章节评论" @changed="onCommentsChanged('inline')" />

      <!-- 段落操作浮动面板 -->
      <div class="paragraph-floating-panel" v-if="selectionMode && selectedParagraph"
        :style="{ left: panelPosition.x + 'px', top: panelPosition.y + 'px' }">
        <div class="panel-button" @click="handleCopy">
          <i class="el-icon-document-copy"></i>
          <span>复制</span>
        </div>
        <div class="panel-button" @click="openParagraphCommentWindow(selectedParagraph.id)">
          <i class="el-icon-chat-line-round"></i>
          <span>评论</span>
        </div>
        <div class="panel-button" @click="toggleHighlight"><i class="el-icon-collection-tag"></i><span>{{ selectedHighlight ? '取消划线' : '划线书摘' }}</span></div>
        <div class="panel-button" @click="openFeedback"><i class="el-icon-edit-outline"></i><span>反馈错误</span></div>
        <div class="panel-button" @click="openReaderAudio(selectedParagraph.id)"><i class="el-icon-headset"></i><span>从此处听书</span></div>
      </div>
      <MangaCommentPanel v-if="showCommentDrawer" :visible.sync="showCommentDrawer" :novel-id="novel.novel_id" :article-id="article.article_id" :paragraph-id="currentParagraphId || 0" :paragraph-text="paragraphCommentText" :work-author-id="novel.author_id || novel.auther_id" :anchor-id="commentAnchor" @changed="onCommentsChanged('drawer')" />
      <ReaderNavigation v-if="readerNavigationVisible" :visible.sync="readerNavigationVisible" :chapters="chapterEntries || chapters" :current="article" :novel-id="novel.novel_id" :can-undo="!!readerJumpUndo" @jump="jumpReaderChapter" @catalog-navigate="recordReaderChapterJump" @undo="undoReaderChapterJump" />
      <el-drawer custom-class="reading-drawer" v-if="readerExcerptsVisible" title="划线书摘" :visible.sync="readerExcerptsVisible" size="min(860px, 100%)" append-to-body destroy-on-close><div class="reader-excerpts"><BookExcerpts :novel-id="novel.novel_id" @navigate="readerExcerptsVisible = false" @changed="loadHighlights" /></div></el-drawer>
      <ReaderSettings v-if="readerSettingsVisible" :visible.sync="readerSettingsVisible" :value="readerPreferences" :fonts="readerFonts" :skins="readerSkins" :tier="readerTier" :font-states="readerFontStates" :font-error="readerFontError" :resource-error="readerResourceError" :locked-message="readerLockedMessage" :resources-loading="readerResourcesLoading" :storage-error="readerStorageError" @input="changeReaderPreferences" @font="selectReaderFont" @theme="selectReaderTheme" @skin="selectReaderSkin" @refresh="refreshReaderResources" @membership="openReaderMembership" @reset="resetReaderPreferences" />
      <ReaderFeedback v-if="feedbackParagraph" :key="feedbackParagraph.id" :visible.sync="feedbackVisible" :article-id="article.article_id" :paragraph-id="feedbackParagraph.id" :paragraph-text="feedbackParagraph.text" />
    </div>
  </div>
</template>

<script>
import { recordLocalReading, localReadingProgress, readingAccountKey } from '~/utils/reading-history'
import { initialReaderPosition, normalizeReaderPosition } from '~/utils/reader-position'
import { readingToken } from '~/plugins/api/reading'
import { readingCommentId } from '~/utils/reader-comment-links'
import { readerParagraphs } from '~/utils/reader-paragraphs'
import { readingHead } from '~/utils/reading-seo'
import { workUrl } from '~/utils/reading-discovery'
import ReaderPager from '~/components/read/ReaderPager.vue'
import ReaderNavigation from '~/components/read/ReaderNavigation.vue'
import readerPreferencesMixin from '~/mixins/reader-preferences'
import ReaderSettings from '~/components/read/ReaderSettings.vue'
import BookExcerpts from '~/components/read/BookExcerpts.vue'
import ReaderFeedback from '~/components/read/ReaderFeedback.vue'
import MangaCommentPanel from '~/components/manga/MangaCommentPanel.vue'
export default {
  components: { ReaderPager, ReaderNavigation, ReaderFeedback, MangaCommentPanel, ReaderSettings, BookExcerpts },
  mixins: [readerPreferencesMixin],
  async asyncData({ params, $api, error }) {
    try {
      // 获取章节内容
      const article = await $api.reader.article(params.id)
      if (!article || article.length === 0) {
        return error({ statusCode: 404, message: '找不到该章节' })
      }

      const articleData = article[0]

      // 获取小说信息
      const novel = await $api.reader.book(articleData.novel_id)
      if (!novel || novel.length === 0) {
        return error({ statusCode: 404, message: '找不到该小说' })
      }

      // 获取章节列表
      const chapterEntries = await $api.reader.chapters(articleData.novel_id)
      const chapters = chapterEntries.filter(chapter => chapter.article_type !== 'spliter')

      // 找到当前章节的索引
      const currentChapterIndex = chapters.findIndex(
        chapter => Number(chapter.article_id) === Number(articleData.article_id)
      )

      return {
        article: articleData,
        novel: novel[0],
        chapterEntries, chapters: chapters || [],
        currentChapterIndex,
        loading: false,
        error: null
      }
    } catch (err) {
      console.error('加载章节内容失败', err)
      return error({ statusCode: err.status || 503, message: err.status === 404 ? '章节不存在或不可阅读' : '加载章节内容失败，请稍后重试' })
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      highlights: [], highlightBusy: false, highlightError: '', highlightAuthExpired: false, highlightVersion: 0, highlightOperationVersion: 0, readerIdentityVersion: 0,
      feedbackVisible: false, feedbackParagraph: null, paragraphVersion: 0,
      isLiked: false,
      readerReady: false, readerInitialPosition: {}, readerPosition: {}, readerNavigationVisible: false, readerJumpUndo: null, readerProgressAccount: null,
      readerSettingsVisible: false, readerExcerptsVisible: false, audioSpeakingId: 0, audioProgressKey: '', audioRouteRequested: 0,
      showHeader: true,
      lastScrollPosition: 0,
      // 段落评论相关
      selectionMode: false,
      selectedParagraph: null,
      panelPosition: {
        x: 0,
        y: 0
      },
      paragraphComments: {},
      showCommentDrawer: false,
      currentParagraphId: null,
      paragraphCommentText: '',
      // 段落评论数量
      paragraphCommentsCount: {},

    }
  },
  computed: {
    commentAnchor() { return readingCommentId(this.$route.query) },
    chapterPercent() { return this.chapters.length ? ((this.currentChapterIndex + 1) / this.chapters.length * 100).toFixed(1) : '0' },
    canFinish() { return this.currentChapterIndex >= 0 && this.currentChapterIndex === this.chapters.length - 1 },
    hasPrevious() {
      return this.currentChapterIndex > 0
    },
    hasNext() {
      return this.currentChapterIndex >= 0 && this.currentChapterIndex < this.chapters.length - 1
    },
    paragraphs() { return readerParagraphs(this.article.content, this.article.article_type) },
    selectedHighlight() { return this.selectedParagraph && this.highlights.find(item => Number(item.paragraph_id) === Number(this.selectedParagraph.id)) },
  },
  head() { return readingHead({ title: `${this.article.title || '章节'} - ${this.novel.name || '阅读'} - 原木社区`, description: this.paragraphs.filter(item => item.type === 'text').map(item => item.value).join(' ').slice(0, 150), path: `/article/${this.article.article_id}`, image: this.novel.picUrl, type: 'article' }) },
  mounted() {
    this.initializeReaderPosition()
    window.addEventListener('focus', this.checkReaderProgressAccount)
    window.addEventListener('storage', this.checkReaderProgressAccount)
    window.addEventListener('auth-state-changed', this.checkReaderProgressAccount)
    if (this.$readerAudio) { this.unsubscribeAudio = this.$readerAudio.subscribe(this.onReaderAudioProgress); this.onReaderAudioProgress(this.$readerAudio.state) }
    this.recordRead()
    // 保存阅读历史

    // 添加段落长按事件监听
    this.loadHighlights()
    this.openNotificationComment()

    // 添加点击空白区域关闭菜单的监听器
    document.addEventListener('click', this.handleDocumentClick)

    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll)
    
    // 获取段落评论数量
    this.fetchParagraphCommentsCount()
    
  },
  beforeRouteUpdate(to, from, next) { this.saveReaderHistory(true); next() },
  beforeRouteLeave(to, from, next) { this.saveReaderHistory(true); next() },
  watch: {
    '$route.query'(query, previous) {
      if (this.$route.params.id && Number(this.$route.params.id) !== Number(this.article.article_id)) return
      if (['paragraphId', 'charOffset', 'edge', 'start', 'pageIdx'].some(key => query[key] !== previous[key])) this.initializeReaderPosition()
      if (readingCommentId(query) !== readingCommentId(previous)) this.openNotificationComment()
    },
    'article.article_id'(id, previous) {
      if (!id || String(id) === String(previous)) return
      this.audioProgressKey = ''; this.audioSpeakingId = 0; this.clearSelection(); this.highlights = []; this.paragraphCommentsCount = {}; this.showCommentDrawer = false; this.feedbackVisible = false; this.feedbackParagraph = null
      this.initializeReaderPosition(); this.recordRead(); this.loadHighlights(); this.fetchParagraphCommentsCount()
      this.openNotificationComment()
      if (this.$readerAudio) this.onReaderAudioProgress(this.$readerAudio.state)

    }
  },
  beforeDestroy() {
    this.saveReaderHistory(true); clearTimeout(this.readerSaveTimer)
    window.removeEventListener('focus', this.checkReaderProgressAccount)
    window.removeEventListener('storage', this.checkReaderProgressAccount)
    window.removeEventListener('auth-state-changed', this.checkReaderProgressAccount)
    this.resetReaderHighlightScope()
    if (this.unsubscribeAudio) this.unsubscribeAudio()
    this.paragraphVersion++
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll)
    // 移除点击监听
    document.removeEventListener('click', this.handleDocumentClick)
  },
  methods: {
    openReaderExcerpts() { this.clearSelection(); this.readerSettingsVisible = false; this.readerNavigationVisible = false; this.showCommentDrawer = false; this.readerExcerptsVisible = true },
    openNotificationComment() {
      if (!this.commentAnchor) return
      const id = Number(this.$route.query.paragraphId), paragraph = this.paragraphs.find(item => item.id === id)
      this.currentParagraphId = paragraph ? id : 0; this.paragraphCommentText = paragraph ? paragraph.value : ''; this.showCommentDrawer = true
    },
    workUrl,
    openReaderAudio(paragraphId) {
      if (!this.$readerAudio) return
      const paragraphs = [...document.querySelectorAll('[data-paragraph-id]')]
      const visible = paragraphs.find(element => element.getBoundingClientRect().bottom > 120 && element.getBoundingClientRect().top < window.innerHeight)
      const start = paragraphId == null ? Number(visible && visible.dataset.paragraphId) || this.paragraphs.find(row => row.type === 'text' && row.value.trim())?.id : paragraphId
      this.$readerAudio.open(this.novel, this.chapters, this.article, start)
      this.clearSelection()
    },
    onReaderAudioProgress(state) {
      this.audioSpeakingId = state.visible && state.speechStarted && Number(state.chapterId) === Number(this.article.article_id) ? state.paragraphId : 0
      if (!state.visible || !state.speechStarted || !state.follow || Number(state.bookId) !== Number(this.novel.novel_id)) return
      if (Number(state.chapterId) !== Number(this.article.article_id)) {
        if (state.status === 'playing' && this.audioRouteRequested !== state.chapterId) {
          this.audioRouteRequested = state.chapterId
          Promise.resolve().then(() => this.$router.push(`/article/${state.chapterId}`)).catch(() => { this.audioRouteRequested = 0 })
        }
        return
      }
      this.audioRouteRequested = 0
      const key = `${state.chapterId}:${state.paragraphId}`
      if (key === this.audioProgressKey) return
      this.audioProgressKey = key
      this.$nextTick(() => { const paragraph = document.getElementById(`paragraph-${state.paragraphId}`); if (paragraph && this.$refs.pager) this.$refs.pager.jump(state.paragraphId) })
    },
    // 记录阅读行为
    async recordRead() {
      if (this.article.article_id) {
        try {
          await this.$api.statistics.novelClicked(this.article.article_id)
        } catch (error) {
          console.error('记录阅读行为失败', error)
        }
      }
    },

    // Save stable local anchors alongside the existing cloud chapter/page protocol.
    saveReaderHistory(forceCloud = false) {
      if (readingToken() !== this.readerProgressAccount) return
      if (!this.novel || !this.novel.novel_id || !this.article.article_id) return
      const position = normalizeReaderPosition(this.readerPosition)
      const progress = { last_article_id: Number(this.article.article_id), last_article_chapter: Number(this.article.article_chapter) || 0, last_page_idx: position.pageIndex, last_paragraph_id: position.paragraphId, last_char_offset: position.charOffset }
      recordLocalReading(this.novel, progress)
      if (forceCloud || Date.now() - (this.lastReaderCloudSave || 0) > 10000) {
        this.lastReaderCloudSave = Date.now()
        this.$api.reading.saveProgress({ novel_id: Number(this.novel.novel_id), article_id: progress.last_article_id, page_idx: position.pageIndex }).catch(() => {})
      }
    },

    initializeReaderPosition() {
      clearTimeout(this.readerSaveTimer); this.readerProgressAccount = readingToken(); this.lastReaderCloudSave = 0
      this.resetReaderHighlightScope()
      this.readerInitialPosition = initialReaderPosition(this.$route.query, localReadingProgress(this.novel.novel_id), this.article.article_id)
      this.readerPosition = this.readerInitialPosition; this.readerReady = true; this.readerNavigationVisible = false; this.readerExcerptsVisible = false
      try { this.readerJumpUndo = JSON.parse(sessionStorage.getItem(this.readerUndoKey()) || 'null') } catch (_) { this.readerJumpUndo = null }
    },
    checkReaderProgressAccount() {
      if (this.readerProgressAccount === readingToken()) return false
      this.initializeReaderPosition()
      this.highlights = []; this.clearSelection(); this.showCommentDrawer = false; this.feedbackVisible = false
      this.loadHighlights()
      return true
    },
    onReaderPosition(position) {
      this.readerPosition = position
      clearTimeout(this.readerSaveTimer)
      this.readerSaveTimer = setTimeout(() => this.saveReaderHistory(), 500)
    },
    readerUndoKey() { return `loghome:reader:undo:${readingAccountKey()}:${this.novel.novel_id}` },
    recordReaderChapterJump() {
      const position = this.$refs.pager ? this.$refs.pager.capture() : this.readerPosition
      this.readerJumpUndo = { articleId: Number(this.article.article_id), ...position }
      try { sessionStorage.setItem(this.readerUndoKey(), JSON.stringify(this.readerJumpUndo)) } catch (_) {}
      this.readerNavigationVisible = false
      this.saveReaderHistory(true)
    },
    jumpReaderChapter(chapter) {
      if (!chapter) return
      this.recordReaderChapterJump()
      this.$router.push(`/article/${chapter.article_id}?start=1`)
    },
    undoReaderChapterJump() {
      const previous = this.readerJumpUndo
      if (!previous) return
      this.readerJumpUndo = null; this.readerNavigationVisible = false
      try { sessionStorage.removeItem(this.readerUndoKey()) } catch (_) {}
      this.$router.push(`/article/${previous.articleId}?paragraphId=${previous.paragraphId || 0}&charOffset=${previous.charOffset || 0}&pageIdx=${previous.pageIndex || 0}`)
    },
    finishReading() {
      if (!this.canFinish) return
      this.saveReaderHistory(true)
      this.$router.push(`/read/end/${this.novel.novel_id}`)
    },
    navigatePageBoundary(direction) {
      const chapter = this.chapters[this.currentChapterIndex + (direction === 'prev' ? -1 : 1)]
      if (!chapter) return
      this.saveReaderHistory(true)
      this.$router.push(`/article/${chapter.article_id}?${direction === 'prev' ? 'edge=end' : 'start=1'}`)
    },
    // 滚动事件处理
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

      // 上滚显示，下滚隐藏
      if (currentScrollPosition < this.lastScrollPosition) {
        this.showHeader = true
      } else if (currentScrollPosition > 50) {
        this.showHeader = false
      }

      this.lastScrollPosition = currentScrollPosition
    },

    // 切换点赞状态
    toggleLike() {
      this.isLiked = !this.isLiked
      // 这里应该调用API保存点赞状态
    },

    // 章节导航
    navigateChapter(direction) {
      if (direction === 'prev' && this.hasPrevious) {
        const prevChapter = this.chapters[this.currentChapterIndex - 1]
        this.$router.push(`/article/${prevChapter.article_id}`)
      } else if (direction === 'next' && this.hasNext) {
        const nextChapter = this.chapters[this.currentChapterIndex + 1]
        this.$router.push(`/article/${nextChapter.article_id}`)
      }
    },

    // 返回小说详情页
    goToNovelDetail() {
      this.$router.push(`/novel/${this.article.novel_id}`)
    },

    // 返回上一页
    goBack() {
      this.$router.back()
    },

    // 格式化数字
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    },

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    onCommentsChanged(source) {
      this.fetchParagraphCommentsCount(); this.loadHighlights()
      if (source === 'drawer' && this.$refs.chapterReviews) this.$refs.chapterReviews.onOpen()
    },

    async fetchParagraphCommentsCount() {
      const version = ++this.paragraphVersion, articleId = this.article.article_id
      try {
        const rows = await this.$api.reader.paragraphAmounts(articleId, this.paragraphs.filter(item => item.type === 'text').map(item => item.id))
        if (version !== this.paragraphVersion || articleId !== this.article.article_id) return
        const counts = {}; for (const row of rows || []) counts[row.paragraph_id] = Number(row.count) || 0
        this.paragraphCommentsCount = counts
      } catch (_) { /* Existing counts remain available. */ }
    },
    openParagraphCommentWindow(paragraphId) {
      const id = Number(paragraphId), paragraph = this.paragraphs.find(item => item.id === id)
      this.currentParagraphId = id || 0; this.paragraphCommentText = paragraph ? paragraph.value : ''; this.showCommentDrawer = true
      if (this.selectionMode) this.clearSelection()
    },
    resetReaderHighlightScope() {
      this.readerIdentityVersion++; this.highlightVersion++; this.highlightOperationVersion++
      this.highlights = []; this.highlightBusy = false; this.highlightError = ''; this.highlightAuthExpired = false
    },
    readerHighlightScope() { return { identity: this.readerIdentityVersion, token: readingToken(), articleId: this.article.article_id } },
    currentReaderHighlightScope(scope) { return scope.identity === this.readerIdentityVersion && scope.token === readingToken() && scope.token === this.readerProgressAccount && scope.articleId === this.article.article_id },
    async loadHighlights() {
      if (this.checkReaderProgressAccount()) return
      const scope = this.readerHighlightScope(), version = ++this.highlightVersion
      this.highlightError = ''; this.highlightAuthExpired = false
      if (!scope.token) { this.highlights = []; return }
      try {
        const rows = await this.$api.reader.highlights(scope.articleId)
        if (!this.currentReaderHighlightScope(scope) || version !== this.highlightVersion) return
        if (!Array.isArray(rows)) throw new Error('划线书摘数据暂不可用')
        this.highlights = rows
      } catch (error) {
        if (!this.currentReaderHighlightScope(scope) || version !== this.highlightVersion) return
        this.highlightAuthExpired = [401, 403].includes(Number(error.status || error.response && error.response.status))
        if (this.highlightAuthExpired) this.highlights = []
        this.highlightError = this.highlightAuthExpired ? '登录状态已过期，请重新登录后查看或收藏划线书摘。' : '划线书摘加载失败，本页仍可阅读。'
      }
    },
    async toggleHighlight() {
      if (this.checkReaderProgressAccount()) return
      if (!this.selectedParagraph || this.highlightBusy) return
      if (!readingToken()) { this.$message.info('登录后可以收藏划线书摘'); return }
      if (this.highlightAuthExpired) { this.$message.info('登录状态已过期，请重新登录后收藏划线书摘'); return }
      const paragraph = this.selectedParagraph, existing = this.selectedHighlight
      const scope = this.readerHighlightScope(), operation = ++this.highlightOperationVersion
      const current = () => this.currentReaderHighlightScope(scope) && operation === this.highlightOperationVersion
      this.highlightVersion++; this.highlightBusy = true; this.highlightError = ''
      try {
        if (existing) await this.$api.reader.unhighlight(existing.article_cento_id)
        else await this.$api.reader.highlight({ article_id: scope.articleId, paragraph_id: Number(paragraph.id), paragraph: paragraph.text })
        if (!current()) return
        if (this.selectedParagraph === paragraph) this.clearSelection()
        await this.loadHighlights()
      } catch (error) {
        if (!current()) return
        this.highlightAuthExpired = [401, 403].includes(Number(error.status || error.response && error.response.status))
        if (this.highlightAuthExpired) { this.highlights = []; this.highlightError = '登录状态已过期，请重新登录后查看或收藏划线书摘。' }
        this.$message.error(this.highlightAuthExpired ? this.highlightError : error.message || '划线操作失败')
      }
      finally { if (current()) this.highlightBusy = false }
    },
    openFeedback() { if (!this.selectedParagraph) return; this.feedbackParagraph = { id: Number(this.selectedParagraph.id), text: this.selectedParagraph.text }; this.feedbackVisible = true; this.clearSelection() },

    // 处理段落右键点击
    handleParagraphRightClick(event, paragraph) {
      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);

      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算菜单位置 - 在鼠标右键位置显示
      this.panelPosition = {
        x: Math.max(20, Math.min(event.clientX, window.innerWidth - 300)),
        y: Math.max(8, Math.min(event.clientY, window.innerHeight - 230))
      };

      this.selectionMode = true;
    },

    // 处理段落长按 - 保留此方法以便在触摸设备上仍然可以响应长按
    handleParagraphLongPress(event, paragraph) {
      event.preventDefault();

      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);

      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算面板位置
      const rect = paragraph.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 - 150; // 面板宽度的一半
      const y = rect.bottom + 10;

      this.panelPosition = {
        x: Math.max(20, Math.min(x, window.innerWidth - 300)),
        y: Math.min(y, window.innerHeight - 100)
      };

      this.selectionMode = true;
    },

    // 清除选择
    clearSelection() {
      if (this.selectedParagraph) {
        this.selectedParagraph.element.classList.remove('selected');
        this.selectedParagraph = null;
      }
      this.selectionMode = false;
    },

    // 复制段落内容
    handleCopy() {
      if (!this.selectedParagraph) return;

      const textToCopy = `${this.selectedParagraph.text}\n\n—— 摘自《${this.novel.name}》`;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.$message.success('内容已复制');
          this.clearSelection();
        })
        .catch(() => {
          this.$message.error('复制失败');
        });
    },

    // 处理文档点击事件，关闭菜单
    handleDocumentClick(event) {
      // 如果点击的不是段落或菜单内部元素，则关闭菜单
      if (
        this.selectionMode &&
        !event.target.closest('.paragraph-floating-panel') &&
        !event.target.closest('.article-paragraph.selected')
      ) {
        this.clearSelection()
      }
    },

  }
}
</script>

<style lang="scss">
@use "sass:color";

// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$accent-color: #EA7034;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;
$error-color: #ff4d4f;
$heart-color: #FF6B6B;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin button-base {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
}

@mixin loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

// 动画
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-100%);
  }
}

.article-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: #f8f9fa;

  .loading-container,
  .error-container {
    @include flex-center;
    flex-direction: column;
    min-height: 300px;
    text-align: center;
    padding: 50px;
  }

  .loading-spinner {
    @include loading-spinner;
  }

  .back-button {
    @include button-base;
    background-color: $primary-color;
    color: white;
    padding: 10px 20px;
    margin-top: 20px;
  }

  .article-container {
    position: relative;
  }

  .article-header {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: transform 0.3s ease;

    &.sticky {
      .header-content {
        padding: 10px 20px;
        @include flex-between;
        max-width: 1200px;
        margin: 0 auto;
      }
    }

    &.hidden {
      transform: translateY(-100%);
    }
  }

  .novel-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }

  .novel-title {
    color: $primary-color;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 20px;

    &:hover {
      text-decoration: underline;
    }
  }

  .reading-controls {
    margin-left: 20px;
    display: flex;
    gap: 20px;
    align-items: center;

    .control-item {
      display: flex;
      align-items: center;

      .control-label {
        color: $text-light;
        margin-right: 8px;
        font-size: 14px;
      }

      .control-buttons {
        display: flex;

        button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          background: none;
          margin: 0 2px;
          cursor: pointer;
          border-radius: 3px;
          font-size: 14px;

          &.active {
            background-color: $primary-color;
            color: white;
            border-color: $primary-color;
          }
        }
      }
    }
  }

  .theme-controls {
    display: flex;
    gap: 8px;
  }

  .theme-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;

    &.active {
      border-color: $primary-color;
    }

    &.light {
      background-color: #ffffff;
      border: 1px solid #ddd;
    }

    &.sepia {
      background-color: #f8f0e0;
    }

    &.dark {
      background-color: #282c35;
    }
  }

  .article-content-wrapper {
    padding: 0;
    background-color: #ffffff;
    margin: 0 auto;

    &.light {
      background-color: #ffffff;
      color: $text-color;
    }

    &.sepia {
      background-color: #f8f0e0;
      color: #5b4636;
    }

    &.dark {
      background-color: #282c35;
      color: #bbb;
    }
  }

  .article-title-container {
    text-align: center;
    padding: 40px 20px 20px;

    .article-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .article-meta {
      font-size: 14px;

      span {
        margin: 0 10px;
      }
    }
  }

  .article-content {
    padding: 30px 60px 60px;
    width: 100%;
    line-height: 1.8;

    p {
      margin-bottom: 1.5em;
    }

    .article-image {
      margin: 2em 0;
      text-align: center;

      img {
        max-width: 60%;
        height: auto;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    // 段落样式
    .article-paragraph {
      transition: background-color 0.3s;
      border-radius: 4px;
      padding: 5px;
      position: relative;

      &.selected {
        background-color: rgba($primary-color, 0.1);
      }

      &:hover {
        background-color: rgba($primary-color, 0.05);
      }
      
    }
  }

  .empty-content {
    color: $text-lighter;
    font-style: italic;
    text-align: center;
    padding: 60px 0;
  }

  .article-footer {
    padding: 20px;
    @include flex-between;
    border-top: 1px solid $border-color;
    margin-top: 50px;
    background-color: rgba(255, 255, 255, 0.95);
  }

  .chapter-nav {
    display: flex;
    gap: 10px;

    button {
      @include button-base;

      &.nav-btn {
        background-color: #f5f5f5;
        color: $text-color;

        &:hover:not(:disabled) {
          background-color: #e9e9e9;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      &.chapter-btn {
        background-color: $primary-color;
        color: white;

        &:hover {
          background-color: color.adjust($primary-color, $lightness: -10%);
        }
      }
    }
  }

  .nav-icon {
    font-size: 16px;
  }

  .like-btn {
    @include button-base;
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #fff0f0;
    color: $heart-color;
    border: 1px solid $heart-color;

    &:hover {
      background-color: #ffe0e0;
    }

    &.active {
      background-color: $heart-color;
      color: white;
    }
  }

  .like-icon {
    font-size: 16px;
  }

  .chapter-nav a { text-decoration: none; display: inline-flex; align-items: center; }
  .paragraph-floating-panel {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;

    .panel-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      margin: 0 5px;
      transition: all 0.2s;

      i {
        font-size: 20px;
        margin-bottom: 5px;
        color: $primary-color;
      }

      span {
        font-size: 12px;
        color: $text-color;
      }

      &:hover {
        background-color: rgba($primary-color, 0.1);
        border-radius: 5px;
      }
    }
  }

  .paragraph-comment-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 450px;
    background-color: #fff;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;

    &.active {
      transform: translateX(0);
    }

    .drawer-header {
      padding: 15px 20px;
      background-color: $primary-color;
      color: white;
      @include flex-between;

      h3 {
        margin: 0;
        font-size: 16px;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
    }

    .drawer-content {
      padding: 20px;
      flex: 1;
      overflow-y: auto;

      .paragraph-text {
        margin-bottom: 20px;

        blockquote {
          border-left: 4px solid $primary-color;
          padding: 10px 15px;
          background-color: rgba($primary-color, 0.05);
          margin: 0 0 20px 0;
          font-style: italic;
          color: $text-light;
        }
      }

      .comment-input {
        margin-bottom: 30px;

        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          margin-bottom: 10px;

          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }

        button {
          @include button-base;
          background-color: $primary-color;
          color: white;
          float: right;

          &:hover {
            background-color: color.adjust($primary-color, $lightness: -10%);
          }
        }
      }

      .paragraph-comments-list {
        clear: both;

        .empty-comments {
          padding: 30px 0;
          text-align: center;
          color: $text-lighter;
          font-style: italic;
        }

        .paragraph-comment-item {
          display: flex;
          padding: 15px 0;
          border-bottom: 1px solid $border-light;

          &:last-child {
            border-bottom: none;
          }

          .comment-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: $primary-color;
            color: white;
            @include flex-center;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
          }

          .comment-content {
            flex: 1;

            .comment-header {
              margin-bottom: 5px;

              .comment-username {
                font-weight: bold;
                margin-right: 10px;
              }

              .comment-time {
                font-size: 12px;
                color: $text-lighter;
              }
            }

            .comment-text {
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  @media (max-width: 900px) {
    .article-header .header-content {
      flex-direction: column;
      gap: 10px;
    }

    .novel-info {
      width: 100%;
    }

    .reading-controls {
      width: 100%;
      justify-content: space-between;
    }

    .article-content {
      padding: 20px 30px;
    }

    .paragraph-comment-drawer {
      width: 100%;
    }
  }
}
</style>

<style scoped>
.reader-control-btn { border: 1px solid #ded4c5; background: #fff; color: #806649; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 13px; white-space: nowrap; }
.article-page .chapter-nav a { text-decoration: none; color: #806649; }
.article-page .header-content { flex-wrap: wrap; gap: 12px; }.article-page .novel-info { flex-wrap: wrap; gap: 8px; }.reading-controls { gap: 8px; flex-wrap: wrap; margin-left: 0; }
.reader-excerpts { padding: 0 22px 28px; height: 100%; overflow-y: auto; }
.reader-highlight-status { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; padding: 12px 20px; font-size: 13px; }
.reader-highlight-status a { color: inherit; text-decoration: underline; }
.article-page .article-content { margin: 0 auto; overflow-wrap: anywhere; }.article-meta { color: var(--reader-secondary); }.article-content-wrapper /deep/ .reader-highlight { text-decoration-color: var(--reader-line); }
.article-content-wrapper /deep/ .article-paragraph { margin-bottom: 1.2em; white-space: pre-wrap; }.article-content-wrapper /deep/ .reader-speaking { background: rgba(170,160,90,.22); }
.block-epoch-skin .article-title-container { margin: 18px; border: 3px solid #6b7551; background: rgba(239,244,216,.78); box-shadow: 5px 5px 0 #273421; }.block-epoch-skin .article-title { font-family: ui-monospace, Consolas, monospace; }
@media(max-width:700px) { .article-page .article-content { padding: 22px 20px 40px; }.reader-control-btn { padding: 8px; }.article-page .novel-info { width: 100%; }.article-page .novel-title { font-size: 16px; } }
</style>

<style scoped>
.reading-page-mode .article-footer { display: none; }.chapter-reviews { margin-top: 28px; }
</style>

<style scoped>
.article-page .article-header { top: 60px; }
</style>
