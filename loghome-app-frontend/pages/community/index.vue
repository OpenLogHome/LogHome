<template>
  <view class="community-container" v-dark>
    <!-- 顶部搜索栏 -->
    <div class="searchBar" v-dark>
      <div class="search-input-wrapper" @tap="navigateToSearch">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <view class="search-input-placeholder">搜索书籍、圈子、帖子、用户</view>
      </div>
      <uni-icons type="chat" size="26" :color="$store.state.isDarkMode ? '#e5e5e5' : '#2d2d2d'" class="messageIcon" @click="gotoMessage"></uni-icons>
    </div>

    <!-- 内容区域 -->
    <view 
      class="content-scroll" 
      style="margin-top: 105rpx;"
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
      <view class="section" v-if="recommendCircles && recommendCircles.length > 0">
        <view class="section-header">
          <text class="section-title">推圈</text>
          <text class="section-more" @tap="navigateToCircles">更多</text>
        </view>
        <view class="square-grid">
          <view class="square-grid-content">
            <!-- 第一行：大图 + 两个小图 -->
            <view class="square-grid-row">
              <!-- 左侧大图 -->
              <view class="square-grid-main" @tap="navigateToCircle(getCircleId(0))" v-if="hasCircle(0)">
                <image mode="aspectFill" :src="getCircleImage(0)"></image>
                <view class="circle-info">
                  <image :src="getCircleIcon(0)" mode="aspectFill"></image>
                  <view>{{ getCircleName(0) }}</view>
                  <text>{{ getCircleMemberCount(0) }}人</text>
                </view>
              </view>
              <!-- 右侧两个小图 -->
              <view class="square-grid-side">
                <view class="side-item" @tap="navigateToCircle(getCircleId(1))" v-if="hasCircle(1)">
                  <image mode="aspectFill" :src="getCircleIcon(1)"></image>
                  <view>{{ getCircleName(1) }}</view>
                  <text>{{ getCircleMemberCount(1) }}人</text>
                </view>
                <view class="side-item" @tap="navigateToCircle(getCircleId(2))" v-if="hasCircle(2)">
                  <image mode="aspectFill" :src="getCircleIcon(2)"></image>
                  <view>{{ getCircleName(2) }}</view>
                  <text>{{ getCircleMemberCount(2) }}人</text>
                </view>
              </view>
            </view>
            <!-- 第二行：一个小图 + 全部圈子按钮 -->
            <view class="square-grid-bottom">
              <view class="bottom-item all-circles" @tap="navigateToCircles">
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
            <text class="sort-btn" :class="{active: sortType === 'hot'}" @tap="changeSort('hot')">热门</text>
            <text class="sort-btn" :class="{active: sortType === 'new'}" @tap="changeSort('new')">最新</text>
          </view>
        </view>

        <view class="post-list">
          <view class="post-item" v-for="(post, index) in posts" :key="index" @tap="navigateToPost(post.post_id)">
            <view class="post-header">
              <view class="user-info" @tap.stop="navigateToUser(post.user_id)">
                <image class="user-avatar" :src="post.author_avatar" mode="aspectFill"></image>
                <view class="user-meta">
                  <text class="user-name">{{post.author_name}}</text>
                  <view class="post-time">{{formatTime(post.create_time)}}</view>
                </view>
              </view>
              <view class="post-circle" @tap.stop="navigateToCircle(post.circle_id)">
                {{post.circle_name}}
              </view>
            </view>
            <view class="post-content">
              <text class="post-title">{{post.title}}</text>
              <text class="post-text">{{post.content}}</text>
            </view>
            <!-- 图片展示 -->
            <view class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
              <view class="image-grid" :class="'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)">
                <image 
                  v-for="(img, imgIndex) in post.media_urls.slice(0, 9)" 
                  :key="imgIndex" 
                  :src="img" 
                  mode="aspectFill" 
                  class="post-image"
                  @tap.stop="previewImage(post.media_urls, imgIndex)"
                ></image>
                <view class="image-count" v-if="post.media_urls.length > 9">+{{post.media_urls.length - 9}}</view>
              </view>
            </view>
            <view class="post-footer">
              <view class="post-action">
                <uni-icons type="chat" size="18" color="#666"></uni-icons>
                <text>{{post.comment_count}}</text>
              </view>
              <view class="post-action" @tap.stop="likePost(post)">
                <uni-icons :type="post.is_liked ? 'heart-filled' : 'heart'" size="18" :color="post.is_liked ? '#EA7034' : '#666'"></uni-icons>
                <text :class="{'liked': post.is_liked}">{{post.like_count}}</text>
              </view>
              <view class="post-action" @tap.stop="sharePost(post)">
                <uni-icons type="redo" size="18" color="#666"></uni-icons>
                <text>分享</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <uni-load-more :status="loadingStatus"></uni-load-more>
      </view>
    </view>

    <!-- 悬浮按钮 -->
    <view class="float-btn" @tap="navigateToCreatePost">
      <uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import moment from 'moment';
import banner from '@/components/banner.vue'
import XsuuSwiper from "@/components/Xss-swiper/Xsuu-swiper.vue"
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
  components: {
    banner,
    XsuuSwiper
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
    setTimeout(() => {
      this.getPostsLikeStatus();
    }, 500);
  },

  onPullDownRefresh() {
    this.page = 1;
    this.posts = [];
    this.hasMore = true;
    Promise.all([
      this.loadRecommendCircles(),
      this.loadPosts(),
      this.refreshSwiperData()
    ]).then(() => {
      // 刷新后重新获取点赞状态
      this.getPostsLikeStatus();
    }).finally(() => {
      uni.stopPullDownRefresh();
    });
  },

  onPageScroll(e) {
    if (this.scrollThrottle) return;
    
    this.scrollThrottle = true;
    setTimeout(() => {
      this.scrollThrottle = false;
      // 获取页面信息
      uni.createSelectorQuery().selectViewport().scrollOffset((res) => {
        const { scrollTop, scrollHeight } = res;
        // 获取窗口高度
        const windowHeight = uni.getSystemInfoSync().windowHeight;

        console.log(scrollTop, scrollHeight, windowHeight);
        
        // 当滚动到距离底部100px时开始加载更多
        if (scrollTop + windowHeight >= scrollHeight - 500) {
          this.loadMore();
          console.log("loadmore");
        }
      }).exec();
    }, 100);
  },

  methods: {
    async loadRecommendCircles() {
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
          this.recommendCircles = res.data.list;
        } else {
          // 如果没有数据，设置为空数组
          this.recommendCircles = [];
        }
      } catch (error) {
        console.error('加载推荐圈子失败', error);
        // 出错时设置为空数组
        this.recommendCircles = [];
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
          setTimeout(() => {
            this.getPostsLikeStatus();
          }, 100);
        }
      } catch (error) {
        console.error('加载帖子失败', error);
        this.loadingStatus = 'more';
      }
    },

    async getPostsLikeStatus() {
      try {
        // 检查是否已登录
        if (!window.localStorage.getItem('token')) {
          console.log('用户未登录，跳过获取点赞状态');
          return;
        }
        
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        
        // 获取所有未检查点赞状态的帖子
        const uncheckedPosts = this.posts.filter(post => !post.is_liked_checked);
        
        // 如果没有未检查的帖子，直接返回
        if (uncheckedPosts.length === 0) {
          return;
        }
        
        console.log(`开始获取${uncheckedPosts.length}个帖子的点赞状态`);
        
        // 为每个帖子获取点赞状态
        for (const post of uncheckedPosts) {
          try {
            const res = await axios.get(this.$baseUrl + '/community/interactions/like/status', {
              params: {
                target_id: post.post_id,
                target_type: 1
              },
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });
            
            // 更新帖子的点赞状态
            post.is_liked = res.data.liked;
            post.is_liked_checked = true; // 标记已检查
            
            console.log(`帖子 ${post.post_id} 点赞状态: ${post.is_liked}`);
          } catch (err) {
            console.error(`获取帖子 ${post.post_id} 点赞状态失败:`, err);
          }
        }
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
      uni.setClipboardData({
        data: `来自原木社区的分享：${post.title}\n${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}\n点击链接查看详情：${window.location.origin}/#/pages/community/postView?id=${post.post_id}`,
        success: () => {
          uni.showToast({
            title: '分享链接已复制',
            icon: 'none'
          });
        }
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
  padding-top: calc(5rpx + var(--statusBarHeight));
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
</style>