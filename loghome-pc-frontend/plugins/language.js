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
  SUPPORTED_LANGUAGES,
  acceptedLanguages,
  parseLanguageCookie,
  savedLanguage,
  effectiveLanguage,
  translateUI,
} from "~/utils/language";

export default (context, inject) => {
  // Element UI must use its own locale fallback rather than Nuxt's prototype injection getter.
  elementLocale.i18n(() => undefined);
  const requestHeaders = (context.req && context.req.headers) || {};
  const serverPreference = parseLanguageCookie(requestHeaders.cookie || "");
  const serverLocale = effectiveLanguage(
    serverPreference,
    acceptedLanguages(requestHeaders["accept-language"] || "")
  );
  const state = Vue.observable({
    preference: serverPreference,
    locale: serverLocale,
    saving: false,
    syncError: "",
  });
  if (context.$axios) context.$axios.setHeader("X-Lang", state.locale);
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
    state.preference = SUPPORTED_LANGUAGES.includes(preference)
      ? preference
      : FOLLOW_SYSTEM;
    state.locale = effectiveLanguage(state.preference, languages());
    try {
      storage.setItem(LANGUAGE_KEY, state.preference);
    } catch (_) {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = state.locale;
      document.cookie = `${LANGUAGE_KEY}=${encodeURIComponent(
        state.preference
      )}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
    if (typeof window !== "undefined") {
      if (context.$axios) context.$axios.setHeader("X-Lang", state.locale);
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
  if (context.app) {
    context.app.head = context.app.head || {};
    context.app.head.htmlAttrs = {
      ...(context.app.head.htmlAttrs || {}),
      lang: state.locale,
    };
  }
  if (typeof window === "undefined") return;
  const initialize = () => {
    const stored = savedLanguage(storage);
    const cookie = parseLanguageCookie(document.cookie);
    apply(stored === FOLLOW_SYSTEM && cookie !== FOLLOW_SYSTEM ? cookie : stored);
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
