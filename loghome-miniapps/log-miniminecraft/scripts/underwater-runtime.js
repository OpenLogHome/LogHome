function logCreateWaterProbe(bridge){
 let cells=new Set(),center=null,pending=false,last=-Infinity,alive=true;
 return {sample(now,camera){
  const p=camera.position;
  if(!alive)return false;
  if(!pending&&now-last>=100){
   pending=true;last=now;const point={x:Math.floor(p.x),y:Math.floor(p.y),z:Math.floor(p.z)};
   bridge.getBlocksAround(point.x,point.y,point.z,1,blocks=>{
    if(!alive)return;pending=false;center=point;
    // Worker IDs come from the live registry. The exported BlockType.WATER=5
    // is legacy; in the installed default pack water is registered as 17.
    const waterType=getBlockTypeById('water');
    cells=new Set(blocks.filter(block=>block.blockType===waterType).map(block=>block.x+','+block.y+','+block.z));
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
 if(!hand.logWaterAmbientColor)hand.logWaterAmbientColor=hand.ambientLight.color.clone();
 hand.ambientLight.color.copy(hand.logWaterAmbientColor);
 hand.light.color.r*=1-.35*blend;hand.light.color.g*=1-.12*blend;
 hand.ambientLight.color.r*=1-.35*blend;hand.ambientLight.color.g*=1-.12*blend;
 hand.light.intensity*=1-.12*blend;hand.ambientLight.intensity*=1-.08*blend;
}
function logUnderwaterPost(source){
 source='uniform float logUnderwater,logUnderwaterLight;\n'+source;
 // Apply once to the final linear scene, including water, before tone mapping.
 return source.replace('gl_FragColor=color;',`if(logUnderwater>.001&&(logStage<.5||(logStage>1.5&&logStage<2.5))){
    float waterDistance=d<.999999?min(length(viewPosition(screenUv,d)),64.):64.;
    // Vanilla-style underwater fog has a definite range and already contributes
    // close to the eye. Values adapt that look to our linear-light pipeline.
    float fog=smoothstep(-8.,32.,waterDistance);
    vec3 absorption=exp(-vec3(.055,.019,.008)*waterDistance);
    vec3 waterColor=vec3(.005,.028,.16)*mix(.16,1.,logUnderwaterLight);
    vec3 submerged=mix(color.rgb*absorption*vec3(.78,.9,1.),waterColor,fog);
    color.rgb=mix(color.rgb,submerged,logUnderwater);
  }
  gl_FragColor=color;`);
}
function logUnderwaterSurface(material){
 const compile=material.onBeforeCompile;
 material.onBeforeCompile=shader=>{
  compile(shader);
  shader.fragmentShader='uniform float logCameraUnderwater;\n'+shader.fragmentShader;
  // Keep the blue pixel texture visible from below; a nearly unchanged copy of
  // the scene above made the water boundary look like a missing surface.
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`if(logCameraUnderwater>.5){
    vec3 surfaceColor=vec3(.018,.085,.3);
    #ifdef USE_MAP
      surfaceColor=mix(surfaceColor,texColor.rgb,.3);
    #endif
    if(logWaterEnabled>.5){outgoingLight=mix(texture2D(logOpaqueColor,gl_FragCoord.xy/logResolution).rgb,surfaceColor,.42);diffuseColor.a=1.;}
    else{outgoingLight=surfaceColor;diffuseColor.a=.42;}
  }
  #include <opaque_fragment>`);
 };
}
