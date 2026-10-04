// 当前页导航标题本地化：路由 → titles.* key（由 scripts/gen-title-map.js 生成映射）
// en 缺 key 时不覆盖（pages.json 原中文标题保持），避免 setNavigationBarTitle 空标题
import i18n from '@/i18n/index.js'
import { routeTitleKeys } from '@/i18n/title-map.js'

export function applyLocalizedTitle() {
	try {
		const pages = getCurrentPages()
		if (!pages || !pages.length) return
		const route = pages[pages.length - 1].route
		if (!route) return
		const key = routeTitleKeys[route]
		if (!key || !i18n.te(key)) return
		uni.setNavigationBarTitle({ title: i18n.t(key) })
	} catch (error) {}
}
