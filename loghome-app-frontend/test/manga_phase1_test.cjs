// Run: node --test test/manga_phase1_test.cjs (no database or image service required).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Vue = require('vue');
const backend = path.resolve(__dirname, '../../loghome-backend');
const visibility = require(path.join(backend, 'bin/readingVisibility'));
const revisions = require(path.join(backend, 'bin/mangaRevision'));
const quiet = { log() {}, error() {} };
const clone = (value) => JSON.parse(JSON.stringify(value));
const deferred = () => {
	let resolve, reject;
	const promise = new Promise((a, b) => { resolve = a; reject = b; });
	return { promise, resolve, reject };
};
const pages = [{ id: 1, url: 'https://test.invalid/1.png', width: 800, height: 1200 }, { id: 2, url: 'https://test.invalid/2.png', width: 800, height: 1200 }];
const article = { article_id: 10, novel_id: 3, title: '第一话', article_type: 'mangaStrip', is_draft: 0, content: JSON.stringify({ pages }), update_time: new Date('2026-10-04T00:00:00Z') };
const rights = { access_role: 'owner', can_view_articles: true, can_edit_draft: true, can_publish_article: true, can_add_article: true, can_delete_article: true };

test('all changed Vue templates compile with the project Vue compiler', () => {
	const sfc = require('vue/compiler-sfc');
	for (const file of ['pages/writers/mangaEditor.vue', 'pages/readers/mangaReader.vue', 'pages/readers/mangaInfo.vue', 'components/mangaPage.vue', 'components/manga-icon.vue', 'pages/writers/essaySet.vue']) {
		const parsed = sfc.parse({ source: fs.readFileSync(path.resolve(__dirname, '../', file), 'utf8'), filename: file });
		const descriptor = parsed.descriptor || parsed;
		assert(descriptor.template && descriptor.script);
		const result = sfc.compileTemplate({ source: descriptor.template.content, filename: file });
		assert.equal(result.errors.length, 0, JSON.stringify(result.errors));
	}
});

function component(file, axios = {}, t) {
	const source = fs.readFileSync(path.resolve(__dirname, '../', file), 'utf8');
	const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*;?\s*$/gm, '').replace('export default', 'module.exports =');
	const storage = new Map([['token', JSON.stringify({ tk: 'fixture' })]]);
	const dialogs = [], navigations = [];
	const uni = { showToast() {}, showModal: (dialog) => dialogs.push(dialog), getSystemInfoSync: () => ({ windowWidth: 375 }), navigateTo: (target) => navigations.push(target), navigateBack() {}, switchTab() {}, reLaunch() {} };
	const window = { localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) }, addEventListener() {}, removeEventListener() {} };
	const sandbox = { module: {}, MangaZoomImage: {}, MangaPageSorter: {}, MangaIcon: {}, MangaA11y: {}, MangaPortal: {}, axios, uni, window, getCurrentPages: () => [{}], setTimeout, clearTimeout, console: quiet };
	vm.runInNewContext(script, sandbox, { filename: file });
	const options = sandbox.module.exports;
	const instance = new Vue({ ...options, beforeCreate() { this.$store = { state: { user_id: 7 } }; this.$baseUrl = ''; } });
	if (t) t.after(() => { clearTimeout(instance.draftTimer); clearTimeout(instance.progressTimer); instance.$destroy(); });
	return { instance, options, storage, dialogs, navigations, window };
}

// Execute the real route callback with external dependencies replaced by fixtures.
function route(file, method, name, globals = {}) {
	const source = fs.readFileSync(path.join(backend, 'routes', file), 'utf8');
	const marker = `router.${method}('${name}'`;
	const start = source.indexOf(marker);
	assert(start >= 0);
	const next = source.indexOf('\nrouter.', start + marker.length);
	let handler;
	const router = { [method]: (...args) => { handler = args.at(-1); } };
	vm.runInNewContext(source.slice(start, next < 0 ? undefined : next), { router, auth() {}, console: quiet, ...visibility, ...revisions, ...globals });
	return handler;
}
function response() {
	return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(...args) { if (args.length === 2) this.statusCode = args[0]; this.body = args.at(-1); return this; }, end(body) { this.body = JSON.parse(body); return this; } };
}

test('old episode editor fetches full authenticated content instead of empty list metadata', async (t) => {
	const requests = [];
	const { instance: editor } = component('pages/writers/mangaEditor.vue', { get: async (url, config) => { requests.push({ url, config }); return { data: [{ ...article, manga_revision: 'revision-1' }] }; } }, t);
	editor.novelId = 3; editor.novel = { current_access: rights };
	await editor.startEditEpisode({ article_id: 10, title: 'list metadata only' });
	assert.equal(requests[0].url, '/essays/get_article?id=10');
	assert.equal(requests[0].config.headers.Authorization, 'Bearer fixture');
	assert.equal(editor.pages.length, 2);
	assert.equal(editor.editorTitle, article.title);
	assert.equal(editor.expectedRevision, 'revision-1');
	assert.equal(editor.hasUnsavedChanges, false);
});

test('failed editor loading cannot save or upload and does not replace old episode', async (t) => {
	let writes = 0;
	const { instance: editor } = component('pages/writers/mangaEditor.vue', { get: async () => { throw new Error('offline'); }, post: () => { writes++; } }, t);
	editor.novelId = 3; editor.novel = { current_access: rights };
	await editor.startEditEpisode({ article_id: 10 });
	editor.saveEpisode(1);
	assert.equal(editor.editorReady, false);
	assert.equal(writes, 0);
});

test('leaving dirty editor asks, backs up full pages, and supports cancellation/restoration', async (t) => {
	const { instance: editor, storage, dialogs } = component('pages/writers/mangaEditor.vue', {}, t);
	editor.novelId = 3; editor.novel = { current_access: rights };
	editor.startNewEpisode(); editor.editorTitle = '本机草稿'; editor.pages = clone(pages);
	editor.backToList();
	assert.equal(editor.view, 'edit');
	assert.equal(JSON.parse(storage.get(editor.draftKey())).pages.length, 2);
	dialogs.pop().success({ confirm: false });
	assert.equal(editor.view, 'edit');
	editor.editorTitle = ''; editor.pages = []; editor.baseline = editor.editorSnapshot;
	editor.restoreDraft(editor.editRequestId);
	dialogs.pop().success({ confirm: true });
	assert.equal(editor.editorTitle, '本机草稿');
	assert.equal(editor.pages.length, 2);
	assert.equal(editor.hasUnsavedChanges, true);
});

test('saving during upload is blocked, save sends revision, and success clears local backup', async (t) => {
	let payload;
	const { instance: editor, storage } = component('pages/writers/mangaEditor.vue', { post: async (_, body) => { payload = body; }, get: async () => ({ status: 200, data: [] }) }, t);
	editor.novelId = 3; editor.novel = { current_access: rights }; editor.view = 'edit'; editor.editorReady = true;
	editor.editingArticleId = 10; editor.expectedRevision = 'server-revision'; editor.editorTitle = '改名'; editor.pages = clone(pages);
	editor.uploading = true; editor.saveEpisode(0); assert.equal(payload, undefined);
	editor.uploading = false; editor.persistDraft(); editor.saveEpisode(0);
	await new Promise(setImmediate);
	assert.equal(payload.expected_manga_revision, 'server-revision');
	assert.equal(payload.content.pages.length, 2);
	assert.equal(storage.has(editor.draftKey()), false);
});

test('revision conflict retains local backup rather than closing editor', async (t) => {
	const { instance: editor, storage, dialogs } = component('pages/writers/mangaEditor.vue', { post: async () => { throw { response: { status: 409, data: { msg: 'conflict' } } }; } }, t);
	editor.novelId = 3; editor.novel = { current_access: rights }; editor.view = 'edit'; editor.editorReady = true;
	editor.editingArticleId = 10; editor.expectedRevision = 'old'; editor.editorTitle = '本地修改'; editor.pages = clone(pages);
	editor.saveEpisode(0); await new Promise(setImmediate);
	assert.equal(editor.view, 'edit');
	assert.equal(JSON.parse(storage.get(editor.draftKey())).revision, 'old');
	assert.equal(dialogs.at(-1).title, '话数版本冲突');
});

test('failed images stop requesting until user retries, including strip mode', (t) => {
	const { instance: reader } = component('pages/readers/mangaReader.vue', {}, t);
	const before = reader.pageSrc(pages[0], 0);
	reader.onPageError(0); reader.onPageError(0);
	assert.equal(reader.pageSrc(pages[0], 0), before);
	assert.equal(reader.pageErrors[0], true);
	reader.retryPage(0);
	assert.notEqual(reader.pageSrc(pages[0], 0), before);
	reader.onPageError(0);
	assert.equal(reader.retryCount[0], 1);
});

test('rapid chapter requests cannot overwrite newest chapter and new strip chapter resets page', async (t) => {
	const first = deferred(), second = deferred();
	const { instance: reader } = component('pages/readers/mangaReader.vue', { get: (url) => url.includes('id=10&') ? first.promise : second.promise }, t);
	reader.novelId = 3; reader.isPreview = true; reader.currentPage = 8;
	reader.articles = [{ article_id: 10, article_chapter: 1 }, { article_id: 20, article_chapter: 2 }];
	const a = reader.openArticle(10, 1, 0), b = reader.openArticle(20, 0, 1);
	second.resolve({ status: 200, data: [{ ...article, article_id: 20 }] }); await b;
	first.resolve({ status: 200, data: [article] }); await a;
	await Vue.nextTick();
	assert.equal(reader.articleId, 20);
	assert.equal(reader.currentIdx, 1);
	assert.equal(reader.currentPage, 0);
	assert.equal(reader.stripScrollTop, 0);
	assert.equal(reader.loading, false);
});

test('author preview uses authenticated chapter API and writes no reading history', async (t) => {
	let requested, writes = 0;
	const { instance: reader, storage } = component('pages/readers/mangaReader.vue', { get: async (url, config) => { requested = { url, config }; return { status: 200, data: [article] }; }, post: async () => { writes++; } }, t);
	reader.isPreview = true; reader.novelId = 3; reader.articles = [{ article_id: 10, article_chapter: 1 }];
	await reader.openArticle(10, 0, 0);
	await reader.syncProgress(true);
	assert(requested.url.startsWith('/essays/get_article?'));
	assert.equal(requested.config.headers.Authorization, 'Bearer fixture');
	assert.equal(writes, 0);
	assert.equal(storage.has('MangaHistory_3'), false);
});

test('progress queued during in-flight sync is delivered after it, never dropped', async (t) => {
	const pending = deferred(); const sent = [];
	const { instance: reader } = component('pages/readers/mangaReader.vue', { post: async (_, body) => { sent.push(body); if (sent.length === 1) await pending.promise; } }, t);
	reader.novelId = 3; reader.articleId = 10; reader.articleData = article; reader.pages = clone(pages); reader.currentIdx = 0; reader.articles = [{ article_chapter: 1 }];
	const syncing = reader.syncProgress(true);
	reader.currentPage = 1; await reader.syncProgress(true);
	pending.resolve(); await syncing; await new Promise(setImmediate);
	assert.deepEqual(sent.map((p) => p.page_idx), [0, 1]);
});

test('reader delegates image taps to the gesture component instead of touchend-to-turn', () => {
	const source = fs.readFileSync(path.resolve(__dirname, '../pages/readers/mangaReader.vue'), 'utf8');
	assert(source.includes('@image-tap="onImageTap'));
	assert(!source.includes('onPagedTap'));
});

test('public content, metadata, click and catalogs all enforce parent visibility', async () => {
	for (const [file, name] of [['articles.js', '/get_article'], ['articles.js', '/get_article_info'], ['articles.js', '/get_article_novel_id'], ['articles.js', '/novel_clicked'], ['library.js', '/get_articles'], ['library.js', '/get_articles_all']]) {
		let clicks = 0;
		const handler = route(file, 'get', name, { query: async (sql) => {
			for (const clause of ['n.is_personal = 0', 'n.deleted = 0', 'a.is_draft = 0', 'a.deleted = 0']) assert(sql.includes(clause), `${name}: ${clause}`);
			return [];
		}, statistics: { novel_clicked: () => { clicks++; } }, sysLog() {} });
		const res = response(); await handler({ query: { id: 3 }, ip: 'fixture' }, res);
		assert.equal(clicks, 0);
		if (name === '/get_article' || name === '/novel_clicked') assert.equal(res.statusCode, 404);
	}
});

test('authenticated previews reject users without work access', async () => {
	const handler = route('essays.js', 'get', '/get_manga', { getCurrentUser: () => ({ user_id: 8 }), getNovelAccess: async () => null, canViewArticles: () => false, query: () => { throw new Error('must not query private data'); } });
	const res = response(); await handler({ query: { id: 3 } }, res);
	assert.equal(res.statusCode, 403);
});

test('revision token changes for title, type, draft and page changes even with null content_hash', () => {
	for (const changed of [{ title: '改名' }, { article_type: 'mangaPage' }, { is_draft: 1 }, { content: JSON.stringify({ pages: pages.slice(1) }) }]) {
		assert.notEqual(revisions.mangaRevision(article), revisions.mangaRevision({ ...article, ...changed, content_hash: null }));
	}
});

test('server rejects missing/stale revisions and detects a concurrent write during atomic UPDATE', async () => {
	for (const kind of ['missing', 'stale', 'race', 'success']) {
		let updates = 0;
		const handler = route('essays.js', 'post', '/modify_article', {
			getCurrentUser: () => ({ user_id: 7 }), getArticleAccess: async () => ({ article_id: 10, novel_id: 3, article_type: 'mangaStrip' }),
			canEditDraft: () => true, canPublish: () => true, isMangaArticleType: () => true,
			normalizeMangaContent: (content) => ({ ok: true, content: JSON.stringify(content) }), MANGA_ARTICLE_TYPES: ['mangaStrip', 'mangaPage'],
			sanitizeSessionId: () => null, normalizeWriterCreateTime: () => null, calculateContentHash: () => 'new-hash',
			getRestrictingActivityError: async () => null, getArticleCollaborationState: async () => null, REALTIME_CRDT_MODE: 'crdt',
			validateActiveEditSession: async () => ({ ok: true }), shouldMirrorWriterDraftForArticleType: () => false,
			query: async (sql, values) => {
				if (sql.startsWith('SELECT * FROM articles')) return [article];
				if (sql.startsWith('UPDATE articles SET `title`')) {
					updates++;
					assert(sql.includes(revisions.MANGA_REVISION_CONDITION));
					assert.deepEqual(clone(values.slice(-5)), clone(revisions.mangaRevisionValues(article)));
					return { affectedRows: kind === 'race' ? 0 : 1 };
				}
				assert.equal(kind, 'success', 'no effects after rejected update');
				return { affectedRows: 1 };
			},
		});
		const body = { article_id: 10, title: '改名', content: { pages }, is_draft: 1, article_type: 'mangaStrip', expected_manga_revision: kind === 'missing' ? null : kind === 'stale' ? 'old' : revisions.mangaRevision(article) };
		const res = response(); await handler({ body }, res);
		assert.equal(res.statusCode, kind === 'missing' ? 428 : kind === 'success' ? 200 : 409);
		assert.equal(updates, kind === 'race' || kind === 'success' ? 1 : 0);
	}
});

test('server progress validates chapter membership, page boundaries and uses canonical chapter number', async () => {
	for (const kind of ['wrong-work', 'negative', 'overflow', 'success']) {
		let writes = 0;
		const handler = route('library.js', 'post', '/update_reading_progress', { query: async (sql, values) => {
			if (sql.startsWith('SELECT a.article_chapter')) {
				assert(sql.includes('a.article_id = ? AND a.novel_id = ?'));
				assert(sql.includes(visibility.PUBLIC_ARTICLE));
				return kind === 'wrong-work' ? [] : [{ ...article, article_chapter: 1 }];
			}
			if (sql.startsWith('SELECT last_article_id')) return [];
			writes++; assert.equal(values[3], 1); return { affectedRows: 1 };
		} });
		const res = response();
		await handler({ user: [{ user_id: 7 }], body: { novel_id: 3, article_id: 10, article_chapter: 999, page_idx: kind === 'negative' ? -1 : kind === 'overflow' ? 2 : 1 } }, res);
		assert.equal(res.statusCode, kind === 'success' ? 200 : kind === 'wrong-work' ? 403 : 400);
		assert.equal(writes, kind === 'success' ? 1 : 0);
	}
});

test('draft-only collaborators cannot publish through the new-chapter endpoint', async () => {
	const handler = route('essays.js', 'post', '/add_article', {
		getCurrentUser: () => ({ user_id: 8 }), getNovelAccess: async () => rights, canAddArticle: () => true, canPublish: () => false,
		query: () => { throw new Error('must not write published chapter'); },
	});
	const res = response(); await handler({ body: { id: 3, is_draft: 0 } }, res);
	assert.equal(res.statusCode, 403);
});
