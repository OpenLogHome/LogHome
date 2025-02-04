<template>
	<view class="content" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<div class="tabBarUnder">
			<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex="changeTab" textColor="#2d2d2d"
				ref="tabs" />
		</div>
		<div class="tabBar">
			<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex="changeTab" textColor="#2d2d2d"
				ref="tabs" />
		</div>
		<div class="searchBar">
			<uni-search-bar bgColor="rgb(211,211,211)" :radius="5" @input="searchBookCase" placeholder="搜索书架"
				cancelButton="none">
				<img src="../../static/icons/icon_search.png" alt="" slot="searchIcon" style="height:25px;"/>
				<img src="../../static/icons/icon_r_x.png" alt="" slot="clearIcon" style="height:20px;"/>
			</uni-search-bar>
		</div>
		<div class="bookcase">
			<bookInCase v-for="item in booksOnShow" :bookName="item.name" :picUrl="item.picUrl" :key="item.novel_id"
				@click.native="readBook(item.novel_id)" @touchstart.native="touchstart()"
				@touchend.native="touchend"></bookInCase>
		</div>
		<div class="underBar"></div>
	</view>
</template>

<script>
	import bookInCase from '../../components/book_in_case.vue'
	import uniSearchBar from '../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'
	import uniNavBar from '../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	import axios from 'axios'
	export default {
		components: {
			bookInCase,
			uniSearchBar,
			uniNavBar
		},
		methods: {
			changeTab(value) {
				this.curTabIndex = value;
				if(this.tabValue[value] == "收藏"){
					this.getLikedBooks();
				} else if(this.tabValue[value] == "历史") {
					this.getHistoryBooks();
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
			readBook(novel_id) {
				let _this = this;
				if (novel_id > 0) {
					if (this.isOffline) {
						//如果是离线，则获取阅读记录、并直接跳转到对应章节。
						let history = 1;
						//本地阅读记录管理
						let readingHistory = window.localStorage.getItem("ReaderHistory_" + novel_id);
						let articles = [];
						if (readingHistory != null) {
							history = readingHistory;
						}
						//开一个IndexedDB数据库事务
						let dbStatus = window.localStorage.getItem("IndexedDB");
						// indexedDB本地缓存文章查询
						if (dbStatus == "enabled") {
							let version = _this.$DBVersion
							let IDBOpenDBRequest = indexedDB.open('LogCommunity', version);
							let db;
							IDBOpenDBRequest.onsuccess = function(e) {

								db = e.target.result;
								// 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
								let transaction = db.transaction('offlineArticleCache', 'readonly');
								// 通过事务来获取IDBObjectStore
								let store = transaction.objectStore('offlineArticleCache');
								var request = store.openCursor();

								request.onsuccess = function(e) {
									var cursor = e.target.result;
									// 如果找到数据了
									if (cursor) {
										var result = cursor.value;
										if (result.novel_id == novel_id) articles.push(result);
										cursor.continue();
									} else {
										console.log(history, articles);
										if (history == 1) {
											uni.navigateTo({
												url: '../readers/newReader/article?id=' + articles[0].article_id
											})
											return;
										} else {
											let toId = articles[0].article_id;
											articles.forEach(item => {
												if (item.article_chapter == history) {
													toId = item.article_id
													return;
												}
											})
											uni.navigateTo({
												url: '../readers/newReader/article?id=' + toId
											})
										}
									}
								}
							}
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
			touchstart() {
				let that = this;
				clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
				this.Loop = setTimeout(function() {
					that.gotoManage();
					that.touchend();
					if(that.jsBridge.inApp && that.jsBridge.inApp){
						// that.jsBridge.vibrate();
					}
				}.bind(this), 500);
			},
			touchend() {
				clearInterval(this.Loop);
			},
			getLikedBooks(){
				uni.showLoading({
					title: '加载中'
				});
				if (this.$isFromLogin) {
					this.$isFromLogin = false;
					uni.switchTab({
						url: '../library'
					})
					return;
				}
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				let _this = this;
				let trimBookOnShow = this.trimBookOnShow;
				axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': "Bearer " + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					_this.booksAll = res.data;
					_this.booksAll.sort(function(item1, item2) {
						return (Date.parse(item2.update_time) - Date.parse(item1.update_time));
					});
					_this.booksOnShow = _this.booksAll;
					trimBookOnShow();
					window.localStorage.setItem("LogHomeLikedBooks", JSON.stringify(res.data));
				}).catch(function(error) {
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
				}).then(function() {
					uni.hideLoading();
				})
			},
			getHistoryBooks(){
				uni.showLoading({
					title: '加载中'
				});
				let readerHistory = JSON.parse(window.localStorage.getItem("loghomeReaderHistory"));
				if(readerHistory != null){
					readerHistory.reverse();
					this.booksAll = readerHistory;
					this.booksOnShow = this.booksAll;
					this.trimBookOnShow()
				}
				uni.hideLoading();
			}
		},
		onShow() {
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
				firstTab: 0
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

		div.tabBar {
			position: fixed;
			width: 100vw;
			z-index: 10;
			top: 0;
			left: 0;
			margin: 0 0rpx;
			padding: 10rpx 0;
			padding-top: calc(10rpx + var(--statusBarHeight));
			background-color: rgb(255, 255, 255);
			display: flex;
			box-shadow:
				0px 0px 2.2px rgba(0, 0, 0, 0.02),
				0px 0px 5.3px rgba(0, 0, 0, 0.028),
				0px 0px 10px rgba(0, 0, 0, 0.035),
				0px 0px 17.9px rgba(0, 0, 0, 0.042),
				0px 0px 33.4px rgba(0, 0, 0, 0.05),
				0px 0px 80px rgba(0, 0, 0, 0.07);
			height: 75rpx;
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

	}

	div.searchBar {
		margin: 0 20rpx;
		padding-top: 20rpx;
	}

	div.underBar {
		height: 150rpx
	}
</style>
