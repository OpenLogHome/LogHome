<template>
  <view class="manga-page" v-dark>
    <view class="nav-bar">
      <button v-manga-a11y class="nav-back icon-button" type="button" aria-label="返回" @click="goBack"><manga-icon name="back" /></button>
      <text class="nav-title">{{ isPreview ? '作者预览 · ' : '' }}{{ bookInfo.name || '漫画详情' }}</text>
    </view>
    <scroll-view class="body-scroll" scroll-y :scroll-into-view="catalogTarget" :scroll-with-animation="scrollWithAnimation">
      <view v-if="loading || loadError" class="load-state" role="status">
        <text>{{ loading ? '正在加载漫画…' : loadError }}</text>
        <button v-manga-a11y v-if="loadError" type="button" class="outline-button" @click="loadAll"><manga-icon name="retry" />重试</button>
      </view>
      <template v-else>
        <view class="hero"><image class="poster" :src="bookInfo.picUrl || $backupResources.bookCover" mode="aspectFill" :alt="bookInfo.name + '封面'" /><view class="poster-shade"></view></view>
        <view class="info-card">
          <text class="novel-name">{{ bookInfo.name }}</text>
          <view class="meta-line"><text class="status-pill">{{ Number(bookInfo.is_complete) === 1 ? '已完结' : '连载中' }}</text><text>漫画</text><text class="meta-dot"></text><text>{{ isPreview ? '共' : '已更新' }} {{ articles.length }} 话</text></view>
          <button v-manga-a11y class="author-row" type="button" @click="openAuthor"><image v-if="bookInfo.auther_avatar" class="author-avatar" :src="bookInfo.auther_avatar" mode="aspectFill" /><text>作者 {{ bookInfo.author_name || '匿名作者' }}</text><manga-icon name="next" /></button>
          <view class="tag-row" v-if="tags.length"><text v-for="tag in tags" :key="tag.tag_id">{{ tag.tag_name }}</text></view>
          <button v-manga-a11y v-if="latestEpisode" class="latest-row" type="button" @click="openChapter(latestEpisode)"><view class="latest-copy"><text class="eyebrow">最近更新</text><text class="latest-name">第 {{ latestEpisode.article_chapter }} 话 · {{ latestEpisode.title }}</text></view><manga-icon name="next" /></button>
          <text v-if="isPreview" class="preview-note">预览包含草稿；读者只能看到已发布的话数</text>
        </view>
        <view class="section intro-section">
          <view class="section-title"><text>作品简介</text><button v-manga-a11y type="button" class="text-action" :aria-expanded="introExpanded ? 'true' : 'false'" @click="introExpanded = !introExpanded">{{ introExpanded ? '收起' : '展开' }}</button></view>
          <text class="intro-text" :class="{ collapsed: !introExpanded }">{{ bookInfo.content || '作者还没有填写简介' }}</text>
        </view>
        <view v-if="!isPreview" class="section quick-actions" aria-label="作品快捷操作">
          <button v-manga-a11y="niceBusy" class="quick-action" :class="{ selected: niceStatus }" type="button" :disabled="niceBusy" :aria-pressed="niceStatus ? 'true' : 'false'" @click="toggleNice"><image :src="niceStatus ? '/static/icons/icon_niced.png' : '/static/icons/icon_nice.png'" mode="aspectFit" /><text>{{ niceCount }} 赞</text></button>
          <button v-manga-a11y="shareBusy" class="quick-action" type="button" :disabled="shareBusy" @click="shareManga"><image src="/static/icons/icon_share.png" mode="aspectFit" /><text>{{ shareBusy ? '生成中…' : '分享' }}</text></button>
          <button v-manga-a11y="favoriteBusy" class="quick-action" :class="{ selected: isInBookcase }" type="button" :disabled="favoriteBusy" :aria-pressed="isInBookcase ? 'true' : 'false'" @click="toggleBookcase"><image src="/static/icons/icon_add.png" mode="aspectFit" /><text>{{ isInBookcase ? '移出书架' : '加入书架' }}</text></button>
          <button v-manga-a11y class="quick-action" type="button" @click="openCatalog"><image src="/static/icons/icon_index.png" mode="aspectFit" /><text>目录</text></button>
        </view>
        <view id="manga-catalog" class="section catalog-section">
          <view class="section-title"><text>目录 <text class="catalog-count">{{ articles.length }} 话</text></text><button v-manga-a11y type="button" class="text-action sort-action" @click="catalogReversed = !catalogReversed"><manga-icon name="sort" />{{ catalogReversed ? '倒序' : '正序' }}</button></view>
          <view v-if="!articles.length" class="catalog-empty">还没有{{ isPreview ? '' : '已发布的' }}话数</view>
          <button v-manga-a11y class="chapter-row" type="button" v-for="item in visibleArticles" :key="item.article_id" @click="openChapter(item)">
            <text class="chapter-index">{{ item.article_chapter }}</text><view class="chapter-main"><text class="chapter-title">{{ item.title }}</text><view class="chapter-meta"><text class="chapter-date">{{ formatDate(item.update_time) }} · {{ item.article_type === 'mangaPage' ? '页漫' : '条漫' }}</text><view v-if="articleCommentAmounts[item.article_id]" class="chapter-comments"><manga-icon name="comment" /><text>{{ articleCommentAmounts[item.article_id] }}</text></view></view></view><text v-if="Number(item.is_draft) === 1" class="chapter-badge">草稿</text><text v-else-if="isCurrentChapter(item)" class="chapter-badge">读至</text><manga-icon name="next" />
          </button>
          <button v-manga-a11y v-if="articles.length > 5" class="catalog-more" type="button" :aria-expanded="catalogExpanded ? 'true' : 'false'" @click="catalogExpanded = !catalogExpanded">{{ catalogExpanded ? '收起目录' : '查看全部 ' + articles.length + ' 话' }}</button>
        </view>
        <view v-if="!isPreview" id="manga-comments" class="section comment-section">
          <view class="section-title"><text>作品评论 <text class="catalog-count">{{ commentAmount }} 条</text></text><button v-manga-a11y v-if="previewComments.length" type="button" class="text-action" @click="openCommentSheet()"><manga-icon name="next" />全部</button></view>
          <view v-if="!previewComments.length" class="comment-empty">还没有评论，来抢第一个沙发</view>
          <manga-comment-item v-for="item in previewComments" :key="item.commentId" :comment="item" @reply="openCommentSheet($event)" @praise="toggleCommentPraise" @remove="removeComment" @remove-reply="removeReply" />
          <button v-manga-a11y class="comment-write" type="button" @click="writeComment"><manga-icon name="comment" />写评论</button>
        </view>
        <view v-if="authorWorks.length" class="section works-section"><view class="section-title">作者的其他漫画</view><view class="works-grid"><button v-manga-a11y v-for="work in authorWorks" :key="work.novel_id" class="work-item" type="button" @click="openWork(work)"><image lazy-load class="other-cover" :src="work.picUrl || $backupResources.bookCover" mode="aspectFill" :alt="work.name + '封面'" /><text>{{ work.name }}</text><text class="work-status">{{ Number(work.is_complete) === 1 ? '已完结' : '连载中' }}</text></button></view></view>
      </template>
      <view class="bottom-space"></view>
    </scroll-view>
    <view class="action-bar">
      <button v-manga-a11y="loading || !!loadError" v-if="!isPreview" class="tip-btn" type="button" :disabled="loading || !!loadError" @click="openTipping">打赏</button>
      <button v-manga-a11y="loading || !!loadError || !articles.length" class="read-btn" type="button" :disabled="loading || !!loadError || !articles.length" @click="startReading">{{ readButtonText }}<manga-icon name="next" /></button>
    </view>
    <uni-popup v-if="!isPreview" ref="tippingPopup" type="bottom">
      <view class="tipping-sheet"><tipping-bar v-if="showTipping" :novel_id="uid" @tip="handleTippingSuccess" /></view>
    </uni-popup>
    <uni-popup v-if="!isPreview" ref="commentPopup" type="bottom" @change="handleCommentSheetChange">
      <view class="comment-sheet">
        <view class="sheet-head"><text class="sheet-title">作品评论 <text class="catalog-count">{{ commentAmount }} 条</text></text><button v-manga-a11y class="sheet-close" type="button" aria-label="关闭评论列表" @click="closeCommentSheet"><manga-icon name="close" /></button></view>
        <scroll-view class="sheet-scroll" scroll-y :scroll-into-view="commentAnchor" :scroll-with-animation="scrollWithAnimation">
          <view v-if="!comments.length && !commentLoading" class="comment-empty">还没有评论，来抢第一个沙发</view>
          <view v-for="item in comments" :id="'comment_' + item.commentId" :key="item.commentId">
            <manga-comment-item :comment="item" :highlight="String(highlightCommentId) === String(item.commentId)" @reply="setReplyTarget($event)" @praise="toggleCommentPraise" @remove="removeComment" @remove-reply="removeReply" />
          </view>
          <button v-manga-a11y v-if="commentHasMore" class="comment-more" type="button" :disabled="commentLoading" @click="loadMoreComments">{{ commentLoading ? '加载中…' : '加载更多评论' }}</button>
        </scroll-view>
        <manga-comment-composer ref="commentComposer" :reply-to="replyTarget" :submitting="commentSubmitting" @submit="submitComment" @cancel-reply="replyTarget = null" />
      </view>
    </uni-popup>
    <task-reward-modal v-if="!isPreview" ref="taskRewardModal" @harvest="openTreePlant" />
  </view>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
import axios from 'axios';
import MangaIcon from '@/components/manga-icon.vue';
import TaskRewardModal from '@/components/TaskRewardModal.vue';
import TippingBar from '@/components/tipping/tippingBar.vue';
import MangaCommentItem from '@/components/manga-comment-item.vue';
import MangaCommentComposer from '@/components/manga-comment-composer.vue';
import { deleteMangaComment, fetchMangaArticleCommentAmounts, fetchMangaCommentAmount, fetchMangaCommentById, fetchMangaComments, getMangaCommentErrorMessage, praiseMangaComment, publishMangaComment, replyMangaComment } from '@/common/manga-comment-api.js';

const COMMENT_PAGE_SIZE = 10;

export default {
  directives: { mangaA11y: MangaA11y },
	components: { MangaIcon, TaskRewardModal, TippingBar, MangaCommentItem, MangaCommentComposer },
	data() {
		return {
			uid: null,
			loading: true, loadError: '', catalogExpanded: false, catalogReversed: false, catalogTarget: '', authorWorks: [], favoriteBusy: false, niceBusy: false, shareBusy: false,
			isPreview: false, showTipping: false,
			niceCount: 0, niceStatus: false,
			bookInfo: {},
			articles: [],
			tags: [],
			isInBookcase: false,
			introExpanded: false,
			progress: null, // { last_article_id, last_article_chapter, last_page_idx }
			comments: [],
			commentAmount: 0,
			commentPage: 1,
			commentHasMore: false,
			commentLoading: false,
			commentSubmitting: false,
			replyTarget: null,
			articleCommentAmounts: {},
			highlightCommentId: '',
			commentAnchor: '',
		};
	},
	computed: {
		visibleArticles() { const list = this.catalogReversed ? this.articles.slice().reverse() : this.articles; return this.catalogExpanded ? list : list.slice(0, 5); },
		latestEpisode() { return this.articles.filter(a => Number(a.is_draft) !== 1).slice().sort((a, b) => Number(b.article_chapter) - Number(a.article_chapter))[0]; },
		previewComments() { return this.comments.slice(0, 3); },
		scrollWithAnimation() { return !(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); },
		readButtonText() {
			if (this.articles.length === 0) return '暂未发布';
			if (this.progress && this.progress.last_article_id) {
				const target = this.articles.find(
					(a) => String(a.article_id) === String(this.progress.last_article_id),
				);
				if (target) return '继续阅读 第' + target.article_chapter + '话';
			}
			return '开始阅读';
		},

	},
	onLoad(option) {
		this.uid = option.id;
		this.isPreview = option.preview === '1';
		this.highlightCommentId = option.comment_id || '';
		this.loadAll();
	},
	onShow() {
		if (this.uid && !this.isPreview) this.loadProgress();
	},
	methods: {
		openAuthor() { const id = this.bookInfo.auther_id || this.bookInfo.author_id; if (id) uni.navigateTo({ url: '/pages/users/personalPage?id=' + id }); },
		openWork(work) { uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + work.novel_id }); },
		async loadAuthorWorks() {
			const id = this.bookInfo.auther_id || this.bookInfo.author_id;
			if (!id) return;
			try { const res = await axios.get(this.$baseUrl + '/library/get_novel_by_user_id?id=' + id); this.authorWorks = (res.data || []).filter(work => work.novel_type === 'manga' && Number(work.is_personal) === 0 && String(work.novel_id) !== String(this.uid)).slice(0, 3); } catch (_) {}
		},
		goBack() {
			const pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.reLaunch({ url: '/pages/library' });
			}
		},
		getToken() {
			const token = this.getTokenInfo();
			return token && token.tk;
		},
		getTokenInfo() {
			try { return JSON.parse(window.localStorage.getItem('token')); } catch (_) { return null; }
		},
		authHeaders() {
			const tk = this.getToken();
			if (!tk) return null;
			return { Authorization: 'Bearer ' + tk };
		},
		formatDate(value) {
			if (!value) return '';
			return String(value).slice(0, 10);
		},
		isCurrentChapter(item) {
			return (
				this.progress &&
				String(this.progress.last_article_id) === String(item.article_id)
			);
		},
		async loadAll() {
			this.loading = true; this.loadError = '';
			await Promise.all([
				this.getBookInfo(),
				this.getArticles(),
				this.getTags(),
				this.loadBookcaseStatus(),
				this.loadNiceState(),
				this.loadProgress(),
				this.loadComments(),
				this.loadCommentAmount(),
				this.loadArticleCommentAmounts(),
			]);
			this.loading = false;
			if (!this.isPreview) this.focusHighlightedComment();
		},
		async loadArticleCommentAmounts() {
			if (this.isPreview) return;
			try {
				this.articleCommentAmounts = await fetchMangaArticleCommentAmounts(this.$baseUrl, this.uid);
			} catch (e) {
				console.error('loadArticleCommentAmounts failed', e);
			}
		},
		async getBookInfo() {
			try {
				const route = this.isPreview ? '/essays/get_manga' : '/library/get_novel_by_id';
				const res = await axios.get(this.$baseUrl + route + '?id=' + this.uid, { headers: this.authHeaders() || {} });
				if (res.status == 200 && res.data && res.data.length > 0) {
					this.bookInfo = res.data[0];
					this.loadAuthorWorks();
					uni.setNavigationBarTitle({ title: this.bookInfo.name || '漫画详情' });
				} else {
					this.loadError = '作品不存在或没有访问权限';
				}
			} catch (e) {
				console.error('getBookInfo failed', e);
				this.loadError = '作品加载失败，请重试';
			}
		},
		async getArticles() {
			try {
				const route = this.isPreview ? '/essays/get_articles' : '/library/get_articles';
				const res = await axios.get(this.$baseUrl + route + '?id=' + this.uid, { headers: this.authHeaders() || {} });
				if (res.status == 200) {
					this.articles = (res.data || []).filter((a) => a.article_type === 'mangaStrip' || a.article_type === 'mangaPage');
				}
			} catch (e) {
				this.loadError = '目录加载失败，请重试';
			}
		},
		async getTags() {
			try {
				const res = await axios.get(this.$baseUrl + '/library/get_novel_tags?novel_id=' + this.uid);
				if (res.status == 200) {
					this.tags = res.data || [];
				}
			} catch (e) {
				console.error('getTags failed', e);
			}
		},
		requireLogin() {
			if (this.authHeaders()) return true;
			uni.showToast({ title: '请先登录', icon: 'none' });
			return false;
		},
		async loadComments(page = 1) {
			this.commentLoading = true;
			try {
				const list = await fetchMangaComments(this.$baseUrl, { novelId: this.uid, page, pageSize: COMMENT_PAGE_SIZE });
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
			try {
				this.commentAmount = await fetchMangaCommentAmount(this.$baseUrl, this.uid);
			} catch (e) {
				console.error('loadCommentAmount failed', e);
			}
		},
		async loadMoreComments() {
			if (this.commentLoading) return;
			await this.loadComments(this.commentPage + 1);
		},
		anchorComment(commentId) {
			this.highlightCommentId = commentId;
			this.commentAnchor = '';
			this.$nextTick(() => { this.commentAnchor = 'comment_' + commentId; });
		},
		// 通知里带的是根评论 id，可能不在首页，取回整条后展开评论列表并定位
		async focusHighlightedComment() {
			const targetId = this.highlightCommentId;
			if (!targetId) return;
			if (!this.comments.some((item) => String(item.commentId) === String(targetId))) {
				const target = await fetchMangaCommentById(this.$baseUrl, targetId).catch(() => null);
				if (target) this.comments = [target].concat(this.comments);
			}
			this.$nextTick(() => { if (this.$refs.commentPopup) this.$refs.commentPopup.open('bottom'); });
			this.anchorComment(targetId);
		},
		openCommentSheet(target) {
			if (target && !this.requireLogin()) return;
			if (target) this.replyTarget = target;
			if (this.$refs.commentPopup) this.$refs.commentPopup.open('bottom');
		},
		writeComment() {
			if (!this.requireLogin()) return;
			this.replyTarget = null;
			if (this.$refs.commentPopup) this.$refs.commentPopup.open('bottom');
		},
		closeCommentSheet() {
			if (this.$refs.commentPopup) this.$refs.commentPopup.close();
		},
		// 点击遮罩关闭时不会走 closeCommentSheet，回复状态统一在 change 事件里清理
		handleCommentSheetChange(state) {
			if (state && state.show) return;
			this.replyTarget = null;
			this.commentAnchor = '';
		},
		setReplyTarget(target) {
			if (!this.requireLogin()) return;
			this.replyTarget = target;
		},
		async submitComment(payload) {
			if (!this.requireLogin() || this.commentSubmitting) return;
			this.commentSubmitting = true;
			try {
				let anchoredId = null;
				if (this.replyTarget) {
					await replyMangaComment(this.$baseUrl, {
						novelId: this.uid,
						articleId: 0,
						rootCommentId: this.replyTarget.rootCommentId,
						replyToCommentId: this.replyTarget.replyToCommentId,
						content: payload.content,
						images: payload.images,
					});
					anchoredId = this.replyTarget.rootCommentId;
				} else {
					const created = await publishMangaComment(this.$baseUrl, {
						novelId: this.uid,
						content: payload.content,
						images: payload.images,
					});
					anchoredId = created.commentId;
				}
				this.$refs.commentComposer.reset();
				this.replyTarget = null;
				uni.showToast({ title: '发表成功', icon: 'none' });
				await Promise.all([this.loadComments(1), this.loadCommentAmount()]);
				if (anchoredId) this.anchorComment(anchoredId);
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
		async loadBookcaseStatus() {
			if (this.isPreview) return;
			const headers = this.authHeaders();
			if (!headers) return;
			try {
				const res = await axios.get(this.$baseUrl + '/bookcase/get_likes_of', { headers });
				if (res.status == 200 && Array.isArray(res.data)) {
					this.isInBookcase = res.data.some(
						(n) => String(n.novel_id) === String(this.uid),
					);
				}
			} catch (e) {
				console.error('loadBookcaseStatus failed', e);
			}
		},
		async loadNiceState() {
			if (this.isPreview) return;
			const id = encodeURIComponent(this.uid);
			const requests = [axios.get(this.$baseUrl + '/library/get_nices_by_id?id=' + id).then(res => {
				this.niceCount = Number(res.data && res.data[0] && res.data[0].nices) || 0;
			}).catch(() => {})];
			const headers = this.authHeaders();
			if (headers) requests.push(axios.get(this.$baseUrl + '/library/get_nice_status?id=' + id, { headers }).then(res => {
				this.niceStatus = Number(res.data && res.data[0] && res.data[0].nices) > 0;
			}).catch(() => {}));
			await Promise.all(requests);
		},
		openCatalog() {
			this.catalogExpanded = true;
			this.catalogTarget = '';
			this.$nextTick(() => { this.catalogTarget = 'manga-catalog'; });
		},
		openTipping() {
			if (this.isPreview || this.loading || this.loadError) return;
			const token = this.getTokenInfo();
			if (!token || !token.tk) { uni.showToast({ title: '请先登录', icon: 'none' }); return; }
			const authorId = this.bookInfo.auther_id || this.bookInfo.author_id;
			if (authorId && String(token.id) === String(authorId)) {
				uni.showToast({ title: '不能给自己的漫画打赏哦', icon: 'none' });
				return;
			}
			this.showTipping = true;
			this.$nextTick(() => { if (this.$refs.tippingPopup) this.$refs.tippingPopup.open('bottom'); });
		},
		handleTippingSuccess() {
			if (this.$refs.tippingPopup) this.$refs.tippingPopup.close();
		},
		async completeDailyTask(code, name) {
			const headers = this.authHeaders();
			if (!headers) return;
			try {
				const res = await axios.post(this.$baseUrl + '/treePlant/do_task', { task_code: code }, { headers });
				const data = res.data || {};
				const modal = this.$refs.taskRewardModal;
				if (modal) modal.show({ reward: Number(data.reward) || 0, taskName: name, icon: data.task_icon, currentGrowth: Number(data.growth_val) || 0, maxGrowth: 100, canHarvest: data.tree_status === '结果' });
			} catch (_) { /* 每日任务已完成或暂不可用，不影响作品操作。 */ }
		},
		openTreePlant() { uni.navigateTo({ url: '/pages/treePlant/treeplant' }); },
		async toggleNice() {
			if (this.isPreview || this.niceBusy || this.loading || this.loadError) return;
			const headers = this.authHeaders();
			if (!headers) { uni.showToast({ title: '请先登录', icon: 'none' }); return; }
			this.niceBusy = true;
			const wasLiked = this.niceStatus;
			try {
				await axios.get(this.$baseUrl + '/library/nice_novel?id=' + encodeURIComponent(this.uid), { headers });
				this.niceStatus = !wasLiked;
				this.niceCount = Math.max(0, this.niceCount + (wasLiked ? -1 : 1));
				if (!wasLiked) this.completeDailyTask('daily_like_novel', '每日任务：为漫画点赞');
			} catch (_) { uni.showToast({ title: '点赞失败，请稍后重试', icon: 'none' }); }
			finally { this.niceBusy = false; }
		},
		async shareManga() {
			if (this.isPreview || this.shareBusy || this.loading || this.loadError) return;
			const headers = this.authHeaders();
			if (!headers) { uni.showToast({ title: '请先登录', icon: 'none' }); return; }
			this.shareBusy = true;
			try {
				const res = await axios.post(this.$baseUrl + '/library/create_share_code', {
					share_type: 'book',
					share_content: '漫画《' + this.bookInfo.name + '》· ' + (this.bookInfo.author_name || '匿名作者'),
					target_url: '/pages/readers/mangaInfo?id=' + this.uid,
					share_message: '我正在原木社区看漫画《' + this.bookInfo.name + '》，一起来看看吧！\nhttps://loghome.ink/novel/' + this.uid,
					expires_hours: 24 * 30,
				}, { headers });
				if (!res.data || !res.data.success || !res.data.share_text) throw new Error('share code unavailable');
				if (this.$bus) this.$bus.$emit('clipboardChange', res.data.share_text);
				let copied = false;
				if (typeof uni.setClipboardData === 'function') {
					try { copied = await new Promise(resolve => uni.setClipboardData({ data: res.data.share_text, success: () => resolve(true), fail: () => resolve(false) })); }
					catch (_) { /* 口令已生成，仍可在弹窗中查看。 */ }
				}
				uni.showModal({ title: '漫画分享口令', content: '口令：' + res.data.code + (copied ? '\n已复制，发送给好友即可查看。' : '\n复制失败，请手动记录口令。'), showCancel: false, confirmText: '知道了' });
				this.completeDailyTask('daily_share_work', '每日任务：分享作品');
			} catch (_) { uni.showToast({ title: '分享失败，请稍后重试', icon: 'none' }); }
			finally { this.shareBusy = false; }
		},
		async loadProgress() {
			if (this.isPreview) return;
			// 本地兜底进度（未登录也可续读）
			try {
				const local = window.localStorage.getItem('MangaHistory_' + this.uid);
				if (local) {
					this.progress = JSON.parse(local);
				}
			} catch (e) {}
			const headers = this.authHeaders();
			if (!headers) return;
			try {
				const res = await axios.get(this.$baseUrl + '/library/reading_progress?novel_id=' + this.uid, { headers });
				if (res.status == 200 && Array.isArray(res.data) && res.data.length > 0) {
					this.progress = res.data[0];
				}
			} catch (e) {
				console.error('loadProgress failed', e);
			}
		},
		openChapter(item) {
			if (!item || !item.article_id) return;
			const isSame = this.isCurrentChapter(item);
			const pageIdx = isSame && this.progress && this.progress.last_page_idx ? this.progress.last_page_idx : 0;
			uni.navigateTo({
				url: '/pages/readers/mangaReader?id=' + item.article_id + '&novelId=' + this.uid + (pageIdx ? '&pageIdx=' + pageIdx : '') + (this.isPreview ? '&preview=1' : ''),
			});
		},
		startReading() {
			if (this.loading || this.loadError) return;
			if (this.articles.length === 0) {
				uni.showToast({ title: '还没有可阅读的话数', icon: 'none' });
				return;
			}
			let target = this.articles[0];
			let pageIdx = 0;
			if (this.progress && this.progress.last_article_id) {
				const matched = this.articles.find(
					(a) => String(a.article_id) === String(this.progress.last_article_id),
				);
				if (matched) {
					target = matched;
					pageIdx = Number(this.progress.last_page_idx) || 0;
				}
			}
			this.openChapter(target);
		},
		async toggleBookcase() {
			if (this.favoriteBusy || this.loading || this.loadError) return;
			const headers = this.authHeaders();
			if (!headers) {
				uni.showToast({ title: '请先登录', icon: 'none' });
				return;
			}
			this.favoriteBusy = true;
			try {
				if (this.isInBookcase) {
					await axios.post(
						this.$baseUrl + '/bookcase/remove_like_novel',
						{ novel_id: Number(this.uid) },
						{ headers: { ...headers, 'Content-Type': 'application/json' } },
					);
					this.isInBookcase = false;
					if (Array.isArray(this.bookInfo.likes) && this.bookInfo.likes.length) this.bookInfo.likes.pop();
					uni.showToast({ title: '已移出书架', icon: 'none' });
				} else {
					await axios.post(
						this.$baseUrl + '/bookcase/like_novel',
						{ novel_id: Number(this.uid) },
						{ headers: { ...headers, 'Content-Type': 'application/json' } },
					);
					this.isInBookcase = true;
					if (Array.isArray(this.bookInfo.likes)) this.bookInfo.likes.push({});
					uni.showToast({ title: '已加入书架', icon: 'none' });
				}
			} catch (e) {
				console.error('toggleBookcase failed', e);
				uni.showToast({ title: '操作失败，请稍后重试', icon: 'none' });
			} finally { this.favoriteBusy = false; }
		},
	},
};
</script>

<style scoped lang="scss">
@import '@/common/manga-theme.scss';
.manga-page { @include manga-theme; height: 100vh; }
.nav-bar { position: fixed; inset: 0 0 auto; z-index: 30; height: 96rpx; padding-top: var(--manga-safe-top); display: flex; align-items: center; background: var(--manga-card); border-bottom: 1rpx solid var(--manga-line); }
.icon-button { display: grid; place-items: center; width: 96rpx; height: 88rpx; flex: none; font-size: 34rpx; }
.nav-title { flex: 1; min-width: 0; padding-right: 28rpx; font-size: 30rpx; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.body-scroll { height: 100vh; box-sizing: border-box; padding-top: calc(96rpx + var(--manga-safe-top)); }
.hero { height: 680rpx; position: relative; background: var(--manga-line); }
.poster { display: block; width: 100%; height: 100%; }
.poster-shade { position: absolute; inset: auto 0 0; height: 240rpx; background: linear-gradient(transparent, rgba(20, 20, 20, .20)); pointer-events: none; }
.info-card,.section { margin: 24rpx 24rpx 0; padding: 30rpx; border-radius: 24rpx; background: var(--manga-card); box-shadow: var(--manga-shadow); }
.info-card { position: relative; margin-top: -76rpx; }
.novel-name { display: block; font-size: 40rpx; line-height: 1.3; font-weight: 750; letter-spacing: .01em; }
.meta-line { display: flex; align-items: center; flex-wrap: wrap; gap: 12rpx; margin: 20rpx 0 8rpx; color: var(--manga-muted); font-size: 24rpx; }
.status-pill,.chapter-badge { display: inline-flex; align-items: center; border-radius: 100rpx; padding: 6rpx 14rpx; background: var(--manga-tint); color: var(--manga-accent); font-size: 21rpx; font-weight: 600; }
.meta-dot { width: 5rpx; height: 5rpx; border-radius: 50%; background: var(--manga-muted); }
.author-row,.latest-row { display: flex; align-items: center; width: 100%; min-height: 88rpx; text-align: left; border-top: 1rpx solid var(--manga-line); font-size: 25rpx; }
.author-row { gap: 12rpx; color: var(--manga-muted); }
.author-row .manga-icon,.latest-row .manga-icon,.chapter-row .manga-icon { margin-left: auto; color: var(--manga-muted); font-size: 24rpx; }
.author-avatar { width: 42rpx; height: 42rpx; border-radius: 50%; }
.tag-row { display: flex; gap: 10rpx; flex-wrap: wrap; padding: 8rpx 0 20rpx; }
.tag-row text { border-radius: 100rpx; background: var(--manga-bg); color: var(--manga-muted); font-size: 22rpx; padding: 5rpx 14rpx; }
.latest-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4rpx; }
.eyebrow { font-size: 21rpx; color: var(--manga-muted); }
.latest-name { font-size: 26rpx; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.preview-note { display: block; padding: 14rpx 0 4rpx; color: var(--manga-accent); font-size: 23rpx; }
.section-title { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; margin-bottom: 18rpx; font-size: 30rpx; font-weight: 700; }
.text-action { display: inline-flex; align-items: center; justify-content: center; gap: 6rpx; min-width: 88rpx; min-height: 72rpx; padding: 0 10rpx; color: var(--manga-accent); font-size: 24rpx; font-weight: 600; }
.sort-action .manga-icon { font-size: 22rpx; }
.catalog-count { margin-left: 10rpx; color: var(--manga-muted); font-size: 22rpx; font-weight: 400; }
.intro-text { display: -webkit-box; white-space: pre-line; color: var(--manga-muted); font-size: 27rpx; line-height: 1.7; }
.intro-text.collapsed { -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.quick-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14rpx; }
.quick-action { box-sizing: border-box; display: flex; align-items: center; justify-content: flex-start; gap: 16rpx; width: 100%; min-width: 0; min-height: 96rpx; padding: 0 20rpx; border: 1rpx solid var(--manga-line); border-radius: 16rpx; background: var(--manga-bg); color: var(--manga-text); font-size: 26rpx; font-weight: 600; text-align: left; white-space: nowrap; }
.quick-action::after { display: none; }
.quick-action.selected { border-color: var(--manga-accent); background: var(--manga-tint); color: var(--manga-accent); }
.quick-action image { display: block; width: 46rpx; height: 46rpx; flex: none; }
.quick-action text { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.quick-action:active { transform: scale(.97); }
.chapter-row { width: 100%; display: flex; align-items: center; gap: 16rpx; min-height: 116rpx; border-bottom: 1rpx solid var(--manga-line); text-align: left; }
.chapter-row:last-of-type { border-bottom: 0; }
.chapter-index { width: 54rpx; flex: none; font-size: 26rpx; font-weight: 700; color: var(--manga-accent); }
.chapter-main { flex: 1; min-width: 0; }
.chapter-title { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 27rpx; font-weight: 600; }
.chapter-date { display: block; margin-top: 4rpx; color: var(--manga-muted); font-size: 21rpx; }
.chapter-meta { display: flex; align-items: center; gap: 16rpx; margin-top: 4rpx; }
.chapter-comments { display: inline-flex; align-items: center; gap: 6rpx; color: var(--manga-muted); font-size: 21rpx; }
.catalog-more { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 88rpx; padding: 0; color: var(--manga-accent); font-size: 25rpx; font-weight: 600; text-align: center; }
.catalog-empty { padding: 38rpx 0; color: var(--manga-muted); text-align: center; font-size: 25rpx; }
.comment-empty { padding: 38rpx 0; color: var(--manga-muted); text-align: center; font-size: 25rpx; }
.comment-write { display: flex; align-items: center; justify-content: center; gap: 10rpx; width: 100%; min-height: 88rpx; margin-top: 20rpx; border: 1rpx dashed var(--manga-line); border-radius: 16rpx; color: var(--manga-muted); font-size: 25rpx; font-weight: 600; }
.comment-write .manga-icon { font-size: 26rpx; }
.comment-sheet { box-sizing: border-box; display: flex; flex-direction: column; max-height: calc(82vh - var(--manga-safe-top)); padding: 0 28rpx calc(20rpx + var(--manga-safe-bottom)); background: var(--manga-card); border-radius: 20rpx 20rpx 0 0; }
.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; flex: none; min-height: 96rpx; font-size: 30rpx; font-weight: 700; }
.sheet-close { display: grid; place-items: center; width: 76rpx; height: 76rpx; color: var(--manga-muted); font-size: 30rpx; }
.sheet-scroll { flex: 1; min-height: 240rpx; }
.comment-more { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 88rpx; color: var(--manga-accent); font-size: 25rpx; font-weight: 600; }
.works-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18rpx; }
.work-item { min-width: 0; text-align: left; }
.other-cover { display: block; width: 100%; height: 238rpx; border-radius: 12rpx; object-fit: cover; }
.work-item text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 8rpx; font-size: 23rpx; font-weight: 600; }
.work-item .work-status { color: var(--manga-muted); font-size: 21rpx; font-weight: 400; }
.bottom-space { height: calc(150rpx + var(--manga-safe-bottom)); }
.action-bar { position: fixed; inset: auto 0 0; z-index: 30; display: flex; align-items: center; gap: 18rpx; padding: 16rpx 28rpx calc(16rpx + var(--manga-safe-bottom)); background: var(--manga-card); border-top: 1rpx solid var(--manga-line); box-shadow: 0 -8rpx 28rpx rgba(20,20,20,.05); }
.tip-btn { flex: none; display: flex; align-items: center; justify-content: center; box-sizing: border-box; min-width: 154rpx; min-height: 88rpx; padding: 0 22rpx; border: 1rpx solid var(--manga-accent); border-radius: 100rpx; background: var(--manga-card); color: var(--manga-accent); font-size: 27rpx; font-weight: 700; }
.read-btn { flex: 1; min-height: 88rpx; display: flex; align-items: center; justify-content: center; gap: 12rpx; border-radius: 100rpx; background: var(--manga-action); color: #fff !important; font-size: 29rpx; font-weight: 700; }
.tipping-sheet { max-height: calc(100vh - 130rpx - var(--manga-safe-top)); max-height: calc(100dvh - 130rpx - var(--manga-safe-top)); overflow-y: auto; padding-bottom: var(--manga-safe-bottom); box-sizing: border-box; background: var(--manga-card); border-radius: 20rpx 20rpx 0 0; }
.load-state { display: flex; align-items: center; flex-direction: column; gap: 24rpx; padding: 160rpx 28rpx; font-size: 27rpx; text-align: center; }
.outline-button { display: inline-flex; align-items: center; justify-content: center; gap: 8rpx; min-height: 88rpx; padding: 0 32rpx !important; border: 1rpx solid var(--manga-line) !important; border-radius: 100rpx !important; color: var(--manga-accent) !important; }
@media (min-width: 800px) { .hero { height: 620rpx; } .info-card,.section { max-width: 760px; margin-left: auto; margin-right: auto; } }
</style>
