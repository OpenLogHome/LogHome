<template>
	<view class="content" :class="readerSettings.theme" style="transition: all .5s;">
		<el-alert title="提示" type="info" close-text="知道了" :description="'经审核，本文' + article.warn_status + '，请酌情选读。'"
			show-icon v-show="article.warn_status && article.warn_status != 'None'" style="margin-bottom: 50rpx;"
			effect="dark">
		</el-alert>
		<div class="tools" :class="{opened: settingsOpened}" @click.self="toolsOuterClicked" ref="tools">
			<div class="settings" :class="{opened: settingsOpened}" ref="settings">
				<div class="line">
					<div class="button" @click="changeFontSize(+1)">A+</div>
					<div class="button" @click="changeFontSize(-1)">A-</div>
					<div class="button" :class="{'selected':readerSettings.lineHeightMode == 0}"
						@click="changeLineHeight(0)">窄</div>
					<div class="button" :class="{'selected':readerSettings.lineHeightMode == 1}"
						@click="changeLineHeight(1)">中</div>
					<div class="button" :class="{'selected':readerSettings.lineHeightMode == 2}"
						@click="changeLineHeight(2)">宽</div>
					<div class="button" @click="gotoMenu">目录</div>
				</div>
				<div class="line">
					<div class="button white theme" @click="changeTheme('white')"
						:class="{'selected':readerSettings.theme == 'white'}">蛙鸣白</div>
					<div class="button yellow theme" @click="changeTheme('yellow')"
						:class="{'selected':readerSettings.theme == 'yellow'}">原木黄</div>
					<div class="button green theme" @click="changeTheme('green')"
						:class="{'selected':readerSettings.theme == 'green'}">草原绿</div>
					<div class="button purple theme" @click="changeTheme('purple')"
						:class="{'selected':readerSettings.theme == 'purple'}">末地紫</div>
					<div class="button black theme" @click="changeTheme('black')"
						:class="{'selected':readerSettings.theme == 'black'}">虚空黑</div>
				</div>
				<div class="line">
					<button type="default" class="inTopBar"
						:class="[{enabled:article.article_chapter != firstArticleChapter},readerSettings.theme]"
						@click="changePage(-1)">
						上一章<img src="../../static/icons/icon_reader_pgup.png" alt="" class="pageChangeImg" />
					</button>
					<button type="default" class="inTopBar"
						:class="[{enabled:article.article_chapter != lastArticleChapter},readerSettings.theme]"
						@click="changePage(+1)">
						<img src="../../static/icons/icon_reader_pgdn.png" alt="" class="pageChangeImg"/>下一章
					</button>
				</div>
			</div>
			<div class="underSettings" :class="{opened: settingsOpened}" ref="settings">

			</div>
		</div>
		<div class="articleContent spliter" v-if="article.article_type == 'spliter'">
			<div class="title" :style="{fontSize:readerSettings.titleFontSize + 18 + 'rpx'}" :class="readerSettings.theme">
				{{article.title}}
			</div>
		</div>
		<div class="articleContent worldVocabulary" v-else-if="article.article_type == 'worldVocabulary'">
			<div class="topBar">
				<div class="left" @click="imgUploadVisible = true">
					<div class="pic" v-if="article.content.pic == undefined && article.title">
						{{article.title.slice(0, 1)}} </div>
					<log-image :src="article.content.pic" alt="" v-if="article.content.pic != undefined"/>
				</div>
				<div class="right">
					<div class="tit">词条名称</div>
					<input class="input" placeholder="请输入词条名称" v-model="article.title" style="fontSize: 50rpx"
						:style="{fontSize:readerSettings.titleFontSize + 'rpx'}" disabled />
				</div>
			</div>
			<div class="article"
				:style="{fontSize:readerSettings.fontSize + 'rpx',lineHeight:lineHeightMode2Value(readerSettings.lineHeightMode)}"
				@tap="articleTapped" :class="readerSettings.theme">
				<div class="desc" style="margin-bottom: 30rpx;">
					{{article.content.desc}}
				</div>
				<el-card class="box-card" v-for="(item, index) in article.content.attributes"
					style="margin-bottom: 20rpx;">
					<div style="display:flex; justify-content:space-between;">
						<div class="attr"><span style="color:#888888; margin-right: 40rpx;">{{item.name}}</span>
							{{item.content}}
						</div>
					</div>

				</el-card>
			</div>
		</div>
		<div class="articleContent rich" v-else>
			<div class="title" :style="{fontSize:readerSettings.titleFontSize + 'rpx'}" :class="readerSettings.theme">
				{{article.title}}
			</div>
			<div class="article"
				:style="{fontSize:readerSettings.fontSize + 'rpx',lineHeight:lineHeightMode2Value(readerSettings.lineHeightMode)}"
				@tap="articleTapped" :class="readerSettings.theme" v-if="article.content">
				<div v-for="item in JSON.parse(article.content)">
					<div v-if="item.type == 'text'">{{item.value}}</div>
					<log-image :src="item.img" alt="" v-else-if="item.type == 'image'" style="width:100%"/>
					<div class="bookLink" v-else-if="item.type == 'novel'" style="display:flex; font-size:30rpx;">
						<view style="display: flex; align-items: center;">
							<bookInCase :bookName="item.name" :picUrl="item.picUrl"
								@click.native="readBook(item.novel_id)"></bookInCase>
						</view>
						<view>
							<p style="height:70%; background-color: #bfbfbfaa; margin:25rpx 0; padding:20rpx; width:55vw; border-radius: 5px;"
								@click="readBook(item.novel_id)">
								{{item.content}}
							</p>
						</view>
					</div>
				</div>
			</div>
		</div>

		<!-- 		<div class="underBar">
			<img src="../../static/icons/end.png" alt="">
			<div>已经到底了哦</div>
		</div> -->
		<button type="default" :class="[{enabled:article.article_chapter != firstArticleChapter},readerSettings.theme]"
			@click="changePage(-1)">
			上一章<img src="../../static/icons/icon_reader_pgup.png" alt="" class="pageChangeImg"/>
		</button>
		<button type="default" :class="[{enabled:article.article_chapter != lastArticleChapter},readerSettings.theme]"
			@click="changePage(+1)">
			<img src="../../static/icons/icon_reader_pgdn.png" alt="" class="pageChangeImg"/>下一章
		</button>
		<el-drawer :with-header="false" :visible.sync="menuDrawer" direction="btt" :modal="false" size="50%"
			custom-class="bookMenu">
			<bookMenu :novel_id="article.novel_id"></bookMenu>
		</el-drawer>
		<div class="lastProgress" v-show="showLastProgress">
			已恢复上次阅读进度  <div class="textbutton" style="margin-left: 10px;" @click="scrollToTop(true); showLastProgress=false">回到顶部</div>
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	import bookMenu from '../../components/bookMenu.vue'
	import bookInCase from '../../components/book_in_case.vue'
	export default {
		components: {
			bookMenu,
			bookInCase
		},
		data() {
			return {
				articleId: -1,
				article: {},
				articles: [],
				pageHeadBtn: [],
				settingsOpened: false,
				readerSettings: {},
				pageHead: {},
				scrollTop: 0,
				navigationBarController: {},
				pageProgressInterval: undefined,
				showLastProgress: false,
				themes: {
					white: {
						color: "#001f41",
						backColor: "#fefefe",
					},
					yellow: {
						backColor: "#FFEFD6",
						color: "#502727",
					},
					green: {
						backColor: "#C1E6C6",
						color: "#093811",
					},
					purple: {
						backColor: "#FDE0FF",
						color: "#310024",
					},
					black: {
						backColor: "#282C35",
						color: "#CECECE",
					}
				},
				menuDrawer: false
			}
		},
		onNavigationBarButtonTap(e) {
			this.settingsOpened = !this.settingsOpened;
		},
		methods: {
			loadPageProgress() {
				let scrollTop = localStorage.getItem(`articleProgress_${this.articleId}`);
				this.scrollToTop();
				if(scrollTop != undefined && scrollTop != 0) {
					uni.pageScrollTo({
						duration: 200, // 过渡时间
						scrollTop: Math.floor(scrollTop) // 滚动的实际距离
					})
					this.showLastProgress = true;
					setTimeout(() => {
						this.showLastProgress = false;
					}, 5000);
				}
			},
			updatePageProgress(){
				this.pageProgressInterval = setInterval(() => {
					let scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
					localStorage.setItem(`articleProgress_${this.articleId}`, scrollTop);
				}, 2000);
			},
			refreshPage(articleId) {
				uni.showLoading({
					title: "加载中"
				})
				let _this = this;
				axios.get(this.$baseUrl + '/articles/get_article?id=' + articleId).then((res) => {
					this.articleId = articleId;
					this.article = res.data[0];
					if (this.article.article_type == "worldVocabulary") {
						this.article.content = JSON.parse(this.article.content);
					}
					setTimeout(() => {
						this.loadPageProgress();
					})
					this.getArticles(this.article.novel_id);
					window.localStorage.setItem("ReaderHistory_" + this.article.novel_id, this.article.article_chapter);
				}).catch(function(error) {}).then(function() {
					uni.hideLoading();
				})
				
			},
			changeTheme(themeName) {
				this.readerSettings.theme = themeName;
				window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
			},
			changeFontSize(ds) {
				if (ds == 1) {
					this.readerSettings.fontSize = Math.min(this.readerSettings.fontSize + 2.5, 50);
					this.readerSettings.titleFontSize = Math.min(this.readerSettings.titleFontSize + 2.5, 65);
					window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
				}
				if (ds == -1) {
					this.readerSettings.fontSize = Math.max(this.readerSettings.fontSize - 2.5, 30);
					this.readerSettings.titleFontSize = Math.max(this.readerSettings.titleFontSize - 2.5, 45);
					window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
				}
			},
			changeLineHeight(heightMode) {
				this.readerSettings.lineHeightMode = heightMode;
				window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
			},
			lineHeightMode2Value(mode) {
				if (mode == 0) return "125%";
				if (mode == 1) return "175%";
				if (mode == 2) return "225%";
			},
			getArticles(uid) {
				let _this = this;
				axios.get(this.$baseUrl + '/library/get_articles_all?id=' + uid, {}).then((res) => {
					this.articles = res.data;
					// console.log(this.articles.length)
				}).catch(function(error) {
					_this.articles.splice(0, 0);
				}).then(function() {})
			},
			changePage(dp) {
				let articles = this.articles;
				let article = this.article;
				if (this.article.article_chapter + dp == 0) {
					uni.showToast({
						title: "已经是第一章了",
						icon: 'none',
						duration: 2000
					});
				} else if (this.article.article_chapter + dp == articles.length + 1) {
					uni.showToast({
						title: "已经是最后一章了",
						icon: 'none',
						duration: 2000
					});
				} else {
					if (dp == +1) {
						for (let i = 0; i < this.articles.length; i++) {
							if (this.articles[i].article_chapter >= this.article.article_chapter + dp &&
								this.articles[i].is_draft == 0) {
								let aid = this.articles[i].article_id;
								this.refreshPage(aid);
								this.settingsOpened = false;
								return;
							}
						}
					} else if (dp == -1) {
						for (let i = this.articles.length - 1; i >= 0; i--) {
							if (this.articles[i].article_chapter <= this.article.article_chapter + dp &&
								this.articles[i].is_draft == 0) {
								let aid = this.articles[i].article_id;
								this.refreshPage(aid);
								this.settingsOpened = false;
								return;
							}
						}
					}
				}
			},
			scrollToTop(duration){
				uni.pageScrollTo({
					duration: duration?200:0, // 过渡时间
					scrollTop: 0, // 滚动的实际距离
				})
			},
			gotoMenu() {
				// uni.navigateTo({
				// 	url:"./allArticles?id=" + this.article.novel_id
				// })
				this.menuDrawer = true;
			},
			articleTapped(event) {
				let touchHeight = event.detail.y;
				let bodyHeight3 = document.body.clientHeight / 3;
				let _this = this;
				// console.log(bodyHeight3)
				// if (touchHeight < bodyHeight3) {
				// 	// console.log("向上滚动")
				// 	uni.createSelectorQuery().select(".article").boundingClientRect((res) => {
				// 		// console.log("top",res.top)
				// 		let scrollH = res.top;
				// 		// console.log("newTop",scrollH + bodyHeight3*2)
				// 		uni.pageScrollTo({
				// 			duration: 200, // 过渡时间
				// 			scrollTop: -scrollH - bodyHeight3 * 3 * 0.9, // 滚动的实际距离
				// 		})
				// 	}).exec()
				// } else if (touchHeight > bodyHeight3 * 2) {
				// 	// console.log("向下滚动")
				// 	uni.createSelectorQuery().select(".article").boundingClientRect((res) => {
				// 		// console.log("top",res.top)
				// 		let scrollH = res.top;
				// 		uni.pageScrollTo({
				// 			duration: 200, // 过渡时间
				// 			scrollTop: -scrollH + bodyHeight3 * 3 * 0.9, // 滚动的实际距离
				// 		})
				// 	}).exec()
				// } else {
				this.settingsOpened = !this.settingsOpened;
				// }
			},
			toolsOuterClicked() {
				this.settingsOpened = false;
			},
			//跳转到其他书籍
			readBook(novel_id) {
				uni.navigateTo({
					url: './bookInfo?id=' + novel_id
				})
			},
		},
		onLoad(option) {
			let _this = this;
			let readerSettings = window.localStorage.getItem("readerSettings");
			if (readerSettings && JSON.parse(readerSettings)["version"] == 211213) {
				this.readerSettings = JSON.parse(readerSettings);
			} else {
				this.readerSettings = {
					version: 211213,
					fontSize: 40,
					titleFontSize: 55,
					lineHeightMode: 2,
					theme: "yellow"
				};
				window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
			}
			if (JSON.stringify(option) == "{}") {
				uni.showToast({
					title: "undefined",
					icon: 'none',
					duration: 2000
				});
				return;
			}
			uni.showLoading({
				title: '加载中'
			});

			//设定导航栏显示效果
			setTimeout(() => {
				this.pageHead = document.getElementsByClassName('uni-page-head')[0];
				this.pageHeadBtn = document.querySelectorAll('.uni-page-head .uni-btn-icon');
				this.pageHeadBtn.forEach(element => {
					element.style.transition = "all .5s"
				})
				this.pageHead.style.transition = "opacity .5s"
			}, 0)

			this.navigationBarController = setInterval(() => {
				if (_this.settingsOpened) {
					_this.pageHead.style.opacity = "1"
					_this.pageHead.style.backgroundColor = "transparent"
					this.pageHeadBtn.forEach(element => {
						element.style.color = "white";
					})

				} else if (_this.scrollTop >= 120) {
					_this.pageHead.style.opacity = "0"

				} else {
					_this.pageHead.style.opacity = "1"
					_this.pageHead.style.backgroundColor = _this.themes[_this.readerSettings.theme].backColor;
					this.pageHeadBtn.forEach(element => {
						element.style.color = _this.themes[_this.readerSettings.theme].color;
					})
				}
			}, 300)
			this.refreshPage(option.id);
			
			// 启动页面滚动日志记录
			this.updatePageProgress();
		},
		beforeDestroy() {
			clearInterval(this.navigationBarController);
			clearInterval(this.pageProgressInterval);
		},
		onPageScroll(res) {
			this.scrollTop = res.scrollTop; //距离页面顶部距离
		},
		computed: {
			firstArticleChapter() {
				for (let item of this.articles) {
					if (item.is_draft == 0) {
						return item.article_chapter;
					}
				}
			},
			lastArticleChapter() {
				let lsArticleChapter = 0;
				for (let item of this.articles) {
					if (item.is_draft == 0) {
						lsArticleChapter = item.article_chapter;
					}
				}
				return lsArticleChapter;
			},
		}
	}
</script>

<style scoped lang="less">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-flow: wrap;
		min-height: calc(100vh - 100rpx - 44px);

		padding: 50rpx;

		div.article {
			font-size: 40rpx;
			width: calc(100vw - 100rpx);
			overflow: hidden;
			white-space: pre-line;
		}

		div.title {
			font-size: 55rpx;
			font-weight: bold;
			margin-bottom: 25rpx;
			width: calc(100vw - 100rpx);
			overflow: hidden;
			white-space: pre-line;
		}

		div.tools {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			font-size: 36rpx;
			background-color: rgba(0, 0, 0, 0.2);
			z-index: 100;
			visibility: hidden;
			opacity: 0;
			transition: all .3s;

			div.settings {
				position: absolute;
				background-color: #000000aa;
				padding-top: 100rpx;
				padding-left: 30rpx;
				padding-right: 30rpx;
				width: calc(100vw - 60rpx);
				height: 285rpx;
				transform: translateY(-80rpx);
				color: rgb(203, 203, 203);
				transition: all .3s;

				.line {
					display: flex;
					justify-content: space-evenly;
					margin-top: 15rpx;

					.name {
						text-align: center;
						line-height: 50rpx;
						height: 50rpx;
						width: 100rpx;
						margin-left: 10rpx;
						margin-right: 10rpx;
					}

					.button {
						border: 2px rgb(203, 203, 203) solid;
						border-radius: 10rpx;
						text-align: center;
						line-height: 50rpx;
						height: 50rpx;
						padding-left: 10rpx;
						padding-right: 10rpx;
						margin-left: 10rpx;
						margin-right: 10rpx;
					}

					.button.selected {
						border: 2px #ffffff solid;
						color: #ffffff;
						transform: scale(.9);
					}

					button.inTopBar {
						transform: scale(.75);
						width: 50%;
					}
				}
			}

			div.settings.opened {
				transform: translateY(0rpx);
			}

			div.underSettings {
				position: absolute;
				background-color: #FFF2D9;
				padding-top: 160rpx;
				padding-left: 50rpx;
				bottom: -160rpx;
				width: 100vw;
				height: 0rpx;
			}
		}

		div.tools.opened {
			visibility: visible;
			opacity: 1;
		}

		div.underBar {
			height: 150rpx;
			width: 100vw;
			display: flex;
			margin-top: 50rpx;
			margin-bottom: 50rpx;
			justify-content: center;
			align-items: center;
			color: rgb(163, 159, 150);
			font-size: 30rpx;

			img {
				width: 100rpx;
				margin-right: 30rpx;
			}
		}

		button.enabled.yellow {
			background-color: rgb(255, 140, 0);
			color: rgb(0, 0, 0);
		}

		button.yellow {
			background-color: rgb(226, 197, 129);
			color: rgb(0, 0, 0);
		}

		button.enabled.blue {
			background-color: rgb(5, 168, 222);
			color: rgb(0, 0, 0);
		}

		button.blue {
			background-color: rgb(154, 229, 229);
			color: rgb(0, 0, 0);
		}

		button.enabled.green {
			background-color: rgb(120, 200, 40);
			color: rgb(0, 0, 0);
		}

		button.green {
			background-color: rgb(142, 194, 154);
			color: rgb(0, 0, 0);
		}

		button.enabled.purple {
			background-color: rgb(168, 9, 220);
			color: rgb(0, 0, 0);
		}

		button.purple {
			background-color: rgb(194, 126, 189);
			color: rgb(0, 0, 0);
		}

		button.enabled.black {
			background-color: rgb(221, 221, 221);
			color: rgb(0, 0, 0);
		}

		button.black {
			background-color: rgb(163, 163, 163);
			color: rgb(0, 0, 0);
		}

		img.pageChangeImg {
			height: 50rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
			z-index: 1;
		}

		div.opened {
			left: 0;
			opacity: 1;
		}
		
		
		.lastProgress{
			position: fixed;
			bottom: 20vh;
			left: 50vw;
			transform: translateX(-50%);
			background-color: #000000aa;
			padding: 20rpx 0;
			border-radius: 100rpx;
			color: white;
			font-size: 35rpx;
			width: 80vw;
			display: flex;
			justify-content: center;
			align-items: center;
			.textbutton{
				color: #FF8C00;
			}
		}
	}

	.button.theme {
		width: 120rpx;
		margin-top: 15rpx;
		font-size: 30rpx;
	}

	.button {
		transition: all .3s cubic-bezier(.8, -.5, .2, 1.4);
	}

	.button.theme.selected {
		border: 2px #ffffff solid !important;
		color: #ffffff !important;
		transform: scale(.9);
	}

	.button.blue {
		background-color: #25b2f846;
		color: #24ACF2;
		border: 2px #24ACF2 solid !important;
	}

	.button.yellow {
		background-color: #FFB25544;
		color: #E68D4D;
		border: 2px #E68D4D solid !important;
	}

	.button.green {
		background-color: #1AA13444;
		color: #1AA134;
		border: 2px #1AA134 solid !important;
	}

	.button.purple {
		background-color: #9660C344;
		color: #9660C3;
		border: 2px #9660C3 solid !important;
	}

	.button.black {
		background-color: #282C3544;
		color: #83878c;
		border: 2px #83878c solid !important;
	}

	view.content.white {
		background-color: #F8F8FA;
		color: #020104;
	}

	view.content.blue {
		background-color: #DDF3FE;
		color: #115574;
	}

	view.content.yellow {
		background-color: #FFEFD6;
		color: #502727;
	}

	view.content.green {
		background-color: #C0EDC6;
		color: #000B00;
	}

	view.content.purple {
		background-color: #fde0ffee;
		color: #310024;
	}

	view.content.black {
		background-color: #111111;
		color: #cecece;
	}

	.articleContent {
		.topBar {
			box-sizing: border-box;
			position: relative;
			display: flex;
			padding: 30rpx;
			padding-top: 60rpx;

			div.left {
				transform: translateY(-5rpx);

				.pic {
					width: 150rpx;
					height: 150rpx;
					border-radius: 100%;
					background-color: #6e3b24;
					display: flex;
					color: white;
					justify-content: center;
					align-items: center;
					font-size: 50rpx;

				}

				img {
					width: 150rpx;
					height: 150rpx;
					border-radius: 100%;
				}
			}

			div.right {
				margin-left: 30rpx;

				.tit {
					padding-left: 20rpx;
					margin-bottom: 20rpx;
				}

				input {
					padding-left: 20rpx;
					font-size: 35rpx;
					font-weight: bold;
					line-height: 150%;
				}
			}

		}
	}
</style>

<style>

</style>