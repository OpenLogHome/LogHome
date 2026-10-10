import { fontIdentity, safeFontUrl } from './reader-preferences'

const pending = new Map()
let database
function openFontCache() {
  if (database) return database
  database = new Promise(resolve => {
    if (typeof indexedDB === 'undefined') return resolve(null)
    let request
    try { request = indexedDB.open('loghome-reader-fonts', 1) } catch (_) { return resolve(null) }
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('assets')) request.result.createObjectStore('assets') }
    request.onsuccess = () => { request.result.onversionchange = () => { request.result.close(); database = null }; resolve(request.result) }
    request.onerror = request.onblocked = () => { resolve(null); database = null }
  })
  return database
}
async function cachedAsset(key, value) {
  const db = await openFontCache()
  if (!db) return null
  return new Promise(resolve => {
    try {
      const tx = db.transaction('assets', value ? 'readwrite' : 'readonly')
      const request = value ? tx.objectStore('assets').put(value, key) : tx.objectStore('assets').get(key)
      let result
      request.onsuccess = () => { result = request.result }
      tx.oncomplete = () => resolve(value || result || null)
      tx.onerror = tx.onabort = () => resolve(null)
    } catch (_) { resolve(null) }
  })
}
async function loadAsset(identity, asset, weight, environment, downloads) {
  const url = safeFontUrl(asset && asset.url)
  if (!url) throw new Error('字体资源地址无效')
  const cacheKey = `${identity}:${url}`
  if (!downloads.has(cacheKey)) downloads.set(cacheKey, (async () => {
    let bytes = await cachedAsset(cacheKey)
    if (bytes) return bytes
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 60000)
    try {
      // A changed server version gets a new identity and revalidates the resource URL.
      const response = await environment.fetch(url, { cache: 'no-cache', signal: controller.signal })
      if (!response.ok) throw new Error('字体下载失败，请重试')
      bytes = await response.arrayBuffer()
      if (!bytes.byteLength) throw new Error('字体文件为空')
      await cachedAsset(cacheKey, bytes)
    } catch (error) {
      throw new Error(error.name === 'AbortError' ? '字体下载超时，请重试' : '字体下载失败，请检查网络后重试')
    } finally { clearTimeout(timer) }
    return bytes
  })())
  const bytes = await downloads.get(cacheKey)
  try {
    const face = new environment.FontFace(identity, bytes, { weight, style: 'normal', display: 'swap' })
    await face.load()
    environment.fonts.add(face)
  } catch (_) {
    // Do not trap the user on a corrupt cached file on every retry.
    const db = await openFontCache()
    if (db) { try { db.transaction('assets', 'readwrite').objectStore('assets').delete(cacheKey) } catch (_) {} }
    throw new Error('字体文件无法加载，请重试或选择系统字体')
  }
}
export function loadReaderFont(key, config, environment = { fetch: (...args) => window.fetch(...args), FontFace: window.FontFace, fonts: document.fonts }) {
  if (key === 'default') return Promise.resolve('')
  if (!environment.FontFace || !environment.fonts) return Promise.reject(new Error('此浏览器无法加载在线字体，请选择系统字体'))
  const identity = fontIdentity(key, config)
  if (pending.has(identity)) return pending.get(identity)
  const promise = (async () => {
    const downloads = new Map()
    await loadAsset(identity, config.regular, '400', environment, downloads)
    if (config.bold && config.bold.url !== config.regular.url) await loadAsset(identity, config.bold, '700', environment, downloads)
    else await loadAsset(identity, config.regular, '700', environment, downloads)
    return identity
  })().catch(error => { pending.delete(identity); throw error })
  pending.set(identity, promise)
  return promise
}
