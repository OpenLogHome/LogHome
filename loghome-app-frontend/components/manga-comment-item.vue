<template>
  <view class="manga-comment" :class="{ 'is-highlight': highlight, 'is-collapsed': isFolded }">
    <button v-manga-a11y class="avatar-button" type="button" aria-label="查看用户主页" @click="openAuthor">
      <user-avatar class="comment-avatar" :src="comment.avatarUrl" :frame="comment.avatarFrame"
        :visual-scale="comment.avatarFrame ? 1.2 : 1" />
    </button>
    <view class="comment-main">
      <view class="comment-head">
        <text class="comment-name">{{ comment.userName }}</text>
        <text v-if="isWorkAuthor" class="author-badge">作者</text>
      </view>
      <text class="comment-time">{{ comment.time }}</text>
      <text v-if="isFolded" class="comment-folded">该评论已被收起</text>
      <template v-else>
        <text class="comment-body" :class="{ clamped: !isExpanded && needsClamp }">{{ comment.content }}</text>
        <button v-manga-a11y v-if="needsClamp" class="comment-toggle" type="button" @click="isExpanded = !isExpanded">{{ isExpanded ? '收起' : '展开' }}</button>
      </template>
      <view v-if="comment.images.length && !isFolded" class="comment-images">
        <button v-manga-a11y class="comment-image" type="button" v-for="(image, index) in comment.images" :key="image"
          @click="previewImage(index, comment.images)">
          <log-image :src="image" mode="aspectFill" style="width: 100%; height: 100%;" />
        </button>
      </view>
      <button v-manga-a11y v-if="comment.articleTitle && !isFolded" class="comment-source" type="button"
        :aria-label="'跳转到章节：' + comment.articleTitle" @click="openSourceChapter">
        <manga-icon name="book" />来自 {{ comment.articleTitle }}
      </button>
      <view class="comment-actions" v-if="!isFolded">
        <button v-manga-a11y class="action-button" :class="{ liked: comment.praiseType === 0 }" type="button"
          :aria-pressed="comment.praiseType === 0 ? 'true' : 'false'" @click="$emit('praise', comment)">
          <manga-icon :name="comment.praiseType === 0 ? 'heartFilled' : 'heart'" /><text>{{ comment.likeNum || '赞' }}</text>
        </button>
        <button v-manga-a11y class="action-button" type="button" @click="$emit('reply', replyTarget)">
          <manga-icon name="comment" /><text>回复</text>
        </button>
        <button v-manga-a11y class="action-button danger" type="button" v-if="comment.canModerate" @click="$emit('remove', comment)">
          <manga-icon name="trash" /><text>删除</text>
        </button>
      </view>
      <view v-if="visibleReplies.length" class="comment-replies">
        <button v-manga-a11y class="reply-row" type="button" v-for="reply in visibleReplies" :key="reply.commentId"
          @click="onReplyClick(reply)" @longpress="onReplyLongpress(reply)">
          <text class="reply-name">{{ reply.userName }}</text>
          <text v-if="reply.targetUserName" class="reply-target">回复 {{ reply.targetUserName }}</text>
          <text class="reply-body">：{{ reply.content }}</text>
        </button>
        <button v-manga-a11y v-if="comment.replies.length > collapsedReplyCount" class="reply-more" type="button"
          :aria-expanded="repliesExpanded ? 'true' : 'false'" @click="repliesExpanded = !repliesExpanded">
          {{ repliesExpanded ? '收起回复' : '查看全部 ' + comment.replies.length + ' 条回复' }}
        </button>
      </view>
    </view>
  </view>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
import MangaIcon from '@/components/manga-icon.vue';

export default {
  name: 'MangaCommentItem',
  directives: { mangaA11y: MangaA11y },
  components: { MangaIcon },
  props: {
    comment: { type: Object, required: true },
    highlight: { type: Boolean, default: false },
  },
  data() {
    return { isExpanded: false, repliesExpanded: false, collapsedReplyCount: 2, lastLongpressAt: 0 };
  },
  computed: {
    isWorkAuthor() {
      return Boolean(this.comment.workAuthorId) && String(this.comment.userId) === String(this.comment.workAuthorId);
    },
    isFolded() {
      return Number(this.comment.praiseType) === 1;
    },
    needsClamp() {
      return this.comment.content.length > 72 || this.comment.content.split('\n').length > 3;
    },
    visibleReplies() {
      return this.repliesExpanded ? this.comment.replies : this.comment.replies.slice(0, this.collapsedReplyCount);
    },
    // 根评论下的回复仍归到同一根评论，reply_to 决定被回复的那一条
    replyTarget() {
      return { rootCommentId: this.comment.commentId, replyToCommentId: this.comment.commentId, userName: this.comment.userName };
    },
  },
  methods: {
    openAuthor() { uni.navigateTo({ url: '/pages/users/personalPage?id=' + this.comment.userId }); },
    previewImage(current, urls) { uni.previewImage({ current, urls, indicator: 'number' }); },
    // 话评的"来自 xx"直达该话阅读页；作品级评论没有 articleId，不会渲染该按钮
    openSourceChapter() {
      if (!this.comment.articleId || !this.comment.novelId) return;
      uni.navigateTo({ url: '/pages/readers/mangaReader?id=' + this.comment.articleId + '&novelId=' + this.comment.novelId });
    },
    onReplyClick(reply) {
      // 长按松手后浏览器仍会补发 click，用时间戳挡掉，避免误打开回复框
      if (Date.now() - this.lastLongpressAt < 500) return;
      this.$emit('reply', { rootCommentId: this.comment.commentId, replyToCommentId: reply.commentId, userName: reply.userName });
    },
    onReplyLongpress(reply) {
      this.lastLongpressAt = Date.now();
      if (!reply.canModerate) return;
      uni.showActionSheet({
        itemList: ['删除'],
        success: (result) => {
          if (result.tapIndex === 0) this.$emit('remove-reply', { rootCommentId: this.comment.commentId, reply });
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
// 按钮样式都挂在根类下，压过页面级 `.manga-page[data-v] :where(uni-button)` 的同名 reset（H5 中 button 编译为 uni-button）
.manga-comment { display: flex; gap: 18rpx; padding: 26rpx 0; border-bottom: 1rpx solid var(--manga-line); }
.manga-comment:last-child { border-bottom: 0; }
.manga-comment.is-highlight { margin: 0 -20rpx; padding-left: 20rpx; padding-right: 20rpx; background: var(--manga-tint); border-radius: 16rpx; }
:where(button) { margin: 0; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; line-height: inherit; border-radius: 0; text-align: left; }
:where(button)::after { display: none; }
.manga-comment .avatar-button { flex: none; width: 72rpx; height: 72rpx; }
.comment-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; }
.comment-main { flex: 1; min-width: 0; }
.comment-head { display: flex; align-items: center; gap: 10rpx; }
.comment-name { font-size: 26rpx; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.author-badge { flex: none; border-radius: 100rpx; padding: 3rpx 12rpx; background: var(--manga-tint); color: var(--manga-accent); font-size: 20rpx; font-weight: 600; }
.comment-time { display: block; margin-top: 2rpx; color: var(--manga-muted); font-size: 21rpx; }
.comment-body { display: block; margin-top: 12rpx; font-size: 27rpx; line-height: 1.65; white-space: pre-line; word-break: break-word; }
.comment-body.clamped { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-line; }
.manga-comment .comment-toggle { display: inline-block; margin-top: 6rpx; color: var(--manga-accent); font-size: 24rpx; font-weight: 600; }
.comment-folded { display: block; margin-top: 12rpx; color: var(--manga-muted); font-size: 25rpx; font-style: italic; }
.comment-images { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 16rpx; }
.manga-comment .comment-image { width: 168rpx; height: 168rpx; overflow: hidden; border-radius: 12rpx; background: var(--manga-bg); }
.comment-image ::v-deep img { width: 100%; height: 100%; display: block; }
.manga-comment .comment-source { display: flex; align-items: center; gap: 8rpx; width: 100%; margin-top: 14rpx; padding: 10rpx 16rpx; border-radius: 12rpx; background: var(--manga-bg); color: var(--manga-muted); font-size: 22rpx; text-align: left; }
.manga-comment .comment-source:active { color: var(--manga-accent); }
.comment-actions { display: flex; align-items: center; gap: 28rpx; margin-top: 14rpx; }
.manga-comment .action-button { display: inline-flex; align-items: center; gap: 8rpx; min-height: 60rpx; padding: 0 4rpx; color: var(--manga-muted); font-size: 23rpx; }
.action-button .manga-icon { font-size: 26rpx; }
.manga-comment .action-button.liked { color: var(--manga-accent); }
.manga-comment .action-button.danger { margin-left: auto; }
.comment-replies { margin-top: 14rpx; padding: 14rpx 18rpx; border-radius: 14rpx; background: var(--manga-bg); }
.manga-comment .reply-row { display: block; width: 100%; padding: 8rpx 0; font-size: 24rpx; line-height: 1.6; word-break: break-word; }
.reply-name { color: var(--manga-accent); font-weight: 600; }
.reply-target { margin: 0 6rpx; color: var(--manga-muted); }
.reply-body { color: var(--manga-text); }
.manga-comment .reply-more { display: block; width: 100%; padding-top: 10rpx; color: var(--manga-accent); font-size: 23rpx; font-weight: 600; }
</style>
