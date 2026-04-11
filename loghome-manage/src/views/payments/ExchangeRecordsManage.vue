<template>
  <div class="exchange-records-page">
    <div class="page-header">
      <div>
        <h2>原木兑换记录</h2>
        <p>查看去皮原木兑换流水，便于运营核对兑换行为和异常订单。</p>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索订单号、用户ID或昵称"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-table v-loading="loading" :data="list" border style="width: 100%">
      <el-table-column prop="payment_id" label="兑换订单号" min-width="220" />
      <el-table-column prop="log_amount" label="兑换数量" width="120" />
      <el-table-column label="用户信息" width="200">
        <template slot-scope="scope">
          <div class="user-info">
            <el-avatar :size="34" :src="scope.row.avatar_url"></el-avatar>
            <div class="user-copy">
              <div>{{ scope.row.name || ('用户#' + scope.row.user_id) }}</div>
              <div class="sub-copy">ID: {{ scope.row.user_id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
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
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ExchangeRecordsManage',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      keyword: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/bank/exchange-records', {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keyword
        }
      }).then(response => {
        const data = response.data && response.data.data ? response.data.data : {}
        this.list = data.list || []
        this.total = Number(data.total || 0)
      }).catch(error => {
        console.error('获取兑换记录失败', error)
        this.$message.error(this.getErrorMessage(error, '获取兑换记录失败'))
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
    getStatusText(status) {
      const map = {
        created: '待处理',
        paid: '已完成',
        cancelled: '已取消'
      }
      return map[status] || '未知'
    },
    getStatusType(status) {
      const map = {
        created: 'warning',
        paid: 'success',
        cancelled: 'info'
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
.exchange-records-page {
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
  width: 320px;
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
