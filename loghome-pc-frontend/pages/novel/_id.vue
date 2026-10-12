<template>
  <div class="novel-page">

    <div v-if="error" class="error-container">
      <p>{{ error }}</p>
      <nuxt-link to="/read" class="back-button">返回小说列表</nuxt-link>
    </div>

    <div class="novel-container">
      <!-- 打赏动画效果 -->
      <div class="gift-box" id="gift-box">
        <img class="gift-background" id="gift-background" src="~/assets/images/bg.png">
        <img class="gift" id="gift" :src="giftImage">
      </div>

      <div class="novel-header">
        <button class="novel-cover" :disabled="!novel.picUrl" aria-label="预览作品封面" :style="novel.picUrl ? { backgroundImage: `url(${novel.picUrl})` } : { backgroundColor: `hsl(${novel.novel_id * 30 % 360}, 70%, 80%)` }" @click="previewCover"><span class="book-id-tag">ID {{ novel.novel_id }}</span></button>
        
        <div class="novel-info">
          <h1 class="novel-title">{{ novel.name }}</h1>
          <div class="novel-meta">
            <div class="author-info" @click="gotoUserProfile(novel.auther_id)">
              <img v-if="novel.auther_avatar" :src="novel.auther_avatar" class="author-avatar" alt="作者头像">
              <div v-else class="author-avatar-placeholder">{{ novel.author_name ? novel.author_name.charAt(0) : '作' }}
              </div>
              <span class="author-name">{{ novel.author_name || '佚名' }}</span>
            </div>
            <!-- <div class="novel-type" v-if="novel.novel_type">{{ novel.novel_type == 'novel' ? '小说' : '世界' }}</div> -->
          </div>
          
          <div class="novel-stats">
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(novel.clicks || 0) }}</span>
              <span class="stat-label">阅读量</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(nice_amount || 0) }}</span>
              <span class="stat-label">喜欢</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(novel.text_count || 0) }}</span>
              <span class="stat-label">字数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ novel.is_complete == 1 ? "已完结" : "连载中" }}</span>
              <span class="stat-label">状态</span>
            </div>
          </div>
          
          <div class="novel-tags">
            <nuxt-link class="tag" v-for="tag in tags" :key="tag.tag_id" :to="`/tag/collections?tag_id=${tag.tag_id}`" :class="{ activity: Number(tag.is_activity_tag) === 1 }">{{ tag.tag_name }}</nuxt-link>
          </div>
          
          <div class="novel-actions">
            <BookSupport class="inline-support" :book="novel" @liked="onSupportLike" @tipped="onSupportTip" @account-change="onSupportAccount">
              <button slot="primary" class="action-button primary reading-button" @click="startReading" v-if="readableChapters.length > 0">
                <div class="reading-info">
                  <span>{{ historyShown > 1 ? '继续阅读' : '开始阅读' }}</span>
                  <small v-if="historyShown > 1">已读 {{ Math.min((historyShown / readableChapters.length * 100), 100).toFixed(0) }}%</small>
                </div>
                <div class="progress-indicator" v-if="historyShown > 1">
                  <div class="progress-bar" :style="{ width: `${Math.min((historyShown / readableChapters.length * 100), 100)}%` }"></div>
                </div>
              </button>
              <ReaderAiEntry slot="secondary" :book="novel" />
            </BookSupport>
          </div>
        </div>
      </div>

      <CollaborativeAuthors :novel-id="novel.novel_id" />
      <!-- 原木力榜 -->
      <div class="novel-rank" v-show="novelRank.onRank">
        <nuxt-link to="/read/rank?board=logpower" class="rank-info">
          实时<LogPowerWordmark />榜第
          <span class="rank-number">{{ novelRank.rank }}</span>
          位
        </nuxt-link>
        <nuxt-link :to="`/read/power/${novel.novel_id}`" class="rank-value" aria-label="查看原木力分项说明">
          {{ novelRank.ranking }} <span aria-hidden="true">ⓘ</span>
        </nuxt-link>
      </div>
      
      <div class="novel-content">
        <div class="content-tabs">
          <button class="tab-button" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">
            作品简介
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'chapters' }" @click="activeTab = 'chapters'">
            章节目录 ({{ readableChapters.length }})
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
            读者评论 ({{ commentAmount }})
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'excerpts' }" @click="activeTab = 'excerpts'">书摘</button>
          <button class="tab-button" :class="{ active: activeTab === 'worlds' }" @click="activeTab = 'worlds'" v-if="worlds.length > 0">
            世界设定 ({{ worlds.length }})
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'fans' }" @click="activeTab = 'fans'" v-if="fanInfo.length > 0">
            粉丝榜
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'activities' }" @click="activeTab = 'activities'" v-if="activityNewsList.length > 0 || activityNewsError">
            创作活动 ({{ activityNewsList.length }})
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 作品简介 -->
          <div v-show="activeTab === 'intro'" class="intro-content">
            <p v-if="novel.content">{{ novel.content }}</p>
            <p v-else class="empty-content">暂无简介</p>
          </div>
          
          <!-- The public catalog is rendered on the server even when another tab is selected. -->
          <div v-show="activeTab === 'chapters'" class="chapters-content"><ChapterCatalog :chapters="chapters" :current-chapter="history" :novel-id="novel.novel_id" /></div>
          <div v-if="activeTab === 'excerpts'" class="excerpts-content"><BookExcerpts :novel-id="novel.novel_id" /></div>

          <!-- 读者评论 -->
          <div v-if="activeTab === 'comments'" class="comments-content"><MangaCommentPanel ref="bookReviews" inline :visible="true" :novel-id="novel.novel_id" :work-author-id="novel.author_id || novel.auther_id" :anchor-id="commentAnchor" @changed="getCommentNum" /></div>

          <!-- 世界设定标签页 -->
          <div v-show="activeTab === 'worlds'" class="worlds-content">
            <div class="worlds-grid">
              <div v-for="world in worlds" :key="world.novel_id" class="world-card">
                <div class="world-cover" v-if="world.picUrl" :style="`background-image: url(${world.picUrl})`"></div>
                <div class="world-cover" v-else
                  :style="`background-color: hsl(${world.novel_id * 30 % 360}, 70%, 80%)`"></div>
                <div class="world-info">
                  <h4 class="world-title">
                    {{ world.name }}
                    <span v-if="world.novel_type == 'world'" class="world-tag">世界设定</span>
                  </h4>
                  <div class="world-author">
                    <img v-if="world.avatar_url" :src="world.avatar_url" class="world-author-avatar" alt="作者头像">
                    <span class="world-author-name">{{ world.user_name }}</span>
                  </div>
                  <p class="world-description">{{ world.content }}</p>
                </div>
                <nuxt-link :to="workUrl(world)" class="world-link"></nuxt-link>
              </div>
            </div>
          </div>
          
          <!-- 粉丝榜标签页 -->
          <div v-show="activeTab === 'fans'" class="fans-content">
            <NovelFansList ref="fansList" :novelId="novel.novel_id" :limit="3" />
          </div>

          <!-- 创作活动标签页 -->
          <div v-show="activeTab === 'activities'" class="activities-content">
            <p v-if="activityNewsError" role="alert">{{ activityNewsError }} <button :disabled="activityNewsLoading" @click="getNovelActivityNews">重试</button></p>
            <div class="activity-group" v-for="activity in activityNewsList" :key="activity.tag_id">
              <div class="activity-group-head">
                <nuxt-link class="activity-group-name" :to="`/tag/collections?tag_id=${activity.tag_id}`">{{ activity.activity_name }}</nuxt-link>
                <span class="activity-group-status" :class="activity.is_active == 1 ? 'ongoing' : 'ended'">
                  {{ activity.is_active == 1 ? '进行中' : '已结束' }}
                </span>
              </div>
              <template v-for="(news, newsIndex) in activity.news">
                <nuxt-link v-if="news.link && !news.link.external" :key="newsIndex" class="activity-news-item" :to="news.link.href"><span class="activity-news-item-title">{{ news.title }}</span><span class="activity-news-item-arrow">›</span></nuxt-link>
                <a v-else-if="news.link" :key="newsIndex" class="activity-news-item" :href="news.link.href" target="_blank" rel="noopener noreferrer"><span class="activity-news-item-title">{{ news.title }}</span><span class="activity-news-item-arrow">↗</span></a>
                <span v-else :key="newsIndex" class="activity-news-item">{{ news.title }} · 暂未开放</span>
              </template>
              <div class="activity-popularity" v-if="activity.popularity && activity.popularity.enabled">
                <div class="activity-popularity-info">
                  <span class="activity-popularity-count">人气票 {{ activity.popularity.votes }}</span>
                  <span class="activity-popularity-reason" v-if="popularityHint(activity)">{{ popularityHint(activity) }}</span>
                </div>
                <button class="activity-popularity-btn" :disabled="isVotingPopularity || popularityBtnDisabled(activity)" :class="{ disabled: popularityBtnDisabled(activity) }"
                  @click="voteActivity(activity)">
                  {{ popularityBtnText(activity) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="recommended-novels" v-if="!error">
      <h2 class="section-title">推荐阅读</h2>
      <div class="novels-grid">
        <div class="mini-novel-card" v-for="novel in recommendedNovels" :key="novel.novel_id">
          <div class="mini-novel-cover" v-if="novel.picUrl" :style="`background-image: url(${novel.picUrl})`"></div>
          <div class="mini-novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`">
          </div>
          <div class="mini-novel-info">
            <h3 class="mini-novel-title">{{ novel.name }}</h3>
            <p class="mini-novel-author">{{ novel.author_name || '佚名' }}</p>
          </div>
          <nuxt-link :to="workUrl(novel)" class="mini-novel-link"></nuxt-link>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { readingToken } from '~/plugins/api/reading'
import { readingCommentId } from '~/utils/reader-comment-links'
import { textReaderResumeUrl } from '~/utils/reader-position'
import { localReadingProgress, recordLocalReading } from '~/utils/reading-history'
import LogPowerWordmark from '~/components/LogPowerWordmark.vue'
import NovelFansList from '~/components/NovelFansList.vue'
import CollaborativeAuthors from '~/components/read/CollaborativeAuthors.vue'
import ChapterCatalog from '~/components/read/ChapterCatalog.vue'
import BookExcerpts from '~/components/read/BookExcerpts.vue'
import BookSupport from '~/components/read/BookSupport.vue'
import ReaderAiEntry from '~/components/read/ReaderAiEntry.vue'
import MangaCommentPanel from '~/components/manga/MangaCommentPanel.vue'
import { workUrl } from '~/utils/reading-discovery'
import { normalizeActivities } from '~/utils/reader-activities'
import { readingHead, bookSchema } from '~/utils/reading-seo'

export default {
  components: {
    LogPowerWordmark,
    NovelFansList, CollaborativeAuthors, ChapterCatalog, BookExcerpts, BookSupport, ReaderAiEntry, MangaCommentPanel
  },
  async asyncData({ params, query = {}, $api, error, redirect }) {
    try {
      // 获取小说详情 - 用于SEO的服务端渲染
      const novel = await $api.reader.book(params.id)
      if (!novel || novel.length === 0) {
        return error({ statusCode: 404, message: '找不到该小说' })
      }

      const novelData = novel[0]
      const anchor = readingCommentId(query)
      const commentQuery = anchor ? `?preLoadCommentId=${anchor}` : ''

      // 如果是设定书，则应当跳转到世界设定查看页面
      if (novelData.novel_type === "world") {
        return redirect(`/world/${novelData.novel_id}${commentQuery}`)
      }

      // 如果是漫画，跳转到漫画详情页
      if (novelData.novel_type === "manga") {
        return redirect(`/manga/${novelData.novel_id}${commentQuery}`)
      }

      // Independent public data loads in parallel; optional activity failure
      // must not turn an otherwise readable book into an error page.
      const loadActivities = async () => {
        try { return { activityNews: normalizeActivities(await $api.reader.activities(novelData.novel_id), process.env.mobileUrl), activityNewsError: '' } }
        catch (_) { return { activityNews: [], activityNewsError: '活动资讯暂时无法加载，请重试。' } }
      }
      const [chapters, tags, { activityNews, activityNewsError }] = await Promise.all([
        $api.reader.chapters(novelData.novel_id), $api.novels.getNovelTags(novelData.novel_id), loadActivities()
      ])

      // 返回服务端渲染所需的数据
      return {
        error: null,
        novel: novelData,
        chapters: chapters || [],
        tags: tags || [], activityNews, activityNewsError
      }
    } catch (err) {
      console.error('服务端获取小说数据失败', err)
      return error({ statusCode: err.status || 503, message: err.status === 404 ? '作品不存在或不可阅读' : '加载小说数据失败，请稍后重试' })
    }
  },
  data() {
    return {
      error: null,
      activeTab: 'intro', liking: false,
      isInBookcase: false,
      recommendedNovels: [],
      continueProgress: null,
      history: 1,
      progressArticle: {},
      commentAmount: 0,
      niceStatus: false,
      nice_amount: 0,
      fanInfo: [],
      novelRank: {
        onRank: false,
        rank: 0,
        ranking: 0
      },
      worlds: [],
      giftImage: "",
      userInfo: null,
      isLogin: false,
      activityNews: [],
      activityNewsError: '', activityNewsLoading: false, activityNewsVersion: 0,
      activityAccountEpoch: 0, popularityVersion: 0, votingVersion: 0,
      popularityStatus: {},
      isVotingPopularity: false
    }
  },
  head() { return readingHead({ title: this.novel?.name ? `${this.novel.name} - 原木社区` : '小说详情 - 原木社区', description: this.novel?.content, path: `/novel/${this.novel.novel_id}`, image: this.novel.picUrl, type: 'book', schema: bookSchema(this.novel, `/novel/${this.novel.novel_id}`) }) },
  computed: {
    commentAnchor() { return readingCommentId(this.$route.query) },
    readableChapters() { return this.chapters.filter(chapter => chapter.article_type !== 'spliter') },
    articleLength() {
      return this.chapters.length;
    },
    activityNewsList() {
      return this.activityNews.filter(activity =>
        (activity.news && activity.news.length > 0) ||
        (activity.popularity && activity.popularity.enabled)
      );
    },
    historyShown() {
      const index = this.readableChapters.findIndex(item => String(item.article_chapter) === String(this.history))
      return index >= 0 ? index + 1 : 1
    }

  },
  watch: { commentAnchor(id) { if (id) this.activeTab = 'comments' } },
  async mounted() {
    if (this.commentAnchor) this.activeTab = 'comments'
    // 检查登录状态
    this.checkLoginStatus()
    // 如果已登录，获取用户信息
    if (this.isLogin) {
      await this.getUserInfo()
    }
    // 补充其他客户端数据
    await this.fetchClientData()
  },
  methods: {
    workUrl,
    previewCover() { if (this.novel.picUrl && this.$preview) this.$preview([this.novel.picUrl], 0) },
    async fetchClientData() {
      await Promise.allSettled([this.loadRecommendations(), this.getNices(), this.getCommentNum(), this.getFansStatistics(), this.getWorlds(), this.checkNovelRank(), this.checkBookcaseStatus(), this.getPopularityStatus(), this.getReadingProgress()])
      this.addReaderHistory(this.novel)
    },
    async loadRecommendations() {
      const allNovels = await this.$api.novels.getAllNovels()
      this.recommendedNovels = (Array.isArray(allNovels) ? allNovels : []).filter(n => String(n.novel_id) !== String(this.novel.novel_id)).sort(() => 0.5 - Math.random()).slice(0, 6)
    },
    async getNovelTags() {
      try { this.tags = await this.$api.novels.getNovelTags(this.novel.novel_id) || [] } catch (_) {}
    },
    async getCommentNum() {
      try { const res = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id); if (res && res.length) this.commentAmount = Number(res[0]['COUNT(*)']) || 0 } catch (_) {}
    },
    async getNices() {
      const token = readingToken(), novelId = this.novel.novel_id
      try {
        const [amount, status] = await Promise.all([this.$api.reader.niceAmount(novelId), token ? this.$api.reader.niceStatus(novelId) : Promise.resolve([])])
        if (novelId !== this.novel.novel_id || token !== readingToken()) return
        this.nice_amount = Number((amount[0] || {}).nices) || 0; this.niceStatus = Number((status[0] || {}).nices) === 1
      } catch (_) { /* Keep the last successful state; mutations show failures. */ }
    },

    // 检查小说排行
    async checkNovelRank() {
      try {
        const ranks = await this.$api.novels.checkNovelRank(this.novel.novel_id)
        if (ranks && ranks.length > 0) {
          this.novelRank.onRank = true
          this.novelRank.rank = ranks[0].rank
          this.novelRank.ranking = ranks[0].ranking
        }
      } catch (error) {
        console.error('获取排行信息失败', error)
      }
    },

    // 获取粉丝统计
    async getFansStatistics() {
      try {
        // 只检查是否存在粉丝，详细数据由NovelFansList组件获取
        const fans = await this.$api.novels.getNovelFans(this.novel.novel_id)
        this.fanInfo = fans && fans.length > 0 ? [{}] : [] // 只需要知道是否有数据
      } catch (error) {
        console.error('获取粉丝统计失败', error)
        this.fanInfo = []
      }
    },

    // 获取关联世界
    async getWorlds() {
      try {
        const worlds = await this.$api.worlds.getAssoWorldByNovelId(this.novel.novel_id)
        this.worlds = worlds || []
      } catch (error) {
        console.error('获取关联世界失败', error)
      }
    },

    // 获取创作活动新闻
    async getNovelActivityNews() {
      const id = this.novel.novel_id, version = ++this.activityNewsVersion
      this.activityNewsLoading = true
      try {
        const list = normalizeActivities(await this.$api.reader.activities(id), process.env.mobileUrl)
        if (id !== this.novel.novel_id || version !== this.activityNewsVersion) return
        this.activityNews = list; this.activityNewsError = ''
      } catch (error) {
        if (id === this.novel.novel_id && version === this.activityNewsVersion) this.activityNewsError = error.message || '活动资讯暂时无法加载，请重试。'
      } finally { if (id === this.novel.novel_id && version === this.activityNewsVersion) this.activityNewsLoading = false }
    },

    // 获取当前用户在各活动中的人气票状态
    async getPopularityStatus() {
      const token = readingToken(), id = this.novel.novel_id, epoch = this.activityAccountEpoch, version = ++this.popularityVersion
      if (!token) { this.popularityStatus = {}; return }
      try {
        const list = await this.$api.popularity.getNovelStatus(id)
        if (token !== readingToken() || id !== this.novel.novel_id || epoch !== this.activityAccountEpoch || version !== this.popularityVersion) return
        const map = {}
        ;(Array.isArray(list) ? list : []).forEach(item => {
          map[item.tag_id] = item
        })
        this.popularityStatus = map
      } catch (error) {
        if (token === readingToken() && id === this.novel.novel_id && epoch === this.activityAccountEpoch && version === this.popularityVersion) this.popularityStatus = {}
      }
    },

    popularityStatusOf(activity) {
      return this.popularityStatus[activity.tag_id] || null
    },

    popularityBtnText(activity) {
      const status = this.popularityStatusOf(activity)
      return status && status.voted_this_novel ? '已投' : '投人气票'
    },

    popularityBtnDisabled(activity) {
      const status = this.popularityStatusOf(activity)
      // 未登录时按钮仍可点击（引导登录），登录后由服务端状态决定
      return !!status && !status.can_vote
    },

    popularityHint(activity) {
      const status = this.popularityStatusOf(activity)
      if (!status) return ''
      if (status.voted_this_novel) return ''
      if (!status.can_vote) return status.reason
      return `剩余 ${status.remaining} 票`
    },

    // 投人气票
    async voteActivity(activity) {
      if (!localStorage.getItem('token')) {
        this.$router.push('/login')
        return
      }
      const status = this.popularityStatusOf(activity)
      if (status && !status.can_vote) {
        this.$message.info(status.reason || '暂时无法投票')
        return
      }
      if (this.isVotingPopularity) return
      const token = readingToken(), id = this.novel.novel_id, epoch = this.activityAccountEpoch, version = ++this.votingVersion
      const current = () => token === readingToken() && id === this.novel.novel_id && epoch === this.activityAccountEpoch && version === this.votingVersion
      this.isVotingPopularity = true
      try {
        await this.$api.popularity.vote(id, activity.tag_id)
        if (!current()) return
        this.$message.success('已为本书投出 1 票')
        this.getPopularityStatus()
        this.getNovelActivityNews()
      } catch (error) {
        if (!current()) return
        this.$message.error(error.message || '投票失败，请稍后重试')
        this.getPopularityStatus()
      } finally {
        if (current()) this.isVotingPopularity = false
      }
    },

    // 检查收藏状态
    async checkBookcaseStatus() {
      if (!localStorage.getItem("token")) return

      try {
        const likes = await this.$api.bookcase.getLikesOf()
        if (likes) {
          this.isInBookcase = likes.some(item => item.novel_id === this.novel.novel_id)
        }
      } catch (error) {
        console.error('获取收藏状态失败', error)
      }
    },

    // 获取阅读进度
    async getReadingProgress() {
      const token = readingToken(), novelId = this.novel.novel_id
      const local = localReadingProgress(novelId, token)
      this.continueProgress = local
      if (local && local.last_article_chapter) this.history = Number(local.last_article_chapter)
      try {
        const response = await this.$api.reading.getProgress(novelId)
        if (token !== readingToken() || novelId !== this.novel.novel_id) return
        const cloud = Array.isArray(response) ? response[0] : response
        if (cloud && cloud.last_article_chapter && (!local || !local.last_read_time || new Date(cloud.last_read_time) >= new Date(local.last_read_time))) { this.history = Number(cloud.last_article_chapter); this.continueProgress = cloud }
      } catch (_) { /* Resume from local progress when offline. */ }

      // 获取当前阅读章节的内容
      if (this.chapters.length > 0) {
        let currentChapter = this.chapters[0]

        // 查找历史阅读章节
        for (const chapter of this.chapters) {
          if (chapter.article_chapter == this.history) {
            currentChapter = chapter
            break
          }
        }

        // 获取章节内容
        this.getChapterContent(currentChapter.article_id)
      }
    },

    // 获取章节内容
    async getChapterContent(articleId) {
      try {
        const article = await this.$api.articles.getArticle(articleId)
        if (article && article.length > 0) {
          this.progressArticle = article[0]
        }
      } catch (error) {
        console.error('获取章节内容失败', error)
        this.progressArticle = {
          title: "章节加载失败",
          content: "无法加载章节内容"
        }
      }
    },

    // 添加阅读历史
    addReaderHistory(book) { recordLocalReading(book) },

    // 检查登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLogin = !!token
      return this.isLogin
    },
    
    // 获取用户信息
    async getUserInfo() {
      const token = readingToken()
      if (!token) return null
      try {
        if (!this.userInfo) {
          const userInfoResponse = await this.$api.users.getUserProfile()
          if (userInfoResponse && token === readingToken()) {
            this.userInfo = userInfoResponse
          }
        }
        return this.userInfo
      } catch (error) {
        console.error('获取用户信息失败', error)
        return null
      }
    },
    
    // 开始阅读
    startReading() {
      if (this.readableChapters.length === 0) {
        this.$message.info("本书还没有章节")
        return
      }

      const stored = this.continueProgress || localReadingProgress(this.novel.novel_id)
      const target = this.readableChapters.find(chapter => stored && Number(chapter.article_id) === Number(stored.last_article_id)) || this.readableChapters.find(chapter => String(chapter.article_chapter) === String(this.history)) || this.readableChapters[0]
      const href = stored && Number(stored.last_article_id) === Number(target.article_id) ? textReaderResumeUrl(stored) : `/article/${target.article_id}?start=1`
      this.$router.push(href)
    },
    
    // 切换收藏状态
    async toggleLike() {
      if (!localStorage.getItem("token")) {
        this.$router.push('/login')
        return
      }

      try {
        if (this.isInBookcase) {
          // 取消收藏
          await this.$api.bookcase.removeLikeNovel(this.novel.novel_id)
          this.$message.success("已从书架移除")
        } else {
          // 添加收藏
          await this.$api.bookcase.likeNovel(this.novel.novel_id)
          this.$message.success("成功添加到书架")
        }

        this.isInBookcase = !this.isInBookcase
      } catch (error) {
        console.error('切换收藏状态失败', error)
        this.$message.error("操作失败，请稍后重试")
      }
    },

    async nice() {
      if (!readingToken()) { this.$router.push('/login'); return }
      if (this.liking) return
      this.liking = true
      try { await this.$api.reader.nice(this.novel.novel_id); await this.getNices() }
      catch (error) { this.$message.error(error.message || '操作失败，请稍后重试') }
      finally { this.liking = false }
    },

    // 打赏功能
    onSupportAccount() { this.activityAccountEpoch++; this.votingVersion++; this.isVotingPopularity = false; this.userInfo = null; this.popularityStatus = {}; this.checkLoginStatus(); this.getUserInfo(); this.getPopularityStatus(); this.getReadingProgress() },
    onSupportLike(state) { this.nice_amount = state.count; this.niceStatus = state.liked },
    onSupportTip(result) { this.runGiftAnimation(result.gift.img_url); this.getFansStatistics(); if (this.$refs.fansList) this.$refs.fansList.getFansList() },

    // 打赏动画
    runGiftAnimation(imgUrl = "/gift.png") {
      this.giftImage = imgUrl

      setTimeout(() => {
        // 礼物动画
        const giftAnimation = [
          { top: "110vh", transform: "scale(0.1, 0.1)" },
          { top: "16vh", transform: "scale(0.6, 0.6)", offset: 0.16 },
          { top: "37vh", transform: "scale(0.9, 0.9)", offset: 0.28 },
          { top: "36vh", transform: "scale(0.8, 0.8)", offset: 0.32 },
          { top: "36vh", transform: "scale(0.8, 0.8)", offset: 0.48 },
          { top: "36vh", transform: "scale(1.0, 1.0)", offset: 0.72 },
          { top: "36vh", transform: "scale(1.0, 1.0)" }
        ]

        const giftAnimTiming = {
          duration: 4000,
          iteration: 1,
          easing: "ease-out"
        }

        // 背景动画
        const giftBackgroundAnimation = [
          { transform: "scale(0.2, 0.2)" },
          { transform: "scale(0.2, 0.2)", filter: "drop-shadow(0px 0px 0px rgba(255, 199, 101, 0.6)) brightness(0.0)", offset: 0.56 },
          { transform: "scale(1.4, 1.4)", filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)", offset: 0.72 },
          { transform: "scale(1.2, 1.2) rotate(30deg)", filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)", offset: 0.79 },
          { transform: "scale(1.4, 1.4) rotate(60deg)", filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.8)", offset: 0.86 },
          { transform: "scale(1.2, 1.2) rotate(90deg)", filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)", offset: 0.93 },
          { transform: "scale(1.4, 1.4) rotate(120deg)", filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)" }
        ]

        const giftBgAnimTiming = {
          duration: 4000,
          iteration: 1,
          easing: "ease-out"
        }

        document.getElementById("gift-box").animate(giftAnimation, giftAnimTiming)
        document.getElementById("gift-background").animate(giftBackgroundAnimation, giftBgAnimTiming)
      }, 100)
    },

    // 分享小说
    shareBook() {
      const content = `我正在原木社区读《${this.novel.name}》，你也一起来看看吧！\nhttps://loghome.ink/novel/${this.novel.novel_id}`

      if (navigator.clipboard) {
        navigator.clipboard.writeText(content)
          .then(() => this.$message.success("分享链接已复制到剪贴板"))
          .catch(() => this.$message.error("复制失败，请手动复制"))
      } else {
        // 兼容旧浏览器
        const textarea = document.createElement('textarea')
        textarea.value = content
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        this.$message.success("分享链接已复制到剪贴板")
      }
    },

    // 跳转到用户主页
    gotoUserProfile(userId) {
      this.$router.push(`/users/${userId}`)
    },

    // 显示简介
    showDescription(content) {
      this.$modal.show('dialog', {
        title: '作品简介',
        text: content,
        buttons: [
          { title: '关闭', handler: () => this.$modal.hide('dialog') }
        ]
      })
    },

    // 富文本转纯文本
    richtext2text(richtext) {
      if (!richtext) return '努力加载中'

      try {
        const richArr = JSON.parse(richtext)
        let richStr = ""

        for (const item of richArr) {
          if (item.type === "text") richStr += item.value + "\n"
          if (item.type === "image") richStr += "[图片]\n"
        }

        return richStr
      } catch (error) {
        console.error('解析富文本失败', error)
        return '无法解析内容'
      }
    },
    
    // 格式化数字
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    },
    
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    // UTC时间转北京时间
    utc2beijing(utc_datetime) {
      if (!utc_datetime) return ''

      // 转为正常的时间格式 年-月-日 时:分:秒
      const T_pos = utc_datetime.indexOf('T')
      const Z_pos = utc_datetime.indexOf('Z')
      const year_month_day = utc_datetime.substr(0, T_pos)
      const hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1)
      const new_datetime = year_month_day + " " + hour_minute_second

      // 处理成为时间戳
      let timestamp = new Date(Date.parse(new_datetime)).getTime() / 1000

      // 增加8个小时，北京时间比utc时间多八个时区
      timestamp = timestamp + 8 * 60 * 60

      // 时间戳转为时间
      const date = new Date(timestamp * 1000)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },


  }
}
</script>

<style lang="scss">
@use "sass:color";

// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;
$error-color: #ff4d4f;
$success-color: #52c41a;
$warning-color: #faad14;
$accent-color: #79573c;
$heart-color: #FF6B6B;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin button-base {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

@mixin card {
  background-color: $background-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
}

// 动画
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes niubi {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1);
  }
  90% {
    transform: scale(1);
    opacity: 1;
  }
  99% {
    transform: scale(1);
    opacity: 0;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.novel-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;

  .loading-container,
  .error-container {
  @include flex-center;
  flex-direction: column;
  padding: 50px;
  text-align: center;
}

.back-button {
  @include button-base;
  background-color: $primary-color;
  color: white;
  text-decoration: none;
  margin-top: 20px;
  border: none;
}

.novel-container {
  background-color: $background-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
    position: relative;

.novel-header {
  display: flex;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.novel-cover {
  border: 0;
  padding: 0;
  cursor: zoom-in;
  width: 200px;
  height: 280px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-right: 30px;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        position: relative;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
}
      
      .book-id-tag {
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
}

.novel-info {
  flex: 1;

.novel-title {
          font-size: 22px;
  font-weight: bold;
  color: $text-color;
          margin-bottom: 12px;
}

.novel-meta {
  @include flex-between;
          margin-bottom: 12px;
  
  .author-info {
    @include flex-center;
            cursor: pointer;
            
            .author-avatar,
            .author-avatar-placeholder {
              width: 30px;
              height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .author-avatar {
      object-fit: cover;
    }
    
    .author-avatar-placeholder {
      @include flex-center;
      background-color: $primary-color;
      color: white;
      font-weight: bold;
    }
    
    .author-name {
      font-size: 16px;
      color: $text-light;
              
              &:hover {
                color: $primary-color;
              }
    }
  }
  
  .novel-type {
    font-size: 14px;
    padding: 4px 10px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: 20px;
  }
}

.novel-stats {
  display: flex;
          margin-bottom: 14px;
          flex-wrap: wrap;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
            margin-bottom: 10px;
    
    &:last-child {
      margin-right: 0;
    }
    
    .stat-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 16px;
      font-weight: bold;
      color: $text-color;
      margin-bottom: 2px;
    }
    
    .stat-label {
      font-size: 12px;
      color: $text-light;
    }
  }
}

.novel-tags {
  a { text-decoration: none; }
          margin-bottom: 16px;
  
  .tag {
    display: inline-block;
            padding: 5px 11px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: 20px;
            font-size: 14px;
    margin-right: 8px;
    margin-bottom: 8px;
            
            &.activity {
              color: #ec8600;
              background-color: #ffcfa5;
            }
  }
}

.novel-actions {
  display: flex;
          flex-wrap: wrap;
  
  .action-button {
    @include button-base;
    margin-right: 12px;
            margin-bottom: 10px;
    min-width: 90px;
    
    &.primary {
              background-color: $accent-color;
      color: white;
      border: none;
      
      &:hover {
                background-color: color.adjust($accent-color, $lightness: -5%);
              }
            }
            
            &.reading-button {
              min-width: 150px;
              position: relative;
              padding: 10px 16px;
              
              .reading-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                
                span {
                  font-weight: bold;
                  font-size: 16px;
                }
                
                small {
                  font-size: 12px;
                  opacity: 0.8;
                  margin-top: 2px;
                }
              }
              
              .progress-indicator {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 0 0 4px 4px;
                overflow: hidden;
                
                .progress-bar {
                  height: 100%;
                  background-color: rgba(255, 255, 255, 0.7);
                  transition: width 0.5s ease;
                }
      }
    }
    
    &:not(.primary) {
      background-color: transparent;
      border: 1px solid $primary-color;
      color: $primary-color;
      
      &:hover {
        background-color: rgba($primary-color, 0.05);
              }
            }
          }
        }
      }
    }

    .novel-rank {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      padding: 15px 20px;
      margin-bottom: 20px;
      
      .rank-info {
        color: $primary-color;
        text-decoration: none;
        font-size: 16px;
        
        .rank-number {
          font-size: 20px;
          font-weight: bold;
          margin: 0 5px;
        }
      }
      
      .rank-value {
        font-size: 20px;
        font-weight: bold;
        color: $accent-color;
        text-decoration: none;
      }
    }

.novel-content {
  margin-top: 20px;

.content-tabs {
  display: flex;
  border-bottom: 1px solid $border-color;
  margin-bottom: 20px;
        overflow-x: auto;
  
  .tab-button {
    @include button-base;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: $text-light;
    padding: 10px 20px;
    margin-right: 10px;
          border-radius: 0;
          white-space: nowrap;
    
    &.active {
      color: $primary-color;
      border-bottom-color: $primary-color;
    }
  }
}

.tab-content {
  min-height: 200px;
  
  .empty-content {
    color: $text-lighter;
    font-style: italic;
    text-align: center;
    padding: 30px 0;
}

.intro-content {
  line-height: 1.8;
  color: $text-color;
  white-space: pre-line;
}

        .worlds-content {
          margin: 15px 0;
          
          .worlds-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            
            @media (max-width: 768px) {
              grid-template-columns: 1fr;
            }
            
            .world-card {
              @include card;
              position: relative;
              display: flex;
              height: 140px;
              
              .world-cover {
                width: 100px;
                height: 100%;
                background-size: cover;
                background-position: center;
              }
              
              .world-info {
                flex: 1;
                padding: 15px;
                overflow: hidden;
                
                .world-title {
                  font-size: 16px;
                  font-weight: bold;
                  margin: 0 0 10px 0;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  
                  .world-tag {
                    font-size: 12px;
                    background-color: #faad14;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-left: 8px;
                    font-weight: normal;
                    vertical-align: middle;
                  }
                }
                
                .world-author {
                  display: flex;
                  align-items: center;
                  margin-bottom: 10px;
                  
                  .world-author-avatar {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    margin-right: 6px;
                  }
                  
                  .world-author-name {
                    font-size: 12px;
                    color: $text-light;
                  }
                }
                
                .world-description {
                  font-size: 12px;
                  color: $text-lighter;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  margin: 0;
                }
              }
              
              .world-link {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
              }
            }
          }
        }
        
        .fans-content {
          margin: 15px 0;
        }

        .activities-content {
          margin: 15px 0;

          .activity-group {
            @include card;
            padding: 15px;
            margin-bottom: 15px;

            .activity-group-head {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 10px;
              border-bottom: 1px solid $border-light;

              .activity-group-name {
                font-size: 15px;
                font-weight: bold;
                color: $text-color;
              }

              .activity-group-status {
                font-size: 12px;
                padding: 2px 10px;
                border-radius: 999px;

                &.ongoing {
                  color: #fff;
                  background-color: #ea7034;
                }

                &.ended {
                  color: $text-light;
                  background-color: $border-light;
                }
              }
            }

            .activity-news-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10px 4px;
              border-bottom: 1px solid $border-light;
              cursor: pointer;
              transition: background-color 0.2s;

              &:hover {
                background-color: $border-light;
              }

              .activity-news-item-title {
                font-size: 14px;
                color: $text-color;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .activity-news-item-arrow {
                flex-shrink: 0;
                margin-left: 12px;
                color: $text-lighter;
              }
            }

            .activity-popularity {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 12px;
              margin-top: 4px;

              .activity-popularity-info {
                display: flex;
                flex-direction: column;
                min-width: 0;

                .activity-popularity-count {
                  font-size: 14px;
                  font-weight: bold;
                  color: #ea7034;
                }

                .activity-popularity-reason {
                  margin-top: 4px;
                  font-size: 12px;
                  color: $text-light;
                }
              }

              .activity-popularity-btn {
                flex-shrink: 0;
                padding: 6px 20px;
                border-radius: 999px;
                border: none;
                font-size: 13px;
                font-weight: bold;
                color: #ffffff;
                background: linear-gradient(135deg, #ff8c42 0%, #ea7034 100%);
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                  opacity: 0.9;
                }

                &.disabled {
                  color: $text-light;
                  background: $border-light;
                  cursor: not-allowed;
                }
              }
            }
          }
        }

.chapters-content {
  .chapter-list {
    display: flex;
    flex-direction: column;
    
    .chapter-item {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid $border-light;
      text-decoration: none;
      color: $text-color;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: $border-light;
      }
      
      .chapter-number {
        flex: 0 0 50px;
        color: $primary-color;
        font-weight: bold;
      }
      
      .chapter-title {
        flex: 1;
      }
      
      .chapter-date {
        color: $text-lighter;
        font-size: 12px;
              }
            }
          }
        }
        
        .comments-content {
          .comment-list {
            .comment-item {
              background-color: rgba($primary-color, 0.05);
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              
              .comment-content {
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 10px;
              }
              
              .comment-footer {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: $text-light;
                
                .comment-likes {
                  display: flex;
                  align-items: center;
                  
                  .like-icon {
                    margin-right: 5px;
                    color: $heart-color;
                  }
                }
              }
            }
          }
          
          .view-all-comments {
            display: block;
            text-align: center;
            color: $primary-color;
            text-decoration: none;
            padding: 10px;
            border-top: 1px solid $border-color;
            margin-top: 20px;
            cursor: pointer;
            
            &:hover {
              background-color: rgba($primary-color, 0.05);
            }
          }
      }
    }
  }
}

.recommended-novels {
  margin-top: 40px;
  
  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
    color: $secondary-color;
  }
  
  .novels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
    
    @media (max-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
  }
  
  .mini-novel-card {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .mini-novel-cover {
      height: 200px;
      background-size: cover;
      background-position: center;
    }
    
    .mini-novel-info {
      padding: 10px;
      
      .mini-novel-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
        color: $text-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .mini-novel-author {
        font-size: 12px;
        color: $text-light;
        margin: 0;
      }
    }
    
    .mini-novel-link {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
        }
      }
    }
  }
}

// 打赏相关样式
.gift-box {
  width: 200px;
  height: 200px;
  position: fixed;
  left: calc(50% - 100px);
  top: 110vh;
  z-index: 9999;
  pointer-events: none;
}

.gift-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gift {
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
}

.tipping-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .tipping-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 520px;
    max-height: 86vh;
    overflow-y: auto;
    padding: 20px;

    h3 {
      font-size: 18px;
      margin: 0 0 20px 0;
      text-align: center;
      color: $accent-color;
    }

    .res-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 3px;
      vertical-align: -3px;

      &.res-log {
        background: #a1662f;
      }

      &.res-apple {
        background: #d94a3d;
        border-radius: 50%;
      }
    }

    .tipping-balance {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-bottom: 12px;
      font-size: 13px;
      color: $text-color;

      .balance-item {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
    }

    .tipping-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 16px;

      .tipping-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 4px;
        border: 2px solid rgba(200, 200, 200, 0.5);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: rgba(255, 112, 67, 0.5);
        }

        &.selected {
          border-color: #ff7043;
          background-color: #fff8ea;
        }

        .item-name {
          font-size: 12px;
          color: #795548;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .item-image {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }

        .item-cost {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-top: 4px;
          font-size: 12px;
          font-weight: bold;
          color: #ea7034;
        }
      }
    }

    .tipping-amount {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;

      .amount-label {
        font-size: 14px;
        color: #795548;
      }

      .amount-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 50%;
        background-color: rgba(234, 112, 52, 0.85);
        color: #fff;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
      }

      .amount-input {
        width: 64px;
        height: 28px;
        text-align: center;
        border: 1px dashed rgba(200, 200, 200, 0.8);
        border-radius: 14px;
        font-size: 14px;
      }

      .amount-quick {
        margin-left: auto;
        font-size: 12px;
        color: #947358;
        cursor: pointer;

        &:hover {
          color: #ea7034;
        }
      }
    }

    .tipping-message {
      position: relative;
      margin-bottom: 16px;

      textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 10px;
        border: 1px solid rgba(200, 200, 200, 0.6);
        border-radius: 8px;
        font-size: 13px;
        resize: vertical;
      }

      .message-counter {
        position: absolute;
        right: 8px;
        bottom: 6px;
        font-size: 11px;
        color: #999;
      }
    }

    .tipping-total {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #795548;

      strong {
        color: #ea7034;
        font-size: 18px;
      }

      .tip-hint {
        margin-left: auto;
        font-size: 12px;
        color: #999;
      }
    }

    .tipping-buttons {
      display: flex;
      justify-content: space-between;
      
      button {
        @include button-base;
        min-width: 100px;
        
        &:first-child {
          background-color: #f5f5f5;
          color: $text-color;
        }
        
        &:last-child {
          background-color: $accent-color;
          color: white;

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
