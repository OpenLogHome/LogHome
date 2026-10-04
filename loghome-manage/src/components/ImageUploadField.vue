<template>
  <div class="image-upload-field">
    <div v-if="value" class="preview-container">
      <el-image :src="value" :style="previewStyle" :fit="fit">
        <div slot="error" class="image-error">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div>
    <div class="action-row">
      <el-upload
        :action="uploadAction"
        :show-file-list="false"
        :headers="uploadHeaders"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :disabled="uploading"
        accept="image/*"
        name="img"
      >
        <el-button size="small" type="primary" :loading="uploading">
          {{ uploading ? `上传中 ${uploadProgress}%` : buttonText }}
        </el-button>
      </el-upload>
      <el-button v-if="value && allowClear" size="small" @click="clearImage">清除图片</el-button>
    </div>
    <div class="el-upload__tip">{{ resolvedTip }}</div>
  </div>
</template>

<script>
const DEFAULT_UPLOAD_ACTION = 'https://img.codesocean.top/upload/img'
const DEFAULT_UPLOAD_HEADERS = {
  apikey: 'iSnMUQ9OLZpCVY3p7E3T5b2YwC39TS'
}

export default {
  name: 'ImageUploadField',
  props: {
    value: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: '点击上传图片'
    },
    tip: {
      type: String,
      default: ''
    },
    maxSizeMb: {
      type: Number,
      default: 5
    },
    previewWidth: {
      type: Number,
      default: 200
    },
    previewHeight: {
      type: Number,
      default: 200
    },
    fit: {
      type: String,
      default: 'contain'
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uploadAction: DEFAULT_UPLOAD_ACTION,
      uploadHeaders: DEFAULT_UPLOAD_HEADERS,
      uploading: false,
      uploadProgress: 0
    }
  },
  computed: {
    previewStyle() {
      return {
        maxWidth: this.previewWidth + 'px',
        maxHeight: this.previewHeight + 'px'
      }
    },
    resolvedTip() {
      if (this.tip) {
        return this.tip
      }
      return `只能上传图片文件，且不超过 ${this.maxSizeMb}MB`
    }
  },
  methods: {
    beforeUpload(file) {
      const isImage = /^image\//.test(file.type)
      const isLtMaxSize = file.size / 1024 / 1024 < this.maxSizeMb

      if (!isImage) {
        this.$message.error('只能上传图片文件')
        return false
      }

      if (!isLtMaxSize) {
        this.$message.error(`图片大小不能超过 ${this.maxSizeMb}MB`)
        return false
      }

      this.uploading = true
      this.uploadProgress = 0
      return true
    },
    handleProgress(event) {
      this.uploadProgress = Math.floor(event.percent || 0)
    },
    handleSuccess(response) {
      this.uploading = false
      this.uploadProgress = 0
      if (response && response.url) {
        this.$emit('input', response.url)
        this.$emit('change', response.url)
        this.$message.success('图片上传成功')
      } else {
        this.$message.error('上传失败，返回格式错误')
      }
    },
    handleError() {
      this.uploading = false
      this.uploadProgress = 0
      this.$message.error('图片上传失败，请重试')
    },
    clearImage() {
      this.$emit('input', '')
      this.$emit('change', '')
    }
  }
}
</script>

<style scoped>
.preview-container {
  margin-bottom: 12px;
  display: inline-flex;
  max-width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 8px;
  background: #fafafa;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.image-error {
  width: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #909399;
}

.el-upload__tip {
  margin-top: 8px;
  line-height: 1.4;
}
</style>
