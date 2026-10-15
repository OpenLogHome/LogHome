import messages from "~/config/i18n/mobile-messages.json";
import desktopEnglish from "~/config/i18n/desktop-en.json";
export const LANGUAGE_KEY = "loghome_language";
export const FOLLOW_SYSTEM = "follow-system";
export function normalizeLanguage(raw) {
  const value = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  if (/^en(?:-|$)/.test(value)) return "en";
  if (/^zh(?:-|$)/.test(value)) return "zh-CN";
  return null;
}
export function savedLanguage(storage) {
  try {
    const value = storage.getItem(LANGUAGE_KEY);
    if (["zh-CN", "en"].includes(value)) return value;
  } catch (_) {}
  return FOLLOW_SYSTEM;
}
export function effectiveLanguage(preference, languages = []) {
  return ["zh-CN", "en"].includes(preference)
    ? preference
    : normalizeLanguage(languages[0]) || "zh-CN";
}
export function translateUI(value, params = {}, locale = "zh-CN") {
  const key = messages.sourceKeys[value] || value;
  const source = messages.zh[key] || value;
  const text =
    locale === "en" ? desktopEnglish[value] || messages.en[key] || source : source;
  return String(text).replace(/\{\{?(\w+)\}?\}/g, (match, name) =>
    params[name] === undefined ? match : String(params[name])
  );
}
