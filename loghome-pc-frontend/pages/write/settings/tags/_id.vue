<template>
  <div class="tags-edit-container">
    <el-card class="tags-card">
      <div slot="header" class="card-header">
        <span>作品标签</span>
        <el-button type="text" @click="goBack">返回</el-button>
      </div>
      
      <div class="current-tags">
        <h3>当前标签 <span class="tag-count">({{ tags && tags.length || 0 }}/8)</span></h3>
        <div class="tags-wrapper">
          <el-tag
            v-for="tag in tags || []"
            :key="tag.tag_id"
            closable
            :type="tag.is_activity_tag ? 'warning' : ''"
            :effect="tag.is_suggested ? 'plain' : 'light'"
            @close="deleteTag(tag.tag_id)"
            class="tag-item">
            {{ tag.tag_name }}
          </el-tag>
          <el-button 
            v-if="(tags && tags.length || 0) < 8" 
            class="add-tag-btn" 
            size="small" 
            icon="el-icon-plus" 
            @click="showAddTagDialog">
            添加标签
          </el-button>
        </div>
      </div>
      
      <div class="suggested-tags">
        <h3>官方标签</h3>
        <div class="tags-wrapper">
          <el-tag
            v-for="tag in suggested_tags || []"
            :key="tag.tag_id"
            :type="tag.is_activity_tag ? 'warning' : ''"
            :effect="tag.is_chosen || tag.is_suggested ? 'plain' : 'light'"
            @click="dealWithSuggested(tag.tag_id, tag.tag_name, tag.is_chosen)"
            class="tag-item suggested-tag">
            {{ tag.tag_name }}
          </el-tag>
        </div>
      </div>
    </el-card>
    
    <!-- 添加自定义标签对话框 -->
    <el-dialog
      title="添加标签"
      :visible.sync="addTagDialogVisible"
      width="30%"
      center>
      <el-input 
        v-model="newTagName" 
        placeholder="请输入标签名称"
        maxlength="15"
        show-word-limit>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTagDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCustomTag">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      novel_id: null,
      tags: [],
      suggested_tags: [],
      addTagDialogVisible: false,
      newTagName: '',
      loading: false,
      error: null
    }
  },
  async asyncData({ params, $api, error }) {
    try {
      const novel_id = params.id
      return { 
        novel_id,
        tags: [],
        suggested_tags: []
      }
    } catch (err) {
      error({ statusCode: 404, message: '无法获取作品信息' })
    }
  },
  async mounted() {
    try {
      this.loading = true
      await this.getNovelTags()
      await this.getSuggestedTags()
    } catch (err) {
      this.error = err.message || '加载标签失败'
      this.$message.error(this.error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async getNovelTags() {
      try {
        const response = await this.$api.library.getNovelTags(this.novel_id)
        this.tags = response || []
        console.log('获取标签成功:', this.tags)
      } catch (error) {
        console.error('获取作品标签失败:', error)
        this.$message.error(error.response?.data?.msg || '获取作品标签失败')
        this.tags = []
        throw error
      }
    },
    async getSuggestedTags() {
      try {
        const response = await this.$api.library.getSuggestedTags(this.novel_id)
        this.suggested_tags = response || []
        console.log('获取推荐标签成功:', this.suggested_tags)
      } catch (error) {
        console.error('获取推荐标签失败:', error)
        this.$message.error(error.response?.data?.msg || '获取推荐标签失败')
        this.suggested_tags = []
        throw error
      }
    },
    async deleteTag(tag_id) {
      try {
        await this.$api.library.deleteNovelTag(this.novel_id, tag_id)
        this.$message.success('删除标签成功')
        await this.getNovelTags()
        await this.getSuggestedTags()
      } catch (error) {
        this.$message.error(error.response?.data?.msg || '删除标签失败')
      }
    },
    async addTag(tagName) {
      if (!tagName || tagName.trim() === '') {
        this.$message.warning('标签名称不能为空')
        return
      }
      
      try {
        await this.$api.library.addNovelTag(this.novel_id, tagName.trim())
        this.$message.success('添加标签成功')
        this.newTagName = ''
        this.addTagDialogVisible = false
        await this.getNovelTags()
        await this.getSuggestedTags()
      } catch (error) {
        this.$message.error(error.response?.data?.msg || '添加标签失败')
      }
    },
    showAddTagDialog() {
      this.newTagName = ''
      this.addTagDialogVisible = true
    },
    addCustomTag() {
      this.addTag(this.newTagName)
    },
    dealWithSuggested(id, name, chosen) {
      const tagsLength = this.tags && this.tags.length || 0;
      if (chosen === true) {
        this.deleteTag(id)
      } else if (chosen === false && tagsLength < 8) {
        this.addTag(name)
      } else if (tagsLength >= 8) {
        this.$message.warning('最多只能使用8个标签')
      }
    },
    goBack() {
      this.$router.push(`/write/settings/${this.novel_id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #947358;
$warning-color: #ec8600;
$background-light: #f5f5f5;
$border-color: #e6e6e6;

.tags-edit-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
  
  .tags-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    h3 {
      font-size: 16px;
      margin-bottom: 15px;
      color: $primary-color;
      font-weight: 600;
      
      .tag-count {
        font-size: 14px;
        color: #999;
        font-weight: normal;
      }
    }
  }
  
  .current-tags, .suggested-tags {
    margin-bottom: 25px;
  }
  
  .tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    
    .tag-item {
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: default;
    }
    
    .suggested-tag {
      cursor: pointer;
    }
    
    .add-tag-btn {
      margin-bottom: 10px;
    }
  }
}

@media (max-width: 768px) {
  .tags-edit-container {
    padding: 0 10px;
    
    .el-dialog {
      width: 90% !important;
    }
  }
}
</style>