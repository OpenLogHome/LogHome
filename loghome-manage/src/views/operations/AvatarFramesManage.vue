<template>
  <div class="avatar-frames-page">
    <div class="page-header">
      <div>
        <h2>头像挂件管理</h2>
        <p>配置会员头像挂件。素材上传到对象存储后填入链接，权益档位决定哪些会员可使用。</p>
      </div>
      <el-button type="primary" @click="openDialog()">新增挂件</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input v-model="keyword" clearable class="keyword-input" placeholder="搜索名称或编码" @keyup.enter.native="fetchData">
          <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
        <el-select v-model="statusFilter" style="width: 130px" @change="fetchData">
          <el-option label="全部状态" value="" />
          <el-option label="草稿" value="draft" />
          <el-option label="启用" value="active" />
          <el-option label="停用" value="disabled" />
        </el-select>
        <el-select v-model="tierFilter" style="width: 150px" @change="fetchData">
          <el-option label="全部档位" value="" />
          <el-option label="免费" value="free" />
          <el-option label="标准会员" value="standard" />
          <el-option label="高级会员" value="super" />
        </el-select>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="frame_id" label="ID" width="70" />
      <el-table-column label="预览" width="110">
        <template slot-scope="scope">
          <img :src="scope.row.thumbnail_url || scope.row.asset_url" class="frame-preview" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="110" show-overflow-tooltip />
      <el-table-column prop="code" label="编码" min-width="110" />
      <el-table-column label="档位" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="tierType(scope.row.required_tier)" size="small">{{ tierText(scope.row.required_tier) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : scope.row.status === 'disabled' ? 'info' : 'warning'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="动效" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.is_animated === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column prop="source" label="素材来源" min-width="160" show-overflow-tooltip />
      <el-table-column label="授权" width="90" align="center">
        <template slot-scope="scope">
          {{ licenseText(scope.row.license_status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="720px" @close="resetForm">
      <el-form ref="frameForm" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="挂件名称" prop="name">
              <el-input v-model="form.name" placeholder="例如：恶魔心焰" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挂件编码" prop="code">
              <el-input v-model="form.code" placeholder="例如 devil-pink，唯一" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="权益档位" prop="required_tier">
              <el-select v-model="form.required_tier" style="width: 100%">
                <el-option label="免费" value="free" />
                <el-option label="标准会员" value="standard" />
                <el-option label="高级会员" value="super" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="启用" value="active" />
                <el-option label="停用" value="disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="动效">
              <el-switch v-model="form.is_animated" active-text="动效" inactive-text="静态" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="挂件素材" prop="asset_url">
          <div class="upload-row">
            <el-upload :show-file-list="false" action="#" :http-request="options => uploadAsset(options, 'asset_url')" :disabled="!!uploadingField">
              <el-button size="small" type="primary" :loading="uploadingField === 'asset_url'">
                {{ uploadingField === 'asset_url' ? `上传中 ${uploadProgress}%` : '上传素材' }}
              </el-button>
            </el-upload>
            <div v-if="form.asset_url" class="uploaded-file">
              <el-link type="primary" :href="form.asset_url" target="_blank" :underline="false">{{ getFileName(form.asset_url) }}</el-link>
              <el-button type="text" size="small" @click="form.asset_url = ''">移除</el-button>
            </div>
          </div>
          <div class="form-tip">建议透明底 PNG，上传到对象存储后自动填入链接</div>
        </el-form-item>
        <el-form-item label="缩略图">
          <div class="upload-row">
            <el-upload :show-file-list="false" action="#" :http-request="options => uploadAsset(options, 'thumbnail_url')" :disabled="!!uploadingField">
              <el-button size="small" type="primary" :loading="uploadingField === 'thumbnail_url'">
                {{ uploadingField === 'thumbnail_url' ? `上传中 ${uploadProgress}%` : '上传缩略图' }}
              </el-button>
            </el-upload>
            <div v-if="form.thumbnail_url" class="uploaded-file">
              <el-link type="primary" :href="form.thumbnail_url" target="_blank" :underline="false">{{ getFileName(form.thumbnail_url) }}</el-link>
              <el-button type="text" size="small" @click="form.thumbnail_url = ''">移除</el-button>
            </div>
          </div>
          <div class="form-tip">选填，列表页小图，可用原图</div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="缩放比例" prop="avatar_scale">
              <el-input-number v-model="form.avatar_scale" :min="0.1" :max="2" :step="0.01" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="偏移 X">
              <el-input-number v-model="form.offset_x" :step="0.1" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="偏移 Y">
              <el-input-number v-model="form.offset_y" :step="0.1" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序值">
              <el-input-number v-model="form.sort_order" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权状态" prop="license_status">
              <el-select v-model="form.license_status" style="width: 100%">
                <el-option label="待确认" value="pending" />
                <el-option label="已授权" value="cleared" />
                <el-option label="已封禁" value="blocked" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="素材来源">
          <el-input v-model="form.source" placeholder="例如：MoeBlog 开源社区公共素材" />
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
const STORAGE_SERVICE_KEY = '290ab192e78b099dbf443f4c3b9f069682ba6f85'
const STORAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload'
const STORAGE_RESOURCE_URL = 'https://storage.codesocean.top/api/resource/get'
const ASSET_CONTAINER = '175221160113586'

export default {
  name: 'AvatarFramesManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '新增挂件',
      keyword: '',
      statusFilter: '',
      tierFilter: '',
      uploadingField: '',
      uploadProgress: 0,
      list: [],
      form: {
        frame_id: null,
        code: '',
        name: '',
        asset_url: '',
        thumbnail_url: '',
        required_tier: 'free',
        is_animated: false,
        avatar_scale: 1,
        offset_x: 0,
        offset_y: 0,
        status: 'draft',
        sort_order: 0,
        source: '',
        license_status: 'pending'
      },
      rules: {
        name: [{ required: true, message: '请输入挂件名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入挂件编码', trigger: 'blur' }],
        asset_url: [{ required: true, message: '请上传挂件素材', trigger: 'change' }],
        required_tier: [{ required: true, message: '请选择权益档位', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        avatar_scale: [{ required: true, message: '请输入缩放比例', trigger: 'change' }],
        license_status: [{ required: true, message: '请选择授权状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/avatar-frames', {
        params: {
          keyword: this.keyword,
          status: this.statusFilter,
          required_tier: this.tierFilter
        }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取挂件列表失败', error)
        this.$message.error('获取挂件列表失败')
      }).finally(() => {
        this.loading = false
      })
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑挂件'
        this.form = {
          frame_id: row.frame_id,
          code: row.code || '',
          name: row.name || '',
          asset_url: row.asset_url || '',
          thumbnail_url: row.thumbnail_url || '',
          required_tier: row.required_tier || 'free',
          is_animated: row.is_animated === 1,
          avatar_scale: Number(row.avatar_scale) || 1,
          offset_x: Number(row.offset_x) || 0,
          offset_y: Number(row.offset_y) || 0,
          status: row.status || 'draft',
          sort_order: row.sort_order || 0,
          source: row.source || '',
          license_status: row.license_status || 'pending'
        }
      } else {
        this.dialogTitle = '新增挂件'
        this.form = {
          frame_id: null,
          code: '',
          name: '',
          asset_url: '',
          thumbnail_url: '',
          required_tier: 'free',
          is_animated: false,
          avatar_scale: 1,
          offset_x: 0,
          offset_y: 0,
          status: 'draft',
          sort_order: 0,
          source: '',
          license_status: 'pending'
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.frameForm) {
          this.$refs.frameForm.clearValidate()
        }
      })
    },
    resetForm() {
      if (this.$refs.frameForm) {
        this.$refs.frameForm.resetFields()
      }
      this.uploadingField = ''
      this.uploadProgress = 0
    },
    uploadAsset(options, field) {
      const file = options.file
      this.uploadingField = field
      this.uploadProgress = 0
      const formData = new FormData()
      formData.append('file', file)
      this.axios.post(STORAGE_UPLOAD_URL + '?container=' + ASSET_CONTAINER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ServiceKey: STORAGE_SERVICE_KEY
        },
        onUploadProgress: event => {
          this.uploadProgress = Math.floor((event.loaded / event.total) * 100)
        }
      }).then(response => {
        const payload = response.data || {}
        const resourceId = payload.data && payload.data.resource_id
        if (!resourceId) {
          throw new Error('上传响应格式错误')
        }
        this.form[field] = STORAGE_RESOURCE_URL + '/' + resourceId
        this.$message.success('素材上传成功')
      }).catch(error => {
        console.error('上传失败', error)
        this.$message.error('上传失败，请重试')
      }).finally(() => {
        this.uploadingField = ''
        this.uploadProgress = 0
      })
    },
    submitForm() {
      this.$refs.frameForm.validate(valid => {
        if (!valid) {
          return
        }
        this.submitLoading = true
        const payload = {
          code: this.form.code.trim(),
          name: this.form.name.trim(),
          asset_url: this.form.asset_url,
          thumbnail_url: this.form.thumbnail_url,
          required_tier: this.form.required_tier,
          is_animated: this.form.is_animated ? 1 : 0,
          avatar_scale: this.form.avatar_scale,
          offset_x: this.form.offset_x,
          offset_y: this.form.offset_y,
          status: this.form.status,
          sort_order: this.form.sort_order,
          source: this.form.source.trim(),
          license_status: this.form.license_status
        }
        let request
        if (this.form.frame_id) {
          request = this.axios.put(this.$baseUrl + '/manage/avatar-frames/' + this.form.frame_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/avatar-frames', payload)
        }
        request.then(() => {
          this.$message.success(this.form.frame_id ? '挂件已更新' : '挂件已创建')
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
      this.$confirm(`确定删除挂件「${row.name}」吗？用户的选用记录也会一并清除。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/avatar-frames/' + row.frame_id)
          .then(() => {
            this.$message.success('已删除')
            this.fetchData()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    tierText(tier) {
      return { free: '免费', standard: '标准会员', super: '高级会员' }[tier] || tier
    },
    tierType(tier) {
      return { free: 'info', standard: 'warning', super: 'danger' }[tier] || 'info'
    },
    statusText(status) {
      return { draft: '草稿', active: '启用', disabled: '停用' }[status] || status
    },
    licenseText(license) {
      return { pending: '待确认', cleared: '已授权', blocked: '已封禁' }[license] || license
    },
    getFileName(url) {
      if (!url) {
        return ''
      }
      return url.split('/').pop()
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-frames-page {
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

.frame-preview {
  width: 56px;
  height: 56px;
  object-fit: contain;
  background: #f5f7fa;
  border-radius: 6px;
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 4px 10px;
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
