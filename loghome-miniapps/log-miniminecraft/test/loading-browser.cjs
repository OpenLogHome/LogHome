// Run with Playwright supplied through NODE_PATH; no production auth bypass.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{createServer}=require('../server/index.cjs');
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'miniminecraft-loading-browser-'));
 const server=createServer({dataDir:dir,authorize:async()=>({id:1,name:'Loading test'})});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}/log-miniminecraft/`;
 const browser=await chromium.launch({executablePath:process.env.QUALITY_BROWSER||'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  let release;const delayed=new Promise(resolve=>release=resolve);
  await page.route('**/assets/index-B8uuzVI-.js',async route=>{await delayed;await route.continue()});
  await page.goto(base+'#ticket=load0001');await page.waitForFunction(()=>document.querySelector('#loading-progress').value===3);
  assert.equal(await page.locator('#game-loading').isVisible(),true);
  if(process.env.LOADING_SCREENSHOT)await page.screenshot({path:process.env.LOADING_SCREENSHOT});
  release();await page.waitForFunction(()=>document.querySelector('#game-loading').hidden,{timeout:60000});
  assert.ok(await page.locator('#root').innerText());assert.deepEqual(errors,[]);
  await page.setViewportSize({width:844,height:390});await page.reload();
  await page.waitForFunction(()=>document.querySelector('#loading-stage').textContent.includes('入口'));
  assert.equal(await page.locator('#game-loading').isVisible(),true);
  await page.route('**/assets/index-B8uuzVI-.js',route=>route.fulfill({status:404,contentType:'application/json',body:'{"error":"Not found"}'}));
  await page.goto(base+'?failure-test=1#ticket=load0002');await page.waitForFunction(()=>document.querySelector('#game-loading').dataset.error==='true');
  assert.match(await page.locator('#loading-hint').innerText(),/HTTP 404/);assert.equal(await page.locator('#game-loading').isVisible(),true);
  console.log('Loading browser checks passed: delayed download, real menu readiness, landscape, missing module.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true})}
})().catch(error=>{console.error(error);process.exitCode=1});
