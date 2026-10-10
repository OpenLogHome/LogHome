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

  assert.equal(prefs.readerThemeMode({theme:'black'}),'dark');assert.equal(prefs.readerThemeMode({theme:'yellow'}),'light')
  storage.set(prefs.THEME_MEMORY_KEY,'broken')
  assert.equal(prefs.readReaderTheme(localStorage,'dark').theme,'black')
  assert.equal(prefs.rememberReaderTheme(localStorage,{theme:'yellow',backgroundSkinKey:'paper',font:'private-font',width:900}),true)
  assert.equal(prefs.rememberReaderTheme(localStorage,{theme:'black',backgroundSkinKey:'night'}),true)
  assert.deepEqual(plain(prefs.readReaderTheme(localStorage,'light')),{theme:'yellow',backgroundSkinKey:'paper'})
  assert(!storage.get(prefs.THEME_MEMORY_KEY).includes('private-font'))
  storage.set(prefs.THEME_MEMORY_KEY,JSON.stringify({dark:{theme:'white'},light:{theme:'__proto__'},unknown:{theme:'yellow'}}))
  assert.equal(prefs.readReaderTheme(localStorage,'dark').theme,'black');assert.equal(prefs.readReaderTheme(localStorage,'light').theme,'white')
  assert.equal(prefs.rememberReaderTheme({getItem(){throw Error('denied')}},{theme:'yellow'}),false)
  console.log('PASS independent day/night theme memory, invalid/corrupt records, reduced stored selection and denied storage')

  storage.delete(prefs.THEME_MEMORY_KEY)
  const shortcuts=preferenceInstance({})
  shortcuts.readerSkins=[{skin_key:'paper',theme_key:'yellow',required_membership:'none',is_locked:false},{skin_key:'night',theme_key:'black',required_membership:'super',is_locked:false}]
  shortcuts.readerTier='super';shortcuts.changeReaderPreferences({...prefs.DEFAULT_PREFERENCES,theme:'yellow',backgroundSkinKey:'paper',font:'serif',fontSize:26,width:980})
  shortcuts.toggleReaderNightMode();assert.equal(shortcuts.readerPreferences.theme,'black');assert.equal(shortcuts.readerPreferences.fontSize,26);assert.equal(shortcuts.readerPreferences.font,'serif');assert.equal(shortcuts.readerPreferences.width,980)
  shortcuts.selectReaderSkin('night');shortcuts.toggleReaderNightMode();assert.equal(shortcuts.readerPreferences.backgroundSkinKey,'paper')
  shortcuts.toggleReaderNightMode();assert.equal(shortcuts.readerPreferences.backgroundSkinKey,'night')
  shortcuts.toggleReaderNightMode();shortcuts.readerTier='';shortcuts.toggleReaderNightMode();assert.equal(shortcuts.readerPreferences.theme,'black');assert.equal(shortcuts.readerPreferences.backgroundSkinKey,'')
  prefs.rememberReaderTheme(localStorage,{theme:'wavechaser'});shortcuts.toggleReaderNightMode();assert.equal(shortcuts.readerPreferences.theme,'white')
  shortcuts.readerPreferences={...prefs.DEFAULT_PREFERENCES,theme:'green'};shortcuts.readerSkins=[];shortcuts.toggleReaderNightMode();shortcuts.toggleReaderNightMode();assert.equal(shortcuts.readerPreferences.theme,'green')
  console.log('PASS one-click day/night restores valid skins, preserves typography, rejects expired membership and falls back safely')

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
  const synthesis={getVoices:()=>voices,addEventListener(){},removeEventListener(){},cancel(){},speak(utterance){spoken.push(utterance);utterance.onstart()}}
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
  articlePage.methods.onReaderAudioProgress.call(routeFollower,{visible:true,speechStarted:false,follow:true,bookId:7,chapterId:2,status:'playing',paragraphId:1})
  await settle();assert.equal(routeFollower.audioRouteRequested,0)
  articlePage.methods.onReaderAudioProgress.call(routeFollower,{visible:true,speechStarted:true,follow:true,bookId:7,chapterId:2,status:'playing',paragraphId:1})
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
  const activity=new ReadingActivity({now:()=>now,visible:()=>visible,token:()=>account,report:async (seconds,id)=>{reports.push(seconds);if(failReport)throw Error('offline');return{msg:'ok',client_request_id:id,accepted_seconds:seconds,replayed:false,total_reward:2,settled_tasks:[{settled_times:1,reward:2}]}},reward:value=>rewards.push(value)})
  activity.setActive(true)
  for(let i=0;i<60;i++){now+=1000;activity.tick()}await settle();assert.deepEqual(reports,[60]);assert.deepEqual(rewards,[2]);assert.equal(activity.buffer,0)
  visible=false;now+=10000;activity.tick();assert.equal(activity.buffer,0)
  visible=true;now+=180001;activity.tick();assert.equal(activity.buffer,0)
  activity.markActive();now+=1000;activity.tick();assert.equal(activity.buffer,1)
  account='b';activity.checkAccount();assert.equal(activity.buffer,0)
  failReport=true;activity.markActive();for(let i=0;i<60;i++){now+=1000;activity.tick()}await settle();assert.equal(activity.buffer,0);assert.equal(activity.pending.seconds,60);const previousCalls=reports.length;await activity.flush(true);assert.equal(reports.length,previousCalls)
  now+=5000;failReport=false;await activity.flush();assert.equal(activity.buffer,0)
  account='';activity.checkAccount();now+=1000;activity.tick();assert.equal(activity.buffer,0)
  console.log('PASS foreground active time only, idle/hidden suspension, account isolation, backoff and server-confirmed rewards')
  const makeReceipt=(seconds,id,reward=0,replayed=false)=>({msg:'ok',client_request_id:id,accepted_seconds:seconds,replayed,total_reward:reward,settled_tasks:reward?[{reward,settled_times:1}]:[]})
  now=0;account='a';visible=true;let counted=0,attempts=0,ids=[],serial=0,notices=[]
  const safe=new ReadingActivity({now:()=>now,visible:()=>visible,token:()=>account,requestId:()=>`read-test-request-${++serial}`,report:async(seconds,id)=>{ids.push({seconds,id});if(++attempts===1){counted+=seconds;throw Error('committed response lost')}if(attempts===2)return makeReceipt(seconds,id,0,true);counted+=seconds;return makeReceipt(seconds,id)},reward:n=>notices.push(n)})
  safe.setActive(true);for(let i=0;i<60;i++){now+=1000;safe.tick()}await settle();assert.equal(safe.pending.seconds,60);const pendingId=safe.pending.id
  for(let i=0;i<4;i++){now+=1000;safe.tick()}await settle();assert.equal(attempts,1)
  now+=1000;safe.tick();await settle();assert.deepEqual(ids[0],ids[1]);assert.equal(counted,60);assert.equal(safe.pending,null);assert.equal(safe.buffer,5);assert.deepEqual(notices,[])
  await safe.flush(true);assert.equal(ids[2].seconds,5);assert.notEqual(ids[2].id,pendingId);assert.equal(counted,65)
  console.log('PASS committed response loss retries the same ID/duration, buffers new time separately and never repeats earned-reward toast')
  let resolveOld;const oldActivity=new ReadingActivity({now:()=>now,visible:()=>true,token:()=>account,report:(seconds,id)=>new Promise(resolve=>{resolveOld=()=>resolve(makeReceipt(seconds,id,777))}),reward:n=>notices.push(n)})
  oldActivity.active=true;oldActivity.buffer=60;const oldSend=oldActivity.flush();await settle();account='b';oldActivity.checkAccount();account='a';oldActivity.checkAccount();resolveOld();await oldSend;assert.deepEqual(notices,[]);assert.equal(oldActivity.pending,null)
  let warning=0,writes=0;const broken=new ReadingActivity({now:()=>now,visible:()=>true,token:()=>account,report:async(seconds,id)=>{writes++;return{...makeReceipt(seconds,id,6),accepted_seconds:seconds+1}},reward:n=>notices.push(n),warning:()=>warning++})
  broken.active=true;broken.buffer=60;await broken.flush();assert.equal(broken.blocked,true);assert.equal(warning,1);broken.buffer=60;await broken.flush(true);assert.equal(writes,1);assert.deepEqual(notices,[])
  const {readingActivityReceipt}=load('utils/reading-activity.js');for(const bad of [makeReceipt(60,'wrong',6),makeReceipt(60,'read-checked-receipt',6,true),{...makeReceipt(60,'read-checked-receipt',6),total_reward:7}])assert.throws(()=>readingActivityReceipt(bad,{id:'read-checked-receipt',seconds:60}))
  console.log('PASS A→B→A generations ignore old receipts; invalid ID/duration/reward sums block retries without showing invented growth')
  attempts=0;serial=0;ids=[];const outage=new ReadingActivity({now:()=>now,visible:()=>true,token:()=>account,requestId:()=>`read-outage-${++serial}`,report:async(seconds,id)=>{ids.push({seconds,id});throw Error('unavailable')},reward:()=>{throw Error('unexpected reward')}})
  outage.setActive(true);outage.buffer=60;await outage.flush();for(let i=0;i<500;i++){now+=1000;outage.markActive();outage.tick();await settle()}assert.equal(outage.pending.seconds,60);assert.equal(outage.buffer,300);assert(ids.every(row=>row.id===ids[0].id&&row.seconds===60));assert(outage.retryAt-now<=60000)
  console.log('PASS long outages bound new time and retry backoff while retaining one immutable pending report')

  let intervalCallback,disposePlugin,installedReporter,marks=0,removed=0;const pluginEvents=new Map()
  const audioApp={$readerAudio:{state:{status:'playing',speechStarted:false}},$api:{reader:{exp(){throw Error('must not write')} }},router:{currentRoute:{path:'/article/1'},afterEach(){return()=>removed++}}}
  const exported={};vm.runInNewContext(babel.transformSync(fs.readFileSync(path.join(root,'plugins/reading-activity.client.js'),'utf8'),{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code,{exports:exported,module:{hot:{dispose:fn=>disposePlugin=fn}},Date,document:{visibilityState:'visible',addEventListener:(key,fn)=>pluginEvents.set(key,fn),removeEventListener:key=>pluginEvents.delete(key)},window:{addEventListener:(key,fn)=>pluginEvents.set(key,fn),removeEventListener:key=>pluginEvents.delete(key)},setInterval:fn=>{intervalCallback=fn;return 1},clearInterval:id=>assert.equal(id,1),require(name){if(name==='~/utils/reading-activity')return{ReadingActivity};if(name==='~/plugins/api/reading')return{readingToken:()=>''};if(name==='element-ui')return{Message:{success(){throw Error('unexpected reward')},warning(){}}};throw Error(name)}})
  exported.default({app:audioApp},(_,reporter)=>installedReporter=reporter);installedReporter.markActive=()=>marks++
  intervalCallback();assert.equal(marks,0);audioApp.$readerAudio.state.speechStarted=true;intervalCallback();assert.equal(marks,1);audioApp.$readerAudio.state.status='paused';intervalCallback();assert.equal(marks,1);disposePlugin();assert.equal(removed,1);assert.equal(pluginEvents.size,0)
  console.log('PASS actual activity plugin only extends active reading after speech starts; queued/paused playback and HMR cannot keep fake listening active')

}
main().catch(error=>{console.error(error);process.exitCode=1})
