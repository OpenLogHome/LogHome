const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { articleTextCount } = require('../bin/articleTextCount');

test('author counts use text blocks and vocabulary descriptions, preserving empty drafts', () => {
	assert.equal(articleTextCount('[{"type":"text","value":"最新草稿"},{"type":"image","img":"https://fixture.test/image.png"}]', 'richtext'), 4);
	assert.equal(articleTextCount('[]', 'richtext'), 0);
	assert.equal(articleTextCount('[{"type":"text","value":"大纲"}]', 'worldOutline'), 2);
	assert.equal(articleTextCount('{"desc":"简介","attributes":[{"content":"不计入"}]}', 'worldVocabulary'), 2);
	assert.equal(articleTextCount('broken JSON', 'richtext'), null);
	assert.equal(articleTextCount(null, 'richtext'), null);
	assert.equal(articleTextCount('{"pages":[]}', 'mangaPage'), null);
});

// Exercise the actual list routes and serializer with isolated database transport.
async function list(routeName, rows, allowed = true, params = {}) {
	const source = fs.readFileSync(path.join(__dirname, '../routes/essays.js'), 'utf8');
	const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
	let handler;
	const calls = [];
	const maintenance = [];
	const start = source.indexOf(`router.get('/${routeName}'`);
	vm.runInNewContext([
		section('const WRITER_LEGACY_TIME_SQL_FORMAT', 'function shouldMirrorWriterDraftForArticleType'),
		section('function serializeArticleListRow', 'function serializeArticleHistoryRow'),
		source.slice(start, source.indexOf("router.get('", start + 1)),
	].join('\n'), {
		articleTextCount, REALTIME_CRDT_MODE: 'realtime_crdt', memoryDatabase: 'memory',
		auth() {}, console: { log() {} },
		getCurrentUser: () => ({ user_id: 1 }),
		getNovelAccess: async () => allowed ? {} : null,
		canViewArticles: () => allowed, canDeleteArticle: () => allowed,
		ensureAgentMemorySchema: async () => { maintenance.push('schema'); },
		expireArticleEditLocks: async () => { maintenance.push('locks'); },
		router: { get(url, auth, callback) { handler = callback; } },
		query: async (sql, params) => { calls.push({ sql, params: Array.from(params) }); return rows; },
	});
	const response = {
		code: 200, status(code) { this.code = code; return this; },
		end(body) { this.body = JSON.parse(body); }, json(body) { this.body = body; },
	};
	await handler({ query: { id: '7', ...params } }, response);
	return { calls, response, maintenance };
}

test('catalog APIs report the latest draft count without replacing published counts or exposing draft bodies', async () => {
	for (const route of ['get_articles', 'get_articles_deleted']) {
		const { calls, response } = await list(route, [
			{ article_id: 11, article_type: 'richtext', text_count: 6000,
				writer_article_id: 11, writer_content: '[{"type":"text","value":"最新草稿"}]' },
			{ article_id: 12, article_type: 'richtext', text_count: 2000,
				writer_article_id: 12, writer_content: '[]' },
			{ article_id: 13, article_type: 'richtext', text_count: 3000 },
		]);
		assert.equal(response.body[0].text_count, 6000);
		assert.equal(response.body[0].article_writer.text_count, 4);
		assert.equal(response.body[1].article_writer.text_count, 0);
		assert.equal(response.body[2].article_writer, undefined);
		assert.equal(response.body[0].article_writer.content, undefined);
		assert.equal(response.body[0].writer_content, undefined);
		assert.equal(calls.length, 1);
		assert.deepEqual(calls[0].params, [7]);
		assert.match(calls[0].sql, /aw\.content as writer_content/);
		assert.match(calls[0].sql, /a\.article_type/);
		assert.match(calls[0].sql, /ORDER BY COALESCE\(aw_latest\.updated_at,.*DESC, aw_latest\.id DESC/);
		const denied = await list(route, [], false);
		assert.equal(denied.response.code, 403);
		assert.equal(denied.calls.length, 0);
	}
});

test('lightweight editor catalogs skip indexing, feedback and maintenance work while preserving latest draft data', async () => {
	const { calls, maintenance } = await list('get_articles', [], true, { catalog_only: '1' });
	assert.deepEqual(maintenance, []);
	assert.doesNotMatch(calls[0].sql, /agent_memory|agent_writer_memory|article_feedback|am_raw|awm_raw/);
	assert.match(calls[0].sql, /aw\.content as writer_content/);
	assert.match(calls[0].sql, /expires_at > CURRENT_TIMESTAMP/);
	const full = await list('get_articles', []);
	assert.deepEqual(full.maintenance, ['schema', 'locks']);
	assert.match(full.calls[0].sql, /agent_writer_memory/);
});
