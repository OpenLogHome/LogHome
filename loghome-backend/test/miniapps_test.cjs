const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const {createRegistry, validate} = require('../bin/miniapps');
const {createRouter} = require('../routes/miniapps');
const input = () => ({id:'log-defence',name:'原木保卫战',icon:'/static/icons/enderman.png',description:'测试游戏',debugUrl:'http://127.0.0.1:8787/log-defence/',productionUrl:'https://miniapps.loghome.ink/log-defence/',enabled:true,sortOrder:0});
function memory() {
  const rows = new Map();
  return createRegistry(async (sql, args=[]) => {
    if (sql.startsWith('CREATE TABLE')) return {};
    if (sql.startsWith('INSERT')) {
      if (rows.has(args[0])) throw Object.assign(new Error('duplicate'), {code:'ER_DUP_ENTRY'});
      const [app_id,name,icon_url,description,debug_url,production_url,enabled,sort_order]=args;
      rows.set(app_id,{app_id,name,icon_url,description,debug_url,production_url,enabled,sort_order}); return {affectedRows:1};
    }
    if (sql.startsWith('UPDATE')) {
      const [name,icon_url,description,debug_url,production_url,enabled,sort_order,id]=args;
      Object.assign(rows.get(id),{name,icon_url,description,debug_url,production_url,enabled,sort_order}); return {affectedRows:1};
    }
    if (sql.startsWith('DELETE')) return {affectedRows:rows.delete(args[0])?1:0};
    if (sql.includes('WHERE app_id = ?')) {const row=rows.get(args[0]);return row&&(!sql.includes('enabled = 1')||row.enabled)?[{...row}]:[];}
    if (sql.startsWith('SELECT')) return [...rows.values()].filter(row=>!sql.includes('WHERE enabled = 1')||row.enabled).sort((a,b)=>a.sort_order-b.sort_order);
    throw new Error('Unexpected query '+sql);
  });
}
test('registration requires valid metadata and safe environment URLs', () => {
  assert.equal(validate(input()).id,'log-defence');
  for (const patch of [{name:''},{icon:'javascript:alert(1)'},{debugUrl:'file:///tmp/game'},{productionUrl:'http://game.example/'},{debugUrl:'https://a:b@example.com/'},{id:'../other'},{id:'manage'},{sortOrder:0.5},{enabled:'false'}]) assert.throws(()=>validate({...input(),...patch}),e=>e.status===400);
});
test('registry has no implicit entries; enabled app resolves only requested environment', async () => {
  const registry=memory();assert.equal((await registry.catalog()).length,0);
  await assert.rejects(registry.resolve('log-defence','production'),e=>e.status===404);
  await registry.save(input());
  const debug=await registry.resolve('log-defence','debug'),production=await registry.resolve('log-defence','production');
  assert.equal(debug.url,input().debugUrl);assert.equal(production.url,input().productionUrl);assert.equal(production.debugUrl,undefined);
  assert.equal((await registry.catalog())[0].icon,input().icon);assert.equal((await registry.catalog())[0].debugUrl,undefined);
  await assert.rejects(registry.resolve('log-defence','invalid'),e=>e.status===400);
});
test('duplicate ID, immutable ID, disable and delete are enforced', async () => {
  const registry=memory();await registry.save(input());
  await assert.rejects(registry.save(input()),e=>e.status===409);
  await assert.rejects(registry.save({...input(),id:'other'},'log-defence'),e=>e.status===400);
  await registry.save({...input(),enabled:false,name:'新名字'},'log-defence');
  assert.equal((await registry.all(true))[0].name,'新名字');assert.equal((await registry.catalog()).length,0);
  await assert.rejects(registry.resolve('log-defence','debug'),e=>e.status===404);
  await registry.remove('log-defence');assert.equal((await registry.all(true)).length,0);
});
test('HTTP registration management requires admin authorization; public launch rejects disabled apps', async () => {
  const app=express();app.use(express.json());app.use('/miniapps',createRouter({registry:memory(),adminAuth:(req,res,next)=>req.headers.authorization==='admin'?next():res.status(401).json({message:'admin required'})}));
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port+'/miniapps';
  try {
    assert.equal((await fetch(base+'/manage')).status,401);
    assert.equal((await fetch(base+'/manage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input())})).status,401);
    assert.equal((await fetch(base+'/manage',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'admin'},body:JSON.stringify(input())})).status,201);
    const resolved=await (await fetch(base+'/log-defence?environment=debug')).json();assert.equal(resolved.data.url,input().debugUrl);
    await fetch(base+'/manage/log-defence',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'admin'},body:JSON.stringify({...input(),enabled:false})});
    assert.equal((await fetch(base+'/log-defence')).status,404);
  } finally {await new Promise(r=>server.close(r));}
});
