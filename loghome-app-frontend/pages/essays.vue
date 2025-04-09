<template>
	<view class="outer" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<view class="title" :class="topNavStyle.class" :style="topNavStyle.style">
			<view class="flex_col">
				<view class="box1"></view>
				<view class="flex_grow flex_col flex_center tab">
					<view v-for="(item,index) in topNavArr" :key="index" :class="{ 'active':topNavIndex==index }"
						:data-index="index" @tap="changeTopNav">{{item}}</view>
				</view>
				<view class="box1 align_r">
					<el-button 
						:icon="viewMode === 'scroll' ? 'el-icon-s-help' : 'el-icon-s-grid'" 
						circle 
						size="mini" 
						@click="toggleViewMode"
						:title="viewMode === 'scroll' ? '切换到网格视图' : '切换到滚动视图'"
						v-show="books.length > 0 && topNavArr[topNavIndex] == '小说'">
					</el-button>
				</view>
			</view>
		</view>
		<view class="noEssay" v-if="books.length==0" v-show="topNavArr[topNavIndex] == '小说'">
			<img src="../static/images/icon_my_uplotolib.png" alt=""/>
			<p>方块跃然纸上，故事在此生长</p>
			<navigator url="./writers/newEssay">
				<img src="../static/images/icon_my_upload_new.png" alt=""/>
			</navigator>
		</view>

		<!-- 滚动视图模式 -->
		<template v-if="viewMode === 'scroll'">
			<transition name="fade">
				<card-swiper class="swiper" v-if="books.length>0" :list="books" @swiperChange="swiperChange"
					ref="cardSwiper" v-show="topNavArr[topNavIndex] == '小说'"></card-swiper>
			</transition>
			<transition name="fade">
				<view style="padding-top: 20rpx;height: 300px;" class="pageBody" v-if="books.length>0"
					v-show="topNavArr[topNavIndex] == '小说'">
					<book-detail-view 
						v-if="curBook !== -1"
						:book="books[curBook]"
						:worlds="worlds"
						:statistics="novel_statistic"
						:isDrawerMode="viewMode === 'grid'"
						@goto-all-articles="gotoAllArticles"
						@read-novel="readNovel"
						@goto-essay-set="gotoEssaySet"
						@delete-world-novel-asso="deleteWorldNovelAsso"
						@show-book-select="bookSelectDrawer = true"
						@goto-statistics="gotoStatistics"
					></book-detail-view>
					<transition name='fade'>
						<view style="text-align: center;position:relative;" v-if="curBook === -1">
							<img src="../static/dig.png" alt=""
								style="position:absolute;width:70vw;top:-120px;left:50vw;transform: translateX(-50%); z-index:102" />
							<p style="color:#919191; font-weight: bold; font-size:40rpx; margin:20rpx; padding-top:130rpx;">
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
			<view class="bookshelf" v-if="books.length>0" v-show="topNavArr[topNavIndex] == '小说'">
				<div class="book-grid">
					<div v-for="(book, index) in books" :key="book.novel_id" class="book-item" @click="selectBook(index)">
						<img :src="book.picUrl" :alt="book.name" class="book-cover" 
							:onerror="`this.src='${$backupResources.bookCover}'`"/>
						<div class="book-title">{{book.name}}</div>
					</div>
					<div class="book-item new-book" @click="gotoNewEssay">
						+
					</div>
				</div>
			</view>
		</template>

		<transition name="fade">
			<worldPage v-show="topNavArr[topNavIndex] == '世界'" ref="worldPage"></worldPage>
		</transition>
		<!-- 书籍详情抽屉 -->
		<el-drawer 
			:visible.sync="showBookDetail" 
			:with-header="false"
			size="90%"
			:direction="'btt'"
			custom-class="book-detail-wrapper"
			:modal-append-to-body="true">
			<div class="drawer-container">
				<div class="drawer-header">
					<el-button icon="el-icon-close" circle size="medium" @click="showBookDetail = false"
					type="text" style="transform: scale(1.2);"></el-button>
				</div>
				<book-detail-view 
					v-if="curBook !== -1"
					:book="books[curBook]"
					:worlds="worlds"
					:statistics="novel_statistic"
					:isDrawerMode="viewMode === 'grid'"
					@goto-all-articles="gotoAllArticles"
					@read-novel="readNovel"
					@goto-essay-set="gotoEssaySet"
					@delete-world-novel-asso="deleteWorldNovelAsso"
					@show-book-select="bookSelectDrawer = true"
					@goto-statistics="gotoStatistics"
					@goto-world-novel="gotoWorldNovel"
				></book-detail-view>
			</div>
		</el-drawer>

		<el-drawer 
			:visible.sync="bookSelectDrawer" 
			:with-header="false" 
			:direction="'btt'" 
			size="80%"
			class="book-select-drawer"
			custom-class="book-select-wrapper"
			modal-class="book-select-overlay">
			<div class="searchBar" style="position:absolute; background-color: #ffe6b4; width:100%; z-index:100;">
				<uni-search-bar bgColor="#ffffff" :radius="0" @input="searchLibrary" placeholder="搜索全站世界"
					cancelButton="none">
					<img src="../static/icons/icon_search.png" alt="" slot="searchIcon" style="height:25px;width:25px;"/>
					<img src="../static/icons/icon_r_x.png" alt="" slot="clearIcon" style="height:20px;width:20px;"/>
				</uni-search-bar>
			</div>
			<div style="height:52px; width:100%;"></div>
			<navigator v-for="item in [...searchBooks]" :key="item.novel_id" @click="selectWorldBook(item)">
				<div class="books" style="margin:20rpx;">
					<log-image :src="item.picUrl + '?thumbnail=1'" alt=""
						:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
					<div class="bookInfo">
						<div class="world-title">{{item.name}}</div>
						<view class="author">
							<log-image :src="item.avatar_url" alt="" class="auther_avatar"
								onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
							<div class="auther_name">{{item.user_name}}</div>
						</view>
						<div class="description">{{item.content}}</div>
					</div>
				</div>
			</navigator>
		</el-drawer>

	</view>
</template>

<script>
	import cardSwiper from "@/components/helang-cardSwiper/helang-cardSwiper"
	import writerHelper from "@/components/writer_helper"
	import worldPage from '@/components/worldsPage.vue'
	import BookDetailView from '@/components/book-detail-view.vue'
	import axios from 'axios'
	export default {
		data() {
			return {
				viewMode: localStorage.getItem('loghome_essay_view_mode') || 'scroll', // 从本地存储获取上次的视图模式
				showBookDetail: false,
				topNavIndex: 0,
				topNavArr: ['小说', '世界'],
				pageScrollTop: 0, // 页面滚动距离
				books: [],
				curBook: 0,
				novel_statistic: [],
				worlds: [],
				bookSelectDrawer: false, //是否打开书籍选择抽屉
				bookSelectItemIndex: undefined, //即将需要选择书籍的书链item的index
				timer: undefined,
				searchBooks: [], //搜索到的书
				showBookDetailModal: true, //是否打开书籍详情遮罩
			}
		},
		components: {
			cardSwiper,
			writerHelper,
			worldPage,
			BookDetailView
		},
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
				title: '加载中'
			});
			this.refreshPage();
			this.$refs.worldPage.refreshPage();
			//console.log(this.$store.state.user_id);
		},
		computed: {
			topNavStyle() {
				console.log(this.pageScrollTop);
				let r = this.pageScrollTop / 100;
				return {
					"class": r >= 0.85 ? 'style2' : '',
					"style": `background-color: rgba(255, 255, 255, ${r>=1?1:r}); padding-top: ${jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0}`
				}
			}
		},
		onLoad() {

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
			},
			selectBook(index) {
				if (this.viewMode === 'grid') {
					this.curBook = index
					this.showBookDetail = true
					this.swiperChange(index)
				}
			},
			// 顶部导航改变 
			changeTopNav(e) {
				this.topNavIndex = e.currentTarget.dataset.index
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
					this.books = res.data;
					this.$forceUpdate();
					this.$nextTick(() => {
						this.$refs.cardSwiper.reload(this.books);
					})
					window.localStorage.setItem("LogHomeUserEaasy", JSON.stringify(res.data));
					_this.swiperChange(this.curBook);
				}).catch(function(error) {
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
							_this.books = localData;
							_this.$forceUpdate();
						}
					}
				}).then(function() {
					uni.hideLoading();
				})

				this.getMyWorlds();
			},
			swiperChange(e) {
				// console.log("swiperChange");
				this.curBook = e;
				axios.get(this.$baseUrl + '/articles/get_novel_statistics?novel_id=' + this.books[e].novel_id).then((
					res) => {
					this.novel_statistic = res.data;
				}).catch(function(error) {
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
				}).then(function() {
					uni.hideLoading();
				})
				// 获取关联世界
				axios.get(this.$baseUrl + '/world/get_asso_world_by_novel_id?novel_id=' + this.books[e].novel_id).then((
					res) => {
					console.log(res.data);
					this.worlds = res.data;
				}).catch(function(error) {
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
				}).then(function() {
					uni.hideLoading();
				})
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
			//搜索书库，这个方法与library.vue的一致
			searchLibrary(e) {
				clearTimeout(this.timer);
				let _this = this;
				this.timer = setTimeout(() => {
					if (e == "") {
						this.getMyWorlds();
					} else {
						axios.get(_this.$baseUrl + '/world/get_worlds_search?keyword=' + e, {}).then((res) => {
							_this.searchBooks = res.data;
						}).catch(function(error) {
							uni.showToast({
								title: error.toString(),
								icon: 'none',
								duration: 2000
							});
						}).then(function() {
							uni.hideLoading();
						})
					}

				}, 500)
			},
			deleteWorldNovelAsso(world_id) {
				let _this = this;
				uni.showActionSheet({
					itemList: ["取消关联设定"],
					success: function(res) {
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
							}).catch(function(error) {
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
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			getMyWorlds() {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/world/get_my_worlds', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					_this.searchBooks = res.data;
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {
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
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(() => {
					uni.hideLoading();
					this.refreshPage();
				})
				this.bookSelectDrawer = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "lib/global.scss";

	view.outer {
		height: calc(100%);
		background-color: #ffffff !important;
	}

	/* 标题栏 */
	.title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
		padding-top: var(--status-bar-height);
		z-index: 10;
		color: rgba(0, 0, 0, 0.8);

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
		}
	}

	.pageBody {

		.bodyView {
			.bookTitle {
				font-size: 50rpx;
				font-weight: bold;
			}

			.bookDescription {
				font-size: 28rpx;
				padding-left: 50rpx;
				padding-right: 50rpx;
				padding-top: 20rpx;
				text-align: left;
				white-space: pre-wrap;
				text-align: center;

				span {
					margin: 0 10rpx;
				}
			}

			.buttons {
				width: 100vw;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;

				.button {
					height: 40px;
					width: 40vw;
					margin-top: 15px;
					margin-left: 10px;
					margin-right: 10px;
					font-size: 16px;
					font-weight: bold;
					line-height: 38px;
					border-radius: 5px;
					color: #ffffff;
					background-color: rgb(180, 111, 88);
				}

				.button.long {
					width: calc(80vw + 20px);
				}

				.button:active {
					background-color: #b46f58;
				}
			}

			div.statistic-box {
				margin: 0rpx 0rpx;
				box-sizing: border-box;
				background-color: white;

				.head {
					margin: 0rpx 50rpx;
					padding: 35rpx 0;
					height: 30rpx;

					div.box-title {
						float: left;
						font-size: 34rpx;
						font-weight: bold;
						color: #2d2d2d;
						height: 30rpx;
					}

					div.more {
						float: right;
						display: flex;
						margin-top: 5rpx;

						p {
							margin: 0rpx;
							color: #2d2d2d;
							font-size: 26rpx;
							line-height: 44rpx;
							height: 44rpx;
						}

						.moreImg {
							height: 30rpx;
							width: 30rpx;
							margin-right: 8rpx;
						}
					}
				}

				.statistics-body {
					display: flex;
					margin: 0 40rpx;
					flex-wrap: wrap;

					.card {
						margin: 10rpx 10rpx;
						padding: 25rpx;
						width: calc(50vw - 40rpx - 20rpx - 50rpx);
						background-color: #00000009;
						text-align: left;

						.numeral {
							font-size: 40rpx;
							margin-bottom: 10rpx;

							span.change {
								font-size: 28rpx;
								color: #FF9B17;
								margin-left: 10rpx;
							}
						}

						.name {
							font-size: 28rpx;
							font-weight: bold;
							color: #2d2d2d;
						}
					}
				}

				.statistics-body.no-statistic {
					justify-content: center;
				}

				.addButton {
					width: calc(100vw - 90rpx);
					border: 4rpx solid #4c4c4c55;
					border-radius: 10rpx;
					height: 150rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #4c4c4cee;
					transition: all .3s;
					border-style: dashed;
					font-size: 30rpx;
					margin: 15rpx 40rpx 0 40rpx;
				}

				.addButton:active {
					transform: scale(0.95);
					background-color: #4c4c4c22;
				}
			}
		}
	}

	.books {
		height: 260rpx;
		width: calc(100vw - 65rpx);
		margin: 0 30rpx;
		display: flex;
		background-color: rgb(255, 255, 255);
		border-radius: 10rpx;


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
		padding-top: calc(44px + var(--statusBarHeight) + 20rpx); // 标题栏高度 + 状态栏高度 + 额外间距
		// background-color: white;
		background: linear-gradient(to bottom, rgb(255, 248, 234) 0%, rgb(255, 248, 234) 30%, rgb(255, 255, 255) 100%);
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
					box-shadow: 0 2px 4px rgba(0,0,0,0.1);
				}
				
				.book-title {
					margin-top: 10rpx;
					font-size: 24rpx;
					text-align: center;
					width: 200rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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
					
					&:active {
						transform: scale(0.95);
						background-color: #4c4c4c11;
						border-color: #4c4c4c55;
						color: #4c4c4c88;
					}
				}
			}
			
			.book-item:active{
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
		}
	}

	.el-drawer {
		&.book-select-drawer {
			z-index: 3100 !important;
		}
	}

	:deep(.el-drawer__wrapper) {
		&.book-select-wrapper {
			z-index: 3100 !important;
		}
	}

	:deep(.el-overlay) {
		&.book-select-overlay {
			z-index: 3000 !important;
		}
	}

	.el-drawer {
		&.book-select-drawer {
			z-index: 3100 !important;
		}
	}
</style>