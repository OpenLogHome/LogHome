// Display a short buffered history, without changing authoritative collision/save state.
function logCreateMotionBuffer(initial,now){
 const copy=(state,time)=>({x:state.positionX,y:state.positionY,z:state.positionZ,time});
 let samples=[copy(initial,now)],latest=initial;
 return {
  reset(state,time){samples=[copy(state,time)];latest=state},
  push(state,time){
   const last=samples[samples.length-1],next=copy(state,time);latest=state;
   if(time-last.time>250||Math.hypot(next.x-last.x,next.y-last.y,next.z-last.z)>4){samples=[next];return}
   if(time<=last.time)samples[samples.length-1]=next;else samples.push(next);
   while(samples.length>2&&samples[1].time<time-150)samples.shift();
  },
  sample(time){
   const target=time-32;let a=samples[0],b=a;
   for(let i=1;i<samples.length;i++){b=samples[i];if(b.time>=target)break;a=b}
   const alpha=b.time>a.time?Math.max(0,Math.min(1,(target-a.time)/(b.time-a.time))):0;
   return {x:a.x+(b.x-a.x)*alpha,y:a.y+(b.y-a.y)*alpha,z:a.z+(b.z-a.z)*alpha,isFlying:latest.isFlying,isSneaking:latest.isSneaking,isSprinting:latest.isSprinting};
  }
 };
}
function logCreateHandMotion(){
 let last=null,time=0,walk=0,sprint=0;
 return {update(now,moving,running){
  const dt=last===null?0:Math.max(0,Math.min(.1,now-last));last=now;time+=dt;
  const alpha=1-Math.exp(-12*dt);walk+=((moving?1:0)-walk)*alpha;sprint+=((moving&&running?1:0)-sprint)*alpha;
  const mix=(a,b,t)=>a+(b-a)*t;
  return {y:mix(Math.sin(time*2)*.01,mix(Math.sin(time*6)*.03,Math.sin(time*10)*.05,sprint),walk),
   x:-.3+mix(Math.sin(time*8)*.08,Math.sin(time*12)*.15,sprint)*walk,
   z:.1+mix(Math.cos(time*8)*.05,Math.cos(time*12)*.1,sprint)*walk,time};
 }};
}
function logReflectionSchedule(){
 let previous=null,last=-Infinity;
 return {due(now,camera){
  const p=camera.position,q=camera.quaternion;
  const current=[p.x,p.y,p.z,q.x,q.y,q.z,q.w];
  const changed=!previous||current.some((value,index)=>Math.abs(value-previous[index])>1e-6);
  if(!changed&&now-last<66)return false;
  previous=current;last=now;return true;
 }};
}
function renderHandItem(n,e,t=!1,r=!1,o=!1,i=0){
 logAdvancedHand(n);const {scene:s,camera:c,renderer:h,itemGroup:f}=n;
 const pose=(n.logHandMotion||(n.logHandMotion=logCreateHandMotion())).update(e,t,r);
 if(!n.currentItemId){h.render(s,c);return}
 if(i>0){const p=Math.min(i/.3,1),m=Math.sin(p*Math.PI);f.position.y=-.03*m;f.rotation.x=-.3-m*.6;f.rotation.z=.1}
 else if(o){const d=e*MINING_ANIMATION_SPEED%(Math.PI*2)/(Math.PI*2),p=MINING_SWING_AMPLITUDE*(1-Math.abs(d*2-1));f.position.y=-.02;f.rotation.x=-.3-p*.8;f.rotation.z=.1+Math.sin(e*MINING_ANIMATION_SPEED*.5)*.05}
 else{f.position.y=pose.y;f.rotation.x=pose.x;f.rotation.z=pose.z}
 h.render(s,c);
}
function patchMotion(source){
 const replace=(before,after)=>{if(source.split(before).length!==2)throw Error('Motion patch boundary changed: '+before.slice(0,100));source=source.replace(before,after)};
 replace('const logQuality=logCreateQualityPipeline(ln,fn,qe,Wt);',`const logQuality=logCreateQualityPipeline(ln,fn,qe,Wt);const logMotion=logCreateMotionBuffer(J.current,performance.now()),logReflection=logReflectionSchedule();let logPreviousVisual=null,logIsWalking=false;
 function logApplyVisualMotion(now,dt){
  const visual=logMotion.sample(now),state=J.current;
  const dx=logPreviousVisual?visual.x-logPreviousVisual.x:0,dz=logPreviousVisual?visual.z-logPreviousVisual.z:0;
  const distance=Math.hypot(dx,dz);logIsWalking=distance>Math.max(.00001,dt*.05)&&!visual.isFlying;logPreviousVisual=visual;
  updateCameraPosition(qe,visual.x,visual.y,visual.z,state.rotationX,state.rotationY,pn.current,sn.current);
  const player=Vt.current;if(player){player.model.position.set(visual.x,visual.y,visual.z);
   const mining=Dn.current.isMining&&Dn.current.targetY!==-1;
   Jr(player.model,player.head,state.rotationY,state.rotationX,pn.current,dx,dz,logIsWalking,distance,mining||fo.current>0);
   Xr(player.head,player.body,player.leftArm,player.rightArm,player.leftLeg,player.rightLeg,visual.x,visual.y,visual.z,visual.isFlying,visual.isSneaking,mining);
  }
  if(G.current){G.current.group.position.set(visual.x,visual.y,visual.z);G.current.group.visible=We.current&&pn.current!=="first-person"}
  if(Ce.current?.visible)Ce.current.position.set(visual.x,visual.y+PLAYER_CAMERA_HEIGHT,visual.z);
  if(xe.current?.directionalLight.castShadow)xe.current.directionalLight.target.position.set(visual.x,0,visual.z);
 }`);
 const start=source.indexOf('gn.setOnPlayerStateUpdate(ve=>{'),end=source.indexOf('P&&P({x:ve.positionX',start);
 if(start<0||end<start)throw Error('Missing player state callback');
 const section=source.slice(start,end),assignment=section.match(/J\.current=\{\.\.\.J\.current,positionX:ve\.positionX[^;]+;/)?.[0];
 if(!assignment)throw Error('Missing authoritative player state assignment');
 source=source.slice(0,start)+'gn.setOnPlayerStateUpdate(ve=>{'+assignment+'logMotion.push(ve,performance.now());const on=J.current.rotationX,_r=J.current.rotationY;'+source.slice(end);
 replace('if(L.current=requestAnimationFrame(Fo),jr.current){logFrameGate.reset();return}', 'if(L.current=requestAnimationFrame(Fo),jr.current){logFrameGate.reset();logMotion.reset(J.current,ve);logPreviousVisual=null;be.current=ve;return}');
 replace('be.current=ve,Er.update(Ct),bt.current&&bt.current.update();', 'be.current=ve,Er.update(Ct),logApplyVisualMotion(ve,Ct),bt.current&&bt.current.update();');
 // Pointer look stays immediate, using the same displayed position as the next RAF.
 replace('_r&&J.current.positionX!==void 0&&updateCameraPosition(_r,J.current.positionX,J.current.positionY,J.current.positionZ,J.current.rotationX,J.current.rotationY,pn.current,sn.current)', '_r&&J.current.positionX!==void 0&&(()=>{const visual=logMotion.sample(performance.now());updateCameraPosition(_r,visual.x,visual.y,visual.z,J.current.rotationX,J.current.rotationY,pn.current,sn.current)})()');
 replace('const kt=J.current,zn=ir.current,yn=zn?Math.abs(kt.positionX-zn.x)>.001||Math.abs(kt.positionZ-zn.z)>.001:!1;tr&&(ir.current={x:kt.positionX,z:kt.positionZ});', 'const kt=J.current,yn=logIsWalking;');
 replace('Xe.current&&un.current&&fe.current&&Re.current&&kt>=Xt', 'Xe.current&&un.current&&fe.current&&Re.current&&logReflection.due(ve,qe)');
 replace('g.isMoving=v>.01&&!d', 'g.isMoving=v>Math.max(.00001,S*.05)&&!d');
 replace('g.time+=S*C', 'g.time+=WALK_ANIMATION_SPEED*v*.16');
 replace('function usePlayerRotation(){const n=reactExports.useRef(Math.PI),', 'function usePlayerRotation(){const n=reactExports.useRef(Math.PI),logRotationTime=reactExports.useRef(null),');
 replace('if(!r||!o)return;const p=i,m=s;', 'if(!r||!o)return;const logNow=performance.now(),logDt=logRotationTime.current===null?1/60:Math.min(.1,Math.max(0,(logNow-logRotationTime.current)/1000));logRotationTime.current=logNow;const p=i,m=s;');
 replace('n.current=normalizeAngle(n.current+b*_)', 'n.current=normalizeAngle(n.current+b*(1-Math.pow(1-_,logDt*60)))');
 const handStart=source.indexOf('function renderHandItem('),handEnd=source.indexOf('function resizeHandItemRenderer(',handStart);
 if(handStart<0||handEnd<handStart)throw Error('Missing hand animation boundary');
 source=source.slice(0,handStart)+renderHandItem.toString()+source.slice(handEnd);
 return source+'\n'+[logCreateMotionBuffer,logCreateHandMotion,logReflectionSchedule].map(fn=>fn.toString()).join('\n');
}
module.exports={patchMotion,logCreateMotionBuffer,logCreateHandMotion,logReflectionSchedule};
