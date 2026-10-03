<template>
  <div class="messages-page">
    <div class="page-header">
      <nuxt-link to="/me" class="back-link">
        <span class="back-icon">←</span> 返回个人中心
      </nuxt-link>
      <h1 class="page-title">我的消息</h1>
    </div>

    <div class="messages-card">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane name="private">
          <span slot="label">
            私信<em class="tab-badge" v-if="privateUnread > 0">{{ privateUnread > 99 ? '99+' : privateUnread }}</em>
          </span>
          <div class="tab-body" v-loading="privateLoading">
            <div class="empty-state" v-if="!privateLoading && conversations.length === 0">
              <img src="/nothing.png" alt="暂无消息" class="empty-image">
              <p>还没有人给你发过私信</p>
            </div>
            <div
              class="conversation-item"
              v-for="item in conversations"
              :key="item.user_id"
              @click="openChat(item)"
            >
              <img
                class="avatar"
                :src="item.avatar_url || '/default-avatar.png'"
                :alt="item.name"
                @error="$event.target.src = '/default-avatar.png'"
              >
              <div class="conversation-main">
                <div class="conversation-top">
                  <span class="name">{{ item.name }}</span>
                  <span class="time">{{ formatTime(item.last_message_time) }}</span>
                </div>
                <div class="conversation-bottom">
                  <span class="preview">{{ formatPreview(item.last_message_content) }}</span>
                  <span class="unread" v-if="item.unread_count > 0">{{ item.unread_count > 99 ? '99+' : item.unread_count }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="system">
          <span slot="label">
            系统消息<em class="tab-badge" v-if="systemUnread > 0">{{ systemUnread > 99 ? '99+' : systemUnread }}</em>
          </span>
          <div class="tab-body" v-loading="systemLoading">
            <div class="empty-state" v-if="!systemLoading && systemMessages.length === 0">
              <img src="/nothing.png" alt="暂无消息" class="empty-image">
              <p>暂无系统消息</p>
            </div>
            <div
              class="message-item"
              :class="{ unread: !item.is_read }"
              v-for="item in systemMessages"
              :key="item.message_id"
              @click="openSystemMessage(item)"
            >
              <img
                class="avatar"
                :src="item.avatar_url || '/default-avatar.png'"
                :alt="item.name"
                @error="$event.target.src = '/default-avatar.png'"
              >
              <div class="message-main">
                <div class="message-top">
                  <span class="name">{{ item.name }}</span>
                  <span class="time">{{ formatTime(item.time) }}</span>
                </div>
                <p class="message-content">{{ item.message_content }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { formatMessagePreview } from '~/utils/private-message.js'

export default {
  layout: 'default',
  data() {
    return {
      activeTab: 'private',
      conversations: [],
      privateLoading: false,
      privateLoaded: false,
      privateUnread: 0,
      systemMessages: [],
      systemLoading: false,
      systemLoaded: false,
      systemUnread: 0
    }
  },
  async mounted() {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录')
      this.$router.push('/login')
      return
    }

    const [privateCount, systemCount] = await Promise.all([
      this.$api.community.getUnreadMessageCount(),
      this.$api.users.getUnreadSystemMessageCount()
    ])
    this.privateUnread = privateCount.count
    this.systemUnread = systemCount.count

    this.loadConversations()
  },
  methods: {
    handleTabClick(tab) {
      if (tab.name === 'private') {
        this.loadConversations()
      } else {
        this.loadSystemMessages()
      }
    },
    async loadConversations() {
      if (this.privateLoaded || this.privateLoading) return
      this.privateLoading = true
      try {
        const response = await this.$api.community.getConversationList()
        this.conversations = Array.isArray(response.data) ? response.data : []
        this.privateLoaded = true
      } catch (error) {
        console.error('获取私信会话失败', error)
        this.$message.error('私信列表加载失败')
      } finally {
        this.privateLoading = false
      }
    },
    // 服务端读取系统消息后会将其标记为已读
    async loadSystemMessages() {
      if (this.systemLoaded || this.systemLoading) return
      this.systemLoading = true
      try {
        this.systemMessages = await this.$api.users.getHistoryMessages()
        this.systemLoaded = true
        this.systemUnread = 0
      } catch (error) {
        console.error('获取系统消息失败', error)
        this.$message.error('系统消息加载失败')
      } finally {
        this.systemLoading = false
      }
    },
    formatPreview(content) {
      return formatMessagePreview(content) || '开始和对方聊天吧'
    },
    openChat(conversation) {
      this.$router.push(`/community/chat?id=${conversation.user_id}`)
    },
    openSystemMessage(message) {
      const target = this.resolveTarget(message.router)
      if (!target) return
      if (target.mobile) {
        this.openMobilePage(target.path, message.name || '消息详情')
      } else {
        this.$router.push(target.path)
      }
    },
    // 系统消息里的 router 是移动端页面路径，能映射到网页端的跳转，其余走移动端
    resolveTarget(router) {
      if (!router) return null
      const novelMatch = router.match(/^readers\/book(?:Info|Comment)\?id=(\d+)/)
      if (novelMatch) return { path: `/novel/${novelMatch[1]}` }
      const postMatch = router.match(/^community\/postDetail\?id=(\d+)/)
      if (postMatch) return { path: `/community/post/${postMatch[1]}` }
      const userMatch = router.match(/^users\/personalPage\?id=(\d+)/)
      if (userMatch) return { path: `/users/${userMatch[1]}` }
      if (router === '/' || router === 'None') return null
      return { path: `/pages/${router.replace(/^\/?pages\//, '')}`, mobile: true }
    },
    // 移动端专属页面用浮窗内嵌打开
    openMobilePage(pagePath, title) {
      return this.$openMobileWindow(pagePath, { title })
    },
    formatTime(value) {
      if (!value) return ''
      const date = new Date(value)
      if (isNaN(date.getTime())) return ''
      const now = new Date()
      const pad = n => (n < 10 ? `0${n}` : `${n}`)
      const hm = `${pad(date.getHours())}:${pad(date.getMinutes())}`
      if (date.toDateString() === now.toDateString()) return hm
      if (date.getFullYear() === now.getFullYear()) {
        return `${date.getMonth() + 1}月${date.getDate()}日`
      }
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    }
  },
  head() {
    return {
      title: '我的消息 - 原木社区'
    }
  }
}
</script>

<style lang="scss" scoped>
.messages-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 16px;

  .back-link {
    font-size: 14px;
    color: #947358;

    .back-icon {
      margin-right: 4px;
    }
  }

  .page-title {
    font-size: 22px;
    color: #333;
    margin: 12px 0 0;
  }
}

.messages-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 0 20px 20px;
}

.tab-badge {
  font-style: normal;
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 8px;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  display: inline-block;
}

.tab-body {
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: #999;

  .empty-image {
    width: 120px;
    margin-bottom: 12px;
  }
}

.conversation-item,
.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background: #faf8f5;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background: #f5f5f5;
  }
}

.conversation-main,
.message-main {
  flex: 1;
  min-width: 0;
}

.conversation-top,
.message-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  .name {
    font-size: 15px;
    color: #333;
    font-weight: 500;
  }

  .time {
    font-size: 12px;
    color: #bbb;
    flex-shrink: 0;
    margin-left: 12px;
  }
}

.conversation-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;

  .preview {
    font-size: 13px;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .unread {
    background: #f56c6c;
    color: #fff;
    border-radius: 9px;
    padding: 0 6px;
    font-size: 12px;
    line-height: 18px;
    flex-shrink: 0;
    margin-left: 12px;
  }
}

.message-item.unread .message-content {
  color: #333;
  font-weight: 500;
}

.message-content {
  margin: 4px 0 0;
  font-size: 13px;
  color: #888;
  line-height: 1.5;
}
</style>
