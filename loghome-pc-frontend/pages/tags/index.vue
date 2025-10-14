<template>
  <div class="tags-page">
    <div class="page-header">
      <h1 class="page-title">标签库</h1>
      <nuxt-link to="/read" class="back-button">返回书库</nuxt-link>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载标签...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="getNovelTags" class="retry-button">重试</button>
    </div>

    <div v-else-if="tags.length === 0" class="empty-container">
      <p>暂无标签</p>
    </div>

    <div v-else class="tags-container">
      <div class="tags-grid">
        <div 
          v-for="(item, index) in tags" 
          :key="item.tag_id"
          class="tag-item"
          :class="{
            'activity': item.is_activity_tag, 
            'suggested': item.is_suggested
          }"
          @click="gotoTagNovels(item.tag_id)"
        >
          <div class="tag-content">
            <h3 class="tag-name">{{ item.tag_name }}</h3>
            <div class="tag-count">{{ item.count }} 部作品</div>
            <div class="tag-badges">
              <span v-if="item.is_activity_tag" class="badge activity-badge">活动标签</span>
              <span v-if="item.is_suggested" class="badge suggested-badge">推荐标签</span>
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
      title: '标签库 - 原木社区',
      meta: [
        { hid: 'description', name: 'description', content: '原木社区 - 浏览所有小说标签，发现更多精彩内容' }
      ]
    }
  },
  data() {
    return {
      tags: [],
      loading: true,
      error: null
    }
  },
  async asyncData({ $api }) {
    try {
      const tags = await $api.novels.getAllTags()
      return {
        tags: tags || [],
        loading: false
      }
    } catch (error) {
      console.error('获取标签失败:', error)
      return {
        tags: [],
        loading: false,
        error: '获取标签失败，请稍后重试'
      }
    }
  },
  methods: {
    async getNovelTags() {
      this.loading = true
      this.error = null
      
      try {
        const tags = await this.$api.novels.getAllTags()
        this.tags = tags || []
      } catch (error) {
        console.error('获取标签失败:', error)
        this.error = '获取标签失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    gotoTagNovels(tagId) {
      this.$router.push(`/tag/collections?tag_id=${tagId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #947358;
$secondary-color: #704C35;
$accent-color: #EA7034;
$orange-color: #ec8600;
$orange-light: #ffcfa5;
$orange-dark: #fa6c2e;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #e0e0e0;
$background-color: #f8f8f8;
$card-background: #fff;

.tags-page {
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
    font-size: 28px;
    font-weight: bold;
    color: $primary-color;
    margin: 0;
  }
  
  .back-button {
    padding: 10px 20px;
    background-color: $primary-color;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: darken($primary-color, 10%);
      transform: translateY(-2px);
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
  min-height: 400px;
  
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
  padding: 10px 24px;
  background-color: $primary-color;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: darken($primary-color, 10%);
    transform: translateY(-2px);
  }
}

.tags-container {
  margin-top: 20px;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.tag-item {
  position: relative;
  background-color: $card-background;
  border: 2px solid $border-color;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: $primary-color;
  }
  
  &.activity {
    border-color: $orange-color;
    background: linear-gradient(135deg, $card-background 0%, rgba($orange-light, 0.1) 100%);
    
    .tag-name {
      color: $orange-color;
    }
  }
  
  &.suggested {
    border-color: $orange-color;
    border-style: dashed;
    
    .tag-name {
      color: $orange-color;
    }
  }
}

.tag-content {
  position: relative;
  z-index: 2;
}

.tag-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: $text-color;
  line-height: 1.3;
}

.tag-count {
  font-size: 14px;
  color: $text-light;
  margin-bottom: 12px;
}

.tag-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.activity-badge {
    background-color: $orange-light;
    color: $orange-color;
  }
  
  &.suggested-badge {
    background-color: rgba($orange-color, 0.1);
    color: $orange-color;
    border: 1px solid $orange-color;
  }
}



// 响应式设计
@media (max-width: 768px) {
  .tags-page {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    
    .page-title {
      font-size: 24px;
    }
  }
  
  .tags-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .tag-item {
    padding: 15px;
    min-height: 100px;
  }
  
  .tag-name {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .tags-grid {
    grid-template-columns: 1fr;
  }
  
  .tag-item {
    min-height: 80px;
  }
}

// 暗色模式支持
.dark-mode {
  .tags-page {
    background-color: #1E1E1E;
    color: #CCCCCC;
  }
  
  .page-header {
    border-bottom-color: #3C3C3C;
    
    .page-title {
      color: #CCCCCC;
    }
  }
  
  .tag-item {
    background-color: #2C2C2C;
    border-color: #3C3C3C;
    
    &:hover {
      border-color: $primary-color;
    }
    
    &.activity {
      background: linear-gradient(135deg, #2C2C2C 0%, rgba($orange-color, 0.1) 100%);
    }
  }
  
  .tag-name {
    color: #CCCCCC;
    
    .activity &,
    .suggested & {
      color: $orange-color;
    }
  }
  
  .tag-count {
    color: #888888;
  }
  
  .loading-container,
  .error-container,
  .empty-container {
    p {
      color: #888888;
    }
  }
}
</style>