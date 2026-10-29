const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { ZipFile } = require('yazl');
const PDFDocument = require('pdfkit');

const FONT_PATH = path.join(__dirname, '../assets/fonts/SourceHanSansSC-Regular.ttf');
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function plainText(value) {
	if (value == null) return '';
	if (Array.isArray(value)) return value.map(plainText).join('');
	if (typeof value === 'object') return plainText(value.value ?? value.text ?? '');
	// XML 1.0 cannot represent control characters or unpaired UTF-16 surrogates.
	return Array.from(String(value)).filter(character => {
		const code = character.codePointAt(0);
		return code === 9 || code === 10 || code === 13 ||
			(code >= 0x20 && code <= 0xd7ff) ||
			(code >= 0xe000 && code <= 0xfffd) || code >= 0x10000;
	}).join('');
}

function escapeXml(value) {
	return plainText(value).replace(/[&<>"']/g, character => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;',
	}[character]));
}

function normalizeBlocks(content, depth = 0) {
	if (content == null || depth > 8) return [];
	if (typeof content === 'string') {
		try {
			return normalizeBlocks(JSON.parse(content), depth + 1);
		} catch (_) {
			return [{ type: 'text', text: plainText(content) }];
		}
	}
	if (Array.isArray(content)) return content.flatMap(block => normalizeBlocks(block, depth + 1));
	if (typeof content === 'object') {
		if (content.type === 'image') return [{ type: 'image', url: plainText(content.img || content.src) }];
		if ('value' in content || 'text' in content) return [{ type: 'text', text: plainText(content.value ?? content.text) }];
		if ('content' in content) return normalizeBlocks(content.content, depth + 1);
		return [];
	}
	return [{ type: 'text', text: plainText(content) }];
}

function trustedImageUrl(value) {
	try {
		const url = new URL(value);
		return ['http:', 'https:'].includes(url.protocol) &&
			url.hostname === 'img.codesocean.top' && !url.port && !url.username && !url.password;
	} catch (_) {
		return false;
	}
}

async function downloadImage(url) {
	const response = await axios.get(url, {
		responseType: 'arraybuffer', timeout: 5000, maxRedirects: 0,
		maxContentLength: MAX_IMAGE_BYTES, maxBodyLength: MAX_IMAGE_BYTES,
	});
	return Buffer.from(response.data);
}

async function prepareChapters(articles, loadImage) {
	const images = new Map();
	const chapters = [];
	for (const [index, article] of articles.entries()) {
		await new Promise(resolve => setImmediate(resolve));
		const blocks = normalizeBlocks(article.content);
		for (const block of blocks) {
			if (block.type !== 'image' || !trustedImageUrl(block.url)) continue;
			if (!images.has(block.url)) {
				let image = null;
				try {
					const input = await loadImage(block.url);
					if (!Buffer.isBuffer(input) || input.length > MAX_IMAGE_BYTES) throw new Error('Image too large');
					const result = await sharp(input, { limitInputPixels: 40000000, animated: false })
						.rotate().resize({ width: 1600, height: 2400, fit: 'inside', withoutEnlargement: true })
						.flatten({ background: '#ffffff' }).jpeg({ quality: 85 }).toBuffer({ resolveWithObject: true });
					image = { data: result.data, width: result.info.width, height: result.info.height,
						filename: `images/image-${images.size + 1}.jpg` };
				} catch (_) {
					// A failed or unsupported image must not prevent exporting the manuscript.
				}
				images.set(block.url, image);
			}
			block.image = images.get(block.url);
		}
		chapters.push({ title: plainText(article.title) || `第 ${index + 1} 章`, blocks });
	}
	return { chapters, images: [...images.values()].filter(Boolean) };
}

function imagePlaceholder(block) {
	return block.url ? `[图片] ${block.url}` : '[图片]';
}

function xhtml(title, body) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="zh-CN" lang="zh-CN">
<head><title>${escapeXml(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>${body}</body></html>`;
}

async function createEpub(novel, chapters, images) {
	const title = plainText(novel.name) || '未命名作品';
	const author = plainText(novel.author_name) || '未知作者';
	const identifier = `urn:loghome:novel:${plainText(novel.novel_id) || 'export'}`;
	const entries = [
		['mimetype', 'application/epub+zip'],
		['META-INF/container.xml', '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'],
		['OEBPS/style.css', 'body{font-family:serif;line-height:1.7;margin:1em}h1{line-height:1.3}p{white-space:pre-wrap;overflow-wrap:anywhere}img{max-width:100%;height:auto}'],
	];
	const nav = chapters.map((chapter, index) => `<li><a href="chapter-${index + 1}.xhtml">${escapeXml(chapter.title)}</a></li>`).join('');
	entries.push(['OEBPS/nav.xhtml', xhtml(title, `<nav epub:type="toc" id="toc"><h1>${escapeXml(title)}</h1><ol>${nav}</ol></nav>`)]);
	entries.push(['OEBPS/toc.ncx', `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="${escapeXml(identifier)}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${escapeXml(title)}</text></docTitle><navMap>${chapters.map((chapter, index) => `<navPoint id="chapter-${index + 1}" playOrder="${index + 1}"><navLabel><text>${escapeXml(chapter.title)}</text></navLabel><content src="chapter-${index + 1}.xhtml"/></navPoint>`).join('')}</navMap></ncx>`]);
	entries.push(['OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="zh-CN">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${escapeXml(identifier)}</dc:identifier><dc:title>${escapeXml(title)}</dc:title><dc:creator>${escapeXml(author)}</dc:creator><dc:language>zh-CN</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')}</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="style" href="style.css" media-type="text/css"/>${chapters.map((_, index) => `<item id="chapter-${index + 1}" href="chapter-${index + 1}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${images.map((image, index) => `<item id="image-${index + 1}" href="${image.filename}" media-type="image/jpeg"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="nav"/>${chapters.map((_, index) => `<itemref idref="chapter-${index + 1}"/>`).join('')}</spine></package>`]);
	chapters.forEach((chapter, index) => {
		const body = chapter.blocks.map(block => block.type === 'image'
			? (block.image ? `<p><img src="${block.image.filename}" alt="插图"/></p>` : `<p>${escapeXml(imagePlaceholder(block))}</p>`)
			: `<p>${escapeXml(block.text).replace(/\r\n?|\n/g, '<br/>')}</p>`).join('');
		entries.push([`OEBPS/chapter-${index + 1}.xhtml`, xhtml(chapter.title, `<h1>${escapeXml(chapter.title)}</h1>${body}`)]);
	});
	images.forEach(image => entries.push([`OEBPS/${image.filename}`, image.data]));
	return new Promise((resolve, reject) => {
		const archive = new ZipFile();
		const chunks = [];
		archive.outputStream.on('data', chunk => chunks.push(chunk));
		archive.on('error', reject);
		archive.outputStream.on('error', reject);
		archive.outputStream.on('end', () => resolve(Buffer.concat(chunks)));
		try {
			entries.forEach(([relativePath, data], index) => archive.addBuffer(
				Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8'), relativePath, { compress: index !== 0 },
			));
			archive.end();
		} catch (error) {
			archive.outputStream.destroy();
			reject(error);
		}
	});
}

async function createPdf(novel, chapters) {
	return new Promise((resolve, reject) => {
		const document = new PDFDocument({ size: 'A4', margin: 56, info: {
			Title: plainText(novel.name), Author: plainText(novel.author_name), Creator: '原木社区',
		} });
		const chunks = [];
		document.on('data', chunk => chunks.push(chunk));
		document.on('error', reject);
		document.on('end', () => resolve(Buffer.concat(chunks)));
		const render = async () => {
			document.font(FONT_PATH);
			document.fontSize(24).text(plainText(novel.name) || '未命名作品', { align: 'center' });
			document.moveDown().fontSize(12).text(plainText(novel.author_name) || '未知作者', { align: 'center' });
			for (const chapter of chapters) {
				await new Promise(resume => setImmediate(resume));
				document.addPage();
				document.outline.addItem(chapter.title);
				document.fontSize(18).text(chapter.title, { lineGap: 4 });
				document.moveDown().fontSize(11);
				for (const [index, block] of chapter.blocks.entries()) {
					if (index % 20 === 0) await new Promise(resume => setImmediate(resume));
					if (block.type === 'image' && block.image) {
						const { image } = block;
						const width = document.page.width - 112;
						const height = document.page.height - 124;
						const scale = Math.min(width / image.width, height / image.height, 1);
						const drawWidth = image.width * scale;
						const drawHeight = image.height * scale;
						if (document.y + drawHeight > document.page.height - 56) document.addPage();
						const top = document.y;
						document.image(image.data, 56 + (width - drawWidth) / 2, top, { width: drawWidth, height: drawHeight });
						document.y = top + drawHeight + 12;
					} else {
						document.text(block.type === 'image' ? imagePlaceholder(block) : block.text, 56, document.y,
							{ width: document.page.width - 112, lineGap: 5, paragraphGap: 8 });
					}
				}
			}
			document.end();
		};
		render().catch(error => {
			document.destroy();
			reject(error);
		});
	});
}

async function createNovelEbook({ novel, articles, format, loadImage = downloadImage }) {
	if (!['epub', 'pdf'].includes(format)) throw Object.assign(new Error('不支持的电子书格式'), { statusCode: 400 });
	const { chapters, images } = await prepareChapters(articles, loadImage);
	return format === 'epub' ? createEpub(novel, chapters, images) : createPdf(novel, chapters);
}

function packSafeName(value) {
	return Array.from(value.replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g, '_')).slice(0, 60).join('') || '未命名';
}

function createZip(entries) {
	return new Promise((resolve, reject) => {
		const archive = new ZipFile();
		const chunks = [];
		archive.outputStream.on('data', chunk => chunks.push(chunk));
		archive.on('error', reject);
		archive.outputStream.on('error', reject);
		archive.outputStream.on('end', () => resolve(Buffer.concat(chunks)));
		try {
			entries.forEach(([relativePath, data]) => archive.addBuffer(
				Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8'), relativePath,
			));
			archive.end();
		} catch (error) {
			archive.outputStream.destroy();
			reject(error);
		}
	});
}

// 免费打包导出：按章节输出 UTF-8（带 BOM）文本文件，图片以占位链接形式保留。
async function createNovelPack({ novel, articles }) {
	const entries = [
		['作品信息.txt', '\uFEFF' + [
			`书名：${plainText(novel.name) || '未命名作品'}`,
			`作者：${plainText(novel.author_name) || '未知作者'}`,
			`章节数：${articles.length}`,
			`导出时间：${new Date().toISOString()}`,
		].join('\r\n') + '\r\n'],
	];
	for (const [index, article] of articles.entries()) {
		await new Promise(resolve => setImmediate(resolve));
		const title = plainText(article.title) || `第 ${index + 1} 章`;
		const body = normalizeBlocks(article.content)
			.map(block => block.type === 'image' ? imagePlaceholder(block) : block.text)
			.join('\r\n\r\n');
		entries.push([`chapters/${String(index + 1).padStart(3, '0')}-${packSafeName(title)}.txt`,
			`\uFEFF${title}\r\n\r\n${body}\r\n`]);
	}
	return createZip(entries);
}

module.exports = { createNovelEbook, createNovelPack };
