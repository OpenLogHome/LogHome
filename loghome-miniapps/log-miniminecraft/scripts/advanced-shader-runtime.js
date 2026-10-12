function logAdvancedSettings() {
  if(!logAdvancedSettings.value){let s={};try{s=JSON.parse(localStorage.getItem('log_minecraft_advanced_shader')||'{}')||{}}catch{}
    logAdvancedSettings.value={enabled:s.enabled===true,preset:s.preset==='high'?'high':'balanced',bloom:s.bloom!==false};}
  return logAdvancedSettings.value;
}
function logAdvancedActive(){return logAdvancedSettings().enabled&&!logAdvancedSettings.error}
function logAdvancedError(message){logAdvancedSettings.error=message;globalThis.dispatchEvent?.(new Event('log-advanced-status'))}
function LogAdvancedSettings(){
  const [value,setValue]=reactExports.useState(()=>({...logAdvancedSettings()}));const [error,setError]=reactExports.useState(()=>logAdvancedSettings.error||'');
  reactExports.useEffect(()=>{const update=()=>setError(logAdvancedSettings.error||'');window.addEventListener('log-advanced-status',update);return()=>window.removeEventListener('log-advanced-status',update)},[]);
  const change=patch=>{const next={...logAdvancedSettings(),...patch};logAdvancedSettings.value=next;logAdvancedSettings.error='';setError('');try{localStorage.setItem('log_minecraft_advanced_shader',JSON.stringify(next))}catch{}setValue(next)};
  return jsxRuntimeExports.jsxs('div',{className:'log-target-fps',children:[
    jsxRuntimeExports.jsx('div',{className:'log-target-fps-title',children:'高阶光影 · 第一版'}),
    jsxRuntimeExports.jsx('button',{className:'log-quality-toggle','aria-pressed':value.enabled,onClick:()=>change({enabled:!value.enabled}),children:value.enabled?'高阶光影：开启':'高阶光影：关闭'}),
    ...(value.enabled?[jsxRuntimeExports.jsx('button',{className:'log-quality-toggle',onClick:()=>change({preset:value.preset==='balanced'?'high':'balanced'}),children:'画质预设：'+(value.preset==='high'?'高':'均衡')}),jsxRuntimeExports.jsx('button',{className:'log-quality-toggle','aria-pressed':value.bloom,onClick:()=>change({bloom:!value.bloom}),children:'柔和泛光：'+(value.bloom?'开':'关')})]:[]),
    jsxRuntimeExports.jsx('p',{role:error?'status':undefined,children:error?'已回退普通模式：'+error:'默认关闭。开启后统一管理光照、AO 与水面；关闭后恢复普通模式偏好。高画质提高 AO 采样和阴影柔度。'})]});
}
function logAdvancedLighting(day){
  if(!logAdvancedActive())return;
  const light=day.directionalLight,ambient=day.ambientLight,hemi=day.hemisphereLight;
  light.color.lerp(new Color(0xffead1),.13);light.intensity*=1.55;
  const daylight=Math.max(0,Math.sin(day.currentTime*Math.PI*2));
  ambient.intensity=Math.max(ambient.intensity,.13+daylight*.12);
  hemi.intensity=Math.max(hemi.intensity,.25+daylight*.48);
  hemi.color.lerp(new Color(0xa9ceff),.2);
  const leaf=logAtmosphereUniforms();leaf.logLeafSun.value.subVectors(light.position,light.target.position).normalize();leaf.logLeafLight.value.copy(light.color).multiplyScalar(Math.min(light.intensity,1.8));
  logAdvancedLighting.hand={color:light.color.clone(),intensity:light.intensity,ambient:ambient.intensity+hemi.intensity*.45};
}
function logAdvancedHand(hand){
  if(!hand.logOriginalLighting)hand.logOriginalLighting={tone:hand.renderer.toneMapping,exposure:hand.renderer.toneMappingExposure,color:hand.light.color.clone(),intensity:hand.light.intensity,ambient:hand.ambientLight.intensity};
  const original=hand.logOriginalLighting,active=logAdvancedActive(),light=logAdvancedLighting.hand;
  hand.renderer.toneMapping=active?ACESFilmicToneMapping:original.tone;hand.renderer.toneMappingExposure=active?1.1:original.exposure;
  hand.light.color.copy(active&&light?light.color:original.color);hand.light.intensity=active&&light?Math.max(.2,light.intensity):original.intensity;hand.ambientLight.intensity=active&&light?Math.max(.18,light.ambient):original.ambient;
}
function logAdvancedCapability(renderer){
  if(!renderer.extensions.has('EXT_color_buffer_float'))return '设备不支持 HDR 浮点渲染目标';
  const target=new WebGLRenderTarget(4,4,{type:HalfFloatType,depthBuffer:true});const previous=renderer.getRenderTarget();
  try{renderer.setRenderTarget(target);const gl=renderer.getContext();if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)return 'HDR 渲染目标不可用';return ''}finally{renderer.setRenderTarget(previous);target.dispose()}
}
function logAdvancedPostFragment(source){
  source='uniform float logAdvanced;uniform float logSamples;uniform sampler2D logBloom;uniform float logBloomStrength;\n'+source;
  source=source.replace('void main(){',`vec3 logNormal(vec2 uv,vec3 p){
    vec2 pixel=1./resolution;
    vec3 l=p-viewPosition(uv-vec2(pixel.x,0.),texture2D(depthMap,uv-vec2(pixel.x,0.)).r);
    vec3 r=viewPosition(uv+vec2(pixel.x,0.),texture2D(depthMap,uv+vec2(pixel.x,0.)).r)-p;
    vec3 b=p-viewPosition(uv-vec2(0.,pixel.y),texture2D(depthMap,uv-vec2(0.,pixel.y)).r);
    vec3 t=viewPosition(uv+vec2(0.,pixel.y),texture2D(depthMap,uv+vec2(0.,pixel.y)).r)-p;
    vec3 n=cross(abs(l.z)<abs(r.z)?l:r,abs(b.z)<abs(t.z)?b:t);return n/max(length(n),.00001);
  }
  void main(){`);
  source=source.replace('if(normal.z<0.)normal=-normal;', 'if(logAdvanced>.5)normal=logNormal(screenUv,p);if(normal.z<0.)normal=-normal;');
  source=source.replace('for(int i=0;i<8;i++){float angle=float(i)*.785398163;', 'for(int i=0;i<24;i++){if(float(i)>=(logAdvanced>.5?logSamples:8.))break;float angle=logAdvanced>.5?float(i)*2.399963:float(i)*.785398163;');
  source=source.replace('*radius/resolution;', '*radius/resolution*(logAdvanced>.5?sqrt((float(i)+.5)/logSamples):1.);');
  source=source.replace('occ*.12','occ*(logAdvanced>.5?.96/logSamples:.12)');
  source=source.replace('}gl_FragColor=color;', '}if(logAdvanced>.5&&logBloomStrength>0.)color.rgb+=texture2D(logBloom,screenUv).rgb*logBloomStrength;gl_FragColor=color;');
  return source;
}
function logCreateAdvancedResources(renderer,scene,camera){
  const create=()=>new WebGLRenderTarget(1,1,{type:HalfFloatType,depthBuffer:false,minFilter:LinearFilter,magFilter:LinearFilter});
  const a=create(),b=create(),processed=create(),leafMask=logCreateLeafMask();
  const uniforms={image:{value:null},stepUv:{value:new Vector2()},extract:{value:1}};
  const material=new ShaderMaterial({depthTest:false,depthWrite:false,toneMapped:false,uniforms,vertexShader:'varying vec2 uvScreen;void main(){uvScreen=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`varying vec2 uvScreen;uniform sampler2D image;uniform vec2 stepUv;uniform float extract;
  vec3 sampleBright(vec2 uv){vec3 c=texture2D(image,uv).rgb;float luminance=max(c.r,max(c.g,c.b));return extract>.5?c*smoothstep(.85,1.8,luminance):c;}
  void main(){vec3 c=sampleBright(uvScreen)*.227027;for(int i=1;i<5;i++){float w=i==1?.1945946:i==2?.1216216:i==3?.054054:.016216;c+=(sampleBright(uvScreen+stepUv*float(i))+sampleBright(uvScreen-stepUv*float(i)))*w;}gl_FragColor=vec4(c,1.);}`});
  const pass=new Scene(),view=new OrthographicCamera(-1,1,1,-1,0,1),quad=new Mesh(new PlaneGeometry(2,2),material);pass.add(quad);
  const invalidate=()=>scene.traverse(object=>{if(object.material)for(const m of (Array.isArray(object.material)?object.material:[object.material]))m.needsUpdate=true});
  const shadows=[];scene.traverse(object=>{if(object.isDirectionalLight)shadows.push([object.shadow,object.shadow.radius])});
  const oldType=renderer.shadowMap.type;
  let disposed=false;
  return {processed(width,height){if(processed.width!==width||processed.height!==height)processed.setSize(width,height);return processed},prepare(){renderer.compile(pass,view);renderer.compile(scene,camera)},shadows(){leafMask.update();logPrepareAtmosphereMaterials(scene);if(renderer.shadowMap.type!==PCFShadowMap){renderer.shadowMap.type=PCFShadowMap;invalidate()}for(const [shadow]of shadows)shadow.radius=logAdvancedSettings().preset==='high'?3:1.6},
    bloom(texture,width,height){const w=Math.max(1,Math.ceil(width/2)),h=Math.max(1,Math.ceil(height/2));if(a.width!==w||a.height!==h){a.setSize(w,h);b.setSize(w,h)}uniforms.image.value=texture;uniforms.extract.value=1;uniforms.stepUv.value.set(1/w,0);renderer.setRenderTarget(a);renderer.render(pass,view);uniforms.image.value=a.texture;uniforms.extract.value=0;uniforms.stepUv.value.set(0,1/h);renderer.setRenderTarget(b);renderer.render(pass,view);return b.texture},
    dispose(){if(disposed)return;disposed=true;a.dispose();b.dispose();processed.dispose();leafMask.dispose();material.dispose();quad.geometry.dispose();renderer.shadowMap.type=oldType;invalidate();for(const [shadow,radius]of shadows)shadow.radius=radius}}
}
function logAdvancedWaterShader(material){
  const compile=material.onBeforeCompile;
  material.onBeforeCompile=shader=>{
    compile(shader);
    shader.fragmentShader='uniform float logAdvancedWater;uniform float logWaterTime;uniform sampler2D logOpaqueColor;\n'+logWaterWaveShader()+'\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('// 反射采样',`vec3 logWaveNormal=normalize(vWorldNormal);
      if(logAdvancedWater>.5){logWaveNormal=normalize(logWaveNormal+vec3(logWaveSlope.x,0.,logWaveSlope.y));}
      // 反射采样`)
      .replace('vec4 reflectionColor = textureProj(reflectionTexture, reflectionUv.xyw);',`if(logAdvancedWater>.5)reflectionUv.xy+=logWaveSlope*.005*reflectionUv.w;
        vec4 reflectionColor = textureProj(reflectionTexture, reflectionUv.xyw);`)
      .replace('normalize(vWorldNormal)))','logWaveNormal))')
      .replace('float deep=1.-exp(-thickness*.32);',`float deep=1.-exp(-thickness*.32);
        if(logAdvancedWater>.5){
          vec2 screenUv=gl_FragCoord.xy/logResolution;
          vec2 refractedUv=clamp(screenUv+logWaveSlope*.008*min(thickness,2.),vec2(.001),vec2(.999));
          float refractedDepth=texture2D(logOpaqueDepth,refractedUv).r;
          if(refractedDepth<gl_FragCoord.z)refractedUv=screenUv;
          vec3 transmitted=texture2D(logOpaqueColor,refractedUv).rgb*exp(-vec3(.18,.055,.025)*min(thickness,30.));
          diffuseColor.rgb=mix(transmitted,mirrorReflection,clamp(.04+.8*fresnel,0.,.9));
        }`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`#ifdef USE_MAP
    if(logAdvancedWater>.5){
      vec3 transmission=exp(-vec3(.18,.055,.025)*min(thickness,30.));
      vec3 waterScatter=vec3(.035,.13,.16)*(vec3(1.)-transmission);
      vec3 waterRadiance=mix(transmitted+waterScatter,mirrorReflection,clamp(.04+.9*fresnel,0.,.94));
      outgoingLight=waterRadiance+reflectedLight.directSpecular;diffuseColor.a=1.;
    }
    #endif
    #include <opaque_fragment>`);
    // These values must survive the map-fragment scope for final radiance composition.
    shader.fragmentShader=shader.fragmentShader.replace('float thickness=max(0.,groundDistance-surfaceDistance);','thickness=max(0.,groundDistance-surfaceDistance);').replace('vec3 transmitted=texture2D','transmitted=texture2D');
    shader.fragmentShader=shader.fragmentShader.replace('void main() {','void main() {float thickness=0.;vec3 transmitted=vec3(0.);vec2 logWaveSlope=vec2(0.);if(logAdvancedWater>.5)logWaveSlope=logWaterSlope(vWorldPosition.xz,logWaterTime);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <fog_fragment>',`if(logAdvancedWater<.5){
      #include <fog_fragment>
    }`);
    // Perturb the lighting normal too, without moving geometry or collision surfaces.
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      if(logAdvancedWater>.5){vec3 wave=vec3(logWaveSlope.x,0.,logWaveSlope.y);normal=normalize(normal+mat3(viewMatrix)*wave);}`);
  };
}

// Analytic noise gradients avoid axis-aligned sine bands; fade frequencies smaller
// than a pixel before using the same slope for lighting, reflection and refraction.
function logWaterWaveShader(){return `
  vec2 logNoiseGradient(vec2 p){
    vec2 cell=floor(p),f=fract(p),u=f*f*(3.-2.*f),du=6.*f*(1.-f);
    vec4 h=fract(sin(vec4(dot(cell,vec2(127.1,311.7)),dot(cell+vec2(1,0),vec2(127.1,311.7)),dot(cell+vec2(0,1),vec2(127.1,311.7)),dot(cell+vec2(1,1),vec2(127.1,311.7))))*43758.5453);
    float mixed=h.x-h.y-h.z+h.w;
    return du*vec2(h.y-h.x+mixed*u.y,h.z-h.x+mixed*u.x);
  }
  vec2 logWaterSlope(vec2 world,float time){
    mat2 rotation=mat2(.8,.6,-.6,.8),inverseRotation=mat2(.8,-.6,.6,.8);
    vec2 p=rotation*world*.47;
    float footprint=max(length(dFdx(p)),length(dFdy(p)));
    float broad=1.-smoothstep(.3,1.2,footprint);
    float detail=1.-smoothstep(.3,1.2,footprint*2.13);
    vec2 slope=logNoiseGradient(p+vec2(time*.12,time*.073))*.035*broad;
    slope+=logNoiseGradient(p*2.13+vec2(-time*.091,time*.14)+vec2(19.7,7.3))*.014*detail;
    return inverseRotation*slope;
  }
`;}
