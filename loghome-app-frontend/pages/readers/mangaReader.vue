<template>
  <view class="manga-reader" :class="'reader-' + readerBackground" v-dark>
    <scroll-view v-if="mode === 'strip'" class="strip-scroll" :scroll-y="zoomIndex < 0" :scroll-top="stripScrollTop" :scroll-with-animation="scrollAnimated" @scroll="onStripScroll">
      <view v-for="(page, idx) in pages" :key="articleId + '-' + idx" class="strip-page" :style="{ height: pageRenderHeight(page) + 'px' }">
        <manga-zoom-image :src="shouldLoadPage(idx) ? pageSrc(page, idx) : ''" mode="widthFix" :height="pageRenderHeight(page)" :reset-key="zoomResetKey"
          @image-tap="onCenterTap" @interaction="onZoomInteraction(idx, $event)" @error="onPageError(idx)" @load="onPageLoad(idx, $event)" />
        <button v-manga-a11y v-if="pageErrors[idx]" type="button" class="page-retry-tip" @click.stop="retryPage(idx)"><manga-icon name="retry" />第 {{ idx + 1 }} 页加载失败，重试</button>
      </view>
      <view class="episode-end"><button v-manga-a11y v-if="hasNextEpisode" class="end-next-btn" type="button" @click="nextEpisode">阅读下一话<manga-icon name="next" /></button><text v-else class="end-tip">本话完 · 感谢阅读</text></view>
      <view class="tap-block" @click="onCenterTap"></view>
    </scroll-view>
    <swiper v-else class="paged-swiper" :current="swiperPage" :disable-touch="zoomIndex >= 0" :duration="180" @change="onSwiperChange">
      <swiper-item v-for="entry in displayPages" :key="articleId + '-' + entry.index">
        <view class="paged-item">
          <manga-zoom-image :src="shouldLoadPage(entry.index) ? pageSrc(entry.page, entry.index) : ''" :reset-key="zoomResetKey"
            @image-tap="onImageTap($event, entry.index)" @interaction="onZoomInteraction(entry.index, $event)" @error="onPageError(entry.index)" @load="onPageLoad(entry.index, $event)" />
          <button v-manga-a11y v-if="pageErrors[entry.index]" class="page-retry-tip paged-retry" type="button" @click.stop="retryPage(entry.index)"><manga-icon name="retry" />本页加载失败，重试</button>
        </view>
      </swiper-item>
    </swiper>
    <manga-danmu-layer v-if="danmuEnabled && !isPreview && !localPreview && zoomIndex < 0 && currentPageDanmus.length"
      :key="'danmu-' + articleId + '-' + currentPage + '-' + danmuReplayTick" :danmus="currentPageDanmus"
      :current-user-id="currentUserId" :work-author-id="workAuthorId" @remove="removeDanmu" />
    <view class="top-bar" v-show="showMenu">
      <button v-manga-a11y class="bar-icon" type="button" aria-label="返回" @click="goBack"><manga-icon name="back" /></button>
      <view class="bar-title"><text class="bar-novel">{{ isPreview ? '预览 · ' : '' }}{{ novelName }}</text><text class="bar-episode">{{ localPreview ? '未发布的整话预览' : '第 ' + currentEpisodeNo + ' 话 / 共 ' + articles.length + ' 话' }}</text></view>
      <button v-manga-a11y class="bar-icon" type="button" aria-label="阅读设置" @click="openSettings = true"><manga-icon name="settings" /></button>
    </view>
    <view class="bottom-bar" v-show="showMenu">
      <view v-if="!isPreview && !localPreview" class="danmu-row">
        <button v-manga-a11y class="danmu-toggle" :class="{ off: !danmuEnabled }" type="button" :aria-label="danmuEnabled ? '关闭弹幕' : '开启弹幕'" @click="toggleDanmu"><manga-icon name="danmu" /></button>
        <input v-model="danmuInput" class="danmu-input" type="text" maxlength="100" placeholder="发条弹幕见证此刻..." confirm-type="send" :disabled="danmuSending" @confirm="submitDanmu" />
        <button v-manga-a11y class="danmu-sync" :class="{ on: danmuSyncComment }" type="button" :aria-pressed="danmuSyncComment ? 'true' : 'false'" aria-label="同时发送为本话评论" @click="danmuSyncComment = !danmuSyncComment">同步评论</button>
        <button v-manga-a11y class="danmu-send" type="button" :disabled="danmuSending || !danmuInput.trim()" @click="submitDanmu">发送</button>
      </view>
      <view class="progress-row"><text>{{ progressLabel }}</text><slider aria-label="阅读进度" :min="1" :max="Math.max(2, pages.length)" :value="currentPage + 1" :disabled="pages.length < 2" activeColor="#c14a16" backgroundColor="#cfd3d6" :block-size="18" @change="onPageSlider" /></view>
      <view class="reader-actions"><button v-manga-a11y class="bar-btn" type="button" @click="openCatalog = true"><manga-icon name="list" /><text>目录</text></button><button v-manga-a11y v-if="!isPreview && !localPreview" class="bar-btn" type="button" @click="openCommentSheet"><manga-icon name="comment" /><text>{{ commentAmount ? '评论 ' + commentAmount : '评论' }}</text></button><button v-manga-a11y="!hasPrevEpisode" class="bar-btn" type="button" :disabled="!hasPrevEpisode" @click="prevEpisode"><manga-icon name="previous" /><text>上一话</text></button><button v-manga-a11y="!hasNextEpisode" class="bar-btn" type="button" :disabled="!hasNextEpisode" @click="nextEpisode"><manga-icon name="next" /><text>下一话</text></button><button v-manga-a11y class="bar-btn" type="button" @click="resetZoom"><manga-icon name="zoom" /><text>复位</text></button></view>
    </view>
    <view class="floating-page" v-if="mode === 'paged' && !showMenu && pages.length">{{ currentPage + 1 }} / {{ pages.length }}</view>
    <button v-manga-a11y v-if="zoomIndex >= 0" class="floating-reset" type="button" @click="resetZoom">缩放中 · 点击复位</button>
    <view v-if="openSettings" class="settings-mask" @click.self="openSettings = false">
      <view class="settings-sheet" role="dialog" aria-modal="true" aria-label="阅读设置">
        <view class="sheet-head"><text>阅读设置</text><button v-manga-a11y class="sheet-done" type="button" @click="openSettings = false">完成</button></view>
        <text class="setting-label">阅读方式</text><view class="setting-options" role="radiogroup" aria-label="阅读方式"><button v-manga-a11y type="button" role="radio" :aria-checked="mode === 'strip' ? 'true' : 'false'" :class="{ chosen: mode === 'strip' }" @click="setReadingMode('strip')">上下滚动</button><button v-manga-a11y type="button" role="radio" :aria-checked="mode === 'paged' ? 'true' : 'false'" :class="{ chosen: mode === 'paged' }" @click="setReadingMode('paged')">左右翻页</button></view>
        <text class="setting-label">翻页方向</text><view class="setting-options" role="radiogroup" aria-label="翻页方向"><button v-manga-a11y type="button" role="radio" :aria-checked="readingDirection === 'ltr' ? 'true' : 'false'" :class="{ chosen: readingDirection === 'ltr' }" @click="setReadingDirection('ltr')">从左到右</button><button v-manga-a11y type="button" role="radio" :aria-checked="readingDirection === 'rtl' ? 'true' : 'false'" :class="{ chosen: readingDirection === 'rtl' }" @click="setReadingDirection('rtl')">从右到左</button></view>
        <text class="setting-label">阅读背景</text><view class="setting-options" role="radiogroup" aria-label="阅读背景"><button v-manga-a11y type="button" role="radio" v-for="item in backgroundOptions" :key="item.value" :aria-checked="readerBackground === item.value ? 'true' : 'false'" :class="{ chosen: readerBackground === item.value }" @click="setReaderBackground(item.value)">{{ item.label }}</button></view>
        <text class="setting-label">图片清晰度</text><view class="setting-options" role="radiogroup" aria-label="图片清晰度"><button v-manga-a11y type="button" role="radio" :aria-checked="imageQuality === 'standard' ? 'true' : 'false'" :class="{ chosen: imageQuality === 'standard' }" @click="setImageQuality('standard')">流畅</button><button v-manga-a11y type="button" role="radio" :aria-checked="imageQuality === 'original' ? 'true' : 'false'" :class="{ chosen: imageQuality === 'original' }" @click="setImageQuality('original')">原图</button></view>
      </view>
    </view>
    <view class="catalog-mask" v-if="openCatalog" @click="openCatalog = false"></view>
    <view class="catalog-drawer" :aria-hidden="!openCatalog" :class="{ open: openCatalog }" role="dialog" aria-label="漫画目录">
      <view class="catalog-header"><text class="catalog-title">{{ novelName }} · 目录</text><button v-manga-a11y class="bar-icon" type="button" aria-label="关闭目录" @click="openCatalog = false"><manga-icon name="close" /></button></view>
      <scroll-view class="catalog-list" scroll-y :scroll-into-view="catalogAnchor">
        <button v-manga-a11y v-for="(item, idx) in articles" :key="item.article_id" :id="'cat-' + item.article_id" class="catalog-row" type="button" :aria-current="idx === currentIdx ? 'true' : null" :class="{ current: idx === currentIdx }" @click="jumpToEpisode(idx)"><text class="catalog-no">{{ item.article_chapter }}</text><text class="catalog-name">{{ item.title }}</text><manga-icon v-if="idx === currentIdx" name="check" /></button>
      </scroll-view>
      <view v-if="localPreview" class="gesture-tip">当前为未发布话数预览</view>
    </view>
    <view v-if="openComments" class="comments-mask" @click="closeComments"></view>
    <view v-if="openComments" class="comments-sheet" role="dialog" aria-modal="true" aria-label="章节评论">
      <view class="sheet-head"><text>本话评论 <text class="comments-count">{{ commentAmount }} 条</text></text><button v-manga-a11y class="bar-icon" type="button" aria-label="关闭评论" @click="closeComments"><manga-icon name="close" /></button></view>
      <scroll-view class="comments-scroll" scroll-y>
        <view v-if="!comments.length && !commentLoading" class="comments-empty">还没有评论，来抢第一个沙发</view>
        <view class="comments-list">
          <manga-comment-item v-for="item in comments" :key="item.commentId" :comment="item" @reply="setReplyTarget" @praise="toggleCommentPraise" @remove="removeComment" @remove-reply="removeReply" />
        </view>
        <button v-manga-a11y v-if="commentHasMore" class="comments-more" type="button" :disabled="commentLoading" @click="loadMoreComments">{{ commentLoading ? '加载中…' : '加载更多' }}</button>
      </scroll-view>
      <view class="comments-composer">
        <manga-comment-composer ref="commentComposer" :reply-to="replyTarget" :submitting="commentSubmitting" @submit="submitComment" @cancel-reply="replyTarget = null" />
      </view>
    </view>
    <view class="loading-mask" v-if="loading" role="status">正在加载漫画…</view>
    <view class="loading-mask" v-else-if="loadError" role="alert"><text>{{ loadError }}</text><button v-manga-a11y class="state-button" type="button" v-if="!localPreview" @click="retryEpisode"><manga-icon name="retry" />重试</button><button v-manga-a11y class="state-button" type="button" @click="goBack">返回</button></view>
  </view>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
import axios from 'axios';
import MangaZoomImage from '@/components/manga-zoom-image.vue';
import MangaIcon from '@/components/manga-icon.vue';
import MangaCommentItem from '@/components/manga-comment-item.vue';
import MangaCommentComposer from '@/components/manga-comment-composer.vue';
import MangaDanmuLayer from '@/components/manga-danmu-layer.vue';
import { deleteMangaComment, fetchMangaCommentAmount, fetchMangaComments, getMangaCommentErrorMessage, praiseMangaComment, publishMangaComment, replyMangaComment } from '@/common/manga-comment-api.js';
import { currentDanmuUserId, deleteMangaDanmu, fetchMangaDanmus, getMangaDanmuErrorMessage, sendMangaDanmu } from '@/common/manga-danmu-api.js';

const STRIP_PAGE_FALLBACK_RATIO = 1.4; // 页图缺少尺寸信息时的兜底高宽比
const COMMENT_PAGE_SIZE = 10;

export default {
  directives: { mangaA11y: MangaA11y },
	components: { MangaZoomImage, MangaIcon, MangaCommentItem, MangaCommentComposer, MangaDanmuLayer },
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
			mode: 'strip', // strip | paged
			showMenu: false,
			openCatalog: false,
			loading: true,
			currentPage: 0, // 页漫当前页 / 条漫估算当前页
			stripScrollTop: 0,
			scrollAnimated: false,
			retryCount: {}, // idx -> 重试次数
			pageErrors: {},
			isPreview: false,
			loadRequestId: 0,
			requestedIdx: -1,
			loadError: '',
			queuedProgress: null,
			stripViewportHeight: 800,
			progressTimer: null,
			pendingProgress: false,
			syncingProgress: false,
			initPageIdx: 0,
			userModeChosen: false,
			openSettings: false,
			readingDirection: 'ltr',
			readerBackground: 'white',
			imageQuality: 'standard',
			backgroundOptions: [{ value: 'white', label: '白色' }, { value: 'warm', label: '暖色' }, { value: 'black', label: '黑色' }],
			zoomIndex: -1,
			zoomResetKey: 0,
			currentScrollTop: 0,
			localPreview: false,
			preloadedChapter: null,
			openComments: false,
			comments: [],
			commentAmount: 0,
			commentPage: 1,
			commentHasMore: false,
			commentLoading: false,
			commentSubmitting: false,
			replyTarget: null,
			danmuEnabled: true,
			danmuList: [],
			danmuInput: '',
			danmuSending: false,
			danmuSyncComment: false,
			danmuReplayTick: 0,
		};
	},
	computed: {
		displayPages() {
			const entries = this.pages.map((page, index) => ({ page, index }));
			return this.readingDirection === 'rtl' ? entries.reverse() : entries;
		},
		swiperPage() { return this.readingDirection === 'rtl' ? Math.max(0, this.pages.length - 1 - this.currentPage) : this.currentPage; },
		currentEpisodeNo() {
			if (this.currentIdx >= 0 && this.articles[this.currentIdx]) {
				return this.articles[this.currentIdx].article_chapter;
			}
			return '-';
		},
		hasPrevEpisode() {
			return this.currentIdx > 0;
		},
		hasNextEpisode() {
			return this.currentIdx >= 0 && this.currentIdx < this.articles.length - 1;
		},
		progressLabel() {
			if (this.pages.length === 0) return '-';
			return (Math.min(this.currentPage, this.pages.length - 1) + 1) + ' / ' + this.pages.length + ' 页';
		},
		catalogAnchor() {
			if (this.currentIdx >= 0 && this.articles[this.currentIdx]) {
				return 'cat-' + this.articles[this.currentIdx].article_id;
			}
			return '';
		},
		currentPageDanmus() {
			return this.danmuList.filter((item) => item.pageIdx === this.currentPage);
		},
		currentUserId() {
			return currentDanmuUserId();
		},
	},
	onLoad(option) {
		this.loadPreferences();
		if (option.previewKey) {
			this.localPreview = true;
			try {
				const draft = JSON.parse(window.localStorage.getItem(option.previewKey));
				window.localStorage.removeItem(option.previewKey);
				if (!draft || !Array.isArray(draft.pages) || !draft.pages.length) throw new Error('预览已过期');
				this.isPreview = true; this.novelName = draft.title || '整话预览'; this.pages = draft.pages;
				this.articleId = 'local'; this.mode = draft.type === 'mangaPage' ? 'paged' : 'strip'; this.loading = false;
			} catch (_) { this.loading = false; this.loadError = '预览已过期，请返回编辑器重新打开'; }
			return;
		}
		this.articleId = option.id;
		this.novelId = option.novelId;
		this.isPreview = option.preview === '1';
		this.initPageIdx = Math.max(0, parseInt(option.pageIdx) || 0);
		this.bootstrap();
	},
	onUnload() {
		this.loadRequestId += 1;
		clearTimeout(this.progressTimer);
		this.progressTimer = null;
		this.syncProgress(true);
		// #ifdef H5
		window.removeEventListener('keydown', this.handleKeydown);
		// #endif
	},
	onHide() {
		this.syncProgress(true);
	},
	mounted() {
		// #ifdef H5
		window.addEventListener('keydown', this.handleKeydown);
		// #endif
	},
	methods: {
		loadPreferences() {
			try {
				const settings = JSON.parse(window.localStorage.getItem('MangaReaderSettings')) || {};
				if (settings.mode === 'strip' || settings.mode === 'paged') { this.mode = settings.mode; this.userModeChosen = true; }
				if (settings.direction === 'rtl') this.readingDirection = 'rtl';
				if (['white', 'warm', 'black'].includes(settings.background)) this.readerBackground = settings.background;
				if (settings.quality === 'original') this.imageQuality = 'original';
				this.danmuEnabled = settings.danmu !== false;
			} catch (_) {}
		},
		savePreferences() {
			try { window.localStorage.setItem('MangaReaderSettings', JSON.stringify({ mode: this.mode, direction: this.readingDirection, background: this.readerBackground, quality: this.imageQuality, danmu: this.danmuEnabled })); } catch (_) {}
		},
		resetZoom() { this.zoomIndex = -1; this.zoomResetKey += 1; },
		onZoomInteraction(index, active) { if (active) this.zoomIndex = index; else if (this.zoomIndex === index) this.zoomIndex = -1; },
		setReadingDirection(value) { this.resetZoom(); this.readingDirection = value; this.savePreferences(); },
		setReaderBackground(value) { this.readerBackground = value; this.savePreferences(); },
		setImageQuality(value) { this.imageQuality = value; this.savePreferences(); },
		setReadingMode(value) { if (this.mode !== value) this.toggleMode(); },
		seekStripPage(idx) {
			const target = this.scrollTopForPage(idx);
			this.stripScrollTop = -1; this.currentScrollTop = target;
			this.$nextTick(() => { this.stripScrollTop = target; });
		},
		onPageSlider(e) {
			this.resetZoom(); const idx = Math.min(this.pages.length - 1, Math.max(0, Number(e.detail.value) - 1));
			this.currentPage = idx;
			if (this.mode === 'strip') this.seekStripPage(idx);
			this.scheduleSync();
		},
		shouldLoadPage(index) {
			if (index === this.zoomIndex) return true;
			if (this.mode === 'paged') return Math.abs(index - this.currentPage) <= 1;
			const offsets = this.cumulativeHeights(), top = offsets[index] || 0, height = this.pageRenderHeight(this.pages[index]);
			return Math.abs(index - this.currentPage) <= 1 || (top + height >= this.currentScrollTop - 500 && top <= this.currentScrollTop + this.stripViewportHeight + 500);
		},
		onImageTap(e, index) {
			const touch = (e.changedTouches && e.changedTouches[0]) || e;
			const width = uni.getSystemInfoSync().windowWidth || 375;
			const x = touch.clientX === undefined ? width / 2 : touch.clientX;
			const delta = this.readingDirection === 'rtl' ? -1 : 1;
			if (x < width * 0.25) this.goToPage(index - delta);
			else if (x > width * 0.75) this.goToPage(index + delta);
			else this.onCenterTap();
		},
		async preloadNextEpisode() {
			if (this.isPreview || !this.hasNextEpisode) return;
			const id = this.articles[this.currentIdx + 1].article_id;
			if (this.preloadedChapter === id) return;
			this.preloadedChapter = id;
			try {
				const res = await axios.get(this.$baseUrl + '/articles/get_article?id=' + id + '&isCaching=true');
				const article = res.data && res.data[0];
				const page = article && this.parseMangaContent(article.content)[0];
				if (!page) return;
				const url = this.imageQuality === 'original' ? page.url : (page.readingUrl || page.url);
				if (typeof Image !== 'undefined') { const img = new Image(); img.src = url; }
				else uni.getImageInfo({ src: url });
			} catch (_) { this.preloadedChapter = null; }
		},
		getToken() {
			let tk;
			try { tk = JSON.parse(window.localStorage.getItem('token')); } catch (_) { return null; }
			if (tk) tk = tk.tk;
			return tk;
		},
		previewHeaders() {
			return this.isPreview ? { Authorization: 'Bearer ' + this.getToken() } : {};
		},
		goBack() {
			const pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				if (this.localPreview) { uni.switchTab({ url: '/pages/essays' }); return; }
				uni.reLaunch({ url: '/pages/readers/mangaInfo?id=' + this.novelId + (this.isPreview ? '&preview=1' : '') });
			}
		},
		handleKeydown(e) {
			// #ifdef H5
			const tag = e.target && e.target.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;
			if (e.key === 'Escape') {
				if (this.openSettings) this.openSettings = false; else if (this.openComments) this.closeComments(); else if (this.openCatalog) this.openCatalog = false; else if (this.zoomIndex >= 0) this.resetZoom(); else this.goBack();
			} else if (e.key === 'ArrowRight' && this.mode === 'paged' && this.zoomIndex < 0 && !this.openSettings && !this.openCatalog && !this.openComments) {
				this.goToPage(this.currentPage + (this.readingDirection === 'rtl' ? -1 : 1));
			} else if (e.key === 'ArrowLeft' && this.mode === 'paged' && this.zoomIndex < 0 && !this.openSettings && !this.openCatalog && !this.openComments) {
				this.goToPage(this.currentPage + (this.readingDirection === 'rtl' ? 1 : -1));
			}
			// #endif
		},
		async bootstrap() {
			await Promise.all([this.loadNovelName(), this.loadChapters()]);
			if (this.articles.length === 0) {
				this.loading = false;
				this.loadError = this.loadError || '还没有可阅读的话数';
				return;
			}
			let targetId = this.articleId;
			let idx = this.articles.findIndex((a) => String(a.article_id) === String(targetId));
			if (idx < 0) idx = 0;
			await this.openArticle(this.articles[idx].article_id, this.initPageIdx || 0, idx);
		},
		async loadNovelName() {
			try {
				const route = this.isPreview ? '/essays/get_manga' : '/library/get_novel_by_id';
				const res = await axios.get(this.$baseUrl + route + '?id=' + this.novelId, { headers: this.previewHeaders() });
				if (res.status == 200 && res.data && res.data.length > 0) {
					this.novelName = res.data[0].name || '漫画';
					this.workAuthorId = res.data[0].author_id;
				}
			} catch (e) {
				console.error('loadNovelName failed', e);
			}
		},
		async loadChapters() {
			try {
				const route = this.isPreview ? '/essays/get_articles' : '/library/get_articles';
				const res = await axios.get(this.$baseUrl + route + '?id=' + this.novelId, { headers: this.previewHeaders() });
				if (res.status == 200 && Array.isArray(res.data)) {
					this.articles = res.data.filter((a) => a.article_type === 'mangaStrip' || a.article_type === 'mangaPage');
				}
			} catch (e) {
				console.error('loadChapters failed', e);
				this.loadError = '目录加载失败或没有访问权限';
			}
		},
		parseMangaContent(content) {
			let parsed = content;
			if (typeof content === 'string') {
				try {
					parsed = JSON.parse(content);
				} catch (e) {
					parsed = null;
				}
			}
			if (parsed && Array.isArray(parsed.pages)) {
				return parsed.pages;
			}
			return [];
		},
		async openArticle(articleId, pageIdx, episodeIdx) {
			this.syncProgress(true);
			clearTimeout(this.progressTimer);
			this.progressTimer = null;
			this.pendingProgress = false;
			const requestId = ++this.loadRequestId;
			this.requestedIdx = episodeIdx;
			this.loading = true;
			this.loadError = '';
			try {
				const route = this.isPreview ? '/essays/get_article' : '/articles/get_article';
				const res = await axios.get(this.$baseUrl + route + '?id=' + articleId + '&isCaching=false', { headers: this.previewHeaders() });
				if (requestId !== this.loadRequestId) return;
				if (res.status != 200 || !res.data || res.data.length === 0) {
					throw new Error('话数加载失败');
				}
				const article = res.data[0];
				if (String(article.novel_id) !== String(this.novelId)) throw new Error('话数不属于当前作品');
				const pages = this.parseMangaContent(article.content);
				if (!pages.length) throw new Error('本话暂无可阅读页面');
				this.resetZoom();
				this.currentScrollTop = 0;
				this.currentIdx = episodeIdx;
				this.articleId = article.article_id;
				this.articleData = article;
				this.resetChapterComments();
				this.resetChapterDanmus();
				this.pages = pages;
				this.retryCount = {};
				this.pageErrors = {};
				this.currentPage = Math.min(Math.max(0, Number(pageIdx) || 0), pages.length - 1);
				// 阅读模式默认跟随章节类型，页内切换后保持不变
				if (!this.userModeChosen) {
					this.mode = article.article_type === 'mangaPage' ? 'paged' : 'strip';
				}
				if (this.mode === 'paged') {
					this.stripScrollTop = 0;
				} else {
					this.scrollAnimated = false;
					this.stripScrollTop = -1;
					this.$nextTick(() => {
						if (requestId === this.loadRequestId) { this.stripScrollTop = this.scrollTopForPage(this.currentPage); this.currentScrollTop = this.stripScrollTop; }
					});
				}
				this.syncProgress(true);
			} catch (e) {
				if (requestId !== this.loadRequestId) return;
				console.error('openArticle failed', e);
				this.loadError = (e.response && e.response.data && e.response.data.msg) || e.message || '话数加载失败';
			} finally {
				if (requestId === this.loadRequestId) this.loading = false;
			}
		},
		retryEpisode() {
			if (!this.articles.length) { this.loadError = ''; this.loading = true; this.bootstrap(); return; }
			const idx = this.requestedIdx >= 0 ? this.requestedIdx : this.currentIdx;
			this.openArticle(this.articles[idx].article_id, 0, idx);
		},
		pageSrc(page, idx) {
			if (!page || !page.url) return '';
			const url = this.imageQuality === 'original' ? page.url : (page.readingUrl || page.url);
			const retry = this.retryCount[idx];
			if (!retry) return url;
			return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'mret=' + retry;
		},
		onPageError(idx) {
			// 失败仅更新提示，不改变 src，避免错误事件引发无限请求。
			this.$set(this.pageErrors, idx, true);
		},
		onPageLoad(idx, event) {
			this.$set(this.pageErrors, idx, false);
			const size = event && event.detail;
			if (size && size.width > 0 && size.height > 0 && this.pages[idx]) {
				const oldHeight = this.pageRenderHeight(this.pages[idx]);
				const oldTop = this.scrollTopForPage(idx);
				this.$set(this.pages, idx, { ...this.pages[idx], width: size.width, height: size.height });
				if (this.mode === 'strip' && oldTop + oldHeight <= this.currentScrollTop) {
					const delta = this.pageRenderHeight(this.pages[idx]) - oldHeight;
					this.currentScrollTop += delta; this.stripScrollTop = this.currentScrollTop;
				}
			}
		},
		retryPage(idx) {
			this.$set(this.pageErrors, idx, false);
			this.$set(this.retryCount, idx, (this.retryCount[idx] || 0) + 1);
		},
		// ===== 尺寸估算与进度 =====
		pageRenderHeight(page) {
			const windowWidth = uni.getSystemInfoSync().windowWidth || 375;
			if (page && page.width > 0 && page.height > 0) {
				return (windowWidth * page.height) / page.width;
			}
			return windowWidth * STRIP_PAGE_FALLBACK_RATIO;
		},
		cumulativeHeights() {
			const cums = [];
			let acc = 0;
			for (const page of this.pages) {
				cums.push(acc);
				acc += this.pageRenderHeight(page);
			}
			return cums;
		},
		scrollTopForPage(idx) {
			if (!this.pages.length) return 0;
			const cums = this.cumulativeHeights();
			const safeIdx = Math.min(Math.max(0, idx), cums.length - 1);
			return cums[safeIdx];
		},
		estimatePageIdx(scrollTop) {
			if (!this.pages.length) return 0;
			const cums = this.cumulativeHeights();
			const focus = scrollTop + this.stripViewportHeight * 0.4;
			let idx = 0;
			for (let i = 0; i < cums.length; i++) {
				if (cums[i] <= focus) idx = i;
				else break;
			}
			return idx;
		},
		onStripScroll(e) {
			if (this.loading) return;
			this.currentScrollTop = e.detail.scrollTop;
			this.stripViewportHeight = uni.getSystemInfoSync().windowHeight || this.stripViewportHeight;
			const idx = this.estimatePageIdx(e.detail.scrollTop);
			if (idx !== this.currentPage) {
				this.currentPage = idx;
			}
			this.scheduleSync();
		},
		// ===== 模式与翻页 =====
		toggleMode() {
			this.resetZoom();
			if (this.mode === 'strip') {
				this.mode = 'paged';
				// 保留当前页位置
			} else {
				this.mode = 'strip';
				this.scrollAnimated = false;
				this.seekStripPage(this.currentPage);
			}
			this.userModeChosen = true;
			this.savePreferences();
			uni.showToast({ title: this.mode === 'strip' ? '条漫模式（上下滚动）' : '页漫模式（左右翻页）', icon: 'none' });
		},
		goToPage(idx) {
			this.resetZoom();
			if (!this.pages.length) return;
			if (idx < 0) {
				if (this.hasPrevEpisode) this.prevEpisode();
				return;
			}
			if (idx >= this.pages.length) {
				if (this.hasNextEpisode) this.nextEpisode();
				else uni.showToast({ title: '已是最后一页', icon: 'none' });
				return;
			}
			this.resetZoom();
			this.currentPage = idx;
			this.scheduleSync();
		},
		onSwiperChange(e) {
			if (this.loading) return;
			const idx = this.readingDirection === 'rtl' ? this.pages.length - 1 - e.detail.current : e.detail.current;
			if (idx === this.currentPage) return;
			this.resetZoom();
			this.currentPage = idx;
			this.scheduleSync();
		},
		onCenterTap() {
			this.showMenu = !this.showMenu;
		},
		// ===== 章节评论 =====
		requireLogin() {
			let token = null;
			try { token = JSON.parse(window.localStorage.getItem('token')); } catch (_) {}
			if (token && token.tk) return true;
			uni.showToast({ title: '请先登录', icon: 'none' });
			return false;
		},
		resetChapterComments() {
			this.comments = [];
			this.commentPage = 1;
			this.commentHasMore = false;
			this.replyTarget = null;
			if (this.openComments) this.loadComments(1);
			this.loadCommentAmount();
		},
		openCommentSheet() {
			this.openComments = true;
			if (!this.comments.length) this.loadComments(1);
			this.loadCommentAmount();
		},
		closeComments() {
			this.openComments = false;
			this.replyTarget = null;
		},
		async loadComments(page = 1) {
			if (this.isPreview || this.localPreview) return;
			this.commentLoading = true;
			try {
				const list = await fetchMangaComments(this.$baseUrl, { novelId: this.novelId, articleId: this.articleId, page, pageSize: COMMENT_PAGE_SIZE });
				this.comments = page === 1 ? list : this.comments.concat(list);
				this.commentHasMore = list.length === COMMENT_PAGE_SIZE;
				this.commentPage = page;
			} catch (e) {
				console.error('loadComments failed', e);
			} finally {
				this.commentLoading = false;
			}
		},
		async loadCommentAmount() {
			if (this.isPreview || this.localPreview) return;
			try {
				this.commentAmount = await fetchMangaCommentAmount(this.$baseUrl, this.novelId, this.articleId);
			} catch (e) {
				console.error('loadCommentAmount failed', e);
			}
		},
		async loadMoreComments() {
			if (this.commentLoading) return;
			await this.loadComments(this.commentPage + 1);
		},
		setReplyTarget(target) {
			if (!this.requireLogin()) return;
			this.replyTarget = target;
		},
		async submitComment(payload) {
			if (!this.requireLogin() || this.commentSubmitting) return;
			this.commentSubmitting = true;
			try {
				if (this.replyTarget) {
					await replyMangaComment(this.$baseUrl, {
						novelId: this.novelId,
						articleId: this.articleId,
						rootCommentId: this.replyTarget.rootCommentId,
						replyToCommentId: this.replyTarget.replyToCommentId,
						content: payload.content,
						images: payload.images,
					});
				} else {
					await publishMangaComment(this.$baseUrl, {
						novelId: this.novelId,
						articleId: this.articleId,
						content: payload.content,
						images: payload.images,
					});
				}
				this.$refs.commentComposer.reset();
				this.replyTarget = null;
				uni.showToast({ title: '发表成功', icon: 'none' });
				await Promise.all([this.loadComments(1), this.loadCommentAmount()]);
			} catch (e) {
				uni.showToast({ title: getMangaCommentErrorMessage(e, '评论发送失败，请稍后重试'), icon: 'none' });
			} finally {
				this.commentSubmitting = false;
			}
		},
		async toggleCommentPraise(comment) {
			if (!this.requireLogin()) return;
			const type = comment.praiseType === 0 ? 3 : 0;
			const previousType = comment.praiseType;
			try {
				await praiseMangaComment(this.$baseUrl, comment.commentId, type);
				comment.praiseType = type;
				comment.likeNum = Math.max(0, (Number(comment.likeNum) || 0) + (previousType === 0 ? -1 : 1));
			} catch (e) {
				uni.showToast({ title: getMangaCommentErrorMessage(e, '操作失败，请稍后重试'), icon: 'none' });
			}
		},
		removeComment(comment) {
			uni.showModal({
				title: '删除评论',
				content: '确定删除这条评论吗？',
				success: async (result) => {
					if (!result.confirm) return;
					try {
						await deleteMangaComment(this.$baseUrl, comment.commentId);
						this.comments = this.comments.filter((item) => item.commentId !== comment.commentId);
						this.commentAmount = Math.max(0, this.commentAmount - 1);
						uni.showToast({ title: '已删除', icon: 'none' });
					} catch (e) {
						uni.showToast({ title: getMangaCommentErrorMessage(e, '删除失败，请稍后重试'), icon: 'none' });
					}
				},
			});
		},
		removeReply({ rootCommentId, reply }) {
			uni.showModal({
				title: '删除回复',
				content: '确定删除这条回复吗？',
				success: async (result) => {
					if (!result.confirm) return;
					try {
						await deleteMangaComment(this.$baseUrl, reply.commentId);
						const root = this.comments.find((item) => item.commentId === rootCommentId);
						if (root) root.replies = root.replies.filter((item) => item.commentId !== reply.commentId);
						uni.showToast({ title: '已删除', icon: 'none' });
					} catch (e) {
						uni.showToast({ title: getMangaCommentErrorMessage(e, '删除失败，请稍后重试'), icon: 'none' });
					}
				},
			});
		},
		// ===== 弹幕 =====
		toggleDanmu() {
			this.danmuEnabled = !this.danmuEnabled;
			this.savePreferences();
		},
		resetChapterDanmus() {
			this.danmuList = [];
			this.danmuInput = '';
			if (!this.isPreview && !this.localPreview) this.loadDanmus();
		},
		async loadDanmus() {
			try {
				this.danmuList = await fetchMangaDanmus(this.$baseUrl, this.novelId, this.articleId);
			} catch (e) {
				console.error('loadDanmus failed', e);
			}
		},
		async submitDanmu() {
			if (!this.requireLogin() || this.danmuSending) return;
			const content = this.danmuInput.trim();
			if (!content) return;
			this.danmuSending = true;
			try {
				const danmu = await sendMangaDanmu(this.$baseUrl, {
					novelId: this.novelId,
					articleId: this.articleId,
					pageIdx: this.currentPage,
					content,
				});
				this.danmuList = this.danmuList.concat(danmu);
				this.danmuInput = '';
				// 立即在本页重放，自己刚发的弹幕带高亮边框
				this.danmuReplayTick += 1;
				if (this.danmuSyncComment) {
					try {
						await publishMangaComment(this.$baseUrl, {
							novelId: this.novelId,
							articleId: this.articleId,
							content,
							images: [],
						});
						this.loadCommentAmount();
						uni.showToast({ title: '已同步至本话评论', icon: 'none' });
					} catch (e) {
						uni.showToast({ title: getMangaCommentErrorMessage(e, '同步评论失败，请稍后重试'), icon: 'none' });
					}
				}
			} catch (e) {
				uni.showToast({ title: getMangaDanmuErrorMessage(e), icon: 'none' });
			} finally {
				this.danmuSending = false;
			}
		},
		removeDanmu(danmuId) {
			const target = this.danmuList.find((item) => item.danmuId === danmuId);
			if (!target) return;
			uni.showModal({
				title: '删除弹幕',
				content: '确定删除这条弹幕吗？',
				success: async (result) => {
					if (!result.confirm) return;
					try {
						await deleteMangaDanmu(this.$baseUrl, danmuId);
						this.danmuList = this.danmuList.filter((item) => item.danmuId !== danmuId);
						this.danmuReplayTick += 1;
						uni.showToast({ title: '已删除', icon: 'none' });
					} catch (e) {
						uni.showToast({ title: getMangaDanmuErrorMessage(e, '删除失败，请稍后重试'), icon: 'none' });
					}
				},
			});
		},
		// ===== 话数切换 =====
		prevEpisode() {
			if (!this.hasPrevEpisode) {
				uni.showToast({ title: '已经是第一话了', icon: 'none' });
				return;
			}
			const idx = this.currentIdx - 1;
			this.openArticle(this.articles[idx].article_id, 0, idx);
		},
		nextEpisode() {
			if (!this.hasNextEpisode) {
				uni.showToast({ title: '已经是最后一话了', icon: 'none' });
				return;
			}
			const idx = this.currentIdx + 1;
			this.openArticle(this.articles[idx].article_id, 0, idx);
		},
		jumpToEpisode(idx) {
			this.openCatalog = false;
			if (idx === this.currentIdx) return;
			this.openArticle(this.articles[idx].article_id, 0, idx);
		},
		// ===== 阅读进度 =====
		scheduleSync() {
			if (this.currentPage >= this.pages.length - 2) this.preloadNextEpisode();
			if (this.progressTimer) {
				this.pendingProgress = true;
				return;
			}
			this.progressTimer = setTimeout(() => {
				this.progressTimer = null;
				this.syncProgress(true);
				if (this.pendingProgress) {
					this.pendingProgress = false;
					this.scheduleSync();
				}
			}, 3000);
		},
		async syncProgress(force) {
			if (this.isPreview || !this.articleData || !this.novelId || !this.pages.length) return;
			const payload = {
				novel_id: Number(this.novelId),
				article_id: Number(this.articleId),
				article_chapter: Number(this.articles[this.currentIdx] ? this.articles[this.currentIdx].article_chapter : 0) || null,
				page_idx: Math.min(Math.max(0, this.currentPage), this.pages.length - 1),
			};
			// 本地兜底记录（未登录也能续读）
			try {
				window.localStorage.setItem(
					'MangaHistory_' + this.novelId,
					JSON.stringify({
						last_article_id: payload.article_id,
						last_article_chapter: payload.article_chapter,
						last_page_idx: payload.page_idx,
					}),
				);
			} catch (e) {}
			if (!force) return;
			const tk = this.getToken();
			if (!tk) return;
			this.queuedProgress = payload;
			await this.flushProgress();
		},
		async flushProgress() {
			if (this.syncingProgress || !this.queuedProgress) return;
			const payload = this.queuedProgress;
			this.queuedProgress = null;
			const tk = this.getToken();
			if (!tk) return;
			this.syncingProgress = true;
			try {
				await axios.post(this.$baseUrl + '/library/update_reading_progress', payload, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk,
					},
				});
			} catch (e) {
				console.error('syncProgress failed', e);
			} finally {
				this.syncingProgress = false;
				if (this.queuedProgress) this.flushProgress();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/manga-theme.scss';
.manga-reader { @include manga-theme; position: fixed; inset: 0; background: #fff; }
.reader-warm { background: #f6efdf; } .reader-black { background: #101113; }
.strip-scroll,.paged-swiper { width: 100%; height: 100vh; }
.strip-page,.paged-item { position: relative; width: 100%; } .paged-item { height: 100%; }
.page-retry-tip { position: absolute; top: 45%; left: 10%; right: 10%; display: flex; align-items: center; justify-content: center; gap: 10rpx; min-height: 88rpx; padding: 14rpx 22rpx !important; border-radius: 16rpx !important; background: var(--manga-card) !important; color: var(--manga-accent) !important; font-size: 25rpx; box-shadow: var(--manga-shadow); }
.episode-end { padding: 60rpx 24rpx 180rpx; text-align: center; }
.end-next-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8rpx; min-height: 88rpx; padding: 0 36rpx !important; border-radius: 100rpx !important; background: var(--manga-action) !important; color: #fff !important; font-size: 27rpx; font-weight: 700; }
.end-tip { color: var(--manga-muted); font-size: 25rpx; }
.top-bar,.bottom-bar { position: fixed; left: 0; right: 0; z-index: 50; background: var(--manga-card); color: var(--manga-text); box-shadow: var(--manga-shadow); }
.top-bar { top: 0; display: flex; align-items: center; min-height: 90rpx; padding: calc(10rpx + var(--manga-safe-top)) 12rpx 10rpx; }
.bar-icon { display: grid; place-items: center; width: 88rpx; height: 88rpx; flex: none; font-size: 30rpx; }
.bar-title { flex: 1; min-width: 0; display: flex; flex-direction: column; text-align: center; }
.bar-novel { font-size: 27rpx; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.bar-episode { margin-top: 4rpx; color: var(--manga-muted); font-size: 21rpx; }
.bottom-bar { bottom: 0; padding: 12rpx 20rpx calc(12rpx + var(--manga-safe-bottom)); border-top: 1rpx solid var(--manga-line); }
.danmu-row { display: flex; align-items: center; gap: 14rpx; padding: 2rpx 4rpx 14rpx; }
.danmu-toggle { display: grid; place-items: center; width: 72rpx; height: 72rpx; flex: none; border-radius: 100rpx !important; background: var(--manga-bg) !important; color: var(--manga-accent) !important; font-size: 34rpx; }
.danmu-toggle.off { color: var(--manga-muted) !important; opacity: .55; }
.danmu-input { flex: 1; min-width: 0; height: 72rpx; padding: 0 26rpx !important; border-radius: 100rpx !important; background: var(--manga-bg) !important; color: var(--manga-text) !important; font-size: 25rpx; }
.danmu-send { display: grid; place-items: center; min-width: 104rpx; height: 72rpx; flex: none; border-radius: 100rpx !important; background: var(--manga-action) !important; color: #fff !important; font-size: 24rpx; font-weight: 600; }
.danmu-send[disabled] { opacity: .5; }
.danmu-sync { display: grid; place-items: center; height: 72rpx; padding: 0 22rpx !important; flex: none; border-radius: 100rpx !important; background: var(--manga-bg) !important; color: var(--manga-muted) !important; font-size: 22rpx; white-space: nowrap; }
.danmu-sync.on { background: var(--manga-tint) !important; color: var(--manga-accent) !important; font-weight: 600; }
.progress-row { display: flex; align-items: center; gap: 10rpx; padding: 0 8rpx; color: var(--manga-muted); font-size: 22rpx; font-variant-numeric: tabular-nums; }
.progress-row slider { flex: 1; min-width: 0; }
.reader-actions { display: grid; grid-template-columns: repeat(5,1fr); gap: 6rpx; }
.bar-btn { display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 4rpx; min-height: 88rpx; border-radius: 12rpx !important; font-size: 20rpx; }
.bar-btn .manga-icon { font-size: 28rpx; }
.floating-page,.floating-reset { position: fixed; z-index: 51; border-radius: 100rpx; background: rgba(19,22,25,.82); color: #fff !important; padding: 12rpx 24rpx !important; font-size: 22rpx; font-variant-numeric: tabular-nums; }
.floating-page { right: 24rpx; bottom: calc(24rpx + var(--manga-safe-bottom)); }.floating-reset { left: 50%; bottom: calc(190rpx + var(--manga-safe-bottom)); transform: translateX(-50%); white-space: nowrap; }
.settings-mask,.catalog-mask { position: fixed; inset: 0; z-index: 60; background: rgba(8,11,14,.55); }
.comments-mask { position: fixed; inset: 0; z-index: 62; background: rgba(8,11,14,.55); }
.comments-sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 63; display: flex; flex-direction: column; height: 72vh; border-radius: 32rpx 32rpx 0 0; background: var(--manga-card); color: var(--manga-text); box-shadow: 0 -10rpx 44rpx rgba(0,0,0,.12); animation: sheet-in .22s ease-out both; }
.comments-sheet .sheet-head { min-height: 88rpx; padding-left: 28rpx; margin-bottom: 0; border-bottom: 1rpx solid var(--manga-line); }
.comments-count { color: var(--manga-muted); font-size: 23rpx; font-weight: 400; }
.comments-scroll { flex: 1; min-height: 0; }
.comments-list { padding: 0 28rpx; }
.comments-empty { padding: 70rpx 0; text-align: center; color: var(--manga-muted); font-size: 25rpx; }
.comments-more { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 88rpx; color: var(--manga-accent); font-size: 25rpx; font-weight: 600; }
.comments-composer { flex: none; padding: 0 28rpx calc(16rpx + var(--manga-safe-bottom)); }
.settings-sheet { position: absolute; inset: auto 0 0; padding: 30rpx 32rpx calc(34rpx + var(--manga-safe-bottom)); border-radius: 32rpx 32rpx 0 0; background: var(--manga-card); box-shadow: 0 -10rpx 44rpx rgba(0,0,0,.12); animation: sheet-in .22s ease-out both; }
.sheet-head { display: flex; align-items: center; justify-content: space-between; min-height: 64rpx; margin-bottom: 12rpx; font-size: 32rpx; font-weight: 700; }
.sheet-done { min-width: 88rpx; min-height: 72rpx; color: var(--manga-accent) !important; font-size: 25rpx; font-weight: 600; }
.setting-label { display: block; margin: 24rpx 0 10rpx; color: var(--manga-muted); font-size: 23rpx; font-weight: 600; }
.setting-options { display: flex; gap: 12rpx; }
.setting-options button { display: flex; align-items: center; justify-content: center; flex: 1; min-height: 82rpx; padding: 8rpx !important; border: 2rpx solid var(--manga-line) !important; border-radius: 14rpx !important; background: var(--manga-bg) !important; font-size: 24rpx; line-height: 1.3; text-align: center; }
.setting-options button.chosen { border-color: var(--manga-accent) !important; background: var(--manga-tint) !important; color: var(--manga-accent) !important; font-weight: 700; }
.gesture-tip { display: block; padding: 26rpx 0 0; text-align: center; color: var(--manga-muted); font-size: 21rpx; }
.catalog-drawer { position: fixed; inset: 0 0 0 auto; width: min(84%, 620rpx); z-index: 61; display: flex; flex-direction: column; padding-top: var(--manga-safe-top); background: var(--manga-card); transform: translateX(100%); transition: transform .22s ease; box-shadow: -10rpx 0 44rpx rgba(0,0,0,.10); }
.catalog-drawer.open { transform: translateX(0); }
.catalog-header { display: flex; align-items: center; min-height: 90rpx; padding-left: 24rpx; border-bottom: 1rpx solid var(--manga-line); }
.catalog-title { flex: 1; min-width: 0; font-size: 27rpx; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.catalog-list { flex: 1; min-height: 0; }
.catalog-row { display: flex; align-items: center; gap: 12rpx; width: 100%; min-height: 98rpx; padding: 16rpx 24rpx !important; border-bottom: 1rpx solid var(--manga-line) !important; text-align: left; font-size: 25rpx; }
.catalog-row.current { color: var(--manga-accent); background: var(--manga-tint); font-weight: 700; }
.catalog-no { width: 58rpx; flex: none; color: var(--manga-muted); font-variant-numeric: tabular-nums; }
.catalog-name { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.loading-mask { position: fixed; inset: 0; z-index: 80; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 22rpx; padding: 40rpx; background: var(--manga-bg); text-align: center; font-size: 27rpx; }
.state-button { display: inline-flex; align-items: center; justify-content: center; gap: 8rpx; min-width: 168rpx; min-height: 88rpx; border: 1rpx solid var(--manga-line) !important; border-radius: 100rpx !important; color: var(--manga-accent) !important; }
@keyframes sheet-in { from { transform: translateY(30rpx); opacity: .7; } to { transform: translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .settings-sheet { animation: none; } .catalog-drawer { transition: none; } }
</style>
