const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const net=require('node:net');
const {JsonStore,HttpError}=require('./store.cjs');
// 好友关系存储（data/friends.json）：links=[[a,b],...] 双向好友对，reqs=[{from,to,name,at}] 待处理申请，names=玩家名快照
class SocialStore {
 constructor(file){this.file=path.resolve(file);this.queue=Promise.resolve();}
 _load(){return fs.readFile(this.file,'utf8').then(t=>{const v=JSON.parse(t);return{
  links:Array.isArray(v.links)?v.links.filter(p=>Array.isArray(p)&&p.length===2&&Number.isSafeInteger(p[0])&&Number.isSafeInteger(p[1])&&p[0]!==p[1]):[],
  reqs:Array.isArray(v.reqs)?v.reqs.filter(r=>r&&Number.isSafeInteger(r.from)&&Number.isSafeInteger(r.to)&&r.from!==r.to):[],
  names:(v.names&&typeof v.names==='object'&&!Array.isArray(v.names))?v.names:{}
 }}).catch(()=>({links:[],reqs:[],names:{}}))}
 _save(d){const tmp=this.file+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';return fs.mkdir(path.dirname(this.file),{recursive:true,mode:0o700}).then(()=>fs.open(tmp,'wx',0o600)).then(async h=>{try{await h.writeFile(JSON.stringify(d));await h.sync();}finally{await h.close();}}).then(()=>fs.rename(tmp,this.file)).finally(()=>fs.rm(tmp,{force:true}))}
 // mutate(fn)：fn 返回 undefined 表示只读；读到旧格式数据时 _load 已静默归一
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
    return json(res,200,{id:fid,name:data.names[fid]||('玩家'+fid),baseName:v?(sv.state.baseName||''):'',state:v?sv.state:null});
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
