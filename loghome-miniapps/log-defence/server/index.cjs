const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const net=require('node:net');
const {JsonStore,HttpError}=require('./store.cjs');
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
