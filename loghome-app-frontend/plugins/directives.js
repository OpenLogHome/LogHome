import Vue from 'vue'
import store from '@/store'

const applyDarkMode = (el) => {
  if (store.state.isDarkMode) {
    el.classList.add('dark-mode')
  } else {
    el.classList.remove('dark-mode')
  }
}

// 定义深色模式指令
Vue.directive('dark', {
  bind(el) {
    applyDarkMode(el)
    el._unsubscribe = store.subscribe((mutation) => {
      if (mutation.type === 'updateDarkMode') {
        applyDarkMode(el)
      }
    })
  },
  componentUpdated(el) {
    applyDarkMode(el)
  },
  unbind(el) {
    if (el._unsubscribe) {
      el._unsubscribe()
      delete el._unsubscribe
    }
  }
})
