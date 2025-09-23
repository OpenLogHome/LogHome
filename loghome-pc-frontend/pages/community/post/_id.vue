<template>
  <div class="post-detail-page">
    <div class="post-detail-container">
      <!-- 左侧帖子详情 -->
      <div class="post-detail-main">
        <div class="post-detail" v-if="post">
          <!-- 帖子头部信息 -->
          <div class="post-header">
            <div class="user-info" @click="navigateToUser(post.user_id)">
              <img :src="post.author_avatar" alt="用户头像" class="user-avatar">
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
              <img
                v-for="(img, imgIndex) in post.media_urls"
                :key="imgIndex"
                :src="img"
                alt="帖子图片"
                class="post-image"
                @click="previewImage(post.media_urls, imgIndex)"
              >
            </div>
          </div>

          <!-- 绑定作品 -->
          <div class="linked-book" v-if="post.novel_id && post.novel">
            <div class="book-card" @click="navigateToNovel(post.novel_id)">
              <img :src="post.novel.picUrl" alt="作品封面" class="book-cover" @error="$event.target.src = '/static/default-book-cover.png'">
              <div class="book-info">
                <h4 class="book-name">{{ post.novel.name }}</h4>
                <p class="book-author">{{ post.novel.author_name }}</p>
                <p class="book-desc">{{ post.novel.content && post.novel.content.length > 50 ? post.novel.content.substr(0, 50) + '...' : post.novel.content }}</p>
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
              <i :class="post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off'" :style="{ color: post.is_liked ? '#EA7034' : '#666' }"></i>
              <span :class="{ liked: post.is_liked }">{{ post.like_count || 0 }}</span>
            </div>
            <div class="action-btn" @click="sharePost">
              <i class="el-icon-share"></i>
              <span>分享</span>
            </div>
            <!-- 根据权限显示编辑和删除按钮 -->
            <div class="post-owner-actions" v-if="canEditPost || canDeletePost">
              <el-button v-if="canEditPost" size="small" type="text" @click="editPost">编辑</el-button>
              <el-button v-if="canDeletePost" size="small" type="text" @click="confirmDeletePost">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧评论区 -->
      <div class="comments-section-sidebar">
        <div class="comments-section">
          <h3 class="comments-title">评论 ({{ post ? post.comment_count || 0 : 0 }})</h3>

          <!-- 评论输入框 -->
          <div class="comment-input-container" ref="commentInput">
            <el-input
              v-model="commentContent"
              type="textarea"
              :rows="2"
              placeholder="写下你的评论..."
              :maxlength="500"
              show-word-limit
            ></el-input>
            <div class="comment-actions">
              <el-button type="primary" @click="submitComment" :disabled="!commentContent.trim() || isSubmitting">发布评论</el-button>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list" v-if="comments.length > 0">
            <div class="comment-item" v-for="comment in comments" :key="comment.comment_id">
              <div class="comment-header">
                <div class="user-info" @click="navigateToUser(comment.user_id)">
                  <img :src="comment.user_avatar" alt="用户头像" class="user-avatar">
                  <div class="user-meta">
                    <span class="user-name">{{ comment.user_name }}</span>
                    <span class="comment-time">{{ formatTime(comment.create_time) }}</span>
                  </div>
                </div>
                <!-- 评论操作 -->
                <div class="comment-actions">
                  <el-dropdown trigger="click" v-if="isCommentOwner(comment) || isPostOwner">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="isCommentOwner(comment) || isPostOwner" @click.native="confirmDeleteComment(comment)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>

              <!-- 评论操作按钮 -->
              <div class="comment-footer">
                <div class="action-btn" @click="likeComment(comment)" :class="{ liked: comment.is_liked }">
                  <i :class="comment.is_liked ? 'el-icon-star-on' : 'el-icon-star-off'" :style="{ color: comment.is_liked ? '#EA7034' : '#666' }"></i>
                  <span :class="{ liked: comment.is_liked }">{{ comment.like_count || 0 }}</span>
                </div>
                <div class="action-btn" @click="replyToComment(comment)">
                  <i class="el-icon-chat-dot-round"></i>
                  <span>回复</span>
                </div>
              </div>

              <!-- 回复列表 -->
              <div class="replies-list" v-if="comment.replies && comment.replies.length > 0">
                <div class="reply-item" v-for="reply in comment.replies" :key="reply.comment_id">
                  <div class="reply-header">
                    <div class="user-info" @click="navigateToUser(reply.user_id)">
                      <img :src="reply.user_avatar" alt="用户头像" class="user-avatar-small">
                      <div class="user-meta">
                        <span class="user-name">{{ reply.user_name }}</span>
                        <span class="reply-time">{{ formatTime(reply.create_time) }}</span>
                      </div>
                    </div>
                    <!-- 回复操作 -->
                    <div class="reply-actions">
                      <el-dropdown trigger="click" v-if="isCommentOwner(reply) || isPostOwner">
                        <span class="el-dropdown-link">
                          <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="isCommentOwner(reply) || isPostOwner" @click.native="confirmDeleteComment(reply)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                  <div class="reply-content">
                    <span class="reply-to" v-if="reply.reply_to_user_id && reply.reply_to_user_id !== comment.user_id">回复 {{ reply.reply_user_name }}：</span>
                    {{ reply.content }}
                  </div>

                  <!-- 回复操作按钮 -->
                  <div class="reply-footer">
                    <div class="action-btn" @click="likeComment(reply)" :class="{ liked: reply.is_liked }">
                      <i :class="reply.is_liked ? 'el-icon-star-on' : 'el-icon-star-off'" :style="{ color: reply.is_liked ? '#EA7034' : '#666' }"></i>
                      <span :class="{ liked: reply.is_liked }">{{ reply.like_count || 0 }}</span>
                    </div>
                    <div class="action-btn" @click="replyToComment(reply, comment)">
                      <i class="el-icon-chat-dot-round"></i>
                      <span>回复</span>
                    </div>
                  </div>
                </div>

                <!-- 加载更多回复 -->
                <div class="load-more-replies" v-if="comment.has_more_replies" @click="loadMoreReplies(comment)">
                  <span>加载更多回复</span>
                </div>
              </div>

              <!-- 回复输入框 -->
              <div class="reply-input-container" v-if="replyingTo && replyingTo.comment_id === comment.comment_id">
                <el-input
                  v-model="replyContent"
                  type="textarea"
                  :rows="1"
                  :placeholder="replyingTo.reply_user_name ? `回复 ${replyingTo.reply_user_name}...` : '写下你的回复...'"
                  :maxlength="500"
                  show-word-limit
                ></el-input>
                <div class="reply-actions">
                  <el-button size="small" @click="cancelReply">取消</el-button>
                  <el-button size="small" type="primary" @click="submitReply" :disabled="!replyContent.trim() || isSubmitting">回复</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 没有评论时显示 -->
          <div class="no-comments" v-else>
            <i class="el-icon-chat-dot-round"></i>
            <p>暂无评论，快来发表第一条评论吧</p>
          </div>

          <!-- 加载更多评论 -->
          <div class="load-more" v-if="hasMoreComments">
            <el-button @click="loadMoreComments" :loading="loadingComments">加载更多评论</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享对话框 -->
    <el-dialog
      title="分享帖子"
      :visible.sync="shareDialogVisible"
      width="400px"
      center
    >
      <div class="share-dialog-content">
        <p class="share-text">{{ shareText }}</p>
        <el-input
          v-model="shareText"
          type="textarea"
          :rows="4"
          readonly
        ></el-input>
        <div class="share-actions">
          <el-button type="primary" @click="copyShareText">复制链接</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  head() {
    return {
      title: this.post ? `${this.post.title} - LogHome社区` : 'LogHome社区',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post ? `${this.post.content.substring(0, 100)}...` : 'LogHome社区帖子详情'
        }
      ]
    }
  },
  
  async asyncData({ params, $api, error }) {
    try {
      const postId = params.id
      const post = await $api.community.getPostDetail({ post_id: postId })
      
      // 获取评论
      const commentsRes = await $api.community.getComments({
        post_id: postId,
        page: 1,
        pageSize: 10
      })
      
      // 处理评论数据，确保格式一致
      const comments = commentsRes.list || []
      comments.forEach(comment => {
        // 确保replies字段存在
        if (!comment.replies) {
          comment.replies = []
        }
        
        // 处理媒体URL
        if (comment.image_url) {
          comment.media_urls = [comment.image_url]
        } else {
          comment.media_urls = []
        }
        
        // 处理回复的媒体URL
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.image_url) {
              reply.media_urls = [reply.image_url]
            } else {
              reply.media_urls = []
            }
          })
        }
      })
      
      return {
        post,
        comments: comments,
        commentPage: 1,
        hasMoreComments: commentsRes.has_more || false,
        totalComments: commentsRes.total || 0
      }
    } catch (err) {
      console.error('获取帖子详情失败:', err)
      error({ statusCode: 404, message: '帖子不存在或已被删除' })
      return {}
    }
  },
  
  data() {
    return {
      commentContent: '',
      replyContent: '',
      replyingTo: null,
      isSubmitting: false,
      loadingComments: false,
      shareDialogVisible: false,
      shareText: '',
      currentUserId: null,
      isLogin: false,
      userInfo: null,
      userRole: -1 // -1: 未知, 0: 普通成员, 1: 管理员, 2: 圈主
    }
  },
  
  computed: {
    isPostOwner() {
      return this.currentUserId && this.post && this.currentUserId === this.post.user_id
    },
    
    canDeletePost() {
      if (!this.userInfo || !this.post) return false
      // 管理员/圈主/作者可删除
      return this.userInfo.is_admin == 1 || 
             this.userInfo.user_id == this.post.user_id || 
             this.userRole == 1 || 
             this.userRole == 2
    },
    
    canEditPost() {
      if (!this.userInfo || !this.post) return false;
      console.log(this.userInfo);
      // 作者可编辑
      return this.userInfo.user_id == this.post.user_id
    }
  },
  
  mounted() {
    this.checkLoginStatus()
    this.getPostLikeStatus()
    this.getCommentsLikeStatus()
    this.loadInitialReplies()
    this.getUserRole()
  },
  
  methods: {
    checkLoginStatus() {
      try {
        const token = localStorage.getItem('token')
        this.isLogin = !!token
        
        if (this.isLogin) {
          this.getUserInfo()
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
        this.isLogin = false
      }
    },
    
    async getUserInfo() {
      try {
        const user = await this.$api.users.getUserProfile()
        this.userInfo = user
        this.currentUserId = user.user_id
        // 缓存用户信息
        localStorage.setItem('userInfo', JSON.stringify(user))
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    formatTime(time) {
      const now = moment()
      const postTime = moment(time)
      const diff = now.diff(postTime, 'minutes')
      
      if (diff < 1) return '刚刚'
      if (diff < 60) return `${diff}分钟前`
      
      const hourDiff = now.diff(postTime, 'hours')
      if (hourDiff < 24) return `${hourDiff}小时前`
      
      const dayDiff = now.diff(postTime, 'days')
      if (dayDiff < 30) return `${dayDiff}天前`
      
      return postTime.format('YYYY-MM-DD')
    },
    
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`)
    },
    
    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`)
    },
    
    navigateToNovel(novelId) {
      this.$router.push(`/novel/${novelId}`)
    },
    
    previewImage(images, index) {
      // 使用Element UI的图片预览功能
      const h = this.$createElement
      this.$imagePreview({
        images,
        index
      })
    },
    
    async getPostLikeStatus() {
      try {
        if (!this.isLogin || !this.post) return
        
        const res = await this.$api.community.getLikeStatus({
          target_id: this.post.post_id,
          target_type: 1 // 1表示帖子
        })
        
        this.$set(this.post, 'is_liked', res.liked)
      } catch (error) {
        console.error('获取帖子点赞状态失败:', error)
      }
    },
    
    async getCommentsLikeStatus() {
      try {
        if (!this.isLogin || !this.comments.length) return
        
        for (const comment of this.comments) {
          try {
            const res = await this.$api.community.getLikeStatus({
              target_id: comment.comment_id,
              target_type: 2 // 2表示评论
            })
            
            this.$set(comment, 'is_liked', res.liked)
            
            // 获取回复的点赞状态
            if (comment.replies && comment.replies.length) {
              for (const reply of comment.replies) {
                try {
                  const replyRes = await this.$api.community.getLikeStatus({
                    target_id: reply.comment_id,
                    target_type: 2 // 2表示评论
                  })
                  
                  this.$set(reply, 'is_liked', replyRes.liked)
                } catch (err) {
                  console.error(`获取回复 ${reply.comment_id} 点赞状态失败:`, err)
                }
              }
            }
          } catch (err) {
            console.error(`获取评论 ${comment.comment_id} 点赞状态失败:`, err)
          }
        }
      } catch (error) {
        console.error('获取评论点赞状态失败:', error)
      }
    },
    
    async likePost() {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录')
          return
        }
        
        const action = this.post.is_liked ? 'unlike' : 'like'
        await this.$api.community.likeTarget({
          target_id: this.post.post_id,
          target_type: 1, // 1表示帖子
          action
        })
        
        // 更新点赞状态和数量
        this.$set(this.post, 'is_liked', !this.post.is_liked)
        this.$set(this.post, 'like_count', this.post.is_liked ? 
          (this.post.like_count || 0) + 1 : 
          Math.max((this.post.like_count || 0) - 1, 0))
      } catch (error) {
        console.error('点赞操作失败:', error)
        this.$message.error('操作失败，请稍后重试')
      }
    },
    
    async likeComment(comment) {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录')
          return
        }
        
        const action = comment.is_liked ? 'unlike' : 'like'
        await this.$api.community.likeTarget({
          target_id: comment.comment_id,
          target_type: 2, // 2表示评论
          action
        })
        
        // 更新点赞状态和数量
        this.$set(comment, 'is_liked', !comment.is_liked)
        this.$set(comment, 'like_count', comment.is_liked ? 
          (comment.like_count || 0) + 1 : 
          Math.max((comment.like_count || 0) - 1, 0))
      } catch (error) {
        console.error('点赞评论失败:', error)
        this.$message.error('操作失败，请稍后重试')
      }
    },
    
    sharePost() {
      const shareUrl = `${window.location.origin}/community/post/${this.post.post_id}`
      this.shareText = `来自LogHome社区的分享：${this.post.title}\n${this.post.content.substring(0, 50)}${this.post.content.length > 50 ? '...' : ''}\n点击链接查看详情：${shareUrl}`
      this.shareDialogVisible = true
    },

    editPost() {
      this.$router.push({ path: '/community/post/edit', query: { post_id: this.post.post_id } });
    },
    
    async getUserRole() {
      try {
        if (!this.isLogin || !this.post || !this.post.circle_id) {
          this.userRole = 0
          return
        }
        
        const circles = await this.$api.community.getMyCircles()
        if (circles && circles.length > 0) {
          const circle = circles.find(c => c.circle_id == this.post.circle_id)
          if (circle) {
            this.userRole = circle.role
          } else {
            this.userRole = 0
          }
        } else {
          this.userRole = 0
        }
      } catch (error) {
        console.error('获取用户角色失败:', error)
        this.userRole = 0
      }
    },
    
    confirmDeletePost() {
      this.$confirm('确定要删除该帖子吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          console.log(this.post);
          await this.$api.community.deletePost(this.post.post_id)
          this.$message.success('删除成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 1200)
        } catch (error) {
          console.error('删除帖子失败:', error)
          this.$message.error('删除失败，请稍后重试')
        }
      }).catch(() => {
        // 用户取消删除
      })
    },
    
    copyShareText() {
      const textarea = document.createElement('textarea')
      textarea.value = this.shareText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      
      this.$message.success('已复制到剪贴板')
      this.shareDialogVisible = false
    },
    
    toggleCommentInput() {
      if (this.$refs.commentInput) {
        this.$refs.commentInput.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => {
          const textarea = this.$refs.commentInput.querySelector('textarea')
          if (textarea) textarea.focus()
        }, 300)
      }
    },
    
    async submitComment() {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录')
          return
        }
        
        if (!this.commentContent.trim()) {
          this.$message.warning('评论内容不能为空')
          return
        }
        
        this.isSubmitting = true
        
        const res = await this.$api.community.createComment({
          post_id: this.post.post_id,
          content: this.commentContent.trim()
        })
        
        // 添加新评论到列表顶部
        const newComment = {
          ...res.comment, // 使用返回的评论数据
          user_name: res.comment.user_name || this.userInfo.nickname,
          user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
          create_time: res.comment.create_time || new Date().toISOString(),
          like_count: res.comment.like_count || 0,
          is_liked: false,
          replies: []
        }
        
        this.comments.unshift(newComment)
        
        // 更新帖子评论数
        this.$set(this.post, 'comment_count', (this.post.comment_count || 0) + 1)
        
        // 清空输入框
        this.commentContent = ''
        
        this.$message.success('评论成功')
      } catch (error) {
        console.error('发表评论失败:', error)
        this.$message.error('评论失败，请稍后重试')
      } finally {
        this.isSubmitting = false
      }
    },
    
    replyToComment(comment, parentComment = null) {
      if (!this.isLogin) {
        this.$message.warning('请先登录')
        return
      }
      
      // 如果是回复一个回复，那么parentComment就是被回复的那个评论
      // 如果是回复一个评论，那么parentComment就是null
      const replyToUser = parentComment ? comment : null
      const targetComment = parentComment || comment
      
      this.replyingTo = {
        comment_id: targetComment.comment_id,
        parent_id: targetComment.comment_id,
        reply_to_comment_id: comment.comment_id,
        reply_to_user_id: comment.user_id,
        reply_user_name: comment.user_name
      }
      
      // 滚动到回复框并聚焦
      this.$nextTick(() => {
        const replyInput = this.$el.querySelector(`.comment-item[data-comment-id="${targetComment.comment_id}"] .reply-input-container`)
        if (replyInput) {
          replyInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(() => {
            const textarea = replyInput.querySelector('textarea')
            if (textarea) textarea.focus()
          }, 300)
        }
      })
    },
    
    cancelReply() {
      this.replyingTo = null
      this.replyContent = ''
    },
    
    async submitReply() {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录')
          return
        }
        
        if (!this.replyContent.trim()) {
          this.$message.warning('回复内容不能为空')
          return
        }
        
        this.isSubmitting = true
        
        const res = await this.$api.community.createComment({
          post_id: this.post.post_id,
          content: this.replyContent.trim(),
          parent_id: this.replyingTo.parent_id,
          reply_to_comment_id: this.replyingTo.reply_to_comment_id
        })
        
        // 找到对应的评论
        const parentComment = this.comments.find(c => c.comment_id === this.replyingTo.parent_id)
        if (parentComment) {
          const newReply = {
            ...res.comment,
            user_name: res.comment.user_name || this.userInfo.nickname,
            user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
            create_time: res.comment.create_time || new Date().toISOString(),
            like_count: res.comment.like_count || 0,
            is_liked: false,
            reply_user_name: this.replyingTo.reply_user_name
          }
          
          if (!parentComment.replies) {
            this.$set(parentComment, 'replies', [])
          }
          parentComment.replies.push(newReply)
        }
        
        // 更新帖子评论数
        this.$set(this.post, 'comment_count', (this.post.comment_count || 0) + 1)
        
        // 清空输入框并取消回复状态
        this.cancelReply()
        
        this.$message.success('回复成功')
      } catch (error) {
        console.error('发表回复失败:', error)
        this.$message.error('回复失败，请稍后重试')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async loadMoreComments() {
      if (this.loadingComments) return
      
      this.loadingComments = true
      try {
        const nextPage = this.commentPage + 1
        const res = await this.$api.community.getComments({
          post_id: this.post.post_id,
          page: nextPage,
          pageSize: 10
        })
        
        const newComments = res.list || []
        
        // 处理新加载的评论
        newComments.forEach(comment => {
          if (!comment.replies) {
            comment.replies = []
          }
        })
        
        this.comments.push(...newComments)
        this.commentPage = nextPage
        this.hasMoreComments = res.has_more || false
        
        // 获取新加载评论的点赞状态
        this.getCommentsLikeStatus()
        // 加载新评论的初始回复
        this.loadInitialReplies(newComments)
        
      } catch (error) {
        console.error('加载更多评论失败:', error)
        this.$message.error('加载失败，请稍后重试')
      } finally {
        this.loadingComments = false
      }
    },
    
    async loadInitialReplies(commentsToLoad = this.comments) {
      // 为每个评论加载前几条回复
      for (const comment of commentsToLoad) {
        if (comment.reply_count > 0 && (!comment.replies || comment.replies.length === 0)) {
          await this.loadMoreReplies(comment, true)
        }
      }
    },
    
    async loadMoreReplies(comment, isInitial = false) {
      try {
        const page = isInitial ? 1 : (comment.reply_page || 1) + 1
        const pageSize = isInitial ? 2 : 5 // 初始加载2条，后续加载5条
        
        const res = await this.$api.community.getReplies({
          comment_id: comment.comment_id,
          page,
          pageSize
        })
        
        const newReplies = res.list || []
        
        if (isInitial) {
          this.$set(comment, 'replies', newReplies)
        } else {
          comment.replies.push(...newReplies)
        }
        
        this.$set(comment, 'reply_page', page)
        this.$set(comment, 'has_more_replies', res.has_more || false)
        
        // 获取新加载回复的点赞状态
        this.getCommentsLikeStatus()
        
      } catch (error) {
        console.error(`加载更多回复失败 (评论ID: ${comment.comment_id}):`, error)
      }
    },
    
    isCommentOwner(comment) {
      return this.currentUserId && comment && this.currentUserId === comment.user_id
    },
    
    editPost() {
      this.$router.push(`/community/post/edit?post_id=${this.post.post_id}`)
    },
    
    async deletePost() {
      try {
        await this.$api.community.deletePost(this.post.post_id)
        this.$message.success('帖子删除成功')
        // 跳转到社区首页或上一个页面
        this.$router.push('/community')
      } catch (error) {
        console.error('删除帖子失败:', error)
        this.$message.error('删除失败，请稍后重试')
      }
    },
    
    confirmDeleteComment(comment) {
      this.$confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteComment(comment)
      }).catch(() => {
        // 用户取消删除
      })
    },
    
    async deleteComment(comment) {
      try {
        await this.$api.community.deleteComment({ comment_id: comment.comment_id })
        
        // 从UI中移除评论
        // 检查是一级评论还是回复
        if (comment.parent_id) {
          // 是回复
          const parentComment = this.comments.find(c => c.comment_id === comment.parent_id)
          if (parentComment && parentComment.replies) {
            const replyIndex = parentComment.replies.findIndex(r => r.comment_id === comment.comment_id)
            if (replyIndex > -1) {
              parentComment.replies.splice(replyIndex, 1)
            }
          }
        } else {
          // 是一级评论
          const commentIndex = this.comments.findIndex(c => c.comment_id === comment.comment_id)
          if (commentIndex > -1) {
            this.comments.splice(commentIndex, 1)
          }
        }
        
        // 更新帖子评论数
        this.$set(this.post, 'comment_count', Math.max((this.post.comment_count || 0) - 1, 0))
        
        this.$message.success('评论删除成功')
        
      } catch (error) {
        console.error('删除评论失败:', error)
        this.$message.error('删除失败，请稍后重试')
      }
    }
  }
}
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.comments-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
  color: #EA7034;
}

.action-btn i {
  font-size: 20px;
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

.comment-time, .reply-time {
  font-size: 12px;
  color: #999;
}

.comment-content, .reply-content {
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

.comment-footer, .reply-footer {
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
</style>