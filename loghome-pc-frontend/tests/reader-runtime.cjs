// Browser runtime regressions with fake audio/network/clocks; no authenticated backend writes.
const assert = require('node:assert/strict')
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm')
const babel = require('@babel/core')
const compiler = require('vue-template-compiler/build.js')
const root = path.resolve(__dirname, '..'), cache = new Map(), storage = new Map()
const localStorage = { getItem: key => storage.get(key) || null, setItem: (key,value) => storage.set(key,String(value)) }
let fontDownload = async () => 'LoadedFont'
function load(file) {
  if (cache.has(file)) return cache.get(file)
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(path.join(root,file),'utf8'))
  let source = fs.readFileSync(path.join(root,file),'utf8')
  if (file.endsWith('.vue')) { const component = compiler.parseComponent(source); assert.deepEqual(compiler.compile(component.template.content).errors,[],file); source = component.script.content }
  const code = babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code
  const exports = {}
  vm.runInNewContext(code, {exports, process:{client:true,server:false}, console, localStorage, window:{localStorage}, Date, setTimeout, clearTimeout, AbortController,
    require(specifier) {
      if (specifier.endsWith('.vue')) return {}
      if (specifier === 'axios') return {}
      if (file.startsWith('mixins/') && specifier === '~/utils/reader-font-loader') return {loadReaderFont:(...args)=>fontDownload(...args)}
      let target = specifier.startsWith('~/') ? specifier.slice(2) : path.posix.join(path.posix.dirname(file),specifier)
      if (!/\.(js|json|vue)$/.test(target)) target += '.js'
      return load(target)
    }
  }, {filename:file})
  cache.set(file,exports);return exports
}
const plain = value => JSON.parse(JSON.stringify(value))
const deferred = () => { let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject} }
const settle = async () => { for(let i=0;i<8;i++) await Promise.resolve() }
function preferenceInstance(api) {
  const definition=load('mixins/reader-preferences.js').default
  const ctx={$api:{reader:api},$set:(obj,key,value)=>{obj[key]=value}}
  Object.assign(ctx,definition.data())
  for(const [key,method] of Object.entries(definition.methods)) ctx[key]=method.bind(ctx)
  for(const [key,getter] of Object.entries(definition.computed)) Object.defineProperty(ctx,key,{get:()=>getter.call(ctx)})
  return ctx
}
async function main() {
  const prefs=load('utils/reader-preferences.js'), skins=load('utils/reader-backgrounds.js')
  assert.deepEqual(plain(prefs.themes),JSON.parse(fs.readFileSync(path.join(root,'../loghome-app-frontend/pages/readers/newReader/themesData.json'),'utf8')))
  assert.equal(Object.keys(prefs.themes).length,14)
  storage.set('reading_theme','dark');storage.set('reading_font_size','20');storage.set('reading_font_family','serif')
  const old=prefs.readPreferences(localStorage);assert.equal(old.theme,'black');assert.equal(old.font,'serif');assert.equal(old.fontSize,20)
  assert.equal(prefs.normalizePreferences({theme:'__proto__',fontSize:'NaN',lineHeight:999}).theme,'white')
  assert.equal(prefs.normalizePreferences({fontSize:'NaN'}).fontSize,22)
  assert.equal(prefs.savePreferences({setItem(){throw Error('denied')}},old),false)
  assert.equal(prefs.canUseBackground('standard','super'),true);assert.equal(prefs.canUseBackground('super','standard'),false)
  assert.equal(prefs.membershipTier({data:{active:false,subscription:{membership_type:'super'}}}),'')
  assert.equal(skins.normalizeBackgroundSkin({skin_key:'unsafe',skin_name:'bad',image_url:'javascript:alert(1)'},()=>true),null)
  assert.equal(skins.createBackgroundSkinStyle({image_url:'https://x.invalid/";a'}).backgroundImage,undefined)
  assert.deepEqual(Object.keys(prefs.readerFonts([])),['default'])
  assert.notEqual(prefs.fontIdentity('font',{version:'1',regular:{url:'https://x.invalid/font'}}),prefs.fontIdentity('font',{version:'2',regular:{url:'https://x.invalid/font'}}))
  console.log('PASS exact mobile palettes, legacy preferences, bounded inputs, denied storage, membership and asset safety')

  const list=[{skin_key:'free',skin_name:'纸',image_url:'https://x.invalid/p',theme_key:'yellow',required_membership:'none'},{skin_key:'vip',skin_name:'会员',image_url:'https://x.invalid/v',theme_key:'black',required_membership:'super'}]
  const first=deferred(),second=deferred();let request=0
  const preference=preferenceInstance({fonts:async()=>[],backgrounds:async()=>list,membership:()=>++request===1?first.promise:second.promise})
  storage.set('token',JSON.stringify({tk:'a'}));const older=preference.refreshReaderResources({theme:'wavechaser',backgroundSkinKey:'vip'})
  storage.set('token',JSON.stringify({tk:'b'}));const latest=preference.refreshReaderResources()
  second.resolve({data:{active:false,subscription:null}});await latest
  first.resolve({data:{active:true,subscription:{membership_type:'super'}}});await older
  assert.equal(preference.readerTier,'');assert.equal(preference.readerSkins.find(s=>s.skin_key==='vip').is_locked,true)
  preference.selectReaderSkin('vip');assert.equal(preference.readerPreferences.backgroundSkinKey,'');assert.match(preference.readerLockedMessage,/超级/)
  preference.selectReaderSkin('free');assert.equal(preference.readerPreferences.theme,'yellow')
  const loading=deferred();fontDownload=()=>loading.promise
  preference.readerFonts={default:{name:'默认'},remote:{name:'字体',regular:{url:'https://x.invalid/font'}}}
  const pendingFont=preference.selectReaderFont('remote');await preference.selectReaderFont('default');loading.resolve('OldFont');await pendingFont
  assert.equal(preference.readerPreferences.font,'default');assert.equal(preference.readerFontFamily,'')
  console.log('PASS out-of-order account permissions and stale font download cannot replace the current selection')

  const fontLoader=load('utils/reader-font-loader.js');let downloads=0,faces=[]
  const fontEnvironment={fetch:async()=>{downloads++;return{ok:true,arrayBuffer:async()=>new ArrayBuffer(10)}},FontFace:class{constructor(family,bytes,options){this.family=family;this.weight=options.weight}async load(){return this}},fonts:{add(face){faces.push(face)}}}
  const config={version:'test1',regular:{url:'https://x.invalid/f'},bold:{url:'https://x.invalid/f'}}
  const [familyA,familyB]=await Promise.all([fontLoader.loadReaderFont('test',config,fontEnvironment),fontLoader.loadReaderFont('test',config,fontEnvironment)])
  assert.equal(familyA,familyB);assert.equal(downloads,1);assert.deepEqual(faces.map(f=>f.weight),['400','700'])
  await fontLoader.loadReaderFont('test',{...config,version:'test2'},fontEnvironment);assert.equal(downloads,2)
  let fail=true;const retryEnvironment={...fontEnvironment,fetch:async()=>{if(fail)throw Error('offline');return{ok:true,arrayBuffer:async()=>new ArrayBuffer(10)}}}
  await assert.rejects(fontLoader.loadReaderFont('retry',config,retryEnvironment),/下载失败/);fail=false;await fontLoader.loadReaderFont('retry',config,retryEnvironment)
  console.log('PASS font request deduplication, regular/bold registration, version invalidation and failure retry')

  const audio=load('utils/reader-audio.js');const spoken=[],voices=[{name:'中文',voiceURI:'zh',lang:'zh-CN',localService:true}],timers=[];let token='a'
  const synthesis={getVoices:()=>voices,addEventListener(){},removeEventListener(){},cancel(){},speak(utterance){spoken.push(utterance)}}
  const chapter=id=>({article_id:id,novel_id:7,title:`chapter ${id}`,content:[{id:1,value:'第一段。'},{id:2,value:'第二段。'},{type:'image',value:'https://x.invalid/i'},{id:3,value:''}]})
  let fetchArticle=async id=>[chapter(id)]
  const env={synthesis,Utterance:class{constructor(text){this.text=text}},article:id=>fetchArticle(id),token:()=>token,now:()=>1000,setTimeout:(fn,ms)=>{timers.push([fn,ms]);return timers.length},clearTimeout(){}}
  const state=audio.createAudioState(),player=new audio.ReaderAudio(state,env)
  await player.open({novel_id:7,name:'book'},[{article_id:1,title:'1'},{article_id:99,article_type:'spliter'},{article_id:2,title:'2'}],chapter(1),1)
  assert.equal(state.voices.length,1);assert.equal(state.chapters.length,2);assert.equal(state.paragraphs.length,2);assert.equal(state.status,'playing')
  const canceled=spoken.at(-1);player.seekParagraph(1);canceled.onend();assert.equal(state.paragraphIndex,1)
  spoken.at(-1).onend();await settle();assert.equal(state.chapterId,2);assert.equal(state.status,'playing')
  player.setSleep('chapter');spoken.at(-1).onend();spoken.at(-1).onend();assert.equal(state.status,'paused');assert.equal(state.sleepAtChapterEnd,false)
  player.seekRelative(-15);assert.equal(state.paragraphIndex,0);player.play();player.configure({rate:1.5});assert.equal(spoken.at(-1).rate,1.5)
  player.setSleep(5);assert.equal(timers.at(-1)[1],300000);timers.at(-1)[0]();assert.equal(state.status,'paused')
  const stale=deferred();fetchArticle=()=>stale.promise;player.cache.clear();const loadPending=player.chapter(0);player.close();stale.resolve([chapter(1)]);await loadPending;assert.equal(state.visible,false);assert.equal(state.status,'idle')
  await player.open({novel_id:7,name:'book'},[{article_id:1},{article_id:2}],chapter(1),null);fetchArticle=async()=>{throw Error('offline')};await player.chapter(1);assert.equal(state.status,'error');fetchArticle=async id=>[chapter(id)];player.toggle();await settle();assert.equal(state.chapterId,2)
  player.cache.clear();const accountChange=deferred();fetchArticle=()=>accountChange.promise;const accountPending=player.chapter(0);token='b';accountChange.resolve([chapter(1)]);await accountPending;assert.equal(state.visible,false)
  const long='字'.repeat(109)+'😀尾';assert.equal(audio.speechChunk(long).length,109)
  player.destroy()
  const articlePage = load('pages/article/_id.vue').default
  const routeFollower = { article: {article_id:1}, novel: {novel_id:7}, audioRouteRequested:0, $router: {push(){return undefined}} }
  articlePage.methods.onReaderAudioProgress.call(routeFollower,{visible:true,follow:true,bookId:7,chapterId:2,status:'playing',paragraphId:1})
  await settle();assert.equal(routeFollower.audioRouteRequested,2)
  console.log('PASS real playback queue semantics, paragraph/relative seek, cancellation, cross-chapter retry, sleep timers and account isolation')
  storage.set('token',JSON.stringify({tk:'new-account'}))
  articlePage.methods.saveReaderHistory.call({readerProgressAccount:'old-account'})
  let resets=0
  const progressAccount={readerProgressAccount:'old-account',initializeReaderPosition(){resets++;this.readerProgressAccount='new-account'},clearSelection(){},loadHighlights(){},highlights:[1],showCommentDrawer:true,feedbackVisible:true}
  articlePage.methods.checkReaderProgressAccount.call(progressAccount);assert.equal(resets,1);assert.equal(progressAccount.showCommentDrawer,false);assert.equal(progressAccount.feedbackVisible,false);assert.deepEqual(plain(progressAccount.highlights),[])
  articlePage.methods.checkReaderProgressAccount.call(progressAccount);assert.equal(resets,1)
  console.log('PASS account change cannot save another account’s old position and resets scoped reader state once')


  const {ReadingActivity}=load('utils/reading-activity.js');let now=0,visible=true,account='a',reports=[],rewards=[],failReport=false
  const activity=new ReadingActivity({now:()=>now,visible:()=>visible,token:()=>account,report:async seconds=>{reports.push(seconds);if(failReport)throw Error('offline');return{total_reward:2,settled_tasks:[{settled_times:1}]}},reward:value=>rewards.push(value)})
  activity.setActive(true)
  for(let i=0;i<60;i++){now+=1000;activity.tick()}await settle();assert.deepEqual(reports,[60]);assert.deepEqual(rewards,[2]);assert.equal(activity.buffer,0)
  visible=false;now+=10000;activity.tick();assert.equal(activity.buffer,0)
  visible=true;now+=180001;activity.tick();assert.equal(activity.buffer,0)
  activity.markActive();now+=1000;activity.tick();assert.equal(activity.buffer,1)
  account='b';activity.checkAccount();assert.equal(activity.buffer,0)
  failReport=true;activity.markActive();for(let i=0;i<60;i++){now+=1000;activity.tick()}await settle();assert.equal(activity.buffer,60);const previousCalls=reports.length;await activity.flush(true);assert.equal(reports.length,previousCalls)
  now+=5000;failReport=false;await activity.flush();assert.equal(activity.buffer,0)
  account='';activity.checkAccount();now+=1000;activity.tick();assert.equal(activity.buffer,0)
  console.log('PASS foreground active time only, idle/hidden suspension, account isolation, backoff and server-confirmed rewards')
}
main().catch(error=>{console.error(error);process.exitCode=1})
