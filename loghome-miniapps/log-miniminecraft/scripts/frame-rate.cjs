function logNormalizeTargetFps(value) {
  const fps = Number(value);
  return [30, 60, 90, 120].includes(fps) ? fps : 60;
}
function logGetTargetFps() {
  if (logGetTargetFps.value === undefined) {
    let stored;
    try { stored = localStorage.getItem('log_minecraft_target_fps'); } catch {}
    logGetTargetFps.value = logNormalizeTargetFps(stored);
  }
  return logGetTargetFps.value;
}
function logSetTargetFps(value) {
  const fps = logNormalizeTargetFps(value);
  logGetTargetFps.value = fps;
  try { localStorage.setItem('log_minecraft_target_fps', String(fps)); } catch {}
  return fps;
}
// Maintain a deadline rather than restarting the interval at each RAF, which
// would round 90 FPS down to 60 on a 120 Hz display. Never issue catch-up renders.
function logCreateFrameGate() {
  let deadline = null, previousTarget = null;
  return {
    reset() { deadline = null; },
    shouldRender(now, target) {
      target = logNormalizeTargetFps(target);
      const interval = 1000 / target;
      if (deadline === null || target !== previousTarget) {
        previousTarget = target; deadline = now + interval;
        return true;
      }
      if (now + 0.1 < deadline) return false;
      if (now - deadline > interval) deadline = now + interval;
      else deadline += interval;
      return true;
    }
  };
}
function LogTargetFpsSetting() {
  const [fps, setFps] = reactExports.useState(logGetTargetFps);
  return jsxRuntimeExports.jsxs('div', {className:'log-target-fps', children:[
    jsxRuntimeExports.jsx('div', {className:'log-target-fps-title', children:'目标帧率'}),
    jsxRuntimeExports.jsx('div', {className:'log-target-fps-options', role:'group', 'aria-label':'目标帧率', children:
      [30,60,90,120].map(value=>jsxRuntimeExports.jsx('button', {
        type:'button', 'aria-pressed':fps===value, 'data-testid':'target-fps-'+value,
        onClick:()=>setFps(logSetTargetFps(value)), children:value+' FPS'
      }, value))
    }),
    jsxRuntimeExports.jsx('p', {children:'实际帧率取决于设备性能和屏幕刷新率。'})
  ]});
}
function patchFrameRate(source) {
  function replace(before, after) {
    if(source.split(before).length!==2)throw Error('Frame-rate patch boundary changed: '+before.slice(0,100));
    source=source.replace(before,after);
  }
  replace('const logFps=logCreateFpsOverlay(hn);', 'const logFps=logCreateFpsOverlay(hn),logFrameGate=logCreateFrameGate();');
  replace('if(L.current=requestAnimationFrame(Fo),jr.current)return;', 'if(L.current=requestAnimationFrame(Fo),jr.current){logFrameGate.reset();return}');
  replace('const on=Wt.needsRender(),_r=ve-Nt.current,tr=on||_r>=TARGET_FRAME_INTERVAL*2;', 'const tr=logFrameGate.shouldRender(ve,logGetTargetFps());');
  replace('else _n.current++,_n.current>MAX_IDLE_FRAMES&&_n.current%3===0&&(ln.render(fn,qe),Nt.current=ve,vn.current++,logFps.frame());', 'else _n.current++;');
  replace('if(ve-Nn.current>=HAND_ITEM_FRAME_INTERVAL){', 'if(tr){');
  // A missing pointer should skip target picking, not the rest of the frame.
  replace('if(Jn-Rt.current>=An){', 'logRaycast:if(Jn-Rt.current>=An){');
  replace('On&&(On.visible=!1);return}Bn?(Un=Bn.x*2-1', 'On&&(On.visible=!1);break logRaycast}Bn?(Un=Bn.x*2-1');
  const start=source.indexOf('function PauseScreen('),end=source.indexOf('className:"pause-settings-scroll"',start);
  const insertion=source.indexOf('children:[',end)+'children:['.length;
  if(start<0||end<0||insertion<end)throw Error('Missing pause settings boundary');
  source=source.slice(0,insertion)+'jsxRuntimeExports.jsx(LogTargetFpsSetting,{}),'+source.slice(insertion);
  return source+'\n'+[logNormalizeTargetFps,logGetTargetFps,logSetTargetFps,logCreateFrameGate,LogTargetFpsSetting].map(fn=>fn.toString()).join('\n')+'\n';
}
module.exports={patchFrameRate,logNormalizeTargetFps,logCreateFrameGate,logGetTargetFps,logSetTargetFps};
