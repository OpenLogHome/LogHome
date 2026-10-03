const crypto = require('crypto');
const { query, withTransaction } = require('../sql');
const { fail, sourceFields, exchangePrice, imageUrl } = require('./pddProduct');

function parseSource(value) {
	return typeof value === 'string' ? JSON.parse(value) : value || null;
}
function productSourceFields(source) {
	if (!source || source.sku_id) return sourceFields(source);
	if (source.platform !== 'pinduoduo' || !/^\d+$/.test(String(source.goods_id))) throw fail('INVALID_SOURCE', '商品来源无效');
	const metadata = { platform: 'pinduoduo', goods_id: String(source.goods_id),
		source_url: `https://mobile.yangkeduo.com/goods1.html?goods_id=${source.goods_id}`,
		mall_name: String(source.mall_name || '').slice(0, 255), collected_at: String(source.collected_at || '').slice(0, 40),
		goods_title: String(source.goods_title || '').slice(0,255),
		price_type: 'group_before_coupon', markup_percent: 20, logs_per_cny: 100 };
	return { metadata: JSON.stringify(metadata), key: crypto.createHash('sha256').update(`goods:${metadata.goods_id}`).digest('hex') };
}
function normalizeVariants(value) {
	if (!Array.isArray(value) || value.length > 200) throw fail('INVALID_VARIANTS', '规格列表无效（最多200种）');
	const labels = new Set(), ids = new Set();
	return value.map(row => {
		const label = String(row.label || '').trim();
		const price = Number(row.price), stock = Number(row.stock);
		const id = row.id == null ? null : Number(row.id);
		if (!label || label.length > 255 || labels.has(label) || !Number.isFinite(price) || price <= 0 || price > 99999999 ||
			!Number.isInteger(stock) || stock < 0 || stock > 2147483647 || !['on', 'off'].includes(row.status || 'on') ||
			(id !== null && (!Number.isSafeInteger(id) || id <= 0 || ids.has(id)))) throw fail('INVALID_VARIANTS', '规格名称不能重复，价格及库存必须有效');
		labels.add(label); if (id) ids.add(id);
		const source = sourceFields(row.source === undefined ? parseSource(row.source_metadata) : row.source);
		return { id, label, price, stock, cover_url: String(row.cover_url || '').slice(0, 500) || null, status: row.status || 'on', ...source };
	});
}
function aggregate(variants) {
	const active = variants.filter(row => row.status === 'on');
	const stock = active.reduce((sum, row) => sum + row.stock, 0);
	if (stock > 2147483647) throw fail('INVALID_VARIANTS', '规格总库存过大');
	return { price: Math.min(...(active.length ? active : variants).map(row => row.price)), stock };
}
async function saveProduct(body, id) {
	return withTransaction(async q => {
		let old = {};
		if (id) {
			const rows = await q('SELECT * FROM store_products WHERE id = ? FOR UPDATE', [id]);
			if (!rows.length) throw fail('PRODUCT_NOT_FOUND', '商品不存在');
			old = rows[0];
		}
		const data = { ...old, ...body };
		const variants = normalizeVariants(body.variants === undefined ? id ? await q('SELECT * FROM store_product_variants WHERE product_id = ? AND deleted = 0 ORDER BY id', [id]) : [] : body.variants);
		const totals = variants.length ? aggregate(variants) : { price: Number(data.price), stock: Number(data.stock || 0) };
		if (!String(data.title || '').trim() || String(data.title).length > 255 || !['physical', 'virtual'].includes(data.type) ||
			!['on', 'off'].includes(data.status || 'on') || !Number.isFinite(totals.price) || totals.price <= 0 || totals.price > 99999999 ||
			!Number.isInteger(totals.stock) || totals.stock < 0 || totals.stock > 2147483647) throw fail('INVALID_PRODUCT', '商品标题、类型、价格或库存无效');
		const source = body.source === undefined ? { metadata: old.source_metadata || null, key: old.source_key || null } : productSourceFields(body.source);
		if (source.metadata && !parseSource(source.metadata).sku_id && !variants.length) throw fail('INVALID_VARIANTS', '来源商品至少保留一个规格，可将停售规格停用');
		if (source.metadata) {
			const parentSource = parseSource(source.metadata);
			for (const variant of variants) if (variant.metadata && parseSource(variant.metadata).goods_id !== parentSource.goods_id) throw fail('INVALID_SOURCE', '规格来源商品与当前商品不一致');
		}
		const fields = ['title','summary','description','type','price','stock','cover_url','media_urls','shipping_desc','status','category','source_metadata','source_key','has_variants'];
		const values = [data.title,data.summary || null,data.description || null,data.type,totals.price,totals.stock,data.cover_url || null,data.media_urls || null,data.shipping_desc || null,data.status || 'on',String(data.category || '').slice(0,80) || null,source.metadata,source.key,variants.length ? 1 : 0];
		if (id) await q(`UPDATE store_products SET ${fields.map(f => f + ' = ?').join(', ')} WHERE id = ?`, [...values,id]);
		else id = (await q(`INSERT INTO store_products (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,values)).insertId;
		const existing = await q('SELECT id FROM store_product_variants WHERE product_id = ?', [id]);
		const owned = new Set(existing.map(row => row.id));
		for (const row of variants) if (row.id && !owned.has(row.id)) throw fail('INVALID_VARIANTS', '规格不属于当前商品');
		// Retain old rows for order references, but make removed variants unavailable.
		await q("UPDATE store_product_variants SET status = 'off', stock = 0, deleted = 1 WHERE product_id = ?", [id]);
		for (const row of variants) {
			const values = [row.label,row.price,row.stock,row.cover_url,row.status,row.metadata,row.key];
			if (row.id) await q('UPDATE store_product_variants SET deleted = 0, label = ?, price = ?, stock = ?, cover_url = ?, status = ?, source_metadata = ?, source_key = ? WHERE id = ? AND product_id = ?', [...values,row.id,id]);
			else await q('INSERT INTO store_product_variants (label,price,stock,cover_url,status,source_metadata,source_key,product_id) VALUES (?,?,?,?,?,?,?,?)', [...values,id]);
		}
		return { product_id: id, variant_count: variants.length };
	}, 'store.saveProduct');
}
async function attachVariants(products, includeSource = false) {
	if (!products.length) return products;
	const rows = await query(`SELECT id,product_id,label,price,stock,cover_url,status${includeSource ? ',source_metadata' : ''} FROM store_product_variants WHERE product_id IN (?) AND deleted = 0 ${includeSource ? '' : "AND status = 'on'"} ORDER BY id`, [products.map(row => row.id)]);
	for (const product of products) product.variants = rows.filter(row => row.product_id === product.id);
	return products;
}
function buildPddProduct(product, category) {
	if (!product.skus.length || product.skus.some(sku => !sku.price || sku.price_type !== 'group_before_coupon')) throw fail('INCOMPLETE_SKUS', '部分规格缺少券前拼单价，无法一键导入，请重新采集');
	if (product.warnings.some(w => /部分规格|最多|超时|上限/.test(w))) throw fail('INCOMPLETE_SKUS', '规格采集不完整，请重新采集后导入');
	const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
	const images = product.images.map(imageUrl).filter(Boolean);
	return { title: product.title, type: 'physical', status: 'off', category: category || product.category,
		cover_url: images[0] || '', media_urls: JSON.stringify(images), shipping_desc: product.shipping_desc,
		description: '<p>' + escape(product.description || product.title).replace(/\n/g, '<br>') + '</p>' + images.map(url => '<p><img src="'+escape(url)+'" style="max-width:100%"></p>').join(''),
		source: { platform:'pinduoduo',goods_id:product.goods_id,goods_title:product.title,mall_name:product.mall_name,collected_at:product.collected_at },
		variants: product.skus.map(sku => ({ label:sku.label,price:exchangePrice(sku.price),stock:999,status:sku.available ? 'on' : 'off',cover_url:sku.image,
			source:{platform:'pinduoduo',goods_id:product.goods_id,sku_id:sku.id,sku_label:sku.label,cost_cny:sku.price,price_type:'group_before_coupon',collected_at:product.collected_at} })) };
}
module.exports = { saveProduct, attachVariants, normalizeVariants, aggregate, buildPddProduct, productSourceFields };
