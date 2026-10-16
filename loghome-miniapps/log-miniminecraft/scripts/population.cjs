const LOG_POPULATION_RULES={animalCap:10,monsterCap:24,totalCap:64,chunkCap:6,nearbyCap:8,minDistance:24,spawnRadius:96,despawnRadius:128,spawnInterval:20,chunkCooldown:60};
function logCreateEntityManagerClass(Base){
 return class LogEntityManager extends Base {
  constructor(blocks,biomes,send,environment={}){
   super(blocks,biomes,send);this.environment=environment;this.elapsed=0;this.nextSpawn=3;this.nextCleanup=0;this.typeCooldowns=new Map();this.chunkCooldowns=new Map();this.gameTime=.25;
  }
  population(config){return config.category==='hostile'?'monster':'animal'}
  populationLimit(config){return this.population(config)==='monster'?LOG_POPULATION_RULES.monsterCap:LOG_POPULATION_RULES.animalCap}
  populationCount(config){let count=0;for(const entity of this.entities.values()){const other=getEntityTypeConfig(entity.typeId);if(other&&this.population(other)===this.population(config))count++}return count}
  radius(){return Math.max(0,Math.min(LOG_POPULATION_RULES.spawnRadius,this.environment.radius?.()??0))}
  loaded(x,z){return this.environment.isLoaded?.(Math.floor(x),Math.floor(z))===true}
  biomeAllowed(config,x,z){
   const biome=this.getBiomeAt(Math.floor(x),Math.floor(z)),specified=config.spawnConditions?.biomes;
   if(Array.isArray(specified))return specified.includes(biome);
   if(config.id==='wolf')return [BiomeType.FOREST,BiomeType.TAIGA,BiomeType.SNOW].includes(biome);
   return ![BiomeType.DESERT,BiomeType.SNOW].includes(biome);
  }
  surface(config,x,z){
   if(!this.loaded(x,z)||!this.biomeAllowed(config,x,z))return null;
   const rules=config.spawnConditions||{},bottom=Math.max(0,Math.ceil(rules.minHeight??0));
   const top=Math.floor(this.environment.topY?.(Math.floor(x),Math.floor(z))??320);
   if(!Number.isFinite(top)||top>4096)return null;
   let leaves=0;
   // Search the actual loaded column, so leaves/roofs above the spawn height
   // cannot be mistaken for open ground. Leaf cover attenuates sky light.
   for(let y=top;y>=bottom-1;y--){
    const block=this.getBlockAt(Math.floor(x),y,Math.floor(z));
    if(block===BlockType.AIR)continue;
    if(block===BlockType.LEAVES||isBlockLeavesForWorker(block)){leaves++;continue}
    const ground=block===BlockType.GRASS||(config.id==='wolf'&&block===BlockType.SNOW);
    if(!ground)return null;
    const foot=y+1,light=Math.max(0,Math.round(15*Math.max(0,Math.sin(this.gameTime*Math.PI*2)))-leaves);
    if(foot<bottom||foot>(rules.maxHeight??320)||light<(rules.minLight??7)||light>(rules.maxLight??15))return null;
    return {x,y:foot,z};
   }
   return null;
  }
  validSpawn(config,point){
   const {x,y,z}=point,box=config.boundingBox;
   if(![x,y,z,box?.width,box?.height,box?.depth].every(Number.isFinite)||box.width<=0||box.depth<=0||box.height<=0||box.width>4||box.depth>4||box.height>8)return false;
   const dx=x-this.playerPosition.x,dy=y-this.playerPosition.y,dz=z-this.playerPosition.z;
   if(dx*dx+dy*dy+dz*dz<LOG_POPULATION_RULES.minDistance**2||dx*dx+dy*dy+dz*dz>this.radius()**2)return false;
   if(this.entities.size>=LOG_POPULATION_RULES.totalCap||this.populationCount(config)>=this.populationLimit(config))return false;
   const key=this.getChunkKey(Math.floor(x/16),Math.floor(z/16));
   if((this.chunkCooldowns.get(key)||0)>this.elapsed||(this.typeCooldowns.get(config.id)||0)>this.elapsed)return false;
   if((this.chunkEntityCount.get(key)||0)>=LOG_POPULATION_RULES.chunkCap)return false;
   const perType=Math.max(0,Math.floor(config.maxPerChunk??4));let sameType=0,nearby=0;
   for(const entity of this.entities.values()){
    if(entity.chunkKey===key&&entity.typeId===config.id)sameType++;
    const ex=entity.position.x-x,ez=entity.position.z-z;
    if(ex*ex+ez*ez<32*32)nearby++;
    const other=getEntityTypeConfig(entity.typeId)?.boundingBox;
    if(other&&Math.abs(ex)<(box.width+other.width)/2+.1&&Math.abs(ez)<(box.depth+other.depth)/2+.1&&entity.position.y<y+box.height&&entity.position.y+other.height>y)return false;
   }
   if(sameType>=perType||nearby>=LOG_POPULATION_RULES.nearbyCap)return false;
   for(let bx=Math.floor(x-box.width/2+.0001);bx<=Math.floor(x+box.width/2-.0001);bx++)for(let bz=Math.floor(z-box.depth/2+.0001);bz<=Math.floor(z+box.depth/2-.0001);bz++){
    if(!this.loaded(bx,bz))return false;
    const ground=this.getBlockAt(bx,y-1,bz);
    if(ground!==BlockType.GRASS&&!(config.id==='wolf'&&ground===BlockType.SNOW))return false;
    for(let by=y;by<Math.ceil(y+box.height);by++)if(this.getBlockAt(bx,by,bz)!==BlockType.AIR)return false;
   }
   return true;
  }
  findSpawnPosition(config){
   const radius=this.radius(),inner=LOG_POPULATION_RULES.minDistance;
   if(radius<=inner)return null;
   for(let attempt=0;attempt<10;attempt++){
    const angle=Math.random()*Math.PI*2,distance=Math.sqrt(inner*inner+Math.random()*(radius*radius-inner*inner));
    const x=Math.floor(this.playerPosition.x+Math.cos(angle)*distance)+.5,z=Math.floor(this.playerPosition.z+Math.sin(angle)*distance)+.5;
    const point=this.surface(config,x,z);if(point&&this.validSpawn(config,point))return point;
   }
   return null;
  }
  trySpawnEntities(){
   if(this.entities.size>=LOG_POPULATION_RULES.totalCap)return;
   const ids=new Set([...Object.keys(ENTITY_TYPES),...customCreatures.keys()]);
   const types=[...ids].map(getEntityTypeConfig).filter(config=>config&&Number.isFinite(config.spawnWeight)&&config.spawnWeight>0&&config.maxPerChunk!==0&&config.spawnConditions?.onGround!==false&&(this.typeCooldowns.get(config.id)||0)<=this.elapsed&&this.populationCount(config)<this.populationLimit(config));
   if(!types.length)return;
   let weight=Math.random()*types.reduce((sum,config)=>sum+config.spawnWeight,0),config=types[types.length-1];
   for(const candidate of types){weight-=candidate.spawnWeight;if(weight<0){config=candidate;break}}
   const anchor=this.findSpawnPosition(config);if(!anchor)return;
   const desired=2+Math.floor(Math.random()*(config.id==='cow'?2:3)),born=new Set();let count=0;
   for(let attempt=0;attempt<desired*4&&count<desired;attempt++){
    const point=attempt===0?anchor:this.surface(config,Math.floor(anchor.x+(Math.random()-.5)*8)+.5,Math.floor(anchor.z+(Math.random()-.5)*8)+.5);
    if(!point||Math.abs(point.y-anchor.y)>3||!this.validSpawn(config,point))continue;
    const entity=this.spawnEntity(config.id,point.x,point.y,point.z,'natural');
    if(entity){born.add(entity.chunkKey);count++}
   }
   if(count){this.typeCooldowns.set(config.id,this.elapsed+Math.max(LOG_POPULATION_RULES.spawnInterval,(config.spawnCooldown??12000)/1000));for(const key of born)this.chunkCooldowns.set(key,this.elapsed+LOG_POPULATION_RULES.chunkCooldown)}
  }
  spawnEntity(type,x,y,z,reason='manual'){
   const config=getEntityTypeConfig(type);if(!config)throw Error('Unknown entity type: '+type);
   if(![x,y,z].every(Number.isFinite)||this.entities.size>=LOG_POPULATION_RULES.totalCap)return null;
   if(reason==='natural'&&!this.validSpawn(config,{x,y,z}))return null;
   const entity=super.spawnEntity(type,x,y,z);entity.spawnReason=reason;return entity;
  }
  update(deltaTime){
   const dt=Math.max(0,Math.min(.1,Number.isFinite(deltaTime)?deltaTime:0));this.elapsed+=dt;
   if(this.elapsed>=this.nextCleanup){this.nextCleanup=this.elapsed+1;this.despawnFarEntities();for(const [key,until]of this.chunkCooldowns)if(until<=this.elapsed)this.chunkCooldowns.delete(key)}
   if(this.elapsed>=this.nextSpawn){this.nextSpawn=this.elapsed+LOG_POPULATION_RULES.spawnInterval;this.trySpawnEntities()}
   for(const entity of this.entities.values()){
    const dx=entity.position.x-this.playerPosition.x,dy=entity.position.y-this.playerPosition.y,dz=entity.position.z-this.playerPosition.z;
    if(dx*dx+dy*dy+dz*dz<=LOG_POPULATION_RULES.spawnRadius**2)this.updateEntity(entity,dt);
   }
   this.sendEntityUpdate();
  }
  updateEntity(entity,dt){
   const old=entity.chunkKey;super.updateEntity(entity,dt);
   if(!this.chunkEntityCount.get(old))this.chunkEntityCount.delete(old);
   if(![entity.position.x,entity.position.y,entity.position.z].every(Number.isFinite)||entity.position.y< -64)this.removeEntity(entity.id,'despawn');
  }
  despawnFarEntities(){
   for(const [id,entity]of this.entities){const dx=entity.position.x-this.playerPosition.x,dy=entity.position.y-this.playerPosition.y,dz=entity.position.z-this.playerPosition.z;
    if(!this.loaded(entity.position.x,entity.position.z)||dx*dx+dy*dy+dz*dz>LOG_POPULATION_RULES.despawnRadius**2)this.removeEntity(id,'despawn');
   }
  }
  removeEntity(id,reason='death'){
   const entity=this.entities.get(id);if(!entity)return;
   const count=(this.chunkEntityCount.get(entity.chunkKey)||1)-1;if(count>0)this.chunkEntityCount.set(entity.chunkKey,count);else this.chunkEntityCount.delete(entity.chunkKey);
   this.entities.delete(id);this.nextSpawn=Math.max(this.nextSpawn,this.elapsed+LOG_POPULATION_RULES.spawnInterval);
   this.sendToMain({type:'ENTITY_REMOVE',mobId:id,reason});
  }
  clearEntitiesInChunk(x,z){const key=this.getChunkKey(x,z);for(const [id,entity]of this.entities)if(entity.chunkKey===key)this.removeEntity(id,'unload');this.chunkEntityCount.delete(key)}
 };
}
function logRemoveEntityMesh(id,reason='despawn'){
 const record=this.entityMap.get(id),entry=this.entityMeshMap.get(id);
 if(reason==='death'&&record){const config=this.entityRenderConfigs.get(id)||ENTITY_TYPE_CONFIGS[record.type];this.effects.triggerDeathParticles(id,{x:record.x,y:record.y+(config?.height??1)/2,z:record.z},config?.color??0xffffff)}
 for(const [key,pending]of this.pendingSpawns)this.pendingSpawns.set(key,pending.filter(entity=>entity.id!==id));
 if(entry)this.entityGroups.get(entry.type)?.remove(entry.mesh);
 const mixer=this.entityMixers.get(id);if(mixer){mixer.stopAllAction();if(entry)mixer.uncacheRoot(entry.mesh);this.entityMixers.delete(id)}
 this.entityActions.delete(id);if(hasAnimation(id))removeAnimation(id);
 this.entityMap.delete(id);this.entityMeshMap.delete(id);this.entityRenderConfigs.delete(id);this.effects.clearEntityEffects(id);
}
function patchPopulation(source){
 const replace=(before,after)=>{if(source.split(before).length!==2)throw Error('Population patch boundary changed: '+before.slice(0,90));source=source.replace(before,after)};
 const boundary='// 第八部分：游戏逻辑管理类（占位符，由 getWorkerCode() 替换）';
 const runtime='const LOG_POPULATION_RULES='+JSON.stringify(LOG_POPULATION_RULES)+';\n'+logCreateEntityManagerClass.toString()+'\nconst LogEntityManager=logCreateEntityManagerClass(EntityManager);\n';
 replace(boundary,runtime+'\n'+boundary);
 replace('this.entityManager = new EntityManager(\n      this.getBlockAt.bind(this),\n      this.getBiomeAt.bind(this),\n      sendToMain\n    );',`this.entityManager = new LogEntityManager(this.getBlockAt.bind(this),this.getBiomeAt.bind(this),sendToMain,{
      isLoaded:(x,z)=>{const chunk=this.chunks.get(this.getChunkKey(Math.floor(x/16),Math.floor(z/16)));return !!chunk&&chunk.subChunks.size>0},
      topY:(x,z)=>{const chunk=this.chunks.get(this.getChunkKey(Math.floor(x/16),Math.floor(z/16)));return chunk?Math.max(0,...[...chunk.subChunks.values()].map(row=>(row.chunkY+1)*16-1)):0},
      radius:()=>Math.min(96,this.renderRadius*16-2)
    });`);
 replace('handleChunkUnloadedForGame(chunkX, chunkZ) {','handleChunkUnloadedForGame(chunkX, chunkZ) {\n    this.entityManager?.clearEntitiesInChunk(chunkX,chunkZ);');
 replace('function handleWorkerMessage(message) {',`function handleWorkerMessage(message) {
  if(message.type==='LOG_SPAWN_ENVIRONMENT'){if(Number.isFinite(message.time))gameLogic.entityManager?.setGameTime(((message.time%1)+1)%1);return}
`);
 replace('const Fo=ve=>{logEnvironment.begin(ve);','let logLastSpawnEnvironment=-Infinity;const Fo=ve=>{if(ve-logLastSpawnEnvironment>=1000){logLastSpawnEnvironment=ve;gn.sendMessage({type:"LOG_SPAWN_ENVIRONMENT",time:jt.currentTime})}logEnvironment.begin(ve);');
 const typesStart=source.indexOf('const ENTITY_TYPES = {'),typesEnd=source.indexOf('// 生成唯一生物 ID',typesStart);
 if(typesStart<0||typesEnd<0)throw Error('Missing entity types boundary');
 source=source.slice(0,typesStart)+source.slice(typesStart,typesEnd).replaceAll('maxHeight: 128','maxHeight: 320')+source.slice(typesEnd);
 replace('function handleEntityRemove(n,e){e.onEntityRemove&&e.onEntityRemove(n.mobId)}','function handleEntityRemove(n,e){e.onEntityRemove&&e.onEntityRemove(n.mobId,n.reason||"despawn")}');
 replace('gn.setOnEntityRemove(ve=>{Kr.handleEntityRemove(ve)})','gn.setOnEntityRemove((ve,Ct)=>{Kr.handleEntityRemove(ve,Ct)})');
 const rendererStart=source.indexOf('class EntityRenderer{'),rendererEnd=source.indexOf('const BACKROOMS_SKY_COLOR=',rendererStart);
 let renderer=source.slice(rendererStart,rendererEnd);const removeStart=renderer.indexOf('handleEntityRemove(e){'),removeEnd=renderer.indexOf('playAnimation(',removeStart);
 if(rendererStart<0||rendererEnd<0||removeStart<0||removeEnd<0)throw Error('Missing entity renderer boundary');
 renderer=renderer.slice(0,removeStart)+'handleEntityRemove(e,t){logRemoveEntityMesh.call(this,e,t)}'+renderer.slice(removeEnd);
 for(const [before,after]of [
  ['spawnEntityMesh(e,t,r){','spawnEntityMesh(e,t,r){if(!this.entityMap.has(e.id)||this.entityMeshMap.has(e.id))return;e=this.entityMap.get(e.id);'],
  ['this.entityMap.clear(),this.entityMeshMap.clear(),','this.entityRenderConfigs.clear(),this.entityMap.clear(),this.entityMeshMap.clear(),']
 ]){if(renderer.split(before).length!==2)throw Error('Population renderer boundary changed: '+before);renderer=renderer.replace(before,after)}
 source=source.slice(0,rendererStart)+renderer+source.slice(rendererEnd);
 return source+'\n'+logRemoveEntityMesh.toString()+'\n';
}
module.exports={patchPopulation,LOG_POPULATION_RULES,logCreateEntityManagerClass,logRemoveEntityMesh};
