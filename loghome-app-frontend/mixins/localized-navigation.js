// 全局 mixin：每次页面 onShow 时按当前 locale 覆盖导航标题
// zh 环境下 key 值与 pages.json 原文一致（视觉零变化）；en 下已翻译页面生效
import { applyLocalizedTitle } from '@/common/nav-title.js'

export default {
	onShow() {
		applyLocalizedTitle()
	},
}
