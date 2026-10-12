const fs=require('node:fs'),path=require('node:path');
function patchQualityEffects(source){
  function replace(a,b){if(source.split(a).length!==2)throw Error('Quality effects boundary changed: '+a.slice(0,100));source=source.replace(a,b)}
  replace('fn.onBeforeRender=function(...args){logBeforeRender?.apply(this,args);logShadowUpdate()};','const logEnvironment=logCreateEnvironment(jt,ft,logShadowUpdate);fn.onBeforeRender=()=>logEnvironment.render();');
  // The terrain manager is declared later than the environment in this effect.
  replace('const Wt=new RenderManager(fn);ne.current=Wt;', 'const Wt=new RenderManager(fn);ne.current=Wt;const logQuality=logCreateQualityPipeline(ln,fn,qe,Wt);');
  replace('const Fo=ve=>{logFps.tick', 'const Fo=ve=>{logEnvironment.begin(ve);logFps.tick');
  replace('ln.render(fn,qe);const zn=', 'logQuality.render();const zn=');
  replace('ln.dispose(),ln.forceContextLoss()', 'logQuality.dispose(),ln.dispose(),ln.forceContextLoss()');
  replace('jsxRuntimeExports.jsx(LogTargetFpsSetting,{}),','jsxRuntimeExports.jsx(LogTargetFpsSetting,{}),jsxRuntimeExports.jsx(LogQualitySettings,{}),');
  replace('const{scene:s,camera:c,renderer:h,itemGroup:f}=n;if(!n.currentItemId)', 'logAdvancedHand(n);const{scene:s,camera:c,renderer:h,itemGroup:f}=n;if(!n.currentItemId)');
  const start=source.indexOf('function createWaterArrayTextureMaterial()'),end=source.indexOf('function updateArrayTextureWaterReflection',start);
  const water=source.slice(start,end).replace('n.shadowSide=DoubleSide,n}', 'n.shadowSide=DoubleSide,logEnhanceWater(n)}').replace('max(dot(vViewDir, vWorldNormal), 0.0)','abs(dot(normalize(vViewDir), normalize(vWorldNormal)))');
  source=source.slice(0,start)+water+source.slice(end);
  const leafStart=source.indexOf('function createTransparentArrayTextureMaterial()'),leafEnd=source.indexOf('function createWaterArrayTextureMaterial()',leafStart);
  const leafSource=source.slice(leafStart,leafEnd);
  if(leafSource.split('n.shadowSide=FrontSide,n}').length!==2)throw Error('Leaf material boundary changed');
  source=source.slice(0,leafStart)+leafSource.replace('n.shadowSide=FrontSide,n}', 'n.shadowSide=FrontSide,logEnhanceLeaves(n)}')+source.slice(leafEnd);
  // Weather color objects must not alias shared presets or accumulate mutations.
  replace('this.currentConfig={...WEATHER_CONFIGS.sunny}', 'this.currentConfig=logCloneWeather(WEATHER_CONFIGS.sunny)');
  replace('this.targetConfig={...r},this.transitionProgress=0', 'this.targetConfig=logCloneWeather(r),this.logTransitionStart=logCloneWeather(this.currentConfig),this.transitionProgress=0');
  replace('this.interpolateConfig(this.currentConfig,this.targetConfig,this.transitionProgress)', 'this.currentConfig=logCloneWeather(this.logTransitionStart),this.interpolateConfig(this.currentConfig,this.targetConfig,this.transitionProgress)');
  return require('./sky-quality.cjs').patchSkyQuality(source)+'\n'+fs.readFileSync(path.join(__dirname,'atmosphere-runtime.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'advanced-shader-runtime.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'quality-effects-runtime.js'),'utf8');
}
module.exports={patchQualityEffects};
