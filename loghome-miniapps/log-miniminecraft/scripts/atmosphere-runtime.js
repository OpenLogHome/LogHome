function logFogProfile(near,far,weatherDensity=0){
  const end=Math.max(1,far),start=Math.min(end-1,Math.max(0,near));
  // Fair-weather haze and the final loaded-world fade serve different purposes.
  return {density:weatherDensity>=.003?.0025:.00065,near:weatherDensity>=.003?start:Math.max(start,end*.8),far:end};
}
function logAtmosphereUniforms(){
  if(!logAtmosphereUniforms.value)logAtmosphereUniforms.value={logBypassLegacyFog:{value:0},logLeafEnabled:{value:0},logLeafMask:{value:null},logLeafSun:{value:new Vector3(0,1,0)},logLeafLight:{value:new Color(0,0,0)}};
  return logAtmosphereUniforms.value;
}
function logEnhanceLeaves(material){
  const compile=material.onBeforeCompile;
  material.onBeforeCompile=shader=>{
    compile(shader);Object.assign(shader.uniforms,logAtmosphereUniforms());
    shader.vertexShader='uniform sampler2D logLeafMask;varying float logLeaf;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('vLayerIndex = layerData.r;', 'vLayerIndex = layerData.r;logLeaf=texture2D(logLeafMask,layerDataCoord).r;');
    shader.fragmentShader='uniform float logLeafEnabled;uniform vec3 logLeafSun;uniform vec3 logLeafLight;varying float logLeaf;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`if(logLeafEnabled>.5&&logLeaf>.5){
      float backLight=pow(max(dot(-normal,normalize(mat3(viewMatrix)*logLeafSun)),0.),2.);
      outgoingLight+=diffuseColor.rgb*logLeafLight*backLight*.3;
    }
    #include <opaque_fragment>`);
  };
  material.customProgramCacheKey=()=> 'log-leaf-transmission-v1';return material;
}
function logCreateLeafMask(){
  const data=new Float32Array(LAYER_INDEX_TEXTURE_SIZE*LAYER_INDEX_TEXTURE_SIZE*4);
  const texture=new DataTexture(data,LAYER_INDEX_TEXTURE_SIZE,LAYER_INDEX_TEXTURE_SIZE,RGBAFormat,FloatType);texture.minFilter=texture.magFilter=NearestFilter;texture.needsUpdate=true;
  let oldTexture=null,oldSize=-1;
  return {update(){
    const indices=getTextureIndexMap();if(oldTexture===layerIndexTexture&&oldSize===indices.size)return;
    oldTexture=layerIndexTexture;oldSize=indices.size;data.fill(0);
    const leaves=new Set(getAllBlockDefinitions().filter(block=>block.leaves||block.customData?.block_type==='leaves'||block.blockType==='leaves').map(block=>block.id));
    const flags=new Map();for(const [key,index]of indices){const id=key.replace(/_\d+_\d+$/,'');flags.set(index,(flags.get(index)||0)|(leaves.has(id)?1:2))}
    // A texture shared with glass or another material must not acquire leaf lighting.
    for(const [index,flag]of flags)if(flag===1&&index*4<data.length)data[index*4]=1;
    texture.needsUpdate=true;logAtmosphereUniforms().logLeafMask.value=texture;
  },dispose(){if(logAtmosphereUniforms().logLeafMask.value===texture)logAtmosphereUniforms().logLeafMask.value=null;texture.dispose()}};
}
function logAtmospherePost(source){
  source='uniform float logStage;uniform mat4 logCameraWorld;uniform vec3 logHorizon;uniform float logFogDensity;uniform float logFogNear,logFogFar;\n'+source;
  source=source.replace('if(aoEnabled>.5&&d<.999999)', 'if(aoEnabled>.5&&logStage<1.5&&d<.999999)');
  source=source.replace('if(logAdvanced>.5&&logBloomStrength>0.)', `if(logAdvanced>.5&&logStage<1.5&&d<.999999){
    vec3 view=viewPosition(screenUv,d);vec3 world=(logCameraWorld*vec4(view,1.)).xyz;
    float distanceFade=max(length(view)-48.,0.);
    float averageHeight=(world.y+logCameraWorld[3].y)*.5;
    float density=logFogDensity*exp(-max(averageHeight-64.,0.)*.008);
    float fog=clamp(1.-exp(-distanceFade*density),0.,.22);
    fog=max(fog,smoothstep(logFogNear,logFogFar,length(world.xz-logCameraWorld[3].xz)));
    color.rgb=mix(color.rgb,logHorizon,fog);
  }
  if(logAdvanced>.5&&logStage>1.5&&logStage<2.5&&logBloomStrength>0.)`);
  source=source.replace('#include <tonemapping_fragment>', 'if(logStage==1.||logStage==3.){gl_FragDepth=d;return;}\n      #include <tonemapping_fragment>');
  return source;
}
function logPrepareAtmosphereMaterials(scene){
  scene.traverse(object=>{if(!object.material)return;for(const material of(Array.isArray(object.material)?object.material:[object.material])){
    if(!material.fog||material.userData.logAtmospherePrepared)continue;
    material.userData.logAtmospherePrepared=true;
    const compile=material.onBeforeCompile,key=material.customProgramCacheKey();
    material.onBeforeCompile=shader=>{compile(shader);shader.uniforms.logBypassLegacyFog=logAtmosphereUniforms().logBypassLegacyFog;shader.fragmentShader='uniform float logBypassLegacyFog;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <fog_fragment>',`if(logBypassLegacyFog<.5){
      #include <fog_fragment>
    }`)};
    material.customProgramCacheKey=()=>key+'-atmosphere-pass-v1';material.needsUpdate=true;
  }});
}
