// i18n bin/lang.js 单元测试：node test/i18n_lang_test.js
const assert = require('assert');
const {
	DEFAULT_LANG,
	SUPPORTED_LANGS,
	normalizeLang,
	pickFromAcceptLanguage,
	resolveLang,
	resolveUserLang,
	t,
} = require('../bin/lang.js');

// normalizeLang
assert.strictEqual(normalizeLang('en'), 'en');
assert.strictEqual(normalizeLang('en-US'), 'en');
assert.strictEqual(normalizeLang('en_GB'), 'en');
assert.strictEqual(normalizeLang('zh-CN'), 'zh-CN');
assert.strictEqual(normalizeLang('zh-Hans'), 'zh-CN');
assert.strictEqual(normalizeLang('zh-TW'), 'zh-CN', 'zh 变体回退简体');
assert.strictEqual(normalizeLang('  zh-cn  '), 'zh-CN', '大小写/空白归一');
assert.strictEqual(normalizeLang('fr'), null);
assert.strictEqual(normalizeLang(''), null);
assert.strictEqual(normalizeLang(null), null);

// pickFromAcceptLanguage：q 权重与出现顺序
assert.strictEqual(pickFromAcceptLanguage('en-US,en;q=0.9,zh-CN;q=0.8'), 'en');
assert.strictEqual(pickFromAcceptLanguage('zh-CN,zh;q=0.9,en;q=0.8'), 'zh-CN');
assert.strictEqual(
	pickFromAcceptLanguage('fr-FR,fr;q=0.9,en;q=0.8'),
	'en',
	'跳过不支持语言',
);
assert.strictEqual(pickFromAcceptLanguage('fr-FR,de;q=0.9'), null);
assert.strictEqual(
	pickFromAcceptLanguage('zh;q=0.1,en;q=0.9'),
	'en',
	'高 q 优先',
);

// resolveLang 优先级：X-Lang > users.language > Accept-Language > 默认
assert.strictEqual(
	resolveLang({ headers: { 'x-lang': 'en' } }),
	'en',
	'X-Lang 最高优先',
);
assert.strictEqual(
	resolveLang({
		headers: { 'x-lang': 'en' },
		user: [{ language: 'zh-CN' }],
	}),
	'en',
	'X-Lang 覆盖用户设置',
);
assert.strictEqual(
	resolveLang({
		headers: { 'accept-language': 'en-US,en' },
		user: [{ language: 'zh-CN' }],
	}),
	'zh-CN',
	'用户设置覆盖 Accept-Language',
);
assert.strictEqual(
	resolveLang({ headers: { 'accept-language': 'en-US,en' } }),
	'en',
	'匿名走 Accept-Language',
);
assert.strictEqual(
	resolveLang({ headers: { 'accept-language': 'fr,de' } }),
	DEFAULT_LANG,
	'全不支持回退默认',
);
assert.strictEqual(resolveLang({ headers: {} }), DEFAULT_LANG);

// resolveUserLang
assert.strictEqual(resolveUserLang({ language: 'en' }), 'en');
assert.strictEqual(resolveUserLang({}), DEFAULT_LANG);
assert.strictEqual(resolveUserLang(null), DEFAULT_LANG);

// t：目录命中 + 缺失回退 zh + 插值
assert.strictEqual(t({ headers: { 'x-lang': 'en' } }, 'common.cancel'), 'Cancel');
assert.strictEqual(t({ headers: { 'x-lang': 'zh-CN' } }, 'common.cancel'), '取消');
assert.strictEqual(
	t({ headers: { 'x-lang': 'en' } }, 'language.updated'),
	'Language preference updated',
);
assert.strictEqual(
	t({ headers: { 'x-lang': 'en' } }, 'common.confirm'),
	'OK',
	'en 命中共用 key',
);
// en 缺失该 key 时回退 zh-CN（_fallback_probe / interp.probe 仅存在于 zh-CN 目录）
assert.strictEqual(
	t({ headers: { 'x-lang': 'en' } }, '_fallback_probe'),
	'回退探针',
	'en 缺失 key 回退 zh',
);
assert.strictEqual(
	t({ headers: {} }, 'totally.missing.key'),
	'totally.missing.key',
	'未知 key 原样返回',
);

// 插值
assert.strictEqual(
	t({ headers: { 'x-lang': 'zh-CN' } }, 'interp.probe', { name: '原木', n: 3 }),
	'你好 原木，你收到 3 条',
	'{{param}} 插值',
);

console.log('i18n lang 单测通过 ✓ 支持语言：' + SUPPORTED_LANGS.join(', '));
