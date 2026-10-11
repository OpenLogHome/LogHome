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


export async function getMiniapps(baseUrl) {
  const response = await axios.get(baseUrl + '/miniapps')
  return response.data.data
}

export async function getMiniapp(id, baseUrl) {
  if (typeof id !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(id)) throw new Error('小程序 ID 不正确')
  const environment = getMiniappEnvironment()
  const response = await axios.get(baseUrl + '/miniapps/' + encodeURIComponent(id), {params: {environment}})
  if (!response.data.data || response.data.data.id !== id) throw new Error('小程序注册信息不正确')
  return response.data.data
}
