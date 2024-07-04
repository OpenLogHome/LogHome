// #ifdef VUE3
import {
	onShow
} from '@dcloudio/uni-app'
import {
	onHide
} from '@dcloudio/uni-app'
// #endif

let onAppShowCallback = [],
	onAppHideCallback = []
// 监听应用生命周期
const appEvent = {
	appShowIndex: 0,
	appHideIndex: 0,
	onAppShow(callback) {
		this.appShowIndex++
		if (typeof callback == 'function') {
			onAppShowCallback.push(callback)
		}
		onAppShowCallback.forEach(fun => fun())
	},
	onAppHide(callback) {
		this.appHideIndex++
		if (typeof callback == 'function') {
			onAppHideCallback.push(callback)
		}
		onAppHideCallback.forEach(fun => fun())
	}
}

setTimeout(() => {
	// #ifdef APP
	// #ifdef VUE2
	getApp().$vm.$on('hook:onShow', function() {
		appEvent.onAppShow()
	})
	getApp().$vm.$on('hook:onHide', function() {
		appEvent.onAppHide()
	})
	// #endif

	// #ifdef VUE3
	onShow(function() {
		appEvent.onAppShow()
	}, getApp().$vm.$)
	onHide(function() {
		appEvent.onAppHide()
	}, getApp().$vm.$)
	// #endif
	// #endif

	// #ifdef H5
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			// 页面被挂起
			appEvent.onAppHide()
		} else {
			// 页面呼出
			appEvent.onAppShow()
		}
	})
	// #endif

	// #ifdef MP
	uni.onAppShow(function() {
		appEvent.onAppShow()
	})
	uni.onAppHide(function() {
		appEvent.onAppHide()
	})
	// #endif

}, 0)

export default appEvent
