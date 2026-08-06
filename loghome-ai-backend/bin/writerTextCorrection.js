const fetch = require('node-fetch');
const { query } = require('../sql.js');
const config = require('../config.js');

const textCorrectionConfig = config.api?.writerAssist?.textCorrection || {};
const TEXT_CORRECTION_BASE_URL = String(textCorrectionConfig.baseUrl || '').replace(/\/+$/, '');
const TEXT_CORRECTION_API_KEY = textCorrectionConfig.apiKey || '';
const TEXT_CORRECTION_MODEL = textCorrectionConfig.model || 'qwen3.6-chat';
const { consumeRedstone, sendBillingError } = require('./redstoneBilling');
const MODEL_REQUEST_TIMEOUT_MS = Math.max(15000, Number(
	config.writerTextCorrectionRequestTimeoutMs
		|| process.env.WRITER_TEXT_CORRECTION_REQUEST_TIMEOUT_MS
		|| 120000
));
const MAX_PARAGRAPH_CHARS = 2000;

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
	return Number.isInteger(normalizedId) && normalizedId > 0 ? normalizedId : null;
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
			text: text.length > MAX_PARAGRAPH_CHARS ? text.slice(0, MAX_PARAGRAPH_CHARS) : text,
		});
	}
	return normalized;
}

function findFragmentPositionsInText(text, originalFragment, correctedFragment) {
	const source = String(text || '');
	const original = String(originalFragment || '').trim();
	if (!original || !source) {
		return null;
	}

	const index = source.indexOf(original);
	if (index !== -1) {
		return {
			begin_pos: index,
			end_pos: index + original.length,
			original_fragment: original,
			corrected_fragment: String(correctedFragment || '').trim(),
		};
	}

	const normalizedOriginal = original.replace(/\s+/g, '');
	const normalizedSource = source.replace(/\s+/g, '');
	const normalizedIndex = normalizedSource.indexOf(normalizedOriginal);
	if (normalizedIndex !== -1) {
		let charCount = 0;
		let beginPos = 0;
		let endPos = source.length;
		for (let i = 0; i < source.length; i++) {
			if (!/\s/.test(source[i])) {
				if (charCount === normalizedIndex) {
					beginPos = i;
				}
				if (charCount === normalizedIndex + normalizedOriginal.length) {
					endPos = i;
					break;
				}
				charCount += 1;
			}
		}
		return {
			begin_pos: beginPos,
			end_pos: endPos,
			original_fragment: source.slice(beginPos, endPos),
			corrected_fragment: String(correctedFragment || '').trim(),
		};
	}

	return null;
}

function applyFragmentsToText(text, fragments) {
	const sorted = [...fragments].sort((a, b) => a.begin_pos - b.begin_pos);
	let cursor = 0;
	let result = '';
	for (const fragment of sorted) {
		if (fragment.begin_pos > cursor) {
			result += text.slice(cursor, fragment.begin_pos);
		}
		result += fragment.corrected_fragment;
		cursor = fragment.end_pos;
	}
	if (cursor < text.length) {
		result += text.slice(cursor);
	}
	return result;
}

function parseJsonObjectFromModel(text) {
	const source = String(text || '').trim();
	if (!source) {
		return null;
	}
	const unfenced = source
		.replace(/^```(?:json)?\s*/i, '')
		.replace(/\s*```$/i, '')
		.trim();
	try {
		return JSON.parse(unfenced);
	} catch (error) { /* fall through */ }

	const start = unfenced.indexOf('{');
	const end = unfenced.lastIndexOf('}');
	if (start !== -1 && end > start) {
		try {
			return JSON.parse(unfenced.slice(start, end + 1));
		} catch (error) { /* fall through */ }

		const arrayStart = unfenced.indexOf('[');
		const arrayEnd = unfenced.lastIndexOf(']');
		if (arrayStart !== -1 && arrayEnd > arrayStart) {
			try {
				return JSON.parse(unfenced.slice(arrayStart, arrayEnd + 1));
			} catch (error) { /* fall through */ }
		}
	}

	return null;
}

function buildCorrectionSystemPrompt() {
	return `你是一位专业的中文文本校对专家。你的任务是检查给定的小说段落文本，找出其中的潜在错别字、用词不当、语法错误、标点、笔误和病句问题。

要求：
1. 逐段仔细阅读文本，找出所有需要潜在修正的地方。
2. 只输出需要修改的段落；没有问题的段落不要输出。
3. 每个需要修改的段落必须包含 paragraph_index 和 fragments。
4. paragraph_index 必须使用输入中的段落编号，例如 [段落3] 对应 paragraph_index: 3。
5. fragments 中逐一列出每处修正。original_fragment 必须是原文中**精确出现**的文本片段，corrected_fragment 是修正后的文本。
6. **不要**输出完整的修正后段落文本，只输出段落号和 fragments。
7. 不要改变作者的文学风格、用词习惯和表达方式。
8. 不要修正人名、地名、专有名词。
9. 返回的 JSON 必须是一个对象，包含 paragraphs 数组；数组里只放需要修改的段落。

返回格式示例：
{
  "paragraphs": [
    {
      "paragraph_index": 2,
      "fragments": [
        { "original_fragment": "错别子", "corrected_fragment": "错别字" }
      ]
    }
  ]
}`;
}

function buildCorrectionUserMessage(paragraphs) {
	const lines = paragraphs.map((p) => {
		return `[段落${p.paragraph_index}] ${p.text}`;
	});
	return `${lines.join('\n\n')}`;
}

function isDeepSeekModel(model) {
	const normalized = String(model || '').trim().toLowerCase();
	return normalized.startsWith('deepseek-');
}

function mergeStreamingText(previousText, nextText) {
	const previous = String(previousText || '');
	const next = String(nextText || '');
	if (!next) {
		return { full: previous, delta: '' };
	}
	if (next.startsWith(previous)) {
		return { full: next, delta: next.slice(previous.length) };
	}
	if (previous.endsWith(next)) {
		return { full: previous, delta: '' };
	}
	const maxOverlap = Math.min(previous.length, next.length);
	for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
		if (previous.slice(previous.length - overlap) === next.slice(0, overlap)) {
			return {
				full: `${previous}${next.slice(overlap)}`,
				delta: next.slice(overlap),
			};
		}
	}
	return { full: `${previous}${next}`, delta: next };
}

function extractDeltaText(payload, contentState) {
	const choice = payload && Array.isArray(payload.choices) ? payload.choices[0] : null;
	const delta = choice && choice.delta ? choice.delta : {};
	if (delta.content !== undefined && delta.content !== null) {
		const text = String(delta.content);
		const merged = mergeStreamingText(contentState.text || '', text);
		contentState.text = merged.full;
		return merged.delta;
	}
	if (delta.reasoning_content !== undefined && delta.reasoning_content !== null) {
		return '';
	}
	if (choice && choice.message && choice.message.content) {
		const text = String(choice.message.content);
		const merged = mergeStreamingText(contentState.text || '', text);
		contentState.text = merged.full;
		return merged.delta;
	}
	return '';
}

function extractReasoningText(payload, reasoningState) {
	const choice = payload && Array.isArray(payload.choices) ? payload.choices[0] : null;
	const delta = choice && choice.delta ? choice.delta : {};
	const message = choice && choice.message ? choice.message : {};
	const candidates = [
		delta.reasoning_content,
		delta.reasoning,
		delta.thinking,
		message.reasoning_content,
		message.reasoning,
		message.thinking,
	];

	for (const value of candidates) {
		if (value === undefined || value === null || value === '') {
			continue;
		}
		const text = String(value);
		const merged = mergeStreamingText(reasoningState.text, text);
		reasoningState.text = merged.full;
		return merged.delta;
	}
	return '';
}

function createNdjsonStreamWriter(res) {
	let closed = false;
	const markClosed = () => { closed = true; };
	if (typeof res.once === 'function') {
		res.once('close', markClosed);
		res.once('finish', markClosed);
		res.once('error', markClosed);
	}

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
	res.setHeader('Cache-Control', 'no-cache, no-transform');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('X-Accel-Buffering', 'no');
	if (typeof res.flushHeaders === 'function') {
		res.flushHeaders();
	}

	return {
		get closed() {
			return closed || res.writableEnded === true || res.destroyed === true;
		},
		write(payload) {
			if (this.closed) return false;
			try {
				res.write(`${JSON.stringify(payload)}\n`);
				if (typeof res.flush === 'function') {
					res.flush();
				}
				return true;
			} catch (error) {
				markClosed();
				return false;
			}
		},
		end() {
			if (this.closed) return;
			try { res.end(); } catch (error) { /* suppress premature close */ }
			markClosed();
		},
	};
}

async function streamCorrectionFromModel(paragraphs, writer) {
	if (!TEXT_CORRECTION_API_KEY) {
		const error = new Error('AI 配置尚未完成');
		error.code = 'UNIFIED_API_KEY_MISSING';
		throw error;
	}

	const messages = [
		{ role: 'system', content: buildCorrectionSystemPrompt() },
		{ role: 'user', content: buildCorrectionUserMessage(paragraphs) },
	];

	const requestBody = {
		model: TEXT_CORRECTION_MODEL,
		messages,
		stream: true,
		temperature: 0.1,
		max_completion_tokens: 16384,
	};

	if (isDeepSeekModel(TEXT_CORRECTION_MODEL)) {
		requestBody.thinking = { type: 'enabled' };
	}

	const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
	const timeoutTimer = setTimeout(() => {
		if (controller) controller.abort();
	}, MODEL_REQUEST_TIMEOUT_MS);
	if (timeoutTimer && typeof timeoutTimer.unref === 'function') {
		timeoutTimer.unref();
	}

	writer.write({ type: 'status', message: '正在连接智能纠错模型...' });

	let response;
	try {
		response = await fetch(`${TEXT_CORRECTION_BASE_URL}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${TEXT_CORRECTION_API_KEY}`,
			},
			body: JSON.stringify(requestBody),
			signal: controller ? controller.signal : undefined,
			timeout: MODEL_REQUEST_TIMEOUT_MS,
		});
	} catch (error) {
		clearTimeout(timeoutTimer);
		if (error && (error.name === 'AbortError' || error.type === 'request-timeout')) {
			throw new Error('模型响应超时，请稍后重试');
		}
		throw error;
	}

	if (!response.ok) {
		let message = `AI 请求失败：${response.status}`;
		try {
			const data = await response.json();
			message = data.error?.message || data.message || message;
		} catch (error) { /* ignore */ }
		clearTimeout(timeoutTimer);
		throw new Error(message);
	}

	writer.write({ type: 'status', message: '模型已连接，正在分析文本...' });

	if (!response.body || typeof response.body.on !== 'function') {
		clearTimeout(timeoutTimer);
		throw new Error('模型未返回流式响应');
	}

	const contentState = { text: '' };
	const reasoningState = { text: '' };
	let hasReasoning = false;
	let hasContent = false;

	try {
		let buffer = '';
		for await (const chunk of response.body) {
			if (writer.closed) break;
			buffer += chunk.toString('utf8');
			let newlineIndex = buffer.indexOf('\n');
			while (newlineIndex !== -1 && !writer.closed) {
				const line = buffer.slice(0, newlineIndex).trim();
				buffer = buffer.slice(newlineIndex + 1);
				newlineIndex = buffer.indexOf('\n');

				if (!line || !line.startsWith('data:')) continue;
				const rawData = line.slice(5).trim();
				if (!rawData || rawData === '[DONE]') continue;

				let payload;
				try { payload = JSON.parse(rawData); } catch (error) { continue; }
				if (payload && payload.error) {
					throw new Error(payload.error.message || payload.error.type || 'AI 请求失败');
				}

				const reasoning = extractReasoningText(payload, reasoningState);
				if (reasoning && !writer.closed) {
					if (!hasReasoning) {
						writer.write({ type: 'status', message: '模型正在深度思考中...' });
					}
					hasReasoning = true;
					writer.write({ type: 'reasoning_delta', content: reasoning });
				}

				const delta = extractDeltaText(payload, contentState);
				if (delta && !writer.closed) {
					if (!hasContent) {
						writer.write({ type: 'status', message: '正在输出纠错结果' });
					}
					hasContent = true;
					writer.write({ type: 'delta', content: delta });
				}
			}
		}
	} catch (error) {
		if (error && (error.name === 'AbortError' || error.type === 'request-timeout')) {
			throw new Error('模型响应超时，请稍后重试');
		}
		if (!writer.closed) {
			throw error;
		}
	} finally {
		clearTimeout(timeoutTimer);
	}

	return contentState.text || '';
}

function processParagraphResults(paragraphs, modelJson) {
	const modelParagraphs = Array.isArray(modelJson?.paragraphs) ? modelJson.paragraphs : [];
	const modelParagraphMap = new Map();
	modelParagraphs.forEach((item, index) => {
		const paragraphIndex = Number(item && item.paragraph_index);
		if (Number.isInteger(paragraphIndex) && paragraphIndex > 0) {
			modelParagraphMap.set(paragraphIndex, item);
			return;
		}
		if (modelParagraphs.length === paragraphs.length) {
			modelParagraphMap.set(index + 1, item);
		}
	});
	const results = [];

	for (let i = 0; i < paragraphs.length; i++) {
		const paragraph = paragraphs[i];
		const modelParagraph = modelParagraphMap.get(paragraph.paragraph_index) || {};
		const rawFragments = Array.isArray(modelParagraph.fragments) ? modelParagraph.fragments : [];
		const hasIssue = rawFragments.length > 0 || Boolean(modelParagraph.has_issue);
		const fragments = [];

		if (hasIssue && rawFragments.length > 0) {
			for (const fragment of rawFragments) {
				const positioned = findFragmentPositionsInText(
					paragraph.text,
					fragment.original_fragment,
					fragment.corrected_fragment
				);
				if (positioned) {
					fragments.push(positioned);
				}
			}
			fragments.sort((a, b) => a.begin_pos - b.begin_pos);
		}

		results.push({
			paragraph_index: paragraph.paragraph_index,
			paragraph_id: paragraph.paragraph_id,
			paragraph_hash: paragraph.paragraph_hash,
			original_text: paragraph.text,
			corrected_text: hasIssue && fragments.length > 0
				? applyFragmentsToText(paragraph.text, fragments)
				: paragraph.text,
			has_issue: hasIssue && fragments.length > 0,
			fragments,
			error: null,
		});
	}

	return results;
}

async function getArticleAccess(userId, articleId) {
	const rows = await query(
		`SELECT
			a.article_id,
			a.novel_id,
			a.article_chapter,
			a.article_type,
			a.deleted AS article_deleted,
			n.author_id,
			n.deleted AS novel_deleted,
			nc.status AS collaborator_status,
			nc.can_edit_article
		FROM articles a
		INNER JOIN novels n ON n.novel_id = a.novel_id
		LEFT JOIN novel_collaborators nc
			ON nc.novel_id = n.novel_id
			AND nc.user_id = ?
		WHERE a.article_id = ?
		LIMIT 1`,
		[userId, articleId]
	);

	const row = rows[0] || null;
	if (!row || Number(row.novel_deleted) === 1) {
		return null;
	}

	const isOwner = Number(row.author_id) === Number(userId);
	const isActiveCollaborator = !isOwner && row.collaborator_status === 'active';
	const canEditArticle = isOwner || (isActiveCollaborator && Number(row.can_edit_article) === 1);
	return {
		article_id: Number(row.article_id),
		novel_id: Number(row.novel_id),
		article_chapter: Number(row.article_chapter || 0),
		article_deleted: Number(row.article_deleted) === 1,
		author_id: Number(row.author_id),
		is_owner: isOwner,
		is_collaborator: isActiveCollaborator,
		can_edit_draft: canEditArticle,
	};
}

async function handleWriterTextCorrection(req, res) {
	try {
		const user = req.user;

		const articleId = Number(req.body?.article_id || 0);
		if (!articleId) {
			return res.status(400).json({ msg: 'article_id 不能为空' });
		}

		const access = await getArticleAccess(user.user_id, articleId);
		if (!access || access.article_deleted || !access.can_edit_draft) {
			return res.status(403).json({ msg: '你没有编辑该章节的权限' });
		}

		const rawParagraphs = req.body?.paragraphs;
		if (!Array.isArray(rawParagraphs) || rawParagraphs.length === 0) {
			return res.status(400).json({ msg: 'paragraphs 不能为空' });
		}

		const paragraphs = normalizeProvidedParagraphs(rawParagraphs);
		if (paragraphs.length === 0) {
			return res.status(400).json({ msg: '没有可检测的正文段落' });
		}

		await consumeRedstone({
			userId: Number(user.user_id),
			amount: 1,
			feature: 'writer_smart_correction',
			requestId: req.body?.request_id || `correction:${articleId}:${Date.now()}`,
			description: '智能纠错消耗1红石',
		});

		res.on('error', () => {});

		const writer = createNdjsonStreamWriter(res);
		const handleDisconnect = () => {};
		if (typeof res.once === 'function') res.once('close', handleDisconnect);
		if (typeof req.once === 'function') req.once('aborted', handleDisconnect);

		try {
			const modelText = await streamCorrectionFromModel(paragraphs, writer);
			if (writer.closed) return;

			const modelJson = parseJsonObjectFromModel(modelText);

			if (!modelJson) {
				if (!writer.closed) {
					writer.write({ type: 'error', message: '模型未返回有效纠错结果' });
				}
				return;
			}

			const paragraphResults = processParagraphResults(paragraphs, modelJson);
			const errors = paragraphResults
				.filter((item) => item.error)
				.map((item) => ({
					paragraph_index: item.paragraph_index,
					paragraph_id: item.paragraph_id,
					paragraph_hash: item.paragraph_hash,
					message: item.error,
				}));
			const corrections = paragraphResults.filter((item) => item.has_issue && !item.error);

			const result = {
				summary: {
					paragraph_count: paragraphs.length,
					batch_count: 1,
					corrected_paragraph_count: corrections.length,
					issue_count: corrections.reduce(
						(total, item) => total + item.fragments.length, 0
					),
					error_count: errors.length,
				},
				paragraph_results: paragraphResults,
				corrections,
				errors,
			};

			if (!writer.closed) {
				writer.write({ type: 'done', result });
			}
		} catch (error) {
			if (!writer.closed) {
				const message = error.message || '';
				if (message.includes('Premature close') || message.includes('premature close')) {
					// Client disconnected, nothing to do
				} else {
					console.log(error);
					writer.write({
						type: 'error',
						message: error.code === 'UNIFIED_API_KEY_MISSING'
							? 'AI 配置尚未完成'
							: message || '智能纠错暂时没有响应，请稍后再试',
					});
				}
			}
		} finally {
			if (!writer.closed) {
				writer.end();
			}
		}
	} catch (error) {
		if (sendBillingError(res, error)) return;
		if (
			error
			&& typeof error.message === 'string'
			&& (error.message.includes('Premature close') || error.message.includes('premature close'))
		) {
			return;
		}
		console.log(error);
		return res.status(500).json({
			msg: error.message || '服务器错误',
		});
	}
}

module.exports = {
	handleWriterTextCorrection,
};
