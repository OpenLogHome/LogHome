<template>
  <Workspace :title="$t('存储管理')" active="/me/settings"
    ><section class="social-panel">
      <h2>{{ $t("浏览器存储") }}</h2>
      <p class="social-muted">
        {{
          usage === null
            ? $t("当前浏览器暂不支持容量统计")
            : $t("已使用约 {p0}，可用配额 {p1}", {
                p0: formatSize(usage),
                p1: formatSize(quota),
              })
        }}
      </p>
      <el-button :loading="loading" @click="load">{{ $t("刷新统计") }}</el-button>
    </section>
    <section class="social-panel">
      <h2>{{ $t("搜索记录") }}</h2>
      <p class="social-muted">{{ $t("当前设备保存的社区搜索和全站搜索历史。") }}</p>
      <el-button :disabled="busy" @click="clearSearch">{{
        $t("清空搜索历史")
      }}</el-button>
    </section>
    <section class="social-panel">
      <h2>{{ $t("文本纠错缓存") }}</h2>
      <p class="social-muted">
        {{ $t("清理标准纠错和智能纠错的缓存结果，下次使用时重新计算。忽略词条将保留。") }}
      </p>
      <el-button :loading="busy" @click="clearCorrections">{{
        $t("清理纠错缓存")
      }}</el-button>
    </section>
    <section class="social-panel">
      <h2>{{ $t("创作数据") }}</h2>
      <p class="social-muted">
        {{
          $t("作品本地备份与离线协作内容由创作中心管理。请在对应作品中导出备份后处理。")
        }}
      </p>
      <nuxt-link to="/write">{{ $t("打开创作中心 →") }}</nuxt-link>
    </section></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
export default {
  components: { Workspace },
  data: () => ({ usage: null, quota: 0, loading: false, busy: false }),
  mounted() {
    this.load();
  },
  methods: {
    formatSize(value) {
      return `${(Number(value || 0) / 1024 / 1024).toFixed(2)} MB`;
    },
    async load() {
      this.loading = true;
      try {
        if (navigator.storage && navigator.storage.estimate) {
          const result = await navigator.storage.estimate();
          this.usage = result.usage;
          this.quota = result.quota;
        }
      } catch (error) {
        this.$message.error(this.$t("容量统计暂不可用"));
      } finally {
        this.loading = false;
      }
    },
    async clearSearch() {
      try {
        await this.$confirm(
          this.$t("确定清空当前设备的搜索历史？"),
          this.$t("清空搜索历史")
        );
        ["community.search.history", "searchHistory"].forEach((key) =>
          localStorage.removeItem(key)
        );
        this.$message.success(this.$t("搜索历史已清空"));
        this.load();
      } catch (_) {}
    },
    async clearCorrections() {
      if (this.busy) return;
      try {
        await this.$confirm(
          this.$t("确定清理可重新生成的纠错缓存？忽略词条和作品内容会保留。"),
          this.$t("清理纠错缓存")
        );
        this.busy = true;
        const { textCorrectionDB } = await import("~/utils/writer/db");
        await textCorrectionDB.transaction(
          "rw",
          textCorrectionDB.standardCache,
          textCorrectionDB.smartCache,
          async () => {
            await textCorrectionDB.standardCache.clear();
            await textCorrectionDB.smartCache.clear();
          }
        );
        this.$message.success(this.$t("纠错缓存已清理"));
        await this.load();
      } catch (error) {
        if (error instanceof Error) this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "存储管理 - 原木社区" }),
};
</script>
