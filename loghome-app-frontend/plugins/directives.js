import Vue from 'vue'
import store from '@/store'

// 定义深色模式指令
Vue.directive('dark', {
  // 指令绑定时
  bind: function(el, binding) {
    // 使用自定义属性标记元素
    el._darkModeEnabled = store.state.isDarkMode
    
    // 应用深色模式类
    const applyDarkMode = (isDark) => {
      const currentIsDark = isDark !== undefined ? isDark : store.state.isDarkMode
      if (currentIsDark && !el.classList.contains('dark-mode')) {
        el.classList.add('dark-mode')
      } else if (!currentIsDark && el.classList.contains('dark-mode')) {
        el.classList.remove('dark-mode')
      }
      el._darkModeEnabled = currentIsDark
    }
    
    // 初始应用深色模式
    applyDarkMode()
    
    // 创建MutationObserver监听class变化
    el._darkModeObserver = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // 当class变化且应处于深色模式但没有dark-mode类时，重新添加
          if (store.state.isDarkMode && !el.classList.contains('dark-mode')) {
            // 使用setTimeout避免可能的冲突
            setTimeout(() => {
              el.classList.add('dark-mode')
            }, 0)
          }
        }
      }
    })
    
    // 开始监听元素的class变化
    el._darkModeObserver.observe(el, { attributes: true, attributeFilter: ['class'] })
    
    // 创建Vuex状态监听器
    const createDarkModeWatcher = () => {
      let lastValue = store.state.isDarkMode
      
      return setInterval(() => {
        const currentValue = store.state.isDarkMode
        if (currentValue !== lastValue) {
          lastValue = currentValue
          applyDarkMode(currentValue)
        }
      }, 100) // 每100ms检查一次状态
    }
    
    // 启动监听器
    el._darkModeWatcherTimer = createDarkModeWatcher()
    
    // 监听store状态变化（Vuex mutation事件）
    el._unsubscribe = store.subscribe((mutation) => {
      if (mutation.type === 'toggleDarkMode' || mutation.type === 'setDarkMode') {
        applyDarkMode()
      }
    })
  },
  
  // 当指令与元素解绑时
  unbind: function(el) {
    // 清理观察者和订阅
    if (el._darkModeObserver) {
      el._darkModeObserver.disconnect()
      delete el._darkModeObserver
    }
    
    if (el._unsubscribe) {
      el._unsubscribe()
      delete el._unsubscribe
    }
    
    // 清理定时器
    if (el._darkModeWatcherTimer) {
      clearInterval(el._darkModeWatcherTimer)
      delete el._darkModeWatcherTimer
    }
    
    delete el._darkModeEnabled
  }
}) 