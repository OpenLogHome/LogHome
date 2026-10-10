<template>
  <div>
  <aside v-if="!privatePlayback && !state.visible && state.resumeCandidate" class="audio-resume" aria-label="恢复上次听书"><div><strong>{{ state.resumeCandidate.bookTitle }}</strong><span>{{ state.resumeCandidate.chapterTitle }} · 上次听书位置已保留</span></div><button :disabled="state.resumeLoading || !state.supported" @click="player.resumeLast()">{{ state.resumeLoading ? '读取章节…' : '继续听书' }}</button><button aria-label="清除上次听书位置" @click="player.dismissResume()">×</button><p v-if="state.error || state.storageError" role="alert">{{ state.error || state.storageError }}</p></aside>
  <aside v-if="state.visible" class="audio-player" aria-label="听书播放器">
    <div class="audio-main">
      <img v-if="state.cover" :src="state.cover" :alt="state.bookTitle" class="cover">
      <div class="audio-title"><strong>{{ state.bookTitle }}</strong><span v-if="privatePlayback">{{ state.chapterTitle }} · 预览 · {{ Math.min(state.paragraphIndex + 1, state.paragraphs.length) }}/{{ state.paragraphs.length }} 段</span><nuxt-link v-else :to="`/article/${state.chapterId}`">{{ state.chapterTitle }} · {{ Math.min(state.paragraphIndex + 1, state.paragraphs.length) }}/{{ state.paragraphs.length }} 段</nuxt-link></div>
      <div class="play-controls"><button aria-label="上一章听书" :disabled="state.chapterIndex <= 0 || loading" @click="player.chapter(state.chapterIndex - 1)"><i class="el-icon-d-arrow-left" /></button><button aria-label="听书回退约15秒" :disabled="!state.paragraphs.length || loading" @click="player.seekRelative(-15)">−15</button><button class="play" :aria-label="state.status === 'playing' ? '暂停听书' : '播放听书'" :disabled="loading || !state.supported || !state.paragraphs.length" @click="player.toggle()"><i :class="state.status === 'playing' ? 'el-icon-video-pause' : 'el-icon-video-play'" /></button><button aria-label="听书前进约15秒" :disabled="!state.paragraphs.length || loading" @click="player.seekRelative(15)">+15</button><button aria-label="下一章听书" :disabled="state.chapterIndex >= state.chapters.length - 1 || loading" @click="player.chapter(state.chapterIndex + 1)"><i class="el-icon-d-arrow-right" /></button></div>
      <button class="details-toggle" :aria-expanded="expanded" @click="expanded = !expanded">{{ expanded ? '收起' : '音色与设置' }}</button><button class="close" aria-label="关闭听书" @click="player.close()">×</button>
    </div>
    <div v-if="state.paragraphs.length" class="audio-progress"><label :for="paragraphControlId">段落进度</label><input :id="paragraphControlId" type="range" min="0" :max="state.paragraphs.length - 1" :value="Math.min(state.paragraphIndex, state.paragraphs.length - 1)" :disabled="loading" @change="player.seekParagraph(Number($event.target.value))"><span>{{ statusText }}</span></div>
    <p v-if="state.error" class="audio-error" role="alert">{{ state.error }} <button v-if="state.supported" @click="retry">重试</button></p>
    <p v-if="state.notice" class="audio-notice" role="status">{{ state.notice }}</p>
    <p v-if="state.storageError" class="audio-error" role="alert">{{ state.storageError }}</p>
    <div v-if="expanded" class="audio-settings">
      <label>章节 <select aria-label="听书章节" :value="state.chapterIndex" :disabled="loading" @change="player.chapter(Number($event.target.value))"><option v-for="(chapter,index) in state.chapters" :key="chapter.article_id" :value="index">{{ chapter.title }}</option></select></label>
      <label>音色 <select aria-label="听书音色" :value="state.voiceURI" @change="configure({ voiceURI: $event.target.value })"><option v-if="!state.voices.length" value="">系统默认</option><option v-for="voice in sortedVoices" :key="voice.voiceURI" :value="voice.voiceURI">{{ voice.name }} · {{ voice.lang }}{{ voice.local ? ' · 本机' : '' }}</option></select></label>
      <label>语速 <select aria-label="听书语速" :value="state.rate" @change="configure({ rate: Number($event.target.value) })"><option v-for="rate in [.5,.75,1,1.25,1.5,1.75,2]" :key="rate" :value="rate">{{ rate }}×</option></select></label>
      <label>定时停止 <select aria-label="听书定时停止" :value="sleepSelection" @change="sleepSelection = $event.target.value; player.setSleep(sleepSelection)"><option value="0">关闭</option><option value="chapter">本章结束</option><option v-for="minutes in [5,10,15,30,60]" :key="minutes" :value="String(minutes)">{{ minutes }} 分钟</option></select></label>
      <label class="follow"><input v-model="state.follow" type="checkbox" @change="player.saveSettings()"> 跟随正文</label>
      <p v-if="state.sleepUntil || state.sleepAtChapterEnd" class="sleep-status">{{ state.sleepAtChapterEnd ? '本章结束后停止' : `将在 ${sleepTime} 停止` }}</p>
      <p class="engine-note">音色由浏览器及系统提供。前进与回退{{ state.timingMeasured ? '根据当前音色的实际播放速度估算' : '按文字位置估算' }}；后台播放被浏览器中断时会保留位置。</p>
    </div>
  </aside>
  </div>
</template>
<script>
import { createAudioState } from '~/utils/reader-audio'
export default {
  props: { controller: { type: Object, default: null }, privatePlayback: Boolean },
  data() { const player = this.controller || this.$readerAudio; return { player: player || null, state: player ? player.state : createAudioState(), expanded: false, sleepSelection: '0' } },
  computed: {
    paragraphControlId() { return this.privatePlayback ? 'preview-audio-paragraph' : 'audio-paragraph' },
    loading() { return this.state.status === 'loading' },
    statusText() { return { idle: '已停止', ready: '待播放', playing: '播放中', paused: '已暂停', loading: '加载章节…', ended: '已播完', error: '播放失败' }[this.state.status] },
    sortedVoices() { return [...this.state.voices].sort((a,b) => Number(/^zh/i.test(b.lang)) - Number(/^zh/i.test(a.lang))) },
    sleepTime() { return new Date(this.state.sleepUntil).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
  },
  watch: { 'state.sleepUntil'() { if (!this.state.sleepUntil && !this.state.sleepAtChapterEnd) this.sleepSelection = '0' }, 'state.sleepAtChapterEnd'() { if (!this.state.sleepUntil && !this.state.sleepAtChapterEnd) this.sleepSelection = '0' } },
  methods: { configure(patch) { this.player.configure(patch); this.player.saveSettings() }, retry() { this.state.resumeCandidate ? this.player.resumeLast() : this.player.failedChapterIndex != null ? this.player.chapter(this.player.failedChapterIndex) : this.player.play() } }
}
</script>
<style scoped>
.audio-player { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); width: min(1000px,calc(100% - 32px)); border: 1px solid #d8cdbb; border-radius: 12px; background: #fffdf9; color: #514535; box-shadow: 0 7px 35px #3b302530; padding: 14px 18px; z-index: 350; font-size: 13px; }.audio-main { display: flex; gap: 16px; align-items: center; }.cover { width: 35px; height: 47px; object-fit: cover; border-radius: 3px; }.audio-title { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }.audio-title strong,.audio-title a { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }.audio-title a { font-size: 12px; color: #8d7861; text-decoration: none; }.play-controls { display: flex; gap: 4px; align-items: center; }button { border: 0; background: none; padding: 7px; color: inherit; font-size: 13px; cursor: pointer; }button:disabled { opacity: .35; cursor: default; }.play { font-size: 26px; padding: 2px 9px; }.close { font-size: 24px; line-height: 1; }.audio-progress { display: flex; align-items: center; gap: 12px; padding-top: 9px; font-size: 11px; color: #8b7865; }.audio-progress input { flex: 1; min-width: 30px; accent-color: #947358; }.audio-settings { display: flex; flex-wrap: wrap; gap: 14px; padding-top: 14px; border-top: 1px solid #eae3d9; margin-top: 12px; }.audio-settings label { display: flex; align-items: center; gap: 6px; }select { border: 1px solid #d8cdbb; background: #fff; color: inherit; border-radius: 5px; padding: 7px; max-width: 215px; }input[type=checkbox] { accent-color: #947358; }.engine-note { margin: 0; font-size: 11px; color: #9a8b7b; flex-basis: 100%; }.sleep-status { font-size: 12px; margin: 0; }.audio-error { margin: 6px 0 0; color: #a54434; }.audio-error button { text-decoration: underline; }button:focus-visible,select:focus-visible,input:focus-visible { outline: 2px solid #947358; outline-offset: 2px; }@media(max-width:700px) { .audio-player { padding: 12px; bottom: 10px; }.audio-main { gap: 6px; flex-wrap: wrap; }.cover { display: none; }.audio-title { flex-basis: calc(100% - 50px); order: 0; }.close { order: 1; }.play-controls { order: 2; }.details-toggle { order: 3; margin-left: auto; }.audio-settings select { max-width: 180px; } }
.audio-resume{position:fixed;bottom:18px;right:24px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;max-width:min(540px,calc(100% - 48px));padding:14px 18px;border:1px solid #d8cdbb;border-radius:12px;background:#fffdf9;color:#514535;box-shadow:0 7px 35px #3b302530;z-index:350;font-size:13px}.audio-resume>div{flex:1;min-width:0}.audio-resume strong,.audio-resume span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.audio-resume span{font-size:11px;color:#8b7865;margin-top:7px}.audio-resume p{width:100%;margin:0;font-size:12px;color:#a54434}.audio-notice{font-size:12px;color:#8b7865;margin:8px 0 0}
</style>
