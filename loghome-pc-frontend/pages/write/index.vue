<template>
  <div class="write-page">
    <div class="page-header">
      <h1 class="page-title">创作中心</h1>
    </div>

    <div class="write-container">
      <div class="works-section">
        <div class="section-header">
          <h2 class="section-title">我的作品</h2>
          <input v-model="workQuery" class="work-search" aria-label="搜索作品" placeholder="搜索作品名或简介" />
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
                <button class="work-action primary" @click="openEditPage(work.id)">开始写作</button>
                <button class="work-action" @click="$router.push(`/write/edit/${work.id}?tool=settings`)">作品设置</button>
              </div>
              
              <!-- 创作活动板块 -->
              <div class="activity-section" v-if="work.activityInfo && work.activityInfo.hasActivity">
                <h4 class="activity-section-title">创作活动</h4>
                <div class="activity-list">
                  <div v-for="activity in work.activityInfo.activities" :key="activity.tag_id" class="activity-item">
                    <div class="activity-header">
                      <div class="activity-name">{{activity.activity_name}}</div>
                      <span class="activity-status">活动中</span>
                    </div>
                    <div class="activity-description">{{activity.activity_description}}</div>
                    
                    <!-- 活动资讯 -->
                    <div class="activity-news" v-if="activity.activity_news && activity.activity_news.length > 0">
                      <div class="news-title">活动资讯</div>
                      <div class="news-list">
                        <div v-for="news in activity.activity_news" :key="news.title" class="news-item" 
                          @click="openNewsLink(news)">
                          <div class="news-item-title">{{news.title}}</div>
                          <i class="el-icon-arrow-right"></i>
                        </div>
                      </div>
                    </div>

                    <!-- 信息填写入口 -->
                    <div class="activity-form" v-if="activity.required_fields && activity.required_fields.length > 0">
                      <div class="form-status">
                        <div class="form-title">活动参与信息</div>
                        <div class="form-status-text" :class="getFormStatusClass(work.id, activity.tag_id)">
                          {{getFormStatusText(work.id, activity.tag_id, activity.required_fields)}}
                        </div>
                      </div>
                      <button class="form-button" @click="openActivityForm(work.id, activity)">
                        {{hasFilledForm(work.id, activity.tag_id) ? '修改信息' : '填写信息'}}
                      </button>
                    </div>
                  </div>
                </div>
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
      workQuery: '',
      works: [],
      stats: {
        totalWorks: 0,
        totalWords: '0',
        totalViews: '0',
        totalFavorites: 0
      },
      loading: false,
      error: null,
      // 创作活动相关数据
      activityData: {},
      activityFormData: {},
      showActivityForm: false,
      currentActivity: null
    }
  },
  async mounted() {
    this.checkLoginStatus();
    await this.fetchWorks()
    await this.loadActivityData()
  },
  computed: {
    filteredWorks() {
      const works = this.works.filter(work => `${work.title} ${work.description}`.toLowerCase().includes(this.workQuery.trim().toLowerCase()))
      if (this.activeTab === 'all') {
        return works
      } else if (this.activeTab === 'ongoing') {
        return works.filter(work => work.status === '连载中')
      } else if (this.activeTab === 'completed') {
        return works.filter(work => work.status === '已完结')
      } else if (this.activeTab === 'draft') {
        return works.filter(work => work.status === '草稿')
      }
      return this.works
    }
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
      }
    },
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
            let category = novel.novel_type === 'manga' ? '漫画' : '小说'
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
        let category = novel.novel_type === 'manga' ? '漫画' : '小说'
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
    },
    
    openEditPage(workId) {
      // 在新窗口中打开编辑页面
      const url = `/write/edit/${workId}`
      window.open(url, '_blank')
    },
    
    // 创作活动相关方法
    openNewsLink(news) {
      if (news.pc_link) {
        window.open(news.pc_link, '_blank')
      }
    },
    
    openActivityForm(workId, activity) {
       // 打开活动信息填写表单
       this.$router.push(`/write/activity-form/${workId}/${activity.tag_id}`)
     },
    
    hasFilledForm(workId, tagId) {
      // 检查是否已填写表单 - 基于服务器返回的数据
      const work = this.works.find(w => w.id === workId)
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return false
      return work.activityInfo.userInfo.some(info => info.tag_id === tagId)
    },
    
    getFormStatusText(workId, tagId, requiredFields) {
      if (!this.hasFilledForm(workId, tagId)) {
        const requiredCount = requiredFields.filter(field => field.required).length
        return requiredCount > 0 ? `有${requiredCount}项必填信息未填写` : '信息未填写'
      }
      
      const work = this.works.find(w => w.id === workId)
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return '信息未填写'
      
      const userInfo = work.activityInfo.userInfo.find(info => info.tag_id === tagId)
      if (!userInfo) return '信息未填写'
      
      // 从 information_data 字段解析实际的表单数据
      let formData = {}
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {}
      } catch (e) {
        console.error('解析表单数据失败:', e)
        formData = {}
      }
      
      const missingRequired = requiredFields.filter(field => 
        field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')
      )
      
      return missingRequired.length > 0 
        ? `还有${missingRequired.length}项必填信息未完善` 
        : '信息已完善'
    },
    
    getFormStatusClass(workId, tagId) {
      if (!this.hasFilledForm(workId, tagId)) return 'status-incomplete'
      
      const work = this.works.find(w => w.id === workId)
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return 'status-incomplete'
      
      const userInfo = work.activityInfo.userInfo.find(info => info.tag_id === tagId)
      if (!userInfo) return 'status-incomplete'
      
      const activity = work.activityInfo.activities.find(act => act.tag_id === tagId)
      if (!activity) return 'status-incomplete'
      
      // 从 information_data 字段解析实际的表单数据
      let formData = {}
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {}
      } catch (e) {
        console.error('解析表单数据失败:', e)
        formData = {}
      }
      
      const missingRequired = activity.required_fields.filter(field => 
        field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')
      )
      
      return missingRequired.length > 0 ? 'status-incomplete' : 'status-complete'
    },
    
    getRequiredFieldsByTagId(tagId) {
       // 根据tagId获取必填字段
       for (const work of this.works) {
         if (work.activityInfo && work.activityInfo.activities) {
           const activity = work.activityInfo.activities.find(a => a.tag_id === tagId)
           if (activity) {
             return activity.required_fields
           }
         }
       }
       return null
     },
     
     // 加载创作活动数据
     async loadActivityData() {
       try {
         // 为每个作品加载活动信息
         for (const work of this.works) {
           await this.loadWorkActivityInfo(work)
         }
       } catch (error) {
         console.error('加载活动数据失败:', error)
       }
     },
     
     async loadWorkActivityInfo(work) {
       try {
         const response = await this.$api.essays.getNovelActivity(work.id)
         this.$set(work, 'activityInfo', response)
         console.log(work);
       } catch (error) {
         console.error(`加载作品 ${work.id} 的活动信息失败:`, error)
         this.$set(work, 'activityInfo', {
           hasActivity: false,
           activities: []
         })
       }
     },
     
     // 提交活动信息
     async submitActivityInfo(workId, tagId, formData) {
       try {
         const response = await this.$api.essays.submitActivityInfo(workId, tagId, formData)
         if (response.code === 200) {
           // 保存到本地存储
           const key = `activity_form_${workId}_${tagId}`
           localStorage.setItem(key, JSON.stringify(formData))
           
           // 重新加载活动信息
           const work = this.works.find(w => w.id === workId)
           if (work) {
             await this.loadWorkActivityInfo(work)
           }
           
           return { success: true, message: '提交成功' }
         } else {
           return { success: false, message: response.message || '提交失败' }
         }
       } catch (error) {
         console.error('提交活动信息失败:', error)
         return { success: false, message: '网络错误，请重试' }
       }
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
    
    // 创作活动样式
    .activity-section {
      margin-top: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    
    .activity-section-title {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .activity-item {
      background: white;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;
      border: 1px solid #e9ecef;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .activity-name {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }
    
    .activity-status {
      background: #28a745;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .activity-description {
      color: #666;
      font-size: 13px;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    
    .activity-news {
      margin-bottom: 12px;
    }
    
    .news-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    
    .news-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      background: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: #e9ecef;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .news-item-title {
      font-size: 12px;
      color: #666;
      flex: 1;
    }
    
    .news-arrow {
      color: #999;
      font-size: 12px;
    }
    
    .activity-form {
      border-top: 1px solid #e9ecef;
      padding-top: 12px;
    }
    
    .form-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .form-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
    }
    
    .form-status-text {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 10px;
      
      &.status-incomplete {
        background: #ffeaa7;
        color: #d63031;
      }
      
      &.status-complete {
        background: #00b894;
        color: white;
      }
    }
    
    .form-button {
      width: 100%;
      padding: 8px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s;
      
      &:hover {
        background: #0056b3;
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

<style scoped>
.work-search{margin-left:auto;border:1px solid #e8e5df;border-radius:7px;padding:10px 12px;width:240px;font-size:13px;background:white}.work-search:focus-visible{outline:2px solid #947358}.work-item{padding:20px!important;gap:20px!important}.work-cover{width:92px!important;height:124px!important;flex:0 0 92px!important;border-radius:7px!important}.work-title{font-size:18px!important;margin-bottom:8px!important}.work-desc{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px!important}.work-actions{margin-top:12px!important}.work-action{font-size:12px!important;padding:8px 13px!important}.work-update{font-size:11px!important}.work-info{padding:0!important}.work-stats{font-size:12px!important}.section-header{gap:16px}.activity-section{margin-top:16px!important;padding-top:12px!important}@media(max-width:900px){.work-search{width:180px}}
</style>
