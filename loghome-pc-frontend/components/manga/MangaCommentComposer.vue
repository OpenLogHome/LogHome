<template>
  <div class="manga-composer">
    <div class="reply-hint" v-if="replyTo">
      回复 @{{ replyTo.targetUserName || '' }}
      <button class="cancel-reply" @click="$emit('cancel-reply')">取消</button>
    </div>
    <div class="composer-row">
      <textarea
        ref="input"
        class="composer-input"
        v-model="content"
        :placeholder="replyTo ? '写下你的回复…' : '发条友善的评论…'"
        maxlength="500"
        rows="3"></textarea>
    </div>
    <div class="composer-images" v-if="images.length">
      <div class="upload-item" v-for="(img, i) in images" :key="i">
        <img :src="img" class="upload-preview">
        <button class="remove-image" @click="removeImage(i)">&times;</button>
      </div>
    </div>
    <div class="composer-actions">
      <label class="upload-btn" :class="{ disabled: uploading }">
        <input type="file" accept="image/*" multiple hidden @change="onPickFiles" :disabled="uploading || images.length >= 9">
        {{ uploading ? '上传中…' : '📷 图片' }}
      </label>
      <span class="counter">{{ content.length }}/500</span>
      <button class="submit-btn" :disabled="submitting || !content.trim() || uploading" @click="submit">
        {{ submitting ? '发送中…' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script>
import { uploadMangaCommentImage } from '~/common/manga-comment-api.js'

export default {
  name: 'MangaCommentComposer',
  props: {
    replyTo: { type: Object, default: null },
    submitting: { type: Boolean, default: false }
  },
  data() {
    return { content: '', images: [], uploading: false }
  },
  methods: {
    async onPickFiles(e) {
      const files = Array.from(e.target.files || [])
      e.target.value = ''
      if (!files.length) return
      this.uploading = true
      try {
        for (const file of files) {
          if (this.images.length >= 9) break
          const url = await uploadMangaCommentImage(file)
          this.images.push(url)
        }
      } catch (err) {
        this.$message.error('图片上传失败，请稍后重试')
      } finally {
        this.uploading = false
      }
    },
    removeImage(i) {
      this.images.splice(i, 1)
    },
    submit() {
      if (!this.content.trim() || this.submitting || this.uploading) return
      this.$emit('submit', { content: this.content.trim(), images: this.images.slice() })
    },
    reset() {
      this.content = ''
      this.images = []
    },
    focus() {
      this.$nextTick(() => { if (this.$refs.input) this.$refs.input.focus() })
    }
  }
}
</script>

<style scoped>
.manga-composer { border-top: 1px solid #f0e9e2; padding-top: 12px; }
.reply-hint { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #947358; margin-bottom: 8px; }
.cancel-reply { background: none; border: none; color: #999; cursor: pointer; font-size: 12px; }
.cancel-reply:hover { color: #e0524d; }
.composer-input { width: 100%; box-sizing: border-box; resize: vertical; border: 1px solid #e6d8cf; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #333; font-family: inherit; outline: none; }
.composer-input:focus { border-color: #947358; }
.composer-images { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.upload-item { position: relative; }
.upload-preview { width: 64px; height: 64px; object-fit: cover; border-radius: 6px; }
.remove-image { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border: none; border-radius: 50%; background: rgba(0, 0, 0, 0.6); color: #fff; cursor: pointer; line-height: 1; }
.composer-actions { display: flex; align-items: center; gap: 14px; margin-top: 10px; }
.upload-btn { font-size: 13px; color: #947358; cursor: pointer; user-select: none; }
.upload-btn.disabled { color: #ccc; cursor: not-allowed; }
.counter { font-size: 12px; color: #bbb; margin-left: auto; }
.submit-btn { background: #947358; border: none; color: #fff; border-radius: 18px; padding: 8px 24px; font-size: 14px; cursor: pointer; }
.submit-btn:hover { background: #704c35; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
