<template>
  <view class="page">
    <view class="card article-card">
      <view class="eyebrow">当前章节</view>
      <view class="article-title">{{ article.title || "未命名章节" }}</view>
      <view class="article-meta">
        <text>{{ article.novelName || "未命名作品" }}</text>
        <text v-if="article.articleChapter">第{{ article.articleChapter }}章</text>
        <text>{{ article.textCount }} 字</text>
        <text>{{ article.imageCount }} 图</text>
      </view>
    </view>

    <view class="card">
      <view class="section-title">发布方式</view>
      <view class="mode-grid">
        <view
          class="mode-card"
          :class="{ active: publishMode === 'now' }"
          @click="publishMode = 'now'"
        >
          <view class="mode-title">立即发布</view>
          <view class="mode-desc">当前内容立即上线</view>
        </view>
        <view
          class="mode-card"
          :class="{ active: publishMode === 'schedule' }"
          @click="publishMode = 'schedule'"
        >
          <view class="mode-badge">限免</view>
          <view class="mode-title">定时发布</view>
          <view class="mode-desc">按指定时间自动发布</view>
        </view>
      </view>

      <view v-if="publishMode === 'schedule'" class="schedule-box">
        <view class="schedule-label">发布时间</view>
        <view class="schedule-picker-grid">
          <picker
            mode="date"
            :value="scheduleDate"
            :start="scheduleMinDate"
            @change="handleScheduleDateChange"
          >
            <view class="schedule-picker-card">
              <view class="schedule-picker-caption">日期</view>
              <view class="schedule-picker-value">
                {{ scheduleDate || "选择日期" }}
              </view>
            </view>
          </picker>

          <picker
            mode="time"
            :value="scheduleClock"
            @change="handleScheduleTimeChange"
          >
            <view class="schedule-picker-card">
              <view class="schedule-picker-caption">时间</view>
              <view class="schedule-picker-value">
                {{ scheduleClock || "选择时间" }}
              </view>
            </view>
          </picker>
        </view>

        <view class="schedule-tip">{{ scheduleTimeDisplay }}</view>
      </view>

      <view v-if="article.isPersonal" class="warning-text">
        作品当前为未公开状态，暂时不能发布章节。
      </view>
    </view>

    <view class="card">
      <view class="section-head">
        <view class="correction-title-group">
          <view class="section-title correction-title">文本纠错</view>
          <view class="inline-limit-badge">限免</view>
        </view>
        <view class="correction-actions-group">
          <button
            size="mini"
            class="ghost-button"
            :class="{ 'ghost-button-active': correctionMode === 'standard' }"
            :loading="displayCorrectionLoading"
            @click="rerunCurrentCorrection"
          >
            重新检查
          </button>
          <view
            class="smart-toggle"
            :class="{ 'smart-toggle-loading': smartCorrectionLoading }"
            @click="toggleSmartCorrection"
          >
            <text class="smart-toggle-label">智能纠错</text>
            <view class="smart-toggle-track" :class="{ active: correctionMode === 'smart' }">
              <view class="smart-toggle-thumb"></view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="smartThinkingText && smartThinkingVisible" class="thinking-panel">
        <view class="thinking-head" @click="smartThinkingVisible = false">
          <text class="thinking-head-text">模型思考过程</text>
          <text class="thinking-head-close">收起</text>
        </view>
        <scroll-view scroll-y class="thinking-body" :scroll-top="thinkingScrollTop">
          <view class="thinking-body-inner">
            <text class="thinking-content">{{ smartThinkingText }}</text>
          </view>
        </scroll-view>
      </view>
      <view
        v-else-if="smartCorrectionLoading && correctionMode === 'smart'"
        class="thinking-collapsed"
        @click="smartThinkingVisible = true"
      >
        <text class="thinking-collapsed-text">查看模型思考过程</text>
      </view>

      <view v-if="displayCorrectionLoading" class="status-box">
        正在检查正文，请稍候...
      </view>
      <view v-else-if="displayCorrectionError" class="status-box error-box">
        {{ displayCorrectionError }}
      </view>
      <view v-else>
        <view
          v-if="(displayCorrectionResult.summary.error_count || 0) > 0"
          class="status-box error-box correction-status"
        >
          部分内容暂时无法完成检查，请稍后重新检查。
        </view>

        <view
          v-if="
            !displayCorrectionResult.corrections.length &&
            !(displayCorrectionResult.summary.error_count || 0) &&
            (displayCorrectionResult.summary.paragraph_count || 0) > 0
          "
          class="status-box success-box correction-status"
        >
          未发现明显文本纠错问题。
        </view>
        <view
          v-if="(displayCorrectionResult.summary.paragraph_count || 0) === 0"
          class="status-box success-box correction-status"
        >
          暂无可检测的正文段落。
        </view>
        <view v-if="displayCorrectionResult.corrections.length" class="correction-list">
          <view
            v-for="item in displayCorrectionResult.corrections"
            :key="item.id"
            class="correction-item"
            @click="openCorrectionDetail(item)"
          >
            <view class="correction-item-head">
              <view class="correction-item-title">
                <text class="paragraph-tag">第{{ item.paragraph_index }}段</text>
                <text class="issue-tag">{{ item.fragments.length }}处修正建议</text>
              </view>
              <button
                size="mini"
                class="ignore-button"
                @click.stop="ignoreCorrection(item)"
              >
                忽略
              </button>
            </view>
            <view class="correction-markup">
              <template v-for="segment in buildAnnotatedSegments(item)">
                <text
                  v-if="segment.type === 'plain'"
                  :key="segment.id"
                  class="markup-plain"
                >
                  {{ segment.text }}
                </text>
                <view
                  v-else
                  class="markup-correction"
                >
                  <text class="markup-original">{{ segment.original_text }}</text>
                  <text class="markup-arrow">→</text>
                  <text class="markup-suggestion">
                    {{ segment.corrected_text }}
                  </text>
                </view>
              </template>
            </view>
            <view class="correction-actions">
              <button
                size="mini"
                class="apply-button"
                @click.stop="applyCorrection(item)"
              >
                应用
              </button>
            </view>
            <view class="detail-entry">查看详情</view>
          </view>
        </view>
      </view>
      <view class="card-footnote">AI可能会犯错，请仔细甄别。</view>
    </view>

    <view class="footer-bar">
      <button
        v-if="article.isDraft === 0"
        class="secondary-button"
        :disabled="submitLoading"
        @click="saveAsDraft"
      >
        退回草稿
      </button>
      <button
        class="primary-button"
        :loading="submitLoading"
        :disabled="article.isPersonal"
        @click="submitPublish"
      >
        {{ publishMode === "now" ? "立即发布" : "确认定时发布" }}
      </button>
    </view>

    <uni-popup ref="detailPopup" type="bottom">
      <view v-if="activeCorrection" class="detail-panel">
        <view class="detail-head">
          <view class="detail-title">纠错详情</view>
          <view class="detail-head-actions">
            <button
              size="mini"
              class="ignore-button"
              @click="ignoreCorrection(activeCorrection)"
            >
              忽略本条
            </button>
            <view class="detail-close" @click="closeCorrectionDetail">关闭</view>
          </view>
        </view>
        <scroll-view scroll-y class="detail-scroll">
          <view class="detail-section">
            <view class="detail-label">第{{ activeCorrection.paragraph_index }}段</view>
          </view>

          <view class="detail-section">
            <view class="detail-label">问题位置</view>
            <view class="correction-markup detail-markup">
              <template v-for="segment in buildAnnotatedSegments(activeCorrection)">
                <text
                  v-if="segment.type === 'plain'"
                  :key="segment.id"
                  class="markup-plain"
                >
                  {{ segment.text }}
                </text>
                <view
                  v-else
                  class="markup-correction"
                >
                  <text class="markup-original">{{ segment.original_text }}</text>
                  <text class="markup-arrow">→</text>
                  <text class="markup-suggestion">
                    {{ segment.corrected_text }}
                  </text>
                </view>
              </template>
            </view>
          </view>

          <view class="detail-section">
            <view class="detail-label">原文</view>
            <view class="detail-text">{{ activeCorrection.original_text }}</view>
          </view>

          <view class="detail-section">
            <view class="detail-label">建议改为</view>
            <view class="detail-text corrected-text">
              {{ activeCorrection.corrected_text }}
            </view>
          </view>

          <view class="detail-section">
            <view class="detail-label">逐项建议</view>
            <view
              v-for="fragment in activeCorrection.fragments"
              :key="fragment.id"
              class="fragment-row"
            >
              <view class="fragment-original">
                {{ fragment.original_fragment }}
              </view>
              <view class="fragment-arrow">→</view>
              <view class="fragment-corrected">
                {{ fragment.corrected_fragment }}
              </view>
            </view>
            <button class="detail-apply-button" @click="applyCorrection(activeCorrection)">
              应用这条修改
            </button>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import axios from "axios";
import { getServerTime } from "../../lib/utils.js";
import { writerArticleDB } from "../../lib/db.js";
import {
  countLegacyContent,
  parseLegacyContent,
  stringifyLegacyContent,
} from "../../lib/writerEditorLegacyAdapter.js";
import {
  buildClientSyncTime,
  markWriterSyncInvalidated,
  markWriterSyncSynced,
} from "../../lib/writerSyncState.js";
import {
  buildCorrectionParagraphs,
  buildParagraphRequestKey,
  getCachedParagraphResult,
  hydrateParagraphResult,
  ignoreCorrectionResult,
  isCorrectionIgnored,
  loadIgnoredCorrections,
  loadTextCorrectionCache,
  normalizeCorrectionText,
  persistIgnoredCorrections,
  persistTextCorrectionCache,
  writeStandardParagraphResultsToCache,
  loadSmartCorrectionCache,
  getCachedSmartParagraphResult,
  writeSmartParagraphResultsToCache,
  persistSmartCorrectionCache,
  loadSmartIgnoredCorrections,
  persistSmartIgnoredCorrections,
  ignoreSmartCorrectionResult,
  buildIgnoredCorrectionKey,
} from "../../lib/writerTextCorrectionCache.js";

function createEmptyCorrectionResult() {
  return {
    summary: {
      paragraph_count: 0,
      cached_paragraph_count: 0,
      requested_paragraph_count: 0,
      batch_count: 0,
      corrected_paragraph_count: 0,
      issue_count: 0,
      error_count: 0,
    },
    paragraph_results: [],
    corrections: [],
    errors: [],
  };
}

const EDIT_LOCK_HEARTBEAT_MS = 30 * 1000;

export default {
  data() {
    return {
      articleId: 0,
      sourceSessionId: "",
      publishSessionId: "",
      currentEditLock: null,
      lockHeartbeatTimer: null,
      publishMode: "now",
      scheduleTime: "",
      scheduleDate: "",
      scheduleClock: "",
      submitLoading: false,
      correctionLoading: false,
      correctionError: "",
      correctionResult: createEmptyCorrectionResult(),
      correctionMode: "standard",
      smartCorrectionLoading: false,
      smartCorrectionError: "",
      smartCorrectionResult: createEmptyCorrectionResult(),
      smartThinkingText: "",
      smartCorrectionContentText: "",
      smartCorrectionOutputStarted: false,
      smartThinkingVisible: false,
      thinkingScrollTop: 0,
      activeCorrection: null,
      ignoredCorrectionStore: {
        version: 1,
        updated_at: 0,
        entries: {},
      },
      smartIgnoredCorrectionStore: {
        version: 2,
        updated_at: 0,
        entries: {},
      },
      article: {
        title: "",
        content: "",
        articleChapter: 0,
        isDraft: 1,
        isPersonal: false,
        novelId: 0,
        novelName: "",
        textCount: 0,
        imageCount: 0,
      },
    };
  },
  computed: {
    scheduleMinDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    scheduleTimeDisplay() {
      if (!this.scheduleDate || !this.scheduleClock) {
        return "请选择具体的发布时间";
      }
      return `将于 ${this.scheduleDate} ${this.scheduleClock} 自动发布`;
    },
    displayCorrectionResult() {
      return this.correctionMode === "smart"
        ? this.smartCorrectionResult
        : this.correctionResult;
    },
    displayCorrectionLoading() {
      return this.correctionMode === "smart"
        ? this.smartCorrectionLoading
        : this.correctionLoading;
    },
    displayCorrectionError() {
      return this.correctionMode === "smart"
        ? this.smartCorrectionError
        : this.correctionError;
    },
    displayIgnoredStore() {
      return this.correctionMode === "smart"
        ? this.smartIgnoredCorrectionStore
        : this.ignoredCorrectionStore;
    },
  },
  watch: {
    publishMode(value) {
      if (value === "schedule" && (!this.scheduleDate || !this.scheduleClock)) {
        this.initializeSchedulePicker();
      }
    },
  },
  methods: {
    getTokenInfo() {
      const token = JSON.parse(window.localStorage.getItem("token"));
      return token || null;
    },
    getAuthToken() {
      const token = this.getTokenInfo();
      return token ? token.tk : null;
    },
    getCurrentUserId() {
      const token = this.getTokenInfo();
      return token && token.id ? Number(token.id) : 0;
    },
    generatePublishSessionId() {
      return `writer_publish_${this.articleId}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
    },
    async getCurrentSyncTime() {
      const serverTime = await getServerTime();
      return serverTime || buildClientSyncTime();
    },
    async claimEditLock() {
      const tk = this.getAuthToken();
      if (!tk || !this.articleId || !this.publishSessionId) {
        return false;
      }

      try {
        const response = await axios.post(
          this.$baseUrl + "/essays/claim_article_edit_lock",
          {
            article_id: this.articleId,
            session_id: this.publishSessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );
        this.currentEditLock = response.data.lock || null;
        this.startLockHeartbeat();
        return true;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.currentEditLock = error.response.data.lock || null;
          this.handleLockConflict(error.response.data.lock);
          return false;
        }
        throw error;
      }
    },
    startLockHeartbeat() {
      this.stopLockHeartbeat();
      this.lockHeartbeatTimer = setInterval(() => {
        this.heartbeatEditLock();
      }, EDIT_LOCK_HEARTBEAT_MS);
    },
    stopLockHeartbeat() {
      if (this.lockHeartbeatTimer) {
        clearInterval(this.lockHeartbeatTimer);
        this.lockHeartbeatTimer = null;
      }
    },
    async heartbeatEditLock() {
      const tk = this.getAuthToken();
      if (!tk || !this.articleId || !this.publishSessionId) {
        return;
      }

      try {
        const response = await axios.post(
          this.$baseUrl + "/essays/heartbeat_article_edit_lock",
          {
            article_id: this.articleId,
            session_id: this.publishSessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );
        this.currentEditLock = response.data.lock || null;
      } catch (error) {
        this.stopLockHeartbeat();
        if (error.response && error.response.status === 409) {
          this.currentEditLock = error.response.data.lock || null;
          this.handleLockConflict(error.response.data.lock);
        }
      }
    },
    async releaseEditLock() {
      const tk = this.getAuthToken();
      if (!tk || !this.articleId || !this.publishSessionId) {
        return;
      }

      try {
        await axios.post(
          this.$baseUrl + "/essays/release_article_edit_lock",
          {
            article_id: this.articleId,
            session_id: this.publishSessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );
      } catch (error) {}
    },
    handleLockConflict(lockInfo) {
      const lockName = lockInfo && lockInfo.name ? lockInfo.name : "其他作者";
      uni.showModal({
        title: "章节已被占用",
        content: `${lockName} 正在编辑这个章节，请稍后再试。`,
        showCancel: false,
        success: () => {
          uni.navigateBack({});
        },
      });
    },
    isStaleSessionError(error) {
      return !!(
        error &&
        error.response &&
        error.response.status === 409 &&
        error.response.data &&
        error.response.data.code === "stale_session"
      );
    },
    handleStaleSessionInvalidation() {
      const syncTime = buildClientSyncTime();
      markWriterSyncInvalidated({
        userId: this.getCurrentUserId(),
        articleId: this.articleId,
        content: this.article.content,
        localCreateTime: syncTime,
        sessionId: this.publishSessionId,
        lastError: "stale_session",
      });
      this.stopLockHeartbeat();
      uni.showModal({
        title: "发布会话已失效",
        content: "这个发布页面已经被新的操作接管，请重新进入后再试。",
        showCancel: false,
        success: () => {
          uni.navigateBack({});
        },
      });
    },
    getPublishDraftStorageKey(articleId = this.articleId) {
      const token = this.getTokenInfo();
      const userId = token && token.id ? Number(token.id) : 0;
      return `writer_publish_payload_${userId}_${Number(articleId || 0)}`;
    },
    getPublishCompletionStorageKey(
      articleId = this.articleId,
      sourceSessionId = this.sourceSessionId
    ) {
      const token = this.getTokenInfo();
      const userId = token && token.id ? Number(token.id) : 0;
      return `writer_publish_completed_${userId}_${Number(articleId || 0)}_${String(
        sourceSessionId || ""
      )}`;
    },
    clearPublishDraft() {
      window.localStorage.removeItem(this.getPublishDraftStorageKey());
    },
    markPublishCompleted(writerSnapshot = {}) {
      if (!this.sourceSessionId) {
        return;
      }

      window.localStorage.setItem(
        this.getPublishCompletionStorageKey(),
        JSON.stringify({
          article_id: this.articleId,
          source_session_id: this.sourceSessionId,
          publish_session_id: this.publishSessionId,
          title: this.article.title,
          content: this.article.content,
          writer_create_time: writerSnapshot.create_time || "",
          remote_updated_at: writerSnapshot.updated_at || "",
          completed_at: Date.now(),
        })
      );
    },
    loadPublishDraft() {
      const raw = window.localStorage.getItem(this.getPublishDraftStorageKey());
      if (!raw) {
        return null;
      }

      try {
        const parsed = JSON.parse(raw);
        if (Number(parsed.article_id || 0) !== Number(this.articleId || 0)) {
          return null;
        }
        return parsed;
      } catch (error) {
        return null;
      }
    },
    buildArticleContext(raw) {
      const article = raw || {};
      const content = typeof article.content === "string" ? article.content : "";
      const stats = countLegacyContent(parseLegacyContent(content));
      const novelInfo = article.novel_info || {};

      return {
        title: article.title || "",
        content,
        articleChapter: Number(article.article_chapter || 0),
        isDraft: Number(article.is_draft == null ? 1 : article.is_draft),
        isPersonal: Number(novelInfo.is_personal || 0) === 1,
        novelId: Number(novelInfo.novel_id || article.novel_id || 0),
        novelName: novelInfo.name || article.novel_name || "",
        textCount: stats.textCount,
        imageCount: stats.imageCount,
      };
    },
    formatDateValue(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatTimeValue(date) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    initializeSchedulePicker(value = "") {
      const parsedDate = this.parseScheduleTime(value);
      const fallbackDate = new Date();
      fallbackDate.setMinutes(0, 0, 0);
      fallbackDate.setHours(fallbackDate.getHours() + 1);
      const nextDate =
        parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : fallbackDate;

      this.scheduleDate = this.formatDateValue(nextDate);
      this.scheduleClock = this.formatTimeValue(nextDate);
      this.syncScheduleTime();
    },
    syncScheduleTime() {
      if (!this.scheduleDate || !this.scheduleClock) {
        this.scheduleTime = "";
        return;
      }

      this.scheduleTime = `${this.scheduleDate} ${this.scheduleClock}`;
    },
    handleScheduleDateChange(event) {
      this.scheduleDate = event?.detail?.value || "";
      this.syncScheduleTime();
    },
    handleScheduleTimeChange(event) {
      this.scheduleClock = event?.detail?.value || "";
      this.syncScheduleTime();
    },
    getLeadingAndTrailingSpaces(text) {
      const rawText = String(text || "");
      const leadingMatch = rawText.match(/^[\s\u3000]*/);
      const trailingMatch = rawText.match(/[\s\u3000]*$/);
      return {
        leading: leadingMatch ? leadingMatch[0] : "",
        trailing: trailingMatch ? trailingMatch[0] : "",
      };
    },
    persistCurrentPublishDraft() {
      const draft = {
        article_id: this.articleId,
        title: this.article.title,
        content: this.article.content,
        is_draft: this.article.isDraft,
        article_chapter: this.article.articleChapter,
        novel_info: {
          novel_id: this.article.novelId || 0,
          name: this.article.novelName,
          is_personal: this.article.isPersonal ? 1 : 0,
        },
        edit_session_id: this.publishSessionId || this.sourceSessionId || "",
        saved_at: Date.now(),
      };
      window.localStorage.setItem(
        this.getPublishDraftStorageKey(),
        JSON.stringify(draft)
      );
    },
    async syncLocalWriterSnapshot(currentServerTime, remoteUpdatedAt = "") {
      const articleId = Number(this.articleId || 0);
      const userId = Number(this.getCurrentUserId() || 0);
      if (articleId && userId) {
        await writerArticleDB.articles
          .where("[user_id+article_id]")
          .equals([userId, articleId])
          .delete();
      }
      await writerArticleDB.articles.add({
        article_id: articleId,
        user_id: userId,
        title: this.article.title,
        content: this.article.content,
        create_time: currentServerTime,
        is_slow_save: true,
      });
      markWriterSyncSynced({
        userId: this.getCurrentUserId(),
        articleId: this.articleId,
        content: this.article.content,
        remoteCreateTime: currentServerTime,
        remoteUpdatedAt: remoteUpdatedAt || "",
        sessionId: this.publishSessionId,
      });
    },
    extractWriterSnapshot(response) {
      return (
        (response &&
          response.data &&
          response.data.writer_snapshot &&
          typeof response.data.writer_snapshot === "object" &&
          response.data.writer_snapshot) ||
        (response && response.data && typeof response.data === "object"
          ? response.data
          : {}) ||
        {}
      );
    },
    buildAnnotatedSegments(item) {
      const fragments = Array.isArray(item?.fragments)
        ? [...item.fragments].sort((left, right) => {
            if (left.begin_pos !== right.begin_pos) {
              return left.begin_pos - right.begin_pos;
            }
            return left.end_pos - right.end_pos;
          })
        : [];
      const originalText = String(item?.original_text || "");
      const segments = [];
      let cursor = 0;

      fragments.forEach((fragment, index) => {
        const begin = Math.max(0, Number(fragment.begin_pos || 0));
        const end = Math.max(begin, Number(fragment.end_pos || begin));
        if (begin > cursor) {
          segments.push({
            id: `${item.id}_plain_${index}_${cursor}`,
            type: "plain",
            text: originalText.slice(cursor, begin),
          });
        }

        segments.push({
          id: fragment.id || `${item.id}_fragment_${index}`,
          type: "correction",
          original_text: fragment.original_fragment || originalText.slice(begin, end),
          corrected_text: fragment.corrected_fragment || "",
        });
        cursor = end;
      });

      if (cursor < originalText.length) {
        segments.push({
          id: `${item.id}_plain_tail_${cursor}`,
          type: "plain",
          text: originalText.slice(cursor),
        });
      }

      if (segments.length === 0) {
        return [
          {
            id: `${item.id}_plain_full`,
            type: "plain",
            text: originalText,
          },
        ];
      }

      return segments;
    },
    isArticleContentEmpty() {
      const blocks = parseLegacyContent(this.article.content);
      return !blocks.some(
        (block) => block.type === "image" || block.value.trim()
      );
    },
    validateArticle() {
      if (
        this.article.title.replace(/(^\s*)|(\s*$)/g, "") === "" ||
        this.isArticleContentEmpty()
      ) {
        uni.showToast({
          title: "标题或文章内容不能为空",
          icon: "none",
          duration: 2000,
        });
        return false;
      }

      return true;
    },
    parseScheduleTime(value) {
      const normalized = String(value || "").trim();
      if (!normalized) {
        return null;
      }

      const date = new Date(normalized.replace(/-/g, "/"));
      if (!Number.isNaN(date.getTime())) {
        return date;
      }

      const fallback = new Date(normalized.replace(" ", "T"));
      return Number.isNaN(fallback.getTime()) ? null : fallback;
    },
    validateScheduleTime() {
      if (this.publishMode !== "schedule") {
        return true;
      }

      if (!this.scheduleTime) {
        uni.showToast({
          title: "请选择发布时间",
          icon: "none",
          duration: 2000,
        });
        return false;
      }

      const scheduleDate = this.parseScheduleTime(this.scheduleTime);
      if (!scheduleDate) {
        uni.showToast({
          title: "发布时间格式无效",
          icon: "none",
          duration: 2000,
        });
        return false;
      }

      if (scheduleDate.getTime() <= Date.now()) {
        uni.showToast({
          title: "发布时间必须晚于当前时间",
          icon: "none",
          duration: 2000,
        });
        return false;
      }

      return true;
    },
    async fetchArticle() {
      const tk = this.getAuthToken();
      const response = await axios.get(
        this.$baseUrl + "/essays/get_article?id=" + this.articleId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tk,
          },
        }
      );
      const article = Array.isArray(response.data)
        ? response.data[0] || {}
        : response.data || {};
      this.article = this.buildArticleContext(article);
    },
    async initializePage() {
      this.ignoredCorrectionStore = await loadIgnoredCorrections(this.getCurrentUserId());
      this.smartIgnoredCorrectionStore = await loadSmartIgnoredCorrections(this.getCurrentUserId());
      this.initializeSchedulePicker();
      const lockClaimed = await this.claimEditLock();
      if (!lockClaimed) {
        return;
      }
      const draft = this.loadPublishDraft();
      if (draft) {
        this.article = this.buildArticleContext(draft);
      } else {
        await this.fetchArticle();
      }
      await this.runTextCorrection();
    },
    async runTextCorrection() {
      this.correctionMode = "standard";
      return this.runCorrection("standard");
    },
    async rerunCurrentCorrection() {
      if (this.correctionMode === "smart") {
        return this.runSmartCorrection({ forceRefresh: true });
      }
      return this.runTextCorrection();
    },
    async toggleSmartCorrection() {
      if (this.correctionMode === "smart") {
        return this.runTextCorrection();
      }
      return this.runSmartCorrection();
    },
    async runSmartCorrection(options = {}) {
      this.correctionMode = "smart";
      return this.runSmartCorrectionStreaming(options);
    },
    removeSmartParagraphsFromCache(cache, paragraphs) {
      const nextCache = cache && typeof cache === "object"
        ? {
            ...cache,
            entries: {
              ...(cache.entries || {}),
            },
          }
        : cache;

      if (!nextCache || !nextCache.entries) {
        return nextCache;
      }

      paragraphs.forEach((paragraph) => {
        if (paragraph.paragraph_hash) {
          delete nextCache.entries[paragraph.paragraph_hash];
        }
      });
      nextCache.updated_at = Date.now();
      return nextCache;
    },
    async runSmartCorrectionStreaming(options = {}) {
      const forceRefresh = Boolean(options.forceRefresh);
      this.smartCorrectionLoading = true;
      this.smartCorrectionError = "";
      this.smartCorrectionResult = createEmptyCorrectionResult();
      this.smartThinkingText = "";
      this.smartCorrectionContentText = "";
      this.smartCorrectionOutputStarted = false;
      this.smartThinkingVisible = true;

      try {
        const paragraphs = buildCorrectionParagraphs(this.article.content);
        const baseResult = createEmptyCorrectionResult();
        baseResult.summary.paragraph_count = paragraphs.length;
        this.smartCorrectionResult = baseResult;

        if (paragraphs.length === 0) {
          return;
        }

        const userId = this.getCurrentUserId();
        let cache = await loadSmartCorrectionCache(userId);
        if (forceRefresh) {
          cache = this.removeSmartParagraphsFromCache(cache, paragraphs);
          await persistSmartCorrectionCache(userId, cache);
        }
        const cachedResults = [];
        const uncachedParagraphs = [];

        paragraphs.forEach((paragraph) => {
          const cachedResult = getCachedSmartParagraphResult(cache, paragraph);
          if (cachedResult) {
            cachedResults.push(cachedResult);
            return;
          }
          uncachedParagraphs.push(paragraph);
        });

        const pendingParagraphMap = new Map();
        uncachedParagraphs.forEach((paragraph) => {
          const requestKey = buildParagraphRequestKey(paragraph);
          if (!pendingParagraphMap.has(requestKey)) {
            pendingParagraphMap.set(requestKey, paragraph);
          }
        });

        const requestParagraphs = Array.from(pendingParagraphMap.values());

        if (requestParagraphs.length === 0) {
          const allParagraphResults = [];
          paragraphs.forEach((paragraph) => {
            const cachedResult = getCachedSmartParagraphResult(cache, paragraph);
            allParagraphResults.push(
              cachedResult ||
                hydrateParagraphResult(paragraph, {
                  corrected_text: paragraph.text,
                  has_issue: false,
                  fragments: [],
                })
            );
          });

          const rawCorrections = allParagraphResults.filter(
            (item) => item.has_issue && !item.error
          );
          const corrections = rawCorrections.filter(
            (item) => !isCorrectionIgnored(this.smartIgnoredCorrectionStore, item)
          );
          this.smartCorrectionResult = {
            summary: {
              paragraph_count: paragraphs.length,
              cached_paragraph_count: cachedResults.length,
              requested_paragraph_count: 0,
              batch_count: 0,
              corrected_paragraph_count: corrections.length,
              issue_count: corrections.reduce(
                (total, item) => total + item.fragments.length, 0
              ),
              error_count: 0,
            },
            paragraph_results: allParagraphResults,
            corrections,
            errors: [],
          };
          return;
        }

        const responseData = await this.fetchSmartCorrectionStream(
          requestParagraphs
        );

        const freshParagraphResults = Array.isArray(responseData.paragraph_results)
          ? responseData.paragraph_results
          : [];
        const freshResultMap = new Map();
        freshParagraphResults.forEach((result) => {
          const requestKey = buildParagraphRequestKey({
            paragraph_hash: result.paragraph_hash,
            text: result.original_text,
          });
          freshResultMap.set(requestKey, result);
        });

        const allParagraphResults = [];
        paragraphs.forEach((paragraph) => {
          const cachedResult = getCachedSmartParagraphResult(cache, paragraph);
          if (cachedResult) {
            allParagraphResults.push(cachedResult);
            return;
          }

          const requestKey = buildParagraphRequestKey(paragraph);
          const freshResult = freshResultMap.get(requestKey);
          if (freshResult) {
            allParagraphResults.push(hydrateParagraphResult(paragraph, freshResult));
            return;
          }

          allParagraphResults.push(
            hydrateParagraphResult(paragraph, {
              corrected_text: paragraph.text,
              has_issue: false,
              fragments: [],
              error: "未获取到该段落的纠错结果",
            })
          );
        });

        cache = writeSmartParagraphResultsToCache(cache, freshParagraphResults);
        await persistSmartCorrectionCache(userId, cache);

        const rawCorrections = allParagraphResults.filter(
          (item) => item.has_issue && !item.error
        );
        const corrections = rawCorrections.filter(
          (item) => !isCorrectionIgnored(this.smartIgnoredCorrectionStore, item)
        );
        const errors = allParagraphResults
          .filter((item) => item.error)
          .map((item) => ({
            paragraph_index: item.paragraph_index,
            paragraph_id: item.paragraph_id,
            paragraph_hash: item.paragraph_hash,
            message: item.error,
          }));

        this.smartCorrectionResult = {
          summary: {
            paragraph_count: paragraphs.length,
            cached_paragraph_count: cachedResults.length,
            requested_paragraph_count: requestParagraphs.length,
            batch_count: Number(responseData.summary?.batch_count || 0),
            corrected_paragraph_count: corrections.length,
            issue_count: corrections.reduce(
              (total, item) => total + item.fragments.length, 0
            ),
            error_count: errors.length,
          },
          paragraph_results: allParagraphResults,
          corrections,
          errors,
        };
      } catch (error) {
        this.smartCorrectionError = error.message || "文本纠错结果整理失败，请稍后重试";
      } finally {
        this.smartCorrectionLoading = false;
      }
    },
    async runCorrection(mode) {
      const isSmart = mode === "smart";

      if (isSmart) {
        this.smartCorrectionLoading = true;
        this.smartCorrectionError = "";
        this.smartCorrectionResult = createEmptyCorrectionResult();
      } else {
        this.correctionLoading = true;
        this.correctionError = "";
        this.correctionResult = createEmptyCorrectionResult();
      }

      try {
        const paragraphs = buildCorrectionParagraphs(this.article.content);
        const baseResult = createEmptyCorrectionResult();
        baseResult.summary.paragraph_count = paragraphs.length;

        if (isSmart) {
          this.smartCorrectionResult = baseResult;
        } else {
          this.correctionResult = baseResult;
        }

        if (paragraphs.length === 0) {
          return;
        }

        const userId = this.getCurrentUserId();
        let cache = await loadTextCorrectionCache(userId);
        const cachedResults = [];
        const uncachedParagraphs = [];

        paragraphs.forEach((paragraph) => {
          const cachedResult = getCachedParagraphResult(cache, paragraph);
          if (cachedResult) {
            cachedResults.push(cachedResult);
            return;
          }
          uncachedParagraphs.push(paragraph);
        });

        const pendingParagraphMap = new Map();
        uncachedParagraphs.forEach((paragraph) => {
          const requestKey = buildParagraphRequestKey(paragraph);
          if (!pendingParagraphMap.has(requestKey)) {
            pendingParagraphMap.set(requestKey, paragraph);
          }
        });

        const requestParagraphs = Array.from(pendingParagraphMap.values());
        let responseData = createEmptyCorrectionResult();

        if (requestParagraphs.length > 0) {
          try {
            const tk = this.getAuthToken();
            const response = await axios.post(
              this.$baseUrl + "/essays/get_article_text_correction",
              {
                article_id: this.articleId,
                paragraphs: requestParagraphs,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + tk,
                },
              }
            );
            responseData = response.data || createEmptyCorrectionResult();
          } catch (requestError) {
            responseData = {
              summary: {
                paragraph_count: requestParagraphs.length,
                cached_paragraph_count: 0,
                requested_paragraph_count: requestParagraphs.length,
                batch_count: 0,
                corrected_paragraph_count: 0,
                issue_count: 0,
                error_count: requestParagraphs.length,
              },
              paragraph_results: requestParagraphs.map((paragraph) => ({
                paragraph_index: paragraph.paragraph_index,
                paragraph_id: paragraph.paragraph_id,
                paragraph_hash: paragraph.paragraph_hash,
                original_text: paragraph.text,
                corrected_text: paragraph.text,
                has_issue: false,
                fragments: [],
                error: "文本纠错请求失败，请稍后重试",
              })),
              corrections: [],
              errors: requestParagraphs.map((paragraph) => ({
                paragraph_index: paragraph.paragraph_index,
                paragraph_id: paragraph.paragraph_id,
                paragraph_hash: paragraph.paragraph_hash,
                message: "文本纠错请求失败，请稍后重试",
              })),
            };
          }
        }

        const freshParagraphResults = Array.isArray(responseData.paragraph_results)
          ? responseData.paragraph_results
          : [];
        const freshResultMap = new Map();
        freshParagraphResults.forEach((result) => {
          const requestKey = buildParagraphRequestKey({
            paragraph_hash: result.paragraph_hash,
            text: result.original_text,
          });
          freshResultMap.set(requestKey, result);
        });

        const allParagraphResults = [];
        paragraphs.forEach((paragraph) => {
          const cachedResult = getCachedParagraphResult(cache, paragraph);
          if (cachedResult) {
            allParagraphResults.push(cachedResult);
            return;
          }

          const requestKey = buildParagraphRequestKey(paragraph);
          const freshResult = freshResultMap.get(requestKey);
          if (freshResult) {
            allParagraphResults.push(hydrateParagraphResult(paragraph, freshResult));
            return;
          }

          allParagraphResults.push(
            hydrateParagraphResult(paragraph, {
              corrected_text: paragraph.text,
              has_issue: false,
              fragments: [],
              error: "未获取到该段落的纠错结果",
            })
          );
        });

        cache = writeStandardParagraphResultsToCache(cache, freshParagraphResults);
        await persistTextCorrectionCache(userId, cache);

        const rawCorrections = allParagraphResults.filter(
          (item) => item.has_issue && !item.error
        );
        const corrections = rawCorrections.filter(
          (item) => !isCorrectionIgnored(this.ignoredCorrectionStore, item)
        );
        const errors = allParagraphResults
          .filter((item) => item.error)
          .map((item) => ({
            paragraph_index: item.paragraph_index,
            paragraph_id: item.paragraph_id,
            paragraph_hash: item.paragraph_hash,
            message: item.error,
          }));

        this.correctionResult = {
          summary: {
            paragraph_count: paragraphs.length,
            cached_paragraph_count: cachedResults.length,
            requested_paragraph_count: requestParagraphs.length,
            batch_count: Number(responseData.summary?.batch_count || 0),
            corrected_paragraph_count: corrections.length,
            issue_count: corrections.reduce(
              (total, item) => total + item.fragments.length,
              0
            ),
            error_count: errors.length,
          },
          paragraph_results: allParagraphResults,
          corrections,
          errors,
        };
      } catch (error) {
        this.correctionError = "文本纠错结果整理失败，请稍后重试";
      } finally {
        this.correctionLoading = false;
      }
    },
    openCorrectionDetail(item) {
      this.activeCorrection = item;
      this.$refs.detailPopup.open();
    },
    async ignoreCorrection(item) {
      const userId = this.getCurrentUserId();
      const isSmart = this.correctionMode === "smart";

      if (isSmart) {
        this.smartIgnoredCorrectionStore = ignoreSmartCorrectionResult(
          this.smartIgnoredCorrectionStore,
          item
        );
        await persistSmartIgnoredCorrections(userId, this.smartIgnoredCorrectionStore);
      } else {
        this.ignoredCorrectionStore = ignoreCorrectionResult(
          this.ignoredCorrectionStore,
          item
        );
        await persistIgnoredCorrections(userId, this.ignoredCorrectionStore);
      }

      if (
        this.activeCorrection &&
        this.activeCorrection.id &&
        this.activeCorrection.id === item.id
      ) {
        this.closeCorrectionDetail();
      }

      const resultKey = isSmart ? "smartCorrectionResult" : "correctionResult";
      this[resultKey] = {
        ...this[resultKey],
        corrections: (this[resultKey].corrections || []).filter(
          (current) => current.id !== item.id
        ),
        summary: {
          ...this[resultKey].summary,
          corrected_paragraph_count: Math.max(
            0,
            Number(this[resultKey].summary.corrected_paragraph_count || 0) - 1
          ),
          issue_count: Math.max(
            0,
            Number(this[resultKey].summary.issue_count || 0) -
              Number((item.fragments || []).length || 0)
          ),
        },
      };
    },
    async applyCorrection(item) {
      const blocks = parseLegacyContent(this.article.content);
      let paragraphCursor = 0;
      let updated = false;

      const nextBlocks = blocks.map((block) => {
        if (!block || block.type !== "text") {
          return block;
        }

        const normalizedText = normalizeCorrectionText(block.value);
        if (!normalizedText) {
          return block;
        }

        paragraphCursor += 1;
        if (paragraphCursor !== Number(item.paragraph_index || 0)) {
          return block;
        }

        const { leading, trailing } = this.getLeadingAndTrailingSpaces(block.value);
        updated = true;
        return {
          ...block,
          value: `${leading}${item.corrected_text}${trailing}`,
        };
      });

      if (!updated) {
        uni.showToast({
          title: "应用失败，请重新检查",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      const nextContent = stringifyLegacyContent(nextBlocks);
      const nextStats = countLegacyContent(parseLegacyContent(nextContent));
      this.article = {
        ...this.article,
        content: nextContent,
        textCount: nextStats.textCount,
        imageCount: nextStats.imageCount,
      };
      this.persistCurrentPublishDraft();

      const isSmart = this.correctionMode === "smart";
      const resultKey = isSmart ? "smartCorrectionResult" : "correctionResult";
      const nextParagraphResults = (this[resultKey].paragraph_results || []).map(
        (current) => {
          if (current.id !== item.id) {
            return current;
          }
          return {
            ...current,
            original_text: item.corrected_text,
            corrected_text: item.corrected_text,
            has_issue: false,
            fragments: [],
            error: null,
          };
        }
      );
      const nextCorrections = (this[resultKey].corrections || []).filter(
        (current) => current.id !== item.id
      );
      const nextErrors = this[resultKey].errors || [];

      const userId = this.getCurrentUserId();
      const nextParagraph = buildCorrectionParagraphs(nextContent).find(
        (paragraph) =>
          Number(paragraph.paragraph_index || 0) ===
          Number(item.paragraph_index || 0)
      );
      if (nextParagraph) {
        if (isSmart) {
          const cache = await loadSmartCorrectionCache(userId);
          const nextCache = writeSmartParagraphResultsToCache(cache, [
            {
              paragraph_hash: nextParagraph.paragraph_hash,
              original_text: nextParagraph.text,
              corrected_text: nextParagraph.text,
              has_issue: false,
              fragments: [],
            },
          ]);
          await persistSmartCorrectionCache(userId, nextCache);
        } else {
          const cache = await loadTextCorrectionCache(userId);
          const nextCache = writeStandardParagraphResultsToCache(cache, [
            {
              paragraph_hash: nextParagraph.paragraph_hash,
              original_text: nextParagraph.text,
              corrected_text: nextParagraph.text,
              has_issue: false,
              fragments: [],
            },
          ]);
          await persistTextCorrectionCache(userId, nextCache);
        }
      }

      this[resultKey] = {
        ...this[resultKey],
        paragraph_results: nextParagraphResults,
        corrections: nextCorrections,
        errors: nextErrors,
        summary: {
          ...this[resultKey].summary,
          corrected_paragraph_count: nextCorrections.length,
          issue_count: nextCorrections.reduce(
            (total, current) =>
              total + Number((current.fragments || []).length || 0),
            0
          ),
          error_count: nextErrors.length,
        },
      };

      if (this.activeCorrection && this.activeCorrection.id === item.id) {
        this.closeCorrectionDetail();
      }

      uni.showToast({
        title: "已应用修改",
        icon: "none",
        duration: 1600,
      });
    },
    closeCorrectionDetail() {
      this.$refs.detailPopup.close();
      this.activeCorrection = null;
    },
    navigateAfterSubmit() {
      const pages = getCurrentPages();
      if (pages && pages.length >= 3) {
        uni.navigateBack({
          delta: 2,
        });
        return;
      }

      uni.navigateBack({
        delta: 1,
      });
    },
    async submitPublish() {
      if (!this.validateArticle() || !this.validateScheduleTime()) {
        return;
      }

      if (this.article.isPersonal) {
        uni.showToast({
          title: "作品尚未公开，暂时无法发布",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      this.submitLoading = true;
      try {
        const tk = this.getAuthToken();
        const currentServerTime = await this.getCurrentSyncTime();
        const response = await axios.post(
          this.$baseUrl + "/essays/modify_article",
          {
            title: this.article.title,
            content: this.article.content,
            is_draft: this.publishMode === "schedule" ? 1 : 0,
            article_id: this.articleId,
            schedule_time: this.publishMode === "schedule" ? this.scheduleTime : null,
            clear_schedule: this.publishMode === "now" ? 1 : 0,
            edit_session_id: this.publishSessionId,
            writer_create_time: currentServerTime,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );

        const writerSnapshot = this.extractWriterSnapshot(response);
        await this.syncLocalWriterSnapshot(
          writerSnapshot.create_time || currentServerTime,
          writerSnapshot.updated_at || ""
        );
        this.markPublishCompleted(writerSnapshot);
        this.clearPublishDraft();
        uni.showToast({
          title: this.publishMode === "schedule" ? "定时发布设置成功" : "发布成功",
          icon: "none",
          duration: 2000,
        });
        setTimeout(() => {
          this.navigateAfterSubmit();
        }, 1200);
      } catch (error) {
        if (this.isStaleSessionError(error)) {
          this.handleStaleSessionInvalidation();
          return;
        }
        uni.showToast({
          title: "提交失败，请重试",
          icon: "none",
          duration: 2000,
        });
      } finally {
        this.submitLoading = false;
      }
    },
    saveAsDraft() {
      uni.showModal({
        title: "提示",
        content: "退回章节为草稿会使已发布的章节下架，确定继续吗？",
        success: async (res) => {
          if (!res.confirm) {
            return;
          }

          this.submitLoading = true;
          try {
            const tk = this.getAuthToken();
            const currentServerTime = await this.getCurrentSyncTime();
            const response = await axios.post(
              this.$baseUrl + "/essays/modify_article",
              {
                title: this.article.title,
                content: this.article.content,
                is_draft: 1,
                article_id: this.articleId,
                clear_schedule: 1,
                edit_session_id: this.publishSessionId,
                writer_create_time: currentServerTime,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + tk,
                },
              }
            );

            const writerSnapshot = this.extractWriterSnapshot(response);
            await this.syncLocalWriterSnapshot(
              writerSnapshot.create_time || currentServerTime,
              writerSnapshot.updated_at || ""
            );
            this.markPublishCompleted(writerSnapshot);
            this.clearPublishDraft();
            uni.showToast({
              title: "已退回草稿",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              this.navigateAfterSubmit();
            }, 1200);
          } catch (error) {
            if (this.isStaleSessionError(error)) {
              this.handleStaleSessionInvalidation();
              return;
            }
            uni.showToast({
              title: "操作失败，请重试",
              icon: "none",
              duration: 2000,
            });
          } finally {
            this.submitLoading = false;
          }
        },
      });
    },
    async fetchSmartCorrectionStream(paragraphs) {
      const tk = this.getAuthToken();
      const url = this.$readerAiBaseUrl + "/library/writer_text_correction";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/x-ndjson",
          Authorization: "Bearer " + tk,
        },
        body: JSON.stringify({
          article_id: this.articleId,
          paragraphs,
          novel_id: this.article.novelId,
        }),
      });

      if (!response.ok) {
        let message = "智能纠错请求失败";
        try {
          const data = await response.json();
          message = data.msg || data.message || message;
        } catch (error) {}
        throw new Error(message);
      }

      if (!response.body || !response.body.getReader) {
        throw new Error("智能纠错服务未返回流式响应");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let finalResult = null;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const consumed = this.consumeCorrectionStreamBuffer(buffer);
          buffer = consumed.remaining;
          if (consumed.result !== null) {
            finalResult = consumed.result;
            try { reader.cancel(); } catch (e) { /* ignore */ }
            break;
          }
        }
        if (finalResult === null) {
          buffer += decoder.decode();
          if (buffer.trim()) {
            const consumed = this.consumeCorrectionStreamBuffer(`${buffer}\n`);
            if (consumed.result !== null) {
              finalResult = consumed.result;
            }
          }
        }
      } catch (streamError) {
        if (finalResult !== null) {
          return finalResult;
        }
        const message = String(streamError.message || "");
        if (message.includes("Premature close") || message.includes("premature close")) {
          throw new Error("智能纠错连接中断，请重试");
        }
        throw streamError;
      }

      if (finalResult === null) {
        finalResult = this.buildSmartCorrectionResultFromModelText(
          paragraphs,
          this.smartCorrectionContentText
        );
      }

      if (finalResult === null) {
        throw new Error("模型未返回纠错结果");
      }

      return finalResult;
    },
    parseCorrectionJsonFromModelText(text) {
      const source = String(text || "").trim();
      if (!source) {
        return null;
      }

      const unfenced = source
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      try {
        return JSON.parse(unfenced);
      } catch (error) {}

      const objectStart = unfenced.indexOf("{");
      const objectEnd = unfenced.lastIndexOf("}");
      if (objectStart !== -1 && objectEnd > objectStart) {
        try {
          return JSON.parse(unfenced.slice(objectStart, objectEnd + 1));
        } catch (error) {}
      }

      return null;
    },
    findSmartFragmentPosition(text, originalFragment, correctedFragment) {
      const source = String(text || "");
      const original = String(originalFragment || "").trim();
      if (!source || !original) {
        return null;
      }

      const directIndex = source.indexOf(original);
      if (directIndex !== -1) {
        return {
          begin_pos: directIndex,
          end_pos: directIndex + original.length,
          original_fragment: original,
          corrected_fragment: String(correctedFragment || "").trim(),
        };
      }

      const normalizedOriginal = original.replace(/\s+/g, "");
      const normalizedSource = source.replace(/\s+/g, "");
      const normalizedIndex = normalizedSource.indexOf(normalizedOriginal);
      if (normalizedIndex === -1) {
        return null;
      }

      let charCount = 0;
      let beginPos = 0;
      let endPos = source.length;
      for (let index = 0; index < source.length; index += 1) {
        if (/\s/.test(source[index])) {
          continue;
        }
        if (charCount === normalizedIndex) {
          beginPos = index;
        }
        if (charCount === normalizedIndex + normalizedOriginal.length) {
          endPos = index;
          break;
        }
        charCount += 1;
      }

      return {
        begin_pos: beginPos,
        end_pos: endPos,
        original_fragment: source.slice(beginPos, endPos),
        corrected_fragment: String(correctedFragment || "").trim(),
      };
    },
    applySmartFragmentsToText(text, fragments) {
      const sortedFragments = [...(fragments || [])].sort(
        (left, right) => Number(left.begin_pos || 0) - Number(right.begin_pos || 0)
      );
      let cursor = 0;
      let result = "";

      sortedFragments.forEach((fragment) => {
        const beginPos = Number(fragment.begin_pos || 0);
        const endPos = Number(fragment.end_pos || beginPos);
        if (beginPos > cursor) {
          result += text.slice(cursor, beginPos);
        }
        result += String(fragment.corrected_fragment || "");
        cursor = Math.max(cursor, endPos);
      });

      if (cursor < text.length) {
        result += text.slice(cursor);
      }

      return result;
    },
    buildSmartCorrectionResultFromModelText(paragraphs, modelText) {
      const modelJson = this.parseCorrectionJsonFromModelText(modelText);
      const modelParagraphs = Array.isArray(modelJson?.paragraphs)
        ? modelJson.paragraphs
        : null;
      if (!modelParagraphs) {
        return null;
      }

      const modelParagraphMap = new Map();
      modelParagraphs.forEach((item, index) => {
        const paragraphIndex = Number(item?.paragraph_index || 0);
        if (Number.isInteger(paragraphIndex) && paragraphIndex > 0) {
          modelParagraphMap.set(paragraphIndex, item);
          return;
        }
        if (modelParagraphs.length === paragraphs.length) {
          modelParagraphMap.set(index + 1, item);
        }
      });

      const paragraphResults = paragraphs.map((paragraph, index) => {
        const modelParagraph =
          modelParagraphMap.get(Number(paragraph.paragraph_index || index + 1)) || {};
        const rawFragments = Array.isArray(modelParagraph.fragments)
          ? modelParagraph.fragments
          : [];
        const fragments = [];

        if ((modelParagraph.has_issue || rawFragments.length > 0) && rawFragments.length > 0) {
          rawFragments.forEach((fragment) => {
            const positioned = this.findSmartFragmentPosition(
              paragraph.text,
              fragment.original_fragment,
              fragment.corrected_fragment
            );
            if (positioned) {
              fragments.push(positioned);
            }
          });
          fragments.sort(
            (left, right) =>
              Number(left.begin_pos || 0) - Number(right.begin_pos || 0)
          );
        }

        return {
          paragraph_index: paragraph.paragraph_index,
          paragraph_id: paragraph.paragraph_id,
          paragraph_hash: paragraph.paragraph_hash,
          original_text: paragraph.text,
          corrected_text:
            fragments.length > 0
              ? this.applySmartFragmentsToText(paragraph.text, fragments)
              : paragraph.text,
          has_issue: fragments.length > 0,
          fragments,
          error: null,
        };
      });

      const corrections = paragraphResults.filter(
        (item) => item.has_issue && !item.error
      );

      return {
        summary: {
          paragraph_count: paragraphs.length,
          batch_count: 1,
          corrected_paragraph_count: corrections.length,
          issue_count: corrections.reduce(
            (total, item) => total + item.fragments.length,
            0
          ),
          error_count: 0,
        },
        paragraph_results: paragraphResults,
        corrections,
        errors: [],
      };
    },
    consumeCorrectionStreamBuffer(buffer) {
      let working = String(buffer || "");
      let result = null;
      let lineBreakIndex = working.indexOf("\n");
      while (lineBreakIndex !== -1) {
        const line = working.slice(0, lineBreakIndex).trim();
        working = working.slice(lineBreakIndex + 1);
        if (line) {
          const lineResult = this.processCorrectionStreamLine(line, result);
          if (lineResult !== result) {
            result = lineResult;
          }
        }
        lineBreakIndex = working.indexOf("\n");
      }
      return { remaining: working, result };
    },
    normalizeCorrectionStreamResult(value, fallbackResult) {
      if (value === undefined || value === null || value === "") {
        return fallbackResult;
      }

      let result = value;
      if (typeof result === "string") {
        try {
          result = JSON.parse(result);
        } catch (error) {
          return fallbackResult;
        }
      }

      if (!result || typeof result !== "object") {
        return fallbackResult;
      }

      const nestedResult =
        result.result ||
        result.data ||
        result.payload ||
        result.output ||
        null;
      if (nestedResult && nestedResult !== result) {
        const normalizedNested = this.normalizeCorrectionStreamResult(
          nestedResult,
          fallbackResult
        );
        if (normalizedNested !== fallbackResult) {
          return normalizedNested;
        }
      }

      if (
        Array.isArray(result.paragraph_results) ||
        Array.isArray(result.corrections) ||
        result.summary
      ) {
        return result;
      }

      return fallbackResult;
    },
    getCorrectionStreamEventText(event) {
      const candidates = [
        event?.content,
        event?.text,
        event?.delta,
        event?.message,
      ];
      const value = candidates.find(
        (item) => item !== undefined && item !== null && item !== ""
      );
      return value === undefined || value === null ? "" : String(value);
    },
    processCorrectionStreamLine(rawLine, fallbackResult) {
      const normalizedLine = String(rawLine || "")
        .trim()
        .replace(/^data:\s*/i, "");
      let event;
      try {
        event = JSON.parse(normalizedLine);
      } catch (error) {
        return fallbackResult;
      }

      if (!event || typeof event !== "object") {
        return fallbackResult;
      }

      const eventType = String(event.type || "").trim();
      if (!eventType) {
        return this.normalizeCorrectionStreamResult(event, fallbackResult);
      }

      if (eventType === "status") {
        // Nothing needed, just for heartbeat
      } else if (
        eventType === "reasoning_delta" ||
        eventType === "thinking_delta"
      ) {
        this.smartThinkingText += this.getCorrectionStreamEventText(event);
        this.$nextTick(function () {
          this.thinkingScrollTop = this.thinkingScrollTop + 99999;
        });
      } else if (
        eventType === "delta" ||
        eventType === "content_delta" ||
        eventType === "message_delta"
      ) {
        const content = this.getCorrectionStreamEventText(event);
        this.smartCorrectionContentText += content;
        if (content) {
          if (!this.smartCorrectionOutputStarted) {
            this.smartCorrectionOutputStarted = true;
            this.smartThinkingText += "\n\n模型输出：\n";
          }
          this.smartThinkingText += content;
          this.$nextTick(function () {
            this.thinkingScrollTop = this.thinkingScrollTop + 99999;
          });
        }
      } else if (
        eventType === "done" ||
        eventType === "complete" ||
        eventType === "completed" ||
        eventType === "result"
      ) {
        return this.normalizeCorrectionStreamResult(event, fallbackResult);
      } else if (eventType === "error") {
        throw new Error(event.message || "智能纠错请求失败");
      }

      return fallbackResult;
    },
  },
  async beforeDestroy() {
    this.stopLockHeartbeat();
    await this.releaseEditLock();
  },
  onLoad(params) {
    this.articleId = Number(params.id || 0);
    this.sourceSessionId = String(params.sourceSessionId || "").trim();
    this.publishSessionId = this.generatePublishSessionId();
    this.initializePage().catch(() => {
      uni.showToast({
        title: "加载发布页失败",
        icon: "none",
        duration: 2000,
      });
    });
  },
  async onUnload() {
    this.stopLockHeartbeat();
    await this.releaseEditLock();
  },
  onHide() {
    this.stopLockHeartbeat();
  },
  onShow() {
    if (this.publishSessionId) {
      this.claimEditLock();
    }
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 180rpx;
  background: #f4f5f7;
  box-sizing: border-box;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  border: 1px solid #e7e9ee;
  box-shadow: 0 6rpx 18rpx rgba(15, 23, 42, 0.04);
}

.article-card {
  background: #ffffff;
}

.eyebrow {
  font-size: 24rpx;
  color: #8a8f98;
  margin-bottom: 12rpx;
}

.article-title {
  font-size: 40rpx;
  color: #1f2937;
  font-weight: 600;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 20rpx;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.section-title {
  font-size: 32rpx;
  color: #1f2937;
  font-weight: 600;
}

.correction-title {
  flex: 0 1 auto;
}

.correction-title-group {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  min-width: 0;
}

.inline-limit-badge {
  flex-shrink: 0;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: #dc2626;
  color: #ffffff;
  font-size: 20rpx;
  line-height: 1.4;
  font-weight: 600;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.mode-grid {
  display: flex;
  gap: 20rpx;
  margin-top: 24rpx;
  flex-wrap: wrap;
}

.mode-card {
  position: relative;
  flex: 1;
  min-width: 240rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  border: 2rpx solid #d9dee7;
  background: #f8fafc;
  box-sizing: border-box;
}

.mode-card.active {
  border-color: #9ca3af;
  background: #eef2f7;
  box-shadow: none;
}

.mode-title {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 600;
}

.mode-badge {
  position: absolute;
  top: 18rpx;
  right: 18rpx;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: #dc2626;
  color: #ffffff;
  font-size: 20rpx;
  line-height: 1.4;
  font-weight: 600;
}

.mode-desc {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.schedule-box {
  margin-top: 24rpx;
}

.schedule-label {
  margin-bottom: 12rpx;
  font-size: 26rpx;
  color: #4b5563;
}

.schedule-picker-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.schedule-picker-card {
  min-height: 120rpx;
  padding: 20rpx 22rpx;
  border-radius: 20rpx;
  background: #f8fafc;
  border: 2rpx solid #d9dee7;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.schedule-picker-caption {
  font-size: 22rpx;
  color: #9ca3af;
}

.schedule-picker-value {
  margin-top: 10rpx;
  font-size: 30rpx;
  line-height: 1.4;
  color: #1f2937;
  font-weight: 600;
}

.schedule-tip {
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.warning-text {
  margin-top: 18rpx;
  font-size: 24rpx;
  color: #c2410c;
  line-height: 1.6;
}

.ghost-button {
  margin: 0;
  flex-shrink: 0;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 24rpx;
  color: #374151 !important;
  border-color: #d1d5db !important;
  background: #ffffff !important;
}

.ghost-button-active {
  color: #1f2937 !important;
  border-color: #6b7280 !important;
  background: #f3f4f6 !important;
}

.smart-toggle {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 6rpx 16rpx 6rpx 20rpx;
  border-radius: 999rpx;
  border: 2rpx solid #d1d5db;
  background: #ffffff;
  flex-shrink: 0;
}

.smart-toggle-loading {
  opacity: 0.6;
  pointer-events: none;
}

.smart-toggle-label {
  font-size: 24rpx;
  color: #4b5563;
  white-space: nowrap;
}

.smart-toggle-track {
  position: relative;
  width: 64rpx;
  height: 34rpx;
  border-radius: 999rpx;
  background: #d1d5db;
  transition: background 0.2s;
}

.smart-toggle-track.active {
  background: #25634a;
}

.smart-toggle-thumb {
  position: absolute;
  top: 3rpx;
  left: 3rpx;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.12);
  transition: transform 0.2s;
}

.smart-toggle-track.active .smart-toggle-thumb {
  transform: translateX(30rpx);
}

.correction-actions-group {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.thinking-panel {
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  border: 1px solid #e5e7eb;
  background: #fafbfc;
  overflow: hidden;
}

.thinking-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 24rpx;
  border-bottom: 1px solid #e5e7eb;
}

.thinking-head-text {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 600;
}

.thinking-head-close {
  font-size: 22rpx;
  color: #9ca3af;
}

.thinking-body {
  width: 100%;
  max-height: 480rpx;
}

.thinking-body-inner {
  padding: 20rpx 24rpx;
  box-sizing: border-box;
  min-height: 100%;
}

.thinking-content {
  font-size: 22rpx;
  line-height: 1.7;
  color: #6b7280;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
}

.thinking-collapsed {
  margin-bottom: 20rpx;
  padding: 18rpx 24rpx;
  border-radius: 20rpx;
  border: 1px dashed #d1d5db;
  background: #fafbfc;
}

.thinking-collapsed-text {
  font-size: 24rpx;
  color: #9ca3af;
}

.status-box {
  padding: 26rpx 24rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  line-height: 1.7;
  background: #f8fafc;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.success-box {
  background: #f3f7f4;
  color: #2f5d46;
  border-color: #d6e6db;
}

.error-box {
  background: #faf3f2;
  color: #b4533c;
  border-color: #ecd4cf;
}

.correction-status {
  margin-bottom: 20rpx;
}

.correction-list {
  margin-top: 0;
}

.card-footnote {
  margin-top: 20rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: #8a8f98;
}

.correction-item {
  padding: 24rpx;
  border-radius: 20rpx;
  background: #fbfbfc;
  border: 1px solid #e7e9ee;
  margin-bottom: 18rpx;
}

.correction-item-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20rpx;
}

.correction-item-title {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12rpx;
}

.paragraph-tag {
  font-size: 24rpx;
  color: #4b5563;
  background: #edf1f5;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
}

.issue-tag {
  font-size: 24rpx;
  color: #b4533c;
}

.ignore-button {
  display: flex !important;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 56rpx;
  line-height: 56rpx;
  padding: 0 22rpx;
  color: #4b5563 !important;
  border-color: #d1d5db !important;
  background: #ffffff !important;
}

.correction-markup {
  margin-top: 16rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10rpx 0;
  font-size: 26rpx;
  line-height: 1.8;
  color: #374151;
}

.detail-markup {
  margin-top: 0;
}

.markup-plain {
  color: #374151;
  white-space: pre-wrap;
}

.markup-correction {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  margin: 0 8rpx;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  vertical-align: middle;
}

.markup-original,
.markup-suggestion,
.markup-arrow {
  font-size: 24rpx;
  line-height: 1.5;
}

.markup-original {
  color: #b4533c;
  text-decoration: line-through;
}

.markup-suggestion {
  color: #25634a;
  font-weight: 600;
}

.markup-arrow {
  color: #9ca3af;
}

.correction-actions {
  margin-top: 16rpx;
}

.apply-button,
.detail-apply-button {
  display: flex !important;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 26rpx;
  color: #fff !important;
  background: #4b5563 !important;
  border: none !important;
  border-radius: 999rpx;
}

.detail-apply-button {
  width: 100%;
  height: 84rpx;
  margin-top: 18rpx;
  line-height: 84rpx;
  font-size: 28rpx;
}

.detail-entry {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 24rpx calc(28rpx + env(safe-area-inset-bottom));
  background: rgba(244, 245, 247, 0.96);
  border-top: 1px solid #e5e7eb;
  box-shadow: none;
  box-sizing: border-box;
  min-height: 132rpx;
}

.primary-button,
.secondary-button {
  display: flex !important;
  align-items: center;
  justify-content: center;
  flex: 1;
  border-radius: 999rpx;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  padding: 0 28rpx;
}

.primary-button {
  color: #fff;
  background: #374151;
}

.secondary-button {
  color: #374151;
  background: #ffffff;
  border: 2rpx solid #d1d5db;
}

.detail-panel {
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 28rpx 28rpx 40rpx;
  border-top: 1px solid #e5e7eb;
}

.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
}

.detail-title {
  font-size: 34rpx;
  color: #1f2937;
  font-weight: 600;
}

.detail-head-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.detail-close {
  font-size: 26rpx;
  color: #6b7280;
}

.detail-scroll {
  max-height: 70vh;
  margin-top: 24rpx;
}

.detail-section {
  margin-bottom: 28rpx;
}

.detail-label {
  margin-bottom: 12rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.detail-text {
  padding: 20rpx;
  border-radius: 18rpx;
  background: #f8fafc;
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  white-space: pre-wrap;
  border: 1px solid #e5e7eb;
}

.corrected-text {
  background: #f3f7f4;
  color: #25634a;
  border-color: #d6e6db;
}

.fragment-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 18rpx 20rpx;
  border-radius: 18rpx;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  margin-bottom: 14rpx;
}

.fragment-original,
.fragment-corrected {
  flex: 1;
  font-size: 26rpx;
  line-height: 1.6;
}

.fragment-original {
  color: #b4533c;
}

.fragment-corrected {
  color: #25634a;
}

.fragment-arrow {
  color: #9ca3af;
  font-size: 26rpx;
}
</style>
