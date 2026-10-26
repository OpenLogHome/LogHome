<template>
  <div class="home-container">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-intro">
        <!-- <p class="home-eyebrow"><span aria-hidden="true"></span>{{ copy.hero.eyebrow }}</p> -->
        <h1 id="home-title">{{ copy.hero.titleStart }}<br>{{ copy.hero.titleSecondLine }}<span class="title-highlight">{{ copy.hero.titleHighlight }}</span>{{ copy.hero.titleEnd }}</h1>
        <p class="home-lead">{{ copy.hero.lead }}</p>
        <!-- <p class="home-description">{{ copy.hero.descriptionSecondLine }}</p> -->
        <div class="home-actions">
          <nuxt-link to="/read" class="home-cta home-cta-primary">{{ copy.hero.readAction }} <span aria-hidden="true">↗</span></nuxt-link>
          <nuxt-link to="/write" class="home-cta home-cta-secondary">{{ copy.hero.writeAction }} <span aria-hidden="true">↗</span></nuxt-link>
        </div>
        <nuxt-link to="/community" class="home-community-link">{{ copy.hero.communityAction }} <span aria-hidden="true">→</span></nuxt-link>
      </div>
      <div class="home-world"><HomeVoxelWorld :description="copy.hero.worldDescription" /><p>{{ copy.hero.caption }}</p></div>
    </section>

    <nav class="home-paths" :aria-label="copy.pathsLabel">
      <nuxt-link v-for="item in copy.paths" :key="item.path" :to="item.path"><span class="path-label">{{ item.label }}</span><h2>{{ item.title }}</h2><p>{{ item.description }}</p><span class="path-arrow" aria-hidden="true">↗</span></nuxt-link>
    </nav>

    <section id="home-stories" class="home-section" aria-labelledby="stories-title">
      <header class="home-section-heading">
        <div><p class="home-eyebrow">{{ copy.stories.eyebrow }}</p><h2 id="stories-title">{{ copy.stories.title }}</h2><p class="home-description">{{ copy.stories.description }}</p></div>
        <nuxt-link to="/read" class="home-text-link">{{ copy.stories.browseAction }} <span aria-hidden="true">→</span></nuxt-link>
      </header>
      <p v-if="worksLoading" class="home-status" role="status">{{ copy.stories.loading }}</p>
      <div v-else-if="works.length" class="home-books">
        <nuxt-link v-for="work in works" :key="work.novel_id" :to="workUrl(work)" class="home-book">
          <div class="home-book-cover"><img :src="work.picUrl || '/default-book-cover.png'" :alt="formatCopy(copy.stories.coverAlt, { name: work.name || copy.stories.untitled })" loading="lazy" decoding="async" @error="coverError"><span>{{ workType(work) }}</span></div>
          <h3>{{ work.name || copy.stories.untitled }}</h3><p class="home-book-author">{{ work.author_name }}</p><p class="home-book-description">{{ plainText(work.content) || copy.stories.descriptionFallback }}</p>
        </nuxt-link>
      </div>
      <div v-else class="home-status" role="status"><p>{{ worksError ? copy.stories.error : copy.stories.empty }}</p><button v-if="worksError" type="button" class="home-inline-button" @click="loadWorks">{{ copy.stories.retry }}</button></div>
      <nuxt-link v-if="collection && works.length" :to="collectionUrl(collection)" class="home-source">{{ formatCopy(copy.stories.source, { collection }) }} <span aria-hidden="true">→</span></nuxt-link>
    </section>

    <section id="home-create" class="home-section home-feature home-create" aria-labelledby="create-title">
      <div class="home-feature-copy"><p class="home-eyebrow">{{ copy.create.eyebrow }}</p><h2 id="create-title">{{ copy.create.titleFirstLine }}<br>{{ copy.create.titleSecondLine }}</h2><p class="home-description">{{ copy.create.description }}</p><ul class="home-writing-steps"><li v-for="step in copy.create.steps" :key="step">{{ step }}</li></ul><nuxt-link to="/write" class="home-cta home-cta-primary">{{ copy.create.action }} <span aria-hidden="true">↗</span></nuxt-link></div>
      <div class="home-writing-preview" :aria-label="copy.create.previewLabel">
        <div class="writing-toolbar"><span class="writing-dots" aria-hidden="true">● ● ●</span><span>{{ copy.create.previewTitle }}</span></div>
        <div class="writing-stage-buttons" role="group" :aria-label="copy.create.stagesLabel"><button v-for="(stage, index) in copy.create.stages" :key="stage.label" type="button" :aria-pressed="writingStage === index" @click="writingStage = index">{{ stage.label }}</button></div>
        <div class="writing-page" aria-live="polite"><p class="writing-overline">{{ currentStage.eyebrow }}</p><h3>{{ currentStage.title }}</h3><p>{{ currentStage.text }}</p><span class="writing-rule" aria-hidden="true"></span></div>
        <p class="writing-caption">{{ copy.create.caption }}</p>
      </div>
    </section>

    <section id="home-community" class="home-section home-feature" :class="{ 'home-community-compact': !showDiscussions }" aria-labelledby="community-title">
      <div class="home-feature-copy"><p class="home-eyebrow">{{ copy.community.eyebrow }}</p><h2 id="community-title">{{ copy.community.titleFirstLine }}<br>{{ copy.community.titleSecondLine }}</h2><p class="home-description">{{ copy.community.description }}</p><nuxt-link to="/community" class="home-cta home-cta-secondary">{{ copy.community.action }} <span aria-hidden="true">↗</span></nuxt-link></div>
      <div v-if="showDiscussions" class="home-discussions">
        <p v-if="postsLoading" class="home-status" role="status">{{ copy.community.loading }}</p>
        <template v-else-if="posts.length"><p class="home-list-label">{{ copy.community.listLabel }}</p><nuxt-link v-for="post in posts" :key="post.post_id" :to="'/community/post/' + post.post_id" class="home-post"><div class="home-post-meta"><span>{{ post.circle_name || copy.community.circleFallback }}</span><time v-if="post.create_time" :datetime="post.create_time">{{ postDate(post.create_time) }}</time></div><h3>{{ plainText(post.title, 80) || copy.community.titleFallback }} <span aria-hidden="true">↗</span></h3><p>{{ plainText(post.content, 90) }}</p><span class="home-post-author">{{ post.author_name || copy.community.authorFallback }}</span></nuxt-link></template>
        <template v-else><template v-if="copy.community.showIdeas"><p class="home-list-label">{{ copy.community.emptyTitle }}</p><div v-for="topic in copy.community.ideas" :key="topic.title" class="home-topic"><span aria-hidden="true">{{ topic.mark }}</span><div><h3>{{ topic.title }}</h3><p>{{ topic.text }}</p></div></div></template><button v-if="postsError" type="button" class="home-inline-button" @click="loadPosts">{{ copy.community.retry }}</button></template>
      </div>
    </section>

    <div id="home-download" class="home-download-anchor" aria-hidden="true"></div>
    <section class="home-section home-feature home-download" aria-labelledby="download-title">
      <div class="home-feature-copy"><p class="home-eyebrow">{{ copy.download.eyebrow }}</p><h2 id="download-title">{{ copy.download.titleFirstLine }}<br>{{ copy.download.titleSecondLine }}</h2><p class="home-description">{{ copy.download.description }}</p>
        <div class="home-actions"><a v-if="androidDownloadUrl" :href="androidDownloadUrl" class="home-cta home-cta-primary" @click="handleAndroidDownload"><img src="/icon_an.png" alt="" width="20" height="20">{{ copy.download.action }} <span aria-hidden="true">↗</span></a><nuxt-link to="/read" class="home-text-link">{{ copy.download.readAction }} <span aria-hidden="true">→</span></nuxt-link></div>
        <p class="home-download-status" role="status"><template v-if="androidDownloadUrl">{{ copy.download.platform }}<span v-if="androidVersion">{{ formatCopy(copy.download.version, { version: androidVersion }) }}</span></template><template v-else-if="downloadLoading">{{ copy.download.loading }}</template><template v-else>{{ copy.download.error }}<button type="button" class="home-inline-button" @click="getAppVersion">{{ copy.download.retry }}</button></template></p>
        <p v-if="showWeixinTip" class="home-weixin-tip" role="status">{{ copy.download.weixinTip }}</p>
      </div>
      <figure class="home-mobile-preview"><img src="/1.png" :alt="copy.download.imageAlt" loading="lazy" decoding="async" width="1594" height="2586"><figcaption v-if="copy.download.caption">{{ copy.download.caption }}</figcaption></figure>
    </section>

    <section id="home-open-source" class="home-section home-feature home-open-source" aria-labelledby="open-source-title">
      <div class="home-feature-copy"><p class="home-eyebrow">{{ copy.openSource.eyebrow }}</p><h2 id="open-source-title">{{ copy.openSource.titleFirstLine }}<br>{{ copy.openSource.titleSecondLine }}</h2><p class="home-description">{{ copy.openSource.description }}</p><div class="home-actions"><a href="https://github.com/OpenLogHome" target="_blank" rel="noopener noreferrer" class="home-text-link">{{ copy.openSource.githubAction }} <span aria-hidden="true">↗</span></a><nuxt-link to="/about/open-source" class="home-text-link">{{ copy.openSource.letterAction }} <span aria-hidden="true">→</span></nuxt-link></div></div>
      <div class="home-contributions"><a href="https://github.com/OpenLogHome" target="_blank" rel="noopener noreferrer"><span>01</span>{{ copy.openSource.codeContribution }} <span aria-hidden="true">↗</span></a><nuxt-link to="/community"><span>02</span>{{ copy.openSource.feedbackContribution }} <span aria-hidden="true">↗</span></nuxt-link><p><span>03</span>{{ copy.openSource.shareContribution }}</p><p class="home-contribution-note">{{ copy.openSource.note }}</p></div>
    </section>

    <section v-if="copy.faq.enabled" class="home-section home-faq" aria-labelledby="faq-title"><div><p class="home-eyebrow">{{ copy.faq.eyebrow }}</p><h2 id="faq-title">{{ copy.faq.title }}</h2></div><div><details v-for="(item, index) in copy.faq.questions" :key="item.title" :open="index === 0"><summary>{{ item.title }}<span aria-hidden="true">＋</span></summary><p>{{ item.answer }}</p></details></div></section>
    <section class="home-ending" :class="{ 'home-ending-sign': !copy.ending.showDetails }" aria-labelledby="ending-title"><p class="home-eyebrow">{{ copy.ending.eyebrow }}</p><h2 id="ending-title">{{ copy.ending.title }}</h2><p v-if="copy.ending.showDetails && copy.ending.description" class="home-description">{{ copy.ending.description }}</p><div v-if="copy.ending.showDetails" class="home-actions"><nuxt-link to="/read" class="home-cta home-cta-primary">{{ copy.ending.readAction }} <span aria-hidden="true">↗</span></nuxt-link><nuxt-link to="/write" class="home-text-link">{{ copy.ending.writeAction }} <span aria-hidden="true">→</span></nuxt-link></div></section>
  </div>
</template>

<script>
import copy from '~/config/home-copy.json'
import { formatCopy } from '~/utils/format-copy'
import axios from 'axios'
import HomeVoxelWorld from '~/components/HomeVoxelWorld.vue'
import { readingRequest } from '~/plugins/api/reading'
import { workUrl, collectionUrl } from '~/utils/reading-discovery'
import { loadLandingWorks, landingPosts, plainText, downloadInfo } from '~/utils/home-landing'

export default {
  components: { HomeVoxelWorld },
  head() {
    return {
      title: this.copy.seo.title,
      meta: [{ hid: 'description', name: 'description', content: this.copy.seo.description }],
      link: [{ rel: 'canonical', href: 'https://loghome.ink/' }]
    }
  },
  data() {
    return {
      copy,
      works: [], collection: '', worksLoading: true, worksError: false,
      posts: [], postsLoading: true, postsError: false,
      androidVersion: '', androidDownloadUrl: '', downloadLoading: true,
      isWeixin: false, showWeixinTip: false, disposed: false, writingStage: 0
    }
  },
  computed: {
    currentStage() { return this.copy.create.stages[this.writingStage] },
    showDiscussions() { return this.postsLoading || this.posts.length > 0 || this.postsError || this.copy.community.showIdeas }
  },
  mounted() {
    this.isWeixin = /micromessenger/i.test(navigator.userAgent)
    this.loadWorks()
    this.loadPosts()
    this.getAppVersion()
  },
  beforeDestroy() { this.disposed = true },
  methods: {
    workUrl, collectionUrl, plainText, formatCopy,
    workType(work) { return work.novel_type === 'world' ? this.copy.stories.types.world : work.novel_type === 'manga' ? this.copy.stories.types.manga : this.copy.stories.types.novel },
    postDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('zh-CN') },
    coverError(event) { if (!event.target.src.endsWith('/default-book-cover.png')) event.target.src = '/default-book-cover.png' },
    async loadWorks() {
      this.worksLoading = true
      this.worksError = false
      try {
        const result = await loadLandingWorks(this.$api.reading, this.copy.stories.authorFallback)
        if (this.disposed) return
        this.works = result.works; this.collection = result.collection; this.worksError = result.error
      } catch (_) { if (!this.disposed) this.worksError = true }
      finally { if (!this.disposed) this.worksLoading = false }
    },
    async loadPosts() {
      this.postsLoading = true
      this.postsError = false
      try {
        const result = await readingRequest('/community/posts/recommend', { page: 1, pageSize: 3, sort: 'new' })
        if (this.disposed) return
        if (!result || !Array.isArray(result.list)) throw new Error('Invalid posts response')
        this.posts = landingPosts(result)
      } catch (_) { if (!this.disposed) this.postsError = true }
      finally { if (!this.disposed) this.postsLoading = false }
    },
    async getAppVersion() {
      this.downloadLoading = true
      try {
        const { data } = await axios.get('https://api.loghome.ink/app/get_app_update', { timeout: 12000 })
        const release = downloadInfo(data)
        if (this.disposed) return
        this.androidDownloadUrl = release ? release.url : ''
        this.androidVersion = release ? release.version : ''
      } catch (_) { if (!this.disposed) this.androidDownloadUrl = '' }
      finally { if (!this.disposed) this.downloadLoading = false }
    },
    handleAndroidDownload(event) {
      if (this.isWeixin) { event.preventDefault(); this.showWeixinTip = true }
    }
  }
}
</script>

<style scoped src="~/assets/css/home-landing.css"></style>
