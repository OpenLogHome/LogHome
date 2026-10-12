const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const advancedRuntime=fs.readFileSync(path.join(__dirname,'../scripts/advanced-shader-runtime.js'),'utf8');
const atmosphereRuntime=fs.readFileSync(path.join(__dirname,'../scripts/atmosphere-runtime.js'),'utf8');
const runtime=atmosphereRuntime+'\n'+advancedRuntime+'\n'+fs.readFileSync(path.join(__dirname,'../scripts/quality-effects-runtime.js'),'utf8');
function context(storage){const ctx={localStorage:storage};vm.createContext(ctx);vm.runInContext(runtime,ctx);return ctx}
test('fair-weather fog preserves midground contrast and the loaded-world boundary',()=>{
  const c=context(),clear=c.logFogProfile(80,240,.001),storm=c.logFogProfile(80,240,.004);
  assert.equal(clear.near,192);assert.equal(clear.far,240);
  assert.ok(1-Math.exp(-(120-48)*clear.density)<.05);
  assert.equal(storm.near,80);assert.equal(storm.far,240);
  assert.ok(storm.density>clear.density);
  const short=c.logFogProfile(100,80);assert.ok(short.near<short.far);
});
test('quality switches default on, retain independent preferences and tolerate broken storage',()=>{
  for(const value of ['bad','null','{}']){const c=context({getItem:()=>value});assert.equal(JSON.stringify(c.logQualitySettings()),'{"ao":true,"sky":true,"water":true}');}
  const c=context({getItem:()=>'{"ao":false,"water":false}'});assert.equal(c.logQualitySettings().sky,true);assert.equal(c.logQualitySettings().ao,false);assert.equal(c.logQualitySettings().water,false);
  assert.equal(context({getItem(){throw Error('denied')}}).logQualitySettings().water,true);
});
test('weather transition copies own color values instead of mutating shared presets',()=>{
  class Color{constructor(v){this.value=v;this.isColor=true}clone(){return new Color(this.value)}}
  const c=context(),source={sky:new Color(4),sunIntensity:1};const copy=c.logCloneWeather(source);copy.sky.value=9;assert.equal(source.sky.value,4);assert.equal(copy.sunIntensity,1);
});
test('environment runs once per frame, restores time callback and updates paused sky position',()=>{
  const c=context();c.logQualitySettings.value={sky:false};let ticks=0,weatherTicks=0,shadows=0,positions=0,applied=0;
  const callback=()=>{};const day={onTimeChange:callback,onBeforeRenderCallback(){ticks++},camera:{position:{}},updateSkyboxPosition(){positions++},applyCurrentState(){assert.equal(this.onTimeChange,null)}};
  const weather={scene:{onBeforeRender(){weatherTicks++}},currentConfig:{},applyConfig(){applied++}};
  const env=c.logCreateEnvironment(day,weather,()=>shadows++);env.begin(1);env.render();env.render();assert.equal(ticks,1);assert.equal(weatherTicks,1);assert.equal(shadows,1);assert.equal(positions,1);assert.equal(applied,1);assert.equal(day.onTimeChange,callback);env.begin(2);env.render();assert.equal(ticks,2);
});
test('built renderer initializes the manager before the quality pipeline and animation loop',()=>{
  const {patchBundle}=require('../scripts/build.cjs');
  const source=patchBundle(fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8'));
  const start=source.indexOf('function VoxelWorldRenderer(');
  const end=source.indexOf('const Fo=ve=>',start);
  assert.ok(start>=0&&end>start);
  // Execute the real declarations in their emitted order: the old insertion
  // throws a TDZ ReferenceError here even though isolated shader tests pass.
  const setup=source.slice(start,end);
  const declarations=setup.match(/const Wt=new RenderManager\(fn\);|const logQuality=logCreateQualityPipeline\(ln,fn,qe,Wt\);/g);
  assert.equal(declarations?.length,2);
  let created=0;
  class Manager{constructor(scene){this.scene=scene}}
  const scene={};
  vm.runInNewContext(declarations.join('\n'),{fn:scene,ln:{},qe:{},RenderManager:Manager,logCreateQualityPipeline(renderer,actualScene,camera,manager){assert.ok(manager instanceof Manager);assert.equal(manager.scene,actualScene);created++;return {}}});
  assert.equal(created,1);
  assert.ok(source.indexOf('logQuality.render();',end)>end);
});
test('advanced mode is opt-in and validates stored presets without changing ordinary settings',()=>{
  for(const value of ['{}','bad','null','{"enabled":"true"}']){const c=context({getItem:()=>value});assert.equal(c.logAdvancedSettings().enabled,false);assert.equal(c.logAdvancedSettings().preset,'balanced');}
  const c=context({getItem:key=>key==='log_minecraft_advanced_shader'?'{"enabled":true,"preset":"high","bloom":false}':'{"ao":false}'});
  assert.equal(c.logAdvancedActive(),true);assert.equal(c.logAdvancedSettings().bloom,false);assert.equal(c.logQualitySettings().ao,false);c.logAdvancedSettings.error='unsupported';assert.equal(c.logAdvancedActive(),false);assert.equal(c.logQualitySettings().ao,false);
});
test('advanced capability failure avoids allocating unsupported render targets',()=>{
  const c=context();assert.match(c.logAdvancedCapability({extensions:{has:()=>false}}),/HDR/);
});
test('leaf mask excludes glass and shared textures, refreshes after atlas replacement and releases',()=>{
  const c=context();let disposed=0,atlas={};
  Object.assign(c,{FloatType:1,RGBAFormat:2,NearestFilter:3,LAYER_INDEX_TEXTURE_SIZE:8,layerIndexTexture:atlas,
    DataTexture:class{constructor(data){this.image={data}}dispose(){disposed++}},
    getAllBlockDefinitions:()=>[{id:'oak_leaves',leaves:true},{id:'glass'}],
    getTextureIndexMap:()=>new Map([['oak_leaves_0_0',1],['oak_leaves_1_0',2],['glass_0_0',2],['glass_1_0',3]])});
  c.logAtmosphereUniforms.value={logLeafMask:{value:null}};
  const mask=c.logCreateLeafMask();mask.update();const texture=c.logAtmosphereUniforms.value.logLeafMask.value;
  assert.equal(texture.image.data[4],1);assert.equal(texture.image.data[8],0);assert.equal(texture.image.data[12],0);
  c.layerIndexTexture={};c.getTextureIndexMap=()=>new Map([['oak_leaves_0_0',4]]);mask.update();assert.equal(texture.image.data[4],0);assert.equal(texture.image.data[16],1);
  mask.dispose();assert.equal(disposed,1);assert.equal(c.logAtmosphereUniforms.value.logLeafMask.value,null);
});
