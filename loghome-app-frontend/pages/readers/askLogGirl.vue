<template>
	<view class="ask-log-girl-page" v-dark>
		<view class="chat-shell">
			<view class="chat-header">
				<view class="chat-badge">AI</view>
				<view class="chat-header-main">
					<view class="chat-title">问问原木娘</view>
					<view class="chat-subtitle">{{ novelName || ('作品 ' + novelId) }}</view>
					<view class="chat-session-name">{{ currentSessionTitle }}</view>
				</view>
				<view class="chat-history-trigger" @tap="openHistoryPanel">历史记录</view>
			</view>

			<view class="chat-tip">
				你可以直接问我剧情、角色关系、设定相关的任何问题。
			</view>

			<scroll-view
				class="chat-messages"
				scroll-y
				:scroll-into-view="scrollAnchorId"
			>
				<view
					class="chat-row"
					v-for="message in messages"
					:key="message.id"
					:class="message.role === 'user' ? 'user' : 'assistant'"
				>
					<view class="chat-bubble">
						<view
							class="chat-thinking"
							v-if="message.role === 'assistant' && (hasReasoningSummary(message) || hasToolTrace(message))"
						>
							<view class="chat-thinking-group" v-if="hasReasoningSummary(message)">
								<view class="chat-thinking-label">思考过程</view>
								<view
									class="chat-thinking-line"
									v-for="(step, index) in message.reasoningSteps"
									:key="message.id + '-reasoning-' + index"
								>
									{{ step }}
								</view>
							</view>
							<view class="chat-thinking-group" v-if="hasToolTrace(message)">
								<view class="chat-thinking-label" v-if="hasReasoningSummary(message)">工具链</view>
								<view
									class="chat-thinking-line"
									v-for="(step, index) in message.thinkingSteps"
									:key="message.id + '-thinking-' + index"
								>
									{{ step }}
								</view>
								<view class="chat-thinking-line active" v-if="message.currentThinkingText">
									{{ message.currentThinkingText }}
								</view>
							</view>
						</view>
						<view class="chat-content" v-if="message.content">
							<rich-text
								v-if="message.role === 'assistant'"
								class="chat-richtext"
								:nodes="renderAssistantMarkdown(message)"
								@itemclick="handleAssistantItemClick($event, message)"
							></rich-text>
							<text v-else>{{ message.content }}</text>
						</view>
						<view
							class="chat-content chat-content-placeholder"
							v-if="!message.content && message.role === 'assistant' && (hasReasoningSummary(message) || hasToolTrace(message))"
						>
							正在生成回答...
						</view>
					</view>
				</view>
				<view :id="scrollAnchorId" class="scroll-anchor"></view>
			</scroll-view>

			<view class="chat-input-wrap">
				<textarea
					v-model="draft"
					class="chat-textarea"
					placeholder="输入你想问的问题"
					auto-height
					maxlength="-1"
					confirm-type="send"
					@confirm="submitQuestion"
				/>
				<view class="chat-action-row">
					<view class="chat-action-left">
						<view class="chat-toggle" :class="{ active: deepThinking, disabled: loading }" @tap="toggleDeepThinking">
							深度思考 {{ deepThinking ? '开' : '关' }}
						</view>
						<view class="chat-clear" @tap="clearConversation" v-if="messages.length > 1 && !loading">
							清空上下文
						</view>
					</view>
					<view class="chat-send" :class="{ disabled: !canSend }" @tap="submitQuestion">
						{{ loading ? '思考中' : '发送' }}
					</view>
				</view>
			</view>
		</view>

		<view class="history-mask" v-if="historyPanelVisible" @tap="closeHistoryPanel"></view>
		<view class="history-panel" v-if="historyPanelVisible">
			<view class="history-panel-header">
				<view class="history-panel-title">历史聊天记录</view>
				<view class="history-panel-close" @tap="closeHistoryPanel">关闭</view>
			</view>
			<view class="history-search">
				<input
					v-model="historyKeyword"
					class="history-search-input"
					type="text"
					confirm-type="search"
					placeholder="按书名或聊天内容搜索"
					placeholder-style="color: #b8a58a;"
				/>
			</view>
			<scroll-view class="history-panel-scroll" scroll-y>
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
							:class="{ active: isCurrentHistorySession(book.novelId, session.sessionId) }"
							@tap="selectHistorySession(book, session)"
						>
							<view class="history-session-title">{{ session.title }}</view>
							<view class="history-session-meta">
								{{ formatHistoryTime(session.updatedAt) }}
								<text v-if="session.deepThinking"> · 深度思考</text>
							</view>
							<view class="history-session-preview">{{ session.preview || '暂无对话内容' }}</view>
						</view>
					</view>
				</block>
				<view v-else class="history-empty">
					{{ historyKeyword ? '没有找到匹配的历史记录' : '暂时还没有历史聊天记录' }}
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import darkModeMixin from '@/mixins/dark-mode.js'

const STREAM_ROUTE = '/library/reader_novel_ai_chat_stream'
const SCROLL_ANCHOR_ID = 'chat-bottom-anchor'
const HISTORY_STORAGE_KEY = 'reader_ask_log_girl_history_v2'
const LEGACY_STORAGE_KEY_PREFIX = 'reader_ask_log_girl_'
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

	lines.forEach(function (line) {
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
			return
		}

		if (inCodeBlock) {
			codeLines.push(line)
			return
		}

		if (!trimmed) {
			flushParagraph()
			flushList()
			return
		}

		if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
			flushParagraph()
			flushList()
			htmlParts.push('<hr style="' + MARKDOWN_STYLES.hr + '" />')
			return
		}

		const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/)
		if (headingMatch) {
			flushParagraph()
			flushList()
			const level = headingMatch[1].length
			const tag = 'h' + level
			const style = MARKDOWN_STYLES[tag]
			htmlParts.push('<' + tag + ' style="' + style + '">' + renderInlineMarkdown(headingMatch[2]) + '</' + tag + '>')
			return
		}

		const quoteMatch = trimmed.match(/^>\s?(.*)$/)
		if (quoteMatch) {
			flushParagraph()
			flushList()
			htmlParts.push('<blockquote style="' + MARKDOWN_STYLES.blockquote + '">' + renderInlineMarkdown(quoteMatch[1]) + '</blockquote>')
			return
		}

		const unorderedMatch = trimmed.match(/^[-*+]\s+(.*)$/)
		if (unorderedMatch) {
			flushParagraph()
			if (listType && listType !== 'ul') {
				flushList()
			}
			listType = 'ul'
			listItems.push(unorderedMatch[1])
			return
		}

		const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/)
		if (orderedMatch) {
			flushParagraph()
			if (listType && listType !== 'ol') {
				flushList()
			}
			listType = 'ol'
			listItems.push(orderedMatch[1])
			return
		}

		if (listType) {
			flushList()
		}

		paragraphLines.push(trimmed)
	})

	flushParagraph()
	flushList()
	flushCodeBlock()

	return htmlParts.join('')
}

function createSessionId() {
	return 'session-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

function stripCitationMarkers(text) {
	return String(text || '').replace(/\[\[cite:[a-zA-Z0-9_-]+\]\]/g, '').replace(/\s+/g, ' ').trim()
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
			deepThinking: false,
			historyPanelVisible: false,
			historyKeyword: '',
			chatHistoryStore: {
				version: 2,
				books: [],
			},
			scrollAnchorId: SCROLL_ANCHOR_ID,
			nextMessageId: 1,
			abortController: null,
			messages: [],
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
	},
	onLoad(option) {
		this.novelId = Number(option.novel_id || 0)
		this.novelName = option.novel_name ? decodeURIComponent(option.novel_name) : ''
		this.initializeConversation(option.session_id || '')
	},
	onUnload() {
		this.abortActiveRequest()
		this.persistConversation()
	},
	methods: {
		getStorageKey() {
			return HISTORY_STORAGE_KEY
		},
		getLegacyStorageKey(novelId = this.novelId) {
			return LEGACY_STORAGE_KEY_PREFIX + String(novelId || 0)
		},
		normalizeStoredCitations(rawCitations) {
			return (Array.isArray(rawCitations) ? rawCitations : [])
				.filter((item) => item && typeof item === 'object' && Number(item.article_id))
				.map((item, index) => ({
					citation_id: String(item.citation_id || ('citation-' + index)),
					article_id: Number(item.article_id),
					chapter: item.chapter === null || item.chapter === undefined ? null : Number(item.chapter),
					title: String(item.title || ''),
					paragraph_id: item.paragraph_id === null || item.paragraph_id === undefined || item.paragraph_id === ''
						? null
						: Number(item.paragraph_id),
					snippet: String(item.snippet || ''),
					source: String(item.source || ''),
					displayIndex: Number(item.displayIndex || item.display_index || (index + 1)),
				}))
		},
		buildCitationDisplayMap(citations) {
			const map = {}
			this.normalizeStoredCitations(citations).forEach((item, index) => {
				map[item.citation_id] = Number(item.displayIndex || (index + 1))
			})
			return map
		},
		renderAssistantMarkdown(message) {
			const content = typeof message === 'string' ? message : String((message && message.content) || '')
			const citationMap = this.buildCitationDisplayMap(message && message.citations)
			const citationTokens = []
			let normalizedContent = content.replace(/\[\[cite:([a-zA-Z0-9_-]+)\]\]/g, (match, citationId) => {
				const normalizedCitationId = String(citationId || '').trim()
				const displayIndex = citationMap[normalizedCitationId]
				if (!displayIndex) {
					return ''
				}
				const token = '@@CITATIONTOKEN' + citationTokens.length + '@@'
				citationTokens.push(
					'<a href="citation://' + escapeAttribute(normalizedCitationId)
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
				thinkingSteps: Array.isArray(extra.thinkingSteps) ? extra.thinkingSteps.slice(0, 12) : [],
				reasoningSteps: Array.isArray(extra.reasoningSteps) ? extra.reasoningSteps.slice(0, 12) : [],
				citations: this.normalizeStoredCitations(extra.citations),
				currentThinkingText: String(extra.currentThinkingText || ''),
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
				deepThinking: options.deepThinking === true,
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
					thinkingSteps: Array.isArray(message.thinkingSteps)
						? message.thinkingSteps.map((item) => String(item || '')).filter(Boolean).slice(0, 12)
						: [],
					reasoningSteps: Array.isArray(message.reasoningSteps)
						? message.reasoningSteps.map((item) => String(item || '')).filter(Boolean).slice(0, 12)
						: [],
					citations: this.normalizeStoredCitations(message.citations),
					currentThinkingText: '',
				}))
				.filter((message) => {
					return message.role === 'user'
						|| String(message.content || '').trim()
						|| (message.thinkingSteps && message.thinkingSteps.length > 0)
						|| (message.reasoningSteps && message.reasoningSteps.length > 0)
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
				deepThinking: rawSession && rawSession.deepThinking === true,
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
			const books = this.getSortedHistoryBooks()
			const keyword = String(this.historyKeyword || '').trim().toLowerCase()
			if (!keyword) {
				return books
			}
			return books
				.map((book) => {
					const bookName = String(book.novelName || '').toLowerCase()
					if (bookName.includes(keyword)) {
						return book
					}
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
			this.currentSessionId = String(session.sessionId || '')
			this.messages = this.normalizeStoredMessages(session.messages)
			this.deepThinking = session.deepThinking === true
			this.statusText = ''
			this.streamErrorMessage = ''
			this.computeNextMessageId(this.messages)
			const bookGroup = this.ensureCurrentBookGroup()
			bookGroup.lastSessionId = this.currentSessionId
			bookGroup.updatedAt = Number(session.updatedAt || Date.now())
			this.persistHistoryStore()
			this.scrollToBottom()
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
					deepThinking: this.deepThinking,
					createdAt: currentTime,
					updatedAt: currentTime,
				})
				bookGroup.sessions.unshift(session)
				this.currentSessionId = session.sessionId
			}
			session.messages = this.normalizeStoredMessages(this.messages)
			session.deepThinking = this.deepThinking === true
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
					deepThinking: parsed.deepThinking === true,
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
				deepThinking: this.deepThinking,
				createdAt: currentTime,
				updatedAt: currentTime,
			})
			bookGroup.sessions.unshift(session)
			bookGroup.lastSessionId = session.sessionId
			bookGroup.updatedAt = currentTime
			this.currentSessionId = session.sessionId
			this.messages = this.normalizeStoredMessages(session.messages)
			this.computeNextMessageId(this.messages)
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
		hasToolTrace(message) {
			return !!(
				message
				&& (
					(Array.isArray(message.thinkingSteps) && message.thinkingSteps.length > 0)
					|| String(message.currentThinkingText || '').trim()
				)
			)
		},
		hasReasoningSummary(message) {
			return !!(
				message
				&& Array.isArray(message.reasoningSteps)
				&& message.reasoningSteps.length > 0
			)
		},
		isCurrentHistorySession(novelId, sessionId) {
			return Number(novelId) === Number(this.novelId) && String(sessionId) === String(this.currentSessionId)
		},
		selectHistorySession(book, session) {
			if (!book || !session) {
				return
			}
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
		toggleDeepThinking() {
			if (this.loading) {
				return
			}
			this.deepThinking = !this.deepThinking
			this.syncCurrentSession()
		},
		clearConversation() {
			if (this.loading) {
				return
			}
			this.createNewSession()
			this.showToast('已新建会话')
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
			if (target.thinkingSteps[target.thinkingSteps.length - 1] !== normalizedText) {
				target.thinkingSteps.push(normalizedText)
			}
			target.currentThinkingText = ''
			this.scrollToBottom()
			this.persistConversation()
		},
		appendReasoningStep(messageId, text) {
			const target = this.messages.find((message) => message.id === messageId)
			const normalizedText = String(text || '').trim()
			if (!target || !normalizedText) {
				return
			}
			target.reasoningSteps = Array.isArray(target.reasoningSteps) ? target.reasoningSteps : []
			if (target.reasoningSteps[target.reasoningSteps.length - 1] !== normalizedText) {
				target.reasoningSteps.push(normalizedText)
			}
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
			this.scrollToBottom()
		},
		clearCurrentThinkingText(messageId) {
			const target = this.messages.find((message) => message.id === messageId)
			if (!target) {
				return
			}
			target.currentThinkingText = ''
			this.persistConversation()
		},
		getConversationPayload() {
			return this.messages
				.filter((message) => {
					return (message.role === 'user' || message.role === 'assistant')
						&& String(message.content || '').trim()
				})
				.map((message) => ({
					role: message.role,
					content: String(message.content || '').replace(/\[\[cite:[a-zA-Z0-9_-]+\]\]/g, '').trim(),
				}))
		},
		abortActiveRequest() {
			if (this.abortController) {
				this.abortController.abort()
				this.abortController = null
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
			this.appendMessage('user', content)
			this.draft = ''

			const assistantMessage = this.appendMessage('assistant', '')
			this.loading = true
			this.statusText = '原木娘正在整理这本书的资料'

			try {
				await this.streamChat(assistantMessage.id)
				const finalMessage = this.messages.find((message) => message.id === assistantMessage.id)
				if (!finalMessage || !String(finalMessage.content || '').trim()) {
					this.updateMessageContent(assistantMessage.id, '这次我没有顺利组织出答案，你可以换个问法再试一次。')
				}
			} catch (error) {
				if (error && error.name === 'AbortError') {
					return
				}
				const fallbackMessage = error && error.message ? error.message : '原木娘暂时没有响应，请稍后再试'
				this.updateMessageContent(assistantMessage.id, fallbackMessage)
				this.showToast(fallbackMessage)
			} finally {
				this.loading = false
				this.statusText = ''
				this.streamErrorMessage = ''
				this.abortController = null
			}
		},
		async streamChat(messageId) {
			this.abortActiveRequest()
			const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
			this.abortController = controller

			const response = await fetch(this.$baseUrl + STREAM_ROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/x-ndjson',
				},
				body: JSON.stringify({
					novel_id: this.novelId,
					messages: this.getConversationPayload(),
					deep_thinking: this.deepThinking,
				}),
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
				this.statusText = event.message || ''
				this.setCurrentThinkingText(messageId, event.message || '')
				return
			}

			if (event.type === 'trace') {
				this.appendThinkingStep(messageId, event.text || '')
				return
			}

			if (event.type === 'reasoning') {
				this.appendReasoningStep(messageId, event.text || '')
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

			if (event.type === 'error') {
				this.streamErrorMessage = event.message || '原木娘暂时没有响应，请稍后再试'
				this.clearCurrentThinkingText(messageId)
				return
			}

			if (event.type === 'done') {
				this.statusText = ''
				this.clearCurrentThinkingText(messageId)
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

.chat-shell {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	padding: 32rpx 24rpx calc(280rpx + env(safe-area-inset-bottom));
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
	width: 84rpx;
	height: 84rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 800;
	letter-spacing: 3rpx;
	color: #5d4014;
	background: linear-gradient(135deg, #ffeab8 0%, #ffd36f 100%);
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

	.dark-mode & {
		color: #c3b49d;
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

.chat-thinking-group + .chat-thinking-group {
	margin-top: 12rpx;
}

.chat-thinking-label {
	margin-bottom: 8rpx;
	font-size: 21rpx;
	line-height: 1.4;
	color: #a69a89;
}

.chat-thinking-line {
	font-size: 22rpx;
	line-height: 1.55;
	color: #9a9489;
}

.chat-thinking-line + .chat-thinking-line {
	margin-top: 6rpx;
}

.chat-thinking-line.active {
	color: #7f786b;
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

.scroll-anchor {
	height: 2rpx;
}

.chat-input-wrap {
	position: fixed;
	left: 24rpx;
	right: 24rpx;
	bottom: calc(20rpx + env(safe-area-inset-bottom));
	padding: 20rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.82);
	box-shadow: 0 18rpx 60rpx rgba(145, 106, 33, 0.1);
	z-index: 10;

	.dark-mode & {
		background: rgba(255, 255, 255, 0.06);
		box-shadow: 0 18rpx 60rpx rgba(0, 0, 0, 0.24);
	}
}

.chat-textarea {
	width: 100%;
	min-height: 96rpx;
	max-height: 320rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #2f2418;

	.dark-mode & {
		color: #f1e7d6;
	}
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
	overflow: hidden;
}

.chat-toggle {
	padding: 12rpx 18rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 700;
	color: #8a6c45;
	background: rgba(207, 169, 96, 0.12);

	.dark-mode & {
		color: #d6c4a6;
		background: rgba(207, 169, 96, 0.18);
	}
}

.chat-toggle.active {
	color: #fff8ec;
	background: linear-gradient(135deg, #cf8a25 0%, #ae6111 100%);
}

.chat-toggle.disabled {
	opacity: 0.5;
}

.chat-clear {
	padding: 12rpx 18rpx;
	font-size: 22rpx;
	color: #8a6c45;
	white-space: nowrap;

	.dark-mode & {
		color: #c9b89b;
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

.history-mask {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.32);
	z-index: 18;
}

.history-panel {
	position: fixed;
	left: 24rpx;
	right: 24rpx;
	top: 120rpx;
	bottom: calc(36rpx + env(safe-area-inset-bottom));
	border-radius: 30rpx;
	background: rgba(255, 249, 239, 0.97);
	box-shadow: 0 22rpx 80rpx rgba(40, 25, 7, 0.22);
	z-index: 19;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.dark-mode & {
		background: rgba(28, 22, 16, 0.98);
	}
}

.history-panel-header {
	padding: 24rpx 26rpx 18rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid rgba(120, 120, 120, 0.12);
}

.history-search {
	padding: 18rpx 20rpx 0;
}

.history-search-input {
	height: 74rpx;
	padding: 0 22rpx;
	border-radius: 18rpx;
	font-size: 24rpx;
	color: #2f2418;
	background: rgba(255, 255, 255, 0.86);
	box-sizing: border-box;

	.dark-mode & {
		color: #f4ead8;
		background: rgba(255, 255, 255, 0.08);
	}
}

.history-panel-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #2f2418;

	.dark-mode & {
		color: #f4ebdb;
	}
}

.history-panel-close {
	font-size: 24rpx;
	color: #8a6c45;

	.dark-mode & {
		color: #cfbe9c;
	}
}

.history-panel-scroll {
	flex: 1;
	min-height: 0;
	padding: 12rpx 20rpx 26rpx;
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
	padding: 18rpx 18rpx 16rpx;
	border-radius: 22rpx;
	background: rgba(255, 255, 255, 0.82);
	box-shadow: 0 10rpx 28rpx rgba(96, 67, 20, 0.06);
}

.history-session-card + .history-session-card {
	margin-top: 12rpx;
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
