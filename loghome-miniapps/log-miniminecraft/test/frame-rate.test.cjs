const test=require('node:test'),assert=require('node:assert/strict');
const {logCreateFrameGate,logNormalizeTargetFps,logGetTargetFps,logSetTargetFps}=require('../scripts/frame-rate.cjs');
test('target pacing tracks 30/60/90/120 FPS at multiple display refresh rates',()=>{
  for(const hz of [60,90,120,144,165])for(const target of [30,60,90,120]){
    const gate=logCreateFrameGate();let frames=0;
    for(let i=0;i<hz*10;i++)if(gate.shouldRender(i*1000/hz,target))frames++;
    assert.ok(Math.abs(frames-Math.min(hz,target)*10)<=1,`${hz}Hz / ${target}FPS: ${frames}`);
  }
});
test('pause, long stalls and target changes do not accumulate catch-up renders',()=>{
  const gate=logCreateFrameGate();
  assert.equal(gate.shouldRender(0,60),true);assert.equal(gate.shouldRender(8,60),false);
  assert.equal(gate.shouldRender(5000,60),true);assert.equal(gate.shouldRender(5000,60),false);
  assert.equal(gate.shouldRender(5001,120),true);assert.equal(gate.shouldRender(5002,120),false);
  gate.reset();assert.equal(gate.shouldRender(6000,30),true);assert.equal(gate.shouldRender(6010,30),false);
});
test('settings validate, persist and tolerate unavailable storage',()=>{
  const saved=global.localStorage;
  try{
    let value='90';global.localStorage={getItem:()=>value,setItem:(key,v)=>{value=v;}};
    delete logGetTargetFps.value;assert.equal(logGetTargetFps(),90);
    logSetTargetFps(120);assert.equal(value,'120');assert.equal(logGetTargetFps(),120);
    for(const invalid of [null,'bad',0,144,NaN])assert.equal(logNormalizeTargetFps(invalid),60);
    global.localStorage={getItem(){throw Error('denied')},setItem(){throw Error('denied')}};
    delete logGetTargetFps.value;assert.equal(logGetTargetFps(),60);assert.equal(logSetTargetFps(30),30);
  }finally{global.localStorage=saved;delete logGetTargetFps.value;}
});
