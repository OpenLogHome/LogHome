const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const source=require('../scripts/build.cjs').patchBundle(fs.readFileSync(path.join(root,'vendor/game.bundle.js'),'utf8'));
const split=source.indexOf('/* LOCAL_VANILLA_MATERIAL_PACK */');const script=source.slice(0,split)+source.slice(source.indexOf('\nfunction logMarkAttribute',split))+`
window.logMinecraftStorage={getItem:async()=>null,getAllItems:async()=>[],setItem:async()=>true};
initializeBuiltinBlocks();initializeRegistry();initializeItemDefinitions();await generateTextureAtlas();
window.startupResult={mounts:0,unmounts:0,frames:0};
const startupQualityFactory=logCreateQualityPipeline;
logCreateQualityPipeline=function(...args){const pipeline=startupQualityFactory(...args),render=pipeline.render;pipeline.render=function(){window.startupResult.frames++;return render.call(this)};return pipeline};
const host=document.createElement('div');host.style.cssText='width:960px;height:640px';document.body.appendChild(host);
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
for(const enabled of [false,true]){
 await generateTextureAtlas();
 logAdvancedSettings.value={enabled,preset:'balanced',bloom:true};
 const previousFrames=window.startupResult.frames;
 const root=clientExports.createRoot(host);
 root.render(jsxRuntimeExports.jsx(VoxelWorldRenderer,{seed:123,renderRadius:2,chunkLoadEnabled:false,chunkUnloadEnabled:false,isPaused:false,dayNightEnabled:false}));
 await pause(1200);
 if(window.startupResult.frames<=previousFrames)throw Error('No rendered frame after mount');
 if(!host.querySelector('canvas'))throw Error('Renderer did not mount');
 if(logAdvancedSettings.error)throw Error(logAdvancedSettings.error);
 window.startupResult.mounts++;root.unmount();await pause(100);
 if(host.querySelector('canvas'))throw Error('Canvas leaked after unmount');window.startupResult.unmounts++;
}
window.startupResult.done=true;
`;
(async()=>{const server=http.createServer((req,res)=>{if(req.url==='/fixture.js'){res.setHeader('Content-Type','text/javascript');res.end(script)}else if(req.url==='/'){res.end('<script type="module" src="/fixture.js"></script>')}else{const filename=path.resolve(root,'dist','.'+decodeURIComponent(req.url.split('?')[0]));if(filename.startsWith(path.join(root,'dist')+path.sep)&&fs.existsSync(filename)&&fs.statSync(filename).isFile())res.end(fs.readFileSync(filename));else{res.statusCode=404;res.end()}}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({executablePath:process.env.QUALITY_BROWSER||'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',headless:true});try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.startupResult?.done,{timeout:15000}).catch(()=>{});const result=await page.evaluate(()=>window.startupResult);console.log(JSON.stringify({errors,result},null,2));if(errors.length||!result?.done)process.exitCode=1;}finally{await browser.close();server.close()}})();
