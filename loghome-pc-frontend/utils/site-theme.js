export const SITE_THEME_KEY = "loghome.theme";
const valid = (value) => ["light", "dark", "system"].includes(value);

export function readThemePreference(storage) {
  try {
    const saved = storage.getItem(SITE_THEME_KEY);
    if (valid(saved)) return saved;
    const previous = storage.getItem("loghome.social.theme");
    if (valid(previous)) return previous;
  } catch (_) {}
  return "system";
}

export function resolvedSiteTheme(preference, systemDark) {
  return preference === "dark" || (preference === "system" && systemDark)
    ? "dark"
    : "light";
}

export function saveThemePreference(storage, value) {
  const preference = valid(value) ? value : "system";
  try {
    storage.setItem(SITE_THEME_KEY, preference);
  } catch (_) {}
  return preference;
}
