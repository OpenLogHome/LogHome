<template>
  <Workspace :title="$t('原木通行证')" active="/me">
    
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="7" animated />
    <template v-else-if="!error">
      <section v-if="subscription" class="social-panel membership-status">
        <div>
          <h2>
            {{
              $t("{p0} 已生效", {
                p0:
                  subscription.membership_type === "super"
                    ? $t("超级原木通行证")
                    : $t("原木通行证"),
              })
            }}
          </h2>
          <p class="social-muted">
            {{ $t("到期时间 {p0}", { p0: date(subscription.expires_at) }) }}<br />{{
              $t("续费价格 {p0} 原木", {
                p0: subscription.renewal_cost_log || subscription.cost_log,
              })
            }}
          </p>
        </div>
        <el-button :loading="busy" @click="toggleRenew">{{
          subscription.auto_renew ? $t("关闭自动续费") : $t("开启自动续费")
        }}</el-button>
      </section>
      <div class="pass-grid">
        <section
          v-for="tier in tiers"
          :key="tier.key"
          class="pass-card"
          :class="tier.key"
        >
          <div class="pass-heading">
            <img
              :src="`/social/membership/${
                tier.key === 'super' ? 'loghome-super-pass' : 'loghome-pass'
              }.png`"
              alt=""
            />
            <div>
              <span>{{ tier.key === "super" ? $t("全量权益") : $t("轻享会员") }}</span>
              <h2>{{ $t(tier.name) }}</h2>
            </div>
          </div>
          <p class="pass-summary">
            {{
              tier.key === "super"
                ? $t("双倍成长、限定身份与全部会员权益")
                : $t("更快成长，获得更完整的社区体验")
            }}
          </p>
          <ul>
            <li v-for="benefit in benefits[tier.key]" :key="benefit.title">
              <i class="el-icon-check" />
              <div>
                <strong>{{ $t(benefit.title) }}</strong>
                <p>{{ $t(benefit.description) }}</p>
              </div>
            </li>
          </ul>
          <div class="pass-plans">
            <button
              v-for="plan in tier.plans"
              :key="plan.billing_cycle"
              :class="{ selected: selected[tier.key] === plan.billing_cycle }"
              @click="$set(selected, tier.key, plan.billing_cycle)"
            >
              <span>{{ $t(plan.name) }}</span
              ><strong
                >{{ plan.cost_log }} <small>{{ $t("原木") }}</small></strong
              ><span>{{
                plan.billing_cycle === "monthly"
                  ? $t("每 30 天，自动续费可关闭")
                  : $t("365 天，不自动续费")
              }}</span>
            </button>
          </div>
          <el-button
            type="primary"
            :loading="busy && activeTier === tier.key"
            :disabled="
              busy ||
              (subscription &&
                subscription.membership_type === 'super' &&
                tier.key === 'standard') ||
              (subscription && subscription.membership_type === tier.key)
            "
            @click="purchase(tier)"
            >{{
              subscription && subscription.membership_type === tier.key
                ? $t("当前通行证")
                : subscription &&
                  subscription.membership_type === "standard" &&
                  tier.key === "super"
                ? $t("补差价升级{p0}", {
                    p0: quote ? " · " + quote.cost_log + " 原木" : "",
                  })
                : $t("开通通行证")
            }}</el-button
          >
        </section>
      </div>
      <section class="social-panel pass-bottom">
        <span
          >{{ $t("原木余额") }}
          <strong>{{ balance === null ? $t("暂不可用") : balance }}</strong></span
        ><nuxt-link to="/me/wallet">{{ $t("充值原木") }}</nuxt-link
        ><nuxt-link to="/membership/redeem">{{ $t("兑换通行证") }}</nuxt-link
        ><nuxt-link to="/membership/gift">{{ $t("赠送好友") }}</nuxt-link>
      </section>
    </template>
  </Workspace>
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account, { accountRequestId } from "~/plugins/api/account";
import { readingToken } from "~/plugins/api/reading";
export default {
  components: { Workspace },
  data: () => ({
    tiers: [],
    subscription: null,
    quote: null,
    balance: null,
    loading: true,
    error: "",
    busy: false,
    activeTier: "",
    selected: { standard: "yearly", super: "yearly" },
    pendingIds: {},
    benefits: {
      standard: [
        { title: "专属通行证标识", description: "展示个人主页与社区会员身份" },
        {
          title: "1.2 倍成长加速",
          description: "签到、阅读和创作获得 1.2 倍成长进度",
        },
        {
          title: "每月 100 红石",
          description: "月付购买和续费赠送，年付每月到账；3 个月内有效",
        },
        { title: "阅读与创作增强", description: "更多个性设置与头像挂件" },
      ],
      super: [
        {
          title: "超级会员限定身份",
          description: "蓝金徽章、主页氛围与专属昵称样式",
        },
        {
          title: "双倍成长加速",
          description: "签到、阅读和创作获得 2 倍成长进度",
        },
        {
          title: "每月 200 红石",
          description: "月付购买和续费赠送，年付每月到账；3 个月内有效",
        },
        {
          title: "全部标准权益",
          description: "包含标准通行证权益及新功能优先体验",
        },
      ],
    },
  }),
  mounted() {
    this.load();
  },
  methods: {
    date(value) {
      return value
        ? new Date(value).toLocaleString(this.$language.state.locale)
        : "暂不可用";
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.tiers = await account.membershipPlans();
        if (readingToken()) {
          const status = await account.membership();
          this.subscription = status.subscription;
          this.quote = status.upgrade_quote;
          this.balance = Number(status.log_balance || 0);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async toggleRenew() {
      if (this.busy) return;
      const accountToken = readingToken();
      const enabled = !this.subscription.auto_renew;
      try {
        await this.$confirm(
          enabled
            ? this.$t("到期将自动扣除 {p0} 原木续费。", {
                p0: this.subscription.renewal_cost_log || this.subscription.cost_log,
              })
            : this.$t("当前权益保留至到期日，之后不再自动扣除原木。"),
          enabled ? this.$t("开启自动续费") : this.$t("关闭自动续费")
        );
        if (readingToken() !== accountToken) {
          this.$message.info(this.$t("账号已切换，请刷新后重试"));
          return;
        }
        this.busy = true;
        const result = await account.autoRenew(enabled);
        this.subscription = result.subscription;
        this.$message.success(this.$t("自动续费设置已更新"));
      } catch (error) {
        if (error instanceof Error) this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async purchase(tier) {
      if (this.busy) return;
      const accountToken = readingToken();
      if (!readingToken()) {
        this.$router.push({
          path: "/login",
          query: { redirect: "/membership" },
        });
        return;
      }
      const upgrade =
        this.subscription &&
        this.subscription.membership_type === "standard" &&
        tier.key === "super";
      if (upgrade && !this.quote) {
        this.$message.error(this.$t("升级报价暂不可用，请刷新后重试"));
        return;
      }
      const cycle = upgrade ? this.subscription.billing_cycle : this.selected[tier.key];
      const plan = tier.plans.find((item) => item.billing_cycle === cycle);
      const cost = upgrade ? this.quote.cost_log : plan.cost_log;
      const renew = upgrade ? !!this.subscription.auto_renew : cycle === "monthly";
      try {
        await this.$confirm(
          this.$t("将扣除 {p0} 原木{p1}。", {
            p0: cost,
            p1: upgrade ? "，升级后到期日不变" : renew ? "，并开启自动续费" : "",
          }),
          upgrade ? this.$t("补差价升级") : this.$t("开通{p0}", { p0: tier.name }),
          { confirmButtonText: this.$t("确认开通"), cancelButtonText: this.$t("取消") }
        );
        if (readingToken() !== accountToken) {
          this.$message.info(this.$t("账号已切换，请刷新后重试"));
          return;
        }
        this.busy = true;
        this.activeTier = tier.key;
        const key = `${tier.key}:${cycle}`;
        if (!this.pendingIds[key])
          this.pendingIds[key] = accountRequestId(upgrade ? "upgrade" : "subscribe");
        const result = await account.subscribe({
          membership_type: tier.key,
          billing_cycle: cycle,
          auto_renew: renew,
          client_request_id: this.pendingIds[key],
        });
        delete this.pendingIds[key];
        this.subscription = result.subscription;
        this.balance = Number(result.log_balance || 0);
        this.quote = null;
        this.$message.success(this.$t("通行证已生效"));
        await this.load();
      } catch (error) {
        if (error instanceof Error) this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "原木通行证 - 原木社区" }),
};
</script>
<style scoped>
.pass-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.pass-card {
  border: 1px solid #d9c6a5;
  background: linear-gradient(145deg, #fbf5e9, var(--surface, #fffdf9));
  border-radius: 16px;
  padding: 28px;
}
.pass-card.super {
  border-color: #a7bcc2;
  background: linear-gradient(145deg, #eaf1f2, var(--surface, #fffdf9));
}
.pass-heading {
  display: flex;
  gap: 16px;
  align-items: center;
}
.pass-heading img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  image-rendering: pixelated;
}
.pass-heading span {
  font-size: 12px;
  color: var(--wood, #947358);
}
.pass-heading h2 {
  font-size: 21px;
  margin: 6px 0;
}
.pass-summary {
  color: var(--muted, #82766c);
  font-size: 13px;
}
.pass-card ul {
  list-style: none;
  margin: 26px 0;
  padding: 0;
}
.pass-card li {
  display: flex;
  gap: 12px;
  margin: 22px 0;
}
.pass-card li i {
  color: var(--wood, #947358);
  font-size: 17px;
}
.pass-card li strong {
  font-size: 14px;
}
.pass-card li p {
  font-size: 12px;
  line-height: 1.8;
  color: var(--muted, #82766c);
  margin: 6px 0 0;
}
.pass-plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
.pass-plans button {
  padding: 16px 10px;
  background: var(--surface, #fffdf9);
  border: 1px solid #e0d5c5;
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  color: var(--ink, #382d25);
}
.pass-plans button.selected {
  border-color: var(--wood, #947358);
  background: #f1e6d6;
}
.pass-plans span {
  display: block;
  font-size: 11px;
  color: var(--muted, #82766c);
}
.pass-plans strong {
  display: block;
  font-size: 24px;
  margin: 10px 0;
}
.pass-plans small {
  font-size: 11px;
  font-weight: 400;
}
.pass-card > .el-button {
  width: 100%;
}
.pass-bottom {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-top: 24px;
  font-size: 13px;
  flex-wrap: wrap;
}
.pass-bottom span {
  margin-right: auto;
}
.pass-bottom a {
  color: var(--wood, #947358);
}
.membership-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.membership-status h2 {
  margin-bottom: 8px;
}
@media (max-width: 1024px) {
  .pass-grid {
    grid-template-columns: 1fr;
  }
}
</style>
