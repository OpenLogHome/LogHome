<template>
	<view class="content" :class="readerSettings.theme" style="transition: all .5s;" @tap="contentTapped">
		<el-alert title="提示" type="info" close-text="知道了" :description="'经审核，本文' + article.warn_status + '，请酌情选读。'"
			show-icon v-show="article.warn_status && article.warn_status != 'None'" style="margin-bottom: 50rpx;"
			effect="dark">
		</el-alert>
		<div class="tools" :class="{ opened: settingsOpened }" @click.self="toolsOuterClicked" ref="tools">
			<div class="settings" :class="{ opened: settingsOpened }" ref="settings">
				<div class="line">
					<div class="button" @click="changeFontSize(+1)">A+</div>
					<div class="button" @click="changeFontSize(-1)">A-</div>
					<div class="button" :class="{ 'selected': readerSettings.lineHeightMode == 0 }"
						@click="changeLineHeight(0)">窄</div>
					<div class="button" :class="{ 'selected': readerSettings.lineHeightMode == 1 }"
						@click="changeLineHeight(1)">中</div>
					<div class="button" :class="{ 'selected': readerSettings.lineHeightMode == 2 }"
						@click="changeLineHeight(2)">宽</div>
					<div class="button" @click="gotoMenu">目录</div>
				</div>
				<div class="line">
					<div class="button white theme" @click="changeTheme('white')"
						:class="{ 'selected': readerSettings.theme == 'white' }">蛙鸣白</div>
					<div class="button yellow theme" @click="changeTheme('yellow')"
						:class="{ 'selected': readerSettings.theme == 'yellow' }">原木黄</div>
					<div class="button green theme" @click="changeTheme('green')"
						:class="{ 'selected': readerSettings.theme == 'green' }">草原绿</div>
					<div class="button purple theme" @click="changeTheme('purple')"
						:class="{ 'selected': readerSettings.theme == 'purple' }">末地紫</div>
					<div class="button black theme" @click="changeTheme('black')"
						:class="{ 'selected': readerSettings.theme == 'black' }">虚空黑</div>
				</div>
				<div class="line">
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
						:class="{ selected: item.selected, cento: item.cento }"
						:data-paragraph-id="item.id"
						@longpress="handleParagraphLongpressed($event, item)">
						{{ item.value }}
						<span class="commentCount"
							v-if="commentAmounts[item.id] > 0"
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
			<div class="panel-button" @click="handleFeedback">
				<i class="el-icon-warning-outline"></i>
				<span>反馈</span>
			</div>
		</div>

		<div class="underBar">
			<img src="../../static/icons/end.png" alt="">
			<div>已经到底了哦</div>
		</div>
		<div class="row" style="display: flex;">
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

		<el-drawer :with-header="false" :visible.sync="menuDrawer" direction="btt" :modal="false" size="50%"
			custom-class="bookMenu">
			<bookMenu
				:novel_id="article.novel_id"
				:currentIdx="currentMenuIdx"
				:visible="menuDrawer"
			></bookMenu>
		</el-drawer>
		<el-drawer :with-header="false" :visible.sync="commentDrawerVisible" direction="btt"
			:modal="commentDrawerVisible" size="calc(80% + 44px)" custom-class="commentDrawer" :destroy-on-close="true"
			:wrapperClosable="false">
			<div class="bookCommentDrawer">
				<div class="title">
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
import { createTreeExpReporter } from '../../lib/treeExpReporter.js'
export default {
	components: {
		bookMenu,
		bookInCase,
		BookComment
	},
	data() {
		return {
			articleId: -1,
			article: {},
			articleContent: [],
			articles: [],
			pageHeadBtn: [],
			settingsOpened: false,
			readerSettings: {},
			pageHead: {},
			scrollTop: 0,
			navigationBarController: {},
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
			menuDrawer: false,
			updateCommentDisplayTimer: null
		}
	},
	onNavigationBarButtonTap(e) {
		this.settingsOpened = !this.settingsOpened;
	},
	methods: {
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
			this.pageProgressInterval = setInterval(() => {
				let scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
				localStorage.setItem(`articleProgress_${this.articleId}`, scrollTop);
			}, 2000);
		},
		refreshPage(articleId) {
			uni.showLoading({
				title: "努力加载中"
			})
			let _this = this;
			axios.get(this.$baseUrl + '/articles/get_article?id=' + articleId).then((res) => {
				this.articleId = articleId;
				this.article = res.data[0];
				if (this.article.article_type == "worldVocabulary") {
					this.article.content = JSON.parse(this.article.content);
				}
				if (this.article.article_type == "richtext" || this.article.article_type == "worldOutline") {
					this.articleContent = this.normalizeArticleContent(this.article.content);
					this.showArticleCentos();
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
					} else {
						this.loadPageProgress();
					}
				})
				this.getArticles(this.article.novel_id);
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
			}).catch(function (error) { }).then(function () {
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
		getArticles(uid) {
			let _this = this;
			axios.get(this.$baseUrl + '/library/get_articles_all?id=' + uid, {}).then((res) => {
				this.articles = res.data;
				// console.log(this.articles.length)
			}).catch(function (error) {
				_this.articles.splice(0, 0);
			}).then(function () { })
		},
		changePage(dp) {
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
		let _this = this;
		this.readExpReporter = createTreeExpReporter(this, 'read_seconds', { activeWindowMs: 120000 });
		this.readExpReporter.start();
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
			title: '努力加载中'
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
				if (window.jsBridge && window.jsBridge.inApp) {
					jsBridge.setSystemUIStyle("#000000", "#ffffff");
				}

			} else if (_this.scrollTop >= 120) {
				_this.pageHead.style.opacity = "0"
				// 状态栏颜色调整
				if (window.jsBridge && window.jsBridge.inApp) {
					jsBridge.setSystemUIStyle(_this.themes[_this.readerSettings.theme].backColor, _this.themes[_this.readerSettings.theme].color);
				}
			} else {
				_this.pageHead.style.opacity = "1"
				_this.pageHead.style.backgroundColor = _this.themes[_this.readerSettings.theme].backColor;
				this.pageHeadBtn.forEach(element => {
					element.style.color = _this.themes[_this.readerSettings.theme].color;
				})
				// 状态栏颜色调整
				if (window.jsBridge && window.jsBridge.inApp) {
					jsBridge.setSystemUIStyle(_this.themes[_this.readerSettings.theme].backColor, _this.themes[_this.readerSettings.theme].color);
				}
			}
		}, 300)
		this.updateCommentDisplayTimer = setInterval(() => {
			this.updateArticleCommentDisplay();
		}, 200);
		if (option.paragraphId) {
			this.pendingParagraphId = option.paragraphId;
		}
		this.refreshPage(option.id);
		// #ifdef H5
		window.addEventListener('popstate', this.browserBack)
		// #endif

		// 启动页面滚动日志记录
		this.updatePageProgress();
	},
	beforeDestroy() {
		if (this.readExpReporter) {
			this.readExpReporter.stop();
		}
		clearInterval(this.navigationBarController);
		clearInterval(this.pageProgressInterval);
		clearInterval(this.updateCommentDisplayTimer);
		// #ifdef H5
		window.removeEventListener("popstate", this.browserBack);
		// #endif
	},
	onShow() {
		if (this.readExpReporter) {
			this.readExpReporter.start();
			this.readExpReporter.markActive();
		}
	},
	async onHide() {
		if (this.readExpReporter) {
			await this.readExpReporter.stop();
		}
	},
	async onUnload() {
		if (this.readExpReporter) {
			await this.readExpReporter.stop();
		}
		// #ifdef H5
		window.removeEventListener("popstate", this.browserBack);
		// #endif
	},
	onPageScroll(res) {
		this.scrollTop = res.scrollTop; //距离页面顶部距离
		this.doUpdateCommentDisplay = true;
		this.markReadActivity();
	},
	computed: {
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
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-wrap: wrap;
	min-height: calc(100vh - 100rpx - 44px);

	padding: 50rpx 0;

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

::v-deep .commentDrawer .el-drawer__body {
	padding: 0;
	overflow: hidden;
}

::v-deep .commentDrawer .bookCommentDrawer {
	position: relative;
	height: 100%;
	overflow: hidden;
	background-color: #fff;
	border-radius: 16px 16px 0 0;
}

::v-deep .commentDrawer .bookCommentDrawer .title {
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
	background-color: #fff;
	border-bottom: 1px solid #efefef;
	flex-shrink: 0;
}

::v-deep .commentDrawer .bookCommentDrawer .closeBtn {
	position: absolute;
	right: 10px;
	top: 10px;
	font-size: 24px;
	width: 24px;
	height: 24px;
	line-height: 24px;
	text-align: center;
	z-index: 61;
	color: #909399;
}

::v-deep .commentDrawer .bookCommentDrawer .commentOuter {
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
