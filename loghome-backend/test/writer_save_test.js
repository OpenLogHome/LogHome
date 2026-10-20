const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { calculateContentHash } = require('../bin/articleParagraphIds');

async function upload({ base, lock = true, allowed = true, fast = true } = {}) {
	const source = fs.readFileSync(path.join(__dirname, '../routes/essays.js'), 'utf8');
	const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
	const calls = [];
	let handler;
	const latest = { id: 42, article_id: 10, content_hash: 'old-hash', title: '原题',
		editor_user_id: 99, edit_session_id: 'current-session' };
	vm.runInNewContext([
		section('const WRITER_LEGACY_TIME_SQL_FORMAT', 'function shouldMirrorWriterDraftForArticleType'),
		section('function serializeWriterSnapshotMeta', 'async function validateActiveEditSession'),
		section("router.post('/upload_article_writer'", "router.post('/add_article'"),
	].join('\n'), {
		auth() {}, console: { log() {} }, REALTIME_CRDT_MODE: 'realtime_crdt',
		getCurrentUser: () => ({ user_id: 99 }), sanitizeSessionId: (value) => value,
		getArticleAccess: async () => allowed ? { article_id: 10, novel_id: 7 } : null,
		canEditDraft: (access) => Boolean(access), getRestrictingActivityError: async () => null,
		getArticleCollaborationState: async () => null,
		validateActiveEditSession: async () => ({ ok: lock, status: 409, body: { code: 'stale_session' } }),
		ensureArticleParagraphIds: (content) => content, calculateContentHash,
		router: { post(url, auth, callback) { handler = callback; } },
		query: async (sql, params) => {
			calls.push({ sql, params: Array.from(params) });
			if (sql.startsWith('UPDATE articles_writer')) {
				latest.title = params[0]; latest.content_hash = params[2];
				return { affectedRows: 1 };
			}
			if (sql.includes('INSERT INTO articles_writer')) {
				latest.title = params[1]; latest.content_hash = params[3];
				return { insertId: 43 };
			}
			assert.match(sql, /^SELECT/);
			return [{ ...latest }];
		},
	});
	const res = { code: 200, status(code) { this.code = code; return this; },
		json(body) { this.body = body; }, end(body) { this.body = JSON.parse(body); } };
	await handler({ body: { article_id: 10, title: '新标题',
		content: '[{"type":"text","value":"新正文","id":42}]', create_time: '20261018150000',
		edit_session_id: 'current-session', is_fast_save: fast,
		base_writer: base === undefined ? { content_hash: 'old-hash', title: '原题' } : base } }, res);
	return { calls, res };
}

test('conditional fast save validates the acknowledged draft and reuses its session row without reading full content', async () => {
	const { calls, res } = await upload();
	assert.equal(res.code, 200);
	assert.equal(res.body.writer_snapshot.title, '新标题');
	assert.equal(calls.length, 3); // metadata check, update, acknowledged metadata
	assert.match(calls[1].sql, /^UPDATE articles_writer/);
	assert.equal(calls[1].params.at(-1), 42);
	for (const call of calls.filter((call) => call.sql.startsWith('SELECT'))) {
		assert.doesNotMatch(call.sql, /SELECT \*|\bcontent\s*,/);
	}
});

test('conditional history snapshots also avoid downloading the previous full draft', async () => {
	const { calls, res } = await upload({ fast: false });
	assert.equal(res.code, 200);
	assert.equal(calls.length, 3);
	assert.match(calls[1].sql, /INSERT INTO articles_writer/);
	assert.doesNotMatch(calls[0].sql, /SELECT \*/);
});

test('content or title conflicts reject writes; permission and lock checks still run before version lookup', async () => {
	for (const base of [{ content_hash: 'changed', title: '原题' }, { content_hash: 'old-hash', title: 'changed' }]) {
		const { calls, res } = await upload({ base });
		assert.equal(res.code, 409);
		assert.equal(res.body.code, 'writer_revision_conflict');
		assert.equal(calls.length, 1);
	}
	for (const options of [{ lock: false }, { allowed: false }]) {
		const { calls, res } = await upload(options);
		assert.ok([403, 409].includes(res.code));
		assert.equal(calls.length, 0);
	}
});

test('older clients retain the original upload path without conditional metadata', async () => {
	const { calls, res } = await upload({ base: null });
	assert.equal(res.code, 200);
	assert.match(calls[0].sql, /SELECT \*/);
	assert.match(calls[1].sql, /^UPDATE articles_writer/);
});
