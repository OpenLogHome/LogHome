// Actual Vue methods and stream transport, isolated storage and no paid AI calls.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),babel=require('@babel/core'),compiler=require('vue-template-compiler/build.js')
const root=path.resolve(__dirname,'..'),cache=new Map(),storage=new Map(),requests=[]
let failStorage=false,transport=async()=>{throw Error('unexpected request')}
const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>{if(failStorage)throw Error('quota');storage.set(key,value)}}
function load(file){
 if(cache.has(file))return cache.get(file)
 let source=fs.readFileSync(path.join(root,file),'utf8')
 if(file.endsWith('.vue')){const c=compiler.parseComponent(source);assert.deepEqual(compiler.compile(c.template.content).errors,[],file);source=c.script.content}
 const exports={}
 vm.runInNewContext(babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code,{
 exports,console,Date,Math,Map,URL,URLSearchParams,Event,AbortController,TextDecoder,atob,setTimeout,clearTimeout,setInterval,clearInterval,
 process:{env:{baseUrl:'https://api.test.invalid',readerAiUrl:'https://ai.test.invalid'}},localStorage,
 window:{addEventListener(){},removeEventListener(){},dispatchEvent(){}},document:{hidden:false,addEventListener(){},removeEventListener(){}},navigator:{clipboard:{writeText:async()=>{}}},
 fetch:(...args)=>{requests.push(args);return transport(...args)},require(spec){
 if(spec.endsWith('.vue'))return {};if(spec==='axios')return {request:async()=>({data:[]})}
 let target=spec.startsWith('~/')?spec.slice(2):path.posix.join(path.posix.dirname(file),spec);if(!target.endsWith('.js'))target+='.js';return load(target)
 }},{filename:file});cache.set(file,exports);return exports
}
const plain=x=>JSON.parse(JSON.stringify(x)),book={novel_id:7,name:'测试故事',novel_type:'novel'}
function login(token='account-a'){if(token)storage.set('token',JSON.stringify({tk:token}));else storage.delete('token')}
function deferred(){let resolve;const promise=new Promise(a=>resolve=a);return {promise,resolve}}
const ai=load('utils/reader-ai.js'),markdown=load('utils/reader-ai-markdown.js'),definition=load('components/read/ReaderAiWorkspace.vue').default
function workspace(){const session=ai.aiSession(book),routes=[]
 const state={...definition.data(),ready:true,accountToken:'account-a',book,sessions:[session],selectedId:session.id,$api:{reader:{book:async()=>[book]}},$route:{query:{}},$router:{push:route=>routes.push(route)},$refs:{draft:{focus(){}},messages:{scrollTop:0,scrollHeight:500,clientHeight:200}},$nextTick:cb=>cb(),$confirm:async()=>{},$message:{success(){}}}
 for(const [name,method]of Object.entries(definition.methods))state[name]=method.bind(state)
 for(const [name,computed]of Object.entries(definition.computed))Object.defineProperty(state,name,{get:()=>computed.call(state)})
 state.loadIndex=async()=>{};return {state,session,routes}
}
function stream(events,size=7){const bytes=new TextEncoder().encode(events.map(JSON.stringify).join('\n')),chunks=[];for(let o=0;o<bytes.length;o+=size)chunks.push(bytes.slice(o,o+size));let i=0
 return {ok:true,body:{getReader:()=>({read:async()=>i<chunks.length?{value:chunks[i++],done:false}:{done:true},cancel:async()=>{},releaseLock(){}})}}}
async function main(){
 login();const jwt=id=>'test.'+Buffer.from(JSON.stringify({id})).toString('base64url')+'.signature'
 assert.equal(ai.aiStorageKey(jwt(7)),ai.aiStorageKey(jwt(7)+'-rotated'));assert.notEqual(ai.aiStorageKey(jwt(7)),ai.aiStorageKey(jwt(8)))
 const session=ai.aiSession(book);session.mode='deep';session.messages.push(ai.aiMessage('user','这是[[cite:a11p3]]什么？'));const answer=ai.aiMessage('assistant');session.messages.push(answer);session.pendingTask=ai.createAiTask(session,answer)
 const input=plain(ai.aiPayload(session)),taskId=session.pendingTask.id
 ai.applyAiEvent(session,{type:'task',created:true,task_id:taskId});ai.applyAiEvent(session,{type:'delta',event_id:1,content:'哈'});ai.applyAiEvent(session,{type:'delta',event_id:2,content:'哈'});assert.equal(answer.content,'哈哈')
 assert.equal(ai.applyAiEvent(session,{type:'delta',event_id:2,content:'重复'}),false);assert.equal(ai.applyAiEvent(session,{type:'delta',event_id:3,task_id:'other',content:'串流'}),false)
 ai.applyAiEvent(session,{type:'active_novel',event_id:3,novel_id:19,novel_name:'临时作品'});ai.applyAiEvent(session,{type:'context_usage',event_id:4,used_tokens:160000,limit_tokens:200000,compressed_count:1})
 const resumed=plain(ai.aiPayload(session));assert.equal(resumed.active_novel_id,input.active_novel_id);assert.deepEqual(resumed.messages,input.messages);assert.equal(resumed.retriever_mode,'deep');assert.equal(resumed.resume_from_event_id,4);assert.equal(session.activeNovel.novelId,19);assert.equal(session.context.percent,80)
 ai.saveAiHistory('account-a',[session]);const restored=ai.loadAiHistory('account-a')[0];assert.equal(restored.messages.at(-1).content,'哈哈');assert.equal(restored.pendingTask.id,taskId);assert.deepEqual(plain(ai.aiPayload(restored)),resumed);assert.equal(ai.loadAiHistory('account-b').length,0);assert.ok(!ai.aiStorageKey('account-a').includes('account-a'))
 ai.applyAiEvent(restored,{type:'task',created:true,task_id:taskId});assert.equal(restored.messages.at(-1).content,'');assert.equal(restored.pendingTask.cursor,0);ai.applyAiEvent(restored,{type:'delta',event_id:1,content:'重启后'});ai.applyAiEvent(restored,{type:'done',event_id:2});assert.equal(restored.pendingTask,null);assert.equal(restored.messages.at(-1).content,'重启后')
 console.log('PASS state machine: repeated fragments, cursor dedupe, foreign task, immutable input, reload/account isolation and server restart')
 const events=[{type:'thinking_delta',event_id:1,delta:{text:'分析中文'}},{type:'thinking_done',event_id:2},{type:'citations',event_id:3,items:[{citation_id:'a11p3',article_id:11,paragraph_id:3,title:'章节',snippet:'原文'}]},{type:'delta',event_id:4,content:'答案中文[[cite:a11p3]]'},{type:'done',event_id:5}]
 const chat=ai.aiSession(book);chat.messages.push(ai.aiMessage('user','问题'));const response=ai.aiMessage('assistant');chat.messages.push(response);chat.pendingTask=ai.createAiTask(chat,response);transport=async()=>stream(events,1)
 await ai.streamReaderAi(ai.aiPayload(chat),{token:'account-a',onEvent:event=>ai.applyAiEvent(chat,event)})
 const [url,options]=requests.at(-1);assert.equal(url,'https://ai.test.invalid/library/reader_novel_ai_chat_stream');assert.equal(options.headers.Authorization,'Bearer account-a');assert.equal(JSON.parse(options.body).retriever_mode,'fast');assert.equal(response.content,'答案中文[[cite:a11p3]]');assert.deepEqual(plain(response.thinkingSteps),['分析中文']);assert.equal(ai.aiCitationUrl(response.citations[0]),'/article/11?paragraphId=3');assert.equal(chat.pendingTask,null)
 const html=markdown.renderAiMarkdown(response);assert.match(html,/href="\/article\/11\?paragraphId=3"/);assert.match(html,/\[1\]/)
 const safe=markdown.renderAiMarkdown({...response,content:'<img src=x onerror=alert(1)>\n**粗体**\n\n| 列一 | 列二 |\n| --- | --- |\n| 内容 | 中文 |\n\n[链接](https://example.invalid/?q="oops) `[[cite:a11p3]]` [[cite:a11p3]] [不安全](javascript:alert(1))'})
 assert.ok(!safe.includes('<img'));assert.ok(!safe.includes('href="javascript:'));assert.match(safe,/<table /);assert.match(safe,/<strong>粗体/);assert.match(safe,/q=&quot;oops/);assert.match(safe,/<code[^>]*>\[\[cite:a11p3\]\]<\/code>/)
 assert.ok(!markdown.renderAiMarkdown({...response,content:'[链接](https://example.invalid/[[cite:a11p3]])'}).includes('class="ai-citation"'))
 console.log('PASS UTF-8 NDJSON and final line, thoughts/citations, safe Markdown/table/code and native paragraph link')
 transport=async()=>({ok:false,status:403,json:async()=>({msg:'作者禁用',code:'READER_AI_DISABLED'})});await assert.rejects(ai.streamReaderAi(input,{token:'account-a',onEvent(){}}),e=>e.code==='READER_AI_DISABLED'&&e.status===403)
 const before=requests.length;login(null);await assert.rejects(ai.streamReaderAi(input,{onEvent(){}}),/登录/);assert.equal(requests.length,before);login();ai.setReaderAiDisabled(true);await assert.rejects(ai.streamReaderAi(input,{onEvent(){}}),/关闭/);assert.equal(requests.length,before);ai.setReaderAiDisabled(false)
 transport=async()=>({ok:true,json:async()=>({data:{total_chapters:20,indexed_summary_chapters:8,pending_summary_chapters:12}})});assert.equal((await ai.fetchAiIndex(7)).percent,40);assert.match(requests.at(-1)[0],/https:\/\/ai.test.invalid\/library\/reader_novel_summary/)
 console.log('PASS independent AI endpoint, guest/preference/author denial, error codes and index status')
 const {state:page,session:current}=workspace();transport=async()=>stream([{type:'delta',event_id:1,content:'回答'}]);current.draft='问题';await page.submit();assert.match(page.error,/未完成/);assert.equal(page.busy,false);assert.ok(current.pendingTask)
 page.pause(true);assert.equal(current.pendingTask.status,'paused');assert.equal(ai.loadAiHistory('account-a')[0].pendingTask.status,'paused')
 const first=JSON.parse(requests.at(-1)[1].body);transport=async()=>stream([{type:'task',created:false},{type:'delta',event_id:2,content:'继续'},{type:'done',event_id:3}]);await page.receive();const second=JSON.parse(requests.at(-1)[1].body);assert.equal(second.task_id,first.task_id);assert.equal(second.resume_from_event_id,1);assert.deepEqual(second.messages,first.messages);assert.equal(current.messages.at(-1).content,'回答继续');assert.equal(current.pendingTask,null)
 await page.rollback(current.messages[0]);assert.equal(current.messages.length,0);assert.equal(current.draft,'问题');current.messages.push(ai.aiMessage('user','待删除'));await page.deleteMessage(current.messages[0]);assert.equal(current.messages.length,0)
 page.sessions.push(ai.aiSession({novel_id:9,name:'另一作品'}));page.keyword='另一作品';assert.equal(page.historyGroups[0].id,9);page.keyword='';page.newSession();page.selectSession(current);assert.equal(ai.loadAiHistory('account-a').find(x=>x.chosen&&x.novelId===7).id,current.id);await page.clearHistory();assert.equal(page.sessions.length,1);assert.equal(page.session.title,'新会话')
 console.log('PASS actual desktop submit/resume, EOF, same task/input, rollback/delete, history search and clear')
 const {state:quota,session:qs}=workspace();qs.draft='不能保存';failStorage=true;const start=requests.length;await quota.submit();assert.equal(requests.length,start);assert.match(quota.storageError,/未能保存/);assert.ok(qs.pendingTask);failStorage=false
 const {state:late,session:ls}=workspace(),bookRequest=deferred();late.$api.reader.book=()=>bookRequest.promise;ls.draft='旧账号内容';const receiving=late.submit();login('account-b');late.syncIdentity();bookRequest.resolve([book]);await receiving;assert.equal(late.busy,false);assert.equal(late.accountToken,'account-b');assert.equal(late.session.messages.length,0);assert.equal(requests.length,start)
 login();const {state:permission,session:ps}=workspace();permission.$api.reader.book=async()=>[{...book,disable_reader_ai:1}];ps.draft='禁用作品';await permission.submit();assert.equal(permission.authorDisabled,true);assert.equal(requests.length,start)
 const {state:confirmed,session:cs}=workspace(),dialog=deferred();confirmed.$confirm=()=>dialog.promise;const removal=confirmed.deleteSession(cs);login('account-b');dialog.resolve();await removal;assert.ok(confirmed.sessions.includes(cs));login()
 const {state:expired}=workspace();expired.loadIndex=definition.methods.loadIndex.bind(expired);transport=async()=>({ok:false,status:401,json:async()=>({msg:'登录已失效'})});await expired.loadIndex();assert.equal(expired.authExpired,true);assert.equal(expired.valid(),false);assert.equal(expired.indexLoading,false)
 console.log('PASS durable task before paid request, late account switch, live author setting and account change during confirmation')
 const pd=load('pages/read/ask/_id.vue').default,context={params:{id:'7'},$api:{reader:{book:async()=>[book]}},error:x=>({error:x}),redirect:x=>({redirect:x})};assert.equal((await pd.asyncData(context)).book.name,book.name);const head=pd.head.call({book});assert.equal(head.meta.find(x=>x.name==='robots').content,'noindex,follow');assert.equal(head.link[0].href,'https://loghome.ink/read/ask/7');assert.equal(load('utils/reading-seo.js').publicReadingPath('/read/ask/7'),true)
 context.params.id='bad';assert.equal((await pd.asyncData(context)).error.statusCode,404);context.params.id='7';context.$api.reader.book=async()=>[];assert.equal((await pd.asyncData(context)).error.statusCode,404);context.$api.reader.book=async()=>[{...book,novel_type:'manga'}];assert.equal((await pd.asyncData(context)).redirect,'/manga/7');context.$api.reader.book=async()=>{throw Error('outage')};assert.equal((await pd.asyncData(context)).error.statusCode,503)
 for(const file of ['components/read/ReaderAiEntry.vue','components/read/ReaderAiPreference.vue','pages/me/settings.vue'])load(file)
 console.log('PASS actual SSR loader, noindex/canonical, mobile routing, 404/503 and preference/entry compilation')
 for(const state of [page,quota,late,permission,confirmed,expired])state.pause()
}
main().catch(error=>{console.error(error);process.exitCode=1})
