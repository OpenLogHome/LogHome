// 创作页和阅读详情页共用资讯跳转，外链在 App 中调用系统浏览器。
export function openActivityNewsLink(news, onOpen) {
	const notify = () => uni.showToast({ title: '该资讯暂未开放，请稍后重试', icon: 'none' })
	const mobileLink = news && typeof news.mobile_link === 'string' ? news.mobile_link.trim() : ''
	const pcLink = news && typeof news.pc_link === 'string' ? news.pc_link.trim() : ''
	const isExternal = (url) => /^https?:\/\//i.test(url)
	const opened = () => { if (typeof onOpen === 'function') onOpen() }
	const openExternal = (url) => {
		if (!isExternal(url) || typeof window === 'undefined') {
			notify()
			return
		}
		const bridge = window.jsBridge
		if (bridge && bridge.inApp && typeof bridge.openInBrowser === 'function') {
			Promise.resolve(bridge.openInBrowser(url)).then((result) => {
				if (result === false) notify()
				else opened()
			}).catch(notify)
		} else {
			window.open(url, '_blank')
			opened()
		}
	}
	if (!mobileLink) {
		openExternal(pcLink)
		return
	}
	if (isExternal(mobileLink)) {
		openExternal(mobileLink)
		return
	}
	uni.navigateTo({
		url: mobileLink,
		success: opened,
		fail: () => { if (pcLink) openExternal(pcLink); else notify() },
	})
}
