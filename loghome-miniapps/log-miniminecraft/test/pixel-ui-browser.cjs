// Run with Playwright through NODE_PATH. Uses a temporary authenticated fixture,
// never production player data or a production authentication bypass.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{createServer}=require('../server/index.cjs');
const {patchBundle,BUNDLE}=require('../scripts/build.cjs'),root=path.resolve(__dirname,'..');
const source=patchBundle(fs.readFileSync(path.join(root,'vendor/game.bundle.js'),'utf8'));
const split=source.indexOf('/* LOCAL_VANILLA_MATERIAL_PACK */');
const fixture=source.slice(0,split)+source.slice(source.indexOf('\nfunction logMarkAttribute',split))+`
window.logMinecraftStorage={getItem:async()=>null,getAllItems:async()=>[],setItem:async()=>true};
initializeBuiltinBlocks();initializeRegistry();initializeItemDefinitions();await generateTextureAtlas();
const fixtureRoot=clientExports.createRoot(document.getElementById('root'));
window.pixelActions={pause:0,resume:0,jump:0,sneak:[]};
function PixelFixture({mode}){
 const [fog,setFog]=reactExports.useState(true),[inventory,setInventory]=reactExports.useState(()=>addItemToInventory(createEmptyInventory(),'block_grass',64).inventory);
 const ref=reactExports.useRef(null);window.openPixelBackpack=()=>ref.current.openBackpack();window.closePixelBackpack=()=>ref.current.closeBackpack();
 const noop=()=>{};
 if(mode==='pause')return jsxRuntimeExports.jsx(PauseScreen,{renderRadius:32,fogEnabled:fog,showCollision:false,cameraMode:'first-person',autoJump:true,showBody:false,chunkLoadEnabled:true,chunkUnloadEnabled:true,chunksPerBatch:10,dayNightProgress:.3,dayNightPhase:'day',isPortrait:false,isSaving:false,onResume:()=>window.pixelActions.resume++,onRenderRadiusChange:noop,onFogEnabledChange:setFog,onShowCollisionChange:noop,onCameraModeChange:noop,onAutoJumpChange:noop,onShowBodyChange:noop,onChunkLoadEnabledChange:noop,onChunkUnloadEnabledChange:noop,onChunksPerBatchChange:noop,onDayNightTimeChange:noop,onBackToMenu:noop,onSaveStart:noop,lookSensitivity:1,onLookSensitivityChange:noop,maxLightCount:16,onMaxLightCountChange:noop,lightShadowsEnabled:true,onLightShadowsEnabledChange:noop,waterReflectionEnabled:true,onWaterReflectionEnabledChange:noop,crosshairMode:'cross',onCrosshairModeChange:noop,joystickSettings:DEFAULT_JOYSTICK_SETTINGS,onJoystickSettingsChange:noop,jumpButtonSettings:DEFAULT_JUMP_BUTTON_SETTINGS,onJumpButtonSettingsChange:noop,sneakButtonSettings:DEFAULT_SNEAK_BUTTON_SETTINGS,onSneakButtonSettingsChange:noop});
 if(mode==='inventory')return jsxRuntimeExports.jsx(InventoryUI,{ref,inventory,onInventoryChange:setInventory,isPaused:false,isMobile:true,onDropItem:noop,gameMode:'survival'});
 if(mode==='keybind')return jsxRuntimeExports.jsx(KeybindEditor,{joystickSettings:DEFAULT_JOYSTICK_SETTINGS,jumpButtonSettings:DEFAULT_JUMP_BUTTON_SETTINGS,sneakButtonSettings:DEFAULT_SNEAK_BUTTON_SETTINGS,onJoystickSettingsChange:noop,onJumpButtonSettingsChange:noop,onSneakButtonSettingsChange:noop,onClose:noop,isPortrait:false});
 return jsxRuntimeExports.jsx(GameUI,{onPause:()=>window.pixelActions.pause++,isFlying:false,isSneaking:false,isSprinting:false,isPointerLocked:false,isPortrait:false,joystickSettings:DEFAULT_JOYSTICK_SETTINGS,jumpButtonSettings:DEFAULT_JUMP_BUTTON_SETTINGS,sneakButtonSettings:DEFAULT_SNEAK_BUTTON_SETTINGS,controls:new Proxy({simulateSneak:value=>window.pixelActions.sneak.push(value),simulateJump:value=>{if(value)window.pixelActions.jump++}},{get:(target,key)=>target[key]||noop}),weatherEffects:[],currentWeatherIndex:0,weatherAutoSwitch:false});
}
window.showPixelFixture=mode=>fixtureRoot.render(jsxRuntimeExports.jsx(PixelFixture,{key:mode,mode}));window.showPixelFixture('hud');window.fixtureReady=true;
`;
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'miniminecraft-pixel-ui-'));
 const server=createServer({dataDir:dir,authorize:async()=>({id:1,name:'Pixel UI test'})});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}/log-miniminecraft/`;
 const browser=await chromium.launch({executablePath:process.env.QUALITY_BROWSER||'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:800},hasTouch:true}),errors=[];page.on('pageerror',error=>{errors.push(error.message);console.error('UI browser error:',error.message)});
  async function cleanUi(){
   assert.deepEqual(await page.evaluate(()=>Array.from(document.querySelectorAll('#root *, .mc-ui')).filter(e=>{const s=getComputedStyle(e);return s.backdropFilter!=='none'&&s.backdropFilter!==''}).map(e=>e.tagName+':'+e.className)),[]);
  }
  async function shot(name){if(process.env.PIXEL_UI_SCREENSHOTS){fs.mkdirSync(process.env.PIXEL_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.PIXEL_UI_SCREENSHOTS,name+'.png')})}}
  await page.goto(base+'#ticket=pixel001');await page.waitForFunction(()=>document.querySelector('#game-loading').hidden,{timeout:60000});await page.getByTestId('start-game-button').waitFor();await cleanUi();await shot('menu');
  await page.getByTestId('start-game-button').click();await page.getByTestId('create-save-button').first().click();
  const dialog=page.getByTestId('create-save-dialog');await dialog.waitFor();await page.getByTestId('save-name-input').fill('像素世界 🎮');
  const survival=dialog.getByRole('button',{name:'生存',exact:true}),creative=dialog.getByRole('button',{name:'创造',exact:true});
  assert.match(await survival.getAttribute('class'),/mc-accent/);await creative.click();assert.match(await creative.getAttribute('class'),/mc-accent/);assert.doesNotMatch(await survival.getAttribute('class'),/mc-accent/);
  assert.equal(await page.getByTestId('save-name-input').inputValue(),'像素世界 🎮');await cleanUi();await shot('create-desktop');
  for(const [width,height]of [[390,844],[844,390]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(150);
   const box=await dialog.boundingBox();assert.ok(box.x>=-1&&box.y>=-1&&box.x+box.width<=width+1&&box.y+box.height<=height+1,JSON.stringify(box));await shot('create-'+width);
  }
  await page.getByTestId('cancel-create-button').click();await page.setViewportSize({width:1280,height:800});
  const fixtureUrl=new URL('pixel-ui-fixture.js',base+BUNDLE).href;
  await page.route(fixtureUrl,route=>route.fulfill({contentType:'text/javascript',body:fixture}));
  await page.route(base+'pixel-fixture.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="shell.css"><link rel="stylesheet" href="pixel-ui.css"><style>body{background:#6b8874}#root{background:transparent}</style><div id="root"></div><script type="module" src="'+fixtureUrl+'"></script>'}));
  await page.goto(base+'pixel-fixture.html');await page.waitForFunction(()=>window.fixtureReady);await page.getByTestId('pause-button').click();assert.equal(await page.evaluate(()=>pixelActions.pause),1);
  await page.getByTestId('jump-button').tap();assert.equal(await page.evaluate(()=>pixelActions.jump),1);
  assert.equal(await page.getByTestId('sneak-button').locator('svg').count(),1);assert.equal(await page.getByTestId('jump-button').locator('svg').count(),1);await cleanUi();await shot('hud');
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('logMinecraftSwimming',{detail:true})));
  await page.getByTestId('sneak-button').tap();assert.deepEqual(await page.evaluate(()=>pixelActions.sneak),[true,false]);
  await page.evaluate(()=>showPixelFixture('pause'));await page.getByTestId('pause-screen').waitFor();
  const fog=page.getByTestId('fog-toggle-pause');assert.equal(await fog.getAttribute('aria-checked'),'true');await fog.click();assert.equal(await fog.getAttribute('aria-checked'),'false');
  await page.getByRole('button',{name:'90 FPS',exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('log_minecraft_target_fps')),'90');
  await cleanUi();await shot('pause');await page.getByTestId('resume-button').click();assert.equal(await page.evaluate(()=>pixelActions.resume),1);
  await page.evaluate(()=>showPixelFixture('inventory'));await page.locator('.mc-slot').first().waitFor();await page.evaluate(()=>openPixelBackpack());await page.waitForTimeout(150);await cleanUi();await shot('inventory');
  assert.equal(await page.locator('.mc-slot .mc-slot').count(),0);assert.ok(await page.locator('.mc-slot img').count()>0);
  const tooltip=page.locator('.mc-tooltip');
  await page.locator('.mc-slot[data-slot-index="0"]').last().hover();await tooltip.waitFor();
  // Closing by keyboard removes the hovered element without a mouseleave.
  await page.keyboard.press('e');await tooltip.waitFor({state:'detached'});
  await page.mouse.move(0,0);await page.keyboard.press('e');await page.waitForFunction(()=>document.querySelectorAll('.mc-slot').length>9);
  assert.equal(await tooltip.count(),0);
  await page.locator('.mc-slot[data-slot-index="0"]').last().hover();await tooltip.waitFor();
  await page.evaluate(()=>closePixelBackpack());await tooltip.waitFor({state:'detached'});
  // Closed hotbar hover still works and clears normally on mouseleave.
  await page.mouse.move(0,0);await page.locator('.mc-slot[data-slot-index="0"]').first().hover();await tooltip.waitFor();
  await page.mouse.move(0,0);await tooltip.waitFor({state:'detached'});
  await page.evaluate(()=>showPixelFixture('keybind'));await page.getByRole('heading',{name:'键位调整'}).waitFor();await cleanUi();await shot('keybind');
  assert.deepEqual(errors,[]);console.log('Pixel UI browser checks passed: real menu/create, mobile layout, state selection, HUD touch, settings, inventory and keybind editor.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true})}
})().catch(error=>{console.error(error);process.exitCode=1});
