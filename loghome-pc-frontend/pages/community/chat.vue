<template>
  <Workspace :title="$t('私信对话')" compact active="/me/messages">
    <div class="chat-page">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="chat-user-info">
          <img
            :src="targetUser.avatar_url || '/default-avatar.png'"
            :alt="$t('头像')"
            class="user-avatar"
          />
          <div class="user-details">
            <h3 class="username">{{ targetUser.name }}</h3>
            <span class="user-id">ID: {{ targetUser.user_id }}</span>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="messages-container" ref="messagesContainer">
        <div class="messages-list">
          <div
            v-if="hasMore && messages.length"
            class="load-more"
            @click="loadOlderMessages"
          >
            <span v-if="!loading">{{ $t("加载更早的消息") }}</span>
            <span v-else>{{ $t("加载中...") }}</span>
          </div>
          <div
            v-for="message in displayMessages"
            :key="message.id"
            class="message-item"
            :class="{ 'own-message': message.sender_id === myUserId }"
          >
            <div class="message-avatar">
              <img
                :src="
                  message.sender_id === myUserId
                    ? myUserInfo.avatar_url
                    : targetUser.avatar_url
                "
                :alt="$t('头像')"
              />
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <img
                  v-if="message.displayType === 'image'"
                  :src="message.imageUrl"
                  :alt="$t('图片消息')"
                  class="message-image"
                  @click="previewImage(message.imageUrl)"
                />
                <div
                  v-else-if="message.displayType === 'novel_share'"
                  class="shared-book-card"
                  @click="openSharedNovel(message.novel)"
                >
                  <img
                    class="shared-book-cover"
                    :src="message.novel.picUrl || '/default-book-cover.png'"
                    :alt="message.novel.name"
                    @error="$event.target.src = '/default-book-cover.png'"
                  />
                  <div class="shared-book-info">
                    <span class="shared-book-tag">{{ $t("分享了作品") }}</span>
                    <span class="shared-book-title">{{ message.novel.name }}</span>
                    <span class="shared-book-author">{{
                      message.novel.author_name
                    }}</span>
                  </div>
                </div>
                <div v-else class="message-text">{{ message.displayText }}</div>
                <div class="message-time">
                  {{ formatTime(message.sent_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="empty-messages">
          <i class="el-icon-chat-dot-round"></i>
          <p>{{ $t("还没有消息，开始聊天吧！") }}</p>
        </div>
      </div>

      <!-- 消息输入框 -->
      <div class="message-input-container">
        <div class="input-wrapper">
          <el-input
            v-model="newMessage"
            type="textarea"
            :rows="2"
            :placeholder="$t('输入消息...')"
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
              {{ $t("发送") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </Workspace>
</template>

<script>
import Workspace from "~/components/social/Workspace.vue";
import moment from "moment";
import { readingToken } from "~/plugins/api/reading";
import { normalizePrivateMessage } from "~/utils/private-message.js";
import { localizedFetch as fetch } from "~/utils/api-fetch";

export default {
  components: { Workspace },
  name: "ChatPage",
  data() {
    return {
      accountToken: null,
      disposed: false,
      targetUserId: null,
      targetUser: {},
      messages: [],
      newMessage: "",
      sending: false,
      loading: false,
      myUserId: null,
      myUserInfo: {},
      loading: false,
      hasMore: true,
      oldestId: null,
      newestId: null,
      pollTimer: null,
    };
  },
  computed: {
    // 图片、作品分享等结构化私信需要解析后才能渲染
    displayMessages() {
      return this.messages.map(normalizePrivateMessage);
    },
  },
  async mounted() {
    this.accountToken = readingToken();
    if (!this.accountToken) {
      this.login();
      return;
    }
    window.addEventListener("storage", this.checkAccount);
    window.addEventListener("focus", this.checkAccount);
    window.addEventListener("auth-state-changed", this.checkAccount);
    // 获取目标用户ID
    this.targetUserId = this.$route.query.id;
    if (!/^[1-9]\d*$/.test(this.targetUserId || "")) {
      this.$message.error(this.$t("缺少用户ID参数"));
      this.goBack();
      return;
    }

    // 获取当前用户信息
    await this.getCurrentUserInfo();
    if (!this.myUserId || !this.currentAccount()) return;

    // 获取目标用户信息
    await this.getTargetUserInfo();

    // 加载聊天记录
    await this.loadMessages();

    // 滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom();
    });

    if (!this.currentAccount()) return;
    // 轮询新消息，避免只有刷新才能看到对方回复
    this.pollTimer = setInterval(this.pollNewMessages, 10000);
  },
  beforeRouteLeave(to, from, next) {
    if (this.sending) {
      this.$message.info(this.$t("消息正在发送，请稍候"));
      next(false);
      return;
    }
    if (!this.newMessage.trim() || !this.currentAccount()) {
      next();
      return;
    }
    this.$confirm(this.$t("尚有未发送的私信，离开后将丢失内容。"), this.$t("离开聊天"), {
      confirmButtonText: this.$t("离开"),
      cancelButtonText: this.$t("继续编辑"),
    })
      .then(() => next())
      .catch(() => next(false));
  },
  beforeDestroy() {
    this.disposed = true;
    window.removeEventListener("storage", this.checkAccount);
    window.removeEventListener("focus", this.checkAccount);
    window.removeEventListener("auth-state-changed", this.checkAccount);
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
  methods: {
    login() {
      this.$router.replace({
        path: "/login",
        query: { redirect: this.$route.fullPath },
      });
    },
    currentAccount() {
      return (
        !this.disposed && !!this.accountToken && readingToken() === this.accountToken
      );
    },
    checkAccount() {
      if (this.currentAccount() || this.disposed) return;
      this.messages = [];
      this.newMessage = "";
      this.myUserId = null;
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
      this.login();
    },

    getToken() {
      return readingToken();
    },

    // 获取当前用户信息
    async getCurrentUserInfo() {
      try {
        const userInfo = await this.$api.users.getUserProfile();
        if (!this.currentAccount()) return;
        this.myUserInfo = userInfo;
        this.myUserId = Number(userInfo.user_id);
        if (!this.myUserId) this.login();
      } catch (error) {
        console.error("获取用户信息失败", error);
        this.$message.error(this.$t("获取用户信息失败"));
      }
    },

    // 获取目标用户信息
    async getTargetUserInfo() {
      try {
        const response = await this.$api.users.getUserInfo(this.targetUserId);
        if (!this.currentAccount()) return;
        if (response.code === 0) {
          this.targetUser = response.data;
        } else {
          throw new Error(response.message || "获取用户信息失败");
        }
      } catch (error) {
        console.error("获取目标用户信息失败", error);
        this.$message.error(this.$t("获取用户信息失败"));
      }
    },

    // 加载聊天记录（首屏）
    async loadMessages() {
      if (this.loading || !this.currentAccount()) return;

      this.loading = true;
      try {
        const response = await this.$api.community.getMessageList(this.targetUserId, 20);

        if (!this.currentAccount()) return;
        if (response.code === 0) {
          const list = Array.isArray(response.data) ? response.data : [];
          this.messages = list;
          this.hasMore = list.length === 20;
          if (list.length) {
            this.oldestId = list[0].id;
            this.newestId = list[list.length - 1].id;
          }
          this.markReceivedAsRead(list);
        } else {
          throw new Error(response.message || "加载消息失败");
        }
      } catch (error) {
        console.error("加载消息失败", error);
        this.$message.error(this.$t("加载消息失败"));
      } finally {
        this.loading = false;
      }
    },

    // 向上翻页：加载更早的消息
    async loadOlderMessages() {
      if (this.loading || !this.hasMore || !this.oldestId || !this.currentAccount())
        return;

      this.loading = true;
      try {
        const response = await this.$api.community.getMessageList(
          this.targetUserId,
          20,
          this.oldestId
        );
        if (!this.currentAccount()) return;
        if (response.code === 0) {
          const list = Array.isArray(response.data) ? response.data : [];
          // 记录滚动位置，避免插入历史后视口跳动
          const container = this.$refs.messagesContainer;
          const previousHeight = container ? container.scrollHeight : 0;

          this.messages = [...list, ...this.messages];
          this.hasMore = list.length === 20;
          if (list.length) {
            this.oldestId = list[0].id;
          }

          this.$nextTick(() => {
            if (container) {
              container.scrollTop = container.scrollHeight - previousHeight;
            }
          });
        }
      } catch (error) {
        console.error("加载更早消息失败", error);
        this.$message.error(this.$t("加载更早消息失败"));
      } finally {
        this.loading = false;
      }
    },

    // 拉取对方新发来的消息
    async pollNewMessages() {
      if (
        this.sending ||
        !this.targetUserId ||
        this.newestId === null ||
        !this.currentAccount()
      )
        return;
      try {
        const token = this.getToken();
        if (!token) return;

        const response = await fetch(
          `${process.env.baseUrl}/community/new_messages?friend_id=${this.targetUserId}&since_id=${this.newestId}`,
          { headers: { Authorization: token } }
        );
        if (!response.ok) throw new Error("读取消息失败");
        const list = await response.json();
        if (!this.currentAccount()) return;
        if (Array.isArray(list) && list.length) {
          this.messages = [...this.messages, ...list];
          this.newestId = list[list.length - 1].id;
          this.markReceivedAsRead(list);
          this.$nextTick(this.scrollToBottom);
        }
      } catch (error) {
        console.error("获取新消息失败", error);
      }
    },

    // 把对方发来的未读消息标记为已读
    markReceivedAsRead(list) {
      if (!this.currentAccount()) return;
      const unread = list.filter(
        (item) => Number(item.receiver_id) === this.myUserId && !item.is_read
      );
      unread.forEach((item) => {
        this.$api.community.markMessageAsRead(item.id);
      });
    },

    // 发送消息
    async sendMessage() {
      if (!this.newMessage.trim() || this.sending || !this.currentAccount()) return;

      const messageContent = this.newMessage.trim();
      this.sending = true;

      try {
        const response = await this.$api.community.sendMessage(
          this.targetUserId,
          messageContent
        );

        if (!this.currentAccount()) return;
        if (response.code === 0) {
          const created = response.data || {};
          this.messages.push({
            id: created.id,
            sender_id: this.myUserId,
            receiver_id: Number(this.targetUserId),
            message_content: messageContent,
            is_read: 0,
            sent_at: new Date(),
          });
          if (created.id) {
            this.newestId = created.id;
          }
          this.newMessage = "";

          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        } else {
          throw new Error(response.message || "发送失败");
        }
      } catch (error) {
        console.error("发送消息失败", error);
        this.$message.error(this.$t("发送失败，请重试"));
      } finally {
        this.sending = false;
      }
    },

    previewImage(url) {
      if (url) this.$preview([url]);
    },

    openSharedNovel(novel) {
      if (novel && novel.novel_id) {
        this.$router.push(`/novel/${novel.novel_id}`);
      }
    },

    // 添加换行
    addNewLine() {
      this.newMessage += "\n";
    },

    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    // 格式化时间
    formatTime(time) {
      return moment(time).format("MM-DD HH:mm");
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-page {
  height: max(360px, calc(100dvh - 220px));
  display: flex;
  flex-direction: column;
  background-color: var(--soft, #f1f3f5);
  border: 1px solid var(--line, #e2e6eb);
  border-radius: 12px;
  overflow: hidden;
}

.chat-header {
  background: var(--surface, #ffffff);
  padding: 16px 20px;
  border-bottom: 1px solid var(--line, #e2e6eb);
  display: flex;
  align-items: center;
  flex: none;

  .back-button {
    margin-right: 16px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--soft, #f1f3f5);
    }

    i {
      font-size: 20px;
      color: var(--muted, #5b626d);
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
        color: var(--ink, #30343b);
      }

      .user-id {
        font-size: 12px;
        color: var(--muted, #776a5d);
      }
    }
  }
}

.messages-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .load-more {
      text-align: center;
      font-size: 13px;
      color: var(--wood, #c65320);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .message-item {
    display: flex;
    align-items: flex-start;

    &.own-message {
      flex-direction: row-reverse;

      .message-content {
        align-items: flex-end;

        .message-bubble {
          background-color: var(--wood, #c65320);
          color: var(--ui-primary-text, #fffdf9);
          .message-time {
            color: inherit;
            opacity: 0.8;
          }
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
        background-color: var(--surface, #ffffff);
        color: var(--ink, #30343b);
        border-radius: 12px;
        padding: 12px 16px;

        .message-text {
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .message-image {
          display: block;
          max-width: 260px;
          max-height: 260px;
          border-radius: 8px;
          object-fit: cover;
          cursor: zoom-in;
        }

        .shared-book-card {
          display: flex;
          gap: 10px;
          width: 260px;
          max-width: 100%;
          padding: 8px;
          border-radius: 8px;
          background: var(--soft, #f1f3f5);
          border: 1px solid var(--line, #e2e6eb);
          cursor: pointer;

          .shared-book-cover {
            width: 48px;
            height: 64px;
            object-fit: cover;
            border-radius: 4px;
            flex-shrink: 0;
            background: var(--soft, #f1f3f5);
          }

          .shared-book-info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
          }

          .shared-book-tag {
            font-size: 11px;
            color: var(--wood, #c65320);
          }

          .shared-book-title {
            font-size: 14px;
            color: var(--ink, #30343b);
            font-weight: 500;
            margin-top: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .shared-book-author {
            font-size: 12px;
            color: var(--muted, #5b626d);
            margin-top: 2px;
          }
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
      color: var(--muted, #776a5d);
    }
  }

  .empty-messages {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted, #776a5d);

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
  background: var(--surface, #ffffff);
  border-top: 1px solid var(--line, #e2e6eb);
  padding: 16px 20px;
  flex: none;

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
  }

  .messages-container {
    padding: 24px;
  }

  .message-item {
    .message-content {
      max-width: 50%;
    }
  }

  .message-input-container {
    padding: 16px 24px;
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
    height: max(360px, calc(100dvh - 260px));
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

/* These pages share the desktop workspace instead of adding another outer gutter. */
.friends-page,
.settings-page,
.post-detail-page,
.post-edit-container {
  padding: 0 !important;
  max-width: none !important;
}
.friends-card,
.settings-card,
.post-detail,
.comments-section {
  border: 1px solid var(--line, #e2e6eb) !important;
  border-radius: 14px !important;
  box-shadow: none !important;
  background: var(--surface, #ffffff) !important;
}
.post-detail-container {
  gap: 22px !important;
}
.post-detail-main {
  min-width: 0;
}
.post-detail-page {
  min-height: 0 !important;
}
</style>
