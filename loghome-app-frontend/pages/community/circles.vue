<template>
  <view class="circles-container">
    
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar
        placeholder="搜索圈子"
        @confirm="searchCircles"
        @input="searchInput"
        :radius="100"
        cancelButton="none"
      ></uni-search-bar>
    </view>
    
    <!-- 分类列表 -->
    <scroll-view 
      scroll-y 
      class="circles-scroll" 
      @scrolltolower="loadMore"
    >
      <view class="category-section" v-for="(category, index) in categories" :key="index">
        <view class="category-header">
          <text class="category-name">{{category.name}}</text>
          <text class="circle-count">{{category.circle_count}}个圈子</text>
        </view>
        <view class="circles-grid">
          <view 
            class="circle-item" 
            v-for="(circle, circleIndex) in categoryCircles[category.category_id]" 
            :key="circleIndex"
            @tap="navigateToCircle(circle.circle_id)"
          >
            <log-image class="circle-icon" :src="circle.icon" mode="aspectFill" onerror="onerror=null;src='../../static/default-circle.png'"></log-image>
            <view class="circle-info">
              <view class="circle-name">
                {{circle.name}}
                <view class="official-tag" v-if="circle.is_official">官方</view>
              </view>
              <view class="circle-meta">
                <text class="member-count">{{circle.member_count}}人</text>
                <text class="post-count">{{circle.post_count}}帖子</text>
              </view>
              <view class="circle-description">{{circle.description}}</view>
            </view>
            <view class="join-btn" @tap.stop="joinCircle(circle)" v-if="!circle.is_joined">
              加入
            </view>
            <view class="joined-btn" v-else>
              已加入
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <uni-load-more :status="loadingStatus"></uni-load-more>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="Object.keys(categoryCircles).length === 0 && loadingStatus !== 'loading'">
        <image src="../../static/nothing.png" mode="aspectFit" class="empty-image"></image>
        <text class="empty-text">暂无圈子</text>
      </view>
    </scroll-view>
    
    <!-- 创建圈子按钮 -->
    <view class="create-btn" @tap="createCircle">
      <uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
      <text>创建圈子</text>
    </view>
  </view>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      categories: [],
      categoryCircles: {},
      keyword: '',
      isRefreshing: false,
      loadingStatus: 'more',
      hasMore: true,
      isLoggedIn: false,
      myJoinedCircles: []
    }
  },
  onLoad() {
    this.checkLoginStatus();
    this.loadCategories();
    if (this.isLoggedIn) {
      this.loadMyCircles();
    }
  },
  onPullDownRefresh() {
    this.hasMore = true;
    Promise.all([
      this.loadCategories(),
      this.isLoggedIn ? this.loadMyCircles() : Promise.resolve()
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
    async loadCategories() {
      try {
        const res = await axios.get(this.$baseUrl + '/community/circles/categories');
        if (res.data && res.data.length > 0) {
          this.categories = res.data;
          // 初始化每个分类的圈子列表
          this.categories.forEach(category => {
            this.$set(this.categoryCircles, category.category_id, []);
          });
          this.loadCirclesByCategory();
        }
      } catch (error) {
        console.error('加载分类失败', error);
        uni.showToast({
          title: '加载分类失败',
          icon: 'none'
        });
      }
    },
    async loadCirclesByCategory() {
      if (!this.hasMore || this.loadingStatus === 'loading') return;
      
      this.loadingStatus = 'loading';
      try {
        const promises = this.categories.map(category => {
          return axios.get(this.$baseUrl + '/community/circles/list', {
            params: {
              category_id: category.category_id,
              keyword: this.keyword
            }
          });
        });
        
        const results = await Promise.all(promises);
        
        results.forEach((res, index) => {
          if (res.data && res.data.list) {
            const categoryId = this.categories[index].category_id;
            // 处理圈子数据，标记已加入的圈子
            const circles = res.data.list.map(circle => {
              circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id);
              return circle;
            });
            this.$set(this.categoryCircles, categoryId, circles);
            // 更新分类的圈子数量
            this.categories[index].circle_count = res.data.total;
          }
        });
        
        this.loadingStatus = 'noMore';
      } catch (error) {
        console.error('加载圈子失败', error);
        this.loadingStatus = 'more';
        uni.showToast({
          title: '加载圈子失败',
          icon: 'none'
        });
      }
    },
    async loadMyCircles() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + '/community/circles/my-circles', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (res.data) {
          this.myJoinedCircles = res.data;
          
          // 更新所有分类中圈子的加入状态
          Object.keys(this.categoryCircles).forEach(categoryId => {
            this.categoryCircles[categoryId] = this.categoryCircles[categoryId].map(circle => {
              circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id);
              return circle;
            });
          });
        }
      } catch (error) {
        console.error('加载我的圈子失败', error);
      }
    },
    searchInput(e) {
      this.keyword = e;
    },
    searchCircles(e) {
      this.keyword = e.value;
      this.loadCirclesByCategory();
    },
    loadMore() {
      // 由于已经按分类加载了所有圈子，这里不需要实现加载更多
    },
    navigateToCircle(circleId) {
      uni.navigateTo({
        url: `/pages/community/circle?id=${circleId}`
      });
    },
    async joinCircle(circle) {
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: '/pages/users/login'
        });
        return;
      }
      
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        await axios.post(this.$baseUrl + '/community/circles/join', {
          circle_id: circle.circle_id
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        // 更新圈子状态
        circle.is_joined = true;
        circle.member_count++;
        
        // 更新我的圈子列表
        this.myJoinedCircles.push(circle);
        
        uni.showToast({
          title: '加入成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('加入圈子失败', error);
        uni.showToast({
          title: error.response?.data?.msg || '加入失败，请重试',
          icon: 'none'
        });
      }
    },
    createCircle() {
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: '/pages/users/login'
        });
        return;
      }
      
      uni.navigateTo({
        url: '/pages/community/createCircle'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.circles-container {
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.search-box {
  padding: 20rpx 30rpx;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
}

.circles-scroll {
  flex: 1;
  padding: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.category-section {
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  width: 100%;
  box-sizing: border-box;
}

.category-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.circle-count {
  font-size: 24rpx;
  color: #999;
}

.circles-grid {
  padding: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.circle-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  width: 100%;
  box-sizing: border-box;
}

.circle-item:last-child {
  border-bottom: none;
}

.circle-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.circle-info {
  flex: 1;
  min-width: 0; /* 防止flex子项溢出 */
}

.circle-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.official-tag {
  font-size: 20rpx;
  color: #fff;
  background-color: #EA7034;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
  margin-left: 10rpx;
  flex-shrink: 0;
}

.circle-meta {
  display: flex;
  margin-bottom: 10rpx;
}

.member-count, .post-count {
  font-size: 24rpx;
  color: #999;
  margin-right: 20rpx;
}

.circle-description {
  font-size: 26rpx;
  color: #666;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  width: 100%;
}

.join-btn {
  width: 120rpx;
  height: 60rpx;
  background-color: #EA7034;
  color: #fff;
  font-size: 28rpx;
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.joined-btn {
  width: 120rpx;
  height: 60rpx;
  background-color: #f0f0f0;
  color: #999;
  font-size: 28rpx;
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.create-btn {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  height: 80rpx;
  background-color: #EA7034;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(234, 112, 52, 0.3);
  z-index: 99;
}

.create-btn text {
  color: #fff;
  font-size: 28rpx;
  margin-left: 10rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  width: 100%;
  box-sizing: border-box;
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
</style> 