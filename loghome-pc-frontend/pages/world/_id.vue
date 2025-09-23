<template>
  <div class="world-page">
    <div v-if="error" class="error-container">
      <p>{{ error }}</p>
      <nuxt-link to="/read" class="back-button">返回阅读列表</nuxt-link>
    </div>

    <div class="world-container" v-if="!error && world">
      <div class="world-header">
        <div class="world-cover" v-if="world.picUrl" :style="`background-image: url(${world.picUrl})`"></div>
        <div class="world-cover" v-else :style="`background-color: hsl(${world.novel_id * 30 % 360}, 70%, 80%)`"></div>
        <div class="world-id-tag">ID {{ world.novel_id }}</div>
        
        <div class="world-info">
          <h1 class="world-title">{{ world.name }}</h1>
          <div class="world-meta">
            <div class="author-info" @click="gotoUserProfile(world.author_id || world.creator_id)">
              <img v-if="world.avatar_url || world.auther_avatar" :src="world.avatar_url || world.auther_avatar" class="author-avatar" alt="作者头像" 
                :onerror="`this.onerror=null;this.src='/static/default-avatar.png'`">
              <div v-else class="author-avatar-placeholder">{{ world.user_name ? world.user_name.charAt(0) : '作' }}</div>
              <span class="author-name">{{ world.user_name || world.author_name || '佚名' }}</span>
            </div>
          </div>
          
          <div class="world-update-time">
            最近更新：{{ formatDate(world.update_time) }}
          </div>

          <div class="world-desc">
            {{ world.content }}
          </div>

          <div class="edit-button" v-if="isCreator" @click="editWorld(world.novel_id)">
            编辑设定
          </div>
        </div>
      </div>

      <div class="world-content">
        <el-tabs>
          <el-tab-pane label="世界设定">
            <div class="world-section">
              <div class="section-header">
                <div class="section-line"></div>
                <h3>世界大纲</h3>
              </div>
              
              <el-collapse v-if="worldOutlines.length > 0" accordion>
                <el-collapse-item 
                  v-for="outline in worldOutlines" 
                  :key="outline.article_id"
                  :title="outline.title"
                  :name="outline.article_id">
                  <div class="article-content" @click="gotoArticle(outline.article_id)">
                    查看详情
                  </div>
                </el-collapse-item>
              </el-collapse>
              
              <div class="nothing" v-else>
                <img src="/static/default-avatar.png" alt="暂无内容" class="nothing-img">
                <p class="nothing-text">这是一片什么都没有的荒原</p>
              </div>

              <div class="section-header">
                <div class="section-line"></div>
                <h3>世界词条</h3>
              </div>
              
              <div class="vocab-tags" v-if="worldVocabs.length > 0">
                <el-tag 
                  v-for="vocab in worldVocabs" 
                  :key="vocab.article_id"
                  @click="gotoArticle(vocab.article_id)"
                  class="vocab-tag">
                  {{ vocab.title }}
                </el-tag>
              </div>
              
              <div class="nothing" v-else>
                <img src="/static/default-avatar.png" alt="暂无内容" class="nothing-img">
                <p class="nothing-text">这是一片什么都没有的荒原</p>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="关联作品">
            <div class="associated-novels" v-if="assoNovels.length > 0">
              <nuxt-link 
                v-for="novel in assoNovels" 
                :key="novel.novel_id"
                :to="`/novel/${novel.novel_id}`"
                class="novel-card">
                <div class="novel-cover">
                  <img 
                    :src="novel.picUrl ? novel.picUrl + '?thumbnail=1' : '/static/user/defaultCover.jpg'" 
                    :alt="novel.name"
                    :onerror="`this.onerror=null;this.src='/static/user/defaultCover.jpg'`">
                </div>
                <div class="novel-info">
                  <h4 class="novel-title">
                    {{ novel.name }}
                    <span class="novel-tag" v-if="novel.novel_type === 'world'">世界设定</span>
                  </h4>
                  <div class="novel-author">
                    <img 
                      :src="novel.avatar_url || novel.auther_avatar || '/static/default-avatar.png'" 
                      alt="作者头像" 
                      class="author-avatar"
                      :onerror="`this.onerror=null;this.src='/static/default-avatar.png'`">
                    <span class="author-name">{{ novel.user_name || novel.author_name || '佚名' }}</span>
                  </div>
                  <p class="novel-desc">{{ truncateText(novel.content, 100) }}</p>
                </div>
              </nuxt-link>
            </div>
            
            <div class="nothing" v-else>
              <img src="/static/default-avatar.png" alt="暂无内容" class="nothing-img">
              <p class="nothing-text">这是一片什么都没有的荒原</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
// 移除不必要的axios导入

export default {
  head() {
    return {
      title: this.world ? `${this.world.name} - 世界设定 - 原木社区` : '世界设定 - 原木社区',
      meta: [
        { hid: 'description', name: 'description', content: this.world ? this.truncateText(this.world.content, 150) : '原木社区世界设定' }
      ]
    }
  },
  
  async asyncData({ params, $api, error }) {
    try {
      const worldId = params.id
      const world = await $api.novels.getNovelById(worldId)
      
      if (!world || world.length === 0) {
        return { error: '未找到该世界设定' }
      }
      
      const worldData = world[0]
      
      // worldData中已经包含作者信息，无需额外获取
      // 如果author_name存在，使用author_name作为user_name
      if (worldData.author_name && !worldData.user_name) {
        worldData.user_name = worldData.author_name
      }
      
      // 获取世界大纲和词条
      const articles = await $api.articles.getArticles(worldData.novel_id) || []
      
      const worldOutlines = articles.filter(item => item.article_type === 'worldOutline')
      const worldVocabs = articles.filter(item => item.article_type === 'worldVocabulary')
      
      // 获取关联作品 - 使用世界关联作品API
      const assoNovels = await $api.worlds.getAssoWorldByWorldId(worldData.novel_id) || []
      
      // 关联作品中已包含作者信息，确保使用正确的字段
      for (const novel of assoNovels) {
        if (novel.author_name && !novel.user_name) {
          novel.user_name = novel.author_name
        }
      }
      
      return { 
        world: worldData,
        worldOutlines,
        worldVocabs,
        assoNovels
      }
    } catch (err) {
      console.error('获取世界设定失败:', err)
      return { error: '获取世界设定失败' }
    }
  },
  
  data() {
    return {
      error: null,
      world: null,
      worldOutlines: [],
      worldVocabs: [],
      assoNovels: [],
      userInfo: null
    }
  },
  
  computed: {
    isCreator() {
      return this.userInfo && this.world && this.userInfo.user_id === this.world.creator_id
    }
  },
  
  mounted() {
    this.getUserInfo()
  },
  
  methods: {
    async getUserInfo() {
      try {
        const token = this.$store.state.auth.token
        if (!token) return
        
        const userInfo = await this.$api.users.getUserProfile()
        this.userInfo = userInfo
        // 确保用户信息加载后重新检查创建者权限
        this.checkCreatorPermission()
      } catch (err) {
        console.error('获取用户信息失败:', err)
      }
    },
    
    formatDate(utcDatetime) {
      if (!utcDatetime) return ''
      
      const date = new Date(utcDatetime)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    
    gotoUserProfile(userId) {
      if (!userId) return
      this.$router.push(`/users/${userId}`)
    },
    
    gotoArticle(articleId) {
      this.$router.push(`/article/${articleId}`)
    },
    
    editWorld(novelId) {
      this.$router.push(`/write/edit/${novelId}?worldId=${this.world.world_id}`)
    },
    
    checkCreatorPermission() {
      if (this.userInfo && this.world) {
        // 验证当前用户是否为创建者
        this.isCreator = this.userInfo.user_id === this.world.creator_id
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 定义主题色变量
$primary-color: #947358;
$secondary-color: #704C35;

.world-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  .error-container {
    text-align: center;
    padding: 40px 0;
    
    p {
      font-size: 18px;
      color: #ff4d4f;
      margin-bottom: 20px;
    }
    
    .back-button {
      display: inline-block;
      padding: 8px 16px;
      background-color: #947358;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      
      &:hover {
        background-color: #704C35;
      }
    }
  }
  
  .world-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    
    .world-header {
      position: relative;
      display: flex;
      padding: 30px;
      background-image: linear-gradient(to top, #ffffff, #fff2d0);
      
      .world-cover {
        width: 180px;
        height: 240px;
        border-radius: 8px;
        background-size: cover;
        background-position: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        flex-shrink: 0;
      }
      
      .world-id-tag {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .world-info {
        margin-left: 30px;
        flex-grow: 1;
        
        .world-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
          background-image: linear-gradient(to right, black, #947358);
          -webkit-background-clip: text;
          color: transparent;
        }
        
        .world-meta {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          
          .author-info {
            display: flex;
            align-items: center;
            cursor: pointer;
            
            .author-avatar, .author-avatar-placeholder {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
              object-fit: cover;
            }
            
            .author-avatar-placeholder {
              background-color: #947358;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
            }
            
            .author-name {
              font-size: 16px;
              color: #666;
              
              &:hover {
                color: #947358;
              }
            }
          }
        }
        
        .world-update-time {
          font-size: 14px;
          color: #999;
          margin-bottom: 15px;
        }
        
        .world-desc {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 20px;
          max-height: 100px;
          overflow-y: auto;
        }
        
        .edit-button {
          display: inline-block;
          padding: 8px 20px;
          background-color: #947358;
          color: #fff;
          border: 1px solid #947358;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background-color: #704C35;
            border-color: #704C35;
          }
        }
      }
    }
    
    .world-content {
      padding: 20px 30px 30px;
      
      .world-section {
        margin-top: 10px;
        
        .section-header {
          display: flex;
          align-items: center;
          margin: 20px 0 15px;
          
          .section-line {
            width: 4px;
            height: 18px;
            background-color: #947358;
            margin-right: 10px;
          }
          
          h3 {
            font-size: 18px;
            color: #704C35;
            font-weight: bold;
            margin: 0;
          }
        }
        
        .vocab-tags {
          display: flex;
          flex-wrap: wrap;
          margin-top: 15px;
          
          .vocab-tag {
            margin: 0 10px 10px 0;
            cursor: pointer;
            background-color: rgba(148, 115, 88, 0.1);
            border-color: rgba(148, 115, 88, 0.2);
            color: #704C35;
            
            &:hover {
              background-color: rgba(148, 115, 88, 0.2);
              border-color: rgba(148, 115, 88, 0.3);
              color: #704C35;
            }
          }
        }
      }
      
      .associated-novels {
        .novel-card {
          display: flex;
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
          text-decoration: none;
          color: inherit;
          
          &:last-child {
            border-bottom: none;
          }
          
          &:hover {
            background-color: #f9f9f9;
          }
          
          .novel-cover {
            width: 120px;
            height: 160px;
            flex-shrink: 0;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 4px;
            }
          }
          
          .novel-info {
            margin-left: 20px;
            flex-grow: 1;
            
            .novel-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              
              .novel-tag {
                font-size: 12px;
                padding: 2px 6px;
                background-color: #ffd591;
                color: #873800;
                border-radius: 4px;
                margin-left: 10px;
                font-weight: normal;
              }
            }
            
            .novel-author {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              
              .author-avatar {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                margin-right: 8px;
              }
              
              .author-name {
                font-size: 14px;
                color: #666;
              }
            }
            
            .novel-desc {
              font-size: 14px;
              color: #999;
              line-height: 1.5;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
            }
          }
        }
      }
      
      .nothing {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        
        .nothing-img {
          width: 80px;
          height: 80px;
          opacity: 0.5;
          margin-bottom: 15px;
        }
        
        .nothing-text {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .world-page {
    padding: 10px;
    
    .world-container {
      .world-header {
        flex-direction: column;
        padding: 20px;
        
        .world-cover {
          width: 120px;
          height: 160px;
          margin-bottom: 20px;
        }
        
        .world-info {
          margin-left: 0;
          
          .world-title {
            font-size: 22px;
          }
        }
      }
      
      .world-content {
        padding: 15px;
      }
    }
  }
}
// 覆盖Element UI组件的默认样式
::v-deep .el-tabs__active-bar {
  background-color: $primary-color;
}

::v-deep .el-tabs__item:hover {
  color: $primary-color;
}

::v-deep .el-tabs__item.is-active {
  color: $primary-color;
}

::v-deep .el-collapse-item__header:hover {
  color: $primary-color;
}

::v-deep .el-collapse-item__header.is-active {
  color: $primary-color;
  border-bottom-color: $primary-color;
}

::v-deep .el-collapse-item__wrap {
  border-bottom-color: #ebeef5;
}
</style>