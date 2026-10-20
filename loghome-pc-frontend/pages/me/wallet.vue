<template>
  <Workspace :title="$t('原木钱包')" active="/me"
    ><template #actions
      ><el-button icon="el-icon-refresh" :loading="loading" @click="load">{{
        $t("刷新")
      }}</el-button></template
    >
    <section class="social-panel wallet-balances">
      <div>
        <span>{{ $t("原木余额") }}</span
        ><strong>{{ balances.log === undefined ? $t("暂不可用") : balances.log }}</strong>
      </div>
      <div>
        <span>{{ $t("去皮原木") }}</span
        ><strong>{{
          balances.cropped_log === undefined ? $t("暂不可用") : balances.cropped_log
        }}</strong>
      </div>
      <div>
        <span>{{ $t("可提现收益") }}</span
        ><strong
          >{{ earnings }} <small>{{ $t("元") }}</small></strong
        >
      </div>
    </section>
    <div class="social-tabs">
      <button
        v-for="item in tabs"
        :key="item.key"
        :class="{ active: tab === item.key }"
        @click="selectTab(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
    <div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" />
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="5" animated /><template v-else
      ><section v-if="tab === 'recharge'" class="social-panel">
        <h2>{{ $t("充值原木") }}</h2>
        <div class="recharge-plans">
          <button
            v-for="(item, index) in plans"
            :key="item.log"
            :class="{ selected: planIndex === index }"
            @click="planIndex = index"
          >
            <strong>{{ item.log }}</strong
            ><span>{{ $t("原木") }}</span
            ><b>¥ {{ item.money }}</b>
          </button>
        </div>
        <p class="social-muted">
          {{
            $t(
              "你的充值将用于社区维护与运营。确认订单后前往支付页面，支付结果以订单状态为准。"
            )
          }}
        </p>
        <el-button type="primary" :loading="busy" @click="createOrder">{{
          $t("创建订单并支付")
        }}</el-button>
        <p class="social-muted">
          {{ $t("支付过程中遇到问题，请在帮助与反馈中联系我们。") }}
        </p>
      </section>
      <section v-else-if="tab === 'orders'" class="social-panel">
        <h2>{{ $t("充值订单") }}</h2>
        <div v-for="order in orders" :key="order.payment_id" class="wallet-order">
          <div class="social-toolbar">
            <strong
              >{{ $t("{p0} 原木", { p0: order.log_amount })
              }}<span>¥ {{ order.pay_amount }}</span></strong
            ><el-tag size="small" :type="order.status === 'paid' ? 'success' : 'info'">{{
              status(order.status)
            }}</el-tag>
          </div>
          <p class="social-muted">
            {{ $t("订单号 {p0}", { p0: order.payment_id }) }}<br />{{
              $t("创建于 {p0}", { p0: accountDate(order.create_time) })
            }}
          </p>
          <el-button size="small" :disabled="busy" @click="checkOrder(order)">{{
            $t("刷新状态")
          }}</el-button
          ><template v-if="order.status === 'created'"
            ><el-button
              type="primary"
              size="small"
              :disabled="busy"
              @click="payOrder(order)"
              >{{ $t("继续支付") }}</el-button
            ><el-button size="small" :disabled="busy" @click="cancelOrder(order)">{{
              $t("取消订单")
            }}</el-button></template
          >
        </div>
        <p v-if="!orders.length" class="social-muted">{{ $t("暂无充值订单") }}</p>
        <el-button v-if="hasMore" :loading="loadingOrders" @click="loadOrders(true)">{{
          $t("加载更多")
        }}</el-button>
      </section>
      <section v-else-if="tab === 'exchange'" class="social-panel">
        <h2>{{ $t("去皮原木兑换") }}</h2>
        <el-form label-position="top" @submit.native.prevent="exchange"
          ><el-form-item :label="$t('兑换数量')"
            ><el-input-number
              v-model="amount"
              :min="1"
              :max="Number(balances.cropped_log) || 1"
              :precision="0"
          /></el-form-item>
          <p class="social-muted">
            {{
              $t(
                "1 去皮原木 = 1.25\n          原木，小数部分舍去。去皮原木可用于提现，兑换后不可逆。"
              )
            }}
          </p>
          <p>
            {{ $t("预计获得") }}
            <strong>{{ Math.floor((amount || 0) * 1.25) }}</strong> {{ $t("原木") }}
          </p>
          <el-button
            type="primary"
            native-type="submit"
            :loading="busy"
            :disabled="!amount || amount > Number(balances.cropped_log)"
            >{{ $t("确认兑换") }}</el-button
          ></el-form
        >
      </section>
      <section v-else-if="tab === 'gift'" class="social-panel">
        <h2>{{ $t("兑换原木礼品卡") }}</h2>
        <form class="wallet-form" @submit.prevent="redeem">
          <el-input
            v-model="code"
            clearable
            maxlength="100"
            :placeholder="$t('请输入原木礼品卡兑换码')"
            :aria-label="$t('原木礼品卡兑换码')"
          /><el-button
            type="primary"
            native-type="submit"
            :loading="busy"
            :disabled="!code.trim()"
            >{{ $t("兑换原木") }}</el-button
          >
        </form>
        <p class="social-muted">
          {{ $t("兑换成功后原木将直接计入余额，每张礼品卡只能使用一次。") }}
        </p>
      </section>
      <template v-else
        ><section class="social-panel">
          <h2>{{ $t("余额提现") }}</h2>
          <el-form label-position="top" @submit.native.prevent="withdraw"
            ><el-form-item :label="$t('提现金额（元）')"
              ><el-input-number
                v-model="withdrawAmount"
                :min="0.11"
                :max="Number(earnings) || 0.11"
                :precision="2" /></el-form-item
            ><el-form-item :label="$t('用于收款的微信号')"
              ><el-input
                v-model="wechat"
                maxlength="50"
                :placeholder="$t('请输入微信号')" /></el-form-item
            ><el-button
              type="primary"
              native-type="submit"
              :loading="busy"
              :disabled="!wechat.trim() || Number(earnings) < 0.11"
              >{{ $t("申请提现") }}</el-button
            ></el-form
          >
          <p class="social-muted">
            {{ $t("提现申请提交后，请保持微信畅通。最低提现金额 0.11 元。") }}
          </p>
        </section>
        <section class="social-panel">
          <h2>{{ $t("提现记录") }}</h2>
          <div
            v-for="(record, index) in withdrawalRecords"
            :key="record.id || index"
            class="social-list-row"
          >
            <div class="row-main">
              <strong>{{ $t("{p0} 元", { p0: record.money_amount }) }}</strong>
              <p>
                {{ record.wechat }}<br />{{
                  accountDate(record.time || record.create_time)
                }}
              </p>
            </div>
            <span>{{ record.finished === 1 ? $t("已处理") : $t("处理中") }}</span>
          </div>
          <p v-if="!withdrawalRecords.length" class="social-muted">
            {{ $t("暂无提现记录") }}
          </p>
        </section></template
      ></template
    ><el-dialog
      :title="$t('前往支付')"
      :visible.sync="payVisible"
      width="min(520px, 92vw)"
      ><p>{{ $t("订单已创建，请在支付页面完成付款，再回来查询到账状态。") }}</p>
      <a :href="payUrl" target="_blank" rel="noopener noreferrer"
        ><el-button type="primary">{{ $t("打开支付页面") }}</el-button></a
      ><el-button :loading="busy" @click="paid">{{
        $t("我已完成支付，查询结果")
      }}</el-button>
      <p class="social-muted">
        {{ $t("订单号 {p0}", { p0: pendingOrder && pendingOrder.payment_id }) }}
      </p></el-dialog
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account from "~/plugins/api/account";
import { socialRequest } from "~/plugins/api/social";
import accountPage from "~/mixins/account-page";
const request = (path, params = {}, method = "GET", body) =>
  socialRequest(`/payment/${path}`, params, method, body, true);
export default {
  components: { Workspace },
  mixins: [accountPage],
  data: () => ({
    balances: {},
    tab: "recharge",
    tabs: [
      { key: "recharge", label: "原木充值" },
      { key: "orders", label: "充值订单" },
      { key: "exchange", label: "去皮原木兑换" },
      { key: "gift", label: "礼品卡兑换" },
      { key: "earnings", label: "收益与提现" },
    ],
    plans: [
      { log: 300, money: 3 },
      { log: 520, money: 5 },
      { log: 1725, money: 15 },
      { log: 3840, money: 32 },
      { log: 8840, money: 68 },
    ],
    planIndex: 0,
    loading: true,
    error: "",
    busy: false,
    orders: [],
    ordersPage: 1,
    hasMore: false,
    loadingOrders: false,
    amount: 1,
    code: "",
    wechat: "",
    withdrawAmount: 0.11,
    withdrawalRecords: [],
    payVisible: false,
    payUrl: "",
    pendingOrder: null,
  }),
  computed: {
    earnings() {
      return (Number(this.balances.cropped_log || 0) / 100).toFixed(2);
    },
  },
  methods: {
    status(value) {
      return (
        {
          created: "待支付",
          paid: "已支付",
          cancelled: "已取消",
          expired: "已过期",
        }[value] || value
      );
    },
    async load() {
      this.loading = true;
      this.error = "";
      if (this.tabs.some((item) => item.key === this.$route.query.tab))
        this.tab = this.$route.query.tab;
      try {
        this.balances = await account.balances();
        await this.loadTab();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async selectTab(tab) {
      this.tab = tab;
      this.error = "";
      this.$router.replace({ query: { tab } }).catch(() => {});
      try {
        await this.loadTab();
      } catch (error) {
        this.error = error.message;
      }
    },
    async loadTab() {
      if (this.tab === "orders") await this.loadOrders();
      if (this.tab === "earnings")
        this.withdrawalRecords = await request("get_earning_service_records");
    },
    async loadOrders(more = false) {
      if (this.loadingOrders) return;
      this.loadingOrders = true;
      try {
        if (!more) {
          this.ordersPage = 1;
          this.orders = [];
        }
        const result = await request("order_history", {
          page: this.ordersPage,
          pageSize: 12,
        });
        this.orders = [...this.orders, ...result.data.list];
        this.ordersPage++;
        this.hasMore = this.orders.length < result.data.total;
      } finally {
        this.loadingOrders = false;
      }
    },
    async createOrder() {
      if (this.busy) return;
      const plan = this.plans[this.planIndex];
      if (
        !(await this.confirmAction(
          `购买 ${plan.log} 原木，支付金额 ¥${plan.money}。`,
          "确认充值订单"
        ))
      )
        return;
      this.busy = true;
      try {
        const result = await request("create_order", {}, "POST", {
          log_amount: plan.log,
          pay_amount: plan.money,
        });
        this.pendingOrder = result.data;
        await this.openPayment(this.pendingOrder);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
    async openPayment(order) {
      const result = await request("get_payment_url", {
        money: order.pay_amount,
        log: order.log_amount,
        payment_id: order.payment_id,
      });
      const url = new URL(result);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error("支付链接无效");
      this.payUrl = url.href;
      this.pendingOrder = order;
      this.payVisible = true;
    },
    async payOrder(order) {
      if (this.busy) return;
      this.busy = true;
      try {
        await this.openPayment(order);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
    async checkOrder(order) {
      if (this.busy) return;
      this.busy = true;
      try {
        const result = await request("order_status", {
          payment_id: order.payment_id,
        });
        Object.assign(order, result.data);
        this.$message.success(
          order.status === "paid"
            ? this.$t("支付成功，原木已到账")
            : this.$t("订单状态已更新")
        );
        this.balances = await account.balances();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
    async paid() {
      if (!this.pendingOrder) return;
      await this.checkOrder(this.pendingOrder);
      if (this.pendingOrder.status === "paid") {
        this.payVisible = false;
        this.selectTab("orders");
      }
    },
    async cancelOrder(order) {
      if (this.busy || !(await this.confirmAction("确定取消此充值订单？", "取消订单")))
        return;
      this.busy = true;
      try {
        await request("cancel_order", {}, "POST", {
          payment_id: order.payment_id,
        });
        await this.loadOrders();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
    async exchange() {
      if (
        this.busy ||
        !Number.isInteger(this.amount) ||
        this.amount < 1 ||
        this.amount > Number(this.balances.cropped_log)
      )
        return;
      if (
        !(await this.confirmAction(
          `使用 ${this.amount} 去皮原木兑换 ${Math.floor(
            this.amount * 1.25
          )} 原木，兑换后不可逆。`,
          "确认兑换"
        ))
      )
        return;
      await this.mutate("exchange_logs", { cropped_log_amount: this.amount });
    },
    async redeem() {
      if (this.busy || !this.code.trim()) return;
      await this.mutate("redeem_gift_card", { card_code: this.code.trim() });
      if (!this.error) this.code = "";
    },
    async mutate(path, body) {
      this.busy = true;
      this.error = "";
      try {
        await request(path, {}, "POST", body);
        this.balances = await account.balances();
        this.$message.success(this.$t("操作成功"));
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
    async withdraw() {
      if (
        this.busy ||
        !this.wechat.trim() ||
        this.withdrawAmount < 0.11 ||
        this.withdrawAmount > Number(this.earnings)
      )
        return;
      if (
        !(await this.confirmAction(
          `提现 ${this.withdrawAmount} 元至微信 ${this.wechat.trim()}。`,
          "确认提现"
        ))
      )
        return;
      this.busy = true;
      this.error = "";
      try {
        await request("request_earning_service", {
          money_amount: this.withdrawAmount,
          wechat: this.wechat.trim(),
        });
        this.$message.success(this.$t("提现申请已提交，请保持微信畅通"));
        this.balances = await account.balances();
        this.withdrawalRecords = await request("get_earning_service_records");
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "原木钱包 - 原木社区" }),
};
</script>
<style scoped>
.wallet-balances {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 24px;
}
.wallet-balances span {
  font-size: 12px;
  color: var(--muted, #82766c);
}
.wallet-balances strong {
  display: block;
  font-size: 30px;
  font-weight: 500;
  margin-top: 12px;
  font-variant-numeric: tabular-nums;
}
.wallet-balances small {
  font-size: 12px;
}
.recharge-plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
  margin: 24px 0;
}
.recharge-plans button {
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 12px;
  background: var(--surface, #fffdf9);
  color: var(--ink, #382d25);
  cursor: pointer;
}
.social-workspace .recharge-plans button.selected {
  border-color: var(--wood, #947358);
  background: var(--selection-bg, #f6e9dc);
  box-shadow: inset 0 0 0 1px var(--wood, #947358);
}
.recharge-plans strong {
  font-size: 24px;
  font-weight: 500;
}
.recharge-plans span {
  font-size: 11px;
  color: var(--muted, #82766c);
}
.recharge-plans b {
  font-size: 17px;
  margin-top: 12px;
  font-weight: 500;
}
.wallet-order {
  padding: 18px 0;
  border-bottom: 1px solid var(--line, #e9e0d5);
}
.wallet-order:last-child {
  border: 0;
}
.wallet-order .social-toolbar {
  margin-bottom: 8px;
}
.wallet-order .social-toolbar span {
  color: var(--wood, #947358);
  margin-left: 12px;
}
.wallet-form {
  display: flex;
  gap: 12px;
}
.wallet-form .el-input {
  max-width: 500px;
}
.el-form {
  max-width: 600px;
}
@media (max-width: 600px) {
  .wallet-balances {
    grid-template-columns: 1fr;
  }
  .wallet-form {
    flex-wrap: wrap;
  }
}
</style>
