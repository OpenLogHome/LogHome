const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('协作信息接口向有权限的作者返回作品公开状态', async () => {
	const source = fs.readFileSync(path.resolve(__dirname, '../routes/essays.js'), 'utf8');
	const start = source.indexOf("router.get('/get_novel_collaboration_info'");
	const end = source.indexOf("router.post('/invite_novel_collaborator'", start);
	assert.ok(start >= 0 && end > start);
	let handler;
	const router = { get: (...args) => { handler = args.at(-1); } };
	let queriedSql = '';
	vm.runInNewContext(source.slice(start, end), {
		router,
		auth() {},
		getCurrentUser: () => ({ user_id: 7 }),
		getNovelAccess: async () => ({ access_role: 'owner' }),
		canViewNovel: () => true,
		canManageCollaborators: () => true,
		canRespondInvitation: () => false,
		query: async sql => {
			queriedSql = sql;
			return [{ novel_id: 12, name: '测试作品', author_id: 7, is_personal: 1, owner_name: '作者' }];
		},
		listNovelCollaborators: async () => [],
		serializeAccess: access => access,
		serializeCollaborator: value => value,
		console: { log() {} },
	});
	const response = { status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
	await handler({ query: { novel_id: '12' } }, response);
	assert.equal(response.statusCode, undefined);
	assert.match(queriedSql, /n\.is_personal/);
	assert.equal(response.body.novel.is_personal, 1);
	assert.equal(response.body.novel.author_id, 7);
});
