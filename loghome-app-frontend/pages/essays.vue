<template>
	<view class="outer" v-dark>
		<view class="title" :class="topNavStyle.class" :style="topNavStyle.style">
			<view class="flex_col">
				<view class="box1"></view>
				<view class="flex_grow flex_col flex_center tab" v-dark>
					<view v-for="(item, index) in topNavArr" :key="index" :class="{ 'active': topNavIndex == index }"
						:data-index="index" @tap="changeTopNav">{{ item }}</view>
				</view>
				<view class="box1 align_r">
					<el-button :icon="viewMode === 'scroll' ? 'el-icon-s-help' : 'el-icon-s-grid'" circle size="mini"
						@click="toggleViewMode" :title="viewMode === 'scroll' ? '切换到网格视图' : '切换到滚动视图'"
						v-show="books.length > 0 && topNavArr[topNavIndex] == '小说'">
					</el-button>
				</view>
			</view>
		</view>

		<!-- 三栏横向滑动区域（跟手切换） -->
		<view class="tabs-viewport" @touchstart="onSwipeStart" @touchmove="onSwipeMove"
			@touchend="onSwipeEnd" @touchcancel="onSwipeEnd" @scroll="onViewportScroll">
			<view class="tabs-track" :style="trackStyle">
				<!-- 小说栏目 -->
				<view class="tab-pane" :class="{ 'pane-active': topNavIndex === 0 }" :style="paneStyle(0)"
					v-show="topNavIndex === 0 || swipePeek === 0 || paneHiding === 0">
		<view class="noEssay" v-if="books.length == 0">
			<img src="../static/images/icon_my_uplotolib.png" alt="" />
			<p>方块跃然纸上，故事在此生长</p>
			<navigator url="./writers/newEssay">
				<img src="../static/images/icon_my_upload_new.png" alt="" />
			</navigator>
		</view>

		<!-- 滚动视图模式 -->
		<template v-if="viewMode === 'scroll'">
			<transition name="fade">
				<card-swiper class="swiper" v-if="books.length > 0" :list="books" @swiperChange="swiperChange"
					ref="cardSwiper"></card-swiper>
			</transition>
			<transition name="fade">
				<view class="pageBody" v-if="books.length > 0">
					<book-detail-view v-if="curBook !== -1" :book="books[curBook]" :worlds="worlds"
						:statistics="novel_statistic" :isDrawerMode="viewMode === 'grid'"
						:writing-calendar="writingCalendar" :writing-calendar-loading="writingCalendarLoading"
						@close-book-detail="handleCloseBookDrawerManually"
						@goto-all-articles="gotoAllArticles" @read-novel="readNovel" @goto-essay-set="gotoEssaySet"
						@delete-world-novel-asso="deleteWorldNovelAsso" @show-book-select="openBookSelectDrawer"
						@goto-statistics="gotoStatistics" @open-activity-form="openActivityForm"></book-detail-view>
					<transition name='fade'>
						<view style="text-align: center;position:relative;" v-if="curBook === -1">
							<img src="../static/dig.png" alt=""
								style="position:absolute;width:70vw;top:-120px;left:50vw;transform: translateX(-50%); z-index:102" />
							<p
								style="color:#919191; font-weight: bold; font-size:40rpx; margin:20rpx; padding-top:130rpx;">
								开个新坑
							</p>
							<img src="../static/images/icon_my_upload_new.png" alt="" @click="gotoNewEssay"
								style="border-radius: 10rpx;margin-top:150rpx;" class="uploadBtn" />
						</view>
					</transition>
				</view>
			</transition>
		</template>

		<!-- 书架视图模式 -->
		<template v-else>
			<view class="bookshelf" v-if="books.length > 0">
				<div class="book-grid">
					<div v-for="(book, index) in books" :key="book.novel_id" class="book-item"
						@click="selectBook(index)">
						<img :src="book.picUrl" :alt="book.name" class="book-cover"
							:onerror="`this.src='${$backupResources.bookCover}'`" />
						<div class="book-title">{{ book.name }}</div>
					</div>
					<div class="book-item new-book" @click="gotoNewEssay">
						+
					</div>
				</div>
			</view>
		</template>

				</view>

				<!-- 漫画栏目 -->
				<view class="tab-pane" :class="{ 'pane-active': topNavIndex === 1 }" :style="paneStyle(1)"
					v-show="topNavIndex === 1 || swipePeek === 1 || paneHiding === 1">
					<mangaPage ref="mangaPage" @refreshed="refreshPage"></mangaPage>
				</view>

				<!-- 世界栏目 -->
				<view class="tab-pane" :class="{ 'pane-active': topNavIndex === 2 }" :style="paneStyle(2)"
					v-show="topNavIndex === 2 || swipePeek === 2 || paneHiding === 2">
					<worldPage ref="worldPage"></worldPage>
				</view>
			</view>
		</view>
		<!-- 书籍详情抽屉 -->
		<el-drawer :visible.sync="showBookDetail" :with-header="false" size="90%" :direction="'btt'"
			custom-class="book-detail-wrapper" :modal-append-to-body="true">
			<div class="drawer-container">
				<div class="drawer-header">
					<el-button icon="el-icon-close" circle size="medium" @click="handleCloseBookDrawerManually" type="text"
						style="transform: scale(1.2);"></el-button>
				</div>
				<book-detail-view v-if="viewMode === 'grid' && curBook !== -1" :book="books[curBook]" :worlds="worlds"
					:statistics="novel_statistic" :isDrawerMode="viewMode === 'grid'"
					:writing-calendar="writingCalendar" :writing-calendar-loading="writingCalendarLoading"
					@close-book-detail="handleCloseBookDrawerManually"
					@goto-all-articles="gotoAllArticles" @read-novel="readNovel" @goto-essay-set="gotoEssaySet"
					@delete-world-novel-asso="deleteWorldNovelAsso" @show-book-select="openBookSelectDrawer"
					@goto-statistics="gotoStatistics" @goto-world-novel="gotoWorldNovel" @open-activity-form="openActivityForm"></book-detail-view>
			</div>
		</el-drawer>

		<view v-if="bookSelectDrawer" class="world-select-mask" :class="{ visible: bookSelectDrawerVisible }"
			@click="closeBookSelectDrawer">
			<view class="world-select-panel" @click.stop>
				<view class="world-select-header">
					<text class="world-select-title">添加作品世界</text>
					<text class="world-select-close" @click="closeBookSelectDrawer">关闭</text>
				</view>
				<view class="world-search-row">
					<input class="world-search-input" v-model="worldSearchKeyword" placeholder="搜索全站世界"
						confirm-type="search" @input="handleWorldSearchInput" />
				</view>
				<scroll-view scroll-y class="world-select-list">
					<view v-if="loadingWorlds" class="world-select-empty">正在加载世界...</view>
					<view v-else-if="searchBooks.length === 0" class="world-select-empty">暂无可添加的世界</view>
					<view v-for="item in [...searchBooks]" :key="item.world_id || item.novel_id"
						class="world-select-item" @click="selectWorldBook(item)">
						<log-image class="world-select-cover" :src="getWorldCover(item)" mode="aspectFill"
							:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`"></log-image>
						<view class="world-select-info">
							<text class="world-select-name">{{ item.name }}</text>
							<view class="world-select-author">
								<log-image class="world-select-avatar" :src="item.avatar_url || item.auther_avatar"
									mode="aspectFill" onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"></log-image>
								<text class="world-select-author-name">{{ getWorldAuthorName(item) }}</text>
							</view>
							<text class="world-select-desc">{{ getWorldDescription(item) }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 活动表单弹窗 -->
		<el-drawer v-if="currentActivity && currentActivity.required_fields"
				   :visible.sync="showActivityForm" :with-header="false" size="80%" :direction="'btt'"
			custom-class="activity-form-wrapper">
			<div class="activity-form-container">
				<div class="form-header">
					<h3>{{ currentActivity.activity_name || '活动信息填写' }}</h3>
					<el-button icon="el-icon-close" circle size="medium" @click="showActivityForm = false" type="text"></el-button>
				</div>
				
				<div class="form-content" v-if="currentActivity && currentActivity.required_fields">
					
					<div class="form-fields">
						<div v-for="field in currentActivity.required_fields" :key="field.name" class="form-field">
							<label class="field-label">
								{{ field.name }}
								<span v-if="field.required" class="required-mark">*</span>
							</label>
							
							<!-- 文本输入框 -->
							<el-input 
								v-model="activityFormData[field.name]"
								:placeholder="field.placeholder || '请输入' + field.name"
								:maxlength="field.maxLength"
								show-word-limit>
							</el-input>
						</div>
					</div>
					
					<div class="form-actions">
						<el-button @click="showActivityForm = false">取消</el-button>
						<el-button type="primary" @click="submitActivityForm">提交</el-button>
					</div>
					<div class="blank" style="height: 110rpx;"></div>
				</div>
			</div>
		</el-drawer>

	</view>
</template>

<script>
import cardSwiper from "@/components/helang-cardSwiper/helang-cardSwiper"
import writerHelper from "@/components/writer_helper"
import worldPage from '@/components/worldsPage.vue'
import mangaPage from '@/components/mangaPage.vue'
import BookDetailView from '@/components/book-detail-view.vue'
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'

const WORLD_SELECT_ANIMATION_DURATION = 260;

export default {
	data() {
		return {
			viewMode: localStorage.getItem('loghome_essay_view_mode') || 'scroll', // 从本地存储获取上次的视图模式
			showBookDetail: false,
			topNavIndex: 0,
			topNavArr: ['小说', '漫画', '世界'],
			swipeTrace: null, // 横向滑动手势追踪 {x, y, locked}
			swipePeek: -1, // 滑动中临时预览的相邻栏目
			paneHiding: -1, // 切换动画期间仍需保持显示的离场栏
			hidePaneTimer: null,
			dragPx: 0, // 手势跟随的实时位移
			dragging: false,
			pageScrollTop: 0, // 页面滚动距离
			books: [],
			curBook: 0,
			novel_statistic: [],
			writingCalendar: null,
			writingCalendarLoading: false,
			writingCalendarRequestId: 0,
			writingCalendarCache: {},
			writingCalendarRenderTimer: null,
			writingCalendarIdleHandle: null,
			writingCalendarTransitionUntil: 0,
			worlds: [],
			bookSelectDrawer: false, //是否打开书籍选择抽屉
			bookSelectDrawerVisible: false,
			bookSelectDrawerTimer: null,
			bookSelectItemIndex: undefined, //即将需要选择书籍的书链item的index
			timer: undefined,
			searchBooks: [], //搜索到的书
			worldSearchKeyword: '',
			loadingWorlds: false,
			showBookDetailModal: true, //是否打开书籍详情遮罩
			// 活动表单相关数据
			showActivityForm: false,
			currentActivity: null,
			activityFormData: {},
		}
	},
	components: {
		cardSwiper,
		writerHelper,
		worldPage,
		mangaPage,
		BookDetailView,
	},
	mixins: [darkModeMixin],
	onShow() {
		if (this.$isFromLogin) {
			this.$isFromLogin = false;
			uni.switchTab({
				url: './library'
			})
			return;
		}
		let tk = JSON.parse(window.localStorage.getItem('token'));
		if (tk) tk = tk.tk;;
		if (tk == null) {
			this.$isFromLogin = true;
			uni.navigateTo({
				url: './users/login?msg=' + 'unAuthorized'
			});
			return;
		}
		uni.showLoading({
			title: '努力加载中'
		});
		this.refreshPage();
		if (this.$refs.worldPage) this.$refs.worldPage.refreshPage();
		if (this.$refs.mangaPage) this.$refs.mangaPage.refreshPage();
		//console.log(this.$store.state.user_id);
	},
	computed: {
		topNavStyle() {
			const scrollProgress = this.pageScrollTop / 100;
			const opacity = Math.min(Math.max(scrollProgress, 0), 1);
			const backgroundRgb = this.isDarkMode ? '30, 30, 30' : '255, 255, 255';
			return {
				class: scrollProgress >= 0.85 ? 'style2' : '',
				style: `background-color: rgba(${backgroundRgb}, ${opacity})`
			}
		},
		trackStyle() {
			const step = 100 / this.topNavArr.length;
			return {
				transform: 'translate3d(calc(' + (-this.topNavIndex * step) + '% + ' + this.dragPx + 'px), 0, 0)',
				transition: this.dragging ? 'none' : 'transform 0.32s cubic-bezier(0.25, 0.8, 0.4, 1)',
			};
		}
	},
	onLoad() {
		window.addEventListener('popstate', this.browserBack);
		window.addEventListener('loghomeNativeBack', this.handleNativeBack);
	},
	onUnload() {
		window.removeEventListener('popstate', this.browserBack);
		window.removeEventListener('loghomeNativeBack', this.handleNativeBack);
		clearTimeout(this.timer);
		clearTimeout(this.hidePaneTimer);
		if (this.bookSelectDrawerTimer) {
			clearTimeout(this.bookSelectDrawerTimer);
			this.bookSelectDrawerTimer = null;
		}
		this.cancelWritingCalendarCommit();
	},
	// 页面滚动监听
	onPageScroll(e) {
		// console.log(this.pageScrollTop)
		this.pageScrollTop = Math.floor(e.scrollTop);
	},
	methods: {
		toggleViewMode() {
			this.viewMode = this.viewMode === 'scroll' ? 'grid' : 'scroll'
			localStorage.setItem('loghome_essay_view_mode', this.viewMode) // 保存视图模式到本地存储
			setTimeout(() => {
				this.swiperChange(0)
			});
		},
		// 打开活动表单
		openActivityForm(activity, activityInfo) {
			this.currentActivity = activity;
			this.showActivityForm = true;
			console.log(activityInfo);
			// 如果已有填写的数据，预填充表单
			if (activityInfo.userInfo && activityInfo.userInfo.length > 0) {
				const existingInfo = activityInfo.userInfo[0];
				if (existingInfo) {
					// 从 information_data 字段解析实际的表单数据
					try {
						this.activityFormData = existingInfo.information_data ? JSON.parse(existingInfo.information_data) : {};
					} catch (e) {
						console.error('解析已填写的表单数据失败:', e);
						this.activityFormData = {};
					}
				} else {
					this.activityFormData = {};
				}
			} else {
				this.activityFormData = {};
			}
		},
		// 提交活动表单
		async submitActivityForm() {
			try {
				// 验证必填字段
				if (this.currentActivity?.required_fields) {
					for (const field of this.currentActivity.required_fields) {
						if (field.required && (!this.activityFormData[field.name] || this.activityFormData[field.name].toString().trim() === '')) {
							uni.showToast({
								title: `请填写${field.name}`,
								icon: 'none'
							});
							return;
						}
					}
				}

				const token = JSON.parse(localStorage.getItem('token'))?.tk;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '提交中...'
				});

				const response = await axios.post(this.$baseUrl + '/essays/submit_activity_info', {
					novel_id: this.books[this.curBook].novel_id,
					tag_id: this.currentActivity.tag_id,
					form_data: this.activityFormData
				}, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					}
				});

				uni.hideLoading();
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				});

				this.showActivityForm = false;
				// 重置表单数据
				this.activityFormData = {};

			} catch (error) {
				uni.hideLoading();
				console.error('提交活动信息失败:', error);
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					uni.navigateTo({
						url: './users/login?msg=unAuthorized'
					});
				} else {
					uni.showToast({
						title: error.response?.data?.message || '提交失败，请重试',
						icon: 'none'
					});
				}
			}
		},
		selectBook(index) {
			if (this.viewMode === 'grid') {
				this.curBook = index
				this.showBookDetail = true;
				window.history.pushState({ isBookDetailDrawerOpen: true }, '', window.location.href);
				this.swiperChange(index)
			}
		},
		handleCloseBookDrawerManually() {
			// #ifdef H5
			window.history.go(-1)
			// #endif
			this.showBookDetail = false;
		},
		// 顶部导航改变 
		changeTopNav(e) {
			this.switchTo(Number(e.currentTarget.dataset.index))
		},
		switchTo(idx) {
			if (idx === this.topNavIndex) return;
			// 离场栏在滑动动画（0.32s）期间保持显示，否则轨道滑过时露出白底
			this.paneHiding = this.topNavIndex;
			clearTimeout(this.hidePaneTimer);
			this.hidePaneTimer = setTimeout(() => {
				this.paneHiding = -1;
				this.swipePeek = -1;
				this.hidePaneTimer = null;
			}, 360);
			const lo = Math.min(this.topNavIndex, idx);
			const hi = Math.max(this.topNavIndex, idx);
			// 点击 tab 跨栏跳转时，让中间栏在动画期间可见，避免镜头扫过空槽
			this.swipePeek = (hi - lo > 1) ? lo + 1 : -1;
			this.topNavIndex = idx;
		},
		paneStyle(i) {
			// 激活栏是唯一的文档流内 flex 子项，会被排在轨道 x=0 处；
			// 用 relative + left 把它摆回自己的槽位（left 不影响文档流高度）
			if (this.topNavIndex === i) {
				return { left: (i * 100 / 3) + '%' };
			}
			return {};
		},
		// ===== 三栏横向滑动手势 =====
		// 视口内滚时同步标题栏透明度（文档不滚时 onPageScroll 不触发）
		onViewportScroll(e) {
			const top = (e && e.detail && typeof e.detail.scrollTop === 'number')
				? e.detail.scrollTop
				: (e && e.target ? e.target.scrollTop : 0);
			this.pageScrollTop = Math.floor(top || 0);
		},
		onSwipeStart(e) {
			// 卡片轮播区内部自有横滑手势，不劫持
			const target = e && e.target;
			if (target && typeof target.closest === 'function' && target.closest('.swiper')) {
				this.swipeTrace = null;
				return;
			}
			const t = e.touches && e.touches[0];
			if (!t) return;
			this.swipeTrace = { x: t.clientX, y: t.clientY, locked: null };
		},
		onSwipeMove(e) {
			const s = this.swipeTrace;
			if (!s) return;
			const t = e.touches && e.touches[0];
			if (!t) return;
			const dx = t.clientX - s.x;
			const dy = t.clientY - s.y;
			if (!s.locked) {
				if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
				// 方向锁：横向为主才接管
				s.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
				if (s.locked !== 'x') {
					this.swipeTrace = null;
					return;
				}
				this.dragging = true;
			}
			if (e.preventDefault) {
				try { e.preventDefault(); } catch (err) { /* ignore */ }
			}
			let offset = dx;
			const atEdge = (this.topNavIndex === 0 && dx > 0)
				|| (this.topNavIndex === this.topNavArr.length - 1 && dx < 0);
			if (atEdge) offset = dx * 0.3; // 边缘阻尼
			this.dragPx = offset;
			const peek = offset < 0 ? this.topNavIndex + 1 : (offset > 0 ? this.topNavIndex - 1 : -1);
			this.swipePeek = (peek >= 0 && peek < this.topNavArr.length) ? peek : -1;
		},
		onSwipeEnd() {
			const s = this.swipeTrace;
			this.swipeTrace = null;
			this.dragging = false;
			if (!s || s.locked !== 'x') {
				this.dragPx = 0;
				return;
			}
			const width = (typeof window !== 'undefined' && window.innerWidth) || 375;
			let idx = this.topNavIndex;
			if (this.dragPx < -width / 5) idx = Math.min(this.topNavIndex + 1, this.topNavArr.length - 1);
			else if (this.dragPx > width / 5) idx = Math.max(this.topNavIndex - 1, 0);
			this.dragPx = 0;
			if (idx === this.topNavIndex) {
				// 回弹：预览栏在回弹动画期间保持显示，避免中途露白
				clearTimeout(this.hidePaneTimer);
				this.hidePaneTimer = setTimeout(() => {
					this.swipePeek = -1;
					this.hidePaneTimer = null;
				}, 360);
				return;
			}
			this.switchTo(idx);
		},
		refreshPage() {
			let _this = this;
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;;
			axios.get(this.$baseUrl + '/essays/get_novels_of', {
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				// 缓存保持全量（其他页面依赖），小说工作区过滤掉漫画，漫画由「漫画」Tab 管理
				let allWorks = res.data || [];
				window.localStorage.setItem("LogHomeUserEaasy", JSON.stringify(allWorks));
				this.books = allWorks.filter((n) => n.novel_type !== 'manga');
				this.$forceUpdate();
				this.$nextTick(() => {
					if (this.$refs.cardSwiper) this.$refs.cardSwiper.reload(this.books);
				})
				_this.swiperChange(this.curBook);
			}).catch(function (error) {
				console.log(error);
				if (error.message == "Request failed with status code 401") {
					window.localStorage.removeItem('token');
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
				} else {
					//获取本地数据
					let localData = window.localStorage.getItem("LogHomeUserEaasy");
					if (localData) {
						localData = JSON.parse(localData);
						_this.books = localData.filter((n) => n.novel_type !== 'manga');
						_this.$forceUpdate();
					}
				}
			}).then(function () {
				uni.hideLoading();
			})

			this.getMyWorlds();
		},
		swiperChange(e) {
			if (!this.books[e]) {
				// 轮播滑到"创建新作品"卡片时（e 为 -1），同步清空当前作品，避免信息栏停留在上一部作品
				this.curBook = -1;
				this.writingCalendarRequestId += 1;
				this.cancelWritingCalendarCommit();
				this.writingCalendar = null;
				this.writingCalendarLoading = false;
				return;
			}
			this.curBook = e;
			// 给轮换组件的缩放/位移动画留出时间，避免日历的大批量节点同时提交。
			this.writingCalendarTransitionUntil = Date.now() + 350;
			this.fetchWritingCalendar(this.books[e].novel_id);
			axios.get(this.$baseUrl + '/articles/get_novel_statistics?novel_id=' + this.books[e].novel_id).then((
				res) => {
				this.novel_statistic = res.data;
			}).catch(function (error) {
				if (error.message == "Request failed with status code 401") {
					window.localStorage.removeItem('token');
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
				} else {
					uni.showToast({
						title: "获取书籍数据失败",
						icon: 'none',
						duration: 2000
					});
				}
			}).then(function () {
				uni.hideLoading();
			})
			// 获取关联世界
			axios.get(this.$baseUrl + '/world/get_asso_world_by_novel_id?novel_id=' + this.books[e].novel_id).then((
				res) => {
				console.log(res.data);
				this.worlds = res.data;
			}).catch(function (error) {
				if (error.message == "Request failed with status code 401") {
					window.localStorage.removeItem('token');
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
				} else {
					uni.showToast({
						title: "获取关联世界设定失败",
						icon: 'none',
						duration: 2000
					});
				}
			}).then(function () {
				uni.hideLoading();
			})
		},
		async fetchWritingCalendar(novelId) {
			const normalizedNovelId = Number(novelId || 0);
			if (!normalizedNovelId) {
				this.writingCalendarRequestId += 1;
				this.cancelWritingCalendarCommit();
				this.writingCalendar = null;
				this.writingCalendarLoading = false;
				return;
			}

			const requestId = this.writingCalendarRequestId + 1;
			this.writingCalendarRequestId = requestId;
			this.cancelWritingCalendarCommit();
			const tokenInfo = JSON.parse(window.localStorage.getItem('token'));
			const cacheKey = `${Number((tokenInfo && tokenInfo.id) || 0)}:${normalizedNovelId}`;
			this.writingCalendarLoading = true;
			const cachedCalendar = this.writingCalendarCache[cacheKey];
			if (cachedCalendar) this.scheduleWritingCalendarCommit(cachedCalendar, requestId);

			const tk = tokenInfo && tokenInfo.tk;
			try {
				const response = await axios.get(
					this.$baseUrl + '/essays/get_novel_writing_calendar',
					{
						params: { novel_id: normalizedNovelId },
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					}
				);
				if (requestId !== this.writingCalendarRequestId) return;
				const calendarData = this.freezeWritingCalendar(response.data);
				// 缓存不参与界面渲染，无需使用 $set 触发额外的响应式遍历。
				this.writingCalendarCache[cacheKey] = calendarData;
				this.scheduleWritingCalendarCommit(calendarData, requestId);
			} catch (error) {
				if (requestId !== this.writingCalendarRequestId) return;
				console.error('获取作品创作日历失败:', error);
				const fallback = cachedCalendar || this.freezeWritingCalendar({ error: true });
				this.scheduleWritingCalendarCommit(fallback, requestId);
			}
		},
		freezeWritingCalendar(calendarData) {
			if (!calendarData || typeof calendarData !== 'object' || !Object.freeze) {
				return calendarData;
			}
			// 日历响应在本页只读。冻结顶层对象可避免 Vue 2 同步递归观测数百条日期数据。
			return Object.isFrozen(calendarData) ? calendarData : Object.freeze(calendarData);
		},
		cancelWritingCalendarCommit() {
			if (this.writingCalendarRenderTimer !== null) {
				clearTimeout(this.writingCalendarRenderTimer);
				this.writingCalendarRenderTimer = null;
			}
			if (this.writingCalendarIdleHandle !== null && typeof window.cancelIdleCallback === 'function') {
				window.cancelIdleCallback(this.writingCalendarIdleHandle);
			}
			this.writingCalendarIdleHandle = null;
		},
		scheduleWritingCalendarCommit(calendarData, requestId) {
			this.cancelWritingCalendarCommit();
			const delay = Math.max(0, this.writingCalendarTransitionUntil - Date.now());
			this.writingCalendarRenderTimer = setTimeout(() => {
				this.writingCalendarRenderTimer = null;
				if (requestId !== this.writingCalendarRequestId) return;

				const commit = () => {
					this.writingCalendarIdleHandle = null;
					if (requestId !== this.writingCalendarRequestId) return;
					this.writingCalendar = calendarData;
					this.writingCalendarLoading = false;
				};

				if (typeof window.requestIdleCallback === 'function') {
					this.writingCalendarIdleHandle = window.requestIdleCallback(commit, { timeout: 500 });
				} else {
					commit();
				}
			}, delay);
		},
		gotoNewEssay() {
			uni.navigateTo({
				url: "./writers/newEssay"
			})
		},
		gotoAllArticles() {
			this.showBookDetail = false;
			uni.navigateTo({
				url: "./writers/allArticles?id=" + this.books[this.curBook].novel_id
			})
		},
		gotoWorldNovel(novel_id) {
			this.showBookDetail = false;
		},
		readNovel(is_personal) {
			if (is_personal == 1) {
				uni.showToast({
					title: "该作品还没有发布，不能阅读。",
					icon: 'none',
					duration: 2000
				});
			} else {
				this.showBookDetail = false;
				uni.navigateTo({
					url: "./readers/bookInfo?id=" + this.books[this.curBook].novel_id
				})
			}
		},
		gotoEssaySet() {
			this.showBookDetail = false;
			uni.navigateTo({
				url: "./writers/essaySet?id=" + this.books[this.curBook].novel_id
			})
		},
		gotoStatistics() {
			this.showBookDetail = false;
			uni.navigateTo({
				url: './writers/novel_statistics?id=' + this.books[this.curBook].novel_id
			})
		},
		openBookSelectDrawer() {
			if (this.bookSelectDrawerTimer) {
				clearTimeout(this.bookSelectDrawerTimer);
				this.bookSelectDrawerTimer = null;
			}
			this.bookSelectDrawer = true;
			this.bookSelectDrawerVisible = false;
			this.worldSearchKeyword = '';
			this.getMyWorlds();
			this.$nextTick(() => {
				this.bookSelectDrawerVisible = true;
			});
		},
		closeBookSelectDrawer() {
			if (!this.bookSelectDrawer) return;
			this.bookSelectDrawerVisible = false;
			if (this.bookSelectDrawerTimer) {
				clearTimeout(this.bookSelectDrawerTimer);
			}
			this.bookSelectDrawerTimer = setTimeout(() => {
				this.bookSelectDrawer = false;
				this.bookSelectDrawerTimer = null;
			}, WORLD_SELECT_ANIMATION_DURATION);
		},
		handleWorldSearchInput(e) {
			const value = typeof e === 'string'
				? e
				: (e && e.detail && e.detail.value !== undefined)
					? e.detail.value
					: (e && e.target ? e.target.value : this.worldSearchKeyword);
			this.worldSearchKeyword = value || '';
			this.searchLibrary(this.worldSearchKeyword);
		},
		getWorldCover(item = {}) {
			const cover = item.picUrl || (this.$backupResources && this.$backupResources.bookCover) || '../static/images/defaultBookCover.png';
			if (!cover || cover.indexOf('?') !== -1 || cover.indexOf('data:') === 0 || cover.indexOf('http') !== 0) {
				return cover;
			}
			return cover + '?thumbnail=1';
		},
		getWorldAuthorName(item = {}) {
			return item.user_name || item.author_name || item.username || '未知作者';
		},
		getWorldDescription(item = {}) {
			const desc = item.content || item.description || '暂无简介';
			if (desc.length <= 58) return desc;
			return desc.substr(0, 58) + '...';
		},
		//搜索书库，这个方法与library.vue的一致
		searchLibrary(e) {
			clearTimeout(this.timer);
			let _this = this;
			this.timer = setTimeout(() => {
				if (e == "") {
					this.getMyWorlds();
				} else {
					_this.loadingWorlds = true;
					axios.get(_this.$baseUrl + '/world/get_worlds_search?keyword=' + e, {}).then((res) => {
						_this.searchBooks = res.data;
					}).catch(function (error) {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					}).then(function () {
						_this.loadingWorlds = false;
						uni.hideLoading();
					})
				}

			}, 500)
		},
		deleteWorldNovelAsso(world_id) {
			let _this = this;
			uni.showActionSheet({
				itemList: ["取消关联设定"],
				success: function (res) {
					if (res.tapIndex == 0) {
						let tk = JSON.parse(window.localStorage.getItem('token'));
						if (tk) tk = tk.tk;
						axios.get(_this.$baseUrl + '/world/delete_world_novel_asso?world_id=' + world_id +
							"&novel_id=" + _this.books[_this.curBook].novel_id, {
							headers: {
								'Content-Type': 'application/json', //设置请求头请求格式为JSON
								'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
							}
						}).then((res) => {
							uni.showToast({
								title: "删除关联世界设定成功",
								icon: 'none',
								duration: 2000
							});
						}).catch(function (error) {
							uni.showToast({
								title: error.toString(),
								icon: 'none',
								duration: 2000
							});
						}).then(() => {
							uni.hideLoading();
							_this.refreshPage();
						})
					}
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		},
		getMyWorlds() {
			let _this = this;
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;
			_this.loadingWorlds = true;
			axios.get(this.$baseUrl + '/world/get_my_worlds', {
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.searchBooks = res.data;
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			}).then(function () {
				_this.loadingWorlds = false;
				uni.hideLoading();
			})
		},
		selectWorldBook(book_item) {
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;;
			axios.get(this.$baseUrl + '/world/add_world_novel_asso?world_id=' + book_item.world_id + "&novel_id=" +
				this.books[this.curBook].novel_id, {
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				uni.showToast({
					title: "添加关联世界设定成功",
					icon: 'none',
					duration: 2000
				});
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			}).then(() => {
				uni.hideLoading();
				this.refreshPage();
			})
			this.closeBookSelectDrawer();
		},
		browserBack() {
			if(this.showBookDetail) {
				this.showBookDetail = false;
			}
		},
		handleNativeBack(event) {
			if(!this.showBookDetail) {
				return;
			}
			event.preventDefault();
			window.history.go(-1);
		},
	}
}
</script>

<style lang="scss" scoped>
@import "lib/global.scss";

view.outer {
	height: calc(100%);
	background-color: #ffffff !important;

	&.dark-mode {
		background-color: var(--background-color-secondary) !important;
	}
}

/* 标题栏 */
.tabs-viewport {
	/* .outer 根节点是 height:100%，页面滚动依赖内容溢出或本容器内滚；
	   overflow:hidden 会切断溢出传播导致整页不可滚，因此纵向用 auto。
	   横向裁剪防止绝对定位的邻栏把页面撑出横向滚动条 */
	overflow-x: hidden;
	overflow-y: auto;
}

.tabs-track {
	position: relative;
	display: flex;
	width: 300%;
}

.tab-pane {
	position: absolute;
	top: 0;
	width: 33.3333%;
	min-width: 0;
	/* 盒子固定为轨道高度（=激活栏高度）并在栏内裁剪：
	   防止非激活栏内容向下扩展页面可滚动高度（出现空白可滚区域） */
	height: 100%;
	overflow: hidden;

	/* 非激活栏绝对定位脱离文档流：不撑高页面，也不影响 translate 定位换算 */
	&:nth-child(1) {
		left: 0;
	}

	&:nth-child(2) {
		left: 33.3333%;
	}

	&:nth-child(3) {
		left: 66.6666%;
	}

	&.pane-active {
		position: relative;
		left: auto;
		height: auto;
		overflow: visible;
	}
}

.title {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: auto;
	padding-top: var(--loghome-safe-top, 0px);
	z-index: 10;
	color: rgba(0, 0, 0, 0.8);

	.dark-mode & {
		color: var(--text-color-primary);
	}

	&>view {
		height: 44px;
	}

	.box1 {
		width: 60rpx;
		margin: 0 40rpx;
		font-size: 36rpx;
	}


	.tab {
		&>view {
			margin: 0 30rpx;
			line-height: 64rpx;
			font-size: 36rpx;
			position: relative;
			letter-spacing: 0;
			transition: transform 0.3s ease-in-out 0s;
			transform: scale(1, 1);

			&.active {
				color: rgb(0, 0, 0);
				font-weight: bold;
				transform: scale(1.15, 1.15);
			}
		}
	}

	.tab.dark-mode {
		.active {
			color: white;
		}
	}

	&.style2 {
		color: #000000;
		font-weight: bold;
		background-color: #ffffff00;
		box-shadow:
			0px 0px 2.2px rgba(0, 0, 0, 0.02),
			0px 0px 5.3px rgba(0, 0, 0, 0.028),
			0px 0px 10px rgba(0, 0, 0, 0.035),
			0px 0px 17.9px rgba(0, 0, 0, 0.042),
			0px 0px 33.4px rgba(0, 0, 0, 0.05),
			0px 0px 80px rgba(0, 0, 0, 0.07);

		.dark-mode & {
			color: var(--text-color-primary);
			box-shadow:
				0px 0px 2.2px rgba(0, 0, 0, 0.1),
				0px 0px 5.3px rgba(0, 0, 0, 0.13),
				0px 0px 10px rgba(0, 0, 0, 0.15),
				0px 0px 17.9px rgba(0, 0, 0, 0.17),
				0px 0px 33.4px rgba(0, 0, 0, 0.2),
				0px 0px 80px rgba(0, 0, 0, 0.3);

			.tab>view.active {
				color: var(--text-color-primary);
			}
		}

		.tab {
			&>view {
				&.active {
					color: #000000;
				}
			}
		}
	}

}

.noEssay {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 80vh;

	img:first-child {
		width: 50vw;
	}

	img:last-child {
		width: 40vw;
	}

	p {
		text-align: center;
		font-size: 35rpx;
		color: #2d2d2d;
		font-weight: bold;
		margin: 30rpx;

		.dark-mode & {
			color: var(--text-color-primary);
		}
	}
}

.pageBody {
	// 详情包含日历、活动和统计，必须由内容撑高，避免被横滑视口裁剪。
	height: auto;
	padding-top: 20rpx;
	padding-bottom: 120rpx;
}

.books {
	height: 260rpx;
	width: calc(100vw - 65rpx);
	margin: 0 30rpx;
	display: flex;
	background-color: rgb(255, 255, 255);
	border-radius: 10rpx;

	.dark-mode & {
		background-color: var(--card-background);
	}


	img {
		height: 260rpx;
		width: 200rpx;
		border-radius: 10rpx 0 0 10rpx;
		margin: 0rpx;
		flex-shrink: 0;
	}

	.bookInfo {
		margin-left: 30rpx;
		margin-top: 22rpx;

		.world-title {
			font-size: 34rpx;
			height: 42rpx;
			margin-bottom: 10rpx;
			overflow: hidden;
			display: -webkit-box;
			font-weight: bold;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			color: rgb(45, 45, 45);
			margin: 5rpx;
			text-align: left;

			.dark-mode & {
				color: var(--text-color-primary);
			}
		}

		.author {
			position: relative;
			margin-top: 15rpx;
			margin-bottom: 10rpx;
			display: flex;
			text-align: left;

			.auther_avatar {
				position: absolute;
				top: 0rpx;
				left: 5rpx;
				height: 35rpx;
				width: 35rpx;
				border-radius: 5rpx;
			}

			.auther_name {
				font-size: 25rpx;
				// font-weight: bold;
				color: rgb(45, 45, 45);
				overflow: hidden;
				margin-left: 45rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;

				.dark-mode & {
					color: var(--text-color-regular);
				}
			}
		}

		.description {
			font-size: 25rpx;
			color: rgb(142, 130, 109);
			margin: 5rpx 0;
			overflow: hidden;
			display: -webkit-box;
			text-align: left;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;

			.dark-mode & {
				color: rgba(142, 130, 109, 0.8);
			}
		}

	}
}

	.deleteBtn {
		position: absolute;
		transform: translateY(50%);
		bottom: 50%;
		right: 40rpx;
	}

	img:last-child {
		width: 40vw;
	}

	.blank_box {
		height: calc(125rpx + 100rpx);
		background-color: #ffffff;
	}

	img.uploadBtn {
		transform: scale(1.2);
		transition: transform .3s;
	}

	img.uploadBtn:active {
		transform: scale(1.1);
	}

	.fade-enter-active {
		z-index: 10;
		transition: opacity .5s
	}

	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}

	.bookshelf {
		min-height: 100vh;
		padding: 20rpx;
		padding-top: calc(44px + var(--loghome-safe-top, 0px) + 20rpx); // 标题栏高度 + 状态栏高度 + 额外间距
		// background-color: white;
		background: linear-gradient(to bottom, rgb(255, 248, 234) 0%, rgb(255, 248, 234) 30%, rgb(255, 255, 255) 100%);

		.dark-mode & {
			background: linear-gradient(to bottom, rgba(40, 38, 35, 1) 0%, rgba(40, 38, 35, 1) 30%, var(--background-color-secondary) 100%);
		}

		padding-bottom: 150rpx;

		.book-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 20rpx;
			padding: 10rpx;

			.book-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				cursor: pointer;

				.book-cover {
					width: 200rpx;
					height: 280rpx;
					border-radius: 8rpx;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}

				.book-title {
					margin-top: 10rpx;
					font-size: 24rpx;
					text-align: center;
					width: 200rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					.dark-mode & {
						color: var(--text-color-primary);
					}
				}

				&.new-book {
					height: 280rpx;
					width: 200rpx;
					border: 4rpx dashed #4c4c4c33;
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 60rpx;
					color: #4c4c4c66;
					background-color: #f8f8f8;
					transition: all 0.3s ease;
					margin: 0 auto;

					.dark-mode & {
						background-color: rgba(255, 255, 255, 0.05);
						border-color: rgba(255, 255, 255, 0.2);
						color: rgba(255, 255, 255, 0.4);
					}

					&:active {
						transform: scale(0.95);
						background-color: #4c4c4c11;
						border-color: #4c4c4c55;
						color: #4c4c4c88;
					}
				}
			}

			.book-item:active {
				transform: scale(0.95);
				transition: all .3s;
			}
		}
	}

	.drawer-container {
		height: 100%;
		overflow-y: auto;

		.drawer-header {
			position: sticky;
			top: 0;
			z-index: 100;
			padding: 20rpx;
			text-align: right;
			background: rgb(255, 248, 234);

			.dark-mode & {
				background: rgba(40, 38, 35, 1);
			}
		}
	}

	.world-select-mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.45);
		z-index: 3100;
		display: flex;
		align-items: flex-end;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.26s ease;
	}

	.world-select-mask.visible {
		opacity: 1;
		pointer-events: auto;
	}

	.world-select-panel {
		width: 100%;
		height: 75vh;
		max-height: 75vh;
		background: var(--card-background);
		border-radius: 28rpx 28rpx 0 0;
		padding-bottom: var(--loghome-safe-bottom, 0px);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 -12rpx 36rpx rgba(0, 0, 0, 0.16);
		transform: translate3d(0, 100%, 0);
		transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
	}

	.world-select-mask.visible .world-select-panel {
		transform: translate3d(0, 0, 0);
	}

	.world-select-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 30rpx 20rpx;
		border-bottom: 1px solid var(--border-color);
	}

	.world-select-title {
		font-size: 32rpx;
		font-weight: bold;
		color: var(--text-color-primary);
	}

	.world-select-close {
		font-size: 26rpx;
		color: var(--text-color-regular);
	}

	.world-search-row {
		padding: 20rpx 30rpx;
		border-bottom: 1px solid var(--border-color);
	}

	.world-search-input {
		width: 100%;
		height: 76rpx;
		padding: 0 24rpx;
		border-radius: 14rpx;
		background: var(--background-color-secondary);
		box-sizing: border-box;
		color: var(--text-color-primary);
	}

	.world-select-list {
		flex: 1;
		height: calc(75vh - 180rpx - var(--loghome-safe-bottom, 0px));
		min-height: 240rpx;
	}

	.world-select-empty {
		padding: 60rpx 30rpx;
		text-align: center;
		color: var(--text-color-regular);
		font-size: 26rpx;
	}

	.world-select-item {
		display: flex;
		padding: 24rpx 30rpx;
		border-bottom: 1px solid var(--border-color);
	}

	.world-select-cover {
		width: 140rpx;
		height: 188rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.world-select-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.world-select-name {
		font-size: 30rpx;
		font-weight: bold;
		color: var(--text-color-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.world-select-author {
		display: flex;
		align-items: center;
		margin-top: 12rpx;
		min-width: 0;
	}

	.world-select-avatar {
		width: 34rpx;
		height: 34rpx;
		border-radius: 6rpx;
		margin-right: 10rpx;
		flex-shrink: 0;
	}

	.world-select-author-name {
		font-size: 24rpx;
		color: var(--text-color-regular);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.world-select-desc {
		font-size: 24rpx;
		color: var(--text-color-regular);
		margin-top: 14rpx;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}

	// 活动表单样式
	:deep(.activity-form-wrapper) {
		.el-drawer__body {
			padding: 0;
		}
	}

	.activity-form-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #fff;

		.dark-mode & {
			background-color: var(--background-color-secondary);
		}

		.form-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx;
			border-bottom: 1px solid #eee;

			.dark-mode & {
				border-bottom-color: rgba(255, 255, 255, 0.1);
			}

			h3 {
				margin: 0;
				font-size: 36rpx;
				font-weight: 600;
				color: #333;

				.dark-mode & {
					color: var(--text-color-primary);
				}
			}
		}

		.form-content {
			flex: 1;
			padding: 40rpx;
			overflow-y: auto;

			.activity-description {
				margin-bottom: 40rpx;
				padding: 30rpx;
				background-color: #f8f9fa;
				border-radius: 12rpx;
				border-left: 4px solid #007aff;

				.dark-mode & {
					background-color: rgba(255, 255, 255, 0.05);
					border-left-color: #409eff;
				}

				p {
					margin: 0;
					font-size: 28rpx;
					line-height: 1.6;
					color: #666;

					.dark-mode & {
						color: var(--text-color-secondary);
					}
				}
			}

			.form-fields {
				.form-field {
					margin-bottom: 40rpx;

					.field-label {
						display: block;
						margin-bottom: 16rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #333;

						.dark-mode & {
							color: var(--text-color-primary);
						}

						.required-mark {
							color: #f56c6c;
							margin-left: 4rpx;
						}
					}

					.field-description {
						margin-top: 12rpx;
						font-size: 24rpx;
						color: #999;
						line-height: 1.4;

						.dark-mode & {
							color: var(--text-color-tertiary);
						}
					}

					:deep(.el-input),
					:deep(.el-select),
					:deep(.el-date-picker),
					:deep(.el-input-number) {
						width: 100%;

						.el-input__inner {
							border-radius: 8rpx;
							border: 1px solid #ddd;
							font-size: 28rpx;
							padding: 24rpx 20rpx;

							.dark-mode & {
								background-color: rgba(255, 255, 255, 0.05);
								border-color: rgba(255, 255, 255, 0.1);
								color: var(--text-color-primary);
							}

							&:focus {
								border-color: #007aff;
								box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
							}
						}

						.el-textarea__inner {
							border-radius: 8rpx;
							border: 1px solid #ddd;
							font-size: 28rpx;
							padding: 20rpx;
							resize: vertical;

							.dark-mode & {
								background-color: rgba(255, 255, 255, 0.05);
								border-color: rgba(255, 255, 255, 0.1);
								color: var(--text-color-primary);
							}

							&:focus {
								border-color: #007aff;
								box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
							}
						}
					}
				}
			}

			.form-actions {
				display: flex;
				justify-content: flex-end;
				gap: 20rpx;
				padding-top: 40rpx;
				border-top: 1px solid #eee;

				.dark-mode & {
					border-top-color: rgba(255, 255, 255, 0.1);
				}

				:deep(.el-button) {
					padding: 20rpx 40rpx;
					font-size: 28rpx;
					border-radius: 8rpx;

					&.el-button--primary {
						background-color: #007aff;
						border-color: #007aff;

						&:hover {
							background-color: #0056cc;
							border-color: #0056cc;
						}
					}
				}
			}
		}
	}
</style>
