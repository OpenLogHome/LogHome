<template>
  <div class="write-edit-page">
    <!-- 主要内容区域 -->
    <div class="edit-container">
      <!-- 初始化加载状态 -->
      <div class="loading-state" v-if="isInitializing">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在初始化编辑器...</p>
      </div>
      
      <!-- 错误状态 -->
      <div class="error-state" v-else-if="!workId">
        <div class="error-icon">❌</div>
        <h3 class="error-title">无效的作品</h3>
        <p class="error-desc">未能获取到有效的作品，请返回重新选择作品</p>
        <button class="error-button" @click="goBack">返回作品列表</button>
      </div>
      
      <!-- 左右分栏布局 -->
      <div class="split-layout" v-else>
        <!-- 左侧：移动端页面 -->
        <div class="left-panel" v-show="!isLeftPanelHidden" :style="{width: leftPanelWidth + 'px'}">
          <div class="micro-app-container">
             <iframe class="mobile-iframe" v-if="panelUrl" :src="panelUrl" frameborder="0"></iframe>
             <div v-else class="loading-container">
               <div class="loading-spinner"></div>
               <p class="loading-text">正在加载编辑器...</p>
             </div>
           </div>
        </div>
        
        <!-- 调整手柄 -->
        <div class="resize-handle" v-show="!isLeftPanelHidden" @mousedown="startResize"></div>
        
        <!-- 展开按钮（当左侧面板隐藏时显示） -->
        <div class="expand-button" v-show="isLeftPanelHidden" @click="showLeftPanel">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- 右侧：编辑器或空页面 -->
        <div class="right-panel">
          <!-- 编辑器iframe -->
          <div class="editor-container" v-if="rightPanelContent === 'editor'">
            <div class="editor-header">
              <div class="editor-title">
                <span class="title-text">{{ currentEditingArticle ? currentEditingArticle.title : '编辑器' }}</span>
                <span class="article-type-tag" v-if="currentEditingArticle">
                  {{ getArticleTypeLabel(currentEditingArticle.article_type) }}
                </span>
              </div>
              <button class="close-editor-btn" @click="closeEditor">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <iframe class="editor-iframe" frameborder="0"></iframe>
          </div>
          
          <!-- 空状态 -->
          <div class="empty-content" v-else>
            <div class="empty-icon">📝</div>
            <h4 class="empty-title">选择文章开始编辑</h4>
            <p class="empty-desc">在左侧选择要编辑的文章，编辑器将在此处显示</p>
          </div>
        </div>
        
        <!-- 拖拽遮罩层 -->
        <div class="drag-overlay" v-show="isResizing"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  head() {
    return {
      title: `写作编辑器 - 原木社区`
    }
  },
  data() {
    return {
      workId: null,
      token: null,
      panelUrl: '',
      microAppData: {},
      leftPanelWidth: 400,
      isResizing: false,
      startX: 0,
      startWidth: 0,
      isLeftPanelHidden: false,
      currentEditingArticle: null,
      rightPanelContent: 'empty', // 'empty', 'editor'
      isInitializing: true // 添加初始化状态
    }
  },
  created() {
    // 在created钩子中立即获取workId，避免闪动
    this.workId = this.$route.params.id
    
    // 验证ID是否有效
    if (!this.workId || this.workId === 'undefined') {
      console.error('无效的作品ID:', this.workId)
      this.workId = null
      this.isInitializing = false
      return
    }
    
    console.log('当前编辑的作品ID:', this.workId)
  },
  async mounted() {
    // 如果workId有效，继续初始化
    if (this.workId) {
      // 获取token并构建移动端URL
      await this.initializeMobileApp()
      
      // 监听来自iframe的消息
      window.addEventListener('message', this.handleIframeMessage)
    }
    
    // 初始化完成
    this.isInitializing = false
  },
  beforeDestroy() {
    // 清理事件监听器
    window.removeEventListener('message', this.handleIframeMessage)
  },
  methods: {
    async initializeMobileApp() {
      try {
        const tokenData = localStorage.getItem('token')
        if (tokenData) {
          // 获取跨站点token
          const response = await this.$api.users.generateCrossSiteToken()
          this.token = response.crossSiteToken
          
          // 构建移动端URL
          const redirectUrl = encodeURIComponent(`/pages/writers/allArticles?id=${this.workId}`)
          // this.panelUrl = `${process.env.mobileUrl}/#/pages/users/external_login?token=${this.token}&redirectTo=${redirectUrl}`
          this.panelUrl = `${"http://localhost:8080"}/#/pages/users/external_login?token=${this.token}&hideback=true&redirectTo=${redirectUrl}`
          
          console.log('移动端URL:', this.panelUrl)
        } else {
          console.error('未找到token')
        }
      } catch (error) {
        console.error('初始化移动端应用失败:', error)
      }
    },
    
    goBack() {
      // 返回上一页
      this.$router.go(-1)
    },
    
    onMicroAppMounted(e) {
      console.log('micro-app mounted:', e)
    },
    
    onMicroAppUnmount(e) {
      console.log('micro-app unmount:', e)
    },
    
    onMicroAppError(e) {
      console.error('micro-app error:', e)
    },
    
    startResize(e) {
      this.isResizing = true
      this.startX = e.clientX
      this.startWidth = this.leftPanelWidth
      
      document.addEventListener('mousemove', this.handleResize)
      document.addEventListener('mouseup', this.stopResize)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    
    handleResize(e) {
      if (!this.isResizing) return
      
      const deltaX = e.clientX - this.startX
      const newWidth = this.startWidth + deltaX
      
      // 如果拖拽到小于100px，隐藏面板
      if (newWidth < 100) {
        this.isLeftPanelHidden = true
        this.stopResize()
        return
      }
      
      // 限制最小和最大宽度
      if (newWidth >= 100 && newWidth <= 400) {
        this.leftPanelWidth = newWidth
      }
    },
    
    stopResize() {
      this.isResizing = false
      document.removeEventListener('mousemove', this.handleResize)
      document.removeEventListener('mouseup', this.stopResize)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    },
    
    showLeftPanel() {
      this.isLeftPanelHidden = false
      this.leftPanelWidth = 200 // 重新显示时设置为默认宽度
    },
    
    handleIframeMessage(event) {
      // 验证消息来源（可选，根据实际需求调整）
      // if (event.origin !== 'http://localhost:8080') return;
      
      console.log('父框架收到iframe消息:', event.data)
      
      if (event.data.type === 'iframe_ready' && event.data.source === 'allArticles') {
        // iframe已准备就绪，发送确认消息
        console.log('收到移动端编辑器准备就绪消息，发送确认')
        
        // 向iframe发送确认消息
        const iframe = document.querySelector('.mobile-iframe')
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'frame_confirmed',
            source: 'parentFrame',
            message: '父框架已确认通信'
          }, '*')
          console.log('已向iframe发送确认消息')
        }
      } else if (event.data.type === 'iframe_ready' && event.data.source === 'chapterEditor') {
        // chapterEditor iframe已准备就绪，发送确认消息
        console.log('收到章节编辑器准备就绪消息，发送确认')
        
        // 向右侧编辑器iframe发送确认消息
        const editorIframe = document.querySelector('.editor-iframe')
        if (editorIframe && editorIframe.contentWindow) {
          editorIframe.contentWindow.postMessage({
            type: 'frame_confirmed',
            target: 'chapterEditor',
            source: 'parentFrame',
            message: '父框架已确认通信'
          }, '*')
          console.log('已向章节编辑器iframe发送确认消息')
        }
      } else if (event.data.type === 'frame_enabled' && event.data.source === 'allArticles') {
        console.log('iframe模式已成功启用:', event.data.message)
      } else if (event.data.type === 'current_selected' && event.data.source === 'chapterEditor') {
        // 处理来自chapterEditor的当前选中文章消息
        console.log('收到章节编辑器当前选中文章消息:', event.data.data)
        
        // 转发消息给左侧的allArticles iframe
        const iframe = document.querySelector('.mobile-iframe')
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'current_selected',
            source: 'parentFrame',
            data: event.data.data
          }, '*')
          console.log('已转发当前选中文章消息给allArticles')
        }
      } else if (event.data.type === 'edit_article' && event.data.source === 'allArticles') {
        // 处理文章编辑请求
        console.log('收到文章编辑请求:', event.data.data)
        this.handleArticleEdit(event.data.data)
      }
    },
    
    handleArticleEdit(articleData) {
      // 保存当前编辑的文章信息
      this.currentEditingArticle = articleData
      this.rightPanelContent = 'editor'
      
      console.log('开始编辑文章:', articleData.title, '类型:', articleData.article_type)
      
      // 根据文章类型构建编辑器URL
      let editorUrl = ''
      if (articleData.article_type === 'worldVocabulary') {
        editorUrl = `/pages/writers/worldVocabularyEditor?id=${articleData.article_id}`
      } else if (articleData.article_type !== 'spliter') {
        editorUrl = `/pages/writers/chapterEditor?id=${articleData.article_id}`
      }
      
      if (editorUrl) {
        // 构建完整的编辑器URL
        const fullEditorUrl = `${'http://localhost:8080'}/#${editorUrl}&hideback=true&token=${this.token}`
        
        // 更新右侧面板内容
        this.$nextTick(() => {
          const rightIframe = document.querySelector('.editor-iframe')
          if (rightIframe) {
            rightIframe.src = fullEditorUrl
          }
        })
      }
    },
    
    getArticleTypeLabel(articleType) {
      const typeLabels = {
        'richtext': '章节',
        'worldOutline': '大纲',
        'worldVocabulary': '词条',
        'spliter': '分卷'
      }
      return typeLabels[articleType] || '文章'
    },
    
    closeEditor() {
      this.rightPanelContent = 'empty'
      this.currentEditingArticle = null
      
      // 向左侧面板发送取消选中的消息
      const iframe = document.querySelector('.mobile-iframe')
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'clear_selection',
          source: 'parentFrame',
          message: '编辑器已关闭，取消文章选中状态'
        }, '*')
        console.log('已向左侧面板发送取消选中消息')
      }
      
      console.log('关闭编辑器')
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
$orange-color: #FB7D46;
$orange-dark: #fa6c2e;

.write-edit-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  

  
  .edit-container {
    flex: 1;
    max-width: 2400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    
    // 左右分栏布局
    .split-layout {
      display: flex;
      height: 100%;
      min-height: 100vh;
      flex: 1;
    }
    
    .left-panel {
      flex: 0 0 auto;
      background-color: $background-color;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .resize-handle {
      width: 4px;
      background-color: #ddd;
      cursor: col-resize;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: $primary-color;
      }
    }
    
    .expand-button {
      width: 13px;
      height: 100vh;
      background-color: #DDDDDD;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s ease;
      
      svg {
        width: 16px;
        height: 16px;
        color: white;
      }
      
      &:hover {
        background-color: $secondary-color;
      }
    }
    
    .drag-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      cursor: col-resize;
    }
    
    .right-panel {
      flex: 1;
      background-color: $background-color;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    

    
    .micro-app-container {
       flex: 1;
       position: relative;
       overflow: hidden;
       
       .mobile-iframe {
         width: 100%;
         height: 100%;
         border: none;
         display: block;
       }
       
       .loading-container {
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         height: 100%;
         
         .loading-spinner {
           width: 40px;
           height: 40px;
           border: 4px solid $border-light;
           border-top: 4px solid $primary-color;
           border-radius: 50%;
           animation: spin 1s linear infinite;
           margin-bottom: 16px;
         }
         
         .loading-text {
           color: $text-light;
           font-size: 14px;
           margin: 0;
         }
       }
     }
    
    // 编辑器容器样式
    .editor-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      .editor-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px 20px;
        background-color: $border-light;
        border-bottom: 1px solid $border-color;
        
        .editor-title {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .editor-icon {
            font-size: 18px;
          }
          
          .title-text {
            font-size: 16px;
            font-weight: 600;
            color: $text-color;
          }
          
          .article-type-tag {
            background-color: $primary-color;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }
        }
        
        .close-editor-btn {
          width: 32px;
          height: 32px;
          border: none;
          background-color: transparent;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
          
          svg {
            width: 18px;
            height: 18px;
            color: $text-light;
          }
          
          &:hover {
            background-color: $border-color;
          }
        }
      }
      
      .editor-iframe {
        flex: 1;
        width: 100%;
        border: none;
        display: block;
      }
    }
    
    // 右侧空内容样式
    .empty-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      
      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
        opacity: 0.6;
      }
      
      .empty-title {
        font-size: 20px;
        font-weight: 600;
        color: $text-color;
        margin: 0 0 12px 0;
      }
      
      .empty-desc {
        font-size: 16px;
        color: $text-light;
        margin: 0;
        line-height: 1.6;
      }
    }
    
    .work-info {
      background-color: $background-color;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .work-id-display {
        color: $text-light;
        font-size: 14px;
        margin-bottom: 30px;
        padding: 10px 15px;
        background-color: $border-light;
        border-radius: 4px;
        border-left: 3px solid $primary-color;
      }
      
      .placeholder-content {
        text-align: center;
        padding: 60px 20px;
        
        .placeholder-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .placeholder-title {
          font-size: 24px;
          color: $text-color;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .placeholder-desc {
          color: $text-light;
          font-size: 16px;
          line-height: 1.6;
        }
      }
    }
    
    .loading-state {
      background-color: $background-color;
      border-radius: 8px;
      padding: 60px 30px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin: auto;
      max-width: 500px;
      
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid $border-light;
        border-top: 4px solid $primary-color;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px auto;
      }
      
      .loading-text {
        color: $text-light;
        font-size: 16px;
        margin: 0;
        line-height: 1.6;
      }
    }
    
    .error-state {
      background-color: $background-color;
      border-radius: 8px;
      padding: 60px 30px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin: auto;
      max-width: 500px;
      
      .error-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }
      
      .error-title {
        font-size: 24px;
        color: $text-color;
        margin-bottom: 15px;
        font-weight: 600;
      }
      
      .error-desc {
        color: $text-light;
        font-size: 16px;
        margin-bottom: 30px;
        line-height: 1.6;
      }
      
      .error-button {
        background-color: $primary-color;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
        
        &:hover {
          background-color: $secondary-color;
        }
      }
    }
  }
}

// 动画
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 响应式设计
 @media (max-width: 1024px) {
  .write-edit-page {
    .edit-container {
      .split-layout {
        flex-direction: column;
      }
      
      .resize-handle {
        display: none;
      }
      
      .left-panel,
      .right-panel {
        min-height: 400px;
      }
    }
  }
}

@media (max-width: 768px) {
  .write-edit-page {
    .edit-container {
      padding: 15px;
      
      .split-layout {
        flex-direction: column;
      }
      
      .resize-handle {
        display: none;
      }
      
      .empty-content {
        padding: 40px 15px;
        
        .empty-icon {
          font-size: 48px;
        }
        
        .empty-title {
          font-size: 18px;
        }
      }
      
      .work-info,
      .loading-state,
      .error-state {
        padding: 30px 20px;
        
        .placeholder-content {
          padding: 40px 15px;
          
          .placeholder-icon {
            font-size: 48px;
          }
          
          .placeholder-title {
            font-size: 20px;
          }
          
          .placeholder-desc {
            font-size: 14px;
          }
        }
      }
      
      .loading-state {
        padding: 40px 20px;
        
        .loading-spinner {
          width: 32px;
          height: 32px;
        }
        
        .loading-text {
          font-size: 14px;
        }
      }
      
      .error-state {
        padding: 40px 20px;
        
        .error-icon {
          font-size: 48px;
        }
        
        .error-title {
          font-size: 20px;
        }
        
        .error-desc {
          font-size: 14px;
        }
      }
    }
  }
}
</style>