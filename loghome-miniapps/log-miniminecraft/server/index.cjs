const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const net=require('node:net');
const {SaveStore,HttpError}=require('./store.cjs');
const {authorizeWithLoghome}=require('./auth.cjs');
const {validateStaticAssets}=require('./static-assets.cjs');
function createServer(options={}) {
 const basePath=(options.basePath??process.env.BASE_PATH??'/log-miniminecraft').replace(/\/$/,'');
 if(basePath&&!/^\/[a-zA-Z0-9/_-]+$/.test(basePath))throw Error('Invalid BASE_PATH');
 const maxBytes=options.maxBytes||Number(process.env.MAX_SAVE_BYTES)||50*1024*1024;
 const store=new SaveStore(options.dataDir||process.env.DATA_DIR||path.join(__dirname,'../data/players'),maxBytes);
 const publicDir=path.resolve(options.publicDir||path.join(__dirname,'../dist'));
 validateStaticAssets(publicDir);
 const parents=(options.allowedParents||process.env.ALLOWED_PARENT_ORIGINS||'null,https://m.loghome.ink,https://loghome.ink').split(',').map(s=>s.trim());
 const authorize=options.authorize||((ticket)=>authorizeWithLoghome(ticket,process.env.LOGHOME_API_URL||'https://api.loghome.ink'));
 const sessions=new Map(),tickets=new Map(),attempts=new Map();
 function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
 async function body(req,limit){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>limit)throw new HttpError(413,'请求超过存档容量上限');chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString());}catch{throw new HttpError(400,'Invalid JSON');}}
 function user(req){const token=(req.headers.authorization||'').replace(/^Bearer /,'');const identity=sessions.get(token);if(!identity||identity.expires<Date.now())throw new HttpError(401,'登录已过期，请从原木重新打开');return identity;}
 const server=http.createServer(async(req,res)=>{
  try{
   const now=Date.now();for(const [k,s] of sessions)if(s.expires<now)sessions.delete(k);for(const[k,t]of tickets)if(t<now)tickets.delete(k);for(const[k,t]of attempts)if(t.until<now)attempts.delete(k);
   const url=new URL(req.url,'http://localhost');
   if(basePath&&url.pathname===basePath){res.writeHead(302,{Location:basePath+'/'});return res.end();}
   if(!url.pathname.startsWith(basePath+'/'))throw new HttpError(404,'Not found');
   const route=url.pathname.slice(basePath.length);
   if(route==='/api/health'&&req.method==='GET')return json(res,200,{ok:true,service:'log-miniminecraft'});
   if(route==='/api/config'&&req.method==='GET')return json(res,200,{allowedParents:parents,maxSaveBytes:maxBytes});
   if(route==='/api/session'&&req.method==='POST'){
    const input=await body(req,4096);const ticket=input?.crossSiteToken;
    const proxy=req.headers['x-real-ip'],ip=process.env.TRUST_PROXY==='1'&&typeof proxy==='string'&&net.isIP(proxy)?proxy:req.socket.remoteAddress;
    const rate=attempts.get(ip)||{count:0,until:now+60000};rate.count++;attempts.set(ip,rate);if(rate.count>30)throw new HttpError(429,'Too many login attempts');
    if(typeof ticket!=='string'||!/^[a-zA-Z0-9]{8}$/.test(ticket))throw new HttpError(401,'Invalid LogHome ticket');
    const digest=crypto.createHash('sha256').update(ticket).digest('hex');if(tickets.has(digest))throw new HttpError(401,'票据已使用，请从原木重新打开');tickets.set(digest,now+60000);
    let identity;try{identity=await authorize(ticket);}catch(e){tickets.delete(digest);throw e;}
    if(!Number.isSafeInteger(identity.id)||identity.id<=0)throw new HttpError(401,'Invalid account');
    const token=crypto.randomBytes(32).toString('hex'),expires=now+12*3600000;sessions.set(token,{id:identity.id,expires});
    return json(res,200,{token,expires,user:{id:identity.id,name:identity.name}});
   }
   if(route==='/api/snapshot'){
    const identity=user(req);
    if(req.method==='GET')return json(res,200,await store.read(identity.id));
    if(req.method==='PUT'){const input=await body(req,maxBytes+4096);const save=await store.write(identity.id,input?.revision,input?.state);return json(res,200,{revision:save.revision,updatedAt:save.updatedAt});}
    throw new HttpError(405,'Method not allowed');
   }
   if(route.startsWith('/api/'))throw new HttpError(404,'Not found');
   if(!['GET','HEAD'].includes(req.method))throw new HttpError(405,'Method not allowed');
   let relative;try{relative=decodeURIComponent(route==='/'?'/index.html':route);}catch{throw new HttpError(400,'Invalid path');}
   const file=path.resolve(publicDir,'.'+relative);if(!file.startsWith(publicDir+path.sep))throw new HttpError(403,'Forbidden');
   let stat;try{stat=await fs.stat(file);}catch{throw new HttpError(404,'Not found');}if(!stat.isFile())throw new HttpError(404,'Not found');
   const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.wav':'audio/wav'}[path.extname(file)]||'application/octet-stream';
   res.writeHead(200,{'Content-Type':mime,'Content-Length':stat.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
   if(req.method==='HEAD')return res.end();require('node:fs').createReadStream(file).on('error',()=>res.destroy()).pipe(res);
  }catch(e){if(!e.status)console.error('[log-miniminecraft]',e.code||e.name);if(!res.headersSent)json(res,e.status||500,{error:e.status?e.message:'Server error'});else res.destroy();}
 });server.store=store;return server;
}
if(require.main===module){const port=Number(process.env.PORT||8788);createServer().listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Log MiniMinecraft listening on ${port}`));}
module.exports={createServer};
