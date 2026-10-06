const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const Vue = require('vue'), compiler = require('vue/compiler-sfc');
const backend = path.resolve(__dirname, '../../loghome-backend');
const sharp = require(path.join(backend, 'node_modules/sharp'));
const { createMangaImageAssets } = require(path.join(backend, 'bin/mangaImageAssets'));
const clone = v => JSON.parse(JSON.stringify(v));
const pages = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, url: 'https://test.invalid/' + i, readingUrl: 'https://test.invalid/read/' + i, width: 500, height: 700 }));
function component(file, axios = {}, t) {
  const source = fs.readFileSync(path.resolve(__dirname, '../', file), 'utf8');
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*;?\s*$/gm, '').replace('export default', 'module.exports =');
  const storage = new Map(), navigation = [], messages = [];
  const window = { localStorage: { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) }, addEventListener() {}, removeEventListener() {} };
  const uni = { getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 800 }), showToast: m => messages.push(m), navigateTo: m => navigation.push(m), showModal() {}, previewImage() {} };
  const sandbox = { module: {}, axios, window, uni, Blob, MangaZoomImage: {}, MangaPageSorter: {}, MangaComicLoader: {}, MangaIcon: {}, MangaA11y: {}, MangaPortal: {}, MangaDanmuLayer: {}, TaskRewardModal: {}, TippingBar: {}, MangaCommentItem: {}, MangaCommentComposer: {}, ReportNovelPopup: {}, darkModeMixin: {}, setTimeout, clearTimeout, console: { error() {} } };
  vm.runInNewContext(script, sandbox, { filename: file });
  const options = sandbox.module.exports;
  const instance = new Vue({ ...options, beforeCreate() { this.$baseUrl = ''; this.$store = { state: { user_id: 1 } }; } });
  if (t) t.after(() => { clearTimeout(instance.draftTimer); clearTimeout(instance.progressTimer); instance.$destroy(); });
  return { instance, storage, navigation, messages, options, uni };
}
function editor(axios, t) {
  const ctx = component('pages/writers/mangaEditor.vue', axios, t);
  Object.assign(ctx.instance, { view: 'edit', editorReady: true, editorTitle: '测试', novelId: 398, pages: clone(pages.slice(0,2)), novel: { current_access: { can_publish_article: true } } });
  ctx.instance.prepareUpload = async path => ({ binary: true, blob: path }); return ctx;
}
const cancelToken = { source: () => ({ token: {}, cancel() {} }) };
test('Uni-app button keyboard bridge handles focus, activation and disabled state', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../common/manga-a11y.js'), 'utf8');
  const sandbox = { module: {} };
  vm.runInNewContext(source.replace('export default', 'module.exports ='), sandbox);
  const directive = sandbox.module.exports;
  const attrs = new Map();
  const events = new Map();
  let clicks = 0;
  const el = {
    tagName: 'UNI-BUTTON',
    hasAttribute: key => attrs.has(key), getAttribute: key => attrs.get(key) || null,
    setAttribute: (key, value) => attrs.set(key, value),
    addEventListener: (key, listener) => events.set(key, listener),
    removeEventListener: key => events.delete(key), click: () => { clicks += 1; },
  };
  directive.inserted(el);
  assert.equal(attrs.get('role'), 'button');
  assert.equal(attrs.get('tabindex'), '0');
  events.get('keydown')({ key: 'Enter', preventDefault() {} });
  events.get('keydown')({ key: ' ', preventDefault() {} });
  assert.equal(clicks, 2);
  attrs.set('disabled', 'disabled'); directive.componentUpdated(el);
  assert.equal(attrs.get('tabindex'), '-1');
  events.get('keydown')({ key: 'Enter', preventDefault() {} });
  assert.equal(clicks, 2);
  attrs.delete('disabled'); directive.componentUpdated(el);
  assert.equal(attrs.get('tabindex'), '0');
  directive.componentUpdated(el, { value: true });
  assert.equal(attrs.get('aria-disabled'), 'true');
  directive.componentUpdated(el, { value: false });
  assert.equal(attrs.get('aria-disabled'), 'false');
  directive.unbind(el);
  assert.equal(events.size, 0);
});
test('manga text and filled actions meet WCAG AA normal-text contrast', () => {
  const theme = fs.readFileSync(path.resolve(__dirname, '../common/manga-theme.scss'), 'utf8');
  const token = name => {
    const value = theme.match(new RegExp(`--manga-${name}:\\s*(#[0-9a-fA-F]{3,6})`))[1];
    return value.length === 4 ? '#' + value.slice(1).split('').map(c => c + c).join('') : value;
  };
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255);
    const linear = channels.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const contrast = (a, b) => {
    const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (bright + 0.05) / (dark + 0.05);
  };
  assert(contrast(token('muted'), token('card')) >= 4.5);
  assert(contrast(token('action'), '#ffffff') >= 4.5);
  const darkAction = theme.match(/\.dark-mode\s*\{[^}]*--manga-action:\s*(#[0-9a-fA-F]{6})/)[1];
  assert(contrast(darkAction, '#ffffff') >= 4.5);
});
test('phase 2 scripts and templates compile', () => {
  for (const file of ['pages/writers/mangaSettings.vue','pages/writers/mangaEditor.vue','pages/readers/mangaInfo.vue','pages/readers/mangaReader.vue','components/mangaPage.vue','components/manga-zoom-image.vue','components/manga-page-sorter.vue','components/manga-icon.vue']) {
    const source = fs.readFileSync(path.resolve(__dirname, '../', file), 'utf8');
    const result = compiler.parse({ source, filename: file }), desc = result.descriptor || result;
    assert.equal(compiler.compileTemplate({ source: desc.template.content, filename: file }).errors.length, 0, file);
    new vm.Script(desc.script.content.replace(/^import .*;?\s*$/gm, '').replace('export default', 'module.exports ='));
  }
});
test('pinch anchors midpoint, clamps scale and bounds pan', t => {
  const { instance: zoom } = component('components/manga-zoom-image.vue', {}, t);
  const events = []; zoom.$on('interaction', value => events.push(value));
  zoom.measure = cb => { zoom.rect = { left: 0, top: 0, width: 400, height: 600 }; cb(); };
  const touch = (x,y) => ({ clientX:x, clientY:y });
  zoom.touchStart({ touches: [touch(100,200), touch(200,200)] });
  zoom.touchMove({ touches: [touch(50,200), touch(250,200)], preventDefault() {}, stopPropagation() {} });
  assert.equal(zoom.zoom,2); assert.equal(zoom.x,-150); assert.equal(zoom.y,-200);
  zoom.touchMove({ touches: [touch(-400,200), touch(800,200)] }); assert.equal(zoom.zoom,4);
  zoom.touchEnd({ touches: [touch(100,200)] }); zoom.touchMove({ touches: [touch(5000,5000)] });
  assert.equal(zoom.x,0); assert.equal(zoom.y,0); zoom.touchEnd({ touches: [] }); assert.equal(events.at(-1),true);
  zoom.reset(); assert.equal(zoom.zoom,1); assert.equal(events.at(-1),false);
});
test('strip scroll suppresses taps and double tap toggles zoom without turning pages', t => {
  const { instance: zoom } = component('components/manga-zoom-image.vue', {}, t);
  const taps = []; zoom.$on('image-tap', e => taps.push(e));
  zoom.measure = cb => { zoom.rect = { left:0,top:0,width:400,height:600 }; cb(); };
  zoom.touchStart({ touches:[{ clientX:200,clientY:100 }] }); zoom.touchMove({ touches:[{ clientX:200,clientY:180 }] });
  zoom.touchEnd({ touches:[],changedTouches:[{ clientX:200,clientY:180 }] }); assert.equal(zoom.tapTimer,null);
  zoom.tap({ clientX:200,clientY:200 }); zoom.tap({ clientX:200,clientY:200 }); assert.equal(zoom.zoom,2); assert.equal(taps.length,0);
  zoom.lastTapAt = Date.now(); zoom.tap({ clientX:200,clientY:200 }); assert.equal(zoom.zoom,1);
});
test('RTL swipe, tap zones and slider track logical order and persist preferences', t => {
  const { instance:r,storage } = component('pages/readers/mangaReader.vue', {}, t);
  r.pages=clone(pages); r.loading=false; r.mode='paged'; r.currentPage=2; r.setReadingDirection('rtl');
  assert.equal(r.swiperPage,7); assert.equal(r.displayPages[0].index,9);
  r.onSwiperChange({ detail:{ current:6 } }); assert.equal(r.currentPage,3);
  r.onImageTap({ clientX:10 },3); assert.equal(r.currentPage,4);
  r.onPageSlider({ detail:{ value:8 } }); assert.equal(r.currentPage,7); assert.equal(r.zoomIndex,-1);
  assert.equal(JSON.parse(storage.get('MangaReaderSettings')).direction,'rtl');
});
test('bounded loading window and reading variant retain original fallback', t => {
  const { instance:r } = component('pages/readers/mangaReader.vue', {}, t);
  r.pages=clone(pages); r.mode='paged'; r.currentPage=4;
  assert.equal(r.shouldLoadPage(0),false); assert.equal(r.shouldLoadPage(3),true); assert.equal(r.shouldLoadPage(6),false);
  assert.equal(r.pageSrc(pages[0],0),pages[0].readingUrl); r.imageQuality='original'; assert.equal(r.pageSrc(pages[0],0),pages[0].url);
  r.imageQuality='standard'; assert.equal(r.pageSrc({ url:pages[0].url },0),pages[0].url);
  r.mode='strip'; r.currentPage=4; r.currentScrollTop=4*525; assert.equal(r.shouldLoadPage(0),false); assert.equal(r.shouldLoadPage(4),true);
});
test('local episode preview consumes handoff and never requests or records history', async t => {
  let requests=0; const ctx=component('pages/readers/mangaReader.vue',{ get(){requests++;},post(){requests++;} },t);
  ctx.storage.set('preview',JSON.stringify({ title:'未发布',type:'mangaPage',pages }));
  ctx.options.onLoad.call(ctx.instance,{ previewKey:'preview' }); await ctx.instance.syncProgress(true);
  assert.equal(ctx.instance.isPreview,true); assert.equal(ctx.instance.localPreview,true); assert.equal(ctx.instance.mode,'paged');
  assert.equal(ctx.storage.has('preview'),false); assert.equal(requests,0); assert.equal(ctx.storage.size,0);
});
test('queue sorts filenames, records progress and replaces in place with stable IDs', async t => {
  const uploaded=[]; const ctx=editor({ CancelToken:cancelToken,async post(url,body,config) { uploaded.push(body); assert.equal(config.headers['Content-Type'],'application/octet-stream'); assert.match(url,/article_type=mangaStrip/); config.onUploadProgress({loaded:50,total:100}); return {data:{pages:[{url:'https://test.invalid/new'+body,width:100,height:200,thumb:'https://test.invalid/thumb',readingUrl:'https://test.invalid/read'}]}};} },t);
  await ctx.instance.uploadFiles([{name:'10.png'},{name:'2.png'}],['10','2']);
  assert.deepEqual(uploaded,['2','10']); assert.equal(ctx.instance.pages.length,4); assert(ctx.instance.uploadQueue.every(q=>q.status==='success'&&q.progress===100));
  await ctx.instance.uploadFiles([{name:'replacement'}],['replace'],1);
  assert.equal(ctx.instance.pages.length,4); assert.equal(ctx.instance.pages[0].id,1); assert.equal(ctx.instance.pages[0].url,'https://test.invalid/newreplace');
  ctx.instance.reorderPages({from:0,to:2}); assert.equal(ctx.instance.pages[2].id,1);
  ctx.instance.removePage(0); assert.equal(ctx.instance.pages[1].id,1);
});
test('failed replacement preserves image; retry works; unfinished uploads block publishing', async t => {
  let fail=true, saves=0;
  const ctx=editor({ CancelToken:cancelToken,async post(url){if(url.includes('upload')){if(fail)throw new Error('offline');return {data:{url:'https://test.invalid/replacement'}};} saves++;} },t);
  await ctx.instance.uploadFiles([{name:'replace'}],['replace'],1);
  assert.equal(ctx.instance.pages[0].url,pages[0].url); assert.equal(ctx.instance.uploadQueue[0].status,'error');
  ctx.instance.saveEpisode(0); assert.equal(saves,0); fail=false; ctx.instance.retryUpload(ctx.instance.uploadQueue[0]);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(ctx.instance.uploadQueue[0].status,'success'); assert.equal(ctx.instance.pages[0].url,'https://test.invalid/replacement');
});
test('cancelled upload cannot mutate pages after delayed server response', async t => {
  let resolve; const pending=new Promise(r=>resolve=r);
  const ctx=editor({ CancelToken:cancelToken,post:()=>pending },t);
  const operation=ctx.instance.uploadFiles([{name:'cancel'}],['cancel']);
  await new Promise(r=>setImmediate(r)); ctx.instance.cancelUpload(ctx.instance.uploadQueue[0]);
  resolve({data:{url:'https://test.invalid/cancelled'}}); await operation;
  assert.equal(ctx.instance.pages.length,2); assert.equal(ctx.instance.uploadQueue[0].status,'cancelled'); assert.equal(ctx.instance.uploading,false);
});
test('drag sorting applies only on release; cancelling preserves order', t => {
  const { instance:sorter }=component('components/manga-page-sorter.vue',{},t); const orders=[];
  sorter.$on('reorder',e=>orders.push(e)); sorter.start(0); sorter.rects=[{top:0,bottom:90},{top:90,bottom:180}];
  sorter.touchMove({touches:[{clientY:150}]}); assert.equal(orders.length,0); sorter.finish(); assert.deepEqual(clone(orders),[{from:0,to:1}]);
  sorter.start(1); sorter.targetIndex=0; sorter.cancel(); sorter.finish(); assert.equal(orders.length,1);
});
test('long strips split without losing height; thumbnails and reading variants stay bounded', async () => {
  const input=await sharp({create:{width:200,height:12500,channels:3,background:'#fca'}}).png().toBuffer();
  const assets=[]; const result=await createMangaImageAssets(input,{strip:true,upload:async(buffer,format)=>{assets.push({buffer,format});return 'https://test.invalid/'+assets.length;}});
  assert.equal(result.length,3); assert.deepEqual(result.map(p=>p.height),[6000,6000,500]); assert.equal(result.reduce((sum,p)=>sum+p.height,0),12500);
  for(let i=0;i<assets.length;i+=3){const thumb=await sharp(assets[i+1].buffer).metadata(),reading=await sharp(assets[i+2].buffer).metadata();assert(thumb.width<=320&&thumb.height<=480);assert(reading.width<=1600);}
});
test('paged upload retains original bytes and creates WebP variants for tall pages', async () => {
  const input=await sharp({create:{width:160,height:300,channels:3,background:'#abc'}}).png().toBuffer();
  const assets=[]; const result=await createMangaImageAssets(input,{upload:async b=>{assets.push(b);return 'https://test.invalid/'+assets.length;}});
  assert.equal(result.length,1); assert.deepEqual(assets[0],input);
  const tall=await sharp({create:{width:10,height:20001,channels:3,background:'#abc'}}).png().toBuffer();
  const tallAssets=[];
  const tallPages=await createMangaImageAssets(tall,{upload:async b=>{tallAssets.push(b);return 'https://test.invalid/'+tallAssets.length;}});
  assert.equal(tallPages[0].height,20001);
  assert.deepEqual(tallAssets[0],tall);
  assert((await sharp(tallAssets[2]).metadata()).height<=16000);
  const wide=await sharp({create:{width:20001,height:10,channels:3,background:'#abc'}}).png().toBuffer();
  const widePages=await createMangaImageAssets(wide,{upload:async()=> 'https://test.invalid/wide'});
  assert.equal(widePages[0].width,20001);
});

test('editor allows a large selected image to reach the backend', async t => {
  let uploads=0;
  const ctx=editor({CancelToken:cancelToken,async post(){uploads++;return {data:{url:'https://test.invalid/large'}};}},t);
  await ctx.instance.uploadFiles([{name:'large.png',size:8*1024*1024}],['large-image']);
  assert.equal(uploads,1);
  assert.equal(ctx.instance.uploadQueue[0].status,'success');
});

test('browser File/Blob is sent directly without base64 encoding', async t => {
  const ctx=component('pages/writers/mangaEditor.vue',{},t);
  const file=new Blob([Buffer.from('test image bytes')],{type:'image/png'});
  const upload=await ctx.instance.prepareUpload('unused',{file});
  assert.equal(upload.binary,true);
  assert.equal(upload.blob,file);
});

test('saving manga content preserves dimensions above the old 20000-pixel cap', () => {
  const source=fs.readFileSync(path.join(backend,'routes/essays.js'),'utf8');
  const code=source.slice(source.indexOf('function normalizeMangaPage('),source.indexOf('function currentTime()'));
  const normalized=vm.runInNewContext(code+'\nnormalizeMangaContent(content)',{
    MANGA_PAGE_URL_MAX_LENGTH:512,MANGA_MAX_PAGES:300,
    content:{pages:[{id:1,url:'https://test.invalid/large.png',width:20001,height:30001}]},
  });
  assert.equal(normalized.ok,true);
  assert.deepEqual(JSON.parse(normalized.content).pages[0].width,20001);
  assert.deepEqual(JSON.parse(normalized.content).pages[0].height,30001);
});
test('retry inserts a failed earlier upload before later successful pages', async t => {
  let failed=true;
  const ctx=editor({CancelToken:cancelToken,async post(url,body){if(body==='2'&&failed)throw new Error('offline');return {data:{url:'https://test.invalid/new'+body}};}},t);
  await ctx.instance.uploadFiles([{name:'2.png'},{name:'10.png'}],['2','10']);
  assert.equal(ctx.instance.pages[2].url,'https://test.invalid/new10');
  failed=false; ctx.instance.retryUpload(ctx.instance.uploadQueue[0]); await new Promise(r=>setImmediate(r));
  assert.deepEqual(ctx.instance.pages.slice(2).map(p=>p.url),['https://test.invalid/new2','https://test.invalid/new10']);
});
test('late image dimensions above viewport preserve strip scroll position', t => {
  const {instance:r}=component('pages/readers/mangaReader.vue',{},t); r.pages=clone(pages);r.mode='strip';r.currentPage=4;r.currentScrollTop=2100;
  r.onPageLoad(0,{detail:{width:500,height:1400}});
  assert.equal(r.currentScrollTop,2625);assert.equal(r.stripScrollTop,2625);
});
test('native asynchronous measurements cannot restart an ended gesture', t => {
  const {instance:z}=component('components/manga-zoom-image.vue',{},t);let measure;
  z.measure=cb=>{measure=cb;};z.rect={left:0,top:0,width:400,height:600};
  z.touchStart({touches:[{clientX:10,clientY:10},{clientX:30,clientY:10}]});
  z.touchEnd({touches:[]});measure();assert.equal(z.gesture,null);
});
test('server stops generating variants after the client cancels upload', async () => {
  const input=await sharp({create:{width:100,height:8000,channels:3,background:'#abc'}}).png().toBuffer();
  let cancelled=false,uploads=0;
  await assert.rejects(()=>createMangaImageAssets(input,{strip:true,isCancelled:()=>cancelled,upload:async()=>{uploads++;cancelled=true;return 'https://test.invalid/original';}}),/取消/);
  assert.equal(uploads,1);
});

test('manga shared Sass compiles with the installed project or HBuilder compiler', t => {
  let sass;
  for (const candidate of ['sass', '/Applications/HBuilderX.app/Contents/HBuilderX/plugins/compile-dart-sass/node_modules/sass']) {
    try { sass = require(candidate); break; } catch (_) {}
  }
  if (!sass) { t.skip('Sass runtime not installed; run the UniApp H5 build to validate styles'); return; }
  for (const file of ['pages/writers/mangaSettings.vue','pages/writers/mangaEditor.vue','pages/readers/mangaInfo.vue','pages/readers/mangaReader.vue','components/mangaPage.vue','components/manga-zoom-image.vue','components/manga-page-sorter.vue']) {
    const source=fs.readFileSync(path.resolve(__dirname,'../',file),'utf8');
    const result=compiler.parse({source,filename:file}), desc=result.descriptor||result;
    const style=desc.styles[0].content.replace("@import '@/common/manga-theme.scss';",fs.readFileSync(path.resolve(__dirname,'../common/manga-theme.scss'),'utf8'));
    const output = sass.compileString ? sass.compileString(style,{logger:{warn(){},debug(){}}}).css : sass.renderSync({data:style}).css;
    assert(output.length>0);
  }
});
test('slider can seek to the same page again after scrolling inside a strip', async t => {
  const {instance:r}=component('pages/readers/mangaReader.vue',{},t);r.pages=clone(pages);r.mode='strip';r.stripScrollTop=0;r.currentScrollTop=150;
  r.onPageSlider({detail:{value:1}});assert.equal(r.stripScrollTop,-1);await r.$nextTick();assert.equal(r.stripScrollTop,0);
});
test('failed settings switch rolls back the visible value and keeps unsaved text', async t => {
  const {instance:s}=component('pages/writers/mangaSettings.vue',{post:async()=>{throw new Error('offline');}},t);
  s.novel={is_personal:1,current_access:{access_role:'owner'}};s.name='未保存名称';s.intro='简介';s.loading=false;
  const operation=s.setStatus('is_personal',0);assert.equal(s.novel.is_personal,0);await operation;
  assert.equal(s.novel.is_personal,1);assert.equal(s.name,'未保存名称');assert.equal(s.changing,false);
});
test('settings deletion requires owner confirmation and returns to the work shelf', async t => {
  const requests=[];
  const {instance:s,uni,navigation,messages}=component('pages/writers/mangaSettings.vue',{post:async(url,body)=>{requests.push({url,body});}},t);
  s.id='398';s.novel={name:'测试漫画',is_personal:0,current_access:{access_role:'owner'}};
  s.loading=false;s.name='测试漫画';s.intro='';s.baseline=JSON.stringify([s.name,s.intro]);
  let modal;
  uni.showModal=options=>{modal=options;};
  uni.switchTab=options=>navigation.push(options);
  s.viewReaderDetail();assert.equal(navigation[0].url,'/pages/readers/mangaInfo?id=398');
  navigation.length=0;
  s.deleteManga();assert.match(modal.content,/测试漫画/);assert.match(modal.content,/不可找回.*50 原木/);
  await modal.success({confirm:false});assert.equal(requests.length,0);
  s.deleteManga();await modal.success({confirm:true});
  assert.equal(requests.length,1);
  assert.equal(requests[0].url,'/essays/delete_novel');
  assert.equal(requests[0].body.id,398);
  assert.equal(navigation[0].url,'/pages/essays');
  assert.equal(messages.at(-1).title,'作品已删除');
  s.novel.current_access.access_role='collaborator';
  s.deleteManga();assert.equal(requests.length,1);
});
test('manga card opens reader detail, using author access for private work', t => {
  const {instance:m,navigation}=component('components/mangaPage.vue',{},t);
  m.viewDetail({novel_id:398,is_personal:0});
  m.viewDetail({novel_id:399,is_personal:1});
  assert.equal(navigation[0].url,'/pages/readers/mangaInfo?id=398');
  assert.equal(navigation[1].url,'/pages/readers/mangaInfo?id=399&preview=1');
});
test('manga detail actions load likes, toggle praise and jump to the full catalog', async t => {
  const requests=[];
  const {instance:m,storage}=component('pages/readers/mangaInfo.vue',{
    get:async url=>{requests.push(url);return {data:[{nices:url.includes('get_nice_status')?1:13}]};},
    post:async url=>{requests.push(url);return {data:{}};},
  },t);
  storage.set('token',JSON.stringify({tk:'test-token'}));
  m.uid=398;m.loading=false;
  await m.loadNiceState();
  assert.equal(m.niceCount,13);assert.equal(m.niceStatus,true);
  await m.toggleNice();
  assert.equal(m.niceCount,12);assert.equal(m.niceStatus,false);
  assert(requests.some(url=>url.includes('/library/nice_novel?id=398')));
  m.openCatalog();await m.$nextTick();
  assert.equal(m.catalogExpanded,true);assert.equal(m.catalogTarget,'manga-catalog');
});
test('manga sharing creates a reader-detail code and copies it', async t => {
  const requests=[];
  const {instance:m,storage,uni}=component('pages/readers/mangaInfo.vue',{
    post:async(url,body)=>{requests.push({url,body});return {data:url.includes('create_share_code')?{success:true,code:'ABCDEFGH',share_text:'【原木社区】ABCDEFGH，漫画'}:{}};},
  },t);
  storage.set('token',JSON.stringify({tk:'test-token'}));
  m.uid=398;m.loading=false;m.bookInfo={name:'测试漫画',author_name:'作者'};
  let copied,modal;
  uni.setClipboardData=options=>{copied=options.data;options.success();};
  uni.showModal=options=>{modal=options;};
  await m.shareManga();
  assert.equal(requests[0].body.share_type,'book');
  assert.equal(requests[0].body.target_url,'/pages/readers/mangaInfo?id=398');
  assert.match(copied,/ABCDEFGH/);assert.match(modal.content,/已复制/);
  assert.equal(m.shareBusy,false);
});
test('manga tipping reuses the book gift sheet but blocks guests, owners and previews', async t => {
  const {instance:m,storage,messages}=component('pages/readers/mangaInfo.vue',{},t);
  m.uid=398;m.loading=false;m.bookInfo={auther_id:7};
  let opened=0,closed=0;
  m.$refs.tippingPopup={open:position=>{assert.equal(position,'bottom');opened++;},close:()=>{closed++;}};
  m.openTipping();
  assert.equal(messages.at(-1).title,'请先登录');
  storage.set('token',JSON.stringify({tk:'test-token',id:7}));
  m.openTipping();
  assert.match(messages.at(-1).title,/自己的漫画/);
  storage.set('token',JSON.stringify({tk:'test-token',id:8}));
  m.isPreview=true;m.openTipping();
  assert.equal(opened,0);
  m.isPreview=false;m.openTipping();await m.$nextTick();
  assert.equal(m.showTipping,true);assert.equal(opened,1);
  m.handleTippingSuccess();assert.equal(closed,1);
  const source=fs.readFileSync(path.resolve(__dirname,'../pages/readers/mangaInfo.vue'),'utf8');
  assert.match(source,/<tipping-bar v-if="showTipping" :novel_id="uid"/);
  assert.match(source,/<button[^>]*v-if="!isPreview"[^>]*class="tip-btn"/);
});
test('camera EXIF orientation is respected by variants while original bytes are retained', async () => {
  const input=await sharp({create:{width:160,height:300,channels:3,background:'#abc'}}).jpeg().withMetadata({orientation:6}).toBuffer();
  const assets=[];const result=await createMangaImageAssets(input,{upload:async b=>{assets.push(b);return 'https://test.invalid/'+assets.length;}});
  assert.equal(result[0].width,300);assert.equal(result[0].height,160);assert.deepEqual(assets[0],input);
  const reading=await sharp(assets[2]).metadata();assert.equal(reading.width,300);assert.equal(reading.height,160);
});
test('clearing upload records cannot discard ordering needed for pending retries', async t => {
  const ctx=editor({CancelToken:cancelToken,async post(){throw new Error('offline');}},t);
  await ctx.instance.uploadFiles([{name:'2.png'}],['2']);ctx.instance.clearCompletedUploads();
  assert.equal(ctx.instance.uploadQueue.length,1);ctx.instance.cancelAllUploads();ctx.instance.clearCompletedUploads();assert.equal(ctx.instance.uploadQueue.length,0);
});
test('saving manga content preserves reading and thumbnail assets and rejects unsafe asset URLs', () => {
  const source=fs.readFileSync(path.join(backend,'routes/essays.js'),'utf8');
  const start=source.indexOf('function normalizeMangaPage('),end=source.indexOf('function currentTime()',start);
  const sandbox={MANGA_PAGE_URL_MAX_LENGTH:2048,MANGA_MAX_PAGES:300};
  vm.runInNewContext(source.slice(start,end),sandbox);
  const page={...pages[0],thumb:'https://test.invalid/thumb'};
  const result=sandbox.normalizeMangaContent({pages:[page]});
  assert.equal(result.ok,true);assert.deepEqual(JSON.parse(result.content).pages[0],page);
  const bad=sandbox.normalizeMangaContent({pages:[{...page,readingUrl:'javascript:alert(1)'}]});
  assert.equal(JSON.parse(bad.content).pages[0].readingUrl,undefined);
});
test('public author work listings exclude private and deleted works', async () => {
  const source=fs.readFileSync(path.join(backend,'routes/library.js'),'utf8');
  const start=source.indexOf("router.get('/get_novel_by_user_id'"),end=source.indexOf('\nrouter.',start+10);
  let handler,statement;
  vm.runInNewContext(source.slice(start,end),{router:{get:(url,callback)=>{handler=callback;}},query:async sql=>{statement=sql;return [];},console:{log(){}}});
  await handler({query:{id:1}},{end(){},json(){}});
  assert(statement.includes('n.is_personal = 0'));assert(statement.includes('n.deleted = 0'));
});

test('漫画详情加载就绪立即退出分镜，不等待动画周期', async t => {
  const { instance } = component('pages/readers/mangaInfo.vue', {}, t);
  let resolveBook;
  instance.getBookInfo = () => new Promise(resolve => { resolveBook = resolve; });
  for (const method of ['getArticles', 'getTags', 'loadBookcaseStatus', 'loadNiceState', 'loadProgress', 'loadComments', 'loadCommentAmount', 'loadArticleCommentAmounts']) instance[method] = async () => {};
  instance.isPreview = true;
  const loading = instance.loadAll();
  assert.equal(instance.loadingCover, true);
  assert.equal(instance.loading, true);
  resolveBook();
  await loading;
  assert.equal(instance.loading, false);
  assert.equal(instance.loadingCover, false);
});

test('漫画详情加载失败退出分镜，露出错误和重试入口', async t => {
  const { instance } = component('pages/readers/mangaInfo.vue', {}, t);
  instance.getBookInfo = async () => { instance.loadError = '加载失败，请重试'; };
  for (const method of ['getArticles', 'getTags', 'loadBookcaseStatus', 'loadNiceState', 'loadProgress', 'loadComments', 'loadCommentAmount', 'loadArticleCommentAmounts']) instance[method] = async () => {};
  instance.isPreview = true;
  await instance.loadAll();
  assert.equal(instance.loadingCover, false);
  assert.equal(instance.loadError, '加载失败，请重试');
});
