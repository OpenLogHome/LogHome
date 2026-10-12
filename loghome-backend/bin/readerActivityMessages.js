// Reading's activity inbox is paginated independently of private/system messages.
function registerReaderActivityMessages(router, { auth, withTransaction }) {
  router.get('/get_activity_messages', auth, async (req, res) => {
    const integer = (value, fallback, max) => value == null ? fallback : typeof value === 'string' && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) <= max ? Number(value) : null;
    const page = integer(req.query.page, 1, 10000), amount = integer(req.query.amount, 20, 50);
    if (!page || !amount) return res.status(400).json({ msg: '分页参数无效' });
    const userId = Number(Array.isArray(req.user) ? req.user[0]?.user_id : req.user?.user_id);
    if (!Number.isSafeInteger(userId) || userId <= 0) return res.status(401).json({ msg: '请先登录' });
    try {
      const result = await withTransaction(async q => {
        const counts = await q("SELECT COUNT(*) AS total FROM user_message WHERE to_id = ? AND message_type = 'activity'", [userId]);
        const messages = await q(`SELECT message_id, message_content, time, bg_url, router, message_type, is_read
          FROM user_message WHERE to_id = ? AND message_type = 'activity'
          ORDER BY time DESC, message_id DESC LIMIT ? OFFSET ? FOR UPDATE`, [userId, amount, (page - 1) * amount]);
        // Only the messages actually shown on this page become read.
        const ids = messages.filter(row => Number(row.is_read) === 0).map(row => row.message_id);
        if (ids.length) await q(`UPDATE user_message SET is_read = 1 WHERE to_id = ? AND message_type = 'activity' AND is_read = 0 AND message_id IN (${ids.map(() => '?').join(',')})`, [userId, ...ids]);
        return { msg: 'ok', page, amount, total: Number(counts[0].total), messages: messages.map(row => ({ ...row, is_read: Number(row.is_read) === 0 ? 1 : row.is_read })) };
      });
      res.json(result);
    } catch (_) { res.status(503).json({ msg: '活动消息暂时无法读取，请稍后重试' }); }
  });
}
module.exports = { registerReaderActivityMessages };
