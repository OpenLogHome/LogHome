// Actual GameWorker messages + actual EntityRenderer, with a test-only flat world.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),source=require('../scripts/build.cjs').patchBundle(fs.readFileSync(path.join(root,'vendor/game.bundle.js'),'utf8'));
const split=source.indexOf('/* LOCAL_VANILLA_MATERIAL_PACK */'),core=source.slice(0,split)+source.slice(source.indexOf('\nfunction logMarkAttribute',split));
const workerTest=`
const populationHandler=handleWorkerMessage;
let populationTestManager;
handleWorkerMessage=function(message){
 if(message.type==='TEST_POPULATION_CONTINUE'){
 const manager=populationTestManager;
 manager.setPlayerPosition(400,64,0);manager.despawnFarEntities();
 sendToMain({type:'TEST_RESULT',phase:'despawn',count:manager.entities.size});
 for(let i=0;i<100;i++)manager.spawnEntity('pig',40+i*.01,64,0);
 sendToMain({type:'TEST_RESULT',phase:'manual',count:manager.entities.size});
 for(const id of [...manager.entities.keys()])manager.removeEntity(id,'unload');
 populationHandler({type:'LOG_SPAWN_ENVIRONMENT',time:.75});manager.setPlayerPosition(0,64,0);manager.elapsed+=100;manager.trySpawnEntities();
 sendToMain({type:'TEST_RESULT',phase:'night',count:manager.entities.size,done:true});return;
 }
 if(message.type!=='TEST_POPULATION')return populationHandler(message);
 const manager=new LogEntityManager((x,y,z)=>y===63?BlockType.GRASS:BlockType.AIR,()=>BiomeType.PLAINS,sendToMain,{isLoaded:()=>true,topY:()=>100,radius:()=>96});
 gameLogic.entityManager=manager;populationTestManager=manager;
 populationHandler({type:'LOG_SPAWN_ENVIRONMENT',time:.25});
 manager.setPlayerPosition(0,64,0);manager.updateEntity=()=>{};manager.sendEntityUpdate=()=>{};
 for(let i=0;i<36000;i++)manager.update(.1);
 sendToMain({type:'TEST_RESULT',phase:'natural',count:manager.entities.size});
};
`;
const fixture=`
initializeBuiltinBlocks();initializeRegistry();initializeItemDefinitions();await generateTextureAtlas();
// Delay only model IO; keep the real loader-completion and entity cleanup code.
window.startedModelLoads=0;window.finishedModelLoads=0;
GLTFLoader.prototype.load=function(url,onLoad){window.startedModelLoads++;setTimeout(()=>{const model=new Group();model.add(new Mesh(new BoxGeometry(1,1,1),new MeshStandardMaterial()));onLoad({scene:model,animations:[]});window.finishedModelLoads++},150)};
const scene=new Scene(),entities=new EntityRenderer(scene);let particles=0;
entities.effects.triggerDeathParticles=()=>particles++;
const channel=new MessageChannel(),worker=new Worker(URL.createObjectURL(new Blob([getWorkerCode()+${JSON.stringify(workerTest)}],{type:'application/javascript'})));
window.populationResults=[];window.populationRemaining=()=>({count:entities.getTotalEntityCount(),meshes:entities.entityMeshMap.size,configs:entities.entityRenderConfigs.size});window.disposePopulation=()=>{worker.terminate();channel.port1.close();entities.dispose()};
function record(phase,count){window.populationResults.push({phase,worker:count,rendered:entities.getTotalEntityCount(),meshes:entities.entityMeshMap.size,configs:entities.entityRenderConfigs.size,queued:[...entities.pendingSpawns.values()].reduce((sum,list)=>sum+list.length,0),particles})}
channel.port1.onmessage=event=>{const m=event.data;
 if(m.type==='ENTITY_SPAWN')entities.handleEntitySpawn(m.entity,m.modelUrl,m.textureUrl);
 if(m.type==='ENTITY_REMOVE')entities.handleEntityRemove(m.mobId,m.reason);
 if(m.type==='TEST_RESULT'){
  record(m.phase,m.count);
  if(m.phase==='natural'){
   const timer=setInterval(()=>{if(window.startedModelLoads!==window.finishedModelLoads)return;clearInterval(timer);record('loaded',m.count);channel.port1.postMessage({type:'TEST_POPULATION_CONTINUE'})},10);
  }
  if(m.phase==='despawn'){entities.loadedModels.delete('pig');entities.modelTemplates.delete('pig')}
  if(m.phase==='manual')entities.enabled=false;
  if(m.done)window.populationDone=true;
 }
};
worker.addEventListener('error',event=>{throw Error(event.message)});
worker.postMessage({type:'SET_MAIN_PORT'},[channel.port2]);channel.port1.postMessage({type:'TEST_POPULATION'});
`;
(async()=>{
 const server=http.createServer((req,res)=>{
  if(req.url==='/fixture.js'){res.setHeader('Content-Type','text/javascript');res.end(core+fixture)}
  else if(req.url==='/'){res.end('<script type="module" src="/fixture.js"></script>')}
  else if(req.url==='/favicon.ico'){res.writeHead(204);res.end()}
  else{const file=path.resolve(root,'dist','.'+decodeURIComponent(req.url.split('?')[0]));if(file.startsWith(path.join(root,'dist')+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())res.end(fs.readFileSync(file));else{res.writeHead(404);res.end()}}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.QUALITY_BROWSER||'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.populationDone,{timeout:25000});
  await page.waitForFunction(()=>window.startedModelLoads>0&&window.startedModelLoads===window.finishedModelLoads);
  const results=await page.evaluate(()=>window.populationResults),remaining=await page.evaluate(()=>window.populationRemaining());
  console.log(JSON.stringify({errors,results,remaining},null,2));assert.deepEqual(errors,[]);assert.equal(results.length,5);
  for(const result of results){assert.equal(result.rendered,result.worker);assert.equal(result.meshes+result.queued,result.worker);assert.equal(result.configs,result.worker);assert.equal(result.particles,0)}
  assert.equal(results[0].worker,10);assert.equal(results[1].meshes,10);assert.equal(results[2].worker,0);assert.equal(results[3].worker,64);assert.equal(results[4].worker,0);assert.deepEqual(remaining,{count:0,meshes:0,configs:0});
  await page.evaluate(()=>window.disposePopulation());
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
