import {CloudStorage} from './cloud-storage.js';
import {createLoading} from './loading.js';
const base=new URL('./',location.href),host=document.getElementById('cloud-status');
const loading=createLoading(document);window.logMinecraftLoading={ready:loading.ready,fail:loading.fail,stage:loadingStage};
let session,cloud,parentOrigin,initialized=false;
function status(text,error=false){host.textContent=loading.active&&!error?'':text;host.dataset.error=String(error);}
function loadingStage(done,text,detail){loading.stage(done,text,detail);send('loading',{step:done,total:6,message:text});}
async function request(route,options={}){
 const response=await fetch(new URL('api/'+route,base),{...options,headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{}),...options.headers},signal:AbortSignal.timeout(60000)});
 const data=await response.json();if(!response.ok){const error=new Error(data.error||'请求失败');error.status=response.status;throw error;}return data;
}
function send(type,extra={}){if(window.parent!==window)window.parent.postMessage({namespace:'loghome-miniapp',version:1,type,...extra},parentOrigin&&parentOrigin!=='null'?parentOrigin:'*');}
function environment(m){for(const side of ['top','bottom','left','right'])document.documentElement.style.setProperty('--flash-app-safe-area-inset-'+side,Math.max(0,Number(m.safeArea?.[side])||0)+'px');}
function unsupported(){const error=new Error('此功能依赖灵光社区或 AI 服务，尚未接入原木；游戏和云存档可正常使用。');status(error.message,true);throw error;}
function sdk(user){return {
 _getArtifactId:()=> 'log-miniminecraft',_getArtifactVersion:()=> '1',
 ai:{chat:unsupported,imageGeneration:unsupported,musicGeneration:unsupported},
 chooseImage:unsupported,uploadImage:unsupported,
 db:{async query({sql}){if(/FROM admin_settings/i.test(sql))return{success:true,data:[{setting_key:"auto_approve",setting_value:"false"}]};if(/FROM user_profiles/i.test(sql))return{success:true,data:[{id:String(user.id),displayName:user.name,avatarUrl:'',bio:'',banUntil:0,publishBanUntil:0}]};if(/FROM managed_user_profiles/i.test(sql))return{success:true,data:[{count:1}]};return{success:true,data:/COUNT\(/i.test(sql)?[{count:0}]:[]};},async execute(){return unsupported();}}
 };}
async function init(m){
 if(initialized)return;initialized=true;environment(m);loadingStage(1,'正在验证原木账号…');
 try{
  session=await request('session',{method:'POST',body:JSON.stringify({crossSiteToken:m.crossSiteToken})});
  loadingStage(2,'正在同步云存档…','正在读取你的世界与模组配置。');
  cloud=new CloudStorage(request,status);await cloud.load();window.logMinecraftStorage=cloud;window.lingguang=sdk(session.user);window.artifactId='log-miniminecraft';window.artifactVersion='1';window.__fullscreen=true;
  window.publicPath=new URL('./index_files/render.lingguangobjects.com/p/yuyan/200031800012861035/',base).href;
  loadingStage(3,'正在加载游戏程序…','首次下载较大的游戏文件可能需要一些时间。');
  await import('./index_files/render.lingguangobjects.com/p/yuyan/200031800012861035/assets/index-B8uuzVI-.js').catch(async error=>{
   // Diagnose missing deployments only after an import fails; successful starts
   // keep a single module request and the original exception for runtime errors.
   const response=await fetch(new URL('./index_files/render.lingguangobjects.com/p/yuyan/200031800012861035/assets/index-B8uuzVI-.js',base),{method:'HEAD',signal:AbortSignal.timeout(15000)}).catch(()=>null);
   if(response&&!response.ok)throw new Error('游戏文件加载失败（HTTP '+response.status+'），请管理员执行构建并部署完整 dist 目录');
   if(response&&!/(?:java|ecma)script/i.test(response.headers.get('Content-Type')||''))throw new Error('游戏脚本响应类型错误，请管理员检查部署文件及反向代理配置');
   throw error;
  });
  loadingStage(5,'正在准备游戏界面…');await loading.waitForReady();
  status('');send('loaded');
 }catch(error){loading.fail(error.message);status('无法启动游戏：'+error.message,true);send('error',{message:error.message});}
}
try{
 const config=await request('config');
 window.addEventListener('message',async e=>{
  const m=e.data;if(e.source!==window.parent||!config.allowedParents.includes(e.origin)||m?.namespace!=='loghome-miniapp'||m.version!==1)return;if(parentOrigin&&parentOrigin!==e.origin)return;parentOrigin=e.origin;
  if(m.type==='init')return init(m);
  if(m.type==='environment')environment(m);
  if(m.type==='pause'){document.exitPointerLock?.();window.logMinecraftGame?.pause();await persistWorld().catch(()=>{});return;}
  if(m.type==='back'&&window.logMinecraftGame?.back())return send('back-result',{requestId:m.requestId,consumed:true});
  if(m.type==='back'&&document.pointerLockElement){document.exitPointerLock();return send('back-result',{requestId:m.requestId,consumed:true});}
  if(m.type==='close'||m.type==='back'){try{await persistWorld(true);await cloud?.flush();send('close-ready',{requestId:m.requestId});}catch{send('close-failed',{requestId:m.requestId});}}
 });
 const params=new URLSearchParams(location.hash.slice(1)),ticket=params.get('ticket');
 if(window.parent===window&&ticket){history.replaceState(null,'',location.pathname+location.search);await init({crossSiteToken:ticket});}
 else{loadingStage(0,window.parent===window?'请从原木社区的小程序入口打开游戏。':'正在连接原木社区…');send('ready');}
}catch(error){loading.fail('存档服务暂不可用：'+error.message);status('存档服务暂不可用：'+error.message,true);send('error',{message:error.message});}

let saving;
async function persistWorld(exit=false){if(saving)await saving;const game=window.logMinecraftGame;if(!game)return;saving=exit?game.exit():game.save();try{await saving;}finally{saving=null;}}
setInterval(()=>{if(session&&!document.hidden)persistWorld().catch(error=>status('自动保存失败：'+error.message,true));},60000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){window.logMinecraftGame?.pause();persistWorld().catch(()=>{});}});
