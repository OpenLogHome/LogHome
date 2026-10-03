// Run from the monorepo: node loghome-app-frontend/test/store_ux_test.cjs
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Vue = require('../../loghome-manage/node_modules/vue');
let token = null;
let navigation;

const requests = [];
const axios = {
  get(url, options) {
    if (url.includes('/resource/')) return Promise.resolve({ data: [{ log: 1000, cropped_log: 500 }] });
    return new Promise((resolve, reject) => requests.push({ url, options, resolve, reject }));
  },
};
function load(name) {
  const text = fs.readFileSync(path.join(__dirname, '../pages/store', name + '.vue'), 'utf8');
  const script = text.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'const component =');
  return vm.runInNewContext(script + '; component', {
    axios, darkModeMixin: {}, StoreVariantSheet: {}, StoreIcon: {},
    window: { localStorage: { getItem: () => token } },
    uni: { stopPullDownRefresh() {}, navigateTo(value) { navigation = value }, showToast() {} },
  });
}
const tick = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Vue.nextTick(); };
async function run() {
  const homeOptions = load('index');
  const home = new Vue(homeOptions);
  assert.equal(home.isLoggedIn, false);
  token = JSON.stringify({ tk: 'fixture-only' });
  homeOptions.onShow.call(home);
  assert.equal(home.isLoggedIn, true);
  home.refreshProducts(); const first = requests.shift();
  home.changeCategory('Minecraft'); const second = requests.shift();
  assert.equal(second.options.params.category, 'Minecraft');
  second.resolve({ data: { code: 200, data: { total: 2, list: [{ id: 2, title: 'Minecraft' }] } } }); await tick();
  first.resolve({ data: { code: 200, data: { total: 99, list: [{ id: 1, title: 'stale' }] } } }); await tick();
  assert.equal(home.products.length, 1); assert.equal(home.products[0].id, 2); assert.equal(home.total, 2);
  home.fetchProducts(2); requests.shift().reject(new Error('fixture network error')); await tick();
  assert.equal(home.page, 1); assert.equal(home.products.length, 1);
  home.fetchProducts(2); requests.shift().resolve({ data: { code: 200, data: { total: 2, list: [{ id: 3 }] } } }); await tick();
  assert.equal(home.page, 2); assert.equal(home.finished, true);
  console.log('PASS login return, server category filtering, stale-request protection and pagination retry');
  const product = { id: 1, type: 'physical', status: 'on', price: 336, stock: 999, has_variants: 1, variants: [{ id: 22, label: '30个', price: 816, stock: 999, status: 'on' }, { id: 23, label: '售罄', price: 100, stock: 0, status: 'on' }] };
  const detail = new Vue(load('detail')); detail.authToken = 'fixture-only'; detail.product = product; detail.productId = 1; detail.resources = { log: 1000, cropped_log: 500 };
  assert.equal(detail.actionDisabled, false); detail.goCheckout(); assert.equal(detail.variantSheetVisible, true);
  detail.chooseVariant(product.variants[0]); assert.equal(detail.displayPrice, 816); assert.equal(detail.displayStock, 999);
  detail.chooseVariant(product.variants[1]); assert.equal(detail.variantId, 22);
  detail.confirmVariant(); assert.equal(detail.variantSheetVisible, false); assert(navigation.url.endsWith('variant_id=22'));
  const checkout = new Vue(load('checkout')); checkout.authToken = 'fixture-only'; checkout.product = product; checkout.resources = { log: 1000, cropped_log: 500 }; checkout.address = { address_id: 1 }; checkout.variantExpanded = true;
  checkout.chooseVariant(product.variants[0]); assert.equal(checkout.variantExpanded, true); assert.equal(checkout.canSubmit, true); assert.equal(checkout.payCropped, 500); assert.equal(checkout.payLog, 316);
  assert.equal(checkout.needsVariant, false); assert(checkout.submitRequestId);
  const oldRequestId = checkout.submitRequestId;
  checkout.chooseVariant(product.variants[1]); assert.equal(checkout.variantId, 22); assert.equal(checkout.submitRequestId, oldRequestId);
  checkout.variantId = null; checkout.variantExpanded = false;
  assert.equal(checkout.submitDisabled, false); checkout.submitOrder(); assert.equal(checkout.variantExpanded, true); assert.equal(checkout.canSubmit, false);
  checkout.loadingProduct = true; assert.equal(checkout.submitDisabled, true); checkout.loadingProduct = false;
  detail.openVariantSheet(); const detailOptions = load('detail'); assert.equal(detailOptions.onBackPress.call(detail), true); assert.equal(detail.variantSheetVisible, false);
  detail.resources = { log: 0, cropped_log: 0 }; detail.openVariantSheet(); navigation = null; detail.confirmVariant(); assert.equal(detail.variantSheetVisible, true); assert.equal(navigation, null);
  console.log('PASS specification sheet, sold-out selection guard, checkout transfer, selected-price payment, missing-spec recovery, back dismissal and insufficient balance');
  home.$destroy(); detail.$destroy(); checkout.$destroy();
}
run().catch(error => { console.error(error); process.exitCode = 1; });
