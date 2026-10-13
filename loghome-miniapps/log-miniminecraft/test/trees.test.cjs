const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {logTreeHeight,logVisitTree}=require('../scripts/trees.cjs');
const types=['oak','spruce','acacia','jungle','bamboo','mushroom'];
function geometry(x,z,type,seed,base=14){const blocks=new Map();logVisitTree(x,z,base,type,seed,(wx,wy,wz,kind)=>{const key=[wx,wy,wz].join(',');if(kind!=='leaves'||!blocks.has(key))blocks.set(key,kind)});return blocks}
test('tree heights and canopy corners vary by coordinates and seed but reproduce exactly',()=>{
 const shapes=new Set(),heights=new Set();
 for(let x=0;x<32;x++){const tree=geometry(x,-9,'oak',42);assert.deepEqual(tree,geometry(x,-9,'oak',42));heights.add(logTreeHeight(x,-9,'oak',42));shapes.add(JSON.stringify([...tree].map(([key,kind])=>[key.split(',').map(Number).map((value,index)=>index===0?value-x:value),kind])))}
 assert.equal(heights.size,3);assert.ok(shapes.size>20);assert.notDeepEqual(geometry(0,0,'oak',1),geometry(0,0,'oak',2));
});
test('all tree trunks stay connected and layered crowns stay within the cross-chunk scan radius',()=>{
 for(const type of types)for(let seed=0;seed<20;seed++){
  const tree=geometry(0,0,type,seed),wood=[...tree].filter(([,kind])=>kind==='wood').map(([key])=>key),seen=new Set([wood[0]]),pending=[wood[0]];
  while(pending.length){const point=pending.pop().split(',').map(Number);for(const offset of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const key=point.map((value,index)=>value+offset[index]).join(',');if(tree.get(key)==='wood'&&!seen.has(key)){seen.add(key);pending.push(key)}}}
  assert.equal(seen.size,wood.length,`${type}/${seed}`);
  for(const key of tree.keys()){const [x,,z]=key.split(',').map(Number);assert.ok(Math.abs(x)<=3&&Math.abs(z)<=3,`${type}: ${key}`)}
  assert.equal(tree.get('0,14,0'),'wood');assert.ok([...tree.values()].includes('leaves'));
 }
});
test('assembling trees across positive/negative chunks and vertical subchunks matches the complete tree',()=>{
 const context={CHUNK_SIZE_X:16,CHUNK_SIZE_Z:16,CHUNK_SIZE_Y_SUB:16,BlockType:{AIR:0,WOOD:1,LEAVES:2,CACTUS:3}};
 vm.createContext(context);const runtime=['logTreeRandom','logTreeHeight','logVisitTree','logGenerateTree'].map(name=>require('../scripts/trees.cjs')[name].toString()).join('\n');vm.runInContext(runtime,context);
 for(const type of types){const expected=geometry(-1,15,type,92),actual=new Map();
  for(const chunkX of [-1,0])for(const chunkZ of [0,1])for(const yStart of [0,16,32]){
   const blocks=new Uint8Array(4096);context.logGenerateTree(blocks,-1,15,14,type,chunkX,chunkZ,yStart,92);
   for(let i=0;i<blocks.length;i++)if(blocks[i])actual.set([chunkX*16+i%16,yStart+Math.floor(i/16)%16,chunkZ*16+Math.floor(i/256)].join(','),blocks[i]===1?'wood':'leaves');
  }
  assert.deepEqual([...actual].sort(),[...expected].sort(),type);
 }
});
test('tree placement does not overwrite existing terrain or construction blocks',()=>{
 const context={CHUNK_SIZE_X:16,CHUNK_SIZE_Z:16,CHUNK_SIZE_Y_SUB:16,BlockType:{AIR:0,WOOD:1,LEAVES:2,CACTUS:3}};vm.createContext(context);
 vm.runInContext(['logTreeRandom','logTreeHeight','logVisitTree','logGenerateTree'].map(name=>require('../scripts/trees.cjs')[name].toString()).join('\n'),context);
 const blocks=new Uint8Array(4096).fill(9);context.logGenerateTree(blocks,8,8,2,'oak',0,0,0,42);assert.ok(blocks.every(value=>value===9));
});
test('both Worker terrain paths call the same tree generator and their emitted code compiles',()=>{
 const {patchBundle}=require('../scripts/build.cjs'),source=patchBundle(fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8'));
 const begin=source.indexOf('CHUNK_LOADER_WORKER_CODE=`')+'CHUNK_LOADER_WORKER_CODE=`'.length,end=source.indexOf('`;FaceDirection.TOP',begin);
 const worker=source.slice(begin,end).replace(/\$\{[^}]+\}/g,'{}');new vm.Script(worker);
 assert.equal((worker.match(/logGenerateTree\(blocks,worldX,worldZ,treeBaseY,treeType,chunkX,chunkZ,yStart,seed\)/g)||[]).length,2);
 assert.ok(worker.includes('const TREE_LEAF_RADIUS = 3;'));
});
test('real terrain keeps its biome and non-vegetation blocks when tree generation is replaced',async()=>{
 const source=fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8'),before=require('../scripts/performance-patches.cjs').patchPerformance(source),after=require('../scripts/trees.cjs').patchTrees(before);
 const names=[...new Set([...source.matchAll(/BlockType\.(\w+)/g)].map(match=>match[1]))].filter(name=>name!=='AIR').sort(),BlockType={AIR:0};for(const name of names)BlockType[name]=Object.keys(BlockType).length;
 function terrain(bundle){const start=bundle.indexOf('CHUNK_LOADER_WORKER_CODE=`')+'CHUNK_LOADER_WORKER_CODE=`'.length;const code=bundle.slice(start,bundle.indexOf('// 同步区块数据到 GameWorker',start)).replace(/\$\{BLOCK_PROPERTIES_PLACEHOLDER\}/g,'{}').replace(/\$\{\w+\}/g,'');const context={BlockType};vm.createContext(context);vm.runInContext(code+';this.generate=async(s,x,z)=>{seed=s;initNoiseSeed(s);return generateChunkDataAsync(x,z)}',context);return context.generate}
 const original=terrain(before),changed=terrain(after),vegetation=new Set([BlockType.WOOD,BlockType.LEAVES,BlockType.CACTUS]);let treeDifferences=0;
 for(const [x,z]of [[0,0],[-1,0],[80,120]]){const a=await original(42,x,z),b=await changed(42,x,z);assert.deepEqual(Buffer.from(a.biomes),Buffer.from(b.biomes));
  for(const [key,row]of a.subChunks){const next=b.subChunks.get(key).blocks;for(let i=0;i<row.blocks.length;i++){if(vegetation.has(row.blocks[i])||vegetation.has(next[i])){if(row.blocks[i]!==next[i])treeDifferences++}else assert.equal(next[i],row.blocks[i],`${x}/${z}/${key}/${i}`)}}
 }
 assert.ok(treeDifferences>0);
});
test('vanilla log texture slots resolve to end grain only on the chosen axis in both Workers',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8'),manifest=require('../public/mods/minecraft-vanilla-1.21/pack.json');
 const mapStart=source.indexOf('const ORIENTATION_FACE_MAP = {'),mapEnd=source.indexOf('// ===== Phase 3:',mapStart);
 const functions=['resolveSlotWithFallbackForWorker','computeTextureIndexForWorker'].map(name=>{const start=source.indexOf('function '+name+'(',mapEnd),end=source.indexOf('\n}',start)+2;return source.slice(start,end)}).join('\n');
 const textureMap=Object.fromEntries(['top','bottom','right','left','front','back'].map((face,index)=>['wood_'+index+'_0',manifest.blocks.wood[face][0]]));
 // Use each actual Worker implementation, including the independently injected one.
 for(const start of [source.indexOf('function computeTextureIndexForWorker(',mapEnd),source.lastIndexOf('function computeTextureIndexForWorker(')]){
  const compute=source.slice(start,source.indexOf('\n}',start)+2);
  const context={RENDER_CONFIG_INDEX:{1:{supportedOrientations:['up','down','north','south','east','west'],defaultOrientation:'up',textureSlots:manifest.blocks.wood}},BLOCK_TYPE_TO_ID_MAP:{1:'wood'},TEXTURE_INDEX_MAP:textureMap};
  vm.createContext(context);vm.runInContext(source.slice(mapStart,mapEnd)+functions.slice(0,functions.indexOf('function computeTextureIndexForWorker'))+compute,context);
  for(const [orientation,ends]of [['up',[0,1]],['down',[0,1]],['north',[4,5]],['south',[4,5]],['east',[2,3]],['west',[2,3]]])for(let face=0;face<6;face++){
   assert.equal(context.computeTextureIndexForWorker(1,face,orientation,0).endsWith('oak_log_top.png'),ends.includes(face),`${orientation}/${face}`);
  }
 }
 assert.ok(manifest.revision>=2);
});
test('existing vanilla material packs upgrade before the revision marker is saved and then skip repeat installation',async()=>{
 const {installVanillaPack}=await import('../public/mods/minecraft-vanilla-1.21/install.js'),manifest=require('../public/mods/minecraft-vanilla-1.21/pack.json'),previousFetch=global.fetch;
 let pack={id:manifest.id,builtin_revision:1};const calls=[],records=new Map([['custom-block',{id:'custom-block',mod_pack_id:'user-pack'}]]);
 const api={getModPack:async()=>pack,createDefaultModPackData:()=>({blocks:Object.keys(manifest.blocks).map(id=>({id}))}),
  saveAllCustomBlocks:async blocks=>{calls.push('blocks');for(const block of blocks)records.set(block.id,block)},saveAllModAssets:async()=>calls.push('assets'),saveModPack:async value=>{calls.push('marker');pack=value}};
 try{global.fetch=async()=>({ok:true,json:async()=>manifest});await installVanillaPack(api);
  assert.deepEqual(calls,['blocks','assets','marker']);assert.ok(records.has('custom-block'));assert.ok(records.get('wood').textures.front[0].endsWith('oak_log_top.png'));assert.equal(pack.builtin_revision,manifest.revision);
  await installVanillaPack(api);assert.equal(calls.length,3);
 }finally{global.fetch=previousFetch}
});
