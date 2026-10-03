const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validateUrl, normalizeProduct, exchangePrice, sourceFields, needsSkuPrices } = require('../bin/pddProduct');
const extractPage = require('../bin/pddBrowserExtract');
const { saveState, readState } = require('../bin/pddSelenium');

let passed = 0;
function test(name, run) { run(); passed++; console.log(`PASS ${name}`); }

test('share URLs and direct goods URLs accepted; credentials, ports, other hosts rejected', () => {
	assert.strictEqual(validateUrl('https://mobile.yangkeduo.com/goods1.html?ps=sznXebr7iU'), 'https://mobile.yangkeduo.com/goods1.html?ps=sznXebr7iU');
	assert.doesNotThrow(() => validateUrl('https://mobile.yangkeduo.com/goods2.html?goods_id=665425217046'));
	for (const url of ['http://mobile.yangkeduo.com/goods1.html?ps=x', 'https://mobile.yangkeduo.com.evil.test/goods1.html?ps=x', 'https://user:pwd@mobile.yangkeduo.com/goods1.html?ps=x', 'https://mobile.yangkeduo.com:444/goods1.html?ps=x', 'https://mobile.yangkeduo.com/personal.html', 'http://127.0.0.1', 'javascript:alert(1)']) assert.throws(() => validateUrl(url), { code: 'INVALID_URL' });
});

const fixture = {
	goods_id: '665425217046',
	goods: { goods_id: 665425217046, goods_name: '我的世界Minecraft亚克力钥匙扣',
		gallery: [{ url: 'https://img.pddpic.com/product.jpg' }, { url: 'javascript:alert(1)' }, { url: 'https://attacker.test/a.jpg' }],
		skus: [
			{ sku_id: 1, group_price: 280, normal_price: 400, specs: [{ spec_value: '随机1个' }], quantity: 8 },
			{ sku_id: 2, group_price: 680, specs: [{ spec_value: '混装30个' }], quantity: 0 },
			{ sku_id: 3, specs: [{ spec_value: '未知价格规格' }] },
		],
	},
};
test('SKU prices stay distinct; sold out and unknown prices are preserved', () => {
	const product = normalizeProduct(fixture);
	assert.strictEqual(product.skus[0].price, 2.8);
	assert.strictEqual(product.skus[0].individual_price, 4);
	assert.strictEqual(product.skus[1].price, 6.8);
	assert.strictEqual(product.skus[1].available, false);
	assert.strictEqual(product.skus[2].price, null);
	assert.deepStrictEqual(product.images, ['https://img.pddpic.com/product.jpg']);
	assert.strictEqual(product.category, 'Minecraft');
	assert(!product.source_url.includes('ps='));
});
test('mobile camelCase prices are yuan, independent of coupon prices; missing SKU costs trigger DOM fallback', () => {
	const raw = { goods: { goodsID: '665425217046', goodsName: 'Minecraft', skus: [
		{ skuID: '100', groupPrice: '13.8', normalPrice: '35', oldGroupPrice: 1380, skuPrice: 1280, priceDisplay: {prefix: '券后', price: '12.8'}, specs: [{specValue: '混装100个'}] },
		{ skuId: '30', groupPrice: '6.8', normalPrice: '10', skuPrice: 580, specs: [{specValue: '混装30个'}] },
		{ skuId: '1', groupPrice: '2', normalPrice: '4', specs: [{specValue: '1个'}] },
	] } };
	const product = normalizeProduct(raw);
	assert.deepStrictEqual(product.skus.map(sku => sku.price), [13.8, 6.8, 2]);
	assert.equal(product.skus[0].individual_price, 35);
	assert.equal(product.skus[0].id, '100');
	assert.equal(exchangePrice(product.skus[0].price), 1656);
	assert.equal(needsSkuPrices(raw), false);
	delete raw.goods.skus[1].groupPrice;
	assert.equal(normalizeProduct(raw).skus[1].price, null);
	assert.equal(needsSkuPrices(raw), true);
});
test('100 logs per CNY plus 20% markup and whole log rounding', () => {
	assert.strictEqual(exchangePrice(2.8), 336);
	assert.strictEqual(exchangePrice(6.8), 816);
	assert.strictEqual(exchangePrice(13.8), 1656);
	assert.strictEqual(exchangePrice(0.01), 2);
	for (const value of [0, -1, NaN, Infinity, 'abc']) assert.throws(() => exchangePrice(value), { code: 'INVALID_PRICE' });
});
test('invalid and incomplete pages cannot create a product', () => {
	assert.throws(() => normalizeProduct({ goods_id: '123' }), { code: 'EXTRACTION_FAILED' });
	assert.throws(() => normalizeProduct({ title: '登录页' }), { code: 'EXTRACTION_FAILED' });
});
test('source key deduplicates goods/SKU; source metadata never includes credentials', () => {
	const source = { platform: 'pinduoduo', goods_id: '123', sku_id: 'random-1', sku_label: '随机1个', cost_cny: 2.8, cookie: 'SECRET', source_url: 'https://evil.test' };
	const a = sourceFields(source);
	const b = sourceFields({ ...source, cost_cny: 3.8 });
	assert.strictEqual(a.key, b.key);
	assert.notStrictEqual(a.key, sourceFields({ ...source, sku_id: 'random-10' }).key);
	assert(!a.metadata.includes('SECRET'));
	assert(!a.metadata.includes('evil.test'));
	assert.throws(() => sourceFields({ ...source, goods_id: '../escape' }), { code: 'INVALID_SOURCE' });
});
test('browser extraction only selects the exact linked goods ID', () => {
	global.location = { href: 'https://mobile.yangkeduo.com/goods1.html?goods_id=665425217046', pathname: '/goods1.html' };
	global.document = { body: { innerText: '' }, images: [], querySelector: () => null };
	global.window = { rawData: { store: { initDataObj: { recommended: { goods_id: 999, goods_name: '另一个商品' }, goods: fixture.goods } } } };
	const result = extractPage();
	assert.strictEqual(result.goods.goods_id, 665425217046);
	assert.strictEqual(result.need_login, false);
	global.window.rawData.store.initDataObj = { needLogin: true };
	assert.strictEqual(extractPage().need_login, true);
	global.document.body.innerText = '请完成验证';
	assert.strictEqual(extractPage().blocked, true);
	delete global.window; delete global.document; delete global.location;
});
test('encrypted sessions survive re-reading, isolate admins, reject tampering', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loghome-pdd-test-'));
	const oldDir = process.env.PDD_SESSION_DIR;
	const oldKey = process.env.PDD_SESSION_KEY;
	process.env.PDD_SESSION_DIR = dir;
	process.env.PDD_SESSION_KEY = '01'.repeat(32);
	try {
		const state = { cookies: [{ name: 'test', value: 'PRIVATE_COOKIE', domain: '.yangkeduo.com' }], storage: { test: 'PRIVATE_STORAGE' } };
		saveState('100', state);
		assert.deepStrictEqual(readState('100'), state);
		assert.strictEqual(readState('101'), null);
		const file = fs.readFileSync(path.join(dir, '100.enc'), 'utf8');
		assert(!file.includes('PRIVATE_COOKIE'));
		assert(!file.includes('PRIVATE_STORAGE'));
		fs.writeFileSync(path.join(dir, '101.enc'), file);
		assert.throws(() => readState('101'), { code: 'SESSION_INVALID' });
		process.env.PDD_SESSION_KEY = '02'.repeat(32);
		assert.throws(() => readState('100'), { code: 'SESSION_INVALID' });
		assert.throws(() => readState('../escape'), { code: 'INVALID_OWNER' });
	} finally {
		fs.rmSync(dir, { recursive: true, force: true });
		if (oldDir === undefined) delete process.env.PDD_SESSION_DIR; else process.env.PDD_SESSION_DIR = oldDir;
		if (oldKey === undefined) delete process.env.PDD_SESSION_KEY; else process.env.PDD_SESSION_KEY = oldKey;
	}
});

console.log(`${passed} test groups passed`);
