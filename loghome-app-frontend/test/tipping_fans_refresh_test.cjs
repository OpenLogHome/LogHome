const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue/compiler-sfc');
const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
function setup(post, message = '') {
  const module = { exports: {} };
  const script = compiler.parse({ source: read('components/tipping/tippingBar.vue'), filename: 'tippingBar.vue' }).script.content;
  vm.runInNewContext(script.replace(/^\s*import .*$/gm, '').replace('export default', 'module.exports ='), {
    module, axios: { post }, darkModeMixin: {}, console: { log() {} }, uni: { showToast() {} },
    window: { localStorage: { getItem: () => JSON.stringify({ id: 1, tk: 'test' }) } }
  });
  const events = [];
  const context = { ...module.exports.methods, $baseUrl: '', novel_id: 26, resources: { log: 100 },
    selectedTippingItem: { item_name: 'gift', item_cost: 5, is_log_free: 0 }, tippingAmount: 1,
    tippingMessage: message, $emit: (...args) => events.push(args), refreshResources() {} };
  return { context, events };
}
test('successful tip emits refresh after contribution message is saved', async () => {
  let save;
  const { context, events } = setup(url => url.endsWith('/tipping') ? Promise.resolve({}) : new Promise(resolve => { save = resolve; }), '新留言');
  const pending = context.tipping();
  await Promise.resolve();
  assert.equal(events.length, 0);
  save({});
  await pending;
  assert.equal(events[0][0], 'tip');
  assert.equal(events[0][1].message, '新留言');
});
test('successful tip without message refreshes immediately', async () => {
  const { context, events } = setup(async () => ({}));
  await context.tipping();
  assert.equal(events.length, 1);
});
test('failed message save still refreshes a successful paid contribution', async () => {
  const { context, events } = setup(url => url.endsWith('/tipping') ? Promise.resolve({}) : Promise.reject(new Error('save failed')), '留言');
  await context.tipping();
  assert.equal(events.length, 1);
});
test('failed payment does not emit a successful contribution event', async () => {
  const { context, events } = setup(async () => { throw new Error('payment failed'); });
  await context.tipping();
  assert.equal(events.length, 0);
});
for (const file of ['pages/readers/bookInfo.vue', 'pages/worlds/worldPage.vue']) {
  test(`${file} refreshes fans before the gift animation timer`, () => {
    const source = read(file);
    const match = source.match(/^(\t+)runGiftAnimation\(ev\) \{([\s\S]*?)^\1\},/m);
    assert.ok(match);
    const order = [];
    const callback = vm.runInNewContext(`(function(ev) {${match[2]}})`, { setTimeout: () => order.push('animation') });
    callback.call({ getFansStatistics: () => order.push('refresh') }, { img_url: 'gift.png' });
    assert.deepEqual(order, ['refresh', 'animation']);
  });
}
test('changed templates compile', () => {
  for (const file of ['components/tipping/tippingBar.vue', 'pages/readers/bookInfo.vue', 'pages/worlds/worldPage.vue']) {
    const parsed = compiler.parse({ source: read(file), filename: file });
    const result = compiler.compileTemplate({ source: parsed.template.content, filename: file, id: 'test' });
    assert.deepEqual(result.errors, []);
  }
});
