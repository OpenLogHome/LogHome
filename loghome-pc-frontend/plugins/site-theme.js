import Vue from "vue";
import {
  SITE_THEME_KEY,
  readThemePreference,
  resolvedSiteTheme,
  saveThemePreference,
} from "~/utils/site-theme";

// Create state per Nuxt app so SSR requests never share a user's preference.
export default (_context, inject) => {
  let storage = null;
  if (typeof window !== "undefined") {
    try {
      storage = window.localStorage;
    } catch (_) {}
  }
  const state = Vue.observable({ preference: "system", systemDark: false });
  const apply = () => {
    if (typeof document === "undefined") return;
    const theme = resolvedSiteTheme(state.preference, state.systemDark);
    document.documentElement.setAttribute("data-site-theme", theme);
    // Keep existing community palettes on the same global preference.
    document.documentElement.setAttribute("data-social-theme", theme);
  };
  const theme = {
    state,
    get resolved() {
      return resolvedSiteTheme(state.preference, state.systemDark);
    },
    set(preference) {
      state.preference = saveThemePreference(storage, preference);
      apply();
    },
    toggle() {
      this.set(this.resolved === "dark" ? "light" : "dark");
    },
  };
  inject("theme", theme);
  if (typeof window === "undefined") return;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  state.preference = readThemePreference(storage);
  state.systemDark = media.matches;
  apply();
  const systemChanged = (event) => {
    state.systemDark = event.matches;
    apply();
  };
  const storageChanged = (event) => {
    if (event.key !== SITE_THEME_KEY && event.key !== null) return;
    state.preference = readThemePreference(window.localStorage);
    apply();
  };
  if (media.addEventListener) media.addEventListener("change", systemChanged);
  else if (media.addListener) media.addListener(systemChanged);
  window.addEventListener("storage", storageChanged);
  if (typeof module !== "undefined" && module.hot)
    module.hot.dispose(() => {
      if (media.removeEventListener)
        media.removeEventListener("change", systemChanged);
      else if (media.removeListener) media.removeListener(systemChanged);
      window.removeEventListener("storage", storageChanged);
    });
};
