const setting = require('../bin/pddConfig');
// Browser contract tests against a local fixture, without credentials or orders.
const assert = require('assert');
const http = require('http');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
const extractPage = require('../bin/pddBrowserExtract');
const skuDialog = require('../bin/pddSkuDialog');
const { normalizeProduct } = require('../bin/pddProduct');

const fixture = `<!doctype html><html><meta charset="UTF-8"><body>
<button onclick="document.getElementById('modal').style.display='block'">券后 ¥1.8 发起拼单</button>
<div id="modal" style="display:none">
  <button aria-label="关闭弹窗" onclick="document.getElementById('modal').style.display='none'">关闭</button>
  <div><span id="selected">已选：我的世界【钥匙扣】 随机1个</span><span id="price">券前¥2.8</span></div>
  <div><span>款式</span><button>我的世界【钥匙扣】</button></div>
  <div><span>组合</span><button onclick="update('随机1个',2.8)">随机1个</button><button onclick="update('混装30个',6.8)">混装30个</button></div>
  <button onclick="window.orderSubmitted=true">确定</button>
</div>
<script>
window.orderSubmitted=false;
function update(label,price) { document.getElementById('selected').textContent='已选：我的世界【钥匙扣】 '+label; document.getElementById('price').textContent='券前¥'+price; }
window.rawData={store:{initDataObj:{recommendation:{goods_id:999,goods_name:'推荐商品'},goods:{goods_id:665425217046,goods_name:'Minecraft钥匙扣',skus:[{sku_id:30,group_price:680,specs:[{spec_value:'混装30个'}]}]}}}};
</script></body></html>`;

async function run() {
	const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html;charset=utf-8'); res.end(fixture); });
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	let driver;
	try {
		const isEdge = setting('PDD_BROWSER') === 'edge';
		const options = isEdge ? new edge.Options() : new chrome.Options();
		options.addArguments('--headless=new');
		let builder = new Builder().forBrowser(isEdge ? 'MicrosoftEdge' : 'chrome');
		builder = isEdge ? builder.setEdgeOptions(options) : builder.setChromeOptions(options);
		if (setting('PDD_SELENIUM_URL')) builder = builder.usingServer(setting('PDD_SELENIUM_URL'));
		else if (setting('PDD_DRIVER_PATH')) builder = isEdge ? builder.setEdgeService(new edge.ServiceBuilder(setting('PDD_DRIVER_PATH'))) : builder.setChromeService(new chrome.ServiceBuilder(setting('PDD_DRIVER_PATH')));
		driver = await builder.build();
		await driver.get(`http://127.0.0.1:${server.address().port}/goods1.html?goods_id=665425217046`);
		const product = normalizeProduct(await driver.executeScript(extractPage));
		assert.strictEqual(product.title, 'Minecraft钥匙扣');
		assert.strictEqual(product.skus[0].price, 6.8);
		assert.strictEqual(await driver.executeScript(skuDialog, 'open', null), true);
		let dialog = await driver.executeScript(skuDialog, 'read', null);
		assert.deepStrictEqual(dialog.groups.map(group => group.options), [['我的世界【钥匙扣】'], ['随机1个', '混装30个']]);
		assert.strictEqual(dialog.price, 2.8);
		assert.strictEqual(await driver.executeScript(skuDialog, 'select', ['我的世界【钥匙扣】', '混装30个']), true);
		dialog = await driver.executeScript(skuDialog, 'read', null);
		assert.strictEqual(dialog.price, 6.8);
		assert(dialog.label.includes('混装30个'));
		assert.strictEqual(await driver.executeScript('return window.orderSubmitted'), false);
		await driver.executeScript(skuDialog, 'close', null);
		assert.strictEqual(await driver.executeScript(skuDialog, 'read', null), null);
		console.log('PASS Selenium: exact product extraction, SKU selection, before-coupon price, no order submission');
	} finally { if (driver) await driver.quit(); server.close(); }
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
