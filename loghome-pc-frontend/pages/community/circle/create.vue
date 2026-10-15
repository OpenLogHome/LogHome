<template><CircleEditor ref="editor" /></template>
<script>
import CircleEditor from "~/components/social/CircleEditor.vue";
export default {
  components: { CircleEditor },
  beforeRouteLeave(to, from, next) {
    this.$refs.editor.confirmLeave(next);
  },
  head: () => ({ title: "创建圈子 - 原木社区" }),
};
</script>
