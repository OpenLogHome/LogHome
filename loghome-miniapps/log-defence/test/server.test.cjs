const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createGameServer,authorizeWithLoghome}=require('../server/index.cjs');
const state=n=>({baseName:'测试营地',village:{baseLevel:0,plots:Array(9).fill(null),ugPlots:Array(9).fill(null),villagers:[],resources:{log:n}}});
async function fixture(t){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'log-defence-test-'));const server=createGameServer({dataDir:dir,basePath:'/game',authorize:async ticket=>{if(ticket==='bad00000')throw Object.assign(new Error('Invalid ticket'),{status:401});return{id:ticket.startsWith('two')?2:1,name:'玩家'};}});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));await fs.rm(dir,{recursive:true,force:true});});const base=`http://127.0.0.1:${server.address().port}/game`;
const req=async(route,options={})=>{const res=await fetch(base+route,options);return{status:res.status,data:await res.json()};};const login=async ticket=>(await req('/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({crossSiteToken:ticket,userId:999})})).data.token;
return{dir,server,req,login};}
test('authentication is required; expired/bad tickets and replay rejected',async t=>{const{req,login}=await fixture(t);assert.equal((await req('/api/save')).status,401);assert.equal((await req('/api/session',{method:'POST',body:JSON.stringify({crossSiteToken:'bad00000'})})).status,401);assert.ok(await login('one00001'));assert.equal((await req('/api/session',{method:'POST',body:JSON.stringify({crossSiteToken:'one00001'})})).status,401);});
test('verified account owns JSON save; client userId cannot select another player',async t=>{const{req,login,dir}=await fixture(t);const a=await login('one00002'),b=await login('two00001');const put=await req('/api/save',{method:'PUT',headers:{Authorization:'Bearer '+a},body:JSON.stringify({userId:2,revision:0,state:state(30)})});assert.equal(put.status,200);assert.equal((await req('/api/save',{headers:{Authorization:'Bearer '+b}})).data.state,null);const saved=JSON.parse(await fs.readFile(path.join(dir,'1.json'),'utf8'));assert.equal(saved.userId,1);assert.equal(saved.state.village.resources.log,30);assert.equal(saved.token,undefined);});
test('concurrent writes use revision locking; invalid state never overwrites valid save',async t=>{const{req,login}=await fixture(t),token=await login('one00003');const write=(revision,data)=>req('/api/save',{method:'PUT',headers:{Authorization:'Bearer '+token},body:JSON.stringify({revision,state:data})});const result=await Promise.all([write(0,state(1)),write(0,state(2))]);assert.deepEqual(result.map(r=>r.status).sort(),[200,409]);assert.equal((await write(1,state(-1))).status,400);assert.equal((await req('/api/save',{headers:{Authorization:'Bearer '+token}})).data.revision,1);});
test('disk progress survives new store instance; corrupt data fails closed and stays intact',async t=>{const{server,dir}=await fixture(t);await server.store.write(1,0,state(8));const {JsonStore}=require('../server/store.cjs');const other=new JsonStore(dir);assert.equal((await other.read(1)).state.village.resources.log,8);await fs.writeFile(path.join(dir,'1.json'),'{broken');await assert.rejects(other.write(1,1,state(9)),e=>e.status===500);assert.equal(await fs.readFile(path.join(dir,'1.json'),'utf8'),'{broken');});
test('production auth adapter verifies ticket and profile with LogHome backend',async t=>{let authorization;const server=require('node:http').createServer((req,res)=>{res.setHeader('Content-Type','application/json');if(req.url.startsWith('/users/token_by_cross_site'))res.end(JSON.stringify({token:{tk:'verified-main-token'}}));else{authorization=req.headers.authorization;res.end(JSON.stringify({user_id:17,name:'阿橡',is_admin:1}));}});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const user=await authorizeWithLoghome('ticket00',`http://127.0.0.1:${server.address().port}`);assert.equal(user.id,17);assert.equal(user.isAdmin,true);assert.equal(authorization,'verified-main-token');});

test('upstream network failure retries; timeout and invalid JSON do not become generic 500',async()=>{
 let calls=0;
 const user=await authorizeWithLoghome('ticket00','http://backend.test',{fetch:async url=>{
  calls++;if(calls===1)throw new TypeError('fetch failed');
  return new Response(JSON.stringify(url.pathname.includes('token_by_cross_site')?{token:{tk:'private-token'}}:{user_id:1,name:'玩家'}));
 }});
 assert.equal(user.id,1);assert.equal(calls,3);
 await assert.rejects(authorizeWithLoghome('ticket00','http://backend.test',{fetch:async()=>{throw Object.assign(new Error('aborted'),{name:'TimeoutError'})}}),e=>e.status===504&&e.diagnostic.stage==='exchange'&&!e.message.includes('ticket00'));
 await assert.rejects(authorizeWithLoghome('ticket00','http://backend.test',{fetch:async()=>new Response('<html>proxy failure</html>')}),e=>e.status===502&&e.diagnostic.code==='INVALID_JSON');
});
test('upstream credential rejection is not retried; transient 503 recovers',async()=>{
 let denied=0;
 await assert.rejects(authorizeWithLoghome('ticket00','http://backend.test',{fetch:async()=>{denied++;return new Response('{}',{status:401})}}),e=>e.status===401);
 assert.equal(denied,1);
 let profileCalls=0;
 const user=await authorizeWithLoghome('ticket00','http://backend.test',{fetch:async url=>{
  if(url.pathname.includes('token_by_cross_site'))return new Response(JSON.stringify({token:{tk:'private-token'}}));
  if(++profileCalls===1)return new Response('{}',{status:503});
  return new Response(JSON.stringify({user_id:2,name:'玩家'}));
 }});
 assert.equal(user.id,2);assert.equal(profileCalls,2);
});

test('friend search proxies the LogHome community and annotates relationship state',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'log-defence-test-'));
 await fs.writeFile(path.join(dir,'friends.json'),JSON.stringify({links:[[1,2]],reqs:[{from:3,to:1,name:'三号',at:1}],names:{2:'阿二'}}));
 let searched;
 const server=createGameServer({dataDir:dir,socialFile:path.join(dir,'friends.json'),basePath:'/game',authorize:async()=>({id:1,name:'玩家'}),
  communityFetch:async url=>{searched=String(url);return new Response(JSON.stringify([
   {user_id:2,name:'阿二',avatar_url:'http://img.example/2.png'},
   {user_id:3,name:'三号'},
   {user_id:1,name:'我自己'},
   {user_id:'oops',name:'bad'}
  ]));}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));await fs.rm(dir,{recursive:true,force:true});});
 const base=`http://127.0.0.1:${server.address().port}/game`;
 const login=await (await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({crossSiteToken:'one00011'})})).json();
 const get=route=>fetch(base+route,{headers:{Authorization:'Bearer '+login.token}});
 const search=await (await get('/api/friends/search?keyword='+encodeURIComponent('阿'))).json();
 assert.ok(searched.includes('/community/search/users'));
 assert.ok(searched.includes('keyword='));
 assert.deepEqual(search.users.map(u=>[u.id,u.friend,u.requested,u.incoming]),[[2,true,false,false],[3,false,false,true]]);
 assert.equal(search.users[0].avatar,'http://img.example/2.png');
 assert.equal((await get('/api/friends/search')).status,400);
 assert.equal((await get('/api/friends/search?keyword='+encodeURIComponent('x'.repeat(41)))).status,400);
 const dir2=await fs.mkdtemp(path.join(os.tmpdir(),'log-defence-test-'));
 const server2=createGameServer({dataDir:dir2,socialFile:path.join(dir2,'friends.json'),basePath:'/game',authorize:async()=>({id:1,name:'玩家'}),communityFetch:async()=>new Response('{}',{status:500})});
 await new Promise(r=>server2.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server2.close(r));await fs.rm(dir2,{recursive:true,force:true});});
 const base2=`http://127.0.0.1:${server2.address().port}/game`;
 const login2=await (await fetch(base2+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({crossSiteToken:'one00011'})})).json();
 const bad=await fetch(base2+'/api/friends/search?keyword=a',{headers:{Authorization:'Bearer '+login2.token}});
 assert.equal(bad.status,502);
});

test('friend steal requires friendship, full buf, and caps at 3 per day',async t=>{
 const VD=require('../src/game/village-data.js');
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'log-defence-test-'));
 const server=createGameServer({dataDir:dir,socialFile:path.join(dir,'friends.json'),basePath:'/game',authorize:async ticket=>({id:ticket.startsWith('two')?2:1,name:'玩家'})});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));await fs.rm(dir,{recursive:true,force:true});});
 const base=`http://127.0.0.1:${server.address().port}/game`;
 const login=async ticket=>(await (await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({crossSiteToken:ticket})})).json()).token;
 const req=(route,token)=>fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:'{}'});
 const fullPlot=key=>{const def=VD.BUILDING_MAP[key];const cap=VD.collectCap(def,1);const buf={};Object.keys(cap).forEach(id=>{buf[id]=cap[id];});return{type:key,level:1,workers:0,dur:100,buf,busy:null,crew:[]};};
 const empty=i=>i===4?null:{type:'dorm',level:1,workers:0,dur:100,buf:{},busy:null,crew:[]};
 const victimState={baseName:'富农场',village:{baseLevel:2,plots:[fullPlot('farm'),fullPlot('lumber'),fullPlot('stonegen'),empty(3),empty(4),empty(5),empty(6),empty(7),empty(8)],ugPlots:Array(9).fill(null),villagers:[],resources:{}}};
 await server.store.write(2,0,victimState);
 await fs.writeFile(path.join(dir,'friends.json'),JSON.stringify({links:[[1,2],[1,3]],reqs:[],names:{},steals:{}}));
 const thief=await login('one00021');
 assert.equal((await req('/api/friends/steal',thief)).status,400); // 空 body → 400
 // 未满：给好友3一个不满的地块
 const poorState={baseName:'穷农场',village:{baseLevel:1,plots:[(p=>{const def=VD.BUILDING_MAP[p.type];const cap=VD.collectCap(def,1);p.buf={};Object.keys(cap).forEach((id,i)=>{p.buf[id]=Math.max(0,cap[id]-1);});return p;})(fullPlot('farm')),null,null,null,null,null,null,null,null],ugPlots:Array(9).fill(null),villagers:[],resources:{}}};
 await server.store.write(3,0,poorState);
 const steal=async(id,layer,idx)=>{const res=await fetch(base+'/api/friends/steal',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+thief},body:JSON.stringify({id,layer,idx})});return{status:res.status,data:await res.json()};};
 assert.equal((await steal(3,'ground',0)).status,400);
 // 非好友
 await server.store.write(4,0,victimState);
 assert.equal((await steal(4,'ground',0)).status,403);
 // 好友满仓：三次成功，各偷 1/10
 const farmDef=VD.BUILDING_MAP.farm,farmCap=VD.collectCap(farmDef,1);
 const expectGains=Object.keys(farmCap).reduce((m,id)=>{m[id]=Math.max(1,Math.floor(farmCap[id]/10));return m;},{});
 const s1=await steal(2,'ground',0);
 assert.equal(s1.status,200);
 assert.deepEqual(s1.data.gains,expectGains);
 assert.equal(s1.data.stealLeft,2);
 const s2=await steal(2,'ground',1);assert.equal(s2.status,200);assert.equal(s2.data.stealLeft,1);
 const s3=await steal(2,'ground',2);assert.equal(s3.status,200);assert.equal(s3.data.stealLeft,0);
 // 次数用尽
 assert.equal((await steal(2,'ground',3)).status,429);
 // 好友囤积被真实扣减且 revision 递增
 const after=await server.store.read(2);
 assert.equal(after.revision,4); // 初始写入 1 + 三次偷取各 bump 一次
 Object.keys(farmCap).forEach(id=>{assert.equal(Math.floor(after.state.village.plots[0].buf[id]),farmCap[id]-expectGains[id]);});
});
