<template>
    <div class="read-page">
  
      <div class="banner-container">
        <BannerSwiper :chartList="chartList" />
      </div>
  
      <div class="collections-container">
        <div class="collection-cards">
          <template v-for="(item, index) in safeCollections">
             <div class="collection-card" v-if="index != 1" :key="'collection-' + index">
               <div class="collection-header" @click="gotoCollections(item.collection_title)">
                 <div class="collection-title">
                   <h3><template v-if="(item.collection_title || '').startsWith('原木力')"><LogPowerWordmark />{{ item.collection_title.slice(3) }}</template><template v-else>{{ item.collection_title }}</template></h3>
                   <div class="light-line"></div>
                   <img v-if="item.icon" :src="item.icon" :alt="item.collection_title" class="collection-icon">
                 </div>
                 <div class="more-button">
                   <span>更多</span>
                   <i class="right-icon">❯</i>
                 </div>
               </div>
     
               <div class="novel-slide" v-if="item.collection_type === 'slide'">
                 <div class="slide-wrapper">
                   <div class="book-cover" v-for="novel in item.novels || []" :key="novel.novel_id"
                     @click="readBook(novel.novel_id, novel.novel_type)">
                     <div class="cover-image"
                       :style="novel.picUrl ? `background-image: url(${novel.picUrl})` : `background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`">
                       <span class="novel-type" v-if="novel.novel_type === 'world'">世界设定</span>
                     </div>
                     <div class="book-title">{{ novel.name }}</div>
                   </div>
                 </div>
               </div>
     
               <div class="novel-list" v-else>
                 <div class="list-wrapper">
                   <nuxt-link class="book-card" v-for="novel in (item.novels || []).slice(0, 4)" :key="novel.novel_id"
                     :to="`/novel/${novel.novel_id}`">
                     <div class="book-cover">
                       <img :src="novel.picUrl ? novel.picUrl + '?thumbnail=1' : '/default-book-cover.png'"
                         :alt="novel.name" :onerror="`this.onerror=null;this.src='/default-book-cover.png'`">
                     </div>
                     <div class="book-info">
                       <h4 class="book-title">
                         {{ novel.name }}
                         <span class="book-tag" v-if="novel.novel_type === 'world'">世界设定</span>
                       </h4>
                       <div class="book-author">
                         <img :src="novel.avatar_url || '/default-avatar.png'" alt="作者头像" class="author-avatar"
                           :onerror="`this.onerror=null;this.src='/default-avatar.png'`">
                         <span class="author-name">{{ novel.user_name || novel.author_name || '佚名' }}</span>
                       </div>
                       <p class="book-desc">{{ truncateText(novel.content, 80) }}</p>
                     </div>
                   </nuxt-link>
                 </div>
               </div>
             </div>
             
             <!-- 使用Banner组件 -->
             <Banner page="library" v-if="index === 1" :key="'banner-' + index" />
           </template>
        </div>
      </div>
  
      <div class="novels-container">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载小说列表...</p>
        </div>
  
        <div v-else-if="displayedNovels.length === 0" class="empty-state">
          <p>没有找到符合条件的小说</p>
        </div>
  
        <div v-else>
          <div class="novels-grid">
            <div class="novel-card" v-for="novel in displayedNovels" :key="novel.novel_id">
              <div class="novel-cover" v-if="novel.picUrl" :style="`background-image: url(${novel.picUrl})`">
                <span class="novel-category" v-if="novel.novel_type === 'world'">世界设定</span>
              </div>
              <div class="novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`">
                <span class="novel-category" v-if="novel.novel_type === 'world'">世界设定</span>
              </div>
              <div class="novel-info">
                <h3 class="novel-title">{{ novel.name }}</h3>
                <div class="novel-author-info">
                  <img :src="novel.auther_avatar || '/default-avatar.png'" alt="作者头像" class="author-avatar"
                    :onerror="`this.onerror=null;this.src='/default-avatar.png'`">
                  <span class="author-name">{{ novel.author_name || '佚名' }}</span>
                </div>
                <p class="novel-desc">{{ truncateText(novel.content, 80) }}</p>
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
  
          <!-- 加载更多按钮 -->
          <div class="load-more-container">
            <button v-if="!loading && !allLoaded && !isLoadingMore" class="load-more-button" @click="loadMoreNovels">
              加载更多
            </button>
  
            <div v-if="isLoadingMore" class="loading-state">
              <div class="loading-spinner-small"></div>
              <p>正在加载更多小说...</p>
            </div>
  
            <div v-if="allLoaded" class="all-loaded-message">
              <p>已加载全部小说</p>
            </div>
  
            <div v-if="hasError" class="error-message">
              <p>{{ errorMessage }}</p>
              <button class="retry-button" @click="loadMoreNovels">重试</button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="sidebar">
  
        <div class="sidebar-section">
          <h3 class="sidebar-title">随机推书</h3>
          <ul class="ranking-list">
            <nuxt-link v-for="(novel, index) in randomNovels || []" :key="novel.novel_id" :to="`/novel/${novel.novel_id}`"
              class="ranking-item-link">
              <li class="ranking-item" :class="`rank-${index + 1}`">
                <span class="ranking-number">{{ index + 1 }}</span>
                <div class="ranking-info">
                  <h4 class="ranking-title">{{ novel.name }}</h4>
                  <div class="ranking-author-info">
                    <img :src="novel.auther_avatar || '/default-avatar.png'" alt="作者头像" class="author-avatar"
                      :onerror="`this.onerror=null;this.src='/default-avatar.png'`">
                    <span class="author-name">{{ novel.author_name || '佚名' }}</span>
                  </div>
                </div>
                <div class="ranking-stats">
                  <span class="ranking-stat">{{ formatNumber(novel.clicks || 0) }}浏览</span>
                  <span class="novel-status">{{ novel.is_complete === 1 ? '完结' : '连载' }}</span>
                </div>
              </li>
            </nuxt-link>
          </ul>
        </div>
  
        <div class="sidebar-section">
          <h3 class="sidebar-title">热门标签</h3>
          <div class="tag-cloud">
            <nuxt-link v-for="tag in (popularTags || []).slice(0, 12)" :key="tag.tag_id" :to="`/tag/collections?tag_id=${tag.tag_id}`"
              class="tag-link" :style="`font-size: ${12 + Math.min(tag.count / 5, 8)}px`">
              {{ tag.tag_name }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import LogPowerWordmark from '~/components/LogPowerWordmark.vue'
  import BannerSwiper from '~/components/read/BannerSwiper.vue'
  import Banner from '~/components/Banner.vue'
  
  export default {
    components: {
    LogPowerWordmark,
      BannerSwiper,
      Banner
    },
    head() {
      return {
        title: '书库 - 原木社区',
        link: [
          { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1234567_abcdefg.css' }
        ]
      }
    },
    async asyncData({ $api }) {
      try {
        const [tags, chartData, collections] = await Promise.all([
          $api.novels.getAllTags(),
          $api.novels.getLibraryRoulousChart(),
          $api.novels.getLibraryCollections()
        ])
  
        // 处理轮播图数据
        const chartList = []
        if (chartData && Array.isArray(chartData)) {
          for (const item of chartData) {
            if (item.isValid === 1) {
              chartList.push({
                img: item.image,
                title: item.title,
                Subtitle: item.name,
                navigate_to: item.navigate_to_pc
              })
            }
          }
        }
  
        // 处理集合数据
        const processedCollections = collections || []
        const collectionNovelsPromises = processedCollections.map(collection =>
          $api.novels.getCollectionNovels(collection.collection_title, 1, 10)
            .then(novels => ({ collection_title: collection.collection_title, novels: novels || [] }))
            .catch(error => {
              console.error(`获取集合 ${collection.collection_title} 的小说失败`, error)
              return { collection_title: collection.collection_title, novels: [] }
            })
        )
  
        const collectionResults = await Promise.all(collectionNovelsPromises)
  
        // 将获取到的小说数组分配给对应的集合
        collectionResults.forEach(result => {
          const collection = processedCollections.find(c => c.collection_title === result.collection_title)
          if (collection) {
            collection.novels = result.novels
          }
        })
  
        return {
          tags: tags || [],
          chartList,
          collections: processedCollections,
          loading: false
        }
      } catch (error) {
        console.error('获取数据失败', error)
        return {
          tags: [],
          chartList: [],
          collections: [],
          loading: false
        }
      }
    },
    data() {
      return {
        // 小说列表数据
        novels: [],
        displayedNovels: [],
  
        // 分页和加载状态
        pageSize: 12,
        loading: false,
        isLoadingMore: false,
        allLoaded: false,
  
        // 数据
        tags: [],
        chartList: [],
        collections: [],
  
        // 错误状态
        hasError: false,
        errorMessage: '',
  
      }
    },
    computed: {
      // 热门小说（点击量排序前5）
      randomNovels() {
        if (!this.novels || !this.novels.length) return []
        console.log('计算随机小说列表', this.novels.length)
        return [...this.novels]
          .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
          .slice(0, 5)
      },
  
      // 热门标签（按关联小说数量排序）
      popularTags() {
        if (!this.tags || !this.tags.length) return []
        return [...this.tags].sort((a, b) => (b.count || 0) - (a.count || 0))
      },
  
      // collections数组
      safeCollections() {
        return this.collections || []
      }
    },
    methods: {
      // 获取随机小说
      async fetchRandomNovels() {
        this.loading = true
        try {
          const novels = await this.$api.novels.getAllNovels()
          this.novels = novels || []
          this.displayedNovels = this.novels.slice(0, this.pageSize)
  
        } catch (error) {
          console.error('获取随机小说列表失败', error)
          this.hasError = true
          this.errorMessage = '获取小说列表失败，请稍后再试'
        } finally {
          this.loading = false
        }
      },
  
      // 加载更多小说（获取新的随机小说）
      async loadMoreNovels() {
        if (this.isLoadingMore || this.loading) return
        console.log('开始加载更多小说')
  
        this.isLoadingMore = true
  
        try {
          // 获取新的随机小说，而不是加载现有数组的更多项
          const newNovels = await this.$api.novels.getAllNovels()
  
          if (newNovels && newNovels.length) {
            // 过滤掉已经显示的小说（根据novel_id去重）
            const existingIds = new Set(this.displayedNovels.map(novel => novel.novel_id))
            const uniqueNewNovels = newNovels.filter(novel => !existingIds.has(novel.novel_id))
  
            if (uniqueNewNovels.length > 0) {
              this.displayedNovels = [...this.displayedNovels, ...uniqueNewNovels.slice(0, this.pageSize)]
              console.log('加载了新小说', uniqueNewNovels.length)
            } else {
              // 如果没有新的唯一小说，标记为已全部加载
              console.log('没有新的唯一小说')
              this.allLoaded = true
            }
          } else {
            console.log('API没有返回小说')
            this.allLoaded = true
          }
        } catch (error) {
          console.error('加载更多随机小说失败', error)
          this.hasError = true
          this.errorMessage = '加载更多小说失败，请稍后再试'
        } finally {
          this.isLoadingMore = false
        }
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
      },
  
      // 格式化日期时间
      formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return '暂无更新';
  
        try {
          const date = new Date(dateTimeStr);
          if (isNaN(date.getTime())) return '日期格式错误';
  
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
  
          return `${year}-${month}-${day}`;
        } catch (error) {
          console.error('日期格式化错误', error);
          return '日期格式错误';
        }
      },
  
      // 前往专题集合页面
      gotoCollections(collectionTitle) {
        console.log('准备跳转到集合页面:', collectionTitle)
        // 确保标题是字符串并且不为空
        if (!collectionTitle || typeof collectionTitle !== 'string') {
          console.error('无效的集合标题:', collectionTitle)
          return
        }
        
        try {
          const encodedTitle = encodeURIComponent(collectionTitle.trim())
          const url = `/read/collections?title=${encodedTitle}`
          console.log('跳转URL:', url)
          this.$router.push(url)
        } catch (error) {
          console.error('跳转集合页面失败:', error)
        }
      },
  
      // 阅读小说或世界设定
      readBook(novelId, novelType) {
        if (novelId) {
          // 如果是世界设定类型，跳转到world页面，否则跳转到novel页面
          if (novelType === 'world') {
            this.$router.push(`/world/${novelId}`)
          } else {
            this.$router.push(`/novel/${novelId}`)
          }
        }
      },
    },
    mounted() {
      // 仅在客户端执行
      if (process.client) {
        console.log('组件挂载，开始获取随机小说')
        // 获取随机小说
        this.fetchRandomNovels()
      }
    },
    async fetch() {
      // fetch钩子在客户端导航时被调用，用于处理错误或数据刷新
      if (this.$fetchState.pending || this.$fetchState.error) {
        this.loading = true
      } else {
        this.loading = false
      }
    },
    watch: {
      // 监听小说数据变化，更新显示状态
      novels: {
        handler(newNovels) {
          if (Array.isArray(newNovels) && newNovels.length && this.displayedNovels.length === 0) {
            this.displayedNovels = newNovels.slice(0, this.pageSize)
          }
        },
        immediate: true
      }
    }
  }
  </script>
  
  <style lang="scss">
  @use "sass:color";
  
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
  
  // 全局样式
  * {
    box-sizing: border-box;
  }
  
  img {
    max-width: 100%;
  }
  
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
  
  .read-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 30px;
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(300px, 1fr);
    grid-column-gap: 30px;
    grid-row-gap: 30px;
    grid-template-areas:
      "header header"
      "banner sidebar"
      "collections sidebar"
      "content sidebar";
    box-sizing: border-box;
  
    .full-width {
      grid-column: 1 / -1;
    }
  
    .page-header {
      grid-area: header;
  
      .page-title {
        font-size: 24px;
        color: $secondary-color;
      }
    }
  
    /* 轮播图容器 */
    .banner-container {
      grid-area: banner;
      width: 100%;
      overflow: hidden;
    }
  
    .collections-container {
      grid-area: collections;
      width: 100%;
    }
  
    .collection-cards {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
  
      .collection-card {
        background-color: $background-color;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        width: 100%;
        max-width: 100%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
        .collection-header {
          @include flex-between;
          padding: 15px;
          border-bottom: 1px solid $border-light;
          cursor: pointer;
          transition: background-color 0.2s;
  
          &:hover {
            background-color: $border-light;
          }
  
          .collection-title {
            display: flex;
            align-items: center;
            position: relative;
  
            h3 {
              font-size: 18px;
              margin: 0;
              color: $text-color;
              position: relative;
              z-index: 1;
            }
  
            .light-line {
              position: absolute;
              bottom: 0;
              left: 0;
              height: 8px;
              width: 100%;
              background-color: rgba($success-color, 0.3);
              z-index: 0;
            }
  
            .collection-icon {
              width: 24px;
              height: 24px;
              margin-left: 10px;
              border-radius: 4px;
            }
          }
  
          .more-button {
            display: flex;
            align-items: center;
            color: $primary-color;
            font-size: 14px;
  
            .right-icon {
              font-style: normal;
              margin-left: 5px;
            }
          }
        }
  
        .novel-slide {
          padding: 15px;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
  
          .slide-wrapper {
            display: flex;
            overflow-x: auto;
            gap: 15px;
            padding-bottom: 10px;
            width: 100%;
            max-width: 100%;
  
            &::-webkit-scrollbar {
              height: 6px;
            }
  
            &::-webkit-scrollbar-track {
              background: $border-light;
              border-radius: 10px;
            }
  
            &::-webkit-scrollbar-thumb {
              background: $primary-color;
              border-radius: 10px;
            }
  
            .book-cover {
              flex: 0 0 auto;
              width: 120px;
              min-width: 120px;
              max-width: 120px;
              cursor: pointer;
              transition: transform 0.3s;
  
              &:hover {
                transform: translateY(-5px);
              }
  
              .cover-image {
                height: 160px;
                border-radius: 6px;
                background-size: cover;
                background-position: center;
                position: relative;
                margin-bottom: 8px;
  
                .novel-type {
                  position: absolute;
                  top: 5px;
                  right: 5px;
                  background-color: rgba($primary-color, 0.8);
                  color: white;
                  padding: 2px 6px;
                  border-radius: 10px;
                  font-size: 12px;
                }
              }
  
              .book-title {
                font-size: 14px;
                color: $text-color;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
              }
            }
          }
        }
  
        .novel-list {
          padding: 15px;
  
          .list-wrapper {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            max-width: 100%;
  
            .book-card {
              display: flex;
              padding: 10px;
              border-radius: 6px;
              text-decoration: none;
              color: inherit;
              transition: all 0.3s;
              max-width: 100%;
              overflow: hidden;
  
              &:hover {
                background-color: $border-light;
              }
  
              .book-cover {
                width: 80px;
                min-width: 80px;
                height: 120px;
                flex-shrink: 0;
                margin-right: 15px;
  
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 4px;
                }
              }
  
              .book-info {
                flex: 1;
                overflow: hidden;
                min-width: 0;
  
                .book-title {
                  font-size: 16px;
                  font-weight: bold;
                  margin: 0 0 8px;
                  color: $text-color;
                  display: flex;
                  align-items: center;
                  overflow: hidden;
  
                  // 文本溢出时显示省略号
                  white-space: nowrap;
                  text-overflow: ellipsis;
  
                  .book-tag {
                    font-size: 12px;
                    background-color: $warning-color;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    margin-left: 8px;
                    font-weight: normal;
                    flex-shrink: 0;
                  }
                }
  
                .book-author {
                  display: flex;
                  align-items: center;
                  margin-bottom: 8px;
  
                  .author-avatar {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    margin-right: 6px;
                    flex-shrink: 0;
                  }
  
                  .author-name {
                    font-size: 14px;
                    color: $primary-color;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
  
                .book-desc {
                  font-size: 13px;
                  color: $text-light;
                  margin: 0;
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  line-height: 1.5;
                  max-width: 100%;
                }
              }
            }
          }
        }
      }
    }
  
    .novels-container {
      grid-area: content;
      width: 100%;
  
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
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        grid-gap: 20px;
  
        .novel-card {
          background-color: $background-color;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
          &:hover {
            @include card-hover;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
          }
  
          .novel-cover {
            width: 100%;
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
            display: flex;
            flex-direction: column;
            flex: 1;
  
            .novel-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
              color: $text-color;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
  
            .novel-author-info {
              display: flex;
              align-items: center;
              margin-bottom: 5px;
  
              .author-avatar {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                margin-right: 8px;
                flex-shrink: 0;
                object-fit: cover;
              }
  
              .author-name {
                font-size: 14px;
                color: $primary-color;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
  
            .novel-desc {
              color: $text-light;
              font-size: 14px;
              line-height: 1.5;
              margin-bottom: 15px;
              height: 60px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              flex: 1;
            }
  
            .novel-stats {
              @include flex-between;
              margin-bottom: 15px;
              font-size: 12px;
              color: $text-lighter;
  
              span {
                display: inline-flex;
                align-items: center;
                margin-right: 8px;
  
                &:last-child {
                  margin-right: 0;
                }
              }
            }
  
            .novel-update-time {
              @include flex-between;
              margin-bottom: 15px;
              font-size: 12px;
              color: $text-lighter;
  
              span {
                display: inline-flex;
                align-items: center;
                margin-right: 8px;
  
                &:last-child {
                  margin-right: 0;
                }
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
              margin-top: auto;
  
              &:hover {
                background-color: color.adjust($primary-color, $lightness: -10%);
              }
            }
          }
        }
      }
    }
  
    .sidebar {
      grid-area: sidebar;
      position: sticky;
      top: 30px;
      height: fit-content;
      align-self: start;
      width: 100%;
      max-width: 300px;
  
      .sidebar-section {
        background-color: $background-color;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
        .sidebar-title {
          padding: 15px;
          margin: 0;
          background-color: $primary-color;
          color: white;
          font-size: 16px;
        }
  
        .history-list {
          list-style: none;
          padding: 0;
          margin: 0;
  
          .history-item {
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            padding: 12px 15px;
            border-bottom: 1px solid $border-light;
            transition: background-color 0.2s ease;
  
            &:hover {
              background-color: rgba($primary-color, 0.1);
            }
  
            .history-cover {
              width: 50px;
              height: 75px;
              flex-shrink: 0;
              background-size: cover;
              background-position: center;
              border-radius: 4px;
              margin-right: 15px;
            }
  
            .history-info {
              flex: 1;
              overflow: hidden;
  
              .history-title {
                margin: 0 0 3px;
                font-size: 14px;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
  
              .history-author {
                font-size: 12px;
                color: $text-light;
                margin: 0;
              }
            }
          }
        }
  
        .ranking-list {
          list-style: none;
          padding: 0;
          margin: 0;
  
          .ranking-item-link {
            text-decoration: none;
            color: inherit;
            display: block;
  
            &:hover .ranking-item {
              background-color: rgba($primary-color, 0.1);
            }
          }
  
          .ranking-item {
            @include flex-between;
            padding: 12px 15px;
            border-bottom: 1px solid $border-light;
            transition: background-color 0.2s ease;
  
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
            }
  
            &.rank-1 .ranking-number {
              background-color: #FF7043;
            }
  
            &.rank-2 .ranking-number {
              background-color: #FF9800;
            }
  
            &.rank-3 .ranking-number {
              background-color: #FFC107;
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
  
              .ranking-author-info {
                display: flex;
                align-items: center;
                margin-bottom: 3px;
  
                .author-avatar {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  margin-right: 8px;
                  flex-shrink: 0;
                }
  
                .author-name {
                  font-size: 12px;
                  color: $text-light;
                }
              }
            }
  
            .ranking-stats {
              font-size: 12px;
              color: $text-lighter;
              white-space: nowrap;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
  
              .ranking-stat,
              .novel-status {
                margin-bottom: 3px;
  
                &:last-child {
                  margin-bottom: 0;
                }
              }
  
              .novel-status {
                background-color: rgba($primary-color, 0.1);
                color: $primary-color;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
              }
            }
          }
        }
  
        .tag-cloud {
          padding: 15px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
  
          .tag-link {
            display: inline-block;
            padding: 4px 10px;
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
      }
    }
  
    // 淡入淡出动画
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }
  
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  
    // 加载更多按钮样式
    .load-more-container {
      padding: 40px 0;
      text-align: center;
      margin-top: 30px;
  
      .load-more-button {
        @include button-base;
        background-color: $primary-color;
        color: white;
        padding: 12px 40px;
        font-size: 16px;
        border: none;
        box-shadow: 0 2px 8px rgba($primary-color, 0.3);
  
        &:hover {
          background-color: color.adjust($primary-color, $lightness: -10%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba($primary-color, 0.4);
        }
      }
  
      .loading-state {
        @include flex-center;
        flex-direction: column;
  
        .loading-spinner-small {
          width: 30px;
          height: 30px;
          border: 3px solid rgba($primary-color, 0.2);
          border-top-color: $primary-color;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
  
        p {
          color: $text-lighter;
        }
      }
  
      .all-loaded-message {
        color: $text-lighter;
        font-style: italic;
      }
  
      .error-message {
        color: $error-color;
  
        .retry-button {
          @include button-base;
          background-color: $error-color;
          color: white;
          border: none;
          margin-top: 10px;
  
          &:hover {
            background-color: color.adjust($error-color, $lightness: -10%);
          }
        }
      }
    }
  }
  </style>