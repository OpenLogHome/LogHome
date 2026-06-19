const crypto = require('crypto');

function calculateContentHash(content) {
	if (!content) return '';
	return crypto.createHash('md5').update(content).digest('hex');
}

function parsePositiveParagraphId(rawId) {
	if (rawId === null || rawId === undefined || rawId === '') {
		return null;
	}

	const normalizedId = Number(rawId);
	return Number.isInteger(normalizedId) && normalizedId > 0
		? normalizedId
		: null;
}

function parseArticleContent(content) {
	if (typeof content !== 'string' || !content) {
		return null;
	}

	try {
		const blocks = JSON.parse(content);
		return Array.isArray(blocks) ? blocks : null;
	} catch (error) {
		return null;
	}
}

function getTextBlocks(blocks) {
	return blocks.filter((block) => (
		block &&
		typeof block === 'object' &&
		!Array.isArray(block) &&
		block.type === 'text'
	));
}

function getEffectiveParagraphId(block) {
	return parsePositiveParagraphId(block.id) ||
		parsePositiveParagraphId(block.paragraph_id);
}

function inspectArticleParagraphIds(content) {
	const blocks = parseArticleContent(content);
	if (!blocks) {
		return {
			parseable: false,
			textBlockCount: 0,
			duplicateIds: [],
			duplicateCount: 0,
			hasDuplicateIds: false,
		};
	}

	const idCounts = new Map();
	const textBlocks = getTextBlocks(blocks);
	for (const block of textBlocks) {
		const paragraphId = getEffectiveParagraphId(block);
		if (!paragraphId) {
			continue;
		}
		idCounts.set(paragraphId, (idCounts.get(paragraphId) || 0) + 1);
	}

	const duplicateIds = Array.from(idCounts.entries())
		.filter((entry) => entry[1] > 1)
		.map((entry) => ({
			id: entry[0],
			count: entry[1],
		}));

	return {
		parseable: true,
		textBlockCount: textBlocks.length,
		duplicateIds,
		duplicateCount: duplicateIds.reduce((sum, item) => sum + item.count - 1, 0),
		hasDuplicateIds: duplicateIds.length > 0,
	};
}

function repairArticleParagraphIds(content, options = {}) {
	const blocks = parseArticleContent(content);
	if (!blocks) {
		return {
			content,
			changed: false,
			...inspectArticleParagraphIds(content),
		};
	}

	const shouldFillMissing = options.fillMissing !== false;
	const inspection = inspectArticleParagraphIds(content);
	let mutated = false;

	if (inspection.hasDuplicateIds) {
		let nextId = 1;
		const normalizedBlocks = blocks.map((block) => {
			if (!block || typeof block !== 'object' || Array.isArray(block) || block.type !== 'text') {
				return block;
			}
			const fixedBlock = {
				...block,
				id: nextId,
			};
			nextId += 1;
			mutated = true;
			return fixedBlock;
		});

		return {
			content: JSON.stringify(normalizedBlocks),
			changed: mutated,
			...inspection,
		};
	}

	if (!shouldFillMissing) {
		return {
			content,
			changed: false,
			...inspection,
		};
	}

	let maxId = 0;
	for (const block of getTextBlocks(blocks)) {
		const paragraphId = getEffectiveParagraphId(block);
		if (paragraphId && paragraphId > maxId) {
			maxId = paragraphId;
		}
	}

	const normalizedBlocks = blocks.map((block) => {
		if (!block || typeof block !== 'object' || Array.isArray(block) || block.type !== 'text') {
			return block;
		}

		if (parsePositiveParagraphId(block.id)) {
			return block;
		}

		const paragraphId = parsePositiveParagraphId(block.paragraph_id);
		if (paragraphId) {
			mutated = true;
			return {
				...block,
				id: paragraphId,
			};
		}

		maxId += 1;
		mutated = true;
		return {
			...block,
			id: maxId,
		};
	});

	return {
		content: mutated ? JSON.stringify(normalizedBlocks) : content,
		changed: mutated,
		...inspection,
	};
}

function ensureArticleParagraphIds(content) {
	return repairArticleParagraphIds(content).content;
}

module.exports = {
	calculateContentHash,
	ensureArticleParagraphIds,
	inspectArticleParagraphIds,
	parsePositiveParagraphId,
	repairArticleParagraphIds,
};
