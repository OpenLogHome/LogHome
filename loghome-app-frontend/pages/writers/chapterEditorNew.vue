<template>
  <div
    class="outer"
    :class="[writerSettings.theme, { headerDragging: isHeaderGestureActive }]"
    :style="pageStyle"
    @touchstart="
      documentOnPress = true;
      clearEditorImagesEditButton();
    "
    @touchend="documentOnPress = false"
  >
    <div ref="editorHeader" class="editorHeader">
      <div
        class="customNavBar"
        :style="customNavBarStyle"
        @touchstart.stop
        @touchend.stop
      >
        <div class="customNavContent">
          <div class="customNavLeft">
            <div
              v-if="!hideBackButton"
              class="customNavButton customNavBack"
              @click.stop="handleNavBack"
            >
              <uni-icons type="left" size="20" :color="currentTheme.color"></uni-icons>
            </div>
          </div>
          <div class="customNavTitle"></div>
          <div class="customNavActions">
            <button
              v-for="tool in navShortcutTools"
              :key="tool.id"
              class="customNavButton customNavShortcutButton"
              :title="tool.label"
              @click.stop="handleNavShortcutToolClick(tool)"
            >
              <span v-if="tool.iconText" class="customNavShortcutIcon iconfont">
                {{ tool.iconText }}
              </span>
              <img
                v-else-if="tool.iconImage"
                class="customNavShortcutImage"
                :src="tool.iconImage"
                :alt="tool.label"
              />
              <i v-else class="customNavShortcutIcon" :class="tool.iconClass"></i>
            </button>
            <div
              class="customNavButton customToolbarTrigger"
              title="工具栏"
              @click.stop="openToolbarPopup"
            >
              <i class="el-icon-menu customToolbarTriggerIcon"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="topBar">
        <div class="statusCapsule textCount">
          {{ textCount }}&nbsp;字 | {{ imageCount }}&nbsp;图
          <span class="editorRole" v-if="editorRoleText">{{ editorRoleText }}</span>
        </div>
        <div class="statusCapsule saveNotify">
          <complete-icon
            ref="completeIcon"
            style="margin-right: 5rpx; transform: translateY(5rpx)"
          ></complete-icon>
          {{ saveNotifyText }}
        </div>
      </div>
    </div>

    <div
      ref="middleBar"
      class="middleBar"
      @touchstart="handleEditorAreaTouchStart"
      @touchmove="handleEditorAreaTouchMove"
      @touchend="handleEditorAreaTouchEnd"
      @touchcancel="handleEditorAreaTouchEnd"
    >
      <input
        ref="editorBlurSink"
        class="editorBlurSink"
        readonly
        inputmode="none"
        tabindex="-1"
        aria-hidden="true"
      />
      <div
        class="textarea"
        :style="editorContentStyle"
        :class="{ symbolsShown: shouldShowQuickInputToolBar }"
      >
        <div class="chapterTitleBar">
          <input
            ref="titleInput"
            class="input chapterTitleInput"
            placeholder="章节标题"
            v-model="article.title"
            @input="handleTitleInput"
            @focus="handleTitleInputFocus"
            @blur="handleTitleInputBlur"
            @click="scheduleTitleSelectionCapture"
            @keyup="saveTitleInputSelection"
            @mouseup="scheduleTitleSelectionCapture"
            @touchend="scheduleTitleSelectionCapture"
            @select="saveTitleInputSelection"
            :style="titleInputStyle"
          />
        </div>
        <editor-content
          v-if="editor"
          :editor="editor"
          class="editorContent"
        ></editor-content>
        <div v-else class="editorContent"></div>
      </div>

      <div
        class="quickInputToolBar"
        v-show="shouldShowQuickInputToolBar"
        :class="writerSettings.theme"
      >
        <button
          v-for="item in quickInputToolbarItems"
          :key="item.itemKey || item.id"
          class="quickInputToolbarButton"
          :class="{ indentInputButton: item.id === 'indent' }"
          type="button"
          tabindex="-1"
          @touchstart.stop.prevent="handleQuickInputToolbarTouchStart($event, item)"
          @mousedown.stop.prevent="handleQuickInputToolbarMouseDown($event)"
          @click.stop.prevent="handleQuickInputToolbarClick($event, item)"
        >
          <span
            v-if="item.isQuickInput && item.icon"
            class="quickInputToolbarIcon quickInputToolbarQuickIcon iconfont"
          >
            {{ item.icon }}
          </span>
          <span v-else-if="item.isQuickInput" class="quickInputToolbarText">
            {{ getQuickInputDisplayText(item) }}
          </span>
          <span v-else-if="item.iconText" class="quickInputToolbarIcon iconfont">
            {{ item.iconText }}
          </span>
          <img
            v-else-if="item.iconImage"
            class="quickInputToolbarImage"
            :src="item.iconImage"
            :alt="item.label"
          />
          <i v-else class="quickInputToolbarElementIcon" :class="item.iconClass"></i>
        </button>
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
        <div class="normalLine fontFamilyLine" v-if="canSwitchFont">
          <div class="left">字体</div>
          <div class="right">
            <div class="fontSelectButton" @click="showFontsSelectDrawer = true">
              <span :style="{ fontFamily: currentFontFamilyStyleValue || 'inherit' }">
                {{ getCurrentFontName() }}
              </span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
        <div class="lrLine">
          <div class="left">显示输入快捷栏</div>
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

    <uni-popup ref="toolbarPopup" type="bottom">
      <view
        class="toolbarPanel"
        :class="writerSettings.theme"
        @touchstart.stop
        @touchend.stop
      >
        <div class="toolbarPanelHeader">
          <div class="toolbarPanelTitle">工具栏</div>
          <button class="toolbarPanelClose" @click.stop="closeToolbarPopup">
            <i class="el-icon-close"></i>
          </button>
        </div>
        <div class="toolbarGrid">
          <button
            v-for="tool in toolbarPanelTools"
            :key="tool.id"
            class="toolbarGridItem"
            @click.stop="handleToolbarToolClick(tool)"
          >
            <span v-if="tool.iconText" class="toolbarGridIcon iconfont">
              {{ tool.iconText }}
            </span>
            <img
              v-else-if="tool.iconImage"
              class="toolbarGridImage"
              :src="tool.iconImage"
              :alt="tool.label"
            />
            <i v-else class="toolbarGridIcon" :class="tool.iconClass"></i>
            <span class="toolbarGridLabel">{{ tool.label }}</span>
          </button>
        </div>
      </view>
    </uni-popup>

    <el-drawer
      v-if="canSwitchFont"
      title="选择字体"
      :visible.sync="showFontsSelectDrawer"
      :direction="'btt'"
      size="55%"
    >
      <div class="fonts-container">
        <div class="fonts-grid">
          <div
            v-for="(font, key) in selectableFonts"
            :key="key"
            class="font-item"
            :class="{ selected: writerSettings.font === key }"
            @click="selectFont(key)"
          >
            <div class="font-info">
              <div class="font-name">
                {{ font.name }}
                <span
                  v-if="fontDownloadState[key] === 'downloading'"
                  class="font-download-state"
                >
                  下载中...
                </span>
              </div>
              <div
                class="font-preview"
                :style="{ fontFamily: getFontFamilyStyleValue(font.family) || 'inherit' }"
              >
                落霞与孤鹜齐飞，秋水共长天一色
              </div>
            </div>
            <div class="select-indicator" v-if="writerSettings.font === key">
              <i class="el-icon-check"></i>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <conflict-dialog ref="conflictDialog"></conflict-dialog>
    <writer-ai-assistant
      ref="writerAiAssistant"
      v-if="editor"
      :editor="editor"
      :article="article"
      :chapter-id="chapterId"
      :edit-session-id="editSessionId"
      :theme="writerSettings.theme"
      @smart-replace-kept="handleWriterAiSmartReplaceKept"
      @open="handleAiAssistantOpen"
      @close="handleAiAssistantClose"
    ></writer-ai-assistant>
  </div>
</template>

<script>
import axios from "axios";
import { Editor, EditorContent, Extension } from "@tiptap/vue-2";
import Paragraph from "@tiptap/extension-paragraph";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import conflictDialog from "../../components/conflictDialog.vue";
import completeIcon from "../../components/completeIcon.vue";
import WriterAiAssistant from "../../components/writer-ai/WriterAiAssistant.vue";
import { getServerTime } from "../../lib/utils.js";
import { writerArticleDB } from "../../lib/db.js";
import { createTreeExpReporter } from "../../lib/treeExpReporter.js";
import fontsConfig from "../readers/newReader/fonts.json";
import {
  buildClientSyncTime,
  clearWriterSyncState,
  computeWriterContentHash,
  isWriterSyncStatePending,
  markWriterSyncInvalidated,
  markWriterSyncPending,
  markWriterSyncSynced,
  readWriterSyncState,
} from "../../lib/writerSyncState.js";
import {
  areLegacyContentsEquivalent,
  countLegacyContent,
  docToLegacyBlocks,
  formatLegacyBlocks,
  legacyBlocksToDoc,
  normalizeLegacyContentForStorage,
  parseLegacyContent,
  stringifyLegacyContent,
} from "../../lib/writerEditorLegacyAdapter.js";

function resolveAssetUrl(assetModule) {
  return assetModule && assetModule.default ? assetModule.default : assetModule;
}

const BIPAO_AI_ICON = resolveAssetUrl(require("../../static/bipao_ai_icon.svg"));

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

const WriterFontFamily = Extension.create({
  name: "writerFontFamily",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => {
              const fontFamily =
                element && element.style ? element.style.fontFamily : "";
              return fontFamily ? fontFamily.replace(/['"]/g, "") : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
});

const LegacyParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...(this.parent ? this.parent() : {}),
      legacyId: {
        default: null,
        parseHTML: (element) => {
          const rawId = element.getAttribute("data-legacy-id");
          if (rawId === null || rawId === undefined || rawId === "") {
            return null;
          }
          const normalizedId = Number(rawId);
          return Number.isFinite(normalizedId) && normalizedId > 0
            ? normalizedId
            : null;
        },
        renderHTML: (attributes) => {
          const normalizedId = Number(attributes.legacyId);
          if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
            return {};
          }
          return {
            "data-legacy-id": String(normalizedId),
          };
        },
      },
    };
  },
});

const DEFAULT_QUICK_INPUTS = [
  {
    id: "indent",
    type: "punctuation",
    label: "缩进",
    value: "　　",
    icon: "\ue62b",
  },
  { id: "comma", type: "punctuation", label: "逗号", value: "，" },
  { id: "period", type: "punctuation", label: "句号", value: "。" },
  { id: "pause", type: "punctuation", label: "顿号", value: "、" },
  { id: "exclamation", type: "punctuation", label: "感叹号", value: "！" },
  { id: "question", type: "punctuation", label: "问号", value: "？" },
  { id: "colon", type: "punctuation", label: "冒号", value: "：" },
  { id: "quote", type: "punctuation", label: "双引号", value: "“”", isPair: true },
  { id: "book-title", type: "punctuation", label: "书名号", value: "《》", isPair: true },
];

const TOOL_DEFINITIONS = {
  upload: {
    id: "upload",
    action: "upload",
    label: "添加图片",
    iconClass: "el-icon-picture-outline",
  },
  format: {
    id: "format",
    action: "format",
    label: "自动排版",
    iconClass: "el-icon-magic-stick",
  },
  undo: {
    id: "undo",
    action: "undo",
    label: "撤销",
    iconText: "\ue624",
  },
  redo: {
    id: "redo",
    action: "redo",
    label: "重做",
    iconText: "\ue625",
  },
  publish: {
    id: "publish",
    action: "publish",
    label: "发布作品",
    iconClass: "el-icon-s-promotion",
  },
  writerAi: {
    id: "writerAi",
    action: "writerAi",
    label: "笔泡AI",
    iconImage: BIPAO_AI_ICON,
  },
  settings: {
    id: "settings",
    action: "settings",
    label: "编辑器样式",
    iconText: "\ue70f",
  },
  shortcutSettings: {
    id: "shortcutSettings",
    action: "shortcutSettings",
    label: "快捷栏设置",
    iconClass: "el-icon-s-operation",
    alwaysVisible: true,
  },
};

const DEFAULT_NAV_TOOL_IDS = [
  "upload",
  "format",
  "undo",
  "redo",
  "publish",
  "writerAi",
  "settings",
  "shortcutSettings",
];

const DEFAULT_NAV_SHORTCUT_TOOL_IDS = ["undo", "redo", "format", "writerAi"];
const DEFAULT_KEYBOARD_SHORTCUT_ITEMS = DEFAULT_QUICK_INPUTS.map((item) => ({
  type: "quickInput",
  id: item.id,
}));
const MAX_NAV_SHORTCUTS = DEFAULT_NAV_TOOL_IDS.length;
const NAV_LEFT_RESERVED_WIDTH = 44;
const NAV_TOOLBAR_TRIGGER_WIDTH = 48;
const NAV_SHORTCUT_BUTTON_WIDTH = 40;
const NAV_ACTION_SAFE_GAP = 8;
const PAIR_INPUT_CURSOR_OFFSETS = {
  "“”": 1,
  "《》": 1,
  "（）": 1,
  "【】": 1,
  "「」": 1,
  "『』": 1,
  "()": 1,
  "[]": 1,
  "{}": 1,
};
const DEFAULT_QUICK_INPUT_MAP = DEFAULT_QUICK_INPUTS.reduce((map, item) => {
  map[item.id] = item;
  return map;
}, {});

const DEFAULT_SETTINGS = {
  version: 26060401,
  showSymbols: true,
  font: "default",
  fontSize: 35,
  openTypeSet: false,
  showFab: false,
  theme: "yellow",
  codeMode: false,
  quickInputs: DEFAULT_QUICK_INPUTS,
  navToolIds: DEFAULT_NAV_TOOL_IDS,
  navShortcutToolIds: DEFAULT_NAV_SHORTCUT_TOOL_IDS,
  keyboardShortcutItems: DEFAULT_KEYBOARD_SHORTCUT_ITEMS,
};

const DEFAULT_CONTENT = stringifyLegacyContent([{ type: "text", value: "" }]);
const INPUT_SYNC_DELAY_MS = 350;
const EDIT_LOCK_HEARTBEAT_MS = 30 * 1000;
const LOCK_RECONNECT_DELAYS_MS = [2000, 5000, 10000, 20000, 30000];
const DEFINITE_LOCK_CONFLICT_CODES = [
  "lock_taken",
  "lock_conflict",
  "edit_lock_taken",
  "article_edit_lock_taken",
];
const SAVE_NOTIFY_REFRESH_MS = 5 * 1000;
const DEBUG_TITLE_SELECTION = true;

function toResponsivePx(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return "";
  }

  if (typeof uni !== "undefined" && typeof uni.upx2px === "function") {
    const pxValue = Number(uni.upx2px(numericValue));
    if (Number.isFinite(pxValue)) {
      return `${pxValue}px`;
    }
  }

  if (
    typeof window !== "undefined" &&
    Number.isFinite(Number(window.innerWidth)) &&
    Number(window.innerWidth) > 0
  ) {
    return `${((numericValue * Number(window.innerWidth)) / 750).toFixed(2)}px`;
  }

  return `${numericValue}rpx`;
}

function toResponsivePixelNumber(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  if (typeof uni !== "undefined" && typeof uni.upx2px === "function") {
    const pxValue = Number(uni.upx2px(numericValue));
    if (Number.isFinite(pxValue)) {
      return pxValue;
    }
  }

  if (
    typeof window !== "undefined" &&
    Number.isFinite(Number(window.innerWidth)) &&
    Number(window.innerWidth) > 0
  ) {
    return (numericValue * Number(window.innerWidth)) / 750;
  }

  return numericValue;
}

function getViewportWidth() {
  try {
    if (typeof uni !== "undefined" && typeof uni.getSystemInfoSync === "function") {
      const info = uni.getSystemInfoSync();
      const width = Number(info.windowWidth || info.screenWidth);
      if (Number.isFinite(width) && width > 0) {
        return width;
      }
    }
  } catch (error) {
    // Continue with the browser-width fallback below.
  }

  if (
    typeof window !== "undefined" &&
    Number.isFinite(Number(window.innerWidth)) &&
    Number(window.innerWidth) > 0
  ) {
    return Number(window.innerWidth);
  }

  return 375;
}

function calculateNavShortcutLimit(viewportWidth) {
  const width = Number(viewportWidth) || 375;
  const availableWidth =
    width -
    NAV_LEFT_RESERVED_WIDTH -
    NAV_TOOLBAR_TRIGGER_WIDTH -
    NAV_ACTION_SAFE_GAP;
  const limit = Math.floor(availableWidth / NAV_SHORTCUT_BUTTON_WIDTH);
  return Math.max(1, Math.min(MAX_NAV_SHORTCUTS, limit));
}

function getPairCursorOffset(value) {
  const inputValue = value === undefined || value === null ? "" : String(value);
  if (!inputValue) {
    return 0;
  }
  return Math.max(1, Math.floor(inputValue.length / 2));
}

function cloneQuickInput(item) {
  return {
    id: item.id,
    type: item.type === "word" ? "word" : "punctuation",
    label: item.label,
    value: item.value,
    icon: item.icon || "",
    isPair: item.type === "punctuation" && item.isPair === true,
    isQuickInput: true,
  };
}

function normalizeQuickInputs(rawItems) {
  const sourceItems = Array.isArray(rawItems) ? rawItems : DEFAULT_QUICK_INPUTS;
  const normalizedItems = sourceItems
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const value = item.value === undefined || item.value === null
        ? ""
        : String(item.value);
      if (!value) {
        return null;
      }

      const labelSource = item.label === undefined || item.label === null
        ? value
        : String(item.label);
      const label = labelSource.trim() || value;
      const rawId = item.id === undefined || item.id === null
        ? ""
        : String(item.id);
      const defaultItem = DEFAULT_QUICK_INPUT_MAP[rawId];
      const normalizedType = item.type === "word" ? "word" : "punctuation";
      const trimmedLabel = labelSource.trim();
      const shouldUseDefaultLabel =
        defaultItem &&
        normalizedType === defaultItem.type &&
        (!trimmedLabel || trimmedLabel === value);
      const hasExplicitPair =
        item.isPair !== undefined ||
        item.paired !== undefined ||
        item.isPaired !== undefined;
      const explicitPairValue =
        item.isPair !== undefined
          ? item.isPair
          : item.paired !== undefined
            ? item.paired
            : item.isPaired;

      return {
        id: rawId || `quick_input_${index}_${Date.now()}`,
        type: normalizedType,
        label: (shouldUseDefaultLabel ? defaultItem.label : label).slice(0, 12),
        value,
        icon: item.icon ? String(item.icon) : (defaultItem && defaultItem.icon) || "",
        isPair: normalizedType === "punctuation" && (
          hasExplicitPair ? explicitPairValue === true : !!(defaultItem && defaultItem.isPair)
        ),
        isQuickInput: true,
      };
    })
    .filter(Boolean);

  return normalizedItems.length
    ? normalizedItems
    : DEFAULT_QUICK_INPUTS.map(cloneQuickInput);
}

function normalizeNavToolIds(rawIds) {
  const knownToolIds = Object.keys(TOOL_DEFINITIONS);
  const ids = [];
  const pushIfValid = (id) => {
    const normalizedId = String(id || "");
    if (
      knownToolIds.includes(normalizedId) &&
      !ids.includes(normalizedId)
    ) {
      ids.push(normalizedId);
    }
  };

  if (Array.isArray(rawIds)) {
    rawIds.forEach(pushIfValid);
  }
  DEFAULT_NAV_TOOL_IDS.forEach(pushIfValid);

  return ids;
}

function normalizeNavShortcutToolIds(rawIds) {
  if (!Array.isArray(rawIds)) {
    return DEFAULT_NAV_SHORTCUT_TOOL_IDS.slice();
  }

  return rawIds
    .map((id) => String(id || ""))
    .filter((id, index, ids) => {
      return (
        TOOL_DEFINITIONS[id] &&
        ids.indexOf(id) === index
      );
    });
}

function normalizeKeyboardShortcutItems(rawItems, quickInputs) {
  const quickInputMap = new Map(
    normalizeQuickInputs(quickInputs).map((item) => [item.id, item])
  );
  const sourceItems = Array.isArray(rawItems)
    ? rawItems
    : DEFAULT_KEYBOARD_SHORTCUT_ITEMS;
  const items = [];
  const usedKeys = new Set();

  sourceItems.forEach((item) => {
    const isObject = item && typeof item === "object";
    const rawType = isObject ? item.type || item.kind : "";
    const rawId = isObject ? item.id : item;
    const id = String(rawId || "");
    const type = rawType === "tool" || TOOL_DEFINITIONS[id]
      ? "tool"
      : "quickInput";

    if (type === "tool" && !TOOL_DEFINITIONS[id]) return;
    if (type === "quickInput" && !quickInputMap.has(id)) return;

    const key = `${type}:${id}`;
    if (usedKeys.has(key)) return;
    usedKeys.add(key);
    items.push({ type, id });
  });

  return items;
}

function createDefaultWriterSettings() {
  return {
    ...DEFAULT_SETTINGS,
    quickInputs: DEFAULT_QUICK_INPUTS.map(cloneQuickInput),
    navToolIds: DEFAULT_NAV_TOOL_IDS.slice(),
    navShortcutToolIds: DEFAULT_NAV_SHORTCUT_TOOL_IDS.slice(),
    keyboardShortcutItems: DEFAULT_KEYBOARD_SHORTCUT_ITEMS.slice(),
  };
}

function normalizeWriterSettings(rawSettings) {
  const parsedSettings =
    rawSettings && typeof rawSettings === "object" ? rawSettings : {};
  const mergedSettings = {
    ...createDefaultWriterSettings(),
    ...parsedSettings,
    version: DEFAULT_SETTINGS.version,
  };

  mergedSettings.quickInputs = normalizeQuickInputs(mergedSettings.quickInputs);
  mergedSettings.navToolIds = normalizeNavToolIds(mergedSettings.navToolIds);
  mergedSettings.navShortcutToolIds = normalizeNavShortcutToolIds(
    mergedSettings.navShortcutToolIds
  );
  mergedSettings.keyboardShortcutItems = normalizeKeyboardShortcutItems(
    mergedSettings.keyboardShortcutItems,
    mergedSettings.quickInputs
  );
  delete mergedSettings.hiddenNavToolIds;
  delete mergedSettings.keyboardToolIds;

  return mergedSettings;
}

export default {
  components: {
    EditorContent,
    conflictDialog,
    completeIcon,
    WriterAiAssistant,
  },
  data() {
    return {
      chapterId: 0,
      currentUserId: 0,
      editor: null,
      article: {
        article_id: 0,
        title: "",
        content: DEFAULT_CONTENT,
        novel_info: {},
        is_draft: 1,
      },
      editorAccess: {
        access_role: "owner",
        can_publish: true,
        can_edit_draft: true,
      },
      editSessionId: "",
      currentEditLock: null,
      lockState: "idle",
      lockHeartbeatTimer: null,
      lockReconnectTimer: null,
      lockReconnectAttempts: 0,
      lockReconnectInFlight: false,
      textCount: 0,
      imageCount: 0,
      saveInterval: undefined,
      loadComplete: false,
      lastSaveTime: new Date(),
      lastSaveNotifyTime: null,
      lastInputTime: new Date(),
      lastUploadTime: new Date(),
      hasNewInput: false,
      contentVersion: 0,
      saveNotifyText: "尚未更改",
      saveNotifyInterval: undefined,
      notIncrementalChangeCount: 0,
      frameInfo: {
        isEnabled: false,
      },
      writerSettings: createDefaultWriterSettings(),
      fonts: JSON.parse(JSON.stringify(fontsConfig)),
      fontDownloadState: {},
      runtimeLoadedFonts: {},
      showFontsSelectDrawer: false,
      isAppEnv: false,
      isApplyingEditorDisplayFont: false,
      themes: {
        blue: {
          backColor: "#c4e8fe",
          color: "#115574",
          pageBackColor: "#ddf3fe",
        },
        yellow: {
          backColor: "#FFEFD6",
          color: "#502727",
          pageBackColor: "#fffaf0",
        },
        green: {
          backColor: "#b7f7c1",
          color: "#093811",
          pageBackColor: "#c1e6c6",
        },
        purple: {
          backColor: "#fde0ff",
          color: "#310024",
          pageBackColor: "#fde0ff",
        },
        black: {
          backColor: "#282C35",
          color: "#cecece",
          pageBackColor: "#282c35",
        },
        white: {
          backColor: "#ffffff",
          color: "#000000",
          pageBackColor: "#ffffff",
        },
      },
      imageEditInterval: undefined,
      documentOnPress: false,
      inputSyncTimer: undefined,
      syncTaskPromise: null,
      pauseSyncPromise: null,
      finalizeLeavePromise: null,
      leaveFinalized: false,
      publishHandoffActive: false,
      publishCompletionApplied: false,
      aiAssistantOpen: false,
      isHandlingBrowserBack: false,
      statusBarHeight: 0,
      viewportWidth: 375,
      navBarHeight: 44,
      hideBackButton: false,
      headerOffset: 0,
      isHeaderGestureActive: false,
      headerGestureStartY: 0,
      headerGestureLastY: 0,
      headerGestureMoved: false,
      headerGestureStartedFocused: false,
      headerGestureLastDeltaY: 0,
      editorBodyFocused: false,
      titleInputFocused: false,
      titleInputSelectionStart: 0,
      titleInputSelectionEnd: 0,
      titleInputHasSelection: false,
      pendingTitleInsertion: false,
      titleNeedsStatusCapsuleClearance: false,
      titleSelectionCaptureTimer: undefined,
      titleSelectionRestoreTimer: undefined,
      titleSelectionRestoreUntil: 0,
      quickInputInsertTimer: undefined,
      quickInputTouchHandledAt: 0,
      quickInputTouchHandledKey: "",
    };
  },
  computed: {
    currentTheme() {
      return this.themes[this.writerSettings.theme] || this.themes.yellow;
    },
    canSwitchFont() {
      return !!(
        this.isAppEnv &&
        typeof window !== "undefined" &&
        window.jsBridge &&
        window.jsBridge.downloadFont
      );
    },
    selectableFonts() {
      if (this.canSwitchFont) {
        return this.fonts;
      }
      return {
        default: this.fonts.default || { name: "系统默认", family: "" },
      };
    },
    canPublishArticle() {
      return !!(this.editorAccess && this.editorAccess.can_publish === true);
    },
    editorRoleText() {
      if (this.editorAccess.access_role === "collaborator") {
        return "协作草稿";
      }
      return "";
    },
    pageStyle() {
      return {
        transition: "background-color .5s, color .5s",
        "--statusBarHeight": `${this.statusBarHeight}px`,
        "--navBarHeight": `${this.navBarHeight}px`,
        "--titleBarHeight": `${this.titleBarHeight}px`,
        "--headerOffset": `${this.headerOffset}px`,
        "--headerVisualOffset": `${this.headerOffset}px`,
        "--headerLayoutOffset": `${this.headerOffset}px`,
        "--statusCapsuleGap": `${this.statusCapsuleGap}px`,
        "--statusCapsuleLift": `${this.statusCapsuleLift}px`,
        "--statusCapsuleTopClearance": `${this.statusCapsuleTopClearance}px`,
      };
    },
    customNavBarStyle() {
      return {
        paddingTop: `${this.statusBarHeight}px`,
        height: `${this.statusBarHeight + this.navBarHeight}px`,
        backgroundColor: this.currentTheme.backColor,
        color: this.currentTheme.color,
        transition: "background-color .5s, color .5s, box-shadow .5s",
        boxShadow: this.isNavbarFullyHidden ? "none" : undefined,
      };
    },
    quickInputToolbarItems() {
      const quickInputs = normalizeQuickInputs(this.writerSettings.quickInputs);
      const quickInputMap = new Map(quickInputs.map((item) => [item.id, item]));
      return normalizeKeyboardShortcutItems(
        this.writerSettings.keyboardShortcutItems,
        quickInputs
      )
        .map((item) => {
          if (item.type === "tool") {
            const tool = TOOL_DEFINITIONS[item.id];
            return tool
              ? {
                  ...tool,
                  itemType: "tool",
                  itemKey: `tool:${item.id}`,
                }
              : null;
          }
          const quickInput = quickInputMap.get(item.id);
          return quickInput
            ? {
                ...cloneQuickInput(quickInput),
                itemType: "quickInput",
                itemKey: `quickInput:${item.id}`,
              }
            : null;
        })
        .filter(Boolean);
    },
    toolbarSettingsItems() {
      return normalizeNavToolIds(this.writerSettings.navToolIds).map((id) => ({
        ...TOOL_DEFINITIONS[id],
      }));
    },
    toolbarPanelTools() {
      return this.toolbarSettingsItems;
    },
    navShortcutLimit() {
      return calculateNavShortcutLimit(this.viewportWidth);
    },
    navShortcutTools() {
      const allTools = new Map(this.toolbarSettingsItems.map((tool) => [tool.id, tool]));
      return normalizeNavShortcutToolIds(this.writerSettings.navShortcutToolIds)
        .map((id) => allTools.get(id))
        .filter(Boolean)
        .slice(0, this.navShortcutLimit);
    },
    isActiveTitleBarEnabled() {
      return this.isAppEnv;
    },
    shouldShowQuickInputToolBar() {
      if (!this.writerSettings.showSymbols) {
        return false;
      }
      if (!this.quickInputToolbarItems.length) {
        return false;
      }
      if (!this.isAppEnv) {
        return true;
      }
      return this.editorBodyFocused || this.titleInputFocused;
    },
    titleBarHeight() {
      return toResponsivePixelNumber(100);
    },
    statusCapsuleGap() {
      return toResponsivePixelNumber(22);
    },
    statusCapsuleLift() {
      return this.getStatusCapsuleLift(this.headerOffset);
    },
    statusCapsuleTopClearance() {
      return this.titleNeedsStatusCapsuleClearance
        ? toResponsivePixelNumber(72)
        : 0;
    },
    maxHeaderOffset() {
      return Math.max(
        0,
        Number(this.statusBarHeight || 0) + Number(this.navBarHeight || 0)
      );
    },
    isNavbarFullyHidden() {
      return (
        Number(this.maxHeaderOffset || 0) > 0 &&
        this.headerOffset >= Number(this.maxHeaderOffset)
      );
    },
    fontSizeStyleValue() {
      return toResponsivePx(this.writerSettings.fontSize || DEFAULT_SETTINGS.fontSize);
    },
    currentFontFamilyStyleValue() {
      return this.getFontFamilyStyleValue(this.getCurrentFontFamily());
    },
    titleInputStyle() {
      const style = {
        fontSize: this.fontSizeStyleValue,
      };
      if (this.currentFontFamilyStyleValue) {
        style.fontFamily = this.currentFontFamilyStyleValue;
        style["--editor-font-family"] = this.currentFontFamilyStyleValue;
      }
      return style;
    },
    editorContentStyle() {
      const style = {
        fontSize: this.fontSizeStyleValue,
        "--editor-font-size": this.fontSizeStyleValue,
      };
      if (this.currentFontFamilyStyleValue) {
        style.fontFamily = this.currentFontFamilyStyleValue;
        style["--editor-font-family"] = this.currentFontFamilyStyleValue;
      }
      return style;
    },
  },
  watch: {
    "writerSettings.fontSize": {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.applyEditorFontSize();
          this.scheduleTitleCapsuleClearanceUpdate();
        });
      },
    },
    "writerSettings.font": {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.applyEditorFontSize();
          this.scheduleTitleCapsuleClearanceUpdate();
        });
      },
    },
    "article.title": {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.scheduleTitleCapsuleClearanceUpdate();
        });
      },
    },
    saveNotifyText() {
      this.$nextTick(() => {
        this.scheduleTitleCapsuleClearanceUpdate();
      });
    },
    textCount() {
      this.$nextTick(() => {
        this.scheduleTitleCapsuleClearanceUpdate();
      });
    },
    imageCount() {
      this.$nextTick(() => {
        this.scheduleTitleCapsuleClearanceUpdate();
      });
    },
    "editorAccess.access_role"() {
      this.$nextTick(() => {
        this.scheduleTitleCapsuleClearanceUpdate();
      });
    },
    isNavbarFullyHidden() {
      this.applyNavigationBarTheme();
    },
  },
  async beforeDestroy() {
    await this.finalizeBeforeLeave();
    clearTimeout(this.inputSyncTimer);
    clearTimeout(this.titleSelectionCaptureTimer);
    clearTimeout(this.titleSelectionRestoreTimer);
    clearTimeout(this.quickInputInsertTimer);
    clearTimeout(this._centerCursorAfterBlurredTapTimer);
    if (
      this._titleCapsuleClearanceRaf &&
      typeof window !== "undefined"
    ) {
      if (typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(this._titleCapsuleClearanceRaf);
      } else {
        clearTimeout(this._titleCapsuleClearanceRaf);
      }
    }
    this.cancelHeaderOffsetFrame();
    clearInterval(this.imageEditInterval);
    this.stopSaveNotifyTimer();
    this.clearEditorImagesEditButton();
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    window.removeEventListener("message", this.handleParentMessage);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.handlePageHide);
    window.removeEventListener("popstate", this.browserBack);
    window.removeEventListener("resize", this.updateCustomNavigationMetrics);
    document.removeEventListener(
      "selectionchange",
      this.handleDocumentSelectionChange
    );
    window.removeEventListener(
      "keyboardVisibilityChange",
      this.handleAppKeyboardVisibilityChange
    );
  },
  methods: {
    isRunningInAppEnvironment() {
      return !!(
        typeof window !== "undefined" &&
        window.jsBridge &&
        window.jsBridge.inApp
      );
    },
    syncAppEnvironment() {
      this.isAppEnv = this.isRunningInAppEnvironment();
      if (!this.isActiveTitleBarEnabled) {
        this.restoreDefaultHeaderLayout();
      }
      return this.isAppEnv;
    },
    setupAppKeyboardListener() {
      if (typeof window === "undefined") {
        return;
      }
      window.removeEventListener(
        "keyboardVisibilityChange",
        this.handleAppKeyboardVisibilityChange
      );
      if (this.isAppEnv) {
        window.addEventListener(
          "keyboardVisibilityChange",
          this.handleAppKeyboardVisibilityChange
        );
      }
    },
    handleAppKeyboardVisibilityChange(event) {
      if (!this.isAppEnv) {
        return;
      }

      const detail = event ? event.detail : null;
      const isKeyboardHidden =
        detail === false ||
        (detail && typeof detail === "object" && detail.visible === false);
      if (isKeyboardHidden) {
        this.blurBodyEditor();
      }
    },
    getPublishDraftStorageKey(articleId = this.chapterId) {
      return `writer_publish_payload_${Number(this.currentUserId || 0)}_${Number(articleId || 0)}`;
    },
    getPublishCompletionStorageKey(
      articleId = this.chapterId,
      sourceSessionId = this.editSessionId
    ) {
      return `writer_publish_completed_${Number(this.currentUserId || 0)}_${Number(
        articleId || 0
      )}_${String(sourceSessionId || "")}`;
    },
    readPublishCompletionMarker() {
      if (!this.chapterId || !this.editSessionId) {
        return null;
      }

      const raw = window.localStorage.getItem(this.getPublishCompletionStorageKey());
      if (!raw) {
        return null;
      }

      try {
        const parsed = JSON.parse(raw);
        if (
          Number(parsed.article_id || 0) !== Number(this.chapterId || 0) ||
          String(parsed.source_session_id || "") !== String(this.editSessionId || "")
        ) {
          return null;
        }
        return parsed;
      } catch (error) {
        return null;
      }
    },
    clearPendingEditorSyncTimers() {
      clearInterval(this.saveInterval);
      this.saveInterval = undefined;
      clearTimeout(this.inputSyncTimer);
      this.inputSyncTimer = undefined;
    },
    shouldSuppressEditorSyncForCompletedPublish() {
      const marker = this.readPublishCompletionMarker();
      if (!marker) {
        return false;
      }

      this.publishHandoffActive = true;
      this.clearPendingEditorSyncTimers();
      this.hasNewInput = false;

      if (!this.publishCompletionApplied) {
        if (typeof marker.title === "string") {
          this.article.title = marker.title;
        }
        if (typeof marker.content === "string") {
          this.applyLegacyContentToEditor(marker.content, false);
        }
        this.markSyncSynced(
          marker.writer_create_time || buildClientSyncTime(),
          marker.remote_updated_at || ""
        );
        this.updateSaveNotify(false);
        this.publishCompletionApplied = true;
      }

      return true;
    },
    validatePublishableArticle() {
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
    persistPublishDraft() {
      if (!this.validatePublishableArticle()) {
        return false;
      }

      window.localStorage.setItem(
        this.getPublishDraftStorageKey(),
        JSON.stringify({
          article_id: Number(this.chapterId || this.article.article_id || 0),
          title: this.article.title,
          content: this.article.content,
          is_draft: this.article.is_draft,
          article_chapter: this.article.article_chapter,
          novel_info: this.article.novel_info || {},
          edit_session_id: this.editSessionId,
          saved_at: Date.now(),
        })
      );

      return true;
    },
    getTokenInfo() {
      let token = JSON.parse(window.localStorage.getItem("token"));
      return token || null;
    },
    getAuthToken() {
      const token = this.getTokenInfo();
      return token ? token.tk : null;
    },
    resolveCurrentUserId() {
      const token = this.getTokenInfo();
      this.currentUserId = token && token.id ? Number(token.id) : 0;
      return this.currentUserId;
    },
    generateEditSessionId() {
      return `writer_${this.chapterId}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
    },
    getScopedArticleCollection(articleId) {
      return writerArticleDB.articles
        .where("[user_id+article_id]")
        .equals([Number(this.currentUserId || 0), Number(articleId)]);
    },
    initializeWriterSettings() {
      const raw = window.localStorage.getItem("writerSettings");
      if (!raw) {
        this.writerSettings = createDefaultWriterSettings();
        this.persistWriterSettings();
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        this.writerSettings = normalizeWriterSettings(parsed);
      } catch (error) {
        this.writerSettings = createDefaultWriterSettings();
      }

      this.persistWriterSettings();
    },
    persistWriterSettings() {
      this.writerSettings = normalizeWriterSettings(this.writerSettings);
      window.localStorage.setItem(
        "writerSettings",
        JSON.stringify(this.writerSettings)
      );
    },
    getDefaultFonts() {
      return JSON.parse(JSON.stringify(fontsConfig));
    },
    getCurrentFontConfig() {
      if (!this.writerSettings || !this.writerSettings.font) {
        return this.fonts.default || { name: "系统默认", family: "" };
      }
      return (
        this.fonts[this.writerSettings.font] ||
        this.fonts.default ||
        { name: "系统默认", family: "" }
      );
    },
    getCurrentFontFamily() {
      return this.getCurrentFontConfig().family || "";
    },
    getCurrentFontName() {
      return this.getCurrentFontConfig().name || "系统默认";
    },
    getFontFamilyStyleValue(fontFamily) {
      if (!fontFamily) {
        return "";
      }
      const escapedFamily = String(fontFamily)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
      return `"${escapedFamily}", sans-serif`;
    },
    getEditorRootStyleText() {
      const fontSize = this.fontSizeStyleValue;
      const fontFamily = this.currentFontFamilyStyleValue;
      const declarations = [
        "outline: none",
        "box-shadow: none",
        "border: none",
        "max-width: 100%",
        "overflow-x: hidden",
        "-webkit-tap-highlight-color: transparent",
      ];

      if (fontSize) {
        declarations.push(`font-size: ${fontSize}`);
        declarations.push(`--editor-font-size: ${fontSize}`);
      }
      if (fontFamily) {
        declarations.push(`font-family: ${fontFamily} !important`);
        declarations.push(`--editor-font-family: ${fontFamily}`);
      }

      return declarations.map((item) => `${item};`).join("");
    },
    getEditorDomEventHandlers() {
      return {
        mousedown: (view, event) => {
          this.handleEditorActivationStart(event);
          return false;
        },
        mousemove: (view, event) => {
          this.handleEditorActivationMove(event);
          return false;
        },
        touchstart: (view, event) => {
          this.handleEditorActivationStart(event);
          return false;
        },
        touchmove: (view, event) => {
          this.handleEditorActivationMove(event);
          return false;
        },
        touchcancel: () => {
          this.cancelEditorActivation();
          return false;
        },
        click: (view, event) => {
          this.handleEditorActivationEnd(event);
          return false;
        },
        touchend: (view, event) => {
          this.handleEditorActivationEnd(event);
          return false;
        },
      };
    },
    getEditorRootAttributes() {
      return {
        class: "writer-prosemirror",
        style: this.getEditorRootStyleText(),
      };
    },
    syncEditorRootAttributes(editorInstance = null) {
      const activeEditor = editorInstance || this.editor;
      if (!activeEditor || typeof activeEditor.setOptions !== "function") {
        return;
      }
      activeEditor.setOptions({
        editorProps: {
          attributes: this.getEditorRootAttributes(),
          handleDOMEvents: this.getEditorDomEventHandlers(),
        },
      });
    },
    captureWriterFontDebug(stage, editorInstance = null) {
      try {
        const pageRoot = this.$el || document;
        const activeEditor =
          editorInstance && editorInstance.view && editorInstance.view.dom
            ? editorInstance.view.dom
            : this.editor && this.editor.view && this.editor.view.dom
              ? this.editor.view.dom
              : pageRoot.querySelector(".writer-prosemirror");
        const firstParagraph = activeEditor
          ? activeEditor.querySelector("p")
          : null;
        const currentFamily = this.getCurrentFontFamily();
        const styleId = currentFamily
          ? `writer-font-face-${String(currentFamily).replace(
              /[^a-zA-Z0-9_-]/g,
              "_"
            )}`
          : "";
        const debugInfo = {
          stage,
          selectedFont: this.writerSettings.font || "",
          configuredFamily: currentFamily,
          styleFamily: this.currentFontFamilyStyleValue,
          canSwitchFont: this.canSwitchFont,
          downloadState: this.fontDownloadState[this.writerSettings.font] || "",
          fontFaceRegistered: styleId ? !!document.getElementById(styleId) : false,
          editorRootStyle: activeEditor ? activeEditor.getAttribute("style") : "",
          editorRootComputedFamily: activeEditor
            ? window.getComputedStyle(activeEditor).fontFamily
            : "",
          firstParagraphStyle: firstParagraph
            ? firstParagraph.getAttribute("style")
            : "",
          firstParagraphComputedFamily: firstParagraph
            ? window.getComputedStyle(firstParagraph).fontFamily
            : "",
          documentFontsCheck:
            document.fonts && document.fonts.check && currentFamily
              ? document.fonts.check(`16px ${this.getFontFamilyStyleValue(currentFamily)}`)
              : null,
        };
        window.__writerFontDebug = debugInfo;
        console.log("[writer-font-debug]", JSON.stringify(debugInfo));
      } catch (error) {
        console.warn("[writer-font-debug] capture failed", error);
      }
    },
    normalizeWriterFont() {
      if (!this.canSwitchFont) {
        this.showFontsSelectDrawer = false;
        return;
      }

      const oldFont = this.writerSettings.font;
      if (!this.writerSettings.font || !this.fonts[this.writerSettings.font]) {
        this.writerSettings.font = "default";
      }
      if (oldFont !== this.writerSettings.font) {
        this.persistWriterSettings();
      }
    },
    getServerFontVersion(font) {
      if (!font || font.font_version === undefined || font.font_version === null) {
        return "1";
      }
      return String(font.font_version);
    },
    mergeServerFonts(serverFonts) {
      const defaultFonts = this.getDefaultFonts();
      const mergedFonts = {
        default:
          defaultFonts.default ||
          { name: "系统默认", family: "", familyBold: "", version: "1" },
      };
      if (!Array.isArray(serverFonts)) {
        this.fonts = mergedFonts;
        return;
      }

      for (const item of serverFonts) {
        if (
          !item ||
          !item.font_key ||
          !item.font_name ||
          !item.regular_family ||
          !item.regular_url
        ) {
          continue;
        }

        mergedFonts[item.font_key] = {
          name: item.font_name,
          family: item.regular_family,
          familyBold: item.bold_family || item.regular_family,
          version: this.getServerFontVersion(item),
          regular: {
            url: item.regular_url,
            format: item.regular_format || "ttf",
          },
          bold: item.bold_url
            ? {
                url: item.bold_url,
                format: item.bold_format || "ttf",
              }
            : null,
        };
      }

      this.fonts = mergedFonts;
    },
    async loadWriterFontsFromServer() {
      try {
        const res = await axios.get(this.$baseUrl + "/app/get_reader_fonts", {});
        if (res.status === 200 && Array.isArray(res.data)) {
          this.mergeServerFonts(res.data);
          return;
        }
      } catch (error) {
        console.warn("loadWriterFontsFromServer failed", error);
      }
      this.fonts = this.getDefaultFonts();
    },
    normalizeFontFormat(format) {
      const normalized = String(format || "").toLowerCase();
      if (normalized === "otf") return "opentype";
      if (normalized === "woff") return "woff";
      if (normalized === "woff2") return "woff2";
      return "truetype";
    },
    registerRuntimeFontFace(fontFamily, fontUri, format) {
      if (!fontFamily || !fontUri) {
        return;
      }

      const styleId = `writer-font-face-${String(fontFamily).replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      )}`;
      if (document.getElementById(styleId)) {
        return;
      }

      const escapedFamily = String(fontFamily)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `@font-face { font-family: "${escapedFamily}"; src: url("${fontUri}") format("${this.normalizeFontFormat(format)}"); font-display: swap; }`;
      document.head.appendChild(style);
    },
    logWriterFontError(stage, error, extra = {}) {
      const debugInfo = {
        stage,
        ...extra,
        errorName: error && error.name ? error.name : "",
        errorMessage: error && error.message ? error.message : String(error || ""),
        errorStack: error && error.stack ? error.stack : "",
      };
      console.error("[writer-font]", JSON.stringify(debugInfo), debugInfo.errorStack || error);
      try {
        window.__writerFontLastError = {
          at: new Date().toISOString(),
          ...debugInfo,
        };
      } catch (storageError) {
        console.warn("[writer-font] store debug info failed", storageError);
      }
    },
    async ensureFontAssetDownloaded(fontKey, assetConfig, assetType) {
      if (!assetConfig || !assetConfig.url || !assetConfig.family) {
        return true;
      }
      if (this.runtimeLoadedFonts[assetConfig.family]) {
        return true;
      }
      if (!window.jsBridge || !window.jsBridge.downloadFont) {
        throw new Error("downloadFont bridge unavailable");
      }

      const fontMeta = this.fonts[fontKey] || {};
      const version = String(fontMeta.version || "1");
      const bridgeFontKey = `${fontKey}_${assetType}`;
      try {
        console.log(
          "[writer-font] start download",
          JSON.stringify({
            fontKey,
            bridgeFontKey,
            assetType,
            family: assetConfig.family,
            url: assetConfig.url,
            format: assetConfig.format || "ttf",
            version,
          })
        );
        const fontUri = await window.jsBridge.downloadFont(
          bridgeFontKey,
          assetConfig.url,
          assetConfig.format || "ttf",
          version
        );
        console.log(
          "[writer-font] downloadFont resolved",
          JSON.stringify({
            fontKey,
            bridgeFontKey,
            assetType,
            fontUri,
          })
        );
        if (!fontUri || typeof fontUri !== "string") {
          throw new Error("invalid font uri");
        }

        this.registerRuntimeFontFace(assetConfig.family, fontUri, assetConfig.format);
        if (document.fonts && document.fonts.load) {
          await document.fonts.load(
            `16px ${this.getFontFamilyStyleValue(assetConfig.family)}`
          );
          console.log(
            "[writer-font] document.fonts.load resolved",
            JSON.stringify({
              fontKey,
              assetType,
              family: assetConfig.family,
            })
          );
        }
        this.$set(this.runtimeLoadedFonts, assetConfig.family, true);
        return true;
      } catch (error) {
        this.logWriterFontError("ensureFontAssetDownloaded", error, {
          fontKey,
          bridgeFontKey,
          assetType,
          family: assetConfig.family,
          url: assetConfig.url,
          format: assetConfig.format || "ttf",
          version,
        });
        throw error;
      }
    },
    async ensureRuntimeFontReady(fontKey) {
      if (!fontKey || fontKey === "default") {
        return true;
      }
      if (!this.canSwitchFont) {
        return false;
      }
      if (this.fontDownloadState[fontKey] === "downloading") {
        return false;
      }

      const targetFont = this.fonts[fontKey];
      if (!targetFont || !targetFont.regular || !targetFont.regular.url) {
        return false;
      }

      try {
        this.$set(this.fontDownloadState, fontKey, "downloading");
        await this.ensureFontAssetDownloaded(
          fontKey,
          {
            ...targetFont.regular,
            family: targetFont.family,
          },
          "regular"
        );
        if (targetFont.bold && targetFont.bold.url && targetFont.familyBold) {
          await this.ensureFontAssetDownloaded(
            fontKey,
            {
              ...targetFont.bold,
              family: targetFont.familyBold,
            },
            "bold"
          );
        }
        this.$set(this.fontDownloadState, fontKey, "ready");
        return true;
      } catch (error) {
        this.logWriterFontError("ensureRuntimeFontReady", error, {
          fontKey,
          targetFont,
        });
        this.$set(this.fontDownloadState, fontKey, "failed");
        uni.showToast({
          title: "字体下载失败",
          icon: "none",
        });
        return false;
      }
    },
    async initWriterFonts() {
      this.syncAppEnvironment();
      if (!this.canSwitchFont) {
        const defaultFonts = this.getDefaultFonts();
        this.fonts = {
          default: defaultFonts.default || { name: "系统默认", family: "" },
        };
        this.normalizeWriterFont();
        this.$nextTick(() => {
          this.applyEditorFontSize();
        });
        return;
      }

      await this.loadWriterFontsFromServer();
      this.normalizeWriterFont();
      const ready = await this.ensureRuntimeFontReady(this.writerSettings.font);
      if (this.writerSettings.font !== "default" && !ready) {
        this.writerSettings.font = "default";
        this.persistWriterSettings();
      }
      this.$nextTick(() => {
        this.applyEditorFontSize();
      });
    },
    async selectFont(fontKey) {
      if (!this.canSwitchFont || !this.fonts[fontKey]) {
        return;
      }
      if (fontKey !== "default") {
        const ready = await this.ensureRuntimeFontReady(fontKey);
        if (!ready) return;
      }

      this.writerSettings.font = fontKey;
      this.showFontsSelectDrawer = false;
      this.persistWriterSettings();
      this.$nextTick(() => {
        this.applyEditorFontSize();
        this.captureWriterFontDebug("selectFont");
      });
    },
    handleTitleInput(event) {
      this.saveTitleInputSelection(event);
      this.debugTitleSelection("title-input", {
        eventType: event && event.type,
      });
      this.markWritingActivity();
      this.hasNewInput = true;
      this.lastInputTime = new Date();
      this.contentVersion += 1;
      this.markSyncPending();
      this.scheduleTitleCapsuleClearanceUpdate();
      this.scheduleInputSync();
    },
    handleTitleInputFocus(event) {
      this.titleInputFocused = true;
      this.pendingTitleInsertion = false;
      this.debugTitleSelection("title-focus-before-capture", {
        eventType: event && event.type,
      });
      this.scheduleTitleSelectionCapture(event);
    },
    handleTitleInputBlur() {
      this.debugTitleSelection("title-blur-before-state-change");
      this.titleInputFocused = false;
      this.pendingTitleInsertion = true;
      this.debugTitleSelection("title-blur-after-state-change");
    },
    scheduleTitleCapsuleClearanceUpdate() {
      if (typeof window === "undefined") {
        return;
      }

      if (this._titleCapsuleClearanceRaf) {
        if (typeof window.cancelAnimationFrame === "function") {
          window.cancelAnimationFrame(this._titleCapsuleClearanceRaf);
        } else {
          clearTimeout(this._titleCapsuleClearanceRaf);
        }
      }

      const schedule =
        typeof window.requestAnimationFrame === "function"
          ? window.requestAnimationFrame.bind(window)
          : (callback) => setTimeout(callback, 16);

      this._titleCapsuleClearanceRaf = schedule(() => {
        this._titleCapsuleClearanceRaf = 0;
        this.updateTitleCapsuleClearance();
      });
    },
    measureTitleTextWidth(titleInput) {
      const title = String(this.article.title || "");
      if (!title) {
        return 0;
      }

      if (typeof window === "undefined" || typeof document === "undefined") {
        return title.length * Number(this.writerSettings.fontSize || 35);
      }

      const computedStyle = window.getComputedStyle
        ? window.getComputedStyle(titleInput)
        : null;
      const canvas =
        this._titleMeasureCanvas || document.createElement("canvas");
      this._titleMeasureCanvas = canvas;
      const context = canvas.getContext ? canvas.getContext("2d") : null;

      if (context) {
        const fallbackFontSize = toResponsivePixelNumber(
          this.writerSettings.fontSize || DEFAULT_SETTINGS.fontSize
        );
        const font =
          computedStyle && computedStyle.font
            ? computedStyle.font
            : `${fallbackFontSize}px sans-serif`;
        context.font = font;
        return context.measureText(title).width;
      }

      const fontSize =
        computedStyle && computedStyle.fontSize
          ? Number.parseFloat(computedStyle.fontSize)
          : Number(this.writerSettings.fontSize || 35);
      return title.length * (Number.isFinite(fontSize) ? fontSize : 35);
    },
    updateTitleCapsuleClearance() {
      if (typeof window === "undefined") {
        return;
      }

      const pageRoot = this.$el;
      if (!pageRoot || !pageRoot.querySelector) {
        return;
      }

      const titleInput = pageRoot.querySelector(".chapterTitleInput");
      const topBar = pageRoot.querySelector(".topBar");
      if (
        !titleInput ||
        !topBar ||
        typeof titleInput.getBoundingClientRect !== "function" ||
        typeof topBar.getBoundingClientRect !== "function"
      ) {
        return;
      }

      const title = String(this.article.title || "").trim();
      if (!title) {
        this.titleNeedsStatusCapsuleClearance = false;
        return;
      }

      const inputRect = titleInput.getBoundingClientRect();
      const capsuleRect = topBar.getBoundingClientRect();
      const safetyGap = toResponsivePixelNumber(16);
      const availableWidth = capsuleRect.left - inputRect.left - safetyGap;
      const titleWidth = this.measureTitleTextWidth(titleInput);

      this.titleNeedsStatusCapsuleClearance =
        Number.isFinite(availableWidth) &&
        titleWidth > Math.max(0, availableWidth);
    },
    getSyncState(articleId = this.chapterId) {
      return readWriterSyncState(
        Number(this.currentUserId || 0),
        Number(articleId || 0)
      );
    },
    clearSyncState(articleId = this.chapterId) {
      clearWriterSyncState(
        Number(this.currentUserId || 0),
        Number(articleId || 0)
      );
    },
    hasPendingSync() {
      return isWriterSyncStatePending(this.getSyncState());
    },
    markSyncPending(localCreateTime = "", lastError = "") {
      return markWriterSyncPending({
        userId: Number(this.currentUserId || 0),
        articleId: Number(this.chapterId || 0),
        content: this.article.content,
        localCreateTime,
        sessionId: this.editSessionId,
        previousState: this.getSyncState(),
        lastError,
      });
    },
    markSyncSynced(currentServerTime, remoteUpdatedAt = "") {
      const previousState = this.getSyncState() || {};
      return markWriterSyncSynced({
        userId: Number(this.currentUserId || 0),
        articleId: Number(this.chapterId || 0),
        content: this.article.content,
        remoteCreateTime:
          currentServerTime || previousState.remote_create_time || "",
        remoteUpdatedAt:
          remoteUpdatedAt || previousState.remote_updated_at || "",
        sessionId: this.editSessionId,
      });
    },
    markSyncInvalidated(localCreateTime = "", lastError = "") {
      return markWriterSyncInvalidated({
        userId: Number(this.currentUserId || 0),
        articleId: Number(this.chapterId || 0),
        content: this.article.content,
        localCreateTime,
        sessionId: this.editSessionId,
        previousState: this.getSyncState(),
        lastError,
      });
    },
    async getCurrentSyncTime() {
      const serverTime = await getServerTime();
      return serverTime || buildClientSyncTime();
    },
    scheduleInputSync() {
      if (this.shouldSuppressEditorSyncForCompletedPublish()) {
        return;
      }

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
        this.pauseForBackground();
        return;
      }

      if (this.shouldSuppressEditorSyncForCompletedPublish()) {
        return;
      }

      this.startSaveNotifyTimer();
      if (this.loadComplete) {
        this.startLocalSaveTimer();
        this.claimEditLock();
      }
    },
    handlePageHide() {
      this.pauseForBackground();
    },
    getErrorResponseData(error) {
      return error && error.response && error.response.data
        ? error.response.data
        : {};
    },
    getErrorLockInfo(error) {
      const data = this.getErrorResponseData(error);
      if (data && data.lock && typeof data.lock === "object") {
        return data.lock;
      }
      if (data && data.current_lock && typeof data.current_lock === "object") {
        return data.current_lock;
      }
      return null;
    },
    getLockSessionId(lockInfo) {
      if (!lockInfo) return "";
      return String(
        lockInfo.session_id ||
          lockInfo.edit_session_id ||
          lockInfo.sessionId ||
          ""
      ).trim();
    },
    getLockUserId(lockInfo) {
      if (!lockInfo) return 0;
      return Number(
        lockInfo.user_id ||
          lockInfo.editor_user_id ||
          lockInfo.owner_user_id ||
          lockInfo.uid ||
          0
      );
    },
    isCurrentSessionLock(lockInfo) {
      const lockSessionId = this.getLockSessionId(lockInfo);
      return (
        !!lockSessionId && lockSessionId === String(this.editSessionId || "")
      );
    },
    isLockOwnedByCurrentUser(lockInfo) {
      const lockUserId = this.getLockUserId(lockInfo);
      const currentUserId = Number(this.currentUserId || 0);
      return !!(lockUserId && currentUserId && lockUserId === currentUserId);
    },
    isDefiniteLockConflictError(error) {
      if (!error || !error.response || error.response.status !== 409) {
        return false;
      }
      if (this.isStaleSessionError(error)) {
        return false;
      }

      const data = this.getErrorResponseData(error);
      const code = String(data.code || data.error_code || "").trim();
      const lockInfo = this.getErrorLockInfo(error);
      if (
        this.isCurrentSessionLock(lockInfo) ||
        this.isLockOwnedByCurrentUser(lockInfo)
      ) {
        return false;
      }

      if (DEFINITE_LOCK_CONFLICT_CODES.includes(code)) {
        return true;
      }

      const lockSessionId = this.getLockSessionId(lockInfo);
      const lockUserId = this.getLockUserId(lockInfo);
      const currentUserId = Number(this.currentUserId || 0);
      const lockHolderName = String(
        (lockInfo && (lockInfo.name || lockInfo.editor_name)) || ""
      ).trim();
      return !!(
        lockInfo &&
        ((lockUserId && currentUserId && lockUserId !== currentUserId) ||
          (!lockUserId &&
            lockSessionId &&
            lockSessionId !== String(this.editSessionId || "")) ||
          lockHolderName)
      );
    },
    isRecoverableLockError(error) {
      if (
        this.isStaleSessionError(error) ||
        this.isDefiniteLockConflictError(error)
      ) {
        return false;
      }
      if (!error || !error.response) {
        return true;
      }

      const status = Number(error.response.status || 0);
      return status === 408 || status === 409 || status === 429 || status >= 500;
    },
    clearLockReconnectTimer() {
      clearTimeout(this.lockReconnectTimer);
      this.lockReconnectTimer = null;
    },
    markLockActive() {
      const wasReconnecting = this.lockState === "reconnecting";
      this.lockState = "active";
      this.lockReconnectAttempts = 0;
      this.lockReconnectInFlight = false;
      this.clearLockReconnectTimer();
      this.refreshSaveNotifyText();
      if (wasReconnecting && this.loadComplete && this.hasPendingSync()) {
        this.flushDraftToCloud({
          isFastSave: false,
          forceSlowSave: false,
          waitForBusy: false,
        });
      }
    },
    markLockReconnecting(error) {
      if (this.lockState === "lost") {
        return;
      }
      this.currentEditLock = this.getErrorLockInfo(error) || this.currentEditLock;
      this.lockState = "reconnecting";
      this.stopLockHeartbeat();
      this.refreshSaveNotifyText();
      this.scheduleLockReconnect();
    },
    scheduleLockReconnect() {
      if (this.leaveFinalized || document.visibilityState === "hidden") {
        return;
      }
      if (this.lockReconnectTimer || this.lockReconnectInFlight) {
        return;
      }

      const delay =
        LOCK_RECONNECT_DELAYS_MS[
          Math.min(this.lockReconnectAttempts, LOCK_RECONNECT_DELAYS_MS.length - 1)
        ];
      this.lockReconnectAttempts += 1;
      this.lockReconnectTimer = setTimeout(() => {
        this.lockReconnectTimer = null;
        this.recoverEditLock();
      }, delay);
    },
    async recoverEditLock() {
      if (this.leaveFinalized || document.visibilityState === "hidden") {
        return;
      }
      if (this.lockReconnectInFlight) {
        return;
      }

      this.lockReconnectInFlight = true;
      try {
        await this.claimEditLock({ fromReconnect: true });
      } finally {
        this.lockReconnectInFlight = false;
        if (this.lockState === "reconnecting") {
          this.scheduleLockReconnect();
        }
      }
    },
    async claimEditLock(options = {}) {
      const tk = this.getAuthToken();
      if (!tk || !this.chapterId || !this.editSessionId) return false;

      try {
        const response = await axios.post(
          this.$baseUrl + "/essays/claim_article_edit_lock",
          {
            article_id: this.chapterId,
            session_id: this.editSessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );
        this.currentEditLock = response.data.lock || null;
        this.markLockActive();
        this.startLockHeartbeat();
        return true;
      } catch (error) {
        if (this.isStaleSessionError(error)) {
          const staleAction = this.handleStaleSessionError(error);
          return staleAction === "reconnecting" && !options.fromReconnect;
        }
        if (this.isDefiniteLockConflictError(error)) {
          this.currentEditLock = this.getErrorLockInfo(error);
          this.handleLockConflict(this.currentEditLock);
          return false;
        }
        if (this.isRecoverableLockError(error)) {
          this.markLockReconnecting(error);
          return options.fromReconnect ? false : true;
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
      if (!tk || !this.chapterId || !this.editSessionId) return;

      try {
        const response = await axios.post(
          this.$baseUrl + "/essays/heartbeat_article_edit_lock",
          {
            article_id: this.chapterId,
            session_id: this.editSessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );
        this.currentEditLock = response.data.lock || null;
        this.markLockActive();
      } catch (error) {
        if (this.isStaleSessionError(error)) {
          this.handleStaleSessionError(error);
          return;
        }
        if (this.isDefiniteLockConflictError(error)) {
          this.stopLockHeartbeat();
          this.currentEditLock = this.getErrorLockInfo(error);
          this.handleLockConflict(this.currentEditLock);
          return;
        }
        this.markLockReconnecting(error);
      }
    },
    async releaseEditLock() {
      const tk = this.getAuthToken();
      if (!tk || !this.chapterId || !this.editSessionId) return;

      try {
        await axios.post(
          this.$baseUrl + "/essays/release_article_edit_lock",
          {
            article_id: this.chapterId,
            session_id: this.editSessionId,
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
    isStaleSessionError(error) {
      return !!(
        error &&
        error.response &&
        error.response.status === 409 &&
        error.response.data &&
        error.response.data.code === "stale_session"
      );
    },
    isRecoverableStaleSessionError(error) {
      if (!this.isStaleSessionError(error)) {
        return false;
      }

      const lockInfo = this.getErrorLockInfo(error);
      if (!lockInfo || this.isCurrentSessionLock(lockInfo)) {
        return true;
      }

      return this.isLockOwnedByCurrentUser(lockInfo);
    },
    handleStaleSessionError(error) {
      if (this.isRecoverableStaleSessionError(error)) {
        const syncTime = buildClientSyncTime();
        this.markSyncPending(syncTime, "stale_session_reconnecting");
        this.markLockReconnecting(error);
        return "reconnecting";
      }

      const lockInfo = this.getErrorLockInfo(error);
      if (lockInfo) {
        this.currentEditLock = lockInfo;
        this.handleLockConflict(lockInfo);
        return "conflict";
      }

      this.handleStaleSessionInvalidation(error);
      return "invalidated";
    },
    handleStaleSessionInvalidation(error) {
      if (!this.publishHandoffActive) {
        const syncTime = buildClientSyncTime();
        this.markSyncInvalidated(syncTime, "stale_session");
      }
      this.lockState = "lost";
      this.clearLockReconnectTimer();
      this.stopLockHeartbeat();
      clearInterval(this.saveInterval);
      this.saveInterval = undefined;
      clearTimeout(this.inputSyncTimer);
      this.inputSyncTimer = undefined;

      const shouldPrompt =
        !this.publishHandoffActive &&
        document.visibilityState !== "hidden" &&
        this.leaveFinalized !== true;
      if (!shouldPrompt) {
        return;
      }

      uni.showModal({
        title: "编辑会话已失效",
        content: "这个页面的编辑会话已经被新的操作接管，请重新进入章节继续编辑。",
        showCancel: false,
        success: () => {
          uni.navigateBack({});
        },
      });
    },
    async persistPauseSnapshot() {
      if (this.shouldSuppressEditorSyncForCompletedPublish()) {
        return;
      }

      if (!this.loadComplete || (!this.hasNewInput && !this.hasPendingSync())) {
        return;
      }

      const currentSyncTime = await this.getCurrentSyncTime();
      if (!currentSyncTime) {
        return;
      }

      await this.saveLocalArticle(currentSyncTime);
      this.markSyncPending(currentSyncTime);
    },
    async pauseForBackground() {
      if (this.pauseSyncPromise) {
        return this.pauseSyncPromise;
      }

      this.pauseSyncPromise = (async () => {
        await this.stopWritingTimer();
        this.clearLockReconnectTimer();
        this.stopLockHeartbeat();
        this.stopSaveNotifyTimer();
        this.clearPendingEditorSyncTimers();
        if (this.shouldSuppressEditorSyncForCompletedPublish()) {
          return;
        }
        await this.persistPauseSnapshot();
      })();

      try {
        await this.pauseSyncPromise;
      } finally {
        this.pauseSyncPromise = null;
      }
    },
    async finalizeBeforeLeave() {
      if (this.leaveFinalized) {
        return;
      }
      if (this.finalizeLeavePromise) {
        return this.finalizeLeavePromise;
      }

      this.leaveFinalized = true;
      this.finalizeLeavePromise = (async () => {
        const suppressPublishSync =
          this.shouldSuppressEditorSyncForCompletedPublish();
        await this.pauseForBackground();
        if (
          this.loadComplete &&
          !suppressPublishSync &&
          !this.shouldSuppressEditorSyncForCompletedPublish()
        ) {
          try {
            await this.flushDraftToCloud({
              isFastSave: false,
              forceSlowSave: true,
              waitForBusy: true,
            });
          } catch (error) {}
        }
        await this.releaseEditLock();
      })();

      try {
        await this.finalizeLeavePromise;
      } finally {
        this.finalizeLeavePromise = null;
      }
    },
    handleLockConflict(lockInfo) {
      if (this.lockState === "lost") {
        return;
      }
      this.lockState = "lost";
      this.clearLockReconnectTimer();
      this.stopLockHeartbeat();
      clearTimeout(this.inputSyncTimer);
      this.inputSyncTimer = undefined;
      const lockName = lockInfo && lockInfo.name ? lockInfo.name : "其他作者";
      uni.showModal({
        title: "章节已被占用",
        content: `${lockName} 正在编辑这个章节，请稍后再试。`,
        showCancel: false,
        success: () => {
          uni.navigateBack();
        },
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
      if (this.shouldSuppressEditorSyncForCompletedPublish()) {
        return;
      }
      if (!this.loadComplete) return;
      if (!forceSlowSave && !this.hasNewInput && !this.hasPendingSync()) {
        return;
      }

      return this.executeSyncTask(async () => {
        const hasPendingBeforeSync = this.hasNewInput || this.hasPendingSync();
        if (!forceSlowSave && !hasPendingBeforeSync) {
          return;
        }

        const currentServerTime = await this.getCurrentSyncTime();
        if (!currentServerTime) {
          return;
        }

        if (this.lockState === "lost") {
          if (forceSlowSave) {
            await this.slowSaveLocalArticle(currentServerTime, true);
          } else {
            await this.saveLocalArticle(currentServerTime);
          }
          this.markSyncInvalidated(currentServerTime, "lock_lost");
          return;
        }

        if (this.lockState === "reconnecting") {
          if (forceSlowSave) {
            await this.slowSaveLocalArticle(currentServerTime, true);
          } else {
            await this.saveLocalArticle(currentServerTime);
          }
          this.markSyncPending(currentServerTime, "lock_reconnecting");
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
    normalizeCreateTime(dateString) {
      const digits = String(dateString || "").replace(/\D/g, "");
      if (!digits) {
        return "";
      }
      if (digits.length >= 20) {
        return digits.slice(0, 20);
      }
      if (digits.length >= 14) {
        return `${digits.slice(0, 14)}${digits.slice(14, 20).padEnd(6, "0")}`;
      }
      return digits.padEnd(20, "0");
    },
    getVersionMarker(record) {
      if (!record) {
        return "";
      }
      return this.normalizeCreateTime(
        record.updated_at ||
          record.remote_updated_at ||
          record.writer_updated_at ||
          record.create_time ||
          ""
      );
    },
    async getArticleHistoryMeta() {
      let tk = this.getAuthToken();
      const response = await axios.get(
        this.$baseUrl + "/essays/get_article_history_meta?id=" + this.chapterId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tk,
          },
        }
      );
      return Array.isArray(response.data) ? response.data : [];
    },
    getRemoteEditorsSince(historyRecords, sinceCreateTime) {
      const since = this.normalizeCreateTime(sinceCreateTime);
      const editors = [];
      const seen = new Set();

      for (const record of historyRecords || []) {
        const recordTime = this.getVersionMarker(record);
        if (since && recordTime && recordTime <= since) {
          continue;
        }

        const editorId = Number(record.editor_user_id || 0);
        const editorName = String(record.editor_name || "").trim();
        if (editorId && editorId === Number(this.currentUserId || 0)) {
          continue;
        }
        if (!editorId && !editorName) {
          continue;
        }

        const uniqueKey = editorId ? `user:${editorId}` : `name:${editorName}`;
        if (seen.has(uniqueKey)) {
          continue;
        }
        seen.add(uniqueKey);
        editors.push({
          user_id: editorId || null,
          name: editorName || "未知作者",
        });
      }

      return editors;
    },
    formatConflictEditorsSummary(editors) {
      if (!editors || editors.length === 0) {
        return "";
      }

      const names = editors
        .map((editor) => String(editor.name || "").trim())
        .filter(Boolean);
      if (names.length === 0) {
        return "";
      }
      if (names.length === 1) {
        return `${names[0]}编辑过本章`;
      }
      if (names.length === 2) {
        return `${names[0]}、${names[1]}编辑过本章`;
      }
      return `${names[0]}等${names.length}人编辑过本章`;
    },
    buildConflictDialogSubtitle(editors) {
      const summary = this.formatConflictEditorsSummary(editors);
      if (summary) {
        return `自从你上次保存后，${summary}。请选择要保留的版本。`;
      }
      return "检测到本地草稿和云端草稿不一致，请选择要保留的版本。";
    },
    buildArticle(raw) {
      const article = raw || {};
      if (article.current_access) {
        this.editorAccess = article.current_access;
      }
      return {
        ...article,
        article_id: Number(article.article_id || this.chapterId),
        title: article.title || "",
        content: article.content || DEFAULT_CONTENT,
        novel_info: article.novel_info || {},
        is_draft: article.is_draft == null ? 1 : article.is_draft,
      };
    },
    normalizeCurrentArticleContentForStorage() {
      const normalizedContent = normalizeLegacyContentForStorage(
        this.article.content
      );
      if (normalizedContent !== this.article.content) {
        this.article.content = normalizedContent;
      }
      return this.article.content;
    },
    async canAutoRecoverPendingLocalDraft(latestLocalArticle, remoteArticle) {
      const syncState = this.getSyncState();
      if (
        !syncState ||
        !["pending", "invalidated"].includes(String(syncState.status || ""))
      ) {
        return false;
      }

      const localHash = computeWriterContentHash(latestLocalArticle.content);
      if (!syncState.local_hash || syncState.local_hash !== localHash) {
        return false;
      }

      const baseRemoteCreateTime = this.normalizeCreateTime(
        syncState.remote_updated_at || syncState.remote_create_time || ""
      );
      const remoteCreateTime = this.getVersionMarker(remoteArticle);
      const remoteSessionId = String(
        (remoteArticle && remoteArticle.edit_session_id) || ""
      ).trim();

      if (
        baseRemoteCreateTime &&
        remoteCreateTime &&
        remoteCreateTime > baseRemoteCreateTime &&
        remoteSessionId &&
        remoteSessionId !== String(syncState.session_id || "").trim()
      ) {
        return false;
      }

      if (!baseRemoteCreateTime) {
        return true;
      }

      try {
        const historyMeta = await this.getArticleHistoryMeta();
        const remoteEditors = this.getRemoteEditorsSince(
          historyMeta,
          baseRemoteCreateTime
        );
        return remoteEditors.length === 0;
      } catch (error) {
        return false;
      }
    },
    refreshCounts() {
      const stats = countLegacyContent(
        parseLegacyContent(this.article.content)
      );
      this.textCount = stats.textCount;
      this.imageCount = stats.imageCount;
    },
    applyEditorFontSize(editorInstance = null) {
      const fontSize = this.fontSizeStyleValue;
      const fontFamily = this.currentFontFamilyStyleValue;
      if (!fontSize && !fontFamily) return;
      this.syncEditorRootAttributes(editorInstance);
      this.applyEditorDisplayFontMark(editorInstance);

      const applyFontFamily = (element) => {
        if (!element) return;
        if (fontFamily) {
          element.style.setProperty("font-family", fontFamily, "important");
        } else {
          element.style.removeProperty("font-family");
        }
      };

      const pageRoot = this.$el || document;
      const titleInputElements = pageRoot.querySelectorAll(
        [
          ".chapterTitleBar .input",
          ".chapterTitleBar .input *",
          ".chapterTitleBar input",
          ".chapterTitleBar uni-input",
          ".chapterTitleBar .uni-input-wrapper",
          ".chapterTitleBar .uni-input-input",
        ].join(",")
      );
      titleInputElements.forEach((titleInput) => {
        if (fontSize) {
          titleInput.style.fontSize = fontSize;
        }
        if (fontFamily) {
          titleInput.style.setProperty("--editor-font-family", fontFamily);
        } else {
          titleInput.style.removeProperty("--editor-font-family");
        }
        applyFontFamily(titleInput);
      });

      const editorContainer = pageRoot.querySelector(".textarea");
      if (editorContainer) {
        if (fontSize) {
          editorContainer.style.fontSize = fontSize;
          editorContainer.style.setProperty("--editor-font-size", fontSize);
        }
        if (fontFamily) {
          editorContainer.style.setProperty("--editor-font-family", fontFamily);
        } else {
          editorContainer.style.removeProperty("--editor-font-family");
        }
        applyFontFamily(editorContainer);
      }

      const activeEditor =
        editorInstance && editorInstance.view && editorInstance.view.dom
          ? editorInstance.view.dom
          : this.editor && this.editor.view && this.editor.view.dom
            ? this.editor.view.dom
            : pageRoot.querySelector(".writer-prosemirror");

      if (!activeEditor) return;

      if (fontSize) {
        activeEditor.style.fontSize = fontSize;
        activeEditor.style.setProperty("--editor-font-size", fontSize);
      }
      if (fontFamily) {
        activeEditor.style.setProperty("--editor-font-family", fontFamily);
      } else {
        activeEditor.style.removeProperty("--editor-font-family");
      }
      applyFontFamily(activeEditor);

      const paragraphs = activeEditor.querySelectorAll("p");
      paragraphs.forEach((paragraph) => {
        if (fontSize) {
          paragraph.style.fontSize = fontSize;
        }
        applyFontFamily(paragraph);
      });
    },
    applyEditorDisplayFontMark(editorInstance = null) {
      const activeEditor = editorInstance || this.editor;
      if (
        !activeEditor ||
        !activeEditor.state ||
        !activeEditor.view ||
        !activeEditor.state.schema ||
        !activeEditor.state.schema.marks ||
        !activeEditor.state.schema.marks.textStyle
      ) {
        return;
      }

      const fontFamily = this.currentFontFamilyStyleValue;
      const textStyleType = activeEditor.state.schema.marks.textStyle;
      const tr = activeEditor.state.tr;
      let changed = false;

      activeEditor.state.doc.descendants((node, pos) => {
        if (!node.isText || !node.text) {
          return true;
        }

        const from = pos;
        const to = pos + node.nodeSize;
        tr.removeMark(from, to, textStyleType);
        if (fontFamily) {
          tr.addMark(
            from,
            to,
            textStyleType.create({
              fontFamily,
            })
          );
        }
        changed = true;
        return true;
      });

      if (fontFamily) {
        tr.addStoredMark(
          textStyleType.create({
            fontFamily,
          })
        );
      } else {
        tr.removeStoredMark(textStyleType);
      }
      tr.setMeta("addToHistory", false);
      tr.setMeta("writerDisplayFont", true);

      if (!changed && !fontFamily) {
        return;
      }

      this.isApplyingEditorDisplayFont = true;
      try {
        activeEditor.view.dispatch(tr);
      } finally {
        this.isApplyingEditorDisplayFont = false;
      }
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
            paragraph: false,
            strike: false,
          }),
          LegacyParagraph,
          TextStyle,
          WriterFontFamily,
          Image.configure({
            inline: false,
          }),
          NewParagraphSpace,
        ],
        content: legacyBlocksToDoc(parseLegacyContent(this.article.content)),
        editorProps: {
          attributes: this.getEditorRootAttributes(),
          handleDOMEvents: this.getEditorDomEventHandlers(),
        },
        onCreate: ({ editor }) => {
          const blocks = docToLegacyBlocks(editor.getJSON());
          this.article.content = stringifyLegacyContent(blocks);
          this.refreshCounts();
          this.$nextTick(() => {
            this.applyEditorFontSize(editor);
          });
        },
        onUpdate: ({ editor }) => {
          if (this.isApplyingEditorDisplayFont) {
            this.refreshCounts();
            return;
          }
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
        onFocus: () => {
          this.handleEditorFocusChange(true);
          this.handleEditorActivationEnd();
        },
        onBlur: () => {
          this.handleEditorFocusChange(false);
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
      this.$nextTick(() => {
        this.applyEditorFontSize();
      });
    },
    async getArticleWriter() {
      let tk = this.getAuthToken();
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
      let tk = this.getAuthToken();
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
      const currentServerTime = await this.getCurrentSyncTime();
      let tk = this.getAuthToken();
      return axios.post(
        this.$baseUrl + "/essays/sync_article_writer_from_reader",
        {
          article_id: this.chapterId,
          create_time: currentServerTime,
          edit_session_id: this.editSessionId,
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
      if (this.shouldSuppressEditorSyncForCompletedPublish()) {
        return null;
      }

      this.normalizeCurrentArticleContentForStorage();
      this.lastUploadTime = new Date();
      let tk = this.getAuthToken();

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
            edit_session_id: this.editSessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tk,
            },
          }
        );
        const writerSnapshot =
          (response &&
            response.data &&
            response.data.writer_snapshot &&
            typeof response.data.writer_snapshot === "object" &&
            response.data.writer_snapshot) ||
          (response && response.data && typeof response.data === "object"
            ? response.data
            : {});

        if (snapshotVersion >= this.contentVersion) {
          this.hasNewInput = false;
          this.markSyncSynced(
            writerSnapshot.create_time || currentServerTime,
            writerSnapshot.updated_at || ""
          );
          this.updateSaveNotify(false);
        } else {
          this.markSyncPending(currentServerTime);
        }

        return response;
      } catch (error) {
        if (this.isStaleSessionError(error)) {
          this.handleStaleSessionError(error);
          return null;
        }
        if (this.isDefiniteLockConflictError(error)) {
          this.currentEditLock = this.getErrorLockInfo(error);
          this.handleLockConflict(this.currentEditLock);
          return null;
        }
        if (this.isRecoverableLockError(error)) {
          this.markSyncPending(currentServerTime, "upload_reconnecting");
          this.markLockReconnecting(error);
          return null;
        }
        this.markSyncPending(currentServerTime, "upload_failed");
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
        let currentAccess =
          res.data && res.data !== "no data" ? res.data.current_access : null;

        const localArticles = await this.getScopedArticleCollection(this.chapterId).toArray();

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
            currentAccess = articleData.current_access || currentAccess;
          }
        }

        if (currentAccess) {
          this.editorAccess = currentAccess;
        }

        if (currentAccess && currentAccess.can_edit_draft === false) {
          uni.hideLoading();
          uni.showToast({
            title: "你没有编辑章节权限",
            icon: "none",
            duration: 2000,
          });
          setTimeout(() => {
            uni.navigateBack({});
          }, 800);
          return;
        }

        const lockClaimed = await this.claimEditLock();
        if (!lockClaimed) {
          uni.hideLoading();
          return;
        }

        const hasLocalCloudContentDifference =
          hasCloudContent &&
          hasLocalContent &&
          !areLegacyContentsEquivalent(
            latestLocalArticle.content,
            res.data.content
          );

        if (hasLocalCloudContentDifference) {
          const canAutoRecover = await this.canAutoRecoverPendingLocalDraft(
            latestLocalArticle,
            res.data
          );

          if (canAutoRecover) {
            this.article = this.buildArticle({
              ...res.data,
              ...latestLocalArticle,
            });
            const currentServerTime = await this.getCurrentSyncTime();
            await this.slowSaveLocalArticle(currentServerTime, true);
            await this.uploadArticleWriter(
              currentServerTime,
              false,
              true,
              this.contentVersion
            );
          } else {
            let remoteEditors = [];
            try {
              const historyMeta = await this.getArticleHistoryMeta();
              remoteEditors = this.getRemoteEditorsSince(
                historyMeta,
                latestLocalArticle.create_time
              );
            } catch (error) {}

            const localStats = countLegacyContent(
              parseLegacyContent(latestLocalArticle.content)
            );
            const cloudStats = countLegacyContent(
              parseLegacyContent(res.data.content)
            );
            const latestCloudEditorName = String(
              res.data.editor_name ||
                (remoteEditors[0] && remoteEditors[0].name) ||
                ""
            ).trim();

            const action = await new Promise((resolve) => {
              this.$refs.conflictDialog.show({
                title: "协作草稿有更新",
                subtitle: this.buildConflictDialogSubtitle(remoteEditors),
                type: "conflict",
                local: {
                  title: "本地草稿",
                  time: this.formatCreateTime(latestLocalArticle.create_time),
                  isNewer:
                    this.getVersionMarker(latestLocalArticle) >
                    this.getVersionMarker(res.data),
                  textCount: localStats.textCount,
                  imageCount: localStats.imageCount,
                  editorLabel: "当前设备上的草稿",
                  selectLabel: "保留本地草稿",
                },
                cloud: {
                  title: "云端草稿",
                  time: this.formatCreateTime(res.data.create_time),
                  isNewer:
                    this.getVersionMarker(res.data) >
                    this.getVersionMarker(latestLocalArticle),
                  textCount: cloudStats.textCount,
                  imageCount: cloudStats.imageCount,
                  editorLabel: latestCloudEditorName
                    ? `最近提交：${latestCloudEditorName}`
                    : "最近提交：云端协作草稿",
                  selectLabel: "保留云端草稿",
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

            const currentServerTime = await this.getCurrentSyncTime();
            await this.slowSaveLocalArticle(currentServerTime, true);
            await this.uploadArticleWriter(
              currentServerTime,
              false,
              true,
              this.contentVersion
            );
          }
        } else if (hasCloudContent && !hasLocalContent) {
          this.article = this.buildArticle(res.data);
          this.markSyncSynced(
            res.data.create_time || "",
            res.data.updated_at || ""
          );
        } else if (hasCloudContent && hasLocalContent) {
          const shouldUseCloudCanonicalContent =
            areLegacyContentsEquivalent(
              latestLocalArticle.content,
              res.data.content
            ) && latestLocalArticle.title === res.data.title;
          this.article = this.buildArticle(
            shouldUseCloudCanonicalContent
              ? res.data
              : {
                  ...res.data,
                  ...latestLocalArticle,
                }
          );
          this.markSyncSynced(
            res.data.create_time || "",
            res.data.updated_at || ""
          );
        } else if (fallbackReaderArticle && hasLocalContent) {
          this.article = this.buildArticle({
            ...fallbackReaderArticle,
            ...latestLocalArticle,
          });
        } else if (fallbackReaderArticle) {
          this.article = this.buildArticle(fallbackReaderArticle);
          this.clearSyncState();
        } else {
          this.article = this.buildArticle();
          this.clearSyncState();
        }

        this.refreshCounts();
        this.createEditorFromArticle();
        this.startLocalSaveTimer();
        this.loadComplete = true;
        uni.hideLoading();
        this.sendCurrentArticleInfo();
        if (this.hasPendingSync()) {
          this.flushDraftToCloud({
            isFastSave: false,
            forceSlowSave: false,
            waitForBusy: false,
          });
        }
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
    async save(drafting, msg, scheduleTime = null) {
      if (!this.validatePublishableArticle()) {
        return;
      }

      if (!this.canPublishArticle) {
        if (drafting === 0 || scheduleTime) {
          uni.showToast({
            title: "协作者不能直接发布章节",
            icon: "none",
            duration: 2000,
          });
          return;
        }

        try {
          const currentServerTime = await this.getCurrentSyncTime();
          await this.slowSaveLocalArticle(currentServerTime, true);
          const uploadResponse = await this.uploadArticleWriter(
            currentServerTime,
            false,
            true,
            this.contentVersion
          );
          if (!uploadResponse) {
            uni.showToast({
              title: "网络不稳定，本地草稿已保存",
              icon: "none",
              duration: 2000,
            });
            return;
          }
          uni.showToast({
            title: "协作草稿已保存",
            icon: "none",
            duration: 2000,
          });
          clearInterval(this.saveInterval);
          clearTimeout(this.inputSyncTimer);
          this.hasNewInput = false;
          this.markSyncSynced(currentServerTime);
          setTimeout(() => {
            uni.navigateBack({});
          }, 1200);
        } catch (error) {
          uni.showToast({
            title: "协作草稿保存失败，请重试",
            icon: "none",
            duration: 2000,
          });
        }
        return;
      }

      let tk = this.getAuthToken();
      this.normalizeCurrentArticleContentForStorage();

      axios
        .post(
          this.$baseUrl + "/essays/modify_article",
          {
            title: this.article.title,
            content: this.article.content,
            is_draft: drafting,
            article_id: this.chapterId,
            schedule_time: scheduleTime,
            edit_session_id: this.editSessionId,
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
    insertShortcutContent(value, cursorOffset, useLegacyPairFallback = true) {
      if (!this.editor) return;

      const inputValue = value === undefined || value === null ? "" : String(value);
      if (!inputValue) {
        return;
      }

      const normalizedCursorOffset =
        Number(cursorOffset) ||
        (useLegacyPairFallback ? PAIR_INPUT_CURSOR_OFFSETS[inputValue] || 0 : 0);
      if (normalizedCursorOffset > 0) {
        const from = this.editor.state.selection.from;
        this.editor
          .chain()
          .focus()
          .insertContent(inputValue)
          .setTextSelection(from + normalizedCursorOffset)
          .run();
        return;
      }

      this.editor.chain().focus().insertContent(inputValue).run();
    },
    insertPunctuation(punctuation) {
      this.insertShortcutContent(punctuation);
    },
    getQuickInputItemKey(item) {
      if (!item) return "";
      return item.itemKey || `${item.itemType || item.type || "item"}:${item.id || item.action || ""}`;
    },
    recordQuickInputTouchHandled(item) {
      if (!item) return;
      this.quickInputTouchHandledAt = Date.now();
      this.quickInputTouchHandledKey = this.getQuickInputItemKey(item);
    },
    handleQuickInputToolbarTouchStart(event, item) {
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
      this.debugTitleSelection("quick-toolbar-touchstart", {
        itemId: item && item.id,
        itemValue: item && item.value,
        isTitleTarget: this.isTitleInputInsertionTarget(),
      });
      this.recordQuickInputTouchHandled(item);
      if (this.isTitleInputInsertionTarget()) {
        this.scheduleQuickInputInsertion(item);
        return;
      }
      this.insertQuickInput(item);
    },
    handleQuickInputToolbarMouseDown(event) {
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
      this.debugTitleSelection("quick-toolbar-mousedown", {
        isTitleTarget: this.isTitleInputInsertionTarget(),
      });
    },
    handleQuickInputToolbarClick(event, item) {
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
      const wasHandledByTouch =
        this.quickInputTouchHandledKey === this.getQuickInputItemKey(item) &&
        Date.now() - Number(this.quickInputTouchHandledAt || 0) < 500;
      if (wasHandledByTouch) {
        this.quickInputTouchHandledKey = "";
        this.debugTitleSelection("quick-toolbar-click-skip-after-touch", {
          itemId: item && item.id,
          itemValue: item && item.value,
        });
        return;
      }
      this.debugTitleSelection("quick-toolbar-click-insert", {
        itemId: item && item.id,
        itemValue: item && item.value,
        isTitleTarget: this.isTitleInputInsertionTarget(),
      });
      this.insertQuickInput(item);
    },
    scheduleQuickInputInsertion(item) {
      clearTimeout(this.quickInputInsertTimer);
      this.debugTitleSelection("schedule-quick-input-insertion", {
        itemId: item && item.id,
        itemValue: item && item.value,
      });
      this.quickInputInsertTimer = setTimeout(() => {
        this.quickInputInsertTimer = undefined;
        this.debugTitleSelection("run-quick-input-insertion", {
          itemId: item && item.id,
          itemValue: item && item.value,
        });
        this.insertQuickInput(item);
      }, 0);
    },
    insertQuickInput(item) {
      if (!item) {
        return;
      }
      if (item.itemType === "tool" || item.action) {
        this.handleNavAction(item.action);
        return;
      }
      if (this.isTitleInputInsertionTarget()) {
        this.debugTitleSelection("insert-quick-input-title-target", {
          itemId: item && item.id,
          itemValue: item && item.value,
        });
        this.insertTextIntoTitleInput(item.value, item.isPair ? getPairCursorOffset(item.value) : 0);
        return;
      }
      const cursorOffset = item.isPair ? getPairCursorOffset(item.value) : 0;
      this.insertShortcutContent(item.value, cursorOffset, false);
    },
    isTitleInputInsertionTarget() {
      return this.titleInputFocused || this.pendingTitleInsertion;
    },
    isNativeTextInputElement(element) {
      const tagName = String((element && element.tagName) || "").toLowerCase();
      return (
        (tagName === "input" || tagName === "textarea") &&
        typeof element.selectionStart === "number"
      );
    },
    getTitleInputElement(source) {
      const rawCandidate =
        source && source.target ? source.target : source || this.$refs.titleInput;
      const candidate = Array.isArray(rawCandidate) ? rawCandidate[0] : rawCandidate;
      const fallback = candidate === this.$refs.titleInput ? null : this.$refs.titleInput;
      const resolveInput = (element) => {
        if (!element) return null;
        if (Array.isArray(element)) {
          return resolveInput(element[0]);
        }
        if (this.isNativeTextInputElement(element)) {
          return element;
        }
        if (element.$el) {
          return resolveInput(element.$el);
        }
        if (element.querySelector) {
          const input = element.querySelector("input, textarea");
          if (this.isNativeTextInputElement(input)) {
            return input;
          }
        }
        return null;
      };
      const input = resolveInput(candidate);
      if (input) return input;
      return resolveInput(fallback);
    },
    isTitleInputElement(element) {
      const input = this.getTitleInputElement();
      return !!(
        input &&
        element &&
        (element === input ||
          (element.closest &&
            input.closest &&
            element.closest(".chapterTitleBar") === input.closest(".chapterTitleBar")))
      );
    },
    describeTitleElementForDebug(element) {
      if (!element) return null;
      const value =
        element.value === undefined || element.value === null
          ? ""
          : String(element.value);
      return {
        tagName: element.tagName || "",
        className: element.className || "",
        id: element.id || "",
        isNativeTextInput: this.isNativeTextInputElement(element),
        valueLength: value.length,
        valuePreview: value.slice(0, 20),
        selectionStart:
          typeof element.selectionStart === "number" ? element.selectionStart : null,
        selectionEnd:
          typeof element.selectionEnd === "number" ? element.selectionEnd : null,
      };
    },
    debugTitleSelection(label, extra = {}) {
      if (!DEBUG_TITLE_SELECTION || typeof console === "undefined") return;
      const input = this.getTitleInputElement();
      const rawTitleRef = Array.isArray(this.$refs.titleInput)
        ? this.$refs.titleInput[0]
        : this.$refs.titleInput;
      const activeElement =
        typeof document !== "undefined" ? document.activeElement : null;
      const payload = {
        label,
        focused: this.titleInputFocused,
        pendingTitleInsertion: this.pendingTitleInsertion,
        cachedStart: this.titleInputSelectionStart,
        cachedEnd: this.titleInputSelectionEnd,
        hasCachedSelection: this.titleInputHasSelection,
        articleTitleLength: String(this.article.title || "").length,
        input: this.describeTitleElementForDebug(input),
        titleRef: this.describeTitleElementForDebug(rawTitleRef),
        titleRefEl: this.describeTitleElementForDebug(rawTitleRef && rawTitleRef.$el),
        activeElement: this.describeTitleElementForDebug(activeElement),
        ...extra,
      };
      if (typeof console.debug === "function") {
        console.debug("[chapterEditor:titleSelection]", payload);
      } else {
        console.log("[chapterEditor:titleSelection]", payload);
      }
    },
    clampTitleSelection(value, start, end) {
      const length = String(value || "").length;
      const normalizedStart = Number(start);
      const normalizedEnd = Number(end);
      const safeStart = Number.isFinite(normalizedStart)
        ? Math.min(length, Math.max(0, normalizedStart))
        : length;
      const safeEnd = Number.isFinite(normalizedEnd)
        ? Math.min(length, Math.max(0, normalizedEnd))
        : safeStart;
      return {
        start: Math.min(safeStart, safeEnd),
        end: Math.max(safeStart, safeEnd),
      };
    },
    commitTitleInputSelection(input, start, end = start) {
      const value = input && input.value !== undefined ? input.value : this.article.title;
      const selection = this.clampTitleSelection(value, start, end);
      this.titleInputSelectionStart = selection.start;
      this.titleInputSelectionEnd = selection.end;
      this.titleInputHasSelection = true;
      this.debugTitleSelection("commit-selection", {
        rawStart: start,
        rawEnd: end,
        committedStart: selection.start,
        committedEnd: selection.end,
        sourceInput: this.describeTitleElementForDebug(input),
      });
      return true;
    },
    saveTitleInputSelection(source) {
      const input = this.getTitleInputElement(source);
      if (!input) {
        this.debugTitleSelection("save-selection-no-input", {
          eventType: source && source.type,
          sourceTarget: this.describeTitleElementForDebug(source && source.target),
        });
        return false;
      }

      if (typeof input.selectionStart === "number") {
        this.debugTitleSelection("save-selection-read-input", {
          eventType: source && source.type,
          sourceTarget: this.describeTitleElementForDebug(source && source.target),
          readInput: this.describeTitleElementForDebug(input),
        });
        return this.commitTitleInputSelection(
          input,
          input.selectionStart,
          typeof input.selectionEnd === "number" ? input.selectionEnd : input.selectionStart
        );
      }

      this.debugTitleSelection("save-selection-no-selection-api", {
        eventType: source && source.type,
        sourceTarget: this.describeTitleElementForDebug(source && source.target),
        readInput: this.describeTitleElementForDebug(input),
      });
      return false;
    },
    scheduleTitleSelectionCapture(source) {
      clearTimeout(this.titleSelectionCaptureTimer);
      this.debugTitleSelection("schedule-selection-capture", {
        eventType: source && source.type,
        sourceTarget: this.describeTitleElementForDebug(source && source.target),
      });
      this.titleSelectionCaptureTimer = setTimeout(() => {
        this.titleSelectionCaptureTimer = undefined;
        this.debugTitleSelection("run-selection-capture", {
          eventType: source && source.type,
          sourceTarget: this.describeTitleElementForDebug(source && source.target),
        });
        this.saveTitleInputSelection(source);
      }, 0);
    },
    setTitleInputSelectionRange(input, start, end = start, label = "set-selection") {
      if (!input || typeof input.setSelectionRange !== "function") {
        this.debugTitleSelection(`${label}-no-selection-range`, {
          start,
          end,
          input: this.describeTitleElementForDebug(input),
        });
        return false;
      }

      try {
        if (typeof input.focus === "function") {
          try {
            input.focus({ preventScroll: true });
          } catch (error) {
            input.focus();
          }
        }
        input.setSelectionRange(start, end);
        this.debugTitleSelection(label, {
          start,
          end,
          input: this.describeTitleElementForDebug(input),
        });
        return true;
      } catch (error) {
        this.debugTitleSelection(`${label}-failed`, {
          start,
          end,
          error: error && error.message ? error.message : String(error),
          input: this.describeTitleElementForDebug(input),
        });
        return false;
      }
    },
    restoreTitleInputSelectionAfterRender(start, end = start, reason = "") {
      const selection = this.clampTitleSelection(this.article.title, start, end);
      this.titleInputSelectionStart = selection.start;
      this.titleInputSelectionEnd = selection.end;
      this.titleInputHasSelection = true;
      this.titleSelectionRestoreUntil = Date.now() + 250;

      const restore = (phase) => {
        const input = this.getTitleInputElement();
        this.setTitleInputSelectionRange(
          input,
          selection.start,
          selection.end,
          `restore-selection-${phase}`
        );
      };

      clearTimeout(this.titleSelectionRestoreTimer);
      restore("immediate");
      this.$nextTick(() => {
        restore("next-tick");
        clearTimeout(this.titleSelectionRestoreTimer);
        this.titleSelectionRestoreTimer = setTimeout(() => {
          restore("timeout");
          this.titleSelectionRestoreTimer = undefined;
          this.titleSelectionRestoreUntil = 0;
          this.debugTitleSelection("restore-selection-complete", {
            reason,
            start: selection.start,
            end: selection.end,
          });
        }, 120);
      });
    },
    handleDocumentSelectionChange() {
      const activeElement =
        typeof document !== "undefined" ? document.activeElement : null;
      if (!this.isTitleInputElement(activeElement)) {
        return;
      }
      if (
        Date.now() < Number(this.titleSelectionRestoreUntil || 0) &&
        activeElement &&
        (activeElement.selectionStart !== this.titleInputSelectionStart ||
          activeElement.selectionEnd !== this.titleInputSelectionEnd)
      ) {
        this.debugTitleSelection("document-selectionchange-ignored-during-restore", {
          activeElement: this.describeTitleElementForDebug(activeElement),
        });
        this.setTitleInputSelectionRange(
          activeElement,
          this.titleInputSelectionStart,
          this.titleInputSelectionEnd,
          "restore-selection-from-selectionchange"
        );
        return;
      }
      this.debugTitleSelection("document-selectionchange", {
        activeElement: this.describeTitleElementForDebug(activeElement),
      });
      this.saveTitleInputSelection(activeElement);
    },
    insertTextIntoTitleInput(text, cursorOffset) {
      const input = this.getTitleInputElement();
      if (!input) {
        this.debugTitleSelection("insert-title-no-input", {
          text,
          cursorOffset,
        });
        return;
      }
      const inputText = text === undefined || text === null ? "" : String(text);
      if (!inputText) {
        this.debugTitleSelection("insert-title-empty-text", {
          text,
          cursorOffset,
        });
        return;
      }
      const currentValue = String(input.value || this.article.title || "");
      let selection;
      if (this.titleInputHasSelection) {
        selection = {
          ...this.clampTitleSelection(
            currentValue,
            this.titleInputSelectionStart,
            this.titleInputSelectionEnd
          ),
        };
      } else if (this.titleInputFocused && this.saveTitleInputSelection(input)) {
        selection = {
          start: this.titleInputSelectionStart,
          end: this.titleInputSelectionEnd,
        };
      } else {
        selection = {
          start: currentValue.length,
          end: currentValue.length,
        };
      }
      this.debugTitleSelection("insert-title-before", {
        text: inputText,
        cursorOffset,
        currentValueLength: currentValue.length,
        selectedStart: selection.start,
        selectedEnd: selection.end,
        inputBefore: this.describeTitleElementForDebug(input),
      });
      const start = selection.start;
      const end = selection.end;
      const before = currentValue.slice(0, start);
      const after = currentValue.slice(end);
      const newValue = before + inputText + after;
      this.article.title = newValue;
      if (this.isNativeTextInputElement(input)) {
        input.value = newValue;
      }
      const newPos = start + (cursorOffset > 0 ? cursorOffset : inputText.length);
      this.titleInputSelectionStart = newPos;
      this.titleInputSelectionEnd = newPos;
      this.titleInputHasSelection = true;
      this.pendingTitleInsertion = false;
      this.debugTitleSelection("insert-title-after", {
        text: inputText,
        newValueLength: newValue.length,
        newPos,
        inputAfter: this.describeTitleElementForDebug(input),
      });
      this.restoreTitleInputSelectionAfterRender(newPos, newPos, "insert-title");
      this.handleTitleInput();
    },
    getQuickInputDisplayText(item) {
      const value = String((item && item.value) || "");
      if (value.trim()) {
        return value;
      }
      return String((item && item.label) || "");
    },
    collectTextBlocksInEditorRange(range) {
      if (!this.editor || !this.editor.state || !this.editor.state.doc || !range) {
        return [];
      }

      const doc = this.editor.state.doc;
      const docSize = Number((doc.content && doc.content.size) || 0);
      const from = Math.min(Math.max(Number(range.from), 0), docSize);
      const to = Math.min(Math.max(Number(range.to), 0), docSize);
      if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
        return [];
      }

      const rangeFrom = Math.min(from, to);
      const rangeTo = Math.max(from, to);
      const blocks = [];
      doc.nodesBetween(rangeFrom, rangeTo, (node, position) => {
        if (!node || !node.isTextblock) {
          return true;
        }

        const blockFrom = position;
        const blockTo = position + node.nodeSize;
        if (blockFrom < rangeFrom || blockTo > rangeTo) {
          return false;
        }

        const block = {
          type: "text",
          value: String(node.textContent || ""),
        };
        const legacyId = Number(node.attrs && node.attrs.legacyId);
        if (Number.isFinite(legacyId) && legacyId > 0) {
          block.id = legacyId;
        }

        blocks.push({
          from: blockFrom,
          to: blockTo,
          block,
        });
        return false;
      });

      return blocks;
    },
    formatEditorRange(range) {
      const blocks = this.collectTextBlocksInEditorRange(range);
      if (!blocks.length) {
        return false;
      }

      const formatted = formatLegacyBlocks(
        blocks.map((item) => item.block),
        {
          addParagraphSpacing: this.writerSettings.openTypeSet,
        }
      );
      const doc = legacyBlocksToDoc(formatted);
      const content = Array.isArray(doc.content) ? doc.content : [];
      if (!content.length) {
        return false;
      }

      return this.editor
        .chain()
        .focus()
        .insertContentAt(
          {
            from: blocks[0].from,
            to: blocks[blocks.length - 1].to,
          },
          content
        )
        .run();
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
      if (this.shouldSuppressEditorSyncForCompletedPublish()) {
        return;
      }

      this.lastSaveTime = new Date();
      this.normalizeCurrentArticleContentForStorage();
      this.markSyncPending(currentServerTime);

      try {
        const currentContent = parseLegacyContent(this.article.content);
        const articleId = Number(this.article.article_id || this.chapterId);

        const localArticles = await this.getScopedArticleCollection(articleId)
          .and((article) => article.is_slow_save !== true)
          .toArray();

        if (localArticles.length === 0) {
          await writerArticleDB.articles.add({
            article_id: articleId,
            user_id: Number(this.currentUserId || 0),
            title: this.article.title,
            content: this.article.content,
            create_time: currentServerTime,
            is_slow_save: false,
          });
          this.updateSaveNotify(true);
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
            user_id: Number(this.currentUserId || 0),
            title: this.article.title,
            content: this.article.content,
            create_time: currentServerTime,
            is_slow_save: false,
          });
          this.updateSaveNotify(true);
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
            user_id: Number(this.currentUserId || 0),
            title: this.article.title,
            content: this.article.content,
            create_time: currentServerTime,
            is_slow_save: false,
          });
          this.updateSaveNotify(true);
        }
      } catch (error) {
        console.error("保存本地文章时出错:", error);
      }
    },
    async slowSaveLocalArticle(currentServerTime, isForce) {
      try {
        this.normalizeCurrentArticleContentForStorage();
        this.markSyncPending(currentServerTime);
        const articleId = Number(this.article.article_id || this.chapterId);

        if (!isForce) {
          const localArticles = await this.getScopedArticleCollection(articleId).toArray();

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
          user_id: Number(this.currentUserId || 0),
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
      if (this.shouldSuppressEditorSyncForCompletedPublish()) {
        return;
      }

      clearInterval(this.saveInterval);
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
      this.clearPendingEditorSyncTimers();
      if (
        this.loadComplete &&
        !this.shouldSuppressEditorSyncForCompletedPublish()
      ) {
        await this.flushDraftToCloud({
          isFastSave: false,
          forceSlowSave: true,
          waitForBusy: true,
        });
      }
    },
    fontSizeChanged() {
      this.applyEditorFontSize();
      this.persistWriterSettings();
    },
    changeTheme(themeName) {
      this.writerSettings.theme = themeName;
      this.persistWriterSettings();
      this.applyNavigationBarTheme();
    },
    openWriterAiAssistant() {
      if (
        this.$refs.writerAiAssistant &&
        typeof this.$refs.writerAiAssistant.open === "function"
      ) {
        this.aiAssistantOpen = true;
        window.history.pushState({ aiAssistantOpen: true }, '', window.location.href);
        this.$refs.writerAiAssistant.open();
      }
    },
    handleAiAssistantOpen() {
      if (!this.aiAssistantOpen) {
        this.aiAssistantOpen = true;
        window.history.pushState({ aiAssistantOpen: true }, '', window.location.href);
      }
    },
    handleAiAssistantClose() {
      if (!this.isHandlingBrowserBack) {
        window.history.go(-1);
      }
      this.aiAssistantOpen = false;
    },
    browserBack() {
      if (this.aiAssistantOpen) {
        this.isHandlingBrowserBack = true;
        this.aiAssistantOpen = false;
        if (
          this.$refs.writerAiAssistant &&
          typeof this.$refs.writerAiAssistant.close === "function"
        ) {
          this.$refs.writerAiAssistant.close();
        }
        this.isHandlingBrowserBack = false;
      }
    },
    handleWriterAiSmartReplaceKept(payload) {
      this.$nextTick(() => {
        const formatted = this.formatEditorRange(
          payload && payload.appliedRange
        );
        if (formatted) {
          uni.showToast({
            title: "自动排版完成",
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
    applyNavigationBarTheme() {
      const pageHead = document.getElementsByClassName("uni-page-head")[0];

      const pageHeadBtn = document.querySelectorAll(
        ".uni-page-head .uni-btn-icon"
      );
      pageHeadBtn.forEach((element) => {
        element.style.color = this.currentTheme.color;
      });

      if (pageHead) {
        pageHead.style.backgroundColor = this.isNavbarFullyHidden
          ? this.currentTheme.pageBackColor || this.currentTheme.backColor
          : this.currentTheme.backColor;
      }

      if (
        typeof window !== "undefined" &&
        window.jsBridge &&
        window.jsBridge.inApp &&
        typeof window.jsBridge.setSystemUIStyle === "function"
      ) {
        window.jsBridge.setSystemUIStyle(
          this.isNavbarFullyHidden
            ? this.currentTheme.pageBackColor || this.currentTheme.backColor
            : this.currentTheme.backColor,
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
    formatSaveNotifyText() {
      if (this.lockState === "reconnecting") {
        return "网络不稳定，本地已保存";
      }
      if (this.lockState === "lost") {
        return "编辑会话已失效";
      }
      if (!this.lastSaveNotifyTime) {
        return "尚未更改";
      }

      const savedAt = new Date(this.lastSaveNotifyTime).getTime();
      if (!Number.isFinite(savedAt)) {
        return "尚未更改";
      }

      const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - savedAt) / 1000)
      );
      if (elapsedSeconds < 5) {
        return "刚刚";
      }
      if (elapsedSeconds < 60) {
        return `${elapsedSeconds}秒前`;
      }
      return `${Math.floor(elapsedSeconds / 60)}分钟前`;
    },
    refreshSaveNotifyText() {
      this.saveNotifyText = this.formatSaveNotifyText();
    },
    startSaveNotifyTimer() {
      this.stopSaveNotifyTimer();
      this.refreshSaveNotifyText();
      this.saveNotifyInterval = setInterval(() => {
        this.refreshSaveNotifyText();
      }, SAVE_NOTIFY_REFRESH_MS);
    },
    stopSaveNotifyTimer() {
      clearInterval(this.saveNotifyInterval);
      this.saveNotifyInterval = undefined;
    },
    updateSaveNotify(playAnimation) {
      this.lastSaveNotifyTime = new Date();
      this.refreshSaveNotifyText();
      if (playAnimation && this.$refs.completeIcon) {
        this.$refs.completeIcon.playAnimation();
      }
    },
    openToolbarPopup() {
      if (this.$refs.toolbarPopup) {
        this.$refs.toolbarPopup.open("bottom");
      }
    },
    closeToolbarPopup() {
      if (this.$refs.toolbarPopup) {
        this.$refs.toolbarPopup.close();
      }
    },
    handleToolbarToolClick(tool) {
      if (!tool || !tool.action) {
        return;
      }

      this.closeToolbarPopup();
      this.handleNavAction(tool.action);
    },
    handleNavShortcutToolClick(tool) {
      if (!tool || !tool.action) {
        return;
      }

      this.handleNavAction(tool.action);
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
      if (!this.canPublishArticle) {
        this.save(1, "协作草稿已保存");
        return;
      }

      if (!this.persistPublishDraft()) {
        return;
      }

      this.publishHandoffActive = true;
      uni.navigateTo({
        url: `/pages/writers/workPublish?id=${this.chapterId}&sourceSessionId=${encodeURIComponent(
          this.editSessionId
        )}`,
      });
    },
    getDomRef(name) {
      const ref = this.$refs ? this.$refs[name] : null;
      return Array.isArray(ref) ? ref[0] : ref;
    },
    getHeaderOffsetTransform(offset) {
      const normalizedOffset = this.clampHeaderOffset(offset);
      return `translate(0, -${normalizedOffset}px)`;
    },
    getStatusCapsuleLift(offset) {
      const normalizedOffset = this.clampHeaderOffset(offset);
      const maxOffset = Number(this.maxHeaderOffset || 0);
      const gap = Number(this.statusCapsuleGap || 0);
      if (!maxOffset || !gap) {
        return 0;
      }
      return Math.min(gap, (gap * normalizedOffset) / maxOffset);
    },
    setHeaderOffsetStyle(target, offset, includeLayout = false) {
      if (!target || !target.style) {
        return;
      }

      const normalizedOffset = this.clampHeaderOffset(offset);
      const value = `${normalizedOffset}px`;
      target.style.setProperty("--headerVisualOffset", value);
      target.style.setProperty(
        "--statusCapsuleLift",
        `${this.getStatusCapsuleLift(normalizedOffset)}px`
      );
      if (includeLayout) {
        target.style.setProperty("--headerLayoutOffset", value);
      }
    },
    cacheHeaderDragMetrics() {
      const middleBar = this.getDomRef("middleBar");
      this._headerGestureLayoutStartOffset = this.clampHeaderOffset(this.headerOffset);
      this._headerGestureMiddleBarStartHeight = 0;

      if (
        middleBar &&
        typeof middleBar.getBoundingClientRect === "function"
      ) {
        const rect = middleBar.getBoundingClientRect();
        this._headerGestureMiddleBarStartHeight = Number(rect.height) || 0;
      }
    },
    applyHeaderVisualOffsetStyle(offset) {
      const normalizedOffset = this.clampHeaderOffset(offset);
      const editorHeader = this.getDomRef("editorHeader");
      const middleBar = this.getDomRef("middleBar");
      const pageRoot = this.$el;

      if (editorHeader && editorHeader.style) {
        editorHeader.style.transform = this.getHeaderOffsetTransform(normalizedOffset);
        editorHeader.style.setProperty(
          "--statusCapsuleLift",
          `${this.getStatusCapsuleLift(normalizedOffset)}px`
        );
      }

      if (middleBar && middleBar.style) {
        const startHeight = Number(this._headerGestureMiddleBarStartHeight || 0);
        const startOffset = Number(this._headerGestureLayoutStartOffset || 0);
        const nextHeight = startHeight + normalizedOffset - startOffset;

        middleBar.style.transform = this.getHeaderOffsetTransform(normalizedOffset);
        if (startHeight > 0 && Number.isFinite(nextHeight)) {
          middleBar.style.setProperty(
            "height",
            `${Math.max(0, nextHeight)}px`,
            "important"
          );
        } else {
          this.setHeaderOffsetStyle(middleBar, normalizedOffset, true);
        }
      }

      if ((!editorHeader || !middleBar) && pageRoot && pageRoot.style) {
        const value = `${normalizedOffset}px`;
        pageRoot.style.setProperty("--headerVisualOffset", value);
        pageRoot.style.setProperty("--headerLayoutOffset", value);
        pageRoot.style.setProperty(
          "--statusCapsuleLift",
          `${this.getStatusCapsuleLift(normalizedOffset)}px`
        );
      }
      return normalizedOffset;
    },
    clearHeaderDragInlineStyles() {
      const editorHeader = this.getDomRef("editorHeader");
      const middleBar = this.getDomRef("middleBar");

      if (editorHeader && editorHeader.style) {
        editorHeader.style.removeProperty("transform");
      }
      if (middleBar && middleBar.style) {
        middleBar.style.removeProperty("transform");
        middleBar.style.removeProperty("height");
      }
    },
    applyCommittedHeaderOffsetStyle(offset) {
      const normalizedOffset = this.clampHeaderOffset(offset);
      const editorHeader = this.getDomRef("editorHeader");
      const middleBar = this.getDomRef("middleBar");
      const pageRoot = this.$el;

      this.setHeaderOffsetStyle(editorHeader, normalizedOffset);
      this.setHeaderOffsetStyle(middleBar, normalizedOffset, true);

      if (pageRoot && pageRoot.style) {
        const value = `${normalizedOffset}px`;
        pageRoot.style.setProperty("--headerOffset", value);
        pageRoot.style.setProperty("--headerVisualOffset", value);
        pageRoot.style.setProperty("--headerLayoutOffset", value);
        pageRoot.style.setProperty(
          "--statusCapsuleLift",
          `${this.getStatusCapsuleLift(normalizedOffset)}px`
        );
      }
      this.clearHeaderDragInlineStyles();
      return normalizedOffset;
    },
    cancelHeaderOffsetFrame() {
      if (
        this._headerOffsetRaf &&
        typeof window !== "undefined" &&
        typeof window.cancelAnimationFrame === "function"
      ) {
        window.cancelAnimationFrame(this._headerOffsetRaf);
      }
      this._headerOffsetRaf = 0;
    },
    scheduleHeaderOffsetStyle(offset) {
      this._pendingHeaderOffset = this.clampHeaderOffset(offset);
      if (
        typeof window === "undefined" ||
        typeof window.requestAnimationFrame !== "function"
      ) {
        this.applyHeaderVisualOffsetStyle(this._pendingHeaderOffset);
        return;
      }
      if (this._headerOffsetRaf) {
        return;
      }
      this._headerOffsetRaf = window.requestAnimationFrame(() => {
        this._headerOffsetRaf = 0;
        this.applyHeaderVisualOffsetStyle(this._pendingHeaderOffset);
      });
    },
    commitHeaderOffset(offset) {
      this.cancelHeaderOffsetFrame();
      const normalizedOffset = this.applyCommittedHeaderOffsetStyle(offset);
      this.headerOffset = normalizedOffset;
      this._headerGestureVisualOffset = normalizedOffset;
      return normalizedOffset;
    },
    clampHeaderOffset(value = this.headerOffset) {
      const normalizedValue = Number(value);
      if (!Number.isFinite(normalizedValue)) {
        return 0;
      }
      return Math.min(
        this.maxHeaderOffset,
        Math.max(0, normalizedValue)
      );
    },
    restoreDefaultHeaderLayout() {
      this.isHeaderGestureActive = false;
      this.commitHeaderOffset(0);
    },
    settleHeaderLayoutAfterGesture() {
      const offset = this.clampHeaderOffset();
      const lastDeltaY = Number(this._headerGestureLastDeltaY || 0);
      const directionThreshold = 1;

      if (Math.abs(lastDeltaY) > directionThreshold) {
        this.commitHeaderOffset(
          lastDeltaY < 0 ? this.maxHeaderOffset : 0
        );
        return;
      }

      this.commitHeaderOffset(
        offset >= this.maxHeaderOffset / 2 ? this.maxHeaderOffset : 0
      );
    },
    isBodyEditorFocused() {
      if (this.editor && this.editor.isFocused) {
        return true;
      }

      if (typeof document === "undefined") {
        return this.editorBodyFocused;
      }

      const activeElement = document.activeElement;
      return !!(
        activeElement &&
        activeElement.closest &&
        activeElement.closest(".writer-prosemirror")
      );
    },
    getEditorActivationPoint(event) {
      const touch =
        event && event.touches && event.touches.length
          ? event.touches[0]
          : event && event.changedTouches && event.changedTouches.length
            ? event.changedTouches[0]
            : null;

      if (touch) {
        return {
          x: Number(touch.clientX || 0),
          y: Number(touch.clientY || 0),
        };
      }

      if (
        event &&
        typeof event.clientX === "number" &&
        typeof event.clientY === "number"
      ) {
        return {
          x: Number(event.clientX || 0),
          y: Number(event.clientY || 0),
        };
      }

      return null;
    },
    cancelEditorActivation() {
      this._editorActivation = null;
      this._shouldCenterCursorAfterBlurredTap = false;
      clearTimeout(this._centerCursorAfterBlurredTapTimer);
    },
    handleEditorActivationStart(event) {
      const point = this.getEditorActivationPoint(event);
      const startedBlurred = !this.isBodyEditorFocused();

      if (!point || !startedBlurred) {
        if (this._shouldCenterCursorAfterBlurredTap) {
          return;
        }
        this.cancelEditorActivation();
        return;
      }

      this._editorActivation = {
        startedBlurred,
        startX: point.x,
        startY: point.y,
        moved: false,
      };
      this._shouldCenterCursorAfterBlurredTap = true;
    },
    handleEditorActivationMove(event) {
      const activation = this._editorActivation;
      if (!activation || !activation.startedBlurred) {
        return;
      }

      const point = this.getEditorActivationPoint(event);
      if (!point) {
        return;
      }

      const distance = Math.max(
        Math.abs(point.x - activation.startX),
        Math.abs(point.y - activation.startY)
      );
      if (distance > 8) {
        activation.moved = true;
        this.cancelEditorActivation();
      }
    },
    handleEditorActivationEnd(event) {
      const activation = this._editorActivation;
      if (!this._shouldCenterCursorAfterBlurredTap || !activation) {
        return;
      }

      const point = this.getEditorActivationPoint(event);
      if (point) {
        const distance = Math.max(
          Math.abs(point.x - activation.startX),
          Math.abs(point.y - activation.startY)
        );
        if (distance > 8) {
          this.cancelEditorActivation();
          return;
        }
      }

      if (activation.moved) {
        this.cancelEditorActivation();
        return;
      }
      this.scheduleCenterCursorAfterBlurredTap();
    },
    scheduleCenterCursorAfterBlurredTap() {
      clearTimeout(this._centerCursorAfterBlurredTapTimer);

      const run = (isFinalAttempt = false) => {
        this.centerEditorCursorInViewport(isFinalAttempt);
      };

      if (
        typeof window !== "undefined" &&
        typeof window.requestAnimationFrame === "function"
      ) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => run(false));
        });
      } else {
        run(false);
      }

      this._centerCursorAfterBlurredTapTimer = setTimeout(() => run(true), 260);
    },
    getEditorScrollContainer() {
      const editorDom =
        this.editor && this.editor.view && this.editor.view.dom
          ? this.editor.view.dom
          : null;
      if (editorDom && editorDom.closest) {
        const container = editorDom.closest(".textarea");
        if (container) {
          return container;
        }
      }

      const middleBar = this.getDomRef("middleBar");
      return middleBar && middleBar.querySelector
        ? middleBar.querySelector(".textarea")
        : null;
    },
    getEditorVisibleVerticalRange(container) {
      const rect = container.getBoundingClientRect();
      let top = rect.top;
      let bottom = rect.bottom;

      if (typeof window !== "undefined" && window.visualViewport) {
        const viewportTop = Number(window.visualViewport.offsetTop || 0);
        const viewportBottom =
          viewportTop + Number(window.visualViewport.height || window.innerHeight || 0);
        top = Math.max(top, viewportTop);
        bottom = Math.min(bottom, viewportBottom);
      }

      return {
        top,
        bottom: Math.max(top, bottom),
      };
    },
    centerEditorCursorInViewport(isFinalAttempt = true) {
      if (!this._shouldCenterCursorAfterBlurredTap) {
        return true;
      }

      if (!this.editor || !this.editor.view || !this.editor.state) {
        if (isFinalAttempt) {
          this.cancelEditorActivation();
        }
        return false;
      }

      if (!this.isBodyEditorFocused()) {
        if (isFinalAttempt) {
          this.cancelEditorActivation();
        }
        return false;
      }

      const container = this.getEditorScrollContainer();
      if (!container || typeof container.getBoundingClientRect !== "function") {
        this.cancelEditorActivation();
        return true;
      }

      const selection = this.editor.state.selection;
      if (!selection || !selection.empty) {
        if (isFinalAttempt) {
          this.cancelEditorActivation();
          return true;
        }
        return false;
      }

      const position =
        typeof selection.head === "number" ? selection.head : selection.from;
      let cursorCoords = null;

      try {
        cursorCoords = this.editor.view.coordsAtPos(position);
      } catch (error) {
        cursorCoords = null;
      }

      if (!cursorCoords) {
        if (isFinalAttempt) {
          this.cancelEditorActivation();
        }
        return false;
      }

      const visibleRange = this.getEditorVisibleVerticalRange(container);
      const visibleHeight = visibleRange.bottom - visibleRange.top;
      if (visibleHeight <= 0) {
        this.cancelEditorActivation();
        return true;
      }

      const cursorCenterY = (cursorCoords.top + cursorCoords.bottom) / 2;
      const visibleCenterY = visibleRange.top + visibleHeight / 2;
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const nextScrollTop = Math.min(
        maxScrollTop,
        Math.max(0, container.scrollTop + cursorCenterY - visibleCenterY)
      );

      if (Math.abs(nextScrollTop - container.scrollTop) > 1) {
        if (typeof container.scrollTo === "function") {
          try {
            container.scrollTo({
              top: nextScrollTop,
              behavior: "smooth",
            });
          } catch (error) {
            container.scrollTop = nextScrollTop;
          }
        } else {
          container.scrollTop = nextScrollTop;
        }
      }

      if (isFinalAttempt) {
        this.cancelEditorActivation();
      }
      return true;
    },
    handleEditorFocusChange(isFocused) {
      this.editorBodyFocused = !!isFocused;
      if (isFocused) {
        this.pendingTitleInsertion = false;
      }
      if (
        isFocused &&
        (!this.isHeaderGestureActive || this.headerGestureStartedFocused)
      ) {
        this.restoreDefaultHeaderLayout();
      }
    },
    blurBodyEditor() {
      const editorDom =
        this.editor && this.editor.view && this.editor.view.dom
          ? this.editor.view.dom
          : null;

      if (
        this.editor &&
        this.editor.commands &&
        typeof this.editor.commands.blur === "function"
      ) {
        this.editor.commands.blur();
      }

      if (editorDom && typeof editorDom.blur === "function") {
        editorDom.blur();
      }

      if (
        typeof document !== "undefined" &&
        document.activeElement &&
        typeof document.activeElement.blur === "function"
      ) {
        document.activeElement.blur();
      }

      if (
        typeof window !== "undefined" &&
        window.getSelection &&
        window.getSelection()
      ) {
        window.getSelection().removeAllRanges();
      }

      const blurSink = this.$refs.editorBlurSink;
      if (blurSink && typeof blurSink.focus === "function") {
        blurSink.focus();
        setTimeout(() => {
          if (blurSink && typeof blurSink.blur === "function") {
            blurSink.blur();
          }
        }, 0);
      }

      this.editorBodyFocused = false;
    },
    getTouchClientY(event) {
      const touch =
        event && event.touches && event.touches.length
          ? event.touches[0]
          : event && event.changedTouches && event.changedTouches.length
            ? event.changedTouches[0]
            : null;
      return touch ? Number(touch.clientY) : 0;
    },
    shouldHandleHeaderGesture(event) {
      if (!this.isActiveTitleBarEnabled) {
        return false;
      }

      if (this.isBodyEditorFocused()) {
        return false;
      }

      const target = event && event.target;
      if (!target || !target.closest) {
        return true;
      }

      if (target.closest(".quickInputToolBar")) {
        return false;
      }

      if (target.closest(".chapterTitleBar")) {
        return false;
      }

      return !!target.closest(".textarea");
    },
    handleEditorAreaTouchStart(event) {
      this.headerGestureStartedFocused = this.isBodyEditorFocused();
      if (!this.shouldHandleHeaderGesture(event)) {
        this.isHeaderGestureActive = false;
        if (this.headerGestureStartedFocused) {
          this.restoreDefaultHeaderLayout();
        }
        return;
      }

      const clientY = this.getTouchClientY(event);
      this._headerGestureStartY = clientY;
      this._headerGestureLastY = clientY;
      this._headerGestureMoved = false;
      this.isHeaderGestureActive = true;
      this._headerGestureLastDeltaY = 0;
      this._headerGestureVisualOffset = this.headerOffset;
      this.cacheHeaderDragMetrics();
      this.applyHeaderVisualOffsetStyle(this._headerGestureVisualOffset);
    },
    handleEditorAreaTouchMove(event) {
      if (!this.isHeaderGestureActive) {
        return;
      }

      if (this.headerGestureStartedFocused && this.isBodyEditorFocused()) {
        this.restoreDefaultHeaderLayout();
        return;
      }

      const clientY = this.getTouchClientY(event);
      if (!clientY) {
        return;
      }

      const deltaY = clientY - Number(this._headerGestureLastY || clientY);
      if (Math.abs(clientY - Number(this._headerGestureStartY || clientY)) > 3) {
        this._headerGestureMoved = true;
      }

      if (deltaY !== 0) {
        const previousOffset = this.clampHeaderOffset(
          this._headerGestureVisualOffset === undefined
            ? this.headerOffset
            : this._headerGestureVisualOffset
        );
        const nextOffset = this.clampHeaderOffset(previousOffset - deltaY);
        this._headerGestureVisualOffset = nextOffset;
        this.headerOffset = nextOffset;
        if (nextOffset !== previousOffset && event && event.cancelable) {
          event.preventDefault();
        }
        this.scheduleHeaderOffsetStyle(nextOffset);
        this._headerGestureLastDeltaY = deltaY;
      }
      this._headerGestureLastY = clientY;
    },
    handleEditorAreaTouchEnd() {
      const shouldKeepCollapsed =
        this._headerGestureMoved && !this.headerGestureStartedFocused;
      this.isHeaderGestureActive = false;
      this.commitHeaderOffset(
        this._headerGestureVisualOffset === undefined
          ? this.headerOffset
          : this._headerGestureVisualOffset
      );
      if (this.isBodyEditorFocused()) {
        if (shouldKeepCollapsed) {
          this.blurBodyEditor();
          this.settleHeaderLayoutAfterGesture();
        } else {
          this.restoreDefaultHeaderLayout();
        }
      } else if (this._headerGestureMoved) {
        this.settleHeaderLayoutAfterGesture();
      }
      this.headerGestureStartedFocused = false;
      this._headerGestureLastDeltaY = 0;
      this._headerGestureMoved = false;
    },
    updateCustomNavigationMetrics() {
      let statusBarHeight = 0;
      this.viewportWidth = getViewportWidth();
      try {
        if (typeof uni !== "undefined" && typeof uni.getSystemInfoSync === "function") {
          const systemInfo = uni.getSystemInfoSync();
          statusBarHeight = Number(systemInfo.statusBarHeight) || 0;
        } else if (
          typeof plus !== "undefined" &&
          plus.navigator &&
          typeof plus.navigator.getStatusbarHeight === "function"
        ) {
          statusBarHeight = Number(plus.navigator.getStatusbarHeight()) || 0;
        }
      } catch (error) {
        statusBarHeight = 0;
      }

      this.statusBarHeight = statusBarHeight;
      this.commitHeaderOffset(this.headerOffset);
      this.$nextTick(() => {
        this.scheduleTitleCapsuleClearanceUpdate();
      });
    },
    handleNavBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    handleNavAction(action) {
      if (action === "upload") {
        this.uploadImage();
        return;
      }

      if (action === "settings") {
        if (this.$refs.setPopup) {
          this.$refs.setPopup.open("bottom");
        }
        return;
      }

      if (action === "shortcutSettings") {
        uni.navigateTo({
          url: "/pages/writers/chapterToolbarSettings",
        });
        return;
      }

      if (action === "writerAi") {
        this.openWriterAiAssistant();
        return;
      }

      if (action === "undo" && this.editor) {
        this.editor.chain().focus().undo().run();
        return;
      }

      if (action === "redo" && this.editor) {
        this.editor.chain().focus().redo().run();
        return;
      }

      if (action === "format") {
        this.formatEssay();
        return;
      }

      if (action === "publish") {
        this.handlePublishAction();
      }
    },
    getLegacyNavAction(text) {
      const actionMap = {
        "\ue61f ": "upload",
        "\ue70f ": "settings",
        "\ue624 ": "undo",
        "\ue625 ": "redo",
        "\ue629 ": "format",
        "发布 ": "publish",
      };
      return actionMap[text] || "";
    },
  },
  onNavigationBarButtonTap(e) {
    const action = this.getLegacyNavAction(e && e.text);
    if (action) {
      this.handleNavAction(action);
    }
  },
  async onLoad(params) {
    this.chapterId = Number(params.id);
    this.hideBackButton = params.hideback === "true";
    this.syncAppEnvironment();
    this.updateCustomNavigationMetrics();
    this.resolveCurrentUserId();
    this.editSessionId = this.generateEditSessionId();
    this.publishHandoffActive = false;
    this.leaveFinalized = false;
    this.initializeWriterSettings();
    await this.initWriterFonts();
    this.setupAppKeyboardListener();
    this.startSaveNotifyTimer();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.handlePageHide);
    window.addEventListener("pagehide", this.handlePageHide);
    window.removeEventListener("popstate", this.browserBack);
    window.addEventListener("popstate", this.browserBack);
    window.removeEventListener("resize", this.updateCustomNavigationMetrics);
    window.addEventListener("resize", this.updateCustomNavigationMetrics);
    document.removeEventListener(
      "selectionchange",
      this.handleDocumentSelectionChange
    );
    document.addEventListener(
      "selectionchange",
      this.handleDocumentSelectionChange
    );
    this.$nextTick(() => {
      setTimeout(() => {
        this.applyNavigationBarTheme();
      });

      this.initScrollListener();
      this.checkFrameEnvironment();
      this.initializeArticle();
    });
  },
  async onUnload() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.updateCustomNavigationMetrics);
    }
    if (typeof document !== "undefined") {
      document.removeEventListener(
        "selectionchange",
        this.handleDocumentSelectionChange
      );
    }
    await this.finalizeBeforeLeave();
  },
  onResize() {
    this.updateCustomNavigationMetrics();
  },
  async onHide() {
    await this.pauseForBackground();
  },
  async onShow() {
    this.syncAppEnvironment();
    this.setupAppKeyboardListener();
    this.initializeWriterSettings();
    if (this.shouldSuppressEditorSyncForCompletedPublish()) {
      return;
    }
    this.publishHandoffActive = false;
    this.startSaveNotifyTimer();
    this.startWritingTimer();
    this.startLocalSaveTimer();
    this.checkFrameEnvironment();
    if (this.loadComplete) {
      this.claimEditLock();
    }
    if (
      this.canSwitchFont &&
      this.writerSettings.font &&
      this.writerSettings.font !== "default"
    ) {
      await this.ensureRuntimeFontReady(this.writerSettings.font);
    }
    this.applyEditorFontSize();
  },
};
</script>

<style scoped lang="less">
.outer {
  height: 100vh !important;
  overflow: hidden !important;

  .editorHeader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 300;
    transform: translate(0, calc(0px - var(--headerVisualOffset)));
    transition: transform 0.18s ease-out;
    will-change: transform;
  }

  .customNavBar {
    position: relative;
    z-index: 300;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    box-shadow: 0px 4px 1.5px rgba(0, 0, 0, 0.006),
      0px 9.7px 3.5px rgba(0, 0, 0, 0.008), 0px 18.3px 6.6px rgba(0, 0, 0, 0.01),
      0px 32.6px 11.8px rgba(0, 0, 0, 0.012),
      0px 61px 22.1px rgba(0, 0, 0, 0.014), 0px 146px 53px rgba(0, 0, 0, 0.02);
  }

  .customNavContent {
    position: relative;
    width: 100%;
    height: 44px;
    box-sizing: border-box;
    color: inherit;
  }

  .customNavLeft {
    position: absolute;
    left: 0;
    top: 0;
    width: 44px;
    height: 44px;
    z-index: 2;
  }

  .customNavTitle {
    position: absolute;
    left: 44px;
    right: 56px;
    top: 0;
    height: 44px;
  }

  .customNavActions {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: auto;
    max-width: calc(100vw - 44px);
    height: 44px;
    overflow-x: auto;
    overflow-y: hidden;
    z-index: 2;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .customNavActions::-webkit-scrollbar {
    display: none;
  }

  .customNavButton {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 40px;
    height: 44px;
    margin: 0;
    padding: 0;
    color: inherit;
    background: transparent;
    border: none;
    box-sizing: border-box;
    line-height: 1;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .customNavActions button::after {
    border: 0;
  }

  .customNavBack {
    width: 44px;
  }

  .customNavShortcutButton {
    width: 40px;
    border-radius: 8rpx;
  }

  .customNavShortcutIcon {
    font-size: 21px;
    line-height: 1;
  }

  .customNavShortcutImage {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .customToolbarTrigger {
    width: 44px;
    padding: 0;
    margin-right: 4px;
    border-radius: 8rpx;
  }

  .customToolbarTriggerIcon {
    font-size: 22px;
    line-height: 1;
  }

  .topBar {
    position: absolute;
    right: 16rpx;
    top: calc(var(--statusBarHeight) + var(--navBarHeight) + var(--statusCapsuleGap) - var(--statusCapsuleLift));
    z-index: 320;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10rpx;
    height: auto;
    max-width: calc(100vw - 32rpx);
    pointer-events: none;

    .statusCapsule {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      padding: 8rpx 16rpx;
      border: 1rpx solid rgba(175, 81, 38, 0.12);
      border-radius: 999rpx;
      background-color: rgba(255, 250, 240, 0.92);
      box-sizing: border-box;
      font-size: 24rpx;
      line-height: 1.35;
      white-space: nowrap;
      backdrop-filter: blur(8px);
    }

    .textCount {
      color: rgb(175, 81, 38);
    }

    .saveNotify {
      color: rgb(156, 156, 156);
    }

    .editorRole {
      display: inline-flex;
      align-items: center;
      margin-left: 10rpx;
      padding: 2rpx 10rpx;
      border-radius: 999rpx;
      font-size: 22rpx;
      color: #9a4f1f;
      background-color: rgba(255, 186, 120, 0.18);
    }
  }

  .middleBar {
    box-sizing: border-box;
    height: calc(100vh - var(--navBarHeight) - var(--statusBarHeight) + var(--headerLayoutOffset)) !important;
    margin-top: calc(var(--navBarHeight) + var(--statusBarHeight));
    overflow: hidden;
    transform: translate(0, calc(0px - var(--headerVisualOffset)));
    transition: height 0.18s ease-out, transform 0.18s ease-out;
    contain: layout paint;
    will-change: height, transform;

    .editorBlurSink {
      position: fixed;
      left: -10px;
      top: 0;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
      border: 0;
      padding: 0;
    }

    .textarea {
      display: block;
      position: relative;
      padding: var(--statusCapsuleTopClearance) 30rpx 30rpx;
      width: calc(100vw);
      height: calc(100%);
      font-size: 35rpx;
      line-height: 60rpx;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;

      .chapterTitleBar {
        display: flex;
        align-items: center;
        min-height: var(--titleBarHeight);
        margin-bottom: 30rpx;
        border-bottom: 1rpx solid rgba(166, 166, 166, 0.45);
        box-sizing: border-box;
      }

      .chapterTitleInput,
      :deep(.chapterTitleInput),
      :deep(.chapterTitleInput *),
      :deep(input),
      :deep(.uni-input-wrapper),
      :deep(.uni-input-input) {
        font-family: var(--editor-font-family, inherit) !important;
      }

      .chapterTitleInput {
        width: 100%;
        height: var(--titleBarHeight);
        padding: 0;
        font-family: var(--editor-font-family, inherit) !important;
        font-weight: bold;
        line-height: 150%;
        color: inherit;
        background: transparent;
        border: 0;
        outline: none;
        box-sizing: border-box;
      }

      :deep(.writer-prosemirror) {
        scroll-behavior: smooth;
        margin: 0 0 30rpx !important;
        min-height: calc(100% - var(--statusCapsuleTopClearance) - var(--titleBarHeight) - 90rpx);
        font-size: var(--editor-font-size);
        font-family: var(--editor-font-family, inherit) !important;
        line-height: 60rpx;
        color: inherit;
        outline: none;
        box-shadow: none;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-x: hidden;
      }

      :deep(.writer-prosemirror *) {
        font-family: var(--editor-font-family, inherit) !important;
      }

      :deep(.writer-prosemirror p) {
        margin: 0;
        min-height: 60rpx;
      }

      :deep(.writer-prosemirror img) {
        width: auto !important;
        max-width: calc(100% - 40rpx) !important;
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

    .quickInputToolBar {
      bottom: 0;
      height: 80rpx;
      width: 100%;
      z-index: 100;
      border-top: #b4b4b4 1rpx solid;
      display: flex;
      align-items: stretch;
      justify-content: flex-start;
      box-sizing: border-box;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 8rpx;
      -webkit-overflow-scrolling: touch;

      .quickInputToolbarButton {
        flex: 0 0 auto;
        min-width: 72rpx;
        max-width: 168rpx;
        height: 80rpx;
        box-sizing: border-box;
        padding: 0 12rpx;
        font-weight: bold;
        font-size: 31rpx;
        line-height: 78rpx;
        text-align: center;
        margin: 0;
        color: inherit;
        background: transparent;
        border: 0;
        border-radius: 0;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      .quickInputToolbarText,
      .quickInputToolbarIcon,
      .quickInputToolbarElementIcon {
        display: block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .quickInputToolbarText {
        font-size: 30rpx;
      }

      .quickInputToolbarIcon,
      .quickInputToolbarElementIcon {
        font-size: 39rpx;
        line-height: 78rpx;
      }

      .quickInputToolbarQuickIcon {
        font-size: 50rpx;
      }

      .quickInputToolbarImage {
        display: block;
        width: 42rpx;
        height: 42rpx;
        margin: 19rpx auto;
        object-fit: contain;
      }
    }

    @media screen and (max-width: 360px) {
      .quickInputToolBar {
        padding: 0 2rpx;

        .quickInputToolbarButton {
          padding: 0 1rpx;
          font-size: 28rpx;
        }

        .quickInputToolbarIcon {
          font-size: 35rpx;
        }
      }
    }
  }

  &.headerDragging {
    .editorHeader,
    .middleBar {
      transition: none;
    }

    .topBar .statusCapsule {
      box-shadow: none;
    }
  }
}

.toolbarPanel {
  position: relative;
  box-sizing: border-box;
  width: 100vw;
  padding: 22rpx 24rpx calc(26rpx + env(safe-area-inset-bottom));
  color: #3d3d3d;
  background: #fffaf0;
  border-top: 1rpx solid rgba(80, 39, 39, 0.12);
  border-top-left-radius: 8rpx;
  border-top-right-radius: 8rpx;
  box-shadow: 0 -14rpx 34rpx rgba(32, 24, 18, 0.16);
}

.toolbarPanel::before {
  content: "";
  position: absolute;
  top: 10rpx;
  left: 50%;
  width: 72rpx;
  height: 6rpx;
  border-radius: 999rpx;
  background: rgba(61, 61, 61, 0.22);
  transform: translateX(-50%);
}

.toolbarPanelHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76rpx;
}

.toolbarPanelTitle {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 1;
}

.quickInputToolBar button::after,
.toolbarPanel button::after {
  border: 0;
}

.toolbarPanelClose {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 64rpx;
  width: 64rpx;
  height: 64rpx;
  margin: 0 0 0 auto;
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  font-size: 34rpx;
  line-height: 1;
}

.toolbarGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12rpx;
  align-items: stretch;
  justify-items: stretch;
}

.toolbarGridItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  height: 128rpx;
  margin: 0;
  padding: 14rpx 6rpx 12rpx;
  color: inherit;
  background: rgba(255, 255, 255, 0.64);
  border: 1rpx solid rgba(80, 39, 39, 0.12);
  border-radius: 8rpx;
  box-sizing: border-box;
  line-height: normal;
  -webkit-tap-highlight-color: transparent;
}

.toolbarGridItem:active {
  background: rgba(255, 255, 255, 0.84);
  transform: scale(0.98);
}

.toolbarGridIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
  font-size: 42rpx;
  line-height: 1;
}

.toolbarGridImage {
  display: block;
  width: 52rpx;
  height: 52rpx;
  object-fit: contain;
}

.toolbarGridLabel {
  display: block;
  max-width: 100%;
  height: 28rpx;
  margin-top: 10rpx;
  overflow: hidden;
  color: inherit;
  font-size: 22rpx;
  line-height: 28rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settingBar {
  background-color: #000000aa;
  padding: 30rpx;
  padding-top: 1rpx;
  color: rgb(203, 203, 203);

  .normalLine {
    margin-top: 15rpx;
  }

  .fontFamilyLine {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      margin-left: 30rpx;
    }

    .fontSelectButton {
      min-width: 260rpx;
      height: 62rpx;
      padding: 0 24rpx;
      border-radius: 100rpx;
      background-color: #8882;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      font-size: 30rpx;
    }
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

.fonts-container {
  padding: 20rpx;

  .fonts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    padding: 10rpx;

    .font-item {
      position: relative;
      padding: 30rpx;
      border-radius: 12rpx;
      background: #f5f7fa;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #e6e8eb;
      }

      &.selected {
        background: #ecf5ff;
        border: 2rpx solid #409eff;
      }

      .font-info {
        .font-name {
          font-size: 32rpx;
          margin-bottom: 16rpx;
          color: #303133;
        }

        .font-download-state {
          font-size: 22rpx;
          margin-left: 12rpx;
          color: #888;
        }

        .font-preview {
          font-size: 28rpx;
          color: #606266;
          line-height: 1.6;
        }
      }

      .select-indicator {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        color: #409eff;
        font-size: 36rpx;
      }
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

.quickInputToolBar.blue,
.toolbarPanel.blue {
  background-color: #c4e8fe;
  color: #115574;
}

.quickInputToolBar.yellow,
.toolbarPanel.yellow {
  background-color: #fff2d9;
  color: #3d3d3d;
}

.quickInputToolBar.green,
.toolbarPanel.green {
  background-color: #88e695;
  color: #093811;
}

.quickInputToolBar.purple,
.toolbarPanel.purple {
  background-color: #fcc4ff;
  color: #310024;
}

.quickInputToolBar.black,
.toolbarPanel.black {
  background-color: #000000;
  color: #cecece;
}

.toolbarPanel.black {
  border-top-color: rgba(216, 204, 185, 0.18);
}

.toolbarPanel.black::before {
  background: rgba(216, 204, 185, 0.32);
}

.toolbarPanel.black .toolbarGridItem {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(216, 204, 185, 0.16);
}

.toolbarPanel.black .toolbarGridItem:active {
  background: rgba(255, 255, 255, 0.14);
}

.quickInputToolBar.white,
.toolbarPanel.white {
  background-color: #f5f5f5;
  color: #000000;
}
</style>

<style lang="less">
.writer-prosemirror,
.writer-prosemirror:focus,
.writer-prosemirror:focus-visible,
.writer-prosemirror.ProseMirror-focused {
  font-family: var(--editor-font-family, inherit) !important;
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.writer-prosemirror * {
  font-family: var(--editor-font-family, inherit) !important;
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
  max-width: calc(100vw - 80rpx) !important;
  height: auto !important;
}
</style>
