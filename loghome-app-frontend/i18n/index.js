import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCore from './messages/zh-CN.json'
import enCore from './messages/en.json'
import zhAuth from './messages/zh-CN.auth.json'
import enAuth from './messages/en.auth.json'
import zhSettings from './messages/zh-CN.settings.json'
import enSettings from './messages/en.settings.json'
import zhRedstone from './messages/zh-CN.redstone.json'
import enRedstone from './messages/en.redstone.json'
import zhMe from './messages/zh-CN.me.json'
import enMe from './messages/en.me.json'
import zhTitles from './messages/zh-CN.titles.json'
import enTitles from './messages/en.titles.json'
import { resolveEffectiveLanguage, DEFAULT_LANG } from './resolve.js'

Vue.use(VueI18n)

// 约定：词条一律写 {{var}}（与后端 bin/locales 协议一致）；
// vue-i18n v8 的 messageformat 用单括号，加载时统一转换。
// 注意：v8 的解析器会把消息里孤立的 '{' 当语法起始，词条文本请勿出现裸花括号。
function normalizeInterpolation(value) {
	if (typeof value === 'string') return value.replace(/\{\{(\w+)\}\}/g, '{$1}')
	if (value && typeof value === 'object') {
		Object.keys(value).forEach(key => {
			value[key] = normalizeInterpolation(value[key])
		})
	}
	return value
}

// 深合并各域词条文件（约定：每文件顶层 key = 域名，互不重叠）
function mergeMessages(parts) {
	const isPlain = v => v && typeof v === 'object' && !Array.isArray(v)
	const merge = (target, source) => {
		Object.keys(source).forEach(key => {
			if (isPlain(source[key]) && isPlain(target[key])) {
				merge(target[key], source[key])
			} else {
				target[key] = source[key]
			}
		})
		return target
	}
	return normalizeInterpolation(
		parts.reduce((acc, part) => merge(acc, JSON.parse(JSON.stringify(part))), {}),
	)
}

// en 缺失 key 自动回退 zh-CN，翻译可按域分批补齐而不影响线上
const i18n = new VueI18n({
	locale: resolveEffectiveLanguage(),
	fallbackLocale: DEFAULT_LANG,
	silentTranslationWarn: true,
	messages: {
		'zh-CN': mergeMessages([zhCore, zhAuth, zhSettings, zhRedstone, zhMe, zhTitles]),
		en: mergeMessages([enCore, enAuth, enSettings, enRedstone, enMe, enTitles])
	}
})

export default i18n
