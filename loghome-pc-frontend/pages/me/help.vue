<template>
  <Workspace :title="$t('帮助与反馈')" active="/me"
    ><div class="social-tabs">
      <button :class="{ active: tab === 'faq' }" @click="tab = 'faq'">
        {{ $t("常见问题") }}</button
      ><button :class="{ active: tab === 'feedback' }" @click="tab = 'feedback'">
        {{ $t("提交反馈与记录") }}
      </button>
    </div>
    <div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" /><el-button
        @click="load"
        >{{ $t("重新加载") }}</el-button
      >
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="5" animated />
    <section v-else-if="tab === 'faq'" class="social-panel">
      <el-input
        v-model="keyword"
        clearable
        prefix-icon="el-icon-search"
        :placeholder="$t('搜索常见问题')"
        :aria-label="$t('搜索常见问题')"
      /><el-collapse class="faq-list"
        ><el-collapse-item
          v-for="faq in filtered"
          :key="faq.faq_id"
          :title="faq.faq_title"
          :name="faq.faq_id"
          ><p>{{ faq.faq_content }}</p>
          <h4>{{ $t("客服答复") }}</h4>
          <p>{{ faq.answer }}</p></el-collapse-item
        ></el-collapse
      >
      <p v-if="!filtered.length" class="social-muted">
        {{ $t("没有找到相关问题，可以提交反馈。") }}
      </p>
    </section>
    <template v-else
      ><section class="social-panel">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.native.prevent="submit"
          ><el-form-item :label="$t('标题')" prop="faq_title"
            ><el-input
              v-model="form.faq_title"
              maxlength="20"
              show-word-limit
              :placeholder="$t('简要描述问题')" /></el-form-item
          ><el-form-item :label="$t('问题描述')" prop="faq_content"
            ><el-input
              v-model="form.faq_content"
              type="textarea"
              :rows="5"
              maxlength="500"
              show-word-limit
              :placeholder="$t('请描述发生步骤、预期结果和实际情况')" /></el-form-item
          ><el-button type="primary" native-type="submit" :loading="submitting">{{
            $t("提交反馈")
          }}</el-button></el-form
        >
      </section>
      <section class="social-panel">
        <h2>{{ $t("反馈历史") }}</h2>
        <el-collapse
          ><el-collapse-item
            v-for="record in records"
            :key="record.faq_id"
            :name="record.faq_id"
            ><template #title
              >{{ record.faq_title }}
              <el-tag size="mini" :type="record.solved ? 'success' : 'info'">{{
                record.solved ? $t("已解决") : $t("待回复")
              }}</el-tag></template
            >
            <p>{{ record.faq_content }}</p>
            <p class="social-muted">
              {{ $t("提交于 {p0}", { p0: accountDate(record.create_time) }) }}
            </p>
            <h4>{{ $t("客服答复") }}</h4>
            <p>
              {{ record.answer || $t("问题已提交，客服正在处理。") }}
            </p></el-collapse-item
          ></el-collapse
        >
        <p v-if="!records.length" class="social-muted">{{ $t("暂无反馈记录") }}</p>
      </section></template
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account from "~/plugins/api/account";
import { socialRequest } from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace },
  mixins: [accountPage],
  requiresAuth: false,
  data: () => ({
    faqs: [],
    records: [],
    tab: "faq",
    keyword: "",
    loading: true,
    error: "",
    submitting: false,
    form: { faq_title: "", faq_content: "" },
    rules: {
      faq_title: [{ required: true, whitespace: true, message: "请输入标题" }],
      faq_content: [{ required: true, whitespace: true, message: "请描述遇到的问题" }],
    },
  }),
  computed: {
    filtered() {
      return this.faqs.filter((item) =>
        `${item.faq_title} ${item.faq_content} ${item.answer}`.includes(
          this.keyword.trim()
        )
      );
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const [typical, newest, records] = await Promise.all([
          account.faqs(),
          account.newestFaqs(),
          readingToken()
            ? socialRequest("/app/get_my_faqs", {}, "GET", null, true)
            : Promise.resolve([]),
        ]);
        const map = new Map();
        [...typical, ...newest].forEach((item) => map.set(item.faq_id, item));
        this.faqs = [...map.values()];
        this.records = records;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    submit() {
      if (this.submitting) return;
      if (!readingToken()) {
        this.$router.push({ path: "/login", query: { redirect: "/me/help" } });
        return;
      }
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          await account.feedback(this.form);
          this.form = { faq_title: "", faq_content: "" };
          this.$message.success(this.$t("反馈已提交"));
          await this.load();
        } catch (error) {
          this.$message.error(error.message);
        } finally {
          this.submitting = false;
        }
      });
    },
  },
  head: () => ({ title: "帮助与反馈 - 原木社区" }),
};
</script>
<style scoped>
.faq-list {
  margin-top: 24px;
}
.el-collapse-item p {
  white-space: pre-line;
  line-height: 1.9;
}
.el-tag {
  margin-left: 12px;
}
</style>
