<template>
  <div class="manga-reader" :class="'reader-' + readerBackground">
    <!-- 顶栏 -->
    <div class="top-bar">
      <button class="bar-icon" type="button" title="返回" @click="goBack">
        <manga-icon name="back" />
      </button>
      <div class="bar-title">
        <h1 class="bar-novel">{{ novelName }} · {{ articleData ? articleData.title : '漫画阅读' }}</h1>
        <span class="bar-episode">第 {{ currentEpisodeNo }} 话 / 共 {{ articles.length }} 话</span>
      </div>
      <el-popover v-model="settingsVisible" placement="bottom-end" width="280" trigger="click" popper-class="reader-settings-pop">
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
          <el-radio-group v-model="imageQuality" size="mini" @change="onQualityChange">
            <el-radio-button label="standard">流畅</el-radio-button>
            <el-radio-button label="original">原图</el-radio-button>
          </el-radio-group>
          <p v-if="preferenceError" class="reader-error" role="alert">偏好未能保存，当前设置仍可使用。</p>
        </div>
        <button slot="reference" class="bar-icon" type="button" title="阅读设置">
          <manga-icon name="settings" />
        </button>
      </el-popover>
    </div>

    <!-- 阅读区 -->
    <div ref="stage" class="reader-stage" tabindex="0" aria-label="漫画阅读区，左右键翻页">
      <!-- 条漫：原生滚动 + 懒加载 -->
      <div v-if="mode === 'strip'" ref="stripScroll" class="strip-scroll" @scroll.passive="onStripScroll">
        <div v-for="(page, idx) in pages" :key="articleId + '-' + idx" class="strip-page" :style="pageStyle(page)">
          <img
            v-if="!pageErrors[idx]"
            class="strip-img" @dblclick="openStripPreview(idx)"
            :src="pageSrc(page, idx)"
            loading="lazy"
            draggable="false"
            :alt="`${novelName} · ${articleData ? articleData.title : ''} · 第 ${idx + 1} 页`"
            @error="onPageError(idx)" />
          <button v-else class="page-retry" type="button" @click="retryPage(idx)">
            <manga-icon name="retry" /> 第 {{ idx + 1 }} 页加载失败，重试
          </button>
          <button v-if="pageSrc(page,idx)" class="strip-zoom" :aria-label="`放大第 ${idx+1} 页`" @click="openStripPreview(idx)"><manga-icon name="zoom" /></button>
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
          :disabled="readingDirection==='rtl'?!canGoNext:!canGoPrev"
          :aria-label="readingDirection==='rtl'?'下一页':'上一页'"
          @click="stepPage(-1)">
          <manga-icon name="previous" />
        </button>
        <div class="paged-frame">
          <manga-reader-image
            v-if="currentPageObj"
            :key="articleId + '-' + currentPage + '-' + (retryCount[currentPage]||0)"
            :src="pageSrc(currentPageObj, currentPage)"
            :alt="`${novelName} · ${articleData ? articleData.title : ''} · 第 ${currentPage + 1} 页`"
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
          :disabled="readingDirection==='rtl'?!canGoPrev:!canGoNext"
          :aria-label="readingDirection==='rtl'?'上一页':'下一页'"
          @click="stepPage(1)">
          <manga-icon name="next" />
        </button>
      </div>

      <!-- 弹幕层 -->
      <manga-danmu-layer
        v-if="danmuEnabled && stripPreview===null && !zoomed && currentPageDanmus.length"
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
          :aria-label="danmuEnabled ? '关闭弹幕' : '开启弹幕'"
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
          :aria-pressed="danmuSyncComment" aria-label="同时发送为本话评论"
          @click="danmuSyncComment = !danmuSyncComment">
          同步评论
        </button>
        <button class="danmu-send" type="button" :disabled="danmuSending || !danmuInput.trim()" @click="submitDanmu">发送</button>
      </div>

      <p v-if="danmuError" class="reader-error" role="alert">{{ danmuError }} <button :disabled="danmuLoading" @click="loadDanmus">刷新弹幕</button></p>
      <p v-if="progressError" class="reader-error" role="alert">{{ progressError }} <button :disabled="progressWrites>0" @click="syncProgress(true)">重试保存</button></p>
      <div class="progress-row">
        <span class="progress-label">{{ progressLabel }}</span>
        <input class="progress-slider" type="range" aria-label="漫画页码" min="1" :max="Math.max(1,pages.length)" :value="currentPage+1" :aria-valuetext="progressLabel" :disabled="pages.length<2" @input="onPageSlider($event.target.value)" />
      </div>

      <div class="reader-actions">
        <button class="act-btn" type="button" @click="openCatalog = true"><manga-icon name="list" /><span>目录</span></button>
        <button class="act-btn" type="button" @click="openCommentPanel"><manga-icon name="comment" /><span>{{ commentAmount ? '评论 ' + commentAmount : '评论' }}</span></button>
        <nuxt-link v-if="hasPrevEpisode" class="act-btn" :to="`/manga/read/${articles[currentIdx - 1].article_id}?novelId=${novelId}`" rel="prev" @click.native.prevent="prevEpisode"><manga-icon name="previous" /><span>上一话</span></nuxt-link><button v-else class="act-btn" disabled><manga-icon name="previous" /><span>上一话</span></button>
        <nuxt-link class="act-btn" :to="`/manga/${novelId}`"><manga-icon name="list" /><span>作品详情</span></nuxt-link>
        <nuxt-link v-if="hasNextEpisode" class="act-btn" :to="`/manga/read/${articles[currentIdx + 1].article_id}?novelId=${novelId}`" rel="next" @click.native.prevent="nextEpisode"><manga-icon name="next" /><span>下一话</span></nuxt-link><button v-else class="act-btn" disabled><manga-icon name="next" /><span>下一话</span></button>
        <button class="act-btn" type="button" @click="resetZoom"><manga-icon name="zoom" /><span>复位</span></button>
      </div>
    </div>

    <!-- 目录抽屉 -->
    <el-drawer title="漫画目录" :visible.sync="openCatalog" direction="rtl" size="min(420px, 94vw)" custom-class="catalog-drawer">
      <div class="catalog-list">
        <nuxt-link
          v-for="(item, idx) in articles"
          :key="item.article_id"
          class="catalog-row"
          :class="{ current: idx === currentIdx }"
          :to="`/manga/read/${item.article_id}?novelId=${novelId}`"
          @click.native.prevent="jumpToEpisode(idx)">
          <span class="catalog-no">{{ item.article_chapter }}</span>
          <span class="catalog-name">{{ item.title }}</span>
          <manga-icon v-if="idx === currentIdx" name="check" />
        </nuxt-link>
      </div>
    </el-drawer>

    <el-dialog :visible="stripPreview!==null" title="漫画页面 · 滚轮缩放，拖动查看" width="94vw" top="3vh" append-to-body @update:visible="closeStripPreview"><div class="strip-zoom-surface"><MangaReaderImage v-if="stripPreview!==null && pages[stripPreview]" :src="pageSrc(pages[stripPreview],stripPreview)" :alt="`第 ${stripPreview+1} 页`" /></div></el-dialog>
    <!-- 本话评论 -->
    <manga-comment-panel
      :key="'cmt-' + articleId"
      :visible.sync="commentVisible"
      :novel-id="novelId"
      :article-id="articleId"
      :work-author-id="workAuthorId"
      :anchor-id="initialCommentId"
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
import { readingToken } from '~/plugins/api/reading'
import { loginReturnPath } from '~/utils/login-return'
import { recordLocalReading } from '~/utils/reading-history'
import { readingCommentId } from '~/utils/reader-comment-links'
import { readingHead } from '~/utils/reading-seo'
import { mangaPages, mangaPageSource, readMangaPreferences, saveMangaPreferences, loadPublicManga } from '~/utils/manga-content'
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
  async asyncData(context) { const result = await loadPublicManga(context); if (result && result.articleData) result.initialCommentId = readingCommentId(context.query); return result },
  head() { return readingHead({ title: `${this.articleData ? this.articleData.title : '漫画阅读'} - ${this.novelName} - 原木社区`, description: this.workInfo && this.workInfo.content, path: `/manga/read/${this.articleId || this.$route.params.articleId}`, image: this.workInfo && this.workInfo.picUrl, type: 'article' }) },
  data() {
    return {
      articleId: null,
      ssrReady: false,
      lastCountedArticleId: null,
      initialCommentId: 0,
      novelId: null,
      novelName: '漫画',
      workInfo: null,
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
      openCatalog: false, settingsVisible: false, preferenceError: false, progressDirty: true, progressError: '', progressWrites: 0, account: null, identityVersion: 0, danmuVersion: 0, commentVersion: 0, danmuLoading: false, danmuError: '', sessionUserId: null, navigating: false, stripPreview: null
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
      return this.sessionUserId
    }
  },
  mounted() {
    this.account = readingToken(); this.sessionUserId = currentDanmuUserId(); this.loadPreferences(); this.activateEpisode()
    window.addEventListener('keydown', this.handleKeydown); window.addEventListener('pagehide', this.onBeforeUnload); window.addEventListener('focus', this.checkAccount); window.addEventListener('storage', this.checkAccount)
  },
  beforeRouteUpdate(to,from,next) { this.syncProgress(true); next() },
  watch: {
    '$route.query'(query) { this.initialCommentId = readingCommentId(query); if (this.initialCommentId) this.commentVisible = true; if (query.pageIdx !== undefined && this.pages.length) { this.currentPage = Math.min(this.pages.length-1,Math.max(0,Math.floor(Number(query.pageIdx)||0))); if(this.mode==='strip')this.$nextTick(()=>this.seekStripPage(this.currentPage)) } },
    'articleData.article_id'(id,previous) { if (id && String(id)!==String(previous)) this.activateEpisode() }
  },
  beforeDestroy() {
    clearTimeout(this.progressTimer); this.progressTimer = null; this.syncProgress(true); this.loadRequestId++; this.danmuVersion++; this.commentVersion++; this.identityVersion++
    window.removeEventListener('keydown',this.handleKeydown); window.removeEventListener('pagehide',this.onBeforeUnload); window.removeEventListener('focus',this.checkAccount); window.removeEventListener('storage',this.checkAccount)
  },
  methods: {
    onBeforeUnload() {
      this.syncProgress(true)
    },
    getToken: readingToken,
    checkAccount() {
      const token=readingToken(); if(token===this.account)return false
      this.account=token; this.identityVersion++; this.sessionUserId=currentDanmuUserId(); clearTimeout(this.progressTimer); this.progressTimer=null; this.progressDirty=false; this.progressError=''; this.progressWrites=0; this.danmuVersion++; this.danmuInput=''; this.danmuSending=false; this.danmuSyncComment=false; this.danmuError=''; this.commentVisible=false; this.loadDanmus(); return true
    },
    currentScope(version,token,id) {return version===this.identityVersion && token===readingToken() && Number(id)===Number(this.articleId)},
    activateEpisode() {
      clearTimeout(this.progressTimer);this.progressTimer=null;this.loadRequestId++;this.danmuVersion++;this.commentVersion++;this.navigating=false;this.pageErrors={};this.retryCount={};this.preloadedChapter=null;this.stripPreview=null;this.resetZoom();this.danmuInput='';this.danmuSending=false;this.danmuError='';this.commentAmount=0;this.danmuList=[]
      if(!this.userModeChosen)this.mode=this.articleData.article_type==='mangaPage'?'paged':'strip'
      if(this.articleId!==this.lastCountedArticleId){this.lastCountedArticleId=this.articleId;this.$api.statistics.novelClicked(this.articleId).catch(()=>{})}
      this.loadDanmus();this.loadCommentAmount();this.progressDirty=true;this.syncProgress(true);if(this.mode==='strip')this.$nextTick(()=>this.seekStripPage(this.currentPage));if(this.initialCommentId)this.commentVisible=true
    },
    loadPreferences() {
      const value=readMangaPreferences(localStorage);if(value.mode){this.mode=value.mode;this.userModeChosen=true}this.readingDirection=value.direction;this.readerBackground=value.background;this.imageQuality=value.quality;this.danmuEnabled=value.danmu
    },
    savePreferences() { this.preferenceError=!saveMangaPreferences(localStorage,{mode:this.mode,direction:this.readingDirection,background:this.readerBackground,quality:this.imageQuality,danmu:this.danmuEnabled}) },
    onQualityChange() {this.pageErrors={};this.retryCount={};this.preloadedChapter=null;this.resetZoom();this.savePreferences();if(this.mode==='strip')this.$nextTick(()=>this.seekStripPage(this.currentPage))},
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
    // Episode changes use Nuxt's public SSR loader; client and server enforce the same scope.
    async openArticle(articleId,pageIdx,episodeIdx,edge) {
      if(this.navigating)return
      if(Number(articleId)===Number(this.articleId)){this.goToPage(pageIdx);return}
      const target=this.articles[episodeIdx];if(!target||Number(target.article_id)!==Number(articleId))return
      this.syncProgress(true);this.navigating=true
      try{await this.$router.push({path:`/manga/read/${articleId}`,query:{novelId:this.novelId,...(edge?{edge}:{pageIdx})}})}catch(error){if(error.name!=='NavigationDuplicated')this.$message.error(error.message||'话数切换失败')}finally{this.navigating=false}
    },
    retryEpisode() {this.$nuxt.refresh()},
    parseMangaContent:mangaPages,
    pageSrc(page,idx) {return mangaPageSource(page,this.imageQuality,this.retryCount[idx])},
    pageStyle(page) {return {aspectRatio:page.width&&page.height?`${page.width}/${page.height}`:undefined,minHeight:page.width&&page.height?'0':'240px'}},
    openStripPreview(idx) {this.currentPage=idx;this.stripPreview=idx;this.scheduleSync()},
    closeStripPreview() {const idx=this.stripPreview;this.stripPreview=null;if(idx!==null){this.currentPage=idx;this.$nextTick(()=>this.seekStripPage(idx))}},
    onPageError(idx) {
      this.$set(this.pageErrors, idx, true)
    },
    retryPage(idx) {
      this.$set(this.pageErrors, idx, false)
      this.$set(this.retryCount, idx, (this.retryCount[idx] || 0) + 1)
    },
    // ===== 条漫滚动 =====
    onStripScroll() {
      if (this.loading || this.mode!=='strip' || this.stripPreview!==null) return
      const el = this.$refs.stripScroll
      if (!el) return
      const focus = el.scrollTop + el.clientHeight * 0.4
      const els = el.querySelectorAll('.strip-page')
      let idx = 0
      for (let i = 0; i < els.length; i++) {
        if (els[i].offsetTop <= focus) idx = i
        else break
      }
      if (idx !== this.currentPage) { this.currentPage = idx; this.scheduleSync() }
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
      if (!Number.isFinite(Number(idx)) || !this.pages.length) return
      idx=Math.floor(Number(idx))
      if (idx < 0) {
        if (this.hasPrevEpisode) this.prevEpisode(true)
        return
      }
      if (idx >= this.pages.length) {
        if (this.hasNextEpisode) this.nextEpisode()
        else this.$message.info('已是最后一页')
        return
      }
      this.currentPage = idx
      this.$nextTick(()=>this.$refs.stage?.focus())
      this.scheduleSync()
    },
    onPageSlider(value) {
      this.resetZoom()
      const idx = Math.min(this.pages.length - 1, Math.max(0, Math.floor(Number(value)||1) - 1))
      this.currentPage = idx
      if (this.mode === 'strip') this.seekStripPage(idx)
      this.scheduleSync()
    },
    // ===== 话数切换 =====
    prevEpisode(fromEnd=false) {
      if (!this.hasPrevEpisode) {
        this.$message.info('已经是第一话了')
        return
      }
      const idx = this.currentIdx - 1
      this.openArticle(this.articles[idx].article_id, 0, idx, fromEnd===true?'end':null)
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
      if(!this.hasNextEpisode)return;const id=this.articles[this.currentIdx+1].article_id,version=this.loadRequestId,quality=this.imageQuality
      if(this.preloadedChapter===id)return;this.preloadedChapter=id
      try{const rows=await this.$api.reader.article(id),article=rows&&rows[0];if(version!==this.loadRequestId||quality!==this.imageQuality)return;if(!article||Number(article.article_id)!==Number(id)||Number(article.novel_id)!==Number(this.novelId)||Number(article.is_draft)===1)throw Error('Unavailable');const first=mangaPages(article.content)[0];if(first){const image=new Image();image.src=mangaPageSource(first,quality)}}catch(_){if(version===this.loadRequestId)this.preloadedChapter=null}
    },
    scheduleSync() {
      this.checkAccount();this.progressDirty=true;this.syncProgress(false)
      if(this.currentPage>=this.pages.length-2)this.preloadNextEpisode()
      clearTimeout(this.progressTimer);this.progressTimer=setTimeout(()=>{this.progressTimer=null;this.progressDirty=true;this.syncProgress(true)},1500)
    },
    async syncProgress(force) {
      if(this.checkAccount()||!this.progressDirty||!this.articleData||!this.novelId||!this.pages.length)return
      const token=readingToken(),version=this.identityVersion,id=this.articleId,payload={novel_id:Number(this.novelId),article_id:Number(id),article_chapter:Number(this.articles[this.currentIdx]?.article_chapter)||null,page_idx:Math.min(Math.max(0,Math.floor(this.currentPage)),this.pages.length-1)}
      recordLocalReading(this.workInfo||{novel_id:Number(this.novelId),name:this.novelName,novel_type:'manga'},{last_article_id:payload.article_id,last_article_chapter:payload.article_chapter,last_page_idx:payload.page_idx})
      if(!force)return;this.progressDirty=false;if(!token)return;this.progressWrites++
      try{await this.$api.reading.saveProgress(payload);if(this.currentScope(version,token,id))this.progressError=''}catch(_){if(this.currentScope(version,token,id)){this.progressDirty=true;this.progressError='云端进度保存失败，本机进度已保留。'}}finally{if(version===this.identityVersion)this.progressWrites=Math.max(0,this.progressWrites-1)}
    },
    // ===== 评论 =====
    openCommentPanel() {
      this.commentVisible = true
    },
    async loadCommentAmount() {
      const version=++this.commentVersion,id=this.articleId
      try{const count=await fetchMangaCommentAmount(baseUrl,this.novelId,id);if(version===this.commentVersion&&Number(id)===Number(this.articleId))this.commentAmount=count}catch(_){}
    },
    toggleDanmu() {this.danmuEnabled=!this.danmuEnabled;this.savePreferences()},
    async loadDanmus() {
      const version=++this.danmuVersion,id=this.articleId;this.danmuLoading=true;this.danmuError=''
      try{const list=await fetchMangaDanmus(baseUrl,this.novelId,id);if(version===this.danmuVersion&&Number(id)===Number(this.articleId))this.danmuList=list}catch(error){if(version===this.danmuVersion)this.danmuError=getMangaDanmuErrorMessage(error,'弹幕加载失败')}finally{if(version===this.danmuVersion)this.danmuLoading=false}
    },
    requireLogin() {this.checkAccount();if(readingToken())return true;this.$router.push({path:'/login',query:{redirect:loginReturnPath(this.$route.fullPath)}});return false},
    async submitDanmu() {
      if(!this.requireLogin()||this.danmuSending)return;const content=this.danmuInput.trim();if(!content||content.length>100)return
      const token=readingToken(),version=this.identityVersion,id=this.articleId,novelId=this.novelId,pageIdx=this.currentPage,epoch=this.loadRequestId,sync=this.danmuSyncComment;this.danmuSending=true;this.danmuError=''
      const current=()=>this.currentScope(version,token,id)&&epoch===this.loadRequestId
      try{const danmu=await sendMangaDanmu(baseUrl,{novelId,articleId:id,pageIdx,content},token);if(!current())return;this.danmuList=this.danmuList.filter(item=>item.danmuId!==danmu.danmuId).concat(danmu);this.danmuInput='';this.danmuReplayTick++
        if(sync){try{if(!current())return;await publishMangaComment(baseUrl,{novelId,articleId:id,content,images:[]});if(!current())return;this.loadCommentAmount();this.$message.success('弹幕已发送，并同步为本话评论')}catch(error){if(current())this.danmuError='弹幕已发送；'+getMangaCommentErrorMessage(error,'同步评论失败')}}
      }catch(error){if(current())this.danmuError=getMangaDanmuErrorMessage(error)}finally{if(current())this.danmuSending=false}
    },
    async removeDanmu(danmuId) {
      if(!this.requireLogin())return;const target=this.danmuList.find(item=>Number(item.danmuId)===Number(danmuId));if(!target||![target.userId,this.workAuthorId].some(id=>id!=null&&String(id)===String(this.currentUserId)))return
      const token=readingToken(),version=this.identityVersion,id=this.articleId,epoch=this.loadRequestId
      try{await this.$confirm('确定删除这条弹幕吗？','删除弹幕',{type:'warning'});if(!this.currentScope(version,token,id)||epoch!==this.loadRequestId)return;await deleteMangaDanmu(baseUrl,danmuId,token);if(!this.currentScope(version,token,id)||epoch!==this.loadRequestId)return;this.danmuList=this.danmuList.filter(item=>item.danmuId!==danmuId);this.danmuReplayTick++;this.$message.success('已删除')}catch(error){if(error!=='cancel'&&error!=='close'&&this.currentScope(version,token,id))this.danmuError=getMangaDanmuErrorMessage(error,'删除失败')}
    },
    // ===== 交互 =====
    handleKeydown(e) {
      const modal=()=>document.querySelector('.el-dialog__wrapper:not([style*="display: none"]),.el-message-box__wrapper:not([style*="display: none"]),.image-preview-container')
      if(e.key==='Escape') {
        if(this.stripPreview!==null)this.closeStripPreview()
        else if(modal())return
        else if(this.settingsVisible)this.settingsVisible=false
        else if(this.commentVisible)this.commentVisible=false
        else if(this.openCatalog)this.openCatalog=false
        else if(this.zoomed)this.resetZoom()
        return
      }
      const tag=e.target&&e.target.tagName
      if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(tag)||e.target?.isContentEditable||e.ctrlKey||e.metaKey||e.altKey||this.zoomed||this.commentVisible||this.openCatalog||this.settingsVisible||this.stripPreview!==null||modal()||this.mode!=='paged')return
      if(['ArrowRight','d','D'].includes(e.key)){e.preventDefault();this.stepPage(1)}else if(['ArrowLeft','a','A'].includes(e.key)){e.preventDefault();this.stepPage(-1)}else if(e.key===' '){e.preventDefault();this.goToPage(this.currentPage+1)}
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
.strip-page { position:relative; width: 100%; max-width:900px; margin:auto; display: flex; justify-content: center; }
.strip-img { width: 100%; height:auto; object-fit:contain; max-width:900px; display:block; }
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
.progress-slider { flex:1; min-width:0; width:100%; height:28px; accent-color:#947358; cursor:pointer; }

.reader-actions { display: flex; align-items: center; justify-content: space-around; margin-top: 6px; }
.act-btn {
  text-decoration:none;
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
.strip-zoom{position:absolute;right:10px;top:10px;padding:8px;border:0;border-radius:6px;background:#2229;color:#fff;cursor:pointer}.strip-zoom-surface{height:76vh}.reader-error{font-size:12px;color:#b65f46;line-height:1.6;margin:4px 0 8px}.reader-error button{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.bottom-bar{display:grid;grid-template-columns:minmax(240px,1fr) auto;gap:0 24px}.danmu-row,.reader-error{grid-column:1/-1}.reader-actions{gap:8px;margin-top:0}.act-btn{flex-direction:row;white-space:nowrap;padding:8px}.reader-actions .act-btn .manga-icon{font-size:18px}.bar-icon:focus-visible,.act-btn:focus-visible,.page-arrow:focus-visible{outline:2px solid #947358;outline-offset:-2px}@media(max-width:950px){.bottom-bar{display:block}.reader-actions{margin-top:6px}.act-btn{flex-direction:column}.page-arrow{width:42px}}@media(max-width:600px){.bottom-bar{padding:8px 10px}.danmu-row{gap:6px}.danmu-sync{padding:0 10px}.danmu-send{padding:0 14px}.act-btn{font-size:11px;padding:6px}.bar-novel{max-width:68vw}}
</style>
