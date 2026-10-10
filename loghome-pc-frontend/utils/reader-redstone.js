import { aiStorageKey } from './reader-ai'

const integer = (value, name, minimum = 0) => {
  if (value == null || value === '' || !Number.isSafeInteger(Number(value)) || Number(value) < minimum) throw new Error(`${name}数据异常，请刷新重试。`)
  return Number(value)
}
export function redstoneAccount(raw) {
  if (!raw || !raw.exchange_rate || Number(raw.exchange_rate.log) !== 10 || Number(raw.exchange_rate.redstone) !== 1) throw new Error('兑换汇率加载失败，请刷新重试。')
  const result = {
    log: integer(raw.log_balance, '原木余额'), total: integer(raw.redstone_balance, '红石余额'),
    permanent: integer(raw.permanent_balance, '永久红石'), expiring: integer(raw.expiring_balance, '赠送红石'),
    standardGrant: integer(raw.membership_grants && raw.membership_grants.standard, '通行证赠送'),
    superGrant: integer(raw.membership_grants && raw.membership_grants.super, '超级通行证赠送'),
    ordinaryGrant: integer(raw.ordinary_monthly_grant, '普通用户赠送'), validity: integer(raw.gift_validity_months, '赠送有效期', 1),
    expiration: raw.next_expiration_at || null
  }
  if (result.total !== result.permanent + result.expiring || (result.expiration && !Number.isFinite(new Date(result.expiration).getTime()))) throw new Error('红石余额明细异常，请刷新重试。')
  return result
}
export function redstoneHistory(raw, page) {
  if (!raw || !Array.isArray(raw.list) || integer(raw.page, '流水页码', 1) !== page || integer(raw.pageSize, '流水条数', 1) !== 20) throw new Error('流水数据异常，请重试。')
  const total = integer(raw.total, '流水总数'), ids = new Set()
  if (raw.list.length > 20 || raw.list.length > total) throw new Error('流水条数异常，请重试。')
  const list = raw.list.map(row => {
    const id = integer(row.transaction_id, '流水编号', 1)
    if (ids.has(id) || row.amount == null || row.amount === '' || !Number.isFinite(new Date(row.created_at).getTime()) || row.created_at == null || (row.expires_at && !Number.isFinite(new Date(row.expires_at).getTime()))) throw new Error('流水记录异常，请重试。')
    ids.add(id)
    return { ...row, transaction_id: id, amount: integer(Math.abs(Number(row.amount)), '流水数量') * (Number(row.amount) < 0 ? -1 : 1), log_cost: integer(row.log_cost, '流水原木'), remaining_amount: row.remaining_amount == null ? null : integer(row.remaining_amount, '剩余赠送') }
  })
  return { list, total, page }
}
export function redstoneAmount(value) { return /^\d{1,6}$/.test(String(value)) && Number(value) >= 1 && Number(value) <= 100000 ? Number(value) : 0 }
export function redstoneReceipt(raw, pending) {
  if (!raw || integer(raw.redstone_amount, '到账红石', 1) !== pending.amount || integer(raw.log_cost, '兑换成本') !== pending.amount * 10) throw new Error('兑换回执异常，请核对流水后重试同一兑换。')
  return { amount: pending.amount, log: integer(raw.log_balance, '原木余额'), total: integer(raw.redstone_balance, '红石余额'), replayed: raw.replayed === true }
}
export function redstoneRequestId() {
  return `redstone-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)}`
}
export function pendingKey(token) { return aiStorageKey(token).replace('loghome_pc_reader_ai_v1_', 'loghome_pc_redstone_pending_v1_') }
export function readPendingRedstone(storage, token) {
  const stored = storage.getItem(pendingKey(token))
  if (!stored) return null
  let value
  try { value = JSON.parse(stored) } catch (_) { throw new Error('上次兑换记录损坏，请先核对红石流水。') }
  if (!value || value.version !== 1 || !redstoneAmount(value.amount) || !/^redstone-[a-zA-Z0-9-]{8,60}$/.test(value.id)) throw new Error('上次兑换记录异常，请先核对红石流水。')
  return { version: 1, id: value.id, amount: Number(value.amount), uncertain: true }
}
export function savePendingRedstone(storage, token, pending) { storage.setItem(pendingKey(token), JSON.stringify({ version: 1, id: pending.id, amount: pending.amount })) }
export function clearPendingRedstone(storage, token) { storage.removeItem(pendingKey(token)) }
export function redstoneTitle(row) {
  const names = { membership_grant: '通行证赠送', membership_upgrade_grant: '升级通行证补赠', annual_refresh: '年付会员每月赠送', monthly_free_grant: '普通用户每月赠送', log_exchange: '原木兑换', ai_usage: 'AI 功能消耗', admin_adjustment: '系统调整', refund: '退款返还', expiration: '赠送红石过期' }
  return row.transaction_type === 'ai_usage' && row.description ? row.description : names[row.transaction_type] || row.description || '红石变动'
}
export function redstoneDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date) : '—'
}
