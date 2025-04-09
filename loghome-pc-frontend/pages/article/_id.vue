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
      <div class="article-header">
        <div class="novel-info">
          <div class="novel-title" @click="goToNovelDetail">{{ novel.name }}</div>
          <div class="article-title">{{ article.title }}</div>
          <div class="article-meta">
            <span>作者: {{ novel.author_name || '佚名' }}</span>
            <span>更新: {{ formatDate(article.update_time) }}</span>
            <span>字数: {{ formatNumber(article.text_count || 0) }}</span>
          </div>
        </div>
      </div>

      <div class="reading-controls">
        <div class="font-size-controls">
          <span class="control-label">字号:</span>
          <button class="font-size-btn" @click="changeFontSize(-2)">A-</button>
          <button class="font-size-btn" @click="resetFontSize">A</button>
          <button class="font-size-btn" @click="changeFontSize(2)">A+</button>
        </div>
        <div class="theme-controls">
          <span class="control-label">主题:</span>
          <button class="theme-btn light" :class="{ active: theme === 'light' }" @click="setTheme('light')"></button>
          <button class="theme-btn sepia" :class="{ active: theme === 'sepia' }" @click="setTheme('sepia')"></button>
          <button class="theme-btn dark" :class="{ active: theme === 'dark' }" @click="setTheme('dark')"></button>
        </div>
      </div>

      <div class="article-content" :class="theme" :style="{ fontSize: fontSize + 'px' }">
        <div v-if="article.text" v-html="formattedContent"></div>
        <div v-else class="empty-content">
          暂无内容
        </div>
      </div>

      <div class="article-actions">
        <div class="like-action">
          <button @click="toggleLike" class="action-btn like-btn" :class="{ active: isLiked }">
            <span class="action-icon">❤️</span>
            <span class="action-label">{{ isLiked ? '已喜欢' : '喜欢' }}</span>
          </button>
        </div>
        
        <div class="navigation-actions">
          <button @click="navigateChapter('prev')" class="action-btn nav-btn" :disabled="!hasPrevious">
            上一章
          </button>
          <button @click="goToNovelDetail" class="action-btn chapter-btn">
            目录
          </button>
          <button @click="navigateChapter('next')" class="action-btn nav-btn" :disabled="!hasNext">
            下一章
          </button>
        </div>
      </div>

      <div class="comment-section">
        <h3>评论区</h3>
        <div class="comment-input">
          <textarea 
            v-model="commentText" 
            placeholder="请输入你的评论"
            rows="3"
            class="comment-textarea"
          ></textarea>
          <button @click="submitComment" class="submit-comment-btn">提交评论</button>
        </div>
        
        <div class="comments-list">
          <div class="comment-empty" v-if="comments.length === 0">
            还没有评论，快来发表第一条评论吧！
          </div>
          <div v-else class="comment-item" v-for="(comment, index) in comments" :key="index">
            <div class="comment-avatar">
              {{ comment.username ? comment.username.charAt(0) : '读' }}
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-username">{{ comment.username || '匿名读者' }}</span>
                <span class="comment-time">{{ formatDate(comment.time) }}</span>
              </div>
              <div class="comment-text">{{ comment.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      error: null,
      article: {},
      novel: {},
      chapters: [],
      currentChapterIndex: -1,
      isLiked: false,
      theme: 'light',
      fontSize: 18,
      defaultFontSize: 18,
      commentText: '',
      comments: []
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
      if (!this.article.text) return ''
      // 简单处理换行，将文本中的换行符替换为段落标签
      return this.article.text
        .split('\n')
        .filter(para => para.trim().length > 0)
        .map(para => `<p>${para}</p>`)
        .join('')
    }
  },
  head() {
    return {
      title: this.article?.title ? `${this.article.title} - ${this.novel.name || '阅读'} - 原木社区` : '阅读章节 - 原木社区'
    }
  },
  mounted() {
    this.loadPreferences()
    this.fetchData()
    this.recordRead()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        // 获取章节内容
        const article = await this.$api.articles.getArticle(this.$route.params.id)
        if (!article || article.length === 0) {
          this.error = '找不到该章节'
          this.loading = false
          return
        }
        
        this.article = article[0]
        
        // 获取小说信息
        const novel = await this.$api.novels.getNovelById(this.article.novel_id)
        if (novel && novel.length > 0) {
          this.novel = novel[0]
        }
        
        // 获取章节列表
        const chapters = await this.$api.articles.getArticles(this.article.novel_id)
        if (chapters && chapters.length > 0) {
          this.chapters = chapters
          
          // 找到当前章节的索引
          this.currentChapterIndex = this.chapters.findIndex(
            chapter => chapter.article_id === this.article.article_id
          )
        }
        
        // 模拟获取评论
        this.fetchComments()
        
      } catch (error) {
        console.error('获取数据失败', error)
        this.error = '加载数据失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
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
        
        if (savedTheme) {
          this.theme = savedTheme
        }
        
        if (savedFontSize) {
          this.fontSize = parseInt(savedFontSize)
        }
      }
    },
    
    // 保存阅读偏好
    savePreferences() {
      if (process.client) {
        localStorage.setItem('reading_theme', this.theme)
        localStorage.setItem('reading_font_size', this.fontSize)
      }
    },
    
    // 设置主题
    setTheme(theme) {
      this.theme = theme
      this.savePreferences()
    },
    
    // 更改字体大小
    changeFontSize(delta) {
      this.fontSize = Math.max(12, Math.min(28, this.fontSize + delta))
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
    
    // 模拟获取评论
    fetchComments() {
      // 暂时使用模拟数据
      this.comments = [
        {
          username: '书虫一号',
          text: '这一章太精彩了，情节发展真是出人意料！',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          username: '阅读达人',
          text: '作者文笔真是越来越好了，期待下一章！',
          time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    
    // 提交评论
    submitComment() {
      if (!this.commentText.trim()) {
        alert('评论内容不能为空')
        return
      }
      
      // 添加新评论
      this.comments.unshift({
        username: '当前用户',
        text: this.commentText,
        time: new Date()
      })
      
      this.commentText = ''
      
      // 此处应该调用API提交评论
    }
  }
}
</script>

<style lang="scss">
// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;
$error-color: #ff4d4f;

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
  to { transform: rotate(360deg); }
}

.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.loading-container, .error-container {
  @include flex-center;
  flex-direction: column;
  min-height: 300px;
  text-align: center;
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
  border: none;
}

.article-container {
  background-color: $background-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.article-header {
  padding: 20px;
  border-bottom: 1px solid $border-color;
}

.novel-title {
  color: $primary-color;
  font-size: 16px;
  margin-bottom: 8px;
  cursor: pointer;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  color: $text-color;
  margin-bottom: 10px;
}

.article-meta {
  font-size: 14px;
  color: $text-light;

  span {
    margin-right: 15px;
  }
}

.reading-controls {
  @include flex-between;
  padding: 10px 20px;
  border-bottom: 1px solid $border-color;
  align-items: center;
}

.font-size-controls, .theme-controls {
  @include flex-center;
}

.control-label {
  margin-right: 10px;
  color: $text-light;
  font-size: 14px;
}

.font-size-btn {
  @include button-base;
  background: none;
  border: 1px solid #ddd;
  width: 30px;
  height: 30px;
  margin: 0 5px;
  font-weight: bold;
}

.theme-btn {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  margin: 0 5px;
  cursor: pointer;
  border: 2px solid transparent;

  &.active {
    border-color: $primary-color;
  }

  &.light {
    background-color: $background-color;
    border: 1px solid #ddd;
  }

  &.sepia {
    background-color: #f8f0e0;
  }

  &.dark {
    background-color: #282c35;
  }
}

.article-content {
  padding: 30px;
  min-height: 50vh;

  &.light {
    background-color: $background-color;
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

  p {
    margin-bottom: 1.5em;
    line-height: 1.8;
    text-indent: 2em;
  }
}

.empty-content {
  color: $text-lighter;
  font-style: italic;
  text-align: center;
  padding: 40px 0;
}

.article-actions {
  padding: 20px;
  border-top: 1px solid $border-color;
  @include flex-between;
  align-items: center;
}

.like-action, .navigation-actions {
  display: flex;
}

.action-btn {
  @include button-base;
  background: none;
  border: 1px solid $primary-color;
  color: $primary-color;
  margin: 0 5px;

  &:hover {
    background-color: $border-light;
  }

  &:disabled {
    border-color: $text-lighter;
    color: $text-lighter;
    cursor: not-allowed;
  }

  &.like-btn {
    @include flex-center;

    &.active {
      background-color: #ffe6e6;
      color: $error-color;
      border-color: $error-color;
    }
  }

  &.chapter-btn {
    background-color: $primary-color;
    color: white;
  }
}

.action-icon {
  margin-right: 8px;
}

.comment-section {
  padding: 30px;
  border-top: 1px solid $border-color;

  h3 {
    margin-bottom: 20px;
    color: $secondary-color;
  }
}

.comment-input {
  margin-bottom: 30px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.submit-comment-btn {
  @include button-base;
  background-color: $primary-color;
  color: white;
  border: none;
  float: right;
}

.comment-empty {
  text-align: center;
  color: $text-lighter;
  padding: 20px 0;
}

.comments-list {
  clear: both;
}

.comment-item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid $border-light;
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
}

.comment-content {
  flex-grow: 1;
}

.comment-header {
  margin-bottom: 8px;
}

.comment-username {
  font-weight: bold;
  color: $text-color;
  margin-right: 10px;
}

.comment-time {
  font-size: 12px;
  color: $text-lighter;
}

.comment-text {
  line-height: 1.6;
  color: $text-color;
}

@media (max-width: 768px) {
  .article-page {
    padding: 10px;
  }
  
  .reading-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .article-content {
    padding: 15px;
  }
  
  .article-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .navigation-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .like-action {
    width: 100%;
    justify-content: center;
  }
  
  .action-btn {
    margin: 0;
  }
  
  .article-content p {
    line-height: 1.6;
  }
}
</style> 