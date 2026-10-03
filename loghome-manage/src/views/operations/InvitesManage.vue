<template>
  <div class="invites-page">
    <div class="page-header">
      <div>
        <h2>邀请码体系</h2>
        <p>查看邀请码、邀请记录与回归资格，并可配置邀请奖励参数。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 邀请记录 -->
      <el-tab-pane label="邀请记录" name="records">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-select v-model="recordTypeFilter" style="width: 140px" @change="fetchRecords">
              <el-option label="全部类型" value="" />
              <el-option label="新用户" value="new" />
              <el-option label="回归用户" value="return" />
            </el-select>
            <el-button @click="fetchRecords">刷新</el-button>
          </div>
        </el-card>
        <el-table :data="records" border v-loading="recordsLoading" style="width: 100%">
          <el-table-column prop="record_id" label="ID" width="80" />
          <el-table-column prop="inviter_name" label="邀请人" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.inviter_name || scope.row.inviter_id }}
            </template>
          </el-table-column>
          <el-table-column prop="invitee_name" label="被邀请人" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.invitee_name || scope.row.invitee_id }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.invite_type === 'new' ? 'success' : 'warning'" size="small">
                {{ scope.row.invite_type === 'new' ? '新用户' : '回归' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.create_time) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 邀请码 -->
      <el-tab-pane label="邀请码" name="codes">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input
              v-model="codeKeyword"
              clearable
              class="keyword-input"
              placeholder="搜索用户昵称 / 邀请码 / 用户ID"
              @keyup.enter.native="fetchCodes"
            >
              <el-button slot="append" icon="el-icon-search" @click="fetchCodes"></el-button>
            </el-input>
            <el-button type="primary" @click="fetchCodes">查询</el-button>
          </div>
        </el-card>
        <el-table :data="codes" border v-loading="codesLoading" style="width: 100%">
          <el-table-column prop="user_id" label="用户ID" width="90" />
          <el-table-column prop="name" label="用户" min-width="130" show-overflow-tooltip />
          <el-table-column prop="invite_code" label="邀请码" width="120" />
          <el-table-column prop="new_user_count" label="累计新用户" width="110" />
          <el-table-column prop="return_user_count" label="累计回归" width="110" />
          <el-table-column prop="last_month_new_count" label="本月新用户" width="110" />
          <el-table-column prop="last_month_return_count" label="本月回归" width="110" />
          <el-table-column prop="last_reset_time" label="最近重置" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.last_reset_time) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 回归资格 -->
      <el-tab-pane label="回归资格" name="eligibility">
        <div class="tab-toolbar">
          <el-button type="primary" @click="openGrantDialog">发放回归资格</el-button>
          <el-select v-model="eligibilityFilter" style="width: 140px; margin-left: 12px" @change="fetchEligibility">
            <el-option label="全部" value="" />
            <el-option label="未使用" :value="0" />
            <el-option label="已使用" :value="1" />
          </el-select>
        </div>
        <el-table :data="eligibilityList" border v-loading="eligibilityLoading" style="width: 100%">
          <el-table-column prop="eligibility_id" label="ID" width="90" />
          <el-table-column prop="user_id" label="用户ID" width="90" />
          <el-table-column prop="name" label="用户" min-width="130" show-overflow-tooltip />
          <el-table-column prop="expiry_date" label="有效期至" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.expiry_date) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.is_used === 1 ? 'info' : 'success'" size="small">
                {{ scope.row.is_used === 1 ? '已使用' : '未使用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="use_time" label="使用时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.use_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="danger-text" @click="handleDeleteEligibility(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 奖励配置 -->
      <el-tab-pane label="奖励配置" name="settings">
        <el-card shadow="never" v-loading="settingsLoading" style="max-width: 640px">
          <el-form label-width="180px">
            <el-form-item label="新用户邀请奖励（原木）">
              <el-input-number v-model="settingsForm.new_user_reward" :min="0" controls-position="right" style="width: 100%" />
              <div class="form-tip">被邀请人注册 14 天内填写邀请码后，双方各获得该数量的原木</div>
            </el-form-item>
            <el-form-item label="回归用户邀请奖励（原木）">
              <el-input-number v-model="settingsForm.return_user_reward" :min="0" controls-position="right" style="width: 100%" />
              <div class="form-tip">90 天以上未登录的回归用户填写邀请码后，双方各获得该数量的原木</div>
            </el-form-item>
            <el-form-item label="每月邀请上限（人）">
              <el-input-number v-model="settingsForm.monthly_limit" :min="1" controls-position="right" style="width: 100%" />
              <div class="form-tip">单个用户每月最多成功邀请的人数</div>
            </el-form-item>
          </el-form>
          <div class="settings-actions">
            <el-button type="primary" :loading="settingsSaving" @click="saveSettings">保存配置</el-button>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 发放回归资格对话框 -->
    <el-dialog title="发放回归资格" :visible.sync="grantDialogVisible" width="560px">
      <el-form label-width="100px">
        <el-form-item label="选择用户" required>
          <el-select
            v-model="grantUserId"
            filterable
            remote
            :remote-method="searchUsers"
            :loading="userSearchLoading"
            placeholder="输入用户昵称或ID搜索"
            style="width: 100%"
          >
            <el-option v-for="user in userSearchResults" :key="user.user_id" :label="`${user.name}（ID: ${user.user_id}）`" :value="user.user_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效天数" required>
          <el-input-number v-model="grantExpiryDays" :min="1" :max="3650" controls-position="right" style="width: 100%" />
          <div class="form-tip">资格过期前使用均有效，默认 90 天</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="grantDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="grantLoading" :disabled="!grantUserId" @click="submitGrant">发 放</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'InvitesManage',
  data() {
    return {
      activeTab: 'records',
      // 邀请记录
      recordsLoading: false,
      records: [],
      recordTypeFilter: '',
      // 邀请码
      codesLoading: false,
      codes: [],
      codeKeyword: '',
      // 回归资格
      eligibilityLoading: false,
      eligibilityList: [],
      eligibilityFilter: '',
      grantDialogVisible: false,
      grantLoading: false,
      grantUserId: null,
      grantExpiryDays: 90,
      userSearchLoading: false,
      userSearchResults: [],
      // 奖励配置
      settingsLoading: false,
      settingsSaving: false,
      settingsForm: {
        new_user_reward: 1000,
        return_user_reward: 500,
        monthly_limit: 10
      }
    }
  },
  created() {
    this.fetchRecords()
    this.fetchCodes()
    this.fetchEligibility()
    this.fetchSettings()
  },
  methods: {
    fetchRecords() {
      this.recordsLoading = true
      this.axios.get(this.$baseUrl + '/manage/invites/records', {
        params: { invite_type: this.recordTypeFilter }
      }).then(response => {
        this.records = response.data || []
      }).catch(error => {
        console.error('获取邀请记录失败', error)
        this.$message.error('获取邀请记录失败')
      }).finally(() => {
        this.recordsLoading = false
      })
    },
    fetchCodes() {
      this.codesLoading = true
      this.axios.get(this.$baseUrl + '/manage/invites/codes', {
        params: { keyword: this.codeKeyword }
      }).then(response => {
        this.codes = response.data || []
      }).catch(error => {
        console.error('获取邀请码失败', error)
        this.$message.error('获取邀请码失败')
      }).finally(() => {
        this.codesLoading = false
      })
    },
    fetchEligibility() {
      this.eligibilityLoading = true
      this.axios.get(this.$baseUrl + '/manage/invites/eligibility', {
        params: { is_used: this.eligibilityFilter }
      }).then(response => {
        this.eligibilityList = response.data || []
      }).catch(error => {
        console.error('获取回归资格失败', error)
        this.$message.error('获取回归资格失败')
      }).finally(() => {
        this.eligibilityLoading = false
      })
    },
    openGrantDialog() {
      this.grantUserId = null
      this.grantExpiryDays = 90
      this.userSearchResults = []
      this.grantDialogVisible = true
    },
    searchUsers(keyword) {
      this.userSearchLoading = true
      this.axios.get(this.$baseUrl + '/manage/community/users/list', {
        params: { keyword: keyword, limit: 20 }
      }).then(response => {
        this.userSearchResults = response.data || []
      }).catch(error => {
        console.error('搜索用户失败', error)
      }).finally(() => {
        this.userSearchLoading = false
      })
    },
    submitGrant() {
      this.grantLoading = true
      this.axios.post(this.$baseUrl + '/manage/invites/eligibility', {
        user_id: this.grantUserId,
        expiry_days: this.grantExpiryDays
      }).then(() => {
        this.$message.success('回归资格已发放')
        this.grantDialogVisible = false
        this.fetchEligibility()
      }).catch(error => {
        this.$message.error((error.response && error.response.data && error.response.data.msg) || '发放失败')
      }).finally(() => {
        this.grantLoading = false
      })
    },
    handleDeleteEligibility(row) {
      this.$confirm(`确定删除该用户的回归资格吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/invites/eligibility/' + row.eligibility_id)
          .then(() => {
            this.$message.success('已删除')
            this.fetchEligibility()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    fetchSettings() {
      this.settingsLoading = true
      this.axios.get(this.$baseUrl + '/manage/invites/settings').then(response => {
        const list = response.data || []
        const form = { ...this.settingsForm }
        list.forEach(item => {
          if (form[item.setting_key] !== undefined) {
            form[item.setting_key] = item.setting_value
          }
        })
        this.settingsForm = form
      }).catch(error => {
        console.error('获取奖励配置失败', error)
        this.$message.error('获取奖励配置失败')
      }).finally(() => {
        this.settingsLoading = false
      })
    },
    saveSettings() {
      this.settingsSaving = true
      this.axios.put(this.$baseUrl + '/manage/invites/settings', {
        settings: [
          { setting_key: 'new_user_reward', setting_value: this.settingsForm.new_user_reward, description: '新用户邀请奖励（原木）' },
          { setting_key: 'return_user_reward', setting_value: this.settingsForm.return_user_reward, description: '回归用户邀请奖励（原木）' },
          { setting_key: 'monthly_limit', setting_value: this.settingsForm.monthly_limit, description: '每月邀请上限（人）' }
        ]
      }).then(() => {
        this.$message.success('奖励配置已保存')
        this.fetchSettings()
      }).catch(error => {
        console.error('保存奖励配置失败', error)
        this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
      }).finally(() => {
        this.settingsSaving = false
      })
    },
    formatDate(value) {
      if (!value) {
        return '--'
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped lang="scss">
.invites-page {
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
    color: #909399;
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

.keyword-input {
  width: 280px;
}

.tab-toolbar {
  margin-bottom: 20px;
}

.settings-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

.danger-text {
  color: #f56c6c;
}
</style>
