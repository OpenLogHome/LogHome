<template>
  <div class="writer-page">
    <writer-startup v-if="!workspaceMounted" :error="startupError" @retry="prepareWorkspace" />
    <client-only>
      <component
        :is="workspaceComponent"
        v-if="workspaceComponent"
        ref="workspace"
        :key="$route.params.id"
        :work-id="Number($route.params.id)"
        @hook:mounted="workspaceReady"
      />
    </client-only>
  </div>
</template>
<script>
import WriterStartup from "~/components/write/WriterStartup.vue";
import { loadWriterWorkspace } from "~/utils/writer/workspace-loader";
export default {
  layout: "writer",
  components: { WriterStartup },
  data: () => ({ workspaceComponent: null, workspaceMounted: false, startupError: "" }),
  mounted() { this.prepareWorkspace(); },
  beforeDestroy() {
    this._startupVersion = (this._startupVersion || 0) + 1;
    clearTimeout(this._startupTimer);
  },
  methods: {
    async prepareWorkspace() {
      const version = (this._startupVersion || 0) + 1;
      this._startupVersion = version;
      this.startupError = "";
      clearTimeout(this._startupTimer);
      this._startupTimer = setTimeout(() => {
        if (version === this._startupVersion && !this.workspaceMounted)
          this.startupError = "资源加载时间较长，请检查网络后重试。";
      }, 30000);
      try {
        const workspace = await loadWriterWorkspace();
        if (version !== this._startupVersion) return;
        this.workspaceComponent = workspace.default || workspace;
      } catch (_) {
        if (version === this._startupVersion) {
          clearTimeout(this._startupTimer);
          this.startupError = "编辑器资源加载失败，请检查网络后重试。";
        }
      }
    },
    workspaceReady() {
      clearTimeout(this._startupTimer);
      this.workspaceMounted = true;
      this.startupError = "";
    },
  },
  head: () => ({
    title: "写作工作台 - 原木社区",
    htmlAttrs: { class: "writer-route-active" },
    bodyAttrs: { class: "writer-route-active" },
  }),
  async beforeRouteUpdate(to, from, next) {
    if (to.params.id === from.params.id) return next();
    try {
      const workspace = this.$refs.workspace;
      if (!workspace || (await workspace.leaveChapter())) {
        this.workspaceMounted = false;
        next();
      }
      else next(false);
    } catch (error) {
      this.$message.error(error.message);
      next(false);
    }
  },
  async beforeRouteLeave(to, from, next) {
    try {
      const workspace = this.$refs.workspace;
      if (!workspace || (await workspace.leaveChapter())) next();
      else next(false);
    } catch (error) {
      this.$message.error(error.message);
      next(false);
    }
  },
};
</script>
<style scoped>
.writer-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

</style>
<style>
/* Vue Meta removes this route-specific class when leaving the workbench. */
html.writer-route-active,
body.writer-route-active {
  overflow: hidden;
  scrollbar-gutter: auto;
}
</style>
