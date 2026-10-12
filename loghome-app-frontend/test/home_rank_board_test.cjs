const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sfc = require('vue/compiler-sfc');

function readComponent(file) {
	const source = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
	const parsed = sfc.parse({ source, filename: file });
	const descriptor = parsed.descriptor || parsed;
	assert.equal(sfc.compileTemplate({ source: descriptor.template.content, filename: file }).errors.length, 0, file);
	return source;
}

function loadComponentOptions(file, sandbox) {
	const source = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
	const scriptStart = source.indexOf('<script>');
	const scriptEnd = source.indexOf('</script>');
	const script = source.slice(scriptStart + '<script>'.length, scriptEnd)
		.replace(/^\s*import .*;?\s*$/gm, '')
		.replace('export default', 'module.exports =');
	vm.runInNewContext(script, sandbox, { filename: file });
	return sandbox.module.exports;
}

function makeVm(navigateTo) {
	return {
		module: { exports: {} },
		axios: { get: async () => ({ data: { board: 'update', zone: 'novel', snapshot_date: null, items: [] } }) },
		uni: { navigateTo: (options) => navigateTo.push(options.url), showToast() {} },
		darkModeMixin: {},
		HaycraftMark: {},
		RankWorkTitle: {},
		LogPowerWordmark: {},
	};
}

test('home-rank-board：四榜四专区切换并调用榜单接口', async () => {
	const source = readComponent('components/home-rank-board.vue');
	assert.match(source, /key: 'update'[\s\S]*key: 'logpower'[\s\S]*key: 'complete'[\s\S]*key: 'new'/);
	assert.match(source, /key: 'all'[\s\S]*key: 'novel'[\s\S]*key: 'manga'[\s\S]*key: 'world'/);
	assert.match(source, /\/library\/rank\/get_rank_board\?board=' \+ board/);
	assert.match(source, /pages\/readers\/rankBoard\?board=' \+ this\.currentBoard \+ '&zone=' \+ this\.currentZone/);
	assert.match(source, /rank-top/, '前三名应有大号强调样式');

	const requestedUrls = [];
	const sandbox = makeVm([]);
	sandbox.axios = { get: async (url) => { requestedUrls.push(url); return { data: { board: 'logpower', zone: 'manga', snapshot_date: '2026-10-07', items: [{ novel_id: 7, novel_type: 'manga', name: '榜一', is_haycraft: 1 }] } }; } };
	const options = loadComponentOptions('components/home-rank-board.vue', sandbox);

	const vmInstance = {
		...options.methods,
		...options.data(),
		$nextTick() {},
		$baseUrl: 'http://127.0.0.1:9000',
		$backupResources: { bookCover: '' },
	};
	await options.mounted.call(vmInstance);
	assert.equal(requestedUrls.length, 1);
	assert.match(requestedUrls[0], /board=update&zone=all/);

	await vmInstance.switchBoard('logpower');
	assert.equal(requestedUrls.length, 2);
	assert.match(requestedUrls[1], /board=logpower&zone=all/);
	await vmInstance.switchZone('manga');
	assert.equal(requestedUrls.length, 3);
	assert.match(requestedUrls[2], /board=logpower&zone=manga/);
	assert.equal(vmInstance.currentBoard, 'logpower');
	assert.equal(vmInstance.currentZone, 'manga');
	assert.equal(vmInstance.items.length, 1);
	assert.equal(vmInstance.isHayCraftWork(vmInstance.items[0]), true);
	assert.equal(vmInstance.loading, false);
	// 缓存命中：切回再切回不再发请求
	await vmInstance.switchZone('novel');
	const before = requestedUrls.length;
	await vmInstance.switchZone('manga');
	assert.equal(requestedUrls.length, before, '同 board:zone 10 分钟内应命中缓存');
});

test('home-rank-board：点击条目按类型跳转详情页', async () => {
	const navigateTo = [];
	const sandbox = makeVm(navigateTo);
	const options = loadComponentOptions('components/home-rank-board.vue', sandbox);
	const vmInstance = { ...options.methods, ...options.data() };
	vmInstance.openNovel({ novel_id: 5, novel_type: 'manga' });
	vmInstance.openNovel({ novel_id: 6, novel_type: 'novel' });
	assert.deepEqual(navigateTo, [
		'/pages/readers/mangaInfo?id=5',
		'/pages/readers/bookInfo?id=6',
	]);
});

test('完整榜单页：模板可编译，支持榜单/专区切换、分页与快照时间展示', async () => {
	const source = readComponent('pages/readers/rankBoard.vue');
	assert.match(source, /\/library\/rank\/get_rank_board\?board=' \+ this\.currentBoard/);
	assert.match(source, /snapshot_date/);
	assert.match(source, /loadMore/);
	assert.match(source, /@refresherrefresh=/, '使用列表局部下拉刷新');

	const pagesJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'pages.json'), 'utf8'));
	assert.ok(pagesJson.pages.some((page) => page.path === 'pages/readers/rankBoard'), 'pages.json 应注册 rankBoard');
});

test('首页：最近更新与 Banner 按启用合集配置渲染，不重复拉取特殊合集作品', () => {
	const library = readComponent('pages/library.vue');
	assert.match(library, /<template v-for="item in collections">/);
	assert.match(library, /<home-rank-board v-if="item.collection_title === '最近更新'"/);
	assert.match(library, /<banner v-else-if="item.collection_title === 'banner'"/);
	assert.match(library, /Number\(item.isValid\) === 1/);
	assert.match(library, /LIBRARY_FIRST_SCREEN_CACHE_VERSION = 4/);
	assert.match(library, /if \(item.collection_title === 'banner' \|\| item.collection_title === '最近更新'\) return/);
});

function homeInstance(sandbox = makeVm([])) {
	const options = loadComponentOptions('components/home-rank-board.vue', sandbox);
	const instance = { ...options.methods, ...options.data(), $baseUrl: '', $nextTick() {} };
	for (const [key, get] of Object.entries(options.computed)) Object.defineProperty(instance, key, { get: () => get.call(instance) });
	return instance;
}
const rankedItems = (count) => Array.from({ length: count }, (_, i) => ({ novel_id: i + 1, novel_type: ['novel', 'manga', 'world'][i % 3] }));

test('列滑动：每次只移动一列，末屏下一次滑动才切分类', async () => {
	const home = homeInstance();
	home.loading = false;
	home.items = rankedItems(12);
	assert.equal(home.maxColumnIndex, 1);
	await home.moveColumn(1);
	assert.equal(home.columnIndex, 1);
	assert.equal(home.currentZone, 'all');
	home.gestureLockUntil = 0;
	await home.moveColumn(-1);
	assert.equal(home.columnIndex, 0);
	home.gestureLockUntil = 0;
	await home.moveColumn(1);
	home.gestureLockUntil = 0;
	await home.moveColumn(1);
	assert.equal(home.currentZone, 'novel');
	assert.equal(home.columnIndex, 0);
});

test('顺序：遍历四榜四分类，最后一屏再左滑仅跳转更多一次', async () => {
	const navigation = [];
	const sandbox = makeVm(navigation);
	sandbox.axios.get = async () => ({ data: { items: rankedItems(12) } });
	const home = homeInstance(sandbox);
	await home.loadBoard();
	const visited = [];
	for (let step = 0; step < 32; step++) {
		if (home.columnIndex === 0) visited.push(home.currentBoard + ':' + home.currentZone);
		home.gestureLockUntil = 0;
		await home.moveColumn(1);
	}
	assert.deepEqual(visited, ['update', 'logpower', 'complete', 'new'].flatMap(board => ['all', 'novel', 'manga', 'world'].map(zone => board + ':' + zone)));
	assert.deepEqual(navigation, ['/pages/readers/rankBoard?board=new&zone=world']);
	await home.moveColumn(1);
	assert.equal(navigation.length, 1, '动画锁防止一个手势重复跳转');
});

test('占位：空榜、缺项和末列均补全，真实作品顺序不变', () => {
	const home = homeInstance();
	home.loading = false;
	assert.equal(home.columns.length, 2);
	assert.equal(home.columns.flat().filter(Boolean).length, 0);
	home.items = rankedItems(3);
	assert.equal(home.columns.flat().filter(item => !item).length, 5);
	home.items = rankedItems(9);
	assert.deepEqual(Array.from(home.columns.flat().filter(Boolean), item => item.novel_id), [1,2,3,4,5,6,7,8,9]);
	assert.equal(home.columns[2].filter(item => !item).length, 3);
	home.visibleColumns = 1;
	assert.equal(home.maxColumnIndex, 2);
});

test('手势：纵向滚动和轻触不翻页，水平拖拽吸附且不误开书', async () => {
	const navigation = [];
	const home = homeInstance(makeVm(navigation));
	home.loading = false;
	home.items = rankedItems(12);
	const touch = (x,y) => ({ changedTouches: [{ clientX:x, clientY:y }] });
	home.startGesture(touch(200,100));
	home.moveGesture(touch(180,200));
	await home.endGesture(touch(100,220));
	assert.equal(home.columnIndex, 0);
	home.startGesture(touch(200,100));
	home.moveGesture(touch(110,105));
	assert.equal(home.dragOffset, -90);
	await home.endGesture(touch(100,105));
	assert.equal(home.columnIndex, 1);
	assert.equal(home.dragOffset, 0);
	home.openNovel(home.items[0]);
	assert.equal(navigation.length, 0);
	home.gestureLockUntil = 0;
	home.startGesture(touch(200,100));
	home.cancelGesture();
	await home.endGesture(touch(100,100));
	assert.equal(home.currentZone, 'all');
});

test('横向滚轮惯性：同一连续手势只前进一列', () => {
	const home = homeInstance();
	home.loading = false;
	home.items = rankedItems(12);
	home.onWheel({ deltaX:50, deltaY:0 });
	assert.equal(home.columnIndex, 1);
	home.gestureLockUntil = 0;
	home.onWheel({ deltaX:100, deltaY:0 });
	assert.equal(home.currentZone, 'all');
	home.onWheel({ deltaX:0, deltaY:150 });
	assert.equal(home.columnIndex, 1);
});

test('快速切换：旧请求不覆盖新分类或缓存，失败不保留旧作品', async () => {
	const sandbox = makeVm([]);
	const pending = [];
	sandbox.axios.get = () => new Promise((resolve, reject) => pending.push({resolve,reject}));
	const home = homeInstance(sandbox);
	const first = home.loadBoard();
	const second = home.switchZone('manga');
	pending[1].resolve({ data: { items:[{ novel_id:22 }] } });
	await second;
	pending[0].resolve({ data: { items:[{ novel_id:11 }] } });
	await first;
	assert.equal(home.items[0].novel_id, 22);
	const failed = home.switchZone('world');
	pending[2].reject(new Error('offline'));
	await failed;
	assert.equal(home.items.length, 0);
	assert.equal(home.loadError, true);
	await home.switchZone('all');
	assert.equal(home.items[0].novel_id, 11);
	assert.equal(home.loadError, false);
});

test('右滑：首屏回到上一分类末屏，支持首次加载和缓存命中', async () => {
	const sandbox = makeVm([]);
	let requests = 0;
	sandbox.axios.get = async () => { requests++; return { data: { items: rankedItems(12) } }; };
	const home = homeInstance(sandbox);
	await home.switchZone('novel');
	await home.moveColumn(-1);
	assert.equal(home.currentZone, 'all');
	assert.equal(home.columnIndex, 1);
	assert.equal(requests, 2);
	await home.switchZone('novel');
	home.gestureLockUntil = 0;
	await home.moveColumn(-1);
	assert.equal(home.currentZone, 'all');
	assert.equal(home.columnIndex, 1);
	assert.equal(requests, 2, '缓存命中同样定位末屏');
	home.gestureLockUntil = 0;
	await home.moveColumn(-1);
	assert.equal(home.currentZone, 'all');
	assert.equal(home.columnIndex, 0, '先回到本分类前一列');
	home.gestureLockUntil = 0;
	await home.moveColumn(-1);
	assert.equal(home.currentBoard, 'update');
	assert.equal(home.currentZone, 'all');
	assert.equal(home.columnIndex, 0, '最初的榜单首屏不循环跳转');
});

test('右滑：逆序遍历四榜四分类，跨榜回到世界末屏', async () => {
	const navigation = [];
	const sandbox = makeVm(navigation);
	sandbox.axios.get = async () => ({ data: { items: rankedItems(12) } });
	const home = homeInstance(sandbox);
	home.currentZone = 'world';
	await home.switchBoard('new', 'last');
	const visited = [];
	for (let step = 0; step < 32; step++) {
		if (home.columnIndex === 1) visited.push(home.currentBoard + ':' + home.currentZone);
		home.gestureLockUntil = 0;
		await home.moveColumn(-1);
	}
	assert.deepEqual(visited, ['update', 'logpower', 'complete', 'new'].flatMap(board => ['all', 'novel', 'manga', 'world'].map(zone => board + ':' + zone)).reverse());
	assert.equal(home.currentBoard, 'update');
	assert.equal(home.currentZone, 'all');
	assert.equal(home.columnIndex, 0);
	assert.deepEqual(navigation, []);
});

test('右滑：空榜和不足一屏的分类可返回，末屏索引不会为负', async () => {
	const home = homeInstance();
	await home.switchBoard('new');
	await home.moveColumn(-1);
	assert.equal(home.currentBoard, 'complete');
	assert.equal(home.currentZone, 'world');
	assert.equal(home.columnIndex, 0);
	home.cache['complete:manga'] = { items: rankedItems(3), savedAt: Date.now() };
	home.gestureLockUntil = 0;
	await home.moveColumn(-1);
	assert.equal(home.currentZone, 'manga');
	assert.equal(home.columnIndex, 0);
	assert.equal(home.columns.flat().filter(Boolean).length, 3);
});

test('右滑异步回退：期间点选其他榜单，不被旧请求强制跳到末屏', async () => {
	const sandbox = makeVm([]);
	const pending = [];
	sandbox.axios.get = () => new Promise(resolve => pending.push(resolve));
	const home = homeInstance(sandbox);
	home.loading = false;
	home.currentZone = 'novel';
	const backward = home.moveColumn(-1);
	const manual = home.switchBoard('new');
	pending[1]({ data: { items: rankedItems(12) } });
	await manual;
	pending[0]({ data: { items: rankedItems(12) } });
	await backward;
	assert.equal(home.currentBoard, 'new');
	assert.equal(home.columnIndex, 0);
});


test('原木力入口：详情和合集均进入统一榜单并选择原木力榜', () => {
	const bookInfo = readComponent('pages/readers/bookInfo.vue');
	assert.match(bookInfo, /<navigator url="\/pages\/readers\/rankBoard\?board=logpower&zone=all">/);
	const navigation = [];
	const sandbox = makeVm([]);
	sandbox.uni.redirectTo = options => navigation.push(options.url);
	const options = loadComponentOptions('pages/readers/collections.vue', sandbox);
	let fetchCount = 0;
	const page = { ...options.data(), refreshCollections: () => fetchCount++ };
	options.onLoad.call(page, { title: '原木力爆棚' });
	options.onShow.call(page);
	assert.deepEqual(navigation, ['/pages/readers/rankBoard?board=logpower&zone=all&noneAnimation=1']);
	assert.equal(fetchCount, 0, '重定向入口不再加载旧合集数据');
});

test('旧榜单地址：替换当前页进入原木力榜，目标页自动选中全部分类', () => {
	const navigation = [];
	const sandbox = makeVm([]);
	sandbox.uni.redirectTo = options => navigation.push(options.url);
	const legacy = loadComponentOptions('pages/readers/logPowerRank.vue', sandbox);
	legacy.onLoad.call({});
	assert.deepEqual(navigation, ['/pages/readers/rankBoard?board=logpower&zone=all']);
	const options = loadComponentOptions('pages/readers/rankBoard.vue', sandbox);
	let selectionAtFetch;
	const page = { ...options.data(), loadFirstPage() { selectionAtFetch = [this.currentBoard, this.currentZone]; } };
	options.onLoad.call(page, { board: 'logpower', zone: 'all' });
	assert.deepEqual(selectionAtFetch, ['logpower', 'all']);
});
