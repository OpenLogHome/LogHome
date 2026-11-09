<template>
  <section class="preview-reader" :class="{ 'is-night': readerNightMode }">
    <header class="preview-toolbar"><strong>阅读预览</strong><span>未保存草稿 · 不公开发布</span><button @click="$emit('close')">返回编辑器</button></header>
    <div v-if="failure" class="preview-error" role="alert"><h2>预览已失效</h2><p>{{ failure }}</p><button @click="$emit('close')">返回编辑器重新预览</button></div>
    <template v-else-if="payload">
      <MangaDraftPreview v-if="isManga" :article="payload.article" :novel-name="payload.novel.name" @close="$emit('close')" />
      <div v-else class="preview-body" :style="readerAppearance">
        <div class="preview-title"><h1>{{ payload.article.title }}</h1><p>{{ payload.novel.name }} · 不计阅读量、经验或阅读进度</p><button @click="settingsVisible = true">阅读设置</button><button @click="listen">在线听书预览</button><p>听书需登录，正文将发送至原木 TTS 服务生成语音。</p></div>
        <ReaderPager ref="pager" :article="payload.article" :typography="readerTypography" :paged="ready && readerPreferences.mode === 'page'" :initial-position="{}" :navigation-blocked="settingsVisible" :speaking-id="audioState.paragraphId" :chapter-percent="100" />
      </div>
      <ReaderSettings :panel-class="`reading-preview-settings${readerNightMode ? ' is-night' : ''}`" v-if="!isManga && settingsVisible" :visible.sync="settingsVisible" :value="readerPreferences" :fonts="readerFonts" :font-states="readerFontStates" :skins="readerSkins" :tier="readerTier" :resources-loading="readerResourcesLoading" :resource-error="readerResourceError" :font-error="readerFontError" :locked-message="readerLockedMessage" :storage-error="readerStorageError" @input="changeReaderPreferences" @theme="selectReaderTheme" @membership="openReaderMembership" @reset="resetReaderPreferences" @font="selectReaderFont" @skin="selectReaderSkin" @refresh="refreshReaderResources" />
      <ReaderAudioPlayer v-if="player" :controller="player" private-playback />
    </template>
    <p v-else class="preview-error" role="status">正在加载本机预览…</p>
  </section>
</template>
<script>
import { readReaderPreview } from '~/utils/reader-preview'
import { ReaderAudio, createAudioState } from '~/utils/reader-audio'
import { createReaderAudioEnvironment } from '~/utils/reader-tts'
import preferences from '~/mixins/reader-preferences'
import MangaDraftPreview from '~/components/manga/MangaDraftPreview.vue'
import ReaderPager from './ReaderPager.vue'
import ReaderSettings from './ReaderSettings.vue'
import ReaderAudioPlayer from './ReaderAudioPlayer.vue'
export default {
  components: { MangaDraftPreview, ReaderPager, ReaderSettings, ReaderAudioPlayer }, mixins: [preferences],
  props: { previewKey: { type: String, required: true } },
  data() { return { payload: null, failure: '', ready: false, settingsVisible: false, player: null, audioState: createAudioState() } },
  computed: { isManga() { return this.payload && /^manga/.test(this.payload.article.article_type) } },
  mounted() {
    this.validate()
    this.ready = true
    window.addEventListener('focus',this.validate); window.addEventListener('storage',this.validate)
    this.expiryTimer = setInterval(this.validate,60000)
  },
  beforeDestroy() { clearInterval(this.expiryTimer); window.removeEventListener('focus',this.validate); window.removeEventListener('storage',this.validate); if (this.player) this.player.destroy() },
  methods: {
    validate() {
      const value = readReaderPreview(this.previewKey)
      if (!value) { this.failure = '预览超过 24 小时、账号已切换或本机数据不可用。请回到编辑器生成新的预览。'; this.payload = null; this.settingsVisible = false; if (this.player) this.player.close(); return }
      if (!this.payload) this.payload = value
    },
    async listen() {
      if (!this.payload || this.isManga) return
      if (!this.player) {
        // A separate queue prevents draft narration from writing real book progress.
        if (this.$readerAudio) this.$readerAudio.pause()
        this.player = new ReaderAudio(this.audioState,createReaderAudioEnvironment(this,{article:async()=>[],privatePlayback:true}))
        this.player.saveSettings = () => {
          try { localStorage.setItem('loghome:reader:audio',JSON.stringify({rate:this.audioState.rate,voiceURI:this.audioState.voiceURI,follow:this.audioState.follow}));this.audioState.storageError='' }
          catch (_) { this.audioState.storageError='听书偏好未能保存。' }
        }
        try { const saved=JSON.parse(localStorage.getItem('loghome:reader:audio')||'{}');this.player.configure({rate:saved.rate,voiceURI:saved.voiceURI});this.audioState.follow=saved.follow!==false } catch (_) {}
        this.player.subscribe(state => { if (state.follow && state.paragraphId && this.$refs.pager) this.$refs.pager.jump(state.paragraphId) })
      }
      const position = this.$refs.pager && this.$refs.pager.position
      await this.player.open(this.payload.novel,[this.payload.article],this.payload.article,position && position.paragraphId || 1,{forceSeek:false})
    }
  }
}
</script>
<style scoped>
.preview-reader { background: var(--reading-bg); min-height: 100vh; color: var(--reading-ink); display: flow-root; }.preview-toolbar { display: flex; align-items: center; gap: 16px; padding: 16px 28px; background: var(--reading-surface); border-bottom: 1px solid var(--reading-line); position: sticky; top: 0; z-index: 5; }.preview-toolbar span { color: var(--reading-secondary); font-size: 13px; flex: 1; }.preview-body { max-width: 1200px; margin: 24px auto; padding-bottom: 100px; }.preview-title { text-align: center; padding: 22px 20px; }.preview-title h1 { font-size: 26px; }.preview-title p { color: var(--reader-secondary); font-size: 13px; margin: 15px 0; }button { padding: 8px 14px; border: 1px solid var(--reading-line); background: var(--reading-surface); color: var(--reading-accent); border-radius: 5px; margin: 0 4px; cursor: pointer; }button:focus-visible { outline: 2px solid var(--reading-accent); outline-offset: 2px; }.preview-error { padding: 70px 25px; text-align: center; }.preview-body /deep/ .article-paragraph { margin: 0 0 1.2em; white-space: pre-wrap; }.preview-body /deep/ .article-image { text-align: center; }.preview-body /deep/ .article-image img { max-width: 100%; }@media(max-width:700px) { .preview-toolbar { padding: 14px; gap: 8px; flex-wrap: wrap; }.preview-toolbar span { font-size: 11px; }.preview-body { margin: 12px auto; } }
</style>

<style src="~/assets/css/reader-preview.css"></style>
