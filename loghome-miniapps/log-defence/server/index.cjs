const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const net=require('node:net');
const {JsonStore,HttpError}=require('./store.cjs');
// 偷取玩法复用前端 village-data 的囤积上限公式（Node 22+ require(esm)）
const {collectCap,BUILDING_MAP}=require('../src/game/village-data.js');
const STEAL_DAILY_LIMIT=3;
// 好友关系存储（data/friends.json）：links=[[a,b],...] 双向好友对，reqs=[{from,to,name,at}] 待处理申请，names=玩家名快照，steals=每日偷取计数
class SocialStore {
 constructor(file){this.file=path.resolve(file);this.queue=Promise.resolve();}
 _load(){return fs.readFile(this.file,'utf8').then(t=>{const v=JSON.parse(t);return{
  links:Array.isArray(v.links)?v.links.filter(p=>Array.isArray(p)&&p.length===2&&Number.isSafeInteger(p[0])&&Number.isSafeInteger(p[1])&&p[0]!==p[1]):[],
  reqs:Array.isArray(v.reqs)?v.reqs.filter(r=>r&&Number.isSafeInteger(r.from)&&Number.isSafeInteger(r.to)&&r.from!==r.to):[],
  names:(v.names&&typeof v.names==='object'&&!Array.isArray(v.names))?v.names:{},
  steals:(v.steals&&typeof v.steals==='object'&&!Array.isArray(v.steals))?v.steals:{}
 }}).catch(()=>({links:[],reqs:[],names:{},steals:{}}))}
 _save(d){const tmp=this.file+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';return fs.mkdir(path.dirname(this.file),{recursive:true,mode:0o700}).then(()=>fs.open(tmp,'wx',0o600)).then(async h=>{try{await h.writeFile(JSON.stringify(d));await h.sync();}finally{await h.close();}}).then(()=>fs.rename(tmp,this.file)).finally(()=>fs.rm(tmp,{force:true}))}
 // mutate(fn)：fn 返回 undefined 表示只读；读到旧格式数据时 _load 已静默归一
 mutate(fn){const task=this.queue.then(()=>this._load()).then(d=>Promise.resolve(fn(d)).then(out=>out===undefined?d:this._save(out).then(()=>out)));this.queue=task.catch(()=>{});return task;}
}
// 邮箱存储（data/mail.json）：seq=id 发号器，broadcasts=系统公告（全员），boxes=个人邮件（可带物资附件），reads=各用户公告已读 id
class MailStore {
 constructor(file){this.file=path.resolve(file);this.queue=Promise.resolve();}
 _load(){return fs.readFile(this.file,'utf8').then(t=>{const v=JSON.parse(t);return{
  seq:Number.isSafeInteger(v.seq)?v.seq:0,
  broadcasts:Array.isArray(v.broadcasts)?v.broadcasts.filter(b=>b&&Number.isSafeInteger(b.id)&&typeof b.title==='string'&&typeof b.content==='string'):[],
  boxes:(v.boxes&&typeof v.boxes==='object'&&!Array.isArray(v.boxes))?v.boxes:{},
  reads:(v.reads&&typeof v.reads==='object'&&!Array.isArray(v.reads))?v.reads:{}
 }}).catch(()=>({seq:0,broadcasts:[],boxes:{},reads:{}}))}
 _save(d){const tmp=this.file+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';return fs.mkdir(path.dirname(this.file),{recursive:true,mode:0o700}).then(()=>fs.open(tmp,'wx',0o600)).then(async h=>{try{await h.writeFile(JSON.stringify(d));await h.sync();}finally{await h.close();}}).then(()=>fs.rename(tmp,this.file)).finally(()=>fs.rm(tmp,{force:true}))}
 mutate(fn){const task=this.queue.then(()=>this._load()).then(d=>Promise.resolve(fn(d)).then(out=>out===undefined?d:this._save(out).then(()=>out)));this.queue=task.catch(()=>{});return task;}
}
async function authorizeWithLoghome(ticket, baseUrl, options={}) {
 let base;try{base=new URL(baseUrl);}catch{throw new HttpError(503,'原木鉴权服务地址配置错误');}if(!['https:','http:'].includes(base.protocol)) throw new HttpError(503,'原木鉴权服务地址配置错误');
 const requestFetch=options.fetch||fetch;
 async function request(route,stage,requestOptions={}) {
  for(let attempt=0;attempt<2;attempt++) {
   let response;
   try {response=await requestFetch(new URL(route,base),{...requestOptions,redirect:'error',signal:AbortSignal.timeout(options.timeoutMs||10000)});}
   catch(error) {
    if(attempt===0)continue;
    const timeout=['TimeoutError','AbortError'].includes(error.name);
    const failure=new HttpError(timeout?504:502,timeout?'原木账号验证超时，请重新加载重试':'无法连接原木鉴权服务，请检查游戏服务器网络和 LOGHOME_API_URL');
    failure.diagnostic={stage,code:error.cause?.code||error.name};throw failure;
   }
   if(!response.ok) {
    if(response.status>=500&&attempt===0){await response.body?.cancel();continue;}
    const failure=new HttpError([400,401,403].includes(response.status)?401:502,[400,401,403].includes(response.status)?'原木登录票据无效或已过期，请重新加载':'原木鉴权服务暂不可用，请稍后重新加载');
    failure.diagnostic={stage,upstreamStatus:response.status};throw failure;
   }
   try {return await response.json();}
   catch {const failure=new HttpError(502,'原木鉴权服务返回了无效数据，请检查 LOGHOME_API_URL');failure.diagnostic={stage,code:'INVALID_JSON'};throw failure;}
  }
 }
 const exchange=await request('/users/token_by_cross_site?token='+encodeURIComponent(ticket),'exchange');
 const token=exchange?.token?.tk;if(!token) throw new HttpError(401,'原木登录票据无效或已过期，请重新加载');
 const profile=await request('/users/userprofile','profile',{headers:{Authorization:token}});
 const id=Number(profile?.user_id);if(!Number.isSafeInteger(id)||id<=0) throw new HttpError(401,'原木账号验证失败，请重新加载');
 return {id,name:String(profile.name||'原木玩家'),isAdmin:profile.is_admin===1};
}
function createGameServer(options={}) {
 const basePath=(options.basePath??process.env.BASE_PATH??'/log-defence').replace(/\/$/,'');
 const store=new JsonStore(options.dataDir||process.env.DATA_DIR||path.join(__dirname,'../data/players'));
 const publicDir=path.resolve(options.publicDir||path.join(__dirname,'../dist'));
 const authorize=options.authorize||((ticket)=>authorizeWithLoghome(ticket,process.env.LOGHOME_API_URL||'https://api.loghome.ink'));
 const social=new SocialStore(options.socialFile||path.join(path.dirname(store.directory),'friends.json'));
 const mail=new MailStore(options.mailFile||path.join(path.dirname(store.directory),'mail.json'));
 const sessions=new Map(),tickets=new Map(),attempts=new Map();
 const allowedParents=(options.allowedParents||process.env.ALLOWED_PARENT_ORIGINS||'null,https://m.loghome.ink,https://loghome.ink').split(',').map(x=>x.trim()).filter(Boolean);
 function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
 async function body(req){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>600*1024)throw new HttpError(413,'Request too large');chunks.push(chunk);}try{const value=JSON.parse(Buffer.concat(chunks).toString());if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Expected object');return value;}catch{throw new HttpError(400,'Invalid JSON');}}
 function user(req){const token=(req.headers.authorization||'').replace(/^Bearer /,'');const session=sessions.get(token);if(!session||session.expires<Date.now()){sessions.delete(token);throw new HttpError(401,'Game session expired; reopen from LogHome');}return session;}
 const server=http.createServer(async(req,res)=>{
  try {
   const now=Date.now();for(const[k,v]of sessions)if(v.expires<now)sessions.delete(k);for(const[k,v]of tickets)if(v<now)tickets.delete(k);for(const[k,v]of attempts)if(v.until<now)attempts.delete(k);
   const url=new URL(req.url,'http://localhost');
   if(basePath && url.pathname===basePath){res.writeHead(302,{Location:basePath+'/'});return res.end();}
   if(!url.pathname.startsWith(basePath+'/'))throw new HttpError(404,'Not found');
   const route=url.pathname.slice(basePath.length);
   if(route==='/api/config'&&req.method==='GET')return json(res,200,{allowedParents});
   if(route==='/api/session'&&req.method==='POST') {
    const proxyIp=req.headers['x-real-ip'];const key=process.env.TRUST_PROXY==='1'&&typeof proxyIp==='string'&&net.isIP(proxyIp)?proxyIp:req.socket.remoteAddress,rate=attempts.get(key)||{count:0,until:now+60000};rate.count++;attempts.set(key,rate);if(rate.count>30)throw new HttpError(429,'Too many login attempts');
    const input=await body(req),ticket=input.crossSiteToken;
    if(typeof ticket!=='string'||!/^[a-zA-Z0-9]{8}$/.test(ticket))throw new HttpError(401,'Invalid LogHome ticket');
    const digest=crypto.createHash('sha256').update(ticket).digest('hex');if(tickets.has(digest))throw new HttpError(401,'Ticket already exchanged');tickets.set(digest,now+60000);
    const identity=await authorize(ticket);if(!Number.isSafeInteger(identity.id)||identity.id<=0)throw new HttpError(401,'Invalid account');
    const token=crypto.randomBytes(32).toString('hex'),expires=now+12*3600000;sessions.set(token,{...identity,expires});
    return json(res,200,{token,expires,user:{id:identity.id,name:identity.name},allowDev:process.env.ALLOW_DEV_TOOLS==='1'&&identity.isAdmin===true});
   }
   if(route==='/api/save') {
    const identity=user(req);
    if(req.method==='GET')return json(res,200,await store.read(identity.id));
    if(req.method==='PUT'){const input=await body(req);const saved=await store.write(identity.id,input.revision,input.state);return json(res,200,{revision:saved.revision,updatedAt:saved.updatedAt});}
    throw new HttpError(405,'Method not allowed');
   }
   if(route==='/api/friends'&&req.method==='GET'){
    const me=user(req);
    const data=await social.mutate(d=>{d.names[me.id]=me.name;return d});
    const ids=[];
    data.links.forEach(p=>{if(p[0]===me.id)ids.push(p[1]);else if(p[1]===me.id)ids.push(p[0])});
    const friends=[];
    for(const fid of ids){
     let sv=null;try{sv=await store.read(fid);}catch{sv=null;}
     const v=sv&&sv.state&&sv.state.village?sv.state.village:null;
     friends.push({id:fid,name:data.names[fid]||('玩家'+fid),baseName:v?(sv.state.baseName||''):'',lv:v?v.baseLevel:0,updatedAt:sv?sv.updatedAt:null});
    }
    return json(res,200,{friends,
     incoming:data.reqs.filter(r=>r.to===me.id).map(r=>({id:r.from,name:r.name||data.names[r.from]||('玩家'+r.from),at:r.at})),
     outgoing:data.reqs.filter(r=>r.from===me.id).map(r=>({id:r.to,name:data.names[r.to]||('玩家'+r.to),at:r.at}))});
   }
   if(route==='/api/friends/search'&&req.method==='GET'){
    const me=user(req),keyword=String(new URL(req.url,'http://localhost').searchParams.get('keyword')||'').trim();
    if(!keyword||keyword.length>40)throw new HttpError(400,'请输入搜索关键词');
    const communityBase=process.env.LOGHOME_API_URL||'https://api.loghome.ink';
    let results;
    try {
     const resp=await (options.communityFetch||fetch)(new URL('/community/search/users?keyword='+encodeURIComponent(keyword),communityBase),{redirect:'error',signal:AbortSignal.timeout(10000)});
     if(!resp.ok)throw new HttpError(502,'原木社区搜索暂不可用，请稍后重试');
     results=await resp.json();
    }catch(e){if(e instanceof HttpError)throw e;throw new HttpError(502,'原木社区搜索暂不可用，请稍后重试');}
    if(!Array.isArray(results))throw new HttpError(502,'原木社区搜索返回了无效数据，请稍后重试');
    const sd=await social.mutate(()=>{});
    const isFriend=id=>sd.links.some(p=>p.includes(me.id)&&p.includes(id));
    const reqFromMe=id=>sd.reqs.some(r=>r.from===me.id&&r.to===id);
    const reqToMe=id=>sd.reqs.some(r=>r.from===id&&r.to===me.id);
    return json(res,200,{users:results.filter(u=>u&&Number.isSafeInteger(Number(u.user_id))).map(u=>{
     const id=Number(u.user_id);
     return {id,name:String(u.name||('玩家'+id)),avatar:String(u.avatar_url||''),friend:isFriend(id),requested:reqFromMe(id),incoming:reqToMe(id)};
    }).filter(u=>u.id!==me.id)});
   }
   if(route==='/api/friends/request'&&req.method==='POST'){
    const me=user(req),input=await body(req),target=Number(input.id);
    if(!Number.isSafeInteger(target)||target<=0||target===me.id)throw new HttpError(400,'无效的好友ID');
    await social.mutate(d=>{
     if(d.links.some(p=>p.includes(me.id)&&p.includes(target)))throw new HttpError(409,'你们已经是好友');
     if(d.reqs.some(r=>(r.from===me.id&&r.to===target)||(r.from===target&&r.to===me.id)))throw new HttpError(409,'已发送过好友申请，等待处理');
     d.reqs.push({from:me.id,to:target,name:me.name,at:now});return d;
    });
    return json(res,200,{ok:true});
   }
   if(route==='/api/friends/accept'&&req.method==='POST'){
    const me=user(req),input=await body(req),other=Number(input.id);
    if(!Number.isSafeInteger(other))throw new HttpError(400,'无效的玩家ID');
    await social.mutate(d=>{
     const i=d.reqs.findIndex(r=>r.from===other&&r.to===me.id);
     if(i<0)throw new HttpError(404,'没有来自该玩家的好友申请');
     d.reqs.splice(i,1);d.names[me.id]=me.name;if(!d.names[other])d.names[other]='玩家'+other;
     if(!d.links.some(p=>p.includes(me.id)&&p.includes(other)))d.links.push([me.id,other].sort((a,b)=>a-b));
     return d;
    });
    return json(res,200,{ok:true});
   }
   if(route==='/api/friends/decline'&&req.method==='POST'){
    const me=user(req),input=await body(req),other=Number(input.id);
    if(!Number.isSafeInteger(other))throw new HttpError(400,'无效的玩家ID');
    await social.mutate(d=>{d.reqs=d.reqs.filter(r=>!((r.from===me.id&&r.to===other)||(r.from===other&&r.to===me.id)));return d;});
    return json(res,200,{ok:true});
   }
   if(route==='/api/friends/remove'&&req.method==='POST'){
    const me=user(req),input=await body(req),other=Number(input.id);
    if(!Number.isSafeInteger(other))throw new HttpError(400,'无效的玩家ID');
    await social.mutate(d=>{d.links=d.links.filter(p=>!(p.includes(me.id)&&p.includes(other)));return d;});
    return json(res,200,{ok:true});
   }
   if(route==='/api/friends/village'&&req.method==='GET'){
    const me=user(req),fid=Number(new URL(req.url,'http://localhost').searchParams.get('id'));
    if(!Number.isSafeInteger(fid)||fid<=0||fid===me.id)throw new HttpError(400,'无效的玩家ID');
    const data=await social.mutate(()=>{});
    if(!data.links.some(p=>p.includes(me.id)&&p.includes(fid)))throw new HttpError(403,'只能参观好友的村庄');
    let sv=null;try{sv=await store.read(fid);}catch{sv=null;}
    const v=sv&&sv.state&&sv.state.village?sv.state.village:null;
    const dayKey=new Date(now+8*3600000).toISOString().slice(0,10);
    const rec=data.steals[me.id];
    const stealLeft=Math.max(0,STEAL_DAILY_LIMIT-((rec&&rec.day===dayKey)?rec.count:0));
    return json(res,200,{id:fid,name:data.names[fid]||('玩家'+fid),baseName:v?(sv.state.baseName||''):'',state:v?sv.state:null,stealLeft});
   }
   // 偷取好友作物：地块囤积已满才可偷，取各资源整数的 1/10（至少 1），从好友囤积中真实扣除；
   // 每人每天（北京时间）最多 3 次；扣除走 store.write（bump 好友存档 revision，其在线客户端会收到 409 提示重开）
   if(route==='/api/friends/steal'&&req.method==='POST'){
    const me=user(req),input=await body(req),fid=Number(input.id);
    if(!Number.isSafeInteger(fid)||fid<=0||fid===me.id)throw new HttpError(400,'无效的玩家ID');
    const layer=input.layer==='ug'?'ug':'ground',idx=Number(input.idx);
    if(!Number.isSafeInteger(idx)||idx<0||idx>8)throw new HttpError(400,'无效的地块');
    const dayKey=new Date(now+8*3600000).toISOString().slice(0,10);
    // mutate 回调返回非 undefined 会被当新数据落盘（曾把 friends.json 写成数字 0），计数用闭包变量带出
    let used=0;
    await social.mutate(d=>{
     if(!d.links.some(p=>p.includes(me.id)&&p.includes(fid)))throw new HttpError(403,'只能偷取好友的作物');
     const rec=d.steals[me.id];used=(rec&&rec.day===dayKey)?rec.count:0;return d;
    });
    if(used>=STEAL_DAILY_LIMIT)throw new HttpError(429,'今日偷取次数已用完（每日 '+STEAL_DAILY_LIMIT+' 次）');
    const sv=await store.read(fid),v=sv&&sv.state&&sv.state.village;
    if(!v)throw new HttpError(404,'对方还没有开垦村庄');
    const plots=layer==='ug'?v.ugPlots:v.plots,plot=plots&&plots[idx];
    const cap=plot&&plot.type?collectCap(BUILDING_MAP[plot.type],plot.level):null;
    if(!plot||!cap)throw new HttpError(400,'该地块没有可偷的作物');
    const capKeys=Object.keys(cap);
    const sumCap=capKeys.reduce((s,id)=>s+cap[id],0);
    const sumBuf=capKeys.reduce((s,id)=>s+(Number(plot.buf&&plot.buf[id])||0),0);
    if(sumBuf<sumCap)throw new HttpError(400,'作物还未成熟（囤积未满）');
    const gains={};let total=0;
    capKeys.forEach(id=>{
     const have=Math.floor(Number(plot.buf&&plot.buf[id])||0);
     if(have>=1){const take=Math.max(1,Math.floor(have/10));gains[id]=take;total+=take;}
    });
    if(!total)throw new HttpError(400,'该地块没有可偷的作物');
    capKeys.forEach(id=>{if(gains[id])plot.buf[id]=Math.max(0,(Number(plot.buf[id])||0)-gains[id]);});
    try{await store.write(fid,sv.revision,sv.state);}catch(e){if(e.status===409)throw new HttpError(409,'作物刚被别人光顾过，稍后再试');throw e;}
    await social.mutate(d=>{
     const rec=d.steals[me.id];const count=(rec&&rec.day===dayKey)?rec.count:0;
     d.steals[me.id]={day:dayKey,count:count+1};return d;
    });
    return json(res,200,{gains,stealLeft:Math.max(0,STEAL_DAILY_LIMIT-used-1),buf:plot.buf});
   }
   if(route==='/api/mail'&&req.method==='GET'){
    const me=user(req);
    const d=await mail.mutate(()=>{});
    const reads=new Set(d.reads[me.id]||[]);
    const mails=(d.boxes[me.id]||[]).slice(-50).reverse();
    const broadcasts=d.broadcasts.slice(-20).reverse().map(b=>({id:b.id,title:b.title,content:b.content,at:b.at,read:reads.has(b.id)}));
    const unread=mails.filter(m=>m.items&&!m.claimed).length+broadcasts.filter(b=>!b.read).length;
    return json(res,200,{mails,broadcasts,unread});
   }
   if(route==='/api/mail/claim'&&req.method==='POST'){
    const me=user(req),input=await body(req),id=Number(input.id);
    if(!Number.isSafeInteger(id))throw new HttpError(400,'无效的邮件');
    let items=null;
    await mail.mutate(d=>{
     const m=(d.boxes[me.id]||[]).find(x=>x.id===id);
     if(!m)throw new HttpError(404,'邮件不存在或已被清理');
     if(!m.items)throw new HttpError(400,'该邮件没有附件');
     if(m.claimed)throw new HttpError(409,'附件已领取过');
     m.claimed=1;items=m.items;return d;
    });
    return json(res,200,{items});
   }
   if(route==='/api/mail/read'&&req.method==='POST'){
    const me=user(req),input=await body(req),id=Number(input.id);
    if(!Number.isSafeInteger(id))throw new HttpError(400,'无效的公告');
    await mail.mutate(d=>{
     if(!d.broadcasts.some(b=>b.id===id))return d;
     if(!d.reads[me.id])d.reads[me.id]=[];
     if(!d.reads[me.id].includes(id))d.reads[me.id].push(id);
     if(d.reads[me.id].length>100)d.reads[me.id]=d.reads[me.id].slice(-100);
     return d;
    });
    return json(res,200,{ok:true});
   }
   if(route==='/api/mail/clear'&&req.method==='POST'){
    const me=user(req);
    let removed=0;
    await mail.mutate(d=>{
     const box=d.boxes[me.id];
     if(box&&box.length){
      const keep=box.filter(m=>m.items&&!m.claimed);
      removed=box.length-keep.length;
      if(removed){d.boxes[me.id]=keep;return d;}
     }
     return undefined;
    });
    return json(res,200,{ok:true,removed});
   }
   if(route==='/api/mail/send'&&req.method==='POST'){
    const me=user(req);
    if(process.env.ALLOW_DEV_TOOLS!=='1'||me.isAdmin!==true)throw new HttpError(403,'仅管理员可发布系统邮件');
    const input=await body(req);
    const title=String(input.title||'').trim(),content=String(input.content||'').trim();
    if(!title||title.length>60)throw new HttpError(400,'标题需 1–60 字');
    if(content.length>500)throw new HttpError(400,'内容过长（上限 500 字）');
    const items={};
    if(input.items&&typeof input.items==='object'&&!Array.isArray(input.items)){
     Object.keys(input.items).forEach(k=>{const n=Math.floor(Number(input.items[k]));if(/^[a-zA-Z]{1,16}$/.test(k)&&Number.isSafeInteger(n)&&n>0&&n<=99999)items[k]=n;});
     if(Object.keys(items).length>8)throw new HttpError(400,'附件种类过多（上限 8 种）');
    }
    const hasItems=Object.keys(items).length>0;
    const target=input.target==='all'?'all':Number(input.target);
    if(target!=='all'&&(!Number.isSafeInteger(target)||target<=0))throw new HttpError(400,'收件目标需为 all 或玩家 ID');
    const at=now;
    let newId=0;
    await mail.mutate(d=>{
     d.seq++;
     if(target==='all'&&!hasItems){
      d.broadcasts.push({id:d.seq,title,content,at});
      if(d.broadcasts.length>50)d.broadcasts=d.broadcasts.slice(-50);
      newId=d.seq;return d;
     }
     const entry={id:d.seq,title,content,items:hasItems?items:null,claimed:hasItems?0:1,at};
     if(target==='all'){
      Object.keys(d.boxes).forEach(uid=>{d.boxes[uid].push({...entry});if(d.boxes[uid].length>50)d.boxes[uid]=d.boxes[uid].slice(-50);});
     }else{
      if(!d.boxes[target])d.boxes[target]=[];
      d.boxes[target].push(entry);
      if(d.boxes[target].length>50)d.boxes[target]=d.boxes[target].slice(-50);
     }
     newId=d.seq;return d;
    });
    return json(res,200,{ok:true,id:newId});
   }
   if(route.startsWith('/api/'))throw new HttpError(404,'Not found');
   if(!['GET','HEAD'].includes(req.method))throw new HttpError(405,'Method not allowed');
   const relative=decodeURIComponent(route==='/'?'/index.html':route),file=path.resolve(publicDir,'.'+relative);
   if(!file.startsWith(publicDir+path.sep))throw new HttpError(403,'Forbidden');
   let data;try{data=await fs.readFile(file);}catch{throw new HttpError(404,'Not found');}
   const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'}[path.extname(file)]||'application/octet-stream';
   res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(req.method==='HEAD'?undefined:data);
  } catch(e) {if(e.diagnostic)console.error('[log-defence auth]',JSON.stringify(e.diagnostic));else if(!e.status)console.error('[log-defence server]',JSON.stringify({code:e.code||e.name}));if(!res.headersSent)json(res,e.status||500,{error:e.status?e.message:'Server error'});else res.end();}
 });server.store=store;return server;
}
if(require.main===module){const port=Number(process.env.PORT||8787);createGameServer().listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Log Defence listening on ${port}`));}
module.exports={createGameServer,authorizeWithLoghome};
