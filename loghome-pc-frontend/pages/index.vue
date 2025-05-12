<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">欢迎来到 原木社区</h1>
      <p class="hero-subtitle">方块跃然纸上，故事在此生长。</p>
      <div class="hero-buttons">
        <nuxt-link to="/read" class="hero-button primary">开始阅读</nuxt-link>
        <nuxt-link to="/write" class="hero-button secondary">开始创作</nuxt-link>
      </div>
      <div class="links">
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
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import WindowOpenButton from '~/components/WindowOpenButton.vue'

export default {
  components: {
    Logo,
    WindowOpenButton
  },
};
</script>

<style lang="scss">
// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;
$orange-color: #FB7D46;
$orange-dark: #fa6c2e;

// 混合器
@mixin flex-center {
  display: flex;
  justify-content: center;
}

@mixin button-base {
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

@mixin card-hover {
  transform: translateY(-10px);
}

.home-container {
  width: 100%;
  
  .hero-section {
    text-align: center;
    padding: 60px 20px;
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
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
    @include flex-center;
    gap: 20px;
  }

  .hero-button {
    @include button-base;
    
    &.primary {
      background-color: $orange-color;
      color: #fff;
      
      &:hover {
        background-color: $orange-dark;
        transform: translateY(-2px);
      }
    }
    
    &.secondary {
      background-color: transparent;
      border: 2px solid white;
      color: white;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }
    }
  }

  .section-title {
    font-size: 32px;
    text-align: center;
    margin-bottom: 60px;
    color: $secondary-color;
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
    
    &:hover {
      @include card-hover;
    }
  }

  .feature-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .feature-title {
    font-size: 24px;
    margin-bottom: 15px;
    color: $primary-color;
  }

  .feature-desc {
    color: $text-light;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .feature-link {
    display: inline-block;
    color: $primary-color;
    font-weight: 600;
    text-decoration: none;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: $primary-color;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    &:hover:after {
      transform: scaleX(1);
    }
  }

  .trending-section {
    padding: 40px 20px;
    background-color: $border-light;
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
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
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
    color: $secondary-color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .novel-author {
    color: $text-light;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .novel-stats {
    display: flex;
    justify-content: space-between;
    color: $text-lighter;
    font-size: 14px;
  }

  .view-more {
    text-align: center;
    margin-top: 40px;
  }

  .view-more-link {
    display: inline-block;
    background-color: $orange-color;
    color: white;
    padding: 10px 25px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: $orange-dark;
    }
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
}
</style>
