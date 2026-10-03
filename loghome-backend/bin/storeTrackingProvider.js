const axios = require('axios');
const carriers = require('./storeCarriers');
const QUERY_INTERVAL = 30 * 60 * 1000;
const PUBLIC_URL = 'https://www.kuaidi.com/';
const providerStates = {
  0: [null, '等待物流更新'], 3: ['0', '运输中'], 4: ['1', '已揽收'],
  5: ['2', '物流异常'], 6: ['3', '已签收'], 7: ['4', '退签'],
  8: ['5', '派送中'], 9: ['6', '已退回'],
};
function base(status, message = '') {
  return { status, message, provider: 'kuaidiwang', public_url: PUBLIC_URL,
    events: [], state: null, state_text: '等待物流更新', checked_at: null,
    next_query_at: null, cached: false, stale: false };
}
function describeOrder(order) {
  if (order.product_type !== 'physical') return { logistics: base('not_shipped', '虚拟商品无需物流配送') };
  if (!['shipped', 'completed'].includes(order.status) || !order.tracking_number)
    return { logistics: base('not_shipped', '商家正在准备发货') };
  const number = String(order.tracking_number).trim();
  if (!/^[A-Za-z0-9-]{5,100}$/.test(number))
    return { logistics: base('unavailable', '快递单号格式异常，请联系管理员') };
  // Older JT orders can lack the carrier code; do not infer other carriers from prefixes.
  const carrier = order.shipping_company_code || (/^JT\d{13}$/i.test(number) ? 'jtexpress' : '');
  if (!carriers.some(item => item.code === carrier))
    return { logistics: base('missing_carrier', '暂未填写可查询的快递公司，请使用官方查件入口') };
  return { logistics: base('pending_query'), native_query: { tracking_number: number, shipping_company_code: carrier } };
}
function buildQueryUrl(parcel) {
  if (!/^[A-Za-z0-9-]{5,100}$/.test(parcel.tracking_number) ||
      !carriers.some(item => item.code === parcel.shipping_company_code)) throw Error('Invalid parcel');
  return `${PUBLIC_URL}index-ajaxselectcourierinfo-${encodeURIComponent(parcel.tracking_number)}-${encodeURIComponent(parcel.shipping_company_code)}.html`;
}
function normalizeResponse(input, parcel) {
  let data = input;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch (_) { return base('unavailable', '物流服务返回异常，请稍后重试'); }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return base('unavailable', '物流服务返回异常，请稍后重试');
  if (data.nu && String(data.nu).toUpperCase() !== parcel.tracking_number.toUpperCase())
    return base('unavailable', '物流服务返回的单号不匹配，请稍后重试');
  if (data.exname && data.exname !== parcel.shipping_company_code)
    return base('unavailable', '物流服务返回的快递公司不匹配，请使用官方查件入口');
  if (data.success !== true) {
    const reason = String(data.reason || '');
    if (/验证码|手机|核验|验证/.test(reason)) return base('verification_required', '服务方要求核验，请通过快递公司官方入口查询');
    if (/频繁|限制|次数|稍后|繁忙/.test(reason)) return base('unavailable', '物流服务暂时受限，请稍后重试');
    if (/暂无|没有|无记录|无物流|不存在|未查|查无|未找到|单号.*无/.test(reason)) return base('no_records', '服务方暂未查到物流记录，请稍后查看');
    return base('unavailable', '物流服务暂时无法返回记录，请使用官方查件入口');
  }
  if (!Array.isArray(data.data)) return base('unavailable', '物流服务返回异常，请稍后重试');
  if (String(data.status) === '2') return base('unavailable', '物流服务暂时出现异常，请稍后重试');
  const events = data.data.slice(0, 200).filter(row => row && typeof row.context === 'string' && row.context.trim())
    .map(row => ({ time: String(row.time || '').slice(0, 40), context: row.context.slice(0, 2000), location: String(row.location || '').slice(0, 200) }))
    .sort((a, b) => b.time.localeCompare(a.time));
  const [state, state_text] = providerStates[String(data.status)] || [null, '物流更新'];
  return { ...base(events.length ? 'ok' : 'no_records', events.length ? '' : '服务方暂未查到物流记录，请稍后查看'), events, state, state_text, provider_state: String(data.status ?? '') };
}
async function queryParcel(parcel, get = (...args) => axios.get(...args)) {
  try {
    const response = await get(buildQueryUrl(parcel), {
      timeout: 8000, maxContentLength: 1024 * 1024, maxRedirects: 0,
      responseType: 'text', headers: { Accept: 'application/json' },
    });
    return normalizeResponse(response.data, parcel);
  } catch (_) { return base('unavailable', '物流查询暂时不可用，请稍后重试或使用官方查件入口'); }
}
module.exports = { base, describeOrder, queryParcel, normalizeResponse, buildQueryUrl, QUERY_INTERVAL };
