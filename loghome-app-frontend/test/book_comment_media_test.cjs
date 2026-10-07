const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue/compiler-sfc');
const source = fs.readFileSync(path.resolve(__dirname, '../pages/readers/bookComment.vue'), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
function setup(axios = {}) {
	const module = { exports: {} };
	const parsed = compiler.parse({ source, filename: 'bookComment.vue' });
	vm.runInNewContext(parsed.script.content.replace(/^import .*;?\s*$/gm, '').replace('export default', 'module.exports ='), {
		module, axios, nothing: {}, commentItem: {}, emojiPicker: {}, darkModeMixin: {}, console, setTimeout, clearTimeout,
	});
	const context = { ...module.exports.methods, $baseUrl: '', utc2beijing: value => value, fetchPraiseStatusMap: async () => ({}) };
	return context;
}
const root = { essay_comment_id: 19671, name: '作者', media_urls: '[]', replies: [] };
test('empty serialized media, null and malformed fields never produce images', () => {
	const context = setup();
	for (const value of ['[]', null, undefined, '', 'null', '{}', 'invalid', [null, '', 12]]) {
		assert.deepEqual(plain(context.buildCommentItem({ ...root, media_urls: value }).media_urls), []);
	}
});
test('actual attachments survive array and JSON representations on comments and replies', () => {
	const context = setup();
	const images = ['https://example.com/a.png', 'https://example.com/b.gif'];
	for (const value of [images, JSON.stringify(images)]) {
		const result = context.buildCommentItem({ ...root, media_urls: value, replies: [{ essay_comment_id: 2, media_urls: value }] });
		assert.deepEqual(plain(result.media_urls), images);
		assert.deepEqual(plain(result.reviewLess[0].media_urls), images);
	}
});
test('message deep link preloads an older image-free comment without phantom thumbnails', async () => {
	let inserted;
	const context = setup({ get: async url => ({ data: url.includes('novel_comment_from_comment_id') ? [plain(root)] : [{ essay_comment_id: 2, media_urls: '[]' }] }) });
	context.$refs = { paging: { addDataFromTop: rows => { inserted = rows; } } };
	await context.loadComment(19671);
	assert.equal(inserted[0].comment_id, 19671);
	assert.deepEqual(plain(inserted[0].media_urls), []);
	assert.deepEqual(plain(inserted[0].reviewLess[0].media_urls), []);
});
test('single-comment backend endpoint returns parsed attachment arrays', async () => {
	const backend = fs.readFileSync(path.resolve(__dirname, '../../loghome-backend/routes/community.js'), 'utf8');
	const parser = backend.slice(backend.indexOf('function parseCommentMediaUrls('), backend.indexOf('function attachCentoData('));
	const route = backend.slice(backend.indexOf("router.get('/novel_comment_from_comment_id'"), backend.indexOf("router.get('/novel_commonts_amount'"));
	let handler, result;
	const rows = [{ media_urls: '[]' }, { media_urls: '["https://example.com/a.png"]' }, { media_urls: null }];
	vm.runInNewContext(parser + route, {
		router: { get: (_, fn) => { handler = fn; } }, query: async () => rows,
		avatarFrames: { decorateRows: async () => {} }, console,
	});
	await handler({ query: { comment_id: 19671 } }, { end: value => { result = JSON.parse(value); } });
	assert.deepEqual(result.map(item => item.media_urls), [[], ['https://example.com/a.png'], []]);
});
test('book comment template compiles with stable comment keys', () => {
	const parsed = compiler.parse({ source, filename: 'bookComment.vue' });
	assert.deepEqual(compiler.compileTemplate({ source: parsed.template.content, filename: 'bookComment.vue' }).errors, []);
	assert(source.includes(':key="item.comment_id"'));
});
