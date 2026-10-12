// Count completed main-camera renders, excluding reflection and hand passes.
function logCreateFpsOverlay(container) {
  const label = document.createElement('div');
  label.className = 'log-minecraft-fps';
  label.textContent = 'FPS —';
  label.setAttribute('aria-label', '游戏渲染帧率');
  container.appendChild(label);
  let start = null, frames = 0, paused = false;
  return {
    frame() { frames++; },
    tick(now, isPaused) {
      if (isPaused) {
        if (!paused) label.textContent = 'FPS · 暂停';
        paused = true; start = null; frames = 0;
        return;
      }
      if (start === null) {
        start = now; frames = 0; paused = false; label.textContent = 'FPS —';
        return;
      }
      const elapsed = now - start;
      if (elapsed >= 500) {
        label.textContent = 'FPS ' + Math.round(frames * 1000 / elapsed);
        start = now; frames = 0;
      }
    },
    dispose() { label.remove(); }
  };
}
function patchFpsOverlay(source) {
  function replace(before, after) {
    if (source.split(before).length !== 2) throw Error('FPS patch boundary changed: '+before);
    source = source.replace(before, after);
  }
  replace('const Fo=ve=>{if(L.current=requestAnimationFrame(Fo),jr.current)return;', 'const logFps=logCreateFpsOverlay(hn);const Fo=ve=>{logFps.tick(ve,jr.current);if(L.current=requestAnimationFrame(Fo),jr.current)return;');
  replace('Wt.clearDirty(),_n.current=0,vn.current++', 'Wt.clearDirty(),_n.current=0,vn.current++,logFps.frame()');
  replace('ln.render(fn,qe),Nt.current=ve,vn.current++', 'ln.render(fn,qe),Nt.current=ve,vn.current++,logFps.frame()');
  replace('cancelAnimationFrame(L.current),window.removeEventListener("resize",Li)', 'cancelAnimationFrame(L.current),logFps.dispose(),window.removeEventListener("resize",Li)');
  return source+'\n'+logCreateFpsOverlay.toString()+'\n';
}
module.exports={patchFpsOverlay,logCreateFpsOverlay};
