<template>
	<view class="content" v-dark>
		<div class="searchBar" :class="{ top: scrollTop <= 5 }" v-dark>
			<div class="search-input-wrapper" @tap="navigateToSearch">
				<uni-icons type="search" size="18" color="#999"></uni-icons>
				<view class="search-input-placeholder">搜索书籍、圈子、帖子、用户</view>
			</div>
			<uni-icons type="chat" size="26" :color="$store.state.isDarkMode ? '#e5e5e5' : '#2d2d2d'"
				class="messageIcon" @click="gotoMessage"></uni-icons>
		</div>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" style="margin-top: 105rpx;" @down="downCallback"
			@up="upCallback" @scroll="onPageScroll" :fixed="false" :height="'100%'">
			<div class="appRecommendInfo" @click="gotoUpdate" v-show="showAppRecommendInfo == 'android'">
				<div class="left">
					<view class="desc">
						推荐您使用 <span style="color: rgb(234, 112, 52);">原木社区 APP</span>
					</view>
					<view class="desc">
						综合体验<span style="color: rgb(234, 112, 52);">远胜</span>浏览器直接访问 <uni-icons type="right" size="15"></uni-icons>
					</view>
				</div>
				<div class="right">
					<img src="/static/apprecommend/android.png" alt="">
				</div>
			</div>
			<HorizontalTags ref="HorizontalTagsRef"></HorizontalTags>
			<bookshelfHorizontal ref="bookshelfHorizontalRef"></bookshelfHorizontal>
			<div class="card" v-for="(item, index) in collections" v-show="keyword.length == 0" v-dark v-if="index != 1">
				<div class="head" @click="gotoCollections(item.collection_title)">
					<div class="title">
						<p>
							{{ item.collection_title }}
						</p>
						<div class="lightLine" v-dark></div>
						<log-image :src="item.icon" alt="" class="icon" v-show="item.icon != ''" />
					</div>
					<div class="more">
						<uni-icons type="right" size="20"
							:color="$store.state.isDarkMode ? '#b8b8b8' : 'rgb(142,130,109)'"></uni-icons>
					</div>
				</div>

				<div class="novels-slide" v-if="item.collection_type == 'slide'" style="min-height: 200rpx;">
					<transition-group name="fade" class="transition" type="in-out">
						<bookInCase v-for="novel in item['novels']" :bookName="novel.name" :picUrl="novel.picUrl"
							:key="novel.novel_id" @click.native="readBook(novel.novel_id)"></bookInCase>
					</transition-group>
				</div>
				<div class="novel-lists" v-else-if="item.collection_type == 'cards'" style="min-height: 200rpx;">
					<transition-group name="fade" class="transition" type="in-out">
						<div v-for="novel in item['novels'].slice(0, 4)" :key="novel.novel_id">
							<navigator :url="'./readers/bookInfo?id=' + novel.novel_id" open-type="navigate"
								class="books" v-dark>
								<log-image :src="novel.picUrl + '?thumbnail=1'" alt=""
									:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`"
									style="border-radius: 10rpx; transform:scale(.90)" />
								<div class="bookInfo" style="margin-left:10rpx;">
									<div class="title">
										{{ novel.name }}
										<el-tag type="warning" v-show="novel.novel_type == 'world'" effect="dark"
											style="margin-left:10rpx; transform:translateY(-5rpx)"
											size="mini">世界设定</el-tag>
									</div>
									<view class="author">
										<log-image :src="novel.avatar_url" alt="" class="auther_avatar"
											onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
										<div class="auther_name">{{ novel.user_name }}</div>
									</view>
									<div class="description">{{ novel.content }}</div>
								</div>
							</navigator>
						</div>
					</transition-group>
				</div>

				<div class="dense-card-outer-container" v-else-if="item.collection_type == 'dense_card'"
					style="min-height: 200rpx;">
					<swiper class="dense-card-swiper" :indicator-dots="false" :autoplay="false" :interval="3000"
						:duration="500" :circular="true" indicator-active-color="#FFD700"
						indicator-color="rgba(255, 255, 255, 0.4)">
						<swiper-item v-for="page in 2" :key="'page-' + page" class="dense-card-swiper-item">
							<div class="dense-card-page">
								<div class="dense-card-column">
									<div class="dense-card-item"
										v-for="(novel, index) in item['novels'].slice((page - 1) * 6, (page - 1) * 6 + 3)"
										:key="novel.novel_id" @click="readBook(novel.novel_id)">
										<div class="dense-card-rank" :class="{ 'rank-top': (page - 1) * 6 + index < 3 }">
											{{ (page - 1) * 6 + index + 1 }}</div>
										<log-image :src="novel.picUrl + '?thumbnail=1'" alt="" class="dense-card-cover"
											:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`" />
										<div class="dense-card-info">
											<div class="dense-card-title">
												{{ novel.name }}
											</div>
											<div class="dense-card-author">{{ novel.user_name }}</div>
										</div>
									</div>
								</div>
								<div class="dense-card-column">
									<div class="dense-card-item"
										v-for="(novel, index) in item['novels'].slice((page - 1) * 6 + 3, page * 6)"
										:key="novel.novel_id" @click="readBook(novel.novel_id)">
										<div class="dense-card-rank" :class="{ 'rank-top': (page - 1) * 6 + 3 + index < 3 }">
											{{ (page - 1) * 6 + 3 + index + 1 }}</div>
										<log-image :src="novel.picUrl + '?thumbnail=1'" alt="" class="dense-card-cover"
											:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`" />
										<div class="dense-card-info">
											<div class="dense-card-title">
												{{ novel.name }}
											</div>
											<div class="dense-card-author">{{ novel.user_name }}</div>
										</div>
									</div>
								</div>
							</div>
						</swiper-item>
					</swiper>
				</div>

			</div>
			<!-- 使用Banner组件 -->
			<banner page="library" v-else v-show="keyword.length == 0" />

			<div v-for="item in [...searchBooks, ...books]" :key="item.book_id">
				<navigator :url="'./readers/bookInfo?id=' + item.novel_id" open-type="navigate" class="books" v-dark>
					<log-image :src="item.picUrl + '?thumbnail=1'" alt=""
						:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`" />
					<div class="bookInfo">
						<div class="title">
							{{ item.name }}
						</div>
						<view class="author">
							<log-image :src="item.auther_avatar" alt="" class="auther_avatar"
								onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
							<div class="auther_name">{{ item.author_name }}</div>
						</view>
						<div class="description">{{ item.content }}</div>
					</div>
				</navigator>
			</div>

			<div class="underBar"></div>
		</mescroll-body>
	</view>
</template>

<script>
import axios from 'axios'
import bookInCase from '../components/book_in_case.vue'
import popup from "@/components/ge-popup.vue"
import bookshelfHorizontal from "@/components/bookshelf-horizontal.vue"
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import darkModeMixin from '@/mixins/dark-mode.js'
import banner from '@/components/banner.vue'
import HorizontalTags from '../components/horizontal-tags.vue';

export default {
	components: {
		bookInCase, popup, banner, bookshelfHorizontal, HorizontalTags
	},
	mixins: [MescrollMixin, darkModeMixin], // 使用mixin
	data() {
		return {
			scrollTop: 0,
			books: [],
			collections: [],
			timer: undefined,
			searchBooks: [],
			keyword: "",
			appUpdate: {
				hasUpdate: false,
				version: '1.0',
				desc: '1.更新内容更新内容 <br/> 2.更新内容更新内容 <br/>2.更新内容更新内容',
				update_url: ""
			},
			showAppRecommendInfo: "none"
		}
	},
	onLoad() {
	},
	onShow() {
		this.reloadComponents();
		this.checkSystem();
	},
	methods: {
		reloadComponents() {
			if (this.$refs.bookshelfHorizontalRef) this.$refs.bookshelfHorizontalRef.loadBooks();
			if (this.$refs.HorizontalTagsRef) this.$refs.HorizontalTagsRef.loadTags();
		},
		onPageScroll(ev) {
			this.scrollTop = ev.scrollTop;
		},
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		downCallback() {
			this.mescroll.resetUpScroll();
			this.refreshPage();
			this.checkUpdate();
			this.checkAncientVersion();
			this.refreshRecommends();
			this.this.reloadComponents();
			this.books = [];
			// if(window.jsBridge.inApp){
			// 	window.jsBridge.vibrate();
			// }
		},
		upCallback() {
			this.getMoreNovels();
		},
		//刷新页面
		async refreshPage() {
			// 刷新推荐内容
			setTimeout(() => {
				this.mescroll.endSuccess();
			}, 1000);
		},
		async getMoreNovels() {
			//获取更多小说
			axios.get(this.$baseUrl + '/library/get_novels_all', {}).then((res) => {
				this.books = [...this.books, ...res.data];
				setTimeout(() => {
					this.mescroll.endSuccess();
				}, 1000);
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
				this.mescroll.endErr();
			}).then(function () {
				uni.hideLoading();
			})
		},

		//响应进入书籍详情页面事件
		readBook(novel_id) {
			if (novel_id > 0) {
				uni.navigateTo({
					url: './readers/bookInfo?id=' + novel_id
				})
			}
		},
		//刷新推荐
		refreshRecommends() {
			// 获取所有推荐集合
			let _this = this;
			axios.get(this.$baseUrl + '/library/recommand/get_library_collections', {}).then((res) => {
				_this.collections = res.data;
				//获取每个推荐集合中的推荐作品
				for (let item of _this.collections) {
					_this.$set(item, 'novels', [])
					axios.get(_this.$baseUrl
						+ '/library/recommand/get_library_recommend_titles?title='
						+ item.collection_title + "&page=1&amount=10", {}).then((res) => {
							_this.$set(item, 'novels', res.data);
						}).catch(function (error) {
							uni.showToast({
								title: error.toString(),
								icon: 'none',
								duration: 2000
							});
						}).then(function () {

						})
				}
			}).catch(function (error) {
				uni.switchTab({
					url: './bookcase/index'
				})
				uni.showToast({
					title: "离线模式",
					icon: 'none',
					duration: 2000
				});
			}).then(function () {

			})
		},
		// 跳转到搜索页面
		navigateToSearch() {
			uni.navigateTo({
				url: '/pages/community/search?origin=library'
			});
		},

		// 搜索图书馆 - 保留此函数以防其他地方调用
		searchLibrary(e) {
			clearTimeout(this.timer);
			let _this = this;
			this.keyword = e;
			// 这里使用延时节流
			this.timer = setTimeout(() => {
				axios.get(_this.$baseUrl + '/library/get_novels_search?keyword=' + e, {}).then((res) => {
					_this.searchBooks = res.data;
					if (!isNaN(parseInt(_this.keyword)) && res.data.length != 0) {
						_this.books = [];
					}
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function () {
					uni.hideLoading();
				})
			}, 500)
		},
		//前往推荐集合的详情界面
		gotoCollections(title) {
			uni.navigateTo({
				url: './readers/collections?title=' + title
			})
		},
		//检查更新
		checkUpdate() {
			let isApp = window.jsBridge && window.jsBridge.inApp;
			if (!isApp) {
				console.log("not in app")
				return;
			}
			let appVersion = this.$store.state.appVersion;
			axios.get(this.$baseUrl + '/app/get_app_update', {}).then((res) => {
				const update = res.data[0];
				// console.error(update.version_number, String(appVersion))
				if (update.version_number > appVersion) {
					// 直接跳转到update页面，由update页面自己获取数据
					uni.navigateTo({
						url: '/pages/update'
					});
				}
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			}).then(function () {
				uni.hideLoading();
			})
		},
		gotoMessage() {
			uni.navigateTo({
				url: "./community/message"
			})
		},
		//通过某些技术手段（如版本特性）检查是否是超远古版本
		checkAncientVersion() {
			//检查是否内测期间的超远古热更新版本
			if (sessionStorage.getItem("appVersion") != undefined) {
				uni.navigateTo({
					url: "./apps/badVersion"
				})
			}
		},
		checkSystem() {
			let isApp = window.jsBridge && window.jsBridge.inApp;
			if (!isApp) {
				// 检测是安卓系统还是iOS系统
				let userAgent = navigator.userAgent || navigator.vendor || window.opera;
				if (/android/i.test(userAgent)) {
					this.showAppRecommendInfo = "android"
				} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
					// iOS系统
					this.showAppRecommendInfo = "ios"
				} else {
					// 其他系统
					this.showAppRecommendInfo = "none"
				}
			}
			return 'app';
		},
		gotoUpdate() {
			uni.navigateTo({
				url: "/pages/update"
			})
		}
	}
}
</script>

<style scoped lang="scss">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-flow: wrap;
	background-color: #fefefe;
	width: 100vw;

	&.dark-mode {
		background-color: var(--background-color-secondary);
	}

	div.searchBar {
		position: fixed;
		width: calc(100vw - 10rpx);
		z-index: 10;
		top: 0;
		left: 0;
		margin: 0 0rpx;
		padding-right: 10rpx;
		padding-top: calc(5rpx + var(--statusBarHeight));
		padding-bottom: 5rpx;
		background-color: rgb(255, 255, 255);
		display: flex;
		align-items: center;
		height: 110rpx;
		box-shadow:
			0px 0px 2.2px rgba(0, 0, 0, 0.02),
			0px 0px 5.3px rgba(0, 0, 0, 0.028),
			0px 0px 10px rgba(0, 0, 0, 0.035),
			0px 0px 17.9px rgba(0, 0, 0, 0.042),
			0px 0px 33.4px rgba(0, 0, 0, 0.05),
			0px 0px 80px rgba(0, 0, 0, 0.07);

		&.top {
			background-color: #FEFEFE;
			box-shadow: none;
		}

		&.dark-mode {
			background-color: var(--card-background);
		}

		.messageIcon {
			margin: 24rpx 5rpx 20rpx 5rpx;
		}

		.search-input-wrapper {
			flex: 1;
			display: flex;
			align-items: center;
			background-color: #f5f5f5;
			border-radius: 36rpx;
			padding: 0 20rpx;
			height: 72rpx;
			margin-right: 25rpx;
			margin-left: 25rpx;

			.dark-mode & {
				background-color: #333;
			}
		}

		.search-input-placeholder {
			flex: 1;
			height: 72rpx;
			line-height: 72rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
			color: #999;
		}
	}



	div.card {
		margin: 20rpx 0rpx;
		padding: 0 0 0rpx 0;
		box-sizing: border-box;
		// background-color:rgb(255,255,255);

		&.dark-mode {
			background-color: var(--card-background);
		}

		.head {
			margin: 0rpx 25rpx;
			padding: 20rpx 0 20rpx 0;
			height: 45rpx;

			div.title {
				float: left;
				font-size: 35rpx;
				font-weight: bold;
				color: rgb(45, 45, 45);
				margin: 0 0 20rpx 0;
				height: 45rpx;
				position: relative;

				.dark-mode & {
					color: var(--text-color-primary);
				}

				p {
					position: relative;
					z-index: 1;
				}

				.lightLine {
					width: 100%;
					height: 30rpx;
					background-color: rgb(161, 255, 127);
					border-radius: 20rpx;
					position: relative;
					top: -30rpx;
					z-index: 0;

					&.dark-mode {
						background-color: rgb(57, 88, 46);
					}
				}

				img.icon {
					height: 65rpx;
					border-radius: 20rpx;
					position: absolute;
					top: -5rpx;
					right: -65rpx;
					z-index: 0;
					filter: drop-shadow(0px 2px 10rpx #17181944);
				}
			}

			div.more {
				float: right;
				display: flex;
				margin-top: 5rpx;

				p {
					color: rgb(142, 130, 109);
					font-size: 30rpx;
					line-height: 44rpx;
					height: 44rpx;

					.dark-mode & {
						color: var(--text-color-regular);
					}
				}

				.moreImg {
					height: 30rpx;
					width: 30rpx;
					margin-right: 8rpx;
				}
			}
		}

		div.novels-slide {
			.transition {
				width: 100vw;
				display: flex;
				flex-direction: row;
				overflow: auto;
				font-size: 30rpx;
				height: 370rpx;
				overflow-y: hidden;
			}
		}

		div.novels-slide::-webkit-scrollbar {
			display: none;
		}

		div.novel-cards {
			.transition {
				width: 100vw;
				display: flex;
				flex-direction: row;
				justify-content: center;
				flex-flow: wrap;
				overflow: auto;
				font-size: 30rpx;
			}
		}
	}

	.books {
		height: 260rpx;
		width: calc(100vw - 40rpx);
		margin: 20rpx;
		display: flex;
		background-color: rgb(255, 255, 255);
		border-radius: 10rpx;

		&.dark-mode {
			background-color: #252525 !important;
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

			.title {
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

				.dark-mode & {
					color: var(--text-color-primary);
				}
			}

			.author {
				position: relative;
				margin-top: 15rpx;
				margin-bottom: 10rpx;
				width: 40vw;

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
						color: var(--text-color-primary);
					}
				}
			}

			.description {
				font-size: 25rpx;
				color: rgb(142, 130, 109);
				margin: 5rpx;
				margin-right: 10rpx;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;

				.dark-mode & {
					color: var(--text-color-regular);
				}
			}
		}
	}

	div.underBar {
		height: 150rpx;
	}

	.changeButton {
		margin: 0 60rpx 20rpx 60rpx;
		background-color: #f0e4cd;
		color: #713418;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 30rpx;
		border-radius: 10rpx;
		transition: all .3s;

		.dark-mode & {
			background-color: #3a362d;
			color: #d1a980;
		}
	}

	.changeButton:active {
		background-color: #d1c7b3;
		transform: scale(.9, .9);

		.dark-mode & {
			background-color: #4c4639;
		}
	}
}

.theme-switch-button {
	position: fixed;
	bottom: 120rpx;
	right: 30rpx;
	z-index: 999;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
	transition: all .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
	{
	opacity: 1;
}

.list-complete-item {
	transition: all 1s;
	display: inline-block;
	margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to

/* .list-complete-leave-active for below version 2.1.8 */
	{
	opacity: 1;
	transform: translateY(30px);
}

.list-complete-leave-active {
	position: absolute;
}

.popup {
	height: 100vh;
}

.dense-card-outer-container {
	position: relative;
	width: 100%;
	min-height: 200rpx;
	overflow: hidden;
}

.dense-card-swiper {
	width: 100%;
	height: calc(470rpx + 10rpx);
	margin: 20rpx 0;
}

.dense-card-swiper-item {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 5rpx 0;
}

.dense-card-page {
	display: flex;
	width: 100%;
	justify-content: space-between;
	padding: 0 15rpx;
}

.dense-card-column {
	display: flex;
	flex-direction: column;
	width: 48%;
}

.dense-card-item {
	display: flex;
	width: 100%;
	margin-top: 10rpx;
	margin-bottom: 20rpx;
	align-items: center;
	position: relative;

	.dense-card-rank {
		position: absolute;
		left: 10rpx;
		top: 0;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 28rpx;
		color: #ffffff;
		font-weight: bold;
		background-color: #999999;
		border-radius: 5rpx;
		margin-right: 15rpx;
	}

	.rank-top {
		background: linear-gradient(135deg, #FF6B00, #FFAE00);
		box-shadow: 0 2px 4px rgba(255, 107, 0, 0.3);
	}

	.dense-card-cover {
		width: 105rpx;
		height: 140rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
		margin-left: 10rpx;
	}

	.dense-card-info {
		flex: 1;
		margin-left: 20rpx;
		overflow: hidden;

		.dense-card-title {
			height: 92rpx;
			font-size: 32rpx;
			color: rgb(45, 45, 45);
			font-weight: bold;
			margin-bottom: 10rpx;
			width: 100%;
			overflow: hidden;
			display: -webkit-box;
			font-weight: bold;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;

			.dark-mode & {
				color: var(--text-color-primary);
			}
		}

		.dense-card-author {
			font-size: 28rpx;
			color: rgb(142, 130, 109);
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			.dark-mode & {
				color: var(--text-color-regular);
			}
		}
	}
}

.dense-card-container::-webkit-scrollbar {
	display: none;
}

.appRecommendInfo{
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 10px;
	background-color: #F9FAF8;
	height: 150rpx;
	border-radius: 20rpx;
	border: 1px solid #D9D9D9;
	.left{
		font-size: 30rpx;
		color: rgb(45, 45, 45);
		font-weight: bold;
		margin-bottom: 10rpx;
		width: 100%;
		font-weight: bold;
		margin-left: 40rpx;
		.desc{
			margin: 5rpx 0;
		}
	}
	.right{
		img{
			height: 150rpx;
		}
	}
}
</style>
