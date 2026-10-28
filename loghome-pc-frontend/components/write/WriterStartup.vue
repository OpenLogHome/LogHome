<template>
  <div class="writer-startup" :class="`theme-${theme}`" :aria-busy="!error">
    <div class="startup-content" :role="error ? 'alert' : 'status'" aria-live="polite">
      <span v-if="!error" class="startup-spinner" aria-hidden="true" />
      <h1>{{ error ? $t('工作台暂时未能打开') : $t('正在准备写作工作台…') }}</h1>
      <p>{{ error || $t('正在加载编辑器资源，加载完成后即可开始创作。') }}</p>
      <div class="startup-actions">
        <button v-if="error" @click="$emit('retry')">{{ $t('重新加载') }}</button>
        <a href="/write">{{ $t('返回创作中心') }}</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: { error: { type: String, default: '' } },
  data: () => ({ theme: 'system' }),
  mounted() {
    try {
      const value = JSON.parse(localStorage.getItem('loghome:writer:preferences') || '{}').theme;
      if (['light', 'dark', 'sepia'].includes(value)) this.theme = value;
    } catch (_) {}
  },
};
</script>
<style scoped>
.writer-startup { --startup-bg: #f7f6f3; --startup-text: #37352f; --startup-muted: #65645f; --startup-accent: #216da0; position: absolute; inset: 0; z-index: 10; display: grid; place-items: center; padding: 28px; background: var(--startup-bg); color: var(--startup-text); font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; color-scheme: light; }
.theme-dark { --startup-bg: #202020; --startup-text: #e9e8e4; --startup-muted: #aaa9a3; --startup-accent: #79b9df; color-scheme: dark; }
.theme-sepia { --startup-bg: #fbf5e8; --startup-text: #514536; --startup-muted: #7e705e; }
@media (prefers-color-scheme: dark) { .theme-system { --startup-bg: #202020; --startup-text: #e9e8e4; --startup-muted: #aaa9a3; --startup-accent: #79b9df; color-scheme: dark; } }
.startup-content { max-width: 460px; text-align: center; }
h1 { font-size: 20px; font-weight: 600; margin: 20px 0 12px; }
p { color: var(--startup-muted); font-size: 14px; line-height: 1.8; margin: 0; }
.startup-spinner { display: inline-block; width: 30px; height: 30px; border: 3px solid var(--startup-muted); border-right-color: transparent; border-radius: 50%; animation: startup-spin 1s linear infinite; }
.startup-actions { display: flex; align-items: center; justify-content: center; gap: 24px; margin-top: 24px; }
a, button { color: var(--startup-accent); font: inherit; font-size: 14px; }
button { cursor: pointer; border: 1px solid currentColor; border-radius: 5px; background: transparent; padding: 9px 16px; }
a:focus-visible, button:focus-visible { outline: 2px solid var(--startup-accent); outline-offset: 4px; }
@keyframes startup-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .startup-spinner { animation: none; } }
</style>
