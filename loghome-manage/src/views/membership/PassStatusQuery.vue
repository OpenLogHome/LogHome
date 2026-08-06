<template>
  <div class="pass-status-page">
    <div class="page-header">
      <div>
        <h2>通行证状态查询</h2>
        <p>查看所有已开通通行证的用户，或按用户ID、昵称精确查询订阅状态与历史。</p>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="输入用户ID或昵称"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-select v-model="activeStatus" class="filter-item" placeholder="通行证状态">
          <el-option label="全部状态" value="" />
          <el-option label="生效中" value="active" />
          <el-option label="未生效" value="inactive" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="mode-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="已开通通行证用户" name="all">
        <el-table v-loading="passUsersLoading" :data="passUsers" border style="width: 100%">
          <el-table-column prop="user_id" label="用户ID" width="100" />
          <el-table-column label="用户" min-width="170">
            <template slot-scope="scope">
              <div class="user-cell">
                <el-avatar :size="28" :src="scope.row.avatar_url">{{ scope.row.name }}</el-avatar>
                <span>{{ scope.row.name || '--' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="档位" width="150">
            <template slot-scope="scope">
              <el-tag :type="scope.row.membership_type === 'super' ? 'danger' : 'primary'" effect="plain" size="small">
                {{ tierName(scope.row.membership_type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="通行证状态" width="110">
            <template slot-scope="scope">
              <el-tag :type="Number(scope.row.is_current_active) ? 'success' : 'info'" size="small">
                {{ Number(scope.row.is_current_active) ? '生效中' : '未生效' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="周期" width="90">
            <template slot-scope="scope">
              {{ cycleName(scope.row.billing_cycle) }}
            </template>
          </el-table-column>
          <el-table-column label="开通时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.starts_at) }}
            </template>
          </el-table-column>
          <el-table-column label="到期时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.expires_at) }}
            </template>
          </el-table-column>
          <el-table-column label="自动续费" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.auto_renew" type="warning" size="small">开启</el-tag>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="loadStatus(scope.row.user_id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="passUsersPage"
            :page-size="passUsersPageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="passUsersTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePassUsersSizeChange"
            @current-change="handlePassUsersCurrentChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="按条件搜索" name="search">
        <el-card v-if="searched && userResults.length === 0" shadow="never" class="empty-card">
          <el-empty description="未找到匹配的用户" />
        </el-card>
        <el-table v-if="userResults.length > 0" v-loading="searchLoading" :data="userResults" border style="width: 100%">
          <el-table-column label="用户ID" prop="user_id" width="120" />
          <el-table-column label="昵称" min-width="160">
            <template slot-scope="scope">
              <div class="user-cell">
                <el-avatar :size="28" :src="scope.row.avatar_url">{{ scope.row.name }}</el-avatar>
                <span>{{ scope.row.name || '--' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="Number(scope.row.activated) ? 'success' : 'info'" size="small">
                {{ Number(scope.row.activated) ? '正常' : '未激活' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="loadStatus(scope.row.user_id)">查看通行证</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <template v-if="statusLoaded">
      <el-card shadow="never" class="user-card">
        <div class="user-info">
          <el-avatar :size="48" :src="userInfo.avatar_url">{{ userInfo.name }}</el-avatar>
          <div class="user-info__copy">
            <div class="user-info__name">
              {{ userInfo.name || '--' }}
              <el-tag :type="Number(userInfo.activated) ? 'success' : 'info'" size="small">
                {{ Number(userInfo.activated) ? '正常' : '未激活' }}
              </el-tag>
            </div>
            <div class="user-info__meta">用户ID：{{ userInfo.user_id }}</div>
          </div>
          <el-button type="primary" plain size="small" @click="backToSearch">返回列表</el-button>
        </div>
      </el-card>

      <el-card shadow="never" class="status-card">
        <div class="section-title">当前通行证状态</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="通行证状态">
            <el-tag :type="passActive ? 'success' : 'info'">
              {{ passActive ? '生效中' : '未开通 / 已过期' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="会员档位">
            {{ currentSub ? tierName(currentSub.membership_type) : '--' }}
          </el-descriptions-item>
          <el-descriptions-item label="订阅周期">
            {{ currentSub ? cycleName(currentSub.billing_cycle) : '--' }}
          </el-descriptions-item>
          <el-descriptions-item label="开通时间">
            {{ currentSub ? formatDate(currentSub.starts_at) : '--' }}
          </el-descriptions-item>
          <el-descriptions-item label="到期时间">
            {{ currentSub ? formatDate(currentSub.expires_at) : '--' }}
          </el-descriptions-item>
          <el-descriptions-item label="自动续费">
            <el-tag v-if="currentSub" :type="currentSub.auto_renew ? 'warning' : 'info'" size="small">
              {{ currentSub.auto_renew ? '开启' : '关闭' }}
            </el-tag>
            <span v-else>--</span>
          </el-descriptions-item>
          <el-descriptions-item label="原木余额">
            {{ statusData.log_balance }} 原木
          </el-descriptions-item>
          <el-descriptions-item label="升级报价" :span="2">
            <template v-if="statusData.upgrade_quote">
              {{ statusData.upgrade_quote.cost_log }} 原木升级至超级原木通行证
            </template>
            <template v-else>--</template>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card shadow="never" class="history-card">
        <div class="section-title">
          订阅历史
          <el-tag size="mini" type="info" class="section-tag">{{ historyTotal }} 条</el-tag>
        </div>
        <el-table v-loading="historyLoading" :data="historyList" border style="width: 100%">
          <el-table-column prop="subscription_id" label="订阅ID" width="110" />
          <el-table-column label="档位" width="150">
            <template slot-scope="scope">
              <el-tag :type="scope.row.membership_type === 'super' ? 'danger' : 'primary'" effect="plain" size="small">
                {{ tierName(scope.row.membership_type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="周期" width="100">
            <template slot-scope="scope">
              {{ cycleName(scope.row.billing_cycle) }}
            </template>
          </el-table-column>
          <el-table-column label="来源" width="120">
            <template slot-scope="scope">
              {{ sourceName(scope.row.source) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="historyStatusTagType(scope.row.status)" size="small">
                {{ historyStatusName(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="开通时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.starts_at) }}
            </template>
          </el-table-column>
          <el-table-column label="到期时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.expires_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="order_no" label="订单号" min-width="180">
            <template slot-scope="scope">
              {{ scope.row.order_no || '--' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="historyPage"
            :page-size="historyPageSize"
            :page-sizes="[10, 20, 50]"
            :total="historyTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleHistorySizeChange"
            @current-change="handleHistoryCurrentChange"
          />
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PassStatusQuery',
  data() {
    return {
      keyword: '',
      activeStatus: '',
      activeTab: 'all',
      searched: false,
      searchLoading: false,
      userResults: [],
      passUsersLoading: false,
      passUsers: [],
      passUsersTotal: 0,
      passUsersPage: 1,
      passUsersPageSize: 20,
      statusLoaded: false,
      userInfo: {},
      statusData: {},
      historyLoading: false,
      historyList: [],
      historyTotal: 0,
      historyPage: 1,
      historyPageSize: 10
    }
  },
  created() {
    this.fetchPassUsers()
  },
  computed: {
    passActive() {
      return Boolean(this.statusData.active)
    },
    currentSub() {
      return this.statusData.subscription || null
    }
  },
  methods: {
    fetchPassUsers() {
      this.passUsersLoading = true
      this.axios.get(this.$baseUrl + '/manage/membership/pass-users', {
        params: {
          page: this.passUsersPage,
          pageSize: this.passUsersPageSize,
          keyword: this.keyword,
          status: this.activeStatus
        }
      }).then(response => {
        const data = response.data && response.data.data ? response.data.data : {}
        this.passUsers = data.list || []
        this.passUsersTotal = Number(data.total || 0)
      }).catch(error => {
        console.error('获取已开通用户失败', error)
        this.$message.error(this.getErrorMessage(error, '获取已开通用户失败'))
      }).finally(() => {
        this.passUsersLoading = false
      })
    },
    handlePassUsersCurrentChange(page) {
      this.passUsersPage = page
      this.fetchPassUsers()
    },
    handlePassUsersSizeChange(size) {
      this.passUsersPageSize = size
      this.passUsersPage = 1
      this.fetchPassUsers()
    },
    handleTabClick(tab) {
      if (tab.name === 'all') {
        this.fetchPassUsers()
      }
    },
    handleSearch() {
      if (this.activeTab === 'all') {
        this.passUsersPage = 1
        this.fetchPassUsers()
        return
      }
      if (!this.keyword.trim()) {
        this.$message.warning('请输入用户ID或昵称')
        return
      }
      this.searched = true
      this.searchLoading = true
      this.axios.get(this.$baseUrl + '/manage/membership/users/search', {
        params: {
          keyword: this.keyword.trim(),
          page: 1,
          pageSize: 20
        }
      }).then(response => {
        const data = response.data && response.data.data ? response.data.data : {}
        this.userResults = data.list || []
      }).catch(error => {
        console.error('搜索用户失败', error)
        this.$message.error(this.getErrorMessage(error, '搜索用户失败'))
      }).finally(() => {
        this.searchLoading = false
      })
    },
    resetSearch() {
      this.keyword = ''
      this.activeStatus = ''
      this.searched = false
      this.userResults = []
      this.passUsersPage = 1
      this.fetchPassUsers()
    },
    backToSearch() {
      this.statusLoaded = false
    },
    loadStatus(userId) {
      this.statusLoaded = true
      this.statusData = {}
      this.userInfo = {}
      this.historyList = []
      this.historyTotal = 0
      this.historyPage = 1
      this.fetchStatus(userId)
    },
    fetchStatus(userId) {
      this.axios.get(this.$baseUrl + '/manage/membership/users/' + userId + '/status')
        .then(response => {
          const data = response.data && response.data.data ? response.data.data : {}
          this.userInfo = data.user || {}
          this.statusData = data.status || {}
        }).catch(error => {
          console.error('获取通行证状态失败', error)
          this.$message.error(this.getErrorMessage(error, '获取通行证状态失败'))
        })
      this.fetchHistory(userId)
    },
    fetchHistory(userId) {
      this.historyLoading = true
      this.axios.get(this.$baseUrl + '/manage/membership/subscriptions', {
        params: {
          user_id: userId,
          page: this.historyPage,
          pageSize: this.historyPageSize
        }
      }).then(response => {
        const data = response.data && response.data.data ? response.data.data : {}
        this.historyList = data.list || []
        this.historyTotal = Number(data.total || 0)
      }).catch(error => {
        console.error('获取订阅历史失败', error)
        this.$message.error(this.getErrorMessage(error, '获取订阅历史失败'))
      }).finally(() => {
        this.historyLoading = false
      })
    },
    handleHistoryCurrentChange(page) {
      this.historyPage = page
      if (this.userInfo.user_id) {
        this.fetchHistory(this.userInfo.user_id)
      }
    },
    handleHistorySizeChange(size) {
      this.historyPageSize = size
      this.historyPage = 1
      if (this.userInfo.user_id) {
        this.fetchHistory(this.userInfo.user_id)
      }
    },
    tierName(type) {
      return type === 'super' ? '超级原木通行证' : type === 'standard' ? '原木通行证' : type || '--'
    },
    cycleName(cycle) {
      const map = {
        monthly: '月付',
        yearly: '年付',
        custom: '自定义'
      }
      return map[cycle] || cycle || '--'
    },
    sourceName(source) {
      const map = {
        purchase: '购买',
        gift: '赠送',
        redeem_code: '兑换码',
        auto_renewal: '自动续费',
        admin: '管理员',
        migration: '迁移'
      }
      return map[source] || source || '--'
    },
    historyStatusName(status) {
      const map = {
        active: '生效中',
        expired: '已过期',
        replaced: '已替换',
        cancelled: '已取消'
      }
      return map[status] || status || '--'
    },
    historyStatusTagType(status) {
      const map = {
        active: 'success',
        expired: 'info',
        replaced: 'warning',
        cancelled: 'danger'
      }
      return map[status] || 'info'
    },
    formatDate(value) {
      if (!value) {
        return '--'
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    getErrorMessage(error, fallback) {
      if (error && error.response && error.response.data && error.response.data.msg) {
        return error.response.data.msg
      }
      return fallback
    }
  }
}
</script>

<style lang="scss" scoped>
.pass-status-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0;
    color: #8c8c8c;
  }
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  width: 160px;
}

.keyword-input {
  width: 320px;
}

.mode-tabs {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;

  .section-tag {
    margin-left: 8px;
  }
}

.empty-card,
.user-list-card,
.user-card,
.status-card,
.history-card {
  margin-bottom: 20px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;

  &__copy {
    flex: 1;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
  }

  &__meta {
    margin-top: 4px;
    font-size: 13px;
    color: #909399;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
