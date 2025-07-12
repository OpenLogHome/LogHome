<template>
  <view class="circle-container" :style="{'--statusBarHeight': 0 + 'px'}">
    <!-- 添加后退导航栏 -->
    <zetank-backBar textcolor="#fff" :showLeft="true" :showHome="true" :showTitle="false" navTitle="圈子详情"></zetank-backBar>
    
    <!-- 圈子头部信息 -->
    <view class="circle-header">
      <!-- 圈子背景图 -->
      <view class="circle-bg" :style="{ backgroundImage: `url(${circle.bg_url || circle.icon || '../../static/default-circle.png'})` }"></view>
      <view class="header-overlay"></view>
      <view class="circle-info">
        <log-image class="circle-avatar" :src="circle.icon" mode="aspectFill" onerror="onerror=null;src='../../static/default-circle.png'"></log-image>
        <view class="circle-meta">
          <view class="circle-name">
            {{circle.name}}
            <view class="official-tag" v-if="circle.is_official">官方</view>
          </view>
          <view class="circle-stats">
            <text>{{circle.member_count}}成员</text>
            <text>{{circle.post_count}}帖子</text>
          </view>
          <view class="circle-description" @click="showCircleInfo">{{circle.description}}</view>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-bar">
        <view class="action-btn" :class="{ 'active': isJoined }" @tap="toggleJoin">
          {{ isJoined ? '已加入' : '加入圈子' }}
        </view>
        <view class="action-btn" @tap="showCircleInfo">
          圈子公告
        </view>
        <!-- 添加编辑按钮，仅圈主和管理员可见 -->
        <view class="action-btn" v-if="isJoined && (userRole === 1 || userRole === 2)" @tap="editCircle">
          圈子设置
        </view>
      </view>
    </view>
    
    <!-- 圈子成员模块 -->
    <view class="circle-members">
      <view class="section-header">
        <text class="section-title">成员 ({{circle.member_count || 0}})</text>
        <view class="more-btn" @tap="navigateToMembers">
          <text>更多</text>
          <uni-icons type="right" size="14" color="#999"></uni-icons>
        </view>
      </view>
      <scroll-view scroll-x class="members-scroll" show-scrollbar="false">
        <view class="members-list">
          <view class="member-item" v-for="(member, index) in members" :key="index" @tap="navigateToUser(member.user_id)">
            <view class="member-avatar-wrapper">
              <log-image class="member-avatar" :src="member.avatar_url" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="member-role" v-if="member.role === 2">圈主</view>
              <view class="member-role admin" v-else-if="member.role === 1">管理员</view>
            </view>
            <text class="member-name">{{member.name}}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 帖子筛选 -->
    <view class="filter-bar">
      <view 
        class="filter-item" 
        v-for="(item, index) in filters" 
        :key="index"
        :class="{ active: currentFilter === item.value }"
        @tap="switchFilter(item.value)"
      >
        {{item.name}}
      </view>
    </view>
    
    <!-- 帖子列表 -->
    <scroll-view 
      scroll-y 
      class="posts-scroll" 
      @scrolltolower="loadMore"
    >
      <view class="posts-list">
        <view class="post-item" v-for="(post, index) in posts" :key="index" @tap="navigateToPost(post.post_id)">
          <view class="post-header">
            <view class="user-info" @tap.stop="navigateToUser(post.user_id)">
              <log-image class="user-avatar" :src="post.author_avatar" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="user-meta">
                <text class="user-name">{{post.author_name}}</text>
                <text class="post-time">{{formatTime(post.create_time)}}</text>
              </view>
            </view>
            <view class="post-tag" v-if="post.is_top">置顶</view>
          </view>
          <view class="post-content">
            <text class="post-title">{{post.title}}</text>
            <text class="post-text">{{post.content}}</text>
          </view>
          <!-- 图片展示 -->
          <view class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
            <view class="image-grid" :class="'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)">
              <log-image 
                v-for="(img, imgIndex) in post.media_urls.slice(0, 9)" 
                :key="imgIndex" 
                :src="img" 
                mode="aspectFill" 
                class="post-image"
                @tap.stop="previewImage(post.media_urls, imgIndex)"
              ></log-image>
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
        
        <!-- 加载更多 -->
        <uni-load-more :status="loadingStatus"></uni-load-more>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="posts.length === 0 && loadingStatus !== 'loading'">
        <image src="../../static/nothing.png" mode="aspectFit" class="empty-image"></image>
        <text class="empty-text">暂无帖子</text>
      </view>
    </scroll-view>
    
    <!-- 悬浮按钮 -->
    <view class="float-btn" @tap="createPost">
      <uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
    </view>
    
    <!-- 圈子公告弹窗 -->
    <uni-popup ref="infoPopup" type="center">
      <view class="info-popup">
        <view class="popup-header">
          <text class="popup-title">圈子信息</text>
          <uni-icons type="closeempty" size="24" color="#999" @click="closeInfoPopup"></uni-icons>
        </view>
        <view class="popup-content">
          <view class="info-section">
            <text class="info-title">圈子简介</text>
            <text class="info-text">{{circle.description || '暂无圈子简介'}}</text>
          </view>
          <view class="info-section">
            <text class="info-title">圈子规则</text>
            <text class="info-text">{{circle.rules || '暂无圈子规则'}}</text>
          </view>
          <view class="info-section">
            <text class="info-title">圈子公告</text>
            <text class="info-text">{{circle.announcement || '暂无圈子公告'}}</text>
          </view>
          <view class="info-section">
            <text class="info-title">圈主</text>
            <view class="member-item" @tap="navigateToUser(circle.creator_id)">
              <log-image class="member-avatar" :src="circle.creator_avatar" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <text class="member-name">{{circle.creator_name}}</text>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  components: {
  },
  data() {
    return {
      circleId: null,
      circle: {},
      isJoined: false,
      userRole: 0, // 0-普通成员 1-管理员 2-圈主
      filters: [
        { name: '全部', value: 'all' },
        { name: '最新', value: 'new' },
        { name: '热门', value: 'hot' }
      ],
      currentFilter: 'all',
      posts: [],
      members: [], // 圈子成员列表
      page: 1,
      pageSize: 10,
      isRefreshing: false,
      loadingStatus: 'more',
      hasMore: true,
      isLoggedIn: false,
      jsBridge: {
        inApp: true,
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.circleId = options.id;
      this.checkLoginStatus();
      this.loadCircleInfo();
      this.loadMembers(); // 加载圈子成员
      this.loadPosts();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  onShow() {
    // 如果已经加载过圈子ID，在每次显示页面时刷新数据
    if (this.circleId) {
      this.checkLoginStatus();
      this.checkMemberStatus(); // 刷新成员状态
      this.loadMembers(); // 刷新成员列表
      
      // 刷新帖子列表
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts().then(() => {
        // 获取帖子点赞状态
        setTimeout(() => {
          this.getPostsLikeStatus();
        }, 100);
      });
    }
  },
  onPullDownRefresh() {
    this.page = 1;
    this.posts = [];
    this.hasMore = true;
    
    Promise.all([
      this.loadCircleInfo(),
      this.loadMembers(),
      this.loadPosts()
    ]).finally(() => {
      uni.stopPullDownRefresh();
    });
  },
  methods: {
    checkLoginStatus() {
      const token = JSON.parse(window.localStorage.getItem('token'));
      this.isLoggedIn = token && token.tk;
    },
    goBack() {
      uni.navigateBack();
    },
    async loadCircleInfo() {
      try {
        const res = await axios.get(this.$baseUrl + `/community/circles/detail/${this.circleId}`);
        
        if (res.data) {
          this.circle = res.data;
          
          // 如果已登录，检查是否已加入圈子
          if (this.isLoggedIn) {
            await this.checkMemberStatus();
          }
        }
      } catch (error) {
        console.error('加载圈子信息失败', error);
        uni.showToast({
          title: '加载圈子信息失败',
          icon: 'none'
        });
      }
    },
    async checkMemberStatus() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + '/community/circles/my-circles', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (res.data) {
          const myCircle = res.data.find(c => c.circle_id === parseInt(this.circleId));
          this.isJoined = !!myCircle;
          if (myCircle) {
            this.userRole = myCircle.role;
          }
        }
      } catch (error) {
        console.error('检查成员状态失败', error);
      }
    },
    async loadMembers() {
      try {
        // 获取圈子成员，按照角色排序，最多获取10个
        const params = {
          pageSize: 10,
          page: 1
        };
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/members`, { params });
        
        if (res.data && res.data.list) {
          this.members = res.data.list;
        }
      } catch (error) {
        console.error('加载圈子成员失败', error);
      }
    },
    async loadPosts() {
      if (!this.hasMore || this.loadingStatus === 'loading') return;
      
      this.loadingStatus = 'loading';
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          circle_id: this.circleId
        };
        
        // 根据筛选条件设置参数
        if (this.currentFilter === 'new') {
          params.sort = 'new';
        } else if (this.currentFilter === 'hot') {
          params.sort = 'hot';
        } else if (this.currentFilter === 'essence') {
          params.is_essence = 1;
        }
        
        const res = await axios.get(this.$baseUrl + '/community/posts/list', { params });
        
        if (res.data && res.data.list) {
          // 处理帖子数据
          const newPosts = res.data.list.map(post => {
            // 处理媒体URL
            if (post.media_urls && typeof post.media_urls === 'string') {
              try {
                post.media_urls = JSON.parse(post.media_urls);
              } catch (e) {
                post.media_urls = [];
              }
            } else {
              post.media_urls = [];
            }
            
            // 初始化点赞状态
            post.is_liked = false;
            post.is_liked_checked = false;
            
            return post;
          });
          
          this.posts = this.page === 1 ? newPosts : [...this.posts, ...newPosts];
          this.page++;
          this.hasMore = this.posts.length < res.data.total;
          this.loadingStatus = this.hasMore ? 'more' : 'noMore';
          
          // 获取点赞状态
          if (this.isLoggedIn) {
            setTimeout(() => {
              this.getPostsLikeStatus();
            }, 100);
          }
        } else {
          this.loadingStatus = 'noMore';
        }
      } catch (error) {
        console.error('加载帖子失败', error);
        this.loadingStatus = 'more';
      }
    },
    switchFilter(filter) {
      if (this.currentFilter === filter) return;
      this.currentFilter = filter;
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts();
    },
    loadMore() {
      if (this.hasMore) {
        this.loadPosts();
      }
    },
    async toggleJoin() {
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: '/pages/users/login'
        });
        return;
      }
      
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        
        if (this.isJoined) {
          // 退出圈子
          await axios.post(this.$baseUrl + '/community/circles/quit', {
            circle_id: this.circleId
          }, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          
          this.isJoined = false;
          this.circle.member_count--;
          
          uni.showToast({
            title: '已退出圈子',
            icon: 'success'
          });
        } else {
          // 检查圈子是否需要验证
          if (this.circle.need_verification) {
            this.showJoinVerificationPopup();
          } else {
            // 直接加入圈子
            await this.joinCircle();
          }
        }
      } catch (error) {
        console.error('操作失败', error);
        uni.showToast({
          title: error.response?.data?.msg || '操作失败，请重试',
          icon: 'none'
        });
      }
    },
    // 显示加入验证弹窗
    showJoinVerificationPopup() {
      uni.showModal({
        title: '加入圈子',
        content: '该圈子需要验证才能加入，是否继续？',
        confirmText: '继续',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 获取验证问题
            this.getVerificationQuestions();
          }
        }
      });
    },
    // 获取验证问题
    async getVerificationQuestions() {
      try {
        // 使用公开接口获取验证问题
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/verification-questions`);
        
        let verificationPrompt = '请输入验证信息';
        if (res.data && res.data.verification_questions) {
          verificationPrompt = res.data.verification_questions;
        }
        
        // 显示输入框
        uni.showModal({
          title: verificationPrompt,
          content: '',
          editable: true,
          placeholderText: '请输入...',
          confirmText: '提交',
          cancelText: '取消',
          success: async (res) => {
            if (res.confirm) {
              // 提交验证信息
              await this.joinCircle(res.content);
            }
          }
        });
      } catch (error) {
        console.error('获取验证问题失败', error);
        // 如果获取失败，使用默认提示
        uni.showModal({
          title: '入圈验证',
          content: '',
          editable: true,
          placeholderText: '请输入...',
          confirmText: '提交',
          cancelText: '取消',
          success: async (res) => {
            if (res.confirm) {
              // 提交验证信息
              await this.joinCircle(res.content);
            }
          }
        });
      }
    },
    // 加入圈子
    async joinCircle(verification_info = null) {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const data = {
          circle_id: this.circleId
        };
        
        // 如果有验证信息，添加到请求中
        if (verification_info) {
          data.verification_info = verification_info;
        }
        
        const res = await axios.post(this.$baseUrl + '/community/circles/join', data, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        // 如果需要验证，提示用户等待审核
        if (this.circle.need_verification) {
          uni.showToast({
            title: '申请已提交，等待审核',
            icon: 'none',
            duration: 2000
          });
        } else {
          // 直接加入成功
          this.isJoined = true;
          this.circle.member_count++;
          
          uni.showToast({
            title: '已加入圈子',
            icon: 'success'
          });
        }
      } catch (error) {
        console.error('加入圈子失败', error);
        uni.showToast({
          title: error.response?.data?.msg || '操作失败，请重试',
          icon: 'none'
        });
      }
    },
    showCircleInfo() {
      this.$refs.infoPopup.open();
    },
    closeInfoPopup() {
      this.$refs.infoPopup.close();
    },
    async likePost(post) {
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: '/pages/users/login'
        });
        return;
      }
      
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
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
      let content = `来自原木社区「${this.circle.name}」圈子的分享：${post.title}\n${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}\n点击链接查看详情：https://loghome.codesocean.top/#/pages/community/postView?id=${post.post_id}`;
      
      uni.setClipboardData({
        data: content,
        success: function() {
          uni.showToast({
            title: '分享链接已复制',
            icon: 'none'
          });
        }
      });
    },
    previewImage(images, index) {
      uni.previewImage({
        urls: images,
        current: images[index]
      });
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
    navigateToPost(postId) {
      uni.navigateTo({
        url: `/pages/community/postDetail?id=${postId}`
      });
    },
    navigateToUser(userId) {
      uni.navigateTo({
        url: `/pages/users/personalPage?id=${userId}`
      });
    },
    navigateToMembers() {
      uni.navigateTo({
        url: `/pages/community/circleMembers?id=${this.circleId}&name=${encodeURIComponent(this.circle.name)}`
      });
    },
    createPost() {
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: '/pages/users/login'
        });
        return;
      }
      
      if (!this.isJoined) {
        uni.showToast({
          title: '请先加入圈子',
          icon: 'none'
        });
        return;
      }
      
      // 检查是否被禁言
      this.checkBanStatus().then(isBanned => {
        if (isBanned) {
          // 禁言状态在 checkBanStatus 中已经显示提示，这里不需要额外操作
          return;
        }
        
        // 未被禁言，跳转到发帖页面
        uni.navigateTo({
          url: `/pages/community/postEdit?circle_id=${this.circleId}`
        });
      }).catch(error => {
        console.error('检查禁言状态失败', error);
        // 出错时，为了用户体验，仍然允许跳转
        uni.navigateTo({
          url: `/pages/community/postEdit?circle_id=${this.circleId}`
        });
      });
    },
    // 检查用户在圈子中的禁言状态
    async checkBanStatus() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/my-status`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (res.data && res.data.is_banned) {
          const banInfo = res.data.ban_info;
          const endTimeText = banInfo.end_time ? 
            `，将于 ${new Date(banInfo.end_time).toLocaleString()} 解除` : 
            '，永久禁言';
            
          uni.showModal({
            title: '禁言提示',
            content: `您在该圈子中已被禁言${endTimeText}，无法发布帖子`,
            showCancel: false
          });
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('获取禁言状态失败', error);
        return false;
      }
    },
    editCircle() {
      // 跳转到圈子设置页面
      uni.navigateTo({
        url: `/pages/community/editCircle?id=${this.circleId}&role=${this.userRole}`
      });
    },
    // 添加获取帖子点赞状态的方法
    async getPostsLikeStatus() {
      try {
        // 检查是否已登录
        if (!this.isLoggedIn || !window.localStorage.getItem('token')) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F8F8F8;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}



.circle-header {
  position: relative;
  padding: 30rpx;
  padding-top: calc(var(--statusBarHeight) + 120rpx);
  margin-bottom: 20rpx;
  height: calc(450rpx - 150rpx);
  z-index: 1;

  .circle-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 450rpx;
    background-size: cover;
    background-position: center;
    z-index: 0;
    margin: 0;
  }
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 450rpx;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
  z-index: 2;
}

.circle-info {
  display: flex;
  margin-top: 30rpx;
  position: relative;
  z-index: 3;
}

.circle-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 20rpx;
  margin-right: 30rpx;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
}

.circle-meta {
  flex: 1;
}

.circle-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.official-tag {
  font-size: 20rpx;
  color: #fff;
  background-color: #EA7034;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
  margin-left: 10rpx;
}

.circle-stats {
  display: flex;
  margin-bottom: 20rpx;
}

.circle-stats text {
  font-size: 24rpx;
  color: #fff;
  margin-right: 20rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.circle-description {
  font-size: 26rpx;
  color: #fff;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
  position: relative;
  z-index: 3;
}

.action-btn {
  flex: 1;
  height: 70rpx;
  background-color: rgba(255, 255, 255, 0.8);
  color: #666;
  font-size: 28rpx;
  border-radius: 35rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10rpx;
}

.action-btn.active {
  background-color: #EA7034;
  color: #fff;
}

.filter-bar {
  display: flex;
  background-color: #fff;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
  z-index: 2;
}

.filter-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.filter-item.active {
  color: #EA7034;
  font-weight: bold;
}

.filter-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #EA7034;
  border-radius: 2rpx;
}

.posts-scroll {
  flex: 1;
}

.posts-list {
  padding: 20rpx;
}

.post-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.post-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}

.post-tag {
  font-size: 22rpx;
  color: #EA7034;
  background-color: rgba(234, 112, 52, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.post-tag.essence {
  color: #f59037;
  background-color: rgba(245, 144, 55, 0.1);
  margin-left: 10rpx;
}

.post-content {
  margin-bottom: 20rpx;
}

.post-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.post-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.post-images {
  margin-bottom: 20rpx;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
}

.grid-1 .post-image {
  width: 400rpx;
  height: 300rpx;
  border-radius: 8rpx;
}

.grid-2 .post-image, .grid-3 .post-image {
  width: calc(33.33% - 10rpx);
  height: 200rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  border-radius: 8rpx;
}

.grid-multi .post-image {
  width: calc(33.33% - 10rpx);
  height: 200rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  border-radius: 8rpx;
}

.image-count {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.post-footer {
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.post-action {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.post-action text {
  margin-left: 8rpx;
}

.post-action .liked {
  color: #EA7034;
}

.float-btn {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #EA7034;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(234, 112, 52, 0.3);
  z-index: 99;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.info-popup {
  width: 600rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.popup-content {
  padding: 30rpx;
  max-height: 700rpx;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 30rpx;
}

.info-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.info-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.member-item {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.member-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.member-name {
  font-size: 26rpx;
  color: #333;
}

.circle-members {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin: 0 20rpx 20rpx 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-btn {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #999;
}

.members-scroll {
  width: 100%;
  white-space: nowrap;
}

.members-list {
  display: inline-flex;
  padding: 10rpx 0;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
  width: 100rpx;
}

.member-avatar-wrapper {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.member-role {
  position: absolute;
  bottom: -6rpx;
  right: -10rpx;
  background-color: #FFD700;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
  font-size: 18rpx;
  color: #fff;
  transform: scale(0.8);
}

.member-role.admin {
  background-color: #EA7034;
}

.member-name {
  font-size: 22rpx;
  color: #666;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 