<template>
  <div class="dashboard-page" v-loading="loading">
    <div class="hero-card">
      <div class="hero-copy">
        <div class="subtitle">原木罗盘系统</div>
        <div class="title">{{ getHello() }}</div>
        <div class="description">管理端已切换为运营工作台，聚焦待办、风控、资金处理和运营配置。</div>
      </div>
      <div class="hero-side">
        <div class="hero-metric">
          <span>实时在线用户</span>
          <strong>{{ onlineAmount }}</strong>
        </div>
        <div class="hero-update">最近刷新：{{ formatDate(lastUpdated) }}</div>
      </div>
    </div>

    <el-row :gutter="16" class="section-grid">
      <el-col v-for="item in overviewCards" :key="item.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="metric-card">
          <div class="metric-label">{{ item.label }}</div>
          <div class="metric-value">{{ item.value }}</div>
          <div class="metric-desc">{{ item.desc }}</div>
        </el-card>
      </el-col>
    </el-row>

    <div class="section-block">
      <div class="section-title-row">
        <h3>社区运营</h3>
        <el-button type="text" @click="jumpTo('/community-search-keywords')">进入社区运营</el-button>
      </div>
      <el-row :gutter="16" class="section-grid">
        <el-col v-for="item in communityCards" :key="item.label" :xs="24" :sm="12" :lg="8">
          <el-card shadow="hover" class="metric-card">
            <div class="metric-label">{{ item.label }}</div>
            <div class="metric-value">{{ item.value }}</div>
            <div class="metric-desc">{{ item.desc }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="section-block">
      <div class="section-title-row">
        <h3>支付运营</h3>
        <el-button type="text" @click="jumpTo('/earning-services')">进入支付运营</el-button>
      </div>
      <el-row :gutter="16" class="section-grid">
        <el-col v-for="item in paymentCards" :key="item.label" :xs="24" :sm="12" :lg="8">
          <el-card shadow="hover" class="metric-card">
            <div class="metric-label">{{ item.label }}</div>
            <div class="metric-value">{{ item.value }}</div>
            <div class="metric-desc">{{ item.desc }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="bottom-grid">
      <el-card shadow="hover" class="quick-card">
        <div slot="header" class="card-header">
          <span>快速处理</span>
        </div>
        <div class="quick-actions">
          <el-button v-for="item in quickActions" :key="item.path" plain @click="jumpTo(item.path)">
            {{ item.label }}
          </el-button>
        </div>
      </el-card>

      <el-card shadow="hover" class="quick-card">
        <div slot="header" class="card-header">
          <span>运营配置</span>
        </div>
        <div class="config-list">
          <div class="config-item">
            <span>生效弹窗海报</span>
            <strong>{{ summary.operations.activePopupPosters }}</strong>
          </div>
          <div class="config-item">
            <span>生效 Banner</span>
            <strong>{{ summary.operations.activeBanners }}</strong>
          </div>
          <div class="config-item">
            <span>待解决反馈</span>
            <strong>{{ summary.content.pendingFaqs }}</strong>
          </div>
          <div class="config-item">
            <span>待复审文章</span>
            <strong>{{ summary.content.pendingArticles }}</strong>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DashBoard',
  data() {
    return {
      user: { name: '管理员' },
      onlineAmount: 0,
      refreshInterval: undefined,
      loading: false,
      lastUpdated: null,
      summary: {
        content: {
          pendingFaqs: 0,
          pendingArticles: 0
        },
        community: {
          pendingReports: 0,
          pendingCircles: 0,
          pendingCommunityPosts: 0,
          searchKeywords: 0,
          recommendedKeywords: 0,
          sensitiveWords: 0
        },
        payments: {
          pendingRechargeOrders: 0,
          paidRechargeOrders: 0,
          pendingEarningServices: 0,
          unusedGiftCards: 0,
          exchangeRecords: 0
        },
        operations: {
          activeBanners: 0,
          activePopupPosters: 0
        }
      }
    }
  },
  computed: {
    overviewCards() {
      return [
        {
          label: '待解决反馈',
          value: this.summary.content.pendingFaqs,
          desc: '用户反馈和客服事项'
        },
        {
          label: '待复审文章',
          value: this.summary.content.pendingArticles,
          desc: '仍需运营侧继续处理'
        },
        {
          label: '待处理举报',
          value: this.summary.community.pendingReports,
          desc: '社区内容治理入口'
        },
        {
          label: '待处理提现',
          value: this.summary.payments.pendingEarningServices,
          desc: '支付与客服联动事项'
        }
      ]
    },
    communityCards() {
      return [
        {
          label: '待审圈子',
          value: this.summary.community.pendingCircles,
          desc: '新建圈子待审核'
        },
        {
          label: '待审社区帖子',
          value: this.summary.community.pendingCommunityPosts,
          desc: '社区内容待审核'
        },
        {
          label: '推荐关键词',
          value: this.summary.community.recommendedKeywords,
          desc: '正在前台承担引导曝光'
        },
        {
          label: '生效关键词',
          value: this.summary.community.searchKeywords,
          desc: '搜索运营词库规模'
        },
        {
          label: '敏感词数量',
          value: this.summary.community.sensitiveWords,
          desc: '社区风控基础词库'
        }
      ]
    },
    paymentCards() {
      return [
        {
          label: '待支付充值订单',
          value: this.summary.payments.pendingRechargeOrders,
          desc: '可能需要客服跟进'
        },
        {
          label: '已支付充值订单',
          value: this.summary.payments.paidRechargeOrders,
          desc: '作为支付运营基线'
        },
        {
          label: '未使用礼品卡',
          value: this.summary.payments.unusedGiftCards,
          desc: '可用于活动发放和补偿'
        },
        {
          label: '兑换记录',
          value: this.summary.payments.exchangeRecords,
          desc: '去皮原木兑换流水'
        }
      ]
    },
    quickActions() {
      return [
        { label: '处理提现申请', path: '/earning-services' },
        { label: '维护礼品卡', path: '/gift-cards' },
        { label: '运营搜索关键词', path: '/community-search-keywords' },
        { label: '维护敏感词', path: '/community-audit-tools' },
        { label: '配置弹窗海报', path: '/popup-posters' },
        { label: '配置 Banner', path: '/banners' }
      ]
    }
  },
  mounted() {
    const user = JSON.parse(window.localStorage.getItem('UserInfo'))
    if (user) {
      this.user = user
    }
    this.fetchUserProfile()
    this.fetchDashboardData()
    this.refreshInterval = setInterval(() => {
      this.fetchDashboardData()
    }, 15000)
  },
  beforeDestroy() {
    clearInterval(this.refreshInterval)
  },
  methods: {
    fetchUserProfile() {
      this.axios.get(this.$baseUrl + '/users/userprofile').then(res => {
        if (res.data) {
          this.user = JSON.parse(JSON.stringify(res.data))
        }
      }).catch(error => {
        if (error.message === 'Request failed with status code 401') {
          window.localStorage.removeItem('token')
          this.$message({
            showClose: true,
            message: '登录信息过期，请重新登录',
            type: 'error'
          })
        }
      })
    },
    fetchDashboardData() {
      this.loading = true
      const onlineRequest = this.axios.get(this.$baseUrl + '/get_online_amount').catch(() => ({ data: 0 }))
      const summaryRequest = this.axios.get(this.$baseUrl + '/manage/dashboard/summary').catch(error => {
        console.error('获取运营总览失败', error)
        return { data: null, error: error }
      })

      Promise.all([onlineRequest, summaryRequest]).then(results => {
        const onlineResponse = results[0]
        const summaryResponse = results[1]
        this.onlineAmount = Number(onlineResponse.data || 0)

        if (summaryResponse.data) {
          this.summary = Object.assign({}, this.summary, summaryResponse.data)
          this.lastUpdated = new Date()
        } else if (summaryResponse.error) {
          this.$message.error('获取运营总览失败')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    jumpTo(path) {
      this.$router.push(path)
    },
    formatDate(value) {
      if (!value) {
        return '--'
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    getHello() {
      const hour = new Date().getHours()
      const userName = this.user && this.user.name ? this.user.name : '管理员'
      if (hour < 6) {
        return userName + '，夜深了，先看重点待办。'
      }
      if (hour < 9) {
        return userName + '，早上好，先处理高优先级事项。'
      }
      if (hour < 12) {
        return userName + '，上午好，运营数据已经刷新。'
      }
      if (hour < 14) {
        return userName + '，中午好，留意提现和举报待办。'
      }
      if (hour < 19) {
        return userName + '，下午好，重点关注社区和支付异常。'
      }
      if (hour < 22) {
        return userName + '，晚上好，适合收口今天的运营事项。'
      }
      return userName + '，夜间值守请先看异常队列。'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 24px;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 28px 32px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6d4c41 0%, #8d6e63 55%, #b08968 100%);
  color: #fff;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 15px;
  opacity: 0.9;
}

.title {
  margin-top: 10px;
  font-size: 32px;
  font-weight: 700;
}

.description {
  margin-top: 12px;
  max-width: 640px;
  line-height: 1.7;
  opacity: 0.95;
}

.hero-side {
  min-width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.hero-metric {
  text-align: right;

  span {
    display: block;
    font-size: 14px;
    opacity: 0.85;
  }

  strong {
    display: block;
    margin-top: 10px;
    font-size: 40px;
  }
}

.hero-update {
  font-size: 13px;
  opacity: 0.85;
}

.section-grid {
  margin-bottom: 4px;
}

.section-block {
  margin-top: 8px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 20px;
    color: #3e2723;
  }
}

.metric-card {
  margin-bottom: 16px;

  .metric-label {
    color: #8c8c8c;
    font-size: 14px;
  }

  .metric-value {
    margin-top: 10px;
    font-size: 30px;
    font-weight: 700;
    color: #5d4037;
  }

  .metric-desc {
    margin-top: 8px;
    line-height: 1.6;
    font-size: 13px;
    color: #999;
  }
}

.bottom-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.quick-card {
  min-height: 220px;
}

.card-header {
  font-weight: 600;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f1f1f1;

  &:last-child {
    border-bottom: none;
  }

  span {
    color: #606266;
  }

  strong {
    font-size: 24px;
    color: #6d4c41;
  }
}

@media (max-width: 960px) {
  .hero-card {
    flex-direction: column;
    gap: 20px;
  }

  .hero-side {
    align-items: flex-start;
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
