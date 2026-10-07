<template>
  <div class="worldWrapper" v-dark>
    <div class="outer"><button v-manga-a11y class="portal" type="button" @click="createNewWorld"><span class="portal-kicker">世界设定</span><span class="subtitle">共启创世之门</span><span class="newWorld">点击创建一个全新的世界 <manga-icon name="next" /></span></button></div>
    <div class="workspace-head"><span>我的世界</span><span>{{ worlds.length }} 个世界</span></div>
    <div v-if="loading" class="workspace-status" role="status">正在加载世界…</div>
    <div v-else-if="loadError" class="workspace-status" role="alert">加载失败 <button v-manga-a11y type="button" @click="refreshPage"><manga-icon name="retry" />重试</button></div>
    <div v-else-if="!worlds.length" class="empty-state"><manga-icon name="book" /><strong>这里还什么都没有喔</strong><span>创建你的第一个世界</span><button v-manga-a11y type="button" @click="createNewWorld"><manga-icon name="add" />创建世界</button></div>
    <div class="worldCard" v-for="world in worlds" :key="world.world_id || world.novel_id" v-dark>
      <button v-manga-a11y class="card-body" type="button" :aria-label="(world.is_personal ? '编辑《' + world.name + '》的设定' : '进入《' + world.name + '》')" @click="openWorld(world)">
        <image lazy-load class="world-cover" :src="world.picUrl || $backupResources.bookCover" mode="aspectFill" :alt="world.name" />
        <div class="world-info">
          <div class="world-title">{{ world.name }}</div>
          <div class="world-tags"><span class="status-chip" :class="{ private: world.is_personal }">{{ world.is_personal ? '私密' : '公开' }}</span><span class="status-chip" v-if="!world.is_personal && world.allow_fork">允许二创</span><span class="status-chip" v-if="showCollaborativeTag(world)">协作作品</span></div>
          <div class="world-intro">{{ world.content || '还没有填写简介' }}</div>
        </div>
      </button>
      <div class="card-actions">
        <button v-manga-a11y class="primary-action" type="button" @click="editWorld(world.novel_id, world.world_id)"><manga-icon name="book" /><text>{{ getEditButtonText(world) }}</text></button>
        <button v-manga-a11y v-if="!world.is_personal" type="button" @click="enterWorld(world.world_id)"><manga-icon name="preview" /><text>进入设定</text></button>
      </div>
    </div>
    <div class="bottom"></div>
		<view v-if="showCreateDialog" v-manga-portal class="create-mask" :class="{ 'dark-mode': isDarkMode }"
			@click.self="closeCreateDialog" @keydown.esc.stop.prevent="closeCreateDialog"
			@touchstart.stop @touchmove.self.prevent @touchend.stop>
			<view class="create-panel" role="dialog" aria-modal="true" aria-labelledby="create-world-title" :aria-busy="String(creating)">
				<view class="create-header">
					<text id="create-world-title" class="create-title">创建世界</text>
					<button v-manga-a11y="creating" class="create-close" type="button" aria-label="关闭创建窗口" :disabled="creating" @click="closeCreateDialog"><manga-icon name="close" /></button>
				</view>
				<view class="create-field">
					<label class="field-label" for="new-world-name">世界名称</label>
					<input id="new-world-name" class="field-input" v-model="createForm.name" maxlength="50" :disabled="creating"
						placeholder="给你的世界起个名字" confirm-type="done" @confirm="createWorld" />
				</view>
				<view class="create-tip">创建后即可编辑世界简介、角色与其他设定。</view>
				<view class="create-actions">
					<button v-manga-a11y="creating" class="create-cancel" type="button" :disabled="creating" @click="closeCreateDialog">取消</button>
					<button v-manga-a11y="creating || !createForm.name.trim()" class="create-confirm" type="button" :disabled="creating || !createForm.name.trim()" @click="createWorld">{{ creating ? '创建中…' : '创建世界' }}</button>
				</view>
			</view>
		</view>
	</div>

</template>

<script>
	import axios from "axios";
	import darkModeMixin from '@/mixins/dark-mode.js';
	import MangaIcon from '@/components/manga-icon.vue';
	import MangaA11y from '@/common/manga-a11y.js';
	import MangaPortal from '@/common/manga-portal.js';
	export default {
		components: { MangaIcon },
		directives: { mangaA11y: MangaA11y, mangaPortal: MangaPortal },
		mixins: [darkModeMixin],
		data() {
			return {
				worlds: [],
				loading: true,
				loadError: false,
				showCreateDialog: false,
				creating: false,
				createForm: { name: '' },
			}
		},
		methods: {
			isWorldOwner(world) {
				return !!(world && (world.is_owner === true || world.access_role === 'owner' || !world.access_role));
			},
			showCollaborativeTag(world) {
				if (!world) return false;
				return (
					world.access_role === 'collaborator' ||
					world.is_collaborator === true ||
					Number(world.has_active_collaborators || 0) === 1
				);
			},
			getEditButtonText(world) {
				return this.isWorldOwner(world) ? '编辑设定' : '协作设定';
			},
			openWorld(world) {
				if (world.is_personal) {
					this.editWorld(world.novel_id, world.world_id);
				} else {
					this.enterWorld(world.world_id);
				}
			},
			createNewWorld() {
				if (this.creating) return;
				this.createForm = { name: '' };
				this.showCreateDialog = true;
			},
			closeCreateDialog() {
				if (this.creating) return;
				this.showCreateDialog = false;
			},
			async createWorld() {
				const name = (this.createForm.name || '').trim();
				if (!name || this.creating) return;
				this.creating = true;
				try {
					const token = JSON.parse(window.localStorage.getItem('token'));
					if (!token || !token.tk) {
						uni.showToast({ title: '请先登录后再创建世界', icon: 'none' });
						return;
					}
					await axios.get(this.$baseUrl + '/world/create_world', {
						params: { world_name: name },
						headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token.tk },
					});
					this.showCreateDialog = false;
					uni.showToast({ title: '创建成功', icon: 'none', duration: 2000 });
					this.refreshPage();
				} catch (error) {
					uni.showToast({ title: '创建失败，请稍后重试', icon: 'none', duration: 2000 });
				} finally {
					this.creating = false;
				}
			},
			refreshPage(){
				this.loading = true;
				this.loadError = false;
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/world/get_my_worlds', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}).then((res) => {
					_this.worlds = res.data;
					_this.loading = false;
				}).catch(function(error) {
					_this.loadError = true;
					_this.loading = false;
				})
			},
			enterWorld(world_id){
				uni.navigateTo({
					url: "../pages/worlds/worldPage?id=" + world_id
				})
			},
			editWorld(uid,world_id) {
				uni.navigateTo({
					url: "../pages/writers/allArticles?id=" + uid + '&worldId=' + world_id
				})
			},
		},
		mounted(){
			this.refreshPage();
		}
	}
</script>

<style scoped lang="scss">
	@import '@/common/manga-theme.scss';

	.worldWrapper { @include manga-theme; min-height: 100vh; box-sizing: border-box; padding-top: calc(44px + var(--loghome-safe-top, 0px)); }
	.outer { padding: 0 24rpx; }
	button.portal { display: flex; align-items: flex-start; flex-direction: column; justify-content: center; width: 100%; min-height: 174rpx; margin: 20rpx 0 34rpx; padding: 28rpx 38rpx; border-radius: 22rpx; background-color: #3a2b26; background-image: url("@/static/worldPage/portalBackground.jpg"); background-position: right center; background-size: cover; background-repeat: no-repeat; color: #fff; text-align: left; box-shadow: var(--manga-shadow); }
	.portal-kicker { font-size: 19rpx; letter-spacing: .12em; font-weight: 700; opacity: .84; text-shadow: 0 1rpx 6rpx rgba(0, 0, 0, .35); }
	.subtitle { margin-top: 8rpx; font-size: 32rpx; font-weight: 750; letter-spacing: .02em; text-shadow: 0 1rpx 6rpx rgba(0, 0, 0, .35); }
	.newWorld { display: inline-flex; align-items: center; gap: 8rpx; margin-top: 12rpx; font-size: 23rpx; opacity: .96; }
	.workspace-head { display: flex; align-items: baseline; justify-content: space-between; margin: 0 30rpx 20rpx; font-size: 32rpx; font-weight: 700; }
	.workspace-head span:last-child { color: var(--manga-muted); font-size: 23rpx; font-weight: 400; }
	.workspace-status { display: flex; align-items: center; justify-content: center; gap: 20rpx; padding: 50rpx 24rpx; color: var(--manga-muted); font-size: 25rpx; }
	.workspace-status button { display: inline-flex; align-items: center; gap: 6rpx; min-height: 76rpx; color: var(--manga-accent); }
	.empty-state { display: flex; align-items: center; flex-direction: column; gap: 14rpx; margin: 0 24rpx; padding: 70rpx 30rpx; border-radius: 24rpx; background: var(--manga-card); color: var(--manga-muted); text-align: center; font-size: 23rpx; }
	.empty-state > .manga-icon { font-size: 72rpx; color: var(--manga-accent); }
	.empty-state strong { color: var(--manga-text); font-size: 28rpx; }
	.empty-state button { display: inline-flex; align-items: center; gap: 8rpx; min-height: 80rpx; margin-top: 12rpx; padding: 0 28rpx; border-radius: 100rpx; background: var(--manga-action); color: #fff; font-weight: 700; }
	.worldCard { margin: 0 24rpx 24rpx; padding: 28rpx; border-radius: 24rpx; background: var(--manga-card); box-shadow: var(--manga-shadow); animation: card-in .22s ease both; }
	button.card-body { box-sizing: border-box; display: flex; gap: 22rpx; width: 100%; margin: 0; padding: 0; border: 0; border-radius: 14rpx; background: transparent; text-align: left; white-space: normal; line-height: normal; transition: background-color .18s ease, transform .18s ease; }
	button.card-body::after { display: none; }
	button.card-body:active { background: var(--manga-tint); transform: scale(.985); }
	@media (hover: hover) { button.card-body:hover { background: var(--manga-bg); } }
	@media (prefers-reduced-motion: reduce) { button.card-body { transition: none; } }
	.world-cover { width: 150rpx; height: 210rpx; flex: none; border-radius: 12rpx; object-fit: cover; background: var(--manga-bg); }
	.world-info { flex: 1; min-width: 0; }
	.world-title { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; color: var(--manga-text); font-size: 31rpx; font-weight: 700; line-height: 1.3; }
	.world-tags { display: flex; flex-wrap: wrap; gap: 8rpx; margin-top: 12rpx; }
	.status-chip { padding: 4rpx 12rpx; border-radius: 100rpx; background: var(--manga-tint); color: var(--manga-accent); font-size: 18rpx; font-weight: 600; }
	.status-chip.private { background: var(--manga-bg); color: var(--manga-muted); }
	.world-intro { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; margin-top: 12rpx; color: var(--manga-muted); font-size: 22rpx; line-height: 1.5; }
	.card-actions { display: flex; gap: 10rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 1rpx solid var(--manga-line); }
	.card-actions button { box-sizing: border-box; flex: 1; display: flex; align-items: center; justify-content: center; gap: 8rpx; min-height: 88rpx; padding: 0 8rpx; border: 1rpx solid var(--manga-line); border-radius: 12rpx; color: var(--manga-text); font-size: 26rpx; font-weight: 600; line-height: 1.2; text-align: center; white-space: nowrap; }
	.card-actions button.primary-action { border-color: transparent; background: var(--manga-action); color: #fff; }
	.card-actions .manga-icon { font-size: 26rpx; }
	.card-actions text { display: block; line-height: 1.2; white-space: nowrap; }
	.bottom { height: 80px; }

	.create-mask {
		@include manga-theme;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 3100;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: calc(24rpx + var(--manga-safe-top)) 0 calc(24rpx + var(--manga-safe-bottom));
		background: rgba(7, 10, 12, .55);
	}
	.create-panel { width: min(86%, 640rpx); max-height: 100%; overflow-y: auto; box-sizing: border-box; padding: 32rpx; border-radius: 24rpx; background: var(--manga-card); color: var(--manga-text); box-shadow: 0 30rpx 90rpx rgba(0,0,0,.18); animation: world-panel-in .2s ease both; }
	.create-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18rpx; }
	.create-title { font-size: 31rpx; font-weight: 700; }
	.create-close { display: grid; place-items: center; width: 76rpx; height: 76rpx; flex: none; font-size: 26rpx; }
	.create-field { margin-bottom: 20rpx; }
	.field-label { display: block; margin-bottom: 9rpx; font-size: 23rpx; font-weight: 600; }
	.field-input { width: 100%; height: 84rpx; box-sizing: border-box; padding: 14rpx 18rpx; border: 1rpx solid var(--manga-line); border-radius: 12rpx; background: var(--manga-bg); color: var(--manga-text); font-size: 25rpx; }
	.field-input:focus { border-color: var(--manga-accent); outline: 2px solid var(--manga-accent); outline-offset: 2px; }
	.create-tip { margin: 2rpx 0 22rpx; color: var(--manga-muted); font-size: 21rpx; }
	.create-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16rpx; }
	.create-actions button { box-sizing: border-box; display: flex; align-items: center; justify-content: center; width: 100%; min-width: 0; min-height: 88rpx; margin: 0; padding: 0 12rpx; border-radius: 14rpx; font-size: 25rpx; font-weight: 600; line-height: 1.2; text-align: center; white-space: nowrap; }
	.create-cancel { border: 1rpx solid var(--manga-line); background: var(--manga-card); color: var(--manga-text); }
	.create-confirm { border: 1rpx solid transparent; background: var(--manga-action); color: #fff; }
	@keyframes card-in { from { opacity: .5; transform: translateY(8rpx); } to { opacity: 1; transform: translateY(0); } }
	@keyframes world-panel-in { from { opacity: .5; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }
	@media (prefers-reduced-motion: reduce) { .worldCard,.create-panel { animation: none; } }
	@media (min-width: 900px) { .outer,.workspace-head,.worldCard { max-width: 820px; margin-left: auto; margin-right: auto; } }
</style>
