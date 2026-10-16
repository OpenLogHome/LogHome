const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..'),dist=path.join(root,'dist');
const {GAME_BUNDLE:BUNDLE,validateStaticAssets}=require('../server/static-assets.cjs');
function patchBundle(source){
 // Windows Git checkouts can turn the embedded Worker/shader source into CRLF.
 // All checked patch boundaries use LF; normalize before applying any patch.
 source=source.replace(/\r\n?/g,'\n');
 // Defaults only: valid preferences already saved by the player keep priority.
 for(const [before,after]of [
  ['localStorage.getItem(RENDER_RADIUS_KEY);if(oe!==null){const Ge=Number(oe);if(!isNaN(Ge)&&Ge>=2&&Ge<=64)return Ge}return 5','localStorage.getItem(RENDER_RADIUS_KEY);if(oe!==null){const Ge=Number(oe);if(!isNaN(Ge)&&Ge>=2&&Ge<=64)return Ge}return 32'],
  ['localStorage.getItem(CHUNKS_PER_BATCH_KEY);if(oe!==null){const Ge=Number(oe);if(!isNaN(Ge)&&Ge>=1&&Ge<=10)return Ge}return 1','localStorage.getItem(CHUNKS_PER_BATCH_KEY);if(oe!==null){const Ge=Number(oe);if(!isNaN(Ge)&&Ge>=1&&Ge<=10)return Ge}return 10']
 ]){if(source.split(before).length!==2)throw Error('Game default boundary changed: '+before);source=source.replace(before,after)}
 function replaceFunction(name,body){
  const pattern=new RegExp('(?:async )?function '+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\('),match=pattern.exec(source);
  if(!match)throw Error('Missing export function: '+name);
  // Find the closing brace, preserving constants/export objects between functions.
  let i=source.indexOf('{',match.index),depth=0,quote=null;
  for(;i<source.length;i++){
   const c=source[i];
   if(quote){if(c==='\\'){i++;continue;}if(c===quote)quote=null;continue;}
   if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
   if(c==='/'&&source[i+1]==='/'){i=source.indexOf('\n',i);if(i<0)throw Error('Unterminated comment');continue;}
   if(c==='/'&&source[i+1]==='*'){i=source.indexOf('*/',i+2)+1;continue;}
   if(c==='{')depth++;
   if(c==='}'&&--depth===0)break;
  }
  if(depth!==0)throw Error('Missing function boundary: '+name);
  source=source.slice(0,match.index)+body+source.slice(i+1);
 }
 const methods={getItem:'n,e',getAllItems:'n',getByIndex:'n,e,t',setAllItems:'n,e',removeAllItems:'n,e',removeByIndex:'n,e,t',clearStore:'n', 'removeItem$1':'n,e'};
 for(const[name,args]of Object.entries(methods))replaceFunction(name,`async function ${name}(${args}){return window.logMinecraftStorage.${name==='removeItem$1'?'removeItem':name}(${args})}`);
 replaceFunction('setItem','async function setItem(n,e){if(n===STORES.SAVE_LIST&&e.key==="list")return true;return window.logMinecraftStorage.setItem(n,e)}');
 replaceFunction('runMigrationIfNeeded','async function runMigrationIfNeeded(){return true}');
 replaceFunction('migrateFromLocalStorage','async function migrateFromLocalStorage(){return true}');
 replaceFunction('deleteCurrentDatabase','async function deleteCurrentDatabase(){return window.logMinecraftStorage.clearAll()}');
 replaceFunction('deleteAllLegacyDatabases','async function deleteAllLegacyDatabases(){return true}');
 const old='async function getSaveList(){const n=await getItem(STORES.SAVE_LIST,"list");';
 if(!source.includes(old))throw Error('Save list adapter boundary changed');
 source=source.replace(old,'async function getSaveList(){const n={list:(await getAllItems(STORES.SAVES)).map(s=>({...s,size:calculateSaveSize(s)}))};');
 replaceFunction('getTrashList','async function getTrashList(){return(await getTrashData()).map(row=>row.meta)}');
 replaceFunction('getTrashData','async function getTrashData(){return(await window.logMinecraftStorage.getItem("saveList","trash"))?.list||[]}');
 replaceFunction('saveTrashData','async function saveTrashData(n){return window.logMinecraftStorage.setItem("saveList",{key:"trash",list:n})}');
 replaceFunction('clearTrash','async function clearTrash(){return window.logMinecraftStorage.removeItem("saveList","trash")}');
 replaceFunction('moveToTrash','async function moveToTrash(n){const e=await loadSave(n);if(!e)return false;const meta=(await getSaveList()).find(s=>s.id===n);if(!meta)return false;await window.logMinecraftStorage.moveToTrash(n,{meta:{...meta,deletedAt:Date.now()},data:serializeSaveDataForTrash(e)});return true}');
 replaceFunction('restoreFromTrash','async function restoreFromTrash(n){const entry=(await getTrashData()).find(row=>row.meta.id===n);if(!entry)return null;const data={...deserializeSaveDataFromTrash(entry.data),id:generateId$1(),updatedAt:Date.now()};await window.logMinecraftStorage.restoreFromTrash(n,data);return data}');
 // Keep mode/shader/world flags during load + later updates (the export omitted them).
 const loadMarker='),{id:typeof e?.id=="string"?e.id:"",name:';
 if(!source.includes(loadMarker))throw Error('World load boundary changed');
 source=source.replace(loadMarker,'),{...e,id:typeof e?.id=="string"?e.id:"",name:');
 // Expose the live React game save callback to the host, including a save-without-exit path.
 const saveStart=source.indexOf('vr=reactExports.useCallback(async()=>{if(!t)');
 const saveEnd=source.indexOf('},[t,mt,st,Vt,Ee]),jr=',saveStart);
 if(saveStart<0||saveEnd<0)throw Error('Live save callback boundary changed');
 let callback=source.slice(saveStart,saveEnd);
 callback=callback.replace('async()=>{','async(logSaveOnly=false)=>{')
  .replace('Pt(!0);const[','if(logSaveOnly!==true)Pt(!0);try{const[')
  .replace('}),await new Promise','});if(logSaveOnly===true)return;await new Promise');
 source=source.slice(0,saveStart)+callback+'}finally{Pt(!1)}'+source.slice(saveEnd);
 const hookMarker='Xr=reactExports.useCallback(()=>{i(!1)},[]);';
 if(!source.includes(hookMarker))throw Error('Game bridge boundary changed');
 source=source.replace(hookMarker,hookMarker+'reactExports.useEffect(()=>{const bridge={pause:dr,save:()=>n==="playing"?vr(true):Promise.resolve(),exit:()=>n==="playing"?vr(false):Promise.resolve(),back:()=>{if(n==="playing"&&!o){dr();return true}if(n!=="start"&&n!=="playing"){e("start");return true}return false}};window.logMinecraftGame=bridge;return()=>{if(window.logMinecraftGame===bridge)delete window.logMinecraftGame}},[n,o,vr,dr]);');
 for(const [before,after]of [
  ['function App(){','function App(){reactExports.useEffect(()=>{window.logMinecraftLoading?.ready()},[]);'],
  ['await (await import("../../../../../../mods/minecraft-vanilla-1.21/install.js"))','window.logMinecraftLoading?.stage(4,"正在准备原版材质…","首次安装材质包时会同步到云存档，请稍候。");await (await import("../../../../../../mods/minecraft-vanilla-1.21/install.js"))'],
  ['componentDidCatch(e,t){const r=t.componentStack','componentDidCatch(e,t){window.logMinecraftLoading?.fail(e.message);const r=t.componentStack']
 ]){if(source.split(before).length!==2)throw Error('Loading bridge boundary changed: '+before);source=source.replace(before,after)}
 // Resolve exported URL literals against the files shipped with the game, when available.
 source=source.replace(/https?:\/\/[^\s"'<>`\\)]+/g,url=>{
  try{const u=new URL(url),local=path.join(root,'public/index_files',u.hostname,decodeURIComponent(u.pathname));if(fs.existsSync(local)&&fs.statSync(local).isFile())return './'+path.relative(path.dirname(path.join(root,'public',BUNDLE)),local).split(path.sep).join('/');}catch{}return url;
 });
 return require('./population.cjs').patchPopulation(require('./trees.cjs').patchTrees(require('./motion.cjs').patchMotion(require('./visual-quality.cjs').patchVisualQuality(require('./frame-rate.cjs').patchFrameRate(require('./fps-overlay.cjs').patchFpsOverlay(require('./performance-patches.cjs').patchPerformance(source)))))));
}
function build(outputDir=dist){const patched=patchBundle(fs.readFileSync(path.join(root,'vendor/game.bundle.js'),'utf8'));fs.rmSync(outputDir,{recursive:true,force:true});fs.cpSync(path.join(root,'public'),outputDir,{recursive:true});for(const name of ['bootstrap.js','cloud-storage.js','loading.js'])fs.copyFileSync(path.join(root,'src',name),path.join(outputDir,name));const file=path.join(outputDir,BUNDLE);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,patched);validateStaticAssets(outputDir);console.log('Built Log MiniMinecraft → '+outputDir);}
if(require.main===module)build();module.exports={patchBundle,build,BUNDLE};
