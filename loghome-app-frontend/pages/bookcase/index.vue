<template>
	<view class="content" v-dark
		:style="{'--statusBarHeight': 0 + 'px'}">
		<!-- <div class="tabBarUnder">
			<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex="changeTab" :textColor="$store.state.isDarkMode ? '#ffffff' : '#2d2d2d'"/>
		</div> -->
		<div class="tabBar" v-dark>
			<uni-icons type="left" size="27" color="310000" class="backBtn" @click="goBack"/>
			<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex="changeTab" :textColor="$store.state.isDarkMode ? '#ffffff' : '#2d2d2d'"
				ref="tabDom" scrollWidth="calc(100vw - 30rpx)" :underBarBias="-35"/>
		</div>
		<div class="searchBar">
			<uni-search-bar :bgColor="$store.state.isDarkMode ? '#2C2C2C' : 'rgb(211,211,211)'" :radius="5" @input="searchBookCase" placeholder="搜索书架"
				cancelButton="none">
				<img src="../../static/icons/icon_search.png" alt="" slot="searchIcon" style="height:25px;"/>
				<img src="../../static/icons/icon_r_x.png" alt="" slot="clearIcon" style="height:20px;"/>
			</uni-search-bar>
		</div>
		<div class="bookcase" @touchstart="touchstart($event)" @touchmove="touchmove($event)" @touchend="touchend" :class="{'fade-out': isTabSwitching}">
			<bookInCase v-for="item in booksOnShow" :bookName="item.name" :picUrl="item.picUrl" :updateInfo="item.updateInfo" :key="item.novel_id"
				@click.native="readBook(item.novel_id)"></bookInCase>
		</div>
		<div class="underBar"></div>
	</view>
</template>

<script>
	import bookInCase from '../../components/book_in_case.vue'
	import uniSearchBar from '../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'
	import uniNavBar from '../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	import axios from 'axios'
	import { articleDB } from '../../lib/db.js'
	export default {
		components: {
			bookInCase,
			uniSearchBar,
			uniNavBar
		},
		methods: {
			changeTab(value) {
				if (this.curTabIndex !== value) {
					// 添加切换动画
					this.isTabSwitching = true;
					
					// 延迟切换，等待淡出动画完成
					setTimeout(() => {
						this.curTabIndex = value;
						if(this.tabValue[value] == "收藏"){
							this.getLikedBooks();
						} else if(this.tabValue[value] == "历史") {
							this.getHistoryBooks();
						}
						
						// 淡入动画
						setTimeout(() => {
							this.isTabSwitching = false;
						}, 50);
					}, 150);
				}
			},
			searchBookCase(e) {
				if (e == "") {
					this.booksOnShow = this.booksAll;
				} else {
					this.booksOnShow = [];
					this.booksAll.forEach(element => {
						if (element.name.indexOf(e) != -1) {
							this.booksOnShow.push(element);
						}
					})
				}
				this.trimBookOnShow();
			},
			trimBookOnShow() {
				for (let i = this.booksOnShow.length; i < Math.max(9, Math.ceil(this.booksOnShow.length / 3) * 3); i++) {
					this.booksOnShow.push({
						name: "",
						picUrl: "",
						novel_id: -1 * Math.floor(Math.random() * 2147483647)
					})
				}
			},
			async readBook(novel_id) {
				let _this = this;
				if (novel_id > 0) {
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
							uni.navigateTo({
								url: '../readers/newReader/article?id=' + articles[history].article_id + '&Id=' + novel_id
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
				}
			},
			gotoManage() {
				uni.navigateTo({
					url: './manage'
				});
			},
			touchstart(event) {
				// 记录触摸开始位置
				this.touchStartX = event.touches[0].clientX;
				this.touchStartY = event.touches[0].clientY;
				this.touchStartTime = new Date().getTime();
				
				let that = this;
				clearInterval(this.Loop); // 再次清空定时器，防止重复注册定时器
				this.Loop = setTimeout(function() {
					// 长按时间达到，但需要检查是否有明显位移
					if (!that.hasMoved) {
						that.gotoManage();
						if(that.jsBridge && that.jsBridge.inApp){
							// that.jsBridge.vibrate();
						}
					}
					that.touchend();
				}.bind(this), 500);
				
				// 初始化移动标志
				this.hasMoved = false;
			},
			touchmove(event) {
				if (!this.touchStartX || !this.touchStartY) return;
				
				// 计算位移距离
				const moveX = event.touches[0].clientX - this.touchStartX;
				const moveY = event.touches[0].clientY - this.touchStartY;
				
				// 计算位移距离的绝对值
				const absX = Math.abs(moveX);
				const absY = Math.abs(moveY);
				
				// 如果位移超过阈值，标记为已移动
				const threshold = 10; // 10像素的移动阈值
				if (absX > threshold || absY > threshold) {
					this.hasMoved = true;
					clearInterval(this.Loop); // 清除长按定时器
				}
				
				// 存储当前移动的位置，用于手势结束时判断
				this.touchCurrentX = event.touches[0].clientX;
			},
			touchend(event) {
				clearInterval(this.Loop);
				
				// 检测是否是水平滑动切换tab
				if (this.touchStartX && this.touchCurrentX) {
					const swipeDistance = this.touchCurrentX - this.touchStartX;
					const swipeTime = new Date().getTime() - this.touchStartTime;
					
					// 判断是否是有效的水平滑动手势 (距离足够且速度适当)
					if (Math.abs(swipeDistance) > 50 && swipeTime < 300) {
						// 向左滑，切换到下一个tab（如果有）
						if (swipeDistance < 0 && this.curTabIndex < this.tabValue.length - 1) {
							this.switchTabWithAnimation(this.curTabIndex + 1);
						}
						// 向右滑，切换到上一个tab（如果有）
						else if (swipeDistance > 0 && this.curTabIndex > 0) {
							this.switchTabWithAnimation(this.curTabIndex - 1);
						}
					}
				}
				
				// 重置触摸状态
				this.touchStartX = null;
				this.touchStartY = null;
				this.touchCurrentX = null;
				this.hasMoved = false;
			},
			// 带动画效果的切换tab
			switchTabWithAnimation(targetIndex) {
				if (targetIndex !== this.curTabIndex && this.$refs.tabDom) {
					// 调用lgd-tab组件的clickTab方法来切换tab
					this.$refs.tabDom.clickTab(targetIndex);
				}
			},
			// 检查书籍更新
			async checkBooksUpdates() {
				if (this.isOffline) return
				
				try {
					// 为每本收藏的书籍检查更新
					const updatePromises = this.booksAll.map(async (book) => {
						try {
							// 从本地数据库获取该书籍的最新章节
							const localArticles = await articleDB.articles
								.where('novel_id')
								.equals(book.novel_id)
								.toArray()
							
							let localLatestChapter = 0
							if (localArticles.length > 0) {
								localLatestChapter = Math.max(...localArticles.map(a => a.article_chapter || 0))
							}
							
							// 调用后端API检查更新
							const response = await axios.get(this.$baseUrl + '/library/check_novel_updates', {
								params: {
									novel_id: book.novel_id,
									latest_chapter: localLatestChapter
								}
							})
							
							if (response.data && response.data.has_updates) {
								this.updateInfo.set(book.novel_id, {
									new_chapters_count: response.data.new_chapters_count,
									has_updates: true,
									latest_update_time: response.data.latest_update_time
								})
							}
						} catch (error) {
							console.error(`检查书籍 ${book.novel_id} 更新失败:`, error)
						}
					})
					
					await Promise.all(updatePromises)
				} catch (error) {
					console.error('检查书籍更新失败:', error)
				}
			},
			async getLikedBooks(){
				uni.showLoading({
					title: '努力加载中'
				});
				if (this.$isFromLogin) {
					this.$isFromLogin = false;
					uni.switchTab({
						url: '../library'
					})
					return;
				}
				
				// 清空更新信息
				this.updateInfo = new Map();
				
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				let _this = this;
				let trimBookOnShow = this.trimBookOnShow;
				
				try {
					const res = await axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer " + tk
						}
					});
					
					_this.booksAll = res.data;
					
					// 检查书籍更新
					await _this.checkBooksUpdates();
					
					// 为书籍添加更新信息并排序
					_this.booksAll = _this.booksAll.map(book => {
						const updateInfo = _this.updateInfo.get(book.novel_id);
						return {
							...book,
							updateInfo: updateInfo
						};
					});
					
					// 按更新时间排序（有更新的在前，更新时间越新越靠前）
					_this.booksAll.sort(function(item1, item2) {
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
					
					_this.booksOnShow = _this.booksAll;
					trimBookOnShow();
					window.localStorage.setItem("LogHomeLikedBooks", JSON.stringify(res.data));
					
				} catch (error) {
					console.log(error);
					if (error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token');
						_this.$isFromLogin = true;
						uni.navigateTo({
							url: '../users/login?msg=' + 'unAuthorized'
						});
					} else {
						//获取本地数据
						_this.isOffline = true;
						let localData = window.localStorage.getItem("LogHomeLikedBooks");
						if (localData) {
							localData = JSON.parse(localData);
							_this.booksAll = localData;
							_this.booksOnShow = _this.booksAll;
							trimBookOnShow();
						}
					}
				} finally {
					uni.hideLoading();
				}
			},
			getHistoryBooks(){
				uni.showLoading({
					title: '努力加载中'
				});
				let readerHistory = JSON.parse(window.localStorage.getItem("loghomeReaderHistory"));
				if(readerHistory != null){
					readerHistory.reverse();
					this.booksAll = readerHistory;
					this.booksOnShow = this.booksAll;
					this.trimBookOnShow()
				}
				uni.hideLoading();
			},
			goBack() {
				uni.navigateBack();
			}
		},
		onLoad() {
			// 页面初始化时加载数据
			if(this.tabValue[this.curTabIndex] == "收藏"){
				this.getLikedBooks();
			} else if(this.tabValue[this.curTabIndex] == "历史") {
				this.getHistoryBooks();
			}
		},
		onShow() {
			// 页面显示时刷新数据
			this.changeTab(this.curTabIndex);
		},
		data() {
			return {
				booksOnShow: [],
				booksAll: [],
				manageMode: false,
				isOffline: false,
				tabValue: [
					"收藏", "历史"
				],
				curTabIndex: 0,
				firstTab: 0,
				touchStartX: null, // 触摸开始X坐标
				touchStartY: null, // 触摸开始Y坐标
				touchCurrentX: null, // 当前触摸X坐标
				touchStartTime: null, // 触摸开始时间
				hasMoved: false, // 是否已移动
				isTabSwitching: false, // 是否正在切换tab
				tabDom: null,
				updateInfo: new Map() // 存储书籍更新信息
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
		&.dark-mode{
			background-color: #1E1E1E;
		}

		div.tabBar {
			// position: fixed;
			width: 100vw;
			z-index: 10;
			top: 0;
			left: 0;
			margin: 0 0rpx;
			padding: 10rpx 0;
			padding-top: calc(10rpx + var(--statusBarHeight));
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
			padding-top: calc(10rpx + var(--statusBarHeight));
			padding-bottom: 5rpx;
			background-color: rgb(255, 255, 255);
			height: 75rpx;
		}
	}

	.bookcase {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-flow: wrap;
		padding: 0 20rpx;
		padding-bottom: 40rpx;
		transition: opacity 0.3s ease; /* Add transition for content switch */
		
		&.fade-out {
			opacity: 0;
		}
	}

	div.searchBar {
		margin: 0 20rpx;
		padding-top: 20rpx;
	}

	div.underBar {
		height: 150rpx
	}
	
	/* 添加滑动过渡动画 */
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes fadeOut {
		from { opacity: 1; }
		to { opacity: 0; }
	}
</style>
