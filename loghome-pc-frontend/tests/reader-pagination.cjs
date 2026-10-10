// Exercise actual reader methods with fragmented text and delayed cloud responses.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm')
const babel = require('@babel/core'), compiler = require('vue-template-compiler/build.js')
const root = path.resolve(__dirname,'..'), cache = new Map(), storage = new Map(), requests = []
let transport = async config => ({data:config.data})
const localStorage = {getItem:key=>storage.get(key)||null}
const document = {createRange(){let node,offset;return {setStart(n,o){node=n;offset=o},setEnd(){},getBoundingClientRect(){return node.rect(offset)}}},querySelector:()=>null}
const window = {getSelection:()=>({toString:()=>''}),scrollBy(){}}
function load(file) {
  if(cache.has(file))return cache.get(file)
  let source = fs.readFileSync(path.join(root,file),'utf8')
  if(file.endsWith('.vue')){const parsed=compiler.parseComponent(source);assert.deepEqual(compiler.compile(parsed.template.content).errors,[],file);source=parsed.script.content}
  const exports={}
  vm.runInNewContext(babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('@babel/plugin-transform-modules-commonjs')]}).code,{exports,localStorage,window,document,process:{env:{baseUrl:'https://test.invalid'}},URLSearchParams,console,cancelAnimationFrame(){},
    require(spec){if(spec==='axios')return{request:config=>{requests.push(config);return transport(config)}};if(spec.endsWith('.vue'))return{};return load(spec.startsWith('~/')?spec.slice(2)+'.js':spec)}},{filename:file})
  cache.set(file,exports);return exports
}
const plain=value=>JSON.parse(JSON.stringify(value)), deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject}}, settle=async()=>{for(let i=0;i<12;i++)await Promise.resolve()}
async function main(){
  const pos=load('utils/reader-position.js')
  assert.deepEqual(plain(pos.normalizeReaderPosition({paragraphId:0,last_paragraph_id:8,pageIndex:0,last_page_idx:3,charOffset:-1})),{paragraphId:0,charOffset:0,pageIndex:0})
  assert.equal(pos.initialReaderPosition({start:'1'},{last_article_id:4,last_paragraph_id:8},4).paragraphId,0)
  assert.equal(pos.initialReaderPosition({pageIdx:'0'},{last_article_id:4,last_paragraph_id:8},4).paragraphId,0)
  assert.equal(pos.initialReaderPosition({paragraphId:'8',charOffset:'17',start:'1'},null,4).charOffset,17)
  assert.equal(pos.initialReaderPosition({}, {last_article_id:5,last_paragraph_id:8},4).paragraphId,0)
  assert.equal(pos.initialReaderPosition({edge:'end'},null,4).pageIndex,Number.MAX_SAFE_INTEGER)
  assert.equal(pos.textReaderResumeUrl({last_article_id:4,last_paragraph_id:8,last_char_offset:17}),'/article/4?resume=1&paragraphId=8&charOffset=17')
  assert.equal(pos.textReaderResumeUrl({last_article_id:4,last_page_idx:0}),'/article/4?resume=1&pageIdx=0')
  assert.equal(pos.pageCount(860,860),1);assert.equal(pos.pageCount(8960,860),10);assert.equal(pos.pageCount(1759.5,860),2)
  assert.equal(pos.pageAtCoordinate(-1697.5,102.5,2,860),0)
  assert.equal(pos.pageAtCoordinate(102.3,102.5,2,860),2)
  console.log('PASS explicit start/cloud zero, stable local resume, chapter end and fractional page geometry')

  const definition=load('components/read/ReaderPager.vue').default, events=[]; let currentIndex=()=>2
  function paragraph(id,length,pageAt){const firstChild={rect:offset=>({left:100+pageAt(offset)*900-currentIndex()*900,top:140,bottom:180})};const text={textContent:'字'.repeat(length),firstChild};return{dataset:{paragraphId:String(id)},querySelector:()=>text,getBoundingClientRect:()=>({top:140,bottom:180}),getClientRects:()=>[{left:100}]}}
  // Paragraph 10 has a padding fragment on page 2, but every glyph ends on page 1.
  const fragments=[paragraph(10,80,()=>1),paragraph(11,1000,offset=>offset<400?1:offset<850?2:3),paragraph(12,40,()=>3)]
  const reader={paged:true,index:2,total:4,width:860,gap:40,navigationBlocked:false,hasPrevious:true,hasNext:true,$refs:{viewport:{scrollLeft:0,getBoundingClientRect:()=>({left:100})},prose:{querySelectorAll:()=>fragments}},$emit:(...args)=>events.push(args),$nextTick:fn=>fn()}
  currentIndex=()=>reader.index
  for(const[key,method]of Object.entries(definition.methods))reader[key]=method.bind(reader)
  assert.deepEqual(plain(reader.capture()),{paragraphId:11,charOffset:400,pageIndex:2})
  reader.goPage(3);assert.deepEqual(plain(reader.position),{paragraphId:11,charOffset:850,pageIndex:3})
  reader.turn(1);assert.deepEqual(events.at(-1),['boundary','next'])
  reader.goPage(0);reader.turn(-1);assert.deepEqual(events.at(-1),['boundary','prev'])
  reader.navigationBlocked=true;const before=events.length;reader.turn(1);assert.equal(events.length,before)
  reader.navigationBlocked=false;let prevented=false
  reader.onKey({key:'PageDown',target:{closest:()=>true},preventDefault(){prevented=true}});assert.equal(prevented,false)
  reader.onKey({key:'PageDown',target:{closest:()=>false},preventDefault(){prevented=true}});assert.equal(prevented,true);assert.equal(reader.index,1)
  console.log('PASS glyph anchors ignore padding fragments, split paragraph offsets, chapter boundaries and keyboard/modal guards')
  const ticks=[]
  reader.mountedReady=true;reader.generation=0;reader.position={paragraphId:0,charOffset:0,pageIndex:0};reader.$nextTick=fn=>ticks.push(fn)
  reader.scheduleLayout({paragraphId:0,charOffset:0,pageIndex:Number.MAX_SAFE_INTEGER});reader.scheduleLayout()
  assert.equal(reader.pendingPosition.pageIndex,Number.MAX_SAFE_INTEGER)
  reader.scheduleLayout({paragraphId:11,charOffset:850});reader.scheduleLayout()
  assert.equal(reader.pendingPosition.paragraphId,11);assert.equal(reader.pendingPosition.charOffset,850)
  // An older restore callback cannot capture/clear the newest pending anchor.
  reader.$refs.prose.querySelector=()=>null;reader.restore({pageIndex:1});reader.generation++
  const latestAnchor=reader.pendingPosition;ticks.at(-1)();assert.equal(reader.pendingPosition,latestAnchor)
  reader.finishRestore({paragraphId:11,charOffset:850,pageIndex:3},fragments[1]);assert.equal(reader.position.charOffset,850);assert.equal(reader.position.paragraphId,11)
  console.log('PASS simultaneous hydration/reflow preserves incoming resume/end requests, stable anchors and ignores stale restore callbacks')


  storage.set('token',JSON.stringify({tk:'account-a'}))
  const reading=load('plugins/api/reading.js'), first=deferred();transport=()=>first.promise
  const older=reading.saveReadingProgress({novel_id:7,article_id:1,page_idx:4}),newer=reading.saveReadingProgress({novel_id:7,article_id:2,page_idx:0})
  await settle();assert.equal(requests.length,1)
  transport=async config=>({data:config.data});first.resolve({data:'ok'});await Promise.all([older,newer]);assert.equal(JSON.parse(requests.at(-1).data).article_id,2)
  const failed=deferred();transport=()=>failed.promise
  const rejected=reading.saveReadingProgress({novel_id:8,article_id:1});const rejection=assert.rejects(rejected,/请求失败/)
  const recovery=reading.saveReadingProgress({novel_id:8,article_id:2});await settle();transport=async()=>({data:'recovered'});failed.reject(Error('offline'));await rejection;assert.equal(await recovery,'recovered')
  const gate=deferred();transport=()=>gate.promise
  const current=reading.saveReadingProgress({novel_id:9,article_id:1}), stale=reading.saveReadingProgress({novel_id:9,article_id:2});await settle();const count=requests.length
  storage.set('token',JSON.stringify({tk:'account-b'}));gate.resolve({data:'ok'});await current;assert.equal(await stale,null);assert.equal(requests.length,count)
  console.log('PASS cloud writes remain ordered, failure does not block later progress, account changes discard queued writes')
}
main().catch(error=>{console.error(error);process.exitCode=1})
