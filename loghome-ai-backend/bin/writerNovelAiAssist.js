const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
// node-fetch@2 在 Node 24 中会将已收到 [DONE] 的 chunked SSE 响应误判为
// ERR_STREAM_PREMATURE_CLOSE。模型流优先使用 Node 内置 fetch。
const streamingFetch = typeof globalThis.fetch === 'function'
	? globalThis.fetch.bind(globalThis)
	: fetch;
const { query } = require('../sql.js');
const { consumeRedstone, sendBillingError } = require('./redstoneBilling');
const config = require('../config.js');
const {
	getNovelInfo,
} = require('../utils/libraryHelper.js');
const {
	initMemoryTable,
	getNovelPreferredShortSummaries,
} = require('../utils/memoryManager.js');

const writerAssistFastApi = config.api?.writerAssist?.fast || {};
const writerAssistDeepApi = config.api?.writerAssist?.deep || {};
const writerAssistSmartReplaceApi = config.api?.writerAssist?.smartReplace || {};
const WRITER_ASSIST_FAST_BASE_URL = String(writerAssistFastApi.baseUrl || '').replace(/\/+$/, '');
const WRITER_ASSIST_FAST_API_KEY = writerAssistFastApi.apiKey || '';
const WRITER_ASSIST_FAST_MODEL = writerAssistFastApi.model || 'qwen3.6-chat';
const WRITER_ASSIST_DEEP_BASE_URL = String(writerAssistDeepApi.baseUrl || '').replace(/\/+$/, '');
const WRITER_ASSIST_DEEP_API_KEY = writerAssistDeepApi.apiKey || '';
const WRITER_ASSIST_DEEP_MODEL = writerAssistDeepApi.model || 'deepseek-v4-flash';
const WRITER_ASSIST_SMART_REPLACE_BASE_URL = String(writerAssistSmartReplaceApi.baseUrl || '').replace(/\/+$/, '');
const WRITER_ASSIST_SMART_REPLACE_API_KEY = writerAssistSmartReplaceApi.apiKey || '';
const WRITER_ASSIST_SMART_REPLACE_MODEL = writerAssistSmartReplaceApi.model
	|| WRITER_ASSIST_FAST_MODEL
	|| 'qwen3.6-chat';
const MINIMAX_IMAGE_BASE_URL = normalizeMiniMaxApiBaseUrl(
	process.env.MINIMAX_IMAGE_BASE_URL
		|| process.env.MINIMAX_BASE_URL
		|| 'https://api.minimaxi.com/v1'
);
const MINIMAX_IMAGE_API_KEY = process.env.MINIMAX_API_KEY
	|| WRITER_ASSIST_FAST_API_KEY
	|| '';
const MAX_COMPLETION_TOKENS = Math.max(512, Number(
	config.writerAssistMaxCompletionTokens
		|| process.env.WRITER_ASSIST_MAX_COMPLETION_TOKENS
		|| 2400
));
const MODEL_REQUEST_TIMEOUT_MS = Math.max(15000, Number(
	config.writerAssistRequestTimeoutMs
		|| process.env.WRITER_ASSIST_REQUEST_TIMEOUT_MS
		|| 120000
));
const MODEL_HEARTBEAT_INTERVAL_MS = 10000;
const IMAGE_GENERATION_TIMEOUT_MS = Math.max(30000, Number(
	config.writerAssistImageGenerationTimeoutMs
		|| process.env.WRITER_ASSIST_IMAGE_GENERATION_TIMEOUT_MS
		|| 180000
));
const IMAGE_UPLOAD_TIMEOUT_MS = Math.max(10000, Number(
	config.writerAssistImageUploadTimeoutMs
		|| process.env.WRITER_ASSIST_IMAGE_UPLOAD_TIMEOUT_MS
		|| 60000
));
const IMAGE_UPLOAD_BASE64_URL = String(
	config.imageBase64UploadUrl
		|| process.env.LOGHOME_IMAGE_BASE64_UPLOAD_URL
		|| 'https://img.codesocean.top/upload/imgbase64'
).trim();
const IMAGE_UPLOAD_API_KEY = String(
	config.imageUploadApiKey
		|| process.env.LOGHOME_IMAGE_UPLOAD_API_KEY
		|| '45qEQfILCQ3tAXxmUJF8O562bJU2D0'
).trim();
const IMAGE_GENERATION_TOOL_MAX_ROUNDS = 3;
const IMAGE_GENERATION_ASPECT_RATIOS = new Set([
	'1:1',
	'16:9',
	'4:3',
	'3:2',
	'2:3',
	'3:4',
	'9:16',
	'21:9',
]);

const MAX_FULL_TEXT_CHARS = 18000;
const MAX_SELECTION_CHARS = 8000;
const MAX_CURSOR_CONTEXT_CHARS = 2600;
const MAX_MEMORY_CONTEXT_CHARS = 120000;
const MAX_PROMPT_CHARS = 1200;
const MAX_SMART_REPLACE_FULL_TEXT_CHARS = 80000;
const MAX_SMART_REPLACE_PARAGRAPHS = 240;
const MAX_SMART_REPLACE_REPLACEMENT_CHARS = 12000;
const PROMPT_LOG_DIR = path.join(__dirname, '..', 'logs');
const PROMPT_LOG_FILE_PREFIX = 'writer-novel-ai-assist-prompts';
const TASK_TTL_MS = 30 * 60 * 1000;
const TASK_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const writerAssistTaskStore = new Map();
let memoryTableReadyPromise = null;
let taskCleanupTimer = null;

function padDatePart(value) {
	return String(value).padStart(2, '0');
}

function formatLocalDateKey(date = new Date()) {
	return [
		date.getFullYear(),
		padDatePart(date.getMonth() + 1),
		padDatePart(date.getDate()),
	].join('-');
}

function formatLocalDateTime(date = new Date()) {
	return [
		formatLocalDateKey(date),
		[
			padDatePart(date.getHours()),
			padDatePart(date.getMinutes()),
			padDatePart(date.getSeconds()),
		].join(':'),
	].join(' ');
}

async function saveWriterPromptLog(entry) {
	const now = new Date();
	const filePath = path.join(
		PROMPT_LOG_DIR,
		`${PROMPT_LOG_FILE_PREFIX}-${formatLocalDateKey(now)}.jsonl`
	);
	const payload = {
		at: now.toISOString(),
		local_time: formatLocalDateTime(now),
		module: 'writerNovelAiAssist',
		model: entry.model || WRITER_ASSIST_DEEP_MODEL,
		...entry,
	};
	await fs.promises.mkdir(PROMPT_LOG_DIR, { recursive: true });
	await fs.promises.appendFile(filePath, `${JSON.stringify(payload)}\n`, 'utf8');
	return filePath;
}

function normalizeTaskId(rawTaskId, fallbackParts = []) {
	const rawValue = String(rawTaskId || '').trim();
	if (rawValue) {
		return rawValue.slice(0, 180);
	}
	return fallbackParts
		.map((item) => String(item || '').trim())
		.filter(Boolean)
		.join(':')
		.slice(0, 180);
}

function normalizeEventCursor(value) {
	const numericValue = Number(value);
	return Number.isFinite(numericValue) && numericValue > 0 ? Math.floor(numericValue) : 0;
}

function normalizeTaskMessageId(value) {
	const rawValue = String(value || '').trim();
	return rawValue || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ensureTaskCleanupTimer() {
	if (taskCleanupTimer) {
		return;
	}

	taskCleanupTimer = setInterval(() => {
		const now = Date.now();
		for (const [taskId, task] of writerAssistTaskStore.entries()) {
			const expired = now - Number(task.updatedAt || task.createdAt || now) > TASK_TTL_MS;
			const finished = task.status === 'completed' || task.status === 'error';
			if (expired && finished) {
				writerAssistTaskStore.delete(taskId);
			}
		}
	}, TASK_CLEANUP_INTERVAL_MS);

	if (taskCleanupTimer && typeof taskCleanupTimer.unref === 'function') {
		taskCleanupTimer.unref();
	}
}

function createWriterAssistTaskRecord(options) {
	return {
		taskId: options.taskId,
		userId: Number(options.userId || 0),
		articleId: Number(options.articleId || 0),
		novelId: Number(options.novelId || 0),
		sessionId: String(options.sessionId || ''),
		messageId: String(options.messageId || ''),
		thinkingMode: normalizeThinkingMode(options.thinkingMode),
		model: options.model || WRITER_ASSIST_DEEP_MODEL,
		requestBody: options.requestBody || {},
		articleMeta: options.articleMeta || {},
		status: 'running',
		createdAt: Date.now(),
		updatedAt: Date.now(),
		nextEventId: 1,
		events: [],
		subscribers: new Set(),
		started: false,
	};
}

function emitTaskEvent(task, eventType, payload = {}) {
	const event = {
		type: String(eventType || ''),
		task_id: task.taskId,
		session_id: task.sessionId,
		message_id: task.messageId,
		article_id: task.articleId,
		event_id: task.nextEventId,
		...payload,
	};
	task.nextEventId += 1;
	task.updatedAt = Date.now();
	task.events.push(event);

	for (const subscriber of [...task.subscribers]) {
		const success = subscriber.write(event);
		if (!success) {
			task.subscribers.delete(subscriber);
		}
	}

	return event;
}

function createTaskEventWriter(task) {
	return {
		get closed() {
			return task.status !== 'running';
		},
		write(payload) {
			if (this.closed || !payload || typeof payload !== 'object') {
				return false;
			}
			const eventType = payload.type || 'message';
			const eventPayload = { ...payload };
			delete eventPayload.type;
			emitTaskEvent(task, eventType, eventPayload);
			return true;
		},
		end() {},
	};
}

function finishTask(task, status) {
	task.status = status === 'error' ? 'error' : 'completed';
	task.updatedAt = Date.now();
	setTimeout(() => {
		for (const subscriber of [...task.subscribers]) {
			try {
				subscriber.end();
			} finally {
				task.subscribers.delete(subscriber);
			}
		}
	}, 0);
}

function replayTaskEvents(events, resumeFromEventId, writer) {
	const cursor = normalizeEventCursor(resumeFromEventId);
	for (const event of Array.isArray(events) ? events : []) {
		if (Number(event.event_id || 0) <= cursor) {
			continue;
		}
		if (!writer.write(event)) {
			return false;
		}
	}
	return true;
}

function subscribeTask(task, writer) {
	const subscriber = {
		ready: false,
		buffer: [],
		write(event) {
			if (!this.ready) {
				this.buffer.push(event);
				return true;
			}
			return writer.write(event);
		},
		flushBufferedEvents(afterEventId = 0) {
			const pendingEvents = this.buffer.filter((event) => {
				return Number(event.event_id || 0) > Number(afterEventId || 0);
			});
			this.buffer = [];
			for (const event of pendingEvents) {
				if (!writer.write(event)) {
					return false;
				}
			}
			this.ready = true;
			return true;
		},
		end() {
			writer.end();
		},
	};
	task.subscribers.add(subscriber);
	return {
		subscriber,
		unsubscribe() {
			task.subscribers.delete(subscriber);
		},
	};
}

function isDeepSeekModel(model) {
	const normalized = String(model || '').trim().toLowerCase();
	return normalized.startsWith('deepseek-');
}

function supportsReasoningSplit(model) {
	const normalized = String(model || '').trim().toLowerCase();
	if (!normalized) {
		return false;
	}
	return !normalized.startsWith('deepseek-');
}

function normalizeThinkingMode(value) {
	const normalized = String(value || '').trim().toLowerCase();
	return normalized === 'deep' ? 'deep' : 'fast';
}

function resolveWriterAssistModel(thinkingMode) {
	return normalizeThinkingMode(thinkingMode) === 'deep'
		? WRITER_ASSIST_DEEP_MODEL
		: WRITER_ASSIST_FAST_MODEL;
}

function resolveWriterAssistApiConfig(model) {
	if (model === WRITER_ASSIST_DEEP_MODEL) {
		return { baseUrl: WRITER_ASSIST_DEEP_BASE_URL, apiKey: WRITER_ASSIST_DEEP_API_KEY };
	}
	return { baseUrl: WRITER_ASSIST_FAST_BASE_URL, apiKey: WRITER_ASSIST_FAST_API_KEY };
}

function normalizeMiniMaxApiBaseUrl(value) {
	const source = String(value || '').trim() || 'https://api.minimaxi.com/v1';
	const trimmed = source.replace(/\/+$/, '');
	if (/\/v\d+$/i.test(trimmed)) {
		return trimmed;
	}
	return `${trimmed}/v1`;
}

function normalizeOpenAiToolDefinitions(tools) {
	return (Array.isArray(tools) ? tools : [])
		.map((tool) => {
			const definition = tool && tool.function ? tool.function : tool;
			if (!definition || !definition.name) {
				return null;
			}
			return {
				type: 'function',
				function: {
					name: String(definition.name),
					description: String(definition.description || ''),
					parameters: definition.parameters && typeof definition.parameters === 'object'
						? definition.parameters
						: { type: 'object', properties: {} },
				},
			};
		})
		.filter(Boolean);
}

function buildWriterModelRequest(messages, model, options = {}) {
	const selectedModel = model || WRITER_ASSIST_DEEP_MODEL;
	const request = {
		model: selectedModel,
		messages,
		stream: true,
		max_completion_tokens: MAX_COMPLETION_TOKENS,
	};
	// DeepSeek models: control thinking via `thinking` parameter
	if (isDeepSeekModel(selectedModel)) {
		if (options.thinkingMode === 'deep') {
			request.thinking = { type: 'enabled' };
		} else {
			request.thinking = { type: 'disabled' };
		}
	} else {
		// Non-DeepSeek models: use temperature and reasoning_split
		request.temperature = 0.7;
		if (options.thinkingMode === 'deep' && supportsReasoningSplit(selectedModel)) {
			request.reasoning_split = true;
		}
	}
	const tools = normalizeOpenAiToolDefinitions(options.tools);
	if (tools.length > 0) {
		request.tools = tools;
	}
	return request;
}

function normalizeWriterAssistFeatures(features) {
	const source = features && typeof features === 'object' ? features : {};
	return {
		image_generation: source.image_generation === true || source.imageGeneration === true,
		image_style: truncateText(
			source.image_generation_style
				|| source.imageGenerationStyle
				|| source.image_style
				|| source.imageStyle
				|| '',
			80
		),
		image_aspect_ratio: normalizeImageAspectRatio(
			source.image_generation_aspect_ratio
				|| source.imageGenerationAspectRatio
				|| source.image_aspect_ratio
				|| source.imageAspectRatio
				|| source.aspect_ratio
				|| source.aspectRatio
				|| '1:1'
		),
	};
}

function getWriterAssistImageTools(enabled) {
	if (!enabled) {
		return [];
	}
	return [
		{
			type: 'function',
			function: {
				name: 'generate_image',
				description: '根据作者需求生成一张或多张小说插图、角色图、场景图或封面草图，并返回已转存到原木图片服务器的图片 URL。',
				parameters: {
					type: 'object',
					properties: {
						prompt: {
							type: 'string',
							description: '用于图片生成的详细中文提示词，包含主体、构图、画风、氛围、关键视觉元素。最长 1500 字符。',
						},
						aspect_ratio: {
							type: 'string',
							enum: ['1:1', '16:9', '4:3', '3:2', '2:3', '3:4', '9:16', '21:9'],
							description: '图片宽高比。未指定时使用 1:1。',
						},
						n: {
							type: 'integer',
							minimum: 1,
							maximum: 9,
							description: '生成图片数量，默认 1。',
						},
						prompt_optimizer: {
							type: 'boolean',
							description: '是否开启 MiniMax prompt 自动优化，默认开启。',
						},
					},
					required: ['prompt'],
					additionalProperties: false,
				},
			},
		},
	];
}

function getWriterImageGenerationInstruction(rawFeatures) {
	const features = typeof rawFeatures === 'object'
		? normalizeWriterAssistFeatures(rawFeatures)
		: {
			image_generation: rawFeatures === true,
			image_style: '',
			image_aspect_ratio: '1:1',
		};
	if (!features.image_generation) {
		return '';
	}
	const selectedStyle = features.image_style
		? `- 作者在发送区选择的图片风格：${features.image_style}。调用 generate_image 时，请在 prompt 中体现这个风格，除非作者本轮另有明确风格要求。`
		: '- 作者没有在发送区选择固定图片风格；请根据当前章节内容选择最适合的视觉风格。';
	const selectedAspectRatio = features.image_aspect_ratio || '1:1';
	return [
		'作者已在功能区启用“图片生成”：',
		'- 这表示作者希望本轮回复可以生成图片；通常应调用 generate_image 工具。如果用户提供了一个段落，这应该意味着用户想要生成和段落有关的图片。',
		'- 如果作者明确要求生成插图、角色图、场景图、封面草图或其他图片，请按作者要求调用 generate_image 工具。',
		selectedStyle,
		`- 作者在发送区选择的图片比例：${selectedAspectRatio}。调用 generate_image 时，默认使用这个 aspect_ratio，除非作者本轮另有明确比例要求。`,
		'- 如果作者没有给出额外的图片指示或数量，请根据当前章节、光标上下文和对话需求，自主生成 1 张最合适的小说配图，n 使用 1。',
		'- 调用工具时，把当前章节和作者要求转写成具体画面 prompt，避免生成文字排版、长段文字或真实人物肖像。',
		'- 工具返回的图片已上传到原木图片服务器；不要编造图片链接。'
	].join('\n');
}

function normalizePermissionFlag(value) {
	return Number(value) === 1;
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
	const canEditArticle = isOwner || (isActiveCollaborator && normalizePermissionFlag(row.can_edit_article));
	return {
		article_id: Number(row.article_id),
		novel_id: Number(row.novel_id),
		article_chapter: Number(row.article_chapter || 0),
		article_type: row.article_type || '',
		article_deleted: Number(row.article_deleted) === 1,
		author_id: Number(row.author_id),
		is_owner: isOwner,
		is_collaborator: isActiveCollaborator,
		can_edit_draft: canEditArticle,
	};
}

function truncateText(text, maxLength) {
	const source = String(text || '').trim();
	if (!source || source.length <= maxLength) {
		return source;
	}
	if (maxLength <= 3) {
		return source.slice(0, maxLength);
	}
	return `${source.slice(0, maxLength - 3)}...`;
}

function normalizeSegmentText(text) {
	return String(text || '').replace(/\r/g, '').trim();
}

function collectTextFragments(node, fragments = [], depth = 0) {
	if (depth > 8 || node === null || node === undefined) {
		return fragments;
	}
	if (typeof node === 'string') {
		const text = normalizeSegmentText(node);
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
		node.forEach((item) => collectTextFragments(item, fragments, depth + 1));
		return fragments;
	}
	if (typeof node === 'object') {
		Object.values(node).forEach((value) => collectTextFragments(value, fragments, depth + 1));
	}
	return fragments;
}

function legacyContentToPlainText(content) {
	if (content === null || content === undefined) {
		return '';
	}
	if (typeof content !== 'string') {
		return collectTextFragments(content).join('\n').trim();
	}

	const source = content.trim();
	if (!source) {
		return '';
	}

	try {
		const parsed = JSON.parse(source);
		if (Array.isArray(parsed)) {
			return parsed
				.map((block) => {
					if (!block) {
						return '';
					}
					if (block.type === 'image') {
						return '[图片]';
					}
					return normalizeSegmentText(block.value || block.text || block.desc || '');
				})
				.filter(Boolean)
				.join('\n');
		}
		return collectTextFragments(parsed).join('\n').trim();
	} catch (error) {
		return source;
	}
}

function getWriterChatInstruction() {
	return [
		'任务：与作者进行多轮问答。请根据作者问题、当前草稿、选中文本、光标上下文和全书短摘要提供帮助。',
		'要求：如果你给出可直接插入/替换到正文的最终完成段落，**必须**只把这些正文段落包裹在 <draft></draft> 中；标签外可以给说明或建议。',
	].join('\n');
}

function normalizeConversationMessages(messages) {
	if (!Array.isArray(messages)) {
		return [];
	}
	return messages
		.map((message) => {
			if (!message || typeof message !== 'object') {
				return null;
			}
			const role = message.role === 'assistant' ? 'assistant' : 'user';
			const content = truncateText(message.content || '', 3000);
			if (!content) {
				return null;
			}
			return { role, content };
		})
		.filter(Boolean)
		.slice(-12);
}

function formatConversationMessages(messages) {
	const normalized = normalizeConversationMessages(messages);
	if (normalized.length === 0) {
		return '暂无历史对话';
	}
	return normalized
		.map((message, index) => {
			const roleLabel = message.role === 'assistant' ? '助手' : '作者';
			return `${index + 1}. ${roleLabel}：${message.content}`;
		})
		.join('\n');
}

async function getArticleMeta(articleId) {
	const rows = await query(
		`SELECT
			a.article_id,
			a.novel_id,
			a.article_chapter,
			a.title,
			a.content,
			a.update_time
		FROM articles a
		WHERE a.article_id = ?
		LIMIT 1`,
		[articleId]
	);
	return rows[0] || null;
}

function formatElapsedMs(startedAt) {
	const elapsedMs = Date.now() - startedAt;
	if (elapsedMs < 1000) {
		return `${elapsedMs}ms`;
	}
	return `${(elapsedMs / 1000).toFixed(1)}s`;
}

function notifyContextProgress(onProgress, stage, message, extra = {}) {
	if (typeof onProgress !== 'function') {
		return;
	}
	onProgress(stage, message, extra);
}

async function runContextStep(onProgress, stage, message, task) {
	const startedAt = Date.now();
	notifyContextProgress(onProgress, stage, message, {
		started_at: startedAt,
	});

	const heartbeatTimer = setInterval(() => {
		notifyContextProgress(onProgress, `${stage}_waiting`, `${message}，已等待 ${formatElapsedMs(startedAt)}`, {
			elapsed_ms: Date.now() - startedAt,
		});
	}, 5000);
	if (heartbeatTimer && typeof heartbeatTimer.unref === 'function') {
		heartbeatTimer.unref();
	}

	try {
		const result = await task();
		notifyContextProgress(onProgress, `${stage}_done`, `${message}完成（${formatElapsedMs(startedAt)}）`, {
			duration_ms: Date.now() - startedAt,
		});
		return result;
	} finally {
		clearInterval(heartbeatTimer);
	}
}

function ensureMemoryTableReady() {
	if (!memoryTableReadyPromise) {
		memoryTableReadyPromise = initMemoryTable().catch((error) => {
			memoryTableReadyPromise = null;
			throw error;
		});
	}
	return memoryTableReadyPromise;
}

function formatCurrentEditingChapterLine(articleChapter, title) {
	const chapterLabel = articleChapter || '?';
	const titleLabel = title || '未命名';
	return `- 正在编辑的章节｜第${chapterLabel}章《${titleLabel}》`;
}

async function buildMemoryContext(novelId, articleChapter, options = {}) {
	const onProgress = options && typeof options.onProgress === 'function'
		? options.onProgress
		: null;
	try {
		await runContextStep(
			onProgress,
			'memory_schema',
			'正在确认章节摘要缓存表结构',
			() => ensureMemoryTableReady()
		);
		const summaries = await runContextStep(
			onProgress,
			'memory_query',
			'正在读取全书作者草稿和正式版短摘要',
			() => getNovelPreferredShortSummaries(novelId)
		);
		const currentArticleId = Number(options.currentArticleId || 0);
		const currentChapter = Number(articleChapter || 0);
		const currentTitle = String(options.currentChapterTitle || '').trim();
		const lines = [];
		let currentChapterInserted = false;
		const sourceSummaries = Array.isArray(summaries) ? summaries : [];
		sourceSummaries.forEach((item) => {
			const itemArticleId = Number(item.article_id || 0);
			const itemChapter = Number(item.chapter || item.article_chapter || 0);
			const isCurrentChapter = (
				(currentArticleId && itemArticleId === currentArticleId)
				|| (currentChapter && itemChapter === currentChapter)
			);
			if (isCurrentChapter) {
				if (!currentChapterInserted) {
					lines.push(formatCurrentEditingChapterLine(
						currentChapter || itemChapter,
						currentTitle || item.title || ''
					));
					currentChapterInserted = true;
				}
				return;
			}
			if (currentChapter && !currentChapterInserted && itemChapter > currentChapter) {
				lines.push(formatCurrentEditingChapterLine(currentChapter, currentTitle));
				currentChapterInserted = true;
			}
			const scopeLabel = item.summary_scope === 'author'
				? '作者稿'
				: item.summary_scope === 'reader'
					? '正式版'
					: '摘要';
			const summary = item.short_summary || '';
			lines.push(`- ${scopeLabel}｜第${item.chapter || item.article_chapter || '?'}章《${item.title || '未命名'}》：${truncateText(summary, 700)}`);
		});
		if (currentChapter && !currentChapterInserted) {
			lines.push(formatCurrentEditingChapterLine(currentChapter, currentTitle));
			currentChapterInserted = true;
		}
		notifyContextProgress(
			onProgress,
			'memory_filter_done',
			`已按章节顺序封装全书短摘要：${lines.length} 条，当前章节已替换为正在编辑的章节`,
			{
				selected_count: lines.length,
				total_count: sourceSummaries.length,
				current_chapter: currentChapter,
				current_article_id: currentArticleId,
				current_chapter_inserted: currentChapterInserted,
			}
		);
		return truncateText(lines.join('\n'), MAX_MEMORY_CONTEXT_CHARS);
	} catch (error) {
		console.log(error);
		notifyContextProgress(onProgress, 'memory_failed', '全书章节短摘要读取失败，将只使用当前草稿上下文', {
			error: error && error.message ? error.message : String(error || ''),
		});
		return '';
	}
}

function buildWriterMessages(options) {
	const article = options.article || {};
	const currentChapter = options.currentChapter || {};
	const selection = options.selection || {};
	const cursorContext = options.cursorContext || {};
	const novel = options.novel || {};
	const memoryContext = options.memoryContext || '';
	const features = normalizeWriterAssistFeatures(options.features);
	const prompt = truncateText(options.prompt || '', MAX_PROMPT_CHARS);
	const conversationText = formatConversationMessages(options.messages);
	const plainText = truncateText(
		currentChapter.plain_text || legacyContentToPlainText(currentChapter.content || article.content || ''),
		MAX_FULL_TEXT_CHARS
	);
	const selectedText = truncateText(selection.text || '', MAX_SELECTION_CHARS);
	const cursorPosition = Number.isFinite(Number(selection.from))
		? Number(selection.from)
		: null;
	const beforeText = truncateText(cursorContext.before || '', MAX_CURSOR_CONTEXT_CHARS);
	const afterText = truncateText(cursorContext.after || '', MAX_CURSOR_CONTEXT_CHARS);

	return [
		{
			role: 'system',
			content: `你是一位顶级的长篇小说作家，拥有高超的写作技巧和丰富的经验。现在摆在你面前的是一本小说作品和原作者的需求，你的目标是帮助这本小说的作者推进、润色和检查作品。

基本原则：
- 充分尊重原作者的情节、人物设定，我们的目标是成为原作者的分身。
- 生成正文时可以基于当前上下文合理延展，但要贴合已有角色、设定和语气。
- 对正文生成/修改/续写任务，必须把最终可应用的正文段落包裹在 <draft></draft> 中，标签内不要写解释。
- 对建议和问答任务，输出简明、有操作性的中文建议。
${getWriterImageGenerationInstruction(features)}`,
		},
		{
			role: 'user',
			content: [
				getWriterChatInstruction(),
				'',
				'作品信息：',
				`作品ID：${novel.novel_id || article.novel_id || currentChapter.novel_id || '未知'}`,
				`作品名：${novel.name || '未知'}`,
				`作者：${novel.author || '未知'}`,
				`简介：${truncateText(novel.description || '无', 500)}`,
				`标签：${Array.isArray(novel.tags) && novel.tags.length ? novel.tags.join('、') : '无'}`,
				'',
				'当前章节：',
				`章节ID：${article.article_id || currentChapter.article_id || '未知'}`,
				`章节序号：${article.article_chapter || currentChapter.article_chapter || '未知'}`,
				`标题：${currentChapter.title || article.title || '未命名'}`,
				'',
				memoryContext ? `全书章节短摘要（按章节顺序，作者稿优先，其次正式版；当前章节以“正在编辑的章节”占位）：\n${memoryContext}\n` : '全书章节短摘要：暂无可用摘要\n',
				selectedText ? `作者选中文本：\n${selectedText}\n` : '作者选中文本：无\n',
				`光标位置：${cursorPosition === null ? '未知' : cursorPosition}`,
				`光标前文：\n${beforeText || '无'}\n`,
				`光标后文：\n${afterText || '无'}\n`,
				`当前章节全文节选：\n${plainText || '空'}\n`,
				`最近对话：\n${conversationText}\n`,
				prompt ? `作者本轮问题：\n${prompt}` : '作者本轮问题：无',
			].join('\n'),
		},
	];
}

function normalizeSmartReplaceBlocks(blocks) {
	if (!Array.isArray(blocks)) {
		return [];
	}
	return blocks
		.map((block, index) => {
			const source = block && typeof block === 'object' ? block : {};
			const text = String(source.text || '').trim();
			const from = Number(source.from);
			const to = Number(source.to);
			if (!text || !Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
				return null;
			}
			return {
				index: Math.max(1, Math.floor(Number(source.index || index + 1))),
				from: Math.floor(from),
				to: Math.floor(to),
				char_start: Number.isFinite(Number(source.char_start)) ? Math.floor(Number(source.char_start)) : null,
				char_end: Number.isFinite(Number(source.char_end)) ? Math.floor(Number(source.char_end)) : null,
				text: truncateText(text, 2200),
			};
		})
		.filter(Boolean)
		.slice(0, MAX_SMART_REPLACE_PARAGRAPHS);
}

function normalizeSmartReplaceConversation(messages) {
	return (Array.isArray(messages) ? messages : [])
		.map((message) => {
			if (!message || typeof message !== 'object') {
				return null;
			}
			const role = message.role === 'assistant' ? 'assistant' : 'user';
			const content = truncateText(message.content || '', 5000);
			if (!content) {
				return null;
			}
			return { role, content };
		})
		.filter(Boolean)
		.slice(-12);
}

function formatSmartReplaceParagraphs(blocks) {
	if (!blocks.length) {
		return '[]';
	}
	return JSON.stringify(
		blocks.map((block) => ({
			index: block.index,
			text: block.text,
		})),
		null,
		2
	);
}

function buildSmartReplaceMessages(options) {
	const fullText = truncateText(options.fullText || '', MAX_SMART_REPLACE_FULL_TEXT_CHARS);
	const blocks = normalizeSmartReplaceBlocks(options.blocks);
	const conversation = normalizeSmartReplaceConversation(options.messages);
	const question = truncateText(options.question || '', 5000);
	const answer = truncateText(options.answer || '', 9000);
	const draftText = truncateText(options.draftText || '', MAX_SMART_REPLACE_REPLACEMENT_CHARS);
	const title = truncateText(options.title || '', 200);
	const cursorContext = options.cursorContext && typeof options.cursorContext === 'object'
		? options.cursorContext
		: {};
	const cursorBefore = truncateText(cursorContext.before || '', 2500);
	const cursorAfter = truncateText(cursorContext.after || '', 2500);

	return [
		{
			role: 'system',
			content: [
				'你是小说编辑助手，负责把 AI 回答中的候选正文智能应用到当前章节草稿里。',
				'你必须只返回一个 JSON 对象，不要返回 Markdown、代码围栏或解释性正文。',
				'任务是根据当前会话问题、AI 回答、候选正文、光标上下文和当前章节全文，判断候选正文应该插入为新内容，还是替换已有连续段落。',
				'如果作者是在续写、补写、添加新情节、生成下一段，或候选正文不是已有段落的改写，请选择 action="insert"。',
				'如果作者是在润色、改写、替换、精简、扩写或修正已有正文，请选择 action="replace"，并选择应被替换的连续段落。',
				'只有在有必要对正文进行修正时，才返回 replacement_text；若可以直接使用候选的正文，请省略该字段。',
				'如果返回 replacement_text，它必须是完整自然的小说正文段落，保留必要的段落换行；不要包含 <draft> 标签、标题、编号、修改理由、JSON 外文字或 Markdown。',
				'不要返回 reason、explanation 或其他解释性字段。',
				'返回 JSON schema：{"action": "insert" | "replace", "start_paragraph_index": number | null, "end_paragraph_index": number | null, "insert_after_paragraph_index": number | null, "replacement_text"(Optional): string | null}',
				'action="replace" 时 start_paragraph_index 和 end_paragraph_index 必须来自提供的段落表 index，且必须连续；无法确定替换目标时选择 action="insert"。',
				'action="insert" 时必须返回 insert_after_paragraph_index；0 表示插入到第一段之前，N 表示插入到 index=N 的段落之后；正文为空时返回 0。',
			].join('\n'),
		},
		{
			role: 'user',
			content: [
				`当前章节标题：${title || '未命名'}`,
				'',
				'当前会话问题：',
				question || '无',
				'',
				'当前 AI 回答：',
				answer || '无',
				'',
				'点击“应用”的候选正文：',
				draftText || '无',
				'',
				'光标前文：',
				cursorBefore || '无',
				'',
				'光标后文：',
				cursorAfter || '无',
				'',
				'当前章节全文：',
				fullText || '空',
				'',
				'段落表（action="replace" 时请选择其中连续段落的 index；action="insert" 时用它确定 insert_after_paragraph_index）：',
				formatSmartReplaceParagraphs(blocks),
			].join('\n'),
		},
	];
}

function extractChatCompletionText(data) {
	if (!data || typeof data !== 'object') {
		return '';
	}
	const choice = Array.isArray(data.choices) ? data.choices[0] : null;
	const message = choice && choice.message ? choice.message : {};
	const content = message.content;
	if (typeof content === 'string') {
		return content;
	}
	if (Array.isArray(content)) {
		return content
			.map((item) => {
				if (!item) {
					return '';
				}
				if (typeof item === 'string') {
					return item;
				}
				return item.text || item.content || '';
			})
			.filter(Boolean)
			.join('\n');
	}
	if (typeof data.output_text === 'string') {
		return data.output_text;
	}
	if (typeof data.message === 'string') {
		return data.message;
	}
	return '';
}

function parseJsonObjectFromModel(text) {
	const source = String(text || '').trim();
	if (!source) {
		throw new Error('模型没有返回替换方案');
	}
	const unfenced = source
		.replace(/^```(?:json)?\s*/i, '')
		.replace(/\s*```$/i, '')
		.trim();
	try {
		return JSON.parse(unfenced);
	} catch (error) {}

	const start = unfenced.indexOf('{');
	const end = unfenced.lastIndexOf('}');
	if (start !== -1 && end > start) {
		try {
			return JSON.parse(unfenced.slice(start, end + 1));
		} catch (error) {}
	}
	throw new Error('模型返回的替换方案不是有效 JSON');
}

function firstFiniteNumber(...values) {
	for (const value of values) {
		if (value === null || value === undefined || value === '') {
			continue;
		}
		const number = Number(value);
		if (Number.isFinite(number)) {
			return number;
		}
	}
	return NaN;
}

function normalizeSmartReplaceDecision(decision, draftText) {
	const source = decision && typeof decision === 'object' ? decision : {};
	const normalizedAction = String(source.action || source.apply_action || '').trim().toLowerCase();
	const action = normalizedAction === 'insert' ? 'insert' : 'replace';
	const start = firstFiniteNumber(
		source.start_paragraph_index,
		source.startParagraphIndex,
		source.paragraph_index,
		source.paragraphIndex,
		source.target_paragraph_index
	);
	const end = firstFiniteNumber(
		source.end_paragraph_index,
		source.endParagraphIndex,
		source.paragraph_index,
		source.paragraphIndex,
		source.target_paragraph_index,
		start
	);
	const insertAfter = firstFiniteNumber(
		source.insert_after_paragraph_index,
		source.insertAfterParagraphIndex,
		source.after_paragraph_index,
		source.afterParagraphIndex
	);
	const replacementText = normalizeSegmentText(
		source.replacement_text
			|| source.replacementText
			|| source.replacement
			|| source.text
			|| ''
	);
	const normalizedDraftText = normalizeSegmentText(draftText || '');
	const replacementTextChanged = !!(
		replacementText &&
		replacementText !== normalizedDraftText
	);
	return {
		action,
		start_paragraph_index: Math.floor(start),
		end_paragraph_index: Math.floor(end),
		insert_after_paragraph_index: Number.isFinite(insertAfter) ? Math.floor(insertAfter) : null,
		replacement_text: truncateText(replacementText || draftText || '', MAX_SMART_REPLACE_REPLACEMENT_CHARS),
		replacement_text_changed: replacementTextChanged,
		confidence: Number.isFinite(Number(source.confidence)) ? Number(source.confidence) : null,
	};
}

function resolveSmartReplaceRange(blocks, decision) {
	const normalizedBlocks = normalizeSmartReplaceBlocks(blocks);
	const startIndex = Number(decision.start_paragraph_index);
	const endIndex = Number(decision.end_paragraph_index);
	if (!Number.isFinite(startIndex) || !Number.isFinite(endIndex)) {
		throw new Error('模型没有返回有效段落位置');
	}
	const low = Math.min(startIndex, endIndex);
	const high = Math.max(startIndex, endIndex);
	const selectedBlocks = normalizedBlocks.filter((block) => {
		return block.index >= low && block.index <= high;
	});
	if (!selectedBlocks.length || selectedBlocks.length !== high - low + 1) {
		throw new Error('模型返回的段落位置不在当前正文中');
	}
	const first = selectedBlocks[0];
	const last = selectedBlocks[selectedBlocks.length - 1];
	return {
		start_paragraph_index: first.index,
		end_paragraph_index: last.index,
		from: first.from,
		to: last.to,
		original_text: selectedBlocks.map((block) => block.text).join('\n\n'),
	};
}

async function callSmartReplaceModel(messages) {
	if (!WRITER_ASSIST_SMART_REPLACE_API_KEY) {
		const error = new Error('AI 配置尚未完成');
		error.code = 'UNIFIED_API_KEY_MISSING';
		throw error;
	}
	const response = await fetch(`${WRITER_ASSIST_SMART_REPLACE_BASE_URL}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${WRITER_ASSIST_SMART_REPLACE_API_KEY}`,
		},
		body: JSON.stringify({
			model: WRITER_ASSIST_SMART_REPLACE_MODEL,
			messages,
			stream: false,
			temperature: 0.1,
			max_completion_tokens: 32767,
		}),
		timeout: MODEL_REQUEST_TIMEOUT_MS,
	});
	if (!response.ok) {
		let message = `智能替换请求失败：${response.status}`;
		try {
			const data = await response.json();
			message = data.error?.message || data.message || data.msg || message;
		} catch (error) {}
		throw new Error(message);
	}
	const data = await response.json();
	const rawText = extractChatCompletionText(data);
	return {
		rawText,
		decision: parseJsonObjectFromModel(rawText),
	};
}

async function handleWriterNovelSmartReplace(req, res) {
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

		const articleMeta = await getArticleMeta(articleId);
		if (!articleMeta) {
			return res.status(404).json({ msg: '章节不存在' });
		}

		const currentChapter = req.body?.current_chapter && typeof req.body.current_chapter === 'object'
			? req.body.current_chapter
			: {};
		const blocks = normalizeSmartReplaceBlocks(req.body?.blocks);
		const draftText = normalizeSegmentText(req.body?.draft_text);
		if (!draftText) {
			return res.status(400).json({ msg: '缺少候选替换正文' });
		}

		const messages = buildSmartReplaceMessages({
			title: currentChapter.title || articleMeta.title || '',
			fullText: currentChapter.plain_text || legacyContentToPlainText(currentChapter.content || articleMeta.content || ''),
			blocks,
			messages: req.body?.messages,
			question: req.body?.question,
			answer: req.body?.answer,
			draftText,
			cursorContext: req.body?.cursor_context,
		});
		const modelResult = await callSmartReplaceModel(messages);
		const decision = normalizeSmartReplaceDecision(modelResult.decision, draftText);
		if (!decision.replacement_text) {
			return res.status(422).json({ msg: '模型没有返回可应用正文' });
		}
		const replacementPayload = decision.replacement_text_changed
			? { replacement_text: decision.replacement_text }
			: {};
		if (decision.action === 'insert' || !blocks.length) {
			const insertAfterIndex = firstFiniteNumber(decision.insert_after_paragraph_index);
			return res.json({
				msg: 'ok',
				data: {
					action: 'insert',
					model: WRITER_ASSIST_SMART_REPLACE_MODEL,
					insert_after_paragraph_index: Number.isFinite(insertAfterIndex)
						? Math.floor(insertAfterIndex)
						: (blocks.length ? blocks[blocks.length - 1].index : 0),
					...replacementPayload,
					confidence: decision.confidence,
				},
			});
		}
		const range = resolveSmartReplaceRange(blocks, decision);
		return res.json({
			msg: 'ok',
			data: {
				action: 'replace',
				model: WRITER_ASSIST_SMART_REPLACE_MODEL,
				...range,
				...replacementPayload,
				confidence: decision.confidence,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: error.code === 'UNIFIED_API_KEY_MISSING'
				? 'AI 配置尚未完成'
				: error.message || '智能替换暂时没有响应，请稍后再试',
		});
	}
}

function createNdjsonStreamWriter(res) {
	let closed = false;
	const markClosed = () => {
		closed = true;
	};
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
			if (this.closed) {
				return false;
			}
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
			if (this.closed) {
				return;
			}
			try {
				res.end();
			} finally {
				markClosed();
			}
		},
	};
}

function emitProcess(writer, stage, message, extra = {}) {
	if (!writer || writer.closed || !message) {
		return;
	}
	writer.write({
		type: 'process',
		stage,
		message,
		at: Date.now(),
		...extra,
	});
}

function extractDeltaText(payload, contentState) {
	const choice = payload && Array.isArray(payload.choices) ? payload.choices[0] : null;
	const delta = choice && choice.delta ? choice.delta : {};
	if (delta.content !== undefined && delta.content !== null) {
		const text = String(delta.content);
		if (contentState && typeof contentState === 'object') {
			const merged = mergeStreamingText(contentState.text || '', text);
			contentState.text = merged.full;
			return merged.delta;
		}
		return text;
	}
	if (delta.reasoning_content !== undefined && delta.reasoning_content !== null) {
		return '';
	}
	if (choice && choice.message && choice.message.content) {
		const text = String(choice.message.content);
		if (contentState && typeof contentState === 'object') {
			const merged = mergeStreamingText(contentState.text || '', text);
			contentState.text = merged.full;
			return merged.delta;
		}
		return text;
	}
	return '';
}

function mergeStreamingText(previousText, nextText) {
	const previous = String(previousText || '');
	const next = String(nextText || '');
	if (!next) {
		return {
			full: previous,
			delta: '',
		};
	}
	if (next.startsWith(previous)) {
		return {
			full: next,
			delta: next.slice(previous.length),
		};
	}
	if (previous.endsWith(next)) {
		return {
			full: previous,
			delta: '',
		};
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
	return {
		full: `${previous}${next}`,
		delta: next,
	};
}

function extractReasoningDetailsText(details, state) {
	if (!Array.isArray(details)) {
		return '';
	}

	let text = '';
	details.forEach((detail, index) => {
		if (!detail || typeof detail !== 'object') {
			return;
		}
		const value = detail.text ?? detail.content ?? detail.summary;
		if (value === undefined || value === null || value === '') {
			return;
		}
		const nextText = String(value);
		if (!Array.isArray(state)) {
			text += nextText;
			return;
		}

		const detailIndex = Number.isFinite(Number(detail.index))
			? Number(detail.index)
			: index;
		const previousDetail = state[detailIndex] && typeof state[detailIndex] === 'object'
			? state[detailIndex]
			: {};
		const merged = mergeStreamingText(previousDetail.text || '', nextText);
		state[detailIndex] = {
			...previousDetail,
			...detail,
			text: merged.full,
		};
		text += merged.delta;
	});
	return text;
}

function normalizeReasoningState(state) {
	if (state && typeof state === 'object' && !Array.isArray(state)) {
		if (!state.fields || typeof state.fields !== 'object') {
			state.fields = {};
		}
		if (!Array.isArray(state.details)) {
			state.details = [];
		}
		if (typeof state.text !== 'string') {
			state.text = '';
		}
		return state;
	}
	return {
		fields: {},
		details: Array.isArray(state) ? state : [],
		text: '',
	};
}

function extractReasoningFieldText(key, value, state) {
	if (value === undefined || value === null || value === '') {
		return '';
	}
	const text = String(value);
	const previous = state.fields[key] || '';
	const merged = mergeStreamingText(previous, text);
	state.fields[key] = merged.full;
	return merged.delta;
}

function appendReasoningText(text, state) {
	const merged = mergeStreamingText(state.text || '', text);
	state.text = merged.full;
	return merged.delta;
}

function extractReasoningText(payload, reasoningState) {
	const choice = payload && Array.isArray(payload.choices) ? payload.choices[0] : null;
	const delta = choice && choice.delta ? choice.delta : {};
	const message = choice && choice.message ? choice.message : {};
	const state = normalizeReasoningState(reasoningState);
	const candidates = [
		['delta.reasoning_content', delta.reasoning_content],
		['delta.reasoning', delta.reasoning],
		['delta.thinking', delta.thinking],
		['message.reasoning_content', message.reasoning_content],
		['message.reasoning', message.reasoning],
		['message.thinking', message.thinking],
	];
	return [
		...candidates.map(([key, value]) => extractReasoningFieldText(key, value, state)),
		extractReasoningDetailsText(delta.reasoning_details, state.details),
		extractReasoningDetailsText(message.reasoning_details, state.details),
	]
		.map((item) => appendReasoningText(item, state))
		.join('');
}

function safeParseToolArgs(rawArgs) {
	try {
		return rawArgs ? JSON.parse(rawArgs) : {};
	} catch (error) {
		return {};
	}
}

function normalizeOpenAiToolCall(toolCall, index = 0) {
	if (!toolCall || typeof toolCall !== 'object') {
		return null;
	}
	const toolName = toolCall?.function?.name;
	if (!toolName) {
		return null;
	}
	return {
		id: String(toolCall.id || `tool_${Date.now()}_${index}`),
		type: 'function',
		function: {
			name: String(toolName),
			arguments: typeof toolCall?.function?.arguments === 'string'
				? toolCall.function.arguments
				: JSON.stringify(
					toolCall?.function?.arguments && typeof toolCall.function.arguments === 'object'
						? toolCall.function.arguments
						: {}
				),
		},
	};
}

function normalizeOpenAiToolCalls(toolCalls) {
	return (Array.isArray(toolCalls) ? toolCalls : [])
		.map((toolCall, index) => normalizeOpenAiToolCall(toolCall, index))
		.filter(Boolean);
}

function mergeOpenAiToolCallDelta(toolCalls, deltaToolCall, fallbackIndex = 0) {
	if (!deltaToolCall || typeof deltaToolCall !== 'object') {
		return;
	}

	const index = Number.isFinite(Number(deltaToolCall.index))
		? Number(deltaToolCall.index)
		: fallbackIndex;
	if (!toolCalls[index]) {
		toolCalls[index] = {
			id: '',
			type: 'function',
			function: {
				name: '',
				arguments: '',
			},
		};
	}

	const target = toolCalls[index];
	target.id = deltaToolCall.id || target.id;
	target.type = deltaToolCall.type || target.type || 'function';
	if (deltaToolCall.function && typeof deltaToolCall.function === 'object') {
		if (Object.prototype.hasOwnProperty.call(deltaToolCall.function, 'name')) {
			target.function.name = mergeStreamingText(
				target.function.name,
				deltaToolCall.function.name || ''
			).full;
		}
		if (Object.prototype.hasOwnProperty.call(deltaToolCall.function, 'arguments')) {
			target.function.arguments = mergeStreamingText(
				target.function.arguments,
				deltaToolCall.function.arguments || ''
			).full;
		}
	}
}

function extractAssistantMessageFromChatData(data) {
	const choice = data && Array.isArray(data.choices) ? data.choices[0] : null;
	const message = choice && choice.message ? choice.message : {};
	return {
		role: 'assistant',
		content: extractChatCompletionText(data),
		tool_calls: normalizeOpenAiToolCalls(message.tool_calls),
	};
}

function normalizeImageAspectRatio(value) {
	const ratio = String(value || '').trim();
	return IMAGE_GENERATION_ASPECT_RATIOS.has(ratio) ? ratio : '1:1';
}

function normalizeImageCount(value) {
	const count = Math.floor(Number(value || 1));
	if (!Number.isFinite(count)) {
		return 1;
	}
	return Math.min(9, Math.max(1, count));
}

function normalizeMiniMaxImageBase64(value) {
	const source = String(value || '').trim();
	if (!source) {
		return '';
	}
	return source.includes(',') ? source.split(',').pop() : source;
}

async function uploadImageBase64ToLoghome(imageBase64) {
	const normalizedBase64 = normalizeMiniMaxImageBase64(imageBase64);
	if (!normalizedBase64) {
		throw new Error('图片生成结果为空');
	}
	if (!IMAGE_UPLOAD_BASE64_URL || !IMAGE_UPLOAD_API_KEY) {
		throw new Error('图片上传配置尚未完成');
	}

	const response = await fetch(IMAGE_UPLOAD_BASE64_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			img: `data:image/jpeg;base64,${normalizedBase64}`,
			apikey: IMAGE_UPLOAD_API_KEY,
		}),
		timeout: IMAGE_UPLOAD_TIMEOUT_MS,
	});
	let data = null;
	try {
		data = await response.json();
	} catch (error) {}
	if (!response.ok) {
		throw new Error(`图片上传失败：${response.status}`);
	}
	const imageUrl = data && (
		data.url
		|| data.image_url
		|| data.src
		|| data.data?.url
		|| data.data?.image_url
		|| data.data?.src
		|| (typeof data.data === 'string' ? data.data : '')
	);
	if (!imageUrl) {
		throw new Error('图片上传服务没有返回 URL');
	}
	return String(imageUrl);
}

async function generateAndUploadMiniMaxImages(rawArgs) {
	if (!MINIMAX_IMAGE_API_KEY) {
		const error = new Error('MiniMax 图片生成配置尚未完成');
		error.code = 'MINIMAX_API_KEY_MISSING';
		throw error;
	}
	const args = rawArgs && typeof rawArgs === 'object' ? rawArgs : {};
	const prompt = truncateText(args.prompt || args.description || '', 1500);
	if (!prompt) {
		throw new Error('图片生成提示词不能为空');
	}
	const aspectRatio = normalizeImageAspectRatio(args.aspect_ratio || args.aspectRatio);
	const count = normalizeImageCount(args.n || args.count);
	const payload = {
		model: 'image-01',
		prompt,
		aspect_ratio: aspectRatio,
		response_format: 'base64',
		n: count,
		prompt_optimizer: args.prompt_optimizer !== false,
		aigc_watermark: args.aigc_watermark === true,
	};

	const response = await fetch(`${MINIMAX_IMAGE_BASE_URL}/image_generation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${MINIMAX_IMAGE_API_KEY}`,
		},
		body: JSON.stringify(payload),
		timeout: IMAGE_GENERATION_TIMEOUT_MS,
	});
	let data = null;
	try {
		data = await response.json();
	} catch (error) {}
	if (!response.ok) {
		const message = data?.error?.message || data?.base_resp?.status_msg || data?.message || `MiniMax 图片生成失败：${response.status}`;
		throw new Error(message);
	}
	if (data && data.base_resp && Number(data.base_resp.status_code || 0) !== 0) {
		throw new Error(data.base_resp.status_msg || 'MiniMax 图片生成失败');
	}

	const imageBase64List = Array.isArray(data?.data?.image_base64)
		? data.data.image_base64
		: [];
	if (!imageBase64List.length) {
		throw new Error('MiniMax 没有返回图片');
	}

	const images = [];
	for (let index = 0; index < imageBase64List.length; index += 1) {
		const url = await uploadImageBase64ToLoghome(imageBase64List[index]);
		images.push({
			id: `${data.id || 'minimax'}-${index}`,
			url,
			prompt,
			aspect_ratio: aspectRatio,
			source: 'minimax',
		});
	}

	return {
		id: data.id || '',
		images,
		metadata: data.metadata || null,
	};
}

function applyImageGenerationDefaults(rawArgs, features) {
	const args = rawArgs && typeof rawArgs === 'object' ? { ...rawArgs } : {};
	const normalizedFeatures = normalizeWriterAssistFeatures(features);
	if (!args.aspect_ratio && !args.aspectRatio) {
		args.aspect_ratio = normalizedFeatures.image_aspect_ratio || '1:1';
	}
	if (normalizedFeatures.image_style) {
		const prompt = String(args.prompt || args.description || '').trim();
		const styleText = `画面风格：${normalizedFeatures.image_style}`;
		args.prompt = prompt ? `${prompt}\n${styleText}` : styleText;
	}
	if (!args.n && !args.count) {
		args.n = 1;
	}
	return args;
}

async function executeWriterAssistTool(toolCall, writer, options = {}) {
	const toolName = toolCall?.function?.name;
	const args = applyImageGenerationDefaults(
		safeParseToolArgs(toolCall?.function?.arguments),
		options.features
	);
	if (toolName !== 'generate_image') {
		return {
			success: false,
			error: `未知工具：${toolName || 'unknown'}`,
		};
	}

	emitProcess(writer, 'image_generation_start', '正在调用图片生成工具', {
		tool_name: toolName,
	});
	writer.write({
		type: 'status',
		message: '正在生成图片',
	});
	const result = await generateAndUploadMiniMaxImages(args);
	writer.write({
		type: 'generated_image',
		image: result.images[0] || null,
		images: result.images,
		metadata: result.metadata,
	});
	emitProcess(writer, 'image_generation_done', `图片已生成并上传：${result.images.length} 张`, {
		image_count: result.images.length,
	});
	return {
		success: true,
		images: result.images,
		metadata: result.metadata,
	};
}

async function callWriterModelStreamOnce(messages, writer, model, options = {}) {
	const selectedModel = model || WRITER_ASSIST_DEEP_MODEL;
	const apiConfig = resolveWriterAssistApiConfig(selectedModel);
	if (!apiConfig.apiKey) {
		const error = new Error('AI 配置尚未完成');
		error.code = 'UNIFIED_API_KEY_MISSING';
		throw error;
	}

	const controller = typeof AbortController !== 'undefined'
		? new AbortController()
		: null;
	const timeoutTimer = setTimeout(() => {
		if (controller) {
			controller.abort();
		}
	}, MODEL_REQUEST_TIMEOUT_MS);
	if (timeoutTimer && typeof timeoutTimer.unref === 'function') {
		timeoutTimer.unref();
	}

	let heartbeatCount = 0;
	let hasDelta = false;
	let hasReasoning = false;
	let outputCharCount = 0;
	let reasoningCharCount = 0;
	let nextOutputProgressMark = 200;
	const contentState = { text: '' };
	const reasoningState = {
		fields: {},
		details: [],
		text: '',
	};
	const toolCallState = [];
	const heartbeatTimer = setInterval(() => {
		heartbeatCount += 1;
		if (!writer.closed) {
			writer.write({
				type: 'status',
				message: hasDelta
					? '写作助手仍在生成内容'
					: `模型正在组织文字，已等待 ${heartbeatCount * 10} 秒`,
			});
			if (!hasDelta && !hasReasoning) {
				emitProcess(writer, 'waiting_first_token', `模型正在思考，已等待 ${heartbeatCount * 10} 秒`);
			}
		}
	}, MODEL_HEARTBEAT_INTERVAL_MS);
	if (heartbeatTimer && typeof heartbeatTimer.unref === 'function') {
		heartbeatTimer.unref();
	}

	let response;
	try {
		emitProcess(writer, 'model_connect', `正在连接模型服务（${selectedModel}）`, {
			model: selectedModel,
		});
		writer.write({
			type: 'status',
			message: '已连接模型，等待生成首段文字',
		});
		response = await streamingFetch(`${apiConfig.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiConfig.apiKey}`,
			},
			body: JSON.stringify(buildWriterModelRequest(messages, selectedModel, {
				tools: options.tools,
				thinkingMode: options.thinkingMode,
			})),
			signal: controller ? controller.signal : undefined,
			timeout: MODEL_REQUEST_TIMEOUT_MS,
		});
		emitProcess(writer, 'model_connected', '模型服务已响应，开始读取流式输出');
	} catch (error) {
		clearTimeout(timeoutTimer);
		clearInterval(heartbeatTimer);
		if (error && (error.name === 'AbortError' || error.type === 'request-timeout')) {
			const timeoutError = new Error('模型响应超时，请稍后重试或缩短选中文本。');
			timeoutError.code = 'MODEL_TIMEOUT';
			throw timeoutError;
		}
		throw error;
	}

	if (!response.ok) {
		let message = `AI 请求失败：${response.status}`;
		try {
			const data = await response.json();
			message = data.error?.message || data.message || message;
		} catch (error) {}
		clearTimeout(timeoutTimer);
		clearInterval(heartbeatTimer);
		throw new Error(message);
	}

	const responseContentType = String(response.headers && response.headers.get
		? response.headers.get('content-type') || ''
		: '');
	if (responseContentType && !/event-stream|text\/plain|octet-stream/i.test(responseContentType)) {
		try {
			const data = await response.json();
			const assistantMessage = extractAssistantMessageFromChatData(data);
			const reasoning = extractReasoningText(data);
			const text = assistantMessage.content || data.message || '';
			if (reasoning) {
				emitProcess(writer, 'reasoning_start', '已收到模型原始推理');
				writer.write({ type: 'reasoning_delta', content: reasoning });
			}
			if (text) {
				emitProcess(writer, 'answer_start', '开始输出正文建议');
				writer.write({ type: 'delta', content: text });
			}
			return assistantMessage;
		} finally {
			clearTimeout(timeoutTimer);
			clearInterval(heartbeatTimer);
		}
	}

	const supportsStreamingBody = response.body && (
		typeof response.body.on === 'function'
		|| typeof response.body.getReader === 'function'
		|| typeof response.body[Symbol.asyncIterator] === 'function'
	);
	if (!supportsStreamingBody) {
		try {
			const data = await response.json();
			const assistantMessage = extractAssistantMessageFromChatData(data);
			const reasoning = extractReasoningText(data);
			const text = assistantMessage.content || '';
			if (reasoning) {
				emitProcess(writer, 'reasoning_start', '已收到模型原始推理');
				writer.write({ type: 'reasoning_delta', content: reasoning });
			}
			if (text) {
				emitProcess(writer, 'answer_start', '开始输出正文建议');
				writer.write({ type: 'delta', content: text });
			}
			return assistantMessage;
		} finally {
			clearTimeout(timeoutTimer);
			clearInterval(heartbeatTimer);
		}
	}

	try {
		let buffer = '';
		const decoder = new TextDecoder('utf-8');
		for await (const chunk of response.body) {
			// 原生 fetch 的 Web Stream 产出 Uint8Array；直接调用 toString()
			// 会得到逗号分隔的字节值，导致 SSE 的 data: 行无法被识别。
			buffer += decoder.decode(chunk, { stream: true });
			let newlineIndex = buffer.indexOf('\n');
			while (newlineIndex !== -1) {
				const line = buffer.slice(0, newlineIndex).trim();
				buffer = buffer.slice(newlineIndex + 1);
				newlineIndex = buffer.indexOf('\n');

				if (!line || !line.startsWith('data:')) {
					continue;
				}
				const rawData = line.slice(5).trim();
				if (!rawData || rawData === '[DONE]') {
					continue;
				}

				let payload;
				try {
					payload = JSON.parse(rawData);
				} catch (error) {
					continue;
				}
				if (payload && payload.base_resp && Number(payload.base_resp.status_code || 0) !== 0) {
					throw new Error(payload.base_resp.status_msg || 'AI 请求失败');
				}
				if (payload && payload.error) {
					throw new Error(payload.error.message || payload.error.type || 'AI 请求失败');
				}
				const reasoning = extractReasoningText(payload, reasoningState);
				if (reasoning) {
					if (!hasReasoning) {
						emitProcess(writer, 'reasoning_start', '模型正在输出原始推理');
					}
					hasReasoning = true;
					reasoningCharCount += reasoning.length;
					writer.write({
						type: 'reasoning_delta',
						content: reasoning,
						chars: reasoningCharCount,
					});
				}
				const choice = payload && Array.isArray(payload.choices) ? payload.choices[0] : null;
				const delta = choice && choice.delta ? choice.delta : {};
				if (Array.isArray(delta.tool_calls)) {
					delta.tool_calls.forEach((toolCall, index) => {
						mergeOpenAiToolCallDelta(toolCallState, toolCall, index);
					});
				}
				const text = extractDeltaText(payload, contentState);
				if (text) {
					if (!hasDelta) {
						emitProcess(writer, 'answer_start', '开始输出正文建议');
					}
					hasDelta = true;
					outputCharCount += text.length;
					writer.write({
						type: 'delta',
						content: text,
						chars: outputCharCount,
					});
					if (outputCharCount >= nextOutputProgressMark) {
						emitProcess(writer, 'answer_progress', `已生成约 ${outputCharCount} 字正文`, {
							chars: outputCharCount,
						});
						nextOutputProgressMark += 200;
					}
				}
			}
		}
		buffer += decoder.decode();
		if (buffer.trim()) {
			const line = buffer.trim();
			if (line.startsWith('data:')) {
				const rawData = line.slice(5).trim();
				if (rawData && rawData !== '[DONE]') {
					try {
						const payload = JSON.parse(rawData);
						const text = extractDeltaText(payload, contentState);
						if (text) {
							if (!hasDelta) {
								emitProcess(writer, 'answer_start', '开始输出正文建议');
							}
							hasDelta = true;
							outputCharCount += text.length;
							writer.write({ type: 'delta', content: text, chars: outputCharCount });
						}
					} catch (error) {}
				}
			}
		}
	} catch (error) {
		if (error && (error.name === 'AbortError' || error.type === 'request-timeout')) {
			const timeoutError = new Error('模型响应超时，请稍后重试或缩短选中文本。');
			timeoutError.code = 'MODEL_TIMEOUT';
			throw timeoutError;
		}
		throw error;
	} finally {
		clearTimeout(timeoutTimer);
		clearInterval(heartbeatTimer);
	}
	return {
		role: 'assistant',
		content: contentState.text || '',
		tool_calls: normalizeOpenAiToolCalls(toolCallState),
	};
}

async function callWriterModelStream(messages, writer, model, options = {}) {
	const features = normalizeWriterAssistFeatures(options.features);
	const tools = getWriterAssistImageTools(features.image_generation);
	if (!tools.length) {
		await callWriterModelStreamOnce(messages, writer, model, { tools: [], thinkingMode: options.thinkingMode });
		return;
	}

	const workingMessages = (Array.isArray(messages) ? messages : []).slice();
	for (let round = 0; round < IMAGE_GENERATION_TOOL_MAX_ROUNDS; round += 1) {
		const assistantMessage = await callWriterModelStreamOnce(workingMessages, writer, model, { tools, thinkingMode: options.thinkingMode });
		const toolCalls = normalizeOpenAiToolCalls(assistantMessage && assistantMessage.tool_calls);
		workingMessages.push({
			role: 'assistant',
			content: assistantMessage && assistantMessage.content ? assistantMessage.content : '',
			tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
		});

		if (!toolCalls.length) {
			return;
		}

		for (const toolCall of toolCalls) {
			let toolResult;
			try {
				toolResult = await executeWriterAssistTool(toolCall, writer, { features });
			} catch (error) {
				console.log(error);
				toolResult = {
					success: false,
					error: error && error.message ? error.message : '图片生成失败',
				};
				writer.write({
					type: 'status',
					message: toolResult.error,
				});
				emitProcess(writer, 'image_generation_failed', toolResult.error);
			}
			workingMessages.push({
				role: 'tool',
				tool_call_id: toolCall.id,
				content: JSON.stringify(toolResult),
			});
		}
	}

	emitProcess(writer, 'image_generation_round_limit', '图片工具调用次数已达上限，停止继续调用工具');
}

async function runWriterAssistTask(task) {
	const writer = createTaskEventWriter(task);
	try {
		const body = task.requestBody || {};
		const articleMeta = task.articleMeta || {};
		const articleId = task.articleId;
		const novelId = task.novelId || Number(articleMeta.novel_id || body.novel_id || 0);
		const currentChapter = body.current_chapter && typeof body.current_chapter === 'object'
			? body.current_chapter
			: {};
		const selection = body.selection && typeof body.selection === 'object'
			? body.selection
			: {};
		const cursorContext = body.cursor_context && typeof body.cursor_context === 'object'
			? body.cursor_context
			: {};
		const thinkingMode = task.thinkingMode;
		const writerAssistModel = task.model || resolveWriterAssistModel(thinkingMode);
		const features = normalizeWriterAssistFeatures(body.features);

		emitProcess(writer, 'permission', '权限校验完成');
		emitProcess(writer, 'context', '正在整理草稿和全书章节短摘要');
		writer.write({
			type: 'status',
			message: '正在整理草稿和全书章节短摘要',
		});

		const contextStartedAt = Date.now();
		const emitContextProgress = (stage, message, extra = {}) => {
			emitProcess(writer, stage, message, {
				...extra,
				context_elapsed_ms: Date.now() - contextStartedAt,
			});
		};
		const novelPromise = runContextStep(
			emitContextProgress,
			'novel_info',
			'正在读取作品信息和统计数据',
			() => getNovelInfo(novelId)
		);
		const memoryPromise = buildMemoryContext(novelId, articleMeta.article_chapter, {
			onProgress: emitContextProgress,
			currentArticleId: articleId,
			currentChapterTitle: currentChapter.title || articleMeta.title || '',
		});
		const [novel, memoryContext] = await Promise.all([
			novelPromise,
			memoryPromise,
		]);

		emitProcess(writer, 'context_ready', memoryContext ? '已载入全书章节短摘要' : '全书章节暂无短摘要，使用当前草稿上下文', {
			duration_ms: Date.now() - contextStartedAt,
		});
		const messages = buildWriterMessages({
			prompt: body.prompt,
			messages: body.messages,
			novel: novel || {},
			article: articleMeta,
			currentChapter: {
				...currentChapter,
				article_id: articleId,
				novel_id: novelId,
				article_chapter: articleMeta.article_chapter,
				title: currentChapter.title || articleMeta.title || '',
				content: currentChapter.content || articleMeta.content || '',
			},
			selection,
			cursorContext,
			memoryContext,
			features,
		});
		const modelRequest = buildWriterModelRequest(messages, writerAssistModel, {
			tools: getWriterAssistImageTools(features.image_generation),
		});
		try {
			await saveWriterPromptLog({
				request_id: task.taskId || (typeof crypto.randomUUID === 'function'
					? crypto.randomUUID()
					: `${Date.now()}-${Math.random().toString(16).slice(2)}`),
				user_id: task.userId,
				novel_id: novelId,
				article_id: articleId,
				article_chapter: Number(articleMeta.article_chapter || 0),
				mode: 'chat',
				thinking_mode: thinkingMode,
				model: writerAssistModel,
				request_prompt: String(body.prompt || ''),
				conversation_message_count: normalizeConversationMessages(body.messages).length,
				selection_chars: String(selection.text || '').length,
				cursor_position: Number.isFinite(Number(selection.from)) ? Number(selection.from) : null,
				cursor_before_chars: String(cursorContext.before || '').length,
				cursor_after_chars: String(cursorContext.after || '').length,
				memory_context_chars: String(memoryContext || '').length,
				features,
				current_chapter_title: currentChapter.title || articleMeta.title || '',
				model_request: modelRequest,
			});
		} catch (logError) {
			console.log('writer prompt log failed', logError);
		}

		emitProcess(writer, 'prompt_ready', '写作上下文已组装，准备请求模型');
		writer.write({
			type: 'status',
			message: '正在生成写作建议',
		});
		await callWriterModelStream(messages, writer, writerAssistModel, {
			features,
			thinkingMode,
		});
		emitProcess(writer, 'done', '生成完成');
		writer.write({
			type: 'done',
		});
		finishTask(task, 'completed');
	} catch (error) {
		console.log(error);
		writer.write({
			type: 'error',
			message: error.code === 'UNIFIED_API_KEY_MISSING'
				? 'AI 配置尚未完成'
				: error.message || '写作助手暂时没有响应，请稍后再试',
		});
		finishTask(task, 'error');
	}
}

function ensureWriterAssistTaskStarted(task) {
	if (task.started) {
		return;
	}

	task.started = true;
	ensureTaskCleanupTimer();
	runWriterAssistTask(task).catch((error) => {
		console.log(error);
	});
}

async function ensureWriterAssistTask(options) {
	const messageId = normalizeTaskMessageId(options.messageId);
	const normalizedTaskId = normalizeTaskId(options.taskId, [
		'writer-ai',
		options.userId,
		options.articleId,
		options.sessionId,
		messageId,
		typeof crypto.randomUUID === 'function'
			? crypto.randomUUID()
			: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
	]);
	const existingTask = writerAssistTaskStore.get(normalizedTaskId);
	if (existingTask) {
		if (
			Number(existingTask.userId || 0) !== Number(options.userId || 0)
			|| Number(existingTask.articleId || 0) !== Number(options.articleId || 0)
		) {
			const conflictError = new Error('任务标识与当前用户或章节不匹配');
			conflictError.code = 'TASK_ACCESS_CONFLICT';
			throw conflictError;
		}
		if (existingTask.billingPromise) await existingTask.billingPromise;
		ensureWriterAssistTaskStarted(existingTask);
		return {
			task: existingTask,
			created: false,
		};
	}

	const task = createWriterAssistTaskRecord({
		taskId: normalizedTaskId,
		userId: options.userId,
		articleId: options.articleId,
		novelId: options.novelId,
		sessionId: options.sessionId,
		messageId,
		thinkingMode: options.thinkingMode,
		model: options.model,
		requestBody: options.requestBody,
		articleMeta: options.articleMeta,
	});
	writerAssistTaskStore.set(normalizedTaskId, task);
	const features = normalizeWriterAssistFeatures(options.requestBody && options.requestBody.features);
	const redstoneCost = features.image_generation ? 5 : (options.thinkingMode === 'deep' ? 2 : 1);
	task.billingPromise = consumeRedstone({
		userId: options.userId,
		amount: redstoneCost,
		feature: features.image_generation
			? 'writer_bipao_image'
			: options.thinkingMode === 'deep' ? 'writer_bipao_deep' : 'writer_bipao_fast',
		requestId: normalizedTaskId,
		description: `笔泡AI${features.image_generation ? '图像生成' : options.thinkingMode === 'deep' ? '深度思考' : '普通问答'}消耗${redstoneCost}红石`,
	});
	try {
		await task.billingPromise;
		task.billingPromise = null;
	} catch (error) {
		if (writerAssistTaskStore.get(normalizedTaskId) === task) writerAssistTaskStore.delete(normalizedTaskId);
		throw error;
	}
	ensureWriterAssistTaskStarted(task);
	return {
		task,
		created: true,
	};
}

async function handleWriterNovelAssistStream(req, res) {
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

		const articleMeta = await getArticleMeta(articleId);
		if (!articleMeta) {
			return res.status(404).json({ msg: '章节不存在' });
		}

		const requestNovelId = Number(req.body?.novel_id || articleMeta.novel_id || access.novel_id || 0);
		const novelId = Number(articleMeta.novel_id || requestNovelId || 0);
		const currentChapter = req.body?.current_chapter && typeof req.body.current_chapter === 'object'
			? req.body.current_chapter
			: {};
		const selection = req.body?.selection && typeof req.body.selection === 'object'
			? req.body.selection
			: {};
		const cursorContext = req.body?.cursor_context && typeof req.body.cursor_context === 'object'
			? req.body.cursor_context
			: {};
		const thinkingMode = normalizeThinkingMode(req.body?.thinking_mode);
		const writerAssistModel = resolveWriterAssistModel(thinkingMode);
		const sessionId = String(req.body?.session_id || req.body?.conversation_id || '').trim();
		const messageId = normalizeTaskMessageId(req.body?.message_id);
		const taskId = String(req.body?.task_id || '').trim();
		const resumeFromEventId = normalizeEventCursor(
			req.body?.resume_from_event_id !== undefined
				? req.body.resume_from_event_id
				: req.query?.resume_from_event_id
		);
		const requestBody = {
			...req.body,
			current_chapter: currentChapter,
			selection,
			cursor_context: cursorContext,
			thinking_mode: thinkingMode,
		};
		const ensuredTask = await ensureWriterAssistTask({
			taskId,
			userId: Number(user.user_id || 0),
			articleId,
			novelId,
			sessionId,
			messageId,
			thinkingMode,
			model: writerAssistModel,
			requestBody,
			articleMeta,
		});
		const task = ensuredTask.task;
		const writer = createNdjsonStreamWriter(res);
		writer.write({
			type: 'task',
			task_id: task.taskId,
			session_id: task.sessionId,
			message_id: task.messageId,
			article_id: task.articleId,
			novel_id: task.novelId,
			thinking_mode: task.thinkingMode,
			model: task.model,
			status: task.status,
			created: ensuredTask.created === true,
		});

		const { subscriber, unsubscribe } = subscribeTask(task, writer);
		const replaySnapshot = task.events.slice();
		const replaySuccess = replayTaskEvents(replaySnapshot, resumeFromEventId, writer);
		const latestReplayedEventId = replaySnapshot.length > 0
			? Number(replaySnapshot[replaySnapshot.length - 1].event_id || 0)
			: resumeFromEventId;
		const flushSuccess = replaySuccess && subscriber.flushBufferedEvents(latestReplayedEventId);

		if (!flushSuccess || task.status !== 'running') {
			unsubscribe();
			writer.end();
			return;
		}

		const handleDisconnect = () => {
			unsubscribe();
		};
		if (typeof res.once === 'function') {
			res.once('close', handleDisconnect);
		}
		if (typeof req.once === 'function') {
			req.once('aborted', handleDisconnect);
		}
	} catch (error) {
		console.log(error);
		if (sendBillingError(res, error)) return;
		if (error && error.code === 'TASK_ACCESS_CONFLICT') {
			return res.status(409).json({ msg: error.message || '任务冲突' });
		}
		return res.status(500).json({ msg: '服务器错误' });
	}
}

module.exports = {
	handleWriterNovelAssistStream,
	handleWriterNovelSmartReplace,
};
