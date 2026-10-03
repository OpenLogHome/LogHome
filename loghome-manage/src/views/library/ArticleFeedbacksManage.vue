<template>
  <div class="article-feedbacks-page">
    <div class="page-header">
      <div>
        <h2>章节错字反馈</h2>
        <p>管理读者提交的章节错字反馈，可标记处理状态。</p>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input v-model="keyword" clearable class="keyword-input" placeholder="搜索用户/章节/反馈内容" @keyup.enter.native="fetchData">
          <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
        <el-select v-model="statusFilter" style="width: 130px" @change="fetchData">
          <el-option label="全部状态" value="" />
          <el-option label="待处理" :value="0" />
          <el-option label="已处理" :value="1" />
        </el-select>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="feedback_id" label="ID" width="90" />
      <el-table-column prop="novel_name" label="小说" min-width="140" show-overflow-tooltip />
      <el-table-column prop="article_title" label="章节" min-width="160" show-overflow-tooltip />
      <el-table-column label="用户" min-width="110">
        <template slot-scope="scope">
          {{ scope.row.user_name || scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column prop="feedback_content" label="反馈内容" min-width="200" show-overflow-tooltip />
      <el-table-column prop="paragraph_text" label="原文段落" min-width="220" show-overflow-tooltip />
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'" size="small">
            {{ scope.row.status === 1 ? '已处理' : '待处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" width="170">
        <template slot-scope="scope">
          {{ formatDate(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== 1" type="text" size="small" @click="toggleStatus(scope.row, 1)">标记已处理</el-button>
          <el-button v-else type="text" size="small" @click="toggleStatus(scope.row, 0)">重新打开</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ArticleFeedbacksManage',
  data() {
    return {
      loading: false,
      keyword: '',
      statusFilter: '',
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/article-feedbacks', {
        params: {
          keyword: this.keyword,
          status: this.statusFilter
        }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取反馈列表失败', error)
        this.$message.error('获取反馈列表失败')
      }).finally(() => {
        this.loading = false
      })
    },
    toggleStatus(row, status) {
      this.axios.put(this.$baseUrl + '/manage/article-feedbacks/' + row.feedback_id + '/status', { status })
        .then(() => {
          this.$message.success(status === 1 ? '已标记处理' : '已重新打开')
          this.fetchData()
        }).catch(error => {
          this.$message.error('操作失败')
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
.article-feedbacks-page {
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
</style>
