<template>
  <section
    class="writer-panel"
    :aria-label="title"
    :aria-busy="String(loading || busy)"
  >
    <header class="writer-panel-header">
      <div class="panel-heading">
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="panel-header-actions">
        <slot name="actions" />
        <button
          v-if="refreshable"
          class="panel-icon-button"
          :disabled="loading || busy"
          aria-label="刷新工具数据"
          title="刷新"
          @click="$emit('refresh')"
        >
          <i
            aria-hidden="true"
            :class="loading ? 'el-icon-loading' : 'el-icon-refresh'"
          />
        </button>
        <button
          class="panel-icon-button"
          aria-label="关闭工具面板"
          title="关闭面板"
          @click="$emit('close')"
        >
          <i aria-hidden="true" class="el-icon-close" />
        </button>
      </div>
    </header>
    <div class="writer-panel-body" :class="{ 'panel-body-flex': !scrollable }">
      <div v-if="loading" class="panel-loading" role="status">
        <i aria-hidden="true" class="el-icon-loading" />
        <p>正在加载…</p>
        <div class="panel-skeleton" />
        <div class="panel-skeleton short" />
      </div>
      <div v-else-if="error" class="panel-error" role="alert">
        <i aria-hidden="true" class="el-icon-warning-outline" /><strong
          >暂时无法加载</strong
        >
        <p>{{ error }}</p>
        <button class="secondary" @click="$emit('refresh')">重试</button>
      </div>
      <slot v-else />
    </div>
    <footer v-if="$slots.footer" class="writer-panel-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
<script>
export default {
  props: {
    title: String,
    subtitle: String,
    loading: Boolean,
    busy: Boolean,
    error: String,
    refreshable: Boolean,
    scrollable: { type: Boolean, default: true },
  },
};
</script>
