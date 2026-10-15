<template>
  <Workspace :title="$t('商城订单')" active="/me"
    ><template #actions
      ><nuxt-link to="/store"
        ><el-button>{{ $t("继续逛商城") }}</el-button></nuxt-link
      ><el-button icon="el-icon-refresh" :loading="loading" @click="reset">{{
        $t("刷新")
      }}</el-button></template
    >
    <div class="social-tabs">
      <button
        v-for="item in tabs"
        :key="item.key"
        :class="{ active: status === item.key }"
        @click="changeStatus(item.key)"
      >
        {{ $t(item.label) }}
      </button>
    </div>
    <div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" /><el-button
        @click="load"
        >{{ $t("重试") }}</el-button
      >
    </div>
    <el-skeleton
      v-if="loading && !orders.length"
      class="social-panel"
      :rows="5"
      animated
    />
    <article v-for="order in orders" :key="order.id" class="social-panel store-order">
      <header>
        <span>{{ $t("订单号 {p0}", { p0: order.order_no }) }}</span
        ><el-tag size="small" :type="order.status === 'completed' ? 'success' : 'info'">{{
          $t(statusLabel(order.status))
        }}</el-tag>
      </header>
      <nuxt-link :to="`/store/${order.product_id}`" class="social-list-row"
        ><img :src="order.product_cover || '/social/icons/store.png'" alt="" />
        <div class="row-main">
          <strong>{{ order.product_title }}</strong>
          <p>{{ order.variant_label || order.shipping_desc }}</p>
        </div>
        <strong>{{ $t("{p0} 原木", { p0: order.price }) }}</strong></nuxt-link
      >
      <p class="social-muted">
        {{
          $t("支付 {p0} 去皮原木 + {p1} 原木", {
            p0: order.pay_cropped_log,
            p1: order.pay_log,
          })
        }}<br />{{ $t("下单时间 {p0}", { p0: accountDate(order.created_at) }) }}
      </p>
      <p v-if="order.product_type === 'physical'" class="social-muted">
        {{ order.receiver_name }} {{ order.receiver_phone }}<br />{{
          order.receiver_province
        }}{{ order.receiver_city }}{{ order.receiver_district
        }}{{ order.receiver_detail }}
      </p>
      <footer>
        <el-button
          v-if="order.product_type === 'physical'"
          size="small"
          @click="openLogistics(order)"
          >{{ $t("查看物流") }}</el-button
        ><el-button
          v-if="order.status === 'shipped'"
          type="primary"
          size="small"
          :disabled="busy"
          @click="confirm(order)"
          >{{ $t("确认收货") }}</el-button
        >
      </footer>
    </article>
    <div v-if="!loading && !error && !orders.length" class="social-panel social-state">
      <i class="el-icon-box" />{{ $t("暂无订单记录") }}<br /><nuxt-link to="/store">{{
        $t("去商城看看")
      }}</nuxt-link>
    </div>
    <div class="social-end" v-if="hasMore">
      <el-button :loading="loading" @click="load">{{ $t("加载更多") }}</el-button>
    </div>
    <el-dialog
      :title="$t('物流详情')"
      :visible.sync="logisticsVisible"
      width="min(650px, 94vw)"
      ><el-skeleton v-if="logisticsLoading" :rows="5" animated /><el-alert
        v-else-if="logisticsError"
        :title="logisticsError"
        type="error"
        :closable="false"
      /><template v-else-if="logistics"
        ><p class="social-muted">
          {{ logistics.order.shipping_company }}
          {{ logistics.order.tracking_number }}
        </p>
        <p>
          {{
            logistics.logistics.state_text ||
            logistics.logistics.message ||
            $t("发货后可查看物流动态")
          }}
        </p>
        <el-timeline
          v-if="logistics.logistics.events && logistics.logistics.events.length"
          ><el-timeline-item
            v-for="(event, index) in logistics.logistics.events"
            :key="index"
            :timestamp="event.time"
            >{{ event.context }}</el-timeline-item
          ></el-timeline
        >
        <p v-if="logistics.logistics.checked_at" class="social-muted">
          {{ $t("查询时间 {p0}", { p0: accountDate(logistics.logistics.checked_at) }) }}
        </p>
        <a
          v-if="tracking.queryUrl"
          :href="tracking.queryUrl"
          target="_blank"
          rel="noopener noreferrer"
          >{{ $t("快递查询 ↗") }}</a
        ><a
          v-if="tracking.officialUrl"
          :href="tracking.officialUrl"
          target="_blank"
          rel="noopener noreferrer"
          >{{ tracking.officialName }} ↗</a
        ></template
      ><template #footer
        ><el-button @click="logisticsVisible = false">{{ $t("关闭") }}</el-button
        ><el-button
          v-if="selectedOrder"
          :loading="logisticsLoading"
          @click="openLogistics(selectedOrder)"
          >{{ $t("刷新物流") }}</el-button
        ></template
      ></el-dialog
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import store from "~/plugins/api/store";
import accountPage from "~/mixins/account-page";
import { getTrackingLinks } from "~/utils/store-tracking-links";
export default {
  components: { Workspace },
  mixins: [accountPage],
  data: () => ({
    orders: [],
    status: "all",
    page: 1,
    loading: false,
    error: "",
    hasMore: true,
    busy: false,
    requestId: 0,
    tabs: [
      { key: "all", label: "全部订单" },
      { key: "pending", label: "待发货" },
      { key: "shipped", label: "已发货" },
      { key: "completed", label: "已完成" },
    ],
    logisticsVisible: false,
    logistics: null,
    logisticsLoading: false,
    logisticsError: "",
    selectedOrder: null,
    logisticsRequest: 0,
  }),
  computed: {
    tracking() {
      return this.logistics ? getTrackingLinks(this.logistics.order) : {};
    },
  },
  beforeDestroy() {
    this.requestId++;
    this.logisticsRequest++;
  },
  methods: {
    statusLabel(value) {
      return (
        { pending: "待发货", shipped: "已发货", completed: "已完成" }[value] || value
      );
    },
    changeStatus(status) {
      if (this.status === status) return;
      this.status = status;
      this.reset();
    },
    reset() {
      this.requestId++;
      this.loading = false;
      this.orders = [];
      this.page = 1;
      this.hasMore = true;
      this.load();
    },
    async load() {
      if (this.loading || !this.hasMore) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        const result = await store.orders({
          status: this.status,
          page: this.page,
          pageSize: 12,
        });
        if (request !== this.requestId) return;
        this.orders = [...this.orders, ...result.list];
        this.page++;
        this.hasMore = this.orders.length < result.total;
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    },
    async confirm(order) {
      if (
        this.busy ||
        !(await this.confirmAction("请确认已收到商品，确认后订单将完成。", "确认收货"))
      )
        return;
      this.busy = true;
      try {
        await store.confirm(order.id);
        this.$message.success(this.$t("已确认收货"));
        this.reset();
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async openLogistics(order) {
      const request = ++this.logisticsRequest;
      this.selectedOrder = order;
      this.logisticsVisible = true;
      this.logisticsLoading = true;
      this.logisticsError = "";
      this.logistics = null;
      try {
        const result = await store.logistics(order.id);
        if (request === this.logisticsRequest) this.logistics = result;
      } catch (error) {
        if (request === this.logisticsRequest) this.logisticsError = error.message;
      } finally {
        if (request === this.logisticsRequest) this.logisticsLoading = false;
      }
    },
  },
  head: () => ({ title: "商城订单 - 原木商城" }),
};
</script>
<style scoped>
.store-order header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--muted, #82766c);
  gap: 14px;
}
.store-order .social-list-row {
  border: 0;
  color: var(--ink, #382d25);
}
.store-order .social-list-row img {
  width: 80px;
  height: 80px;
}
.store-order footer {
  display: flex;
  justify-content: flex-end;
}
.el-timeline {
  margin: 24px 0;
  padding-left: 8px;
}
.el-dialog a {
  display: inline-block;
  margin: 12px 16px 0 0;
  color: var(--wood, #947358);
}
</style>
