<template>
  <div class="write-page">
    <div class="page-header">
      <h1 class="page-title">创作中心</h1>
    </div>

    <div class="write-container">
      <div class="works-section">
        <div class="section-header">
          <h2 class="section-title">我的作品</h2>
          <button class="new-button" @click="createNewWork">+ 创建新作品</button>
        </div>

        <div class="tabs">
          <button class="tab-button" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部作品</button>
          <button class="tab-button" :class="{ active: activeTab === 'ongoing' }" @click="activeTab = 'ongoing'">连载中</button>
          <button class="tab-button" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">已完结</button>
          <button class="tab-button" :class="{ active: activeTab === 'draft' }" @click="activeTab = 'draft'">草稿箱</button>
        </div>

        <div class="works-list">
          <!-- 加载状态 -->
          <div class="loading-state" v-if="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在加载作品列表...</p>
          </div>
          
          <!-- 错误提示 -->
          <div class="error-state" v-else-if="error">
            <div class="error-icon">❌</div>
            <h3 class="error-title">加载失败</h3>
            <p class="error-desc">{{error}}</p>
            <button class="error-button" @click="fetchWorks">重试</button>
          </div>
          
          <!-- 空状态 -->
          <div class="work-empty" v-else-if="!filteredWorks.length">
            <div class="empty-icon">📝</div>
            <h3 class="empty-title">{{activeTab === 'all' ? '您还没有创建任何作品' : '没有符合条件的作品'}}</h3>
            <p class="empty-desc" v-if="activeTab === 'all'">点击"创建新作品"按钮开始您的创作之旅</p>
            <button class="empty-button" @click="createNewWork" v-if="activeTab === 'all'">+ 立即创建</button>
          </div>

          <!-- 作品列表 -->
          <div class="work-item" v-for="work in filteredWorks" :key="work.id">
            <div class="work-cover" :style="work.picUrl ? `background-image: url(${work.picUrl}); background-size: cover; background-position: center;` : `background-color: ${work.color}`" @error="work.picUrl = null">
              <span class="work-category">{{work.category}}</span>
              <span class="work-status" :class="{'status-completed': work.status === '已完结', 'status-draft': work.status === '草稿'}">{{work.status}}</span>
            </div>
            <div class="work-info">
              <h3 class="work-title">{{work.title}}</h3>
              <p class="work-stats">
                <span>{{work.status}}</span>
                <span>{{work.wordCount}}字</span>
              </p>
              <p class="work-desc">{{work.description}}</p>
              <p class="work-update">最近更新: {{work.lastUpdate}}</p>
              <div class="work-actions">
                <button class="work-action primary" @click="$router.push(`/write/edit/${work.id}`)">全部章节</button>
                <button class="work-action" @click="$router.push(`/write/settings/${work.id}`)">编辑信息</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">创作数据</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{stats.totalWorks}}</div>
              <div class="stat-label">作品总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{stats.totalWords}}</div>
              <div class="stat-label">总字数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{stats.totalViews}}</div>
              <div class="stat-label">总浏览量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{stats.totalFavorites}}</div>
              <div class="stat-label">总收藏</div>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">创作指南</h3>
          <ul class="guide-list">
            <li class="guide-item">
              <nuxt-link to="/guide/getting-started" class="guide-link">新手入门指南</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/plot-development" class="guide-link">如何构思情节</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/character-creation" class="guide-link">角色塑造技巧</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/writing-style" class="guide-link">提升写作风格</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/publishing" class="guide-link">作品发布与推广</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">创作活动</h3>
          <div class="activity-list">
            <div class="activity-item">
              <h4 class="activity-title">春季创作大赛</h4>
              <p class="activity-desc">参与春季创作大赛，赢取丰厚奖金和推荐位展示</p>
              <p class="activity-date">截止日期: 2023-05-30</p>
              <nuxt-link to="/activity/spring-contest" class="activity-link">查看详情</nuxt-link>
            </div>
            <div class="activity-item">
              <h4 class="activity-title">科幻题材征文</h4>
              <p class="activity-desc">优秀科幻作品征集，入选作品将获得专业编辑指导</p>
              <p class="activity-date">截止日期: 2023-06-15</p>
              <nuxt-link to="/activity/scifi-contest" class="activity-link">查看详情</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '创作中心 - 原木社区'
    }
  },
  data() {
    return {
      activeTab: 'all',
      works: [],
      stats: {
        totalWorks: 0,
        totalWords: '0',
        totalViews: '0',
        totalFavorites: 0
      },
      loading: false,
      error: null
    }
  },
  async mounted() {
    await this.fetchWorks()
  },
  computed: {
    filteredWorks() {
      if (this.activeTab === 'all') {
        return this.works
      } else if (this.activeTab === 'ongoing') {
        return this.works.filter(work => work.status === '连载中')
      } else if (this.activeTab === 'completed') {
        return this.works.filter(work => work.status === '已完结')
      } else if (this.activeTab === 'draft') {
        return this.works.filter(work => work.status === '草稿')
      }
      return this.works
    }
  },
  methods: {
    async fetchWorks() {
      this.loading = true
      this.error = null
      try {
        // 使用新添加的API接口获取用户作品列表
        const response = await this.$api.essays.getNovelsOf()
        
        if (response && Array.isArray(response)) {
          // 转换API返回的数据格式为组件所需的格式
          this.works = response.map(novel => {
            // 根据novel_type确定分类
            let category = '小说'
            if (novel.novel_type === 'fiction') {
              category = '小说'
            } else if (novel.novel_type === 'nonfiction') {
              category = '非虚构'
            } else if (novel.novel_type === 'poetry') {
              category = '诗歌'
            } else if (novel.novel_type === 'world') {
              category = '世界设定'
            }
            
            // 根据is_complete确定状态
            let status = '连载中'
            if (novel.is_complete == 1) {
              status = '已完结'
            } else if (novel.is_personal == 1) {
              status = '草稿'
            }
            
            // 获取封面图片URL，如果没有则使用随机颜色作为封面背景色
            const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4']
            const color = colors[Math.floor(Math.random() * colors.length)]
            const picUrl = novel.picUrl || null
            
            // 格式化最后更新时间
            const lastUpdate = novel.update_time ? this.formatDate(novel.update_time) : '未知'
            
            // 格式化字数
            const wordCount = novel.text_count ? this.formatNumber(novel.text_count) : (novel.word_count ? this.formatNumber(novel.word_count) : '0')
            return {
              id: novel.novel_id,
              title: novel.name,
              status,
              category,
              wordCount,
              chapterCount: novel.article_count || 0,
              description: novel.content || '暂无简介',
              lastUpdate,
              color,
              picUrl
            }
          })
          
          // 更新统计数据
          this.updateStats()
          
          // 缓存作品数据
          localStorage.setItem('LogHomeUserEssay', JSON.stringify(response))
        }
      } catch (error) {
        console.error('获取作品列表失败:', error)
        this.error = '获取作品列表失败，请稍后重试'
        
        // 尝试从缓存获取数据
        const cachedWorks = localStorage.getItem('LogHomeUserEssay')
        if (cachedWorks) {
          const parsedWorks = JSON.parse(cachedWorks)
          if (Array.isArray(parsedWorks)) {
            this.works = this.transformWorks(parsedWorks)
            this.updateStats()
          }
        }
      } finally {
        this.loading = false
      }
    },
    
    transformWorks(novels) {
      return novels.map(novel => {
        // 根据novel_type确定分类
        let category = '小说'
        if (novel.novel_type === 'fiction') {
          category = '小说'
        } else if (novel.novel_type === 'nonfiction') {
          category = '非虚构'
        } else if (novel.novel_type === 'poetry') {
          category = '诗歌'
        } else if (novel.novel_type === 'world') {
          category = '世界设定'
        }
        
        // 根据is_complete确定状态
        let status = '连载中'
        if (novel.is_complete == 1) {
          status = '已完结'
        } else if (novel.is_personal == 1) {
          status = '草稿'
        }
        
        // 获取封面图片URL，如果没有则使用随机颜色作为封面背景色
        const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4']
        const color = colors[Math.floor(Math.random() * colors.length)]
        const picUrl = novel.picUrl || null
        
        // 格式化最后更新时间
        const lastUpdate = novel.update_time ? this.formatDate(novel.update_time) : '未知'
        
        // 格式化字数
        const wordCount = novel.text_count ? this.formatNumber(novel.text_count) : (novel.word_count ? this.formatNumber(novel.word_count) : '0')
        
        return {
          id: novel.novel_id || novel.id, // 优先使用novel_id，兼容缓存数据
          title: novel.name,
          status,
          category,
          wordCount,
          chapterCount: novel.article_count || 0,
          description: novel.content || '暂无简介',
          lastUpdate,
          color,
          picUrl
        }
      })
    },
    
    updateStats() {
      // 计算总作品数
      this.stats.totalWorks = this.works.length
      
      // 计算总字数
      const totalWords = this.works.reduce((sum, work) => {
        const wordCount = parseInt(work.wordCount.replace(/,/g, '')) || 0
        return sum + wordCount
      }, 0)
      this.stats.totalWords = this.formatNumber(totalWords)
      
      // 暂时使用默认值，后续可以通过API获取
      this.stats.totalViews = '0'
      this.stats.totalFavorites = 0
    },
    
    formatDate(dateString) {
      try {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      } catch (error) {
        return '未知'
      }
    },
    
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    
    createNewWork() {
      // 跳转到创建新作品页面
      this.$router.push('/write/new')
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
$orange-color: #FB7D46;
$orange-dark: #fa6c2e;

// 混合器
@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@mixin button-primary {
  background-color: $primary-color;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: $secondary-color;
  }
}

.write-page {
  width: 100%;
  
  .page-header {
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 32px;
    color: $secondary-color;
  }

  .write-container {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 30px;
  }

  .section-header {
    @include flex-between;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 24px;
    color: $secondary-color;
    margin: 0;
  }

  .new-button {
    @include button-primary;
  }

  .tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid $border-color;
  }

  .tab-button {
    padding: 10px 20px;
    background: none;
    border: none;
    color: $text-light;
    font-size: 16px;
    cursor: pointer;
    position: relative;
    transition: color 0.3s ease;
    
    &:hover {
      color: $primary-color;
    }
    
    &.active {
      color: $primary-color;
      font-weight: 600;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: $primary-color;
        display: block;
      }
    }
  }

  // 加载状态样式
  .loading-state {
    background-color: $background-color;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid $border-light;
      border-top: 5px solid $primary-color;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }
    
    .loading-text {
      color: $text-light;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  
  // 错误状态样式
  .error-state {
    background-color: $background-color;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .error-icon {
      font-size: 50px;
      margin-bottom: 20px;
      color: #e74c3c;
    }
    
    .error-title {
      font-size: 20px;
      color: $text-color;
      margin-bottom: 10px;
    }
    
    .error-desc {
      color: $text-light;
      margin-bottom: 25px;
    }
    
    .error-button {
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 30px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: $secondary-color;
      }
    }
  }
  
  // 空状态样式
  .work-empty {
    background-color: $background-color;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    .empty-title {
      font-size: 20px;
      color: $text-color;
      margin-bottom: 10px;
    }
    
    .empty-desc {
      color: $text-light;
      margin-bottom: 25px;
    }
    
    .empty-button {
      background-color: $orange-color;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 30px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: $orange-dark;
      }
    }
  }

  .work-item {
    display: flex;
    background-color: $background-color;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    
    .work-cover {
      width: 150px;
      position: relative;
      flex-shrink: 0;
    }
    
    .work-category {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .work-status {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      
      &.status-completed {
        background-color: rgba(25, 135, 84, 0.7);
      }
      
      &.status-draft {
        background-color: rgba(108, 117, 125, 0.7);
      }
    }
    
    .work-info {
      flex-grow: 1;
      padding: 20px;
    }
    
    .work-title {
      font-size: 20px;
      color: $secondary-color;
      margin: 0 0 10px;
    }
    
    .work-stats {
      display: flex;
      color: $text-light;
      font-size: 14px;
      margin-bottom: 10px;
      
      span {
        margin-right: 15px;
      }
    }
    
    .work-desc {
      color: $text-light;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 15px;
    }
    
    .work-update {
      color: $text-lighter;
      font-size: 13px;
      margin-bottom: 15px;
    }
    
    .work-actions {
      display: flex;
      gap: 10px;
    }
    
    .work-action {
      padding: 8px 15px;
      border-radius: 4px;
      background-color: $border-light;
      border: none;
      color: $text-light;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #e0e0e0;
      }
      
      &.primary {
        background-color: $orange-color;
        color: white;
        
        &:hover {
          background-color: $orange-dark;
        }
      }
    }
  }

  .sidebar-section {
    background-color: $background-color;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .sidebar-title {
      font-size: 18px;
      margin-bottom: 15px;
      color: $secondary-color;
      padding-bottom: 10px;
      border-bottom: 1px solid $border-color;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      
      .stat-item {
        text-align: center;
        padding: 10px;
        background-color: $border-light;
        border-radius: 4px;
        
        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: $primary-color;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: $text-light;
        }
      }
    }
    
    .guide-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      .guide-item {
        padding: 8px 0;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .guide-link {
          color: $primary-color;
          text-decoration: none;
          transition: color 0.3s ease;
          
          &:hover {
            color: $secondary-color;
            text-decoration: underline;
          }
        }
      }
    }
    
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      .activity-item {
        padding: 15px;
        background-color: $border-light;
        border-radius: 4px;
        border-left: 3px solid $primary-color;
        
        .activity-title {
          font-size: 16px;
          color: $text-color;
          margin: 0 0 10px;
        }
        
        .activity-desc {
          font-size: 14px;
          color: $text-light;
          margin: 0 0 10px;
          line-height: 1.4;
        }
        
        .activity-date {
          font-size: 13px;
          color: $text-lighter;
          margin: 0 0 10px;
        }
        
        .activity-link {
          display: inline-block;
          color: $primary-color;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media (max-width: 992px) {
    .write-container {
      grid-template-columns: 1fr;
    }
    
    .work-cover {
      width: 100px;
    }
  }

  @media (max-width: 576px) {
    .work-item {
      flex-direction: column;
      
      .work-cover {
        width: 100%;
        height: 140px;
      }
      
      .work-actions {
        flex-wrap: wrap;
        
        .work-action {
          flex: 1 0 auto;
        }
      }
    }
  }
}
</style>