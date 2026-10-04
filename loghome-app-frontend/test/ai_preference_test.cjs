const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const parser = require('@babel/parser');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function evaluate(source, names, globals = {}) {
	const imports = parser.parse(source, { sourceType: 'module' }).program.body.filter(node => node.type === 'ImportDeclaration');
	for (const node of imports.reverse()) source = source.slice(0, node.start) + source.slice(node.end);
	source = source.replace(/export default/g, 'const defaultExport =').replace(/export (const|function)/g, '$1');
	return vm.runInNewContext(source + '\n;({' + names.join(',') + '})', globals);
}

function setup() {
	const memory = new Map();
	let failWrite = false;
	const window = { localStorage: {
		getItem: key => memory.get(key) || null,
		setItem: (key, value) => { if (failWrite) throw new Error('storage unavailable'); memory.set(key, value); }
	}, jsBridge: { inApp: false } };
	const globals = { window, getCurrentPages: () => [{ route: 'pages/users/clientSet' }], console };
	const router = evaluate(read('common/native-router.js'), ['resolveRouteUrl', 'installNativeRouter'], globals);
	const preference = evaluate(read('common/ai-preference.js'), [
		'AI_DISABLED_STORAGE_KEY', 'readAiAssistanceDisabled', 'persistAiAssistanceDisabled', 'syncAiPreference', 'isAiFeatureRoute', 'installAiNavigationGuard'
	], { ...globals, ...router });
	const definition = evaluate(read('store/index.js'), ['store'], {
		...preference, Vue: { use() {} }, Vuex: { Store: function(definition) { return definition; } }
	}).store;
	const store = { state: definition.state,
		commit: (name, value) => definition.mutations[name](definition.state, value),
		dispatch: async (name, value) => definition.actions[name]({ commit: store.commit }, value)
	};
	return { memory, window, router, preference, store, failWrite: value => { failWrite = value; } };
}

function method(file, section, name, globals = {}) {
	const script = read(file).match(/<script>([\s\S]*?)<\/script>/)[1];
	const component = parser.parse(script, { sourceType: 'module' }).program.body.find(node => node.type === 'ExportDefaultDeclaration').declaration;
	const container = section ? component.properties.find(node => node.key && node.key.name === section).value : component;
	const node = container.properties.find(node => node.key && node.key.name === name);
	assert.ok(node, file + ': ' + name);
	return vm.runInNewContext('({' + script.slice(node.start, node.end) + '}).' + name, globals);
}

test('默认不禁用；开关持久化，重启读取可恢复；非明确 true 不禁用', async () => {
	const state = setup();
	assert.equal(state.store.state.aiAssistanceDisabled, false);
	await state.store.dispatch('setAiAssistanceDisabled', true);
	assert.equal(state.preference.readAiAssistanceDisabled(), true);
	assert.equal(state.store.state.aiAssistanceDisabled, true);
	const second = { state: { aiAssistanceDisabled: false }, commit(name, value) { this.state.aiAssistanceDisabled = value; } };
	state.preference.syncAiPreference(second);
	assert.equal(second.state.aiAssistanceDisabled, true);
	await state.store.dispatch('setAiAssistanceDisabled', false);
	state.preference.syncAiPreference(second);
	assert.equal(second.state.aiAssistanceDisabled, false);
	for (const raw of ['false', '1', 'invalid']) {
		state.memory.set(state.preference.AI_DISABLED_STORAGE_KEY, raw);
		assert.equal(state.preference.readAiAssistanceDisabled(), false);
	}
});

test('存储失败不提交开关状态，设置页反馈失败且可重试', async () => {
	const state = setup(); state.failWrite(true);
	const toasts = [];
	const change = method('pages/users/clientSet.vue', 'methods', 'changeAiPreference', { uni: { showToast: value => toasts.push(value) } });
	const instance = { $store: state.store, $t: key => key, savingAiPreference: false, aiSwitchRevision: 0 };
	await change.call(instance, { detail: { value: true } });
	assert.equal(state.store.state.aiAssistanceDisabled, false);
	assert.equal(instance.savingAiPreference, false);
	assert.equal(instance.aiSwitchRevision, 1);
	assert.equal(toasts[0].title, 'settings.ai.saveFailed');
	state.failWrite(false);
	await change.call(instance, { detail: { value: true } });
	assert.equal(state.store.state.aiAssistanceDisabled, true);
});

test('原生路由和普通路由均阻止 AI 深链与相对路径，其他功能正常', async () => {
	const state = setup();
	let nativeCalls = 0, uniCalls = 0, notifications = 0, failed = 0, completed = 0;
	state.window.jsBridge = {
		inApp: true, nativeRouterAvailable: true,
		nativeNavigateTo: async () => { nativeCalls++; return { ok: true }; },
		nativeRedirectTo: async () => { nativeCalls++; return { ok: true }; },
		nativeReLaunch: async () => { nativeCalls++; return { ok: true }; }
	};
	const uni = Object.fromEntries(['navigateTo', 'redirectTo', 'reLaunch'].map(name => [name, () => { uniCalls++; }]));
	state.router.installNativeRouter(uni);
	state.preference.installAiNavigationGuard(uni, state.store, () => { notifications++; });
	await state.store.dispatch('setAiAssistanceDisabled', true);
	for (const native of [true, false]) {
		state.window.jsBridge.inApp = native;
		for (const name of ['navigateTo', 'redirectTo', 'reLaunch']) {
			for (const url of ['/pages/redstone/index?amount=2', '../readers/askLogGirl?novel_id=1', '../writers/essayIndexing?id=1']) {
				await uni[name]({ url, fail: () => { failed++; }, complete: () => { completed++; } });
			}
		}
	}
	assert.equal(nativeCalls, 0); assert.equal(uniCalls, 0);
	assert.equal(notifications, 18); assert.equal(failed, 18); assert.equal(completed, 18);
	await uni.navigateTo({ url: '/pages/membership/index' });
	await uni.navigateTo({ url: '/pages/writers/essayCollaborationSettings?id=1' });
	assert.equal(uniCalls, 2);
	await state.store.dispatch('setAiAssistanceDisabled', false);
	state.window.jsBridge.inApp = true;
	await uni.navigateTo({ url: '/pages/readers/askLogGirl?novel_id=1' });
	assert.equal(nativeCalls, 1);
});

test('外部页面直接加载 AI 页面时返回安全页面，不影响普通页面', () => {
	const state = setup(); state.preference.persistAiAssistanceDisabled(true);
	const events = [];
	const mixin = evaluate(read('mixins/ai-assistance.js'), ['defaultExport'], {
		...state.preference, getCurrentPages: () => [],
		uni: { showToast: value => events.push(value.title), switchTab: value => events.push(value.url) }
	}).defaultExport;
	const instance = { $store: state.store, $t: key => key };
	Object.defineProperty(instance, 'aiAssistanceEnabled', { get: () => mixin.computed.aiAssistanceEnabled.call(instance) });
	assert.equal(mixin.methods.ensureAiPageAllowed.call(instance), false);
	assert.equal(events[1], '/pages/me');
	state.preference.persistAiAssistanceDisabled(false);
	assert.equal(mixin.methods.ensureAiPageAllowed.call(instance), true);
});

test('禁用后不发起纠错、问答、索引或红石查询请求', async () => {
	const targets = [
		['pages/writers/workPublish.vue', 'runSmartCorrection'],
		['pages/writers/workPublish.vue', 'runSmartCorrectionStreaming'],
		['pages/writers/workPublish.vue', 'fetchSmartCorrectionStream'],
		['pages/readers/askLogGirl.vue', 'resumePendingReplyIfNeeded'],
		['pages/readers/askLogGirl.vue', 'submitQuestion'],
		['pages/readers/askLogGirl.vue', 'streamChat'],
		['pages/readers/askLogGirl.vue', 'loadNovelIndexStatus'],
		['pages/writers/essayIndexing.vue', 'requestNovelIndexingNow'],
		['pages/writers/essayIndexing.vue', 'refreshIndexingStatus'],
		['pages/redstone/index.vue', 'loadData'],
		['pages/me.vue', 'refreshRedstoneBalance'],
		['components/redstone-cost/RedstoneCost.vue', 'toggleTooltip']
	];
	for (const [file, name] of targets) await method(file, 'methods', name).call({ aiAssistanceEnabled: false });
	// 已加载 AI 页面也不能恢复后台请求。
	for (const file of ['pages/readers/askLogGirl.vue', 'pages/writers/essayIndexing.vue', 'pages/redstone/index.vue']) {
		method(file, null, 'onShow').call({ ensureAiPageAllowed: () => false });
	}
});

test('禁用期间关闭纠错/问答流和索引轮询，不改变正文或快捷设置', () => {
	let stopped = 0;
	const publish = { _smartCorrectionAbortController: { abort: () => { stopped++; } }, activeCorrection: {}, smartThinkingVisible: true, article: { content: '正文' } };
	method('pages/writers/workPublish.vue', 'watch', 'aiAssistanceEnabled').call(publish, false);
	assert.equal(stopped, 1); assert.equal(publish.activeCorrection, null); assert.equal(publish.article.content, '正文');
	const reader = Object.fromEntries(['abortActiveRequest', 'clearAutoScrollTimer', 'unregisterWindowScrollListener', 'stopAllTypewriters', 'stopAllThinkingTypewriters', 'stopThinkingHintRotation'].map(name => [name, () => { stopped++; }]));
	method('pages/readers/askLogGirl.vue', 'watch', 'aiAssistanceEnabled').call(reader, false);
	assert.equal(stopped, 7);
	method('pages/writers/essayIndexing.vue', 'watch', 'aiAssistanceEnabled').call({ stopIndexStatusPolling: () => { stopped++; } }, false);
	assert.equal(stopped, 8);
});

test('编辑器全部 AI 工具隐藏后可恢复，用户原有工具配置不被删除', () => {
	const tools = { writerAi: { id: 'writerAi', action: 'writerAi' }, publish: { id: 'publish', action: 'publish' } };
	const globals = { normalizeNavToolIds: ids => ids, TOOL_DEFINITIONS: tools };
	const get = method('pages/writers/chapterEditorNew.vue', 'computed', 'toolbarSettingsItems', globals);
	const instance = { aiAssistanceEnabled: false, writerSettings: { navToolIds: ['writerAi', 'publish'] } };
	assert.equal(get.call(instance).length, 1);
	assert.deepEqual(instance.writerSettings.navToolIds, ['writerAi', 'publish']);
	instance.aiAssistanceEnabled = true;
	assert.equal(get.call(instance).length, 2);
	const keyboard = method('pages/writers/chapterEditorNew.vue', 'computed', 'quickInputToolbarItems', {
		TOOL_DEFINITIONS: tools, normalizeQuickInputs: () => [], normalizeKeyboardShortcutItems: items => items
	});
	instance.writerSettings.keyboardShortcutItems = [{ type: 'tool', id: 'writerAi' }, { type: 'tool', id: 'publish' }];
	instance.aiAssistanceEnabled = false;
	assert.equal(keyboard.call(instance).length, 1);
	instance.aiAssistanceEnabled = true;
	assert.equal(keyboard.call(instance).length, 2);
	method('pages/writers/chapterEditorNew.vue', 'methods', 'openWriterAiAssistant').call({ aiAssistanceEnabled: false });
});

test('所有已知入口受控，AI 辅助不会误禁用多人协作/普通发布', () => {
	for (const file of ['pages/me.vue', 'pages/readers/bookInfo.vue', 'pages/writers/essaySet.vue', 'pages/writers/workPublish.vue', 'pages/membership/rules.vue', 'pages/writers/chapterEditorNew.vue']) {
		assert.match(read(file).slice(0, read(file).lastIndexOf('</template>')), /v-if="[^"]*aiAssistanceEnabled/);
	}
	assert.match(read('pages/writers/workPublish.vue'), /membershipActive && this.aiAssistanceEnabled/);
	assert.match(read('pages/writers/chapterToolbarSettings.vue'), /v-show="aiAssistanceEnabled \|\| tool.id !== 'writerAi'"/);
	for (const language of ['zh-CN', 'en']) assert.ok(JSON.parse(read(`i18n/messages/${language}.settings.json`)).settings.ai.disable);
	const state = setup();
	for (const route of ['pages/writers/workPublish', 'pages/writers/chapterEditorNew', 'pages/writers/essayCollaborationSettings', 'pages/membership/index']) assert.equal(state.preference.isAiFeatureRoute(route), false);
});

test('作品详情底栏不为隐藏的 AI 按钮预留宽度，阅读按钮填充剩余空间', () => {
	const source = read('pages/readers/bookInfo.vue');
	const styles = source.slice(source.indexOf('<style'));
	const rule = selector => styles.match(new RegExp('\\.' + selector + '\\s*\\{([^}]+)\\}'))[1];
	assert.match(rule('l-buy-btn'), /flex:\s*1\s+1\s+0\s*;/);
	assert.doesNotMatch(rule('l-buy-btn'), /(?:^|\n)\s*width:/);
	assert.match(rule('l-look-btn'), /flex:\s*0\s+0\s+24%\s*;/);
	assert.match(rule('l-ai-btn'), /flex:\s*0\s+0\s+24%\s*;/);
	assert.match(rule('l-handle-btn'), /min-width:\s*0\s*;/);
	assert.match(rule('l-body-fixed'), /padding:\s*0\s+0\s+var\(--loghome-safe-bottom, 0px\)/);
});
