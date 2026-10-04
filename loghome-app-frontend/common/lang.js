// 语言切换的应用层编排：UI locale、tabBar、原生壳同步、账号偏好同步
// 纯解析函数见 i18n/resolve.js（无循环依赖）

import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import i18n from '@/i18n/index.js'
import { applyLocalizedTitle } from '@/common/nav-title.js'
import {
	DEFAULT_LANG,
	FOLLOW_SYSTEM,
	SUPPORTED_LANGS,
	getSavedLanguage,
	saveLanguagePreference,
	normalizeLang,
	readStoredToken,
	resolveEffectiveLanguage
} from '@/i18n/resolve.js'

export { FOLLOW_SYSTEM, SUPPORTED_LANGS, normalizeLang }

// 更新依赖 locale 的外围 UI（tabBar 文案；页面标题在 P1 随模板迁移）
function refreshChrome() {
	const titles = [
		i18n.t('nav.tab.library'),
		i18n.t('nav.tab.community'),
		i18n.t('nav.tab.writer'),
		i18n.t('nav.tab.me')
	]
	titles.forEach((text, index) => {
		try {
			uni.setTabBarItem({ index, text })
		} catch (error) {}
	})
	// 当前页导航标题随语言刷新（页面 onShow 时由全局 mixin 再次覆盖）
	applyLocalizedTitle()
}

// 通知原生壳切换应用语言；value 可为 'zh-CN' | 'en' | 'follow-system'
function notifyNativeLanguage(value) {
	try {
		const bridge = window.jsBridge
		if (!bridge || !bridge.inApp) return
		if (typeof bridge.setAppLanguage === 'function') {
			Promise.resolve(bridge.setAppLanguage(value)).catch(() => {})
			return
		}
		if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
			Promise.resolve(window.flutter_inappwebview.callHandler('setAppLanguage', value))
				.catch(() => {})
		}
	} catch (error) {}
}

// 同步账号语言偏好（未登录跳过；失败静默，本地偏好仍生效），返回 Promise 供串行编排
function syncLanguageToServer(value) {
	const token = readStoredToken()
	const baseUrl = Vue.prototype.$baseUrl
	if (!token || !baseUrl) return Promise.resolve()
	const language = value === FOLLOW_SYSTEM ? null : value
	return axios
		.post(baseUrl + '/users/language', { language }, {
			headers: { 'Content-Type': 'application/json', Authorization: token }
		})
		.catch(() => {})
}

// 拉取账号语言偏好（优先级最高；启动时调用一次）
export function syncLanguageFromServer() {
	const token = readStoredToken()
	const baseUrl = Vue.prototype.$baseUrl
	if (!token || !baseUrl) return
	axios
		.get(baseUrl + '/users/language', {
			headers: { 'Content-Type': 'application/json', Authorization: token }
		})
		.then(response => {
			const serverLang = normalizeLang(response.data && response.data.language)
			if (!serverLang) return
			// 账号设置优先于本地：覆盖本地偏好并应用
			if (serverLang !== i18n.locale || getSavedLanguage() === FOLLOW_SYSTEM) {
				saveLanguagePreference(serverLang)
				applyLanguageUi(serverLang)
			}
		})
		.catch(() => {})
}

function applyLanguageUi(lang) {
	if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG
	i18n.locale = lang
	moment.locale(lang === 'en' ? 'en' : 'zh-cn')
	refreshChrome()
}

// 设置页入口：value ∈ 'zh-CN' | 'en' | 'follow-system'
export function applyLanguagePreference(value) {
	const preference =
		value === 'zh-CN' || value === 'en' ? value : FOLLOW_SYSTEM
	saveLanguagePreference(preference)
	applyLanguageUi(resolveEffectiveLanguage(preference))
	// 先落库账号偏好再通知原生：原生切换语言可能重建 Activity 并中断进行中的请求
	syncLanguageToServer(preference).then(() => {
		notifyNativeLanguage(preference)
	})
}

// App onLaunch 启动初始化：应用当前生效语言，再异步对齐账号偏好
export function initLanguage() {
	applyLanguageUi(resolveEffectiveLanguage())
	// tabBar 可能尚未挂载，补一次刷新
	setTimeout(refreshChrome, 1000)
	syncLanguageFromServer()
}
