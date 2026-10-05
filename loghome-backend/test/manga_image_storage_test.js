const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { uploadMangaImageFile } = require('../bin/mangaImageStorage');

async function withUploadServer(handler, run) {
	const server = http.createServer(handler);
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	try {
		await run(`http://127.0.0.1:${server.address().port}/upload/img`);
	} finally {
		await new Promise(resolve => server.close(resolve));
	}
}

test('漫画资产沿用前端图床接口，以 img 文件字段和 apikey 请求头上传', async () => {
	const image = Buffer.from([0x00, 0xff, 0x12, 0x34, 0x56]);
	let received;
	await withUploadServer((req, res) => {
		const chunks = [];
		req.on('data', chunk => chunks.push(chunk));
		req.on('end', () => {
			received = { headers: req.headers, body: Buffer.concat(chunks) };
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({ url: 'https://test.invalid/manga.png' }));
		});
	}, async url => {
		assert.equal(await uploadMangaImageFile(image, 'png', { url, apikey: 'test-key' }), 'https://test.invalid/manga.png');
	});
	assert.equal(received.headers.apikey, 'test-key');
	assert.match(received.headers['content-type'], /^multipart\/form-data; boundary=/);
	assert.equal(Number(received.headers['content-length']), received.body.length);
	assert.match(received.body.toString('latin1'), /name="img"; filename="manga-[a-f0-9]{16}\.png"/);
	assert.match(received.body.toString('latin1'), /Content-Type: image\/png/);
	assert.ok(received.body.includes(image));
	assert.ok(!received.body.includes(image.toString('base64')));
});

test('图床响应缺少 URL 时返回错误', async () => {
	await withUploadServer((req, res) => {
		req.resume();
		req.on('end', () => {
			res.setHeader('Content-Type', 'application/json');
			res.end('{}');
		});
	}, async url => {
		await assert.rejects(
			uploadMangaImageFile(Buffer.from('image'), 'webp', { url, apikey: 'test-key' }),
			/图片存储服务暂时不可用/,
		);
	});
});
