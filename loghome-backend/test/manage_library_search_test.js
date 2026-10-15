const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

async function search(params) {
	const source = fs.readFileSync(path.resolve(__dirname, '../routes/manage/library.js'), 'utf8');
	const start = source.indexOf("router.get('/get_all_novels'");
	const end = source.indexOf("router.get('/get_novel_articles'", start);
	let handler;
	const calls = [];
	vm.runInNewContext(source.slice(start, end), {
		auth() {}, console: { log() {} },
		router: { get(url, middleware, callback) { handler = callback; } },
		query: async (sql, args) => {
			calls.push({ sql, args: Array.from(args) });
			return sql.startsWith('SELECT COUNT') ? [{ total: 1 }] : [{ novel_id: 119, name: '我的世界' }];
		},
	});
	const res = { json(body) { this.body = body; } };
	await handler({ query: params }, res);
	return { calls, body: res.body };
}

test('numeric keywords match novel ID as well as existing title/content matches, with consistent count filters', async () => {
	const { calls, body } = await search({ keyword: ' 119 ', page: '2', pageSize: '10', authorName: '作者' });
	for (const call of calls) assert.match(call.sql, /n\.novel_id = \? OR n\.name LIKE \? OR n\.content LIKE \?/);
	assert.match(calls[0].sql, /ORDER BY \(n\.novel_id = \?\) DESC/);
	assert.deepEqual(calls[0].args, [119, '%119%', '%119%', '%作者%', 119, 10, 10]);
	assert.deepEqual(calls[1].args, [119, '%119%', '%119%', '%作者%']);
	assert.equal(body.data[0].novel_id, 119);
	assert.equal(body.pagination.total, 1);
});

test('normal names retain title/content matching and empty keywords retain unfiltered pagination', async () => {
	const { calls } = await search({ keyword: '我的世界' });
	assert.doesNotMatch(calls[0].sql, /n\.novel_id =/);
	assert.deepEqual(calls[0].args, ['%我的世界%', '%我的世界%', 0, 10]);
	const all = await search({ keyword: ' ' });
	assert.deepEqual(all.calls[0].args, [0, 10]);
});

test('non-ID numeric forms and unsafe integers remain parameterized text searches', async () => {
	for (const keyword of ['1e2', '-119', '119.5', '9007199254740993', "119' OR 1=1"]) {
		const { calls } = await search({ keyword });
		assert.doesNotMatch(calls[0].sql, /n\.novel_id =/);
		assert.deepEqual(calls[0].args.slice(0, 2), [`%${keyword}%`, `%${keyword}%`]);
	}
});
