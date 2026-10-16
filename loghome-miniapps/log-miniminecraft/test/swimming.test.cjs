const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {patchBundle}=require('../scripts/build.cjs');
const source=patchBundle(fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8'));
const pool=(x,y,z)=>y<0?1:y<6?9:0;
function fixture(blocks=pool){
 let now=1000;
 const context={BlockType:{AIR:0,WATER:9,LAVA:11},PLAYER_COLLISION_HEIGHT:1.8,performance:{now:()=>now},Date,Math,console:{log(){}},hasCollision:block=>block!==0&&block!==9&&block!==11,isDoorBlock:()=>false};
 vm.createContext(context);
 const playerStart=source.indexOf('class PlayerStateManager {'),playerEnd=source.indexOf('class DroppedItemsManagerWorker',playerStart);
 const entityStart=source.indexOf('const EntityCategory = {'),entityEnd=source.indexOf('// 第八部分：游戏逻辑管理类',entityStart);
 vm.runInContext(source.slice(playerStart,playerEnd)+'\n'+source.slice(entityStart,entityEnd)+';this.Player=PlayerStateManager;this.Physics=EntityPhysics;this.Manager=EntityManager;this.types=ENTITY_TYPES',context);
 const player=new context.Player(()=>0,blocks);player.setPosition(.5,2,.5);
 return {context,player,blocks,step(dt=1/60,inputs=true){now+=dt*1000;if(inputs)player.updateMovement(dt);else player.updatePhysicsOnly(dt)},seconds(seconds,fps=60,inputs=true){for(let i=0;i<seconds*fps;i++){now+=1000/fps;if(inputs)player.updateMovement(1/fps);else player.updatePhysicsOnly(1/fps)}}};
}
test('player sinks slowly without input at every target FPS and stops at the seabed',()=>{
 let reference;
 for(const fps of [30,60,90,120]){
  const f=fixture();f.seconds(2,fps);const y=f.player.positionY;
  assert.ok(y>.8&&y<1.1,'Slow sinking '+y);assert.ok(f.player.velocityY<-.6&&f.player.velocityY>-.65);assert.equal(f.player.getState().isSwimming,true);
  if(reference!==undefined)assert.ok(Math.abs(y-reference)<.002);reference=y;
  f.seconds(10,fps);assert.ok(Math.abs(f.player.positionY)<.001);assert.equal(f.player.velocityY,0);
 }
});
test('ascent, dive, idle physics, camera-relative movement and diagonal speed stay bounded',()=>{
 const f=fixture();f.player.setPosition(.5,4.8,.5);f.seconds(.5);f.player.keys.ShiftLeft=true;f.seconds(1);const deep=f.player.positionY;assert.ok(deep<4);
 f.player.keys.ShiftLeft=false;f.player.keys.Space=true;f.seconds(2);assert.ok(f.player.positionY>deep+1);
 f.player.keys.Space=false;f.seconds(1,60,false);const released=f.player.positionY;f.seconds(1,60,false);assert.ok(f.player.positionY<released-.5);
 const distances=[];
 for(const diagonal of [false,true]){
  const value=fixture();value.player.keys.KeyW=true;value.player.keys.KeyD=diagonal;value.seconds(2);
  distances.push(Math.hypot(value.player.positionX-.5,value.player.positionZ-.5));assert.ok(distances.at(-1)<5.1);
 }
 assert.ok(Math.abs(distances[0]-distances[1])<.005);
});
test('swimming cannot pass through banks or ceilings; jump/auto-jump can climb an unobstructed shore',()=>{
 const wall=(x,y,z)=>x>=2||y===6?1:pool(x,y,z),f=fixture(wall);f.player.keys.KeyD=true;f.player.keys.Space=true;f.seconds(5);
 assert.ok(f.player.positionX<=1.701);assert.ok(f.player.positionY+1.8<=6.001);
 const bank=(x,y,z)=>x>=2&&y<6?1:pool(x,y,z),shore=fixture(bank);shore.player.keys.KeyD=true;shore.player.keys.Space=true;shore.seconds(8);
 assert.ok(shore.player.positionX>3);assert.ok(shore.player.positionY>=6-.01);assert.equal(shore.player.getState().isSwimming,false);
});
test('dry-land movement, lava and creative flying do not acquire water buoyancy',()=>{
 const dry=fixture((x,y,z)=>y<0?1:0);dry.player.setPosition(.5,1,.5);dry.seconds(1);assert.ok(dry.player.positionY<.01);assert.equal(dry.player.getState().isSwimming,false);
 const lava=fixture((x,y,z)=>y<6?11:0);lava.seconds(.5);assert.ok(lava.player.positionY<0);assert.equal(lava.player.getState().isSwimming,false);
 const flight=fixture();flight.player.setFlying(true);flight.player.keys.Space=true;flight.seconds(1);assert.ok(flight.player.positionY>=17-.001);assert.equal(flight.player.getState().isSwimming,false);
 const jump=fixture();jump.player.handleInputEvent({toggleFlying:true,deltaTime:1/60,keys:{Space:true}});assert.equal(jump.player.isFlying,false);
});
test('animals of different sizes float and paddle toward a nearby bank without crossing solid walls',()=>{
 const blocks=(x,y,z)=>x>=3&&y<6?1:pool(x,y,z),f=fixture(blocks);
 for(const type of ['pig','cow','chicken','sheep','wolf']){
  const physics=new f.context.Physics(pool),config=f.context.types[type],entity={position:{x:.5,y:2,z:.5},velocity:{x:0,y:0,z:0},isOnGround:false};
  for(let i=0;i<60*15;i++)physics.update(entity,config,1/60);
  assert.ok(Math.abs(entity.position.y-(6-config.boundingBox.height*.65))<.01,type);assert.equal(entity.isSwimming,true);
 }
 const manager=new f.context.Manager(blocks,()=>0,()=>{}),pig=manager.spawnEntity('pig',.5,4,.5);
 for(let i=0;i<60*12;i++){manager.updateEntity(pig,1/60);if(pig.position.x>3&&pig.position.y>=6-.01)break}
 assert.ok(pig.position.x>3,'Animal failed to reach bank: '+JSON.stringify(pig));assert.ok(pig.position.y>=6-.01);assert.equal(pig.isSwimming,false);
 const roof=new f.context.Physics((x,y,z)=>y===4?1:pool(x,y,z)),config=f.context.types.pig,entity={position:{x:.5,y:2,z:.5},velocity:{x:0,y:0,z:0},isOnGround:false};
 for(let i=0;i<300;i++)roof.update(entity,config,1/60);
 assert.ok(entity.position.y+config.boundingBox.height<=4.001);
});
test('camera water probe uses actual water voxels, including third-person cameras, and bounds pending requests',()=>{
 const context={BlockType:{WATER:5},getBlockTypeById:id=>id==='water'?17:undefined};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../scripts/underwater-runtime.js'),'utf8'),context);
 const requests=[],bridge={getBlocksAround:(x,y,z,r,callback)=>requests.push({x,y,z,r,callback})};
 const probe=context.logCreateWaterProbe(bridge),camera={position:{x:.5,y:5.5,z:.5}};
 assert.equal(probe.sample(0,camera),false);probe.sample(100,camera);assert.equal(requests.length,1);
 requests[0].callback([{x:0,y:5,z:0,blockType:17},{x:1,y:5,z:0,blockType:5}]);assert.equal(probe.sample(110,camera),true);
 camera.position.x=1.5;assert.equal(probe.sample(120,camera),false);
 camera.position.y=6.01;assert.equal(probe.sample(130,camera),false);
 probe.dispose();requests.at(-1).callback([{x:1,y:6,z:0,blockType:17}]);assert.equal(probe.sample(140,camera),false);
});
test('underwater hand tint does not accumulate and restores ambient color after leaving water',()=>{
 const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../scripts/underwater-runtime.js'),'utf8'),context);
 class Color{constructor(r=1,g=1,b=1){Object.assign(this,{r,g,b})}clone(){return new Color(this.r,this.g,this.b)}copy(other){Object.assign(this,other);return this}}
 const hand={logUnderwater:1,light:{color:new Color(),intensity:1},ambientLight:{color:new Color(.9,.95,1),intensity:.5}};
 function frame(){hand.light.color.copy(new Color());hand.light.intensity=1;hand.ambientLight.intensity=.5;context.logUnderwaterHand(hand)}
 frame();const submerged=JSON.stringify(hand.ambientLight);
 for(let i=0;i<300;i++)frame();assert.equal(JSON.stringify(hand.ambientLight),submerged);
 hand.logUnderwater=0;frame();assert.deepEqual(hand.ambientLight.color,new Color(.9,.95,1));assert.equal(hand.ambientLight.intensity,.5);assert.deepEqual(hand.light.color,new Color());assert.equal(hand.light.intensity,1);
});
