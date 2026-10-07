const { chromium } = require('/Users/ricepastem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.addInitScript(() => {
    localStorage.setItem('token', JSON.stringify({ tk: 'ui-preview', id: 1 }));
    localStorage.setItem('loghome_language', 'zh-CN');
  });

  const rankCalls = [];
  page.on('request', r => {
    if (r.url().includes('get_rank_board')) rankCalls.push(r.url());
  });

  await page.goto('http://127.0.0.1:8080/#/pages/library');
  await page.waitForSelector('.home-rank-board', { timeout: 15000 });
  await page.waitForSelector('.home-rank-board .dense-card-item', { timeout: 15000 });

  const boardLabels = await page.$$eval('.home-rank-board .board-tab', els => els.map(e => e.textContent.trim()));
  const zoneLabels = await page.$$eval('.home-rank-board .zone-chip', els => els.map(e => e.textContent.trim()));
  const firstItems = await page.$$eval('.home-rank-board .dense-card-item', els => els.length);
  const topRanks = await page.$$eval('.home-rank-board .dense-card-rank', els => els.slice(0, 3).map(e => e.textContent.trim()));
  console.log('tabs:', boardLabels.join('|'));
  console.log('zones:', zoneLabels.join('|'));
  console.log('home items rendered:', firstItems, 'top3 ranks:', topRanks.join(','));

  // 四榜 × 三专区 全组合切换，等每轮加载完成
  const combos = [];
  for (const board of boardLabels) {
    await page.click(`.home-rank-board .board-tab:text-is("${board}")`);
    for (const zone of zoneLabels) {
      await page.click(`.home-rank-board .zone-chip:text-is("${zone}")`);
      await page.waitForFunction(() => {
        const el = document.querySelector('.home-rank-board');
        return el && !el.querySelector('.dense-card-skeleton');
      }, { timeout: 15000 });
      await page.waitForTimeout(200);
      const count = await page.$$eval('.home-rank-board .dense-card-item', els => els.length);
      combos.push(`${board}/${zone}=${count}`);
    }
  }
  console.log('combo items:');
  combos.forEach(c => console.log('  ' + c));

  await page.screenshot({ path: '/Users/ricepastem/Projects/LogHome/_tmp/rank-home-board.png' });

  // 回到有数据的组合再进完整榜单页
  await page.click(`.home-rank-board .board-tab:text-is("更新榜")`);
  await page.click(`.home-rank-board .zone-chip:text-is("小说")`);
  await page.waitForTimeout(500);
  await page.click('.home-rank-board .head');
  await page.waitForSelector('.rank-board-page', { timeout: 15000 });
  await page.waitForSelector('.rank-board-page .rank-item', { timeout: 15000 });
  const metaText = await page.$eval('.rank-board-page .meta-line', e => e.textContent.trim()).catch(() => '(no meta)');
  let listCount = await page.$$eval('.rank-board-page .rank-item', els => els.length);
  console.log('rank page meta:', metaText, 'first page items:', listCount);

  // 分页：连点加载更多直到到底
  for (let i = 0; i < 5; i++) {
    const more = await page.$('.rank-board-page .more-button');
    if (!more) break;
    await more.click();
    await page.waitForTimeout(600);
  }
  listCount = await page.$$eval('.rank-board-page .rank-item', els => els.length);
  const hasEnd = await page.$('.rank-board-page .list-end');
  console.log('after load-more items:', listCount, 'list-end:', !!hasEnd);
  await page.screenshot({ path: '/Users/ricepastem/Projects/LogHome/_tmp/rank-full-page.png' });

  // 完整榜单页切到原木力榜应显示原木力分值
  await page.click('.rank-board-page .board-tab:text-is("原木力榜")');
  await page.waitForTimeout(800);
  const scorePills = await page.$$eval('.rank-board-page .score-pill', els => els.length);
  const firstScore = scorePills ? await page.$eval('.rank-board-page .score-pill-value', e => e.textContent.trim()) : '';
  console.log('logpower page score pills:', scorePills, 'first score:', firstScore);

  const uniqueCalls = rankCalls.length;
  console.log('total get_rank_board calls:', uniqueCalls);
  console.log('JS errors:', errors.length ? errors.slice(0, 5) : 'none');
  await browser.close();
})();
