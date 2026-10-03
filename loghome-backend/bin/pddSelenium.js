const setting = require('./pddConfig');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { Builder, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
const extractPage = require('./pddBrowserExtract');
const skuDialog = require('./pddSkuDialog');
const { fail, validateUrl, normalizeProduct, needsSkuPrices } = require('./pddProduct');

const ORIGIN = 'https://mobile.yangkeduo.com';
const sessions = new Map();
const TTL = 20 * 60 * 1000;

function encryptionKey() {
	const key = setting('PDD_SESSION_KEY') || '';
	if (!/^[a-fA-F0-9]{64}$/.test(key)) throw fail('NOT_CONFIGURED', '请先配置采集服务 PDD_SESSION_KEY（32字节十六进制密钥）');
	return Buffer.from(key, 'hex');
}

function sessionPath(owner) {
	if (!/^\d+$/.test(String(owner))) throw fail('INVALID_OWNER', '管理员身份无效');
	const dir = setting('PDD_SESSION_DIR') || path.join(os.homedir(), '.loghome', 'pdd-sessions');
	fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
	return path.join(dir, `${owner}.enc`);
}

function saveState(owner, state) {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
	cipher.setAAD(Buffer.from(String(owner)));
	const data = Buffer.concat([cipher.update(JSON.stringify(state), 'utf8'), cipher.final()]);
	const dest = sessionPath(owner);
	const temp = `${dest}.${crypto.randomBytes(6).toString('hex')}.tmp`;
	fs.writeFileSync(temp, JSON.stringify({ iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') }), { mode: 0o600 });
	fs.renameSync(temp, dest);
}

function readState(owner) {
	const dest = sessionPath(owner);
	if (!fs.existsSync(dest)) return null;
	try {
		const saved = JSON.parse(fs.readFileSync(dest, 'utf8'));
		const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(saved.iv, 'base64'));
		decipher.setAAD(Buffer.from(String(owner)));
		decipher.setAuthTag(Buffer.from(saved.tag, 'base64'));
		return JSON.parse(Buffer.concat([decipher.update(Buffer.from(saved.data, 'base64')), decipher.final()]).toString('utf8'));
	} catch (_) { throw fail('SESSION_INVALID', '保存的会话无法解密，请重新登录（请保持会话密钥不变）'); }
}

function ensureDestination(driver) {
	return driver.getCurrentUrl().then(value => {
		const url = new URL(value);
		if (url.protocol !== 'https:' || !['mobile.yangkeduo.com', 'passport.pinduoduo.com'].includes(url.hostname)) {
			throw fail('UNEXPECTED_REDIRECT', '页面跳转到非预期站点，已停止采集');
		}
	});
}

async function buildDriver(owner) {
	encryptionKey();
	const isEdge = setting('PDD_BROWSER') === 'edge';
	const options = isEdge ? new edge.Options() : new chrome.Options();
	options.addArguments('--window-size=480,900', '--force-device-scale-factor=1', '--disable-dev-shm-usage');
	if (setting('PDD_HEADLESS') !== 'false') options.addArguments('--headless=new');
	if (setting('PDD_BROWSER_BINARY')) {
		if (isEdge) options.setEdgeChromiumBinaryPath(setting('PDD_BROWSER_BINARY'));
		else options.setChromeBinaryPath(setting('PDD_BROWSER_BINARY'));
	}
	let builder = new Builder().forBrowser(isEdge ? 'MicrosoftEdge' : 'chrome');
	if (isEdge) builder = builder.setEdgeOptions(options);
	else builder = builder.setChromeOptions(options);
	if (setting('PDD_DRIVER_PATH') && !setting('PDD_SELENIUM_URL')) {
		if (isEdge) builder = builder.setEdgeService(new edge.ServiceBuilder(setting('PDD_DRIVER_PATH')));
		else builder = builder.setChromeService(new chrome.ServiceBuilder(setting('PDD_DRIVER_PATH')));
	}
	if (setting('PDD_SELENIUM_URL')) builder = builder.usingServer(setting('PDD_SELENIUM_URL'));
	let driver;
	try {
		driver = await builder.build();
		await driver.manage().setTimeouts({ pageLoad: 30000, script: 10000, implicit: 0 });
		await driver.get(ORIGIN);
		await ensureDestination(driver);
		let state;
		try { state = readState(owner); } catch (error) {
			if (error.code !== 'SESSION_INVALID') throw error;
			// A damaged/rotated session must not prevent logging in again.
			state = null;
		}
		if (state) {
			for (const cookie of state.cookies || []) {
				if (!/(^|\.)(yangkeduo\.com|pinduoduo\.com)$/.test(cookie.domain || '')) continue;
				if (cookie.expiry && cookie.expiry < Date.now() / 1000) continue;
				try { await driver.manage().addCookie(cookie); } catch (_) { /* Expired or incompatible cookie. */ }
			}
			await driver.executeScript(function (storage) {
				Object.entries(storage || {}).forEach(([key, value]) => localStorage.setItem(key, value));
			}, state.storage);
		}
		return driver;
	} catch (error) {
		if (driver) await driver.quit().catch(() => {});
		if (error.code) throw error;
		throw fail('BROWSER_UNAVAILABLE', 'Selenium 浏览器启动失败，请检查浏览器、驱动或 Selenium 服务配置');
	}
}

async function exclusive(owner, action) {
	owner = String(owner);
	let session = sessions.get(owner);
	if (!session) {
		if (sessions.size >= 4) throw fail('CAPACITY', '采集浏览器已满，请稍后重试');
		session = { driver: null, busy: false, touched: Date.now(), login: false };
		sessions.set(owner, session);
	}
	if (session.busy) throw fail('BUSY', '当前管理员的浏览器正在处理请求，请稍后重试');
	session.busy = true;
	session.touched = Date.now();
	try {
		if (!session.driver) session.driver = await buildDriver(owner);
		return await action(session);
	} catch (error) {
		if (!session.driver) sessions.delete(owner);
		if (!error.code) {
			if (session.driver) await session.driver.quit().catch(() => {});
			session.driver = null;
			session.login = false;
			throw fail('BROWSER_ERROR', '浏览器操作失败或页面超时，请重新打开登录窗口或重试采集');
		}
		throw error;
	} finally { session.busy = false; session.touched = Date.now(); }
}

async function screenshot(session) {
	await ensureDestination(session.driver);
	const viewport = await session.driver.executeScript('return {width:innerWidth,height:innerHeight}');
	session.frame = crypto.randomBytes(12).toString('hex');
	return { screenshot: await session.driver.takeScreenshot(), viewport, frame: session.frame };
}

async function startLogin(owner) {
	return exclusive(owner, async session => {
		session.login = true;
		await session.driver.get(session.challengeUrl || `${ORIGIN}/personal.html`);
		return await screenshot(session);
	});
}

async function loginAction(owner, input) {
	return exclusive(owner, async session => {
		if (!session.login) throw fail('LOGIN_NOT_STARTED', '请先打开登录窗口');
		await ensureDestination(session.driver);
		const driver = session.driver;
		const current = new URL(await driver.getCurrentUrl());
		const challengePage = session.challengeUrl && /^\/goods[12]?\.html$/.test(current.pathname);
		if (current.hostname === 'mobile.yangkeduo.com' && !/^\/(personal|login[^/]*|index)\.html$|^\/$/.test(current.pathname) && !challengePage) {
			throw fail('LOGIN_PAGE_ONLY', '登录窗口仅允许账号登录操作，请重新打开登录窗口');
		}
		if (challengePage && input.action !== 'refresh' && !(await driver.executeScript(extractPage)).blocked) {
			throw fail('VERIFICATION_DONE', '商品页面验证已完成，请确认登录并保存会话');
		}
		if (input.action !== 'refresh' && input.frame !== session.frame) throw fail('STALE_FRAME', '画面已更新，请刷新画面后再操作');
		const viewport = await driver.executeScript('return {width:innerWidth,height:innerHeight}');
		function point(x, y) {
			if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0 || x >= viewport.width || y >= viewport.height) throw fail('INVALID_ACTION', '点击坐标无效');
			return { x: Math.round(x), y: Math.round(y), origin: 'viewport' };
		}
		if (input.action === 'click') await driver.actions({ async: true }).move(point(input.x, input.y)).click().perform();
		else if (input.action === 'drag') await driver.actions({ async: true }).move(point(input.x, input.y)).press().move({ ...point(input.end_x, input.end_y), duration: 800 }).release().perform();
		else if (input.action === 'type') {
			if (typeof input.text !== 'string' || !input.text || input.text.length > 200) throw fail('INVALID_ACTION', '输入内容无效');
			const element = await driver.switchTo().activeElement();
			if (!['input', 'textarea'].includes(await element.getTagName())) throw fail('INVALID_ACTION', '请先点击手机号或验证码输入框');
			await element.clear();
			await element.sendKeys(input.text);
		} else if (input.action === 'key') {
			const keys = { Tab: Key.TAB, Enter: Key.ENTER, Backspace: Key.BACK_SPACE };
			if (!keys[input.key]) throw fail('INVALID_ACTION', '不支持该按键');
			await driver.actions().sendKeys(keys[input.key]).perform();
		} else if (input.action === 'scroll') {
			if (![500, -500].includes(input.delta)) throw fail('INVALID_ACTION', '滚动距离无效');
			await driver.executeScript('window.scrollBy(0, arguments[0])', input.delta);
		} else if (input.action !== 'refresh') throw fail('INVALID_ACTION', '不支持该操作');
		return await screenshot(session);
	});
}

async function saveLogin(owner) {
	return exclusive(owner, async session => {
		if (!session.login) throw fail('LOGIN_NOT_STARTED', '请先打开登录窗口');
		await session.driver.get(`${ORIGIN}/personal.html`);
		await ensureDestination(session.driver);
		const loggedIn = await session.driver.wait(async () => session.driver.executeScript(function () {
			const text = document.body.innerText;
			return !/请输入手机号|短信验证码登录|微信登录/.test(text) && /我的订单/.test(text) && /收货地址/.test(text);
		}), 8000).catch(() => false);
		if (!loggedIn) throw fail('LOGIN_REQUIRED', '尚未确认登录成功，请完成登录后再保存');
		saveState(owner, {
			cookies: await session.driver.manage().getCookies(),
			storage: await session.driver.executeScript('return Object.assign({}, localStorage)'),
			saved_at: new Date().toISOString(),
		});
		session.login = false;
		session.challengeUrl = null;
		return { saved: true };
	});
}

async function collect(owner, url) {
	url = validateUrl(url);
	return exclusive(owner, async session => {
		if (session.login) throw fail('LOGIN_IN_PROGRESS', '请先完成登录并保存会话，或关闭登录窗口');
		await session.driver.get(url);
		await ensureDestination(session.driver);
		let raw;
		await session.driver.wait(async () => {
			raw = await session.driver.executeScript(extractPage);
			return raw.goods || raw.title || raw.blocked;
		}, 12000).catch(() => {});
		await ensureDestination(session.driver);
		if (raw && raw.blocked) {
			session.challengeUrl = url;
			throw fail('VERIFICATION_REQUIRED', '拼多多要求人工验证，请在登录窗口完成验证后重试');
		}
		if (raw && raw.need_login) throw fail('LOGIN_REQUIRED', '拼多多会话已过期或尚未登录，请登录并保存会话');
		const structuredSkus = raw && raw.goods && (raw.goods.skus || raw.goods.sku || raw.goods.sku_list);
		if (raw && needsSkuPrices(raw)) {
			const opened = await session.driver.executeScript(skuDialog, 'open', null);
			if (opened) {
				try {
					const probe = await session.driver.wait(async () => session.driver.executeScript(skuDialog, 'read', null), 5000).catch(() => null);
					if (probe && probe.groups.length) {
						let combinations = [[]];
						for (const group of probe.groups) combinations = combinations.flatMap(combo => group.options.map(option => [...combo, option])).slice(0, 41);
						if (combinations.length > 40) throw fail('TOO_MANY_SKUS', '商品规格组合超过40种，请手动录入或选择规格较少的商品');
						const skus = [];
						const original = normalizeProduct(raw).skus;
						const deadline = Date.now() + 45000;
						for (const combination of combinations) {
							if (Date.now() > deadline) break;
							if (!await session.driver.executeScript(skuDialog, 'select', combination)) continue;
							const expected = combination.join(' ');
							let lastPrice = null;
							let stableSince = Date.now();
							const result = await session.driver.wait(async () => {
								const current = await session.driver.executeScript(skuDialog, 'read', null);
								if (!current || !current.label || !combination.every(value => current.label.includes(value)) || !current.price) return false;
								if (current.price !== lastPrice) { lastPrice = current.price; stableSince = Date.now(); }
								return Date.now() - stableSince >= 400 ? current : false;
							}, 2500).catch(() => null);
							if (result) {
								const index = original.findIndex(sku => sku.label.replace(/\s*\/\s*/g, ' ').trim() === expected);
								skus.push({ ...(index >= 0 ? structuredSkus[index] : {}), sku_name: expected, group_price: Math.round(result.price * 100) });
							}
						}
						if (skus.length < combinations.length) raw.warnings = ['部分规格不可选或未能读取价格，本次仅展示已成功读取的规格。'];
						if (Array.isArray(structuredSkus) && structuredSkus.length) {
							for (let index = 0; index < structuredSkus.length; index++) {
								const match = skus.find(sku => sku.sku_name === original[index].label.replace(/\s*\/\s*/g, ' ').trim());
								if (match) structuredSkus[index].group_price = match.group_price;
							}
						} else if (skus.length) raw.goods = { ...(raw.goods || {}), goods_name: raw.goods && (raw.goods.goods_name || raw.goods.goodsName) || raw.title, goods_id: raw.goods_id, gallery: raw.goods && (raw.goods.gallery || raw.goods.goods_gallery_urls) || raw.images, skus };
					}
				} finally { await session.driver.executeScript(skuDialog, 'close', null); }
			}
		}
		return normalizeProduct(raw || {});
	});
}

async function closeLogin(owner) {
	const session = sessions.get(String(owner));
	if (session && session.busy) throw fail('BUSY', '浏览器正在处理请求，请稍后关闭');
	if (session) {
		sessions.delete(String(owner));
		if (session.driver) await session.driver.quit().catch(() => {});
	}
	return { closed: true };
}

function status(owner) {
	encryptionKey();
	return { configured: true, saved: fs.existsSync(sessionPath(owner)), login_open: Boolean(sessions.get(String(owner)) && sessions.get(String(owner)).login) };
}

const cleanup = setInterval(() => {
	for (const [owner, session] of sessions) if (!session.busy && Date.now() - session.touched > TTL) closeLogin(owner).catch(() => {});
}, 60000);
cleanup.unref();

module.exports = { startLogin, loginAction, saveLogin, closeLogin, collect, status, saveState, readState };
