<template>
  <div class="mangaWrapper" v-dark>
    <div class="outer"><button v-manga-a11y class="portal" type="button" @click="openCreateDialog"><span class="portal-kicker">漫画创作</span><span class="subtitle">分镜落笔，画面有声</span><span class="newManga">创建一部全新的漫画 <manga-icon name="next" /></span></button></div>
    <div class="workspace-head"><span>我的漫画</span><span>{{ mangas.length }} 部作品</span></div>
    <div v-if="loading" class="workspace-status" role="status">正在加载作品…</div>
    <div v-else-if="loadError" class="workspace-status" role="alert">加载失败 <button v-manga-a11y type="button" @click="loadMangas"><manga-icon name="retry" />重试</button></div>
    <div v-else-if="!mangas.length" class="empty-state"><manga-icon name="book" /><strong>漫画架还是空的</strong><span>从一个想法开始，创建你的第一部作品。</span><button v-manga-a11y type="button" @click="openCreateDialog"><manga-icon name="add" />创建漫画</button></div>
    <div class="mangaCard" v-for="manga in mangas" :key="manga.novel_id" v-dark>
      <button v-manga-a11y class="card-body" type="button" :aria-label="'查看《' + manga.name + '》的读者详情'" @click="viewDetail(manga)">
        <image lazy-load class="manga-cover" :src="manga.picUrl || $backupResources.bookCover" mode="aspectFill" :alt="manga.name + '封面'" />
        <div class="manga-info">
          <div class="manga-title">{{ manga.name }}</div>
          <div class="manga-tags"><span class="status-chip">漫画</span><span class="status-chip" :class="{ private: Number(manga.is_personal) === 1 }">{{ Number(manga.is_personal) === 1 ? '私密' : '公开' }}</span><span class="status-chip" v-if="Number(manga.is_complete) === 1">已完结</span><span class="status-chip" v-if="hasActiveCollaborators(manga)">协作作品</span><span class="status-chip" v-if="manga.collaborator_role">协作成员</span></div>
          <div class="manga-intro">{{ manga.content || '还没有填写简介' }}</div>
          <div class="manga-date">更新于 {{ formatDate(manga.update_time) }}</div>
        </div>
      </button>
      <div class="card-actions">
        <button v-manga-a11y class="primary-action" type="button" @click="manageEpisodes(manga)"><manga-icon name="book" /><text>话数管理</text></button>
        <button v-manga-a11y type="button" @click="openSettings(manga)"><manga-icon name="settings" /><text>{{ isOwner(manga) ? '作品设置' : '协作设置' }}</text></button>
        <button v-manga-a11y type="button" @click="previewManga(manga)"><manga-icon name="preview" /><text>预览</text></button>
      </div>
    </div>
    <view class="create-mask" v-if="showCreateDialog" :style="maskStyle" @click.self="closeCreateDialog">
      <view class="create-panel" role="dialog" aria-modal="true" aria-label="创建漫画">
        <view class="create-header"><text class="create-title">创建漫画</text><button v-manga-a11y class="create-close" type="button" aria-label="关闭创建窗口" @click="closeCreateDialog"><manga-icon name="close" /></button></view>
        <view class="create-field"><label class="field-label" for="new-manga-name">作品名称</label><input id="new-manga-name" class="field-input" v-model="createForm.name" maxlength="50" placeholder="给你的漫画起个名字" /></view>
        <view class="create-field"><label class="field-label" for="new-manga-intro">简介</label><textarea id="new-manga-intro" class="field-textarea" v-model="createForm.content" maxlength="500" placeholder="一句话介绍这部漫画（稍后可修改）"></textarea></view>
        <view class="create-tip">创建后即可上传条漫或页漫页面。</view>
        <view class="create-actions"><button v-manga-a11y class="create-cancel" type="button" @click="closeCreateDialog">取消</button><button v-manga-a11y="creating || !createForm.name.trim()" class="create-confirm" type="button" :disabled="creating || !createForm.name.trim()" @click="createManga">{{ creating ? '创建中…' : '创建并开始' }}</button></view>
      </view>
    </view>
    <div class="bottom"></div>
  </div>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
import axios from 'axios';
import darkModeMixin from '@/mixins/dark-mode.js';
import MangaIcon from '@/components/manga-icon.vue';

export default {
  directives: { mangaA11y: MangaA11y },
	name: 'mangaPage',
	components: { MangaIcon },
	mixins: [darkModeMixin],
	props: {
		// 所在滑动轨道的当前激活栏索引（轨道 transform 会成为 fixed 元素的包含块，需要补偿）
		activeIndex: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			mangas: [],
			loading: true,
			loadError: false,
			showCreateDialog: false,
			creating: false,
			createForm: {
				name: '',
				content: '',
			},
		};
	},
	computed: {
		maskStyle() {
			// 包含块是滑动轨道（宽 300%），把弹窗平移回当前可视栏
			return {
				left: (this.activeIndex * 100) + 'vw',
				width: '100vw',
			};
		},
	},
	methods: {
		isOwner(manga) {
			return manga.current_access && manga.current_access.access_role === 'owner';
		},
		openSettings(manga) {
			uni.navigateTo({ url: '/pages/writers/mangaSettings?id=' + manga.novel_id });
		},
		previewManga(manga) {
			uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + manga.novel_id + '&preview=1' });
		},
		viewDetail(manga) {
			uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + manga.novel_id + (Number(manga.is_personal) === 1 ? '&preview=1' : '') });
		},
		getToken() {
			let tk = JSON.parse(window.localStorage.getItem('token'));
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
			return String(value).slice(0, 10);
		},
		hasActiveCollaborators(manga) {
			return Number(manga.has_active_collaborators) === 1;
		},
		refreshPage() {
			this.loadMangas();
		},
		loadMangas() {
			this.loading = true; this.loadError = false;
			axios.get(this.$baseUrl + '/essays/get_novels_of', {
				headers: this.authHeaders(),
			}).then((res) => {
				this.mangas = (res.data || []).filter((n) => n.novel_type === 'manga');
				this.loading = false;
			}).catch((e) => {
				this.loadError = true;
				this.loading = false;
			});
		},
		openCreateDialog() {
			this.createForm = { name: '', content: '' };
			this.showCreateDialog = true;
		},
		closeCreateDialog() {
			if (this.creating) return;
			this.showCreateDialog = false;
		},
		createManga() {
			const name = (this.createForm.name || '').trim();
			if (!name || this.creating) return;
			this.creating = true;
			axios.post(this.$baseUrl + '/essays/add_novel', {
				name,
				content: (this.createForm.content || '').trim(),
				novel_type: 'manga',
			}, { headers: this.authHeaders() }).then((response) => {
				this.creating = false;
				this.showCreateDialog = false;
				uni.showToast({ title: '漫画创建成功', icon: 'none' });
				this.loadMangas();
				this.$emit('refreshed');
				const insertId = response.data && response.data.insertId;
				if (insertId) {
					setTimeout(() => {
						uni.navigateTo({ url: '/pages/writers/mangaEditor?id=' + insertId });
					}, 600);
				}
			}).catch((e) => {
				console.error('createManga failed', e);
				this.creating = false;
				uni.showToast({ title: '创建失败，请稍后重试', icon: 'none' });
			});
		},
		manageEpisodes(manga) {
			uni.navigateTo({ url: '/pages/writers/mangaEditor?id=' + manga.novel_id });
		},
	},
	mounted() {
		this.refreshPage();
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/manga-theme.scss';
.mangaWrapper { @include manga-theme; min-height: 100vh; box-sizing: border-box; padding-top: calc(44px + var(--loghome-safe-top, 0px)); }
.outer { padding: 0 24rpx; }
button.portal { display: flex; align-items: flex-start; flex-direction: column; justify-content: center; width: 100%; min-height: 174rpx; margin: 20rpx 0 34rpx; padding: 28rpx 38rpx; border-radius: 22rpx; background-color: #3a2b26; background-image: url("@/static/images/manga-create-banner-background-v1.png"); background-position: right center; background-size: cover; background-repeat: no-repeat; color: #fff; text-align: left; box-shadow: var(--manga-shadow); }
.portal-kicker { font-size: 19rpx; letter-spacing: .12em; font-weight: 700; opacity: .84; }
.subtitle { margin-top: 8rpx; font-size: 32rpx; font-weight: 750; letter-spacing: .02em; }
.newManga { display: inline-flex; align-items: center; gap: 8rpx; margin-top: 12rpx; font-size: 23rpx; opacity: .96; }
.workspace-head { display: flex; align-items: baseline; justify-content: space-between; margin: 0 30rpx 20rpx; font-size: 32rpx; font-weight: 700; }
.workspace-head span:last-child { color: var(--manga-muted); font-size: 23rpx; font-weight: 400; }
.workspace-status { display: flex; align-items: center; justify-content: center; gap: 20rpx; padding: 50rpx 24rpx; color: var(--manga-muted); font-size: 25rpx; }
.workspace-status button { display: inline-flex; align-items: center; gap: 6rpx; min-height: 76rpx; color: var(--manga-accent); }
.empty-state { display: flex; align-items: center; flex-direction: column; gap: 14rpx; margin: 0 24rpx; padding: 70rpx 30rpx; border-radius: 24rpx; background: var(--manga-card); color: var(--manga-muted); text-align: center; font-size: 23rpx; }
.empty-state > .manga-icon { font-size: 72rpx; color: var(--manga-accent); }
.empty-state strong { color: var(--manga-text); font-size: 28rpx; }
.empty-state button { display: inline-flex; align-items: center; gap: 8rpx; min-height: 80rpx; margin-top: 12rpx; padding: 0 28rpx; border-radius: 100rpx; background: var(--manga-action); color: #fff; font-weight: 700; }
.mangaCard { margin: 0 24rpx 24rpx; padding: 28rpx; border-radius: 24rpx; background: var(--manga-card); box-shadow: var(--manga-shadow); animation: card-in .22s ease both; }
button.card-body { box-sizing: border-box; display: flex; gap: 22rpx; width: 100%; margin: 0; padding: 0; border: 0; border-radius: 14rpx; background: transparent; text-align: left; white-space: normal; line-height: normal; transition: background-color .18s ease, transform .18s ease; }
button.card-body::after { display: none; }
button.card-body:active { background: var(--manga-tint); transform: scale(.985); }
@media (hover: hover) { button.card-body:hover { background: var(--manga-bg); } }
@media (prefers-reduced-motion: reduce) { button.card-body { transition: none; } }
.manga-cover { width: 150rpx; height: 210rpx; flex: none; border-radius: 12rpx; object-fit: cover; background: var(--manga-bg); }
.manga-info { flex: 1; min-width: 0; }
.manga-title { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; color: var(--manga-text); font-size: 31rpx; font-weight: 700; line-height: 1.3; }
.manga-tags { display: flex; flex-wrap: wrap; gap: 8rpx; margin-top: 12rpx; }
.status-chip { padding: 4rpx 12rpx; border-radius: 100rpx; background: var(--manga-tint); color: var(--manga-accent); font-size: 18rpx; font-weight: 600; }
.status-chip.private { background: var(--manga-bg); color: var(--manga-muted); }
.manga-intro { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; margin-top: 12rpx; color: var(--manga-muted); font-size: 22rpx; line-height: 1.5; }
.manga-date { margin-top: 10rpx; color: var(--manga-muted); font-size: 20rpx; }
.card-actions { display: grid; grid-template-columns: 1.25fr 1fr .75fr; gap: 10rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 1rpx solid var(--manga-line); }
.card-actions button { box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8rpx; min-height: 88rpx; padding: 0 8rpx; border: 1rpx solid var(--manga-line); border-radius: 12rpx; color: var(--manga-text); font-size: 26rpx; font-weight: 600; line-height: 1.2; text-align: center; white-space: nowrap; }
.card-actions button.primary-action { border-color: transparent; background: var(--manga-action); color: #fff; }
.card-actions .manga-icon { font-size: 26rpx; }
.card-actions text { display: block; line-height: 1.2; white-space: nowrap; }
.create-mask { position: fixed; top: 0; height: 100vh; z-index: 300; display: flex; align-items: center; justify-content: center; background: rgba(7,10,12,.55); }
.create-panel { width: min(86%, 640rpx); box-sizing: border-box; padding: 32rpx; border-radius: 24rpx; background: var(--manga-card); color: var(--manga-text); box-shadow: 0 30rpx 90rpx rgba(0,0,0,.18); animation: panel-in .2s ease both; }
.create-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18rpx; }
.create-title { font-size: 31rpx; font-weight: 700; }
.create-close { display: grid; place-items: center; width: 76rpx; height: 76rpx; font-size: 26rpx; }
.create-field { margin-bottom: 20rpx; }
.field-label { display: block; margin-bottom: 9rpx; font-size: 23rpx; font-weight: 600; }
.field-input,.field-textarea { width: 100%; box-sizing: border-box; padding: 14rpx 18rpx; border: 1rpx solid var(--manga-line); border-radius: 12rpx; background: var(--manga-bg); color: var(--manga-text); font-size: 25rpx; }
.field-input { height: 84rpx; }.field-textarea { height: 160rpx; line-height: 1.5; }
.field-input:focus,.field-textarea:focus { border-color: var(--manga-accent); outline: 2px solid var(--manga-accent); outline-offset: 2px; }
.create-tip { margin: 2rpx 0 22rpx; color: var(--manga-muted); font-size: 21rpx; }
.create-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16rpx; }
.create-actions button { box-sizing: border-box; display: flex; align-items: center; justify-content: center; width: 100%; min-width: 0; min-height: 88rpx; margin: 0; padding: 0 12rpx; border-radius: 14rpx; font-size: 25rpx; font-weight: 600; line-height: 1.2; text-align: center; white-space: nowrap; }
.create-actions button::after { display: none; }
.create-cancel { border: 1rpx solid var(--manga-line); background: var(--manga-card); color: var(--manga-text); }.create-confirm { border: 1rpx solid transparent; background: var(--manga-action); color: #fff; }
.bottom { height: 80px; }
@keyframes card-in { from { opacity: .5; transform: translateY(8rpx); } to { opacity: 1; transform: translateY(0); } }
@keyframes panel-in { from { opacity: .5; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .mangaCard,.create-panel { animation: none; } }
@media (min-width: 900px) { .outer,.workspace-head,.mangaCard { max-width: 820px; margin-left: auto; margin-right: auto; } }
</style>
