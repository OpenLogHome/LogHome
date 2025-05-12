<template>
  <div class="collections-page">
    <div class="page-header">
      <h1 class="page-title">{{ title }}</h1>
      <nuxt-link to="/read" class="back-button">返回书库</nuxt-link>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载内容...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="refreshCollections" class="retry-button">重试</button>
    </div>

    <div v-else-if="novels.length === 0" class="empty-container">
      <p>该集合下暂无小说</p>
    </div>

    <div v-else class="novels-grid">
      <div v-for="novel in novels" :key="novel.novel_id" class="novel-card">
        <div class="novel-cover" v-if="novel.picUrl" :style="`background-image: url(${novel.picUrl})`">
          <span class="novel-category" v-if="novel.novel_type === 'world'">世界设定</span>
        </div>
        <div class="novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`">
          <span class="novel-category" v-if="novel.novel_type === 'world'">世界设定</span>
        </div>
        <div class="novel-info">
          <h3 class="novel-title">{{ novel.name }}</h3>
          <div class="novel-author-info">
            <img :src="novel.avatar_url || '/static/user/defaultAvatar.jpg'" alt="作者头像" class="author-avatar"
              :onerror="`this.onerror=null;this.src='/static/user/defaultAvatar.jpg'`">
            <span class="author-name">{{ novel.user_name || '佚名' }}</span>
          </div>
          <p class="novel-desc">{{ truncateText(novel.content, 100) }}</p>
          <div class="novel-stats">
            <span title="阅读量">👁️ {{ formatNumber(novel.clicks || 0) }}</span>
            <span title="字数">📃 {{ formatNumber(novel.text_count || 0) }}字</span>
            <span title="连载状态">{{ novel.is_complete === 1 ? '已完结' : '连载中' }}</span>
          </div>
          <div class="novel-update-time">
            <span title="更新时间">🕒 {{ formatDateTime(novel.update_time) }}</span>
          </div>
          <nuxt-link :to="`/novel/${novel.novel_id}`" class="read-button">开始阅读</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `${this.title || '小说集合'} - 原木社区`,
      meta: [
        { hid: 'description', name: 'description', content: `原木社区 - ${this.title || '小说集合'} 分类下的热门小说列表` }
      ]
    }
  },
  data() {
    return {
      title: '',
      novels: [],
      loading: true,
      error: null
    }
  },
  async asyncData({ query, $api, error }) {
    try {
      const title = query.title || '人气最佳'
      
      // 加载小说集合数据
      const novels = await $api.novels.getCollectionNovels(title, 1, 100)
      
      return {
        title,
        novels: novels || [],
        loading: false
      }
    } catch (err) {
      console.error('加载集合数据失败:', err)
      return {
        title: query.title || '人气最佳',
        novels: [],
        loading: false,
        error: `加载集合数据失败: ${err.message || '未知错误'}`
      }
    }
  },
  watch: {
    '$route.query.title': {
      handler(newTitle) {
        if (newTitle && newTitle !== this.title) {
          this.title = newTitle
          this.refreshCollections()
        }
      },
      immediate: true
    }
  },
  mounted() {
    // 调试信息
    console.log('Collections页面挂载, 当前title:', this.title)
    
    // 检查页面路由和数据
    this.checkPageData()
  },
  methods: {
    // 刷新小说集合
    async refreshCollections() {
      this.loading = true
      this.error = null
      
      try {
        this.novels = await this.$api.novels.getCollectionNovels(this.title, 1, 100)
      } catch (err) {
        console.error('刷新集合数据失败:', err)
        this.error = '刷新集合数据失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    // 截断文本
    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    
    // 格式化数字
    formatNumber(num) {
      if (!num) return '0'
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    },
    
    // 格式化日期时间
    formatDateTime(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const now = new Date()
      
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 1) {
        return '今天'
      } else if (diffDays < 7) {
        return `${diffDays}天前`
      } else {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      }
    },
    
    // 检查页面数据
    checkPageData() {
      // 检查URL参数是否存在
      const urlParams = new URLSearchParams(window.location.search);
      const titleParam = urlParams.get('title');
      
      console.log('URL参数检查 - title:', titleParam)
      
      // 如果URL有title参数但页面没有加载数据，尝试刷新
      if (titleParam && this.novels.length === 0 && !this.loading && !this.error) {
        console.log('URL有title参数但没有加载数据，尝试重新加载')
        this.title = decodeURIComponent(titleParam)
        this.refreshCollections()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #947358;
$secondary-color: #704C35;
$accent-color: #EA7034;
$text-color: #333;
$text-light: #666;
$border-color: #e0e0e0;
$background-color: #f8f8f8;

.collections-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 140px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid $border-color;
  
  .page-title {
    font-size: 24px;
    font-weight: bold;
    color: $primary-color;
    margin: 0;
  }
  
  .back-button {
    padding: 8px 16px;
    background-color: $primary-color;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}

.loading-container, 
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  
  p {
    margin-top: 20px;
    color: $text-light;
    font-size: 16px;
  }
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-button {
  margin-top: 15px;
  padding: 8px 20px;
  background-color: $primary-color;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

.novels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.novel-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.novel-cover {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  
  .novel-category {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.novel-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.novel-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px;
  color: $text-color;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.novel-author-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  .author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
    object-fit: cover;
  }
  
  .author-name {
    font-size: 14px;
    color: $text-light;
  }
}

.novel-desc {
  font-size: 14px;
  color: $text-light;
  margin: 0 0 15px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex-grow: 1;
}

.novel-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
  
  span {
    font-size: 12px;
    color: $text-light;
  }
}

.novel-update-time {
  font-size: 12px;
  color: $text-light;
  margin-bottom: 15px;
}

.read-button {
  padding: 8px 0;
  background-color: $primary-color;
  color: white;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

@media (max-width: 768px) {
  .novels-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .novels-grid {
    grid-template-columns: 1fr;
  }
}
</style> 