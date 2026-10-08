<template>
  <el-drawer
    :title="title"
    :visible="visible"
    direction="rtl"
    size="480px"
    :wrapper-closable="true"
    @update:visible="onVisibleChange"
    @open="onOpen">
    <div class="panel-body">
      <div class="panel-scroll">
        <div v-if="!comments.length && !loading" class="empty">还没有评论，来抢第一个沙发</div>
        <manga-comment-item
          v-for="item in comments"
          :key="item.commentId"
          :comment="item"
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
  </el-drawer>
</template>

<script>
import MangaCommentItem from './MangaCommentItem.vue'
import MangaCommentComposer from './MangaCommentComposer.vue'
import {
  fetchMangaComments,
  fetchMangaCommentAmount,
  publishMangaComment,
  replyMangaComment,
  praiseMangaComment,
  deleteMangaComment,
  getMangaCommentErrorMessage
} from '~/common/manga-comment-api.js'

const PAGE_SIZE = 10

export default {
  name: 'MangaCommentPanel',
  components: { MangaCommentItem, MangaCommentComposer },
  props: {
    visible: { type: Boolean, default: false },
    novelId: { type: [String, Number], required: true },
    // 0 表示作品级评论，>0 表示具体话的评论
    articleId: { type: [String, Number], default: 0 },
    workAuthorId: { type: [String, Number], default: null }
  },
  data() {
    return { comments: [], page: 1, hasMore: false, loading: false, submitting: false, replyTarget: null, amount: 0 }
  },
  computed: {
    title() {
      const scope = Number(this.articleId) > 0 ? '本话评论' : '作品评论'
      return this.amount ? `${scope} · ${this.amount} 条` : scope
    }
  },
  methods: {
    onVisibleChange(val) {
      this.$emit('update:visible', val)
    },
    onOpen() {
      this.replyTarget = null
      this.loadAmount()
      if (!this.comments.length) this.load(1)
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
      this.loading = true
      try {
        const opts = { novelId: this.novelId, page, pageSize: PAGE_SIZE }
        if (Number(this.articleId) > 0) opts.articleId = this.articleId
        const list = await fetchMangaComments(process.env.baseUrl, opts)
        this.comments = page === 1 ? list : this.comments.concat(list)
        this.hasMore = list.length === PAGE_SIZE
        this.page = page
      } catch (e) {
        console.error('加载评论失败', e)
      } finally {
        this.loading = false
      }
    },
    async loadAmount() {
      try {
        this.amount = await fetchMangaCommentAmount(process.env.baseUrl, this.novelId, Number(this.articleId) > 0 ? this.articleId : undefined)
      } catch (e) {}
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
            content: payload.content,
            images: payload.images
          })
        }
        this.$refs.composer.reset()
        this.replyTarget = null
        this.$message.success('发表成功')
        await Promise.all([this.load(1), this.loadAmount()])
        this.$emit('changed')
      } catch (e) {
        this.$message.error(getMangaCommentErrorMessage(e, '评论发送失败，请稍后重试'))
      } finally {
        this.submitting = false
      }
    },
    async togglePraise(comment) {
      if (!this.requireLogin()) return
      const type = comment.praiseType === 0 ? 3 : 0
      const previous = comment.praiseType
      try {
        await praiseMangaComment(process.env.baseUrl, comment.commentId, type)
        comment.praiseType = type
        comment.likeNum = Math.max(0, (Number(comment.likeNum) || 0) + (previous === 0 ? -1 : 1))
      } catch (e) {
        this.$message.error(getMangaCommentErrorMessage(e, '操作失败，请稍后重试'))
      }
    },
    removeComment(comment) {
      this.$confirm('确定删除这条评论吗？', '删除评论', { type: 'warning' })
        .then(async () => {
          try {
            await deleteMangaComment(process.env.baseUrl, comment.commentId)
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
      this.$confirm('确定删除这条回复吗？', '删除回复', { type: 'warning' })
        .then(async () => {
          try {
            await deleteMangaComment(process.env.baseUrl, reply.commentId)
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
.panel-body { display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
.panel-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 0 20px; }
.empty { text-align: center; color: #999; padding: 60px 0; }
.load-more { display: block; width: 100%; padding: 14px; background: none; border: none; color: #947358; font-size: 14px; cursor: pointer; }
.load-more:disabled { color: #ccc; }
.panel-composer { flex: none; padding: 12px 20px 20px; }
</style>
