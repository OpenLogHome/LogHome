<template>
  <div class="earning-services-page">
    <div class="page-header">
      <div>
        <h2>提现申请处理</h2>
        <p>集中处理业务端发起的提现申请，补齐运营客服与支付履约链路。</p>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索用户ID、昵称、账号或微信号"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-select v-model="status" class="filter-item" placeholder="处理状态">
          <el-option label="待处理" value="pending" />
          <el-option label="已处理" value="finished" />
          <el-option label="全部" value="" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-table v-loading="loading" :data="list" border style="width: 100%">
      <el-table-column prop="service_id" label="申请ID" width="90" />
      <el-table-column label="用户信息" width="200">
        <template slot-scope="scope">
          <div class="user-info">
            <el-avatar :size="36" :src="scope.row.avatar_url"></el-avatar>
            <div class="user-copy">
              <div>{{ scope.row.name || ('用户#' + scope.row.user_id) }}</div>
              <div class="sub-copy">ID: {{ scope.row.user_id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="money_amount" label="提现金额(元)" width="130">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.money_amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="wechat" label="微信号" min-width="180" />
      <el-table-column label="申请时间" width="180">
        <template slot-scope="scope">
          {{ formatDate(getRequestTime(scope.row)) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="Number(scope.row.finished) ? 'success' : 'warning'">
            {{ Number(scope.row.finished) ? '已处理' : '待处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="处理结果" min-width="240" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.result || '待处理' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="!Number(scope.row.finished)"
            type="text"
            size="small"
            @click="openFinishDialog(scope.row)"
          >
            完成处理
          </el-button>
          <span v-else class="finished-copy">已完成</span>
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

    <el-dialog title="完成提现申请" :visible.sync="dialogVisible" width="520px">
      <div v-if="currentRow" class="dialog-summary">
        <div class="summary-item"><span>申请ID</span><strong>{{ currentRow.service_id }}</strong></div>
        <div class="summary-item"><span>用户</span><strong>{{ currentRow.name || ('用户#' + currentRow.user_id) }}</strong></div>
        <div class="summary-item"><span>提现金额</span><strong>{{ formatMoney(currentRow.money_amount) }}</strong></div>
        <div class="summary-item"><span>微信号</span><strong>{{ currentRow.wechat }}</strong></div>
      </div>
      <el-form ref="finishForm" :model="finishForm" :rules="finishRules" label-width="90px">
        <el-form-item label="处理结果" prop="result">
          <el-input
            v-model="finishForm.result"
            type="textarea"
            :rows="4"
            placeholder="请输入处理结果，例如已转账、已联系用户补充信息等"
          />
        </el-form-item>
        <el-form-item label="发送通知">
          <el-switch v-model="finishForm.send_message" active-text="是" inactive-text="否" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitFinish">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'EarningServicesManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      keyword: '',
      status: 'pending',
      dialogVisible: false,
      currentRow: null,
      finishForm: {
        result: '',
        send_message: true
      },
      finishRules: {
        result: [
          { required: true, message: '请输入处理结果', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/bank/earning-services', {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keyword,
          status: this.status
        }
      }).then(response => {
        const data = response.data && response.data.data ? response.data.data : {}
        this.list = data.list || []
        this.total = Number(data.total || 0)
      }).catch(error => {
        console.error('获取提现申请失败', error)
        this.$message.error(this.getErrorMessage(error, '获取提现申请失败'))
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
      this.status = 'pending'
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
    openFinishDialog(row) {
      this.currentRow = row
      this.finishForm = {
        result: row.result || '提现已处理完成',
        send_message: true
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.finishForm) {
          this.$refs.finishForm.clearValidate()
        }
      })
    },
    submitFinish() {
      this.$refs.finishForm.validate(valid => {
        if (!valid || !this.currentRow) {
          return
        }

        this.submitLoading = true
        this.axios.post(
          this.$baseUrl + '/manage/bank/earning-services/' + this.currentRow.service_id + '/finish',
          this.finishForm
        ).then(() => {
          this.$message.success('提现申请已完成处理')
          this.dialogVisible = false
          this.fetchData()
        }).catch(error => {
          console.error('处理提现申请失败', error)
          this.$message.error(this.getErrorMessage(error, '处理提现申请失败'))
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
    getRequestTime(row) {
      return row.start_time || row.create_time || row.update_time
    },
    formatDate(value) {
      if (!value) {
        return '--'
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    formatMoney(value) {
      const number = Number(value || 0)
      return number.toFixed(2)
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
.earning-services-page {
  padding: 20px;
}

.page-header {
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
  width: 340px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-copy {
  margin-left: 10px;
}

.sub-copy {
  margin-top: 4px;
  color: #999;
  font-size: 12px;
}

.finished-copy {
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-summary {
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f7f4f2;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    color: #8c8c8c;
  }
}
</style>
