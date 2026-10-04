const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../lib/writerTextCorrectionStream.js'), 'utf8').replace('export async function', 'async function');
const { readWriterCorrectionStream } = vm.runInNewContext(source + ';({readWriterCorrectionStream})', {
  TextDecoder, setTimeout, clearTimeout, console,
});
const paragraphs = [
  { text: '第一段', paragraph_index: 3, paragraph_id: 1, paragraph_hash: 'a' },
  { text: '第二段', paragraph_index: 8, paragraph_id: 2, paragraph_hash: 'b' },
];
const complete = paragraphs.map(paragraph => ({
  paragraph_index: paragraph.paragraph_index, paragraph_id: paragraph.paragraph_id,
  paragraph_hash: paragraph.paragraph_hash, original_text: paragraph.text,
  corrected_text: paragraph.text, has_issue: false, fragments: [], error: null,
}));
function response(events, { fail = false, bytes = false, stall = false } = {}) {
  const payload = events.map(event => JSON.stringify(event)).join('\n') + '\n';
  const chunks = bytes ? Array.from(Buffer.from(payload), byte => Uint8Array.of(byte)) : [Buffer.from(payload)];
  let index = 0, canceled = false, resolvePending;
  return {
    body: { getReader: () => ({
      async read() {
        if (canceled) return { done: true };
        if (index < chunks.length) return { done: false, value: chunks[index++] };
        if (fail) throw new Error('network interrupted');
        if (stall) return new Promise(resolve => { resolvePending = resolve; });
        return { done: true };
      },
      async cancel() { canceled = true; resolvePending?.({ done: true }); },
    }) },
    wasCanceled: () => canceled,
  };
}
const onEvent = event => event.type === 'done' ? event.result : null;

test('parses split Chinese bytes, ignores heartbeats, and only finishes on done', async () => {
  const result = { summary: { paragraph_count: 2, error_count: 0 }, paragraph_results: complete };
  const stream = response([
    { type: 'meta', batched: true }, { type: 'heartbeat' },
    { type: 'paragraph_result', result: complete[0] },
    { type: 'paragraph_result', result: complete[1] }, { type: 'done', result },
  ], { bytes: true });
  const actual = await readWriterCorrectionStream(stream, { paragraphs, onEvent });
  assert.deepEqual(JSON.parse(JSON.stringify(actual)), result);
  assert(stream.wasCanceled());
});

test('preserves completed paragraphs on a broken connection and marks only missing work', async () => {
  const stream = response([{ type: 'meta', batched: true }, { type: 'paragraph_result', result: complete[0] }], { fail: true });
  const actual = await readWriterCorrectionStream(stream, { paragraphs, onEvent });
  assert.equal(actual.summary.error_count, 1);
  assert.equal(actual.paragraph_results[0].error, null);
  assert.match(actual.paragraph_results[1].error, /interrupted/);
  assert(stream.wasCanceled());
});

test('does not treat concatenated batch JSON or incomplete streams as clean', async () => {
  await assert.rejects(readWriterCorrectionStream(response([
    { type: 'meta', batched: true }, { type: 'delta', content: '{"paragraphs":[]}' },
    { type: 'delta', content: '{"paragraphs":[]}' },
  ]), { paragraphs, onEvent, buildFallbackResult: () => { throw new Error('must not parse batched JSON'); } }), /完整纠错结果/);
});

test('successful partial results survive server error events and idle timeout', async () => {
  for (const mode of ['error', 'idle']) {
    const events = [{ type: 'meta', batched: true }, { type: 'paragraph_result', result: complete[0] }];
    if (mode === 'error') events.push({ type: 'error', message: '本批超时' });
    const stream = response(events, { stall: mode === 'idle' });
    const actual = await readWriterCorrectionStream(stream, { paragraphs, onEvent, idleTimeoutMs: 5 });
    assert.equal(actual.summary.error_count, 1);
    assert.equal(actual.paragraph_results[0].error, null);
    assert(stream.wasCanceled());
  }
});

test('rejects paragraph results that do not correspond to submitted full text', async () => {
  await assert.rejects(readWriterCorrectionStream(response([
    { type: 'meta', batched: true },
    { type: 'paragraph_result', result: { ...complete[0], original_text: '截断后的其他文本' } },
  ]), { paragraphs, onEvent }), /完整纠错结果/);
});

test('old single-request service output remains compatible', async () => {
  const fallback = { summary: { paragraph_count: 2 }, paragraph_results: complete };
  const actual = await readWriterCorrectionStream(response([{ type: 'delta', content: '{"paragraphs":[]}' }]), {
    paragraphs, onEvent, buildFallbackResult: () => fallback,
  });
  assert.equal(actual, fallback);
});

test('only successful full-text results enter cache; failed-only retry keeps successes', async () => {
  const cacheSource = fs.readFileSync(path.join(__dirname, '../lib/writerTextCorrectionCache.js'), 'utf8')
    .replace(/^import .*$/mg, '').replace(/export (async )?function /g, '$1function ');
  const helpers = vm.runInNewContext(cacheSource + ';({writeSmartParagraphResultsToCache,getCachedSmartParagraphResult})', {});
  const partial = await readWriterCorrectionStream(response([
    { type: 'meta', batched: true }, { type: 'paragraph_result', result: complete[0] },
  ], { fail: true }), { paragraphs, onEvent });
  const cache = helpers.writeSmartParagraphResultsToCache(null, partial.paragraph_results);
  assert(helpers.getCachedSmartParagraphResult(cache, paragraphs[0]));
  assert.equal(helpers.getCachedSmartParagraphResult(cache, paragraphs[1]), null);
  const nextRequest = paragraphs.filter(paragraph => !helpers.getCachedSmartParagraphResult(cache, paragraph));
  assert.deepEqual(nextRequest.map(item => item.paragraph_index), [8]);
});

function publishComponent() {
  const file = fs.readFileSync(path.join(__dirname, '../pages/writers/workPublish.vue'), 'utf8');
  const script = file.split('<script>')[1].split('</script>')[0]
    .replace(/^import[\s\S]*?from\s*["'][^"']+["'];?/gm, '')
    .replace('export default', 'module.exports =');
  const module = { exports: {} };
  vm.runInNewContext(script, { module, RedstoneCost: {}, readWriterCorrectionStream, AbortController, setTimeout, clearTimeout });
  return module.exports;
}

test('publish page retries only failed work and ignores repeated start clicks', async () => {
  const component = publishComponent();
  const context = { smartCorrectionResult: { summary: { error_count: 1 } }, runSmartCorrection: options => options };
  assert.equal(component.methods.rerunSmartCorrection.call(context).forceRefresh, false);
  context.smartCorrectionResult.summary.error_count = 0;
  assert.equal(component.methods.rerunSmartCorrection.call(context).forceRefresh, true);
  await component.methods.runSmartCorrection.call({ smartCorrectionLoading: true, runSmartCorrectionStreaming: () => { throw new Error('duplicate start'); } });
});

test('publish page does not infer progress from reasoning or concatenate batch JSON', () => {
  const component = publishComponent();
  const context = component.data();
  Object.entries(component.methods).forEach(([name, method]) => { context[name] = method.bind(context); });
  context.$nextTick = callback => callback.call(context);
  const event = value => context.processCorrectionStreamLine(JSON.stringify(value), null);
  event({ type: 'progress', analyzed: 0, total: 4 });
  event({ type: 'reasoning_delta', content: '段落4' });
  assert.equal(context.smartCorrectionProgress.analyzed, 0);
  event({ type: 'meta', batched: true });
  event({ type: 'delta', content: '{"paragraphs":[]}' });
  assert.equal(context.smartCorrectionContentText, '');
  event({ type: 'done', result: { summary: { paragraph_count: 4, error_count: 2 }, paragraph_results: [] } });
  assert.equal(context.smartCorrectionProgress.analyzed, 2);
});
