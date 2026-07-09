import { parseLegacyContent } from "./writerEditorLegacyAdapter.js";
import { textCorrectionDB } from "./db.js";

const CACHE_VERSION = 1;
const SMART_CACHE_VERSION = 2;
const MAX_CACHE_ENTRIES = 1500;

const LOCAL_STORAGE_CACHE_KEY_PREFIX = "writer_text_correction_cache_v1_";
const LOCAL_STORAGE_IGNORED_KEY_PREFIX = "writer_text_correction_ignored_v1_";
const LOCAL_STORAGE_SMART_CACHE_KEY_PREFIX = "writer_text_correction_smart_cache_v2_";
const LOCAL_STORAGE_SMART_IGNORED_KEY_PREFIX = "writer_text_correction_smart_ignored_v2_";

const migrationStore = {};

function migrationHasRun(name) {
  return migrationStore[name] === true;
}

function markMigrationDone(name) {
  migrationStore[name] = true;
}

async function tryMigrateFromLocalStorage(table, version, localStoragePrefix) {
  const raw = window.localStorage.getItem(localStoragePrefix);
  if (!raw) {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return null;
  }

  if (!parsed || typeof parsed !== "object" || parsed.version !== version) {
    return null;
  }

  window.localStorage.removeItem(localStoragePrefix);
  return {
    version,
    updated_at: Number(parsed.updated_at || 0),
    entries: parsed.entries && typeof parsed.entries === "object" ? parsed.entries : {},
  };
}

async function loadFromIndexedDB(table, userId, version, localStoragePrefix) {
  const id = String(userId || 0);

  if (!migrationHasRun(`${table.name}_${id}`)) {
    markMigrationDone(`${table.name}_${id}`);
    const migrated = await tryMigrateFromLocalStorage(table, version, localStoragePrefix);
    if (migrated) {
      await table.put({ ...migrated, id });
      return migrated;
    }
  }

  try {
    const row = await table.get(id);
    if (row && row.version === version) {
      return {
        version,
        updated_at: Number(row.updated_at || 0),
        entries: row.entries && typeof row.entries === "object" ? row.entries : {},
      };
    }
  } catch (error) {
    // IndexedDB unavailable, fall back to empty
  }

  return null;
}

async function persistToIndexedDB(table, userId, data, version) {
  const id = String(userId || 0);
  try {
    await table.put({
      id,
      version,
      updated_at: Number(data.updated_at || Date.now()),
      entries: data.entries && typeof data.entries === "object" ? data.entries : {},
    });
  } catch (error) {
    // Silently ignore persistence errors
  }
}

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

function createEmptyCache(version) {
  return {
    version,
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

function writeParagraphResultsToCache(cache, results, version) {
  const nextCache = cache && typeof cache === "object"
    ? {
        version,
        updated_at: Number(cache.updated_at || 0),
        entries: {
          ...(cache.entries || {}),
        },
      }
    : createEmptyCache(version);

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

export function isCorrectionIgnored(store, result) {
  if (!store || !store.entries) {
    return false;
  }

  const ignoredKey = buildIgnoredCorrectionKey(result);
  return Boolean(ignoredKey && store.entries[ignoredKey]);
}

function ignoreResult(store, result, version) {
  const nextStore = store && typeof store === "object"
    ? {
        version,
        updated_at: Number(store.updated_at || 0),
        entries: {
          ...(store.entries || {}),
        },
      }
    : createEmptyCache(version);

  const ignoredKey = buildIgnoredCorrectionKey(result);
  if (!ignoredKey) {
    return nextStore;
  }

  nextStore.updated_at = Date.now();
  nextStore.entries[ignoredKey] = nextStore.updated_at;
  return nextStore;
}

// ─── Standard (v1) cache ────────────────────────────────────────

export async function loadTextCorrectionCache(userId) {
  const data = await loadFromIndexedDB(
    textCorrectionDB.standardCache,
    userId,
    CACHE_VERSION,
    LOCAL_STORAGE_CACHE_KEY_PREFIX + String(userId || 0)
  );
  return data || createEmptyCache(CACHE_VERSION);
}

export function writeStandardParagraphResultsToCache(cache, results) {
  return writeParagraphResultsToCache(cache, results, CACHE_VERSION);
}

export async function persistTextCorrectionCache(userId, cache) {
  const normalized = {
    updated_at: Number(cache?.updated_at || Date.now()),
    entries: pruneCacheEntries(cache?.entries || {}),
  };
  await persistToIndexedDB(textCorrectionDB.standardCache, userId, normalized, CACHE_VERSION);
}

export async function loadIgnoredCorrections(userId) {
  const data = await loadFromIndexedDB(
    textCorrectionDB.standardIgnored,
    userId,
    CACHE_VERSION,
    LOCAL_STORAGE_IGNORED_KEY_PREFIX + String(userId || 0)
  );
  return data || createEmptyCache(CACHE_VERSION);
}

export async function persistIgnoredCorrections(userId, store) {
  const normalized = {
    updated_at: Number(store?.updated_at || Date.now()),
    entries: store?.entries && typeof store.entries === "object" ? store.entries : {},
  };
  await persistToIndexedDB(textCorrectionDB.standardIgnored, userId, normalized, CACHE_VERSION);
}

export function ignoreCorrectionResult(store, result) {
  return ignoreResult(store, result, CACHE_VERSION);
}

// ─── Smart (v2) cache ───────────────────────────────────────────

export async function loadSmartCorrectionCache(userId) {
  const data = await loadFromIndexedDB(
    textCorrectionDB.smartCache,
    userId,
    SMART_CACHE_VERSION,
    LOCAL_STORAGE_SMART_CACHE_KEY_PREFIX + String(userId || 0)
  );
  return data || createEmptyCache(SMART_CACHE_VERSION);
}

export function getCachedSmartParagraphResult(cache, paragraph) {
  if (!cache || !cache.entries) {
    return null;
  }

  const entry = normalizeCacheEntry(cache.entries[paragraph.paragraph_hash]);
  if (!entry || entry.text !== paragraph.text) {
    return null;
  }

  return hydrateParagraphResult(paragraph, entry.result);
}

export function writeSmartParagraphResultsToCache(cache, results) {
  return writeParagraphResultsToCache(cache, results, SMART_CACHE_VERSION);
}

export async function persistSmartCorrectionCache(userId, cache) {
  const normalized = {
    updated_at: Number(cache?.updated_at || Date.now()),
    entries: pruneCacheEntries(cache?.entries || {}),
  };
  await persistToIndexedDB(textCorrectionDB.smartCache, userId, normalized, SMART_CACHE_VERSION);
}

export async function loadSmartIgnoredCorrections(userId) {
  const data = await loadFromIndexedDB(
    textCorrectionDB.smartIgnored,
    userId,
    SMART_CACHE_VERSION,
    LOCAL_STORAGE_SMART_IGNORED_KEY_PREFIX + String(userId || 0)
  );
  return data || createEmptyCache(SMART_CACHE_VERSION);
}

export async function persistSmartIgnoredCorrections(userId, store) {
  const normalized = {
    updated_at: Number(store?.updated_at || Date.now()),
    entries: store?.entries && typeof store.entries === "object" ? store.entries : {},
  };
  await persistToIndexedDB(textCorrectionDB.smartIgnored, userId, normalized, SMART_CACHE_VERSION);
}

export function ignoreSmartCorrectionResult(store, result) {
  return ignoreResult(store, result, SMART_CACHE_VERSION);
}
