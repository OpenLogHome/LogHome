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
import zhCommunity from './messages/zh-CN.community.json'
import enCommunity from './messages/en.community.json'
import zhTitles from './messages/zh-CN.titles.json'
import enTitles from './messages/en.titles.json'
import zhReader from './messages/zh-CN.reader.json'
import enReader from './messages/en.reader.json'
import zhManga from './messages/zh-CN.manga.json'
import enManga from './messages/en.manga.json'
import zhWriter from './messages/zh-CN.writer.json'
import enWriter from './messages/en.writer.json'
import zhMembership from './messages/zh-CN.membership.json'
import enMembership from './messages/en.membership.json'
import zhStore from './messages/zh-CN.store.json'
import enStore from './messages/en.store.json'
import zhPayments from './messages/zh-CN.payments.json'
import enPayments from './messages/en.payments.json'
import zhTree from './messages/zh-CN.tree.json'
import enTree from './messages/en.tree.json'
import zhWorld from './messages/zh-CN.world.json'
import enWorld from './messages/en.world.json'
import zhLibrary from './messages/zh-CN.library.json'
import enLibrary from './messages/en.library.json'
import zhApps from './messages/zh-CN.apps.json'
import enApps from './messages/en.apps.json'
import zhManage from './messages/zh-CN.manage.json'
import enManage from './messages/en.manage.json'
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
		'zh-CN': mergeMessages([zhCore, zhAuth, zhSettings, zhRedstone, zhMe, zhCommunity, zhTitles, zhReader, zhManga, zhWriter, zhMembership, zhStore, zhPayments, zhTree, zhWorld, zhLibrary, zhApps, zhManage]),
		en: mergeMessages([enCore, enAuth, enSettings, enRedstone, enMe, enCommunity, enTitles, enReader, enManga, enWriter, enMembership, enStore, enPayments, enTree, enWorld, enLibrary, enApps, enManage])
	}
})

export default i18n
