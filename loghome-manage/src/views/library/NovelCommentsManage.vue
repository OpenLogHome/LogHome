<template>
  <div class="novel-comments-page">
    <div class="page-header">
      <div>
        <h2>章评与划线管理</h2>
        <p>管理书库章节评论与划线。删除后客户端不再展示，可随时恢复。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="章节评论" name="comments">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input
              v-model="keyword"
              clearable
              class="keyword-input"
              placeholder="搜索评论内容或用户昵称"
              @keyup.enter.native="fetchComments"
            >
              <el-button slot="append" icon="el-icon-search" @click="fetchComments"></el-button>
            </el-input>
            <el-input v-model="novelId" class="novel-input" placeholder="小说ID（选填）" @keyup.enter.native="fetchComments" />
            <el-select v-model="deletedFilter" style="width: 120px" @change="fetchComments">
              <el-option label="正常评论" :value="0" />
              <el-option label="已删除" :value="1" />
            </el-select>
            <el-button type="primary" @click="fetchComments">查询</el-button>
          </div>
        </el-card>
        <el-table :data="comments" border v-loading="commentsLoading" style="width: 100%">
          <el-table-column prop="essay_comment_id" label="ID" width="90" />
          <el-table-column prop="novel_name" label="小说" min-width="130" show-overflow-tooltip />
          <el-table-column label="用户" min-width="110">
            <template slot-scope="scope">
              {{ scope.row.user_name || scope.row.user_id }}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="评论内容" min-width="260" show-overflow-tooltip />
          <el-table-column prop="comment_time" label="时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.comment_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.deleted !== 1" type="text" size="small" class="danger-text" @click="toggleComment(scope.row, 1)">删除</el-button>
              <el-button v-else type="text" size="small" @click="toggleComment(scope.row, 0)">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="划线" name="centos">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input
              v-model="centoKeyword"
              clearable
              class="keyword-input"
              placeholder="搜索划线段落或用户昵称"
              @keyup.enter.native="fetchCentos"
            >
              <el-button slot="append" icon="el-icon-search" @click="fetchCentos"></el-button>
            </el-input>
            <el-select v-model="centoDeletedFilter" style="width: 120px" @change="fetchCentos">
              <el-option label="正常划线" :value="0" />
              <el-option label="已删除" :value="1" />
            </el-select>
            <el-button type="primary" @click="fetchCentos">查询</el-button>
          </div>
        </el-card>
        <el-table :data="centos" border v-loading="centosLoading" style="width: 100%">
          <el-table-column prop="article_cento_id" label="ID" width="110" />
          <el-table-column label="用户" min-width="110">
            <template slot-scope="scope">
              {{ scope.row.user_name || scope.row.user_id }}
            </template>
          </el-table-column>
          <el-table-column prop="article_id" label="章节ID" width="90" />
          <el-table-column prop="paragraph" label="划线段落" min-width="300" show-overflow-tooltip />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.is_delete !== 1" type="text" size="small" class="danger-text" @click="toggleCento(scope.row, 1)">删除</el-button>
              <el-button v-else type="text" size="small" @click="toggleCento(scope.row, 0)">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'NovelCommentsManage',
  data() {
    return {
      activeTab: 'comments',
      // 评论
      commentsLoading: false,
      comments: [],
      keyword: '',
      novelId: '',
      deletedFilter: 0,
      // 划线
      centosLoading: false,
      centos: [],
      centoKeyword: '',
      centoDeletedFilter: 0
    }
  },
  created() {
    this.fetchComments()
    this.fetchCentos()
  },
  methods: {
    fetchComments() {
      this.commentsLoading = true
      this.axios.get(this.$baseUrl + '/manage/novel-comments/comments', {
        params: {
          keyword: this.keyword,
          novel_id: this.novelId,
          deleted: this.deletedFilter
        }
      }).then(response => {
        this.comments = response.data || []
      }).catch(error => {
        console.error('获取评论失败', error)
        this.$message.error('获取评论失败')
      }).finally(() => {
        this.commentsLoading = false
      })
    },
    toggleComment(row, deleted) {
      const action = deleted === 1 ? '删除' : '恢复'
      this.$confirm(`确定${action}该评论吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(this.$baseUrl + '/manage/novel-comments/comments/' + row.essay_comment_id + '/toggle-delete', { deleted })
          .then(() => {
            this.$message.success(`已${action}`)
            this.fetchComments()
          }).catch(error => {
            this.$message.error(`${action}失败`)
          })
      }).catch(() => {})
    },
    fetchCentos() {
      this.centosLoading = true
      this.axios.get(this.$baseUrl + '/manage/novel-comments/centos', {
        params: {
          keyword: this.centoKeyword,
          is_delete: this.centoDeletedFilter
        }
      }).then(response => {
        this.centos = response.data || []
      }).catch(error => {
        console.error('获取划线失败', error)
        this.$message.error('获取划线失败')
      }).finally(() => {
        this.centosLoading = false
      })
    },
    toggleCento(row, isDelete) {
      const action = isDelete === 1 ? '删除' : '恢复'
      this.$confirm(`确定${action}该划线吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(this.$baseUrl + '/manage/novel-comments/centos/' + row.article_cento_id + '/toggle-delete', { is_delete: isDelete })
          .then(() => {
            this.$message.success(`已${action}`)
            this.fetchCentos()
          }).catch(error => {
            this.$message.error(`${action}失败`)
          })
      }).catch(() => {})
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
.novel-comments-page {
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

.novel-input {
  width: 160px;
}

.danger-text {
  color: #f56c6c;
}
</style>
