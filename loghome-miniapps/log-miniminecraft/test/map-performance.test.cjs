const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {patchPerformance}=require('../scripts/performance-patches.cjs');
const helpers=require('../scripts/map-performance-patches.cjs');
const original=fs.readFileSync(require('node:path').join(__dirname,'../vendor/game.bundle.js'),'utf8');
const patched=patchPerformance(original);
const types={AIR:0,STONE:1,WATER:2,LEAVES:3,GLASS:4,WOOD:5};
for(const [,name] of original.matchAll(/BlockType\.(\w+)/g))if(!(name in types))types[name]=Object.keys(types).length;
function literal(source,name){
  const start=source.indexOf(name+'=`')+name.length+2;
  assert.ok(start>name.length+1);
  let end=start;
  for(;end<source.length;end++){if(source[end]==='\\'){end++;continue;}if(source[end]==='`')break;}
  return source.slice(start,end);
}
function loader(source,extra={}){
  let code=literal(source,'CHUNK_LOADER_WORKER_CODE');
  code=code.replace(/\$\{BLOCK_PROPERTIES_PLACEHOLDER\}/g,JSON.stringify({2:{liquid:true},3:{leaves:true}})).replace(/\$\{\w+\}/g,'');
  const ctx={BlockType:types,FACE_COUNT:6,TRANSPARENT_BLOCKS:new Set([0,2,3,4]),self:{},console,
    isTorchBlock:()=>false,isDoorBlock:()=>false,hasOrientationForWorker:()=>false,
    computeTextureIndexForWorker:(block,dir)=>block*6+dir,...extra};
  vm.runInNewContext(code+`;this.api={syncChunkToGameWorker,setPort:port=>{gameWorkerPort=port},tryCullChunk,executeCullingWithCachedData,generateChunkDataAsync,applyModifiedBlocksToChunk,collectExposedFacesFromChunk,collectExposedFacesFromChunkWithCache,handleNeighborDataResponse,getBlockAt,setBlockAt,chunks,neighborDataCache,modifiedBlocks,modifiedBlocksByChunk,initNoiseSeed};`,ctx);
  return ctx.api;
}
function game(source){
  // Decode escapes in the outer bundle's template before compiling Worker code.
  const code=vm.runInNewContext('`'+literal(source,'GAME_LOGIC_MANAGER_CODE')+'`');
  const ctx={BlockType:types,CHUNK_SIZE_X:16,CHUNK_SIZE_Z:16,CHUNK_SIZE_Y_SUB:16,
    ChunkState:{READY:'READY',RENDERED:'RENDERED'},isBlockLiquidForWorker:b=>b===types.WATER,
    tempCopyCount:0,sendToMain(){},console};
  vm.runInNewContext(code+';this.Game=GameLogicManager',ctx);
  return Object.create(ctx.Game.prototype);
}
function sub(y,blocks=new Uint8Array(4096)){return {chunkY:y,blocks};}
function chunk(x=0,z=0,rows=[sub(0)]){return {x,z,subChunks:new Map(rows.map(s=>[String(s.chunkY),s])),state:'READY'};}
function plain(v){return JSON.parse(JSON.stringify(v));}
test('both complete patched Worker sources compile',()=>{loader(patched);game(patched);});
test('air markers share storage, serialize without arrays and detach neither source nor air storage',()=>{
  const a=helpers.logCompactSubChunk(sub(0)),b=helpers.logCompactSubChunk(sub(1));
  assert.equal(a.blocks,b.blocks);assert.equal(a.empty,true);
  assert.deepEqual(helpers.logSerializeSubChunk(a),{chunkY:0,empty:true});
  helpers.logWriteBlock(a,17,types.STONE);
  assert.notEqual(a.blocks,b.blocks);assert.equal(b.blocks[17],0);
  assert.equal(a.nonAirCount,1);
  helpers.logWriteBlock(a,17,0);
  assert.equal(a.blocks,b.blocks);assert.equal(a.empty,true);
});
test('save edits, air reversion and later placement preserve sparse data without mutating other markers',()=>{
  const l=loader(patched),c=chunk(0,0,[helpers.logCompactSubChunk(sub(0)),helpers.logCompactSubChunk(sub(1))]);
  l.chunks.set('0,0',c);
  l.modifiedBlocks.set('0,0,0',types.STONE);l.modifiedBlocks.set('1,16,0',0);
  l.modifiedBlocksByChunk.set('0,0',new Map(l.modifiedBlocks));
  assert.deepEqual(plain(l.applyModifiedBlocksToChunk(c,0,0)),['1,16,0']);
  assert.equal(l.getBlockAt(0,0,0),types.STONE);assert.equal(l.getBlockAt(0,16,0),0);
  assert.equal(l.setBlockAt(0,0,0,0),true);assert.equal(c.subChunks.get('0').empty,true);
  assert.equal(l.setBlockAt(0,16,0,types.STONE),true);assert.equal(l.getBlockAt(0,0,0),0);
});
test('GameWorker edits rebuild all boundary neighbors and clear the final removed block',()=>{
  const g=game(patched),c=chunk(-1,-1,[helpers.logCompactSubChunk(sub(0))]);
  Object.assign(g,{chunks:new Map([['-1,-1',c]]),modifiedBlocks:new Map(),modifiedBlocksByChunk:new Map()});
  const rebuilt=[];
  g.rebuildSubChunkFaces=(x,z,y)=>rebuilt.push([x,z,y]);
  g.chunks.set('-2,-1',chunk(-2,-1));g.chunks.set('-1,-2',chunk(-1,-2));
  assert.equal(g.setBlockAt(-16,0,-16,types.STONE),true);
  assert.equal(g.getBlockAt(-16,0,-16),types.STONE);
  assert.ok(rebuilt.some(p=>p[0]===-2&&p[1]===-1));assert.ok(rebuilt.some(p=>p[0]===-1&&p[1]===-2));
  assert.equal(g.setBlockAt(-16,0,-16,0),true);assert.equal(c.subChunks.get('0').empty,true);
  const fresh=game(patched);fresh.chunks=g.chunks;
  const uploads=[];
  fresh.classifyFacesByTypeAndDirection=()=>[];fresh.applyGreedyMeshing=()=>[];fresh.computeInstanceMatrices=()=>({matrixData:[]});
  fresh.uploadChunkFaces=(c,data,y)=>uploads.push({data,y});
  fresh.rebuildSubChunkFaces(-1,-1,0);
  assert.deepEqual(plain(uploads),[{data:[],y:0}]);
});
test('neighbor messages transfer only walls; all four walls and cached water/leaf faces match original',()=>{
  const g=game(patched), neighbors=[[1,0],[-1,0],[0,1],[0,-1]];
  const rows=neighbors.map(([x,z],n)=>{
    const blocks=Uint8Array.from({length:4096},(_,i)=>(i*7+n)%5);
    return chunk(x,z,[sub(0,blocks),helpers.logCompactSubChunk(sub(1))]);
  });
  let message,bytes=0;
  g.chunks=new Map(rows.map(c=>[c.x+','+c.z,c]));
  g.chunkLoaderGamePort={postMessage(data,transfer){bytes=transfer.reduce((n,b)=>n+b.byteLength,0);message=structuredClone(data,{transfer});assert.ok(transfer.every(b=>b.byteLength===0));}};
  g.handleNeighborDataRequest(0,0,neighbors.map(([x,z])=>({x,z})));
  assert.equal(bytes,4*1024);
  for(const [n,data]of message.neighborData.entries()){
    const packed=data.subChunks[0],full=rows[n].subChunks.get('0').blocks;
    assert.equal(full.byteLength,4096);assert.ok(data.subChunks[1].empty);assert.equal(data.subChunks[1].blocks,undefined);
    for(let i=0;i<4096;i++){const x=i%16,z=Math.floor(i/256);if(x===0||x===15||z===0||z===15)assert.equal(helpers.logReadBoundary(packed,i),full[i]);}
  }
  const old=loader(original),updated=loader(patched);
  const centerBlocks=Uint8Array.from({length:4096},(_,i)=>i%5);
  const center=chunk(0,0,[sub(0,centerBlocks),sub(1),sub(-1)]);
  old.chunks.set('0,0',center);updated.chunks.set('0,0',chunk(0,0,[sub(0,centerBlocks),helpers.logCompactSubChunk(sub(1)),helpers.logCompactSubChunk(sub(-1))]));
  for(const row of rows)old.chunks.set(row.x+','+row.z,row);
  updated.handleNeighborDataResponse(message);
  assert.deepEqual(plain(updated.collectExposedFacesFromChunkWithCache(updated.chunks.get('0,0'))),plain(old.collectExposedFacesFromChunkWithCache(center)));
});
test('both initial cull paths transfer matrices, texture indices and scales without cloning',()=>{
  for(const cached of [false,true]){
    const arrays={matrices:new Float32Array(16).fill(1),textureIndices:new Float32Array([7]),scales:new Float32Array([1,1])};
    const l=loader(patched,{classifyFacesByTypeAndDirection:f=>f,applyGreedyMeshing:f=>f,computeInstanceMatrices:()=>({matrixData:[{blockType:1,directions:[arrays]}]})});
    const blocks=new Uint8Array(4096);blocks[0]=types.STONE;
    const center=chunk(0,0,[sub(0,blocks)]);center.state='GENERATED';
    l.chunks.set('0,0',center);
    for(const [x,z]of [[1,0],[-1,0],[0,1],[0,-1]])l.chunks.set(x+','+z,chunk(x,z));
    let sent;
    l.setPort({postMessage(data,transfer){sent=structuredClone(data,{transfer});}});
    if(cached)l.executeCullingWithCachedData(center);else assert.equal(l.tryCullChunk(0,0),true);
    assert.equal(sent.type,'CULL_RESULT_BATCH');
    assert.deepEqual(Array.from(sent.subChunks[0].matrixData[0].directions[0].textureIndices),[7]);
    for(const array of Object.values(arrays))assert.equal(array.byteLength,0);
  }
});
test('initial chunk synchronization omits empty buffers while preserving full collision data',()=>{
  const l=loader(patched),blocks=new Uint8Array(4096);blocks[4]=types.STONE;
  const c=chunk(0,0,[helpers.logCompactSubChunk(sub(0)),sub(1,blocks)]);
  let sent;
  l.setPort({postMessage(data){sent=structuredClone(data);}});
  l.syncChunkToGameWorker(c);
  assert.equal(sent.subChunks[0].empty,true);assert.equal(sent.subChunks[0].blocks,undefined);
  assert.equal(sent.subChunks[1].blocks.byteLength,4096);assert.equal(sent.subChunks[1].blocks[4],types.STONE);
  assert.equal(blocks.byteLength,4096); // The loader still needs the original for culling.
  const restored=sent.subChunks.map(helpers.logRestoreSubChunk);
  helpers.logWriteBlock(restored[0],4,types.LEAVES);
  assert.equal(restored[1].blocks[4],types.STONE);
  assert.equal(c.subChunks.get('0').blocks[4],0);
});
