import { discoveryLink } from './reading-discovery'
import { readingMessageTarget } from './reader-comment-links'
import { SITE_ORIGIN } from './reading-seo'

function safeLink(raw, mobileBase) {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value || /[\\\u0000-\u001f]/.test(value)) return null
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      if (url.username || url.password) return null
      if (url.origin === SITE_ORIGIN) return { href:url.pathname + url.search + url.hash, external:false }
      if (url.origin === new URL(mobileBase).origin && url.hash.startsWith('#/pages/')) return discoveryLink(url.hash.slice(1), mobileBase)
      return { href:url.href, external:true }
    } catch (_) { return null }
  }
  return discoveryLink(value, mobileBase)
}
export function activityNewsLink(news, mobileBase = 'https://m.loghome.ink') {
  return safeLink(news && news.pc_link, mobileBase) || safeLink(news && news.mobile_link, mobileBase)
}
export function normalizeActivities(rows, mobileBase = 'https://m.loghome.ink') {
  if (!Array.isArray(rows)) throw Error('活动资讯返回数据无效')
  const seen = new Set()
  return rows.filter(row => {
    const id = Number(row && row.tag_id)
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) return false
    seen.add(id); return true
  }).map(row => ({ ...row, tag_id:Number(row.tag_id), news:(Array.isArray(row.news) ? row.news : []).filter(news=>news && typeof news.title==='string').map(news=>({ ...news, link:activityNewsLink(news,mobileBase) })) }))
}
export function activityMessageLink(router, mobileBase = 'https://m.loghome.ink') {
  const raw = String(router || '').trim()
  if (!raw || raw==='/' || raw==='None' || /^[a-z][a-z\d+.-]*:|^\/\/|[\\\u0000-\u001f]/i.test(raw)) return null
  const route = raw.replace(/^(?:\.\.?\/)+/, '').replace(/^\/?(?:#\/)?(?:pages\/)?/, '')
  const reading = readingMessageTarget(route)
  if (reading) return { href:reading.path, external:false }
  const post = route.match(/^community\/postDetail\?id=([1-9]\d*)(?:&|$)/)
  if (post) return { href:`/community/post/${Number(post[1])}`, external:false }
  return safeLink(`/pages/${route}`, mobileBase)
}
export function activityMessagePage(result, page, amount = 20, mobileBase = 'https://m.loghome.ink') {
  if (!result || result.msg!=='ok' || result.page!==page || result.amount!==amount || !Number.isSafeInteger(result.total) || result.total<0 || !Array.isArray(result.messages) || result.messages.length>amount) throw Error('活动消息返回数据无效，请刷新重试')
  const seen = new Set()
  const messages = result.messages.map(row => {
    const id = Number(row && row.message_id)
    if (!Number.isSafeInteger(id) || id<=0 || seen.has(id) || row.message_type!=='activity') throw Error('活动消息返回数据无效，请刷新重试')
    seen.add(id)
    return { ...row, message_id:id, message_content:String(row.message_content||''), bg_url:/^https?:\/\//i.test(String(row.bg_url||'')) ? row.bg_url : '', link:activityMessageLink(row.router,mobileBase) }
  })
  return { total:result.total, messages }
}
