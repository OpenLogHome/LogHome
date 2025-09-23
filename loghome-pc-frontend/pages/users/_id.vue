<template>
  <div class="user-profile-page">
    <!-- 用户背景封面 -->
    <div class="profile-header">
      <div class="cover-container">
        <img 
          :src="user.top_pic_url || 'https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg'" 
          alt="背景封面" 
          class="cover-image"
          @click="previewCoverImage"
        />
        <div class="cover-overlay" v-if="isCurrentUser" @click="changeCoverImage">
          <i class="el-icon-camera"></i>
          <span>更换封面</span>
        </div>
      </div>
      
      <!-- 用户信息区域 -->
      <div class="user-info-section">
        <div class="user-basic-info">
          <!-- 用户头像 -->
          <div class="avatar-container">
            <img 
              :src="user.avatar_url || '/static/default-avatar.png'" 
              alt="用户头像" 
              class="user-avatar"
              @click="previewAvatar"
            />
          </div>
          
          <!-- 用户详细信息 -->
          <div class="user-details">
            <div class="user-name-section">
              <h1 class="user-name">{{ user.name }}</h1>
              <span class="user-id">ID: {{ uid }}</span>
              <div class="user-groups">
                <span 
                  v-for="group in userGroups" 
                  :key="group" 
                  class="user-group"
                  :class="getGroupClass(group)"
                >
                  {{ group }}
                </span>
                <span class="admin-badge" v-if="user.is_admin">
                  <img src="/static/icons/admin.gif" alt="管理员" class="admin-icon" />
                  社区管理员
                </span>
              </div>
            </div>
            
            <div class="user-motto">
              {{ user.motto || '暂无简介' }}
            </div>
            
            <!-- 关注数据 -->
            <div class="follow-stats">
              <div class="stat-item" @click="navigateToFriends(1)">
                <span class="stat-number">{{ fans }}</span>
                <span class="stat-label">粉丝</span>
              </div>
              <div class="stat-item" @click="navigateToFriends(0)">
                <span class="stat-number">{{ follows }}</span>
                <span class="stat-label">关注</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button 
            v-if="!isCurrentUser" 
            :type="isFollowing ? 'default' : 'primary'"
            @click="toggleFollow"
            :loading="followLoading"
          >
            {{ isFollowing ? '已关注' : '关注' }}
          </el-button>
          <el-button 
            v-if="isCurrentUser" 
            type="primary" 
            @click="editProfile"
          >
            编辑资料
          </el-button>
          <el-button 
            v-if="!isCurrentUser" 
            @click="sendPrivateMessage"
          >
            私信
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 内容标签页 -->
    <div class="content-tabs">
      <div class="tab-header">
        <div 
          class="tab-item" 
          :class="{ active: currentTab === 0 }"
          @click="switchTab(0)"
        >
          作品
        </div>
        <div 
          class="tab-item" 
          :class="{ active: currentTab === 1 }"
          @click="switchTab(1)"
        >
          动态
        </div>
        <div 
          class="tab-item" 
          :class="{ active: currentTab === 2 }"
          @click="switchTab(2)"
        >
          世界
        </div>
      </div>
      
      <!-- 标签页内容 -->
      <div class="tab-content">
        <!-- 作品列表 -->
        <div class="works-content" v-show="currentTab === 0">
          <div class="works-grid" v-if="userWorks.length > 0">
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
              </div>
            </div>
          </div>
          <div class="empty-state" v-else>
            <i class="el-icon-document"></i>
            <p>暂无作品</p>
          </div>
        </div>
        
        <!-- 动态列表 -->
        <div class="posts-content" v-show="currentTab === 1">
          <div class="posts-list" v-if="userPosts.length > 0">
            <div 
              class="post-item" 
              v-for="post in userPosts" 
              :key="post.post_id"
              @click="navigateToPost(post.post_id)"
            >
              <div class="post-header">
                <div class="post-circle" @click.stop="navigateToCircle(post.circle_id)">
                  {{ post.circle_name }}
                </div>
                <div class="post-time">{{ formatTime(post.create_time) }}</div>
              </div>
              <div class="post-content">
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-text">{{ post.content }}</p>
              </div>
              <!-- 图片展示 -->
              <div class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
                <div class="image-grid" :class="getImageGridClass(post.media_urls.length)">
                  <img 
                    v-for="(img, imgIndex) in post.media_urls.slice(0, 9)" 
                    :key="imgIndex" 
                    :src="img" 
                    alt="帖子图片"
                    class="post-image"
                    @click.stop="previewPostImages(post.media_urls, imgIndex)"
                  />
                  <div class="image-count" v-if="post.media_urls.length > 9">
                    +{{ post.media_urls.length - 9 }}
                  </div>
                </div>
              </div>
              <div class="post-footer">
                <div class="post-action">
                  <i class="el-icon-chat-dot-round"></i>
                  <span>{{ post.comment_count || 0 }}</span>
                </div>
                <div class="post-action">
                  <i class="el-icon-star-off"></i>
                  <span>{{ post.like_count || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="empty-state" v-else>
            <i class="el-icon-chat-dot-round"></i>
            <p>暂无动态</p>
          </div>
          
          <!-- 加载更多 -->
          <div class="load-more" v-if="postsHasMore && userPosts.length > 0">
            <el-button @click="loadMorePosts" :loading="postsLoading">
              {{ postsLoading ? '加载中...' : '加载更多' }}
            </el-button>
          </div>
        </div>
        
        <!-- 世界列表 -->
        <div class="worlds-content" v-show="currentTab === 2">
          <div class="worlds-grid" v-if="userWorlds.length > 0">
            <div 
              class="world-item" 
              v-for="world in userWorlds" 
              :key="world.world_id"
              @click="navigateToWorld(world.world_id)"
            >
              <img :src="world.picUrl" alt="世界封面" class="world-cover" />
              <div class="world-info">
                <h3 class="world-title">{{ world.name }}</h3>
              </div>
            </div>
          </div>
          <div class="empty-state" v-else>
            <i class="el-icon-place"></i>
            <p>暂无世界</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'UserProfile',
  layout: 'default',
  
  data() {
    return {
      uid: null,
      user: {},
      userGroups: [],
      myUserInfo: {},
      fans: 0,
      follows: 0,
      isFollowing: false,
      followLoading: false,
      
      // 标签页
      currentTab: 0,
      
      // 作品数据
      userWorks: [],
      
      // 动态数据
      userPosts: [],
      postsPage: 1,
      postsPageSize: 10,
      postsHasMore: true,
      postsLoading: false,
      
      // 世界数据
      userWorlds: [],
      
      // 用户组样式映射
      group2class: {
        "社区奠基人": "founder",
        "原木体验官": "copemate",
        "用户": 'nonTitle',
        "社区管理员": 'nonTitle',
        "系统消息": 'nonTitle'
      }
    }
  },
  
  computed: {
    isCurrentUser() {
      return this.myUserInfo.user_id && this.uid == this.myUserInfo.user_id
    }
  },
  
  async mounted() {
    this.uid = this.$route.params.id
    await this.loadUserInfo()
    await this.loadMyUserInfo()
    await this.loadUserStats()
    await this.loadUserWorks()
    await this.loadUserWorlds()
  },
  
  methods: {
    // 加载用户信息
    async loadUserInfo() {
      try {
        const response = await this.$api.users.getUserInfo(this.uid)
        if (response.code === 0) {
          this.user = response.data
          if (this.user.user_group) {
            this.userGroups = this.user.user_group.split(',')
          }
        } else {
          throw new Error(response.message || '获取用户信息失败')
        }
      } catch (error) {
        console.error('加载用户信息失败', error)
        this.$message.error('用户信息加载失败')
      }
    },
    
    // 加载当前登录用户信息
    async loadMyUserInfo() {
      try {
        this.myUserInfo = await this.$api.users.getUserProfile()
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token')
        }
      }
    },
    
    // 加载用户统计数据
    async loadUserStats() {
      try {
        // 加载粉丝数
        const fansResponse = await this.$api.users.getUserFans(this.uid)
        if (fansResponse.code === 0) {
          this.fans = fansResponse.data.length
        }
        
        // 加载关注数
        const followsResponse = await this.$api.users.getUserFollows(this.uid)
        if (followsResponse.code === 0) {
          this.follows = followsResponse.data.length
        }
        
        // 检查是否已关注
        if (this.myUserInfo.user_id && !this.isCurrentUser) {
          this.checkFollowStatus()
        }
      } catch (error) {
        console.error('加载用户统计数据失败', error)
      }
    },
    
    // 检查关注状态
    async checkFollowStatus() {
      try {
        const response = await this.$api.users.checkFollowStatus(this.uid)
        if (response.code === 0) {
          this.isFollowing = response.data.isFollowing
        }
      } catch (error) {
        console.error('检查关注状态失败', error)
      }
    },
    
    // 加载用户作品
    async loadUserWorks() {
      try {
        const response = await this.$api.users.getUserNovels(this.uid)
        if (response.code === 0) {
          this.userWorks = response.data || []
        } else {
          throw new Error(response.message || '获取作品失败')
        }
      } catch (error) {
        console.error('加载用户作品失败', error)
        this.$message.error('作品信息加载失败')
      }
    },
    
    // 加载用户世界
    async loadUserWorlds() {
      try {
        const response = await this.$api.users.getUserWorlds(this.uid)
        if (response.code === 0) {
          this.userWorlds = response.data || []
        } else {
          throw new Error(response.message || '获取世界设定失败')
        }
      } catch (error) {
        console.error('加载用户世界失败', error)
        this.$message.error('世界信息加载失败')
      }
    },
    
    // 加载用户动态
    async loadUserPosts() {
      if (this.postsLoading || !this.postsHasMore) return
      
      this.postsLoading = true
      try {
        const response = await this.$api.users.getUserPosts(this.uid, {
          page: this.postsPage,
          pageSize: this.postsPageSize
        })
        
        if (response.code === 0 && response.data && response.data.list) {
          const newPosts = response.data.list.map(post => {
            if (post.media_urls && typeof post.media_urls === 'string') {
              try {
                post.media_urls = JSON.parse(post.media_urls)
              } catch (e) {
                post.media_urls = []
              }
            }
            return post
          })
          
          if (this.postsPage === 1) {
            this.userPosts = newPosts
          } else {
            this.userPosts = [...this.userPosts, ...newPosts]
          }
          
          this.postsPage++
          this.postsHasMore = this.userPosts.length < response.data.total
        } else {
          throw new Error(response.message || '获取动态失败')
        }
      } catch (error) {
        console.error('加载用户动态失败', error)
        this.$message.error('加载用户动态失败')
      } finally {
        this.postsLoading = false
      }
    },
    
    // 加载更多动态
    loadMorePosts() {
      this.loadUserPosts()
    },
    
    // 切换标签页
    switchTab(index) {
      this.currentTab = index
      if (index === 1 && this.userPosts.length === 0) {
        this.loadUserPosts()
      }
    },
    
    // 切换关注状态
    async toggleFollow() {
      if (!this.myUserInfo.user_id) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      
      if (this.myUserInfo.user_id === this.uid) {
        this.$message.warning('不能关注自己')
        return
      }
      
      this.followLoading = true
      try {
        let response
        if (this.isFollowing) {
          response = await this.$api.users.unfollowUser(this.uid)
        } else {
          response = await this.$api.users.followUser(this.uid)
        }
        
        if (response.code === 0) {
          this.isFollowing = !this.isFollowing
          this.fans += this.isFollowing ? 1 : -1
          this.$message.success(this.isFollowing ? '关注成功' : '取消关注成功')
        } else {
          throw new Error(response.message || '操作失败')
        }
      } catch (error) {
        console.error('关注操作失败', error)
        this.$message.error('操作失败，请重试')
      } finally {
        this.followLoading = false
      }
    },
    
    // 发送私信
    sendPrivateMessage() {
      if (!this.myUserInfo.user_id) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      this.$router.push(`/community/chat?id=${this.uid}`)
    },
    
    // 编辑资料
    editProfile() {
      this.$router.push('/users/change_user_info')
    },
    
    // 更换封面
    changeCoverImage() {
      this.$router.push('/users/top_pic_upload?noneAnimation=1')
    },
    
    // 预览封面图片
    previewCoverImage() {
      if (this.user.top_pic_url) {
        this.$preview([this.user.top_pic_url])
      }
    },
    
    // 预览头像
    previewAvatar() {
      if (this.user.avatar_url) {
        this.$preview([this.user.avatar_url])
      }
    },
    
    // 预览帖子图片
    previewPostImages(images, index) {
      this.$preview(images, index)
    },
    
    // 导航到好友页面
    navigateToFriends(tab) {
      this.$router.push(`/community/friends?id=${this.uid}&tab=${tab}`)
    },
    
    // 导航到作品
    navigateToWork(novelId) {
      if (novelId > 0) {
        this.$router.push(`/novel/${novelId}`)
      }
    },
    
    // 导航到帖子
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`)
    },
    
    // 导航到圈子
    navigateToCircle(circleId) {
      if (!circleId || circleId === 0) {
        this.$message.warning('圈子不存在')
        return
      }
      this.$router.push(`/community/circle/${circleId}`)
    },
    
    // 导航到世界
    navigateToWorld(worldId) {
      this.$router.push(`/world/${worldId}`)
    },
    
    // 获取用户组样式
    getGroupClass(group) {
      return this.group2class[group] || 'nonTitle'
    },
    
    // 获取图片网格样式
    getImageGridClass(count) {
      if (count === 1) return 'grid-1'
      if (count === 2) return 'grid-2'
      if (count === 3) return 'grid-3'
      return 'grid-multi'
    },
    
    // 格式化时间
    formatTime(time) {
      const now = moment()
      const postTime = moment(time)
      const diff = now.diff(postTime, 'minutes')
      
      if (diff < 1) return '刚刚'
      if (diff < 60) return `${diff}分钟前`
      
      const hourDiff = now.diff(postTime, 'hours')
      if (hourDiff < 24) return `${hourDiff}小时前`
      
      const dayDiff = now.diff(postTime, 'days')
      if (dayDiff < 30) return `${dayDiff}天前`
      
      return postTime.format('YYYY-MM-DD')
    },
    
    // 获取token
    getToken() {
      const token = JSON.parse(localStorage.getItem('token') || '{}')
      return token.tk || null
    }
  }
}
</script>

<style lang="scss" scoped>
.user-profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
}

// 用户头部区域
.profile-header {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.cover-container {
  position: relative;
  height: 300px;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
  
  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 1;
    }
    
    i {
      font-size: 32px;
      margin-bottom: 8px;
    }
    
    span {
      font-size: 16px;
    }
  }
}

.user-info-section {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: -80px;
  position: relative;
  z-index: 2;
}

.user-basic-info {
  display: flex;
  align-items: flex-start;
  flex: 1;
}

.avatar-container {
  margin-right: 24px;
  
  .user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    border: 4px solid #fff;
    object-fit: cover;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.user-details {
  flex: 1;
  padding-top: 20px;
}

.user-name-section {
  margin-bottom: 16px;
  
  .user-name {
    font-size: 32px;
    font-weight: bold;
    color: #2c3e50;
    margin: 0 0 8px 0;
  }
  
  .user-id {
    background: rgba(0, 0, 0, 0.1);
    color: #666;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 14px;
    margin-right: 12px;
  }
}

.user-groups {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  
  .user-group {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    
    &.founder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }
    
    &.copemate {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: #fff;
    }
    
    &.nonTitle {
      display: none;
    }
  }
  
  .admin-badge {
    background: #55aaff;
    color: #fff;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    display: flex;
    align-items: center;
    
    .admin-icon {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
}

.user-motto {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.follow-stats {
  display: flex;
  gap: 32px;
  
  .stat-item {
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .stat-number {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .stat-label {
      display: block;
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-top: 20px;
}

// 内容标签页
.content-tabs {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #eee;
  
  .tab-item {
    flex: 1;
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
    
    &:hover {
      color: #947358;
      background: #f8f9fa;
    }
    
    &.active {
      color: #947358;
      border-bottom-color: #947358;
      background: #fff;
    }
  }
}

.tab-content {
  min-height: 400px;
  padding: 30px;
}

// 作品网格
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  
  .work-item {
    cursor: pointer;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
    }
    
    .work-cover {
      width: 100%;
      height: 280px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .work-info {
      padding: 12px 0;
      
      .work-title {
        font-size: 16px;
        font-weight: 500;
        color: #2c3e50;
        margin: 0;
        text-align: center;
      }
    }
  }
}

// 动态列表
.posts-list {
  .post-item {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #f0f1f3;
      transform: translateY(-2px);
    }
    
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .post-circle {
        background: #947358;
        color: #fff;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        
        &:hover {
          background: #826347;
        }
      }
      
      .post-time {
        color: #999;
        font-size: 14px;
      }
    }
    
    .post-content {
      margin-bottom: 16px;
      
      .post-title {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 8px 0;
      }
      
      .post-text {
        color: #666;
        line-height: 1.6;
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
    }
    
    .post-images {
      margin: 16px 0;
      
      .image-grid {
        display: grid;
        gap: 8px;
        
        &.grid-1 {
          grid-template-columns: 1fr;
          max-width: 400px;
          
          .post-image {
            height: 300px;
          }
        }
        
        &.grid-2 {
          grid-template-columns: repeat(2, 1fr);
          
          .post-image {
            height: 200px;
          }
        }
        
        &.grid-3,
        &.grid-multi {
          grid-template-columns: repeat(3, 1fr);
          
          .post-image {
            height: 150px;
          }
        }
        
        .post-image {
          width: 100%;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.3s ease;
          
          &:hover {
            transform: scale(1.02);
          }
        }
        
        .image-count {
          position: absolute;
          right: 8px;
          bottom: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
      }
    }
    
    .post-footer {
      display: flex;
      gap: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
      
      .post-action {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 14px;
        
        i {
          margin-right: 6px;
          font-size: 16px;
        }
      }
    }
  }
}

// 世界网格
.worlds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  
  .world-item {
    cursor: pointer;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
    }
    
    .world-cover {
      width: 100%;
      height: 280px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .world-info {
      padding: 12px 0;
      
      .world-title {
        font-size: 16px;
        font-weight: 500;
        color: #2c3e50;
        margin: 0;
        text-align: center;
      }
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  
  i {
    font-size: 64px;
    margin-bottom: 16px;
    display: block;
  }
  
  p {
    font-size: 16px;
    margin: 0;
  }
}

// 加载更多
.load-more {
  text-align: center;
  padding: 30px 0;
}

// 响应式设计
// 大屏幕优化 (1200px+)
@media (min-width: 1200px) {
  .user-profile-page {
    max-width: 1400px;
    padding: 30px;
  }
  
  .works-grid,
  .worlds-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  .cover-container {
    height: 350px;
  }
}

// 中等屏幕 (992px - 1199px)
@media (max-width: 1199px) and (min-width: 992px) {
  .user-profile-page {
    max-width: 100%;
    padding: 25px;
  }
  
  .works-grid,
  .worlds-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

// 平板屏幕 (768px - 991px)
@media (max-width: 991px) and (min-width: 768px) {
  .user-profile-page {
    padding: 20px;
  }
  
  .user-info-section {
    padding: 25px;
  }
  
  .user-name {
    font-size: 28px !important;
  }
  
  .user-avatar {
    width: 100px !important;
    height: 100px !important;
  }
  
  .works-grid,
  .worlds-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
  }
  
  .cover-container {
    height: 250px;
  }
}

// 手机屏幕 (最大 767px)
@media (max-width: 767px) {
  .user-profile-page {
    padding: 10px;
  }
  
  .user-info-section {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    margin-top: -60px;
  }
  
  .user-basic-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 16px;
    
    .user-avatar {
      width: 80px;
      height: 80px;
    }
  }
  
  .user-name {
    font-size: 24px !important;
  }
  
  .action-buttons {
    justify-content: center;
    padding-top: 0;
    flex-wrap: wrap;
  }
  
  .follow-stats {
    justify-content: center;
    gap: 20px;
  }
  
  .works-grid,
  .worlds-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .tab-header {
    .tab-item {
      padding: 16px 12px;
      font-size: 14px;
    }
  }
  
  .cover-container {
    height: 200px;
  }
  
  .post-item {
    padding: 16px;
    
    .post-title {
      font-size: 16px !important;
    }
  }
}

// 超小屏幕 (最大 480px)
@media (max-width: 480px) {
  .user-profile-page {
    padding: 8px;
  }
  
  .user-info-section {
    padding: 16px;
  }
  
  .works-grid,
  .worlds-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .tab-content {
    padding: 16px;
  }
  
  .action-buttons {
    .el-button {
      font-size: 12px;
      padding: 8px 12px;
    }
  }
}
</style>