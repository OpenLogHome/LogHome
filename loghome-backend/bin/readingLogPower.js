const { PUBLIC_NOVEL } = require('./readingVisibility');
const { LOGPOWER_FORMULA } = require('./rankBoards');

// A public explanation is a read, never a request to refresh rankings or snapshots.
function createLogPowerReader({ query }) {
  return async function readLogPower(req, res) {
    const id = Number(req.query.id);
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(404).json({ msg: '作品不存在' });
    try {
      const rows = await query(`SELECT n.novel_id,n.name,n.novel_type,n.picUrl,n.update_time,n.ranking AS ranked_score,
        n.clicks,DATEDIFF(n.update_time,CURRENT_TIMESTAMP) AS days_diff,
        (SELECT COUNT(*) FROM novel_nice WHERE novel_id=n.novel_id) AS nices,
        (SELECT COUNT(*) FROM bookcase WHERE novel_id=n.novel_id) AS bookmarks,
        (SELECT COUNT(*) FROM novel_comments WHERE novel_id=n.novel_id AND deleted=0) AS comments,
        (SELECT IFNULL(SUM(item_amount*item_cost),0) FROM tipping WHERE novel_id=n.novel_id) AS tips,
        ${LOGPOWER_FORMULA} AS score,
        DATE_FORMAT(CURRENT_TIMESTAMP,'%Y-%m-%dT%H:%i:%s+08:00') AS generated_at
        FROM novels n WHERE n.novel_id=? AND ${PUBLIC_NOVEL}
        AND n.novel_type IN ('novel','manga','world')`, [id]);
      if (!rows.length) return res.status(404).json({ msg: '作品不存在或未公开' });
      res.json(rows[0]);
    } catch (_) {
      res.status(503).json({ msg: '原木力数据暂时不可用' });
    }
  };
}
module.exports = { createLogPowerReader };
