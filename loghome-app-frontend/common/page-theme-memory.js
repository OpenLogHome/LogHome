const LIGHT_MODE = 'light'
const DARK_MODE = 'dark'

function normalizeSelection(selection) {
  if (!selection || typeof selection !== 'object') return null
  const theme = String(selection.theme || '').slice(0, 64)
  if (!theme) return null
  return {
    theme,
    backgroundSkinKey: String(selection.backgroundSkinKey || '').slice(0, 64)
  }
}

export function getProjectThemeMode(store) {
  if (store && store.state) {
    return store.state.isDarkMode ? DARK_MODE : LIGHT_MODE
  }
  try {
    return window.localStorage.getItem('themeMode') === DARK_MODE ? DARK_MODE : LIGHT_MODE
  } catch (error) {
    return LIGHT_MODE
  }
}

export function getColorMode(color) {
  const value = String(color || '').trim().replace(/^#/, '')
  const hex = value.length === 3
    ? value.split('').map(part => part + part).join('')
    : value.slice(0, 6)
  if (!/^[0-9a-f]{6}$/i.test(hex)) return LIGHT_MODE
  const channels = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
  const linear = channels.map(channel => channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4))
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  return luminance < 0.35 ? DARK_MODE : LIGHT_MODE
}

export function rememberPageTheme(storageKey, mode, selection) {
  const normalized = normalizeSelection(selection)
  if (!normalized || (mode !== LIGHT_MODE && mode !== DARK_MODE)) return
  try {
    const raw = window.localStorage.getItem(storageKey)
    const memory = raw ? JSON.parse(raw) : {}
    memory[mode] = normalized
    window.localStorage.setItem(storageKey, JSON.stringify(memory))
  } catch (error) {}
}

export function readPageTheme(storageKey, mode, fallback) {
  try {
    const raw = window.localStorage.getItem(storageKey)
    const memory = raw ? JSON.parse(raw) : {}
    return normalizeSelection(memory[mode]) || normalizeSelection(fallback)
  } catch (error) {
    return normalizeSelection(fallback)
  }
}
