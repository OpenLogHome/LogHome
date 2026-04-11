<template>
  <div class="gift-cards-page">
    <div class="page-header">
      <div>
        <h2>礼品卡管理</h2>
        <p>创建与追踪原木礼品卡，支撑活动发放、客服补偿和兑换运营。</p>
      </div>
      <el-button type="primary" @click="openCreateDialog">创建礼品卡</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索卡密、使用用户或昵称"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-select v-model="status" class="filter-item" placeholder="使用状态">
          <el-option label="全部" value="" />
          <el-option label="未使用" value="unused" />
          <el-option label="已使用" value="used" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-table v-loading="loading" :data="list" border style="width: 100%">
      <el-table-column label="卡密" min-width="180">
        <template slot-scope="scope">
          <div class="card-code-cell">
            <span class="card-code">{{ scope.row.card_code }}</span>
            <el-button type="text" size="small" @click="copyCode(scope.row.card_code)">复制</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="log_amount" label="原木数量" width="120" />
      <el-table-column label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="Number(scope.row.is_used) ? 'success' : 'warning'">
            {{ Number(scope.row.is_used) ? '已使用' : '未使用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="used_by" label="使用用户ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.used_by || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="used_user_name" label="使用用户" width="150">
        <template slot-scope="scope">
          {{ scope.row.used_user_name || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="使用时间" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.used_time) }}
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

    <el-dialog title="创建礼品卡" :visible.sync="createDialogVisible" width="460px">
      <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="90px">
        <el-form-item label="原木数量" prop="log_amount">
          <el-input-number v-model="createForm.log_amount" :min="1" :max="100000" controls-position="right" />
        </el-form-item>
        <el-form-item label="创建数量" prop="quantity">
          <el-input-number v-model="createForm.quantity" :min="1" :max="100" controls-position="right" />
          <div class="tip-text">单次最多创建 100 张礼品卡。</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitCreate">创 建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新创建的礼品卡" :visible.sync="resultDialogVisible" width="640px">
      <div class="result-header">
        <div>已创建 {{ createdCards.length }} 张礼品卡，可直接复制给运营同学使用。</div>
        <el-button type="primary" plain size="mini" @click="copyAllCreated">复制全部卡密</el-button>
      </div>
      <el-table :data="createdCards" border style="width: 100%">
        <el-table-column prop="card_code" label="卡密" min-width="220" />
        <el-table-column prop="log_amount" label="原木数量" width="120" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="copyCode(scope.row.card_code)">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resultDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GiftCardsManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      keyword: '',
      status: '',
      createDialogVisible: false,
      resultDialogVisible: false,
      createdCards: [],
      createForm: {
        log_amount: 100,
        quantity: 1
      },
      createRules: {
        log_amount: [
          { required: true, message: '请输入原木数量', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入创建数量', trigger: 'change' }
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
      this.axios.get(this.$baseUrl + '/manage/bank/gift-cards', {
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
        console.error('获取礼品卡失败', error)
        this.$message.error(this.getErrorMessage(error, '获取礼品卡失败'))
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
      this.status = ''
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
    openCreateDialog() {
      this.createForm = {
        log_amount: 100,
        quantity: 1
      }
      this.createDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.createForm) {
          this.$refs.createForm.clearValidate()
        }
      })
    },
    submitCreate() {
      this.$refs.createForm.validate(valid => {
        if (!valid) {
          return
        }

        this.submitLoading = true
        this.axios.post(this.$baseUrl + '/manage/bank/gift-cards', this.createForm)
          .then(response => {
            const data = response.data && response.data.data ? response.data.data : {}
            this.createdCards = data.list || []
            this.createDialogVisible = false
            this.resultDialogVisible = true
            this.$message.success('礼品卡已创建')
            this.fetchData()
          }).catch(error => {
            console.error('创建礼品卡失败', error)
            this.$message.error(this.getErrorMessage(error, '创建礼品卡失败'))
          }).finally(() => {
            this.submitLoading = false
          })
      })
    },
    copyCode(code) {
      this.$copyText(code).then(() => {
        this.$message.success('卡密已复制')
      }).catch(() => {
        this.$message.error('复制失败，请手动复制')
      })
    },
    copyAllCreated() {
      const content = this.createdCards.map(item => item.card_code).join('\n')
      if (!content) {
        return
      }
      this.copyCode(content)
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
.gift-cards-page {
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

.card-code-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-code {
  font-family: Consolas, monospace;
  letter-spacing: 1px;
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

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
