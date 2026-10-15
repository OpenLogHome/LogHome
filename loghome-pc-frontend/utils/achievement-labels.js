const metrics = {
  read_seconds: "累计阅读时长（秒）",
  write_seconds: "累计写作时长（秒）",
  community_post_count: "累计发帖数",
  comment_count: "累计评论数",
};
const periods = {
  lifetime: "累计",
  month: "本月",
  quarter: "本季度",
  year: "本年",
};
export function achievementMetric(code) {
  return metrics[code] || "成长进度";
}
export function achievementPeriod(code) {
  return periods[code] || "累计";
}
export function achievementRule(condition) {
  const compare = {
    ">=": "至少",
    ">": "超过",
    "=": "达到",
    "==": "达到",
    "<=": "不超过",
    "<": "少于",
  };
  return `${achievementPeriod(condition.period_type)}${achievementMetric(
    condition.metric_code
  )}，${compare[condition.comparator] || "至少"} ${
    Number(condition.threshold_value) || 0
  }`;
}
export function achievementProgressStatus(progress, badge) {
  if (!progress) return "进度待查询";
  if (progress.reason === "out_of_valid_window") return "不在有效活动时间内";
  if (progress.matched)
    return badge.grant_type === "rule_review"
      ? "条件已满足，等待审核发放"
      : "获得条件已满足";
  return "获得条件尚未全部满足";
}
