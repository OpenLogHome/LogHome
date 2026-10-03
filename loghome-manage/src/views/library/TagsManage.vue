<template>
  <div class="tags-page">
    <div class="page-header">
      <div>
        <h2>标签库管理</h2>
        <p>管理全站小说标签。推荐标签出现在作者打标签的快捷选项，活动标签结束后将无法再添加。</p>
      </div>
      <el-button type="primary" @click="openDialog()">新增标签</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="keyword-input"
          placeholder="搜索标签名称"
          @keyup.enter.native="fetchData"
        >
          <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
        <el-select v-model="deletedFilter" style="width: 120px" @change="fetchData">
          <el-option label="全部状态" value="" />
          <el-option label="正常" :value="0" />
          <el-option label="已删除" :value="1" />
        </el-select>
        <el-select v-model="activityFilter" style="width: 130px" @change="fetchData">
          <el-option label="全部类型" value="" />
          <el-option label="活动标签" :value="1" />
          <el-option label="普通标签" :value="0" />
        </el-select>
        <el-select v-model="suggestedFilter" style="width: 130px" @change="fetchData">
          <el-option label="全部推荐" value="" />
          <el-option label="推荐标签" :value="1" />
          <el-option label="非推荐" :value="0" />
        </el-select>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="tag_id" label="ID" width="80" />
      <el-table-column prop="tag_name" label="标签名称" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tag_name }}
          <el-tag v-if="scope.row.is_activity_tag === 1" type="warning" size="mini" style="margin-left: 6px">活动</el-tag>
          <el-tag v-if="scope.row.is_suggested === 1" type="success" size="mini" style="margin-left: 6px">推荐</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="usage_count" label="使用数" width="90" />
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_deleted === 1 ? 'info' : 'success'" size="small">
            {{ scope.row.is_deleted === 1 ? '已删除' : '正常' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.is_deleted !== 1" type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.is_deleted === 1" type="text" size="small" @click="handleRestore(scope.row)">恢复</el-button>
          <el-button v-if="scope.row.is_deleted !== 1" type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px" @close="resetForm">
      <el-form ref="tagForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标签名称" prop="tag_name">
          <el-input v-model="form.tag_name" placeholder="请输入标签名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="活动标签">
          <el-switch v-model="form.is_activity_tag" active-text="是" inactive-text="否" />
          <div class="form-tip">活动标签在活动结束后（取消推荐）将不允许作者继续添加</div>
        </el-form-item>
        <el-form-item label="推荐标签">
          <el-switch v-model="form.is_suggested" active-text="推荐" inactive-text="不推荐" />
          <div class="form-tip">推荐标签会展示在作者打标签的快捷候选中</div>
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
  name: 'TagsManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '新增标签',
      keyword: '',
      deletedFilter: '',
      activityFilter: '',
      suggestedFilter: '',
      list: [],
      form: {
        tag_id: null,
        tag_name: '',
        is_activity_tag: false,
        is_suggested: false
      },
      rules: {
        tag_name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
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
      this.axios.get(this.$baseUrl + '/manage/tags', {
        params: {
          keyword: this.keyword,
          is_deleted: this.deletedFilter,
          is_activity_tag: this.activityFilter,
          is_suggested: this.suggestedFilter
        }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取标签列表失败', error)
        this.$message.error('获取标签列表失败')
      }).finally(() => {
        this.loading = false
      })
    },
    resetSearch() {
      this.keyword = ''
      this.deletedFilter = ''
      this.activityFilter = ''
      this.suggestedFilter = ''
      this.fetchData()
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑标签'
        this.form = {
          tag_id: row.tag_id,
          tag_name: row.tag_name || '',
          is_activity_tag: row.is_activity_tag === 1,
          is_suggested: row.is_suggested === 1
        }
      } else {
        this.dialogTitle = '新增标签'
        this.form = {
          tag_id: null,
          tag_name: '',
          is_activity_tag: false,
          is_suggested: false
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.tagForm) {
          this.$refs.tagForm.clearValidate()
        }
      })
    },
    resetForm() {
      if (this.$refs.tagForm) {
        this.$refs.tagForm.resetFields()
      }
    },
    submitForm() {
      this.$refs.tagForm.validate(valid => {
        if (!valid) {
          return
        }
        this.submitLoading = true
        const payload = {
          tag_name: this.form.tag_name.trim(),
          is_activity_tag: this.form.is_activity_tag ? 1 : 0,
          is_suggested: this.form.is_suggested ? 1 : 0
        }
        let request
        if (this.form.tag_id) {
          request = this.axios.put(this.$baseUrl + '/manage/tags/' + this.form.tag_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/tags', payload)
        }
        request.then(() => {
          this.$message.success(this.form.tag_id ? '标签已更新' : '标签已创建')
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
      this.$confirm(`确定删除标签「${row.tag_name}」吗？删除后作者将无法使用。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(this.$baseUrl + '/manage/tags/' + row.tag_id + '/toggle-delete', { is_deleted: 1 })
          .then(() => {
            this.$message.success('标签已删除')
            this.fetchData()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    handleRestore(row) {
      this.axios.post(this.$baseUrl + '/manage/tags/' + row.tag_id + '/toggle-delete', { is_deleted: 0 })
        .then(() => {
          this.$message.success('标签已恢复')
          this.fetchData()
        }).catch(error => {
          this.$message.error('恢复失败')
        })
    }
  }
}
</script>

<style scoped lang="scss">
.tags-page {
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
  width: 260px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

.danger-text {
  color: #f56c6c;
}
</style>
