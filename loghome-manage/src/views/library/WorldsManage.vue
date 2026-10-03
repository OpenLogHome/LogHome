<template>
  <div class="worlds-page">
    <div class="page-header">
      <div>
        <h2>世界观管理</h2>
        <p>查看与维护用户创建的世界观合集。删除后前台不再展示，可恢复。</p>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input v-model="keyword" clearable class="keyword-input" placeholder="搜索世界名称或创建者" @keyup.enter.native="fetchData">
          <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
        <el-select v-model="isDeleteFilter" style="width: 120px" @change="fetchData">
          <el-option label="正常" :value="0" />
          <el-option label="已删除" :value="1" />
        </el-select>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="world_id" label="ID" width="80" />
      <el-table-column prop="world_name" label="世界名称" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.world_name || '--' }}
          <el-tag v-if="scope.row.novel_deleted === 1" type="danger" size="mini" style="margin-left: 6px">主作品已删</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建者" min-width="140">
        <template slot-scope="scope">
          {{ scope.row.creator_name || scope.row.creator_id }}
        </template>
      </el-table-column>
      <el-table-column label="允许衍生" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.allow_fork === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="forked_from" label="衍生自" width="90">
        <template slot-scope="scope">
          {{ scope.row.forked_from || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_delete === 1 ? 'info' : 'success'" size="small">
            {{ scope.row.is_delete === 1 ? '已删除' : '正常' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="关联作品" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link v-if="scope.row.asso_novel_id" type="primary" :underline="false">主作品 {{ scope.row.asso_novel_id }}</el-link>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showWorldNovels(scope.row)">关联作品</el-button>
          <el-button v-if="scope.row.is_delete !== 1" type="text" size="small" class="danger-text" @click="toggleDelete(scope.row, 1)">删除</el-button>
          <el-button v-else type="text" size="small" @click="toggleDelete(scope.row, 0)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="世界关联作品" :visible.sync="novelsDialogVisible" width="640px">
      <el-table :data="worldNovels" border v-loading="novelsLoading" max-height="420">
        <el-table-column prop="novel_id" label="小说ID" width="90" />
        <el-table-column prop="novel_name" label="小说名" min-width="160" show-overflow-tooltip />
        <el-table-column prop="author_name" label="作者" min-width="120" show-overflow-tooltip />
        <el-table-column label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.deleted === 1 ? 'danger' : 'success'" size="small">
              {{ scope.row.deleted === 1 ? '已删' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WorldsManage',
  data() {
    return {
      loading: false,
      keyword: '',
      isDeleteFilter: 0,
      list: [],
      novelsDialogVisible: false,
      novelsLoading: false,
      worldNovels: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/worlds', {
        params: {
          keyword: this.keyword,
          is_delete: this.isDeleteFilter
        }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取世界观失败', error)
        this.$message.error('获取世界观失败')
      }).finally(() => {
        this.loading = false
      })
    },
    showWorldNovels(row) {
      this.worldNovels = []
      this.novelsDialogVisible = true
      this.novelsLoading = true
      this.axios.get(this.$baseUrl + '/manage/worlds/' + row.world_id + '/novels').then(response => {
        this.worldNovels = response.data || []
      }).catch(error => {
        console.error('获取关联作品失败', error)
        this.$message.error('获取关联作品失败')
      }).finally(() => {
        this.novelsLoading = false
      })
    },
    toggleDelete(row, isDelete) {
      const action = isDelete === 1 ? '删除' : '恢复'
      this.$confirm(`确定${action}世界观「${row.world_name || row.world_id}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(this.$baseUrl + '/manage/worlds/' + row.world_id + '/toggle-delete', { is_delete: isDelete })
          .then(() => {
            this.$message.success(`已${action}`)
            this.fetchData()
          }).catch(error => {
            this.$message.error(`${action}失败`)
          })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.worlds-page {
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
