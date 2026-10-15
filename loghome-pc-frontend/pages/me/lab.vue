<template>
  <Workspace :title="$t('原木实验室')" active="/me"
    ><div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="5" animated />
    <div v-else class="social-card-grid">
      <nuxt-link
        v-for="entry in entries"
        :key="entry.id"
        :to="`/community/miniapp/${entry.miniappId}`"
        class="social-panel lab-entry"
        ><img :src="asset(entry.icon)" alt="" />
        <div>
          <h2>{{ entry.name }}</h2>
          <p>{{ entry.description }}</p>
          <span>{{ $t("进入实验室") }} <i class="el-icon-right" /></span></div
      ></nuxt-link>
    </div>
    <div v-if="!loading && !error && !entries.length" class="social-panel social-state">
      {{ $t("暂时没有开放的实验项目") }}
    </div></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account from "~/plugins/api/account";
export default {
  components: { Workspace },
  data: () => ({ entries: [], loading: true, error: "" }),
  mounted() {
    this.load();
  },
  methods: {
    asset(path) {
      return String(path || "").replace(/^\/static\//, "/social/");
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const entries = await account.lab();
        if (
          !Array.isArray(entries) ||
          entries.some(
            (item) =>
              !item || !item.miniappId || !/^[a-z][a-z0-9-]{0,63}$/.test(item.miniappId)
          )
        )
          throw new Error("实验室配置格式不正确");
        this.entries = entries;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
  head: () => ({ title: "原木实验室 - 原木社区" }),
};
</script>
<style scoped>
.lab-entry {
  display: flex;
  gap: 20px;
  color: var(--ink, #382d25);
  align-items: center;
  margin: 0;
}
.lab-entry img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  image-rendering: pixelated;
}
.lab-entry h2 {
  font-size: 20px;
  margin-bottom: 8px;
}
.lab-entry p {
  color: var(--muted, #82766c);
  line-height: 1.8;
  font-size: 13px;
}
.lab-entry span {
  color: var(--wood, #947358);
  font-size: 12px;
}
</style>
