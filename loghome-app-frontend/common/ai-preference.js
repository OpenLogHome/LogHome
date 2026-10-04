import { resolveRouteUrl } from './native-router.js'

export const AI_DISABLED_STORAGE_KEY = 'LogHomeAiAssistanceDisabled'
export const AI_FEATURE_ROUTES = ['pages/redstone/index', 'pages/readers/askLogGirl', 'pages/writers/essayIndexing']

export function readAiAssistanceDisabled() {
	try { return window.localStorage.getItem(AI_DISABLED_STORAGE_KEY) === 'true' } catch (_) { return false }
}

export function persistAiAssistanceDisabled(disabled) {
	// 写入失败时不更新界面状态，避免开关显示成功但重启后失效。
	window.localStorage.setItem(AI_DISABLED_STORAGE_KEY, disabled ? 'true' : 'false')
}

export function syncAiPreference(store) {
	const disabled = readAiAssistanceDisabled()
	if (store.state.aiAssistanceDisabled !== disabled) store.commit('updateAiAssistanceDisabled', disabled)
}

export function isAiFeatureRoute(route) {
	return AI_FEATURE_ROUTES.includes(String(route || '').split(/[?#]/)[0].replace(/^\//, ''))
}

// 包装在原生路由外层，原生 WebView 与普通 uni 路由都遵守开关。
export function installAiNavigationGuard(uniRef, store, notify) {
	if (!uniRef || uniRef.__loghomeAiGuardInstalled) return
	for (const method of ['navigateTo', 'redirectTo', 'reLaunch']) {
		if (typeof uniRef[method] !== 'function') continue
		const original = uniRef[method].bind(uniRef)
		uniRef[method] = options => {
			syncAiPreference(store)
			if (store.state.aiAssistanceDisabled && isAiFeatureRoute(resolveRouteUrl(options && options.url))) {
				if (notify) notify()
				const result = { errMsg: method + ':fail AI assistance disabled' }
				if (options && typeof options.fail === 'function') options.fail(result)
				if (options && typeof options.complete === 'function') options.complete(result)
				return
			}
			return original(options)
		}
	}
	uniRef.__loghomeAiGuardInstalled = true
}
