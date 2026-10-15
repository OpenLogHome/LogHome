<template>
  <Workspace :title="$t('写一封信')" active="/me/messages"
    >
    <div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" /><el-button
        @click="load"
        >{{ $t("重试") }}</el-button
      >
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="5" animated />
    <section v-else class="social-panel">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="send"
        ><el-form-item :label="$t('收件人')" prop="to_id"
          ><el-select
            v-model="form.to_id"
            filterable
            :placeholder="$t('选择关注或粉丝中的收件人')"
            style="width: 100%"
            ><el-option
              v-for="friend in friends"
              :key="friend.id"
              :label="friend.name"
              :value="friend.id"
          /></el-select>
          <p v-if="!friends.length" class="social-muted">
            {{ $t("暂时没有可选的收件人。")
            }}<nuxt-link to="/me/friends">{{ $t("查看好友与关注") }}</nuxt-link>
          </p></el-form-item
        ><el-form-item :label="$t('标题')" prop="title"
          ><el-input v-model="form.title" maxlength="20" show-word-limit /></el-form-item
        ><el-form-item :label="$t('信件内容')" prop="msg"
          ><el-input
            v-model="form.msg"
            type="textarea"
            :rows="10"
            :placeholder="$t('写下想对朋友说的话')" /></el-form-item
        ><el-button type="primary" native-type="submit" :loading="sending">{{
          $t("发送信件")
        }}</el-button></el-form
      >
    </section></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account from "~/plugins/api/account";
import { socialRequest } from "~/plugins/api/social";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace },
  mixins: [accountPage],
  data: () => ({
    friends: [],
    loading: true,
    error: "",
    sending: false,
    sent: false,
    form: { to_id: null, title: "", msg: "" },
    rules: {
      to_id: [{ required: true, message: "请选择收件人" }],
      title: [{ required: true, whitespace: true, message: "请输入标题" }],
      msg: [{ required: true, whitespace: true, message: "请输入信件内容" }],
    },
  }),
  beforeRouteLeave(to, from, next) {
    if (!this.sent && (this.form.title.trim() || this.form.msg.trim()))
      this.$confirm(this.$t("信件尚未发送，确定离开？"), this.$t("离开写信"))
        .then(() => next())
        .catch(() => next(false));
    else next();
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const profile = await account.profile();
        const rows = await socialRequest(
          "/community/get_friends_of",
          { id: profile.user_id },
          "GET",
          null,
          true
        );
        if (!Array.isArray(rows)) throw new Error("收件人列表加载异常");
        this.friends = rows;
        const recipient = Number(this.$route.query.to_id);
        if (rows.some((item) => Number(item.id) === recipient))
          this.form.to_id = recipient;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    send() {
      if (this.sending) return;
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        const friend = this.friends.find((item) => item.id === this.form.to_id);
        if (!friend) return;
        if (
          !(await this.confirmAction(`确认向 ${friend.name} 发送这封信件？`, "发送信件"))
        )
          return;
        this.sending = true;
        try {
          await socialRequest("/community/send_mail", {}, "POST", this.form, true);
          this.sent = true;
          this.$message.success(this.$t("信件已发送"));
          this.$router.push("/me/messages");
        } catch (error) {
          this.$message.error(error.message);
        } finally {
          this.sending = false;
        }
      });
    },
  },
  head: () => ({ title: "写一封信 - 原木社区" }),
};
</script>
