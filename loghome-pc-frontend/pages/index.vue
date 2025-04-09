<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">欢迎来到小说阅读社区</h1>
      <p class="hero-subtitle">这里是文学爱好者的天堂，阅读、创作、交流的绝佳平台</p>
      <div class="hero-buttons">
        <nuxt-link to="/read" class="hero-button primary">开始阅读</nuxt-link>
        <nuxt-link to="/write" class="hero-button secondary">开始创作</nuxt-link>
      </div>
    </div>

    <div class="features-section">
      <h2 class="section-title">平台功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3 class="feature-title">海量小说阅读</h3>
          <p class="feature-desc">各类题材应有尽有，随时随地畅享阅读</p>
          <nuxt-link to="/read" class="feature-link">去看看</nuxt-link>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✍️</div>
          <h3 class="feature-title">创作中心</h3>
          <p class="feature-desc">提供专业写作工具，让创作更加轻松</p>
          <nuxt-link to="/write" class="feature-link">去创作</nuxt-link>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3 class="feature-title">活跃社区</h3>
          <p class="feature-desc">与作者读者互动，分享阅读心得</p>
          <nuxt-link to="/community" class="feature-link">去交流</nuxt-link>
        </div>
      </div>
    </div>

    <div class="trending-section">
      <h2 class="section-title">热门推荐</h2>
      <div class="novel-grid">
        <div class="novel-card" v-for="i in 6" :key="i">
          <div class="novel-cover" :style="`background-color: hsl(${i * 60}, 70%, 80%)`">
            <span class="novel-category">{{['奇幻', '科幻', '言情', '悬疑', '历史', '武侠'][i-1]}}</span>
          </div>
          <div class="novel-info">
            <h3 class="novel-title">示例小说标题 {{i}}</h3>
            <p class="novel-author">作者名称</p>
            <p class="novel-stats">
              <span>👁️ 1.2万</span>
              <span>⭐ 4.8</span>
            </p>
          </div>
        </div>
      </div>
      <div class="view-more">
        <nuxt-link to="/read" class="view-more-link">查看更多小说</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';

export default {
  components: {
    Logo,
  },
};
</script>

<style>
.home-container {
  width: 100%;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #947358 0%, #704C35 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 30px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.hero-button {
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.hero-button.primary {
  background-color: #FB7D46;
  color: #fff;
}

.hero-button.primary:hover {
  background-color: #fa6c2e;
  transform: translateY(-2px);
}

.hero-button.secondary {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.hero-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.section-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 40px;
  color: #704C35;
}

.features-section {
  padding: 40px 20px;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 24px;
  margin-bottom: 15px;
  color: #947358;
}

.feature-desc {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.feature-link {
  display: inline-block;
  color: #947358;
  font-weight: 600;
  text-decoration: none;
  position: relative;
}

.feature-link:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #947358;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-link:hover:after {
  transform: scaleX(1);
}

.trending-section {
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.novel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.novel-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.novel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.novel-cover {
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.novel-category {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.novel-info {
  padding: 15px;
}

.novel-title {
  font-size: 18px;
  margin-bottom: 5px;
  color: #704C35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.novel-author {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.novel-stats {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 14px;
}

.view-more {
  text-align: center;
  margin-top: 40px;
}

.view-more-link {
  display: inline-block;
  background-color: #FB7D46;
  color: white;
  padding: 10px 25px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.view-more-link:hover {
  background-color: #fa6c2e;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .features-grid, .novel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
