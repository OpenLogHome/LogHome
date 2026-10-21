<template>
  <view class="manga-settings" v-dark>
    <view class="nav-bar"><button v-manga-a11y class="nav-back" type="button" :aria-label="$t('common.back')" @click="back"><manga-icon name="back" /></button><text>{{ $t('manga.settings.pageTitle') }}</text></view>
    <view v-if="loading || loadError" class="empty" role="status"><text>{{ loading ? $t('manga.settings.loadingWork') : loadError }}</text><button v-manga-a11y v-if="loadError" type="button" @click="load"><manga-icon name="retry" />{{ $t('common.retry') }}</button></view>
    <scroll-view v-else class="content" scroll-y>
      <view class="cover-card">
        <image lazy-load class="cover" :src="novel.picUrl || $backupResources.bookCover" mode="aspectFill" :alt="$t('manga.settings.coverAlt', { name: novel.name })" />
        <view class="cover-info"><text class="eyebrow">{{ owner ? $t('manga.settings.workInfo') : $t('manga.settings.collaborativeWork') }}</text><text class="title">{{ novel.name }}</text><text class="muted">{{ Number(novel.is_personal) === 1 ? $t('manga.settings.privateWork') : $t('manga.settings.publicWork') }}</text><button v-manga-a11y v-if="owner" class="link" type="button" @click="changeCover"><manga-icon name="image" />{{ $t('manga.settings.changeCover') }}</button></view>
      </view>
      <view class="card">
        <text class="section-title">{{ $t('manga.settings.basicInfo') }}</text>
        <label class="label" for="manga-title-input">{{ $t('manga.settings.workName') }}</label><input id="manga-title-input" v-model="name" :disabled="!owner || saving" maxlength="50" :placeholder="$t('manga.settings.namePlaceholder')" />
        <label class="label" for="manga-intro-input">{{ $t('manga.settings.introLabel') }}</label><textarea id="manga-intro-input" v-model="intro" :disabled="!owner || saving" maxlength="2000" auto-height :placeholder="$t('manga.settings.introPlaceholder')" />
        <text class="counter">{{ intro.length }} / 2000</text>
        <button v-manga-a11y="saving || !name.trim() || !dirty" v-if="owner" class="primary" type="button" :disabled="saving || !name.trim() || !dirty" @click="saveInfo">{{ saving ? $t('manga.settings.saving') : $t('manga.settings.saveInfo') }}</button>
      </view>
      <view class="card">
        <text class="section-title">{{ $t('manga.settings.management') }}</text>
        <view v-if="owner" class="setting-row"><view class="row-copy"><text class="row-title">{{ $t('manga.settings.publicStatus') }}</text><text class="hint">{{ Number(novel.is_personal) === 1 ? $t('manga.settings.statusPrivateHint') : $t('manga.settings.statusPublicHint') }}</text></view><switch :aria-label="$t('manga.settings.publicStatus')" color="#c14a16" :checked="Number(novel.is_personal) === 0" :disabled="changing" @change="setStatus('is_personal', $event.detail.value ? 0 : 1)" /></view>
        <view v-if="owner" class="setting-row"><view class="row-copy"><text class="row-title">{{ $t('common.completed') }}</text><text class="hint">{{ $t('manga.settings.completedHint') }}</text></view><switch :aria-label="$t('common.completed')" color="#c14a16" :checked="Number(novel.is_complete) === 1" :disabled="changing" @change="setStatus('is_complete', $event.detail.value ? 1 : 0)" /></view>
        <button v-manga-a11y v-if="owner" class="setting-row setting-row-button" type="button" @click="navigate('changeNovelTags')"><view class="row-copy"><text class="row-title">{{ $t('manga.settings.categoriesTags') }}</text><text class="hint">{{ $t('manga.settings.categoriesHint') }}</text></view><manga-icon name="next" /></button>
        <button v-manga-a11y class="setting-row setting-row-button" type="button" @click="navigate('essayCollaborationSettings')"><view class="row-copy"><text class="row-title">{{ $t('manga.settings.collaboration') }}</text><text class="hint">{{ $t('manga.settings.collaborationHint') }}</text></view><manga-icon name="next" /></button>
        <button v-manga-a11y class="setting-row setting-row-button" type="button" @click="preview"><view class="row-copy"><text class="row-title">{{ $t('manga.settings.authorPreview') }}</text><text class="hint">{{ $t('manga.settings.authorPreviewHint') }}</text></view><manga-icon name="next" /></button>
        <button v-manga-a11y v-if="Number(novel.is_personal) === 0" class="setting-row setting-row-button" type="button" @click="viewReaderDetail"><view class="row-copy"><text class="row-title">{{ $t('manga.settings.viewReaderDetail') }}</text><text class="hint">{{ $t('manga.settings.viewReaderDetailHint') }}</text></view><manga-icon name="next" /></button>
      </view>
      <view v-if="owner" class="card danger-card">
        <text class="section-title">{{ $t('manga.settings.deleteTitle') }}</text>
        <button v-manga-a11y="deleting" class="setting-row setting-row-button danger-action" type="button" :disabled="deleting" @click="deleteManga"><view class="row-copy"><text class="row-title">{{ deleting ? $t('manga.settings.deleting') : $t('manga.settings.deleteManga') }}</text><text class="hint">{{ $t('manga.settings.deleteHint') }}</text></view><manga-icon name="trash" /></button>
      </view>
      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
import axios from 'axios';
import MangaIcon from '@/components/manga-icon.vue';
export default {
  directives: { mangaA11y: MangaA11y },
  components: { MangaIcon },
  data() { return { id: null, novel: {}, name: '', intro: '', baseline: '', loading: true, loadError: '', saving: false, changing: false, deleting: false }; },
  computed: { owner() { return this.novel.current_access && this.novel.current_access.access_role === 'owner'; }, dirty() { return !this.loading && JSON.stringify([this.name, this.intro]) !== this.baseline; } },
  onLoad(option) { this.id = option.id; this.load(); },
  onShow() { if (this.id && !this.loading && !this.dirty) this.load(); },
  onBackPress() { if (this.saving || this.changing || this.deleting) return true; if (this.dirty) { this.back(); return true; } return false; },
  methods: {
    headers() { let token; try { token = JSON.parse(window.localStorage.getItem('token')); } catch (_) {} return { Authorization: 'Bearer ' + (token && token.tk), 'Content-Type': 'application/json' }; },
    async load() {
      this.loading = true; this.loadError = '';
      try { const res = await axios.get(this.$baseUrl + '/essays/get_manga?id=' + this.id, { headers: this.headers() }); if (!res.data || !res.data[0]) throw new Error(); this.novel = res.data[0]; this.name = this.novel.name || ''; this.intro = this.novel.content || ''; this.baseline = JSON.stringify([this.name, this.intro]); }
      catch (_) { this.loadError = this.$t('manga.settings.loadFailedPermission'); } finally { this.loading = false; }
    },
    async saveInfo() {
      if (!this.owner || this.saving || !this.name.trim()) return;
      this.saving = true;
      try { await axios.post(this.$baseUrl + '/essays/modify_novel', { novel_id: Number(this.id), name: this.name.trim(), content: this.intro.trim() }, { headers: this.headers() }); this.name = this.name.trim(); this.intro = this.intro.trim(); this.novel.name = this.name; this.baseline = JSON.stringify([this.name, this.intro]); uni.showToast({ title: this.$t('manga.settings.saved'), icon: 'none' }); }
      catch (_) { uni.showToast({ title: this.$t('manga.settings.saveFailed'), icon: 'none' }); } finally { this.saving = false; }
    },
    async setStatus(key, value) {
      if (!this.owner || this.changing) return;
      this.changing = true; const previous = this.novel[key]; this.$set(this.novel, key, value);
      try { await axios.post(this.$baseUrl + '/essays/' + (key === 'is_personal' ? 'set_novel_status' : 'set_novel_update_status'), { novel_id: Number(this.id), [key]: value }, { headers: this.headers() }); this.$set(this.novel, key, value); }
      catch (e) { uni.showToast({ title: e.response && e.response.data && e.response.data.msg || this.$t('manga.settings.statusFailed'), icon: 'none' }); this.$set(this.novel, key, previous); } finally { this.changing = false; }
    },
    back() { if (this.saving || this.changing || this.deleting) return; if (this.dirty) uni.showModal({ title: this.$t('manga.settings.unsavedTitle'), content: this.$t('manga.settings.unsavedContent'), success: r => { if (r.confirm) { this.baseline = JSON.stringify([this.name, this.intro]); uni.navigateBack(); } } }); else uni.navigateBack(); },
    leaveFor(action) { if (this.saving || this.changing || this.deleting) return; if (this.dirty) { uni.showToast({ title: this.$t('manga.settings.saveFirst'), icon: 'none' }); return; } action(); },
    navigate(page) { this.leaveFor(() => uni.navigateTo({ url: '/pages/writers/' + page + '?id=' + this.id })); },
    changeCover() { if (this.owner) this.navigate('cover_upload'); },
    preview() { this.leaveFor(() => uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + this.id + '&preview=1' })); },
    viewReaderDetail() { if (Number(this.novel.is_personal) === 0) this.leaveFor(() => uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + this.id })); },
    deleteManga() {
      if (!this.owner) return;
      this.leaveFor(() => uni.showModal({
        title: this.$t('manga.settings.deleteManga'),
        content: this.$t('manga.settings.deleteConfirm', { name: this.novel.name }),
        confirmColor: '#a4382b',
        success: async result => {
          if (!result.confirm || this.deleting) return;
          this.deleting = true;
          try {
            await axios.post(this.$baseUrl + '/essays/delete_novel', { id: Number(this.id) }, { headers: this.headers() });
            uni.showToast({ title: this.$t('manga.settings.deleted'), icon: 'none' });
            uni.switchTab({ url: '/pages/essays' });
          } catch (error) {
            uni.showToast({ title: error.response && error.response.data && error.response.data.msg || this.$t('manga.settings.deleteFailed'), icon: 'none' });
          } finally {
            this.deleting = false;
          }
        },
      }));
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/common/manga-theme.scss';
.manga-settings { @include manga-theme; min-height: 100vh; }
.nav-bar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; min-height: 96rpx; padding-top: var(--manga-safe-top); background: var(--manga-card); border-bottom: 1rpx solid var(--manga-line); font-size: 30rpx; font-weight: 700; }
.nav-back { display: grid; place-items: center; width: 96rpx; height: 88rpx; font-size: 32rpx; }
.content { height: calc(100vh - 96rpx - var(--manga-safe-top)); box-sizing: border-box; padding: 24rpx; }
.cover-card,.card { margin-bottom: 24rpx; padding: 30rpx; border-radius: 24rpx; background: var(--manga-card); box-shadow: var(--manga-shadow); }
.cover-card { display: flex; align-items: center; gap: 26rpx; }
.cover { width: 156rpx; height: 212rpx; border-radius: 14rpx; flex: none; object-fit: cover; }
.cover-info { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 7rpx; }
.eyebrow { font-size: 21rpx; font-weight: 700; letter-spacing: .08em; color: var(--manga-accent); }
.title { font-size: 32rpx; line-height: 1.35; font-weight: 700; }
.muted { color: var(--manga-muted); font-size: 23rpx; }
.link { display: inline-flex; align-items: center; gap: 8rpx; min-height: 72rpx; padding: 0 16rpx !important; margin-top: 8rpx !important; border-radius: 12rpx !important; background: var(--manga-tint) !important; color: var(--manga-accent) !important; font-size: 23rpx; font-weight: 600; }
.section-title { display: block; margin-bottom: 24rpx; font-size: 30rpx; font-weight: 700; }
.label { display: block; margin: 24rpx 0 10rpx; font-size: 24rpx; font-weight: 600; }
input,textarea { width: 100%; box-sizing: border-box; padding: 20rpx; border: 1rpx solid var(--manga-line); border-radius: 14rpx; background: var(--manga-bg); color: var(--manga-text); font-size: 27rpx; }
input { height: 88rpx; } textarea { min-height: 210rpx; line-height: 1.6; }
input:focus,textarea:focus { border-color: var(--manga-accent); outline: 2px solid var(--manga-accent); outline-offset: 2px; }
.counter { display: block; margin-top: 10rpx; color: var(--manga-muted); text-align: right; font-size: 21rpx; }
.primary { display: flex; align-items: center; justify-content: center; padding: 0; line-height: 1.25; width: 100%; min-height: 88rpx; margin-top: 24rpx !important; border-radius: 100rpx !important; background: var(--manga-action) !important; color: #fff !important; font-size: 28rpx; font-weight: 700; }
.setting-row { margin: 0; padding: 0; display: flex; align-items: center; justify-content: space-between; gap: 20rpx; min-height: 112rpx; border-bottom: 1rpx solid var(--manga-line); }
.setting-row:last-child { border-bottom: 0; }
.row-copy { display: flex; flex-direction: column; gap: 4rpx; min-width: 0; }
.row-title { font-size: 27rpx; font-weight: 600; }
.hint { color: var(--manga-muted); font-size: 21rpx; }
.setting-row-button { width: 100%; text-align: left; }
.setting-row-button .manga-icon { color: var(--manga-muted); font-size: 26rpx; }
.danger-card { border: 1rpx solid rgba(164, 56, 43, .18); }
.danger-card .section-title { margin-bottom: 8rpx; }
.danger-action { border-bottom: 0; color: #a4382b; }
.danger-action .manga-icon { color: #a4382b; }
.danger-action .hint { color: var(--manga-muted); }
.manga-settings.dark-mode .danger-card { border-color: rgba(255, 155, 131, .3); }
.manga-settings.dark-mode .danger-action,.manga-settings.dark-mode .danger-action .manga-icon { color: #ff9b83; }
.bottom-space { height: calc(24rpx + var(--manga-safe-bottom)); }
.empty { display: flex; align-items: center; flex-direction: column; gap: 24rpx; padding: 120rpx 30rpx; color: var(--manga-muted); text-align: center; font-size: 26rpx; }
.empty button { display: inline-flex; align-items: center; gap: 8rpx; min-height: 88rpx; color: var(--manga-accent); }
@media (min-width: 800px) { .content { max-width: 820px; margin: 0 auto; } }
</style>
