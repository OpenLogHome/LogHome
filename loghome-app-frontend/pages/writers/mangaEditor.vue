<template>
	<view class="manga-editor" v-dark>
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<button v-manga-a11y class="nav-back" type="button" aria-label="返回" @click="handleBack"><manga-icon name="back" /></button>
			<text class="nav-title">{{ view === 'list' ? (novel.name || '话数管理') : (editingArticleId ? '编辑话数' : '新建话数') }}</text>
		</view>

		<!-- ============ 话数列表 ============ -->
		<scroll-view v-if="view === 'list'" class="page-body" scroll-y>
			<view class="work-head">
				<image lazy-load class="work-cover" :src="novel.picUrl || ''" mode="aspectFill"></image>
				<view class="work-meta">
					<text class="work-name">{{ novel.name }}</text>
					<view class="work-tags">
						<text class="status-chip">漫画</text><text class="status-chip" v-if="!novel.is_personal">公开</text><text class="status-chip" v-else>私密</text>
					</view>
					<text class="work-count">共 {{ articles.length }} 话</text>
					<view class="work-actions"><button v-manga-a11y class="secondary-btn" type="button" @click="openSettings"><manga-icon name="settings" />作品设置</button><button v-manga-a11y class="secondary-btn" type="button" @click="previewWork"><manga-icon name="preview" />作者预览</button></view>
				</view>
			</view>

			<view class="section-card">
				<view class="section-head">
					<text class="section-title">话数目录</text>
					<button v-manga-a11y class="new-btn" v-if="canAdd" type="button" @click="startNewEpisode"><manga-icon name="add" />新建话数</button>
				</view>

				<view v-if="articles.length === 0" class="empty-tip">
					<text>还没有话数。新建第一话后即可上传漫画页面。</text>
				</view>

				<view class="article-row" v-for="item in articles" :key="item.article_id" role="button" tabindex="0" :aria-label="'编辑第 ' + item.article_chapter + ' 话：' + item.title" @click="startEditEpisode(item)" @keydown.enter="startEditEpisode(item)" @keydown.space.prevent="startEditEpisode(item)">
					<view class="article-no">{{ item.article_chapter }}</view>
					<view class="article-main">
						<view class="article-title">
							<text>{{ item.title }}</text>
							<text v-if="Number(item.is_draft) === 1" class="draft-badge">草稿</text>
						</view>
						<text class="article-date">{{ formatDate(item.update_time) }}</text>
					</view>
					<text class="type-badge">{{ item.article_type === 'mangaPage' ? '页漫' : '条漫' }}</text>
					<button v-manga-a11y class="del-btn" v-if="canDelete" type="button" :aria-label="'删除第 ' + item.article_chapter + ' 话'" @click.stop="deleteEpisode(item)"><manga-icon name="trash" /></button>
				</view>
			</view>
			<view class="bottom-space"></view>
		</scroll-view>

		<!-- ============ 话数编辑 ============ -->
		<scroll-view v-else class="page-body" scroll-y>
			<view class="empty-tip" v-if="loadingEditor">正在加载完整话数…</view>
			<view class="empty-tip" v-else-if="!editorReady">话数加载失败，请返回列表后重试。当前内容不可保存。</view>
			<view class="empty-tip" v-else>修改会自动备份到本机。{{ editingPublished ? '已发布话数存草稿会撤回发布。' : '' }}</view>
			<view class="section-card">
				<view class="field-row">
					<label class="field-label" for="episode-title">话数标题</label>
					<input id="episode-title" class="field-input" v-model="editorTitle" :disabled="saving || !editorReady" maxlength="60" placeholder="例如：第1话 命运的开始" />
				</view>
				<view class="field-row">
					<text class="field-label">漫画类型</text>
					<view class="radio-row" role="radiogroup" aria-label="漫画类型">
						<button v-manga-a11y class="radio-item" type="button" role="radio" :aria-checked="editorType === 'mangaStrip' ? 'true' : 'false'" :class="{ active: editorType === 'mangaStrip' }" @click="setEditorType('mangaStrip')">
							<text>条漫（竖长图滚动）</text>
						</button>
						<button v-manga-a11y class="radio-item" type="button" role="radio" :aria-checked="editorType === 'mangaPage' ? 'true' : 'false'" :class="{ active: editorType === 'mangaPage' }" @click="setEditorType('mangaPage')">
							<text>页漫（左右翻页）</text>
						</button>
					</view>
				</view>
			</view>

			<view class="section-card">
				<view class="section-head">
					<text class="section-title">页面（{{ pages.length }} 页）</text>
					<button v-manga-a11y="saving || !editorReady" class="new-btn" type="button" :disabled="saving || !editorReady" @click="addPages"><manga-icon name="upload" />添加页面</button>
				</view>

				<view v-if="pages.length === 0 && !uploading" class="empty-tip">
					<text>支持 jpg / png / webp / gif，一次最多选 9 张；高清图片上传可能较慢</text>
				</view>

				<view class="page-toolbar"><button v-manga-a11y="!pages.length" type="button" :disabled="!pages.length" @click="sortMode = !sortMode"><manga-icon name="sort" />{{ sortMode ? '完成排序' : '调整顺序' }}</button><button v-manga-a11y="!pages.length" type="button" :disabled="!pages.length" @click="previewEpisode"><manga-icon name="preview" />整话预览</button></view>
                <view class="upload-list" v-if="uploadQueue.length">
                  <view class="queue-head"><text>上传队列</text><view class="queue-tools"><button v-manga-a11y type="button" @click="cancelAllUploads">取消未完成</button><button v-manga-a11y type="button" @click="clearCompletedUploads">清理记录</button></view></view>
                  <view v-for="task in uploadQueue" :key="task.id" class="upload-row">
                    <view class="upload-info"><text class="upload-name">{{ task.replaceId !== null ? '替换 · ' : '' }}{{ task.name }}</text><text class="upload-status">{{ task.status === 'success' ? '完成' : task.status === 'error' ? task.error : task.status === 'cancelled' ? '已取消' : task.status === 'queued' ? '等待上传' : task.progress >= 95 ? '生成阅读图…' : task.progress + '%' }}</text><view class="upload-track"><view :style="{ width: task.progress + '%' }"></view></view></view>
                    <button v-manga-a11y v-if="task.status === 'error'" type="button" class="queue-action" :aria-label="'重试上传' + task.name" @click="retryUpload(task)">重试</button>
                    <button v-manga-a11y v-if="task.status !== 'success' && task.status !== 'cancelled'" type="button" class="queue-action" :aria-label="'取消上传' + task.name" @click="cancelUpload(task)">取消</button>
                  </view>
                  <text class="queue-note">成功的页面自动备份；未完成的上传需留在本页处理。文件按名称排序，条漫长图自动分段。</text>
                </view>
                <manga-page-sorter v-if="sortMode" :pages="pages" :disabled="saving || uploading" @reorder="reorderPages" />
                <view v-else class="page-grid">
					<view class="page-cell" v-for="(page, idx) in pages" :key="page.id">
						<button v-manga-a11y class="page-preview" type="button" :aria-label="'预览第 ' + (idx + 1) + ' 页'" @click="previewPage(idx)"><image lazy-load class="page-thumb" :src="page.thumb || page.url" mode="aspectFill" /></button>
						<text class="page-no">{{ idx + 1 }}</text>
						<button v-manga-a11y class="page-del" type="button" :aria-label="'删除第 ' + (idx + 1) + ' 页'" @click.stop="removePage(idx)"><manga-icon name="close" /></button>
						<view class="page-moves">
							<button v-manga-a11y class="move-btn" type="button" :aria-label="'替换第 ' + (idx + 1) + ' 页'" @click.stop="replacePage(page)">替换</button>
							<button v-manga-a11y="idx === 0" class="move-btn" type="button" :disabled="idx === 0" :aria-label="'将第 ' + (idx + 1) + ' 页前移'" @click.stop="movePage(idx, -1)"><manga-icon name="previous" /></button>
							<button v-manga-a11y="idx === pages.length - 1" class="move-btn" type="button" :disabled="idx === pages.length - 1" :aria-label="'将第 ' + (idx + 1) + ' 页后移'" @click.stop="movePage(idx, 1)"><manga-icon name="next" /></button>
						</view>
					</view>
					<button v-manga-a11y class="page-cell add-cell" type="button" v-if="!uploading" @click="addPages"><manga-icon name="add" /><text>添加页面</text></button>
				</view>
			</view>
			<view class="bottom-space"></view>
		</scroll-view>

		<!-- 编辑模式底部操作栏 -->
		<view class="action-bar" v-if="view === 'edit'">
			<button v-manga-a11y class="act-btn ghost" type="button" @click="backToList">返回列表</button>
			<button v-manga-a11y="saving || uploading || !editorReady" class="act-btn draft" type="button" :disabled="saving || uploading || !editorReady" @click="saveEpisode(1)">{{ editingPublished ? '转为草稿' : '存草稿' }}</button>
			<button v-manga-a11y="saving || uploading || !editorReady" class="act-btn publish" type="button" :disabled="saving || uploading || !editorReady" @click="saveEpisode(0)">{{ editingArticleId ? '保存并发布' : '发布' }}</button>
		</view>
	</view>
</template>

<script>
import MangaA11y from '@/common/manga-a11y.js';
import axios from 'axios';
import MangaPageSorter from '@/components/manga-page-sorter.vue';
import MangaIcon from '@/components/manga-icon.vue';

export default {
  directives: { mangaA11y: MangaA11y },
	components: { MangaPageSorter, MangaIcon },
	data() {
		return {
			novelId: null,
			novel: {},
			articles: [],
			view: 'list', // list | edit
			editingArticleId: null,
			editorTitle: '',
			editorType: 'mangaStrip',
			pages: [],
			saving: false,
			uploading: false,
						uploadQueue: [],
			sortMode: false,
			queueSequence: 0,
			loadingEditor: false,
			editorReady: false,
			expectedRevision: null,
			editingPublished: false,
			baseline: '',
			editRequestId: 0,
			draftTimer: null,
			navigationAllowed: false,
			leavePromptOpen: false,
		};
	},
	computed: {
		editorSnapshot() { return JSON.stringify({ title: this.editorTitle, type: this.editorType, pages: this.pages }); },
		hasUnsavedChanges() { return this.view === 'edit' && this.editorReady && this.editorSnapshot !== this.baseline; },
		canAdd() { return !!(this.novel.current_access && this.novel.current_access.can_add_article); },
		canDelete() { return !!(this.novel.current_access && this.novel.current_access.can_delete_article); },
	},
	watch: {
		editorSnapshot() {
			clearTimeout(this.draftTimer);
			if (this.hasUnsavedChanges) this.draftTimer = setTimeout(() => this.persistDraft(), 600);
		},
	},
	onLoad(option) {
		this.novelId = option.id;
		this.refreshPage();
	},
	onShow() { if (this.novelId) this.loadNovel(); },
	onHide() { this.persistDraft(); },
	onBackPress() {
		if (this.navigationAllowed) return false;
		if (this.view === 'edit' || this.uploading || this.saving) { this.handleBack(); return true; }
		return false;
	},
	mounted() {
		// #ifdef H5
		window.addEventListener('beforeunload', this.beforeWindowUnload);
		// #endif
	},
	onUnload() {
		this.cancelAllUploads();
		this.persistDraft();
		clearTimeout(this.draftTimer);
		this.editRequestId += 1;
		// #ifdef H5
		window.removeEventListener('beforeunload', this.beforeWindowUnload);
		// #endif
	},
	methods: {
		setEditorType(type) { if (!this.saving && this.editorReady) this.editorType = type; },
		openSettings() { uni.navigateTo({ url: '/pages/writers/mangaSettings?id=' + this.novelId }); },
		previewWork() { uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + this.novelId + '&preview=1' }); },
		beforeWindowUnload(e) {
			this.persistDraft();
			if (this.hasUnsavedChanges || this.uploading || this.saving) { e.preventDefault(); e.returnValue = ''; }
		},
		draftKey() { return 'MangaDraft_' + (this.$store.state.user_id || 'guest') + '_' + this.novelId + '_' + (this.editingArticleId || 'new'); },
		persistDraft() {
			if (!this.hasUnsavedChanges) return true;
			try {
				window.localStorage.setItem(this.draftKey(), JSON.stringify({ ...JSON.parse(this.editorSnapshot), revision: this.expectedRevision }));
				return true;
			} catch (_) {
				uni.showToast({ title: '本机草稿备份失败，请及时保存', icon: 'none' });
				return false;
			}
		},
		restoreDraft(requestId) {
			let draft;
			try { draft = JSON.parse(window.localStorage.getItem(this.draftKey())); } catch (_) { return; }
			if (!draft || !Array.isArray(draft.pages)) return;
			uni.showModal({
				title: '恢复未保存的修改', content: '发现本机草稿，是否恢复？', confirmText: '恢复', cancelText: '不恢复',
				success: (r) => {
					if (!r.confirm || requestId !== this.editRequestId || this.view !== 'edit') return;
					this.editorTitle = draft.title || '';
					this.editorType = draft.type === 'mangaPage' ? 'mangaPage' : 'mangaStrip';
					this.pages = draft.pages;
					this.normalizePageIds();
					// 旧草稿保留原版本，不能绕过服务器的冲突检查。
					if (this.editingArticleId) this.expectedRevision = draft.revision || null;
				},
			});
		},
		confirmLeave(action) {
			if (this.uploading || this.saving) { uni.showToast({ title: '请等待上传或保存完成', icon: 'none' }); return; }
			if (!this.hasUnsavedChanges) { action(); return; }
			if (this.leavePromptOpen) return;
			const backedUp = this.persistDraft();
			this.leavePromptOpen = true;
			uni.showModal({
				title: '尚有未保存的修改', content: backedUp ? '修改已备份到本机。退出后可恢复，是否退出？' : '本机备份失败，退出会丢失修改。是否仍要退出？', confirmText: '退出', cancelText: '继续编辑',
				success: (r) => { this.leavePromptOpen = false; if (r.confirm) action(); },
			});
		},
		getToken() {
			let tk;
			try { tk = JSON.parse(window.localStorage.getItem('token')); } catch (_) { return null; }
			if (tk) tk = tk.tk;
			return tk;
		},
		authHeaders() {
			return {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.getToken(),
			};
		},
		formatDate(value) {
			if (!value) return '';
			return String(value).slice(0, 16).replace('T', ' ');
		},
		shouldUseNativeBack() {
			const bridge = typeof window !== 'undefined' ? window.jsBridge : null
			return !!(bridge && bridge.inApp && bridge.nativeRouterAvailable)
		},
		handleBack() {
			if (this.view === 'edit') {
				this.backToList();
				return;
			}
			const pages = getCurrentPages();
			this.navigationAllowed = true;
			if (this.shouldUseNativeBack()) {
				uni.navigateBack({ delta: 1 })
				return
			}
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.switchTab({ url: '/pages/essays' });
			}
		},
		refreshPage() {
			this.loadNovel();
			this.loadArticles();
		},
		loadNovel() {
			axios.get(this.$baseUrl + '/essays/get_manga?id=' + this.novelId, { headers: this.authHeaders() }).then((res) => {
				if (res.status == 200 && res.data && res.data.length > 0) {
					this.novel = res.data[0];
				}
			}).catch((e) => {
				console.error('loadNovel failed', e);
			});
		},
		loadArticles() {
			axios.get(this.$baseUrl + '/essays/get_articles?id=' + this.novelId, {
				headers: this.authHeaders(),
			}).then((res) => {
				if (res.status == 200) {
					this.articles = (res.data || []).filter(
						(a) => a.article_type !== 'spliter',
					);
				}
			}).catch((e) => {
				console.error('loadArticles failed', e);
			});
		},
		// ===== 列表 → 编辑 =====
		startNewEpisode() {
			if (this.uploading || this.saving || this.loadingEditor || !this.canAdd) return;
			const requestId = ++this.editRequestId;
			this.editingArticleId = null;
			this.editorTitle = '';
			this.editorType = 'mangaStrip';
			this.pages = [];
			this.uploadQueue = []; this.sortMode = false;
			this.expectedRevision = null;
			this.editingPublished = false;
			this.editorReady = true;
			this.view = 'edit';
			this.baseline = this.editorSnapshot;
			this.restoreDraft(requestId);
		},
		async startEditEpisode(item, restore = true) {
			if (this.uploading || this.saving || this.loadingEditor) return;
			const access = this.novel.current_access;
			if (!access || !access.can_edit_draft || !access.can_publish_article) {
				uni.showToast({ title: '没有编辑或发布权限', icon: 'none' }); return;
			}
			const requestId = ++this.editRequestId;
			this.editingArticleId = item.article_id;
			this.editorTitle = '';
			this.uploadQueue = []; this.sortMode = false;
			this.pages = [];
			this.editorReady = false;
			this.loadingEditor = true;
			this.view = 'edit';
			try {
				const res = await axios.get(this.$baseUrl + '/essays/get_article?id=' + item.article_id, { headers: this.authHeaders() });
				if (requestId !== this.editRequestId) return;
				const article = res.data && res.data[0];
				if (!article || String(article.novel_id) !== String(this.novelId) || !article.manga_revision) throw new Error('无法加载完整话数');
				const content = typeof article.content === 'string' ? JSON.parse(article.content) : article.content;
				if (!content || !Array.isArray(content.pages)) throw new Error('话数图片数据无法解析');
				this.editorTitle = article.title || '';
				this.editorType = article.article_type === 'mangaPage' ? 'mangaPage' : 'mangaStrip';
				this.pages = JSON.parse(JSON.stringify(content.pages));
				this.normalizePageIds();
				this.expectedRevision = article.manga_revision;
				this.editingPublished = Number(article.is_draft) === 0;
				this.editorReady = true;
				this.baseline = this.editorSnapshot;
				if (restore) this.restoreDraft(requestId);
			} catch (e) {
				if (requestId === this.editRequestId) uni.showToast({ title: '加载失败，已禁止保存，请重试', icon: 'none' });
			} finally {
				if (requestId === this.editRequestId) this.loadingEditor = false;
			}
		},
		backToList() {
			this.confirmLeave(() => {
				this.editRequestId += 1;
				this.loadingEditor = false;
				this.view = 'list';
				this.loadArticles();
			});
		},
		// ===== 页面管理 =====
		addPages() { this.choosePages(null); },
		replacePage(page) { this.choosePages(page.id); },
		choosePages(replaceId) {
			if (this.saving || !this.editorReady) return;
			const requestId = this.editRequestId;
			uni.chooseImage({
				count: replaceId === null ? 9 : 1, sizeType: ['original'], sourceType: ['album', 'camera'],
				success: (res) => {
					if (requestId !== this.editRequestId || this.view !== 'edit' || this.saving) return;
					const paths = res.tempFilePaths || [];
					this.uploadFiles(res.tempFiles || paths, paths, replaceId);
				},
			});
		},
		uploadFiles(tempFiles, paths, replaceId = null) {
			const selections = paths.map((path, i) => ({ path, meta: tempFiles[i] || {}, name: tempFiles[i] && (tempFiles[i].name || tempFiles[i].file && tempFiles[i].file.name) || '图片 ' + (i + 1) }));
			selections.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }));
			for (const item of selections) this.uploadQueue.push({ ...item, id: ++this.queueSequence, replaceId, status: 'queued', progress: 0, error: '', cancel: null, pageIds: [] });
			return this.drainUploads();
		},
		async drainUploads() {
			if (this.uploading) return;
			this.uploading = true;
			const epoch = this.editRequestId;
			try {
				let task;
				while ((task = this.uploadQueue.find(item => item.status === 'queued'))) {
					task.status = 'uploading'; task.progress = 0; task.error = '';
					try {
						const upload = await this.prepareUpload(task.path, task.meta);
						if (task.status === 'cancelled' || epoch !== this.editRequestId) continue;
						const source = axios.CancelToken.source(); task.cancel = source.cancel;
						const url = this.$baseUrl + '/essays/upload_manga_page' + (upload.binary ? '?article_type=' + encodeURIComponent(this.editorType) : '');
						const body = upload.binary ? upload.blob : { img: upload.dataUrl, article_type: this.editorType };
						const res = await axios.post(url, body, {
							headers: { ...this.authHeaders(), 'Content-Type': upload.binary ? 'application/octet-stream' : 'application/json' }, cancelToken: source.token, timeout: 0,
							onUploadProgress: e => { if (e.total) task.progress = Math.min(95, Math.round(e.loaded / e.total * 95)); },
						});
						if (task.status === 'cancelled' || epoch !== this.editRequestId) continue;
						const incoming = res.data && (res.data.pages || (res.data.url ? [res.data] : []));
						if (!incoming || !incoming.length || incoming.some(p => !/^https?:\/\//.test(p.url))) throw new Error('上传未返回有效图片');
						const replacementIdx = task.replaceId === null ? -1 : this.pages.findIndex(p => p.id === task.replaceId);
						if (task.replaceId !== null && replacementIdx < 0) throw new Error('待替换页面已删除');
						if (this.pages.length + incoming.length - (replacementIdx >= 0 ? 1 : 0) > 300) throw new Error('分段后超过单话 300 页上限');
						let id = Math.max(0, ...this.pages.map(p => Number(p.id) || 0));
						const next = incoming.map(p => ({ id: ++id, url: p.url, thumb: p.thumb, readingUrl: p.readingUrl, width: p.width, height: p.height }));
						if (replacementIdx >= 0) { next[0].id = task.replaceId; this.pages.splice(replacementIdx, 1, ...next); }
						else {
							const taskIdx = this.uploadQueue.indexOf(task);
							const following = this.uploadQueue.slice(taskIdx + 1).find(q => q.replaceId === null && q.pageIds && q.pageIds.some(id => this.pages.some(p => p.id === id)));
							if (following) {
								const at = this.pages.findIndex(p => following.pageIds.includes(p.id)); this.pages.splice(at, 0, ...next);
							} else this.pages.push(...next);
						}
						task.pageIds = next.map(p => p.id);
						task.status = 'success'; task.progress = 100; this.persistDraft();
					} catch (e) {
						if (task.status !== 'cancelled') { task.status = 'error'; task.error = e.response && e.response.data && e.response.data.msg || e.message || '上传失败'; }
					} finally { task.cancel = null; }
					if (epoch !== this.editRequestId) break;
				}
			} finally { this.uploading = false; }
		},
		cancelUpload(task) { if (task.status === 'success') return; task.status = 'cancelled'; if (task.cancel) task.cancel('cancelled'); },
		cancelAllUploads() { this.uploadQueue.forEach(task => this.cancelUpload(task)); },
		retryUpload(task) { if (this.saving || task.status !== 'error') return; task.status = 'queued'; task.progress = 0; this.drainUploads(); },
		clearCompletedUploads() { if (this.uploadQueue.some(task => ['queued', 'uploading', 'error'].includes(task.status))) { uni.showToast({ title: '请先完成、重试或取消上传', icon: 'none' }); return; } this.uploadQueue = this.uploadQueue.filter(task => ['queued', 'uploading', 'error'].includes(task.status)); },
		reorderPages({ from, to }) {
			if (this.saving || this.uploading || !this.editorReady) return;
			const page = this.pages.splice(from, 1)[0]; if (page) this.pages.splice(to, 0, page);
		},
		previewEpisode() {
			if (!this.pages.length) { uni.showToast({ title: '请先添加页面', icon: 'none' }); return; }
			const key = 'MangaPreview_' + Date.now() + '_' + Math.random().toString(36).slice(2);
			try {
				window.localStorage.setItem(key, this.editorSnapshot);
				uni.navigateTo({ url: '/pages/readers/mangaReader?previewKey=' + key });
			} catch (_) { uni.showToast({ title: '预览空间不足，请保存草稿后预览', icon: 'none' }); }
		},
		async prepareUpload(path, meta) {
			// 浏览器 File/Blob 可直接作为请求体，避免 base64 膨胀和额外拷贝。
			if (typeof Blob !== 'undefined') {
				if (meta && meta.file instanceof Blob) return { binary: true, blob: meta.file };
				if (meta instanceof Blob) return { binary: true, blob: meta };
			}
			try {
				const response = await fetch(path);
				if (!response.ok) throw new Error('读取图片文件失败');
				return { binary: true, blob: await response.blob() };
			} catch (error) {
				// 旧版 App-Plus 的 plus.io.FileReader 只支持 Data URL，保留兼容路径。
				// #ifdef APP-PLUS
				if (typeof plus !== 'undefined') return { binary: false, dataUrl: await this.pathToDataUrl(path, meta) };
				// #endif
				throw error;
			}
		},
		pathToDataUrl(path, meta) {
			// H5 下 tempFilePath 为 blob: URL；App 下为本地文件路径
			return new Promise((resolve, reject) => {
				// #ifdef APP-PLUS
				if (typeof plus !== 'undefined' && !/^blob:|^https?:/.test(path)) {
					plus.io.resolveLocalFileSystemURL(path, entry => entry.file(file => {
						const reader = new plus.io.FileReader(); reader.onloadend = e => resolve(e.target.result); reader.onerror = reject; reader.readAsDataURL(file);
					}, reject), reject); return;
				}
				// #endif
				const toDataUrl = (blob) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				};
				if (meta && meta.size !== undefined && !(path || '').startsWith('blob:')) {
					// App 端：tempFiles 项带 file 对象时优先使用
					if (meta.file instanceof Blob) {
						toDataUrl(meta.file);
						return;
					}
				}
				fetch(path).then((r) => {
					if (!r.ok) throw new Error('fetch failed');
					return r.blob();
				}).then(toDataUrl).catch(reject);
			});
		},
		normalizePageIds() {
			const used = new Set(); let id = Math.max(0, ...this.pages.map(p => Number(p.id) || 0));
			this.pages.forEach(p => { if (!Number.isInteger(Number(p.id)) || Number(p.id) <= 0 || used.has(Number(p.id))) p.id = ++id; else p.id = Number(p.id); used.add(p.id); });
		},
		removePage(idx) {
			if (this.uploading || this.saving || !this.editorReady) return;
			this.pages.splice(idx, 1);
			this.normalizePageIds();
		},
		movePage(idx, delta) {
			if (this.uploading || this.saving || !this.editorReady) return;
			const target = idx + delta;
			if (target < 0 || target >= this.pages.length) return;
			const moved = this.pages.splice(idx, 1)[0];
			this.pages.splice(target, 0, moved);
			this.normalizePageIds();
		},
		previewPage(idx) {
			const urls = this.pages.map((p) => p.url);
			if (!urls.length) return;
			uni.previewImage({ urls, current: urls[idx] });
		},
		// ===== 保存 =====
		saveEpisode(isDraft, confirmed = false) {
			if (this.saving || this.uploading || !this.editorReady) return;
			if (this.uploadQueue.some(task => task.status === 'error' || task.status === 'queued')) { uni.showToast({ title: '请重试或取消未完成的上传', icon: 'none' }); return; }
			if (!isDraft && !(this.novel.current_access && this.novel.current_access.can_publish_article)) {
				uni.showToast({ title: '没有发布权限', icon: 'none' }); return;
			}
			if (isDraft && this.editingPublished && !confirmed) {
				uni.showModal({ title: '转为草稿', content: '该话将从读者目录撤回，确定继续吗？', success: (r) => { if (r.confirm) this.saveEpisode(isDraft, true); } }); return;
			}
			const title = (this.editorTitle || '').trim();
			if (!title) {
				uni.showToast({ title: '请填写话数标题', icon: 'none' });
				return;
			}
			if (!isDraft && this.pages.length === 0) {
				uni.showToast({ title: '发布前请至少上传一页', icon: 'none' });
				return;
			}
			this.saving = true;
			this.persistDraft();
			const content = { pages: JSON.parse(JSON.stringify(this.pages)) };
			let request;
			if (this.editingArticleId) {
				request = axios.post(this.$baseUrl + '/essays/modify_article', {
					article_id: this.editingArticleId,
					title,
					content,
					article_type: this.editorType,
					is_draft: isDraft,
					expected_manga_revision: this.expectedRevision,
				}, { headers: this.authHeaders() });
			} else {
				const maxChapter = this.articles.reduce(
					(max, a) => Math.max(max, Number(a.article_chapter) || 0),
					0,
				);
				request = axios.post(this.$baseUrl + '/essays/add_article', {
					id: Number(this.novelId),
					title,
					content,
					article_chapter: maxChapter + 1,
					article_type: this.editorType,
					is_draft: isDraft,
				}, { headers: this.authHeaders() });
			}
			request.then(() => {
				this.saving = false;
				clearTimeout(this.draftTimer);
				try { window.localStorage.removeItem(this.draftKey()); } catch (_) {}
				this.baseline = this.editorSnapshot;
				uni.showToast({ title: isDraft ? '已存为草稿' : '已发布', icon: 'none' });
				this.view = 'list';
				this.loadArticles();
			}).catch((e) => {
				console.error('saveEpisode failed', e);
				this.saving = false;
				const msg = e && e.response && e.response.data && e.response.data.msg;
				uni.showToast({ title: msg || '保存失败，请稍后重试', icon: 'none' });
				if (e.response && e.response.status === 409) {
					uni.showModal({ title: '话数版本冲突', content: '本机草稿已保留。可继续编辑，或重新加载服务器最新版本。', confirmText: '重新加载', cancelText: '继续编辑', success: (r) => { if (r.confirm) this.startEditEpisode({ article_id: this.editingArticleId }, false); } });
				}
			});
		},
		// ===== 删除话数 =====
		deleteEpisode(item) {
			uni.showModal({
				title: '删除话数',
				content: '确定删除《' + item.title + '》吗？删除后可在回收站找回。',
				confirmColor: '#e05c3a',
				success: (r) => {
					if (!r.confirm) return;
					axios.post(this.$baseUrl + '/essays/delete_article', {
						id: item.article_id,
					}, { headers: this.authHeaders() }).then(() => {
						uni.showToast({ title: '已删除', icon: 'none' });
						this.loadArticles();
					}).catch((e) => {
						console.error('deleteEpisode failed', e);
						uni.showToast({ title: '删除失败', icon: 'none' });
					});
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/manga-theme.scss';
.manga-editor { @include manga-theme; min-height: 100vh; }
.nav-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 30; display: flex; align-items: center; height: 88rpx; padding-top: var(--manga-safe-top); background: var(--manga-card); border-bottom: 1rpx solid var(--manga-line); }
.nav-back { width: 88rpx; text-align: center; flex-shrink: 0; }.nav-back-icon { font-size: 54rpx; }.nav-title { font-size: 30rpx; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 28rpx; }
.page-body { height: 100vh; padding-top: calc(var(--manga-safe-top) + 108rpx); box-sizing: border-box; }
.work-head,.section-card { margin: 0 24rpx 24rpx; padding: 28rpx; border-radius: 24rpx; background: var(--manga-card); }
.work-head { display: flex; gap: 24rpx; }.work-cover { object-fit: cover; width: 160rpx; height: 224rpx; border-radius: 12rpx; flex-shrink: 0; }.work-meta { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 12rpx; }.work-name { width: 100%; font-size: 34rpx; font-weight: 700; }.work-tags { width: 100%; }.work-count { width: 100%; font-size: 24rpx; color: var(--manga-muted); }
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }.section-title { font-size: 30rpx; font-weight: 600; }.new-btn { display: inline-block; padding: 12rpx 24rpx; border-radius: 60rpx; color: #fff; background: var(--manga-accent); font-size: 24rpx; }
.empty-tip { padding: 28rpx 30rpx; text-align: center; color: var(--manga-muted); font-size: 24rpx; line-height: 40rpx; }
.article-row { display: flex; align-items: center; padding: 28rpx 0; border-bottom: 1rpx solid var(--manga-line); }.article-row:last-child { border: 0; }.article-no { width: 60rpx; color: var(--manga-muted); font-size: 24rpx; flex-shrink: 0; }.article-main { flex: 1; min-width: 0; }.article-title { font-size: 28rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }.article-date { color: var(--manga-muted); font-size: 22rpx; }.draft-badge,.type-badge { font-size: 20rpx; color: var(--manga-accent); background: var(--manga-tint); padding: 4rpx 10rpx; border-radius: 8rpx; margin-left: 12rpx; }.type-badge { color: var(--manga-muted); background: var(--manga-bg); }.del-btn { color: #d46a5c; padding: 16rpx 0 16rpx 20rpx; font-size: 22rpx; }
.field-row { margin-bottom: 28rpx; }.field-row:last-child { margin-bottom: 0; }.field-label { display: block; font-size: 24rpx; color: var(--manga-muted); margin-bottom: 16rpx; }.field-input { width: 100%; height: 84rpx; padding: 0 22rpx; box-sizing: border-box; font-size: 28rpx; border-radius: 14rpx; background: var(--manga-bg); color: var(--manga-text); }
.radio-row { display: flex; gap: 16rpx; }.radio-item { flex: 1; padding: 20rpx 8rpx; border-radius: 14rpx; border: 2rpx solid var(--manga-line); text-align: center; font-size: 24rpx; }.radio-item.active { color: var(--manga-accent); background: var(--manga-tint); border-color: var(--manga-accent); }
.page-toolbar { display: flex; justify-content: space-between; margin-bottom: 24rpx; font-size: 24rpx; color: var(--manga-accent); }.page-toolbar text { padding: 10rpx 0; }
.page-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16rpx; }
.page-cell { position: relative; height: 230rpx; border-radius: 14rpx; overflow: hidden; background: var(--manga-bg); }.page-thumb { object-fit: cover; width: 100%; height: 100%; }.page-no { position: absolute; left: 10rpx; top: 10rpx; padding: 4rpx 10rpx; font-size: 20rpx; background: #0008; color: #fff; border-radius: 8rpx; }.page-del { position: absolute; top: 8rpx; right: 8rpx; width: 40rpx; height: 40rpx; line-height: 40rpx; text-align: center; border-radius: 50%; background: #0008; color: #fff; font-size: 22rpx; }
.page-moves { position: absolute; bottom: 0; left: 0; right: 0; display: flex; background: #0009; }.move-btn { flex: 1; text-align: center; color: #fff; font-size: 22rpx; padding: 12rpx 0; }.move-btn.disabled { opacity: .4; }.add-cell { display: flex; align-items: center; justify-content: center; border: 2rpx dashed var(--manga-line); }.add-icon { color: var(--manga-muted); font-size: 56rpx; }
.upload-list { background: var(--manga-bg); border-radius: 18rpx; padding: 20rpx; margin-bottom: 24rpx; }.queue-head { display: flex; justify-content: space-between; gap: 12rpx; font-size: 22rpx; color: var(--manga-muted); }.upload-row { display: flex; gap: 16rpx; align-items: center; padding: 20rpx 0; }.upload-info { flex: 1; min-width: 0; }.upload-name { display: block; font-size: 24rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }.upload-status,.queue-note { display: block; font-size: 20rpx; color: var(--manga-muted); margin: 8rpx 0; line-height: 32rpx; }.upload-track { height: 6rpx; background: var(--manga-line); border-radius: 8rpx; overflow: hidden; }.upload-track view { height: 100%; background: var(--manga-accent); }.queue-action { font-size: 22rpx; color: var(--manga-accent); padding: 10rpx 0; }
.bottom-space { height: calc(160rpx + var(--manga-safe-bottom)); }.action-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 30; display: flex; gap: 16rpx; padding: 20rpx 24rpx calc(20rpx + var(--manga-safe-bottom)); background: var(--manga-card); border-top: 1rpx solid var(--manga-line); }
.act-btn { flex: 1; height: 80rpx; line-height: 80rpx; border-radius: 60rpx; text-align: center; font-size: 25rpx; border: 1rpx solid var(--manga-line); }.act-btn.draft { color: var(--manga-accent); background: var(--manga-tint); border: 0; }.act-btn.publish { color: #fff; background: var(--manga-accent); border: 0; font-weight: 600; }.disabled { opacity: .5; }
.manga-editor { line-height: 1.5; }
.nav-bar { height: 96rpx; }
button.nav-back { display: grid; place-items: center; width: 96rpx; height: 88rpx; font-size: 32rpx; }
.page-body { padding-top: calc(var(--manga-safe-top) + 116rpx); }
.work-head,.section-card { box-shadow: var(--manga-shadow); }
.work-head { align-items: center; }
.work-meta { display: flex; flex-direction: column; align-items: flex-start; gap: 10rpx; }
.work-name { line-height: 1.3; }
.work-tags,.work-actions { display: flex; flex-wrap: wrap; gap: 10rpx; width: 100%; }
.status-chip { padding: 4rpx 14rpx; border-radius: 100rpx; background: var(--manga-tint); color: var(--manga-accent); font-size: 20rpx; font-weight: 600; }
button.secondary-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6rpx; min-height: 68rpx; padding: 0 16rpx; border: 1rpx solid var(--manga-line); border-radius: 12rpx; font-size: 22rpx; }
button.new-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6rpx; min-height: 76rpx; padding: 0 20rpx; border-radius: 100rpx; background: var(--manga-action); color: #fff; font-size: 23rpx; font-weight: 700; white-space: nowrap; }
.section-head { min-height: 76rpx; }
.article-row { min-height: 110rpx; gap: 12rpx; }
.article-row:hover { background: var(--manga-bg); }
.article-no { color: var(--manga-accent); font-weight: 700; }
button.del-btn { display: grid; place-items: center; width: 72rpx; height: 72rpx; padding: 0; color: #a4382b; font-size: 25rpx; }
.field-label { color: var(--manga-text); font-weight: 600; }
.field-input { border: 1rpx solid var(--manga-line); }
.field-input:focus { border-color: var(--manga-accent); outline: 2px solid var(--manga-accent); outline-offset: 2px; }
button.radio-item { display: grid; place-items: center; min-height: 92rpx; padding: 12rpx 8rpx; border: 2rpx solid var(--manga-line); border-radius: 14rpx; font-size: 23rpx; }
button.radio-item.active { color: var(--manga-accent); background: var(--manga-tint); border-color: var(--manga-accent); font-weight: 700; }
.page-toolbar { gap: 10rpx; }
.page-toolbar button { display: inline-flex; align-items: center; justify-content: center; gap: 8rpx; min-height: 76rpx; padding: 0 12rpx; color: var(--manga-accent); font-size: 23rpx; font-weight: 600; }
.queue-head { align-items: center; font-size: 24rpx; font-weight: 700; }
.queue-tools { display: flex; gap: 6rpx; }
.queue-tools button { min-height: 68rpx; padding: 0 10rpx; color: var(--manga-accent); font-size: 21rpx; }
button.queue-action { min-width: 68rpx; min-height: 68rpx; color: var(--manga-accent); font-size: 22rpx; }
.upload-track view { background: var(--manga-action); transition: width .2s ease; }
.page-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
.page-cell { height: 320rpx; }
.page-preview { display: block; width: 100%; height: 100%; }
button.page-del { display: grid; place-items: center; width: 88rpx; height: 88rpx; top: -12rpx; right: -12rpx; padding: 0; background: transparent; color: #fff; font-size: 24rpx; }
// 保留 88rpx 触控热区，可见圆圈缩小，避免遮挡缩略图
button.page-del::before { content: ""; position: absolute; inset: 20rpx; border-radius: 50%; background: rgba(0,0,0,.62); }
button.page-del .manga-icon { position: relative; }
.page-moves { min-height: 88rpx; }
button.move-btn { display: grid; place-items: center; flex: 1; min-height: 88rpx; padding: 0; color: #fff; font-size: 24rpx; }
button.add-cell { display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10rpx; width: 100%; height: 320rpx; border: 2rpx dashed var(--manga-line); border-radius: 14rpx; color: var(--manga-accent); font-size: 24rpx; }
button.add-cell .manga-icon { font-size: 34rpx; }
button.act-btn { display: grid; place-items: center; min-height: 88rpx; height: 88rpx; line-height: 1.3; border: 1rpx solid var(--manga-line); border-radius: 100rpx; font-size: 23rpx; }
button.act-btn.draft { border: 0; background: var(--manga-tint); color: var(--manga-accent); }
button.act-btn.publish { border: 0; background: var(--manga-action); color: #fff; font-weight: 700; }
@media (min-width: 800px) { .work-head,.section-card { max-width: 820px; margin-left: auto; margin-right: auto; } }
</style>
