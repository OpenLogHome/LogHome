const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sfc = require('vue/compiler-sfc');

const file = path.resolve(__dirname, '../pages/writers/workPublish.vue');
const source = fs.readFileSync(file, 'utf8');
const parsed = sfc.parse({ source, filename: file });
const descriptor = parsed.descriptor || parsed;

function mountFixture({ ownerId = 7, isPersonal = true, missingStatus = false, post = async () => ({ data: { affectedRows: 1 } }) } = {}) {
	const mod = { exports: {} };
	const dialogs = [];
	const toasts = [];
	const requests = [];
	const reads = [];
	const axios = {
		post: async (...args) => { requests.push(args); return post(...args); },
		get: async (...args) => {
			reads.push(args);
			const novel = { novel_id: 12, author_id: ownerId, is_personal: isPersonal ? 1 : 0, name: '测试作品' };
			if (args[0].includes('/get_novel_by_id')) return { data: [novel] };
			if (missingStatus) delete novel.is_personal;
			return { data: { novel } };
		},
	};
	const uni = { showModal: options => dialogs.push(options), showToast: options => toasts.push(options) };
	const script = descriptor.script.content
		.replace(/^import[\s\S]*?from\s*["'][^"']+["'];?/gm, '')
		.replace('export default', 'module.exports =');
	vm.runInNewContext(script, { module: mod, axios, uni, RedstoneCost: {}, setTimeout, clearTimeout });
	const component = mod.exports;
	const state = component.data();
	state.$baseUrl = 'https://test.invalid';
	state.article = { ...state.article, novelId: 12, novelOwnerId: ownerId, isPersonal };
	state.getCurrentUserId = () => 7;
	state.getAuthToken = () => 'token';
	state.persistCurrentPublishDraft = () => { state.draftSaved = true; };
	for (const [name, method] of Object.entries(component.methods)) {
		if (!Object.hasOwn(state, name)) state[name] = method.bind(state);
	}
	Object.defineProperty(state, 'canMakeNovelPublic', { get: () => component.computed.canMakeNovelPublic.call(state) });
	return { component, state, dialogs, toasts, requests, reads };
}

test('未公开作品显示作者操作，公开前提示已发布章节也会可见', () => {
	const compiled = sfc.compileTemplate({ source: descriptor.template.content, filename: file });
	assert.equal(compiled.errors.length, 0, JSON.stringify(compiled.errors));
	assert.match(descriptor.template.content, /v-if="article\.isPersonal" class="card visibility-card"/);
	assert.match(descriptor.template.content, /v-if="canMakeNovelPublic"/);
	const { state, dialogs, requests } = mountFixture();
	assert.equal(state.canMakeNovelPublic, true);
	state.makeNovelPublic();
	assert.equal(dialogs.length, 1);
	assert.match(dialogs[0].content, /已发布章节/);
	assert.equal(requests.length, 0);
	dialogs[0].success({ confirm: false });
	assert.equal(requests.length, 0);
});

test('发布页通过鉴权的轻量接口刷新作品公开状态', async () => {
	const fixture = mountFixture({ ownerId: 7, isPersonal: true });
	fixture.state.getAuthToken = () => 'author-token';
	await fixture.state.refreshNovelPublishState();
	assert.equal(fixture.reads[0][0], 'https://test.invalid/essays/get_novel_collaboration_info?novel_id=12');
	assert.equal(fixture.reads[0][1].headers.Authorization, 'Bearer author-token');
	assert.equal(fixture.state.article.isPersonal, true);
	assert.equal(fixture.state.article.novelOwnerId, 7);
	assert.equal(fixture.state.canMakeNovelPublic, true);
});

test('旧版后端未返回公开字段时安全回退到现有作品详情接口', async () => {
	const fixture = mountFixture({ missingStatus: true });
	await fixture.state.refreshNovelPublishState();
	assert.equal(fixture.reads.length, 2);
	assert.match(fixture.reads[1][0], /\/essays\/get_novel_by_id\?id=12$/);
	assert.equal(fixture.state.article.isPersonal, true);
});

test('只有作者可设为公开，成功后更新页面和本地发布草稿', async () => {
	const owner = mountFixture();
	await owner.state.confirmMakeNovelPublic();
	assert.equal(owner.requests.length, 1);
	assert.equal(owner.requests[0][0], 'https://test.invalid/essays/set_novel_status');
	assert.deepEqual(JSON.parse(JSON.stringify(owner.requests[0][1])), { novel_id: 12, is_personal: 0 });
	assert.equal(owner.state.article.isPersonal, false);
	assert.equal(owner.state.draftSaved, true);
	assert.equal(owner.state.visibilityChanging, false);

	const collaborator = mountFixture({ ownerId: 8 });
	assert.equal(collaborator.state.canMakeNovelPublic, false);
	await collaborator.state.confirmMakeNovelPublic();
	assert.equal(collaborator.requests.length, 0);
});

test('公开失败保持未公开；正式发布前重新核实服务端状态', async () => {
	const failed = mountFixture({ post: async () => { throw new Error('network'); } });
	await failed.state.confirmMakeNovelPublic();
	assert.equal(failed.state.article.isPersonal, true);
	assert.equal(failed.state.visibilityChanging, false);
	assert.match(failed.toasts.at(-1).title, /公开失败/);

	const stale = mountFixture({ isPersonal: false });
	stale.state.article.isPersonal = false;
	stale.state.validateArticle = () => true;
	stale.state.validateScheduleTime = () => true;
	stale.state.refreshNovelPublishState = async () => { stale.state.article.isPersonal = true; };
	await stale.state.submitPublish();
	assert.equal(stale.requests.length, 0);
	assert.equal(stale.state.submitLoading, false);
	assert.match(stale.toasts.at(-1).title, /先设为公开/);
});

test('服务端已公开时能恢复状态，本地草稿写入失败不误报公开失败', async () => {
	const alreadyPublic = mountFixture({
		post: async () => ({ data: { affectedRows: 0 } }),
	});
	alreadyPublic.state.refreshNovelPublishState = async () => {
		alreadyPublic.state.article.isPersonal = false;
	};
	alreadyPublic.state.persistCurrentPublishDraft = () => { throw new Error('storage full'); };
	await alreadyPublic.state.confirmMakeNovelPublic();
	assert.equal(alreadyPublic.state.article.isPersonal, false);
	assert.match(alreadyPublic.toasts.at(-1).title, /作品已公开/);
});
