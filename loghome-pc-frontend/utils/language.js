import messages from "~/config/i18n/mobile-messages.json";
import desktopEnglish from "~/config/i18n/desktop-en.json";
import pcMessages from "~/config/i18n/pc-messages.json";
export const LANGUAGE_KEY = "loghome_language";
export const LANGUAGE_COOKIE = "loghome_language";
export const FOLLOW_SYSTEM = "follow-system";
export const SUPPORTED_LANGUAGES = ["zh-CN", "en"];

function normalizedText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

const normalizedDesktopEnglish = Object.entries(desktopEnglish).reduce(
  (result, [key, value]) => {
    result[normalizedText(key)] = value;
    return result;
  },
  {}
);

export function normalizeLanguage(raw) {
  const value = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  if (/^en(?:-|$)/.test(value)) return "en";
  if (/^zh(?:-|$)/.test(value)) return "zh-CN";
  return null;
}

export function parseLanguageCookie(cookie = "") {
  const entry = String(cookie)
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LANGUAGE_COOKIE}=`));
  if (!entry) return FOLLOW_SYSTEM;
  try {
    const value = decodeURIComponent(entry.slice(entry.indexOf("=") + 1));
    return [...SUPPORTED_LANGUAGES, FOLLOW_SYSTEM].includes(value)
      ? value
      : FOLLOW_SYSTEM;
  } catch (_) {
    return FOLLOW_SYSTEM;
  }
}

export function acceptedLanguages(header = "") {
  return String(header)
    .split(",")
    .map((part, index) => {
      const [language, ...parameters] = part.trim().split(";");
      const quality = parameters
        .map((parameter) => parameter.trim().match(/^q=([0-9.]+)$/i))
        .find(Boolean);
      return {
        language,
        quality: quality ? Number(quality[1]) : 1,
        index,
      };
    })
    .filter((item) => item.language && Number.isFinite(item.quality))
    .sort((left, right) => right.quality - left.quality || left.index - right.index)
    .map((item) => item.language);
}
export function savedLanguage(storage) {
  try {
    const value = storage.getItem(LANGUAGE_KEY);
    if (["zh-CN", "en"].includes(value)) return value;
  } catch (_) {}
  return FOLLOW_SYSTEM;
}
export function effectiveLanguage(preference, languages = []) {
  return SUPPORTED_LANGUAGES.includes(preference)
    ? preference
    : languages.map(normalizeLanguage).find(Boolean) || "zh-CN";
}

export function browserLanguage() {
  if (typeof window === "undefined") return "zh-CN";
  let storage = null;
  try {
    storage = window.localStorage;
  } catch (_) {}
  const languages =
    typeof navigator === "undefined"
      ? []
      : navigator.languages || [navigator.language];
  return effectiveLanguage(storage ? savedLanguage(storage) : FOLLOW_SYSTEM, languages);
}

export function languageHeaders(headers = {}, locale = browserLanguage()) {
  return { ...headers, "X-Lang": normalizeLanguage(locale) || "zh-CN" };
}

export function translateUI(value, params = {}, locale = "zh-CN") {
  const key = messages.sourceKeys[value] || value;
  const source = pcMessages["zh-CN"][key] || messages.zh[key] || value;
  const text =
    locale === "en"
      ? pcMessages.en[key] ||
        desktopEnglish[value] ||
        normalizedDesktopEnglish[normalizedText(value)] ||
        messages.en[key] ||
        source
      : source;
  return String(text).replace(/\{\{?(\w+)\}?\}/g, (match, name) =>
    params[name] === undefined ? match : String(params[name])
  );
}
