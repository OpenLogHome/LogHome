const crypto = require('crypto');
const { withTransaction } = require('../sql');
const { describeOrder, queryParcel, QUERY_INTERVAL } = require('./storeTrackingProvider');
function createLogisticsService({ transaction = withTransaction, get, clock = () => new Date() } = {}) {
  return async function getLogistics(order) {
    const descriptor = describeOrder(order);
    if (!descriptor.native_query) return descriptor.logistics;
    const parcel = descriptor.native_query;
    const trackingKey = crypto.createHash('sha256')
      .update(JSON.stringify(['kuaidiwang', parcel.shipping_company_code, parcel.tracking_number]))
      .digest('hex');
    return transaction(async q => {
      // An edited parcel must not reuse the previous parcel's cache row.
      await q('DELETE FROM store_logistics_cache WHERE order_id = ? AND tracking_key <> ?', [order.id, trackingKey]);
      await q('INSERT IGNORE INTO store_logistics_cache(order_id, tracking_key) VALUES(?, ?)', [order.id, trackingKey]);
      const rows = await q('SELECT tracking_key, payload, checked_at, next_query_at FROM store_logistics_cache WHERE tracking_key = ? FOR UPDATE', [trackingKey]);
      const cached = rows[0];
      let previous;
      try { previous = cached && cached.payload ? JSON.parse(cached.payload) : null; } catch (_) { /* discard malformed cache */ }
      const now = clock();
      if (previous && new Date(cached.next_query_at).getTime() > now.getTime()) return { ...previous, cached: true };
      let result = await queryParcel(parcel, get);
      if (['unavailable', 'verification_required'].includes(result.status) && previous && previous.events?.length) {
        result = { ...previous, cached: false, stale: true, refresh_status: result.status,
          last_success_at: previous.last_success_at || previous.checked_at,
          message: '本次更新未成功，以下为上次取得的物流记录；可通过官方入口核验' };
      }
      result.checked_at = now.toISOString();
      result.next_query_at = new Date(now.getTime() + QUERY_INTERVAL).toISOString();
      await q('UPDATE store_logistics_cache SET payload = ?, checked_at = ?, next_query_at = ? WHERE tracking_key = ?',
        [JSON.stringify(result), now, new Date(now.getTime() + QUERY_INTERVAL), trackingKey]);
      return result;
    }, 'store logistics cache');
  };
}
module.exports = { getLogistics: createLogisticsService(), getLogisticsMetadata: describeOrder, createLogisticsService, QUERY_INTERVAL };
