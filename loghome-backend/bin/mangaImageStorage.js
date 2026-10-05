const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');

const DEFAULT_UPLOAD_URL = 'https://img.codesocean.top/upload/img';

async function uploadMangaImageFile(asset, format, { url = DEFAULT_UPLOAD_URL, apikey, cancelToken } = {}) {
	if (!Buffer.isBuffer(asset) || !asset.length) {
		throw new Error('图片内容无效');
	}
	const normalizedFormat = format === 'jpg' ? 'jpeg' : format;
	if (!['jpeg', 'png', 'webp', 'gif'].includes(normalizedFormat)) {
		throw new Error('不支持的图片格式');
	}
	const extension = normalizedFormat === 'jpeg' ? 'jpg' : normalizedFormat;
	const form = new FormData();
	form.append('img', asset, {
		filename: `manga-${crypto.randomBytes(8).toString('hex')}.${extension}`,
		contentType: `image/${normalizedFormat}`,
		knownLength: asset.length,
	});
	const response = await axios.post(url, form, {
		headers: {
			...form.getHeaders(),
			'Content-Length': form.getLengthSync(),
			apikey,
		},
		maxBodyLength: Infinity,
		timeout: 180000,
		cancelToken,
	});
	const uploadedUrl = response.data && response.data.url;
	if (!uploadedUrl || !/^https?:\/\//i.test(uploadedUrl)) {
		throw new Error('图片存储服务暂时不可用');
	}
	return uploadedUrl;
}

module.exports = { DEFAULT_UPLOAD_URL, uploadMangaImageFile };
