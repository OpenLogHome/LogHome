const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '../common/store-logistics.js'), 'utf8').replace('export async function', 'async function');
const { loadStoreLogistics } = vm.runInNewContext(source + ';({loadStoreLogistics})', { setTimeout, clearTimeout });
const parcel = { tracking_number: 'JT5529580581737', shipping_company_code: 'jtexpress' };
const order = { id: 1, ...parcel };
const ok = { provider: 'kuaidiwang', status: 'ok', events: [{ time: '2026-10-01 08:00:00', context: '派送中' }] };
const unavailable = { provider: 'kuaidiwang', status: 'unavailable', events: [] };
async function scenario(bridge, backend = ok, timeout = 20) {
  const calls = [];
  const data = await loadStoreLogistics({ bridge, orderId: 1, baseUrl: 'https://backend.example', token: 'fixture-token', nativeTimeout: timeout,
    request: async (url, options) => {
      calls.push({ url, options });
      assert.equal(url, 'https://backend.example/store/orders/1/logistics');
      assert.equal(options.headers.Authorization, 'Bearer fixture-token');
      return { data: { code: 200, data: { order, logistics: options.params ? { status: 'pending_query', events: [] } : backend,
        ...(options.params ? { native_query: { ...parcel, receiver_phone: 'must-not-forward', token: 'must-not-forward' } } : {}) } } };
    },
  });
  return { calls, data };
}
(async () => {
  const web = await scenario(null);
  assert.equal(web.calls.length, 1); assert(!web.calls[0].options.params);
  const old = await scenario({ inApp: true, queryStoreLogistics: () => { throw Error('Old app must not use native'); } });
  assert.equal(old.calls.length, 1);
  let nativeCalls = 0;
  const bridge = { inApp: true, nativeLogisticsAvailable: true, queryStoreLogistics: async payload => {
    nativeCalls++;
    assert.deepEqual(JSON.parse(JSON.stringify(payload)), parcel);
    return ok;
  } };
  const native = await scenario(bridge);
  assert.equal(native.calls.length, 1); assert.equal(native.calls[0].options.params.query, 'metadata');
  assert.equal(nativeCalls, 1); assert.equal(native.data.logistics.query_via, 'native');
  const failed = await scenario({ ...bridge, queryStoreLogistics: async () => unavailable });
  assert.equal(failed.calls.length, 2); assert.equal(failed.data.logistics.status, 'ok');
  const rejected = await scenario({ ...bridge, queryStoreLogistics: async () => { throw Error('Unknown bridge handler'); } });
  assert.equal(rejected.calls.length, 2);
  const timedOut = await scenario({ ...bridge, queryStoreLogistics: () => new Promise(() => {}) }, ok, 5);
  assert.equal(timedOut.calls.length, 2);
  const malformed = await scenario({ ...bridge, queryStoreLogistics: async () => ({ ...ok, events: 'bad' }) });
  assert.equal(malformed.calls.length, 2);
  const empty = await scenario({ ...bridge, queryStoreLogistics: async () => ({ ...ok, status: 'no_records', events: [] }) });
  assert.equal(empty.calls.length, 1); assert.equal(empty.data.logistics.status, 'no_records');
  const stale = await scenario({ ...bridge, queryStoreLogistics: async () => ({ ...ok, stale: true }) }, unavailable);
  assert.equal(stale.calls.length, 2); assert.equal(stale.data.logistics.events.length, 1);
  const serverFailed = await loadStoreLogistics({ bridge: { ...bridge, queryStoreLogistics: async () => ({ ...ok, stale: true }) },
    orderId: 1, baseUrl: '', token: '', request: async (_, options) => {
      if (options.params) return { data: { code: 200, data: { order, native_query: parcel } } };
      throw Error('Server unavailable');
    } });
  assert.equal(serverFailed.logistics.events.length, 1);
  let unauthorizedNative = false;
  await assert.rejects(loadStoreLogistics({ bridge: { ...bridge, queryStoreLogistics: () => { unauthorizedNative = true; } },
    orderId: 1, baseUrl: '', token: '', request: async () => { throw Error('Unauthorized order'); } }), /Unauthorized/);
  assert(!unauthorizedNative);
  const injection = fs.readFileSync(path.join(__dirname, '../../loghome-android/app/src/main/assets/js/jsbridge.js'), 'utf8');
  const messages = [];
  const window = { flutter_inappwebview: { callHandler: (...args) => { messages.push(args); return Promise.resolve(ok); } } };
  vm.runInNewContext(injection, { window, console: { log() {} } });
  assert.equal(window.jsBridge.nativeLogisticsAvailable, true);
  await window.jsBridge.queryStoreLogistics(parcel);
  assert.equal(messages[0][0], 'queryStoreLogistics');
  console.log('PASS H5 server routing, capability detection, native priority, parcel-only bridge payload, authorization before query, timeout/error fallback and retained traces');
})().catch(error => { console.error(error); process.exitCode = 1; });
