const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const express = require('express');

test('漫画接口接收原始文件字节，同时兼容旧版 base64 JSON', async (t) => {
	const source = fs.readFileSync(path.join(__dirname, '../routes/essays.js'), 'utf8');
	const start = source.indexOf("router.post('/upload_manga_page'");
	const end = source.indexOf("\nrouter.post('/delete_novel'", start);
	assert.ok(start >= 0 && end > start);
	const seen = [];
	let handler;
	const router = { post: (...args) => { handler = args.at(-1); } };
	vm.runInNewContext(source.slice(start, end), {
		router,
		auth() {},
		Buffer,
		axios: { CancelToken: { source: () => ({ token: {}, cancel() {} }) } },
		decodeBase64Image: value => Buffer.from(value.split(',').pop(), 'base64'),
		sharp: () => ({ metadata: async () => ({ width: 1200, height: 1800, format: 'png' }) }),
		MAX_PIXELS: 300000000,
		MANGA_IMAGE_ALLOWED_FORMATS: ['png'],
		getMangaImageUploadConfig: () => ({ url: '', apikey: '' }),
		createMangaImageAssets: async (buffer, { strip }) => {
			seen.push({ bytes: Buffer.from(buffer), strip });
			return [{ url: 'https://test.invalid/original', thumb: 'https://test.invalid/thumb' }];
		},
		console: { error() {} },
	});

	const app = express();
	app.use('/essays/upload_manga_page', express.raw({ type: 'application/octet-stream', limit: '96mb' }));
	app.use('/essays/upload_manga_page', express.json({ limit: '96mb' }));
	app.post('/essays/upload_manga_page', handler);
	const server = app.listen(0, '127.0.0.1');
	await new Promise(resolve => server.once('listening', resolve));
	t.after(() => new Promise(resolve => server.close(resolve)));
	const url = `http://127.0.0.1:${server.address().port}/essays/upload_manga_page`;

	const original = Buffer.alloc(6 * 1024 * 1024, 0x41);
	const binary = await fetch(url + '?article_type=mangaStrip', {
		method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: original,
	});
	assert.equal(binary.status, 200);
	assert.equal((await binary.json()).size, original.length);
	assert.deepEqual(seen[0], { bytes: original, strip: true });

	const legacy = await fetch(url, {
		method: 'POST', headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ img: 'data:image/png;base64,' + Buffer.from('old-client').toString('base64'), article_type: 'mangaPage' }),
	});
	assert.equal(legacy.status, 200);
	assert.equal((await legacy.json()).size, 10);
	assert.deepEqual(seen[1], { bytes: Buffer.from('old-client'), strip: false });
});
