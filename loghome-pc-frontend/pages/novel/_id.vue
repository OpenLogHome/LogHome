<template>
  <div class="novel-page">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载小说信息...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <nuxt-link to="/read" class="back-button">返回小说列表</nuxt-link>
    </div>

    <div v-else class="novel-container">
      <div class="novel-header">
        <div class="novel-cover" v-if="novel.cover_url" :style="`background-image: url(${novel.cover_url})`"></div>
        <div class="novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`"></div>
        
        <div class="novel-info">
          <h1 class="novel-title">{{ novel.name }}</h1>
          <div class="novel-meta">
            <div class="author-info">
              <img v-if="novel.auther_avatar" :src="novel.auther_avatar" class="author-avatar" alt="作者头像">
              <div v-else class="author-avatar-placeholder">{{ novel.author_name ? novel.author_name.charAt(0) : '作' }}</div>
              <span class="author-name">{{ novel.author_name || '佚名' }}</span>
            </div>
            <div class="novel-type" v-if="novel.novel_type">{{ novel.novel_type }}</div>
          </div>
          
          <div class="novel-stats">
            <div class="stat-item">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ formatNumber(novel.clicks || 0) }}</span>
              <span class="stat-label">阅读量</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ formatNumber(novel.nices || 0) }}</span>
              <span class="stat-label">喜欢</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📃</span>
              <span class="stat-value">{{ formatNumber(novel.text_count || 0) }}</span>
              <span class="stat-label">字数</span>
            </div>
          </div>
          
          <div class="novel-tags">
            <span class="tag" v-for="tag in tags" :key="tag.tag_id">{{ tag.tag_name }}</span>
          </div>
          
          <div class="novel-actions">
            <button class="action-button primary" @click="startReading" v-if="chapters.length > 0">开始阅读</button>
            <button class="action-button" @click="toggleLike">
              <span v-if="isLiked">已收藏</span>
              <span v-else>收藏</span>
            </button>
            <button class="action-button">打赏</button>
          </div>
        </div>
      </div>
      
      <div class="novel-content">
        <div class="content-tabs">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'intro' }" 
            @click="activeTab = 'intro'"
          >
            作品简介
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'chapters' }" 
            @click="activeTab = 'chapters'"
          >
            章节目录 ({{ chapters.length }})
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'comments' }" 
            @click="activeTab = 'comments'"
          >
            读者评论
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 作品简介 -->
          <div v-if="activeTab === 'intro'" class="intro-content">
            <p v-if="novel.content">{{ novel.content }}</p>
            <p v-else class="empty-content">暂无简介</p>
          </div>
          
          <!-- 章节目录 -->
          <div v-else-if="activeTab === 'chapters'" class="chapters-content">
            <div v-if="chapters.length === 0" class="empty-content">
              暂无章节
            </div>
            <div v-else class="chapter-list">
              <nuxt-link 
                v-for="chapter in chapters" 
                :key="chapter.article_id" 
                :to="`/article/${chapter.article_id}`" 
                class="chapter-item"
              >
                <span class="chapter-number">{{ chapter.article_chapter }}</span>
                <span class="chapter-title">{{ chapter.title }}</span>
                <span class="chapter-date">{{ formatDate(chapter.update_time) }}</span>
              </nuxt-link>
            </div>
          </div>
          
          <!-- 读者评论 -->
          <div v-else-if="activeTab === 'comments'" class="comments-content">
            <div class="empty-content">暂无评论功能</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="recommended-novels" v-if="!loading && !error">
      <h2 class="section-title">推荐阅读</h2>
      <div class="novels-grid">
        <div class="mini-novel-card" v-for="novel in recommendedNovels" :key="novel.novel_id">
          <div class="mini-novel-cover" v-if="novel.cover_url" :style="`background-image: url(${novel.cover_url})`"></div>
          <div class="mini-novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`"></div>
          <div class="mini-novel-info">
            <h3 class="mini-novel-title">{{ novel.name }}</h3>
            <p class="mini-novel-author">{{ novel.author_name || '佚名' }}</p>
          </div>
          <nuxt-link :to="`/novel/${novel.novel_id}`" class="mini-novel-link"></nuxt-link>
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
      novel: {},
      chapters: [],
      tags: [],
      activeTab: 'intro',
      isLiked: false,
      recommendedNovels: []
    }
  },
  head() {
    return {
      title: this.novel?.name ? `${this.novel.name} - 原木社区` : '小说详情 - 原木社区'
    }
  },
  async mounted() {
    await this.fetchNovelData()
  },
  methods: {
    async fetchNovelData() {
      this.loading = true
      try {
        // 获取小说详情
        const novel = await this.$api.novels.getNovelById(this.$route.params.id)
        if (!novel || novel.length === 0) {
          this.error = '找不到该小说'
          this.loading = false
          return
        }
        
        this.novel = novel[0]
        
        // 获取章节列表
        const chapters = await this.$api.articles.getArticles(this.novel.novel_id)
        this.chapters = chapters || []
        
        // 获取小说标签
        const tags = await this.$api.novels.getNovelTags(this.novel.novel_id)
        this.tags = tags || []
        
        // 获取推荐小说（这里简单实现为随机获取6本）
        const allNovels = await this.$api.novels.getAllNovels()
        this.recommendedNovels = allNovels
          .filter(n => n.novel_id !== this.novel.novel_id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 6)
        
      } catch (error) {
        console.error('获取小说数据失败', error)
        this.error = '加载小说数据失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    // 开始阅读
    startReading() {
      if (this.chapters.length > 0) {
        // 跳转到第一章
        this.$router.push(`/article/${this.chapters[0].article_id}`)
      }
    },
    
    // 切换收藏状态
    toggleLike() {
      this.isLiked = !this.isLiked
      // 此处应该调用API保存收藏状态
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
$success-color: #52c41a;
$warning-color: #faad14;

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
  to { transform: rotate(360deg); }
}

.novel-page {
  max-width: 1000px;
  margin: 0 auto;
}

.loading-container, .error-container {
  @include flex-center;
  flex-direction: column;
  padding: 50px;
  text-align: center;
}

.loading-spinner {
  @include loading-spinner;
}

.back-button {
  @include button-base;
  background-color: $primary-color;
  color: white;
  text-decoration: none;
  margin-top: 20px;
  border: none;
}

.novel-container {
  background-color: $background-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.novel-header {
  display: flex;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.novel-cover {
  width: 200px;
  height: 280px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-right: 30px;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
}

.novel-info {
  flex: 1;
}

.novel-title {
  font-size: 24px;
  font-weight: bold;
  color: $text-color;
  margin-bottom: 16px;
}

.novel-meta {
  @include flex-between;
  margin-bottom: 16px;
  
  .author-info {
    @include flex-center;
    
    .author-avatar, .author-avatar-placeholder {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .author-avatar {
      object-fit: cover;
    }
    
    .author-avatar-placeholder {
      @include flex-center;
      background-color: $primary-color;
      color: white;
      font-weight: bold;
    }
    
    .author-name {
      font-size: 16px;
      color: $text-light;
    }
  }
  
  .novel-type {
    font-size: 14px;
    padding: 4px 10px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: 20px;
  }
}

.novel-stats {
  display: flex;
  margin-bottom: 20px;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
    
    &:last-child {
      margin-right: 0;
    }
    
    .stat-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 16px;
      font-weight: bold;
      color: $text-color;
      margin-bottom: 2px;
    }
    
    .stat-label {
      font-size: 12px;
      color: $text-light;
    }
  }
}

.novel-tags {
  margin-bottom: 20px;
  
  .tag {
    display: inline-block;
    padding: 4px 10px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: 20px;
    font-size: 12px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

.novel-actions {
  display: flex;
  
  .action-button {
    @include button-base;
    margin-right: 12px;
    min-width: 90px;
    
    &.primary {
      background-color: $primary-color;
      color: white;
      border: none;
      
      &:hover {
        background-color: darken($primary-color, 5%);
      }
    }
    
    &:not(.primary) {
      background-color: transparent;
      border: 1px solid $primary-color;
      color: $primary-color;
      
      &:hover {
        background-color: rgba($primary-color, 0.05);
      }
    }
  }
}

.novel-content {
  margin-top: 20px;
}

.content-tabs {
  display: flex;
  border-bottom: 1px solid $border-color;
  margin-bottom: 20px;
  
  .tab-button {
    @include button-base;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: $text-light;
    padding: 10px 20px;
    margin-right: 10px;
    
    &.active {
      color: $primary-color;
      border-bottom-color: $primary-color;
    }
  }
}

.tab-content {
  min-height: 200px;
  
  .empty-content {
    color: $text-lighter;
    font-style: italic;
    text-align: center;
    padding: 30px 0;
  }
}

.intro-content {
  line-height: 1.8;
  color: $text-color;
  white-space: pre-line;
}

.chapters-content {
  .chapter-list {
    display: flex;
    flex-direction: column;
    
    .chapter-item {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid $border-light;
      text-decoration: none;
      color: $text-color;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: $border-light;
      }
      
      .chapter-number {
        flex: 0 0 50px;
        color: $primary-color;
        font-weight: bold;
      }
      
      .chapter-title {
        flex: 1;
      }
      
      .chapter-date {
        color: $text-lighter;
        font-size: 12px;
      }
    }
  }
}

.recommended-novels {
  margin-top: 40px;
  
  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
    color: $secondary-color;
  }
  
  .novels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
    
    @media (max-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }
  
  .mini-novel-card {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .mini-novel-cover {
      height: 200px;
      background-size: cover;
      background-position: center;
    }
    
    .mini-novel-info {
      padding: 10px;
      
      .mini-novel-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
        color: $text-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .mini-novel-author {
        font-size: 12px;
        color: $text-light;
        margin: 0;
      }
    }
    
    .mini-novel-link {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }
}
</style> 