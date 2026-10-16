const fs=require('node:fs'),http=require('node:http'),{chromium}=require('playwright');
const root=require('node:path').resolve(__dirname,'..');
const {patchBundle}=require(root+'/scripts/build.cjs');
const source=patchBundle(fs.readFileSync(root+'/vendor/game.bundle.js','utf8'));
const core=source.slice(0,source.indexOf('/* LOCAL_VANILLA_MATERIAL_PACK */'));
const helper=source.slice(source.indexOf('\nfunction logMarkAttribute',source.indexOf('/* LOCAL_VANILLA_MATERIAL_PACK */')));
const fixture=`
const canvasRenderer=createWebGL2Renderer(undefined,{antialias:true});
canvasRenderer.setSize(960,640);canvasRenderer.shadowMap.enabled=true;canvasRenderer.shadowMap.type=PCFSoftShadowMap;canvasRenderer.outputColorSpace=SRGBColorSpace;
document.body.appendChild(canvasRenderer.domElement);
const data=new Uint8Array(16*16*4*2);
for(let layer=0;layer<2;layer++)for(let y=0;y<16;y++)for(let x=0;x<16;x++){const i=(layer*256+y*16+x)*4,bright=(x+y)%2===0;data[i]=layer?70:bright?165:110;data[i+1]=layer?150:bright?130:85;data[i+2]=layer?55:bright?85:50;data[i+3]=layer&&((x%4<2)&&(y%4<2))?0:255;}
textureArray=new DataArrayTexture(data,16,16,2);textureArray.magFilter=NearestFilter;textureArray.minFilter=getMinFilterForMode('linear');textureArray.generateMipmaps=true;textureArray.colorSpace=SRGBColorSpace;textureArray.needsUpdate=true;
const layers=new Float32Array(256*256*4);layers[4]=1;layerIndexTexture=new DataTexture(layers,256,256,RGBAFormat,FloatType);layerIndexTexture.minFilter=NearestFilter;layerIndexTexture.magFilter=NearestFilter;layerIndexTexture.needsUpdate=true;
const scene=new Scene();scene.background=new Color(0x93bad4);const camera=new PerspectiveCamera(55,1.5,.1,500);camera.position.set(7,5,9);camera.lookAt(0,0,0);
const sun=new DirectionalLight(0xffffff,2);sun.position.set(8,12,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=80;sun.shadow.camera.bottom=-80;sun.shadow.camera.far=500;sun.shadow.bias=-.0001;sun.shadow.normalBias=.02;scene.add(sun,sun.target,new AmbientLight(0xffffff,.7));
function face(material,x,y,z,sx,sy,rot,layer){const geometry=new PlaneGeometry(1,1);geometry.setAttribute('textureIndex',new InstancedBufferAttribute(new Float32Array([layer]),1));geometry.setAttribute('instanceScale',new InstancedBufferAttribute(new Float32Array([sx,sy]),2));geometry.rotateX(rot);const mesh=new InstancedMesh(geometry,material,1);const matrix=new Matrix4();matrix.compose(new Vector3(x,y,z),new Quaternion(),rot?new Vector3(sx,1,sy):new Vector3(sx,sy,1));mesh.setMatrixAt(0,matrix);mesh.castShadow=true;mesh.receiveShadow=true;mesh.customDepthMaterial=createDepthArrayTextureMaterial();scene.add(mesh);return mesh;}
face(createArrayTextureMaterial(),0,0,0,30,30,-Math.PI/2,0);
face(createTransparentArrayTextureMaterial(),0,2,0,4,4,0,1);
const waterMesh=face(createWaterArrayTextureMaterial(),4,.05,0,3,3,-Math.PI/2,0);
const box=new BoxGeometry(1,1,1);for(const name of ['Right','Left','Top','Bottom','Front','Back'])box.setAttribute('textureIndex'+name,new InstancedBufferAttribute(new Float32Array([0]),1));for(const name of ['flipFrontUV','flipBackUV','doorOrientation'])box.setAttribute(name,new InstancedBufferAttribute(new Float32Array([0]),1));const shared=new InstancedMesh(box,createSharedMeshArrayTextureMaterial(),1);shared.setMatrixAt(0,new Matrix4().makeTranslation(-3,.5,1));shared.castShadow=true;shared.customDepthMaterial=createSharedMeshDepthArrayTextureMaterial();scene.add(shared);
const failures=[];canvasRenderer.debug.onShaderError=(gl,program,vertex,fragment)=>failures.push({program:gl.getProgramInfoLog(program),vertex:gl.getShaderInfoLog(vertex),fragment:gl.getShaderInfoLog(fragment)});
const stabilize=logCreateStableShadow(sun,camera);stabilize();
const pipeline=logCreateQualityPipeline(canvasRenderer,scene,camera,{getWaterContainers:()=>[[{mesh:waterMesh}]]});
for(const ao of [false,true])for(const water of [false,true]){logQualitySettings.value={ao,water,sky:true};pipeline.render();}
canvasRenderer.setSize(960,640);pipeline.render();
window.result={failures,glError:canvasRenderer.getContext().getError(),antialias:canvasRenderer.getContext().getContextAttributes().antialias,programs:canvasRenderer.info.programs.length};window.pipeline=pipeline;window.renderQuality=()=>pipeline.render();window.settings=logQualitySettings();
const readPixels=()=>{const gl=canvasRenderer.getContext(),pixels=new Uint8Array(960*640*4);gl.readPixels(0,0,960,640,gl.RGBA,gl.UNSIGNED_BYTE,pixels);return pixels};
logQualitySettings.value={ao:false,water:false,sky:true};pipeline.render();const plain=readPixels();
logQualitySettings.value.ao=true;pipeline.render();const ao=readPixels();
let changed=0,skyError=0;for(let i=0;i<plain.length;i+=4){if(Math.abs(plain[i]-ao[i])>2)changed++;if(i>960*600*4)skyError=Math.max(skyError,Math.abs(plain[i]-ao[i]));}
if(changed<10||skyError>2)throw Error('AO comparison failed: '+JSON.stringify({changed,skyError}));
logQualitySettings.value.water=true;pipeline.render();const wet=readPixels();let waterChanged=0;for(let i=0;i<wet.length;i+=4)if(Math.abs(wet[i]-ao[i])>2)waterChanged++;
if(waterChanged<10)throw Error('Water toggle has no visible effect');
const presets=JSON.stringify(WEATHER_CONFIGS),skyScene=new Scene(),day=new DayNightCycle();day.init(skyScene);day.setCamera(camera);day.setPaused(true);
const weather=new WeatherSystem();weather.init(skyScene,{...day.getLights(),skyboxMaterial:day.getSkyboxMaterial(),camera});
const environment=logCreateEnvironment(day,weather,()=>{});const lighting=[];let qualityFrame=0;
for(const time of [.2,.5,.75])for(const weatherId of ['sunny','rain']){day.setTime(time);weather.currentWeatherId=weatherId;weather.currentConfig=logCloneWeather(WEATHER_CONFIGS[weatherId]);environment.begin(++qualityFrame);environment.render();const intensity=day.directionalLight.intensity;environment.render();if(day.directionalLight.intensity!==intensity)throw Error('Lighting compounds between passes');canvasRenderer.render(skyScene,camera);lighting.push({time,weatherId,intensity,ambient:day.ambientLight.intensity});}
if(JSON.stringify(WEATHER_CONFIGS)!==presets)throw Error('Weather preset mutated');
if(lighting[0].intensity<=lighting[4].intensity||lighting[0].intensity<=lighting[1].intensity)throw Error('Day/night/weather not composed');
// Exercise the actual sky at its pole, with animated clouds and translated origins.
const skyUniforms=day.getSkyboxMaterial().uniforms;skyUniforms.uCloudEnabled.value=1;skyUniforms.uCloudDensity.value=.7;skyUniforms.uCloudSpeed.value=.5;skyUniforms.uTime.value=7;skyUniforms.uSunIntensity.value=.8;skyUniforms.uMoonIntensity.value=0;skyUniforms.uStarOpacity.value=0;skyUniforms.uAuroraEnabled.value=0;
camera.position.set(0,0,0);camera.lookAt(.001,1,.001);day.updateSkyboxPosition(camera.position);canvasRenderer.render(skyScene,camera);const polePixels=readPixels();
camera.position.set(4096,180,-4096);camera.lookAt(4096.001,181,-4095.999);day.updateSkyboxPosition(camera.position);canvasRenderer.render(skyScene,camera);const movedPixels=readPixels();
let translationError=0;for(let i=0;i<polePixels.length;i++)translationError+=Math.abs(polePixels[i]-movedPixels[i]);translationError/=polePixels.length;
if(translationError>1)throw Error('Sky depends on world origin: '+translationError);
window.skyPreview=canvasRenderer.domElement.toDataURL();window.result.skyTranslationError=translationError;
camera.position.set(7,5,9);camera.lookAt(0,0,0);
// New lighting must not compound, preserve night/day separation, or leave cloud mode enabled on exit.
logAdvancedSettings.value={enabled:true,preset:'balanced',bloom:false};
weather.currentConfig=logCloneWeather(WEATHER_CONFIGS.sunny);weather.currentWeatherId='sunny';
day.setTime(.2);environment.begin(++qualityFrame);environment.render();const daylightPower=day.directionalLight.intensity;
environment.begin(++qualityFrame);environment.render();if(Math.abs(daylightPower-day.directionalLight.intensity)>1e-8)throw Error('Advanced lighting compounds');
if(day.hemisphereLight.intensity<.6)throw Error('Missing daytime sky fill');
canvasRenderer.render(skyScene,camera);
day.setTime(.75);environment.begin(++qualityFrame);environment.render();if(day.directionalLight.intensity>=daylightPower)throw Error('Night overlit');
logAdvancedSettings.value.enabled=false;logQualitySettings.value.sky=false;environment.begin(++qualityFrame);environment.render();
if(day.skyboxMaterial.uniforms.logAdvancedSky.value!==0)throw Error('Advanced cloud mode persists when disabled');logQualitySettings.value.sky=true;
weather.dispose();day.dispose();
canvasRenderer.shadowMap.enabled=false;pipeline.render();canvasRenderer.shadowMap.enabled=true;
canvasRenderer.setSize(480,320);pipeline.render();canvasRenderer.setSize(960,640);pipeline.render();
Object.assign(window.result,{changed,waterChanged,skyError,lighting,glError:canvasRenderer.getContext().getError()});

const ordinarySettings=JSON.stringify(logQualitySettings());logAdvancedSettings.value={enabled:false,preset:'balanced',bloom:true};pipeline.render();const beforeAdvanced=readPixels();window.beforeAdvanced=canvasRenderer.domElement.toDataURL();const baseMemory={...canvasRenderer.info.memory};const baseShadow=canvasRenderer.shadowMap.type;
let advancedPixels;
for(let cycle=0;cycle<3;cycle++){
 logAdvancedSettings.value.enabled=true;logAdvancedSettings.value.preset=cycle%2?'high':'balanced';pipeline.render();
 if(logAdvancedSettings.error)throw Error('Advanced fallback: '+logAdvancedSettings.error);
 advancedPixels=readPixels();
 if(cycle===0)window.advancedPreview=canvasRenderer.domElement.toDataURL();
 logAdvancedSettings.value.enabled=false;pipeline.render();
 if(canvasRenderer.shadowMap.type!==baseShadow)throw Error('Shadow settings not restored');
 if(canvasRenderer.info.memory.textures>baseMemory.textures||canvasRenderer.info.memory.geometries>baseMemory.geometries)throw Error('Advanced resources leaked');
}
pipeline.render();window.afterAdvanced=canvasRenderer.domElement.toDataURL();const afterAdvanced=readPixels();let restoredError=0,restoredMean=0,advancedChanged=0;
for(let i=0;i<afterAdvanced.length;i++){restoredMean+=Math.abs(afterAdvanced[i]-beforeAdvanced[i]);restoredError=Math.max(restoredError,Math.abs(afterAdvanced[i]-beforeAdvanced[i]));if(Math.abs(advancedPixels[i]-beforeAdvanced[i])>2)advancedChanged++;}
restoredMean/=afterAdvanced.length;
if(restoredError!==0||advancedChanged<100)throw Error('Advanced comparison failed: '+JSON.stringify({restoredError,restoredMean,advancedChanged}));
if(JSON.stringify(logQualitySettings())!==ordinarySettings)throw Error('Ordinary preferences overwritten');
Object.assign(window.result,{restoredError,restoredMean,advancedChanged,programs:canvasRenderer.info.programs.length,glError:canvasRenderer.getContext().getError()});
// Already-lit refraction must remain visible without any scene light.
const testGround=new Mesh(new PlaneGeometry(12,12),new MeshBasicMaterial({color:0x55bbdd}));testGround.rotation.x=-Math.PI/2;testGround.position.set(4,.01,0);scene.add(testGround);
const sceneLights=[];scene.traverse(o=>{if(o.isLight){sceneLights.push([o,o.intensity]);o.intensity=0}});
logAdvancedSettings.value={enabled:true,preset:'balanced',bloom:false};pipeline.render();const waterProbe=new Vector3(4,.05,0).project(camera),probe=new Uint8Array(4),contextGL=canvasRenderer.getContext();contextGL.readPixels(Math.floor((waterProbe.x*.5+.5)*960),Math.floor((waterProbe.y*.5+.5)*640),1,1,contextGL.RGBA,contextGL.UNSIGNED_BYTE,probe);
if(probe[1]<40||probe[2]<40)throw Error('Unlit water transmission was darkened: '+Array.from(probe));window.result.unlitWater=Array.from(probe);
for(const [light,intensity]of sceneLights)light.intensity=intensity;scene.remove(testGround);testGround.geometry.dispose();testGround.material.dispose();logAdvancedSettings.value.enabled=false;pipeline.render();
// Actual underside view: ordinary settings may all be off, but being immersed
// must still have distance absorption. Leaving water must restore the air image.
camera.position.set(4,1.2,5);camera.lookAt(4,1,-2);
waterMesh.setMatrixAt(0,new Matrix4().compose(new Vector3(4,2.5,0),new Quaternion(),new Vector3(14,1,14)));waterMesh.instanceMatrix.needsUpdate=true;
let underwaterTime=0;const settleWater=wet=>{for(let i=0;i<60;i++){underwaterTime+=1000/60;pipeline.setUnderwater(wet,underwaterTime)}};
const underwaterChanges=[];
for(const enabled of [false,true]){
 logAdvancedSettings.value={enabled,preset:'balanced',bloom:false};logQualitySettings.value={ao:false,water:false,sky:true};
 settleWater(false);pipeline.render();const airPixels=readPixels();
 settleWater(true);pipeline.render();const underwaterPixels=readPixels();let difference=0;
 for(let i=0;i<airPixels.length;i+=4)if(Math.abs(airPixels[i]-underwaterPixels[i])+Math.abs(airPixels[i+2]-underwaterPixels[i+2])>8)difference++;
 if(difference<1000)throw Error('Underwater absorption missing, advanced='+enabled);underwaterChanges.push(difference);
 if(enabled)window.underwaterPreview=canvasRenderer.domElement.toDataURL();
 settleWater(false);pipeline.render();const exitPixels=readPixels();
 if(!enabled){let error=0;for(let i=0;i<exitPixels.length;i++)error=Math.max(error,Math.abs(exitPixels[i]-airPixels[i]));if(error)throw Error('Underwater effect persisted above water: '+error)}
 if(logAdvancedSettings.error)throw Error('Underwater shader fallback: '+logAdvancedSettings.error);
}
Object.assign(window.result,{underwaterChanges,glError:canvasRenderer.getContext().getError(),programs:canvasRenderer.info.programs.length});
// Unsupported HDR must return to the ordinary path without losing preferences.
pipeline.dispose();const savedHas=canvasRenderer.extensions.has;canvasRenderer.extensions.has=()=>false;
const fallbackPipeline=logCreateQualityPipeline(canvasRenderer,scene,camera,{getWaterContainers:()=>[]});
logQualitySettings.value={ao:false,water:false,sky:true};logAdvancedSettings.value.enabled=true;fallbackPipeline.render();
if(!logAdvancedSettings.error||logAdvancedActive())throw Error('Missing capability fallback');
fallbackPipeline.dispose();canvasRenderer.extensions.has=savedHas;logAdvancedSettings.value.enabled=false;logAdvancedSettings.error='';
window.result.capabilityFallback=true;
window.disposeQuality=()=>{pipeline.dispose();pipeline.dispose();};
`;
(async()=>{const server=http.createServer((req,res)=>{if(req.url==='/fixture.js'){res.setHeader('Content-Type','text/javascript');res.end(core+'\n'+helper+'\n'+fixture);}else{res.setHeader('Content-Type','text/html');res.end('<style>body{margin:0}</style><script type="module" src="/fixture.js"></script>');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.env.QUALITY_BROWSER||'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',headless:true});try{const page=await browser.newPage({viewport:{width:960,height:640}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.result,{timeout:20000}).catch(()=>{});console.log(JSON.stringify({errors,result:await page.evaluate(()=>window.result)},null,2));if(process.env.ADVANCED_SCREENSHOT){const preview=await page.evaluate(()=>window.advancedPreview);if(preview)fs.writeFileSync(process.env.ADVANCED_SCREENSHOT,Buffer.from(preview.split(',')[1],'base64'));}if(process.env.SKY_SCREENSHOT){const preview=await page.evaluate(()=>window.skyPreview);if(preview)fs.writeFileSync(process.env.SKY_SCREENSHOT,Buffer.from(preview.split(',')[1],'base64'));}if(process.env.UNDERWATER_SCREENSHOT){const preview=await page.evaluate(()=>window.underwaterPreview);if(preview)fs.writeFileSync(process.env.UNDERWATER_SCREENSHOT,Buffer.from(preview.split(',')[1],'base64'));}if(process.env.QUALITY_SCREENSHOT)await page.screenshot({path:process.env.QUALITY_SCREENSHOT});await page.evaluate(()=>window.disposeQuality?.());if(errors.length||!(await page.evaluate(()=>window.result&&!window.result.failures.length&&window.result.glError===0)))process.exitCode=1;}finally{await browser.close();server.close();}})();
