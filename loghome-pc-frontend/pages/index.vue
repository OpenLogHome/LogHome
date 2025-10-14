<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">
        <TypewriterText 
          static-text="在 原木社区，"
          :sentences="[
            '发现异世界故事',
            '创作无限可能', 
            '分享阅读乐趣',
            '与创作者连接',
            '探索方块世界',
            '找到游戏搭子'
          ]"
          :type-speed="120"
          :delete-speed="60"
          :pause-time="2500"
        />
      </h1>
      <p class="hero-subtitle">让方块跃然纸上，Minecraft 的故事在此生长</p>
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

    <div class="download-section">
      <h2 class="section-title">了解原木社区移动端</h2>
      <div class="download-container">
        <div class="download-info">
          <h3>随时随地享受阅读</h3>
          <p>下载原木社区手机版，让精彩故事伴你左右</p>
          <div class="download-buttons">
            <a 
              v-if="androidDownloadUrl" 
              :href="androidDownloadUrl" 
              class="download-btn android-btn"
              @click="handleAndroidDownload"
            >
              <img src="/icon_an.png" alt="Android">
              <span>下载安卓版</span>
              <small v-if="androidVersion">v{{ androidVersion }}</small>
            </a>
          </div>
        </div>
        <div class="download-preview">
          <img src="/1.png" alt="手机预览" class="phone-preview">
        </div>
      </div>
    </div>

    <div class="opensource-section">
      <h2 class="section-title">原木社区由 OpenLoghome 开源项目驱动</h2>
      <div class="opensource-container">
        <div class="opensource-hero">
          <h3 class="opensource-title">" 将社区的建设权，交还给所有人 "</h3>
          <div class="opensource-intro">
            <div class="intro-image">
              <img src="/图片1.png" alt="开源计划" class="intro-img">
            </div>
            <div class="intro-content">
              <p>亲爱的朋友，</p>
              <p>原木社区 是一款为 Minecraft 及其衍生文化爱好者打造的综合性文学作品平台，涵盖作品创作与阅读体验。自2021年下半年开始，我们已经持续稳定地运营了两年多时间。</p>
              <p>而在今天，2024年3月1日，我们将<strong>做一件大胆的事</strong>，这标志着原木社区进入新篇章，我们将一起奔跑、一起努力、一起见证、一起参与这个社区的成长与发展。</p>
            </div>
          </div>
        </div>

        <div class="opensource-content">
          <div class="content-block">
            <p>Minecraft 同人文学作品是一个小众但活跃的社群，我们在热爱Minecraft的同时也热爱文学，拥有独特的品味和风趣。</p>
            <p>原木社区自启动以来，已经积累了超<strong>200位用户</strong>，周活跃用户数达<strong>81人</strong>，这对于一个小众的群体来说难能可贵。</p>
            <p>但在社区蓬勃发展同时，我们<strong>一直面临着人力短缺的挑战</strong>。作为一个公益性社区，我们一直以来一直在努力维护开发、维护和运营的平衡。我们不仅投入资金和大量精力来维护服务器的运行，还积极收集用户反馈，并进行详尽的分析和实现。</p>
            <p>随着需求的增长和系统复杂度的提升，我们很难集中精力为原木社区引入新的大型功能，因此开发工作也逐渐停滞不前。</p>
            <p>然而，我们幸运地拥有一个活跃的用户社区。<strong>在深思熟虑之后，我们决定将社区建设的权利交给大家，启动《原木社区开源计划》。</strong></p>
            <p>在该计划下，原木社区现有的<strong>全部技术资产</strong>（包括前端和后端代码，但不包括用户数据）将全部以Mozilla公共许可证<a href="https://github.com/OpenLogHome" target="_blank">开源至GitHub</a>，并欢迎社区成员的贡献。每一行代码、每一个提交的问题、每一个报告的bug，甚至每一个提出的问题，都将对原木社区的发展产生重要影响。</p>
            <p>与此同时，我们将继续<strong>坚持推进原木社区的官方版本的运营工作</strong>。通过广告和原木充值等收入维持服务器的正常运行，保障大家熟悉的社区万古长青。</p>
          </div>

          <div class="participation-section">
            <div class="participation-image">
              <img src="/teamwork.png" alt="团队合作" class="teamwork-img">
            </div>
            <div class="participation-content">
              <p>无论是贡献代码、添加 API 文档、整理 bugs 和 issues、review 代码……</p>
              <p>原木社区 在方方面面都期待你的助力。</p>
              <p>你可以根据你自身的情况，选择以下的一项或者多项，参与到 原木社区 的开源项目中来：</p>
              <ul class="participation-list">
                <li>贡献代码</li>
                <li>建设 API 文档</li>
                <li>Review PR</li>
                <li>向有需要的人推荐 原木社区</li>
                <li>参与 原木社区 的群讨论</li>
              </ul>
              <p>…… 所有你能想到的让 原木社区 变得更好的事情</p>
            </div>
          </div>

          <div class="github-section">
            <div class="github-image">
              <img src="/github.png" alt="GitHub" class="github-img">
            </div>
            <div class="github-content">
              <p>我们的主要开源部分有：</p>
              <p><strong>loghome</strong>：包含 原木社区 的完整技术代码</p>
              <p><strong>loghome-testDb</strong>：包含用于社区功能测试的完整数据库</p>
              <p>你也可以在 <a href="https://github.com/OpenLogHome" target="_blank">这里</a> 找到更多的 原木社区 开源项目。</p>
              
              <div class="contribution-guide">
                <h4>代码贡献</h4>
                <p>对于代码贡献，我们需要你<strong>明确说明修改了哪些功能</strong>，并在贡献前<strong>确保业务功能经过测试</strong>。</p>
                <p>由于原木社区是一个前后端分离的项目，且还在线上运营，因此请<strong>尽少可能变动数据库的结构</strong>，以保障用户的数据安全。如果你增加了新的表或字段，也一定要<strong>明确说明</strong>。</p>
                
                <h4>API文档贡献</h4>
                <p>原木社区 的 API 文档使用 ApiDoc 创建。 API 文档直接撰写在后端项目代码行间，统一放在接口声明函数的前面。</p>
                <p>如果你在贡献中修改了API文档，请<strong>明确说明</strong>。</p>
              </div>
            </div>
          </div>

          <div class="community-section">
            <div class="community-image">
              <img src="/message.png" alt="社区交流" class="message-img">
            </div>
            <div class="community-content">
              <p>欢迎各位参与到原木社区活跃的开发中，在社群中碰撞出思想的火花。</p>
              <p><strong>QQ群：701928273</strong></p>
              <div class="join-buttons">
                <a href="https://github.com/OpenLogHome" target="_blank" class="join-btn github-btn">
                  访问 GitHub
                </a>
                <a href="tencent://groupwpa/?subcmd=all&param=7B2267726F757055696E223A3730313932383237332C2274696D655374616D70223A313733353030303030307D0A" class="join-btn qq-btn">
                  加入 QQ 群
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import WindowOpenButton from '~/components/WindowOpenButton.vue'
import TypewriterText from '~/components/TypewriterText.vue'

export default {
  components: {
    Logo,
    WindowOpenButton,
    TypewriterText
  },
  data() {
    return {
      androidVersion: '',
      androidDownloadUrl: '',
      isWeixin: false
    }
  },
  mounted() {
    this.checkUserAgent();
    this.getAppVersion();
  },
  methods: {
    checkUserAgent() {
      const ua = navigator.userAgent.toLowerCase();
      this.isWeixin = ua.indexOf('micromessenger') !== -1;
    },
    async getAppVersion() {
      try {
        const response = await fetch('https://loghomeService.codesocean.top/app/get_app_update');
        const data = await response.json();
        if (data && data[0]) {
          this.androidVersion = data[0].version;
          this.androidDownloadUrl = data[0].update_url;
        }
      } catch (error) {
        console.error('获取应用版本信息失败:', error);
      }
    },
    handleAndroidDownload(event) {
      if (this.isWeixin) {
        event.preventDefault();
        this.showWeixinTip();
      }
    },
    showWeixinTip() {
      alert('请在浏览器中打开此链接下载应用');
    }
  }
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
      line-height: 1.2;
    }
    
    .hero-subtitle {
      font-size: 18px;
    }
    
    .features-grid, .novel-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: 28px;
      line-height: 1.3;
    }
    
    .hero-subtitle {
      font-size: 16px;
    }
  }
}

  .download-section {
    padding: 20px 20px;
    margin-bottom: 40px;
  }

  .download-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .download-info {
    h3 {
      font-size: 28px;
      color: $secondary-color;
      margin-bottom: 15px;
    }

    p {
      font-size: 18px;
      color: $text-light;
      margin-bottom: 30px;
      line-height: 1.6;
    }
  }

  .download-buttons {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .download-btn {
    display: flex;
    align-items: center;
    padding: 15px 25px;
    background: white;
    border-radius: 12px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(204, 204, 210, 0.43);
    transition: all 0.3s ease;
    min-width: 180px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(204, 204, 210, 0.6);
    }

    img {
      width: 30px;
      height: 30px;
      margin-right: 12px;
    }

    span {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    small {
      font-size: 12px;
      color: $text-lighter;
      margin-left: 8px;
    }
  }

  .android-btn {
    &:hover {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      
      span, small {
        color: white;
      }
    }
  }

  .web-btn {
    &:hover {
      background: linear-gradient(135deg, $orange-color 0%, $orange-dark 100%);
      
      span {
        color: white;
      }
    }
  }

  .download-preview {
    text-align: center;
    position: relative;
  }

  .phone-preview {
    max-width: 300px;
    width: 100%;
    height: auto;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    .download-container {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }

    .download-buttons {
      justify-content: center;
    }

    .download-btn {
      min-width: 160px;
    }

    .phone-preview {
      max-width: 250px;
    }
  }

  // 开源计划板块样式
  .opensource-section {
    padding: 40px 20px;
    margin-bottom: 40px;
    background-color: $border-light;
    border-radius: 8px;
  }

  .opensource-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .opensource-hero {
    text-align: center;
    margin-bottom: 60px;
  }

  .opensource-title {
    font-size: 26px;
    color: $text-color;
    margin-bottom: 40px;
    font-weight: 600;
  }

  .opensource-intro {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 40px;
    align-items: flex-start;
    max-width: 900px;
    margin: 0 auto;
    text-align: left;
  }

  .intro-image {
    text-align: center;
  }

  .intro-img {
    max-width: 200px;
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .intro-content {
    p {
      margin-bottom: 20px;
      font-size: 15px;
      color: $text-color;
      line-height: 1.6;

      strong {
        font-weight: bold;
        color: #000;
      }
    }
  }

  .opensource-content {
    .content-block {
      margin-bottom: 60px;

      p {
        margin-bottom: 28px;
        font-size: 15px;
        color: $text-color;
        line-height: 1.6;

        strong {
          font-weight: bold;
          color: #000;
        }

        a {
          color: $orange-color;
          text-decoration: underline;

          &:hover {
            color: $orange-dark;
          }
        }
      }
    }
  }

  .participation-section {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 40px;
    align-items: center;
    margin-bottom: 60px;
  }

  .participation-image {
    text-align: center;
  }

  .teamwork-img {
    max-width: 150px;
    width: 100%;
    height: auto;
  }

  .participation-content {
    p {
      margin-bottom: 20px;
      font-size: 15px;
      color: $text-color;
      line-height: 1.6;
    }

    .participation-list {
      margin: 20px 0;
      padding-left: 0;
      list-style: none;

      li {
        padding: 8px 0 8px 30px;
        font-weight: bold;
        margin-bottom: 15px;
        line-height: 1.6;
        position: relative;
        color: $text-color;

        &:before {
          content: '•';
          color: $orange-color;
          font-size: 20px;
          position: absolute;
          left: 10px;
          top: 5px;
        }
      }
    }
  }

  .github-section {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 40px;
    align-items: flex-start;
    margin-bottom: 60px;
  }

  .github-image {
    text-align: center;
  }

  .github-img {
    max-width: 120px;
    width: 100%;
    height: auto;
  }

  .github-content {
    p {
      margin-bottom: 20px;
      font-size: 15px;
      color: $text-color;
      line-height: 1.6;

      strong {
        font-weight: bold;
        color: #000;
      }

      a {
        color: $orange-color;
        text-decoration: underline;

        &:hover {
          color: $orange-dark;
        }
      }
    }

    .contribution-guide {
      margin-top: 30px;

      h4 {
        font-size: 18px;
        color: $secondary-color;
        margin: 25px 0 15px 0;
        font-weight: 600;
      }

      p {
        margin-bottom: 15px;
        font-size: 14px;
      }
    }
  }

  .community-section {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 40px;
    align-items: center;
  }

  .community-image {
    text-align: center;
  }

  .message-img {
    max-width: 120px;
    width: 100%;
    height: auto;
  }

  .community-content {
    p {
      margin-bottom: 20px;
      font-size: 15px;
      color: $text-color;
      line-height: 1.6;

      strong {
        font-weight: bold;
        color: #000;
      }
    }

    .join-buttons {
      display: flex;
      gap: 15px;
      margin-top: 25px;
      flex-wrap: wrap;
    }

    .join-btn {
      display: inline-block;
      padding: 12px 25px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;

      &.github-btn {
        background-color: #333;
        color: white;

        &:hover {
          background-color: #555;
          transform: translateY(-2px);
        }
      }

      &.qq-btn {
        background-color: $orange-color;
        color: white;

        &:hover {
          background-color: $orange-dark;
          transform: translateY(-2px);
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .opensource-intro {
      grid-template-columns: 1fr;
      gap: 30px;
      text-align: center;
    }

    .participation-section,
    .github-section,
    .community-section {
      grid-template-columns: 1fr;
      gap: 30px;
      text-align: center;
    }

    .participation-image,
    .github-image,
    .community-image {
      order: -1;
    }

    .opensource-title {
      font-size: 22px;
    }

    .join-buttons {
      justify-content: center;
    }
  }
</style>
