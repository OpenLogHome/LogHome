<template>
  <div class="index-tags-page">
    <div class="page-header">
      <div>
        <h2>书库快捷按钮管理</h2>
        <p>管理书库首页顶部一排快捷按钮，按排序值从小到大展示，可设置颜色、图标与跳转链接。</p>
      </div>
      <el-button type="primary" @click="openDialog()">新增快捷按钮</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <span class="filter-label">状态：</span>
        <el-select v-model="statusFilter" style="width: 140px" @change="fetchData">
          <el-option label="全部" value="" />
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="tag_id" label="ID" width="70" />
      <el-table-column label="预览" width="220">
        <template slot-scope="scope">
          <span
            class="tag-preview"
            :style="{ color: scope.row.tag_color, borderColor: scope.row.tag_color }"
          >
            <img v-if="scope.row.tag_icon" :src="scope.row.tag_icon" class="tag-preview-icon" />
            <i v-else class="el-icon-right tag-preview-icon placeholder"></i>
            {{ scope.row.tag_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="tag_name" label="名称" min-width="140" show-overflow-tooltip />
      <el-table-column label="图标" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.tag_icon" class="url-text">{{ scope.row.tag_icon }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="颜色" width="90">
        <template slot-scope="scope">
          <span class="color-dot" :style="{ backgroundColor: scope.row.tag_color }"></span>
          {{ scope.row.tag_color }}
        </template>
      </el-table-column>
      <el-table-column prop="jump_url" label="跳转链接" min-width="260" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link v-if="scope.row.jump_url" type="primary" :href="scope.row.jump_url" target="_blank" :underline="false" class="url-text">
            {{ scope.row.jump_url }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="order_index" label="排序" width="80" />
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_active === 1 ? 'success' : 'info'" size="small">
            {{ scope.row.is_active === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="170">
        <template slot-scope="scope">
          {{ formatDate(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="640px" @close="resetForm">
      <el-form ref="tagForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="tag_name">
          <el-input v-model="form.tag_name" placeholder="例如：书架、标签广场" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="图标">
          <image-upload-field
            v-model="form.tag_icon"
            button-text="上传图标"
            :preview-width="48"
            :preview-height="48"
            tip="选填，显示在文字左侧的小图标"
          />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="form.tag_color"></el-color-picker>
          <span class="color-text">文字与箭头颜色，默认 #999999</span>
        </el-form-item>
        <el-form-item label="跳转链接" prop="jump_url">
          <el-input v-model="form.jump_url" placeholder="例如 /pages/bookcase/index 或以 http(s):// 开头的站外链接" maxlength="255" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order_index" :min="0" :max="999" controls-position="right" />
          <span class="color-text">数字越小越靠前，相同按创建先后排列</span>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.is_active" active-text="启用" inactive-text="停用" />
          <span class="color-text">停用的按钮不会在客户端展示</span>
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
import moment from 'moment'
import ImageUploadField from '../../components/ImageUploadField.vue'

export default {
  name: 'IndexTagsManage',
  components: {
    ImageUploadField
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '新增快捷按钮',
      statusFilter: '',
      list: [],
      form: {
        tag_id: null,
        tag_name: '',
        tag_icon: '',
        tag_color: '#999999',
        jump_url: '',
        order_index: 0,
        is_active: true
      },
      rules: {
        tag_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jump_url: [
          { required: true, message: '请输入跳转链接', trigger: 'blur' }
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
      this.axios.get(this.$baseUrl + '/manage/library-index-tags', {
        params: {
          is_active: this.statusFilter
        }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取快捷按钮失败', error)
        this.$message.error('获取快捷按钮失败')
      }).finally(() => {
        this.loading = false
      })
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑快捷按钮'
        this.form = {
          tag_id: row.tag_id,
          tag_name: row.tag_name || '',
          tag_icon: row.tag_icon || '',
          tag_color: row.tag_color || '#999999',
          jump_url: row.jump_url || '',
          order_index: row.order_index || 0,
          is_active: row.is_active === 1
        }
      } else {
        this.dialogTitle = '新增快捷按钮'
        this.form = {
          tag_id: null,
          tag_name: '',
          tag_icon: '',
          tag_color: '#999999',
          jump_url: '',
          order_index: this.list.length > 0 ? Math.max(...this.list.map(item => item.order_index)) + 1 : 0,
          is_active: true
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
          tag_icon: this.form.tag_icon || '',
          tag_color: this.form.tag_color || '#999999',
          jump_url: this.form.jump_url.trim(),
          order_index: this.form.order_index,
          is_active: this.form.is_active ? 1 : 0
        }

        let request
        if (this.form.tag_id) {
          request = this.axios.put(this.$baseUrl + '/manage/library-index-tags/' + this.form.tag_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/library-index-tags', payload)
        }

        request.then(() => {
          this.$message.success(this.form.tag_id ? '快捷按钮已更新' : '快捷按钮已创建')
          this.dialogVisible = false
          this.fetchData()
        }).catch(error => {
          console.error('保存快捷按钮失败', error)
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除快捷按钮「${row.tag_name}」吗？删除后无法恢复。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/library-index-tags/' + row.tag_id)
          .then(() => {
            this.$message.success('快捷按钮已删除')
            this.fetchData()
          }).catch(error => {
            console.error('删除快捷按钮失败', error)
            this.$message.error('删除快捷按钮失败')
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
.index-tags-page {
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

.filter-label {
  color: #606266;
  font-size: 14px;
}

.tag-preview {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid;
  background-color: #f8f9fa;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}

.tag-preview-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  &.placeholder {
    color: #999999;
  }
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
  border: 1px solid #e0e0e0;
}

.url-text {
  font-size: 12px;
  word-break: break-all;
}

.color-text {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}

.danger-text {
  color: #f56c6c;
}
</style>
