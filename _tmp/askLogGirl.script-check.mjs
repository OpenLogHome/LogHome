
import darkModeMixin from '@/mixins/dark-mode.js'

const STREAM_ROUTE = '/library/reader_novel_ai_chat_stream'
const INDEX_STATUS_ROUTE = '/library/reader_novel_summary_index_status'
const SCROLL_ANCHOR_ID = 'chat-bottom-anchor'
const HISTORY_STORAGE_KEY = 'reader_ask_log_girl_history_v2'
const LEGACY_STORAGE_KEY_PREFIX = 'reader_ask_log_girl_'
const THINKING_HINT_TEXTS = [
	'正在阅读中',
	'正在整理中',
	'正在誊写中',
	'正在分析中',
]
const DEFAULT_NOVEL_INDEX_STATUS = {
	loading: false,
	loaded: false,
	error: '',
	totalChapters: 0,
	indexedChapters: 0,
	indexedSummaryChapters: 0,
	pendingSummaryChapters: 0,
	percent: 0,
	queueStatus: '',
	queue: null,
}
const DEFAULT_CONTEXT_USAGE = {
	usedTokens: 0,
	limitTokens: 200000,
	thresholdTokens: 160000,
	percent: 0,
	compressed: false,
	compressedCount: 0,
}
const TYPEWRITER_INTERVAL_MS = 24
const MARKDOWN_STYLES = {
	h1: 'font-size: 34rpx; font-weight: 700; margin: 20rpx 0 12rpx; line-height: 1.45;',
	h2: 'font-size: 31rpx; font-weight: 700; margin: 18rpx 0 12rpx; line-height: 1.45;',
	h3: 'font-size: 29rpx; font-weight: 700; margin: 16rpx 0 10rpx; line-height: 1.45;',
	p: 'margin: 0 0 14rpx; line-height: 1.8;',
	ul: 'margin: 0 0 14rpx; padding-left: 30rpx;',
	ol: 'margin: 0 0 14rpx; padding-left: 34rpx;',
	li: 'margin: 0 0 8rpx; line-height: 1.8;',
	blockquote: 'margin: 0 0 14rpx; padding: 8rpx 0 8rpx 18rpx; border-left: 6rpx solid rgba(125, 125, 125, 0.25); color: #8a847a; line-height: 1.8;',
	pre: 'margin: 0 0 14rpx; padding: 18rpx 20rpx; border-radius: 16rpx; background: rgba(24, 24, 24, 0.92); color: #f5f0e6; overflow-x: auto; white-space: pre-wrap; line-height: 1.7;',
	code: 'padding: 2rpx 8rpx; border-radius: 8rpx; background: rgba(0, 0, 0, 0.06); font-family: monospace;',
	hr: 'margin: 18rpx 0; border: none; border-top: 1rpx solid rgba(120, 120, 120, 0.18);',
	a: 'color: #b66a16; text-decoration: underline;',
	table: 'width: 100%; margin: 0 0 16rpx; border-collapse: collapse; table-layout: fixed; overflow-wrap: anywhere;',
	th: 'padding: 10rpx 12rpx; border: 1rpx solid rgba(150, 118, 70, 0.26); background: rgba(207, 169, 96, 0.14); font-weight: 700; line-height: 1.6; word-break: break-word; vertical-align: top;',
	td: 'padding: 10rpx 12rpx; border: 1rpx solid rgba(150, 118, 70, 0.22); line-height: 1.6; word-break: break-word; vertical-align: top;',
}

function escapeHtml(text) {
	return String(text || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

function escapeAttribute(text) {
	return escapeHtml(text).replace(/`/g, '&#96;')
}

function renderInlineMarkdown(rawText) {
	let text = escapeHtml(rawText)
	const codeTokens = []

	text = text.replace(/`([^`\n]+)`/g, function (match, codeContent) {
		const token = '@@INLINECODE' + codeTokens.length + '@@'
		codeTokens.push('<code style="' + MARKDOWN_STYLES.code + '">' + escapeHtml(codeContent) + '</code>')
		return token
	})

	text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (match, label, url) {
		return '<a href="' + escapeAttribute(url) + '" style="' + MARKDOWN_STYLES.a + '">' + renderInlineMarkdown(label) + '</a>'
	})
	text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
	text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>')
	text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
	text = text.replace(/_([^_\n]+)_/g, '<em>$1</em>')
	text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>')

	codeTokens.forEach(function (tokenHtml, index) {
		text = text.split('@@INLINECODE' + index + '@@').join(tokenHtml)
	})

	return text
}

function renderParagraph(lines) {
	const content = lines.map(function (line) {
		return renderInlineMarkdown(line)
	}).join('<br/>')
	if (!content.trim()) {
		return ''
	}
	return '<p style="' + MARKDOWN_STYLES.p + '">' + content + '</p>'
}

function splitMarkdownTableRow(line) {
	let source = String(line || '').trim()
	if (!source || source.indexOf('|') === -1) {
		return []
	}
	if (source.startsWith('|')) {
		source = source.slice(1)
	}
	if (source.endsWith('|')) {
		source = source.slice(0, -1)
	}

	const cells = []
	let cell = ''
	let escaping = false
	for (let index = 0; index < source.length; index += 1) {
		const char = source[index]
		if (char === '\\' && !escaping) {
			escaping = true
			cell += char
			continue
		}
		if (char === '|' && !escaping) {
			cells.push(cell.trim().replace(/\\\|/g, '|'))
			cell = ''
			continue
		}
		escaping = false
		cell += char
	}
	cells.push(cell.trim().replace(/\\\|/g, '|'))
	return cells
}

function isMarkdownTableRow(line) {
	return splitMarkdownTableRow(line).length >= 2
}

function isMarkdownTableSeparator(line) {
	const cells = splitMarkdownTableRow(line)
	return cells.length >= 2 && cells.every(function (cell) {
		return /^:?-{3,}:?$/.test(String(cell || '').replace(/\s+/g, ''))
	})
}

function getMarkdownTableAlignments(separatorLine) {
	return splitMarkdownTableRow(separatorLine).map(function (cell) {
		const value = String(cell || '').replace(/\s+/g, '')
		if (/^:-+:$/.test(value)) {
			return 'center'
		}
		if (/^-+:$/.test(value)) {
			return 'right'
		}
		return 'left'
	})
}

function renderMarkdownTable(headerCells, alignments, bodyRows) {
	const columnCount = headerCells.length
	const safeAlignments = alignments.length > 0 ? alignments : headerCells.map(function () { return 'left' })
	const headerHtml = headerCells.map(function (cell, index) {
		const align = safeAlignments[index] || 'left'
		return '<th style="' + MARKDOWN_STYLES.th + ' text-align: ' + align + ';">' + renderInlineMarkdown(cell) + '</th>'
	}).join('')
	const bodyHtml = bodyRows.map(function (row) {
		const cells = row.slice(0, columnCount)
		while (cells.length < columnCount) {
			cells.push('')
		}
		return '<tr>' + cells.map(function (cell, index) {
			const align = safeAlignments[index] || 'left'
			return '<td style="' + MARKDOWN_STYLES.td + ' text-align: ' + align + ';">' + renderInlineMarkdown(cell) + '</td>'
		}).join('') + '</tr>'
	}).join('')
	return '<table style="' + MARKDOWN_STYLES.table + '"><thead><tr>' + headerHtml + '</tr></thead><tbody>' + bodyHtml + '</tbody></table>'
}

function renderMarkdownToHtml(markdownText) {
	const source = String(markdownText || '').replace(/\r\n/g, '\n')
	if (!source.trim()) {
		return ''
	}

	const lines = source.split('\n')
	const htmlParts = []
	let paragraphLines = []
	let listType = ''
	let listItems = []
	let inCodeBlock = false
	let codeLines = []

	function flushParagraph() {
		if (paragraphLines.length === 0) {
			return
		}
		const html = renderParagraph(paragraphLines)
		if (html) {
			htmlParts.push(html)
		}
		paragraphLines = []
	}

	function flushList() {
		if (!listType || listItems.length === 0) {
			listType = ''
			listItems = []
			return
		}
		const listStyle = listType === 'ol' ? MARKDOWN_STYLES.ol : MARKDOWN_STYLES.ul
		htmlParts.push(
			'<' + listType + ' style="' + listStyle + '">' +
				listItems
					.map(function (item) {
						return '<li style="' + MARKDOWN_STYLES.li + '">' + renderInlineMarkdown(item) + '</li>'
					})
					.join('') +
			'</' + listType + '>'
		)
		listType = ''
		listItems = []
	}

	function flushCodeBlock() {
		if (!inCodeBlock) {
			return
		}
		htmlParts.push(
			'<pre style="' + MARKDOWN_STYLES.pre + '"><code>' +
				escapeHtml(codeLines.join('\n')) +
			'</code></pre>'
		)
		inCodeBlock = false
		codeLines = []
	}

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex]
		const trimmed = line.trim()

		if (trimmed.startsWith('```')) {
			flushParagraph()
			flushList()
			if (inCodeBlock) {
				flushCodeBlock()
			} else {
				inCodeBlock = true
				codeLines = []
			}
			continue
		}

		if (inCodeBlock) {
			codeLines.push(line)
			continue
		}

		if (!trimmed) {
			flushParagraph()
			flushList()
			continue
		}

		if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
			flushParagraph()
			flushList()
			htmlParts.push('<hr style="' + MARKDOWN_STYLES.hr + '" />')
			continue
		}

		const nextLine = lines[lineIndex + 1] || ''
		if (isMarkdownTableRow(trimmed) && isMarkdownTableSeparator(nextLine)) {
			flushParagraph()
			flushList()
			const headerCells = splitMarkdownTableRow(trimmed)
			const alignments = getMarkdownTableAlignments(nextLine)
			const bodyRows = []
			lineIndex += 2
			while (lineIndex < lines.length) {
				const tableLine = lines[lineIndex]
				const tableTrimmed = tableLine.trim()
				if (!tableTrimmed || !isMarkdownTableRow(tableTrimmed) || isMarkdownTableSeparator(tableTrimmed)) {
					lineIndex -= 1
					break
				}
				bodyRows.push(splitMarkdownTableRow(tableLine))
				lineIndex += 1
			}
			htmlParts.push(renderMarkdownTable(headerCells, alignments, bodyRows))
			continue
		}

		const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/)
		if (headingMatch) {
			flushParagraph()
			flushList()
			const level = headingMatch[1].length
			const tag = 'h' + level
			const style = MARKDOWN_STYLES[tag]
			htmlParts.push('<' + tag + ' style="' + style + '">' + renderInlineMarkdown(headingMatch[2]) + '</' + tag + '>')
			continue
		}

		const quoteMatch = trimmed.match(/^>\s?(.*)$/)
		if (quoteMatch) {
			flushParagraph()
			flushList()
			htmlParts.push('<blockquote style="' + MARKDOWN_STYLES.blockquote + '">' + renderInlineMarkdown(quoteMatch[1]) + '</blockquote>')
			continue
		}

		const unorderedMatch = trimmed.match(/^[-*+]\s+(.*)$/)
		if (unorderedMatch) {
			flushParagraph()
			if (listType && listType !== 'ul') {
				flushList()
			}
			listType = 'ul'
			listItems.push(unorderedMatch[1])
			continue
		}

		const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/)
		if (orderedMatch) {
			flushParagraph()
			if (listType && listType !== 'ol') {
				flushList()
			}
			listType = 'ol'
			listItems.push(orderedMatch[1])
			continue
		}

		if (listType) {
			flushList()
		}

		paragraphLines.push(trimmed)
	}

	flushParagraph()
	flushList()
	flushCodeBlock()

	return htmlParts.join('')
}

function createSessionId() {
	return 'session-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

function normalizeCitationId(rawId) {
	const value = String(rawId || '').trim()
	if (!value) {
		return ''
	}

	const directMatch = value.match(/^a(\d+)(?:p(\d+))?$/i)
	if (directMatch) {
		return 'a' + Number(directMatch[1]) + (directMatch[2] ? 'p' + Number(directMatch[2]) : '')
	}

	const citationIdMatch = value.match(/(?:^|[\s,;&?])citation_id\s*[:=]\s*([a-zA-Z0-9_-]+)/i)
	if (citationIdMatch) {
		return normalizeCitationId(citationIdMatch[1])
	}

	const articleMatch = value.match(/(?:^|[\s,;&?])article_id\s*[:=]\s*(\d+)/i)
		|| value.match(/^article[_-]?(\d+)$/i)
	const paragraphMatch = value.match(/(?:^|[\s,;&?])paragraph_id\s*[:=]\s*(\d+)/i)
		|| value.match(/(?:^|[\s,;&?])paragraph\s*[:=]\s*(\d+)/i)
		|| value.match(/(?:^|[\s,;&?])p\s*[:=]\s*(\d+)/i)
	if (articleMatch) {
		return 'a' + Number(articleMatch[1]) + (paragraphMatch ? 'p' + Number(paragraphMatch[1]) : '')
	}

	if (/^\d+$/.test(value)) {
		return 'a' + Number(value)
	}

	return value.replace(/[^\w-]/g, '')
}

function normalizeCitationMarkerText(text) {
	return String(text || '').replace(/\[\[cite:([^\]]+)\]\]/g, function (match, rawId) {
		const citationId = normalizeCitationId(rawId)
		return citationId ? '[[cite:' + citationId + ']]' : ''
	})
}

function stripCitationMarkers(text) {
	return normalizeCitationMarkerText(text).replace(/\[\[cite:[^\]]+\]\]/g, '').replace(/\s+/g, ' ').trim()
}

function createDefaultContextUsage() {
	return {
		...DEFAULT_CONTEXT_USAGE,
	}
}

function normalizeConversationPayloadMessages(rawMessages) {
	return (Array.isArray(rawMessages) ? rawMessages : [])
		.filter((message) => message && typeof message === 'object')
		.map((message) => ({
			role: message.role === 'assistant' ? 'assistant' : 'user',
			content: normalizeCitationMarkerText(message.content).replace(/\[\[cite:[^\]]+\]\]/g, '').trim(),
		}))
		.filter((message) => String(message.content || '').trim())
}

function normalizePendingReplyTask(rawTask) {
	if (!rawTask || typeof rawTask !== 'object') {
		return null
	}

	const taskId = String(rawTask.taskId || rawTask.task_id || '').trim()
	const sessionId = String(rawTask.sessionId || rawTask.session_id || '').trim()
	const messageId = String(rawTask.messageId || rawTask.message_id || '').trim()
	if (!taskId || !messageId) {
		return null
	}

	const lastEventId = Number(rawTask.lastEventId || rawTask.last_event_id || 0)
	const novelId = Number(rawTask.novelId || rawTask.novel_id || 0)
	return {
		taskId,
		sessionId,
		messageId,
		novelId: Number.isFinite(novelId) && novelId > 0 ? novelId : 0,
		lastEventId: Number.isFinite(lastEventId) && lastEventId > 0 ? Math.floor(lastEventId) : 0,
		status: String(rawTask.status || 'running') === 'error' ? 'error' : (String(rawTask.status || 'running') === 'completed' ? 'completed' : 'running'),
		createdAt: Number(rawTask.createdAt || rawTask.created_at || Date.now()),
	}
}

function createPendingReplyTask(options = {}) {
	return normalizePendingReplyTask({
		taskId: options.taskId || '',
		sessionId: options.sessionId || '',
		messageId: options.messageId || '',
		novelId: options.novelId || 0,
		lastEventId: options.lastEventId || 0,
		status: options.status || 'running',
		createdAt: options.createdAt || Date.now(),
	})
}

function createAbortError() {
	const error = new Error('The operation was aborted.')
	error.name = 'AbortError'
	return error
}

function getContextUsageRawValue(source, camelKey, snakeKey, fallbackValue) {
	if (source && source[camelKey] !== undefined && source[camelKey] !== null) {
		return source[camelKey]
	}
	if (source && source[snakeKey] !== undefined && source[snakeKey] !== null) {
		return source[snakeKey]
	}
	return fallbackValue
}

function normalizeContextUsage(rawUsage, fallbackUsage) {
	const source = rawUsage && typeof rawUsage === 'object' ? rawUsage : {}
	const fallback = fallbackUsage && typeof fallbackUsage === 'object'
		? fallbackUsage
		: createDefaultContextUsage()
	const fallbackLimitTokens = Number(fallback.limitTokens || DEFAULT_CONTEXT_USAGE.limitTokens)
	const rawLimitTokens = Number(getContextUsageRawValue(source, 'limitTokens', 'limit_tokens', fallbackLimitTokens))
	const limitTokens = Number.isFinite(rawLimitTokens) && rawLimitTokens > 0
		? rawLimitTokens
		: DEFAULT_CONTEXT_USAGE.limitTokens
	const rawUsedTokens = Number(getContextUsageRawValue(source, 'usedTokens', 'used_tokens', fallback.usedTokens || 0))
	const usedTokens = Number.isFinite(rawUsedTokens) && rawUsedTokens >= 0 ? rawUsedTokens : 0
	const rawThresholdTokens = Number(getContextUsageRawValue(source, 'thresholdTokens', 'threshold_tokens', fallback.thresholdTokens || 0))
	const thresholdTokens = Number.isFinite(rawThresholdTokens) && rawThresholdTokens > 0
		? rawThresholdTokens
		: Math.round(limitTokens * 0.8)
	const rawPercent = Number(getContextUsageRawValue(source, 'percent', 'percent', fallback.percent))
	const computedPercent = limitTokens > 0 ? Math.round((usedTokens / limitTokens) * 100) : 0
	const percent = Number.isFinite(rawPercent)
		? Math.max(0, Math.min(100, rawPercent))
		: Math.max(0, Math.min(100, computedPercent))
	const rawCompressedCount = Number(getContextUsageRawValue(source, 'compressedCount', 'compressed_count', fallback.compressedCount || 0))
	const hasCompressedValue = source.compressed !== undefined && source.compressed !== null
	return {
		usedTokens,
		limitTokens,
		thresholdTokens,
		percent,
		compressed: hasCompressedValue ? source.compressed === true || source.compressed === 'true' : fallback.compressed === true,
		compressedCount: Number.isFinite(rawCompressedCount) && rawCompressedCount > 0 ? rawCompressedCount : 0,
	}
}

function createDefaultNovelIndexStatus() {
	return {
		...DEFAULT_NOVEL_INDEX_STATUS,
	}
}

function getNovelIndexRawValue(source, camelKey, snakeKey, fallbackValue) {
	if (source && source[camelKey] !== undefined && source[camelKey] !== null) {
		return source[camelKey]
	}
	if (source && source[snakeKey] !== undefined && source[snakeKey] !== null) {
		return source[snakeKey]
	}
	return fallbackValue
}

function normalizeNovelIndexStatus(rawStatus, fallbackStatus) {
	const source = rawStatus && typeof rawStatus === 'object' ? rawStatus : {}
	const fallback = fallbackStatus && typeof fallbackStatus === 'object'
		? fallbackStatus
		: createDefaultNovelIndexStatus()
	const totalChapters = Number(getNovelIndexRawValue(source, 'totalChapters', 'total_chapters', fallback.totalChapters || 0))
	const indexedChapters = Number(getNovelIndexRawValue(source, 'indexedChapters', 'indexed_chapters', fallback.indexedChapters || 0))
	const indexedSummaryChapters = Number(getNovelIndexRawValue(source, 'indexedSummaryChapters', 'indexed_summary_chapters', fallback.indexedSummaryChapters || 0))
	const pendingSummaryChapters = Number(getNovelIndexRawValue(source, 'pendingSummaryChapters', 'pending_summary_chapters', fallback.pendingSummaryChapters || 0))
	const rawPercent = Number(getNovelIndexRawValue(source, 'percent', 'percent', fallback.percent || 0))
	const safeTotalChapters = Number.isFinite(totalChapters) && totalChapters > 0 ? totalChapters : 0
	const safeIndexedSummaryChapters = Number.isFinite(indexedSummaryChapters) && indexedSummaryChapters > 0 ? indexedSummaryChapters : 0
	const computedPercent = safeTotalChapters > 0
		? Math.round((safeIndexedSummaryChapters / safeTotalChapters) * 100)
		: 0
	const queue = source.queue && typeof source.queue === 'object'
		? source.queue
		: (fallback.queue || null)
	return {
		loading: source.loading === true,
		loaded: source.loaded === true || fallback.loaded === true,
		error: String(source.error || ''),
		totalChapters: safeTotalChapters,
		indexedChapters: Number.isFinite(indexedChapters) && indexedChapters > 0 ? indexedChapters : 0,
		indexedSummaryChapters: safeIndexedSummaryChapters,
		pendingSummaryChapters: Number.isFinite(pendingSummaryChapters) && pendingSummaryChapters > 0
			? pendingSummaryChapters
			: Math.max(0, safeTotalChapters - safeIndexedSummaryChapters),
		percent: Number.isFinite(rawPercent)
			? Math.max(0, Math.min(100, Math.round(rawPercent)))
			: Math.max(0, Math.min(100, computedPercent)),
		queueStatus: String(source.queueStatus || source.queue_status || fallback.queueStatus || ''),
		queue,
	}
}

export default {
	mixins: [darkModeMixin],
	data() {
		return {
			novelId: 0,
			novelName: '',
			currentSessionId: '',
			draft: '',
			loading: false,
			statusText: '',
			streamErrorMessage: '',
			historyPanelVisible: false,
			historyKeyword: '',
			chatHistoryStore: {
				version: 2,
				books: [],
			},
			scrollAnchorId: SCROLL_ANCHOR_ID,
			thinkingHintIndex: 0,
			thinkingHintTimer: null,
			nextMessageId: 1,
			abortController: null,
			contextUsageTooltipVisible: false,
			contextUsageTooltipStyle: {},
			contextUsageTooltipArrowStyle: {},
			indexStatusTooltipVisible: false,
			indexStatusTooltipStyle: {},
			indexStatusTooltipArrowStyle: {},
			contextUsage: createDefaultContextUsage(),
			novelIndexStatus: createDefaultNovelIndexStatus(),
			messages: [],
			swipedSessionId: null,
			touchStartX: 0,
			activeReplyTask: null,
			typewriterTimers: {},
			resumeTaskInProgress: false,
		}
	},
	computed: {
		canSend() {
			return !!String(this.draft || '').trim() && !this.loading
		},
		currentSessionTitle() {
			const session = this.getCurrentSession()
			return session && session.title ? session.title : '新会话'
		},
		historyBookGroups() {
			return this.getFilteredHistoryBooks()
		},
		contextUsagePercent() {
			const percent = Number(this.contextUsage && this.contextUsage.percent)
			if (Number.isFinite(percent)) {
				return Math.max(0, Math.min(100, Math.round(percent)))
			}
			const usedTokens = Number(this.contextUsage && this.contextUsage.usedTokens)
			const limitTokens = Number(this.contextUsage && this.contextUsage.limitTokens)
			if (!Number.isFinite(usedTokens) || !Number.isFinite(limitTokens) || limitTokens <= 0) {
				return 0
			}
			return Math.max(0, Math.min(100, Math.round((usedTokens / limitTokens) * 100)))
		},
		contextUsageRingStyle() {
			const degree = Math.round(this.contextUsagePercent * 3.6)
			const activeColor = this.contextUsagePercent >= 80 ? '#c55f22' : '#cf8a25'
			return {
				background: `conic-gradient(${activeColor} 0deg ${degree}deg, rgba(207, 169, 96, 0.18) ${degree}deg 360deg)`,
			}
		},
		novelIndexPercent() {
			const percent = Number(this.novelIndexStatus && this.novelIndexStatus.percent)
			if (Number.isFinite(percent)) {
				return Math.max(0, Math.min(100, Math.round(percent)))
			}
			return 0
		},
		novelIndexWaterStyle() {
			return {
				height: this.novelIndexPercent + '%',
			}
		},
		novelIndexStatusText() {
			if (this.novelIndexStatus.loading && !this.novelIndexStatus.loaded) {
				return '正在读取索引情况'
			}
			if (this.novelIndexStatus.error) {
				return this.novelIndexStatus.error
			}
			const indexed = Number(this.novelIndexStatus.indexedSummaryChapters || 0)
			const total = Number(this.novelIndexStatus.totalChapters || 0)
			if (!total) {
				return '暂无可索引章节'
			}
			return '已索引摘要 ' + indexed + ' / ' + total + ' 章'
		},
		currentThinkingHintText() {
			return THINKING_HINT_TEXTS[this.thinkingHintIndex % THINKING_HINT_TEXTS.length] || THINKING_HINT_TEXTS[0]
		}
	},
	onLoad(option) {
		this.novelId = Number(option.novel_id || 0)
		this.novelName = option.novel_name ? decodeURIComponent(option.novel_name) : ''
		this.initializeConversation(option.session_id || '')
		this.startThinkingHintRotation()
		this.loadNovelIndexStatus()
		this.resumePendingReplyIfNeeded()
	},
	onShow() {
		this.resumePendingReplyIfNeeded()
	},
	onHide() {
		this.persistConversation()
		this.abortActiveRequest()
	},
	onUnload() {
		this.persistConversation()
		this.abortActiveRequest()
		this.stopAllTypewriters()
		this.stopThinkingHintRotation()
	},
	beforeDestroy() {
		this.stopAllTypewriters()
		this.stopThinkingHintRotation()
	},
	methods: {
		startThinkingHintRotation() {
			this.stopThinkingHintRotation()
			this.thinkingHintTimer = setInterval(() => {
				this.thinkingHintIndex = (this.thinkingHintIndex + 1) % THINKING_HINT_TEXTS.length
			}, 5000)
		},
		stopThinkingHintRotation() {
			if (this.thinkingHintTimer) {
				clearInterval(this.thinkingHintTimer)
				this.thinkingHintTimer = null
			}
		},
		getStorageKey() {
			return HISTORY_STORAGE_KEY
		},
		getLegacyStorageKey(novelId = this.novelId) {
			return LEGACY_STORAGE_KEY_PREFIX + String(novelId || 0)
		},
		normalizeStoredCitations(rawCitations) {
			return (Array.isArray(rawCitations) ? rawCitations : [])
				.filter((item) => item && typeof item === 'object' && Number(item.article_id))
				.map((item, index) => {
					const rawCitationId = String(item.citation_id || ('citation-' + index))
					return {
						citation_id: normalizeCitationId(rawCitationId) || rawCitationId,
						article_id: Number(item.article_id),
						chapter: item.chapter === null || item.chapter === undefined ? null : Number(item.chapter),
						title: String(item.title || ''),
						paragraph_id: item.paragraph_id === null || item.paragraph_id === undefined || item.paragraph_id === ''
							? null
							: Number(item.paragraph_id),
						snippet: String(item.snippet || ''),
						source: String(item.source || ''),
						displayIndex: Number(item.displayIndex || item.display_index || (index + 1)),
					}
				})
		},
		buildCitationDisplayMap(citations) {
			const map = {}
			this.normalizeStoredCitations(citations).forEach((item, index) => {
				const displayIndex = Number(item.displayIndex || (index + 1))
				const targetCitationId = String(item.citation_id || '')
				const articleId = Number(item.article_id || 0)
				const paragraphId = Number(item.paragraph_id || 0)
				const setMapValue = (key) => {
					const normalizedKey = normalizeCitationId(key)
					if (!normalizedKey || map[normalizedKey]) {
						return
					}
					map[normalizedKey] = {
						citationId: targetCitationId,
						displayIndex,
					}
				}
				setMapValue(targetCitationId)
				if (articleId) {
					setMapValue('a' + articleId)
					if (paragraphId > 0) {
						setMapValue('a' + articleId + 'p' + paragraphId)
					}
				}
			})
			return map
		},
		renderAssistantMarkdown(message) {
			const content = normalizeCitationMarkerText(
				typeof message === 'string' ? message : String(this.getVisibleMessageContent(message) || '')
			)
			const citationMap = this.buildCitationDisplayMap(message && message.citations)
			const citationTokens = []
			let normalizedContent = content.replace(/\[\[cite:([^\]]+)\]\]/g, (match, citationId) => {
				const normalizedCitationId = normalizeCitationId(citationId)
				const citationEntry = citationMap[normalizedCitationId]
				const displayIndex = citationEntry && typeof citationEntry === 'object'
					? Number(citationEntry.displayIndex || 0)
					: Number(citationEntry || 0)
				if (!displayIndex) {
					return ''
				}
				const targetCitationId = citationEntry && typeof citationEntry === 'object'
					? String(citationEntry.citationId || normalizedCitationId)
					: normalizedCitationId
				const token = '@@CITATIONTOKEN' + citationTokens.length + '@@'
				citationTokens.push(
					'<a href="citation://' + escapeAttribute(targetCitationId)
					+ '" style="display:inline-block; margin: 0 4rpx; font-size: 22rpx; color: #a46d25; text-decoration: underline;">['
					+ displayIndex
					+ ']</a>'
				)
				return token
			})
			let html = renderMarkdownToHtml(normalizedContent)
			citationTokens.forEach((tokenHtml, index) => {
				html = html.split('@@CITATIONTOKEN' + index + '@@').join(tokenHtml)
			})
			return html
		},
		buildWelcomeMessage() {
			const title = this.novelName ? `《${this.novelName}》` : '这本作品'
			return `我是原木娘，你可以直接问我关于${title}的剧情、角色、章节细节、设定和读者评价。`
		},
		createInitialMessages() {
			return this.normalizeStoredMessages([
				{
					id: 'msg-1',
					role: 'assistant',
					content: this.buildWelcomeMessage(),
					thinkingSteps: [],
				},
			])
		},
		createMessage(role, content, extra = {}) {
			const message = {
				id: 'msg-' + this.nextMessageId,
				role: role === 'user' ? 'user' : 'assistant',
				content: String(content || ''),
				displayContent: role === 'assistant'
					? String(extra.displayContent !== undefined ? extra.displayContent : (content || ''))
					: String(content || ''),
				thinkingSteps: Array.isArray(extra.thinkingSteps) ? extra.thinkingSteps.slice(-80) : [],
				citations: this.normalizeStoredCitations(extra.citations),
				currentThinkingText: String(extra.currentThinkingText || ''),
				thinkingExpanded: extra.thinkingExpanded === true,
			}
			this.nextMessageId += 1
			return message
		},
		createSessionRecord(options = {}) {
			const createdAt = Number(options.createdAt || Date.now())
			const messages = this.normalizeStoredMessages(options.messages)
			return {
				sessionId: String(options.sessionId || createSessionId()),
				title: String(options.title || this.buildSessionTitleFromMessages(messages, createdAt)),
				createdAt,
				updatedAt: Number(options.updatedAt || createdAt),
				contextUsage: normalizeContextUsage(options.contextUsage),
				pendingTask: normalizePendingReplyTask(options.pendingTask),
				messages,
			}
		},
		normalizeStoredMessages(rawMessages) {
			return (Array.isArray(rawMessages) ? rawMessages : [])
				.filter((message) => message && typeof message === 'object')
				.map((message, index) => ({
					id: typeof message.id === 'string' && message.id ? message.id : 'msg-' + (index + 1),
					role: message.role === 'user' ? 'user' : 'assistant',
					content: String(message.content || ''),
					displayContent: message.role === 'assistant'
						? String(message.displayContent !== undefined ? message.displayContent : (message.display_content !== undefined ? message.display_content : (message.content || '')))
						: String(message.content || ''),
					thinkingSteps: Array.isArray(message.thinkingSteps)
						? message.thinkingSteps.map((item) => String(item || '')).filter(Boolean).slice(-80)
						: [],
					citations: this.normalizeStoredCitations(message.citations),
					currentThinkingText: String(message.currentThinkingText || message.current_thinking_text || ''),
					thinkingExpanded: message.thinkingExpanded === true,
				}))
				.filter((message) => {
					return message.role === 'user'
						|| String(message.content || '').trim()
						|| String(message.displayContent || '').trim()
						|| String(message.currentThinkingText || '').trim()
						|| message.thinkingExpanded === true
						|| (this.activeReplyTask && String(this.activeReplyTask.messageId || '') === String(message.id || ''))
						|| (message.thinkingSteps && message.thinkingSteps.length > 0)
				})
		},
		normalizeSessionRecord(rawSession, index = 0) {
			const messages = this.normalizeStoredMessages(rawSession && rawSession.messages)
			const createdAt = Number((rawSession && rawSession.createdAt) || (rawSession && rawSession.updatedAt) || Date.now())
			return {
				sessionId: String((rawSession && rawSession.sessionId) || ('session-' + index + '-' + createdAt)),
				title: String((rawSession && rawSession.title) || this.buildSessionTitleFromMessages(messages, createdAt)),
				createdAt,
				updatedAt: Number((rawSession && rawSession.updatedAt) || createdAt),
				contextUsage: normalizeContextUsage(rawSession && rawSession.contextUsage),
				pendingTask: normalizePendingReplyTask(rawSession && rawSession.pendingTask),
				messages,
			}
		},
		normalizeHistoryStore(rawStore) {
			const books = (rawStore && Array.isArray(rawStore.books) ? rawStore.books : [])
				.map((book, index) => {
					const novelId = Number(book && book.novelId)
					if (!novelId) {
						return null
					}
					const sessions = (Array.isArray(book.sessions) ? book.sessions : [])
						.map((session, sessionIndex) => this.normalizeSessionRecord(session, sessionIndex))
						.filter((session) => session.messages.length > 0)
						.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
					if (sessions.length === 0) {
						return null
					}
					const updatedAt = Number(book.updatedAt || sessions[0].updatedAt || Date.now())
					const lastSessionId = sessions.some((session) => session.sessionId === book.lastSessionId)
						? String(book.lastSessionId)
						: sessions[0].sessionId
					return {
						novelId,
						novelName: String(book.novelName || ''),
						updatedAt,
						lastSessionId,
						sessions,
					}
				})
				.filter(Boolean)
				.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))

			return {
				version: 2,
				books,
			}
		},
		buildSessionTitleFromMessages(messages, fallbackTimestamp = Date.now()) {
			const firstUserMessage = (Array.isArray(messages) ? messages : []).find((message) => {
				return message.role === 'user' && String(message.content || '').trim()
			})
			if (firstUserMessage) {
				const content = stripCitationMarkers(firstUserMessage.content)
				return content.length > 18 ? content.slice(0, 18) + '...' : content
			}
			return '新会话 ' + this.formatHistoryTime(fallbackTimestamp)
		},
		getSessionPreview(messages) {
			const sourceMessages = Array.isArray(messages) ? messages : []
			const lastUserMessage = [...sourceMessages].reverse().find((message) => {
				return message.role === 'user' && String(message.content || '').trim()
			})
			const lastAssistantMessage = [...sourceMessages].reverse().find((message) => {
				return message.role === 'assistant' && String(message.content || '').trim()
			})
			const content = String(
				(lastUserMessage && lastUserMessage.content)
				|| (lastAssistantMessage && lastAssistantMessage.content)
				|| ''
			)
			const normalizedContent = stripCitationMarkers(content)
			if (!normalizedContent) {
				return ''
			}
			return normalizedContent.length > 34 ? normalizedContent.slice(0, 34) + '...' : normalizedContent
		},
		computeNextMessageId(messages) {
			let maxId = 0
			;(Array.isArray(messages) ? messages : []).forEach((message) => {
				const match = String(message.id || '').match(/msg-(\d+)/)
				const numericId = match ? Number(match[1]) : 0
				if (numericId > maxId) {
					maxId = numericId
				}
			})
			this.nextMessageId = maxId + 1
		},
		getSortedHistoryBooks() {
			return (Array.isArray(this.chatHistoryStore.books) ? this.chatHistoryStore.books : [])
				.map((book) => ({
					novelId: Number(book.novelId),
					novelName: book.novelName || '',
					updatedAt: Number(book.updatedAt || 0),
					sessions: (Array.isArray(book.sessions) ? book.sessions : [])
						.slice()
						.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
						.map((session) => ({
							...session,
							preview: this.getSessionPreview(session.messages),
						})),
				}))
				.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
		},
		getFilteredHistoryBooks() {
			const currentNovelId = Number(this.novelId)
			const books = this.getSortedHistoryBooks().filter((book) => Number(book.novelId) === currentNovelId)
			const keyword = String(this.historyKeyword || '').trim().toLowerCase()
			if (!keyword) {
				return books
			}
			return books
				.map((book) => {
					const sessions = (Array.isArray(book.sessions) ? book.sessions : []).filter((session) => {
						return this.buildSessionSearchText(session).includes(keyword)
					})
					if (sessions.length === 0) {
						return null
					}
					return {
						...book,
						sessions,
					}
				})
				.filter(Boolean)
		},
		buildSessionSearchText(session) {
			const messages = Array.isArray(session && session.messages) ? session.messages : []
			const contents = messages
				.filter((message, index) => {
					return message && (message.role === 'user' || index > 0)
				})
				.map((message) => stripCitationMarkers(message.content))
				.filter(Boolean)
			return [
				stripCitationMarkers((session && session.title) || ''),
				stripCitationMarkers((session && session.preview) || ''),
				...contents,
			].join('\n').toLowerCase()
		},
		formatHistoryTime(timestamp) {
			const time = Number(timestamp || 0)
			if (!time) {
				return ''
			}
			const date = new Date(time)
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hour = String(date.getHours()).padStart(2, '0')
			const minute = String(date.getMinutes()).padStart(2, '0')
			return month + '-' + day + ' ' + hour + ':' + minute
		},
		loadHistoryStore() {
			const rawValue = uni.getStorageSync(this.getStorageKey())
			try {
				this.chatHistoryStore = this.normalizeHistoryStore(
					rawValue ? JSON.parse(rawValue) : { version: 2, books: [] }
				)
			} catch (error) {
				this.chatHistoryStore = this.normalizeHistoryStore({ version: 2, books: [] })
			}
		},
		persistHistoryStore() {
			this.chatHistoryStore = this.normalizeHistoryStore(this.chatHistoryStore)
			uni.setStorageSync(this.getStorageKey(), JSON.stringify(this.chatHistoryStore))
		},
		findBookGroup(novelId = this.novelId) {
			return (this.chatHistoryStore.books || []).find((book) => Number(book.novelId) === Number(novelId)) || null
		},
		ensureCurrentBookGroup() {
			let bookGroup = this.findBookGroup(this.novelId)
			if (!bookGroup) {
				bookGroup = {
					novelId: Number(this.novelId),
					novelName: this.novelName || '',
					updatedAt: Date.now(),
					lastSessionId: '',
					sessions: [],
				}
				this.chatHistoryStore.books.push(bookGroup)
			}
			if (this.novelName) {
				bookGroup.novelName = this.novelName
			}
			return bookGroup
		},
		getCurrentSession() {
			const bookGroup = this.findBookGroup(this.novelId)
			if (!bookGroup) {
				return null
			}
			return (bookGroup.sessions || []).find((session) => session.sessionId === this.currentSessionId) || null
		},
		setCurrentSession(session, options = {}) {
			if (!session) {
				return
			}
			this.stopAllTypewriters()
			this.currentSessionId = String(session.sessionId || '')
			this.messages = this.normalizeStoredMessages(session.messages)
			this.contextUsage = normalizeContextUsage(session.contextUsage)
			this.activeReplyTask = normalizePendingReplyTask(session.pendingTask)
			this.contextUsageTooltipVisible = false
			this.statusText = ''
			this.streamErrorMessage = ''
			this.loading = !!(this.activeReplyTask && this.activeReplyTask.status === 'running')
			if (!this.loading) {
				this.messages.forEach((message) => {
					if (message.role === 'assistant') {
						message.displayContent = String(message.content || '')
					}
				})
			}
			this.computeNextMessageId(this.messages)
			const bookGroup = this.ensureCurrentBookGroup()
			bookGroup.lastSessionId = this.currentSessionId
			bookGroup.updatedAt = Number(session.updatedAt || Date.now())
			this.persistHistoryStore()
			this.scrollToBottom()
			this.resumeLocalTypewriterIfNeeded()
			if (options.closePanel !== false) {
				this.historyPanelVisible = false
			}
		},
		syncCurrentSession() {
			if (!this.novelId) {
				return
			}
			const bookGroup = this.ensureCurrentBookGroup()
			let session = (bookGroup.sessions || []).find((item) => item.sessionId === this.currentSessionId)
			const currentTime = Date.now()
			if (!session) {
				session = this.createSessionRecord({
					sessionId: this.currentSessionId || createSessionId(),
					messages: this.messages,
					createdAt: currentTime,
					updatedAt: currentTime,
				})
				bookGroup.sessions.unshift(session)
				this.currentSessionId = session.sessionId
			}
			session.messages = this.normalizeStoredMessages(this.messages)
			session.contextUsage = normalizeContextUsage(this.contextUsage, session.contextUsage)
			session.pendingTask = this.activeReplyTask && this.activeReplyTask.status === 'running'
				? normalizePendingReplyTask(this.activeReplyTask)
				: null
			session.updatedAt = currentTime
			session.title = this.buildSessionTitleFromMessages(session.messages, session.createdAt || currentTime)
			bookGroup.lastSessionId = session.sessionId
			bookGroup.updatedAt = currentTime
			bookGroup.novelName = this.novelName || bookGroup.novelName
			bookGroup.sessions.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
			this.persistHistoryStore()
		},
		persistConversation() {
			this.syncCurrentSession()
		},
		migrateLegacyConversation() {
			if (!this.novelId) {
				return
			}
			const legacyKey = this.getLegacyStorageKey(this.novelId)
			const rawValue = uni.getStorageSync(legacyKey)
			if (!rawValue || this.findBookGroup(this.novelId)) {
				return
			}
			try {
				const parsed = JSON.parse(rawValue)
				const legacyMessages = this.normalizeStoredMessages(parsed.messages)
				if (legacyMessages.length === 0) {
					uni.removeStorageSync(legacyKey)
					return
				}
				const bookGroup = this.ensureCurrentBookGroup()
				const session = this.createSessionRecord({
					messages: legacyMessages,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})
				bookGroup.sessions.unshift(session)
				bookGroup.lastSessionId = session.sessionId
				bookGroup.updatedAt = session.updatedAt
				this.persistHistoryStore()
				uni.removeStorageSync(legacyKey)
			} catch (error) {}
		},
		createNewSession(options = {}) {
			const bookGroup = this.ensureCurrentBookGroup()
			const currentTime = Date.now()
			const session = this.createSessionRecord({
				messages: this.createInitialMessages(),
				createdAt: currentTime,
				updatedAt: currentTime,
			})
			bookGroup.sessions.unshift(session)
			bookGroup.lastSessionId = session.sessionId
			bookGroup.updatedAt = currentTime
			this.currentSessionId = session.sessionId
			this.messages = this.normalizeStoredMessages(session.messages)
			this.contextUsage = normalizeContextUsage(session.contextUsage)
			this.activeReplyTask = null
			this.contextUsageTooltipVisible = false
			this.computeNextMessageId(this.messages)
			this.loading = false
			this.statusText = ''
			this.streamErrorMessage = ''
			this.persistHistoryStore()
			this.scrollToBottom()
			if (options.closePanel !== false) {
				this.historyPanelVisible = false
			}
			return session
		},
		initializeConversation(preferredSessionId = '') {
			this.loadHistoryStore()
			this.migrateLegacyConversation()
			const bookGroup = this.ensureCurrentBookGroup()
			let session = null
			if (preferredSessionId) {
				session = (bookGroup.sessions || []).find((item) => item.sessionId === String(preferredSessionId)) || null
			}
			if (!session && bookGroup.lastSessionId) {
				session = (bookGroup.sessions || []).find((item) => item.sessionId === bookGroup.lastSessionId) || null
			}
			if (!session && bookGroup.sessions && bookGroup.sessions.length > 0) {
				session = bookGroup.sessions[0]
			}
			if (session) {
				this.setCurrentSession(session, { closePanel: false })
				return
			}
			this.createNewSession({ closePanel: false })
		},
		openHistoryPanel() {
			this.historyPanelVisible = true
		},
		closeHistoryPanel() {
			this.historyPanelVisible = false
		},
		getReaderArticleUrl(articleId, paragraphId) {
			let readerProps = ''
			if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
				readerProps = uni.getStorageSync('readerProps') || ''
			} else if (typeof window !== 'undefined' && window.localStorage) {
				readerProps = window.localStorage.getItem('readerProps') || ''
			}
			const isPageReader = readerProps === 'page'
			let url = isPageReader
				? `/pages/readers/newReader/article?id=${articleId}`
				: `/pages/readers/article_rich?id=${articleId}`
			if (this.novelId) {
				url += `&novelId=${this.novelId}`
			}
			if (paragraphId !== null && paragraphId !== undefined && Number(paragraphId) > 0) {
				url += `&paragraphId=${Number(paragraphId)}`
			}
			return url
		},
		gotoCitation(citation) {
			if (!citation || !Number(citation.article_id)) {
				return
			}
			uni.navigateTo({
				url: this.getReaderArticleUrl(Number(citation.article_id), citation.paragraph_id),
			})
		},
		handleAssistantItemClick(event, message) {
			const node = event && event.detail && event.detail.node
			const attrs = node && node.attrs ? node.attrs : {}
			const href = String((attrs && attrs.href) || '').trim()
			if (!href) {
				return
			}
			if (href.indexOf('citation://') === 0) {
				const citationId = href.slice('citation://'.length)
				const citation = this.normalizeStoredCitations(message && message.citations).find((item) => {
					return String(item.citation_id || '') === citationId
				})
				if (citation) {
					this.gotoCitation(citation)
				}
				return
			}
			if (/^https?:\/\//i.test(href)) {
				if (typeof plus !== 'undefined' && plus.runtime && typeof plus.runtime.openURL === 'function') {
					plus.runtime.openURL(href)
					return
				}
				if (typeof window !== 'undefined' && typeof window.open === 'function') {
					window.open(href, '_blank')
				}
			}
		},
		getVisibleMessageContent(message) {
			if (!message) {
				return ''
			}
			if (message.role === 'assistant') {
				return String(message.displayContent !== undefined ? message.displayContent : (message.content || ''))
			}
			return String(message.content || '')
		},
		resumeLocalTypewriterIfNeeded() {
			this.messages.forEach((message) => {
				if (
					message
					&& message.role === 'assistant'
					&& String(message.displayContent || '').length < String(message.content || '').length
				) {
					this.startTypewriter(message.id)
				}
			})
		},
		stopTypewriter(messageId) {
			const timer = this.typewriterTimers && this.typewriterTimers[messageId]
			if (timer) {
				clearInterval(timer)
				delete this.typewriterTimers[messageId]
			}
		},
		stopAllTypewriters() {
			Object.keys(this.typewriterTimers || {}).forEach((messageId) => {
				this.stopTypewriter(messageId)
			})
		},
		startTypewriter(messageId) {
			const target = this.messages.find((message) => message.id === messageId)
			if (!target || target.role !== 'assistant') {
				return
			}
			if (String(target.displayContent || '').length >= String(target.content || '').length) {
				target.displayContent = String(target.content || '')
				this.stopTypewriter(messageId)
				return
			}
			if (this.typewriterTimers[messageId]) {
				return
			}

			this.typewriterTimers[messageId] = setInterval(() => {
				const currentTarget = this.messages.find((message) => message.id === messageId)
				if (!currentTarget || currentTarget.role !== 'assistant') {
					this.stopTypewriter(messageId)
					return
				}
				const fullText = String(currentTarget.content || '')
				const displayText = String(currentTarget.displayContent || '')
				if (displayText.length >= fullText.length) {
					currentTarget.displayContent = fullText
					this.stopTypewriter(messageId)
					this.persistConversation()
					return
				}
				const remaining = fullText.length - displayText.length
				const step = remaining > 160 ? 8 : remaining > 80 ? 6 : remaining > 30 ? 4 : 2
				currentTarget.displayContent = fullText.slice(0, Math.min(fullText.length, displayText.length + step))
				this.scrollToBottom()
				this.persistConversation()
				if (currentTarget.displayContent.length >= fullText.length) {
					this.stopTypewriter(messageId)
				}
			}, TYPEWRITER_INTERVAL_MS)
		},
		getTargetMessageForTask(messageId) {
			return this.messages.find((message) => message && message.id === messageId) || null
		},
		buildReplyTaskId(messageId) {
			return ['reader-ai', this.novelId, this.currentSessionId, messageId].join(':')
		},
		createActiveReplyTask(messageId) {
			return createPendingReplyTask({
				taskId: this.buildReplyTaskId(messageId),
				sessionId: this.currentSessionId,
				messageId,
				novelId: this.novelId,
				status: 'running',
				lastEventId: 0,
				createdAt: Date.now(),
			})
		},
		buildConversationPayloadForTask(messageId) {
			const targetIndex = this.messages.findIndex((message) => message && message.id === messageId)
			const sourceMessages = targetIndex >= 0 ? this.messages.slice(0, targetIndex) : this.messages
			return normalizeConversationPayloadMessages(sourceMessages)
		},
		updateActiveReplyTask(patch = {}) {
			const nextTask = createPendingReplyTask({
				...(this.activeReplyTask || {}),
				...patch,
			})
			this.activeReplyTask = nextTask
			this.persistConversation()
		},
		clearActiveReplyTask() {
			this.activeReplyTask = null
			this.persistConversation()
		},
		completeReplyTask(messageId, status = 'completed') {
			const target = this.getTargetMessageForTask(messageId)
			if (target) {
				target.thinkingExpanded = false
				target.currentThinkingText = ''
			}
			this.stopTypewriter(messageId)
			this.loading = false
			this.statusText = ''
			if (this.activeReplyTask && String(this.activeReplyTask.messageId) === String(messageId)) {
				this.clearActiveReplyTask()
			}
			if (target && target.role === 'assistant' && status !== 'running') {
				this.startTypewriter(messageId)
			}
			this.persistConversation()
		},
		handleReplyFailure(messageId, error, options = {}) {
			if (error && error.name === 'AbortError') {
				return
			}
			const fallbackMessage = error && error.message ? error.message : '原木娘暂时没有响应，请稍后再试'
			const target = this.getTargetMessageForTask(messageId)
			if (target && !String(target.content || '').trim()) {
				this.updateMessageContent(messageId, fallbackMessage)
			}
			if (options.showToast !== false) {
				this.showToast(fallbackMessage)
			}
			this.completeReplyTask(messageId, 'error')
		},
		resetReplyMessageForRestart(messageId) {
			const target = this.getTargetMessageForTask(messageId)
			if (!target) {
				return
			}
			target.content = ''
			target.displayContent = ''
			target.citations = []
			target.thinkingSteps = []
			target.currentThinkingText = ''
			target.thinkingExpanded = true
			this.contextUsage = createDefaultContextUsage()
			this.streamErrorMessage = ''
			this.statusText = ''
			this.stopTypewriter(messageId)
			this.persistConversation()
		},
		async resumePendingReplyIfNeeded() {
			if (this.resumeTaskInProgress || this.abortController) {
				return
			}
			const task = normalizePendingReplyTask(this.activeReplyTask)
			if (!task || task.status !== 'running') {
				return
			}
			const target = this.getTargetMessageForTask(task.messageId)
			if (!target) {
				this.clearActiveReplyTask()
				this.loading = false
				return
			}

			this.resumeTaskInProgress = true
			this.loading = true
			target.thinkingExpanded = true
			this.startTypewriter(task.messageId)
			try {
				await this.streamChat(task.messageId, {
					taskState: task,
					requestMessages: this.buildConversationPayloadForTask(task.messageId),
				})
				const finalMessage = this.getTargetMessageForTask(task.messageId)
				if (!finalMessage || !String(finalMessage.content || '').trim()) {
					this.updateMessageContent(task.messageId, '这次我没有顺利组织出答案，你可以换个问法再试一次。')
				}
			} catch (error) {
				if (error && error.name === 'AbortError') {
					return
				}
				this.handleReplyFailure(task.messageId, error, { showToast: false })
			} finally {
				this.resumeTaskInProgress = false
				this.abortController = null
			}
		},
		hasToolTrace(message) {
			return !!(
				message
				&& (
					(Array.isArray(message.thinkingSteps) && message.thinkingSteps.length > 0)
					|| String(message.currentThinkingText || '').trim()
				)
			)
		},
		canToggleThinking(message) {
			if (!message || message.role !== 'assistant') {
				return false
			}
			const thinkingText = [
				...(Array.isArray(message.thinkingSteps) ? message.thinkingSteps : []),
				String(message.currentThinkingText || ''),
			].join('\n')
			const lineCount = (Array.isArray(message.thinkingSteps) ? message.thinkingSteps.length : 0)
				+ (String(message.currentThinkingText || '').trim() ? 1 : 0)
				+ (this.shouldShowThinkingHint(message) ? 1 : 0)
			return lineCount > 5 || thinkingText.length > 120
		},
		getVisibleThinkingSteps(message) {
			const steps = Array.isArray(message && message.thinkingSteps)
				? message.thinkingSteps
				: []
			if (!message || message.thinkingExpanded || !this.canToggleThinking(message)) {
				return steps
			}
			const reservedLineCount = (this.shouldShowThinkingHint(message) ? 1 : 0)
				+ (String(message.currentThinkingText || '').trim() ? 1 : 0)
			const visibleStepCount = Math.max(0, 5 - reservedLineCount)
			return visibleStepCount > 0 ? steps.slice(-visibleStepCount) : []
		},
		getVisibleThinkingStepText(step, message) {
			const text = String(step || '').trim()
			if (!text || !message || message.thinkingExpanded || !this.canToggleThinking(message) || text.length <= 120) {
				return text
			}
			return '...' + text.slice(-120)
		},
		getVisibleCurrentThinkingText(message) {
			const text = String(message && message.currentThinkingText || '').trim()
			if (!text || !message || message.thinkingExpanded || !this.canToggleThinking(message) || text.length <= 360) {
				return text
			}
			return '...' + text.slice(-360)
		},
		toggleThinkingExpanded(message) {
			if (!message) {
				return
			}
			message.thinkingExpanded = !message.thinkingExpanded
			this.persistConversation()
		},
		getMessageActionIndex(actionItems, actionText) {
			return actionItems.findIndex((item) => item === actionText)
		},
		getMessageIndex(message) {
			return this.messages.findIndex((item) => item && message && item.id === message.id)
		},
		getCopyableMessageText(message) {
			return normalizeCitationMarkerText(message && message.content).replace(/\[\[cite:[^\]]+\]\]/g, '').trim()
		},
		openMessageActionMenu(message) {
			const messageIndex = this.getMessageIndex(message)
			if (messageIndex === -1) {
				return
			}
			const actionItems = ['复制']
			const canMutateMessage = !this.loading && messageIndex > 0
			if (canMutateMessage) {
				actionItems.push('删除', '回滚')
			}
			uni.showActionSheet({
				itemList: actionItems,
				success: (res) => {
					const tapIndex = Number(res.tapIndex)
					if (tapIndex === this.getMessageActionIndex(actionItems, '复制')) {
						this.copyMessageContent(message)
						return
					}
					if (tapIndex === this.getMessageActionIndex(actionItems, '删除')) {
						this.deleteMessage(message)
						return
					}
					if (tapIndex === this.getMessageActionIndex(actionItems, '回滚')) {
						this.rollbackToMessage(message)
					}
				},
			})
		},
		copyMessageContent(message) {
			const content = this.getCopyableMessageText(message)
			if (!content) {
				this.showToast('这条消息没有可复制的内容')
				return
			}
			if (typeof uni !== 'undefined' && typeof uni.setClipboardData === 'function') {
				uni.setClipboardData({
					data: content,
					success: () => {
						this.showToast('已复制')
					},
					fail: () => {
						this.showToast('复制失败')
					},
				})
				return
			}
			if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
				navigator.clipboard.writeText(content)
					.then(() => {
						this.showToast('已复制')
					})
					.catch(() => {
						this.showToast('复制失败')
					})
				return
			}
			this.showToast('当前环境不支持复制')
		},
		commitMessageListChange() {
			this.messages = this.normalizeStoredMessages(this.messages)
			if (this.messages.length === 0) {
				this.messages = this.createInitialMessages()
			}
			this.computeNextMessageId(this.messages)
			this.contextUsageTooltipVisible = false
			this.indexStatusTooltipVisible = false
			this.persistConversation()
			this.scrollToBottom()
		},
		deleteMessage(message) {
			if (this.loading) {
				this.showToast('回复生成中，稍后再试')
				return
			}
			const messageIndex = this.getMessageIndex(message)
			if (messageIndex <= 0) {
				return
			}
			this.messages.splice(messageIndex, 1)
			this.commitMessageListChange()
			this.showToast('已删除')
		},
		rollbackToMessage(message) {
			if (this.loading) {
				this.showToast('回复生成中，稍后再试')
				return
			}
			const messageIndex = this.getMessageIndex(message)
			if (messageIndex <= 0 || messageIndex >= this.messages.length - 1) {
				this.showToast('已在当前位置')
				return
			}
			const removeCount = this.messages.length - messageIndex - 1
			uni.showModal({
				title: '确认回滚',
				content: '将删除这条消息之后的 ' + removeCount + ' 条消息，确定继续吗？',
				confirmText: '回滚',
				confirmColor: '#c0503a',
				cancelText: '取消',
				success: (res) => {
					if (!res.confirm) {
						return
					}
					this.messages = this.messages.slice(0, messageIndex + 1)
					this.commitMessageListChange()
					this.showToast('已回滚')
				},
			})
		},
		isActiveAssistantMessage(message) {
			if (!this.loading || !message || message.role !== 'assistant') {
				return false
			}
			for (let index = this.messages.length - 1; index >= 0; index -= 1) {
				const item = this.messages[index]
				if (item && item.role === 'assistant') {
					return item.id === message.id
				}
			}
			return false
		},
		shouldShowThinkingHint(message) {
			return this.isActiveAssistantMessage(message) && !this.streamErrorMessage
		},
		isCurrentHistorySession(novelId, sessionId) {
			return Number(novelId) === Number(this.novelId) && String(sessionId) === String(this.currentSessionId)
		},
		selectHistorySession(book, session) {
			if (!book || !session) {
				return
			}
			this.contextUsageTooltipVisible = false
			if (Number(book.novelId) === Number(this.novelId)) {
				this.setCurrentSession(session)
				return
			}
			this.closeHistoryPanel()
			uni.navigateTo({
				url: '/pages/readers/askLogGirl?novel_id=' + Number(book.novelId)
					+ '&novel_name=' + encodeURIComponent(book.novelName || '')
					+ '&session_id=' + encodeURIComponent(session.sessionId || '')
			})
		},
		handleHistoryCardTap(book, session) {
			if (this.swipedSessionId === session.sessionId) {
				this.swipedSessionId = null
			} else {
				this.selectHistorySession(book, session)
			}
		},
		onHistoryCardTouchStart(e, book, session) {
			this.touchStartX = e.touches ? e.touches[0].clientX : e.detail.x
		},
		onHistoryCardTouchMove(e) {
		},
		onHistoryCardTouchEnd(e, book, session) {
			const endX = e.changedTouches ? e.changedTouches[0].clientX : e.detail.x
			const deltaX = endX - this.touchStartX
			if (deltaX < -60) {
				this.swipedSessionId = session.sessionId
			} else if (deltaX > 60) {
				this.swipedSessionId = null
			}
		},
		deleteHistorySession(book, session) {
			if (!book || !session) {
				return
			}
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条聊天记录吗？删除后无法恢复。',
				confirmText: '删除',
				confirmColor: '#c0503a',
				cancelText: '取消',
				success: (res) => {
					if (!res.confirm) {
						return
					}
					const storedBook = this.findBookGroup(book.novelId)
					if (!storedBook) {
						return
					}
					const sessions = storedBook.sessions || []
					const deletedSessionId = String(session.sessionId)
					const index = sessions.findIndex((item) => String(item.sessionId) === deletedSessionId)
					if (index === -1) {
						return
					}
					const wasCurrentSession = this.isCurrentHistorySession(book.novelId, session.sessionId)
					const wasLastSession = String(storedBook.lastSessionId || '') === deletedSessionId
					sessions.splice(index, 1)
					this.swipedSessionId = null
					if (wasCurrentSession) {
						if (sessions.length > 0) {
							this.setCurrentSession(sessions[0])
						} else {
							this.createNewSession()
						}
					} else {
						if (wasLastSession) {
							storedBook.lastSessionId = sessions[0] ? sessions[0].sessionId : ''
						}
						storedBook.updatedAt = sessions[0] ? Number(sessions[0].updatedAt || Date.now()) : Date.now()
					}
					this.persistHistoryStore()
					this.showToast('已删除该条记录')
				}
			})
		},
		clearConversation() {
			if (this.loading) {
				return
			}
			this.contextUsageTooltipVisible = false
			this.createNewSession()
			this.showToast('已新建会话')
		},
		toggleContextUsageTooltip() {
			const nextVisible = !this.contextUsageTooltipVisible
			this.contextUsageTooltipVisible = nextVisible
			if (nextVisible) {
				this.$nextTick(() => {
					this.updateContextUsageTooltipPosition()
				})
			}
		},
		updateContextUsageTooltipPosition() {
			if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') {
				this.contextUsageTooltipStyle = {}
				this.contextUsageTooltipArrowStyle = {}
				return
			}
			const systemInfo = typeof uni.getSystemInfoSync === 'function' ? uni.getSystemInfoSync() : {}
			const windowWidth = Number(systemInfo.windowWidth || 0)
			if (!windowWidth) {
				this.contextUsageTooltipStyle = {}
				this.contextUsageTooltipArrowStyle = {}
				return
			}
			const query = uni.createSelectorQuery().in(this)
			query.select('.context-usage-wrap').boundingClientRect()
			query.exec((rects) => {
				const rect = rects && rects[0]
				if (!rect) {
					this.contextUsageTooltipStyle = {}
					this.contextUsageTooltipArrowStyle = {}
					return
				}
				const rpxToPx = windowWidth / 750
				const tooltipWidth = 260 * rpxToPx
				const minViewportLeft = 12 * rpxToPx
				const maxViewportLeft = Math.max(minViewportLeft, windowWidth - tooltipWidth - minViewportLeft)
				const anchorCenterX = Number(rect.left || 0) + (Number(rect.width || 0) / 2)
				const idealViewportLeft = anchorCenterX - (tooltipWidth / 2)
				const viewportLeft = Math.min(maxViewportLeft, Math.max(minViewportLeft, idealViewportLeft))
				const relativeLeft = viewportLeft - Number(rect.left || 0)
				const arrowLeft = Math.min(tooltipWidth - (18 * rpxToPx), Math.max(18 * rpxToPx, anchorCenterX - viewportLeft))
				this.contextUsageTooltipStyle = {
					left: relativeLeft + 'px',
				}
				this.contextUsageTooltipArrowStyle = {
					left: arrowLeft + 'px',
				}
			})
		},
		toggleIndexStatusTooltip() {
			const nextVisible = !this.indexStatusTooltipVisible
			this.indexStatusTooltipVisible = nextVisible
			if (nextVisible) {
				this.$nextTick(() => {
					this.updateIndexStatusTooltipPosition()
				})
			}
		},
		updateIndexStatusTooltipPosition() {
			if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') {
				this.indexStatusTooltipStyle = {}
				this.indexStatusTooltipArrowStyle = {}
				return
			}
			const systemInfo = typeof uni.getSystemInfoSync === 'function' ? uni.getSystemInfoSync() : {}
			const windowWidth = Number(systemInfo.windowWidth || 0)
			if (!windowWidth) {
				this.indexStatusTooltipStyle = {}
				this.indexStatusTooltipArrowStyle = {}
				return
			}
			const query = uni.createSelectorQuery().in(this)
			query.select('.index-status-wrap').boundingClientRect()
			query.exec((rects) => {
				const rect = rects && rects[0]
				if (!rect) {
					this.indexStatusTooltipStyle = {}
					this.indexStatusTooltipArrowStyle = {}
					return
				}
				const rpxToPx = windowWidth / 750
				const tooltipWidth = 260 * rpxToPx
				const minViewportLeft = 12 * rpxToPx
				const maxViewportLeft = Math.max(minViewportLeft, windowWidth - tooltipWidth - minViewportLeft)
				const anchorCenterX = Number(rect.left || 0) + (Number(rect.width || 0) / 2)
				const idealViewportLeft = anchorCenterX - (tooltipWidth / 2)
				const viewportLeft = Math.min(maxViewportLeft, Math.max(minViewportLeft, idealViewportLeft))
				const relativeLeft = viewportLeft - Number(rect.left || 0)
				const arrowLeft = Math.min(tooltipWidth - (18 * rpxToPx), Math.max(18 * rpxToPx, anchorCenterX - viewportLeft))
				this.indexStatusTooltipStyle = {
					left: relativeLeft + 'px',
				}
				this.indexStatusTooltipArrowStyle = {
					left: arrowLeft + 'px',
				}
			})
		},
		updateContextUsage(payload = {}) {
			this.contextUsage = normalizeContextUsage(payload, this.contextUsage)
			this.syncCurrentSession()
		},
		appendMessage(role, content, extra = {}) {
			const message = this.createMessage(role, content, extra)
			this.messages.push(message)
			this.scrollToBottom()
			this.persistConversation()
			return message
		},
		updateMessageContent(messageId, content) {
			const target = this.messages.find((message) => message.id === messageId)
			if (!target) {
				return
			}
			target.content = String(content || '')
			if (target.role === 'assistant') {
				const displayText = String(target.displayContent || '')
				if (!displayText) {
					target.displayContent = ''
				} else if (!target.content.startsWith(displayText)) {
					let prefixLength = 0
					while (
						prefixLength < displayText.length
						&& prefixLength < target.content.length
						&& displayText[prefixLength] === target.content[prefixLength]
					) {
						prefixLength += 1
					}
					target.displayContent = target.content.slice(0, prefixLength)
				}
				this.startTypewriter(messageId)
			}
			this.scrollToBottom()
			this.persistConversation()
		},
		appendThinkingStep(messageId, text) {
			const target = this.messages.find((message) => message.id === messageId)
			const normalizedText = String(text || '').trim()
			if (!target || !normalizedText) {
				return
			}

			target.thinkingSteps = Array.isArray(target.thinkingSteps) ? target.thinkingSteps : []
			this.commitCurrentThinkingText(target)
			if (target.thinkingSteps[target.thinkingSteps.length - 1] !== normalizedText) {
				target.thinkingSteps.push(normalizedText)
			}
			target.thinkingSteps = target.thinkingSteps.slice(-80)
			target.currentThinkingText = ''
			target.thinkingExpanded = true
			this.scrollToBottom()
			this.persistConversation()
		},
		updateMessageCitations(messageId, citations) {
			const target = this.messages.find((message) => message.id === messageId)
			if (!target) {
				return
			}
			target.citations = this.normalizeStoredCitations(citations)
			this.persistConversation()
		},
		setCurrentThinkingText(messageId, text) {
			const target = this.messages.find((message) => message.id === messageId)
			if (!target) {
				return
			}
			target.currentThinkingText = String(text || '').trim()
			target.thinkingExpanded = true
			this.scrollToBottom()
		},
		appendCurrentThinkingText(messageId, text) {
			const target = this.messages.find((message) => message.id === messageId)
			const normalizedText = String(text || '')
			if (!target || !normalizedText) {
				return
			}
			target.currentThinkingText = String(target.currentThinkingText || '') + normalizedText
			this.scrollToBottom()
		},
		commitCurrentThinkingText(target) {
			const normalizedText = String(target && target.currentThinkingText || '').trim()
			if (!target || !normalizedText) {
				return
			}
			target.thinkingSteps = Array.isArray(target.thinkingSteps) ? target.thinkingSteps : []
			if (target.thinkingSteps[target.thinkingSteps.length - 1] !== normalizedText) {
				target.thinkingSteps.push(normalizedText)
				target.thinkingSteps = target.thinkingSteps.slice(-80)
			}
			target.currentThinkingText = ''
		},
		clearCurrentThinkingText(messageId, options = {}) {
			const target = this.messages.find((message) => message.id === messageId)
			if (!target) {
				return
			}
			if (options.commit === true) {
				this.commitCurrentThinkingText(target)
			}
			target.currentThinkingText = ''
			this.persistConversation()
		},
		getConversationPayload() {
			return normalizeConversationPayloadMessages(this.messages)
		},
		getReaderAiBaseUrl() {
			let overrideBaseUrl = ''
			try {
				overrideBaseUrl = typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function'
					? String(uni.getStorageSync('reader_ai_base_url_override') || '').trim()
					: ''
			} catch (error) {
				overrideBaseUrl = ''
			}

			return String(overrideBaseUrl || this.$readerAiBaseUrl || this.$baseUrl || '')
				.replace(/\/+$/, '')
		},
		abortActiveRequest() {
			if (this.abortController) {
				if (typeof this.abortController.abort === 'function') {
					this.abortController.abort()
				}
				this.abortController = null
			}
		},
		canUseXhrStreaming() {
			return typeof XMLHttpRequest !== 'undefined'
		},
		streamChatWithXhr(url, payload, messageId) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest()
				let processedLength = 0
				let buffer = ''
				let settled = false

				const finish = (callback) => {
					if (settled) {
						return
					}
					settled = true
					callback()
				}

				const processIncomingText = () => {
					const responseText = typeof xhr.responseText === 'string' ? xhr.responseText : ''
					if (responseText.length <= processedLength) {
						return
					}
					buffer += responseText.slice(processedLength)
					processedLength = responseText.length
					buffer = this.consumeStreamBuffer(buffer, messageId)
				}

				xhr.open('POST', url, true)
				xhr.setRequestHeader('Content-Type', 'application/json')
				xhr.setRequestHeader('Accept', 'application/x-ndjson')

				xhr.onprogress = () => {
					processIncomingText()
				}

				xhr.onreadystatechange = () => {
					if (xhr.readyState === 3) {
						processIncomingText()
					}
				}

				xhr.onerror = () => {
					finish(() => {
						reject(new Error('请求失败，请稍后再试'))
					})
				}

				xhr.onabort = () => {
					finish(() => {
						reject(createAbortError())
					})
				}

				xhr.onload = () => {
					processIncomingText()
					buffer += typeof xhr.responseText === 'string' ? xhr.responseText.slice(processedLength) : ''
					if (buffer.trim()) {
						this.processNdjsonBlock(buffer, messageId)
					}

					if (xhr.status < 200 || xhr.status >= 300) {
						let message = '请求失败，请稍后再试'
						try {
							const data = JSON.parse(xhr.responseText || '{}')
							message = data.msg || data.message || message
						} catch (error) {}
						finish(() => {
							reject(new Error(message))
						})
						return
					}

					if (this.streamErrorMessage) {
						finish(() => {
							reject(new Error(this.streamErrorMessage))
						})
						return
					}

					finish(() => {
						resolve()
					})
				}

				this.abortController = {
					abort() {
						try {
							xhr.abort()
						} catch (error) {}
					},
				}

				try {
					xhr.send(JSON.stringify(payload))
				} catch (error) {
					finish(() => {
						reject(error)
					})
				}
			})
		},
		async loadNovelIndexStatus() {
			if (!this.novelId) {
				this.novelIndexStatus = createDefaultNovelIndexStatus()
				return
			}

			const previousStatus = this.novelIndexStatus
			this.novelIndexStatus = normalizeNovelIndexStatus({
				...previousStatus,
				loading: true,
				error: '',
			}, previousStatus)

			try {
				const readerAiBaseUrl = this.getReaderAiBaseUrl()
				const response = await fetch(
					readerAiBaseUrl + INDEX_STATUS_ROUTE + '?novel_id=' + encodeURIComponent(this.novelId),
					{
						method: 'GET',
						headers: {
							'Accept': 'application/json',
						},
					}
				)
				if (!response.ok) {
					throw new Error('request failed')
				}
				const payload = await response.json()
				const rawStatus = payload && payload.data && typeof payload.data === 'object'
					? payload.data
					: payload
				this.novelIndexStatus = normalizeNovelIndexStatus({
					...rawStatus,
					loading: false,
					loaded: true,
					error: '',
				}, previousStatus)
			} catch (error) {
				this.novelIndexStatus = normalizeNovelIndexStatus({
					...previousStatus,
					loading: false,
					loaded: true,
					error: '索引情况暂时不可用',
				}, previousStatus)
			}
		},
		async submitQuestion() {
			const content = String(this.draft || '').trim()
			if (!content || this.loading) {
				return
			}
			if (!this.novelId) {
				this.showToast('作品信息不完整')
				return
			}

			this.streamErrorMessage = ''
			this.contextUsageTooltipVisible = false
			this.appendMessage('user', content)
			this.draft = ''

			const assistantMessage = this.appendMessage('assistant', '', {
				displayContent: '',
				thinkingExpanded: true,
			})
			this.activeReplyTask = this.createActiveReplyTask(assistantMessage.id)
			this.loading = true
			this.statusText = '原木娘正在整理这本书的资料'
			this.persistConversation()

			try {
				await this.streamChat(assistantMessage.id, {
					taskState: this.activeReplyTask,
					requestMessages: this.buildConversationPayloadForTask(assistantMessage.id),
				})
				const finalMessage = this.messages.find((message) => message.id === assistantMessage.id)
				if (!finalMessage || !String(finalMessage.content || '').trim()) {
					this.updateMessageContent(assistantMessage.id, '这次我没有顺利组织出答案，你可以换个问法再试一次。')
				}
			} catch (error) {
				if (error && error.name === 'AbortError') {
					return
				}
				this.handleReplyFailure(assistantMessage.id, error)
			} finally {
				this.abortController = null
				if (!this.activeReplyTask) {
					this.loading = false
					this.statusText = ''
					this.streamErrorMessage = ''
				}
			}
		},
		async streamChat(messageId, options = {}) {
			this.abortActiveRequest()
			const readerAiBaseUrl = this.getReaderAiBaseUrl()
			const taskState = normalizePendingReplyTask(options.taskState || this.activeReplyTask || this.createActiveReplyTask(messageId))
			const requestMessages = Array.isArray(options.requestMessages) && options.requestMessages.length > 0
				? normalizeConversationPayloadMessages(options.requestMessages)
				: this.buildConversationPayloadForTask(messageId)
			const requestPayload = {
				novel_id: this.novelId,
				session_id: this.currentSessionId,
				message_id: messageId,
				task_id: taskState && taskState.taskId ? taskState.taskId : this.buildReplyTaskId(messageId),
				resume_from_event_id: taskState && taskState.lastEventId ? taskState.lastEventId : 0,
				messages: requestMessages,
			}
			const requestUrl = readerAiBaseUrl + STREAM_ROUTE

			if (this.canUseXhrStreaming()) {
				await this.streamChatWithXhr(requestUrl, requestPayload, messageId)
				return
			}

			const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
			this.abortController = controller

			const response = await fetch(requestUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/x-ndjson',
				},
				body: JSON.stringify(requestPayload),
				signal: controller ? controller.signal : undefined,
			})

			if (!response.ok) {
				let message = '请求失败，请稍后再试'
				try {
					const data = await response.json()
					message = data.msg || data.message || message
				} catch (error) {}
				throw new Error(message)
			}

			if (!response.body || !response.body.getReader) {
				const fullText = await response.text()
				this.processNdjsonBlock(fullText, messageId)
				if (this.streamErrorMessage) {
					throw new Error(this.streamErrorMessage)
				}
				return
			}

			const reader = response.body.getReader()
			const decoder = new TextDecoder('utf-8')
			let buffer = ''

			while (true) {
				const { done, value } = await reader.read()
				if (done) {
					break
				}
				buffer += decoder.decode(value, { stream: true })
				buffer = this.consumeStreamBuffer(buffer, messageId)
				if (this.streamErrorMessage) {
					throw new Error(this.streamErrorMessage)
				}
			}

			buffer += decoder.decode()
			if (buffer.trim()) {
				this.processNdjsonBlock(buffer, messageId)
			}
			if (this.streamErrorMessage) {
				throw new Error(this.streamErrorMessage)
			}
		},
		consumeStreamBuffer(buffer, messageId) {
			let working = String(buffer || '')
			let lineBreakIndex = working.indexOf('\n')

			while (lineBreakIndex !== -1) {
				const line = working.slice(0, lineBreakIndex).trim()
				working = working.slice(lineBreakIndex + 1)
				if (line) {
					this.handleStreamEvent(line, messageId)
				}
				lineBreakIndex = working.indexOf('\n')
			}

			return working
		},
		processNdjsonBlock(text, messageId) {
			String(text || '')
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean)
				.forEach((line) => {
					this.handleStreamEvent(line, messageId)
				})
		},
		getStreamEventText(event) {
			if (!event || typeof event !== 'object') {
				return ''
			}
			if (event.message !== undefined && event.message !== null) {
				return String(event.message)
			}
			if (event.text !== undefined && event.text !== null) {
				return String(event.text)
			}
			if (event.content !== undefined && event.content !== null) {
				return String(event.content)
			}
			if (event.delta !== undefined && event.delta !== null) {
				if (typeof event.delta === 'string') {
					return event.delta
				}
				if (typeof event.delta === 'object') {
					return String(event.delta.text || event.delta.content || event.delta.message || '')
				}
			}
			if (event.reasoning !== undefined && event.reasoning !== null) {
				return String(event.reasoning)
			}
			if (event.thinking !== undefined && event.thinking !== null) {
				return String(event.thinking)
			}
			return ''
		},
		handleStreamEvent(rawLine, messageId) {
			let event
			try {
				event = JSON.parse(rawLine)
			} catch (error) {
				return
			}

			if (!event || typeof event !== 'object') {
				return
			}

			if (event.type === 'status') {
				this.clearCurrentThinkingText(messageId, { commit: true })
				const statusText = this.getStreamEventText(event)
				this.statusText = statusText
				this.setCurrentThinkingText(messageId, statusText)
				return
			}

			if (event.type === 'task') {
				const shouldResetForRestart = event.created === true
					&& this.activeReplyTask
					&& String(this.activeReplyTask.messageId) === String(messageId)
					&& Number(this.activeReplyTask.lastEventId || 0) > 0
				if (shouldResetForRestart) {
					this.resetReplyMessageForRestart(messageId)
				}
				this.updateActiveReplyTask({
					taskId: event.task_id || (this.activeReplyTask && this.activeReplyTask.taskId) || this.buildReplyTaskId(messageId),
					sessionId: event.session_id || this.currentSessionId,
					messageId: event.message_id || messageId,
					novelId: this.novelId,
					status: event.status || 'running',
					lastEventId: shouldResetForRestart ? 0 : ((this.activeReplyTask && this.activeReplyTask.lastEventId) || 0),
				})
				return
			}

			if (this.activeReplyTask && String(this.activeReplyTask.messageId) === String(messageId)) {
				const eventId = Number(event.event_id || 0)
				if (Number.isFinite(eventId) && eventId > 0) {
					this.updateActiveReplyTask({
						lastEventId: eventId,
					})
				}
			}

			if (
				event.type === 'trace'
				|| event.type === 'tool'
				|| event.type === 'tool_call'
				|| event.type === 'tool_result'
				|| event.type === 'reasoning'
				|| event.type === 'thinking'
				|| event.type === 'reasoning_summary'
				|| event.type === 'thinking_summary'
			) {
				this.appendThinkingStep(messageId, this.getStreamEventText(event))
				return
			}

			if (
				event.type === 'reasoning_delta'
				|| event.type === 'thinking_delta'
				|| event.type === 'thought_delta'
			) {
				this.appendCurrentThinkingText(messageId, this.getStreamEventText(event))
				return
			}

			if (
				event.type === 'reasoning_done'
				|| event.type === 'thinking_done'
				|| event.type === 'thought_done'
			) {
				this.clearCurrentThinkingText(messageId, { commit: true })
				return
			}

			if (event.type === 'context_usage') {
				this.updateContextUsage(event)
				return
			}

			if (event.type === 'citations') {
				this.updateMessageCitations(messageId, event.items)
				return
			}

			if (event.type === 'delta') {
				const current = this.messages.find((message) => message.id === messageId)
				const nextContent = String((current && current.content) || '') + String(event.content || '')
				this.updateMessageContent(messageId, nextContent)
				return
			}

			if (event.type === 'replace') {
				this.updateMessageContent(messageId, event.content || '')
				return
			}

			if (event.type === 'error') {
				this.streamErrorMessage = event.message || '原木娘暂时没有响应，请稍后再试'
				this.clearCurrentThinkingText(messageId)
				const target = this.getTargetMessageForTask(messageId)
				if (target) {
					target.thinkingExpanded = false
				}
				this.completeReplyTask(messageId, 'error')
				return
			}

			if (event.type === 'done') {
				this.statusText = ''
				this.clearCurrentThinkingText(messageId, { commit: true })
				const target = this.getTargetMessageForTask(messageId)
				if (target) {
					target.thinkingExpanded = false
				}
				this.completeReplyTask(messageId, 'completed')
			}
		},
		scrollToBottom() {
			this.scrollAnchorId = ''
			this.$nextTick(() => {
				this.scrollAnchorId = SCROLL_ANCHOR_ID
			})
		},
		showToast(title) {
			uni.showToast({
				title,
				icon: 'none',
				duration: 2000,
			})
		},
	},
}

