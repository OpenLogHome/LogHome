const fs=require('node:fs'),path=require('node:path');
function patchSwimming(source){
 const replace=(before,after)=>{if(source.split(before).length!==2)throw Error('Swimming boundary changed: '+before.slice(0,100));source=source.replace(before,after)};
 const runtime=fs.readFileSync(path.join(__dirname,'swimming-runtime.js'),'utf8');
 if(runtime.includes('`')||runtime.includes('${'))throw Error('Swimming Worker helper needs template escaping');
 replace('// 第八部分：游戏逻辑管理类（占位符，由 getWorkerCode() 替换）',runtime+'\nlogInstallWorkerSwimming(typeof PlayerStateManager==="undefined"?null:PlayerStateManager,EntityPhysics,EntityManager);\n// 第八部分：游戏逻辑管理类（占位符，由 getWorkerCode() 替换）');
 // The original message adapters enumerate fields, so forward the new state at
 // every layer instead of assuming object spreads will cross Worker boundaries.
 for(const name of ['state','newState']){
  const before='isSneaking: '+name+'.isSneaking,';
  if(!source.includes(before))throw Error('Swimming state message boundary changed');
  source=source.replaceAll(before,before+'\n      isSwimming: '+name+'.isSwimming,');
 }
 replace('isSneaking:n.isSneaking,isSprinting:n.isSprinting})','isSneaking:n.isSneaking,isSprinting:n.isSprinting,isSwimming:n.isSwimming})');
 replace('isSneaking:ve.isSneaking,isSprinting:ve.isSprinting};','isSneaking:ve.isSneaking,isSprinting:ve.isSprinting,isSwimming:ve.isSwimming};window.dispatchEvent(new CustomEvent("logMinecraftSwimming",{detail:!!ve.isSwimming}));');
 replace('isSprinting:latest.isSprinting};','isSprinting:latest.isSprinting,isSwimming:latest.isSwimming};');
 replace('dt*.05)&&!visual.isFlying;', 'dt*.05)&&!visual.isFlying&&!visual.isSwimming;');
 replace('visual.isFlying,visual.isSneaking,mining);','visual.isFlying,visual.isSneaking,mining);logApplySwimPose(player,visual.isSwimming,now,mining);');
 replace('const gn=new WorkerBridge(Wt);','const gn=new WorkerBridge(Wt),logWaterProbe=logCreateWaterProbe(gn);');
 replace('updateCameraPosition(qe,visual.x,visual.y,visual.z,state.rotationX,state.rotationY,pn.current,sn.current);','updateCameraPosition(qe,visual.x,visual.y,visual.z,state.rotationX,state.rotationY,pn.current,sn.current);const logWaterBlend=logQuality.setUnderwater(logWaterProbe.sample(now,qe),now);if(Hn.current)Hn.current.logUnderwater=logWaterBlend;');
 replace('logAdvancedHand(n);const {scene:s,camera:c,renderer:h,itemGroup:f}=n;', 'logAdvancedHand(n);logUnderwaterHand(n);const {scene:s,camera:c,renderer:h,itemGroup:f}=n;');
 replace('logQuality.dispose(),ln.dispose()', 'logWaterProbe.dispose(),logQuality.dispose(),ln.dispose()');
 replace('&&logReflection.due(ve,qe)', '&&!logQuality.isUnderwater()&&logReflection.due(ve,qe)');
 const uiStart=source.indexOf('function GameUI('),uiEnd=source.indexOf('function CustomSlider(',uiStart);
 if(uiStart<0||uiEnd<0)throw Error('Swimming touch UI boundary changed');
 let ui=source.slice(uiStart,uiEnd);
 const marker='const m=reactExports.useRef(null)';
 if(ui.split(marker).length!==2)throw Error('Swimming touch state boundary changed');
 ui=ui.replace(marker,'const[logSwimming,logSetSwimming]=reactExports.useState(false);reactExports.useEffect(()=>{const change=event=>logSetSwimming(!!event.detail);window.addEventListener("logMinecraftSwimming",change);return()=>window.removeEventListener("logMinecraftSwimming",change)},[]);'+marker);
 for(const [before,after]of [
  ['C.stopPropagation(),e)i?.simulateSneak(!0)', 'C.stopPropagation(),e||logSwimming)i?.simulateSneak(!0)'],
  ['children:logPixelText(e?"⬇️":"🤫")','children:logPixelText((e||logSwimming)?"⬇️":"🤫")']
 ]){if(ui.split(before).length!==2)throw Error('Swimming touch action boundary changed');ui=ui.replace(before,after)}
 if(ui.split('e&&i?.simulateSneak(!1)').length!==3)throw Error('Swimming touch release boundary changed');
 ui=ui.replaceAll('e&&i?.simulateSneak(!1)','(e||logSwimming)&&i?.simulateSneak(!1)');
 source=source.slice(0,uiStart)+ui+source.slice(uiEnd);
 // Geometry packs have walk but no swim clip. GLTF packs prefer a real swim
 // clip and fall back to walk, giving paddling rather than a frozen idle pose.
 replace('const x=stateToAnimationName(e.animationState||"idle");','const x=stateToAnimationName(e.animationState==="swim"?"walk":e.animationState||"idle");');
 replace('const c=stateToAnimationName(t.animationState);','const c=stateToAnimationName(t.animationState==="swim"?"walk":t.animationState);');
 replace('const i=ANIMATION_STATE_MAP[o]||o;', 'const i=o==="swim"&&!r.some(clip=>clip.name.toLowerCase().includes("swim"))?"walk":ANIMATION_STATE_MAP[o]||o;');
 replace('tempEuler.set(0,o+r.rotationOffset,l)', 'tempEuler.set(t.animationState==="swim" ? .08 : 0,o+r.rotationOffset,l)');
 return source;
}
module.exports={patchSwimming};
