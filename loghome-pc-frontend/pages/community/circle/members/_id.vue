<template>
  <Workspace
    :title="$t('{p0} · 成员', { p0: circle.name || '圈子' })"
    active="/community/circles"
    :circle-role="role"
  >
    <div class="social-tabs">
      <button
        v-for="item in tabs"
        :key="item.value"
        :class="{ active: tab === item.value }"
        @click="switchTab(item.value)"
      >
        {{ $t(item.label) }}
      </button>
    </div>
    <section class="social-panel">
      <div v-if="error" class="social-state" role="alert">
        {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
      </div>
      <el-skeleton v-if="loading" :rows="6" animated />
      <div v-else-if="!rows.length && !error" class="social-state">
        <i class="el-icon-user" />{{
          tab === "requests"
            ? $t("暂时没有待审核申请")
            : tab === "banned"
            ? $t("暂无禁言或移出记录")
            : $t("暂无成员")
        }}
      </div>
      <div
        v-for="member in rows"
        :key="member.request_id || member.ban_id || member.user_id"
        class="social-list-row"
      >
        <nuxt-link :to="`/users/${member.user_id}`"
          ><img :src="member.avatar_url || '/default-avatar.png'" alt=""
        /></nuxt-link>
        <div class="row-main">
          <nuxt-link :to="`/users/${member.user_id}`"
            ><strong>{{ member.name }}</strong></nuxt-link
          ><el-tag
            v-if="tab === 'members' && Number(member.role) > 0"
            size="mini"
            type="warning"
            >{{ Number(member.role) === 2 ? $t("圈主") : $t("管理员") }}</el-tag
          >
          <p>
            {{
              tab === "requests"
                ? member.verification_info || $t("未填写验证信息")
                : tab === "banned"
                ? member.reason || $t("未填写原因")
                : member.motto || $t("这位圈友还没有填写签名")
            }}
          </p>
          <p v-if="tab === 'banned'">
            {{
              Number(member.ban_type) === 1
                ? $t("已移出圈子")
                : member.end_time
                ? $t("禁言至 {p0}", { p0: formatTime(member.end_time) })
                : $t("永久禁言")
            }}
          </p>
        </div>
        <div v-if="tab === 'requests'" class="member-actions">
          <el-button
            size="small"
            type="primary"
            :disabled="busy"
            @click="review(member, 1)"
            >{{ $t("通过") }}</el-button
          ><el-button size="small" :disabled="busy" @click="review(member, 2)">{{
            $t("拒绝")
          }}</el-button>
        </div>
        <el-button
          v-else-if="tab === 'banned'"
          size="small"
          :disabled="busy"
          @click="restore(member)"
          >{{
            Number(member.ban_type) === 1 ? $t("取消移出") : $t("解除禁言")
          }}</el-button
        >
        <el-dropdown
          v-else-if="canManage(member)"
          trigger="click"
          @command="(command) => manage(member, command)"
          ><el-button size="small" :disabled="busy"
            >{{ $t("管理") }}<i class="el-icon-arrow-down" /></el-button
          ><el-dropdown-menu slot="dropdown"
            ><el-dropdown-item v-if="role === 2" command="admin">{{
              Number(member.role) === 1 ? $t("取消管理员") : $t("设为管理员")
            }}</el-dropdown-item
            ><el-dropdown-item command="ban">{{ $t("禁言") }}</el-dropdown-item
            ><el-dropdown-item command="kick">{{
              $t("移出圈子")
            }}</el-dropdown-item></el-dropdown-menu
          ></el-dropdown
        >
      </div>
      <div v-if="hasMore && !loading" class="social-end">
        <el-button @click="load(true)">{{ $t("加载更多") }}</el-button>
      </div>
    </section>
    <el-dialog :title="$t('禁言成员')" :visible.sync="banDialog" width="min(480px, 92vw)"
      ><p>{{ selected && selected.name }}</p>
      <el-form label-position="top"
        ><el-form-item :label="$t('禁言时长')"
          ><el-select v-model="duration"
            ><el-option
              v-for="time in durations"
              :key="time.value"
              :label="$t(time.label)"
              :value="time.value" /></el-select></el-form-item
        ><el-form-item :label="$t('原因（可选）')"
          ><el-input
            v-model="reason"
            type="textarea"
            maxlength="200" /></el-form-item></el-form
      ><template #footer
        ><el-button @click="banDialog = false">{{ $t("取消") }}</el-button
        ><el-button type="primary" :loading="busy" @click="ban">{{
          $t("确认禁言")
        }}</el-button></template
      ></el-dialog
    >
  </Workspace>
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import social from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
import { messageTime } from "~/utils/social";
export default {
  components: { Workspace },
  data: () => ({
    circle: {},
    role: 0,
    tab: "members",
    rows: [],
    page: 1,
    hasMore: false,
    loading: false,
    busy: false,
    error: "",
    requestId: 0,
    banDialog: false,
    selected: null,
    duration: 60,
    reason: "",
    durations: [
      { value: 60, label: "1 小时" },
      { value: 1440, label: "1 天" },
      { value: 10080, label: "7 天" },
      { value: 43200, label: "30 天" },
      { value: 0, label: "永久" },
    ],
  }),
  computed: {
    id() {
      return this.$route.params.id;
    },
    tabs() {
      return [
        { value: "members", label: "成员列表" },
        ...(this.role > 0
          ? [
              { value: "requests", label: "入圈申请" },
              { value: "banned", label: "禁言与移出记录" },
            ]
          : []),
      ];
    },
  },
  async mounted() {
    try {
      this.circle = await social.circle(this.id);
      if (readingToken()) {
        const mine = await social.myCircles();
        this.role =
          Number((mine.find((item) => String(item.circle_id) === this.id) || {}).role) ||
          0;
      }
    } catch (error) {
      this.$message.error(error.message);
    }
    this.load();
  },
  beforeDestroy() {
    this.requestId++;
  },
  methods: {
    formatTime(value) {
      return new Date(messageTime(value)).toLocaleString(this.$language.state.locale);
    },
    canManage(member) {
      return (
        this.role > 0 &&
        Number(member.role) !== 2 &&
        (this.role === 2 || Number(member.role) === 0)
      );
    },
    switchTab(tab) {
      if (tab === this.tab) return;
      this.tab = tab;
      this.requestId++;
      this.loading = false;
      this.rows = [];
      this.page = 1;
      this.load();
    },
    async load(more = false) {
      if (this.loading) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      if (!more) {
        this.page = 1;
        this.rows = [];
      }
      try {
        const fn =
          this.tab === "requests"
            ? social.requests
            : this.tab === "banned"
            ? social.banned
            : social.members;
        const result = await fn(this.id, { page: this.page, pageSize: 30 });
        if (request !== this.requestId) return;
        this.rows = [...this.rows, ...(result.list || [])];
        this.page++;
        this.hasMore = this.rows.length < Number(result.total || this.rows.length);
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    },
    async action(action, data) {
      if (this.busy) return false;
      this.busy = true;
      try {
        await social.memberAction(this.id, action, data);
        this.$message.success(this.$t("操作成功"));
        await this.load();
        return true;
      } catch (error) {
        this.$message.error(error.message);
        return false;
      } finally {
        this.busy = false;
      }
    },
    async review(member, status) {
      if (this.busy) return;
      let comment = "";
      if (status === 2) {
        try {
          const result = await this.$prompt(
            this.$t("可填写拒绝原因"),
            this.$t("拒绝入圈申请"),
            {
              inputPlaceholder: "原因（可选）",
            }
          );
          comment = result.value || "";
        } catch (_) {
          return;
        }
      }
      await this.action("review-join", {
        request_id: member.request_id,
        status,
        comment,
      });
    },
    async manage(member, command) {
      if (this.busy) return;
      if (command === "ban") {
        this.selected = member;
        this.reason = "";
        this.banDialog = true;
        return;
      }
      try {
        if (command === "admin") {
          await this.$confirm(
            this.$t("确定{p0} {p1} 的管理员身份？", {
              p0: Number(member.role) === 1 ? "取消" : "设置",
              p1: member.name,
            }),
            this.$t("管理员设置")
          );
          await this.action("set-admin", {
            user_id: member.user_id,
            is_admin: Number(member.role) !== 1,
          });
        } else {
          const result = await this.$prompt(
            this.$t("确定将 {p0} 移出圈子？可填写原因。", { p0: member.name }),
            this.$t("移出成员")
          );
          await this.action("kick-user", {
            user_id: member.user_id,
            reason: result.value || "",
          });
        }
      } catch (_) {}
    },
    async ban() {
      if (
        await this.action("ban-user", {
          user_id: this.selected.user_id,
          duration: this.duration,
          reason: this.reason,
        })
      )
        this.banDialog = false;
    },
    async restore(member) {
      if (this.busy) return;
      try {
        await this.$confirm(
          this.$t("确定{p0} {p1}？", {
            p0: Number(member.ban_type) === 1 ? "取消移出" : "解除禁言",
            p1: member.name,
          }),
          this.$t("恢复成员权限")
        );
        await this.action(Number(member.ban_type) === 1 ? "cancel-kick" : "unban-user", {
          user_id: member.user_id,
        });
      } catch (_) {}
    },
  },
  head: () => ({ title: "圈子成员 - 原木社区" }),
};
</script>
<style scoped>
.row-main .el-tag {
  margin-left: 10px;
}
.member-actions {
  display: flex;
  gap: 8px;
}
.member-actions .el-button {
  margin: 0;
}
.social-list-row {
  align-items: flex-start;
}
.social-list-row .el-button {
  flex-shrink: 0;
}
@media (max-width: 600px) {
  .social-list-row {
    flex-wrap: wrap;
  }
  .row-main {
    min-width: 180px;
  }
  .member-actions {
    margin-left: 60px;
  }
}
</style>
