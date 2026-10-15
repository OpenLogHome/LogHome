import Vue from "vue";
import moment from "moment";
import elementLocale from "element-ui/lib/locale";
import elementEnglish from "element-ui/lib/locale/lang/en";
import elementChinese from "element-ui/lib/locale/lang/zh-CN";
import { socialRequest } from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
import {
  LANGUAGE_KEY,
  FOLLOW_SYSTEM,
  savedLanguage,
  effectiveLanguage,
  translateUI,
} from "~/utils/language";

export default (_context, inject) => {
  // Element UI must use its own locale fallback rather than Nuxt's prototype injection getter.
  elementLocale.i18n(() => undefined);
  const state = Vue.observable({
    preference: FOLLOW_SYSTEM,
    locale: "zh-CN",
    saving: false,
    syncError: "",
  });
  let storage = null,
    account = null,
    version = 0;
  if (typeof window !== "undefined") {
    try {
      storage = window.localStorage;
    } catch (_) {}
  }
  const languages = () =>
    typeof navigator === "undefined" ? [] : navigator.languages || [navigator.language];
  const apply = (preference) => {
    state.preference = ["zh-CN", "en"].includes(preference) ? preference : FOLLOW_SYSTEM;
    state.locale = effectiveLanguage(state.preference, languages());
    try {
      storage.setItem(LANGUAGE_KEY, state.preference);
    } catch (_) {}
    if (typeof document !== "undefined") document.documentElement.lang = state.locale;
    if (typeof window !== "undefined") {
      elementLocale.i18n(() => {
        // Register the reactive dependency used by Element UI computed labels.
        void state.locale;
        return undefined;
      });
      moment.locale(state.locale === "en" ? "en" : "zh-cn");
      elementLocale.use(state.locale === "en" ? elementEnglish : elementChinese);
    }
  };
  const sync = async () => {
    const token = readingToken(),
      requestVersion = ++version;
    account = token;
    if (!token) return;
    try {
      const result = await socialRequest("/users/language", {}, "GET", null, true);
      if (requestVersion !== version || token !== readingToken()) return;
      if (
        !result ||
        !Object.prototype.hasOwnProperty.call(result, "language") ||
        (result.language !== null && !["zh-CN", "en"].includes(result.language))
      )
        throw new Error("语言偏好数据异常");
      apply(result.language || FOLLOW_SYSTEM);
      state.syncError = "";
    } catch (_) {}
  };
  const api = {
    state,
    async set(preference) {
      if (state.saving) return;
      const requestVersion = ++version,
        token = readingToken();
      apply(preference);
      state.syncError = "";
      if (!token) return;
      state.saving = true;
      try {
        const result = await socialRequest(
          "/users/language",
          {},
          "POST",
          {
            language: state.preference === FOLLOW_SYSTEM ? null : state.preference,
          },
          true
        );
        if (requestVersion !== version || token !== readingToken()) return;
        if (
          !result ||
          result.language !==
            (state.preference === FOLLOW_SYSTEM ? null : state.preference)
        )
          throw new Error("语言设置保存结果异常");
      } catch (error) {
        if (requestVersion === version)
          state.syncError = error.message || "账号语言同步失败";
      } finally {
        if (requestVersion === version) state.saving = false;
      }
    },
    sync,
  };
  inject("language", api);
  inject("t", (value, params) => translateUI(value, params, state.locale));
  if (typeof window === "undefined") return;
  const initialize = () => {
    apply(savedLanguage(storage));
    sync();
  };
  // Match the SSR locale during hydration, then update text and accessible attributes together.
  if (typeof window.onNuxtReady === "function") window.onNuxtReady(initialize);
  else initialize();
  const accountChanged = () => {
    if (account !== readingToken()) {
      version++;
      state.syncError = "";
      state.saving = false;
      sync();
    }
  };
  const storageChanged = (event) => {
    if (event.key === LANGUAGE_KEY || event.key === null) apply(savedLanguage(storage));
    if (event.key === "token" || event.key === null) accountChanged();
  };
  const deviceChanged = () => {
    if (state.preference === FOLLOW_SYSTEM) apply(FOLLOW_SYSTEM);
  };
  window.addEventListener("storage", storageChanged);
  window.addEventListener("focus", accountChanged);
  window.addEventListener("auth-state-changed", accountChanged);
  window.addEventListener("languagechange", deviceChanged);
  if (typeof module !== "undefined" && module.hot)
    module.hot.dispose(() => {
      version++;
      window.removeEventListener("storage", storageChanged);
      window.removeEventListener("focus", accountChanged);
      window.removeEventListener("auth-state-changed", accountChanged);
      window.removeEventListener("languagechange", deviceChanged);
    });
};
