const {chromium}=require('/Users/ricepastem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{localStorage.setItem('themeMode','dark');localStorage.setItem('loghome_language','zh-CN');});
await page.route('**/*',route=>new URL(route.request().url()).origin==='http://127.0.0.1:8080'?route.continue():route.fulfill({status:200,contentType:'application/json',body:'[]',headers:{'access-control-allow-origin':'*'}}));
await page.goto('http://127.0.0.1:8080/#/pages/apps/about');await page.locator('.back img').waitFor();await page.waitForTimeout(600);
const info=()=>page.evaluate(()=>({image:document.querySelector('.back img').getAttribute('src'),loaded:document.querySelector('.back img').naturalWidth,background:getComputedStyle(document.querySelector('.outer')).backgroundColor,header:getComputedStyle(document.querySelector('.uni-page-head')).backgroundColor,title:getComputedStyle(document.querySelector('.title')).color,link:getComputedStyle(document.querySelector('.button')).color,overflow:document.documentElement.scrollWidth>innerWidth}));
console.log('dark',await info());await page.screenshot({path:'/Users/ricepastem/Projects/LogHome/_tmp/about-night-preview.png',fullPage:true});
await page.setViewportSize({width:320,height:640});console.log('narrow',await info());
await page.evaluate(()=>getApp().toggleTheme());await page.waitForTimeout(500);console.log('light',await info());await page.screenshot({path:'/Users/ricepastem/Projects/LogHome/_tmp/about-day-preview.png',fullPage:true});
await page.evaluate(()=>getApp().toggleTheme());await page.waitForTimeout(400);console.log('dark again',await info());
console.log('errors',errors);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
