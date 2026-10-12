export const WRITER_THEMES = [
  { key: "system", name: "跟随系统", icon: "el-icon-monitor" },
  { key: "light", name: "浅色", icon: "el-icon-sunny" },
  { key: "dark", name: "深色", icon: "el-icon-moon" },
  { key: "sepia", name: "纸张", icon: "el-icon-document" },
];

export const WRITER_SYMBOLS = [
  { value: "——", name: "破折号" },
  { value: "……", name: "省略号" },
  { value: "·", name: "间隔号" },
  { value: "「」", name: "直角引号" },
  { value: "『』", name: "双直角引号" },
  { value: "【】", name: "方头括号" },
  { value: "〈〉", name: "单书名号" },
  { value: "〔〕", name: "六角括号" },
  { value: "×", name: "乘号" },
  { value: "※", name: "参考标记" },
  { value: "✦", name: "分隔星号" },
];

export const DEFAULT_QUICK_INPUTS = WRITER_SYMBOLS.map(
  (item) => item.value
).join("|");
export const LEGACY_QUICK_INPUTS = "　　|，|。|、|！|？|：|“”|《》";

export function resolveWriterTheme(theme, systemDark) {
  if (theme === "system") return systemDark ? "dark" : "light";
  return ["light", "dark", "sepia"].includes(theme) ? theme : "light";
}
