import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './messages/zh-CN.json'
import en from './messages/en.json'
import { resolveEffectiveLanguage, DEFAULT_LANG } from './resolve.js'

Vue.use(VueI18n)

// en 缺失 key 自动回退 zh-CN，翻译可按域分批补齐而不影响线上
const i18n = new VueI18n({
	locale: resolveEffectiveLanguage(),
	fallbackLocale: DEFAULT_LANG,
	silentTranslationWarn: true,
	messages: {
		'zh-CN': zhCN,
		en: en
	}
})

export default i18n
