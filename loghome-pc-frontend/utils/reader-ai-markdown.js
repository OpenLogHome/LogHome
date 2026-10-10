// Mobile reader Markdown blocks, adapted to CSS pixels and safe native links.
import { aiCitationId, aiCitationUrl } from './reader-ai'
const MARKDOWN_STYLES = {
	h1: 'font-size: 17px; font-weight: 700; margin: 10px 0 6px; line-height: 1.45;',
	h2: 'font-size: 15.5px; font-weight: 700; margin: 9px 0 6px; line-height: 1.45;',
	h3: 'font-size: 14.5px; font-weight: 700; margin: 8px 0 5px; line-height: 1.45;',
	p: 'margin: 0 0 7px; line-height: 1.8;',
	ul: 'margin: 0 0 7px; padding-left: 15px;',
	ol: 'margin: 0 0 7px; padding-left: 17px;',
	li: 'margin: 0 0 4px; line-height: 1.8;',
	blockquote: 'margin: 0 0 7px; padding: 4px 0 4px 9px; border-left: 3px solid rgba(125, 125, 125, 0.25); color: #8a847a; line-height: 1.8;',
	pre: 'margin: 0 0 7px; padding: 9px 10px; border-radius: 8px; background: rgba(24, 24, 24, 0.92); color: #f5f0e6; overflow-x: auto; white-space: pre-wrap; line-height: 1.7;',
	code: 'padding: 1px 4px; border-radius: 4px; background: rgba(0, 0, 0, 0.06); font-family: monospace;',
	hr: 'margin: 9px 0; border: none; border-top: 0.5px solid rgba(120, 120, 120, 0.18);',
	a: 'color: #b66a16; text-decoration: underline;',
	table: 'width: 100%; margin: 0 0 8px; border-collapse: collapse; table-layout: fixed; overflow-wrap: anywhere;',
	th: 'padding: 5px 6px; border: 0.5px solid rgba(150, 118, 70, 0.26); background: rgba(207, 169, 96, 0.14); font-weight: 700; line-height: 1.6; word-break: break-word; vertical-align: top;',
	td: 'padding: 5px 6px; border: 0.5px solid rgba(150, 118, 70, 0.22); line-height: 1.6; word-break: break-word; vertical-align: top;',
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
  const tokens = [], protect = html => { const key = `\u0000${tokens.length}\u0000`; tokens.push(html); return key }
  let text = String(rawText || '').replace(/\u0000/g, '')
  text = text.replace(/`([^`\n]+)`/g, (_, code) => protect('<code style="' + MARKDOWN_STYLES.code + '">' + escapeHtml(code) + '</code>'))
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => protect('<a href="' + escapeAttribute(url) + '" target="_blank" rel="noopener noreferrer" style="' + MARKDOWN_STYLES.a + '">' + escapeHtml(label) + '</a>'))
  text = escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>').replace(/_([^_\n]+)_/g, '<em>$1</em>').replace(/~~([^~]+)~~/g, '<del>$1</del>')
  return text.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)] || '')
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

export function renderAiMarkdown(message) {
  const citations = new Map()
  for (const item of message.citations || []) {
    citations.set(item.id, item)
    if (item.articleId) {
      citations.set(`a${item.articleId}`, item)
      if (item.paragraphId) citations.set(`a${item.articleId}p${item.paragraphId}`, item)
    }
  }
  let codeDepth = 0
  // Resolve markers only in text nodes, never inside link attributes or code blocks.
  return renderMarkdownToHtml(message.content).split(/(<[^>]*>)/g).map(part => {
    if (part.startsWith('<')) {
      if (/^<(?:pre|code)(?:\s|>)/.test(part)) codeDepth++
      if (/^<\/(?:pre|code)>/.test(part)) codeDepth = Math.max(0, codeDepth - 1)
      return part
    }
    if (codeDepth) return part
    return part.replace(/\[\[cite:([^\]]+)\]\]/g, (_, id) => {
    const item = citations.get(aiCitationId(id)), url = item && aiCitationUrl(item)
    return url ? '<a class="ai-citation" href="' + escapeAttribute(url) + '" target="_blank" rel="noopener" aria-label="引用 ' + item.displayIndex + '：' + escapeAttribute(item.title) + '">[' + item.displayIndex + ']</a>' : ''
    })
  }).join('')
}
