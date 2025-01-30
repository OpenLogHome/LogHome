<template>
	<div class="readerOuter"
		:style="{ 'backgroundColor': themesData[readerSettings.theme].isBlack ? '#262822' : '#F7F7F7' }">
		<div class="tools" :class="{ opened: settingsOpened }"
			@click.self="settingsOpened = false; showReaderSetting = false" ref="tools">
			<div class="settings" :class="{ opened: settingsOpened, showReaderSetting: showReaderSetting }"
				ref="settings" :style="{
					'backgroundColor': themesData[readerSettings.theme].backgroundColor,
					'color': themesData[readerSettings.theme].fontColor
				}">
				<div class="line">
					<div class="btn" style="width: 110rpx; margin: 0 30rpx 0 20rpx; font-size: 34rpx;">上一章</div>
					<el-slider v-model="currentPageIdx" :min="0" :max="allPages.length - 1" :step="1"
						style="width: calc(100vw - 220rpx - 170rpx);" :show-tooltip="false"
						@change="handleCurrentPageChange"></el-slider>
					<div class="btn" style="width: 110rpx; margin: 0 20rpx 0 30rpx; font-size: 34rpx;">下一章</div>
				</div>
				<div class="line" style="margin-top: 40rpx; justify-content: space-around;">
					<div class="iconBtn">
						<i class="el-icon-tickets" style="font-size: 50rpx;"></i>
						<p style="font-size: 26rpx; margin-top: 6rpx;">目录</p>
					</div>
					<div class="iconBtn" @click="toggleNightMode">
						<i class="el-icon-moon" style="font-size: 50rpx;"
							v-show="!themesData[readerSettings.theme].isBlack"></i>
						<p style="font-size: 26rpx; margin-top: 6rpx;"
							v-show="!themesData[readerSettings.theme].isBlack">夜间</p>
						<i class="el-icon-sunny" style="font-size: 50rpx;"
							v-show="themesData[readerSettings.theme].isBlack"></i>
						<p style="font-size: 26rpx; margin-top: 6rpx;"
							v-show="themesData[readerSettings.theme].isBlack">日间</p>
					</div>
					<div class="iconBtn" @click="showReaderSetting = !showReaderSetting;">
						<i class="el-icon-setting" style="font-size: 50rpx;" v-show="!showReaderSetting"></i>
						<i class="el-icon-s-tools" style="font-size: 50rpx;" v-show="showReaderSetting"></i>
						<p style="font-size: 26rpx; margin-top: 6rpx;">设置</p>
					</div>
				</div>
				<div class="readerSettings">
					<div class="line" style="margin-top: 40rpx;">
						<span style="font-size: 30rpx;">背景</span>
						<div class="backgrounds">
							<div class="background" v-for="(item, key) in themesData" :style="{
								'backgroundColor': themesData[key].backgroundColor,
								'borderColor': key == readerSettings.theme ? (themesData[readerSettings.theme].isBlack ? 'white' : 'black') : 'transparent'
							}" @click="readerSettings.theme = key">
							</div>
							<!-- 							<div class="btn">
								更多 <i class="el-icon-arrow-right"></i>
							</div> -->
						</div>
					</div>
					<div class="line" style="margin-top: 40rpx;">
						<span style="font-size: 30rpx;">字号</span>
						<div class="fontSize">
							<div class="btn pad" @click="changeFontSize(-1)">
								A<i class="el-icon-sort-down"></i>
							</div>
							{{ readerSettings.fontSize }}
							<div class="btn pad" @click="changeFontSize(+1)">
								A<i class="el-icon-sort-up"></i>
							</div>
							<div class="btn" @click="showFontsSelectDrawer = true">
								<span :style="{'fontFamily': fonts[readerSettings.font].family}">{{fonts[readerSettings.font].name}}</span> <i class="el-icon-arrow-right"></i>
							</div>
						</div>
					</div>
					<div class="line" style="margin-top: 40rpx;">
						<span style="font-size: 30rpx;">行距</span>
						<div class="lineHeight">
							<div class="btn" @click="changeLineHeight(1.5)"
								:class="{ 'selected': readerSettings.lineHeight == 1.5 }">
								小
							</div>
							<div class="btn" @click="changeLineHeight(1.7)"
								:class="{ 'selected': readerSettings.lineHeight == 1.7 }">
								较小
							</div>
							<div class="btn" @click="changeLineHeight(1.8)"
								:class="{ 'selected': readerSettings.lineHeight == 1.8 }">
								适中
							</div>
							<div class="btn" @click="changeLineHeight(2.0)"
								:class="{ 'selected': readerSettings.lineHeight == 2.0 }">
								大
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="topBar" :class="{ opened: settingsOpened }" ref="topBar" :style="{
				'backgroundColor': themesData[readerSettings.theme].backgroundColor,
				'color': themesData[readerSettings.theme].fontColor
			}">
				<i class="el-icon-arrow-left" style="font-size: 50rpx;" @click="navigateBack"></i>
			</div>
		</div>
		<div id="vLine" :style="{
			'fontSize': readerSettings.fontSize + 'rpx',
			'lineHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx'
		}">
			文本
		</div>
		<div id="vPage" :style="{
			'fontSize': readerSettings.fontSize + 'rpx',
			'lineHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx'
		}">
			<div class="renderText">
				<div class='title' :style="{
					'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
					'fontSize': readerSettings.fontSize * 1.3 + 'rpx',
					'fontWeight': 'bold',
					'fontFamily': fonts[readerSettings.font].family
				}">
					{{ vRenderTitle }}
				</div>
				<div class="paragraph"
					:style="{ 'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
							  'fontFamily': fonts[readerSettings.font].family}"
					v-for="para in vRenderText">
					{{ para }}
				</div>
			</div>
		</div>
		<div class="readerPages" :style="{
			'fontSize': readerSettings.fontSize + 'rpx',
			'lineHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
			'color': themesData[readerSettings.theme].fontColor
		}" v-if="currentPageIdx != -1" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
			@touchend="handleTouchEnd">
			<div class="articlePage" v-for="idx in currentRenderIdx" :key="idx" :style="{
				'zIndex': allPages.length - idx,
				'transform': pageTransform(idx), 'transition': isAnimating ? 'all 0.3s' : 'background-color 0.3s', 'boxShadow': `0px 0px 25px rgba(0, 0, 0, 0.12)`,
				'backgroundColor': themesData[readerSettings.theme].backgroundColor,
				'fontFamily': fonts[readerSettings.font].family
			}">
				<div class="topBar">
					<i class="el-icon-arrow-left" style="margin-right: 5rpx;" @click="navigateBack"></i>
					{{ allPages[idx].idx == 0 ? novelInfo.name :
						allArticleData[allPages[idx].articleId.toString()].title }}
				</div>
				<div v-if="allPages[idx].type == 'text'" :class="'textRender'" :id="idx"
					:style="{ height: `${allPages[idx].viewHeight}px` }">
					<div class='title' :style="{
						'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
						'fontSize': readerSettings.fontSize * 1.2 + 'rpx',
						'fontWeight': 'bold', 'marginBottom': allPages[idx].idx == 0 ?
							readerSettings.fontSize * readerSettings.lineHeight * titleMarginBottomRatio + 'rpx' : 0 + 'rpx',
						'fontFamily': fonts[readerSettings.font].family
					}">
						{{ allArticleData[allPages[idx].articleId.toString()].title }}
					</div>
					<div class="paragraph"
						:style="{ 'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
								  'fontFamily': fonts[readerSettings.font].family}"
						v-for="para in allArticleData[allPages[idx].articleId.toString()].content"
						v-show="para.type == 'text'">
						{{ para.value }}
					</div>
				</div>
				<div v-if="allPages[idx].type == 'spliter'" :class="'textRender'" :id="idx">
					{{ allArticleData[allPages[idx].articleId.toString()].title }}
				</div>
				<div v-if="allPages[idx].type == 'image'" :class="'textRender'" :id="idx">
					<div class='title' :style="{
						'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
						'fontSize': readerSettings.fontSize * 1.2 + 'rpx',
						'fontWeight': 'bold'
					}" v-show="allPages[idx].idx == 0">
						{{ allArticleData[allPages[idx].articleId.toString()].title }}
					</div>
					<img :src="allPages[idx].url" alt="" style="width:calc(100vw - 100rpx)">
				</div>
			</div>
		</div>
		<div class="bottomBar">
			<div class="left">
				{{ currentPageIdx + 1 }}/{{ allPages.length }}
			</div>
			<div class="right">

			</div>
		</div>

		<el-drawer title="选择字体" :visible.sync="showFontsSelectDrawer" :direction="'btt'" size="60%">
			<div class="fonts-container">
				<div class="fonts-grid">
					<div v-for="(font, key) in fonts" :key="key" class="font-item"
						:class="{ 'selected': readerSettings.font === key }" @click="selectFont(key)">
						<div class="font-info">
							<div class="font-name">{{ font.name }}</div>
							<div class="font-preview" :style="{
								fontFamily: font.family || 'inherit'
							}">
								落霞与孤鹜齐飞，秋水共长天一色
							</div>
						</div>
						<div class="select-indicator" v-if="readerSettings.font === key">
							<i class="el-icon-check"></i>
						</div>
					</div>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import axios from "axios"
import {
	rpxToPx,
	pxToRpx,
	utc2beijing
} from "../../../lib/utils.js"
import { articleDB } from "../../../lib/db.js"
import themesData from "./themesData.json"
import fontSizes from "./fontSize.json"
import fonts from "./fonts.json"
export default {
	data() {
		return {
			novelInfo: undefined,
			titleMarginBottomRatio: 0.3,
			novelId: -1,
			articleId: -1,
			allArticles: [],
			readerArticleData: {},
			allArticleData: {},
			allPages: [],
			currentPageIdx: -1,
			vRenderText: [],
			vRenderTitle: "",
			actualLineHeight: 0,
			pageActualHeight: 0,
			touchStartX: 0,
			translateX: 0,
			isAnimating: false,
			currentRenderIdx: [],
			settingsOpened: false,
			readerSettings: {},
			themesData,
			fonts,
			showReaderSetting: false,
			showFontsSelectDrawer: false
		}
	},
	methods: {
		async loadAllPages() {
			uni.showLoading({
				title: '编排页面中'
			});
			await this.calculateActualLineHeight();
			setTimeout(async () => {
				this.allArticles = await this.loadAllArticles();
				let articleData = await this.getArticleContentById(this.articleId);
				this.allArticleData[articleData.article_id.toString()] = articleData;
				let articlePages = await this.generateArticleRenderData(articleData);
				this.allPages = articlePages;
				this.currentPageIdx = 0;
				// 开始以广搜方式预渲染全部的页面
				let centerArticleIdx = 0;
				for (centerArticleIdx = 0; centerArticleIdx <= this.allArticles.length; centerArticleIdx++) {
					if (this.articleId == this.allArticles[centerArticleIdx].article_id) {
						break;
					}
				}
				// 由于Vue的渲染问题，前面的页面需要先完成计算，然后后面的可以慢慢计算
				for (let i = centerArticleIdx; i >= 0; i--) {
					if (i < centerArticleIdx) {
						let articleData = await this.getArticleContentById(this.allArticles[i].article_id,
							this.allArticles[i].update_time, true);
						this.allArticleData[articleData.article_id.toString()] = articleData;
						let articlePages = await this.generateArticleRenderData(articleData);
						this.allPages.unshift(...articlePages);
						for (let j = 0; j <= this.currentRenderIdx.length - 1; j++) {
							this.currentRenderIdx[j] += articlePages.length;
						}
						this.currentPageIdx += articlePages.length;
					}
				}
				for (let i = 0; i < this.allArticles.length; i++) {
					if (i > centerArticleIdx) {
						let articleData = await this.getArticleContentById(this.allArticles[i].article_id,
							this.allArticles[i].update_time, true);
						this.allArticleData[articleData.article_id.toString()] = articleData;
						let articlePages = await this.generateArticleRenderData(articleData);
						this.allPages.push(...articlePages);
					}
					if (i == centerArticleIdx || i == centerArticleIdx + 1) {
						this.renderNewPages();
						uni.hideLoading();
					}
				}
				console.log(this.currentPageIdx, this.currentRenderIdx);
			})
		},
		delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		async getNovelInfo() {
			let res = await axios.get(this.$baseUrl + '/library/get_novel_by_id?id=' + this.novelId, {});
			if (res.status == 200) {
				return res.data[0];
			}
		},
		async loadAllArticles() {
			let res = await axios.get(this.$baseUrl + '/library/get_articles?id=' + this.novelId, {});
			if (res.status == 200) {
				return res.data;
			}
		},
		async getArticleContentById(article_id, onlineTime, allowHistory) {
			if (allowHistory) {
				let matchedArticles = await articleDB.articles.where("article_id").equals(article_id).toArray();
				if (matchedArticles.length > 0 && utc2beijing(matchedArticles[0].update_time) >= utc2beijing(onlineTime)) {
					if (matchedArticles[0].article_type == "richtext") {
						matchedArticles[0].content = JSON.parse(matchedArticles[0].content);
					}
					return matchedArticles[0];
				}
			}
			let res = await axios.get(this.$baseUrl + '/articles/get_article?id=' + article_id, {});
			if (res.status == 200) {
				articleDB.articles.put(res.data[0]);
				if (res.data[0].article_type == "richtext") {
					res.data[0].content = JSON.parse(res.data[0].content);
				}
				return res.data[0];
			}
		},
		async vRenderParagraph(text, title) {
			this.vRenderText = text;
			this.vRenderTitle = title;
			await this.delay(0);
			let vPage = document.getElementById("vPage");
			return vPage.scrollHeight;
		},
		async calculateActualLineHeight() {
			let vLine = document.getElementById("vLine");
			this.actualLineHeight = vLine.getBoundingClientRect().height;
		},
		// 利用隐藏的vPage元素进行预渲染，并计算每一段的行高
		async generateArticleRenderData(articleData) {
			function mergeTextContent(articleData) {
				if (!articleData?.content?.length) return articleData;

				let mergedContent = [];
				let currentTextValue = [];
				let isCollecting = false;

				for (let i = 0; i < articleData.content.length; i++) {
					const item = articleData.content[i];
					if (item.type === 'text') {
						if (isCollecting) {
							currentTextValue.push(item.value);
						} else {
							currentTextValue = [item.value];
							isCollecting = true;
						}
						// 如果是最后一个元素或下一个元素不是text类型，保存收集的文本
						if (i === articleData.content.length - 1 || articleData.content[i + 1].type !== 'text') {
							mergedContent.push({
								type: 'text',
								value: currentTextValue
							});
							isCollecting = false;
						}
					} else {
						// 非text类型，直接添加
						mergedContent.push(item);
					}
				}
				return mergedContent;
			}
			if (articleData.article_type == "spliter") return [{ type: "spliter", idx: 0, articleId: articleData.article_id }];
			let screenHeight = uni.getSystemInfoSync().screenHeight;
			let usableScreenHeight = screenHeight - rpxToPx(100) - rpxToPx(70);
			// let lineHeight = rpxToPx(this.readerSettings.fontSize * this.readerSettings.lineHeight);
			// console.log(this.actualLineHeight);
			let lineHeight = this.actualLineHeight;
			let actualLineAmount = Math.floor(usableScreenHeight / lineHeight);
			let pageScrollHeight = actualLineAmount * lineHeight;
			let vRenderContent = mergeTextContent(articleData);
			let generatedPages = [];
			this.pageActualHeight = pageScrollHeight;
			let lastParagraphHeight = 0;
			let pageIdxInArticle = 0;
			for (let mergedParagraph of vRenderContent) {
				if (mergedParagraph.type == "text") {
					let paragraphHeight = await this.vRenderParagraph(mergedParagraph.value, articleData.title);
					let lines = paragraphHeight / lineHeight;
					for (let i = 0; i <= lines / actualLineAmount; i++) {
						generatedPages.push({
							type: "text",
							scrollHeight: lastParagraphHeight + pageScrollHeight * i,
							articleId: articleData.article_id,
							// viewHeight: Math.min(paragraphHeight - pageScrollHeight * i, pageScrollHeight) +
							viewHeight: pageScrollHeight +
								(pageIdxInArticle == 0 ? this.actualLineHeight * this.titleMarginBottomRatio : 0),
							idx: (pageIdxInArticle++)
						})
					}
					lastParagraphHeight += paragraphHeight;
				} else if (mergedParagraph.type == "image") {
					generatedPages.push({
						type: "image",
						idx: (pageIdxInArticle++),
						url: mergedParagraph.img,
						articleId: articleData.article_id,
						id: mergedParagraph.id
					})
				}
			}
			return generatedPages;
		},
		// 动画
		handleTouchStart(e) {
			this.touchStartX = e.touches[0].clientX;
			this.isAnimating = false;
		},

		handleTouchMove(e) {
			const deltaX = e.touches[0].clientX - this.touchStartX;
			this.translateX = deltaX;
		},
		lastPage() {
			if (this.currentPageIdx > 0) {
				// 向右滑，上一页
				this.currentPageIdx--;
				setTimeout(() => {
					this.renderNewPages(-1);
					this.isAnimating = false;
				}, 250);
			}
		},
		nextPage() {
			if (this.currentPageIdx < this.allPages.length - 1) {
				// 向左滑，下一页
				this.currentPageIdx++;
				setTimeout(() => {
					this.renderNewPages(+1);
					this.isAnimating = false;
				}, 250);
			}
		},
		handleTouchEnd(e) {
			const deltaX = e.changedTouches[0].clientX - this.touchStartX;
			this.isAnimating = true;

			if (Math.abs(deltaX) > 50) { // 滑动距离超过50px才触发翻页
				if (deltaX > 0) {
					this.lastPage();
				} else if (deltaX < 0) {
					this.nextPage();
				}
			} else if (Math.abs(deltaX) <= 5) {
				// 视为点击
				let screenWidth = uni.getSystemInfoSync().screenWidth;
				let touchX = e.changedTouches[0].clientX;
				if (touchX <= screenWidth * 0.3) {
					this.lastPage();
				} else if (touchX >= screenWidth * 0.7) {
					this.nextPage();
				} else {
					this.settingsOpened = !this.settingsOpened;
				}
			}
			this.translateX = 0; // 重置位移
		},
		renderNewPages(delta) {
			setTimeout(() => {
				let textRenders = document.querySelectorAll(".textRender");
				for (let item of textRenders) {
					if (this.allPages[item.id].type == 'text') {
						item.scrollTo({
							top: this.allPages[item.id].scrollHeight
						})
					}
				}
			})
			if (this.currentRenderIdx.length == 0 || this.currentRenderIdx.length > 10) {
				this.currentRenderIdx = Array.from({
					length: (Math.min(this.allPages.length - 1, this.currentPageIdx + 1)) - (Math.max(0, this
						.currentPageIdx - 1)) + 1
				}, (value, index) => (Math.max(0, this.currentPageIdx - 1)) + index);
			} else if (delta == 1) {
				if (this.currentPageIdx + 1 <= this.allPages.length - 1 && this.currentRenderIdx.indexOf(this.currentPageIdx + 1) == -1)
					this.currentRenderIdx.push(this.currentPageIdx + 1);
			} else if (delta == -1) {
				if (this.currentPageIdx - 1 >= 0 && this.currentRenderIdx.indexOf(this.currentPageIdx - 1) == -1)
					this.currentRenderIdx.unshift(this.currentPageIdx - 1);
			}
		},
		pageTransform(idx) {
			return this.translateX <= 0 ? (idx == this.currentPageIdx ? `translateX(${this.translateX}px)` : (idx < this.currentPageIdx ? `translateX(calc( -100% - 25px))` : `translateX(0)`))
				: (idx == this.currentPageIdx - 1 ? `translateX(calc(-100%  + ${this.translateX}px))` : (idx < this.currentPageIdx - 1 ? `translateX(calc( -100% - 25px))` : `translateX(0)`))
		},
		loadReaderSettings() {
			let readerSettings = window.localStorage.getItem("newReaderSettings");
			if (readerSettings && JSON.parse(readerSettings)["version"] == 250131) {
				this.readerSettings = JSON.parse(readerSettings);
			} else {
				this.readerSettings = {
					version: 250131,
					font: "default",
					fontSize: 45,
					lineHeight: 1.8,
					theme: "white"
				};
				window.localStorage.setItem("newReaderSettings", JSON.stringify(this.readerSettings));
			}
		},
		navigateBack() {
			uni.navigateBack();
		},
		handleCurrentPageChange() {
			this.currentRenderIdx = [];
			this.renderNewPages();
		},
		toggleNightMode() {
			if (this.themesData[this.readerSettings.theme].isBlack) {
				this.readerSettings.theme = "white";
			} else {
				this.readerSettings.theme = "black";
			}
		},
		changeFontSize(delta) {
			let currentIdx = fontSizes.indexOf(this.readerSettings.fontSize);
			let newFontSize = 46;
			if (delta < 0) newFontSize = fontSizes[Math.max(0, currentIdx - 1)];
			if (delta > 0) newFontSize = fontSizes[Math.min(fontSizes.length - 1, currentIdx + 1)];
			if (newFontSize != this.readerSettings.fontSize) {
				this.readerSettings.fontSize = newFontSize;
				this.allPages = [];
				this.currentRenderIdx = [];
				setTimeout(async () => {
					this.loadAllPages();
				})
			}
		},
		changeLineHeight(lineHeight) {
			this.readerSettings.lineHeight = lineHeight;
			this.allPages = [];
			this.currentRenderIdx = [];
			setTimeout(async () => {
				this.loadAllPages();
			})
		},
		selectFont(fontKey) {
			this.readerSettings.font = fontKey;
			this.showFontsSelectDrawer = false;
			// 重新加载页面以应用新字体
			this.allPages = [];
			this.currentRenderIdx = [];
			setTimeout(async () => {
			this.loadAllPages();
			})
		},
	},
	watch: {
		currentPageIdx(newValue, oldValue) {
			// console.log(newValue);
		},
		readerSettings: {
			handler(newValue, oldValue) {
				window.localStorage.setItem("newReaderSettings", JSON.stringify(this.readerSettings));
			},
			deep: true
		}
	},
	computed: {
	},
	async onLoad(option) {
		this.loadReaderSettings();
		uni.showLoading({
			title: '加载中'
		});
		if (JSON.stringify(option) == "{}") {
			uni.showToast({
				title: "undefined",
				icon: 'none',
				duration: 2000
			});
			return;
		}
		this.articleId = option.id;
		let article = await this.getArticleContentById(this.articleId);
		this.novelId = article.novel_id;
		this.novelInfo = await this.getNovelInfo();
		this.loadAllPages();
	}
}
</script>

<style scoped lang="scss">
@font-face {
	font-family: "FangZhengKaiTiJianTi";
	src: url("../../../static/fonts/FangZhengKaiTiJianTi-1.ttf");
}

@font-face {
	font-family: "FangZhengShuSongJianTi";
	src: url("../../../static/fonts/FangZhengShuSongJianTi-1.ttf");
}

@font-face {
	font-family: "LXGWWenKaiMedium";
	src: url("../../../static/fonts/LXGWWenKai-Medium.ttf");
}

@font-face {
	font-family: "LXGWWenKaiRegular";
	src: url("../../../static/fonts/LXGWWenKai-Regular.ttf");
}

@font-face {
	font-family: "SourceHanSansSCBold";
	src: url("../../../static/fonts/SourceHanSansSC-Bold.otf");
}

@font-face {
	font-family: "SourceHanSansSCRegular";
	src: url("../../../static/fonts/SourceHanSansSC-Regular.otf");
}


.readerOuter {
	height: 100vh;

	.readerPages {
		position: absolute;
		z-index: 2;

		.articlePage {
			padding: 50rpx 50rpx;
			width: calc(100vw - 100rpx);
			height: calc(100vh - 100rpx);
			overflow: hidden;
			white-space: pre-wrap;
			word-wrap: break-word;
			position: absolute;
			background-color: #FEF6D5;

			.textRender {
				overflow: hidden;

				.paragraph {
					margin: 0;
					padding: 0;
				}
			}


			.topBar {
				height: 70rpx;
				font-size: 34rpx;
				color: #0008;
			}
		}
	}

	.bottomBar {
		position: fixed;
		bottom: 10rpx;
		left: 0px;
		width: 100%;
		z-index: 1000;
		padding: 0 50rpx;
		font-size: 34rpx;
		color: #0008;
	}

	#vLine {
		position: fixed;
		width: calc(100vw - 100rpx);
		padding: 0 50rpx;
		overflow: hidden;
		white-space: pre-wrap;
		word-wrap: break-word;
		opacity: 0;
		z-index: 0;
	}

	#vPage {
		position: fixed;
		width: calc(100vw - 100rpx);
		padding: 0 50rpx;
		overflow: hidden;
		white-space: pre-wrap;
		word-wrap: break-word;
		opacity: 0;
		z-index: 0;
	}


	// 工具栏样式
	div.tools {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		font-size: 36rpx;
		// background-color: rgba(0, 0, 0, 0.2);
		z-index: 1001;
		visibility: hidden;
		// opacity: 0;
		transition: all .3s;

		div.topBar {
			position: absolute;
			background-color: #000000aa;
			top: 0;
			padding-top: 30rpx;
			padding-left: 30rpx;
			padding-right: 30rpx;
			width: calc(100vw - 60rpx);
			height: 75rpx;
			transform: translateY(-120%);
			color: rgb(203, 203, 203);
			transition: all .3s;
			box-shadow:
				0px 0px 2.4px rgba(0, 0, 0, 0.021),
				0px 0px 6.8px rgba(0, 0, 0, 0.03),
				0px 0px 16.3px rgba(0, 0, 0, 0.039),
				0px 0px 54px rgba(0, 0, 0, 0.06);
		}

		div.settings {
			position: absolute;
			background-color: #000000aa;
			bottom: 0;
			padding-top: 20rpx;
			padding-left: 30rpx;
			padding-right: 30rpx;
			padding-bottom: 30rpx;
			width: calc(100vw - 60rpx);
			// height: 260rpx;
			transform: translateY(120%);
			color: rgb(203, 203, 203);
			transition: all .3s;
			box-shadow:
				0px 0px 2.4px rgba(0, 0, 0, 0.021),
				0px 0px 6.8px rgba(0, 0, 0, 0.03),
				0px 0px 16.3px rgba(0, 0, 0, 0.039),
				0px 0px 54px rgba(0, 0, 0, 0.06);

			.readerSettings {
				.backgrounds {
					display: flex;
					width: 85%;
					justify-content: space-around;

					.background {
						border-radius: 100%;
						width: 65rpx;
						height: 65rpx;
						border: 3rpx solid;
					}
				}

				.btn {
					height: 71rpx;
					background-color: #8882;
					border-radius: 100rpx;
					padding: 0 30rpx;
					font-size: 32rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 2px solid transparent;
				}

				.btn.pad {
					padding: 0 35rpx;
				}

				.fontSize {
					display: flex;
					width: 85%;
					justify-content: space-around;
					align-items: center;
				}

				.lineHeight {
					display: flex;
					width: 85%;
					justify-content: space-around;
					align-items: center;

					.btn {
						width: calc(85% / 4 - 60rpx);
					}

					.btn.selected {
						border: 2rpx solid;
					}
				}
			}

			.line {
				display: flex;
				justify-content: space-evenly;
				margin-top: 15rpx;
				align-items: center;

				.name {
					text-align: center;
					line-height: 50rpx;
					height: 50rpx;
					width: 100rpx;
					margin-left: 10rpx;
					margin-right: 10rpx;
				}


				.iconBtn {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
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
			transform: translateY(0rpx + 345rpx);
		}

		div.settings.opened.showReaderSetting {
			transform: translateY(0rpx);
		}

		div.topBar.opened {
			transform: translateY(0rpx);
		}

	}

	div.tools.opened {
		visibility: visible;
		opacity: 1;
	}

	.fonts-container {
		padding: 20rpx;

		.fonts-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
			padding: 10rpx;

			.font-item {
				position: relative;
				padding: 30rpx;
				border-radius: 12rpx;
				background: #f5f7fa;
				cursor: pointer;
				transition: all 0.3s;

				&:hover {
					background: #e6e8eb;
				}

				&.selected {
					background: #ecf5ff;
					border: 2rpx solid #409eff;
				}

				.font-info {
					.font-name {
						font-size: 32rpx;
						margin-bottom: 16rpx;
						color: #303133;
					}

					.font-preview {
						font-size: 28rpx;
						color: #606266;
						line-height: 1.6;
					}
				}

				.select-indicator {
					position: absolute;
					top: 20rpx;
					right: 20rpx;
					color: #409eff;
					font-size: 36rpx;
				}
			}
		}
	}
}
</style>