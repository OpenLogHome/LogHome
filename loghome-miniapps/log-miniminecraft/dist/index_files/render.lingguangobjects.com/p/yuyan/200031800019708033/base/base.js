var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const FLASH_APP_AUDIO_CONTROL = "FLASH_APP_AUDIO_CONTROL";
const FLASH_APP_AUDIO_PLAYBACK_STATE = "FLASH_APP_AUDIO_PLAYBACK_STATE";
class FlashAppAudioRuntimeImpl {
  constructor() {
    __publicField(this, "muted", false);
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
  }
  getMuted() {
    return this.muted;
  }
  setMuted(muted) {
    if (this.muted === muted) {
      return;
    }
    this.muted = muted;
    this.listeners.forEach((listener) => listener(muted));
  }
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.muted);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
const getFlashAppAudioRuntime = (targetWindow = window) => {
  if (!targetWindow.__FLASH_APP_AUDIO__) {
    targetWindow.__FLASH_APP_AUDIO__ = new FlashAppAudioRuntimeImpl();
  }
  return targetWindow.__FLASH_APP_AUDIO__;
};
const AUDIO_INACTIVE_DELAY_MS = 300;
const isLiveAudioContext = (context) => {
  const candidate = context;
  return typeof candidate.resume === "function" && typeof candidate.suspend === "function" && typeof candidate.close === "function";
};
const installFlashAppAudioPlaybackTracker = () => {
  const activeMediaElements = /* @__PURE__ */ new Set();
  const trackedMediaElements = /* @__PURE__ */ new WeakSet();
  const audioContexts = /* @__PURE__ */ new Map();
  let inactiveTimer = null;
  let lastNotifiedState = false;
  const hasActiveWebAudio = () => {
    for (const [context, state] of audioContexts) {
      if (context.state === "running" && state.sources.size > 0) {
        return true;
      }
    }
    return false;
  };
  const getIsPlaying = () => activeMediaElements.size > 0 || hasActiveWebAudio();
  const publishState = (isPlaying) => {
    if (lastNotifiedState === isPlaying) {
      return;
    }
    lastNotifiedState = isPlaying;
    if (window.parent === window) {
      return;
    }
    window.parent.postMessage(
      {
        type: FLASH_APP_AUDIO_PLAYBACK_STATE,
        isPlaying
      },
      "*"
    );
  };
  const syncState = () => {
    const isPlaying = getIsPlaying();
    if (isPlaying) {
      if (inactiveTimer !== null) {
        window.clearTimeout(inactiveTimer);
        inactiveTimer = null;
      }
      publishState(true);
      return;
    }
    if (!lastNotifiedState || inactiveTimer !== null) {
      return;
    }
    inactiveTimer = window.setTimeout(() => {
      inactiveTimer = null;
      if (!getIsPlaying()) {
        publishState(false);
      }
    }, AUDIO_INACTIVE_DELAY_MS);
  };
  const setMediaElementPlaying = (element, isPlaying) => {
    if (isPlaying) {
      activeMediaElements.add(element);
    } else {
      activeMediaElements.delete(element);
    }
    syncState();
  };
  const trackMediaElement = (element) => {
    if (trackedMediaElements.has(element)) {
      return;
    }
    trackedMediaElements.add(element);
    element.addEventListener("playing", () => setMediaElementPlaying(element, true));
    ["pause", "ended", "error", "abort", "emptied"].forEach((eventName) => {
      element.addEventListener(eventName, () => setMediaElementPlaying(element, false));
    });
  };
  const handleMediaEvent = (event) => {
    if (typeof HTMLMediaElement === "undefined" || !(event.target instanceof HTMLMediaElement)) {
      return;
    }
    const element = event.target;
    trackMediaElement(element);
    setMediaElementPlaying(element, event.type === "playing");
  };
  const installMediaHooks = () => {
    if (typeof HTMLMediaElement === "undefined") {
      return;
    }
    const mediaPrototype = HTMLMediaElement.prototype;
    const originalPlay = mediaPrototype.play;
    if (!originalPlay.__FLASH_APP_AUDIO_PLAYBACK_WRAPPED__) {
      const wrappedPlay = function() {
        trackMediaElement(this);
        return originalPlay.call(this);
      };
      wrappedPlay.__FLASH_APP_AUDIO_PLAYBACK_WRAPPED__ = true;
      mediaPrototype.play = wrappedPlay;
    }
    ["playing", "pause", "ended", "error", "abort", "emptied"].forEach((eventName) => {
      document.addEventListener(eventName, handleMediaEvent, true);
    });
  };
  const trackAudioContext = (context) => {
    const existing = audioContexts.get(context);
    if (existing) {
      return existing;
    }
    const state = { sources: /* @__PURE__ */ new Set() };
    audioContexts.set(context, state);
    context.addEventListener("statechange", syncState);
    const originalClose = context.close.bind(context);
    context.close = async () => {
      try {
        return await originalClose();
      } finally {
        state.sources.clear();
        audioContexts.delete(context);
        syncState();
      }
    };
    return state;
  };
  const trackScheduledSource = (source) => {
    const trackedSource = source;
    if (trackedSource.__FLASH_APP_AUDIO_PLAYBACK_TRACKED__) {
      return;
    }
    trackedSource.__FLASH_APP_AUDIO_PLAYBACK_TRACKED__ = true;
    const context = source.context;
    if (!isLiveAudioContext(context)) {
      return;
    }
    const contextState = trackAudioContext(context);
    contextState.sources.add(source);
    source.addEventListener(
      "ended",
      () => {
        contextState.sources.delete(source);
        syncState();
      },
      { once: true }
    );
    syncState();
  };
  const installScheduledSourceHook = (constructor) => {
    if (!constructor) {
      return;
    }
    const prototype = constructor.prototype;
    const originalStart = prototype.start;
    if (originalStart.__FLASH_APP_AUDIO_PLAYBACK_WRAPPED__) {
      return;
    }
    const wrappedStart = function(...args) {
      originalStart.apply(this, args);
      trackScheduledSource(this);
    };
    wrappedStart.__FLASH_APP_AUDIO_PLAYBACK_WRAPPED__ = true;
    prototype.start = wrappedStart;
  };
  installMediaHooks();
  const audioGlobal = globalThis;
  installScheduledSourceHook(audioGlobal.AudioBufferSourceNode);
  installScheduledSourceHook(audioGlobal.OscillatorNode);
  window.addEventListener("pagehide", () => {
    if (inactiveTimer !== null) {
      window.clearTimeout(inactiveTimer);
      inactiveTimer = null;
    }
    publishState(false);
  });
  window.addEventListener("pageshow", syncState);
};
const FLASH_APP_MEDIA_CAPTURE_CONTROL = "FLASH_APP_MEDIA_CAPTURE_CONTROL";
(function installDreiAssetsFallback() {
  const fallbackWindow = window;
  if (fallbackWindow.__flashAppDreiAssetsFallbackInstalled === true) {
    return;
  }
  fallbackWindow.__flashAppDreiAssetsFallbackInstalled = true;
  const HDRI_RAW_ROOT = "https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/";
  const CLOUD_RAW_URL = new URL("../../../../../rawcdn.githack.com/pmndrs/drei-assets/9225a9f1fbd449d9411125c2f419b843d0308c9f/cloud.png", import.meta.url).href;
  const CDN_ROOT = "https://render.lingguangobjects.com/p/yuyan/200031800009684345/drei-assets/";
  const rewriteDreiAssetUrl = (url) => {
    if (url.startsWith(HDRI_RAW_ROOT)) {
      return `${CDN_ROOT}hdri/${url.slice(HDRI_RAW_ROOT.length)}`;
    }
    if (url === CLOUD_RAW_URL) {
      return `${CDN_ROOT}cloud.png`;
    }
    return url;
  };
  const rewriteDreiAssetValue = (value) => {
    if (typeof value !== "string") {
      return value;
    }
    return rewriteDreiAssetUrl(value);
  };
  const rewriteRequestInit = (request, init) => {
    const requestInit = {
      method: request.method,
      headers: request.headers,
      mode: request.mode,
      credentials: request.credentials,
      cache: request.cache,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity,
      keepalive: request.keepalive,
      signal: request.signal
    };
    if (request.body !== null) {
      requestInit.body = request.body;
    }
    return __spreadValues(__spreadValues({}, requestInit), init);
  };
  if (typeof fallbackWindow.fetch === "function") {
    const originalFetch = fallbackWindow.fetch.bind(fallbackWindow);
    fallbackWindow.fetch = function patchedFetch(input, init) {
      if (typeof input === "string") {
        return originalFetch(rewriteDreiAssetUrl(input), init);
      }
      if (input instanceof URL) {
        const rewrittenUrl = rewriteDreiAssetUrl(input.href);
        if (rewrittenUrl !== input.href) {
          return originalFetch(rewrittenUrl, init);
        }
      }
      if (typeof Request !== "undefined" && input instanceof Request) {
        const rewrittenUrl = rewriteDreiAssetUrl(input.url);
        if (rewrittenUrl !== input.url) {
          return originalFetch(rewrittenUrl, rewriteRequestInit(input, init));
        }
      }
      return originalFetch(input, init);
    };
  }
  if (typeof HTMLImageElement === "undefined") {
    return;
  }
  const imagePrototype = HTMLImageElement.prototype;
  const srcDescriptor = Object.getOwnPropertyDescriptor(imagePrototype, "src");
  if ((srcDescriptor == null ? void 0 : srcDescriptor.configurable) === true && srcDescriptor.get && srcDescriptor.set) {
    const originalSrcGet = srcDescriptor.get;
    const originalSrcSet = srcDescriptor.set;
    Object.defineProperty(imagePrototype, "src", {
      configurable: srcDescriptor.configurable,
      enumerable: srcDescriptor.enumerable,
      get() {
        return originalSrcGet.call(this);
      },
      set(value) {
        originalSrcSet.call(this, rewriteDreiAssetValue(value));
      }
    });
  }
  const originalSetAttribute = imagePrototype.setAttribute;
  imagePrototype.setAttribute = function patchedSetAttribute(qualifiedName, value) {
    if (qualifiedName.toLowerCase() === "src") {
      originalSetAttribute.call(this, qualifiedName, rewriteDreiAssetValue(value));
      return;
    }
    originalSetAttribute.call(this, qualifiedName, value);
  };
})();
(function installObjectHasOwnPolyfill() {
  if (typeof Object.hasOwn === "function") {
    return;
  }
  Object.defineProperty(Object, "hasOwn", {
    configurable: true,
    writable: true,
    value(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }
  });
})();
let apiCallCount = 0;
const isDev = (() => {
  try {
    const hostname = window.location.hostname;
    const port = window.location.port;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }
    if (port && port !== "" && port !== "80" && port !== "443") {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
})();
const DEV_MOCK_IMAGE_URL = new URL("../../../../../gw.alipayobjects.com/render/p/yuyan/180023180034745799/assets/image.jpg", import.meta.url).href;
const DEV_MOCK_MUSIC_URL = new URL("../../../../../mdn.alipayobjects.com/asap_serivce/uri/file/as/yequ.hexin.mp3", import.meta.url).href;
const normalizeDbRole = (role) => {
  return role === "MANAGER" ? "MANAGER" : "USER";
};
const syncCurrentRole = (role) => {
  const normalizedRole = normalizeDbRole(role);
  window.currentRole = normalizedRole;
  return normalizedRole;
};
const toAssetApiParams = (params) => __spreadValues({}, params);
const AGENT_RUN_EVENT_TYPES = /* @__PURE__ */ new Set(["agent_start", "agent_progress", "agent_result_delta", "agent_result", "agent_error", "agent_done"]);
const isAgentRunEventType = (value) => {
  return AGENT_RUN_EVENT_TYPES.has(value);
};
const normalizeAgentRunStartData = (data) => {
  const dataRecord = toRecordValue(data);
  if (Object.keys(dataRecord).length === 0) {
    return void 0;
  }
  const streamPoll = toRecordValue(dataRecord._stream_poll);
  const streamId = toStringValue(streamPoll.stream_id);
  const pollIntervalMs = toNumberValue(streamPoll.poll_interval_ms);
  const sessionId = toStringValue(dataRecord.sessionId);
  const normalized = {
    message: toStringValue(dataRecord.message, "任务已开始")
  };
  if (sessionId) {
    normalized.sessionId = sessionId;
  }
  if (streamId) {
    normalized.streamId = streamId;
    normalized.cursor = 0;
  }
  if (pollIntervalMs !== void 0) {
    normalized.pollIntervalMs = pollIntervalMs;
  }
  return normalized;
};
const normalizeAgentRunEvent = (event, eventType, resultPreviewState) => {
  if (eventType === "agent_result_delta") {
    const data = event.data;
    if (!isRecordValue(data) || typeof data.delta !== "string") {
      throw new Error("agentRunStream 返回了非法流式事件");
    }
    resultPreviewState.text += data.delta;
    return __spreadProps(__spreadValues({}, event), {
      type: eventType,
      data: { text: resultPreviewState.text }
    });
  }
  if (eventType !== "agent_start") {
    return __spreadProps(__spreadValues({}, event), { type: eventType });
  }
  return __spreadProps(__spreadValues({}, event), {
    type: eventType,
    data: normalizeAgentRunStartData(event.data)
  });
};
const emitAgentRunStreamDeltaEvents = (delta, onEvent, resultPreviewState) => {
  if (!delta) {
    return;
  }
  const lines = delta.split("\n").map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const event = safeJsonParse(line);
    if (!isRecordValue(event)) {
      throw new Error("agentRunStream 返回了非法流式事件");
    }
    const eventType = toStringValue(event.type);
    if (!isAgentRunEventType(eventType)) {
      throw new Error("agentRunStream 返回了非法流式事件");
    }
    onEvent == null ? void 0 : onEvent(normalizeAgentRunEvent(event, eventType, resultPreviewState));
  }
};
const flashWindow = window;
const FLASH_APP_DOM_CONTENT_LOADED = "FLASH_APP_DOM_CONTENT_LOADED";
const FLASH_APP_BASE_TAIL_READY = "FLASH_APP_BASE_TAIL_READY";
const FLASH_APP_INSPECT_MODE_TOGGLE = "FLASH_APP_INSPECT_MODE_TOGGLE";
const FLASH_APP_INSPECT_RESULT = "FLASH_APP_INSPECT_RESULT";
const FLASH_APP_INPUT_FOCUS = "FLASH_APP_INPUT_FOCUS";
const buildAppShellRuntimeMilestonePayload = (type) => ({
  type,
  loadTraceId: flashWindow.__flashAppLoadTraceId,
  iframeTimestamp: Date.now(),
  artifactId: window.artifactId,
  artifactVersion: window.artifactVersion,
  traceId: window.trace_id
});
(function notifyAppShellDomContentLoaded() {
  if (typeof window === "undefined" || window.parent === window) {
    return;
  }
  const send = () => {
    try {
      window.parent.postMessage(buildAppShellRuntimeMilestonePayload(FLASH_APP_DOM_CONTENT_LOADED), "*");
    } catch (error) {
      console.log("[FLASH APP] 通知 app-shell DOMContentLoaded 失败", error);
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", send, { once: true });
  } else {
    send();
  }
})();
(function setupInputFocusReporter() {
  if (typeof document === "undefined" || flashWindow._inputFocusReporterInitialized) {
    return;
  }
  flashWindow._inputFocusReporterInitialized = true;
  const buildRectPayload = (rect) => ({
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y
  });
  const getOrCreateFocusId = (target) => {
    const existingFocusId = target.dataset.flashAppFocusId;
    if (existingFocusId) {
      return existingFocusId;
    }
    const focusId = `flash-app-focus-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    target.dataset.flashAppFocusId = focusId;
    return focusId;
  };
  const handleFocusIn = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      return;
    }
    const rect = target.getBoundingClientRect();
    const focusId = getOrCreateFocusId(target);
    const payload = {
      type: FLASH_APP_INPUT_FOCUS,
      focusId,
      tagName: target.tagName.toLowerCase(),
      inputType: target instanceof HTMLInputElement ? target.type : void 0,
      rect: buildRectPayload(rect),
      timestamp: Date.now()
    };
    try {
      window.parent.postMessage(payload, "*");
      console.log("[FLASH APP] input/textarea focus rect 已发送到 app-shell", payload);
    } catch (error) {
      console.log("[FLASH APP] input/textarea focus rect 发送失败", error);
    }
  };
  document.addEventListener("focusin", handleFocusIn, true);
  console.log("[FLASH APP] input/textarea focus rect 监听已初始化");
})();
const toRecordValue = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
};
const isRecordValue = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
const toStringValue = (value, fallback = "") => {
  return typeof value === "string" ? value : fallback;
};
const toStringSnapshotRecord = (value) => {
  const record = toRecordValue(value);
  const snapshot = {};
  Object.keys(record).forEach((key) => {
    snapshot[key] = toStringValue(record[key]);
  });
  return snapshot;
};
const toPrimitiveString = (value) => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  return void 0;
};
const toNumberValue = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return void 0;
};
const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};
const stripJsonFence = (value) => {
  const trimmed = value.trim();
  const match = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  return match ? match[1].trim() : trimmed;
};
const buildLingguangAiChatResultFromContent = (content, responseFormat, traceId) => {
  const result = { content };
  const responseType = (responseFormat == null ? void 0 : responseFormat.type) || "text";
  if (responseType === "json_object" || responseType === "json_schema") {
    const parsed = safeJsonParse(stripJsonFence(content));
    if (parsed === null || responseType === "json_object" && !isRecordValue(parsed)) {
      throw new Error("AI 返回内容不是合法 JSON");
    }
    result.data = parsed;
  }
  return result;
};
const buildDevAiChatContent = (content, responseFormat) => {
  const responseType = (responseFormat == null ? void 0 : responseFormat.type) || "text";
  if (responseType === "json_object" || responseType === "json_schema") {
    return JSON.stringify({ mock: true, content });
  }
  return content;
};
const toVisibilityState = (value) => {
  if (value === "visible" || value === "hidden") {
    return value;
  }
  return void 0;
};
const getErrorMessage = (error, fallback) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  const record = toRecordValue(error);
  return toStringValue(record.message, fallback);
};
const getErrorCode = (error) => {
  const record = toRecordValue(error);
  return toPrimitiveString(record.code);
};
const getErrorStack = (error) => {
  if (error instanceof Error && typeof error.stack === "string") {
    return error.stack;
  }
  const record = toRecordValue(error);
  return toStringValue(record.stack) || void 0;
};
const getErrorName = (error) => {
  if (error instanceof Error && error.name) {
    return error.name;
  }
  const record = toRecordValue(error);
  return toPrimitiveString(record.name);
};
const isAutoFixableInstrumentedCatchError = (stack) => {
  return typeof stack === "string" && stack.trimStart().startsWith("TypeError:");
};
const serializeInstrumentedCatchError = (error) => {
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") {
    return String(error);
  }
  if (typeof error === "symbol") {
    return error.description ? `Symbol(${error.description})` : "Symbol()";
  }
  if (typeof error === "function") {
    return `[Function ${error.name || "anonymous"}]`;
  }
  if (error === void 0) {
    return "undefined";
  }
  if (error === null) {
    return "null";
  }
  try {
    const serialized = JSON.stringify(error);
    return serialized === void 0 ? getErrorMessage(error, "Non-serializable catch error") : serialized;
  } catch (e) {
    return getErrorMessage(error, "Non-serializable catch error");
  }
};
const normalizeHeadersRecord = (headers) => {
  const normalized = {};
  if (!headers) {
    return normalized;
  }
  const resolvedHeaders = new Headers(headers);
  resolvedHeaders.forEach((value, key) => {
    normalized[key] = value;
  });
  return normalized;
};
const normalizeQueryRecord = (url) => {
  const query = {};
  url.searchParams.forEach((value, key) => {
    const currentValue = query[key];
    if (currentValue === void 0) {
      query[key] = value;
      return;
    }
    if (Array.isArray(currentValue)) {
      currentValue.push(value);
      return;
    }
    query[key] = [currentValue, value];
  });
  return query;
};
const normalizeServiceBody = (body) => {
  if (body === null || body === void 0) {
    return null;
  }
  if (typeof body === "string") {
    return body;
  }
  if (body instanceof URLSearchParams) {
    return body.toString();
  }
  throw new Error("lingguang.service.fetch 目前仅支持 string / URLSearchParams body");
};
const normalizeServiceRequest = (input, init = {}) => {
  var _a, _b, _c, _d;
  if (typeof Request !== "undefined" && input instanceof Request) {
    return normalizeServiceRequest(input.url, {
      method: (_a = init.method) != null ? _a : input.method,
      headers: (_b = init.headers) != null ? _b : input.headers,
      body: init.body,
      signal: (_c = init.signal) != null ? _c : input.signal
    });
  }
  if (typeof input !== "string" && !(input instanceof URL)) {
    throw new Error("lingguang.service.fetch 仅支持 string / URL / Request 输入");
  }
  const url = input instanceof URL ? input : new URL(input);
  const method = toStringValue(init.method, "GET").toUpperCase();
  return {
    method,
    path: url.pathname || "/",
    query: normalizeQueryRecord(url),
    headers: normalizeHeadersRecord(init.headers),
    body: normalizeServiceBody(init.body),
    signal: (_d = init.signal) != null ? _d : void 0
  };
};
const buildServiceResponse = (response) => {
  var _a;
  return new Response((_a = response.body) != null ? _a : "", {
    status: response.status,
    headers: response.headers
  });
};
const requestService = async (request) => {
  if (!request.path) {
    throw new Error("path is required");
  }
  const _a = request, { signal, serviceTargetArtifactId, serviceTargetArtifactVersion } = _a, rest = __objRest(_a, ["signal", "serviceTargetArtifactId", "serviceTargetArtifactVersion"]);
  return callApi("lingguang.service.request", { request: rest, serviceTargetArtifactId, serviceTargetArtifactVersion }, { signal });
};
const serviceFetch = async (input, init) => {
  const response = await requestService(normalizeServiceRequest(input, init));
  return buildServiceResponse(response);
};
const createFlashAppFetch = () => {
  return serviceFetch;
};
const flashAppAudioRuntime = getFlashAppAudioRuntime(flashWindow);
installFlashAppAudioPlaybackTracker();
const mediaCaptureRecords = /* @__PURE__ */ new Map();
const mediaStreamCaptureIds = /* @__PURE__ */ new WeakMap();
const mediaTrackCaptureIds = /* @__PURE__ */ new WeakMap();
let mediaCaptureIdCount = 0;
const streamConstraintsMap = /* @__PURE__ */ new WeakMap();
const createFlashAppAudioMuteGuard = () => {
  let muted = flashAppAudioRuntime.getMuted();
  let mediaObserver = null;
  const mediaElements = /* @__PURE__ */ new Set();
  const mediaOriginalMuted = /* @__PURE__ */ new WeakMap();
  const audioContexts = /* @__PURE__ */ new Set();
  const applyMediaElementMute = (element) => {
    if (muted) {
      if (!mediaOriginalMuted.has(element)) {
        mediaOriginalMuted.set(element, element.muted);
      }
      if (!element.muted) {
        element.muted = true;
      }
      return;
    }
    if (!mediaOriginalMuted.has(element)) {
      return;
    }
    mediaOriginalMuted.delete(element);
    element.muted = false;
  };
  const trackMediaElement = (element) => {
    const guardedElement = element;
    if (!guardedElement.__FLASH_APP_AUDIO_MUTE_TRACKED__) {
      guardedElement.__FLASH_APP_AUDIO_MUTE_TRACKED__ = true;
      mediaElements.add(element);
    }
    applyMediaElementMute(element);
  };
  const syncMediaElements = () => {
    if (typeof document !== "undefined") {
      const found = document.querySelectorAll("audio,video");
      found.forEach(trackMediaElement);
    }
    mediaElements.forEach(applyMediaElementMute);
  };
  const trackAudioContext = (context) => {
    const guardedContext = context;
    if (guardedContext.__FLASH_APP_AUDIO_MUTE_TRACKED__) {
      return;
    }
    guardedContext.__FLASH_APP_AUDIO_MUTE_TRACKED__ = true;
    audioContexts.add(context);
    const originalClose = context.close.bind(context);
    context.close = async () => {
      audioContexts.delete(context);
      return originalClose();
    };
  };
  const installAudioContextHook = (name) => {
    const audioWindow = window;
    const NativeAudioContext = audioWindow[name];
    if (!NativeAudioContext || NativeAudioContext.__FLASH_APP_AUDIO_MUTE_WRAPPED__) {
      return;
    }
    const WrappedAudioContext = function(...args) {
      const context = new NativeAudioContext(...args);
      trackAudioContext(context);
      return context;
    };
    WrappedAudioContext.prototype = NativeAudioContext.prototype;
    WrappedAudioContext.__FLASH_APP_AUDIO_MUTE_WRAPPED__ = true;
    audioWindow[name] = WrappedAudioContext;
  };
  const installMediaPlayHook = () => {
    if (typeof HTMLMediaElement === "undefined") {
      return;
    }
    const mediaPrototype = HTMLMediaElement.prototype;
    const originalPlay = mediaPrototype.play;
    if (originalPlay.__FLASH_APP_AUDIO_MUTE_WRAPPED__) {
      return;
    }
    const patchedPlay = function() {
      trackMediaElement(this);
      return originalPlay.call(this);
    };
    patchedPlay.__FLASH_APP_AUDIO_MUTE_WRAPPED__ = true;
    mediaPrototype.play = patchedPlay;
  };
  const installMediaElementObserver = () => {
    if (typeof document === "undefined") {
      return;
    }
    document.addEventListener(
      "play",
      (event) => {
        if (typeof HTMLMediaElement !== "undefined" && event.target instanceof HTMLMediaElement) {
          trackMediaElement(event.target);
        }
      },
      true
    );
    if (typeof MutationObserver === "undefined") {
      syncMediaElements();
      return;
    }
    const startObserving = () => {
      if (mediaObserver || !document.documentElement) {
        return;
      }
      mediaObserver = new MutationObserver(syncMediaElements);
      mediaObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      syncMediaElements();
    };
    if (document.documentElement) {
      startObserving();
    } else {
      document.addEventListener("DOMContentLoaded", startObserving, { once: true });
    }
  };
  installMediaPlayHook();
  installMediaElementObserver();
  installAudioContextHook("AudioContext");
  installAudioContextHook("webkitAudioContext");
  return {
    setMuted(nextMuted) {
      muted = nextMuted;
      syncMediaElements();
    }
  };
};
const flashAppAudioMuteGuard = createFlashAppAudioMuteGuard();
const applyFlashAppAudioMute = (muted) => {
  var _a, _b;
  const galaceanAudio = (_a = flashWindow._GALACEAN_) == null ? void 0 : _a.audio;
  const galaceanMuteMethod = muted ? galaceanAudio == null ? void 0 : galaceanAudio.mute : galaceanAudio == null ? void 0 : galaceanAudio.unmute;
  if (typeof galaceanMuteMethod === "function") {
    galaceanMuteMethod.call(galaceanAudio);
  }
  const howlerMute = (_b = flashWindow.Howler) == null ? void 0 : _b.mute;
  if (typeof howlerMute === "function") {
    const howler = flashWindow.Howler;
    howlerMute.call(howler, muted);
  }
  flashAppAudioMuteGuard.setMuted(muted);
};
const stopAsr = () => {
  const asrCallbacks = flashWindow._asrCallbacks;
  if (!asrCallbacks || asrCallbacks.size === 0) {
    console.log("[FLASH APP] stopAsr: 没有活跃的识别会话");
    return;
  }
  const sessionId = asrCallbacks.keys().next().value;
  if (!sessionId) {
    console.log("[FLASH APP] stopAsr: sessionId 为空");
    return;
  }
  const callbacks = asrCallbacks.get(sessionId);
  if (callbacks == null ? void 0 : callbacks.onEnd) {
    callbacks.onEnd("stop", sessionId);
  }
  asrCallbacks.delete(sessionId);
};
window.addEventListener("message", (event) => {
  const eventData = toRecordValue(event.data);
  console.log("[FLASH APP][MSG] [audio/media] 收到 message, type=", eventData.type, "data=", event.data);
  if (eventData.type === FLASH_APP_MEDIA_CAPTURE_CONTROL) {
    stopTrackedMediaCapture(parseMediaCaptureOptions(eventData.options));
    stopAsr();
    return;
  }
  if (eventData.type !== FLASH_APP_AUDIO_CONTROL) {
    return;
  }
  const muted = Boolean(eventData.muted);
  flashAppAudioRuntime.setMuted(muted);
  applyFlashAppAudioMute(muted);
});
const installLocalStorageBridge = () => {
  const config = flashWindow.__flashAppLocalStorageBridgeConfig;
  if (!(config == null ? void 0 : config.enabled)) {
    return;
  }
  if (!window.artifactId && config.artifactId) {
    window.artifactId = config.artifactId;
  }
  if (!window.artifactVersion && config.artifactVersion) {
    window.artifactVersion = config.artifactVersion;
  }
  const cache = new Map(Object.entries(toStringSnapshotRecord(config.snapshot)));
  let persistSeq = 0;
  const buildSnapshot = () => {
    return Object.fromEntries(cache.entries());
  };
  const persistSnapshot = (reason) => {
    const requestId = `flash-app-localstorage-${Date.now()}-${++persistSeq}`;
    window.parent.postMessage(
      {
        type: "FLASH_APP_LOCALSTORAGE_SYNC",
        requestId,
        reason,
        storageKey: config.storageKey,
        storageNamespace: config.storageNamespace,
        artifactId: config.artifactId,
        artifactVersion: config.artifactVersion,
        traceId: window.trace_id || "",
        snapshot: buildSnapshot()
      },
      "*"
    );
  };
  const bridgeStorage = {
    get length() {
      return cache.size;
    },
    clear() {
      cache.clear();
      persistSnapshot("clear");
    },
    getItem(key) {
      var _a;
      const normalizedKey = String(key);
      return cache.has(normalizedKey) ? (_a = cache.get(normalizedKey)) != null ? _a : null : null;
    },
    key(index) {
      var _a;
      if (!Number.isInteger(index) || index < 0 || index >= cache.size) {
        return null;
      }
      return (_a = Array.from(cache.keys())[index]) != null ? _a : null;
    },
    removeItem(key) {
      const normalizedKey = String(key);
      if (!cache.has(normalizedKey)) {
        return;
      }
      cache.delete(normalizedKey);
      persistSnapshot("removeItem");
    },
    setItem(key, value) {
      const normalizedKey = String(key);
      cache.set(normalizedKey, String(value));
      persistSnapshot("setItem");
    }
  };
  flashWindow.__bridgeLocalStorage = bridgeStorage;
  try {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      enumerable: true,
      get() {
        return bridgeStorage;
      }
    });
    console.log("[FLASH APP] localStorage bridge 已安装到 window.localStorage", {
      mode: config.mode,
      storageNamespace: config.storageNamespace
    });
  } catch (error) {
    console.log("[FLASH APP] 安装 window.localStorage bridge 失败，使用 __bridgeLocalStorage 兜底", error);
  }
  try {
    if (typeof Storage !== "undefined" && Storage.prototype) {
      Storage.prototype.getItem = function(key) {
        return bridgeStorage.getItem(String(key));
      };
      Storage.prototype.setItem = function(key, value) {
        bridgeStorage.setItem(String(key), String(value));
      };
      Storage.prototype.removeItem = function(key) {
        bridgeStorage.removeItem(String(key));
      };
      Storage.prototype.clear = function() {
        bridgeStorage.clear();
      };
      Storage.prototype.key = function(index) {
        return bridgeStorage.key(index);
      };
    }
  } catch (error) {
    console.log("[FLASH APP] patch Storage.prototype 失败，忽略兜底逻辑", error);
  }
};
installLocalStorageBridge();
globalThis.__FLASH_APP_FETCH_API__ = createFlashAppFetch();
const pendingApiCalls = /* @__PURE__ */ new Map();
const pendingStreamCallbacks = /* @__PURE__ */ new Map();
window.addEventListener("message", (event) => {
  var _a;
  const eventData = toRecordValue(event.data);
  console.log("[FLASH APP][MSG] [localStorage/API] 收到 message, type=", eventData.type, "data=", event.data);
  if (eventData.type === "FLASH_APP_LOCALSTORAGE_ACK") {
    const requestId = toStringValue(eventData.requestId);
    if (eventData.success === true) {
      console.log("[FLASH APP] localStorage bridge 持久化成功", requestId);
    } else {
      console.log("[FLASH APP] localStorage bridge 持久化失败", {
        requestId,
        message: toStringValue(eventData.message, "persist failed")
      });
    }
    return;
  }
  if (eventData.type === "API_STREAM") {
    const id = toStringValue(eventData.id);
    const payload = eventData.payload;
    const callbackInfo = pendingStreamCallbacks.get(id);
    if (!callbackInfo) {
      console.log("[FLASH APP] API_STREAM 未找到对应的回调", id);
      return;
    }
    try {
      const payloadRecord = toRecordValue(payload);
      callbackInfo.onText(payloadRecord);
    } catch (e) {
      console.log("[FLASH APP] API_STREAM 回调执行失败", e);
    }
    return;
  }
  if (eventData.type === "API_STREAM_ERROR") {
    const id = toStringValue(eventData.id);
    const error = toStringValue(eventData.error, "流式响应失败");
    const code = toStringValue(eventData.code) || void 0;
    const callbackInfo = pendingStreamCallbacks.get(id);
    if (!callbackInfo) {
      console.log("[FLASH APP] API_STREAM_ERROR 未找到对应的回调", id);
      return;
    }
    try {
      (_a = callbackInfo.onError) == null ? void 0 : _a.call(callbackInfo, { message: error, code });
    } catch (e) {
      console.log("[FLASH APP] API_STREAM_ERROR 回调执行失败", e);
    }
    return;
  }
  if (eventData.type === "API_CALLBACK") {
    const id = toStringValue(eventData.id);
    const success = eventData.success === true;
    const message = toStringValue(eventData.message, "API 调用失败");
    const errorCode = toStringValue(eventData.errorCode) || void 0;
    const payload = eventData.payload;
    const pendingCall = pendingApiCalls.get(id);
    if (!pendingCall) {
      console.log("[FLASH APP] API_CALLBACK 未找到对应的回调", id);
      return;
    }
    pendingApiCalls.delete(id);
    pendingStreamCallbacks.delete(id);
    if (success) {
      pendingCall.resolve(payload);
    } else {
      const error = new Error(message);
      error.code = errorCode;
      pendingCall.reject(error);
    }
  }
});
function getScrollPercent() {
  const scrollElement = document.scrollingElement || document.documentElement;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const scrollHeight = scrollElement.scrollHeight;
  const scrollTop = scrollElement.scrollTop;
  const maxScrollable = scrollHeight - viewportHeight;
  if (maxScrollable <= 0) return 0;
  return Math.max(0, Math.min(100, scrollTop / maxScrollable * 100));
}
let scrollReportRafId = null;
let scrollReportStarted = false;
function reportScrollPercent() {
  if (window.parent === window) return;
  const percent = getScrollPercent();
  try {
    window.parent.postMessage(
      {
        type: "REPORT_SCROLL_PERCENT",
        scrollPercent: percent
      },
      "*"
    );
  } catch (e) {
  }
}
function startScrollReport() {
  if (scrollReportStarted) return;
  scrollReportStarted = true;
  const onScroll = () => {
    if (scrollReportRafId !== null) return;
    scrollReportRafId = requestAnimationFrame(() => {
      scrollReportRafId = null;
      reportScrollPercent();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true });
}
(function initScrollReport() {
  if (typeof window === "undefined" || window.parent === window) return;
  const start = () => startScrollReport();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
if (!window.artifactId) {
  window.artifactId = `flashapp-${Date.now()}`;
  window.artifactVersion = "1";
  window.trace_id = "";
}
const createAbortError = () => {
  try {
    return new DOMException("Aborted", "AbortError");
  } catch (e) {
    const error = new Error("Aborted");
    Object.defineProperty(error, "name", {
      value: "AbortError",
      configurable: true
    });
    return error;
  }
};
const setDevStorageItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized === void 0 ? "null" : serialized);
    return true;
  } catch (e) {
    console.log("[FLASH APP][DEV MOCK] lingguang.storage.setItem 失败", e);
    return false;
  }
};
const getDevStorageItem = (key) => {
  try {
    const serialized = window.localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (e) {
    console.log("[FLASH APP][DEV MOCK] lingguang.storage.getItem 失败", e);
    return null;
  }
};
const removeDevStorageItem = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log("[FLASH APP][DEV MOCK] lingguang.storage.removeItem 失败", e);
    return false;
  }
};
const clearDevStorage = () => {
  try {
    window.localStorage.clear();
    return true;
  } catch (e) {
    console.log("[FLASH APP][DEV MOCK] lingguang.storage.clear 失败", e);
    return false;
  }
};
const toLegacyMockKey = (value) => {
  var _a;
  if (!value) {
    return "";
  }
  return (_a = toPrimitiveString(value)) != null ? _a : "";
};
const toDevMockOptions = (payload) => {
  const options = toRecordValue(payload.options);
  return Object.keys(options).length > 0 ? options : toRecordValue(payload.params);
};
let lastMockAssetKind = "character";
const resolveDevMockAssetResponse = (action, payload) => {
  const params = toRecordValue(payload.params);
  const assetId = toStringValue(params.assetId, "mock-asset-id");
  const generationId = toStringValue(params.generationId, "mock-generation-id");
  const rawKind = toStringValue(params.kind, lastMockAssetKind);
  const kind = rawKind === "outfit" ? "outfit" : rawKind === "image" ? "image" : "character";
  if (action === "lingguang.asset.generate") {
    lastMockAssetKind = kind;
  }
  const storedKind = kind === "outfit" ? "outfit" : "character";
  const mockAsset = {
    assetId,
    kind: storedKind,
    coverUrl: "https://example.com/mock-cover.png",
    zipUrl: "https://example.com/mock-character.zip",
    familyId: "mock-family-id",
    baseAssetId: storedKind === "outfit" ? toStringValue(params.baseAssetId, "mock-base-asset-id") : null,
    gmtCreate: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    bindingVariant: "general"
  };
  const mockAssetDetail = __spreadProps(__spreadValues({}, mockAsset), {
    profile: toStringValue(params.profile, "ref_chibi_h25"),
    qualityMode: "basic",
    bindingMode: storedKind === "outfit" ? "both" : "general",
    generateExpressions: false,
    prompt: null,
    fileName: null,
    contentType: "application/zip",
    fileSize: null,
    origin: null,
    sourcePresetAssetId: null
  });
  const mockImageAsset = {
    assetId,
    kind: "image",
    coverUrl: "https://example.com/mock-image.png",
    zipUrl: "",
    familyId: assetId,
    baseAssetId: toStringValue(params.baseAssetId, "") || null,
    gmtCreate: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    bindingVariant: "candidate_1"
  };
  const mockGeneration = kind === "image" ? {
    generationId,
    kind: "image",
    status: "pending",
    profile: null,
    qualityMode: "advanced",
    bindingMode: void 0,
    generateExpressions: null,
    baseAssetId: mockImageAsset.baseAssetId,
    assets: null
  } : {
    generationId,
    kind: storedKind,
    status: "pending",
    profile: mockAssetDetail.profile,
    qualityMode: "basic",
    bindingMode: storedKind === "outfit" ? "both" : "general",
    generateExpressions: false,
    baseAssetId: mockAsset.baseAssetId,
    assets: null
  };
  switch (action) {
    case "lingguang.asset.generationOptions":
      return {
        success: true,
        data: {
          profiles: ["ref_chibi_h25"],
          qualityModes: ["basic", "advanced"],
          bindingModes: ["general", "fast", "both"],
          generateExpressions: true,
          trashRetentionDays: 7,
          kinds: [
            { kind: "character", action: "lingguang.asset.generate", fields: [] },
            { kind: "outfit", action: "lingguang.asset.generate", fields: [] },
            { kind: "image", action: "lingguang.asset.generate", fields: [] }
          ]
        }
      };
    case "lingguang.asset.generate":
      return { success: true, data: mockGeneration };
    case "lingguang.asset.getGeneration":
      if (lastMockAssetKind === "image") {
        return {
          success: true,
          data: __spreadProps(__spreadValues({}, mockGeneration), {
            kind: "image",
            status: "succeeded",
            qualityMode: "advanced",
            assets: [mockImageAsset]
          })
        };
      }
      return { success: true, data: mockGeneration };
    case "lingguang.asset.upload":
    case "lingguang.asset.get":
    case "lingguang.asset.getTrash":
      return { success: true, data: mockAssetDetail };
    case "lingguang.asset.restore":
      return { success: true, data: { assetId, familyId: mockAsset.familyId, assets: [mockAssetDetail] } };
    case "lingguang.asset.list":
    case "lingguang.asset.listTrash":
      return { success: true, data: { items: [mockAsset], page: 1, pageSize: 50, total: 1 } };
    case "lingguang.asset.listPresets":
      return {
        success: true,
        data: { items: [mockAsset], page: 1, pageSize: 50, total: 1, kind: "character" }
      };
    case "lingguang.asset.claimPreset":
      return {
        success: true,
        data: __spreadProps(__spreadValues({}, mockAssetDetail), { origin: "preset_claim", sourcePresetAssetId: assetId })
      };
    case "lingguang.asset.delete":
      return {
        success: true,
        data: {
          assetId,
          deleted: true,
          deletedAt: "2026-01-01T00:00:00.000Z",
          retainUntil: "2026-01-08T00:00:00.000Z",
          trashRetentionDays: 7
        }
      };
    default:
      return { success: false, code: "BAD_REQUEST", message: `unsupported asset action: ${action}`, data: null };
  }
};
const resolveDevMockResponse = (action, payload, isStream) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (action.startsWith("lingguang.asset.")) {
    return resolveDevMockAssetResponse(action, payload);
  }
  switch (action) {
    case "lingguang.storage.setItem":
      return setDevStorageItem(toLegacyMockKey(payload.key), payload.value);
    case "lingguang.storage.getItem":
      return getDevStorageItem(toLegacyMockKey(payload.key));
    case "lingguang.storage.removeItem":
      return removeDevStorageItem(toLegacyMockKey(payload.key));
    case "lingguang.storage.clear":
      return clearDevStorage();
    case "lingguang.db.query":
      return { success: false, data: [], message: "db.query not available in dev mode" };
    case "lingguang.db.execute":
      return { success: false, data: { rowsAffected: 0 }, message: "db.execute not available in dev mode" };
    case "lingguang.db.listTables":
      return { success: false, data: [], message: "db.listTables not available in dev mode" };
    case "lingguang.db.getTableSchema":
      return { success: false, data: null, message: "db.getTableSchema not available in dev mode" };
    case "lingguang.db.role":
      return { role: "USER" };
    case "lingguang.data.fetch":
      return null;
    case "lingguang.data.getWeather":
    case "lingguang.data.getExchangeRate":
    case "lingguang.data.getStockPrice":
    case "lingguang.data.getStockCandlestickData":
    case "lingguang.data.getPreciousMetalPrice":
      return null;
    case "lingguang.data.explore":
      if (isStream) {
        return void 0;
      }
      return '<div style="padding:16px;color:#666;">开发环境 mock：explore 暂不可用</div>';
    case "lingguang.service.request":
      return {
        status: 503,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          code: "FLASH_APP_SERVICE_UNAVAILABLE_IN_DEV",
          message: "当前预览环境不提供应用私有服务能力，请在真实运行环境联调"
        })
      };
    case "lingguang.storybook":
    case "lingguang.ai.llmStream":
    case "lingguang.ai.streamChat":
    case "lingguang.ai.agentRunStream":
      return void 0;
    case "lingguang.backendAgent.project": {
      const params = toRecordValue(payload.params);
      if (params.method === "project_delete") {
        const projectId = toPrimitiveString(params.projectId);
        if (!projectId) {
          throw new Error("projectId is required");
        }
        return { success: true, projectId };
      }
      return { success: true, projects: [] };
    }
    case "lingguang.backendAgent.projectFile": {
      const params = toRecordValue(payload.params);
      if (params.method === "upload") {
        return {
          success: true,
          projectId: toPrimitiveString(params.projectId),
          file: {
            name: toPrimitiveString(params.fileName),
            path: toPrimitiveString(params.fileName),
            size: 0
          }
        };
      }
      if (params.method === "mkdir") {
        return {
          success: true,
          projectId: toPrimitiveString(params.projectId),
          directory: {
            name: toPrimitiveString(params.name),
            path: toPrimitiveString(params.name),
            type: "directory"
          }
        };
      }
      if (params.method === "move") {
        return {
          success: true,
          projectId: toPrimitiveString(params.projectId),
          sourcePath: toPrimitiveString(params.sourcePath),
          targetPath: toPrimitiveString(params.targetPath)
        };
      }
      if (params.method === "delete") {
        return {
          success: true,
          projectId: toPrimitiveString(params.projectId),
          path: toPrimitiveString(params.path),
          existed: true
        };
      }
      if (params.method === "stat") {
        const path = toPrimitiveString(params.path);
        if (path === void 0) {
          throw new Error("path is required");
        }
        const pathSegments = path.split("/").filter(Boolean);
        const name = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : path;
        return {
          success: true,
          projectId: toPrimitiveString(params.projectId),
          exists: true,
          file: {
            name,
            path,
            type: "file",
            size: 0
          }
        };
      }
      if (params.method === "read") {
        return {
          success: true,
          projectId: toPrimitiveString(params.projectId),
          filePath: toPrimitiveString(params.filePath),
          exists: true,
          content: ""
        };
      }
      if (params.method === "write") {
        return {
          success: true,
          projectId: toPrimitiveString(params.projectId),
          filePath: toPrimitiveString(params.filePath)
        };
      }
      return {
        success: true,
        projectId: toPrimitiveString(params.projectId),
        relativePath: toPrimitiveString(params.relativePath),
        files: []
      };
    }
    case "lingguang.stream.pull":
      return {
        events: [],
        cursor: (_a = toNumberValue(toRecordValue(payload.params).cursor)) != null ? _a : 0,
        status: "done",
        error_msg: ""
      };
    case "lingguang.canIUse":
      return true;
    case "lingguang.notification.requestAuthorization":
      return { authorizationStatus: "authorized", presented: false };
    case "lingguang.notification.openSettings":
      return void 0;
    case "lingguang.navigate.to":
      return { success: true };
    case "lingguang.app.checkForUpdate":
      return { hasNewVersion: false, showAlert: false };
    case "lingguang.app.share":
      return { success: true, message: "mock share success" };
    case "lingguang.ai.imageGeneration":
      return { url: DEV_MOCK_IMAGE_URL };
    case "lingguang.ai.vllm":
      return { content: "这是一张图片的描述内容（开发环境模拟数据）" };
    case "lingguang.ai.chat": {
      const params = toRecordValue(payload.params);
      const messages = Array.isArray(params.messages) ? params.messages : [];
      const lastMessage = toRecordValue(messages[messages.length - 1]);
      const responseFormat = params.responseFormat;
      const mockContent = `这是开发环境的 mock AI chat 响应。

用户消息：${toStringValue(lastMessage.content)}`;
      const content = buildDevAiChatContent(mockContent, responseFormat);
      return buildLingguangAiChatResultFromContent(content, responseFormat);
    }
    case "lingguang.ai.musicGeneration":
      return { url: DEV_MOCK_MUSIC_URL, duration: 227 };
    case "lingguang.chooseImage":
    case "lingguang.takePhoto":
      return { tempFiles: [] };
    case "lingguang.chooseVideo":
      return {
        filePath: "dev-mock://video.mp4",
        duration: 5,
        size: 1024,
        width: 640,
        height: 360,
        thumbnailPath: null
      };
    case "lingguang.scanCode":
      return {
        result: "https://render.lingguangcontent.com/p/lingguang/mock-scan/index.html",
        scanType: "QR_CODE"
      };
    case "lingguang.saveImageToPhotosAlbum":
      return void 0;
    case "lingguang.uploadImage":
      return { url: DEV_MOCK_IMAGE_URL };
    case "lingguang.getLocation": {
      const options = toDevMockOptions(payload);
      const location2 = {
        longitude: 121.4737,
        latitude: 31.2304,
        country: "China",
        countryCode: "CN",
        province: "Shanghai",
        provinceCode: "310000",
        city: "Shanghai",
        cityCode: "310100"
      };
      if (options.poi === true) {
        return __spreadProps(__spreadValues({}, location2), {
          pois: [{ name: "People Square", address: "People's Avenue, Huangpu District" }]
        });
      }
      return location2;
    }
    case "lingguang.chooseFile":
      return {
        filePath: "/tmp/mock-file.txt",
        fileName: "mock-file.txt"
      };
    case "lingguang.uploadFile":
      return { fileId: "mock-file-id" };
    case "lingguang.fs.parseFileText": {
      const options = toDevMockOptions(payload);
      const fileId = (_b = toPrimitiveString(options.fileId)) != null ? _b : "mock-file-id";
      return { success: true, fileId, runId: fileId };
    }
    case "lingguang.fs.getFileText": {
      const options = toDevMockOptions(payload);
      const runId = (_c = toPrimitiveString(options.runId)) != null ? _c : "mock-file-id";
      return { success: true, fileId: runId, status: "uploaded", parseStatus: "mock_pending", runId };
    }
    case "lingguang.file.proxy": {
      const options = toDevMockOptions(payload);
      if (options.return_type === "url") {
        return {
          success: true,
          data: {
            url: (_d = toPrimitiveString(options.file_url)) != null ? _d : "",
            file_name: (_e = toPrimitiveString(options.file_name)) != null ? _e : "mock-file"
          }
        };
      }
      return {
        success: true,
        data: {
          file_name: (_f = toPrimitiveString(options.file_name)) != null ? _f : "mock-file",
          content: "mock file content",
          encoding: "utf8"
        }
      };
    }
    case "lingguang.previewFile":
      return { success: true };
    case "lingguang.saveFile":
      return { success: true };
    case "lingguang.readFile": {
      const options = toDevMockOptions(payload);
      if (options.encoding === "base64") {
        return { data: "bW9jayBmaWxlIGNvbnRlbnQ=" };
      }
      return { data: "mock file content" };
    }
    case "lingguang.vibrate":
    case "lingguang.gyroscope.start":
    case "lingguang.gyroscope.stop":
    case "lingguang.asr.start":
    case "lingguang.asr.stop":
    case "lingguang.asr.abort":
    case "lingguang.monitor.event":
      return void 0;
    case "lingguang.alert": {
      const options = toDevMockOptions(payload);
      const message = (_g = toPrimitiveString(options.message)) != null ? _g : "";
      console.log("[FLASH APP][DEV MOCK] alert", message);
      return void 0;
    }
    case "lingguang.deprecated.callLLM": {
      const prompt = (_h = toPrimitiveString(payload.prompt)) != null ? _h : "";
      const systemPrompt = payload.systemPrompt;
      if (systemPrompt === "DATA_API_REQUEST") {
        return {
          success: true,
          data: JSON.stringify(null)
        };
      }
      const formattedSystemPrompt = toPrimitiveString(systemPrompt);
      return {
        content: `这是开发环境的 mock LLM 响应。

用户消息：${prompt}${formattedSystemPrompt ? `

系统提示：${formattedSystemPrompt}` : ""}`
      };
    }
    default:
      if (isStream) {
        return void 0;
      }
      return { success: true, message: `mocked in dev mode: ${action}` };
  }
};
const callApi = async (action, payload, options = {}) => {
  const { signal } = options;
  if (signal == null ? void 0 : signal.aborted) {
    return Promise.reject(createAbortError());
  }
  if (isDev) {
    console.log("[FLASH APP][DEV MOCK] API:", action, payload);
    return resolveDevMockResponse(action, payload, false);
  }
  const id = `api-call-${Date.now()}-${++apiCallCount}`;
  payload.artifactId = window.artifactId;
  payload.artifactVersion = window.artifactVersion;
  payload.traceId = window.trace_id;
  const message = {
    type: "API",
    id,
    action,
    payload
  };
  console.log("[FLASH APP] 发起 API 调用:", JSON.stringify(message, null, 2));
  window.parent.postMessage(message, "*");
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
    };
    const onAbort = () => {
      if (settled) {
        return;
      }
      settled = true;
      pendingApiCalls.delete(id);
      cleanup();
      reject(createAbortError());
    };
    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }
    pendingApiCalls.set(id, {
      resolve: (value) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        resolve(value);
      },
      reject: (error) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        reject(error);
      }
    });
  });
};
const GET_USER_MEDIA_AUTHORIZE_ACTION = "lingguang.mediaDevices.getUserMedia";
const createGetUserMediaAuthorizeError = (error) => {
  const message = error instanceof Error && error.message ? error.message : "Permission denied";
  try {
    return new DOMException(message, "NotAllowedError");
  } catch (e) {
    const fallbackError = new Error(message);
    Object.defineProperty(fallbackError, "name", {
      value: "NotAllowedError",
      configurable: true
    });
    return fallbackError;
  }
};
const summarizeMediaConstraints = (constraints) => {
  return {
    audio: !!(constraints == null ? void 0 : constraints.audio),
    video: !!(constraints == null ? void 0 : constraints.video)
  };
};
const createMediaCaptureId = () => {
  mediaCaptureIdCount += 1;
  return `flash-app-media-capture-${Date.now()}-${mediaCaptureIdCount}`;
};
const getOrCreateMediaCaptureRecord = (captureId) => {
  let record = mediaCaptureRecords.get(captureId);
  if (!record) {
    record = {
      tracks: /* @__PURE__ */ new Set()
    };
    mediaCaptureRecords.set(captureId, record);
  }
  return record;
};
const cleanupMediaCaptureRecord = (captureId) => {
  const record = mediaCaptureRecords.get(captureId);
  if (!record || record.tracks.size > 0) {
    return;
  }
  mediaCaptureRecords.delete(captureId);
};
const unregisterTrackedMediaStreamTrack = (track) => {
  const captureId = mediaTrackCaptureIds.get(track);
  if (!captureId) {
    return;
  }
  mediaTrackCaptureIds.delete(track);
  const trackedTrack = track;
  if (trackedTrack.__flashAppMediaCaptureEndedListener__) {
    track.removeEventListener("ended", trackedTrack.__flashAppMediaCaptureEndedListener__);
    delete trackedTrack.__flashAppMediaCaptureEndedListener__;
  }
  const record = mediaCaptureRecords.get(captureId);
  record == null ? void 0 : record.tracks.delete(track);
  cleanupMediaCaptureRecord(captureId);
};
const registerTrackedMediaStreamTrack = (track, captureId) => {
  const existingCaptureId = mediaTrackCaptureIds.get(track);
  if (existingCaptureId && existingCaptureId !== captureId) {
    const previousRecord = mediaCaptureRecords.get(existingCaptureId);
    previousRecord == null ? void 0 : previousRecord.tracks.delete(track);
    cleanupMediaCaptureRecord(existingCaptureId);
  }
  mediaTrackCaptureIds.set(track, captureId);
  getOrCreateMediaCaptureRecord(captureId).tracks.add(track);
  const trackedTrack = track;
  if (!trackedTrack.__flashAppMediaCaptureEndedListener__) {
    trackedTrack.__flashAppMediaCaptureEndedListener__ = () => {
      unregisterTrackedMediaStreamTrack(track);
    };
    track.addEventListener("ended", trackedTrack.__flashAppMediaCaptureEndedListener__, { once: true });
  }
  if (track.readyState === "ended") {
    unregisterTrackedMediaStreamTrack(track);
  }
};
const resolveMediaCaptureIdFromStream = (stream) => {
  const captureId = mediaStreamCaptureIds.get(stream);
  if (captureId) {
    return captureId;
  }
  for (const track of stream.getTracks()) {
    const trackCaptureId = mediaTrackCaptureIds.get(track);
    if (trackCaptureId) {
      return trackCaptureId;
    }
  }
  return void 0;
};
const registerTrackedMediaStream = (stream, captureId = ((_a) => (_a = resolveMediaCaptureIdFromStream(stream)) != null ? _a : createMediaCaptureId())()) => {
  mediaStreamCaptureIds.set(stream, captureId);
  stream.getTracks().forEach((track) => {
    registerTrackedMediaStreamTrack(track, captureId);
  });
  return stream;
};
const installMediaCaptureLifecycleHooks = () => {
  try {
    if (typeof MediaStream !== "undefined") {
      const mediaStreamPrototype = MediaStream.prototype;
      if (!mediaStreamPrototype.__flashAppMediaCaptureClonePatched__ && typeof mediaStreamPrototype.clone === "function") {
        const nativeStreamClone = mediaStreamPrototype.clone;
        Object.defineProperty(mediaStreamPrototype, "clone", {
          configurable: true,
          writable: true,
          value: function() {
            const clonedStream = nativeStreamClone.call(this);
            const captureId = resolveMediaCaptureIdFromStream(this);
            if (captureId) {
              registerTrackedMediaStream(clonedStream, captureId);
            }
            return clonedStream;
          }
        });
        mediaStreamPrototype.__flashAppMediaCaptureClonePatched__ = true;
      }
    }
    if (typeof MediaStreamTrack !== "undefined") {
      const mediaStreamTrackPrototype = MediaStreamTrack.prototype;
      if (!mediaStreamTrackPrototype.__flashAppMediaCaptureClonePatched__ && typeof mediaStreamTrackPrototype.clone === "function") {
        const nativeTrackClone = mediaStreamTrackPrototype.clone;
        Object.defineProperty(mediaStreamTrackPrototype, "clone", {
          configurable: true,
          writable: true,
          value: function() {
            const clonedTrack = nativeTrackClone.call(this);
            const captureId = mediaTrackCaptureIds.get(this);
            if (captureId) {
              registerTrackedMediaStreamTrack(clonedTrack, captureId);
            }
            return clonedTrack;
          }
        });
        mediaStreamTrackPrototype.__flashAppMediaCaptureClonePatched__ = true;
      }
      if (!mediaStreamTrackPrototype.__flashAppMediaCaptureStopPatched__ && typeof mediaStreamTrackPrototype.stop === "function") {
        const nativeTrackStop = mediaStreamTrackPrototype.stop;
        Object.defineProperty(mediaStreamTrackPrototype, "stop", {
          configurable: true,
          writable: true,
          value: function() {
            try {
              nativeTrackStop.call(this);
            } finally {
              unregisterTrackedMediaStreamTrack(this);
            }
          }
        });
        mediaStreamTrackPrototype.__flashAppMediaCaptureStopPatched__ = true;
      }
    }
  } catch (error) {
    console.log("[FLASH APP] 安装 MediaStream 生命周期托管失败", error);
  }
};
const parseMediaCaptureOptions = (value) => {
  const options = toRecordValue(value);
  const hasAudioOption = Object.prototype.hasOwnProperty.call(options, "audio");
  const hasVideoOption = Object.prototype.hasOwnProperty.call(options, "video");
  if (!hasAudioOption && !hasVideoOption) {
    return void 0;
  }
  return {
    audio: options.audio === true,
    video: options.video === true
  };
};
const shouldStopTrackedMediaStreamTrack = (track, options) => {
  if (!options) {
    return true;
  }
  const stopAudio = options.audio === true;
  const stopVideo = options.video === true;
  if (!stopAudio && !stopVideo) {
    return false;
  }
  return stopAudio && track.kind === "audio" || stopVideo && track.kind === "video";
};
const stopTrackedMediaCapture = (options) => {
  const tracksToStop = /* @__PURE__ */ new Set();
  mediaCaptureRecords.forEach((record) => {
    record.tracks.forEach((track) => {
      if (shouldStopTrackedMediaStreamTrack(track, options)) {
        tracksToStop.add(track);
      }
    });
  });
  if (tracksToStop.size === 0) {
    return;
  }
  tracksToStop.forEach((track) => {
    track.stop();
  });
};
const installGetUserMediaAuthorizeHook = () => {
  var _a;
  try {
    installMediaCaptureLifecycleHooks();
    const mediaDevices = (_a = window.navigator) == null ? void 0 : _a.mediaDevices;
    if (!mediaDevices || typeof mediaDevices.getUserMedia !== "function") {
      return;
    }
    if (mediaDevices.__flashAppGetUserMediaPatched) {
      return;
    }
    flashWindow.__flashAppInstalledMediaDevices = mediaDevices;
    const nativeGetUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    const authorizedGetUserMedia = async (constraints) => {
      const requestedMedia = summarizeMediaConstraints(constraints);
      if (!requestedMedia.audio && !requestedMedia.video) {
        return nativeGetUserMedia(constraints);
      }
      try {
        await callApi(GET_USER_MEDIA_AUTHORIZE_ACTION, {
          options: requestedMedia
        });
      } catch (error) {
        throw createGetUserMediaAuthorizeError(error);
      }
      const stream = await nativeGetUserMedia(constraints);
      if (constraints) {
        streamConstraintsMap.set(stream, constraints);
      }
      return registerTrackedMediaStream(stream);
    };
    Object.defineProperty(mediaDevices, "getUserMedia", {
      configurable: true,
      writable: true,
      value: authorizedGetUserMedia
    });
    mediaDevices.__flashAppGetUserMediaPatched = true;
    console.log("[FLASH APP] navigator.mediaDevices.getUserMedia 已接入 API 授权");
  } catch (error) {
    console.log("[FLASH APP] navigator.mediaDevices.getUserMedia 授权接入失败", error);
  }
};
installGetUserMediaAuthorizeHook();
const callApiStream = async (action, payload, options) => {
  const { signal, onText, onError } = options;
  if (signal == null ? void 0 : signal.aborted) {
    return Promise.reject(createAbortError());
  }
  if (!onText) {
    throw new Error("onText callback is required");
  }
  if (isDev) {
    console.log("[FLASH APP][DEV MOCK] API_STREAM:", action, payload);
    return resolveDevMockResponse(action, payload, true);
  }
  const id = `api-call-${Date.now()}-${++apiCallCount}`;
  payload.artifactId = window.artifactId;
  payload.artifactVersion = window.artifactVersion;
  payload.traceId = window.trace_id;
  const message = {
    type: "API",
    id,
    action,
    payload
  };
  console.log("[FLASH APP] 发起 API 调用(流式):", JSON.stringify(message, null, 2));
  window.parent.postMessage(message, "*");
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
      pendingStreamCallbacks.delete(id);
    };
    const onAbort = () => {
      if (settled) {
        return;
      }
      settled = true;
      pendingApiCalls.delete(id);
      cleanup();
      reject(createAbortError());
    };
    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }
    pendingStreamCallbacks.set(id, { onText, onError });
    pendingApiCalls.set(id, {
      resolve: (value) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        resolve(value);
      },
      reject: (error) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        reject(error);
      }
    });
  });
};
const createAssetError = (result) => {
  const error = new Error(toStringValue(result.message, "asset call failed"));
  const code = toStringValue(result.code);
  if (code) {
    error.code = code;
  }
  return error;
};
const callAssetApi = async (action, params = {}) => {
  const result = toRecordValue(await callApi(action, { params }));
  if (result.success !== true) {
    throw createAssetError(result);
  }
  return result.data;
};
window.lingguang = {
  _getArtifactId: () => window.artifactId || "",
  _getArtifactVersion: () => window.artifactVersion || "1",
  _getArtifactDeployTime: () => window.artifactDeployTime || "",
  db: {
    query: async (req) => {
      if (!req || !req.sql) {
        throw new Error("sql is required");
      }
      const _a = req, { signal } = _a, rest = __objRest(_a, ["signal"]);
      return callApi("lingguang.db.query", { req: rest }, { signal });
    },
    execute: async (req) => {
      if (!req || !req.sql) {
        throw new Error("sql is required");
      }
      const _a = req, { signal } = _a, rest = __objRest(_a, ["signal"]);
      return callApi("lingguang.db.execute", { req: rest }, { signal });
    },
    listTables: async () => {
      return callApi("lingguang.db.listTables", {});
    },
    getTableSchema: async (tableName) => {
      if (!tableName.trim()) {
        throw new Error("tableName is required");
      }
      return callApi("lingguang.db.getTableSchema", { tableName });
    },
    role: async () => {
      const result = await callApi("lingguang.db.role", {});
      syncCurrentRole(result.role);
      return result;
    }
  },
  storage: {
    setItem: async (key, value) => {
      return callApi("lingguang.storage.setItem", { key, value });
    },
    getItem: async (key) => {
      return callApi("lingguang.storage.getItem", { key });
    },
    removeItem: async (key) => {
      return callApi("lingguang.storage.removeItem", { key });
    },
    clear: async () => {
      return callApi("lingguang.storage.clear", {});
    }
  },
  asset: {
    generationOptions: async () => {
      return callAssetApi("lingguang.asset.generationOptions");
    },
    generate: async (params) => {
      const kind = params == null ? void 0 : params.kind;
      if (kind !== "character" && kind !== "outfit" && kind !== "image") {
        throw new Error("kind must be character, outfit or image");
      }
      return callAssetApi("lingguang.asset.generate", toAssetApiParams(params));
    },
    getGeneration: async (params) => {
      var _a;
      const generationId = (_a = params == null ? void 0 : params.generationId) == null ? void 0 : _a.trim();
      if (!generationId) {
        throw new Error("generationId is required");
      }
      return callAssetApi("lingguang.asset.getGeneration", { generationId });
    },
    upload: async (params) => {
      if (!(params == null ? void 0 : params.kind) || !params.coverUrl || !params.zipUrl || !params.profile || !params.fileName || !params.contentType) {
        throw new Error("kind, coverUrl, zipUrl, profile, fileName and contentType are required");
      }
      const _a = params, { kind } = _a, nested = __objRest(_a, ["kind"]);
      return callAssetApi("lingguang.asset.upload", { kind, params: nested });
    },
    list: async (params) => {
      return callAssetApi("lingguang.asset.list", toAssetApiParams(params));
    },
    get: async (params) => {
      var _a;
      const assetId = (_a = params == null ? void 0 : params.assetId) == null ? void 0 : _a.trim();
      if (!assetId) {
        throw new Error("assetId is required");
      }
      return callAssetApi("lingguang.asset.get", { assetId });
    },
    delete: async (params) => {
      var _a;
      const assetId = (_a = params == null ? void 0 : params.assetId) == null ? void 0 : _a.trim();
      if (!assetId) {
        throw new Error("assetId is required");
      }
      return callAssetApi("lingguang.asset.delete", { assetId });
    },
    restore: async (params) => {
      var _a;
      const assetId = (_a = params == null ? void 0 : params.assetId) == null ? void 0 : _a.trim();
      if (!assetId) {
        throw new Error("assetId is required");
      }
      return callAssetApi("lingguang.asset.restore", { assetId });
    },
    listTrash: async (params = {}) => {
      return callAssetApi("lingguang.asset.listTrash", toAssetApiParams(params));
    },
    getTrash: async (params) => {
      var _a;
      const assetId = (_a = params == null ? void 0 : params.assetId) == null ? void 0 : _a.trim();
      if (!assetId) {
        throw new Error("assetId is required");
      }
      return callAssetApi("lingguang.asset.getTrash", { assetId });
    },
    listPresets: async (params = {}) => {
      var _a;
      const kind = (_a = params.kind) != null ? _a : "character";
      if (kind !== "character" && kind !== "outfit") {
        throw new Error("kind must be character or outfit");
      }
      return callAssetApi("lingguang.asset.listPresets", toAssetApiParams(__spreadProps(__spreadValues({}, params), { kind })));
    },
    claimPreset: async (params) => {
      var _a;
      const assetId = (_a = params == null ? void 0 : params.assetId) == null ? void 0 : _a.trim();
      if (!assetId) {
        throw new Error("assetId is required");
      }
      return callAssetApi("lingguang.asset.claimPreset", { assetId });
    }
  },
  service: {
    request: async (request) => {
      return requestService(request);
    },
    fetch: createFlashAppFetch()
  },
  backendAgent: {
    project: async (method, params = {}) => {
      return callApi("lingguang.backendAgent.project", { params: __spreadProps(__spreadValues({}, params), { method }) });
    },
    sessionCreate: async (params = {}) => {
      return callApi("lingguang.backendAgent.sessionCreate", { params });
    },
    sessionList: async (params = {}) => {
      return callApi("lingguang.backendAgent.sessionList", { params });
    },
    sessionDetail: async (params) => {
      return callApi("lingguang.backendAgent.sessionDetail", { params });
    },
    sessionUpdate: async (params) => {
      return callApi("lingguang.backendAgent.sessionUpdate", { params });
    },
    sessionDelete: async (params) => {
      return callApi("lingguang.backendAgent.sessionDelete", { params });
    },
    projectFile: async (method, params) => {
      var _a, _b, _c;
      if (method !== "upload") {
        return callApi("lingguang.backendAgent.projectFile", { params: __spreadProps(__spreadValues({}, params), { method }) });
      }
      const projectId = toPrimitiveString(params.projectId);
      if (!projectId) {
        throw new Error("projectId is required");
      }
      const existingFileId = (_a = toPrimitiveString("fileId" in params ? params.fileId : void 0)) == null ? void 0 : _a.trim();
      const existingUrl = (_b = toPrimitiveString("url" in params ? params.url : void 0)) == null ? void 0 : _b.trim();
      if (existingFileId || existingUrl) {
        if (existingFileId && existingUrl) {
          throw new Error("exactly one of fileId or url is required");
        }
        const fileName2 = (_c = toPrimitiveString("fileName" in params ? params.fileName : void 0)) == null ? void 0 : _c.trim();
        if (!fileName2) {
          throw new Error("fileName is required");
        }
        return callApi("lingguang.backendAgent.projectFile", {
          params: existingFileId ? {
            method,
            projectId,
            fileId: existingFileId,
            fileName: fileName2
          } : {
            method,
            projectId,
            url: existingUrl,
            fileName: fileName2
          }
        });
      }
      const chosenFile = toRecordValue(await callApi("lingguang.chooseFile", { options: {} }));
      const filePath = toPrimitiveString(chosenFile.filePath);
      const fileName = toPrimitiveString(chosenFile.fileName);
      if (!filePath || !fileName) {
        throw new Error("chooseFile returned invalid file");
      }
      const uploadedFile = toRecordValue(await callApi("lingguang.uploadFile", { options: { filePath } }));
      const fileId = toPrimitiveString(uploadedFile.fileId);
      if (!fileId) {
        throw new Error("uploadFile returned invalid fileId");
      }
      return callApi("lingguang.backendAgent.projectFile", {
        params: {
          method,
          projectId,
          fileId,
          fileName
        }
      });
    }
  },
  stream: {
    pull: async (params) => {
      var _a, _b;
      const streamId = (_a = toPrimitiveString(params.streamId)) == null ? void 0 : _a.trim();
      if (!streamId) {
        throw new Error("streamId is required");
      }
      return callApi(
        "lingguang.stream.pull",
        {
          params: {
            stream_id: streamId,
            cursor: (_b = toNumberValue(params.cursor)) != null ? _b : 0
          }
        },
        { signal: params.signal }
      );
    }
  },
  data: {
    fetch: async (query, schema, location2) => {
      return callApi("lingguang.data.fetch", __spreadValues({
        query,
        schema
      }, location2 ? { userLocation: location2 } : {}));
    },
    getWeather: async (options) => {
      return callApi("lingguang.data.getWeather", { params: options || {} });
    },
    getExchangeRate: async (options) => {
      return callApi("lingguang.data.getExchangeRate", { params: options || {} });
    },
    getStockPrice: async (options) => {
      return callApi("lingguang.data.getStockPrice", { params: options || {} });
    },
    getStockCandlestickData: async (options) => {
      return callApi("lingguang.data.getStockCandlestickData", { params: options || {} });
    },
    getPreciousMetalPrice: async (options) => {
      return callApi("lingguang.data.getPreciousMetalPrice", { params: options || {} });
    },
    /**
     * 渐进式探索 API - 根据查询生成流式 HTML 内容
     * @param query - 查询内容，必须包含完整上下文
     * @param currentHTML - 当前显示的 HTML，用于主题检测和上下文理解
     * @param onStreamChunk - 流式回调，接收累积的 HTML 内容
     * @returns Promise<string | null> - 使用流式回调时返回 null，否则返回完整 HTML
     */
    explore: async (query, currentHTML, onStreamChunk) => {
      if (!query) {
        throw new Error("query is required");
      }
      if (onStreamChunk) {
        let accumulatedHtml = "";
        return callApiStream(
          "lingguang.data.explore",
          { query, currentHTML: currentHTML || "" },
          {
            onText: (payload) => {
              accumulatedHtml = payload.text || accumulatedHtml + (payload.delta || "");
              onStreamChunk(accumulatedHtml);
            }
          }
        ).then(() => null);
      }
      return callApi("lingguang.data.explore", { query, currentHTML: currentHTML || "" });
    }
  },
  storybook: async (options) => {
    if (!options || !options.prompt) {
      throw new Error("prompt is required");
    }
    if (!options.onDelta) {
      throw new Error("onDelta callback is required");
    }
    const { prompt, onDelta, signal } = options;
    const lockedStreamId = { value: null };
    return callApiStream(
      "lingguang.storybook",
      { prompt },
      {
        signal,
        onText: (payload) => {
          var _a;
          const payloadRecord = toRecordValue(payload);
          const delta = toRecordValue((_a = payloadRecord.delta) != null ? _a : payloadRecord);
          const fragStreamId = toStringValue(delta.streamId);
          if (fragStreamId) {
            if (!lockedStreamId.value) {
              lockedStreamId.value = fragStreamId;
            } else if (lockedStreamId.value !== fragStreamId) {
              console.log(`[FLASH APP storybook] 不同 streamId 的 fragment 已被锁定丢弃: 锁定 ${lockedStreamId.value}, 此处 ${fragStreamId}`);
              return;
            }
          }
          onDelta(delta);
        }
      }
    );
  },
  canIUse: async (api) => {
    const apiName = typeof api === "string" ? api : api == null ? void 0 : api.api;
    if (!apiName) {
      throw new Error("api is required");
    }
    return callApi("lingguang.canIUse", { options: { api: apiName } });
  },
  notification: {
    requestAuthorization: async () => {
      return callApi("lingguang.notification.requestAuthorization", { options: {} });
    },
    openSettings: async () => {
      return callApi("lingguang.notification.openSettings", { options: {} });
    }
  },
  navigate: {
    to: async (options) => {
      return callApi("lingguang.navigate.to", { options });
    }
  },
  app: {
    share: async (payload) => {
      return callApi("lingguang.app.share", { options: payload });
    },
    checkForUpdate: async (options = {}) => {
      return callApi("lingguang.app.checkForUpdate", { options });
    }
  },
  game: {
    createRoom: async (options) => {
      return callApi("lingguang.game.createRoom", { options });
    },
    getLaunchContext: async () => {
      return callApi("lingguang.game.getLaunchContext", {});
    },
    share: async (options) => {
      return callApi("lingguang.game.share", { options });
    }
  },
  ai: {
    /**
     * AI图像生成能力，根据文本描述生成指定尺寸的图像
     * @param {Object} params - 请求参数对象
     * @param {string} [params.model] - 指定模型名称，不传时由服务端选择默认模型
     * @param {string} params.query - 图像生成的文本描述
     * @param {number} params.width - 生成图像的宽度（像素）
     * @param {number} params.height - 生成图像的高度（像素）
     * @returns {Promise<{url: string}>} 成功时返回包含图像 URL 的对象
     */
    imageGeneration: async (params) => {
      return callApi("lingguang.ai.imageGeneration", { params });
    },
    /**
     * 多模态理解能力的大语言模型，主要用于图像理解，支持图像和文本的混合输入
     * @param {Object} params - 请求参数对象
     * @param {Array<{type: 'image'|'text', content: string}>} params.content - 内容数组，可包含图像和文本
     * @returns {Promise<{content: string}>} 成功时返回包含模型理解结果的对象
     */
    vllm: async (params) => {
      return callApi("lingguang.ai.vllm", { params });
    },
    /**
     * AI音乐生成能力，根据文本描述生成音乐，支持纯音乐和带歌词的歌曲生成
     * @param {Object} params - 请求参数对象
     * @param {string} params.prompt - 音乐风格描述（英文）
     * @param {string} [params.lyrics=''] - 歌词内容，空字符串表示纯音乐
     * @param {number} [params.duration=30] - 音乐时长（秒），范围 30-240，默认 30
     * @returns {Promise<{url: string, duration?: number}>} 成功时返回包含音乐 URL 的对象
     */
    musicGeneration: async (params) => {
      return callApi("lingguang.ai.musicGeneration", { params });
    },
    chat: async (options) => {
      if (!options || !Array.isArray(options.messages) || options.messages.length === 0) {
        throw new Error("messages is required");
      }
      const _a = options, { signal } = _a, params = __objRest(_a, ["signal"]);
      return callApi("lingguang.ai.chat", { params }, { signal });
    },
    streamChat: async (options) => {
      if (!options || !Array.isArray(options.messages) || options.messages.length === 0) {
        throw new Error("messages is required");
      }
      const _a = options, { signal, onEvent } = _a, params = __objRest(_a, ["signal", "onEvent"]);
      if (isDev) {
        const lastMessage = options.messages[options.messages.length - 1];
        const mockContent = `这是开发环境的 mock AI streamChat 响应。

用户消息：${(lastMessage == null ? void 0 : lastMessage.content) || ""}`;
        const content = buildDevAiChatContent(mockContent, options.responseFormat);
        const result = buildLingguangAiChatResultFromContent(content, options.responseFormat);
        onEvent == null ? void 0 : onEvent({ type: "text_delta", delta: content, text: content });
        onEvent == null ? void 0 : onEvent(__spreadValues({ type: "message_done" }, result));
        return result;
      }
      try {
        const result = await callApiStream(
          "lingguang.ai.streamChat",
          __spreadValues({}, params),
          {
            signal,
            onText: (payload) => {
              if (payload.delta || !payload.isFinal) {
                onEvent == null ? void 0 : onEvent({
                  type: "text_delta",
                  delta: payload.delta,
                  text: payload.text
                });
              }
            },
            onError: (err) => {
              onEvent == null ? void 0 : onEvent({
                type: "error",
                message: err.message,
                code: err.code
              });
            }
          }
        );
        onEvent == null ? void 0 : onEvent(__spreadValues({ type: "message_done" }, result));
        return result;
      } catch (error) {
        onEvent == null ? void 0 : onEvent({
          type: "error",
          message: error instanceof Error ? error.message : "AI 调用失败"
        });
        throw error;
      }
    },
    /**
     * AI 流式文本生成能力，支持实时返回片段用于 UI 流式渲染
     * @param {Object} options - 请求参数对象
     * @param {string} options.prompt - 用户输入
     * @param {string} [options.systemPrompt] - 系统提示词（可选）
     * @param {(payload: {delta: string; text: string; isFinal?: boolean}) => void} options.onText - 流式文本回调
     * @param {(err: {message: string; code?: string}) => void} [options.onError] - 错误回调（可选）
     * @param {AbortSignal} [options.signal] - 取消控制（可选）
     * @returns {Promise<void>} 成功时返回 Promise
     */
    llmStream: async (options) => {
      if (!options || !options.prompt) {
        throw new Error("prompt is required");
      }
      if (!options.onText) {
        throw new Error("onText callback is required");
      }
      const { signal, onText, onError, prompt, systemPrompt } = options;
      return callApiStream("lingguang.ai.llmStream", { prompt, systemPrompt }, { signal, onText, onError });
    },
    /**
     * Agentic 流式生成（搜索 + LLM），通过 agentic_fr_agent 处理
     * @param {object} options - 请求参数
     * @param {string} options.prompt - 用户输入
     * @param {string} [options.systemPrompt] - 系统提示词（可选）
     * @param {function} options.onText - 流式文本回调（必需）
     * @param {function} [options.onError] - 错误回调（可选）
     * @param {AbortSignal} [options.signal] - 取消控制（可选）
     * @returns {Promise<void>} 成功时返回 Promise
     */
    agenticStream: async (options) => {
      if (!options || !options.prompt) {
        throw new Error("prompt is required");
      }
      if (!options.onText) {
        throw new Error("onText callback is required");
      }
      const { signal, onText, onError, prompt, systemPrompt, asyncTask, streamTextEncoding, params, extInfo } = options;
      return callApiStream("lingguang.ai.agenticStream", { prompt, systemPrompt, asyncTask, streamTextEncoding, params, extInfo }, { signal, onText, onError });
    },
    pugcCall: async (reqtype, params) => {
      return callApi("lingguang.ai.pugcCall", { payload: JSON.stringify({ reqtype, params }) });
    },
    agentStream: async (options) => {
      if (!options || !options.prompt) {
        throw new Error("prompt is required");
      }
      if (!options.onText) {
        throw new Error("onText callback is required");
      }
      const { signal, onText, onError, prompt, sessionId, location: location2 } = options;
      console.log("[FLASH APP] agentStream location:", JSON.stringify(location2));
      return callApiStream("lingguang.ai.agentStream", { prompt, sessionId, location: location2 }, { signal, onText, onError });
    },
    agentRunStream: async (options) => {
      var _b;
      if (!options || !options.projectId) {
        throw new Error("projectId is required");
      }
      if (!options.message) {
        throw new Error("message is required");
      }
      if (options.asyncTask !== void 0 && typeof options.asyncTask !== "boolean") {
        throw new Error("asyncTask must be a boolean");
      }
      const _a = options, { signal, onEvent } = _a, params = __objRest(_a, ["signal", "onEvent"]);
      const resultPreviewState = { text: "" };
      if (isDev) {
        const sessionId = (_b = params.sessionId) == null ? void 0 : _b.trim();
        onEvent == null ? void 0 : onEvent({ type: "agent_start", data: __spreadValues({ message: "开始执行" }, sessionId ? { sessionId } : {}) });
        const result = {
          success: true,
          message: "开发环境 mock agentRunStream 响应",
          result: {}
        };
        onEvent == null ? void 0 : onEvent({ type: "agent_result", data: result });
        onEvent == null ? void 0 : onEvent({ type: "agent_done" });
        return result;
      }
      try {
        const result = await callApiStream(
          "lingguang.ai.agentRunStream",
          __spreadValues({}, params),
          {
            signal,
            onText: (payload) => {
              emitAgentRunStreamDeltaEvents(payload.delta, onEvent, resultPreviewState);
            },
            onError: (err) => {
              onEvent == null ? void 0 : onEvent({
                type: "agent_error",
                message: err.message,
                code: err.code
              });
            }
          }
        );
        return result;
      } catch (error) {
        onEvent == null ? void 0 : onEvent({
          type: "agent_error",
          message: error instanceof Error ? error.message : "Agent 执行失败"
        });
        throw error;
      }
    }
  },
  session: {
    sessionList: async (params) => {
      return callApi("lingguang.session.sessionList", { params: params || {} });
    },
    sessionDetail: async (params) => {
      if (!params || !params.sessionId) throw new Error("sessionId is required");
      return callApi("lingguang.session.sessionDetail", { params });
    },
    sessionDelete: async (params) => {
      if (!params || !params.sessionId) throw new Error("sessionId is required");
      return callApi("lingguang.session.sessionDelete", { params });
    },
    inboxList: async (params) => {
      return callApi("lingguang.session.inboxList", { params: params || {} });
    }
  },
  chooseImage: async (options) => {
    return callApi("lingguang.chooseImage", { options });
  },
  chooseVideo: async (options) => {
    return callApi("lingguang.chooseVideo", { options });
  },
  scanCode: async (options) => {
    return callApi("lingguang.scanCode", { options });
  },
  takePhoto: async (options) => {
    return callApi("lingguang.takePhoto", { options });
  },
  saveImageToPhotosAlbum: async (options) => {
    return callApi("lingguang.saveImageToPhotosAlbum", { options });
  },
  uploadImage: async (options) => {
    return callApi("lingguang.uploadImage", { options });
  },
  getLocation: async (options) => {
    return callApi("lingguang.getLocation", { options });
  },
  chooseFile: async (options) => {
    return callApi("lingguang.chooseFile", { options });
  },
  uploadFile: async (options) => {
    return callApi("lingguang.uploadFile", { options });
  },
  parseFileText: async (options) => {
    if (!options || !options.fileId) {
      throw new Error("fileId is required");
    }
    return callApi("lingguang.fs.parseFileText", { params: options });
  },
  getFileText: async (options) => {
    if (!options || !options.runId) {
      throw new Error("runId is required");
    }
    return callApi("lingguang.fs.getFileText", { params: options });
  },
  file: {
    proxy: async (options) => {
      if (!options || !options.file_url) {
        throw new Error("file_url is required");
      }
      if (options.return_type !== void 0 && options.return_type !== "content" && options.return_type !== "url") {
        throw new Error("return_type must be content or url");
      }
      return callApi("lingguang.file.proxy", { params: options });
    }
  },
  previewFile: async (options) => {
    if (!options || !options.fileName) {
      throw new Error("fileName is required");
    }
    if (Boolean(options.fileId) === Boolean(options.url)) {
      throw new Error("exactly one of fileId or url is required");
    }
    return callApi("lingguang.previewFile", { options });
  },
  saveFile: async (options) => {
    return callApi("lingguang.saveFile", { options });
  },
  readFile: async (options) => {
    return callApi("lingguang.readFile", { options });
  },
  vibrate: async (options) => {
    return callApi("lingguang.vibrate", { options });
  },
  startAccelerometer: async (options) => {
    return callApi("lingguang.startAccelerometer", { options });
  },
  stopAccelerometer: async () => {
    return callApi("lingguang.stopAccelerometer", {});
  },
  onAccelerometerChange: (callback) => {
    if (typeof callback !== "function") {
      throw new Error("callback is required");
    }
    if (!flashWindow._accelerometerCallbacks) {
      flashWindow._accelerometerCallbacks = /* @__PURE__ */ new Map();
    }
    const callbackId = `accelerometer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    flashWindow._accelerometerCallbacks.set(callbackId, callback);
  },
  startCompass: async (options) => {
    return callApi("lingguang.startCompass", { options });
  },
  stopCompass: async () => {
    return callApi("lingguang.stopCompass", {});
  },
  onCompassChange: (callback) => {
    if (typeof callback !== "function") {
      throw new Error("callback is required");
    }
    if (!flashWindow._compassCallbacks) {
      flashWindow._compassCallbacks = /* @__PURE__ */ new Map();
    }
    const callbackId = `compass_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    flashWindow._compassCallbacks.set(callbackId, callback);
  },
  startDeviceMotionListening: async (options) => {
    return callApi("lingguang.startDeviceMotionListening", { options });
  },
  stopDeviceMotionListening: async () => {
    return callApi("lingguang.stopDeviceMotionListening", {});
  },
  onDeviceMotionChange: (callback) => {
    if (typeof callback !== "function") {
      throw new Error("callback is required");
    }
    if (!flashWindow._deviceMotionCallbacks) {
      flashWindow._deviceMotionCallbacks = /* @__PURE__ */ new Map();
    }
    const callbackId = `devicemotion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    flashWindow._deviceMotionCallbacks.set(callbackId, callback);
  },
  gyroscope: {
    start: async (options) => {
      if (!options || !options.onReading) {
        throw new Error("onReading callback is required");
      }
      if (!flashWindow._gyroscopeCallbacks) {
        flashWindow._gyroscopeCallbacks = /* @__PURE__ */ new Map();
      }
      const callbackId = `gyroscope_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      flashWindow._gyroscopeCallbacks.set(callbackId, options.onReading);
      return callApi("lingguang.gyroscope.start", {
        options: {
          frequency: options.frequency || "high",
          callbackId
        }
      });
    },
    stop: async () => {
      return callApi("lingguang.gyroscope.stop", {});
    }
  },
  asr: {
    start: async (options) => {
      var _a;
      if (!options || !options.onText) {
        throw new Error("onText callback is required");
      }
      const sessionId = `asr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      if (!flashWindow._asrCallbacks) {
        flashWindow._asrCallbacks = /* @__PURE__ */ new Map();
      }
      flashWindow._asrCallbacks.set(sessionId, {
        onText: options.onText,
        onError: options.onError,
        onEnd: options.onEnd
      });
      console.log("[FLASH APP] 存储回调函数，用于接收 ASR 结果事件", sessionId);
      try {
        console.log("[FLASH APP] before await callApi lingguang.asr.start", sessionId);
        await callApi("lingguang.asr.start", {
          options: {
            id: sessionId,
            lang: options.lang || "zh-CN",
            interim: options.interim !== false,
            continuous: options.continuous === true
          }
        });
        console.log("[FLASH APP] after await callApi lingguang.asr.start", sessionId);
      } catch (error) {
        console.log("[FLASH APP] callApi lingguang.asr.start 异常", sessionId);
        if (flashWindow._asrCallbacks) {
          flashWindow._asrCallbacks.delete(sessionId);
        }
        const asrError = {
          error: "unknown",
          message: getErrorMessage(error, "启动识别失败"),
          code: getErrorCode(error)
        };
        const errorMsg = getErrorMessage(error, "").toLowerCase();
        if (errorMsg.includes("permission") || errorMsg.includes("权限")) {
          asrError.error = "not-allowed";
        } else if (errorMsg.includes("device") || errorMsg.includes("设备")) {
          asrError.error = "audio-capture";
        } else if (errorMsg.includes("network") || errorMsg.includes("网络")) {
          asrError.error = "network";
        }
        throw new Error((_a = asrError.message) != null ? _a : "启动识别失败");
      }
    },
    stop: async () => {
      const asrCallbacks = flashWindow._asrCallbacks;
      if (!asrCallbacks || asrCallbacks.size === 0) {
        console.log("[FLASH APP] ASR stop: 没有活跃的识别会话");
        return;
      }
      const sessionId = asrCallbacks.keys().next().value;
      if (!sessionId) {
        return;
      }
      return callApi("lingguang.asr.stop", {
        options: {
          id: sessionId
        }
      });
    },
    abort: async () => {
      const asrCallbacks = flashWindow._asrCallbacks;
      if (!asrCallbacks || asrCallbacks.size === 0) {
        console.log("[FLASH APP] ASR abort: 没有活跃的识别会话");
        return;
      }
      const sessionId = asrCallbacks.keys().next().value;
      if (!sessionId) {
        return;
      }
      try {
        await callApi("lingguang.asr.abort", {
          options: {
            id: sessionId
          }
        });
        if (flashWindow._asrCallbacks) {
          flashWindow._asrCallbacks.delete(sessionId);
        }
      } catch (error) {
        if (flashWindow._asrCallbacks) {
          flashWindow._asrCallbacks.delete(sessionId);
        }
        throw error;
      }
    }
  },
  monitor: {
    event: async (options) => {
      return callApi("lingguang.monitor.event", { options });
    }
  }
};
const initializeCurrentRole = () => {
  window.currentRole = "USER";
  if (window.parent === window) {
    window.currentRoleReady = Promise.resolve("USER");
    return window.currentRoleReady;
  }
  window.currentRoleReady = window.lingguang.db.role().then((result) => {
    return syncCurrentRole(result.role);
  }).catch((error) => {
    console.log("[FLASH APP] 初始化 DB 角色失败，按 USER 处理", error);
    return syncCurrentRole("USER");
  });
  return window.currentRoleReady;
};
void initializeCurrentRole();
window.callLLM = (prompt, systemPrompt, timeout) => {
  return callApi("lingguang.deprecated.callLLM", { prompt, systemPrompt, timeout });
};
window.__instrumentedCatchMonitor = (e) => {
  console.log("[FLASH APP][INSTRUMENTED_CATCH]", e);
  const logData = {
    type: "flash-app-instrumented-catch",
    message: getErrorMessage(e, "Caught error"),
    name: getErrorName(e),
    stack: getErrorStack(e),
    code: getErrorCode(e),
    serializedError: serializeInstrumentedCatchError(e),
    timestamp: Date.now(),
    artifactId: window.artifactId || "",
    artifactVersion: window.artifactVersion || "",
    traceId: window.trace_id || "",
    sessionId: window._flashAppSessionId || ""
  };
  if (isAutoFixableInstrumentedCatchError(logData.stack)) {
    try {
      window.parent.postMessage(
        {
          type: "flash-app-error",
          payload: __spreadProps(__spreadValues({}, logData), {
            errorType: "instrumented-catch"
          })
        },
        "*"
      );
    } catch (error) {
      console.log("[FLASH APP][INSTRUMENTED_CATCH] 自动修复消息发送失败", error);
    }
  }
  try {
    void window.lingguang.monitor.event({
      rawLog: JSON.stringify(logData)
    }).catch((error) => {
      console.log("[FLASH APP][INSTRUMENTED_CATCH] 上报失败", error);
    });
  } catch (error) {
    console.log("[FLASH APP][INSTRUMENTED_CATCH] 上报异常", error);
  }
};
const asyncAlertWindow = window;
asyncAlertWindow.alert = async (message) => {
  try {
    await callApi("lingguang.alert", { options: { message } });
  } catch (e) {
    console.log("[FLASH APP] alert 失败", e);
  }
};
const getCandyJarCallbacks = () => {
  if (!window._candyJarCallbacks) {
    window._candyJarCallbacks = {};
  }
  return window._candyJarCallbacks;
};
void getCandyJarCallbacks();
if (!window.CandyJar) {
  window.CandyJar = {
    call: function(method, action, params, successCallback, errorCallback, timeout = 2e4) {
      const callId = "candyJar_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      const callbackMap = getCandyJarCallbacks();
      callbackMap[callId] = {
        resolve: (result) => {
          clearTimeout(timeoutId);
          delete callbackMap[callId];
          if (successCallback && typeof successCallback === "function") {
            const response = __spreadProps(__spreadValues({}, toRecordValue(result)), {
              success: true
            });
            successCallback(response);
          }
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          delete callbackMap[callId];
          if (errorCallback && typeof errorCallback === "function") {
            errorCallback(error);
          }
        }
      };
      const timeoutId = setTimeout(() => {
        if (callbackMap[callId]) {
          console.log("[FLASH APP] CandyJar 调用超时:", method, action);
          delete callbackMap[callId];
          if (errorCallback && typeof errorCallback === "function") {
            errorCallback(new Error("CandyJar call timeout"));
          }
        }
      }, timeout);
      const message = {
        type: "CANDYJAR_CALL",
        callId,
        method,
        action,
        params
      };
      console.log("[FLASH APP] 子iframe向主iframe发送消息:", JSON.stringify(message, null, 2));
      window.parent.postMessage(message, "*");
    }
  };
  window.addEventListener("message", function(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    const messageData = toRecordValue(event.data);
    console.log("[FLASH APP][MSG] [candyjar] 收到 message, type=", messageData.type, "data=", event.data);
    console.log("[FLASH APP] 消息数据:", messageData);
    if (messageData.type === "CANDYJAR_CALLBACK") {
      const callId = toStringValue(messageData.callId);
      const success = messageData.success === true;
      const result = messageData.result;
      const errorMessage = toStringValue(messageData.error, "CandyJar call failed");
      const callbackMap = window._candyJarCallbacks;
      const promiseData = callId ? callbackMap == null ? void 0 : callbackMap[callId] : void 0;
      if (promiseData) {
        if (success) {
          console.log("[FLASH APP] CandyJar 调用成功:", callId, result);
          promiseData.resolve(result);
        } else {
          console.log("[FLASH APP] CandyJar 调用失败:", callId, errorMessage);
          promiseData.reject(new Error(errorMessage));
        }
        if (callbackMap && callId) {
          delete callbackMap[callId];
        }
      } else {
        console.log("[FLASH APP] 未找到对应的回调处理器（可能已经释放） for callId:", callId);
      }
    }
    if (messageData.type === "CANDYJAR_EVENT") {
      const eventType = toStringValue(messageData.eventType);
      const eventData = toRecordValue(messageData.eventData);
      if (!eventType) {
        return;
      }
      console.log("[FLASH APP] 接收到" + eventType + "类型的事件转发，数据:" + JSON.stringify(eventData, null, 2));
      const customEvent = new CustomEvent(eventType, {
        detail: eventData,
        // 直接传递序列化的事件数据
        bubbles: true,
        cancelable: true
      });
      const segmentId = toStringValue(eventData.segmentId);
      if (segmentId) customEvent.segmentId = segmentId;
      if (eventData.sentences !== void 0) customEvent.sentences = eventData.sentences;
      if (eventData.error !== void 0) customEvent.error = eventData.error;
      const htmlFragment = toStringValue(eventData.htmlFragment);
      if (htmlFragment) customEvent.htmlFragment = htmlFragment;
      const action = toStringValue(eventData.action);
      if (action) customEvent.action = action;
      const x = toNumberValue(eventData.x);
      if (x !== void 0) customEvent.x = x;
      const y = toNumberValue(eventData.y);
      if (y !== void 0) customEvent.y = y;
      const z = toNumberValue(eventData.z);
      if (z !== void 0) customEvent.z = z;
      const direction = toNumberValue(eventData.direction);
      if (direction !== void 0) customEvent.direction = direction;
      const alpha = toNumberValue(eventData.alpha);
      if (alpha !== void 0) customEvent.alpha = alpha;
      const beta = toNumberValue(eventData.beta);
      if (beta !== void 0) customEvent.beta = beta;
      const gamma = toNumberValue(eventData.gamma);
      if (gamma !== void 0) customEvent.gamma = gamma;
      const timestamp = toNumberValue(eventData.timestamp);
      if (timestamp !== void 0) customEvent.timestamp = timestamp;
      const id = toStringValue(eventData.id);
      if (id) customEvent.id = id;
      const speechState = toNumberValue(eventData.speechState);
      if (speechState !== void 0) customEvent.speechState = speechState;
      const errorCode = toNumberValue(eventData.errorCode);
      if (errorCode !== void 0) customEvent.errorCode = errorCode;
      const result = toPrimitiveString(eventData.result);
      if (result !== void 0) customEvent.result = result;
      if (eventData.isFinal !== void 0) customEvent.isFinal = eventData.isFinal === "1" || eventData.isFinal === true;
      const customVisibilityState = toVisibilityState(eventData.visibilityState);
      if (customVisibilityState) customEvent.visibilityState = customVisibilityState;
      if (eventType === "CandyJar.Sensor.onGyroscopeChange") {
        const gyroscopeCallbacks = flashWindow._gyroscopeCallbacks;
        if (gyroscopeCallbacks && gyroscopeCallbacks.size > 0) {
          const reading = {
            x: (_a = toNumberValue(eventData.x)) != null ? _a : 0,
            y: (_b = toNumberValue(eventData.y)) != null ? _b : 0,
            z: (_c = toNumberValue(eventData.z)) != null ? _c : 0,
            timestamp: (_d = toNumberValue(eventData.timestamp)) != null ? _d : 0
          };
          gyroscopeCallbacks.forEach((callback) => {
            try {
              callback(reading);
            } catch (e) {
              console.log("[FLASH APP] 陀螺仪回调执行失败:", e);
            }
          });
        }
      }
      if (eventType === "CandyJar.Sensor.onAccelerometerChange") {
        const accelerometerCallbacks = flashWindow._accelerometerCallbacks;
        if (accelerometerCallbacks && accelerometerCallbacks.size > 0) {
          const reading = {
            x: (_e = toNumberValue(eventData.x)) != null ? _e : 0,
            y: (_f = toNumberValue(eventData.y)) != null ? _f : 0,
            z: (_g = toNumberValue(eventData.z)) != null ? _g : 0
          };
          accelerometerCallbacks.forEach((callback) => {
            try {
              callback(reading);
            } catch (e) {
              console.log("[FLASH APP] 加速度回调执行失败:", e);
            }
          });
        }
      }
      if (eventType === "CandyJar.Sensor.onCompassChange") {
        const compassCallbacks = flashWindow._compassCallbacks;
        if (compassCallbacks && compassCallbacks.size > 0) {
          const reading = {
            direction: (_h = toNumberValue(eventData.direction)) != null ? _h : 0
          };
          compassCallbacks.forEach((callback) => {
            try {
              callback(reading);
            } catch (e) {
              console.log("[FLASH APP] 罗盘回调执行失败:", e);
            }
          });
        }
      }
      if (eventType === "CandyJar.Sensor.onDeviceMotionChange") {
        const deviceMotionCallbacks = flashWindow._deviceMotionCallbacks;
        if (deviceMotionCallbacks && deviceMotionCallbacks.size > 0) {
          const reading = {
            alpha: (_i = toNumberValue(eventData.alpha)) != null ? _i : 0,
            beta: (_j = toNumberValue(eventData.beta)) != null ? _j : 0,
            gamma: (_k = toNumberValue(eventData.gamma)) != null ? _k : 0
          };
          deviceMotionCallbacks.forEach((callback) => {
            try {
              callback(reading);
            } catch (e) {
              console.log("[FLASH APP] 设备方向回调执行失败:", e);
            }
          });
        }
      }
      if (eventType === "CandyJar.ASR.OnResult") {
        const asrCallbacks = flashWindow._asrCallbacks;
        if (asrCallbacks) {
          const sessionId = toStringValue(eventData.id);
          if (!sessionId) {
            console.log("[FLASH APP] ASR OnResult 事件缺少 sessionId");
            window.document.dispatchEvent(customEvent);
            return;
          }
          const callbacks = asrCallbacks.get(sessionId);
          if (callbacks) {
            const errorCode2 = toStringValue(eventData.errorCode);
            const result2 = toPrimitiveString(eventData.result);
            const isFinal = eventData.isFinal === "1" || eventData.isFinal === true;
            const speechState2 = toStringValue(eventData.speechState);
            if (errorCode2 && errorCode2 !== "0" && errorCode2 !== "38") {
              const asrError = {
                error: "unknown",
                message: "识别过程出错",
                fatal: true,
                sessionId,
                code: errorCode2
              };
              if (errorCode2 === "40") {
                asrError.error = "no-speech";
                asrError.message = "未检测到语音，录音已终止";
              }
              try {
                if (callbacks.onError) {
                  callbacks.onError(asrError);
                }
              } catch (e) {
                console.log("[FLASH APP] ASR onError 回调执行失败:", e);
              }
              try {
                if (callbacks.onEnd) {
                  callbacks.onEnd("error", sessionId);
                }
              } catch (e) {
                console.log("[FLASH APP] ASR onEnd 回调执行失败:", e);
              }
              asrCallbacks.delete(sessionId);
              return;
            }
            if (result2 !== void 0) {
              try {
                callbacks.onText({
                  text: result2,
                  sessionId,
                  isFinal
                });
              } catch (e) {
                console.log("[FLASH APP] ASR onText 回调执行失败:", e);
              }
            }
            if (isFinal || speechState2 === "cancel") {
              try {
                if (callbacks.onEnd) {
                  callbacks.onEnd("stop", sessionId);
                }
              } catch (e) {
                console.log("[FLASH APP] ASR onEnd 回调执行失败:", e);
              }
              asrCallbacks.delete(sessionId);
            }
          } else {
            console.log("[FLASH APP] ASR OnResult 事件未找到对应的回调，sessionId:", sessionId);
          }
        }
      }
      window.document.dispatchEvent(customEvent);
    }
  });
  console.log("[FLASH APP] iframe CandyJar 已初始化为 postMessage 通信");
}
(function() {
  let lastHeight = 0;
  let isDebouncing = false;
  const isInIframe = window.self !== window.top;
  function sendHeightToParent() {
    if (!isInIframe) return;
    const height = Math.max(document.body.offsetHeight, document.body.scrollHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    if (height !== lastHeight) {
      window.parent.postMessage(
        {
          type: "miniapp_resize",
          height,
          timestamp: Date.now()
        },
        "*"
      );
      console.log("[FLASH APP] 发送高度信息:", height, "(上次:", lastHeight, ")");
      lastHeight = height;
    }
  }
  function debouncedSendHeight() {
    if (isDebouncing) return;
    isDebouncing = true;
    setTimeout(() => {
      sendHeightToParent();
      isDebouncing = false;
    }, 150);
  }
  window.addEventListener("message", function(event) {
    const eventData = toRecordValue(event.data);
    console.log("[FLASH APP][MSG] [checkHeight] 收到 message, type=", eventData.type, "data=", event.data);
    if (eventData.type === "checkHeight") {
      sendHeightToParent();
    }
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      sendHeightToParent();
    });
  } else {
    sendHeightToParent();
  }
  window.addEventListener("resize", debouncedSendHeight);
  const observer = new MutationObserver(debouncedSendHeight);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"]
  });
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(debouncedSendHeight);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);
  }
})();
(function() {
  const isInIframe = window.self !== window.top;
  if (!isInIframe) {
    return;
  }
  if (flashWindow._canvasDetectionInitialized) {
    return;
  }
  flashWindow._canvasDetectionInitialized = true;
  const DETECTION_WINDOW_MS = 5e3;
  let detectionActive = false;
  let hasNotified = false;
  let observer = null;
  let stopTimer = null;
  let checkScheduled = false;
  function stopDetection() {
    detectionActive = false;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (stopTimer !== null) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }
    console.log("[FLASH APP] canvas 检测窗口已结束");
  }
  function notifyCanvasDetected() {
    if (hasNotified) {
      return;
    }
    hasNotified = true;
    window.parent.postMessage(
      {
        type: "FLASH_APP_CANVAS_DETECTED",
        hasCanvas: true,
        artifactId: window.artifactId,
        artifactVersion: window.artifactVersion,
        timestamp: Date.now()
      },
      "*"
    );
    console.log("[FLASH APP] 检测到 canvas，已通知上层");
    stopDetection();
  }
  function checkCanvasPresence() {
    if (!detectionActive || hasNotified) {
      return;
    }
    try {
      if (document.querySelector("canvas")) {
        notifyCanvasDetected();
      }
    } catch (e) {
      console.log("[FLASH APP] canvas 检测失败", e);
    }
  }
  function scheduleCheck() {
    if (!detectionActive || checkScheduled) {
      return;
    }
    checkScheduled = true;
    setTimeout(() => {
      checkScheduled = false;
      checkCanvasPresence();
    }, 0);
  }
  function startDetection() {
    if (detectionActive) {
      return;
    }
    detectionActive = true;
    checkCanvasPresence();
    const observeTarget = document.body || document.documentElement;
    if (observeTarget) {
      observer = new MutationObserver(scheduleCheck);
      observer.observe(observeTarget, {
        childList: true,
        subtree: true
      });
    }
    stopTimer = window.setTimeout(() => {
      stopDetection();
    }, DETECTION_WINDOW_MS);
  }
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function() {
        startDetection();
      },
      { once: true }
    );
  } else {
    startDetection();
  }
})();
(function() {
  if (flashWindow._safeAreaVisibilityGuardInitialized) {
    return;
  }
  flashWindow._safeAreaVisibilityGuardInitialized = true;
  const SAFE_AREA_ID = "safe-area";
  const SAFE_AREA_TOP_VAR = "--flash-app-safe-area-inset-top";
  const SAFE_AREA_RIGHT_VAR = "--flash-app-safe-area-inset-right";
  const SAFE_AREA_BOTTOM_VAR = "--flash-app-safe-area-inset-bottom";
  const SAFE_AREA_LEFT_VAR = "--flash-app-safe-area-inset-left";
  const LEGACY_SAFE_TOP_VAR = "--flash-app-safe-top";
  const HIDDEN_MARKER_ATTR = "data-flash-app-hidden-by-safe-area";
  const ORIGINAL_DISPLAY_ATTR = "data-flash-app-original-display";
  const DEFAULT_SAFE_AREA_INSETS = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  let mutationObserver = null;
  let currentInsets = DEFAULT_SAFE_AREA_INSETS;
  const hideSafeArea = (element) => {
    if (element.getAttribute(HIDDEN_MARKER_ATTR) === "1") {
      return;
    }
    element.setAttribute(HIDDEN_MARKER_ATTR, "1");
    element.setAttribute(ORIGINAL_DISPLAY_ATTR, element.style.display || "");
    element.style.display = "none";
  };
  const showSafeArea = (element) => {
    if (element.getAttribute(HIDDEN_MARKER_ATTR) !== "1") {
      return;
    }
    const originalDisplay = element.getAttribute(ORIGINAL_DISPLAY_ATTR);
    element.style.display = originalDisplay || "";
    element.removeAttribute(HIDDEN_MARKER_ATTR);
    element.removeAttribute(ORIGINAL_DISPLAY_ATTR);
  };
  const isValidSafeAreaInsets = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }
    const insets = value;
    return ["top", "right", "bottom", "left"].every((direction) => {
      const inset = insets[direction];
      return typeof inset === "number" && Number.isFinite(inset) && inset >= 0;
    });
  };
  const applySafeAreaInsets = (insets) => {
    currentInsets = {
      top: insets.top,
      right: insets.right,
      bottom: insets.bottom,
      left: insets.left
    };
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty(SAFE_AREA_TOP_VAR, `${currentInsets.top}px`);
    rootStyle.setProperty(SAFE_AREA_RIGHT_VAR, `${currentInsets.right}px`);
    rootStyle.setProperty(SAFE_AREA_BOTTOM_VAR, `${currentInsets.bottom}px`);
    rootStyle.setProperty(SAFE_AREA_LEFT_VAR, `${currentInsets.left}px`);
    rootStyle.setProperty(LEGACY_SAFE_TOP_VAR, `${currentInsets.top}px`);
    const safeAreaElement = document.getElementById(SAFE_AREA_ID);
    if (!safeAreaElement) {
      return;
    }
    if (currentInsets.top <= 0) {
      hideSafeArea(safeAreaElement);
      return;
    }
    showSafeArea(safeAreaElement);
  };
  const setupSafeAreaElementObserver = () => {
    mutationObserver = new MutationObserver(() => applySafeAreaInsets(currentInsets));
    if (document.documentElement) {
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  };
  const init = () => {
    const cachedInsets = flashWindow.__flashAppSafeAreaInsets;
    applySafeAreaInsets(isValidSafeAreaInsets(cachedInsets) ? cachedInsets : DEFAULT_SAFE_AREA_INSETS);
    setupSafeAreaElementObserver();
  };
  window.addEventListener("message", (event) => {
    const data = toRecordValue(event.data);
    if (toStringValue(data.type) !== "FLASH_APP_SAFE_AREA" || !isValidSafeAreaInsets(data.insets)) {
      return;
    }
    applySafeAreaInsets(data.insets);
  });
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        init();
      },
      { once: true }
    );
  } else {
    init();
  }
})();
let directScrollDisabled = false;
window.addEventListener("message", function(event) {
  var _a;
  const eventData = toRecordValue(event.data);
  console.log("[FLASH APP][MSG] [scroll] 收到 message, type=", eventData.type, "data=", event.data);
  const eventType = toStringValue(eventData.type);
  if (eventType === "DISABLE_DIRECT_SCROLL" || eventType === "ENABLE_DIRECT_SCROLL") {
    directScrollDisabled = eventType === "DISABLE_DIRECT_SCROLL";
    flashWindow.__directScrollDisabled = directScrollDisabled;
    console.log("[FLASH APP] 直接滚动状态变更:", directScrollDisabled ? "已禁用" : "已启用");
    if (directScrollDisabled) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      document.documentElement.style.height = "100%";
      document.body.style.height = "100%";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.touchAction = "";
      document.documentElement.style.height = "";
      document.body.style.height = "";
      const htmlEl = document.documentElement;
      const bodyEl = document.body;
      if (window.getComputedStyle(htmlEl).overflow === "hidden") {
        htmlEl.style.overflow = "visible";
      }
      if (bodyEl && window.getComputedStyle(bodyEl).overflow === "hidden") {
        bodyEl.style.overflow = "visible";
      }
      if (window.getComputedStyle(htmlEl).touchAction === "none") {
        htmlEl.style.touchAction = "auto";
      }
    }
  }
  if (eventType === "SCROLL_TO_PERCENTAGE") {
    const percentage = toNumberValue(eventData.percentage);
    const behaviorRaw = toStringValue(eventData.behavior, "auto");
    const behavior = behaviorRaw === "smooth" ? "smooth" : "auto";
    if (percentage === void 0) {
      console.log("[FLASH APP] 滚动控制：无效的 percentage 参数");
      return;
    }
    try {
      const docElOverflow = document.documentElement.style.overflow;
      const bodyOverflow = document.body.style.overflow;
      if (docElOverflow === "hidden") document.documentElement.style.overflow = "";
      if (bodyOverflow === "hidden") document.body.style.overflow = "";
      if (document.documentElement.style.height === "100%") document.documentElement.style.height = "";
      if (document.body.style.height === "100%") document.body.style.height = "";
      let scrollElement = document.body;
      let scrollHeight = scrollElement.scrollHeight;
      let clientHeight = scrollElement.clientHeight;
      const bodyComputedOverflow = window.getComputedStyle(document.body).overflow;
      const bodyNotProgrammaticallyScrollable = bodyComputedOverflow === "visible" || bodyComputedOverflow === "clip";
      if (bodyNotProgrammaticallyScrollable || scrollHeight <= clientHeight) {
        const se = document.scrollingElement || document.documentElement;
        scrollElement = se;
        scrollHeight = se.scrollHeight;
        clientHeight = se.clientHeight || window.innerHeight;
      }
      if (scrollHeight <= clientHeight) {
        document.body.scrollTo({ top: 0, behavior });
        console.log("[FLASH APP] 滚动控制：内容无滚动条，已滚动到顶部");
        return;
      }
      const maxScrollTop = scrollHeight - clientHeight;
      if (maxScrollTop <= 0) {
        scrollElement.scrollTo({ top: 0, behavior });
        console.log("[FLASH APP] 滚动控制：maxScrollTop <= 0，已滚动到顶部");
        return;
      }
      const percent = Math.max(0, Math.min(100, percentage));
      const targetScrollTop = Math.round(percent / 100 * maxScrollTop);
      const finalScrollTop = Math.max(0, Math.min(maxScrollTop, targetScrollTop));
      scrollElement.scrollTo({
        top: finalScrollTop,
        behavior
      });
      console.log("[FLASH APP] 滚动控制：已滚动到", percent + "%", "位置 (scrollTop:", finalScrollTop + ")", {
        percentage: percent,
        scrollHeight,
        clientHeight,
        maxScrollTop,
        finalScrollTop,
        behavior
      });
    } catch (error) {
      console.log("[FLASH APP] 滚动执行失败:", error);
    }
  }
  if (eventType === "QUERY_SCROLL_PERCENT") {
    const percent = getScrollPercent();
    try {
      ;
      (_a = window.parent || window.top) == null ? void 0 : _a.postMessage(
        {
          type: "REPORT_SCROLL_PERCENT",
          scrollPercent: percent
        },
        "*"
      );
    } catch (e) {
    }
  }
});
try {
  if (document.documentElement) {
    const htmlStyle = window.getComputedStyle(document.documentElement);
    if (htmlStyle.overflow === "hidden") {
      document.documentElement.style.overflow = "visible";
    }
  }
  if (document.body) {
    const bodyStyle = window.getComputedStyle(document.body);
    if (bodyStyle.overflow === "hidden") {
      document.body.style.overflow = "visible";
    }
  }
} catch (e) {
  console.log("[FLASH APP] 移除 overflow 属性失败:", e);
}
(function() {
  if (flashWindow._linkClickProxyInitialized) {
    return;
  }
  flashWindow._linkClickProxyInitialized = true;
  function handleLinkClick(event) {
    const target = event.target;
    if (!target || !(target instanceof HTMLAnchorElement)) {
      return;
    }
    const href = target.getAttribute("href");
    if (!href) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    console.log("[FLASH APP] 拦截到链接点击:", href);
    window.lingguang.navigate.to({ url: href }).catch((error) => {
      console.log("[FLASH APP] 链接跳转失败", error);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      document.addEventListener("click", handleLinkClick, true);
      console.log("[FLASH APP] 全局链接点击代理已初始化");
    });
  } else {
    document.addEventListener("click", handleLinkClick, true);
    console.log("[FLASH APP] 全局链接点击代理已初始化");
  }
})();
(function() {
  if (flashWindow._inspectControllerInitialized) {
    return;
  }
  flashWindow._inspectControllerInitialized = true;
  const INSPECT_ATTR = "data-flash-app-inspect-mode";
  const INSPECT_IGNORE_ATTR = "data-flash-app-inspect-ignore";
  const INSPECT_STYLE_ID = "flash-app-inspect-style";
  const INSPECT_OVERLAY_ID = "flash-app-inspect-overlay";
  const editableFieldSelector = 'input:not([type="hidden"]),textarea,select,[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"]';
  const interactiveSelector = `button,a,input,textarea,select,option,label,summary,${editableFieldSelector},[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="radio"],[data-testid],[data-ai-id],[data-qa]`;
  const containerSelector = "li,article,section,form,fieldset,dialog,nav,aside,main,header,footer,[data-card],[data-panel]";
  const trackedEvents = ["pointermove", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend", "click", "dblclick", "contextmenu", "submit", "focusin", "scroll", "resize"];
  const TAP_MOVE_THRESHOLD_PX = 12;
  const RECENT_SELECTION_WINDOW_MS = 400;
  let enabled = false;
  let hoverTarget = null;
  let selectedTarget = null;
  let overlay = null;
  let gestureState = null;
  let recentSelection = null;
  const escapeSelectorValue = (value) => {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return value.replace(/["\\]/g, "\\$&");
  };
  const collapseWhitespace = (value) => {
    return value.replace(/\s+/g, " ").trim();
  };
  const getElementTextPreview = (element, fallback = "") => {
    if (!element) {
      return fallback;
    }
    const text = collapseWhitespace(element.textContent || "");
    if (!text) {
      return fallback;
    }
    return text.slice(0, 80);
  };
  const isEditableField = (element) => {
    return element instanceof HTMLElement && element.matches(editableFieldSelector);
  };
  const blurElement = (element) => {
    if (element instanceof HTMLElement && typeof element.blur === "function") {
      element.blur();
    }
  };
  const getEditableFieldTarget = (element) => {
    if (!element) {
      return null;
    }
    if (isEditableField(element)) {
      return element;
    }
    const closestEditableField = element.closest(editableFieldSelector);
    if (closestEditableField instanceof HTMLElement) {
      return closestEditableField;
    }
    const labelElement = element.closest("label");
    if (labelElement instanceof HTMLLabelElement && isEditableField(labelElement.control)) {
      return labelElement.control;
    }
    return null;
  };
  const blurEditableFieldState = (rawTarget = null) => {
    blurElement(getEditableFieldTarget(rawTarget));
    blurElement(getEditableFieldTarget(document.activeElement instanceof Element ? document.activeElement : null));
  };
  const isIgnoredElement = (element) => {
    if (!element) {
      return true;
    }
    if (element.hasAttribute(INSPECT_IGNORE_ATTR)) {
      return true;
    }
    return !!element.closest(`[${INSPECT_IGNORE_ATTR}]`);
  };
  const isMeaningfulElement = (element) => {
    if (!element || isIgnoredElement(element)) {
      return false;
    }
    const tagName = element.tagName.toLowerCase();
    if (["html", "body", "head", "script", "style", "meta", "link"].includes(tagName)) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      return false;
    }
    return true;
  };
  const isDecorativeOrTiny = (element) => {
    const tagName = element.tagName.toLowerCase();
    const rect = element.getBoundingClientRect();
    if (["svg", "path", "use", "circle", "rect"].includes(tagName)) {
      return true;
    }
    if (rect.width < 24 || rect.height < 24) {
      return true;
    }
    if (tagName === "span" && collapseWhitespace(element.textContent || "").length <= 24) {
      return true;
    }
    return false;
  };
  const getMeaningfulAncestor = (element) => {
    let current = element;
    while (current) {
      if (isMeaningfulElement(current)) {
        return current;
      }
      const nextParent = current.parentElement;
      current = nextParent instanceof Element ? nextParent : null;
    }
    return null;
  };
  const normalizeTarget = (rawTarget) => {
    const meaningfulRaw = getMeaningfulAncestor(rawTarget);
    if (!meaningfulRaw) {
      return { element: null, reason: "raw" };
    }
    const interactiveTarget = meaningfulRaw.closest(interactiveSelector);
    if (interactiveTarget && isMeaningfulElement(interactiveTarget)) {
      return {
        element: interactiveTarget,
        reason: interactiveTarget === meaningfulRaw ? "raw" : "interactive-ancestor"
      };
    }
    const containerTarget = meaningfulRaw.closest(containerSelector);
    if (containerTarget && isMeaningfulElement(containerTarget) && (isDecorativeOrTiny(meaningfulRaw) || containerTarget !== meaningfulRaw)) {
      return {
        element: containerTarget,
        reason: containerTarget === meaningfulRaw ? "raw" : "container-ancestor"
      };
    }
    return { element: meaningfulRaw, reason: "raw" };
  };
  const buildSelectorPart = (element) => {
    const tagName = element.tagName.toLowerCase();
    const id = element.getAttribute("id");
    if (id) {
      return `#${escapeSelectorValue(id)}`;
    }
    const testId = element.getAttribute("data-testid");
    if (testId) {
      return `${tagName}[data-testid="${escapeSelectorValue(testId)}"]`;
    }
    const aiId = element.getAttribute("data-ai-id");
    if (aiId) {
      return `${tagName}[data-ai-id="${escapeSelectorValue(aiId)}"]`;
    }
    const role = element.getAttribute("role");
    if (role) {
      return `${tagName}[role="${escapeSelectorValue(role)}"]`;
    }
    const parent = element.parentElement;
    if (!parent) {
      return tagName;
    }
    const siblings = Array.from(parent.children).filter((child) => child.tagName === element.tagName);
    if (siblings.length <= 1) {
      return tagName;
    }
    const index = siblings.indexOf(element) + 1;
    return `${tagName}:nth-of-type(${index})`;
  };
  const buildSelector = (element) => {
    const parts = [];
    let current = element;
    let depth = 0;
    while (current && depth < 5) {
      const part = buildSelectorPart(current);
      parts.unshift(part);
      if (part.startsWith("#")) {
        break;
      }
      current = current.parentElement;
      depth += 1;
    }
    return parts.join(" > ");
  };
  const buildRect = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  };
  const getInspectAttributes = (element) => {
    const attributeNames = ["id", "class", "role", "name", "type", "href", "aria-label", "data-testid", "data-ai-id", "data-qa"];
    return attributeNames.reduce((acc, attributeName) => {
      const value = element.getAttribute(attributeName);
      if (value) {
        acc[attributeName] = value;
      }
      return acc;
    }, {});
  };
  const getCandidateChain = (rawTarget) => {
    var _a;
    const candidateMap = /* @__PURE__ */ new Map();
    const meaningfulRaw = getMeaningfulAncestor(rawTarget);
    if (meaningfulRaw && isMeaningfulElement(meaningfulRaw)) {
      candidateMap.set(meaningfulRaw, {
        selector: buildSelector(meaningfulRaw),
        tagName: meaningfulRaw.tagName.toLowerCase(),
        text: getElementTextPreview(meaningfulRaw),
        reason: "raw"
      });
    }
    const interactiveTarget = meaningfulRaw == null ? void 0 : meaningfulRaw.closest(interactiveSelector);
    if (interactiveTarget && isMeaningfulElement(interactiveTarget)) {
      candidateMap.set(interactiveTarget, {
        selector: buildSelector(interactiveTarget),
        tagName: interactiveTarget.tagName.toLowerCase(),
        text: getElementTextPreview(interactiveTarget),
        reason: interactiveTarget === meaningfulRaw ? "raw" : "interactive-ancestor"
      });
    }
    let currentContainer = (meaningfulRaw == null ? void 0 : meaningfulRaw.closest(containerSelector)) || null;
    let containerDepth = 0;
    while (currentContainer && containerDepth < 2) {
      if (isMeaningfulElement(currentContainer) && !candidateMap.has(currentContainer)) {
        candidateMap.set(currentContainer, {
          selector: buildSelector(currentContainer),
          tagName: currentContainer.tagName.toLowerCase(),
          text: getElementTextPreview(currentContainer),
          reason: currentContainer === meaningfulRaw ? "raw" : "container-ancestor"
        });
      }
      currentContainer = ((_a = currentContainer.parentElement) == null ? void 0 : _a.closest(containerSelector)) || null;
      containerDepth += 1;
    }
    return Array.from(candidateMap.values());
  };
  const buildPickResult = (primaryTarget, rawTarget, rect) => {
    const ancestry = [];
    let current = primaryTarget;
    let depth = 0;
    while (current && depth < 4) {
      ancestry.push(buildSelector(current));
      current = current.parentElement;
      depth += 1;
    }
    const nearbyText = [rawTarget, rawTarget ? rawTarget.parentElement : null, primaryTarget.parentElement].map((element) => getElementTextPreview(element)).filter((value, index, list) => value && list.indexOf(value) === index).slice(0, 3);
    return {
      primary: {
        selector: buildSelector(primaryTarget),
        tagName: primaryTarget.tagName.toLowerCase(),
        text: getElementTextPreview(primaryTarget),
        role: primaryTarget.getAttribute("role") || void 0,
        rect,
        attributes: getInspectAttributes(primaryTarget)
      },
      candidates: getCandidateChain(rawTarget),
      context: {
        pageTitle: document.title,
        nearbyText,
        ancestry
      }
    };
  };
  const ensureInspectStyle = () => {
    if (document.getElementById(INSPECT_STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = INSPECT_STYLE_ID;
    style.setAttribute(INSPECT_IGNORE_ATTR, "true");
    style.textContent = `
html[${INSPECT_ATTR}="true"],
html[${INSPECT_ATTR}="true"] body {
    user-select: none !important;
    -webkit-user-select: none !important;
}
html[${INSPECT_ATTR}="true"] * {
    cursor: crosshair !important;
}
#${INSPECT_OVERLAY_ID} {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483647;
}
#${INSPECT_OVERLAY_ID} .flash-app-inspect-box {
    position: fixed;
    box-sizing: border-box;
    display: none;
    border-radius: 0;
    background: rgba(52, 152, 219, 0.08);
}
#${INSPECT_OVERLAY_ID} .flash-app-inspect-box.is-hover {
    border: 1px dashed rgba(52, 152, 219, 0.95);
}
#${INSPECT_OVERLAY_ID} .flash-app-inspect-box.is-selected {
    border: 2px solid #9797FC;
}
#${INSPECT_OVERLAY_ID} .flash-app-inspect-label {
    position: fixed;
    display: none;
    width: 3.5rem;
    height: 1.375rem;
    background: #7070FF;
    border-radius: 0.25rem;
    align-items: center;
    justify-content: center;
    gap: 0.125rem;
    color: #fff;
    font-size: 0.625rem;
    font-weight: 500;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
    white-space: nowrap;
}
#${INSPECT_OVERLAY_ID} .flash-app-inspect-label img {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
}
#${INSPECT_OVERLAY_ID} .flash-app-inspect-label.is-web-label {
    width: 36px;
    height: 24px;
    background: #9797FC;
    border-radius: 6px;
    gap: 0;
    font-size: 12px;
}
#${INSPECT_OVERLAY_ID} .flash-app-inspect-label.is-web-label img {
    display: none;
}
`;
    document.head.appendChild(style);
  };
  const ensureOverlay = () => {
    if (overlay && document.body.contains(overlay.root)) {
      return overlay;
    }
    if (!document.body) {
      return null;
    }
    ensureInspectStyle();
    const existingRoot = document.getElementById(INSPECT_OVERLAY_ID);
    if (existingRoot instanceof HTMLDivElement) {
      const hoverBox2 = existingRoot.querySelector(".flash-app-inspect-box.is-hover");
      const selectedBox2 = existingRoot.querySelector(".flash-app-inspect-box.is-selected");
      const selectedLabel2 = existingRoot.querySelector(".flash-app-inspect-label");
      if (hoverBox2 instanceof HTMLDivElement && selectedBox2 instanceof HTMLDivElement && selectedLabel2 instanceof HTMLDivElement) {
        overlay = { root: existingRoot, hoverBox: hoverBox2, selectedBox: selectedBox2, selectedLabel: selectedLabel2 };
        return overlay;
      }
      existingRoot.remove();
    }
    const root = document.createElement("div");
    const hoverBox = document.createElement("div");
    const selectedBox = document.createElement("div");
    const selectedLabel = document.createElement("div");
    root.id = INSPECT_OVERLAY_ID;
    root.setAttribute(INSPECT_IGNORE_ATTR, "true");
    hoverBox.setAttribute(INSPECT_IGNORE_ATTR, "true");
    selectedBox.setAttribute(INSPECT_IGNORE_ATTR, "true");
    selectedLabel.setAttribute(INSPECT_IGNORE_ATTR, "true");
    hoverBox.className = "flash-app-inspect-box is-hover";
    selectedBox.className = "flash-app-inspect-box is-selected";
    selectedLabel.className = "flash-app-inspect-label";
    const isInspectMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|HarmonyOS/i.test(navigator.userAgent || "");
    if (isInspectMobile) {
      selectedLabel.classList.remove("is-web-label");
      const labelIcon = document.createElement("img");
      labelIcon.src = "https://mdn.alipayobjects.com/huamei_mrdrkc/afts/img/MyIgSqfeBVMAAAAAQEAAAAgADnRDAQFr/original";
      labelIcon.alt = "";
      const labelText = document.createElement("span");
      labelText.textContent = "区域";
      selectedLabel.appendChild(labelIcon);
      selectedLabel.appendChild(labelText);
    } else {
      selectedLabel.classList.add("is-web-label");
      selectedLabel.style.marginTop = "-0.2rem";
      const labelText = document.createElement("span");
      labelText.textContent = "区域";
      selectedLabel.appendChild(labelText);
    }
    root.appendChild(hoverBox);
    root.appendChild(selectedBox);
    root.appendChild(selectedLabel);
    document.body.appendChild(root);
    overlay = { root, hoverBox, selectedBox, selectedLabel };
    return overlay;
  };
  const hideOverlayElement = (element) => {
    element.style.display = "none";
  };
  const renderBox = (box, target) => {
    if (!target || !isMeaningfulElement(target)) {
      hideOverlayElement(box);
      return;
    }
    const rect = target.getBoundingClientRect();
    box.style.display = "block";
    box.style.left = `${Math.max(0, rect.left)}px`;
    box.style.top = `${Math.max(0, rect.top)}px`;
    box.style.width = `${Math.max(0, rect.width)}px`;
    box.style.height = `${Math.max(0, rect.height)}px`;
  };
  const updateOverlay = () => {
    console.log("[INSPECT] updateOverlay called");
    const elements = ensureOverlay();
    if (!elements) {
      console.log("[INSPECT] ensureOverlay returned null");
      return;
    }
    renderBox(elements.hoverBox, hoverTarget);
    renderBox(elements.selectedBox, selectedTarget);
    console.log("[INSPECT] selectedTarget:", selectedTarget);
    if (selectedTarget && isMeaningfulElement(selectedTarget)) {
      const rect = selectedTarget.getBoundingClientRect();
      const isWebLabel = elements.selectedLabel.classList.contains("is-web-label");
      if (isWebLabel) {
        const LABEL_HEIGHT = 24;
        elements.selectedLabel.style.display = "flex";
        elements.selectedLabel.style.left = `${Math.max(0, rect.left)}px`;
        elements.selectedLabel.style.top = `${Math.max(0, rect.top) - LABEL_HEIGHT}px`;
      } else {
        const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const LABEL_WIDTH = 3.5 * remSize;
        const LABEL_HEIGHT = 1.375 * remSize;
        const PADDING = 8;
        if (rect.width < LABEL_WIDTH + PADDING || rect.height < LABEL_HEIGHT + PADDING) {
          hideOverlayElement(elements.selectedLabel);
          return;
        }
        elements.selectedLabel.style.display = "flex";
        elements.selectedLabel.style.left = `${Math.max(0, rect.left) + 4}px`;
        elements.selectedLabel.style.top = `${Math.max(0, rect.top) + 4}px`;
      }
    } else {
      hideOverlayElement(elements.selectedLabel);
    }
  };
  const stopEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if ("stopImmediatePropagation" in event) {
      event.stopImmediatePropagation();
    }
  };
  const getEventPoint = (event) => {
    var _a, _b;
    const touchEvent = event;
    const changedTouch = (_a = touchEvent.changedTouches) == null ? void 0 : _a[0];
    if (changedTouch) {
      return {
        x: changedTouch.clientX,
        y: changedTouch.clientY
      };
    }
    const touch = (_b = touchEvent.touches) == null ? void 0 : _b[0];
    if (touch) {
      return {
        x: touch.clientX,
        y: touch.clientY
      };
    }
    const pointerEvent = event;
    if (typeof pointerEvent.clientX === "number" && typeof pointerEvent.clientY === "number") {
      return {
        x: pointerEvent.clientX,
        y: pointerEvent.clientY
      };
    }
    return null;
  };
  const getRawTargetFromPoint = (point) => {
    if (!point) {
      return null;
    }
    const pointTarget = document.elementFromPoint(point.x, point.y);
    if (pointTarget && !isIgnoredElement(pointTarget)) {
      return pointTarget;
    }
    return null;
  };
  const getRawTargetFromEvent = (event, preferPoint = false) => {
    const pointTarget = getRawTargetFromPoint(getEventPoint(event));
    if (preferPoint && pointTarget) {
      return pointTarget;
    }
    const target = event.target;
    if (target instanceof Element && !isIgnoredElement(target)) {
      return target;
    }
    return pointTarget;
  };
  const isTapLikeInteraction = (point) => {
    if (!(gestureState == null ? void 0 : gestureState.startPoint) || !point) {
      return true;
    }
    return Math.abs(point.x - gestureState.startPoint.x) <= TAP_MOVE_THRESHOLD_PX && Math.abs(point.y - gestureState.startPoint.y) <= TAP_MOVE_THRESHOLD_PX;
  };
  const hasRecentSelection = (selector, point) => {
    if (!recentSelection) {
      return false;
    }
    if (Date.now() - recentSelection.timestamp > RECENT_SELECTION_WINDOW_MS) {
      recentSelection = null;
      return false;
    }
    if (recentSelection.selector === selector) {
      return true;
    }
    if (!recentSelection.point || !point) {
      return false;
    }
    return Math.abs(recentSelection.point.x - point.x) <= 6 && Math.abs(recentSelection.point.y - point.y) <= 6;
  };
  const commitSelection = (rawTarget, point) => {
    console.log("[INSPECT] commitSelection called, rawTarget:", rawTarget);
    const normalized = normalizeTarget(rawTarget);
    console.log("[INSPECT] normalized.element:", normalized.element);
    if (!normalized.element) {
      return;
    }
    const selector = buildSelector(normalized.element);
    if (hasRecentSelection(selector, point)) {
      return;
    }
    selectedTarget = normalized.element;
    hoverTarget = normalized.element;
    updateOverlay();
    recentSelection = {
      point,
      selector,
      timestamp: Date.now()
    };
    const rect = buildRect(normalized.element);
    const payload = buildPickResult(normalized.element, rawTarget, rect);
    const elements = [
      {
        rect,
        payload
      }
    ];
    window.parent.postMessage(
      {
        type: FLASH_APP_INSPECT_RESULT,
        elements
      },
      "*"
    );
  };
  const handlePointerMove = (event) => {
    if (!enabled) {
      return;
    }
    const rawTarget = getRawTargetFromEvent(event, true);
    const normalized = normalizeTarget(rawTarget);
    hoverTarget = normalized.element;
    updateOverlay();
  };
  const handleBlockedPointerDown = (event) => {
    if (!enabled) {
      return;
    }
    stopEvent(event);
    const rawTarget = getRawTargetFromEvent(event, true);
    const normalized = normalizeTarget(rawTarget);
    gestureState = {
      startPoint: getEventPoint(event)
    };
    hoverTarget = normalized.element;
    updateOverlay();
    blurEditableFieldState(rawTarget);
  };
  const handlePointerUp = (event) => {
    if (!enabled) {
      return;
    }
    stopEvent(event);
    const point = getEventPoint(event);
    const rawTarget = getRawTargetFromEvent(event, true);
    blurEditableFieldState(rawTarget);
    if (!isTapLikeInteraction(point)) {
      gestureState = null;
      return;
    }
    commitSelection(rawTarget, point);
    gestureState = null;
  };
  const handleClick = (event) => {
    if (!enabled) {
      return;
    }
    stopEvent(event);
    const point = getEventPoint(event);
    const rawTarget = getRawTargetFromEvent(event, true);
    blurEditableFieldState(rawTarget);
    commitSelection(rawTarget, point);
  };
  const handleBlockedEvent = (event) => {
    if (!enabled) {
      return;
    }
    stopEvent(event);
    blurEditableFieldState(getRawTargetFromEvent(event));
  };
  const handleFocusIn = (event) => {
    if (!enabled) {
      return;
    }
    const rawTarget = getRawTargetFromEvent(event);
    if (!getEditableFieldTarget(rawTarget) && !getEditableFieldTarget(document.activeElement instanceof Element ? document.activeElement : null)) {
      return;
    }
    stopEvent(event);
    blurEditableFieldState(rawTarget);
  };
  const handleViewportChange = () => {
    if (!enabled) {
      return;
    }
    updateOverlay();
  };
  const getInspectListenerOptions = (eventName) => {
    if (eventName === "pointermove" || eventName === "scroll" || eventName === "resize") {
      return { capture: true, passive: true };
    }
    return { capture: true, passive: false };
  };
  const eventHandlerMap = {
    pointermove: handlePointerMove,
    pointerdown: handleBlockedPointerDown,
    pointerup: handlePointerUp,
    mousedown: handleBlockedPointerDown,
    mouseup: handlePointerUp,
    touchstart: handleBlockedPointerDown,
    touchend: handlePointerUp,
    click: handleClick,
    dblclick: handleBlockedEvent,
    contextmenu: handleBlockedEvent,
    submit: handleBlockedEvent,
    focusin: handleFocusIn,
    scroll: handleViewportChange,
    resize: handleViewportChange
  };
  const enableInspectMode = () => {
    console.log("[FLASH APP][INSPECT] enableInspectMode 被调用, 当前 enabled=", enabled);
    if (enabled) {
      updateOverlay();
      return;
    }
    enabled = true;
    document.documentElement.setAttribute(INSPECT_ATTR, "true");
    blurEditableFieldState();
    ensureOverlay();
    trackedEvents.forEach((eventName) => {
      window.addEventListener(eventName, eventHandlerMap[eventName], getInspectListenerOptions(eventName));
    });
    updateOverlay();
  };
  const disableInspectMode = () => {
    console.log("[FLASH APP][INSPECT] disableInspectMode 被调用, 当前 enabled=", enabled);
    if (!enabled) {
      return;
    }
    enabled = false;
    hoverTarget = null;
    selectedTarget = null;
    gestureState = null;
    recentSelection = null;
    trackedEvents.forEach((eventName) => {
      window.removeEventListener(eventName, eventHandlerMap[eventName], getInspectListenerOptions(eventName));
    });
    document.documentElement.removeAttribute(INSPECT_ATTR);
    if (overlay == null ? void 0 : overlay.root) {
      overlay.root.remove();
    }
    overlay = null;
  };
  const clearInspectSelection = () => {
    console.log("[FLASH APP][INSPECT] clearInspectSelection 被调用");
    hoverTarget = null;
    selectedTarget = null;
    recentSelection = null;
    updateOverlay();
  };
  window.addEventListener("message", function(event) {
    const eventData = toRecordValue(event.data);
    if (eventData.type !== FLASH_APP_INSPECT_MODE_TOGGLE) {
      return;
    }
    console.log("[FLASH APP][INSPECT] 收到 FLASH_APP_INSPECT_MODE_TOGGLE 消息, action=", eventData.action);
    if (eventData.action === "enable") {
      enableInspectMode();
      return;
    }
    if (eventData.action === "disable") {
      disableInspectMode();
      return;
    }
    if (eventData.action === "clear") {
      clearInspectSelection();
      return;
    }
  });
})();
(function() {
  let scriptLoadPromise = null;
  async function loadMap() {
    console.log("[FLASH APP] 开始加载高德地图");
    const key = "c5f677b8240a4373f5181e5a29233d1b";
    const securityJsCode = "6bdbf6986797b2349af39c13d27861d9";
    const version = "2.3.5.4";
    window._AMapSecurityConfig = {
      securityJsCode
    };
    console.log("[FLASH APP] 已设置高德地图安全配置");
    console.log("[FLASH APP] 检查并确保脚本已加载");
    await ensureScriptLoaded();
    console.log("[FLASH APP] 脚本加载完成");
    console.log("[FLASH APP] 等待 AMapLoader 可用");
    await waitForAMapLoader();
    console.log("[FLASH APP] AMapLoader 已可用");
    console.log("[FLASH APP] 调用 AMapLoader.load，版本:", version);
    try {
      if (!window.AMapLoader) {
        throw new Error("AMapLoader is not available");
      }
      const result = await window.AMapLoader.load({
        key,
        version
      });
      console.log("[FLASH APP] 高德地图加载成功");
      return result;
    } catch (error) {
      console.log("[FLASH APP] 高德地图加载失败:", error);
      throw error;
    }
  }
  function ensureScriptLoaded() {
    if (window.AMapLoader && typeof window.AMapLoader.load === "function") {
      console.log("[FLASH APP] 脚本已存在且 AMapLoader 可用，跳过加载");
      return Promise.resolve();
    }
    if (scriptLoadPromise) {
      console.log("[FLASH APP] 脚本正在加载中，等待现有加载完成");
      return scriptLoadPromise;
    }
    const scriptId = "amap-loader-script";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      console.log("[FLASH APP] 脚本标签已存在，等待 AMapLoader 可用");
      scriptLoadPromise = waitForAMapLoader().then(() => {
        scriptLoadPromise = null;
      });
      return scriptLoadPromise;
    }
    console.log("[FLASH APP] 开始创建并加载高德地图脚本");
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = new URL("../../../../../webapi.amap.com/loader.js", import.meta.url).href;
      script.async = true;
      script.onload = () => {
        console.log("[FLASH APP] 脚本文件加载成功，等待 AMapLoader 初始化");
        waitForAMapLoader().then(() => {
          console.log("[FLASH APP] AMapLoader 初始化完成");
          scriptLoadPromise = null;
          resolve();
        }).catch((e) => {
          console.log("[FLASH APP] AMapLoader 初始化失败:", e);
          scriptLoadPromise = null;
          reject(e instanceof Error ? e : new Error(getErrorMessage(e, "[FLASH APP] AMapLoader 初始化失败")));
        });
      };
      script.onerror = () => {
        console.log("[FLASH APP] 脚本文件加载失败");
        scriptLoadPromise = null;
        reject(new Error("[FLASH APP] 高德地图脚本加载失败"));
      };
      document.head.appendChild(script);
    });
    return scriptLoadPromise;
  }
  function waitForAMapLoader() {
    return new Promise((resolve, reject) => {
      if (window.AMapLoader && typeof window.AMapLoader.load === "function") {
        console.log("[FLASH APP] AMapLoader 已可用，无需等待");
        resolve();
        return;
      }
      console.log("[FLASH APP] 开始轮询等待 AMapLoader 可用（最多等待 10 秒）");
      let attempts = 0;
      const maxAttempts = 100;
      const interval = 100;
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.AMapLoader && typeof window.AMapLoader.load === "function") {
          clearInterval(checkInterval);
          console.log("[FLASH APP] AMapLoader 已可用，等待了", attempts * interval, "ms");
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.log("[FLASH APP] 等待 AMapLoader 超时，已尝试", attempts, "次");
          reject(new Error("[FLASH APP] 等待 AMapLoader 超时"));
        }
      }, interval);
    });
  }
  window.loadMap = loadMap;
})();
(function() {
  if (window._clickLoggerInitialized) {
    return;
  }
  window._clickLoggerInitialized = true;
  if (!window._flashAppSessionId) {
    window._flashAppSessionId = "flash-app-session-" + Date.now();
  }
  const sessionId = window._flashAppSessionId;
  const sessionStartAt = Date.now();
  let firstInteractionAt;
  let lastInteractionAt;
  const INPUT_THROTTLE_WINDOW_MS = 1e3;
  const MAX_TEXT_SUMMARY_LENGTH = 120;
  const MAX_TEXT_SUMMARY_CHILDREN = 8;
  const TOUCH_MIN_DISTANCE_PX = 10;
  const TOUCH_MIN_DURATION_MS = 50;
  const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100];
  const editableSelector = 'input:not([type="hidden"]),textarea,select,[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"]';
  const semanticTargetSelector = `button,a,input,textarea,select,label,summary,[role],[aria-label],[name],[data-testid],${editableSelector}`;
  const inputStates = /* @__PURE__ */ new WeakMap();
  const reportedScrollDepthsByElement = /* @__PURE__ */ new WeakMap();
  const lastScrollTopByElement = /* @__PURE__ */ new WeakMap();
  let touchGestureState = null;
  let pagehideReported = false;
  const markInteraction = (timestamp) => {
    if (firstInteractionAt === void 0) {
      firstInteractionAt = timestamp;
    }
    lastInteractionAt = timestamp;
  };
  const buildBaseLog = (type, timestamp = Date.now()) => {
    const logData = {
      type,
      timestamp,
      artifactId: window.artifactId || "",
      artifactVersion: window.artifactVersion || "",
      sessionId
    };
    if (window.trace_id) {
      logData.traceId = window.trace_id;
    }
    return logData;
  };
  const reportBehaviorLog = (logData, label) => {
    console.log(`[FLASH APP] ${label}`, logData);
    try {
      void window.lingguang.monitor.event({
        rawLog: JSON.stringify(logData)
      }).catch((error) => {
        console.log(`[FLASH APP] ${label}上报失败`, error);
      });
    } catch (e) {
      console.log(`[FLASH APP] ${label}上报异常`, e);
    }
  };
  const escapeCssIdentifier = (value) => {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return value.replace(/[^a-zA-Z0-9_-]/g, (match) => `\\${match}`);
  };
  const escapeCssString = (value) => {
    return value.replace(/["\\\n\r\f]/g, (match) => {
      switch (match) {
        case '"':
          return '\\"';
        case "\\":
          return "\\\\";
        case "\n":
          return "\\a ";
        case "\r":
          return "\\d ";
        case "\f":
          return "\\c ";
        default:
          return match;
      }
    });
  };
  const collapseWhitespace = (value) => {
    return value.replace(/\s+/g, " ").trim();
  };
  const hashString = (value) => {
    const normalized = collapseWhitespace(value);
    if (!normalized) {
      return void 0;
    }
    let hash = 0;
    for (let i = 0; i < normalized.length; i += 1) {
      hash = (hash << 5) - hash + normalized.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  };
  const shouldSummarizeText = (element, text) => {
    if (!text || text.length > MAX_TEXT_SUMMARY_LENGTH || element.childElementCount > MAX_TEXT_SUMMARY_CHILDREN) {
      return false;
    }
    const tagName = element.tagName.toLowerCase();
    if (["button", "a", "label", "summary", "option"].includes(tagName)) {
      return true;
    }
    return element.hasAttribute("data-testid") || element.hasAttribute("role") || element.hasAttribute("aria-label");
  };
  const getEventElement = (target) => {
    if (target instanceof Element) {
      return target;
    }
    if (target instanceof Node) {
      return target.parentElement;
    }
    return null;
  };
  const findClosestWithAttribute = (element, attributeName) => {
    let current = element;
    while (current && current !== document.documentElement) {
      const value = current.getAttribute(attributeName);
      if (value) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  };
  const getSemanticTargetElement = (element) => {
    if (!element) {
      return null;
    }
    return element.closest(semanticTargetSelector) || element;
  };
  const buildShortSelectorPart = (element) => {
    const tagName = element.tagName.toLowerCase();
    const testId = element.getAttribute("data-testid");
    if (testId) {
      return `${tagName}[data-testid="${escapeCssString(testId)}"]`;
    }
    const id = element.getAttribute("id");
    if (id) {
      return `#${escapeCssIdentifier(id)}`;
    }
    const role = element.getAttribute("role");
    if (role) {
      return `${tagName}[role="${escapeCssString(role)}"]`;
    }
    const name = element.getAttribute("name");
    if (name) {
      return `${tagName}[name="${escapeCssString(name)}"]`;
    }
    const className = typeof element.className === "string" ? collapseWhitespace(element.className) : "";
    const stableClass = className.split(" ").filter(Boolean).filter((classItem) => !/^\d/.test(classItem)).slice(0, 2).map((classItem) => `.${escapeCssIdentifier(classItem)}`).join("");
    const base = stableClass ? `${tagName}${stableClass}` : tagName;
    const parent = element.parentElement;
    if (!parent) {
      return base;
    }
    const siblings = Array.from(parent.children).filter((child) => child.tagName === element.tagName);
    if (siblings.length <= 1) {
      return base;
    }
    return `${base}:nth-of-type(${siblings.indexOf(element) + 1})`;
  };
  const buildShortDomSelector = (element) => {
    const parts = [];
    let current = element;
    let depth = 0;
    while (current && current !== document.documentElement && depth < 5) {
      const part = buildShortSelectorPart(current);
      parts.unshift(part);
      if (part.startsWith("#") || part.includes("[data-testid=")) {
        break;
      }
      current = current.parentElement;
      depth += 1;
    }
    return parts.join(" > ");
  };
  const buildAnchorSelectorPart = (element) => {
    const tagName = element.tagName.toLowerCase();
    const testId = element.getAttribute("data-testid");
    if (testId) {
      return `[data-testid="${escapeCssString(testId)}"]`;
    }
    const id = element.getAttribute("id");
    if (id) {
      return `#${escapeCssIdentifier(id)}`;
    }
    const role = element.getAttribute("role");
    if (role) {
      return `${tagName}[role="${escapeCssString(role)}"]`;
    }
    const ariaLabel = element.getAttribute("aria-label");
    if (ariaLabel) {
      return `${tagName}[aria-label="${escapeCssString(ariaLabel)}"]`;
    }
    const name = element.getAttribute("name");
    if (name) {
      return `${tagName}[name="${escapeCssString(name)}"]`;
    }
    return buildShortSelectorPart(element);
  };
  const findStableSelectorAnchor = (element) => {
    return findClosestWithAttribute(element, "data-testid") || findClosestWithAttribute(element, "id") || findClosestWithAttribute(element, "role") || findClosestWithAttribute(element, "aria-label") || findClosestWithAttribute(element, "name");
  };
  const buildSelectorFromAnchor = (anchor, element) => {
    const parts = [buildAnchorSelectorPart(anchor)];
    const descendants = [];
    let current = element;
    while (current && current !== anchor) {
      descendants.unshift(current);
      current = current.parentElement;
    }
    descendants.forEach((descendant) => {
      parts.push(buildShortSelectorPart(descendant));
    });
    return parts.join(" > ");
  };
  const buildStableSelector = (element) => {
    if (!element) {
      return {};
    }
    const anchor = findStableSelectorAnchor(element);
    const selector = anchor ? buildSelectorFromAnchor(anchor, element) : buildShortDomSelector(element);
    let selectorUnique = false;
    try {
      selectorUnique = !!selector && document.querySelectorAll(selector).length === 1;
    } catch (e) {
      selectorUnique = false;
    }
    return { selector, selectorUnique };
  };
  const buildTargetMeta = (element) => {
    const semanticElement = getSemanticTargetElement(element);
    if (!semanticElement) {
      return {};
    }
    const selectorInfo = buildStableSelector(semanticElement);
    const dataTestIdElement = findClosestWithAttribute(semanticElement, "data-testid");
    const className = typeof semanticElement.className === "string" ? collapseWhitespace(semanticElement.className) : void 0;
    const text = collapseWhitespace(semanticElement.textContent || "");
    const target = {
      tagName: semanticElement.tagName.toLowerCase(),
      dataTestId: (dataTestIdElement == null ? void 0 : dataTestIdElement.getAttribute("data-testid")) || void 0,
      role: semanticElement.getAttribute("role") || void 0,
      ariaLabel: semanticElement.getAttribute("aria-label") || void 0,
      id: semanticElement.getAttribute("id") || void 0,
      className: className || void 0,
      name: semanticElement.getAttribute("name") || void 0,
      selector: selectorInfo.selector,
      selectorUnique: selectorInfo.selectorUnique
    };
    if (semanticElement instanceof HTMLInputElement) {
      target.inputType = semanticElement.type || void 0;
      target.placeholderHash = hashString(semanticElement.placeholder || "");
    } else if (semanticElement instanceof HTMLTextAreaElement) {
      target.inputType = "textarea";
      target.placeholderHash = hashString(semanticElement.placeholder || "");
    }
    if (shouldSummarizeText(semanticElement, text)) {
      target.textHash = hashString(text);
      target.textLength = text.length;
    }
    return target;
  };
  const getInputValueMeta = (element) => {
    if (element instanceof HTMLInputElement) {
      if (element.type === "checkbox" || element.type === "radio") {
        return {
          checked: element.checked,
          empty: false
        };
      }
      return {
        length: element.value.length,
        empty: element.value.length === 0
      };
    }
    if (element instanceof HTMLTextAreaElement) {
      return {
        length: element.value.length,
        empty: element.value.length === 0
      };
    }
    if (element instanceof HTMLSelectElement) {
      return {
        length: element.value.length,
        empty: element.value.length === 0
      };
    }
    if (element instanceof HTMLElement && element.isContentEditable) {
      const length = (element.textContent || "").length;
      return {
        length,
        empty: length === 0
      };
    }
    return {};
  };
  const getInputLength = (element) => {
    const valueMeta = getInputValueMeta(element);
    return typeof valueMeta.length === "number" ? valueMeta.length : 0;
  };
  const shouldHandleTextInputEvent = (element) => {
    if (element instanceof HTMLTextAreaElement) {
      return true;
    }
    if (element instanceof HTMLSelectElement) {
      return false;
    }
    if (element instanceof HTMLInputElement) {
      return !["checkbox", "radio", "button", "submit", "reset", "file", "image", "hidden"].includes(element.type);
    }
    return element instanceof HTMLElement && element.isContentEditable;
  };
  const buildElementLog = (type, element, timestamp = Date.now()) => {
    return __spreadProps(__spreadValues({}, buildBaseLog(type, timestamp)), {
      target: buildTargetMeta(element)
    });
  };
  const logLoadSuccess = () => {
    const logData = buildBaseLog("flash-app-use-load");
    reportBehaviorLog(logData, "[加载日志] 加载成功日志");
  };
  const logPageLifecycle = (type, data = {}) => {
    const timestamp = Date.now();
    const logData = __spreadValues(__spreadProps(__spreadValues({}, buildBaseLog(type, timestamp)), {
      durationMs: timestamp - sessionStartAt,
      firstInteractionAt,
      lastInteractionAt
    }), data);
    reportBehaviorLog(logData, type === "flash-app-use-pagehide" ? "[生命周期日志] 页面隐藏日志" : "[生命周期日志] 可见性变化日志");
  };
  const logClick = (event) => {
    const timestamp = Date.now();
    markInteraction(timestamp);
    const element = getEventElement(event.target);
    const logData = __spreadProps(__spreadValues({}, buildElementLog("flash-app-use-click", element, timestamp)), {
      position: event instanceof MouseEvent ? {
        clientX: event.clientX,
        clientY: event.clientY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      } : void 0
    });
    reportBehaviorLog(logData, "点击日志");
  };
  const getEditableElement = (target) => {
    const element = getEventElement(target);
    if (!element) {
      return null;
    }
    if (element.matches(editableSelector)) {
      return element;
    }
    return element.closest(editableSelector);
  };
  const logInputEvent = (type, element, extra = {}) => {
    const timestamp = Date.now();
    markInteraction(timestamp);
    const logData = __spreadValues(__spreadProps(__spreadValues({}, buildElementLog(type, element, timestamp)), {
      valueMeta: getInputValueMeta(element)
    }), extra);
    reportBehaviorLog(logData, "输入日志");
  };
  function handleGlobalClick(event) {
    logClick(event);
  }
  function handleWindowLoad() {
    logLoadSuccess();
  }
  const handleFocusIn = (event) => {
    const element = getEditableElement(event.target);
    if (!element) {
      return;
    }
    const timestamp = Date.now();
    markInteraction(timestamp);
    inputStates.set(element, {
      focusAt: timestamp,
      initialLength: getInputLength(element),
      lastReportedLength: getInputLength(element),
      lastInputReportAt: 0
    });
    const logData = __spreadProps(__spreadValues({}, buildElementLog("flash-app-input-focus", element, timestamp)), {
      valueMeta: getInputValueMeta(element)
    });
    reportBehaviorLog(logData, "输入日志");
  };
  const handleInput = (event) => {
    const element = getEditableElement(event.target);
    if (!element || !shouldHandleTextInputEvent(element)) {
      return;
    }
    const timestamp = Date.now();
    const currentLength = getInputLength(element);
    const state = inputStates.get(element) || {
      focusAt: timestamp,
      initialLength: currentLength,
      lastReportedLength: currentLength,
      lastInputReportAt: 0
    };
    const changedLength = currentLength - state.lastReportedLength;
    inputStates.set(element, state);
    if (timestamp - state.lastInputReportAt < INPUT_THROTTLE_WINDOW_MS) {
      return;
    }
    state.lastInputReportAt = timestamp;
    state.lastReportedLength = currentLength;
    markInteraction(timestamp);
    const logData = __spreadProps(__spreadValues({}, buildElementLog("flash-app-input-change", element, timestamp)), {
      phase: "typing",
      valueMeta: __spreadProps(__spreadValues({}, getInputValueMeta(element)), {
        changedLength
      })
    });
    reportBehaviorLog(logData, "输入日志");
  };
  const handleChange = (event) => {
    const element = getEditableElement(event.target);
    if (!element) {
      return;
    }
    if (!(element instanceof HTMLSelectElement) && !(element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio"))) {
      return;
    }
    logInputEvent("flash-app-input-change", element, { phase: "change" });
  };
  const handleFocusOut = (event) => {
    const element = getEditableElement(event.target);
    if (!element) {
      return;
    }
    const timestamp = Date.now();
    markInteraction(timestamp);
    const currentLength = getInputLength(element);
    const state = inputStates.get(element);
    const logData = __spreadProps(__spreadValues({}, buildElementLog("flash-app-input-blur", element, timestamp)), {
      phase: "complete",
      valueMeta: __spreadProps(__spreadValues({}, getInputValueMeta(element)), {
        totalChangedLength: state ? currentLength - state.initialLength : void 0,
        durationMs: state ? timestamp - state.focusAt : void 0
      })
    });
    reportBehaviorLog(logData, "输入日志");
    inputStates.delete(element);
  };
  const handleSubmit = (event) => {
    const element = getEventElement(event.target);
    const form = element instanceof HTMLFormElement ? element : (element == null ? void 0 : element.closest("form")) || null;
    const timestamp = Date.now();
    markInteraction(timestamp);
    const logData = buildElementLog("flash-app-form-submit", form, timestamp);
    reportBehaviorLog(logData, "表单日志");
  };
  const handleVisibilityChange = () => {
    logPageLifecycle("flash-app-use-visibility-change", {
      visibilityState: document.visibilityState
    });
  };
  const handlePagehide = (event) => {
    if (pagehideReported) {
      return;
    }
    pagehideReported = true;
    logPageLifecycle("flash-app-use-pagehide", {
      visibilityState: document.visibilityState,
      persisted: event.persisted
    });
  };
  const getScrollElementFromEvent = (event) => {
    const target = event == null ? void 0 : event.target;
    if (target instanceof Element && target !== document.documentElement && target.scrollHeight > target.clientHeight) {
      return target;
    }
    return document.scrollingElement || document.documentElement;
  };
  const handleScroll = (event) => {
    const scrollElement = getScrollElementFromEvent(event);
    const isDocumentScroll = scrollElement === document.scrollingElement || scrollElement === document.documentElement || scrollElement === document.body;
    const viewportHeight = isDocumentScroll ? window.innerHeight || document.documentElement.clientHeight : scrollElement.clientHeight;
    const scrollHeight = scrollElement.scrollHeight;
    const scrollTop = scrollElement.scrollTop;
    const maxScrollable = scrollHeight - viewportHeight;
    if (maxScrollable <= 0) {
      return;
    }
    const currentPercent = Math.min(100, Math.max(0, Math.round(scrollTop / maxScrollable * 100)));
    const lastScrollTop = lastScrollTopByElement.get(scrollElement) || 0;
    const direction = scrollTop >= lastScrollTop ? "down" : "up";
    lastScrollTopByElement.set(scrollElement, scrollTop);
    let reportedScrollDepths = reportedScrollDepthsByElement.get(scrollElement);
    if (!reportedScrollDepths) {
      reportedScrollDepths = /* @__PURE__ */ new Set();
      reportedScrollDepthsByElement.set(scrollElement, reportedScrollDepths);
    }
    SCROLL_DEPTH_THRESHOLDS.forEach((threshold) => {
      if (currentPercent < threshold || reportedScrollDepths.has(threshold)) {
        return;
      }
      reportedScrollDepths.add(threshold);
      const timestamp = Date.now();
      markInteraction(timestamp);
      const logData = __spreadProps(__spreadValues({}, buildBaseLog("flash-app-scroll-depth", timestamp)), {
        maxScrollPercent: threshold,
        direction,
        scrollTop,
        scrollHeight,
        viewportHeight
      });
      reportBehaviorLog(logData, "滚动日志");
    });
  };
  const getTouchArea = (x, y) => {
    const horizontal = x < window.innerWidth / 3 ? "left" : x > window.innerWidth / 3 * 2 ? "right" : "center";
    const vertical = y < window.innerHeight / 3 ? "top" : y > window.innerHeight / 3 * 2 ? "bottom" : "middle";
    return `${vertical}-${horizontal}`;
  };
  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    touchGestureState = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      lastX: touch.clientX,
      lastY: touch.clientY
    };
  };
  const handleTouchMove = (event) => {
    if (!touchGestureState) {
      return;
    }
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    touchGestureState.lastX = touch.clientX;
    touchGestureState.lastY = touch.clientY;
  };
  const handleTouchEnd = (event) => {
    const state = touchGestureState;
    touchGestureState = null;
    if (!state) {
      return;
    }
    const touch = event.changedTouches[0];
    const endX = touch ? touch.clientX : state.lastX;
    const endY = touch ? touch.clientY : state.lastY;
    const timestamp = Date.now();
    const distanceX = endX - state.startX;
    const distanceY = endY - state.startY;
    const durationMs = timestamp - state.startTime;
    if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) < TOUCH_MIN_DISTANCE_PX || durationMs < TOUCH_MIN_DURATION_MS) {
      return;
    }
    const isHorizontal = Math.abs(distanceX) >= Math.abs(distanceY);
    const direction = isHorizontal ? distanceX > 0 ? "right" : "left" : distanceY > 0 ? "down" : "up";
    markInteraction(timestamp);
    const logData = __spreadProps(__spreadValues({}, buildBaseLog("flash-app-gesture", timestamp)), {
      gesture: Math.max(Math.abs(distanceX), Math.abs(distanceY)) >= 30 ? "swipe" : "drag",
      direction,
      distanceX,
      distanceY,
      durationMs,
      startArea: getTouchArea(state.startX, state.startY),
      endArea: getTouchArea(endX, endY)
    });
    reportBehaviorLog(logData, "手势日志");
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      document.addEventListener("click", handleGlobalClick, true);
      console.log("[FLASH APP] [点击日志] 全局点击监听器已初始化");
    });
  } else {
    document.addEventListener("click", handleGlobalClick, true);
    console.log("[FLASH APP] [点击日志] 全局点击监听器已初始化");
  }
  document.addEventListener("focusin", handleFocusIn, true);
  document.addEventListener("input", handleInput, true);
  document.addEventListener("change", handleChange, true);
  document.addEventListener("focusout", handleFocusOut, true);
  document.addEventListener("submit", handleSubmit, true);
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", handlePagehide);
  document.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true, capture: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true, capture: true });
  document.addEventListener("touchcancel", handleTouchEnd, { passive: true, capture: true });
  if (document.readyState === "complete") {
    logLoadSuccess();
    console.log("[FLASH APP] [加载日志] 页面已加载完成，立即上报加载成功日志");
  } else {
    window.addEventListener("load", handleWindowLoad);
    console.log("[FLASH APP] [加载日志] 已注册 window.load 事件监听器");
  }
})();
if (typeof document !== "undefined") {
  const keywords = ["习近平", "习大大", "中国国家主席", "习维尼"];
  document.addEventListener(
    "input",
    (e) => {
      const el = e.target;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLElement && el.isContentEditable) {
        const text = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.textContent || "";
        let next = text;
        for (const k of keywords) {
          if (!k) continue;
          if (next.includes(k)) {
            next = next.split(k).join("");
          }
        }
        if (next !== text) {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.value = next;
          } else {
            el.textContent = next;
          }
        }
      }
    },
    true
  );
}
(function() {
  if (window._errorHandlerInitialized) {
    return;
  }
  window._errorHandlerInitialized = true;
  async function sendErrorLog(errorInfo) {
    const logData = __spreadProps(__spreadValues({
      type: "flash-app-error"
    }, errorInfo), {
      timestamp: Date.now(),
      artifactId: window.artifactId || "",
      artifactVersion: window.artifactVersion || "",
      traceId: window.trace_id || "",
      sessionId: window._flashAppSessionId || ""
    });
    console.log("[FLASH APP] 错误日志", logData);
    try {
      const message = {
        type: "flash-app-error",
        payload: logData
      };
      window.parent.postMessage(message, "*");
    } catch (e) {
      console.log("[FLASH APP] 错误日志消息发送失败", e);
    }
    try {
      await window.lingguang.monitor.event({
        rawLog: JSON.stringify(logData)
      }).catch((error) => {
        console.log("[FLASH APP] 错误日志上报失败", error);
      });
    } catch (e) {
      console.log("[FLASH APP] 错误日志上报异常", e);
    }
  }
  window.addEventListener("error", function(event) {
    void sendErrorLog({
      message: event.message || "Unknown error",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: getErrorStack(event.error),
      errorType: "error"
    });
  });
  window.addEventListener("unhandledrejection", function(event) {
    const reason = event.reason;
    const reasonRecord = toRecordValue(reason);
    let message = "Unhandled promise rejection";
    const reasonMessage = toStringValue(reasonRecord.message);
    if (reasonMessage) {
      message = reasonMessage;
    } else if (typeof reason === "string") {
      message = reason;
    } else if (reason && typeof reason === "object") {
      try {
        message = JSON.stringify(reason);
      } catch (e) {
        message = "Unhandled promise rejection (non-serializable reason)";
      }
    }
    void sendErrorLog({
      message,
      stack: getErrorStack(reason),
      errorType: "unhandledrejection"
    });
  });
  console.log("[FLASH APP] 全局错误监听器已初始化");
})();
(() => {
  const opts = {
    enabled: true,
    pauseWhenHidden: true,
    resumeWhenVisible: true,
    // 只影响 WebAudio：visible 时是否 resume AudioContext
    debug: false,
    // 可选：对某些 URL 不生效，返回 true 则跳过
    // skipIf: (url) => /\/no-audio-guard\//.test(url),
    skipIf: null
  };
  const state = {
    audioContexts: /* @__PURE__ */ new Set(),
    mediaElements: /* @__PURE__ */ new Set(),
    pausedByGuard: /* @__PURE__ */ new Set(),
    pausing: false,
    resuming: false,
    installed: false
  };
  const log = (...a) => opts.debug && console.log("[AV_GUARD]", ...a);
  function shouldSkip() {
    if (typeof opts.skipIf === "function") {
      try {
        return !!opts.skipIf(String(location.href));
      } catch (e) {
      }
    }
    return false;
  }
  function pauseAllMediaElements() {
    const list = document.querySelectorAll("audio,video");
    state.pausedByGuard.clear();
    for (const m of list) {
      try {
        const isLiveStreamVideo = m instanceof HTMLVideoElement && m.srcObject instanceof MediaStream;
        if (!m.paused || isLiveStreamVideo) {
          state.pausedByGuard.add(m);
        }
        m.pause();
      } catch (e) {
      }
    }
    if (list.length) log("paused media elements:", list.length, "toResume:", state.pausedByGuard.size);
  }
  function trackMediaElement(el) {
    const media = el;
    if (media.__AV_GUARD_TRACKED__) return;
    media.__AV_GUARD_TRACKED__ = true;
    const add = () => state.mediaElements.add(el);
    const remove = () => state.mediaElements.delete(el);
    el.addEventListener("play", add);
    el.addEventListener("playing", add);
    el.addEventListener("pause", remove);
    el.addEventListener("ended", remove);
    el.addEventListener("abort", remove);
    el.addEventListener("emptied", remove);
    if (!el.paused) state.mediaElements.add(el);
  }
  function pauseTrackedMediaElements() {
    const list = Array.from(state.mediaElements);
    if (!list.length) return;
    for (const m of list) {
      try {
        const isLiveStreamVideo = m instanceof HTMLVideoElement && m.srcObject instanceof MediaStream;
        if (!m.paused || isLiveStreamVideo) {
          state.pausedByGuard.add(m);
        }
        m.pause();
      } catch (e) {
      }
    }
    log("paused tracked media elements:", list.length);
  }
  async function resumePausedMediaElements() {
    var _a;
    const wasPausedByGuard = new Set(state.pausedByGuard);
    state.pausedByGuard.clear();
    const allVideos = document.querySelectorAll("video");
    const liveStreamVideos = /* @__PURE__ */ new Set();
    for (const v of allVideos) {
      try {
        const stream = v.srcObject;
        if (stream instanceof MediaStream && v.paused) {
          liveStreamVideos.add(v);
        }
      } catch (e) {
      }
    }
    const toResume = /* @__PURE__ */ new Set([...wasPausedByGuard, ...liveStreamVideos]);
    if (!toResume.size) return;
    log("resuming media elements:", toResume.size, "fromGuard:", wasPausedByGuard.size, "liveStreamFallback:", liveStreamVideos.size);
    for (const m of toResume) {
      try {
        if (!m.paused) continue;
        if (m instanceof HTMLVideoElement && m.srcObject instanceof MediaStream) {
          const stream = m.srcObject;
          const hasDeadTrack = stream.getTracks().some((t) => t.readyState === "ended");
          if (hasDeadTrack) {
            const constraints = streamConstraintsMap.get(stream);
            if (constraints && ((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia)) {
              stream.getTracks().forEach((t) => {
                try {
                  t.stop();
                } catch (e) {
                }
              });
              try {
                const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                streamConstraintsMap.set(newStream, constraints);
                registerTrackedMediaStream(newStream);
                m.srcObject = newStream;
                void m.play().catch(() => {
                });
                log("recreated dead MediaStream for video element");
                continue;
              } catch (e) {
              }
            }
          }
        }
        if (m.src || m.srcObject || m.currentSrc) {
          void m.play().catch(() => {
          });
        }
      } catch (e) {
      }
    }
  }
  function hookAudioContext() {
    const win = window;
    const Native = win.AudioContext || win.webkitAudioContext;
    if (!Native) return;
    if (Native.__AV_GUARD_WRAPPED__) return;
    const WrappedAudioContext = function(...args) {
      const ctx = new Native(...args);
      state.audioContexts.add(ctx);
      log("AudioContext created:", ctx.state);
      const origClose = ctx.close.bind(ctx);
      ctx.close = async () => {
        state.audioContexts.delete(ctx);
        return origClose();
      };
      return ctx;
    };
    WrappedAudioContext.prototype = Native.prototype;
    WrappedAudioContext.__AV_GUARD_WRAPPED__ = true;
    if (win.AudioContext) win.AudioContext = WrappedAudioContext;
    if (win.webkitAudioContext) win.webkitAudioContext = WrappedAudioContext;
  }
  function hookAudioConstructor() {
    const win = window;
    const Native = win.Audio;
    if (!Native) return;
    if (Native.__AV_GUARD_WRAPPED__) return;
    const WrappedAudio = function(...args) {
      const el = new Native(...args);
      trackMediaElement(el);
      return el;
    };
    WrappedAudio.prototype = Native.prototype;
    WrappedAudio.__AV_GUARD_WRAPPED__ = true;
    win.Audio = WrappedAudio;
  }
  function pauseAll() {
    if (!opts.enabled || shouldSkip()) return;
    if (state.pausing) return;
    state.pausing = true;
    try {
      pauseAllMediaElements();
      pauseTrackedMediaElements();
    } finally {
      state.pausing = false;
    }
  }
  async function resumeAll() {
    if (!opts.enabled || shouldSkip()) return;
    if (!opts.resumeWhenVisible) return;
    if (state.resuming) return;
    state.resuming = true;
    try {
      await resumePausedMediaElements();
    } finally {
      state.resuming = false;
    }
  }
  function onVisibilityChange() {
    if (!opts.enabled || shouldSkip()) return;
    const hidden = document.hidden === true;
    log("visibilitychange:", { hidden, vis: document.visibilityState });
    console.log("app-loader visibilitychange");
    if (hidden) {
      if (opts.pauseWhenHidden) void pauseAll();
    } else {
      void resumeAll();
    }
  }
  function install() {
    if (state.installed) return;
    state.installed = true;
    hookAudioContext();
    hookAudioConstructor();
    document.addEventListener("visibilitychange", onVisibilityChange, true);
    window.addEventListener(
      "pagehide",
      () => {
        void pauseAll();
      },
      true
    );
    window.addEventListener(
      "pageshow",
      () => {
        void resumeAll();
      },
      true
    );
    if (document.hidden && opts.pauseWhenHidden) void pauseAll();
    log("installed");
  }
  Object.defineProperty(window, "__AV_GUARD__", {
    value: {
      pauseAll,
      resumeAll,
      setOptions: (o) => {
        if (o) Object.assign(opts, o);
      },
      getOptions: () => __spreadValues({}, opts),
      enable: () => {
        opts.enabled = true;
        onVisibilityChange();
      },
      disable: () => {
        opts.enabled = false;
      }
    },
    configurable: false,
    enumerable: false,
    writable: false
  });
  install();
})();
(function notifyAppShellBaseTailReady() {
  if (typeof window === "undefined" || window.parent === window) {
    return;
  }
  try {
    window.parent.postMessage(buildAppShellRuntimeMilestonePayload(FLASH_APP_BASE_TAIL_READY), "*");
  } catch (error) {
    console.log("[FLASH APP] 通知 app-shell base tail ready 失败", error);
  }
})();
