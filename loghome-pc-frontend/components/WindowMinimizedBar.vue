<template>
  <div class="minimized-bar" v-if="hasMinimizedWindows">
    <transition-group name="minimize-animation">
      <div 
        v-for="window in minimizedWindows"
        :key="window.id"
        class="minimized-window"
        :title="window.title"
        @click="restoreWindow(window.id)"
      >
        <i class="el-icon-document"></i>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  computed: {
    minimizedWindows() {
      return this.$windowManager.getMinimizedWindows()
    },
    hasMinimizedWindows() {
      return this.minimizedWindows.length > 0
    }
  },
  methods: {
    restoreWindow(id) {
      this.$windowManager.restoreWindow(id)
    }
  }
}
</script>

<style scoped>
.minimized-bar {
  position: fixed;
  left: 20px;
  bottom: 20px;
  display: flex;
  gap: 10px;
  z-index: 9999;
}

.minimized-window {
  width: 40px;
  height: 40px;
  background-color: #947358;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: minimized-pulse 2s infinite alternate ease-in-out;
}

.minimized-window:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: none;
}

/* 动画效果 */
.minimize-animation-enter-active,
.minimize-animation-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.minimize-animation-enter,
.minimize-animation-leave-to {
  opacity: 0;
  transform: scale(0.1);
}

.minimize-animation-move {
  transition: transform 0.3s;
}

/* 脉动动画更柔和 */
@keyframes minimized-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
}
</style> 