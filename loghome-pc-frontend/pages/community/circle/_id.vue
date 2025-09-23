<template>
  <div class="circle-detail-container">
    <!-- 圈子头部信息 -->
    <div class="circle-header">
      <div class="circle-bg" :style="{ backgroundImage: `url(${circle.bg_url || circle.icon || '/default-circle.png'})` }"></div>
      <div class="header-overlay"></div>
      <div class="circle-info">
        <img class="circle-avatar" :src="circle.icon || '/default-circle.png'" :alt="circle.name" />
        <div class="circle-meta">
          <div class="circle-name">
            {{ circle.name }}
            <span class="official-tag" v-if="circle.is_official">官方</span>
          </div>
          <div class="circle-stats">
            <span>{{ circle.member_count }}成员</span>
            <span>{{ circle.post_count }}帖子</span>
          </div>
          <div class="circle-description" @click="showCircleInfo">{{ circle.description }}</div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button 
        :type="isJoined ? 'success' : 'primary'" 
        @click="toggleJoin"
        :loading="joinLoading"
      >
        {{ isJoined ? '已加入' : '加入圈子' }}
      </el-button>
      <el-button @click="showCircleInfo">圈子公告</el-button>
      <!-- 编辑按钮，仅圈主和管理员可见 -->
      <el-button v-if="isJoined && (userRole === 1 || userRole === 2)" @click="openEditCircle">圈子设置</el-button>
    </div>
    
    <!-- 圈子成员模块 -->
    <div class="circle-members">
      <div class="section-header">
        <h3 class="section-title">成员 ({{ circle.member_count || 0 }})</h3>
        <el-button type="text" @click="openCircleMembers">
          更多 <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
      <div class="members-list">
        <div class="member-item" v-for="(member, index) in members" :key="index" @click="navigateToUser(member.user_id)">
          <div class="member-avatar-wrapper">
            <img class="member-avatar" :src="member.avatar_url || '/default-avatar.jpg'" :alt="member.name" />
            <span class="member-role" v-if="member.role === 2">圈主</span>
            <span class="member-role admin" v-else-if="member.role === 1">管理员</span>
          </div>
          <span class="member-name">{{ member.name }}</span>
        </div>
      </div>
    </div>
    
    <!-- 帖子筛选和列表 -->
    <div class="posts-container">
      <!-- 帖子筛选 -->
      <div class="filter-bar">
        <el-tabs v-model="currentFilter" @tab-click="switchFilter">
          <el-tab-pane 
            v-for="(item, index) in filters" 
            :key="index"
            :label="item.name" 
            :name="item.value"
          ></el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 帖子列表 -->
      <div class="posts-list" v-loading="loadingPosts">
      <div class="post-card" v-for="(post, index) in posts" :key="index" @click="navigateToPost(post.post_id)">
        <div class="post-header">
          <div class="user-info" @click.stop="navigateToUser(post.user_id)">
            <img :src="post.author_avatar || '/default-avatar.jpg'" alt="用户头像" class="user-avatar">
            <div class="user-meta">
              <span class="user-name">{{ post.author_name }}</span>
              <span class="post-time">{{ formatTime(post.create_time) }}</span>
            </div>
          </div>
          <el-tag v-if="post.is_top" type="warning" size="small">置顶</el-tag>
        </div>
        <div class="post-content">
          <h4 class="post-title">{{ post.title }}</h4>
          <p class="post-text">{{ post.content }}</p>
        </div>
        <!-- 图片展示 -->
        <div class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
          <div :class="['image-grid', 'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)]">
            <img 
              v-for="(img, imgIndex) in post.media_urls.slice(0, 9)" 
              :key="imgIndex" 
              :src="img" 
              alt="帖子图片"
              class="post-image"
              @click.stop="previewImage(post.media_urls, imgIndex)"
            >
            <div class="image-count" v-if="post.media_urls.length > 9">+{{ post.media_urls.length - 9 }}</div>
          </div>
        </div>
        <div class="post-footer">
          <div class="action-btn">
            <i class="el-icon-chat-dot-round"></i>
            <span>{{ post.comment_count || 0 }}</span>
          </div>
          <div class="action-btn" @click.stop="likePost(post)" :class="{ liked: post.is_liked }">
            <i :class="post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off'" :style="{ color: post.is_liked ? '#EA7034' : '#666' }"></i>
            <span :class="{ liked: post.is_liked }">{{ post.like_count || 0 }}</span>
          </div>
          <div class="action-btn" @click.stop="sharePost(post)">
            <i class="el-icon-share"></i>
            <span>分享</span>
          </div>
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore && !loadingPosts">
        <el-button @click="loadMore" :loading="loadingMore">加载更多</el-button>
      </div>
      
      <!-- 空状态 -->
        <div class="empty-state" v-if="posts.length === 0 && !loadingPosts">
          <img src="/nothing.png" alt="暂无内容" class="empty-image" />
          <p class="empty-text">暂无帖子</p>
        </div>
      </div>
    </div>
    
    <!-- 悬浮按钮 -->
    <el-button class="float-btn" type="primary" circle @click="createPost">
      <i class="el-icon-plus"></i>
    </el-button>
    
    <!-- 圈子公告弹窗 -->
    <el-dialog title="圈子信息" :visible.sync="infoDialogVisible" width="600px">
      <div class="info-content">
        <div class="info-section">
          <h4 class="info-title">圈子简介</h4>
          <p class="info-text">{{ circle.description || '暂无圈子简介' }}</p>
        </div>
        <div class="info-section">
          <h4 class="info-title">圈子规则</h4>
          <p class="info-text">{{ circle.rules || '暂无圈子规则' }}</p>
        </div>
        <div class="info-section">
          <h4 class="info-title">圈子公告</h4>
          <p class="info-text">{{ circle.announcement || '暂无圈子公告' }}</p>
        </div>
        <div class="info-section">
          <h4 class="info-title">圈主</h4>
          <div class="member-item" @click="navigateToUser(circle.creator_id)">
            <img class="member-avatar" :src="circle.creator_avatar || '/default-avatar.jpg'" :alt="circle.creator_name" />
            <span class="member-name">{{ circle.creator_name }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CircleDetail',
  data() {
    return {
      circleId: null,
      circle: {},
      isJoined: false,
      userRole: 0, // 0-普通成员 1-管理员 2-圈主
      joinLoading: false,
      filters: [
        { name: '全部', value: 'all' },
        { name: '最新', value: 'new' },
        { name: '热门', value: 'hot' }
      ],
      currentFilter: 'all',
      posts: [],
      members: [], // 圈子成员列表
      page: 1,
      pageSize: 10,
      loadingPosts: false,
      loadingMore: false,
      hasMore: true,
      isLoggedIn: false,
      infoDialogVisible: false
    }
  },
  async asyncData({ params, $api, error }) {
    try {
      const circleId = params.id
      if (!circleId) {
        throw new Error('圈子ID不能为空')
      }
      return { circleId }
    } catch (err) {
      error({ statusCode: 404, message: '圈子不存在' })
    }
  },
  async mounted() {
    this.checkLoginStatus()
    await this.loadCircleInfo()
    await this.loadMembers()
    await this.loadPosts()
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = token && JSON.parse(token).tk
    },
    
    async loadCircleInfo() {
      try {
        const res = await this.$api.community.getCircleDetail({ circle_id: this.circleId })
        if (res) {
          this.circle = res
          // 如果已登录，检查是否已加入圈子
          if (this.isLoggedIn) {
            await this.checkMemberStatus()
          }
        }
      } catch (error) {
        console.error('加载圈子信息失败', error)
        this.$message.error('加载圈子信息失败')
      }
    },
    
    async checkMemberStatus() {
      try {
        const circles = await this.$api.community.getMyCircles()
        if (circles && circles.length > 0) {
          const myCircle = circles.find(c => c.circle_id === parseInt(this.circleId))
          this.isJoined = !!myCircle
          if (myCircle) {
            this.userRole = myCircle.role
          }
        }
      } catch (error) {
        console.error('检查成员状态失败', error)
      }
    },
    
    async loadMembers() {
      try {
        const params = {
          pageSize: 10,
          page: 1
        }
        const res = await this.$api.community.getCircleMembers({ circle_id: this.circleId, ...params })
        if (res && res.list) {
          this.members = res.list
        }
      } catch (error) {
        console.error('加载圈子成员失败', error)
      }
    },
    
    async loadPosts() {
      if (!this.hasMore || this.loadingPosts) return

      console.log(123);
      
      this.loadingPosts = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          circle_id: this.circleId
        }
        
        // 根据筛选条件设置参数
        if (this.currentFilter === 'new') {
          params.sort = 'new'
        } else if (this.currentFilter === 'hot') {
          params.sort = 'hot'
        }
        
        const res = await this.$api.community.getPostsList(params)
        
        if (res && res.list) {
          // 处理帖子数据
          const newPosts = res.list.map(post => {
            // 初始化点赞状态
            post.is_liked = false
            post.is_liked_checked = false
            
            return post
          })
          
          this.posts = this.page === 1 ? newPosts : [...this.posts, ...newPosts]
          this.page++
          this.hasMore = this.posts.length < res.total
          
          // 获取点赞状态
          if (this.isLoggedIn) {
            setTimeout(() => {
              this.getPostsLikeStatus()
            }, 100)
          }
        }
      } catch (error) {
        console.error('加载帖子失败', error)
        this.$message.error('加载帖子失败')
      } finally {
        this.loadingPosts = false
      }
    },
    
    switchFilter(tab) {
      this.currentFilter = tab.name
      this.page = 1
      this.posts = []
      this.hasMore = true
      this.loadPosts()
      this.$forceUpdate();
    },
    
    loadMore() {
      if (this.hasMore && !this.loadingMore) {
        this.loadingMore = true
        this.loadPosts().finally(() => {
          this.loadingMore = false
        })
      }
    },
    
    async toggleJoin() {
      if (!this.isLoggedIn) {
        this.$router.push('/users/login')
        return
      }
      
      this.joinLoading = true
      try {
        if (this.isJoined) {
          // 退出圈子
          await this.$api.community.quitCircle({ circle_id: this.circleId })
          this.isJoined = false
          this.circle.member_count--
          this.$message.success('已退出圈子')
        } else {
          // 检查圈子是否需要验证
          if (this.circle.need_verification) {
            await this.showJoinVerificationDialog()
          } else {
            // 直接加入圈子
            await this.joinCircle()
          }
        }
      } catch (error) {
        console.error('操作失败', error)
        this.$message.error(error.message || '操作失败，请重试')
      } finally {
        this.joinLoading = false
      }
    },
    
    async showJoinVerificationDialog() {
      try {
        const res = await this.$api.community.getVerificationQuestions({ circle_id: this.circleId })
        let verificationPrompt = '请输入验证信息'
        if (res && res.verification_questions) {
          verificationPrompt = res.verification_questions
        }
        
        this.$prompt(verificationPrompt, '入圈验证', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入...'
        }).then(({ value }) => {
          this.joinCircle(value)
        }).catch(() => {
          // 用户取消
        })
      } catch (error) {
        console.error('获取验证问题失败', error)
        this.$prompt('入圈验证', '请输入验证信息', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入...'
        }).then(({ value }) => {
          this.joinCircle(value)
        }).catch(() => {
          // 用户取消
        })
      }
    },
    
    async joinCircle(verification_info = null) {
      try {
        const data = {
          circle_id: this.circleId
        }
        
        if (verification_info) {
          data.verification_info = verification_info
        }
        
        await this.$api.community.joinCircle(data)
        
        if (this.circle.need_verification) {
          this.$message.info('申请已提交，等待审核')
        } else {
          this.isJoined = true
          this.circle.member_count++
          this.$message.success('已加入圈子')
        }
      } catch (error) {
        console.error('加入圈子失败', error)
        throw error
      }
    },
    
    showCircleInfo() {
      this.infoDialogVisible = true
    },
    
    async likePost(post) {
      if (!this.isLoggedIn) {
        this.$router.push('/users/login')
        return
      }
      
      try {
        const res = await this.$api.community.likeTarget({
          target_id: post.post_id,
          target_type: 1
        })
        
        if (res && res.liked !== undefined) {
          post.is_liked = res.liked
          post.like_count += post.is_liked ? 1 : -1
        } else {
          post.is_liked = !post.is_liked
          post.like_count += post.is_liked ? 1 : -1
        }
      } catch (error) {
        console.error('点赞失败', error)
        this.$message.error('操作失败')
      }
    },
    
    sharePost(post) {
      this.createShareCode(post)
    },
    
    async createShareCode(post) {
      try {
        const shareMessage = `来自原木社区「${this.circle.name}」圈子的分享：${post.title}\n${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}\n点击链接查看详情：${window.location.origin}/community/post/${post.post_id}`
        
        const res = await this.$api.community.createShareCode({
          post_id: post.post_id,
          share_message: shareMessage,
          expires_hours: 24 * 30
        })
        
        if (res && res.share_code) {
          this.$message.success('分享口令已生成')
          // 这里可以添加复制到剪贴板的功能
        }
      } catch (error) {
        console.error('创建分享口令失败', error)
        this.$message.error('分享失败')
      }
    },
    
    async getPostsLikeStatus() {
      try {
        const postIds = this.posts.filter(p => !p.is_liked_checked).map(p => p.post_id)
        if (postIds.length === 0) return
        
        const res = await this.$api.community.getLikeStatus({
          target_ids: postIds.join(','),
          target_type: 1
        })
        
        if (res && Array.isArray(res)) {
          res.forEach(item => {
            const post = this.posts.find(p => p.post_id === item.target_id)
            if (post) {
              post.is_liked = item.is_liked
              post.is_liked_checked = true
            }
          })
        }
      } catch (error) {
        console.error('获取点赞状态失败', error)
      }
    },
    
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
    
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`)
    },
    
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`)
    },
    
    createPost() {
      this.$router.push({ path: '/community/post/edit', query: { circle_id: this.circleId } })
    },
    
    previewImage(images, index) {
      // 这里可以实现图片预览功能
      console.log('预览图片', images, index)
    },

    // 打开圈子编辑窗口
    async openEditCircle() {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          let token = (await this.$api.users.generateCrossSiteToken()).crossSiteToken;
          
          this.$windowManager.createWindow({
            title: '编辑圈子',
            url: `${process.env.mobileUrl}/#/pages/users/external_login?token=${
                  token}&redirectTo=${encodeURIComponent(`/pages/community/editCircle?id=${this.circleId}&hideback=true`)}`,
            width: 500,
            height: Math.min(800, window.screen.height - 200)
          });
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        console.error('打编辑圈子窗口失败', error);
        this.$message.error('打开编辑圈子失败，请稍后重试');
      }
    },

    async openCircleMembers() {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          let token = (await this.$api.users.generateCrossSiteToken()).crossSiteToken;
          
          this.$windowManager.createWindow({
            title: '圈子成员',
            url: `${process.env.mobileUrl}/#/pages/users/external_login?token=${
                  token}&redirectTo=${encodeURIComponent(`/pages/community/circleMembers?id=${this.circleId}&hideback=true`)}`,
            width: 500,
            height: Math.min(800, window.screen.height - 200)
          });
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        console.error('打开圈子成员失败', error);
        this.$message.error('打开圈子成员失败，请稍后重试');
      }
    },
  }
}
</script>

<style scoped>
.circle-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.circle-header {
  position: relative;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.circle-header:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.circle-bg {
  height: 240px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(0.5px);
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%);
}

.circle-info {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  align-items: flex-end;
  color: white;
}

.circle-avatar {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  border: 4px solid rgba(255, 255, 255, 0.9);
  margin-right: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.circle-avatar:hover {
  transform: scale(1.05);
}

.circle-meta {
  flex: 1;
}

.circle-name {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
}

.official-tag {
  background: linear-gradient(135deg, #FB7D46, #fa6c2e);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 12px;
  box-shadow: 0 2px 8px rgba(251, 125, 70, 0.3);
}

.circle-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}

.circle-stats span {
  margin-right: 15px;
  font-size: 14px;
  opacity: 0.9;
}

.circle-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  cursor: pointer;
  transition: color 0.3s ease;
  max-width: 600px;
}

.circle-description:hover {
  color: rgba(255, 255, 255, 1);
}

.action-bar {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.action-bar:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.action-bar .el-button {
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.action-bar .el-button--primary {
  background: #947358;
  border-color: #947358;
  color: white;
  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.3);
}

.action-bar .el-button--primary:hover {
  background: #704C35;
  border-color: #704C35;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.4);
}

.action-bar .el-button--success {
  background: #947358;
  border-color: #947358;
  color: white;
  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.3);
}

.action-bar .el-button--success:hover {
  background: #704C35;
  border-color: #704C35;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.4);
}

.action-bar .el-button--default {
  background: #fff;
  color: #947358;
  border: 1px solid #947358;
  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.1);
}

.action-bar .el-button--default:hover {
  background: #947358;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.3);
}



.circle-members {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.circle-members:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
}

.section-header .el-button--text {
  background: linear-gradient(135deg, #947358, #704C35);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);
}

.section-header .el-button--text:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(148, 115, 88, 0.4);
  background: linear-gradient(135deg, #704C35, #5a3a28);
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #947358, #704C35);
  border-radius: 2px;
  margin-right: 12px;
}

.members-list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 16px 0;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.members-list::-webkit-scrollbar {
  height: 6px;
}

.members-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.members-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 12px;
  border-radius: 12px;
}

.member-item:hover {
  transform: translateY(-4px);
  background: rgba(148, 115, 88, 0.05);
  box-shadow: 0 4px 16px rgba(148, 115, 88, 0.15);
}

.member-avatar-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.member-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.member-item:hover .member-avatar {
  transform: scale(1.1);
}

.member-role {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #947358, #704C35);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);
}

.member-role.admin {
  background: linear-gradient(135deg, #947358, #a8926f);
  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);
}

.member-name {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
  transition: color 0.3s ease;
}

.posts-container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
  overflow: hidden;
}

.posts-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.filter-bar {
  padding: 20px 24px 0;
  border-bottom: 1px solid #f0f2f5;
}

.filter-bar .el-tabs__header {
  margin: 0;
}

.filter-bar .el-tabs__nav-wrap::after {
  background: #f0f2f5;
}

.filter-bar .el-tabs__active-bar {
  background: #947358;
}

.filter-bar .el-tabs__item {
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.filter-bar .el-tabs__item.is-active {
  color: #947358;
}

.posts-list {
  padding: 24px;
}

.post-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  margin-bottom: 20px;
}

.post-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 12px;
  margin: -8px;
}

.user-info:hover {
  background: rgba(148, 115, 88, 0.05);
  transform: translateX(4px);
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-info:hover .user-avatar {
  transform: scale(1.05);
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  font-size: 15px;
}

.post-time {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.post-content {
  margin-bottom: 20px;
}

.post-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #333;
  line-height: 1.4;
  letter-spacing: 0.3px;
}

.post-text {
  color: #6c757d;
  line-height: 1.6;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3.2em;
  margin: 0;
}

.post-images {
  margin: 16px 0;
}

.image-grid {
  display: grid;
  gap: 8px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.grid-1 {
  grid-template-columns: 1fr;
  max-width: 300px;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 400px;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
  max-width: 450px;
}

.grid-multi {
  grid-template-columns: repeat(3, 1fr);
  max-width: 450px;
}

.post-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.post-image:hover {
  transform: scale(1.05);
}

.image-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.post-image:hover {
  transform: scale(1.05);
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  color: #947358;
  background: rgba(148, 115, 88, 0.1);
}

.action-btn.liked {
  color: #EA7034;
}

.action-btn.liked:hover {
  background: rgba(234, 112, 52, 0.1);
}

.action-btn .liked {
  color: #EA7034;
}

.float-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 64px;
  height: 64px;
  z-index: 1000;
  background: linear-gradient(135deg, #947358, #704C35);
  border: none;
  box-shadow: 0 8px 24px rgba(148, 115, 88, 0.4);
  transition: all 0.3s ease;
  font-size: 20px;
}

.float-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(148, 115, 88, 0.5);
  background: linear-gradient(135deg, #704C35, #5a3a28);
}

.float-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.load-more {
  text-align: center;
  padding: 24px;
}

.load-more .el-button {
  background: linear-gradient(135deg, #947358, #704C35);
  border: none;
  color: white;
  padding: 12px 32px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.3);
}

.load-more .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.4);
  background: linear-gradient(135deg, #704C35, #5a3a28);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-image {
  width: 120px;
  height: 120px;
  opacity: 0.5;
  margin-bottom: 20px;
}

.empty-text {
  color: #888;
  font-size: 16px;
}

.info-content {
  max-height: 500px;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 20px;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
}

.info-text {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .circle-detail-container {
    padding: 10px;
  }
  
  .circle-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .circle-avatar {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .members-list {
    justify-content: flex-start;
  }
  
  .float-btn {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
}
</style>