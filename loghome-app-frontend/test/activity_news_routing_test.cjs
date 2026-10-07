const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const parser = require('@babel/parser');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function evaluate(file, names, globals) {
  return vm.runInNewContext(read(file).replace(/export (function|const)/g, '$1') + '\n;({' + names.join(',') + '})', globals);
}

function method(file, name, globals) {
  const script = read(file).match(/<script>([\s\S]*?)<\/script>/)[1];
  const definition = parser.parse(script, { sourceType: 'module' }).program.body.find(n => n.type === 'ExportDefaultDeclaration').declaration;
  const methods = definition.properties.find(n => n.key.name === 'methods').value;
  const node = methods.properties.find(n => n.key.name === name);
  return vm.runInNewContext('({' + script.slice(node.start, node.end) + '}).' + name, globals);
}

const ruleLink = '/pages/apps/h5webview?url=https://haycraft.loghome.ink/&title=Haycraft2026干草块文会';
const guideLink = '/pages/readers/bookInfo?id=645';

function setup(native = true) {
  const calls = [], notices = [], external = [];
  let route = 'pages/essays';
  const uni = Object.fromEntries(['navigateTo', 'redirectTo', 'reLaunch', 'navigateBack'].map(name => [name, options => {
    calls.push({ type: 'uni', name, options });
    return { ok: true };
  }]));
  const window = { __uniRoutes: [
    { path: '/pages/apps/h5webview', meta: {} },
    { path: '/pages/readers/bookInfo', meta: {} },
    { path: '/pages/essays', meta: { isTabBar: true } },
  ], jsBridge: { inApp: native, nativeRouterAvailable: true }, open: (...args) => external.push(args) };
  for (const name of ['nativeNavigateTo', 'nativeRedirectTo', 'nativeReLaunch']) window.jsBridge[name] = async payload => {
    calls.push({ type: 'native', name, payload }); return { ok: true };
  };
  uni.showToast = value => notices.push(value);
  const router = evaluate('common/native-router.js', ['installNativeRouter', 'resolveRouteUrl', 'encodeNativeRouteUrl'], {
    window, getCurrentPages: () => [{ route }], console: { warn() {} },
  });
  const news = evaluate('common/activity-news-navigation.js', ['openActivityNewsLink'], { window, uni });
  return { uni, window, calls, notices, external, router, ...news, changePage: value => { route = value; } };
}

test('规则页和指南保持正确目标，原生 query 编码与 uni-app 的 onLoad 解码层数一致', async () => {
  const state = setup();
  state.router.installNativeRouter(state.uni);
  await state.uni.navigateTo({ url: ruleLink });
  const result = state.calls[0];
  assert.equal(result.type, 'native');
  const query = new URL('https://local.test/#' + result.payload.url).hash.split('?')[1];
  const options = Object.fromEntries([...new URLSearchParams(query)].map(([key, value]) => [key, decodeURIComponent(value)]));
  assert.equal(options.url, 'https://haycraft.loghome.ink/');
  assert.equal(options.title, 'Haycraft2026干草块文会');
  await state.uni.navigateTo({ url: guideLink });
  assert.equal(state.calls[1].payload.url, guideLink);

  const external = 'https://example.com/a%2Fb?q=a+b&return=/a..b#chapter';
  await state.uni.navigateTo({ url: '/pages/apps/h5webview?url=' + encodeURIComponent(external) });
  const nativeQuery = state.calls[2].payload.url.split('?')[1];
  assert.equal(decodeURIComponent(new URLSearchParams(nativeQuery).get('url')), external);
});

test('拒绝原生跳转后使用点击时的绝对路径回退，页面变化不改变目标', async () => {
  const state = setup(); state.changePage('pages/writers/allArticles');
  state.window.jsBridge.nativeNavigateTo = async () => {
    state.changePage('pages/apps/h5webview');
    return { ok: false, reason: 'old Android router' };
  };
  state.router.installNativeRouter(state.uni);
  await state.uni.navigateTo({ url: '../readers/bookInfo?id=645' });
  assert.equal(state.calls[0].options.url, guideLink);
});

test('不存在的页面和 tabBar 跳转交回 uni 校验，不创建错误的原生页面', async () => {
  const state = setup(); state.router.installNativeRouter(state.uni);
  for (const url of ['/pages/apps/webview?url=https://haycraft.loghome.ink', '/pages/essays']) {
    await state.uni.navigateTo({ url });
  }
  assert.equal(state.calls.length, 2);
  assert.ok(state.calls.every(call => call.type === 'uni'));
  for (const url of [' https://example.com ', '//example.com/pages/me', 'javascript:alert(1)']) {
    assert.equal(state.router.resolveRouteUrl(url), '');
  }
});

test('网页端与原生端的创作/阅读入口使用同一资讯目标，成功后才关闭详情弹窗', () => {
  for (const native of [false, true]) {
    const state = setup(native);
    const creator = method('components/book-detail-view.vue', 'openNewsLink', state);
    const reader = method('pages/readers/bookInfo.vue', 'openActivityNews', state);
    let closed = 0;
    creator.call({ $emit: () => closed++ }, { mobile_link: ruleLink, pc_link: 'https://haycraft.loghome.ink' });
    assert.equal(state.calls[0].options.url, ruleLink);
    assert.equal(closed, 0);
    state.calls[0].options.success();
    assert.equal(closed, 1);
    reader.call({}, { mobile_link: guideLink });
    assert.equal(state.calls[1].options.url, guideLink);
    state.calls[1].options.fail();
    assert.equal(state.notices.length, 1);
  }
});

test('创作页资讯跳转关闭 UI 时不后退，手动关闭只消费抽屉自己的历史记录', () => {
  let backCalls = 0;
  const window = { history: { state: { isBookDetailDrawerOpen: true }, go: () => backCalls++ } };
  const closeForNavigation = method('pages/essays.vue', 'handleCloseBookDrawerForNavigation', { window });
  const closeManually = method('pages/essays.vue', 'handleCloseBookDrawerManually', { window });
  for (const showBookDetail of [false, true]) {
    const page = { showBookDetail };
    closeForNavigation.call(page);
    assert.equal(page.showBookDetail, false);
    assert.equal(backCalls, 0);
  }
  closeManually.call({ showBookDetail: false });
  assert.equal(backCalls, 0);
  window.history.state = {};
  closeManually.call({ showBookDetail: true });
  assert.equal(backCalls, 0);
  window.history.state = { isBookDetailDrawerOpen: true };
  closeManually.call({ showBookDetail: true });
  assert.equal(backCalls, 1);
  const bindings = read('pages/essays.vue').match(/@close-book-detail="([^"]+)"/g);
  assert.equal(bindings.length, 2);
  assert.ok(bindings.every(binding => binding.includes('handleCloseBookDrawerForNavigation')));
});

test('打开创作页抽屉保留 uni 路由的 history state', () => {
  let state;
  const window = { location: { href: 'https://local.test/#/pages/essays' }, history: {
    state: { key: 'uni-router-key' }, pushState: value => { state = value; },
  } };
  method('pages/essays.vue', 'selectBook', { window }).call({ viewMode: 'grid', swiperChange() {} }, 0);
  assert.equal(state.key, 'uni-router-key');
  assert.equal(state.isBookDetailDrawerOpen, true);
});

test('外链和 PC 兜底在 Android 调用系统浏览器，网页端打开新标签', async () => {
  for (const native of [false, true]) {
    const state = setup(native);
    const urls = [];
    state.window.jsBridge.openInBrowser = async url => { urls.push(url); return true; };
    state.openActivityNewsLink({ mobile_link: 'https://haycraft.loghome.ink' });
    state.openActivityNewsLink({ pc_link: 'https://haycraft.loghome.ink/guide' });
    state.openActivityNewsLink({ mobile_link: '/pages/missing', pc_link: 'https://haycraft.loghome.ink/fallback' });
    state.calls[0].options.fail();
    await new Promise(resolve => setImmediate(resolve));
    if (native) assert.deepEqual(urls, ['https://haycraft.loghome.ink', 'https://haycraft.loghome.ink/guide', 'https://haycraft.loghome.ink/fallback']);
    else assert.equal(state.external.length, 3);
    state.openActivityNewsLink({});
    assert.equal(state.notices.length, 1);
  }
});

test('分享/海报的外链入口使用已注册的 h5webview 页面', () => {
  const state = setup(false);
  const navigate = method('App.vue', 'navigateToTarget', { uni: state.uni, console });
  navigate.call({}, 'https://haycraft.loghome.ink/?q=hello+world#rules');
  const route = state.calls[0].options.url;
  assert.match(route, /^\/pages\/apps\/h5webview\?url=/);
  assert.equal(decodeURIComponent(route.split('?url=')[1]), 'https://haycraft.loghome.ink/?q=hello+world#rules');
  const pages = vm.runInNewContext('(' + read('pages.json') + ')').pages;
  assert.ok(pages.some(page => '/' + page.path === route.split('?')[0]));
});
