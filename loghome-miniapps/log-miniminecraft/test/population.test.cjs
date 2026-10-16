const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {patchBundle}=require('../scripts/build.cjs'),{logRemoveEntityMesh}=require('../scripts/population.cjs');
const source=patchBundle(fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8'));
const blocks={AIR:0,GRASS:1,LEAVES:2,SNOW:3,STONE:4,WATER:9};
const biomes={PLAINS:0,FOREST:1,DESERT:2,MOUNTAINS:3,SNOW:4,TAIGA:12};
function fixture(options={}){
 let seed=42;const math=Object.create(Math);math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const context={Math:math,Date,BlockType:blocks,BiomeType:biomes,isBlockLeavesForWorker:block=>block===blocks.LEAVES,console:{log(){}}};vm.createContext(context);
 const start=source.indexOf('const EntityCategory = {'),end=source.indexOf('// 第八部分：游戏逻辑管理类',start);
 vm.runInContext(source.slice(start,end)+';this.Manager=LogEntityManager;this.types=ENTITY_TYPES;this.overrides=creatureOverrides;this.custom=customCreatures',context);
 const messages=[],environment={isLoaded:()=>true,topY:()=>100,radius:()=>96,...options.environment};
 const manager=new context.Manager(options.blocks||((x,y,z)=>y===63?blocks.GRASS:blocks.AIR),options.biomes||(()=>biomes.PLAINS),message=>messages.push(message),environment);
 manager.setPlayerPosition(0,64,0);return {manager,messages,environment,context};
}
test('stationary simulation stops at the shared animal cap and checks spawning only every 20 seconds',()=>{
 const {manager,messages}=fixture();manager.updateEntity=()=>{};let checks=0;const spawn=manager.trySpawnEntities.bind(manager);manager.trySpawnEntities=()=>{checks++;spawn()};
 for(let tick=0;tick<36000;tick++)manager.update(.1);
 assert.equal(manager.entities.size,10);assert.equal(messages.filter(message=>message.type==='ENTITY_SPAWN').length,10);assert.ok(checks<=181);
 assert.ok(manager.chunkEntityCount.size<=10);assert.ok(manager.chunkCooldowns.size<=3);
});
test('limits use the actual destination chunk, per-species counts and aggregate density',()=>{
 const {manager,context}=fixture();
 for(const x of [33,36,39,42])manager.spawnEntity('pig',x,64,1);
 assert.equal(manager.chunkEntityCount.get('0,0'),undefined);
 assert.equal(manager.validSpawn(context.types.pig,{x:45.5,y:64,z:8.5}),false);
 assert.equal(manager.validSpawn(context.types.cow,{x:45.5,y:64,z:8.5}),true);
 manager.spawnEntity('cow',34,64,11);manager.spawnEntity('cow',38,64,11);
 assert.equal(manager.validSpawn(context.types.chicken,{x:45.5,y:64,z:14.5}),false);
 assert.equal(manager.validSpawn(context.types.chicken,{x:63.5,y:64,z:12.5}),true);
});
test('manual spawning cannot bypass the absolute entity budget and invalid coordinates are rejected',()=>{
 const {manager}=fixture();assert.equal(manager.spawnEntity('pig',NaN,64,0),null);
 for(let i=0;i<100;i++)manager.spawnEntity('pig',i%10,64,Math.floor(i/10));
 assert.equal(manager.entities.size,64);assert.equal(manager.spawnEntity('cow',1,64,1),null);
 for(const id of [...manager.entities.keys()])manager.removeEntity(id);assert.equal(manager.chunkEntityCount.size,0);
});
test('natural spawns respect distance, 3D range, loaded chunks and entity overlap',()=>{
 const {manager,context,environment}=fixture(),pig=context.types.pig;
 assert.equal(manager.validSpawn(pig,{x:10.5,y:64,z:.5}),false);
 assert.equal(manager.validSpawn(pig,{x:97.5,y:64,z:.5}),false);
 assert.equal(manager.validSpawn(pig,{x:40.5,y:180,z:.5}),false);
 assert.equal(manager.validSpawn(pig,{x:40.5,y:64,z:.5}),true);
 manager.spawnEntity('cow',40.5,64,.5);assert.equal(manager.validSpawn(pig,{x:40.5,y:64,z:.5}),false);
 environment.isLoaded=()=>false;assert.equal(manager.surface(pig,70.5,.5),null);
});
test('grass, open space, leaf attenuation, sky brightness, biome and height conditions all apply',()=>{
 const {manager,context}=fixture(),pig=context.types.pig,wolf=context.types.wolf;
 assert.equal(manager.surface(pig,40.5,.5).y,64);
 manager.setGameTime(.75);assert.equal(manager.surface(pig,40.5,.5),null);manager.setGameTime(.25);
 assert.equal(manager.surface(wolf,40.5,.5),null);
 for(const ground of [blocks.STONE,blocks.WATER,blocks.LEAVES]){
  const value=fixture({blocks:(x,y,z)=>y===63?ground:blocks.AIR});assert.equal(value.manager.surface(value.context.types.pig,40.5,.5),null);
 }
 const water=fixture({blocks:(x,y,z)=>y===64?blocks.WATER:y===63?blocks.GRASS:blocks.AIR});assert.equal(water.manager.surface(water.context.types.pig,40.5,.5),null);
 const roof=fixture({blocks:(x,y,z)=>y===75?blocks.STONE:y===63?blocks.GRASS:blocks.AIR});assert.equal(roof.manager.surface(roof.context.types.pig,40.5,.5),null);
 const canopy=fixture({blocks:(x,y,z)=>y===70?blocks.LEAVES:y===63?blocks.GRASS:blocks.AIR});assert.ok(canopy.manager.surface(canopy.context.types.pig,40.5,.5));
 const thick=fixture({blocks:(x,y,z)=>y>=70&&y<79?blocks.LEAVES:y===63?blocks.GRASS:blocks.AIR});assert.equal(thick.manager.surface(thick.context.types.pig,40.5,.5),null);
 const desert=fixture({biomes:()=>biomes.DESERT});assert.equal(desert.manager.surface(desert.context.types.pig,40.5,.5),null);
 const taiga=fixture({biomes:()=>biomes.TAIGA});assert.ok(taiga.manager.surface(taiga.context.types.wolf,40.5,.5));
 const high=fixture({blocks:(x,y,z)=>y===199?blocks.GRASS:blocks.AIR,environment:{topY:()=>220}});assert.equal(high.manager.surface(high.context.types.pig,40.5,.5).y,200);
});
test('type overrides, custom species, group spawning and configured cooldowns are honored',()=>{
 const {manager,context}=fixture();
 for(const type of Object.values(context.types))type.spawnWeight=0;
 context.custom.set('forest_pig',{...context.types.pig,id:'forest_pig',spawnWeight:10,spawnCooldown:60000});
 manager.trySpawnEntities();assert.ok(manager.entities.size>=2&&manager.entities.size<=4);
 assert.ok([...manager.entities.values()].every(entity=>entity.typeId==='forest_pig'&&entity.spawnReason==='natural'));
 const count=manager.entities.size;manager.elapsed=40;manager.trySpawnEntities();assert.equal(manager.entities.size,count);
 assert.equal(manager.typeCooldowns.get('forest_pig'),60);
 const another=fixture();for(const type of Object.values(another.context.types))type.spawnWeight=0;
 another.context.overrides.set('pig',{...another.context.types.pig,spawnWeight:10,maxPerChunk:1});another.manager.trySpawnEntities();
 for(const count of another.manager.chunkEntityCount.values())assert.equal(count,1);
});
test('movement and unloading keep counters correct; distant cleanup uses 3D distance and explicit reasons',()=>{
 const {manager,messages}=fixture();const entity=manager.spawnEntity('pig',33,64,1);
 manager.switchBehavior=manager.executeBehavior=manager.updateAnimation=()=>{};manager.physics.update=value=>value.position.x=50;
 manager.updateEntity(entity,.016);assert.equal(manager.chunkEntityCount.has('2,0'),false);assert.equal(manager.chunkEntityCount.get('3,0'),1);
 manager.clearEntitiesInChunk(3,0);assert.equal(manager.entities.size,0);assert.equal(manager.chunkEntityCount.size,0);assert.equal(messages.at(-1).reason,'unload');
 manager.spawnEntity('pig',40,194,1);manager.despawnFarEntities();assert.equal(manager.entities.size,0);assert.equal(messages.at(-1).reason,'despawn');
 manager.spawnEntity('pig',40,64,1);manager.environment.isLoaded=()=>false;manager.despawnFarEntities();assert.equal(manager.entities.size,0);
 assert.ok(manager.nextSpawn>=manager.elapsed+20);
});
test('cooldowns use active simulation time; long frame stalls do not trigger catch-up spawn bursts',()=>{
 const {manager}=fixture();let attempts=0;manager.trySpawnEntities=()=>attempts++;
 manager.update(1000);assert.equal(attempts,0);assert.equal(manager.elapsed,.1);
 for(let tick=0;tick<30;tick++)manager.update(.1);assert.equal(attempts,1);
 manager.update(1000);assert.equal(attempts,1);
});
test('queued model removal clears all bookkeeping even while rendering is disabled',()=>{
 const effects=[],renderer={enabled:false,entityMap:new Map([['dead',{type:'custom',x:0,y:0,z:0}]]),entityMeshMap:new Map(),entityRenderConfigs:new Map([['dead',{height:1,color:123}]]),entityMixers:new Map(),entityActions:new Map([['dead',{}]]),pendingSpawns:new Map([['delayed',[{id:'dead'},{id:'alive'}]]]),effects:{clearEntityEffects:id=>effects.push(id),triggerDeathParticles:()=>{throw Error('Despawn should not produce death particles')}}};
 vm.runInNewContext('('+logRemoveEntityMesh.toString()+').call(renderer,"dead","unload")',{renderer,hasAnimation:()=>false});
 assert.equal(renderer.entityMap.size,0);assert.equal(renderer.entityRenderConfigs.size,0);assert.equal(renderer.entityActions.size,0);assert.equal(renderer.pendingSpawns.get('delayed').length,1);assert.equal(renderer.pendingSpawns.get('delayed')[0].id,'alive');assert.deepEqual(effects,['dead']);
});
test('late model callbacks cannot resurrect removed entities; normal removal releases mixer references',()=>{
 const start=source.indexOf('class EntityRenderer{'),end=source.indexOf('const BACKROOMS_SKY_COLOR=',start),context={};vm.createContext(context);vm.runInContext(source.slice(start,end)+';this.Renderer=EntityRenderer',context);
 const renderer=Object.create(context.Renderer.prototype);renderer.entityMap=new Map();renderer.entityMeshMap=new Map();renderer.spawnEntityMesh({id:'removed'},null,null);assert.equal(renderer.entityMeshMap.size,0);
 const calls=[],mesh={};Object.assign(renderer,{entityMap:new Map([['id',{type:'pig',x:0,y:64,z:0}]]),entityMeshMap:new Map([['id',{type:'pig',mesh}]]),entityRenderConfigs:new Map(),entityGroups:new Map([['pig',{remove:object=>calls.push(object)}]]),entityMixers:new Map([['id',{stopAllAction:()=>calls.push('stop'),uncacheRoot:object=>calls.push(object)}]]),entityActions:new Map(),pendingSpawns:new Map(),effects:{clearEntityEffects:()=>{}}});
 vm.runInNewContext('('+logRemoveEntityMesh.toString()+').call(renderer,"id","despawn")',{renderer,hasAnimation:()=>false});
 assert.deepEqual(calls,[mesh,'stop',mesh]);assert.equal(renderer.entityMixers.size,0);assert.equal(renderer.entityMeshMap.size,0);
});
