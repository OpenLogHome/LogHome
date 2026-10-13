const test=require('node:test'),assert=require('node:assert/strict');
async function fixture(){
 const {createLoading}=await import('../src/loading.js');const nodes=new Map(),frames=[];
 const document={getElementById(id){if(!nodes.has(id))nodes.set(id,{dataset:{},setAttribute(key,value){this[key]=value}});return nodes.get(id)}};
 return {loading:createLoading(document,fn=>frames.push(fn)),nodes,frames};
}
test('loading cover stays until React readiness and two paint frames; stages never regress',async()=>{
 const {loading,nodes,frames}=await fixture();loading.stage(4,'准备材质');loading.stage(2,'重复同步');assert.equal(nodes.get('loading-progress').value,4);
 let done=false;const waiting=loading.waitForReady().then(()=>done=true);
 loading.ready();loading.ready();assert.equal(frames.length,1);assert.equal(done,false);
 frames.shift()();assert.equal(nodes.get('game-loading').hidden,undefined);frames.shift()();await waiting;
 assert.equal(done,true);assert.equal(nodes.get('game-loading').hidden,true);assert.equal(loading.active,false);
});
test('startup failure stays visible, cancels pending readiness and cannot turn into success',async()=>{
 const {loading,nodes,frames}=await fixture();const waiting=loading.waitForReady();loading.ready();loading.fail('下载失败');
 await assert.rejects(waiting,/下载失败/);frames.shift()();frames.shift()();
 assert.notEqual(nodes.get('game-loading').hidden,true);assert.equal(nodes.get('game-loading').dataset.error,'true');
 await assert.rejects(loading.waitForReady(),/下载失败/);
});
test('missing React readiness becomes an actionable failure instead of an endless loading cover',async()=>{
 const {loading,nodes}=await fixture();await assert.rejects(loading.waitForReady(5),/准备超时/);
 assert.equal(nodes.get('game-loading').dataset.error,'true');
});
