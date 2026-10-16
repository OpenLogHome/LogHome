<template>
  <button
    class="global-theme-switch"
    type="button"
    :aria-label="label"
    :title="label"
    :aria-pressed="dark"
    @click="$theme.toggle()"
  >
    <i :class="dark ? 'el-icon-sunny' : 'el-icon-moon'" aria-hidden="true" />
  </button>
</template>
<script>
export default {
  data: () => ({ ready: false }),
  mounted() { this.ready = true; },
  computed: {
    dark() {
      return this.ready && this.$theme.resolved === "dark";
    },
    label() {
      return this.$t(this.dark ? "切换日间模式" : "切换夜间模式");
    },
  },
};
</script>
<style scoped>
.global-theme-switch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e2e6eb;
  border-radius: 8px;
  background: #ffffff;
  color: #c65320;
  cursor: pointer;
  font-size: 16px;
}
.global-theme-switch:hover {
  background: #f1f3f5;
}
.global-theme-switch:focus-visible {
  outline: 2px solid #c65320;
  outline-offset: 3px;
}
html[data-site-theme="dark"] .global-theme-switch {
  color: #eee5d9;
  background: #29251f;
  border-color: #504536;
}
</style>
