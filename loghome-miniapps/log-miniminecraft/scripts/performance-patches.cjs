// Keep the exported vendor bundle intact. Every patch fails closed on source drift.
function replaceOnce(source, before, after) {
  if (source.split(before).length !== 2) throw Error('Performance patch boundary changed: ' + before.slice(0, 90));
  return source.replace(before, after);
}

// Ranges are in scalar components, as required by Three.js BufferAttribute.
// Preserve pending ranges until WebGLAttributes consumes them, including when
// an object is skipped by a render pass. Never clear another writer's range.
function logMarkAttribute(attribute, start, count) {
  if (count <= 0) return;
  const ranges = attribute.updateRanges;
  let end = start + count;
  for (let i = ranges.length - 1; i >= 0; i--) {
    const range = ranges[i];
    if (range.start <= end && range.start + range.count >= start) {
      start = Math.min(start, range.start);
      end = Math.max(end, range.start + range.count);
      ranges.splice(i, 1);
      // Expansion can bridge earlier disjoint ranges; a final sort/merge below
      // also handles ranges received in arbitrary order.
    }
  }
  ranges.push({ start, count: end - start });
  ranges.sort((a, b) => a.start - b.start);
  for (let i = 1; i < ranges.length;) {
    const a = ranges[i - 1], b = ranges[i];
    if (a.start + a.count >= b.start) {
      a.count = Math.max(a.start + a.count, b.start + b.count) - a.start;
      ranges.splice(i, 1);
    } else i++;
  }
  // Bound driver call count without uploading the unused tail of the pool.
  if (ranges.length > 32) {
    const first = ranges[0].start, last = ranges[ranges.length - 1];
    ranges.splice(0, ranges.length, { start: first, count: last.start + last.count - first });
  }
  attribute.needsUpdate = true;
}
function logSetAttribute(attribute, index, value) {
  if (attribute.array[index] === value) return;
  attribute.array[index] = value;
  logMarkAttribute(attribute, index, 1);
}

function patchPerformance(source) {
  const replace = (before, after) => { source = replaceOnce(source, before, after); };
  const terrainStart = '    // 预计算该区块的地形高度和生物群系\n    const terrainData = [];';
  const from = source.indexOf(terrainStart);
  const to = source.indexOf('    // 生成方块', from);
  if (from < 0 || to < 0) throw Error('Missing terrain generation boundary');
  const calculation = source.slice(from, to);
  replace('  // 并行生成所有 Y 轴子区块\n  const promises = [];', calculation + '\n  const promises = [];');
  replace('promises.push(generateTerrainAsync(chunkX, chunkZ, chunkY));', 'promises.push(generateTerrainAsync(chunkX, chunkZ, chunkY, terrainData));');
  replace('function generateTerrainAsync(chunkX, chunkZ, chunkY) {', 'function generateTerrainAsync(chunkX, chunkZ, chunkY, terrainData) {');
  // The calculation now appears twice; remove only the copy inside the callee.
  const fn = source.indexOf('function generateTerrainAsync(');
  const fnEnd = source.indexOf('// 同步区块数据到 GameWorker', fn);
  source = source.slice(0, fn) + replaceOnce(source.slice(fn, fnEnd), calculation, '') + source.slice(fnEnd);

  const begin = source.indexOf('ho=class ho{'), end = source.indexOf('let RenderManager=ho;', begin);
  if (begin < 0 || end < 0) throw Error('Missing RenderManager boundary');
  let manager = source.slice(begin, end);
  const edit = (a, b) => { manager = replaceOnce(manager, a, b); };
  edit('this.markContainerDirtyRange(p,x.startIdx),this.markContainerDirtyRange(p,x.startIdx+x.count-1)', 'logMarkAttribute(p.mesh.instanceMatrix,x.startIdx*16,x.count*16),logMarkAttribute(p.textureIndexAttribute,x.startIdx,x.count),logMarkAttribute(p.instanceScaleAttribute,x.startIdx*2,x.count*2)');
  edit('this.markContainerDirtyRange(m,l.startIdx),this.markContainerDirtyRange(m,l.startIdx+l.count-1)', 'logMarkAttribute(m.mesh.instanceMatrix,l.startIdx*16,l.count*16),logMarkAttribute(m.textureIndexAttribute,l.startIdx,l.count)');
  const flushStart = manager.indexOf('flushPendingUpdates(){'), flushEnd = manager.indexOf('markContainerDirtyRange(', flushStart);
  if (flushStart < 0 || flushEnd < 0) throw Error('Missing flush boundary');
  manager = manager.slice(0, flushStart) + 'flushPendingUpdates(){const measured=this.perfMonitorEnabled&&(this.pendingUpdates.size>0||this.pendingFurnaceTextureUpdates.length>0),start=measured?performance.now():0;this.processPendingFurnaceTextureUpdates();this.pendingUpdates.clear();this.containerDirtyRanges.clear();const now=Date.now();if(!this.logLastPoolCleanup||now-this.logLastPoolCleanup>=1000){this.logLastPoolCleanup=now;this.cleanupExpiredContainers()}if(measured)this.recordPerf("flushPendingUpdates",performance.now()-start)}' + manager.slice(flushEnd);
  edit('p[l]=m,d.textureIndexAttribute.needsUpdate=!0,this.markContainerDirtyRange(d,l)', 'logSetAttribute(d.textureIndexAttribute,l,m)');
  // Pool reuse resets whole texture/scale arrays. Mark those resets as well so
  // earlier partial updates cannot leave stale GPU data after reuse.
  edit('v.set(A.subarray(0,v.length)),this.containerPoolTimestamps', 'v.set(A.subarray(0,v.length)),logMarkAttribute(_.textureIndexAttribute,0,T.length),logMarkAttribute(_.instanceScaleAttribute,0,v.length),this.containerPoolTimestamps');
  const oldDispose = 'this.scene.remove(t.mesh),t.mesh.dispose()';
  if (manager.split(oldDispose).length !== 4) throw Error('Missing active container disposal sites');
  manager = manager.split(oldDispose).join('this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.dispose()');
  edit('this.geometries.length=0,disposeTextureArray()', 'this.geometries.length=0,this.disposeMaterials(),disposeTextureArray()');
  edit('async reloadAtlasMaterial(){', 'disposeMaterials(){for(const key of ["arrayTextureMaterial","transparentArrayTextureMaterial","waterArrayTextureMaterial","depthArrayTextureMaterial"]){this[key]?.dispose();this[key]=null}}async reloadAtlasMaterial(){');
  edit('this.arrayTextureMaterial=createArrayTextureMaterial(),this.transparentArrayTextureMaterial=createTransparentArrayTextureMaterial(),this.waterArrayTextureMaterial=createWaterArrayTextureMaterial(),this.depthArrayTextureMaterial=createDepthArrayTextureMaterial();const t=', 'this.disposeMaterials(),this.arrayTextureMaterial=createArrayTextureMaterial(),this.transparentArrayTextureMaterial=createTransparentArrayTextureMaterial(),this.waterArrayTextureMaterial=createWaterArrayTextureMaterial(),this.depthArrayTextureMaterial=createDepthArrayTextureMaterial();const t=');
  source = source.slice(0, begin) + manager + source.slice(end);
  // Cleanup must run even on frames without terrain edits.
  replace('const on=Wt.needsRender()', 'Wt.flushPendingUpdates();const on=Wt.needsRender()');
  replace('on&&Wt.flushPendingUpdates();', '');
  replace('ne.current?.dispose(),ne.current=null', 'ne.current=null');

  const sharedStart = source.indexOf('class SharedMeshManager{'), sharedEnd = source.indexOf('const NON_BLOCK_DROPPED_ITEM_INDEX_START', sharedStart);
  let shared = source.slice(sharedStart, sharedEnd);
  if (sharedStart < 0 || sharedEnd < 0) throw Error('Missing shared mesh boundary');
  if ((shared.match(/this\.mesh\.setMatrixAt\(/g)||[]).length !== 3) throw Error('Shared matrix update boundary changed');
  shared = shared.replace(/this\.mesh\.setMatrixAt\((o\.instanceIndex|o|e),([^;]+?)\)/g, 'this.mesh.setMatrixAt($1,$2),logMarkAttribute(this.mesh.instanceMatrix,$1*16,16)');
  // Only upload scalar attributes whose values actually changed.
  if ((shared.match(/this\.(?:textureIndexAttributes\[\d\]|flipFrontUVAttribute|flipBackUVAttribute|doorOrientationAttribute)\.array\[o\.instanceIndex\]=/g)||[]).length !== 15) throw Error('Shared scalar update boundary changed');
  shared = shared.replace(/(this\.(?:textureIndexAttributes\[\d\]|flipFrontUVAttribute|flipBackUVAttribute|doorOrientationAttribute))\.array\[o\.instanceIndex\]=([^,;}]+)/g, 'logSetAttribute($1,o.instanceIndex,$2)');
  shared = replaceOnce(shared, 'this.mesh.instanceMatrix.needsUpdate=!0;for(const o of this.textureIndexAttributes)o.needsUpdate=!0;this.flipFrontUVAttribute&&(this.flipFrontUVAttribute.needsUpdate=!0),this.flipBackUVAttribute&&(this.flipBackUVAttribute.needsUpdate=!0),this.doorOrientationAttribute&&(this.doorOrientationAttribute.needsUpdate=!0),', '');
  shared = shared.replaceAll('this.mesh.instanceMatrix.needsUpdate=!0,', '').replaceAll(',this.mesh.instanceMatrix.needsUpdate=!0', '');
  shared = replaceOnce(shared, 'this.textureIndexAttributes=[]}}', 'this.depthMaterial&&(this.depthMaterial.dispose(),this.depthMaterial=null),this.textureIndexAttributes=[]}}');
  source = source.slice(0, sharedStart) + shared + source.slice(sharedEnd);
  // Function declarations are hoisted in the module, outside Worker strings.
  return require('./map-performance-patches.cjs').patchMapPerformance(source) + '\n' + logMarkAttribute.toString() + '\n' + logSetAttribute.toString() + '\n';
}
module.exports = { patchPerformance, logMarkAttribute, logSetAttribute };
