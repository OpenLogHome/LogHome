<template>
  <el-dialog custom-class="reading-dialog" title="反馈文本错误" :visible="visible" @update:visible="$emit('update:visible', $event)" width="min(520px, 94vw)" append-to-body>
    <blockquote>{{ paragraphText }}</blockquote><el-input v-model="content" type="textarea" :rows="4" maxlength="500" show-word-limit placeholder="请说明错别字、标点或其他问题，以及建议修改的内容" /><p v-if="error" class="error" role="alert">{{ error }}</p>
    <span slot="footer"><el-button @click="$emit('update:visible', false)">取消</el-button><el-button type="primary" :loading="sending" :disabled="!content.trim()" @click="submit">提交反馈</el-button></span>
  </el-dialog>
</template>
<script>
import { readingToken } from '~/plugins/api/reading'
export default {
  props: { visible: Boolean, articleId: { type: [Number, String], required: true }, paragraphId: { type: [Number, String], required: true }, paragraphText: { type: String, default: '' } },
  data: () => ({ content: '', error: '', sending: false, version: 0 }),
  beforeDestroy() { this.version++ },
  methods: { async submit() {
    if (this.sending || !this.content.trim()) return
    const token = readingToken(); if (!token) { this.error = '登录后可以向作者反馈文本错误。'; return }
    const version = this.version; this.sending = true; this.error = ''
    try { await this.$api.reader.feedback({ article_id: Number(this.articleId), paragraph_id: Number(this.paragraphId), feedback_content: this.content.trim() }); if (version === this.version && token === readingToken()) { this.$message.success('反馈已提交，感谢你帮助完善作品'); this.$emit('update:visible', false); this.content = '' } }
    catch (error) { if (version === this.version && token === readingToken()) this.error = error.message }
    finally { if (version === this.version) this.sending = false }
  } }
}
</script>
<style scoped>
blockquote { color: #8f765f; background: #faf6ef; padding: 14px; border-left: 3px solid #947358; font-size: 13px; line-height: 1.8; white-space: pre-wrap; margin-bottom: 20px; max-height: 160px; overflow: auto; }.error { color: #c05243; margin-top: 12px; font-size: 13px; }
</style>
