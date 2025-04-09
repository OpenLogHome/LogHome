<template>
  <div class="read-page">
    <div class="page-header">
      <h1 class="page-title">小说阅读</h1>
      <div class="filter-controls">
        <div class="filter-group">
          <select class="filter-select" v-model="selectedCategory" @change="filterNovels">
            <option value="">全部分类</option>
            <option v-for="tag in popularTags" :key="tag.tag_id" :value="tag.tag_id">{{ tag.tag_name }}</option>
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" v-model="selectedSort" @change="filterNovels">
            <option value="latest">最新发布</option>
            <option value="popular">人气最高</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
      </div>
    </div>

    <div class="novels-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载小说列表...</p>
      </div>

      <div v-else-if="filteredNovels.length === 0" class="empty-state">
        <p>没有找到符合条件的小说</p>
      </div>

      <div v-else class="novels-grid">
        <div class="novel-card" v-for="novel in filteredNovels" :key="novel.novel_id">
          <div class="novel-cover" v-if="novel.cover_url" :style="`background-image: url(${novel.cover_url})`">
            <span class="novel-category" v-if="novel.novel_type">{{ novel.novel_type }}</span>
          </div>
          <div class="novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`">
            <span class="novel-category" v-if="novel.novel_type">{{ novel.novel_type }}</span>
          </div>
          <div class="novel-info">
            <h3 class="novel-title">{{ novel.name }}</h3>
            <p class="novel-author">{{ novel.author_name || '佚名' }}</p>
            <p class="novel-desc">{{ truncateText(novel.content, 80) }}</p>
            <div class="novel-stats">
              <span title="阅读量">👁️ {{ formatNumber(novel.clicks || 0) }}</span>
              <span title="点赞数">❤️ {{ formatNumber(novel.nices || 0) }}</span>
              <span title="字数">📃 {{ formatNumber(novel.text_count || 0) }}字</span>
            </div>
            <nuxt-link :to="`/novel/${novel.novel_id}`" class="read-button">开始阅读</nuxt-link>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button class="pagination-button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
        <button 
          v-for="page in displayedPages" 
          :key="page" 
          class="pagination-button" 
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <span v-if="showEllipsisEnd" class="pagination-ellipsis">...</span>
        <button v-if="showLastPage" class="pagination-button" @click="changePage(totalPages)">{{ totalPages }}</button>
        <button class="pagination-button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
      </div>
    </div>

    <div class="sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">热门榜单</h3>
        <ul class="ranking-list">
          <li class="ranking-item" v-for="(novel, index) in topNovels" :key="novel.novel_id">
            <span class="ranking-number">{{ index + 1 }}</span>
            <div class="ranking-info">
              <h4 class="ranking-title">{{ novel.name }}</h4>
              <p class="ranking-author">{{ novel.author_name || '佚名' }}</p>
            </div>
            <span class="ranking-stat">{{ formatNumber(novel.clicks || 0) }}浏览</span>
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">热门标签</h3>
        <div class="tag-cloud">
          <nuxt-link 
            v-for="tag in popularTags.slice(0, 12)" 
            :key="tag.tag_id" 
            :to="`/tag/${tag.tag_id}`" 
            class="tag-link" 
            :style="`font-size: ${12 + Math.min(tag.count / 5, 8)}px`"
          >
            {{ tag.tag_name }}
          </nuxt-link>
        </div>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">编辑推荐</h3>
        <div class="editor-picks">
          <div class="pick-item" v-for="novel in editorPicks" :key="novel.novel_id">
            <div class="pick-cover" v-if="novel.cover_url" :style="`background-image: url(${novel.cover_url})`"></div>
            <div class="pick-cover" v-else :style="`background-color: hsl(${novel.novel_id * 90 % 360}, 70%, 80%)`"></div>
            <div class="pick-info">
              <h4 class="pick-title">{{ novel.name }}</h4>
              <p class="pick-desc">{{ truncateText(novel.content, 40) }}</p>
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
      title: '小说阅读 - 原木社区'
    }
  },
  data() {
    return {
      // 筛选和分页
      selectedCategory: '',
      selectedSort: 'latest',
      currentPage: 1,
      pageSize: 12,
      
      // 数据状态
      loading: true,
      novels: [],
      tags: [],
      
      // 缓存数据
      novelsByTag: {}
    }
  },
  computed: {
    // 根据筛选条件过滤后的小说列表
    filteredNovels() {
      let result = [...this.novels]
      
      // 如果选择了分类标签
      if (this.selectedCategory) {
        // 如果已经缓存了该标签的小说
        if (this.novelsByTag[this.selectedCategory]) {
          result = this.novelsByTag[this.selectedCategory]
        } else {
          result = result.filter(novel => {
            // 这里简化处理，实际应该通过标签关联查询
            return novel.novel_type && novel.novel_type.includes(this.selectedCategory)
          })
        }
      }
      
      // 根据排序方式排序
      if (this.selectedSort === 'latest') {
        result.sort((a, b) => new Date(b.update_time || 0) - new Date(a.update_time || 0))
      } else if (this.selectedSort === 'popular') {
        result.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      } else if (this.selectedSort === 'rating') {
        result.sort((a, b) => (b.nices || 0) - (a.nices || 0))
      }
      
      // 分页处理
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      
      return result.slice(startIndex, endIndex)
    },
    
    // 总页数
    totalPages() {
      const filteredCount = this.selectedCategory ? 
        (this.novelsByTag[this.selectedCategory]?.length || 0) : 
        this.novels.length
      
      return Math.ceil(filteredCount / this.pageSize)
    },
    
    // 显示的页码范围
    displayedPages() {
      if (this.totalPages <= 5) {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1)
      }
      
      if (this.currentPage <= 3) {
        return [1, 2, 3, 4, 5]
      }
      
      if (this.currentPage >= this.totalPages - 2) {
        return Array.from({ length: 5 }, (_, i) => this.totalPages - 4 + i)
      }
      
      return [
        this.currentPage - 2,
        this.currentPage - 1,
        this.currentPage,
        this.currentPage + 1,
        this.currentPage + 2
      ]
    },
    
    // 是否显示末尾省略号
    showEllipsisEnd() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    },
    
    // 是否显示最后一页按钮
    showLastPage() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    },
    
    // 热门小说（点击量排序前5）
    topNovels() {
      return [...this.novels]
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5)
    },
    
    // 编辑推荐（随机推荐3本）
    editorPicks() {
      // 这里模拟编辑推荐，实际可能需要后端提供或基于特定算法
      const shuffled = [...this.novels].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 3)
    },
    
    // 热门标签（按关联小说数量排序）
    popularTags() {
      return [...this.tags].sort((a, b) => (b.count || 0) - (a.count || 0))
    }
  },
  methods: {
    // 获取所有小说
    async fetchNovels() {
      this.loading = true
      try {
        const novels = await this.$api.novels.getAllNovels()
        this.novels = novels || []
      } catch (error) {
        console.error('获取小说列表失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有标签
    async fetchTags() {
      try {
        const tags = await this.$api.novels.getAllTags()
        this.tags = tags || []
      } catch (error) {
        console.error('获取标签列表失败', error)
      }
    },
    
    // 获取标签关联的小说
    async fetchNovelsByTag(tagId) {
      if (this.novelsByTag[tagId]) return
      
      try {
        const novels = await this.$api.novels.getTagCollections(tagId)
        this.novelsByTag[tagId] = novels || []
      } catch (error) {
        console.error(`获取标签 ${tagId} 关联小说失败`, error)
        this.novelsByTag[tagId] = []
      }
    },
    
    // 筛选小说
    async filterNovels() {
      // 如果选择了标签且未加载该标签的小说
      if (this.selectedCategory && !this.novelsByTag[this.selectedCategory]) {
        this.loading = true
        await this.fetchNovelsByTag(this.selectedCategory)
        this.loading = false
      }
      
      // 重置到第一页
      this.currentPage = 1
    },
    
    // 更改页码
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      // 滚动到顶部
      window.scrollTo(0, 0)
    },
    
    // 格式化数字（大于1000显示为1k）
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    },
    
    // 截断文本
    truncateText(text, length) {
      if (!text) return '暂无简介'
      return text.length > length ? text.substring(0, length) + '...' : text
    }
  },
  async mounted() {
    // 页面加载时获取初始数据
    await Promise.all([
      this.fetchNovels(),
      this.fetchTags()
    ])
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

@mixin card-hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
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

.read-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 10px;
  }
}

.page-header {
  margin-bottom: 20px;
  
  .page-title {
    font-size: 24px;
    margin-bottom: 15px;
    color: $secondary-color;
  }
  
  .filter-controls {
    @include flex-between;
    flex-wrap: wrap;
    
    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .filter-group {
      margin-bottom: 10px;
      
      @media (max-width: 576px) {
        width: 100%;
      }
      
      .filter-select {
        padding: 8px 12px;
        border: 1px solid $border-color;
        border-radius: 4px;
        background-color: $background-color;
        color: $text-color;
        font-size: 14px;
        min-width: 150px;
        
        @media (max-width: 576px) {
          width: 100%;
        }
        
        &:focus {
          outline: none;
          border-color: $primary-color;
        }
      }
    }
  }
}

.novels-container {
  .loading-container {
    @include flex-center;
    flex-direction: column;
    min-height: 300px;
    
    .loading-spinner {
      @include loading-spinner;
    }
  }
  
  .empty-state {
    @include flex-center;
    min-height: 300px;
    color: $text-lighter;
    font-style: italic;
  }
  
  .novels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 20px;
    
    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
    
    .novel-card {
      background-color: $background-color;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      
      &:hover {
        @include card-hover;
      }
      
      .novel-cover {
        height: 160px;
        background-size: cover;
        background-position: center;
        position: relative;
        
        .novel-category {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba($primary-color, 0.8);
          color: white;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 12px;
        }
      }
      
      .novel-info {
        padding: 15px;
        
        .novel-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
          color: $text-color;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .novel-author {
          color: $primary-color;
          font-size: 14px;
          margin-bottom: 10px;
        }
        
        .novel-desc {
          color: $text-light;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 15px;
          height: 63px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        
        .novel-stats {
          @include flex-between;
          margin-bottom: 15px;
          font-size: 12px;
          color: $text-lighter;
          
          span {
            display: inline-flex;
            align-items: center;
          }
        }
        
        .read-button {
          @include button-base;
          display: block;
          text-align: center;
          background-color: $primary-color;
          color: white;
          text-decoration: none;
          width: 100%;
          
          &:hover {
            background-color: darken($primary-color, 5%);
          }
        }
      }
    }
  }
  
  .pagination {
    @include flex-center;
    margin-top: 30px;
    
    .pagination-button {
      width: 36px;
      height: 36px;
      border: 1px solid $border-color;
      background-color: $background-color;
      color: $text-color;
      margin: 0 5px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }
      
      &.active {
        background-color: $primary-color;
        color: white;
        border-color: $primary-color;
      }
      
      &:disabled {
        color: $text-lighter;
        border-color: $border-color;
        cursor: not-allowed;
      }
    }
    
    .pagination-ellipsis {
      @include flex-center;
      width: 36px;
      height: 36px;
      color: $text-light;
    }
  }
}

.sidebar {
  .sidebar-section {
    background-color: $background-color;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    
    .sidebar-title {
      padding: 15px;
      margin: 0;
      background-color: $primary-color;
      color: white;
      font-size: 16px;
    }
    
    .ranking-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      .ranking-item {
        @include flex-between;
        padding: 12px 15px;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .ranking-number {
          width: 24px;
          height: 24px;
          @include flex-center;
          background-color: $primary-color;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          margin-right: 10px;
          flex-shrink: 0;
          
          &:nth-child(1) {
            background-color: #FF7043;
          }
          
          &:nth-child(2) {
            background-color: #FF9800;
          }
          
          &:nth-child(3) {
            background-color: #FFC107;
          }
        }
        
        .ranking-info {
          flex: 1;
          overflow: hidden;
          
          .ranking-title {
            margin: 0 0 3px;
            font-size: 14px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .ranking-author {
            margin: 0;
            font-size: 12px;
            color: $text-light;
          }
        }
        
        .ranking-stat {
          font-size: 12px;
          color: $text-lighter;
          white-space: nowrap;
        }
      }
    }
    
    .tag-cloud {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      
      .tag-link {
        display: inline-block;
        padding: 4px 10px;
        margin: 0 8px 8px 0;
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
        border-radius: 20px;
        text-decoration: none;
        transition: all 0.2s;
        
        &:hover {
          background-color: $primary-color;
          color: white;
        }
      }
    }
    
    .editor-picks {
      padding: 10px;
      
      .pick-item {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .pick-cover {
          width: 70px;
          height: 90px;
          flex-shrink: 0;
          background-size: cover;
          background-position: center;
          border-radius: 4px;
          margin-right: 10px;
        }
        
        .pick-info {
          flex: 1;
          overflow: hidden;
          
          .pick-title {
            margin: 0 0 5px;
            font-size: 14px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .pick-desc {
            margin: 0;
            font-size: 12px;
            color: $text-light;
            line-height: 1.4;
            height: 50px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .read-page {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    grid-gap: 20px;
    
    @media (max-width: 576px) {
      display: block;
    }
  }
}
</style>