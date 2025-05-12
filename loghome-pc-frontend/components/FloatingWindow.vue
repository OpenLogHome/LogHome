<template>
  <transition 
    name="window-animation" 
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    appear
  >
    <div 
      v-show="!isMinimized"
      class="floating-window" 
      :class="{ 'is-closing': animateClosing }"
      :style="windowStyle"
      @mousedown="activateWindow"
    >
      <!-- 窗口标题栏 -->
      <div 
        class="window-header"
        :class="{ 'dragging': isDragging }"
        @mousedown="startDrag"
      >
        <div class="window-title">{{ title }}</div>
        <div class="window-controls">
          <button class="control-btn minimize-btn" @click.stop="minimizeWindow">
            <i class="el-icon-minus"></i>
          </button>
          <button class="control-btn close-btn" @click.stop="closeWindow">
            <i class="el-icon-close"></i>
          </button>
        </div>
      </div>
      
      <!-- 窗口内容 -->
      <div class="window-content">
        <iframe 
          v-if="url" 
          :src="url" 
          frameborder="0" 
          class="window-iframe"
        ></iframe>
        <slot v-else></slot>
        
        <!-- 拖动时的蒙版层，防止iframe捕获鼠标事件 -->
        <div 
          class="iframe-overlay" 
          v-show="isResizing || isDragging"
          :style="overlayStyle"
        ></div>
      </div>
      
      <!-- 调整大小的手柄 -->
      <div class="resize-handle resize-handle-right" @mousedown.stop="(e) => startResize('right', e)"></div>
      <div class="resize-handle resize-handle-bottom" @mousedown.stop="(e) => startResize('bottom', e)"></div>
      <div class="resize-handle resize-handle-corner" @mousedown.stop="(e) => startResize('corner', e)"></div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    windowId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '窗口'
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDragging: false,
      isResizing: false,
      resizeType: null,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      // 保存关闭/最小化前的位置和大小，用于恢复动画
      lastPosition: null,
      animating: false,
      animateClosing: false,
      isClosingProp: false
    }
  },
  computed: {
    window() {
      return this.$windowManager.getWindows().find(w => w.id === this.windowId) || {}
    },
    isMinimized() {
      return this.window.isMinimized || false
    },
    windowStyle() {
      const { x = 0, y = 0, width = 800, height = 600, zIndex = 1000 } = this.window
      return {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: zIndex
      }
    },
    // 蒙版层样式
    overlayStyle() {
      if (this.isResizing) {
        return {
          cursor: this.resizeType === 'right' ? 'e-resize' : 
                 this.resizeType === 'bottom' ? 's-resize' : 'se-resize'
        }
      } else if (this.isDragging) {
        return { cursor: 'move' }
      }
      return {}
    }
  },
  watch: {
    isMinimized(newValue, oldValue) {
      // 当窗口被最小化时，保存当前位置信息
      if (newValue && !oldValue) {
        this.saveWindowPosition();
      }
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    // 保存窗口位置信息
    saveWindowPosition() {
      const { x, y, width, height } = this.window;
      this.lastPosition = { x, y, width, height };
    },

    // 动画生命周期方法
    beforeEnter(el) {
      this.animating = true;
      
      // 如果是从最小化状态恢复
      if (this.lastPosition) {
        const minimizedBar = document.querySelector('.minimized-bar');
        if (minimizedBar) {
          // 从左下角飞入
          const startX = -this.window.x - this.window.width / 2;
          const startY = window.screen.height - this.window.y - this.window.height / 2;
          
          el.style.transform = `translate(${startX}px, ${startY}px) scale(1)`;
        }
      } else {
        // 新窗口打开效果
        el.style.opacity = '0';
        el.style.transform = 'scale(0.8)';
      }
    },
    
    enter(el, done) {
      // 使用requestAnimationFrame确保浏览器已经应用了初始样式
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translate(0, 0) scale(1)';
          
          setTimeout(() => {
            el.style.transition = '';
            this.animating = false;
            this.lastPosition = null;
            done();
          }, 300);
        });
      });
    },
    
    leave(el, done) {
      this.animating = true;
      
      // 保存当前位置以便后续恢复
      this.saveWindowPosition();
      
      // 获取最小化栏的位置
      const minimizedBar = document.querySelector('.minimized-bar');
      if (minimizedBar && this.isMinimized) {
        // 最小化动画 - 飞向左下角
        const targetX = - this.window.x - this.window.width / 2;
        const targetY = window.screen.height - this.window.y - this.window.height / 2;

        console.log(targetX, targetY)
        
        el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        el.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
      } else {
        // 关闭动画
        el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        el.style.transform = 'scale(0.8)';
        el.style.opacity = '0';
      }
      
      setTimeout(() => {
        this.animating = false;
        done();
      }, 300);
    },

    // 激活窗口
    activateWindow() {
      if (!this.animating && !this.animateClosing) {
        this.$windowManager.activateWindow(this.windowId)
      }
    },
    
    // 最小化窗口
    minimizeWindow() {
      if (!this.animating && !this.animateClosing) {
        this.$windowManager.minimizeWindow(this.windowId)
      }
    },
    
    // 关闭窗口
    closeWindow() {
      if (!this.animating && !this.animateClosing) {
        this.animateClosing = true;
        
        // 启动关闭动画
        const windowElement = this.$el.querySelector('.floating-window');
        if (windowElement) {
          windowElement.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
          windowElement.style.opacity = '0';
          windowElement.style.transform = 'scale(0.8)';
          
          // 动画完成后关闭窗口
          setTimeout(() => {
            this.isClosingProp = true;
            this.$nextTick(() => {
              this.$windowManager.closeWindow(this.windowId);
            });
          }, 300);
        } else {
          // 如果无法找到元素，直接关闭
          this.$windowManager.closeWindow(this.windowId);
        }
      }
    },
    
    // 开始拖动
    startDrag(event) {
      if (!this.animating && !this.animateClosing) {
        this.isDragging = true
        this.startX = event.clientX
        this.startY = event.clientY
        event.preventDefault()
      }
    },
    
    // 开始调整大小
    startResize(type, event) {
      if (!this.animating && !this.animateClosing) {
        this.isResizing = true
        this.resizeType = type
        this.startX = event.clientX
        this.startY = event.clientY
        this.startWidth = this.window.width
        this.startHeight = this.window.height
        
        // 设置当前调整大小的类型，用于光标样式
        document.body.style.cursor = type === 'right' ? 'e-resize' : 
                                    type === 'bottom' ? 's-resize' : 'se-resize'
        
        event.preventDefault()
      }
    },
    
    // 鼠标移动处理
    onMouseMove(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.startX
        const deltaY = event.clientY - this.startY
        this.startX = event.clientX
        this.startY = event.clientY
        
        this.$windowManager.updateWindowPosition(
          this.windowId,
          this.window.x + deltaX,
          this.window.y + deltaY
        )
      } else if (this.isResizing) {
        const deltaX = event.clientX - this.startX
        const deltaY = event.clientY - this.startY
        
        if (this.resizeType === 'right' || this.resizeType === 'corner') {
          this.$windowManager.updateWindowSize(
            this.windowId,
            this.startWidth + deltaX,
            this.resizeType === 'corner' ? this.startHeight + deltaY : this.window.height
          )
        }
        
        if (this.resizeType === 'bottom' || this.resizeType === 'corner') {
          this.$windowManager.updateWindowSize(
            this.windowId,
            this.resizeType === 'corner' ? this.startWidth + deltaX : this.window.width,
            this.startHeight + deltaY
          )
        }
      }
    },
    
    // 鼠标松开处理
    onMouseUp() {
      if (this.isDragging || this.isResizing) {
        this.isDragging = false
        this.isResizing = false
        this.resizeType = null
        
        // 恢复默认光标
        document.body.style.cursor = ''
      }
    }
  }
}
</script>

<style scoped>
.floating-window, .floating-window * {
  box-sizing: border-box;
}

.floating-window {
  position: absolute;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: transform, opacity;
  transform-origin: center;
}

.floating-window.is-closing {
  pointer-events: none;
}

.window-animation-enter-active, 
.window-animation-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  pointer-events: none;
}

.window-animation-enter, 
.window-animation-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.window-header {
  background-color: #947358;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  cursor: move;
  user-select: none;
}

.window-title {
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.window-controls {
  display: flex;
  align-items: center;
}

.control-btn {
  border: none;
  background: transparent;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
  background-color: #f56c6c;
}

.window-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
}

.window-iframe {
  border: none;
  flex: 1;
  display: block;
}

.iframe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.01);
  z-index: 100;
}

.resize-handle {
  position: absolute;
  background-color: transparent;
  z-index: 10;
}

.resize-handle-right {
  right: 0;
  top: 36px;
  width: 6px;
  height: calc(100% - 36px - 6px);
  cursor: e-resize;
}

.resize-handle-bottom {
  bottom: 0;
  left: 6px;
  height: 6px;
  width: calc(100% - 12px);
  cursor: s-resize;
}

.resize-handle-corner {
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  cursor: se-resize;
}
</style> 