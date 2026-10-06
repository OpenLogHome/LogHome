const { chromium } = require('/Users/ricepastem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const worlds = Array.from({ length: 8 }, (_, i) => ({
  world_id: 100 + i,
  novel_id: 200 + i,
  name: `世界档案 ${i + 1}`,
  content: '二段以上的世界简介，用来把页面撑高，方便复现下滑后遮罩错位的问题。'.repeat(2),
  is_personal: i % 2,
  allow_fork: 1,
  access_role: 'owner',
}));

const mangas = Array.from({ length: 5 }, (_, i) => ({
  novel_id: 300 + i,
  name: `条漫作品 ${i + 1}`,
  content: '一句话简介，占两三行高度，让这一栏也需要下滑才能看全。'.repeat(2),
  picUrl: '',
  novel_type: 'manga',
  is_personal: 0,
  is_complete: i % 2,
  update_time: '2026-10-06 10:00:00',
  current_access: { access_role: 'owner' },
}));

const DARK = process.argv[2] === 'dark';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(theme => {
    localStorage.setItem('token', JSON.stringify({ tk: 'ui-preview', id: 1 }));
    localStorage.setItem('themeMode', theme);
    localStorage.setItem('loghome_language', 'zh-CN');
  }, DARK ? 'dark' : 'light');
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://127.0.0.1:8080') return route.continue();
    let data = [];
    if (url.pathname.includes('get_my_worlds')) data = worlds;
    if (url.pathname.includes('get_novels_of')) data = mangas;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(data), headers: { 'access-control-allow-origin': '*' },
    });
  });

  const probe = () => page.evaluate(() => {
    const mask = document.querySelector('.create-mask');
    if (!mask) return null;
    const r = mask.getBoundingClientRect();
    const panel = mask.querySelector('.create-panel').getBoundingClientRect();
    const tabbar = document.querySelector('.uni-tabbar');
    const style = getComputedStyle(mask);
    return {
      parentIsBody: mask.parentNode === document.body,
      scrollY: Math.round(window.scrollY || document.documentElement.scrollTop || 0),
      maskTop: Math.round(r.top), maskLeft: Math.round(r.left),
      maskWidth: Math.round(r.width), maskHeight: Math.round(r.height),
      panelTop: Math.round(panel.top), panelBottom: Math.round(panel.bottom),
      zIndex: style.zIndex, background: style.backgroundColor,
      darkVars: getComputedStyle(mask).getPropertyValue('--manga-card').trim(),
      tabbarTop: tabbar ? Math.round(tabbar.getBoundingClientRect().top) : null,
      viewportHeight: window.innerHeight, viewportWidth: window.innerWidth,
    };
  });

  // whichever container actually scrolls on this page
  const scrollDown = () => page.evaluate(() => {
    const target = document.querySelector('.jiemian2') || document.querySelector('.mangaWrapper');
    let node = target;
    while (node && node !== document.documentElement) {
      if (node.scrollHeight > node.clientHeight + 10 && /(auto|scroll)/.test(getComputedStyle(node).overflowY)) break;
      node = node.parentNode;
    }
    if (node && node !== document.documentElement) {
      node.scrollTop = 200;
      return { container: node.tagName + '.' + node.className, offset: Math.round(node.scrollTop) };
    }
    window.scrollTo(0, 200);
    return { container: 'window', offset: Math.round(window.scrollY) };
  });

  const check = async (label, tabIndex, openSelector) => {
    await page.locator(`[data-index="${tabIndex}"]`).click();
    await page.waitForTimeout(400);
    await page.locator(openSelector).click();
    await page.waitForTimeout(350);
    const before = await probe();
    const scrollInfo = await scrollDown();
    await page.waitForTimeout(250);
    const after = await probe();
    console.log(`\n[${label}] scroll container: ${scrollInfo.container} -> ${scrollInfo.offset}px`);
    console.log('  open  ', before);
    console.log('  after ', after);
    const coversViewport = after && after.maskTop === 0 && after.maskLeft === 0
      && after.maskHeight >= after.viewportHeight && after.maskWidth === after.viewportWidth;
    const staysPut = before && after && before.maskTop === after.maskTop && before.maskLeft === after.maskLeft;
    const overTabbar = after && after.tabbarTop !== null && after.maskTop + after.maskHeight >= after.tabbarTop;
    const scrolled = scrollInfo.offset > 0;
    console.log(`  covers viewport: ${coversViewport} | stays put after scroll: ${staysPut} | dims tabbar: ${overTabbar}`
      + ` | panel inside viewport: ${after && after.panelTop >= 0 && after.panelBottom <= after.viewportHeight}`
      + ` | page really scrolled: ${scrolled}`);
    const cdp = await page.context().newCDPSession(page);
    const offset = () => page.evaluate(() => Math.round(document.querySelector('uni-app').scrollTop));
    const dragFrom = await offset();
    await cdp.send('Input.synthesizeScrollGesture', {
      x: 20, y: 700, yDistance: -400, gestureSourceType: 'touch', speed: 1200, preventFling: true,
    });
    await page.waitForTimeout(500);
    const dragTo = await offset();
    console.log(`  touch drag on dim area: ${dragFrom}px -> ${dragTo}px (${dragFrom === dragTo ? 'scroll blocked' : 'SCROLL-THROUGH'})`);
    await page.screenshot({ path: `/Users/ricepastem/Projects/LogHome/_tmp/${label}-dialog${DARK ? '-dark' : ''}.png` });
    await page.locator('.create-close').click();
    await page.waitForTimeout(250);
    const closed = await page.evaluate(() => !document.querySelector('.create-mask'));
    // 同一个手势在弹窗关闭后必须能滚动页面，否则上面的“已拦截”结论不成立
    const beforeControl = await offset();
    await cdp.send('Input.synthesizeScrollGesture', {
      x: 20, y: 700, yDistance: -400, gestureSourceType: 'touch', speed: 1200, preventFling: true,
    });
    await page.waitForTimeout(500);
    const afterControl = await offset();
    await cdp.detach();
    const gestureWorks = afterControl > beforeControl;
    console.log(`  closed: ${closed} | same drag with dialog closed: ${beforeControl}px -> ${afterControl}px (gesture works: ${gestureWorks})`);
    return {
      before, after, coversViewport, staysPut, overTabbar, scrolled,
      blocked: dragFrom === dragTo, gestureWorks, parentIsBody: after && after.parentIsBody,
    };
  };

  await page.goto('http://127.0.0.1:8080/#/pages/essays');
  await page.locator('[data-index="2"]').waitFor();
  await page.waitForTimeout(1200);

  const world = await check('world', 2, '.worldWrapper .portal');
  const manga = await check('manga', 1, '.mangaWrapper .portal');

  if (!DARK) {
    // 对照组：把同一个遮罩放回滑动轨道并使用修复前的定位，复现用户截图里的错位
    await page.locator('[data-index="2"]').click();
    await page.waitForTimeout(300);
    await page.locator('.worldWrapper .portal').click();
    await page.waitForTimeout(300);
    const legacy = await page.evaluate(() => {
      const mask = document.querySelector('.create-mask');
      mask.style.left = '200vw'; mask.style.right = 'auto'; mask.style.width = '100vw'; mask.style.height = '100vh';
      mask.style.bottom = 'auto'; mask.style.zIndex = '300';
      document.querySelector('.tabs-track').appendChild(mask);
      document.querySelector('uni-app').scrollTop = 600;
      const r = mask.getBoundingClientRect();
      const tabbar = document.querySelector('.uni-tabbar').getBoundingClientRect();
      return { maskTop: Math.round(r.top), maskBottom: Math.round(r.bottom), tabbarTop: Math.round(tabbar.top) };
    });
    await page.waitForTimeout(250);
    await page.screenshot({ path: '/Users/ricepastem/Projects/LogHome/_tmp/world-dialog-legacy.png' });
    console.log('\n[legacy control]', legacy,
      `-> undimmed strip of ${legacy.tabbarTop - legacy.maskBottom}px below the mask`);
  }

  const failed = [world, manga].filter(r => !(r.coversViewport && r.staysPut && r.overTabbar && r.scrolled && r.blocked && r.gestureWorks && r.parentIsBody));
  console.log('\npage errors:', errors);
  console.log('result:', failed.length === 0 ? 'PASS' : 'FAIL');
  await browser.close();
  if (failed.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
