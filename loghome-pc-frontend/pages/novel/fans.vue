<template>
  <div class="fans-page">
    <div class="page-header">
      <nuxt-link to="/read" class="back-link">
        <span class="back-icon">←</span> 返回书库
      </nuxt-link>
      <h1 class="page-title">{{ novel.name }} - 粉丝榜</h1>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载粉丝榜...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <nuxt-link :to="`/novel/${novelId}`" class="back-button">返回小说详情</nuxt-link>
    </div>

    <div v-else class="fans-container">
      <div class="novel-info">
        <div class="novel-cover" v-if="novel.picUrl" :style="`background-image: url(${novel.picUrl})`"></div>
        <div class="novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`"></div>
        <div class="novel-details">
          <h2 class="novel-title">{{ novel.name }}</h2>
          <div class="novel-author" @click="gotoUserProfile(novel.auther_id)">
            <img v-if="novel.auther_avatar" :src="novel.auther_avatar" class="author-avatar" alt="作者头像">
            <div v-else class="author-avatar-placeholder">{{ novel.author_name ? novel.author_name.charAt(0) : '作' }}</div>
            <span class="author-name">{{ novel.author_name || '佚名' }}</span>
          </div>
        </div>
      </div>

      <div class="fans-list-container">
        <h3 class="section-title">原木力榜 - 粉丝贡献排行</h3>
        <div class="fans-list">
          <div class="fan-item" v-for="(fan, index) in fansList" :key="fan.user_id">
            <div class="fan-rank">
              <div :class="index <= 2 ? rankClasses[index] : 'rank-number'">{{ index + 1 }}</div>
            </div>
            <div class="fan-avatar">
              <img :src="fan.avatar_url" alt="头像" @click="gotoUserProfile(fan.user_id)">
            </div>
            <div class="fan-details">
              <div class="fan-info">
                <span class="fan-name" @click="gotoUserProfile(fan.user_id)">{{ fan.user_name }}</span>
                <span class="fan-value">{{ fan.fans_value }}</span>
              </div>
              <div class="fan-message">
                此书只应天上有，当赏当赏！
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前用户信息条 -->
      <div class="my-info-wrapper" v-if="$auth.loggedIn && myInfo.name">
        <div class="my-info-rank">
          {{ myInfo.rank }}
        </div>
        <div class="my-info">
          <div class="my-avatar">
            <img :src="myInfo.avatar_url" alt="我的头像">
          </div>
          <div class="my-details">
            <span class="my-name">{{ myInfo.name }}</span>
            <span class="my-value">{{ myInfo.fans_value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, query, $api, error }) {
    const novelId = query.id || params.id
    if (!novelId) {
      return error({ statusCode: 404, message: '未找到小说ID' })
    }
    
    try {
      // 获取小说信息
      const novel = await $api.novels.getNovelById(novelId)
      if (!novel || novel.length === 0) {
        return error({ statusCode: 404, message: '找不到该小说' })
      }
      
      // 获取粉丝榜数据
      const fansList = await $api.novels.getNovelFans(novelId)
      
      return {
        loading: false,
        error: null,
        novelId,
        novel: novel[0],
        fansList: fansList || []
      }
    } catch (err) {
      console.error('加载粉丝榜失败', err)
      return {
        loading: false,
        error: '加载粉丝榜失败，请稍后重试',
        novelId,
        novel: {},
        fansList: []
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      novelId: null,
      novel: {},
      fansList: [],
      myInfo: {
        rank: "未上榜",
        fans_value: 0,
        name: "",
        avatar_url: ""
      },
      rankClasses: ['rank-first', 'rank-second', 'rank-third']
    }
  },
  head() {
    return {
      title: this.novel?.name ? `${this.novel.name} - 粉丝榜 - 原木社区` : '粉丝榜 - 原木社区'
    }
  },
  async mounted() {
    if (localStorage.getItem("token")) {
      await this.getMyInfo()
    }
  },
  methods: {
    async getMyInfo() {
      try {
        // 获取当前用户信息
        const userInfo = this.$auth.user
        if (!userInfo) return
        
        this.myInfo = {
          ...this.myInfo,
          ...userInfo,
          avatar_url: userInfo.avatar,
          name: userInfo.name || userInfo.username
        }
        
        // 查找用户在粉丝榜中的排名
        for (let i = 0; i < this.fansList.length; i++) {
          if (this.fansList[i].user_id == userInfo.id) {
            this.myInfo.rank = `第 ${i + 1} 名`
            this.myInfo.fans_value = this.fansList[i].fans_value
            break
          }
        }
      } catch (error) {
        console.error('获取当前用户粉丝信息失败', error)
      }
    },
    
    gotoUserProfile(userId) {
      this.$router.push(`/user/${userId}`)
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
$error-color: #ff4d4f;
$success-color: #52c41a;
$warning-color: #faad14;
$accent-color: #EA7034;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin button-base {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

@mixin loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fans-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  
  .page-header {
    display: flex;
    align-items: center;
    margin: 20px 0;
    
    .back-link {
      color: $text-light;
      text-decoration: none;
      margin-right: 15px;
      
      &:hover {
        color: $accent-color;
      }
      
      .back-icon {
        font-size: 20px;
        margin-right: 5px;
      }
    }
    
    .page-title {
      margin: 0;
      font-size: 24px;
      color: $text-color;
    }
  }
  
  .loading-container,
  .error-container {
    @include flex-center;
    flex-direction: column;
    padding: 50px;
    text-align: center;
  }
  
  .loading-spinner {
    @include loading-spinner;
  }
  
  .back-button {
    @include button-base;
    background-color: $primary-color;
    color: white;
    text-decoration: none;
    margin-top: 20px;
    border: none;
  }
  
  .fans-container {
    background-color: $background-color;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 40px;
    
    .novel-info {
      display: flex;
      margin-bottom: 30px;
      
      .novel-cover {
        width: 120px;
        height: 160px;
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        margin-right: 20px;
        flex-shrink: 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      
      .novel-details {
        flex: 1;
        
        .novel-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0 0 15px 0;
          color: $text-color;
        }
        
        .novel-author {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          .author-avatar,
          .author-avatar-placeholder {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }
          
          .author-avatar {
            object-fit: cover;
          }
          
          .author-avatar-placeholder {
            @include flex-center;
            background-color: $primary-color;
            color: white;
            font-weight: bold;
          }
          
          .author-name {
            font-size: 16px;
            color: $text-light;
            
            &:hover {
              color: $primary-color;
            }
          }
        }
      }
    }
    
    .fans-list-container {
      margin-bottom: 60px;
      
      .section-title {
        font-size: 18px;
        color: $secondary-color;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid $border-color;
      }
      
      .fans-list {
        .fan-item {
          display: flex;
          align-items: center;
          padding: 15px 10px;
          border-bottom: 1px solid $border-light;
          
          &:last-child {
            border-bottom: none;
          }
          
          .fan-rank {
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            
            .rank-number {
              font-size: 16px;
              font-weight: bold;
              color: $text-light;
            }
            
            .rank-first, .rank-second, .rank-third {
              width: 24px;
              height: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
              border-radius: 50%;
            }
            
            .rank-first {
              background-color: #FF6B6B;
            }
            
            .rank-second {
              background-color: #FFB347;
            }
            
            .rank-third {
              background-color: #59C2A7;
            }
          }
          
          .fan-avatar {
            margin: 0 15px;
            
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              object-fit: cover;
              cursor: pointer;
              transition: transform 0.2s;
              
              &:hover {
                transform: scale(1.05);
              }
            }
          }
          
          .fan-details {
            flex: 1;
            
            .fan-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              
              .fan-name {
                font-weight: bold;
                color: $accent-color;
                cursor: pointer;
                
                &:hover {
                  text-decoration: underline;
                }
              }
              
              .fan-value {
                font-weight: bold;
                color: $accent-color;
              }
            }
            
            .fan-message {
              padding: 8px 12px;
              background-color: rgba($accent-color, 0.1);
              border-radius: 8px;
              font-size: 14px;
              color: $text-light;
              position: relative;
              
              &:before {
                content: "";
                position: absolute;
                top: -8px;
                left: 15px;
                border-width: 0 8px 8px;
                border-style: solid;
                border-color: transparent transparent rgba($accent-color, 0.1);
              }
            }
          }
        }
      }
    }
    
    .my-info-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      
      .my-info-rank {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 6px 15px;
        border-top-right-radius: 20px;
        font-size: 14px;
        display: inline-block;
      }
      
      .my-info {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 10px 15px;
        
        .my-avatar {
          margin-right: 15px;
          
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        
        .my-details {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          
          .my-name {
            color: white;
            font-weight: bold;
          }
          
          .my-value {
            color: $accent-color;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style> 