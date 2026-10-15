<template>
  <Workspace :title="$t('邀请好友')" active="/me"
    ><div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="6" animated /><template
      v-else
      ><div class="invite-layout">
        <section class="social-panel invite-card">
          <Avatar :src="user.avatar_url" :frame="user.avatar_frame" :size="72" />
          <h2>{{ $t("{p0} 邀请你加入原木社区", { p0: user.name }) }}</h2>
          <span class="social-muted">{{ $t("我的邀请码") }}</span
          ><strong class="invite-code">{{ invite.invite_code }}</strong
          ><el-button type="primary" icon="el-icon-copy-document" @click="copy">{{
            $t("复制分享链接")
          }}</el-button>
          <p class="social-muted">{{ $t("双方均可获得邀请奖励") }}</p>
        </section>
        <section class="social-panel">
          <h2>{{ $t("我的邀请数据") }}</h2>
          <div class="invite-stats">
            <div v-for="item in stats" :key="item.label">
              <strong>{{ item.value || 0 }}</strong
              ><span>{{ $t(item.label) }}</span>
            </div>
          </div>
          <p class="social-muted">
            {{ $t("本月邀请上限 {p0} 人", { p0: invite.monthly_limit }) }}<br />{{
              $t("新用户奖励 {p0} 原木", { p0: invite.new_user_reward })
            }}<br />{{ $t("回归用户奖励 {p0} 原木", { p0: invite.return_user_reward }) }}
          </p>
        </section>
      </div>
      <section class="social-panel">
        <h2>{{ $t("填写朋友的邀请码") }}</h2>
        <form class="invite-redeem" @submit.prevent="use">
          <el-input
            v-model="code"
            maxlength="50"
            :placeholder="$t('输入朋友的邀请码')"
            :aria-label="$t('朋友的邀请码')"
          /><el-select v-model="type" :aria-label="$t('邀请类型')"
            ><el-option value="new" :label="$t('新用户加入')" /><el-option
              value="return"
              :label="$t('老用户回归')" /></el-select
          ><el-button
            type="primary"
            native-type="submit"
            :disabled="!code.trim()"
            :loading="busy"
            >{{ $t("领取邀请奖励") }}</el-button
          >
        </form>
        <p class="social-muted">{{ $t("领取条件由系统验证，以社区邀请规则为准。") }}</p>
      </section></template
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import Avatar from "~/components/social/Avatar.vue";
import account from "~/plugins/api/account";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace, Avatar },
  mixins: [accountPage],
  data: () => ({
    user: {},
    invite: {},
    loading: true,
    error: "",
    code: "",
    type: "new",
    busy: false,
  }),
  computed: {
    stats() {
      return [
        { label: "累计邀请新用户", value: this.invite.new_user_count },
        { label: "累计邀请回归", value: this.invite.return_user_count },
        { label: "本月新用户", value: this.invite.last_month_new_count },
        { label: "本月回归用户", value: this.invite.last_month_return_count },
      ];
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        [this.user, this.invite] = await Promise.all([
          account.profile(),
          account.invite(),
        ]);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async copy() {
      const text = `我邀请你加入原木社区，邀请码是${this.invite.invite_code}`;
      try {
        await navigator.clipboard.writeText(text);
        this.$message.success(this.$t("邀请链接已复制"));
      } catch (_) {
        this.$prompt(this.$t("复制此链接邀请好友"), this.$t("邀请好友"), {
          inputValue: text,
        }).catch(() => {});
      }
    },
    async use() {
      if (this.busy || !this.code.trim()) return;
      this.busy = true;
      try {
        const result = await account.useInvite({
          invite_code: this.code.trim(),
          invite_type: this.type,
        });
        this.$message.success(result.msg || this.$t("邀请奖励已领取"));
        this.code = "";
        await this.load();
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "邀请好友 - 原木社区" }),
};
</script>
<style scoped>
.invite-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}
.invite-card {
  text-align: center;
  padding: 36px;
}
.invite-card h2 {
  font-size: 20px;
  margin: 20px 0;
}
.invite-code {
  display: block;
  font-size: 42px;
  letter-spacing: 8px;
  font-weight: 500;
  color: var(--wood, #947358);
  margin: 24px 0;
}
.invite-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 24px 0;
}
.invite-stats strong {
  display: block;
  font-size: 28px;
  font-weight: 500;
}
.invite-stats span {
  display: block;
  font-size: 12px;
  color: var(--muted, #82766c);
  margin-top: 8px;
}
.invite-redeem {
  display: flex;
  gap: 12px;
}
.invite-redeem .el-input {
  flex: 1;
}
.invite-redeem .el-select {
  width: 160px;
  flex-shrink: 0;
}
@media (max-width: 1000px) {
  .invite-layout {
    grid-template-columns: 1fr;
  }
  .invite-redeem {
    flex-wrap: wrap;
  }
}
</style>
