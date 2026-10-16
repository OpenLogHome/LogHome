<template>
  <Workspace :title="$t('帖子详情')" active="/community">
    <div class="post-detail-page">
      <div class="post-detail-container">
        <!-- 左侧帖子详情 -->
        <div class="post-detail-main">
          <div class="post-detail" v-if="post">
            <!-- 帖子头部信息 -->
            <div class="post-header">
              <div class="user-info" @click="navigateToUser(post.user_id)">
                <Avatar
                  :src="post.author_avatar"
                  :frame="post.author_avatar_frame || post.avatar_frame"
                  :size="40"
                />
                <div class="user-meta">
                  <span class="user-name">{{ post.author_name }}</span>
                  <span class="post-time">{{ formatTime(post.create_time) }}</span>
                </div>
              </div>
              <div class="post-circle" @click="navigateToCircle(post.circle_id)">
                {{ post.circle_name }}
              </div>
            </div>

            <!-- 帖子内容 -->
            <div class="post-content">
              <h1 class="post-title">{{ post.title }}</h1>
              <p class="post-text">{{ post.content }}</p>
            </div>

            <!-- 帖子图片 -->
            <div class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
              <div class="image-grid">
                <div
                  v-for="(img, imgIndex) in post.media_urls"
                  :key="imgIndex"
                  class="post-image-item"
                >
                  <button
                    class="post-image-preview"
                    :aria-label="$t('查看第 {p0} 张图片', { p0: imgIndex + 1 })"
                    @click="previewImage(post.media_urls, imgIndex)"
                  >
                    <img :src="img" :alt="$t('帖子图片')" class="post-image" />
                  </button>
                  <button
                    class="sticker-save"
                    :disabled="!!savingSticker"
                    @click="favoriteImage(img)"
                  >
                    {{ savingSticker === img ? $t("收藏中…") : $t("收藏为表情") }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 绑定作品 -->
            <div class="linked-book" v-if="post.novel_id && post.novel">
              <div class="book-card" @click="navigateToNovel(post.novel_id)">
                <img
                  :src="post.novel.picUrl"
                  :alt="$t('作品封面')"
                  class="book-cover"
                  @error="$event.target.src = '/default-book-cover.png'"
                />
                <div class="book-info">
                  <h4 class="book-name">{{ post.novel.name }}</h4>
                  <p class="book-author">{{ post.novel.author_name }}</p>
                  <p class="book-desc">
                    {{
                      post.novel.content && post.novel.content.length > 50
                        ? post.novel.content.substr(0, 50) + "..."
                        : post.novel.content
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 帖子操作 -->
            <div class="post-actions">
              <div class="action-btn" @click="toggleCommentInput">
                <i class="el-icon-chat-dot-round"></i>
                <span>{{ post.comment_count || 0 }}</span>
              </div>
              <div class="action-btn" @click="likePost" :class="{ liked: post.is_liked }">
                <SiteIcon
                  name="heart"
                  :filled="!!post.is_liked"
                  class="like-icon"
                  :style="{ color: post.is_liked ? '#EA7034' : '#666' }"
                />
                <span :class="{ liked: post.is_liked }">{{ post.like_count || 0 }}</span>
              </div>
              <div class="action-btn" @click="sharePost">
                <i class="el-icon-share"></i>
                <span>{{ $t("分享") }}</span>
              </div>
              <!-- 根据权限显示编辑和删除按钮 -->
              <div class="post-owner-actions" v-if="canEditPost || canDeletePost">
                <el-button
                  v-if="canEditPost"
                  size="small"
                  type="text"
                  @click="editPost"
                  >{{ $t("编辑") }}</el-button
                >
                <el-button
                  v-if="canDeletePost"
                  size="small"
                  type="text"
                  @click="confirmDeletePost"
                  >{{ $t("删除") }}</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧评论区 -->
        <div class="comments-section-sidebar">
          <div class="comments-section">
            <h3 class="comments-title">
              {{ $t("评论 ({p0})", { p0: post ? post.comment_count || 0 : 0 }) }}
            </h3>

            <!-- 评论输入框 -->
            <div class="comment-input-container" ref="commentInput">
              <CommentComposer
                ref="composer"
                :submitting="isSubmitting"
                @submit="submitComment"
              />
            </div>

            <!-- 评论列表 -->
            <div class="comments-list" v-if="comments.length > 0">
              <div
                class="comment-item"
                v-for="comment in comments"
                :key="comment.comment_id"
              >
                <div class="comment-header">
                  <div class="user-info" @click="navigateToUser(comment.user_id)">
                    <Avatar
                      :src="comment.user_avatar"
                      :frame="comment.user_avatar_frame"
                      :size="36"
                    />
                    <div class="user-meta">
                      <span class="user-name">{{ comment.user_name }}</span>
                      <span class="comment-time">{{
                        formatTime(comment.create_time)
                      }}</span>
                    </div>
                  </div>
                  <!-- 评论操作 -->
                  <div class="comment-actions">
                    <el-dropdown trigger="click" v-if="canDeleteComment(comment)">
                      <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="canDeleteComment(comment)"
                          @click.native="confirmDeleteComment(comment)"
                          >{{ $t("删除") }}</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <button
                  v-if="comment.image_url"
                  class="comment-image-button"
                  @click="previewImage([comment.image_url], 0)"
                >
                  <img :src="comment.image_url" :alt="$t('评论配图')" />
                </button>

                <button
                  v-if="comment.image_url"
                  class="sticker-save"
                  :disabled="!!savingSticker"
                  @click="favoriteImage(comment.image_url)"
                >
                  {{ $t("收藏为表情") }}
                </button>
                <!-- 评论操作按钮 -->
                <div class="comment-footer">
                  <div
                    class="action-btn"
                    @click="likeComment(comment)"
                    :class="{ liked: comment.is_liked }"
                  >
                    <SiteIcon
                      name="heart"
                      :filled="!!comment.is_liked"
                      class="like-icon"
                      :style="{ color: comment.is_liked ? '#EA7034' : '#666' }"
                    />
                    <span :class="{ liked: comment.is_liked }">{{
                      comment.like_count || 0
                    }}</span>
                  </div>
                  <div class="action-btn" @click="replyToComment(comment)">
                    <i class="el-icon-chat-dot-round"></i>
                    <span>{{ $t("回复") }}</span>
                  </div>
                </div>

                <!-- 回复列表 -->
                <div
                  class="replies-list"
                  v-if="comment.replies && comment.replies.length > 0"
                >
                  <div
                    class="reply-item"
                    v-for="reply in comment.replies"
                    :key="reply.comment_id"
                  >
                    <div class="reply-header">
                      <div class="user-info" @click="navigateToUser(reply.user_id)">
                        <Avatar
                          :src="reply.user_avatar"
                          :frame="reply.user_avatar_frame"
                          :size="28"
                        />
                        <div class="user-meta">
                          <span class="user-name">{{ reply.user_name }}</span>
                          <span class="reply-time">{{
                            formatTime(reply.create_time)
                          }}</span>
                        </div>
                      </div>
                      <!-- 回复操作 -->
                      <div class="reply-actions">
                        <el-dropdown trigger="click" v-if="canDeleteComment(reply)">
                          <span class="el-dropdown-link">
                            <i class="el-icon-more"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-if="canDeleteComment(reply)"
                              @click.native="confirmDeleteComment(reply, comment)"
                              >{{ $t("删除") }}</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                    <div class="reply-content">
                      <span
                        class="reply-to"
                        v-if="
                          reply.reply_to_user_id &&
                          reply.reply_to_user_id !== comment.user_id
                        "
                        >{{ $t("回复 {p0}：", { p0: reply.reply_user_name }) }}</span
                      >
                      {{ reply.content }}
                    </div>

                    <button
                      v-if="reply.image_url"
                      class="comment-image-button"
                      @click="previewImage([reply.image_url], 0)"
                    >
                      <img :src="reply.image_url" :alt="$t('回复配图')" />
                    </button>
                    <button
                      v-if="reply.image_url"
                      class="sticker-save"
                      :disabled="!!savingSticker"
                      @click="favoriteImage(reply.image_url)"
                    >
                      {{ $t("收藏为表情") }}
                    </button>
                    <!-- 回复操作按钮 -->
                    <div class="reply-footer">
                      <div
                        class="action-btn"
                        @click="likeComment(reply)"
                        :class="{ liked: reply.is_liked }"
                      >
                        <SiteIcon
                          name="heart"
                          :filled="!!reply.is_liked"
                          class="like-icon"
                          :style="{
                            color: reply.is_liked ? '#EA7034' : '#666',
                          }"
                        />
                        <span :class="{ liked: reply.is_liked }">{{
                          reply.like_count || 0
                        }}</span>
                      </div>
                      <div class="action-btn" @click="replyToComment(reply, comment)">
                        <i class="el-icon-chat-dot-round"></i>
                        <span>{{ $t("回复") }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 加载更多回复 -->
                  <div
                    class="load-more-replies"
                    v-if="comment.has_more_replies"
                    @click="loadMoreReplies(comment)"
                  >
                    <span>{{ $t("加载更多回复") }}</span>
                  </div>
                </div>

                <!-- 回复输入框 -->
                <div
                  class="reply-input-container"
                  v-if="replyingTo && replyingTo.comment_id === comment.comment_id"
                >
                  <CommentComposer
                    :reply-to="{ targetUserName: replyingTo.reply_user_name }"
                    :submitting="isSubmitting"
                    @cancel-reply="cancelReply"
                    @submit="submitReply"
                  />
                </div>
              </div>
            </div>

            <!-- 没有评论时显示 -->
            <div class="no-comments" v-else>
              <i class="el-icon-chat-dot-round"></i>
              <p>{{ $t("暂无评论，快来发表第一条评论吧") }}</p>
            </div>

            <!-- 加载更多评论 -->
            <div class="load-more" v-if="hasMoreComments">
              <el-button @click="loadMoreComments" :loading="loadingComments">{{
                $t("加载更多评论")
              }}</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分享对话框 -->
      <el-dialog
        :title="$t('分享帖子')"
        :visible.sync="shareDialogVisible"
        width="400px"
        center
      >
        <div class="share-dialog-content">
          <p class="share-text">{{ shareText }}</p>
          <el-input v-model="shareText" type="textarea" :rows="4" readonly></el-input>
          <div class="share-actions">
            <el-button type="primary" @click="copyShareText">{{
              $t("复制链接")
            }}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </Workspace>
</template>

<script>
import Workspace from "~/components/social/Workspace.vue";
import Avatar from "~/components/social/Avatar.vue";
import CommentComposer from "~/components/social/CommentComposer.vue";
import SiteIcon from "~/components/ui/SiteIcon.vue";
import { postShareMessage } from "~/utils/social";
import social, { socialRequest } from "~/plugins/api/social";
import moment from "moment";
import { readingToken } from "~/plugins/api/reading";
import { saveImageAsReaderSticker } from "~/utils/reader-stickers";

export default {
  components: { Workspace, Avatar, CommentComposer, SiteIcon },
  head() {
    return {
      title: this.post ? `${this.post.title} - LogHome社区` : "LogHome社区",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.post
            ? `${String(this.post.content || "").substring(0, 100)}...`
            : "LogHome社区帖子详情",
        },
      ],
    };
  },

  async asyncData({ params, $api, error }) {
    try {
      const postId = params.id;
      const post = await $api.community.getPostDetail({ post_id: postId });

      // 获取评论
      const commentsRes = await $api.community.getComments({
        post_id: postId,
        page: 1,
        pageSize: 10,
      });

      // 处理评论数据，确保格式一致
      const comments = commentsRes.list || [];
      comments.forEach((comment) => {
        // 确保replies字段存在
        if (!comment.replies) {
          comment.replies = [];
        }

        // 处理媒体URL
        if (comment.image_url) {
          comment.media_urls = [comment.image_url];
        } else {
          comment.media_urls = [];
        }

        // 处理回复的媒体URL
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach((reply) => {
            if (reply.image_url) {
              reply.media_urls = [reply.image_url];
            } else {
              reply.media_urls = [];
            }
          });
        }
      });

      return {
        post,
        comments: comments,
        commentPage: 1,
        hasMoreComments: 10 < Number(commentsRes.total || 0),
        totalComments: commentsRes.total || 0,
      };
    } catch (err) {
      console.error("获取帖子详情失败:", err);
      error({ statusCode: 404, message: "帖子不存在或已被删除" });
      return {};
    }
  },

  data() {
    return {
      savingSticker: "",
      deletingComment: null,
      deletingPost: false,
      commentContent: "",
      replyContent: "",
      replyingTo: null,
      isSubmitting: false,
      likePending: false,
      loadingComments: false,
      sharing: false,
      shareDialogVisible: false,
      shareText: "",
      currentUserId: null,
      isLogin: false,
      userInfo: null,
      userRole: -1, // -1: 未知, 0: 普通成员, 1: 管理员, 2: 圈主
    };
  },

  computed: {
    isPostOwner() {
      return this.currentUserId && this.post && this.currentUserId === this.post.user_id;
    },

    canDeletePost() {
      if (!this.userInfo || !this.post) return false;
      // 管理员/圈主/作者可删除
      return (
        this.userInfo.is_admin == 1 ||
        this.userInfo.user_id == this.post.user_id ||
        this.userRole == 1 ||
        this.userRole == 2
      );
    },

    canEditPost() {
      if (!this.userInfo || !this.post) return false;
      console.log(this.userInfo);
      // 作者可编辑
      return this.userInfo.user_id == this.post.user_id;
    },
  },

  mounted() {
    this.checkLoginStatus();
    this.getPostLikeStatus();
    this.getCommentsLikeStatus();
    this.loadInitialReplies();
    this.getUserRole();
  },

  methods: {
    checkLoginStatus() {
      try {
        const token = localStorage.getItem("token");
        this.isLogin = !!token;

        if (this.isLogin) {
          this.getUserInfo();
        }
      } catch (error) {
        console.error("检查登录状态失败:", error);
        this.isLogin = false;
      }
    },

    async getUserInfo() {
      try {
        const user = await this.$api.users.getUserProfile();
        this.userInfo = user;
        this.currentUserId = user.user_id;
        // 缓存用户信息
        localStorage.setItem("userInfo", JSON.stringify(user));
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },

    formatTime(time) {
      const now = moment();
      const postTime = moment(time);
      const diff = now.diff(postTime, "minutes");

      if (diff < 1) return "刚刚";
      if (diff < 60) return `${diff}分钟前`;

      const hourDiff = now.diff(postTime, "hours");
      if (hourDiff < 24) return `${hourDiff}小时前`;

      const dayDiff = now.diff(postTime, "days");
      if (dayDiff < 30) return `${dayDiff}天前`;

      return postTime.format("YYYY-MM-DD");
    },

    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`);
    },

    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`);
    },

    navigateToNovel(novelId) {
      this.$router.push(`/novel/${novelId}`);
    },

    previewImage(images, index) {
      if (!images || !images.length) return;
      this.$preview(images, index || 0);
    },

    async getPostLikeStatus() {
      try {
        if (!this.isLogin || !this.post) return;

        const res = await this.$api.community.getLikeStatus({
          target_id: this.post.post_id,
          target_type: 1, // 1表示帖子
        });

        this.$set(this.post, "is_liked", res.liked);
      } catch (error) {
        console.error("获取帖子点赞状态失败:", error);
      }
    },

    async getCommentsLikeStatus() {
      try {
        if (!this.isLogin || !this.comments.length) return;

        for (const comment of this.comments) {
          try {
            const res = await this.$api.community.getLikeStatus({
              target_id: comment.comment_id,
              target_type: 2, // 2表示评论
            });

            this.$set(comment, "is_liked", res.liked);

            // 获取回复的点赞状态
            if (comment.replies && comment.replies.length) {
              for (const reply of comment.replies) {
                try {
                  const replyRes = await this.$api.community.getLikeStatus({
                    target_id: reply.comment_id,
                    target_type: 2, // 2表示评论
                  });

                  this.$set(reply, "is_liked", replyRes.liked);
                } catch (err) {
                  console.error(`获取回复 ${reply.comment_id} 点赞状态失败:`, err);
                }
              }
            }
          } catch (err) {
            console.error(`获取评论 ${comment.comment_id} 点赞状态失败:`, err);
          }
        }
      } catch (error) {
        console.error("获取评论点赞状态失败:", error);
      }
    },

    async likePost() {
      if (this.likePending) return;
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.likePending = true;
      try {
        const result = await socialRequest(
          "/community/interactions/like",
          {},
          "POST",
          { target_id: this.post.post_id, target_type: 1 },
          true
        );
        const previous = !!this.post.is_liked,
          next = !!result.liked;
        this.$set(this.post, "is_liked", next);
        this.$set(
          this.post,
          "like_count",
          Math.max(
            0,
            Number(this.post.like_count || 0) + (next === previous ? 0 : next ? 1 : -1)
          )
        );
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.likePending = false;
      }
    },
    async likeComment(comment) {
      if (comment.like_pending) return;
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.$set(comment, "like_pending", true);
      try {
        const result = await socialRequest(
          "/community/interactions/like",
          {},
          "POST",
          { target_id: comment.comment_id, target_type: 2 },
          true
        );
        const previous = !!comment.is_liked,
          next = !!result.liked;
        this.$set(comment, "is_liked", next);
        this.$set(
          comment,
          "like_count",
          Math.max(
            0,
            Number(comment.like_count || 0) + (next === previous ? 0 : next ? 1 : -1)
          )
        );
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.$set(comment, "like_pending", false);
      }
    },

    async sharePost() {
      if (this.sharing) return;
      if (!readingToken()) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.sharing = true;
      try {
        this.shareText = await social.sharePost(
          this.post.post_id,
          postShareMessage(this.post, window.location.origin)
        );
        this.shareDialogVisible = true;
        try {
          await navigator.clipboard.writeText(this.shareText);
          this.$message.success(this.$t("分享口令已复制"));
        } catch (_) {}
      } catch (error) {
        this.$message.error(error.message || this.$t("分享失败，请重试"));
      } finally {
        this.sharing = false;
      }
    },

    editPost() {
      this.$router.push({
        path: "/community/post/edit",
        query: { post_id: this.post.post_id },
      });
    },

    async getUserRole() {
      try {
        if (!this.isLogin || !this.post || !this.post.circle_id) {
          this.userRole = 0;
          return;
        }

        const circles = await this.$api.community.getMyCircles();
        if (circles && circles.length > 0) {
          const circle = circles.find((c) => c.circle_id == this.post.circle_id);
          if (circle) {
            this.userRole = circle.role;
          } else {
            this.userRole = 0;
          }
        } else {
          this.userRole = 0;
        }
      } catch (error) {
        console.error("获取用户角色失败:", error);
        this.userRole = 0;
      }
    },

    async confirmDeletePost() {
      if (this.deletingPost || !this.canDeletePost) return;
      const token = readingToken();
      try {
        await this.$confirm(this.$t("确定要删除该帖子吗？"), this.$t("确认删除"), {
          confirmButtonText: this.$t("删除"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        });
      } catch (_) {
        return;
      }
      if (!token || token !== readingToken()) return;
      await this.deletePost();
    },

    copyShareText() {
      const textarea = document.createElement("textarea");
      textarea.value = this.shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      this.$message.success(this.$t("已复制到剪贴板"));
      this.shareDialogVisible = false;
    },

    toggleCommentInput() {
      if (this.$refs.commentInput) {
        this.$refs.commentInput.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          const textarea = this.$refs.commentInput.querySelector("textarea");
          if (textarea) textarea.focus();
        }, 300);
      }
    },

    async submitComment(payload) {
      if (this.isSubmitting) return;
      if (payload) this.commentContent = payload.content || "";
      const image_url = (payload && payload.images && payload.images[0]) || null;
      try {
        if (!this.isLogin) {
          this.$message.warning(this.$t("请先登录"));
          return;
        }

        if (!this.commentContent.trim() && !image_url) {
          this.$message.warning(this.$t("评论内容不能为空"));
          return;
        }

        this.isSubmitting = true;

        const res = await socialRequest(
          "/community/comments/create",
          {},
          "POST",
          {
            post_id: this.post.post_id,
            content: this.commentContent.trim(),
            image_url,
          },
          true
        );

        // 添加新评论到列表顶部
        const newComment = {
          ...res.comment, // 使用返回的评论数据
          user_name: res.comment.user_name || this.userInfo.name,
          user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
          create_time: res.comment.create_time || new Date().toISOString(),
          like_count: res.comment.like_count || 0,
          is_liked: false,
          replies: [],
        };

        this.comments.unshift(newComment);

        // 更新帖子评论数
        this.$set(this.post, "comment_count", (this.post.comment_count || 0) + 1);

        // 清空输入框
        this.commentContent = "";
        if (this.$refs.composer) this.$refs.composer.reset();
        this.$message.success(this.$t("评论成功"));
      } catch (error) {
        console.error("发表评论失败:", error);
        this.$message.error(this.$t("评论失败，请稍后重试"));
      } finally {
        this.isSubmitting = false;
      }
    },

    replyToComment(comment, parentComment = null) {
      if (this.isSubmitting) return;
      if (!this.isLogin) {
        this.$message.warning(this.$t("请先登录"));
        return;
      }

      // 如果是回复一个回复，那么parentComment就是被回复的那个评论
      // 如果是回复一个评论，那么parentComment就是null
      const replyToUser = parentComment ? comment : null;
      const targetComment = parentComment || comment;

      this.replyingTo = {
        comment_id: targetComment.comment_id,
        parent_id: targetComment.comment_id,
        reply_to_comment_id: comment.comment_id,
        reply_to_user_id: comment.user_id,
        reply_user_name: comment.user_name,
      };

      // 滚动到回复框并聚焦
      this.$nextTick(() => {
        const replyInput = this.$el.querySelector(
          `.comment-item[data-comment-id="${targetComment.comment_id}"] .reply-input-container`
        );
        if (replyInput) {
          replyInput.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => {
            const textarea = replyInput.querySelector("textarea");
            if (textarea) textarea.focus();
          }, 300);
        }
      });
    },

    cancelReply() {
      this.replyingTo = null;
      this.replyContent = "";
    },

    async submitReply(payload) {
      if (this.isSubmitting || !this.replyingTo) return;
      if (payload) this.replyContent = payload.content || "";
      const image_url = (payload && payload.images && payload.images[0]) || null;
      try {
        if (!this.isLogin) {
          this.$message.warning(this.$t("请先登录"));
          return;
        }

        if (!this.replyContent.trim() && !image_url) {
          this.$message.warning(this.$t("回复内容不能为空"));
          return;
        }

        this.isSubmitting = true;

        const res = await socialRequest(
          "/community/comments/create",
          {},
          "POST",
          {
            post_id: this.post.post_id,
            content: this.replyContent.trim(),
            image_url,
            parent_id: this.replyingTo.reply_to_comment_id,
            reply_to_user_id: this.replyingTo.reply_to_user_id,
          },
          true
        );

        // 找到对应的评论
        const parentComment = this.comments.find(
          (c) => c.comment_id === this.replyingTo.parent_id
        );
        if (parentComment) {
          const newReply = {
            ...res.comment,
            user_name: res.comment.user_name || this.userInfo.name,
            user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
            create_time: res.comment.create_time || new Date().toISOString(),
            like_count: res.comment.like_count || 0,
            is_liked: false,
            reply_user_name: this.replyingTo.reply_user_name,
          };

          if (!parentComment.replies) {
            this.$set(parentComment, "replies", []);
          }
          parentComment.replies.push(newReply);
        }

        // 更新帖子评论数
        this.$set(this.post, "comment_count", (this.post.comment_count || 0) + 1);

        // 清空输入框并取消回复状态
        this.cancelReply();

        this.$message.success(this.$t("回复成功"));
      } catch (error) {
        console.error("发表回复失败:", error);
        this.$message.error(this.$t("回复失败，请稍后重试"));
      } finally {
        this.isSubmitting = false;
      }
    },

    async loadMoreComments() {
      if (this.loadingComments || !this.hasMoreComments) return;
      const postId = this.post.post_id;
      this.loadingComments = true;
      try {
        const nextPage = this.commentPage + 1;
        const res = await this.$api.community.getComments({
          post_id: this.post.post_id,
          page: nextPage,
          pageSize: 10,
        });

        if (this.post.post_id !== postId) return;
        if (!res || !Array.isArray(res.list) || !Number.isFinite(Number(res.total)))
          throw new Error("评论数据异常，请重试");
        const known = new Set(this.comments.map((item) => item.comment_id));
        const newComments = res.list.filter((item) => !known.has(item.comment_id));

        // 处理新加载的评论
        newComments.forEach((comment) => {
          if (!comment.replies) {
            comment.replies = [];
          }
        });

        this.comments.push(...newComments);
        this.commentPage = nextPage;
        this.hasMoreComments = nextPage * 10 < Number(res.total);
        this.totalComments = Number(res.total);

        // 获取新加载评论的点赞状态
        this.getCommentsLikeStatus();
        // 加载新评论的初始回复
        this.loadInitialReplies(newComments);
      } catch (error) {
        console.error("加载更多评论失败:", error);
        this.$message.error(this.$t("加载失败，请稍后重试"));
      } finally {
        this.loadingComments = false;
      }
    },

    async loadInitialReplies(commentsToLoad = this.comments) {
      // 为每个评论加载前几条回复
      for (const comment of commentsToLoad) {
        if (
          comment.reply_count > 0 &&
          (!comment.replies || comment.replies.length === 0)
        ) {
          await this.loadMoreReplies(comment, true);
        }
      }
    },

    async loadMoreReplies(comment, isInitial = false) {
      try {
        const page = isInitial ? 1 : (comment.reply_page || 1) + 1;
        const pageSize = isInitial ? 2 : 5; // 初始加载2条，后续加载5条

        const res = await this.$api.community.getCommentReplies({
          comment_id: comment.comment_id,
          page,
          pageSize,
        });

        const newReplies = res.list || [];

        if (isInitial) {
          this.$set(comment, "replies", newReplies);
        } else {
          comment.replies.push(...newReplies);
        }

        this.$set(comment, "reply_page", page);
        this.$set(comment, "has_more_replies", page * pageSize < (res.total || 0));

        // 获取新加载回复的点赞状态
        this.getCommentsLikeStatus();
      } catch (error) {
        console.error(`加载更多回复失败 (评论ID: ${comment.comment_id}):`, error);
      }
    },

    isCommentOwner(comment) {
      return this.currentUserId && comment && this.currentUserId === comment.user_id;
    },

    canDeleteComment(comment) {
      return (
        !!this.userInfo &&
        !!comment &&
        (Number(this.userInfo.user_id) === Number(comment.user_id) || this.canDeletePost)
      );
    },
    async favoriteImage(url) {
      if (this.savingSticker) return;
      const token = readingToken();
      if (!token) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.savingSticker = url;
      try {
        await saveImageAsReaderSticker(url, token);
        if (token === readingToken()) this.$message.success(this.$t("已添加到表情收藏"));
      } catch (error) {
        this.$message.error(error.message || this.$t("收藏失败，请重试"));
      } finally {
        this.savingSticker = "";
      }
    },
    async deletePost() {
      if (this.deletingPost || !this.canDeletePost) return;
      this.deletingPost = true;
      try {
        await socialRequest(
          `/community/posts/${this.post.post_id}`,
          {},
          "DELETE",
          null,
          true
        );
        this.$message.success(this.$t("帖子删除成功"));
        this.$router.push("/community");
      } catch (error) {
        this.$message.error(error.message || this.$t("删除失败，请稍后重试"));
      } finally {
        this.deletingPost = false;
      }
    },
    async confirmDeleteComment(comment, parentComment) {
      if (this.deletingComment || !this.canDeleteComment(comment)) return;
      const token = readingToken();
      try {
        await this.$confirm(this.$t("确定要删除这条评论吗？"), this.$t("确认删除"), {
          confirmButtonText: this.$t("删除"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        });
      } catch (_) {
        return;
      }
      if (!token || token !== readingToken()) return;
      await this.deleteComment(comment, parentComment);
    },
    async deleteComment(comment, parentComment) {
      if (this.deletingComment || !this.canDeleteComment(comment)) return;
      this.deletingComment = comment.comment_id;
      try {
        await socialRequest(
          `/community/comments/${comment.comment_id}`,
          {},
          "DELETE",
          null,
          true
        );
        let removed = 1;
        if (Number(comment.parent_id)) {
          const parent =
            parentComment ||
            this.comments.find(
              (c) =>
                c.comment_id === comment.root_id ||
                c.comment_id === comment.parent_id ||
                (c.replies || []).some((r) => r.comment_id === comment.comment_id)
            );
          if (parent) {
            const index = (parent.replies || []).findIndex(
              (r) => r.comment_id === comment.comment_id
            );
            if (index >= 0) parent.replies.splice(index, 1);
            this.$set(
              parent,
              "total_replies",
              Math.max(0, Number(parent.total_replies || parent.reply_count || 0) - 1)
            );
            this.$set(
              parent,
              "reply_count",
              Math.max(0, Number(parent.reply_count || 0) - 1)
            );
          }
        } else {
          const index = this.comments.findIndex(
            (c) => c.comment_id === comment.comment_id
          );
          if (index >= 0) this.comments.splice(index, 1);
          removed += Number(comment.reply_count || comment.total_replies || 0);
        }
        this.$set(
          this.post,
          "comment_count",
          Math.max(0, Number(this.post.comment_count || 0) - removed)
        );
        this.$message.success(this.$t("评论删除成功"));
      } catch (error) {
        this.$message.error(error.message || this.$t("删除失败，请稍后重试"));
      } finally {
        this.deletingComment = null;
      }
    },
  },
};
</script>

<style scoped>
.post-detail-page {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.post-detail-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
}

.post-detail-main {
  flex: 1;
  min-width: 0;
}

.comments-section-sidebar {
  width: 400px;
  flex-shrink: 0;
}

.post-detail {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comments-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 帖子头部 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  color: #333;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-circle {
  background-color: #f0f2f5;
  color: #666;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.post-circle:hover {
  background-color: #e4e6e9;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 24px;
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.post-text {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
}

/* 帖子图片 */
.post-images {
  margin-bottom: 24px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.post-image {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.post-image:hover {
  transform: scale(1.05);
}

/* 绑定作品 */
.linked-book {
  margin-bottom: 24px;
}

.book-card {
  display: flex;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.book-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.book-cover {
  width: 80px;
  height: 112px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book-name {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
}

.book-desc {
  font-size: 14px;
  color: #999;
  margin: 0;
  line-height: 1.5;
}

/* 帖子操作 */
.post-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s;
}

.action-btn:hover,
.action-btn.liked {
  color: #ea7034;
}

.action-btn i {
  font-size: 20px;
}
.action-btn .like-icon {
  width: 20px;
  height: 20px;
}

.post-owner-actions {
  margin-left: auto;
}

/* 评论区 */
.comments-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.comment-input-container {
  margin-bottom: 24px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.comment-time,
.reply-time {
  font-size: 12px;
  color: #999;
}

.comment-content,
.reply-content {
  font-size: 15px;
  color: #555;
  line-height: 1.7;
  margin-left: 56px; /* 48px avatar + 8px margin */
  white-space: pre-wrap;
}

.reply-content {
  margin-left: 32px; /* 24px avatar + 8px margin */
}

.reply-to {
  color: #007bff;
  margin-right: 4px;
}

.comment-footer,
.reply-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  margin-left: 56px;
}

.reply-footer {
  margin-left: 32px;
}

.replies-list {
  margin-top: 16px;
  margin-left: 56px;
  padding-left: 16px;
  border-left: 2px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reply-item {
  /* No extra styling needed now */
}

.load-more-replies {
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
  margin-top: 10px;
}

.reply-input-container {
  margin-top: 16px;
  margin-left: 56px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.no-comments i {
  font-size: 48px;
  margin-bottom: 16px;
}

.load-more {
  text-align: center;
  margin-top: 24px;
}

/* 分享对话框 */
.share-dialog-content {
  text-align: center;
}
.share-text {
  margin-bottom: 16px;
  white-space: pre-wrap;
  word-break: break-all;
  text-align: left;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}
.share-actions {
  margin-top: 16px;
}

/* These pages share the desktop workspace instead of adding another outer gutter. */
.friends-page,
.settings-page,
.post-detail-page,
.post-edit-container {
  padding: 0 !important;
  max-width: none !important;
}
.friends-card,
.settings-card,
.post-detail,
.comments-section {
  border: 1px solid var(--line, #e2e6eb) !important;
  border-radius: 14px !important;
  box-shadow: none !important;
  background: var(--surface, #ffffff) !important;
}
.post-detail-container {
  gap: 22px !important;
}
.post-detail-main {
  min-width: 0;
}
.post-detail-page {
  min-height: 0 !important;
}
.comment-image-button {
  border: 0;
  padding: 0;
  background: none;
  cursor: zoom-in;
  margin: 10px 0;
}
.comment-image-button img {
  display: block;
  width: 140px;
  max-height: 160px;
  object-fit: contain;
  border-radius: 8px;
}
</style>

<style scoped>
.post-image-preview {
  display: block;
  padding: 0;
  border: 0;
  background: none;
  width: 100%;
  cursor: zoom-in;
}
.post-image-preview img {
  display: block;
}
.sticker-save {
  display: block;
  margin: 8px 0;
  padding: 4px 0;
  border: 0;
  background: none;
  color: var(--wood, #795a3d);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.sticker-save:disabled {
  opacity: 0.5;
  cursor: default;
}
.sticker-save:focus-visible,
.post-image-preview:focus-visible {
  outline: 2px solid var(--wood, #795a3d);
  outline-offset: 3px;
}
</style>
