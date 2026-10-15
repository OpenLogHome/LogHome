<template>
  <Workspace :title="$t('兑换通行证')" active="/me"
    >
    <section class="social-panel">
      <el-form @submit.native.prevent="redeem" label-position="top"
        ><el-form-item :label="$t('兑换码')"
          ><el-input
            v-model="code"
            clearable
            maxlength="100"
            :placeholder="$t('请输入通行证兑换码')" /></el-form-item
        ><el-button
          type="primary"
          native-type="submit"
          :disabled="!code.trim()"
          :loading="busy"
          >{{ $t("验证并兑换") }}</el-button
        ></el-form
      >
      <p class="social-muted">
        {{
          $t(
            "每个兑换码只能使用一次，兑换后无法转移到其他账号。已有会员的时长将按兑换码规则顺延或升级。"
          )
        }}
      </p>
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
    </section>
    <section class="social-panel">
      <h2>{{ $t("兑换记录") }}</h2>
      <el-skeleton v-if="loading" :rows="4" animated />
      <div v-for="record in records" :key="record.redemption_id" class="social-list-row">
        <div class="row-main">
          <strong>{{
            $t("{p0} · {p1} 天", {
              p0:
                record.membership_type === "super"
                  ? $t("超级原木通行证")
                  : $t("原木通行证"),
              p1: record.duration_days,
            })
          }}</strong>
          <p>{{ record.code_hint }}<br />{{ accountDate(record.redeemed_at) }}</p>
        </div>
        <el-tag size="small">{{ $t("已兑换") }}</el-tag>
      </div>
      <p v-if="!loading && !records.length" class="social-muted">
        {{ $t("暂无兑换记录") }}
      </p>
      <el-button v-if="hasMore" :loading="loading" @click="load(true)">{{
        $t("加载更多")
      }}</el-button>
    </section></Workspace
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
    code: "",
    busy: false,
    loading: false,
    error: "",
    records: [],
    page: 1,
    hasMore: false,
  }),
  methods: {
    async load(more = false) {
      if (this.loading) return;
      this.loading = true;
      if (!more) {
        this.page = 1;
        this.records = [];
      }
      try {
        const result = await account.redeemHistory(this.page);
        this.records = [...this.records, ...result.list];
        this.page++;
        this.hasMore = this.records.length < result.total;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async redeem() {
      if (this.busy || !this.code.trim()) return;
      this.busy = true;
      this.error = "";
      try {
        await account.redeem(this.code.trim());
        this.code = "";
        this.$message.success(this.$t("通行证兑换成功"));
        await this.load();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "兑换通行证 - 原木社区" }),
};
</script>
