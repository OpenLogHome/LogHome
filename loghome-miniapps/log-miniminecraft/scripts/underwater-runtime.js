function logCreateWaterProbe(bridge){
 let cells=new Set(),center=null,pending=false,last=-Infinity,alive=true;
 return {sample(now,camera){
  const p=camera.position;
  if(!alive)return false;
  if(!pending&&now-last>=100){
   pending=true;last=now;const point={x:Math.floor(p.x),y:Math.floor(p.y),z:Math.floor(p.z)};
   bridge.getBlocksAround(point.x,point.y,point.z,1,blocks=>{
    if(!alive)return;pending=false;center=point;cells=new Set(blocks.filter(block=>block.blockType===BlockType.WATER).map(block=>block.x+','+block.y+','+block.z));
   });
  }
  if(!center||Math.abs(Math.floor(p.x)-center.x)>1||Math.abs(Math.floor(p.y)-center.y)>1||Math.abs(Math.floor(p.z)-center.z)>1)return false;
  return cells.has(Math.floor(p.x)+','+Math.floor(p.y)+','+Math.floor(p.z));
 },dispose(){alive=false;cells.clear();center=null}};
}
function logApplySwimPose(player,swimming,time,mining){
 if(!swimming)return;
 const phase=time*.005;
 player.body.rotation.x=.12;
 player.leftLeg.rotation.x=Math.sin(phase)*.28;player.rightLeg.rotation.x=-Math.sin(phase)*.28;
 if(!mining){player.leftArm.rotation.x=-.75+Math.sin(phase)*.4;player.rightArm.rotation.x=-.75-Math.sin(phase)*.4;player.leftArm.rotation.z=-.18;player.rightArm.rotation.z=.18}
}
function logUnderwaterHand(hand){
 // logAdvancedHand has already restored the baseline this frame.
 const blend=hand.logUnderwater||0;
 hand.light.color.r*=1-.25*blend;hand.light.color.g*=1-.08*blend;
 hand.light.intensity*=1-.12*blend;hand.ambientLight.intensity*=1-.08*blend;
}
function logUnderwaterPost(source){
 source='uniform float logUnderwater,logUnderwaterLight;\n'+source;
 // Apply once to the final linear scene, including water, before tone mapping.
 return source.replace('gl_FragColor=color;',`if(logUnderwater>.001&&(logStage<.5||(logStage>1.5&&logStage<2.5))){
    float waterDistance=d<.999999?min(length(viewPosition(screenUv,d)),80.):60.;
    vec3 absorption=exp(-vec3(.12,.048,.028)*waterDistance);
    vec3 scatter=vec3(.022,.15,.19)*logUnderwaterLight;
    vec3 submerged=color.rgb*absorption+scatter*(vec3(1.)-absorption);
    vec2 edge=screenUv*2.-1.;submerged*=1.-.06*dot(edge,edge);
    color.rgb=mix(color.rgb,submerged,logUnderwater);
  }
  gl_FragColor=color;`);
}
function logUnderwaterSurface(material){
 const compile=material.onBeforeCompile;
 material.onBeforeCompile=shader=>{
  compile(shader);
  shader.fragmentShader='uniform float logCameraUnderwater;\n'+shader.fragmentShader;
  // A planar reflection rendered from above is invalid on the underside. Show
  // the no-water scene through a lightly tinted surface in both quality modes.
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`if(logCameraUnderwater>.5){
    if(logWaterEnabled>.5){outgoingLight=texture2D(logOpaqueColor,gl_FragCoord.xy/logResolution).rgb*.94+vec3(.005,.015,.018);diffuseColor.a=1.;}
    else{outgoingLight=vec3(.12,.34,.42);diffuseColor.a=.16;}
  }
  #include <opaque_fragment>`);
 };
}
