const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {patchBundle}=require('../scripts/build.cjs');
const {logCreateStableShadow}=require('../scripts/visual-quality.cjs');
const original=fs.readFileSync(require('node:path').join(__dirname,'../vendor/game.bundle.js'),'utf8');
const patched=patchBundle(original);
// Use the exact bundled vector implementation for light-space math checks.
const start=original.indexOf('class Vector3{');let end=original.indexOf('{',start),depth=0;
for(;end<original.length;end++){if(original[end]==='{')depth++;if(original[end]==='}'&&--depth===0)break;}
const context={};vm.runInNewContext(original.slice(start,end+1)+';this.Vector=Vector3',context);
const Vector=context.Vector;
function fixture(){
  const light={castShadow:true,position:new Vector(100,200,50),target:{position:new Vector(),updateMatrixWorld(){}},updateMatrixWorld(){},shadow:{mapSize:{width:2048,height:2048},camera:{left:-80,right:80,top:80,bottom:-80}}};
  const camera={position:new Vector()};
  const update=vm.runInNewContext('('+logCreateStableShadow.toString()+')',{Vector3:Vector})(light,camera);
  return {light,camera,update};
}
test('shadow focus stays on a texel grid without changing light direction or moving camera',()=>{
  const {light,camera,update}=fixture();const offset=light.position.clone();
  update();camera.position.set(.001,0,0);update();
  assert.ok(light.target.position.length()<1e-8);
  camera.position.set(1000,180,-1000);const view=camera.position.clone();update();
  assert.ok(camera.position.distanceTo(view)<1e-8);
  assert.ok(light.position.clone().sub(light.target.position).distanceTo(offset)<1e-8);
  assert.ok(light.target.position.distanceTo(view)<.1);
  const target=light.target.position.clone();update();assert.ok(light.target.position.distanceTo(target)<1e-8);
});
test('vertical sun and disabled shadows remain finite and stable',()=>{
  const {light,camera,update}=fixture();light.position.set(0,200,0);camera.position.set(25,320,-17);update();
  assert.ok(light.position.toArray().every(Number.isFinite));
  assert.ok(light.target.position.distanceTo(camera.position)<.1);
  light.castShadow=false;const old=light.position.clone();camera.position.set(900,900,900);update();assert.ok(light.position.distanceTo(old)<1e-8);
});
function depthFactory(name,next){
  const begin=patched.indexOf('function '+name+'('),end=patched.indexOf('function '+next+'(',begin);
  const ctx={MeshDepthMaterial:class{constructor(options){Object.assign(this,options)}},RGBADepthPacking:3201,FrontSide:0,textureArray:{},layerIndexTexture:{},LAYER_INDEX_TEXTURE_SIZE:256};
  vm.runInNewContext(patched.slice(begin,end)+';this.material='+name+'()',ctx);
  const shader={uniforms:{},vertexShader:'#include <uv_pars_vertex>\n#include <uv_vertex>',fragmentShader:'#include <map_pars_fragment>\n#include <map_fragment>\n#include <alphatest_fragment>'};
  ctx.material.onBeforeCompile(shader);return shader;
}
test('terrain and shared depth shaders use the bundled engine alpha-test contract',()=>{
  const terrain=depthFactory('createDepthArrayTextureMaterial','createSharedMeshArrayTextureMaterial');
  const shared=depthFactory('createSharedMeshDepthArrayTextureMaterial','getTextureIndexToLayerMapping');
  for(const shader of [terrain,shared]){assert.match(shader.fragmentShader,/#ifdef USE_ALPHATEST/);assert.match(shader.fragmentShader,/texColor.a < alphaTest/);assert.doesNotMatch(shader.fragmentShader,/#ifdef ALPHATEST/);}
  assert.match(terrain.fragmentShader,/textureGrad\(map, vec3\(repeatedUv, vLayerIndex\), dFdx\(scaledUv\), dFdy\(scaledUv\)\)/);
});
test('quality defaults preserve pixel magnification and texture color space',()=>{
  assert.ok(patched.includes('sRGB:!0,mipmapMode:"linear"'));
  assert.ok(patched.includes('textureArray.magFilter=NearestFilter'));
  assert.ok(patched.includes('textureArray.colorSpace=SRGBColorSpace'));
  assert.ok(patched.includes('i&&(d.customDepthMaterial=i)'));
  assert.ok(patched.includes('createWebGL2Renderer(void 0,{antialias:!0,powerPreference:"high-performance"'));
});
