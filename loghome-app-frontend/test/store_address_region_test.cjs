const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Vue = require('../../loghome-manage/node_modules/vue');
const root = path.resolve(__dirname, '..');
const sourceRegions = require('../common/address-regions/pca-code.json');
const helperSource = fs.readFileSync(path.join(root, 'common/address-region-picker.js'), 'utf8').replace(/^import[\s\S]*?from ['"][^'"]+['"];?\s*$/gm, '').replace(/export function/g, 'function');
const helpers = vm.runInNewContext(helperSource + '; ({ createRegionOptions, getRegionPickerState, findRegionIndices })', { sourceRegions });
const { createRegionOptions, getRegionPickerState, findRegionIndices } = helpers;
let response;
const writes = [];
const axios = {
  get() { return Promise.resolve({ data: { code: 200, data: response } }); },
  post(url, payload) { writes.push({ method: 'post', url, payload }); return Promise.resolve({ data: { code: 200 } }); },
  put(url, payload) { writes.push({ method: 'put', url, payload }); return Promise.resolve({ data: { code: 200 } }); },
};
const source = fs.readFileSync(path.join(root, 'pages/store/address_form.vue'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import[\s\S]*?from ['"][^'"]+['"];?\s*$/gm, '').replace('export default', 'const component =');
const options = vm.runInNewContext(source + '; component', {
  ...helpers, axios, darkModeMixin: {}, setTimeout() {},
  window: { localStorage: { getItem: () => JSON.stringify({ tk: 'fixture-only' }) } },
  uni: { showToast() {}, stopPullDownRefresh() {}, navigateBack() {} },
});
const plain = value => JSON.parse(JSON.stringify(value));
const tick = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Vue.nextTick(); };
(async () => {
  const tree = createRegionOptions();
  assert.equal(tree.length, 31);
  for (let p = 0; p < tree.length; p++) {
    for (let c = 0; c < tree[p].children.length; c++) {
      const state = getRegionPickerState(tree, [p, c, 0]);
      assert(state.columns.every(column => column.length > 0));
      assert(state.names.every(Boolean));
    }
  }
  for (const province of ['北京市', '天津市', '上海市', '重庆市']) {
    const row = tree.find(row => row.name === province);
    assert.equal(row.children.length, 1); assert.equal(row.children[0].name, province);
  }
  assert(tree.find(row => row.name === '重庆市').children[0].children.includes('巫溪县'));
  assert.deepEqual(plain(getRegionPickerState(tree, [-1, 999, NaN]).indices), [0, 0, 0]);
  const page = new Vue(options); page.$baseUrl = 'fixture://backend'; page.authToken = 'fixture-only';
  assert.equal(page.regionDisplay, '请选择省市区'); assert(page.regionColumns.every(column => column.length));
  const shenzhen = findRegionIndices(tree, ['广东省', '深圳市', '南山区']);
  page.onRegionColumnChange({ detail: { column: 0, value: shenzhen[0] } });
  assert.deepEqual(plain(page.regionIndices), [shenzhen[0], 0, 0]);
  page.onRegionColumnChange({ detail: { column: 1, value: shenzhen[1] } });
  page.onRegionColumnChange({ detail: { column: 2, value: shenzhen[2] } });
  assert.equal(page.region.length, 0); assert.equal(page.form.province, '');
  page.resetRegionPicker(); assert.deepEqual(plain(page.regionIndices), [0, 0, 0]); assert.equal(page.region.length, 0);
  page.onRegionChange({ detail: { value: shenzhen } });
  assert.deepEqual(plain(page.region), ['广东省', '深圳市', '南山区']);
  assert.equal(page.form.province, '广东省'); assert.equal(page.form.city, '深圳市'); assert.equal(page.form.district, '南山区');
  page.onRegionColumnChange({ detail: { column: 0, value: 0 } }); page.resetRegionPicker();
  assert.deepEqual(plain(page.regionIndices), plain(shenzhen)); assert.equal(page.form.city, '深圳市');
  // Programmatic columnchange events from the H5 picker must not erase a restored district.
  page.onRegionColumnChange({ detail: { column: 0, value: shenzhen[0] } });
  assert.deepEqual(plain(page.regionIndices), plain(shenzhen));
  page.form.receiver_name = '示例收货人'; page.form.receiver_phone = '13800000000'; page.form.detail = '示例路 1 号';
  page.saveAddress(); await tick(); assert.equal(writes[0].method, 'post'); assert.equal(writes[0].payload.district, '南山区');
  response = { receiver_name: '示例收货人', receiver_phone: '13800000000', detail: '示例路 1 号', province: '上海市', city: '上海市', district: '徐汇区', is_default: 1 };
  page.addressId = 7; page.fetchAddressDetail(); await tick();
  assert.deepEqual(plain(getRegionPickerState(page.regionOptions, page.regionIndices).names), ['上海市', '上海市', '徐汇区']);
  assert.equal(page.form.is_default, true); page.saveAddress(); await tick(); assert.equal(writes[1].method, 'put'); assert.equal(writes[1].payload.city, '上海市');
  const oldAddress = ['上海市', '上海市', '历史片区'];
  const legacy = createRegionOptions(oldAddress);
  assert.deepEqual(plain(getRegionPickerState(legacy, findRegionIndices(legacy, oldAddress)).names), oldAddress);
  assert(!createRegionOptions().find(row => row.name === '上海市').children[0].children.includes('历史片区'));
  assert.deepEqual(plain(getRegionPickerState(tree, findRegionIndices(tree, ['上海市', '市辖区', '徐汇区'])).names), ['上海市', '上海市', '徐汇区']);
  page.$destroy();
  console.log('PASS nonempty province/city/district data, municipalities, linked reset, confirm/cancel, edit backfill, legacy names, programmatic events and saved payloads');
})().catch(error => { console.error(error); process.exitCode = 1; });
