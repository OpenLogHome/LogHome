<template>
  <div class="writer-page">
    <client-only
      ><writer-workspace
        ref="workspace"
        :key="$route.params.id"
        :work-id="Number($route.params.id)"
      />
      <div slot="placeholder" class="writer-loading">
        正在准备写作工作台…
      </div></client-only
    >
  </div>
</template>
<script>
export default {
  layout: "empty",
  components: {
    // client-only hides SSR output, but static imports still execute on the server.
    WriterWorkspace: process.client
      ? () => import("~/components/write/WriterWorkspace.vue")
      : { render: (h) => h() },
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
      if (!workspace || (await workspace.leaveChapter())) next();
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
.writer-loading {
  display: grid;
  place-items: center;
  min-height: 100vh;
  color: #72716c;
  background: #f7f6f3;
}
</style>
<style>
/* Vue Meta removes this route-specific class when leaving the workbench. */
html.writer-route-active,
body.writer-route-active {
  overflow: hidden;
}
</style>
