const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const parser = require('@babel/parser');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'components/worldsPage.vue'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
const component = parser.parse(script, { sourceType: 'module' }).program.body.find(node => node.type === 'ExportDefaultDeclaration').declaration;

function setup(request = async () => ({ data: { insertId: 1 } })) {
	const calls = [], toasts = [];
	let token = JSON.stringify({ tk: 'test-token' }), refreshes = 0;
	const options = vm.runInNewContext('(' + script.slice(component.start, component.end) + ')', {
		axios: { get: async (...args) => { calls.push(args); return request(...args); } },
		uni: { showToast: options => toasts.push(options) },
		window: { localStorage: { getItem: () => token } },
		MangaIcon: {}, MangaA11y: {}, darkModeMixin: {},
	});
	const instance = { ...options.data(), ...options.methods, $baseUrl: 'https://example.invalid', refreshPage: () => { refreshes++; } };
	return { instance, options, calls, toasts, setToken: value => { token = value; }, refreshes: () => refreshes };
}

test('自定义世界弹窗具备漫画同款布局，取消和重新打开不会提交', () => {
	const ctx = setup(), instance = ctx.instance;
	instance.createNewWorld();
	assert.equal(instance.showCreateDialog, true);
	assert.equal(instance.createForm.name, '');
	instance.createForm.name = '草稿';
	instance.closeCreateDialog();
	assert.equal(instance.showCreateDialog, false);
	instance.createNewWorld();
	assert.equal(instance.createForm.name, '');
	assert.equal(ctx.calls.length, 0);
	assert.doesNotMatch(source, /uni\.showModal/);
	assert.match(source, /role="dialog" aria-modal="true" aria-labelledby="create-world-title"/);
	assert.match(source, /@include manga-theme/);
	assert.match(source, /@click\.self="closeCreateDialog"/);
});

test('空白名称不提交，成功后关闭弹窗并刷新世界列表，保留原有接口', async () => {
	const ctx = setup(), instance = ctx.instance;
	instance.createNewWorld(); instance.createForm.name = '  ';
	await instance.createWorld();
	assert.equal(ctx.calls.length, 0);
	instance.createForm.name = '  世界 & 星河? #1  ';
	await instance.createWorld();
	assert.equal(ctx.calls[0][0], 'https://example.invalid/world/create_world');
	assert.equal(ctx.calls[0][1].params.world_name, '世界 & 星河? #1');
	assert.equal(ctx.calls[0][1].headers.Authorization, 'Bearer test-token');
	assert.equal(instance.showCreateDialog, false);
	assert.equal(instance.creating, false);
	assert.equal(ctx.refreshes(), 1);
	assert.equal(ctx.toasts[0].title, '创建成功');
});

test('创建中禁止重复提交和关闭，失败保留名称以便重试', async () => {
	let reject;
	const ctx = setup(() => new Promise((_, fail) => { reject = fail; }));
	const instance = ctx.instance;
	instance.createNewWorld(); instance.createForm.name = '重试世界';
	const pending = instance.createWorld();
	assert.equal(instance.creating, true);
	await instance.createWorld(); instance.closeCreateDialog(); instance.createNewWorld();
	assert.equal(ctx.calls.length, 1);
	assert.equal(instance.showCreateDialog, true);
	assert.equal(instance.createForm.name, '重试世界');
	reject(new Error('network unavailable')); await pending;
	assert.equal(instance.creating, false);
	assert.equal(instance.showCreateDialog, true);
	assert.equal(instance.createForm.name, '重试世界');
	assert.equal(ctx.refreshes(), 0);
	assert.equal(ctx.toasts[0].title, '创建失败，请稍后重试');
});

test('未登录或凭据损坏时不发送创建请求，不会卡在创建中', async () => {
	for (const token of [null, '{}', 'broken-json']) {
		const ctx = setup(); ctx.setToken(token);
		ctx.instance.createNewWorld(); ctx.instance.createForm.name = '世界';
		await ctx.instance.createWorld();
		assert.equal(ctx.calls.length, 0);
		assert.equal(ctx.instance.creating, false);
		assert.equal(ctx.instance.showCreateDialog, true);
		assert.equal(ctx.toasts.length, 1);
	}
});

test('世界栏传入当前栏索引，修正 transformed 轨道中的 fixed 弹窗定位', () => {
	const ctx = setup();
	assert.equal(ctx.options.props.activeIndex.default, 0);
	assert.equal(ctx.options.computed.maskStyle.call({ activeIndex: 2 }).left, '200vw');
	assert.equal(ctx.options.computed.maskStyle.call({ activeIndex: 2 }).width, '100vw');
	const essays = fs.readFileSync(path.join(root, 'pages/essays.vue'), 'utf8');
	assert.match(essays, /<worldPage ref="worldPage" :active-index="topNavIndex"/);
	assert.match(source, /@touchstart\.stop @touchmove\.stop @touchend\.stop/);
});
