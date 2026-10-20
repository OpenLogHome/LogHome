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
	const requests = [];
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
			if (name === 'node-fetch') return (...args) => {
				requests.push(JSON.parse(args[1].body));
				return fetchImpl(...args);
			};
			if (name === '../sql.js') return { query: async () => [{ article_id: 12, author_id: 5 }] };
			if (name === '../config.js') return { api: { writerAssist: { textCorrection: {
				apiKey: options.missingKey ? '' : 'fixture-key', baseUrl: 'http://model.fixture', model: options.model || 'deepseek-reasoner-fast',
			} } } };
			if (name === './redstoneBilling') return {
				consumeRedstone: async data => { billingCalls += 1; assert.equal(data.amount, 2); },
				sendBillingError: () => false,
			};
			if (name === './writerTextCorrectionPipeline') return require('../bin/writerTextCorrectionPipeline');
			if (name === './modelOutputLoopDetector') return require('../bin/modelOutputLoopDetector');
			return require(name);
		},
	};
	vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../bin/writerTextCorrection.js'), 'utf8'), sandbox);
	return { req, res, events, requests, headers, run: () => module.exports.handleWriterTextCorrection(req, res), billingCalls: () => billingCalls };
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
	const answer = '第1段中，“错别子”应改成“错别字”。其余没有发现明确问题。';
	const f = fixture(async (_, options) => {
		const body = JSON.parse(options.body);
		assert.equal(body.thinking.type, 'disabled');
		assert.equal(body.max_tokens, 4096);
		if (!body.response_format) {
			assert.match(body.messages[1].content, /\[段落1\] 错别子/);
			assert.doesNotMatch(body.messages[0].content, /JSON|fragments|paragraph_index|返回格式|空数组/);
			return streamResponse(answer);
		}
		assert.equal(body.messages[1].content, answer);
		assert.equal(body.messages.length, 2);
		assert.deepEqual(body.response_format, { type: 'json_object' });
		return streamResponse(JSON.stringify({ paragraphs: [{ paragraph_index: 1, fragments: [{ original_fragment: '错别子', corrected_fragment: '错别字' }] }] }));
	}, { paragraphs: texts });
	await f.run();
	assert.equal(f.billingCalls(), 1);
	assert.equal(f.events.filter(event => event.type === 'paragraph_result').length, 2);
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.paragraph_results[0].corrected_text, '错别字');
	assert.equal(result.paragraph_results[1].paragraph_index, 9);
	assert.equal(result.summary.model_request_count, 2);
	assert.equal(result.summary.batch_attempt_count, 1);
	assert.equal(f.requests.length, 2);
	assert.equal(f.events.filter(event => event.type === 'analysis_delta').map(event => event.content).join(''), answer);
	assert(!f.events.some(event => event.type === 'reasoning_delta' || event.type === 'delta'));
	assert.equal(f.headers['X-Accel-Buffering'], 'no');
	assert.equal(f.res.listenerCount('close'), 1); // 仅流 writer 的关闭状态监听器。
});

test('both stages force non-thinking mode even when old thinking environment settings are enabled', async () => {
	for (const model of ['deepseek-reasoner-fast', 'qwen3.8', 'Qwen/Qwen3-32B', 'Spark-X2.5-4B', 'gpt-5.1']) {
		const f = fixture(async (_, options) => streamResponse(JSON.parse(options.body).response_format
			? '{"paragraphs":[]}' : '没有发现需要修正的问题。'), {
			model,
			env: { WRITER_TEXT_CORRECTION_ENABLE_THINKING: 'true', WRITER_TEXT_CORRECTION_REASONING_EFFORT: 'xhigh' },
		});
		await f.run();
		assert.equal(f.requests.length, 2);
		for (const body of f.requests) {
			if (model.startsWith('deepseek-')) assert.deepEqual(body.thinking, { type: 'disabled' });
			else if (/qwen|spark/i.test(model)) {
				assert.equal(body.enable_thinking, false);
				assert.deepEqual(body.chat_template_kwargs, { enable_thinking: false });
				assert.equal(body.reasoning_effort, undefined);
				if (/spark/i.test(model)) assert.deepEqual(body.thinking, { type: 'disabled' });
			} else assert.equal(body.reasoning_effort, 'none');
		}
		assert.equal(f.events.find(event => event.type === 'done').result.summary.error_count, 0);
	}
});

test('an upstream that ignores thinking=disabled is stopped immediately in either stage', async () => {
	for (const stage of ['analysis', 'formatting']) {
		let signal;
		const f = fixture(async (_, options) => {
			const current = JSON.parse(options.body).response_format ? 'formatting' : 'analysis';
			if (stage !== current) return streamResponse('没有发现需要修正的问题。');
			signal = options.signal;
			return { ok: true, body: Readable.from([
				Buffer.from('data: ' + JSON.stringify({ choices: [{ delta: { reasoning_content: '不应继续思考' } }] }) + '\n'),
			]) };
		});
		await f.run();
		assert.equal(f.requests.length, stage === 'analysis' ? 1 : 2);
		assert.equal(signal.aborted, true);
		assert.match(f.events.find(event => event.type === 'error').message, /关闭 thinking/);
		assert(!f.events.some(event => ['reasoning_delta', 'thinking_delta', 'paragraph_result', 'done'].includes(event.type)));
	}
});

test('results and progress remain pending until JSON formatting has finished', async () => {
	const body = new PassThrough();
	const f = fixture(async (_, options) => JSON.parse(options.body).response_format
		? { ok: true, body } : streamResponse('没有发现需要修正的问题。'));
	const running = f.run();
	await new Promise(resolve => setImmediate(resolve));
	assert.equal(f.requests.length, 2);
	assert(f.events.some(event => event.type === 'analysis_delta'));
	assert(!f.events.some(event => event.type === 'paragraph_result' || event.type === 'done'));
	assert(f.events.filter(event => event.type === 'progress').every(event => event.analyzed === 0));
	body.end('data: ' + JSON.stringify({ choices: [{ delta: { content: '{"paragraphs":[]}' }, finish_reason: 'stop' }] }) + '\n');
	await running;
	assert.equal(f.events.filter(event => event.type === 'paragraph_result').length, 1);
	assert.equal(f.events.find(event => event.type === 'done').result.summary.error_count, 0);
});

test('repetitive output aborts upstream immediately in either stage without automatically repeating that batch', async () => {
	for (const stage of ['analysis', 'formatting']) {
		let signal, generated = 0;
		const f = fixture(async (_, options) => {
			const current = JSON.parse(options.body).response_format ? 'formatting' : 'analysis';
			if (current !== stage) return streamResponse('第1段中，“错别子”应改成“错别字”。');
			signal = options.signal;
			return { ok: true, body: Readable.from((async function* () {
				for (let i = 0; i < 1000 && !signal.aborted; i += 1) {
					generated += 1;
					yield Buffer.from('data: ' + JSON.stringify({ choices: [{ delta: { content: '正确应为“奔溃”修改为“奔溃”，' } }] }) + '\n');
				}
			})()) };
		});
		await f.run();
		assert.equal(signal.aborted, true);
		assert(generated < 40, `upstream generated ${generated} chunks`);
		assert.equal(f.requests.length, stage === 'analysis' ? 1 : 2);
		assert.equal(f.events.filter(event => event.code === 'MODEL_OUTPUT_LOOP').length, 1);
		const result = f.events.find(event => event.type === 'done').result;
		assert.equal(result.summary.error_count, 1);
		assert.equal(result.summary.batch_attempt_count, 1);
		assert.equal(result.corrections.length, 0);
		assert.match(result.errors[0].message, /重复输出.*中止/);
		assert.equal(f.billingCalls(), 1);
	}
});

test('large buffered loops are rejected before being forwarded to the client or passed to formatting', async () => {
	let signal;
	const f = fixture(async (_, options) => {
		signal = options.signal;
		return streamResponse('正确应为“奔溃”修改为“奔溃”，'.repeat(1000));
	});
	await f.run();
	assert.equal(signal.aborted, true);
	assert.equal(f.requests.length, 1);
	assert(!f.events.some(event => event.type === 'analysis_delta'));
	assert.equal(f.events.find(event => event.type === 'done').result.summary.error_count, 1);
});

test('one looping batch leaves other concurrent and subsequent batches intact', async () => {
	const f = fixture(async (_, options) => {
		const body = JSON.parse(options.body);
		if (body.response_format) return streamResponse('{"paragraphs":[]}');
		if (body.messages[1].content.includes('[段落2]')) {
			return streamResponse('正确应为“奔溃”修改为“奔溃”，'.repeat(100));
		}
		return streamResponse('没有发现需要修正的问题。');
	}, {
		paragraphs: [paragraph('第一段', 1), paragraph('第二段', 2), paragraph('第三段', 3)],
		env: { WRITER_TEXT_CORRECTION_BATCH_PARAGRAPHS: '1' },
	});
	await f.run();
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.summary.error_count, 1);
	assert.equal(result.summary.batch_attempt_count, 3);
	assert.equal(result.summary.model_request_count, 5);
	assert.equal(result.paragraph_results[0].error, null);
	assert.match(result.paragraph_results[1].error, /重复输出/);
	assert.equal(result.paragraph_results[2].error, null);
	assert.equal(f.events.filter(event => event.type === 'paragraph_result').length, 3);
});

test('JSON formatter cannot invent paragraph numbers or unlocatable replacements', async () => {
	for (const result of [
		{ paragraphs: [{ paragraph_index: 99, fragments: [] }] },
		{ paragraphs: [{ paragraph_index: 1, fragments: [{ original_fragment: '并不存在的原文', corrected_fragment: '修改' }] }] },
		{ paragraphs: [{ paragraph_index: 1, fragments: [null] }] },
		{ error: '纠错意见缺少段落编号' },
	]) {
		const f = fixture(async (_, options) => streamResponse(JSON.parse(options.body).response_format
			? JSON.stringify(result) : '第1段有错别字。'));
		await f.run();
		assert.equal(f.events.find(event => event.type === 'done').result.summary.error_count, 1);
		assert.equal(f.billingCalls(), 1);
	}
});

test('formatting accepts deletions and literal quotes without changing the first answer', async () => {
	const answer = '第1段的「多余“字”」应删除。';
	const f = fixture(async (_, options) => {
		const body = JSON.parse(options.body);
		if (!body.response_format) return streamResponse(answer);
		assert.equal(body.messages[1].content, answer);
		return streamResponse(JSON.stringify({ paragraphs: [{ paragraph_index: 1, fragments: [
			{ original_fragment: '多余“字”', corrected_fragment: '' },
		] }] }));
	}, { paragraphs: [paragraph('删掉多余“字”就好。')] });
	await f.run();
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.paragraph_results[0].corrected_text, '删掉就好。');
	assert.equal(result.summary.error_count, 0);
});

test('invalid JSON, truncated or empty output in either stage are never clean results', async () => {
	for (const [stage, content, reason] of [
		['formatting', '{}', 'stop'], ['formatting', '{"paragraphs":[]}', 'length'], ['formatting', '', 'stop'],
		['analysis', '尚未完成', 'length'], ['analysis', '', 'stop'],
	]) {
		let calls = 0;
		const f = fixture(async (_, options) => {
			calls += 1;
			const isFormatting = !!JSON.parse(options.body).response_format;
			return (stage === 'formatting') === isFormatting
				? streamResponse(content, reason)
				: streamResponse('没有发现需要修正的问题。');
		});
		await f.run();
		assert.equal(calls, stage === 'analysis' ? 2 : 4);
		assert.equal(f.billingCalls(), 1);
		assert.equal(f.events.find(event => event.type === 'done').result.summary.error_count, 1);
	}
});

test('repeated adjacent delta characters are not removed from model JSON', async () => {
	const model = JSON.stringify({ paragraphs: [{ paragraph_index: 1, fragments: [{ original_fragment: '哈哈', corrected_fragment: '嘿嘿' }] }] });
	const f = fixture(async (_, options) => !JSON.parse(options.body).response_format
		? streamResponse('第1段原文“哈哈”建议改为“嘿嘿”。') : ({
		ok: true,
		body: Readable.from([...Array.from(model, content => Buffer.from('data: ' + JSON.stringify({ choices: [{ delta: { content } }] }) + '\n')),
			Buffer.from('data: [DONE]\n')]),
	}), { paragraphs: [paragraph('哈哈')] });
	await f.run();
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.summary.error_count, 0);
	assert.equal(result.paragraph_results[0].corrected_text, '嘿嘿');
});

test('interleaved model streams carry distinct identities through retries', async () => {
	const attempts = new Map();
	const f = fixture(async (_, options) => {
		const body = JSON.parse(options.body);
		if (body.response_format) {
			const [, index, attempt] = body.messages[1].content.match(/批(\d+)尝试(\d+)/);
			return streamResponse(index === '1' && attempt === '1' ? '{}' : '{"paragraphs":[]}');
		}
		const index = Number(body.messages[1].content.match(/\[段落(\d+)\]/)[1]);
		const attempt = (attempts.get(index) || 0) + 1;
		attempts.set(index, attempt);
		const line = (delta, finish_reason) => Buffer.from('data: ' + JSON.stringify({ choices: [{ delta, finish_reason }] }) + '\n');
		return { ok: true, body: Readable.from((async function* () {
			yield line({ content: `批${index}尝试${attempt}：` });
			await new Promise(resolve => setImmediate(resolve));
			yield line({ content: '没' });
			await new Promise(resolve => setImmediate(resolve));
			yield line({ content: '没有问题。' }, 'stop');
		})()) };
	}, {
		paragraphs: [paragraph('正文甲'), paragraph('正文乙', 2)],
		env: { WRITER_TEXT_CORRECTION_BATCH_PARAGRAPHS: '1' },
	});
	await f.run();
	const starts = f.events.filter(event => event.type === 'status' && event.stage === 'analysis');
	assert.deepEqual(starts.map(event => event.batch_index), [1, 2, 1]);
	assert.deepEqual(starts.map(event => event.stream_id), [1, 2, 3]);
	const answers = f.events.filter(event => event.type === 'analysis_delta');
	assert.deepEqual(answers.slice(0, 2).map(event => event.batch_index), [1, 2]);
	for (const start of starts) {
		const stream = f.events.filter(event => event.stream_id === start.stream_id);
		assert(stream.every(event => event.batch_index === start.batch_index && event.batch_count === 2));
		assert.equal(stream.filter(event => event.type === 'analysis_delta').map(event => event.content).join(''),
			`批${start.batch_index}尝试${start.stream_id === 3 ? 2 : 1}：没没有问题。`);
		assert.equal(stream.filter(event => event.stage === 'formatting').length, 1);
	}
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.summary.error_count, 0);
	assert.equal(result.summary.model_request_count, 6);
	assert.equal(result.summary.batch_attempt_count, 3);
	assert.equal(f.billingCalls(), 1);
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

test('formatting timeout retries within the batch budget and never reports the first answer as a clean result', async () => {
	const deadlines = [];
	const f = fixture(async (_, options) => {
		if (!JSON.parse(options.body).response_format) return streamResponse('没有发现需要修正的问题。');
		const body = new PassThrough();
		options.signal.addEventListener('abort', () => body.destroy(Object.assign(new Error('aborted'), { name: 'AbortError' })));
		return { ok: true, body };
	}, { setTimeout: callback => { deadlines.push(callback); return { unref() {} }; } });
	const running = f.run();
	await new Promise(resolve => setImmediate(resolve));
	deadlines[1]();
	await new Promise(resolve => setImmediate(resolve));
	deadlines[3]();
	await running;
	assert.equal(f.requests.length, 4);
	const result = f.events.find(event => event.type === 'done').result;
	assert.equal(result.summary.error_count, 1);
	assert.equal(result.summary.model_request_count, 4);
	assert.match(result.errors[0].message, /超时/);
});

test('disconnecting during formatting aborts that stage and never completes the check', async () => {
	let signal;
	const f = fixture(async (_, options) => {
		if (!JSON.parse(options.body).response_format) return streamResponse('没有发现需要修正的问题。');
		signal = options.signal;
		const body = new PassThrough();
		signal.addEventListener('abort', () => body.destroy(Object.assign(new Error('aborted'), { name: 'AbortError' })));
		return { ok: true, body };
	});
	const running = f.run();
	await new Promise(resolve => setImmediate(resolve));
	f.res.destroyed = true;
	f.res.emit('close');
	await running;
	assert.equal(signal.aborted, true);
	assert.equal(f.requests.length, 2);
	assert(!f.events.some(event => event.type === 'done'));
});
