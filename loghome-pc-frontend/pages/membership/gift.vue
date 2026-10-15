<template>
  <Workspace :title="$t('赠送通行证')" active="/me"
    >
    <div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" /><el-button
        @click="load"
        >{{ $t("重新加载") }}</el-button
      >
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="6" animated />
    <section v-else class="social-panel gift-form">
      <el-form ref="form" label-position="top" @submit.native.prevent="gift"
        ><el-form-item :label="$t('选择好友')"
          ><el-select
            v-model="friendId"
            filterable
            :placeholder="$t('请选择互相关注的好友')"
            style="width: 100%"
            ><el-option
              v-for="friend in friends"
              :key="friend.user_id"
              :label="`${friend.name}（ID ${friend.user_id}）`"
              :value="friend.user_id"
          /></el-select>
          <p v-if="!friends.length" class="social-muted">
            {{ $t("还没有可以赠送的好友，先与朋友互相关注吧。")
            }}<nuxt-link to="/me/friends">{{ $t("查看好友") }}</nuxt-link>
          </p></el-form-item
        ><el-form-item :label="$t('通行证档位')"
          ><el-radio-group v-model="tier"
            ><el-radio-button v-for="item in tiers" :key="item.key" :label="item.key">{{
              item.name
            }}</el-radio-button></el-radio-group
          ></el-form-item
        ><el-form-item :label="$t('赠送时长')"
          ><el-radio-group v-model="cycle"
            ><el-radio-button
              v-for="plan in plans"
              :key="plan.billing_cycle"
              :label="plan.billing_cycle"
              >{{
                $t("{p0} · {p1} 原木", {
                  p0: plan.billing_cycle === "monthly" ? $t("30 天") : $t("365 天"),
                  p1: plan.cost_log,
                })
              }}</el-radio-button
            ></el-radio-group
          ></el-form-item
        ><el-form-item :label="$t('赠言（可选）')"
          ><el-input
            v-model="message"
            type="textarea"
            :rows="4"
            maxlength="200"
            show-word-limit
            :placeholder="$t('写下想对好友说的话')" /></el-form-item
        ><el-button
          type="primary"
          native-type="submit"
          :loading="busy"
          :disabled="!friendId || !plans.length"
          >{{ $t("确认赠送") }}</el-button
        ></el-form
      >
      <p class="social-muted">
        {{ $t("赠送不会为好友开启自动续费，权益发放后无法转移。")
        }}<nuxt-link to="/membership/rules">{{ $t("查看服务规则") }}</nuxt-link>
      </p>
    </section></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account, { accountRequestId } from "~/plugins/api/account";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace },
  mixins: [accountPage],
  data: () => ({
    friends: [],
    tiers: [],
    friendId: null,
    tier: "standard",
    cycle: "monthly",
    message: "",
    loading: true,
    busy: false,
    error: "",
    pendingId: "",
    pendingPayload: "",
  }),
  computed: {
    plans() {
      return (this.tiers.find((item) => item.key === this.tier) || {}).plans || [];
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        [this.friends, this.tiers] = await Promise.all([
          account.giftFriends(),
          account.membershipPlans(),
        ]);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async gift() {
      if (this.busy || !this.friendId) return;
      const friend = this.friends.find((item) => item.user_id === this.friendId);
      const plan = this.plans.find((item) => item.billing_cycle === this.cycle);
      if (
        !(await this.confirmAction(
          `向 ${friend.name} 赠送通行证，将扣除 ${plan.cost_log} 原木。`,
          "确认赠送"
        ))
      )
        return;
      this.busy = true;
      this.error = "";
      try {
        const body = {
          beneficiary_user_id: Number(this.friendId),
          membership_type: this.tier,
          billing_cycle: this.cycle,
          message: this.message.trim(),
        };
        const payload = JSON.stringify(body);
        if (payload !== this.pendingPayload) {
          this.pendingId = accountRequestId("gift");
          this.pendingPayload = payload;
        }
        const result = await account.gift({
          ...body,
          client_request_id: this.pendingId,
        });
        this.pendingId = "";
        this.pendingPayload = "";
        this.$message.success(
          this.$t("已向 ID {p0} 赠送通行证", { p0: result.beneficiary.user_id })
        );
        this.$router.push("/membership");
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "赠送通行证 - 原木社区" }),
};
</script>
<style scoped>
.gift-form {
  max-width: 760px;
}
.el-radio-button {
  margin-bottom: 8px;
}
</style>
