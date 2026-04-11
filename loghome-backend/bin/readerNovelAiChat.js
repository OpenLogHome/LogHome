const fetch = require('node-fetch');
const { query } = require('../sql.js');
const config = require('../config.js');
const secrets = require('../SECRET.js');
const { ensureAgentMemorySchema } = require('./agentIndexing.js');

const memoryDatabase = config.memoryDatabase || 'loghome-agent-memory';
const DEEPSEEK_BASE_URL = String(
	process.env.DEEPSEEK_BASE_URL || secrets.DeepSeekBaseUrl || 'https://api.deepseek.com'
).replace(/\/+$/, '');
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || secrets.DeepSeekApiKey || '';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || secrets.DeepSeekModel || 'deepseek-chat';
const DEEPSEEK_THINKING_MODEL = process.env.DEEPSEEK_THINKING_MODEL || secrets.DeepSeekThinkingModel || 'deepseek-chat';
const PLANNER_BASE_URL = String(
	process.env.READER_CHAT_PLANNER_BASE_URL || secrets.ReaderChatPlannerBaseUrl || ''
).replace(/\/+$/, '');
const PLANNER_API_KEY = process.env.READER_CHAT_PLANNER_API_KEY || secrets.ReaderChatPlannerApiKey || '';
const PLANNER_MODEL = process.env.READER_CHAT_PLANNER_MODEL || secrets.ReaderChatPlannerModel || '';
const PLANNER_TOOL_CALL_MODE = String(
	process.env.READER_CHAT_PLANNER_TOOL_MODE || secrets.ReaderChatPlannerToolMode || 'explicit'
).trim().toLowerCase();

const MAX_TOOL_STEPS = 6;
const MAX_CONTEXT_CHARS = 18000;
const MAX_HISTORY_MESSAGES = 8;
const MAX_NOVEL_ANCHOR_CHAPTERS = 12;
const MAX_NOVEL_RECENT_CHAPTERS = 4;
const MAX_MODEL_RESULT_ITEMS = 4;
const MAX_MODEL_SNIPPET_CHARS = 160;
const MAX_MODEL_SUMMARY_CHARS = 120;
const MAX_MODEL_DESCRIPTION_CHARS = 220;
const FULL_CHAPTER_WINDOW_RADIUS = 2;
const FULL_CHAPTER_MAX_PARAGRAPHS = 7;
const FULL_CHAPTER_FALLBACK_PARAGRAPHS = 5;
const MAX_WRITER_EVIDENCE_ITEMS = 14;
const MAX_WRITER_EVIDENCE_CHARS = 9000;
const STREAM_CHUNK_SIZE = 24;
const STREAM_CHUNK_DELAY_MS = 8;
const TOOL_STATUS_TEXT = {
	search_keywords: '剧情摘要',
	search_chapters: '章节内容',
	get_chapter_context: '章节上下文',
	get_full_chapter: '章节原文段落',
	get_reader_feedback_summary: '读者反馈',
	sendMessage: '回答内容',
};

function truncateText(text, maxLength = MAX_MODEL_SNIPPET_CHARS) {
	const normalized = String(text || '').replace(/\s+/g, ' ').trim();
	if (!normalized) {
		return '';
	}
	if (normalized.length <= maxLength) {
		return normalized;
	}
	return `${normalized.slice(0, Math.max(1, maxLength - 3))}...`;
}

function truncateBlockText(text, maxLength = MAX_CONTEXT_CHARS) {
	const source = String(text || '').trim();
	if (!source) {
		return '';
	}
	if (source.length <= maxLength) {
		return source;
	}
	return `${source.slice(0, Math.max(1, maxLength - 3))}...`;
}

function uniqueBy(items, getKey) {
	const result = [];
	const seen = new Set();
	for (const item of Array.isArray(items) ? items : []) {
		if (!item) {
			continue;
		}
		const key = typeof getKey === 'function' ? getKey(item) : item;
		if (seen.has(key)) {
			continue;
		}
		seen.add(key);
		result.push(item);
	}
	return result;
}

function pickRepresentativeItems(items, count) {
	const rows = Array.isArray(items) ? items.filter(Boolean) : [];
	if (rows.length <= count) {
		return rows;
	}

	const picked = [];
	const lastIndex = rows.length - 1;
	for (let index = 0; index < count; index += 1) {
		const position = Math.round((lastIndex * index) / Math.max(1, count - 1));
		picked.push(rows[position]);
	}
	return uniqueBy(picked, (item) => JSON.stringify(item));
}

function safeJsonParse(value, fallback) {
	if (value === null || value === undefined) {
		return fallback;
	}
	if (typeof value !== 'string') {
		return value;
	}
	try {
		return JSON.parse(value);
	} catch (error) {
		return fallback;
	}
}

function collectTextFragments(node, fragments = [], depth = 0) {
	if (depth > 6 || node === null || node === undefined) {
		return fragments;
	}

	if (typeof node === 'string') {
		const text = node.trim();
		if (text) {
			fragments.push(text);
		}
		return fragments;
	}

	if (typeof node === 'number' || typeof node === 'boolean') {
		fragments.push(String(node));
		return fragments;
	}

	if (Array.isArray(node)) {
		for (const item of node) {
			collectTextFragments(item, fragments, depth + 1);
		}
		return fragments;
	}

	if (typeof node === 'object') {
		for (const value of Object.values(node)) {
			collectTextFragments(value, fragments, depth + 1);
		}
	}

	return fragments;
}

function extractPlainText(content) {
	if (content === null || content === undefined) {
		return '';
	}

	if (typeof content !== 'string') {
		return collectTextFragments(content).join(' ').replace(/\s+/g, ' ').trim();
	}

	const trimmed = content.trim();
	if (!trimmed) {
		return '';
	}

	if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
		try {
			const parsed = JSON.parse(trimmed);
			return collectTextFragments(parsed).join(' ').replace(/\s+/g, ' ').trim();
		} catch (error) {
			return trimmed.replace(/\s+/g, ' ').trim();
		}
	}

	return trimmed.replace(/\s+/g, ' ').trim();
}

function normalizeKeywords(input) {
	const values = Array.isArray(input) ? input : [input];
	return [...new Set(
		values
			.flatMap((value) => String(value || '').split(/\s+/))
			.map((item) => item.trim())
			.filter(Boolean)
	)];
}

function normalizePhrases(input) {
	const values = Array.isArray(input) ? input : [input];
	return [...new Set(
		values
			.map((value) => String(value || '').trim())
			.filter(Boolean)
	)];
}

function countMatches(text, terms) {
	const lower = String(text || '').toLowerCase();
	let count = 0;
	for (const term of terms) {
		const needle = String(term || '').toLowerCase();
		if (!needle) {
			continue;
		}
		count += lower.split(needle).length - 1;
	}
	return count;
}

function stringifyCharacters(value) {
	if (typeof value === 'string') {
		return value;
	}
	try {
		return JSON.stringify(value || []);
	} catch (error) {
		return '[]';
	}
}

function buildEvidenceSnippet(row, keywords) {
	const candidates = [
		row.short_summary || '',
		row.long_summary || '',
		row.title || '',
		stringifyCharacters(row.characters),
	];

	for (const text of candidates) {
		const normalized = String(text || '').replace(/\s+/g, ' ').trim();
		if (!normalized) {
			continue;
		}

		const lower = normalized.toLowerCase();
		let index = -1;
		for (const keyword of keywords) {
			const foundIndex = lower.indexOf(String(keyword || '').toLowerCase());
			if (foundIndex !== -1 && (index === -1 || foundIndex < index)) {
				index = foundIndex;
			}
		}

		if (index === -1) {
			if (text === candidates[0] || text === candidates[1]) {
				return normalized.slice(0, 180);
			}
			continue;
		}

		const start = Math.max(0, index - 40);
		const end = Math.min(normalized.length, start + 180);
		const prefix = start > 0 ? '...' : '';
		const suffix = end < normalized.length ? '...' : '';
		return `${prefix}${normalized.slice(start, end)}${suffix}`;
	}

	return '';
}

function scoreMemoryRow(row, keywords, phrases) {
	const title = row.title || '';
	const shortSummary = row.short_summary || '';
	const longSummary = row.long_summary || '';
	const charactersText = stringifyCharacters(row.characters);

	const titleMatchCount = countMatches(title, keywords);
	const shortMatchCount = countMatches(shortSummary, keywords);
	const longMatchCount = countMatches(longSummary, keywords);
	const characterMatchCount = countMatches(charactersText, keywords);

	const matchedFields = [];
	if (titleMatchCount > 0) matchedFields.push('title');
	if (shortMatchCount > 0) matchedFields.push('short_summary');
	if (longMatchCount > 0) matchedFields.push('long_summary');
	if (characterMatchCount > 0) matchedFields.push('characters');

	let score = 0;
	score += titleMatchCount * 8;
	score += shortMatchCount * 5;
	score += characterMatchCount * 4;
	score += longMatchCount * 2;

	for (const phrase of phrases) {
		const lower = String(phrase || '').toLowerCase();
		if (!lower) {
			continue;
		}
		if (title.toLowerCase().includes(lower)) score += 6;
		if (shortSummary.toLowerCase().includes(lower)) score += 5;
		if (longSummary.toLowerCase().includes(lower)) score += 3;
		if (charactersText.toLowerCase().includes(lower)) score += 4;
	}

	const combinedLower = `${title}\n${shortSummary}\n${longSummary}\n${charactersText}`.toLowerCase();
	const matchedKeywords = keywords.filter((keyword) => combinedLower.includes(String(keyword || '').toLowerCase()));
	if (matchedKeywords.length === keywords.length && keywords.length > 1) {
		score += 4;
	}

	return {
		...row,
		score,
		matched_fields: matchedFields,
		matched_keywords: matchedKeywords,
		evidence_snippet: buildEvidenceSnippet(row, keywords),
	};
}

function buildSnippet(text, keywords, maxLength = 180) {
	const normalized = String(text || '').replace(/\s+/g, ' ').trim();
	if (!normalized) {
		return '';
	}

	const lower = normalized.toLowerCase();
	let index = -1;
	for (const keyword of keywords) {
		const foundIndex = lower.indexOf(String(keyword || '').toLowerCase());
		if (foundIndex !== -1 && (index === -1 || foundIndex < index)) {
			index = foundIndex;
		}
	}

	if (index === -1) {
		return normalized.slice(0, maxLength);
	}

	const start = Math.max(0, index - 40);
	const end = Math.min(normalized.length, start + maxLength);
	const prefix = start > 0 ? '...' : '';
	const suffix = end < normalized.length ? '...' : '';
	return `${prefix}${normalized.slice(start, end)}${suffix}`;
}

function buildPlainTextParagraphs(text) {
	return String(text || '')
		.split(/\r?\n+/)
		.map((item) => String(item || '').replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.map((item, index) => ({
			paragraph_id: index + 1,
			text: item,
		}));
}

function normalizeArticleParagraphs(rawContent) {
	let content = [];
	if (Array.isArray(rawContent)) {
		content = rawContent;
	} else if (rawContent && Array.isArray(rawContent.content)) {
		content = rawContent.content;
	} else if (typeof rawContent === 'string') {
		try {
			const parsed = JSON.parse(rawContent);
			if (Array.isArray(parsed)) {
				content = parsed;
			} else if (parsed && Array.isArray(parsed.content)) {
				content = parsed.content;
			} else if (typeof parsed === 'string') {
				return buildPlainTextParagraphs(parsed);
			} else {
				return buildPlainTextParagraphs(rawContent);
			}
		} catch (error) {
			return buildPlainTextParagraphs(rawContent);
		}
	}

	if (!Array.isArray(content)) {
		return [];
	}

	let autoId = 1;
	return content
		.map((item) => {
			if (!item) {
				return null;
			}
			if (item.type === 'text' || item.type === undefined) {
				const value = Array.isArray(item.value) ? item.value.join('') : (item.value || item.desc || '');
				const text = String(value || '').replace(/\s+/g, ' ').trim();
				if (!text) {
					return null;
				}
				const rawParagraphId = item.id ?? item.paragraph_id ?? autoId++;
				const numericParagraphId = Number(rawParagraphId);
				return {
					paragraph_id: Number.isFinite(numericParagraphId) && numericParagraphId > 0
						? numericParagraphId
						: autoId++,
					text,
				};
			}
			return null;
		})
		.filter(Boolean);
}

function buildCitationId(articleId, paragraphId = null) {
	const normalizedArticleId = Number(articleId || 0);
	const normalizedParagraphId = Number(paragraphId || 0);
	if (!normalizedArticleId) {
		return '';
	}
	if (Number.isFinite(normalizedParagraphId) && normalizedParagraphId > 0) {
		return `a${normalizedArticleId}p${normalizedParagraphId}`;
	}
	return `a${normalizedArticleId}`;
}

function buildCitationSnippet(text, maxLength = 96) {
	return String(text || '')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, maxLength);
}

function createCitationRecord(options = {}) {
	const articleId = Number(options.article_id || 0);
	const chapter = Number(options.chapter || 0);
	const paragraphId = Number(options.paragraph_id || 0);
	const citationId = buildCitationId(articleId, paragraphId);
	if (!citationId || !articleId) {
		return null;
	}
	return {
		citation_id: citationId,
		article_id: articleId,
		chapter: chapter || null,
		title: String(options.title || ''),
		paragraph_id: Number.isFinite(paragraphId) && paragraphId > 0 ? paragraphId : null,
		snippet: buildCitationSnippet(options.snippet || ''),
		source: String(options.source || 'chapter'),
	};
}

function findBestMatchingParagraph(paragraphs, keywords) {
	const rows = (Array.isArray(paragraphs) ? paragraphs : [])
		.map((item) => {
			const text = String(item && item.text || '').trim();
			if (!text) {
				return null;
			}
			const score = countMatches(text, keywords);
			if (score <= 0) {
				return null;
			}
			return {
				paragraph_id: Number(item.paragraph_id || 0) || null,
				text,
				score,
				matched_keywords: keywords.filter((keyword) => {
					return text.toLowerCase().includes(String(keyword || '').toLowerCase());
				}),
			};
		})
		.filter(Boolean)
		.sort((a, b) => b.score - a.score);

	return rows[0] || null;
}

function selectParagraphWindow(paragraphs, options = {}) {
	const rows = Array.isArray(paragraphs) ? paragraphs.filter(Boolean) : [];
	if (rows.length === 0) {
		return [];
	}

	const targetParagraphId = Number(options.paragraph_id || 0);
	const keywords = normalizeKeywords(options.query || options.keywords || []);
	let centerIndex = -1;

	if (targetParagraphId > 0) {
		centerIndex = rows.findIndex((item) => Number(item.paragraph_id || 0) === targetParagraphId);
	}

	if (centerIndex === -1 && keywords.length > 0) {
		const bestParagraph = findBestMatchingParagraph(rows, keywords);
		if (bestParagraph) {
			centerIndex = rows.findIndex((item) => Number(item.paragraph_id || 0) === Number(bestParagraph.paragraph_id || 0));
		}
	}

	if (centerIndex === -1) {
		centerIndex = 0;
	}

	const radius = Math.max(1, Number(options.radius || FULL_CHAPTER_WINDOW_RADIUS));
	const start = Math.max(0, centerIndex - radius);
	const end = Math.min(rows.length, centerIndex + radius + 1);
	let selected = rows.slice(start, end);

	if (selected.length === 0) {
		selected = rows.slice(0, FULL_CHAPTER_FALLBACK_PARAGRAPHS);
	}
	if (selected.length > FULL_CHAPTER_MAX_PARAGRAPHS) {
		selected = selected.slice(0, FULL_CHAPTER_MAX_PARAGRAPHS);
	}

	return selected;
}

function registerCitationList(citations, citationRegistry, recentCitationIds) {
	if (!(citationRegistry instanceof Map)) {
		return;
	}
	for (const item of Array.isArray(citations) ? citations : []) {
		if (!item || !item.citation_id) {
			continue;
		}
		const existing = citationRegistry.get(item.citation_id) || {};
		const merged = {
			...existing,
			...item,
			snippet: item.snippet || existing.snippet || '',
			title: item.title || existing.title || '',
			chapter: item.chapter || existing.chapter || null,
			paragraph_id: item.paragraph_id || existing.paragraph_id || null,
		};
		citationRegistry.set(item.citation_id, merged);
		if (Array.isArray(recentCitationIds)) {
			const existIndex = recentCitationIds.indexOf(item.citation_id);
			if (existIndex !== -1) {
				recentCitationIds.splice(existIndex, 1);
			}
			recentCitationIds.push(item.citation_id);
			if (recentCitationIds.length > 48) {
				recentCitationIds.splice(0, recentCitationIds.length - 48);
			}
		}
	}
}

function extractCitationIdsFromMessage(message) {
	return [...String(message || '').matchAll(/\[\[cite:([a-zA-Z0-9_-]+)\]\]/g)]
		.map((match) => String(match[1] || '').trim())
		.filter(Boolean);
}

function appendFallbackCitationMarkers(message, recentCitationIds, limit = 2) {
	const normalizedMessage = String(message || '').trim();
	if (!normalizedMessage || extractCitationIdsFromMessage(normalizedMessage).length > 0) {
		return normalizedMessage;
	}
	const fallbackIds = (Array.isArray(recentCitationIds) ? recentCitationIds : []).slice(-limit);
	if (fallbackIds.length === 0) {
		return normalizedMessage;
	}
	return `${normalizedMessage}\n\n引用：${fallbackIds.map((id) => `[[cite:${id}]]`).join(' ')}`.trim();
}

function buildSelectedCitations(message, citationRegistry) {
	const orderedIds = [];
	for (const citationId of extractCitationIdsFromMessage(message)) {
		if (!orderedIds.includes(citationId)) {
			orderedIds.push(citationId);
		}
	}

	return orderedIds
		.map((citationId, index) => {
			const citation = citationRegistry instanceof Map ? citationRegistry.get(citationId) : null;
			if (!citation) {
				return null;
			}
			return {
				...citation,
				display_index: index + 1,
			};
		})
		.filter(Boolean);
}

function finalizeAssistantMessage(message, citationRegistry, recentCitationIds) {
	const content = appendFallbackCitationMarkers(message, recentCitationIds);
	return {
		message: content,
		citations: buildSelectedCitations(content, citationRegistry),
	};
}

function stripThinkAndExplicitBlocks(content) {
	let cleaned = String(content || '');
	cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
	cleaned = cleaned.replace(/<explicit_tool_call>\s*[\s\S]*?<\/explicit_tool_call>/gi, '').trim();
	cleaned = cleaned.replace(/\bFINISHED\b/gi, '').trim();
	return cleaned;
}

function parseExplicitToolCalls(content) {
	const source = String(content || '');
	const matches = [...source.matchAll(/<explicit_tool_call>\s*([\s\S]*?)\s*<\/explicit_tool_call>/gi)];
	if (matches.length === 0) {
		return null;
	}

	const toolCalls = [];
	for (let index = 0; index < matches.length; index += 1) {
		const rawJson = String(matches[index][1] || '').trim();
		let parsed;
		try {
			parsed = JSON.parse(rawJson);
		} catch (error) {
			return null;
		}

		if (!parsed || typeof parsed !== 'object' || !parsed.name) {
			return null;
		}

		toolCalls.push({
			id: `explicit_call_${Date.now()}_${index}`,
			type: 'function',
			function: {
				name: String(parsed.name),
				arguments: JSON.stringify(
					parsed.arguments && typeof parsed.arguments === 'object'
						? parsed.arguments
						: {}
				),
			},
		});
	}

	return toolCalls;
}

function safeParseToolArgs(rawArgs) {
	try {
		return rawArgs ? JSON.parse(rawArgs) : {};
	} catch (error) {
		return {};
	}
}

function buildReaderMemoryValidityCondition(memoryAlias = 'm', articleAlias = 'a') {
	return [
		`${memoryAlias}.article_id = ${articleAlias}.article_id`,
		`${memoryAlias}.source_content_hash <=> ${articleAlias}.content_hash`,
		`${memoryAlias}.source_title <=> ${articleAlias}.title`,
		`${memoryAlias}.source_updated_at <=> ${articleAlias}.update_time`,
	].join(' AND ');
}

function normalizeMessages(messages) {
	return (Array.isArray(messages) ? messages : [])
		.filter((message) => message && typeof message === 'object')
		.map((message) => ({
			role: message.role === 'assistant' ? 'assistant' : 'user',
			content: truncateText(stripThinkAndExplicitBlocks(message.content || ''), 1200),
		}))
		.filter((message) => message.content)
		.slice(-MAX_HISTORY_MESSAGES);
}

function serializeNovelRow(row) {
	return {
		novel_id: Number(row.novel_id),
		name: row.name,
		description: row.content || '',
		author: row.author || null,
		update_time: row.update_time || null,
		is_complete: Number(row.is_complete || 0),
		is_personal: Number(row.is_personal || 0),
		text_count: Number(row.text_count || 0),
		chapter_count: Number(row.chapter_count || 0),
		latest_chapter: row.latest_chapter === null || row.latest_chapter === undefined
			? null
			: Number(row.latest_chapter),
		bookcase_count: Number(row.bookcase_count || 0),
		comment_count: Number(row.comment_count || 0),
		pending_feedback_count: Number(row.pending_feedback_count || 0),
		tags: String(row.tags || '')
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean),
	};
}

async function getNovelProfile(novelId) {
	const rows = await query(
		`
			SELECT
				n.novel_id,
				n.name,
				n.content,
				n.update_time,
				n.is_complete,
				n.is_personal,
				n.text_count,
				u.name AS author,
				(
					SELECT COUNT(*)
					FROM articles a
					WHERE a.novel_id = n.novel_id
						AND a.deleted = 0
						AND a.is_draft = 0
						AND a.article_type = 'richtext'
				) AS chapter_count,
				(
					SELECT MAX(a.article_chapter)
					FROM articles a
					WHERE a.novel_id = n.novel_id
						AND a.deleted = 0
						AND a.is_draft = 0
						AND a.article_type = 'richtext'
				) AS latest_chapter,
				(
					SELECT COUNT(*)
					FROM bookcase b
					WHERE b.novel_id = n.novel_id
				) AS bookcase_count,
				(
					SELECT COUNT(*)
					FROM novel_comments nc
					WHERE nc.novel_id = n.novel_id
						AND nc.deleted = 0
						AND nc.reply_to_id = -1
				) AS comment_count,
				(
					SELECT COUNT(*)
					FROM article_feedback af
					INNER JOIN articles a2 ON a2.article_id = af.article_id
					WHERE a2.novel_id = n.novel_id
						AND a2.deleted = 0
						AND af.status = 0
				) AS pending_feedback_count,
				(
					SELECT GROUP_CONCAT(DISTINCT t.tag_name ORDER BY t.tag_name SEPARATOR ', ')
					FROM novel_tag nt
					INNER JOIN tags t ON t.tag_id = nt.tag_id
					WHERE nt.novel_id = n.novel_id
				) AS tags
			FROM novels n
			LEFT JOIN users u ON n.author_id = u.user_id
			WHERE n.novel_id = ?
				AND n.deleted = 0
				AND n.is_personal = 0
			LIMIT 1
		`,
		[novelId]
	);
	return rows.length > 0 ? serializeNovelRow(rows[0]) : null;
}

async function getNovelChapterIndex(novelId) {
	await ensureAgentMemorySchema();
	const rows = await query(
		`
			SELECT
				a.article_id,
				a.article_chapter,
				a.title,
				a.update_time,
				m.short_summary
			FROM articles a
			LEFT JOIN \`${memoryDatabase}\`.agent_memory m
				ON ${buildReaderMemoryValidityCondition('m', 'a')}
			WHERE a.novel_id = ?
				AND a.deleted = 0
				AND a.is_draft = 0
				AND a.article_type = 'richtext'
			ORDER BY a.article_chapter ASC
		`,
		[novelId]
	);

	return rows.map((row) => ({
		article_id: Number(row.article_id),
		chapter: Number(row.article_chapter),
		title: row.title || '',
		update_time: row.update_time || null,
		short_summary: row.short_summary || '',
		has_summary: !!row.short_summary,
	}));
}

async function getReaderMemoryRows(novelId) {
	await ensureAgentMemorySchema();
	const rows = await query(
		`
			SELECT
				a.article_id,
				a.article_chapter AS chapter,
				a.title,
				a.update_time,
				m.short_summary,
				m.long_summary,
				m.characters
			FROM articles a
			INNER JOIN \`${memoryDatabase}\`.agent_memory m
				ON ${buildReaderMemoryValidityCondition('m', 'a')}
			WHERE a.novel_id = ?
				AND a.deleted = 0
				AND a.is_draft = 0
				AND a.article_type = 'richtext'
			ORDER BY a.article_chapter ASC
		`,
		[novelId]
	);

	return rows.map((row) => ({
		article_id: Number(row.article_id),
		chapter: Number(row.chapter),
		title: row.title || '',
		update_time: row.update_time || null,
		short_summary: row.short_summary || '',
		long_summary: row.long_summary || '',
		characters: safeJsonParse(row.characters, []),
	}));
}

async function searchMemoriesByKeywords(novelId, keywords, page = 1, limit = 10) {
	const flatKeywords = normalizeKeywords(keywords);
	const phrases = normalizePhrases(keywords);
	if (flatKeywords.length === 0 && phrases.length === 0) {
		return { page: 1, total: 0, count: 0, results: [] };
	}

	const rows = await getReaderMemoryRows(novelId);
	const rankedRows = rows
		.map((row) => scoreMemoryRow(row, flatKeywords, phrases))
		.filter((row) => row.score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.chapter - a.chapter;
		});

	const safePage = Math.max(1, Number(page || 1));
	const safeLimit = Math.max(1, Math.min(Number(limit || 10), 10));
	const start = Math.max(0, (safePage - 1) * safeLimit);
	const results = rankedRows.slice(start, start + safeLimit).map((row) => {
		const citation = createCitationRecord({
			article_id: row.article_id,
			chapter: row.chapter,
			title: row.title,
			snippet: row.evidence_snippet || row.short_summary || row.long_summary,
			source: 'summary',
		});
		return {
			article_id: row.article_id,
			chapter: row.chapter,
			title: row.title,
			update_time: row.update_time,
			short_summary: row.short_summary,
			long_summary: row.long_summary,
			matched_fields: row.matched_fields,
			matched_keywords: row.matched_keywords,
			evidence_snippet: row.evidence_snippet,
			citation_id: citation ? citation.citation_id : '',
		};
	});

	return {
		page: safePage,
		total: rankedRows.length,
		count: results.length,
		results,
		citations: results
			.map((item) => createCitationRecord({
				article_id: item.article_id,
				chapter: item.chapter,
				title: item.title,
				snippet: item.evidence_snippet || item.short_summary || item.long_summary,
				source: 'summary',
			}))
			.filter(Boolean),
	};
}

async function searchChapters(novelId, queryInput, page = 1, limit = 5) {
	const keywords = normalizeKeywords(queryInput);
	if (keywords.length === 0) {
		return { page: 1, total: 0, count: 0, results: [] };
	}

	const conditions = keywords.map(() => '(a.title LIKE ? OR a.content LIKE ?)').join(' OR ');
	const params = [novelId];
	for (const keyword of keywords) {
		const like = `%${keyword}%`;
		params.push(like, like);
	}

	const rows = await query(
		`
			SELECT
				a.article_id,
				a.article_chapter,
				a.title,
				a.content,
				a.update_time
			FROM articles a
			WHERE a.novel_id = ?
				AND a.deleted = 0
				AND a.is_draft = 0
				AND a.article_type = 'richtext'
				AND (${conditions})
			ORDER BY a.article_chapter DESC
			LIMIT 120
		`,
		params
	);

	const rankedRows = rows.map((row) => {
		const title = row.title || '';
		const plainText = extractPlainText(row.content);
		const paragraphs = normalizeArticleParagraphs(row.content);
		const bestParagraph = findBestMatchingParagraph(paragraphs, keywords);
		const titleMatches = countMatches(title, keywords);
		const contentMatches = countMatches(plainText, keywords);
		const matchedFields = [];

		if (titleMatches > 0) matchedFields.push('title');
		if (contentMatches > 0) matchedFields.push('content');

		const allKeywordsCovered = keywords.every((keyword) => {
			const lower = String(keyword || '').toLowerCase();
			return title.toLowerCase().includes(lower) || plainText.toLowerCase().includes(lower);
		});

		const score = (titleMatches * 6) + (contentMatches * 2) + (allKeywordsCovered ? 4 : 0);

		return {
			article_id: Number(row.article_id),
			chapter: Number(row.article_chapter),
			title,
			update_time: row.update_time || null,
			matched_fields: matchedFields,
			matched_keywords: keywords.filter((keyword) => {
				const lower = String(keyword || '').toLowerCase();
				return title.toLowerCase().includes(lower) || plainText.toLowerCase().includes(lower);
			}),
			score,
			paragraph_id: bestParagraph ? bestParagraph.paragraph_id : null,
			snippet: bestParagraph
				? buildSnippet(bestParagraph.text, keywords, 140)
				: buildSnippet(plainText, keywords, 140),
		};
	});

	rankedRows.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.chapter - a.chapter;
	});

	const safePage = Math.max(1, Number(page || 1));
	const safeLimit = Math.max(1, Math.min(Number(limit || 5), 5));
	const start = Math.max(0, (safePage - 1) * safeLimit);
	const results = rankedRows.slice(start, start + safeLimit);

	return {
		page: safePage,
		total: rankedRows.length,
		count: results.length,
		results: results.map((item) => {
			const citation = createCitationRecord({
				article_id: item.article_id,
				chapter: item.chapter,
				title: item.title,
				paragraph_id: item.paragraph_id,
				snippet: item.snippet,
				source: 'content',
			});
			return {
				...item,
				citation_id: citation ? citation.citation_id : '',
			};
		}),
		citations: results
			.map((item) => createCitationRecord({
				article_id: item.article_id,
				chapter: item.chapter,
				title: item.title,
				paragraph_id: item.paragraph_id,
				snippet: item.snippet,
				source: 'content',
			}))
			.filter(Boolean),
	};
}

async function getChapterContext(novelId, options = {}) {
	const rows = await getReaderMemoryRows(novelId);
	const articleId = Number(options.article_id || 0);
	const chapter = Number(options.chapter || 0);
	const radius = Math.max(1, Math.min(Number(options.radius || 2), 5));

	let centerRow = null;
	if (articleId) {
		centerRow = rows.find((row) => row.article_id === articleId) || null;
	} else if (chapter) {
		centerRow = rows.find((row) => row.chapter === chapter) || null;
	}

	if (!centerRow) {
		return {
			success: false,
			error: 'chapter not found',
			results: [],
		};
	}

	const startChapter = Math.max(1, centerRow.chapter - radius);
	const endChapter = centerRow.chapter + radius;

	return {
		success: true,
		center: {
			article_id: centerRow.article_id,
			chapter: centerRow.chapter,
			title: centerRow.title || '',
		},
		radius,
		results: rows
			.filter((row) => row.chapter >= startChapter && row.chapter <= endChapter)
			.map((row) => ({
				article_id: row.article_id,
				chapter: row.chapter,
				title: row.title || '',
				update_time: row.update_time || null,
				short_summary: row.short_summary || '',
				long_summary: row.long_summary || '',
				characters: row.characters,
				citation_id: buildCitationId(row.article_id),
				is_center: row.article_id === centerRow.article_id,
			})),
		citations: rows
			.filter((row) => row.chapter >= startChapter && row.chapter <= endChapter)
			.map((row) => createCitationRecord({
				article_id: row.article_id,
				chapter: row.chapter,
				title: row.title || '',
				snippet: row.short_summary || row.long_summary,
				source: 'context',
			}))
			.filter(Boolean),
	};
}

async function getFullChapter(novelId, options = {}) {
	const articleId = Number(options.article_id || 0);
	const chapter = Number(options.chapter || 0);
	if (!articleId && !chapter) {
		return {
			success: false,
			error: 'article_id or chapter is required',
		};
	}

	const whereClause = articleId ? 'a.article_id = ?' : 'a.article_chapter = ?';
	const value = articleId || chapter;
	const rows = await query(
		`
			SELECT
				a.article_id,
				a.article_chapter,
				a.title,
				a.content,
				a.update_time
			FROM articles a
			WHERE a.novel_id = ?
				AND ${whereClause}
				AND a.deleted = 0
				AND a.is_draft = 0
				AND a.article_type = 'richtext'
			LIMIT 1
		`,
		[novelId, value]
	);

	if (rows.length === 0) {
		return {
			success: false,
			error: 'chapter not found',
		};
	}

	const row = rows[0];
	const paragraphs = normalizeArticleParagraphs(row.content);
	const paragraphRows = paragraphs.map((item) => ({
		citation_id: buildCitationId(row.article_id, item.paragraph_id),
		paragraph_id: item.paragraph_id,
		text: item.text,
	})).filter((item) => item.text);
	const selectedParagraphRows = selectParagraphWindow(paragraphRows, options);
	const excerptText = selectedParagraphRows.length > 0
		? selectedParagraphRows.map((item) => `[${item.citation_id}] ${item.text}`).join('\n')
		: truncateText(extractPlainText(row.content), 600);
	const excerptRange = selectedParagraphRows.length > 0
		? {
			start_paragraph_id: Number(selectedParagraphRows[0].paragraph_id || 0) || null,
			end_paragraph_id: Number(selectedParagraphRows[selectedParagraphRows.length - 1].paragraph_id || 0) || null,
		}
		: {
			start_paragraph_id: null,
			end_paragraph_id: null,
		};
	return {
		success: true,
		article_id: Number(row.article_id),
		chapter: Number(row.article_chapter),
		title: row.title || '',
		update_time: row.update_time || null,
		text_length: extractPlainText(row.content).length,
		paragraph_count: paragraphRows.length,
		selected_paragraph_count: selectedParagraphRows.length,
		selected_paragraph_range: excerptRange,
		full_text: excerptText,
		full_text_excerpt: excerptText,
		paragraphs: selectedParagraphRows,
		citations: selectedParagraphRows
			.map((item) => createCitationRecord({
				article_id: row.article_id,
				chapter: row.article_chapter,
				title: row.title || '',
				paragraph_id: item.paragraph_id,
				snippet: item.text,
				source: 'full_chapter',
			}))
			.filter(Boolean),
	};
}

async function getReaderFeedbackSummary(novelId, limit = 5) {
	const safeLimit = Math.max(1, Math.min(Number(limit || 5), 8));
	const statsRows = await query(
		`
			SELECT
				(
					SELECT COUNT(*)
					FROM article_feedback af
					INNER JOIN articles a ON a.article_id = af.article_id
					WHERE a.novel_id = ?
						AND a.deleted = 0
				) AS total_feedback_count,
				(
					SELECT COUNT(*)
					FROM article_feedback af
					INNER JOIN articles a ON a.article_id = af.article_id
					WHERE a.novel_id = ?
						AND a.deleted = 0
						AND af.status = 0
				) AS pending_feedback_count,
				(
					SELECT COUNT(*)
					FROM novel_comments nc
					WHERE nc.novel_id = ?
						AND nc.deleted = 0
						AND nc.reply_to_id = -1
				) AS total_comment_count
		`,
		[novelId, novelId, novelId]
	);

	const feedbackRows = await query(
		`
			SELECT
				af.feedback_id,
				af.article_id,
				af.feedback_content,
				af.paragraph_text,
				af.status,
				af.create_time,
				a.article_chapter,
				a.title
			FROM article_feedback af
			INNER JOIN articles a ON a.article_id = af.article_id
			WHERE a.novel_id = ?
				AND a.deleted = 0
			ORDER BY af.status ASC, af.create_time DESC
			LIMIT ?
		`,
		[novelId, safeLimit]
	);

	const commentRows = await query(
		`
			SELECT
				nc.essay_comment_id,
				nc.article_id,
				nc.content,
				nc.comment_time,
				nc.user_id,
				nc.reply_to_id,
				a.article_chapter,
				a.title,
				u.name AS user_name
			FROM novel_comments nc
			LEFT JOIN articles a ON a.article_id = nc.article_id
			LEFT JOIN users u ON u.user_id = nc.user_id
			WHERE nc.novel_id = ?
				AND nc.deleted = 0
				AND nc.reply_to_id = -1
			ORDER BY nc.comment_time DESC
			LIMIT ?
		`,
		[novelId, safeLimit]
	);

	return {
		novel_id: Number(novelId),
		total_feedback_count: Number(statsRows[0]?.total_feedback_count || 0),
		pending_feedback_count: Number(statsRows[0]?.pending_feedback_count || 0),
		total_comment_count: Number(statsRows[0]?.total_comment_count || 0),
		feedbacks: feedbackRows.map((row) => ({
			feedback_id: Number(row.feedback_id),
			article_id: Number(row.article_id),
			chapter: row.article_chapter === null || row.article_chapter === undefined ? null : Number(row.article_chapter),
			title: row.title || null,
			feedback_content: row.feedback_content || '',
			paragraph_text: row.paragraph_text || '',
			status: Number(row.status || 0),
			create_time: row.create_time || null,
		})),
		comments: commentRows.map((row) => ({
			comment_id: Number(row.essay_comment_id),
			article_id: row.article_id ? Number(row.article_id) : null,
			chapter: row.article_chapter === null || row.article_chapter === undefined ? null : Number(row.article_chapter),
			title: row.title || null,
			user_id: row.user_id ? Number(row.user_id) : null,
			user_name: row.user_name || null,
			content: row.content || '',
			comment_time: row.comment_time || null,
		})),
	};
}

function formatChapterAnchorLine(item) {
	return [
		`第${item.chapter}章`,
		`article_id=${item.article_id}`,
		`标题：${truncateText(item.title || '未命名', 28)}`,
		item.short_summary ? `摘要：${truncateText(item.short_summary, MAX_MODEL_SUMMARY_CHARS)}` : '摘要：暂无',
	].join('｜');
}

function buildChapterAnchorLines(chapterIndex) {
	const rows = Array.isArray(chapterIndex) ? chapterIndex.filter(Boolean) : [];
	if (rows.length === 0) {
		return ['暂无章节锚点，请优先使用检索工具。'];
	}

	if (rows.length <= MAX_NOVEL_ANCHOR_CHAPTERS + MAX_NOVEL_RECENT_CHAPTERS) {
		return rows.map((item) => formatChapterAnchorLine(item));
	}

	const anchorRows = pickRepresentativeItems(rows, MAX_NOVEL_ANCHOR_CHAPTERS);
	const recentRows = rows.slice(-MAX_NOVEL_RECENT_CHAPTERS);
	return uniqueBy(
		[...anchorRows, ...recentRows],
		(item) => Number(item.article_id || 0) || Number(item.chapter || 0)
	)
		.sort((a, b) => Number(a.chapter || 0) - Number(b.chapter || 0))
		.map((item) => formatChapterAnchorLine(item));
}

function buildNovelContextMessage(profile, chapterIndex) {
	const chapterRows = Array.isArray(chapterIndex) ? chapterIndex.filter(Boolean) : [];
	const anchorLines = buildChapterAnchorLines(chapterRows);
	const recentRows = chapterRows.slice(-MAX_NOVEL_RECENT_CHAPTERS);
	const recentLabel = recentRows.length > 0
		? recentRows.map((item) => `第${item.chapter}章《${truncateText(item.title || '未命名', 20)}》`).join('、')
		: '暂无';

	const lines = [
		'以下是当前已锁定作品的紧凑作品卡片，只用于快速定位范围，不代表完整证据：',
		`作品ID：${profile.novel_id}`,
		`作品名：${profile.name}`,
		`作者：${profile.author || '未知'}`,
		`标签：${(profile.tags || []).join('、') || '无'}`,
		`章节数：${profile.chapter_count || chapterRows.length || 0}`,
		`最新章节：${profile.latest_chapter ?? '未知'}`,
		`总字数：${profile.text_count || 0}`,
		`最近更新时间：${profile.update_time || '未知'}`,
		`收藏数：${profile.bookcase_count || 0}`,
		`评论数：${profile.comment_count || 0}`,
		`待处理反馈数：${profile.pending_feedback_count || 0}`,
		`作品简介：${truncateText(profile.description || '无', MAX_MODEL_DESCRIPTION_CHARS)}`,
		`最近章节锚点：${recentLabel}`,
		'',
		`章节锚点（共 ${chapterRows.length} 章，仅保留代表性章节，涉及具体情节时必须继续检索）：`,
		...anchorLines,
		'',
		'注意：如果问题涉及具体桥段、原句、细节或章节前后顺序，不要只根据锚点直接下结论，优先继续调用 search_keywords、search_chapters、get_chapter_context 或 get_full_chapter。',
	];

	return truncateBlockText(lines.join('\n'), MAX_CONTEXT_CHARS);
}

function buildExplicitToolInstruction(tools) {
	const toolNames = tools.map((tool) => tool.function.name).filter(Boolean);
	const toolSchemas = tools.map((tool) => ({
		name: tool.function.name,
		description: tool.function.description,
		parameters: tool.function.parameters,
	}));

	return {
		role: 'system',
		content: `当前模型需要通过显式协议调用工具。
当你需要调用工具时，不要输出解释文字，只输出如下格式的块：
<explicit_tool_call>
{"name":"工具名","arguments":{"参数名":"参数值"}}
</explicit_tool_call>

要求：
- 只能调用这些工具：${toolNames.join(', ')}
- <explicit_tool_call> 标签内必须是合法 JSON
- arguments 必须是对象
- 如果需要调用多个工具，就连续输出多个 <explicit_tool_call> 块
- 只有当你已经得出最终结论时，才调用 sendMessage

以下是可用工具定义：
${JSON.stringify(toolSchemas)}`,
	};
}

function buildSystemPrompt() {
	return {
		role: 'system',
		content: `你是“原木娘”，一个小说阅读平台的作品聊天助手。
你的任务是围绕当前已经锁定的这一部作品，回答读者关于剧情、角色、设定、章节、读者评价的问题。

工作原则：
- 只能回答当前这部作品相关的问题，不要扩展到别的作品。
- 优先依据系统里提供的作品画像、章节摘要、章节检索结果、章节全文和读者反馈来回答。
- 先用最少必要工具收集证据；已有证据足够时立即停止检索并输出答案。
- 不要重复调用相同工具和相同参数；如果上一轮已经拿到有效证据，优先基于现有证据作答。
- 不要编造剧情、人物关系或具体句子。证据不足时要明确说不确定。
- 能指出章节时尽量指出章节。
- 当工具结果里出现 citations 字段或 citation_id 时，说明这些内容可以作为引用依据。
- 最终回答应尽量在关键事实、判断、直接引用后面补上引用标记，格式只能是 [[cite:引用ID]]，可以连续使用多个。
- 如果要引用段落，优先使用 search_chapters 或 get_full_chapter 返回的 paragraph_id / citation_id；不要编造引用ID。
- 用户如果问剧情回顾、角色关系、设定梳理，优先使用 search_keywords。
- 用户如果问具体场景、原句、某个细节、某个物件、某句台词，优先使用 search_chapters，必要时再用 get_full_chapter。
- get_full_chapter 成本最高，只有摘要、正文命中和上下文仍不足时才使用；调用时尽量提供 query 或 paragraph_id 来缩小范围。
- 用户如果问某章前后发生了什么，优先使用 get_chapter_context。
- 用户如果问评论、争议、吐槽、反馈，优先使用 get_reader_feedback_summary。
- 收集到足够信息后，必须调用 sendMessage 输出最终回复。`,
	};
}

function buildTools() {
	return [
		{
			type: 'function',
			function: {
				name: 'search_keywords',
				description: '在当前作品的章节记忆摘要中搜索剧情、设定、角色关系和事件回顾。',
				parameters: {
					type: 'object',
					properties: {
						keywords: {
							type: 'array',
							items: { type: 'string' },
							description: '用于检索剧情摘要的关键词列表',
						},
						page: {
							type: 'integer',
							description: '页码，从 1 开始',
							default: 1,
						},
					},
					required: ['keywords'],
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'search_chapters',
				description: '在当前作品的章节标题和正文中搜索，适合找具体桥段、道具、台词和场景。',
				parameters: {
					type: 'object',
					properties: {
						query: {
							type: 'string',
							description: '搜索关键词或核心短语',
						},
						page: {
							type: 'integer',
							description: '页码，从 1 开始',
							default: 1,
						},
					},
					required: ['query'],
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'get_chapter_context',
				description: '获取某章前后若干章的上下文摘要。',
				parameters: {
					type: 'object',
					properties: {
						article_id: {
							type: 'integer',
							description: '章节 article_id',
						},
						chapter: {
							type: 'integer',
							description: '章节序号',
						},
						radius: {
							type: 'integer',
							description: '向前向后各取几章，默认 2，最大 5',
							default: 2,
						},
					},
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'get_full_chapter',
				description: '获取当前作品单章的相关段落窗口，适合在已有章节线索基础上确认原文细节。只有证据不足时再调用。',
				parameters: {
					type: 'object',
					properties: {
						article_id: {
							type: 'integer',
							description: '章节 article_id',
						},
						chapter: {
							type: 'integer',
							description: '章节序号',
						},
						paragraph_id: {
							type: 'integer',
							description: '若已知目标段落，可传入 paragraph_id 来缩小范围',
						},
						query: {
							type: 'string',
							description: '尽量传入当前要核对的关键词或短语，便于只返回相关段落窗口',
						},
					},
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'get_reader_feedback_summary',
				description: '获取当前作品的读者评论和反馈摘要。',
				parameters: {
					type: 'object',
					properties: {
						limit: {
							type: 'integer',
							description: '返回反馈和评论条数，默认 5，最大 8',
							default: 5,
						},
					},
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'sendMessage',
				description: '向用户发送最终回复。这是你结束本轮回答的唯一方式。message 里允许包含 [[cite:引用ID]] 形式的引用标记。',
				parameters: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							description: '发送给用户的最终消息，可在句末附加 [[cite:引用ID]] 作为引用',
						},
					},
					required: ['message'],
				},
			},
		},
	];
}

function getWriterRuntimeConfig(options = {}) {
	return {
		name: 'deepseek-writer',
		baseUrl: DEEPSEEK_BASE_URL,
		apiKey: DEEPSEEK_API_KEY,
		model: options.deepThinking === true ? DEEPSEEK_THINKING_MODEL : DEEPSEEK_MODEL,
		toolCallMode: 'native',
		supportsThinking: true,
	};
}

function getPlannerRuntimeConfig() {
	if (!PLANNER_BASE_URL || !PLANNER_API_KEY || !PLANNER_MODEL) {
		return null;
	}
	return {
		name: 'reader-planner',
		baseUrl: PLANNER_BASE_URL,
		apiKey: PLANNER_API_KEY,
		model: PLANNER_MODEL,
		toolCallMode: PLANNER_TOOL_CALL_MODE || 'explicit',
		supportsThinking: false,
	};
}

function shouldSendNativeTools(runtimeConfig) {
	const mode = String(runtimeConfig?.toolCallMode || 'native').trim().toLowerCase();
	return mode === 'native' || mode === 'auto';
}

function shouldUseExplicitToolInstruction(runtimeConfig, tools) {
	const mode = String(runtimeConfig?.toolCallMode || 'native').trim().toLowerCase();
	return mode === 'explicit' && Array.isArray(tools) && tools.length > 0;
}

function extractChatPayload(data) {
	if (!data || typeof data !== 'object') {
		throw new Error('Chat API returned an empty response body');
	}

	if (typeof data.code === 'number' && data.code !== 0) {
		const message = data.message || data.msg || 'Unknown API error';
		throw new Error(`Chat API business error: ${message} (code: ${data.code})`);
	}

	if (Array.isArray(data.choices) && data.choices.length > 0 && data.choices[0]?.message) {
		return {
			message: data.choices[0].message,
			usage: data.usage || null,
			model: data.model || null,
		};
	}

	if (data.message && typeof data.message === 'object') {
		return {
			message: data.message,
			usage: data.usage || null,
			model: data.model || null,
		};
	}

	if (data.data && typeof data.data === 'object') {
		if (Array.isArray(data.data.choices) && data.data.choices.length > 0 && data.data.choices[0]?.message) {
			return {
				message: data.data.choices[0].message,
				usage: data.data.usage || data.usage || null,
				model: data.data.model || data.model || null,
			};
		}
		if (data.data.message && typeof data.data.message === 'object') {
			return {
				message: data.data.message,
				usage: data.data.usage || data.usage || null,
				model: data.data.model || data.model || null,
			};
		}
	}

	throw new Error(`Chat API returned an unsupported response: ${JSON.stringify(data).slice(0, 400)}`);
}

async function callChatModel(runtimeConfig, messages, tools, options = {}) {
	if (!runtimeConfig || !runtimeConfig.baseUrl || !runtimeConfig.apiKey || !runtimeConfig.model) {
		const error = new Error('Chat model runtime is not configured.');
		error.code = 'CHAT_MODEL_CONFIG_MISSING';
		throw error;
	}

	const requestMessages = shouldUseExplicitToolInstruction(runtimeConfig, tools)
		? [buildExplicitToolInstruction(tools), ...messages]
		: messages;
	const body = {
		model: runtimeConfig.model,
		messages: requestMessages,
		stream: false,
	};

	if (Array.isArray(tools) && tools.length > 0 && shouldSendNativeTools(runtimeConfig)) {
		body.tools = tools;
	}

	if (options.deepThinking === true && runtimeConfig.supportsThinking) {
		body.thinking = {
			type: 'enabled',
		};
	}

	const response = await fetch(`${runtimeConfig.baseUrl}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${runtimeConfig.apiKey}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Chat API call failed: ${response.status} ${response.statusText} - ${errorText}`);
	}

	const data = await response.json();
	const payload = extractChatPayload(data);
	const message = payload.message;
	if (!message.tool_calls) {
		const explicitToolCalls = parseExplicitToolCalls(message.content);
		if (explicitToolCalls && explicitToolCalls.length > 0) {
			message.tool_calls = explicitToolCalls;
		}
	}

	return {
		message,
		usage: payload.usage || null,
		model: payload.model || runtimeConfig.model,
	};
}

async function executeTool(novelId, toolName, args) {
	if (toolName === 'sendMessage') {
		return {
			success: true,
			final_message: String(args.message || '').trim(),
			__final: true,
		};
	}

	if (toolName === 'search_keywords') {
		return searchMemoriesByKeywords(novelId, args.keywords || [], args.page || 1);
	}

	if (toolName === 'search_chapters') {
		return searchChapters(novelId, args.query || '', args.page || 1);
	}

	if (toolName === 'get_chapter_context') {
		return getChapterContext(novelId, args || {});
	}

	if (toolName === 'get_full_chapter') {
		return getFullChapter(novelId, args || {});
	}

	if (toolName === 'get_reader_feedback_summary') {
		return getReaderFeedbackSummary(novelId, args.limit || 5);
	}

	return {
		error: `Unknown tool: ${toolName}`,
	};
}

function summarizeToolResult(toolName, result) {
	if (!result || typeof result !== 'object') {
		return '';
	}

	if (toolName === 'search_keywords') {
		const rows = Array.isArray(result.results) ? result.results : [];
		if (rows.length === 0) {
			return '没有在章节摘要里找到直接相关的内容';
		}
		const chapterLabels = rows
			.slice(0, 3)
			.map((item) => `第${item.chapter}章`)
			.filter(Boolean)
			.join('、');
		return `在章节摘要中命中 ${rows.length} 章${chapterLabels ? `，重点查看了 ${chapterLabels}` : ''}`;
	}

	if (toolName === 'search_chapters') {
		const rows = Array.isArray(result.results) ? result.results : [];
		if (rows.length === 0) {
			return '没有在正文里找到直接匹配的章节';
		}
		const chapterLabels = rows
			.slice(0, 3)
			.map((item) => `第${item.chapter}章`)
			.filter(Boolean)
			.join('、');
		return `在章节正文中命中 ${rows.length} 章${chapterLabels ? `，重点查看了 ${chapterLabels}` : ''}`;
	}

	if (toolName === 'get_chapter_context') {
		if (!result.success || !result.center) {
			return '没有找到对应章节的上下文摘要';
		}
		return `查看了第${result.center.chapter}章前后 ${result.radius} 章的上下文`;
	}

	if (toolName === 'get_full_chapter') {
		if (!result.success) {
			return '没有找到对应章节原文';
		}
		return `读取了第${result.chapter}章《${result.title || '未命名章节'}》的相关原文段落`;
	}

	if (toolName === 'get_reader_feedback_summary') {
		const feedbackCount = Array.isArray(result.feedbacks) ? result.feedbacks.length : 0;
		const commentCount = Array.isArray(result.comments) ? result.comments.length : 0;
		return `整理了 ${feedbackCount} 条反馈和 ${commentCount} 条读者评论`;
	}

	return '';
}

function buildCompactToolResultForModel(toolName, result) {
	if (!result || typeof result !== 'object') {
		return result;
	}

	if (result.error) {
		return {
			success: false,
			error: String(result.error),
		};
	}

	if (toolName === 'search_keywords') {
		const rows = (Array.isArray(result.results) ? result.results : [])
			.slice(0, MAX_MODEL_RESULT_ITEMS)
			.map((item) => ({
				citation_id: item.citation_id || '',
				article_id: Number(item.article_id || 0),
				chapter: Number(item.chapter || 0),
				title: truncateText(item.title || '未命名章节', 28),
				snippet: truncateText(item.evidence_snippet || item.short_summary || item.long_summary, MAX_MODEL_SNIPPET_CHARS),
				matched_keywords: (Array.isArray(item.matched_keywords) ? item.matched_keywords : []).slice(0, 4),
			}));
		return {
			page: Number(result.page || 1),
			total: Number(result.total || rows.length),
			count: rows.length,
			results: rows,
		};
	}

	if (toolName === 'search_chapters') {
		const rows = (Array.isArray(result.results) ? result.results : [])
			.slice(0, MAX_MODEL_RESULT_ITEMS)
			.map((item) => ({
				citation_id: item.citation_id || '',
				article_id: Number(item.article_id || 0),
				chapter: Number(item.chapter || 0),
				title: truncateText(item.title || '未命名章节', 28),
				paragraph_id: Number(item.paragraph_id || 0) || null,
				snippet: truncateText(item.snippet || '', MAX_MODEL_SNIPPET_CHARS),
				matched_keywords: (Array.isArray(item.matched_keywords) ? item.matched_keywords : []).slice(0, 4),
			}));
		return {
			page: Number(result.page || 1),
			total: Number(result.total || rows.length),
			count: rows.length,
			results: rows,
		};
	}

	if (toolName === 'get_chapter_context') {
		const rows = (Array.isArray(result.results) ? result.results : [])
			.slice(0, MAX_MODEL_RESULT_ITEMS)
			.map((item) => ({
				citation_id: item.citation_id || '',
				article_id: Number(item.article_id || 0),
				chapter: Number(item.chapter || 0),
				title: truncateText(item.title || '未命名章节', 28),
				is_center: item.is_center === true,
				summary: truncateText(item.short_summary || item.long_summary || '', MAX_MODEL_SNIPPET_CHARS),
			}));
		return {
			success: result.success !== false,
			center: result.center ? {
				article_id: Number(result.center.article_id || 0),
				chapter: Number(result.center.chapter || 0),
				title: truncateText(result.center.title || '未命名章节', 28),
			} : null,
			radius: Number(result.radius || 0),
			results: rows,
		};
	}

	if (toolName === 'get_full_chapter') {
		const rows = (Array.isArray(result.paragraphs) ? result.paragraphs : [])
			.slice(0, FULL_CHAPTER_MAX_PARAGRAPHS)
			.map((item) => ({
				citation_id: item.citation_id || '',
				paragraph_id: Number(item.paragraph_id || 0) || null,
				text: truncateText(item.text || '', MAX_MODEL_SNIPPET_CHARS),
			}));
		return {
			success: result.success !== false,
			article_id: Number(result.article_id || 0),
			chapter: Number(result.chapter || 0),
			title: truncateText(result.title || '未命名章节', 28),
			paragraph_count: Number(result.paragraph_count || 0),
			selected_paragraph_count: Number(result.selected_paragraph_count || rows.length),
			selected_paragraph_range: result.selected_paragraph_range || null,
			paragraphs: rows,
		};
	}

	if (toolName === 'get_reader_feedback_summary') {
		return {
			novel_id: Number(result.novel_id || 0),
			total_feedback_count: Number(result.total_feedback_count || 0),
			pending_feedback_count: Number(result.pending_feedback_count || 0),
			total_comment_count: Number(result.total_comment_count || 0),
			feedbacks: (Array.isArray(result.feedbacks) ? result.feedbacks : [])
				.slice(0, 3)
				.map((item) => ({
					article_id: Number(item.article_id || 0),
					chapter: item.chapter === null || item.chapter === undefined ? null : Number(item.chapter),
					title: truncateText(item.title || '未命名章节', 28),
					feedback_content: truncateText(item.feedback_content || '', MAX_MODEL_SNIPPET_CHARS),
					paragraph_text: truncateText(item.paragraph_text || '', 100),
					status: Number(item.status || 0),
				})),
			comments: (Array.isArray(result.comments) ? result.comments : [])
				.slice(0, 3)
				.map((item) => ({
					article_id: item.article_id ? Number(item.article_id) : null,
					chapter: item.chapter === null || item.chapter === undefined ? null : Number(item.chapter),
					title: truncateText(item.title || '未命名章节', 28),
					user_name: truncateText(item.user_name || '匿名读者', 16),
					content: truncateText(item.content || '', MAX_MODEL_SNIPPET_CHARS),
				})),
		};
	}

	return result;
}

function extractReasoningHighlights(reasoningText) {
	const normalized = String(reasoningText || '').replace(/\s+/g, ' ').trim();
	if (!normalized) {
		return [];
	}

	const lines = [];
	const seen = new Set();

	function pushLine(text) {
		const value = String(text || '').trim();
		if (!value || seen.has(value)) {
			return;
		}
		seen.add(value);
		lines.push(value);
	}

	const chapterMatches = [...new Set(normalized.match(/第[0-9一二三四五六七八九十百千两0-9]+章/g) || [])].slice(0, 4);
	if (chapterMatches.length > 0) {
		pushLine(`正在围绕 ${chapterMatches.join('、')} 交叉核对情节细节和前后顺序`);
	}

	const quotedTerms = [...new Set(
		[...normalized.matchAll(/[《「“"]([^》」”"\n]{2,18})[》」”"]/g)]
			.map((match) => String(match[1] || '').trim())
			.filter(Boolean)
	)].slice(0, 3);
	if (quotedTerms.length > 0) {
		pushLine(`正在重点核对 ${quotedTerms.join('、')} 相关线索`);
	}

	if (/(是否|是不是|能否|有没有|判断|确认|先看|先确认)/i.test(normalized)) {
		pushLine('正在先判断问题落点，再决定是继续查摘要、正文还是上下文');
	}
	if (/(比较|对照|比对|交叉|互相印证)/i.test(normalized)) {
		pushLine('正在把多个线索交叉比对，只保留能互相印证的信息');
	}
	if (/(矛盾|冲突|排除|不一致|不确定|模糊|拿不准)/i.test(normalized)) {
		pushLine('正在排除互相冲突或不稳定的线索，优先保留可验证信息');
	}
	if (/(结论|回答|组织|表述|输出|总结|收束)/i.test(normalized)) {
		pushLine('正在把已经确认的依据整理成最终回答');
	}

	return lines.slice(0, 4);
}

function summarizeReasoningPlan(reasoningContent, toolCalls, cleanContent, step = 0) {
	const lines = [];
	const seen = new Set();
	const reasoningText = extractPlainText(reasoningContent).replace(/\s+/g, ' ').trim();
	const toolNames = Array.isArray(toolCalls)
		? toolCalls
			.map((toolCall) => String(toolCall?.function?.name || '').trim())
			.filter(Boolean)
		: [];

	function pushLine(text) {
		const normalized = String(text || '').trim();
		if (!normalized || seen.has(normalized)) {
			return;
		}
		seen.add(normalized);
		lines.push(normalized);
	}

	if (reasoningText) {
		for (const line of extractReasoningHighlights(reasoningText)) {
			pushLine(line);
		}

		const reasoningRules = [
			{
				pattern: /(角色|人物|关系|身份|立场)/i,
				text: '正在梳理角色关系和人物立场，避免把不同线索混在一起',
			},
			{
				pattern: /(章节|正文|原文|哪章|第.{0,6}章)/i,
				text: '正在回到具体章节原文确认细节，避免只靠印象回答',
			},
			{
				pattern: /(上下文|前后|时间线|顺序|先后)/i,
				text: '正在核对前后章节顺序和上下文，避免断章取义',
			},
			{
				pattern: /(设定|世界观|规则|背景)/i,
				text: '正在核对作品设定和背景边界，避免设定冲突',
			},
			{
				pattern: /(反馈|评论|读者)/i,
				text: '正在区分正文事实和读者反馈，避免把评论当成正文信息',
			},
			{
				pattern: /(证据|核对|比对|确认|验证|排除)/i,
				text: '正在交叉核对证据，优先保留更稳的章节依据',
			},
			{
				pattern: /(总结|组织|回答|回复|表述|输出)/i,
				text: '正在把已经确认的证据整理成最终回答',
			},
		];

		for (const rule of reasoningRules) {
			if (rule.pattern.test(reasoningText)) {
				pushLine(rule.text);
			}
		}
	}

	if (toolNames.length === 0) {
		if (lines.length === 0) {
			pushLine(
				cleanContent
					? '现有证据已经够用，正在把关键信息整理成最终回答'
					: (
						step === 0
							? '先判断问题落点，再决定该查章节摘要、正文还是读者反馈'
							: '继续收束已有证据，减少无关检索'
					)
			);
		}
		return lines.slice(0, 5);
	}

	if (toolNames.includes('search_keywords')) {
		pushLine('先从章节摘要缩小范围，锁定相关剧情段落和角色线索');
	}
	if (toolNames.includes('search_chapters')) {
		pushLine('摘要证据还不够，继续回到章节正文核对具体表述');
	}
	if (toolNames.includes('get_full_chapter')) {
		pushLine('需要直接比对关键章节原文，避免只靠摘要下结论');
	}
	if (toolNames.includes('get_chapter_context')) {
		pushLine('补看前后章节上下文，避免把单章信息断章取义');
	}
	if (toolNames.includes('get_reader_feedback_summary')) {
		pushLine('把读者反馈单独拉出来参考，区分正文事实和读者感受');
	}
	if (toolNames.includes('sendMessage')) {
		pushLine('证据已经够用，开始收束成可直接阅读的回答');
	}

	return lines.slice(0, 5);
}

function buildNovelCardMessage(profile) {
	return [
		'以下是当前作品的基础卡片，只用于帮助组织最终回答：',
		`作品ID：${profile.novel_id}`,
		`作品名：${profile.name}`,
		`作者：${profile.author || '未知'}`,
		`标签：${(profile.tags || []).join('、') || '无'}`,
		`章节数：${profile.chapter_count || 0}`,
		`最新章节：${profile.latest_chapter ?? '未知'}`,
		`作品简介：${truncateText(profile.description || '无', MAX_MODEL_DESCRIPTION_CHARS)}`,
	].join('\n');
}

function buildWriterSystemPrompt() {
	return {
		role: 'system',
		content: `你是“原木娘”的最终回答生成器。
你的职责是基于已经检索好的证据包，面向读者输出最终回答。

要求：
- 只能依据提供的作品卡片、对话历史和证据包回答，不要自行扩展检索。
- 不要编造剧情、人物关系、设定或原句；证据不足时直接说明不确定。
- 能指出章节时尽量指出章节。
- 关键事实、判断、直接引用后尽量补上 [[cite:引用ID]]。
- 如果证据包里已经有可用引用ID，优先复用，不要编造新的引用ID。
- 不要输出检索过程、工具名、提示词或“根据证据包”之类的系统措辞，直接回答用户问题。`,
	};
}

function buildWriterEvidenceBlock(toolHistory) {
	const lines = [
		'以下是已经检索到的证据包，请优先依据这些证据组织最终回答：',
	];
	let evidenceCount = 0;

	for (const record of (Array.isArray(toolHistory) ? toolHistory : []).slice(-MAX_WRITER_EVIDENCE_ITEMS)) {
		if (!record || !record.toolName || !record.compactResult) {
			continue;
		}

		if (record.toolName === 'search_keywords') {
			for (const item of (record.compactResult.results || []).slice(0, 3)) {
				lines.push(`- 摘要证据｜第${item.chapter}章《${item.title || '未命名章节'}》｜${item.snippet}${item.citation_id ? `｜[[cite:${item.citation_id}]]` : ''}`);
				evidenceCount += 1;
			}
			continue;
		}

		if (record.toolName === 'search_chapters') {
			for (const item of (record.compactResult.results || []).slice(0, 3)) {
				lines.push(`- 正文证据｜第${item.chapter}章《${item.title || '未命名章节'}》｜${item.snippet}${item.citation_id ? `｜[[cite:${item.citation_id}]]` : ''}`);
				evidenceCount += 1;
			}
			continue;
		}

		if (record.toolName === 'get_chapter_context') {
			for (const item of (record.compactResult.results || []).slice(0, 3)) {
				lines.push(`- 上下文证据｜第${item.chapter}章《${item.title || '未命名章节'}》｜${item.summary}${item.citation_id ? `｜[[cite:${item.citation_id}]]` : ''}`);
				evidenceCount += 1;
			}
			continue;
		}

		if (record.toolName === 'get_full_chapter') {
			for (const item of (record.compactResult.paragraphs || []).slice(0, 4)) {
				lines.push(`- 段落证据｜第${record.compactResult.chapter}章《${record.compactResult.title || '未命名章节'}》｜${item.text}${item.citation_id ? `｜[[cite:${item.citation_id}]]` : ''}`);
				evidenceCount += 1;
			}
			continue;
		}

		if (record.toolName === 'get_reader_feedback_summary') {
			for (const item of (record.compactResult.feedbacks || []).slice(0, 2)) {
				lines.push(`- 反馈证据｜第${item.chapter || '?'}章《${item.title || '未命名章节'}》｜${item.feedback_content}`);
				evidenceCount += 1;
			}
			for (const item of (record.compactResult.comments || []).slice(0, 2)) {
				lines.push(`- 评论证据｜${item.user_name || '匿名读者'}｜${item.content}`);
				evidenceCount += 1;
			}
		}
	}

	if (evidenceCount === 0) {
		lines.push('- 当前没有额外证据，只能依据作品卡片和对话内容谨慎回答。');
	}

	return truncateBlockText(lines.join('\n'), MAX_WRITER_EVIDENCE_CHARS);
}

function buildWriterMessages(profile, messages, plannerDraft, toolHistory) {
	const normalizedHistory = normalizeMessages(messages);
	const writerMessages = [
		buildWriterSystemPrompt(),
		{
			role: 'system',
			content: buildNovelCardMessage(profile),
		},
		{
			role: 'system',
			content: buildWriterEvidenceBlock(toolHistory),
		},
	];

	if (plannerDraft) {
		writerMessages.push({
			role: 'system',
			content: `以下是前置模型整理的草稿，仅供参考，可以重写，但不得违背证据：\n${truncateBlockText(plannerDraft, 900)}`,
		});
	}

	return [
		...writerMessages,
		...normalizedHistory,
	];
}

async function runReaderNovelChat(novelId, messages, onEvent, options = {}) {
	const profile = await getNovelProfile(novelId);
	if (!profile) {
		const error = new Error('作品不存在或未公开。');
		error.code = 'NOVEL_NOT_FOUND';
		throw error;
	}

	const chapterIndex = await getNovelChapterIndex(novelId);
	const tools = buildTools();
	const normalizedHistory = normalizeMessages(messages);
	const writerRuntime = getWriterRuntimeConfig(options);
	const plannerRuntime = getPlannerRuntimeConfig();
	const useSeparatePlanner = !!plannerRuntime;
	const planningRuntime = plannerRuntime || writerRuntime;
	const planningMessages = [
		buildSystemPrompt(),
		{
			role: 'system',
			content: buildNovelContextMessage(profile, chapterIndex),
		},
		...normalizedHistory,
	];

	let plannerDraft = '';
	let finalMessage = '';
	let finalCitations = [];
	const citationRegistry = new Map();
	const recentCitationIds = [];
	const toolHistory = [];
	const toolCache = new Map();
	for (let step = 0; step < MAX_TOOL_STEPS; step += 1) {
		if (typeof onEvent === 'function') {
			onEvent('status', {
				message: step === 0
					? '正在整理作品画像、目录和现有摘要'
					: '正在补充证据并收束答案',
			});
		}

		const completion = await callChatModel(
			planningRuntime,
			planningMessages,
			tools,
			useSeparatePlanner ? {} : options
		);
		const responseMessage = completion.message || {};
		const cleanContent = stripThinkAndExplicitBlocks(responseMessage.content || '');
		const toolCalls = Array.isArray(responseMessage.tool_calls) ? responseMessage.tool_calls : null;
		const reasoningContent = typeof responseMessage.reasoning_content === 'string'
			? responseMessage.reasoning_content
			: undefined;

		if (options.deepThinking === true && typeof onEvent === 'function') {
			const reasoningLines = summarizeReasoningPlan(reasoningContent, toolCalls, cleanContent, step);
			for (const text of reasoningLines) {
				onEvent('reasoning', {
					text,
				});
			}
		}

		planningMessages.push({
			role: 'assistant',
			content: cleanContent,
			tool_calls: toolCalls || undefined,
		});

		if (toolCalls && toolCalls.length > 0) {
			let shouldFinish = false;
			for (const toolCall of toolCalls) {
				const toolName = toolCall?.function?.name;
				const args = safeParseToolArgs(toolCall?.function?.arguments);

				if (typeof onEvent === 'function') {
					onEvent('status', {
						message: toolName === 'sendMessage'
							? '正在组织最终回答'
							: `正在检索${TOOL_STATUS_TEXT[toolName] || toolName}`,
					});
				}

				const toolSignature = `${toolName}:${JSON.stringify(args || {})}`;
				const hasCachedResult = toolCache.has(toolSignature);
				const result = hasCachedResult
					? toolCache.get(toolSignature)
					: await executeTool(novelId, toolName, args);
				if (!hasCachedResult) {
					toolCache.set(toolSignature, result);
				}
				if (result && result.__final) {
					if (typeof onEvent === 'function') {
						onEvent('trace', {
							text: '已整理完证据，开始组织最终回答',
						});
					}
					plannerDraft = String(result.final_message || '').trim();
					shouldFinish = true;
					break;
				}

				registerCitationList(result && result.citations, citationRegistry, recentCitationIds);

				const traceText = summarizeToolResult(toolName, result);
				if (traceText && typeof onEvent === 'function') {
					onEvent('trace', {
						text: hasCachedResult ? `复用了相同检索：${traceText}` : traceText,
					});
				}

				const compactResult = buildCompactToolResultForModel(toolName, result);
				if (!hasCachedResult) {
					toolHistory.push({
						toolName,
						compactResult,
					});
				}

				planningMessages.push({
					role: 'tool',
					name: toolName,
					tool_call_id: toolCall.id,
					content: JSON.stringify(compactResult),
				});
			}

			if (shouldFinish) {
				break;
			}
			continue;
		}

		if (cleanContent) {
			plannerDraft = cleanContent;
			break;
		}
	}

	if (useSeparatePlanner && (toolHistory.length > 0 || options.deepThinking === true)) {
		if (typeof onEvent === 'function') {
			onEvent('status', {
				message: '正在组织最终回答',
			});
		}
		const writerMessages = buildWriterMessages(profile, messages, plannerDraft, toolHistory);
		const writerCompletion = await callChatModel(writerRuntime, writerMessages, null, {
			deepThinking: options.deepThinking === true,
		});
		const writerMessage = stripThinkAndExplicitBlocks(writerCompletion.message?.content || '');
		const writerReasoning = typeof writerCompletion.message?.reasoning_content === 'string'
			? writerCompletion.message.reasoning_content
			: '';
		if (options.deepThinking === true && typeof onEvent === 'function') {
			const reasoningLines = summarizeReasoningPlan(writerReasoning, null, writerMessage || plannerDraft || '', MAX_TOOL_STEPS);
			for (const text of reasoningLines) {
				onEvent('reasoning', {
					text,
				});
			}
		}
		const finalized = finalizeAssistantMessage(
			writerMessage || plannerDraft,
			citationRegistry,
			recentCitationIds
		);
		finalMessage = finalized.message;
		finalCitations = finalized.citations;
	} else if (plannerDraft) {
		const finalized = finalizeAssistantMessage(plannerDraft, citationRegistry, recentCitationIds);
		finalMessage = finalized.message;
		finalCitations = finalized.citations;
	}

	if (!finalMessage) {
		finalMessage = '我暂时没有收集到足够稳定的证据来回答这个问题。你可以换一种问法，或者直接提角色名、章节名、桥段细节。';
	}

	return {
		novel: profile,
		message: finalMessage,
		citations: finalCitations,
	};
}

function createNdjsonStreamWriter(res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
	res.setHeader('Cache-Control', 'no-cache, no-transform');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('X-Accel-Buffering', 'no');
	if (typeof res.flushHeaders === 'function') {
		res.flushHeaders();
	}

	return {
		write(payload) {
			res.write(`${JSON.stringify(payload)}\n`);
		},
		end() {
			res.end();
		},
	};
}

async function streamTextMessage(text, writer) {
	const source = String(text || '').trim();
	if (!source) {
		return;
	}

	for (let index = 0; index < source.length; index += STREAM_CHUNK_SIZE) {
		writer.write({
			type: 'delta',
			content: source.slice(index, index + STREAM_CHUNK_SIZE),
		});
		if (STREAM_CHUNK_DELAY_MS > 0) {
			await new Promise((resolve) => setTimeout(resolve, STREAM_CHUNK_DELAY_MS));
		}
	}
}

async function handleReaderNovelChatStream(req, res) {
	const novelId = Number(req.body?.novel_id || 0);
	const messages = normalizeMessages(req.body?.messages);
	const deepThinking = req.body?.deep_thinking === true;

	if (!novelId) {
		return res.status(400).json({ msg: 'novel_id 不能为空' });
	}

	const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
	if (!latestUserMessage || !latestUserMessage.content) {
		return res.status(400).json({ msg: 'messages 不能为空' });
	}

	const writer = createNdjsonStreamWriter(res);

	try {
		const result = await runReaderNovelChat(
			novelId,
			messages,
			(eventType, payload = {}) => {
				writer.write({
					type: eventType,
					...payload,
				});
			},
			{ deepThinking }
		);

		if (Array.isArray(result.citations) && result.citations.length > 0) {
			writer.write({
				type: 'citations',
				items: result.citations,
			});
		}

		await streamTextMessage(result.message, writer);
		writer.write({
			type: 'done',
		});
		writer.end();
	} catch (error) {
		console.log(error);
		writer.write({
			type: 'error',
			message: error.code === 'DEEPSEEK_API_KEY_MISSING'
				? 'AI 配置尚未完成'
				: error.message || '原木娘暂时没有响应，请稍后再试',
		});
		writer.end();
	}
}

module.exports = {
	handleReaderNovelChatStream,
};
