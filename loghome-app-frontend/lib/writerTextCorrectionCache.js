import { parseLegacyContent } from "./writerEditorLegacyAdapter.js";

const CACHE_VERSION = 1;
const CACHE_STORAGE_KEY_PREFIX = "writer_text_correction_cache_v1_";
const IGNORED_STORAGE_KEY_PREFIX = "writer_text_correction_ignored_v1_";
const MAX_CACHE_ENTRIES = 1500;

export function normalizeCorrectionText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}

function normalizeParagraphId(block) {
  const rawId =
    block && block.id !== undefined && block.id !== null
      ? block.id
      : block && block.paragraph_id !== undefined && block.paragraph_id !== null
        ? block.paragraph_id
        : null;

  if (rawId === null || rawId === "") {
    return null;
  }

  const normalizedId = Number(rawId);
  return Number.isInteger(normalizedId) && normalizedId > 0
    ? normalizedId
    : null;
}

export function hashParagraphText(text, seed = 0) {
  const value = String(text || "");
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let index = 0; index < value.length; index += 1) {
    const charCode = value.charCodeAt(index);
    h1 = Math.imul(h1 ^ charCode, 2654435761);
    h2 = Math.imul(h2 ^ charCode, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return `${(
    4294967296 * (2097151 & h2) +
    (h1 >>> 0)
  ).toString(16)}_${value.length}`;
}

export function buildCorrectionParagraphs(content) {
  const blocks = parseLegacyContent(content);
  const paragraphs = [];

  blocks.forEach((block) => {
    if (!block || block.type !== "text") {
      return;
    }

    const text = normalizeCorrectionText(block.value);
    if (!text) {
      return;
    }

    paragraphs.push({
      paragraph_index: paragraphs.length + 1,
      paragraph_id: normalizeParagraphId(block),
      text,
      paragraph_hash: hashParagraphText(text),
    });
  });

  return paragraphs;
}

export function buildParagraphRequestKey(paragraph) {
  return `${String(paragraph.paragraph_hash || "")}::${String(
    paragraph.text || ""
  )}`;
}

export function buildCorrectionIssueSignature(result) {
  const fragments = Array.isArray(result?.fragments) ? result.fragments : [];
  return fragments
    .map((fragment) => {
      return [
        Number(fragment?.begin_pos || 0),
        Number(fragment?.end_pos || 0),
        String(fragment?.original_fragment || ""),
        String(fragment?.corrected_fragment || ""),
      ].join(":");
    })
    .join("|");
}

export function buildIgnoredCorrectionKey(result) {
  return `${String(result?.paragraph_hash || "")}::${buildCorrectionIssueSignature(
    result
  )}`;
}

export function createEmptyTextCorrectionCache() {
  return {
    version: CACHE_VERSION,
    updated_at: 0,
    entries: {},
  };
}

function cloneFragments(fragments) {
  if (!Array.isArray(fragments)) {
    return [];
  }

  return fragments.map((fragment, index) => ({
    id:
      fragment && fragment.id
        ? fragment.id
        : `fragment_${index + 1}_${Number(fragment?.begin_pos || 0)}`,
    original_fragment: String(fragment?.original_fragment || ""),
    corrected_fragment: String(fragment?.corrected_fragment || ""),
    begin_pos: Number(fragment?.begin_pos || 0),
    end_pos: Number(fragment?.end_pos || 0),
  }));
}

function normalizeCacheEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  return {
    text: String(entry.text || ""),
    updated_at: Number(entry.updated_at || 0),
    result: {
      corrected_text:
        typeof entry.result?.corrected_text === "string"
          ? entry.result.corrected_text
          : String(entry.text || ""),
      has_issue: Boolean(entry.result?.has_issue),
      fragments: cloneFragments(entry.result?.fragments),
    },
  };
}

export function hydrateParagraphResult(paragraph, result) {
  const fragments = cloneFragments(result?.fragments);
  return {
    id: `paragraph_${Number(paragraph.paragraph_index || 0)}_${String(
      paragraph.paragraph_hash || paragraph.paragraph_id || "text"
    )}`,
    paragraph_index: Number(paragraph.paragraph_index || 0),
    paragraph_id:
      paragraph.paragraph_id === undefined ? null : paragraph.paragraph_id,
    paragraph_hash: paragraph.paragraph_hash || null,
    original_text: String(paragraph.text || ""),
    corrected_text:
      typeof result?.corrected_text === "string"
        ? result.corrected_text
        : String(paragraph.text || ""),
    has_issue: Boolean(result?.has_issue) && fragments.length > 0,
    fragments,
    error: result?.error ? String(result.error) : null,
  };
}

export function loadTextCorrectionCache(userId) {
  const cacheKey = `${CACHE_STORAGE_KEY_PREFIX}${Number(userId || 0)}`;
  const raw = window.localStorage.getItem(cacheKey);
  if (!raw) {
    return createEmptyTextCorrectionCache();
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.version !== CACHE_VERSION) {
      return createEmptyTextCorrectionCache();
    }

    return {
      version: CACHE_VERSION,
      updated_at: Number(parsed.updated_at || 0),
      entries:
        parsed.entries && typeof parsed.entries === "object" ? parsed.entries : {},
    };
  } catch (error) {
    return createEmptyTextCorrectionCache();
  }
}

export function getCachedParagraphResult(cache, paragraph) {
  if (!cache || !cache.entries) {
    return null;
  }

  const entry = normalizeCacheEntry(cache.entries[paragraph.paragraph_hash]);
  if (!entry || entry.text !== paragraph.text) {
    return null;
  }

  return hydrateParagraphResult(paragraph, entry.result);
}

function pruneCacheEntries(entries) {
  const normalizedEntries = Object.entries(entries || {})
    .map(([key, entry]) => [key, normalizeCacheEntry(entry)])
    .filter(([, entry]) => Boolean(entry));

  normalizedEntries.sort((left, right) => right[1].updated_at - left[1].updated_at);

  return Object.fromEntries(normalizedEntries.slice(0, MAX_CACHE_ENTRIES));
}

export function writeParagraphResultsToCache(cache, results) {
  const nextCache = cache && typeof cache === "object"
    ? {
        version: CACHE_VERSION,
        updated_at: Number(cache.updated_at || 0),
        entries: {
          ...(cache.entries || {}),
        },
      }
    : createEmptyTextCorrectionCache();

  const now = Date.now();
  (results || []).forEach((result) => {
    if (!result || result.error || !result.paragraph_hash || !result.original_text) {
      return;
    }

    nextCache.entries[result.paragraph_hash] = {
      text: String(result.original_text),
      updated_at: now,
      result: {
        corrected_text:
          typeof result.corrected_text === "string"
            ? result.corrected_text
            : String(result.original_text),
        has_issue: Boolean(result.has_issue),
        fragments: cloneFragments(result.fragments),
      },
    };
  });

  nextCache.updated_at = now;
  nextCache.entries = pruneCacheEntries(nextCache.entries);
  return nextCache;
}

export function persistTextCorrectionCache(userId, cache) {
  const cacheKey = `${CACHE_STORAGE_KEY_PREFIX}${Number(userId || 0)}`;
  const normalizedCache = {
    version: CACHE_VERSION,
    updated_at: Number(cache?.updated_at || Date.now()),
    entries: pruneCacheEntries(cache?.entries),
  };

  window.localStorage.setItem(cacheKey, JSON.stringify(normalizedCache));
}

function createEmptyIgnoredCorrectionStore() {
  return {
    version: CACHE_VERSION,
    updated_at: 0,
    entries: {},
  };
}

export function loadIgnoredCorrections(userId) {
  const storageKey = `${IGNORED_STORAGE_KEY_PREFIX}${Number(userId || 0)}`;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return createEmptyIgnoredCorrectionStore();
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.version !== CACHE_VERSION) {
      return createEmptyIgnoredCorrectionStore();
    }

    return {
      version: CACHE_VERSION,
      updated_at: Number(parsed.updated_at || 0),
      entries:
        parsed.entries && typeof parsed.entries === "object" ? parsed.entries : {},
    };
  } catch (error) {
    return createEmptyIgnoredCorrectionStore();
  }
}

export function persistIgnoredCorrections(userId, store) {
  const storageKey = `${IGNORED_STORAGE_KEY_PREFIX}${Number(userId || 0)}`;
  const normalizedStore = {
    version: CACHE_VERSION,
    updated_at: Number(store?.updated_at || Date.now()),
    entries: store?.entries && typeof store.entries === "object" ? store.entries : {},
  };
  window.localStorage.setItem(storageKey, JSON.stringify(normalizedStore));
}

export function isCorrectionIgnored(store, result) {
  if (!store || !store.entries) {
    return false;
  }

  const ignoredKey = buildIgnoredCorrectionKey(result);
  return Boolean(ignoredKey && store.entries[ignoredKey]);
}

export function ignoreCorrectionResult(store, result) {
  const nextStore = store && typeof store === "object"
    ? {
        version: CACHE_VERSION,
        updated_at: Number(store.updated_at || 0),
        entries: {
          ...(store.entries || {}),
        },
      }
    : createEmptyIgnoredCorrectionStore();

  const ignoredKey = buildIgnoredCorrectionKey(result);
  if (!ignoredKey) {
    return nextStore;
  }

  nextStore.updated_at = Date.now();
  nextStore.entries[ignoredKey] = nextStore.updated_at;
  return nextStore;
}
