import { languageHeaders } from "~/utils/language";

export function localizedFetch(input, init = {}) {
  const headers = languageHeaders(init.headers || {});
  return globalThis.fetch(input, { ...init, headers });
}
