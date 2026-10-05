const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const text = fs.readFileSync(path.join(__dirname, '../pages/community/postEdit.vue'), 'utf8');
const source = text.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/^\s*import .*$/gm, '').replace('export default', 'module.exports =');
let request, navigation, opens = 0, closes = 0;
const context = {
  module: { exports: {} },
  axios: { get: (...args) => request(...args) },
  window: { localStorage: { getItem: () => '{"tk":"fixture"}' } },
  uni: { navigateTo: options => { navigation = options; }, showToast() {} },
  TaskRewardModal: {}, darkModeMixin: {},
  console: { error() {} },
};
vm.runInNewContext(source, context);
const component = context.module.exports;
const page = Object.assign(component.data(), component.methods, {
  $baseUrl: 'https://fixture.invalid',
  $refs: { circlePopup: { open: () => opens++, close: () => closes++ } },
  $nextTick: callback => callback(),
});
(async () => {
  page.postData.title = '保留标题';
  page.postData.content = '保留正文';
  page.postData.media_urls = ['existing-image'];
  const draft = JSON.stringify(page.postData);
  let resolve;
  let requests = 0;
  request = () => { requests++; return new Promise(r => { resolve = r; }); };
  const loading = page.loadCircles();
  assert.equal(page.circlesLoading, true);
  await page.loadCircles();
  assert.equal(requests, 1);
  resolve({ data: [] });
  await loading;
  assert.equal(page.circlesLoading, false);
  assert.equal(page.circlesError, false);
  assert.equal(page.circles.length, 0);
  page.discoverCircles();
  assert.equal(navigation.url, '/pages/community/circles');
  assert.equal(closes, 1);
  assert.equal(JSON.stringify(page.postData), draft);
  const circle = { circle_id: 9, name: '新加入的圈子' };
  request = async () => ({ data: [circle] });
  component.onShow.call(page);
  await new Promise(r => setImmediate(r));
  assert.equal(page.returningFromCircleDiscovery, false);
  assert.equal(opens, 1);
  assert.equal(page.circles[0], circle);
  assert.equal(JSON.stringify(page.postData), draft);
  let banChecked;
  page.checkCircleBanStatus = id => { banChecked = id; };
  page.selectCircle(circle);
  assert.equal(page.selectedCircle, circle);
  assert.equal(page.postData.circle_id, 9);
  assert.equal(banChecked, 9);
  assert.equal(closes, 2);
  request = async () => { throw Error('offline'); };
  await page.loadCircles();
  assert.equal(page.circlesError, true);
  assert.equal(page.circlesLoading, false);
  request = async () => ({ data: [circle] });
  await page.loadCircles();
  assert.equal(page.circlesError, false);
  assert.equal(closes, 2, 'refresh must not dismiss the popup');
  request = async () => ({ data: { error: 'malformed' } });
  await page.loadCircles();
  assert.equal(page.circlesError, true, 'bad responses must not appear as an empty membership list');
  page.discoverCircles();
  navigation.fail();
  assert.equal(page.returningFromCircleDiscovery, false);
  assert.equal(opens, 2);
  console.log('PASS circle picker: empty/loading/error/retry, join-and-return draft preservation, selection and navigation failure');
})().catch(error => { console.error(error); process.exitCode = 1; });
