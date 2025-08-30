<template>
  <div class="new-work-page">
    <div class="page-header">
      <h1 class="page-title">创建新作品</h1>
    </div>

    <div class="form-container">
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">作品名称</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="title" 
            placeholder="请输入作品名称（不超过15个字符）" 
            maxlength="15"
          >
          <div class="word-count">{{ title.length }}/15</div>
        </div>

        <div class="form-group">
          <label class="form-label">作品简介</label>
          <textarea 
            class="form-textarea" 
            v-model="content" 
            placeholder="请输入作品简介（不超过300个字符）" 
            maxlength="300"
            rows="4"
          ></textarea>
          <div class="word-count">{{ content.length }}/300</div>
        </div>

        <div class="form-group">
          <label class="form-label">选择标签</label>
          <div class="tags-select">
            <div 
              v-for="tag in suggested_tags" 
              :key="tag.tag_id" 
              class="tag-item" 
              :class="{ 'selected': selectedTags.includes(tag.tag_name) }"
              @click="toggleTag(tag.tag_name)"
            >
              {{ tag.tag_name }}
              <span v-if="tag.is_activity_tag" class="activity-badge">活动</span>
            </div>
            <div v-if="!suggested_tags.length" class="no-tags">暂无推荐标签</div>
          </div>
        </div>

        <div class="form-group agreement-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="checked">
            <span class="checkmark"></span>
            <span class="agreement-text">我已经阅读并接受
              <nuxt-link to="/agreement/content" class="agreement-link">《原木社区用户内容上传协议》</nuxt-link>
            </span>
          </label>
        </div>

        <div class="form-actions">
          <button class="cancel-button" @click="$router.push('/write')">取消</button>
          <button class="submit-button" @click="submit" :disabled="isSubmitting">{{ isSubmitting ? '创建中...' : '创建作品' }}</button>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">创作提示</h3>
          <ul class="tips-list">
            <li class="tip-item">作品名称简洁明了，容易记忆</li>
            <li class="tip-item">作品简介应当概括故事核心，吸引读者</li>
            <li class="tip-item">选择合适的标签有助于读者发现您的作品</li>
            <li class="tip-item">创建后可以在设置中修改作品信息</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '创建新作品 - 原木社区'
    }
  },
  data() {
    return {
      title: '',
      content: '',
      checked: false,
      isSubmitting: false,
      suggested_tags: [],
      selectedTags: [],
      novel_id: 0 // 临时ID，用于获取推荐标签
    }
  },
  mounted() {
    this.getSuggestedTags()
  },
  methods: {
    async getSuggestedTags() {
      try {
        // 由于获取推荐标签需要novel_id，这里使用0作为临时ID
        // 实际使用时可能需要调整后端API以支持不需要novel_id的情况
        const response = await this.$api.library.getSuggestedTags(this.novel_id)
        this.suggested_tags = response || []
        
        // 过滤出活动标签
        if (this.suggested_tags.length > 0) {
          this.suggested_tags = this.suggested_tags.filter(tag => tag.is_activity_tag)
        }
      } catch (error) {
        console.error('获取推荐标签失败:', error)
        this.$notify.error({
          title: '错误',
          message: '获取推荐标签失败'
        })
        this.suggested_tags = []
      }
    },
    toggleTag(tagName) {
      if (this.selectedTags.includes(tagName)) {
        this.selectedTags = this.selectedTags.filter(tag => tag !== tagName)
      } else {
        this.selectedTags.push(tagName)
      }
    },
    // 添加标签到小说
    async addTag(novelId, tagName) {
      if (tagName.trim() === '') return
      
      try {
        await this.$api.library.addNovelTag(novelId, tagName)
      } catch (error) {
        console.error('添加标签失败:', error)
        this.$notify.error({
          title: '错误',
          message: '添加标签失败: ' + (error.message || '未知错误')
        })
      }
    },
    async submit() {
      // 表单验证
      if (!this.checked) {
        this.$notify.warning({
          title: '提示',
          message: '请先阅读并接受《原木社区用户内容上传协议》'
        })
        return
      }
      
      if (!this.title.trim()) {
        this.$notify.warning({
          title: '提示',
          message: '请输入作品名称'
        })
        return
      }
      
      if (!this.content.trim()) {
        this.$notify.warning({
          title: '提示',
          message: '请输入作品简介'
        })
        return
      }
      
      // 防止重复提交
      if (this.isSubmitting) return
      
      this.isSubmitting = true
      
      try {
        // 创建新作品
        const response = await this.$api.essays.addNovel(this.title.trim(), this.content.trim())
        
        // 添加标签
        if (this.selectedTags.length > 0 && response && response.insertId) {
          const novelId = response.insertId
          for (const tagName of this.selectedTags) {
            await this.addTag(novelId, tagName)
          }
        }
        
        this.$notify.success({
          title: '成功',
          message: '作品创建成功'
        })
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          this.$router.push('/write')
        }, 1500)
      } catch (error) {
        console.error('创建作品失败:', error)
        this.$notify.error({
          title: '错误',
          message: '创建作品失败: ' + (error.message || '未知错误')
        })
      } finally {
        this.isSubmitting = false
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
$orange-color: #FB7D46;
$orange-dark: #fa6c2e;
$error-color: #e74c3c;

.new-work-page {
  width: 100%;
  
  .page-header {
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 32px;
    color: $secondary-color;
  }

  .form-container {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 30px;
  }

  .form-section {
    background-color: $background-color;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 25px;
  }

  .form-label {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: $text-color;
    margin-bottom: 8px;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid $border-color;
    border-radius: 4px;
    font-size: 16px;
    color: $text-color;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .word-count {
    text-align: right;
    font-size: 14px;
    color: $text-lighter;
    margin-top: 5px;
  }

  .tags-select {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .tag-item {
    padding: 8px 15px;
    background-color: $border-light;
    border-radius: 4px;
    font-size: 14px;
    color: $text-color;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      background-color: darken($border-light, 5%);
    }
    
    &.selected {
      background-color: lighten($orange-color, 25%);
      color: $orange-dark;
      border: 1px solid $orange-color;
    }
    
    .activity-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: $orange-color;
      color: white;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 10px;
    }
  }

  .no-tags {
    width: 100%;
    padding: 20px;
    text-align: center;
    color: $text-lighter;
    background-color: $border-light;
    border-radius: 4px;
  }

  .agreement-group {
    margin-top: 30px;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 30px;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
    
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      width: 20px;
      background-color: $border-light;
      border: 1px solid $border-color;
      border-radius: 3px;
    }
    
    &:hover input ~ .checkmark {
      background-color: darken($border-light, 5%);
    }
    
    input:checked ~ .checkmark {
      background-color: $orange-color;
      border-color: $orange-color;
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    input:checked ~ .checkmark:after {
      display: block;
    }
    
    .checkmark:after {
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  .agreement-text {
    font-size: 15px;
    color: $text-color;
  }

  .agreement-link {
    color: $orange-color;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
  }

  .cancel-button,
  .submit-button {
    padding: 12px 25px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cancel-button {
    background-color: $border-light;
    color: $text-color;
    border: none;
    
    &:hover {
      background-color: darken($border-light, 5%);
    }
  }

  .submit-button {
    background-color: $orange-color;
    color: white;
    border: none;
    
    &:hover {
      background-color: $orange-dark;
    }
    
    &:disabled {
      background-color: lighten($orange-color, 20%);
      cursor: not-allowed;
    }
  }

  .sidebar-section {
    background-color: $background-color;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .sidebar-title {
    font-size: 18px;
    color: $secondary-color;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-color;
  }

  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tip-item {
    position: relative;
    padding: 10px 0 10px 25px;
    border-bottom: 1px solid $border-light;
    color: $text-light;
    font-size: 14px;
    line-height: 1.5;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 14px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: $orange-color;
    }
  }

  @media (max-width: 992px) {
    .form-container {
      grid-template-columns: 1fr;
    }
  }
}
</style>