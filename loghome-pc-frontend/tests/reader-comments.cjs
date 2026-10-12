// Actual comment/media/avatar methods with mocked uploads and DOM; no real data writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm')
const babel=require('@babel/core'),compiler=require('vue-template-compiler/build.js')
const root=path.resolve(__dirname,'..'),cache=new Map(),storage=new Map(),uploads=[]
let httpGet=async()=>({data:[]}),upload=async()=>({ok:true,json:async()=>({data:{resource_id:123}})})
const domListeners=new Map(),head=new Set(),body=new Set();let focusRestored=0,container
function node(){return {events:new Map(),addEventListener(name,fn){this.events.set(name,[...(this.events.get(name)||[]),fn])},focus(){}}}
const document={activeElement:{isConnected:true,focus(){focusRestored++}},head:{appendChild:x=>head.add(x),removeChild:x=>assert.equal(head.delete(x),true)},body:{appendChild:x=>body.add(x),removeChild:x=>assert.equal(body.delete(x),true)},addEventListener:(name,fn)=>domListeners.set(name,fn),removeEventListener:(name,fn)=>{if(domListeners.get(name)===fn)domListeners.delete(name)},createElement(tag){if(tag==='style')return{};const elements=new Map();container={querySelector:selector=>{if(!elements.has(selector))elements.set(selector,node());return elements.get(selector)}};return container}}
const Vue={prototype:{},use(plugin){plugin.install(Vue)}}
function load(file){
 if(cache.has(file))return cache.get(file)
 let source=fs.readFileSync(path.join(root,file),'utf8')
 if(file.endsWith('.json'))return JSON.parse(source)
 if(file.endsWith('.vue')){const parsed=compiler.parseComponent(source);assert.deepEqual(compiler.compile(parsed.template.content).errors,[],file);source=parsed.script.content}
 const exports={}
 vm.runInNewContext(babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code,{
  exports,console,document,process:{env:{baseUrl:'https://test.invalid'}},URLSearchParams,Date,
  localStorage:{getItem:k=>storage.get(k)||null},window:{localStorage:{getItem:k=>storage.get(k)||null}},
  FormData:class{append(name,value){this[name]=value}},fetch:(url,options)=>{uploads.push(options.body.file);return upload(url,options)},
  require(spec){if(spec==='vue')return Vue;if(spec==='axios')return{get:(...args)=>httpGet(...args)};if(spec.endsWith('.vue'))return{};let target=spec.startsWith('~/')?spec.slice(2):path.posix.join(path.posix.dirname(file),spec);if(!/\.(js|json)$/.test(target))target+='.js';return load(target)}
 },{filename:file});cache.set(file,exports);return exports
}
function instance(file,props={}){const definition=load(file).default,ctx={$emit(){},$message:{info(){},error(){}},...props};Object.assign(ctx,definition.data?definition.data():{});for(const[name,fn]of Object.entries(definition.methods||{}))ctx[name]=fn.bind(ctx);for(const[name,fn]of Object.entries(definition.computed||{}))Object.defineProperty(ctx,name,{get:()=>fn.call(ctx)});return ctx}
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r});return{promise,resolve}}
async function main(){
 const api=load('common/manga-comment-api.js')
 httpGet=async()=>({data:[{essay_comment_id:1,media_urls:JSON.stringify(['https://image.invalid/a.png','javascript:bad',{}]),replies:[{essay_comment_id:2,media_urls:['https://image.invalid/b.png','data:text/html,bad']}]}]})
 const comments=await api.fetchMangaComments('https://test.invalid',{novelId:7})
 assert.deepEqual(Array.from(comments[0].images),['https://image.invalid/a.png']);assert.deepEqual(Array.from(comments[0].replies[0].images),['https://image.invalid/b.png'])
 upload=async()=>({ok:false,json(){throw Error('must reject failed HTTP before parsing')}});await assert.rejects(api.uploadMangaCommentImage({}),/上传失败/)
 upload=async()=>({ok:true,json:async()=>({data:{}})});await assert.rejects(api.uploadMangaCommentImage({}),/结果无效/)
 console.log('PASS real comment media parses string/array URLs, excludes invalid media and rejects failed/invalid uploads')

 storage.set('token',JSON.stringify({tk:'account-a'}));uploads.length=0
 upload=async()=>({ok:true,json:async()=>({data:{resource_id:123}})})
 const composer=instance('components/manga/MangaCommentComposer.vue',{submitting:false})
 await composer.onPickFiles({target:{files:[1,2,3,4],value:'selected'}});assert.equal(composer.images.length,3);assert.equal(uploads.length,3)
 const pending=deferred();upload=()=>pending.promise;composer.reset()
 const first=composer.onPickFiles({target:{files:[1],value:''}});composer.reset();pending.resolve({ok:true,json:async()=>({data:{resource_id:456}})});await first
 assert.equal(composer.images.length,0);assert.equal(composer.uploading,false)
 const switched=deferred();upload=()=>switched.promise
 const second=composer.onPickFiles({target:{files:[1,2],value:''}});storage.set('token',JSON.stringify({tk:'account-b'}));switched.resolve({ok:true,json:async()=>({data:{resource_id:789}})});await second
 assert.equal(composer.images.length,0);assert.equal(composer.uploading,false)
 let sent=0;composer.$emit=()=>sent++;composer.content='x'.repeat(301);composer.submit();assert.equal(sent,0);composer.content='valid';composer.submit();assert.equal(sent,1)
 console.log('PASS mobile limits (300 characters/3 images), reset/upload race and account switch discard stale images')

 const assets=load('config/reader/avatar-frame-assets.json')
 assert.deepEqual(assets,JSON.parse(fs.readFileSync(path.join(root,'../loghome-app-frontend/common/avatar-frame-assets.json'),'utf8')))
 const avatar=instance('components/read/ReaderAvatar.vue',{src:'',frame:{thumbnail_url:'/static/avatar-frames/thumbnails/01.webp',avatar_scale:.58,offset_x:2,offset_y:-1}})
 assert.equal(avatar.frameSource,assets['/static/avatar-frames/thumbnails/01.webp'].url);assert.ok(Math.abs(parseFloat(avatar.photoStyle.width)-58)<.001);assert.equal(avatar.photoStyle.left,'52%')
 avatar.frameFailed=true;assert.equal(avatar.frameSource,'');assert.equal(avatar.photoStyle.width,'100%')
 avatar.frameFailed=false;avatar.frame={asset_url:'javascript:bad',avatar_scale:999};assert.equal(avatar.frameSource,'');assert.equal(avatar.photoStyle.width,'100%')
 console.log('PASS exact mobile legacy frame mapping, portrait scale/offset and graceful missing/unsafe frame fallback')

 load('plugins/image-preview.js')
 const malicious='https://image.invalid/" onerror="unexpected()'
 Vue.prototype.$preview([malicious],0)
 assert.equal(container.innerHTML.includes(malicious),false);assert.equal(container.querySelector('.image-preview-img').src,malicious)
 assert.equal(body.size,1);assert.equal(domListeners.size,1)
 const button=container.querySelector('.image-preview-close');assert.equal(button.events.get('click').length,1)
 button.events.get('click')[0]();container.closePreview();assert.equal(body.size,0);assert.equal(head.size,0);assert.equal(domListeners.size,0);assert.equal(focusRestored,1)
 Vue.prototype.$preview(['/default-avatar.png'],99);assert.equal(container.querySelector('.image-preview-img').src,'/default-avatar.png');domListeners.get('keydown')({key:'Escape'});assert.equal(body.size,0);assert.equal(domListeners.size,0)
 console.log('PASS preview assigns URLs as DOM properties, single idempotent close, Escape cleanup, bounded index and focus restoration')
}
main().catch(error=>{console.error(error);process.exitCode=1})
