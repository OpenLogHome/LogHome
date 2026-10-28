// Actual cloud-audio controller, browser transport, persistence plugin, and public power page.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),babel=require('@babel/core'),compiler=require('vue-template-compiler/build.js')
const {fixture,settle,deferred,article,book,chapters}=require('./helpers/reader-audio-fixture.cjs')
const f=fixture(),root=path.resolve(__dirname,'..'),cache=new Map(),records=new Map(),events=new Map(),routeHooks=[]
const storage={getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,String(v)),removeItem:k=>records.delete(k)}
let hotDispose
const win={localStorage:storage,Audio:f.Audio,URL:{createObjectURL:f.env.createObjectURL,revokeObjectURL:f.env.revokeObjectURL},addEventListener:(key,fn)=>events.set('window:'+key,fn),removeEventListener:key=>events.delete('window:'+key),fetch:async(_,options)=>({ok:true,blob:()=>f.speech({...JSON.parse(options.body),token:options.headers.Authorization.split(' ')[1],signal:options.signal})})}
win.setTimeout=(fn,ms)=>setTimeout(fn,ms);win.clearTimeout=id=>clearTimeout(id)
const doc={visibilityState:'visible',addEventListener:(key,fn)=>events.set('document:'+key,fn),removeEventListener:key=>events.delete('document:'+key)}
function load(file){if(cache.has(file))return cache.get(file);let source=fs.readFileSync(path.join(root,file),'utf8');if(file.endsWith('.json'))return JSON.parse(source);if(file.endsWith('.vue')){const c=compiler.parseComponent(source);assert.deepEqual(compiler.compile(c.template.content).errors,[],file);source=c.script.content}const exports={};vm.runInNewContext(babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code,{exports,module:{hot:{dispose:fn=>hotDispose=fn}},process:{client:true,server:false,env:{baseUrl:'https://api.example.test'}},console,window:win,document:doc,navigator:{},localStorage:storage,Date,URL,atob,AbortController,setTimeout,clearTimeout,require(s){if(s==='vue')return{observable:s=>s};if(s==='axios')return{request:async config=>({data:{code:200,data:await f.session(config.headers.Authorization.split(' ')[1])}})};if(s.endsWith('.vue'))return{};let target=s.startsWith('~/')?s.slice(2):path.posix.join(path.posix.dirname(file),s);if(!/\.(js|json)$/.test(target))target+='.js';return load(target)}},{filename:file});cache.set(file,exports);return exports}
const plain=v=>JSON.parse(JSON.stringify(v)),account=tk=>{f.login=tk;storage.setItem('token',JSON.stringify({tk}))}
async function main(){
 const audio=load('utils/reader-audio.js'),player=new audio.ReaderAudio(audio.createAudioState(),f.env),state=player.state
 await player.open(book,chapters,article(),1);await settle()
 assert.deepEqual(plain(state.voices.map(v=>v.name)),['温润君子','阳光少年','青春女神','软糯萝莉'])
 assert.equal(state.status,'playing');assert.equal(f.sessions.length,1);assert(state.bufferedParagraphs>=3)
 const active=player.audio;active.tick(9);const offset=state.charOffset
 await player.open(book,chapters,article(),1);assert.equal(player.audio,active);assert.equal(player.audio.currentTime,9);assert.equal(state.charOffset,offset)
 f.login='a-renewed';await player.open(book,chapters,article(),1);assert.equal(player.audio,active);assert.equal(player.audio.currentTime,9)
 await player.open(book,chapters,article(),3,{forceSeek:true});assert.equal(state.paragraphId,3);assert.equal(player.audio.currentTime,0)
 console.log('PASS four cloud voices, direct user session, next-three prefetch, ordinary reopen and JWT refresh retain exact media position')
 const staleEnd=player.audio.onended;await player.seekParagraph(1,true);staleEnd();assert.equal(state.paragraphIndex,1)
 const rateAudio=player.audio,count=f.speeches.length;player.configure({rate:1.5});assert.equal(rateAudio.playbackRate,1.5);assert.equal(f.speeches.length,count)
 player.configure({voiceURI:'soft-girl'});await settle();assert.equal(state.voiceURI,'soft-girl');assert.equal(f.urls.get(player.audio.src).voice,'voice-soft-girl')
 player.configure({voiceURI:'old-system-voice'});await settle();assert.equal(state.voiceURI,'warm-gentleman')
 player.pause();assert.equal(state.status,'paused');await player.play();assert.equal(state.status,'playing');player.setSleep(5);f.time+=300001;await player.wake();assert.equal(state.status,'paused');assert.equal(state.sleepUntil,0)
 console.log('PASS stale callbacks, local speed changes without synthesis, voice replacement, old voice migration, pause/resume and throttled sleep')
 await player.seekParagraph(5,true);player.setSleep('chapter');player.audio.end();assert.equal(state.status,'paused');assert.equal(state.sleepAtChapterEnd,false);await player.toggle();await settle();assert.equal(state.chapterId,12)
 const pending=deferred();player.cache.clear();f.article=()=>pending.promise;const loading=player.chapter(0);await settle();player.suspend();pending.resolve([article()]);await loading;assert.equal(state.status,'paused')
 f.article=async()=>[article(99)];await player.chapter(0);assert.equal(state.status,'error')
 f.article=async()=>[{...article(),is_draft:1}];await player.chapter(0);assert.equal(state.status,'error')
 f.article=async id=>[article(id)];await player.chapter(0);f.login='b';await player.syncAccount();assert.equal(state.visible,false);assert.equal(player.audioCache.size,0)
 const unicode='字'.repeat(299)+'😀尾';assert.equal(audio.speechChunk(unicode).length,299)
 player.destroy()
 console.log('PASS cross-chapter advance, chapter-end sleep, canceled body loads, wrong/draft chapters, logout and Unicode API limit')
 // Revoked user keys are refreshed once; transient queue saturation is bounded.
 const r=fixture(),retryPlayer=new audio.ReaderAudio(audio.createAudioState(),r.env);let rejected=false
 const normalSpeech=r.speech;r.speech=async request=>{if(!rejected){rejected=true;throw Object.assign(Error('revoked'),{status:401})}return normalSpeech(request)}
 await retryPlayer.open(book,chapters,article(),1);assert.equal(retryPlayer.state.status,'playing');assert.equal(r.sessions.length,2);retryPlayer.destroy()
 const blocked=fixture(),blockedPlayer=new audio.ReaderAudio(audio.createAudioState(),blocked.env),play=blocked.Audio.prototype.play
 blocked.Audio.prototype.play=function(){return Promise.reject(Object.assign(Error('blocked'),{name:'NotAllowedError'}))}
 await blockedPlayer.open(book,chapters,article(),1);assert.equal(blockedPlayer.state.status,'paused');assert.match(blockedPlayer.state.notice,/浏览器/)
 blocked.Audio.prototype.play=play;await blockedPlayer.play();assert.equal(blockedPlayer.state.status,'playing');blockedPlayer.destroy()
 const delayed=fixture(),late=deferred();delayed.speech=()=>late.promise;const canceled=new audio.ReaderAudio(audio.createAudioState(),delayed.env),opening=canceled.open(book,chapters,article(),1)
 await settle();canceled.close();late.resolve({size:100,type:'audio/mpeg'});await opening;await settle();assert.equal(canceled.state.visible,false);assert.equal(delayed.media.length,0);assert.equal(delayed.urls.size,0)
 console.log('PASS revoked-key recovery, autoplay refusal with manual retry, and aborted late speech cannot resurrect a closed player')
 const resume=load('utils/reader-audio-resume.js');account('a');const savedPlayer=new audio.ReaderAudio(audio.createAudioState(),f.env)
 await savedPlayer.open(book,chapters,article(),1);savedPlayer.audio.tick(12);const savedOffset=savedPlayer.state.charOffset
 const item=resume.saveAudioResume(storage,'a',savedPlayer,Date.now());assert.equal(item.audioOffset,12);assert.equal(item.charOffset,savedOffset);assert(!JSON.stringify(item).includes('sk-tts-'));assert(!JSON.stringify(item).includes('第一段'))
 assert.equal(resume.readAudioResume(storage,'b'),null);assert.equal(resume.readAudioResume(storage,'a').charOffset,savedOffset)
 savedPlayer.destroy()
 let writes=0,installed
 const app={$api:{reader:{book:async()=>[book],chapters:async()=>chapters,article:async id=>[article(id)]},reading:{saveProgress:async()=>{writes++}}},router:{afterEach:fn=>{routeHooks.push(fn);return()=>{}}}}
 load('plugins/reader-audio.client.js').default({app},(_,value)=>installed=value)
 assert(installed.state.resumeCandidate);await installed.resumeLast();await settle();assert.equal(installed.state.status,'playing');assert.equal(installed.audio.currentTime,12);assert(writes>=1)
 const before=installed.audio;events.get('document:freeze')();assert.equal(installed.state.status,'paused');await events.get('window:pageshow')();assert.equal(installed.state.status,'paused');await installed.play();assert.equal(installed.audio,before)
 account('a-renewed');await events.get('window:storage')({key:'token'});await settle();assert.equal(installed.audio,before);assert.equal(installed.state.visible,true)
 account('b');await events.get('window:storage')({key:'token'});await settle();assert.equal(installed.state.visible,false)
 assert(![...records.values()].some(value=>value.includes('sk-tts-')))
 account('a');await events.get('window:storage')({key:'token'});await installed.open(book,chapters,article(),1);installed.configure({voiceURI:'sunny-boy'});installed.saveSettings();installed.close();assert.equal(resume.readAudioResume(storage,'a'),null);hotDispose();assert.equal(events.size,0)
 load('plugins/reader-audio.client.js').default({app},(_,value)=>installed=value);assert.equal(installed.state.voiceURI,'sunny-boy');hotDispose()
 console.log('PASS actual plugin precise media-time resume, metadata-only storage, freeze/pageshow, JWT rotation, account isolation, preference persistence and HMR cleanup')
 const transport=load('utils/reader-tts.js'),requests=[]
 const input={input:'真实请求格式检查',voice:'voice-warm-gentleman',token:'sk-tts-fixture'}
 await transport.requestTtsSpeech(input,async(url,options)=>{requests.push({url,options});return{ok:true,blob:async()=>({size:100,type:'audio/mpeg'})}})
 assert.equal(requests[0].url,'https://tts.codesocean.top/v1/audio/speech');assert.equal(requests[0].options.credentials,'omit');assert.equal(requests[0].options.headers.Authorization,'Bearer sk-tts-fixture')
 const body=JSON.parse(requests[0].options.body);assert.equal(body.input,input.input);assert.equal(body.voice,input.voice);assert.equal(body.response_format,'mp3');assert.equal(body.model,undefined);assert(!JSON.stringify(requests).includes('Admin'))
 await assert.rejects(transport.requestTtsSpeech(input,async()=>({ok:false,status:401})),error=>error.status===401)
 await assert.rejects(transport.requestTtsSpeech(input,async()=>({ok:true,blob:async()=>({size:0,type:'audio/mpeg'})})),/无效音频/)
 await assert.rejects(transport.requestTtsSpeech(input,async()=>{throw new TypeError('cors')}),/跨域/)
 const bounded=fixture(),boundedPlayer=new audio.ReaderAudio(audio.createAudioState(),bounded.env),large=article()
 large.content=Array.from({length:36},(_,i)=>({id:i+1,type:'text',value:'缓存验证段落'+i}))
 await boundedPlayer.open(book,[chapters[0]],large,1);await settle()
 for(let i=1;i<32;i++){await boundedPlayer.seekParagraph(i,true);await settle()}
 assert(boundedPlayer.audioCache.size<=24);assert(bounded.revoked.length>0);assert(boundedPlayer.audioCache.has(boundedPlayer.active.key));boundedPlayer.destroy();assert.equal(bounded.urls.size,0)
 console.log('PASS direct CORS transport, user-only Authorization, omitted default model, HTTP errors, invalid audio and bounded/revoked browser cache')
 const power=load('utils/reader-power.js'),raw={novel_id:7,novel_type:'novel',name:'Power',clicks:'10',nices:3,bookmarks:2,comments:4,tips:5,score:700,ranked_score:680,days_diff:-1000,generated_at:'2026-10-10T14:00:00+08:00',update_time:'2026-10-08T11:00:00Z'}
 const data=power.normalizePower(raw,7),breakdown=power.powerBreakdown(data);assert.deepEqual(plain(breakdown.rows.map(row=>row.weight)),[8,200,20,12,10]);assert.equal(breakdown.base,646);assert.equal(breakdown.factorA,.4);assert.equal(breakdown.factorB,.6);assert.equal(power.powerBreakdown({...data,days_diff:0}).factorA,1.33);assert.equal(power.powerBreakdown({...data,days_diff:null}).factorA,.4);assert.throws(()=>power.normalizePower({...raw,score:null},7));assert.throws(()=>power.normalizePower(raw,8));assert.match(power.powerDate(raw.update_time),/19:00:00/)
 console.log('PASS exact backend/mobile weights, independent real tip contribution, date floor/future handling and malformed/foreign breakdown rejection')
 const page=load('pages/read/power/_id.vue').default,ctx={params:{id:7},$api:{reader:{power:async()=>raw}},error:e=>({error:e})};assert.equal((await page.asyncData(ctx)).power.score,700);assert.equal((await page.asyncData({...ctx,params:{id:'bad'}})).error.statusCode,404);assert.equal((await page.asyncData({...ctx,$api:{reader:{power:async()=>{throw{status:404}}}}})).error.statusCode,404);assert.equal((await page.asyncData({...ctx,$api:{reader:{power:async()=>{throw Error('outage')}}}})).error.statusCode,503);const seo=load('utils/reading-seo.js');assert.equal(seo.publicReadingPath('/read/power/7'),true);assert.equal(page.head.call({power:data}).link[0].href,'https://loghome.ink/read/power/7');load('components/read/ReaderAudioPlayer.vue');load('components/read/BookTools.vue')
 console.log('PASS actual public explanation SSR/404/503/canonical, mobile-safe route and compiled desktop audio/tools templates')
}
main().catch(e=>{console.error(e);process.exitCode=1})
