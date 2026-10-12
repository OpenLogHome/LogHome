const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const {Supervisor,discover,environment,control} = require('../start-all.js');

const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
async function until(fn, timeout=12000) {
  const deadline = Date.now()+timeout;
  while (!fn()) { if (Date.now()>deadline) throw Error('Timed out waiting for supervisor state'); await delay(30); }
}
async function port() {
  const server = http.createServer();
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const value = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return value;
}
function fixture(root,id,port,{crash=false,build=false,ignoreTerm=false}={}) {
  const dir = path.join(root,id); fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({scripts:{start:'node server.cjs',...(build?{build:'node build.cjs'}:{})},miniapp:{port,basePath:'/'+id,healthPath:'/api/health'}}));
  fs.writeFileSync(path.join(dir,'server.cjs'),crash ? 'process.exit(42);' : `
const http=require('node:http');let unhealthy=false;
${ignoreTerm ? "process.on('SIGTERM',()=>{});" : ''}
http.createServer((req,res)=>{if(req.url.endsWith('/toggle'))unhealthy=true;res.statusCode=unhealthy?503:200;res.end('ok');}).listen(Number(process.env.PORT),'127.0.0.1');
`);
  if(build) fs.writeFileSync(path.join(dir,'build.cjs'),"require('fs').mkdirSync('dist',{recursive:true});require('fs').writeFileSync('dist/built','yes');");
}
function temporary(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'loghome-supervisor-'));
  return root;
}
async function managed(t,root,options={}) {
  const manager = new Supervisor(root,{quiet:true,healthInterval:80,healthTimeout:100,startupTimeout:4000,restartDelay:80,stopTimeout:500,...options});
  await manager.start(); t.after(async () => { await manager.shutdown(); fs.rmSync(root,{recursive:true,force:true}); }); return manager;
}

test('discovers start scripts and isolates per-app production/development settings', async t => {
  const root = temporary(t); fixture(root,'one',9001); fixture(root,'two',9002);
  t.after(() => fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'not-a-service'));fs.writeFileSync(path.join(root,'not-a-service/package.json'),'{}');
  fs.writeFileSync(path.join(root,'one/.env'),'PORT=9011\nDATA_DIR=private-one\nLOGHOME_API_URL=https://production.invalid');
  fs.writeFileSync(path.join(root,'one/.env.development'),'PORT=9021\nLOGHOME_API_URL=http://localhost:9000');
  const previous = {PORT:process.env.PORT,DATA_DIR:process.env.DATA_DIR};process.env.PORT='9999';process.env.DATA_DIR='must-not-share';
  try {
    const apps = discover(root);assert.equal(apps.length,2);
    assert.equal(environment(apps[0],'start').port,9011);
    assert.equal(environment(apps[0],'dev').port,9021);
    assert.equal(environment(apps[0],'dev').env.DATA_DIR,undefined);
    assert.equal(environment(apps[1],'start').port,9002);
    assert.equal(environment(apps[1],'start').env.DATA_DIR,undefined);
  } finally { for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;} }
});

test('starts independent backends, builds missing dist, controls individual services and cleans up', async t => {
  const root=temporary(t),one=await port(),two=await port();fixture(root,'one',one,{build:true});fixture(root,'two',two);
  const manager=await managed(t,root);
  await until(()=>manager.apps.every(app=>app.state==='running'));
  assert.equal(fs.readFileSync(path.join(root,'one/dist/built'),'utf8'),'yes');
  const status=await control(manager.runtime,'status');assert.equal(status.apps.length,2);assert(status.apps.every(app=>app.health==='healthy'));
  const duplicate=new Supervisor(root,{quiet:true});await assert.rejects(duplicate.start(),/已经运行/);
  const old=manager.apps[0].child.pid;
  await control(manager.runtime,'stop','one');assert.equal(manager.apps[0].state,'stopped');assert.equal(manager.apps[1].state,'running');
  await control(manager.runtime,'start','one');await until(()=>manager.apps[0].state==='running');assert.notEqual(manager.apps[0].child.pid,old);
  await manager.shutdown();
  assert(manager.apps.every(app=>app.state==='stopped'&&!app.child));
  assert(!fs.existsSync(path.join(manager.runtime,'manager.lock')));
  for(const number of [one,two])await assert.rejects(fetch(`http://127.0.0.1:${number}/`));
});

test('killing the npm wrapper cleans up descendants and restarts only that backend', async t => {
  const root=temporary(t);fixture(root,'one',await port());fixture(root,'two',await port());
  const manager=await managed(t,root);await until(()=>manager.apps.every(app=>app.state==='running'));
  const one=manager.apps[0],twoPid=manager.apps[1].child.pid,old=one.child.pid;
  process.kill(old,'SIGKILL');await until(()=>one.state==='running'&&one.child.pid!==old);
  assert.equal(one.restarts,1);assert.equal(manager.apps[1].child.pid,twoPid);
});

test('health failures restart a live but unresponsive backend', async t => {
  const root=temporary(t),number=await port();fixture(root,'one',number);
  const manager=await managed(t,root);await until(()=>manager.apps[0].state==='running');
  const app=manager.apps[0],old=app.child.pid;
  await fetch(`http://127.0.0.1:${number}/one/toggle`);
  await until(()=>app.state==='running'&&app.child.pid!==old);
  assert.equal(app.restarts,1);assert.equal(app.health,'healthy');
});

test('an occupied port fails safely while other backends remain running', async t => {
  const blocker=http.createServer((req,res)=>res.end('external'));
  await new Promise(resolve=>blocker.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>blocker.close(resolve)));
  const root=temporary(t),number=blocker.address().port;fixture(root,'one',number);fixture(root,'two',await port());
  const manager=await managed(t,root);await until(()=>manager.apps[0].state==='failed'&&manager.apps[1].state==='running');
  assert.match(manager.apps[0].lastError,/占用/);assert.equal(manager.apps[0].restarts,0);
  await manager.shutdown();assert.equal(await(await fetch(`http://127.0.0.1:${number}/`)).text(),'external');
});

test('rapid crashes stop retrying and a stale dead-manager lock can be recovered', async t => {
  const root=temporary(t);fixture(root,'one',await port(),{crash:true});fixture(root,'two',await port());
  fs.mkdirSync(path.join(root,'.runtime'));fs.writeFileSync(path.join(root,'.runtime/manager.lock'),JSON.stringify({pid:2147483647}));
  const manager=await managed(t,root,{maxRestarts:2});
  await until(()=>manager.apps[0].state==='failed'&&manager.apps[1].state==='running');
  assert.equal(manager.apps[0].restarts,2);assert.equal(manager.apps[0].lastExit.code,42);assert.equal(manager.apps[0].child,null);
  await delay(250);assert.equal(manager.apps[0].restarts,2);
  const runtime=fs.readFileSync(path.join(manager.runtime,'status.json'),'utf8');assert(!runtime.includes(manager.token));
});

test('stop command force-cleans a descendant ignoring SIGTERM and releases manager ownership', async t => {
  const root=temporary(t),number=await port();fixture(root,'one',number,{ignoreTerm:true});
  const manager=await managed(t,root);await until(()=>manager.apps[0].state==='running');
  const status=await control(manager.runtime,'stop');assert.equal(status.stopping,true);
  await until(()=>!manager.server.listening&&!fs.existsSync(path.join(manager.runtime,'manager.lock')));
  await assert.rejects(fetch(`http://127.0.0.1:${number}/`));
  await assert.rejects(control(manager.runtime,'status'),/未运行/);
});
