// DOM fallback when the site no longer embeds SKU data in its initial state.
// Only opens the selector and clicks options; never clicks 确定 or submits an order.
module.exports = function skuDialog(operation, selection) {
	const visible = element => !!(element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
	const buttons = [...document.querySelectorAll('button,[role="button"]')].filter(visible);
	if (operation === 'open') {
		const button = buttons.find(element => /发起拼单\s*$/.test(element.innerText || element.textContent || ''));
		if (button) button.click();
		return Boolean(button);
	}
	const close = buttons.find(element => /关闭弹窗/.test(element.getAttribute('aria-label') || element.innerText || ''));
	if (!close) return null;
	let root = close.parentElement;
	while (root && !(/已选/.test(root.innerText || '') && /确定/.test(root.innerText || ''))) root = root.parentElement;
	if (!root || root === document.body) return null;
	if (operation === 'close') { close.click(); return true; }
	const text = root.innerText;
	const label = (text.match(/已选[：:]\s*([^\n]+)/) || [])[1];
	const price = (text.match(/券前\s*[¥￥]?\s*(\d+(?:\.\d+)?)/) || [])[1];
	const groups = [];
	for (const heading of [...root.querySelectorAll('*')].filter(element => visible(element) && /^(款式|组合|颜色|尺码|规格)$/.test(element.textContent.trim()))) {
		if (heading.children.length) continue;
		let group = heading.parentElement;
		while (group && group !== root && !group.querySelector('button,[role="button"]')) group = group.parentElement;
		if (!group || group === root) continue;
		const options = [...group.querySelectorAll('button,[role="button"]')].filter(visible).filter(element => element.getAttribute('aria-disabled') !== 'true' && !element.disabled).map(element => (element.innerText || element.textContent).trim().split(/\n|已拼/)[0].trim()).filter(Boolean);
		if (options.length && options.every(option => !/确定|购买|拼单|关闭|数量/.test(option))) groups.push({ name: heading.textContent.trim(), options: [...new Set(options)] });
	}
	if (operation === 'select') {
		for (const value of selection) {
			const button = [...root.querySelectorAll('button,[role="button"]')].find(element => visible(element) && (element.innerText || element.textContent).trim().split(/\n|已拼/)[0].trim() === value);
			if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return false;
			button.click();
		}
		return true;
	}
	return { label, price: price ? Number(price) : null, groups };
};
