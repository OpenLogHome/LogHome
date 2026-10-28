const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const express = require('express');
const { createDownloadStore } = require('../bin/novelExportDownloads');

function fixture(options = {}) {
	let clock = 0;
	const downloads = createDownloadStore({ now: () => clock, ttl: 900000 });
	const statements = [];
	const generated = [];
	const novel = { novel_id: 11, name: options.novelName || '测试/作品', author_name: '作者', novel_type: 'novel' };
	const articles = options.articles || [{ article_id: 1, title: '第一章', content: '正文' }];
	const filename = path.join(__dirname, '../routes/essays.js');
	const module = { exports: {} };
	vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
		module, exports: module.exports, process: { env: {} },
		console: { log() {}, error() {} },
		require(name) {
			if (name === 'express') return express;
			if (name === '../sql.js') return { query: async (sql) => {
				statements.push(sql);
				if (options.queryError) throw new Error('database unavailable');
				return sql.includes('FROM novels n JOIN users') ? [novel] : articles;
			} };
			if (name === '../bin/auth.js') return (req, res, next) => next();
			if (name === '../bin/novelCollaboration.js') return {
				normalizeUser: rows => rows[0],
				getNovelAccess: async userId => options.missing ? null : { access_role: userId === 7 ? 'owner' : 'collaborator' },
			};
			if (name === '../bin/novelEbook') return { createNovelEbook: async input => {
				generated.push(input);
				return options.generate ? options.generate(input) : Buffer.from('ebook bytes');
			} };
			if (name === '../bin/novelExportDownloads') return { downloads };
			if (['fs', 'path', 'crypto'].includes(name)) return require(name);
			return {};
		},
	}, { filename });
	const invoke = async (route, query = {}, userId = 7, params = {}) => {
		const layer = module.exports.stack.find(item => item.route && item.route.path === route);
		assert.ok(layer, route);
		const res = {
			statusCode: 200, headers: {}, body: null,
			status(code) { this.statusCode = code; return this; },
			set(key, value) { Object.assign(this.headers, typeof key === 'object' ? key : { [key]: value }); return this; },
			attachment(value) { this.filename = value; return this; },
			type(value) { this.headers['Content-Type'] = value; return this; },
			json(body) { this.body = body; return this; },
			send(body) { this.body = body; return this; },
		};
		await layer.route.stack.at(-1).handle({ query, params, user: [{ user_id: userId }] }, res);
		return res;
	};
	return {
		invoke, generated, statements,
		advance(ms) { clock += ms; },
		export: (query = {}, userId = 7) => invoke('/export_novel', { id: '11', ...query }, userId),
		download: token => invoke('/download_export/:token', {}, 0, { token }),
	};
}

test('invalid requests, missing works and collaborators cannot generate or read drafts', async () => {
	const state = fixture();
	for (const params of [{ id: 'abc' }, { id: '-1' }, { id: '1.5' }, { export_type: 'all' }, { export_format: 'html' }, { download_mode: 'other' }]) {
		assert.equal((await state.export(params)).statusCode, 400);
	}
	assert.equal((await state.export({ export_type: 'draft' }, 8)).statusCode, 403);
	assert.equal(state.generated.length, 0);
	assert.equal(state.statements.length, 0);
	assert.equal((await fixture({ missing: true }).export()).statusCode, 404);
});

test('published export returns an attachment only after generation and excludes draft/deleted chapters', async () => {
	const state = fixture();
	const response = await state.export();
	assert.equal(response.statusCode, 200);
	assert.equal(response.headers['Content-Type'], 'application/epub+zip');
	assert.equal(response.headers['Cache-Control'], 'private, no-store');
	assert.equal(response.filename, '测试_作品-读者版.epub');
	assert.ok(Buffer.isBuffer(response.body));
	assert.match(state.statements[1], /deleted = 0 AND is_draft = 0/);
	assert.doesNotMatch(state.statements[1], /articles_writer/);
	assert.equal(state.generated[0].novel.author_name, '作者');
});

test('draft export reads live collaboration projection before latest saved draft, with chapter ordering', async () => {
	const state = fixture();
	const response = await state.export({ export_type: 'draft', export_format: 'pdf' });
	assert.equal(response.headers['Content-Type'], 'application/pdf');
	assert.equal(response.filename, '测试_作品-存稿版.pdf');
	assert.match(state.statements[1], /acm.mode = 'realtime_crdt'/);
	assert.match(state.statements[1], /live.id = acd.live_writer_id AND live.article_id = a.article_id/);
	assert.match(state.statements[1], /WHEN live.id IS NOT NULL THEN live.content WHEN aw.id IS NOT NULL THEN aw.content ELSE a.content/);
	assert.match(state.statements[1], /COALESCE\(aw_latest.updated_at, STR_TO_DATE/);
	assert.match(state.statements[1], /aw_latest.id DESC/);
	assert.match(state.statements[1], /a.deleted = 0/);
	assert.match(state.statements[1], /ORDER BY a.article_chapter ASC, a.article_id ASC/);
});

test('long names with emoji remain valid Unicode in download attachment headers', async () => {
	const state = fixture({ novelName: '书'.repeat(79) + '😀尾\ud800' });
	const response = await state.export();
	assert.equal(response.filename, '书'.repeat(79) + '😀-读者版.epub');
	assert.doesNotThrow(() => require('content-disposition')(response.filename));
});

test('system browser downloads by opaque capability, then expiration removes access', async () => {
	const state = fixture();
	const response = await state.export({ download_mode: 'url', export_format: 'pdf' });
	assert.equal(response.statusCode, 200);
	assert.equal(response.body.expires_in, 900);
	assert.match(response.body.download_url, /^\/essays\/download_export\/[a-f0-9]{48}$/);
	const token = response.body.download_url.split('/').pop();
	const file = await state.download(token);
	assert.equal(file.statusCode, 200);
	assert.equal(file.headers['Content-Type'], 'application/pdf');
	assert.equal(file.headers['Cache-Control'], 'private, no-store');
	assert.equal(file.body.toString(), 'ebook bytes');
	assert.equal((await state.download('not-a-token')).statusCode, 404);
	assert.equal((await state.download('a'.repeat(48))).statusCode, 404);
	state.advance(900000);
	assert.equal((await state.download(token)).statusCode, 404);
});

test('empty works and database/generator failures return errors instead of false success', async () => {
	assert.equal((await fixture({ articles: [] }).export()).statusCode, 400);
	assert.equal((await fixture({ queryError: true }).export()).statusCode, 500);
	let fail = true;
	const state = fixture({ generate: async () => {
		if (fail) throw new Error('generator failure');
		return Buffer.from('ok');
	} });
	assert.equal((await state.export()).statusCode, 500);
	fail = false;
	assert.equal((await state.export()).statusCode, 200);
});

test('a repeated request is rejected while the original export is still running', async () => {
	let finish;
	let started;
	const startedPromise = new Promise(resolve => { started = resolve; });
	const pending = new Promise(resolve => { finish = resolve; });
	const state = fixture({ generate: async () => { started(); return pending; } });
	const first = state.export();
	await startedPromise;
	assert.equal((await state.export()).statusCode, 429);
	finish(Buffer.from('ok'));
	assert.equal((await first).statusCode, 200);
});

test('download cache has a bounded size and reclaims expired files without evicting valid links', () => {
	let time = 0;
	const store = createDownloadStore({ now: () => time, ttl: 10, maxBytes: 4 });
	const first = store.put(Buffer.from('1234'), 'one.epub', 'application/epub+zip');
	assert.throws(() => store.put(Buffer.from('5'), 'two.pdf', 'application/pdf'), { statusCode: 503 });
	assert.ok(store.get(first.download_url.split('/').pop()));
	time = 10;
	assert.ok(store.put(Buffer.from('new'), 'two.pdf', 'application/pdf'));
	assert.equal(store.get(first.download_url.split('/').pop()), null);
});
