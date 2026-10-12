const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {patchPerformance, logMarkAttribute, logSetAttribute} = require('../scripts/performance-patches.cjs');
const original = fs.readFileSync(require('node:path').join(__dirname, '../vendor/game.bundle.js'), 'utf8');
const patched = patchPerformance(original);
function terrain(source) {
  const start = source.indexOf('CHUNK_LOADER_WORKER_CODE=`') + 'CHUNK_LOADER_WORKER_CODE=`'.length;
  let code = source.slice(start, source.indexOf('// 同步区块数据到 GameWorker', start));
  const names = [...new Set([...code.matchAll(/BlockType\.(\w+)/g)].map(m => m[1]))];
  const types = {AIR: 0};
  for (const name of names) if (!(name in types)) types[name] = Object.keys(types).length;
  code = code.replace(/\$\{BLOCK_PROPERTIES_PLACEHOLDER\}/g, '{}').replace(/\$\{\w+\}/g, '');
  const ctx = {BlockType: types};
  vm.runInNewContext(code + `;this.generate=async(s,x,z)=>{seed=s;initNoiseSeed(s);return generateChunkDataAsync(x,z)};`, ctx);
  return ctx.generate;
}
test('real terrain generator preserves every block and biome across seeds and chunk boundaries', async (t) => {
  let emptyCount=0, totalCount=0;
  const before = terrain(original), after = terrain(patched);
  for (const seed of [0, 42, 12345]) for (const [x,z] of [[0,0],[-1,0],[1,-1],[80,120]]) {
    const a = await before(seed,x,z), b = await after(seed,x,z);
    assert.deepEqual(Buffer.from(a.biomes), Buffer.from(b.biomes));
    assert.equal(a.subChunks.size,b.subChunks.size);
    for(const row of b.subChunks.values()){totalCount++;if(row.empty)emptyCount++;}
    for (const [key, chunk] of a.subChunks) assert.deepEqual(Buffer.from(chunk.blocks), Buffer.from(b.subChunks.get(key).blocks), `${seed}/${x}/${z}/${key}`);
  }
  assert.ok(emptyCount>0);
  t.diagnostic(`Sparse sample: ${emptyCount}/${totalCount} empty subchunks; ${emptyCount*4096} bytes of per-subchunk arrays avoided (one shared 4096-byte air buffer per Worker).`);
});
function attribute(size=128) {return {array:new Float32Array(size),updateRanges:[],needsUpdate:false};}
test('disjoint dirty regions remain small and pending changes survive subsequent writes', () => {
  const a=attribute();
  logMarkAttribute(a,2,3);logMarkAttribute(a,100,2);logMarkAttribute(a,4,3);
  assert.deepEqual(a.updateRanges,[{start:2,count:5},{start:100,count:2}]);
  logMarkAttribute(a,7,93);
  assert.deepEqual(a.updateRanges,[{start:2,count:100}]);
  a.updateRanges.length=0; // Renderer consumed the previous upload.
  logSetAttribute(a,9,4);
  assert.deepEqual(a.updateRanges,[{start:9,count:1}]);
  a.updateRanges.length=0;a.needsUpdate=false;
  logSetAttribute(a,9,4);
  assert.equal(a.needsUpdate,false);
});
function getClass(source,start,end,name,extra={}) {
  const ctx={logMarkAttribute,logSetAttribute,console,Date,CHUNK_SIZE_X:16,CHUNK_SIZE_Z:16,CHUNK_SIZE_Y_SUB:16,...extra};
  vm.runInNewContext(source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start))).replaceAll('import.meta.url', '"test"')+`;this.Result=${name}`,ctx);
  return ctx.Result;
}
const Manager=getClass(patched,'ho=class ho{','let RenderManager=ho;','ho');
test('terrain edits upload only touched components; furnace updates do not dirty matrices',()=>{
  const m=Object.create(Manager.prototype), matrix=attribute(131072*16),texture=attribute(131072),scale=attribute(131072*2);
  const c={mesh:{instanceMatrix:matrix,count:10},textureIndexAttribute:texture,instanceScaleAttribute:scale};
  Object.assign(m,{perfMonitorEnabled:false,chunks:new Map(),stats:{activeChunks:0,totalInstances:0},pendingUpdates:new Set(),containerDirtyRanges:new Map(),multiStateFaceIndices:new Map(),pendingFurnaceTextureUpdates:[],containerPool:new Map(),ensureContainerAtIndex:()=>c,getContainer:()=>c});
  m.uploadInstances(0,0,0,[{direction:0,startIdx:3,count:1,matrices:new Float32Array(16).fill(2),textureIndices:new Float32Array([4]),scales:new Float32Array([1,1])}],[]);
  assert.deepEqual(matrix.updateRanges,[{start:48,count:16}]);
  matrix.updateRanges.length=0;texture.updateRanges.length=0;scale.updateRanges.length=0;
  m.multiStateFaceIndices.set('1,2,3_front',{direction:0,containerIndex:0,instanceIndex:3});
  m.executeFurnaceTextureUpdate(1,2,3,true,8,4);
  m.flushPendingUpdates();
  assert.deepEqual(texture.updateRanges,[{start:3,count:1}]);
  assert.equal(matrix.updateRanges.length,0);assert.equal(scale.updateRanges.length,0);
});
test('export drift aborts build instead of silently dropping optimizations',()=>{
  assert.throws(()=>patchPerformance(original.replace('ho=class ho{','ho=class changed{')), /boundary/);
});
class Matrix {
  constructor(){this.elements=new Float32Array(16);}
  fromArray(a){this.elements.set(a);return this;}
  makeScale(){this.elements.fill(0);this.elements[15]=1;return this;}
}
const Shared=getClass(patched,'class SharedMeshManager{','const NON_BLOCK_DROPPED_ITEM_INDEX_START','SharedMeshManager',{Matrix4:Matrix});
test('door animation uploads matrices without reuploading unchanged textures; clear/hide stay local',()=>{
  const m=Object.create(Shared.prototype),indices={right:1,left:2,top:3,bottom:4,front:5,back:6};
  Object.assign(m,{mesh:{instanceMatrix:attribute(8192*16),count:0,setMatrixAt(i,v){this.instanceMatrix.array.set(v.elements,i*16);}},tempMatrix:new Matrix(),textureIndexAttributes:Array.from({length:6},()=>attribute()),flipFrontUVAttribute:attribute(),flipBackUVAttribute:attribute(),doorOrientationAttribute:attribute(),getTorchTextureIndices:()=>indices,getDoorTextureIndices:()=>indices,getDoorTextureIndicesForOrientation:()=>indices});
  const row={instanceIndex:3,instanceType:1,orientation:'east',hingePosition:'right',matrix:new Float32Array(16).fill(1)};
  m.uploadInstances([row],3);
  const attrs=[m.mesh.instanceMatrix,...m.textureIndexAttributes,m.flipFrontUVAttribute,m.flipBackUVAttribute,m.doorOrientationAttribute];
  for(const a of attrs){a.updateRanges.length=0;a.needsUpdate=false;}
  row.matrix[12]=5;m.uploadInstances([row],3);
  assert.deepEqual(m.mesh.instanceMatrix.updateRanges,[{start:48,count:16}]);
  for(const a of attrs.slice(1))assert.equal(a.needsUpdate,false);
  m.hideInstance(3);m.clearInstances([4],3);
  assert.deepEqual(m.mesh.instanceMatrix.updateRanges,[{start:48,count:32}]);
  assert.equal(m.mesh.count,4);
});
test('active and pooled geometry, materials and expired caches are released',()=>{
  const ManagerWithResources=getClass(patched,'ho=class ho{','let RenderManager=ho;','ho',{Matrix4:Matrix,Vector3:class{},disposeTextureArray(){}});
  const m=Object.create(ManagerWithResources.prototype),counts={};
  const resource=name=>({dispose(){counts[name]=(counts[name]||0)+1;}});
  const container=name=>({mesh:{...resource(name),geometry:resource(name+'Geometry')}});
  const expired=container('expired'),pooled=container('pooled');
  Object.assign(m,{chunks:new Map(),containers:new Map([[0,[container('opaque')]]]),transparentContainers:new Map([[0,[container('transparent')]]]),waterContainers:new Map([[0,[container('water')]]]),scene:{remove(){}},geometries:[resource('base')],containerPool:new Map([['x',[expired,pooled]]]),containerPoolTimestamps:new Map([[expired,Date.now()-31000],[pooled,Date.now()]]),pendingUpdates:new Set(),containerDirtyRanges:new Map(),stats:{},pendingFurnaceTextureUpdates:[]});
  for(const key of ['arrayTextureMaterial','transparentArrayTextureMaterial','waterArrayTextureMaterial','depthArrayTextureMaterial'])m[key]=resource(key);
  m.flushPendingUpdates();assert.equal(counts.expiredGeometry,1);assert.equal(m.containerPool.get('x').length,1);
  m.dispose();m.dispose();
  for(const name of ['opaque','transparent','water','pooled','expired']){assert.equal(counts[name],1);assert.equal(counts[name+'Geometry'],1);}
  for(const key of ['arrayTextureMaterial','transparentArrayTextureMaterial','waterArrayTextureMaterial','depthArrayTextureMaterial'])assert.equal(counts[key],1);
});
test('recycled terrain containers retain clear and replacement uploads until consumed',()=>{
  const m=Object.create(Manager.prototype),c={mesh:{instanceMatrix:attribute(256),count:4},textureIndexAttribute:attribute(16),instanceScaleAttribute:attribute(32),maxUsedIndex:3};
  c.mesh.instanceMatrix.array.fill(9);
  Object.assign(m,{perfMonitorEnabled:false,chunks:new Map(),stats:{activeChunks:1,totalInstances:4,totalMeshes:1},pendingUpdates:new Set(),containerDirtyRanges:new Map(),multiStateFaceIndices:new Map(),getContainer:()=>c,ensureContainerAtIndex:()=>c,getZeroArray:n=>new Float32Array(n*16),getTextureIndexZeroArray:n=>new Float32Array(n)});
  m.clearInstances(0,0,0,[{direction:0,startIdx:1,count:2}],[{direction:0,maxUsedIndex:3}],[]);
  m.uploadInstances(0,0,0,[{direction:0,startIdx:1,count:1,matrices:new Float32Array(16).fill(7),textureIndices:new Float32Array([5]),scales:new Float32Array([1,1])}],[]);
  assert.deepEqual(c.mesh.instanceMatrix.updateRanges,[{start:16,count:32}]);
  assert.ok(c.mesh.instanceMatrix.array.subarray(16,32).every(v=>v===7));
  assert.ok(c.mesh.instanceMatrix.array.subarray(32,48).every(v=>v===0));
});
