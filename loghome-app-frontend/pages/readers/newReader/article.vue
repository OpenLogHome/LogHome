<template>
	<div class="readerOuter" :class="{ 'block-epoch-skin': isBlockEpochSkin }" :style="readerOuterStyle">
		<div class="tools" :class="{ opened: settingsOpened }"
			@click.self="handleCloseTool" ref="tools">
			<div class="settings" :class="{ opened: settingsOpened, showReaderSetting: showReaderSetting }"
				ref="settings" :style="{
					'backgroundColor': themesData[readerSettings.theme].backgroundColor,
					'color': themesData[readerSettings.theme].fontColor
				}">
				<div v-if="!isPreviewMode" class="line">
					<div class="btn" style="width: 110rpx; margin: 0 30rpx 0 20rpx; font-size: 34rpx;" 
						 @click="sliderTooltip.lastIdx=currentArticleIdx; gotoArticleIdx(currentArticleIdx - 1)">上一章</div>
					<el-slider v-model="currentArticleIdx" :min="0" :max="allArticles.length - 1" :step="1"
						style="width: calc(100vw - 220rpx - 170rpx);" :show-tooltip='false' @touchstart.native="startSlideArticleIndex"
						@change="handleCurrentPageChange" @input="handleSliderInput"></el-slider>
					<div class="btn" style="width: 110rpx; margin: 0 20rpx 0 30rpx; font-size: 34rpx;"
						 @click="sliderTooltip.lastIdx=currentArticleIdx; gotoArticleIdx(currentArticleIdx + 1)">下一章</div>
				</div>
				<div class="line reader-shortcuts">
					<div v-if="!isPreviewMode" class="iconBtn" role="button" aria-label="目录" @click="gotoMenu">
						<i class="el-icon-tickets"></i>
						<p>目录</p>
					</div>
					<div v-if="!isPreviewMode" class="iconBtn" role="button" aria-label="书摘" @click="openExcerpts">
						<i class="el-icon-collection"></i>
						<p>书摘</p>
					</div>
					<div class="iconBtn" role="button" :aria-label="themesData[readerSettings.theme].isBlack ? '日间' : '夜间'"
						@click="toggleNightMode">
						<i class="el-icon-moon"
							v-show="!themesData[readerSettings.theme].isBlack"></i>
						<p
							v-show="!themesData[readerSettings.theme].isBlack">夜间</p>
						<i class="el-icon-sunny"
							v-show="themesData[readerSettings.theme].isBlack"></i>
						<p
							v-show="themesData[readerSettings.theme].isBlack">日间</p>
					</div>
					<div class="iconBtn" :class="{ active: showReaderSetting }" role="button" aria-label="设置"
						@click="showReaderSetting = !showReaderSetting;">
						<i class="el-icon-setting" v-show="!showReaderSetting"></i>
						<i class="el-icon-s-tools" v-show="showReaderSetting"></i>
						<p>设置</p>
					</div>
				</div>
				<div class="readerSettings">
					<div class="line" style="margin-top: 40rpx;">
						<span style="font-size: 30rpx;">阅读器</span>
						<ReaderTypeSwitch class="reader-type-switch-setting" value="page"
							@change="switchReaderType" />
					</div>
					<div class="line" style="margin-top: 40rpx;">
						<span style="font-size: 30rpx;">背景</span>
						<ReaderBackgroundPicker class="background-picker"
							:theme-options="readerThemeOptions"
							:skins="readerBackgroundSkins"
							:theme-key="readerSettings.theme"
							:skin-key="readerSettings.backgroundSkinKey || ''"
							@select-theme="changeTheme"
							@select-locked-theme="handleLockedBackgroundSkin"
							@select-skin="changeBackgroundSkin"
							@select-locked-skin="handleLockedBackgroundSkin" />
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
							<div class="btn" @click="showFontsSelectDrawer = true" v-if="canSwitchFont">
								<span :style="{ 'fontFamily': getCurrentFontFamily() }">{{
									getCurrentFontName() }}</span>
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
			<!--顶部工具栏-->
			<div class="topBar" :class="{ opened: settingsOpened }" ref="topBar" :style="{
				'backgroundColor': themesData[readerSettings.theme].backgroundColor,
				'color': themesData[readerSettings.theme].fontColor
			}">
				<i class="el-icon-arrow-left" style="font-size: 50rpx;" @click="navigateBack"></i>
				<div class="right">
					<div style="position: relative; display: inline-block;">
						<i class="el-icon-headset" style="font-size: 50rpx;" @click="openNativeAudiobookPlayer()"></i>
					<!-- <span style="position: absolute; bottom: -15rpx; right: -15rpx;
							background-color: #ff4d4f; color: white; 
							font-size: 20rpx; padding: 2rpx 6rpx;
							border-radius: 6rpx;">限免</span> -->
					</div>
				</div>
			</div>
			<!-- 滚动滚动条时显示的ToolTip -->
			<div class="sliderTooltip" :class="{'show': showSliderTooltip}" :style="{bottom: showReaderSetting ? '812rpx' : '330rpx'}">
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
					<i class="el-icon-video-play" style="color: #888; margin-left: 10rpx;"></i>
				</div>
				<div v-for="(para, idx) in vRenderText" :class="'paragraph ' + 'p' + vRenderIds[idx]" :style="{
					'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
					'fontFamily': fonts[readerSettings.font].family
				}">
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
				'fontFamily': fonts[readerSettings.font].family,
				...readerBackgroundStyle
			}">
				<div class="pageWrapper" :style="{'transform': `translateX(${pageWrapperOffset}px)`}">
					<div class="topBar" :style="{'color': themesData[readerSettings.theme].secondaryFontColor}">
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
							<span :class="'paraTitleEndLocate'" style="margin-left: 10rpx;"></span>
						</div>
						<div :class="`paragraph ${para.cento ? 'cento ' : ''}${para.selected ? 'selected ' : ''}${paragraphId==para.id || listeningParagraphId==para.id ? 'highlighted' : ''}`" :style="{
							'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
							'fontFamily': fonts[readerSettings.font].family,
							'text-decoration-color': para.cento ? themesData[readerSettings.theme].lineColor : 'transparent'
						}" v-for="para in allArticleData[allPages[idx].articleId.toString()].content" v-show="para.type == 'text'"
							:key="para.id" @longpress="handleParagraphLongpressed($event, para)">
							<div v-show="para.value && para.value.startsWith('\u3000\u3000')" class="lineShelterBox"
								 :style="{'backgroundColor': getLineShelterBackground(para),
								 'width': readerSettings.fontSize * 2 + 'rpx',
								 'height': '20rpx', 
								 'top': readerSettings.fontSize * readerSettings.lineHeight - 20 + 'rpx'}">
							</div>
								{{ para.value }}
							<span class="paraEndLocate" :data-paragraph-id="para.id">
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
						<span :class="'paraTitleEndLocate'" style="margin-left: 10rpx;"></span>
					</div>
					<worldVocabulary v-if="allPages[idx].type == 'worldVocabulary'" 
						:article="allArticleData[allPages[idx].articleId.toString()]"
						:readerSettings="readerSettings"
						:themesData="themesData"
						:fonts="fonts"
						@jumpToArticle="gotoArticleById"
					></worldVocabulary>
					<div v-if="allPages[idx].type == 'image'" class="textRender imgRender" :id="idx">
						<div class='title' :style="{
							'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
							'fontSize': readerSettings.fontSize * 1.2 + 'rpx',
							'fontWeight': 'bold', 'position': 'absolute', 'top': '0'
						}" v-show="allPages[idx].idx == 0">
							{{ allArticleData[allPages[idx].articleId.toString()].title }}
							<span :class="'paraTitleEndLocate'" style="margin-left: 10rpx;"></span>
						</div>
						<log-image :src="allPages[idx].url" alt="" style="width:calc(100vw - 100rpx)"/>
					</div>
				</div>
			</div>
		</div>
		<div class="bottomBar" :style="{'color': themesData[readerSettings.theme].secondaryFontColor}">
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

		<el-drawer v-if="canSwitchFont" title="选择字体" :visible.sync="showFontsSelectDrawer" :direction="'btt'" size="55%">
			<div class="fonts-container">
				<div class="fonts-grid">
					<div v-for="(font, key) in selectableFonts" :key="key" class="font-item"
						:class="{ 'selected': readerSettings.font === key }" @click="selectFont(key)">
						<div class="font-info">
							<div class="font-name">
								{{ font.name }}
								<span v-if="fontDownloadState[key] === 'downloading'" style="font-size: 22rpx; margin-left: 12rpx; color: #888;">
									下载中...
								</span>
							</div>
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

		<el-drawer v-if="!isPreviewMode" :with-header="false" :visible.sync="menuDrawerVisible" direction="btt" :modal="true" size="60%"
			custom-class="bookMenu">
			<bookMenu
				:novel_id="novelId"
				:currentIdx="currentArticleIdx"
				:visible="menuDrawerVisible"
				@change="gotoArticleIdx($event); menuDrawerVisible = false"
			></bookMenu>
		</el-drawer>
		
		<el-drawer v-if="!isPreviewMode" :with-header="false" :visible.sync="commentDrawerVisible" direction="btt" :modal="commentDrawerVisible" size="calc(80% + 44px)"
			custom-class="commentDrawer" :destroy-on-close="true" :wrapperClosable="false">
			<div class="bookCommentDrawer" :style="commentDrawerThemeStyle">
				<div class="drawerTitle">
					段落评论
				</div>
				<div class="closeBtn" @click="handleCloseCommentDraweraManually">
					<i class="el-icon-close"></i>
				</div>
				<BookComment :componentMode="true" :componentData="commentDrawerData" @hide="handleCloseCommentDraweraManually"
						     @commentChanged="handleParagraphCommentChanged"
						     @navigate="handleCloseCommentDraweraManually"></BookComment>
			</div>
		</el-drawer>

		<el-drawer v-if="!isPreviewMode" :with-header="false" :visible.sync="excerptDrawerVisible" direction="btt" :modal="excerptDrawerVisible" size="calc(80% + 44px)"
			custom-class="commentDrawer" :destroy-on-close="true" :wrapperClosable="false">
			<div class="bookCommentDrawer" :style="commentDrawerThemeStyle">
				<div class="drawerTitle">
					划线书摘
				</div>
				<div class="closeBtn" @click="handleCloseExcerptDrawerManually">
					<i class="el-icon-close"></i>
				</div>
				<BookExcerpts :novelId="novelId" :componentMode="true" @navigate="handleExcerptNavigation"></BookExcerpts>
			</div>
		</el-drawer>

		<AudiobookPlayer
			ref="audiobookPlayer"
			:articleIds="currentArticleIds"
			:articles="isPreviewMode && previewPayload ? [previewPayload.article] : []"
			:playlistKey="isPreviewMode ? 'preview:' + previewKey : ''"
			:coverUrl="currentNovelCover"
			:bookTitle="novelInfo ? novelInfo.name : ''"
			:startArticleId="articleId"
			@change="handleBookListenChange"
		/>

		<div class="floating-panel" v-show="selectionMode"
			:style="{ left: panelPosition.x + 'px', top: panelPosition.y + 'px' }">
			<div class="panel-button" @click="handleCopy">
				<i class="el-icon-document-copy"></i>
				<span>复制</span>
			</div>
			<div class="panel-button" v-show="!isPreviewMode && selectedParagraph && !selectedParagraph.cento" @click="handleUnderline">
				<i class="el-icon-edit"></i>
				<span>划线</span>
			</div>
			<div class="panel-button" v-show="!isPreviewMode && selectedParagraph && selectedParagraph.cento"
				@click="handleRemoveUnderline">
				<i class="el-icon-remove-outline"></i>
				<span>移除划线</span>
			</div>
			<div v-if="!isPreviewMode" class="panel-button" @click="gotoParagraphComment(selectedParagraph.id)">
				<i class="el-icon-chat-line-round"></i>
				<span>评论</span>
			</div>
			<div class="panel-button" @click="handleFeedback">
				<i class="el-icon-warning-outline"></i>
				<span>反馈</span>
			</div>
			<div class="panel-button" @click="listenFromParagraph(selectedParagraph.id)">
				<i class="el-icon-video-play"></i>
				<span>朗读</span>
			</div>
		</div>
		
		<div v-if="!isPreviewMode" class="commentBtn" v-for="item in shownCommentsBtn" :key="`comment-${item.paragraphId}`" @click="gotoParagraphComment(item.paragraphId)"
			:style="{'fontSize': readerSettings.fontSize * 1.2 + 'rpx', 'left': item.x, 'top': item.y,
			'color': themesData[readerSettings.theme].fontColor}" v-show="!settingsOpened">
			<i class="el-icon-chat-square"></i>
			<div class="amount" :style="{'fontSize': readerSettings.fontSize * 0.6 + 'rpx'}">
				{{item.amount}}
			</div>
		</div>

		<div class="listenBtn" v-for="item in shownParaTitleListenBtns" :key="`listen-${item.x}-${item.y}`" @click="playFromCurrentParagraph"
			:style="{'minHeight': readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
					 'fontSize': readerSettings.fontSize * 1.2 + 'rpx', 'left': item.x, 'top': item.y,
					 'transform': 'translateY(16rpx)',
					 'color': '#888'}" v-show="!settingsOpened">
			<i class="el-icon-video-play"></i>
		</div>

		<el-dialog
			title="错误反馈"
			:visible.sync="feedbackDialogVisible"
			width="80%"
			:before-close="handleCloseFeedbackDialog">
			<div class="feedback-container">
				<div class="paragraph-preview">
					<p>选中的段落：</p>
					<div class="paragraph-text">{{ selectedParagraph ? selectedParagraph.value : '' }}</div>
				</div>
				<div class="feedback-input">
					<p>请描述您发现的错误：</p>
					<el-input
						type="textarea"
						:rows="4"
						placeholder="请输入错误描述，如错别字、语法错误等"
						v-model="feedbackContent">
					</el-input>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseFeedbackDialog">取消</el-button>
				<el-button type="primary" @click="submitFeedback" :disabled="!feedbackContent">提交</el-button>
			</span>
		</el-dialog>
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
import fontsConfig from "./fonts.json"
import bookMenu from '../../../components/bookMenu.vue'
import BatteryIcon from "../../../components/battery.vue"
import BookComment from "../bookComment.vue"
import BookExcerpts from "../bookExcerpts.vue"
import AudiobookPlayer from "../../../components/audiobook-player.vue"
import worldVocabulary from "./worldVocabulary.vue"
import ReaderBackgroundPicker from "../../../components/ReaderBackgroundPicker.vue"
import ReaderTypeSwitch from "../../../components/ReaderTypeSwitch.vue"
import { buildReaderUrl, setReaderMode } from "../../../common/reader-mode.js"
import { readReaderPreview } from "../../../common/reader-preview.js"
import { createTreeExpReporter } from "../../../lib/treeExpReporter.js"
import { createBackgroundSkinStyle, normalizeBackgroundSkin } from "../../../common/background-skins.js"
import { getMembershipStatus } from "../../../common/membership-api.js"
import { getColorMode, getProjectThemeMode, readPageTheme, rememberPageTheme } from "../../../common/page-theme-memory.js"
const MEMBERS_ONLY_THEME_KEYS = Object.freeze([
	'wavechaser',
	'powderblue',
	'qingyun',
	'sunburst',
	'thorncrown',
	'chocolate'
]);
const NEW_READER_THEME_MEMORY_KEY = 'pageThemeMemory:newReader'
export default {
	data() {
		return {
			isPreviewMode: false,
			previewKey: '',
			previewPayload: null,
			blendHexColors,
			novelInfo: undefined,
			titleMarginBottomRatio: 0.2,
			novelId: -1,
			articleId: -1,
			paragraphId: -1,
			allArticles: [],
			readerArticleData: {},
			currentArticleIds: [],
			currentNovelCover: '',
			allArticleData: {},
			allPages: [],
			currentPageIdx: -1,
			vRenderIds: [],
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
			readerBackgroundSkins: [],
			membershipTier: '',
			backgroundSkinsLoaded: false,
			mangaRedirectGuard: false,
			fonts: JSON.parse(JSON.stringify(fontsConfig)),
			isAppEnv: false,
			fontDownloadState: {},
			runtimeLoadedFonts: {},
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
			shownCommentsBtn: [],
			paragraphCommentAmounts: {},
			paragraphCommentLoading: {},
			commentDisplayTaskId: 0,
			commentDisplayTimer: null,
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
			commentDrawerData: {},
			excerptDrawerVisible: false,
			feedbackDialogVisible: false,
			feedbackContent: '',
			listeningParagraphId: -1,
			shownParaTitleListenBtns: [],
			readExpReporter: null,
			readingProgressSyncTimer: null,
			lastSyncedReadingProgressKey: "",
			syncingReadingProgress: false,
			pendingReadingProgressSync: false
		}
	},
	components: { bookMenu, BatteryIcon, BookComment, BookExcerpts, AudiobookPlayer, worldVocabulary, ReaderBackgroundPicker, ReaderTypeSwitch },
	methods: {
		markReadActivity() {
			if (this.readExpReporter) {
				this.readExpReporter.markActive();
			}
		},
		switchReaderType(mode) {
			if (mode === 'page') return;
			const currentPage = this.allPages[this.currentPageIdx] || {};
			const paragraphIds = Array.isArray(currentPage.inPagesParagraphIds)
				? currentPage.inPagesParagraphIds
				: [];
			setReaderMode(mode);
			uni.redirectTo({
				url: buildReaderUrl(mode, {
					articleId: currentPage.articleId || this.articleId,
					novelId: this.novelId,
					paragraphId: paragraphIds[0],
					previewKey: this.previewKey
				})
			});
		},
		getCurrentReadingProgressPayload() {
			let currentPage = this.allPages[this.currentPageIdx];
			if (!currentPage || !this.novelId) {
				return null;
			}
			let articleData = this.allArticleData[currentPage.articleId] || this.allArticleData[currentPage.articleId?.toString()];
			if (!articleData || articleData.article_chapter == undefined || articleData.article_chapter == null) {
				return null;
			}
			return {
				novel_id: Number(this.novelId),
				article_id: currentPage.articleId,
				article_chapter: articleData.article_chapter,
				page_idx: currentPage.idx
			};
		},
		getReadingProgressSyncKey(payload) {
			if (!payload) {
				return "";
			}
			return `${payload.novel_id}|${payload.article_id}|${payload.article_chapter}|${payload.page_idx}`;
		},
		scheduleReadingProgressSync(delay = 800) {
			if (this.isPreviewMode) return;
			if (this.readingProgressSyncTimer) {
				clearTimeout(this.readingProgressSyncTimer);
			}
			this.readingProgressSyncTimer = setTimeout(() => {
				this.readingProgressSyncTimer = null;
				if (this.syncingReadingProgress) {
					this.pendingReadingProgressSync = true;
					return;
				}
				this.syncReadingProgress();
			}, delay);
		},
		async syncReadingProgress(force = false) {
			if (this.isPreviewMode) return;
			if (this.readingProgressSyncTimer) {
				clearTimeout(this.readingProgressSyncTimer);
				this.readingProgressSyncTimer = null;
			}
			let payload = this.getCurrentReadingProgressPayload();
			if (!payload) {
				return;
			}
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;
			if (!tk) {
				return;
			}
			if (this.syncingReadingProgress) {
				this.pendingReadingProgressSync = true;
				return;
			}
			let progressKey = this.getReadingProgressSyncKey(payload);
			if (!force && progressKey == this.lastSyncedReadingProgressKey) {
				return;
			}
			this.syncingReadingProgress = true;
			try {
				await axios.post(
					this.$baseUrl + '/library/update_reading_progress',
					payload,
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					},
				);
				this.lastSyncedReadingProgressKey = progressKey;
			} catch (error) {
				console.error("syncReadingProgress failed", error);
			} finally {
				this.syncingReadingProgress = false;
				if (this.pendingReadingProgressSync) {
					this.pendingReadingProgressSync = false;
					this.scheduleReadingProgressSync(0);
				}
			}
		},
		getDefaultFonts() {
			return JSON.parse(JSON.stringify(fontsConfig));
		},
		getCurrentFontConfig() {
			if (!this.readerSettings || !this.readerSettings.font) {
				return this.fonts.default || { name: "系统默认", family: "" };
			}
			return this.fonts[this.readerSettings.font] || this.fonts.default || { name: "系统默认", family: "" };
		},
		getCurrentFontFamily() {
			return this.getCurrentFontConfig().family || "";
		},
		getCurrentFontName() {
			return this.getCurrentFontConfig().name || "系统默认";
		},
		normalizeReaderFont() {
			if (!this.canSwitchFont) {
				this.readerSettings.font = "default";
				this.showFontsSelectDrawer = false;
				return;
			}
			if (!this.readerSettings.font || !this.fonts[this.readerSettings.font]) {
				this.readerSettings.font = "default";
			}
		},
		getServerFontVersion(font) {
			if (!font || font.font_version == undefined || font.font_version == null) {
				return "1";
			}
			return String(font.font_version);
		},
		mergeServerFonts(serverFonts) {
			let defaultFonts = this.getDefaultFonts();
			let mergedFonts = {
				default: defaultFonts.default || { name: "系统默认", family: "", familyBold: "", version: "1" }
			};
			if (!Array.isArray(serverFonts)) {
				this.fonts = mergedFonts;
				return;
			}
			for (let item of serverFonts) {
				if (!item || !item.font_key || !item.font_name || !item.regular_family || !item.regular_url) {
					continue;
				}
				mergedFonts[item.font_key] = {
					name: item.font_name,
					family: item.regular_family,
					familyBold: item.bold_family || item.regular_family,
					version: this.getServerFontVersion(item),
					regular: {
						url: item.regular_url,
						format: item.regular_format || "ttf"
					},
					bold: item.bold_url ? {
						url: item.bold_url,
						format: item.bold_format || "ttf"
					} : null
				};
			}
			this.fonts = mergedFonts;
		},
		async loadReaderFontsFromServer() {
			try {
				let res = await axios.get(this.$baseUrl + '/app/get_reader_fonts', {});
				if (res.status == 200 && Array.isArray(res.data)) {
					this.mergeServerFonts(res.data);
					return;
				}
			} catch (e) {
				console.warn("loadReaderFontsFromServer failed", e);
			}
			this.fonts = this.getDefaultFonts();
		},
		normalizeFontFormat(format) {
			let normalized = String(format || "").toLowerCase();
			if (normalized == "otf") return "opentype";
			if (normalized == "woff") return "woff";
			if (normalized == "woff2") return "woff2";
			return "truetype";
		},
		registerRuntimeFontFace(fontFamily, fontUri, format) {
			if (!fontFamily || !fontUri) {
				return;
			}
			let styleId = `reader-font-face-${String(fontFamily).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
			if (document.getElementById(styleId)) {
				return;
			}
			let style = document.createElement("style");
			style.id = styleId;
			style.innerHTML = `@font-face { font-family: "${fontFamily}"; src: url("${fontUri}") format("${this.normalizeFontFormat(format)}"); font-display: swap; }`;
			document.head.appendChild(style);
		},
		logReaderFontError(stage, error, extra = {}) {
			let debugInfo = {
				stage,
				...extra,
				errorName: error?.name || "",
				errorMessage: error?.message || String(error || ""),
				errorStack: error?.stack || ""
			};
			console.error("[reader-font]", JSON.stringify(debugInfo), error?.stack || error);
			try {
				window.__readerFontLastError = {
					at: new Date().toISOString(),
					...debugInfo
				};
			} catch (storageError) {
				console.warn("[reader-font] store debug info failed", storageError);
			}
		},
		async ensureFontAssetDownloaded(fontKey, assetConfig, assetType) {
			if (!assetConfig || !assetConfig.url || !assetConfig.family) {
				return true;
			}
			if (this.runtimeLoadedFonts[assetConfig.family]) {
				return true;
			}
			if (!window.jsBridge || !window.jsBridge.downloadFont) {
				throw new Error("downloadFont bridge unavailable");
			}
			let fontMeta = this.fonts[fontKey] || {};
			let version = String(fontMeta.version || "1");
			let bridgeFontKey = `${fontKey}_${assetType}`;
			try {
				console.log("[reader-font] start download", JSON.stringify({
					fontKey,
					bridgeFontKey,
					assetType,
					family: assetConfig.family,
					url: assetConfig.url,
					format: assetConfig.format || "ttf",
					version
				}));
				let fontUri = await window.jsBridge.downloadFont(
					bridgeFontKey,
					assetConfig.url,
					assetConfig.format || "ttf",
					version
				);
				console.log("[reader-font] downloadFont resolved", JSON.stringify({
					fontKey,
					bridgeFontKey,
					assetType,
					fontUri
				}));
				if (!fontUri || typeof fontUri !== "string") {
					throw new Error("invalid font uri");
				}
				this.registerRuntimeFontFace(assetConfig.family, fontUri, assetConfig.format);
				if (document.fonts && document.fonts.load) {
					await document.fonts.load(`16px "${assetConfig.family}"`);
					console.log("[reader-font] document.fonts.load resolved", JSON.stringify({
						fontKey,
						assetType,
						family: assetConfig.family
					}));
				}
				this.$set(this.runtimeLoadedFonts, assetConfig.family, true);
				return true;
			} catch (error) {
				this.logReaderFontError("ensureFontAssetDownloaded", error, {
					fontKey,
					bridgeFontKey,
					assetType,
					family: assetConfig.family,
					url: assetConfig.url,
					format: assetConfig.format || "ttf",
					version
				});
				throw error;
			}
		},
		async ensureRuntimeFontReady(fontKey) {
			if (!fontKey || fontKey == "default") {
				return true;
			}
			if (!this.canSwitchFont) {
				return false;
			}
			if (this.fontDownloadState[fontKey] == "downloading") {
				return false;
			}
			let targetFont = this.fonts[fontKey];
			if (!targetFont || !targetFont.regular || !targetFont.regular.url) {
				return false;
			}
			try {
				this.$set(this.fontDownloadState, fontKey, "downloading");
				await this.ensureFontAssetDownloaded(fontKey, {
					...targetFont.regular,
					family: targetFont.family
				}, "regular");
				if (targetFont.bold && targetFont.bold.url && targetFont.familyBold) {
					await this.ensureFontAssetDownloaded(fontKey, {
						...targetFont.bold,
						family: targetFont.familyBold
					}, "bold");
				}
				this.$set(this.fontDownloadState, fontKey, "ready");
				return true;
			} catch (e) {
				this.logReaderFontError("ensureRuntimeFontReady", e, {
					fontKey,
					targetFont
				});
				this.$set(this.fontDownloadState, fontKey, "failed");
				uni.showToast({
					title: "字体下载失败",
					icon: "none"
				});
				return false;
			}
		},
		async initReaderFonts() {
			this.isAppEnv = !!(window.jsBridge && window.jsBridge.inApp);
			if (!this.canSwitchFont) {
				this.fonts = { default: this.getDefaultFonts().default };
				this.normalizeReaderFont();
				return;
			}
			await this.loadReaderFontsFromServer();
			this.normalizeReaderFont();
			let ready = await this.ensureRuntimeFontReady(this.readerSettings.font);
			if (this.readerSettings.font != "default" && !ready) {
				this.readerSettings.font = "default";
			}
		},
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
					if(this.paragraphId != -1) {
						this.gotoParagraph(articleData.article_id, this.paragraphId);
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
							if (!renderFlag && this.historyMode && this.paragraphId == -1) {
								this.currentPageIdx = Math.min(this.currentPageIdx + Number(historyPage), this.allPages.length - 1);
								renderFlag = true;
							}
							this.renderNewPages();
							this.showArticleCentos();
							this.shownCommentsBtn = [];
							this.shownParaTitleListenBtns = [];
							this.scheduleCommentDisplayUpdate(80);
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
			if (this.isPreviewMode) {
				return JSON.parse(JSON.stringify(this.previewPayload.novel || {
					novel_id: this.novelId,
					name: '作品预览'
				}));
			}
			try {
				let res = await axios.get(this.$baseUrl + '/library/get_novel_by_id?id=' + this.novelId, {});
				if (res.status == 200) {
					articleDB.novels.put(res.data[0]);
					return res.data[0];
				}
			} catch(e) {
				let matchedNovels = await articleDB.novels.where("novel_id").equals(Number(this.novelId)).toArray();
				if(matchedNovels.length > 0) {
					return matchedNovels[0];
				}
			}
			
		},
		async loadAllArticles() {
			if (this.isPreviewMode) {
				return [JSON.parse(JSON.stringify(this.previewPayload.article))];
			}
			try{
				let res = await axios.get(this.$baseUrl + '/library/get_articles?id=' + this.novelId, {});
				if (res.status == 200) {
					return res.data;
				} 
			} catch(e) {
				let articles = await articleDB.articles.where("novel_id").equals(this.novelId).toArray();
				articles.sort((a, b) =>{
					return a.article_chapter - b.article_chapter;
				})
				return articles;
			}
		},
		normalizeArticleParagraphIds(articleData) {
			if (!articleData || !Array.isArray(articleData.content)) {
				return articleData;
			}
			for (let item of articleData.content) {
				if (item && item.id == undefined && item.paragraph_id != undefined) {
					item.id = item.paragraph_id;
				}
			}
			return articleData;
		},
		parseReaderArticleContent(articleData) {
			if (!articleData) {
				return articleData;
			}
			// 漫画章节由专用漫画阅读器渲染
			if (articleData.article_type == "mangaStrip" || articleData.article_type == "mangaPage") {
				if (!this.mangaRedirectGuard) {
					this.mangaRedirectGuard = true;
					uni.redirectTo({
						url: "/pages/readers/mangaReader?id=" + articleData.article_id + "&novelId=" + (this.novelId || articleData.novel_id)
					});
				}
				return articleData;
			}
			if ((articleData.article_type == "richtext" || articleData.article_type == "worldOutline") &&
				typeof articleData.content === "string") {
				articleData.content = JSON.parse(articleData.content);
			}
			return this.normalizeArticleParagraphIds(articleData);
		},
		async getArticleContentById(article_id, onlineTime, allowHistory) {
			if (this.isPreviewMode) {
				const previewArticle = JSON.parse(JSON.stringify(this.previewPayload.article));
				if (String(previewArticle.article_id) !== String(article_id)) return undefined;
				return this.parseReaderArticleContent(previewArticle);
			}
			if (allowHistory) {
				let matchedArticles = await articleDB.articles.where("article_id").equals(article_id).toArray();
				if (matchedArticles.length > 0 && utc2beijing(matchedArticles[0].update_time) >= utc2beijing(onlineTime)) {
					return this.parseReaderArticleContent(matchedArticles[0]);
				}
			}
			try{
				let res = await axios.get(this.$baseUrl + '/articles/get_article?id=' + article_id + "&isCaching=true", {});
				if (res.status == 200) {
					articleDB.articles.put(res.data[0]);
					return this.parseReaderArticleContent(res.data[0]);
				}
			} catch(e){
				let matchedArticles = await articleDB.articles.where("article_id").equals(Number(article_id)).toArray();
				if(matchedArticles.length > 0) {
					uni.showToast({
						 title: "将使用离线模式加载此书",
						 icon: "loading"
					})
					return this.parseReaderArticleContent(matchedArticles[0]);
				} else {
					setTimeout(() => {
						uni.redirectTo({
							url: "../article?id=" + this.articleId + '&novelId=' + this.novelId
						})
					}, 300)
				}
			}
		},
		async vRenderParagraph(text, ids, title, showTitle) {
			this.vRenderIds = ids;
			this.vRenderText = text;
			this.vRenderTitle = title;
			this.vRenderShowTitle = showTitle;
			await this.delay(0);
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
				let currentTextIds = [];
				let isCollecting = false;

				for (let i = 0; i < articleData.content.length; i++) {
					const item = articleData.content[i];
					if (item.type === 'text') {
						if (isCollecting) {
							currentTextValue.push(item.value);
							currentTextIds.push(item.id);
						} else {
							currentTextValue = [item.value];
							currentTextIds = [item.id];
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
									value: currentTextValue,
									ids: currentTextIds
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
			if (articleData.article_type == "worldVocabulary") return [{ type: "worldVocabulary", idx: 0, articleId: articleData.article_id }];
			let screenHeight = document.body.clientHeight;
			const systemInfo = uni.getSystemInfoSync();
			const bridge = typeof window !== "undefined" ? window.jsBridge : null;
			const safeTop = Number(bridge && bridge.statusBarHeight)
				|| Number(systemInfo.safeAreaInsets && systemInfo.safeAreaInsets.top)
				|| Number(systemInfo.statusBarHeight)
				|| 0;
			const safeBottom = Number(bridge && bridge.navigationBarHeight)
				|| Number(systemInfo.safeAreaInsets && systemInfo.safeAreaInsets.bottom)
				|| 0;
			let usableScreenHeight = screenHeight - safeTop - safeBottom - rpxToPx(50) - rpxToPx(70);
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
					let paragraphHeight = await this.vRenderParagraph(mergedParagraph.value, mergedParagraph.ids, articleData.title, k == 0);
					let paragraphDoms = document.querySelectorAll("#vPage .paragraph");
					let paraDomInfos = Array.from(paragraphDoms).map(item => ({
						y: item.getBoundingClientRect().y,
						id: item.classList[1].replace("p", "")
					}));
					let lines = paragraphHeight / lineHeight;
					for (let i = 0; i < lines / actualLineAmount; i++) {
						let inPageParaDoms = paraDomInfos.filter(item => {
							return (item.y >= i * pageScrollHeight && item.y < (i+1) * pageScrollHeight) 
						})
						let inPagesParagraphIds = inPageParaDoms.map((item => item.id));
						generatedPages.push({
							type: "text",
							scrollHeight: lastParagraphHeight + pageScrollHeight * i,
							articleId: articleData.article_id,
							viewHeight: Math.min(paragraphHeight - (pageScrollHeight * i), pageScrollHeight) +
								(pageIdxInArticle == 0 ? this.actualLineHeight * this.titleMarginBottomRatio : 0),
							idx: (pageIdxInArticle++),
							inPagesParagraphIds
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
			this.markReadActivity();
			this.touchStartX = e.touches[0].clientX;
			this.isAnimating = false;
			this.invalidateCommentDisplayUpdate();
			this.touchTimer.count = 0;
			this.touchTimer.timer = setInterval(() => {
				this.touchTimer.count += 1;
			}, 100);
			this.shownCommentsBtn = [];
			this.shownParaTitleListenBtns = [];
		},

		handleTouchMove(e) {
			const deltaX = e.touches[0].clientX - this.touchStartX;
			this.translateX = deltaX;
			this.invalidateCommentDisplayUpdate();
			this.shownCommentsBtn = [];
			this.shownParaTitleListenBtns = [];
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
				this.isAnimating = false;
				this.scheduleCommentDisplayUpdate(0);
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
			} else {
				if (this.isPreviewMode) {
					this.isAnimating = false;
					return;
				}
				if(window.jsBridge && window.jsBridge.inApp) {
					jsBridge.setNavigationBarVisible(true);
					jsBridge.disableVolumeKeyListener();
				}
				uni.navigateTo({
					url: `../bookEnd?novelId=${this.novelId}`
				})
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
				this.scheduleCommentDisplayUpdate(0);
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
			if (!this.readerSettings.font) {
				this.readerSettings.font = "default";
			}
			if (!this.themesData[this.readerSettings.theme]) {
				this.readerSettings.theme = "white";
			}
			this.$set(this.readerSettings, 'backgroundSkinKey', String(this.readerSettings.backgroundSkinKey || "").slice(0, 64));
			this.initializeReaderThemeMemory();
		},
		getReaderThemeMode(themeKey) {
			const theme = this.themesData[themeKey] || this.themesData.white;
			return typeof theme.isBlack === 'boolean'
				? (theme.isBlack ? 'dark' : 'light')
				: getColorMode(theme.backgroundColor);
		},
		rememberCurrentReaderTheme() {
			if (!this.readerSettings || !this.readerSettings.theme) return;
			rememberPageTheme(
				NEW_READER_THEME_MEMORY_KEY,
				this.getReaderThemeMode(this.readerSettings.theme),
				this.readerSettings
			);
		},
		applyReaderThemeMode(mode) {
			const fallback = {
				theme: mode === 'dark' ? 'black' : 'white',
				backgroundSkinKey: ''
			};
			const selection = readPageTheme(NEW_READER_THEME_MEMORY_KEY, mode, fallback);
			if (!selection || !this.themesData[selection.theme]) return;
			this.readerSettings.theme = selection.theme;
			this.$set(this.readerSettings, 'backgroundSkinKey', selection.backgroundSkinKey || '');
		},
		initializeReaderThemeMemory() {
			this.rememberCurrentReaderTheme();
			this.applyReaderThemeMode(this.projectThemeMode);
		},
		async loadReaderBackgroundSkins() {
			try {
				const membershipPromise = this.hasStoredToken()
					? getMembershipStatus(this.$baseUrl).catch(() => null)
					: Promise.resolve(null);
				const [res, membershipStatus] = await Promise.all([
					axios.get(this.$baseUrl + '/app/get_writer_background_skins'),
					membershipPromise
				]);
				this.membershipTier = membershipStatus && membershipStatus.active && membershipStatus.subscription
					? String(membershipStatus.subscription.membership_type || '')
					: '';
				if (MEMBERS_ONLY_THEME_KEYS.includes(this.readerSettings.theme) &&
					!this.canUseBackgroundSkin({ required_membership: 'standard' })) {
					this.readerSettings.theme = this.projectThemeMode === 'dark' ? 'black' : 'white';
					this.$set(this.readerSettings, 'backgroundSkinKey', "");
					window.localStorage.setItem("newReaderSettings", JSON.stringify(this.readerSettings));
					this.rememberCurrentReaderTheme();
				}
				if (res.status === 200 && Array.isArray(res.data)) {
					this.readerBackgroundSkins = res.data
						.map(item => normalizeBackgroundSkin({
							...item,
							is_locked: !this.canUseBackgroundSkin(item)
						}, theme => !!this.themesData[theme]))
						.filter(Boolean);
					if (this.readerSettings.backgroundSkinKey && !this.currentBackgroundSkin) {
						this.$set(this.readerSettings, 'backgroundSkinKey', "");
						window.localStorage.setItem("newReaderSettings", JSON.stringify(this.readerSettings));
						this.rememberCurrentReaderTheme();
					}
				}
			} catch (error) {
				console.warn('loadReaderBackgroundSkins failed', error);
				this.readerBackgroundSkins = [];
			} finally {
				this.backgroundSkinsLoaded = true;
			}
		},
		hasStoredToken() {
			try {
				const rawToken = window.localStorage.getItem('token');
				if (!rawToken) return false;
				let token = rawToken;
				try {
					token = JSON.parse(rawToken);
				} catch (error) { }
				return Boolean(token && (typeof token === 'string' ? token : token.tk));
			} catch (error) {
				return false;
			}
		},
		canUseBackgroundSkin(skin) {
			const requiredMembership = String(skin && skin.required_membership || 'none');
			if (requiredMembership === 'none') return true;
			if (requiredMembership === 'standard') {
				return this.membershipTier === 'standard' || this.membershipTier === 'super';
			}
			return requiredMembership === 'super' && this.membershipTier === 'super';
		},
		handleLockedBackgroundSkin(skin) {
			const superOnly = skin && skin.required_membership === 'super';
			uni.showModal({
				title: superOnly ? '超级典藏背景' : '原木典藏背景',
				content: superOnly
					? '这款背景仅限超级原木通行证用户使用。'
					: '这款背景仅限原木通行证或超级原木通行证用户使用。',
				cancelText: '暂不',
				confirmText: '查看通行证',
				success: ({ confirm }) => {
					if (confirm) uni.navigateTo({ url: '/pages/membership/index' });
				}
			});
		},
		changeTheme(themeKey) {
			if (!this.themesData[themeKey]) return;
			if (MEMBERS_ONLY_THEME_KEYS.includes(themeKey) &&
				!this.canUseBackgroundSkin({ required_membership: 'standard' })) {
				this.handleLockedBackgroundSkin({ required_membership: 'standard' });
				return;
			}
			this.readerSettings.theme = themeKey;
			this.$set(this.readerSettings, 'backgroundSkinKey', "");
			this.rememberCurrentReaderTheme();
		},
		changeBackgroundSkin(skinKey) {
			const skin = this.readerBackgroundSkins.find(item => item.skin_key === skinKey);
			if (skin && skin.is_locked) {
				this.handleLockedBackgroundSkin(skin);
				return;
			}
			this.$set(this.readerSettings, 'backgroundSkinKey', skin ? skin.skin_key : "");
			if (skin) {
				this.readerSettings.theme = skin.theme_key;
			}
			this.rememberCurrentReaderTheme();
		},
		getThemeName(themeKey) {
			return {
				white: '蛙鸣白',
				yellow: '原木黄',
				green: '草原绿',
				blue: '晴空蓝',
				purple: '末地紫',
				pink: '桃花粉',
				black: '虚空黑',
				wavechaser: '追波',
				powderblue: '粉蓝',
				qingyun: '青云',
				sunburst: '艳阳',
				thorncrown: '荆棘冠',
				chocolate: '巧克力'
			}[themeKey] || themeKey;
		},
		getLineShelterBackground(para) {
			if (this.currentBackgroundSkin) return 'transparent';
			const backgroundColor = this.themesData[this.readerSettings.theme].backgroundColor;
			if (para.selected) return blendHexColors(backgroundColor, '#7774');
			if (this.paragraphId == para.id || this.listeningParagraphId == para.id) {
				return blendHexColors(backgroundColor, '#FADD0044');
			}
			return backgroundColor;
		},
		shouldUseNativeBack() {
			const bridge = typeof window !== 'undefined' ? window.jsBridge : null;
			return !!(bridge && bridge.inApp && bridge.nativeRouterAvailable);
		},
		navigateBack(ev) {
			if (this.shouldUseNativeBack()) {
				uni.navigateBack({
					delta: 1
				});
				return;
			}
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
			const currentMode = this.getReaderThemeMode(this.readerSettings.theme);
			this.applyReaderThemeMode(currentMode === 'dark' ? 'light' : 'dark');
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
		async selectFont(fontKey) {
			if (this.onRendering) return;
			if (!this.canSwitchFont) return;
			if (!this.fonts[fontKey]) return;
			if (fontKey != "default") {
				let ready = await this.ensureRuntimeFontReady(fontKey);
				if (!ready) return;
			}
			this.readerSettings.font = fontKey;
			this.showFontsSelectDrawer = false;
			// 重新加载页面以应用新字体
			this.allPages = [];
			this.currentRenderIdx = [];
			setTimeout(async () => {
				this.loadAllPages();
			})
		},
		gotoMenu() {
			if (this.isPreviewMode) return;
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
			if (this.isPreviewMode) return;
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
			x = Math.max(40, Math.min(x, screenWidth - panelWidth - 100));

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
			if (this.isPreviewMode) return;
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
			if (this.isPreviewMode) return;
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
原文链接：http://loghome.ink/article/${this.articleId}`,
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
		getParagraphCommentAmountCache(articleId) {
			return this.paragraphCommentAmounts[String(articleId)];
		},
		hasParagraphCommentAmount(articleId, paragraphId) {
			let articleCache = this.getParagraphCommentAmountCache(articleId);
			if (!articleCache) {
				return false;
			}
			return Object.prototype.hasOwnProperty.call(articleCache, String(Number(paragraphId)));
		},
		getCachedParagraphCommentAmount(articleId, paragraphId) {
			let articleCache = this.getParagraphCommentAmountCache(articleId);
			if (!articleCache) {
				return undefined;
			}
			let paragraphKey = String(Number(paragraphId));
			if (!Object.prototype.hasOwnProperty.call(articleCache, paragraphKey)) {
				return undefined;
			}
			return Number(articleCache[paragraphKey]) || 0;
		},
		setParagraphCommentAmount(articleId, paragraphId, amount) {
			let articleKey = String(articleId);
			let paragraphKey = String(Number(paragraphId));
			if (!this.paragraphCommentAmounts[articleKey]) {
				this.$set(this.paragraphCommentAmounts, articleKey, {});
			}
			this.$set(this.paragraphCommentAmounts[articleKey], paragraphKey, Number(amount) || 0);
		},
		getParagraphCommentLoadingKey(articleId, paragraphId) {
			return `${articleId}_${paragraphId}`;
		},
		getPageParagraphIds(pageIdx) {
			let page = this.allPages[pageIdx];
			if (!page || !Array.isArray(page.inPagesParagraphIds)) {
				return [];
			}
			return Array.from(new Set(page.inPagesParagraphIds
				.map((item) => Number(item))
				.filter((item) => Number.isFinite(item) && item > 0)));
		},
		getNearbyPageParagraphIds(pageIdx, radius = 1, includeCurrent = true) {
			let currentPage = this.allPages[pageIdx];
			if (!currentPage) {
				return [];
			}
			let paragraphIds = [];
			let startIdx = Math.max(0, pageIdx - radius);
			let endIdx = Math.min(this.allPages.length - 1, pageIdx + radius);
			for (let i = startIdx; i <= endIdx; i++) {
				if (!includeCurrent && i == pageIdx) {
					continue;
				}
				let page = this.allPages[i];
				if (!page || page.articleId != currentPage.articleId) {
					continue;
				}
				paragraphIds.push(...this.getPageParagraphIds(i));
			}
			return Array.from(new Set(paragraphIds));
		},
		getCurrentPageDecorationSnapshot() {
			let pageIdx = this.currentPageIdx;
			let currentPage = this.allPages[pageIdx];
			if (!currentPage) {
				return null;
			}
			let currentPageDom = document.querySelector(`.articlePage.idx${pageIdx}`);
			if (!currentPageDom) {
				return null;
			}
			let minY = rpxToPx(90);
			let maxY = rpxToPx(80) + (currentPage.viewHeight || 0);
			let commentAnchors = Array.from(currentPageDom.querySelectorAll(".paraEndLocate[data-paragraph-id]"))
				.map((item) => {
					let rect = item.getBoundingClientRect();
					return {
						paragraphId: Number(item.dataset.paragraphId),
						x: rect.x,
						y: rect.y
					};
				})
				.filter((item) => Number.isFinite(item.paragraphId) && item.y >= minY && item.y <= maxY);
			let listenAnchors = Array.from(currentPageDom.getElementsByClassName("paraTitleEndLocate")).map((item) => {
				let rect = item.getBoundingClientRect();
				return {
					x: rect.x,
					y: rect.y
				};
			});
			return {
				pageIdx,
				articleId: currentPage.articleId,
				commentAnchors,
				listenAnchors
			};
		},
		isSamePageSnapshot(snapshot) {
			if (!snapshot) {
				return false;
			}
			let currentPage = this.allPages[this.currentPageIdx];
			return !!currentPage && snapshot.pageIdx == this.currentPageIdx && snapshot.articleId == currentPage.articleId;
		},
		buildShownCommentButtons(snapshot) {
			if (!snapshot) {
				return [];
			}
			return snapshot.commentAnchors.reduce((result, item) => {
				let amount = this.getCachedParagraphCommentAmount(snapshot.articleId, item.paragraphId);
				if (amount > 0) {
					result.push({
						paragraphId: item.paragraphId,
						amount,
						x: item.x,
						y: item.y
					});
				}
				return result;
			}, []);
		},
		scheduleCommentDisplayUpdate(delay = 0) {
			if (this.isPreviewMode) {
				this.shownCommentsBtn = [];
			}
			this.commentDisplayTaskId += 1;
			let taskId = this.commentDisplayTaskId;
			if (this.commentDisplayTimer) {
				clearTimeout(this.commentDisplayTimer);
			}
			this.commentDisplayTimer = setTimeout(() => {
				this.commentDisplayTimer = null;
				this.refreshCurrentPageDecorations(taskId);
			}, delay);
		},
		invalidateCommentDisplayUpdate() {
			this.commentDisplayTaskId += 1;
			if (this.commentDisplayTimer) {
				clearTimeout(this.commentDisplayTimer);
				this.commentDisplayTimer = null;
			}
		},
		async refreshCurrentPageDecorations(taskId) {
			if (taskId != this.commentDisplayTaskId || this.isAnimating) {
				return;
			}
			await new Promise((resolve) => this.$nextTick(resolve));
			await this.delay(0);
			if (taskId != this.commentDisplayTaskId || this.isAnimating) {
				return;
			}
			let snapshot = this.getCurrentPageDecorationSnapshot();
			if (!snapshot) {
				this.shownCommentsBtn = [];
				this.shownParaTitleListenBtns = [];
				return;
			}
			this.shownParaTitleListenBtns = snapshot.listenAnchors;
			if (this.isPreviewMode) {
				this.shownCommentsBtn = [];
				return;
			}
			this.shownCommentsBtn = this.buildShownCommentButtons(snapshot);
			let currentParagraphIds = snapshot.commentAnchors.map((item) => item.paragraphId);
			if (currentParagraphIds.length) {
				await this.ensureParagraphCommentAmounts(snapshot.articleId, currentParagraphIds);
				if (taskId != this.commentDisplayTaskId || this.isAnimating || !this.isSamePageSnapshot(snapshot)) {
					return;
				}
				this.shownCommentsBtn = this.buildShownCommentButtons(snapshot);
			}
			this.prefetchNearbyParagraphCommentAmounts(snapshot.pageIdx, 1);
		},
		async getParagraphCommentsAmount(articleId, paragraphId) {
			let res = await axios.post(this.$baseUrl + '/articles/get_paragraph_comment_amount?id=' + this.novelId,
				{ paragraph_id: paragraphId, article_id: articleId });
			if (res.status == 200 && Array.isArray(res.data) && res.data[0]) {
				return Number(res.data[0].count) || 0;
			}
			return 0;
		},
		async getParagraphCommentsAmountBatch(articleId, paragraphIds) {
			let normalizedParagraphIds = Array.from(new Set(paragraphIds
				.map((item) => Number(item))
				.filter((item) => Number.isFinite(item) && item > 0)));
			let commentAmounts = {};
			for (let paragraphId of normalizedParagraphIds) {
				commentAmounts[paragraphId] = 0;
			}
			if (!normalizedParagraphIds.length) {
				return commentAmounts;
			}
			try {
				let res = await axios.post(this.$baseUrl + '/articles/get_paragraph_comment_amounts?id=' + this.novelId, {
					article_id: articleId,
					paragraph_ids: normalizedParagraphIds
				});
				if (res.status == 200 && Array.isArray(res.data)) {
					for (let item of res.data) {
						let paragraphId = Number(item.paragraph_id);
						if (Number.isFinite(paragraphId)) {
							commentAmounts[paragraphId] = Number(item.count) || 0;
						}
					}
					return commentAmounts;
				}
			} catch (error) {
				if (error?.response?.status == 404) {
					console.warn("get_paragraph_comment_amounts is unavailable, fallback to single requests");
				} else {
					console.error("getParagraphCommentsAmountBatch failed", error);
				}
			}
			let fallbackResults = await Promise.all(normalizedParagraphIds.map(async (paragraphId) => {
				try {
					let amount = await this.getParagraphCommentsAmount(articleId, paragraphId);
					return [paragraphId, amount];
				} catch (error) {
					console.error("getParagraphCommentsAmount fallback failed", articleId, paragraphId, error);
					return [paragraphId, 0];
				}
			}));
			for (let [paragraphId, amount] of fallbackResults) {
				commentAmounts[paragraphId] = Number(amount) || 0;
			}
			return commentAmounts;
		},
		async ensureParagraphCommentAmounts(articleId, paragraphIds) {
			let normalizedParagraphIds = Array.from(new Set(paragraphIds
				.map((item) => Number(item))
				.filter((item) => Number.isFinite(item) && item > 0)));
			if (!normalizedParagraphIds.length) {
				return;
			}
			let loadingPromises = [];
			let paragraphIdsToLoad = [];
			for (let paragraphId of normalizedParagraphIds) {
				if (this.hasParagraphCommentAmount(articleId, paragraphId)) {
					continue;
				}
				let loadingKey = this.getParagraphCommentLoadingKey(articleId, paragraphId);
				if (this.paragraphCommentLoading[loadingKey]) {
					loadingPromises.push(this.paragraphCommentLoading[loadingKey]);
					continue;
				}
				paragraphIdsToLoad.push(paragraphId);
			}
			if (paragraphIdsToLoad.length) {
				let requestPromise = this.getParagraphCommentsAmountBatch(articleId, paragraphIdsToLoad)
					.then((commentAmounts) => {
						for (let paragraphId of paragraphIdsToLoad) {
							this.setParagraphCommentAmount(articleId, paragraphId, commentAmounts[paragraphId] || 0);
						}
					})
					.finally(() => {
						for (let paragraphId of paragraphIdsToLoad) {
							this.$delete(this.paragraphCommentLoading,
								this.getParagraphCommentLoadingKey(articleId, paragraphId));
						}
					});
				for (let paragraphId of paragraphIdsToLoad) {
					this.$set(this.paragraphCommentLoading,
						this.getParagraphCommentLoadingKey(articleId, paragraphId), requestPromise);
				}
				loadingPromises.push(requestPromise);
			}
			if (loadingPromises.length) {
				await Promise.allSettled(Array.from(new Set(loadingPromises)));
			}
		},
		prefetchNearbyParagraphCommentAmounts(pageIdx, radius = 1) {
			let currentPage = this.allPages[pageIdx];
			if (!currentPage) {
				return;
			}
			let nearbyParagraphIds = this.getNearbyPageParagraphIds(pageIdx, radius, false);
			if (!nearbyParagraphIds.length) {
				return;
			}
			this.ensureParagraphCommentAmounts(currentPage.articleId, nearbyParagraphIds);
		},
		async refreshParagraphCommentAmount(articleId, paragraphId) {
			let normalizedParagraphId = Number(paragraphId);
			if (!Number.isFinite(normalizedParagraphId) || normalizedParagraphId <= 0) {
				return;
			}
			try {
				let amount = await this.getParagraphCommentsAmount(articleId, normalizedParagraphId);
				this.setParagraphCommentAmount(articleId, normalizedParagraphId, amount);
				this.scheduleCommentDisplayUpdate(0);
			} catch (error) {
				console.error("refreshParagraphCommentAmount failed", error);
			}
		},
		applyParagraphCommentAmountDelta(articleId, paragraphId, delta) {
			let normalizedArticleId = Number(articleId);
			let normalizedParagraphId = Number(paragraphId);
			let normalizedDelta = Number(delta);
			if (!Number.isFinite(normalizedArticleId) || !Number.isFinite(normalizedParagraphId) ||
				normalizedParagraphId <= 0 || !Number.isFinite(normalizedDelta) || normalizedDelta == 0) {
				return;
			}
			if (!this.hasParagraphCommentAmount(normalizedArticleId, normalizedParagraphId)) {
				return;
			}
			let currentAmount = this.getCachedParagraphCommentAmount(normalizedArticleId, normalizedParagraphId);
			let nextAmount = Math.max(0, (Number.isFinite(currentAmount) ? currentAmount : 0) + normalizedDelta);
			this.setParagraphCommentAmount(normalizedArticleId, normalizedParagraphId, nextAmount);
			this.scheduleCommentDisplayUpdate(0);
		},
		handleParagraphCommentChanged(payload = {}) {
			let articleId = payload.articleId ?? this.commentDrawerData.articleId;
			let paragraphId = payload.paragraphId ?? this.commentDrawerData.paragraphId;
			if (!Number.isFinite(Number(paragraphId)) || Number(paragraphId) <= 0) {
				return;
			}
			if (payload.delta) {
				this.applyParagraphCommentAmountDelta(articleId, paragraphId, payload.delta);
			}
			this.refreshParagraphCommentAmount(articleId, paragraphId);
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
		getParagraphText(articleId, paragraphId) {
			const targetArticleId = articleId ?? this.allPages[this.currentPageIdx]?.articleId ?? this.articleId;
			const targetParagraphId = Number(paragraphId);
			const articleData = this.allArticleData[targetArticleId] || this.allArticleData[String(targetArticleId)];
			if (!articleData || !Array.isArray(articleData.content) || !Number.isFinite(targetParagraphId)) {
				return '';
			}
			const targetParagraph = articleData.content.find((item) => {
				if (!item || (item.type && item.type !== 'text')) {
					return false;
				}
				return Number(item.id ?? item.paragraph_id) === targetParagraphId;
			});
			if (!targetParagraph) {
				return '';
			}
			return Array.isArray(targetParagraph.value) ? targetParagraph.value.join('') : (targetParagraph.value || '');
		},
		gotoParagraphComment(paragraphId){
			if (this.isPreviewMode) return;
			const currentArticleId = this.allPages[this.currentPageIdx]?.articleId ?? this.articleId;
			this.commentDrawerData = {
				novelId: this.novelId,
				articleId: currentArticleId,
				paragraphId: paragraphId,
				paragraphText: this.getParagraphText(currentArticleId, paragraphId)
			}
			this.commentDrawerVisible = true;
			window.history.pushState({ isCommentDrawerOpen: true }, '', window.location.href)
		},
		async closeCommentDrawer(syncHistory = false) {
			let commentData = { ...this.commentDrawerData };
			this.commentDrawerVisible = false;
			if (syncHistory) {
				// #ifdef H5
				window.history.go(-1)
				// #endif
			}
			await this.refreshParagraphCommentAmount(commentData.articleId, commentData.paragraphId);
		},
		updateTimeAndBattery() {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0'); 
			this.currentTime = `${hours}:${minutes}`;
			if(window.jsBridge && window.jsBridge.inApp) {
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
				this.currentPageIdx = 0;
				if(this.allPages[i].articleId == this.allArticles[newArticleIdx].article_id) {
					this.currentPageIdx = i;
					break;
				}
			}
			this.currentRenderIdx = [];
			this.renderNewPages();
		},
		gotoParagraph(articleId, paragraphId) {
			console.log("gotoParagraph", articleId, paragraphId);
			for(let i = 0; i < this.allPages.length; i ++) {
				let page = this.allPages[i];
				if(page.articleId == articleId && page.inPagesParagraphIds && (page.inPagesParagraphIds.indexOf(String(paragraphId)) != -1 || paragraphId == -1)) {
					this.currentPageIdx = i;
					this.currentRenderIdx = [];
					this.paragraphId = paragraphId;
					this.renderNewPages();
					setTimeout(() => {
						this.paragraphId = -1;
					}, 2000)
					return;
				}
			}
		},
		gotoArticleById(articleId) {
			for(let i = 0; i < this.allPages.length; i ++) {
				this.currentPageIdx = 0;
				if(this.allPages[i].articleId == articleId) {
					this.currentPageIdx = i;
					break;
				}
			}
			this.currentRenderIdx = [];
			this.renderNewPages();
		},
		browserBack() {
			if(this.commentDrawerVisible) {
				this.closeCommentDrawer(false);
			} else if(this.excerptDrawerVisible) {
				this.excerptDrawerVisible = false;
			}
		},
		handleNativeBack(event) {
			if(this.commentDrawerVisible || this.excerptDrawerVisible) {
				event.preventDefault();
				window.history.go(-1);
				return;
			}
		},
		handleCloseCommentDraweraManually() {
			this.closeCommentDrawer(true);
		},
		handleCloseExcerptDrawerManually() {
			// #ifdef H5
			window.history.go(-1)
			// #endif
			this.excerptDrawerVisible = false;
		},
		openExcerpts() {
			if (this.isPreviewMode) return;
			this.excerptDrawerVisible = true;
			window.history.pushState({ isExcerptDrawerOpen: true }, '', window.location.href)
		},
		async openNativeAudiobookPlayer(startParagraphId = null) {
			// 设置当前文章ID列表，从当前章节开始
			this.currentArticleIds = [];
			for (let i = 0; i < this.allArticles.length; i++) {
				if(this.allArticles[i].article_type == "richtext" || this.allArticles[i].article_type == "spliter" || this.allArticles[i].article_type == "worldOutline"){
					this.currentArticleIds.push(this.allArticles[i].article_id);
				}
			}
			// 设置小说封面
			if (this.novelInfo && this.novelInfo.picUrl) {
				this.currentNovelCover = this.novelInfo.picUrl;
			}
			await this.$nextTick();
			return this.$refs.audiobookPlayer.openNativePlayer(startParagraphId);
		},
		handleBookListenChange(data){
			console.log("handleBookListenChange", data.articleId, data.paragraphId);
			this.gotoParagraph(data.articleId, data.paragraphId);
			this.listeningParagraphId = data.paragraphId;
		},
		playFromCurrentParagraph() {
			this.openNativeAudiobookPlayer(-1);
		},
		listenFromParagraph(paragraphId) {
			this.openNativeAudiobookPlayer(paragraphId);
		},
		handleExcerptNavigation(data) {
			// 关闭书摘抽屉
			this.handleCloseExcerptDrawerManually();
			this.gotoParagraph(data.articleId, data.paragraphId);
		},
		handleFeedback() {
			this.feedbackDialogVisible = true;
		},
		handleCloseFeedbackDialog() {
			this.feedbackDialogVisible = false;
			this.feedbackContent = '';
		},
		async submitFeedback() {
			if (!this.selectedParagraph) return;

			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;

			try {
				await axios.post(this.$baseUrl + '/articles/submit_feedback', {
					article_id: this.allPages[this.currentPageIdx].articleId,
					paragraph_id: this.selectedParagraph.id,
					feedback_content: this.feedbackContent,
					feedback_type: 'error' // 错误反馈类型
				}, {
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				});
				uni.showToast({
					title: '反馈提交成功',
					icon: 'none'
				});
				this.handleCloseFeedbackDialog();
				this.clearSelection();
			} catch (error) {
				console.error(error);
				uni.showToast({
					title: '反馈提交失败',
					icon: 'none'
				});
			}
		}
	},
	watch: {
		projectThemeMode(newMode, oldMode) {
			if (newMode !== oldMode) this.applyReaderThemeMode(newMode);
		},
		currentPageIdx(newValue, oldValue) {
			let newPage = this.allPages[newValue];
			let oldPage = this.allPages[oldValue];
			if (!newPage) {
				return;
			}
			if (!this.onRendering && !this.isPreviewMode) {
				if(!oldPage || newPage.articleId != oldPage.articleId) {
					axios.get(this.$baseUrl + '/articles/novel_clicked?id=' + newPage.articleId, {});
				}
				this.articleId = newPage.articleId;
				window.localStorage.setItem("ReaderHistory_" + this.novelInfo.novel_id, this.allArticleData[newPage.articleId].article_chapter);
				window.localStorage.setItem("ReaderHistoryPage_" + this.novelInfo.novel_id, newPage.idx);
				this.scheduleReadingProgressSync();
				if (!oldPage || newPage.articleId != oldPage.articleId) {
					this.showArticleCentos(newValue);
				}
			}
			uni.setNavigationBarTitle({
				title:this.allArticleData[newPage.articleId].title
			})
			this.currentArticleIdx = this.getArticleIdx(newPage.articleId);
			this.shownCommentsBtn = [];
			this.shownParaTitleListenBtns = [];
			this.scheduleCommentDisplayUpdate(80);
			this.markReadActivity();
		},
		readerSettings: {
			handler(newValue, oldValue) {
				window.localStorage.setItem("newReaderSettings", JSON.stringify(this.readerSettings));
				// 状态栏颜色调整
				if(window.jsBridge && window.jsBridge.inApp) {
					jsBridge.setSystemUIStyle(this.themesData[this.readerSettings.theme].backgroundColor, this.themesData[this.readerSettings.theme].fontColor);
				}
			},
			deep: true
		},
		async settingsOpened(newValue, oldValue) {
			if(window.jsBridge && window.jsBridge.inApp) {
				window.jsBridge.setNavigationBarVisible(newValue);
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
		projectThemeMode() {
			return getProjectThemeMode(this.$store);
		},
		commentDrawerThemeStyle() {
			const isDark = this.projectThemeMode === 'dark';
			return {
				'--comment-drawer-background': isDark ? '#252525' : '#ffffff',
				'--comment-drawer-title-color': isDark ? '#e5e5e5' : '#292927',
				'--comment-drawer-border-color': isDark ? '#3d3d3d' : '#efefef',
				'--comment-drawer-close-color': isDark ? '#b5b5b5' : '#909399'
			};
		},
		readerThemeOptions() {
			return Object.keys(this.themesData).filter(key => key !== 'blockepoch').map(key => {
				const requiredMembership = MEMBERS_ONLY_THEME_KEYS.includes(key) ? 'standard' : 'none';
				return {
					key,
					name: this.getThemeName(key),
					backgroundColor: this.themesData[key].backgroundColor,
					required_membership: requiredMembership,
					is_locked: !this.canUseBackgroundSkin({ required_membership: requiredMembership })
				};
			});
		},
		currentBackgroundSkin() {
			const skinKey = String(this.readerSettings.backgroundSkinKey || "");
			return this.readerBackgroundSkins.find(item => item.skin_key === skinKey && !item.is_locked) || null;
		},
		isBlockEpochSkin() {
			return Boolean(this.currentBackgroundSkin && this.currentBackgroundSkin.skin_key === 'block_epoch');
		},
		readerBackgroundStyle() {
			const backgroundStyle = createBackgroundSkinStyle(this.currentBackgroundSkin);
			if (['obsidian_orbit', 'ember_library'].includes(
				this.currentBackgroundSkin && this.currentBackgroundSkin.skin_key
			)) {
				backgroundStyle.backgroundSize = '100% 100%';
			}
			return backgroundStyle;
		},
		readerOuterStyle() {
			return {
				backgroundColor: this.themesData[this.readerSettings.theme].backgroundColor,
				...this.readerBackgroundStyle
			};
		},
		canSwitchFont() {
			return this.isAppEnv && !!(window.jsBridge && window.jsBridge.downloadFont);
		},
		selectableFonts() {
			if (this.canSwitchFont) {
				return this.fonts;
			}
			return { default: this.fonts.default || { name: "系统默认", family: "" } };
		}
	},
	async onLoad(option) {
		this.previewKey = String(option.previewKey || '');
		this.previewPayload = readReaderPreview(this.previewKey);
		this.isPreviewMode = !!this.previewPayload;
		if (this.previewKey && !this.previewPayload) {
			uni.showToast({ title: '预览内容已失效', icon: 'none' });
			setTimeout(() => uni.navigateBack(), 300);
			return;
		}
		if (!this.isPreviewMode) {
			this.readExpReporter = createTreeExpReporter(this, 'read_seconds', { activeWindowMs: 180000 });
			this.readExpReporter.start();
		}
		this.updateTimeAndBattery(); // 初始化时间
		this.timeInterval = setInterval(() => {
			this.updateTimeAndBattery();
		}, 5000);
		this.loadReaderSettings();
		await Promise.all([this.initReaderFonts(), this.loadReaderBackgroundSkins()]);
		uni.showLoading({
			title: '努力加载中'
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
		if(option.paragraphId) this.paragraphId = option.paragraphId;
		let article = await this.getArticleContentById(this.articleId);
		this.novelId = article.novel_id;
		this.novelInfo = await this.getNovelInfo();
		// 判断是否是打开与上次退出时一样的章节，如果是的话则为历史回溯模式
		if (!this.isPreviewMode && window.localStorage.getItem("ReaderHistory_" + this.novelInfo.novel_id) == article.article_chapter) {
			this.historyMode = true;
		}
		await this.loadAllPages();
		if (!this.isPreviewMode) this.scheduleReadingProgressSync(0);
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
		// #ifdef H5
		window.addEventListener('popstate', this.browserBack)
		// #endif
		window.addEventListener('loghomeNativeBack', this.handleNativeBack)
	},
	async onUnload() {
		if (this.readExpReporter) {
			await this.readExpReporter.stop();
		}
		await this.syncReadingProgress(true);
		clearInterval(this.timeInterval);
		this.invalidateCommentDisplayUpdate();
		if(window.jsBridge && window.jsBridge.inApp) {
			jsBridge.setNavigationBarVisible(true);
			await jsBridge.disableVolumeKeyListener();
		}
		window.removeEventListener('volumeKeyPress', window.onVolumnKeyPressCallback);
		// #ifdef H5
		window.removeEventListener("popstate", this.browserBack);
		// #endif
		window.removeEventListener('loghomeNativeBack', this.handleNativeBack)
	},
	async onHide() {
		if (this.readExpReporter) {
			await this.readExpReporter.stop();
		}
		await this.syncReadingProgress(true);
	},
	async onShow() {
		this.applyReaderThemeMode(this.projectThemeMode);
		if (this.readExpReporter) {
			this.readExpReporter.start();
			this.readExpReporter.markActive();
		}
		if (this.backgroundSkinsLoaded) await this.loadReaderBackgroundSkins();
		if (this.canSwitchFont && this.readerSettings.font && this.readerSettings.font != "default") {
			await this.ensureRuntimeFontReady(this.readerSettings.font);
		}
		this.renderNewPages();
		this.showArticleCentos();
		this.shownCommentsBtn = [];
		this.shownParaTitleListenBtns = [];
		this.scheduleCommentDisplayUpdate(80);
		if(window.jsBridge && window.jsBridge.inApp) {
			jsBridge.setNavigationBarVisible(false);
			await jsBridge.enableVolumeKeyListener();
		}
	}
}
</script>

<style scoped lang="scss">
.drawer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.drawer-title {
	font-size: 18px;
	font-weight: bold;
}

.drawer-close {
	cursor: pointer;
	font-size: 20px;
}

.readerOuter {
	height: 100vh;
	overflow: hidden !important;

		.readerPages {
			position: absolute;
			z-index: 2;

			.articlePage {
				padding: calc(20rpx + var(--loghome-safe-top, 0px)) 51rpx
					calc(31rpx + var(--loghome-safe-bottom, 0px)) 50rpx;
				width: calc(100vw - 100rpx);
				height: calc(100vh - 50rpx - var(--loghome-safe-top, 0px) - var(--loghome-safe-bottom, 0px));
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

				.paragraph.highlighted {
					background-color: #FADD0044;
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
		bottom: calc(10rpx + var(--loghome-safe-bottom, 0px));
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
			padding-top: calc(30rpx + var(--loghome-safe-top, 0px));
			padding-left: 30rpx;
			padding-right: 30rpx;
			width: calc(100vw - 60rpx);
			height: 75rpx;
			transform: translateY(-120%);
			color: rgb(203, 203, 203);
			transition: all .3s;
			display: flex;
			justify-content: space-between;
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
				padding-bottom: calc(30rpx + var(--loghome-safe-bottom, 0px));
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
				.reader-type-switch-setting {
					width: 85%;
				}

				.background-picker {
					width: 85%;
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

				&.reader-shortcuts {
					justify-content: space-between;
					gap: 14rpx;
					margin-top: 28rpx;

					.iconBtn {
						flex: 1 1 0;
						min-width: 0;
						height: 112rpx;
						background: rgba(127, 127, 127, 0.1);
						border: 2rpx solid rgba(127, 127, 127, 0.2);
						border-radius: 18rpx;
						box-sizing: border-box;
						transition: transform .18s ease, background-color .18s ease, box-shadow .18s ease;

						i {
							font-size: 42rpx;
							line-height: 46rpx;
						}

						p {
							margin: 7rpx 0 0;
							font-size: 23rpx;
							line-height: 28rpx;
						}

						&:active {
							transform: translateY(2rpx) scale(0.97);
						}

						&.active {
							background: rgba(127, 127, 127, 0.2);
							box-shadow: inset 0 0 0 2rpx currentColor;
						}
					}
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
			transform: translateY(0rpx + 457rpx);
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
					max-width: calc(60vw - 180rpx);
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
		width: 400rpx;
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
	
	.commentBtn, .listenBtn{
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
	
	.bookCommentDrawer{
		height: 100%;
		border-radius: 16px 16px 0 0;
		background-color: var(--comment-drawer-background, #fff);
		.drawerTitle{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 44px;
			font-size: 18px;
			font-weight: bold;
			color: var(--comment-drawer-title-color, #292927);
			background-color: var(--comment-drawer-background, #fff);
			border-bottom: 1px solid var(--comment-drawer-border-color, #efefef);
		}
		.closeBtn{
			position: absolute;
			right: 10px;
			top: 10px;
			font-size: 24px;
			color: var(--comment-drawer-close-color, #909399);
		}
	}
	
}

.readerOuter.block-epoch-skin {
	.readerPages .articlePage {
		box-shadow: inset 0 0 0 4rpx rgba(39, 52, 33, 0.34), 0 0 25px rgba(0, 0, 0, 0.12) !important;
	}

	.readerPages .articlePage .title {
		text-shadow: 2rpx 2rpx 0 rgba(255, 255, 255, 0.62);
	}

	.readerPages .articlePage .textRender .paragraph.cento {
		text-decoration-style: dashed;
		text-decoration-thickness: 3rpx;
	}

	.tools .settings .btn {
		border: 3rpx solid currentColor;
		border-radius: 0;
		box-shadow: 5rpx 5rpx 0 rgba(39, 52, 33, 0.28);
	}

	.tools .settings .reader-shortcuts .iconBtn {
		height: 116rpx;
		padding: 10rpx 6rpx 9rpx;
		background: rgba(239, 244, 216, 0.78);
		border: 3rpx solid rgba(39, 52, 33, 0.76);
		border-radius: 4rpx;
		box-shadow: 5rpx 5rpx 0 rgba(39, 52, 33, 0.24);

		i {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 54rpx;
			height: 54rpx;
			background: #273421;
			box-shadow: inset -5rpx -5rpx 0 rgba(0, 0, 0, 0.22), inset 4rpx 4rpx 0 rgba(255, 255, 255, 0.12);
			color: #e7edcf;
			font-size: 36rpx;
			line-height: 54rpx;
		}

		p {
			margin-top: 7rpx;
			color: #273421;
			font-size: 22rpx;
			font-weight: 700;
		}

		&.active {
			background: #d7a928;
			box-shadow: inset 0 0 0 3rpx #fff1a6, 5rpx 5rpx 0 rgba(39, 52, 33, 0.3);
		}
	}

		.bottomBar {
			bottom: var(--loghome-safe-bottom, 0px);
		padding-top: 7rpx;
		padding-bottom: 7rpx;
		border-top: 5rpx solid rgba(39, 52, 33, 0.48);
		background: linear-gradient(90deg, rgba(75, 81, 77, 0.24) 50%, rgba(54, 60, 57, 0.24) 50%);
		background-size: 44rpx 44rpx;
		font-family: ui-monospace, "SFMono-Regular", Consolas, monospace;
		font-weight: 700;
	}
}

.feedback-container {
	.paragraph-preview {
		margin-bottom: 20rpx;
		p {
			font-size: 28rpx;
			color: #606266;
			margin-bottom: 10rpx;
		}
		.paragraph-text {
			background-color: #f5f7fa;
			padding: 15rpx;
			border-radius: 8rpx;
			font-size: 30rpx;
			line-height: 1.5;
			max-height: 200rpx;
			overflow-y: auto;
		}
	}
	.feedback-input {
		p {
			font-size: 28rpx;
			color: #606266;
			margin-bottom: 10rpx;
		}
	}
}
</style>
