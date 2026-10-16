function logQualitySettings() {
  if (!logQualitySettings.value) {
    let saved={};try{saved=JSON.parse(localStorage.getItem('log_minecraft_quality')||'{}')||{};}catch{}
    logQualitySettings.value={ao:saved.ao!==false,sky:saved.sky!==false,water:saved.water!==false};
  }
  return logQualitySettings.value;
}
function LogQualitySettings() {
  const [settings,setSettings]=reactExports.useState(()=>({...logQualitySettings()}));
  return jsxRuntimeExports.jsxs('div',{className:'log-target-fps',children:[
    jsxRuntimeExports.jsx('div',{className:'log-target-fps-title',children:'画质增强'}),
    jsxRuntimeExports.jsx(LogAdvancedSettings,{}),
    ...[['ao','环境遮蔽 AO'],['sky','天空与光照'],['water','水面与浅水过渡']].map(([key,label])=>jsxRuntimeExports.jsx('button',{className:'log-quality-toggle','aria-pressed':settings[key],onClick:()=>{const next={...logQualitySettings(),[key]:!settings[key]};logQualitySettings.value=next;try{localStorage.setItem('log_minecraft_quality',JSON.stringify(next));}catch{}setSettings(next)},children:label+'：'+(settings[key]?'开':'关')},key)),
    jsxRuntimeExports.jsx('p',{children:'即时生效。AO 增强屏幕内接触阴影；水面增强会增加一次场景绘制。'})]});
}
function logCloneWeather(config) {
  const result={...config};for(const key of Object.keys(result))if(result[key]?.isColor)result[key]=result[key].clone();return result;
}
function logCreateEnvironment(day,weather,shadow) {
  let frame=-1,last=-2;
  const old=weather.scene.onBeforeRender;
  return {begin(time){frame=time},render(){
    if(frame===last)return;last=frame;
    // Run each simulation once per RAF, including reflection/depth passes.
    day.onBeforeRenderCallback?.();old?.();
    if(day.camera)day.updateSkyboxPosition(day.camera.position);
    // Rebuild the lighting baseline without firing UI time callbacks every frame.
    const onTimeChange=day.onTimeChange;day.onTimeChange=null;
    try{day.applyCurrentState()}finally{day.onTimeChange=onTimeChange}
    if(day.skyboxMaterial){day.skyboxMaterial.uniforms.logAdvancedSky??={value:0};day.skyboxMaterial.uniforms.logAdvancedSky.value=logAdvancedActive()?1:0}
    if(!logAdvancedActive()&&!logQualitySettings().sky){if(weather.currentConfig)weather.applyConfig(weather.currentConfig,1);shadow();return}
    const c=weather.currentConfig,light=day.directionalLight,hemi=day.hemisphereLight,ambient=day.ambientLight;
    if(c){
      logAtmosphereUniforms.weatherDensity=c.fogDensity||0;
      const daylight=Math.max(.08,Math.min(1,light.intensity/1.3));
      light.intensity*=Math.max(.12,Math.min(1,c.sunIntensity/1.3));
      light.color.multiply(c.sunColor);
      ambient.intensity=Math.max(.12,Math.min(.48,ambient.intensity+c.ambientIntensity*.16));
      hemi.intensity=Math.max(.22,hemi.intensity);
      hemi.groundColor.lerp(new Color(0x716555),.18);
      const cloudy=weather.currentWeatherId==='sunny'?0:.55;
      const sky=day.skyboxMaterial?.uniforms;
      if(sky){
        sky.uSkyColorTop.value.lerp(c.skyColorTop.clone().multiplyScalar(daylight),cloudy);
        sky.uSkyColorBottom.value.lerp(c.skyColorBottom.clone().multiplyScalar(daylight),cloudy);
        if(weather.scene.fog)weather.scene.fog.color=sky.uSkyColorBottom.value.clone();
      }
      if(weather.isLightning)light.intensity=Math.max(light.intensity,2);
    }
    logAtmosphereUniforms().logLeafEnabled.value=logAdvancedActive()?1:0;
    logAdvancedLighting(day);shadow();
  }};
}
function logCreateQualityPipeline(renderer,scene,camera,manager) {
  const size=new Vector2();
  const colorType=renderer.extensions.has('EXT_color_buffer_float')?HalfFloatType:UnsignedByteType;
  const makeTarget=(depthOnly=false)=>{const t=new WebGLRenderTarget(1,1,{minFilter:LinearFilter,magFilter:LinearFilter,depthBuffer:true,type:depthOnly?UnsignedByteType:colorType});t.texture.colorSpace=LinearSRGBColorSpace;t.depthTexture=new DepthTexture(1,1,UnsignedIntType);t.samples=depthOnly?0:Math.min(4,renderer.capabilities.maxSamples);return t};
  let target=null,opaque=null,advanced=null,waterTime=null;
  const waterLights=[];scene.traverse(object=>{if(object.isLight)waterLights.push(object)});
  const uniforms={logUnderwater:{value:0},logUnderwaterLight:{value:1},logStage:{value:0},logCameraWorld:{value:new Matrix4()},logHorizon:{value:new Color()},logFogDensity:{value:.00065},logFogNear:{value:1e8},logFogFar:{value:1e9},logAdvanced:{value:0},logSamples:{value:16},logBloom:{value:null},logBloomStrength:{value:0},image:{value:null},depthMap:{value:null},resolution:{value:size},nearClip:{value:camera.near},farClip:{value:camera.far},projectionInverse:{value:new Matrix4()},aoEnabled:{value:1}};
  const material=new ShaderMaterial({depthTest:false,depthWrite:false,toneMapped:true,uniforms,vertexShader:'varying vec2 screenUv;void main(){screenUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:logAtmospherePost(logAdvancedPostFragment(`
    precision highp float;
    varying vec2 screenUv;uniform sampler2D image,depthMap;uniform vec2 resolution;uniform mat4 projectionInverse;uniform float nearClip,farClip,aoEnabled;
    vec3 viewPosition(vec2 uv,float d){vec4 p=projectionInverse*vec4(uv*2.-1.,d*2.-1.,1.);return p.xyz/p.w;}
    void main(){vec4 color=texture2D(image,screenUv);float d=texture2D(depthMap,screenUv).r;
      if(aoEnabled>.5&&d<.999999){vec3 p=viewPosition(screenUv,d);vec3 normal=normalize(cross(dFdx(p),dFdy(p)));if(normal.z<0.)normal=-normal;
        float radius=clamp(resolution.y*.65/max(-p.z,.1),1.,32.);float occ=0.;
        for(int i=0;i<8;i++){float angle=float(i)*.785398163;vec2 uv=screenUv+vec2(cos(angle),sin(angle))*radius/resolution;
          if(uv.x>0.&&uv.x<1.&&uv.y>0.&&uv.y<1.){float sd=texture2D(depthMap,uv).r;if(sd<.999999){vec3 delta=viewPosition(uv,sd)-p;float len=length(delta);occ+=max(dot(normal,delta)/max(len,.001)-.12,0.)*(1.-smoothstep(.1,1.5,len));}}}
        color.rgb*=1.-min(.32,occ*.12);
      }gl_FragColor=color;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`))});
  const postScene=new Scene(),postCamera=new OrthographicCamera(-1,1,1,-1,0,1),quad=new Mesh(new PlaneGeometry(2,2),material);postScene.add(quad);
  const waterUniforms={logCameraUnderwater:{value:0},logOpaqueDepth:{value:null},logResolution:{value:size},logNear:{value:camera.near},logFar:{value:camera.far},logWaterEnabled:{value:0},logAdvancedWater:{value:0},logOpaqueColor:{value:null},logWaterTime:{value:0}};
  logCreateQualityPipeline.waterUniforms=waterUniforms;
  return {isUnderwater(){return waterUniforms.logCameraUnderwater.value>.5},setUnderwater(wet,now=performance.now()){
    const dt=waterTime===null?1/60:Math.max(0,Math.min(.1,(now-waterTime)/1000));waterTime=now;
    const desired=wet?1:0;uniforms.logUnderwater.value+=(desired-uniforms.logUnderwater.value)*(1-Math.exp(-dt*14));
    if(Math.abs(uniforms.logUnderwater.value-desired)<.001)uniforms.logUnderwater.value=desired;
    waterUniforms.logCameraUnderwater.value=wet?1:0;
    return uniforms.logUnderwater.value;
  },render(){
    if(logAdvancedSettings().enabled&&!advanced&&!logAdvancedSettings.error){const error=logAdvancedCapability(renderer);if(error)logAdvancedError(error)}
    const active=logAdvancedActive(),options=active?{ao:true,water:true}:logQualitySettings(),underwater=uniforms.logUnderwater.value>.001;
    uniforms.logUnderwaterLight.value=Math.max(.06,Math.min(1,waterLights.reduce((sum,light)=>sum+light.intensity*(light.isDirectionalLight ? .4 : .3),0)));renderer.getDrawingBufferSize(size);
    if(!active&&advanced){advanced.dispose();advanced=null}
    if(opaque&&((opaque.texture.type===HalfFloatType)!==active)){opaque.dispose();opaque=null}
    uniforms.logStage.value=0;uniforms.logCameraWorld.value.copy(camera.matrixWorld);uniforms.logHorizon.value.copy(scene.fog?.color||new Color(0xadc6dc));
    logAtmosphereUniforms().logLeafEnabled.value=active?1:0;
    uniforms.logAdvanced.value=active?1:0;uniforms.logSamples.value=logAdvancedSettings().preset==='high'?24:16;uniforms.logBloomStrength.value=0;
    waterUniforms.logAdvancedWater.value=active?1:0;waterUniforms.logWaterTime.value=performance.now()*.001;
    if(!options.ao&&!options.water&&!underwater){waterUniforms.logWaterEnabled.value=0;renderer.render(scene,camera);return}
    if(!target)target=makeTarget();if(target.width!==size.x||target.height!==size.y)target.setSize(size.x,size.y);
    const waters=[];manager.getWaterContainers().forEach(list=>list.forEach(item=>{if(item?.mesh.visible)waters.push(item.mesh)}));
    const previous=renderer.getRenderTarget(),auto=renderer.autoClear,tone=renderer.toneMapping,exposure=renderer.toneMappingExposure,shaderError=renderer.debug.onShaderError;
    let fallback=false;
    try{
      if(active){
        renderer.debug.onShaderError=()=>{throw Error('高阶光影着色器编译失败')};
        renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
        if(!advanced){advanced=logCreateAdvancedResources(renderer,scene,camera);advanced.shadows();advanced.prepare();renderer.compile(postScene,postCamera)}
        advanced.shadows();
      }
      if(underwater)logPrepareAtmosphereMaterials(scene);
      logAtmosphereUniforms().logBypassLegacyFog.value=active||underwater?1:0;
      waterUniforms.logWaterEnabled.value=0;
      if(active||((options.water||underwater)&&waters.length)){
        if(!opaque)opaque=makeTarget(!active);if(opaque.width!==size.x||opaque.height!==size.y)opaque.setSize(size.x,size.y);
        for(const mesh of waters)mesh.visible=false;
        renderer.setRenderTarget(opaque);renderer.render(scene,camera);
        for(const mesh of waters)mesh.visible=true;
        waterUniforms.logOpaqueColor.value=opaque.texture;waterUniforms.logOpaqueDepth.value=opaque.depthTexture;waterUniforms.logWaterEnabled.value=1;
      }
      waterUniforms.logNear.value=camera.near;waterUniforms.logFar.value=camera.far;
      uniforms.projectionInverse.value.copy(camera.projectionMatrixInverse);
      if(active){
        // AO and atmosphere belong to the terrain radiance, before water reflection/transmission.
        uniforms.image.value=opaque.texture;uniforms.depthMap.value=opaque.depthTexture;uniforms.aoEnabled.value=1;uniforms.logStage.value=1;
        uniforms.logHorizon.value.copy(scene.fog?.color||new Color(0xadc6dc));
        const fogProfile=logFogProfile(scene.fog?.near??1e8,scene.fog?.far??1e9,logAtmosphereUniforms.weatherDensity||0);
        uniforms.logFogDensity.value=scene.fog?.isFog?fogProfile.density:0;uniforms.logFogNear.value=fogProfile.near;uniforms.logFogFar.value=fogProfile.far;
        const processed=advanced.processed(size.x,size.y);renderer.setRenderTarget(processed);renderer.render(postScene,postCamera);
        waterUniforms.logOpaqueColor.value=processed.texture;
        uniforms.image.value=processed.texture;uniforms.logStage.value=3;
        material.depthTest=true;material.depthWrite=true;material.depthFunc=AlwaysDepth;
        renderer.setRenderTarget(target);renderer.render(postScene,postCamera);
        material.depthTest=false;material.depthWrite=false;
        const hidden=[],waterSet=new Set(waters),background=scene.background,shadowAuto=renderer.shadowMap.autoUpdate;
        try{
          scene.traverse(object=>{if(object.visible&&(object.isMesh||object.isPoints||object.isLine||object.isSprite)&&!waterSet.has(object)){hidden.push(object);object.visible=false}});
          scene.background=null;renderer.autoClear=false;renderer.shadowMap.autoUpdate=false;
          if(waters.length)renderer.render(scene,camera);
        }finally{for(const object of hidden)object.visible=true;scene.background=background;renderer.autoClear=auto;renderer.shadowMap.autoUpdate=shadowAuto}
        uniforms.logStage.value=2;uniforms.aoEnabled.value=0;
      }else{renderer.setRenderTarget(target);renderer.render(scene,camera);uniforms.aoEnabled.value=options.ao?1:0}
      uniforms.image.value=target.texture;uniforms.depthMap.value=target.depthTexture;
      if(active&&logAdvancedSettings().bloom){uniforms.logBloom.value=advanced.bloom(target.texture,size.x,size.y);uniforms.logBloomStrength.value=.16}
      renderer.setRenderTarget(previous);renderer.autoClear=true;renderer.render(postScene,postCamera);
    }catch(error){if(!active)throw error;logAdvancedError(error.message||'渲染初始化失败');fallback=true;advanced?.dispose();advanced=null}
    finally{logAtmosphereUniforms().logBypassLegacyFog.value=0;material.depthTest=false;material.depthWrite=false;renderer.toneMapping=tone;renderer.toneMappingExposure=exposure;renderer.debug.onShaderError=shaderError;for(const mesh of waters)mesh.visible=true;renderer.setRenderTarget(previous);renderer.autoClear=auto;waterUniforms.logWaterEnabled.value=0;waterUniforms.logAdvancedWater.value=0}
    if(fallback)this.render();
  },dispose(){advanced?.dispose();advanced=null;target?.dispose();opaque?.dispose();quad.geometry.dispose();material.dispose();if(logCreateQualityPipeline.waterUniforms===waterUniforms)delete logCreateQualityPipeline.waterUniforms}};
}
function logEnhanceWater(material) {
  const compile=material.onBeforeCompile;
  material.onBeforeCompile=shader=>{
    compile(shader);
    // worldpos_vertex omits worldPosition when shadows and environment maps are off.
    shader.vertexShader=shader.vertexShader.replace('vWorldPosition = worldPosition;',`vec4 logWaterPosition=vec4(transformed,1.);
      #ifdef USE_INSTANCING
        logWaterPosition=instanceMatrix*logWaterPosition;
      #endif
      vWorldPosition=modelMatrix*logWaterPosition;`).replace('cameraPosition - worldPosition.xyz','cameraPosition - vWorldPosition.xyz');
    const uniforms=logCreateQualityPipeline.waterUniforms||{logOpaqueDepth:{value:null},logResolution:{value:new Vector2(1,1)},logNear:{value:.1},logFar:{value:1000},logWaterEnabled:{value:0}};
    Object.assign(shader.uniforms,uniforms);
    shader.fragmentShader='uniform sampler2D logOpaqueDepth;uniform vec2 logResolution;uniform float logNear,logFar,logWaterEnabled;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('float reflectionStrength = 0.95 + 0.05 * fresnel;',`float reflectionStrength = logWaterEnabled>.5 ? .04+.76*fresnel : .95+.05*fresnel;`)
    .replace('diffuseColor.rgb = mix(texColor.rgb, mirrorReflection, reflectionStrength * reflectionColor.a);',`diffuseColor.rgb = mix(texColor.rgb, mirrorReflection, reflectionStrength * reflectionColor.a);
      if(logWaterEnabled>.5){
        float opaqueDepth=texture2D(logOpaqueDepth,gl_FragCoord.xy/logResolution).r;
        float groundDistance=logNear*logFar/(logFar-opaqueDepth*(logFar-logNear));
        float surfaceDistance=logNear*logFar/(logFar-gl_FragCoord.z*(logFar-logNear));
        float thickness=max(0.,groundDistance-surfaceDistance);
        float deep=1.-exp(-thickness*.32);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.025,.16,.19),deep*.22);
        diffuseColor.a=mix(.18,.68,deep)+fresnel*.12;
      }`);
  };
  logAdvancedWaterShader(material);logUnderwaterSurface(material);
  material.customProgramCacheKey=()=> 'log-water-quality-v3';return material;
}
