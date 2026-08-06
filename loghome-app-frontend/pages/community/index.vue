<template>
  <view class="community-container" v-dark>
    <!-- 顶部搜索栏 -->
      <div class="searchBar" v-dark>
        <div class="search-input-wrapper clickable" @tap="navigateToSearch">
          <uni-icons type="search" size="18" color="#999"></uni-icons>
          <view class="search-input-placeholder">搜索书籍、圈子、帖子、用户</view>
        </div>
        <uni-icons type="chat" size="26" :color="$store.state.isDarkMode ? '#e5e5e5' : '#2d2d2d'" class="messageIcon clickable" @click="gotoMessage"></uni-icons>
      </div>

    <!-- 内容区域 -->
    <view 
      class="content-scroll" 
      style="margin-top: calc(105rpx + var(--loghome-safe-top, 0px));"
    >

      <!-- 轮播图区域 -->
      <div class="swiper" v-dark>
        <Xsuu-swiper :swiperItems="newchartList" :margin="18" 
        :borderRadius="10" @clicked="roulousChartClicked"
        class="swiperImgs">
        </Xsuu-swiper>
        <!-- <div class="swiperNav" v-dark>
          <div class="navBtn">
            <img src="../static/swiperNavIcons/category.png" alt="标签" @click="navBarJump('标签')"/>
            <div class="name">标签</div>
          </div>
          <div class="navBtn">
            <img src="../static/swiperNavIcons/activity.png" alt="活动" @click="navBarJump('活动')"/>
            <div class="name">活动</div>
          </div>
          <div class="navBtn">
            <img src="../static/swiperNavIcons/ranks.png" alt="排行" @click="navBarJump('排行')"/>
            <div class="name">排行</div>
          </div>
          <div class="navBtn">
            <img src="../static/swiperNavIcons/recommands.png" alt="推荐" @click="navBarJump('推荐')"/>
            <div class="name">推荐</div>
          </div>
          <div class="navBtn">
            <img src="../static/swiperNavIcons/finish.png" alt="完结" @click="navBarJump('完结')"/>
            <div class="name">完结</div>
          </div>
        </div> -->
      </div>

      <!-- 推荐圈子 -->
      <view
        class="section recommend-circles-section"
        :class="{ 'is-refreshing': circleRefreshAnimating }"
        v-if="recommendCirclesLoading || hasRecommendCircles"
      >
        <view class="section-header">
          <text class="section-title">推圈</text>
          <text class="section-more clickable" @tap="navigateToCircles">更多</text>
        </view>
        <view class="square-grid square-grid-skeleton" v-if="recommendCirclesLoading">
          <view class="square-grid-row">
            <view class="skeleton-block skeleton-main"></view>
            <view class="skeleton-side">
              <view class="skeleton-block skeleton-side-item"></view>
              <view class="skeleton-block skeleton-side-item"></view>
            </view>
          </view>
          <view class="square-grid-bottom">
            <view class="skeleton-block skeleton-bottom-item"></view>
          </view>
        </view>
        <view class="square-grid" v-else>
          <view class="square-grid-content">
            <!-- 第一行：大图 + 两个小图 -->
            <view class="square-grid-row">
              <!-- 左侧大图 -->
              <view class="square-grid-main clickable" @tap="navigateToCircle(mainRecommendCircle.circle_id)" v-if="mainRecommendCircle">
                <image mode="aspectFill" :src="mainRecommendCircle.bg_url"></image>
                <view class="circle-info">
                  <image :src="mainRecommendCircle.icon" mode="aspectFill"></image>
                  <view>{{ mainRecommendCircle.name }}</view>
                  <text>{{ mainRecommendCircle.member_count }}人</text>
                </view>
              </view>
              <!-- 右侧两个小图 -->
              <view class="square-grid-side">
                <view class="side-item clickable" @tap="navigateToCircle(recommendCircleSlots[1].circle_id)" v-if="recommendCircleSlots[1]">
                  <image mode="aspectFill" :src="recommendCircleSlots[1].icon" lazy-load></image>
                  <view>{{ recommendCircleSlots[1].name }}</view>
                  <text>{{ recommendCircleSlots[1].member_count }}人</text>
                </view>
                <view class="side-item clickable" @tap="navigateToCircle(recommendCircleSlots[2].circle_id)" v-if="recommendCircleSlots[2]">
                  <image mode="aspectFill" :src="recommendCircleSlots[2].icon" lazy-load></image>
                  <view>{{ recommendCircleSlots[2].name }}</view>
                  <text>{{ recommendCircleSlots[2].member_count }}人</text>
                </view>
              </view>
            </view>
            <!-- 第二行：一个小图 + 全部圈子按钮 -->
            <view class="square-grid-bottom">
              <view class="bottom-item all-circles clickable" @tap="navigateToCircles">
                <view>全部圈子</view>
                <uni-icons type="arrow-right" size="16"></uni-icons>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 添加Banner组件 -->
      <banner page="community_index" style="margin-bottom: 20rpx;"/>

      <!-- 帖子列表 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">帖子</text>
          <view class="section-actions">
            <text class="sort-btn clickable" :class="{active: sortType === 'hot'}" @tap="changeSort('hot')">热门</text>
            <text class="sort-btn clickable" :class="{active: sortType === 'new'}" @tap="changeSort('new')">最新</text>
          </view>
        </view>

        <view class="post-list" v-if="posts.length > 0">
          <view class="post-waterfall">
            <view class="waterfall-column" v-for="(column, columnIndex) in waterfallPostColumns" :key="columnIndex">
              <view
                class="post-card clickable"
                v-for="item in column"
                :key="item.post.post_id"
                @tap="navigateToPost(item.post.post_id)"
              >
                <view
                  class="post-card-image"
                  :class="item.layoutClass"
                >
                  <image
                    v-if="item.post.media_urls && item.post.media_urls.length > 0"
                    :src="item.post.media_urls[0]"
                    mode="aspectFill"
                    class="card-image"
                  ></image>
                  <view v-else class="card-color-bg" :style="{ backgroundColor: getRandomColor(item.index) }">
                    <text class="card-text-preview">{{item.post.content || item.post.title}}</text>
                  </view>
                </view>
                <view class="post-card-content">
                  <text class="card-title">{{item.post.title}}</text>
                  <view class="card-footer">
                    <view class="card-user clickable" @tap.stop="navigateToUser(item.post.user_id)">
                      <user-avatar class="card-avatar" :src="item.post.author_avatar" />
                      <text class="card-username">{{item.post.author_name}}</text>
					  <membership-badge class="card-membership-badge" :tier="item.post.author_membership_type" size="xs" />
                    </view>
                    <view class="card-likes clickable" @tap.stop="likePost(item.post)">
                      <uni-icons :type="item.post.is_liked ? 'heart-filled' : 'heart'" 
                                 size="14" 
                                 :color="item.post.is_liked ? '#EA7034' : '#999'"></uni-icons>
                      <text>{{item.post.like_count}}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="post-list post-skeleton-list" v-else-if="loadingStatus === 'loading'">
          <view class="post-waterfall">
            <view class="waterfall-column" v-for="n in 2" :key="n">
              <view class="post-card skeleton-post" v-for="m in 3" :key="m">
                <view class="post-card-image skeleton-image"></view>
                <view class="post-card-content">
                  <el-skeleton-item class="skeleton-line skeleton-title" variant="text"></el-skeleton-item>
                  <view class="card-footer">
                    <view class="card-user">
                      <el-skeleton-item class="skeleton-avatar" variant="circle"></el-skeleton-item>
                      <el-skeleton-item class="skeleton-line skeleton-name" variant="text"></el-skeleton-item>
                    </view>
                    <view class="card-likes">
                      <el-skeleton-item class="skeleton-icon" variant="circle"></el-skeleton-item>
                      <el-skeleton-item class="skeleton-count" variant="text"></el-skeleton-item>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view class="post-list post-loadmore-skeleton" v-if="loadingStatus === 'loading' && posts.length > 0">
          <view class="post-waterfall">
            <view class="waterfall-column" v-for="n in 2" :key="n">
              <view class="post-card skeleton-post" v-for="m in 1" :key="m">
                <view class="post-card-image skeleton-image"></view>
                <view class="post-card-content">
                  <el-skeleton-item class="skeleton-line skeleton-title" variant="text"></el-skeleton-item>
                  <view class="card-footer">
                    <view class="card-user">
                      <el-skeleton-item class="skeleton-avatar" variant="circle"></el-skeleton-item>
                      <el-skeleton-item class="skeleton-line skeleton-name" variant="text"></el-skeleton-item>
                    </view>
                    <view class="card-likes">
                      <el-skeleton-item class="skeleton-icon" variant="circle"></el-skeleton-item>
                      <el-skeleton-item class="skeleton-count" variant="text"></el-skeleton-item>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <uni-load-more v-else :status="loadingStatus"></uni-load-more>
      </view>
    </view>

    <!-- 悬浮按钮 -->
    <view class="float-btn clickable" @tap="navigateToCreatePost">
      <uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import banner from '@/components/banner.vue'
import XsuuSwiper from "@/components/Xss-swiper/Xsuu-swiper.vue"
import MembershipBadge from '@/components/membership-badge.vue'
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
  components: {
    banner,
    XsuuSwiper,
    MembershipBadge
  },
  mixins: [darkModeMixin], // 使用暗黑模式mixin
  data() {
    return {
      sortType: 'new',
      isRefreshing: false,
      loadingStatus: 'more',
      page: 1,
      pageSize: 10,
      posts: [],
      recommendCircles: [],
      recommendCirclesLoading: false,
      circleRefreshAnimating: false,
      circleRefreshTimer: null,
      unreadCount: 0,
      hasMore: true,
      chartList: [],
      newchartList: [],
      scrollThrottle: false
    }
  },

  onShow() {
    if (this.$isFromLogin) {
      this.$isFromLogin = false;
      uni.switchTab({
        url: '../library'
      })
      return;
    }
    // 登录检测，未登录则跳转到登录页
    if (!window.localStorage.getItem('token')) {
      this.$isFromLogin = true;
      uni.navigateTo({
        url: '/pages/users/login?msg=unAuthorized'
      });
      return;
    }
    // 初始化推荐圈子数组，避免渲染错误
    this.recommendCircles = [];
    this.loadRecommendCircles();
    this.loadPosts();
    this.refreshSwiperData();
    
    // 确保在页面完全加载后获取点赞状态
  },

  onPullDownRefresh() {
    this.page = 1;
    this.posts = [];
    this.hasMore = true;
    Promise.all([
      this.loadRecommendCircles(),
      this.loadPosts(),
      this.refreshSwiperData()
    ]).finally(() => {
      // 刷新后重新获取点赞状态
      uni.stopPullDownRefresh();
    });
  },

  beforeUnmount() {
    this.clearRecommendCirclesAnimation();
  },

  onReachBottom() {
    this.loadMore();
  },

  onPageScroll(e) {
    if (this.scrollThrottle || !this.hasMore || this.loadingStatus === 'loading') return;
    
    this.scrollThrottle = true;
    setTimeout(() => {
      this.scrollThrottle = false;
      // 获取页面信息
      uni.createSelectorQuery().selectViewport().scrollOffset((res) => {
        const { scrollTop, scrollHeight } = res;
        // 获取窗口高度
        const windowHeight = uni.getSystemInfoSync().windowHeight;

        
        // 当滚动到距离底部100px时开始加载更多
        if (scrollTop + windowHeight >= scrollHeight - 500) {
          this.loadMore();
        }
      }).exec();
    }, 100);
  },

  computed: {
    recommendCircleSlots() {
      if (!Array.isArray(this.recommendCircles)) {
        return [];
      }

      return this.recommendCircles
        .filter(circle => circle && circle.circle_id)
        .slice(0, 3)
        .map(circle => ({
          ...circle,
          bg_url: circle.bg_url || circle.icon || '../../static/default-circle.png',
          icon: circle.icon || '../../static/default-circle.png',
          name: circle.name || '未知圈子',
          member_count: circle.member_count || 0
        }));
    },

    mainRecommendCircle() {
      return this.recommendCircleSlots[0] || null;
    },

    hasRecommendCircles() {
      return this.recommendCircleSlots.length > 0;
    },

    waterfallPostColumns() {
      const columns = [[], []];
      const heights = [0, 0];

      this.posts.forEach((post, index) => {
        const estimatedHeight = this.estimatePostCardWeight(post, index);
        const targetColumn = heights[0] <= heights[1] ? 0 : 1;

        columns[targetColumn].push({
          post,
          index,
          layoutClass: this.getPostImageLayoutClass(post, index)
        });
        heights[targetColumn] += estimatedHeight;
      });

      return columns;
    }
  },

  methods: {
    getRandomColor(index) {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8B500', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9',
        '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124'
      ];
      return colors[index % colors.length];
    },

    getPostImageLayoutClass(post, index) {
      if (!post || !post.media_urls || post.media_urls.length === 0) {
        return 'is-text-only';
      }

      const variants = ['is-tall', 'is-medium', 'is-short'];
      return variants[index % variants.length];
    },

    estimatePostCardWeight(post, index) {
      const titleLength = ((post && post.title) || '').length;
      const contentLength = ((post && post.content) || '').length;
      const hasImage = !!(post && post.media_urls && post.media_urls.length > 0);
      const imageWeightMap = [360, 320, 280];
      const imageWeight = hasImage ? imageWeightMap[index % imageWeightMap.length] : 140;
      const textWeight = Math.min(titleLength * 2 + contentLength * 0.6, 180);

      return 160 + imageWeight + textWeight;
    },

    clearRecommendCirclesAnimation() {
      if (this.circleRefreshTimer) {
        clearTimeout(this.circleRefreshTimer);
        this.circleRefreshTimer = null;
      }
      this.circleRefreshAnimating = false;
    },

    triggerRecommendCirclesAnimation() {
      this.clearRecommendCirclesAnimation();
      this.$nextTick(() => {
        this.circleRefreshAnimating = true;
        this.circleRefreshTimer = setTimeout(() => {
          this.circleRefreshAnimating = false;
          this.circleRefreshTimer = null;
        }, 650);
      });
    },

    preloadRecommendCircleImage(src) {
      if (!src) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        uni.getImageInfo({
          src,
          success: () => resolve(),
          fail: () => resolve()
        });
      });
    },

    preloadRecommendCircleAssets(circles) {
      if (!Array.isArray(circles) || circles.length === 0) {
        return Promise.resolve();
      }

      const imageUrls = [...new Set(
        circles.reduce((urls, circle) => {
          if (circle && circle.bg_url) {
            urls.push(circle.bg_url);
          }
          if (circle && circle.icon) {
            urls.push(circle.icon);
          }
          return urls;
        }, []).filter(Boolean)
      )];

      return Promise.all(imageUrls.map(url => this.preloadRecommendCircleImage(url)));
    },

    async loadRecommendCircles() {
      this.recommendCirclesLoading = true;
      try {
        const res = await axios.get(this.$baseUrl + '/community/circles/list', {
          params: {
            page: 1,
            pageSize: 4,
            sort: 'random'
          }
        });
        
        // 确保有数据
        if (res.data && res.data.list && Array.isArray(res.data.list)) {
          const circles = res.data.list;
          this.recommendCircles = circles;
          this.recommendCirclesLoading = false;
          if (circles.length > 0) {
            this.triggerRecommendCirclesAnimation();
            this.preloadRecommendCircleAssets(circles).catch(() => {});
          } else {
            this.clearRecommendCirclesAnimation();
          }
        } else {
          // 如果没有数据，设置为空数组
          this.recommendCircles = [];
          this.recommendCirclesLoading = false;
          this.clearRecommendCirclesAnimation();
        }
      } catch (error) {
        console.error('加载推荐圈子失败', error);
        // 出错时设置为空数组
        this.recommendCircles = [];
        this.recommendCirclesLoading = false;
        this.clearRecommendCirclesAnimation();
      }
    },

    async loadPosts() {
      if (!this.hasMore || this.loadingStatus === 'loading') return;
      
      this.loadingStatus = 'loading';
      try {
        const res = await axios.get(this.$baseUrl + '/community/posts/recommend', {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            sort: this.sortType
          }
        });
        
        if (res.data && res.data.list) {
          const newPosts = res.data.list.map(post => {
            if (post.media_urls && typeof post.media_urls === 'string') {
              try {
                post.media_urls = JSON.parse(post.media_urls);
              } catch (e) {
                post.media_urls = [];
              }
            }
            
            // 初始化点赞状态
            post.is_liked = false;
            post.is_liked_checked = false;
            
            return post;
          });
          
          // 更新帖子列表
          if (this.page === 1) {
            this.posts = newPosts;
          } else {
            this.posts = [...this.posts, ...newPosts];
          }
          
          this.page++;
          this.hasMore = this.posts.length < res.data.total;
          this.loadingStatus = this.hasMore ? 'more' : 'noMore';
          
          // 获取帖子的点赞状态
          this.$nextTick(() => {
            this.getPostsLikeStatus();
          });
        }
      } catch (error) {
        console.error('加载帖子失败', error);
        this.loadingStatus = 'more';
      }
    },

    async getPostsLikeStatus() {
      try {
        if (!window.localStorage.getItem('token')) {
          console.log('用户未登录，跳过获取点赞状态');
          return;
        }
        
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        
        const uncheckedPosts = this.posts.filter(post => !post.is_liked_checked);
        
        if (uncheckedPosts.length === 0) {
          return;
        }
        
        const targetIds = uncheckedPosts.map(post => post.post_id);
        
        const res = await axios.post(this.$baseUrl + '/community/interactions/like/status/batch', {
          target_ids: targetIds,
          target_type: 1
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        uncheckedPosts.forEach(post => {
          post.is_liked = res.data[post.post_id] || false;
          post.is_liked_checked = true;
        });
      } catch (error) {
        console.error('获取点赞状态失败:', error);
      }
    },

    changeSort(type) {
      if (this.sortType === type) return;
      this.sortType = type;
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts();
    },

    formatTime(time) {
      const now = moment();
      const postTime = moment(time);
      const diff = now.diff(postTime, 'minutes');
      
      if (diff < 1) return '刚刚';
      if (diff < 60) return `${diff}分钟前`;
      
      const hourDiff = now.diff(postTime, 'hours');
      if (hourDiff < 24) return `${hourDiff}小时前`;
      
      const dayDiff = now.diff(postTime, 'days');
      if (dayDiff < 30) return `${dayDiff}天前`;
      
      return postTime.format('YYYY-MM-DD');
    },

    navigateToSearch() {
      uni.navigateTo({ url: '/pages/community/search?origin=community' });
    },

    navigateToNotifications() {
      uni.navigateTo({ url: '/pages/community/notifications' });
    },

    navigateToCircles() {
      uni.navigateTo({ url: '/pages/community/circles' });
    },

    navigateToCircle(circleId) {
      if (!circleId || circleId === 0) {
        uni.showToast({
          title: '圈子不存在',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({ url: `/pages/community/circle?id=${circleId}` });
    },

    navigateToPost(postId) {
      uni.navigateTo({ url: `/pages/community/postDetail?id=${postId}` });
    },

    navigateToUser(userId) {
      uni.navigateTo({ url: `/pages/users/personalPage?id=${userId}` });
    },

    navigateToCreatePost() {
      uni.navigateTo({ url: '/pages/community/postEdit' });
    },

    loadMore() {
      if (this.hasMore) {
        this.loadPosts();
      }
    },



    previewImage(images, index) {
      uni.previewImage({
        urls: images,
        current: images[index]
      });
    },

    async likePost(post) {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk
        const res = await axios.post(this.$baseUrl + '/community/interactions/like', {
          target_id: post.post_id,
          target_type: 1
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        // 根据后端返回的结果更新点赞状态
        if (res.data && res.data.liked !== undefined) {
          post.is_liked = res.data.liked;
          post.like_count += post.is_liked ? 1 : -1;
        } else {
          // 如果后端没有返回明确状态，则切换当前状态
          post.is_liked = !post.is_liked;
          post.like_count += post.is_liked ? 1 : -1;
        }
        
        console.log(`帖子 ${post.post_id} 点赞状态更新为: ${post.is_liked}`);
      } catch (error) {
        console.error('点赞失败', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },

    sharePost(post) {
      this.createShareCode(post);
    },
    
    traditionalShare(post) {
      return `来自原木社区的分享：${post.title}\n${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}\n点击链接查看详情：${window.location.origin}/#/pages/community/postDetail?id=${post.post_id}`;
    },
    
    createShareCode(post) {
      uni.showLoading({
        title: '创建口令中...'
      });

      let tk = JSON.parse(window.localStorage.getItem('token'));
      if (!tk || !tk.tk) {
        uni.hideLoading();
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      axios.post(this.$baseUrl + '/community/posts/create_share_code', {
        post_id: post.post_id,
        share_message: this.traditionalShare(post),
        expires_hours: 24 * 30 // 30天有效期
      }, {
        headers: {
          'Authorization': 'Bearer ' + tk.tk
        }
      }).then((res) => {
        uni.hideLoading();

        if (res.data.success) {
          // 复制口令到剪贴板
          this.$bus.$emit("clipboardChange", res.data.share_text)
          uni.setClipboardData({
            data: res.data.share_text,
            success: () => {
              uni.showModal({
                title: '口令创建成功',
                content: `口令：${res.data.code}\n\n口令已复制到剪贴板，分享给好友即可！`,
                showCancel: false,
                confirmText: '知道了'
              });
            }
          });
        } else {
          uni.showToast({
            title: res.data.msg || '口令创建失败',
            icon: 'none',
            duration: 2000
          });
        }
      }).catch((error) => {
        uni.hideLoading();
        console.error('创建口令失败:', error);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
          duration: 2000
        });
      });
    },

    getCircleId(index) {
      if (!this.recommendCircles || !this.recommendCircles[index]) return 0;
      return this.recommendCircles[index].circle_id || 0;
    },

    getCircleImage(index) {
      if (!this.recommendCircles || !this.recommendCircles[index]) return '../../static/default-circle.png';
      return this.recommendCircles[index].bg_url || this.recommendCircles[index].icon || '../../static/default-circle.png';
    },

    getCircleIcon(index) {
      if (!this.recommendCircles || !this.recommendCircles[index]) return '../../static/default-circle.png';
      return this.recommendCircles[index].icon || '../../static/default-circle.png';
    },

    getCircleName(index) {
      if (!this.recommendCircles || !this.recommendCircles[index]) return '未知圈子';
      return this.recommendCircles[index].name || '未知圈子';
    },

    getCircleMemberCount(index) {
      if (!this.recommendCircles || !this.recommendCircles[index]) return 0;
      return this.recommendCircles[index].member_count || 0;
    },

    hasCircle(index) {
      return this.recommendCircles && 
             this.recommendCircles[index] && 
             this.recommendCircles[index].circle_id && 
             this.recommendCircles[index].circle_id !== 0;
    },

    gotoMessage() {
      uni.navigateTo({
        url: "./message"
      });
    },

    // 刷新轮播图数据
    async refreshSwiperData() {
      try {
        const res = await axios.get(this.$baseUrl + '/library/get_library_roulous_chart');
        this.chartList = res.data;
        this.newchartList = [];
        for(let item of this.chartList){
          if(item.isValid == 1){
            this.newchartList.push({
              img: item.image,
              title: item.title,
              Subtitle: item.name,
              button: (item.navigate_to == "None") ? 0 : 1,
              navigate_to: item.navigate_to
            });
          }
        }
      } catch (error) {
        console.error('加载轮播图失败', error);
      }
    },

    // 响应轮播图点击事件
    roulousChartClicked(item) {
      if(item.navigate_to && item.navigate_to != "None"){
        uni.navigateTo({
          url: "/pages/" + item.navigate_to
        });
      }
    },

    // 导航按钮跳转
    // navBarJump(func) {
    //   switch(func){
    //     case "标签":
    //       uni.navigateTo({
    //         url: "./readers/tags"
    //       });
    //       break;
    //     case "活动":
    //       this.gotoCollections("干草块杯活动专辑");
    //       break;
    //     case "排行":
    //       this.gotoCollections("原木力爆棚");
    //       break;
    //     case "推荐":
    //       this.gotoCollections("原木力飙升");
    //       break;
    //     case "完结":
    //       this.gotoCollections("完本经典");
    //       break;
    //   }
    // },

    // 前往推荐集合的详情界面
    // gotoCollections(title) {
    //   uni.navigateTo({
    //     url: './readers/collections?title=' + title
    //   });
    // }
  }
}
</script>

<style lang="scss" scoped>
// Mixins
@mixin text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@mixin multi-ellipsis($lines) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $lines;
  overflow: hidden;
}

.community-container {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  background-color: #f8f8f8;
  
  &.dark-mode {
    background-color: var(--background-color-secondary);
  }
}

.searchBar {
  position: fixed;
  width: calc(100vw - 20rpx);
  z-index: 10;
  top: 0;
  left: 0;
  margin: 0 0rpx;
  padding: 10rpx;
  padding-top: calc(5rpx + var(--loghome-safe-top, 0px));
  padding-bottom: 5rpx;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  height: 110rpx;
  box-shadow:
    0px 0px 2.2px rgba(0, 0, 0, 0.02),
    0px 0px 5.3px rgba(0, 0, 0, 0.028),
    0px 0px 10px rgba(0, 0, 0, 0.035),
    0px 0px 17.9px rgba(0, 0, 0, 0.042),
    0px 0px 33.4px rgba(0, 0, 0, 0.05),
    0px 0px 80px rgba(0, 0, 0, 0.07);
    
  &.dark-mode {
    background-color: var(--card-background);
  }

  .messageIcon {
    margin: 24rpx 5rpx 20rpx 5rpx;
  }

  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 20rpx;
    height: 72rpx;
    margin-right: 10rpx;
    margin-left: 10rpx;
    
    .dark-mode & {
      background-color: #333;
    }
  }

  .search-input-placeholder {
    flex: 1;
    height: 72rpx;
    line-height: 72rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #999;
  }
}

.content-scroll {
  min-height: calc(100vh - 105rpx);
}

.swiper {
  margin: 0;
  background-color: white;
  padding: 20rpx 0;
  width: 750rpx;
  
  &.dark-mode {
    background-color: var(--card-background);
  }
  
  .swiperImgs {
    position: relative;
    z-index: 1;
  }
  
  .swiperNav {
    position: relative;
    height: 200rpx;
    margin: 0 9px;
    margin-top: -10rpx;
    width: calc(100% - 18px);
    background: linear-gradient(
      180deg,
      rgb(255, 255, 255),
      rgb(252, 233, 164)
    );
    z-index: 0;
    border-radius: 0 0 10rpx 10rpx;
    box-shadow:
      0px 0px 2.2px rgba(0, 0, 0, 0.02),
      0px 0px 5.3px rgba(0, 0, 0, 0.028),
      0px 0px 10px rgba(0, 0, 0, 0.035),
      0px 0px 17.9px rgba(0, 0, 0, 0.042),
      0px 0px 33.4px rgba(0, 0, 0, 0.05),
      0px 0px 80px rgba(0, 0, 0, 0.07);
    display: flex;
    align-items: center;
    justify-content: space-around;
    
    &.dark-mode {
      background: linear-gradient(
        180deg,
        var(--card-background),
        rgb(80, 70, 40)
      );
      box-shadow:
        0px 0px 2.2px rgba(0, 0, 0, 0.1),
        0px 0px 5.3px rgba(0, 0, 0, 0.13),
        0px 0px 10px rgba(0, 0, 0, 0.15),
        0px 0px 17.9px rgba(0, 0, 0, 0.17),
        0px 0px 33.4px rgba(0, 0, 0, 0.2),
        0px 0px 80px rgba(0, 0, 0, 0.3);
    }
    
    .navBtn {
      transform: translate(0, 10rpx);
      
      img {
        height: 100rpx;
        filter: drop-shadow(0px 2px 10rpx #17181944);
      }
      
      div.name {
        text-align: center;
        color: rgb(45, 45, 45);
        font-size: 25rpx;
        margin-top: 5rpx;
        
        .dark-mode & {
          color: var(--text-color-primary);
        }
      }
      
      transition: all .3s;
    }
    
    .navBtn:active {
      transform: translate(0, 10rpx) scale(.95);
    }
  }
}

.section {
  padding: 20rpx 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  
  .dark-mode & {
    background-color: var(--card-background);
  }
}

.recommend-circles-section {
  .square-grid-main,
  .side-item,
  .bottom-item {
    will-change: transform, opacity;
  }

  &.is-refreshing {
    .square-grid-main,
    .side-item,
    .bottom-item {
      animation: recommend-circle-refresh 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .square-grid-main {
      animation-delay: 0s;
    }

    .side-item:nth-child(1) {
      animation-delay: 0.08s;
    }

    .side-item:nth-child(2) {
      animation-delay: 0.14s;
    }

    .bottom-item {
      animation-delay: 0.2s;
    }
  }

  .square-grid-skeleton {
    .square-grid-row {
      display: flex;
      margin-bottom: 20rpx;
    }

    .skeleton-side {
      width: 48%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .skeleton-block {
      position: relative;
      overflow: hidden;
      border-radius: 12rpx;
      background: #f1f2f4;

      .dark-mode & {
        background: rgba(255, 255, 255, 0.08);
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
        animation: recommend-circle-skeleton 1.1s ease-in-out infinite;
      }
    }

    .skeleton-main {
      width: 48%;
      height: 300rpx;
      margin-right: 20rpx;
    }

    .skeleton-side-item {
      height: 140rpx;
    }

    .skeleton-bottom-item {
      width: calc(100% - 50rpx);
      height: 80rpx;
    }
  }
}

@keyframes recommend-circle-refresh {
  from {
    opacity: 0.55;
    transform: translateY(18rpx) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes recommend-circle-skeleton {
  to {
    transform: translateX(100%);
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  position: relative;
  padding-left: 20rpx;
  
  .dark-mode & {
    color: var(--text-color-primary);
  }
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 30rpx;
  background-color: #EA7034;
  border-radius: 3rpx;
}

.section-more {
  font-size: 24rpx;
  color: #999;
  
  .dark-mode & {
    color: var(--text-color-regular);
  }
}

.section-actions {
  display: flex;
  align-items: center;
}

.sort-btn {
  font-size: 26rpx;
  color: #999;
  margin-left: 20rpx;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
  
  .dark-mode & {
    color: var(--text-color-regular);
  }
}

.sort-btn.active {
  color: #EA7034;
  background-color: rgba(234, 112, 52, 0.1);
}

.square-grid {
  .square-grid-content {
    .square-grid-row {
      display: flex;
      margin-bottom: 20rpx;

      .square-grid-main {
        width: 48%;
        height: 300rpx;
        position: relative;
        margin-right: 20rpx;
        border-radius: 12rpx;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }

        .circle-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80rpx;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          padding: 0 20rpx;

          image {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
          }

          view {
            color: #fff;
            font-size: 26rpx;
            margin: 0 20rpx;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          text {
            color: #fff;
            font-size: 24rpx;
          }
        }
      }

      .square-grid-side {
        width: 48%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .side-item {
          height: 140rpx;
          background: #333;
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          padding: 0 20rpx;
          color: #fff;
          
          .dark-mode & {
            background: #444;
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
          }

          image {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
          }

          view {
            font-size: 26rpx;
            margin: 0 20rpx;
            flex: 1;
          }

          text {
            font-size: 24rpx;
          }
        }
      }
    }

    .square-grid-bottom {
      display: flex;

      .bottom-item {
        width: calc(100% - 50rpx);
        height: 80rpx;
        background: #333;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        color: #fff;

        image {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
        }

        view {
          font-size: 26rpx;
          margin: 0 20rpx;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        text {
          font-size: 24rpx;
        }

        &.all-circles {
            background: #fff;
            border: 2rpx solid #333;
            color: #333;
            justify-content: space-between;
            
            .dark-mode & {
              background: var(--card-background);
              border: 2rpx solid #666;
              color: var(--text-color-primary);
            }
          }
      }
    }
  }
}

.post-list {
  margin: 0 -30rpx;
  
  .post-waterfall {
    display: flex;
    padding: 0 16rpx;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .waterfall-column {
    width: 343rpx;
  }

  .post-card {
    width: 100%;
    margin-bottom: 16rpx;
    background: #fff;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    
    .dark-mode & {
      background: var(--card-background);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    }

    .post-card-image {
      width: 100%;
      min-height: 220rpx;
      position: relative;
      overflow: hidden;

      &.is-tall {
        height: 420rpx;
      }

      &.is-medium {
        height: 340rpx;
      }

      &.is-short {
        height: 280rpx;
      }

      &.is-text-only {
        height: 240rpx;
      }

      .card-image {
        width: 100%;
        height: 100%;
      }

      .card-color-bg {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20rpx;
        box-sizing: border-box;

        .card-text-preview {
          font-size: 24rpx;
          color: #fff;
          text-align: center;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          word-break: break-all;
          width: 100%;
        }
      }
    }

    .post-card-content {
      padding: 16rpx;

      .card-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: 16rpx;
        line-height: 1.4;
        
        .dark-mode & {
          color: var(--text-color-primary);
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-user {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;
          min-width: 0;

          .card-avatar {
            width: 36rpx;
            height: 36rpx;
            border-radius: 50%;
            margin-right: 10rpx;
            flex-shrink: 0;
          }

		  .card-username {
            font-size: 22rpx;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            
            .dark-mode & {
              color: var(--text-color-regular);
		  }

		  .card-membership-badge {
			margin-left: 6rpx;
		  }
		}
        }

        .card-likes {
          display: flex;
          align-items: center;
          font-size: 22rpx;
          color: #999;
          flex-shrink: 0;
          margin-left: 10rpx;

          text {
            margin-left: 4rpx;
          }
        }
      }
    }
  }

  .post-item {
      background: #fff;
      border-radius: 12rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      
      .dark-mode & {
        background: var(--card-background);
      }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .user-info {
        display: flex;
        align-items: center;

        .user-avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .user-meta {
          .user-name {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            
            .dark-mode & {
              color: var(--text-color-primary);
            }
          }

          .post-time {
            font-size: 24rpx;
            color: #999;
            margin-top: 4rpx;
            
            .dark-mode & {
              color: var(--text-color-regular);
            }
          }
        }
      }

      .post-circle {
        font-size: 24rpx;
        color: #EA7034;
        background: rgba(234, 112, 52, 0.1);
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        
        .dark-mode & {
          background: rgba(234, 112, 52, 0.2);
        }
      }
    }

    .post-content {
      .post-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
          
          .dark-mode & {
            color: var(--text-color-primary);
          }
        }

      .post-text {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          
          .dark-mode & {
            color: var(--text-color-regular);
          }
        }
    }

    .post-images {
      margin: 20rpx 0;

      .image-grid {
        display: flex;
        flex-wrap: wrap;

        &.grid-1 .post-image {
          width: 400rpx;
          height: 300rpx;
        }

        &.grid-2 .post-image,
        &.grid-3 .post-image,
        &.grid-multi .post-image {
          width: calc(33.33% - 10rpx);
          height: 200rpx;
          margin: 5rpx;
        }

        .post-image {
          border-radius: 8rpx;
        }
      }
    }

    .post-footer {
        display: flex;
        justify-content: space-around;
        padding-top: 20rpx;
        border-top: 1rpx solid #f0f0f0;
        
        .dark-mode & {
          border-top: 1rpx solid #333;
        }

      .post-action {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #666;
          
          .dark-mode & {
            color: var(--text-color-regular);
          }

        text {
          margin-left: 8rpx;

          &.liked {
            color: #EA7034;
          }
        }
      }
    }
  }
}

.post-list {
  margin-top: 20rpx;
  
  .post-waterfall {
    display: flex;
    justify-content: space-between;
    padding: 0 16rpx;
  }
  
  .waterfall-column {
    width: 343rpx;
  }

  .skeleton-post {
    overflow: hidden;
    margin-bottom: 16rpx;
    background: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    
    .dark-mode & {
      background: var(--card-background);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    }

    .skeleton-image {
      width: 100%;
      height: 220rpx;
      background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 37%, #f0f0f0 63%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease-in-out infinite;
      
      .dark-mode & {
        background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
        background-size: 400% 100%;
      }
    }

    .post-card-content {
      padding: 16rpx;
    }

    .skeleton-avatar {
      width: 36rpx;
      height: 36rpx;
      flex: 0 0 36rpx;
      margin-right: 10rpx;
    }

    .skeleton-line {
      display: block;
      border-radius: 8rpx;

      &.skeleton-name {
        width: 100rpx;
        height: 24rpx;
        flex: 1;
      }

      &.skeleton-title {
        width: 100%;
        height: 32rpx;
        margin-bottom: 16rpx;
      }
    }

    .skeleton-icon {
      width: 28rpx;
      height: 28rpx;
      flex: 0 0 28rpx;
    }

    .skeleton-count {
      width: 40rpx;
      height: 22rpx;
      margin-left: 8rpx;
      border-radius: 6rpx;
    }
  }
}

.float-btn {
  position: fixed;
  right: 40rpx;
  bottom: 180rpx;
  width: 100rpx;
  height: 100rpx;
  background: #EA7034;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(234, 112, 52, 0.3);
  z-index: 99;
  
  .dark-mode & {
    background: #EA7034;
    box-shadow: 0 4rpx 12rpx rgba(234, 112, 52, 0.5);
  }
}

.clickable {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    border-radius: inherit;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  &:active::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.float-btn.clickable {
  position: fixed;
}

.search-input-wrapper {
  &.clickable:active {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .dark-mode &.clickable:active {
    background: rgba(255, 255, 255, 0.05);
  }
}

.messageIcon {
  &.clickable:active {
    opacity: 0.6;
  }
}

.section-more,
.sort-btn {
  &.clickable:active {
    opacity: 0.6;
  }
}

.square-grid-main,
.side-item,
.bottom-item {
  &.clickable:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.post-card {
  &.clickable:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.12);
    
    .dark-mode & {
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.4);
    }
  }
}

.card-user,
.card-likes {
  &.clickable:active {
    opacity: 0.6;
  }
}

.float-btn {
  &.clickable:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(234, 112, 52, 0.4);
    
    .dark-mode & {
      box-shadow: 0 2rpx 8rpx rgba(234, 112, 52, 0.6);
    }
  }
}
</style>
