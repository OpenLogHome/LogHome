import { readingRequest, readingToken } from './reading'
import { fetchAiIndex } from '~/utils/reader-ai'

export function readerAuth(required = true) {
  const token = readingToken()
  if (!token && required) throw new Error('请先登录后再操作')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
export function readerPost(path, body) {
  return readingRequest(path, {}, { method: 'POST', headers: { ...readerAuth(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}
const reader = {
  book: id => readingRequest('/library/get_novel_by_id', { id }),
  power: id => readingRequest('/library/get_logpower_details', { id }),
  chapters: id => readingRequest('/library/get_articles', { id }),
  world: (id, byWorldId = false) => readingRequest(byWorldId ? '/world/get_world_by_id' : '/world/get_world_by_novel_id', byWorldId ? { world_id: id } : { novel_id: id }),
  worldWorks: id => readingRequest('/world/get_asso_world_by_world_id', { world_id: id }),
  vocabularies: id => readingRequest('/world/vocabularies', { novel_id: id }),
  article: id => readingRequest('/articles/get_article', { id, isCaching: true }, { headers: readerAuth(false) }),
  authors: id => readingRequest('/library/get_novel_public_authors', { novel_id: id }),
  fonts: () => readingRequest('/app/get_reader_fonts'),
  backgrounds: () => readingRequest('/app/get_writer_background_skins'),
  membership: () => readingRequest('/membership/subscription', {}, { headers: readerAuth() }),
  profile: () => readingRequest('/users/userprofile', {}, { headers: readerAuth() }),
  excerpts: id => readingRequest('/articles/get_my_novel_centos', { novel_id: id }, { headers: readerAuth() }),
  hotExcerpts: id => readingRequest('/articles/get_hot_novel_centos', { novel_id: id, limit: 20 }),
  highlights: id => readingRequest('/articles/get_my_article_cento', { article_id: id }, { headers: readerAuth() }),
  highlight: body => readerPost('/articles/add_article_cento', body),
  unhighlight: id => readerPost('/articles/remove_article_cento', { article_cento_id: id }),
  paragraphAmounts: (id, paragraphIds) => readingRequest('/articles/get_paragraph_comment_amounts', {}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ article_id: id, paragraph_ids: paragraphIds }) }),
  feedback: body => readerPost('/articles/submit_feedback', body),
  report: body => readerPost('/essays/report_novel', body),
  share: body => readerPost('/library/create_share_code', body),
  aiIndex: id => fetchAiIndex(id),
  exp: seconds => readerPost('/treePlant/report_exp_activity', { activity_type: 'read_seconds', seconds }),
  fans: (id, type = 'total') => readingRequest('/library/get_all_novel_fans', { novel_id: id, type }),
  fanMessage: (id, message) => readerPost('/library/update_fan_message', { novel_id: id, message }),
  shareTask: () => readerPost('/treePlant/do_task', { task_code: 'daily_share_work' }),
  nice: id => readingRequest('/library/nice_novel', { id }, { headers: readerAuth() }),
  niceStatus: id => readingRequest('/library/get_nice_status', { id }, { headers: readerAuth() }),
  niceAmount: id => readingRequest('/library/get_nices_by_id', { id }),
  likeTask: () => readerPost('/treePlant/do_task', { task_code: 'daily_like_novel' }),
  gifts: () => readingRequest('/library/get_tipping_list'),
  balances: () => readingRequest('/resource/get_resources', {}, { headers: readerAuth() }),
  tip: body => readerPost('/library/tipping', body),
  ownFanMessage: id => readingRequest('/library/get_user_fan_message', { novel_id: id }, { headers: readerAuth() })
}
export default reader
