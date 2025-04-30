<template>
  <div class="outer">
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <nuxt-link to="/" class="logo">
            <img src="~/assets/images/logo.png" alt="原木社区" class="logo-img">
            <span class="logo-text">原木社区</span>
          </nuxt-link>
        </div>
        <div class="navbar-center">
          <nuxt-link to="/read" class="nav-link" exact-active-class="nav-link-active">阅读</nuxt-link>
          <nuxt-link to="/write" class="nav-link" exact-active-class="nav-link-active">写作</nuxt-link>
          <nuxt-link to="/community" class="nav-link" exact-active-class="nav-link-active">社区</nuxt-link>
        </div>
        <div class="navbar-right">
          <div class="search-box">
            <input type="text" placeholder="搜索小说、作者..." class="search-input">
            <button class="search-btn">搜索</button>
          </div>
          
          <!-- 未登录状态 -->
          <div class="user-actions" v-if="!isLogin">
            <nuxt-link to="/login" class="user-link">登录</nuxt-link>
          </div>
          
          <!-- 已登录状态 -->
          <div class="user-actions" v-else>
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="user-profile">
                <img 
                  :src="userInfo && userInfo.avatar_url ? userInfo.avatar_url : '/default-avatar.png'" 
                  class="user-avatar"
                >
                <span class="user-nickname">{{ userInfo ? userInfo.name || '用户' : '用户' }}</span>
                <i class="el-icon-arrow-down"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="myworks">我的作品</el-dropdown-item>
                <el-dropdown-item command="bookcase">我的书架</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <nuxt />
    </main>
    <footer class="site-footer">
      <div class="footer-container">
        <p>© 2023 原木社区 版权所有</p>
      </div>
    </footer>
    
    <!-- 添加窗口管理器 -->
    <WindowManager />
  </div>
</template>

<script>
import WindowManager from '~/components/WindowManager.vue'

export default {
  components: {
    WindowManager
  },
  data() {
    return {
      isLogin: false,
      userInfo: null,
      checkTimer: null
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
      switch(command) {
        case 'profile':
          this.$router.push('/me');
          break;
        case 'myworks':
          this.$router.push('/user/works');
          break;
        case 'bookcase':
          this.$router.push('/user/bookcase');
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
      this.$message.success('已退出登录');
      this.$router.push('/');
    }
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.navbar-left, .navbar-center, .navbar-right {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #947358;
}

.nav-link {
  margin: 0 15px;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
  position: relative;
  padding: 10px 0;
}

.nav-link:hover {
  color: #947358;
  text-decoration: none;
}

.nav-link-active {
  color: #947358;
  font-weight: 600;
}

.nav-link-active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #947358;
}

.search-box {
  display: flex;
  margin-right: 20px;
}

.search-input {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  width: 200px;
}

.search-btn {
  background-color: #947358;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 8px 15px;
  cursor: pointer;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-link {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.user-link:hover {
  color: #947358;
  text-decoration: none;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-profile:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}

.user-nickname {
  font-size: 14px;
  color: #333;
  margin-right: 5px;
}

.divider {
  margin: 0 10px;
  color: #ddd;
}

.main-content {
  margin-top: 80px;
  padding: 20px;
  min-height: calc(100vh - 143px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.site-footer {
  background-color: #947358;
  color: #fff;
  padding: 20px 0;
  text-align: center;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
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
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
