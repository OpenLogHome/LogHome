import axios from "axios";

const PENDING_REPORTS_KEY = "loghome_pending_novel_writing_activity_reports";
const MAX_PENDING_REPORTS = 500;
let queueDrainPromise = null;

function getTokenData() {
  try {
    let rawToken = "";
    if (
      typeof uni !== "undefined" &&
      typeof uni.getStorageSync === "function"
    ) {
      rawToken = uni.getStorageSync("token");
    } else if (typeof window !== "undefined" && window.localStorage) {
      rawToken = window.localStorage.getItem("token");
    }
    const tokenData =
      typeof rawToken === "string" ? JSON.parse(rawToken || "null") : rawToken;
    return tokenData || null;
  } catch (error) {
    return null;
  }
}

function getStorage() {
  if (typeof window !== "undefined" && window.localStorage)
    return window.localStorage;
  return null;
}

function readPendingReports() {
  try {
    const storage = getStorage();
    if (!storage) return [];
    const reports = JSON.parse(storage.getItem(PENDING_REPORTS_KEY) || "[]");
    return Array.isArray(reports)
      ? reports.filter((report) => report && report.report_id)
      : [];
  } catch (error) {
    return [];
  }
}

function writePendingReports(reports) {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(
      PENDING_REPORTS_KEY,
      JSON.stringify(reports.slice(-MAX_PENDING_REPORTS))
    );
  } catch (error) {}
}

function createReportId() {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }
  return `writing_${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
}

function getShanghaiDateKey(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const values = {};
    parts.forEach((part) => {
      if (part.type !== "literal") values[part.type] = part.value;
    });
    return `${values.year}-${values.month}-${values.day}`;
  } catch (error) {
    const offsetDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return offsetDate.toISOString().slice(0, 10);
  }
}

function enqueueReport(report) {
  const pending = readPendingReports();
  if (!pending.some((item) => item.report_id === report.report_id)) {
    pending.push(report);
    writePendingReports(pending);
  }
}

export async function drainPendingWritingActivityReports(vm) {
  if (queueDrainPromise) return queueDrainPromise;
  const tokenData = getTokenData();
  const token = (tokenData && tokenData.tk) || "";
  const currentUserId = Number((tokenData && tokenData.id) || 0);
  if (!token || !vm || !vm.$baseUrl) return;

  queueDrainPromise = (async () => {
    let pending = readPendingReports();
    let report = pending.find((item) => {
      const reportUserId = Number(item.client_user_id || 0);
      return (
        !reportUserId || (currentUserId > 0 && reportUserId === currentUserId)
      );
    });
    while (report) {
      try {
        await axios.post(
          vm.$baseUrl + "/essays/report_novel_writing_activity",
          report,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        pending = readPendingReports().filter(
          (item) => item.report_id !== report.report_id
        );
        writePendingReports(pending);
      } catch (error) {
        if (
          error &&
          error.response &&
          [403, 404].includes(error.response.status)
        ) {
          pending = readPendingReports().filter(
            (item) => item.report_id !== report.report_id
          );
          writePendingReports(pending);
        } else {
          break;
        }
      }
      report = pending.find((item) => {
        const reportUserId = Number(item.client_user_id || 0);
        return (
          !reportUserId || (currentUserId > 0 && reportUserId === currentUserId)
        );
      });
    }
  })();

  try {
    await queueDrainPromise;
  } finally {
    queueDrainPromise = null;
  }
}

function countTextInSliceNode(node) {
  if (!node || typeof node !== "object") return 0;
  let count = typeof node.text === "string" ? node.text.length : 0;
  if (Array.isArray(node.content)) {
    count += node.content.reduce(
      (total, child) => total + countTextInSliceNode(child),
      0
    );
  }
  return count;
}

export function countInsertedCharacters(transaction) {
  if (!transaction || !Array.isArray(transaction.steps)) return 0;
  return transaction.steps.reduce((total, step) => {
    if (!step || typeof step.toJSON !== "function") return total;
    const stepJson = step.toJSON();
    const content = stepJson && stepJson.slice && stepJson.slice.content;
    if (!Array.isArray(content)) return total;
    return (
      total +
      content.reduce(
        (sliceTotal, node) => sliceTotal + countTextInSliceNode(node),
        0
      )
    );
  }, 0);
}

export function createNovelWritingActivityReporter(vm, options = {}) {
  return {
    vm,
    getArticleId:
      options.getArticleId || (() => Number(options.articleId || 0)),
    getSessionId:
      options.getSessionId || (() => String(options.sessionId || "")),
    getUserId: options.getUserId || (() => Number(options.userId || 0)),
    activeWindowMs: Number(options.activeWindowMs || 45000),
    reportThresholdSeconds: Number(options.reportThresholdSeconds || 60),
    writtenCharsFlushThreshold: Number(
      options.writtenCharsFlushThreshold || 500
    ),
    maxBufferedSeconds: Number(options.maxBufferedSeconds || 300),
    bufferedActiveSeconds: 0,
    bufferedWrittenChars: 0,
    bufferDateKey: getShanghaiDateKey(),
    lastActiveAt: 0,
    timer: null,
    rotateBufferDate() {
      const currentDateKey = getShanghaiDateKey();
      if (currentDateKey === this.bufferDateKey) return;
      this.enqueueBufferedReport(this.bufferDateKey, true);
      this.bufferDateKey = currentDateKey;
      drainPendingWritingActivityReports(this.vm);
    },
    markActive() {
      this.rotateBufferDate();
      this.lastActiveAt = Date.now();
    },
    recordWrittenCharacters(rawCount) {
      const count = Math.max(0, Math.floor(Number(rawCount || 0)));
      if (!count) return;
      this.rotateBufferDate();
      this.bufferedWrittenChars += count;
      this.markActive();
      if (this.bufferedWrittenChars >= this.writtenCharsFlushThreshold) {
        this.flush();
      }
    },
    isPageVisible() {
      return (
        typeof document === "undefined" || document.visibilityState !== "hidden"
      );
    },
    start() {
      if (this.timer) return;
      drainPendingWritingActivityReports(this.vm);
      this.timer = setInterval(() => {
        this.rotateBufferDate();
        if (
          this.isPageVisible() &&
          this.lastActiveAt > 0 &&
          Date.now() - this.lastActiveAt <= this.activeWindowMs
        ) {
          this.bufferedActiveSeconds = Math.min(
            this.bufferedActiveSeconds + 1,
            this.maxBufferedSeconds
          );
        }
        this.flush();
      }, 1000);
    },
    enqueueBufferedReport(activityDate = this.bufferDateKey, force = false) {
      const activeSeconds = Math.floor(this.bufferedActiveSeconds);
      const writtenChars = Math.floor(this.bufferedWrittenChars);
      if (activeSeconds <= 0 && writtenChars <= 0) return false;
      if (
        !force &&
        activeSeconds < this.reportThresholdSeconds &&
        writtenChars < this.writtenCharsFlushThreshold
      ) {
        return false;
      }

      const articleId = Number(this.getArticleId() || 0);
      const sessionId = String(this.getSessionId() || "").slice(0, 64);
      if (!articleId || !sessionId) return false;

      enqueueReport({
        report_id: createReportId(),
        session_id: sessionId,
        article_id: articleId,
        client_user_id: Number(this.getUserId() || 0),
        activity_date: activityDate,
        active_seconds: Math.min(activeSeconds, this.maxBufferedSeconds),
        written_chars: writtenChars,
      });
      this.bufferedActiveSeconds = 0;
      this.bufferedWrittenChars = 0;
      return true;
    },
    flush(force = false) {
      const enqueued = this.enqueueBufferedReport(this.bufferDateKey, force);
      if (enqueued || force) {
        return drainPendingWritingActivityReports(this.vm);
      }
    },
    async stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.lastActiveAt = 0;
      await this.flush(true);
    },
  };
}
