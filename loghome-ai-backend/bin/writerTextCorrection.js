const fetch = require('node-fetch');
const { StringDecoder } = require('node:string_decoder');
const { runCorrectionPlan } = require('./writerTextCorrectionPipeline');
const { query } = require('../sql.js');
const config = require('../config.js');

const textCorrectionConfig = config.api?.writerAssist?.textCorrection || {};
const TEXT_CORRECTION_BASE_URL = String(textCorrectionConfig.baseUrl || '').replace(/\/+$/, '');
const TEXT_CORRECTION_API_KEY = textCorrectionConfig.apiKey || '';
const TEXT_CORRECTION_MODEL = textCorrectionConfig.model || 'qwen3.6-chat';
const { consumeRedstone, sendBillingError } = require('./redstoneBilling');
function numericSetting(value, fallback, minimum, maximum) {
	const number = Number(value);
	return Number.isFinite(number) && number > 0
		? Math.min(maximum, Math.max(minimum, Math.floor(number)))
		: fallback;
}
const MODEL_REQUEST_TIMEOUT_MS = numericSetting(
	process.env.WRITER_TEXT_CORRECTION_REQUEST_TIMEOUT_MS || config.writerTextCorrectionRequestTimeoutMs,
	120000, 15000, 600000
);
const MODEL_MAX_TOKENS = numericSetting(process.env.WRITER_TEXT_CORRECTION_MAX_TOKENS, 4096, 1024, 16384);
const BATCH_CHARS = numericSetting(process.env.WRITER_TEXT_CORRECTION_BATCH_CHARS, 2800, 1400, 12000);
const BATCH_PARAGRAPHS = numericSetting(process.env.WRITER_TEXT_CORRECTION_BATCH_PARAGRAPHS, 12, 1, 32);
const CONCURRENCY = numericSetting(process.env.WRITER_TEXT_CORRECTION_CONCURRENCY, 2, 1, 4);
const HEARTBEAT_MS = numericSetting(process.env.WRITER_TEXT_CORRECTION_HEARTBEAT_MS, 10000, 1000, 30000);
const MODEL_THINKING_ENABLED = String(process.env.WRITER_TEXT_CORRECTION_ENABLE_THINKING || 'false').toLowerCase() === 'true';

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
			text,
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
9. 最后回答时返回的 JSON 必须是一个对象，包含 paragraphs 数组；数组里只放需要修改的段落。

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

async function streamCorrectionFromModel(paragraphs, writer, { signal, batchIndex, batchCount } = {}) {
	if (!TEXT_CORRECTION_API_KEY) {
		const error = new Error('AI 配置尚未完成');
		error.code = 'UNIFIED_API_KEY_MISSING';
		error.retryable = false;
		throw error;
	}
	const requestBody = {
		model: TEXT_CORRECTION_MODEL,
		messages: [
			{ role: 'system', content: buildCorrectionSystemPrompt() },
			{ role: 'user', content: buildCorrectionUserMessage(paragraphs) },
		],
		stream: true,
		temperature: 0.1,
	};
	if (isDeepSeekModel(TEXT_CORRECTION_MODEL) || /^qwen/i.test(TEXT_CORRECTION_MODEL)) {
		requestBody.max_tokens = MODEL_MAX_TOKENS;
	} else {
		requestBody.max_completion_tokens = MODEL_MAX_TOKENS;
	}
	if (isDeepSeekModel(TEXT_CORRECTION_MODEL)) {
		requestBody.thinking = { type: MODEL_THINKING_ENABLED ? 'enabled' : 'disabled' };
	} else if (/^qwen/i.test(TEXT_CORRECTION_MODEL)) {
		requestBody.enable_thinking = MODEL_THINKING_ENABLED;
	}

	const controller = new AbortController();
	const abortOnDisconnect = () => controller.abort();
	if (signal) {
		signal.addEventListener('abort', abortOnDisconnect, { once: true });
		if (signal.aborted) controller.abort();
	}
	let timedOut = false;
	const timeoutTimer = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, MODEL_REQUEST_TIMEOUT_MS);
	timeoutTimer.unref?.();
	const contentState = { text: '' };
	const reasoningState = { text: '' };
	const startedAt = Date.now();
	let outcome = 'success';
	const emit = payload => writer.write({ ...payload, batch_index: batchIndex, batch_count: batchCount });
	let response;

	try {
		if (controller.signal.aborted || writer.closed) throw new Error('纠错请求已取消');
		emit({ type: 'status', message: '正在检查第 ' + batchIndex + '/' + batchCount + ' 批正文...' });
		response = await fetch(TEXT_CORRECTION_BASE_URL + '/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + TEXT_CORRECTION_API_KEY,
			},
			body: JSON.stringify(requestBody),
			signal: controller.signal,
			timeout: MODEL_REQUEST_TIMEOUT_MS,
		});
		if (!response.ok) {
			let message = 'AI 请求失败：' + response.status;
			try {
				const data = await response.json();
				message = data.error?.message || data.message || message;
			} catch (error) { /* ignore malformed error body */ }
			const error = new Error(message);
			error.code = 'MODEL_HTTP_ERROR';
			error.retryable = response.status === 408 || response.status === 429 || response.status >= 500;
			throw error;
		}
		if (!response.body || typeof response.body.on !== 'function') {
			throw new Error('模型未返回流式响应');
		}

		let streamEnded = false;
		const processLine = line => {
			if (!line.trim().startsWith('data:')) return;
			const raw = line.trim().slice(5).trim();
			if (!raw) return;
			if (raw === '[DONE]') { streamEnded = true; return; }
			let payload;
			try { payload = JSON.parse(raw); } catch (error) { return; }
			if (payload.error) throw new Error(payload.error.message || payload.error.type || 'AI 请求失败');
			const choice = payload.choices?.[0];
			if (!choice) return;
			// 标准 delta 是增量，不做重叠去重，否则连续相同字符会丢失。
			const reasoning = choice.delta?.reasoning_content ?? choice.delta?.reasoning ?? choice.delta?.thinking;
			if (reasoning) {
				reasoningState.text += String(reasoning);
				emit({ type: 'reasoning_delta', content: String(reasoning) });
			}
			const delta = choice.delta?.content;
			if (delta !== undefined && delta !== null) {
				contentState.text += String(delta);
				emit({ type: 'delta', content: String(delta) });
			} else if (choice.message?.content) {
				const merged = mergeStreamingText(contentState.text, String(choice.message.content));
				contentState.text = merged.full;
				if (merged.delta) emit({ type: 'delta', content: merged.delta });
			}
			if (choice.finish_reason === 'length') {
				const error = new Error('模型输出达到长度限制，正在缩小检查范围');
				error.code = 'MODEL_OUTPUT_LIMIT';
				throw error;
			}
			if (choice.finish_reason && choice.finish_reason !== 'stop') {
				throw new Error('模型未完成本批次检查：' + choice.finish_reason);
			}
			if (choice.finish_reason === 'stop') streamEnded = true;
		};
		const decoder = new StringDecoder('utf8');
		let buffer = '';
		for await (const chunk of response.body) {
			if (writer.closed || controller.signal.aborted) throw new Error('纠错请求已取消');
			buffer += decoder.write(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
			let newline;
			while ((newline = buffer.indexOf('\n')) !== -1) {
				const line = buffer.slice(0, newline);
				buffer = buffer.slice(newline + 1);
				processLine(line);
				if (streamEnded) break;
			}
			if (streamEnded) break;
		}
		if (!streamEnded) {
			buffer += decoder.end();
			if (buffer.trim()) processLine(buffer);
		}
		if (controller.signal.aborted) throw new Error('纠错请求已取消');
		const modelJson = parseJsonObjectFromModel(contentState.text);
		if (!modelJson || !Array.isArray(modelJson.paragraphs)) {
			const error = new Error('模型未返回有效纠错结果');
			error.code = 'MODEL_INVALID_JSON';
			throw error;
		}
		const indices = new Set(paragraphs.map(item => item.paragraph_index));
		if (modelJson.paragraphs.some(item =>
			!indices.has(Number(item?.paragraph_index)) || !Array.isArray(item?.fragments)
		)) {
			throw new Error('模型返回的段落编号或纠错片段不完整');
		}
		return processParagraphResults(paragraphs, modelJson);
	} catch (error) {
		outcome = timedOut ? 'MODEL_TIMEOUT' : (error.code || error.name || 'MODEL_ERROR');
		if (timedOut || error.type === 'request-timeout' || error.type === 'body-timeout') {
			const timeoutError = new Error('本批正文检查超时，请重试未完成的内容');
			timeoutError.code = 'MODEL_TIMEOUT';
			throw timeoutError;
		}
		throw error;
	} finally {
		clearTimeout(timeoutTimer);
		if (signal) signal.removeEventListener('abort', abortOnDisconnect);
		if (controller.signal.aborted) response?.body?.destroy?.();
		console.info('[writer-text-correction] batch', {
			batch: batchIndex, paragraphs: paragraphs.length,
			chars: paragraphs.reduce((total, item) => total + item.text.length, 0),
			elapsed_ms: Date.now() - startedAt,
			outcome,
		});
	}
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

		if (!TEXT_CORRECTION_API_KEY) {
			return res.status(503).json({ msg: 'AI 配置尚未完成' });
		}

		await consumeRedstone({
			userId: Number(user.user_id),
			amount: 2,
			freeForMembers: true,
			feature: 'writer_smart_correction',
			requestId: req.body?.request_id || `correction:${articleId}:${Date.now()}`,
			description: '智能纠错消耗2红石',
		});

		const writer = createNdjsonStreamWriter(res);
		const controller = new AbortController();
		const handleDisconnect = () => controller.abort();
		res.once?.('close', handleDisconnect);
		req.once?.('aborted', handleDisconnect);
		const heartbeat = setInterval(() => {
			if (writer.closed) controller.abort();
			else writer.write({ type: 'heartbeat' });
		}, HEARTBEAT_MS);
		heartbeat.unref?.();
		try {
			writer.write({ type: 'meta', batched: true, total: paragraphs.length });
			const result = await runCorrectionPlan(paragraphs, {
				batchChars: BATCH_CHARS,
				batchParagraphs: BATCH_PARAGRAPHS,
				concurrency: CONCURRENCY,
				retries: 1,
				shouldStop: () => writer.closed || controller.signal.aborted,
				analyzeBatch: (batch, context) => streamCorrectionFromModel(batch, writer, {
					...context, signal: controller.signal,
				}),
				onParagraphResult: result => writer.write({ type: 'paragraph_result', result }),
				onProgress: progress => writer.write({ type: 'progress', ...progress }),
			});
			if (!writer.closed) writer.write({ type: 'done', result });
		} catch (error) {
			if (!writer.closed) {
				console.warn('[writer-text-correction] failed', { article_id: articleId, code: error.code || error.name });
				writer.write({ type: 'error', message: error.message || '智能纠错暂时没有响应，请稍后再试' });
			}
		} finally {
			clearInterval(heartbeat);
			controller.abort();
			res.removeListener?.('close', handleDisconnect);
			req.removeListener?.('aborted', handleDisconnect);
			if (!writer.closed) writer.end();
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
