import Vue from 'vue'

// 全局窗口管理状态
const state = Vue.observable({
  windows: [],
  activeWindowId: null,
  zIndex: 1000
})

// 窗口管理器类
class WindowManager {
  constructor() {
    this.state = state
  }
  
  // 创建新窗口
  createWindow(options) {
    const id = 'window-' + Date.now()
    const defaultOptions = {
      id,
      title: '新窗口',
      url: '',
      width: 800,
      height: 600,
      x: (window.innerWidth - 800) / 2,
      y: (window.innerHeight - 600) / 2,
      isMinimized: false,
      isResizing: false,
      zIndex: this.state.zIndex++
    }
    
    const windowOptions = { ...defaultOptions, ...options }
    this.state.windows.push(windowOptions)
    this.state.activeWindowId = id
    
    return id
  }
  
  // 关闭窗口
  closeWindow(id) {
    const index = this.state.windows.findIndex(w => w.id === id)
    if (index !== -1) {
      // 直接从数组中移除窗口，因为动画已经在组件中处理完成
      this.state.windows.splice(index, 1)
      
      // 如果关闭的是当前活动窗口，则激活最近的窗口
      if (this.state.activeWindowId === id && this.state.windows.length > 0) {
        const nonMinimizedWindows = this.state.windows.filter(w => !w.isMinimized)
        if (nonMinimizedWindows.length > 0) {
          this.state.activeWindowId = nonMinimizedWindows[nonMinimizedWindows.length - 1].id
        } else {
          this.state.activeWindowId = null
        }
      } else if (this.state.windows.length === 0) {
        this.state.activeWindowId = null
      }
    }
  }
  
  // 最小化窗口
  minimizeWindow(id) {
    const window = this.state.windows.find(w => w.id === id)
    if (window) {
      window.isMinimized = true
      
      // 如果最小化的是当前活动窗口，则激活最近的非最小化窗口
      if (this.state.activeWindowId === id) {
        const nonMinimized = this.state.windows.filter(w => !w.isMinimized)
        if (nonMinimized.length > 0) {
          this.state.activeWindowId = nonMinimized[nonMinimized.length - 1].id
        } else {
          this.state.activeWindowId = null
        }
      }
    }
  }
  
  // 恢复窗口
  restoreWindow(id) {
    const window = this.state.windows.find(w => w.id === id)
    if (window) {
      // 先激活窗口，然后再取消最小化状态
      // 这样动画才会在恢复过程中正确执行
      this.state.activeWindowId = id
      window.zIndex = this.state.zIndex++
      
      // 给DOM有时间更新
      setTimeout(() => {
        window.isMinimized = false
      }, 10)
    }
  }
  
  // 激活窗口（置于顶层）
  activateWindow(id) {
    const window = this.state.windows.find(w => w.id === id)
    if (window && !window.isMinimized) {
      this.state.activeWindowId = id
      window.zIndex = this.state.zIndex++
    }
  }
  
  // 更新窗口位置
  updateWindowPosition(id, x, y) {
    const window = this.state.windows.find(w => w.id === id)
    if (window) {
      window.x = Math.max(0, x)
      window.y = Math.max(0, y)
    }
  }
  
  // 更新窗口大小
  updateWindowSize(id, width, height) {
    const window = this.state.windows.find(w => w.id === id)
    if (window) {
      window.width = Math.max(300, width)
      window.height = Math.max(200, height)
    }
  }
  
  // 获取所有窗口
  getWindows() {
    return this.state.windows
  }
  
  // 获取最小化的窗口
  getMinimizedWindows() {
    return this.state.windows.filter(w => w.isMinimized)
  }
  
  // 获取非最小化的窗口
  getActiveWindows() {
    return this.state.windows.filter(w => !w.isMinimized)
  }
  
  // 获取当前活动窗口
  getActiveWindow() {
    return this.state.windows.find(w => w.id === this.state.activeWindowId)
  }
}

// 创建窗口管理器实例
const windowManager = new WindowManager()

// 导出插件
export default ({ app }, inject) => {
  inject('windowManager', windowManager)
}

// 挂载到Vue原型
Vue.prototype.$windowManager = windowManager 