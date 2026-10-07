<template>
	<view class="content" v-dark>
		<div class="tabBar" v-dark>
			<uni-icons type="left" size="27" color="310000" class="backBtn" @click="goBack" style="position: absolute; z-index: 10;"/>
			<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex="changeTab" :textColor="$store.state.isDarkMode ? '#ffffff' : '#2d2d2d'"
				ref="tabDom" :underBarBias="-0"/>
		</div>
		<div class="searchBar">
			<uni-search-bar :bgColor="$store.state.isDarkMode ? '#2C2C2C' : 'rgb(211,211,211)'" :radius="5" @input="onSearchInput" placeholder="搜索书架"
				cancelButton="none">
				<img src="../../static/icons/icon_search.png" alt="" slot="searchIcon" style="height:25px;"/>
				<img src="../../static/icons/icon_r_x.png" alt="" slot="clearIcon" style="height:20px;"/>
			</uni-search-bar>
		</div>
		<div class="bookcase-viewport" :class="{ 'is-dragging': isSwiping }"
			@touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchCancel">
			<div class="bookcase-track" ref="trackDom" :style="trackStyle">
				<div class="bookcase-pane">
					<div class="bookcase">
						<bookInCase v-for="item in likedBooksOnShow" :bookName="item.name" :picUrl="item.picUrl" :updateInfo="item.updateInfo" :key="item.novel_id"
							@click.native="readBook(item.novel_id)"></bookInCase>
					</div>
				</div>
				<div class="bookcase-pane">
					<div class="bookcase">
						<bookInCase v-for="item in historyBooksOnShow" :bookName="item.name" :picUrl="item.picUrl" :updateInfo="item.updateInfo" :key="item.novel_id"
							@click.native="readBook(item.novel_id)"></bookInCase>
					</div>
				</div>
			</div>
		</div>
		<div class="underBar"></div>
	</view>
</template>

<script>
	import bookInCase from '../../components/book_in_case.vue'
	import uniSearchBar from '../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'
	import axios from 'axios'
	import { articleDB } from '../../lib/db.js'

	// 滑动手势参数
	const SWIPE_SLOP = 10;          // 触发方向锁定的最小位移（px）
	const SETTLE_RATIO = 0.35;      // 松手时按面板宽度的比例吸附
	const FLICK_VELOCITY = 0.5;     // 轻扫速度阈值（px/ms，即 500px/s）
	const FLICK_DISTANCE = 20;      // 轻扫判定所需的最小位移（px）
	const EDGE_RESISTANCE = 0.3;    // 边界阻尼系数（越界部分按比例衰减）
	const SETTLE_DURATION = 350;    // 松手后吸附动画时长（ms）
	const CLICK_GUARD_TIME = 250;   // 滑动结束后抑制误点击的时长（ms）

	export default {
		components: {
			bookInCase,
			uniSearchBar
		},
		data() {
			let windowWidth = 375;
			try {
				if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
					windowWidth = uni.getSystemInfoSync().windowWidth || 375;
				}
			} catch (e) {}
			return {
				// 两个书架的数据各自独立，双面板常驻渲染，切换时不再销毁重建
				likedBooksAll: [],
				historyBooksAll: [],
				updateInfo: new Map(),
				isOffline: false,
				searchKeyword: '',
				tabValue: [
					"收藏", "历史"
				],
				curTabIndex: 0,
				firstTab: 0,
				windowWidth: windowWidth,
				// 滑动状态
				isSwiping: false,        // 是否正在跟手拖动（拖动中禁用过渡动画）
				dragOffset: 0,           // 相对当前面板的拖动偏移（px）
				dragBaseOffset: 0,       // 方向锁定瞬间轨道的视觉偏移（px）
				dragLockX: 0,            // 方向锁定瞬间的触点X
				touchActive: false,
				touchStartX: null,
				touchStartY: null,
				lockedDirection: null,   // 'x' | 'y' | null
				hasMoved: false,
				moveSamples: [],         // 用于计算松手速度的采样
				lastSwipeEndTime: 0,
				longPressFireTime: 0,
				// 每个tab的加载状态（首次显示loading，之后静默刷新）
				tabLoaded: { 0: false, 1: false },
				tabLoading: { 0: false, 1: false },
				refreshTimers: { 0: null, 1: null }, // 各tab静默刷新的延迟计时器
				hasLoadedOnce: false,
				Loop: null
			}
		},
		computed: {
			likedBooksOnShow() {
				return this.filterBooks(this.likedBooksAll);
			},
			historyBooksOnShow() {
				return this.filterBooks(this.historyBooksAll);
			},
			// 轨道位移：拖动中直接跟随手指（无过渡），松手后由过渡动画吸附到目标面板
			trackStyle() {
				const offset = -this.curTabIndex * this.windowWidth + this.dragOffset;
				return {
					transform: `translate3d(${offset}px, 0px, 0px)`,
					transition: this.isSwiping
						? 'none'
						: `transform ${SETTLE_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
				};
			}
		},
		methods: {
			// ---------- 数据 ----------
			filterBooks(list) {
				const keyword = (this.searchKeyword || '').trim();
				let result = keyword
					? list.filter(item => item.name && item.name.indexOf(keyword) !== -1)
					: list.slice();
				// 用占位符补齐 3 的倍数（至少 9 个），保持网格占位
				const target = Math.max(9, Math.ceil(result.length / 3) * 3);
				for (let i = result.length; i < target; i++) {
					result.push({
						name: '',
						picUrl: '',
						novel_id: -(i + 1) * 13 - 7
					});
				}
				return result;
			},
			onSearchInput(e) {
				this.searchKeyword = e || '';
			},
			loadTabData(index) {
				const showLoading = !this.tabLoaded[index];
				if (this.tabValue[index] === '收藏') {
					this.getLikedBooks(showLoading);
				} else if (this.tabValue[index] === '历史') {
					this.getHistoryBooks(showLoading);
				}
			},
			// 切换到目标tab（滑动松手或点击均走这里）
			commitTab(target) {
				this.curTabIndex = target;
				this.syncTabIndicator(target);
				if (this.tabLoaded[target]) {
					// 已加载过的tab：静默刷新延迟到滑动动画结束后再执行，
					// 避免动画进行中列表重渲染造成内容闪动
					this.scheduleTabRefresh(target, SETTLE_DURATION + 50);
				} else {
					this.loadTabData(target);
				}
			},
			// 静默刷新调度（若用户又在拖动，则自动顺延）
			scheduleTabRefresh(index, delay) {
				clearTimeout(this.refreshTimers[index]);
				this.refreshTimers[index] = setTimeout(() => {
					if (this.isSwiping) {
						this.scheduleTabRefresh(index, 200);
						return;
					}
					this.loadTabData(index);
				}, delay);
			},
			syncTabIndicator(index) {
				// 滑动切换时同步lgd-tab的下划线（点击切换时组件内部已更新，避免重复触发）
				if (this.$refs.tabDom && this.$refs.tabDom.tIndex !== index) {
					this.$refs.tabDom.clickTab(index);
				}
			},
			// lgd-tab点击回调：只负责切换数据与轨道位置（下划线由组件自身处理）
			changeTab(value) {
				if (this.isSwiping) return; // 拖动中忽略tab点击，避免与手势冲突
				if (value === this.curTabIndex) return;
				this.commitTab(value);
			},
			searchBookCase() {
				// 兼容保留：搜索逻辑已迁移到 onSearchInput + computed 过滤
			},
			async readBook(novel_id) {
				if (!novel_id || novel_id <= 0) return;
				// 滑动/长按后短暂抑制点击，防止误触打开书籍
				const now = Date.now();
				if (this.isSwiping) return;
				if (now - this.lastSwipeEndTime < CLICK_GUARD_TIME) return;
				if (now - this.longPressFireTime < 500) return;
				if (this.isOffline) {
					//如果是离线，则获取阅读记录、并直接跳转到对应章节。
					let history = 0;
					//本地阅读记录管理
					let readingHistory = window.localStorage.getItem("ReaderHistory_" + novel_id);
					if (readingHistory != null) {
						history = readingHistory;
					}
					let articles = await articleDB.articles.where("novel_id").equals(novel_id).toArray();
					if(articles.length > 0){
						const readerProps = window.localStorage.getItem("readerProps");
						const isPageReader = readerProps !== "text";
						const url = isPageReader
							? `../readers/newReader/article?id=${articles[history].article_id}&novelId=${novel_id}`
							: `../readers/article_rich?id=${articles[history].article_id}`;
						uni.navigateTo({
							url
						})
					} else {
						uni.showToast({
							title: "未缓存该书籍，无法阅读",
							icon: 'none'
						})
					}
				} else {
					uni.navigateTo({
						url: '../readers/bookInfo?id=' + novel_id
					})
				}
			},
			gotoManage() {
				uni.navigateTo({
					url: './manage'
				});
			},
			// ---------- 滑动手势 ----------
			onTouchStart(event) {
				if (event.touches.length > 1) return; // 多指不重新开始手势
				const touch = event.touches[0];
				this.touchActive = true;
				this.touchStartX = touch.clientX;
				this.touchStartY = touch.clientY;
				this.lockedDirection = null;
				this.hasMoved = false;

				// 长按进入书架管理（保留原有交互）
				let that = this;
				clearTimeout(this.Loop);
				this.Loop = setTimeout(function() {
					if (!that.hasMoved && that.touchActive) {
						that.longPressFireTime = Date.now();
						that.gotoManage();
						if(that.jsBridge && that.jsBridge.inApp){
							// that.jsBridge.vibrate();
						}
					}
				}, 500);
			},
			onTouchMove(event) {
				if (!this.touchActive || !event.touches || event.touches.length === 0) return;
				const touch = event.touches[0];
				const dx = touch.clientX - this.touchStartX;
				const dy = touch.clientY - this.touchStartY;
				const absX = Math.abs(dx);
				const absY = Math.abs(dy);

				// 方向锁定：一旦判定为横向/纵向，本次触摸内不再改变
				if (this.lockedDirection === null) {
					if (absX < SWIPE_SLOP && absY < SWIPE_SLOP) return;
					if (absX >= absY) {
						// 横向：接管为跟手拖动
						this.lockedDirection = 'x';
						this.hasMoved = true;
						clearTimeout(this.Loop);
						this.isSwiping = true;
						// 从当前视觉位置接管（可打断上一次的吸附动画，实现连续快速滑动）
						this.dragBaseOffset = this.getTrackCurrentOffset();
						this.dragLockX = touch.clientX;
						this.moveSamples = [];
					} else {
						// 纵向：交还给页面自然滚动
						this.lockedDirection = 'y';
						this.hasMoved = true;
						clearTimeout(this.Loop);
					}
				}

				if (this.lockedDirection !== 'x') return;

				// 横向拖动期间阻止页面原生滚动/下拉刷新
				if (event.cancelable !== false) {
					event.preventDefault();
				}

				// 跟手位移 + 边界阻尼（首页右滑/末页左滑有橡皮筋阻力）
				const base = -this.curTabIndex * this.windowWidth;
				const min = -(this.tabValue.length - 1) * this.windowWidth;
				const max = 0;
				const dragX = touch.clientX - this.dragLockX;
				let target = this.dragBaseOffset + dragX;
				if (target > max) {
					target = max + (target - max) * EDGE_RESISTANCE;
				} else if (target < min) {
					target = min + (target - min) * EDGE_RESISTANCE;
				}
				this.dragOffset = target - base;

				// 记录速度采样
				this.moveSamples.push({ x: touch.clientX, t: Date.now() });
				if (this.moveSamples.length > 6) {
					this.moveSamples.shift();
				}
			},
			onTouchEnd() {
				clearTimeout(this.Loop);
				if (this.lockedDirection === 'x') {
					this.settleSwipe();
				}
				this.resetTouchState();
			},
			onTouchCancel() {
				clearTimeout(this.Loop);
				if (this.lockedDirection === 'x') {
					// 手势被系统打断：回弹到当前面板
					this.isSwiping = false;
					this.dragOffset = 0;
					this.moveSamples = [];
				}
				this.resetTouchState();
			},
			resetTouchState() {
				this.touchActive = false;
				this.touchStartX = null;
				this.touchStartY = null;
				this.lockedDirection = null;
				this.hasMoved = false;
			},
			// 松手后根据位移与速度决定吸附目标
			settleSwipe() {
				const dx = this.dragOffset; // 相对当前面板的位移（边界处已含阻尼）
				const vx = this.computeVelocity();
				const lastIndex = this.tabValue.length - 1;
				const distanceThreshold = this.windowWidth * SETTLE_RATIO;
				let target = this.curTabIndex;

				if (dx < -distanceThreshold || (dx < -FLICK_DISTANCE && vx < -FLICK_VELOCITY)) {
					target = this.curTabIndex + 1;
				} else if (dx > distanceThreshold || (dx > FLICK_DISTANCE && vx > FLICK_VELOCITY)) {
					target = this.curTabIndex - 1;
				}
				target = Math.max(0, Math.min(lastIndex, target));

				// 先恢复过渡动画，再变更偏移：轨道从当前位置平滑吸附到目标面板
				this.isSwiping = false;
				this.dragOffset = 0;
				this.moveSamples = [];
				this.lastSwipeEndTime = Date.now();

				if (target !== this.curTabIndex) {
					this.commitTab(target);
				}
			},
			computeVelocity() {
				const samples = this.moveSamples;
				if (!samples || samples.length < 2) return 0;
				const last = samples[samples.length - 1];
				let first = samples[0];
				for (let i = samples.length - 2; i >= 0; i--) {
					if (last.t - samples[i].t >= 30) {
						first = samples[i];
						break;
					}
				}
				const dt = last.t - first.t;
				if (dt <= 0) return 0;
				return (last.x - first.x) / dt; // px/ms
			},
			// 读取轨道当前视觉偏移（用于打断吸附动画时无缝接管）
			getTrackCurrentOffset() {
				const el = this.$refs.trackDom;
				if (!el || typeof window === 'undefined' || !window.getComputedStyle) {
					return -this.curTabIndex * this.windowWidth;
				}
				const st = window.getComputedStyle(el);
				if (!st || !st.transform || st.transform === 'none') {
					return -this.curTabIndex * this.windowWidth;
				}
				const match = st.transform.match(/matrix\(([^)]+)\)/);
				if (!match) return -this.curTabIndex * this.windowWidth;
				const parts = match[1].split(',').map(v => parseFloat(v));
				return parts.length >= 6 ? parts[4] : -this.curTabIndex * this.windowWidth;
			},
			// ---------- 书架数据 ----------
			// 检查书籍更新（books 为待检查列表，不直接读取组件状态，
			// 以便在局部数据上完成整套刷新后再一次性赋值）
			async checkBooksUpdates(books) {
				if (this.isOffline) return

				try {
					const booksToCheck = []

					for (const book of books) {
						const localArticles = await articleDB.articles
							.where('novel_id')
							.equals(book.novel_id)
							.toArray()

						let localLatestChapter = 0
						if (localArticles.length > 0) {
							localLatestChapter = Math.max(...localArticles.map(a => a.article_chapter || 0))
						}

						booksToCheck.push({
							novel_id: book.novel_id,
							latest_chapter: localLatestChapter
						})
					}

					if (booksToCheck.length === 0) return

					const response = await axios.get(this.$baseUrl + '/library/check_novel_updates_batch', {
						params: {
							books: JSON.stringify(booksToCheck)
						}
					})

					if (response.data && response.data.updates) {
						response.data.updates.forEach(update => {
							if (update.has_updates) {
								this.updateInfo.set(update.novel_id, {
									new_chapters_count: update.new_chapters_count,
									has_updates: true,
									latest_update_time: update.latest_update_time
								})
							}
						})
					}
				} catch (error) {
					console.error('检查书籍更新失败:', error)
				}
			},
			async getLikedBooks(showLoading = false){
				if (this.tabLoading[0]) return;
				this.tabLoading[0] = true;
				if (showLoading) {
					uni.showLoading({
						title: '努力加载中'
					});
				}
				if (this.$isFromLogin) {
					this.$isFromLogin = false;
					this.tabLoading[0] = false;
					if (showLoading) uni.hideLoading();
					uni.switchTab({
						url: '../library'
					})
					return;
				}

				// 清空更新信息
				this.updateInfo = new Map();

				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;

				try {
					const res = await axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer " + tk
						}
					});

					// 检查书籍更新（基于本次拉取的数据）
					await this.checkBooksUpdates(res.data);

					// 加工与排序全部在局部变量上完成，最后只做一次赋值：
					// 静默刷新时不再出现“先赋原始数据、角标消失、再排序回填”的中间态，
					// 数据无变化时零 DOM 变化，切回收藏不再闪动
					let books = res.data.map(book => {
						return {
							...book,
							updateInfo: this.updateInfo.get(book.novel_id)
						};
					});

					// 按更新时间排序（有更新的在前，更新时间越新越靠前）
					books.sort(function(item1, item2) {
						const item1HasUpdate = item1.updateInfo && item1.updateInfo.has_updates;
						const item2HasUpdate = item2.updateInfo && item2.updateInfo.has_updates;

						// 有更新的书籍优先
						if (item1HasUpdate && !item2HasUpdate) return -1;
						if (!item1HasUpdate && item2HasUpdate) return 1;

						// 都有更新或都没更新时，按更新时间排序
						if (item1HasUpdate && item2HasUpdate) {
							const time1 = item1.updateInfo.latest_update_time ? new Date(item1.updateInfo.latest_update_time) : new Date(0);
							const time2 = item2.updateInfo.latest_update_time ? new Date(item2.updateInfo.latest_update_time) : new Date(0);
							return time2 - time1;
						} else {
							return (Date.parse(item2.update_time) - Date.parse(item1.update_time));
						}
					});

					this.likedBooksAll = books;
					this.tabLoaded[0] = true;
					window.localStorage.setItem("LogHomeLikedBooks", JSON.stringify(res.data));

					// 预加载“历史”书架，保证滑动切换时内容即时可见
					if (!this.tabLoaded[1] && !this.tabLoading[1]) {
						this.getHistoryBooks(false);
					}
				} catch (error) {
					console.log(error);
					if (error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token');
						this.$isFromLogin = true;
						uni.navigateTo({
							url: '../users/login?msg=' + 'unAuthorized'
						});
					} else {
						//获取本地数据
						this.isOffline = true;
						let localData = window.localStorage.getItem("LogHomeLikedBooks");
						if (localData) {
							this.likedBooksAll = JSON.parse(localData);
							this.tabLoaded[0] = true;
						}
					}
				} finally {
					this.tabLoading[0] = false;
					if (showLoading) uni.hideLoading();
				}
			},
			getHistoryBooks(showLoading = false){
				if (this.tabLoading[1]) return;
				this.tabLoading[1] = true;
				if (showLoading) {
					uni.showLoading({
						title: '努力加载中'
					});
				}
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				if (!tk) {
					let readerHistory = JSON.parse(window.localStorage.getItem("loghomeReaderHistory"));
					if(readerHistory != null){
						readerHistory.reverse();
						this.historyBooksAll = readerHistory;
						this.tabLoaded[1] = true;
					}
					this.tabLoading[1] = false;
					if (showLoading) uni.hideLoading();
					return;
				}

				axios.get(this.$baseUrl + '/library/reading_history', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}).then((res) => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.historyBooksAll = res.data;
						this.tabLoaded[1] = true;
						window.localStorage.setItem("loghomeReaderHistory", JSON.stringify(res.data));
						return;
					}

					let readerHistory = JSON.parse(window.localStorage.getItem("loghomeReaderHistory"));
					if(readerHistory != null){
						readerHistory.reverse();
						this.historyBooksAll = readerHistory;
						this.tabLoaded[1] = true;
					}
				}).catch((error) => {
					if (error && error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token');
					}
					let readerHistory = JSON.parse(window.localStorage.getItem("loghomeReaderHistory"));
					if(readerHistory != null){
						readerHistory.reverse();
						this.historyBooksAll = readerHistory;
						this.tabLoaded[1] = true;
					}
				}).then(() => {
					this.tabLoading[1] = false;
					if (showLoading) uni.hideLoading();
				});
			},
			goBack() {
				uni.navigateBack();
			}
		},
		onLoad() {
			// 页面初始化时加载当前tab的数据
			this.loadTabData(this.curTabIndex);
			// 屏幕宽度变化（旋转/分屏）时同步面板宽度
			this._onResize = () => {
				try {
					this.windowWidth = uni.getSystemInfoSync().windowWidth || this.windowWidth;
				} catch (e) {}
			};
			if (uni.onWindowResize) {
				uni.onWindowResize(this._onResize);
			}
		},
		onShow() {
			// 页面显示时静默刷新当前tab数据（首次onShow由onLoad负责）
			if (this.hasLoadedOnce) {
				this.loadTabData(this.curTabIndex);
			}
			this.hasLoadedOnce = true;
		},
		onUnload() {
			clearTimeout(this.Loop);
			clearTimeout(this.refreshTimers[0]);
			clearTimeout(this.refreshTimers[1]);
			if (uni.offWindowResize && this._onResize) {
				uni.offWindowResize(this._onResize);
			}
		},
		onNavigationBarButtonTap() {
			this.gotoManage()
		}
	}
</script>

<style scoped lang="scss">
	.content {
		background-color: #f2f2f2;
		font-size: 30rpx;
		/* 顶部固定 + 独立滚动区：tabBar/searchBar 常驻，书格列表在 viewport 内滚动 */
		display: flex;
		flex-direction: column;
		height: 100vh;
		box-sizing: border-box;
		overflow: hidden;
		&.dark-mode{
			background-color: #1E1E1E;
		}

		div.tabBar {
			position: relative;
			z-index: 10;
			top: 0;
			left: 0;
			margin: 0 0rpx;
			padding: 10rpx 0;
			padding-top: calc(10rpx + var(--loghome-safe-top, 0px));
			background-color: rgb(255, 255, 255);
			display: flex;
			align-items: center;
			box-shadow:
				0px 0px 2.2px rgba(0, 0, 0, 0.02),
				0px 0px 5.3px rgba(0, 0, 0, 0.028),
				0px 0px 10px rgba(0, 0, 0, 0.035),
				0px 0px 17.9px rgba(0, 0, 0, 0.042),
				0px 0px 33.4px rgba(0, 0, 0, 0.05),
				0px 0px 80px rgba(0, 0, 0, 0.07);
			height: 75rpx;

			.backBtn{
				margin: 0 10rpx;
			}

			&.dark-mode{
				background-color: #1E1E1E;
			}
		}

		div.tabBarUnder {
			opacity: 0;
			margin: 0 0rpx;
			padding-top: 5rpx;
			padding-top: calc(10rpx + var(--loghome-safe-top, 0px));
			padding-bottom: 5rpx;
			background-color: rgb(255, 255, 255);
			height: 75rpx;
		}
	}

	/* 书架滑动容器：flex:1 占满剩余高度，纵向独立滚动，横向手势完全由本页接管 */
	.bookcase-viewport {
		width: 100%;
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		touch-action: pan-y;
		-webkit-user-select: none;
		user-select: none;
		-webkit-touch-callout: none;

		&.is-dragging {
			cursor: grabbing;
		}
	}

	/* 轨道：双面板并排，位移由 trackStyle 控制（translate3d 走 GPU 合成） */
	.bookcase-track {
		display: flex;
		align-items: flex-start;
		width: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.bookcase-pane {
		flex: 0 0 100%;
		min-width: 100%;
		align-self: flex-start;
	}

	.bookcase {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-flow: wrap;
		padding: 0 20rpx;
		padding-bottom: 40rpx;
	}

	div.searchBar {
		margin: 0 20rpx;
		padding-top: 20rpx;
	}

	div.underBar {
		height: 150rpx
	}
</style>
