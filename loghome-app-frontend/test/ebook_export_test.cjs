// Run: node --test test/ebook_export_test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'pages/writers/exportNovel.vue'), 'utf8');
const deferred = () => {
	let resolve, reject;
	const promise = new Promise((a, b) => { resolve = a; reject = b; });
	return { promise, resolve, reject };
};

function page(get = async () => ({ status: 200, data: { download_url: '/essays/download_export/test-ticket', filename: '一本书-读者版.pdf' } })) {
	const requests = [], links = [], opened = [];
	const window = { localStorage: { getItem: () => JSON.stringify({ tk: 'private-token' }) } };
	const document = {
		createElement: () => ({ click() { links.push(this); } }),
		body: { appendChild() {}, removeChild() {} },
	};
	const sandbox = { module: {}, axios: { get: (...args) => { requests.push(args); return get(...args); } }, window, document, URL, Blob };
	vm.runInNewContext(source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports ='), sandbox);
	const options = sandbox.module.exports;
	const instance = Object.assign(options.data(), { $baseUrl: 'https://api.example.test', novelId: 42, novelName: '一本书' });
	for (const [name, method] of Object.entries(options.methods)) instance[name] = method.bind(instance);
	return { instance, options, requests, links, opened, window };
}

test('new export page compiles and the writer entry routes to the registered local page', () => {
	const compiler = require('vue/compiler-sfc');
	for (const file of ['pages/writers/exportNovel.vue', 'pages/writers/allArticles.vue']) {
		const result = compiler.parse({ source: fs.readFileSync(path.join(root, file), 'utf8'), filename: file });
		const descriptor = result.descriptor || result;
		assert.equal(compiler.compileTemplate({ source: descriptor.template.content, filename: file }).errors.length, 0);
	}
	assert.match(fs.readFileSync(path.join(root, 'pages.json'), 'utf8'), /"path"\s*:\s*"pages\/writers\/exportNovel"/);
	const writer = fs.readFileSync(path.join(root, 'pages/writers/allArticles.vue'), 'utf8');
	const method = writer.match(/\t\texportAdvanced\(\) \{[\s\S]*?\n\t\t\},/)[0].replace(/,$/, '');
	let destination, closed = false;
	const component = vm.runInNewContext('({' + method + '})', { uni: { navigateTo: data => { destination = data.url; } } });
	component.exportAdvanced.call({ uid: 42, novel: { name: 'A & B?作品' }, cancelExport: () => { closed = true; } });
	assert.equal(destination, './exportNovel?id=42&name=' + encodeURIComponent('A & B?作品'));
	assert.equal(closed, true);
});

test('export authenticates on current API and provides a browser-downloadable URL without the JWT', async () => {
	const { instance, requests, links } = page();
	await instance.exportNovel('published');
	assert.equal(requests[0][0], 'https://api.example.test/essays/export_novel');
	assert.deepEqual(JSON.parse(JSON.stringify(requests[0][1].params)), { id: 42, export_type: 'published', export_format: 'pdf', download_mode: 'url' });
	assert.equal(requests[0][1].headers.Authorization, 'Bearer private-token');
	assert.equal(instance.downloadUrl, 'https://api.example.test/essays/download_export/test-ticket');
	assert.equal(instance.downloadUrl.includes('private-token'), false);
	assert.equal(instance.downloadFileName, '一本书-读者版.pdf');
	assert.equal(instance.exporting, false);
	await instance.downloadFile();
	assert.equal(links[0].href, instance.downloadUrl);
	assert.equal(links[0].download, instance.downloadFileName);
});

test('double click generates one file and completion retains its requested format and version', async () => {
	const pending = deferred();
	const { instance, requests } = page(() => pending.promise);
	instance.exportFormat = 'epub';
	const first = instance.exportNovel('draft');
	await instance.exportNovel('published');
	assert.equal(requests.length, 1);
	assert.equal(instance.exporting, true);
	instance.exportFormat = 'pdf';
	pending.resolve({ status: 200, data: { download_url: '/essays/download_export/epub-ticket' } });
	await first;
	assert.equal(instance.downloadFileName, '一本书-存稿版.epub');
	assert.equal(instance.exporting, false);
});

test('API permission failures clear stale files and show the server reason', async () => {
	const { instance } = page(async () => { throw { response: { status: 403, data: { msg: '只有作品作者可以导出电子书' } } }; });
	instance.downloadUrl = 'https://api.example.test/old';
	await instance.exportNovel('draft');
	assert.equal(instance.downloadUrl, '');
	assert.equal(instance.errorMessage, '只有作品作者可以导出电子书');
	assert.equal(instance.exporting, false);
});

test('Blob JSON errors remain readable and expired login requests ask for login', async () => {
	const { instance } = page();
	assert.equal(await instance.getErrorMessage({ response: { status: 400, data: new Blob([JSON.stringify({ msg: '没有可导出的章节' })], { type: 'application/json' }) } }), '没有可导出的章节');
	assert.match(await instance.getErrorMessage({ response: { status: 401, data: {} } }), /重新登录/);
});

test('HTML responses, missing URLs and foreign download URLs never become downloadable files', async () => {
	for (const data of ['<html>gateway</html>', {}, { download_url: 'https://untrusted.example/file.pdf' }, { download_url: 'javascript:alert(1)' }]) {
		const { instance } = page(async () => ({ status: 200, data }));
		await instance.exportNovel('published');
		assert.equal(instance.downloadUrl, '');
		assert.ok(instance.errorMessage);
		assert.equal(instance.exporting, false);
	}
});

test('the Android bridge opens the generated HTTP URL and reports browser launch failure', async () => {
	const { instance, window, links, opened } = page();
	window.jsBridge = { inApp: true, openInBrowser: async url => { opened.push(url); return true; } };
	await instance.exportNovel('published');
	await instance.downloadFile();
	assert.deepEqual(opened, ['https://api.example.test/essays/download_export/test-ticket']);
	assert.equal(links.length, 0);
	window.jsBridge.openInBrowser = async () => false;
	await instance.downloadFile();
	assert.match(instance.errorMessage, /无法打开下载/);
});

test('invalid work IDs and malformed login storage never send export requests', async () => {
	const { instance, options, window, requests } = page();
	instance.novelId = 0;
	options.onLoad.call(instance, { id: 'NaN' });
	await instance.exportNovel('published');
	assert.match(instance.errorMessage, /作品信息无效/);
	instance.novelId = 42;
	window.localStorage.getItem = () => 'not JSON';
	await instance.exportNovel('published');
	assert.match(instance.errorMessage, /请先登录/);
	assert.equal(requests.length, 0);
});

test('leaving during export ignores the late response', async () => {
	const pending = deferred();
	const { instance, options } = page(() => pending.promise);
	const request = instance.exportNovel('published');
	options.onUnload.call(instance);
	pending.resolve({ status: 200, data: { download_url: '/essays/download_export/late-ticket' } });
	await request;
	assert.equal(instance.downloadUrl, '');
});
