<template>
  <div class="writer-async-notice" :role="failed ? 'alert' : 'status'">
    <p>{{ failed ? '功能加载失败，请重新加载后再试。' : '正在加载…' }}</p>
    <button v-if="failed" @click="reload">重新加载页面</button>
  </div>
</template>
<script>
export default {
  props: { failed: Boolean },
  methods: { reload() { window.location.reload(); } },
};
</script>
<style scoped>
.writer-async-notice { flex: 1; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; color: var(--writer-muted, #65645f); background: var(--writer-panel, #fff); font-size: 14px; }
button { margin-top: 12px; cursor: pointer; }
</style>
