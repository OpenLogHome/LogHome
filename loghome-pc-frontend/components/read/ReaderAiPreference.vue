<template><div class="ai-preference"><div><h2>AI 辅助功能</h2><p>在此浏览器中显示原木娘助读入口。作者关闭 AI 助读的作品会遵循作者设置。</p><p v-if="error" class="error" role="alert">{{ error }}</p></div><label><input type="checkbox" :checked="enabled" :disabled="!ready" @change="change($event.target.checked)" /> {{ enabled ? '已开启' : '已关闭' }}</label></div></template>
<script>
import { readerAiDisabled, setReaderAiDisabled, AI_PREFERENCE_EVENT } from '~/utils/reader-ai'
export default {
  data: () => ({ ready: false, enabled: false, error: '' }),
  mounted() { this.sync(); this.ready = true; window.addEventListener('storage', this.sync); window.addEventListener(AI_PREFERENCE_EVENT, this.sync) },
  beforeDestroy() { window.removeEventListener('storage', this.sync); window.removeEventListener(AI_PREFERENCE_EVENT, this.sync) },
  methods: {
    sync() { this.enabled = !readerAiDisabled() },
    change(enabled) { try { setReaderAiDisabled(!enabled); this.enabled = enabled; this.error = '' } catch (_) { this.error = '设置未能保存，请检查浏览器存储权限后重试。'; this.sync(); this.$forceUpdate() } }
  }
}
</script>
<style scoped>.ai-preference{display:flex;justify-content:space-between;align-items:center;gap:24px}.ai-preference h2{font-size:18px;color:#6b553f;margin:0 0 12px}.ai-preference p{font-size:13px;line-height:1.8;color:#978978;margin:0}.ai-preference label{display:flex;align-items:center;gap:6px;flex-shrink:0;font-size:14px;color:#839456;cursor:pointer}.ai-preference input{accent-color:#839456}.ai-preference p.error{color:#b65341;margin-top:8px}</style>
