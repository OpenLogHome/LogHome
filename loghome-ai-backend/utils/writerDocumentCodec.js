function normalizePositiveId(value) {
	const normalized = Number(value);
	return Number.isInteger(normalized) && normalized > 0 ? normalized : null;
}

function getBlockId(block) {
	if (!block || typeof block !== 'object') return null;
	return normalizePositiveId(block.id)
		|| normalizePositiveId(block.paragraph_id)
		|| normalizePositiveId(block.legacyId)
		|| normalizePositiveId(block.legacy_id);
}

function normalizeLegacyBlocks(blocks, options = {}) {
	const source = Array.isArray(blocks) && blocks.length > 0
		? blocks
		: [{ type: 'text', value: '' }];
	const normalized = source.map((block) => {
		if (block && block.type === 'image' && block.img) {
			return { type: 'image', img: String(block.img) };
		}

		const result = {
			type: 'text',
			value: block && typeof block.value === 'string' ? block.value : '',
		};
		const blockId = getBlockId(block);
		if (blockId) result.id = blockId;
		return result;
	});

	if (options.assignIds === false) return normalized;
	return assignStableParagraphIds(normalized, options.allocateId);
}

function isEmptyBoundaryTextBlock(block) {
	return block && block.type === 'text' && block.value === '';
}

function trimBoundaryEmptyTextBlocks(blocks) {
	const normalized = normalizeLegacyBlocks(blocks);
	let start = 0;
	let end = normalized.length;

	// ProseMirror documents must keep at least one block. Internal empty
	// paragraphs are meaningful and must not be removed.
	while (end - start > 1 && isEmptyBoundaryTextBlock(normalized[start])) start += 1;
	while (end - start > 1 && isEmptyBoundaryTextBlock(normalized[end - 1])) end -= 1;

	return normalized.slice(start, end);
}

function parseLegacyContent(content, options = {}) {
	if (Array.isArray(content)) return normalizeLegacyBlocks(content, options);
	if (typeof content !== 'string' || !content) {
		return normalizeLegacyBlocks([], options);
	}

	try {
		return normalizeLegacyBlocks(JSON.parse(content), options);
	} catch (error) {
		return normalizeLegacyBlocks([], options);
	}
}

function assignStableParagraphIds(blocks, allocateId) {
	const used = new Set();
	let nextId = blocks.reduce((maximum, block) => {
		return block.type === 'text'
			? Math.max(maximum, getBlockId(block) || 0)
			: maximum;
	}, 0) + 1;

	const nextAvailableId = () => {
		let candidate = typeof allocateId === 'function'
			? normalizePositiveId(allocateId())
			: null;
		if (!candidate || used.has(candidate)) {
			while (used.has(nextId)) nextId += 1;
			candidate = nextId;
			nextId += 1;
		}
		return candidate;
	};

	return blocks.map((block) => {
		if (block.type !== 'text') return block;
		let id = getBlockId(block);
		if (!id || used.has(id)) id = nextAvailableId();
		used.add(id);
		return { type: 'text', value: block.value || '', id };
	});
}

function textToParagraphContent(value) {
	if (!value) return [];
	const result = [];
	String(value).split('\n').forEach((part, index, parts) => {
		if (part) result.push({ type: 'text', text: part });
		if (index < parts.length - 1) result.push({ type: 'hardBreak' });
	});
	return result;
}

function legacyBlocksToDoc(blocks) {
	const content = normalizeLegacyBlocks(blocks).map((block) => {
		if (block.type === 'image') {
			return { type: 'image', attrs: { src: block.img, alt: null, title: null } };
		}
		return {
			type: 'paragraph',
			attrs: { legacyId: block.id || null },
			content: textToParagraphContent(block.value),
		};
	});

	return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] };
}

function extractText(node) {
	if (!node) return '';
	if (node.type === 'text') return node.text || '';
	if (node.type === 'hardBreak') return '\n';
	return (Array.isArray(node.content) ? node.content : [])
		.map((child) => extractText(child))
		.join('');
}

function collectLegacyBlocks(node, blocks) {
	if (!node) return;
	if (node.type === 'image' && node.attrs && node.attrs.src) {
		blocks.push({ type: 'image', img: node.attrs.src });
		return;
	}
	if (['paragraph', 'heading', 'blockquote', 'codeBlock'].includes(node.type)) {
		const block = { type: 'text', value: extractText(node) };
		const id = getBlockId(node.attrs);
		if (id) block.id = id;
		blocks.push(block);
		return;
	}
	(Array.isArray(node.content) ? node.content : [])
		.forEach((child) => collectLegacyBlocks(child, blocks));
}

function docToLegacyBlocks(doc, options = {}) {
	const blocks = [];
	(Array.isArray(doc && doc.content) ? doc.content : [])
		.forEach((node) => collectLegacyBlocks(node, blocks));
	return normalizeLegacyBlocks(blocks, options);
}

function stringifyLegacyContent(blocks, options = {}) {
	return JSON.stringify(normalizeLegacyBlocks(blocks, options));
}

function countLegacyContent(blocks) {
	return normalizeLegacyBlocks(blocks, { assignIds: false }).reduce(
		(result, block) => {
			if (block.type === 'image') result.imageCount += 1;
			else result.textCount += block.value.length;
			return result;
		},
		{ textCount: 0, imageCount: 0 },
	);
}

module.exports = {
	assignStableParagraphIds,
	countLegacyContent,
	docToLegacyBlocks,
	legacyBlocksToDoc,
	normalizeLegacyBlocks,
	parseLegacyContent,
	stringifyLegacyContent,
	trimBoundaryEmptyTextBlocks,
};
