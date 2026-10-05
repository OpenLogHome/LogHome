const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('打赏通知按作品类型指向漫画或书籍详情', async () => {
	const source = fs.readFileSync(path.resolve(__dirname, '../routes/library.js'), 'utf8');
	const start = source.indexOf("router.post('/tipping'");
	const end = source.indexOf("\nrouter.get('/get_tipping_amount_by_id'", start);
	assert.ok(start >= 0 && end > start);
	let handler;
	let novelType = 'manga';
	const notifications = [];
	vm.runInNewContext(source.slice(start, end), {
		router: { post: (...args) => { handler = args.at(-1); } },
		auth() {},
		bank: { useAmount: async () => true, addAmount: async () => {} },
		query: async sql => sql.startsWith('SELECT n.*') ? [{ novel_id: 398, novel_type: novelType, name: '测试作品', author_id: 7, auther_id: 7 }] : [],
		message: { sendMsg: (...args) => notifications.push(args) },
		console: { log() {} },
	});
	const request = { user: [{ user_id: 8 }], body: { from_id: 8, novel_id: 398, item_name: '原木', item_amount: 1, item_cost: 10, resource_name: 'log' } };
	const response = { end(body) { this.body = body; }, json() { throw new Error('unexpected error response'); } };
	await handler(request, response);
	assert.equal(response.body, 'success');
	assert.match(notifications[0][2], /打赏了你的漫画《测试作品》/);
	assert.equal(notifications[0][3], 'readers/mangaInfo?id=398');
	novelType = 'novel';
	await handler(request, response);
	assert.match(notifications[1][2], /打赏了你的小说《测试作品》/);
	assert.equal(notifications[1][3], 'readers/bookInfo?id=398');
});
