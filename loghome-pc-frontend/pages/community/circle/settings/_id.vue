<template><CircleEditor ref="editor" :id="$route.params.id" /></template>
<script>
import CircleEditor from "~/components/social/CircleEditor.vue";
export default {
  components: { CircleEditor },
  beforeRouteLeave(to, from, next) {
    this.$refs.editor.confirmLeave(next);
  },
  head: () => ({ title: "圈子设置 - 原木社区" }),
};
</script>
