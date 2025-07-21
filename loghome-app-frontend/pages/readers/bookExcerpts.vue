<template>
  <div class="book-excerpts-container">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'my' }" 
        @click="activeTab = 'my'"
      >
        我的书摘
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'hot' }" 
        @click="activeTab = 'hot'"
      >
        热门书摘
      </div>
    </div>
    
    <div class="excerpts-content">
      <!-- 我的书摘 -->
      <div v-if="activeTab === 'my'" class="my-excerpts">
        <div v-if="loading" class="loading">
          <i class="el-icon-loading"></i> 努力加载中...
        </div>
        <div v-else-if="myExcerpts.length === 0" class="empty-state">
          <i class="el-icon-document"></i>
          <p>还没有添加任何书摘</p>
          <p class="tip">阅读时长按段落可添加书摘</p>
        </div>
        <div v-else class="excerpts-list">
          <div 
            v-for="(excerpt, index) in myExcerpts" 
            :key="'my-' + index" 
            class="excerpt-item"
            @click="navigateToArticle(excerpt.article_id, excerpt.paragraph_id)"
          >
            <div class="excerpt-content">{{ excerpt.paragraph }}</div>
            <div class="excerpt-meta">
              <span class="article-info">来自 第{{ excerpt.article_chapter }}章 {{ excerpt.title }}</span>
              <span class="actions">
                <i class="el-icon-delete" @click.stop="deleteExcerpt(excerpt.article_cento_id)"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 热门书摘 -->
      <div v-if="activeTab === 'hot'" class="hot-excerpts">
        <div v-if="loadingHot" class="loading">
          <i class="el-icon-loading"></i> 努力加载中...
        </div>
        <div v-else-if="hotExcerpts.length === 0" class="empty-state">
          <i class="el-icon-data-analysis"></i>
          <p>暂无热门书摘</p>
        </div>
        <div v-else class="excerpts-list">
          <div 
            v-for="(excerpt, index) in hotExcerpts" 
            :key="'hot-' + index" 
            class="excerpt-item"
            @click="navigateToArticleByParagraph(excerpt)"
          >
            <div class="excerpt-content">{{ excerpt.paragraph }}</div>
            <div class="excerpt-meta">
              <span class="article-info">来自 第{{ excerpt.article_chapter }}章 {{ excerpt.article_title }}</span>
              <div class="stats">
                <span class="stat"><i class="el-icon-edit"></i> {{ excerpt.highlight_count }}</span>
                <span class="stat"><i class="el-icon-chat-line-round"></i> {{ excerpt.comment_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BookExcerpts',
  props: {
    novelId: {
      type: [Number, String],
      required: true
    },
    componentMode: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {
      activeTab: 'my',
      loading: false,
      loadingHot: false,
      myExcerpts: [],
      hotExcerpts: [],
      articleData: {} // 存储文章信息
    };
  },
  created() {
    this.fetchMyExcerpts();
  },
  watch: {
    activeTab(newVal) {
      if (newVal === 'hot' && this.hotExcerpts.length === 0) {
        this.fetchHotExcerpts();
      }
    }
  },
  methods: {
    async fetchMyExcerpts() {
      if (!this.novelId) return;
      
      this.loading = true;
      try {
        const tk = JSON.parse(window.localStorage.getItem('token'));
        if (!tk) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          });
          this.loading = false;
          return;
        }
        
        const res = await axios.get(this.$baseUrl + '/articles/get_my_novel_centos', {
          params: { novel_id: this.novelId },
          headers: {
            'Authorization': 'Bearer ' + tk.tk
          }
        });
        
        if (res.status === 200) {
          this.myExcerpts = res.data;
        }
      } catch (error) {
        console.error('获取我的书摘失败:', error);
        uni.showToast({
          title: '获取书摘失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async fetchHotExcerpts() {
      this.loadingHot = true;
      try {
        const res = await axios.get(this.$baseUrl + '/articles/get_hot_novel_centos', {
          params: { 
            novel_id: this.novelId,
            limit: 20
          }
        });
        
        if (res.status === 200) {
          this.hotExcerpts = res.data;
        }
      } catch (error) {
        console.error('获取热门书摘失败:', error);
        uni.showToast({
          title: '获取热门书摘失败',
          icon: 'none'
        });
      } finally {
        this.loadingHot = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      // 一天内显示"xx小时前"
      if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        if (hours < 1) {
          const minutes = Math.floor(diff / (60 * 1000));
          return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
        }
        return `${hours}小时前`;
      }
      
      // 一周内显示"x天前"
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days}天前`;
      }
      
      // 其他情况显示具体日期
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    
    navigateToArticle(articleId, paragraphId) {
      // 如果是组件模式，触发navigate事件
      if (this.componentMode) {
        this.$emit('navigate', { 
          articleId, 
          paragraphId 
        });
      } else {
        // 否则直接跳转到对应的文章和段落
        uni.navigateTo({
          url: `./newReader/article?id=${articleId}&paragraphId=${paragraphId}`
        });
      }
    },
    
    navigateToArticleByParagraph(excerpt) {
        console.log(excerpt);
      // 如果是组件模式，触发navigate事件
      if (this.componentMode) {
        this.$emit('navigate', { 
          articleId: excerpt.article_id || '', 
          paragraphId: excerpt.paragraph_id 
        });
      } else {
        // 否则直接跳转到对应的文章和段落
        uni.navigateTo({
          url: `./newReader/article?id=${excerpt.article_id || ''}&paragraphId=${excerpt.paragraph_id}`
        });
      }
    },
    
    async deleteExcerpt(centoId) {
      try {
        const tk = JSON.parse(window.localStorage.getItem('token'));
        if (!tk) return;
        
        // 添加确认提示
        uni.showModal({
          title: '确认删除',
          content: '确定要删除这条书摘吗？',
          confirmColor: '#F56C6C',
          success: async (res) => {
            if (res.confirm) {
              try {
                await axios.post(this.$baseUrl + '/articles/remove_article_cento', {
                  article_cento_id: centoId
                }, {
                  headers: {
                    'Authorization': 'Bearer ' + tk.tk
                  }
                });
                
                // 移除已删除的书摘
                this.myExcerpts = this.myExcerpts.filter(item => item.article_cento_id !== centoId);
                
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
              } catch (error) {
                console.error('删除书摘失败:', error);
                uni.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('删除书摘失败:', error);
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
    },

    onLoad(option) {
      if (option.novelId) {
        this.novelId = option.novelId;
        this.fetchMyExcerpts();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.book-excerpts-container {
  height: calc(100% - 44px);
  display: flex;
  flex-direction: column;
  
  .tabs {
    display: flex;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 20rpx;
    
    .tab {
      padding: 20rpx 40rpx;
      font-size: 30rpx;
      position: relative;
      color: #606266;
      
      &.active {
        color: #FF5835;
        font-weight: 500;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 20rpx;
          right: 20rpx;
          height: 3px;
          background-color: #FF5835;
          border-radius: 3px 3px 0 0;
        }
      }
    }
  }
  
  .excerpts-content {
    flex: 1;
    overflow-y: auto;
    padding: 20rpx;
    
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100rpx;
      color: #909399;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 300rpx;
      color: #909399;
      
      i {
        font-size: 60rpx;
        margin-bottom: 20rpx;
      }
      
      .tip {
        font-size: 24rpx;
        margin-top: 10rpx;
      }
    }
    
    .excerpts-list {
      .excerpt-item {
        background-color: #fff;
        border-radius: 10rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        
        .excerpt-content {
          font-size: 28rpx;
          line-height: 1.6;
          color: #303133;
          margin-bottom: 20rpx;
          text-indent: 2em;
          position: relative;
          
          &:before {
            content: '"';
            position: absolute;
            left: -0.5em;
            top: -0.3em;
            font-size: 1.5em;
            color: #DCDFE6;
          }
          
          &:after {
            content: '"';
            position: absolute;
            margin-left: 0.1em;
            font-size: 1.5em;
            color: #DCDFE6;
          }
        }
        
        .excerpt-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24rpx;
          color: #909399;
          
          .time, .article-info {
            flex: 1;
          }
          
          .actions {
            i {
              font-size: 30rpx;
              padding: 10rpx;
              
              &:active {
                color: #F56C6C;
              }
            }
          }
          
          .stats {
            display: flex;
            
            .stat {
              margin-left: 20rpx;
              
              i {
                margin-right: 4rpx;
              }
            }
          }
        }
      }
    }
  }
}
</style> 