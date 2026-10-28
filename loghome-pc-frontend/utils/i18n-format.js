function validDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatNumber(value, locale = "zh-CN", options = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return new Intl.NumberFormat(locale, options).format(number);
}

export function formatDate(value, locale = "zh-CN", options = {}) {
  const date = validDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDateTime(value, locale = "zh-CN") {
  return formatDate(value, locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(value, locale = "zh-CN", now = Date.now()) {
  const date = validDate(value);
  if (!date) return "-";
  const seconds = Math.round((date.getTime() - Number(now)) / 1000);
  const absolute = Math.abs(seconds);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (absolute < 60) return formatter.format(seconds, "second");
  if (absolute < 3600) return formatter.format(Math.round(seconds / 60), "minute");
  if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
  if (absolute < 2592000)
    return formatter.format(Math.round(seconds / 86400), "day");
  return formatDate(date, locale, { year: "numeric", month: "short", day: "numeric" });
}
