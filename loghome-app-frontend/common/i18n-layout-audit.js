const STORAGE_KEY = 'loghome_i18n_layout_audit';
const DEFAULT_WAIT_MS = 1800;
const MIN_OVERLAP_PX = 3;

const DENSE_SELECTOR = [
	'uni-text',
	'uni-button',
	'button',
	'label',
	'input',
	'textarea',
	'[class*="tab"]',
	'[class*="button"]',
	'[class*="btn"]',
	'[class*="chip"]',
	'[class*="badge"]',
	'[class*="label"]',
	'[class*="action"]',
	'[class*="nav"]',
	'[class*="header"]',
	'[class*="toolbar"]',
	'[class*="footer"]',
	'[class*="menu"]',
	'[class*="filter"]',
	'[class*="segment"]'
].join(',');

const OVERLAP_SELECTOR = 'uni-text,span,button,uni-button';

function normalizeText(value) {
	return String(value || '').replace(/\s+/g, ' ').trim();
}

function describeElement(element) {
	const className = typeof element.className === 'string'
		? element.className.trim().split(/\s+/).slice(0, 4).join('.')
		: '';
	return element.tagName.toLowerCase() + (className ? '.' + className : '');
}

function isVisible(element, style) {
	const rect = element.getBoundingClientRect();
	return style.display !== 'none' &&
		style.visibility !== 'hidden' &&
		Number(style.opacity || 1) !== 0 &&
		rect.width > 0 && rect.height > 0 &&
		rect.right > 0 && rect.left < element.ownerDocument.defaultView.innerWidth;
}

function roundedRect(rect) {
	return {
		x: Math.round(rect.x),
		y: Math.round(rect.y),
		width: Math.round(rect.width),
		height: Math.round(rect.height)
	};
}

function collectOverflowIssues(root, win) {
	const issues = [];
	Array.from(root.querySelectorAll(DENSE_SELECTOR)).forEach(element => {
		const style = win.getComputedStyle(element);
		if (!isVisible(element, style)) return;
		const overflowX = element.scrollWidth - element.clientWidth;
		const overflowY = element.scrollHeight - element.clientHeight;
		const clippedX = overflowX > 2 && style.overflowX !== 'visible';
		const clippedY = overflowY > 2 && style.overflowY !== 'visible';
		if (!clippedX && !clippedY) return;
		issues.push({
			type: 'overflow',
			element: describeElement(element),
			text: normalizeText(element.innerText || element.value).slice(0, 160),
			overflowX: clippedX ? Math.round(overflowX) : 0,
			overflowY: clippedY ? Math.round(overflowY) : 0,
			whiteSpace: style.whiteSpace,
			textOverflow: style.textOverflow,
			rect: roundedRect(element.getBoundingClientRect())
		});
	});
	return issues;
}

function intersection(a, b) {
	const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
	const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
	return { width, height };
}

function collectOverlapIssues(root, win) {
	const issues = [];
	const elements = Array.from(root.querySelectorAll(OVERLAP_SELECTOR)).filter(element => {
		const style = win.getComputedStyle(element);
		return isVisible(element, style) &&
			normalizeText(element.innerText) &&
			!style.display.startsWith('inline');
	});

	for (let leftIndex = 0; leftIndex < elements.length; leftIndex += 1) {
		const left = elements[leftIndex];
		const leftRect = left.getBoundingClientRect();
		for (let rightIndex = leftIndex + 1; rightIndex < elements.length; rightIndex += 1) {
			const right = elements[rightIndex];
			if (left.contains(right) || right.contains(left)) continue;
			const rightRect = right.getBoundingClientRect();
			const overlap = intersection(leftRect, rightRect);
			if (overlap.width <= MIN_OVERLAP_PX || overlap.height <= MIN_OVERLAP_PX) continue;
			issues.push({
				type: 'overlap',
				first: {
					element: describeElement(left),
					text: normalizeText(left.innerText).slice(0, 100),
					rect: roundedRect(leftRect)
				},
				second: {
					element: describeElement(right),
					text: normalizeText(right.innerText).slice(0, 100),
					rect: roundedRect(rightRect)
				},
				overlap: {
					width: Math.round(overlap.width),
					height: Math.round(overlap.height)
				}
			});
		}
	}
	return issues;
}

export function collectI18nLayoutIssues(root, win = window) {
	return collectOverflowIssues(root, win).concat(collectOverlapIssues(root, win));
}

function readConfig(win) {
	try {
		const value = JSON.parse(win.localStorage.getItem(STORAGE_KEY) || 'null');
		if (!value || !Array.isArray(value.routes) || !value.routes.length) return null;
		return value;
	} catch (error) {
		win.localStorage.removeItem(STORAGE_KEY);
		return null;
	}
}

function postResult(win, endpoint, payload) {
	if (!endpoint || typeof win.fetch !== 'function') return Promise.resolve();
	const request = win.fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	}).catch(() => undefined);
	return Promise.race([
		request,
		new Promise(resolve => win.setTimeout(resolve, 800))
	]);
}

function routeFromHash(win) {
	return win.location.hash.replace(/^#\/?/, '').split('?')[0];
}

function goToRoute(win, route) {
	const targetHash = '#/' + String(route).replace(/^\//, '');
	const targetUrl = win.location.origin + win.location.pathname +
		'?i18n-layout-audit=' + Date.now() + targetHash;
	win.location.replace(targetUrl);
}

async function runCurrentPage(win) {
	const config = readConfig(win);
	if (!config) return;
	const index = Math.max(0, Number(config.index) || 0);
	const requestedRoute = config.routes[index];
	if (!requestedRoute) {
		win.localStorage.removeItem(STORAGE_KEY);
		await postResult(win, config.endpoint, { type: 'complete', total: config.routes.length });
		return;
	}

	const root = win.document.querySelector('uni-page.h5-show, uni-page.hpa-show, uni-page[style*="display: block"]') || win.document.body;
	const payload = {
		type: 'page',
		requestedRoute,
		actualRoute: routeFromHash(win),
		title: win.document.title,
		viewport: { width: win.innerWidth, height: win.innerHeight },
		documentWidth: win.document.documentElement.scrollWidth,
		issues: collectI18nLayoutIssues(root, win)
	};
	await postResult(win, config.endpoint, payload);

	const nextIndex = index + 1;
	if (nextIndex >= config.routes.length) {
		win.localStorage.removeItem(STORAGE_KEY);
		await postResult(win, config.endpoint, { type: 'complete', total: config.routes.length });
		return;
	}
	config.index = nextIndex;
	win.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	goToRoute(win, config.routes[nextIndex]);
}

export function installI18nLayoutAudit(win = window) {
	if (!win || !win.document || !win.localStorage) return;

	win.__startLogHomeI18nLayoutAudit = function startLogHomeI18nLayoutAudit(routes, endpoint, waitMs) {
		if (!Array.isArray(routes) || !routes.length) throw new Error('routes must be a non-empty array');
		const config = {
			routes: routes.map(route => String(route).replace(/^\/?#?\/?/, '')),
			index: 0,
			endpoint: endpoint || '',
			waitMs: Math.max(500, Number(waitMs) || DEFAULT_WAIT_MS)
		};
		win.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
		goToRoute(win, config.routes[0]);
	};
	win.__stopLogHomeI18nLayoutAudit = function stopLogHomeI18nLayoutAudit() {
		win.localStorage.removeItem(STORAGE_KEY);
	};

	const config = readConfig(win);
	if (!config) return;
	const schedule = () => win.setTimeout(() => runCurrentPage(win), Math.max(500, Number(config.waitMs) || DEFAULT_WAIT_MS));
	if (win.document.readyState === 'complete') schedule();
	else win.addEventListener('load', schedule, { once: true });
}
