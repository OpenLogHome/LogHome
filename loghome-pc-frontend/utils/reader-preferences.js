import themes from '~/config/reader/themes.json'
import bundledFonts from '~/config/reader/fonts.json'

export { themes }
export const MEMBER_THEMES = ['wavechaser', 'powderblue', 'qingyun', 'sunburst', 'thorncrown', 'chocolate']
export const THEME_NAMES = { white: '蛙鸣白', yellow: '原木黄', green: '草原绿', blue: '晴空蓝', purple: '末地紫', pink: '桃花粉', black: '虚空黑', wavechaser: '追波', powderblue: '粉蓝', qingyun: '青云', sunburst: '艳阳', thorncrown: '荆棘冠', chocolate: '巧克力', blockepoch: '方块纪元' }
export const PREFERENCE_KEY = 'loghome:reader:preferences:v1'
export const DEFAULT_PREFERENCES = Object.freeze({ mode: 'page', theme: 'white', font: 'default', fontSize: 22, lineHeight: 1.8, backgroundSkinKey: '', width: 860 })
const THEME_ALIASES = { light: 'white', sepia: 'yellow', dark: 'black' }
export function normalizePreferences(value = {}) {
  if (!value || typeof value !== 'object') value = {}
  const theme = THEME_ALIASES[value.theme] || value.theme
  const bounded = (input, min, max, fallback) => Number.isFinite(Number(input)) && input !== '' && input != null ? Math.max(min, Math.min(max, Number(input))) : fallback
  return {
    mode: value.mode === 'text' ? 'text' : 'page',
    theme: Object.prototype.hasOwnProperty.call(themes, theme) ? theme : 'white',
    font: typeof value.font === 'string' && value.font.length <= 64 ? value.font : 'default',
    fontSize: Math.round(bounded(value.fontSize, 14, 36, DEFAULT_PREFERENCES.fontSize)),
    lineHeight: bounded(value.lineHeight, 1.3, 2.5, 1.8),
    backgroundSkinKey: typeof value.backgroundSkinKey === 'string' ? value.backgroundSkinKey.slice(0, 64) : '',
    width: Math.round(bounded(value.width, 620, 1120, DEFAULT_PREFERENCES.width))
  }
}
export function readPreferences(storage) {
  try {
    const saved = storage.getItem(PREFERENCE_KEY)
    if (saved) return normalizePreferences(JSON.parse(saved))
    // Preserve existing desktop choices on upgrade; do not import mobile rpx as desktop pixels.
    const oldFont = storage.getItem('reading_font_family')
    return normalizePreferences({ mode: storage.getItem('readerProps'), theme: storage.getItem('reading_theme'), fontSize: storage.getItem('reading_font_size'), font: ['serif', 'sans-serif'].includes(oldFont) ? oldFont : 'default' })
  } catch (_) { return { ...DEFAULT_PREFERENCES } }
}
export function savePreferences(storage, value) {
  try { storage.setItem(PREFERENCE_KEY, JSON.stringify(normalizePreferences(value))); return true } catch (_) { return false }
}
export function membershipTier(response) {
  const status = response && response.data ? response.data : response
  const tier = status && status.active && status.subscription && status.subscription.membership_type
  return ['standard', 'super'].includes(tier) ? tier : ''
}
export function canUseBackground(required, tier) {
  if (!required || required === 'none') return true
  return required === 'standard' ? ['standard', 'super'].includes(tier) : required === 'super' && tier === 'super'
}
export function safeFontUrl(value) {
  return typeof value === 'string' && /^https?:\/\/[^\s"\\]+$/i.test(value) ? value : ''
}
export function readerFonts(serverFonts) {
  if (!Array.isArray(serverFonts)) return JSON.parse(JSON.stringify(bundledFonts))
  const fonts = { default: bundledFonts.default }
  serverFonts.forEach(item => {
    if (!item || !item.font_key || !item.font_name || !safeFontUrl(item.regular_url)) return
    // An enabled server list is authoritative, including an intentionally empty list.
    const key = String(item.font_key).slice(0, 64)
    if (['__proto__', 'constructor', 'prototype', 'default'].includes(key)) return
    fonts[key] = { name: String(item.font_name).slice(0, 64), version: String(item.font_version || '1'), regular: { url: item.regular_url }, bold: safeFontUrl(item.bold_url) ? { url: item.bold_url } : null }
  })
  return fonts
}
export function fontIdentity(key, config) {
  const source = `${key}|${config.version}|${config.regular && config.regular.url}|${config.bold && config.bold.url}`
  let hash = 2166136261
  for (let index = 0; index < source.length; index++) hash = Math.imul(hash ^ source.charCodeAt(index), 16777619)
  return `LogHomeReader${(hash >>> 0).toString(16)}`
}
