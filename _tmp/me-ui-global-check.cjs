const { chromium } = require('/Users/ricepastem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
 const b=await chromium.launch({headless:true});
 const page=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{ localStorage.setItem('token', JSON.stringify({tk:'ui-preview',id:1}));localStorage.setItem('messages','[]');localStorage.setItem('unreadPrivateMessages','1');localStorage.setItem('themeMode','light');localStorage.setItem('loghome_language','zh-CN'); });
 await page.route('**/*',async route=>{
 const u=new URL(route.request().url()); if(u.origin==='http://127.0.0.1:8080') return route.continue();
 let data=[];
 if(u.pathname.includes('userprofile')) data={name:'米糊',user_id:1,email:'preview@example.com',avatar_url:'http://127.0.0.1:8080/static/user/default_avatar.png',top_pic_url:'http://127.0.0.1:8080/static/about_bg.jpg',display_title:'最初的开拓者',motto:'愿生有丢处，苍有归途，但保持飞扬。',membership:{type:'super',expire_at:'2026-10-15T00:00:00+08:00'}};
 if(u.pathname.includes('get_treePlant_of')) data=[{tree_status:'成长',growth_val:84,max_growth:100,tasks:[]}];
 if(u.pathname.includes('get_resources')) data=[{cropped_log:41,log:100}];
 if(u.pathname.includes('redstone')) data={code:200,data:{redstone_balance:222}};
 await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data),headers:{'access-control-allow-origin':'*'}});
 });
 await page.goto('http://127.0.0.1:8080/#/pages/me');await page.locator('.membership-card').waitFor();await page.waitForTimeout(1800);
 
 const info=()=>page.evaluate(()=>({url:location.hash,bodyClass:document.body.className,overflow:document.documentElement.scrollWidth>innerWidth,background:getComputedStyle(document.querySelector('.me-page')).backgroundColor,member:getComputedStyle(document.querySelector('.membership-card__main')).backgroundImage,nav:getComputedStyle(document.querySelectorAll('.uni-tabbar__label')[3]).color,rows:document.querySelectorAll('.list:first-child .li').length,title:document.querySelector('.membership-card__title').textContent.trim()}));
 console.log('light',await info());await page.screenshot({path:'/Users/ricepastem/Projects/LogHome/_tmp/me-ui-light.png',fullPage:true});
 await page.setViewportSize({width:320,height:740});console.log('narrow',await info());await page.screenshot({path:'/Users/ricepastem/Projects/LogHome/_tmp/me-ui-narrow.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.locator('.theme-switch').click();await page.waitForTimeout(300);console.log('dark',await info());await page.screenshot({path:'/Users/ricepastem/Projects/LogHome/_tmp/me-ui-dark.png',fullPage:true});
 await page.locator('.box-bd .item').nth(3).click();await page.waitForTimeout(300);console.log('settings',await page.evaluate(()=>({url:location.hash,skinRemoved:!document.body.classList.contains('loghome-me-page')})));

 await page.goto('http://127.0.0.1:8080/#/pages/me');await page.locator('.membership-card').waitFor();
 await page.waitForTimeout(400);
 console.log('shortcut alignment',await page.locator('.box-bd .item').evaluateAll(items=>items.map(item=>{const title=item.querySelector('.shortcut-title').getBoundingClientRect();const arrow=item.querySelector('.shortcut-arrow').getBoundingClientRect();return {title:item.querySelector('.shortcut-title').textContent,arrowGap:Math.round(arrow.left-title.right),centerDelta:Math.round((arrow.top+arrow.height/2)-(title.top+title.height/2))}})));
 for(const index of [0,1,2,3]) {
  await page.locator('.uni-tabbar__item').nth(index).click();await page.waitForTimeout(700);
  console.log('tab',index,await page.evaluate(()=>({url:location.hash,bodyClass:document.body.className,radius:getComputedStyle(document.querySelector('.uni-tabbar')).borderTopLeftRadius,labels:Array.from(document.querySelectorAll('.uni-tabbar__label')).map(e=>({text:e.textContent.trim(),color:getComputedStyle(e).color,underline:getComputedStyle(e,'::after').content}))})));
 }
 console.log('page errors',errors);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
