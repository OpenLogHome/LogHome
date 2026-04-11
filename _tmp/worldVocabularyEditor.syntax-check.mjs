
	import axios from 'axios'
	import toolBox from '../../components/essay_toolBox/toolBox.vue'
	import uniFab from '../../uni_modules/uni-fab/components/uni-fab/uni-fab.vue'
	import customlist from '../../components/custom-list/index.js'
	import { createTreeExpReporter } from '../../lib/treeExpReporter.js'

	const DEFAULT_SETTINGS = {
		version: 24031701,
		showSymbols: true,
		fontSize: 35,
		openTypeSet: false,
		showFab: false,
		theme: 'yellow',
		codeMode: false
	}

	const EDIT_LOCK_HEARTBEAT_MS = 30 * 1000

	function createEmptyVocabularyContent() {
		return {
			desc: '',
			pic: undefined,
			attributes: [],
			relations: []
		}
	}

	function parseVocabularyContent(rawContent) {
		if (typeof rawContent !== 'string' || rawContent.trim() === '') {
			return createEmptyVocabularyContent()
		}

		try {
			const parsed = JSON.parse(rawContent)
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return createEmptyVocabularyContent()
			}
			return {
				desc: typeof parsed.desc === 'string' ? parsed.desc : '',
				pic: typeof parsed.pic === 'string' && parsed.pic.trim() !== '' ? parsed.pic : undefined,
				attributes: Array.isArray(parsed.attributes) ? parsed.attributes : [],
				relations: Array.isArray(parsed.relations) ? parsed.relations : []
			}
		} catch (error) {
			return createEmptyVocabularyContent()
		}
	}

	function parseVocabularyContentStrict(rawContent) {
		if (typeof rawContent !== 'string' || rawContent.trim() === '') {
			return createEmptyVocabularyContent()
		}

		const parsed = JSON.parse(rawContent)
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			throw new Error('invalid vocabulary content shape')
		}
		return {
			desc: typeof parsed.desc === 'string' ? parsed.desc : '',
			pic: typeof parsed.pic === 'string' && parsed.pic.trim() !== '' ? parsed.pic : undefined,
			attributes: Array.isArray(parsed.attributes) ? parsed.attributes : [],
			relations: Array.isArray(parsed.relations) ? parsed.relations : []
		}
	}
	export default {
		components: {
			uniFab,
			toolBox,
			customlist
		},
		data() {
			return {
				chapterId: 0,
				currentUserId: 0,
				article: {
					article_id: 0,
					title: '',
					content: JSON.stringify(createEmptyVocabularyContent()),
					novel_info: {},
					is_draft: 1
				},
				editorAccess: {
					access_role: 'owner',
					can_publish: true,
					can_edit_draft: true
				},
				editSessionId: '',
				currentEditLock: null,
				lockHeartbeatTimer: null,
				fab_pattern: {
					color: 'gray',
					backgroundColor: '#FFFFFF',
					selectedColor: 'rgb(234, 171, 11)',
					buttonColor: 'orange'
				},
				fab_content: [{
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
				articleFocus: false,
				articleCursor: 0,
				editorCtx: undefined,
				article_changed: false,
				selectText: "",
				saveInterval: undefined,
				firstLocalCheck: true,
				writeExpReporter: null,
				loadComplete: false,
				suppressContentWatcher: false,
				isSyncingEditorContent: false,
				writerSettings: { ...DEFAULT_SETTINGS },
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
				content: createEmptyVocabularyContent(),
				defaultAttrs: [
					"性别", "年龄", "身高", "体重", "血型", "生日", "学历", "性取向", "0/1",
					"信息素", "力量", "敏捷", "智力", "种族", "发色", "瞳色", "职业",
					"爱好", "人物特征", "优点", "缺点", "人设"
				],
				defaultAttrContents: {
					"性别": [
						"男", "女", "未知", "中性人"
					],
					"血型": [
						"A", "B", "O", "AB", "稀有血型"
					],
					"学历": [
						"幼儿园", "小学", "初中", "高中", "大学及以上"
					],
					"性取向": [
						"男", "女", "双性", "无性"
					],
					"0/1": [
						"攻", "受", "可攻可受"
					],
					"信息素": [
						"Alpha", "Beta", "Omega"
					],
					"种族": [
						"人族", "兽族", "虫族"
					]
				},
				vocabAttrVisible: false,
				vocabRelaVisible: false,
				imgUploadVisible: false,
				vocabAttr: {
					name: "",
					content: "",
					id: -1
				},
				vocabRela: {
					id: -1,
					targetId: "",
					targetTitle: "",
					relation: ""
				},
				vocabularies: [],
				suggestions: []
			}
		},
		computed: {
			currentTheme() {
				return this.themes[this.writerSettings.theme] || this.themes.yellow;
			},
			canPublishArticle() {
				return !!(this.editorAccess && this.editorAccess.can_publish === true);
			}
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			if (this.article_changed) {
				this.$nextTick(function() {
					uni.showModal({
						title: '提示',
						content: '您的改动还没有保存，确定离开吗？',
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack({});
							}
						}
					});
				})
				return true;
			} else {}
		},
		methods: {
			startWritingExpTimer() {
				if (!this.writeExpReporter) {
					this.writeExpReporter = createTreeExpReporter(this, 'write_seconds', { activeWindowMs: 45000 });
				}
				this.writeExpReporter.start();
				this.writeExpReporter.markActive();
			},
			async stopWritingExpTimer() {
				if (this.writeExpReporter) {
					await this.writeExpReporter.stop();
				}
			},
			markWritingActivity() {
				if (this.writeExpReporter) {
					this.writeExpReporter.markActive();
				}
			},
			getTokenInfo() {
				const raw = window.localStorage.getItem('token');
				if (!raw) return null;
				try {
					return JSON.parse(raw);
				} catch (error) {
					return null;
				}
			},
			getAuthToken() {
				const token = this.getTokenInfo();
				return token ? token.tk : null;
			},
			resolveCurrentUserId() {
				const token = this.getTokenInfo();
				this.currentUserId = token && token.id ? Number(token.id) : 0;
				return this.currentUserId;
			},
			generateEditSessionId() {
				return `world_vocab_${this.chapterId}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
			},
			persistWriterSettings() {
				window.localStorage.setItem("writerSettings", JSON.stringify(this.writerSettings));
			},
			initializeWriterSettings() {
				const raw = window.localStorage.getItem("writerSettings");
				if (!raw) {
					this.writerSettings = { ...DEFAULT_SETTINGS };
					this.persistWriterSettings();
					return;
				}

				try {
					const parsed = JSON.parse(raw);
					this.writerSettings = {
						...DEFAULT_SETTINGS,
						...parsed,
						version: DEFAULT_SETTINGS.version
					};
				} catch (error) {
					this.writerSettings = { ...DEFAULT_SETTINGS };
				}

				this.persistWriterSettings();
			},
			handleTitleInput() {
				this.markWritingActivity();
				this.article_changed = true;
			},
			handleVisibilityChange() {
				if (document.visibilityState === "hidden") {
					this.stopLockHeartbeat();
					this.releaseEditLock();
					return;
				}

				if (this.loadComplete) {
					this.claimEditLock();
				}
			},
			handlePageHide() {
				this.stopLockHeartbeat();
				this.releaseEditLock();
			},
			async claimEditLock() {
				const tk = this.getAuthToken();
				if (!tk || !this.chapterId || !this.editSessionId) return false;

				try {
					const response = await axios.post(
						this.$baseUrl + "/essays/claim_article_edit_lock",
						{
							article_id: this.chapterId,
							session_id: this.editSessionId,
						},
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + tk,
							},
						}
					);
					this.currentEditLock = response.data.lock || null;
					this.startLockHeartbeat();
					return true;
				} catch (error) {
					if (error.response && error.response.status === 409) {
						this.currentEditLock = error.response.data.lock || null;
						this.handleLockConflict(error.response.data.lock);
						return false;
					}
					return false;
				}
			},
			startLockHeartbeat() {
				this.stopLockHeartbeat();
				this.lockHeartbeatTimer = setInterval(() => {
					this.heartbeatEditLock();
				}, EDIT_LOCK_HEARTBEAT_MS);
			},
			stopLockHeartbeat() {
				if (this.lockHeartbeatTimer) {
					clearInterval(this.lockHeartbeatTimer);
					this.lockHeartbeatTimer = null;
				}
			},
			async heartbeatEditLock() {
				const tk = this.getAuthToken();
				if (!tk || !this.chapterId || !this.editSessionId) return;

				try {
					const response = await axios.post(
						this.$baseUrl + "/essays/heartbeat_article_edit_lock",
						{
							article_id: this.chapterId,
							session_id: this.editSessionId,
						},
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + tk,
							},
						}
					);
					this.currentEditLock = response.data.lock || null;
				} catch (error) {
					this.stopLockHeartbeat();
					if (error.response && error.response.status === 409) {
						this.currentEditLock = error.response.data.lock || null;
						this.handleLockConflict(error.response.data.lock);
					}
				}
			},
			async releaseEditLock() {
				const tk = this.getAuthToken();
				if (!tk || !this.chapterId || !this.editSessionId) return;

				try {
					await axios.post(
						this.$baseUrl + "/essays/release_article_edit_lock",
						{
							article_id: this.chapterId,
							session_id: this.editSessionId,
						},
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + tk,
							},
						}
					);
				} catch (error) {}
			},
			handleLockConflict(lockInfo) {
				const lockName = lockInfo && lockInfo.name ? lockInfo.name : "其他作者";
				uni.showModal({
					title: "词条已被占用",
					content: `${lockName} 正在编辑这个词条，请稍后再试。`,
					showCancel: false,
					success: () => {
						uni.navigateBack({});
					},
				});
			},
			getArticle() {
				return axios.get(this.$baseUrl + '/essays/get_article?id=' + this.chapterId, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + this.getAuthToken()
					}
				});
			},
			getArticleWriter() {
				return axios.get(this.$baseUrl + '/essays/get_article_writer?id=' + this.chapterId, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + this.getAuthToken()
					}
				});
			},
			buildArticle(raw) {
				const article = raw || {};
				if (article.current_access) {
					this.editorAccess = article.current_access;
				}
				return {
					...this.article,
					...article,
					article_id: Number(article.article_id || this.chapterId),
					title: article.title || "",
					content: article.content || JSON.stringify(createEmptyVocabularyContent()),
					novel_info: article.novel_info || {},
					is_draft: article.is_draft == null ? 1 : article.is_draft,
				};
			},
			isVocabularyContentEmpty() {
				const parsedContent = parseVocabularyContent(this.article.content);
				const hasDesc = parsedContent.desc.trim() !== '';
				const hasPic = typeof parsedContent.pic === 'string' && parsedContent.pic.trim() !== '';
				const hasAttr = parsedContent.attributes.some((item) => {
					return String(item.name || '').trim() !== '' || String(item.content || '').trim() !== '';
				});
				const hasRelation = parsedContent.relations.some((item) => {
					return String(item.name || '').trim() !== '' || String(item.relation || '').trim() !== '';
				});
				return !hasDesc && !hasPic && !hasAttr && !hasRelation;
			},
			syncCodeEditorContent(content = this.article.content) {
				if (!this.editorCtx || this.isSyncingEditorContent) return;

				this.isSyncingEditorContent = true;
				try {
					this.editorCtx.setContents({
						delta: {
							ops: [{
								insert: content || ""
							}]
						}
					});
				} catch (error) {}

				setTimeout(() => {
					this.isSyncingEditorContent = false;
				}, 0);
			},
			syncStructuredContentFromCodeMode() {
				if (!this.writerSettings.codeMode) {
					return true;
				}

				try {
					const parsedContent = parseVocabularyContentStrict(this.article.content);
					this.suppressContentWatcher = true;
					this.content = parsedContent;
					this.article.content = JSON.stringify(parsedContent);
					this.$nextTick(() => {
						this.suppressContentWatcher = false;
					});
					return true;
				} catch (error) {
					uni.showToast({
						title: '源码模式内容不是合法 JSON',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
			},
			async initializeArticle() {
				uni.showLoading({
					title: '编辑器初始化'
				});

				try {
					let articleData = null;
					const writerRes = await this.getArticleWriter();
					if (writerRes.data && writerRes.data !== 'no data') {
						articleData = writerRes.data;
					}

					if (!articleData) {
						const articleRes = await this.getArticle();
						articleData = Array.isArray(articleRes.data) ? articleRes.data[0] : articleRes.data;
					}

					this.article = this.buildArticle(articleData);
					this.cloudTime = this.article.update_time;

					if (this.editorAccess && this.editorAccess.can_edit_draft === false) {
						uni.hideLoading();
						uni.showToast({
							title: '你没有编辑词条权限',
							icon: 'none',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack({});
						}, 800);
						return;
					}

					this.suppressContentWatcher = true;
					this.content = parseVocabularyContent(this.article.content);
					this.$nextTick(() => {
						this.suppressContentWatcher = false;
						this.syncCodeEditorContent(this.article.content);
					});

					this.loadVocabularies();
					this.startLocalSaveTimer();
					this.loadComplete = true;
					this.claimEditLock();
				} catch (error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				} finally {
					uni.hideLoading();
				}
			},
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
			onEditorReady() {
				uni.createSelectorQuery().select('.textarea').context((res) => {
					this.editorCtx = res && res.context ? res.context : undefined;
					this.syncCodeEditorContent(this.article.content);
				}).exec();
			},
			save(drafting, msg) {
				if (!this.syncStructuredContentFromCodeMode()) {
					return;
				}

				if (this.article.title.replace(/(^\s*)|(\s*$)/g, "") == "" || this.isVocabularyContentEmpty()) {
					uni.showToast({
						title: "标题或文章内容不能为空",
						icon: 'none',
						duration: 2000
					});
					return;
				}

				if (!this.canPublishArticle && Number(drafting) === 0) {
					drafting = 1;
					msg = "协作草稿已保存";
				}

				let tk = this.getAuthToken();
				let _this = this;
				this.buttonLock = false;
				axios.post(this.$baseUrl + '/essays/modify_article', {
						title: this.article.title,
						content: this.article.content,
						is_draft: drafting,
						article_id: this.chapterId
					}, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}, )
					.then(function(response) {
						_this.article.is_draft = drafting;
						_this.article_changed = false;
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
					.catch(function(error) {
						if (error) {
							uni.showToast({
								title: "词条上传失败，请重试",
								icon: 'none',
								duration: 2000
							});
						}
					})
			},
			onInput(e) {
				if (this.isSyncingEditorContent) {
					return;
				}
				this.markWritingActivity();
				this.article.content = e.detail.text;
				this.article_changed = true;
			},
			saveToBackUp(title, content) {
				let version = this.$DBVersion
				let _this = this;
				let IDBOpenDBRequest = indexedDB.open('LogCommunity', version);

				var db;

				IDBOpenDBRequest.onsuccess = function(e) {

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

					IDBOpenDBRequest.onsuccess = function(e) {
						db = e.target.result

						// 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
						var transaction = db.transaction('localArticles', 'readwrite');

						// 通过事务来获取IDBObjectStore
						var store = transaction.objectStore('localArticles');

						var request = store.openCursor(IDBKeyRange.only(chapterId.toString()));

						request.onsuccess = function(e) {
							uni.hideLoading();
							var cursor = e.target.result;
							// 如果找到数据了
							if (cursor) {
								var result = cursor.value;
								// console.log("localArticles",result)
								if (_this.article.content != undefined) {
									let cloudTime = _this.cloudTime;
									let remoteTime = cloudTime ? _this.utc2timestamp(cloudTime) : 0;
									//如果本地存档新于云端存档
									if (remoteTime < result.time) {
										// console.log(_this.utc2timestamp(cloudTime),result.time);
										if (_this.firstLocalCheck) {
											if (result.article_content != _this.article.content) {
												_this.endLocalSaveTimer();
												uni.showModal({
													title: '提示',
													content: '你有未保存的存稿，是否到上次退出时状态？',
													success: function(res) {
														if (res.confirm) {
															_this.article.title = result.article_title;
															_this.article.content = result
																.article_content;
															_this.article_changed = true;
														}
														_this.suppressContentWatcher = true;
														_this.content = parseVocabularyContent(_this.article.content);
														_this.$nextTick(() => {
															_this.suppressContentWatcher = false;
															_this.syncCodeEditorContent(_this.article.content);
														});
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
											}).onsuccess = function(event) {
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
										}).onsuccess = function(event) {
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
									}).onsuccess = function(event) {
										console.log('数据写入成功');
									};
								}


							}
						}
					};
				}
			},
			startLocalSaveTimer() {
				this.endLocalSaveTimer();
				this.saveInterval = setInterval(() => {
					this.saveLocalArticle();
				}, 1000)
			},
			endLocalSaveTimer() {
				clearInterval(this.saveInterval);
			},
			changeTheme(themeName) {
				this.writerSettings.theme = themeName;
				this.persistWriterSettings();
				this.applyNavigationBarTheme();
			},
			applyNavigationBarTheme() {
				let pageHead = document.getElementsByClassName('uni-page-head')[0];
				if (!pageHead) return;
				let pageHeadBtn = document.querySelectorAll('.uni-page-head .uni-btn-icon');
				pageHeadBtn.forEach(element => {
					element.style.color = this.currentTheme.color;
				})
				pageHead.style.backgroundColor = this.currentTheme.backColor;
				if (window.jsBridge && window.jsBridge.inApp) {
					jsBridge.setSystemUIStyle(this.currentTheme.backColor, this.currentTheme.color);
				}
			},
			changeViewMode(newValue) {
				if (newValue) {
					this.$confirm('您正在尝试启用源代码模式，这些设置仅供高级用户使用，修改不当可能造成词条内容丢失，您需要自行承担修改源代码造成的任何后果。', '警告', {
						confirmButtonText: '启用源代码模式',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.writerSettings.codeMode = true;
						this.persistWriterSettings();
						this.$nextTick(() => {
							this.syncCodeEditorContent(this.article.content);
						});
					}).catch(() => {
						this.writerSettings.codeMode = false;
						this.persistWriterSettings();
					})
				} else {
					if (!this.syncStructuredContentFromCodeMode()) {
						this.writerSettings.codeMode = true;
						this.persistWriterSettings();
						return;
					}
					this.writerSettings.codeMode = false;
					this.persistWriterSettings();
				}
			},
			onContentChange(content) {
				if (this.suppressContentWatcher) {
					return;
				}
				this.markWritingActivity();
				this.article.content = JSON.stringify(parseVocabularyContent(JSON.stringify(content)));
				this.article_changed = true;
				this.syncCodeEditorContent(this.article.content);
			},
			confirmVocabAttr() {
				if (this.content.attributes == undefined) {
					this.content.attributes = [];
				}
				let maxId = -1;
				for (let item of this.content.attributes) {
					maxId = Math.max(maxId, item.id);
				}
				if (this.vocabAttr.id == -1) {
					this.content.attributes.push({
						id: maxId + 1,
						name: this.vocabAttr.name,
						content: this.vocabAttr.content
					})
				} else {
					for (let item of this.content.attributes) {
						if (item.id == this.vocabAttr.id) {
							item.name = this.vocabAttr.name;
							item.content = this.vocabAttr.content;
						}
					}
				}
				this.vocabAttr = {
					id: 0,
					name: "",
					content: ""
				}
				this.vocabAttrVisible = false;
				this.onContentChange(this.content);
			},
			deleteAttr(index) {
				console.log(index);
				this.content.attributes.splice(index, 1);
				this.$forceUpdate();
				this.onContentChange(this.content);
			},
			editAttr(index) {
				this.vocabAttr.name = this.content.attributes[index].name;
				this.vocabAttr.content = this.content.attributes[index].content;
				this.vocabAttr.id = this.content.attributes[index].id;
				this.vocabAttrVisible = true;
			},
			handleAvatarSuccess(res, file) {
				setTimeout(()=>{
					this.content.pic = res.url;
					this.$forceUpdate()
					this.onContentChange(this.content);
				}, 5000);
			},
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				uni.showToast({
					title:"上传中..."
				})
				return isLt2M;
			},
			async loadVocabularies() {
				const novelId = Number(this.article.novel_id || (this.article.novel_info && this.article.novel_info.novel_id) || 0);
				if (!novelId) return;
				let tk = this.getAuthToken();
				try {
					let res = await axios.get(this.$baseUrl + '/essays/get_articles?id=' + novelId, {
						headers: {
							'Authorization': 'Bearer ' + tk
						}
					});
					this.vocabularies = res.data.filter(item => item.article_id != this.chapterId && item.article_type == 'worldVocabulary');
					this.checkReverseRelations();
				} catch (e) {
					console.error(e);
				}
			},
			async checkReverseRelations() {
				this.suggestions = [];
				const batchSize = 10;
				let tk = this.getAuthToken();

				for (let i = 0; i < this.vocabularies.length; i += batchSize) {
					const batch = this.vocabularies.slice(i, i + batchSize);
					await Promise.all(batch.map(async (vocab) => {
						try {
							let res = await axios.get(this.$baseUrl + '/essays/get_article?id=' + vocab
								.article_id, {
									headers: {
										'Authorization': 'Bearer ' + tk
									}
								});
							if (res.data && res.data[0]) {
								let art = res.data[0];
								let content = parseVocabularyContent(art.content);
								if (content.relations) {
									for (let rel of content.relations) {
										if (rel.id == this.chapterId) {
											let myRelations = this.content.relations || [];
											let hasBack = myRelations.some(r => r.id == vocab.article_id);
											if (!hasBack) {
												this.suggestions.push({
													id: vocab.article_id,
													name: vocab.title,
													theirRelation: rel.relation
												});
											}
										}
									}
								}
							}
						} catch (e) {
							console.error(e);
						}
					}));
				}
			},
			confirmVocabRela() {
				if (this.content.relations == undefined) {
					this.content.relations = [];
				}
				
				// Find target title if not set (should be set by UI, but double check)
				if(!this.vocabRela.targetTitle) {
					let target = this.vocabularies.find(v => v.article_id == this.vocabRela.targetId);
					if(target) this.vocabRela.targetTitle = target.title;
				}

				if (this.vocabRela.id == -1) {
					this.content.relations.push({
						id: this.vocabRela.targetId,
						name: this.vocabRela.targetTitle,
						relation: this.vocabRela.relation
					})
				} else {
					// Editing existing relation (by index)
					// Actually id in vocabRela logic for attrs was ID, but here relations don't have unique ID other than targetId.
					// Let's use index or targetId. 
					// The existing UI logic used 'id' as a unique identifier for attributes. 
					// Relations: targetId is unique? A vocabulary can have multiple relations to same target? 
					// "Father", "Teacher". Usually yes.
					// Let's assume targetId is unique for simplicity, or just use index.
					// If using index, vocabRela.id should be the index.
					
					// However, looking at `confirmVocabAttr`, it uses `id` property on attribute object.
					// For relations, I'll stick to array operations.
					
					// Let's assume vocabRela.id is the INDEX in content.relations when editing.
					// Wait, in confirmVocabAttr:
					// let maxId = -1; for(item of attributes) maxId = Math.max...
					// It assigns a new ID.
					// For relations, maybe I don't need an ID. Just use targetId? 
					// But if I want to edit, I need to know which one.
					
					// Let's just use index.
					if(this.vocabRela.id >= 0 && this.vocabRela.id < this.content.relations.length) {
						this.content.relations[this.vocabRela.id] = {
							id: this.vocabRela.targetId,
							name: this.vocabRela.targetTitle,
							relation: this.vocabRela.relation
						};
					}
				}
				this.vocabRela = {
					id: -1,
					targetId: "",
					targetTitle: "",
					relation: ""
				}
				this.vocabRelaVisible = false;
				this.onContentChange(this.content);
				this.$forceUpdate();
				
				// Re-check suggestions as we might have added the missing one
				this.checkReverseRelations();
			},
			deleteRela(index) {
				this.content.relations.splice(index, 1);
				this.$forceUpdate();
				this.onContentChange(this.content);
				this.checkReverseRelations();
			},
			editRela(index) {
				let rel = this.content.relations[index];
				this.vocabRela.targetId = rel.id;
				this.vocabRela.targetTitle = rel.name;
				this.vocabRela.relation = rel.relation;
				this.vocabRela.id = index;
				this.vocabRelaVisible = true;
			},
			acceptSuggestion(suggestion) {
				this.vocabRela.targetId = suggestion.id;
				this.vocabRela.targetTitle = suggestion.name;
				this.vocabRela.relation = ""; // User needs to fill this
				this.vocabRela.id = -1;
				this.vocabRelaVisible = true;
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.text == "\ue70f ") {
				this.$refs.setPopup.open('bottom');
			} else if (e.text == "完成 ") {
				if (!this.canPublishArticle) {
					this.save(1, "协作草稿已保存");
					return;
				}

				let _this = this;
				uni.showActionSheet({
					itemList: ['发布词条', "保存为草稿"],
					success: function(res) {
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
									success: function(res) {
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
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			}

		},
		onLoad(params) {
			this.chapterId = Number(params.id);
			this.resolveCurrentUserId();
			this.editSessionId = this.generateEditSessionId();
			this.initializeWriterSettings();
			document.removeEventListener("visibilitychange", this.handleVisibilityChange);
			document.addEventListener("visibilitychange", this.handleVisibilityChange);
			window.removeEventListener("pagehide", this.handlePageHide);
			window.addEventListener("pagehide", this.handlePageHide);

			setTimeout(() => {
				this.applyNavigationBarTheme();
			})
			this.initializeArticle();
		},
		async beforeDestroy() {
			await this.stopWritingExpTimer();
			this.stopLockHeartbeat();
			await this.releaseEditLock();
			this.endLocalSaveTimer();
			document.removeEventListener("visibilitychange", this.handleVisibilityChange);
			window.removeEventListener("pagehide", this.handlePageHide);
		},
		onShow() {
			this.startWritingExpTimer();
			if (this.loadComplete) {
				this.startLocalSaveTimer();
				this.claimEditLock();
			}
		},
		async onHide() {
			await this.stopWritingExpTimer();
			this.stopLockHeartbeat();
			this.endLocalSaveTimer();
			this.saveLocalArticle();
			await this.releaseEditLock();
		},
		async onUnload() {
			await this.stopWritingExpTimer();
			this.stopLockHeartbeat();
			this.endLocalSaveTimer();
			this.saveLocalArticle();
			await this.releaseEditLock();
		},
		watch: {
			content: {
				handler(newVal, oldVal) { //对象式监听，立即监听，深度监听
					this.onContentChange(newVal);
				},
				deep: true, //深度监听
			}
		}
	}
