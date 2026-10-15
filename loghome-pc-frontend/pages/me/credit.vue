<template>
  <Workspace :title="$t('我的信誉')" active="/me"
    ><div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="5" animated /><template
      v-else
      ><section class="social-panel credit-score">
        <i class="el-icon-circle-check" />
        <div>
          <span>{{ $t("当前信誉") }}</span
          ><strong>{{ credit.credit }}</strong>
        </div>
      </section>
      <section class="social-panel">
        <h2>{{ $t("信誉记录") }}</h2>
        <div
          v-for="(record, index) in credit.history"
          :key="record.credit_history_id || index"
          class="social-list-row"
        >
          <div class="row-main">
            <strong>{{ record.reason }}</strong>
            <p>{{ accountDate(record.time) }}</p>
          </div>
          <span :class="Number(record.delta) > 0 ? 'credit-positive' : 'credit-negative'"
            >{{ Number(record.delta) > 0 ? "+" : "" }}{{ record.delta }}</span
          >
        </div>
        <p v-if="!credit.history.length" class="social-muted">
          {{ $t("暂无信誉变更记录") }}
        </p>
      </section></template
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account from "~/plugins/api/account";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace },
  mixins: [accountPage],
  data: () => ({
    credit: { credit: 0, history: [] },
    loading: true,
    error: "",
  }),
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.credit = await account.credit();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
  head: () => ({ title: "我的信誉 - 原木社区" }),
};
</script>
<style scoped>
.credit-score {
  display: flex;
  align-items: center;
  gap: 24px;
}
.credit-score > i {
  font-size: 64px;
  color: var(--wood, #947358);
}
.credit-score span {
  display: block;
  font-size: 13px;
  color: var(--muted, #82766c);
}
.credit-score strong {
  font-size: 48px;
  font-weight: 500;
  line-height: 1.4;
}
.credit-positive {
  color: #61784e;
}
.credit-negative {
  color: #a54936;
}
</style>
