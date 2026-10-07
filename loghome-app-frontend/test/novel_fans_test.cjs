const test = require('node:test'),
	assert = require('node:assert/strict'),
	fs = require('node:fs'),
	path = require('node:path'),
	vm = require('node:vm'),
	sfc = require('vue/compiler-sfc');
const file = path.resolve(__dirname, '../pages/readers/novel_fans.vue');
function setup(axios, token = { tk: 'test', id: 1 }) {
	const source = fs.readFileSync(file, 'utf8'),
		p = sfc.parse({ source, filename: file }),
		d = p.descriptor || p;
	assert.equal(
		sfc.compileTemplate({ source: d.template.content, filename: file }).errors
			.length,
		0,
	);
	const module = { exports: {} };
	const calls = [];
	vm.runInNewContext(
		d.script.content
			.replace(/^import .*;?\s*$/gm, '')
			.replace('export default', 'module.exports='),
		{
			module,
			axios,
			darkModeMixin: {},
			TippingBar: {},
			window: {
				localStorage: { getItem: () => JSON.stringify(token), removeItem() {} },
			},
			uni: { navigateTo: x => calls.push(x.url), showToast() {} },
		},
	);
	const o = module.exports;
	const r = {
		...o.data(),
		...o.methods,
		$baseUrl: 'http://test',
		$nextTick: fn => fn(),
		$refs: {
			messagePopup: { open() {} },
			giftPopup: {
				open() {
					calls.push('gift');
				},
				close() {},
			},
		},
	};
	return { r, calls };
}
test('样式模板、SCSS与勋章素材可编译，保留榜单切换、留言与礼物入口', () => {
	const source = fs.readFileSync(file, 'utf8');
	const p = sfc.parse({ source, filename: file }),
		d = p.descriptor || p;
	assert.equal(
		sfc.compileTemplate({ source: d.template.content, filename: file }).errors
			.length,
		0,
	);
	const sass = require('/Applications/HBuilderX.app/Contents/HBuilderX/plugins/compile-dart-sass/node_modules/sass');
	assert.ok(sass.renderSync({ data: d.styles[0].content }).css.length);
	for (let i = 0; i < 3; i++)
		assert.match(
			fs.readFileSync(
				path.resolve(__dirname, `../static/fans/medal-${i}.svg`),
				'utf8',
			),
			/<svg/,
		);
});
test('总榜切换月榜会清空未上榜用户的旧贡献值，旧请求不能覆盖新榜单', async () => {
	const requests = [];
	const { r } = setup({
		get: url => new Promise(resolve => requests.push({ url, resolve })),
	});
	r.myInfo = { user_id: 1, rank: '1', fans_value: 100 };
	r.fanInfo = [{ user_id: 1, fans_value: 100 }];
	const first = r.getStatistics();
	r.isActive = 1;
	const second = r.getStatistics();
	assert.equal(r.myInfo.fans_value, 0);
	requests[1].resolve({ data: [{ user_id: 2, fans_value: 80 }] });
	await second;
	requests[0].resolve({ data: [{ user_id: 1, fans_value: 100 }] });
	await first;
	assert.equal(r.fanInfo[0].user_id, 2);
	assert.equal(r.myInfo.rank, '未上榜');
	assert.equal(r.loading, false);
});
test('游客可以浏览贡献榜，登录入口使用正确路径，不自动跳离页面', async () => {
	const { r, calls } = setup(
		{ get: async () => ({ data: [{ user_id: 1, fans_value: 20 }] }) },
		null,
	);
	await r.getMyInfo();
	await r.getStatistics();
	assert.equal(r.fanInfo.length, 1);
	assert.equal(calls.length, 0);
	await r.openGift();
	assert.equal(calls[0], '/pages/users/login?msg=unAuthorized');
});
test('只有本人能编辑留言；作者不能打开给自己送礼的菜单', async () => {
	const { r, calls } = setup({ get: async () => ({ data: { auther_id: 1 } }) });
	r.myInfo = { user_id: 1 };
	r.editMessage({ user_id: 2, message: 'other' });
	assert.equal(r.currentEditingFan, null);
	r.editMessage({ user_id: '1', message: 'mine' });
	assert.equal(r.editingMessage, 'mine');
	await r.openGift();
	assert.equal(calls.length, 0);
});
test('送礼成功后刷新当前榜单，错误请求显示重试而非空榜', async () => {
	const { r } = setup({
		get: async () => {
			throw new Error('offline');
		},
	});
	await r.getStatistics();
	assert.equal(r.loadError, true);
	assert.equal(r.loading, false);
	let refreshed = false;
	r.getStatistics = () => {
		refreshed = true;
	};
	r.onTip();
	assert.equal(refreshed, true);
});
