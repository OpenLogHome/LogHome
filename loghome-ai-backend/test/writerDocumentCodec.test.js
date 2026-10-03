const assert = require('node:assert/strict');
const test = require('node:test');
const { ProsemirrorTransformer } = require('@hocuspocus/transformer');
const writerSchema = require('../utils/writerCollaborationSchema');
const { repairBoundaryEmptyParagraphs } = require('../bin/collaborationService');
const {
	docToLegacyBlocks,
	legacyBlocksToDoc,
	normalizeLegacyBlocks,
	trimBoundaryEmptyTextBlocks,
} = require('../utils/writerDocumentCodec');

test('preserves valid paragraph ids and repairs only the conflicting paragraph', () => {
	const result = normalizeLegacyBlocks([
		{ type: 'text', value: 'first', id: 12 },
		{ type: 'image', img: 'https://example.com/image.png' },
		{ type: 'text', value: 'duplicate', id: 12 },
		{ type: 'text', value: 'existing', id: 99 },
		{ type: 'text', value: 'missing' },
	]);

	assert.deepEqual(result.map((block) => block.id || null), [12, null, 100, 99, 101]);
});

test('round trips the legacy writer format through a Yjs ProseMirror fragment', () => {
	const source = [
		{ type: 'text', value: '第一行\n第二行', id: 7 },
		{ type: 'image', img: 'https://example.com/cover.png' },
		{ type: 'text', value: '结尾', id: 42 },
	];
	const ydoc = ProsemirrorTransformer.toYdoc(
		legacyBlocksToDoc(source),
		'body',
		writerSchema,
	);
	const result = docToLegacyBlocks(
		ProsemirrorTransformer.fromYdoc(ydoc, 'body'),
	);

	assert.deepEqual(result, source);
});

test('removes only empty text paragraphs at document boundaries', () => {
	const result = trimBoundaryEmptyTextBlocks([
		{ type: 'text', value: '', id: 1 },
		{ type: 'text', value: '', id: 2 },
		{ type: 'text', value: '正文', id: 3 },
		{ type: 'text', value: '', id: 4 },
		{ type: 'text', value: '内部空行之后', id: 5 },
		{ type: 'text', value: '', id: 6 },
	]);

	assert.deepEqual(result, [
		{ type: 'text', value: '正文', id: 3 },
		{ type: 'text', value: '', id: 4 },
		{ type: 'text', value: '内部空行之后', id: 5 },
	]);
});

test('keeps one paragraph for an otherwise empty document and is idempotent', () => {
	const once = trimBoundaryEmptyTextBlocks([
		{ type: 'text', value: '', id: 10 },
		{ type: 'text', value: '', id: 11 },
	]);
	const twice = trimBoundaryEmptyTextBlocks(once);

	assert.deepEqual(once, [{ type: 'text', value: '', id: 11 }]);
	assert.deepEqual(twice, once);
});

test('repairs persisted Yjs boundary placeholders once and preserves internal blanks', () => {
	const ydoc = ProsemirrorTransformer.toYdoc(
		legacyBlocksToDoc([
			{ type: 'text', value: '', id: 21 },
			{ type: 'text', value: '第一段', id: 22 },
			{ type: 'text', value: '', id: 23 },
			{ type: 'text', value: '第二段', id: 24 },
			{ type: 'text', value: '', id: 25 },
		]),
		'body',
		writerSchema,
	);

	assert.equal(repairBoundaryEmptyParagraphs(ydoc), true);
	assert.deepEqual(
		docToLegacyBlocks(ProsemirrorTransformer.fromYdoc(ydoc, 'body')),
		[
			{ type: 'text', value: '第一段', id: 22 },
			{ type: 'text', value: '', id: 23 },
			{ type: 'text', value: '第二段', id: 24 },
		],
	);
	assert.equal(repairBoundaryEmptyParagraphs(ydoc), false);
});
