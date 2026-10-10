const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Vue = require('vue');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'pages/apps/logDefense.vue'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/import[\s\S]*?from ['"][^'"]+['"]\s*/g, '')
  .replace('export default', 'this.component =');
const config = fs.readFileSync(path.join(root, 'common/game/village-data.js'), 'utf8').replace(/export /g, '');
const icons = fs.readFileSync(path.join(root, 'common/game/defense-icons.js'), 'utf8').replace(/export /g, '');
const fixedNow = new Date(2026, 9, 11, 12).getTime();
class TestDate extends Date {
  constructor(...args) { super(...(args.length ? args : [fixedNow])); }
  static now() { return fixedNow; }
}
function fixture(saved) {
  const storage = new Map(saved ? [['LogHomeVillage', JSON.stringify(saved)]] : []);
  const sandbox = {
    darkModeMixin: {}, Date: TestDate, console,
    window: { localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) } },
    uni: { showToast() {}, showModal(o) { o.success?.({ confirm: true }); } }
  };
  vm.runInNewContext(config + '\n' + icons + '\n' + script + '\nthis.config = { BUILDINGS, RESOURCES, CRAFT_RECIPES, RAID_WAVES, TRADER };', sandbox);
  const game = new Vue({ ...sandbox.component,
    beforeCreate() { this.$i18n = { locale: 'zh-CN' }; this.$t = k => k; }
  });
  return { game, component: sandbox.component, config: sandbox.config, storage };
}
function plot(type, level = 1, extras = {}) {
  return { type, level, dur: 100, workers: 0, crew: [], buf: {}, busy: null, ...extras };
}
function villager(id) {
  return { id, name: '村民' + id, hp: 100, satiety: 100, mood: 80, equip: [null, null, null], dur: {}, tracks: { labor: 0, tech: 0, guard: 0 } };
}

test('legacy saves with assigned workers migrate without hanging and retain staffing', () => {
  const plots = Array(9).fill(null); plots[0] = plot('lumber', 1, { workers: 1 });
  delete plots[0].crew;
  const { game } = fixture({ baseLevel: 2, plots, villagers: [villager(1)], resources: { log: 30 }, startVillagerGranted: true });
  game.loadState();
  assert.equal(game.plots[0].workers, 1);
  assert.equal(game.plots[0].crew[0], 1);
  assert.equal(game.villagers[0].tracks.labor, 0);
});

test('crew migration bounds malformed counts and does not assign one villager twice', () => {
  const { game } = fixture(); game.villagers = [villager(1), villager(2)];
  game.plots[0] = plot('lumber', 1, { workers: 999999 });
  game.plots[1] = plot('farm', 1, { workers: 1 });
  game.syncCrew();
  const crew = game.plots.filter(Boolean).flatMap(p => p.crew);
  assert.equal(crew.length, 2); assert.equal(new Set(crew).size, 2);
});

test('queued jobs wait until a builder becomes free, then start with a completion deadline', () => {
  const { game } = fixture(); game.baseLevel = 1;
  game.plots[0] = plot('lumber', 1, { busy: { to: 2, end: fixedNow - 1 } });
  game.plots[1] = plot('farm', 1, { busy: { to: 1, end: 0, queued: true } });
  game.buildQueue = [{ kind: 'building', layer: 'ground', idx: 1, to: 1, dur: 60, cost: {} }];
  game.checkBuilds();
  assert.equal(game.plots[0].level, 2);
  assert.equal(game.buildQueue.length, 0);
  assert.equal(game.plots[1].busy.end, fixedNow + 60000);
  assert.equal(game.plots[1].busy.queued, undefined);
});

test('cancelling a queued expansion releases reserved tiles and returns paid materials', () => {
  const { game } = fixture(); game.baseLevel = 5; game.resources = { log: 20 };
  game.plots[0] = plot('lumber', 4, { busy: { to: 5, end: 0, queued: true } });
  game.plots[1] = { extOf: 0, extType: 'lumber' };
  game.buildQueue = [{ kind: 'building', layer: 'ground', idx: 0, to: 5, dur: 60, cost: { log: 30 } }];
  game.cancelQueue(0);
  assert.equal(game.plots[0].level, 4); assert.equal(game.plots[0].busy, null);
  assert.equal(game.plots[1], null); assert.equal(game.floorRes('log'), 50);
});

test('stored buildings retain level, damage and stock and can be placed with their footprint', () => {
  const { game } = fixture(); game.baseLevel = 5; game.selIdx = 0; game.selLayer = 'ground';
  game.plots[0] = plot('lumber', 5, { dur: 60, buf: { log: 25 } });
  game.plots[1] = { extOf: 0, extType: 'lumber' };
  game.storeSel();
  assert.equal(game.plots[0], null); assert.equal(game.plots[1], null);
  assert.equal(game.stored[0].dur, 60); assert.equal(game.stored[0].buf.log, 25);
  game.startPlace(0); game.placeAt(6);
  assert.equal(game.stored.length, 0); assert.equal(game.plots[6].level, 5);
  assert.equal(game.plots[6].dur, 60); assert.equal(game.plots[6].buf.log, 25);
  assert.equal(game.plots.filter(p => p && p.extOf === 6).length, 1);
});

test('crafting spends inputs once and refuses a second craft without materials', () => {
  const { game } = fixture(); game.baseLevel = 2; game.resources = { log: 1 };
  game.doCraft(game.craftList.find(r => r.id === 'plank'));
  assert.equal(game.floorRes('log'), 0); assert.equal(game.floorRes('plank'), 4);
  game.doCraft(game.craftList.find(r => r.id === 'plank'));
  assert.equal(game.floorRes('plank'), 4);
});

test('challenge mode opens, closes and resumes the same progress', () => {
  const { game } = fixture(); game.baseLevel = 7; game.optInWave();
  assert.equal(game.raidWave.on, true); assert.equal(game.raidWave.done, 0);
  const key = game.raidWave.key; const boss = game.raidWave.bossName;
  game.closeWave(); assert.equal(game.raidWave.on, false);
  game.optInWave(); assert.equal(game.raidWave.on, true);
  assert.equal(game.raidWave.key, key); assert.equal(game.raidWave.bossName, boss);
});

test('new resources and buildings use existing pixel assets', () => {
  const { game, config } = fixture();
  for (const key of [...Object.keys(config.RESOURCES), ...config.BUILDINGS.map(b => b.key)]) {
    assert.ok(fs.existsSync(path.join(root, game.gameIcon(key))), key);
  }
});

test('queued materials are fully restored when storage filled during the wait', () => {
  const { game } = fixture(); game.baseLevel = 1;
  game.resources = { plank: game.whSlotsTotal * 64 };
  assert.equal(game.addRoom('log'), 0);
  game.plots[0] = plot('lumber', 1, { busy: { to: 1, end: 0, queued: true } });
  game.buildQueue = [{ kind: 'building', layer: 'ground', idx: 0, to: 1, dur: 60, cost: { log: 30 } }];
  game.cancelQueue(0);
  assert.equal(game.floorRes('log'), 30); assert.equal(game.plots[0], null);
});

test('preserved toolbar and all feature panels render against the integrated game state', () => {
  const compiler = require('vue/compiler-sfc');
  const parsed = compiler.parse({ source, filename: 'logDefense.vue' });
  const compiled = compiler.compileTemplate({ source: parsed.template.content, filename: 'logDefense.vue' });
  assert.equal(compiled.errors.length, 0);
  const render = new Function(compiled.code + ';return render;')();
  const { game } = fixture(); game.baseLevel = 5; game.villagers = [villager(1)];
  game.plots[0] = plot('lumber'); game.resources = { log: 100, plank: 100, wheat: 10, emerald: 10 };
  game.$options.render = render; game.$options.staticRenderFns = [];
  const errors = []; const previousHandler = Vue.config.warnHandler;
  Vue.config.warnHandler = message => errors.push(message);
  try {
    game._render();
    for (const flag of ['warehouseOpen', 'villOpen', 'feedOpen', 'heroOpen', 'expOpen', 'craftOpen', 'equipOpen', 'foodOpen', 'blOpen', 'frOpen', 'raidOpen', 'fvOpen', 'fmOpen', 'mktOpen', 'devOpen', 'flogOpen']) {
      game[flag] = true; game._render(); game[flag] = false;
    }
    game.buildIdx = 1; game._render(); game.buildIdx = null;
    game.wallSel = 0; game._render(); game.wallSel = null;
    game.selIdx = 0; game._render();
  } finally { Vue.config.warnHandler = previousHandler; }
  assert.deepEqual(errors, []);
});
