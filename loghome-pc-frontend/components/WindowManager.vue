<template>
  <div class="window-manager">
    <!-- 渲染所有窗口 -->
    <FloatingWindow
      v-for="window in windows"
      :key="window.id"
      :windowId="window.id"
      :title="window.title"
      :url="window.url"
    />
    
    <!-- 最小化窗口工具栏 -->
    <WindowMinimizedBar />
  </div>
</template>

<script>
import FloatingWindow from '~/components/FloatingWindow.vue'
import WindowMinimizedBar from '~/components/WindowMinimizedBar.vue'

export default {
  components: {
    FloatingWindow,
    WindowMinimizedBar
  },
  computed: {
    windows() {
      return this.$windowManager.getWindows()
    }
  }
}
</script>

<style scoped>
.window-manager {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 让事件穿透到下层内容 */
  z-index: 1000;
}

/* 窗口本身需要接收事件 */
.window-manager > * {
  pointer-events: auto;
}
</style> 