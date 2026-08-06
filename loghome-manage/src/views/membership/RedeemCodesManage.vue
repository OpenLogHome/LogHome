<template>
  <div class="redeem-codes-page">
    <div class="page-header">
      <div>
        <h2>通行证兑换码管理</h2>
        <p>创建与追踪原木通行证兑换码，用于活动发放和运营补偿。</p>
      </div>
      <el-button type="primary" @click="openCreateDialog">创建兑换码</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索兑换码"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-select v-model="status" class="filter-item" placeholder="状态">
          <el-option label="全部" value="" />
          <el-option label="生效中" value="active" />
          <el-option label="已禁用" value="disabled" />
          <el-option label="已用尽" value="exhausted" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-table v-loading="loading" :data="list" border style="width: 100%">
      <el-table-column label="兑换码" min-width="150">
        <template slot-scope="scope">
          <span class="code-hint">{{ scope.row.code_hint }}</span>
        </template>
      </el-table-column>
      <el-table-column label="档位" width="140">
        <template slot-scope="scope">
          <el-tag :type="scope.row.membership_type === 'super' ? 'danger' : 'primary'" effect="plain">
            {{ tierName(scope.row.membership_type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="90">
        <template slot-scope="scope">
          {{ scope.row.duration_days }} 天
        </template>
      </el-table-column>
      <el-table-column label="使用情况" width="120">
        <template slot-scope="scope">
          {{ scope.row.used_count }} / {{ scope.row.usage_limit }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="statusTagType(scope.row.status)">{{ statusName(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" width="170">
        <template slot-scope="scope">
          {{ scope.row.expires_at ? formatDate(scope.row.expires_at) : '不失效' }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="140">
        <template slot-scope="scope">
          {{ scope.row.remark || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="170">
        <template slot-scope="scope">
          {{ formatDate(scope.row.created_at) }}
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

    <el-dialog title="创建兑换码" :visible.sync="createDialogVisible" width="480px">
      <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="90px">
        <el-form-item label="会员档位" prop="membership_type">
          <el-select v-model="createForm.membership_type" class="dialog-select">
            <el-option label="原木通行证" value="standard" />
            <el-option label="超级原木通行证" value="super" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效天数" prop="duration_days">
          <el-input-number v-model="createForm.duration_days" :min="1" :max="3650" controls-position="right" />
        </el-form-item>
        <el-form-item label="创建数量" prop="count">
          <el-input-number v-model="createForm.count" :min="1" :max="100" controls-position="right" />
          <div class="tip-text">单次最多创建 100 个兑换码。</div>
        </el-form-item>
        <el-form-item label="失效时间" prop="expires_at">
          <el-date-picker
            v-model="createForm.expires_at"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="留空表示不失效"
            class="dialog-select"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="createForm.remark" maxlength="255" placeholder="例如：双十二活动" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitCreate">创 建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新创建的兑换码" :visible.sync="resultDialogVisible" width="640px">
      <div class="result-header">
        <div>
          已创建 {{ createdCodes.length }} 个{{ tierName(resultMeta.membership_type) }}兑换码（{{ resultMeta.duration_days }}天），
          可直接复制发放给用户。
        </div>
        <el-button type="primary" plain size="mini" @click="copyAllCreated">复制全部兑换码</el-button>
      </div>
      <el-table :data="createdCodes" border style="width: 100%">
        <el-table-column prop="code" label="兑换码" min-width="260">
          <template slot-scope="scope">
            <span class="code-text">{{ scope.row }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="copyCode(scope.row)">复制</el-button>
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
  name: 'RedeemCodesManage',
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
      createdCodes: [],
      resultMeta: {
        membership_type: 'standard',
        duration_days: 0
      },
      createForm: {
        membership_type: 'standard',
        duration_days: 30,
        count: 1,
        expires_at: '',
        remark: ''
      },
      createRules: {
        membership_type: [
          { required: true, message: '请选择会员档位', trigger: 'change' }
        ],
        duration_days: [
          { required: true, message: '请输入有效天数', trigger: 'change' }
        ],
        count: [
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
      this.axios.get(this.$baseUrl + '/manage/membership/redeem-codes', {
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
        console.error('获取兑换码失败', error)
        this.$message.error(this.getErrorMessage(error, '获取兑换码失败'))
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
        membership_type: 'standard',
        duration_days: 30,
        count: 1,
        expires_at: '',
        remark: ''
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
        this.axios.post(this.$baseUrl + '/manage/membership/redeem-codes', this.createForm)
          .then(response => {
            const data = response.data && response.data.data ? response.data.data : {}
            this.createdCodes = data.list || []
            this.resultMeta = {
              membership_type: data.membership_type || this.createForm.membership_type,
              duration_days: data.duration_days || this.createForm.duration_days
            }
            this.createDialogVisible = false
            this.resultDialogVisible = true
            this.$message.success('兑换码已创建')
            this.fetchData()
          }).catch(error => {
            console.error('创建兑换码失败', error)
            this.$message.error(this.getErrorMessage(error, '创建兑换码失败'))
          }).finally(() => {
            this.submitLoading = false
          })
      })
    },
    tierName(type) {
      return type === 'super' ? '超级原木通行证' : '原木通行证'
    },
    statusName(status) {
      const map = {
        active: '生效中',
        disabled: '已禁用',
        exhausted: '已用尽'
      }
      return map[status] || status || '--'
    },
    statusTagType(status) {
      const map = {
        active: 'success',
        disabled: 'info',
        exhausted: 'warning'
      }
      return map[status] || 'info'
    },
    copyCode(code) {
      this.$copyText(code).then(() => {
        this.$message.success('兑换码已复制')
      }).catch(() => {
        this.$message.error('复制失败，请手动复制')
      })
    },
    copyAllCreated() {
      const content = this.createdCodes.join('\n')
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
.redeem-codes-page {
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

.code-hint {
  font-family: Consolas, monospace;
  letter-spacing: 1px;
}

.code-text {
  font-family: Consolas, monospace;
  letter-spacing: 1px;
  font-weight: 600;
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

.dialog-select {
  width: 100%;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
