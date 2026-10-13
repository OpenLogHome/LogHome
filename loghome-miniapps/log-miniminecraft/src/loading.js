export function createLoading(document,frame=requestAnimationFrame){
 const overlay=document.getElementById('game-loading'),label=document.getElementById('loading-stage'),bar=document.getElementById('loading-progress'),count=document.getElementById('loading-count'),hint=document.getElementById('loading-hint');
 let finished=false,scheduled=false,error=null,completed=0;
 const waiters=new Set();
 function stage(done,text,detail='首次启动需要加载游戏资源，请稍候。'){
  if(finished||error)return;
  completed=Math.max(completed,Math.min(6,done));bar.value=completed;label.textContent=text;hint.textContent=detail;count.textContent='步骤 '+Math.min(6,completed+1)+' / 6';
 }
 function fail(message){
  if(finished)return;error=new Error(message);overlay.dataset.error='true';overlay.setAttribute('aria-busy','false');label.textContent='加载失败';hint.textContent=message;count.textContent='请从原木菜单重新加载';
  for(const waiter of waiters){clearTimeout(waiter.timer);waiter.reject(error)}waiters.clear();
 }
 function ready(){
  if(finished||scheduled||error)return;scheduled=true;
  // React has committed the menu. Allow it to paint before removing the cover.
  frame(()=>frame(()=>{if(error)return;finished=true;bar.value=6;overlay.hidden=true;overlay.setAttribute('aria-busy','false');for(const waiter of waiters){clearTimeout(waiter.timer);waiter.resolve()}waiters.clear()}));
 }
 function waitForReady(timeout=60000){
  if(error)return Promise.reject(error);if(finished)return Promise.resolve();
  return new Promise((resolve,reject)=>{const waiter={resolve,reject,timer:setTimeout(()=>fail('游戏界面准备超时，请检查网络后重新加载。'),timeout)};waiters.add(waiter)});
 }
 return {stage,fail,ready,waitForReady,get active(){return !finished}};
}
