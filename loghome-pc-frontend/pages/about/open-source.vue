<template>
  <article class="open-letter">
    <nuxt-link to="/">{{ copy.header.back }}</nuxt-link>
    <header>
      <p class="letter-eyebrow">{{ copy.header.eyebrow }}</p>
      <h1>{{ copy.header.title }}</h1>
      <time :datetime="copy.header.date">{{ copy.header.dateLabel }}</time>
      <p class="archive-note">{{ copy.header.note }}</p>
    </header>
    <div class="opensource-section">
      <h2 class="section-title">{{ copy.intro.title }}</h2>
      <div class="opensource-container">
        <div class="opensource-hero">
          <h3 class="opensource-title">{{ copy.intro.quote }}</h3>
          <div class="opensource-intro">
            <div class="intro-image">
              <img src="/图片1.png" :alt="copy.intro.imageAlt" class="intro-img">
            </div>
            <div class="intro-content">
              <p>{{ copy.intro.paragraphs[0][0] }}</p>
              <p>{{ copy.intro.paragraphs[1][0] }}</p>
              <p>{{ copy.intro.paragraphs[2][0] }}<strong>{{ copy.intro.paragraphs[2][1] }}</strong>{{ copy.intro.paragraphs[2][2] }}</p>
            </div>
          </div>
        </div>

        <div class="opensource-content">
          <div class="content-block">
            <p>{{ copy.background.paragraphs[0][0] }}</p>
            <p>{{ copy.background.paragraphs[1][0] }}<strong>{{ copy.background.paragraphs[1][1] }}</strong>{{ copy.background.paragraphs[1][2] }}<strong>{{ copy.background.paragraphs[1][3] }}</strong>{{ copy.background.paragraphs[1][4] }}</p>
            <p>{{ copy.background.paragraphs[2][0] }}<strong>{{ copy.background.paragraphs[2][1] }}</strong>{{ copy.background.paragraphs[2][2] }}</p>
            <p>{{ copy.background.paragraphs[3][0] }}</p>
            <p>{{ copy.background.paragraphs[4][0] }}<strong>{{ copy.background.paragraphs[4][1] }}</strong></p>
            <p>{{ copy.background.paragraphs[5][0] }}<strong>{{ copy.background.paragraphs[5][1] }}</strong>{{ copy.background.paragraphs[5][2] }}<a href="https://github.com/OpenLogHome" target="_blank" rel="noopener noreferrer">{{ copy.background.paragraphs[5][3] }}</a>{{ copy.background.paragraphs[5][4] }}</p>
            <p>{{ copy.background.paragraphs[6][0] }}<strong>{{ copy.background.paragraphs[6][1] }}</strong>{{ copy.background.paragraphs[6][2] }}</p>
          </div>

          <div class="participation-section">
            <div class="participation-image">
              <img src="/teamwork.png" :alt="copy.participation.imageAlt" class="teamwork-img">
            </div>
            <div class="participation-content">
              <p>{{ copy.participation.paragraphs[0][0] }}</p>
              <p>{{ copy.participation.paragraphs[1][0] }}</p>
              <p>{{ copy.participation.paragraphs[2][0] }}</p>
              <ul class="participation-list">
                <li>{{ copy.participation.items[0] }}</li>
                <li>{{ copy.participation.items[1] }}</li>
                <li>{{ copy.participation.items[2] }}</li>
                <li>{{ copy.participation.items[3] }}</li>
                <li>{{ copy.participation.items[4] }}</li>
              </ul>
              <p>{{ copy.participation.paragraphs[3][0] }}</p>
            </div>
          </div>

          <div class="github-section">
            <div class="github-image">
              <img src="/github.png" :alt="copy.github.imageAlt" class="github-img">
            </div>
            <div class="github-content">
              <p>{{ copy.github.paragraphs[0][0] }}</p>
              <p><strong>{{ copy.github.paragraphs[1][0] }}</strong>{{ copy.github.paragraphs[1][1] }}</p>
              <p><strong>{{ copy.github.paragraphs[2][0] }}</strong>{{ copy.github.paragraphs[2][1] }}</p>
              <p>{{ copy.github.paragraphs[3][0] }}<a href="https://github.com/OpenLogHome" target="_blank" rel="noopener noreferrer">{{ copy.github.paragraphs[3][1] }}</a>{{ copy.github.paragraphs[3][2] }}</p>
              
              <div class="contribution-guide">
                <h4>{{ copy.contribution.codeTitle }}</h4>
                <p>{{ copy.contribution.paragraphs[0][0] }}<strong>{{ copy.contribution.paragraphs[0][1] }}</strong>{{ copy.contribution.paragraphs[0][2] }}<strong>{{ copy.contribution.paragraphs[0][3] }}</strong>{{ copy.contribution.paragraphs[0][4] }}</p>
                <p>{{ copy.contribution.paragraphs[1][0] }}<strong>{{ copy.contribution.paragraphs[1][1] }}</strong>{{ copy.contribution.paragraphs[1][2] }}<strong>{{ copy.contribution.paragraphs[1][3] }}</strong>{{ copy.contribution.paragraphs[1][4] }}</p>
                
                <h4>{{ copy.contribution.apiTitle }}</h4>
                <p>{{ copy.contribution.paragraphs[2][0] }}</p>
                <p>{{ copy.contribution.paragraphs[3][0] }}<strong>{{ copy.contribution.paragraphs[3][1] }}</strong>{{ copy.contribution.paragraphs[3][2] }}</p>
              </div>
            </div>
          </div>

          <div class="community-section">
            <div class="community-image">
              <img src="/message.png" :alt="copy.community.imageAlt" class="message-img">
            </div>
            <div class="community-content">
              <p>{{ copy.community.paragraphs[0][0] }}</p>
              <p><strong>{{ copy.community.paragraphs[1][0] }}</strong></p>
              <div class="join-buttons">
                <a href="https://github.com/OpenLogHome" target="_blank" rel="noopener noreferrer" class="join-btn github-btn">
                  {{ copy.community.githubAction }}
                </a>
                <a href="tencent://groupwpa/?subcmd=all&param=7B2267726F757055696E223A3730313932383237332C2274696D655374616D70223A313733353030303030307D0A" class="join-btn qq-btn">
                  {{ copy.community.qqAction }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import copy from '~/config/open-source-copy.json'
export default {
  data() { return { copy } },
  head() {
    return { title: this.copy.seo.title, meta: [{ hid: 'description', name: 'description', content: this.copy.seo.description }] }
  }
}
</script>

<style scoped>
.open-letter { max-width: 800px; margin: 16px auto 60px; color: #333b2f; font-size: 16px; line-height: 1.95; overflow-wrap: anywhere; }
.open-letter header { margin: 32px 0 48px; }
.open-letter h1 { font-size: clamp(26px, 5vw, 36px); line-height: 1.5; }
.open-letter h2 { font-size: 24px; margin: 36px 0 20px; }
.open-letter h3 { font-size: 21px; margin: 30px 0 18px; }
.open-letter h4 { font-size: 18px; margin: 24px 0 12px; }
.open-letter p { margin: 14px 0; }
.open-letter a { color: #79573c; text-underline-offset: 4px; }
.open-letter a:focus-visible { outline: 2px solid #79573c; outline-offset: 4px; }
.letter-eyebrow, .open-letter time { color: #6d7365; font-size: 13px; }
.archive-note { padding: 20px 24px; border-left: 3px solid #947358; background: #f3eee5; }
.open-letter img { display: block; max-width: 150px; max-height: 140px; object-fit: contain; margin: 30px auto; }
.open-letter ul { padding-left: 24px; }
.join-buttons { display: flex; gap: 24px; flex-wrap: wrap; }
</style>
