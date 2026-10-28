const ids = ['warm-gentleman', 'sunny-boy', 'youthful-goddess', 'soft-girl']
const settle = async () => { for (let i = 0; i < 40; i++) await Promise.resolve() }
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b }); return {promise,resolve,reject} }
function fixture() {
 const f = { login:'a', time:1000, media:[], speeches:[], sessions:[], urls:new Map(), revoked:[], timers:new Map(), nextTimer:0 }
 class Audio {
  constructor(){this.paused=true;this.ended=false;this.currentTime=0;this.duration=30;this.metadataLoaded=false;f.media.push(this)}
  play(){this.paused=false;this.ended=false;if(!this.metadataLoaded){this.metadataLoaded=true;if(this.onloadedmetadata)this.onloadedmetadata()}if(this.onplaying)this.onplaying();return Promise.resolve()}
  pause(){const was=this.paused;this.paused=true;if(!was&&this.onpause)this.onpause()}
  removeAttribute(){this.src='';this.metadataLoaded=false} load(){}
  tick(seconds){this.currentTime=seconds;if(this.ontimeupdate)this.ontimeupdate()}
  end(){this.currentTime=this.duration;this.ended=true;this.paused=true;if(this.onended)this.onended()}
 }
 f.Audio=Audio
 f.session=async token=>{
  f.sessions.push(token)
  let uid=token.startsWith('b')?202:101
  try{uid=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString()).user_id||uid}catch(_){}
  return{user_id:uid,token:'sk-tts-user-'+uid,voices:ids.map(id=>({id,voice_id:'voice-'+id}))}
 }
 f.speech=async request=>{f.speeches.push(request);if(request.signal?.aborted)throw Object.assign(Error('aborted'),{name:'AbortError'});return{size:100,type:'audio/mpeg',input:request.input,voice:request.voice}}
 f.article=async id=>[article(id)]
 f.env={createAudio:()=>new Audio(),session:token=>f.session(token),speech:value=>f.speech(value),article:id=>f.article(id),token:()=>f.login,now:()=>f.time,
  createObjectURL:blob=>{const url='blob:test-'+(f.urls.size+f.revoked.length+1);f.urls.set(url,blob);return url},revokeObjectURL:url=>{f.revoked.push(url);f.urls.delete(url)},
  setTimeout:(fn,ms)=>{const id=++f.nextTimer;f.timers.set(id,{fn,ms});return id},clearTimeout:id=>f.timers.delete(id)}
 return f
}
const article=(id=11,bookId=7)=>({article_id:id,novel_id:bookId,title:'Chapter '+id,article_type:'richtext',content:[1,2,3,4,5,6].map(id=>({id,type:'text',value:id===1?'第一段😀。'.repeat(80):`第${id}段故事。`}))})
module.exports={fixture,settle,deferred,article,book:{novel_id:7,name:'Book',picUrl:'https://example.test/cover.jpg'},chapters:[{article_id:11,title:'11'},{article_id:12,title:'12'}]}
