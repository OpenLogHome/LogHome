<template>
  <div class="home-container">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-intro">
        <div class="home-eyebrow">原木社区 · Minecraft 同人二创社区</div>
        <h1 id="home-title">方块跃然纸上，<br>故事<span class="title-highlight">在此生长<svg viewBox="0 0 240 12" aria-hidden="true"><path d="M3 8 Q90 0 237 6" /></svg></span>。</h1>
        <p class="home-lead">我们因热爱而相聚，<br>共同搭建一个新的世界。</p>
        <p class="home-description">在这里，读一段意想不到的冒险，写下属于你的方块故事，遇见和你一样热爱 Minecraft 的朋友。</p>
        <div class="home-actions">
          <nuxt-link to="/read" class="home-cta home-cta-primary">
            <svg class="home-cta-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M1 3h5v1h1v1h2V4h1V3h5v10h-5v1H9v1H7v-1H6v-1H1V3zm2 2v6h3v1h1V7H6V6H5V5H3zm6 2v5h1v-1h3V5h-2v1h-1v1H9z" fill-rule="evenodd" />
            </svg>
            开始探索 <span aria-hidden="true">↗</span>
          </nuxt-link>
          <nuxt-link to="/write" class="home-cta home-cta-secondary">
            <svg class="home-cta-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M1 4h6v2H3v7h8V9h2v6H1V4zm10-1h2v2h-1v1h-1v1h-1v1H9v1H8v1H6V8h1V7h1V6h1V5h1V4h1V3zm2-2h2v2h-2V1z" />
            </svg>
            写下故事 <span aria-hidden="true">↗</span>
          </nuxt-link>
        </div>
      </div>
      <HomeVoxelWorld />
    </section>

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
import HomeVoxelWorld from '~/components/HomeVoxelWorld.vue'

export default {
  components: {
    HomeVoxelWorld
  },
  data() {
    return {
      homeFeatures: [
        { path: '/read', icon: 'el-icon-reading', english: 'READ', title: '在文字里，探索世界', description: '从熟悉的方块出发，去往未曾到达的地方。发现让你舍不得合上的故事。', action: '发现好故事' },
        { path: '/write', icon: 'el-icon-edit-outline', english: 'CREATE', title: '让脑洞，有自己的形状', description: '一次冒险、一个角色、一个全新的世界。把心里的灵感，写给更多人看。', action: '开启创作之旅' },
        { path: '/community', icon: 'el-icon-chat-dot-round', english: 'CONNECT', title: '热爱，让我们相遇', description: '和作者聊剧情，与读者分享感动。在这里，总有人懂你的奇思妙想。', action: '遇见你的同好' }
      ],
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

<style lang="scss" scoped>
// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #e8e8e8;
$background-color: #f5f5f5;
$orange-color: #FB7D46;
$orange-dark: #fa6c2e;

.home-container { width: 100%; color: $text-color; }
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 42px;
  padding: 25px 0 55px;
}
.home-intro { padding: 10px 0 10px 12px; }
.home-eyebrow { display: flex; align-items: center; gap: 10px; color: #73805e; font-size: 11px; letter-spacing: 2px; line-height: 1.8; }
.eyebrow-block { width: 11px; height: 11px; background: #8d9f67; box-shadow: 3px 3px 0 #cdd4b9; }
.home-intro h1 { font-size: clamp(36px, 4.1vw, 55px); font-weight: 750; line-height: 1.42; letter-spacing: -2px; margin: 27px 0 24px; color: #35432d; }
.title-highlight { position: relative; color: #657e45; display: inline-block; }
.title-highlight svg { position: absolute; left: 0; bottom: -3px; width: 100%; height: 12px; fill: none; stroke: #bdcc99; stroke-width: 4; stroke-linecap: round; }
.home-lead { color: #59634f; font-size: 20px; line-height: 1.8; letter-spacing: .4px; }
.home-description { font-size: 14px; line-height: 2; color: #73796b; max-width: 365px; margin-top: 17px; }
.home-actions { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
.home-cta { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 15px 22px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 9px; transition: transform .2s, box-shadow .2s, background .2s; }
.home-cta-icon { width: 16px; height: 16px; flex-shrink: 0; fill: currentColor; shape-rendering: crispEdges; }
.home-cta-primary { background: #788d55; color: #fffdf4; border: 1px solid #788d55; box-shadow: 0 5px 14px #788d5520; }
.home-cta-primary > span { margin-left: 8px; font-size: 17px; }
.home-cta-secondary { border: 1px solid #d5dacd; background: #fff; color: #58684a; }
.home-cta:hover { transform: translateY(-3px); box-shadow: 0 7px 20px #788d5525; }
.home-cta-primary:hover { background: #697f48; }
.home-community { display: inline-flex; gap: 14px; color: #687858; font-size: 12px; margin-top: 20px; text-decoration: none; }
.home-community:hover { color: #455e31; }
.home-note { display: flex; align-items: center; gap: 10px; padding-top: 30px; margin-top: 28px; border-top: 1px solid #dfe2d9; max-width: 340px; font-size: 10px; color: #7c8372; letter-spacing: .6px; }
.note-pixels { display: flex; align-items: end; gap: 3px; }
.note-pixels i { width: 5px; height: 5px; background: #a3b37f; }
.note-pixels i:nth-child(2) { height: 10px; background: #829565; }
.note-pixels i:nth-child(3) { height: 7px; background: #bdc99f; }
.home-paths { padding: 28px 0 60px; border-top: 1px solid #dfe2d9; }
.paths-heading { text-align: center; margin-bottom: 30px; }
.paths-heading .home-eyebrow { justify-content: center; font-size: 9px; letter-spacing: 2.5px; }
.paths-heading h2 { font-size: 25px; color: #45543a; margin-top: 12px; font-weight: 600; }
.paths-heading p { color: #747c69; font-size: 12px; margin-top: 12px; line-height: 1.8; }
.paths-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.path-card { padding: 25px 26px; border: 1px solid #dde3d5; border-radius: 15px; background: #f0f3eb; text-decoration: none; transition: transform .25s, box-shadow .25s; }
.path-card-1 { background: #f5efe6; border-color: #e6dccd; }
.path-card-2 { background: #edf2ee; border-color: #d8e3dc; }
.path-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px #6464420d; }
.path-card-top { display: flex; align-items: center; gap: 12px; color: #738261; }
.path-card-top > i { display: grid; place-items: center; width: 37px; height: 37px; border-radius: 10px; font-size: 20px; background: #e3ebd8; color: #708750; }
.path-card-1 .path-card-top > i { background: #eee0cd; color: #9c7950; }
.path-card-2 .path-card-top > i { background: #dce9df; color: #62826a; }
.path-card-top > span { font-size: 9px; letter-spacing: 1.5px; }
.path-card-top .path-arrow { margin-left: auto; font-size: 20px; }
.path-card h3 { font-size: 17px; margin-top: 23px; color: #46523a; font-weight: 600; }
.path-card p { color: #747c6c; font-size: 12px; line-height: 1.9; margin-top: 12px; }
.path-link { display: inline-flex; align-items: center; gap: 15px; font-size: 11px; color: #687e4f; margin-top: 20px; }
.section-title { font-size: 28px; text-align: center; margin-bottom: 45px; color: $secondary-color; }
a:focus-visible { outline: 2px solid #788d55; outline-offset: 4px; }
@media (max-width: 1050px) {
  .home-hero { gap: 24px; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); }
  .home-intro { padding-left: 0; }
  .home-intro h1 { font-size: 40px; }
  .home-cta { padding: 13px 16px; }
  .path-card { padding: 22px 20px; }
}
@media (max-width: 720px) {
  .home-hero { grid-template-columns: minmax(0, 1fr); gap: 30px; padding: 20px 0 40px; }
  .home-intro { padding: 0 8px; }
  .home-intro h1 { font-size: 44px; margin: 20px 0; }
  .home-description { max-width: 480px; }
  .home-note { padding-top: 18px; margin-top: 20px; max-width: 100%; }
  .paths-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .home-paths { padding-bottom: 40px; }
  .path-card h3 { margin-top: 18px; }
}
@media (max-width: 420px) { .home-intro h1 { font-size: 37px; } .home-eyebrow { letter-spacing: 1px; font-size: 10px; } .home-lead { font-size: 18px; } .paths-heading h2 { font-size: 22px; } }
@media (prefers-reduced-motion: reduce) { .home-container * { transition: none !important; } }

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
        color: #333;
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
          color: #333;
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
        color: #333;
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
        color: #333;
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
