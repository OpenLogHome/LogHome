<template>
  <div class="fans-ranking">
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-spinner"></div>
      <p>正在加载粉丝榜...</p>
    </div>

    <div v-else class="fans-list-wrapper">
      <!-- 粉丝列表 -->
      <div class="fans-list">
        <div class="fan-item" v-for="(fan, index) in fanInfo" :key="fan.user_id">
          <div class="fan-rank">
            <div :class="index <= 2 ? rankClasses[index] : 'rank-number'">
              {{ index + 1 }}
            </div>
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

    <!-- 更多粉丝链接 -->
    <!-- <div class="view-more-wrapper" v-if="fanInfo.length > 0">
      <nuxt-link :to="`/novel/fans?id=${novelId}`" class="view-more-link">
        查看完整粉丝榜 >
      </nuxt-link>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    novelId: {
      type: [Number, String],
      required: true
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      loading: true,
      fanInfo: [],
      myInfo: {
        rank: "未上榜",
        fans_value: 0,
        name: "",
        avatar_url: ""
      },
      rankClasses: ['rank-first', 'rank-second', 'rank-third']
    }
  },
  async mounted() {
    await this.getFansList()
  },
  methods: {
    async getFansList() {
      this.loading = true
      try {
        // 获取粉丝列表
        const fans = await this.$api.novels.getNovelFans(this.novelId)
        this.fanInfo = fans || []
        
        // 获取用户信息（如果已登录）
        if (localStorage.getItem("token")) {
          await this.getMyInfo()
        }
      } catch (error) {
        console.error('获取粉丝榜失败', error)
      } finally {
        this.loading = false
      }
    },
    
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
        for (let i = 0; i < this.fanInfo.length; i++) {
          if (this.fanInfo[i].user_id == userInfo.id) {
            this.myInfo.rank = `第 ${i + 1} 名`
            this.myInfo.fans_value = this.fanInfo[i].fans_value
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
$primary-color: #947358;
$secondary-color: #704C35;
$accent-color: #EA7034;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;

@mixin loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fans-ranking {
  width: 100%;
  position: relative;
  margin-bottom: 20px;
  
  .loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    
    .loading-spinner {
      @include loading-spinner;
    }
    
    p {
      color: $text-lighter;
      font-size: 14px;
    }
  }
  
  .fans-list-wrapper {
    width: 100%;
    position: relative;
    
    .fans-list {
      width: 100%;
      
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
    
    .my-info-wrapper {
      position: sticky;
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
  
  .view-more-wrapper {
    text-align: right;
    margin-top: 15px;
    
    .view-more-link {
      color: $text-light;
      text-decoration: none;
      font-size: 14px;
      padding: 5px;
      
      &:hover {
        color: $accent-color;
      }
    }
  }
}
</style> 