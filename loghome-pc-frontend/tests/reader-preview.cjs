// Local draft previews and frame messages; all audio, storage and APIs are isolated.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),babel=require('@babel/core'),compiler=require('vue-template-compiler/build.js')
const parser=require('@babel/parser'),generate=require('@babel/generator').default
const root=path.resolve(__dirname,'..'),cache=new Map(),records=new Map(),spoken=[],listeners=new Set()
const storage={get length(){return records.size},key:i=>[...records.keys()][i],getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,String(v)),removeItem:k=>records.delete(k)}
const synthesis={getVoices:()=>[],addEventListener(){},removeEventListener(){},cancel(){},speak:value=>spoken.push(value)}
const window={localStorage:storage,speechSynthesis:synthesis,SpeechSynthesisUtterance:class{constructor(text){this.text=text}},addEventListener:(e,f)=>listeners.add(f),removeEventListener:(e,f)=>listeners.delete(f)}
function load(file){if(cache.has(file))return cache.get(file);let source=fs.readFileSync(path.join(root,file),'utf8');if(file.endsWith('.json'))return JSON.parse(source);if(file.endsWith('.vue')){const parsed=compiler.parseComponent(source);assert.deepEqual(compiler.compile(parsed.template.content).errors,[],file);source=parsed.script.content}const exports={};vm.runInNewContext(babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code,{exports,window,localStorage:storage,console,Date,URL,URLSearchParams,AbortController,process:{client:true,server:false,env:{mobileUrl:'https://m.loghome.ink'}},setTimeout,clearTimeout,setInterval:()=>1,clearInterval(){},require(spec){if(spec.endsWith('.vue'))return{};if(spec==='axios')return{};let target=spec.startsWith('~/')?spec.slice(2):path.posix.join(path.posix.dirname(file),spec);if(!/\.(js|json)$/.test(target))target+='.js';return load(target)}},{filename:file});cache.set(file,exports);return exports}
const plain=x=>JSON.parse(JSON.stringify(x)), now=Date.now(),draft={novel:{novel_id:7,name:'未发布'},article:{article_id:11,novel_id:7,article_type:'richtext',title:'未保存的版本',content:[{id:5,type:'text',value:'这段仅存在于草稿。'},{type:'image',value:'https://example.invalid/image.png'}]}}
async function main(){
 const preview=load('utils/reader-preview.js'), env={storage,now,key:'test-key',account:'guest'}
 const key=preview.storeReaderPreview({...draft,version:9,createdAt:0,account:'spoof'},env)
 assert.equal(key,'test-key');assert.equal(preview.readReaderPreview(key,env).article.is_draft,1);assert.equal(preview.readReaderPreview(key,{...env,now:now+24*60*60*1000}).article.title,draft.article.title)
 assert.equal(preview.readReaderPreview(key,{...env,account:'another'}),null);assert.equal(records.size,1)
 assert.equal(preview.readReaderPreview(key,{...env,now:now+24*60*60*1000+1}),null);assert.equal(records.size,0)
 preview.storeReaderPreview(draft,env);assert.equal(preview.readReaderPreview(key,{...env,now:now-60001}),null)
 assert.throws(()=>preview.normalizePreview({...draft,novel:{novel_id:8}}),/不属于/)
 assert.throws(()=>preview.normalizePreview({...draft,article:{...draft.article,article_type:'spliter'}}),/类型/)
 assert.throws(()=>preview.normalizePreview({...draft,article:{...draft.article,content:'x'.repeat(8*1024*1024)}}),/过大/)
 records.set(preview.PREVIEW_PREFIX+'corrupt','{bad');preview.clearExpiredPreviews(storage,now);assert.equal(records.size,0)
 console.log('PASS draft identity, supported types, protected metadata, size limit, 24-hour lifetime, account isolation and corrupt cleanup')

 const frame={},event={source:frame,origin:'https://m.loghome.ink',data:{type:'reader_preview',source:'chapterEditor',data:draft}}
 assert.equal(preview.trustedPreviewMessage(event,frame,'https://m.loghome.ink',7).article.article_id,11)
 assert.equal(preview.trustedPreviewMessage({...event,source:{}},frame,'https://m.loghome.ink',7),null)
 assert.equal(preview.trustedPreviewMessage({...event,origin:'https://evil.invalid'},frame,'https://m.loghome.ink',7),null)
 assert.equal(preview.trustedPreviewMessage(event,frame,'https://m.loghome.ink',8),null)
 const bridge=load('../loghome-app-frontend/common/reader-preview-bridge.js'),messages=[]
 assert.equal(bridge.sendReaderPreview({postMessage:(...args)=>messages.push(args)},{},'https://loghome.ink',draft),true)
 assert.equal(messages[0][1],'https://loghome.ink');assert.equal(bridge.sendReaderPreview({postMessage(){throw Error('must not send')}},{},'https://evil.invalid',draft),false)
 assert.equal(bridge.readerPreviewParentOrigin('https://loghome.ink.evil.invalid'),'')
 const dialog=load('components/read/ReaderPreviewDialog.vue').default,parent={value:true,article:draft.article,novel:draft.novel,$router:{push(){throw Error('must keep editor mounted')}}}
 Object.assign(parent,dialog.data());parent.open=dialog.methods.open.bind(parent);dialog.mounted.call(parent);assert.ok(parent.previewKey);assert.equal(preview.readReaderPreview(parent.previewKey).article.title,draft.article.title)
 const original=parent.previewKey;dialog.watch.value.call(parent,false);assert.equal(parent.previewKey,'');parent.open();assert.ok(parent.previewKey)
 console.log('PASS exact editor window/origin/work validation, explicit parent target and reusable dialog keeps editor route mounted')

 const mobileScript=compiler.parseComponent(fs.readFileSync(path.join(root,'../loghome-app-frontend/pages/writers/chapterEditorNew.vue'),'utf8')).script.content
 const mobileAst=parser.parse(mobileScript,{sourceType:'module'}), mobileMethods=mobileAst.program.body.find(node=>node.type==='ExportDefaultDeclaration').declaration.properties.find(property=>property.key.name==='methods').value.properties
 const mobileCode='(function()'+generate(mobileMethods.find(method=>method.key.name==='openReaderPreview').body).code+')'
 const sent=[],desktopParent={postMessage:(...args)=>sent.push(args)},mobileWindow={parent:desktopParent},closed=[]
 const openMobile=vm.runInNewContext(mobileCode,{window:mobileWindow,sendReaderPreview:bridge.sendReaderPreview,storeReaderPreview(){throw Error('desktop must not use mobile origin storage')},uni:{navigateTo(){throw Error('must not leave editor')}},docToLegacyBlocks:value=>value,stringifyLegacyContent:value=>JSON.stringify(value)})
 openMobile.call({editor:{getJSON:()=>draft.article.content},article:{...draft.article,novel_info:draft.novel},frameInfo:{isEnabled:true,parentOrigin:'https://loghome.ink'},closeFindReplace(){closed.push('find')},closeToolbarPopup(){closed.push('toolbar')}})
 assert.equal(sent.length,1);assert.equal(sent[0][1],'https://loghome.ink');assert.equal(sent[0][0].data.article.content,JSON.stringify(draft.article.content));assert.equal(closed.length,2)
 console.log('PASS actual mobile editor sends its current unsaved content without navigation or a second preview store')
 const nativeScript=compiler.parseComponent(fs.readFileSync(path.join(root,'components/write/WriterWorkspace.vue'),'utf8')).script.content
 const nativeAst=parser.parse(nativeScript,{sourceType:'module'}),nativeMethods=nativeAst.program.body.find(node=>node.type==='ExportDefaultDeclaration').declaration.properties.find(property=>property.key.name==='methods').value.properties
 const nativePreview=vm.runInNewContext('(function()'+generate(nativeMethods.find(method=>method.key.name==='preview').body).code+')',{storeReaderPreview:preview.storeReaderPreview})
 const nativeDraft={article:{...draft.article,content:[{id:5,type:'text',value:'原生编辑器未保存的新版本'}]},novel:draft.novel,workId:7,$message:{error(){throw Error('unexpected')}},$router:{push(){throw Error('must keep editor mounted')}}}
 nativePreview.call(nativeDraft);assert.equal(preview.readReaderPreview(nativeDraft.previewKey).article.content[0].value,'原生编辑器未保存的新版本')
 console.log('PASS current native workspace previews its unsaved bound article without save/publish/navigation')



 const component=load('components/read/ReaderPreview.vue').default,ctx={previewKey:parent.previewKey,$readerAudio:{pause(){}},$refs:{pager:{position:{paragraphId:5},jump(){}}},$api:new Proxy({},{get(){throw Error('draft must not invoke public APIs')}})}
 Object.assign(ctx,component.data());for(const[name,method]of Object.entries(component.methods))ctx[name]=method.bind(ctx)
 component.mounted.call(ctx);assert.equal(ctx.payload.article.title,draft.article.title);assert.equal(ctx.ready,true)
 const before=[...records.keys()];await ctx.listen();assert.equal(ctx.audioState.status,'playing');assert.equal(spoken.at(-1).text,'这段仅存在于草稿。');assert.deepEqual([...records.keys()],before)
 assert.equal(ctx.player.state.chapters.length,1);assert.equal(ctx.player.state.paragraphId,5)
 storage.setItem('token',JSON.stringify({tk:'other-account'}));ctx.validate();assert.equal(ctx.payload,null);assert.equal(ctx.audioState.visible,false);assert.match(ctx.failure,/账号/)
 component.beforeDestroy.call(ctx);assert.equal(listeners.size,0)
 const page=load('pages/read/preview/_key.vue').default;assert.equal(page.head().meta.find(m=>m.name==='robots').content,'noindex,follow')
 console.log('PASS actual preview lifecycle, draft-only narration, no public write/history calls, revocation, cleanup and SSR noindex')
}
main().catch(error=>{console.error(error);process.exitCode=1})
