const assert = require('assert/strict');
const { createTtsService, FREE_VOICES } = require('../bin/tts');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const express = require('express');

async function verifyRoute() {
	const calls = [];
	const moduleStub = { exports: {} };
	const fakeRequire = (name) => {
		if (name === 'express') return express;
		if (name === '../bin/auth') return (req, res, next) => {
			if (req.headers.authorization !== 'Bearer loghome-login') return res.sendStatus(401);
			req.user = [{ user_id: 101 }];
			next();
		};
		if (name === '../bin/tts') return { createTtsService: () => ({
			getSession: async (id) => { calls.push(id); return { user_id: id, token: 'sk-tts-own' }; },
		}) };
		return {};
	};
	vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../routes/tts.js'), 'utf8'), {
		require: fakeRequire, module: moduleStub,
	});
	const app = express();
	app.use(express.json());
	app.use('/tts', moduleStub.exports);
	const server = await new Promise((resolve) => {
		const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
	});
	try {
		const url = `http://127.0.0.1:${server.address().port}/tts/session`;
		const denied = await fetch(url, { method: 'POST' });
		assert.equal(denied.status, 401);
		assert.equal(calls.length, 0);
		const response = await fetch(url, { method: 'POST',
			headers: { Authorization: 'Bearer loghome-login', 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_id: 999, token: 'someone-elses-token' }),
		});
		assert.equal(response.status, 200);
		assert.equal(response.headers.get('cache-control'), 'no-store');
		assert.equal((await response.json()).data.user_id, 101);
		assert.deepEqual(calls, [101], 'body identity must never select another user');
	} finally { await new Promise((resolve) => server.close(resolve)); }
}

function fixture() {
	let rows = new Map();
	let transactionQueue = Promise.resolve();
	const state = { creates: 0, revokes: [], revoked: new Set(), outage: false, failSave: false, missingVoice: false };
	const database = {
		query: async () => [],
		withTransaction(work) {
			const promise = transactionQueue.then(async () => {
				const before = new Map([...rows].map(([id, row]) => [id, { ...row }]));
				try {
					return await work(async (sql, args) => {
						if (sql.startsWith('INSERT')) { if (!rows.has(args[0])) rows.set(args[0], {}); return; }
						if (sql.startsWith('SELECT')) return [rows.get(args[0])];
						if (state.failSave) throw new Error('save failed');
						rows.set(args[2], { key_id: args[0], encrypted_token: args[1] });
					});
				} catch (error) { rows = before; throw error; }
			});
			transactionQueue = promise.catch(() => {});
			return promise;
		},
	};
	const http = {
		async get(url, options) {
			assert.equal(url, 'https://tts.codesocean.top/v1/voices');
			const token = options.headers.Authorization.split(' ')[1];
			if (state.revoked.has(token)) throw Object.assign(new Error('unauthorized'), { response: { status: 401 } });
			if (state.outage) throw Object.assign(new Error('busy'), { response: { status: 503 } });
			return { data: { data: FREE_VOICES.slice(state.missingVoice ? 1 : 0).map((v) => ({ id: `upstream-${v.id}`, name: v.name })) } };
		},
		async post(url, body, options) {
			assert.equal(options.headers['X-Admin-Key'], 'admin-test-secret');
			if (url.endsWith('/revoke')) { state.revokes.push(url); return {}; }
			assert.match(body.name, /^loghome-user-\d+$/);
			state.creates++;
			return { data: { id: state.creates, key: `sk-tts-test-${state.creates}` } };
		},
	};
	const config = { ttsAdminKey: 'admin-test-secret' };
	const service = createTtsService({ database, http, config });
	return { service, state, config, row: (id) => rows.get(id) };
}

async function run() {
	const f = fixture();
	const sessions = await Promise.all(Array.from({ length: 12 }, () => f.service.getSession(101)));
	assert.equal(f.state.creates, 1, 'simultaneous requests reuse one user key');
	assert.equal(new Set(sessions.map((s) => s.token)).size, 1);
	assert(!f.row(101).encrypted_token.includes(sessions[0].token), 'database must not store plaintext');
	assert(!JSON.stringify(sessions[0]).includes('admin-test-secret'));
	assert.equal(sessions[0].voices.length, 4);
	assert(sessions[0].voices.every((v) => v.free && v.voice_id === `upstream-${v.id}`));
	assert.equal(sessions[0].user_id, 101);
	const other = await f.service.getSession(202);
	assert.notEqual(other.token, sessions[0].token);
	const originalCipher = f.row(202).encrypted_token;
	f.row(202).encrypted_token = f.row(101).encrypted_token;
	await assert.rejects(f.service.getSession(202), 'encrypted tokens are bound to their owner');
	f.row(202).encrypted_token = originalCipher;
	f.state.revoked.add(sessions[0].token);
	const refreshed = await Promise.all([f.service.getSession(101), f.service.getSession(101)]);
	assert.equal(f.state.creates, 3, 'a revoked key is replaced exactly once');
	assert.equal(refreshed[0].token, refreshed[1].token);
	f.state.outage = true;
	await assert.rejects(f.service.getSession(101));
	assert.equal(f.state.creates, 3, 'transient errors must not mint additional keys');
	f.state.outage = false;
	f.state.missingVoice = true;
	await assert.rejects(f.service.getSession(101), /TTS_VOICE_UNAVAILABLE/);
	assert.equal(f.state.creates, 3);
	await assert.rejects(f.service.getSession(0), /INVALID_USER/);
	await assert.rejects(f.service.getSession(NaN), /INVALID_USER/);
	const failed = fixture();
	failed.state.failSave = true;
	await assert.rejects(failed.service.getSession(1), /save failed/);
	assert.equal(failed.state.revokes.length, 1, 'rollback revokes the unowned upstream key');
	assert.equal(failed.row(1), undefined);
	const missing = fixture();
	missing.config.ttsAdminKey = '';
	await assert.rejects(missing.service.getSession(1), /TTS_NOT_CONFIGURED/);
	assert.equal(missing.state.creates, 0);
	await verifyRoute();
	console.log('TTS tests passed: ownership, encryption, concurrent provisioning, recovery, and failures');
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
