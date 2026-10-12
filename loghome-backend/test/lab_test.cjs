const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const {createLabRegistry, validate} = require('../bin/lab');
const {createRouter} = require('../routes/lab');
const {createRegistry} = require('../bin/miniapps');
const input = (id='log-defence') => ({id,miniappId:id,name:'测试入口',nameEn:'Test',icon:'/static/icons/lab.svg',description:'说明',descriptionEn:'Description',enabled:true,sortOrder:0});
function memory() {
  const rows = new Map(), apps = new Map([['log-defence',{id:'log-defence',name:'原木保卫战',enabled:true}],['log-miniminecraft',{id:'log-miniminecraft',name:'原木方块世界',enabled:true}]]);
  const registry = createLabRegistry(async (sql,args=[]) => {
    if(sql.startsWith('CREATE TABLE'))return {};
    if(sql.startsWith('INSERT')) {
      if(rows.has(args[0]))throw Object.assign(new Error(),{code:'ER_DUP_ENTRY'});
      const [entry_id,miniapp_id,name,name_en,icon_url,description,description_en,enabled,sort_order]=args;
      rows.set(entry_id,{entry_id,miniapp_id,name,name_en,icon_url,description,description_en,enabled,sort_order});return{affectedRows:1};
    }
    if(sql.startsWith('UPDATE')) { const [miniapp_id,name,name_en,icon_url,description,description_en,enabled,sort_order,id]=args;Object.assign(rows.get(id),{miniapp_id,name,name_en,icon_url,description,description_en,enabled,sort_order});return{affectedRows:1}; }
    if(sql.startsWith('DELETE'))return{affectedRows:rows.delete(args[0])?1:0};
    if(sql.includes('WHERE entry_id = ?'))return rows.has(args[0])?[rows.get(args[0])]:[];
    if(sql.startsWith('SELECT e.'))return [...rows.values()].filter(row=>!sql.includes('WHERE e.enabled = 1')||(row.enabled&&apps.get(row.miniapp_id).enabled)).sort((a,b)=>a.sort_order-b.sort_order||a.entry_id.localeCompare(b.entry_id)).map(row=>({...row,miniapp_name:apps.get(row.miniapp_id).name,miniapp_enabled:Number(apps.get(row.miniapp_id).enabled)}));
    throw Error('Unexpected query');
  },{all:async()=>[...apps.values()]});
  return {registry,apps};
}
test('lab rejects unsafe icons, invalid IDs and malformed metadata',()=>{
  assert.equal(validate(input()).miniappId,'log-defence');
  for(const patch of [{name:''},{id:'manage'},{miniappId:'../x'},{nameEn:'x'.repeat(81)},{description:'x'.repeat(501)},{icon:'javascript:alert(1)'},{icon:'/static/../secrets'},{icon:'https://user:pass@example.com/x'},{enabled:'true'},{sortOrder:1.5}])assert.throws(()=>validate({...input(),...patch}),e=>e.status===400);
});
test('lab remains independently curated and follows both entry and miniapp availability',async()=>{
  const {registry,apps}=memory();assert.equal((await registry.catalog()).length,0);
  await registry.save({...input(),sortOrder:20});await registry.save({...input('log-miniminecraft'),sortOrder:10});
  const listed=await registry.catalog();assert.equal(listed[0].miniappId,'log-miniminecraft');assert.equal(listed[0].nameEn,'Test');assert.equal(listed[0].productionUrl,undefined);
  await registry.save({...input('log-miniminecraft'),enabled:false},'log-miniminecraft');assert.equal((await registry.catalog()).length,1);
  apps.get('log-defence').enabled=false;assert.equal((await registry.catalog()).length,0);assert.equal((await registry.all(true)).length,2);
});
test('invalid references, duplicates, immutable IDs and missing deletes are enforced',async()=>{
  const{registry}=memory();await assert.rejects(registry.save({...input(),miniappId:'missing'}),e=>e.status===400);
  await registry.save(input());await assert.rejects(registry.save(input()),e=>e.status===409);
  await assert.rejects(registry.save({...input(),id:'new-id'},'log-defence'),e=>e.status===400);
  await registry.remove('log-defence');assert.equal((await registry.catalog()).length,0);
  await assert.rejects(registry.remove('log-defence'),e=>e.status===404);
});
test('all lab maintenance methods require admin authentication while public catalog stays read-only',async()=>{
  const{registry}=memory(),app=express();app.use(express.json());app.use('/lab',createRouter({registry,adminAuth:(req,res,next)=>req.headers.authorization==='admin'?next():res.status(401).json({message:'admin required'})}));
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port+'/lab';
  try{
    for(const [method,path]of [['GET','/manage'],['POST','/manage'],['PUT','/manage/log-defence'],['DELETE','/manage/log-defence']])assert.equal((await fetch(base+path,{method,headers:{'Content-Type':'application/json'},...(method==='POST'||method==='PUT'?{body:JSON.stringify(input())}:{})})).status,401);
    assert.equal((await fetch(base+'/manage',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'admin'},body:JSON.stringify(input())})).status,201);
    const publicResponse=await fetch(base);assert.equal(publicResponse.headers.get('cache-control'),'no-store');assert.equal((await publicResponse.json()).data.length,1);
    await fetch(base+'/manage/log-defence',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'admin'},body:JSON.stringify({...input(),enabled:false})});assert.equal((await(await fetch(base)).json()).data.length,0);
  }finally{await new Promise(r=>server.close(r));}
});
test('deleting a referenced miniapp reports a reviewable dependency error',async()=>{
  const registry=createRegistry(async sql=>{if(sql.startsWith('SHOW COLUMNS'))return[{Field:'min_client_version'}];if(sql.startsWith('DELETE'))throw Object.assign(Error(),{code:'ER_ROW_IS_REFERENCED_2'});return{};});
  await assert.rejects(registry.remove('log-defence'),e=>e.status===409&&e.message.includes('实验室入口'));
});
