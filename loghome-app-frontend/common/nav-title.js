// 当前页导航标题本地化：路由 → titles.* key（由 scripts/gen-title-map.js 生成映射）
// en 缺 key 时不覆盖（pages.json 原中文标题保持），避免 setNavigationBarTitle 空标题
import i18n from '@/i18n/index.js'
import { routeTitleKeys } from '@/i18n/title-map.js'

// pages.json 的 titleNView 按钮不会随 vue-i18n 自动更新。
// 只覆盖文字按钮；图标按钮继续沿用 pages.json 中的字体图标配置。
const routeButtonKeys = {
	'pages/bookcase/index': { 0: 'common.manage' },
	'pages/writers/sortArticles': { 0: 'common.done' },
	'pages/writers/chapterEditor': { 0: 'common.publish' },
	'pages/community/postEdit': { 0: 'common.publish' },
	'pages/writers/worldVocabularyEditor': { 0: 'common.done' },
}

function getCurrentRoute() {
	const pages = getCurrentPages()
	if (!pages || !pages.length) return ''
	return pages[pages.length - 1].route || ''
}

function applyLocalizedButtons(route) {
	const buttonKeys = routeButtonKeys[route]
	if (!buttonKeys) return

	// #ifdef H5
	setTimeout(() => {
		try {
			const heads = document.querySelectorAll('uni-page-head')
			const head = heads[heads.length - 1]
			if (!head) return
			const buttons = head.querySelectorAll('.uni-page-head-ft .uni-page-head-btn .uni-btn-icon')
			Object.keys(buttonKeys).forEach(index => {
				if (buttons[index]) buttons[index].textContent = i18n.t(buttonKeys[index])
			})
		} catch (error) {}
	}, 0)
	// #endif

	// #ifdef APP-PLUS
	try {
		const pages = getCurrentPages()
		const page = pages && pages[pages.length - 1]
		const webview = page && page.$getAppWebview && page.$getAppWebview()
		const style = webview && webview.getStyle && webview.getStyle()
		const titleNView = style && style.titleNView
		if (!titleNView || !Array.isArray(titleNView.buttons)) return
		const buttons = titleNView.buttons.map(button => ({ ...button }))
		Object.keys(buttonKeys).forEach(index => {
			if (buttons[index]) buttons[index].text = `${i18n.t(buttonKeys[index])} `
		})
		webview.setStyle({ titleNView: { ...titleNView, buttons } })
	} catch (error) {}
	// #endif
}

export function applyLocalizedTitle() {
	try {
		const route = getCurrentRoute()
		if (!route) return
		const key = routeTitleKeys[route]
		if (key && i18n.te(key)) {
			const title = i18n.t(key)
			uni.setNavigationBarTitle({ title })
			// #ifdef H5
			document.title = title
			// #endif
		}
		applyLocalizedButtons(route)
	} catch (error) {}
}
