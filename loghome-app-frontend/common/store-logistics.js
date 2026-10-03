function hasNativeLogistics(bridge) {
  return !!(bridge && bridge.inApp && bridge.nativeLogisticsAvailable === true &&
    typeof bridge.queryStoreLogistics === 'function')
}
function withTimeout(promise, milliseconds) {
  let timer
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Native logistics timeout')), milliseconds) }),
  ]).finally(() => clearTimeout(timer))
}
function isValidNativeResult(value) {
  return value && value.provider === 'kuaidiwang' &&
    ['ok', 'no_records', 'verification_required', 'unavailable'].includes(value.status) &&
    Array.isArray(value.events) && value.events.length <= 200 &&
    value.events.every(event => event && typeof event.context === 'string' && typeof event.time === 'string') &&
    (value.status !== 'ok' || value.events.length > 0)
}
// The order always comes from the authenticated backend. Native networking only obtains traces.
export async function loadStoreLogistics({ request, baseUrl, orderId, token, bridge, nativeTimeout = 12000 }) {
  const url = baseUrl + `/store/orders/${orderId}/logistics`
  async function fetchOrder(metadata) {
    const response = await request(url, {
      headers: { Authorization: 'Bearer ' + token },
      ...(metadata ? { params: { query: 'metadata' } } : {}),
      timeout: 20000,
    })
    if (response.data?.code !== 200 || !response.data.data?.order)
      throw new Error(response.data?.msg || '物流信息加载失败')
    return response.data.data
  }
  if (hasNativeLogistics(bridge)) {
    const data = await fetchOrder(true)
    if (!data.native_query) return data
    let result
    try {
      result = await withTimeout(Promise.resolve().then(() => bridge.queryStoreLogistics({
        tracking_number: data.native_query.tracking_number,
        shipping_company_code: data.native_query.shipping_company_code,
      })), nativeTimeout)
    } catch (_) { /* Old bridge, timeout, or native networking failure: use the server. */ }
    if (isValidNativeResult(result) && !['unavailable', 'verification_required'].includes(result.status) && !result.stale)
      return { order: data.order, logistics: { ...result, query_via: 'native' } }
    try {
      const fallback = await fetchOrder(false)
      // Prefer already obtained traces if the server is also temporarily unavailable.
      if (isValidNativeResult(result) && result.events.length && fallback.logistics.status !== 'ok')
        return { order: data.order, logistics: { ...result, query_via: 'native' } }
      return fallback
    } catch (error) {
      if (isValidNativeResult(result) && result.events.length)
        return { order: data.order, logistics: { ...result, query_via: 'native' } }
      throw error
    }
  }
  return fetchOrder(false)
}
