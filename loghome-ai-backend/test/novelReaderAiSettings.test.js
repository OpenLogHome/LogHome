const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadModule(relativePath, dependencies) {
	const filename = path.join(__dirname, '..', relativePath);
	const module = { exports: {} };
	vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
		module, exports: module.exports, __dirname: path.dirname(filename), console,
		require(name) {
			if (name in dependencies) return dependencies[name];
			throw new Error('Unexpected dependency: ' + name);
		},
	}, { filename });
	return module.exports;
}

test('AI 服务读取作者设置，旧作品默认允许，已禁用作品返回 403', async () => {
	const settings = new Map([[12, 1]]);
	const statements = [];
	const query = async (sql, params = []) => {
		statements.push(sql);
		if (sql.startsWith('SELECT novel_id FROM novels')) {
			return [11, 12].includes(params[0]) ? [{ novel_id: params[0] }] : [];
		}
		if (sql.startsWith('SELECT disable_reader_ai FROM novel_reader_ai_settings')) {
			return settings.has(params[0]) ? [{ disable_reader_ai: settings.get(params[0]) }] : [];
		}
		throw new Error('Unexpected SQL: ' + sql);
	};
	const service = loadModule('bin/novelReaderAiSettings.js', { '../sql': { query } });
	await service.assertNovelReaderAiAllowed(11);
	await assert.rejects(service.assertNovelReaderAiAllowed(12), { statusCode: 403, code: 'READER_AI_DISABLED' });
	await assert.rejects(service.assertNovelReaderAiAllowed(13), { statusCode: 404 });
	assert.ok(statements.every(sql => !/\b(?:CREATE|ALTER|DROP)\b/i.test(sql)));
});

test('AI 服务缺少已迁移的数据表时直接返回数据库错误', async () => {
	const missingTable = Object.assign(new Error('missing table'), { code: 'ER_NO_SUCH_TABLE' });
	const service = loadModule('bin/novelReaderAiSettings.js', {
		'../sql': {
			query: async (sql) => {
				if (sql.startsWith('SELECT novel_id FROM novels')) return [{ novel_id: 11 }];
				throw missingTable;
			},
		},
	});
	await assert.rejects(service.assertNovelReaderAiAllowed(11), { code: 'ER_NO_SUCH_TABLE' });
});

test('独立 AI 提问路由在计费和建任务前校验当前作品', async () => {
	let chargeCount = 0;
	const checked = [];
	const taskService = loadModule('bin/chatTaskService.js', {
		'./readerNovelAiChat': { runReaderNovelChat: async () => ({ message: 'ok' }) },
		'./redstoneBilling': {
			consumeRedstone: async () => { chargeCount += 1; },
			sendBillingError: () => false,
		},
		'./novelReaderAiSettings': {
			assertNovelReaderAiAllowed: async (id) => {
				checked.push(id);
				if (id === 12) throw Object.assign(new Error('作者已关闭本作品的原木娘提问功能'), {
					code: 'READER_AI_DISABLED', statusCode: 403,
				});
			},
		},
	});
	const req = {
		body: { novel_id: 11, active_novel_id: 12, session_id: 's', message_id: 'm', task_id: 'disabled-work-test' },
		query: {}, user: { user_id: 7 },
	};
	const res = {
		status(code) { this.statusCode = code; return this; },
		json(value) { this.body = value; return this; },
	};
	await taskService.handleReaderNovelChatTaskStream(req, res);
	assert.deepEqual(checked, [11, 12]);
	assert.equal(res.statusCode, 403);
	assert.equal(res.body.code, 'READER_AI_DISABLED');
	assert.equal(chargeCount, 0);
});
