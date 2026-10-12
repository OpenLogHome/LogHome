export const STATISTIC_METRICS = [
  { key: "clicks", label: "阅读", color: "#dc733b" },
  { key: "nices", label: "点赞", color: "#db6574" },
  { key: "likes", label: "收藏", color: "#b78b19" },
  { key: "comments", label: "评论", color: "#8b72ce" },
  { key: "shares", label: "分享", color: "#3688b8" },
  { key: "tippings", label: "打赏", color: "#38977f" },
];
const DAY = 86400000;
export function statisticDate(value) {
  const raw = String(value || "").trim();
  let date;
  if (
    /^\d{4}-\d{2}-\d{2}(?:$|[ T]\d{2}:\d{2})/.test(raw) &&
    !/(Z|[+-]\d{2}:?\d{2})$/i.test(raw)
  ) {
    date = raw.slice(0, 10);
  } else {
    const parsed = new Date(raw);
    if (!raw || !Number.isFinite(parsed.getTime())) return "";
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(parsed);
    const part = (name) => parts.find((item) => item.type === name).value;
    date = `${part("year")}-${part("month")}-${part("day")}`;
  }
  const timestamp = Date.parse(date + "T00:00:00Z");
  return Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === date
    ? date
    : "";
}
export function normalizeStatistics(rows) {
  const days = new Map();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (!row || typeof row !== "object") return;
    const date = statisticDate(
      row.date || row.statistic_date || row.stat_date || row.record_date
    );
    if (!date) return;
    const snapshot = { date, timestamp: Date.parse(date + "T00:00:00Z") };
    STATISTIC_METRICS.forEach((metric) => {
      const value = row[metric.key];
      snapshot[metric.key] =
        value != null &&
        value !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) >= 0
          ? Number(value)
          : null;
    });
    days.set(date, snapshot);
  });
  const sorted = [...days.values()].sort((a, b) => a.timestamp - b.timestamp);
  if (!sorted.length) return [];
  const since = sorted[sorted.length - 1].timestamp - 29 * DAY;
  return sorted.filter((row) => row.timestamp >= since);
}
export function metricChange(rows, key) {
  if (rows.length < 2) return null;
  const latest = rows[rows.length - 1],
    previous = rows[rows.length - 2];
  if (latest[key] == null || previous[key] == null) return null;
  return {
    value: latest[key] - previous[key],
    label: latest.timestamp - previous.timestamp === DAY ? "较昨日" : "较上次",
  };
}
export function chartGeometry(rows, key, width = 300) {
  const left = 46,
    right = Math.max(left + 1, width - 12),
    top = 14,
    bottom = 142;
  const values = rows.map((row) => row[key]).filter((value) => value != null);
  const highest = Math.max(1, ...values);
  const unit = 10 ** Math.floor(Math.log10(highest));
  const rounded = Math.ceil(highest / unit) * unit;
  const max = rounded === highest ? rounded + unit : rounded;
  const start = rows.length ? rows[0].timestamp : 0;
  const span = rows.length ? rows[rows.length - 1].timestamp - start : 0;
  const points = rows.map((row) => ({
    date: row.date,
    value: row[key],
    x: span
      ? left + ((row.timestamp - start) / span) * (right - left)
      : (left + right) / 2,
    y: row[key] == null ? null : bottom - (row[key] / max) * (bottom - top),
  }));
  const chunks = [];
  points.forEach((point) => {
    if (point.y == null) {
      chunks.push([]);
      return;
    }
    if (!chunks.length) chunks.push([]);
    chunks[chunks.length - 1].push(point);
  });
  const segments = chunks.filter((chunk) => chunk.length);
  const path = segments
    .map((chunk) =>
      chunk
        .map(
          (p, index) =>
            `${index ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`
        )
        .join(" ")
    )
    .join(" ");
  const area = segments
    .filter((chunk) => chunk.length > 1)
    .map(
      (chunk) =>
        `M${chunk[0].x},${bottom} ` +
        chunk.map((p) => `L${p.x},${p.y}`).join(" ") +
        ` L${chunk[chunk.length - 1].x},${bottom} Z`
    )
    .join(" ");
  return {
    points,
    path,
    area,
    left,
    right,
    top,
    bottom,
    ticks: [0, 0.5, 1].map((ratio) => ({
      value: ratio * max,
      y: bottom - ratio * (bottom - top),
    })),
  };
}
export function formatStatistic(value) {
  return value == null
    ? "—"
    : Number(value).toLocaleString("zh-CN", { maximumFractionDigits: 0 });
}
