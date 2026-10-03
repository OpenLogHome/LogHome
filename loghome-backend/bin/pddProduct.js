const crypto = require('crypto');

function fail(code, message) {
	const error = new Error(message);
	error.code = code;
	return error;
}

function validateUrl(value) {
	let url;
	try { url = new URL(String(value)); } catch (_) { throw fail('INVALID_URL', '请输入完整的拼多多商品链接'); }
	if (url.protocol !== 'https:' || url.hostname !== 'mobile.yangkeduo.com' || url.port || url.username || url.password ||
		!/^\/goods[12]?\.html$/.test(url.pathname) || (!url.searchParams.get('ps') && !/^\d+$/.test(url.searchParams.get('goods_id') || ''))) {
		throw fail('INVALID_URL', '仅支持 mobile.yangkeduo.com 的 HTTPS 商品分享链接');
	}
	url.hash = '';
	return url.href;
}

function imageUrl(value) {
	try {
		const url = new URL(String(value).replace(/^\/\//, 'https://'));
		return url.protocol === 'https:' && !url.username && !url.password && !url.port && /(^|\.)(pddpic\.com|yangkeduo\.com|pinduoduo\.com)$/.test(url.hostname) ? url.href : null;
	} catch (_) { return null; }
}

function moneyFromCents(value) {
	const n = Number(value);
	return value !== null && value !== undefined && value !== '' && Number.isSafeInteger(n) && n > 0 ? n / 100 : null;
}

function moneyFromYuan(value) {
	// Mobile page camelCase fields are yuan strings, including whole values like "35".
	const text = String(value == null ? '' : value).trim();
	if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
	const n = Number(text);
	return Number.isFinite(n) && n > 0 && n <= 1000000 ? Math.round(n * 100) / 100 : null;
}

function exchangePrice(value) {
	const n = Number(value);
	if (!Number.isFinite(n) || n <= 0 || n > 1000000) throw fail('INVALID_PRICE', '采购成本必须是大于0的有效人民币金额');
	// Integer cents avoid floating point rounding errors; round up to whole logs.
	return Math.ceil(Math.round(n * 100) * 120 / 100);
}

function categoryFor(title) {
	if (/minecraft|我的世界|苦力怕/i.test(title)) return 'Minecraft';
	if (/写作|编剧|手帐|钢笔|作文|创作|笔记本(?!电脑)/.test(title)) return '写作';
	return '其他';
}

function normalizeProduct(raw) {
	const goods = raw.goods || {};
	const goodsId = String(raw.goods_id || goods.goods_id || goods.goodsID || goods.goodsId || '');
	const title = String(goods.goods_name || goods.goodsName || raw.title || '').trim().slice(0, 255);
	if (!/^\d+$/.test(goodsId) || !title) throw fail('EXTRACTION_FAILED', '页面未提供有效商品信息，请登录后重试或手动录入');
	const array = value => Array.isArray(value) ? value : [];
	const mainImages = array(goods.gallery || goods.goods_gallery_urls || goods.goodsGallery);
	const galleries = [...(mainImages.length ? mainImages : array(raw.images)), ...array(goods.detail_gallery || goods.detailGallery)];
	const images = [...new Set(galleries.map(x => imageUrl(typeof x === 'string' ? x : x.url || x.image_url)).filter(Boolean))].slice(0, 50);
	const sourceSkus = array(goods.skus || goods.sku || goods.sku_list);
	const skus = sourceSkus.map((sku, index) => {
		const specs = array(sku.specs || sku.spec);
		const label = specs.map(s => s.spec_value || s.specValue || s.value || '').filter(Boolean).join(' / ') || sku.sku_name || sku.name || `规格${index + 1}`;
		const price = sku.group_price !== undefined ? moneyFromCents(sku.group_price) : moneyFromYuan(sku.groupPrice);
		return {
			id: String(sku.sku_id || sku.skuId || sku.skuID || crypto.createHash('sha256').update(label).digest('hex').slice(0, 20)),
			label: String(label).slice(0, 255), price,
			individual_price: sku.normal_price !== undefined ? moneyFromCents(sku.normal_price) : moneyFromYuan(sku.normalPrice),
			available: String(sku.is_onsale) !== '0' && sku.isOnsale !== false && (sku.quantity === undefined || Number(sku.quantity) > 0),
			image: imageUrl(sku.thumb_url || sku.thumbUrl),
			price_type: price ? 'group_before_coupon' : 'unknown',
		};
	});
	return {
		platform: 'pinduoduo', goods_id: goodsId, title, images, skus,
		description: String(goods.goods_desc || goods.goodsDesc || raw.description || '').slice(0, 10000),
		category: categoryFor(title),
		mall_name: String(goods.mall_name || goods.mallName || raw.mall_name || '').slice(0, 255),
		shipping_desc: raw.shipping_desc || '',
		collected_at: new Date().toISOString(),
		source_url: `https://mobile.yangkeduo.com/goods1.html?goods_id=${goodsId}`,
		warnings: [...(skus.length ? ['价格按规格保存；优惠券和最终采购金额请在下单前核实。', '各规格默认库存999，可在商品管理中调整。'] : ['未能读取结构化规格价格，请手动填写规格和采购成本。']), ...array(raw.warnings)],
	};
}

function needsSkuPrices(raw) {
	const product = normalizeProduct(raw);
	return !product.skus.length || product.skus.some(sku => sku.price === null);
}

function sourceFields(source) {
	if (!source) return { metadata: null, key: null };
	if (source.platform !== 'pinduoduo' || !/^\d+$/.test(String(source.goods_id)) || !source.sku_id || String(source.sku_id).length > 80) {
		throw fail('INVALID_SOURCE', '商品来源信息无效');
	}
	const cost = Number(source.cost_cny);
	exchangePrice(cost);
	const metadata = {
		platform: 'pinduoduo', goods_id: String(source.goods_id), sku_id: String(source.sku_id),
		sku_label: String(source.sku_label || '').slice(0, 255), cost_cny: Math.round(cost * 100) / 100,
		price_type: ['group_before_coupon', 'manual'].includes(source.price_type) ? source.price_type : 'manual',
		collected_at: String(source.collected_at || '').slice(0, 40),
		source_url: `https://mobile.yangkeduo.com/goods1.html?goods_id=${source.goods_id}`,
		markup_percent: 20, logs_per_cny: 100,
	};
	return { metadata: JSON.stringify(metadata), key: crypto.createHash('sha256').update(`${metadata.goods_id}:${metadata.sku_id}`).digest('hex') };
}

module.exports = { fail, validateUrl, imageUrl, normalizeProduct, exchangePrice, sourceFields, needsSkuPrices };
