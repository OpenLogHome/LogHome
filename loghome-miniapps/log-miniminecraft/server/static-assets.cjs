const fs=require('node:fs'),path=require('node:path');
const GAME_BUNDLE='index_files/render.lingguangobjects.com/p/yuyan/200031800012861035/assets/index-B8uuzVI-.js';
const STARTUP_ASSETS=['index.html','bootstrap.js','cloud-storage.js','loading.js','shell.css','save-dialog.css','pixel-ui.css',
 'index_files/render.lingguangobjects.com/p/yuyan/200031800012861035/assets/index-k0PxXESl.css',GAME_BUNDLE];
function validateStaticAssets(publicDir){
 const missing=STARTUP_ASSETS.filter(asset=>{try{const stat=fs.statSync(path.join(publicDir,asset));return !stat.isFile()||stat.size===0}catch{return true}});
 if(missing.length)throw Error('Incomplete MiniMinecraft build: '+missing.join(', ')+'. Run npm run build and deploy the complete dist/ directory before starting.');
}
module.exports={GAME_BUNDLE,STARTUP_ASSETS,validateStaticAssets};
