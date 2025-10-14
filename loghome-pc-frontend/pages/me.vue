<template>
  <div class="user-profile-container">
    <div class="profile-header">
      <div class="header-background">
        <img 
          :src="user.top_pic_url || 'https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg'" 
          alt="背景图片" 
          class="cover-image"
        />
        <div class="edit-cover" @click="changeCoverImage">
          <i class="el-icon-camera"></i> 更换封面
        </div>
      </div>
      
      <div class="user-info-box">
        <div class="avatar-box">
          <img 
            :src="user.avatar_url || '../static/user/defaultAvatar.jpg'" 
            alt="用户头像" 
            class="avatar-image"
          />
          <div class="edit-avatar" @click="changeUserInfo">
            <i class="el-icon-edit"></i>
          </div>
        </div>
        
        <div class="user-info">
          <div class="user-name">
            <span class="name">{{ user.name }}</span>
            <span class="user-id">ID: {{ user.user_id }}</span>
            <span v-for="group in userGroups" :key="group" class="user-group">{{ group }}</span>
          </div>
          <div class="user-motto">{{ user.motto || '这个人很懒，什么都没留下...' }}</div>
        </div>
      </div>
    </div>
    
    <div class="profile-body">
      <div class="left-panel">
        <div class="card user-actions">
          <div class="action-items">
            <div class="action-item" @click="activate" v-if="user.email === 'unbind'">
              <div class="action-icon warning">
                <i class="el-icon-warning-outline"></i>
              </div>
              <div class="action-text warning">绑定邮箱</div>
            </div>
            
            <div class="action-item" @click="viewUserProfile">
              <div class="action-icon">
                <i class="el-icon-user"></i>
              </div>
              <div class="action-text">个人名片</div>
            </div>
            
            <div class="action-item" @click="gotoMessages">
              <div class="action-icon" :class="{'new-message': hasNewMessage || hasNewPrivateMessage}">
                <i class="el-icon-message"></i>
              </div>
              <div class="action-text">我的消息</div>
            </div>
            
            <div class="action-item" @click="gotoFriends">
              <div class="action-icon">
                <i class="el-icon-user-solid"></i>
              </div>
              <div class="action-text">我的好友</div>
            </div>
            
            <div class="action-item" @click="gotoSettings">
              <div class="action-icon">
                <i class="el-icon-setting"></i>
              </div>
              <div class="action-text">账号设置</div>
            </div>
          </div>
        </div>
        
        <div class="card tree-plant">
          <div class="card-title">原木树场</div>
          <div class="tree-status" :class="{'warning': treeState === '未种植' || treeState === '结果'}">
            <i class="el-icon-tree"></i>
            <span>当前状态：{{ treeState }}</span>
          </div>
          <el-button type="primary" @click="gotoTreePlant">进入树场</el-button>
        </div>
        
        <div class="card balance">
          <div class="card-title">账户余额</div>
          <div class="balance-amount">{{ earningsMoney }} 元</div>
          <el-button @click="gotoEarnings">余额提现</el-button>
        </div>
      </div>
      
      <div class="right-panel">
        <div class="card">
          <div class="card-title">社区功能</div>
          <div class="function-list">
            <div class="function-item" @click="gotoCredits">
              <i class="el-icon-medal"></i>
              <span>我的信誉</span>
            </div>
            
            <div class="function-item" @click="gotoRecharge">
              <i class="el-icon-coin"></i>
              <span>支持社区</span>
            </div>
            
            <div class="function-item" @click="gotoAbout">
              <i class="el-icon-info"></i>
              <span>关于社区</span>
            </div>
            
            <div class="function-item" @click="gotoFeedback">
              <i class="el-icon-document"></i>
              <span>意见反馈</span>
            </div>
            
            <div class="function-item" @click="gotoClientSet">
              <i class="el-icon-setting"></i>
              <span>设置</span>
            </div>
            
            <div class="function-item" @click="gotoAdmin" v-if="user.is_admin === 1">
              <i class="el-icon-s-tools"></i>
              <span>平台管理</span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">我的作品</div>
          <div class="empty-works" v-if="!userWorks || userWorks.length === 0">
            <i class="el-icon-document"></i>
            <p>你还没有创作作品</p>
            <el-button type="primary" @click="gotoWrite">开始创作</el-button>
          </div>
          <div class="works-grid" v-else>
            <div 
              class="work-item" 
              v-for="work in userWorks" 
              :key="work.novel_id"
              @click="navigateToWork(work.novel_id)"
              v-show="!work.is_personal"
            >
              <img :src="work.picUrl" alt="作品封面" class="work-cover" />
              <div class="work-info">
                <h3 class="work-title">{{ work.name }}</h3>
                <p class="work-desc">{{ work.content || '暂无简介' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">我的书架</div>
          <div class="empty-bookcase" v-if="!userBookcase || userBookcase.length === 0">
            <i class="el-icon-collection"></i>
            <p>你的书架还是空的</p>
            <el-button type="primary" @click="gotoLibrary">去看书</el-button>
          </div>
          <div class="bookcase-list" v-else>
            <!-- 这里显示用户书架内容 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  layout: 'default',
  data() {
    return {
      user: {},
      userGroups: [],
      hasNewMessage: false,
      hasNewPrivateMessage: false,
      treeState: "无",
      earningsMoney: 0.00,
      userWorks: [],
      userBookcase: [],
      worksLoading: false,
      bookcaseLoading: false
    }
  },
  mounted() {
    this.loadUserInfo()
    this.checkMessages()
    this.checkTreePlant()
    this.refreshResources()
    this.loadUserWorks()
  },
  methods: {
    loadUserInfo() {
      // 先尝试从localStorage获取用户信息
      const cachedUserInfo = localStorage.getItem('LogHomeUserInfo')
      
      if (cachedUserInfo) {
        this.user = JSON.parse(cachedUserInfo)
        if (this.user.user_group) {
          this.userGroups = this.user.user_group.split(",")
        }
        return
      }
      
      // 如果没有缓存，从服务器获取
      this.fetchUserInfo()
    },
    
    async fetchUserInfo() {
      try {
        // 使用API服务获取用户信息
        this.user = await this.$api.users.getUserProfile()
        
        if (this.user.user_group) {
          this.userGroups = this.user.user_group.split(",")
        }
      } catch (error) {
        console.error('获取用户资料失败', error)
        
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token')
          this.$router.push('/login?msg=unAuthorized')
        }
      }
    },
    
    getToken() {
      const tk = JSON.parse(localStorage.getItem('token'))
      return tk ? tk.tk : null
    },
    
    checkMessages() {
      // 检查系统消息
      if (localStorage.getItem('messages') === "") {
        localStorage.setItem('messages', "[]")
      }
      
      const curMessage = JSON.parse(localStorage.getItem('messages') || "[]")
      for (let item of curMessage) {
        if (item.is_read === 0 && item.to_id === this.user.user_id) {
          this.hasNewMessage = true
          break
        }
      }
      
      // 检查私信
      const unreadPrivateMessages = localStorage.getItem('unreadPrivateMessages')
      this.hasNewPrivateMessage = unreadPrivateMessages && parseInt(unreadPrivateMessages) > 0
    },
    
    async checkTreePlant() {
      try {
        const result = await this.$api.treePlant.getTreePlantInfo()
        this.treeState = result.treeState
      } catch (error) {
        console.error('获取树场信息失败', error)
      }
    },
    
    async refreshResources() {
      try {
        const result = await this.$api.resources.getUserResources()
        this.earningsMoney = result.earningsMoney
      } catch (error) {
        console.error('获取资源信息失败', error)
      }
    },
    
    // 加载用户作品
    async loadUserWorks() {
      this.worksLoading = true
      try {
        const response = await this.$api.users.getUserNovels(this.user.user_id)
        if (response.code === 0) {
          this.userWorks = response.data || []
        } else {
          throw new Error(response.message || '获取作品失败')
        }
      } catch (error) {
        console.error('加载用户作品失败', error)
        this.$message.error('作品信息加载失败')
      } finally {
        this.worksLoading = false
      }
    },
    
    bankNum(num) {
      if (isNaN(num)) {
        return num
      } else {
        const s = num.toFixed(2).toString()
        return s.substring(0, s.indexOf(".") + 3)
      }
    },
    
    changeCoverImage() {
      this.$router.push("/users/top_pic_upload?noneAnimation=1")
    },
    
    changeUserInfo() {
      this.$router.push("/users/change_user_info")
    },
    
    viewUserProfile() {
      this.$router.push("/users/personalPage?id=" + this.user.user_id)
    },
    
    gotoMessages() {
      this.$router.push("/community/message")
      this.hasNewMessage = false
      this.hasNewPrivateMessage = false
    },
    
    gotoFriends() {
      this.$router.push("/community/friends")
    },
    
    gotoSettings() {
      this.$router.push("/users/clientSet")
    },
    
    activate() {
      this.$router.push("/users/activateAccount")
    },
    
    gotoTreePlant() {
      this.$router.push("/treePlant/treeplant")
    },
    
    gotoEarnings() {
      this.$router.push("/payments/earnings")
    },
    
    gotoCredits() {
      this.$router.push("/users/user_credit")
    },
    
    gotoRecharge() {
      this.$router.push("/payments/recharge")
    },
    
    gotoAbout() {
      this.$router.push("/apps/about")
    },
    
    gotoFeedback() {
      this.$router.push("/apps/faqs/faq")
    },
    
    gotoClientSet() {
      this.$router.push("/users/clientSet")
    },
    
    gotoAdmin() {
      this.$router.push("/manage/index")
    },
    
    gotoWrite() {
      this.$router.push("/write")
    },
    
    gotoLibrary() {
      this.$router.push("/read")
    },
    
    // 导航到作品
    navigateToWork(novelId) {
      if (novelId > 0) {
        this.$router.push(`/novel/${novelId}`)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user-profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
}

.header-background {
  height: 200px;
  position: relative;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .edit-cover {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }
}

.user-info-box {
  padding: 20px;
  display: flex;
  align-items: flex-start;
  margin-top: -50px;
  position: relative;
  z-index: 1;
}

.avatar-box {
  position: relative;
  margin-right: 20px;
  
  .avatar-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    border: 4px solid #fff;
    object-fit: cover;
    background-color: #f5f5f5;
  }
  
  .edit-avatar {
    position: absolute;
    right: -10px;
    bottom: -10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #947358;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    
    &:hover {
      background: #826347;
    }
  }
}

.user-info {
  flex: 1;
  padding-top: 10px;
}

.user-name {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  
  .name {
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
  }
  
  .user-id {
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 14px;
    margin-right: 10px;
  }
  
  .user-group {
    background: #947358;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}

.user-motto {
  color: #666;
  margin-top: 10px;
  font-size: 14px;
}

.profile-body {
  display: flex;
  gap: 20px;
  
  .left-panel {
    width: 300px;
    flex-shrink: 0;
  }
  
  .right-panel {
    flex: 1;
  }
}

.card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
  
  .card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
  }
}

.action-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px;
  border-radius: 8px;
  
  &:hover {
    background: #f9f9f9;
  }
  
  .action-icon {
    width: 48px;
    height: 48px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    font-size: 24px;
    color: #947358;
    
    &.warning {
      color: #ff5500;
      animation: pulse 1.5s infinite;
    }
    
    &.new-message {
      position: relative;
      
      &:after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 10px;
        height: 10px;
        background: #ff5500;
        border-radius: 50%;
      }
    }
  }
  
  .action-text {
    font-size: 14px;
    
    &.warning {
      color: #ff5500;
      font-weight: bold;
    }
  }
}

.tree-status {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
  
  i {
    margin-right: 10px;
    font-size: 20px;
    color: #947358;
  }
  
  &.warning {
    color: #ff5500;
    
    i {
      color: #ff5500;
      animation: pulse 1.5s infinite;
    }
  }
}

.balance-amount {
  font-size: 24px;
  font-weight: bold;
  color: #947358;
  margin-bottom: 15px;
}

.function-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #f9f9f9;
  }
  
  i {
    font-size: 20px;
    color: #947358;
    margin-right: 10px;
  }
  
  span {
    font-size: 14px;
  }
}

.empty-works, .empty-bookcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  color: #999;
  
  i {
    font-size: 48px;
    margin-bottom: 15px;
  }
  
  p {
    margin-bottom: 15px;
  }
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.work-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  
  .work-cover {
    width: 100%;
    height: 120px;
    object-fit: cover;
    background-color: #f5f5f5;
  }
  
  .work-info {
    padding: 15px;
    
    .work-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 0 0 8px 0;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .work-desc {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>