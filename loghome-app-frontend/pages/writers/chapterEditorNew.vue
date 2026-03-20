<template>
  <div
    class="outer"
    :class="writerSettings.theme"
    :style="pageStyle"
    @touchstart="
      documentOnPress = true;
      clearEditorImagesEditButton();
    "
    @touchend="documentOnPress = false"
  >
    <div class="topBar">
      <input
        class="input"
        placeholder="章节标题"
        v-model="article.title"
        @input="handleTitleInput"
        :style="{ fontSize: writerSettings.fontSize + 'rpx' }"
      />
      <div class="textCount">
        {{ textCount }}&nbsp;字 | {{ imageCount }}&nbsp;图
        <div class="saveNotify">
          <complete-icon
            ref="completeIcon"
            style="margin-right: 5rpx; transform: translateY(5rpx)"
          ></complete-icon>
        </div>
      </div>
    </div>

    <div class="middleBar">
      <editor-content
        v-if="editor"
        :editor="editor"
        class="textarea"
        :style="{ '--editor-font-size': writerSettings.fontSize + 'rpx' }"
        :class="{ symbolsShown: writerSettings.showSymbols }"
      ></editor-content>
      <div
        v-else
        class="textarea"
        :style="{ '--editor-font-size': writerSettings.fontSize + 'rpx' }"
        :class="{ symbolsShown: writerSettings.showSymbols }"
      ></div>

      <div
        class="punctuationToolBar"
        v-show="writerSettings.showSymbols"
        :class="writerSettings.theme"
      >
        <p
          style="font-family: iconfont !important; font-size: 50rpx"
          @click="insertPunctuation('　　')"
        >
          &#xe62b;
        </p>
        <p
          v-for="(item, index) in punctuations"
          :key="index"
          @click="insertPunctuation(item)"
        >
          {{ item }}
        </p>
      </div>
    </div>

    <uni-popup ref="setPopup" type="bottom">
      <view class="settingBar">
        <div class="line">
          <div
            class="button blue theme"
            @click="changeTheme('blue')"
            :class="{ selected: writerSettings.theme === 'blue' }"
          >
            蓝
          </div>
          <div
            class="button yellow theme"
            @click="changeTheme('yellow')"
            :class="{ selected: writerSettings.theme === 'yellow' }"
          >
            黄
          </div>
          <div
            class="button green theme"
            @click="changeTheme('green')"
            :class="{ selected: writerSettings.theme === 'green' }"
          >
            绿
          </div>
          <div
            class="button purple theme"
            @click="changeTheme('purple')"
            :class="{ selected: writerSettings.theme === 'purple' }"
          >
            紫
          </div>
          <div
            class="button black theme"
            @click="changeTheme('black')"
            :class="{ selected: writerSettings.theme === 'black' }"
          >
            黑
          </div>
          <div
            class="button white theme"
            @click="changeTheme('white')"
            :class="{ selected: writerSettings.theme === 'white' }"
          >
            白
          </div>
        </div>
        <div class="normalLine">
          <div class="left">字体大小</div>
          <div class="right">
            <el-slider
              v-model="writerSettings.fontSize"
              :min="31"
              :max="49"
              :step="2"
              show-stops
              :show-tooltip="false"
              @change="fontSizeChanged"
            ></el-slider>
          </div>
        </div>
        <div class="lrLine">
          <div class="left">显示标点符号快捷栏</div>
          <div class="right">
            <el-switch
              v-model="writerSettings.showSymbols"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="fontSizeChanged"
            ></el-switch>
          </div>
        </div>
        <div class="line">自动排版设置</div>
        <div class="lrLine">
          <div class="left">段间空行</div>
          <div class="right">
            <el-switch
              v-model="writerSettings.openTypeSet"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="fontSizeChanged"
            ></el-switch>
          </div>
        </div>
      </view>
    </uni-popup>

    <uni-popup ref="schedulePopup" type="center">
      <view
        class="schedule-box"
        style="
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          width: 300px;
        "
      >
        <view style="margin-bottom: 15px; font-weight: bold; text-align: center"
          >选择定时发布时间</view
        >
        <view style="margin-bottom: 20px">
          <el-date-picker
            v-model="scheduleTime"
            type="datetime"
            placeholder="选择定时发布时间"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm"
          >
          </el-date-picker>
        </view>
        <view style="display: flex; justify-content: space-between">
          <button size="mini" @click="$refs.schedulePopup.close()">取消</button>
          <button size="mini" type="primary" @click="confirmSchedule">
            确定
          </button>
        </view>
      </view>
    </uni-popup>

    <conflict-dialog ref="conflictDialog"></conflict-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { Editor, EditorContent, Extension } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import conflictDialog from "../../components/conflictDialog.vue";
import completeIcon from "../../components/completeIcon.vue";
import { getServerTime } from "../../lib/utils.js";
import { writerArticleDB } from "../../lib/db.js";
import { createTreeExpReporter } from "../../lib/treeExpReporter.js";
import {
  countLegacyContent,
  docToLegacyBlocks,
  formatLegacyBlocks,
  legacyBlocksToDoc,
  parseLegacyContent,
  stringifyLegacyContent,
} from "../../lib/writerEditorLegacyAdapter.js";

const NewParagraphSpace = Extension.create({
  name: "newParagraphSpace",
  // Ensure this Enter handler runs before StarterKit keymaps.
  priority: 1000,
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { selection } = this.editor.state;
        const { $from } = selection;

        if (
          $from.parent.type.name !== "paragraph" ||
          $from.parent.textContent === ""
        ) {
          return false;
        }

        return this.editor
          .chain()
          .splitBlock()
          .insertContent("\u3000\u3000")
          .run();
      },
    };
  },
});

const DEFAULT_SETTINGS = {
  version: 24031701,
  showSymbols: true,
  fontSize: 35,
  openTypeSet: false,
  showFab: false,
  theme: "yellow",
  codeMode: false,
};

const DEFAULT_CONTENT = stringifyLegacyContent([{ type: "text", value: "" }]);
const INPUT_SYNC_DELAY_MS = 350;
const SYNC_PENDING_MAX_AGE_MS = 3 * 60 * 1000;

export default {
  components: {
    EditorContent,
    conflictDialog,
    completeIcon,
  },
  data() {
    return {
      chapterId: 0,
      scheduleTime: null,
      editor: null,
      article: {
        article_id: 0,
        title: "",
        content: DEFAULT_CONTENT,
        novel_info: {},
        is_draft: 1,
      },
      textCount: 0,
      imageCount: 0,
      punctuations: ["，", "。", "、", "！", "？", "：", "“”", "《》"],
      saveInterval: undefined,
      loadComplete: false,
      lastSaveTime: new Date(),
      lastInputTime: new Date(),
      lastUploadTime: new Date(),
      hasNewInput: false,
      contentVersion: 0,
      saveNotifyText: "已保存",
      notIncrementalChangeCount: 0,
      frameInfo: {
        isEnabled: false,
      },
      writerSettings: { ...DEFAULT_SETTINGS },
      themes: {
        blue: {
          backColor: "#c4e8fe",
          color: "#115574",
        },
        yellow: {
          backColor: "#FFEFD6",
          color: "#502727",
        },
        green: {
          backColor: "#b7f7c1",
          color: "#093811",
        },
        purple: {
          backColor: "#fde0ff",
          color: "#310024",
        },
        black: {
          backColor: "#282C35",
          color: "#cecece",
        },
        white: {
          backColor: "#ffffff",
          color: "#000000",
        },
      },
      imageEditInterval: undefined,
      documentOnPress: false,
      inputSyncTimer: undefined,
      syncTaskPromise: null,
    };
  },
  computed: {
    currentTheme() {
      return this.themes[this.writerSettings.theme] || this.themes.yellow;
    },
    pageStyle() {
      return {
        transition: "background-color .5s, color .5s",
        "--statusBarHeight": 0 + "px",
      };
    },
  },
  async beforeDestroy() {
    await this.stopWritingTimer();
    await this.endLocalSaveTimer();
    clearTimeout(this.inputSyncTimer);
    clearInterval(this.imageEditInterval);
    this.clearEditorImagesEditButton();
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    window.removeEventListener("message", this.handleParentMessage);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.handlePageHide);
  },
  methods: {
    initializeWriterSettings() {
      const raw = window.localStorage.getItem("writerSettings");
      if (!raw) {
        this.writerSettings = { ...DEFAULT_SETTINGS };
        window.localStorage.setItem(
          "writerSettings",
          JSON.stringify(this.writerSettings)
        );
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        this.writerSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          version: DEFAULT_SETTINGS.version,
        };
      } catch (error) {
        this.writerSettings = { ...DEFAULT_SETTINGS };
      }

      window.localStorage.setItem(
        "writerSettings",
        JSON.stringify(this.writerSettings)
      );
    },
    handleTitleInput() {
      this.markWritingActivity();
      this.hasNewInput = true;
      this.lastInputTime = new Date();
      this.contentVersion += 1;
      this.markSyncPending();
      this.scheduleInputSync();
    },
    getSyncPendingStorageKey(articleId = this.chapterId) {
      return `writer_sync_pending_${Number(articleId || 0)}`;
    },
    getSyncPendingState(articleId = this.chapterId) {
      if (!articleId) return null;
      const raw = window.localStorage.getItem(
        this.getSyncPendingStorageKey(articleId)
      );
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (error) {
        return null;
      }
    },
    setSyncPendingState(pending, createTime = "") {
      if (!this.chapterId) return;
      window.localStorage.setItem(
        this.getSyncPendingStorageKey(),
        JSON.stringify({
          pending: Boolean(pending),
          updated_at: Date.now(),
          create_time: createTime || "",
        })
      );
    },
    hasPendingSync(maxAgeMs = SYNC_PENDING_MAX_AGE_MS) {
      const state = this.getSyncPendingState();
      if (!state || state.pending !== true) return false;
      if (!state.updated_at) return true;
      return Date.now() - Number(state.updated_at) <= maxAgeMs;
    },
    markSyncPending() {
      this.setSyncPendingState(true);
    },
    markSyncSynced(currentServerTime) {
      this.setSyncPendingState(false, currentServerTime || "");
    },
    scheduleInputSync() {
      clearTimeout(this.inputSyncTimer);
      this.inputSyncTimer = setTimeout(() => {
        this.flushDraftToCloud({
          isFastSave: true,
          forceSlowSave: false,
          waitForBusy: false,
        });
      }, INPUT_SYNC_DELAY_MS);
    },
    handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        this.flushDraftToCloud({
          isFastSave: true,
          forceSlowSave: false,
          waitForBusy: false,
        });
      }
    },
    handlePageHide() {
      this.flushDraftToCloud({
        isFastSave: true,
        forceSlowSave: false,
        waitForBusy: false,
      });
    },
    async executeSyncTask(task, waitForBusy = false) {
      if (this.syncTaskPromise) {
        if (!waitForBusy) {
          return;
        }
        try {
          await this.syncTaskPromise;
        } catch (error) {}
      }

      if (this.syncTaskPromise && !waitForBusy) {
        return;
      }

      this.syncTaskPromise = (async () => {
        try {
          await task();
        } finally {
          this.syncTaskPromise = null;
        }
      })();

      return this.syncTaskPromise;
    },
    async flushDraftToCloud({
      isFastSave = true,
      forceSlowSave = false,
      waitForBusy = false,
    } = {}) {
      if (!this.loadComplete) return;
      if (!forceSlowSave && !this.hasNewInput && !this.hasPendingSync()) {
        return;
      }

      return this.executeSyncTask(async () => {
        const hasPendingBeforeSync = this.hasNewInput || this.hasPendingSync();
        if (!forceSlowSave && !hasPendingBeforeSync) {
          return;
        }

        const currentServerTime = await getServerTime();
        if (!currentServerTime) {
          return;
        }

        if (forceSlowSave) {
          await this.slowSaveLocalArticle(currentServerTime, true);
          await this.uploadArticleWriter(
            currentServerTime,
            false,
            true,
            this.contentVersion
          );
          return;
        }

        await this.saveLocalArticle(currentServerTime);
        await this.uploadArticleWriter(
          currentServerTime,
          isFastSave,
          false,
          this.contentVersion
        );
      }, waitForBusy);
    },
    markWritingActivity() {
      if (this.writeExpReporter) {
        this.writeExpReporter.markActive();
      }
    },
    startWritingTimer() {
      if (!this.writeExpReporter) {
        this.writeExpReporter = createTreeExpReporter(this, "write_seconds", {
          activeWindowMs: 45000,
        });
      }
      this.writeExpReporter.start();
      this.writeExpReporter.markActive();
    },
    async stopWritingTimer() {
      if (this.writeExpReporter) {
        await this.writeExpReporter.stop();
      }
    },
    checkFrameEnvironment() {
      if (window.self !== window.top) {
        window.removeEventListener("message", this.handleParentMessage);
        window.addEventListener("message", this.handleParentMessage);
        setTimeout(() => {
          this.sendMessageToParent({
            type: "iframe_ready",
            source: "chapterEditor",
          });
        }, 500);
      }
    },
    handleParentMessage(event) {
      if (
        event.data.type === "frame_confirmed" &&
        (event.data.target === "chapterEditorNew" ||
          event.data.target === "chapterEditor")
      ) {
        this.frameInfo.isEnabled = true;
        if (this.chapterId) {
          this.sendCurrentArticleInfo();
        }
      }
    },
    sendMessageToParent(message) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, "*");
      }
    },
    sendCurrentArticleInfo() {
      if (this.frameInfo.isEnabled && this.chapterId) {
        this.sendMessageToParent({
          type: "current_selected",
          source: "chapterEditor",
          data: {
            article_id: this.chapterId,
          },
        });
      }
    },
    formatCreateTime(dateString) {
      dateString = String(dateString || "");
      if (dateString.length < 12) return dateString;
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hours = dateString.substring(8, 10);
      const minutes = dateString.substring(10, 12);
      const seconds =
        dateString.length >= 14 ? dateString.substring(12, 14) : "00";
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    buildArticle(raw) {
      const article = raw || {};
      return {
        ...article,
        article_id: Number(article.article_id || this.chapterId),
        title: article.title || "",
        content: article.content || DEFAULT_CONTENT,
        novel_info: article.novel_info || {},
        is_draft: article.is_draft == null ? 1 : article.is_draft,
      };
    },
    refreshCounts() {
      const stats = countLegacyContent(
        parseLegacyContent(this.article.content)
      );
      this.textCount = stats.textCount;
      this.imageCount = stats.imageCount;
    },
    createEditorFromArticle() {
      if (this.editor) {
        this.editor.destroy();
      }

      this.editor = new Editor({
        extensions: [
          StarterKit.configure({
            blockquote: false,
            bold: false,
            bulletList: false,
            code: false,
            codeBlock: false,
            heading: false,
            horizontalRule: false,
            italic: false,
            listItem: false,
            orderedList: false,
            strike: false,
          }),
          Image.configure({
            inline: false,
          }),
          NewParagraphSpace,
        ],
        content: legacyBlocksToDoc(parseLegacyContent(this.article.content)),
        editorProps: {
          attributes: {
            class: "writer-prosemirror",
            style:
              "outline:none;box-shadow:none;border:none;max-width:100%;overflow-x:hidden;-webkit-tap-highlight-color:transparent;",
          },
        },
        onCreate: ({ editor }) => {
          const blocks = docToLegacyBlocks(editor.getJSON());
          this.article.content = stringifyLegacyContent(blocks);
          this.refreshCounts();
        },
        onUpdate: ({ editor }) => {
          const blocks = docToLegacyBlocks(editor.getJSON());
          this.article.content = stringifyLegacyContent(blocks);
          this.hasNewInput = true;
          this.lastInputTime = new Date();
          this.contentVersion += 1;
          this.markSyncPending();
          this.scheduleInputSync();
          this.markWritingActivity();
          this.refreshCounts();
        },
      });
    },
    applyLegacyContentToEditor(blocks, emitUpdate = false) {
      const normalized = parseLegacyContent(blocks);
      this.article.content = stringifyLegacyContent(normalized);
      this.refreshCounts();

      if (!this.editor) {
        this.createEditorFromArticle();
        return;
      }

      this.editor.commands.setContent(
        legacyBlocksToDoc(normalized),
        emitUpdate
      );
    },
    async getArticleWriter() {
      let tk = JSON.parse(window.localStorage.getItem("token"));
      if (tk) tk = tk.tk;
      return axios.get(
        this.$baseUrl + "/essays/get_article_writer?id=" + this.chapterId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tk,
          },
        }
      );
    },
    async getArticle() {
      let tk = JSON.parse(window.localStorage.getItem("token"));
      if (tk) tk = tk.tk;
      return axios.get(
        this.$baseUrl + "/essays/get_article?id=" + this.chapterId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tk,
          },
        }
      );
    },
    async syncArticleWriter() {
      const currentServerTime = await getServerTime();
      let tk = JSON.parse(window.localStorage.getItem("token"));
      if (tk) tk = tk.tk;
      return axios.post(
        this.$baseUrl + "/essays/sync_article_writer_from_reader",
        {
          article_id: this.chapterId,
          create_time: currentServerTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tk,
          },
        }
      );
    },
    async uploadArticleWriter(
      currentServerTime,
      isFastSave = false,
      isForce = false,
      snapshotVersion = this.contentVersion
    ) {
      this.lastUploadTime = new Date();
      let tk = JSON.parse(window.localStorage.getItem("token"));
      if (tk) tk = tk.tk;

      try {
        const response = await axios.post(
          this.$baseUrl + "/essays/upload_article_writer",
          {
            article_id: this.chapterId,
            title: this.article.title,
            content: this.article.content,
            create_time: currentServerTime,
            novel_id: this.article.novel_info.novel_id || this.article.novel_id,
            is_fast_save: isFastSave,
            is_force: isForce,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );

        if (snapshotVersion >= this.contentVersion) {
          this.hasNewInput = false;
          this.markSyncSynced(currentServerTime);
        } else {
          this.markSyncPending();
        }

        return response;
      } catch (error) {
        this.markSyncPending();
        throw error;
      }
    },
    async initializeArticle() {
      uni.showLoading({
        title: "编辑器初始化",
      });

      try {
        let res = await this.getArticleWriter();
        let fallbackReaderArticle;

        const localArticles = await writerArticleDB.articles
          .where("article_id")
          .equals(Number(this.chapterId))
          .toArray();

        let latestLocalArticle = undefined;
        if (localArticles.length > 0) {
          latestLocalArticle = localArticles.reduce((latest, current) => {
            return latest.create_time > current.create_time ? latest : current;
          });
        }

        let hasLocalContent = latestLocalArticle !== undefined;
        let hasCloudContent = res.data !== "no data";

        if (!hasCloudContent) {
          const articleRes = await this.getArticle();
          const articleData = Array.isArray(articleRes.data)
            ? articleRes.data[0]
            : articleRes.data;
          if (articleData && articleData.article_id) {
            fallbackReaderArticle = articleData;
          }
        }

        if (
          hasCloudContent &&
          hasLocalContent &&
          latestLocalArticle.content !== res.data.content
        ) {
          const localStats = countLegacyContent(
            parseLegacyContent(latestLocalArticle.content)
          );
          const cloudStats = countLegacyContent(
            parseLegacyContent(res.data.content)
          );

          const action = await new Promise((resolve) => {
            this.$refs.conflictDialog.show({
              title: "版本冲突提示",
              type: "conflict",
              local: {
                time: this.formatCreateTime(latestLocalArticle.create_time),
                isNewer:
                  String(latestLocalArticle.create_time) >
                  String(res.data.create_time),
                textCount: localStats.textCount,
                imageCount: localStats.imageCount,
              },
              cloud: {
                time: this.formatCreateTime(res.data.create_time),
                isNewer:
                  String(res.data.create_time) >
                  String(latestLocalArticle.create_time),
                textCount: cloudStats.textCount,
                imageCount: cloudStats.imageCount,
              },
              callback: resolve,
            });
          });

          if (action === "local") {
            this.article = this.buildArticle({
              ...res.data,
              ...latestLocalArticle,
            });
          } else {
            this.article = this.buildArticle(res.data);
          }

          const currentServerTime = await getServerTime();
          await this.slowSaveLocalArticle(currentServerTime, true);
          await this.uploadArticleWriter(currentServerTime, false, true);
        } else if (hasCloudContent && !hasLocalContent) {
          this.article = this.buildArticle(res.data);
        } else if (hasCloudContent && hasLocalContent) {
          this.article = this.buildArticle({
            ...res.data,
            ...latestLocalArticle,
          });
        } else if (fallbackReaderArticle && hasLocalContent) {
          this.article = this.buildArticle({
            ...fallbackReaderArticle,
            ...latestLocalArticle,
          });
        } else if (fallbackReaderArticle) {
          this.article = this.buildArticle(fallbackReaderArticle);
        } else {
          this.article = this.buildArticle();
        }

        this.refreshCounts();
        this.createEditorFromArticle();
        this.startLocalSaveTimer();
        this.loadComplete = true;
        uni.hideLoading();
        this.sendCurrentArticleInfo();
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.toString(),
          icon: "none",
          duration: 2000,
        });
      }
    },
    isArticleContentEmpty() {
      const blocks = parseLegacyContent(this.article.content);
      return !blocks.some(
        (block) => block.type === "image" || block.value.trim()
      );
    },
    confirmSchedule() {
      if (!this.scheduleTime) {
        uni.showToast({
          title: "请选择时间",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      this.save(1, "定时发布设置成功", this.scheduleTime);
      this.$refs.schedulePopup.close();
    },
    save(drafting, msg, scheduleTime = null) {
      if (
        this.article.title.replace(/(^\s*)|(\s*$)/g, "") === "" ||
        this.isArticleContentEmpty()
      ) {
        uni.showToast({
          title: "标题或文章内容不能为空",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      let tk = JSON.parse(window.localStorage.getItem("token"));
      if (tk) tk = tk.tk;

      axios
        .post(
          this.$baseUrl + "/essays/modify_article",
          {
            title: this.article.title,
            content: this.article.content,
            is_draft: drafting,
            article_id: this.chapterId,
            schedule_time: scheduleTime,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        )
        .then(async () => {
          uni.showToast({
            title: msg,
            icon: "none",
            duration: 2000,
          });
          await this.endLocalSaveTimer();
          setTimeout(() => {
            uni.navigateBack({});
          }, 2000);
        })
        .catch(() => {
          uni.showToast({
            title: "章节上传失败，请重试",
            icon: "none",
            duration: 2000,
          });
        });
    },
    insertPunctuation(punctuation) {
      if (!this.editor) return;

      const isPair = punctuation === "“”" || punctuation === "《》";
      if (isPair) {
        const from = this.editor.state.selection.from;
        this.editor
          .chain()
          .focus()
          .insertContent(punctuation)
          .setTextSelection(from + 1)
          .run();
        return;
      }

      this.editor.chain().focus().insertContent(punctuation).run();
    },
    formatEssay() {
      const formatted = formatLegacyBlocks(
        parseLegacyContent(this.article.content),
        {
          addParagraphSpacing: this.writerSettings.openTypeSet,
        }
      );

      this.applyLegacyContentToEditor(formatted, false);
      uni.showToast({
        title: "自动排版完成",
        icon: "none",
        duration: 2000,
      });
    },
    async saveLocalArticle(currentServerTime) {
      this.lastSaveTime = new Date();

      try {
        const currentContent = parseLegacyContent(this.article.content);
        const articleId = Number(this.article.article_id || this.chapterId);

        const localArticles = await writerArticleDB.articles
          .where("article_id")
          .equals(articleId)
          .and((article) => article.is_slow_save !== true)
          .toArray();

        if (localArticles.length === 0) {
          await writerArticleDB.articles.add({
            article_id: articleId,
            title: this.article.title,
            content: this.article.content,
            create_time: currentServerTime,
            is_slow_save: false,
          });
          this.updateSaveNotify("已保存更改", true);
          return;
        }

        const latestLocalArticle = localArticles.reduce((latest, current) => {
          return latest.create_time > current.create_time ? latest : current;
        });

        const localContent = parseLegacyContent(latestLocalArticle.content);
        const localItemMap = new Map();
        let isIncrementalChange = true;
        let hasNewContent = false;

        localContent.forEach((item, index) => {
          const key =
            item.type === "text" ? `text_${item.value}` : `image_${item.img}`;
          if (!localItemMap.has(key)) {
            localItemMap.set(key, []);
          }
          localItemMap.get(key).push(index);
        });

        const lcs = [];
        const matchedLocal = new Set();

        const isTextIncremental = (oldText, newText) => {
          if (newText.length < oldText.length) return false;
          let i = 0;
          let j = 0;
          while (i < oldText.length && j < newText.length) {
            if (oldText[i] === newText[j]) {
              i += 1;
              j += 1;
            } else {
              j += 1;
            }
          }
          return i === oldText.length;
        };

        currentContent.forEach((currentItem, currentIndex) => {
          if (currentItem.type === "image") {
            const key = `image_${currentItem.img}`;
            if (localItemMap.has(key)) {
              for (const localIndex of localItemMap.get(key)) {
                if (!matchedLocal.has(localIndex)) {
                  lcs.push({ currentIndex, localIndex });
                  matchedLocal.add(localIndex);
                  break;
                }
              }
            }
            return;
          }

          const key = `text_${currentItem.value}`;
          if (localItemMap.has(key)) {
            for (const localIndex of localItemMap.get(key)) {
              if (!matchedLocal.has(localIndex)) {
                lcs.push({ currentIndex, localIndex });
                matchedLocal.add(localIndex);
                break;
              }
            }
            return;
          }

          for (let i = 0; i < localContent.length; i += 1) {
            if (!matchedLocal.has(i) && localContent[i].type === "text") {
              if (isTextIncremental(localContent[i].value, currentItem.value)) {
                lcs.push({ currentIndex, localIndex: i });
                matchedLocal.add(i);
                break;
              }
            }
          }
        });

        lcs.sort((a, b) => a.localIndex - b.localIndex);
        let internalIncrementalCount = 0;
        lcs.forEach((match) => {
          const localItem = localContent[match.localIndex];
          const currentItem = currentContent[match.currentIndex];
          if (
            localItem.type === "text" &&
            currentItem.type === "text" &&
            localItem.value !== currentItem.value
          ) {
            internalIncrementalCount += 1;
          }
        });

        hasNewContent =
          currentContent.length > lcs.length || internalIncrementalCount > 0;
        if (latestLocalArticle.title !== this.article.title) {
          hasNewContent = true;
        }

        isIncrementalChange = matchedLocal.size === localContent.length;
        if (matchedLocal.size < localContent.length) {
          isIncrementalChange = false;
        }

        if (isIncrementalChange && hasNewContent) {
          await writerArticleDB.articles.delete(latestLocalArticle.id);
          await writerArticleDB.articles.add({
            article_id: articleId,
            title: this.article.title,
            content: this.article.content,
            create_time: currentServerTime,
            is_slow_save: false,
          });
          this.updateSaveNotify("已保存更改", true);
        } else if (!isIncrementalChange) {
          this.notIncrementalChangeCount += 1;
          if (this.notIncrementalChangeCount >= 10) {
            this.notIncrementalChangeCount = 0;
            await this.slowSaveLocalArticle(currentServerTime);
            await this.uploadArticleWriter(currentServerTime);
            return;
          }

          await writerArticleDB.articles.delete(latestLocalArticle.id);
          await writerArticleDB.articles.add({
            article_id: articleId,
            title: this.article.title,
            content: this.article.content,
            create_time: currentServerTime,
            is_slow_save: false,
          });
          this.updateSaveNotify("已保存更改", true);
        }
      } catch (error) {
        console.error("保存本地文章时出错:", error);
      }
    },
    async slowSaveLocalArticle(currentServerTime, isForce) {
      try {
        const articleId = Number(this.article.article_id || this.chapterId);

        if (!isForce) {
          const localArticles = await writerArticleDB.articles
            .where("article_id")
            .equals(articleId)
            .toArray();

          let latestLocalArticle = null;
          if (localArticles.length > 0) {
            latestLocalArticle = localArticles.reduce((prev, current) => {
              return prev.create_time > current.create_time ? prev : current;
            });
          }

          if (
            latestLocalArticle &&
            latestLocalArticle.content === this.article.content &&
            latestLocalArticle.title === this.article.title
          ) {
            return;
          }
        }

        await writerArticleDB.articles.add({
          article_id: articleId,
          title: this.article.title,
          content: this.article.content,
          create_time: currentServerTime,
          is_slow_save: true,
        });
      } catch (error) {
        console.error("慢保存本地文章时出错:", error);
      }
    },
    startLocalSaveTimer() {
      this.saveInterval = setInterval(async () => {
        if (new Date() - this.lastInputTime > 1000 && this.hasNewInput) {
          await this.flushDraftToCloud({
            isFastSave: true,
            forceSlowSave: false,
            waitForBusy: false,
          });
          return;
        }

        if (
          new Date() - this.lastSaveTime > 10000 &&
          (this.hasNewInput || this.hasPendingSync())
        ) {
          await this.flushDraftToCloud({
            isFastSave: true,
            forceSlowSave: false,
            waitForBusy: false,
          });
        }
      }, 1000);
    },
    async endLocalSaveTimer() {
      clearInterval(this.saveInterval);
      clearTimeout(this.inputSyncTimer);
      if (this.loadComplete) {
        await this.flushDraftToCloud({
          isFastSave: false,
          forceSlowSave: true,
          waitForBusy: true,
        });
      }
    },
    fontSizeChanged() {
      window.localStorage.setItem(
        "writerSettings",
        JSON.stringify(this.writerSettings)
      );
    },
    changeTheme(themeName) {
      this.writerSettings.theme = themeName;
      window.localStorage.setItem(
        "writerSettings",
        JSON.stringify(this.writerSettings)
      );
      this.applyNavigationBarTheme();
    },
    applyNavigationBarTheme() {
      const pageHead = document.getElementsByClassName("uni-page-head")[0];
      if (!pageHead) return;

      const pageHeadBtn = document.querySelectorAll(
        ".uni-page-head .uni-btn-icon"
      );
      pageHeadBtn.forEach((element) => {
        element.style.color = this.currentTheme.color;
      });

      pageHead.style.backgroundColor = this.currentTheme.backColor;
      if (window.jsBridge && window.jsBridge.inApp) {
        jsBridge.setSystemUIStyle(
          this.currentTheme.backColor,
          this.currentTheme.color
        );
      }
    },
    clearEditorImagesEditButton() {
      const existingButtons = document.querySelectorAll(".image-edit-button");
      existingButtons.forEach((button) => button.remove());
    },
    showEditorImagesEditButton() {
      this.clearEditorImagesEditButton();

      if (this.documentOnPress || !this.editor || !this.editor.view) return;

      const editorElement = document.querySelector(".writer-prosemirror");
      const editorContainer = editorElement
        ? editorElement.closest(".textarea")
        : null;
      if (!editorElement || !editorContainer) return;

      const images = editorElement.getElementsByTagName("img");
      Array.from(images).forEach((img) => {
        const rect = img.getBoundingClientRect();
        const editorRect = editorElement.getBoundingClientRect();
        const containerRect = editorContainer.getBoundingClientRect();
        const buttonSize = 30;
        const buttonOffset = 5;
        const isVisible =
          rect.top <= editorRect.bottom &&
          rect.bottom >= editorRect.top &&
          rect.left <= editorRect.right &&
          rect.right >= editorRect.left;

        if (!isVisible) return;

        const imageLeft = rect.left - containerRect.left + editorContainer.scrollLeft;
        const imageTop = rect.top - containerRect.top + editorContainer.scrollTop;
        const imageWidth = rect.width;
        const imageHeight = rect.height;

        const buttonLeft = imageLeft + imageWidth - buttonSize - buttonOffset - 35;
        const buttonTop = imageTop + imageHeight - buttonSize - buttonOffset;

        const buttonRight = buttonLeft + buttonSize;
        const buttonBottom = buttonTop + buttonSize;

        const buttonFullyInsideImage = buttonRight <= imageLeft + imageWidth && buttonBottom <= imageTop + imageHeight;

        if (!buttonFullyInsideImage) return;

        const editButton = document.createElement("div");
        editButton.className = "image-edit-button";
        editButton.style.cssText = `
          position: absolute;
          left: ${buttonLeft}px;
          top: ${buttonTop}px;
          width: ${buttonSize}px;
          height: ${buttonSize}px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          z-index: 9999;
        `;
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
        editorContainer.appendChild(editButton);

        editButton.addEventListener("touchstart", (event) => {
          event.stopPropagation();
        });
        editButton.addEventListener("click", (event) => {
          event.stopPropagation();

          uni.showActionSheet({
            itemList: ["删除图片", "在下方插入段"],
            success: (res) => {
              const imagePos = this.editor.view.posAtDOM(img, 0);
              const imageNode = this.editor.state.doc.nodeAt(imagePos);
              const insertPos = imagePos + (imageNode ? imageNode.nodeSize : 1);

              if (res.tapIndex === 0) {
                this.editor
                  .chain()
                  .focus()
                  .deleteRange({
                    from: imagePos,
                    to: imagePos + (imageNode ? imageNode.nodeSize : 1),
                  })
                  .run();
                this.clearEditorImagesEditButton();
                return;
              }

              if (res.tapIndex === 1) {
                this.editor
                  .chain()
                  .focus()
                  .insertContentAt(insertPos, {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "　　",
                      },
                    ],
                  })
                  .run();
                this.$nextTick(() => {
                  this.editor
                    .chain()
                    .focus()
                    .setTextSelection(insertPos + 1)
                    .run();
                });
              }
            },
          });
        });
      });
    },
    initScrollListener() {
      clearInterval(this.imageEditInterval);
      this.imageEditInterval = setInterval(() => {
        this.showEditorImagesEditButton();
      }, 500);
    },
    updateSaveNotify(text, playAnimation) {
      this.saveNotifyText = text;
      if (playAnimation && this.$refs.completeIcon) {
        this.$refs.completeIcon.playAnimation();
      }
    },
    uploadImage() {
      if (!this.editor) return;

      uni.chooseImage({
        success: (chooseImageRes) => {
          uni.showToast({
            title: "图片上传中",
            icon: "loading",
            duration: 2000,
          });
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: "https://storage.codesocean.top/api/resource/upload?container=172018735018984",
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd",
            },
            success: (uploadFileRes) => {
              const imageUrl =
                "http://storage.codesocean.top/api/resource/get/" +
                JSON.parse(uploadFileRes.data).data.resource_id;
              this.editor.chain().focus().setImage({ src: imageUrl }).run();
              uni.showToast({
                title: "上传成功",
                icon: "success",
                duration: 2000,
              });
            },
          });
        },
      });
    },
    handlePublishAction() {
      const itemList = ["立即发布", "定时发布"];
      if (this.article.is_draft === 0) {
        itemList.push("退回章节为草稿");
      }

      uni.showActionSheet({
        itemList,
        success: (res) => {
          if (res.tapIndex === 0) {
            if (this.article.novel_info.is_personal === 1) {
              uni.showToast({
                title: "小说尚未公开，无法发布文章",
                icon: "none",
                duration: 2000,
              });
              return;
            }
            this.save(0, "发布成功");
          }

          if (res.tapIndex === 1) {
            if (this.article.novel_info.is_personal === 1) {
              uni.showToast({
                title: "小说尚未公开，无法发布文章",
                icon: "none",
                duration: 2000,
              });
              return;
            }
            this.$refs.schedulePopup.open();
          }

          if (res.tapIndex === 2) {
            if (this.article.is_draft === 0) {
              uni.showModal({
                title: "提示",
                content: "退回章节为草稿会使已发布的章节下架，确定继续吗？",
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    this.save(1, "保存成功");
                  }
                },
              });
              return;
            }

            this.save(1, "保存成功");
          }
        },
      });
    },
  },
  onNavigationBarButtonTap(e) {
    if (e.text === "\ue60e ") {
      uni.navigateBack();
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/writers/chapterTimeMachine?id=${this.chapterId}&novelId=${this.article.novel_info.novel_id}`,
        });
      }, 300);
      return;
    }

    if (e.text === "\ue61f ") {
      this.uploadImage();
      return;
    }

    if (e.text === "\ue70f ") {
      this.$refs.setPopup.open("bottom");
      return;
    }

    if (e.text === "\ue624 " && this.editor) {
      this.editor.chain().focus().undo().run();
      return;
    }

    if (e.text === "\ue625 " && this.editor) {
      this.editor.chain().focus().redo().run();
      return;
    }

    if (e.text === "\ue629 ") {
      this.formatEssay();
      return;
    }

    if (e.text === "发布 ") {
      this.handlePublishAction();
    }
  },
  onLoad(params) {
    this.chapterId = Number(params.id);
    this.initializeWriterSettings();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.handlePageHide);
    window.addEventListener("pagehide", this.handlePageHide);
    this.$nextTick(() => {
      if (params.hideback === "true") {
        const backBtn = document.querySelector(".uni-page-head-hd");
        if (backBtn) {
          backBtn.innerHTML = "";
        }
      }

      setTimeout(() => {
        this.applyNavigationBarTheme();
      });

      this.initScrollListener();
      this.checkFrameEnvironment();
      this.initializeArticle();
    });
  },
  async onUnload() {
    await this.stopWritingTimer();
    await this.flushDraftToCloud({
      isFastSave: true,
      forceSlowSave: false,
      waitForBusy: false,
    });
  },
  async onHide() {
    await this.stopWritingTimer();
    await this.flushDraftToCloud({
      isFastSave: true,
      forceSlowSave: false,
      waitForBusy: false,
    });
  },
  onShow() {
    this.startWritingTimer();
    this.checkFrameEnvironment();
  },
};
</script>

<style scoped lang="less">
.outer {
  height: calc(100vh - 44px - var(--statusBarHeight)) !important;
  overflow: hidden !important;

  .topBar {
    height: 100rpx;
    border-bottom: #a6a6a6 1px solid;
    position: relative;
    box-shadow: 0px 4px 1.5px rgba(0, 0, 0, 0.006),
      0px 9.7px 3.5px rgba(0, 0, 0, 0.008), 0px 18.3px 6.6px rgba(0, 0, 0, 0.01),
      0px 32.6px 11.8px rgba(0, 0, 0, 0.012),
      0px 61px 22.1px rgba(0, 0, 0, 0.014), 0px 146px 53px rgba(0, 0, 0, 0.02);

    input {
      height: 100%;
      padding-left: 20rpx;
      font-weight: bold;
      line-height: 150%;
      color: inherit;
      background: transparent;
    }

    div.textCount {
      display: flex;
      position: absolute;
      right: 8rpx;
      bottom: 0;
      font-size: 28rpx;
      color: rgb(175, 81, 38);
      align-items: center;

      div.saveNotify {
        display: flex;
        align-items: center;
        margin-left: 10rpx;
        color: rgb(156, 156, 156);
      }
    }
  }

  .middleBar {
    box-sizing: border-box;
    height: calc(100vh - 44px - 100rpx - var(--statusBarHeight)) !important;
    overflow: hidden;

    .textarea {
      display: block;
      position: relative;
      padding: 30rpx 30rpx;
      width: calc(100vw);
      height: calc(100%);
      font-size: 35rpx;
      line-height: 60rpx;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;

      :deep(.writer-prosemirror) {
        scroll-behavior: smooth;
        margin: 30rpx 0 !important;
        min-height: calc(100% - 60rpx);
        font-size: var(--editor-font-size);
        line-height: 60rpx;
        color: inherit;
        outline: none;
        box-shadow: none;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-x: hidden;
      }

      :deep(.writer-prosemirror p) {
        margin: 0;
        min-height: 60rpx;
      }

      :deep(.writer-prosemirror img) {
        width: auto !important;
        max-width: 100% !important;
        height: auto;
        display: block;
        margin: 12rpx auto;
        box-sizing: border-box;
      }

      :deep(.writer-prosemirror .ProseMirror-selectednode) {
        outline: none !important;
        box-shadow: none !important;
      }

      :deep(.writer-prosemirror:focus),
      :deep(.writer-prosemirror:focus-visible),
      :deep(.writer-prosemirror.ProseMirror-focused) {
        outline: none !important;
        box-shadow: none !important;
      }
    }

    .textarea.symbolsShown {
      height: calc(100% - 80rpx);
    }

    .punctuationToolBar {
      bottom: 0;
      height: 80rpx;
      width: 100%;
      z-index: 100;
      border-top: #b4b4b4 1rpx solid;
      display: flex;
      justify-content: center;

      p {
        width: 80rpx;
        height: 80rpx;
        font-weight: bold;
        line-height: 70rpx;
        text-align: center;
        margin: 0;
      }
    }
  }
}

.settingBar {
  background-color: #000000aa;
  padding: 30rpx;
  padding-top: 1rpx;
  color: rgb(203, 203, 203);

  .normalLine {
    margin-top: 15rpx;
  }

  .lrLine {
    margin-top: 15rpx;
    height: 50rpx;

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }

  .line {
    display: flex;
    justify-content: space-evenly;
    margin-top: 30rpx;

    .button {
      border: 2px rgb(203, 203, 203) solid;
      border-radius: 10rpx;
      text-align: center;
      line-height: 50rpx;
      height: 50rpx;
      padding-left: 10rpx;
      padding-right: 10rpx;
      margin-left: 10rpx;
      margin-right: 10rpx;
    }

    .button.selected {
      border: 2px #ffffff solid;
      color: #ffffff;
      transform: scale(0.9);
    }
  }
}

.button.theme {
  width: 120rpx;
  margin-top: 15rpx;
  font-size: 30rpx;
}

.button {
  transition: all 0.3s cubic-bezier(0.8, -0.5, 0.2, 1.4);
}

.button.theme.selected {
  border: 2px #ffffff solid !important;
  color: #ffffff !important;
  transform: scale(0.9);
}

.button.blue {
  background-color: #25b2f846;
  color: #24acf2;
  border: 2px #24acf2 solid !important;
}

.button.yellow {
  background-color: #ffb25544;
  color: #e68d4d;
  border: 2px #e68d4d solid !important;
}

.button.green {
  background-color: #1aa13444;
  color: #1aa134;
  border: 2px #1aa134 solid !important;
}

.button.purple {
  background-color: #9660c344;
  color: #9660c3;
  border: 2px #9660c3 solid !important;
}

.button.black {
  background-color: #282c3544;
  color: #83878c;
  border: 2px #83878c solid !important;
}

.button.white {
  background-color: #ffffff44;
  color: #ffffff;
  border: 2px #ffffff solid !important;
}

div.outer.blue {
  background-color: #ddf3fe;
  color: #115574;
}

div.outer.yellow {
  background-color: #fffaf0;
  color: #3d3d3d;
}

div.outer.green {
  background-color: #c1e6c6;
  color: #093811;
}

div.outer.purple {
  background-color: #fde0ff;
  color: #310024;
}

div.outer.black {
  background-color: #282c35;
  color: #cecece;
}

div.outer.white {
  background-color: #ffffff;
  color: #000000;
}

.punctuationToolBar.blue {
  background-color: #c4e8fe;
  color: #115574;
}

.punctuationToolBar.yellow {
  background-color: #fff2d9;
  color: #3d3d3d;
}

.punctuationToolBar.green {
  background-color: #88e695;
  color: #093811;
}

.punctuationToolBar.purple {
  background-color: #fcc4ff;
  color: #310024;
}

.punctuationToolBar.black {
  background-color: #000000;
  color: #cecece;
}

.punctuationToolBar.white {
  background-color: #f5f5f5;
  color: #000000;
}
</style>

<style lang="less">
.writer-prosemirror,
.writer-prosemirror:focus,
.writer-prosemirror:focus-visible,
.writer-prosemirror.ProseMirror-focused {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.writer-prosemirror img,
.writer-prosemirror p img,
.writer-prosemirror > img,
.writer-prosemirror .ProseMirror-selectednode,
.writer-prosemirror img.ProseMirror-selectednode {
  outline: none !important;
  box-shadow: none !important;
}

.writer-prosemirror img,
.writer-prosemirror p img,
.writer-prosemirror > img {
  display: block !important;
  width: auto !important;
  max-width: calc(100vw - 60rpx) !important;
  height: auto !important;
}
</style>
