// i18n 语言解析与文案目录查询（P0 骨架，零依赖实现）
// 优先级：X-Lang 请求头 > 用户设置 users.language > Accept-Language > zh-CN
// 目录约定：bin/locales/{lang}.json，扁平 key（如 'auth.code_sent'）
// zh-CN 为兜底语言：en 缺失 key 时自动回退 zh-CN 文案，可安全分批补齐

const zhCN = require('./locales/zh-CN.json');
const en = require('./locales/en.json');

const DEFAULT_LANG = 'zh-CN';
const SUPPORTED_LANGS = ['zh-CN', 'en'];
const CATALOGS = {
	'zh-CN': zhCN,
	en: en,
};

// 'en-US'/'en_GB'/'en' → 'en'；'zh'/'zh-Hans'/'zh-CN'/'zh-TW' → 'zh-CN'；其余不支持返回 null
function normalizeLang(raw) {
	if (!raw) return null;
	const value = String(raw).trim().toLowerCase().replace(/_/g, '-');
	if (value === 'en' || value.startsWith('en-')) return 'en';
	// 现阶段仅支持 zh-CN，其余中文变体（zh-TW/zh-HK 等）回退简体
	if (value === 'zh' || value.startsWith('zh-')) return 'zh-CN';
	return null;
}

// 解析 Accept-Language：按 q 权重从高到低取第一个受支持语言
function pickFromAcceptLanguage(headerValue) {
	if (!headerValue) return null;
	const candidates = String(headerValue)
		.split(',')
		.map(function (part, index) {
			const pieces = part.trim().split(';');
			let q = 1;
			if (pieces[1]) {
				const matched = /q\s*=\s*([0-9.]+)/i.exec(pieces[1]);
				if (matched) q = parseFloat(matched[1]);
			}
			return { tag: pieces[0], q: isNaN(q) ? 0 : q, order: index };
		})
		.sort(function (a, b) {
			return b.q - a.q || a.order - b.order;
		});
	for (const candidate of candidates) {
		const lang = normalizeLang(candidate.tag);
		if (lang) return lang;
	}
	return null;
}

// 解析请求生效语言，结果缓存在 req.lang 上（同一请求内多次调用不重复解析）
function resolveLang(req) {
	if (req && req.lang) return req.lang;
	const headers = (req && req.headers) || {};
	const fromHeader = normalizeLang(headers['x-lang']);
	const user = req && req.user && req.user[0];
	const fromUser = user ? normalizeLang(user.language) : null;
	const fromAccept = pickFromAcceptLanguage(headers['accept-language']);
	const lang = fromHeader || fromUser || fromAccept || DEFAULT_LANG;
	if (req) req.lang = lang;
	return lang;
}

// 非请求上下文（定时任务、系统通知发送）按用户记录解析
function resolveUserLang(user) {
	return normalizeLang(user && user.language) || DEFAULT_LANG;
}

function lookup(catalog, key) {
	return Object.prototype.hasOwnProperty.call(catalog, key) ? catalog[key] : undefined;
}

function interpolate(template, params) {
	if (!params) return template;
	return template.replace(/\{\{(\w+)\}\}/g, function (matched, name) {
		return Object.prototype.hasOwnProperty.call(params, name)
			? String(params[name])
			: matched;
	});
}

// 按 key 取当前请求语言的文案；缺失 key 回退 zh-CN，仍缺失返回 key 本身
function t(req, key, params) {
	const lang = resolveLang(req);
	const catalog = CATALOGS[lang] || CATALOGS[DEFAULT_LANG];
	const value = lookup(catalog, key) !== undefined
		? lookup(catalog, key)
		: lookup(CATALOGS[DEFAULT_LANG], key);
	return interpolate(value !== undefined ? value : key, params);
}

module.exports = {
	DEFAULT_LANG,
	SUPPORTED_LANGS,
	normalizeLang,
	pickFromAcceptLanguage,
	resolveLang,
	resolveUserLang,
	t,
};
