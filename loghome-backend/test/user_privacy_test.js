const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const express = require('express');
const { createPrivacyService, canViewList, canSendMessage } = require('../bin/userPrivacy.js');

function fixture() {
	const settings = new Map();
	const follows = [[1, 2], [2, 1], [3, 2]];
	const writes = [];
	const query = async (sql, params = []) => {
		if (sql.includes('SELECT user_id FROM user_privacy_settings LIMIT')) return [];
		if (sql.includes('FROM user_privacy_settings')) return settings.has(Number(params[0])) ? [settings.get(Number(params[0]))] : [];
		if (sql.includes('INSERT INTO user_privacy_settings')) {
			settings.set(Number(params[0]), { follow_list_visibility: params[1], direct_message_policy: params[2] });
			return { affectedRows: 1 };
		}
		if (sql.includes('SELECT user_id FROM users')) {
			return [1, 2, 3].includes(Number(params[0])) && (params.length === 1 || params[1] === 'pwd') ? [{ user_id: Number(params[0]) }] : [];
		}
		if (sql.includes('SELECT user_id, follow_id FROM user_follow')) {
			return follows.filter(([a, b]) => (a === Number(params[0]) && b === Number(params[1])) || (a === Number(params[2]) && b === Number(params[3])))
				.map(([user_id, follow_id]) => ({ user_id, follow_id }));
		}
		if (sql.startsWith('SELECT * FROM user_follow')) return follows.filter(([a, b]) => a === Number(params[0]) && b === Number(params[1]));
		if (sql.includes('COUNT(*)')) return [{ follows: 1, fans: 2 }];
		if (sql.includes('FROM user_follow f,users u')) return [{ user_id: 3, follow_id: 1, id: 3, name: '用户' }];
		if (sql.includes('INSERT INTO private_messages')) { writes.push(params); return { insertId: writes.length }; }
		throw new Error('Unexpected SQL: ' + sql);
	};
	const privacy = createPrivacyService({ query, verifyToken: token => {
		if (!/^user[123]$/.test(token)) throw new Error('Invalid token');
		return { id: Number(token.slice(4)), pwd: 'pwd' };
	} });
	return { settings, writes, query, privacy };
}

function loadRoute(relativePath, dependencies) {
	const filename = path.join(__dirname, '..', relativePath);
	const module = { exports: {} };
	vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
		module, exports: module.exports, console,
		require(name) {
			if (name in dependencies) return dependencies[name];
			if (name.startsWith('./community/')) return express.Router();
			if (name === 'express') return express;
			throw new Error('Unexpected dependency: ' + name);
		}
	}, { filename });
	return module.exports;
}

async function server(t, state) {
	const auth = (req, res, next) => {
		const token = String(req.headers.authorization || '').split(' ').pop();
		if (!/^user[123]$/.test(token)) return res.status(401).json({ msg: '请先登录' });
		req.user = [{ user_id: Number(token.slice(4)) }]; next();
	};
	const app = express();
	app.use(express.json());
	app.use('/users/privacy_settings', auth, loadRoute('routes/userPrivacy.js', { '../bin/userPrivacy.js': state.privacy }));
	app.use('/community', loadRoute('routes/community.js', {
		'../sql.js': { query: state.query }, '../bin/auth.js': auth, jsonwebtoken: {}, axios: {}, moment: {},
		'../SECRET.js': { SECRET: 'test-only' }, '../bin/message.js': { sendMail: (...args) => state.writes.push(args) },
		'../bin/achievements.js': {}, '../bin/avatarFrames.js': { decorateRows: async () => {} }, '../bin/userPrivacy.js': { ...state.privacy, validUserId: require('../bin/userPrivacy.js').validUserId }
	}));
	app.use((err, req, res, next) => res.status(500).json({ msg: 'Internal server error' }));
	const listener = app.listen(0, '127.0.0.1');
	await new Promise(resolve => listener.once('listening', resolve));
	t.after(() => new Promise(resolve => listener.close(resolve)));
	return async (url, { user, body } = {}) => {
		const response = await fetch(`http://127.0.0.1:${listener.address().port}${url}`, {
			method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(user ? { Authorization: 'Bearer user' + user } : {}) },
			...(body ? { body: JSON.stringify(body) } : {})
		});
		const text = await response.text();
		let data; try { data = JSON.parse(text); } catch (_) { data = text; }
		return { status: response.status, data };
	};
}

test('四种列表设置 × 本人/他人/游客的可见性矩阵', () => {
	for (const [value, expected] of [['public', [true, true]], ['following_only', [true, false]], ['fans_only', [false, true]], ['private', [false, false]]]) {
		for (const viewer of [null, 3]) {
			assert.equal(canViewList({ follow_list_visibility: value }, 'following', 2, viewer), expected[0]);
			assert.equal(canViewList({ follow_list_visibility: value }, 'fans', 2, viewer), expected[1]);
		}
		for (const kind of ['following', 'fans']) assert.equal(canViewList({ follow_list_visibility: value }, kind, 2, '2'), true);
	}
});

test('私信权限矩阵，关注方向按收件人判断，未知策略拒绝', () => {
	for (const recipientFollows of [false, true]) for (const senderFollows of [false, true]) {
		assert.equal(canSendMessage('default', recipientFollows, senderFollows), true);
		assert.equal(canSendMessage('following', recipientFollows, senderFollows), recipientFollows);
		assert.equal(canSendMessage('mutual', recipientFollows, senderFollows), recipientFollows && senderFollows);
		assert.equal(canSendMessage('none', recipientFollows, senderFollows), false);
		assert.equal(canSendMessage('invalid', recipientFollows, senderFollows), false);
	}
});

test('账户设置默认值、持久化、身份隔离和非法参数校验', async t => {
	const state = fixture(); const request = await server(t, state);
	assert.equal((await request('/users/privacy_settings')).status, 401);
	assert.deepEqual((await request('/users/privacy_settings', { user: 1 })).data, { follow_list_visibility: 'public', direct_message_policy: 'default' });
	for (const follow_list_visibility of ['public', 'following_only', 'fans_only', 'private']) for (const direct_message_policy of ['default', 'following', 'mutual', 'none']) {
		const body = { follow_list_visibility, direct_message_policy, user_id: 2 };
		assert.equal((await request('/users/privacy_settings', { user: 1, body })).status, 200);
		assert.deepEqual((await request('/users/privacy_settings', { user: 1 })).data, { follow_list_visibility, direct_message_policy });
	}
	assert.equal(state.settings.has(2), false);
	for (const body of [{}, { follow_list_visibility: 'all', direct_message_policy: 'default' }, { follow_list_visibility: 'public', direct_message_policy: 0 }]) {
		assert.equal((await request('/users/privacy_settings', { user: 1, body })).status, 422);
	}
});

test('实际列表路由限制访客，携带有效身份的本人始终可访问', async t => {
	const state = fixture(); const request = await server(t, state);
	for (const [visibility, following, fans] of [['public', 200, 200], ['following_only', 200, 403], ['fans_only', 403, 200], ['private', 403, 403]]) {
		state.settings.set(2, { follow_list_visibility: visibility, direct_message_policy: 'default' });
		for (const [kind, expected] of [['follows', following], ['fans', fans]]) {
			for (const user of [undefined, 3]) assert.equal((await request(`/community/get_${kind}_of?id=2`, { user })).status, expected);
			assert.equal((await request(`/community/get_${kind}_of?id=2`, { user: 2 })).status, 200);
		}
	}
	assert.equal((await request('/community/get_fans_of?id=-1')).status, 400);
});

test('私信及旧站内信入口均执行隐私校验，被拒绝不会写入', async t => {
	const state = fixture(); const request = await server(t, state);
	for (const route of ['send_message', 'send_mail']) {
		for (const [policy, sender, expected] of [['default', 3, 200], ['following', 1, 200], ['following', 3, 403], ['mutual', 1, 200], ['mutual', 3, 403], ['none', 1, 403]]) {
			state.settings.set(2, { follow_list_visibility: 'private', direct_message_policy: policy });
			const before = state.writes.length;
			const result = await request('/community/' + route, { user: sender, body: { to_id: 2, message_content: 'hi', title: 'hi', msg: 'hi' } });
			assert.equal(result.status, expected);
			assert.equal(state.writes.length, before + (expected === 200 ? 1 : 0));
		}
	}
	assert.equal((await request('/community/send_message', { user: 1, body: { to_id: 999, message_content: 'hi' } })).status, 404);
	assert.equal((await request('/community/send_message', { user: 1, body: { to_id: -1 } })).status, 400);
	assert.equal((await request('/community/send_message', { body: { to_id: 2 } })).status, 401);
});

test('旧好友合并接口和关系查询不能枚举他人的私密列表', async t => {
	const state = fixture(); const request = await server(t, state);
	state.settings.set(2, { follow_list_visibility: 'private', direct_message_policy: 'none' });
	assert.equal((await request('/community/get_friends_of?id=2', { user: 3 })).status, 403);
	assert.equal((await request('/community/get_friends_of?id=2', { user: 2 })).status, 200);
	assert.equal((await request('/community/follow_status?user_id=2&target_id=1', { user: 3 })).status, 403);
	assert.equal((await request('/community/follow_status?user_id=2&target_id=1', { user: 2 })).status, 200);
	assert.equal((await request('/community/follow_status?user_id=2&target_id=1', { user: 1 })).status, 200);
	assert.deepEqual((await request('/community/social_counts?id=2')).data, { follows: 1, fans: 2 });
});

test('伪造、失效和未激活身份不能获取本人豁免', async () => {
	const state = fixture();
	assert.equal(await state.privacy.getViewerId({ headers: { authorization: 'Bearer forged' } }), null);
	const invalid = createPrivacyService({ query: state.query, verifyToken: () => ({ id: 2, pwd: 'old-pwd' }) });
	assert.equal(await invalid.getViewerId({ headers: { authorization: 'Bearer token' } }), null);
	const inactive = createPrivacyService({ query: async () => [], verifyToken: () => ({ id: 2, pwd: 'pwd' }) });
	assert.equal(await inactive.getViewerId({ headers: { authorization: 'Bearer token' } }), null);
});

test('缺表时并发请求只初始化一次，数据库失败不降级为公开', async () => {
	let creates = 0;
	const service = createPrivacyService({ query: async sql => {
		if (sql.startsWith('SELECT user_id FROM user_privacy_settings LIMIT')) throw Object.assign(new Error('missing'), { code: 'ER_NO_SUCH_TABLE' });
		if (sql.includes('CREATE TABLE')) { creates++; return []; }
		return [];
	} });
	await Promise.all([service.getSettings(1), service.getSettings(2)]);
	assert.equal(creates, 1);
	const failing = createPrivacyService({ query: async () => { throw new Error('offline'); } });
	await assert.rejects(() => failing.getSettings(1), /offline/);
	let forwarded;
	await failing.listGuard('fans')({ query: { id: 2 }, headers: {} }, { status() { throw new Error('must not allow'); } }, error => { forwarded = error; });
	assert.match(forwarded.message, /offline/);
});
