// Shared by the game Worker and tests. Water occupancy is integrated over the
// body rather than toggled at its centre, giving a stable resting waterline.
function logWaterBody(getBlock,x,y,z,box){
 const w=box.width*.4,d=box.depth*.4,h=box.height;
 let volume=0;
 for(const point of [[0,0],[-w,-d],[-w,d],[w,-d],[w,d]]){
  for(let by=Math.floor(y);by<Math.ceil(y+h);by++){
   if(getBlock(Math.floor(x+point[0]),by,Math.floor(z+point[1]))===BlockType.WATER)volume+=Math.max(0,Math.min(y+h,by+1)-Math.max(y,by));
  }
 }
 return Math.max(0,Math.min(1,volume/(5*h)));
}
function logSwimVelocity(velocity,immersion,control,dt){
 const drag=4,force=(immersion-.65)*24+control*12,decay=Math.exp(-drag*dt);
 return Math.max(-3,Math.min(3,velocity*decay+force/drag*(1-decay)));
}
function logSwimSolid(block){
 return typeof hasCollision==='function'?hasCollision(block):block!==0&&block!==BlockType.WATER&&block!==11;
}
function logSwimBlocked(getBlock,x,y,z,box){
 for(let bx=Math.floor(x-box.width/2+.001);bx<=Math.floor(x+box.width/2-.001);bx++)
 for(let bz=Math.floor(z-box.depth/2+.001);bz<=Math.floor(z+box.depth/2-.001);bz++)
 for(let by=Math.floor(y+.001);by<Math.ceil(y+box.height-.001);by++)if(logSwimSolid(getBlock(bx,by,bz)))return true;
 return false;
}
function logSwimStep(getBlock,blocked,x,y,z,box){
 // Only climb a nearby solid bank; never raise through a low ceiling or wall.
 for(let top=Math.floor(y)+1;top<=y+1.25;top++){
  const supported=[[0,0],[-box.width*.499,-box.depth*.499],[-box.width*.499,box.depth*.499],[box.width*.499,-box.depth*.499],[box.width*.499,box.depth*.499]].some(point=>logSwimSolid(getBlock(Math.floor(x+point[0]),top-1,Math.floor(z+point[1]))));
  if(supported&&!blocked(x,top+.001,z))return top+.001;
 }
 return null;
}
function logPlayerSwim(player,deltaTime,inputs=true){
 const dt=Math.max(0,Math.min(.1,deltaTime)),steps=Math.max(1,Math.ceil(dt*120)),step=dt/steps;
 const get=player.getBlockAt.bind(player),box={width:.6,height:PLAYER_COLLISION_HEIGHT,depth:.6};
 const keys=inputs?player.keys:{},up=!!keys.Space,down=!!(keys.ShiftLeft||keys.ShiftRight);
 let mx=(keys.KeyD?1:0)-(keys.KeyA?1:0)+(inputs&&player.joystickActive?player.joystickX:0);
 let mz=(keys.KeyS?1:0)-(keys.KeyW?1:0)+(inputs&&player.joystickActive?player.joystickY:0);
 const length=Math.hypot(mx,mz);if(length>1){mx/=length;mz/=length}
 if(length<.05||mz>.1||down)player.isSprinting=false;
 const speed=player.isSprinting?3.5:2.5,c=Math.cos(-player.rotationY),s=Math.sin(-player.rotationY);
 const targetX=(mx*c-mz*s)*speed,targetZ=(mx*s+mz*c)*speed;
 const blocked=player.checkCollision.bind(player);
 player.onGround=false;
 for(let i=0;i<steps;i++){
  const immersion=logWaterBody(get,player.positionX,player.positionY,player.positionZ,box);
  player.velocityY=logSwimVelocity(player.velocityY,immersion,(up?1:0)-(down?1:0),step);
  const alpha=1-Math.exp(-7*step);player.velocityX+=(targetX-player.velocityX)*alpha;player.velocityZ+=(targetZ-player.velocityZ)*alpha;
  const newY=player.positionY+player.velocityY*step,hit=player.checkCollisionY(newY);
  if(hit!==null){player.onGround=player.velocityY<0;player.positionY=player.velocityY<0?hit:hit-PLAYER_COLLISION_HEIGHT;player.velocityY=0}else player.positionY=newY;
  for(const axis of ['X','Z']){
   const x=player.positionX+(axis==='X'?player.velocityX*step:0),z=player.positionZ+(axis==='Z'?player.velocityZ*step:0);
   if(!blocked(x,player.positionY,z)){player.positionX=x;player.positionZ=z}
   else if(!down&&(up||player.autoJump)){
    const top=logSwimStep(get,blocked,x,player.positionY,z,box);
    if(top!==null){player.positionY=top;player.positionX=x;player.positionZ=z;player.velocityY=0;player.onGround=true}
   }
  }
 }
 player.isSwimming=logWaterBody(get,player.positionX,player.positionY,player.positionZ,box)>.03;
}
function logInstallWorkerSwimming(Player,Physics,Manager){
 if(Player){
  const proto=Player.prototype,walking=proto.updateWalking,idle=proto.updatePhysicsOnly,input=proto.handleInputEvent;
  const wet=player=>!player.isFlying&&logWaterBody(player.getBlockAt.bind(player),player.positionX,player.positionY,player.positionZ,{width:.6,height:PLAYER_COLLISION_HEIGHT,depth:.6})>.03;
  proto.updateWalking=function(dt){this.isSwimming=wet(this);if(this.isSwimming)logPlayerSwim(this,dt);else{this.velocityX=this.velocityZ=0;walking.call(this,dt)}};
  proto.updatePhysicsOnly=function(dt){
   if(this.isFlying){this.isSwimming=false;return null}
   if(performance.now()-this.lastInputProcessTime<50)return null;
   this.isSwimming=wet(this);if(!this.isSwimming)return idle.call(this,dt);
   logPlayerSwim(this,dt,false);return this.getStateWithThrottle(Date.now());
  };
  proto.handleInputEvent=function(event){if(event.toggleFlying&&!this.isFlying&&wet(this))event={...event,toggleFlying:false};return input.call(this,event)};
  for(const method of ['getState','getStateWithThrottle']){
   const original=proto[method];proto[method]=function(...args){const state=original.apply(this,args);return state?{...state,isSwimming:wet(this)}:state};
  }
 }
 const originalPhysics=Physics.prototype.update;
 Physics.prototype.update=function(entity,config,deltaTime){
  const box=config.boundingBox,get=this.getBlockAt,dt=Math.max(0,Math.min(.1,deltaTime));
  entity.isInWater=logWaterBody(get,entity.position.x,entity.position.y,entity.position.z,box)>.03;
  entity.isSwimming=entity.isInWater;
  if(!entity.isInWater){entity.isSwimming=false;return originalPhysics.call(this,entity,config,deltaTime)}
  const steps=Math.max(1,Math.ceil(dt*120)),step=dt/steps,p=entity.position,v=entity.velocity;
  const blocked=(x,y,z)=>logSwimBlocked(get,x,y,z,box);
  entity.isOnGround=false;
  for(let i=0;i<steps;i++){
   const immersion=logWaterBody(get,p.x,p.y,p.z,box);
   v.y=logSwimVelocity(v.y*60,immersion,0,step)/60;
   const y=p.y+v.y*60*step;
   if(!blocked(p.x,y,p.z))p.y=y;else v.y=0;
   for(const axis of ['x','z']){
    const x=p.x+(axis==='x'?v.x*60*step:0),z=p.z+(axis==='z'?v.z*60*step:0);
    if(!blocked(x,p.y,z)){p.x=x;p.z=z}
    else{
     const top=logSwimStep(get,blocked,x,p.y,z,box);
     if(top!==null){p.y=top;p.x=x;p.z=z;v.y=0;entity.isOnGround=true}
    }
   }
  }
  entity.isInWater=logWaterBody(get,p.x,p.y,p.z,box)>.03;
  entity.isSwimming=entity.isInWater;entity.state=entity.isInWater?'swim':EntityState.WALKING;
 };
 const behavior=Manager.prototype.executeBehavior,animation=Manager.prototype.updateAnimation;
 Manager.prototype.executeBehavior=function(entity,config,dt){
  const box=config.boundingBox,p=entity.position;
  const wet=logWaterBody(this.getBlockAt,p.x,p.y,p.z,box)>.03;
  if(!wet&&(!entity.logShore||logSwimSolid(this.getBlockAt(Math.floor(p.x),Math.floor(p.y-.05),Math.floor(p.z))))){
   entity.logShore=null;return behavior.call(this,entity,config,dt);
  }
  entity.logSwimTimer=(entity.logSwimTimer||0)-dt;
  if(entity.logSwimTimer<=0){
   entity.logSwimTimer=2;entity.logShore=null;
   const level=p.y+box.height*.65;
   search:for(const radius of [2,4,7])for(let i=0;i<8;i++){
    const angle=i*Math.PI/4,x=p.x+Math.sin(angle)*radius,z=p.z+Math.cos(angle)*radius;
    for(let y=Math.ceil(level)+1;y>=Math.floor(level)-1;y--){
     if(logSwimSolid(this.getBlockAt(Math.floor(x),y-1,Math.floor(z)))&&this.physics.canStandAt(x,y,z,config)){
      entity.logShore={x,z};break search;
     }
    }
   }
  }
  const goal=entity.logShore||entity.targetPosition;
  let dx=goal?goal.x-p.x:Math.sin(entity.rotation),dz=goal?goal.z-p.z:Math.cos(entity.rotation),distance=Math.hypot(dx,dz);
  const speed=entity.logShore?Math.min(1.6,Math.max(.8,config.speed*30)):.5;
  if(distance>.05){entity.velocity.x=dx/distance*speed/60;entity.velocity.z=dz/distance*speed/60;entity.rotation=Math.atan2(dx,dz)}
  else entity.velocity.x=entity.velocity.z=0;
 };
 Manager.prototype.updateAnimation=function(entity,dt){if(entity.isSwimming){entity.animationTime+=dt;entity.animationState='swim'}else animation.call(this,entity,dt)};
}
