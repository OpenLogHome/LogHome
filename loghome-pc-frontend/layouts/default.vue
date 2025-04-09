<template>
  <div>
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
          <div class="user-actions">
            <nuxt-link to="/login" class="user-link">登录</nuxt-link>
            <span class="divider">|</span>
            <nuxt-link to="/register" class="user-link">注册</nuxt-link>
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
  </div>
</template>

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

.divider {
  margin: 0 10px;
  color: #ddd;
}

.main-content {
  margin-top: 80px;
  padding: 20px;
  min-height: calc(100vh - 140px);
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
