const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const { Readable, PassThrough } = require('node:stream');
const { buildCorrectionPlan, runCorrectionPlan } = require('../bin/writerTextCorrectionPipeline');

function paragraph(text, index = 1) {
	return { text, paragraph_index: index, paragraph_id: index + 100, paragraph_hash: 'hash-' + index };
}
function streamResponse(content, finishReason = 'stop') {
	const line = 'data: ' + JSON.stringify({ choices: [{ delta: { content }, finish_reason: finishReason }] }) + '\n\n';
	const bytes = Buffer.from(line);
	// 每个汉字可跨多个网络字节包。
	return { ok: true, body: Readable.from(Array.from(bytes, byte => Buffer.from([byte]))) };
}
function fixture(fetchImpl, options = {}) {
	const req = new EventEmitter();
	req.user = { user_id: 5 };
	req.body = { article_id: 12, request_id: 'fixture-request', paragraphs: options.paragraphs || [paragraph('错别子')] };
	const res = new EventEmitter();
	const events = [];
	const headers = {};
	let billingCalls = 0;
	res.setHeader = (name, value) => { headers[name] = value; };
	res.flushHeaders = () => {};
	res.write = value => { events.push(JSON.parse(value)); return true; };
	res.end = () => { res.writableEnded = true; res.emit('finish'); };
	res.status = status => { res.statusCode = status; return res; };
	res.json = value => { res.jsonResult = value; res.end(); };
	const module = { exports: {} };
	const sandbox = {
		module, exports: module.exports, Buffer, AbortController,
		process: { env: options.env || {} },
		console: { info() {}, warn() {}, log() {} },
		setTimeout: options.setTimeout || setTimeout,
		clearTimeout, setInterval: options.setInterval || setInterval, clearInterval,
		require(name) {
			if (name === 'node-fetch') return fetchImpl;
			if (name === '../sql.js') return { query: async () => [{ article_id: 12, author_id: 5 }] };
			if (name === '../config.js') return { api: { writerAssist: { textCorrection: {
				apiKey: options.missingKey ? '' : 'fixture-key', baseUrl: 'http://model.fixture', model: 'deepseek-reasoner-fast',
			} } } };
			if (name === './redstoneBilling') return {
				consumeRedstone: async data => { billingCalls += 1; assert.equal(data.amount, 2); },
				sendBillingError: () => false,
			};
			if (name === './writerTextCorrectionPipeline') return require('../bin/writerTextCorrectionPipeline');
			return require(name);
		},
	};
	vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../bin/writerTextCorrection.js'), 'utf8'), sandbox);
	return { req, res, events, headers, run: () => module.exports.handleWriterTextCorrection(req, res), billingCalls: () => billingCalls };
}

test('bounds long chapters and preserves the tail and unicode boundaries of a long paragraph', () => {
	const text = '正'.repeat(1399) + '🌲' + '文'.repeat(7000) + '结尾错别子';
	const plan = buildCorrectionPlan([paragraph(text)]);
	assert(plan.batches.length > 1);
	assert.equal(plan.segments[0].source_offset, 0);
	assert(plan.segments.at(-1).text.endsWith('结尾错别子'));
	let reached = 0;
	for (const segment of plan.segments) {
		assert(segment.source_offset <= reached);
		assert.equal(segment.text, text.slice(segment.source_offset, segment.source_offset + segment.text.length));
		assert(!/^[\udc00-\udfff]|[\ud800-\udbff]$/.test(segment.text));
		reached = segment.source_offset + segment.text.length;
	}
	assert.equal(reached, text.length);
	assert(plan.batches.every(batch => batch.length <= 12 && batch.reduce((n, item) => n + item.text.length, 0) <= 2800));
});

test('concurrency is bounded, sparse source indices survive and progress only reflects finished work', async () => {
	const paragraphs = Array.from({ length: 40 }, (_, index) => paragraph('正常正文。'.repeat(20), index * 3 + 2));
	let active = 0, peak = 0;
	const progress = [], incremental = [];
	const result = await runCorrectionPlan(paragraphs, {
		batchChars: 400, batchParagraphs: 4, concurrency: 2,
		analyzeBatch: async batch => {
			peak = Math.max(peak, ++active);
			await new Promise(resolve => setTimeout(resolve, 2));
			active -= 1;
			return batch.map(() => ({ fragments: [], error: null }));
		},
		onParagraphResult: item => incremental.push(item),
		onProgress: item => { assert.equal(item.analyzed, incremental.length); progress.push(item); },
	});
	assert.equal(peak, 2);
	assert.equal(result.paragraph_results.length, 40);
	assert.deepEqual(result.paragraph_results.map(item => item.paragraph_index), paragraphs.map(item => item.paragraph_index));
	assert.equal(progress[0].analyzed, 0);
	assert.equal(progress.at(-1).analyzed, 40);
});

test('maps corrections after character 2000 back to full paragraphs and deduplicates overlap', async () => {
	const text = '甲'.repeat(1350) + '错别子' + '乙'.repeat(1600) + '错别子';
	const result = await runCorrectionPlan([paragraph(text, 8)], {
		analyzeBatch: async batch => batch.map(segment => {
			const fragments = Array.from(segment.text.matchAll(/错别子/g), match => ({
				begin_pos: match.index, end_pos: match.index + 3,
				original_fragment: '错别子', corrected_fragment: '错别字',
			}));
			return { fragments, error: null };
		}),
	});
	assert.equal(result.paragraph_results[0].original_text, text);
	assert.equal(result.paragraph_results[0].corrected_text, text.replaceAll('错别子', '错别字'));
	assert.equal(result.summary.issue_count, 2);
	assert.equal(result.paragraph_results[0].paragraph_index, 8);
});

test('shrinks failed batches, keeps successful work and marks persistent failure explicitly', async () => {
	const attempted = [];
	const result = await runCorrectionPlan([paragraph('通过一', 1), paragraph('失败', 2), paragraph('通过三', 3)], {
		analyzeBatch: async batch => {
			attempted.push(batch.map(item => item.text));
			if (batch.some(item => item.text === '失败')) throw new Error('本批超时');
			return batch.map(() => ({ fragments: [], error: null }));
		},
	});
	assert.equal(result.summary.error_count, 2); // 失败的缩小批次仍含第一段，不伪造成功。
	assert.equal(result.paragraph_results[2].error, null);
	assert.equal(attempted.length, 3);
	assert(attempted.slice(1).every(batch => batch.length < attempted[0].length));
});

test('service streams valid UTF-8 corrections and completed paragraphs, and bills once', async () => {
	const texts = [paragraph('错别子', 4), paragraph('正常', 9)];
	const f = fixture(async (_, options) => {
		const body = JSON.parse(options.body);
		assert.equal(body.thinking.type, 'disabled');
		assert.equal(body.max_tokens, 4096);
		return streamResponse(JSON.stringify({ paragraphs: [{ paragraph_index: 1, fragments: [{ original_fragment: '错别子', corrected_fragment: '错别字' }] }] }));
	}, { paragraphs: texts });
	await f.run();
	assert.equal(f.billingCalls(), 1);
	assert.equal(f.events.filter(event => event.type === 'paragraph_result').length, 2);
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.paragraph_results[0].corrected_text, '错别字');
	assert.equal(result.paragraph_results[1].paragraph_index, 9);
	assert.equal(f.headers['X-Accel-Buffering'], 'no');
	assert.equal(f.res.listenerCount('close'), 1); // 仅流 writer 的关闭状态监听器。
});

test('invalid JSON, truncated output and reasoning-only output are never clean results', async () => {
	for (const [content, reason] of [['{}', 'stop'], ['{"paragraphs":[]}', 'length'], ['', 'stop']]) {
		let calls = 0;
		const f = fixture(async () => { calls += 1; return streamResponse(content, reason); });
		await f.run();
		assert.equal(calls, 2);
		assert.equal(f.billingCalls(), 1);
		assert.equal(f.events.find(event => event.type === 'done').result.summary.error_count, 1);
	}
});

test('repeated adjacent delta characters are not removed from model JSON', async () => {
	const model = JSON.stringify({ paragraphs: [{ paragraph_index: 1, fragments: [{ original_fragment: '哈哈', corrected_fragment: '嘿嘿' }] }] });
	const f = fixture(async () => ({
		ok: true,
		body: Readable.from([...Array.from(model, content => Buffer.from('data: ' + JSON.stringify({ choices: [{ delta: { content } }] }) + '\n')),
			Buffer.from('data: [DONE]\n')]),
	}), { paragraphs: [paragraph('哈哈')] });
	await f.run();
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.summary.error_count, 0);
	assert.equal(result.paragraph_results[0].corrected_text, '嘿嘿');
});

test('unauthorized upstream errors do not retry and missing credentials do not bill', async () => {
	let calls = 0;
	const f = fixture(async () => { calls += 1; return { ok: false, status: 401, json: async () => ({ message: 'invalid key' }) }; });
	await f.run();
	assert.equal(calls, 1);
	assert.match(f.events.find(event => event.type === 'error').message, /invalid key/);
	const missing = fixture(async () => { throw new Error('must not request'); }, { missingKey: true });
	await missing.run();
	assert.equal(missing.res.statusCode, 503);
	assert.equal(missing.billingCalls(), 0);
});

test('heartbeat continues while a model stalls and client disconnect aborts the upstream stream', async () => {
	let signal, heartbeat;
	const body = new PassThrough();
	const f = fixture(async (_, options) => {
		signal = options.signal;
		signal.addEventListener('abort', () => body.destroy(Object.assign(new Error('aborted'), { name: 'AbortError' })));
		return { ok: true, body };
	}, { setInterval: callback => { heartbeat = callback; return { unref() {} }; } });
	const running = f.run();
	await new Promise(resolve => setImmediate(resolve));
	heartbeat();
	assert(f.events.some(event => event.type === 'heartbeat'));
	f.res.destroyed = true;
	f.res.emit('close');
	await running;
	assert.equal(signal.aborted, true);
	assert.equal(f.events.filter(event => event.type === 'done').length, 0);
});

test('model deadlines abort stalled streams, retry within the limit and report failure', async () => {
	const deadlines = [];
	let requests = 0;
	const f = fixture(async (_, options) => {
		requests += 1;
		const body = new PassThrough();
		options.signal.addEventListener('abort', () => body.destroy(Object.assign(new Error('aborted'), { name: 'AbortError' })));
		return { ok: true, body };
	}, { setTimeout: callback => { deadlines.push(callback); return { unref() {} }; } });
	const running = f.run();
	await new Promise(resolve => setImmediate(resolve));
	deadlines[0]();
	await new Promise(resolve => setImmediate(resolve));
	deadlines[1]();
	await running;
	assert.equal(requests, 2);
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.summary.error_count, 1);
	assert.match(result.errors[0].message, /超时/);
});
