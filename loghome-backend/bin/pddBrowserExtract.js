// Runs inside Selenium's isolated browser. Never return cookies or raw page state.
module.exports = function extractPage() {
	const visibleText = document.body ? document.body.innerText : '';
	const url = new URL(location.href);
	const goodsId = url.searchParams.get('goods_id');
	const root = window.rawData && window.rawData.store;
	const queue = [root && root.initDataObj, root, window.__INITIAL_STATE__].filter(Boolean);
	const seen = new Set();
	let goods = null;
	while (queue.length && seen.size < 4000) {
		const item = queue.shift();
		if (!item || typeof item !== 'object' || seen.has(item)) continue;
		seen.add(item);
		const id = item.goods_id || item.goodsID || item.goodsId;
		if ((item.goods_name || item.goodsName) && String(id) === String(goodsId)) { goods = item; break; }
		Object.values(item).forEach(value => { if (value && typeof value === 'object') queue.push(value); });
	}
	const init = root && root.initDataObj;
	const needLogin = !goods && ((init && init.needLogin === true) || /login\.html/.test(location.pathname) || /请输入手机号|短信验证码登录|微信登录/.test(visibleText));
	const blocked = /请完成验证|安全验证|访问过于频繁|滑动.*验证/.test(visibleText);
	const meta = document.querySelector('meta[property="og:title"]');
	const lines = visibleText.split('\n').map(x => x.trim()).filter(Boolean);
	const title = goods ? '' : (meta && meta.content) || lines.find(x => x.length > 15 && /我的世界|Minecraft|写作/.test(x)) || '';
	const images = [...document.images].filter(img => /商品大图|查看图片/.test(img.alt)).map(img => img.currentSrc || img.src);
	const detailStart = visibleText.indexOf('商品详情');
	const detailEnd = detailStart >= 0 ? visibleText.indexOf('点击查看商品价格说明', detailStart) : -1;
	const description = detailStart >= 0 && detailEnd > detailStart ? visibleText.slice(detailStart + 4, detailEnd).trim() : '';
	return {
		goods_id: goodsId, goods, title, images, need_login: Boolean(needLogin && !title), blocked,
		description,
		shipping_desc: lines.find(x => /\d+小时内发货/.test(x)) || '',
	};
};
