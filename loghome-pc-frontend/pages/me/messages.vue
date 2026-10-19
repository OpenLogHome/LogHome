<template>
  <Workspace :title="$t('消息中心')" active="/me/messages">
    <template #actions
      ><nuxt-link v-if="tab === 'private'" to="/community/mail/new"
        ><el-button icon="el-icon-edit">{{ $t("写信") }}</el-button></nuxt-link
      ><el-button icon="el-icon-refresh" :loading="loading" @click="refresh">{{
        $t("刷新消息")
      }}</el-button></template
    >
    <div class="message-layout">
      <nav class="social-panel message-categories" :aria-label="$t('消息分类')">
        <button
          v-for="item in categories"
          :key="item.value"
          :class="{ active: tab === item.value }"
          :aria-pressed="tab === item.value"
          @click="selectTab(item.value)"
        >
          <i :class="item.icon" /><span>{{ $t(item.label) }}</span
          ><em v-if="count(item.value)">{{
            count(item.value) > 99 ? "99+" : count(item.value)
          }}</em>
        </button>
      </nav>
      <section class="social-panel message-content-panel">
        <div class="social-toolbar">
          <h2>{{ $t(currentLabel) }}</h2>
          <div v-if="tab === 'notification'" class="social-tabs message-archive-tabs">
            <button :class="{ active: !history }" @click="history = false">
              {{ $t("当前消息") }}</button
            ><button :class="{ active: history }" @click="history = true">
              {{ $t("历史消息") }}
            </button>
          </div>
        </div>
        <div v-if="error" class="social-state" role="alert">
          {{ error }}<br /><el-button @click="refresh">{{ $t("重新加载") }}</el-button>
        </div>
        <el-skeleton v-if="loading" :rows="6" animated />
        <template v-else-if="tab === 'private'"
          ><nuxt-link
            v-for="item in conversations"
            :key="item.user_id"
            :to="`/community/chat?id=${item.user_id}`"
            class="social-list-row"
            ><img :src="item.avatar_url || '/default-avatar.png'" alt="" />
            <div class="row-main">
              <strong>{{ item.name }}</strong>
              <p>
                {{ preview(item.last_message_content) || $t("开始与对方聊天吧") }}
              </p>
            </div>
            <div class="message-meta">
              <time>{{ formatTime(item.last_message_time) }}</time
              ><el-badge
                v-if="item.unread_count"
                :value="item.unread_count"
                :max="99"
              /></div
          ></nuxt-link>
          <div v-if="!conversations.length && !error" class="social-state">
            <i class="el-icon-chat-dot-round" />{{ $t("暂无私信") }}<br /><nuxt-link
              to="/me/friends"
              >{{ $t("找到好友，开始交流") }}</nuxt-link
            >
          </div></template
        >
        <ReaderActivityInbox
          v-else-if="tab === 'activity'"
          ref="activityInbox"
          embedded
        />
        <template v-else>
          <article v-for="group in groups" :key="group.key" class="message-group">
            <div class="social-list-row">
              <nuxt-link :to="`/users/${group.items[0].from_id}`"
                ><img :src="group.items[0].avatar_url || '/default-avatar.png'" alt=""
              /></nuxt-link>
              <div class="row-main">
                <div class="message-row-heading">
                  <strong>{{ group.items[0].name }}</strong
                  ><time>{{ formatTime(group.items[0].time) }}</time>
                </div>
                <button class="message-target" @click="openMessage(group.items[0])">
                  {{ group.items[0].message_content }}</button
                ><el-button
                  v-if="group.items.length > 1"
                  type="text"
                  size="small"
                  @click="$set(expanded, group.key, !expanded[group.key])"
                  >{{
                    expanded[group.key]
                      ? $t("收起")
                      : $t("查看 {p0} 条相同消息", { p0: group.items.length })
                  }}</el-button
                >
              </div>
              <el-button
                v-if="tab === 'notification' && !history"
                type="text"
                :disabled="archiving"
                @click="archive(group)"
                >{{ $t("归档") }}</el-button
              >
            </div>
            <div v-if="expanded[group.key]" class="group-history">
              <button
                v-for="item in group.items.slice(1)"
                :key="item.message_id"
                @click="openMessage(item)"
              >
                {{ formatTime(item.time) }} · {{ item.message_content }}
              </button>
            </div>
          </article>
          <div v-if="!groups.length && !error" class="social-state">
            <i class="el-icon-bell" />{{ $t("暂无{p0}", { p0: $t(currentLabel) }) }}
          </div>
        </template>
      </section>
    </div>
  </Workspace>
</template>
<script>
import ReaderActivityInbox from "~/components/read/ReaderActivityInbox.vue";
import Workspace from "~/components/social/Workspace.vue";
import social from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
import { notificationGroups, messageTime } from "~/utils/social";
import { formatMessagePreview } from "~/utils/private-message";
import { socialMessageTarget } from "~/utils/social-links";
export default {
  components: { Workspace, ReaderActivityInbox },
  data: () => ({
    tab: "comment",
    history: false,
    messages: [],
    conversations: [],
    loading: false,
    error: "",
    archiving: false,
    expanded: {},
    categories: [
      { value: "comment", label: "评论与回复", icon: "el-icon-chat-dot-round" },
      { value: "followed", label: "新增关注", icon: "el-icon-user" },
      { value: "like_collect", label: "赞与收藏", icon: "el-icon-star-off" },
      { value: "private", label: "私信", icon: "el-icon-message" },
      { value: "notification", label: "系统通知", icon: "el-icon-bell" },
      { value: "activity", label: "活动消息", icon: "el-icon-date" },
    ],
  }),
  computed: {
    currentLabel() {
      return (this.categories.find((item) => item.value === this.tab) || {}).label;
    },
    groups() {
      return notificationGroups(
        this.messages.filter(
          (item) =>
            item.message_type === this.tab ||
            (this.tab === "notification" && !item.message_type)
        ),
        this.tab === "notification" && this.history
      );
    },
  },
  mounted() {
    if (!readingToken()) {
      this.$router.replace({
        path: "/login",
        query: { redirect: this.$route.fullPath },
      });
      return;
    }
    if (this.categories.some((item) => item.value === this.$route.query.tab))
      this.tab = this.$route.query.tab;
    this.refresh();
  },
  watch: {
    "$route.query.tab"(tab) {
      if (this.categories.some((item) => item.value === tab)) {
        this.tab = tab;
        this.markSeen();
      }
    },
  },
  methods: {
    markSeen() {
      this.messages.forEach((item) => {
        if (item.message_type === this.tab && Number(item.is_read) === 0)
          this.$set(item, "is_read", 1);
      });
    },
    preview: formatMessagePreview,
    selectTab(tab) {
      this.tab = tab;
      this.markSeen();
      this.history = false;
      this.$router.replace({ query: { tab } }).catch(() => {});
    },
    count(type) {
      if (type === "private")
        return this.conversations.reduce(
          (sum, item) => sum + Number(item.unread_count || 0),
          0
        );
      return this.messages.filter(
        (item) => item.message_type === type && Number(item.is_read) === 0
      ).length;
    },
    async refresh() {
      if (this.loading) return;
      if (this.tab === "activity" && this.$refs.activityInbox) {
        this.$refs.activityInbox.load(this.$refs.activityInbox.page);
        return;
      }
      this.loading = true;
      this.error = "";
      try {
        await social.deduplicateMessages().catch(() => {});
        const results = await Promise.allSettled([
          social.messages(),
          social.conversations(),
        ]);
        const failures = [];
        if (results[0].status === "fulfilled")
          this.messages = Array.isArray(results[0].value) ? results[0].value : [];
        else failures.push(results[0].reason.message);
        if (results[1].status === "fulfilled")
          this.conversations = results[1].value.data || [];
        else failures.push(results[1].reason.message);
        this.error = failures.join("；");
      } finally {
        this.markSeen();
        this.loading = false;
      }
    },
    async archive(group) {
      if (this.archiving) return;
      this.archiving = true;
      try {
        for (const item of group.items) {
          await social.archive(item.message_id);
          this.$set(item, "is_read", 2);
        }
        this.$message.success(this.$t("已移入历史消息"));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.archiving = false;
      }
    },
    formatTime(value) {
      const timestamp = messageTime(value);
      return timestamp
        ? new Date(timestamp).toLocaleString(this.$language.state.locale, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
    },
    openMessage(item) {
      const target = socialMessageTarget(item.router);
      if (!target) return;
      if (target.mobile) this.$openMobileWindow(target.path, { title: "消息详情" });
      else this.$router.push(target.path);
    },
  },
  head: () => ({ title: "消息中心 - 原木社区" }),
};
</script>
<style scoped>
.message-layout {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 18px;
}
.message-categories {
  align-self: start;
  padding: 10px;
}
.message-categories button {
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  border: 0;
  background: none;
  padding: 15px 12px;
  color: var(--muted, #82766c);
  cursor: pointer;
  border-radius: 9px;
  text-align: left;
}
.message-categories button.active {
  background: var(--selection-bg, #f6e9dc);
  color: var(--ink, #30343b);
  font-weight: 600;
}
.message-categories em {
  margin-left: auto;
  background: #c65320;
  border-radius: 9px;
  padding: 1px 5px;
  color: white;
  font-size: 11px;
  font-style: normal;
}
.message-content-panel {
  min-height: 500px;
}
.message-meta {
  text-align: right;
  font-size: 11px;
  color: var(--muted, #5b626d);
}
.message-meta .el-badge {
  display: block;
  margin-top: 12px;
}
.message-row-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.message-row-heading time {
  font-size: 11px;
  color: var(--muted, #5b626d);
}
.message-target {
  text-align: left;
  border: 0;
  background: none;
  padding: 8px 0;
  color: var(--muted, #766858);
  font-size: 14px;
  line-height: 1.8;
  cursor: pointer;
  overflow-wrap: anywhere;
  white-space: pre-line;
  width: 100%;
}
.message-archive-tabs {
  margin: 0;
}
.message-archive-tabs button {
  font-size: 12px;
  padding: 8px;
}
.social-toolbar h2 {
  margin: 0;
}
.group-history {
  margin-left: 60px;
  padding: 8px;
  background: var(--soft, #f1f3f5);
  border-radius: 8px;
}
.group-history button {
  display: block;
  background: none;
  border: 0;
  text-align: left;
  padding: 10px;
  color: var(--muted, #82766c);
  cursor: pointer;
}
@media (max-width: 1100px) {
  .message-layout {
    grid-template-columns: 1fr;
  }
  .message-categories {
    display: flex;
    flex-wrap: wrap;
  }
  .message-categories button {
    width: auto;
  }
  .message-categories em {
    margin-left: 0;
  }
}
</style>
