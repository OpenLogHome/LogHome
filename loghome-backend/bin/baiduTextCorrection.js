const axios = require('axios');
const SECRET = require('../SECRET.js');

const BAIDU_TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token';
const BAIDU_ECNET_URL = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/ecnet';
const MAX_ECNET_TEXT_LENGTH = 550;
const BATCH_SEPARATOR = '\n\n';
const TOKEN_SAFE_BUFFER_MS = 5 * 60 * 1000;
const TOKEN_INVALID_ERROR_CODES = new Set([110, 111]);

let accessTokenCache = {
	value: '',
	expiresAt: 0,
};

function getBaiduCredentials() {
	const apiKey = String(SECRET.BaiduNlpApiKey || '').trim();
	const secretKey = String(SECRET.BaiduNlpSecretKey || '').trim();

	if (!apiKey || !secretKey) {
		throw new Error('Baidu NLP credentials are not configured');
	}

	return {
		apiKey,
		secretKey,
	};
}

async function getAccessToken(forceRefresh = false) {
	if (
		!forceRefresh &&
		accessTokenCache.value &&
		accessTokenCache.expiresAt - TOKEN_SAFE_BUFFER_MS > Date.now()
	) {
		return accessTokenCache.value;
	}

	const { apiKey, secretKey } = getBaiduCredentials();
	const response = await axios.post(BAIDU_TOKEN_URL, null, {
		params: {
			grant_type: 'client_credentials',
			client_id: apiKey,
			client_secret: secretKey,
		},
	});

	if (!response.data || !response.data.access_token) {
		throw new Error('Failed to get Baidu NLP access token');
	}

	const expiresInSeconds = Number(response.data.expires_in || 0);
	accessTokenCache = {
		value: response.data.access_token,
		expiresAt: Date.now() + expiresInSeconds * 1000,
	};

	return accessTokenCache.value;
}

function normalizeSegmentText(text) {
	return String(text || '')
		.replace(/\r/g, '')
		.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
}

function normalizeParagraphId(block) {
	const rawId =
		block && block.id !== undefined && block.id !== null
			? block.id
			: block && block.paragraph_id !== undefined && block.paragraph_id !== null
				? block.paragraph_id
				: null;

	if (rawId === null || rawId === '') {
		return null;
	}

	const normalizedId = Number(rawId);
	return Number.isInteger(normalizedId) && normalizedId > 0
		? normalizedId
		: null;
}

function parseArticleParagraphs(content) {
	const paragraphs = [];
	let blocks = content;

	if (!Array.isArray(blocks) && typeof content === 'string' && content) {
		try {
			blocks = JSON.parse(content);
		} catch (error) {
			blocks = null;
		}
	}

	if (Array.isArray(blocks)) {
		for (const block of blocks) {
			if (!block || block.type !== 'text') {
				continue;
			}

			const text = normalizeSegmentText(block.value);
			if (!text) {
				continue;
			}

			paragraphs.push({
				paragraph_index: paragraphs.length + 1,
				paragraph_id: normalizeParagraphId(block),
				paragraph_hash: null,
				text,
			});
		}
	}

	if (paragraphs.length > 0) {
		return paragraphs;
	}

	const fallbackText = normalizeSegmentText(
		typeof content === 'string' ? content : '',
	);
	if (!fallbackText) {
		return [];
	}

	return [
		{
			paragraph_index: 1,
			paragraph_id: null,
			paragraph_hash: null,
			text: fallbackText,
		},
	];
}

function normalizeProvidedParagraphs(paragraphs) {
	if (!Array.isArray(paragraphs)) {
		return [];
	}

	const normalized = [];
	for (const paragraph of paragraphs) {
		const text = normalizeSegmentText(paragraph && paragraph.text);
		if (!text) {
			continue;
		}

		normalized.push({
			paragraph_index:
				Number(paragraph && paragraph.paragraph_index) > 0
					? Number(paragraph.paragraph_index)
					: normalized.length + 1,
			paragraph_id: normalizeParagraphId(paragraph),
			paragraph_hash:
				paragraph && paragraph.paragraph_hash != null
					? String(paragraph.paragraph_hash)
					: null,
			text,
		});
	}

	return normalized;
}

function chooseSplitIndex(text, start, maxLength) {
	const safeEnd = Math.min(start + maxLength, text.length);
	if (safeEnd >= text.length) {
		return text.length;
	}

	const slice = text.slice(start, safeEnd);
	const minimumBreakIndex = Math.floor(slice.length * 0.6);
	const separators = [
		'\n',
		'。',
		'！',
		'？',
		'；',
		'：',
		'，',
		'、',
		'.',
		'!',
		'?',
		';',
		':',
		',',
		'”',
		'’',
		')',
		'）',
		'】',
		'』',
	];

	let splitOffset = -1;
	for (const separator of separators) {
		const lastIndex = slice.lastIndexOf(separator);
		if (lastIndex >= minimumBreakIndex && lastIndex + 1 > splitOffset) {
			splitOffset = lastIndex + 1;
		}
	}

	return splitOffset > 0 ? start + splitOffset : safeEnd;
}

function splitTextIntoPieces(text, maxLength = MAX_ECNET_TEXT_LENGTH) {
	const normalizedText = normalizeSegmentText(text);
	if (!normalizedText) {
		return [];
	}

	if (normalizedText.length <= maxLength) {
		return [
			{
				text: normalizedText,
				start_offset: 0,
				end_offset: normalizedText.length,
			},
		];
	}

	const pieces = [];
	let cursor = 0;
	while (cursor < normalizedText.length) {
		const nextCursor = chooseSplitIndex(normalizedText, cursor, maxLength);
		const rawText = normalizedText.slice(cursor, nextCursor);
		const pieceText = normalizeSegmentText(rawText);
		const leadingTrim = rawText.length - rawText.replace(/^[\s\u3000]+/, '').length;
		const trailingTrim = rawText.length - rawText.replace(/[\s\u3000]+$/, '').length;
		if (pieceText) {
			pieces.push({
				text: pieceText,
				start_offset: cursor + leadingTrim,
				end_offset: nextCursor - trailingTrim,
			});
		}
		cursor = nextCursor;
		while (
			cursor < normalizedText.length &&
			/[\s\u3000]/.test(normalizedText.charAt(cursor))
		) {
			cursor += 1;
		}
	}

	return pieces;
}

function buildParagraphKey(paragraph) {
	return `${Number(paragraph.paragraph_index || 0)}`;
}

function createParagraphResult(paragraph) {
	return {
		paragraph_index: Number(paragraph.paragraph_index || 0),
		paragraph_id: paragraph.paragraph_id,
		paragraph_hash: paragraph.paragraph_hash || null,
		original_text: paragraph.text,
		corrected_text: paragraph.text,
		has_issue: false,
		fragments: [],
		error: null,
		_has_error: false,
	};
}

function buildPackedBatches(paragraphs) {
	const pieces = [];
	for (const paragraph of paragraphs) {
		const paragraphPieces = splitTextIntoPieces(paragraph.text);
		for (let index = 0; index < paragraphPieces.length; index += 1) {
			const piece = paragraphPieces[index];
			pieces.push({
				paragraph_index: paragraph.paragraph_index,
				paragraph_id: paragraph.paragraph_id,
				paragraph_hash: paragraph.paragraph_hash || null,
				paragraph_key: buildParagraphKey(paragraph),
				piece_index: index + 1,
				piece_text: piece.text,
				piece_start_offset: piece.start_offset,
				piece_end_offset: piece.end_offset,
			});
		}
	}

	const batches = [];
	let currentBatch = null;

	for (const piece of pieces) {
		if (!currentBatch) {
			currentBatch = {
				text: '',
				items: [],
			};
		}

		const prefix = currentBatch.text ? BATCH_SEPARATOR : '';
		const nextLength =
			currentBatch.text.length + prefix.length + piece.piece_text.length;

		if (currentBatch.text && nextLength > MAX_ECNET_TEXT_LENGTH) {
			batches.push(currentBatch);
			currentBatch = {
				text: '',
				items: [],
			};
		}

		const actualPrefix = currentBatch.text ? BATCH_SEPARATOR : '';
		const startOffset = currentBatch.text.length + actualPrefix.length;
		currentBatch.text += actualPrefix + piece.piece_text;
		currentBatch.items.push({
			...piece,
			batch_start_offset: startOffset,
			batch_end_offset: startOffset + piece.piece_text.length,
		});
	}

	if (currentBatch && currentBatch.items.length > 0) {
		batches.push(currentBatch);
	}

	return batches;
}

async function requestEcnet(text, forceRefresh = false) {
	const accessToken = await getAccessToken(forceRefresh);
	const response = await axios.post(
		BAIDU_ECNET_URL,
		{
			text,
		},
		{
			params: {
				access_token: accessToken,
				charset: 'UTF-8',
			},
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);

	if (response.data && response.data.error_code) {
		if (
			!forceRefresh &&
			TOKEN_INVALID_ERROR_CODES.has(Number(response.data.error_code))
		) {
			return requestEcnet(text, true);
		}

		const error = new Error(
			response.data.error_msg || 'Baidu text correction request failed',
		);
		error.code = Number(response.data.error_code);
		throw error;
	}

	return response.data;
}

function findBatchItemForFragment(batch, fragment) {
	const begin = Number(fragment.begin_pos || 0);
	const end = Number(fragment.end_pos || 0);
	return (
		batch.items.find((item) => {
			return begin >= item.batch_start_offset && end <= item.batch_end_offset;
		}) || null
	);
}

function normalizeFragmentRange(fragment, item) {
	const pieceBegin = Number(fragment.begin_pos || 0) - item.batch_start_offset;
	const pieceEnd = Number(fragment.end_pos || 0) - item.batch_start_offset;
	return {
		begin_pos: item.piece_start_offset + pieceBegin,
		end_pos: item.piece_start_offset + pieceEnd,
		original_fragment: fragment.ori_frag || '',
		corrected_fragment: fragment.correct_frag || '',
	};
}

function applyFragmentsToText(text, fragments) {
	if (!Array.isArray(fragments) || fragments.length === 0) {
		return text;
	}

	const sortedFragments = [...fragments].sort((left, right) => {
		if (left.begin_pos !== right.begin_pos) {
			return left.begin_pos - right.begin_pos;
		}
		return left.end_pos - right.end_pos;
	});

	let cursor = 0;
	let correctedText = '';
	for (const fragment of sortedFragments) {
		const begin = Math.max(0, Number(fragment.begin_pos || 0));
		const end = Math.max(begin, Number(fragment.end_pos || begin));
		if (begin < cursor) {
			continue;
		}
		correctedText += text.slice(cursor, begin);
		correctedText += fragment.corrected_fragment || '';
		cursor = end;
	}

	correctedText += text.slice(cursor);
	return correctedText;
}

function finalizeParagraphResults(paragraphResultMap) {
	const paragraphResults = Array.from(paragraphResultMap.values())
		.sort((left, right) => left.paragraph_index - right.paragraph_index)
		.map((result) => {
			if (result._has_error) {
				return {
					paragraph_index: result.paragraph_index,
					paragraph_id: result.paragraph_id,
					paragraph_hash: result.paragraph_hash,
					original_text: result.original_text,
					corrected_text: result.original_text,
					has_issue: false,
					fragments: [],
					error: result.error || 'Text correction failed',
				};
			}

			const fragments = [...result.fragments].sort((left, right) => {
				if (left.begin_pos !== right.begin_pos) {
					return left.begin_pos - right.begin_pos;
				}
				return left.end_pos - right.end_pos;
			});

			return {
				paragraph_index: result.paragraph_index,
				paragraph_id: result.paragraph_id,
				paragraph_hash: result.paragraph_hash,
				original_text: result.original_text,
				corrected_text: applyFragmentsToText(result.original_text, fragments),
				has_issue: fragments.length > 0,
				fragments,
				error: null,
			};
		});

	return {
		summary: {
			paragraph_count: paragraphResults.length,
			submitted_paragraph_count: paragraphResults.length,
			batch_count: 0,
			corrected_paragraph_count: paragraphResults.filter((item) => item.has_issue)
				.length,
			issue_count: paragraphResults.reduce(
				(total, item) => total + item.fragments.length,
				0,
			),
			error_count: paragraphResults.filter((item) => item.error).length,
		},
		paragraph_results: paragraphResults,
		corrections: paragraphResults.filter((item) => item.has_issue),
		errors: paragraphResults
			.filter((item) => item.error)
			.map((item) => ({
				paragraph_index: item.paragraph_index,
				paragraph_id: item.paragraph_id,
				paragraph_hash: item.paragraph_hash,
				message: item.error,
			})),
	};
}

async function correctParagraphs(rawParagraphs) {
	const paragraphs = normalizeProvidedParagraphs(rawParagraphs);
	const paragraphResultMap = new Map();
	for (const paragraph of paragraphs) {
		paragraphResultMap.set(buildParagraphKey(paragraph), createParagraphResult(paragraph));
	}

	const batches = buildPackedBatches(paragraphs);
	for (const batch of batches) {
		try {
			const result = await requestEcnet(batch.text);
			const vecFragments =
				result &&
				result.item &&
				Array.isArray(result.item.vec_fragment)
					? result.item.vec_fragment
					: [];

			for (const fragment of vecFragments) {
				const batchItem = findBatchItemForFragment(batch, fragment);
				if (!batchItem) {
					continue;
				}

				const paragraphResult = paragraphResultMap.get(batchItem.paragraph_key);
				if (!paragraphResult || paragraphResult._has_error) {
					continue;
				}

				paragraphResult.fragments.push(
					normalizeFragmentRange(fragment, batchItem),
				);
			}
		} catch (error) {
			const paragraphKeys = new Set(
				batch.items.map((item) => item.paragraph_key),
			);
			for (const paragraphKey of paragraphKeys) {
				const paragraphResult = paragraphResultMap.get(paragraphKey);
				if (!paragraphResult) {
					continue;
				}
				paragraphResult._has_error = true;
				paragraphResult.error = error.message || 'Text correction failed';
			}
		}
	}

	const finalized = finalizeParagraphResults(paragraphResultMap);
	finalized.summary.batch_count = batches.length;
	return finalized;
}

async function correctArticleContent(content) {
	return correctParagraphs(parseArticleParagraphs(content));
}

module.exports = {
	correctArticleContent,
	correctParagraphs,
	MAX_ECNET_TEXT_LENGTH,
};
