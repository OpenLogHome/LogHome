<template>
  <div class="user-contents-page">
    <div class="page-header">
      <div>
        <h2>用户内容管理</h2>
        <p>查看收藏夹、分享口令与定时发布任务，可删除或取消。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 收藏夹 -->
      <el-tab-pane label="收藏夹" name="collections">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input v-model="collectionKeyword" clearable class="keyword-input" placeholder="搜索用户或收藏夹名称" @keyup.enter.native="fetchCollections">
              <el-button slot="append" icon="el-icon-search" @click="fetchCollections"></el-button>
            </el-input>
            <el-button type="primary" @click="fetchCollections">查询</el-button>
          </div>
        </el-card>
        <el-table :data="collections" border v-loading="collectionsLoading" style="width: 100%">
          <el-table-column prop="collection_id" label="ID" width="90" />
          <el-table-column label="用户" min-width="130">
            <template slot-scope="scope">
              {{ scope.row.user_name || scope.row.user_id }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="收藏夹名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
          <el-table-column prop="create_time" label="创建时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="danger-text" @click="deleteCollection(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 分享口令 -->
      <el-tab-pane label="分享口令" name="shareCodes">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input v-model="shareKeyword" clearable class="keyword-input" placeholder="搜索口令/用户/内容" @keyup.enter.native="fetchShareCodes">
              <el-button slot="append" icon="el-icon-search" @click="fetchShareCodes"></el-button>
            </el-input>
            <el-button type="primary" @click="fetchShareCodes">查询</el-button>
          </div>
        </el-card>
        <el-table :data="shareCodes" border v-loading="shareCodesLoading" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="code" label="口令" width="120" />
          <el-table-column label="用户" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.user_name || scope.row.share_user_id }}
            </template>
          </el-table-column>
          <el-table-column prop="share_type" label="类型" width="100" align="center" />
          <el-table-column prop="share_content" label="分享内容" min-width="200" show-overflow-tooltip />
          <el-table-column label="状态" width="90" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.is_active === 1 ? 'success' : 'info'" size="small">
                {{ scope.row.is_active === 1 ? '有效' : '失效' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="use_count" label="使用次数" width="90" />
          <el-table-column prop="created_at" label="创建时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="danger-text" @click="deleteShareCode(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 定时发布 -->
      <el-tab-pane label="定时发布" name="scheduledTasks">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input v-model="taskKeyword" clearable class="keyword-input" placeholder="搜索章节/小说/作者" @keyup.enter.native="fetchScheduledTasks">
              <el-button slot="append" icon="el-icon-search" @click="fetchScheduledTasks"></el-button>
            </el-input>
            <el-button type="primary" @click="fetchScheduledTasks">查询</el-button>
          </div>
        </el-card>
        <el-table :data="scheduledTasks" border v-loading="tasksLoading" style="width: 100%">
          <el-table-column prop="task_id" label="ID" width="80" />
          <el-table-column prop="novel_name" label="小说" min-width="150" show-overflow-tooltip />
          <el-table-column prop="article_title" label="章节" min-width="160" show-overflow-tooltip />
          <el-table-column label="作者" min-width="110">
            <template slot-scope="scope">
              {{ scope.row.author_name || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="publish_time" label="计划发布时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.publish_time) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="taskStatusType(scope.row.status)" size="small">
                {{ taskStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === 'pending'" type="text" size="small" class="danger-text" @click="cancelScheduledTask(scope.row)">取消</el-button>
              <span v-else>--</span>
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
  name: 'UserContentsManage',
  data() {
    return {
      activeTab: 'collections',
      // 收藏夹
      collectionsLoading: false,
      collections: [],
      collectionKeyword: '',
      // 分享口令
      shareCodesLoading: false,
      shareCodes: [],
      shareKeyword: '',
      // 定时发布
      tasksLoading: false,
      scheduledTasks: [],
      taskKeyword: ''
    }
  },
  created() {
    this.fetchCollections()
    this.fetchShareCodes()
    this.fetchScheduledTasks()
  },
  methods: {
    fetchCollections() {
      this.collectionsLoading = true
      this.axios.get(this.$baseUrl + '/manage/user-contents/collections', {
        params: { keyword: this.collectionKeyword }
      }).then(response => {
        this.collections = response.data || []
      }).catch(error => {
        console.error('获取收藏夹失败', error)
        this.$message.error('获取收藏夹失败')
      }).finally(() => {
        this.collectionsLoading = false
      })
    },
    deleteCollection(row) {
      this.$confirm(`确定删除收藏夹「${row.name}」吗？其中收藏的帖子也会一并移除。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/user-contents/collections/' + row.collection_id)
          .then(() => {
            this.$message.success('已删除')
            this.fetchCollections()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    fetchShareCodes() {
      this.shareCodesLoading = true
      this.axios.get(this.$baseUrl + '/manage/user-contents/share-codes', {
        params: { keyword: this.shareKeyword }
      }).then(response => {
        this.shareCodes = response.data || []
      }).catch(error => {
        console.error('获取分享口令失败', error)
        this.$message.error('获取分享口令失败')
      }).finally(() => {
        this.shareCodesLoading = false
      })
    },
    deleteShareCode(row) {
      this.$confirm('确定删除该分享口令吗？口令将立即失效。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/user-contents/share-codes/' + row.id)
          .then(() => {
            this.$message.success('已删除')
            this.fetchShareCodes()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    fetchScheduledTasks() {
      this.tasksLoading = true
      this.axios.get(this.$baseUrl + '/manage/user-contents/scheduled-tasks', {
        params: { keyword: this.taskKeyword }
      }).then(response => {
        this.scheduledTasks = response.data || []
      }).catch(error => {
        console.error('获取定时任务失败', error)
        this.$message.error('获取定时任务失败')
      }).finally(() => {
        this.tasksLoading = false
      })
    },
    cancelScheduledTask(row) {
      this.$confirm('确定取消该定时发布任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(this.$baseUrl + '/manage/user-contents/scheduled-tasks/' + row.task_id + '/cancel')
          .then(() => {
            this.$message.success('已取消')
            this.fetchScheduledTasks()
          }).catch(error => {
            this.$message.error((error.response && error.response.data && error.response.data.msg) || '取消失败')
          })
      }).catch(() => {})
    },
    taskStatusText(status) {
      return { pending: '待发布', executed: '已发布', cancelled: '已取消' }[status] || status
    },
    taskStatusType(status) {
      return { pending: 'warning', executed: 'success', cancelled: 'info' }[status] || 'info'
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
.user-contents-page {
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

.danger-text {
  color: #f56c6c;
}
</style>
