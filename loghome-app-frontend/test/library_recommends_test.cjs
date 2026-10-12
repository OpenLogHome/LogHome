const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sfc = require('vue/compiler-sfc');
const source = fs.readFileSync(path.resolve(__dirname, '../pages/library.vue'), 'utf8');

function load(get, overrides = {}) {
	const sandbox = {
		module: { exports: {} }, axios: { get },
		uni: { hideLoading() {}, showToast() {}, setStorageSync() {} },
		console: { error() {} },
		...overrides,
	};
	for (const name of ['LogPowerWordmark', 'bookInCase', 'popup', 'banner', 'bookshelfHorizontal', 'MescrollMixin', 'darkModeMixin', 'HorizontalTags', 'HaycraftMark', 'HomeRankBoard']) sandbox[name] = {};
	const script = source.split('<script>')[1].split('</script>')[0].replace(/^\s*import .*;?\s*$/gm, '').replace('export default', 'module.exports =');
	vm.runInNewContext(script, sandbox);
	const options = sandbox.module.exports;
	const instance = { ...options.data(), ...options.methods, $baseUrl: 'https://api.example', $nextTick() {}, $refs: {}, persistFirstScreenCache() {}, mescroll: { endSuccess() {}, endErr() {} } };
	return { options, instance };
}

test('library template compiles including configured Banner, rank board and collection branches', () => {
	const descriptor = sfc.parse({ source, filename: 'library.vue' });
	const result = sfc.compileTemplate({ source: (descriptor.descriptor || descriptor).template.content, filename: 'library.vue' });
	assert.deepEqual(result.errors, []);
});

test('disabled blocks are filtered, ordering includes Banner and special blocks skip work requests', async () => {
	const calls = [];
	const { instance } = load(async (url, config) => {
		calls.push({ url, config });
		return { data: url.endsWith('get_library_collections') ? [
			{ collection_id: 3, collection_title: 'A&B', isValid: 1 },
			{ collection_id: 2, collection_title: '最近更新', isValid: 1 },
			{ collection_id: 1, collection_title: 'banner', isValid: '1' },
			{ collection_id: 4, collection_title: '已禁用', isValid: 0 },
		] : [{ novel_id: 22 }] };
	});
	await instance.refreshFirstScreenRecommends();
	assert.deepEqual(Array.from(instance.collections, item => item.collection_title), ['banner', '最近更新', 'A&B']);
	assert.equal(calls.length, 2);
	assert.equal(calls[1].config.params.title, 'A&B');
	assert.equal(instance.collections[2].novels[0].novel_id, 22);
});

test('outdated requests cannot overwrite a newer enabled/disabled configuration', async () => {
	const pending = [];
	const { instance } = load(() => new Promise(resolve => pending.push(resolve)));
	const first = instance.refreshFirstScreenRecommends();
	const second = instance.refreshFirstScreenRecommends();
	pending[1]({ data: [{ collection_id: 1, collection_title: 'banner', isValid: 1 }] });
	await second;
	pending[0]({ data: [] });
	await first;
	assert.equal(instance.collections[0].collection_title, 'banner');
});

test('load more sends page/size, appends distinct works and stops on the final page', async () => {
	const calls = [], completions = [];
	const pages = [[{ novel_id: 1 }, { novel_id: 2 }], [{ novel_id: 2 }, { novel_id: 3 }], []];
	const { instance } = load(async (url, config) => { calls.push(config.params); return { data: pages.shift() }; });
	instance.mescroll.endSuccess = (length, hasNext) => completions.push({ length, hasNext });
	for (const num of [1, 2, 3]) await instance.getMoreNovels({ num, size: 2 });
	assert.deepEqual(calls.map(call => call.page), [1, 2, 3]);
	assert.ok(calls.every(call => call.amount === 2));
	assert.deepEqual(Array.from(instance.books, item => item.novel_id), [1, 2, 3]);
	assert.equal(completions.at(-1).hasNext, false);
});

test('Android nested scroll container triggers load more only near its bottom', () => {
	const listeners = new Map();
	const root = { scrollTop: 200, clientHeight: 600, scrollHeight: 1600, addEventListener(name, cb) { listeners.set(this, cb); } };
	const doc = { scrollingElement: root, documentElement: root, body: root, querySelector: () => root };
	const win = { pageYOffset: 0, addEventListener() {} };
	let bottomCalls = 0;
	const { instance } = load(async () => ({ data: [] }), { document: doc, window: win });
	instance.mescroll = { onPageScroll() {}, onReachBottom() { bottomCalls++; } };
	instance.setupLibraryScrollTracking();
	listeners.get(root)({ target: root });
	assert.equal(bottomCalls, 0);
	root.scrollTop = 950;
	listeners.get(root)({ target: root });
	assert.equal(bottomCalls, 1);
});

test('management recognizes string flags and switches the selected title after rename', async () => {
	const file = path.resolve(__dirname, '../../loghome-manage/src/views/library/LibraryRecommendsManage.vue');
	const adminSource = fs.readFileSync(file, 'utf8');
	const sandbox = { module: { exports: {} }, ImageUploadField: {} };
	vm.runInNewContext(adminSource.split('<script>')[1].split('</script>')[0].replace(/^import .*$/gm, '').replace('export default', 'module.exports ='), sandbox);
	const options = sandbox.module.exports;
	let refreshedTitles = 0, refreshedCollections = 0;
	const admin = {
		...options.data(), ...options.methods,
		$nextTick(cb) { cb(); },
		$refs: { collectionForm: { clearValidate() {}, validate(cb) { cb(true); } } },
		$message: { success() {}, error(message) { throw Error(message); } },
		$baseUrl: 'https://api.example',
		axios: { put: async (url, payload) => { assert.equal(payload.collection_title, '新合集'); } },
		refreshTitles() { refreshedTitles++; }, fetchCollections() { refreshedCollections++; },
	};
	const row = { collection_id: 2, collection_title: '旧合集', collection_type: 'slide', isValid: '1' };
	admin.collections = [row];
	admin.selectedTitle = '旧合集';
	admin.openCollectionDialog(row);
	assert.equal(admin.collectionForm.isValid, true);
	admin.collectionForm.collection_title = '新合集';
	admin.submitCollectionForm();
	await new Promise(resolve => setImmediate(resolve));
	assert.equal(admin.selectedTitle, '新合集');
	assert.equal(refreshedTitles, 1);
	assert.equal(refreshedCollections, 1);
	assert.equal(admin.collectionSubmitLoading, false);
});
