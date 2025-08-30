<template>
	<div class="outer" :class="writerSettings.theme"
		:style="{ 'transition': 'background-color .5s, color .5s', '--statusBarHeight': 0 + 'px' }"
		@touchstart="documentOnPress = true; clearEditorImagesEditButton()" @touchend="documentOnPress = false">
		<div class="topBar">
			<input class="input" placeholder="章节标题" v-model="article.title"
				:style="{ fontSize: writerSettings.fontSize + 'rpx' }" />
			<div class="textCount">
				{{ textCount }}&nbsp;字 | {{ imageCount }}&nbsp;图
				<div class="saveNotify"><complete-icon ref="completeIcon" style="margin-right: 5rpx; transform: translateY(5rpx);"></complete-icon>
				</div>
			</div>
		</div>
		<div class="middleBar">
			<editor class="textarea" placeholder="" @input="onInput" @ready="onEditorReady"
				:style="{ fontSize: writerSettings.fontSize + 'rpx' }"
				:class="{ 'symbolsShown': writerSettings.showSymbols }"></editor>
			<div class="punctuationToolBar" v-show="writerSettings.showSymbols" :class="writerSettings.theme">
				<p style=" font-family: iconfont !important;font-size: 50rpx;" @click="insertPunctuation('　　')">&#xe62b;
				</p>
				<p v-for="(item, index) in punctuations" :key="index" @click="insertPunctuation(item)">{{ item }}</p>
			</div>
		</div>
		<!-- 		<uni-popup ref="popup" type="bottom">
			<view class="tippingBar">
				<toolBox :selectText="selectText" :articleTitle="article.title"></toolBox>
			</view>
		</uni-popup> -->
		<uni-popup ref="setPopup" type="bottom">
			<view class="settingBar">
				<div class="line">
					<div class="button blue theme" @click="changeTheme('blue')"
						:class="{ 'selected': writerSettings.theme == 'blue' }">蓝</div>
					<div class="button yellow theme" @click="changeTheme('yellow')"
						:class="{ 'selected': writerSettings.theme == 'yellow' }">黄</div>
					<div class="button green theme" @click="changeTheme('green')"
						:class="{ 'selected': writerSettings.theme == 'green' }">绿</div>
					<div class="button purple theme" @click="changeTheme('purple')"
						:class="{ 'selected': writerSettings.theme == 'purple' }">紫</div>
					<div class="button black theme" @click="changeTheme('black')"
						:class="{ 'selected': writerSettings.theme == 'black' }">黑</div>
					<div class="button white theme" @click="changeTheme('white')"
						:class="{ 'selected': writerSettings.theme == 'white' }">白</div>
				</div>
				<div class="normalLine">
					<div class="left">字体大小</div>
					<div class="right">
						<el-slider v-model="writerSettings.fontSize" :min="31" :max="49" :step="2" show-stops
							:show-tooltip="false" @change="fontSizeChanged"></el-slider>
					</div>
				</div>
				<div class="lrLine">
					<div class="left">显示标点符号快捷栏</div>
					<div class="right">
						<el-switch v-model="writerSettings.showSymbols" active-color="#13ce66" inactive-color="#ff4949"
							@change="fontSizeChanged">
						</el-switch>
					</div>
				</div>
				<div class="line">
					自动排版设置
				</div>
				<div class="lrLine">
					<div class="left">
						段间空行
					</div>
					<div class="right">
						<el-switch v-model="writerSettings.openTypeSet" active-color="#13ce66" inactive-color="#ff4949"
							@change="fontSizeChanged">
						</el-switch>
					</div>
				</div>
			</view>
		</uni-popup>

		<!-- 版本冲突对话框 -->
		<conflict-dialog ref="conflictDialog"></conflict-dialog>
	</div>
</template>

<script>
import axios from 'axios'
import toolBox from '../../components/essay_toolBox/toolBox.vue'
import uniFab from '../../uni_modules/uni-fab/components/uni-fab/uni-fab.vue'
import conflictDialog from '../../components/conflictDialog.vue'
import { rpxToPx } from "../../lib/utils.js"
import { writerArticleDB } from "../../lib/db.js"
import { getServerTime } from "../../lib/utils.js"
import completeIcon from '../../components/completeIcon.vue'
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
export default {
	components: {
		uniFab, toolBox, conflictDialog, completeIcon, uniIcons
	},
	data() {
		return {
			chapterId: 0,
			article: {},
			fab_pattern: {
				color: 'gray',
				backgroundColor: '#FFFFFF',
				selectedColor: 'rgb(234, 171, 11)',
				buttonColor: 'orange'
			},
			fab_content: [
				{
					iconPath: '/static/icons/draft.png',
					text: '存草稿',
					active: false
				},
				{
					iconPath: '/static/icons/upload.png',
					text: '发布',
					active: false
				}
			],
			textCount: 0,
			imageCount: 0,
			articleFocus: false,
			articleCursor: 0,
			editorCtx: undefined,
			punctuations: ["，", "。", "、", "！", "？", "：", "“”", "《》"],
			article_changed: false,
			selectText: "",
			saveInterval: undefined,
			slowSaveInterval: undefined, // 慢保存定时器
			firstLocalCheck: true,
			writerSettings: {},
			lastDetailText: undefined,
			themes: {
				blue: {
					color: "#115574",
					backColor: "#c4e8fe",
				},
				yellow: {
					backColor: "#FFEFD6",
					color: "#502727",
				},
				green: {
					backColor: "#b7f7c1",
					color: "#093811",
				},
				purple: {
					backColor: "#fcc4ff",
					color: "#310024",
				},
				black: {
					backColor: "#000000",
					color: "#CECECE",
				},
				white: {
					backColor: "#ffffff",
					color: "#000000",
				}
			},
			imageEditInterval: undefined,
			documentOnPress: false,
			loadComplete: false,
			notIncrementalChangeCount: 0,
			lastSaveTime: new Date(),
			lastInputTime: new Date(),
			lastUploadTime: new Date(),
			hasNewInput: false,
			saveNotifyText: "已保存"
		}
	},
	onBackPress(e) {
	},
	beforeDestroy() {
		// 组件销毁前清理所有定时器
		this.endLocalSaveTimer();
	},
	methods: {
		utc2timestamp(utc_datetime) {
			// 转为正常的时间格式 年-月-日 时:分:秒
			var T_pos = utc_datetime.indexOf('T');
			var Z_pos = utc_datetime.indexOf('Z');
			var year_month_day = utc_datetime.substr(0, T_pos);
			var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
			var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

			// 处理成为时间戳
			timestamp = new Date(Date.parse(new_datetime));
			timestamp = timestamp.getTime();
			timestamp = timestamp / 1000;

			// 增加8个小时，北京时间比utc时间多八个时区
			var timestamp = timestamp + 8 * 60 * 60;

			// 时间戳转为时间
			return parseInt(timestamp) * 1000; // 2017-03-31 16:02:06
		},
		handleSetContent() {
			this.editorCtx.getContents({
				success: (res) => {
					this.lastDetailText = res.text;
				}
			})
		},
		delta2Rich(delta) {
			let rich = [];
			let id = 1;
			for (let item of delta.ops) {
				if (item.insert.image != undefined) {
					rich.push({
						type: "image",
						img: item.insert.image,
						id: ++id
					})
				} else {
					let textItems = item.insert.split("\n");
					for (let textItem of textItems) {
						rich.push({
							type: "text",
							value: textItem,
							id: ++id
						})
					}
				}
			}
			return rich;
		},
		rich2Delta(richContent) {
			let delta = { ops: [] };
			for (let item of richContent) {
				if (item.type == 'text') {
					delta.ops.push({
						insert: item.value + "\n"
					})
				} else if (item.type == "image") {
					delta.ops.push({
						insert: {
							image: item.img
						}
					})
				}
			}
			let last = delta.ops[delta.ops.length - 1].insert;
			if (last.image == undefined) {
				delta.ops[delta.ops.length - 1].insert = delta.ops[delta.ops.length - 1].insert.replace("\n", "");
			}
			return delta;
		},
		async getArticleWriter() {
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			let res = await axios.get(this.$baseUrl + '/essays/get_article_writer?id=' + this.chapterId,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			)
			return res;
		},
		async syncArticleWriter() {
			let currentServerTime = await getServerTime();
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			let res = await axios.post(this.$baseUrl + '/essays/sync_article_writer_from_reader',
				{
					article_id: this.chapterId,
					create_time: currentServerTime
				},
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			)
			return res;
		},
		async uploadArticleWriter(currentServerTime, isFastSave=false, isForce=false) {
			this.lastUploadTime = new Date();
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			let res = await axios.post(this.$baseUrl + '/essays/upload_article_writer',
				{
					article_id: this.chapterId,
					title: this.article.title,
					content: this.article.content,
					create_time: currentServerTime,
					novel_id: this.article.novel_info.novel_id,
					is_fast_save: isFastSave,
					is_force: isForce
				},
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			)
			// uni.showToast({
			// 	title: '同步成功',
			// 	icon: 'success',
			// 	duration: 2000
			// })
			return res;
		},
		//编辑器准备完毕以后执行初始化代码
		async onEditorReady() {
			uni.hideLoading();
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			try {
				let res = await this.getArticleWriter();

				const localArticles = await writerArticleDB.articles
					.where('article_id')
					.equals(Number(this.chapterId))
					.toArray();

				let latestLocalArticle = undefined;
				if (localArticles.length > 0) {
					latestLocalArticle = localArticles.reduce((latest, current) => {
						return latest.create_time > current.create_time ? latest : current;
					});
				}

				// 判断云端内容和本地内容的情况
				let hasLocalContent = (latestLocalArticle != undefined);
				let hasCloudContent = (res.data != "no data");


				if (hasCloudContent && hasLocalContent) {
					// 云端内容与本地内容时间不一致，提示用户保留哪一份
					if (latestLocalArticle.create_time != res.data.create_time) {
						await new Promise((resolve, reject) => {
							// 解析云端和本地版本的content，统计字数、图数
							const localContent = JSON.parse(latestLocalArticle.content);
							const cloudContent = JSON.parse(res.data.content);

							// 统计本地版本的字数和图片数
							let localTextCount = 0;
							let localImageCount = 0;
							localContent.forEach(item => {
								if (item.type === 'text') {
									localTextCount += item.value.length;
								} else if (item.type === 'image') {
									localImageCount++;
								}
							});

							// 统计云端版本的字数和图片数
							let cloudTextCount = 0;
							let cloudImageCount = 0;
							cloudContent.forEach(item => {
								if (item.type === 'text') {
									cloudTextCount += item.value.length;
								} else if (item.type === 'image') {
									cloudImageCount++;
								}
							});

							// 将YYYYMMDDhhmmdd格式的字符串转换为时间格式YYYY-MM-DD HH:MM:SS
							const formatTime = (dateString) => {
								// 确保输入是字符串
								dateString = String(dateString);

								// 解析YYYYMMDDhhmmdd格式
								const year = dateString.substring(0, 4);
								const month = dateString.substring(4, 6);
								const day = dateString.substring(6, 8);
								const hours = dateString.substring(8, 10);
								const minutes = dateString.substring(10, 12);
								const seconds = dateString.length >= 14 ? dateString.substring(12, 14) : '00';

								return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
							};

							const localTimeFormatted = formatTime(latestLocalArticle.create_time);
							const cloudTimeFormatted = formatTime(res.data.create_time);

							// 尝试使用自定义弹窗组件，提供更舒适的UI体验
							try {
								this.$refs.conflictDialog.show({
									title: '版本冲突提示',
									type: 'conflict',
									local: {
										time: localTimeFormatted,
										isNewer: localTimeFormatted > cloudTimeFormatted,
										textCount: localTextCount,
										imageCount: localImageCount
									},
									cloud: {
										time: cloudTimeFormatted,
										isNewer: cloudTimeFormatted > localTimeFormatted,
										textCount: cloudTextCount,
										imageCount: cloudImageCount
									},
									callback: async (action) => {
										if (action === 'local') {
											// 保留本地内容
											this.article = { ...res.data, ...latestLocalArticle };
											resolve();
										} else if (action === 'cloud') {
											// 保留云端内容
											this.article = res.data;
											resolve();
										} else {
											// 取消操作
											resolve();
										}
										// 无论如何，同步本地内容、上传云端内容
										let currentServerTime = await getServerTime();
										this.slowSaveLocalArticle(currentServerTime, true);
										this.uploadArticleWriter(currentServerTime, false, true);
									}
								});
							} catch (error) {
								uni.showToast({
									title: '版本冲突检测失败，请联系管理员',
									icon: 'none',
									duration: 2000
								});
								return;
							}
						})
					} else {
						// 云端内容与本地内容时间一致，使用哪个都没问题
						this.article = { ...res.data, ...latestLocalArticle };
					}
				}

				if (hasCloudContent && !hasLocalContent) {
					// 本地没有内容，云端有内容，使用云端内容
					this.article = res.data;
				}


				if(!hasCloudContent) {
					// 云端没有内容，向云端请求从reader_articles中把内容同步过来。
					await this.syncArticleWriter();
					// 同步完成后，重新获取一次内容
					await new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve();
						}, 500);
					});
					res = await this.getArticleWriter();
					this.article = res.data;
				}

				uni.createSelectorQuery().select('.textarea').context((res) => {
					this.editorCtx = res.context;
					this.editorCtx.setContents({//赋值
						delta: this.rich2Delta(JSON.parse(this.article.content)),
						success: () => {
							this.handleSetContent();
						}
					});
				}).exec();
				this.countText();
				// 启动本地备份服务
				this.startLocalSaveTimer()
			} catch (error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			}
			this.loadComplete = true;
			uni.hideLoading();
		},
		save(drafting, msg) {
			if (this.article.title.replace(/(^\s*)|(\s*$)/g, "") == "" || this.article.content.replace(/(^\s*)|(\s*$)/g, "") == "") {
				uni.showToast({
					title: "标题或文章内容不能为空",
					icon: 'none',
					duration: 2000
				});
				return;
			};
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;;
			let _this = this;
			this.buttonLock = false;
			axios.post(this.$baseUrl + '/essays/modify_article',
				{
					title: this.article.title,
					content: this.article.content,
					is_draft: drafting,
					article_id: this.chapterId
				},
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				},
			)
				.then(function (response) {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
					_this.endLocalSaveTimer();
					setTimeout(() => {
						uni.navigateBack({

						});
					}, 2000)
				})
				.catch(function (error) {
					//console.log(error);
					if (error) {
						uni.showToast({
							title: "章节上传失败，请重试",
							icon: 'none',
							duration: 2000
						});
					}
				})
		},
		countText() {
			this.textCount = 0;
			this.imageCount = 0;
			for(let item of JSON.parse(this.article.content)){
				if(item.type == "text"){
					this.textCount += item.value.length;
				} else if(item.type == "image") {
					this.imageCount ++;
				}
			}
		},
		onInput(e) {
			this.lastInputTime = new Date();
			this.hasNewInput = true;
			if (e.detail.text) {
				if (this.lastDetailText) {
					let currentRichContent = JSON.parse(this.article.content);
					if (e.detail.text.length - this.lastDetailText.length == 1) {
						for (let i = 0; i < e.detail.text.length; i++) {
							if (this.lastDetailText[i] != e.detail.text[i]) {
								if (e.detail.text[i] == '\n') {
									this.$nextTick(function () {
										this.editorCtx.insertText({
											text: "　　"
										});
									})
								}
								break;
							}
						}
					}
				}
				this.lastDetailText = e.detail.text;
			}
			if (e.detail.delta) {
				this.article.content = JSON.stringify(this.delta2Rich(e.detail.delta));
				this.article_changed = true;
				this.countText();
			}
			setTimeout(() => {
				let qlEditorDom = document.querySelector(".ql-editor");
				if (qlEditorDom !== undefined) {
					if (qlEditorDom.scrollHeight - qlEditorDom.scrollTop - qlEditorDom.clientHeight <= rpxToPx(30)) {
						qlEditorDom.scrollTo(0, qlEditorDom.scrollHeight + qlEditorDom.clientHeight)
					}
				}
			})
		},
		insertPunctuation(punctuation) {
			// 判断是否为成对标点
			if (punctuation === '《》' || punctuation === '“”') {
				this.editorCtx.insertText({
					text: punctuation,
					success: () => {
						// 获取当前选区
						this.editorCtx.getContents({
							success: (res) => {
								const selection = window.getSelection();
								const range = selection.getRangeAt(0);

								// 将光标向前移动一个字符
								range.setStart(range.startContainer, range.startOffset - 1);
								range.setEnd(range.endContainer, range.endOffset - 1);

								// 应用新的选区
								selection.removeAllRanges();
								selection.addRange(range);
							}
						});
					}
				});
			} else {
				// 普通标点符号直接插入
				this.editorCtx.insertText({
					text: punctuation
				});
			}
		},
		formatEssay() {
			this.editorCtx.getContents({
				success: (res) => {
					// 使用 delta 操作数组处理内容
					let ops = res.delta.ops;
					let formattedOps = [];

					ops.forEach((op, index) => {
						if (typeof op.insert === 'string') {
							// 处理文本内容
							let textLines = op.insert.split('\n');
							textLines.forEach((line, i) => {
								// 去除首尾空格
								line = line.trim();
								if (line) {
									// 添加缩进
									formattedOps.push({
										insert: '　　' + line
									});
									// 添加换行
									formattedOps.push({
										insert: '\n'
									});
									// 如果启用了段间空行且不是最后一个文本段落
									if (this.writerSettings.openTypeSet &&
										i !== textLines.length - 1) {
										formattedOps.push({
											insert: '\n'
										});
									}
								}
							});
						} else if (op.insert.image) {
							// 保留图片
							formattedOps.push(op);
							// 在图片后添加换行
							formattedOps.push({
								insert: '\n'
							});
							// 如果启用了段间空行
							if (this.writerSettings.openTypeSet) {
								formattedOps.push({
									insert: '\n'
								});
							}
						}
					});

					// 设置格式化后的内容
					this.editorCtx.setContents({
						delta: {
							ops: formattedOps
						},
						success: () => {
							this.handleSetContent();
							this.editorCtx.getContents({
								success: (res) => {
									this.onInput({ detail: { delta: res.delta } });
								}
							});
							uni.showToast({
								title: "自动排版完成",
								icon: 'none',
								duration: 2000
							});
						}
					});
				}
			});
		},
		async saveLocalArticle(currentServerTime) {
			console.log("saveLocalArticle - 快保存");
			this.lastSaveTime = new Date();
			try {
				// 获取当前文章内容
				const currentContent = JSON.parse(this.article.content);
				const articleId = this.article.article_id;
				console.log(articleId)

				// 查找最近保存的本地文章（只查找快保存的记录）
				const localArticles = await writerArticleDB.articles
					.where('article_id')
					.equals(articleId)
					.and(article => article.is_slow_save !== true) // 只查找快保存的记录
					.toArray();

				console.log(`找到 ${localArticles.length} 个本地快保存的文章版本`);

				if (localArticles.length === 0) {
					// 如果不存在本地文章，则保存当前版本
					console.log('不存在本地快保存文章，保存当前版本');
					await writerArticleDB.articles.add({
						article_id: articleId,
						title: this.article.title,
						content: this.article.content,
						create_time: currentServerTime,
						is_slow_save: false // 标记为快保存
					});
					this.updateSaveNotify("已保存更改", true);
					console.log('本地快保存文章保存成功');
				} else {
					// 获取最新的本地文章
					const latestLocalArticle = localArticles.reduce((latest, current) => {
						return latest.create_time > current.create_time ? latest : current;
					});

					const localContent = JSON.parse(latestLocalArticle.content);

					// 使用双指针算法检测增量修改
					let isIncrementalChange = true;
					let hasNewContent = false;

					// 创建一个映射来跟踪本地内容中每个元素的位置
					const localItemMap = new Map();
					localContent.forEach((item, index) => {
						// 使用类型和内容作为键
						const key = item.type === 'text' ?
							`text_${item.value}` :
							`image_${item.img}`;

						if (!localItemMap.has(key)) {
							localItemMap.set(key, []);
						}
						localItemMap.get(key).push(index);
					});

					// 使用动态规划找到最长公共子序列
					const lcs = [];
					const matchedLocal = new Set();
					const matchedCurrent = new Set();

					// 检查文本是否为增量修改（只增加了字符，没有删除字符）
					const isTextIncremental = (oldText, newText) => {
						// 如果新文本比旧文本短，肯定不是增量修改
						if (newText.length < oldText.length) return false;

						// 使用双指针检查是否只是增加了字符
						let i = 0, j = 0;
						while (i < oldText.length && j < newText.length) {
							if (oldText[i] === newText[j]) {
								i++;
								j++;
							} else {
								// 如果字符不匹配，只移动新文本指针
								j++;
							}
						}

						// 如果旧文本指针到达末尾，说明所有旧字符都在新文本中找到了
						return i === oldText.length;
					};

					// 第一遍：找出完全匹配的元素和增量修改的文本
					currentContent.forEach((currentItem, currentIndex) => {
						// 对于图片，使用完全匹配
						if (currentItem.type === 'image') {
							const key = `image_${currentItem.img}`;

							if (localItemMap.has(key)) {
								// 找到第一个未匹配的位置
								const possibleMatches = localItemMap.get(key);
								for (const localIndex of possibleMatches) {
									if (!matchedLocal.has(localIndex)) {
										lcs.push({ currentIndex, localIndex });
										matchedLocal.add(localIndex);
										matchedCurrent.add(currentIndex);
										break;
									}
								}
							}
						} else { // 对于文本，先尝试完全匹配，再尝试增量匹配
							const key = `text_${currentItem.value}`;

							// 尝试完全匹配
							if (localItemMap.has(key)) {
								const possibleMatches = localItemMap.get(key);
								for (const localIndex of possibleMatches) {
									if (!matchedLocal.has(localIndex)) {
										lcs.push({ currentIndex, localIndex });
										matchedLocal.add(localIndex);
										matchedCurrent.add(currentIndex);
										break;
									}
								}
							} else {
								// 如果没有完全匹配，尝试查找增量修改的文本
								for (let i = 0; i < localContent.length; i++) {
									if (!matchedLocal.has(i) && localContent[i].type === 'text') {
										const oldText = localContent[i].value;
										const newText = currentItem.value;

										if (isTextIncremental(oldText, newText)) {
											console.log(`检测到段落内增量修改: ${oldText} -> ${newText}`);
											lcs.push({ currentIndex, localIndex: i });
											matchedLocal.add(i);
											matchedCurrent.add(currentIndex);
											break;
										}
									}
								}
							}
						}
					});

					// 排序LCS，确保顺序正确
					lcs.sort((a, b) => a.localIndex - b.localIndex);

					// 统计段落内增量修改的数量
					let internalIncrementalCount = 0;
					lcs.forEach(match => {
						const localItem = localContent[match.localIndex];
						const currentItem = currentContent[match.currentIndex];

						if (localItem.type === 'text' && currentItem.type === 'text' &&
							localItem.value !== currentItem.value) {
							internalIncrementalCount++;
						}
					});

					// 检查是否有新增内容（包括新段落或段落内的增量修改）
					hasNewContent = currentContent.length > lcs.length || internalIncrementalCount > 0;

					if(latestLocalArticle.title != this.article.title) {
						hasNewContent = true;
					}

					// 检查是否是纯增量修改
					// 如果所有本地内容都在当前内容中找到了匹配，则是增量修改
					isIncrementalChange = matchedLocal.size === localContent.length;

					console.log(`LCS长度: ${lcs.length}, 本地内容长度: ${localContent.length}, 当前内容长度: ${currentContent.length}`);
					console.log(`段落内增量修改数量: ${internalIncrementalCount}`);
					console.log(`是否为增量修改: ${isIncrementalChange}, 是否有新增内容: ${hasNewContent}`);

					// 如果有未匹配的本地内容，则不是增量修改
					if (matchedLocal.size < localContent.length) {
						console.log(`有 ${localContent.length - matchedLocal.size} 个本地段落未匹配，非增量修改`);
						isIncrementalChange = false;
					}

					// 如果是增量修改，删除上个版本并保存新版本
					if (isIncrementalChange && hasNewContent) {
						console.log('检测到增量修改');
						await writerArticleDB.articles.delete(latestLocalArticle.id);
						await writerArticleDB.articles.add({
							article_id: articleId,
							title: this.article.title,
							content: this.article.content,
							create_time: currentServerTime,
							is_slow_save: false // 标记为快保存
						});
						this.updateSaveNotify("已保存更改", true);
						console.log('新版本保存成功');
					} else if (!isIncrementalChange) {
						// 如果不是增量修改，直接保存新版本
						console.log('检测到非增量修改');
						this.notIncrementalChangeCount ++;
						if(this.notIncrementalChangeCount >= 10) {
							// 非增量修改次数超过10次，执行慢保存
							this.notIncrementalChangeCount = 0;
							await this.slowSaveLocalArticle(currentServerTime);
							await this.uploadArticleWriter(currentServerTime);
							return;
						}
						await writerArticleDB.articles.delete(latestLocalArticle.id);
						await writerArticleDB.articles.add({
							article_id: articleId,
							title: this.article.title,
							content: this.article.content,
							create_time: currentServerTime,
							is_slow_save: false // 标记为快保存
						});
						this.updateSaveNotify("已保存更改", true);
						console.log('新版本保存成功');
					} else {
						console.log('内容未发生变化，无需保存');
					}
				}
			} catch (error) {
				console.error('保存本地文章时出错:', error);
			}
		},

		// 慢保存方法 - 如果与上次记录不一样就保存
		async slowSaveLocalArticle(currentServerTime, isForce) {
			console.log("slowSaveLocalArticle - 慢保存");
			// let currentServerTime = await getServerTime();
			try {
				// 获取当前文章内容
				const articleId = this.article.article_id;
				console.log(`慢保存文章ID: ${articleId}`);

				if(!isForce) {
					// 检查是否与上次记录不一样
					const localArticles = await writerArticleDB.articles
						.where('article_id')
						.equals(Number(this.article.article_id))
						.toArray();
					let latestLocalArticle = null;
					console.log(localArticles);
					if(localArticles.length > 0) {
						latestLocalArticle = localArticles.reduce((prev, current) => {
							return prev.create_time > current.create_time ? prev : current;
						});
					}

					if(latestLocalArticle && latestLocalArticle.content == this.article.content && latestLocalArticle.title == this.article.title) {
						console.log('内容未发生变化，无需保存');
						return;
					}
				}

				// 直接保存当前版本，不进行增量修改检测
				await writerArticleDB.articles.add({
					article_id: articleId,
					title: this.article.title,
					content: this.article.content,
					create_time: currentServerTime,
					is_slow_save: true // 标记为慢保存
				});
				console.log('慢保存成功');

			} catch (error) {
				console.error('慢保存本地文章时出错:', error);
			}
		},
		startLocalSaveTimer() {
			// 快保存定时器 - 1秒一次
			this.saveInterval = setInterval(async () => {
				// 检查是否超过1秒未输入
				if (new Date() - this.lastInputTime > 1000 && this.hasNewInput) {
					// 超过1秒未输入，执行快保存
					this.lastInputTime = new Date();
					this.hasNewInput = false;
					let currentServerTime = await getServerTime();
					this.saveLocalArticle(currentServerTime);
					this.uploadArticleWriter(currentServerTime, true);
					return;
				}

				if (new Date() - this.lastSaveTime > 10000) {
					// 超过10秒未保存，执行快保存
					let currentServerTime = await getServerTime();
					await this.saveLocalArticle(currentServerTime);
					await this.uploadArticleWriter(currentServerTime, true);
					return;
				}
			}, 1000);
		},
		async endLocalSaveTimer() {
			// 清理所有定时器
			clearInterval(this.saveInterval);
			let currentServerTime = await getServerTime();
			if (this.loadComplete) {
				this.slowSaveLocalArticle(currentServerTime);
				this.uploadArticleWriter(currentServerTime, false);
			}
		},
		fontSizeChanged() {
			window.localStorage.setItem("writerSettings", JSON.stringify(this.writerSettings));
		},
		changeTheme(themeName) {
			this.writerSettings.theme = themeName;
			window.localStorage.setItem("writerSettings", JSON.stringify(this.writerSettings));
			this.applyNavigationBarTheme();
		},
		applyNavigationBarTheme() {
			let pageHead = document.getElementsByClassName('uni-page-head')[0];
			let pageHeadBtn = document.querySelectorAll('.uni-page-head .uni-btn-icon');
			pageHeadBtn.forEach(element => {
				element.style.color = this.themes[this.writerSettings.theme].color;
			})
			pageHead.style.backgroundColor = this.themes[this.writerSettings.theme].backColor;
			// 状态栏颜色调整
			if (window.jsBridge && window.jsBridge.inApp) {
				jsBridge.setSystemUIStyle(this.themes[this.writerSettings.theme].backColor, this.themes[this.writerSettings.theme].color);
			}
		},
		clearEditorImagesEditButton() {
			const existingButtons = document.querySelectorAll('.image-edit-button');
			existingButtons.forEach(button => button.remove());
		},
		// 显示图片元素编辑按钮
		showEditorImagesEditButton() {
			// 1. 首先移除所有已存在的编辑按钮
			this.clearEditorImagesEditButton();

			if (this.documentOnPress) return;

			// 2. 获取编辑器和所有图片
			const editor = document.querySelector('.ql-editor');
			if (editor) {
				const images = editor.getElementsByTagName('img');

				// 3. 遍历所有图片
				Array.from(images).forEach(img => {
					// 检查图片是否在视口中可见
					const rect = img.getBoundingClientRect();
					const editorRect = editor.getBoundingClientRect();
					const isVisible = (
						rect.top <= editorRect.bottom &&
						rect.bottom >= editorRect.top &&
						rect.left <= editorRect.right &&
						rect.right >= editorRect.left
					);

					if (isVisible) {
						// 创建编辑按钮
						const editButton = document.createElement('div');
						editButton.className = 'image-edit-button';
						editButton.style.cssText = `
		                    position: fixed;
		                    left: ${rect.right - 35}px;
		                    top: ${rect.bottom - 35}px;
		                    width: 30px;
		                    height: 30px;
		                    background-color: rgba(0, 0, 0, 0.5);
		                    border-radius: 4px;
		                    cursor: pointer;
		                    display: flex;
		                    align-items: center;
		                    justify-content: center;
		                    color: white;
		                    z-index: 100;
		                `;

						// 添加编辑图标
						editButton.innerHTML = '✎';

						// 将编辑按钮添加到图片后面
						document.body.appendChild(editButton);

						// 绑定点击事件
						editButton.addEventListener('click', (e) => {
							e.stopPropagation();
							uni.showActionSheet({
								itemList: ['删除图片', '在下方插入段'],
								success: (res) => {
									if (res.tapIndex === 0) {
										// 删除图片
										img.remove();
										editButton.remove();
									} else if (res.tapIndex === 1) {
										// 在图片后插入段落
										let range = document.createRange();
										range.setStartAfter(img);
										range.setEndAfter(img);
										let selection = window.getSelection();
										selection.removeAllRanges();
										selection.addRange(range);

										this.editorCtx.insertText({
											text: '\n　　',
											success: () => {
												this.editorCtx.getContents({
													success: (res) => {
														this.onInput({ detail: { delta: res.delta } });
													}
												});
											}
										});
									}
								}
							});
						});
					}
				});
			}
		},
		// 初始化滚动监听
		initScrollListener() {
			this.imageEditInterval = setInterval(() => {
				this.showEditorImagesEditButton();
			}, 500)
		},
		updateSaveNotify(text, playAnimation) {
			this.saveNotifyText = text;
			if(playAnimation) this.$refs.completeIcon.playAnimation();
		},
	},
	onNavigationBarButtonTap(e) {
		if (e.text == '\ue60e ') {
			uni.navigateBack();
			setTimeout(()=> {
				uni.navigateTo({
					url: `/pages/writers/chapterTimeMachine?id=${this.chapterId}&novelId=${this.article.novel_info.novel_id}`
				});
			}, 300)
		}else if (e.text == "\ue61f ") {
			uni.chooseImage({
				success: (chooseImageRes) => {
					uni.showToast({
						title: "图片上传中",
						icon: 'loading',
						duration: 2000
					});
					const tempFilePaths = chooseImageRes.tempFilePaths;
					uni.uploadFile({
						url: 'https://storage.codesocean.top/api/resource/upload?container=172018735018984', //仅为示例，非真实的接口地址
						filePath: tempFilePaths[0],
						name: 'file',
						header: {
							ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
						},
						success: (uploadFileRes) => {
							this.editorCtx.insertImage({
								src: "http://storage.codesocean.top/api/resource/get/" + JSON.parse(uploadFileRes.data).data.resource_id
							})
							uni.showToast({
								title: "上传成功",
								icon: 'success',
								duration: 2000
							});
						}
					});
				}
			});
		} else if (e.text == "\ue6fa ") {
			let _this = this;
			this.editorCtx.getSelectionText({
				success(e) {
					if (e.text == "") {
						_this.editorCtx.getContents({
							success: (res) => {
								_this.selectText = res.text;
							},
						})
					} else {
						_this.selectText = e.text;
					}
					_this.$refs.popup.open('bottom');
				}
			})
		} else if (e.text == "\ue70f ") {
			let _this = this;
			_this.$refs.setPopup.open('bottom');
		} else if (e.text == "\ue624 ") {//撤销
			this.editorCtx.undo({
				success: function () {
				}
			});
		} else if (e.text == "\ue625 ") {//重做
			this.editorCtx.redo({
				success: function () {
				}
			});
		} else if (e.text == "\ue629 ") {//整理样式
			this.formatEssay();
		} else if (e.text == "发布 ") {
			let _this = this;
			let itemList = ['发布章节'];
			if(_this.article.is_draft == 0){
				itemList.push("退回章节为草稿");
			}
			uni.showActionSheet({
				itemList,
				success: function (res) {
					if (res.tapIndex == 0) {
						if (_this.article.novel_info.is_personal == 1) {
							uni.showToast({
								title: "小说尚未公开，无法发布文章",
								icon: 'none',
								duration: 2000
							});
							return;
						}
						_this.save(0, "发布成功")
					}
					if (res.tapIndex == 1) {
						if (_this.article.is_draft == 0) {
							uni.showModal({
								title: '提示',
								content: '退回章节为草稿会使已发布的章节下架，确定继续吗？',
								success: function (res) {
									if (res.confirm) {
										_this.save(1, "保存成功");
									} else if (res.cancel) {
										return;
									}
								}
							});
						} else {
							_this.save(1, "保存成功");
						}
					}
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		}
	},
	onLoad(params) {
		this.chapterId = params.id;
		uni.showLoading({
			title: '编辑器初始化'
		});

		let writerSettings = window.localStorage.getItem("writerSettings");
		if (writerSettings && JSON.parse(writerSettings)["version"] == 220412) {
			this.writerSettings = JSON.parse(writerSettings);
		} else {
			this.writerSettings = {
				version: 220412,
				showSymbols: true,
				fontSize: 35,
				openTypeSet: false,
				showFab: false,
				theme: "yellow",
				codeMode: false
			};
			window.localStorage.setItem("writerSettings", JSON.stringify(this.writerSettings));
		}

		setTimeout(() => {
			this.applyNavigationBarTheme();
		})


		// 在页面加载完成后初始化滚动监听
		this.$nextTick(() => {
			this.initScrollListener();
		});


	},
	beforeDestroy() {
		clearInterval(this.imageEditInterval);
		this.clearEditorImagesEditButton();
		this.endLocalSaveTimer();
	}
}
</script>

<style scoped lang="less">
.outer {
	height: calc(100vh - 44px - var(--statusBarHeight)) !important;
	overflow: hidden !important;

	.topBar {
		height: 100rpx;
		border-bottom: #a6a6a6 1px solid;
		position: relative;
		box-shadow:
			0px 4px 1.5px rgba(0, 0, 0, 0.006),
			0px 9.7px 3.5px rgba(0, 0, 0, 0.008),
			0px 18.3px 6.6px rgba(0, 0, 0, 0.01),
			0px 32.6px 11.8px rgba(0, 0, 0, 0.012),
			0px 61px 22.1px rgba(0, 0, 0, 0.014),
			0px 146px 53px rgba(0, 0, 0, 0.02);

		input {
			height: 100%;
			padding-left: 20rpx;
			font-size: 35rpx;
			// background-color: #fffaf0;
			font-weight: bold;
			// color:#3d3d3d;
			line-height: 150%;
		}

		div.textCount {
			display: flex;
			position: absolute;
			right: 8rpx;
			bottom: 0;
			font-size: 28rpx;
			color: rgb(175, 81, 38);
			align-items: center;

			div.saveNotify{
				display: flex;
				align-items: center;
				margin-left: 10rpx;
				color: rgb(156, 156, 156);
			}
			
			div.time-machine-btn {
				display: flex;
				align-items: center;
				margin-left: 15rpx;
				padding: 5rpx 10rpx;
				background-color: rgba(180, 111, 88, 0.1);
				border-radius: 8rpx;
				cursor: pointer;
				
				text {
					margin-left: 5rpx;
					color: #B46F58;
					font-size: 24rpx;
				}
				
				&:active {
					opacity: 0.8;
				}
			}
		}
	}

	.middleBar {
		box-sizing: border-box;
		height: calc(100vh - 44px - 100rpx - var(--statusBarHeight)) !important;
		overflow: hidden;

		.textarea {
			// margin: 30rpx 0;
			padding: 0 30rpx;
			width: calc(100vw);
			height: calc(100%);
			font-size: 35rpx;
			line-height: 60rpx;
			// background-color: #fffaf0;
			// color:#3d3d3d;
			line-height: 150%;

			:deep(.ql-editor) {
				scroll-behavior: smooth;
				margin: 30rpx 0 !important;
				/* 确保编辑器内容区域也有平滑滚动 */
			}
		}

		.textarea.symbolsShown {
			height: calc(100% - 80rpx);
		}

		.punctuationToolBar {
			bottom: 0;
			height: 80rpx;
			width: 100%;
			z-index: 100;
			border-top: #b4b4b4 1rpx solid;
			display: flex;
			justify-content: center;

			p {
				width: 80rpx;
				height: 80rpx;
				font-weight: bold;
				line-height: 70rpx;
			}
		}
	}
}


.settingBar {
	background-color: #000000aa;
	padding: 30rpx;
	padding-top: 1rpx;
	color: rgb(203, 203, 203);

	.normalLine {
		margin-top: 15rpx;
	}

	.lrLine {
		margin-top: 15rpx;

		.left {
			float: left;
		}

		.right {
			float: right;
		}

		height:50rpx;
	}

	.line {
		display: flex;
		justify-content: space-evenly;
		margin-top: 30rpx;

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

div.outer.blue {
	background-color: #DDF3FE;
	color: #115574;
}

div.outer.yellow {
	background-color: #fffaf0;
	color: #3d3d3d;
}

div.outer.green {
	background-color: #C1E6C6;
	color: #093811;
}

div.outer.purple {
	background-color: #fde0ff;
	color: #310024;
}

div.outer.black {
	background-color: #282C35;
	color: #cecece;
}


.punctuationToolBar.blue {
	background-color: #c4e8fe;
	color: #115574;
}

.punctuationToolBar.yellow {
	background-color: #fff2d9;
	color: #3d3d3d;
}

.punctuationToolBar.green {
	background-color: #88e695;
	color: #093811;
}

.punctuationToolBar.purple {
	background-color: #fcc4ff;
	color: #310024;
}

.punctuationToolBar.black {
	background-color: #000000;
	color: #cecece;
}

.image-edit-button:hover {
	background-color: rgba(0, 0, 0, 0.7) !important;
}

.ql-editor img {
	max-width: 100%;
	height: auto;
}
</style>