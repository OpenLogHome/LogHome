// Actual Vue/API methods, isolated transport and identities: no live account writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),babel=require('@babel/core'),compiler=require('vue-template-compiler/build.js')
const root=path.resolve(__dirname,'..'),cache=new Map(),storage=new Map(),calls=[]
const localStorage={getItem:k=>storage.get(k)||null};let request=async()=>({data:{}}),get=async()=>({data:[]}),upload
function load(file){
 if(cache.has(file))return cache.get(file);let source=fs.readFileSync(path.join(root,file),'utf8')
 if(file.endsWith('.json'))return JSON.parse(source)
 if(file.endsWith('.vue')){const p=compiler.parseComponent(source);assert.deepEqual(compiler.compile(p.template.content).errors,[],file);source=p.script.content}
 const exports={};vm.runInNewContext(babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code,{
 exports,process:{client:true,server:false,env:{baseUrl:'https://test.invalid'}},console,URL,URLSearchParams,Date,setTimeout,clearTimeout,localStorage,window:{localStorage,addEventListener(){},removeEventListener(){}},FormData:class{append(){}},fetch:(...a)=>upload(...a),
 require(s){if(s.endsWith('.vue'))return{};if(s==='axios')return{request:async o=>{calls.push(o);return request(o)},get:(...a)=>get(...a)};let f=s.startsWith('~/')?s.slice(2):path.posix.join(path.posix.dirname(file),s);if(!/\.(js|json)$/.test(f))f+='.js';return load(f)}},{filename:file});cache.set(file,exports);return exports
}
function instance(file,props={}){const d=load(file).default,c={$refs:{},$route:{query:{}},$set:(o,k,v)=>o[k]=v,$nextTick:f=>f(),$emit(){},$message:{info(){},error(){},success(){}},$confirm:async()=>{},...props};Object.assign(c,d.data?d.data.call(c):{});for(const[k,f]of Object.entries(d.methods||{}))c[k]=f.bind(c);for(const[k,f]of Object.entries(d.computed||{}))Object.defineProperty(c,k,{get:()=>f.call(c)});return c}
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return{promise,resolve}},account=(tk='a',id=7)=>storage.set('token',JSON.stringify({tk,id})),row=(id=1)=>({sticker_id:id,url:`https://image.invalid/${id}.png`,user_id:7,is_private:0,is_favorite:0}),comment=()=>({essay_comment_id:10,novel_id:7,article_id:3,content:'root',name:'A',replies:[],cento:{paragraph_id:2,paragraph:'excerpt'}})
async function main(){
 const api=load('utils/reader-stickers.js');account()
 for(const url of ['javascript:bad','data:image/png,x','https://user:pass@host/a','/relative'])assert.equal(api.stickerUrl(url),'')
 assert.equal(api.readerSticker({...row(),sticker_id:-1}),null)
 request=async()=>({data:{stickers:[row(),{...row(2),is_private:'1',is_favorite:true},{...row(3),url:'javascript:bad'}],pagination:{pages:3,total:41}}})
 const list=await api.fetchReaderStickers({category:'my',page:2});assert.equal(list.items.length,2);assert.equal(list.items[1].is_private,true);assert.equal(list.pages,3);assert.equal(calls.at(-1).params.limit,20);assert.equal(calls.at(-1).headers.Authorization,'Bearer a')
 await api.favoriteReaderSticker(1,true,'a');assert.equal(calls.at(-1).method,'POST');assert.equal(calls.at(-1).data.sticker_id,1)
 await api.privacyReaderSticker(1,true,'a');assert.equal(calls.at(-1).method,'PUT');assert.equal(calls.at(-1).data.is_private,true)
 await api.deleteReaderSticker(1,'a');assert.equal(calls.at(-1).method,'DELETE')
 const before=calls.length;account('b');await assert.rejects(api.favoriteReaderSticker(1,true,'a'),/账号已变化/);assert.equal(calls.length,before)
 account();const lookup=deferred();request=()=>lookup.promise;const save=api.saveImageAsReaderSticker(row().url,'a');account('b');lookup.resolve({data:{stickers:[]}});await assert.rejects(save,/账号已变化/);assert.equal(calls.length,before+1)
 account();request=async o=>o.method==='GET'?{data:{stickers:[{...row(),is_favorite:true}]}}:{data:{}};let start=calls.length;await api.saveImageAsReaderSticker(row().url,'a');assert.equal(calls.length,start+1)
 request=async o=>o.method==='GET'?{data:{stickers:[]}}:o.url.endsWith('/favorites')?{data:{}}:{data:row(44)};start=calls.length;await api.saveImageAsReaderSticker(row().url,'a');assert.equal(calls.length,start+3);assert.equal(calls.at(-1).data.sticker_id,44)
 console.log('PASS sticker HTTP contracts, URL validation, reuse/create+favorite, account changes prevent subsequent writes')
 const picker=instance('components/read/ReaderEmojiPicker.vue');picker.open();picker.tab='sticker';const pending=deferred();request=()=>pending.promise
 const stale=picker.load(1);picker.changeTab('emoji');pending.resolve({data:{stickers:[row()],pagination:{pages:2}}});await stale;assert.equal(picker.items.length,0);assert.equal(picker.loading,false);picker.uploadVisible=true;picker.uploadUrl='stale';load('components/read/ReaderEmojiPicker.vue').default.watch.visible.call(picker,false);assert.equal(picker.uploadVisible,false);assert.equal(picker.uploadUrl,'')
 picker.tab='sticker';request=async()=>({data:{stickers:[row()],pagination:{pages:3}}});await picker.load(1)
 request=async()=>{throw Error('network')};await picker.load(2);assert.equal(picker.page,1);assert.equal(picker.failedPage,2);assert.equal(picker.items.length,1);assert.ok(picker.error)
 request=async()=>({data:{stickers:[row(),row(2)],pagination:{pages:3}}});await picker.load(picker.failedPage);assert.equal(picker.page,2);assert.equal(picker.items.length,2)
 const fav=deferred();request=()=>fav.promise;const late=picker.favorite(picker.items[0]);picker.changeTab('emoji');fav.resolve({data:{}});await late;assert.equal(picker.pending[1],false)
 picker.items=[row()];const confirm=deferred();picker.$confirm=()=>confirm.promise;const confirming=picker.command('delete',picker.items[0]);start=calls.length;account('b');confirm.resolve();await confirming;assert.equal(calls.length,start);picker.checkAccount();assert.equal(picker.items.length,0)
 picker.openUpload();const image=deferred();upload=()=>image.promise;const uploading=picker.chooseFile({target:{files:[{type:'image/png',size:10}],value:'x'}});load('components/read/ReaderEmojiPicker.vue').default.watch.uploadVisible.call(picker,false);image.resolve({ok:true,json:async()=>({data:{resource_id:99}})});await uploading;assert.equal(picker.uploadUrl,'');assert.equal(picker.uploading,false)
 let uploaded=0;upload=async()=>{uploaded++;return{ok:true,json:async()=>({data:{resource_id:99}})}};await picker.chooseFile({target:{files:[{type:'image/png',size:11*1024*1024}],value:'x'}});assert.equal(uploaded,0);assert.match(picker.uploadError,/10MB/)
 console.log('PASS picker stale loads, paging retry/dedup, lock release, confirmation/account and delayed-upload cancellation')
 const mobile=fs.readFileSync(path.join(root,'../loghome-app-frontend/components/emoji-picker/emoji-picker.vue'),'utf8'),match=mobile.match(/emojiList:\s*(\[[\s\S]*?\])/);assert.ok(match);assert.equal(JSON.stringify(load('config/reader/emojis.json')),JSON.stringify(vm.runInNewContext(match[1])))
 const composer=instance('components/manga/MangaCommentComposer.vue',{submitting:false});let caret;composer.$refs.input={selectionStart:1,selectionEnd:3,focus(){},setSelectionRange(a,b){caret=[a,b]}};composer.content='abcd';composer.appendEmoji({type:'emoji',content:'😀'});assert.equal(composer.content,'a😀d');assert.deepEqual(caret,[3,3])
 composer.content='x'.repeat(300);composer.$refs.input.selectionStart=300;composer.$refs.input.selectionEnd=300;composer.appendEmoji({type:'emoji',content:'😀'});assert.equal(composer.content.length,300)
 for(let i=0;i<4;i++)composer.appendEmoji({type:'sticker',content:row(i+1).url});assert.equal(composer.images.length,3);storage.delete('token');composer.images=[];composer.appendEmoji({type:'sticker',content:row().url});assert.equal(composer.images.length,0)
 console.log('PASS exact mobile Emoji catalogue, selected-text/caret insertion and shared 300-character/3-image/auth limits')
 const links=load('utils/reader-comment-links.js')
 assert.equal(links.readingMessageTarget('/pages/readers/bookInfo?id=7&preLoadCommentId=11').path,'/read/comment/11?novelId=7')
 assert.equal(links.readingMessageTarget('#/pages/readers/newReader/article?preLoadCommentId=11&id=3&novelId=7').path,'/read/comment/11?novelId=7')
 assert.equal(links.readingMessageTarget('readers/mangaReader?id=3&comment_id=11').path,'/read/comment/11')
 for(const s of ['https://outside.invalid','//readers/bookInfo?id=7','javascript:bad','readers\\bookInfo?id=7','readers/bookInfo?id=NaN'])assert.equal(links.readingMessageTarget(s),null)
 const c={novelId:7,articleId:3,paragraphId:2,commentId:10}
 assert.equal(links.readingCommentTarget(c,{novel_id:7,novel_type:'novel'},11),'/article/3?preLoadCommentId=11&paragraphId=2')
 assert.equal(links.readingCommentTarget(c,{novel_id:7,novel_type:'manga'},11),'/manga/read/3?novelId=7&preLoadCommentId=11')
 assert.equal(links.readingCommentTarget({...c,articleId:0},{novel_id:7,novel_type:'world'},11),'/world/7?preLoadCommentId=11');assert.equal(links.readingCommentTarget(c,{novel_id:8},11),'')
 console.log('PASS mobile route aliases, query order, reply anchors, work/chapter IDs and unsafe route rejection')
 const commentsApi=load('common/manga-comment-api.js');let requestedRoot
 get=async(url,o)=>url.endsWith('novel_comment_from_comment_id')?{data:[comment()]}:url.endsWith('novel_commonts_reply_to')?(requestedRoot=o.params.id,{data:[{essay_comment_id:11,reply_to_id:10,content:'reply'}]}):{data:[]}
 const resolved=await commentsApi.fetchMangaCommentById('https://test.invalid',11);assert.equal(requestedRoot,10);assert.equal(resolved.paragraphId,2);assert.equal(resolved.replies[0].commentId,11)
 const nav=load('pages/read/comment/_id.vue').default,context={params:{id:'11'},query:{novelId:'7'},$api:{reader:{book:async()=>[{novel_id:7,novel_type:'novel'}]}},error:e=>({error:e}),redirect:(code,path)=>({code,path})}
 assert.equal((await nav.asyncData(context)).path,'/article/3?preLoadCommentId=11&paragraphId=2');assert.equal((await nav.asyncData({...context,query:{novelId:'8'}})).error.statusCode,404);assert.equal((await nav.asyncData({...context,params:{id:'bad'}})).error.statusCode,404);assert.equal((await nav.asyncData({...context,$api:{reader:{book:async()=>[]}}})).error.statusCode,404)
 get=async()=>{const e=Error('failed');e.response={status:503};throw e};assert.equal((await nav.asyncData(context)).error.statusCode,503)
 const novelPage=load('pages/novel/_id.vue').default;for(const kind of ['world','manga']){const redirect=await novelPage.asyncData({params:{id:'7'},query:{comment_id:'11'},$api:{reader:{book:async()=>[{novel_id:7,novel_type:kind}]}},redirect:path=>path});assert.equal(redirect,`/${kind}/7?preLoadCommentId=11`)}
 const articlePage=load('pages/article/_id.vue').default,articleContext={commentAnchor:11,$route:{query:{paragraphId:'2'}},paragraphs:[{id:2,value:'target paragraph'}],showCommentDrawer:false};articlePage.methods.openNotificationComment.call(articleContext);assert.equal(articleContext.currentParagraphId,2);assert.equal(articleContext.showCommentDrawer,true)
 assert.equal(load('utils/reading-seo.js').publicReadingPath('/read/comment/11'),true)
 console.log('PASS resolved-root reply request, typed legacy redirects and paragraph drawer; SSR visibility/routing, 404/503')
 const ticks=[];let scrolled=0,anchorRequests=0;const panel=instance('components/manga/MangaCommentPanel.vue',{novelId:7,articleId:3,paragraphId:2,anchorId:11,visible:true,$nextTick:f=>ticks.push(f)})
 panel.$refs.scroll={querySelector:s=>{assert.equal(s,'[data-comment-id="11"]');return{scrollIntoView(){scrolled++}}}}
 get=async url=>url.endsWith('novel_commonts_all_fast')?{data:[comment()]}:url.endsWith('novel_comment_from_comment_id')?(anchorRequests++,{data:[comment()]}):url.endsWith('novel_commonts_reply_to')?{data:[{essay_comment_id:11,reply_to_id:10}]}:{data:[]}
 await panel.load(1);assert.equal(panel.comments.length,1);assert.equal(panel.comments[0].replies[0].commentId,11);ticks.pop()();assert.equal(scrolled,1);assert.equal(anchorRequests,1)
 await panel.load(1);panel.paragraphId=3;ticks.pop()();assert.equal(scrolled,1)
 get=async url=>url.endsWith('novel_commonts_all_fast')?{data:[]}:url.endsWith('novel_comment_from_comment_id')?{data:[{...comment(),novel_id:8}]}:{data:[]};await panel.load(1);assert.equal(panel.comments.length,0)
 for(const file of ['pages/novel/_id.vue','pages/manga/_id.vue','pages/world/_id.vue']){const d=instance(file);d.$route.query={comment_id:'11'};assert.equal(d.commentAnchor,11);load(file).default.watch.commentAnchor.call(d,11);assert.equal(d.activeTab,'comments')}
 console.log('PASS reply hydration deduplicates root, foreign scope rejection, stale scroll, all three detail types anchor comments')
}
main().catch(e=>{console.error(e);process.exitCode=1})
