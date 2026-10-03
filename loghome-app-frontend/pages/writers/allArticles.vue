<template>
	<view class="content" v-dark :style="{ '--statusBarHeight': 0 + 'px' }">
		<div class="articles">
			<div class="searchPanel">
				<el-input
					v-model="searchQuery"
					clearable
					prefix-icon="el-icon-search"
					maxlength="60"
					:placeholder="'在 '+searchScopeText+' 中搜索...'"
					@input="handleSearchInput"
					@clear="clearSearch"
				></el-input>
				<div class="searchMeta">
					<!-- <span>{{ searchScopeText }}</span> -->
					<span v-if="hasActiveSearch && !searchLoading && !searchError">{{ searchSummaryText }}</span>
				</div>
			</div>
			<div class="articlesSkeleton" v-if="isLoading" aria-label="章节加载中">
				<div class="articleSkeleton" v-for="index in 7" :key="index">
					<div class="skeletonBlock skeletonTitle" :class="`skeletonWidth${index % 3}`"></div>
					<div class="skeletonBlock skeletonMeta"></div>
				</div>
			</div>
			<div v-else-if="hasActiveSearch" class="searchResults">
				<div class="searchStateCard" v-if="searchLoading">
					<i class="el-icon-loading"></i>
					<span>{{ searchStatusText }}</span>
				</div>
				<div class="searchStateCard error" v-else-if="searchError">
					<i class="el-icon-warning-outline"></i>
					<span>{{ searchError }}</span>
				</div>
				<div class="searchStateCard empty" v-else-if="searchResults.length === 0">
					<i class="el-icon-document"></i>
					<span>没有找到相关章节，试试更短的关键词或切换分卷范围。</span>
				</div>
				<div v-else class="searchResultList">
					<div
						class="searchResultCard"
						v-for="item in searchResults"
						:key="item.resultKey"
						@click="openSearchResult(item)"
					>
						<div class="searchResultHeader">
							<div class="searchResultTitle" v-html="item.highlightedTitle"></div>
							<div class="searchResultTags">
								<el-tag size="mini" effect="dark" :type="item.versionTagType" disable-transitions>{{ item.versionLabel }}</el-tag>
								<el-tag size="mini" effect="plain" v-if="item.typeLabel" disable-transitions>{{ item.typeLabel }}</el-tag>
							</div>
						</div>
						<div class="searchResultMeta">
							{{ item.chapterLabel }}
							<span v-if="item.matchLabel"> · {{ item.matchLabel }}</span>
						</div>
						<div class="searchResultParagraph" v-html="item.highlightedPreview"></div>
					</div>
				</div>
			</div>
			<template v-else>
				<uni-collapse accordion @touchstart.native="touchstart" @touchend.native="touchend"
					@touchmove.native="touchmove">
					<uni-collapse-item class="titleOuter" v-for="item in shownArticles" :key="item.article_id"
					:mainClick="gotoEditor" :clickInfo="item"
					:class="{
						'splitterRow': item.article_type == 'spliter',
						'selectedRow': frameInfo.isEnabled && frameInfo.currentSelected == item.article_id
					}">
						<template v-slot:title>
							<div class="title">
								{{ item.title }}
								<el-tag type="success" v-show="item.article_type == 'worldOutline'" effect="dark" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">大纲</el-tag>
								<el-tag type="success" v-show="item.article_type == 'worldVocabulary'" effect="dark" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">词条</el-tag>
								<el-tag type="info" v-show="item.article_type == 'spliter'" effect="dark" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">分卷</el-tag>
								<el-tag type="danger" v-show="item.is_draft == true" effect="dark" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">草稿</el-tag>
								<el-tag
									type="success"
									v-if="item.collaboration_mode === 'realtime_crdt'"
									effect="dark"
									disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)"
									size="mini"
								>实时协作</el-tag>
								<div
									v-if="item.collaboration_mode === 'realtime_crdt' && item.realtime_collaborators && item.realtime_collaborators.length"
									class="realtimeCollaborators"
									:aria-label="`${item.realtime_collaborators.length} 位作者正在编辑`"
									@click.stop="gotoEditor(item)"
								>
									<span
										v-for="(participant, participantIndex) in getRealtimeCollaboratorStack(item)"
										:key="participant.user_id"
										class="realtimeCollaboratorAvatarWrap"
										:style="{ borderColor: participant.color, zIndex: 20 - participantIndex }"
										:title="participant.name + ' 正在编辑'"
									>
										<img
											class="realtimeCollaboratorAvatar"
											:src="participant.avatar_url"
											onerror="this.onerror=null;this.src='/static/user/defaultAvatar.jpg'"
										/>
									</span>
									<span
										v-if="getRealtimeCollaboratorOverflow(item) > 0"
										class="realtimeCollaboratorAvatarWrap realtimeCollaboratorOverflow"
									>
										+{{ getRealtimeCollaboratorOverflow(item) }}
									</span>
								</div>
								<el-tag type="warning" v-if="item.feedback_count && item.feedback_count > 0" effect="dark" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)"
									size="mini">{{ item.feedback_count }}处反馈</el-tag>
								<el-tag type="danger" v-if="item.hasWriterModify == true && item.is_draft == false" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">发布后有编辑</el-tag>
								<el-tag type="warning" v-if="item.collaboration_mode !== 'realtime_crdt' && item.isSyncing == true" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini" effect="dark">Syncing</el-tag>
								<el-tag type="info" v-if="item.collaboration_mode !== 'realtime_crdt' && item.hasCloudCollision == true" disable-transitions
									style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini" effect="dark" >
									<i class="el-icon-warning-outline" style="margin-right: 5rpx;"></i>存在云冲突
								</el-tag>
								<el-tag
									type="warning"
									v-if="item.collaboration_mode !== 'realtime_crdt' && item.remoteEditSummary"
									style="margin-left:10rpx; transform:translateY(-5rpx)"
									size="mini"
									effect="dark"
									disable-transitions
								>
									{{ item.remoteEditSummary }}
								</el-tag>
								<div class="activeEditor" v-if="item.collaboration_mode !== 'realtime_crdt' && item.active_editor">
									<img
										class="activeEditorAvatar"
										:src="item.active_editor.avatar_url"
										onerror="this.onerror=null;this.src='/static/user/defaultAvatar.jpg'"
									/>
									<span>
										{{ Number(item.active_editor.user_id) === Number(currentUserId) ? '你正在编辑' : item.active_editor.name + ' 正在编辑' }}
									</span>
								</div>
								<i class="el-icon-loading articleStatusLoading" v-if="item.isCheckingStatus"></i>

							</div>
							<div class="miniTitle">
								<div
									v-if="item.article_type != 'spliter' && item.hasWriterModify">
									{{ item.modifiedTextCount }}字
									{{ item.modify_time }}
								</div>
								<div v-else-if="item.article_type != 'spliter'">
									{{ item.text_count }}字
									{{ utc2beijing(item.update_time) }}
								</div>
							</div>
						</template>
						<view class="menuContent">
							<navigator @click="gotoEditor(item)">
								<div class="subTitle">
									<uni-icons type="compose" size="20" :color="actionIconColor" />
									<span>编辑{{ item.article_type == 'spliter' ? "分卷信息" : "" }}</span>
								</div>
							</navigator>
							<navigator :url="'../readers/article?id=' + item.article_id" open-type="navigate"
								v-show="item.is_draft == false && !frameInfo.isEnabled">
								<div class="subTitle">
									<uni-icons type="eye" size="20" :color="actionIconColor" />
									<span>阅读</span>
								</div>
							</navigator>
							<navigator :url="'./chapterTimeMachine?id=' + item.article_id + '&novelId=' + item.novel_id"
								open-type="navigate" v-show="item.article_type != 'spliter'">
								<div class="subTitle">
									<uni-icons type="loop" size="20" :color="actionIconColor" />
									<span>章节时光机</span>
								</div>
							</navigator>
							<navigator :url="'./articleFeedbacks?id=' + item.article_id" open-type="navigate"
								v-show="item.article_type != 'spliter' && item.feedback_count > 0">
								<div class="subTitle">
									<uni-icons type="help" size="20" :color="actionIconColor" />
									<span>错误反馈 ({{ item.feedback_count }})</span>
								</div>
							</navigator>
							<div
								v-if="isOwner && supportsRealtimeCollaboration(item)"
								class="subTitle collaborationModeAction"
								:class="{
									disabled: isCollaborationModeSwitching(item),
									realtime: item.collaboration_mode === 'realtime_crdt'
								}"
								@click.stop="confirmCollaborationModeSwitch(item)"
							>
								<i
									v-if="isCollaborationModeSwitching(item)"
									class="el-icon-loading"
								></i>
								<uni-icons
									v-else
									type="link"
									size="20"
									:color="actionIconColor"
								/>
								<span>{{ getCollaborationModeActionText(item) }}</span>
							</div>
							<div class="subTitle" @click="deleteArticle(item.article_id)" v-show="canDeleteArticle">
								<uni-icons type="trash" size="20" :color="actionIconColor" />
								<span>删除{{ item.article_type == 'spliter' ? "分卷" : "" }}</span>
							</div>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<div class="newArticle" v-show="novel.novel_type != 'world' && canAddArticle">
					<div class="tit">新增普通章节</div>
					<div class="share">
						<div class="add richArticle" @click="addArticle('richtext')">
							+ 章节
						</div>
					</div>
					<div class="monopolize" v-show="bookPart.currentPart.id == -1">
						<div class="add split" @click="addArticle('spliter')">
							+ 分卷
						</div>
					</div>
				</div>
				<div class="newArticle" v-show="novel.novel_type == 'world' && canAddArticle">
					<div class="tit">新增设定章节</div>
					<div class="share">
						<div class="add commonArticle" @click="addArticle('worldOutline')">
							+ 世界大纲
						</div>
						<div class="add richArticle" @click="addArticle('worldVocabulary')">
							+ 世界词条
						</div>
					</div>
					<div class="monopolize" v-show="bookPart.currentPart.id == -1">
						<div class="add split" @click="addArticle('spliter')">
							+ 分卷
						</div>
					</div>
				</div>
			</template>
		</div>
		<uni-popup
			ref="setPopup"
			type="top"
			style="z-index:101"
			:background-color="bookPartPopupBackground"
		>
			<div class="bookParts">
				<navigator v-for="(item, index) in bookPart.parts" :key="index" @click="changeBookPart(item, true)">
					<div class="part" :class="{ 'selected': item.id == bookPart.currentPart.id }">
						<div class="partTitle">{{ item.name }}</div>
					</div>
				</navigator>
			</div>
		</uni-popup>
		<uni-popup ref="splitterRenamePopup" type="dialog">
			<view class="splitterRenameDialog">
				<uni-popup-dialog
					mode="input"
					title="修改分卷名"
					placeholder="输入分卷名"
					:value="splitterRenameValue"
					cancel-text="取消"
					confirm-text="确定"
					:before-close="true"
					@confirm="confirmSplitterRename"
					@close="closeSplitterRename"
				></uni-popup-dialog>
			</view>
		</uni-popup>
		<uni-popup ref="exportPopup" type="bottom" :background-color="popupBackground">
			<view class="share-popup">
				<view class="share-title">导出作品</view>
				<view class="share-content">
					<view class="share-item" @click="exportSimple">
						<image src="/static/simple_pack.png" mode=""></image>
						<view class="share-text">仅打包</view>
					</view>
					<view class="share-item" @click="exportAdvanced">
						<image src="/static/e_book.png" mode=""></image>
						<view class="share-text">导出电子书 <text style="font-size: 20rpx; color: #ff0000; border: 1rpx solid #ff0000; border-radius: 4rpx; padding: 0 4rpx; margin-left: 8rpx;">限免</text></view>
					</view>
				</view>
				<view class="share-bottom">
					<view class="share-btn-cancel" @click="cancelExport">取消</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import axios from 'axios'
import uniCollapse from '../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue'
import uniCollapseItem from '../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue'
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
import darkModeMixin from '@/mixins/dark-mode.js'
import { writerArticleDB } from "../../lib/db.js"
import {
	computeWriterContentHash,
	readWriterSyncState,
} from "../../lib/writerSyncState.js"
import { areLegacyContentsEquivalent } from "../../lib/writerEditorLegacyAdapter.js"

const SYNC_RECHECK_DELAY_MS = 3000;
const SEARCH_DEBOUNCE_MS = 250;
const REALTIME_PRESENCE_POLL_MS = 10000;
const REALTIME_PRESENCE_BATCH_SIZE = 100;
const REALTIME_AVATAR_STACK_LIMIT = 4;
const RECOVERABLE_SYNC_STATE_STATUSES = ["pending", "invalidated"];

export default {
	components: {
		uniCollapse, uniCollapseItem, uniIcons
	},
	mixins: [darkModeMixin],
	data() {
		return {
			uid: 0,
			worldId: 0,
			currentUserId: 0,
			bookName: "",
			novel: {},
			novelAccess: {
				access_role: "owner",
				can_add_article: true,
				can_delete_article: true,
				can_sort_article: true,
				can_manage_structure: true,
				can_publish: true,
				can_edit_draft: true,
			},
			articles: [],
			shownArticles: [],
			bookPart: {
				currentPart: { id: -1, name: "全部分卷" },
				parts: [],
				btnOpened: false
			},
			titleBtn: undefined,
			startTouchX: 0,
			startTouchY: 0,
			touchNotMoved: true,
			frameInfo: {
				isEnabled: false,
				currentSelected: -1
			},
			statusRecheckTimers: {},
			articleHistoryMetaCache: {},
			searchQuery: "",
			searchResults: [],
			searchLoading: false,
			searchError: "",
			searchStatusText: "正在搜索内容...",
			searchSnapshotMap: {},
			searchLocalLatestMap: {},
			searchDocumentMap: {},
			searchPreparedNovelId: 0,
			searchMaterialsPromise: null,
			searchRequestId: 0,
			isLoading: true,
			searchDebounceTimer: null,
			collaborationModeSwitchingArticleId: null,
			realtimePresenceTimer: null,
			realtimePresenceRequestId: 0,
			splitterRenameTargetId: null,
			splitterRenameValue: ""
		}
	},
	computed: {
		actionIconColor() {
			return this.isDarkMode ? '#e7b37d' : 'rgb(113, 52, 24)';
		},
		bookPartPopupBackground() {
			return this.isDarkMode ? '#1e1e1e' : '#fff2d9';
		},
		popupBackground() {
			return this.isDarkMode ? '#252525' : '#ffffff';
		},
		canAddArticle() {
			return this.novelAccess && this.novelAccess.can_add_article === true;
		},
		canDeleteArticle() {
			return this.novelAccess && this.novelAccess.can_delete_article === true;
		},
		canSortArticle() {
			return this.novelAccess && this.novelAccess.can_sort_article === true;
		},
		canEditDraft() {
			return this.novelAccess && this.novelAccess.can_edit_draft === true;
		},
		canPublishArticle() {
			return this.novelAccess && this.novelAccess.can_publish === true;
		},
		canManageStructure() {
			return this.novelAccess && this.novelAccess.can_manage_structure === true;
		},
		isOwner() {
			return this.novelAccess && this.novelAccess.access_role === "owner";
		},
		normalizedSearchQuery() {
			return String(this.searchQuery || "").trim();
		},
		hasActiveSearch() {
			return this.normalizedSearchQuery.length > 0;
		},
		searchScopeText() {
			if (this.bookPart.currentPart && this.bookPart.currentPart.id !== -1) {
				return `${this.bookPart.currentPart.name}`;
			}
			return "全部章节";
		},
		searchSummaryText() {
			return `找到 ${this.searchResults.length} 条结果`;
		},
	},
	onLoad(option) {
		if (JSON.stringify(option) == "{}") {
			this.isLoading = false;
			uni.showToast({
				title: "undefined",
				icon: 'none',
				duration: 2000
			});
			return;
		}
		this.uid = option.id;
		this.worldId = option.worldId;
		this.refreshPage(true);
	},
	onShow() {
		this.refreshPage();
		this.startRealtimePresencePolling();
		setTimeout(() => {
			this.titleBtn = document.getElementsByClassName("uni-page-head__title")[0];
			this.titleBtn.addEventListener("click", this.toggleTitleBtn);
			this.titleBtn.style.fontSize = "17px";
		}, 200)
		
		// 检测是否运行在iframe中并与父框架通信
		this.checkFrameEnvironment();
	},
	onHide() {
		this.stopRealtimePresencePolling();
	},
	beforeDestroy() {
		this.stopRealtimePresencePolling();
		if (this.titleBtn) {
			this.titleBtn.removeEventListener("click", this.toggleTitleBtn);
		}
		// 清理postMessage事件监听器
		window.removeEventListener('message', this.handleParentMessage);
		Object.values(this.statusRecheckTimers).forEach((timerId) => {
			clearTimeout(timerId);
		});
		if (this.searchDebounceTimer) {
			clearTimeout(this.searchDebounceTimer);
		}
		this.statusRecheckTimers = {};
		this.articleHistoryMetaCache = {};
	},
	methods: {
		getTokenInfo() {
			let token = JSON.parse(window.localStorage.getItem("token"));
			return token || null;
		},
		getAuthToken() {
			const token = this.getTokenInfo();
			return token ? token.tk : null;
		},
		getCollaborationHttpBaseUrl() {
			const override = window.localStorage.getItem("loghomeCollaborationHttpUrl");
			return String(override || this.$readerAiBaseUrl || "").replace(/\/+$/, "");
		},
		getRealtimeCollaboratorStack(article) {
			return Array.isArray(article && article.realtime_collaborators)
				? article.realtime_collaborators.slice(0, REALTIME_AVATAR_STACK_LIMIT)
				: [];
		},
		getRealtimeCollaboratorOverflow(article) {
			const count = Array.isArray(article && article.realtime_collaborators)
				? article.realtime_collaborators.length
				: 0;
			return Math.max(0, count - REALTIME_AVATAR_STACK_LIMIT);
		},
		async refreshRealtimePresence() {
			const articleIds = (Array.isArray(this.articles) ? this.articles : [])
				.filter((article) => article.collaboration_mode === "realtime_crdt")
				.map((article) => Number(article.article_id || 0))
				.filter((articleId) => articleId > 0);
			const requestId = ++this.realtimePresenceRequestId;
			if (articleIds.length === 0) return;

			const batches = [];
			for (let index = 0; index < articleIds.length; index += REALTIME_PRESENCE_BATCH_SIZE) {
				batches.push(articleIds.slice(index, index + REALTIME_PRESENCE_BATCH_SIZE));
			}

			try {
				const responses = await Promise.all(batches.map((batch) => axios.post(
					`${this.getCollaborationHttpBaseUrl()}/collaboration/presence`,
					{ article_ids: batch },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + this.getAuthToken(),
						},
					}
				)));
				if (requestId !== this.realtimePresenceRequestId) return;

				const presenceByArticleId = {};
				responses.forEach((response) => {
					Object.assign(
						presenceByArticleId,
						response.data && response.data.data ? response.data.data : {}
					);
				});
				this.articles.forEach((article) => {
					if (article.collaboration_mode !== "realtime_crdt") return;
					const participants = presenceByArticleId[Number(article.article_id)] || [];
					this.$set(article, "realtime_collaborators", participants);
				});
			} catch (error) {
				// 在线状态只是辅助信息；临时失败时保留上一次成功结果。
			}
		},
		startRealtimePresencePolling() {
			this.stopRealtimePresencePolling();
			this.refreshRealtimePresence();
			this.realtimePresenceTimer = setInterval(
				() => this.refreshRealtimePresence(),
				REALTIME_PRESENCE_POLL_MS
			);
		},
		stopRealtimePresencePolling() {
			if (this.realtimePresenceTimer) {
				clearInterval(this.realtimePresenceTimer);
				this.realtimePresenceTimer = null;
			}
			this.realtimePresenceRequestId += 1;
		},
		supportsRealtimeCollaboration(article) {
			return ["text", "richtext"].includes(
				String((article && article.article_type) || "richtext")
			);
		},
		isCollaborationModeSwitching(article) {
			return Number(this.collaborationModeSwitchingArticleId || 0) ===
				Number(article && article.article_id || 0);
		},
		getCollaborationModeActionText(article) {
			if (this.isCollaborationModeSwitching(article)) {
				return "正在切换协作模式...";
			}
			return article && article.collaboration_mode === "realtime_crdt"
				? "关闭实时协作"
				: "开启实时协作（公测）";
		},
		getCollaborationModeErrorMessage(error) {
			const data = error && error.response && error.response.data
				? error.response.data
				: {};
			const messages = {
				legacy_editor_active: "该章节仍有旧编辑器会话，请让编辑者退出后再开启。",
				collaboration_disabled: "实时协作服务尚未启动，请先检查长连接服务。",
				unsupported_article_type: "该章节类型暂不支持实时协作。",
			};
			return messages[data.code] || data.msg || "协作模式切换失败，请稍后重试。";
		},
		confirmCollaborationModeSwitch(article) {
			if (!this.isOwner || !this.supportsRealtimeCollaboration(article)) {
				this.showPermissionDenied("只有文章所有者可以切换实时协作模式");
				return;
			}
			if (this.collaborationModeSwitchingArticleId) return;

			const enabling = article.collaboration_mode !== "realtime_crdt";
			uni.showModal({
				title: enabling ? "开启实时协作" : "关闭实时协作",
				content: enabling
					? "开启后，多位作者可以同时编辑本章；旧版整篇上传接口将停止写入。请先确认没有人仍在旧编辑器中编辑。该功能尚处于公测阶段，如出现问题请反馈。"
					: "关闭前会自动创建协作检查点并断开在线协作连接，之后恢复为单人编辑锁。确定继续吗？",
				confirmText: enabling ? "开启" : "关闭",
				confirmColor: enabling ? "#409eff" : "#e6a23c",
				success: (result) => {
					if (result.confirm) this.switchArticleCollaborationMode(article, enabling);
				},
			});
		},
		async switchArticleCollaborationMode(article, enabling) {
			const articleId = Number(article && article.article_id || 0);
			if (!articleId) return;
			this.collaborationModeSwitchingArticleId = articleId;
			try {
				const response = await axios.post(
					`${this.getCollaborationHttpBaseUrl()}/collaboration/articles/${articleId}/mode`,
					{ mode: enabling ? "realtime_crdt" : "legacy_lock" },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + this.getAuthToken(),
						},
					}
				);
				const nextMode = response.data && response.data.data
					? response.data.data.mode
					: enabling ? "realtime_crdt" : "legacy_lock";
				this.$set(article, "collaboration_mode", nextMode);
				this.$set(article, "active_editor", null);
				uni.showToast({
					title: enabling ? "已开启实时协作" : "已恢复单人编辑锁",
					icon: "none",
					duration: 2000,
				});
				await this.refreshPage();
			} catch (error) {
				uni.showToast({
					title: this.getCollaborationModeErrorMessage(error),
					icon: "none",
					duration: 3000,
				});
			} finally {
				this.collaborationModeSwitchingArticleId = null;
			}
		},
		resolveCurrentUserId() {
			const token = this.getTokenInfo();
			this.currentUserId = token && token.id ? Number(token.id) : 0;
			return this.currentUserId;
		},
		async loadCollaborationInfo() {
			const tk = this.getAuthToken();
			const response = await axios.get(
				this.$baseUrl + "/essays/get_novel_collaboration_info?novel_id=" + this.uid,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + tk,
					},
				}
			);
			this.novelAccess = response.data.access || this.novelAccess;
			return response.data;
		},
		showPermissionDenied(title = "暂无此操作权限") {
			uni.showToast({
				title,
				icon: "none",
				duration: 2000,
			});
		},
		resolveInsertChapter() {
			if (this.bookPart.currentPart.id == -1) {
				return this.articles.length + 1;
			}

			let index = 0;
			for (index = 0; index < this.articles.length; index++) {
				let item = this.articles[index];
				if (item.article_id == this.bookPart.currentPart.id) {
					index++;
					break;
				}
			}
			for (; index < this.articles.length; index++) {
				let item = this.articles[index];
				if (item.article_type == "spliter") {
					break;
				}
			}
			return index + 1;
		},
		toggleTitleBtn() {
			if (!this.bookPart.btnOpened) {
				this.$refs.setPopup.open('top');
			} else {
				this.$refs.setPopup.close();
			}
			this.bookPart.btnOpened = !this.bookPart.btnOpened;
		},
		utc2beijing(utc_datetime) {
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
			var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString("chinese", { hour12: false }).replace(/年|月/g, "-").replace(/日/g, " ");
			return beijing_datetime; // 2017-03-31 16:02:06
		},
		resetSearchCache(preserveQuery = true) {
			if (this.searchDebounceTimer) {
				clearTimeout(this.searchDebounceTimer);
				this.searchDebounceTimer = null;
			}
			this.searchRequestId += 1;
			this.searchLoading = false;
			this.searchError = "";
			this.searchStatusText = "正在搜索内容...";
			this.searchResults = [];
			this.searchSnapshotMap = {};
			this.searchLocalLatestMap = {};
			this.searchDocumentMap = {};
			this.searchPreparedNovelId = 0;
			this.searchMaterialsPromise = null;
			if (!preserveQuery) {
				this.searchQuery = "";
			}
		},
		handleSearchInput() {
			this.scheduleSearch();
		},
		clearSearch() {
			this.searchQuery = "";
			this.scheduleSearch(true);
		},
		scheduleSearch(force = false) {
			if (this.searchDebounceTimer) {
				clearTimeout(this.searchDebounceTimer);
				this.searchDebounceTimer = null;
			}

			if (!this.hasActiveSearch) {
				this.searchRequestId += 1;
				this.searchLoading = false;
				this.searchError = "";
				this.searchStatusText = "正在搜索内容...";
				this.searchResults = [];
				return;
			}

			if (force) {
				this.runSearch();
				return;
			}

			this.searchDebounceTimer = setTimeout(() => {
				this.runSearch();
			}, SEARCH_DEBOUNCE_MS);
		},
		async runSearch() {
			const query = this.normalizedSearchQuery;
			if (!query) {
				this.searchResults = [];
				this.searchLoading = false;
				this.searchError = "";
				return;
			}

			const requestId = ++this.searchRequestId;
			this.searchLoading = true;
			this.searchError = "";
			this.searchStatusText = "正在搜索内容...";

			try {
				await this.ensureSearchMaterials();
				if (requestId !== this.searchRequestId) {
					return;
				}

				this.searchStatusText = "正在搜索内容...";
				const results = this.buildSearchResults(query);
				if (requestId !== this.searchRequestId) {
					return;
				}
				this.searchResults = results;
			} catch (error) {
				if (requestId !== this.searchRequestId) {
					return;
				}
				this.searchResults = [];
				this.searchError = "搜索内容加载失败，请稍后重试";
			} finally {
				if (requestId === this.searchRequestId) {
					this.searchLoading = false;
				}
			}
		},
		async ensureSearchMaterials() {
			if (Number(this.searchPreparedNovelId) === Number(this.uid) && Object.keys(this.searchDocumentMap).length > 0) {
				return;
			}
			if (this.searchMaterialsPromise) {
				return this.searchMaterialsPromise;
			}

			this.searchMaterialsPromise = (async () => {
				this.searchStatusText = "正在加载章节内容...";
				const tk = this.getAuthToken();
				const articleIdSet = new Set(
					(this.articles || []).map((item) => Number(item.article_id || 0)).filter(Boolean)
				);
				const [snapshotResponse, localRecords] = await Promise.all([
					axios.get(
						this.$baseUrl + "/essays/get_articles_search_snapshot?id=" + this.uid,
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + tk,
							},
						}
					),
					writerArticleDB.articles.where("user_id").equals(Number(this.currentUserId || 0)).toArray(),
				]);

				const snapshotList = Array.isArray(snapshotResponse.data) ? snapshotResponse.data : [];
				const snapshotMap = {};
				snapshotList.forEach((item) => {
					snapshotMap[Number(item.article_id)] = item;
				});

				const localLatestMap = {};
				(localRecords || []).forEach((record) => {
					const articleId = Number(record.article_id || 0);
					if (!articleIdSet.has(articleId)) {
						return;
					}
					const current = localLatestMap[articleId];
					if (!current || String(record.create_time || "") >= String(current.create_time || "")) {
						localLatestMap[articleId] = record;
					}
				});

				this.searchSnapshotMap = snapshotMap;
				this.searchLocalLatestMap = localLatestMap;
				this.buildSearchDocuments();
				this.searchPreparedNovelId = Number(this.uid);
			})().finally(() => {
				this.searchMaterialsPromise = null;
			});

			return this.searchMaterialsPromise;
		},
		buildSearchDocuments() {
			const documentMap = {};
			for (const article of this.articles || []) {
				const articleId = Number(article.article_id || 0);
				if (!articleId || article.article_type === "spliter") {
					continue;
				}
				const docs = this.buildDocumentsForArticle(article);
				if (docs.length > 0) {
					documentMap[articleId] = docs;
				}
			}
			this.searchDocumentMap = documentMap;
		},
		buildDocumentsForArticle(article) {
			const articleId = Number(article.article_id || 0);
			if (!articleId) {
				return [];
			}

			const snapshot = this.searchSnapshotMap[articleId] || null;
			const localLatest = this.searchLocalLatestMap[articleId] || null;
			const latestVersion = this.resolveLatestSearchVersion(article, snapshot, localLatest);
			const publishedVersion = this.resolvePublishedSearchVersion(article, snapshot);
			const latestDoc = latestVersion
				? this.createSearchDocument(article, latestVersion, "latest", "最新稿", 0)
				: null;
			const publishedDoc = publishedVersion
				? this.createSearchDocument(article, publishedVersion, "published", "已发布", 2)
				: null;

			if (latestDoc && publishedDoc && latestDoc.signature === publishedDoc.signature) {
				return [
					{
						...latestDoc,
						versionKey: "current",
						versionLabel: Number(article.is_draft) === 1 ? "最新稿" : "当前版本",
						versionPriority: 1,
					},
				];
			}

			const docs = [];
			if (latestDoc) {
				docs.push(latestDoc);
			}
			if (publishedDoc) {
				docs.push(publishedDoc);
			}
			return docs;
		},
		resolvePublishedSearchVersion(article, snapshot) {
			if (Number(article.is_draft) === 1 || !snapshot || !snapshot.published) {
				return null;
			}
			return {
				title: snapshot.published.title || "",
				content: snapshot.published.content || "",
				timestamp: snapshot.published.update_time || "",
			};
		},
		resolveLatestSearchVersion(article, snapshot, localLatest) {
			const published = snapshot && snapshot.published
				? {
					title: snapshot.published.title || "",
					content: snapshot.published.content || "",
					timestamp: snapshot.published.update_time || "",
				}
				: null;
			const remoteLatest = snapshot && snapshot.latest_writer
				? {
					title: snapshot.latest_writer.title || "",
					content: snapshot.latest_writer.content || "",
					timestamp:
						snapshot.latest_writer.updated_at ||
						snapshot.latest_writer.create_time ||
						"",
				}
				: null;
			const localVersion = localLatest
				? {
					title: localLatest.title || "",
					content: localLatest.content || "",
					timestamp: localLatest.create_time || "",
				}
				: null;

			if (localVersion && remoteLatest) {
				return this.normalizeCreateTime(localVersion.timestamp) >= this.normalizeCreateTime(remoteLatest.timestamp)
					? localVersion
					: remoteLatest;
			}

			return localVersion || remoteLatest || published;
		},
		createSearchDocument(article, version, versionKey, versionLabel, versionPriority) {
			const title = String(version && version.title ? version.title : "");
			const rawContent = String(version && version.content ? version.content : "");
			const paragraphs = this.extractSearchParagraphs(article.article_type, rawContent);
			if (!title && paragraphs.length === 0) {
				return null;
			}

			return {
				article,
				articleId: Number(article.article_id || 0),
				articleType: article.article_type,
				articleChapter: Number(article.article_chapter || 0),
				versionKey,
				versionLabel,
				versionPriority,
				title,
				paragraphs,
				searchTitle: this.normalizeSearchText(title),
				searchParagraphs: paragraphs.map((item) => this.normalizeSearchText(item)),
				searchBody: this.normalizeSearchText(paragraphs.join("\n")),
				signature: `${title}\n${rawContent}`,
			};
		},
		extractSearchParagraphs(articleType, content) {
			if (articleType === "worldVocabulary") {
				return this.extractVocabularyParagraphs(content);
			}
			return this.extractTextParagraphs(content);
		},
		extractVocabularyParagraphs(content) {
			if (!content) {
				return [];
			}

			try {
				const parsed = JSON.parse(content);
				if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
					return this.extractTextParagraphs(content);
				}

				const paragraphs = [];
				if (typeof parsed.desc === "string" && parsed.desc.trim()) {
					paragraphs.push(parsed.desc);
				}
				if (Array.isArray(parsed.attributes)) {
					parsed.attributes.forEach((item) => {
						const line = [item && item.name, item && item.content]
							.filter((value) => typeof value === "string" && value.trim())
							.join("：");
						if (line) {
							paragraphs.push(line);
						}
					});
				}
				if (Array.isArray(parsed.relations)) {
					parsed.relations.forEach((item) => {
						const line = [item && item.name, item && item.relation]
							.filter((value) => typeof value === "string" && value.trim())
							.join("：");
						if (line) {
							paragraphs.push(line);
						}
					});
				}
				return this.cleanParagraphs(paragraphs);
			} catch (error) {
				return this.extractTextParagraphs(content);
			}
		},
		extractTextParagraphs(content) {
			if (!content) {
				return [];
			}

			try {
				const parsed = JSON.parse(content);
				if (Array.isArray(parsed)) {
					const paragraphs = [];
					parsed.forEach((block) => {
						if (!block || block.type !== "text" || typeof block.value !== "string") {
							return;
						}
						this.splitTextLines(block.value).forEach((line) => paragraphs.push(line));
					});
					return this.cleanParagraphs(paragraphs);
				}
				if (parsed && typeof parsed === "object") {
					const collected = [];
					this.collectObjectText(parsed, collected);
					return this.cleanParagraphs(collected);
				}
			} catch (error) {}

			return this.cleanParagraphs(this.splitTextLines(content));
		},
		collectObjectText(source, bucket) {
			if (typeof source === "string") {
				this.splitTextLines(source).forEach((line) => bucket.push(line));
				return;
			}
			if (Array.isArray(source)) {
				source.forEach((item) => this.collectObjectText(item, bucket));
				return;
			}
			if (!source || typeof source !== "object") {
				return;
			}

			Object.keys(source).forEach((key) => {
				if (["pic", "img", "image", "cover", "src", "avatar_url"].includes(key)) {
					return;
				}
				this.collectObjectText(source[key], bucket);
			});
		},
		splitTextLines(text) {
			return String(text || "")
				.replace(/\r/g, "")
				.split("\n")
				.map((line) => line.replace(/\s+$/, ""))
				.filter((line) => line.trim().length > 0);
		},
		cleanParagraphs(paragraphs) {
			return (paragraphs || [])
				.map((line) => String(line || "").replace(/\s+$/, ""))
				.filter((line) => line.trim().length > 0);
		},
		normalizeSearchText(text) {
			return String(text || "").toLocaleLowerCase();
		},
		buildSearchKeywords(query) {
			const rawKeywords = String(query || "")
				.trim()
				.split(/\s+/)
				.filter(Boolean)
				.map((item) => item.toLocaleLowerCase());
			return Array.from(new Set(rawKeywords));
		},
		getScopedSearchArticles() {
			const source = Array.isArray(this.shownArticles) && this.shownArticles.length > 0
				? this.shownArticles
				: this.articles;
			const seen = new Set();
			return (source || []).filter((item) => {
				const articleId = Number(item.article_id || 0);
				if (!articleId || item.article_type === "spliter" || seen.has(articleId)) {
					return false;
				}
				seen.add(articleId);
				return true;
			});
		},
		buildSearchResults(query) {
			const keywords = this.buildSearchKeywords(query);
			if (keywords.length === 0) {
				return [];
			}

			const results = [];
			for (const article of this.getScopedSearchArticles()) {
				const docs = this.searchDocumentMap[Number(article.article_id || 0)] || [];
				docs.forEach((doc) => {
					const result = this.matchSearchDocument(doc, keywords);
					if (result) {
						results.push(result);
					}
				});
			}

			return results.sort((left, right) => {
				if (right.score !== left.score) {
					return right.score - left.score;
				}
				if (left.articleChapter !== right.articleChapter) {
					return left.articleChapter - right.articleChapter;
				}
				return left.versionPriority - right.versionPriority;
			});
		},
		matchSearchDocument(doc, keywords) {
			const titleHitCount = keywords.filter((keyword) => doc.searchTitle.includes(keyword)).length;
			const bodyMatched = keywords.every(
				(keyword) => doc.searchTitle.includes(keyword) || doc.searchBody.includes(keyword)
			);
			if (!bodyMatched) {
				return null;
			}

			const titleHit = titleHitCount > 0;
			const firstParagraphIndex = this.findFirstMatchingParagraphIndex(doc.searchParagraphs, keywords);
			const bodyHit = firstParagraphIndex !== -1;
			if (!titleHit && !bodyHit) {
				return null;
			}

			const previewStartIndex = titleHit ? 0 : firstParagraphIndex;
			const previewParagraphs = doc.paragraphs.length > 0
				? doc.paragraphs.slice(previewStartIndex, previewStartIndex + 3)
				: ["暂无正文内容"];
			const previewText = previewParagraphs.join("\n");
			const score =
				(titleHit ? 300 : 0) +
				(bodyHit ? 80 : 0) +
				titleHitCount * 25 +
				(Math.max(0, 10 - Math.max(previewStartIndex, 0))) +
				(doc.versionPriority === 0 ? 10 : doc.versionPriority === 1 ? 6 : 0);

			return {
				resultKey: `${doc.articleId}_${doc.versionKey}`,
				article: doc.article,
				articleChapter: doc.articleChapter,
				versionPriority: doc.versionPriority,
				versionLabel: doc.versionLabel,
				versionTagType: this.getVersionTagType(doc.versionKey),
				typeLabel: this.getArticleTypeLabel(doc.articleType),
				chapterLabel: this.getArticleChapterLabel(doc.article),
				matchLabel: titleHit && bodyHit ? "标题/正文命中" : titleHit ? "标题命中" : "正文命中",
				highlightedTitle: this.highlightText(doc.title || "未命名章节", keywords),
				highlightedPreview: this.highlightText(previewText, keywords),
				score,
			};
		},
		findFirstMatchingParagraphIndex(paragraphs, keywords) {
			for (let index = 0; index < paragraphs.length; index++) {
				const paragraph = paragraphs[index];
				if (keywords.some((keyword) => paragraph.includes(keyword))) {
					return index;
				}
			}
			return -1;
		},
		getVersionTagType(versionKey) {
			if (versionKey === "latest") {
				return "warning";
			}
			if (versionKey === "current") {
				return "success";
			}
			return "info";
		},
		getArticleTypeLabel(articleType) {
			if (articleType === "worldOutline") {
				return "大纲";
			}
			if (articleType === "worldVocabulary") {
				return "词条";
			}
			if (articleType === "richtext") {
				return "章节";
			}
			return "";
		},
		getArticleChapterLabel(article) {
			const chapter = Number(article && article.article_chapter ? article.article_chapter : 0);
			if (article.article_type === "richtext") {
				return `第${chapter}章`;
			}
			if (article.article_type === "worldOutline") {
				return `大纲 · 序号 ${chapter}`;
			}
			if (article.article_type === "worldVocabulary") {
				return `词条 · 序号 ${chapter}`;
			}
			return `序号 ${chapter}`;
		},
		escapeHtml(text) {
			return String(text || "")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
		},
		escapeRegExp(text) {
			return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		},
		highlightText(text, keywords) {
			const source = String(text || "");
			const sortedKeywords = Array.from(new Set((keywords || []).filter(Boolean)))
				.sort((left, right) => right.length - left.length);
			if (sortedKeywords.length === 0) {
				return this.escapeHtml(source);
			}

			const matcher = new RegExp(sortedKeywords.map((item) => this.escapeRegExp(item)).join("|"), "ig");
			let lastIndex = 0;
			let result = "";

			source.replace(matcher, (match, offset) => {
				result += this.escapeHtml(source.slice(lastIndex, offset));
				result += `<mark>${this.escapeHtml(match)}</mark>`;
				lastIndex = offset + match.length;
				return match;
			});

			result += this.escapeHtml(source.slice(lastIndex));
			return result || this.escapeHtml(source);
		},
		openSearchResult(result) {
			if (result && result.article) {
				this.gotoEditor(result.article);
			}
		},
		async refreshPage(changeToLastBookpart = false) {
			this.isLoading = true;
			this.resolveCurrentUserId();
			this.articleHistoryMetaCache = {};
			this.resetSearchCache(true);

			const uid = this.uid;
			const tk = this.getAuthToken();

			try {
				const [novelRes, accessRes, articlesRes] = await Promise.all([
					axios.get(this.$baseUrl + '/essays/get_novel_by_id?id=' + uid, {}),
					this.loadCollaborationInfo(),
					axios.get(this.$baseUrl + '/essays/get_articles?id=' + uid,
						{
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + tk
							}
						}
					),
				]);

				this.novel = {
					...(novelRes.data[0] || {}),
					current_access: accessRes.access || this.novelAccess,
				};
				this.articles = articlesRes.data || [];
				for (let item of this.articles) {
					item.articleStatusChecked = false;
				}
				this.refreshBookPart();
				this.refreshRealtimePresence();
				if (changeToLastBookpart) {
					let lastPartId = window.localStorage.getItem('lastPartId_' + this.uid);
					if (lastPartId) {
						for (let index = 0; index < this.bookPart.parts.length; index++) {
							let item = this.bookPart.parts[index];
							if (item.id == lastPartId) {
								this.changeBookPart(item);
								break;
							}
						}
					} else if (this.bookPart.parts.length > 0) {
						this.changeBookPart(this.bookPart.parts[this.bookPart.parts.length - 1]);
					}
				}
				if (this.hasActiveSearch) {
					this.scheduleSearch(true);
				}
			} catch (error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			} finally {
				this.isLoading = false;
			}
		},
		addArticle(type) {
			if (!this.canAddArticle) {
				this.showPermissionDenied("你没有新增章节权限");
				return;
			}
			let _this = this;
			let insertChapter = this.resolveInsertChapter();
			let tk = this.getAuthToken();
			if (type != undefined) {
				let typeInfo = {
					"richtext": {
						title: "新章节",
						content: "[]",
						name: "章节",
						is_draft: 1
					},
					"spliter": {
						title: "新分卷",
						content: "",
						name: "分卷",
						is_draft: 0
					},
					"worldOutline": {
						title: "新世界大纲",
						content: "新世界大纲",
						name: "世界大纲",
						is_draft: 1
					},
					"worldVocabulary": {
						title: "新世界词条",
						content: "{}",
						name: "世界词条",
						is_draft: 1
					},
				}
				if (typeInfo[type] != undefined) {
					axios.post(_this.$baseUrl + '/essays/add_article',
						{
							title: typeInfo[type].title,
							content: typeInfo[type].content,
							article_type: type,
							id: _this.uid,
							article_chapter: insertChapter,
							is_draft: typeInfo[type].is_draft
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
								title: typeInfo[type].name + "新增成功",
								icon: 'none',
								duration: 2000
							});
							_this.refreshPage();
						})
						.catch(function (error) {
							if (error) {
								const msg = error.response && error.response.data && error.response.data.msg;
								uni.showToast({
									title: msg || typeInfo[type].name + "新增失败",
									icon: 'none',
									duration: 2500
								});
							}
						})
						.then(function () {
							_this.buttonLock = true;
						});
				}
				return;
			}
		},
		deleteArticle(article_id) {
			if (!this.canDeleteArticle) {
				this.showPermissionDenied("你没有删除章节权限");
				return;
			}
			let tk = this.getAuthToken();
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '删除后，可通过章节回收站找回。',
				confirmColor: "#EA7034",
				success: function (res) {
					if (res.confirm) {
						axios.post(_this.$baseUrl + '/essays/delete_article',
							{
								id: article_id
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
									title: "已删除章节",
									icon: 'none',
									duration: 2000
								});
								_this.refreshPage();
							})
							.catch(function (error) {
								console.log(error);
								if (error) {
									uni.showToast({
										title: "章节删除失败",
										icon: 'none',
										duration: 2000
									});
								}
							})
							.then(function () {
								_this.buttonLock = true;
							});
					} else if (res.cancel) {
						return;
					}
				}
			});
		},
		changeSpliterName(id, content) {
			if (!this.canSortArticle) {
				this.showPermissionDenied("你没有章节排序权限");
				return;
			}
			let tk = this.getAuthToken();
			let _this = this;
			axios.post(this.$baseUrl + '/essays/modify_article',
				{
					title: content,
					content: "",
					is_draft: 0,
					article_id: id
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
						title: "修改成功",
						icon: 'none',
						duration: 2000
					});
					_this.refreshPage();
				})
				.catch(function (error) {
					//console.log(error);
					if (error) {
						uni.showToast({
							title: "修改失败，请重试",
							icon: 'none',
							duration: 2000
						});
					}
				})
		},
		gotoEditor(item) {
			
			// 原有的跳转逻辑
			if (item.article_type == "spliter") {
				if (!this.canSortArticle) {
					this.showPermissionDenied("你没有章节排序权限");
					return;
				}
				this.splitterRenameTargetId = item.article_id;
				this.splitterRenameValue = item.title || "";
				this.$nextTick(() => {
					this.$refs.splitterRenamePopup.open();
				});
			} else if (!this.canEditDraft) {
				this.showPermissionDenied("你没有编辑章节权限");
				return;
			} else if (item.article_type == "worldVocabulary") {
				uni.navigateTo({
					url: './worldVocabularyEditor?id=' + item.article_id
				})
			} else {
				// 如果在iframe模式下，向父框架发送编辑消息
				if (this.frameInfo.isEnabled) {
					this.sendMessageToParent({
						type: 'edit_article',
						source: 'allArticles',
						data: {
							article_id: item.article_id,
							article_type: item.article_type,
							title: item.title,
							novel_id: item.novel_id
						}
					});
					return;
				}
				uni.navigateTo({
					url: './chapterEditor?id=' + item.article_id
				})
			}
		},
		confirmSplitterRename(value) {
			const targetId = this.splitterRenameTargetId;
			const nextName = String(value || "").trim();
			if (targetId == null) return;
			if (!nextName) {
				uni.showToast({
					title: "分卷名不能为空",
					icon: "none",
					duration: 2000
				});
				return;
			}
			this.changeSpliterName(targetId, nextName);
			this.closeSplitterRename();
		},
		closeSplitterRename() {
			if (this.$refs.splitterRenamePopup) {
				this.$refs.splitterRenamePopup.close();
			}
			this.splitterRenameTargetId = null;
			this.splitterRenameValue = "";
		},
		refreshBookPart() {
			this.bookPart.parts = [{
				id: -1,
				name: "全部分卷"
			}];
			for (let item of this.articles) {
				if (item.article_type == "spliter") {
					this.bookPart.parts.push({
						id: item.article_id,
						name: item.title
					});
				}
			}
			if (this.bookPart.currentPart.id != -1) {
				// 检查当前的bookPart是否还在，不在的话就转回默认
				let exist = false;
				for (let item of this.bookPart.parts) {
					if (item.id == this.bookPart.currentPart.id) {
						exist = true;
					}
				}
				if (exist) {
					this.changeBookPart(this.bookPart.currentPart)
				} else {
					this.changeBookPart({ id: -1, name: "全部分卷" })
				}
			} else {
				this.changeBookPart({ id: -1, name: "全部分卷" })
			}
		},
		exportNovel() {
			this.$refs.exportPopup.open();
		},
		cancelExport() {
			this.$refs.exportPopup.close();
		},
		exportSimple() {
			uni.navigateTo({
				url: '../apps/h5webview?url=https://m.loghome.ink/subtasks/novel-export.html?novel_id=' + this.uid + '&title=仅打包导出作品'
			});
			this.cancelExport();
		},
		exportAdvanced() {
			uni.navigateTo({
				url: '../apps/h5webview?url=https://m.loghome.ink/subtasks/novel-export-vip.html?novel_id=' + this.uid + '&title=导出电子书'
			});
			this.cancelExport();
		},
		touchstart(ev) {
			if (!this.canSortArticle) {
				return;
			}
			let that = this;
			this.startTouchX = ev.touches[0].pageX;
			this.startTouchY = ev.touches[0].pageY;
			this.touchNotMoved = true;
			clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
			this.Loop = setTimeout(function () {
				if (this.touchNotMoved) {
					uni.navigateTo({
						url: "./sortArticles?id=" + that.uid
					})
				}
				that.touchend();
			}.bind(this), 500);
		},
		touchmove(ev) {
			let w = this.startTouchX - ev.touches[0].pageX;
			let h = this.startTouchY - ev.touches[0].pageY;
			if (w * w + h * h > 50) {
				this.touchNotMoved = false;
			}
		},
		touchend() {
			clearInterval(this.Loop);
		},
		changeBookPart(bookPart, isManual = false) {
			this.bookPart.currentPart = bookPart;
			if (isManual) {
				window.localStorage.setItem('lastPartId_' + this.uid, bookPart.id);
			}
			console.log(this.bookPart.currentPart);
			// 如果不是全部分卷，则只显示当前选择的分卷
			this.shownArticles = [];
			if (bookPart.id != -1) {
				let startSpliter = false;
				for (let item of this.articles) {
					if (item.article_type == "spliter" && startSpliter) {
						break;
					}
					if (item.article_id == bookPart.id)
						startSpliter = true;
					if (startSpliter) {
						this.shownArticles.push(item);
					}
				}
			} else {
				this.shownArticles = this.articles;
			}
			this.checkArticleStatus();
			this.bookPart.btnOpened = false;
			this.$refs.setPopup.close();
			if (this.hasActiveSearch) {
				this.scheduleSearch(true);
			}
			this.$forceUpdate();
		},
		async checkArticleStatus() {
			// 10个10个地并行查询
			const batchSize = 10;
			for (let item of this.shownArticles) {
				item.isCheckingStatus = true;
			}
			for (let i = 0; i < this.shownArticles.length; i += batchSize) {
				const batch = this.shownArticles.slice(i, i + batchSize);
				// 并行处理当前批次的文章
				await Promise.all(batch.map(item => this._checkArticleStatusSingle(item)));
				this.$forceUpdate();
			}
		},
		async getArticleWriter(articleId) {
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			let res = await axios.get(this.$baseUrl + '/essays/get_article_writer?id=' + articleId,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			)
			return res;
		},
		getArticleWriterHash(article) {
			if(article.article_writer) {
				return article.article_writer;
			} else {
				return "no data";
			}
		},
		async getArticleWriterWithContent(article, latestRemoteArticle) {
			if (!latestRemoteArticle || latestRemoteArticle.content) {
				return latestRemoteArticle;
			}

			try {
				const response = await this.getArticleWriter(article.article_id);
				if (!response || !response.data || response.data === "no data") {
					return latestRemoteArticle;
				}
				return {
					...latestRemoteArticle,
					...response.data,
				};
			} catch (error) {
				return latestRemoteArticle;
			}
		},
		getSyncState(articleId) {
			return readWriterSyncState(this.currentUserId, articleId);
		},
		isRecoverableSyncState(syncState) {
			return !!syncState && RECOVERABLE_SYNC_STATE_STATUSES.includes(String(syncState.status || ""));
		},
		getLocalWriterHash(article) {
			if (!article) {
				return "";
			}
			if (article.content) {
				return computeWriterContentHash(article.content);
			}
			return article.content_hash || "";
		},
		getVersionMarker(record) {
			if (!record) {
				return "";
			}
			return this.normalizeCreateTime(
				record.updated_at ||
				record.remote_updated_at ||
				record.writer_updated_at ||
				record.create_time ||
				record.timestamp ||
				""
			);
		},
		doesSyncStateMatchLocal(syncState, latestLocalArticle) {
			if (!this.isRecoverableSyncState(syncState) || !latestLocalArticle) {
				return false;
			}

			const localHash = this.getLocalWriterHash(latestLocalArticle);
			return !!syncState.local_hash && syncState.local_hash === localHash;
		},
		async resolveRecoverableSyncState(article, latestLocalArticle, latestRemoteArticle) {
			const syncState = this.getSyncState(article.article_id);
			if (!this.doesSyncStateMatchLocal(syncState, latestLocalArticle)) {
				return {
					isRecoverable: false,
					syncState,
					remoteEditors: [],
				};
			}

			const baseRemoteCreateTime = this.normalizeCreateTime(
				syncState.remote_updated_at || syncState.remote_create_time || ""
			);
			const remoteCreateTime = this.getVersionMarker(latestRemoteArticle);
			const remoteSessionId = String(
				(latestRemoteArticle && latestRemoteArticle.edit_session_id) || ""
			).trim();
			const syncSessionId = String(syncState.session_id || "").trim();

			if (
				baseRemoteCreateTime &&
				remoteCreateTime &&
				remoteCreateTime > baseRemoteCreateTime &&
				remoteSessionId &&
				syncSessionId &&
				remoteSessionId !== syncSessionId
			) {
				return {
					isRecoverable: false,
					syncState,
					remoteEditors: [],
				};
			}

			if (!baseRemoteCreateTime) {
				return {
					isRecoverable: true,
					syncState,
					remoteEditors: [],
				};
			}

			try {
				const historyRecords = await this.getArticleHistoryMeta(article.article_id);
				const remoteEditors = this.getRemoteEditorsSince(
					historyRecords,
					baseRemoteCreateTime
				);
				return {
					isRecoverable: remoteEditors.length === 0,
					syncState,
					remoteEditors,
				};
			} catch (error) {
				return {
					isRecoverable: false,
					syncState,
					remoteEditors: [],
				};
			}
		},
		async markRemoteConflict(article, sinceCreateTime) {
			const historyRecords = await this.getArticleHistoryMeta(article.article_id);
			const editors = this.getRemoteEditorsSince(historyRecords, sinceCreateTime);
			const summary = this.formatRemoteEditSummary(editors);
			if (summary) {
				article.remoteEditSummary = summary;
			} else {
				article.hasCloudCollision = true;
			}
			return editors;
		},
		scheduleArticleStatusRecheck(articleId) {
			if (this.statusRecheckTimers[articleId]) {
				return;
			}
			this.statusRecheckTimers[articleId] = setTimeout(async () => {
				delete this.statusRecheckTimers[articleId];
				const target = this.shownArticles.find(
					(item) => Number(item.article_id) === Number(articleId)
				);
				if (!target) return;
				target.isCheckingStatus = true;
				await this._checkArticleStatusSingle(target);
				this.$forceUpdate();
			}, SYNC_RECHECK_DELAY_MS);
		},
		async getArticle(articleId) {
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			let res = await axios.get(this.$baseUrl + '/essays/get_article?id=' + articleId,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			)
			return res;
		},
		async getArticleHash(articleId) {
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			let res = await axios.get(this.$baseUrl + '/essays/get_article_hash?id=' + articleId,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			)
			return res;
		},
		async getArticleHistoryMeta(articleId) {
			const cacheKey = Number(articleId || 0);
			if (!cacheKey) {
				return [];
			}

			const cached = this.articleHistoryMetaCache[cacheKey];
			if (Array.isArray(cached)) {
				return cached;
			}
			if (cached && typeof cached.then === "function") {
				return cached;
			}

			const request = axios.get(
				this.$baseUrl + "/essays/get_article_history_meta?id=" + cacheKey,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + this.getAuthToken(),
					},
				}
			)
				.then((response) => {
					const records = Array.isArray(response.data) ? response.data : [];
					this.articleHistoryMetaCache[cacheKey] = records;
					return records;
				})
				.catch((error) => {
					delete this.articleHistoryMetaCache[cacheKey];
					throw error;
				});

			this.articleHistoryMetaCache[cacheKey] = request;
			return request;
		},
		normalizeCreateTime(createTime) {
			const digits = String(createTime || "").replace(/\D/g, "");
			if (!digits) {
				return "";
			}
			if (digits.length >= 20) {
				return digits.slice(0, 20);
			}
			if (digits.length >= 14) {
				return `${digits.slice(0, 14)}${digits.slice(14, 20).padEnd(6, "0")}`;
			}
			return digits.padEnd(20, "0");
		},
		getRemoteEditorsSince(historyRecords, sinceCreateTime) {
			const since = this.normalizeCreateTime(sinceCreateTime);
			const editors = [];
			const seen = new Set();

			for (const record of historyRecords || []) {
				const recordTime = this.getVersionMarker(record);
				if (since && recordTime && recordTime <= since) {
					continue;
				}

				const editorId = Number(record.editor_user_id || 0);
				const editorName = String(record.editor_name || "").trim();
				if (editorId && editorId === Number(this.currentUserId || 0)) {
					continue;
				}
				if (!editorId && !editorName) {
					continue;
				}

				const uniqueKey = editorId ? `user:${editorId}` : `name:${editorName}`;
				if (seen.has(uniqueKey)) {
					continue;
				}
				seen.add(uniqueKey);
				editors.push({
					user_id: editorId || null,
					name: editorName || "未知作者",
				});
			}

			return editors;
		},
		formatRemoteEditSummary(editors) {
			if (!editors || editors.length === 0) {
				return "";
			}

			const names = editors
				.map((editor) => String(editor.name || "").trim())
				.filter(Boolean);
			if (names.length === 0) {
				return "";
			}
			if (names.length === 1) {
				return `上次后${names[0]}编辑过`;
			}
			if (names.length === 2) {
				return `上次后${names[0]}、${names[1]}编辑过`;
			}
			return `上次后${names[0]}等${names.length}人编辑过`;
		},
		countText(content) {
			let textCount = 0;
			let imageCount = 0;
			for (let item of content) {
				if (item.type == "text") {
					textCount += item.value.length;
				} else if (item.type == "image") {
					imageCount++;
				}
			}
			return {
				textCount: textCount,
				imageCount: imageCount
			}
		},
		async _checkArticleStatusSingle(article) {
			article.articleStatusChecked = true;
			article.hasCloudCollision = false;
			article.isSyncing = false;
			article.hasWriterModify = false;
			article.remoteEditSummary = "";
			if (article.collaboration_mode === "realtime_crdt") {
				// 实时协作章节以 CRDT 检查点为唯一同步状态，不参与旧版的
				// IndexedDB 草稿与 article_writer 哈希冲突判断。
				article.active_editor = null;
				article.isCheckingStatus = false;
				return;
			}
			// 查找最近保存的本地文章和云端文章
			const localArticles = await writerArticleDB.articles
				.where('[user_id+article_id]')
				.equals([Number(this.currentUserId || 0), Number(article.article_id)])
				.toArray();
			let latestLocalArticle = null;
			if (localArticles.length > 0) {
				latestLocalArticle = localArticles.reduce((latest, current) => {
					return latest.create_time > current.create_time ? latest : current;
				});
				latestLocalArticle.content_hash = this.getLocalWriterHash(latestLocalArticle);
			}
			let latestRemoteArticle = this.getArticleWriterHash(article);
			if (latestRemoteArticle == "no data") {
				latestRemoteArticle = null;
			}

			let writerArticle = null;

			// 比较本地和云端的文章状态
			if (latestLocalArticle == null && latestRemoteArticle == null) {
				// 本地和云端都没有保存过文章
			} else if (latestLocalArticle == null) {
				writerArticle = latestRemoteArticle;
				// 本地没有保存过文章，但是云端有保存过文章
			} else if (latestRemoteArticle == null) {
				writerArticle = latestLocalArticle;
				// 本地有保存过文章，但是云端没有保存过文章
				const recoverableSync = await this.resolveRecoverableSyncState(
					article,
					latestLocalArticle,
					null
				);
				if (recoverableSync.isRecoverable) {
					article.isSyncing = true;
					this.scheduleArticleStatusRecheck(article.article_id);
				}
			} else {
				// 本地和云端都有保存过文章
				// 比较本地和云端的文章内容
				if (latestLocalArticle.content_hash != latestRemoteArticle.content_hash) {
					latestRemoteArticle = await this.getArticleWriterWithContent(
						article,
						latestRemoteArticle
					);
					if (
						latestRemoteArticle.content &&
						areLegacyContentsEquivalent(
							latestLocalArticle.content,
							latestRemoteArticle.content
						)
					) {
						writerArticle = latestRemoteArticle;
						this.$forceUpdate();
					} else {
						const recoverableSync = await this.resolveRecoverableSyncState(
							article,
							latestLocalArticle,
							latestRemoteArticle
						);
						// 本地和云端的文章内容不一致
						if (recoverableSync.isRecoverable) {
							writerArticle = latestLocalArticle;
							article.isSyncing = true;
							this.scheduleArticleStatusRecheck(article.article_id);
						} else {
							writerArticle = latestRemoteArticle;
							if (
								Array.isArray(recoverableSync.remoteEditors) &&
								recoverableSync.remoteEditors.length > 0
							) {
								article.remoteEditSummary = this.formatRemoteEditSummary(
									recoverableSync.remoteEditors
								);
							} else {
								const latestRemoteTime = this.getVersionMarker(latestRemoteArticle);
								const latestLocalTime = this.getVersionMarker(latestLocalArticle);
								if (latestRemoteTime && latestLocalTime && latestRemoteTime > latestLocalTime) {
									try {
										await this.markRemoteConflict(
											article,
											latestLocalArticle.create_time
										);
									} catch (error) {
										article.hasCloudCollision = true;
									}
								} else {
									article.hasCloudCollision = true;
								}
							}
						}
						this.$forceUpdate();
					}
				} else {
					writerArticle = latestLocalArticle;
				}
			}

			if (writerArticle != null) {
				if (writerArticle.content_hash != article.content_hash) {
					if(!writerArticle.content) writerArticle.content = (await this.getArticleWriter(article.article_id)).data.content;
					article.hasWriterModify = true;
					// 将writerArticle.create_time原本的YYYYMMDDhhmmss格式调整为YYYY/MM/DD hh:mm:ss
					article.modify_time = Number(writerArticle.create_time.substring(0, 4)) + "/" +
						Number(writerArticle.create_time.substring(4, 6)) + "/" +
						Number(writerArticle.create_time.substring(6, 8)) + " " +
						writerArticle.create_time.substring(8, 10) + ":" +
						writerArticle.create_time.substring(10, 12) + ":" +
						writerArticle.create_time.substring(12, 14);

					// 统计字数
					let { textCount, imageCount } = this.countText(JSON.parse(writerArticle.content));
					article.title = writerArticle.title;
					article.modifiedTextCount = textCount;
					article.modifiedImageCount = imageCount;
				}
			}

			article.isCheckingStatus = false;
		},
		
		checkFrameEnvironment() {
			// 检测是否运行在iframe中
			if (window.self !== window.top) {
				console.log('检测到运行在iframe中，尝试与父框架通信');
				
				// 监听来自父框架的消息
				window.addEventListener('message', this.handleParentMessage);
				
				// 向父框架发送握手消息
				this.sendMessageToParent({
					type: 'iframe_ready',
					source: 'allArticles',
					message: '移动端编辑器已准备就绪'
				});
			} else {
				console.log('运行在独立窗口中');
			}
		},
		
		handleParentMessage(event) {
			// 验证消息来源（可选，根据实际需求调整）
			// if (event.origin !== 'http://localhost:3000') return;
			
			console.log('收到父框架消息:', event.data);
			
			if (event.data.type === 'frame_confirmed') {
				// 父框架确认通信成功
				this.frameInfo.isEnabled = true;
				
				// 向父框架发送确认消息
				this.sendMessageToParent({
					type: 'frame_enabled',
					source: 'allArticles',
					message: 'iframe模式已启用'
				});
			} else if (event.data.type === 'current_selected' && (event.data.source === 'chapterEditor' || event.data.source === 'parentFrame')) {
				this.handleCurrentSelected(event.data.data);
				setTimeout(() => {
					this.refreshPage();
				}, 100)
			} else if (event.data.type === 'clear_selection' && event.data.source === 'parentFrame') {
				// 处理取消选中消息
				console.log('AllArticles: 收到取消选中消息，清除当前选中状态');
				this.frameInfo.currentSelected = null;
				setTimeout(() => {
					this.refreshPage();
				}, 100)
			}
		},
		
		sendMessageToParent(data) {
			if (window.parent && window.parent !== window) {
				window.parent.postMessage(data, '*');
				console.log('向父框架发送消息:', data);
			}
		},
		
		handleCurrentSelected(data) {
			console.log('AllArticles: 收到当前选中文章信息', data);
			if (data.article_id) {
				// 更新当前选中的文章ID
				this.frameInfo.currentSelected = parseInt(data.article_id);
				console.log('AllArticles: 设置当前选中文章ID为', this.frameInfo.currentSelected);
			}
		}
	},
	onNavigationBarButtonTap(e) {
		let _this = this;
		if (e.text == "\ue790 ") {
			const itemList = [];
			if (this.canSortArticle) {
				itemList.push('章节排序');
			}
			if (this.canDeleteArticle) {
				itemList.push('章节回收站');
			}
			if (this.canPublishArticle) {
				itemList.push('定时发布管理');
			}
			if (this.novel.novel_type == "world") {
				itemList.push('查看世界');
				itemList.push(this.isOwner ? '世界设置' : '协作设置');
			} else {
				itemList.push('阅读');
				itemList.push(this.isOwner ? '作品设置' : '协作设置');
				if (this.isOwner) {
					itemList.push('导出作品');
				}
			}

			uni.showActionSheet({
				itemList,
				success: function (res) {
					const item = itemList[res.tapIndex];
					if (item == '章节排序') {
						uni.navigateTo({
							url: "./sortArticles?id=" + _this.uid
						})
					}
					if (item == '章节回收站') {
						uni.navigateTo({
							url: "./articlesDustbin?id=" + _this.uid
						})
					}
					if (item == '定时发布管理') {
						uni.navigateTo({
							url: "./scheduledTasks?id=" + _this.uid
						})
					}
					if (item == '查看世界') {
						uni.navigateTo({
							url: "../worlds/worldPage?id=" + _this.worldId
						})
					}
					if (item == '世界设置' || item == '作品设置' || item == '协作设置') {
						uni.navigateTo({
							url: "./essaySet?id=" + _this.uid
						})
					}
					if (item == '阅读') {
						uni.navigateTo({
							url: "../readers/bookInfo?id=" + _this.uid
						})
					}
					if (item == '导出作品') {
						_this.exportNovel();
					}
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		}
	},
	watch: {
		bookPart: {
			handler: function (newValue, oldValue) {
				let _this = this;
				// 仅在当前页面时，才设置标题
				if (this.$router.history.current.meta.name == "pages-writers-allArticles") {
					uni.setNavigationBarTitle({
						title: _this.bookPart.currentPart.name + (_this.bookPart.btnOpened ? " ▴" : " ▾")
					});
				}
			},
			deep: true,
			immediate: true
		}
	}
}
</script>

<style scoped lang="less">
.searchPanel {
	padding: 0;
	background: rgba(0, 0, 0, 0.04);
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);

	.dark-mode & {
		background: rgba(255, 255, 255, 0.04);
		border-bottom-color: rgba(255, 255, 255, 0.08);
	}

	::v-deep .el-input__inner {
		height: 88rpx;
		padding: 0 88rpx 0 76rpx;
		border-radius: 0;
		border: 0;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
		background: transparent;
		box-shadow: none;
		font-size: 28rpx;
	}

	::v-deep .el-input__prefix {
		display: flex;
		justify-content: center;
		align-items: center;
		left: 0;
		width: 64rpx;
		color: rgba(0, 0, 0, 0.48);
	}

	::v-deep .el-input__prefix-inner {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	::v-deep .el-input__suffix {
		right: 20rpx;
	}

	.dark-mode & {
		::v-deep .el-input__inner {
			background: transparent;
			color: var(--text-color-primary);
			border-bottom-color: var(--border-color);
		}

		::v-deep .el-input__inner::placeholder {
			color: var(--text-color-secondary);
			opacity: 1;
		}

		::v-deep .el-input__prefix {
			color: rgba(255, 255, 255, 0.5);
		}
	}
}

.searchMeta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0rpx 24rpx 0rpx;
	font-size: 24rpx;
	color: #8a6d53;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.articlesSkeleton {
	width: 100%;
	background-color: #ffffff;

	.dark-mode & {
		background-color: var(--card-background);
	}
}

.articleSkeleton {
	height: 110rpx;
	padding: 20rpx 35rpx 16rpx;
	border-bottom: 1rpx solid #f2f2f2;
	box-sizing: border-box;

	.dark-mode & {
		background-color: var(--card-background);
		border-bottom-color: var(--border-color);
	}
}

.skeletonBlock {
	position: relative;
	overflow: hidden;
	border-radius: 8rpx;
	background-color: #e8e8e8;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
		animation: writer-skeleton-shimmer 1.4s ease-in-out infinite;
	}

	.dark-mode & {
		background-color: #444444;

		&::after {
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
		}
	}
}

.skeletonTitle {
	width: 64%;
	height: 32rpx;
}

.skeletonMeta {
	width: 34%;
	height: 22rpx;
	margin-top: 16rpx;
}

.skeletonWidth0 { width: 48%; }
.skeletonWidth1 { width: 76%; }

@keyframes writer-skeleton-shimmer {
	100% {
		left: 100%;
	}
}

.searchResults {
	padding: 16rpx 20rpx 28rpx;
}

.searchResultList {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.searchStateCard,
.searchResultCard {
	background: #ffffff;
	border-radius: 18rpx;
	padding: 22rpx 24rpx;
	box-shadow: 0 6rpx 20rpx rgba(118, 58, 24, 0.08);

	.dark-mode & {
		background: var(--card-background);
		box-shadow: none;
	}
}

.searchStateCard {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	min-height: 140rpx;
	color: #7b5f49;
	font-size: 28rpx;
	text-align: center;

	&.error {
		color: #c45656;
	}

	&.empty {
		color: #8c7b6c;
	}

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.searchResultCard {
	cursor: pointer;
	transition: transform 0.2s ease, box-shadow 0.2s ease;

	&:active {
		transform: scale(0.985);
	}
}

.searchResultHeader {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20rpx;
}

.searchResultTitle {
	flex: 1;
	font-size: 32rpx;
	line-height: 1.45;
	font-weight: 700;
	color: #5d2f14;
	word-break: break-word;

	.dark-mode & {
		color: var(--text-color-primary);
	}

	::v-deep mark {
		background: #ffe08a;
		color: #5d2f14;
		padding: 0 4rpx;
		border-radius: 6rpx;
	}
}

.searchResultTags {
	display: inline-flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8rpx;
}

.searchResultMeta {
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #9a816b;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.searchResultParagraph {
	margin-top: 14rpx;
	font-size: 27rpx;
	line-height: 1.7;
	color: #5e5348;
	white-space: pre-wrap;
	word-break: break-word;
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;

	.dark-mode & {
		color: var(--text-color-regular);
	}

	::v-deep mark {
		background: #ffe08a;
		color: #5d2f14;
		padding: 0 4rpx;
		border-radius: 6rpx;
	}
}

.menuContent {
	display: flex;
	flex-direction: column;

	.subTitle {
		line-height: 80rpx;
		height: 80rpx;
		text-align: center;
		background-color: rgb(244, 244, 244);
		border-bottom: #bec3ca 1px solid;
		font-size: 35rpx;
		color: rgb(113, 52, 24);

		.dark-mode & {
			background-color: var(--card-background);
			color: var(--text-color-primary);
			border-bottom-color: #41454b;
		}

		span {
			margin-left: 10rpx;
		}

		.draft {
			font-size: 28rpx;
			margin-left: 10rpx;
			color: rgb(195, 0, 0);
		}

		&.collaborationModeAction {
			color: #287c62;

			&.realtime {
				color: #b76b18;
			}

			&.disabled {
				opacity: 0.55;
				pointer-events: none;
			}

			.dark-mode & {
				color: #79c9ae;

				&.realtime {
					color: #e7b37d;
				}
			}
		}
	}
}

.titleOuter {
	background-color: rgb(255, 255, 255);
	cursor: pointer;

	::v-deep .uni-collapse-item__title.uni-collapse-item-border {
		border-bottom-color: #e5e5e5;
	}

	&.splitterRow {
		background-color: #dddddd;

		::v-deep .uni-collapse-item__title {
			background-color: #dddddd;
		}

		.title {
			color: #444444;
		}
	}

	&.selectedRow {
		background-color: #fffaf0;

		::v-deep .uni-collapse-item__title {
			background-color: #fffaf0;
		}

		.title {
			color: #0a0e16;
		}
	}

	.dark-mode & {
		background-color: var(--card-background);

		::v-deep .uni-collapse-item__title.uni-collapse-item-border {
			border-bottom-color: #41454b;
		}

		&.splitterRow {
			background-color: #30343a;

			::v-deep .uni-collapse-item__title {
				background-color: #30343a;
			}

			.title {
				color: #eef0f3;
			}
		}

		&.selectedRow {
			background-color: #343b45;
			box-shadow: inset 6rpx 0 0 #e7a665;

			::v-deep .uni-collapse-item__title {
				background-color: #343b45;
			}

			.title {
				color: #fff5e8;
			}
		}
	}
}

.activeEditor {
	display: inline-flex;
	align-items: center;
	margin-left: 12rpx;
	padding: 4rpx 10rpx 4rpx 6rpx;
	border-radius: 999rpx;
	background-color: rgba(255, 186, 120, 0.18);
	color: #9a4f1f;
	font-size: 22rpx;
	vertical-align: middle;

	.dark-mode & {
		background-color: rgba(255, 186, 120, 0.12);
		color: #ffd4a8;
	}
}

.activeEditorAvatar {
	width: 34rpx;
	height: 34rpx;
	border-radius: 50%;
	margin-right: 8rpx;
	object-fit: cover;
}

.realtimeCollaborators {
	display: inline-flex;
	align-items: center;
	margin-left: 12rpx;
	padding: 2rpx 6rpx;
	border-radius: 999rpx;
	background-color: rgba(124, 58, 237, 0.08);
	vertical-align: middle;
	cursor: pointer;

	.dark-mode & {
		background-color: rgba(167, 139, 250, 0.12);
	}
}

.realtimeCollaboratorAvatarWrap {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 38rpx;
	width: 38rpx;
	height: 38rpx;
	overflow: hidden;
	border: 3rpx solid #7c3aed;
	border-radius: 50%;
	background-color: #f4efff;
	box-sizing: border-box;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.16);

	& + & {
		margin-left: -12rpx;
	}
}

.realtimeCollaboratorAvatar {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.realtimeCollaboratorOverflow {
	color: #6d28d9;
	font-size: 18rpx;
	font-weight: 700;
	line-height: 1;

	.dark-mode & {
		color: #ddd6fe;
		background-color: #3b2d55;
	}
}

.title {
	margin-top: 20rpx;
	padding-left: 35rpx;
	font-size: 35rpx;
	font-weight: bold;
	color: rgb(113, 52, 24);
	line-height: 35rpx;

	.dark-mode & {
		color: #e7b37d;
	}

	.draft {
		font-size: 28rpx;
		margin-left: 10rpx;
		color: rgb(195, 0, 0);
	}

	.specialType {
		font-size: 28rpx;
		margin-left: 10rpx;
		color: rgb(130, 0, 195);
	}
}

.articleStatusLoading {
	margin-left: 10rpx;
	color: #444444;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.title.last {
	margin-top: 40rpx;
	margin-bottom: 40rpx;
}

.newArticle {
	margin-top: 10rpx;
	background-color: rgb(255, 255, 255);

	.dark-mode & {
		background-color: var(--card-background);
	}

	.tit {
		padding: 5rpx 35rpx;
		background-color: #f2f2f2;
		color: #444444;

		.dark-mode & {
			background-color: var(--background-color-tertiary);
			color: var(--text-color-regular);
		}
	}

	div.add {
		width: 100%;
		margin: 10rpx 0;
		margin-left: 34rpx;
		padding: 20rpx;
		font-size: 32rpx;
		color: #713418;
		background-color: rgb(236, 236, 236);
		border-radius: 14rpx;
		text-align: center;
		transition: all .3s;

		.dark-mode & {
			background-color: rgba(255, 255, 255, 0.05);
			color: var(--text-color-primary);
		}
	}

	div.add:active {
		transform: scale(.95);
		filter: brightness(.9);
	}

	.share {
		display: flex;

		div.add:last-child {
			margin-right: 34rpx;
		}
	}

	.monopolize {
		display: flex;
		width: 100%;

		div.add {
			width: 100%;
			margin-right: 34rpx;
		}
	}
}

.miniTitle {
	padding-left: 35rpx;
	font-size: 30rpx;
	color: rgb(134, 133, 132);
	line-height: 50rpx;
	margin-bottom: 10rpx;

	.dark-mode & {
		color: #bdc2ca;
	}

	.openBtn {}
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-flow: wrap;
	background-color: #f2f2f2;
	width: 100vw;

	&.dark-mode {
		background-color: var(--background-color-secondary);
	}

	.articles {
		width: 100%;

		.article {
			border-bottom: #f2f2f2 1rpx solid;
		}

	}

	div.underBar {
		height: 150rpx
	}
}

.content.dark-mode {
	background-color: #1e1e1e;
}

.bookParts {
	width: 100%;
	margin-top: var(--statusBarHeight);

	.part {
		padding-left: 35rpx;
		border-bottom: #cacaca 1rpx solid;
		background-color: #dddddd !important;

		.dark-mode & {
			border-bottom-color: var(--border-color);
			background-color: var(--background-color-tertiary) !important;
		}

		.partTitle {
			font-size: 35rpx;
			color: #444444;
			line-height: 80rpx;

			.dark-mode & {
				color: var(--text-color-primary);
			}
		}
	}

	.part.selected {
		background-color: #ffffff !important;

		.dark-mode & {
			background-color: rgba(234, 112, 52, 0.16) !important;
		}

		.partTitle {
			color: #222222;
			font-weight: bold;

			.dark-mode & {
				color: var(--text-color-primary);
			}
		}
	}

}

.splitterRenameDialog {
	::v-deep .uni-popup-dialog {
		background-color: #ffffff;
	}

	::v-deep .uni-dialog-title-text {
		color: #303133;
	}

	::v-deep .uni-dialog-input {
		background-color: #f5f5f5;
		border-color: #dedede;
		color: #303133;
	}

	::v-deep .uni-dialog-button-group {
		border-top-color: #e5e5e5;
	}

	::v-deep .uni-border-left {
		border-left-color: #e5e5e5;
	}

	::v-deep .uni-dialog-button-text {
		color: #303133;
	}

	::v-deep .uni-button-color {
		color: #ea7034;
	}

	.dark-mode & {
		::v-deep .uni-popup-dialog {
			background-color: #282c32;
			box-shadow: 0 18rpx 60rpx rgba(0, 0, 0, 0.5);
		}

		::v-deep .uni-dialog-title-text {
			color: #f1f3f5;
		}

		::v-deep .uni-dialog-input {
			background-color: #1f2227;
			border-color: #4a5058;
			color: #f4f5f7;
			caret-color: #e7a665;
		}

		::v-deep .uni-dialog-input::placeholder {
			color: #8f959e;
			opacity: 1;
		}

		::v-deep .uni-dialog-button-group {
			border-top-color: #454a52;
		}

		::v-deep .uni-border-left {
			border-left-color: #454a52;
		}

		::v-deep .uni-dialog-button-text {
			color: #d9dde3;
		}

		::v-deep .uni-button-color {
			color: #f0ad6d;
		}
	}
}

/* 导出作品弹出菜单样式 */
.share-popup {
	padding: 20rpx;
	border-radius: 20rpx 20rpx 0 0;
	background-color: #FFFFFF;

	.dark-mode & {
		background-color: var(--card-background);
	}

	.share-title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		padding-bottom: 20rpx;
		color: #333333;

		.dark-mode & {
			color: var(--text-color-primary);
		}
	}

	.share-content {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #EEEEEE;

		.dark-mode & {
			border-bottom-color: var(--border-color);
		}

		.share-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 30%;
			padding: 30rpx 40rpx;
			border-radius: 16rpx;
			background-color: #F8F9FA;
			transition: all 0.2s ease;

			.dark-mode & {
				background-color: var(--background-color-secondary);
			}

			&:active {
				background-color: #E9ECEF;
				transform: scale(0.95);

				.dark-mode & {
					background-color: var(--background-color-tertiary);
				}
			}

			image {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 15rpx;
			}

			.share-text {
				margin-top: 10rpx;
				font-size: 28rpx;
				color: #495057;
				font-weight: 500;

				.dark-mode & {
					color: var(--text-color-regular);
				}
			}
		}
	}

	.share-bottom {
		padding-top: 20rpx;

		.share-btn-cancel {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 32rpx;
			color: #6C757D;
			background-color: transparent;
			transition: all 0.2s ease;

			.dark-mode & {
				color: var(--text-color-secondary);
			}

			&:active {
				background-color: #F1F3F5;
				color: #495057;

				.dark-mode & {
					background-color: var(--background-color-secondary);
					color: var(--text-color-primary);
				}
			}
		}
	}
}
</style>
