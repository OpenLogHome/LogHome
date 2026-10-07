const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'),
	path = require('node:path'),
	vm = require('node:vm');
const compiler = require('vue/compiler-sfc');
function load(file, globals = {}) {
	const source = fs.readFileSync(path.join(__dirname, '../', file), 'utf8');
	const parsed = compiler.parse({ source, filename: file });
	const d = parsed.descriptor || parsed;
	assert.equal(
		compiler.compileTemplate({ source: d.template.content, filename: file })
			.errors.length,
		0,
	);
	const module = { exports: {} };
	vm.runInNewContext(
		d.script.content
			.replace(/^import .*;?\s*$/gm, '')
			.replace('export default', 'module.exports ='),
		{
			module,
			Date,
			console,
			setTimeout,
			clearTimeout,
			darkModeMixin: {},
			LogPowerWordmark: {},
			RankWorkTitle: {},
			...globals,
		},
	);
	const options = module.exports;
	return {
		options,
		instance: {
			...options.data(),
			...options.methods,
			...globals,
			$nextTick(fn) {
				if (fn) fn();
			},
		},
	};
}
test('一行与两行标题均显示标签，过期标签过滤并限制数量', () => {
	const { options, instance } = load('components/RankWorkTitle.vue');
	instance.badges = [
		{ code: 'expired', expires_at: '2000-01-01T00:00:00Z' },
		{ code: 'new_entry', expires_at: '2099-01-01T00:00:00Z' },
		{ code: 'old_work' },
	];
	instance.maxBadges = 1;
	assert.deepEqual(
		Array.from(options.computed.visibleBadges.call(instance), b => b.code),
		['new_entry'],
	);
	instance.maxBadges = 2;
	assert.equal(options.computed.visibleBadges.call(instance).length, 2);
	const source = fs.readFileSync(
		path.join(__dirname, '../components/RankWorkTitle.vue'),
		'utf8',
	);
	assert.match(source, /v-if="visibleBadges.length"/);
	assert.match(source, /-webkit-line-clamp: 2/);
});
test('切换榜单时旧请求不能覆盖新榜单；后续分页固定批次', async () => {
	const requests = [];
	const axios = {
		get: url => new Promise(resolve => requests.push({ url, resolve })),
	};
	const uni = { stopPullDownRefresh() {}, showToast() {} };
	const { instance: r } = load('pages/readers/rankBoard.vue', {
		axios,
		uni,
		$baseUrl: 'http://test',
	});
	const first = r.loadFirstPage();
	r.currentBoard = 'logpower';
	const second = r.loadFirstPage();
	requests[1].resolve({
		data: {
			batch_id: 22,
			items: Array.from({ length: 20 }, (_, i) => ({ novel_id: i + 1 })),
		},
	});
	await second;
	requests[0].resolve({ data: { batch_id: 11, items: [{ novel_id: 99 }] } });
	await first;
	assert.equal(r.batchId, 22);
	assert.equal(r.items[0].novel_id, 1);
	const more = r.loadMore();
	assert.match(requests[2].url, /page=2&amount=20&batch_id=22/);
	requests[2].resolve({ data: { batch_id: 22, items: [{ novel_id: 21 }] } });
	await more;
	assert.equal(r.items.length, 21);
	assert.equal(r.page, 2);
});
test('批次过期时重置滚动并重新获取第一屏', async () => {
	const uni = { stopPullDownRefresh() {}, showToast() {} };
	let calls = 0;
	const axios = {
		get: async () => {
			calls++;
			if (calls === 1) throw { response: { status: 410 } };
			return { data: { batch_id: 23, items: [{ novel_id: 1 }] } };
		},
	};
	const { instance: r } = load('pages/readers/rankBoard.vue', {
		axios,
		uni,
		$baseUrl: 'http://test',
	});
	r.loading = false;
	r.batchId = 22;
	r.hasMore = true;
	r.items = [{ novel_id: 9 }];
	r.listScrollTop = 800;
	await r.loadMore();
	assert.equal(r.batchId, 23);
	assert.equal(r.page, 1);
	assert.equal(r.items[0].novel_id, 1);
	assert.equal(r.listScrollTop, 0);
	assert.equal(r.loading, false);
});
test('标签及榜单组件的模板和样式均可编译', () => {
	const sass = require('/Applications/HBuilderX.app/Contents/HBuilderX/plugins/compile-dart-sass/node_modules/sass');
	for (const file of [
		'components/RankWorkTitle.vue',
		'components/home-rank-board.vue',
		'pages/readers/rankBoard.vue',
	]) {
		const source = fs.readFileSync(path.join(__dirname, '../', file), 'utf8');
		const parsed = compiler.parse({ source, filename: file });
		const d = parsed.descriptor || parsed;
		assert.equal(
			compiler.compileTemplate({ source: d.template.content, filename: file })
				.errors.length,
			0,
		);
		for (const style of d.styles)
			assert.ok(sass.renderSync({ data: style.content }).css.length);
	}
});
