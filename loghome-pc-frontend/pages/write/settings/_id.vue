<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">作品设置</h1>
      <nuxt-link :to="`/write`" class="back-link">返回创作中心</nuxt-link>
    </div>

    <div class="settings-container" v-if="novel">
      <div class="settings-card">
        <h2 class="settings-section-title">基本设置</h2>
        
        <div class="settings-item" @click="showStatusDialog('personal')">
          <div class="settings-label">作品状态</div>
          <div class="settings-value">{{ novel.is_personal == 0 ? "公开" : "私密" }}</div>
          <div class="settings-arrow">›</div>
        </div>
        
        <div class="settings-item" @click="showStatusDialog('update')">
          <div class="settings-label">更新状态</div>
          <div class="settings-value">{{ novel.is_complete == 0 ? "连载" : "完结" }}</div>
          <div class="settings-arrow">›</div>
        </div>
        
        <div class="settings-item" @click="goToTagsEdit">
          <div class="settings-label">作品标签</div>
          <div class="settings-value tags-container">
            <span v-if="tags.length === 0">无</span>
            <span 
              v-for="tag in tags" 
              :key="tag.tag_id" 
              class="tag-item"
              :class="{'activity-tag': tag.is_activity_tag}"
            >
              {{ tag.tag_name }}
            </span>
          </div>
          <div class="settings-arrow">›</div>
        </div>
        
        <div class="settings-item" @click="goToInfoEdit">
          <div class="settings-label">修改作品信息</div>
          <div class="settings-arrow">›</div>
        </div>
      </div>
      
      <div class="settings-card danger-zone">
        <h2 class="settings-section-title">危险操作</h2>
        
        <div class="settings-item delete-item" @click="confirmDelete">
          <div class="settings-label">删除作品</div>
          <div class="settings-arrow">›</div>
        </div>
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
    
    <!-- 状态选择对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleDialogClose"
    >
      <div class="status-options">
        <div 
          v-for="option in dialogOptions" 
          :key="option.value" 
          class="status-option"
          @click="selectStatus(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </el-dialog>
    
    <!-- 删除确认对话框 -->
    <el-dialog
      title="确认删除"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <div class="delete-confirm-content">
        <p>删除后将无法找回，确定继续吗？</p>
        <p class="delete-warning">（删除作品将消耗50原木）</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteNovel">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '作品设置 - 原木社区'
    }
  },
  data() {
    return {
      novel: null,
      tags: [],
      loading: true,
      error: null,
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      dialogOptions: [],
      deleteDialogVisible: false
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
          this.novel = response[0]
          // 获取作品标签
          await this.fetchNovelTags()
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
    
    async fetchNovelTags() {
      try {
        const novelId = this.$route.params.id
        const response = await this.$api.library.getNovelTags(novelId)
        
        if (response && Array.isArray(response)) {
          this.tags = response
        }
      } catch (error) {
        console.error('获取作品标签失败:', error)
      }
    },
    
    showStatusDialog(type) {
      this.dialogType = type
      
      if (type === 'personal') {
        this.dialogTitle = '设置作品状态'
        this.dialogOptions = [
          { label: '公开', value: 0 },
          { label: '私密', value: 1 }
        ]
      } else if (type === 'update') {
        this.dialogTitle = '设置更新状态'
        this.dialogOptions = [
          { label: '连载', value: 0 },
          { label: '完结', value: 1 }
        ]
      }
      
      this.dialogVisible = true
    },
    
    handleDialogClose() {
      this.dialogVisible = false
    },
    
    async selectStatus(value) {
      try {
        const novelId = this.$route.params.id
        
        if (this.dialogType === 'personal') {
          await this.$api.essays.setNovelStatus({
            is_personal: value,
            novel_id: novelId
          })
          
          this.$message.success('作品状态修改成功')
        } else if (this.dialogType === 'update') {
          await this.$api.essays.setNovelUpdateStatus({
            is_complete: value,
            novel_id: novelId
          })
          
          this.$message.success('更新状态修改成功')
        }
        
        // 刷新作品数据
        await this.fetchNovelData()
      } catch (error) {
        console.error('修改状态失败:', error)
        this.$message.error('修改状态失败，请稍后重试')
      } finally {
        this.dialogVisible = false
      }
    },
    
    goToInfoEdit() {
      this.$router.push(`/write/settings/info/${this.$route.params.id}`)
    },
    
    goToTagsEdit() {
      this.$router.push(`/write/settings/tags/${this.$route.params.id}`)
    },
    
    confirmDelete() {
      this.deleteDialogVisible = true
    },
    
    async deleteNovel() {
      try {
        const novelId = this.$route.params.id
        await this.$api.essays.deleteNovel({
          id: novelId
        })
        
        this.$message.success('作品已删除')
        
        // 跳转回创作中心
        this.$router.push('/write')
      } catch (error) {
        console.error('删除作品失败:', error)
        this.$message.error('删除作品失败，请稍后重试')
      } finally {
        this.deleteDialogVisible = false
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
$danger-color: #f56c6c;
$orange-color: #FB7D46;
$orange-dark: #fa6c2e;

.settings-page {
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
  
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .settings-card {
    background-color: $background-color;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    &.danger-zone {
      border-left: 4px solid $danger-color;
    }
  }
  
  .settings-section-title {
    font-size: 18px;
    color: $secondary-color;
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-color;
  }
  
  .settings-item {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid $border-light;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: $border-light;
    }
    
    &.delete-item {
      .settings-label {
        color: $danger-color;
      }
    }
  }
  
  .settings-label {
    flex: 1;
    font-size: 16px;
    color: $text-color;
  }
  
  .settings-value {
    flex: 2;
    font-size: 16px;
    color: $text-light;
    text-align: right;
    padding-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .settings-arrow {
    font-size: 20px;
    color: $text-lighter;
    margin-left: 10px;
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 5px;
    
    .tag-item {
      background-color: #f0f0f0;
      color: $text-light;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 14px;
      
      &.activity-tag {
        background-color: rgba(251, 125, 70, 0.2);
        color: $orange-color;
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
  
  // 对话框样式
  .status-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .status-option {
      padding: 12px 20px;
      background-color: $border-light;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: darken($border-light, 5%);
      }
    }
  }
  
  .delete-confirm-content {
    text-align: center;
    
    .delete-warning {
      color: $danger-color;
      font-weight: bold;
      margin-top: 10px;
    }
  }
}

@media (max-width: 768px) {
  .settings-page {
    padding: 10px;
    
    .page-header {
      .page-title {
        font-size: 24px;
      }
    }
    
    .settings-label,
    .settings-value {
      font-size: 14px;
    }
  }
}
</style>