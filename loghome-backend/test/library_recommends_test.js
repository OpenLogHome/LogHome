const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function response() {
	return { status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; }, end(body) { this.body = JSON.parse(body); } };
}
function routes(file, query, transaction) {
	const handlers = {};
	const router = Object.fromEntries(['get', 'put', 'post', 'delete'].map(method => [method, (url, ...args) => { handlers[method + ' ' + url] = args.at(-1); }]));
	const source = fs.readFileSync(path.resolve(__dirname, '../routes', file), 'utf8');
	// Only evaluate the public recommendation routes; the legacy timer below them is unrelated.
	const code = file === 'library/recommand.js' ? source.slice(0, source.indexOf("router.get('/check_novel_rank'")) : source;
	vm.runInNewContext(code, { module: { exports: {} }, console: { log() {} }, require(id) {
		if (id === 'express') return { Router: () => router };
		if (id.endsWith('sql.js')) return { query, withTransaction: transaction || (work => work(query)) };
		return () => {};
	} });
	return handlers;
}

test('public collections exclude disabled rows and use the same ID order as management', async () => {
	let sql;
	const handlers = routes('library/recommand.js', async statement => { sql = statement; return []; });
	await handlers['get /get_library_collections']({}, response());
	assert.match(sql, /WHERE isValid = 1 ORDER BY collection_id ASC/);
});

test('disabled collections cannot leak works through their recommendation endpoint', async () => {
	let queries = 0;
	const handlers = routes('library/recommand.js', async () => { queries++; return [{ isValid: 0 }]; });
	const res = response();
	await handlers['get /get_library_recommend_titles']({ query: { title: '隐藏合集' } }, res);
	assert.equal(res.body.length, 0);
	assert.equal(queries, 1);
});

test('manual recommendations respect ranking, pagination and public visibility', async () => {
	const calls = [];
	const handlers = routes('library/recommand.js', async (sql, args) => { calls.push({ sql, args }); return calls.length === 1 ? [{ isValid: 1 }] : [{ novel_id: 8 }]; });
	const res = response();
	await handlers['get /get_library_recommend_titles']({ query: { title: 'A&B', page: '2', amount: '12' } }, res);
	assert.deepEqual(Array.from(calls[1].args), ['A&B', 12, 12]);
	assert.match(calls[1].sql, /ORDER BY c.ranking DESC, c.recommend_id DESC/);
	assert.match(calls[1].sql, /n.is_banned = 0/);
	assert.equal(res.body[0].novel_id, 8);
});

test('collection rename migrates works in the same transaction and unchanged saves succeed', async () => {
	for (const oldTitle of ['旧合集', '新合集']) {
		const calls = [];
		let transactionCount = 0;
		const query = async (sql, args) => {
			calls.push({ sql, args });
			if (sql.startsWith('SELECT *')) return [{ collection_title: oldTitle }];
			if (sql.startsWith('SELECT collection_id')) return [];
			return { affectedRows: 0 };
		};
		const handlers = routes('manage/libraryRecommends.js', () => { throw Error('must be transactional'); }, async work => { transactionCount++; return work(query); });
		const res = response();
		await handlers['put /collections/:id']({ params: { id: '2' }, body: { collection_title: '新合集', collection_type: 'slide', isValid: 1 } }, res);
		assert.equal(res.body.msg, 'success');
		assert.equal(transactionCount, 1);
		assert.equal(calls.filter(call => call.sql.startsWith('UPDATE library_recommend SET')).length, oldTitle === '新合集' ? 0 : 1);
		if (oldTitle !== '新合集') assert.deepEqual(Array.from(calls[2].args), ['新合集', '旧合集']);
	}
});

test('duplicate collection names are rejected without changing either collection or works', async () => {
	let mutations = 0;
	const handlers = routes('manage/libraryRecommends.js', async sql => {
		if (sql.startsWith('SELECT *')) return [{ collection_title: '原合集' }];
		if (sql.startsWith('SELECT collection_id')) return [{ collection_id: 7 }];
		mutations++; return {};
	});
	const res = response();
	await handlers['put /collections/:id']({ params: { id: '2' }, body: { collection_title: '已有合集', collection_type: 'slide' } }, res);
	assert.equal(res.code, 409);
	assert.equal(mutations, 0);
});

test('failed rename is passed to the transaction rollback and never reports success', async () => {
	let rolledBack = false;
	const query = async sql => {
		if (sql.startsWith('SELECT *')) return [{ collection_title: '旧合集' }];
		if (sql.startsWith('SELECT collection_id')) return [];
		throw Error('database failure');
	};
	const handlers = routes('manage/libraryRecommends.js', query, async work => { try { return await work(query); } catch (error) { rolledBack = true; throw error; } });
	const res = response();
	await handlers['put /collections/:id']({ params: { id: '2' }, body: { collection_title: '新合集', collection_type: 'slide' } }, res);
	assert.equal(rolledBack, true);
	assert.equal(res.code, 400);
});

test('invalid collection types and nonfinite recommendation rankings are rejected', async () => {
	const handlers = routes('manage/libraryRecommends.js', () => { throw Error('must not query'); });
	for (const request of [
		['post /collections', { body: { collection_title: '测试', collection_type: 'unknown' } }],
		['post /', { body: { title: '测试', novel_id: 1, ranking: 'abc' } }],
	]) {
		const res = response(); await handlers[request[0]](request[1], res); assert.equal(res.code, 400);
	}
});

test('reading feed returns distinct stable pages and an empty final page', async () => {
	const source = fs.readFileSync(path.resolve(__dirname, '../routes/library.js'), 'utf8');
	const start = source.indexOf("router.get('/get_novels_all'");
	const end = source.indexOf("router.get('/get_novels_search'", start);
	let handler;
	const novels = Array.from({ length: 8 }, (_, i) => ({ novel_id: 8 - i }));
	vm.runInNewContext(source.slice(start, end), { HAYCRAFT_TAG_FLAG_SQL: '0', console: { log() {} }, router: { get(url, callback) { handler = callback; } }, query: async (sql, args) => {
		assert.match(sql, /ORDER BY n.novel_id DESC LIMIT \?, \?/);
		return novels.slice(args[0], args[0] + args[1]);
	} });
	const pages = [];
	for (let page = 1; page <= 3; page++) {
		const res = response(); await handler({ query: { page: String(page), amount: '6' } }, res); pages.push(res.body);
	}
	assert.deepEqual(pages.map(page => page.length), [6, 2, 0]);
	assert.equal(new Set(pages.flat().map(novel => novel.novel_id)).size, 8);
	const res = response(); await handler({ query: { page: '-1' } }, res); assert.equal(res.code, 400);
});
