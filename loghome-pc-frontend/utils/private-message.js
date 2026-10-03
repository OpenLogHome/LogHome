/**
 * 私信结构化消息解析
 * 移动端聊天会把图片、作品分享编码成 __LOGHOME_DM__: 前缀的 JSON 存进 message_content，
 * 网页端需要按同样的协议渲染，否则会话里会出现原始 JSON 字符串。
 */

const PRIVATE_MESSAGE_PREFIX = '__LOGHOME_DM__:'
const PRIVATE_MESSAGE_VERSION = 1

function getStructuredPayload(messageContent) {
  if (typeof messageContent !== 'string' || !messageContent.startsWith(PRIVATE_MESSAGE_PREFIX)) return null
  try {
    const payload = JSON.parse(messageContent.slice(PRIVATE_MESSAGE_PREFIX.length))
    if (!payload || payload.version !== PRIVATE_MESSAGE_VERSION) return null
    return payload
  } catch (error) {
    console.error('解析私信内容失败', error)
    return null
  }
}

export function parsePrivateMessage(messageContent) {
  const text = typeof messageContent === 'string' ? messageContent : ''
  const payload = getStructuredPayload(messageContent)
  if (!payload) return { type: 'text', text, previewText: text }

  if (payload.type === 'image' && payload.url) {
    return { type: 'image', text: '', previewText: '[图片]', imageUrl: payload.url }
  }
  if (payload.type === 'novel_share' && payload.novel) {
    const novel = payload.novel
    return {
      type: 'novel_share',
      text: '',
      previewText: novel.name ? `分享了作品《${novel.name}》` : '分享了作品',
      novel
    }
  }
  return { type: 'text', text, previewText: text }
}

export function normalizePrivateMessage(message) {
  const parsed = parsePrivateMessage(message.message_content)
  return {
    ...message,
    displayType: parsed.type,
    displayText: parsed.text,
    previewText: parsed.previewText,
    imageUrl: parsed.imageUrl || '',
    novel: parsed.novel || null
  }
}

export function formatMessagePreview(messageContent) {
  return parsePrivateMessage(messageContent).previewText
}
