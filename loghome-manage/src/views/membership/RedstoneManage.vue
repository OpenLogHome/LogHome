<template>
  <div class="redstone-page">
    <div class="page-header">
      <div>
        <h2>红石余额管理</h2>
        <p>查询用户红石余额，发放或扣除红石并留存调整记录。</p>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索用户ID或昵称"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-input-number
          v-model="minBalance"
          class="filter-item"
          :min="0"
          :max="100000000"
          :controls="false"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-table v-loading="loading" :data="list" border style="width: 100%">
      <el-table-column prop="user_id" label="用户ID" width="110" />
      <el-table-column label="用户" min-width="180">
        <template slot-scope="scope">
          <div class="user-cell">
            <el-avatar :size="28" :src="scope.row.avatar_url">{{ scope.row.name }}</el-avatar>
            <span>{{ scope.row.name || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="redstone" label="红石余额" width="140">
        <template slot-scope="scope">
          <span class="redstone-amount">{{ scope.row.redstone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="log" label="原木余额" width="140">
        <template slot-scope="scope">
          {{ scope.row.log }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openTransactions(scope.row)">查看流水</el-button>
          <el-button type="text" size="small" @click="openAdjustDialog(scope.row)">调整余额</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="调整红石余额" :visible.sync="adjustDialogVisible" width="460px">
      <el-form ref="adjustForm" :model="adjustForm" :rules="adjustRules" label-width="90px">
        <el-form-item label="用户">
          <div class="adjust-user">
            {{ adjustForm.user_id }} · {{ adjustForm.user_name }}
            <span class="adjust-user__balance">当前余额：{{ adjustForm.current_balance }} 红石</span>
          </div>
        </el-form-item>
        <el-form-item label="调整数量" prop="amount">
          <el-input-number v-model="adjustForm.amount" :min="-1000000" :max="1000000" controls-position="right" />
          <div class="tip-text">正数发放红石，负数扣除红石，不能为 0。</div>
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input v-model="adjustForm.reason" maxlength="255" type="textarea" :rows="2" placeholder="例如：活动补偿、误扣退还、违规回收" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adjustDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="adjustLoading" @click="submitAdjust">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="红石流水" :visible.sync="txDialogVisible" width="760px">
      <div class="tx-header">
        <div>
          用户：{{ txUser.user_id }} · {{ txUser.user_name }}
          <span class="tx-header__balance">当前余额：{{ txUser.redstone }} 红石</span>
        </div>
        <el-select v-model="txType" class="tx-type-select" size="small" placeholder="流水类型" @change="fetchTransactions(1)">
          <el-option label="全部类型" value="" />
          <el-option label="会员发放" value="membership_grant" />
          <el-option label="升级发放" value="membership_upgrade_grant" />
          <el-option label="年付刷新" value="annual_refresh" />
          <el-option label="每月赠送" value="monthly_free_grant" />
          <el-option label="原木兑换" value="log_exchange" />
          <el-option label="AI消耗" value="ai_usage" />
          <el-option label="管理员调整" value="admin_adjustment" />
          <el-option label="到期扣减" value="expiration" />
          <el-option label="退款" value="refund" />
        </el-select>
      </div>
      <el-table v-loading="txLoading" :data="txList" border style="width: 100%">
        <el-table-column label="变动" width="110">
          <template slot-scope="scope">
            <span :class="Number(scope.row.amount) >= 0 ? 'tx-amount--positive' : 'tx-amount--negative'">
              {{ Number(scope.row.amount) > 0 ? '+' : '' }}{{ scope.row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="120">
          <template slot-scope="scope">
            {{ txTypeName(scope.row.transaction_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="220">
          <template slot-scope="scope">
            {{ scope.row.description || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="时间" width="170">
          <template slot-scope="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="txPage"
          :page-size="txPageSize"
          :total="txTotal"
          layout="total, prev, pager, next"
          @current-change="fetchTransactions"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RedstoneManage',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      keyword: '',
      minBalance: null,
      adjustDialogVisible: false,
      adjustLoading: false,
      adjustForm: {
        user_id: null,
        user_name: '',
        current_balance: 0,
        amount: 0,
        reason: ''
      },
      adjustRules: {
        amount: [
          { required: true, message: '请输入调整数量', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请填写调整原因', trigger: 'blur' }
        ]
      },
      txDialogVisible: false,
      txLoading: false,
      txList: [],
      txTotal: 0,
      txPage: 1,
      txPageSize: 10,
      txType: '',
      txUser: {
        user_id: null,
        user_name: '',
        redstone: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword,
        min_balance: this.minBalance === null || this.minBalance === undefined || this.minBalance === '' ? '' : this.minBalance
      }
      this.axios.get(this.$baseUrl + '/manage/redstone/accounts', { params })
        .then(response => {
          const data = response.data && response.data.data ? response.data.data : {}
          this.list = data.list || []
          this.total = Number(data.total || 0)
        }).catch(error => {
          console.error('获取红石账户失败', error)
          this.$message.error(this.getErrorMessage(error, '获取红石账户失败'))
        }).finally(() => {
          this.loading = false
        })
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    resetSearch() {
      this.keyword = ''
      this.minBalance = null
      this.handleSearch()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchData()
    },
    openAdjustDialog(row) {
      this.adjustForm = {
        user_id: row.user_id,
        user_name: row.name || '未知用户',
        current_balance: row.redstone || 0,
        amount: 0,
        reason: ''
      }
      this.adjustDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.adjustForm) {
          this.$refs.adjustForm.clearValidate()
        }
      })
    },
    submitAdjust() {
      this.$refs.adjustForm.validate(valid => {
        if (!valid) {
          return
        }
        const amount = Number(this.adjustForm.amount)
        if (!amount) {
          this.$message.warning('调整数量不能为 0')
          return
        }

        this.adjustLoading = true
        this.axios.post(this.$baseUrl + '/manage/redstone/adjust', {
          user_id: this.adjustForm.user_id,
          amount,
          reason: this.adjustForm.reason
        }).then(response => {
          const data = response.data && response.data.data ? response.data.data : {}
          this.adjustDialogVisible = false
          this.$message.success(`调整成功，用户当前余额 ${data.balance} 红石`)
          this.fetchData()
        }).catch(error => {
          console.error('调整红石余额失败', error)
          this.$message.error(this.getErrorMessage(error, '调整红石余额失败'))
        }).finally(() => {
          this.adjustLoading = false
        })
      })
    },
    openTransactions(row) {
      this.txUser = {
        user_id: row.user_id,
        user_name: row.name || '未知用户',
        redstone: row.redstone || 0
      }
      this.txType = ''
      this.txPage = 1
      this.txDialogVisible = true
      this.fetchTransactions(1)
    },
    fetchTransactions(page) {
      this.txPage = page || this.txPage
      this.txLoading = true
      this.axios.get(this.$baseUrl + '/manage/redstone/accounts/' + this.txUser.user_id + '/transactions', {
        params: {
          page: this.txPage,
          pageSize: this.txPageSize,
          type: this.txType
        }
      }).then(response => {
        const data = response.data && response.data.data ? response.data.data : {}
        this.txList = data.list || []
        this.txTotal = Number(data.total || 0)
      }).catch(error => {
        console.error('获取红石流水失败', error)
        this.$message.error(this.getErrorMessage(error, '获取红石流水失败'))
      }).finally(() => {
        this.txLoading = false
      })
    },
    txTypeName(type) {
      const map = {
        membership_grant: '会员发放',
        membership_upgrade_grant: '升级发放',
        annual_refresh: '年付刷新',
        monthly_free_grant: '每月赠送',
        log_exchange: '原木兑换',
        ai_usage: 'AI消耗',
        admin_adjustment: '管理员调整',
        expiration: '到期扣减',
        refund: '退款'
      }
      return map[type] || type || '--'
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
.redstone-page {
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.redstone-amount {
  font-weight: 600;
  color: #b87333;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.tip-text {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.adjust-user {
  font-size: 14px;

  &__balance {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
  }
}

.tx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  &__balance {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
  }
}

.tx-type-select {
  width: 140px;
}

.tx-amount--positive {
  font-weight: 600;
  color: #67c23a;
}

.tx-amount--negative {
  font-weight: 600;
  color: #f56c6c;
}
</style>
