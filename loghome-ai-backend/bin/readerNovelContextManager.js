const DEFAULT_CONTEXT_LIMIT_TOKENS = 200000;
const DEFAULT_COMPRESSION_THRESHOLD_RATIO = 0.8;
const DEFAULT_OUTPUT_RESERVE_TOKENS = 12000;
const DEFAULT_COMPRESSION_CHUNK_TOKENS = 60000;
const DEFAULT_SUMMARY_TARGET_TOKENS = 12000;

function estimateTextTokens(text) {
	const source = String(text || '');
	if (!source) {
		return 0;
	}

	const cjkMatches = source.match(/[\u3400-\u9fff\uf900-\ufaff]/g);
	const cjkCount = cjkMatches ? cjkMatches.length : 0;
	const nonCjkText = source.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, '');
	const nonWhitespaceCount = nonCjkText.replace(/\s+/g, '').length;
	const whitespaceCount = nonCjkText.length - nonWhitespaceCount;

	return Math.ceil((cjkCount * 1.1) + (nonWhitespaceCount / 3.5) + (whitespaceCount / 8));
}

function estimateJsonTokens(value) {
	try {
		return estimateTextTokens(JSON.stringify(value || null));
	} catch (error) {
		return 0;
	}
}

function estimateMessageTokens(message) {
	if (!message || typeof message !== 'object') {
		return 0;
	}
	return 8
		+ estimateTextTokens(message.role || '')
		+ estimateTextTokens(message.content || '')
		+ estimateJsonTokens(message.tool_calls)
		+ estimateTextTokens(message.name || '')
		+ estimateTextTokens(message.tool_call_id || '');
}

function estimateMessagesTokens(messages) {
	return (Array.isArray(messages) ? messages : [])
		.reduce((total, message) => total + estimateMessageTokens(message), 0);
}

function estimateContextTokens({ staticMessages, messages, tools, outputReserveTokens }) {
	return estimateMessagesTokens(staticMessages)
		+ estimateMessagesTokens(messages)
		+ estimateJsonTokens(tools)
		+ Number(outputReserveTokens || 0);
}

function formatMessageForCompression(message, index) {
	const role = message.role === 'assistant' ? 'assistant' : 'user';
	return `#${index + 1} ${role}\n${String(message.content || '').trim()}`;
}

function buildCompressionSource(messages) {
	return (Array.isArray(messages) ? messages : [])
		.map(formatMessageForCompression)
		.filter(Boolean)
		.join('\n\n---\n\n');
}

function splitMessagesIntoTokenChunks(messages, chunkTokenLimit) {
	const chunks = [];
	let current = [];
	let currentTokens = 0;
	const safeLimit = Math.max(2000, Number(chunkTokenLimit || DEFAULT_COMPRESSION_CHUNK_TOKENS));

	for (const message of Array.isArray(messages) ? messages : []) {
		const messageTokens = Math.max(1, estimateMessageTokens(message));
		if (current.length > 0 && currentTokens + messageTokens > safeLimit) {
			chunks.push(current);
			current = [];
			currentTokens = 0;
		}
		current.push(message);
		currentTokens += messageTokens;
	}

	if (current.length > 0) {
		chunks.push(current);
	}

	return chunks;
}

function buildCompressionPrompt(messages, options = {}) {
	const targetTokens = Number(options.summaryTargetTokens || DEFAULT_SUMMARY_TARGET_TOKENS);
	return [
		{
			role: 'system',
			content: `你是小说问答会话的上下文压缩器。
请把较早的多轮对话压缩为一份供后续 agent 使用的历史摘要。

要求：
- 保留用户明确问过的问题、已确认的结论、角色关系、章节线索、引用ID、未解决的问题和用户偏好。
- 不要编造新剧情、新引用ID或新事实。
- 不要输出推理过程，不要输出压缩说明，只输出摘要正文。
- 摘要目标上限约 ${targetTokens} tokens；信息密度优先，必要时用条目。`,
		},
		{
			role: 'user',
			content: `请压缩以下旧对话：\n\n${buildCompressionSource(messages)}`,
		},
	];
}

function buildMergePrompt(summaries, options = {}) {
	const targetTokens = Number(options.summaryTargetTokens || DEFAULT_SUMMARY_TARGET_TOKENS);
	return [
		{
			role: 'system',
			content: `你是小说问答会话的上下文压缩器。
请把多份历史摘要合并为一份更紧凑、无重复、可继续供 agent 使用的摘要。
保留章节线索、引用ID、已确认结论、未解决问题和用户偏好。
不要输出推理过程，不要输出压缩说明，只输出摘要正文。
摘要目标上限约 ${targetTokens} tokens。`,
		},
		{
			role: 'user',
			content: summaries
				.map((summary, index) => `# 摘要片段 ${index + 1}\n${String(summary || '').trim()}`)
				.join('\n\n---\n\n'),
		},
	];
}

function buildCompressedHistoryMessage(summary, compressedCount, originalTokenEstimate, summaryTokenEstimate) {
	return {
		role: 'system',
		content: [
			'以下是早期对话的压缩历史摘要，供回答当前问题时参考；最近两条对话仍保留原文：',
			`压缩消息数：${compressedCount}`,
			`压缩前估算 tokens：${originalTokenEstimate}`,
			`压缩后估算 tokens：${summaryTokenEstimate}`,
			'',
			String(summary || '').trim(),
		].join('\n'),
	};
}

async function compressConversationHistory(messages, callModel, runtimeConfig, options = {}) {
	const olderMessages = (Array.isArray(messages) ? messages : []).slice(0, -2);
	const recentMessages = (Array.isArray(messages) ? messages : []).slice(-2);

	if (olderMessages.length === 0 || typeof callModel !== 'function') {
		return {
			messages,
			compressed: false,
			originalTokenEstimate: estimateMessagesTokens(messages),
			compressedTokenEstimate: estimateMessagesTokens(messages),
		};
	}

	const chunks = splitMessagesIntoTokenChunks(
		olderMessages,
		options.compressionChunkTokens || DEFAULT_COMPRESSION_CHUNK_TOKENS
	);
	const summaries = [];

	for (const chunk of chunks) {
		const completion = await callModel(
			runtimeConfig,
			buildCompressionPrompt(chunk, options),
			null
		);
		const summary = String(completion && completion.message && completion.message.content || '').trim();
		if (summary) {
			summaries.push(summary);
		}
	}

	let mergedSummary = summaries.join('\n\n');
	const summaryTargetTokens = Number(options.summaryTargetTokens || DEFAULT_SUMMARY_TARGET_TOKENS);
	if (summaries.length > 1 && estimateTextTokens(mergedSummary) > summaryTargetTokens) {
		const completion = await callModel(
			runtimeConfig,
			buildMergePrompt(summaries, options),
			null
		);
		const summary = String(completion && completion.message && completion.message.content || '').trim();
		if (summary) {
			mergedSummary = summary;
		}
	}

	if (!mergedSummary) {
		return {
			messages,
			compressed: false,
			originalTokenEstimate: estimateMessagesTokens(messages),
			compressedTokenEstimate: estimateMessagesTokens(messages),
		};
	}

	const originalTokenEstimate = estimateMessagesTokens(olderMessages);
	const summaryTokenEstimate = estimateTextTokens(mergedSummary);
	const compressedMessages = [
		buildCompressedHistoryMessage(
			mergedSummary,
			olderMessages.length,
			originalTokenEstimate,
			summaryTokenEstimate
		),
		...recentMessages,
	];

	return {
		messages: compressedMessages,
		compressed: true,
		compressedCount: olderMessages.length,
		originalTokenEstimate,
		compressedTokenEstimate: estimateMessagesTokens(compressedMessages),
		summaryTokenEstimate,
	};
}

async function manageReaderNovelContext(options = {}) {
	const messages = Array.isArray(options.messages) ? options.messages : [];
	const contextLimitTokens = Number(options.contextLimitTokens || DEFAULT_CONTEXT_LIMIT_TOKENS);
	const thresholdRatio = Number(options.thresholdRatio || DEFAULT_COMPRESSION_THRESHOLD_RATIO);
	const outputReserveTokens = Number(options.outputReserveTokens || DEFAULT_OUTPUT_RESERVE_TOKENS);
	const thresholdTokens = Math.floor(contextLimitTokens * thresholdRatio);
	const estimatedTokens = estimateContextTokens({
		staticMessages: options.staticMessages,
		messages,
		tools: options.tools,
		outputReserveTokens,
	});

	if (estimatedTokens < thresholdTokens || messages.length <= 2) {
		return {
			messages,
			compressed: false,
			estimatedTokens,
			thresholdTokens,
		};
	}

	const compressed = await compressConversationHistory(
		messages,
		options.callModel,
		options.runtimeConfig,
		options
	);

	return {
		...compressed,
		estimatedTokens,
		thresholdTokens,
	};
}

module.exports = {
	DEFAULT_CONTEXT_LIMIT_TOKENS,
	DEFAULT_COMPRESSION_THRESHOLD_RATIO,
	estimateTextTokens,
	estimateMessagesTokens,
	estimateContextTokens,
	manageReaderNovelContext,
};
