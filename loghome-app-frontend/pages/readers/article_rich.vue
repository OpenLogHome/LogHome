<template>
	<view class="content" :class="[readerSettings.theme, { 'block-epoch-skin': isBlockEpochSkin }]"
		:style="readerPageStyle" @tap="contentTapped">
		<view v-if="currentBackgroundSkin" class="reader-background-layer" :style="readerBackgroundLayerStyle"></view>
		<el-alert title="提示" type="info" close-text="知道了" :description="'经审核，本文' + article.warn_status + '，请酌情选读。'"
			show-icon v-show="article.warn_status && article.warn_status != 'None'" style="margin-bottom: 50rpx;"
			effect="dark">
		</el-alert>
		<div class="tools" :class="{ opened: settingsOpened }" @click.self="toolsOuterClicked" ref="tools">
			<div class="settings" :class="{ opened: settingsOpened, preview: isPreviewMode }" ref="settings">
				<div class="readerTypeSettingRow">
					<span class="settingLabel">阅读器</span>
					<ReaderTypeSwitch class="reader-type-switch-setting" value="text"
						@change="switchReaderType" />
				</div>
				<div class="line">
					<div class="button" @click="changeFontSize(+1)">A+</div>
					<div class="button" @click="changeFontSize(-1)">A-</div>
					<div class="button" :class="{ 'selected': readerSettings.lineHeightMode == 0 }"
						@click="changeLineHeight(0)">窄</div>
					<div class="button" :class="{ 'selected': readerSettings.lineHeightMode == 1 }"
						@click="changeLineHeight(1)">中</div>
					<div class="button" :class="{ 'selected': readerSettings.lineHeightMode == 2 }"
						@click="changeLineHeight(2)">宽</div>
					<div v-if="!isPreviewMode" class="button" @click="gotoMenu">目录</div>
					<div class="button" @click.stop="openNativeAudiobookPlayer()">听书</div>
				</div>
				<div class="backgroundSettingRow">
					<span class="backgroundLabel">背景</span>
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
				<div v-if="!isPreviewMode" class="line">
					<button type="default" class="inTopBar"
						:class="[{ enabled: article.article_chapter != firstArticleChapter }, readerSettings.theme]"
						@click="changePage(-1)">
						上一章<img src="../../static/icons/icon_reader_pgup.png" alt="" class="pageChangeImg" />
					</button>
					<button type="default" class="inTopBar"
						:class="[{ enabled: article.article_chapter != lastArticleChapter }, readerSettings.theme]"
						@click="changePage(+1)">
						<img src="../../static/icons/icon_reader_pgdn.png" alt="" class="pageChangeImg" />下一章
					</button>
				</div>
			</div>
			<div class="underSettings" :class="{ opened: settingsOpened }" ref="settings">

			</div>
		</div>
		<div class="articleContent spliter" v-if="article.article_type == 'spliter'">
			<div class="title" :style="{ fontSize: readerSettings.titleFontSize + 18 + 'rpx' }"
				:class="readerSettings.theme">
				{{ article.title }}
			</div>
		</div>
		<div class="articleContent worldVocabulary" v-else-if="article.article_type == 'worldVocabulary'">
			<div class="topBar">
				<div class="left" @click="imgUploadVisible = true">
					<div class="pic" v-if="article.content.pic == undefined && article.title">
						{{ article.title.slice(0, 1) }} </div>
					<log-image :src="article.content.pic" alt="" v-if="article.content.pic != undefined" />
				</div>
				<div class="right">
					<div class="tit">词条名称</div>
					<input class="input" placeholder="请输入词条名称" v-model="article.title" style="fontSize: 50rpx"
						:style="{ fontSize: readerSettings.titleFontSize + 'rpx' }" disabled />
				</div>
			</div>
			<div class="article"
				:style="{ fontSize: readerSettings.fontSize + 'rpx', lineHeight: lineHeightMode2Value(readerSettings.lineHeightMode) }"
				@tap="articleTapped" :class="readerSettings.theme">
				<div class="desc" style="margin-bottom: 30rpx;">
					{{ article.content.desc }}
				</div>
				<el-card class="box-card" v-for="(item, index) in article.content.attributes"
					style="margin-bottom: 20rpx;">
					<div style="display:flex; justify-content:space-between;">
						<div class="attr"><span style="color:#888888; margin-right: 40rpx;">{{ item.name }}</span>
							{{ item.content }}
						</div>
					</div>

				</el-card>
			</div>
		</div>
		<div class="articleContent rich" v-else>
			<div class="title" :style="{ fontSize: readerSettings.titleFontSize + 'rpx' }" :class="readerSettings.theme">
				{{ article.title }}
			</div>
			<div class="article"
				:style="{ fontSize: readerSettings.fontSize + 'rpx', lineHeight: lineHeightMode2Value(readerSettings.lineHeightMode) }"
				@tap="articleTapped" :class="readerSettings.theme" v-if="articleContent && articleContent.length">
				<div v-for="item in articleContent" :key="item.id || item.img || item.novel_id">
					<div v-if="item.type == 'text'" class="paragraph"
						:class="{
							selected: item.selected,
							cento: item.cento,
							listening: listeningParagraphId != null &&
								String(article.article_id || articleId) === String(listeningArticleId) &&
								String(item.id) === String(listeningParagraphId)
						}"
						:data-paragraph-id="item.id"
						@longpress="handleParagraphLongpressed($event, item)">
						{{ item.value }}
						<span class="commentCount"
							v-if="!isPreviewMode && commentAmounts[item.id] > 0"
							@click.stop="gotoParagraphComment(item.id)">
							<i class="el-icon-chat-square"></i>
							<span class="count">{{ commentAmounts[item.id] }}</span>
						</span>
					</div>
					<log-image :src="item.img" alt="" v-else-if="item.type == 'image'" style="width:100%" />
					<div class="bookLink" v-else-if="item.type == 'novel'" style="display:flex; font-size:30rpx;">
						<view style="display: flex; align-items: center;">
							<bookInCase :bookName="item.name" :picUrl="item.picUrl"
								@click.native="readBook(item.novel_id)"></bookInCase>
						</view>
						<view>
							<p style="height:70%; background-color: #bfbfbfaa; margin:25rpx 0; padding:20rpx; width:55vw; border-radius: 5px;"
								@click="readBook(item.novel_id)">
								{{ item.content }}
							</p>
						</view>
					</div>
				</div>
			</div>
		</div>
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
		</div>

		<div class="underBar">
			<img src="../../static/icons/end.png" alt="" />
			<div>已经到底了哦</div>
		</div>
		<div v-if="!isPreviewMode" class="row" style="display: flex;">
			<button type="default"
				:class="[{ enabled: article.article_chapter != firstArticleChapter }, readerSettings.theme]"
				@click="changePage(-1)"
				style="margin-right: 80rpx;">
				上一章<img src="../../static/icons/icon_reader_pgup.png" alt="" class="pageChangeImg" />
			</button>
			<button type="default"
				:class="[{ enabled: article.article_chapter != lastArticleChapter }, readerSettings.theme]"
				@click="changePage(+1)">
				<img src="../../static/icons/icon_reader_pgdn.png" alt="" class="pageChangeImg" />下一章
			</button>
		</div>

		<el-drawer v-if="!isPreviewMode" :with-header="false" :visible.sync="menuDrawer" direction="btt" :modal="false" size="50%"
			custom-class="bookMenu">
			<bookMenu
				:novel_id="article.novel_id"
				:currentIdx="currentMenuIdx"
				:visible="menuDrawer"
			></bookMenu>
		</el-drawer>
		<el-drawer v-if="!isPreviewMode" :with-header="false" :visible.sync="commentDrawerVisible" direction="btt"
			:modal="commentDrawerVisible" size="calc(80% + 44px)" custom-class="commentDrawer" :destroy-on-close="true"
			:wrapperClosable="false" :append-to-body="true">
			<div class="bookCommentDrawer" :style="commentDrawerThemeStyle">
				<div class="drawerTitle">
					段落评论
				</div>
				<div class="closeBtn" @click="handleCloseCommentDraweraManually">
					<i class="el-icon-close"></i>
				</div>
				<BookComment :componentMode="true" :componentData="commentDrawerData"
					@hide="handleCloseCommentDraweraManually" @navigate="handleCloseCommentDraweraManually">
				</BookComment>
			</div>
		</el-drawer>
		<el-dialog title="错误反馈" :visible.sync="feedbackDialogVisible" width="80%"
			:before-close="handleCloseFeedbackDialog">
			<div class="feedback-container">
				<div class="paragraph-preview">
					<p>选中的段落：</p>
				<div class="paragraph-text">{{ feedbackParagraph ? feedbackParagraph.value : '' }}</div>
				</div>
				<div class="feedback-input">
					<p>请描述您发现的错误：</p>
					<el-input type="textarea" :rows="4" placeholder="请输入错误描述，如错别字、语法错误等" v-model="feedbackContent">
					</el-input>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseFeedbackDialog">取消</el-button>
				<el-button type="primary" @click="submitFeedback" :disabled="!feedbackContent">提交</el-button>
			</span>
		</el-dialog>
		<AudiobookPlayer
			ref="audiobookPlayer"
			:articleIds="listeningArticleIds"
			:articles="isPreviewMode && previewPayload ? [previewPayload.article] : []"
			:playlistKey="isPreviewMode ? 'preview:' + previewKey : ''"
			:coverUrl="audiobookNovelInfo.picUrl || ''"
			:bookTitle="audiobookNovelInfo.name || ''"
			:startArticleId="articleId"
			@change="handleAudiobookProgress"
		/>
		<div class="lastProgress" v-show="showLastProgress">
			已恢复上次阅读进度 <div class="textbutton" style="margin-left: 10px;"
				@click="scrollToTop(true); showLastProgress = false">回到顶部</div>
		</div>
	</view>
</template>

<script>
import axios from 'axios'
import bookMenu from '../../components/bookMenu.vue'
import bookInCase from '../../components/book_in_case.vue'
import BookComment from './bookComment.vue'
import AudiobookPlayer from '../../components/audiobook-player.vue'
import ReaderBackgroundPicker from '../../components/ReaderBackgroundPicker.vue'
import ReaderTypeSwitch from '../../components/ReaderTypeSwitch.vue'
import { buildReaderUrl, setReaderMode } from '../../common/reader-mode.js'
import { readReaderPreview } from '../../common/reader-preview.js'
import { createTreeExpReporter } from '../../lib/treeExpReporter.js'
import { createBackgroundSkinStyle, normalizeBackgroundSkin } from '../../common/background-skins.js'
import { getMembershipStatus } from '../../common/membership-api.js'
import { getColorMode, getProjectThemeMode, readPageTheme, rememberPageTheme } from '../../common/page-theme-memory.js'

const ARTICLE_RICH_THEME_MEMORY_KEY = 'pageThemeMemory:articleRich'
export default {
	components: {
		bookMenu,
		bookInCase,
		BookComment,
		AudiobookPlayer,
		ReaderBackgroundPicker,
		ReaderTypeSwitch
	},
	data() {
		return {
			isPreviewMode: false,
			previewKey: '',
			previewPayload: null,
			articleId: -1,
			article: {},
			articleContent: [],
			articles: [],
			listeningArticleIds: [],
			listeningArticleId: null,
			listeningParagraphId: null,
			audiobookNovelInfo: {},
			pageHeadBtn: [],
			settingsOpened: false,
			readerSettings: {},
			readerBackgroundSkins: [],
			membershipTier: '',
			backgroundSkinsLoaded: false,
			readerSolidThemes: [
				{ key: 'white', name: '蛙鸣白', required_membership: 'none' },
				{ key: 'yellow', name: '原木黄', required_membership: 'none' },
				{ key: 'green', name: '草原绿', required_membership: 'none' },
				{ key: 'blue', name: '晴空蓝', required_membership: 'none' },
				{ key: 'purple', name: '末地紫', required_membership: 'none' },
				{ key: 'pink', name: '桃花粉', required_membership: 'none' },
				{ key: 'black', name: '虚空黑', required_membership: 'none' },
				{ key: 'wavechaser', name: '追波', required_membership: 'standard' },
				{ key: 'powderblue', name: '粉蓝', required_membership: 'standard' },
				{ key: 'qingyun', name: '青云', required_membership: 'standard' },
				{ key: 'sunburst', name: '艳阳', required_membership: 'standard' },
				{ key: 'thorncrown', name: '荆棘冠', required_membership: 'standard' },
				{ key: 'chocolate', name: '巧克力', required_membership: 'standard' }
			],
			pageHead: null,
			nativeNavigationBarVisible: null,
			nativeSystemUiBackgroundColor: null,
			scrollTop: 0,
			pageProgressInterval: undefined,
			showLastProgress: false,
			selectionMode: false,
			justSelected: false,
			pendingParagraphId: null,
			panelPosition: {
				x: 0,
				y: 0
			},
			selectedParagraph: null,
			commentDrawerVisible: false,
			commentDrawerData: {},
			activeCommentParagraphId: null,
			feedbackDialogVisible: false,
			feedbackContent: '',
			feedbackParagraph: null,
			doUpdateCommentDisplay: true,
			commentAmounts: {},
			readExpReporter: null,
			themes: {
				blue: {
					backColor: "#f4fafc",
					color: "#27566b",
				},
				white: {
					color: "#292927",
					backColor: "#fefefc",
				},
				yellow: {
					backColor: "#fcf8ef",
					color: "#5c4b3b",
				},
				green: {
					backColor: "#f5faf4",
					color: "#395744",
				},
				purple: {
					backColor: "#faf7fc",
					color: "#57445f",
				},
				pink: {
					backColor: "#fbf6f8",
					color: "#664858",
				},
				black: {
					backColor: "#22272e",
					color: "#d9dee7",
				},
				wavechaser: {
					backColor: "#e84f89",
					color: "#32101f",
				},
				powderblue: {
					backColor: "#ace5e2",
					color: "#244244",
				},
				qingyun: {
					backColor: "#313b3e",
					color: "#e7eeef",
				},
				sunburst: {
					backColor: "#fcd23c",
					color: "#493900",
				},
				thorncrown: {
					backColor: "#7d2120",
					color: "#f6e8e5",
				},
				chocolate: {
					backColor: "#380001",
					color: "#f4e7e1",
				},
				blockepoch: {
					backColor: "#dce3c2",
					color: "#273421",
				}
			},
			menuDrawer: false,
			updateCommentDisplayTimer: null
		}
	},
	onNavigationBarButtonTap(e) {
		this.settingsOpened = !this.settingsOpened;
	},
	methods: {
		getReaderThemeMode(themeKey) {
			const theme = this.themes[themeKey] || this.themes.yellow;
			return getColorMode(theme.backColor);
		},
		rememberCurrentReaderTheme() {
			if (!this.readerSettings || !this.readerSettings.theme) return;
			rememberPageTheme(
				ARTICLE_RICH_THEME_MEMORY_KEY,
				this.getReaderThemeMode(this.readerSettings.theme),
				this.readerSettings
			);
		},
		applyReaderThemeMode(mode) {
			const fallback = {
				theme: mode === 'dark' ? 'black' : 'yellow',
				backgroundSkinKey: ''
			};
			const selection = readPageTheme(ARTICLE_RICH_THEME_MEMORY_KEY, mode, fallback);
			if (!selection || !this.themes[selection.theme]) return;
			this.readerSettings.theme = selection.theme;
			this.$set(this.readerSettings, 'backgroundSkinKey', selection.backgroundSkinKey || '');
			window.localStorage.setItem('readerSettings', JSON.stringify(this.readerSettings));
			this.$nextTick(this.updateNavigationBarVisibility);
		},
		initializeReaderThemeMemory() {
			this.rememberCurrentReaderTheme();
			this.applyReaderThemeMode(this.projectThemeMode);
		},
		switchReaderType(mode) {
			if (mode === 'text') return;
			const visibleParagraphId = this.getVisibleParagraphId();
			setReaderMode(mode);
			uni.redirectTo({
				url: buildReaderUrl(mode, {
					articleId: this.article.article_id || this.articleId,
					novelId: this.article.novel_id,
					paragraphId: visibleParagraphId,
					previewKey: this.previewKey
				})
			});
		},
		getVisibleParagraphId() {
			const visibleParagraph = Array.from(document.querySelectorAll('.paragraph[data-paragraph-id]'))
				.map(element => ({ element, rect: element.getBoundingClientRect() }))
				.filter(item => item.rect.bottom > 0 && item.rect.top < window.innerHeight)
				.sort((a, b) => Math.abs(a.rect.top) - Math.abs(b.rect.top))[0];
			return visibleParagraph ? visibleParagraph.element.dataset.paragraphId : null;
		},
		isAudiobookArticle(article) {
			if (!article || (!this.isPreviewMode && Number(article.is_draft || 0) !== 0)) return false;
			return ['richtext', 'worldOutline', 'spliter'].includes(String(article.article_type || ''));
		},
		async loadAudiobookNovelInfo(novelId) {
			if (this.isPreviewMode) {
				this.audiobookNovelInfo = JSON.parse(JSON.stringify(this.previewPayload.novel || {}));
				return;
			}
			if (!novelId) return;
			if (String(this.audiobookNovelInfo.novel_id || '') === String(novelId)) return;
			try {
				const res = await axios.get(this.$baseUrl + '/library/get_novel_by_id?id=' + novelId, {});
				if (res.status === 200 && Array.isArray(res.data) && res.data[0]) {
					this.audiobookNovelInfo = res.data[0];
				}
			} catch (error) {
				console.warn('loadAudiobookNovelInfo failed', error);
			}
		},
		async openNativeAudiobookPlayer(startParagraphId = null) {
			if (!this.isAudiobookArticle(this.article)) {
				uni.showToast({ title: '当前内容暂不支持听书', icon: 'none' });
				return false;
			}
			if (!Array.isArray(this.articles) || this.articles.length === 0) {
				await this.getArticles(this.article.novel_id);
			}
			this.listeningArticleIds = this.articles
				.filter(item => this.isAudiobookArticle(item))
				.map(item => String(item.article_id));
			if (this.listeningArticleIds.length === 0) {
				this.listeningArticleIds = [String(this.article.article_id || this.articleId)];
			}
			await this.loadAudiobookNovelInfo(this.article.novel_id);
			const targetParagraphId = startParagraphId == null
				? (this.getVisibleParagraphId() || -1)
				: startParagraphId;
			this.listeningArticleId = String(this.article.article_id || this.articleId);
			this.listeningParagraphId = String(targetParagraphId);
			this.settingsOpened = false;
			await this.$nextTick();
			return this.$refs.audiobookPlayer.openNativePlayer(targetParagraphId);
		},
		handleAudiobookProgress(data) {
			if (!data || data.articleId == null || data.paragraphId == null) return;
			const targetArticleId = String(data.articleId);
			const targetParagraphId = String(data.paragraphId);
			this.listeningArticleId = targetArticleId;
			this.listeningParagraphId = targetParagraphId;
			if (String(this.article.article_id || this.articleId) !== targetArticleId) {
				this.pendingParagraphId = targetParagraphId;
				this.refreshPage(targetArticleId);
				return;
			}
			this.$nextTick(() => this.scrollToParagraph(targetParagraphId));
		},
		resolvePageHead() {
			const currentPage = this.$el && typeof this.$el.closest === 'function'
				? this.$el.closest('uni-page')
				: null;
			if (this.pageHead && this.pageHead.isConnected && (!currentPage || currentPage.contains(this.pageHead))) {
				return this.pageHead;
			}
			this.pageHead = currentPage
				? currentPage.querySelector('.uni-page-head')
				: document.querySelector('uni-page:last-of-type .uni-page-head, .uni-page-head');
			this.pageHeadBtn = this.pageHead
				? this.pageHead.querySelectorAll('.uni-btn-icon')
				: [];
			if (this.pageHead) {
				this.pageHead.style.transition = 'opacity .3s, transform .3s, background-color .3s';
				this.pageHead.style.willChange = 'opacity, transform';
				this.pageHeadBtn.forEach(element => {
					element.style.transition = 'color .3s';
				});
			}
			return this.pageHead;
		},
		updateNavigationBarVisibility() {
			const theme = this.themes[this.readerSettings.theme] || this.themes.yellow;
			const shouldShow = this.settingsOpened || this.scrollTop < 120;
			const pageHead = this.resolvePageHead();
			if (pageHead) {
				pageHead.style.opacity = shouldShow ? '1' : '0';
				pageHead.style.transform = shouldShow ? 'translateY(0)' : 'translateY(-100%)';
				pageHead.style.pointerEvents = shouldShow ? 'auto' : 'none';
				pageHead.style.backgroundColor = this.settingsOpened ? 'transparent' : theme.backColor;
				this.pageHeadBtn.forEach(element => {
					element.style.color = this.settingsOpened ? 'white' : theme.color;
				});
			}
			this.setNativeNavigationBarVisible(shouldShow);
			this.setNativeSystemUiStyle(this.settingsOpened ? '#000000' : theme.backColor);
		},
		setNativeNavigationBarVisible(visible, force = false) {
			const bridge = typeof window !== 'undefined' ? window.jsBridge : null;
			if (!bridge || !bridge.inApp || typeof bridge.setNavigationBarVisible !== 'function') return;
			if (!force && this.nativeNavigationBarVisible === visible) return;
			this.nativeNavigationBarVisible = visible;
			bridge.setNavigationBarVisible(visible);
		},
		setNativeSystemUiStyle(backgroundColor, force = false) {
			const bridge = typeof window !== 'undefined' ? window.jsBridge : null;
			if (!bridge || !bridge.inApp || typeof bridge.setSystemUIStyle !== 'function') return;
			if (!force && this.nativeSystemUiBackgroundColor === backgroundColor) return;
			this.nativeSystemUiBackgroundColor = backgroundColor;
			bridge.setSystemUIStyle(backgroundColor);
		},
		handleWindowScroll() {
			this.updateScrollTopFromDocument();
		},
		getDocumentScrollTop(event) {
			const pageWrapper = this.$el && typeof this.$el.closest === 'function'
				? this.$el.closest('uni-page-wrapper')
				: document.querySelector('uni-page-wrapper');
			const eventTargetScrollTop = event && event.target && Number(event.target.scrollTop);
			return Math.max(
				window.pageYOffset || 0,
				document.scrollingElement ? document.scrollingElement.scrollTop : 0,
				document.documentElement ? document.documentElement.scrollTop : 0,
				document.body ? document.body.scrollTop : 0,
				pageWrapper ? pageWrapper.scrollTop : 0,
				Number.isFinite(eventTargetScrollTop) ? eventTargetScrollTop : 0
			);
		},
		updateScrollTopFromDocument(event) {
			this.scrollTop = this.getDocumentScrollTop(event);
			this.doUpdateCommentDisplay = true;
			this.updateNavigationBarVisibility();
		},
		handleDocumentScroll(event) {
			this.updateScrollTopFromDocument(event);
		},
		attachScrollListeners() {
			document.removeEventListener('scroll', this.handleDocumentScroll, true);
			document.addEventListener('scroll', this.handleDocumentScroll, true);
			window.removeEventListener('scroll', this.handleWindowScroll);
			window.addEventListener('scroll', this.handleWindowScroll, { passive: true });
			this.updateScrollTopFromDocument();
		},
		detachScrollListeners() {
			document.removeEventListener('scroll', this.handleDocumentScroll, true);
			window.removeEventListener('scroll', this.handleWindowScroll);
		},
		markReadActivity() {
			if (this.readExpReporter) {
				this.readExpReporter.markActive();
			}
		},
		buildPlainTextArticleContent(rawContent) {
			const text = String(rawContent || '').replace(/\r\n/g, '\n');
			if (!text.trim()) {
				return [];
			}
			return text.split('\n').map((line) => ({
				type: 'text',
				value: line
			}));
		},
		normalizeArticleContent(rawContent) {
			let content = [];
			if (Array.isArray(rawContent)) {
				content = rawContent;
			} else if (rawContent && Array.isArray(rawContent.content)) {
				content = rawContent.content;
			} else if (typeof rawContent === 'string') {
				try {
					const parsed = JSON.parse(rawContent);
					if (Array.isArray(parsed)) {
						content = parsed;
					} else if (parsed && Array.isArray(parsed.content)) {
						content = parsed.content;
					} else if (typeof parsed === 'string') {
						content = this.buildPlainTextArticleContent(parsed);
					}
				} catch (e) {
					content = this.buildPlainTextArticleContent(rawContent);
				}
			}
			if (!Array.isArray(content)) {
				content = [];
			}
			let autoId = 1;
			return content.map(item => {
				if (!item) {
					return {
						type: 'text',
						value: '',
						id: autoId++,
						selected: false,
						cento: null
					}
				}
				if (item.type === 'text' || item.type == undefined) {
					const paragraphId = item.id ?? item.paragraph_id ?? autoId++;
					return {
						...item,
						type: 'text',
						value: Array.isArray(item.value) ? item.value.join('') : (item.value || ''),
						id: paragraphId,
						selected: false,
						cento: item.cento || null
					}
				}
				return item;
			});
		},
		loadPageProgress() {
			let scrollTop = localStorage.getItem(`articleProgress_${this.articleId}`);
			this.scrollToTop();
			if (scrollTop != undefined && scrollTop != 0) {
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
		updatePageProgress() {
			if (this.isPreviewMode) return;
			this.pageProgressInterval = setInterval(() => {
				let scrollTop = this.getDocumentScrollTop();
				this.scrollTop = scrollTop;
				localStorage.setItem(`articleProgress_${this.articleId}`, scrollTop);
			}, 2000);
		},
		refreshPage(articleId) {
			uni.showLoading({
				title: "努力加载中"
			})
			let _this = this;
			const applyArticle = (loadedArticle) => {
				this.articleId = articleId;
				this.article = loadedArticle;
				if (this.article.article_type == "worldVocabulary") {
					if (typeof this.article.content === 'string') {
						this.article.content = JSON.parse(this.article.content);
					}
				}
				if (this.article.article_type == "richtext" || this.article.article_type == "worldOutline") {
					this.articleContent = this.normalizeArticleContent(this.article.content);
					if (!this.isPreviewMode) this.showArticleCentos();
				} else {
					this.articleContent = [];
				}
				this.commentAmounts = {};
				this.doUpdateCommentDisplay = true;
				this.selectionMode = false;
				this.selectedParagraph = null;
				setTimeout(() => {
					if (_this.pendingParagraphId) {
						_this.scrollToParagraph(_this.pendingParagraphId);
						_this.pendingParagraphId = null;
					} else if (!this.isPreviewMode) {
						this.loadPageProgress();
					}
				})
				this.getArticles(this.article.novel_id);
				if (this.isPreviewMode) return;
				window.localStorage.setItem("ReaderHistory_" + this.article.novel_id, this.article.article_chapter);

				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				if (tk) {
					axios.post(
						this.$baseUrl + '/library/update_reading_progress',
						{
							novel_id: this.article.novel_id,
							article_id: this.article.article_id,
							article_chapter: this.article.article_chapter
						},
						{
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + tk
							}
						},
					).catch(() => { });
				}
			};
			if (this.isPreviewMode) {
				applyArticle(JSON.parse(JSON.stringify(this.previewPayload.article)));
				uni.hideLoading();
				return;
			}
			axios.get(this.$baseUrl + '/articles/get_article?id=' + articleId).then((res) => {
				applyArticle(res.data[0]);
			}).catch(function (error) { }).then(function () {
				uni.hideLoading();
			})

		},
		changeTheme(themeName) {
			const theme = this.readerSolidThemes.find(item => item.key === themeName);
			if (!theme || !this.canUseBackgroundSkin(theme)) {
				if (theme) this.handleLockedBackgroundSkin(theme);
				return;
			}
			this.readerSettings.theme = themeName;
			this.$set(this.readerSettings, 'backgroundSkinKey', "");
			window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
			this.rememberCurrentReaderTheme();
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
				const currentTheme = this.readerSolidThemes.find(item => item.key === this.readerSettings.theme);
				if (currentTheme && !this.canUseBackgroundSkin(currentTheme)) {
					this.readerSettings.theme = this.projectThemeMode === 'dark' ? 'black' : 'yellow';
					this.$set(this.readerSettings, 'backgroundSkinKey', "");
					window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
					this.rememberCurrentReaderTheme();
				}
				if (res.status === 200 && Array.isArray(res.data)) {
					this.readerBackgroundSkins = res.data
						.map(item => normalizeBackgroundSkin({
							...item,
							is_locked: !this.canUseBackgroundSkin(item)
						}, theme => !!this.themes[theme]))
						.filter(Boolean);
					if (this.readerSettings.backgroundSkinKey && !this.currentBackgroundSkin) {
						this.$set(this.readerSettings, 'backgroundSkinKey', "");
						window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
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
			window.localStorage.setItem("readerSettings", JSON.stringify(this.readerSettings));
			this.rememberCurrentReaderTheme();
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
		contentTapped() {
			this.markReadActivity();
			if (this.selectionMode && !this.justSelected) {
				this.clearSelection();
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
		async getArticles(uid) {
			if (this.isPreviewMode) {
				this.articles = [this.previewPayload.article];
				return this.articles;
			}
			try {
				const res = await axios.get(this.$baseUrl + '/library/get_articles_all?id=' + uid, {});
				this.articles = Array.isArray(res.data) ? res.data : [];
				return this.articles;
			} catch (error) {
				console.warn('getArticles failed', error);
				return this.articles;
			}
		},
		changePage(dp) {
			if (this.isPreviewMode) return;
			this.markReadActivity();
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
		scrollToTop(duration) {
			uni.pageScrollTo({
				duration: duration ? 200 : 0, // 过渡时间
				scrollTop: 0, // 滚动的实际距离
			})
		},
		scrollToParagraph(paragraphId) {
			let paragraphDom = document.querySelector('.paragraph[data-paragraph-id="' + paragraphId + '"]');
			if (paragraphDom) {
				paragraphDom.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		},
		getParagraphText(paragraphId) {
			const targetParagraphId = Number(paragraphId);
			if (!Number.isFinite(targetParagraphId) || !Array.isArray(this.articleContent)) {
				return '';
			}
			const targetParagraph = this.articleContent.find((item) => {
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
		gotoMenu() {
			if (this.isPreviewMode) return;
			// uni.navigateTo({
			// 	url:"./allArticles?id=" + this.article.novel_id
			// })
			this.menuDrawer = true;
		},
		articleTapped(event) {
			this.markReadActivity();
			if (this.selectionMode) {
				if (!this.justSelected) {
					this.clearSelection();
				}
				return;
			}
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
			if (!this.articleContent || !this.articleContent.length) return;
			let centos = await this.getArticleCento(this.articleId);
			for (let item of centos) {
				for (let para of this.articleContent) {
					if (para.type === 'text' && para.id === item.paragraph_id) {
						para.cento = item;
					}
				}
			}
			this.$forceUpdate();
		},
		handleParagraphLongpressed(event, paragraph) {
			this.markReadActivity();
			this.clearSelection();
			const touch = event.touches[0];
			const screenWidth = uni.getSystemInfoSync().screenWidth;
			const screenHeight = uni.getSystemInfoSync().screenHeight;
			const panelWidth = uni.upx2px(300);
			const panelHeight = uni.upx2px(100);
			let x = touch.clientX - (panelWidth / 2);
			let y = touch.clientY - panelHeight - 20;
			x = Math.max(40, Math.min(x, screenWidth - panelWidth - 100));
			if (y < 10) {
				y = touch.clientY + 20;
			}
			y = Math.max(10, Math.min(y, screenHeight - panelHeight - 10));
			this.panelPosition = { x, y };
			paragraph.selected = true;
			this.selectedParagraph = paragraph;
			this.selectionMode = true;
			this.justSelected = true;
			setTimeout(() => {
				this.justSelected = false;
			}, 300);
			this.$forceUpdate();
		},
		async handleUnderline() {
			if (this.isPreviewMode) return;
			if (!this.selectedParagraph) return;
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;
			try {
				await axios.post(this.$baseUrl + '/articles/add_article_cento', {
					article_id: this.articleId,
					paragraph_id: this.selectedParagraph.id,
					paragraph: this.selectedParagraph.value,
				}, {
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				});
				this.showArticleCentos();
				this.clearSelection();
			} catch (error) {
				console.error(error);
			}
		},
		async handleRemoveUnderline() {
			if (this.isPreviewMode) return;
			const paragraph = this.selectedParagraph;
			if (!paragraph?.cento) return;
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;
			try {
				await axios.post(this.$baseUrl + '/articles/remove_article_cento', {
					article_cento_id: paragraph.cento.article_cento_id
				}, {
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				});
				paragraph.cento = null;
				if (this.selectedParagraph && this.selectedParagraph.id === paragraph.id) {
					this.clearSelection();
				}
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
			if (this.articleContent && this.articleContent.length) {
				for (let para of this.articleContent) {
					if (para.type === 'text') para.selected = false;
				}
			}
		},
		async getParagraphCommentsAmount(paragraphId) {
			let res = await axios.post(this.$baseUrl + '/articles/get_paragraph_comment_amount?id=' + this.article.novel_id,
				{ paragraph_id: paragraphId, article_id: this.articleId });
			if (res.status == 200) {
				return res.data[0].count;
			}
		},
		async refreshParagraphCommentAmount(paragraphId) {
			const pid = Number(paragraphId);
			if (!Number.isFinite(pid) || pid <= 0) return;
			try {
				const amount = await this.getParagraphCommentsAmount(pid);
				this.$set(this.commentAmounts, pid, Number(amount) || 0);
			} catch (error) {
				console.error('刷新段落评论数量失败', error);
			}
		},
		async updateArticleCommentDisplay() {
			if (this.isPreviewMode) return;
			if (!this.doUpdateCommentDisplay || !this.articleContent || !this.articleContent.length) return;
			this.doUpdateCommentDisplay = false;
			let paragraphDoms = document.querySelectorAll(".paragraph[data-paragraph-id]");
			if (!paragraphDoms || !paragraphDoms.length) return;
			let viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			for (let item of Array.from(paragraphDoms)) {
				let rect = item.getBoundingClientRect();
				if (rect.y >= 0 && rect.y <= viewportHeight - 20) {
					let paragraphId = Number(item.dataset.paragraphId);
					if (!Object.prototype.hasOwnProperty.call(this.commentAmounts, paragraphId)) {
						let amount = await this.getParagraphCommentsAmount(paragraphId);
						this.$set(this.commentAmounts, paragraphId, amount || 0);
					}
				}
			}
		},
		gotoParagraphComment(paragraphId) {
			if (this.isPreviewMode) return;
			this.markReadActivity();
			this.activeCommentParagraphId = Number(paragraphId);
			this.commentDrawerData = {
				novelId: this.article.novel_id,
				articleId: this.articleId,
				paragraphId: paragraphId,
				paragraphText: this.getParagraphText(paragraphId)
			}
			this.commentDrawerVisible = true;
			if (typeof window !== 'undefined' && window.history) {
				window.history.pushState({ isCommentDrawerOpen: true }, '', window.location.href)
			}
		},
		async closeCommentDrawer(syncHistory = false) {
			const paragraphId = this.activeCommentParagraphId || this.commentDrawerData.paragraphId;
			this.commentDrawerVisible = false;
			this.activeCommentParagraphId = null;
			if (syncHistory && typeof window !== 'undefined' && window.history) {
				window.history.go(-1)
			}
			await this.refreshParagraphCommentAmount(paragraphId);
			this.doUpdateCommentDisplay = true;
		},
		async browserBack() {
			if (!this.commentDrawerVisible) {
				return;
			}
			await this.closeCommentDrawer(false);
		},
		handleNativeBack(event) {
			if (!this.commentDrawerVisible) {
				return;
			}
			event.preventDefault();
			window.history.go(-1);
		},
		async handleCloseCommentDraweraManually() {
			await this.closeCommentDrawer(true);
		},
		handleFeedback() {
			if (!this.selectedParagraph) return;
			this.feedbackParagraph = {
				id: this.selectedParagraph.id,
				value: this.selectedParagraph.value
			};
			this.feedbackDialogVisible = true;
		},
		handleCloseFeedbackDialog() {
			this.feedbackDialogVisible = false;
			this.feedbackContent = '';
			this.feedbackParagraph = null;
		},
		async submitFeedback() {
			if (!this.feedbackParagraph) return;
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;
			try {
				await axios.post(this.$baseUrl + '/articles/submit_feedback', {
					article_id: this.articleId,
					paragraph_id: this.feedbackParagraph.id,
					feedback_content: this.feedbackContent,
					feedback_type: 'error'
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
		},
		//跳转到其他书籍
		readBook(novel_id) {
			uni.navigateTo({
				url: './bookInfo?id=' + novel_id
			})
		},
	},
	onLoad(option) {
		this.previewKey = String(option.previewKey || '');
		this.previewPayload = readReaderPreview(this.previewKey);
		this.isPreviewMode = !!this.previewPayload;
		if (this.previewKey && !this.previewPayload) {
			uni.showToast({ title: '预览内容已失效', icon: 'none' });
			setTimeout(() => uni.navigateBack(), 300);
			return;
		}
		if (!this.isPreviewMode) {
			this.readExpReporter = createTreeExpReporter(this, 'read_seconds', { activeWindowMs: 120000 });
			this.readExpReporter.start();
		}
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
		this.$set(this.readerSettings, 'backgroundSkinKey', String(this.readerSettings.backgroundSkinKey || "").slice(0, 64));
		this.initializeReaderThemeMemory();
		this.loadReaderBackgroundSkins();
		if (JSON.stringify(option) == "{}") {
			uni.showToast({
				title: "undefined",
				icon: 'none',
				duration: 2000
			});
			return;
		}
		uni.showLoading({
			title: '努力加载中'
		});

		// 导航栏在原生 WebView 中可能晚于页面组件挂载，滚动时会继续尝试解析。
		this.$nextTick(this.attachScrollListeners);
		if (!this.isPreviewMode) {
			this.updateCommentDisplayTimer = setInterval(() => {
				this.updateArticleCommentDisplay();
			}, 200);
		}
		if (option.paragraphId) {
			this.pendingParagraphId = option.paragraphId;
		}
		this.refreshPage(option.id);
		// #ifdef H5
		window.addEventListener('popstate', this.browserBack)
		// #endif
		window.addEventListener('loghomeNativeBack', this.handleNativeBack)

		// 启动页面滚动日志记录
		if (!this.isPreviewMode) this.updatePageProgress();
	},
	beforeDestroy() {
		if (this.readExpReporter) {
			this.readExpReporter.stop();
		}
		clearInterval(this.pageProgressInterval);
		clearInterval(this.updateCommentDisplayTimer);
		// #ifdef H5
		window.removeEventListener("popstate", this.browserBack);
		// #endif
		window.removeEventListener('loghomeNativeBack', this.handleNativeBack)
		this.detachScrollListeners();
		this.setNativeNavigationBarVisible(true, true);
	},
	onShow() {
		// 其他页面可能在当前页面隐藏期间修改过原生系统栏颜色。
		this.nativeSystemUiBackgroundColor = null;
		this.applyReaderThemeMode(this.projectThemeMode);
		if (this.readExpReporter) {
			this.readExpReporter.start();
			this.readExpReporter.markActive();
		}
		this.updateNavigationBarVisibility();
		if (this.backgroundSkinsLoaded) this.loadReaderBackgroundSkins();
	},
	async onHide() {
		if (this.readExpReporter) {
			await this.readExpReporter.stop();
		}
		this.setNativeNavigationBarVisible(true, true);
	},
	async onUnload() {
		if (this.readExpReporter) {
			await this.readExpReporter.stop();
		}
		// #ifdef H5
		window.removeEventListener("popstate", this.browserBack);
		// #endif
		window.removeEventListener('loghomeNativeBack', this.handleNativeBack)
		this.detachScrollListeners();
		this.setNativeNavigationBarVisible(true, true);
	},
	onPageScroll(res) {
		this.scrollTop = res.scrollTop; //距离页面顶部距离
		this.doUpdateCommentDisplay = true;
		this.markReadActivity();
		this.updateNavigationBarVisibility();
	},
	watch: {
		projectThemeMode(newMode, oldMode) {
			if (newMode !== oldMode) this.applyReaderThemeMode(newMode);
		},
		settingsOpened() {
			this.$nextTick(this.updateNavigationBarVisibility);
		},
		'readerSettings.theme'() {
			this.$nextTick(this.updateNavigationBarVisibility);
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
			return this.readerSolidThemes.map(theme => ({
				...theme,
				backgroundColor: this.themes[theme.key].backColor,
				is_locked: !this.canUseBackgroundSkin(theme)
			}));
		},
		currentBackgroundSkin() {
			const skinKey = String(this.readerSettings.backgroundSkinKey || "");
			return this.readerBackgroundSkins.find(item => item.skin_key === skinKey && !item.is_locked) || null;
		},
		readerPageStyle() {
			return {
				transition: 'background-color .5s, color .5s'
			};
		},
		readerBackgroundLayerStyle() {
			const shouldStretch = ['obsidian_orbit', 'ember_library'].includes(
				this.currentBackgroundSkin && this.currentBackgroundSkin.skin_key
			);
			return {
				...createBackgroundSkinStyle(this.currentBackgroundSkin),
				backgroundSize: shouldStretch ? '100% 100%' : 'cover',
				backgroundPosition: 'center center',
				backgroundRepeat: 'no-repeat',
				backgroundAttachment: 'fixed'
			};
		},
		isBlockEpochSkin() {
			return Boolean(this.currentBackgroundSkin && this.currentBackgroundSkin.skin_key === 'block_epoch');
		},
		currentMenuIdx() {
			const currentArticleId = Number(this.article.article_id || this.articleId || 0);
			if (!currentArticleId || !Array.isArray(this.articles) || this.articles.length === 0) {
				return -1;
			}
			const publishedArticles = this.articles.filter((item) => Number(item.is_draft) === 0);
			return publishedArticles.findIndex((item) => Number(item.article_id) === currentArticleId);
		},
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
	position: relative;
	z-index: 0;
	isolation: isolate;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-wrap: wrap;
	min-height: calc(100vh - 100rpx - 44px);

	padding: 50rpx 0 calc(50rpx + var(--loghome-safe-bottom, 0px));

	div.article {
		font-size: 40rpx;
		width: calc(100vw - 100rpx);
		overflow: hidden;
		white-space: pre-line;

		.paragraph {
			margin: 0;
			padding: 0;
			border-radius: 10rpx;
			transition: all .3s;
		}

		.paragraph.selected {
			background-color: #7774;
		}

		.paragraph.listening {
			background-color: rgba(64, 158, 255, 0.14);
			box-shadow: -10rpx 0 0 #409eff;
		}

		.paragraph.cento {
			text-decoration: underline;
			text-underline-offset: 14rpx;
		}

		.commentCount {
			display: inline-flex;
			align-items: center;
			margin-left: 16rpx;
			font-size: 0.9em;
			color: inherit;
			opacity: 0.8;

			i {
				font-size: 0.95em;
				margin-right: 6rpx;
			}

			.count {
				font-weight: 600;
			}
		}
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
			background-color: #202020;
			padding-top: calc(44px + var(--loghome-safe-top, 0px));
			padding-left: 30rpx;
			padding-right: 30rpx;
			width: calc(100vw - 60rpx);
			height: 414rpx;
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

		div.settings.preview {
			height: auto;
			padding-bottom: 30rpx;
		}

		div.underSettings {
			position: absolute;
			background-color: #f8eedb;
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

	button.enabled.wavechaser,
	button.enabled.powderblue,
	button.enabled.qingyun,
	button.enabled.sunburst,
	button.enabled.thorncrown,
	button.enabled.chocolate {
		background-color: rgba(255, 255, 255, 0.88);
		color: #252525;
	}

	button.wavechaser,
	button.powderblue,
	button.qingyun,
	button.sunburst,
	button.thorncrown,
	button.chocolate {
		background-color: rgba(255, 255, 255, 0.36);
		color: inherit;
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


	.lastProgress {
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

		.textbutton {
			color: #FF8C00;
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
		transition: all 0.2s ease;

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

}

.reader-background-layer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: -1;
	width: 100vw;
	height: 100vh;
	pointer-events: none;
	transform: translateZ(0);
	will-change: transform;
}

::v-deep .commentDrawer .el-drawer__body {
	padding: 0;
	overflow: hidden;
}

.bookCommentDrawer {
	position: relative;
	height: 100%;
	overflow: hidden;
	background-color: var(--comment-drawer-background, #fff);
	border-radius: 16px 16px 0 0;
}

.bookCommentDrawer .drawerTitle {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 60;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 44px;
	font-size: 18px;
	font-weight: bold;
	color: var(--comment-drawer-title-color, #292927);
	background-color: var(--comment-drawer-background, #fff);
	border-bottom: 1px solid var(--comment-drawer-border-color, #efefef);
	flex-shrink: 0;
}

.bookCommentDrawer .closeBtn {
	position: absolute;
	right: 10px;
	top: 10px;
	font-size: 24px;
	width: 24px;
	height: 24px;
	line-height: 24px;
	text-align: center;
	z-index: 61;
	color: var(--comment-drawer-close-color, #909399);
}

.bookCommentDrawer .commentOuter {
	position: absolute;
	top: 44px;
	left: 0;
	right: 0;
	bottom: 0;
	height: auto;
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

.readerTypeSettingRow,
.backgroundSettingRow {
	display: flex;
	align-items: center;
	width: calc(100% - 20rpx);
	margin: 22rpx auto 0;
	gap: 22rpx;

	.settingLabel,
	.backgroundLabel {
		flex: 0 0 auto;
		font-size: 30rpx;
	}

	.reader-type-switch-setting,
	.background-picker {
		flex: 1 1 auto;
		min-width: 0;
	}
}

.button.blue {
	background-color: #d9eef6;
	color: #4f7f94;
	border: 2px #4f7f94 solid !important;
}

.button.yellow {
	background-color: #f5e7cc;
	color: #a57843;
	border: 2px #a57843 solid !important;
}

.button.green {
	background-color: #dcebdd;
	color: #5d8666;
	border: 2px #5d8666 solid !important;
}

.button.purple {
	background-color: #eae1f0;
	color: #856793;
	border: 2px #856793 solid !important;
}

.button.black {
	background-color: #2b3038;
	color: #c2cad5;
	border: 2px #c2cad5 solid !important;
}

.button.white {
	background-color: #f6f6f4;
	color: #4f4f4b;
	border: 2px #4f4f4b solid !important;
}

view.content.white {
	background-color: #fefefc;
	color: #292927;
}

view.content.blue {
	background-color: #f4fafc;
	color: #27566b;
}

view.content.yellow {
	background-color: #fcf8ef;
	color: #5c4b3b;
}

view.content.green {
	background-color: #f5faf4;
	color: #395744;
}

view.content.purple {
	background-color: #faf7fc;
	color: #57445f;
}

view.content.pink {
	background-color: #fbf6f8;
	color: #664858;
}

view.content.black {
	background-color: #22272e;
	color: #d9dee7;
}

view.content.wavechaser {
	background-color: #e84f89;
	color: #32101f;
}

view.content.powderblue {
	background-color: #ace5e2;
	color: #244244;
}

view.content.qingyun {
	background-color: #313b3e;
	color: #e7eeef;
}

view.content.sunburst {
	background-color: #fcd23c;
	color: #493900;
}

view.content.thorncrown {
	background-color: #7d2120;
	color: #f6e8e5;
}

view.content.chocolate {
	background-color: #380001;
	color: #f4e7e1;
}

view.content.blockepoch {
	background-color: #dce3c2;
	color: #273421;
}

.content.block-epoch-skin {
	font-family: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;

	div.title {
		text-shadow: 2rpx 2rpx 0 rgba(255, 255, 255, 0.62);
	}

	div.article .paragraph.cento {
		text-decoration-color: #a6382c;
		text-decoration-style: dashed;
		text-decoration-thickness: 3rpx;
	}

	button {
		border: 3rpx solid #273421;
		border-radius: 0;
		box-shadow: 5rpx 5rpx 0 rgba(39, 52, 33, 0.3);
	}

	div.underBar {
		border-top: 8rpx solid #59615a;
		background: linear-gradient(90deg, rgba(75, 81, 77, 0.3) 50%, rgba(54, 60, 57, 0.3) 50%);
		background-size: 48rpx 48rpx;
		color: #273421;
		font-weight: 700;
		text-shadow: 2rpx 2rpx 0 rgba(255, 255, 255, 0.58);
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

.articleContent.worldVocabulary{
	.article{
		margin-left: 40rpx;
	}
}
</style>
