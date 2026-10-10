import { readingRequest, readingToken } from '~/plugins/api/reading'
const ROOT = '/community/stickers'
export function stickerUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '' } catch (_) { return '' }
}
export function stickerUserId() {
  try { return Number(JSON.parse(localStorage.getItem('token') || '{}').id) || 0 } catch (_) { return 0 }
}
export function readerSticker(raw) {
  const id = Number(raw && raw.sticker_id), url = stickerUrl(raw && raw.url)
  if (!Number.isSafeInteger(id) || id <= 0 || !url) return null
  return { ...raw, sticker_id: id, url, user_id: Number(raw.user_id) || 0, is_private: raw.is_private === true || Number(raw.is_private) === 1, is_favorite: raw.is_favorite === true || Number(raw.is_favorite) === 1 }
}
function checkAccount(token) {
  if (!token) throw new Error('请先登录后使用表情包')
  if (readingToken() !== token) throw new Error('账号已变化，请重新操作')
}
async function request(path = '', { params = {}, method = 'GET', body } = {}, token = readingToken()) {
  checkAccount(token)
  return readingRequest(ROOT + path, params, { method, body, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
}
export async function fetchReaderStickers({ favorites = false, category = 'all', page = 1, url } = {}, token = readingToken()) {
  const data = await request(favorites ? '/favorites' : '', { params: { category: ['all','my','public','logwood'].includes(category) ? category : 'all', page, limit: 20, ...(url ? { url } : {}) } }, token)
  const items = (Array.isArray(data) ? data : Array.isArray(data.stickers) ? data.stickers : []).map(readerSticker).filter(Boolean)
  const pagination = data.pagination || {}
  return { items, pages: Math.max(1, Number(pagination.pages) || 1), total: Math.max(0, Number(pagination.total) || items.length) }
}
export const favoriteReaderSticker = (id, favorite, token) => request(favorite ? '/favorites' : `/favorites/${Number(id)}`, { method: favorite ? 'POST' : 'DELETE', body: favorite ? { sticker_id: Number(id) } : undefined }, token)
export const privacyReaderSticker = (id, isPrivate, token) => request(`/${Number(id)}`, { method: 'PUT', body: { is_private: !!isPrivate } }, token)
export const deleteReaderSticker = (id, token) => request(`/${Number(id)}`, { method: 'DELETE' }, token)
export async function createReaderSticker(url, isPrivate = false, token = readingToken()) {
  const safe = stickerUrl(url)
  if (!safe) throw new Error('图片地址无效')
  const data = await request('', { method: 'POST', body: { url: safe, is_private: !!isPrivate } }, token)
  const sticker = readerSticker(data)
  if (!sticker) throw new Error('表情包保存结果无效，请刷新确认')
  return sticker
}
export async function saveImageAsReaderSticker(url, token = readingToken()) {
  const safe = stickerUrl(url); if (!safe) throw new Error('图片地址无效')
  const { items } = await fetchReaderStickers({ url: safe }, token)
  checkAccount(token)
  let sticker = items.find(item => !item.is_private || item.user_id === stickerUserId())
  if (!sticker) sticker = await createReaderSticker(safe, false, token)
  checkAccount(token)
  if (!sticker.is_favorite) {
    try { await favoriteReaderSticker(sticker.sticker_id, true, token) }
    catch (error) { if (!/已收藏/.test(error.message)) throw error }
  }
  return sticker
}
