const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');

function component(relativePath, { axios = {}, token = { tk: 'valid' } } = {}) {
	const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
	const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
		.replace(/^\s*import .*$/gm, '').replace('export default', 'module.exports =');
	const module = { exports: {} };
	const toasts = [];
	vm.runInNewContext(script, {
		module, axios, followBtn: {}, darkModeMixin: {},
		window: { localStorage: { getItem: () => token ? JSON.stringify(token) : null } },
		uni: { showToast: toast => toasts.push(toast) }
	});
	const definition = module.exports;
	const instance = { ...definition.data(), $baseUrl: 'http://test', $t: key => key };
	for (const [name, fn] of Object.entries(definition.methods)) instance[name] = fn.bind(instance);
	for (const [name, fn] of Object.entries(definition.computed || {})) Object.defineProperty(instance, name, { get: () => fn.call(instance) });
	return { instance, definition, toasts };
}

test('加载已保存设置，携带身份，不依赖本地隐私缓存', async () => {
	const settings = { follow_list_visibility: 'private', direct_message_policy: 'mutual' };
	const { instance } = component('pages/settings/privacySettings.vue', { axios: { get: async (url, options) => {
		assert.equal(url, 'http://test/users/privacy_settings');
		assert.equal(options.headers.Authorization, 'Bearer valid');
		assert.equal(options.timeout, 15000);
		return { data: settings };
	} } });
	await instance.loadSettings();
	assert.equal(instance.ready, true);
	assert.equal(instance.loading, false);
	assert.equal(instance.changed, false);
	assert.equal(instance.form.direct_message_policy, 'mutual');
});

test('未登录或加载失败不可保存，并显示错误', async () => {
	for (const token of [null, { tk: 'expired' }]) {
		let writes = 0;
		const { instance, toasts } = component('pages/settings/privacySettings.vue', { token, axios: {
			get: async () => { throw { response: { status: 401 } }; }, post: async () => { writes++; }
		} });
		await instance.loadSettings();
		await instance.saveSettings();
		assert.equal(instance.ready, false);
		assert.equal(instance.loading, false);
		assert.equal(writes, 0);
		assert.equal(toasts[0].title, 'settings.privacy.loginRequired');
	}
});

test('保存成功更新基线，保存失败保留所选选项，可重新尝试', async () => {
	let fail = true;
	const initial = { follow_list_visibility: 'public', direct_message_policy: 'default' };
	const { instance, toasts } = component('pages/settings/privacySettings.vue', { axios: {
		get: async () => ({ data: initial }),
		post: async (url, body) => {
			assert.equal(body.follow_list_visibility, 'fans_only');
			assert.equal(body.direct_message_policy, 'none');
			if (fail) throw new Error('offline');
			return { data: { ...body } };
		}
	} });
	await instance.loadSettings();
	instance.form = { follow_list_visibility: 'fans_only', direct_message_policy: 'none' };
	assert.equal(instance.changed, true);
	await instance.saveSettings();
	assert.equal(instance.changed, true);
	assert.equal(instance.saving, false);
	assert.equal(instance.form.direct_message_policy, 'none');
	assert.equal(toasts[0].title, 'settings.privacy.saveFailed');
	fail = false;
	await instance.saveSettings();
	assert.equal(instance.changed, false);
	assert.equal(toasts[1].title, 'settings.privacy.saved');
});

test('保存期间防止重复提交，未修改时不提交', async () => {
	let calls = 0; let resolve;
	const { instance } = component('pages/settings/privacySettings.vue', { axios: {
		post: async () => { calls++; return new Promise(done => { resolve = done; }); }
	} });
	instance.ready = true;
	instance.original = JSON.stringify(instance.form);
	await instance.saveSettings();
	assert.equal(calls, 0);
	instance.form.direct_message_policy = 'none';
	const saving = instance.saveSettings();
	await instance.saveSettings();
	assert.equal(calls, 1);
	resolve({ data: instance.form });
	await saving;
	assert.equal(instance.saving, false);
});

test('私密列表不误报为空，清除旧列表并带上账户身份', async () => {
	const { instance } = component('pages/community/friends.vue', { axios: { get: async (url, options) => {
		assert.equal(options.headers.Authorization, 'Bearer valid');
		throw { response: { data: { code: 'PRIVATE_LIST' } } };
	} } });
	instance.id = 2;
	instance.fans = [{ user_id: 3 }];
	await instance.refreshFans();
	assert.equal(instance.fans.length, 0);
	assert.equal(instance.fansError, 'settings.privacy.privateList');
	const template = fs.readFileSync(path.join(root, 'pages/community/friends.vue'), 'utf8');
	assert.match(template, /v-if="fansError"/);
	assert.match(template, /!fansError && filteredFans.length === 0/);
	assert.doesNotMatch(template, /setInterval/);
});

test('两组四项具备中英文词条、页面注册和动态标题', () => {
	const { instance } = component('pages/settings/privacySettings.vue');
	for (const locale of ['zh-CN', 'en']) {
		const words = JSON.parse(fs.readFileSync(path.join(root, `i18n/messages/${locale}.settings.json`))).settings.privacy;
		for (const value of instance.listOptions) assert.ok(words.lists[value]);
		for (const value of instance.messageOptions) assert.ok(words.messages[value]);
		const titles = JSON.parse(fs.readFileSync(path.join(root, `i18n/messages/${locale}.titles.json`)));
		assert.ok(titles.titles.pages.settings.privacySettings);
	}
	const pages = JSON.parse(fs.readFileSync(path.join(root, 'pages.json')));
	assert.ok(pages.pages.some(page => page.path === 'pages/settings/privacySettings'));
});
