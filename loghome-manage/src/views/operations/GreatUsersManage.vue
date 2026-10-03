<template>
  <div class="great-users-page">
    <div class="page-header">
      <div>
        <h2>荣誉用户管理</h2>
        <p>配置在"荣誉用户"页面展示的用户与其荣誉介绍。</p>
      </div>
      <el-button type="primary" @click="openDialog()">添加荣誉用户</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="keyword-input"
          placeholder="搜索用户昵称或ID"
          @keyup.enter.native="fetchData"
        >
          <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="user_id" label="用户ID" width="90" />
      <el-table-column label="用户" min-width="160">
        <template slot-scope="scope">
          <div class="user-cell">
            <el-avatar :size="32" :src="scope.row.avatar_url"></el-avatar>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="great_info" label="荣誉介绍" min-width="300" show-overflow-tooltip />
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="560px" @close="resetForm">
      <el-form ref="greatForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户" prop="user_id">
          <template v-if="form.user_id">
            <el-tag closable @close="form.user_id = null">{{ form.user_name }}（ID: {{ form.user_id }}）</el-tag>
          </template>
          <el-select
            v-else
            v-model="form.user_id"
            filterable
            remote
            :remote-method="searchUsers"
            :loading="userSearchLoading"
            placeholder="输入用户昵称或ID搜索"
            style="width: 100%"
            @change="handleUserSelect"
          >
            <el-option v-for="user in userSearchResults" :key="user.user_id" :label="`${user.name}（ID: ${user.user_id}）`" :value="user.user_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="荣誉介绍" prop="great_info">
          <el-input v-model="form.great_info" type="textarea" :rows="3" placeholder="例如：原木社区创始人、首席技术工程师" maxlength="512" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'GreatUsersManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '添加荣誉用户',
      keyword: '',
      list: [],
      form: {
        user_id: null,
        user_name: '',
        great_info: ''
      },
      userSearchLoading: false,
      userSearchResults: [],
      rules: {
        user_id: [{ required: true, message: '请选择用户', trigger: 'change' }],
        great_info: [{ required: true, message: '请输入荣誉介绍', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/great-users', {
        params: { keyword: this.keyword }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取荣誉用户失败', error)
        this.$message.error('获取荣誉用户失败')
      }).finally(() => {
        this.loading = false
      })
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑荣誉介绍'
        this.form = {
          user_id: row.user_id,
          user_name: row.name,
          great_info: row.great_info || ''
        }
      } else {
        this.dialogTitle = '添加荣誉用户'
        this.form = {
          user_id: null,
          user_name: '',
          great_info: ''
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.greatForm) {
          this.$refs.greatForm.clearValidate()
        }
      })
    },
    resetForm() {
      if (this.$refs.greatForm) {
        this.$refs.greatForm.resetFields()
      }
    },
    searchUsers(keyword) {
      this.userSearchLoading = true
      this.axios.get(this.$baseUrl + '/manage/community/users/list', {
        params: { keyword: keyword, limit: 20 }
      }).then(response => {
        this.userSearchResults = response.data || []
      }).catch(error => {
        console.error('搜索用户失败', error)
      }).finally(() => {
        this.userSearchLoading = false
      })
    },
    handleUserSelect(userId) {
      const user = this.userSearchResults.find(item => item.user_id === userId)
      if (user) {
        this.form.user_name = user.name
      }
    },
    submitForm() {
      this.$refs.greatForm.validate(valid => {
        if (!valid) {
          return
        }
        this.submitLoading = true
        let request
        if (this.form.user_id && this.form.user_name) {
          request = this.axios.put(this.$baseUrl + '/manage/great-users/' + this.form.user_id, {
            great_info: this.form.great_info.trim()
          })
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/great-users', {
            user_id: this.form.user_id,
            great_info: this.form.great_info.trim()
          })
        }
        request.then(() => {
          this.$message.success('已保存')
          this.dialogVisible = false
          this.fetchData()
        }).catch(error => {
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定移除「${row.name}」的荣誉用户资格吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/great-users/' + row.user_id)
          .then(() => {
            this.$message.success('已移除')
            this.fetchData()
          }).catch(error => {
            this.$message.error('移除失败')
          })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.great-users-page {
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.danger-text {
  color: #f56c6c;
}
</style>
