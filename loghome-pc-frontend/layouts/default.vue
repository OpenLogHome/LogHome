<template>
  <div class="outer" :class="{ 'home-layout': $route.path === '/' || $route.path === '/about/open-source', 'reading-layout': isReadingRoute, 'social-layout': isSocialRoute }">
    <a v-if="$route.path === '/'" class="home-skip-link" href="#home-main">{{ $t(copy.accessibility.skipHome) }}</a>
    <a v-if="isReadingRoute" class="reading-skip-link" href="#reading-main">{{ $t(copy.accessibility.skipReading) }}</a>
    <MobileDownloadButton />
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <nuxt-link to="/" class="logo">
            <img src="~/static/logo_new.png" :alt="$t(copy.brand)" class="logo-img">
          </nuxt-link>
        </div>
        <div class="navbar-center">
          <nuxt-link to="/read" class="nav-link" :class="{ 'nav-link-active': isReadingRoute }" exact-active-class="nav-link-active">{{ $t(copy.nav.read) }}</nuxt-link>
          <nuxt-link to="/write" class="nav-link" :class="{ 'nav-link-active': isWritingRoute }" exact-active-class="nav-link-active">{{ $t(copy.nav.write) }}</nuxt-link>
          <nuxt-link to="/community" class="nav-link" :class="{ 'nav-link-active': $route.path.startsWith('/community') }" exact-active-class="nav-link-active">{{ $t(copy.nav.community) }}</nuxt-link>
        </div>
        <div class="navbar-right">
          <div class="search-box" :class="{ 'active': isSearchFocused }">
            <i class="el-icon-search search-icon"></i>
            <input type="text" :placeholder="$t(copy.search.placeholder)" class="search-input" v-model="searchKeyword" @input="onSearchInput"
              @focus="onSearchFocus" @blur="onSearchBlur" @keyup.enter="handleSearch" ref="searchInput">
            <i v-if="searchKeyword" class="el-icon-close search-clear" @click="clearKeyword"></i>
          </div>

          <!-- 搜索结果下拉框 -->
          <div class="search-dropdown" v-show="showSearchDropdown">
            <!-- 搜索历史 -->
            <div class="search-section" v-if="searchHistory.length > 0 && !searchKeyword">
              <div class="section-header">
                <span class="section-title">{{ $t(copy.search.history) }}</span>
                <button class="clear-btn" @click="clearSearchHistory">
                  <i class="el-icon-delete"></i>
                </button>
              </div>
              <div class="history-list">
                <div class="history-item" v-for="(item, index) in searchHistory" :key="'history-' + index"
                  @click="searchWithKeyword(item)">
                  <i class="el-icon-time"></i>
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- 热门搜索 -->
            <div class="search-section" v-if="hotSearches.length > 0 && !searchKeyword">
              <div class="section-header">
                <span class="section-title">{{ $t(copy.search.hot) }}</span>
              </div>
              <div class="hot-list">
                <span class="hot-item" v-for="(item, index) in hotSearches" :key="'hot-' + index"
                  @click="searchWithKeyword(item.keyword)">
                  {{ item.keyword }}
                </span>
              </div>
            </div>

            <!-- 搜索结果 -->
            <div class="search-results"
              v-if="searchKeyword && (searchResults.books.length > 0 || searchResults.posts.length > 0 || searchResults.circles.length > 0 || searchResults.users.length > 0)">
              <!-- 书籍结果 -->
              <div class="result-section" v-if="searchResults.books.length > 0">
                <div class="section-header">
                  <span class="section-title">{{ $t(copy.search.books) }}</span>
                  <span class="view-all" @click="viewAllResults('books')">{{ $t(copy.search.viewAll) }}</span>
                </div>
                <div class="book-results">
                  <div class="book-item" v-for="(book, index) in searchResults.books.slice(0, 3)" :key="'book-' + index"
                    @click="navigateToBook(book.novel_id, book.novel_type)">
                    <img class="book-cover" :src="book.picUrl + '?thumbnail=1'" :alt="book.name">
                    <div class="book-info">
                      <div class="book-title">{{ book.name }}</div>
                      <div class="book-author">{{ book.author_name }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 帖子结果 -->
              <div class="result-section" v-if="searchResults.posts.length > 0">
                <div class="section-header">
                  <span class="section-title">{{ $t(copy.search.posts) }}</span>
                  <span class="view-all" @click="viewAllResults('posts')">{{ $t(copy.search.viewAll) }}</span>
                </div>
                <div class="post-results">
                  <div class="post-item" v-for="(post, index) in searchResults.posts.slice(0, 3)" :key="'post-' + index"
                    @click="navigateToPost(post.post_id)">
                    <div class="post-title">{{ post.title }}</div>
                    <div class="post-meta">
                      <span class="post-author">{{ post.author_name }}</span>
                      <span class="post-time">{{ formatTime(post.create_time) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 圈子结果 -->
              <div class="result-section" v-if="searchResults.circles.length > 0">
                <div class="section-header">
                  <span class="section-title">{{ $t(copy.search.circles) }}</span>
                  <span class="view-all" @click="viewAllResults('circles')">{{ $t(copy.search.viewAll) }}</span>
                </div>
                <div class="circle-results">
                  <div class="circle-item" v-for="(circle, index) in searchResults.circles.slice(0, 3)"
                    :key="'circle-' + index" @click="navigateToCircle(circle.circle_id)">
                    <img class="circle-icon" :src="circle.icon || '/default-avatar.png'" :alt="circle.name">
                    <div class="circle-info">
                      <div class="circle-name">{{ circle.name }}</div>
                      <div class="circle-meta">{{ $t(copy.search.memberCount, { count: circle.member_count || 0 }) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 用户结果 -->
              <div class="result-section" v-if="searchResults.users.length > 0">
                <div class="section-header">
                  <span class="section-title">{{ $t(copy.search.users) }}</span>
                  <span class="view-all" @click="viewAllResults('users')">{{ $t(copy.search.viewAll) }}</span>
                </div>
                <div class="user-results">
                  <div class="user-item" v-for="(user, index) in searchResults.users.slice(0, 3)" :key="'user-' + index"
                    @click="navigateToUser(user.user_id)">
                    <img class="user-avatar" :src="user.avatar_url || '/default-avatar.png'" :alt="user.name">
                    <div class="user-info">
                      <div class="user-name">{{ user.name || copy.account.anonymous }}</div>
                      <div class="user-motto">{{ user.motto || copy.account.mottoFallback }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 无搜索结果 -->
            <div class="no-results" v-if="searchKeyword && noResults">
              <div class="no-results-icon">
                <i class="el-icon-search"></i>
              </div>
              <div class="no-results-text">
                {{ $t(copy.search.empty) }}
              </div>
              <div class="search-all-btn" @click="searchInPage">
                {{ $t(copy.search.allResults) }}
              </div>
            </div>
          </div>

          <GlobalThemeSwitch />

          <!-- 未登录状态 -->
          <div class="user-actions" v-if="!isLogin">
            <nuxt-link to="/login" class="user-link">{{ $t(copy.account.login) }}</nuxt-link>
          </div>

          <!-- 已登录状态 -->
          <div class="user-actions" v-else>
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="user-profile">
                <img :src="userInfo && userInfo.avatar_url ? userInfo.avatar_url : '/default-avatar.png'"
                  class="user-avatar">
                <span class="user-nickname">{{ userInfo ? userInfo.name || copy.account.nameFallback : copy.account.nameFallback }}</span>
                <i class="el-icon-arrow-down"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">{{ $t(copy.account.profile) }}</el-dropdown-item>
                <el-dropdown-item command="myworks">{{ $t(copy.account.works) }}</el-dropdown-item>
                <el-dropdown-item command="bookcase">{{ $t(copy.account.bookcase) }}</el-dropdown-item>
                <el-dropdown-item divided command="logout">{{ $t(copy.account.logout) }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content" :id="isReadingRoute ? 'reading-main' : $route.path === '/' ? 'home-main' : undefined" :tabindex="isReadingRoute || $route.path === '/' ? -1 : undefined">
      <nuxt />
    </main>
    <footer class="site-footer">
      <div class="footer-container">
        <p style="display: flex; justify-content: center; margin-bottom: 5px;">
          <a href="https://beian.miit.gov.cn/" target="_blank" style="color:var(--site-footer-link, #FFEFD6); margin-right: 30px;">{{ copy.footer.icp }}</a><br>
          <a href="https://beian.mps.gov.cn/" target="_blank" style="color:var(--site-footer-link, #FFEFD6); margin-right: 30px;">{{ copy.footer.publicSecurity }}</a><br>
          <nuxt-link to="/about/open-source" style="color:var(--site-footer-link, #FFEFD6)">{{ $t(copy.footer.openSource) }}</nuxt-link>
        </p>
        <p style="margin-bottom: 5px;">{{ $t(copy.footer.disclaimer) }}</p>
        <p>{{ $t(copy.footer.copyright, { year: new Date().getFullYear() }) }}</p>
      </div>
    </footer>

    <!-- 添加窗口管理器 -->
    <WindowManager />
    <client-only><ReaderAudioPlayer /></client-only>
  </div>
</template>

<script>
import copy from '~/config/site-copy.json'
import { formatCopy } from '~/utils/format-copy'
import { workUrl } from '~/utils/reading-discovery'
import MobileDownloadButton from '~/components/MobileDownloadButton.vue'
import GlobalThemeSwitch from '~/components/GlobalThemeSwitch.vue'
import WindowManager from '~/components/WindowManager.vue'
import ReaderAudioPlayer from '~/components/read/ReaderAudioPlayer.vue'

export default {
  name: 'default',
  components: {
    GlobalThemeSwitch,
    WindowManager, ReaderAudioPlayer, MobileDownloadButton
  },
  data() {
    return {
      copy,
      isLogin: false,
      userInfo: null,
      checkTimer: null,
      // 搜索相关数据
      searchKeyword: '',
      isSearchFocused: false,
      showSearchDropdown: false,
      searchHistory: [],
      hotSearches: [],
      searchResults: {
        circles: [],
        posts: [],
        users: [],
        books: []
      },
      isSearching: false,
      searchTimer: null
    }
  },
  computed: {
    isSocialRoute() {
      return /^\/(community|me|membership|store)(\/|$)/.test(this.$route.path)
    },
    isReadingRoute() {
      return /^\/(read|novel|article|manga|world|tags|tag)(\/|$)/.test(this.$route.path)
    },
    isWritingRoute() {
      return /^\/write(\/|$)/.test(this.$route.path)
    },
    noResults() {
      if (!this.searchKeyword) return false
      const { circles, posts, users, books } = this.searchResults
      return circles.length === 0 && posts.length === 0 && users.length === 0 && books.length === 0
    }
  },
  mounted() {
    // 客户端才执行
    if (process.client) {

      this.checkLoginStatus();

      // 定期检查登录状态
      this.checkTimer = setInterval(() => {
        this.checkLoginStatus();
      }, 5000);

      // 监听localStorage变化
      window.addEventListener('storage', this.onStorageChange);

      // 监听登录状态变化的自定义事件
      window.addEventListener('auth-state-changed', this.checkLoginStatus);

      // 初始化搜索相关数据
      this.loadSearchHistory();
      this.getHotSearches();
    }
  },
  beforeDestroy() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }

    if (process.client) {
      window.removeEventListener('storage', this.onStorageChange);
      window.removeEventListener('auth-state-changed', this.checkLoginStatus);
    }
  },
  methods: {
    formatCopy,
    // 从localStorage中检查登录状态
    checkLoginStatus() {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          this.isLogin = true;

          // 如果没有用户信息，先尝试从本地缓存获取
          if (!this.userInfo) {
            const cachedUserInfo = localStorage.getItem('LogHomeUserInfo');
            if (cachedUserInfo) {
              this.userInfo = JSON.parse(cachedUserInfo);
              console.log('从本地缓存加载用户信息');
            } else {
              this.fetchUserInfo();
            }
          }
        } else {
          this.isLogin = false;
          this.userInfo = null;
        }
      } catch (e) {
        console.error("检查登录状态错误", e);
      }
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        // 使用API服务获取用户信息
        this.userInfo = await this.$api.users.getUserProfile();
      } catch (error) {
        console.error('获取用户信息失败:', error);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          this.isLogin = false;
          this.userInfo = null;
        }
      }
    },

    // 监听localStorage变化
    onStorageChange(event) {
      if (event.key === 'token') {
        this.checkLoginStatus();
      }
    },

    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/me');
          break;
        case 'myworks':
          this.$router.push('/write');
          break;
        case 'bookcase':
          this.$router.push('/me');
          break;
        case 'logout':
          this.logout();
          break;
      }
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('LogHomeUserInfo');
      this.isLogin = false;
      this.userInfo = null;
      this.$message.success(this.copy.account.logoutSuccess);
      this.$router.push('/');
    },

    // 搜索相关方法
    onSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        if (this.searchKeyword.trim()) {
          this.search()
        }
      }, 300)
    },

    onSearchFocus() {
      this.isSearchFocused = true
      this.showSearchDropdown = true
      this.loadSearchHistory()
      this.getHotSearches()
    },

    onSearchBlur() {
      // 延迟隐藏，以便点击下拉框中的选项
      setTimeout(() => {
        this.isSearchFocused = false
        this.showSearchDropdown = false
      }, 200)
    },

    clearKeyword() {
      this.searchKeyword = ''
      this.showSearchDropdown = false
    },

    handleSearch() {
      if (!this.searchKeyword.trim()) return
      this.saveSearchHistory(this.searchKeyword.trim())
      this.$router.push({
        path: '/search',
        query: { keyword: this.searchKeyword.trim() }
      })
      this.showSearchDropdown = false
    },

    searchWithKeyword(keyword) {
      this.searchKeyword = keyword
      this.saveSearchHistory(keyword)
      this.$router.push({
        path: '/search',
        query: { keyword: keyword }
      })
      this.showSearchDropdown = false
    },

    switchSearchType(type) {
      this.searchType = type
      if (this.hasSearched) {
        this.search()
      }
    },

    async search() {
      if (this.isSearching || !this.searchKeyword.trim()) return

      this.isSearching = true

      try {
        // 搜索所有类型，但只获取少量结果用于预览
        await Promise.all([
          this.searchBooks(),
          this.searchPosts(),
          this.searchCircles(),
          this.searchUsers()
        ])
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        this.isSearching = false
      }
    },

    async searchBooks() {
      try {
        const result = await this.$api.search.searchNovels({
          keyword: this.searchKeyword,
          page: 1,
          limit: 3
        })
        this.searchResults.books = result.list || []
      } catch (error) {
        console.error('搜索书籍失败:', error)
        this.searchResults.books = []
      }
    },

    async searchPosts() {
      try {
        const result = await this.$api.search.searchPosts({
          keyword: this.searchKeyword,
          page: 1,
          limit: 3
        })
        this.searchResults.posts = result.list || []
      } catch (error) {
        console.error('搜索帖子失败:', error)
        this.searchResults.posts = []
      }
    },

    async searchCircles() {
      try {
        const result = await this.$api.search.searchCircles({
          keyword: this.searchKeyword,
          page: 1,
          limit: 3
        })
        this.searchResults.circles = result.list || []
      } catch (error) {
        console.error('搜索圈子失败:', error)
        this.searchResults.circles = []
      }
    },

    async searchUsers() {
      try {
        const result = await this.$api.search.searchUsers({
          keyword: this.searchKeyword,
          page: 1,
          limit: 3
        })
        this.searchResults.users = result.list || []
      } catch (error) {
        console.error('搜索用户失败:', error)
        this.searchResults.users = []
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
    },

    async getHotSearches() {
      try {
        this.hotSearches = await this.$api.search.getHotSearches()
      } catch (error) {
        console.error('获取热门搜索失败:', error)
        // 设置默认热门搜索
        this.hotSearches = this.copy.search.fallbackKeywords.map(keyword => ({ keyword }))
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 60000) {
        return this.copy.time.justNow
      } else if (diff < 3600000) {
        return formatCopy(this.copy.time.minutesAgo, { count: Math.floor(diff / 60000) })
      } else if (diff < 86400000) {
        return formatCopy(this.copy.time.hoursAgo, { count: Math.floor(diff / 3600000) })
      } else {
        return formatCopy(this.copy.time.daysAgo, { count: Math.floor(diff / 86400000) })
      }
    },

    // 查看全部结果
    viewAllResults(type) {
      this.$router.push({
        path: '/search',
        query: {
          keyword: this.searchKeyword,
          type: type
        }
      })
      this.showSearchDropdown = false
    },

    // 在搜索页面中查看
    searchInPage() {
      this.$router.push({
        path: '/search',
        query: { keyword: this.searchKeyword }
      })
      this.showSearchDropdown = false
    },

    // 导航方法
    navigateToBook(novelId, novelType) {
      this.$router.push(workUrl({ novel_id: novelId, novel_type: novelType }))
      this.showSearchDropdown = false
    },

    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`)
      this.showSearchDropdown = false
    },

    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`)
      this.showSearchDropdown = false
    },

    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`)
      this.showSearchDropdown = false
    }
  }
}
</script>

<style scoped>
/* 全局样式已移至 assets/css/global.css */

.outer {
  --site-header-height: 60px;
}

.navbar {
  background: var(--site-surface, #ffffff);
  color: var(--site-ink, #382d25);
  box-shadow: 0 1px 0 var(--site-line, #e9e0d5);
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  word-spacing: normal;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 32px;
  align-items: center;
  padding: 0 28px;
  height: var(--site-header-height);
}

.navbar-left,
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-left,
.navbar-center {
  flex: none;
}
.navbar-center {
  gap: 28px;
  justify-content: center;
}
.navbar-right {
  position: relative;
  flex: 1;
  width: max-content;
  min-width: 0;
  justify-content: flex-end;
  gap: 12px;
  margin-right: 144px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 36px;
  display: block;
}

.logo-text {
  height: 36px;
  transform: translateY(1px);
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #947358;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  height: 44px;
  margin: 0;
  font-size: 15px;
  color: var(--site-muted, #776a5d);
  text-decoration: none;
  transition: color 0.3s;
  position: relative;
  padding: 0;
  white-space: nowrap;
  line-height: 22px;
}

.nav-link:hover {
  color: var(--site-accent, #79573d);
  text-decoration: none;
}

.nav-link-active {
  color: var(--site-accent, #79573d);
  font-weight: 600;
}

.nav-link-active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--site-accent, #79573d);
}
.navbar :is(a, button):focus-visible {
  outline: 2px solid var(--site-accent, #79573d);
  outline-offset: 3px;
}

/* 搜索框样式 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  width: 280px;
  min-width: 100px;
  max-width: 280px;
  height: 40px;
  background: var(--site-raised, #f2eee7);
  border: 1px solid transparent;
  border-radius: 20px;
  padding: 0 14px;
  transition: border-color 0.2s, background-color 0.2s;
}

.search-box.active {
  background: var(--site-surface, #fffdf9);
  border-color: var(--site-accent, #79573d);
}

.search-icon {
  color: var(--site-muted, #776a5d);
  font-size: 16px;
  margin-right: 8px;
  flex: none;
}

.search-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  height: 100%;
  font: inherit;
  font-size: 14px;
  color: var(--site-ink, #382d25);
}

.search-input::placeholder {
  color: var(--site-muted, #776a5d);
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

/* 搜索下拉框 */
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 500px;
  overflow-y: auto;
  margin-top: 5px;
}

.search-section {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.search-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  transition: color 0.3s;
}

.clear-btn:hover {
  color: #666;
}

.view-all {
  color: #947358;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.3s;
}

.view-all:hover {
  color: #704C35;
}

/* 搜索历史 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #666;
  font-size: 14px;
}

.history-item:hover {
  background: #f5f2ef;
}

.history-item i {
  margin-right: 8px;
  font-size: 12px;
}

/* 热门搜索 */
.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-item {
  background: #f5f2ef;
  color: #947358;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e6d8cf;
}

.hot-item:hover {
  background: #947358;
  color: white;
}

/* 搜索结果 */
.result-section {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.result-section:last-child {
  border-bottom: none;
}

/* 书籍结果 */
.book-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-item {
  display: flex;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.book-item:hover {
  background: #f5f2ef;
}

.book-cover {
  width: 40px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 12px;
  color: #666;
}

/* 帖子结果 */
.post-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.post-item:hover {
  background: #f5f2ef;
}

.post-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

/* 圈子结果 */
.circle-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.circle-item {
  display: flex;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.circle-item:hover {
  background: #f5f2ef;
}

.circle-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.circle-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.circle-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.circle-meta {
  font-size: 12px;
  color: #666;
}

/* 用户结果 */
.user-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-item:hover {
  background: #f8f9fa;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.user-motto {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 无结果 */
.no-results {
  text-align: center;
  padding: 30px 20px;
  color: #999;
}

.no-results-icon {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.no-results-text {
  font-size: 14px;
  margin-bottom: 15px;
}

.search-all-btn {
  background: #947358;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.search-all-btn:hover {
  background: #704C35;
}

.user-actions {
  display: flex;
  align-items: center;
  flex: none;
  font-size: 14px;
}

.user-link {
  color: var(--site-ink, #382d25);
  text-decoration: none;
  transition: color 0.3s;
}

.user-link:hover {
  color: var(--site-accent, #79573d);
  text-decoration: none;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  height: 40px;
  color: var(--site-muted, #776a5d);
  transition: background-color 0.3s;
}

.user-profile:hover {
  background: var(--site-raised, #f2eee7);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}

.navbar-right > .global-theme-switch { margin: 0; }

.user-nickname {
  font-size: 14px;
  color: var(--site-ink, #382d25);
  margin-right: 5px;
  max-width: 96px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.divider {
  margin: 0 10px;
  color: #ddd;
}

.social-layout{display:flow-root;min-height:100dvh;background:#f7f8fa;--site-footer-link:#c65320}.social-layout .main-content { max-width: 1440px; padding: 0; }
.social-layout .site-footer { background: #ffffff; color: #6b7280; }

.main-content {
  margin-top: calc(var(--site-header-height) + 20px);
  padding: 20px;
  min-height: calc(100vh - 143px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.home-layout {
  display: flow-root;
  min-height: 100vh;
  background: #f7f8fa;
  --site-footer-link: #c65320;
}

.site-footer { padding-top: 28px; }
.site-footer .footer-container { text-align: center; }
.home-layout .site-footer { background: #eef0f3; color: #6b7280; }
.home-skip-link { position: fixed; top: 8px; left: 20px; z-index: 1200; padding: 10px 18px; background: #c65320; color: #ffffff; border-radius: 6px; transform: translateY(-160%); }
.home-skip-link:focus { transform: translateY(0); }

.home-layout .main-content {
  max-width: 1320px;
  padding: 20px 50px;
}

@media (max-width: 1050px) {
  .home-layout .main-content { padding: 20px 28px; }
}

/* One responsive header for reading, writing and community. */
@media (max-width: 1100px) {
  .outer { --site-header-height: 112px; }
  .navbar-container {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: 42px 40px;
    gap: 10px 24px;
    padding: 10px 172px 10px 28px;
  }
  .navbar-center .nav-link { height: 40px; }
  .navbar-right { grid-column: 1 / -1; width: 100%; margin-right: 0; }
  .navbar-right .search-box { max-width: none; }
}
@media (max-width: 600px) {
  .outer { --site-header-height: 154px; }
  .navbar-container {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 42px 32px 40px;
    gap: 10px;
    padding: 10px 16px;
  }
  .navbar-left { padding-right: 144px; }
  .logo-img { height: 28px; max-width: 100%; object-fit: contain; }
  .navbar-center { gap: 28px; }
  .navbar-center .nav-link { height: 32px; font-size: 14px; }
  .navbar-right { gap: 8px; }
  .user-nickname { max-width: 64px; }
  .home-layout .main-content { padding: 16px 20px; }
}


.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #947358;
  color: #947358;
  text-decoration: none;
  padding: 10px 30px;
}

a {
  color: #947358;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.button--green:hover {
  color: #fff;
  background-color: #947358;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #704C35;
  color: #704C35;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #704C35;
}
/* Page surfaces keep their own theme; navigation uses the global tokens above. */
@media (prefers-color-scheme: dark) {
  .social-layout { background: #211e19; color: #eee5d9; }
  .social-layout .footer { background: #29251f; color: #c4b6a5; }
}
html[data-social-theme="light"] .social-layout { background: #f7f8fa; color: #30343b; }
html[data-social-theme="light"] .social-layout .footer { background: #ffffff; color: #6b7280; border-color: #e2e6eb; }
html[data-social-theme="dark"] .social-layout { background: #211e19; color: #eee5d9; }
html[data-social-theme="dark"] .social-layout .footer { background: #29251f; color: #c4b6a5; border-color: #504536; }
</style>
