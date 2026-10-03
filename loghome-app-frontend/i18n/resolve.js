// 语言偏好解析（纯函数层，不依赖 i18n 实例，避免循环引用）
// 存储约定：localStorage 'loghome_language' ∈ 'follow-system' | 'zh-CN' | 'en'
// 生效优先级：账号设置（登录后由服务端下发覆盖本地） > 本地设置 > 设备/系统语言 > zh-CN

export const LANGUAGE_STORAGE_KEY = 'loghome_language';
export const FOLLOW_SYSTEM = 'follow-system';
export const SUPPORTED_LANGS = ['zh-CN', 'en'];
export const DEFAULT_LANG = 'zh-CN';

// 归一化：'en-US'/'en' → 'en'；'zh'/'zh-Hans'/'zh-TW' 等 → 'zh-CN'；其余返回 null
export function normalizeLang(raw) {
	if (!raw) return null;
	const value = String(raw).trim().toLowerCase().replace(/_/g, '-');
	if (value === 'en' || value.startsWith('en-')) return 'en';
	if (value === 'zh' || value.startsWith('zh-')) return 'zh-CN';
	return null;
}

// 读取本地保存的语言偏好，返回 'follow-system' | 'zh-CN' | 'en'
export function getSavedLanguage() {
	try {
		const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (saved === 'zh-CN' || saved === 'en') return saved;
	} catch (error) {}
	return FOLLOW_SYSTEM;
}

export function saveLanguagePreference(value) {
	try {
		const stored = value === 'zh-CN' || value === 'en' ? value : FOLLOW_SYSTEM;
		window.localStorage.setItem(LANGUAGE_STORAGE_KEY, stored);
	} catch (error) {}
}

// 设备语言：优先原生壳注入的 jsBridge.language（壳已解析系统语言），其次浏览器语言
export function getDeviceLanguage() {
	try {
		const fromBridge = normalizeLang(window.jsBridge && window.jsBridge.language);
		if (fromBridge) return fromBridge;
	} catch (error) {}
	try {
		const fromNavigator = normalizeLang(
			(navigator.languages && navigator.languages[0]) || navigator.language,
		);
		if (fromNavigator) return fromNavigator;
	} catch (error) {}
	return DEFAULT_LANG;
}

// 当前生效语言：显式偏好直接用，跟随系统时取设备语言
export function resolveEffectiveLanguage(savedPreference) {
	const preference =
		savedPreference === undefined ? getSavedLanguage() : savedPreference;
	if (preference === 'zh-CN' || preference === 'en') return preference;
	return getDeviceLanguage();
}

// token 读取（与 pages/me.vue、common/membership-api.js 的既有约定一致）
export function readStoredToken() {
	try {
		let value = window.localStorage.getItem('token');
		if (!value) return '';
		try {
			value = JSON.parse(value);
		} catch (error) {
			return String(value);
		}
		if (value && typeof value === 'object') return value.tk || '';
		return value ? String(value) : '';
	} catch (error) {
		return '';
	}
}
