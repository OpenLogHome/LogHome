<template>
  <div class="book-excerpts-container" v-dark>
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'my' }" 
        @click="activeTab = 'my'"
      >
        {{ $t('reader.book.myExcerpts') }}
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'hot' }" 
        @click="activeTab = 'hot'"
      >
        {{ $t('reader.book.hotExcerpts') }}
      </div>
    </div>
    
    <div class="excerpts-content">
      <!-- 我的书摘 -->
      <div v-if="activeTab === 'my'" class="my-excerpts">
        <div v-if="loading" class="loading">
          <i class="el-icon-loading"></i> {{ $t('reader.book.loadingEllipsis') }}
        </div>
        <div v-else-if="myExcerpts.length === 0" class="empty-state">
          <i class="el-icon-document"></i>
          <p>{{ $t('reader.book.noExcerpts') }}</p>
          <p class="tip">{{ $t('reader.book.excerptTip') }}</p>
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
              <span class="article-info">{{ $t('reader.book.fromChapter', { chapter: excerpt.article_chapter, title: excerpt.title }) }}</span>
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
          <i class="el-icon-loading"></i> {{ $t('reader.book.loadingEllipsis') }}
        </div>
        <div v-else-if="hotExcerpts.length === 0" class="empty-state">
          <i class="el-icon-data-analysis"></i>
          <p>{{ $t('reader.book.noHotExcerpts') }}</p>
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
              <span class="article-info">{{ $t('reader.book.fromChapter', { chapter: excerpt.article_chapter, title: excerpt.article_title }) }}</span>
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
import { recentTimeText } from '@/common/datetime.js';

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
            title: this.$t('common.needLogin'),
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
          title: this.$t('reader.book.loadExcerptsFailed'),
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
          title: this.$t('reader.book.loadHotExcerptsFailed'),
          icon: 'none'
        });
      } finally {
        this.loadingHot = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      return recentTimeText(dateString);
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
        const readerProps = window.localStorage.getItem("readerProps");
        const isPageReader = readerProps !== "text";
        const baseUrl = isPageReader ? '/pages/readers/newReader/article' : '/pages/readers/article_rich';
        uni.navigateTo({
          url: `${baseUrl}?id=${articleId}&paragraphId=${paragraphId}`
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
        const readerProps = window.localStorage.getItem("readerProps");
        const isPageReader = readerProps !== "text";
        const baseUrl = isPageReader ? '/pages/readers/newReader/article' : '/pages/readers/article_rich';
        uni.navigateTo({
          url: `${baseUrl}?id=${excerpt.article_id || ''}&paragraphId=${excerpt.paragraph_id}`
        });
      }
    },
    
    async deleteExcerpt(centoId) {
      try {
        const tk = JSON.parse(window.localStorage.getItem('token'));
        if (!tk) return;
        
        // 添加确认提示
        uni.showModal({
          title: this.$t('common.confirmDelete'),
          content: this.$t('reader.book.confirmDeleteExcerpt'),
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
                  title: this.$t('common.deleteSuccess'),
                  icon: 'success'
                });
              } catch (error) {
                console.error('删除书摘失败:', error);
                uni.showToast({
                  title: this.$t('common.deleteFailed'),
                  icon: 'none'
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('删除书摘失败:', error);
        uni.showToast({
          title: this.$t('common.deleteFailed'),
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
  background-color: var(--background-color-secondary);
  color: var(--text-color-primary);
  
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 0 20rpx;
    
    .tab {
      padding: 20rpx 40rpx;
      font-size: 30rpx;
      position: relative;
      color: var(--text-color-regular);
      
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
      color: var(--text-color-secondary);
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 300rpx;
      color: var(--text-color-secondary);
      
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
        background-color: var(--card-background);
        border-radius: 10rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        
        .excerpt-content {
          font-size: 28rpx;
          line-height: 1.6;
          color: var(--text-color-primary);
          margin-bottom: 20rpx;
          text-indent: 2em;
          position: relative;
          
          &:before {
            content: '"';
            position: absolute;
            left: -0.5em;
            top: -0.3em;
            font-size: 1.5em;
            color: var(--text-color-secondary);
          }
          
          &:after {
            content: '"';
            position: absolute;
            margin-left: 0.1em;
            font-size: 1.5em;
            color: var(--text-color-secondary);
          }
        }
        
        .excerpt-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24rpx;
          color: var(--text-color-secondary);
          
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
