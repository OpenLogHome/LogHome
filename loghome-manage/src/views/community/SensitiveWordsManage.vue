<template>
  <div class="audit-tools-page">
    <div class="page-header">
      <div>
        <h2>敏感词与审核日志</h2>
        <p>维护社区敏感词，查看运营审核动作，形成可追踪的风控闭环。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="敏感词管理" name="words">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input
              v-model="wordKeyword"
              clearable
              class="filter-item word-input"
              placeholder="搜索敏感词"
              @keyup.enter.native="handleWordsSearch"
            >
              <el-button slot="append" icon="el-icon-search" @click="handleWordsSearch"></el-button>
            </el-input>
            <el-button type="primary" @click="openWordDialog()">新增敏感词</el-button>
            <el-button @click="handleWordsSearch">刷新</el-button>
          </div>
        </el-card>

        <el-table v-loading="wordsLoading" :data="wordsList" border style="width: 100%">
          <el-table-column prop="word_id" label="ID" width="80" />
          <el-table-column prop="word" label="敏感词" min-width="220" />
          <el-table-column label="等级" width="120">
            <template slot-scope="scope">
              <el-tag :type="getLevelTagType(scope.row.level)">{{ getLevelText(scope.row.level) }}</el-tag>
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
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openWordDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="small" class="danger-text" @click="handleDeleteWord(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            :current-page="wordsPage"
            :page-size="wordsPageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="wordsTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleWordsSizeChange"
            @current-change="handleWordsCurrentChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="审核日志" name="logs">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-select v-model="logsTargetType" clearable class="filter-item" placeholder="目标类型">
              <el-option label="全部目标" value="" />
              <el-option label="圈子" :value="1" />
              <el-option label="帖子" :value="2" />
              <el-option label="评论" :value="3" />
              <el-option label="圈子成员" :value="4" />
            </el-select>
            <el-select v-model="logsAction" clearable class="filter-item" placeholder="操作类型">
              <el-option label="全部操作" value="" />
              <el-option label="通过" :value="1" />
              <el-option label="拒绝" :value="2" />
              <el-option label="启用" :value="3" />
              <el-option label="禁用/删除" :value="4" />
              <el-option label="设为精华" :value="5" />
              <el-option label="禁言" :value="6" />
              <el-option label="踢出" :value="7" />
              <el-option label="审核入圈" :value="8" />
            </el-select>
            <el-button type="primary" @click="handleLogsSearch">查询</el-button>
            <el-button @click="resetLogsSearch">重置</el-button>
          </div>
        </el-card>

        <el-table v-loading="logsLoading" :data="logsList" border style="width: 100%">
          <el-table-column prop="log_id" label="日志ID" width="90" />
          <el-table-column label="操作人" width="180">
            <template slot-scope="scope">
              <div class="operator-info">
                <el-avatar :size="32" :src="scope.row.operator_avatar"></el-avatar>
                <span>{{ scope.row.operator_name || ('管理员#' + scope.row.user_id) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="目标类型" width="130">
            <template slot-scope="scope">
              <el-tag effect="plain">{{ getTargetTypeText(scope.row.target_type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="target_id" label="目标ID" width="100" />
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-tag :type="getActionTagType(scope.row.action)">{{ getActionText(scope.row.action) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="原因" min-width="260" show-overflow-tooltip />
          <el-table-column label="时间" width="180">
            <template slot-scope="scope">
              {{ formatDate(scope.row.create_time) }}
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            :current-page="logsPage"
            :page-size="logsPageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="logsTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleLogsSizeChange"
            @current-change="handleLogsCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="wordDialogTitle" :visible.sync="wordDialogVisible" width="480px" @close="resetWordForm">
      <el-form ref="wordForm" :model="wordForm" :rules="wordRules" label-width="90px">
        <el-form-item label="敏感词" prop="word">
          <el-input v-model="wordForm.word" maxlength="50" placeholder="请输入敏感词" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="wordForm.level" placeholder="请选择敏感等级" style="width: 100%">
            <el-option label="一级 - 提醒" :value="1" />
            <el-option label="二级 - 高风险" :value="2" />
            <el-option label="三级 - 封禁" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="wordDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="wordSubmitting" @click="submitWordForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SensitiveWordsManage',
  data() {
    return {
      activeTab: 'words',
      wordsLoading: false,
      wordsList: [],
      wordsTotal: 0,
      wordsPage: 1,
      wordsPageSize: 20,
      wordKeyword: '',
      wordDialogVisible: false,
      wordDialogTitle: '新增敏感词',
      wordSubmitting: false,
      wordForm: {
        word_id: null,
        word: '',
        level: 1
      },
      wordRules: {
        word: [
          { required: true, message: '请输入敏感词', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择等级', trigger: 'change' }
        ]
      },
      logsLoading: false,
      logsList: [],
      logsTotal: 0,
      logsPage: 1,
      logsPageSize: 20,
      logsTargetType: '',
      logsAction: ''
    }
  },
  created() {
    this.fetchWords()
    this.fetchLogs()
  },
  methods: {
    handleTabChange() {
      if (this.activeTab === 'words' && !this.wordsList.length) {
        this.fetchWords()
      }
      if (this.activeTab === 'logs' && !this.logsList.length) {
        this.fetchLogs()
      }
    },
    fetchWords() {
      this.wordsLoading = true
      this.axios.get(this.$baseUrl + '/manage/community/audit/sensitive-words', {
        params: {
          page: this.wordsPage,
          pageSize: this.wordsPageSize,
          keyword: this.wordKeyword
        }
      }).then(response => {
        const data = response.data || {}
        this.wordsList = data.list || []
        this.wordsTotal = Number(data.total || 0)
      }).catch(error => {
        console.error('获取敏感词失败', error)
        this.$message.error(this.getErrorMessage(error, '获取敏感词失败'))
      }).finally(() => {
        this.wordsLoading = false
      })
    },
    fetchLogs() {
      this.logsLoading = true
      this.axios.get(this.$baseUrl + '/manage/community/audit/logs', {
        params: {
          page: this.logsPage,
          pageSize: this.logsPageSize,
          target_type: this.logsTargetType,
          action: this.logsAction
        }
      }).then(response => {
        const data = response.data || {}
        this.logsList = data.list || []
        this.logsTotal = Number(data.total || 0)
      }).catch(error => {
        console.error('获取审核日志失败', error)
        this.$message.error(this.getErrorMessage(error, '获取审核日志失败'))
      }).finally(() => {
        this.logsLoading = false
      })
    },
    handleWordsSearch() {
      this.wordsPage = 1
      this.fetchWords()
    },
    handleWordsCurrentChange(page) {
      this.wordsPage = page
      this.fetchWords()
    },
    handleWordsSizeChange(size) {
      this.wordsPageSize = size
      this.wordsPage = 1
      this.fetchWords()
    },
    handleLogsSearch() {
      this.logsPage = 1
      this.fetchLogs()
    },
    resetLogsSearch() {
      this.logsTargetType = ''
      this.logsAction = ''
      this.handleLogsSearch()
    },
    handleLogsCurrentChange(page) {
      this.logsPage = page
      this.fetchLogs()
    },
    handleLogsSizeChange(size) {
      this.logsPageSize = size
      this.logsPage = 1
      this.fetchLogs()
    },
    openWordDialog(row) {
      if (row) {
        this.wordDialogTitle = '编辑敏感词'
        this.wordForm = {
          word_id: row.word_id,
          word: row.word,
          level: Number(row.level) || 1
        }
      } else {
        this.wordDialogTitle = '新增敏感词'
        this.wordForm = {
          word_id: null,
          word: '',
          level: 1
        }
      }
      this.wordDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.wordForm) {
          this.$refs.wordForm.clearValidate()
        }
      })
    },
    resetWordForm() {
      if (this.$refs.wordForm) {
        this.$refs.wordForm.resetFields()
      }
    },
    submitWordForm() {
      this.$refs.wordForm.validate(valid => {
        if (!valid) {
          return
        }

        this.wordSubmitting = true
        const payload = {
          word: this.wordForm.word.trim(),
          level: this.wordForm.level
        }

        let request
        if (this.wordForm.word_id) {
          request = this.axios.put(
            this.$baseUrl + '/manage/community/audit/sensitive-words/' + this.wordForm.word_id,
            payload
          )
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/community/audit/sensitive-words', payload)
        }

        request.then(() => {
          this.$message.success(this.wordForm.word_id ? '敏感词已更新' : '敏感词已创建')
          this.wordDialogVisible = false
          this.fetchWords()
        }).catch(error => {
          console.error('保存敏感词失败', error)
          this.$message.error(this.getErrorMessage(error, '保存敏感词失败'))
        }).finally(() => {
          this.wordSubmitting = false
        })
      })
    },
    handleDeleteWord(row) {
      this.$confirm('删除后该词将不再参与社区风控扫描，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/community/audit/sensitive-words/' + row.word_id)
          .then(() => {
            this.$message.success('敏感词已删除')
            if (this.wordsList.length === 1 && this.wordsPage > 1) {
              this.wordsPage -= 1
            }
            this.fetchWords()
          }).catch(error => {
            console.error('删除敏感词失败', error)
            this.$message.error(this.getErrorMessage(error, '删除敏感词失败'))
          })
      }).catch(() => {})
    },
    getLevelText(level) {
      const map = {
        1: '一级提醒',
        2: '二级高风险',
        3: '三级封禁'
      }
      return map[level] || ('等级' + level)
    },
    getLevelTagType(level) {
      const map = {
        1: 'info',
        2: 'warning',
        3: 'danger'
      }
      return map[level] || 'info'
    },
    getTargetTypeText(type) {
      const map = {
        1: '圈子',
        2: '帖子',
        3: '评论',
        4: '圈子成员'
      }
      return map[type] || '未知'
    },
    getActionText(action) {
      const map = {
        1: '通过',
        2: '拒绝',
        3: '启用',
        4: '禁用/删除',
        5: '设为精华',
        6: '禁言',
        7: '踢出',
        8: '审核入圈'
      }
      return map[action] || '未知'
    },
    getActionTagType(action) {
      const map = {
        1: 'success',
        2: 'danger',
        3: 'success',
        4: 'warning',
        5: 'primary',
        6: 'warning',
        7: 'danger',
        8: 'primary'
      }
      return map[action] || 'info'
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
.audit-tools-page {
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

.word-input {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.operator-info {
  display: flex;
  align-items: center;

  span {
    margin-left: 10px;
  }
}

.danger-text {
  color: #f56c6c;
}
</style>
