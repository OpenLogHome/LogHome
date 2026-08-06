<template>
	<view class="ask-log-girl-page" v-dark>
		<!-- 自定义导航栏 -->
		<view class="custom-nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="custom-nav-content">
				<view class="nav-left">
					<view class="nav-back-btn" @tap="handleNavBack">
						<uni-icons type="left" size="20" :color="navIconColor"></uni-icons>
					</view>
				</view>
				<view class="nav-center">
					<text class="nav-title">问问原木娘</text>
				</view>
				<view class="nav-right">
					<view class="nav-history-btn" @tap="openHistoryPanel">
						<uni-icons type="chat" size="18" :color="navAccentColor"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<view class="chat-shell">
			<view class="chat-header">
				<image class="chat-badge" src="https://storage.codesocean.top/api/resource/get/177882044429077" mode="aspectFit"></image>
				<view class="chat-header-main">
					<view class="chat-subtitle">
						<text>{{ effectiveNovelName || ('作品 ' + effectiveNovelId) }}</text>
						<text class="active-novel-chip" v-if="!isActiveNovelOriginal">临时切换</text>
					</view>
					<view class="chat-active-origin" v-if="!isActiveNovelOriginal">
						原作品：{{ novelName || ('作品 ' + novelId) }}
					</view>
					<view class="chat-session-name">{{ currentSessionTitle }}</view>
				</view>
			</view>

			<view class="chat-messages">
				<view
					class="chat-row"
					v-for="message in messages"
					:key="message.id"
					:class="message.role === 'user' ? 'user' : 'assistant'"
				>
					<view class="chat-bubble" @longpress.stop="openMessageActionMenu(message)">
						<view
							class="chat-thinking"
							v-if="message.role === 'assistant' && (hasToolTrace(message) || shouldShowThinkingHint(message))"
						>
							<view
								class="chat-thinking-panel"
								:class="{ expanded: message.thinkingExpanded }"
							>
								<view class="chat-thinking-group">
									<view class="chat-thinking-status" v-if="shouldShowThinkingHint(message)">
										<text class="chat-thinking-status-text">{{ currentThinkingHintText }}</text>
										<text class="chat-thinking-dot dot-one">.</text>
										<text class="chat-thinking-dot dot-two">.</text>
										<text class="chat-thinking-dot dot-three">.</text>
									</view>
									<view
										class="chat-thinking-line"
										v-for="(step, index) in getVisibleThinkingSteps(message)"
										:key="message.id + '-thinking-visible-' + index"
									>
										{{ getVisibleThinkingStepText(step, message) }}
									</view>
									<view class="chat-thinking-line active" v-if="getVisibleCurrentThinkingText(message)">
										{{ getVisibleCurrentThinkingText(message) }}
									</view>
								</view>
							</view>
							<view
								class="chat-thinking-toggle"
								v-if="canToggleThinking(message)"
								@tap.stop="toggleThinkingExpanded(message)"
							>
								{{ message.thinkingExpanded ? '收起' : '展开' }}
							</view>
						</view>
						<view class="chat-content" v-if="getVisibleMessageContent(message)">
							<rich-text
								v-if="message.role === 'assistant'"
								class="chat-richtext"
								:nodes="renderAssistantMarkdown(message)"
								@itemclick="handleAssistantItemClick($event, message)"
							></rich-text>
							<text v-else>{{ getVisibleMessageContent(message) }}</text>
						</view>
						<view
							class="chat-content chat-content-placeholder"
							v-if="!getVisibleMessageContent(message) && message.role === 'assistant' && !shouldShowThinkingHint(message) && hasToolTrace(message)"
						>
							正在生成回答...
						</view>
					</view>
				</view>
			</view>

			<view class="chat-input-wrap">
				<view
					class="chat-clear-icon-btn"
					@tap.stop="clearConversation"
					v-if="messages.length > 1 && !loading"
					aria-label="清空上下文"
				>
					<i class="el-icon-brush chat-clear-icon"></i>
				</view>
				<textarea
					v-model="draft"
					class="chat-textarea"
					:class="{ 'with-clear-context': messages.length > 1 && !loading }"
					placeholder="输入你想问的问题"
					auto-height
					maxlength="-1"
					confirm-type="send"
					@confirm="submitQuestion"
				/>
				<view class="redstone-cost-row">
					<RedstoneCost :cost="retrieverMode === 'deep' ? 2 : 1" />
				</view>
				<view class="chat-action-row">
					<view class="chat-action-left">
						<view class="index-status-wrap" @tap.stop="toggleIndexStatusTooltip" v-if="novelId">
							<view class="index-status-box">
								<view class="index-status-water" :style="novelIndexWaterStyle">
									<view class="index-status-wave"></view>
								</view>
								<view class="index-status-core">{{ novelIndexPercent }}%</view>
							</view>
							<view
								class="index-status-tooltip"
								v-if="indexStatusTooltipVisible"
								:style="indexStatusTooltipStyle"
								@tap.stop
							>
								<view class="index-status-tooltip-arrow" :style="indexStatusTooltipArrowStyle"></view>
								<view class="index-tooltip-title">全文智能索引</view>
								<view class="index-tooltip-percent">{{ novelIndexPercent }}%</view>
								<view class="index-tooltip-text">{{ novelIndexStatusText }}</view>
								<view class="index-tooltip-meta">索引进度会影响回答质量</view>
							</view>
						</view>
						<view class="context-usage-wrap" @tap.stop="toggleContextUsageTooltip">
							<view class="context-usage-ring" :style="contextUsageRingStyle">
								<view class="context-usage-core">{{ contextUsagePercent }}%</view>
							</view>
							<view
								class="context-usage-tooltip"
								v-if="contextUsageTooltipVisible"
								:style="contextUsageTooltipStyle"
								@tap.stop
							>
								<view class="context-usage-tooltip-arrow" :style="contextUsageTooltipArrowStyle"></view>
								<view class="context-tooltip-title">背景信息窗口</view>
								<view class="context-tooltip-percent">{{ contextUsagePercent }} % 已用</view>
								<view class="context-tooltip-note">背景信息会自动压缩</view>
							</view>
						</view>
					</view>
					<view class="chat-mode-toggle" :class="{ disabled: loading }">
						<view
							class="chat-mode-option"
							:class="{ active: retrieverMode === 'fast' }"
							@tap="setRetrieverMode('fast')"
						>
							普通
						</view>
						<view
							class="chat-mode-option"
							:class="{ active: retrieverMode === 'deep' }"
							@tap="setRetrieverMode('deep')"
						>
							深度思考
						</view>
					</view>
					<view v-if="loading" class="chat-send stop" @tap="stopReply">
						停止
					</view>
					<view v-else class="chat-send" :class="{ disabled: !canSend }" @tap="submitQuestion">
						发送
					</view>
				</view>
			</view>
		</view>

		<!-- 历史记录抽屉 -->
		<view class="history-drawer" :class="{ open: historyPanelVisible }">
			<view class="history-drawer-mask" v-if="historyPanelVisible" @tap="closeHistoryPanel"></view>
			<view class="history-drawer-panel" :class="{ open: historyPanelVisible }">
				<view class="history-drawer-handle">
					<view class="history-drawer-handle-bar"></view>
				</view>
				<view class="history-drawer-header">
					<text class="history-drawer-title">历史聊天记录</text>
					<view class="history-drawer-close" @tap="closeHistoryPanel">
						<uni-icons type="closeempty" size="20" :color="isDarkMode ? '#f4ebdb' : '#8a6c45'"></uni-icons>
					</view>
				</view>
				<view class="history-drawer-search">
					<view class="history-search-wrap">
						<uni-icons type="search" size="16" color="#b8a58a" class="search-icon"></uni-icons>
						<input
							v-model="historyKeyword"
							class="history-search-input"
							type="text"
							confirm-type="search"
							placeholder="搜索本书聊天内容"
							placeholder-class="history-search-placeholder"
						/>
					</view>
				</view>
				<scroll-view class="history-drawer-scroll" scroll-y :thumb-style="{ borderRadius: '10rpx' }">
					<block v-if="historyBookGroups.length > 0">
						<view
							class="history-book-group"
							v-for="book in historyBookGroups"
							:key="'history-book-' + book.novelId"
						>
							<view class="history-book-title">{{ book.novelName || ('作品 ' + book.novelId) }}</view>
							<view
								class="history-session-card"
								v-for="session in book.sessions"
								:key="session.sessionId"
								:class="{ active: isCurrentHistorySession(book.novelId, session.sessionId), swiped: swipedSessionId === session.sessionId }"
								@tap="handleHistoryCardTap(book, session)"
								@touchstart="onHistoryCardTouchStart($event, book, session)"
								@touchmove="onHistoryCardTouchMove($event)"
								@touchend="onHistoryCardTouchEnd($event, book, session)"
							>
								<view class="history-session-delete" @tap.stop="deleteHistorySession(book, session)">删除</view>
								<view class="history-session-content">
									<view class="history-session-title">{{ session.title }}</view>
									<view class="history-session-meta">
										{{ formatHistoryTime(session.updatedAt) }}
									</view>
									<view class="history-session-preview">{{ session.preview || '暂无对话内容' }}</view>
								</view>
							</view>
						</view>
					</block>
					<view v-else class="history-empty">
						{{ historyKeyword ? '没有找到匹配的历史记录' : '暂时还没有历史聊天记录' }}
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import darkModeMixin from '@/mixins/dark-mode.js'
import RedstoneCost from '@/components/redstone-cost/RedstoneCost.vue'
import { showInsufficientRedstoneOptions } from '@/common/redstone-ui.js'

const STREAM_ROUTE = '/library/reader_novel_ai_chat_stream'
const INDEX_STATUS_ROUTE = '/library/reader_novel_summary_index_status'
const HISTORY_STORAGE_KEY = 'reader_ask_log_girl_history_v2'
const LEGACY_STORAGE_KEY_PREFIX = 'reader_ask_log_girl_'

function createTaskInstanceId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
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
const THINKING_TYPEWRITER_INTERVAL_MS = 18
const AUTO_SCROLL_BOTTOM_THRESHOLD_PX = 180
const AUTO_SCROLL_DELAY_MS = 16
const AUTO_SCROLL_SETTLE_DELAY_MS = 48
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

function normalizeActiveNovel(rawNovel, fallbackNovelId = 0, fallbackNovelName = '') {
	const source = rawNovel && typeof rawNovel === 'object' ? rawNovel : {}
	const rawNovelId = Number(source.novelId || source.novel_id || fallbackNovelId || 0)
	if (!Number.isFinite(rawNovelId) || rawNovelId <= 0) {
		return null
	}
	const tags = Array.isArray(source.tags)
		? source.tags.map((item) => String(item || '').trim()).filter(Boolean)
		: []
	return {
		novelId: Math.floor(rawNovelId),
		novelName: String(source.novelName || source.name || fallbackNovelName || ''),
		author: String(source.author || ''),
		description: String(source.description || ''),
		tags,
		chapterCount: Number(source.chapterCount || source.chapter_count || 0) || 0,
		latestChapter: source.latestChapter !== undefined && source.latestChapter !== null
			? Number(source.latestChapter)
			: (source.latest_chapter !== undefined && source.latest_chapter !== null ? Number(source.latest_chapter) : null),
		isOriginal: source.isOriginal !== undefined
			? source.isOriginal === true
			: (source.is_original !== undefined ? source.is_original === true : Number(rawNovelId) === Number(fallbackNovelId || 0)),
	}
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
	const activeNovelId = Number(rawTask.activeNovelId || rawTask.active_novel_id || rawTask.currentNovelId || rawTask.current_novel_id || novelId || 0)
	const rawRetrieverMode = String(rawTask.retrieverMode || rawTask.retriever_mode || rawTask.searchMode || rawTask.search_mode || 'fast')
	const retrieverMode = rawRetrieverMode === 'deep' ? 'deep' : 'fast'
	return {
		taskId,
		sessionId,
		messageId,
		novelId: Number.isFinite(novelId) && novelId > 0 ? novelId : 0,
		activeNovelId: Number.isFinite(activeNovelId) && activeNovelId > 0 ? activeNovelId : 0,
		retrieverMode,
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
		activeNovelId: options.activeNovelId || options.active_novel_id || options.novelId || 0,
		retrieverMode: options.retrieverMode || options.retriever_mode || 'fast',
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

function getTypewriterStepSize(remaining, fast = false) {
	const safeRemaining = Number(remaining || 0)
	if (safeRemaining <= 0) {
		return 0
	}
	if (fast) {
		return safeRemaining > 240 ? 14 : safeRemaining > 140 ? 10 : safeRemaining > 70 ? 6 : 3
	}
	return safeRemaining > 160 ? 8 : safeRemaining > 80 ? 6 : safeRemaining > 30 ? 4 : 2
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
	components: { RedstoneCost },
	data() {
		return {
			statusBarHeight: 0,
			novelId: 0,
			novelName: '',
			activeNovel: null,
			currentSessionId: '',
			draft: '',
			retrieverMode: 'fast',
			loading: false,
			autoScrollTimer: null,
			autoScrollPendingForce: false,
			autoScrollShouldFollow: true,
			autoScrollWindowListenerRegistered: false,
			autoScrollLastScrollTop: 0,
			statusText: '',
			streamErrorMessage: '',
			historyPanelVisible: false,
			historyKeyword: '',
			chatHistoryStore: {
				version: 2,
				books: [],
			},
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
			thinkingTypewriterTimers: {},
			thinkingDisplayState: {},
			resumeTaskInProgress: false,
		}
	},
	computed: {
		navIconColor() {
			return this.isDarkMode ? '#f4ebdb' : '#2f2418'
		},
		navAccentColor() {
			return this.isDarkMode ? '#d9c7a8' : '#8a6c45'
		},
		canSend() {
			return !!String(this.draft || '').trim() && !this.loading
		},
		effectiveNovelId() {
			const activeNovelId = Number(this.activeNovel && this.activeNovel.novelId)
			return Number.isFinite(activeNovelId) && activeNovelId > 0 ? activeNovelId : Number(this.novelId || 0)
		},
		effectiveNovelName() {
			return String(
				(this.activeNovel && this.activeNovel.novelName)
				|| this.novelName
				|| ''
			)
		},
		isActiveNovelOriginal() {
			return Number(this.effectiveNovelId) === Number(this.novelId || 0)
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
	watch: {
		draft() {
			this.persistCurrentDraft()
		},
	},
	onLoad(option) {
		const systemInfo = uni.getSystemInfoSync()
		const nativeStatusBarHeight = Number(
			typeof window !== 'undefined' && window.jsBridge
				? window.jsBridge.statusBarHeight
				: 0
		) || 0
		this.statusBarHeight = nativeStatusBarHeight || systemInfo.statusBarHeight || 0
		this.novelId = Number(option.novel_id || 0)
		this.novelName = option.novel_name ? decodeURIComponent(option.novel_name) : ''
		this.activeNovel = this.createDefaultActiveNovel()
		this.initializeConversation(option.session_id || '')
		this.startThinkingHintRotation()
		this.loadNovelIndexStatus()
		this.resumePendingReplyIfNeeded()
	},
	onShow() {
		this.registerWindowScrollListener()
		this.resumePendingReplyIfNeeded()
	},
	mounted() {
		this.registerWindowScrollListener()
		this.$nextTick(() => {
			this.updateAutoScrollState()
		})
	},
	onPageScroll(event) {
		this.updateAutoScrollState(event && event.scrollTop)
	},
	onHide() {
		this.persistConversation()
		this.abortActiveRequest()
		this.unregisterWindowScrollListener()
	},
	onUnload() {
		this.persistConversation()
		this.abortActiveRequest()
		this.clearAutoScrollTimer()
		this.unregisterWindowScrollListener()
		this.stopAllTypewriters()
		this.stopAllThinkingTypewriters()
		this.stopThinkingHintRotation()
	},
	beforeDestroy() {
		this.clearAutoScrollTimer()
		this.unregisterWindowScrollListener()
		this.stopAllTypewriters()
		this.stopAllThinkingTypewriters()
		this.stopThinkingHintRotation()
	},
	methods: {
		shouldUseNativeBack() {
			const bridge = typeof window !== 'undefined' ? window.jsBridge : null
			return !!(bridge && bridge.inApp && bridge.nativeRouterAvailable)
		},
		handleNavBack() {
			if (this.shouldUseNativeBack()) {
				uni.navigateBack({ delta: 1 })
				return
			}
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.reLaunch({ url: '/pages/library' })
			}
		},
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
		createDefaultActiveNovel() {
			return normalizeActiveNovel({
				novelId: this.novelId,
				novelName: this.novelName,
				isOriginal: true,
			}, this.novelId, this.novelName)
		},
		normalizeSessionActiveNovel(rawNovel) {
			return normalizeActiveNovel(rawNovel, this.novelId, this.novelName) || this.createDefaultActiveNovel()
		},
		normalizeStoredCitations(rawCitations) {
			return (Array.isArray(rawCitations) ? rawCitations : [])
				.filter((item) => item && typeof item === 'object' && Number(item.article_id))
				.map((item, index) => {
					const rawCitationId = String(item.citation_id || ('citation-' + index))
					return {
						citation_id: normalizeCitationId(rawCitationId) || rawCitationId,
						novel_id: Number(item.novel_id || item.novelId || 0) || null,
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
				activeNovel: this.normalizeSessionActiveNovel(options.activeNovel),
				draft: String(options.draft || ''),
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
				activeNovel: this.normalizeSessionActiveNovel(rawSession && rawSession.activeNovel),
				draft: String((rawSession && rawSession.draft) || ''),
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
			this.stopAllThinkingTypewriters()
			this.currentSessionId = String(session.sessionId || '')
			this.activeNovel = this.normalizeSessionActiveNovel(session.activeNovel)
			this.draft = String(session.draft || '')
			this.messages = this.normalizeStoredMessages(session.messages)
			this.contextUsage = normalizeContextUsage(session.contextUsage)
			this.activeReplyTask = normalizePendingReplyTask(session.pendingTask)
			this.rebuildThinkingDisplayState({
				seedFromMessage: true,
			})
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
			this.resumeLocalTypewriterIfNeeded()
			if (this.activeReplyTask && this.activeReplyTask.status === 'running') {
				this.startThinkingTypewriter(this.activeReplyTask.messageId)
			}
			if (options.closePanel !== false) {
				this.historyPanelVisible = false
			}
			this.loadNovelIndexStatus()
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
			session.activeNovel = this.normalizeSessionActiveNovel(this.activeNovel)
			session.draft = String(this.draft || '')
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
		persistCurrentDraft() {
			if (!this.novelId || !this.currentSessionId || !this.chatHistoryStore) {
				return
			}
			const bookGroup = this.findBookGroup(this.novelId)
			if (!bookGroup || !Array.isArray(bookGroup.sessions)) {
				return
			}
			const session = bookGroup.sessions.find((item) => item && String(item.sessionId) === String(this.currentSessionId))
			if (!session) {
				return
			}
			session.draft = String(this.draft || '')
			try {
				uni.setStorageSync(this.getStorageKey(), JSON.stringify(this.chatHistoryStore))
			} catch (error) {}
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
			this.stopAllTypewriters()
			this.stopAllThinkingTypewriters()
			this.activeNovel = this.createDefaultActiveNovel()
			session.activeNovel = this.normalizeSessionActiveNovel(this.activeNovel)
			this.draft = ''
			session.draft = ''
			this.messages = this.normalizeStoredMessages(session.messages)
			this.rebuildThinkingDisplayState({
				seedFromMessage: true,
			})
			this.contextUsage = normalizeContextUsage(session.contextUsage)
			this.activeReplyTask = null
			this.contextUsageTooltipVisible = false
			this.computeNextMessageId(this.messages)
			this.loading = false
			this.statusText = ''
			this.streamErrorMessage = ''
			this.persistHistoryStore()
			this.loadNovelIndexStatus()
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
		getReaderArticleUrl(articleId, paragraphId, novelId = this.effectiveNovelId) {
			let readerProps = ''
			if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
				readerProps = uni.getStorageSync('readerProps') || ''
			} else if (typeof window !== 'undefined' && window.localStorage) {
				readerProps = window.localStorage.getItem('readerProps') || ''
			}
			const isPageReader = readerProps !== 'text'
			let url = isPageReader
				? `/pages/readers/newReader/article?id=${articleId}`
				: `/pages/readers/article_rich?id=${articleId}`
			if (novelId) {
				url += `&novelId=${Number(novelId)}`
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
				url: this.getReaderArticleUrl(Number(citation.article_id), citation.paragraph_id, citation.novel_id || this.effectiveNovelId),
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
		createThinkingDisplayState(message, options = {}) {
			const seedFromMessage = options.seedFromMessage !== false
			return {
				steps: seedFromMessage
					? (Array.isArray(message && message.thinkingSteps) ? message.thinkingSteps.map((item) => String(item || '')) : [])
					: [],
				currentText: seedFromMessage ? String(message && message.currentThinkingText || '') : '',
			}
		},
		rebuildThinkingDisplayState(options = {}) {
			const nextState = {}
			this.messages.forEach((message) => {
				if (!message || message.role !== 'assistant') {
					return
				}
				nextState[message.id] = this.createThinkingDisplayState(message, options)
			})
			this.thinkingDisplayState = nextState
		},
		resetThinkingDisplayStateForMessage(messageId, options = {}) {
			const target = this.getTargetMessageForTask(messageId)
			if (!target || target.role !== 'assistant') {
				if (this.thinkingDisplayState && this.thinkingDisplayState[messageId] !== undefined && typeof this.$delete === 'function') {
					this.$delete(this.thinkingDisplayState, messageId)
				}
				return null
			}
			const nextState = this.createThinkingDisplayState(target, options)
			if (typeof this.$set === 'function') {
				this.$set(this.thinkingDisplayState, messageId, nextState)
			} else {
				this.thinkingDisplayState[messageId] = nextState
			}
			return nextState
		},
		ensureThinkingDisplayState(message, options = {}) {
			if (!message || !message.id) {
				return null
			}
			let state = this.thinkingDisplayState && this.thinkingDisplayState[message.id]
			if (!state) {
				state = this.createThinkingDisplayState(message, options)
				if (typeof this.$set === 'function') {
					this.$set(this.thinkingDisplayState, message.id, state)
				} else {
					this.thinkingDisplayState[message.id] = state
				}
			}
			if (!Array.isArray(state.steps)) {
				state.steps = []
			}
			if (typeof state.currentText !== 'string') {
				state.currentText = ''
			}
			return state
		},
		getCommonPrefixText(sourceText, targetText) {
			const source = String(sourceText || '')
			const target = String(targetText || '')
			let prefixLength = 0
			while (
				prefixLength < source.length
				&& prefixLength < target.length
				&& source[prefixLength] === target[prefixLength]
			) {
				prefixLength += 1
			}
			return target.slice(0, prefixLength)
		},
		syncThinkingDisplayState(message) {
			const state = this.ensureThinkingDisplayState(message, {
				seedFromMessage: true,
			})
			if (!state) {
				return null
			}
			const targetSteps = Array.isArray(message && message.thinkingSteps)
				? message.thinkingSteps.map((item) => String(item || ''))
				: []
			if (state.steps.length > targetSteps.length) {
				state.steps = state.steps.slice(0, targetSteps.length)
			}
			targetSteps.forEach((targetText, index) => {
				const displayText = String(state.steps[index] || '')
				if (state.steps[index] === undefined) {
					state.steps.push('')
					return
				}
				if (!targetText.startsWith(displayText)) {
					state.steps.splice(index, 1, this.getCommonPrefixText(displayText, targetText))
				}
			})
			const targetCurrentText = String(message && message.currentThinkingText || '')
			if (!targetCurrentText.startsWith(String(state.currentText || ''))) {
				state.currentText = this.getCommonPrefixText(state.currentText, targetCurrentText)
			}
			return state
		},
		getThinkingDisplaySteps(message) {
			const state = message && this.thinkingDisplayState ? this.thinkingDisplayState[message.id] : null
			if (state && Array.isArray(state.steps)) {
				return state.steps
			}
			return Array.isArray(message && message.thinkingSteps) ? message.thinkingSteps : []
		},
		getThinkingDisplayCurrentText(message) {
			const state = message && this.thinkingDisplayState ? this.thinkingDisplayState[message.id] : null
			if (state && typeof state.currentText === 'string') {
				return state.currentText
			}
			return String(message && message.currentThinkingText || '')
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
		stopThinkingTypewriter(messageId) {
			const timer = this.thinkingTypewriterTimers && this.thinkingTypewriterTimers[messageId]
			if (timer) {
				clearInterval(timer)
				delete this.thinkingTypewriterTimers[messageId]
			}
		},
		stopAllThinkingTypewriters() {
			Object.keys(this.thinkingTypewriterTimers || {}).forEach((messageId) => {
				this.stopThinkingTypewriter(messageId)
			})
		},
		clearAutoScrollTimer() {
			if (this.autoScrollTimer) {
				clearTimeout(this.autoScrollTimer)
				this.autoScrollTimer = null
			}
			this.autoScrollPendingForce = false
		},
		registerWindowScrollListener() {
			if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
				return
			}
			if (this.autoScrollWindowListenerRegistered) {
				return
			}
			window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
			this.autoScrollWindowListenerRegistered = true
		},
		unregisterWindowScrollListener() {
			if (typeof window === 'undefined' || typeof window.removeEventListener !== 'function') {
				return
			}
			if (!this.autoScrollWindowListenerRegistered) {
				return
			}
			window.removeEventListener('scroll', this.handleWindowScroll)
			this.autoScrollWindowListenerRegistered = false
		},
		handleWindowScroll() {
			this.updateAutoScrollState()
		},
		getPageScrollMetrics(scrollTopOverride) {
			if (typeof window === 'undefined' || typeof document === 'undefined') {
				return {
					scrollTop: 0,
					clientHeight: 0,
					scrollHeight: 0,
					distanceFromBottom: 0,
				}
			}

			const scrollingElement = document.scrollingElement || document.documentElement || document.body
			const documentElement = document.documentElement || {}
			const body = document.body || {}
			const rawScrollTop = Number(scrollTopOverride)
			const scrollTop = Number.isFinite(rawScrollTop)
				? rawScrollTop
				: Number(
					window.pageYOffset
					|| (scrollingElement && scrollingElement.scrollTop)
					|| documentElement.scrollTop
					|| body.scrollTop
					|| 0
				)
			const clientHeight = Number(
				window.innerHeight
				|| (scrollingElement && scrollingElement.clientHeight)
				|| documentElement.clientHeight
				|| body.clientHeight
				|| 0
			)
			const scrollHeight = Math.max(
				clientHeight,
				Number(scrollingElement && scrollingElement.scrollHeight || 0),
				Number(documentElement.scrollHeight || 0),
				Number(body.scrollHeight || 0)
			)
			return {
				scrollTop,
				clientHeight,
				scrollHeight,
				distanceFromBottom: Math.max(0, scrollHeight - scrollTop - clientHeight),
			}
		},
		isNearPageBottom(metrics = this.getPageScrollMetrics()) {
			return Number(metrics && metrics.distanceFromBottom || 0) <= AUTO_SCROLL_BOTTOM_THRESHOLD_PX
		},
		updateAutoScrollState(scrollTop) {
			const metrics = this.getPageScrollMetrics(scrollTop)
			const previousScrollTop = Number(this.autoScrollLastScrollTop || 0)
			const currentScrollTop = Number(metrics.scrollTop || 0)
			const isScrollingUp = currentScrollTop < previousScrollTop - 2
			const isNearBottom = this.isNearPageBottom(metrics)
			this.autoScrollLastScrollTop = currentScrollTop

			if (isScrollingUp) {
				this.autoScrollShouldFollow = false
				return
			}

			this.autoScrollShouldFollow = isNearBottom
		},
		shouldAutoScrollForNewContent() {
			return this.autoScrollShouldFollow && this.isNearPageBottom()
		},
		startThinkingTypewriter(messageId) {
			const target = this.getTargetMessageForTask(messageId)
			if (!target || target.role !== 'assistant') {
				return
			}
			this.syncThinkingDisplayState(target)
			if (this.thinkingTypewriterTimers[messageId]) {
				return
			}

			this.thinkingTypewriterTimers[messageId] = setInterval(() => {
				const currentTarget = this.getTargetMessageForTask(messageId)
				if (!currentTarget || currentTarget.role !== 'assistant') {
					this.stopThinkingTypewriter(messageId)
					return
				}
				const state = this.syncThinkingDisplayState(currentTarget)
				if (!state) {
					this.stopThinkingTypewriter(messageId)
					return
				}
				const targetSteps = Array.isArray(currentTarget.thinkingSteps)
					? currentTarget.thinkingSteps.map((item) => String(item || ''))
					: []
				let hasPending = false

				for (let index = 0; index < targetSteps.length; index += 1) {
					const fullText = targetSteps[index]
					const displayText = String(state.steps[index] || '')
					if (displayText.length >= fullText.length) {
						continue
					}
					hasPending = true
					const nextLength = Math.min(
						fullText.length,
						displayText.length + getTypewriterStepSize(fullText.length - displayText.length, true)
					)
					state.steps.splice(index, 1, fullText.slice(0, nextLength))
					break
				}

				if (!hasPending) {
					const fullCurrentText = String(currentTarget.currentThinkingText || '')
					const displayCurrentText = String(state.currentText || '')
					if (displayCurrentText.length < fullCurrentText.length) {
						hasPending = true
						const nextLength = Math.min(
							fullCurrentText.length,
							displayCurrentText.length + getTypewriterStepSize(fullCurrentText.length - displayCurrentText.length, true)
						)
						state.currentText = fullCurrentText.slice(0, nextLength)
					}
				}

				this.scrollToBottom()

				if (!hasPending) {
					this.stopThinkingTypewriter(messageId)
				}
			}, THINKING_TYPEWRITER_INTERVAL_MS)
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
				const step = getTypewriterStepSize(remaining, false)
				currentTarget.displayContent = fullText.slice(0, Math.min(fullText.length, displayText.length + step))
				this.persistConversation()
				this.scrollToBottom()
				if (currentTarget.displayContent.length >= fullText.length) {
					this.stopTypewriter(messageId)
				}
			}, TYPEWRITER_INTERVAL_MS)
		},
		getTargetMessageForTask(messageId) {
			return this.messages.find((message) => message && message.id === messageId) || null
		},
		buildReplyTaskId(messageId) {
			return ['reader-ai', this.novelId, this.currentSessionId, messageId, createTaskInstanceId()].join(':')
		},
		createActiveReplyTask(messageId) {
			return createPendingReplyTask({
				taskId: this.buildReplyTaskId(messageId),
				sessionId: this.currentSessionId,
				messageId,
				novelId: this.novelId,
				activeNovelId: this.effectiveNovelId,
				retrieverMode: this.retrieverMode,
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
				if (target.role === 'assistant') {
					target.displayContent = String(target.content || '')
				}
				this.resetThinkingDisplayStateForMessage(messageId, {
					seedFromMessage: true,
				})
			}
			this.stopTypewriter(messageId)
			this.stopThinkingTypewriter(messageId)
			this.loading = false
			this.statusText = ''
			if (this.activeReplyTask && String(this.activeReplyTask.messageId) === String(messageId)) {
				this.clearActiveReplyTask()
			}
			this.persistConversation()
			this.scrollToBottom()
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
			this.resetThinkingDisplayStateForMessage(messageId, {
				seedFromMessage: true,
			})
			this.contextUsage = createDefaultContextUsage()
			this.streamErrorMessage = ''
			this.statusText = ''
			this.stopTypewriter(messageId)
			this.clearTypewriterFadeTimer(messageId)
			this.stopThinkingTypewriter(messageId)
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
			this.startThinkingTypewriter(task.messageId)
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
				? this.getThinkingDisplaySteps(message)
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
			const text = String(this.getThinkingDisplayCurrentText(message) || '').trim()
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
		setRetrieverMode(mode) {
			if (this.loading) {
				return
			}
			this.retrieverMode = mode === 'fast' ? 'fast' : 'deep'
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
				actionItems.push('删除')
				if (message && message.role === 'user') {
					actionItems.push('回滚')
				}
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
			this.stopAllThinkingTypewriters()
			this.messages = this.normalizeStoredMessages(this.messages)
			this.rebuildThinkingDisplayState({
				seedFromMessage: true,
			})
			if (this.messages.length === 0) {
				this.messages = this.createInitialMessages()
				this.rebuildThinkingDisplayState({
					seedFromMessage: true,
				})
			}
			this.computeNextMessageId(this.messages)
			this.contextUsageTooltipVisible = false
			this.indexStatusTooltipVisible = false
			this.persistConversation()
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
			if (!message || message.role !== 'user') {
				return
			}
			const messageIndex = this.getMessageIndex(message)
			if (messageIndex <= 0) {
				return
			}
			const rollbackText = String(message.content || '').trim()
			const removeCount = this.messages.length - messageIndex
			uni.showModal({
				title: '确认回滚',
				content: '将删除这条消息及之后的 ' + removeCount + ' 条消息，并把这条消息放回输入框，确定继续吗？',
				confirmText: '回滚',
				confirmColor: '#c0503a',
				cancelText: '取消',
				success: (res) => {
					if (!res.confirm) {
						return
					}
					this.messages = this.messages.slice(0, messageIndex)
					this.draft = rollbackText
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
		updateActiveNovel(payload = {}) {
			const nextNovel = this.normalizeSessionActiveNovel(payload)
			if (!nextNovel || !nextNovel.novelId) {
				return
			}
			const previousNovelId = Number(this.effectiveNovelId || 0)
			this.activeNovel = nextNovel
			this.syncCurrentSession()
			if (Number(nextNovel.novelId) !== previousNovelId) {
				this.loadNovelIndexStatus()
			}
		},
		appendMessage(role, content, extra = {}, options = {}) {
			const message = this.createMessage(role, content, extra)
			this.messages.push(message)
			if (message.role === 'assistant') {
				this.resetThinkingDisplayStateForMessage(message.id, {
					seedFromMessage: true,
				})
			}
			this.persistConversation()
			this.scrollToBottom({
				force: options.forceScroll === true,
			})
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
			this.persistConversation()
		},
		appendThinkingStep(messageId, text, options = {}) {
			const target = this.messages.find((message) => message.id === messageId)
			const normalizedText = String(text || '').trim()
			if (!target || !normalizedText) {
				return
			}

			target.thinkingSteps = Array.isArray(target.thinkingSteps) ? target.thinkingSteps : []
			this.commitCurrentThinkingText(target)
			const shouldAppendStep = target.thinkingSteps[target.thinkingSteps.length - 1] !== normalizedText
			if (shouldAppendStep) {
				target.thinkingSteps.push(normalizedText)
			}
			target.thinkingSteps = target.thinkingSteps.slice(-80)
			const state = this.ensureThinkingDisplayState(target, {
				seedFromMessage: true,
			})
			if (state && shouldAppendStep) {
				state.steps = Array.isArray(state.steps) ? state.steps : []
				state.steps.push(options.immediate === true ? normalizedText : '')
				state.steps = state.steps.slice(-80)
				state.currentText = ''
			}
			target.currentThinkingText = ''
			target.thinkingExpanded = true
			if (options.immediate !== true) {
				this.startThinkingTypewriter(messageId)
			}
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
			const state = this.ensureThinkingDisplayState(target, {
				seedFromMessage: false,
			})
			if (state) {
				state.currentText = this.getCommonPrefixText(state.currentText, target.currentThinkingText)
			}
			this.startThinkingTypewriter(messageId)
		},
		appendCurrentThinkingText(messageId, text) {
			const target = this.messages.find((message) => message.id === messageId)
			const normalizedText = String(text || '')
			if (!target || !normalizedText) {
				return
			}
			target.currentThinkingText = String(target.currentThinkingText || '') + normalizedText
			this.ensureThinkingDisplayState(target, {
				seedFromMessage: false,
			})
			this.startThinkingTypewriter(messageId)
		},
		commitCurrentThinkingText(target) {
			const normalizedText = String(target && target.currentThinkingText || '').trim()
			if (!target || !normalizedText) {
				return
			}
			target.thinkingSteps = Array.isArray(target.thinkingSteps) ? target.thinkingSteps : []
			const shouldAppendStep = target.thinkingSteps[target.thinkingSteps.length - 1] !== normalizedText
			if (shouldAppendStep) {
				target.thinkingSteps.push(normalizedText)
				target.thinkingSteps = target.thinkingSteps.slice(-80)
			}
			if (shouldAppendStep) {
				const state = this.ensureThinkingDisplayState(target, {
					seedFromMessage: false,
				})
				if (state) {
					const seededText = normalizedText.startsWith(String(state.currentText || ''))
						? String(state.currentText || '')
						: this.getCommonPrefixText(state.currentText, normalizedText)
					state.steps = Array.isArray(state.steps) ? state.steps : []
					state.steps.push(seededText)
					state.steps = state.steps.slice(-80)
					state.currentText = ''
				}
			}
			target.currentThinkingText = ''
			this.startThinkingTypewriter(target.id)
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
			const state = this.ensureThinkingDisplayState(target, {
				seedFromMessage: false,
			})
			if (state) {
				state.currentText = ''
			}
			this.persistConversation()
		},
		getConversationPayload() {
			return normalizeConversationPayloadMessages(this.messages)
		},
		getTokenInfo() {
			let rawToken = null
			try {
				if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
					rawToken = uni.getStorageSync('token')
				}
				if (!rawToken && typeof window !== 'undefined' && window.localStorage) {
					rawToken = window.localStorage.getItem('token')
				}
				return typeof rawToken === 'string'
					? JSON.parse(rawToken || 'null')
					: rawToken || null
			} catch (error) {
				return null
			}
		},
		getAuthHeaders() {
			const token = this.getTokenInfo()
			const authToken = token && token.tk ? String(token.tk).trim() : ''
			return authToken ? { Authorization: 'Bearer ' + authToken } : {}
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
		stopReply() {
			const task = this.activeReplyTask
			const messageId = task && task.messageId
			if (!messageId) {
				return
			}
			this.abortActiveRequest()
			this.streamErrorMessage = ''
			this.clearCurrentThinkingText(messageId, { commit: true })
			const target = this.getTargetMessageForTask(messageId)
			if (target) {
				target.thinkingExpanded = false
				if (target.role === 'assistant' && !String(target.content || '').trim()) {
					this.updateMessageContent(messageId, '已停止回复')
				}
			}
			this.completeReplyTask(messageId, 'stopped')
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
				const authHeaders = this.getAuthHeaders()
				if (authHeaders.Authorization) {
					xhr.setRequestHeader('Authorization', authHeaders.Authorization)
				}

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
						let code = ''
						try {
							const data = JSON.parse(xhr.responseText || '{}')
							message = data.msg || data.message || message
							code = data.code || ''
						} catch (error) {}
						finish(() => {
							const requestError = new Error(message)
							requestError.code = code
							requestError.statusCode = xhr.status
							reject(requestError)
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
			const targetNovelId = Number(this.effectiveNovelId || this.novelId || 0)
			if (!targetNovelId) {
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
					readerAiBaseUrl + INDEX_STATUS_ROUTE + '?novel_id=' + encodeURIComponent(targetNovelId),
					{
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							...this.getAuthHeaders(),
						},
					}
				)
				if (!response.ok) {
					throw new Error('request failed')
				}
				const payload = await response.json()
				if (Number(this.effectiveNovelId || this.novelId || 0) !== targetNovelId) {
					return
				}
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
				if (Number(this.effectiveNovelId || this.novelId || 0) !== targetNovelId) {
					return
				}
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
			this.appendMessage('user', content, {}, {
				forceScroll: true,
			})
			this.draft = ''

			const assistantMessage = this.appendMessage('assistant', '', {
				displayContent: '',
				thinkingExpanded: true,
			}, {
				forceScroll: true,
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
				const insufficient = showInsufficientRedstoneOptions(error)
				this.handleReplyFailure(assistantMessage.id, error, { showToast: !insufficient })
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
				active_novel_id: taskState && taskState.activeNovelId ? taskState.activeNovelId : this.effectiveNovelId,
				retriever_mode: taskState && taskState.retrieverMode ? taskState.retrieverMode : this.retrieverMode,
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
					...this.getAuthHeaders(),
				},
				body: JSON.stringify(requestPayload),
				signal: controller ? controller.signal : undefined,
			})

			if (!response.ok) {
				let message = '请求失败，请稍后再试'
				let code = ''
				try {
					const data = await response.json()
					message = data.msg || data.message || message
					code = data.code || ''
				} catch (error) {}
				const requestError = new Error(message)
				requestError.code = code
				requestError.statusCode = response.status
				throw requestError
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
					activeNovelId: Number(event.active_novel_id || (this.activeReplyTask && this.activeReplyTask.activeNovelId) || this.effectiveNovelId || 0),
					retrieverMode: event.retriever_mode || (this.activeReplyTask && this.activeReplyTask.retrieverMode) || this.retrieverMode,
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
				const immediateStep = event.type === 'trace'
					|| event.type === 'tool'
					|| event.type === 'tool_call'
					|| event.type === 'tool_result'
				this.appendThinkingStep(messageId, this.getStreamEventText(event), {
					immediate: immediateStep,
				})
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

			if (event.type === 'active_novel') {
				this.updateActiveNovel(event)
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

			if (this.loading) {
				this.scrollToBottom()
			}
		},
		scrollToBottom(options = {}) {
			const force = options.force === true
			if (force) {
				this.autoScrollPendingForce = true
				this.autoScrollShouldFollow = true
			}
			if (this.autoScrollTimer) {
				return
			}
			if (!force && !this.shouldAutoScrollForNewContent()) {
				return
			}

			this.autoScrollTimer = setTimeout(() => {
				this.autoScrollTimer = null
				this.$nextTick(() => {
					const shouldForce = this.autoScrollPendingForce
					this.autoScrollPendingForce = false
					if (!shouldForce && !this.autoScrollShouldFollow) {
						return
					}
					this.scrollPageToBottom()
					setTimeout(() => {
						if (!shouldForce && !this.autoScrollShouldFollow) {
							return
						}
						this.scrollPageToBottom()
					}, AUTO_SCROLL_SETTLE_DELAY_MS)
				})
			}, AUTO_SCROLL_DELAY_MS)
		},
		scrollPageToBottom() {
			const metrics = this.getPageScrollMetrics()
			const scrollTop = Math.max(0, Number(metrics.scrollHeight || 0))
			if (typeof uni !== 'undefined' && typeof uni.pageScrollTo === 'function') {
				try {
					uni.pageScrollTo({
						scrollTop,
						duration: 0,
					})
				} catch (error) {}
			}

			if (typeof window !== 'undefined' && typeof document !== 'undefined') {
				const scrollingElement = document.scrollingElement || document.documentElement || document.body
				const documentHeight = Math.max(scrollTop, Number(metrics.scrollHeight || 0))
				try {
					window.scrollTo(0, documentHeight)
					if (scrollingElement) {
						scrollingElement.scrollTop = documentHeight
					}
				} catch (error) {}
			}
			this.autoScrollShouldFollow = true
			this.autoScrollLastScrollTop = scrollTop
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
</script>

<style scoped lang="scss">
.ask-log-girl-page {
	min-height: 100vh;
	background:
		radial-gradient(circle at top left, rgba(255, 230, 173, 0.42) 0%, rgba(255, 230, 173, 0) 34%),
		linear-gradient(180deg, #fff8ee 0%, #f7efe3 100%);

	.dark-mode & {
		background:
			radial-gradient(circle at top left, rgba(188, 145, 53, 0.18) 0%, rgba(188, 145, 53, 0) 36%),
			linear-gradient(180deg, #1f1a14 0%, #16120e 100%);
	}
}

.custom-nav-bar {
	position: sticky;
	top: 0;
	z-index: 20;
	background:
		radial-gradient(circle at top left, rgba(255, 230, 173, 0.42) 0%, rgba(255, 230, 173, 0) 34%),
		linear-gradient(180deg, #fff8ee 0%, #f7efe3 100%);

	.dark-mode & {
		background:
			radial-gradient(circle at top left, rgba(188, 145, 53, 0.18) 0%, rgba(188, 145, 53, 0) 36%),
			linear-gradient(180deg, #1f1a14 0%, #16120e 100%);
	}
}

.custom-nav-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 24rpx;
	box-sizing: border-box;
}

.nav-left {
	display: flex;
	align-items: center;
	min-width: 80rpx;
}

.nav-back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.72);
	backdrop-filter: blur(10rpx);
	box-shadow: 0 4rpx 12rpx rgba(145, 106, 33, 0.08);

	.dark-mode & {
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.18);
	}
}

.nav-center {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #2f2418;

	.dark-mode & {
		color: #f4ebdb;
	}
}

.nav-right {
	display: flex;
	align-items: center;
	min-width: 80rpx;
	justify-content: flex-end;
}

.nav-history-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.72);
	backdrop-filter: blur(10rpx);
	box-shadow: 0 4rpx 12rpx rgba(145, 106, 33, 0.08);

	.dark-mode & {
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.18);
	}
}

.chat-shell {
	min-height: calc(100vh - 88rpx);
	display: flex;
	flex-direction: column;
	padding: 32rpx 24rpx calc(280rpx + var(--loghome-safe-bottom, 0px));
	box-sizing: border-box;
}

.chat-header {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 26rpx 28rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.72);
	backdrop-filter: blur(16rpx);
	box-shadow: 0 18rpx 60rpx rgba(145, 106, 33, 0.08);

	.dark-mode & {
		background: rgba(255, 255, 255, 0.06);
		box-shadow: 0 18rpx 60rpx rgba(0, 0, 0, 0.22);
	}
}

.chat-badge {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.chat-header-main {
	flex: 1;
	min-width: 0;
}

.chat-history-trigger {
	padding: 14rpx 18rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 700;
	color: #8a6c45;
	background: rgba(207, 169, 96, 0.14);

	.dark-mode & {
		color: #d9c7a8;
		background: rgba(207, 169, 96, 0.18);
	}
}

.chat-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #2f2418;

	.dark-mode & {
		color: #f4ebdb;
	}
}

.chat-subtitle {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #876d4d;
	display: flex;
	align-items: center;
	gap: 10rpx;
	flex-wrap: wrap;

	.dark-mode & {
		color: #c3b49d;
	}
}

.active-novel-chip {
	display: inline-flex;
	align-items: center;
	height: 32rpx;
	padding: 0 12rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
	font-weight: 700;
	line-height: 32rpx;
	color: #9a5b13;
	background: rgba(207, 138, 37, 0.16);

	.dark-mode & {
		color: #e1bf82;
		background: rgba(207, 138, 37, 0.2);
	}
}

.chat-active-origin {
	margin-top: 6rpx;
	font-size: 21rpx;
	line-height: 1.4;
	color: #a08764;

	.dark-mode & {
		color: #b9a98e;
	}
}

.chat-session-name {
	margin-top: 8rpx;
	font-size: 22rpx;
	color: #b07d2e;

	.dark-mode & {
		color: #d7bc82;
	}
}

.chat-tip {
	margin-top: 18rpx;
	padding: 18rpx 24rpx;
	border-radius: 22rpx;
	font-size: 24rpx;
	line-height: 1.5;
	color: #7b6547;
	background: rgba(255, 255, 255, 0.56);

	.dark-mode & {
		color: #c9b99f;
		background: rgba(255, 255, 255, 0.05);
	}
}

.chat-messages {
	flex: 1;
	min-height: 0;
	margin-top: 20rpx;
	padding: 8rpx 4rpx 260rpx;
	box-sizing: border-box;
}

.chat-row {
	display: flex;
	margin-bottom: 18rpx;
}

.chat-row.assistant {
	justify-content: flex-start;
}

.chat-row.user {
	justify-content: flex-end;
}

.chat-bubble {
	max-width: 86%;
	padding: 20rpx 24rpx;
	border-radius: 24rpx;
	white-space: pre-wrap;
	word-break: break-word;
	box-shadow: 0 12rpx 36rpx rgba(80, 55, 15, 0.08);
}

.chat-thinking {
	margin-bottom: 14rpx;
	padding-bottom: 12rpx;
	border-bottom: 1rpx solid rgba(120, 120, 120, 0.12);
}

.chat-thinking-panel {
	width: 100%;
	max-height: 198rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	overflow: hidden;
	box-sizing: border-box;
}

.chat-thinking-panel.expanded {
	max-height: none;
	display: block;
	overflow: visible;
}

.chat-thinking-group {
	width: 100%;
	min-height: 0;
	padding-bottom: 2rpx;
}

.chat-thinking-status {
	display: flex;
	align-items: center;
	font-size: 22rpx;
	font-weight: 700;
	line-height: 1.45;
	color: #7f786b;

	.dark-mode & {
		color: #c7b9a4;
	}
}

.chat-thinking-status-text {
	display: inline-block;
	animation: thinking-word 5s ease-in-out infinite;
}

.chat-thinking-status + .chat-thinking-line {
	margin-top: 8rpx;
}

.chat-thinking-line {
	font-size: 22rpx;
	line-height: 1.55;
	color: #9a9489;
}

.chat-thinking-panel:not(.expanded) .chat-thinking-line {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.chat-thinking-panel:not(.expanded) .chat-thinking-line.active {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	white-space: normal;
}

.chat-thinking-line + .chat-thinking-line {
	margin-top: 6rpx;
}

.chat-thinking-line.active {
	color: #7f786b;

	.dark-mode & {
		color: #c7b9a4;
	}
}

.chat-thinking-toggle {
	margin-top: 8rpx;
	font-size: 22rpx;
	font-weight: 700;
	line-height: 1.4;
	color: #b26f1f;

	.dark-mode & {
		color: #d8b06b;
	}
}

.chat-thinking-dot {
	display: inline-block;
	animation: thinking-dot 1.2s ease-in-out infinite;
	opacity: 0.25;
}

.dot-two {
	animation-delay: 0.16s;
}

.dot-three {
	animation-delay: 0.32s;
}

@keyframes thinking-dot {
	0%,
	64%,
	100% {
		opacity: 0.25;
		transform: translateY(0);
	}

	30% {
		opacity: 1;
		transform: translateY(-2rpx);
	}
}

@keyframes thinking-word {
	0%,
	100% {
		opacity: 0.72;
		transform: translateY(0);
	}

	12%,
	84% {
		opacity: 1;
		transform: translateY(-1rpx);
	}
}

.chat-content {
	font-size: 28rpx;
	line-height: 1.7;
}

.chat-richtext {
	display: block;
	color: inherit;
}

.chat-content-placeholder {
	color: #8a847a;
}

.chat-row.assistant .chat-bubble {
	color: #33281c;
	background: rgba(255, 255, 255, 0.88);

	.dark-mode & {
		color: #f5ebdb;
		background: rgba(255, 255, 255, 0.07);
		box-shadow: none;
	}
}

.chat-row.user .chat-bubble {
	color: #fff9ef;
	background: linear-gradient(135deg, #d1902f 0%, #b96a17 100%);
}

.chat-input-wrap {
	position: fixed;
	left: 24rpx;
	right: 24rpx;
	bottom: calc(20rpx + var(--loghome-safe-bottom, 0px));
	padding: 20rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.82);
	box-shadow: 0 18rpx 60rpx rgba(145, 106, 33, 0.1);
	backdrop-filter: blur(5px);
	z-index: 10;

	.dark-mode & {
		background: rgba(255, 255, 255, 0.06);
		box-shadow: 0 18rpx 60rpx rgba(0, 0, 0, 0.24);
	}
}

.chat-clear-icon-btn {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #8a6c45;
	background: rgba(207, 169, 96, 0.13);
	box-shadow: inset 0 0 0 1rpx rgba(160, 120, 56, 0.12);
	z-index: 2;

	.dark-mode & {
		color: #e8d6b6;
		background: rgba(207, 169, 96, 0.12);
		box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.08);
	}
}

.chat-clear-icon {
	font-size: 30rpx;
	line-height: 1;
}

.chat-textarea {
	width: 100%;
	box-sizing: border-box;
	min-height: 96rpx;
	max-height: 320rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #2f2418;

	.dark-mode & {
		color: #f1e7d6;
	}
}

.chat-textarea.with-clear-context {
	padding-right: 72rpx;
}

.redstone-cost-row {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 8rpx;
}

.chat-action-row {
	margin-top: 16rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
}

.chat-action-left {
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
	gap: 12rpx;
	overflow: visible;
}

.chat-mode-toggle {
	flex: 0 0 auto;
	height: 62rpx;
	padding: 4rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	background: rgba(207, 169, 96, 0.13);
	box-shadow: inset 0 0 0 1rpx rgba(160, 120, 56, 0.1);

	.dark-mode & {
		background: rgba(207, 169, 96, 0.12);
		box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.08);
	}
}

.chat-mode-toggle.disabled {
	opacity: 0.58;
}

.chat-mode-option {
	min-width: 72rpx;
	height: 54rpx;
	padding: 0 16rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: 700;
	line-height: 1;
	color: #8a6c45;
	white-space: nowrap;

	.dark-mode & {
		color: #c9b89b;
	}
}

.chat-mode-option.active {
	color: #fff7ea;
	background: linear-gradient(135deg, #cf8a25 0%, #ae6111 100%);
	box-shadow: 0 8rpx 20rpx rgba(167, 99, 17, 0.18);

	.dark-mode & {
		color: #fff7ea;
	}
}

.index-status-wrap {
	position: relative;
	width: 58rpx;
	height: 58rpx;
	flex: 0 0 58rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 12;
}

.index-status-box {
	position: relative;
	width: 52rpx;
	height: 52rpx;
	border-radius: 12rpx;
	overflow: hidden;
	background: rgba(207, 169, 96, 0.12);
	box-shadow: inset 0 0 0 1rpx rgba(160, 120, 56, 0.12);

	.dark-mode & {
		background: rgba(207, 169, 96, 0.1);
		box-shadow: inset 0 0 0 1rpx rgba(207, 169, 96, 0.15);
	}
}

.index-status-water {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(180deg, #65a978 0%, #4a9462 100%);
	transition: height 0.3s ease;
}

.index-status-wave {
	position: absolute;
	top: -4rpx;
	left: 0;
	right: 0;
	height: 8rpx;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%);
	border-radius: 50% 50% 0 0;
}

.index-status-core {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 17rpx;
	font-weight: 800;
	line-height: 1;
	color: #fff;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);

	.dark-mode & {
		color: #f0e6d2;
		text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
	}
}

.index-status-tooltip {
	position: absolute;
	left: 0;
	bottom: 72rpx;
	width: 260rpx;
	padding: 18rpx 20rpx;
	border-radius: 18rpx;
	background: rgba(47, 36, 24, 0.94);
	box-shadow: 0 16rpx 42rpx rgba(40, 25, 7, 0.2);
	z-index: 30;
	box-sizing: border-box;

	.dark-mode & {
		background: rgba(245, 234, 216, 0.96);
	}
}

.index-status-tooltip-arrow {
	position: absolute;
	bottom: -10rpx;
	width: 20rpx;
	height: 20rpx;
	transform: translateX(-50%) rotate(45deg);
	background: rgba(47, 36, 24, 0.94);

	.dark-mode & {
		background: rgba(245, 234, 216, 0.96);
	}
}

.index-tooltip-title {
	font-size: 22rpx;
	font-weight: 700;
	line-height: 1.35;
	color: #fff4df;

	.dark-mode & {
		color: #2f2418;
	}
}

.index-tooltip-percent {
	margin-top: 8rpx;
	font-size: 30rpx;
	font-weight: 800;
	line-height: 1.2;
	color: #7ed49e;

	.dark-mode & {
		color: #4a9462;
	}
}

.index-tooltip-text {
	margin-top: 8rpx;
	font-size: 21rpx;
	line-height: 1.45;
	color: rgba(255, 244, 223, 0.82);

	.dark-mode & {
		color: rgba(47, 36, 24, 0.72);
	}
}

.index-tooltip-meta {
	margin-top: 6rpx;
	font-size: 20rpx;
	line-height: 1.4;
	color: rgba(255, 244, 223, 0.62);

	.dark-mode & {
		color: rgba(47, 36, 24, 0.58);
	}
}

.context-usage-wrap {
	position: relative;
	width: 58rpx;
	height: 58rpx;
	flex: 0 0 58rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 12;
}

.context-usage-ring {
	width: 58rpx;
	height: 58rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: inset 0 0 0 1rpx rgba(160, 120, 56, 0.08);
}

.context-usage-core {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18rpx;
	font-weight: 800;
	line-height: 1;
	color: #8a6c45;
	background: rgba(255, 250, 242, 0.96);

	.dark-mode & {
		color: #e0c997;
		background: rgba(33, 27, 20, 0.98);
	}
}

.context-usage-tooltip {
	position: absolute;
	left: 0;
	bottom: 72rpx;
	width: 260rpx;
	padding: 18rpx 20rpx;
	border-radius: 18rpx;
	background: rgba(47, 36, 24, 0.94);
	box-shadow: 0 16rpx 42rpx rgba(40, 25, 7, 0.2);
	z-index: 30;
	box-sizing: border-box;

	.dark-mode & {
		background: rgba(245, 234, 216, 0.96);
	}
}

.context-usage-tooltip-arrow {
	position: absolute;
	bottom: -10rpx;
	width: 20rpx;
	height: 20rpx;
	transform: translateX(-50%) rotate(45deg);
	background: rgba(47, 36, 24, 0.94);

	.dark-mode & {
		background: rgba(245, 234, 216, 0.96);
	}
}

.context-tooltip-title {
	font-size: 22rpx;
	font-weight: 700;
	line-height: 1.35;
	color: #fff4df;

	.dark-mode & {
		color: #2f2418;
	}
}

.context-tooltip-percent {
	margin-top: 8rpx;
	font-size: 30rpx;
	font-weight: 800;
	line-height: 1.2;
	color: #ffd994;

	.dark-mode & {
		color: #9c6214;
	}
}

.context-tooltip-note {
	margin-top: 8rpx;
	font-size: 21rpx;
	line-height: 1.45;
	color: rgba(255, 244, 223, 0.78);

	.dark-mode & {
		color: rgba(47, 36, 24, 0.72);
	}
}

.chat-send {
	min-width: 156rpx;
	height: 72rpx;
	padding: 0 28rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 700;
	color: #fff7ea;
	background: linear-gradient(135deg, #cf8a25 0%, #ae6111 100%);
	box-shadow: 0 12rpx 32rpx rgba(167, 99, 17, 0.24);
}

.chat-send.disabled {
	opacity: 0.45;
	box-shadow: none;
}

.chat-send.stop {
	color: #fff4ef;
	background: linear-gradient(135deg, #b84934 0%, #8f2e24 100%);
}

.history-drawer {
	&.open .history-drawer-mask {
		opacity: 1;
		pointer-events: auto;
	}
	&.open .history-drawer-panel {
		transform: translateY(0);
	}
}

.history-drawer-mask {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0);
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s ease, background 0.3s ease;
	z-index: 90;
}

.history-drawer-panel {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	max-height: 75vh;
	border-radius: 40rpx 40rpx 0 0;
	background: linear-gradient(180deg, #fffcf5 0%, #fff8ee 100%);
	transform: translateY(100%);
	transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
	z-index: 91;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.dark-mode & {
		background: linear-gradient(180deg, #262018 0%, #1f1a14 100%);
	}
}

.history-drawer-handle {
	padding: 16rpx 0 0;
	display: flex;
	justify-content: center;
}

.history-drawer-handle-bar {
	width: 64rpx;
	height: 8rpx;
	border-radius: 999rpx;
	background: rgba(160, 120, 56, 0.24);

	.dark-mode & {
		background: rgba(255, 255, 255, 0.12);
	}
}

.history-drawer-header {
	padding: 20rpx 32rpx 16rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.history-drawer-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #2f2418;

	.dark-mode & {
		color: #f4ebdb;
	}
}

.history-drawer-close {
	width: 56rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.6);
	box-shadow: 0 4rpx 12rpx rgba(145, 106, 33, 0.08);

	.dark-mode & {
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.18);
	}
}

.history-drawer-search {
	padding: 0 32rpx 12rpx;
}

.history-search-wrap {
	display: flex;
	align-items: center;
	height: 72rpx;
	padding: 0 20rpx;
	border-radius: 20rpx;
	background: rgba(255, 255, 255, 0.72);
	box-shadow: inset 0 0 0 1rpx rgba(160, 120, 56, 0.1);

	.dark-mode & {
		background: rgba(255, 255, 255, 0.06);
		box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.08);
	}
}

.search-icon {
	margin-right: 12rpx;
	flex-shrink: 0;
}

.history-search-input {
	flex: 1;
	height: 72rpx;
	font-size: 26rpx;
	color: #2f2418;
	background: transparent;

	.dark-mode & {
		color: #f4ead8;
	}
}

.history-search-placeholder {
	color: #b8a58a;
}

.history-drawer-scroll {
	flex: 1;
	min-height: 0;
	padding: 8rpx 32rpx calc(40rpx + var(--loghome-safe-bottom, 0px));
	box-sizing: border-box;
}

.history-book-group + .history-book-group {
	margin-top: 18rpx;
}

.history-book-title {
	margin: 8rpx 8rpx 14rpx;
	font-size: 24rpx;
	font-weight: 700;
	color: #8f6a35;

	.dark-mode & {
		color: #d5ba83;
	}
}

.history-session-card {
	position: relative;
	padding: 18rpx 18rpx 16rpx;
	margin: 15rpx 0;
	border-radius: 22rpx;
	background: rgba(255, 255, 255, 0.82);
	box-shadow: 0 10rpx 28rpx rgba(96, 67, 20, 0.06);
	overflow: hidden;
}

.history-session-delete {
	display: none;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 160rpx;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #fff;
	background: #c0503a;
	border-radius: 0 22rpx 22rpx 0;
}

.history-session-card.swiped .history-session-delete {
	display: flex;
}

.history-session-content {
	transition: transform 0.25s ease;
}

.history-session-card.swiped .history-session-content {
	transform: translateX(-160rpx);
}

.history-session-card.active {
	box-shadow: inset 0 0 0 2rpx rgba(207, 138, 37, 0.55), 0 12rpx 30rpx rgba(96, 67, 20, 0.08);
}

.history-session-title {
	font-size: 26rpx;
	font-weight: 700;
	line-height: 1.4;
	color: #32261a;

	.dark-mode & {
		color: #f4ead8;
	}
}

.history-session-meta {
	margin-top: 8rpx;
	font-size: 21rpx;
	color: #9a8464;

	.dark-mode & {
		color: #bfae90;
	}
}

.history-session-preview {
	margin-top: 10rpx;
	font-size: 23rpx;
	line-height: 1.6;
	color: #7e6b52;

	.dark-mode & {
		color: #cbbca2;
	}
}

.history-empty {
	padding: 120rpx 32rpx;
	text-align: center;
	font-size: 24rpx;
	line-height: 1.7;
	color: #9a8464;

	.dark-mode & {
		color: #bfae90;
	}
}
</style>
