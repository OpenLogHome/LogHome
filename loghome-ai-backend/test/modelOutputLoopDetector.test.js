const assert = require('node:assert/strict');
const test = require('node:test');
const { createModelOutputLoopDetector } = require('../bin/modelOutputLoopDetector');

function feed(text, chunkSize, options) {
	const detector = createModelOutputLoopDetector(options);
	for (let offset = 0; offset < text.length; offset += chunkSize) {
		const result = detector.push(text.slice(offset, offset + chunkSize));
		if (result) return { result, consumed: Math.min(text.length, offset + chunkSize) };
	}
	return null;
}

test('detects the screenshot loop despite whitespace and punctuation changes across network deltas', () => {
	const text = '正确应为“奔溃”修改为“奔溃”，正确写法是“奔溃”改为“奔溃”，正确表述是“奔溃”改为“奔溃”，'.repeat(80);
	for (const chunkSize of [1, 7, 31, text.length]) {
		const match = feed(text, chunkSize);
		assert(match);
		if (chunkSize < text.length) assert(match.consumed < 700, `stopped at ${match.consumed}`);
	}
});

test('detects short token loops, English loops, emoji loops and longer repeated blocks', () => {
	for (const unit of ['哈', 'never stop ', '🌲🌳', '一段足够长的异常输出'.repeat(12)]) {
		assert(feed(unit.repeat(300), 5, { structured: true }), unit);
	}
});

test('detects a small set of recurring clauses even when their order keeps changing', () => {
	const a = '正确应为奔溃修改为奔溃这才是合适的词语', b = '正确写法是奔溃改为奔溃这样才符合句意', c = '正确表述是奔溃改为奔溃这是最准确的改法';
	const text = [a, b, c, a, c, b, c, a, b, b, a, c].join('，') + '。';
	const match = feed(text, 11);
	assert(match);
	assert.equal(match.result.kind, 'repeated_clauses');
});

test('allows ordinary duplicate words, quoted dialogue and repeated formatting keys with distinct paragraphs', () => {
	const texts = [
		'“哈哈，哈哈！”他笑了。“别笑了。”\n第1段，“错别子”应改成“错别字”。其他地方没有问题。',
		Array.from({ length: 32 }, (_, i) => `第${i + 1}段，原文中的错别子应改为错别字。`).join('\n'),
		JSON.stringify({ paragraphs: Array.from({ length: 32 }, (_, i) => ({
			paragraph_index: i + 1, fragments: [{ original_fragment: `错别子${i}`, corrected_fragment: `错别字${i}` }],
		})) }),
	];
	for (const text of texts) {
		for (const chunkSize of [1, 13, text.length]) assert.equal(feed(text, chunkSize), null);
	}
});

test('allows a repeating passage actually quoted from the input but stops continuing it beyond the source', () => {
	const quote = '山的那边还是山。'.repeat(70);
	const options = { sourceTexts: [quote] };
	assert.equal(feed(`原文：${quote}`, 1, options), null);
	assert(feed(`原文：${quote.repeat(5)}`, 1, options));
});

test('JSON punctuation and case corrections are distinct values rather than repeated schema keys', () => {
	const text = JSON.stringify({ paragraphs: [{ paragraph_index: 1, fragments: Array.from({ length: 24 }, (_, index) => ({
		original_fragment: '，'.repeat(index + 1), corrected_fragment: '。'.repeat(index + 1),
	})) }] });
	assert.equal(feed(text, 1, { structured: true }), null);
	assert.equal(feed(text, 53, { structured: true }), null);
});

test('a loop is local to one request and remains detected after its first trigger', () => {
	const first = createModelOutputLoopDetector();
	assert(first.push('一直重复同一句话。'.repeat(100)));
	assert(first.push(''));
	assert.equal(createModelOutputLoopDetector().push('新批次是独立的正常回答。'), null);
});
