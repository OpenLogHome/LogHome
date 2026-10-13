const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {logCreateMotionBuffer,logCreateHandMotion,logReflectionSchedule}=require('../scripts/motion.cjs');
const state=x=>({positionX:x,positionY:64,positionZ:0,isFlying:false});
test('hand animation has the same phase and pose after one second at every target FPS',()=>{
 for(const running of [false,true]){
  let reference;
  for(const fps of [30,60,90,120]){const motion=logCreateHandMotion();motion.update(0,true,running);let pose;
   for(let i=1;i<=fps;i++)pose=motion.update(i/fps,true,running);
   assert.ok(Math.abs(pose.time-1)<1e-10);
   if(reference)for(const key of ['x','y','z'])assert.ok(Math.abs(pose[key]-reference[key])<1e-10);reference=pose;
  }
 }
});
test('60 Hz position messages interpolate into continuous 120 FPS movement without extrapolating',()=>{
 const motion=logCreateMotionBuffer(state(0),0);let next=16,previous=null;
 for(let time=0;time<=1000;time+=1000/120){while(next<=time){motion.push(state(next*.004),next);next+=16}
  const visual=motion.sample(time);assert.ok(Math.abs(visual.x-Math.max(0,time-32)*.004)<1e-9);
  if(previous!==null&&time>48)assert.ok(Math.abs(visual.x-previous-4/120)<1e-9);previous=visual.x;
 }
 assert.equal(motion.sample(3000).x,4*(next-16)/1000);
});
test('teleport, pause reset and delayed snapshots snap safely instead of interpolating across the world',()=>{
 const motion=logCreateMotionBuffer(state(0),0);motion.push(state(.064),16);motion.push(state(20),32);assert.equal(motion.sample(32).x,20);
 motion.reset(state(21),5000);assert.equal(motion.sample(5000).x,21);
 motion.push(state(22),6000);assert.equal(motion.sample(6000).x,22);
});
test('reflections follow every moving render frame and retain idle throttling',()=>{
 const schedule=logReflectionSchedule(),camera={position:{x:0,y:65,z:0},quaternion:{x:0,y:0,z:0,w:1}};
 assert.equal(schedule.due(0,camera),true);assert.equal(schedule.due(8,camera),false);
 for(let i=1;i<=120;i++){camera.position.x=i/120;assert.equal(schedule.due(i*1000/120,camera),true)}
 assert.equal(schedule.due(1008,camera),false);camera.quaternion.y=.01;assert.equal(schedule.due(1016,camera),true);
 assert.equal(schedule.due(1082,camera),true);
});
test('real player limb animation advances equally for the same walking distance at different FPS',()=>{
 const {patchBundle}=require('../scripts/build.cjs'),source=patchBundle(fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8'));
 const start=source.indexOf('function useWalkAnimation()'),end=source.indexOf('function normalizeAngle(',start);let reference;
 for(const fps of [30,60,90,120]){
  let now=1000,ref;const context={performance:{now:()=>now},reactExports:{useRef:value=>(ref={current:value}),useCallback:fn=>fn},MAX_DELTA_TIME:.1,SNEAK_TRANSITION_SPEED:3,MINING_TRANSITION_SPEED:8,SNEAK_BODY_FORWARD_ANGLE:.2,DEFAULT_BODY_Y:0,SNEAK_HEIGHT_OFFSET:.05,WALK_ANIMATION_SPEED:8,WALK_SWING_AMPLITUDE:.6,SNEAK_SWING_AMPLITUDE_FACTOR:.5,SNEAK_ARM_FORWARD_ANGLE:-.1,SNEAK_LEG_BEND_ANGLE:-.25,IDLE_LERP_SPEED:8};
  vm.createContext(context);vm.runInContext(source.slice(start,end)+';this.animation=useWalkAnimation()',context);
  const parts=Array.from({length:6},()=>({position:{y:0},rotation:{x:0,z:0}}));context.animation.updateAnimation(...parts,0,64,0,false,false,false);
  for(let i=1;i<=fps;i++){now=1000+i*1000/fps;context.animation.updateAnimation(...parts,4*i/fps,64,0,false,false,false)}
  if(reference!==undefined)assert.ok(Math.abs(ref.current.time-reference)<1e-9);reference=ref.current.time;
 }
});
