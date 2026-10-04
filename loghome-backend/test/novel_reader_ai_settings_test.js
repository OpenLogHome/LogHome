const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const express = require('express');
const { createNovelReaderAiSettingsService, validNovelId } = require('../bin/novelReaderAiSettings.js');

function fixture() {
	const settings = new Map();
	const queries = [];
	const query = async (sql, params = []) => {
		queries.push(sql);
		if (sql.startsWith('SELECT disable_reader_ai FROM novel_reader_ai_settings')) {
			return settings.has(params[0]) ? [{ disable_reader_ai: settings.get(params[0]) }] : [];
		}
		if (sql.startsWith('INSERT INTO novel_reader_ai_settings')) {
			settings.set(params[0], params[1]);
			return { affectedRows: 1 };
		}
		if (sql.startsWith('SELECT novel_id FROM novels')) {
			return [11, 12].includes(params[0]) ? [{ novel_id: params[0] }] : [];
		}
		if (sql.includes('FROM novels n') && sql.includes('JOIN users u')) {
			return Number(params[0]) === 11 ? [{ novel_id: 11, name: '测试作品', is_personal: 0 }] : [];
		}
		if (sql.startsWith('SELECT * FROM bookcase')) return [];
		throw new Error('Unexpected SQL: ' + sql);
	};
	return { settings, query, queries };
}

test('旧作品默认允许，保存开关后可恢复，运行时不执行建表', async () => {
	const state = fixture();
	const service = createNovelReaderAiSettingsService({ query: state.query });
	assert.deepEqual(await Promise.all([service.isDisabled(11), service.isDisabled(12)]), [false, false]);
	assert.deepEqual(await service.setDisabled(11, 1), { disable_reader_ai: 1 });
	assert.equal(await service.isDisabled(11), true);
	assert.equal(await service.isDisabled(12), false);
	await service.setDisabled(11, 0);
	assert.equal(await service.isDisabled(11), false);
	assert.equal(state.queries.length, 7);
	assert.ok(state.queries.every(sql => !/\b(?:CREATE|ALTER|DROP)\b/i.test(sql)));
});

test('缺少已迁移的数据表时直接返回数据库错误，不在请求中创建表', async () => {
	const statements = [];
	const missingTable = Object.assign(new Error('missing table'), { code: 'ER_NO_SUCH_TABLE' });
	const service = createNovelReaderAiSettingsService({
		query: async (sql) => { statements.push(sql); throw missingTable; },
	});
	await assert.rejects(service.isDisabled(11), { code: 'ER_NO_SUCH_TABLE' });
	assert.equal(statements.length, 1);
	assert.match(statements[0], /^SELECT disable_reader_ai FROM novel_reader_ai_settings/);
});

test('参数无效、作品不存在及作者禁用均在提问前被拒绝', async () => {
	const state = fixture();
	const service = createNovelReaderAiSettingsService({ query: state.query });
	await assert.rejects(service.setDisabled(11, 2), { statusCode: 422 });
	await assert.rejects(service.setDisabled(0, 1), { statusCode: 422 });
	await assert.rejects(service.assertAllowed('abc'), { statusCode: 400 });
	await assert.rejects(service.assertAllowed(13), { statusCode: 404 });
	await service.assertAllowed(11);
	await service.setDisabled(11, 1);
	await assert.rejects(service.assertAllowed(11), { statusCode: 403, code: 'READER_AI_DISABLED' });
});

test('读者提问路由先检查作者开关，禁用时不扣除红石', async (t) => {
	const state = fixture();
	const settings = createNovelReaderAiSettingsService({ query: state.query });
	const charges = [];
	const filename = path.join(__dirname, '../routes/library.js');
	const module = { exports: {} };
	const dependencies = {
		express,
		'../sql.js': { query: state.query },
		'../bin/auth.js': (req, res, next) => { req.user = [{ user_id: 7 }]; next(); },
		moment: {},
		'../bin/message.js': {},
		'../bin/bank.js': {},
		'../bin/redstone.js': { consumeRedstone: async (...args) => { charges.push(args); } },
		'../bin/avatarFrames.js': {},
		'../bin/readerNovelAiChat.js': { handleReaderNovelChatStream: (req, res) => res.json({ ok: true }) },
		'../bin/agentIndexing.js': {},
		'../bin/novelReaderAiSettings.js': settings,
		'../bin/readingVisibility.js': { PUBLIC_ARTICLE: '1=1', PUBLIC_NOVEL: '1=1' },
		'./library/recommand': express.Router(),
	};
	vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
		module, exports: module.exports, console,
		require(name) {
			if (name in dependencies) return dependencies[name];
			throw new Error('Unexpected dependency: ' + name);
		},
	}, { filename });
	const app = express();
	app.use(express.json());
	app.use('/library', module.exports);
	const listener = app.listen(0, '127.0.0.1');
	await new Promise(resolve => listener.once('listening', resolve));
	t.after(() => new Promise(resolve => listener.close(resolve)));
	const ask = async (novelId) => {
		const response = await fetch(`http://127.0.0.1:${listener.address().port}/library/reader_novel_ai_chat_stream`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ novel_id: novelId }),
		});
		return { status: response.status, body: await response.json() };
	};
	await settings.setDisabled(11, 1);
	const disabledDetail = await fetch(`http://127.0.0.1:${listener.address().port}/library/get_novel_by_id?id=11`);
	assert.equal((await disabledDetail.json())[0].disable_reader_ai, 1);
	const disabledIndex = await fetch(`http://127.0.0.1:${listener.address().port}/library/reader_novel_summary_index_status?novel_id=11`);
	assert.equal(disabledIndex.status, 403);
	assert.deepEqual(await ask(11), {
		status: 403,
		body: {
			code: 'READER_AI_DISABLED',
			msg: '作者已关闭本作品的原木娘提问功能',
			message: '作者已关闭本作品的原木娘提问功能',
		},
	});
	assert.equal(charges.length, 0);
	await settings.setDisabled(11, 0);
	const enabledDetail = await fetch(`http://127.0.0.1:${listener.address().port}/library/get_novel_by_id?id=11`);
	assert.equal((await enabledDetail.json())[0].disable_reader_ai, 0);
	assert.equal((await ask(11)).status, 200);
	assert.equal(charges.length, 1);
});

test('只有作品主作者可以修改提问开关，非法值不会写入', async (t) => {
	const state = fixture();
	const settings = createNovelReaderAiSettingsService({ query: state.query });
	const filename = path.join(__dirname, '../routes/essays.js');
	const module = { exports: {} };
	vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
		module, exports: module.exports, console, process: { env: {} },
		require(name) {
			if (name === 'express') return express;
			if (name === '../sql.js') return { query: state.query };
			if (name === '../bin/auth.js') return (req, res, next) => {
				req.user = [{ user_id: Number(req.headers['x-test-user'] || 0) }]; next();
			};
			if (name === '../bin/novelReaderAiSettings.js') return { ...settings, validNovelId };
			if (name === '../bin/novelCollaboration.js') return {
				getNovelAccess: async (userId) => ({ access_role: userId === 1 ? 'owner' : 'collaborator' }),
				normalizeUser: (rows) => rows[0],
			};
			if (name === '../config') return {};
			if (['fs', 'path', 'crypto'].includes(name)) return require(name);
			return {};
		},
	}, { filename });
	const app = express();
	app.use(express.json());
	app.use('/essays', module.exports);
	const listener = app.listen(0, '127.0.0.1');
	await new Promise(resolve => listener.once('listening', resolve));
	t.after(() => new Promise(resolve => listener.close(resolve)));
	const save = async (userId, disabled) => {
		const response = await fetch(`http://127.0.0.1:${listener.address().port}/essays/set_novel_reader_ai_setting`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-test-user': String(userId) },
			body: JSON.stringify({ novel_id: 11, disable_reader_ai: disabled }),
		});
		return { status: response.status, body: await response.json() };
	};
	assert.equal((await save(2, 1)).status, 403);
	assert.equal(state.settings.size, 0);
	assert.equal((await save(1, 2)).status, 422);
	assert.equal(state.settings.size, 0);
	assert.deepEqual(await save(1, 1), { status: 200, body: { disable_reader_ai: 1 } });
	assert.equal(state.settings.get(11), 1);
	const detail = await fetch(`http://127.0.0.1:${listener.address().port}/essays/get_novel_by_id?id=11`);
	assert.equal((await detail.json())[0].disable_reader_ai, 1);
});
