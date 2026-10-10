<template>
  <component
    :is="inline ? 'section' : 'el-drawer'"
    :class="{ 'inline-comments': inline }"
    :title="title"
    :visible="visible"
    direction="rtl"
    size="min(540px, 100%)"
    :wrapper-closable="true"
    @update:visible="onVisibleChange"
    @open="onOpen">
    <h3 v-if="inline" class="inline-title">{{ title }}</h3>
    <div class="panel-body">
      <div class="panel-scroll" ref="scroll">
        <blockquote v-if="paragraphText" class="scope-excerpt">{{ paragraphText }}</blockquote>
        <p v-if="error" class="load-error" role="alert">{{ error }} <button @click="load(failedPage)">重试</button></p>
        <p v-if="loading && !comments.length" class="empty" role="status">正在加载评论…</p>
        <div v-if="!comments.length && !loading && !error" class="empty">还没有评论，来抢第一个沙发</div>
        <manga-comment-item
          v-for="item in comments"
          :key="item.commentId"
          :comment="item"
          :data-comment-id="item.commentId"
          :highlight="String(item.commentId) === String(anchorId)"
          :anchor-id="anchorId"
          :work-author-id="workAuthorId"
          @reply="setReplyTarget"
          @praise="togglePraise"
          @remove="removeComment"
          @remove-reply="removeReply" />
        <button v-if="hasMore" class="load-more" :disabled="loading" @click="loadMore">
          {{ loading ? '加载中…' : '加载更多' }}
        </button>
      </div>
      <div class="panel-composer">
        <manga-comment-composer ref="composer" :reply-to="replyTarget" :submitting="submitting" @submit="submit" @cancel-reply="replyTarget = null" />
      </div>
    </div>
  </component>
</template>

<script>
import MangaCommentItem from './MangaCommentItem.vue'
import MangaCommentComposer from './MangaCommentComposer.vue'
import {
  fetchMangaComments,
  fetchMangaCommentById,
  fetchMangaCommentAmount,
  publishMangaComment,
  replyMangaComment,
  praiseMangaComment,
  deleteMangaComment,
  getMangaCommentErrorMessage
} from '~/common/manga-comment-api.js'

import { readingToken } from '~/plugins/api/reading'

const PAGE_SIZE = 10

export default {
  name: 'MangaCommentPanel',
  components: { MangaCommentItem, MangaCommentComposer },
  props: {
    inline: { type: Boolean, default: false },
    visible: { type: Boolean, default: false },
    novelId: { type: [String, Number], required: true },
    // 0 表示作品级评论，>0 表示具体话的评论
    articleId: { type: [String, Number], default: 0 },
    paragraphId: { type: [String, Number], default: 0 },
    paragraphText: { type: String, default: '' },
    scopeTitle: { type: String, default: '' },
    anchorId: { type: [String, Number], default: 0 },
    workAuthorId: { type: [String, Number], default: null }
  },
  data() {
    return { comments: [], page: 1, hasMore: false, loading: false, submitting: false, replyTarget: null, amount: 0, version: 0, failedPage: 1, error: '', praisePending: {}, loadedScope: '' }
  },
  computed: {
    title() {
      const scope = this.scopeTitle || (Number(this.paragraphId) > 0 ? '段落评论' : Number(this.articleId) > 0 ? '章节评论' : '作品评论')
      return this.amount ? `${scope} · ${this.amount} 条` : scope
    }
  },
  watch: {
    novelId() { this.resetScope() }, articleId() { this.resetScope() }, paragraphId() { this.resetScope() },
    anchorId() { if (this.visible) this.onOpen() }
  },
  mounted() {
    if (this.visible) this.onOpen()
    window.addEventListener('focus', this.checkAccount)
    window.addEventListener('storage', this.checkAccount)
  },
  beforeDestroy() {
    this.version++
    window.removeEventListener('focus', this.checkAccount)
    window.removeEventListener('storage', this.checkAccount)
  },
  methods: {
    checkAccount() { if (this.scopeKey() !== this.loadedScope) this.resetScope() },
    scopeKey() { return `${this.novelId}:${this.articleId}:${this.paragraphId}:${readingToken() || 'guest'}` },
    resetScope() {
      this.version++; this.comments = []; this.amount = 0; this.page = 1; this.hasMore = false; this.loading = false; this.replyTarget = null; this.error = '';
      if (this.$refs.composer) this.$refs.composer.reset()
      if (this.visible) this.onOpen()
    },
    onVisibleChange(val) {
      this.$emit('update:visible', val)
    },
    async onOpen() {
      const scope = this.scopeKey()
      if (scope !== this.loadedScope) { this.comments = []; this.amount = 0; if (this.$refs.composer) this.$refs.composer.reset(); this.loadedScope = scope }
      this.replyTarget = null
      await Promise.all([this.loadAmount(), this.load(1)])
    },
    requireLogin() {
      try {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token && token.tk) return true
      } catch (e) {}
      this.$message.info('请先登录')
      return false
    },
    async load(page = 1) {
      const version = ++this.version, scope = this.scopeKey()
      this.loading = true; this.error = ''; this.failedPage = page
      try {
        const list = await fetchMangaComments(process.env.baseUrl, { novelId: this.novelId, articleId: Number(this.articleId) || 0, paragraphId: Number(this.paragraphId) || 0, page, pageSize: PAGE_SIZE })
        if (version !== this.version || scope !== this.scopeKey()) return
        const combined = page === 1 ? list : this.comments.concat(list)
        this.comments = combined.filter((item, index) => combined.findIndex(row => String(row.commentId) === String(item.commentId)) === index)
        this.hasMore = list.length === PAGE_SIZE; this.page = page
        if (page === 1 && Number(this.anchorId) > 0) {
          if (!this.comments.some(row => String(row.commentId) === String(this.anchorId) || (row.replies || []).some(reply => String(reply.commentId) === String(this.anchorId)))) {
            const target = await fetchMangaCommentById(process.env.baseUrl, this.anchorId)
            if (version !== this.version || scope !== this.scopeKey()) return
            if (target && String(target.novelId) === String(this.novelId) && (!Number(this.articleId) || Number(target.articleId) === Number(this.articleId)) && (!Number(this.paragraphId) || Number(target.paragraphId) === Number(this.paragraphId))) {
              const index = this.comments.findIndex(row => String(row.commentId) === String(target.commentId))
              if (index === -1) this.comments.unshift(target); else this.$set(this.comments,index,target)
            }
          }
          this.$nextTick(() => { if(version!==this.version || scope!==this.scopeKey())return; const target = this.$refs.scroll && this.$refs.scroll.querySelector(`[data-comment-id="${Number(this.anchorId)}"]`); if (target) target.scrollIntoView({ block: 'nearest' }) })
        }
      } catch (e) { if (version === this.version && scope === this.scopeKey()) this.error = getMangaCommentErrorMessage(e, '评论加载失败，请重试') }
      finally { if (version === this.version) this.loading = false }
    },
    async loadAmount() {
      const scope = this.scopeKey()
      try {
        const amount = await fetchMangaCommentAmount(process.env.baseUrl, this.novelId, Number(this.articleId) || undefined, Number(this.paragraphId) || undefined)
        if (scope === this.scopeKey()) this.amount = amount
      } catch (e) { /* The list request presents its own retry state. */ }
    },
    loadMore() {
      if (this.loading) return
      this.load(this.page + 1)
    },
    setReplyTarget(target) {
      if (!this.requireLogin()) return
      this.replyTarget = target
      if (this.$refs.composer) this.$refs.composer.focus()
    },
    async submit(payload) {
      if (!this.requireLogin() || this.submitting) return
      const scope = this.scopeKey()
      this.submitting = true
      try {
        if (this.replyTarget) {
          await replyMangaComment(process.env.baseUrl, {
            novelId: this.novelId,
            articleId: Number(this.articleId) || 0,
            rootCommentId: this.replyTarget.rootCommentId,
            replyToCommentId: this.replyTarget.replyToCommentId,
            content: payload.content,
            images: payload.images
          })
        } else {
          await publishMangaComment(process.env.baseUrl, {
            novelId: this.novelId,
            articleId: Number(this.articleId) || 0,
            paragraphId: Number(this.paragraphId) || 0,
            content: payload.content,
            images: payload.images
          })
        }
        if (scope !== this.scopeKey()) return
        this.$refs.composer.reset()
        this.replyTarget = null
        this.$message.success('发表成功')
        await Promise.all([this.load(1), this.loadAmount()])
        this.$emit('changed')
      } catch (e) {
        if (scope === this.scopeKey()) this.$message.error(getMangaCommentErrorMessage(e, '评论发送失败，请稍后重试'))
      } finally {
        this.submitting = false
      }
    },
    async togglePraise(comment) {
      if (!this.requireLogin() || this.praisePending[comment.commentId]) return
      this.$set(this.praisePending, comment.commentId, true)
      const scope = this.scopeKey()
      const type = comment.praiseType === 0 ? 3 : 0
      const previous = comment.praiseType
      try {
        await praiseMangaComment(process.env.baseUrl, comment.commentId, type)
        if (scope !== this.scopeKey()) return
        comment.praiseType = type
        comment.likeNum = Math.max(0, (Number(comment.likeNum) || 0) + (previous === 0 ? -1 : 1))
      } catch (e) {
        if (scope === this.scopeKey()) this.$message.error(getMangaCommentErrorMessage(e, '操作失败，请稍后重试'))
      } finally { this.$set(this.praisePending, comment.commentId, false) }
    },
    removeComment(comment) {
      const scope = this.scopeKey()
      this.$confirm('确定删除这条评论吗？', '删除评论', { type: 'warning' })
        .then(async () => {
          try {
            if (scope !== this.scopeKey()) return
            await deleteMangaComment(process.env.baseUrl, comment.commentId)
            if (scope !== this.scopeKey()) return
            this.comments = this.comments.filter(item => item.commentId !== comment.commentId)
            this.amount = Math.max(0, this.amount - 1)
            this.$message.success('已删除')
            this.$emit('changed')
          } catch (e) {
            this.$message.error(getMangaCommentErrorMessage(e, '删除失败，请稍后重试'))
          }
        })
        .catch(() => {})
    },
    removeReply({ rootCommentId, reply }) {
      const scope = this.scopeKey()
      this.$confirm('确定删除这条回复吗？', '删除回复', { type: 'warning' })
        .then(async () => {
          try {
            if (scope !== this.scopeKey()) return
            await deleteMangaComment(process.env.baseUrl, reply.commentId)
            if (scope !== this.scopeKey()) return
            const root = this.comments.find(item => item.commentId === rootCommentId)
            if (root) root.replies = root.replies.filter(item => item.commentId !== reply.commentId)
            this.$message.success('已删除')
            this.$emit('changed')
          } catch (e) {
            this.$message.error(getMangaCommentErrorMessage(e, '删除失败，请稍后重试'))
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.inline-comments { border: 1px solid #e9e4dd; border-radius: 12px; background: #fff; overflow: hidden; }
.inline-title { margin: 0; padding: 22px 24px 16px; font-size: 18px; color: #453b31; }
.inline-comments .panel-body { height: auto; }
.inline-comments .panel-scroll { max-height: 640px; min-height: 140px; }
.inline-comments .panel-composer { border-top: 1px solid #f0ece6; margin-top: 12px; }
.panel-body { display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
.panel-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 0 20px; }
.empty { text-align: center; color: #999; padding: 60px 0; }
.load-more { display: block; width: 100%; padding: 14px; background: none; border: none; color: #947358; font-size: 14px; cursor: pointer; }
.load-more:disabled { color: #ccc; }
.scope-excerpt { color: #8f765f; background: #faf6ef; padding: 14px; border-left: 3px solid #947358; font-size: 13px; line-height: 1.8; white-space: pre-wrap; }.load-error { color: #ba6755; font-size: 13px; padding: 20px 0; }.load-error button { color: inherit; border: 0; background: none; cursor: pointer; text-decoration: underline; }
.panel-composer { flex: none; padding: 12px 20px 20px; }
</style>
