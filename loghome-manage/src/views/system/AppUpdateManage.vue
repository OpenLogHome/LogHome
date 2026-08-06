<template>
  <div class="app-update-page">
    <div class="page-header">
      <div>
        <h2>版本管理</h2>
        <p>管理 App 更新记录。最新版本会推送给所有客户端，安装包上传至安装包容器，资源包上传至资源容器。</p>
      </div>
      <el-button type="primary" @click="openDialog()">发布新版本</el-button>
    </div>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="app_update_id" label="ID" width="70" />
      <el-table-column label="版本" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.version }}
          <el-tag v-if="isLatest(scope.row)" size="mini" type="success" style="margin-left: 6px">最新</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="version_number" label="版本数字" width="100" />
      <el-table-column prop="update_time" label="发布时间" width="170">
        <template slot-scope="scope">
          {{ formatDate(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column label="热更新" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.allow_hot === 1 ? 'success' : 'info'" size="small">
            {{ scope.row.allow_hot === 1 ? '支持' : '不支持' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="强制更新" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_forced === 1 ? 'danger' : 'info'" size="small">
            {{ scope.row.is_forced === 1 ? '强制' : '可选' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="安装包" min-width="220">
        <template slot-scope="scope">
          <el-link v-if="scope.row.update_url" type="primary" :href="scope.row.update_url" target="_blank" :underline="false">
            {{ getFileName(scope.row.update_url) || '查看' }}
          </el-link>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="资源包" min-width="220">
        <template slot-scope="scope">
          <el-link v-if="scope.row.asset_url" type="primary" :href="scope.row.asset_url" target="_blank" :underline="false">
            {{ getFileName(scope.row.asset_url) || '查看' }}
          </el-link>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="760px" @close="resetForm">
      <el-form ref="updateForm" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="例如 Beta 3.1.0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本数字" prop="version_number">
              <el-input-number v-model="form.version_number" :min="1" :max="999999" controls-position="right" style="width: 100%" />
              <div class="form-tip">
                <template v-if="!form.app_update_id && latestVersionNumber">
                  当前最新为 {{ latestVersionNumber }}，发布必须更大
                </template>
                <template v-else>客户端用于版本比较的数字</template>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="更新内容" prop="version_info">
          <el-input v-model="form.version_info" type="textarea" :rows="6" placeholder="填写本次更新的内容说明" />
        </el-form-item>

        <el-form-item label="更新背景图">
          <image-upload-field
            v-model="form.update_bg"
            button-text="上传背景图"
            :preview-width="240"
            :preview-height="120"
            tip="选填，更新页顶部展示的背景图"
          />
        </el-form-item>

        <el-form-item label="允许热更新" prop="allow_hot">
          <el-switch v-model="form.allow_hot" active-text="支持" inactive-text="不支持" />
          <div class="form-tip">不支持热更新时无需上传资源包</div>
        </el-form-item>

        <el-form-item v-if="form.allow_hot" label="资源包" prop="asset_url">
          <div class="upload-row">
            <el-upload
              :show-file-list="false"
              action="#"
              :http-request="(options) => handleUpload(options, 'asset_url')"
              :disabled="!!uploadingField"
            >
              <el-button size="small" type="primary" :loading="uploadingField === 'asset_url'">
                {{ uploadingField === 'asset_url' ? `上传中 ${uploadProgress}%` : '上传资源包' }}
              </el-button>
            </el-upload>
            <div v-if="form.asset_url" class="uploaded-file">
              <el-link type="primary" :href="form.asset_url" target="_blank" :underline="false">{{ getFileName(form.asset_url) }}</el-link>
              <el-button type="text" size="small" @click="form.asset_url = ''">移除</el-button>
            </div>
          </div>
          <div class="form-tip">上传到资源容器（热更新资源包，如 zip / wgt 文件）</div>
        </el-form-item>

        <el-form-item label="安装包" prop="update_url">
          <div class="upload-row">
            <el-upload
              :show-file-list="false"
              action="#"
              :http-request="(options) => handleUpload(options, 'update_url')"
              :disabled="!!uploadingField"
            >
              <el-button size="small" type="primary" :loading="uploadingField === 'update_url'">
                {{ uploadingField === 'update_url' ? `上传中 ${uploadProgress}%` : '上传安装包' }}
              </el-button>
            </el-upload>
            <div v-if="form.update_url" class="uploaded-file">
              <el-link type="primary" :href="form.update_url" target="_blank" :underline="false">{{ getFileName(form.update_url) }}</el-link>
              <el-button type="text" size="small" @click="form.update_url = ''">移除</el-button>
            </div>
          </div>
          <div class="form-tip">上传到安装包容器（APK 全量包），客户端下载安装</div>
        </el-form-item>

        <el-form-item label="强制更新">
          <el-switch v-model="form.is_forced" active-text="强制" inactive-text="可选" />
          <div class="form-tip">强制更新时，客户端不能跳过该版本</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import ImageUploadField from '../../components/ImageUploadField.vue'

const ASSET_CONTAINER = '175221160113586'
const UPDATE_CONTAINER = '170684762774750'
const STORAGE_SERVICE_KEY = '290ab192e78b099dbf443f4c3b9f069682ba6f85'
const STORAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload'
const STORAGE_RESOURCE_URL = 'https://storage.codesocean.top/api/resource'

export default {
  name: 'AppUpdateManage',
  components: {
    ImageUploadField
  },
  data() {
    const validateAssetUrl = (rule, value, callback) => {
      if (this.form.allow_hot && !this.form.asset_url) {
        callback(new Error('允许热更新时必须上传资源包'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '发布新版本',
      uploadingField: '',
      uploadProgress: 0,
      list: [],
      form: {
        app_update_id: null,
        version: '',
        version_number: null,
        version_info: '',
        update_bg: '',
        update_url: '',
        asset_url: '',
        allow_hot: false,
        is_forced: false
      },
      rules: {
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        version_number: [
          { required: true, message: '请输入版本数字', trigger: 'change' }
        ],
        version_info: [
          { required: true, message: '请输入更新内容', trigger: 'blur' }
        ],
        update_url: [
          { required: true, message: '请上传安装包', trigger: 'change' }
        ],
        asset_url: [
          { validator: validateAssetUrl, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    latestVersionNumber() {
      if (this.list.length === 0) {
        return null
      }
      return Math.max(...this.list.map(item => item.version_number))
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/app-updates').then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取版本列表失败', error)
        this.$message.error('获取版本列表失败')
      }).finally(() => {
        this.loading = false
      })
    },
    isLatest(row) {
      return this.latestVersionNumber !== null && row.version_number === this.latestVersionNumber
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑版本'
        this.form = {
          app_update_id: row.app_update_id,
          version: row.version || '',
          version_number: row.version_number,
          version_info: row.version_info || '',
          update_bg: row.update_bg || '',
          update_url: row.update_url || '',
          asset_url: row.asset_url || '',
          allow_hot: row.allow_hot === 1,
          is_forced: row.is_forced === 1
        }
      } else {
        this.dialogTitle = '发布新版本'
        this.form = {
          app_update_id: null,
          version: '',
          version_number: this.latestVersionNumber ? this.latestVersionNumber + 1 : 1,
          version_info: '',
          update_bg: '',
          update_url: '',
          asset_url: '',
          allow_hot: false,
          is_forced: false
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.updateForm) {
          this.$refs.updateForm.clearValidate()
        }
      })
    },
    resetForm() {
      if (this.$refs.updateForm) {
        this.$refs.updateForm.resetFields()
      }
      this.uploadingField = ''
      this.uploadProgress = 0
    },
    handleUpload(options, field) {
      const file = options.file
      const containerId = field === 'asset_url' ? ASSET_CONTAINER : UPDATE_CONTAINER

      this.uploadingField = field
      this.uploadProgress = 0

      const formData = new FormData()
      formData.append('file', file)

      this.axios.post(STORAGE_UPLOAD_URL + '?container=' + containerId, formData, {
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
        const path = field === 'asset_url' ? 'get' : 'download'
        this.form[field] = STORAGE_RESOURCE_URL + '/' + path + '/' + resourceId
        this.$message.success(field === 'asset_url' ? '资源包上传成功' : '安装包上传成功')
      }).catch(error => {
        console.error('上传失败', error)
        this.$message.error('上传失败，请重试')
      }).finally(() => {
        this.uploadingField = ''
        this.uploadProgress = 0
      })
    },
    submitForm() {
      this.$refs.updateForm.validate(valid => {
        if (!valid) {
          return
        }

        if (!this.form.app_update_id) {
          const maxVersion = this.latestVersionNumber || 0
          if (this.form.version_number <= maxVersion) {
            this.$message.error(`版本数字必须大于当前最新版本数字 ${maxVersion}`)
            return
          }
        }

        this.submitLoading = true
        const payload = {
          version: this.form.version.trim(),
          version_number: this.form.version_number,
          version_info: this.form.version_info.trim(),
          update_bg: this.form.update_bg || '',
          update_url: this.form.update_url,
          asset_url: this.form.asset_url,
          allow_hot: this.form.allow_hot ? 1 : 0,
          is_forced: this.form.is_forced ? 1 : 0
        }

        let request
        if (this.form.app_update_id) {
          request = this.axios.put(this.$baseUrl + '/manage/app-updates/' + this.form.app_update_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/app-updates', payload)
        }

        request.then(() => {
          this.$message.success(this.form.app_update_id ? '版本已更新' : '版本已发布')
          this.dialogVisible = false
          this.fetchData()
        }).catch(error => {
          console.error('保存版本失败', error)
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除版本 ${row.version} 吗？删除后无法恢复。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/app-updates/' + row.app_update_id)
          .then(() => {
            this.$message.success('版本已删除')
            this.fetchData()
          }).catch(error => {
            console.error('删除版本失败', error)
            this.$message.error('删除版本失败')
          })
      }).catch(() => {})
    },
    getFileName(url) {
      if (!url) {
        return ''
      }
      const segments = url.split('/')
      return segments[segments.length - 1]
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
.app-update-page {
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

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
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

.danger-text {
  color: #f56c6c;
}
</style>
