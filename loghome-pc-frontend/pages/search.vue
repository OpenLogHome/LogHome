<template>
  <div class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-container">
        <div class="search-box">
          <i class="el-icon-search search-icon"></i>
          <input 
            type="text" 
            placeholder="搜索小说、作者、帖子、用户..." 
            class="search-input"
            v-model="searchKeyword"
            @input="onSearchInput"
            @keyup.enter="handleSearch"
            ref="searchInput"
          >
          <i v-if="searchKeyword" class="el-icon-close search-clear" @click="clearSearch"></i>
        </div>
        <button class="search-btn" @click="handleSearch" :disabled="!searchKeyword.trim()">
          搜索
        </button>
      </div>
    </div>

    <!-- 搜索内容区域 -->
    <div class="search-content">
      <!-- 搜索前状态：搜索历史和热门搜索 -->
      <div class="search-before" v-if="!hasSearched">
        <!-- 搜索历史 -->
        <div class="search-section" v-if="searchHistory.length > 0">
          <div class="section-header">
            <h3 class="section-title">搜索历史</h3>
            <button class="clear-btn" @click="clearSearchHistory">
              <i class="el-icon-delete"></i>
              清空
            </button>
          </div>
          <div class="tag-list">
            <span 
              class="tag-item" 
              v-for="(item, index) in searchHistory" 
              :key="'history-' + index"
              @click="searchWithKeyword(item)"
            >
              {{item}}
            </span>
          </div>
        </div>
        
        <!-- 热门搜索 -->
        <div class="search-section">
          <div class="section-header">
            <h3 class="section-title">热门搜索</h3>
          </div>
          <div class="tag-list">
            <span 
              class="tag-item hot-tag" 
              v-for="(item, index) in hotSearches" 
              :key="'hot-' + index"
              @click="searchWithKeyword(item.keyword)"
            >
              {{item.keyword}}
            </span>
          </div>
        </div>
      </div>

      <!-- 搜索后状态：搜索结果 -->
      <div class="search-after" v-if="hasSearched">
        <!-- 搜索结果统计 -->
        <div class="search-stats">
          <span class="search-keyword">"{{currentKeyword}}"</span>
          <span class="search-count">找到 {{totalResults}} 个结果</span>
        </div>

        <!-- 搜索类型切换 -->
        <div class="search-tabs">
          <div 
            class="tab-item" 
            :class="{'active': searchType === 'all'}" 
            @click="switchSearchType('all')"
          >
            <span class="tab-name">全部</span>
            <span class="tab-count" v-if="totalResults > 0">({{totalResults}})</span>
          </div>
          <div 
            class="tab-item" 
            :class="{'active': searchType === 'books'}" 
            @click="switchSearchType('books')"
          >
            <span class="tab-name">书籍</span>
            <span class="tab-count" v-if="searchResults.books.total > 0">({{searchResults.books.total}})</span>
          </div>
          <div 
            class="tab-item" 
            :class="{'active': searchType === 'posts'}" 
            @click="switchSearchType('posts')"
          >
            <span class="tab-name">帖子</span>
            <span class="tab-count" v-if="searchResults.posts.total > 0">({{searchResults.posts.total}})</span>
          </div>
          <div 
            class="tab-item" 
            :class="{'active': searchType === 'circles'}" 
            @click="switchSearchType('circles')"
          >
            <span class="tab-name">圈子</span>
            <span class="tab-count" v-if="searchResults.circles.total > 0">({{searchResults.circles.total}})</span>
          </div>
          <div 
            class="tab-item" 
            :class="{'active': searchType === 'users'}" 
            @click="switchSearchType('users')"
          >
            <span class="tab-name">用户</span>
            <span class="tab-count" v-if="searchResults.users.total > 0">({{searchResults.users.total}})</span>
          </div>
        </div>

        <!-- 搜索结果内容 -->
        <div class="results-container">
          <!-- 加载状态 -->
          <div class="loading" v-if="isSearching">
            <i class="el-icon-loading"></i>
            <span>搜索中...</span>
          </div>

          <!-- 搜索结果 -->
          <div class="results-content" v-else>
            <!-- 全部结果 -->
            <div class="all-results" v-if="searchType === 'all'">
              <!-- 书籍结果 -->
              <div class="result-section" v-if="searchResults.books.list.length > 0">
                <div class="section-title">
                  <h4>书籍</h4>
                  <nuxt-link :to="`/search?type=books&keyword=${currentKeyword}`" class="more-link">
                    查看更多 <i class="el-icon-arrow-right"></i>
                  </nuxt-link>
                </div>
                <div class="book-grid">
                  <div 
                    class="book-item" 
                    v-for="(book, index) in searchResults.books.list.slice(0, 6)" 
                    :key="'book-' + index"
                    @click="navigateToBook(book.novel_id)"
                  >
                    <img class="book-cover" :src="book.picUrl + '?thumbnail=1'" :alt="book.name">
                    <div class="book-info">
                      <div class="book-title">{{book.name}}</div>
                      <div class="book-author">{{book.author_name}}</div>
                      <div class="book-desc">{{book.content}}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 帖子结果 -->
              <div class="result-section" v-if="searchResults.posts.list.length > 0">
                <div class="section-title">
                  <h4>帖子</h4>
                  <nuxt-link :to="`/search?type=posts&keyword=${currentKeyword}`" class="more-link">
                    查看更多 <i class="el-icon-arrow-right"></i>
                  </nuxt-link>
                </div>
                <div class="post-list">
                  <div 
                    class="post-item" 
                    v-for="(post, index) in searchResults.posts.list.slice(0, 5)" 
                    :key="'post-' + index"
                    @click="navigateToPost(post.post_id)"
                  >
                    <div class="post-header">
                      <img class="user-avatar" :src="post.author_avatar || '/default-avatar.png'" :alt="post.author_name">
                      <div class="post-meta">
                        <span class="user-name">{{post.author_name || '匿名用户'}}</span>
                        <span class="post-time">{{formatTime(post.create_time)}}</span>
                      </div>
                    </div>
                    <div class="post-content">
                      <div class="post-title">{{post.title}}</div>
                      <div class="post-text">{{post.content}}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 圈子结果 -->
              <div class="result-section" v-if="searchResults.circles.list.length > 0">
                <div class="section-title">
                  <h4>圈子</h4>
                  <nuxt-link :to="`/search?type=circles&keyword=${currentKeyword}`" class="more-link">
                    查看更多 <i class="el-icon-arrow-right"></i>
                  </nuxt-link>
                </div>
                <div class="circle-list">
                  <div 
                    class="circle-item" 
                    v-for="(circle, index) in searchResults.circles.list.slice(0, 4)" 
                    :key="'circle-' + index"
                    @click="navigateToCircle(circle.circle_id)"
                  >
                    <img class="circle-icon" :src="circle.icon || '/default-circle.png'" :alt="circle.name">
                    <div class="circle-info">
                      <div class="circle-name">{{circle.name}}</div>
                      <div class="circle-meta">{{circle.member_count || 0}}人 · {{circle.category_name || '未分类'}}</div>
                      <div class="circle-desc">{{circle.description || '暂无描述'}}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 用户结果 -->
              <div class="result-section" v-if="searchResults.users.list.length > 0">
                <div class="section-title">
                  <h4>用户</h4>
                  <nuxt-link :to="`/search?type=users&keyword=${currentKeyword}`" class="more-link">
                    查看更多 <i class="el-icon-arrow-right"></i>
                  </nuxt-link>
                </div>
                <div class="user-list">
                  <div 
                    class="user-item" 
                    v-for="(user, index) in searchResults.users.list.slice(0, 6)" 
                    :key="'user-' + index"
                    @click="navigateToUser(user.user_id)"
                  >
                    <img class="user-avatar" :src="user.avatar_url || '/default-avatar.png'" :alt="user.name">
                    <div class="user-info">
                      <div class="user-name">{{user.name || '匿名用户'}}</div>
                      <div class="user-motto">{{user.motto || '这个人很懒，还没有设置个性签名'}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 单类型结果 -->
            <div class="single-results" v-else>
              <!-- 书籍列表 -->
              <div class="book-results" v-if="searchType === 'books'">
                <div class="book-grid">
                  <div 
                    class="book-item" 
                    v-for="(book, index) in searchResults.books.list" 
                    :key="'book-' + index"
                    @click="navigateToBook(book.novel_id)"
                  >
                    <img class="book-cover" :src="book.picUrl + '?thumbnail=1'" :alt="book.name">
                    <div class="book-info">
                      <div class="book-title">{{book.name}}</div>
                      <div class="book-author">{{book.author_name}}</div>
                      <div class="book-desc">{{book.content}}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 帖子列表 -->
              <div class="post-results" v-if="searchType === 'posts'">
                <div class="post-list">
                  <div 
                    class="post-item" 
                    v-for="(post, index) in searchResults.posts.list" 
                    :key="'post-' + index"
                    @click="navigateToPost(post.post_id)"
                  >
                    <div class="post-header">
                      <img class="user-avatar" :src="post.author_avatar || '/default-avatar.png'" :alt="post.author_name">
                      <div class="post-meta">
                        <span class="user-name">{{post.author_name || '匿名用户'}}</span>
                        <span class="post-time">{{formatTime(post.create_time)}}</span>
                      </div>
                    </div>
                    <div class="post-content">
                      <div class="post-title">{{post.title}}</div>
                      <div class="post-text">{{post.content}}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 圈子列表 -->
              <div class="circle-results" v-if="searchType === 'circles'">
                <div class="circle-list">
                  <div 
                    class="circle-item" 
                    v-for="(circle, index) in searchResults.circles.list" 
                    :key="'circle-' + index"
                    @click="navigateToCircle(circle.circle_id)"
                  >
                    <img class="circle-icon" :src="circle.icon || '/default-circle.png'" :alt="circle.name">
                    <div class="circle-info">
                      <div class="circle-name">{{circle.name}}</div>
                      <div class="circle-meta">{{circle.member_count || 0}}人 · {{circle.category_name || '未分类'}}</div>
                      <div class="circle-desc">{{circle.description || '暂无描述'}}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 用户列表 -->
              <div class="user-results" v-if="searchType === 'users'">
                <div class="user-list">
                  <div 
                    class="user-item" 
                    v-for="(user, index) in searchResults.users.list" 
                    :key="'user-' + index"
                    @click="navigateToUser(user.user_id)"
                  >
                    <img class="user-avatar" :src="user.avatar_url || '/default-avatar.png'" :alt="user.name">
                    <div class="user-info">
                      <div class="user-name">{{user.name || '匿名用户'}}</div>
                      <div class="user-motto">{{user.motto || '这个人很懒，还没有设置个性签名'}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加载更多 -->
            <div class="load-more" v-if="canLoadMore && searchType !== 'all'">
              <button class="load-more-btn" @click="loadMore" :disabled="isLoadingMore">
                <i v-if="isLoadingMore" class="el-icon-loading"></i>
                {{isLoadingMore ? '加载中...' : '加载更多'}}
              </button>
            </div>

            <!-- 无结果 -->
            <div class="no-results" v-if="noResults">
              <div class="no-results-icon">
                <i class="el-icon-search"></i>
              </div>
              <div class="no-results-text">
                <h3>没有找到相关内容</h3>
                <p>试试其他关键词或检查拼写</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
  head() {
    return {
      title: this.hasSearched ? `${this.currentKeyword} - 搜索结果` : '搜索 - LogHome',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.hasSearched ? `搜索"${this.currentKeyword}"的结果` : 'LogHome搜索页面'
        }
      ]
    }
  },
  data() {
    return {
      searchKeyword: '',
      currentKeyword: '',
      hasSearched: false,
      searchType: 'all',
      searchHistory: [],
      hotSearches: [],
      searchResults: {
        circles: { list: [], total: 0 },
        posts: { list: [], total: 0 },
        users: { list: [], total: 0 },
        books: { list: [], total: 0 }
      },
      isSearching: false,
      isLoadingMore: false,
      searchTimer: null,
      currentPage: {
        circles: 1,
        posts: 1,
        users: 1,
        books: 1
      }
    }
  },
  computed: {
    totalResults() {
      const { circles, posts, users, books } = this.searchResults
      return (circles.total || 0) + (posts.total || 0) + (users.total || 0) + (books.total || 0)
    },
    noResults() {
      if (!this.hasSearched) return false
      return this.totalResults === 0
    },
    canLoadMore() {
      if (this.searchType === 'all') return false
      const currentResults = this.searchResults[this.searchType]
      return currentResults.list.length < currentResults.total
    }
  },
  mounted() {
    this.loadSearchHistory()
    this.getHotSearches()
    
    // 处理URL参数
    const { keyword, type } = this.$route.query
    if (keyword) {
      this.searchKeyword = keyword
      this.currentKeyword = keyword
      this.searchType = type || 'all'
      this.search()
    }
    
    // 聚焦搜索框
    this.$nextTick(() => {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus()
      }
    })
  },
  watch: {
    '$route.query': {
      handler(newQuery) {
        const { keyword, type } = newQuery
        if (keyword && keyword !== this.currentKeyword) {
          this.searchKeyword = keyword
          this.currentKeyword = keyword
          this.searchType = type || 'all'
          this.search()
        }
      },
      deep: true
    }
  },
  methods: {
    onSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      // 实时搜索建议可以在这里实现
    },
    
    clearSearch() {
      this.searchKeyword = ''
      this.hasSearched = false
      this.currentKeyword = ''
      this.$router.push('/search')
    },
    
    handleSearch() {
      if (!this.searchKeyword.trim()) return
      this.currentKeyword = this.searchKeyword.trim()
      this.search()
      this.saveSearchHistory(this.currentKeyword)
      
      // 更新URL
      this.$router.push({
        path: '/search',
        query: {
          keyword: this.currentKeyword,
          type: this.searchType
        }
      })
    },
    
    searchWithKeyword(keyword) {
      this.searchKeyword = keyword
      this.currentKeyword = keyword
      this.search()
      this.saveSearchHistory(keyword)
      
      // 更新URL
      this.$router.push({
        path: '/search',
        query: {
          keyword: keyword,
          type: this.searchType
        }
      })
    },
    
    switchSearchType(type) {
      this.searchType = type
      if (this.hasSearched) {
        this.resetPagination()
        this.search()
        
        // 更新URL
        this.$router.push({
          path: '/search',
          query: {
            keyword: this.currentKeyword,
            type: type
          }
        })
      }
    },
    
    resetPagination() {
      this.currentPage = {
        circles: 1,
        posts: 1,
        users: 1,
        books: 1
      }
    },
    
    async search() {
      if (this.isSearching || !this.currentKeyword.trim()) return
      
      this.isSearching = true
      this.hasSearched = true
      
      try {
        if (this.searchType === 'all') {
          // 搜索所有类型
          await Promise.all([
            this.searchBooks(),
            this.searchPosts(),
            this.searchCircles(),
            this.searchUsers()
          ])
        } else {
          // 搜索单个类型
          switch (this.searchType) {
            case 'books':
              await this.searchBooks()
              break
            case 'posts':
              await this.searchPosts()
              break
            case 'circles':
              await this.searchCircles()
              break
            case 'users':
              await this.searchUsers()
              break
          }
        }
      } catch (error) {
        console.error('搜索失败:', error)
        this.$message.error('搜索失败，请稍后重试')
      } finally {
        this.isSearching = false
      }
    },
    
    async loadMore() {
      if (this.isLoadingMore || !this.canLoadMore) return
      
      this.isLoadingMore = true
      this.currentPage[this.searchType]++
      
      try {
        switch (this.searchType) {
          case 'books':
            await this.searchBooks(true)
            break
          case 'posts':
            await this.searchPosts(true)
            break
          case 'circles':
            await this.searchCircles(true)
            break
          case 'users':
            await this.searchUsers(true)
            break
        }
      } catch (error) {
        console.error('加载更多失败:', error)
        this.$message.error('加载失败，请稍后重试')
        this.currentPage[this.searchType]--
      } finally {
        this.isLoadingMore = false
      }
    },
    
    async searchBooks(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchNovels({
          keyword: this.currentKeyword,
          page: this.currentPage.books,
          limit: this.searchType === 'all' ? 6 : 12
        })
        
        if (isLoadMore) {
          this.searchResults.books.list.push(...result.list)
        } else {
          this.searchResults.books = result
        }
      } catch (error) {
        console.error('搜索书籍失败:', error)
        this.searchResults.books = { list: [], total: 0 }
      }
    },
    
    async searchPosts(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchPosts({
          keyword: this.currentKeyword,
          page: this.currentPage.posts,
          limit: this.searchType === 'all' ? 5 : 10
        })
        
        if (isLoadMore) {
          this.searchResults.posts.list.push(...result.list)
        } else {
          this.searchResults.posts = result
        }
      } catch (error) {
        console.error('搜索帖子失败:', error)
        this.searchResults.posts = { list: [], total: 0 }
      }
    },
    
    async searchCircles(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchCircles({
          keyword: this.currentKeyword,
          page: this.currentPage.circles,
          limit: this.searchType === 'all' ? 4 : 8
        })
        
        if (isLoadMore) {
          this.searchResults.circles.list.push(...result.list)
        } else {
          this.searchResults.circles = result
        }
      } catch (error) {
        console.error('搜索圈子失败:', error)
        this.searchResults.circles = { list: [], total: 0 }
      }
    },

    async searchUsers(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchUsers({
          keyword: this.currentKeyword,
          page: this.currentPage.users,
          limit: this.searchType === 'all' ? 6 : 12
        })
        
        if (isLoadMore) {
          this.searchResults.users.list.push(...result.list)
        } else {
          this.searchResults.users = result
        }
      } catch (error) {
        console.error('搜索用户失败:', error)
        this.searchResults.users = { list: [], total: 0 }
      }
    },
    
    saveSearchHistory(keyword) {
      if (!keyword || keyword.trim() === '') return
      
      let history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      history = history.filter(item => item !== keyword)
      history.unshift(keyword)
      history = history.slice(0, 10) // 最多保存10条
      
      localStorage.setItem('searchHistory', JSON.stringify(history))
      this.searchHistory = history
    },
    
    loadSearchHistory() {
      this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    },
    
    clearSearchHistory() {
      localStorage.removeItem('searchHistory')
      this.searchHistory = []
      this.$message.success('搜索历史已清空')
    },
    
    async getHotSearches() {
      try {
        this.hotSearches = await this.$api.search.getHotSearches()
      } catch (error) {
        console.error('获取热门搜索失败:', error)
        // 设置默认热门搜索
        this.hotSearches = [
          { keyword: '修仙' },
          { keyword: '都市' },
          { keyword: '玄幻' },
          { keyword: '言情' },
          { keyword: '历史' },
          { keyword: '科幻' },
          { keyword: '悬疑' },
          { keyword: '武侠' }
        ]
      }
    },
    
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) {
        return '刚刚'
      } else if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前'
      } else if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前'
      } else {
        return Math.floor(diff / 86400000) + '天前'
      }
    },
    
    // 导航方法
    navigateToBook(novelId, novelType) {
      // 如果是世界设定类型，跳转到world页面，否则跳转到novel页面
      if (novelType === 'world') {
        this.$router.push(`/world/${novelId}`)
      } else {
        this.$router.push(`/novel/${novelId}`)
      }
    },
    
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`)
    },
    
    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`)
    },
    
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`)
    }
  }
}
</script>

<style scoped>
/* 变量定义 - 深棕色系 */
:root {
  --primary-color: #947358;
  --secondary-color: #704C35;
  --text-color: #333;
  --text-light: #666;
  --text-lighter: #888;
  --border-color: #eee;
  --border-light: #f5f5f5;
  --background-color: #fff;
  --orange-color: #FB7D46;
  --orange-dark: #fa6c2e;
}

.search-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* 搜索头部 */
.search-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px 0;
  position: sticky;
  top: 60px;
  z-index: 100;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-box {
  flex: 1;
  max-width: 600px;
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 25px;
  padding: 0 20px;
  transition: all 0.3s;
}

.search-box:focus-within {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #947358;
}

.search-icon {
  color: #999;
  font-size: 18px;
  margin-right: 10px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  padding: 12px 0;
  font-size: 16px;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.search-clear {
  color: #999;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  transition: color 0.3s;
}

.search-clear:hover {
  color: #666;
}

.search-btn {
  background: #947358;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.search-btn:hover:not(:disabled) {
  background: #704C35;
}

.search-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

/* 搜索内容区域 */
.search-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 搜索前状态 */
.search-before {
  max-width: 800px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: color 0.3s;
}

.clear-btn:hover {
  color: #666;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  background: white;
  color: #666;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.tag-item:hover {
  background: #947358;
  color: white;
  border-color: #947358;
}

.hot-tag {
  background: linear-gradient(45deg, #704C35, #947358);
  color: white;
  border: none;
}

.hot-tag:hover {
  background: linear-gradient(45deg, #5D3C29, #A68B76);
  transform: translateY(-2px);
}

/* 搜索后状态 */
.search-stats {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-keyword {
  font-size: 18px;
  font-weight: 600;
  color: #947358;
  margin-right: 15px;
}

.search-count {
  color: #666;
  font-size: 14px;
}

/* 搜索类型切换 */
.search-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  overflow: hidden;
}

.tab-item {
  flex: 1;
  padding: 15px 20px;
  cursor: pointer;
  text-align: center;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.tab-item:hover {
  background: #f8f9fa;
}

.tab-item.active {
  color: #947358;
  border-bottom-color: #947358;
  background: #f5f2ef;
}

.tab-name {
  font-weight: 500;
}

.tab-count {
  font-size: 12px;
  color: #999;
}

.tab-item.active .tab-count {
  color: #947358;
}

/* 结果容器 */
.results-container {
  min-height: 400px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
  font-size: 16px;
  gap: 10px;
}

.loading i {
  font-size: 20px;
}

/* 全部结果 */
.result-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  overflow: hidden;
}

.result-section .section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.result-section .section-title h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.more-link {
  color: #947358;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s;
}

.more-link:hover {
  color: #704C35;
}

/* 书籍结果 */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.book-item {
  display: flex;
  cursor: pointer;
  transition: all 0.3s;
  padding: 15px;
  border-radius: 8px;
}

.book-item:hover {
  background: #f5f2ef;
  transform: translateY(-2px);
}

.book-cover {
  width: 60px;
  height: 84px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.book-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 帖子结果 */
.post-list {
  padding: 0;
}

.post-item {
  padding: 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.post-item:last-child {
  border-bottom: none;
}

.post-item:hover {
  background: #f5f2ef;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.post-header .user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-content {
  margin-left: 44px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 圈子结果 */
.circle-list {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.circle-item {
  display: flex;
  cursor: pointer;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s;
}

.circle-item:hover {
  background: #f5f2ef;
  transform: translateY(-2px);
}

.circle-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.circle-info {
  flex: 1;
}

.circle-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.circle-meta {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.circle-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 用户结果 */
.user-list {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.user-item {
  display: flex;
  cursor: pointer;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s;
}

.user-item:hover {
  background: #f5f2ef;
  transform: translateY(-2px);
}

.user-item .user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.user-motto {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 30px 20px;
}

.load-more-btn {
  background: white;
  color: #947358;
  border: 1px solid #947358;
  padding: 12px 30px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.load-more-btn:hover:not(:disabled) {
  background: #947358;
  color: white;
}

.load-more-btn:disabled {
  background: #f5f5f5;
  color: #c0c4cc;
  border-color: #e0e0e0;
  cursor: not-allowed;
}

/* 无结果 */
.no-results {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results-text h3 {
  font-size: 18px;
  margin: 0 0 10px 0;
  color: #666;
}

.no-results-text p {
  font-size: 14px;
  margin: 0;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container {
    padding: 0 15px;
    flex-direction: column;
    gap: 15px;
  }
  
  .search-box {
    max-width: none;
  }
  
  .search-content {
    padding: 20px 15px;
  }
  
  .search-tabs {
    flex-direction: column;
  }
  
  .tab-item {
    border-bottom: 1px solid #f0f0f0;
    border-right: none;
  }
  
  .book-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
  
  .circle-list,
  .user-list {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
  
  .post-content {
    margin-left: 0;
  }
  
  .tag-list {
    gap: 8px;
  }
  
  .tag-item {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>