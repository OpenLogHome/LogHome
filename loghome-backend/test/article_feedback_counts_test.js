const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../routes/essays.js'), 'utf8');
const start = source.indexOf("router.get('/get_article_feedback_counts'");
const end = source.indexOf("router.get('/get_articles_search_snapshot'", start);
const routeSource = source.slice(start, end);

async function request({ allowed = true, rows = [], id = '7' } = {}) {
	let handler;
	const calls = [];
	vm.runInNewContext(routeSource, {
		auth() {},
		console: { log() {} },
		getCurrentUser: () => ({ user_id: 3 }),
		getNovelAccess: async () => allowed ? {} : null,
		canViewArticles: () => allowed,
		query: async (sql, params) => {
			calls.push({ sql, params: Array.from(params) });
			return rows;
		},
		router: { get(url, auth, callback) { handler = callback; } },
	});
	const response = {
		code: 200,
		status(code) { this.code = code; return this; },
		json(body) { this.body = body; return this; },
	};
	await handler({ query: { id } }, response);
	return { response, calls };
}

test('feedback counts are returned as one authorized aggregate query', async () => {
	const { response, calls } = await request({
		rows: [{ article_id: '11', feedback_count: '3' }],
	});
	assert.deepEqual(
		JSON.parse(JSON.stringify(response.body)),
		[{ article_id: 11, feedback_count: 3 }],
	);
	assert.equal(calls.length, 1);
	assert.deepEqual(calls[0].params, [7]);
	assert.match(calls[0].sql, /a\.novel_id = \?/);
	assert.match(calls[0].sql, /af\.status = 0/);
	assert.match(calls[0].sql, /GROUP BY af\.article_id/);
});

test('feedback counts reject missing ids and inaccessible works', async () => {
	const missing = await request({ id: '' });
	assert.equal(missing.response.code, 400);
	assert.equal(missing.calls.length, 0);

	const denied = await request({ allowed: false });
	assert.equal(denied.response.code, 403);
	assert.equal(denied.calls.length, 0);
});
