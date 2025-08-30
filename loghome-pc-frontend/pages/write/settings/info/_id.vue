<template>
  <div class="info-edit-page">
    <div class="page-header">
      <h1 class="page-title">修改作品信息</h1>
      <nuxt-link :to="`/write/settings/${$route.params.id}`" class="back-link">返回作品设置</nuxt-link>
    </div>

    <div class="info-edit-container" v-if="!loading && !error">
      <div class="cover-section">
        <div 
          class="cover-preview" 
          :style="coverStyle"
          @click="openCoverUpload"
        >
          <div class="cover-overlay">
            <i class="el-icon-camera"></i>
            <span>点击更换封面</span>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <el-form :model="novelForm" label-position="top">
          <el-form-item label="作品名称" :rules="[{ required: true, message: '请输入作品名称', trigger: 'blur' }]">
            <el-input 
              v-model="novelForm.title" 
              placeholder="请输入作品名称" 
              maxlength="15"
              show-word-limit
            ></el-input>
          </el-form-item>
          
          <el-form-item label="作品简介" :rules="[{ required: true, message: '请输入作品简介', trigger: 'blur' }]">
            <el-input 
              type="textarea" 
              v-model="novelForm.content" 
              placeholder="请输入作品简介" 
              :rows="6"
              maxlength="300"
              show-word-limit
            ></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="submitting">保存修改</el-button>
            <el-button @click="$router.push(`/write/settings/${$route.params.id}`)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载作品信息...</p>
    </div>
    
    <!-- 错误提示 -->
    <div class="error-state" v-else-if="error">
      <div class="error-icon">❌</div>
      <h3 class="error-title">加载失败</h3>
      <p class="error-desc">{{error}}</p>
      <button class="error-button" @click="fetchNovelData">重试</button>
    </div>
    
    <!-- 封面上传对话框 -->
    <el-dialog
      title="上传封面"
      :visible.sync="coverDialogVisible"
      width="50%"
    >
      <div class="upload-container">
        <el-upload
          class="cover-uploader"
          action=""
          :http-request="uploadCover"
          :show-file-list="false"
          :before-upload="beforeCoverUpload"
        >
          <img v-if="coverPreview" :src="coverPreview" class="cover-preview-image">
          <i v-else class="el-icon-plus cover-uploader-icon"></i>
          <div class="upload-tip">点击上传封面图片<br>建议尺寸: 741×962</div>
        </el-upload>
        
        <div class="upload-actions">
          <el-button @click="coverDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCoverUpload" :disabled="!coverFile">确认上传</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '修改作品信息 - 原木社区'
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      submitting: false,
      novelForm: {
        title: '',
        content: ''
      },
      coverUrl: '',
      coverColor: '',
      coverDialogVisible: false,
      coverFile: null,
      coverPreview: ''
    }
  },
  computed: {
    coverStyle() {
      if (this.coverUrl) {
        return {
          backgroundImage: `url(${this.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      } else {
        // 随机颜色作为封面背景
        const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4']
        this.coverColor = this.coverColor || colors[Math.floor(Math.random() * colors.length)]
        return {
          backgroundColor: this.coverColor
        }
      }
    }
  },
  async mounted() {
    await this.fetchNovelData()
  },
  methods: {
    async fetchNovelData() {
      this.loading = true
      this.error = null
      
      try {
        // 获取作品信息
        const novelId = this.$route.params.id
        const response = await this.$api.essays.getNovelById(novelId)
        
        if (response && response.length > 0) {
          const novel = response[0]
          this.novelForm.title = novel.name
          this.novelForm.content = novel.content
          this.coverUrl = novel.picUrl
        } else {
          this.error = '未找到作品信息'
        }
      } catch (error) {
        console.error('获取作品信息失败:', error)
        this.error = '获取作品信息失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    openCoverUpload() {
      this.coverDialogVisible = true
      this.coverPreview = this.coverUrl
      this.coverFile = null
    },
    
    beforeCoverUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
      
      // 创建预览
      this.coverFile = file
      this.createCoverPreview(file)
      return false // 阻止自动上传
    },
    
    createCoverPreview(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.coverPreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    async uploadCover() {
      // 这个方法不会被直接调用，因为我们阻止了自动上传
      // 但需要提供给el-upload组件
    },
    
    async confirmCoverUpload() {
      if (!this.coverFile) {
        this.$message.warning('请先选择图片')
        return
      }
      
      try {
        this.submitting = true
        
        // 读取文件为base64
        const reader = new FileReader()
        reader.readAsDataURL(this.coverFile)
        
        reader.onload = async () => {
          const base64Data = reader.result
          const novelId = this.$route.params.id
          
          // 调用API上传封面
          await this.$api.essays.changeCover({
            img: base64Data,
            novel_id: novelId
          })
          
          this.$message.success('封面上传成功')
          this.coverUrl = base64Data // 临时显示，实际应该重新获取作品信息
          this.coverDialogVisible = false
          this.submitting = false
          
          // 重新获取作品信息以更新封面URL
          await this.fetchNovelData()
        }
      } catch (error) {
        console.error('上传封面失败:', error)
        this.$message.error('上传封面失败，请稍后重试')
        this.submitting = false
      }
    },
    
    async submitForm() {
      // 表单验证
      if (!this.novelForm.title.trim()) {
        this.$message.warning('请输入作品名称')
        return
      }
      
      if (!this.novelForm.content.trim()) {
        this.$message.warning('请输入作品简介')
        return
      }
      
      try {
        this.submitting = true
        const novelId = this.$route.params.id
        
        // 调用API修改作品信息
        await this.$api.essays.modifyNovel(novelId, this.novelForm.title, this.novelForm.content)
        
        this.$message.success('作品信息修改成功')
        
        // 返回作品设置页面
        this.$router.push(`/write/settings/${novelId}`)
      } catch (error) {
        console.error('修改作品信息失败:', error)
        this.$message.error('修改作品信息失败，请稍后重试')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;

.info-edit-page {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    .page-title {
      font-size: 28px;
      color: $secondary-color;
      margin: 0;
    }
    
    .back-link {
      color: $primary-color;
      text-decoration: none;
      font-size: 16px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .info-edit-container {
    background-color: $background-color;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .cover-section {
    display: flex;
    justify-content: center;
    
    .cover-preview {
      width: 200px;
      height: 260px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      
      &:hover .cover-overlay {
        opacity: 1;
      }
      
      .cover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
        color: white;
        
        i {
          font-size: 32px;
          margin-bottom: 10px;
        }
      }
    }
  }
  
  // 加载状态样式
  .loading-state {
    background-color: $background-color;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid $border-light;
      border-top: 5px solid $primary-color;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }
    
    .loading-text {
      color: $text-light;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  
  // 错误状态样式
  .error-state {
    background-color: $background-color;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .error-icon {
      font-size: 50px;
      margin-bottom: 20px;
      color: #e74c3c;
    }
    
    .error-title {
      font-size: 20px;
      color: $text-color;
      margin-bottom: 10px;
    }
    
    .error-desc {
      color: $text-light;
      margin-bottom: 25px;
    }
    
    .error-button {
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 30px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: $secondary-color;
      }
    }
  }
}

// 封面上传对话框样式
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  
  .cover-uploader {
    width: 300px;
    
    .el-upload {
      width: 100%;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      text-align: center;
      padding: 20px 0;
      
      &:hover {
        border-color: $primary-color;
      }
    }
    
    .cover-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    
    .cover-preview-image {
      max-width: 100%;
      max-height: 300px;
      display: block;
      margin: 0 auto;
    }
    
    .upload-tip {
      color: $text-light;
      font-size: 14px;
      margin-top: 10px;
      line-height: 1.5;
    }
  }
  
  .upload-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .info-edit-page {
    padding: 10px;
    
    .page-header {
      .page-title {
        font-size: 24px;
      }
    }
    
    .info-edit-container {
      padding: 20px;
    }
  }
}
</style>