<template>
  <div class="chat-page">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="back-button" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="chat-user-info">
        <img :src="targetUser.avatar_url || '/default-avatar.png'" alt="头像" class="user-avatar" />
        <div class="user-details">
          <h3 class="username">{{ targetUser.nickname || targetUser.username }}</h3>
          <span class="online-status" :class="{ online: targetUser.is_online }">{{ targetUser.is_online ? '在线' : '离线' }}</span>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div class="messages-list">
        <div 
          v-for="message in messages" 
          :key="message.message_id"
          class="message-item"
          :class="{ 'own-message': message.from_id === myUserId }"
        >
          <div class="message-avatar">
            <img 
              :src="message.from_id === myUserId ? myUserInfo.avatar_url : targetUser.avatar_url" 
              alt="头像" 
            />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty-messages">
        <i class="el-icon-chat-dot-round"></i>
        <p>还没有消息，开始聊天吧！</p>
      </div>
    </div>

    <!-- 消息输入框 -->
    <div class="message-input-container">
      <div class="input-wrapper">
        <el-input
          v-model="newMessage"
          type="textarea"
          :rows="2"
          placeholder="输入消息..."
          @keydown.enter.prevent="sendMessage"
          @keydown.ctrl.enter="addNewLine"
          maxlength="500"
          show-word-limit
        ></el-input>
        <div class="input-actions">
          <el-button 
            type="primary" 
            @click="sendMessage"
            :loading="sending"
            :disabled="!newMessage.trim()"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ChatPage',
  data() {
    return {
      targetUserId: null,
      targetUser: {},
      messages: [],
      newMessage: '',
      sending: false,
      loading: false,
      myUserId: null,
      myUserInfo: {},
      page: 1,
      hasMore: true
    }
  },
  async mounted() {
    // 获取目标用户ID
    this.targetUserId = this.$route.query.id
    if (!this.targetUserId) {
      this.$message.error('缺少用户ID参数')
      this.goBack()
      return
    }

    // 获取当前用户信息
    await this.getCurrentUserInfo()
    
    // 获取目标用户信息
    await this.getTargetUserInfo()
    
    // 加载聊天记录
    await this.loadMessages()
    
    // 滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  methods: {
    // 获取当前用户信息
    async getCurrentUserInfo() {
      try {
        const userInfo = localStorage.getItem('LogHomeUserInfo')
        if (userInfo) {
          this.myUserInfo = JSON.parse(userInfo)
          this.myUserId = this.myUserInfo.user_id
        } else {
          this.$message.error('请先登录')
          this.$router.push('/login')
        }
      } catch (error) {
        console.error('获取用户信息失败', error)
        this.$message.error('获取用户信息失败')
      }
    },

    // 获取目标用户信息
    async getTargetUserInfo() {
      try {
        const response = await this.$api.users.getUserInfo(this.targetUserId)
        if (response.code === 0) {
          this.targetUser = response.data
        } else {
          throw new Error(response.message || '获取用户信息失败')
        }
      } catch (error) {
        console.error('获取目标用户信息失败', error)
        this.$message.error('获取用户信息失败')
      }
    },

    // 加载聊天记录
    async loadMessages() {
      if (this.loading || !this.hasMore) return
      
      this.loading = true
      try {
        const response = await this.$api.community.getMessagesList({
          target_id: this.targetUserId,
          page: this.page,
          limit: 20
        })
        
        if (response.code === 0) {
          const newMessages = response.data.list || []
          if (this.page === 1) {
            this.messages = newMessages
          } else {
            this.messages = [...newMessages, ...this.messages]
          }
          
          this.hasMore = newMessages.length === 20
          this.page++
        } else {
          throw new Error(response.message || '加载消息失败')
        }
      } catch (error) {
        console.error('加载消息失败', error)
        this.$message.error('加载消息失败')
      } finally {
        this.loading = false
      }
    },

    // 发送消息
    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return
      
      const messageContent = this.newMessage.trim()
      this.sending = true
      
      try {
        const response = await this.$api.community.sendMessage({
          to_id: this.targetUserId,
          content: messageContent,
          type: 'text'
        })
        
        if (response.code === 0) {
          // 添加消息到列表
          const newMessage = {
            message_id: Date.now(), // 临时ID
            from_id: this.myUserId,
            to_id: this.targetUserId,
            content: messageContent,
            created_at: new Date().toISOString(),
            is_read: 0
          }
          
          this.messages.push(newMessage)
          this.newMessage = ''
          
          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom()
          })
          
        } else {
          throw new Error(response.message || '发送失败')
        }
      } catch (error) {
        console.error('发送消息失败', error)
        this.$message.error('发送失败，请重试')
      } finally {
        this.sending = false
      }
    },

    // 添加换行
    addNewLine() {
      this.newMessage += '\n'
    },

    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    // 格式化时间
    formatTime(time) {
      return moment(time).format('MM-DD HH:mm')
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.chat-header {
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .back-button {
    margin-right: 16px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f0f0f0;
    }
    
    i {
      font-size: 20px;
      color: #666;
    }
  }
  
  .chat-user-info {
    display: flex;
    align-items: center;
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }
    
    .user-details {
      .username {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
      
      .online-status {
        font-size: 12px;
        color: #999;
        
        &.online {
          color: #67c23a;
        }
      }
    }
  }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .message-item {
    display: flex;
    align-items: flex-start;
    
    &.own-message {
      flex-direction: row-reverse;
      
      .message-content {
        align-items: flex-end;
        
        .message-bubble {
          background-color: #409eff;
          color: white;
        }
      }
    }
    
    .message-avatar {
      margin: 0 12px;
      
      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    
    .message-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 60%;
      
      .message-bubble {
        background-color: white;
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        .message-text {
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .message-time {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
          text-align: right;
        }
      }
    }
    
    &:not(.own-message) .message-content .message-bubble .message-time {
      color: #999;
    }
  }
  
  .empty-messages {
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
}

.message-input-container {
  background: white;
  border-top: 1px solid #eee;
  padding: 16px 20px;
  
  .input-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    
    .el-textarea {
      flex: 1;
    }
    
    .input-actions {
      display: flex;
      align-items: center;
    }
  }
}

// 响应式设计
// 大屏幕优化 (1200px+)
@media (min-width: 1200px) {
  .chat-page {
    max-width: 1200px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  .messages-container {
    padding: 30px 40px;
  }
  
  .message-item {
    .message-content {
      max-width: 50%;
    }
  }
  
  .message-input-container {
    padding: 20px 40px;
  }
}

// 中等屏幕 (992px - 1199px)
@media (max-width: 1199px) and (min-width: 992px) {
  .messages-container {
    padding: 25px 30px;
  }
  
  .message-item {
    .message-content {
      max-width: 55%;
    }
  }
  
  .message-input-container {
    padding: 18px 30px;
  }
}

// 平板屏幕 (768px - 991px)
@media (max-width: 991px) and (min-width: 768px) {
  .messages-container {
    padding: 20px 25px;
  }
  
  .message-item {
    .message-content {
      max-width: 65%;
    }
  }
  
  .message-input-container {
    padding: 16px 25px;
  }
  
  .chat-header {
    padding: 14px 20px;
  }
}

// 手机屏幕 (最大 767px)
@media (max-width: 767px) {
  .chat-page {
    height: 100vh;
  }
  
  .messages-container {
    padding: 16px;
  }
  
  .message-item {
    .message-content {
      max-width: 80%;
    }
    
    .message-avatar {
      margin: 0 8px;
      
      img {
        width: 32px;
        height: 32px;
      }
    }
  }
  
  .message-input-container {
    padding: 12px 16px;
  }
  
  .chat-header {
    padding: 12px 16px;
    
    .chat-user-info {
      .user-avatar {
        width: 36px;
        height: 36px;
      }
      
      .user-details {
        .username {
          font-size: 15px;
        }
      }
    }
  }
}

// 超小屏幕 (最大 480px)
@media (max-width: 480px) {
  .message-item {
    .message-content {
      max-width: 85%;
    }
    
    .message-bubble {
      padding: 10px 12px !important;
      
      .message-text {
        font-size: 13px !important;
      }
    }
  }
  
  .message-input-container {
    padding: 10px 12px;
    
    .input-wrapper {
      gap: 8px;
    }
  }
  
  .chat-header {
    padding: 10px 12px;
  }
}
</style>