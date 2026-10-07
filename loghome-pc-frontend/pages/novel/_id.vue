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
        <div class="novel-cover" v-if="novel.picUrl" :style="`background-image: url(${novel.picUrl})`"></div>
        <div class="novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`"></div>
        <div class="book-id-tag">ID {{ novel.novel_id }}</div>
        
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
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ formatNumber(novel.clicks || 0) }}</span>
              <span class="stat-label">阅读量</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ formatNumber(nice_amount || 0) }}</span>
              <span class="stat-label">喜欢</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📃</span>
              <span class="stat-value">{{ formatNumber(novel.text_count || 0) }}</span>
              <span class="stat-label">字数</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📚</span>
              <span class="stat-value">{{ novel.is_complete == 1 ? "已完结" : "连载中" }}</span>
              <span class="stat-label">状态</span>
            </div>
          </div>
          
          <div class="novel-tags">
            <span class="tag" v-for="tag in tags" :key="tag.tag_id" :class="{ 'activity': tag.is_activity_tag }">{{
              tag.tag_name }}</span>
          </div>
          
          <div class="novel-actions">
            <button class="action-button primary reading-button" @click="startReading" v-if="chapters.length > 0">
              <div class="reading-info">
                <span>{{ historyShown > 1 ? '继续阅读' : '开始阅读' }}</span>
                <small v-if="historyShown > 1">已读 {{ Math.min((historyShown / chapters.length * 100), 100).toFixed(0) }}%</small>
              </div>
              <div class="progress-indicator" v-if="historyShown > 1">
                <div class="progress-bar" :style="{ width: `${Math.min((historyShown / chapters.length * 100), 100)}%` }"></div>
              </div>
            </button>
            <button class="action-button" @click="toggleLike">
              <span v-if="isInBookcase">已收藏</span>
              <span v-else>收藏</span>
            </button>
            <button class="action-button" @click="tip">打赏</button>
            <button class="action-button" @click="shareBook">分享</button>
          </div>
        </div>
      </div>

      <!-- 原木力榜 -->
      <div class="novel-rank" v-show="novelRank.onRank">
        <nuxt-link to="/read/collections?title=原木力爆棚" class="rank-info">
          实时<LogPowerWordmark />榜第
          <span class="rank-number">{{ novelRank.rank }}</span>
          位
        </nuxt-link>
        <nuxt-link to="/read/collections?title=原木力爆棚" class="rank-value">
          {{ novelRank.ranking }}
        </nuxt-link>
      </div>
      
      <div class="novel-content">
        <div class="content-tabs">
          <button class="tab-button" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">
            作品简介
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'chapters' }" @click="activeTab = 'chapters'">
            章节目录 ({{ chapters.length }})
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
            读者评论 ({{ commentAmount }})
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'worlds' }" @click="activeTab = 'worlds'" v-if="worlds.length > 0">
            世界设定 ({{ worlds.length }})
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'fans' }" @click="activeTab = 'fans'" v-if="fanInfo.length > 0">
            粉丝榜
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'activities' }" @click="activeTab = 'activities'" v-if="activityNewsList.length > 0">
            创作活动 ({{ activityNewsList.length }})
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 作品简介 -->
          <div v-show="activeTab === 'intro'" class="intro-content">
            <p v-if="novel.content">{{ novel.content }}</p>
            <p v-else class="empty-content">暂无简介</p>
          </div>
          
          <!-- 章节目录 -->
          <div v-show="activeTab === 'chapters'" class="chapters-content">
            <div v-if="chapters.length === 0" class="empty-content">
              暂无章节
            </div>
            <div v-else class="chapter-list">
              <nuxt-link v-for="chapter in chapters" :key="chapter.article_id" :to="`/article/${chapter.article_id}`"
                class="chapter-item">
                <span class="chapter-number">{{ chapter.article_chapter }}</span>
                <span class="chapter-title">{{ chapter.title }}</span>
                <span class="chapter-date">{{ formatDate(chapter.update_time) }}</span>
              </nuxt-link>
            </div>
          </div>
          
          <!-- 读者评论 -->
          <div v-show="activeTab === 'comments'" class="comments-content">
            <div v-if="commentInfo.length === 0" class="empty-content">
              <p>这本书还没有评论哦，快去抢沙发</p>
          </div>
            <div v-else class="comment-list">
              <div class="comment-item" v-for="comment in commentInfo" :key="comment.essay_comment_id">
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-footer">
                  <span class="comment-author">{{ comment.name }}</span>
                  <span class="comment-likes">
                    <span class="like-icon">❤️</span>
                    {{ comment.likeNum }}
                  </span>
        </div>
      </div>
            </div>
            <div @click="showAllComments" class="view-all-comments">
              查看全部评论 ({{ commentAmount }})
            </div>
    </div>
    
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
                <nuxt-link :to="`/novel/${world.novel_id}`" class="world-link"></nuxt-link>
              </div>
            </div>
          </div>
          
          <!-- 粉丝榜标签页 -->
          <div v-show="activeTab === 'fans'" class="fans-content">
            <NovelFansList ref="fansList" :novelId="novel.novel_id" :limit="3" />
          </div>

          <!-- 创作活动标签页 -->
          <div v-show="activeTab === 'activities'" class="activities-content">
            <div class="activity-group" v-for="activity in activityNewsList" :key="activity.tag_id">
              <div class="activity-group-head">
                <span class="activity-group-name">{{ activity.activity_name }}</span>
                <span class="activity-group-status" :class="activity.is_active == 1 ? 'ongoing' : 'ended'">
                  {{ activity.is_active == 1 ? '进行中' : '已结束' }}
                </span>
              </div>
              <div class="activity-news-item" v-for="(news, newsIndex) in activity.news" :key="newsIndex"
                @click="openActivityNews(news)">
                <span class="activity-news-item-title">{{ news.title }}</span>
                <span class="activity-news-item-arrow">›</span>
              </div>
              <div class="activity-popularity" v-if="activity.popularity && activity.popularity.enabled">
                <div class="activity-popularity-info">
                  <span class="activity-popularity-count">人气票 {{ activity.popularity.votes }}</span>
                  <span class="activity-popularity-reason" v-if="popularityHint(activity)">{{ popularityHint(activity) }}</span>
                </div>
                <button class="activity-popularity-btn" :class="{ disabled: popularityBtnDisabled(activity) }"
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
          <nuxt-link :to="`/novel/${novel.novel_id}`" class="mini-novel-link"></nuxt-link>
        </div>
      </div>
    </div>

    <!-- 打赏弹窗 -->
    <div class="tipping-popup" v-if="showTippingPopup" @click.self="closeTipping">
      <div class="tipping-content">
        <h3>打赏作者</h3>

        <div class="tipping-balance">
          <span class="balance-item"><i class="res-icon res-log"></i>原木 {{ resources.log }}</span>
          <span class="balance-item"><i class="res-icon res-apple"></i>苹果 {{ resources.apple }}</span>
        </div>

        <div class="tipping-options">
          <div
            class="tipping-item"
            v-for="item in tippingList"
            :key="item.item_name"
            :class="{ selected: selectedTippingItem && selectedTippingItem.item_name === item.item_name }"
            @click="selectedTippingItem = item"
          >
            <span class="item-name">{{ item.item_name }}</span>
            <img class="item-image" :src="item.img_url" :alt="item.item_name">
            <span class="item-cost">
              <i class="res-icon" :class="item.is_log_free ? 'res-apple' : 'res-log'"></i>
              {{ item.item_cost }}
            </span>
          </div>
        </div>

        <div class="tipping-amount">
          <span class="amount-label">数量</span>
          <button class="amount-btn" @click="decreaseTipAmount">-</button>
          <input class="amount-input" type="number" v-model.number="tippingAmount" min="1" max="9999">
          <button class="amount-btn" @click="increaseTipAmount">+</button>
          <span
            class="amount-quick"
            v-for="quick in quickAmounts"
            :key="quick.value"
            @click="tippingAmount = quick.value"
          >{{ quick.label }}</span>
        </div>

        <div class="tipping-message">
          <textarea
            v-model="tippingMessage"
            maxlength="50"
            rows="2"
            placeholder="添加留言..."
          ></textarea>
          <span class="message-counter">{{ tippingMessage.length }}/50</span>
        </div>

        <div class="tipping-total">
          总计
          <i class="res-icon" :class="isAppleTipping ? 'res-apple' : 'res-log'"></i>
          <strong>{{ totalTipCost }}</strong>
          <span class="tip-hint" v-if="selectedTippingItem && !isAppleTipping">作者可得 {{ Math.floor(totalTipCost / 2) }} 原木收益</span>
        </div>

        <div class="tipping-buttons">
          <button @click="closeTipping">取消</button>
          <button :disabled="tipping || !selectedTippingItem" @click="confirmTip">
            {{ tipping ? '打赏中...' : '确认打赏' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LogPowerWordmark from '~/components/LogPowerWordmark.vue'
import NovelFansList from '~/components/NovelFansList.vue'

export default {
  components: {
    LogPowerWordmark,
    NovelFansList
  },
  async asyncData({ params, $api, error, redirect }) {
    try {
      // 获取小说详情 - 用于SEO的服务端渲染
      const novel = await $api.novels.getNovelById(params.id)
      if (!novel || novel.length === 0) {
        return error({ statusCode: 404, message: '找不到该小说' })
      }

      const novelData = novel[0]

      // 如果是设定书，则应当跳转到世界设定查看页面
      if (novelData.novel_type === "world") {
        return redirect(`/world/${novelData.novel_id}`)
      }

      // 获取章节列表 - 用于SEO的服务端渲染
      const chapters = await $api.articles.getArticles(novelData.novel_id)
      
      // 获取小说标签 - 用于SEO的服务端渲染
      const tags = await $api.novels.getNovelTags(novelData.novel_id)

      // 返回服务端渲染所需的数据
      return {
        error: null,
        novel: novelData,
        chapters: chapters || [],
        tags: tags || []
      }
    } catch (err) {
      console.error('服务端获取小说数据失败', err)
      return error({ statusCode: 500, message: '加载小说数据失败，请稍后重试' })
    }
  },
  data() {
    return {
      error: null,
      activeTab: 'intro',
      isInBookcase: false,
      recommendedNovels: [],
      history: 1,
      progressArticle: {},
      commentInfo: [],
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
      showTippingPopup: false,
      giftImage: "",
      tippingList: [],
      selectedTippingItem: null,
      tippingAmount: 1,
      tippingMessage: "",
      tipping: false,
      resources: { log: 0, apple: 0 },
      quickAmounts: [
        { label: '一心一意', value: 1 },
        { label: '十全十美', value: 10 },
        { label: '六六大顺', value: 66 },
        { label: '天长地久', value: 99 },
        { label: '爱的告白', value: 520 }
      ],
      userInfo: null,
      isLogin: false,
      activityNews: [],
      popularityStatus: {},
      isVotingPopularity: false
    }
  },
  head() {
    return {
      title: this.novel?.name ? `${this.novel.name} - 原木社区` : '小说详情 - 原木社区',
      meta: [
        { hid: 'description', name: 'description', content: this.novel?.content ? this.novel.content.substring(0, 150) : '原木社区小说详情页' },
        { hid: 'keywords', name: 'keywords', content: this.tags.map(tag => tag.tag_name).join(',') || '小说,原木社区,阅读' }
      ]
    }
  },
  computed: {
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
      let his = 0;
      for (let item of this.chapters) {
        his++;
        if (item.article_chapter == this.history) {
          return his;
        }
      }
      return this.history;
    },
    // is_log_free 的礼物用苹果支付，其余用原木
    isAppleTipping() {
      return !!(this.selectedTippingItem && this.selectedTippingItem.is_log_free)
    },
    safeTipAmount() {
      const amount = Math.floor(Number(this.tippingAmount))
      if (!amount || amount < 1) return 1
      return Math.min(amount, 9999)
    },
    totalTipCost() {
      if (!this.selectedTippingItem) return 0
      return this.selectedTippingItem.item_cost * this.safeTipAmount
    },
    payableBalance() {
      return this.isAppleTipping ? this.resources.apple : this.resources.log
    }
  },
  async mounted() {
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
    async fetchClientData() {
      try {
        // 获取推荐小说
        const allNovels = await this.$api.novels.getAllNovels()
        this.recommendedNovels = allNovels
          .filter(n => n.novel_id !== this.novel.novel_id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 6)

        // 获取喜欢数和状态
        this.getNices()

        // 获取评论数量
        this.getCommentNum()

        // 获取评论列表
        this.getNovelComments()

        // 获取粉丝统计
        this.getFansStatistics()

        // 获取关联世界
        this.getWorlds()

        // 检查排行榜
        this.checkNovelRank()

        // 检查收藏状态
        this.checkBookcaseStatus()

        // 获取创作活动新闻与人气票状态
        this.getNovelActivityNews()
        this.getPopularityStatus()

        // 获取阅读进度
        this.getReadingProgress()

        // 添加到阅读历史
        this.addReaderHistory(this.novel)

      } catch (error) {
        console.error('获取客户端数据失败', error)
      } finally {

      }
    },
        
    // 获取小说标签
    async getNovelTags() {
      try {
        const tags = await this.$api.novels.getNovelTags(this.novel.novel_id)
        this.tags = tags || []
      } catch (error) {
        console.error('获取标签失败', error)
      }
    },

    // 获取评论数量
    async getCommentNum() {
      try {
        const res = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id)
        if (res && res.length > 0) {
          this.commentAmount = res[0]['COUNT(*)']
        }
      } catch (error) {
        console.error('获取评论数量失败', error)
      }
    },

    // 获取评论列表
    async getNovelComments() {
      try {
        const comments = await this.$api.community.getNovelComments(this.novel.novel_id)
        this.commentInfo = comments.slice(0, 3)
      } catch (error) {
        console.error('获取评论失败', error)
      }
    },

    // 获取喜欢数和状态
    async getNices() {
      try {
        // 获取喜欢数
        const nices = await this.$api.novels.getNicesById(this.novel.novel_id)
        if (nices && nices.length > 0) {
          this.nice_amount = nices[0].nices
        }

        // 获取当前用户喜欢状态
        if (localStorage.getItem("token")) {
          const status = await this.$api.novels.getNiceStatus(this.novel.novel_id)
          if (status && status.length > 0 && status[0].nices === 1) {
            this.niceStatus = true
          }
        }
      } catch (error) {
        console.error('获取喜欢状态失败', error)
      }
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
      try {
        const list = await this.$api.library.getNovelActivityNews(this.novel.novel_id)
        this.activityNews = Array.isArray(list) ? list : []
      } catch (error) {
        console.error('获取创作活动新闻失败', error)
        this.activityNews = []
      }
    },

    // 打开活动新闻链接
    openActivityNews(news) {
      if (news.pc_link && process.client) {
        window.open(news.pc_link, '_blank')
      }
    },

    // 获取当前用户在各活动中的人气票状态
    async getPopularityStatus() {
      try {
        const list = await this.$api.popularity.getNovelStatus(this.novel.novel_id)
        const map = {}
        ;(Array.isArray(list) ? list : []).forEach(item => {
          map[item.tag_id] = item
        })
        this.popularityStatus = map
      } catch (error) {
        console.error('获取人气票状态失败', error)
        this.popularityStatus = {}
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
      this.isVotingPopularity = true
      try {
        await this.$api.popularity.vote(this.novel.novel_id, activity.tag_id)
        this.$message.success('已为本书投出 1 票')
        this.getPopularityStatus()
        this.getNovelActivityNews()
      } catch (error) {
        this.$message.error(error.message || '投票失败，请稍后重试')
        this.getPopularityStatus()
      } finally {
        this.isVotingPopularity = false
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
    getReadingProgress() {
      // 从本地存储获取阅读进度
      const readingHistory = localStorage.getItem(`ReaderHistory_${this.novel.novel_id}`)
      if (readingHistory) {
        this.history = parseInt(readingHistory)
      }

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
    addReaderHistory(book) {
      try {
        let readerHistory = JSON.parse(localStorage.getItem("loghomeReaderHistory")) || []

        // 移除已有的相同书籍记录
        readerHistory = readerHistory.filter(item => item.novel_id !== book.novel_id)

        // 添加到历史记录
        readerHistory.push(book)

        // 只保留最近的10本书
        if (readerHistory.length > 10) {
          readerHistory = readerHistory.slice(-10)
        }

        localStorage.setItem("loghomeReaderHistory", JSON.stringify(readerHistory))
      } catch (error) {
        console.error('保存阅读历史失败', error)
      }
    },
    
    // 检查登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLogin = !!token
      return this.isLogin
    },
    
    // 获取用户信息
    async getUserInfo() {
      if (!this.isLogin) return null
      
      try {
        if (!this.userInfo) {
          const userInfoResponse = await this.$api.users.getUserProfile()
          if (userInfoResponse) {
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
      if (this.chapters.length === 0) {
        this.$message.info("本书还没有章节")
        return
      }

      if (this.history === 1) {
        // 从第一章开始
        this.$router.push(`/article/${this.chapters[0].article_id}`)
      } else {
        // 从历史章节继续
        let targetArticleId = this.chapters[0].article_id

        for (const chapter of this.chapters) {
          if (chapter.article_chapter == this.history) {
            targetArticleId = chapter.article_id
            break
          }
        }

        this.$router.push(`/article/${targetArticleId}`)
      }
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

    // 点赞小说
    async nice() {
      if (!localStorage.getItem("token")) {
        this.$router.push('/login')
        return
      }

      try {
        await this.$api.novels.niceNovel(this.novel.novel_id)
        this.getNices()
      } catch (error) {
        console.error('点赞失败', error)
        this.$message.error("操作失败，请稍后重试")
      }
    },

    // 打赏功能
    async tip() {
      if (!localStorage.getItem("token")) {
        this.$router.push('/login')
        return
      }

      const userInfo = await this.getUserInfo()
      if (!userInfo) {
        this.$router.push('/login')
        return
      }

      if (Number(userInfo.user_id) === Number(this.novel.auther_id)) {
        this.$message.info("不能给自己的书打赏哦")
        return
      }

      this.showTippingPopup = true

      if (this.tippingList.length === 0) {
        this.tippingList = await this.$api.library.getTippingList()
        if (this.tippingList.length === 0) {
          this.$message.error('打赏列表加载失败')
          this.showTippingPopup = false
          return
        }
        this.selectedTippingItem = this.tippingList[0]
      }
      this.resources = await this.$api.resources.getResourceBalances()
      if (!this.tippingMessage) {
        this.tippingMessage = await this.$api.library.getFanMessage(this.novel.novel_id)
      }
    },

    closeTipping() {
      this.showTippingPopup = false
    },

    decreaseTipAmount() {
      if (this.safeTipAmount > 1) this.tippingAmount = this.safeTipAmount - 1
    },

    increaseTipAmount() {
      if (this.safeTipAmount >= 9999) {
        this.$message.info('数量不能超过9999')
        return
      }
      this.tippingAmount = this.safeTipAmount + 1
    },

    // 确认打赏
    async confirmTip() {
      if (this.tipping || !this.selectedTippingItem) return

      if (this.payableBalance < this.totalTipCost) {
        this.$message.error(`${this.isAppleTipping ? '苹果' : '原木'}余额不足`)
        return
      }

      this.tipping = true
      const item = this.selectedTippingItem
      const message = this.tippingMessage.trim()
      try {
        await this.$api.library.tipNovel({
          from_id: Number(this.userInfo.user_id),
          novel_id: this.novel.novel_id,
          item_name: item.item_name,
          item_amount: this.safeTipAmount,
          item_cost: item.item_cost,
          resource_name: this.isAppleTipping ? 'apple' : 'log'
        })

        this.$message.success(`成功打赏 ${this.safeTipAmount} 个${item.item_name}`)
        this.showTippingPopup = false
        if (message) {
          this.$api.library.updateFanMessage(this.novel.novel_id, message)
        }
        this.runGiftAnimation(item.img_url)
        this.resources = await this.$api.resources.getResourceBalances()
        this.getFansStatistics()
        if (this.$refs.fansList) {
          this.$refs.fansList.getFansList()
        }
      } catch (error) {
        console.error('打赏失败', error)
        this.$message.error(error.message || '打赏失败，请稍后重试')
      } finally {
        this.tipping = false
      }
    },

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

    async showAllComments() {
      if (!localStorage.getItem('token')) {
        this.$router.push("/login")
        return
      }
      await this.$openMobileWindow(`/pages/readers/bookComment?id=${this.novel.novel_id}`, {
        title: '小说评论',
        width: 500,
        height: 800
      })
    }
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
$accent-color: #EA7034;
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