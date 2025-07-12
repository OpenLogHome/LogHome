<template>
    <view class="search-container">
      <!-- 搜索头部 -->
      <view class="search-header">
        <view class="search-input-wrapper">
          <uni-icons type="search" size="18" color="#999"></uni-icons>
          <input 
            class="search-input" 
            v-model="keyword" 
            placeholder="搜索书籍、圈子、帖子、用户" 
            confirm-type="search"
            @confirm="handleSearch"
            focus
          />
          <uni-icons 
            v-if="keyword" 
            type="clear" 
            size="18" 
            color="#999" 
            @click="clearKeyword"
          ></uni-icons>
        </view>
        <view class="search-cancel" @tap="goBack">取消</view>
      </view>
  
      <!-- 搜索历史和热门搜索 -->
      <view class="search-content" v-if="!hasSearched">
        <!-- 搜索历史 -->
        <view class="search-section" v-if="searchHistory.length > 0">
          <view class="section-header">
            <text class="section-title">搜索历史</text>
            <uni-icons type="trash" size="18" color="#999" @click="clearSearchHistory"></uni-icons>
          </view>
          <view class="tag-list">
            <view 
              class="tag-item" 
              v-for="(item, index) in searchHistory" 
              :key="'history-' + index"
              @tap="searchWithKeyword(item)"
            >
              {{item}}
            </view>
          </view>
        </view>
        
        <!-- 热门搜索 -->
        <view class="search-section">
          <view class="section-header">
            <text class="section-title">热门搜索</text>
          </view>
          <view class="tag-list">
            <view 
              class="tag-item" 
              v-for="(item, index) in hotSearches" 
              :key="'hot-' + index"
              @tap="searchWithKeyword(item.keyword)"
            >
              {{item.keyword}}
            </view>
          </view>
        </view>
      </view>
  
      <!-- 搜索结果 -->
      <view class="search-results" v-else>
        <!-- 搜索类型切换 -->
        <view class="search-tabs">
          <view 
            class="tab-item" 
            :class="{'active': searchType === 'all'}" 
            @tap="switchType('all')"
          >
            全部
          </view>
          <view 
            class="tab-item" 
            :class="{'active': searchType === 'books'}" 
            @tap="switchType('books')"
          >
            书籍
          </view>
          <view 
            class="tab-item" 
            :class="{'active': searchType === 'posts'}" 
            @tap="switchType('posts')"
          >
            帖子
          </view>
          <view 
            class="tab-item" 
            :class="{'active': searchType === 'circles'}" 
            @tap="switchType('circles')"
          >
            圈子
          </view>
          <view 
            class="tab-item" 
            :class="{'active': searchType === 'users'}" 
            @tap="switchType('users')"
          >
            用户
          </view>
        </view>
  
        <!-- 搜索结果内容 -->
        <scroll-view 
          scroll-y 
          class="results-content"
          @scrolltolower="loadMore"
        >
          <!-- 书籍搜索结果 -->
          <view class="book-results" v-if="(searchType === 'all' && results.books && results.books.list.length > 0) || searchType === 'books'">
            <view class="result-title" v-if="searchType === 'all'">书籍</view>
            
            <navigator 
              v-for="(book, index) in getBookResults()" 
              :key="'book-' + index"
              :url="'../readers/bookInfo?id=' + book.novel_id"
              class="book-item"
            >
              <image class="book-cover" :src="book.picUrl + '?thumbnail=1'" mode="aspectFill" 
                :onerror="`this.src='../../static/default-book.png'`"></image>
              <view class="book-info">
                <view class="book-title">{{book.name}}</view>
                <view class="book-author">
                  <image class="author-avatar" :src="book.auther_avatar || '../../static/user/defaultAvatar.jpg'" mode="aspectFill"></image>
                  <text>{{book.author_name}}</text>
                </view>
                <view class="book-desc">{{book.content}}</view>
              </view>
            </navigator>
            
            <uni-load-more :status="booksLoadingStatus" v-if="searchType === 'books'"></uni-load-more>
          </view>
  
          <!-- 圈子搜索结果 -->
          <view class="circle-results" v-if="(searchType === 'all' && results.circles && results.circles.list.length > 0) || searchType === 'circles'">
            <view class="result-title" v-if="searchType === 'all'">圈子</view>
            
            <view 
              class="circle-item" 
              v-for="(circle, index) in getCircleResults()" 
              :key="'circle-' + index"
              @tap="navigateToCircle(circle.circle_id)"
            >
              <image class="circle-icon" :src="circle.icon || '../../static/default-circle.png'" mode="aspectFill"></image>
              <view class="circle-info">
                <view class="circle-name">{{circle.name}}</view>
                <view class="circle-meta">
                  <text>{{circle.member_count || 0}}人</text>
                  <text>{{circle.category_name || '未分类'}}</text>
                </view>
                <view class="circle-desc">{{circle.description || '暂无描述'}}</view>
              </view>
            </view>
            
            <uni-load-more :status="circlesLoadingStatus" v-if="searchType === 'circles'"></uni-load-more>
          </view>
  
          <!-- 帖子搜索结果 -->
          <view class="post-results" v-if="(searchType === 'all' && results.posts && results.posts.list.length > 0) || searchType === 'posts'">
            <view class="result-title" v-if="searchType === 'all'">帖子</view>
            
            <view 
              class="post-item" 
              v-for="(post, index) in getPostResults()" 
              :key="'post-' + index"
              @tap="navigateToPost(post.post_id)"
            >
              <view class="post-header">
                <view class="user-info" @tap.stop="navigateToUser(post.user_id)">
                  <image class="user-avatar" :src="post.author_avatar || '../../static/default-avatar.png'" mode="aspectFill"></image>
                  <view class="user-meta">
                    <text class="user-name">{{post.author_name || '匿名用户'}}</text>
                    <view class="post-time">{{formatTime(post.create_time)}}</view>
                  </view>
                </view>
                <view class="post-circle" @tap.stop="navigateToCircle(post.circle_id)">
                  {{post.circle_name || '未知圈子'}}
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
            </view>
            
            <uni-load-more :status="postsLoadingStatus" v-if="searchType === 'posts'"></uni-load-more>
          </view>
  
          <!-- 用户搜索结果 -->
          <view class="user-results" v-if="(searchType === 'all' && results.users && results.users.list.length > 0) || searchType === 'users'">
            <view class="result-title" v-if="searchType === 'all'">用户</view>
            
            <view 
              class="user-item" 
              v-for="(user, index) in getUserResults()" 
              :key="'user-' + index"
              @tap="navigateToUser(user.user_id)"
            >
              <image class="user-avatar" :src="user.avatar_url || '../../static/default-avatar.png'" mode="aspectFill"></image>
              <view class="user-info">
                <view class="user-name">{{user.name || '匿名用户'}}</view>
                <view class="user-motto">{{user.motto || '这个人很懒，还没有设置个性签名'}}</view>
              </view>
            </view>
            
            <uni-load-more :status="usersLoadingStatus" v-if="searchType === 'users'"></uni-load-more>
          </view>
  
          <!-- 无搜索结果 -->
          <view class="no-results" v-if="noResults">
            <image src="../../static/nothing.png" mode="aspectFit"></image>
            <text>没有找到相关内容</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </template>
  
  <script>
  import axios from 'axios';
  import moment from 'moment';
  
  export default {
    data() {
      return {
        keyword: '', // 搜索关键词
        searchType: 'all', // 搜索类型：all, books, posts, circles, users
        hasSearched: false, // 是否已搜索
        searchHistory: [], // 搜索历史
        hotSearches: [], // 热门搜索
        results: {
          circles: { list: [], total: 0 },
          posts: { list: [], total: 0 },
          users: { list: [], total: 0 },
          books: { list: [], total: 0 }
        },
        page: {
          circles: 1,
          posts: 1,
          users: 1,
          books: 1
        },
        pageSize: 10,
        hasMore: {
          circles: false,
          posts: false,
          users: false,
          books: false
        },
        circlesLoadingStatus: 'more',
        postsLoadingStatus: 'more',
        usersLoadingStatus: 'more',
        booksLoadingStatus: 'more',
        isLoading: false,
        origin: 'community' // 默认来源为社区
      };
    },
    
    computed: {
      noResults() {
        if (!this.hasSearched) return false;
        
        if (this.searchType === 'all') {
          return (!this.results.circles || this.results.circles.list.length === 0) &&
                 (!this.results.posts || this.results.posts.list.length === 0) &&
                 (!this.results.users || this.results.users.list.length === 0) &&
                 (!this.results.books || this.results.books.list.length === 0);
        } else if (this.searchType === 'circles') {
          return !this.results.circles || this.results.circles.list.length === 0;
        } else if (this.searchType === 'posts') {
          return !this.results.posts || this.results.posts.list.length === 0;
        } else if (this.searchType === 'users') {
          return !this.results.users || this.results.users.list.length === 0;
        } else if (this.searchType === 'books') {
          return !this.results.books || this.results.books.list.length === 0;
        }
        
        return false;
      }
    },
    
    onLoad(options) {
      // 根据来源设置默认搜索类型
      if (options.origin === 'library') {
        this.origin = 'library';
        this.searchType = 'books';
      }
      
      // 如果有关键词参数，则自动执行搜索
      if (options.keyword) {
        this.keyword = options.keyword;
        this.handleSearch();
      }
      
      // 获取本地存储的搜索历史
      const historyKey = this.origin === 'library' ? 'library_search_history' : 'community_search_history';
      const history = uni.getStorageSync(historyKey);
      if (history) {
        try {
          this.searchHistory = JSON.parse(history);
        } catch (e) {
          this.searchHistory = [];
        }
      }
      
      // 获取热门搜索
      this.getHotSearches();
    },
    
    methods: {
      goBack() {
        uni.navigateBack();
      },
      
      // 清空搜索关键词
      clearKeyword() {
        this.keyword = '';
        this.hasSearched = false;
      },
      
      // 处理搜索
      handleSearch() {
        if (!this.keyword.trim()) {
          uni.showToast({
            title: '请输入搜索关键词',
            icon: 'none'
          });
          return;
        }
        
        // 保存搜索历史
        this.saveSearchHistory(this.keyword);
        
        // 重置搜索状态
        this.resetSearch();
        
        // 执行搜索
        this.search();
      },
      
      // 使用指定关键词搜索
      searchWithKeyword(keyword) {
        this.keyword = keyword;
        this.handleSearch();
      },
      
      // 保存搜索历史
      saveSearchHistory(keyword) {
        // 移除重复的关键词
        const index = this.searchHistory.indexOf(keyword);
        if (index !== -1) {
          this.searchHistory.splice(index, 1);
        }
        
        // 添加到历史记录开头
        this.searchHistory.unshift(keyword);
        
        // 最多保留10条记录
        if (this.searchHistory.length > 10) {
          this.searchHistory.pop();
        }
        
        // 保存到本地存储 - 根据来源使用不同的key
        const historyKey = this.origin === 'library' ? 'library_search_history' : 'community_search_history';
        uni.setStorageSync(historyKey, JSON.stringify(this.searchHistory));
      },
      
      // 清空搜索历史
      clearSearchHistory() {
        uni.showModal({
          title: '提示',
          content: '确认清空搜索历史？',
          success: (res) => {
            if (res.confirm) {
              this.searchHistory = [];
              const historyKey = this.origin === 'library' ? 'library_search_history' : 'community_search_history';
              uni.removeStorageSync(historyKey);
            }
          }
        });
      },
      
      // 获取热门搜索
      async getHotSearches() {
        try {
          // 获取对应来源的热门搜索
          const category = this.origin === 'library' ? 'books' : 'all';
          const res = await axios.get(this.$baseUrl + '/community/search/hot', {
            params: { 
              category: category,
              limit: 8 
            }
          });
          this.hotSearches = res.data || [];
        } catch (error) {
          console.error('获取热门搜索失败', error);
          this.hotSearches = [];
        }
      },
      
      // 重置搜索状态
      resetSearch() {
        this.hasSearched = true;
        this.results = {
          circles: { list: [], total: 0 },
          posts: { list: [], total: 0 },
          users: { list: [], total: 0 },
          books: { list: [], total: 0 }
        };
        this.page = {
          circles: 1,
          posts: 1,
          users: 1,
          books: 1
        };
        this.hasMore = {
          circles: false,
          posts: false,
          users: false,
          books: false
        };
        this.circlesLoadingStatus = 'more';
        this.postsLoadingStatus = 'more';
        this.usersLoadingStatus = 'more';
        this.booksLoadingStatus = 'more';
      },
      
      // 执行搜索
      async search() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
          const params = {
            keyword: this.keyword,
            type: this.searchType,
            page: this.searchType === 'all' 
                  ? 1 
                  : this.page[this.searchType],
            pageSize: this.pageSize
          };
          
          const res = await axios.get(this.$baseUrl + '/community/search', { params });
          
          if (this.searchType === 'all') {
            this.results = res.data.results;
            
            // 设置是否有更多数据
            if (this.results.circles) {
              this.hasMore.circles = this.results.circles.list.length < this.results.circles.total;
            }
            
            if (this.results.posts) {
              this.hasMore.posts = this.results.posts.list.length < this.results.posts.total;
            }
            
            if (this.results.users) {
              this.hasMore.users = this.results.users.list.length < this.results.users.total;
            }
            if (this.results.books) {
              this.hasMore.books = this.results.books.list.length < this.results.books.total;
            }
          } else {
            // 追加结果
            if (params.page === 1) {
              this.results[this.searchType] = res.data.results[this.searchType];
            } else {
              this.results[this.searchType].list = [
                ...this.results[this.searchType].list,
                ...res.data.results[this.searchType].list
              ];
            }
            
            // 更新页码
            this.page[this.searchType]++;
            
            // 设置是否有更多数据
            this.hasMore[this.searchType] = 
              this.results[this.searchType].list.length < this.results[this.searchType].total;
              
            // 更新加载状态
            this[`${this.searchType}LoadingStatus`] = this.hasMore[this.searchType] ? 'more' : 'noMore';
            if (this.searchType === 'books') {
              this.booksLoadingStatus = this.hasMore.books ? 'more' : 'noMore';
            }
          }
        } catch (error) {
          console.error('搜索失败', error);
          uni.showToast({
            title: '搜索失败，请重试',
            icon: 'none'
          });
        } finally {
          this.isLoading = false;
        }
      },
      
      // 切换搜索类型
      switchType(type) {
        if (this.searchType === type) return;
        
        this.searchType = type;
        
        if (type !== 'all' && (!this.results[type].list || this.results[type].list.length === 0)) {
          this.search();
        }
      },
      
      // 加载更多
      loadMore() {
        if (this.searchType === 'all' || this.isLoading) return;
        
        if (this.hasMore[this.searchType]) {
          this[`${this.searchType}LoadingStatus`] = 'loading';
          this.search();
        }
      },
      
      // 获取圈子搜索结果
      getCircleResults() {
        if (this.searchType === 'all') {
          return this.results.circles ? this.results.circles.list.slice(0, 3) : [];
        } else {
          return this.results.circles ? this.results.circles.list : [];
        }
      },
      
      // 获取帖子搜索结果
      getPostResults() {
        if (this.searchType === 'all') {
          return this.results.posts ? this.results.posts.list.slice(0, 2) : [];
        } else {
          return this.results.posts ? this.results.posts.list : [];
        }
      },
      
      // 获取用户搜索结果
      getUserResults() {
        if (this.searchType === 'all') {
          return this.results.users ? this.results.users.list.slice(0, 3) : [];
        } else {
          return this.results.users ? this.results.users.list : [];
        }
      },

      // 获取书籍搜索结果
      getBookResults() {
        if (this.searchType === 'all') {
          return this.results.books ? this.results.books.list.slice(0, 3) : [];
        } else {
          return this.results.books ? this.results.books.list : [];
        }
      },
      
      // 格式化时间
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
      
      // 预览图片
      previewImage(images, index) {
        uni.previewImage({
          urls: images,
          current: images[index]
        });
      },
      
      // 导航到圈子详情
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
      
      // 导航到帖子详情
      navigateToPost(postId) {
        uni.navigateTo({ url: `/pages/community/postDetail?id=${postId}` });
      },
      
      // 导航到用户主页
      navigateToUser(userId) {
        uni.navigateTo({ url: `/pages/users/personalPage?id=${userId}` });
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .search-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f8f8f8;
  }
  
  .search-header {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 20rpx;
    height: 72rpx;
  }
  
  .search-input {
    flex: 1;
    height: 72rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }
  
  .search-cancel {
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  .search-content {
    flex: 1;
    padding: 20rpx 30rpx;
  }
  
  .search-section {
    margin-bottom: 30rpx;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
  }
  
  .tag-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .tag-item {
    display: inline-block;
    padding: 10rpx 20rpx;
    margin: 10rpx;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    font-size: 24rpx;
    color: #666;
  }
  
  .search-tabs {
    display: flex;
    background-color: #fff;
    padding: 0 20rpx;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;
  }
  
  .tab-item.active {
    color: #EA7034;
    font-weight: bold;
  }
  
  .tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60rpx;
    height: 6rpx;
    background-color: #EA7034;
    border-radius: 3rpx;
  }
  
  .results-content {
    flex: 1;
    height: calc(100vh - 180rpx);
  }
  
  .result-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #f0f0f0;
  }
  
  // 书籍搜索结果样式
  .book-results {
    margin-bottom: 20rpx;
  }

  .book-item {
    display: flex;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
  }

  .book-cover {
    width: 120rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }

  .book-info {
    flex: 1;
  }

  .book-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }

  .book-author {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
  }

  .author-avatar {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    margin-right: 10rpx;
  }

  .book-author text {
    font-size: 24rpx;
    color: #999;
  }

  .book-desc {
    font-size: 24rpx;
    color: #666;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  
  // 圈子搜索结果样式
  .circle-results {
    margin-bottom: 20rpx;
  }
  
  .circle-item {
    display: flex;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .circle-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  
  .circle-info {
    flex: 1;
  }
  
  .circle-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .circle-meta {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 10rpx;
  }
  
  .circle-meta text {
    margin-right: 20rpx;
  }
  
  .circle-desc {
    font-size: 24rpx;
    color: #666;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  
  // 帖子搜索结果样式
  .post-results {
    margin-bottom: 20rpx;
  }
  
  .post-item {
    padding: 30rpx;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
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
    .user-name {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  
    .post-time {
      font-size: 24rpx;
      color: #999;
      margin-top: 4rpx;
    }
  }
  
  .post-circle {
    font-size: 24rpx;
    color: #EA7034;
    background: rgba(234, 112, 52, 0.1);
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
  }
  
  .post-content {
    .post-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }
  
    .post-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
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
      
      .image-count {
        position: absolute;
        right: 10rpx;
        bottom: 10rpx;
        background: rgba(0,0,0,0.5);
        color: #fff;
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border-radius: 4rpx;
      }
    }
  }
  
  // 用户搜索结果样式
  .user-results {
    margin-bottom: 20rpx;
  }
  
  .user-item {
    display: flex;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .user-info {
    flex: 1;
    margin-left: 20rpx;
  }
  
  .user-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .user-motto {
    font-size: 24rpx;
    color: #999;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  
  // 无搜索结果样式
  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
  }
  
  .no-results image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .no-results text {
    font-size: 28rpx;
    color: #999;
  }
  </style>