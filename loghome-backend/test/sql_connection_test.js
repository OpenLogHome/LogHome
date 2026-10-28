const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function fixture({ connectCodes = [], queryError = null, commitError = null } = {}) {
	const calls = { acquire: 0, query: 0, begin: 0, commit: 0, rollback: 0, release: 0, delays: [] };
	const connection = {
		query(sql, values, done) { calls.query++; done(queryError, [{ ok: 1 }]); },
		beginTransaction(done) { calls.begin++; done(); },
		commit(done) { calls.commit++; done(commitError); },
		rollback(done) { calls.rollback++; done(); },
		release() { calls.release++; },
	};
	const pool = { getConnection(done) {
		const code = connectCodes[calls.acquire++];
		done(code ? Object.assign(new Error(code), { code }) : null, code ? null : connection);
	} };
	const moduleStub = { exports: {} };
	vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../sql.js'), 'utf8'), {
		require(name) {
			if (name === 'mysql') return { createPool: () => pool };
			if (name === './config') return { database: { host: 'database.test' } };
			throw new Error(`Unexpected module ${name}`);
		},
		module: moduleStub,
		console: { warn() {}, log() {} },
		setTimeout(done, ms) { calls.delays.push(ms); done(); },
	});
	return { api: moduleStub.exports, calls };
}

async function run() {
	const recovering = fixture({ connectCodes: ['ENOTFOUND', 'EAI_AGAIN'] });
	await recovering.api.query('SELECT 1');
	assert.equal(recovering.calls.acquire, 3);
	assert.equal(recovering.calls.query, 1);
	assert.equal(recovering.calls.release, 1);
	assert.equal(recovering.calls.delays.length, 2);
	const failed = fixture({ connectCodes: Array(10).fill('ENOTFOUND') });
	await assert.rejects(failed.api.query('SELECT 1'), { code: 'ENOTFOUND' });
	assert.equal(failed.calls.acquire, 4);
	assert.equal(failed.calls.query, 0);
	const denied = fixture({ connectCodes: ['ER_ACCESS_DENIED_ERROR'] });
	await assert.rejects(denied.api.query('SELECT 1'), { code: 'ER_ACCESS_DENIED_ERROR' });
	assert.equal(denied.calls.acquire, 1);
	const writeError = Object.assign(new Error('connection lost after write'), { code: 'ECONNRESET' });
	const write = fixture({ queryError: writeError });
	await assert.rejects(write.api.query('UPDATE counters SET value = value + 1'), writeError);
	assert.equal(write.calls.query, 1, 'writes must never be replayed');
	assert.equal(write.calls.acquire, 1);
	assert.equal(write.calls.release, 1);
	const commit = fixture({ connectCodes: ['ENOTFOUND'], commitError: writeError });
	let transactions = 0;
	await assert.rejects(commit.api.withTransaction(async (query) => {
		transactions++;
		await query('UPDATE counters SET value = value + 1');
	}), writeError);
	assert.equal(transactions, 1, 'transaction callbacks must never be replayed');
	assert.equal(commit.calls.acquire, 2);
	assert.equal(commit.calls.commit, 1);
	assert.equal(commit.calls.rollback, 1);
	assert.equal(commit.calls.release, 1);
	console.log('SQL connection tests passed: DNS recovery, bounded retries, no SQL/transaction replay');
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
