// Keep the existing 2048 shadow map and coverage. Snap the light-space target
// to texels without quantizing the player's camera or changing the light angle.
function logCreateStableShadow(light, camera) {
  const direction = new Vector3(), right = new Vector3(), up = new Vector3();
  const anchor = new Vector3(), worldUp = new Vector3(0, 1, 0);
  return function update() {
    if (!light.castShadow) return;
    direction.subVectors(light.position, light.target.position);
    const distance = direction.length();
    if (distance < 0.001) return;
    direction.multiplyScalar(1 / distance);
    right.crossVectors(worldUp, direction);
    if (right.lengthSq() < 0.000001) right.set(1, 0, 0);
    else right.normalize();
    up.crossVectors(direction, right).normalize();
    const shadow = light.shadow, view = shadow.camera;
    const texelX = (view.right - view.left) / shadow.mapSize.width;
    const texelY = (view.top - view.bottom) / shadow.mapSize.height;
    const focus = camera.position;
    const x = Math.round(focus.dot(right) / texelX) * texelX;
    const y = Math.round(focus.dot(up) / texelY) * texelY;
    const z = Math.round(focus.dot(direction) / Math.min(texelX,texelY)) * Math.min(texelX,texelY);
    anchor.copy(right).multiplyScalar(x).addScaledVector(up,y).addScaledVector(direction,z);
    light.target.position.copy(anchor);
    light.position.copy(anchor).addScaledVector(direction,distance);
    light.target.updateMatrixWorld();
    light.updateMatrixWorld();
  };
}
function patchVisualQuality(source) {
  function replace(before, after) {
    if(source.split(before).length!==2)throw Error('Visual quality patch boundary changed: '+before.slice(0,100));
    source=source.replace(before,after);
  }
  // Native MSAA affects polygon edges, not the interiors of pixel textures.
  replace('createWebGL2Renderer(void 0,{antialias:!1,powerPreference:"high-performance",stencil:!1,depth:!0,alpha:!1,preserveDrawingBuffer:!1})', 'createWebGL2Renderer(void 0,{antialias:!0,powerPreference:"high-performance",stencil:!1,depth:!0,alpha:!1,preserveDrawingBuffer:!1})');
  replace('sRGB:!0,mipmapMode:"nearest"', 'sRGB:!0,mipmapMode:"linear"');
  // Magnification remains nearest-neighbor; only transitions between mip levels
  // are blended. Preserve sRGB texture decoding and the existing output space.
  replace('c.clearRect(0,0,e,t),c.setTransform(1,0,0,-1,0,t)', 'c.imageSmoothingEnabled=!1,c.clearRect(0,0,e,t),c.setTransform(1,0,0,-1,0,t)');
  const sample='vec4 texColor = texture(map, vec3(repeatedUv, vLayerIndex));';
  if(source.split(sample).length!==5)throw Error('Array texture sampling boundaries changed');
  source=source.replaceAll(sample,'vec4 texColor = textureGrad(map, vec3(repeatedUv, vLayerIndex), dFdx(scaledUv), dFdy(scaledUv));');
  // The bundled Three.js uses USE_ALPHATEST and uniform alphaTest, not ALPHATEST.
  const alpha='#ifdef ALPHATEST\n        #ifdef USE_MAP\n          if ( texColor.a < ALPHATEST ) discard;';
  if(source.split(alpha).length!==3)throw Error('Depth alpha-test boundaries changed');
  source=source.replaceAll(alpha,'#ifdef USE_ALPHATEST\n        #ifdef USE_MAP\n          if ( texColor.a < alphaTest ) discard;');
  // All array-textured terrain needs its custom sampler2DArray depth shader,
  // including containers created after material initialization.
  replace('t==="transparent"&&(d.customDepthMaterial=i)', 'i&&(d.customDepthMaterial=i)');
  replace('SHADOW_BIAS=-.001,SHADOW_NORMAL_BIAS=.04', 'SHADOW_BIAS=-.0001,SHADOW_NORMAL_BIAS=.02');
  // A moved shadow target must retain its height during day/night updates.
  replace('this.directionalLight.position.set(S+I,v,T+A)', 'this.directionalLight.position.set(S+I,this.directionalLight.target.position.y+v,T+A)');
  // Weather installs scene.onBeforeRender after the day/night system. Compose
  // with the existing callback instead of overwriting it. Both reflection and
  // main passes anchor shadows to the player's camera, not the reflected one.
  replace('ut.current=ft,console.log("[VoxelWorld] 天气系统初始化完成");', 'ut.current=ft,console.log("[VoxelWorld] 天气系统初始化完成");const logShadowUpdate=logCreateStableShadow(jn,qe),logBeforeRender=fn.onBeforeRender;fn.onBeforeRender=function(...args){logBeforeRender?.apply(this,args);logShadowUpdate()};');
  // This Three.js version skips anisotropy when magnification is NearestFilter.
  // Do not report unsupported filtering or apply it to the layer-index data map.
  replace('const e=n.capabilities.getMaxAnisotropy();return textureArray.anisotropy=e,textureArray.needsUpdate=!0,layerIndexTexture&&(layerIndexTexture.anisotropy=e,layerIndexTexture.needsUpdate=!0)', 'const e=textureArray.magFilter===NearestFilter?1:Math.min(8,n.capabilities.getMaxAnisotropy());return textureArray.anisotropy=e,textureArray.needsUpdate=!0');
  replace('Applied anisotropy: ${e}x (max supported)', 'Texture anisotropy: ${e}x');
  return require('./quality-effects.cjs').patchQualityEffects(source+'\n'+logCreateStableShadow.toString()+'\n');
}
module.exports={patchVisualQuality,logCreateStableShadow};
