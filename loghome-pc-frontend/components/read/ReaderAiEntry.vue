<template><nuxt-link v-if="enabled && Number(book.disable_reader_ai) !== 1" class="reader-ai-entry" :to="`/read/ask/${book.novel_id}`">✦ 向原木娘提问</nuxt-link></template>
<script>
import { readerAiDisabled, AI_PREFERENCE_EVENT } from '~/utils/reader-ai'
export default {
  props: { book: { type: Object, required: true } },
  data: () => ({ enabled: false }),
  mounted() { this.sync(); window.addEventListener('storage', this.sync); window.addEventListener('focus', this.sync); window.addEventListener(AI_PREFERENCE_EVENT, this.sync) },
  beforeDestroy() { window.removeEventListener('storage', this.sync); window.removeEventListener('focus', this.sync); window.removeEventListener(AI_PREFERENCE_EVENT, this.sync) },
  methods: { sync() { this.enabled = !readerAiDisabled() } }
}
</script>
<style scoped>.reader-ai-entry{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:6px;border:1px solid #dfe5d1;color:#7c8b51;background:#f7faef;font-size:13px;text-decoration:none}.reader-ai-entry:hover{background:#edf3de}</style>
