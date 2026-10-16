#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const http = require('node:http');
const crypto = require('node:crypto');
const {spawn} = require('node:child_process');
const {parseEnv} = require('node:util');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const alive = pid => {
  try { process.kill(pid, 0); return true; } catch (error) { return error.code !== 'ESRCH'; }
};
function writeJson(file, data) {
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n', {mode:0o600});
  fs.renameSync(temporary, file);
}
function discover(root) {
  return fs.readdirSync(root, {withFileTypes:true})
    .filter(entry => entry.isDirectory() && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(entry.name) && entry.name !== 'node_modules')
    .flatMap(entry => {
      const directory = path.join(root, entry.name), file = path.join(directory, 'package.json');
      if (!fs.existsSync(file)) return [];
      const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
      return pkg.scripts?.start ? [{id:entry.name, directory, pkg}] : [];
    }).sort((a,b) => a.id.localeCompare(b.id));
}
function environment(app, mode) {
  const file = path.join(app.directory, mode === 'dev' ? '.env.development' : '.env');
  let local = {};
  if (fs.existsSync(file)) {
    try { local = parseEnv(fs.readFileSync(file, 'utf8')); }
    catch { throw new Error(`${app.id}: ${path.basename(file)} 无法解析`); }
  }
  const env = {...process.env};
  // Each backend owns its port, route and save directory; a shell-level PORT must not collide across apps.
  for (const key of ['PORT','BASE_PATH','DATA_DIR']) delete env[key];
  Object.assign(env, local);
  const metadata = app.pkg.miniapp || {};
  env.PORT ||= metadata.port ? String(metadata.port) : undefined;
  env.BASE_PATH ??= metadata.basePath;
  for (const key of Object.keys(env)) if (env[key] === undefined) delete env[key];
  const host = env.HOST || '127.0.0.1', port = env.PORT ? Number(env.PORT) : null;
  if (port !== null && (!Number.isInteger(port) || port < 1 || port > 65535)) throw new Error(`${app.id}: PORT 必须为 1–65535`);
  const basePath = (env.BASE_PATH || '').replace(/\/$/, '');
  const healthPath = metadata.healthPath ? basePath + metadata.healthPath : null;
  if (healthPath && (!healthPath.startsWith('/') || /[\r\n]/.test(healthPath))) throw new Error(`${app.id}: healthPath 必须为 HTTP 路径`);
  return {env, host, port, healthPath};
}
function available(host, port) {
  if (!port) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', error => reject(new Error(error.code === 'EADDRINUSE' ? `端口 ${host}:${port} 已被占用` : `端口检查失败：${error.code}`)));
    server.listen({host, port, exclusive:true}, () => server.close(resolve));
  });
}
function probe(config, timeout) {
  const hostname = ['0.0.0.0','::'].includes(config.host) ? (config.host === '::' ? '::1' : '127.0.0.1') : config.host;
  return new Promise((resolve, reject) => {
    const request = http.get({hostname, port:config.port, path:config.healthPath}, response => {
      response.resume();
      response.once('end', () => response.statusCode >= 200 && response.statusCode < 300 ? resolve() : reject(new Error(`健康检查 HTTP ${response.statusCode}`)));
      response.once('error', reject);
    });
    request.setTimeout(timeout, () => request.destroy(new Error('健康检查超时')));
    request.once('error', reject);
  });
}

class Supervisor {
  constructor(root, options = {}) {
    this.root = path.resolve(root);
    this.options = {mode:'start', restartDelay:1000, restartWindow:60000, maxRestarts:5,
      healthInterval:5000, healthTimeout:2000, startupTimeout:60000, stopTimeout:5000, logLimit:10*1024*1024, ...options};
    this.runtime = options.runtime || path.join(this.root, '.runtime');
    this.token = crypto.randomBytes(32).toString('hex');
    this.startedAt = new Date().toISOString();
    this.closing = false;
    this.queue = Promise.resolve();
    this.apps = discover(this.root).map(app => ({...app, state:'stopped', desired:false, generation:0,
      child:null, restarts:0, failures:[], failedChecks:0, lastError:null, lastExit:null}));
  }
  snapshot() {
    return {pid:process.pid, mode:this.options.mode, startedAt:this.startedAt, updatedAt:new Date().toISOString(), stopping:this.closing,
      apps:this.apps.map(app => ({id:app.id, state:app.state, pid:app.child?.pid || null, port:app.config?.port || null,
        health:app.config?.healthPath ? app.health || 'pending' : 'process-only', restarts:app.restarts,
        startedAt:app.startedAt || null, lastExit:app.lastExit, lastError:app.lastError, log:path.join(this.runtime,'logs',`${app.id}.log`)}))};
  }
  publish() { writeJson(path.join(this.runtime,'status.json'), this.snapshot()); }
  log(app, message) {
    const line = `[${new Date().toISOString()}] [${app.id}] ${message.trimEnd()}\n`;
    const file = path.join(this.runtime,'logs',`${app.id}.log`);
    if (fs.existsSync(file) && fs.statSync(file).size + Buffer.byteLength(line) > this.options.logLimit) {
      fs.rmSync(file + '.1', {force:true}); fs.renameSync(file, file + '.1');
    }
    fs.appendFileSync(file, line, {mode:0o600});
    if (!this.options.quiet) process.stdout.write(line);
  }
  state(app, value) {
    if (app.state !== value) { app.state = value; this.log(app, `状态：${value}${app.lastError ? ' · ' + app.lastError : ''}`); }
    this.publish();
  }
  async start() {
    if (!this.apps.length) throw new Error('没有发现含 scripts.start 的小程序 package.json');
    fs.mkdirSync(path.join(this.runtime,'logs'), {recursive:true, mode:0o700});
    const lockFile = path.join(this.runtime,'manager.lock');
    try {
      this.lock = fs.openSync(lockFile,'wx',0o600);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let owner;
      try { owner = JSON.parse(fs.readFileSync(lockFile,'utf8')); } catch { throw new Error('管理器锁文件无效，请先检查 .runtime/manager.lock'); }
      if (!Number.isInteger(owner.pid) || alive(owner.pid)) throw new Error('管理器已经运行，请使用 status、restart 或 stop 命令');
      fs.rmSync(lockFile); this.lock = fs.openSync(lockFile,'wx',0o600);
    }
    fs.writeFileSync(this.lock, JSON.stringify({pid:process.pid,token:this.token}));
    try {
      this.server = net.createServer(socket => this.receive(socket));
      await new Promise((resolve,reject) => {
        this.server.once('error',reject); this.server.listen(0,'127.0.0.1',resolve);
      });
      writeJson(path.join(this.runtime,'control.json'), {pid:process.pid,port:this.server.address().port,token:this.token});
      this.publish();
      this.interval = setInterval(() => { for (const app of this.apps) void this.check(app); }, this.options.healthInterval);
      for (const app of this.apps) { app.desired = true; void this.launch(app); }
    } catch (error) { await this.shutdown(); throw error; }
    return this;
  }
  receive(socket) {
    socket.setEncoding('utf8'); socket.setTimeout(15000, () => socket.destroy());
    let input = '', handled = false;
    socket.on('error', () => {});
    socket.on('data', chunk => {
      input += chunk;
      if (Buffer.byteLength(input) > 4096) return socket.destroy();
      if (handled || !input.includes('\n')) return;
      handled = true;
      let request;
      try { request = JSON.parse(input.split('\n')[0]); } catch { return socket.end(JSON.stringify({ok:false,error:'请求格式错误'})+'\n'); }
      if (request.token !== this.token) return socket.end(JSON.stringify({ok:false,error:'管理器身份不匹配'})+'\n');
      const work = this.queue.then(() => this.command(request.action,request.id));
      this.queue = work.catch(() => {});
      work.then(status => {
        socket.end(JSON.stringify({ok:true,status})+'\n');
        if (request.action === 'stop' && !request.id) setImmediate(() => void this.shutdown());
      }, error => socket.end(JSON.stringify({ok:false,error:error.message})+'\n'));
    });
  }
  async command(action, id) {
    if (action === 'status') return this.snapshot();
    if (!['start','stop','restart'].includes(action)) throw new Error('不支持的管理命令');
    if (this.closing) throw new Error('管理器正在关闭');
    if (action === 'stop' && !id) {
      this.closing = true; clearInterval(this.interval);
      await this.stopAll(); return this.snapshot();
    }
    const targets = !id || id === 'all' ? this.apps : this.apps.filter(app => app.id === id);
    if (!targets.length) throw new Error(`未知小程序：${id}`);
    await Promise.all(targets.map(async app => {
      if (action !== 'start') await this.stop(app);
      if (action !== 'stop') {
        if (action === 'restart' || app.state === 'failed') app.failures = [];
        app.desired = true; void this.launch(app);
      }
    }));
    return this.snapshot();
  }
  async launch(app) {
    if (this.closing || !app.desired || app.child || app.launching || app.restartTimer) return;
    app.launching = true;
    const generation = ++app.generation;
    const current = () => generation === app.generation && app.desired && !this.closing;
    try {
      app.lastError = null; app.health = 'pending'; app.failedChecks = 0;
      this.state(app,'starting');
      app.config = environment(app,this.options.mode);
      if (!app.pkg.scripts[this.options.mode]) throw new Error(`缺少 scripts.${this.options.mode}`);
      await available(app.config.host, app.config.port);
      if (!current()) return;
      // Existing output may belong to older source. Rebuild on every launch, including crash recovery.
      if (this.options.mode === 'start' && app.pkg.scripts.build) {
        this.state(app,'building');
        const result = await this.child(app,'build',generation).closed;
        if (!current()) return;
        if (result.code !== 0) throw new Error(`构建失败：${result.signal || result.code || result.error}`);
      }
      if (!current()) return;
      app.startedAt = new Date().toISOString(); app.startedMs = Date.now();
      this.state(app,app.config.port && app.config.healthPath ? 'starting' : 'running');
      this.child(app,this.options.mode,generation);
    } catch (error) {
      if (current()) { app.lastError = error.message; this.state(app,'failed'); }
    } finally {
      app.launching = false;
      // A restart may arrive while the old launch is still checking its port or building.
      if (generation !== app.generation && app.desired && !this.closing && !app.child && !app.restartTimer) void this.launch(app);
    }
  }
  child(app, script, generation) {
    const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm',['run',script], {
      cwd:app.directory, env:app.config.env, detached:process.platform !== 'win32',
      shell:process.platform === 'win32', windowsHide:true, stdio:['ignore','pipe','pipe']
    });
    app.child = child;
    app.phase = script === 'build' ? 'build' : 'serve';
    this.publish();
    for (const [stream,label] of [[child.stdout,'stdout'],[child.stderr,'stderr']]) {
      let pending = '';
      stream.setEncoding('utf8');
      stream.on('data', chunk => {
        pending += chunk; const lines = pending.split('\n'); pending = lines.pop();
        for (const line of lines) if (line) this.log(app,`${label}: ${line}`);
        if (pending.length > 8192) { this.log(app,`${label}: ${pending}`); pending = ''; }
      });
      stream.on('end', () => { if (pending) this.log(app,`${label}: ${pending}`); });
    }
    let spawnError;
    child.once('error', error => { spawnError = error.code || error.name; });
    child.once('exit', () => {
      // If npm itself crashes, its server/watch descendants can otherwise retain the port and pipes.
      if (process.platform !== 'win32' && child.pid) {
        try { process.kill(-child.pid,'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') this.log(app,`进程组清理：${error.code}`); }
        const cleanup = setTimeout(() => {
          if (alive(-child.pid)) { try { process.kill(-child.pid,'SIGKILL'); } catch {} }
        },this.options.stopTimeout);
        cleanup.unref();
      }
    });
    child.closed = new Promise(resolve => child.once('close',(code,signal) => {
      const result = {code,signal,error:spawnError || null,at:new Date().toISOString()};
      if (app.child === child) app.child = null;
      app.lastExit = result;
      if (generation === app.generation && app.desired && !this.closing && script !== 'build') {
        app.lastError = spawnError ? `无法启动 npm：${spawnError}` : `进程退出：${signal || code}`;
        this.retry(app);
      } else this.publish();
      resolve(result);
    }));
    return child;
  }
  retry(app) {
    if (!app.desired || this.closing) return;
    app.failures = app.failures.filter(time => Date.now()-time < this.options.restartWindow);
    app.failures.push(Date.now());
    if (app.failures.length > this.options.maxRestarts) return this.state(app,'failed');
    const wait = Math.min(this.options.restartDelay * 2**(app.failures.length-1),30000);
    app.restarts++;
    this.state(app,'restarting');
    this.log(app,`${wait}ms 后自动重启；窗口内第 ${app.failures.length} 次失败`);
    app.restartTimer = setTimeout(() => { app.restartTimer = null; void this.launch(app); },wait);
  }
  async check(app) {
    if (this.closing || !app.child || app.phase !== 'serve' || app.checking || !app.config.port || !app.config.healthPath) return;
    app.checking = true;
    const generation = app.generation;
    try {
      await probe(app.config,this.options.healthTimeout);
      if (generation !== app.generation || !app.child) return;
      app.health = 'healthy'; app.failedChecks = 0; app.lastError = null;
      this.state(app,'running');
    } catch (error) {
      if (generation !== app.generation || !app.child || !app.desired) return;
      app.failedChecks++;
      const readyFailed = app.health === 'healthy' && app.failedChecks >= 3;
      const startupFailed = app.health !== 'healthy' && Date.now()-app.startedMs >= this.options.startupTimeout;
      if (readyFailed || startupFailed) {
        app.health = 'unhealthy'; app.lastError = error.message; this.state(app,'unhealthy');
        const work = this.queue.then(async () => {
          if (generation !== app.generation || !app.desired || this.closing) return;
          await this.stop(app); app.desired = true; app.lastError = error.message; this.retry(app);
        });
        this.queue = work.catch(() => {});
      }
    } finally { app.checking = false; }
  }
  async stop(app) {
    app.desired = false; app.generation++;
    clearTimeout(app.restartTimer); app.restartTimer = null;
    const child = app.child;
    if (child?.pid) {
      this.state(app,'stopping');
      if (process.platform === 'win32') {
        await new Promise(resolve => {
          const killer = spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
          killer.once('error',resolve); killer.once('close',resolve);
        });
      } else {
        try { process.kill(-child.pid,'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
        const deadline = Date.now()+this.options.stopTimeout;
        while (alive(-child.pid) && Date.now() < deadline) await delay(50);
        if (alive(-child.pid)) { try { process.kill(-child.pid,'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; } }
      }
      await Promise.race([child.closed,delay(1000)]);
    }
    app.child = null; app.health = 'stopped';
    this.state(app,'stopped');
  }
  async stopAll() { await Promise.all(this.apps.map(app => this.stop(app))); }
  async shutdown() {
    if (this.shutdownPromise) return this.shutdownPromise;
    this.closing = true; clearInterval(this.interval);
    this.shutdownPromise = (async () => {
      await this.stopAll();
      if (this.server?.listening) await new Promise(resolve => this.server.close(resolve));
      if (this.lock !== undefined) {
        fs.closeSync(this.lock); this.lock = undefined;
        fs.rmSync(path.join(this.runtime,'control.json'),{force:true});
        fs.rmSync(path.join(this.runtime,'manager.lock'),{force:true});
      }
      this.publish();
    })();
    return this.shutdownPromise;
  }
}

function control(runtime, action, id) {
  let owner;
  try { owner = JSON.parse(fs.readFileSync(path.join(runtime,'control.json'),'utf8')); }
  catch { return Promise.reject(new Error('管理器未运行，请先执行 node start-all.js')); }
  return new Promise((resolve,reject) => {
    const socket = net.createConnection({host:'127.0.0.1',port:owner.port});
    socket.setEncoding('utf8'); socket.setTimeout(15000, () => socket.destroy(new Error('管理命令超时')));
    socket.once('connect', () => socket.write(JSON.stringify({token:owner.token,action,id})+'\n'));
    let response = '';
    socket.on('data', chunk => { response += chunk; if (response.length > 1024*1024) socket.destroy(new Error('管理器返回过大')); });
    socket.once('error', () => reject(new Error('无法连接管理器，请检查启动终端')));
    socket.once('end', () => {
      try { const result = JSON.parse(response); if (!result.ok) throw new Error(result.error); resolve(result.status); }
      catch (error) { reject(error); }
    });
  });
}
function printStatus(status) {
  console.log(`管理器 PID ${status.pid} · ${status.mode} · ${status.stopping ? '关闭中' : '运行中'}`);
  console.table(status.apps.map(app => ({小程序:app.id,状态:app.state,PID:app.pid||'-',端口:app.port||'-',健康:app.health,重启次数:app.restarts,原因:app.lastError||'-'})));
}
async function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('node start-all.js [--dev] [--build]\nnode start-all.js status [--json]\nnode start-all.js restart [小程序ID|all]\nnode start-all.js stop [小程序ID]\nnode start-all.js start 小程序ID\n\n默认每次启动前重新构建，并在前台同时启动全部后端；Ctrl+C 停止所有子进程。\n--build 保留兼容，默认已启用构建；--dev 由各应用 dev 脚本负责构建与监听。'); return;
  }
  const options = args.filter(value => value.startsWith('--'));
  if (options.some(value => !['--dev','--build','--json'].includes(value))) throw new Error('未知选项，请使用 --help');
  const [action='run',id,...extra] = args.filter(value => !value.startsWith('--'));
  if (extra.length || !['run','start','status','stop','restart'].includes(action)) throw new Error('未知命令，请使用 --help');
  const runtime = path.join(__dirname,'.runtime');
  if (action === 'run' || (action === 'start' && !id)) {
    const supervisor = new Supervisor(__dirname,{mode:args.includes('--dev')?'dev':'start'});
    await supervisor.start();
    const shutdown = () => { void supervisor.shutdown().catch(error => { console.error(error.message); process.exitCode = 1; }); };
    process.on('SIGINT',shutdown); process.on('SIGTERM',shutdown);
    console.log('全部小程序正在启动。另开终端使用 status / restart / stop 管理；Ctrl+C 退出。');
    return;
  }
  const status = await control(runtime,action,id);
  if (args.includes('--json')) console.log(JSON.stringify(status,null,2)); else printStatus(status);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = {Supervisor,discover,environment,control,main};
