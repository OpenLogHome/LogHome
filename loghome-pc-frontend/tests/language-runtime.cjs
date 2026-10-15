process.env.VUE_ENV='server';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),babel=require('@babel/core'),Vue=require('vue');
const compile=file=>babel.transformSync(fs.readFileSync(file,'utf8'),{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code;
const utils={};vm.runInNewContext(compile('utils/language.js'),{exports:utils,require:name=>JSON.parse(fs.readFileSync(name.replace('~/',''),'utf8'))});
assert.equal(utils.normalizeLanguage('en_US'),'en');assert.equal(utils.normalizeLanguage('zh-TW'),'zh-CN');assert.equal(utils.normalizeLanguage('de-DE'),null);
assert.equal(utils.effectiveLanguage('follow-system',['en-GB']),'en');assert.equal(utils.effectiveLanguage('zh-CN',['en-GB']),'zh-CN');assert.equal(utils.savedLanguage({getItem(){throw Error('denied')}}),'follow-system');
assert.equal(utils.translateUI('个人资料',{},'en'),'Profile details');assert.equal(utils.translateUI('common.cancel',{},'en'),'Cancel');assert.equal(utils.translateUI('用户自己写的内容',{},'en'),'用户自己写的内容');assert.equal(utils.translateUI('有效期至 {date} · {status}',{date:'2026',status:'On'},'en'),'Valid until 2026 · On');
const elementLocale=require('element-ui/lib/locale').default;
Object.defineProperty(Vue.prototype, '$t', {configurable:true,get(){throw Error('Nuxt prototype getter must not be read')}});
let token=null,handler=async()=>({language:null}),requests=[];
const create=(browser=true,delayReady=false)=>{
 const rows=new Map(delayReady?[[utils.LANGUAGE_KEY,'en']]:[]),readyCallbacks=[],events={},storage={getItem:key=>rows.get(key)||null,setItem:(key,value)=>rows.set(key,value)},exports={},injected={};
 const environment={exports,require:name=>name==='vue'?Vue:name==='moment'?{locale(){}}:name==='~/utils/language'?utils:name==='~/plugins/api/social'?{socialRequest:(...args)=>{requests.push(args);return handler(...args)}}:name==='~/plugins/api/reading'?{readingToken:()=>token}:name.includes('lib/locale/lang/')?require(name).default:elementLocale};
 if(browser)Object.assign(environment,{window:{localStorage:storage,onNuxtReady:fn=>delayReady?readyCallbacks.push(fn):fn(),addEventListener:(name,fn)=>events[name]=fn},navigator:{languages:['zh-CN']},document:{documentElement:{lang:'zh-CN'}}});
 vm.runInNewContext(compile('plugins/language.js'),environment);exports.default({},(key,value)=>injected[key]=value);return{...injected,rows,events,readyCallbacks};
};
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject}},settle=async()=>{for(let i=0;i<20;i++)await Promise.resolve()};
(async()=>{
 const serverA=create(false),serverB=create(false);await serverA.language.set('en');assert.equal(serverA.t('保存资料'),'Save profile');assert.equal(serverB.t('保存资料'),'保存资料');assert.equal(requests.length,0);
 const hydrating=create(true,true);assert.equal(hydrating.language.state.locale,'zh-CN');hydrating.readyCallbacks.forEach(fn=>fn());assert.equal(hydrating.language.state.locale,'en');
 const guest=create();await guest.language.set('en');assert.equal(guest.language.state.locale,'en');assert.equal(guest.rows.get('loghome_language'),'en');assert.equal(requests.length,0);assert.equal(elementLocale.t('el.select.noData'),'No data');
 token='account-a';handler=async()=>({language:'en'});const account=create();await settle();assert.equal(account.language.state.preference,'en');
 handler=async(_path,_params,method,body)=>({language:method==='POST'?body.language:'en'});await account.language.set('follow-system');assert.equal(requests.at(-1)[3].language,null);assert.equal(account.language.state.locale,'zh-CN');assert.equal(elementLocale.t('el.select.noData'),'无数据');
 handler=async()=>{throw Error('offline')};await account.language.set('en');assert.equal(account.language.state.locale,'en');assert.equal(account.language.state.syncError,'offline');assert.equal(account.language.state.saving,false);
 const old=deferred();handler=()=>old.promise;const loading=create();token='account-b';handler=async()=>({language:'zh-CN'});loading.events['auth-state-changed']();await settle();old.resolve({language:'en'});await settle();assert.equal(loading.language.state.locale,'zh-CN');
 const pending=deferred();handler=()=>pending.promise;const oldSave=loading.language.set('en');token='account-c';handler=async()=>({language:'zh-CN'});loading.events['auth-state-changed']();await settle();const newPending=deferred();handler=()=>newPending.promise;const newSave=loading.language.set('en');pending.resolve({language:'en'});await oldSave;assert.equal(loading.language.state.saving,true);newPending.resolve({language:'en'});await newSave;assert.equal(loading.language.state.saving,false);
 console.log('PASS language normalization, fallback/interpolation, guest persistence, SSR isolation, shared account contract, failed sync and stale loads/saves');
})().catch(error=>{console.error(error);process.exitCode=1});
