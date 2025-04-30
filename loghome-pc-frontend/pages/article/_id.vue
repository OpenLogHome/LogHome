<template>
  <div class="article-page">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载内容...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="goBack" class="back-button">返回</button>
    </div>

    <div v-else class="article-container">
      <!-- 固定的顶部导航栏 -->
      <div class="article-header sticky">
        <div class="header-content">
          <div class="novel-info">
            <div class="novel-title" @click="goToNovelDetail">{{ novel.name }}</div>
            <div class="chapter-nav">
              <button @click="navigateChapter('prev')" class="nav-btn" :disabled="!hasPrevious">
                <span class="nav-icon">←</span> 上一章
              </button>
              <button @click="goToNovelDetail" class="chapter-btn">
                <span class="nav-icon">≡</span> 目录
              </button>
              <button @click="navigateChapter('next')" class="nav-btn" :disabled="!hasNext">
                下一章 <span class="nav-icon">→</span>
              </button>
            </div>
          </div>
          <div class="reading-controls">
            <div class="control-item">
              <span class="control-label">字体：</span>
              <div class="control-buttons">
                <button @click="setFont('default')" :class="{ active: fontFamily === 'default' }">默认</button>
                <button @click="setFont('serif')" :class="{ active: fontFamily === 'serif' }">宋体</button>
                <button @click="setFont('sans-serif')" :class="{ active: fontFamily === 'sans-serif' }">黑体</button>
              </div>
            </div>
            <div class="control-item">
              <span class="control-label">字号：</span>
              <div class="control-buttons">
                <button @click="changeFontSize(-2)">A-</button>
                <button @click="resetFontSize">A</button>
                <button @click="changeFontSize(2)">A+</button>
              </div>
            </div>
            <div class="control-item">
              <span class="control-label">主题：</span>
              <div class="theme-controls">
                <button class="theme-btn light" :class="{ active: theme === 'light' }" @click="setTheme('light')"
                  title="浅色模式"></button>
                <button class="theme-btn sepia" :class="{ active: theme === 'sepia' }" @click="setTheme('sepia')"
                  title="护眼模式"></button>
                <button class="theme-btn dark" :class="{ active: theme === 'dark' }" @click="setTheme('dark')"
                  title="暗黑模式"></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="article-content-wrapper" :class="theme">

        <!-- 文章标题 -->
        <div class="article-title-container">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span>作者: {{ novel.author_name || '佚名' }}</span>
            <span>更新: {{ formatDate(article.update_time) }}</span>
            <span>字数: {{ formatNumber(article.text_count || 0) }}</span>
          </div>
        </div>

        <div class="article-content" :style="{
          fontSize: fontSize + 'px',
          fontFamily: getFontFamily
        }">
          <div v-if="article.content" v-html="formattedContent"></div>
          <div v-else class="empty-content">
            暂无内容
          </div>
        </div>

        <!-- 文章底部导航 -->
        <div class="article-footer">
          <div class="like-action">
            <button @click="toggleLike" class="like-btn" :class="{ active: isLiked }">
              <span class="like-icon">❤️</span>
              <span>{{ isLiked ? '已喜欢' : '喜欢' }}</span>
            </button>
          </div>
          <div class="chapter-nav">
            <button @click="navigateChapter('prev')" class="nav-btn" :disabled="!hasPrevious">
              <span class="nav-icon">←</span> 上一章
            </button>
            <button @click="goToNovelDetail" class="chapter-btn">
              <span class="nav-icon">≡</span> 目录
            </button>
            <button @click="navigateChapter('next')" class="nav-btn" :disabled="!hasNext">
              下一章 <span class="nav-icon">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comment-section">
        <h3>读者评论 <span v-if="commentTotal > 0">({{ commentTotal }})</span></h3>
        <div class="comment-input">
          <textarea v-model="commentText" placeholder="分享你的想法..." rows="3" class="comment-textarea"></textarea>
          <button @click="submitComment" class="submit-comment-btn">发表评论</button>
        </div>

        <div class="comments-list">
          <div class="comment-loading" v-if="commentsLoading">
            <div class="loading-spinner"></div>
            <p>正在加载评论...</p>
          </div>
          <div class="comment-empty" v-else-if="comments.length === 0">
            还没有评论，快来发表第一条评论吧！
          </div>
          <div v-else class="comment-item" v-for="(comment, index) in comments" :key="comment.essay_comment_id">
            <div class="comment-avatar" @click="goToUserPage(comment.user_id)">
              <img v-if="comment.avatar_url" :src="comment.avatar_url" :alt="comment.name" />
              <span v-else>{{ comment.name ? comment.name.charAt(0) : '读' }}</span>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-username" @click="goToUserPage(comment.user_id)">{{ comment.name || '匿名读者' }}</span>
                <span class="comment-time">{{ formatDate(comment.comment_time) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              
              <!-- 评论操作区 -->
              <div class="comment-actions">
                <div class="action-item" @click="handleLikeComment(comment)">
                  <i class="el-icon-thumb" :class="{ active: comment.isLiked }"></i>
                  <span>{{ comment.likeNum || 0 }}</span>
                </div>
                <div class="action-item" @click="showReplyInput(comment)">
                  <i class="el-icon-chat-line-round"></i>
                  <span>回复</span>
                </div>
                <div class="action-item" v-if="canDeleteComment(comment)" @click="deleteComment(comment)">
                  <i class="el-icon-delete"></i>
                  <span>删除</span>
                </div>
              </div>
              
              <!-- 回复列表 -->
              <div class="replies-list" v-if="comment.reviewLess && comment.reviewLess.length > 0">
                <div class="reply-item" v-for="(reply, replyIndex) in comment.reviewLess" :key="reply.comment_id">
                  <div class="reply-content">
                    <span class="reply-username" @click="goToUserPage(reply.userId)">{{ reply.userName || '匿名读者' }}</span>
                    <span v-if="reply.targetUserName" class="reply-target"> 回复 </span>
                    <span v-if="reply.targetUserName" class="reply-target-username" @click="goToUserPage(findUserIdByName(reply.targetUserName))">{{ reply.targetUserName }}</span>:
                    <span class="reply-text">{{ reply.sendMsg }}</span>
                  </div>
                  <div class="reply-actions">
                    <span class="reply-action" @click="showReplyInput(comment, reply)">回复</span>
                  </div>
                </div>
              </div>
              
              <!-- 回复输入框 -->
              <div class="reply-input" v-if="replyingTo && replyingTo.comment_id === comment.essay_comment_id">
                <textarea 
                  v-model="replyText" 
                  :placeholder="replyingTo.replyToReply ? `回复 ${replyingTo.targetName}` : '写下你的回复...'" 
                  rows="2" 
                  class="reply-textarea"
                ></textarea>
                <div class="reply-buttons">
                  <button @click="cancelReply" class="cancel-reply-btn">取消</button>
                  <button @click="submitReply(comment)" class="submit-reply-btn">回复</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="pagination" v-if="commentTotal > pageSize">
            <button 
              v-for="pageNum in totalPages" 
              :key="pageNum" 
              @click="changePage(pageNum)" 
              :class="{ active: currentPage === pageNum }"
            >
              {{ pageNum }}
            </button>
          </div>
        </div>
      </div>

      <!-- 段落操作浮动面板 -->
      <div class="paragraph-floating-panel" v-show="selectionMode"
        :style="{ left: panelPosition.x + 'px', top: panelPosition.y + 'px' }">
        <div class="panel-button" @click="handleCopy">
          <i class="el-icon-document-copy"></i>
          <span>复制</span>
        </div>
        <div class="panel-button" @click="gotoParagraphComment">
          <i class="el-icon-chat-line-round"></i>
          <span>评论</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $api, error }) {
    try {
      // 获取章节内容
      const article = await $api.articles.getArticle(params.id)
      if (!article || article.length === 0) {
        return error({ statusCode: 404, message: '找不到该章节' })
      }

      const articleData = article[0]

      // 获取小说信息
      const novel = await $api.novels.getNovelById(articleData.novel_id)
      if (!novel || novel.length === 0) {
        return error({ statusCode: 404, message: '找不到该小说' })
      }

      // 获取章节列表
      const chapters = await $api.articles.getArticles(articleData.novel_id)

      // 找到当前章节的索引
      const currentChapterIndex = chapters.findIndex(
        chapter => chapter.article_id === articleData.article_id
      )

      return {
        article: articleData,
        novel: novel[0],
        chapters: chapters || [],
        currentChapterIndex,
        loading: false,
        error: null
      }
    } catch (err) {
      console.error('加载章节内容失败', err)
      return {
        loading: false,
        error: '加载章节内容失败，请稍后重试',
        article: {},
        novel: {},
        chapters: [],
        currentChapterIndex: -1
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      isLiked: false,
      theme: 'light',
      fontFamily: 'default',
      fontSize: 18,
      defaultFontSize: 18,
      commentText: '',
      comments: [],
      showHeader: true,
      lastScrollPosition: 0,
      // 段落评论相关
      selectionMode: false,
      selectedParagraph: null,
      panelPosition: {
        x: 0,
        y: 0
      },
      paragraphComments: {},
      showCommentDrawer: false,
      currentParagraphId: null,
      paragraphCommentText: '',
      // 段落评论数量
      paragraphCommentsCount: {},
      // 评论相关
      commentTotal: 0,
      commentsLoading: true,
      pageSize: 10,
      currentPage: 1,
      replyingTo: null,
      replyText: '',
      userInfo: null
    }
  },
  computed: {
    hasPrevious() {
      return this.currentChapterIndex > 0
    },
    hasNext() {
      return this.currentChapterIndex < this.chapters.length - 1
    },
    formattedContent() {
      if (!this.article.content) return ''

      // 检查内容是否为JSON格式的混合内容
      try {
        const content = JSON.parse(this.article.content)
        // 如果能成功解析为JSON格式，则处理混合内容
        return content.map(item => {
          if (item.type === 'text') {
            // 处理文本段落，添加id和长按事件
            const id = item.id;
            return `<p class="article-paragraph" id="paragraph-${id}" data-paragraph-id="${id}" data-paragraph-text="${encodeURIComponent(item.value)}">${item.value}</p>`;
          } else if (item.type === 'image' && item.img) {
            // 处理图片
            return `<div class="article-image"><img src="${item.img}" alt="文章插图" /></div>`;
          }
          return '';
        }).join('');
      } catch (e) {
        // 如果不是JSON格式，则按原来的方式处理纯文本内容
        let paragraphId = 0;
        return this.article.content
          .split('\n')
          .filter(para => para.trim().length > 0)
          .map(para => {
            const id = ++paragraphId;
            return `<p class="article-paragraph" id="paragraph-${id}" data-paragraph-id="${id}" data-paragraph-text="${encodeURIComponent(para)}">${para}</p>`;
          })
          .join('');
      }
    },
    getFontFamily() {
      switch (this.fontFamily) {
        case 'serif':
          return '"Noto Serif SC", "Songti SC", SimSun, serif';
        case 'sans-serif':
          return '"Noto Sans SC", "Heiti SC", "Microsoft YaHei", sans-serif';
        default:
          return '"PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif';
      }
    },
    totalPages() {
      return Math.ceil(this.commentTotal / this.pageSize)
    }
  },
  head() {
    return {
      title: this.article?.title ? `${this.article.title} - ${this.novel.name || '阅读'} - 原木社区` : '阅读章节 - 原木社区',
      meta: [
        { hid: 'description', name: 'description', content: this.article?.text ? this.article.text.substring(0, 150) + '...' : '原木社区小说阅读' }
      ]
    }
  },
  mounted() {
    this.loadPreferences()
    this.recordRead()
    this.fetchComments()
    // 保存阅读历史
    this.saveReaderHistory()

    // 添加段落长按事件监听
    this.setupParagraphInteractions()

    // 添加点击空白区域关闭菜单的监听器
    document.addEventListener('click', this.handleDocumentClick)

    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll)
    
    // 获取段落评论数量
    this.fetchParagraphCommentsCount()
    
    // 获取当前用户信息
    this.getUserInfo()
  },
  beforeDestroy() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll)
    // 移除点击监听
    document.removeEventListener('click', this.handleDocumentClick)
  },
  methods: {
    // 记录阅读行为
    async recordRead() {
      if (this.article.article_id) {
        try {
          await this.$api.statistics.novelClicked(this.article.article_id)
        } catch (error) {
          console.error('记录阅读行为失败', error)
        }
      }
    },

    // 保存阅读历史到本地存储
    saveReaderHistory() {
      if (!this.novel || !this.novel.novel_id) return

      try {
        let readerHistory = JSON.parse(localStorage.getItem("loghomeReaderHistory")) || []

        // 移除已有的相同书籍记录
        readerHistory = readerHistory.filter(item => item.novel_id !== this.novel.novel_id)

        // 添加到历史记录
        readerHistory.push(this.novel)

        // 只保留最近的10本书
        if (readerHistory.length > 10) {
          readerHistory = readerHistory.slice(-10)
        }

        localStorage.setItem("loghomeReaderHistory", JSON.stringify(readerHistory))

        // 保存当前章节阅读进度
        if (this.article.article_chapter) {
          localStorage.setItem(`ReaderHistory_${this.novel.novel_id}`, this.article.article_chapter)
        }
      } catch (error) {
        console.error('保存阅读历史失败', error)
      }
    },

    // 滚动事件处理
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

      // 上滚显示，下滚隐藏
      if (currentScrollPosition < this.lastScrollPosition) {
        this.showHeader = true
      } else if (currentScrollPosition > 50) {
        this.showHeader = false
      }

      this.lastScrollPosition = currentScrollPosition
    },

    // 切换点赞状态
    toggleLike() {
      this.isLiked = !this.isLiked
      // 这里应该调用API保存点赞状态
    },

    // 加载阅读偏好
    loadPreferences() {
      if (process.client) {
        const savedTheme = localStorage.getItem('reading_theme')
        const savedFontSize = localStorage.getItem('reading_font_size')
        const savedFontFamily = localStorage.getItem('reading_font_family')

        if (savedTheme) {
          this.theme = savedTheme
        }

        if (savedFontSize) {
          this.fontSize = parseInt(savedFontSize)
        }

        if (savedFontFamily) {
          this.fontFamily = savedFontFamily
        }
      }
    },

    // 保存阅读偏好
    savePreferences() {
      if (process.client) {
        localStorage.setItem('reading_theme', this.theme)
        localStorage.setItem('reading_font_size', this.fontSize)
        localStorage.setItem('reading_font_family', this.fontFamily)
      }
    },

    // 设置主题
    setTheme(theme) {
      this.theme = theme
      this.savePreferences()
    },

    // 设置字体
    setFont(fontFamily) {
      this.fontFamily = fontFamily
      this.savePreferences()
    },

    // 更改字体大小
    changeFontSize(delta) {
      this.fontSize = Math.max(14, Math.min(32, this.fontSize + delta))
      this.savePreferences()
    },

    // 重置字体大小
    resetFontSize() {
      this.fontSize = this.defaultFontSize
      this.savePreferences()
    },

    // 章节导航
    navigateChapter(direction) {
      if (direction === 'prev' && this.hasPrevious) {
        const prevChapter = this.chapters[this.currentChapterIndex - 1]
        this.$router.push(`/article/${prevChapter.article_id}`)
      } else if (direction === 'next' && this.hasNext) {
        const nextChapter = this.chapters[this.currentChapterIndex + 1]
        this.$router.push(`/article/${nextChapter.article_id}`)
      }
    },

    // 返回小说详情页
    goToNovelDetail() {
      this.$router.push(`/novel/${this.article.novel_id}`)
    },

    // 返回上一页
    goBack() {
      this.$router.back()
    },

    // 格式化数字
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    },

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    // 获取评论
    async fetchComments() {
      try {
        this.commentsLoading = true
        
        // 获取评论总数
        const countResponse = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id, this.article.article_id)
        if (countResponse && countResponse.length > 0) {
          this.commentTotal = countResponse[0]['COUNT(*)']
        }
        
        // 获取当前页评论列表
        const commentsResponse = await this.$api.community.getArticleComments(
          this.novel.novel_id, 
          this.article.article_id,
          this.currentPage,
          this.pageSize
        )
        
        if (commentsResponse && commentsResponse.length > 0) {
          // 处理评论数据
          this.comments = await this.processComments(commentsResponse)
        } else {
          this.comments = []
        }
      } catch (error) {
        console.error('获取评论失败:', error)
        this.$message.error('获取评论失败，请稍后重试')
        this.comments = []
      } finally {
        this.commentsLoading = false
      }
    },
    
    // 处理评论数据，获取回复和点赞状态
    async processComments(comments) {
      const processedComments = []
      
      for (const comment of comments) {
        // 获取评论的回复
        const replies = await this.$api.community.novel_commonts_reply_to(comment.essay_comment_id)
        
        // 检查当前用户是否已点赞
        let isLiked = false
        if (localStorage.getItem("token")) {
          const likeStatus = await this.$api.community.getCommentPraiseStatus(comment.essay_comment_id)
          isLiked = likeStatus && likeStatus.length > 0 && likeStatus[0].type === 0
        }
        
        // 格式化评论的回复
        const reviewLess = replies ? replies.map(reply => ({
          comment_id: reply.essay_comment_id,
          userName: reply.name,
          userId: reply.user_id,
          targetUserName: this.findTargetUserName(reply.reply_to_id, comments, replies),
          sendMsg: reply.content,
          article_id: reply.article_id
        })) : []
        
        // 添加处理后的评论
        processedComments.push({
          ...comment,
          isLiked,
          reviewLess
        })
      }
      
      return processedComments
    },
    
    // 通过回复ID查找目标用户名
    findTargetUserName(replyToId, comments, replies) {
      // 先在主评论中查找
      for (const comment of comments) {
        if (comment.essay_comment_id === replyToId) {
          return comment.name
        }
      }
      
      // 再在回复中查找
      for (const reply of replies) {
        if (reply.essay_comment_id === replyToId) {
          return reply.name
        }
      }
      
      return null
    },
    
    // 获取当前用户信息
    async getUserInfo() {
      if (!localStorage.getItem("token")) return
      
      try {
        const userInfo = await this.$auth.fetchUser()
        this.userInfo = userInfo
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    // 提交评论
    async submitComment() {
      if (!this.commentText.trim()) {
        this.$message.info('评论内容不能为空')
        return
      }

      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再评论')
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`)
        return
      }

      try {
        await this.$api.community.commentOnArticle(
          this.novel.novel_id,
          this.article.article_id,
          this.commentText
        )
        
        this.commentText = ''
        this.$message.success('评论发表成功')
        
        // 重新加载评论
        this.currentPage = 1
        this.fetchComments()
      } catch (error) {
        console.error('提交评论失败:', error)
        this.$message.error('评论发表失败，请稍后重试')
      }
    },
    
    // 处理评论点赞
    async handleLikeComment(comment) {
      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再点赞')
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`)
        return
      }
      
      try {
        // 点赞状态切换
        const type = comment.isLiked ? 3 : 0 // 0 点赞，3 取消点赞
        
        await this.$api.community.praiseComment(comment.essay_comment_id, type)
        
        // 更新评论的点赞状态和数量
        comment.isLiked = !comment.isLiked
        comment.likeNum = comment.isLiked 
          ? (comment.likeNum || 0) + 1 
          : Math.max(0, (comment.likeNum || 0) - 1)
          
        this.$message.success(comment.isLiked ? '点赞成功' : '已取消点赞')
      } catch (error) {
        console.error('点赞操作失败:', error)
        this.$message.error('操作失败，请稍后重试')
      }
    },
    
    // 显示回复输入框
    showReplyInput(comment, reply) {
      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再回复')
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`)
        return
      }
      
      this.replyText = ''
      
      if (reply) {
        // 回复某个回复
        this.replyingTo = {
          comment_id: comment.essay_comment_id,
          reply_id: reply.comment_id,
          replyToReply: true,
          targetId: reply.userId,
          targetName: reply.userName
        }
      } else {
        // 回复主评论
        this.replyingTo = {
          comment_id: comment.essay_comment_id,
          replyToReply: false,
          targetId: comment.user_id,
          targetName: comment.name
        }
      }
    },
    
    // 取消回复
    cancelReply() {
      this.replyingTo = null
      this.replyText = ''
    },
    
    // 提交回复
    async submitReply(comment) {
      if (!this.replyText.trim()) {
        this.$message.info('回复内容不能为空')
        return
      }
      
      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再回复')
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`)
        return
      }
      
      try {
        const replyToId = this.replyingTo.replyToReply 
          ? this.replyingTo.reply_id
          : comment.essay_comment_id
          
        await this.$api.community.replyToComment(
          replyToId,
          this.replyText,
          comment.essay_comment_id,
          this.article.article_id
        )
        
        this.$message.success('回复发表成功')
        this.replyText = ''
        this.replyingTo = null
        
        // 重新加载评论
        this.fetchComments()
      } catch (error) {
        console.error('回复评论失败:', error)
        this.$message.error('回复发表失败，请稍后重试')
      }
    },
    
    // 删除评论
    async deleteComment(comment) {
      if (!localStorage.getItem("token")) return
      
      try {
        if (confirm('确定要删除这条评论吗？')) {
          await this.$api.community.deleteComment(comment.essay_comment_id)
          this.$message.success('评论已删除')
          
          // 重新加载评论
          this.fetchComments()
        }
      } catch (error) {
        console.error('删除评论失败:', error)
        this.$message.error('删除失败，请稍后重试')
      }
    },
    
    // 判断是否可以删除评论
    canDeleteComment(comment) {
      if (!localStorage.getItem("token") || !this.userInfo) return false
      
      // 判断是否是自己的评论或者是小说作者
      return this.userInfo.user_id === comment.user_id || 
          this.userInfo.user_id === this.novel.author_id
    },
    
    // 查找用户ID (简单实现，实际应该调用API)
    findUserIdByName(userName) {
      if (!userName) return null
      
      // 遍历评论和回复查找匹配的用户名
      for (const comment of this.comments) {
        if (comment.name === userName) {
          return comment.user_id
        }
        
        if (comment.reviewLess) {
          for (const reply of comment.reviewLess) {
            if (reply.userName === userName) {
              return reply.userId
            }
          }
        }
      }
      
      return null
    },
    
    // 更改页面
    async changePage(pageNum) {
      if (this.currentPage === pageNum) return
      
      this.currentPage = pageNum
      await this.fetchComments()
      
      // 滚动到评论区顶部
      const commentSection = document.querySelector('.comment-section')
      if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' })
      }
    },

    // 获取段落评论数量
    async fetchParagraphCommentsCount() {
      try {
        if (!this.article || !this.article.content) return;
        
        // 检查内容是否为JSON格式的混合内容
        let paragraphs = [];
        try {
          const content = JSON.parse(this.article.content);
          // 筛选出文本段落
          paragraphs = content.filter(item => item.type === 'text').map(item => item.id);
        } catch (e) {
          // 如果不是JSON格式，则按原来的方式处理纯文本内容
          const textParagraphs = this.article.content
            .split('\n')
            .filter(para => para.trim().length > 0);
          paragraphs = Array.from({length: textParagraphs.length}, (_, i) => i + 1);
        }
        
        // 为每个段落ID获取评论数量
        for (const paragraphId of paragraphs) {
          const response = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id, this.article.article_id, paragraphId);
          if (response && response.length > 0) {
            const count = response[0]['COUNT(*)'];
            if (count > 0) {
              this.$set(this.paragraphCommentsCount, paragraphId, count);
              
              // 添加评论图标到段落
              this.$nextTick(() => {
                this.addCommentIconToParagraph(paragraphId, count);
              });
            }
          }
        }
      } catch (error) {
        console.error('获取段落评论数量失败', error);
      }
    },
    
    // 为段落添加评论图标
    addCommentIconToParagraph(paragraphId, count) {
      const paragraph = document.getElementById(`paragraph-${paragraphId}`);
      if (!paragraph) return;
      
      // 检查是否已经添加了评论图标
      if (paragraph.querySelector('.paragraph-comment-icon')) return;
      
      // 创建评论图标容器
      const iconContainer = document.createElement('span');
      iconContainer.className = 'paragraph-comment-icon';
      iconContainer.innerHTML = `<i class="el-icon-chat-line-round"></i> ${count}`;
      iconContainer.title = `${count}条评论`;
      
      // 添加点击事件
      iconContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openParagraphCommentWindow(paragraphId);
      });
      
      // 添加到段落末尾
      paragraph.appendChild(iconContainer);
    },
    
    // 打开段落评论窗口
    async openParagraphCommentWindow(paragraphId) {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          let token = (await this.$api.users.generateCrossSiteToken()).crossSiteToken;
          
          this.$windowManager.createWindow({
            title: '段落评论',
            url: `${process.env.mobileUrl}/#/pages/users/external_login?token=${
                  token}&redirectTo=${encodeURIComponent(`/pages/readers/bookComment?id=${this.novel.novel_id}&articleId=${this.article.article_id}&paragraphId=${paragraphId}`)}&hideback=true`,
            width: 400,
            height: 800
          });
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        console.error('打开段落评论窗口失败', error);
        this.$message.error('打开评论窗口失败，请稍后重试');
      }
    },

    // 设置段落交互
    setupParagraphInteractions() {
      setTimeout(() => {
        const paragraphs = document.querySelectorAll('.article-paragraph');
        paragraphs.forEach(paragraph => {
          // 添加右键菜单事件
          paragraph.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // 阻止默认右键菜单
            this.handleParagraphRightClick(e, paragraph);
          });

          // 触摸设备长按支持
          let pressTimer;
          let touchStarted = false;

          paragraph.addEventListener('touchstart', (e) => {
            touchStarted = true;
            pressTimer = setTimeout(() => {
              if (touchStarted) {
                this.handleParagraphLongPress(e, paragraph);
              }
            }, 500);
          });

          paragraph.addEventListener('touchend', () => {
            touchStarted = false;
            clearTimeout(pressTimer);
          });

          paragraph.addEventListener('touchcancel', () => {
            touchStarted = false;
            clearTimeout(pressTimer);
          });

          paragraph.addEventListener('touchmove', () => {
            touchStarted = false;
            clearTimeout(pressTimer);
          });
          
          // 如果段落有评论，添加评论图标
          const paragraphId = paragraph.dataset.paragraphId;
          if (this.paragraphCommentsCount[paragraphId]) {
            this.addCommentIconToParagraph(paragraphId, this.paragraphCommentsCount[paragraphId]);
          }
        });
      }, 500);
    },

    // 处理段落右键点击
    handleParagraphRightClick(event, paragraph) {
      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);

      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算菜单位置 - 在鼠标右键位置显示
      this.panelPosition = {
        x: Math.max(20, Math.min(event.clientX, window.innerWidth - 300)),
        y: Math.min(event.clientY, window.innerHeight - 100)
      };

      this.selectionMode = true;
    },

    // 处理段落长按 - 保留此方法以便在触摸设备上仍然可以响应长按
    handleParagraphLongPress(event, paragraph) {
      event.preventDefault();

      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);

      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算面板位置
      const rect = paragraph.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 - 150; // 面板宽度的一半
      const y = rect.bottom + 10;

      this.panelPosition = {
        x: Math.max(20, Math.min(x, window.innerWidth - 300)),
        y: Math.min(y, window.innerHeight - 100)
      };

      this.selectionMode = true;
    },

    // 清除选择
    clearSelection() {
      if (this.selectedParagraph) {
        this.selectedParagraph.element.classList.remove('selected');
        this.selectedParagraph = null;
      }
      this.selectionMode = false;
    },

    // 复制段落内容
    handleCopy() {
      if (!this.selectedParagraph) return;

      const textToCopy = `${this.selectedParagraph.text}\n\n—— 摘自《${this.novel.name}》`;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.$message.success('内容已复制');
          this.clearSelection();
        })
        .catch(() => {
          this.$message.error('复制失败');
        });
    },

    // 跳转到段落评论
    async gotoParagraphComment() {
      const tokenData = localStorage.getItem('token');
      if (tokenData) {
        let token = (await this.$api.users.generateCrossSiteToken()).crossSiteToken;
        console.log(token)
        this.$windowManager.createWindow({
          title: '段落评论',
          url: `${process.env.mobileUrl}/#/pages/users/external_login?token=${
                token}&redirectTo=${encodeURIComponent(`/pages/readers/bookComment?id=${this.novel.novel_id}&articleId=${this.article.article_id}&paragraphId=${this.selectedParagraph.id}`)}&hideback=true`,
          width: 500,
          height: 800
        })
      } else {
        this.$router.push("/login")
      }
      this.clearSelection()
    },

    // 处理文档点击事件，关闭菜单
    handleDocumentClick(event) {
      // 如果点击的不是段落或菜单内部元素，则关闭菜单
      if (
        this.selectionMode &&
        !event.target.closest('.paragraph-floating-panel') &&
        !event.target.closest('.article-paragraph.selected')
      ) {
        this.clearSelection()
      }
    },

    // 获取用户页面
    goToUserPage(userId) {
      this.$router.push(`/user/${userId}`)
    },
  }
}
</script>

<style lang="scss">
@use "sass:color";

// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$accent-color: #EA7034;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;
$error-color: #ff4d4f;
$heart-color: #FF6B6B;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin button-base {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
}

@mixin loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

// 动画
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-100%);
  }
}

.article-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: #f8f9fa;

  .loading-container,
  .error-container {
    @include flex-center;
    flex-direction: column;
    min-height: 300px;
    text-align: center;
    padding: 50px;
  }

  .loading-spinner {
    @include loading-spinner;
  }

  .back-button {
    @include button-base;
    background-color: $primary-color;
    color: white;
    padding: 10px 20px;
    margin-top: 20px;
  }

  .article-container {
    position: relative;
  }

  .article-header {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: transform 0.3s ease;

    &.sticky {
      .header-content {
        padding: 10px 20px;
        @include flex-between;
        max-width: 1200px;
        margin: 0 auto;
      }
    }

    &.hidden {
      transform: translateY(-100%);
    }
  }

  .novel-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }

  .novel-title {
    color: $primary-color;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 20px;

    &:hover {
      text-decoration: underline;
    }
  }

  .reading-controls {
    margin-left: 20px;
    display: flex;
    gap: 20px;
    align-items: center;

    .control-item {
      display: flex;
      align-items: center;

      .control-label {
        color: $text-light;
        margin-right: 8px;
        font-size: 14px;
      }

      .control-buttons {
        display: flex;

        button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          background: none;
          margin: 0 2px;
          cursor: pointer;
          border-radius: 3px;
          font-size: 14px;

          &.active {
            background-color: $primary-color;
            color: white;
            border-color: $primary-color;
          }
        }
      }
    }
  }

  .theme-controls {
    display: flex;
    gap: 8px;
  }

  .theme-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;

    &.active {
      border-color: $primary-color;
    }

    &.light {
      background-color: #ffffff;
      border: 1px solid #ddd;
    }

    &.sepia {
      background-color: #f8f0e0;
    }

    &.dark {
      background-color: #282c35;
    }
  }

  .article-content-wrapper {
    padding: 0;
    background-color: #ffffff;
    margin: 0 auto;

    &.light {
      background-color: #ffffff;
      color: $text-color;
    }

    &.sepia {
      background-color: #f8f0e0;
      color: #5b4636;
    }

    &.dark {
      background-color: #282c35;
      color: #bbb;
    }
  }

  .article-title-container {
    text-align: center;
    padding: 40px 20px 20px;

    .article-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .article-meta {
      font-size: 14px;

      span {
        margin: 0 10px;
      }
    }
  }

  .article-content {
    padding: 30px 60px 60px;
    width: 100%;
    line-height: 1.8;

    p {
      margin-bottom: 1.5em;
    }

    .article-image {
      margin: 2em 0;
      text-align: center;

      img {
        max-width: 60%;
        height: auto;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    // 段落样式
    .article-paragraph {
      transition: background-color 0.3s;
      border-radius: 4px;
      padding: 5px;
      position: relative;

      &.selected {
        background-color: rgba($primary-color, 0.1);
      }

      &:hover {
        background-color: rgba($primary-color, 0.05);
      }
      
      // 段落评论图标样式
      .paragraph-comment-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        padding: 3px 6px;
        border-radius: 10px;
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
        vertical-align: middle;
        transition: all 0.2s ease;
        
        i {
          margin-right: 3px;
          font-size: 14px;
        }
        
        &:hover {
          background-color: $primary-color;
          color: white;
        }
      }
    }
  }

  .empty-content {
    color: $text-lighter;
    font-style: italic;
    text-align: center;
    padding: 60px 0;
  }

  .article-footer {
    padding: 20px;
    @include flex-between;
    border-top: 1px solid $border-color;
    margin-top: 50px;
    background-color: rgba(255, 255, 255, 0.95);
  }

  .chapter-nav {
    display: flex;
    gap: 10px;

    button {
      @include button-base;

      &.nav-btn {
        background-color: #f5f5f5;
        color: $text-color;

        &:hover:not(:disabled) {
          background-color: #e9e9e9;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      &.chapter-btn {
        background-color: $primary-color;
        color: white;

        &:hover {
          background-color: color.adjust($primary-color, $lightness: -10%);
        }
      }
    }
  }

  .nav-icon {
    font-size: 16px;
  }

  .like-btn {
    @include button-base;
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #fff0f0;
    color: $heart-color;
    border: 1px solid $heart-color;

    &:hover {
      background-color: #ffe0e0;
    }

    &.active {
      background-color: $heart-color;
      color: white;
    }
  }

  .like-icon {
    font-size: 16px;
  }

  .comment-section {
    margin: 0 auto;
    padding: 30px 40px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    border-radius: 8px;

    h3 {
      font-size: 18px;
      font-weight: bold;
      color: $secondary-color;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid $border-light;
      
      span {
        font-size: 14px;
        color: $text-lighter;
        font-weight: normal;
      }
    }
  }

  .comment-input {
    margin-bottom: 30px;

    .comment-textarea {
      width: 100%;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      margin-bottom: 10px;
      font-size: 14px;

      &:focus {
        border-color: $primary-color;
        outline: none;
      }
    }

    .submit-comment-btn {
      @include button-base;
      background-color: $primary-color;
      color: white;
      float: right;

      &:hover {
        background-color: color.adjust($primary-color, $lightness: -10%);
      }
    }
  }

  .comment-loading {
    @include flex-center;
    flex-direction: column;
    padding: 40px 0;
    
    .loading-spinner {
      @include loading-spinner;
      width: 30px;
      height: 30px;
      border-width: 3px;
      margin-bottom: 15px;
    }
    
    p {
      color: $text-lighter;
      font-size: 14px;
    }
  }

  .comment-empty {
    text-align: center;
    color: $text-lighter;
    padding: 30px 0;
    font-style: italic;
  }

  .comments-list {
    clear: both;
  }

  .comment-item {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid $border-light;

    &:last-child {
      border-bottom: none;
    }
  }

  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: $primary-color;
    color: white;
    @include flex-center;
    font-weight: bold;
    margin-right: 15px;
    flex-shrink: 0;
    cursor: pointer;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 16px;
      text-transform: uppercase;
    }
  }

  .comment-content {
    flex-grow: 1;

    .comment-header {
      margin-bottom: 8px;

      .comment-username {
        font-weight: bold;
        color: $text-color;
        margin-right: 10px;
        cursor: pointer;
        
        &:hover {
          color: $primary-color;
        }
      }

      .comment-time {
        font-size: 12px;
        color: $text-lighter;
      }
    }

    .comment-text {
      line-height: 1.6;
      color: $text-color;
      word-break: break-word;
      margin-bottom: 10px;
    }
  }
  
  .comment-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
    
    .action-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;
      color: $text-lighter;
      font-size: 13px;
      
      i {
        margin-right: 5px;
        font-size: 16px;
        
        &.active {
          color: $accent-color;
        }
      }
      
      &:hover {
        color: $primary-color;
      }
    }
  }
  
  .replies-list {
    margin-top: 10px;
    background-color: #f8f8f8;
    border-radius: 4px;
    padding: 10px 15px;
    margin-bottom: 10px;
    
    .reply-item {
      padding: 8px 0;
      border-bottom: 1px dashed rgba(0,0,0,0.05);
      
      &:last-child {
        border-bottom: none;
      }
      
      .reply-content {
        font-size: 13px;
        line-height: 1.5;
        margin-bottom: 5px;
        
        .reply-username {
          color: $primary-color;
          font-weight: bold;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
        
        .reply-target {
          color: $text-lighter;
        }
        
        .reply-target-username {
          color: $primary-color;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
        
        .reply-text {
          color: $text-color;
          word-break: break-word;
        }
      }
      
      .reply-actions {
        text-align: right;
        
        .reply-action {
          color: $text-lighter;
          font-size: 12px;
          cursor: pointer;
          
          &:hover {
            color: $primary-color;
          }
        }
      }
    }
  }
  
  .reply-input {
    margin-top: 10px;
    background-color: #f8f8f8;
    border-radius: 4px;
    padding: 10px;
    
    .reply-textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      margin-bottom: 10px;
      font-size: 13px;
      background-color: white;
      
      &:focus {
        border-color: $primary-color;
        outline: none;
      }
    }
    
    .reply-buttons {
      text-align: right;
      
      button {
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 13px;
        cursor: pointer;
        border: none;
        margin-left: 10px;
        
        &.cancel-reply-btn {
          background-color: #f0f0f0;
          color: $text-color;
          
          &:hover {
            background-color: #e0e0e0;
          }
        }
        
        &.submit-reply-btn {
          background-color: $primary-color;
          color: white;
          
          &:hover {
            background-color: color.adjust($primary-color, $lightness: -10%);
          }
        }
      }
    }
  }
  
  .pagination {
    margin-top: 30px;
    text-align: center;
    
    button {
      display: inline-block;
      min-width: 32px;
      height: 32px;
      margin: 0 5px;
      padding: 0 10px;
      text-align: center;
      line-height: 32px;
      background: none;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: $text-color;
      
      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }
      
      &.active {
        background-color: $primary-color;
        border-color: $primary-color;
        color: white;
      }
    }
  }

  .paragraph-floating-panel {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;

    .panel-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      margin: 0 5px;
      transition: all 0.2s;

      i {
        font-size: 20px;
        margin-bottom: 5px;
        color: $primary-color;
      }

      span {
        font-size: 12px;
        color: $text-color;
      }

      &:hover {
        background-color: rgba($primary-color, 0.1);
        border-radius: 5px;
      }
    }
  }

  .paragraph-comment-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 450px;
    background-color: #fff;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;

    &.active {
      transform: translateX(0);
    }

    .drawer-header {
      padding: 15px 20px;
      background-color: $primary-color;
      color: white;
      @include flex-between;

      h3 {
        margin: 0;
        font-size: 16px;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
    }

    .drawer-content {
      padding: 20px;
      flex: 1;
      overflow-y: auto;

      .paragraph-text {
        margin-bottom: 20px;

        blockquote {
          border-left: 4px solid $primary-color;
          padding: 10px 15px;
          background-color: rgba($primary-color, 0.05);
          margin: 0 0 20px 0;
          font-style: italic;
          color: $text-light;
        }
      }

      .comment-input {
        margin-bottom: 30px;

        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          margin-bottom: 10px;

          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }

        button {
          @include button-base;
          background-color: $primary-color;
          color: white;
          float: right;

          &:hover {
            background-color: color.adjust($primary-color, $lightness: -10%);
          }
        }
      }

      .paragraph-comments-list {
        clear: both;

        .empty-comments {
          padding: 30px 0;
          text-align: center;
          color: $text-lighter;
          font-style: italic;
        }

        .paragraph-comment-item {
          display: flex;
          padding: 15px 0;
          border-bottom: 1px solid $border-light;

          &:last-child {
            border-bottom: none;
          }

          .comment-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: $primary-color;
            color: white;
            @include flex-center;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
          }

          .comment-content {
            flex: 1;

            .comment-header {
              margin-bottom: 5px;

              .comment-username {
                font-weight: bold;
                margin-right: 10px;
              }

              .comment-time {
                font-size: 12px;
                color: $text-lighter;
              }
            }

            .comment-text {
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  @media (max-width: 900px) {
    .article-header .header-content {
      flex-direction: column;
      gap: 10px;
    }

    .novel-info {
      width: 100%;
    }

    .reading-controls {
      width: 100%;
      justify-content: space-between;
    }

    .article-content {
      padding: 20px 30px;
    }

    .paragraph-comment-drawer {
      width: 100%;
    }
  }
}
</style>