<template>
  <Workspace :title="title || $t('历史信件')" active="/me/messages"
    ><template #actions
      ><nuxt-link to="/me/messages?tab=notification"
        ><el-button>{{ $t("返回消息中心") }}</el-button></nuxt-link
      ></template
    >
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="6" animated />
    <article v-else class="social-panel">
      <nuxt-link :to="`/users/${mail.from_id}`" class="social-list-row"
        ><Avatar :src="mail.avatar_url" :frame="mail.avatar_frame" :size="48" />
        <div class="row-main">
          <strong>{{ mail.user_name || mail.name }}</strong>
          <p>{{ accountDate(mail.time) }}</p>
        </div></nuxt-link
      >
      <p class="mail-content">{{ content }}</p>
      <nuxt-link :to="`/community/chat?id=${mail.from_id}`"
        ><el-button type="primary">{{ $t("私信回复") }}</el-button></nuxt-link
      >
    </article></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import Avatar from "~/components/social/Avatar.vue";
import { socialRequest } from "~/plugins/api/social";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace, Avatar },
  mixins: [accountPage],
  data: () => ({ mail: {}, loading: true, error: "" }),
  computed: {
    title() {
      return String(this.mail.message_content || "").split("\n")[0];
    },
    content() {
      const value = String(this.mail.message_content || "");
      const index = value.indexOf("\n");
      return index >= 0 ? value.slice(index + 1) : value;
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const rows = await socialRequest(
          "/community/get_mail",
          { message_id: this.$route.params.id },
          "GET",
          null,
          true
        );
        if (!Array.isArray(rows) || !rows.length) throw new Error("信件不存在或无权查看");
        this.mail = rows[0];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
  head() {
    return { title: `${this.title || "历史信件"} - 原木社区` };
  },
};
</script>
<style scoped>
.mail-content {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 15px;
  line-height: 2;
  padding: 28px 0;
}
</style>
