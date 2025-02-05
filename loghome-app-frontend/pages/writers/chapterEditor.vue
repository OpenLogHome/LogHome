<template>
	<div class="outer" :class="writerSettings.theme" :style="{'transition': 'background-color .5s, color .5s', '--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}"
	@touchstart="documentOnPress=true; clearEditorImagesEditButton()" @touchend="documentOnPress=false">
		<div class="topBar">
			<input class="input" placeholder="章节标题" v-model="article.title"
				:style="{ fontSize: writerSettings.fontSize + 'rpx' }" />
			<div class="textCount">{{ textCount }}&nbsp;字 | {{ imageCount }}&nbsp;图</div>
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
	</div>
</template>

<script>
import axios from 'axios'
import toolBox from '../../components/essay_toolBox/toolBox.vue'
import uniFab from '../../uni_modules/uni-fab/components/uni-fab/uni-fab.vue'
export default {
	components: {
		uniFab, toolBox
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
			documentOnPress: false
		}
	},
	onBackPress(e) {
		if (e.from === 'navigateBack') {
			return false;
		}
		if (this.article_changed) {
			this.$nextTick(function () {
				uni.showModal({
					title: '提示',
					content: '您的改动还没有保存，确定离开吗？',
					success: function (res) {
						if (res.confirm) {
							uni.navigateBack({});
						}
					}
				});
			})
			return true;
		} else {
		}
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
		//编辑器准备完毕以后执行初始化代码
		onEditorReady() {
			uni.hideLoading();
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			axios.get(this.$baseUrl + '/essays/get_article?id=' + this.chapterId,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			).then((res) => {
				this.article = res.data[0];
				this.cloudTime = this.article.update_time;
				let that = this;
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
				let dbStatus = window.localStorage.getItem("IndexedDB");

				if (this.chapterId && dbStatus == "enabled" && this.$store.state.appVersion) {
					this.saveToBackUp(this.article.title, this.article.content);
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
			// 获取编辑器内容
			this.editorCtx.getContents({
				success: (res) => {
					// 字数统计：去除空格和换行符后的长度
					let text = res.text.replace(/\s+/g, '');
					this.textCount = text.length;

					// 图片统计：通过 delta 数据统计图片数量
					this.imageCount = res.delta.ops.filter(op => op.insert && op.insert.image).length;
				}
			});
		},
		onInput(e) {
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
		saveToBackUp(title, content) {
			let version = this.$DBVersion
			let _this = this;
			let IDBOpenDBRequest = indexedDB.open('LogCommunity', version);

			var db;

			IDBOpenDBRequest.onsuccess = function (e) {

				db = e.target.result;

				// 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
				var transaction = db.transaction('articleBackup', 'readwrite');

				// 通过事务来获取IDBObjectStore
				var store = transaction.objectStore('articleBackup');

				let data = {
					article_title: _this.article.title,
					article_content: _this.article.content,
					article_id: _this.chapterId,
					time: Date.now(),
					text_count: _this.textCount
				}


				// 往store表中添加数据
				var addArticleRequest = store.add(data);

			};

		},
		saveLocalArticle() {
			let dbStatus = window.localStorage.getItem("IndexedDB");
			let chapterId = this.chapterId;
			// console.log(this.article);
			let _this = this;
			// indexedDB本地文章查询
			if (chapterId != 0 && dbStatus == "enabled") {

				let version = this.$DBVersion
				let IDBOpenDBRequest = indexedDB.open('LogCommunity', version);

				var db;

				IDBOpenDBRequest.onsuccess = function (e) {

					db = e.target.result

					// 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
					var transaction = db.transaction('localArticles', 'readwrite');

					// 通过事务来获取IDBObjectStore
					var store = transaction.objectStore('localArticles');

					var request = store.openCursor(IDBKeyRange.only(chapterId.toString()));

					request.onsuccess = function (e) {
						uni.hideLoading();
						var cursor = e.target.result;
						// 如果找到数据了
						if (cursor) {
							var result = cursor.value;
							// console.log("localArticles",result)
							if (_this.article.content != undefined) {
								let cloudTime = _this.cloudTime;
								//如果本地存档新于云端存档
								if (_this.utc2timestamp(cloudTime) < result.time) {
									// console.log(_this.utc2timestamp(cloudTime),result.time);
									if (_this.firstLocalCheck) {
										if (result.article_content != _this.article.content) {
											_this.endLocalSaveTimer();
											uni.showModal({
												title: '提示',
												content: '你有未保存的存稿，是否恢复到上次退出时状态？',
												success: function (res) {
													if (res.confirm) {
														_this.article.title = result.article_title;
														_this.article.content = result.article_content;
													}
													uni.createSelectorQuery().select('.textarea').context((res) => {
														_this.editorCtx = res.context;
														_this.editorCtx.setContents({//赋值
															delta: _this.rich2Delta(JSON.parse(_this.article.content)),
															success: () => {
																_this.handleSetContent();
															}
														});
													}).exec();
													_this.countText();
													_this.startLocalSaveTimer();
												}
											});
										}
										_this.firstLocalCheck = false;
									} else {
										store.put({
											article_id: chapterId,
											article_title: _this.article.title,
											article_content: _this.article.content,
											time: Date.now() - 1000,
										}).onsuccess = function (event) {
											// console.log('存稿保存成功');
										};
									}
								} else {
									_this.firstLocalCheck = false;
									store.put({
										article_id: chapterId,
										article_title: _this.article.title,
										article_content: _this.article.content,
										time: Date.now() - 1000,
									}).onsuccess = function (event) {
										// console.log('存稿保存成功');
									};
								}
							}
						} else {
							//没有找到数据
							console.log("没找到本地文章数据")
							_this.firstLocalCheck = false;
							if (_this.article.content != undefined) {
								store.add({
									article_id: chapterId,
									article_title: _this.article.title,
									article_content: _this.article.content,
									time: Date.now() - 1000,
								}).onsuccess = function (event) {
									console.log('数据写入成功');
								};
							}


						}
					}
				};
			}
		},
		startLocalSaveTimer() {
			this.saveInterval = setInterval(() => {
				this.saveLocalArticle();
			}, 1000)
		},
		endLocalSaveTimer() {
			clearInterval(this.saveInterval);
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
		},
		clearEditorImagesEditButton() {
			const existingButtons = document.querySelectorAll('.image-edit-button');
			existingButtons.forEach(button => button.remove());
		},
		// 显示图片元素编辑按钮
		showEditorImagesEditButton() {
			// 1. 首先移除所有已存在的编辑按钮
			this.clearEditorImagesEditButton();
			
			if(this.documentOnPress) return;

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
	},
	onNavigationBarButtonTap(e) {
		if (e.text == "\ue61f ") {
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
		} else if (e.text == "完成 ") {
			let _this = this;
			uni.showActionSheet({
				itemList: ['发布章节', "保存为草稿"],
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
								content: '存草稿会使已发布的章节下架，确定继续吗？',
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

		let dbStatus = window.localStorage.getItem("IndexedDB");
		// indexedDB历史备份查询
		if (params.id && dbStatus == "enabled") {
			this.$bus.$on("AutoSave", () => {
				// console.log("AutoSave");
				this.saveToBackUp(this.article.title, this.article.content);
			})
		}

		this.startLocalSaveTimer()


		let _this = this;
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
		this.$bus.$off('AutoSave');
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
		  0px 146px 53px rgba(0, 0, 0, 0.02)
		;

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
			position: absolute;
			right: 8rpx;
			bottom: 0;
			font-size: 28rpx;
			color: rgb(175, 81, 38);
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
