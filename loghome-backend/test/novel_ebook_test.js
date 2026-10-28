const test = require('node:test');
const assert = require('node:assert/strict');
const zlib = require('node:zlib');
const sharp = require('sharp');
const { createNovelEbook } = require('../bin/novelEbook');

const novel = { novel_id: 42, name: '中文作品 <原木> & 测试', author_name: '作者甲' };

// Read the actual ZIP central directory, independently of the archive writer.
function readZip(buffer) {
	const end = buffer.lastIndexOf(Buffer.from('504b0506', 'hex'));
	assert.ok(end >= 0, 'ZIP end record exists');
	const count = buffer.readUInt16LE(end + 10);
	let cursor = buffer.readUInt32LE(end + 16);
	const files = new Map();
	for (let index = 0; index < count; index++) {
		assert.equal(buffer.readUInt32LE(cursor), 0x02014b50);
		const method = buffer.readUInt16LE(cursor + 10);
		const size = buffer.readUInt32LE(cursor + 20);
		const nameLength = buffer.readUInt16LE(cursor + 28);
		const extraLength = buffer.readUInt16LE(cursor + 30);
		const commentLength = buffer.readUInt16LE(cursor + 32);
		const local = buffer.readUInt32LE(cursor + 42);
		const name = buffer.toString('utf8', cursor + 46, cursor + 46 + nameLength);
		const dataStart = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
		const compressed = buffer.subarray(dataStart, dataStart + size);
		files.set(name, method === 0 ? compressed : zlib.inflateRawSync(compressed));
		cursor += 46 + nameLength + extraLength + commentLength;
	}
	return files;
}

test('EPUB 包含完整目录、空分卷正文和转义后的多种历史正文格式', async () => {
	const ebook = await createNovelEbook({ novel, format: 'epub', articles: [
		{ title: '第一卷', article_type: 'spliter', content: '' },
		{ title: '第一章 <测试>', content: JSON.stringify({ content: [
			{ type: 'text', value: ['中文', '数组正文'] },
			{ type: 'text', value: '<script>alert("test")</script> & <b>原文</b>\n第二行\u0001\ud800' },
			null,
		] }) },
		{ title: '普通文本', content: '纯文本内容' },
		{ title: '空章节', content: null },
		{ title: '内存数组', content: [{ type: 'text', value: '非 JSON 字符串也可以导出' }] },
	] });
	const files = readZip(ebook);
	assert.equal([...files.keys()][0], 'mimetype');
	assert.equal(files.get('mimetype').toString(), 'application/epub+zip');
	assert.equal(ebook.readUInt16LE(8), 0, 'mimetype must not be compressed');
	assert.equal(ebook.readUInt16LE(28), 0, 'mimetype has no local extra field');
	const opf = files.get('OEBPS/content.opf').toString();
	assert.match(opf, /unique-identifier="book-id"/);
	assert.match(opf, /<dc:creator>作者甲<\/dc:creator>/);
	for (const reference of opf.matchAll(/href="([^"]+)"/g)) {
		assert.ok(files.has(`OEBPS/${reference[1]}`), `Manifest entry exists: ${reference[1]}`);
	}
	assert.match(files.get('OEBPS/chapter-1.xhtml').toString(), /<h1>第一卷<\/h1>/);
	const chapter = files.get('OEBPS/chapter-2.xhtml').toString();
	assert.match(chapter, /中文数组正文/);
	assert.match(chapter, /&lt;script&gt;alert\(&quot;test&quot;\)&lt;\/script&gt;/);
	assert.match(chapter, /<br\/>第二行/);
	assert.equal(chapter.includes('\u0001'), false);
	assert.equal(chapter.includes('\ud800'), false);
	assert.doesNotMatch(chapter, /<script>/);
	assert.match(files.get('OEBPS/chapter-3.xhtml').toString(), /纯文本内容/);
	assert.match(files.get('OEBPS/chapter-5.xhtml').toString(), /非 JSON 字符串也可以导出/);
});

test('站内图片嵌入并复用，外部、凭证和非标准端口 URL 不触发下载', async () => {
	const png = await sharp({ create: { width: 30, height: 10000, channels: 3, background: '#fafafa' } }).png().toBuffer();
	const requested = [];
	const safe = 'https://img.codesocean.top/image/normal.png';
	const unsafe = [
		'http://127.0.0.1/private', 'file:///etc/passwd', 'https://img.codesocean.top.evil.test/image',
		'https://user:pass@img.codesocean.top/image', 'https://img.codesocean.top:8443/image',
	];
	const ebook = await createNovelEbook({ novel, format: 'epub',
		articles: [{ title: '插图', content: [safe, safe, ...unsafe].map(img => ({ type: 'image', img })) }],
		loadImage: async url => { requested.push(url); return png; },
	});
	assert.deepEqual(requested, [safe]);
	const files = readZip(ebook);
	const images = [...files.keys()].filter(name => name.endsWith('.jpg'));
	assert.equal(images.length, 1);
	const metadata = await sharp(files.get(images[0])).metadata();
	assert.equal(metadata.format, 'jpeg');
	assert.ok(metadata.height <= 2400 && metadata.width <= 1600);
	const chapter = files.get('OEBPS/chapter-1.xhtml').toString();
	assert.equal((chapter.match(/<img /g) || []).length, 2);
	assert.match(chapter, /\[图片\] http:\/\/127\.0\.0\.1\/private/);
});

test('图片失败不会中断 EPUB，图片网址以正文保留', async () => {
	const ebook = await createNovelEbook({ novel, format: 'epub',
		articles: [{ title: '正文', content: [{ type: 'image', img: 'https://img.codesocean.top/image/missing.jpg' }] }],
		loadImage: async () => { throw new Error('timeout'); },
	});
	assert.match(readZip(ebook).get('OEBPS/chapter-1.xhtml').toString(), /\[图片\] https:\/\/img.codesocean.top\/image\/missing\.jpg/);
});

test('PDF 嵌入中文字体，长文自动分页，长图不会超过纸张', async () => {
	const image = await sharp({ create: { width: 40, height: 10000, channels: 3, background: '#abcdef' } }).png().toBuffer();
	const ebook = await createNovelEbook({ novel, format: 'pdf', articles: [
		{ title: '第一卷', content: null },
		{ title: '第一章 < & >', content: [
			{ type: 'text', value: '原木社区中文长文测试，内容需要完整保存。\n'.repeat(350) },
			{ type: 'image', img: 'https://img.codesocean.top/image/tall.png' },
			{ type: 'text', value: ['图片后正文', '，不能丢失。'] },
		] },
	], loadImage: async () => image });
	assert.equal(ebook.subarray(0, 5).toString(), '%PDF-');
	const pdf = ebook.toString('latin1');
	assert.match(pdf, /%%EOF/);
	assert.match(pdf, /\/FontFile[23]/, 'Chinese font is embedded');
	assert.match(pdf, /\/ToUnicode/, 'PDF includes character mapping for extraction');
	assert.ok((pdf.match(/\/Type \/Page\b/g) || []).length > 5);
	assert.match(pdf, /\/Subtype \/Image/);
});

test('未知格式被拒绝，不会尝试下载图片', async () => {
	await assert.rejects(createNovelEbook({ novel, articles: [], format: 'zip',
		loadImage: async () => assert.fail('must not download'),
	}), { statusCode: 400 });
});
