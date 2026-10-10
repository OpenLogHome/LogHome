<template>
  <div class="manga-comment-item" :class="{ highlight }">
    <div class="comment-main">
      <nuxt-link class="comment-avatar" :to="`/users/${comment.userId}`" :aria-label="`查看 ${comment.userName || '读者'} 的主页`"><ReaderAvatar :src="comment.avatarUrl || ''" :frame="comment.avatarFrame" /></nuxt-link>
      <div class="comment-body">
        <div class="comment-head">
          <nuxt-link class="comment-author" :to="`/users/${comment.userId}`">{{ comment.userName || '匿名' }}</nuxt-link>
          <span class="author-badge" v-if="isWorkAuthor">作者</span>
          <span class="comment-time">{{ comment.time }}</span>
        </div>
        <p v-if="isFolded" class="folded-comment">该评论已被收起</p>
        <div class="comment-excerpt" v-if="!isFolded && comment.excerpt">「{{ comment.excerpt }}」</div>
        <div v-if="!isFolded" class="comment-text">{{ comment.content }}</div>
        <div class="comment-images" v-if="!isFolded && comment.images && comment.images.length">
          <div v-for="(img, i) in comment.images" :key="i" class="image-entry"><button class="image-button" :aria-label="`查看配图 ${i + 1}`" @click="preview(comment.images, i)"><img :src="img" class="comment-image" alt="评论配图" loading="lazy"></button><button class="image-save" :disabled="!!savingSticker[img]" @click="saveSticker(img)">{{ savingSticker[img] ? '收藏中…' : '收藏为表情包' }}</button></div>
        </div>
        <div class="comment-actions">
          <button class="act" :class="{ liked: comment.praiseType === 0 }" @click="$emit('praise', comment)">
            ❤️ {{ comment.likeNum || 0 }}
          </button>
          <button class="act" @click="$emit('reply', { rootCommentId: comment.commentId, replyToCommentId: comment.commentId, targetUserName: comment.userName })">
            回复
          </button>
          <button class="act danger" v-if="comment.canModerate" @click="$emit('remove', comment)">删除</button>
        </div>

        <div class="reply-list" v-if="comment.replies && comment.replies.length">
          <div class="reply-item" v-for="reply in comment.replies" :key="reply.commentId" :data-comment-id="reply.commentId" :class="{ 'reply-highlight': String(reply.commentId) === String(anchorId) }">
            <div class="reply-head">
              <nuxt-link class="reply-author" :to="`/users/${reply.userId}`">{{ reply.userName || '匿名' }}</nuxt-link>
              <span class="reply-target" v-if="reply.targetUserName">回复 {{ reply.targetUserName }}</span>
              <span class="comment-time">{{ reply.time }}</span>
            </div>
            <div class="comment-text">{{ reply.content }}</div>
            <div class="comment-images" v-if="reply.images && reply.images.length">
              <div v-for="(img, i) in reply.images" :key="i" class="image-entry"><button class="image-button" :aria-label="`查看回复配图 ${i + 1}`" @click="preview(reply.images, i)"><img :src="img" class="comment-image small" alt="回复配图" loading="lazy"></button><button class="image-save" :disabled="!!savingSticker[img]" @click="saveSticker(img)">收藏为表情包</button></div>
            </div>
            <div class="comment-actions">
              <button class="act" @click="$emit('reply', { rootCommentId: comment.commentId, replyToCommentId: reply.commentId, targetUserName: reply.userName })">回复</button>
              <button class="act danger" v-if="reply.canModerate" @click="$emit('remove-reply', { rootCommentId: comment.commentId, reply })">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReaderAvatar from '~/components/read/ReaderAvatar.vue'
import { saveImageAsReaderSticker } from '~/utils/reader-stickers'
import { readingToken } from '~/plugins/api/reading'
export default {
  name: 'MangaCommentItem',
  components: { ReaderAvatar },
  props: {
    comment: { type: Object, required: true },
    highlight: { type: Boolean, default: false },
    anchorId: { type: [String, Number], default: 0 },
    workAuthorId: { type: [String, Number], default: null }
  },
  data: () => ({ savingSticker: {}, stickerVersion: 0 }),
  beforeDestroy() { this.stickerVersion++ },
  computed: {
    isFolded() { return Number(this.comment.praiseType) === 1 },
    isWorkAuthor() {
      return this.workAuthorId != null && String(this.comment.userId) === String(this.workAuthorId)
    }
  },
  methods: {
    async saveSticker(url) {
      const token = readingToken(), version = this.stickerVersion
      if (!token) { this.$message.info('登录后可以收藏评论配图为表情包'); return }
      if (this.savingSticker[url]) return
      this.$set(this.savingSticker,url,true)
      try { await saveImageAsReaderSticker(url,token); if (version===this.stickerVersion && token===readingToken()) this.$message.success('已添加到表情包收藏') }
      catch(error) { if(version===this.stickerVersion && token===readingToken())this.$message.error(error.message || '表情包收藏失败，请重试') }
      finally { if(version===this.stickerVersion)this.$set(this.savingSticker,url,false) }
    },
    preview(images, index) {
      if (this.$preview) this.$preview(images, index)
      else window.open(images[index], '_blank')
    }
  }
}
</script>

<style scoped>
.manga-comment-item { padding: 16px 0; border-bottom: 1px solid #f0e9e2; }
.manga-comment-item.highlight { background: #fff8f2; border-radius: 8px; }
.reply-highlight { background:#fff0d9; border-radius:5px; padding:10px !important; outline:1px solid #ebd9b8; }.image-entry{display:flex;flex-direction:column;gap:4px;align-items:start}.image-save{border:0;background:none;font-size:10px;color:#aa9477;cursor:pointer;padding:0}.image-save:disabled{opacity:.5}
.comment-main { display: flex; gap: 12px; }
.comment-avatar { width: 40px; height: 40px; flex: none; }
.comment-body { flex: 1; min-width: 0; }
.comment-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.comment-author { font-size: 14px; font-weight: 600; color: #333; text-decoration: none; }
.comment-author:hover,.reply-author:hover { color: #947358; text-decoration: underline; }.folded-comment { color: #999; font-size: 13px; font-style: italic; margin: 8px 0; }
.image-button { border: 0; padding: 0; background: transparent; cursor: pointer; border-radius: 6px; }.image-button img { display: block; }.image-button:focus-visible { outline: 2px solid #947358; outline-offset: 3px; }
.author-badge { font-size: 11px; color: #c14a16; background: #fff1e8; border-radius: 8px; padding: 1px 8px; }
.comment-time { font-size: 12px; color: #aaa; }
.comment-excerpt { margin-top: 6px; padding: 6px 10px; background: #f7f3ef; border-left: 3px solid #d8c9bd; color: #888; font-size: 13px; border-radius: 0 6px 6px 0; }
.comment-text { margin-top: 6px; color: #444; line-height: 1.7; font-size: 14px; white-space: pre-line; word-break: break-word; }
.comment-images { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.comment-image { width: 96px; height: 96px; object-fit: cover; border-radius: 6px; cursor: pointer; }
.comment-image.small { width: 72px; height: 72px; }
.comment-actions { display: flex; gap: 18px; margin-top: 10px; }
.act { background: none; border: none; color: #999; font-size: 13px; cursor: pointer; padding: 0; }
.act:hover { color: #947358; }
.act.liked { color: #e0524d; }
.act.danger:hover { color: #e0524d; }
.reply-list { margin-top: 12px; padding: 10px 14px; background: #faf7f4; border-radius: 8px; }
.reply-item { padding: 8px 0; }
.reply-item + .reply-item { border-top: 1px solid #f0e9e2; }
.reply-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.reply-author { font-size: 13px; font-weight: 600; color: #555; text-decoration: none; }
.reply-target { font-size: 12px; color: #947358; }
</style>
