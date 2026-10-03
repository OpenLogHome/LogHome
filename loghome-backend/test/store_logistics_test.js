const assert = require('assert');
const express = require('express');
const clone = x => JSON.parse(JSON.stringify(x));
let order,
	notifications,
	caches,
	failNotification = false,
	writes = 0;
let queue = Promise.resolve();
async function q(sql, values) {
	if (sql.startsWith('DELETE FROM store_logistics_cache')) {
    for (const [key, row] of Object.entries(caches)) if (row.order_id === values[0] && key !== values[1]) delete caches[key];
    return {};
  }
	if (sql.startsWith('INSERT IGNORE INTO store_logistics_cache')) {
		if (!caches[values[1]]) caches[values[1]] = { tracking_key: values[1], order_id: values[0] };
		return {};
	}
	if (sql.startsWith('SELECT tracking_key')) return caches[values[0]] ? [caches[values[0]]] : [];
	if (sql.startsWith('UPDATE store_logistics_cache')) {
		Object.assign(caches[values[3]], {
			payload: values[0],
			checked_at: values[1],
			next_query_at: values[2],
		});
		return {};
	}
	if (sql.startsWith('SELECT') && sql.includes('FROM store_orders'))
		return order &&
			order.id === values[0] &&
			(values.length === 1 || order.user_id === values[1])
			? [clone(order)]
			: [];
	if (sql.startsWith('UPDATE store_orders SET status')) {
		writes++;
		Object.assign(order, {
			status: values[0],
			tracking_number: values[1],
			shipping_company: values[2],
			shipping_company_code: values[3],
		});
		return { affectedRows: 1 };
	}
	if (sql.startsWith('SELECT * FROM user_message')) return [];
	if (sql.startsWith('INSERT INTO user_message')) {
		if (failNotification) throw Error('fixture insert failed');
		notifications.push(values);
		return { insertId: 1 };
	}
	throw Error('Unexpected query ' + sql);
}
async function transaction(fn) {
	const previous = queue;
	let release;
	queue = new Promise(r => (release = r));
	await previous;
	const before = clone({ order, notifications, caches });
	try {
		return await fn(q);
	} catch (e) {
		order = before.order;
		notifications = before.notifications;
		caches = before.caches;
		throw e;
	} finally {
		release();
	}
}
const sqlPath = require.resolve('../sql');
require.cache[sqlPath] = {
	id: sqlPath,
	filename: sqlPath,
	loaded: true,
	exports: { query: q, withTransaction: transaction },
};
for (const name of ['auth', 'adminAuth']) {
	const p = require.resolve('../bin/' + name);
	require.cache[p] = {
		id: p,
		filename: p,
		loaded: true,
		exports: (req, res, next) => {
			if (!req.headers.authorization)
				return res.status(401).json({ msg: 'login required' });
			req.user = [{ user_id: 9 }];
			next();
		},
	};
}
const pddPath = require.resolve('../routes/manage/pddImport');
require.cache[pddPath] = {
	id: pddPath,
	filename: pddPath,
	loaded: true,
	exports: express.Router(),
};
const { shipOrder } = require('../bin/storeShipping');
const {
	createLogisticsService,
	QUERY_INTERVAL,
} = require('../bin/storeLogistics');
function reset() {
	order = {
		id: 1,
		user_id: 9,
		order_no: 'SO123',
		product_title: '测试商品',
		variant_label: '绿色',
		product_type: 'physical',
		status: 'pending',
		receiver_phone: '13800000000',
	};
	notifications = [];
	caches = {};
	failNotification = false;
	writes = 0;
}
async function run() {
	reset();
	const body = {
		tracking_number: 'SF123456789',
		shipping_company_code: 'shunfeng',
	};
	const results = await Promise.all([shipOrder(1, body), shipOrder(1, body)]);
	assert.equal(writes, 1);
	assert.equal(notifications.length, 1);
	assert(results.some(r => r.replayed));
	assert.equal(notifications[0][1], 9);
	assert.equal(notifications[0][3], 'store/logistics?order_id=1');
	assert.equal(notifications[0][4], 'notification');
	assert(notifications[0][2].includes('顺丰速运'));
	assert(notifications[0][2].includes('绿色'));
	await assert.rejects(
		shipOrder(1, { ...body, tracking_number: 'SF987654321' }),
		/状态/,
	);
	assert.equal(notifications.length, 1);
	reset();
	failNotification = true;
	await assert.rejects(shipOrder(1, body));
	assert.equal(order.status, 'pending');
	assert.equal(notifications.length, 0);
	reset();
	order.product_type = 'virtual';
	await assert.rejects(shipOrder(1, body), /实物/);
	reset();
	order.status = 'canceled';
	await assert.rejects(shipOrder(1, body), /状态/);
	reset();
	await assert.rejects(shipOrder(999, body), /不存在/);
	await assert.rejects(
		shipOrder(1, { ...body, tracking_number: 'bad number' }),
		/有效/,
	);
	await assert.rejects(shipOrder(1, { tracking_number: '1234567' }), /公司/);
	await assert.rejects(
		shipOrder(1, { ...body, shipping_company_code: 'unknown' }),
		/支持/,
	);
	reset();
	await shipOrder(1, {
		tracking_number: '123456789',
		shipping_company: '本地配送',
	});
	assert.equal(order.shipping_company_code, null);
	console.log(
		'PASS atomic shipment/notification, concurrent replay, rollback, type/status checks and carrier validation',
	);
	reset();
	await shipOrder(1, body);
  let now = new Date('2026-10-01T00:00:00Z'), calls = 0;
  const fixture = { success: true, nu: body.tracking_number, exname: body.shipping_company_code, status: 6,
    data: [{ time: '2026-09-30 12:00:00', context: '已揽收' }, { time: '2026-10-01 07:00:00', context: '已签收' }] };
  const service = createLogisticsService({ transaction, clock: () => now, get: async (url, opts) => {
    calls++;
    assert.equal(url, 'https://www.kuaidi.com/index-ajaxselectcourierinfo-SF123456789-shunfeng.html');
    assert.equal(opts.timeout, 8000);
    assert.equal(opts.maxRedirects, 0);
    assert(!JSON.stringify([url, opts]).includes('13800000000'));
    assert(!opts.headers.Authorization);
    return { data: JSON.stringify(fixture) };
  }});
  let [a, b] = await Promise.all([service(order), service(order)]);
  assert.equal(calls, 1); assert(a.cached || b.cached);
  await service({ ...order, id: 2 }); assert.equal(calls, 1);
  assert.equal(a.provider, 'kuaidiwang'); assert.equal(a.state_text, '已签收');
  assert.equal(a.events[0].context, '已签收');
  now = new Date(now.getTime() + QUERY_INTERVAL + 1);
  await service(order); assert.equal(calls, 2);
  const failed = createLogisticsService({ transaction, clock: () => new Date(now.getTime() + QUERY_INTERVAL + 1), get: async () => { throw Error('secret response'); } });
  const stale = await failed(order); assert.equal(stale.stale, true); assert.equal(stale.events.length, 2);
  assert(!JSON.stringify(stale).includes('secret response'));
  caches = {}; calls = 0;
  const failedEmpty = createLogisticsService({ transaction, get: async () => { calls++; throw Error('secret'); } });
  assert.equal((await failedEmpty(order)).status, 'unavailable'); await failedEmpty(order); assert.equal(calls, 1);
  const { normalizeResponse, describeOrder, buildQueryUrl } = require('../bin/storeTrackingProvider');
  const parcel = describeOrder(order).native_query;
  assert.equal(normalizeResponse('<html>limit</html>', parcel).status, 'unavailable');
  assert.equal(normalizeResponse({ success: false, reason: '查询次数限制' }, parcel).status, 'unavailable');
  assert.equal(normalizeResponse({ success: false, reason: '需要验证手机号' }, parcel).status, 'verification_required');
  assert.equal(normalizeResponse({ success: false, reason: '暂无物流信息' }, parcel).status, 'no_records');
  assert.equal(normalizeResponse({ success: true, data: [] }, parcel).status, 'no_records');
  assert.equal(normalizeResponse({ ...fixture, nu: 'OTHER123' }, parcel).status, 'unavailable');
  assert.equal(normalizeResponse({ ...fixture, exname: 'jd' }, parcel).status, 'unavailable');
  assert.equal(normalizeResponse({ success: true, data: 'bad' }, parcel).status, 'unavailable');
  assert.equal(normalizeResponse({ ...fixture, status: 5 }, parcel).state_text, '物流异常');
  assert.equal(normalizeResponse({ ...fixture, status: 7 }, parcel).state_text, '退签');
  assert.equal(normalizeResponse({ ...fixture, status: 2 }, parcel).status, 'unavailable');
  assert.equal(describeOrder({ ...order, shipping_company_code: null }).logistics.status, 'missing_carrier');
  assert.equal(describeOrder({ ...order, tracking_number: 'JT5529580581737', shipping_company_code: null }).native_query.shipping_company_code, 'jtexpress');
  assert.equal(describeOrder({ ...order, status: 'pending' }).logistics.status, 'not_shipped');
  assert.equal(describeOrder({ ...order, tracking_number: '../unsafe' }).logistics.status, 'unavailable');
  assert.throws(() => buildQueryUrl({ tracking_number: '123456', shipping_company_code: '../bad' }));
  caches = {};
  let changes = 0;
  const edited = createLogisticsService({ transaction, get: async () => { changes++; return { data: { success: true, data: [] } }; } });
  await edited(order); await edited({ ...order, tracking_number: 'SF987654321' }); assert.equal(changes, 2);
  require('../bin/storeLogistics').getLogistics = service;
  console.log('PASS public provider normalization, fixed HTTPS endpoint, no phone/token forwarding, concurrency/expiry, edited parcels, stale records and safe errors');
	const app = express();
	app.use(express.json());
	app.use('/store', require('../routes/store'));
	app.use('/manage/store', require('../routes/manage/store'));
	const server = app.listen(0, '127.0.0.1');
	await new Promise(r => server.once('listening', r));
	const request = async (path, method = 'GET', body, auth = true) => {
		const response = await fetch(
			'http://127.0.0.1:' + server.address().port + path,
			{
				method,
				headers: {
					'Content-Type': 'application/json',
					...(auth ? { Authorization: 'fixture' } : {}),
				},
				body: body ? JSON.stringify(body) : undefined,
			},
		);
		return { status: response.status, data: await response.json() };
	};
	try {
		reset();
		await shipOrder(1, body);
		let r = await request('/store/orders/1/logistics');
		assert.equal(r.status, 200);
		assert.equal(r.data.data.logistics.status, 'ok');
    const beforeMetadata = calls;
    r = await request('/store/orders/1/logistics?query=metadata');
    assert.equal(r.data.data.logistics.status, 'pending_query');
    assert.equal(r.data.data.native_query.shipping_company_code, 'shunfeng');
    assert.equal(calls, beforeMetadata);
		assert(!JSON.stringify(r.data).includes('13800000000'));
		assert(!('user_id' in r.data.data.order));
		order.user_id = 10;
		r = await request('/store/orders/1/logistics');
		assert.equal(r.status, 404);
		r = await request('/store/orders/1/logistics', 'GET', null, false);
		assert.equal(r.status, 401);
		r = await request('/store/orders/no/logistics');
		assert.equal(r.status, 400);
		reset();
		r = await request('/manage/store/orders/1/ship', 'POST', body);
		assert.equal(r.status, 200);
		assert.equal(notifications.length, 1);
		r = await request('/manage/store/orders/1/ship', 'POST', body);
		assert.equal(r.data.data.replayed, true);
		assert.equal(notifications.length, 1);
		reset();
		failNotification = true;
		r = await request('/manage/store/orders/1/ship', 'POST', body);
		assert.equal(r.status, 500);
		assert.equal(order.status, 'pending');
	} finally {
		await new Promise(r => server.close(r));
	}
	console.log(
		'PASS authenticated routes, order ownership, redacted response, shipment endpoint and error rollback',
	);
}
run().catch(e => {
	console.error(e);
	process.exitCode = 1;
});
