<template>
  <div class="community-page">

    <!-- 轮播图区域 -->
    <div class="swiper-section" v-if="swiperItems && swiperItems.length > 0">
      <Banner :banners="swiperItems" page="community_index" />
    </div>

    <!-- 推荐圈子 -->
    <div class="section" v-if="recommendCircles && recommendCircles.length > 0">
      <div class="section-header">
        <h3 class="section-title">推荐圈子</h3>
        <span class="section-more" @click="navigateToCircles">更多</span>
      </div>
      <div class="circles-grid">
        <div class="circle-main" v-if="hasCircle(0)" @click="navigateToCircle(getCircleId(0))">
          <img :src="getCircleImage(0)" alt="圈子背景" class="circle-bg">
          <div class="circle-info">
            <img :src="getCircleIcon(0)" alt="圈子图标" class="circle-icon">
            <div class="circle-details">
              <h4>{{ getCircleName(0) }}</h4>
              <span>{{ getCircleMemberCount(0) }}人</span>
            </div>
          </div>
        </div>
        <div class="circles-side">
          <div class="side-circle" v-if="hasCircle(1)" @click="navigateToCircle(getCircleId(1))">
            <img :src="getCircleIcon(1)" alt="圈子图标">
            <div>
              <h5>{{ getCircleName(1) }}</h5>
              <span>{{ getCircleMemberCount(1) }}人</span>
            </div>
          </div>
          <div class="side-circle" v-if="hasCircle(2)" @click="navigateToCircle(getCircleId(2))">
            <img :src="getCircleIcon(2)" alt="圈子图标">
            <div>
              <h5>{{ getCircleName(2) }}</h5>
              <span>{{ getCircleMemberCount(2) }}人</span>
            </div>
          </div>
          <div class="all-circles" @click="navigateToCircles">
            <span>全部圈子</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">帖子</h3>
        <div class="header-actions">
          <div class="sort-buttons">
            <button 
              :class="['sort-btn', { active: sortType === 'hot' }]" 
              @click="changeSort('hot')">热门</button>
            <button 
              :class="['sort-btn', { active: sortType === 'new' }]" 
              @click="changeSort('new')">最新</button>
          </div>
          <div class="create-post-btn" @click="navigateToCreatePost">
            <i class="el-icon-plus"></i>
            <span>发布</span>
          </div>
        </div>
      </div>

      <div class="posts-list">
        <div class="post-card" v-for="(post, index) in (posts || [])" :key="index" @click="navigateToPost(post.post_id)">
          <div class="post-header">
            <div class="user-info" @click.stop="navigateToUser(post.user_id)">
              <img :src="post.author_avatar" alt="用户头像" class="user-avatar">
              <div class="user-meta">
                <span class="user-name">{{ post.author_name }}</span>
                <span class="post-time">{{ formatTime(post.create_time) }}</span>
              </div>
            </div>
            <div class="post-circle" @click.stop="navigateToCircle(post.circle_id)">
              {{ post.circle_name }}
            </div>
          </div>
          <div class="post-content">
            <h4 class="post-title">{{ post.title }}</h4>
            <p class="post-text">{{ post.content }}</p>
          </div>
          <!-- 图片展示 -->
          <div class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
            <div :class="['image-grid', 'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)]">
              <img 
                v-for="(img, imgIndex) in post.media_urls.slice(0, 9)" 
                :key="imgIndex" 
                :src="img" 
                alt="帖子图片"
                class="post-image"
                @click.stop="previewImage(post.media_urls, imgIndex)"
              >
              <div class="image-count" v-if="post.media_urls.length > 9">+{{ post.media_urls.length - 9 }}</div>
            </div>
          </div>
          <div class="post-footer">
            <div class="action-btn">
              <i class="el-icon-chat-dot-round"></i>
              <span>{{ post.comment_count || 0 }}</span>
            </div>
            <div class="action-btn" @click.stop="likePost(post)" :class="{ liked: post.is_liked }">
              <i :class="post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off'" :style="{ color: post.is_liked ? '#EA7034' : '#666' }"></i>
              <span :class="{ liked: post.is_liked }">{{ post.like_count || 0 }}</span>
            </div>
            <div class="action-btn" @click.stop="sharePost(post)">
              <i class="el-icon-share"></i>
              <span>分享</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <el-button @click="loadMore" :loading="loadingStatus === 'loading'">加载更多</el-button>
      </div>
      <div class="no-more" v-else-if="posts && posts.length > 0">
        <span>没有更多内容了</span>
      </div>
    </div>

    <!-- 悬浮按钮已移至顶部 -->
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue'
import moment from 'moment'

export default {
  components: {
    Banner
  },
  
  head() {
    return {
      title: '社区 - LogHome',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'LogHome社区 - 分享阅读心得，发现优质书籍，与书友交流互动的知识社区平台'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: '读书社区,书评,阅读分享,书友交流,读书笔记,好书推荐'
        },
        {
          property: 'og:title',
          content: 'LogHome社区 - 书友交流分享平台'
        },
        {
          property: 'og:description',
          content: '在LogHome社区发现好书，分享阅读心得，与志同道合的书友一起探讨文学世界'
        },
        {
          property: 'og:type',
          content: 'website'
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://loghome.cn/community'
        }
      ]
    }
  },
  
  data() {
    return {
      sortType: 'new',
      loadingStatus: 'more',
      page: 1,
      pageSize: 10,
      posts: [],
      recommendCircles: [],
      unreadCount: 0,
      hasMore: true,
      swiperItems: []
    }
  },

  async asyncData({ $api }) {
    try {
      // 并行获取数据以提高性能
      const [circlesRes, postsRes, swiperRes] = await Promise.all([
        $api.community.getRecommendCircles({ page: 1, pageSize: 4, sort: 'random' }),
        $api.community.getRecommendPosts({ page: 1, pageSize: 10, sort: 'new' }),
        $api.novels.getLibraryRoulousChart()
      ])


      return {
        recommendCircles: circlesRes?.list || [],
        posts: (postsRes?.list || []).map(post => {
          if (post.media_urls && typeof post.media_urls === 'string') {
            try {
              post.media_urls = JSON.parse(post.media_urls)
            } catch (e) {
              post.media_urls = []
            }
          }
          post.is_liked = false
          post.is_liked_checked = false
          return post
        }),
        swiperItems: (swiperRes || []).filter(item => item.isValid === 1).map(item => ({
          image_url: item.image,
          title: item.title,
          link_url: item.navigate_to === 'None' ? null : item.navigate_to
        })),
        hasMore: postsRes?.total > postsRes?.pageSize
      }
    } catch (error) {
      console.error('获取社区数据失败:', error)
      return {
        recommendCircles: [],
        posts: [],
        swiperItems: [],
        hasMore: false
      }
    }
  },

  mounted() {
    // 客户端获取点赞状态
    if (process.client && this.posts.length > 0) {
      this.getPostsLikeStatus()
    }
    // 初始化瀑布流
    this.$nextTick(() => {
      this.initWaterfall()
    })
  },

  beforeDestroy() {
    // 清理事件监听器
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize)
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer)
    }
  },

  methods: {
    async loadRecommendCircles() {
      try {
        const res = await this.$api.community.getRecommendCircles({
          page: 1,
          pageSize: 4,
          sort: 'random'
        })
        this.recommendCircles = res?.list || []
      } catch (error) {
        console.error('加载推荐圈子失败', error)
        this.recommendCircles = []
      }
    },

    async loadPosts() {
      if (!this.hasMore || this.loadingStatus === 'loading') return
      
      this.loadingStatus = 'loading'
      try {
        const res = await this.$api.community.getRecommendPosts({
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortType
        })
        
        if (res?.list) {
          const newPosts = res.list.map(post => {
            if (post.media_urls && typeof post.media_urls === 'string') {
              try {
                post.media_urls = JSON.parse(post.media_urls)
              } catch (e) {
                post.media_urls = []
              }
            }
            post.is_liked = false
            post.is_liked_checked = false
            return post
          })
          
          if (this.page === 1) {
            this.posts = newPosts
          } else {
            this.posts = [...this.posts, ...newPosts]
          }
          
          this.page++
          this.hasMore = this.posts.length < res.total
          this.loadingStatus = this.hasMore ? 'more' : 'noMore'
          
          // 获取点赞状态
          setTimeout(() => {
            this.getPostsLikeStatus()
          }, 100)
          
          // 重新初始化瀑布流
          this.$nextTick(() => {
            this.initWaterfall()
          })
        }
      } catch (error) {
        console.error('加载帖子失败', error)
        this.loadingStatus = 'more'
      }
    },

    async getPostsLikeStatus() {
      try {
        // 检查是否已登录
        if (!localStorage.getItem('token')) return
        
        const uncheckedPosts = this.posts.filter(post => !post.is_liked_checked)
        if (uncheckedPosts.length === 0) return
        
        for (const post of uncheckedPosts) {
          try {
            const res = await this.$api.community.getLikeStatus({
              target_id: post.post_id,
              target_type: 1
            })
            post.is_liked = res.liked
            post.is_liked_checked = true
          } catch (err) {
            console.error(`获取帖子 ${post.post_id} 点赞状态失败:`, err)
          }
        }
      } catch (error) {
        console.error('获取点赞状态失败:', error)
      }
    },

    changeSort(type) {
      if (this.sortType === type) return
      this.sortType = type
      this.page = 1
      this.posts = []
      this.hasMore = true
      this.loadPosts()
    },

    formatTime(time) {
      const now = moment()
      const postTime = moment(time)
      const diff = now.diff(postTime, 'minutes')
      
      if (diff < 1) return '刚刚'
      if (diff < 60) return `${diff}分钟前`
      
      const hourDiff = now.diff(postTime, 'hours')
      if (hourDiff < 24) return `${hourDiff}小时前`
      
      const dayDiff = now.diff(postTime, 'days')
      if (dayDiff < 30) return `${dayDiff}天前`
      
      return postTime.format('YYYY-MM-DD')
    },

    navigateToSearch() {
      this.$router.push('/community/search?origin=community')
    },

    navigateToCircles() {
      this.$router.push('/community/circles')
    },

    navigateToCircle(circleId) {
      if (!circleId || circleId === 0) {
        this.$message.warning('圈子不存在')
        return
      }
      this.$router.push(`/community/circle/${circleId}`)
    },

    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`)
    },

    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`)
    },

    navigateToCreatePost() {
      this.$router.push('/community/post/edit')
    },
    

    loadMore() {
      if (this.hasMore) {
        this.loadPosts()
      }
    },

    previewImage(images, index) {
      // PC端图片预览逻辑
      console.log('预览图片:', images, index)
    },

    async likePost(post) {
      try {
        const token = this.$auth.getToken()
        if (!token) {
          this.$message.warning('请先登录')
          return
        }

        const res = await this.$api.community.likePost({
          target_id: post.post_id,
          target_type: 1
        })
        
        if (res?.liked !== undefined) {
          post.is_liked = res.liked
          post.like_count += post.is_liked ? 1 : -1
        } else {
          post.is_liked = !post.is_liked
          post.like_count += post.is_liked ? 1 : -1
        }
      } catch (error) {
        console.error('点赞失败', error)
        this.$message.error('操作失败')
      }
    },

    sharePost(post) {
      // PC端分享逻辑
      const shareUrl = `${window.location.origin}/community/post/${post.post_id}`
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.$message.success('链接已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },

    gotoMessage() {
      this.$router.push('/community/message')
    },

    // 圈子相关辅助方法
    getCircleId(index) {
      return this.recommendCircles?.[index]?.circle_id || 0
    },

    getCircleImage(index) {
      const circle = this.recommendCircles?.[index]
      return circle?.bg_url || circle?.icon || '/static/default-circle.png'
    },

    getCircleIcon(index) {
      return this.recommendCircles?.[index]?.icon || '/static/default-circle.png'
    },

    getCircleName(index) {
      return this.recommendCircles?.[index]?.name || '未知圈子'
    },

    getCircleMemberCount(index) {
      return this.recommendCircles?.[index]?.member_count || 0
    },

    hasCircle(index) {
      const circle = this.recommendCircles?.[index]
      return circle && circle.circle_id && circle.circle_id !== 0
    },

    // 瀑布流相关方法
    initWaterfall() {
      if (!process.client) return
      this.$nextTick(() => {
        this.adjustWaterfallLayout()
      })
    },

    adjustWaterfallLayout() {
      // CSS columns 会自动处理布局，这里主要用于监听窗口变化
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', this.handleResize)
      }
    },

    handleResize() {
      // 防抖处理
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.initWaterfall()
      }, 300)
    }
  }
}

</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #e9ecef;
  margin-right: 20px;
}

.search-input-wrapper:hover {
  border-color: #947358;
  box-shadow: 0 4px 16px rgba(148, 115, 88, 0.15);
}

.search-input-wrapper i {
  margin-right: 12px;
  color: #6c757d;
  font-size: 18px;
}

.search-placeholder {
  color: #6c757d;
  font-size: 16px;
}

.message-icon {
  position: relative;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.message-icon:hover {
  background: #947358;
  color: white;
  transform: scale(1.05);
}

.message-icon i {
  font-size: 20px;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* 轮播图样式 */
.swiper-section {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
}

.banner-section {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

/* 通用section样式 */
.section {
  margin-bottom: 30px;
}

.circles-section,
.posts-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #947358, #704C35);
  border-radius: 2px;
}

.section-more {
  color: #947358;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.section-more:hover {
  background: rgba(148, 115, 88, 0.1);
  text-decoration: none;
}

.more-link {
  color: #947358;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.more-link:hover {
  background: rgba(148, 115, 88, 0.1);
  text-decoration: none;
}

.sort-tabs {
  display: flex;
  margin-bottom: 24px;
  background: white;
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.sort-tab {
  flex: 1;
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
}

.sort-tab.active {
  color: white;
  background: linear-gradient(135deg, #947358, #704C35);
  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);
}

.sort-tab:hover:not(.active) {
  color: #947358;
  background: rgba(148, 115, 88, 0.1);
}

/* 排序按钮样式 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn.active {
  background: #947358;
  color: white;
  border-color: #947358;
}

.sort-btn:hover:not(.active) {
  border-color: #947358;
  color: #947358;
}

/* 圈子网格样式 */
.circles-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  align-items: start;
}

/* 主圈子卡片 */
.circle-main {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.05);
  position: relative;
}

.circle-main:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.circle-bg {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.circle-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 20px;
  display: flex;
  align-items: center;
  color: white;
}

.circle-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.circle-details h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.circle-details span {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  font-weight: 500;
}

/* 侧边圈子列表 */
.circles-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.side-circle {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.05);
}

.side-circle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.side-circle img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  border: 1px solid #e9ecef;
}

.side-circle h5 {
  margin: 0 0 2px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.side-circle span {
  font-size: 12px;
  color: #6c757d;
}

.all-circles {
  background: linear-gradient(135deg, #947358, #704C35);
  color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);
}

.all-circles:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(148, 115, 88, 0.4);
}

.all-circles span {
  font-size: 14px;
  font-weight: 600;
}

.all-circles i {
  font-size: 16px;
}

/* 兼容旧样式 */
.circle-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.05);
}

.circle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.circle-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin-right: 16px;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.circle-details h3 {
  margin: 0 0 6px 0;
  font-size: 17px;
  font-weight: 600;
  color: #2c3e50;
}

.circle-members {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

/* 帖子列表样式 - 瀑布流布局 */
.posts-list {
  column-count: 2;
  column-gap: 20px;
  column-fill: balance;
}

.post-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  break-inside: avoid;
  margin-bottom: 20px;
  display: inline-block;
  width: 100%;
}

.post-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
  cursor: pointer;
  border: 2px solid #f8f9fa;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  border-color: #947358;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
  font-size: 15px;
  transition: color 0.3s ease;
  display: block;
}

.user-name:hover {
  color: #947358;
}

.post-time {
  font-size: 13px;
  color: #8e9aaf;
  font-weight: 500;
}

.post-circle {
  background: #f8f9fa;
  color: #6c757d;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-circle:hover {
  background: #e9ecef;
  color: #495057;
}

.post-content {
  margin: 0 0 16px 0;
}

.post-title {
  font-size: 19px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
  line-height: 1.4;
}

.post-text {
  color: #6c757d;
  line-height: 1.6;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.8em;
}

.post-images {
  margin: 16px 0;
}

.image-grid {
  display: grid;
  gap: 8px;
  border-radius: 12px;
  overflow: hidden;
}

.grid-1 {
  grid-template-columns: 1fr;
  max-width: 300px;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 400px;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
  max-width: 450px;
}

.grid-multi {
  grid-template-columns: repeat(3, 1fr);
  max-width: 450px;
}

.post-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-image:hover {
  transform: scale(1.05);
}

.image-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
}

.post-title:hover {
  color: #947358;
}

.post-text {
  color: #495057;
  line-height: 1.7;
  margin-bottom: 16px;
  font-size: 15px;
}

.post-images {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.post-images.single {
  grid-template-columns: 1fr;
  max-width: 500px;
}

.post-images.double {
  grid-template-columns: 1fr 1fr;
}

.post-images.multiple {
  grid-template-columns: repeat(3, 1fr);
}

.post-image {
  width: 100%;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.post-image:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  color: #947358;
  background: rgba(148, 115, 88, 0.1);
}

.action-btn.liked {
  color: #dc3545;
}

.action-btn.liked:hover {
  background: rgba(220,53,69,0.1);
}

/* 加载更多样式 */
.load-more {
  text-align: center;
  padding: 30px;
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #8e9aaf;
  font-size: 14px;
}

/* 发布按钮样式 */
.create-post-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #947358, #704C35);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(148, 115, 88, 0.3);
  transition: all 0.3s ease;
}

.create-post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.4);
}

.message-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .community-page {
    padding: 15px;
  }
  
  .circles-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .circle-main {
    margin-bottom: 16px;
  }
  
  .circles-side {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .all-circles {
    grid-column: 1 / -1;
  }
  
  .sort-buttons {
    display: flex;
    gap: 8px;
  }
  
  .sort-btn {
    flex: 1;
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .post-images.multiple {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .post-card {
    padding: 20px;
  }
  
  .message-btn {
    width: 50px;
    height: 50px;
    bottom: 20px;
    right: 20px;
    font-size: 20px;
  }
  
  /* 瀑布流响应式 */
    .posts-list {
      column-count: 1;
      column-gap: 15px;
    }
}

@media (max-width: 480px) {
  .search-input-wrapper {
    margin-right: 10px;
  }

  .search-placeholder {
    font-size: 14px;
  }

  .section-title {
    font-size: 18px;
  }

  .sort-btn {
    padding: 5px 10px;
    font-size: 13px;
  }
  
  .post-title {
    font-size: 17px;
  }
  
  .post-card {
    padding: 16px;
  }
  
  .post-actions {
    gap: 16px;
  }
  
  .action-btn {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  /* 小屏幕瀑布流 */
  .posts-list {
    column-count: 1;
    column-gap: 0;
  }
}

/* 加载动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-card {
  animation: fadeInUp 0.5s ease-out;
}

/* 骨架屏样式 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>