// Coordinate randomness, never generation order: adjacent chunks rebuild one tree.
function logTreeRandom(x,z,seed,salt){
 let hash=Math.imul(x,374761393)^Math.imul(z,668265263)^Math.imul(seed,1274126177)^Math.imul(salt,1442695041);
 hash=Math.imul(hash^(hash>>>13),1274126177);hash^=hash>>>16;
 return (hash>>>0)/4294967296;
}
function logTreeHeight(x,z,type,seed){
 const ranges={oak:[4,3],spruce:[6,4],acacia:[4,3],jungle:[7,5],bamboo:[8,6],mushroom:[4,3],cactus:[2,3]};
 const range=ranges[type]||ranges.oak;return range[0]+Math.floor(logTreeRandom(x,z,seed,1)*range[1]);
}
function logVisitTree(x,z,base,type,seed,visit,height=logTreeHeight(x,z,type,seed)){
 const random=salt=>logTreeRandom(x,z,seed,salt);
 const direction=Math.floor(random(2)*4),dx=[1,-1,0,0][direction],dz=[0,0,1,-1][direction];
 const bent=type==='acacia';
 for(let y=0;y<height;y++){
  const offset=bent&&y>=height-2?1:0;
  visit(x+dx*offset,base+y,z+dz*offset,type==='cactus'?'cactus':'wood');
  if(bent&&y===height-3)visit(x+dx,base+y,z+dz,'wood');
 }
 if(type==='cactus')return;
 function layer(y,radius,cx=0,cz=0,rounded=false,cutCorners=false){
  for(let lx=-radius;lx<=radius;lx++)for(let lz=-radius;lz<=radius;lz++){
   if(rounded&&lx*lx+lz*lz>radius*radius)continue;
   if(radius>0&&Math.abs(lx)===radius&&Math.abs(lz)===radius&&(cutCorners||random(100+y*31+lx*7+lz*13)<.5))continue;
   visit(x+cx+lx,base+y,z+cz+lz,'leaves');
  }
 }
 if(type==='spruce'){
  const skirt=4+Math.floor(random(3)*2),variant=Math.floor(random(4)*2);
  for(let depth=skirt;depth>=0;depth--){let radius=Math.min(2,Math.ceil(depth/2));if(depth>1&&depth%2===variant)radius=Math.max(1,radius-1);layer(height-depth,radius,0,0,false,true)}
 }else if(type==='acacia'){
  layer(height-1,2,dx,dz);layer(height,1,dx,dz,false,true);
  if(random(5)<.5){visit(x-dx,base+height-3,z-dz,'wood');visit(x-dx,base+height-2,z-dz,'wood');layer(height-1,1,-dx,-dz,false,true)}
 }else if(type==='jungle'){
  for(let y=-3;y<=1;y++)layer(height+y,y< -1?3:y<1?2:1,0,0,false,y===1);
 }else if(type==='bamboo'){
  for(let y=-1;y<=1;y++)layer(height+y,1,0,0,false,true);
 }else if(type==='mushroom'){
  for(let y=0;y<=2;y++)layer(height+y,y===1?3:2,0,0,true);
 }else{
  // Dense, layered small-oak canopy with seeded missing corners; no hollow sphere.
  for(let y=-3;y<=0;y++)layer(height+y,y<=-2?2:1,0,0,false,y===0);
 }
}
function logGenerateTree(blocks,x,z,base,type,chunkX,chunkZ,yStart,seed){
 const height=logTreeHeight(x,z,type,seed);
 if(base>=yStart+CHUNK_SIZE_Y_SUB||base+height+2<yStart)return;
 logVisitTree(x,z,base,type,seed,(wx,wy,wz,kind)=>{
  const lx=wx-chunkX*CHUNK_SIZE_X,lz=wz-chunkZ*CHUNK_SIZE_Z,ly=wy-yStart;
  if(lx<0||lx>=CHUNK_SIZE_X||lz<0||lz>=CHUNK_SIZE_Z||ly<0||ly>=CHUNK_SIZE_Y_SUB)return;
  const index=lx+ly*CHUNK_SIZE_X+lz*CHUNK_SIZE_X*CHUNK_SIZE_Y_SUB;
  const old=blocks[index];
  if(kind==='leaves'){if(old===BlockType.AIR)blocks[index]=BlockType.LEAVES}
  else if(old===BlockType.AIR||old===BlockType.LEAVES)blocks[index]=kind==='cactus'?BlockType.CACTUS:BlockType.WOOD;
 },height);
}
function patchTrees(source){
 const workerStart=source.indexOf('CHUNK_LOADER_WORKER_CODE=`'),workerEnd=source.indexOf('`;FaceDirection.TOP',workerStart);
 if(workerStart<0||workerEnd<0)throw Error('Missing tree Worker boundary');
 let worker=source.slice(workerStart,workerEnd);
 const start=worker.indexOf('function generateTreeLeaves('),end=worker.indexOf('/**\n * 检查相邻区块的树木',start);
 if(start<0||end<0)throw Error('Missing shared tree leaves boundary');
 worker=worker.slice(0,start)+`function generateTreeLeaves(blocks,x,z,base,type,chunkX,chunkZ,yStart,seed){logGenerateTree(blocks,x,z,base,type,chunkX,chunkZ,yStart,seed)}\n\n`+worker.slice(end);
 for(const [begin,endMarker]of [
  ['          // 简化的树木生成','\n        }\n      }\n\n      // 生成跨区块的树叶'],
  ['          // 根据树木类型生成不同的树','\n        }\n      }\n    }\n\n    // 生成相邻区块延伸到当前区块的树叶']
 ]){const a=worker.indexOf(begin),b=worker.indexOf(endMarker,a);if(a<0||b<0)throw Error('Missing tree generation boundary: '+begin);worker=worker.slice(0,a)+'          logGenerateTree(blocks,worldX,worldZ,treeBaseY,treeType,chunkX,chunkZ,yStart,seed);'+worker.slice(b)}
 if(worker.split('const TREE_LEAF_RADIUS = 2;').length!==2)throw Error('Missing tree radius boundary');
 worker=worker.replace('const TREE_LEAF_RADIUS = 2;','const TREE_LEAF_RADIUS = 3;');
 const runtime=[logTreeRandom,logTreeHeight,logVisitTree,logGenerateTree].map(fn=>fn.toString()).join('\n');
 worker=worker.replace('CHUNK_LOADER_WORKER_CODE=`','CHUNK_LOADER_WORKER_CODE=`\n'+runtime+'\n');
 return source.slice(0,workerStart)+worker+source.slice(workerEnd);
}
module.exports={patchTrees,logTreeRandom,logTreeHeight,logVisitTree,logGenerateTree};
