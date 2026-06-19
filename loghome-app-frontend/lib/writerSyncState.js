import crypto from "crypto";
import { normalizeLegacyContentForStorage } from "./writerEditorLegacyAdapter.js";

export function buildWriterSyncStateKey(userId, articleId) {
  return `writer_sync_state_${Number(userId || 0)}_${Number(articleId || 0)}`;
}

export function buildClientSyncTime(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  const seconds = String(value.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function computeWriterContentHash(content = "") {
  return crypto
    .createHash("md5")
    .update(normalizeLegacyContentForStorage(content))
    .digest("hex");
}

export function readWriterSyncState(userId, articleId) {
  if (!articleId) {
    return null;
  }

  const raw = window.localStorage.getItem(
    buildWriterSyncStateKey(userId, articleId)
  );
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function writeWriterSyncState(userId, articleId, state) {
  if (!articleId) {
    return null;
  }

  const nextState = {
    status: "synced",
    session_id: "",
    local_hash: "",
    local_create_time: "",
    remote_hash: "",
    remote_create_time: "",
    remote_updated_at: "",
    updated_at: Date.now(),
    last_error: "",
    ...(state || {}),
  };

  window.localStorage.setItem(
    buildWriterSyncStateKey(userId, articleId),
    JSON.stringify(nextState)
  );
  return nextState;
}

export function clearWriterSyncState(userId, articleId) {
  if (!articleId) {
    return;
  }
  window.localStorage.removeItem(buildWriterSyncStateKey(userId, articleId));
}

export function isWriterSyncStatePending(state) {
  return !!state && state.status === "pending";
}

export function markWriterSyncPending({
  userId,
  articleId,
  content,
  localCreateTime = "",
  sessionId = "",
  previousState = null,
  lastError = "",
}) {
  const baseState = previousState || readWriterSyncState(userId, articleId) || {};
  return writeWriterSyncState(userId, articleId, {
    ...baseState,
    status: "pending",
    session_id: sessionId || baseState.session_id || "",
    local_hash: computeWriterContentHash(content),
    local_create_time: localCreateTime || baseState.local_create_time || "",
    remote_hash: baseState.remote_hash || "",
    remote_create_time: baseState.remote_create_time || "",
    remote_updated_at: baseState.remote_updated_at || "",
    updated_at: Date.now(),
    last_error: lastError || "",
  });
}

export function markWriterSyncSynced({
  userId,
  articleId,
  content,
  remoteCreateTime = "",
  remoteUpdatedAt = "",
  sessionId = "",
}) {
  const contentHash = computeWriterContentHash(content);
  return writeWriterSyncState(userId, articleId, {
    status: "synced",
    session_id: sessionId || "",
    local_hash: contentHash,
    local_create_time: remoteCreateTime || "",
    remote_hash: contentHash,
    remote_create_time: remoteCreateTime || "",
    remote_updated_at: remoteUpdatedAt || "",
    updated_at: Date.now(),
    last_error: "",
  });
}

export function markWriterSyncInvalidated({
  userId,
  articleId,
  content,
  localCreateTime = "",
  sessionId = "",
  previousState = null,
  lastError = "",
}) {
  const baseState = previousState || readWriterSyncState(userId, articleId) || {};
  return writeWriterSyncState(userId, articleId, {
    ...baseState,
    status: "invalidated",
    session_id: sessionId || baseState.session_id || "",
    local_hash: computeWriterContentHash(content),
    local_create_time: localCreateTime || baseState.local_create_time || "",
    remote_updated_at: baseState.remote_updated_at || "",
    updated_at: Date.now(),
    last_error: lastError || "",
  });
}
