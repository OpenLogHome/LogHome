<template>
  <div class="stickers-page">
    <div class="page-header">
      <div>
        <h2>表情包管理</h2>
        <p>管理全局表情包与用户上传的表情。上传的图片作为全局表情对所有用户可用。</p>
      </div>
      <el-button type="primary" @click="openUploadDialog">上传表情包</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-select v-model="scopeFilter" style="width: 160px" @change="fetchData">
          <el-option label="全部表情" value="" />
          <el-option label="全局表情" value="global" />
          <el-option label="用户上传" value="user" />
        </el-select>
        <el-button @click="fetchData">刷新</el-button>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="sticker_id" label="ID" width="80" />
      <el-table-column label="表情" width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.url" style="width: 56px; height: 56px" fit="contain" :preview-src-list="[scope.row.url]" />
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_private === 0 ? 'success' : 'info'" size="small">
            {{ scope.row.is_private === 0 ? '全局' : '用户上传' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上传者" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.user_name || scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column prop="favorite_count" label="收藏数" width="90" />
      <el-table-column prop="url" label="链接" min-width="260" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="url-text">{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="上传时间" width="170">
        <template slot-scope="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="上传表情包" :visible.sync="uploadDialogVisible" width="480px">
      <div class="upload-box">
        <el-upload
          drag
          action="#"
          :show-file-list="false"
          :http-request="handleUpload"
          accept="image/*"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip">支持 png / jpg / gif / webp，建议透明背景小图</div>
        </el-upload>
      </div>
      <div v-if="previewUrl" class="preview-box">
        <el-image :src="previewUrl" style="width: 80px; height: 80px" fit="contain" />
        <el-button size="small" type="primary" :loading="submitLoading" @click="submitSticker">确认添加为全局表情</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

const STORAGE_SERVICE_KEY = '290ab192e78b099dbf443f4c3b9f069682ba6f85'
const STORAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload'
const STORAGE_RESOURCE_URL = 'https://storage.codesocean.top/api/resource/get'
const STICKER_CONTAINER = '172018735018984'

export default {
  name: 'StickersManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      uploadDialogVisible: false,
      scopeFilter: '',
      list: [],
      previewUrl: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/stickers', {
        params: { scope: this.scopeFilter }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取表情包失败', error)
        this.$message.error('获取表情包失败')
      }).finally(() => {
        this.loading = false
      })
    },
    openUploadDialog() {
      this.previewUrl = ''
      this.uploadDialogVisible = true
    },
    handleUpload(options) {
      const file = options.file
      const formData = new FormData()
      formData.append('file', file)
      this.axios.post(STORAGE_UPLOAD_URL + '?container=' + STICKER_CONTAINER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ServiceKey: STORAGE_SERVICE_KEY
        }
      }).then(response => {
        const payload = response.data || {}
        const resourceId = payload.data && payload.data.resource_id
        if (!resourceId) {
          throw new Error('上传响应格式错误')
        }
        this.previewUrl = STORAGE_RESOURCE_URL + '/' + resourceId
        this.$message.success('图片上传成功，确认后添加为全局表情')
      }).catch(error => {
        console.error('上传失败', error)
        this.$message.error('上传失败，请重试')
      })
    },
    submitSticker() {
      this.submitLoading = true
      this.axios.post(this.$baseUrl + '/manage/stickers', {
        url: this.previewUrl
      }).then(() => {
        this.$message.success('表情已添加')
        this.uploadDialogVisible = false
        this.previewUrl = ''
        this.fetchData()
      }).catch(error => {
        this.$message.error((error.response && error.response.data && error.response.data.msg) || '添加失败')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除该表情包吗？删除后用户的收藏记录也会一并清除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/stickers/' + row.sticker_id)
          .then(() => {
            this.$message.success('已删除')
            this.fetchData()
          }).catch(error => {
            this.$message.error('删除失败')
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
.stickers-page {
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

.upload-box {
  margin-bottom: 16px;
}

.preview-box {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f5f7fa;
  border-radius: 6px;
  padding: 12px;
}

.url-text {
  font-size: 12px;
  word-break: break-all;
}

.danger-text {
  color: #f56c6c;
}
</style>
