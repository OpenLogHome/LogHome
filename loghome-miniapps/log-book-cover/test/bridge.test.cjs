const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
async function harness() {
  const sent = [], handlers = {}, styles = {};
  let saves = 0, backs = 0, fail = false;
  const parent = {postMessage:message => sent.push(message)};
  const window = {parent, __LOGHOME_COVER_CONFIG__:{parentOrigins:['https://m.loghome.ink']}, addEventListener:(type, fn) => {handlers[type] = fn;}};
  window.__loghomeCover = {save:async () => {saves++; if (fail) throw Error('disk full');}, back:async () => {backs++;}};
  const context = vm.createContext({window, Set, location:{hash:'#/'}, history:{}, document:{
    activeElement:{blur(){}}, documentElement:{style:{setProperty:(name, value) => {styles[name] = value;}}, classList:{toggle(){}}}
  }});
  const source = fs.readFileSync(path.join(__dirname, '../dist/bridge.js'), 'utf8')
    .replace("await import('./assets/index-DJH4ljDL.js')", 'await Promise.resolve()');
  await vm.runInContext('(async()=>{' + source + '\n})()', context);
  const emit = async (type, extra = {}, origin = 'https://m.loghome.ink', source = parent) => {
    handlers.message({source, origin, data:{namespace:'loghome-miniapp', version:1, type, ...extra}});
    await new Promise(resolve => setImmediate(resolve));
  };
  return {sent, emit, styles, get saves(){return saves;}, get backs(){return backs;}, fail:() => {fail = true;}};
}
test('container handshake rejects foreign sources and origins; saves before back/close and reports failures', async () => {
  const app = await harness();
  assert.equal(app.sent[0].type, 'ready');
  await app.emit('init', {}, 'https://evil.example');
  await app.emit('init', {}, 'https://m.loghome.ink', {});
  await app.emit('close', {requestId:'early'});
  assert.equal(app.sent.length, 1);
  await app.emit('init', {safeArea:{top:24, bottom:16}});
  assert.equal(app.sent.at(-1).type, 'loaded');
  assert.equal(app.styles['--safe-top'], '24px');
  await app.emit('back', {requestId:'back'});
  assert.equal(app.saves, 1); assert.equal(app.backs, 1);
  assert.equal(app.sent.at(-1).type, 'back-result');
  await app.emit('close', {requestId:'close'});
  assert.equal(app.saves, 2);
  assert.equal(app.sent.at(-1).type, 'close-ready');
  assert.equal(app.sent.at(-1).requestId, 'close');
  app.fail();
  await app.emit('close', {requestId:'failed'});
  assert.equal(app.sent.at(-1).type, 'close-failed');
});
test('registration adds app and lab entry once and preserves operator changes', async () => {
  const {register} = require('../../../loghome-backend/scripts/register-log-book-cover.cjs');
  const {validate} = require('../../../loghome-backend/bin/miniapps');
  const {validate:validateLab} = require('../../../loghome-backend/bin/lab');
  const apps = [], entries = [];
  const registry = {all:async () => apps, save:async app => {validate(app); apps.push(app); return app;}};
  const lab = {all:async () => entries, save:async entry => {validateLab(entry); entries.push(entry); return entry;}};
  await register(registry, lab, {});
  assert.equal(apps[0].name, '书籍封面生成器（高级版）');
  assert.equal(entries[0].miniappId, apps[0].id);
  apps[0].enabled = false; entries[0].name = '后台自定义名称';
  await register(registry, lab, {});
  assert.equal(apps.length, 1); assert.equal(entries.length, 1);
  assert.equal(apps[0].enabled, false); assert.equal(entries[0].name, '后台自定义名称');
});
