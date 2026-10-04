<template>
  <view class="manga-settings" v-dark>
    <view class="nav-bar"><button v-manga-a11y class="nav-back" type="button" aria-label="返回" @click="back"><manga-icon name="back" /></button><text>漫画作品设置</text></view>
    <view v-if="loading || loadError" class="empty" role="status"><text>{{ loading ? '正在加载作品…' : loadError }}</text><button v-manga-a11y v-if="loadError" type="button" @click="load"><manga-icon name="retry" />重试</button></view>
    <scroll-view v-else class="content" scroll-y>
      <view class="cover-card">
        <image lazy-load class="cover" :src="novel.picUrl || $backupResources.bookCover" mode="aspectFill" :alt="novel.name + '封面'" />
        <view class="cover-info"><text class="eyebrow">{{ owner ? '作品资料' : '协作作品' }}</text><text class="title">{{ novel.name }}</text><text class="muted">{{ Number(novel.is_personal) === 1 ? '私密作品' : '公开作品' }}</text><button v-manga-a11y v-if="owner" class="link" type="button" @click="changeCover"><manga-icon name="image" />更换封面</button></view>
      </view>
      <view class="card">
        <text class="section-title">基本信息</text>
        <label class="label" for="manga-title-input">作品名称</label><input id="manga-title-input" v-model="name" :disabled="!owner || saving" maxlength="50" placeholder="漫画名称" />
        <label class="label" for="manga-intro-input">作品简介</label><textarea id="manga-intro-input" v-model="intro" :disabled="!owner || saving" maxlength="2000" auto-height placeholder="讲述一个怎样的故事…" />
        <text class="counter">{{ intro.length }} / 2000</text>
        <button v-manga-a11y="saving || !name.trim() || !dirty" v-if="owner" class="primary" type="button" :disabled="saving || !name.trim() || !dirty" @click="saveInfo">{{ saving ? '保存中…' : '保存资料' }}</button>
      </view>
      <view class="card">
        <text class="section-title">作品管理</text>
        <view v-if="owner" class="setting-row"><view class="row-copy"><text class="row-title">公开状态</text><text class="hint">{{ Number(novel.is_personal) === 1 ? '当前私密，开启后设为公开' : '当前公开，关闭后设为私密' }}</text></view><switch aria-label="公开状态" color="#c14a16" :checked="Number(novel.is_personal) === 0" :disabled="changing" @change="setStatus('is_personal', $event.detail.value ? 0 : 1)" /></view>
        <view v-if="owner" class="setting-row"><view class="row-copy"><text class="row-title">已完结</text><text class="hint">标记作品的更新状态</text></view><switch aria-label="已完结" color="#c14a16" :checked="Number(novel.is_complete) === 1" :disabled="changing" @change="setStatus('is_complete', $event.detail.value ? 1 : 0)" /></view>
        <button v-manga-a11y v-if="owner" class="setting-row setting-row-button" type="button" @click="navigate('changeNovelTags')"><view class="row-copy"><text class="row-title">分类与标签</text><text class="hint">设置作品在漫画库中的分类</text></view><manga-icon name="next" /></button>
        <button v-manga-a11y class="setting-row setting-row-button" type="button" @click="navigate('essayCollaborationSettings')"><view class="row-copy"><text class="row-title">协作与权限</text><text class="hint">管理共同创作者的权限</text></view><manga-icon name="next" /></button>
        <button v-manga-a11y class="setting-row setting-row-button" type="button" @click="preview"><view class="row-copy"><text class="row-title">作者预览</text><text class="hint">包含未发布话数</text></view><manga-icon name="next" /></button>
        <button v-manga-a11y v-if="Number(novel.is_personal) === 0" class="setting-row setting-row-button" type="button" @click="viewReaderDetail"><view class="row-copy"><text class="row-title">查看读者详情</text><text class="hint">以读者身份查看已发布内容</text></view><manga-icon name="next" /></button>
      </view>
      <view v-if="owner" class="card danger-card">
        <text class="section-title">删除作品</text>
        <button v-manga-a11y="deleting" class="setting-row setting-row-button danger-action" type="button" :disabled="deleting" @click="deleteManga"><view class="row-copy"><text class="row-title">{{ deleting ? '删除中…' : '删除漫画' }}</text><text class="hint">删除后不可找回，将扣除 50 原木</text></view><manga-icon name="trash" /></button>
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
      catch (_) { this.loadError = '作品加载失败或没有访问权限'; } finally { this.loading = false; }
    },
    async saveInfo() {
      if (!this.owner || this.saving || !this.name.trim()) return;
      this.saving = true;
      try { await axios.post(this.$baseUrl + '/essays/modify_novel', { novel_id: Number(this.id), name: this.name.trim(), content: this.intro.trim() }, { headers: this.headers() }); this.name = this.name.trim(); this.intro = this.intro.trim(); this.novel.name = this.name; this.baseline = JSON.stringify([this.name, this.intro]); uni.showToast({ title: '资料已保存', icon: 'none' }); }
      catch (_) { uni.showToast({ title: '保存失败，请重试', icon: 'none' }); } finally { this.saving = false; }
    },
    async setStatus(key, value) {
      if (!this.owner || this.changing) return;
      this.changing = true; const previous = this.novel[key]; this.$set(this.novel, key, value);
      try { await axios.post(this.$baseUrl + '/essays/' + (key === 'is_personal' ? 'set_novel_status' : 'set_novel_update_status'), { novel_id: Number(this.id), [key]: value }, { headers: this.headers() }); this.$set(this.novel, key, value); }
      catch (e) { uni.showToast({ title: e.response && e.response.data && e.response.data.msg || '状态修改失败', icon: 'none' }); this.$set(this.novel, key, previous); } finally { this.changing = false; }
    },
    back() { if (this.saving || this.changing || this.deleting) return; if (this.dirty) uni.showModal({ title: '资料尚未保存', content: '退出会丢失本次资料修改，是否退出？', success: r => { if (r.confirm) { this.baseline = JSON.stringify([this.name, this.intro]); uni.navigateBack(); } } }); else uni.navigateBack(); },
    leaveFor(action) { if (this.saving || this.changing || this.deleting) return; if (this.dirty) { uni.showToast({ title: '请先保存资料', icon: 'none' }); return; } action(); },
    navigate(page) { this.leaveFor(() => uni.navigateTo({ url: '/pages/writers/' + page + '?id=' + this.id })); },
    changeCover() { if (this.owner) this.navigate('cover_upload'); },
    preview() { this.leaveFor(() => uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + this.id + '&preview=1' })); },
    viewReaderDetail() { if (Number(this.novel.is_personal) === 0) this.leaveFor(() => uni.navigateTo({ url: '/pages/readers/mangaInfo?id=' + this.id })); },
    deleteManga() {
      if (!this.owner) return;
      this.leaveFor(() => uni.showModal({
        title: '删除漫画',
        content: '确定删除《' + this.novel.name + '》吗？删除后不可找回，并将扣除 50 原木。',
        confirmColor: '#a4382b',
        success: async result => {
          if (!result.confirm || this.deleting) return;
          this.deleting = true;
          try {
            await axios.post(this.$baseUrl + '/essays/delete_novel', { id: Number(this.id) }, { headers: this.headers() });
            uni.showToast({ title: '作品已删除', icon: 'none' });
            uni.switchTab({ url: '/pages/essays' });
          } catch (error) {
            uni.showToast({ title: error.response && error.response.data && error.response.data.msg || '删除失败，请重试', icon: 'none' });
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
