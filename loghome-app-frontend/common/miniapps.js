import axios from 'axios'

export function getMiniappEnvironment() {
  const configured = process.env.VUE_APP_MINIAPP_ENV
  if (configured) {
    if (!['debug', 'production'].includes(configured)) throw new Error('VUE_APP_MINIAPP_ENV 必须为 debug 或 production')
    return configured
  }
  // Packaged Android H5 assets may be production builds even inside a debug APK.
  if (typeof window !== 'undefined' && window.jsBridge && window.jsBridge.inApp && typeof window.jsBridge.isDebugBuild === 'boolean') {
    return window.jsBridge.isDebugBuild ? 'debug' : 'production'
  }
  return process.env.NODE_ENV === 'development' ? 'debug' : 'production'
}


function versionCode(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  if (!/^\d+$/.test(String(value))) return null
  const code = Number(value)
  return Number.isSafeInteger(code) && code >= 0 && code <= 2147483647 ? code : null
}

export function assertMiniappVersion(app, environment) {
  if (environment === 'debug') return
  const minimum = app.minClientVersion === undefined ? 0 : versionCode(app.minClientVersion)
  if (minimum === null) throw new Error('小程序最低版本配置无效')
  if (minimum === 0) return
  const bridge = typeof window !== 'undefined' ? window.jsBridge : null
  const current = bridge && bridge.inApp
    ? versionCode(bridge.clientVersionCode === undefined ? bridge.appVersion : bridge.clientVersionCode)
    : versionCode(process.env.VUE_APP_CLIENT_VERSION_CODE)
  if (current === null) throw new Error('无法读取原木社区版本，请使用最新版本的原木社区打开（最低版本号：' + minimum + '）')
  if (current < minimum) throw new Error('当前原木社区版本过低（' + current + '），此小程序需要版本号 ' + minimum + ' 或以上，请升级后再运行')
}

export async function getMiniapps(baseUrl) {
  const response = await axios.get(baseUrl + '/miniapps')
  return response.data.data
}

export async function getMiniapp(id, baseUrl) {
  if (typeof id !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(id)) throw new Error('小程序 ID 不正确')
  const environment = getMiniappEnvironment()
  const response = await axios.get(baseUrl + '/miniapps/' + encodeURIComponent(id), {params: {environment}})
  if (!response.data.data || response.data.data.id !== id) throw new Error('小程序注册信息不正确')
  assertMiniappVersion(response.data.data, environment)
  return response.data.data
}
