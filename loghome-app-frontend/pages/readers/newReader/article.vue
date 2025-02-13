<template>
	<div class="readerOuter"
		:style="{ 'backgroundColor': themesData[readerSettings.theme].isBlack ? '#262822' : '#F7F7F7', 
				  '--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<div class="tools" :class="{ opened: settingsOpened }"
			@click.self="handleCloseTool" ref="tools">
			<div class="settings" :class="{ opened: settingsOpened, showReaderSetting: showReaderSetting }"
				ref="settings" :style="{
					'backgroundColor': themesData[readerSettings.theme].backgroundColor,
					'color': themesData[readerSettings.theme].fontColor
				}">
				<div class="line">
					<div class="btn" style="width: 110rpx; margin: 0 30rpx 0 20rpx; font-size: 34rpx;" 
						 @click="sliderTooltip.lastIdx=currentArticleIdx; gotoArticleIdx(currentArticleIdx - 1)">上一章</div>
					<el-slider v-model="currentArticleIdx" :min="0" :max="allArticles.length - 1" :step="1"
						style="width: calc(100vw - 220rpx - 170rpx);" :show-tooltip='false' @touchstart.native="startSlideArticleIndex"
						@change="handleCurrentPageChange" @input="handleSliderInput"></el-slider>
					<div class="btn" style="width: 110rpx; margin: 0 20rpx 0 30rpx; font-size: 34rpx;"
						 @click="sliderTooltip.lastIdx=currentArticleIdx; gotoArticleIdx(currentArticleIdx + 1)">下一章</div>
				</div>
				<div class="line" style="margin-top: 40rpx; justify-content: space-around;">
					<div class="iconBtn" @click="gotoMenu">
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
								<span :style="{ 'fontFamily': fonts[readerSettings.font].family }">{{
									fonts[readerSettings.font].name }}</span>
								<i class="el-icon-arrow-right"></i>
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
			<!-- 滚动滚动条时显示的ToolTip -->
			<div class="sliderTooltip" :class="{'show': showSliderTooltip}" :style="{bottom: showReaderSetting ? '700rpx' : '330rpx'}">
				<div class="backBtn" @click="handleUndoSlider">
					<div class="icon">
						<i class="el-icon-refresh-left"></i>
					</div>
					<div class="t">
						撤销
					</div>
				</div>
				<div class="text">
					<div class="title">{{sliderTooltip.title}}</div>
					<div class="percent">{{sliderTooltip.percent.toFixed(1)}}%</div>
				</div>
			</div>
		</div>
		<div id="vLine" :style="{
			'fontSize': readerSettings.fontSize + 'rpx',
			'lineHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx'
		}">
			<span id="vText">
				文本
			</span>
		</div>
		<div id="vPage" :style="{
			'fontSize': readerSettings.fontSize + 'rpx',
			'lineHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx'
		}">
			<div class="renderText">
				<div class='title' :style="{
					'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
					'fontSize': readerSettings.fontSize * 1.2 + 'rpx',
					'fontWeight': 'bold',
					'fontFamily': fonts[readerSettings.font].family
				}" v-show="vRenderShowTitle">
					{{ vRenderTitle }}
				</div>
				<div class="paragraph" :style="{
					'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
					'fontFamily': fonts[readerSettings.font].family
				}" v-for="para in vRenderText">
					{{para}}
				</div>
			</div>
		</div>
		<div class="readerPages" :style="{
			'fontSize': readerSettings.fontSize + 'rpx',
			'lineHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
			'color': themesData[readerSettings.theme].fontColor
		}" v-if="currentPageIdx != -1" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
			@touchend="handleTouchEnd">
			<div :class="'articlePage idx' + idx" v-for="idx in currentRenderIdx" :key="idx" :style="{
				'zIndex': allPages.length - idx,
				'transform': pageTransform(idx), 'transition': isAnimating ? 'all 0.3s' : 'background-color 0.3s', 'boxShadow': `0px 0px 25px rgba(0, 0, 0, 0.12)`,
				'backgroundColor': themesData[readerSettings.theme].backgroundColor,
				'fontFamily': fonts[readerSettings.font].family
			}">
				<div class="pageWrapper" :style="{'transform': `translateX(${pageWrapperOffset}px)`}">
					<div class="topBar" :style="{'color': themesData[readerSettings.theme].isBlack ? '#fff8' : '#0008'}">
						<div class="left">
							<i class="el-icon-arrow-left" style="margin-right: 5rpx;" @touchend.stop="navigateBack"></i>
							{{ allPages[idx].idx == 0 ? novelInfo.name :
								allArticleData[allPages[idx].articleId.toString()].title }}
						</div>
						<div class="right">
							
						</div>
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
						<div :class="`paragraph ${para.cento ? 'cento' : ''} ${para.selected ? 'selected' : ''}`" :style="{
							'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
							'fontFamily': fonts[readerSettings.font].family,
							'text-decoration-color': para.cento ? themesData[readerSettings.theme].lineColor : 'transparent'
						}" v-for="para in allArticleData[allPages[idx].articleId.toString()].content" v-show="para.type == 'text'"
							:key="para.id" @longpress="handleParagraphLongpressed($event, para)">
							<div v-show="para.value && para.value.startsWith('\u3000\u3000')" class="lineShelterBox"
								 :style="{'backgroundColor': para.selected ? blendHexColors(themesData[readerSettings.theme].backgroundColor, '#7774') : themesData[readerSettings.theme].backgroundColor, 
								 'width': readerSettings.fontSize * 2 + 'rpx',
								 'height': '20rpx', 
								 'top': readerSettings.fontSize * readerSettings.lineHeight - 20 + 'rpx'}">
							</div>
								{{ para.value }}
							<span :class="'paraEndLocate paragraphId' + para.id">
							</span>
						</div>
					</div>
					<div v-if="allPages[idx].type == 'spliter'" class="textRender spliterRender" :id="idx" :style="{
						'fontSize': readerSettings.fontSize * 1.8 + 'rpx',
						'lineHeight': readerSettings.fontSize * readerSettings.lineHeight * 1.5 + 'rpx',
						'fontWeight': 'bold',
						'fontFamily': fonts[readerSettings.font].family
					}">
						{{ allArticleData[allPages[idx].articleId.toString()].title }}
					</div>
					<div v-if="allPages[idx].type == 'image'" class="textRender imgRender" :id="idx">
						<div class='title' :style="{
							'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
							'fontSize': readerSettings.fontSize * 1.2 + 'rpx',
							'fontWeight': 'bold', 'position': 'absolute', 'top': '0'
						}" v-show="allPages[idx].idx == 0">
							{{ allArticleData[allPages[idx].articleId.toString()].title }}
						</div>
						<log-image :src="allPages[idx].url" alt="" style="width:calc(100vw - 100rpx)"/>
					</div>
				</div>
			</div>
		</div>
		<div class="bottomBar" :style="{'color': themesData[readerSettings.theme].isBlack ? '#fff8' : '#0008'}">
			<div class="left">
				{{ currentPageIdx + 1 }}/{{ allPages.length }}
			</div>
			<div class="right">
				<span class="time">{{ currentTime }}</span>
				<BatteryIcon 
					:level="battery.currentBattery"
					:is-charging="battery.isCharging"
					:size="22"
					style="margin-left: 15rpx; transform: translateY(4rpx);"
				/>
			</div>
		</div>

		<el-drawer title="选择字体" :visible.sync="showFontsSelectDrawer" :direction="'btt'" size="55%">
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

		<el-drawer :with-header="false" :visible.sync="menuDrawerVisible" direction="btt" :modal="true" size="60%"
			custom-class="bookMenu">
			<bookMenu :novel_id="novelId" @change="gotoArticleIdx($event); menuDrawerVisible = false"></bookMenu>
		</el-drawer>
		
		<el-drawer :with-header="false" :visible.sync="commentDrawerVisible" direction="btt" :modal="commentDrawerVisible" size="calc(80% + 44px)"
			custom-class="commentDrawer" :destroy-on-close="true">
			<div class="bookCommentDrawer">
				<div class="title">
					段落评论
				</div>
				<div class="closeBtn" @click="commentDrawerVisible = false">
					<i class="el-icon-close"></i>
				</div>
				<BookComment :componentMode="true" :componentData="commentDrawerData" @hide="commentDrawerVisible=false"
						     @navigate="commentDrawerVisible = false"></BookComment>
			</div>
		</el-drawer>

		<div class="floating-panel" v-show="selectionMode"
			:style="{ left: panelPosition.x + 'px', top: panelPosition.y + 'px' }">
			<div class="panel-button" @click="handleCopy">
				<i class="el-icon-document-copy"></i>
				<span>复制</span>
			</div>
			<div class="panel-button" v-show="selectedParagraph && !selectedParagraph.cento" @click="handleUnderline">
				<i class="el-icon-edit"></i>
				<span>划线</span>
			</div>
			<div class="panel-button" v-show="selectedParagraph && selectedParagraph.cento"
				@click="handleRemoveUnderline">
				<i class="el-icon-remove-outline"></i>
				<span>移除划线</span>
			</div>
			<div class="panel-button" @click="gotoParagraphComment(selectedParagraph.id)">
				<i class="el-icon-chat-line-round"></i>
				<span>评论</span>
			</div>
		</div>
		
		<div class="commentBtn" v-for="item in shownCommentsBtn" @click="gotoParagraphComment(item.paragraphId)"
			:style="{'fontSize': readerSettings.fontSize * 1.2 + 'rpx', 'left': item.x, 'top': item.y,
			'color': themesData[readerSettings.theme].fontColor}">
			<i class="el-icon-chat-square"></i>
			<div class="amount" :style="{'fontSize': readerSettings.fontSize * 0.6 + 'rpx'}">
				{{item.amount}}
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"
import {
	rpxToPx,
	pxToRpx,
	utc2beijing,
	blendHexColors
} from "../../../lib/utils.js"
import { articleDB } from "../../../lib/db.js"
import themesData from "./themesData.json"
import fontSizes from "./fontSize.json"
import fonts from "./fonts.json"
import bookMenu from '../../../components/bookMenu.vue'
import BatteryIcon from "../../../components/battery.vue"
import BookComment from "../bookComment.vue"
export default {
	data() {
		return {
			blendHexColors,
			novelInfo: undefined,
			titleMarginBottomRatio: 0.2,
			novelId: -1,
			articleId: -1,
			allArticles: [],
			readerArticleData: {},
			allArticleData: {},
			allPages: [],
			currentPageIdx: -1,
			vRenderText: [],
			vRenderTitle: "",
			vRenderShowTitle: false,
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
			showFontsSelectDrawer: false,
			onRendering: false,
			historyMode: false,
			menuDrawerVisible: false,
			chapterCentos: [],
			selectionMode: false,
			touchTimer: {
				timer: undefined,
				count: 0
			},
			panelPosition: {
				x: 0,
				y: 0
			},
			selectedParagraph: null,
			doUpdateCommentDisplay: true,
			shownCommentsBtn: [],
			pageWrapperOffset: 0,
			currentTime: '',
			battery: {
				currentBattery: 100,
				isCharging: false
			},
			timeInterval: null,
			currentArticleIdx: 0,
			isToolOpening: false,
			showSliderTooltip: false,
			sliderTooltip: {
				percent: 0,
				title: "",
				lastIdx: 0
			},
			commentDrawerVisible: false,
			commentDrawerData:{}
		}
	},
	components: { bookMenu, BatteryIcon, BookComment },
	methods: {
		loadAllPages() {
			return new Promise(async (resolve, reject) => {
				uni.showLoading({
					title: '编排页面中'
				});
				this.onRendering = true;
				// 提前存储好当前章节的阅读页数
				let historyPage = window.localStorage.getItem("ReaderHistoryPage_" + this.novelId);
				await this.calculateActualLineHeight();
				await this.calculatePageWrapperOffset();
				setTimeout(async () => {
					this.allArticles = await this.loadAllArticles();
					let articleData = await this.getArticleContentById(this.articleId);
					this.allArticleData[articleData.article_id.toString()] = articleData;
					let articlePages = await this.generateArticleRenderData(articleData);
					this.allPages = articlePages;
					this.currentPageIdx = 0;
					// 开始预渲染全部的页面
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
					let renderFlag = false;
					for (let i = 0; i < this.allArticles.length; i++) {
						if (i > centerArticleIdx) {
							let articleData = await this.getArticleContentById(this.allArticles[i].article_id,
								this.allArticles[i].update_time, true);
							this.allArticleData[articleData.article_id.toString()] = articleData;
							let articlePages = await this.generateArticleRenderData(articleData);
							this.allPages.push(...articlePages);
						}
						if (i == centerArticleIdx || i == centerArticleIdx + 1) {
							if (!renderFlag && this.historyMode) {
								this.currentPageIdx = Math.min(this.currentPageIdx + Number(historyPage), this.allPages.length - 1);
								renderFlag = true;
							}
							this.renderNewPages();
							this.showArticleCentos();
							this.shownCommentsBtn = [];
							setTimeout(() => {
								this.doUpdateCommentDisplay = true;
							}, 300)
							uni.hideLoading();
						}
					}
					this.onRendering = false;
					resolve();
				})
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
			try{
				let res = await axios.get(this.$baseUrl + '/articles/get_article?id=' + article_id, {});
				if (res.status == 200) {
					articleDB.articles.put(res.data[0]);
					if (res.data[0].article_type == "richtext") {
						res.data[0].content = JSON.parse(res.data[0].content);
					}
					return res.data[0];
				}
			} catch(e){
				setTimeout(() => {
					uni.redirectTo({
						url: "../article?id=" + this.articleId + '&novelId=' + this.novelId
					})
				}, 300)
			}
		},
		async vRenderParagraph(text, title, showTitle) {
			this.vRenderText = text;
			this.vRenderTitle = title;
			this.vRenderShowTitle = showTitle;
			await this.delay(1);
			let vPage = document.getElementById("vPage");
			return vPage.scrollHeight;
		},
		async calculateActualLineHeight() {
			let vLine = document.getElementById("vLine");
			this.actualLineHeight = vLine.getBoundingClientRect().height;
			await this.delay(1);
		},
		async calculatePageWrapperOffset() {
			let vtext = document.getElementById("vText");
			let characterWidth = vtext.getBoundingClientRect().width / 2;
			let remainder = (uni.getSystemInfoSync().screenWidth - rpxToPx(100)) % characterWidth;
			this.pageWrapperOffset = remainder / 2 * 0.8;
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
							let isEmptyParagraph = true;
							for (let text of currentTextValue) {
								if (text.replace(/(^s*)|(s*$)/g, "").length != 0) isEmptyParagraph = false;
							}
							if (!isEmptyParagraph) {
								mergedContent.push({
									type: 'text',
									value: currentTextValue
								});
							}
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
			let screenHeight = document.body.clientHeight;
			let usableScreenHeight = screenHeight - rpxToPx(100) - rpxToPx(70);
			let lineHeight = this.actualLineHeight;
			let actualLineAmount = Math.floor(usableScreenHeight / lineHeight);
			let pageScrollHeight = actualLineAmount * lineHeight;
			let vRenderContent = mergeTextContent(articleData);
			let generatedPages = [];
			this.pageActualHeight = pageScrollHeight;
			let lastParagraphHeight = 0;
			let pageIdxInArticle = 0;
			for (let k = 0; k < vRenderContent.length; k++) {
				let mergedParagraph = vRenderContent[k];
				if (mergedParagraph.type == "text") {
					let paragraphHeight = await this.vRenderParagraph(mergedParagraph.value, articleData.title, k == 0);
					let lines = paragraphHeight / lineHeight;
					for (let i = 0; i < lines / actualLineAmount; i++) {
						generatedPages.push({
							type: "text",
							scrollHeight: lastParagraphHeight + pageScrollHeight * i,
							articleId: articleData.article_id,
							viewHeight: Math.min(paragraphHeight - (pageScrollHeight * i), pageScrollHeight) +
								(pageIdxInArticle == 0 ? this.actualLineHeight * this.titleMarginBottomRatio : 0),
							idx: (pageIdxInArticle++),
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
			this.touchTimer.count = 0;
			this.touchTimer.timer = setInterval(() => {
				this.touchTimer.count += 1;
			}, 100);
			this.shownCommentsBtn = [];
		},

		handleTouchMove(e) {
			const deltaX = e.touches[0].clientX - this.touchStartX;
			this.translateX = deltaX;
			this.shownCommentsBtn = [];
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
		handleTouchEnd(e) {
			const deltaX = e.changedTouches[0].clientX - this.touchStartX;
			this.isAnimating = true;

			if (Math.abs(deltaX) > 35) { // 滑动距离超过50px才触发翻页
				if (deltaX > 0) {
					this.lastPage();
				} else if (deltaX < 0) {
					this.nextPage();
				}
			} else if (Math.abs(deltaX) <= 5) {
				if (this.touchTimer.timer, this.touchTimer.count <= 3) {
					// 如果不处于选择模式，则认为在操作页面
					if (this.selectionMode) {
						this.clearSelection();
					} else {
						let screenWidth = uni.getSystemInfoSync().screenWidth;
						let touchX = e.changedTouches[0].clientX;
						if (touchX <= screenWidth * 0.3) {
							this.lastPage();
						} else if (touchX >= screenWidth * 0.7) {
							this.nextPage();
						} else {
							this.handleOpenTool();
						}
					}
				}
			}
			clearInterval(this.touchTimer.timer)
			this.touchTimer.count = 0;
			this.translateX = 0; // 重置位移
			
			setTimeout(() => {
				this.doUpdateCommentDisplay = true;
				this.isAnimating = false;
			}, 300)
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
			if (this.currentRenderIdx.length == 0 || this.currentRenderIdx.length > 30 || !delta) {
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
				: (idx == this.currentPageIdx - 1 ? `translateX(min(0%, calc(-100%  + ${this.translateX}px)))` : (idx < this.currentPageIdx - 1 ? `translateX(calc( -100% - 25px))` : `translateX(0)`))
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
		navigateBack(ev) {
			if(getCurrentPages().length == 1) {
				uni.reLaunch({
					url: "../bookInfo?id=" + this.novelId
				})
			} else {
				uni.navigateBack();
			}
		},
		startSlideArticleIndex() {
			this.sliderTooltip.lastIdx = this.currentArticleIdx;
		},
		handleCurrentPageChange(newArticleIdx) {
			this.gotoArticleIdx(newArticleIdx)
		},
		handleSliderInput(newArticleIdx) {
			this.formatSliderTooltip(newArticleIdx);
		},
		toggleNightMode() {
			if (this.themesData[this.readerSettings.theme].isBlack) {
				this.readerSettings.theme = "white";
			} else {
				this.readerSettings.theme = "black";
			}
		},
		changeFontSize(delta) {
			if (this.onRendering) return;
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
			if (this.onRendering) return;
			this.readerSettings.lineHeight = lineHeight;
			this.allPages = [];
			this.currentRenderIdx = [];
			setTimeout(async () => {
				this.loadAllPages();
			})
		},
		selectFont(fontKey) {
			if (this.onRendering) return;
			this.readerSettings.font = fontKey;
			this.showFontsSelectDrawer = false;
			// 重新加载页面以应用新字体
			this.allPages = [];
			this.currentRenderIdx = [];
			setTimeout(async () => {
				this.loadAllPages();
			})
		},
		updateQueryParam(key, value, usePushState = false) {
			let currentUrl = new URL(window.location.href);
			currentUrl.searchParams.set(key, value);

			if (usePushState) {
				window.history.pushState({}, '', currentUrl.toString());
			} else {
				window.history.replaceState({}, '', currentUrl.toString());
			}
		},
		updateHashQueryParam(key, value, usePushState = false) {
			let hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
			let [hashPath, hashQuery] = hash.split('?'); // 拆分路径和查询参数
			let searchParams = new URLSearchParams(hashQuery || ''); // 解析查询参数

			searchParams.set(key, value); // 修改参数

			let newHash = `${hashPath}?${searchParams.toString()}`; // 重新拼接哈希部分
			let newUrl = `${window.location.origin}${window.location.pathname}#${newHash}`; // 组合完整 URL

			if (usePushState) {
				window.history.pushState({}, '', newUrl);
			} else {
				window.history.replaceState({}, '', newUrl);
			}
		},
		gotoMenu() {
			this.menuDrawerVisible = true;
		},
		// 段落划线、段落评论相关功能
		async getArticleCento(articleId) {
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;
			let res = await axios.get(this.$baseUrl + '/articles/get_my_article_cento?article_id=' + articleId, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk
				}
			});
			if (res.status == 200) {
				return res.data;
			}
		},
		async showArticleCentos() {
			if(!this.allPages[this.currentPageIdx]) return;
			let centos = await this.getArticleCento(this.allPages[this.currentPageIdx].articleId);
			for (let item of centos) {
				for (let para of this.allArticleData[this.allPages[this.currentPageIdx].articleId.toString()].content) {
					if (para.id === item.paragraph_id) {
						para.cento = item;
					}
				}
			}
			this.$forceUpdate();
		},
		handleParagraphLongpressed(event, paragraph) {
			console.log(event);
			this.clearSelection();
			const touch = event.touches[0];
			const screenWidth = uni.getSystemInfoSync().screenWidth;
			const screenHeight = uni.getSystemInfoSync().screenHeight;

			// 面板尺寸(rpx转px)
			const panelWidth = uni.upx2px(300);
			const panelHeight = uni.upx2px(100);

			// 计算初始位置(面板中心对准点击位置)
			let x = touch.clientX - (panelWidth / 2);
			let y = touch.clientY - panelHeight - 20; // 默认在触摸点上方显示

			// 确保不超出左右边界
			x = Math.max(40, Math.min(x, screenWidth - panelWidth - 40));

			// 如果上方空间不足,则显示在下方
			if (y < 10) {
				y = touch.clientY + 20;
			}

			// 确保不超出上下边界 
			y = Math.max(10, Math.min(y, screenHeight - panelHeight - 10));

			this.panelPosition = { x, y };

			paragraph.selected = true;
			this.selectedParagraph = paragraph;
			this.selectionMode = true;
			this.$forceUpdate();
		},
		async handleUnderline() {
			if (!this.selectedParagraph) return;

			// 调用添加划线API
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;

			try {
				await axios.post(this.$baseUrl + '/articles/add_article_cento', {
					article_id: this.allPages[this.currentPageIdx].articleId,
					paragraph_id: this.selectedParagraph.id,
					paragraph: this.selectedParagraph.value,
				}, {
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				});

				// 更新UI
				this.showArticleCentos();
				this.clearSelection();
			} catch (error) {
				console.error(error);
			}
		},
		async handleRemoveUnderline() {
			if (!this.selectedParagraph?.cento) return;

			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;

			try {
				await axios.post(this.$baseUrl + '/articles/remove_article_cento', {
					article_cento_id: this.selectedParagraph.cento.article_cento_id
				}, {
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				});

				// 更新UI
				this.selectedParagraph.cento = null;
				this.clearSelection();
				this.showArticleCentos();
			} catch (error) {
				console.error(error);
				uni.showToast({
					title: '移除划线失败',
					icon: 'none'
				});
			}
		},
		handleCopy() {
			if (!this.selectedParagraph) return;
			uni.setClipboardData({
				data: `${this.selectedParagraph.value}
===================
版权声明：本文为原创文章，遵循 《原木社区用户内容上传协议》，转载请附上原文出处链接和本声明。 
原文链接：http://loghome.codesocean.top/#/pages/readers/newReader/article?id=${this.articleId}`,
				success: () => {
					uni.showToast({
						title: '已复制',
						icon: 'none'
					});
					this.clearSelection();
				}
			});
		},
		clearSelection() {
			if (this.selectedParagraph) {
				this.selectedParagraph.selected = false;
			}
			this.selectedParagraph = null;
			this.selectionMode = false;
			for (let para of this.allArticleData[this.allPages[this.currentPageIdx].articleId.toString()].content) {
				para.selected = false;
			}
		},
		async getParagraphCommentsAmount(paragraphId) {
			let res = await axios.post(this.$baseUrl + '/articles/get_paragraph_comment_amount?id=' + this.novelId, 
				{paragraph_id: paragraphId, article_id: this.articleId});
			if (res.status == 200) {
				return res.data[0].count;
			}
		},
		async updateArticleCommentDisplay() {
			if(this.doUpdateCommentDisplay && !this.isAnimating) {
				this.doUpdateCommentDisplay = false;
				let currentPageDom = document.querySelector(`.articlePage.idx${this.currentPageIdx}`);
				if(!currentPageDom) return;
				let paraEndLocateDoms = currentPageDom.getElementsByClassName("paraEndLocate");
				this.shownCommentsBtn = [];
				for(let item of paraEndLocateDoms) {
					let rect = item.getBoundingClientRect();
					if(rect.y >= rpxToPx(120) && rect.y <= rpxToPx(100) + this.allPages[this.currentPageIdx].viewHeight){
						let amount = await this.getParagraphCommentsAmount(Number(item.classList[1].replace("paragraphId", '')));
						if(amount > 0){
							this.shownCommentsBtn.push({
								paragraphId: Number(item.classList[1].replace("paragraphId", '')),
								amount,
								x: rect.x,
								y: rect.y
							})
						}
					}
				}
			}
		},
		handleComment() {
			if (!this.selectedParagraph) return;
			// TODO: 实现评论功能
			uni.showToast({
				title: '评论功能开发中',
				icon: 'none'
			});
			this.clearSelection();
		},
		gotoParagraphComment(paragraphId){
			// uni.navigateTo({
			// 	url: `../bookComment?id=${this.novelId}&articleId=${this.articleId}&paragraphId=${paragraphId}`
			// });
			this.commentDrawerData = {
				novelId: this.novelId,
				articleId: this.articleId,
				paragraphId: paragraphId
			}
			this.commentDrawerVisible = true;
		},
		updateTimeAndBattery() {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0'); 
			this.currentTime = `${hours}:${minutes}`;
			if(this.jsBridge && this.jsBridge.inApp) {
				window.jsBridge.getBatteryLevel().then(batteryLevel => {
				    this.battery.currentBattery = batteryLevel;
				}).catch(error => {
				    console.error('Error getting battery level:', error);
				});
				window.jsBridge.getBatteryState().then(batteryState => {
					if(batteryState == 'charging'){
						this.battery.isCharging = true;
					} else {
						this.battery.isCharging = false;
					}
				}).catch(error => {
				    console.error('Error getting battery level:', error);
				});
			}
		},
		getArticleIdx(articleId) {
			for(let i = 0; i < this.allArticles.length; i++) {
				if(this.allArticles[i].article_id == articleId){
					return i;
				}
			}
		},
		formatSliderTooltip(val) {
			if(this.settingsOpened) this.showSliderTooltip = true;
			if(val >= 0) {
				this.sliderTooltip.percent = (val + 1) / this.allArticles.length * 100;
				this.sliderTooltip.title = this.allArticles[val].title;
			}
		},
		handleUndoSlider() {
			this.gotoArticleIdx(this.sliderTooltip.lastIdx);
		},
		handleOpenTool() {
			this.settingsOpened = true;
			this.isToolOpening = true;
			setTimeout(() => {
				this.isToolOpening = false;
			}, 300)
		},
		handleCloseTool() {
			if(!this.isToolOpening) {
				this.settingsOpened = false;
				this.showReaderSetting = false;
			}
		},
		gotoArticleIdx(newArticleIdx) {
			if(newArticleIdx < 0 || newArticleIdx >= this.allArticles.length) {
				return;
			}
			for(let i = 0; i < this.allPages.length; i ++) {
				if(this.allPages[i].articleId == this.allArticles[newArticleIdx].article_id) {
					this.currentPageIdx = i;
					break;
				}
			}
			this.currentRenderIdx = [];
			this.renderNewPages();
		}
	},
	watch: {
		currentPageIdx(newValue, oldValue) {
			if (!this.onRendering) {
				this.updateHashQueryParam('id', this.allPages[newValue].articleId, false);
				this.articleId = this.allPages[newValue].articleId;
				window.localStorage.setItem("ReaderHistory_" + this.novelInfo.novel_id, this.allArticleData[this.allPages[newValue].articleId].article_chapter);
				window.localStorage.setItem("ReaderHistoryPage_" + this.novelInfo.novel_id, this.allPages[newValue].idx);
				if (this.allPages[newValue].articleId != this.allPages[oldValue].articleId) {
					this.showArticleCentos(newValue);
					// this.getArticleComments();
				}
			}
			uni.setNavigationBarTitle({
				title:this.allArticleData[this.allPages[newValue].articleId].title
			})
			this.currentArticleIdx = this.getArticleIdx(this.allPages[newValue].articleId);
			this.doUpdateCommentDisplay = true;
		},
		readerSettings: {
			handler(newValue, oldValue) {
				window.localStorage.setItem("newReaderSettings", JSON.stringify(this.readerSettings));
				// 状态栏颜色调整
				if(this.jsBridge && this.jsBridge.inApp) {
					jsBridge.setStatusBarStyle(this.themesData[this.readerSettings.theme].isBlack)
				}
			},
			deep: true
		},
		async settingsOpened(newValue, oldValue) {
			if(this.jsBridge && this.jsBridge.inApp) {
				this.jsBridge.setNavigationBarVisible(newValue);
				if(newValue) {
					await jsBridge.disableVolumeKeyListener();
				} else {
					await jsBridge.enableVolumeKeyListener();
				}
			}
			if(newValue == false){
				this.showSliderTooltip = false;
			}
		}
	},
	computed: {
	},
	async onLoad(option) {
		this.updateTimeAndBattery(); // 初始化时间
		this.timeInterval = setInterval(() => {
			this.updateTimeAndBattery();
		}, 5000);
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
		if(option.novelId) this.novelId = option.novelId;
		let article = await this.getArticleContentById(this.articleId);
		this.novelId = article.novel_id;
		this.novelInfo = await this.getNovelInfo();
		// 判断是否是打开与上次退出时一样的章节，如果是的话则为历史回溯模式
		if (window.localStorage.getItem("ReaderHistory_" + this.novelInfo.novel_id) == article.article_chapter) {
			this.historyMode = true;
		}
		this.updateCommentDisplayTimer = setInterval(() => {
			this.updateArticleCommentDisplay();
		}, 200)
		await this.loadAllPages();
		window.onVolumnKeyPressCallback = (event) => {
		    if (event.detail === 'up') {
				this.isAnimating = true;
		        this.lastPage();
		    } else if (event.detail === 'down') {
				this.isAnimating = true;
		        this.nextPage();
		    }
		};
		window.addEventListener('volumeKeyPress', window.onVolumnKeyPressCallback);
	},
	async onUnload() {
		clearInterval(this.timeInterval);
		clearInterval(this.updateCommentDisplayTimer);
		if(this.jsBridge && this.jsBridge.inApp) {
			jsBridge.setNavigationBarVisible(true);
			await jsBridge.disableVolumeKeyListener();
		}
		window.removeEventListener('volumeKeyPress', window.onVolumnKeyPressCallback);
	},
	async onShow() {
		this.renderNewPages();
		this.showArticleCentos();
		this.shownCommentsBtn = [];
		setTimeout(() => {
			this.doUpdateCommentDisplay = true;
		}, 300)
		if(this.jsBridge && this.jsBridge.inApp) {
			jsBridge.setNavigationBarVisible(false);
			await jsBridge.enableVolumeKeyListener();
		}
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
	overflow: hidden !important;

	.readerPages {
		position: absolute;
		z-index: 2;

		.articlePage {
			padding: 50rpx 51rpx 51rpx 50rpx;
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
					border-radius: 10rpx;
					transition: all .3s;
					position: relative;
					
					.paragraphComment{
						position: fixed;
					}
					
					.lineShelterBox{
						position:absolute; 
						top: 0;
						transition: all .3s;
					}
				}

				.paragraph.selected {
					background-color: #7774;
				}

				.paragraph.cento {
					text-decoration: underline;
					text-underline-offset: 14rpx;
				}
			}

			.imgRender {
				height: calc(100vh - 170rpx);
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;
			}

			.spliterRender {
				height: calc(70vh - 170rpx);
				display: flex;
				flex-direction: column;
				justify-content: center;
			}


			.topBar {
				height: 70rpx;
				font-size: 34rpx;
				color: #0008;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
				white-space: nowrap;
				display: flex;
				.right{
					
				}
			}
		}
	}

	.bottomBar {
		position: fixed;
		bottom: 10rpx;
		left: 0px;
		width: 100%;
		z-index: 994;
		padding: 0 50rpx;
		font-size: 34rpx;
		color: #0008;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		.right {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			
			.time {
				line-height: 1;
			}
		}
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
		overflow: hidden;
		white-space: pre-wrap;
		word-wrap: break-word;
		opacity: 0;
		z-index: 0;

		.textRender {
			.paragraph {
				margin: 0;
				padding: 0;
			}
		}
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
		z-index: 995;
		visibility: hidden;
		// opacity: 0;
		transition: all .3s;

		div.topBar {
			position: absolute;
			background-color: #000000aa;
			top: 0;
			padding-top: calc(30rpx + var(--statusBarHeight));
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
		
		div.sliderTooltip{
			position: fixed;
			width: 60vw;
			left: 50vw;
			transform: translateX(-50%) scale(0);
			height: 110rpx;
			border-radius: 100rpx;
			background-color: #000a;
			opacity: 0;
			transition: all .3s;
			display: flex;
			color: #e2e2e2;
			
			.backBtn{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 70rpx;
				padding: 0 35rpx;
				.icon{
					i{
						font-size: 40rpx;
					}
				}
				.t{
					font-size: 25rpx;
				}
			}
			.text{
				color: white;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 25rpx;
				width: calc(60vw - 180rpx);
				color: #e2e2e2;
				
				.percent{
					color: #ffffff;
				}
				.title{
					margin-bottom: 10rpx;
					white-space: nowrap; /* 禁止文本换行 */
				    overflow: hidden; /* 隐藏超出范围的内容 */
				    text-overflow: ellipsis; /* 使用省略号 */
				}
			}
		}
		
		div.sliderTooltip.show{
			opacity: 1;
			transform: translateX(-50%) scale(1);
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


	.floating-panel {
		position: fixed;
		z-index: 996;
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 30rpx;
		padding: 15rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 300rpx;
		height: 100rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease; // 添加过渡动画

		.panel-button {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: white;
			padding: 10rpx;

			i {
				font-size: 40rpx;
				margin-bottom: 5rpx;
			}

			span {
				font-size: 24rpx;
			}

			&:active {
				opacity: 0.7;
			}
		}
	}
	
	.commentBtn{
		position: fixed;
		z-index: 996;
		transform: translateY(10%);
		.amount{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%) translateY(-60%);
		}
	}
	
	.commentDrawer{
		.bookCommentDrawer{
			border-radius: 16px 16px 0 0;
			.title{
				display: flex;
				justify-content: center;
				align-items: center;
				height: 44px;
				font-size: 18px;
				font-weight: bold;
			}
			.closeBtn{
				position: absolute;
				right: 10px;
				top: 10px;
				font-size: 24px;
			}
		}
	}
	
}
</style>