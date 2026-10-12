// Both Workers receive their own read-only air buffer. Never transfer this buffer.
const LOG_EMPTY_BLOCKS = new Uint8Array(4096);
function logCompactSubChunk(subChunk) {
  if (subChunk.empty) return subChunk;
  let count = 0;
  for (const block of subChunk.blocks) if (block !== 0) count++;
  subChunk.nonAirCount = count;
  if (count === 0) { subChunk.empty = true; subChunk.blocks = LOG_EMPTY_BLOCKS; }
  return subChunk;
}
function logWriteBlock(subChunk, index, value) {
  if (subChunk.nonAirCount === undefined) logCompactSubChunk(subChunk);
  const old = subChunk.blocks[index];
  if (old === value) return;
  if (subChunk.empty) { subChunk.blocks = new Uint8Array(4096); subChunk.empty = false; }
  subChunk.blocks[index] = value;
  subChunk.nonAirCount += (value !== 0 ? 1 : 0) - (old !== 0 ? 1 : 0);
  if (subChunk.nonAirCount === 0) { subChunk.empty = true; subChunk.blocks = LOG_EMPTY_BLOCKS; }
}
function logSerializeSubChunk(subChunk) {
  return subChunk.empty ? {chunkY: subChunk.chunkY, empty: true} : {chunkY: subChunk.chunkY, blocks: subChunk.blocks};
}
function logRestoreSubChunk(data) {
  return data.empty ? {chunkY: data.chunkY, empty: true, nonAirCount: 0, blocks: LOG_EMPTY_BLOCKS}
    : logCompactSubChunk({chunkY: data.chunkY, blocks: data.blocks});
}
// Keep all four walls so a cached neighbor remains valid for requests from
// any horizontal direction. Corners are intentionally duplicated (1024 bytes).
function logPackBoundary(subChunk) {
  if (subChunk.empty) return {chunkY: subChunk.chunkY, empty: true};
  const boundary = new Uint8Array(1024), blocks = subChunk.blocks;
  for (let y = 0; y < 16; y++) for (let p = 0; p < 16; p++) {
    const i = y * 16 + p;
    boundary[i] = blocks[y * 16 + p * 256];
    boundary[256 + i] = blocks[15 + y * 16 + p * 256];
    boundary[512 + i] = blocks[p + y * 16];
    boundary[768 + i] = blocks[p + y * 16 + 15 * 256];
  }
  return {chunkY: subChunk.chunkY, boundary};
}
function logReadBoundary(subChunk, index) {
  if (subChunk.empty) return 0;
  if (subChunk.blocks) return subChunk.blocks[index]; // Neighbor still local.
  const x = index % 16, y = Math.floor(index / 16) % 16, z = Math.floor(index / 256);
  if (x === 0) return subChunk.boundary[y * 16 + z];
  if (x === 15) return subChunk.boundary[256 + y * 16 + z];
  if (z === 0) return subChunk.boundary[512 + y * 16 + x];
  if (z === 15) return subChunk.boundary[768 + y * 16 + x];
  throw Error('Neighbor boundary queried at an interior voxel');
}
const runtime = 'const LOG_EMPTY_BLOCKS = new Uint8Array(4096);\n' +
  [logCompactSubChunk, logWriteBlock, logSerializeSubChunk, logRestoreSubChunk, logPackBoundary, logReadBoundary].map(fn=>fn.toString()).join('\n') + '\n';
function replaceOnce(source, before, after) {
  if (source.split(before).length !== 2) throw Error('Map performance patch boundary changed: ' + before.slice(0,100));
  return source.replace(before, after);
}
function patchMapPerformance(source) {
  // Patch only literal Worker code, never main-thread Three.js internals.
  function section(start, end, transform) {
    const a=source.indexOf(start), b=source.indexOf(end,a+start.length);
    if(a<0||b<0)throw Error('Missing Worker boundary: '+start);
    source=source.slice(0,a)+transform(source.slice(a,b))+source.slice(b);
  }
  section('CHUNK_LOADER_WORKER_CODE=`','`;FaceDirection.TOP', code=>{
    code=replaceOnce(code,'CHUNK_LOADER_WORKER_CODE=`','CHUNK_LOADER_WORKER_CODE=`\n'+runtime);
    code=replaceOnce(code,'{ chunkY: result.chunkY, blocks: result.blocks }','logCompactSubChunk({ chunkY: result.chunkY, blocks: result.blocks })');
    // All block mutations use copy-on-write, including save replay.
    if(code.split('subChunk.blocks[index] = blockType;').length!==3)throw Error('Loader write boundaries changed');
    code=code.replaceAll('subChunk.blocks[index] = blockType;','logWriteBlock(subChunk, index, blockType);');
    code=replaceOnce(code,`subChunksArray.push({
      chunkY: subChunk.chunkY,
      blocks: subChunk.blocks, // Uint8Array 可以通过 postMessage 传输
    });`,'subChunksArray.push(logSerializeSubChunk(subChunk));');
    code=replaceOnce(code,`{
          chunkY: subChunk.chunkY,
          blocks: subChunk.blocks
        }`,'subChunk.empty ? logRestoreSubChunk(subChunk) : subChunk');
    // Skip scanning markers but keep their presence for water boundary rules.
    if(code.split('const blocks = subChunk.blocks;').length!==4)throw Error('Loader scan boundaries changed');
    code=code.replaceAll('const blocks = subChunk.blocks;','if (subChunk.empty) continue;\n    const blocks = subChunk.blocks;');
    const a=code.indexOf('function collectExposedFacesFromChunkWithCache('),b=code.indexOf('function collectExposedFacesFromChunk(',a);
    let cached=code.slice(a,b);
    for(const dir of ['px','nx','pz','nz'])cached=replaceOnce(cached,dir+'SubChunk.blocks['+dir+'Index]','logReadBoundary('+dir+'SubChunk, '+dir+'Index)');
    code=code.slice(0,a)+cached+code.slice(b);
    // Two initial cull paths omitted texture indices from their transfer list.
    for(const [start,end] of [['function tryCullChunk(', 'function requestNeighborDataAndCull('],['function executeCullingWithCachedData(', 'function collectExposedFacesFromChunkWithCache(']]) {
      const x=code.indexOf(start),y=code.indexOf(end,x);
      let part=code.slice(x,y);
      part=replaceOnce(part,'allTransferables.push(dirData.scales.buffer);','allTransferables.push(dirData.scales.buffer);\n        }\n        if (dirData.textureIndices && dirData.textureIndices.buffer) {\n          allTransferables.push(dirData.textureIndices.buffer);');
      code=code.slice(0,x)+part+code.slice(y);
    }
    return code;
  });
  section('GAME_LOGIC_MANAGER_CODE=`','class GameLogicManager {',code=>code+runtime);
  // This class is embedded as Worker source; method boundaries are unique.
  section('class GameLogicManager {','\n  // 处理邻接区块数据请求',code=>{
    code=replaceOnce(code,'{ chunkY: result.chunkY, blocks: result.blocks }','logCompactSubChunk({ chunkY: result.chunkY, blocks: result.blocks })');
    code=replaceOnce(code,`{
        chunkY: subChunk.chunkY,
        blocks: subChunk.blocks,
      });`,'logRestoreSubChunk(subChunk));');
    if(code.split('const blocks = subChunk.blocks;').length!==3)throw Error('Special block scan boundaries changed');
    return code.replaceAll('const blocks = subChunk.blocks;','if (subChunk.empty) continue;\n      const blocks = subChunk.blocks;');
  });
  const start=source.indexOf('  handleNeighborDataRequest('),end=source.indexOf('\n  }',start)+4;
  let neighbor=source.slice(start,end);
  neighbor=replaceOnce(neighbor,'const neighborData = [];','const neighborData = [];\n    const transferables = [];');
  neighbor=replaceOnce(neighbor,`subChunksArray.push({
            chunkY: subChunk.chunkY,
            blocks: subChunk.blocks, // Uint8Array 可以通过 Transferable 传输
          });`,`const data = logPackBoundary(subChunk);
          subChunksArray.push(data);
          if (data.boundary) transferables.push(data.boundary.buffer);`);
  neighbor=replaceOnce(neighbor,'          biomes: neighborChunk.biomes,','');
  neighbor=replaceOnce(neighbor,'      neighborData: neighborData,\n    });','      neighborData: neighborData,\n    }, transferables);');
  source=source.slice(0,start)+neighbor+source.slice(end);
  // Game mutation and save replay paths. The marker survives so neighbors see
  // known air, and rebuilding an empty marker still clears old GPU instances.
  section('  setBlockAt(worldX, worldY, worldZ, blockType) {','  updateRenderRadius(playerX, playerZ) {',code=>{
    if(code.split('subChunk.blocks[index] = blockType;').length!==3)throw Error('Game write boundaries changed');
    code=code.replaceAll('subChunk.blocks[index] = blockType;','logWriteBlock(subChunk, index, blockType);');
    code=replaceOnce(code,'if (!subChunk) return faces;','if (!subChunk || subChunk.empty) return faces;');
    // Whole-chunk collector has the other scan; the single-subchunk collector
    // already returns early above and must not use continue outside a loop.
    const x=code.indexOf('const blocks = subChunk.blocks;');
    if(x<0)throw Error('Missing game face scan');
    code=code.slice(0,x)+'if (subChunk.empty) continue;\n      '+code.slice(x);
    return code;
  });
  const allocate = 'const newBlocks = new Uint8Array(CHUNK_SIZE_X * CHUNK_SIZE_Y_SUB * CHUNK_SIZE_Z);';
  const initialize = 'subChunk = { chunkY, blocks: newBlocks };';
  if (source.split(allocate).length !== 4 || source.split(initialize).length !== 4) throw Error('Lazy subchunk allocation boundaries changed');
  source = source.replaceAll(allocate, 'const newBlocks = LOG_EMPTY_BLOCKS;').replaceAll(initialize, 'subChunk = { chunkY, blocks: newBlocks, empty: true, nonAirCount: 0 };');
  return source;
}
module.exports={patchMapPerformance,logCompactSubChunk,logWriteBlock,logSerializeSubChunk,logRestoreSubChunk,logPackBoundary,logReadBoundary,runtime};
