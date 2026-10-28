const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue/compiler-sfc');

const file = path.resolve(__dirname, '../pages/writers/allArticles.vue');
const source = fs.readFileSync(file, 'utf8');
const parsed = compiler.parse({ source, filename: file });
const descriptor = parsed.descriptor || parsed;

function fixture({ catalog, get, localRecords = [], IntersectionObserver } = {}) {
	const reads = [];
	const toasts = [];
	const timers = new Map();
	const storage = new Map();
	let timerId = 0;
	const module = { exports: {} };
	const axios = {
		get: async (url) => {
			reads.push(url);
			if (get) return get(url);
			if (url.includes('get_articles?')) {
				return {
					data: catalog || { articles: [
						{ article_id: 10, article_type: 'spliter', title: '第一卷' },
						{ article_id: 11, article_type: 'richtext', title: '第一章' },
					], novel: { novel_id: 7, novel_type: 'world' }, access: { access_role: 'owner' } },
				};
			}
			if (url.includes('get_novel_collaboration_info')) {
				return { data: { access: { access_role: 'owner' }, novel: {} } };
			}
			return { data: [{ novel_id: 7, novel_type: 'novel' }] };
		},
		post: async () => ({ data: {} }),
	};
	const script = descriptor.script.content
		.replace(/^import[\s\S]*?from\s*["'][^"']+["'];?\s*$/gm, '')
		.replace('export default', 'module.exports =');
	vm.runInNewContext(script, {
		module,
		axios,
		uni: { showToast(options) { toasts.push(options); } },
		window: {
			IntersectionObserver,
			self: {},
			top: {},
			parent: { postMessage() {} },
			localStorage: {
				getItem(key) {
					if (key === 'token') return JSON.stringify({ id: 3, tk: 'token' });
					return storage.get(key) || null;
				},
				setItem(key, value) { storage.set(key, value); },
			},
			addEventListener() {},
			removeEventListener() {},
		},
		document: { getElementsByClassName: () => [] },
		uniCollapse: {},
		uniCollapseItem: {},
		uniIcons: {},
		darkModeMixin: {},
		writerArticleDB: { articles: { where: () => ({ equals: () => ({ toArray: async () => localRecords }) }) } },
		computeWriterContentHash: () => '',
		readWriterSyncState: () => null,
		areLegacyContentsEquivalent: () => false,
		setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
		clearTimeout(id) { timers.delete(id); },
		setInterval: () => 1,
		clearInterval() {},
		console: { log() {}, error() {} },
	});

	const component = module.exports;
	const state = component.data();
	for (const [name, method] of Object.entries(component.methods)) {
		state[name] = method.bind(state);
	}
	Object.assign(state, {
		$baseUrl: 'https://test.invalid',
		$refs: { setPopup: { close() {} } },
		$forceUpdate() {},
		$set(object, key, value) { object[key] = value; },
		$nextTick(callback) { Promise.resolve().then(callback); },
		$t: key => key,
		refreshRealtimePresence() {},
		startRealtimePresencePolling() {},
		scheduleArticleStatusCheck() {},
		scheduleFeedbackCountsLoad() {},
	});
	Object.defineProperty(state, 'renderedArticles', { get: () => component.computed.renderedArticles.call(state) });
	Object.defineProperty(state, 'hasActiveSearch', { get: () => false });
	return { component, state, reads, toasts, timers, storage };
}

test('首次 onLoad 与 onShow 共用一次轻量目录刷新', async () => {
	const { component, state, reads } = fixture();
	component.onLoad.call(state, { id: 7 });
	component.onShow.call(state);
	await state.refreshPromise;

	assert.equal(reads.filter(url => url.includes('/essays/get_articles?')).length, 1);
	assert.equal(reads.length, 1);
	assert.match(
		reads.find(url => url.includes('/essays/get_articles?')),
		/catalog_only=1&defer_status=1/,
	);
	assert.equal(state.isLoading, false);
	assert.equal(state.hasLoadedPage, true);
	assert.equal(state.novel.novel_type, 'world');
	assert.equal(state.novelAccess.access_role, 'owner');
	assert.equal(state.bookPart.currentPart.id, 10);
	assert.deepEqual(Array.from(state.shownArticles, item => item.article_id), [10, 11]);
});

test('章节目录模板仍可编译', () => {
	const result = compiler.compileTemplate({
		source: descriptor.template.content,
		filename: file,
		id: 'all-articles-loading',
	});
	assert.deepEqual(result.errors, []);
});

const chapters = (count) => Array.from({ length: count }, (_, index) => ({
	article_id: index + 1, article_type: 'richtext', title: `第${index + 1}章`,
	collaboration_mode: 'legacy_lock',
}));
const catalogOf = (articles) => ({
	articles, novel: { novel_id: 7, novel_type: 'novel' }, access: { access_role: 'owner' },
});

test('大目录首屏只渲染 30 条，继续滚动追加，搜索仍覆盖全部章节', async () => {
	const { state } = fixture({ catalog: catalogOf(chapters(1000)) });
	state.uid = 7;
	await state.refreshPage();
	assert.equal(state.renderedArticles.length, 30);
	assert.equal(state.shownArticles.length, 1000);
	assert.equal(state.getScopedSearchArticles().length, 1000);
	state.loadMoreArticles();
	assert.equal(state.renderedArticles.length, 60);
	await state.refreshPage();
	assert.equal(state.renderedArticles.length, 60, '后台刷新保留已展开的目录范围');
});

test('切换分卷重新从 30 条展示，初始化尊重已保存分卷', async () => {
	const articles = [
		{ article_id: 2001, article_type: 'spliter', title: '第一卷' }, ...chapters(80),
		{ article_id: 2002, article_type: 'spliter', title: '第二卷' },
		...chapters(80).map((item) => ({ ...item, article_id: item.article_id + 100 })),
	];
	const { state, storage } = fixture({ catalog: catalogOf(articles) });
	state.uid = 7;
	storage.set('lastPartId_7', '2001');
	await state.refreshPage(true);
	assert.equal(state.bookPart.currentPart.id, 2001);
	assert.equal(state.shownArticles.length, 81);
	state.loadMoreArticles();
	assert.equal(state.renderedArticles.length, 60);
	state.changeBookPart(state.bookPart.parts[2], true);
	assert.equal(state.renderedArticles.length, 30);
	assert.equal(state.renderedArticles[0].article_id, 2002);
	assert.equal(storage.get('lastPartId_7'), 2002);
});

test('空书保留作品类型与权限，旧版数组接口也能加载', async () => {
	const empty = fixture({ catalog: catalogOf([]) });
	empty.state.uid = 7;
	await empty.state.refreshPage(true);
	assert.equal(empty.state.renderedArticles.length, 0);
	assert.equal(empty.state.isLoading, false);
	assert.equal(empty.state.novelAccess.access_role, 'owner');
	const legacy = fixture({ catalog: chapters(2) });
	legacy.state.uid = 7;
	await legacy.state.refreshPage();
	assert.equal(legacy.reads.length, 3);
	assert.equal(legacy.state.articles[0].statusMetadataLoaded, true);
});

test('后台刷新失败保留现有目录且不再显示整页骨架', async () => {
	let fail = false;
	const { state, toasts } = fixture({ get: async () => {
		if (fail) throw new Error('offline');
		return { data: catalogOf(chapters(40)) };
	} });
	state.uid = 7;
	await state.refreshPage();
	const previous = state.articles;
	fail = true;
	const refresh = state.refreshPage();
	assert.equal(state.isLoading, false);
	await refresh;
	assert.equal(state.articles, previous);
	assert.equal(state.refreshPromise, null);
	assert.equal(toasts.length, 1);
});

test('状态元数据只加载已显示章节，已检查章节不会反复查询', async () => {
	const { state, reads } = fixture({ get: async (url) => {
		const ids = url.split('article_ids=')[1].split(',').map(Number);
		return { data: ids.map((id) => ({ article_id: id, collaboration_mode: 'legacy_lock' })) };
	} });
	state.uid = 7;
	state.isLoading = false;
	state.shownArticles = chapters(1000).map((item) => ({ ...item, statusMetadataLoaded: false }));
	const checked = [];
	state._checkArticleStatusSingle = async (item) => { item.articleStatusChecked = true; checked.push(item.article_id); };
	await state.checkArticleStatus();
	assert.equal(reads.length, 1);
	assert.equal(checked.length, 30);
	assert.equal(state.shownArticles[30].statusMetadataLoaded, false);
	await state.checkArticleStatus();
	assert.equal(reads.length, 1);
	state.loadMoreArticles();
	await state.checkArticleStatus();
	assert.equal(reads.length, 2);
	assert.equal(checked.length, 60);
});

test('切换分卷后过期元数据回包被忽略，失败不误判为没有云端草稿', async () => {
	let resolve;
	const { state } = fixture({ get: () => new Promise((done) => { resolve = done; }) });
	state.shownArticles = chapters(1);
	let checks = 0;
	state._checkArticleStatusSingle = async () => { checks++; };
	const pending = state.checkArticleStatus();
	state.statusCheckGeneration++;
	resolve({ data: [{ article_id: 1, collaboration_mode: 'legacy_lock', article_writer: { title: '过期' } }] });
	await pending;
	assert.equal(checks, 0);
	assert.equal(state.shownArticles[0].article_writer, undefined);

	const failed = fixture({ get: async () => { throw new Error('offline'); } });
	failed.state.shownArticles = chapters(1);
	failed.state._checkArticleStatusSingle = async () => { checks++; };
	await failed.state.checkArticleStatus();
	assert.equal(checks, 0);
	assert.equal(failed.state.shownArticles[0].articleStatusChecked, undefined);
});

test('云端草稿字数已知时无需逐章下载正文，包括空草稿', async () => {
	const { state, reads } = fixture();
	for (const text_count of [0, 5000]) {
		const article = {
			article_id: 1, article_type: 'richtext', content_hash: 'published',
			article_writer: {
				title: '新草稿', content_hash: 'draft', text_count, create_time: '20261028120000',
			},
		};
		await state._checkArticleStatusSingle(article);
		assert.equal(article.hasWriterModify, true);
		assert.equal(article.modifiedTextCount, text_count);
		assert.equal(article.title, '新草稿');
	}
	assert.equal(reads.length, 0);
});

test('延迟元数据不改变本地草稿与云端冲突/同步中的判断', async () => {
	for (const isRecoverable of [false, true]) {
		const local = {
			title: '本地稿', content: '[{"type":"text","value":"本地内容"}]',
			content_hash: 'local', create_time: '20261028110000',
		};
		const remote = {
			title: '云端稿', content: '[{"type":"text","value":"云端内容"}]',
			content_hash: 'remote', text_count: 4, create_time: '20261028120000',
		};
		const { state, reads } = fixture({ localRecords: [local], get: async () => ({ data: remote }) });
		state.getLocalWriterHash = () => 'local';
		state.getVersionMarker = () => 0;
		state.resolveRecoverableSyncState = async () => ({ isRecoverable, remoteEditors: [] });
		let rechecks = 0;
		state.scheduleArticleStatusRecheck = () => { rechecks++; };
		const { content, ...metadata } = remote;
		const article = { article_id: 1, article_type: 'richtext', content_hash: 'published', article_writer: metadata };
		await state._checkArticleStatusSingle(article);
		assert.equal(article.isSyncing, isRecoverable);
		assert.equal(article.hasCloudCollision, !isRecoverable);
		assert.equal(article.title, isRecoverable ? '本地稿' : '云端稿');
		assert.equal(rechecks, isRecoverable ? 1 : 0);
		assert.equal(reads.length, 1, '哈希冲突时仍会取正文比较');
	}
});

test('未展开折叠项不测量不存在的节点，默认展开项挂载后正常测量', () => {
	const collapseFile = path.resolve(__dirname, '../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue');
	const collapse = compiler.parse({ source: fs.readFileSync(collapseFile, 'utf8'), filename: collapseFile });
	assert.deepEqual(compiler.compileTemplate({ source: collapse.template.content, filename: collapseFile, id: 'collapse' }).errors, []);
	const module = { exports: {} };
	let queries = 0;
	vm.runInNewContext(collapse.script.content
		.replace(/^import .*$/gm, '').replace('export default', 'module.exports ='), {
		module, darkModeMixin: {},
		uni: {
			requireNativePlugin: () => ({}),
			createSelectorQuery() {
				queries++;
				const query = { in: () => query, select: () => query,
					fields(options, callback) { callback({ height: 42 }); return query; }, exec() {} };
				return query;
			},
		},
	});
	const item = { isOpen: false, open: false, onClick(value) { this.isOpen = value; } };
	item.getCollapseHeight = module.exports.methods.getCollapseHeight.bind(item);
	item.getCollapseHeight();
	item.getCollapseHeight(true);
	assert.equal(queries, 0);
	item.open = true;
	item.getCollapseHeight();
	assert.equal(item.isOpen, true);
	assert.equal(queries, 0);
	item.getCollapseHeight(true);
	assert.equal(item.height, 42);
	assert.equal(queries, 1);
});

test('接近目录底部自动追加，隐藏页面后停止观察和加载', async () => {
	const observers = [];
	const { component, state } = fixture({
		catalog: catalogOf(chapters(100)),
		IntersectionObserver: class {
			constructor(callback) { this.callback = callback; observers.push(this); }
			observe(target) { this.target = target; }
			disconnect() { this.disconnected = true; }
		},
	});
	state.uid = 7;
	state.$refs.moreArticles = {};
	await state.refreshPage();
	await Promise.resolve();
	const observer = observers.at(-1);
	assert.equal(observer.target, state.$refs.moreArticles);
	observer.callback([{ isIntersecting: true }]);
	assert.equal(state.renderedArticles.length, 60);
	await Promise.resolve();
	assert.equal(observer.disconnected, true);
	observer.callback([{ isIntersecting: true }]);
	assert.equal(state.renderedArticles.length, 60, '过期观察器回调不能继续追加');
	component.onHide.call(state);
	observers.at(-1).callback([{ isIntersecting: true }]);
	assert.equal(state.renderedArticles.length, 60);
});

test('目录先挂载，状态检查延后且快速切换只运行最后一个任务', async () => {
	const { component, state, timers } = fixture();
	state.scheduleArticleStatusCheck = component.methods.scheduleArticleStatusCheck.bind(state);
	const checked = [];
	state.checkArticleStatus = (generation) => { checked.push(generation); };
	state.scheduleArticleStatusCheck();
	state.scheduleArticleStatusCheck();
	assert.equal(timers.size, 0);
	await Promise.resolve();
	const statusTimers = [...timers.values()].filter((timer) => timer.delay === 100);
	assert.equal(statusTimers.length, 1);
	assert.equal(checked.length, 0);
	statusTimers[0].callback();
	assert.deepEqual(checked, [state.statusCheckGeneration]);
});
