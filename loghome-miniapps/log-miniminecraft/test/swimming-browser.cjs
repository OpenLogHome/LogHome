// End-to-end simulation in the emitted GameWorker and its real message adapter.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),source=require('../scripts/build.cjs').patchBundle(fs.readFileSync(path.join(root,'vendor/game.bundle.js'),'utf8'));
const split=source.indexOf('/* LOCAL_VANILLA_MATERIAL_PACK */'),core=source.slice(0,split)+source.slice(source.indexOf('\nfunction logMarkAttribute',split));
const workerTest=`
const swimHandler=handleWorkerMessage;
handleWorkerMessage=function(message){
 if(message.type!=='TEST_SWIMMING')return swimHandler(message);
 const pool=(x,y,z)=>y<0?BlockType.STONE:y<6?(x>=10?BlockType.SNOW:BlockType.WATER):BlockType.AIR;
 gameLogic.getBlockAt=pool;
 const player=new PlayerStateManager(()=>0,pool);player.setPosition(.5,4.8,.5);
 for(let i=0;i<60;i++)player.updateMovement(1/60);
 const sinkVelocity=player.velocityY;
 gameLogic.playerState=player;gameLogic.sendPlayerStateUpdate();
 player.keys.ShiftLeft=true;for(let i=0;i<60;i++)player.updateMovement(1/60);const diveY=player.positionY;
 player.keys.ShiftLeft=false;player.keys.Space=true;for(let i=0;i<120;i++)player.updateMovement(1/60);const riseY=player.positionY;
 const manager=new LogEntityManager(pool,()=>BiomeType.PLAINS,()=>{},{}),pig=manager.spawnEntity('pig',.5,2,.5);
 manager.executeBehavior=()=>{};for(let i=0;i<720;i++)manager.updateEntity(pig,1/60);
 sendToMain({type:'TEST_SWIMMING_RESULT',sinkVelocity,diveY,riseY,pigY:pig.position.y,pigHeight:getEntityTypeConfig('pig').boundingBox.height,pigAnimation:pig.animationState,workerWaterId:BlockType.WATER});
};
`;
const fixture=`
initializeBuiltinBlocks();initializeRegistry();initializeItemDefinitions();await generateTextureAtlas();
const channel=new MessageChannel(),worker=new Worker(URL.createObjectURL(new Blob([getWorkerCode()+${JSON.stringify(workerTest)}],{type:'application/javascript'})));
const callbacks=new Map(),camera={position:{x:.5,y:3.5,z:.5}};let queryId=0;
const probe=logCreateWaterProbe({getBlocksAround(x,y,z,radius,callback){const requestId=queryId++;callbacks.set(requestId,callback);channel.port1.postMessage({type:WorkerMessageType.GET_BLOCKS_AROUND,requestId,centerX:x,centerY:y,centerZ:z,radius})}});
window.swimStates=[];window.probeResults=[];window.disposeSwim=()=>{probe.dispose();worker.terminate();channel.port1.close()};
channel.port1.onmessage=event=>{
 const m=event.data;
 if(m.type==='PLAYER_STATE_UPDATE')handlePlayerStateUpdate(m,{onPlayerStateUpdate:state=>window.swimStates.push(state)});
 if(m.type==='TEST_SWIMMING_RESULT'){window.swimResult=m;probe.sample(0,camera)}
 if(m.type===WorkerMessageType.BLOCKS_AROUND_RESULT){
  handleBlocksAroundResult(m,{blocksAroundCallbacks:callbacks});
  window.probeResults.push(probe.sample(window.probeResults.length*100+1,camera));
  if(window.probeResults.length===1){camera.position.x=10.5;probe.sample(100,camera)}
  else if(window.probeResults.length===2){camera.position.x=.5;camera.position.y=6.01;probe.sample(200,camera)}
  else{window.waterIds={legacy:BlockType.WATER,registered:getBlockTypeById('water')};window.swimDone=true}
 }
};
worker.addEventListener('error',event=>{throw Error(event.message)});worker.postMessage({type:'SET_MAIN_PORT'},[channel.port2]);channel.port1.postMessage({type:'TEST_SWIMMING'});
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
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.swimDone,{timeout:20000});
  const {result,states,probeResults,waterIds}=await page.evaluate(()=>({result:swimResult,states:swimStates,probeResults,waterIds}));console.log(JSON.stringify({errors,result,states,probeResults,waterIds},null,2));
  assert.deepEqual(errors,[]);assert.equal(states.length,1);assert.equal(states[0].isSwimming,true);assert.ok(states[0].positionY<4.5&&states[0].positionY>4);
  assert.ok(result.sinkVelocity<-.5);assert.notEqual(waterIds.legacy,waterIds.registered);assert.equal(result.workerWaterId,waterIds.registered);assert.deepEqual(probeResults,[true,false,false]);
  assert.ok(result.diveY<4);assert.ok(result.riseY>result.diveY+1);assert.equal(result.pigAnimation,'swim');assert.ok(Math.abs(result.pigY-(6-result.pigHeight*.65))<.01);
  await page.evaluate(()=>window.disposeSwim());
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
