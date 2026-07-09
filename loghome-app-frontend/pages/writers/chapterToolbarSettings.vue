<template>
  <div
    class="toolbarSettingsPage"
    :class="{ sortingActive: isTouchDragging }"
    :style="{ '--settingsStatusBarHeight': statusBarHeight + 'px' }"
  >
    <div class="pageHeader" :style="{ paddingTop: statusBarHeight + 'px' }">
      <div class="navRow">
        <button class="backButton" @click="goBack">
          <i class="el-icon-arrow-left"></i>
        </button>
        <div class="pageTitle">自定义工具栏</div>
        <div class="headerSpacer"></div>
      </div>
      <div class="tabRow">
        <button
          class="tabButton"
          :class="{ active: activeTab === 'nav' }"
          @click="activeTab = 'nav'"
        >
          <span class="tabLabel">顶部导航</span>
          <span class="tabIndicator"></span>
        </button>
        <button
          class="tabButton"
          :class="{ active: activeTab === 'keyboard' }"
          @click="activeTab = 'keyboard'"
        >
          <span class="tabLabel">键盘工具</span>
          <span class="tabIndicator"></span>
        </button>
      </div>
    </div>

    <scroll-view class="pageBody" :scroll-y="!isTouchDragging">
      <div class="previewCard" v-if="activeTab === 'nav'">
        <div class="navPreviewBar">
          <i class="el-icon-arrow-left previewBack"></i>
          <div class="previewActions">
            <div
              v-for="tool in selectedNavTools"
              :key="tool.id"
              class="previewActionButton"
            >
              <span v-if="tool.iconText" class="previewIcon iconfont">
                {{ tool.iconText }}
              </span>
              <img
                v-else-if="tool.iconImage"
                class="previewImage"
                :src="tool.iconImage"
                :alt="tool.label"
              />
              <i v-else class="previewIcon" :class="tool.iconClass"></i>
            </div>
            <div class="previewActionButton">
              <i class="el-icon-menu previewIcon"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="previewCard" v-else>
        <div class="keyboardPreviewBar">
          <button
              v-for="item in selectedKeyboardTools"
              :key="item.itemKey"
              class="keyboardPreviewButton"
            >
            <span
              v-if="item.isQuickInput && item.icon"
              class="keyboardPreviewIcon iconfont"
            >
              {{ item.icon }}
            </span>
            <span v-else-if="item.isQuickInput" class="keyboardPreviewQuickText">
              {{ getQuickInputDisplayText(item) }}
            </span>
            <span v-else-if="item.iconText" class="keyboardPreviewIcon iconfont">
              {{ item.iconText }}
            </span>
            <img
              v-else-if="item.iconImage"
              class="keyboardPreviewImage"
              :src="item.iconImage"
              :alt="item.label"
            />
            <i v-else class="keyboardPreviewElementIcon" :class="item.iconClass"></i>
          </button>
          <div v-if="!selectedKeyboardTools.length" class="emptyKeyboardPreview">
            暂无键盘工具
          </div>
        </div>
      </div>

      <div class="sectionMeta">
        <div>
          已添加
          <span class="countText">{{ selectedTools.length }}/{{ selectedLimitText }}</span>
          ，拖动排序
        </div>
        <button class="restoreButton" @click="resetCurrentTab">恢复默认</button>
      </div>

      <div
        ref="selectedGrid"
        class="selectedGrid"
        :class="{ empty: !selectedTools.length, sorting: isSortingActive }"
      >
        <div
          v-for="(tool, index) in selectedTools"
          :key="getToolKey(tool)"
          class="selectedToolItem"
          :class="{ dragging: isDraggingTool(tool, index) }"
          draggable="true"
          @dragstart="startDrag($event, index)"
          @dragenter.prevent="overDrag(index)"
          @dragover.prevent="overDrag(index)"
          @drop="dropDrag(index)"
          @dragend="finishDrag"
          @touchstart="startTouchDrag($event, index)"
          @touchmove="moveTouchDrag"
          @touchend="finishTouchDrag"
          @touchcancel="finishTouchDrag"
        >
          <button
            class="removeButton"
            @click.stop="removeSelectedTool(index)"
            @touchstart.stop
          >
            <i class="el-icon-close"></i>
          </button>
          <div class="toolIconBubble">
            <span
              v-if="tool.isQuickInput && tool.icon"
              class="quickInputDisplayIcon iconfont"
            >
              {{ tool.icon }}
            </span>
            <span v-else-if="tool.isQuickInput" class="quickInputDisplayIcon">
              {{ getQuickInputDisplayText(tool) }}
            </span>
            <span v-else-if="tool.iconText" class="toolIcon iconfont">
              {{ tool.iconText }}
            </span>
            <img
              v-else-if="tool.iconImage"
              class="toolImage"
              :src="tool.iconImage"
              :alt="tool.label"
            />
            <i v-else class="toolIcon" :class="tool.iconClass"></i>
          </div>
          <div class="toolLabel">{{ getToolLabel(tool) }}</div>
        </div>
        <div v-if="!selectedTools.length" class="emptySelectedText">
          点击下方工具添加到快捷栏
        </div>
      </div>

      <template v-if="activeTab === 'nav'">
        <div class="sectionTitle">点击添加导航栏功能</div>
        <div class="allToolsGrid">
          <button
            v-for="tool in availableTools"
            :key="tool.id"
            class="allToolItem"
            :class="{ added: isToolSelected(tool), disabled: isToolSelected(tool) }"
            @click="handleAvailableToolClick(tool)"
          >
            <span class="addBadge">
              <i :class="isToolSelected(tool) ? 'el-icon-check' : 'el-icon-plus'"></i>
            </span>
            <div class="toolIconBubble">
              <span v-if="tool.iconText" class="toolIcon iconfont">
                {{ tool.iconText }}
              </span>
              <img
                v-else-if="tool.iconImage"
                class="toolImage"
                :src="tool.iconImage"
                :alt="tool.label"
              />
              <i v-else class="toolIcon" :class="tool.iconClass"></i>
            </div>
            <div class="toolLabel">{{ tool.label }}</div>
          </button>
        </div>
      </template>

      <template v-else>
        <div class="sectionTitle">功能</div>
        <div class="allToolsGrid">
          <button
            v-for="tool in keyboardFunctionTools"
            :key="tool.id"
            class="allToolItem"
            :class="{ added: isToolSelected(tool), disabled: isToolSelected(tool) }"
            @click="handleAvailableToolClick(tool)"
          >
            <span class="addBadge">
              <i :class="isToolSelected(tool) ? 'el-icon-check' : 'el-icon-plus'"></i>
            </span>
            <div class="toolIconBubble">
              <span v-if="tool.iconText" class="toolIcon iconfont">
                {{ tool.iconText }}
              </span>
              <img
                v-else-if="tool.iconImage"
                class="toolImage"
                :src="tool.iconImage"
                :alt="tool.label"
              />
              <i v-else class="toolIcon" :class="tool.iconClass"></i>
            </div>
            <div class="toolLabel">{{ tool.label }}</div>
          </button>
        </div>

        <div class="sectionTitle">快捷输入</div>
        <div class="allToolsGrid">
          <button
            v-for="tool in keyboardQuickInputTools"
            :key="tool.id"
            class="allToolItem"
            :class="{
              creator: tool.isQuickInputCreator,
              added: isToolSelected(tool),
              disabled: isToolSelected(tool) && !tool.isQuickInputCreator
            }"
            @click="handleAvailableToolClick(tool)"
            @longpress="handleQuickInputLongPress(tool)"
            @contextmenu.prevent="handleQuickInputLongPress(tool)"
          >
            <span v-if="!tool.isQuickInputCreator" class="addBadge">
              <i :class="isToolSelected(tool) && !tool.isQuickInputCreator ? 'el-icon-check' : 'el-icon-plus'"></i>
            </span>
            <div class="toolIconBubble">
            <span
              v-if="tool.isQuickInput && tool.icon"
              class="quickInputDisplayIcon iconfont"
            >
              {{ tool.icon }}
            </span>
            <span v-else-if="tool.isQuickInput" class="quickInputDisplayIcon">
                {{ getQuickInputDisplayText(tool) }}
              </span>
              <i v-else class="toolIcon" :class="tool.iconClass"></i>
            </div>
            <div class="toolLabel">{{ tool.label }}</div>
          </button>
        </div>
      </template>
    </scroll-view>

    <div
      v-if="dragGhost.active && dragGhost.tool"
      class="dragGhost"
      :style="dragGhostStyle"
    >
      <div class="toolIconBubble">
        <span
          v-if="dragGhost.tool.isQuickInput && dragGhost.tool.icon"
          class="quickInputDisplayIcon iconfont"
        >
          {{ dragGhost.tool.icon }}
        </span>
        <span v-else-if="dragGhost.tool.isQuickInput" class="quickInputDisplayIcon">
          {{ getQuickInputDisplayText(dragGhost.tool) }}
        </span>
        <span v-else-if="dragGhost.tool.iconText" class="toolIcon iconfont">
          {{ dragGhost.tool.iconText }}
        </span>
        <img
          v-else-if="dragGhost.tool.iconImage"
          class="toolImage"
          :src="dragGhost.tool.iconImage"
          :alt="dragGhost.tool.label"
        />
        <i v-else class="toolIcon" :class="dragGhost.tool.iconClass"></i>
      </div>
      <div class="toolLabel">{{ getToolLabel(dragGhost.tool) }}</div>
    </div>

    <uni-popup ref="quickInputDrawer" type="bottom">
      <view class="quickInputDrawer">
        <div class="drawerHeader">
          <div class="drawerTitle">
            {{ editingQuickInputId ? "编辑快捷输入" : "新建快捷输入" }}
          </div>
          <button class="drawerClose" @click="closeQuickInputDrawer">
            <i class="el-icon-close"></i>
          </button>
        </div>
        <div class="inputTypeSwitch">
          <div
            class="inputTypeOption"
            :class="{ active: quickInputDraft.type === 'punctuation' }"
            role="button"
            tabindex="0"
            @click="quickInputDraft.type = 'punctuation'"
          >
            标点输入
          </div>
          <div
            class="inputTypeOption"
            :class="{ active: quickInputDraft.type === 'word' }"
            role="button"
            tabindex="0"
            @click="quickInputDraft.type = 'word'"
          >
            词汇输入
          </div>
        </div>
        <input
          class="drawerInput"
          v-model="quickInputDraft.label"
          placeholder="显示名称，留空则使用内容"
        />
        <input
          class="drawerInput"
          v-model="quickInputDraft.value"
          placeholder="点击后插入的内容"
        />
        <div
          v-if="quickInputDraft.type === 'punctuation'"
          class="drawerToggleRow"
        >
          <span>成对标点</span>
          <button
            class="drawerSwitch"
            :class="{ active: quickInputDraft.isPair }"
            @click="quickInputDraft.isPair = !quickInputDraft.isPair"
          >
            <span></span>
          </button>
        </div>
        <div
          class="drawerPrimaryButton"
          role="button"
          tabindex="0"
          @click="saveQuickInput"
        >
          {{ editingQuickInputId ? "保存修改" : "保存到备选区" }}
        </div>
      </view>
    </uni-popup>
  </div>
</template>

<script>
function resolveAssetUrl(assetModule) {
  return assetModule && assetModule.default ? assetModule.default : assetModule;
}

const BIPAO_AI_ICON = resolveAssetUrl(require("../../static/bipao_ai_icon.svg"));

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
const MAX_KEYBOARD_TOOLS = 16;
const NAV_LEFT_RESERVED_WIDTH = 44;
const NAV_TOOLBAR_TRIGGER_WIDTH = 48;
const NAV_SHORTCUT_BUTTON_WIDTH = 40;
const NAV_ACTION_SAFE_GAP = 8;
const QUICK_INPUT_CREATOR_TOOL = {
  id: "createQuickInput",
  label: "新建",
  iconClass: "el-icon-plus",
  isQuickInputCreator: true,
};
const DEFAULT_QUICK_INPUT_MAP = DEFAULT_QUICK_INPUTS.reduce((map, item) => {
  map[item.id] = item;
  return map;
}, {});

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
      if (!item || typeof item !== "object") return null;
      const value = item.value === undefined || item.value === null
        ? ""
        : String(item.value);
      if (!value) return null;
      const labelSource = item.label === undefined || item.label === null
        ? value
        : String(item.label);
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
        label: (shouldUseDefaultLabel
          ? defaultItem.label
          : trimmedLabel || value
        ).slice(0, 12),
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

function normalizeToolIds(rawIds, defaults) {
  const ids = [];
  const pushIfValid = (id) => {
    const normalizedId = String(id || "");
    if (TOOL_DEFINITIONS[normalizedId] && !ids.includes(normalizedId)) {
      ids.push(normalizedId);
    }
  };

  if (Array.isArray(rawIds)) rawIds.forEach(pushIfValid);
  defaults.forEach(pushIfValid);
  return ids;
}

function normalizeSelectedToolIds(rawIds, defaults) {
  const ids = [];
  const pushIfValid = (id) => {
    const normalizedId = String(id || "");
    if (TOOL_DEFINITIONS[normalizedId] && !ids.includes(normalizedId)) {
      ids.push(normalizedId);
    }
  };

  if (Array.isArray(rawIds)) {
    rawIds.forEach(pushIfValid);
    return ids;
  }

  defaults.forEach(pushIfValid);
  return ids;
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

  return items.slice(0, MAX_KEYBOARD_TOOLS);
}

function createDefaultWriterSettings() {
  return {
    version: 26060401,
    showSymbols: true,
    font: "default",
    fontSize: 35,
    openTypeSet: false,
    showFab: false,
    theme: "yellow",
    codeMode: false,
    quickInputs: DEFAULT_QUICK_INPUTS.map(cloneQuickInput),
    navToolIds: DEFAULT_NAV_TOOL_IDS.slice(),
    navShortcutToolIds: DEFAULT_NAV_SHORTCUT_TOOL_IDS.slice(),
    keyboardShortcutItems: DEFAULT_KEYBOARD_SHORTCUT_ITEMS.slice(),
  };
}

function normalizeWriterSettings(rawSettings) {
  const parsed = rawSettings && typeof rawSettings === "object" ? rawSettings : {};
  const settings = {
    ...createDefaultWriterSettings(),
    ...parsed,
    version: 26060401,
  };

  settings.quickInputs = normalizeQuickInputs(settings.quickInputs);
  settings.navToolIds = normalizeToolIds(settings.navToolIds, DEFAULT_NAV_TOOL_IDS);
  settings.navShortcutToolIds = normalizeSelectedToolIds(
    settings.navShortcutToolIds,
    DEFAULT_NAV_SHORTCUT_TOOL_IDS
  ).slice(0, MAX_NAV_SHORTCUTS);
  settings.keyboardShortcutItems = normalizeKeyboardShortcutItems(
    settings.keyboardShortcutItems,
    settings.quickInputs
  );
  delete settings.hiddenNavToolIds;
  delete settings.keyboardToolIds;
  return settings;
}

export default {
  data() {
    return {
      statusBarHeight: 0,
      viewportWidth: 375,
      activeTab: "nav",
      writerSettings: createDefaultWriterSettings(),
      draggingIndex: -1,
      draggedItemKey: "",
      dragTouchTimer: null,
      dragTouchStart: null,
      dragTouchOffset: { x: 0, y: 0 },
      isTouchDragging: false,
      editingQuickInputId: "",
      suppressNextToolClick: false,
      bodyOverflowBeforeDrag: "",
      dragGhost: {
        active: false,
        x: 0,
        y: 0,
        width: 0,
        tool: null,
      },
      quickInputDraft: {
        type: "punctuation",
        label: "",
        value: "",
        isPair: false,
      },
    };
  },
  computed: {
    allNavTools() {
      return normalizeToolIds(this.writerSettings.navToolIds, DEFAULT_NAV_TOOL_IDS)
        .map((id) => ({ ...TOOL_DEFINITIONS[id] }));
    },
    navShortcutLimit() {
      return calculateNavShortcutLimit(this.viewportWidth);
    },
    selectedNavToolIds() {
      return normalizeSelectedToolIds(
        this.writerSettings.navShortcutToolIds,
        DEFAULT_NAV_SHORTCUT_TOOL_IDS
      ).slice(0, MAX_NAV_SHORTCUTS);
    },
    selectedNavTools() {
      const allTools = new Map(this.allNavTools.map((tool) => [tool.id, tool]));
      return this.selectedNavToolIds
        .map((id) => allTools.get(id))
        .filter(Boolean)
        .slice(0, this.navShortcutLimit);
    },
    quickInputDefinitions() {
      return normalizeQuickInputs(this.writerSettings.quickInputs);
    },
    selectedKeyboardTools() {
      const allTools = new Map(this.allNavTools.map((tool) => [tool.id, tool]));
      const quickInputMap = new Map(
        this.quickInputDefinitions.map((item) => [item.id, item])
      );
      return normalizeKeyboardShortcutItems(
        this.writerSettings.keyboardShortcutItems,
        this.writerSettings.quickInputs
      )
        .map((item) => {
          if (item.type === "tool") {
            const tool = allTools.get(item.id);
            return tool
              ? { ...tool, itemType: "tool", itemKey: `tool:${item.id}` }
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
    selectedTools() {
      return this.activeTab === "nav"
        ? this.selectedNavTools
        : this.selectedKeyboardTools;
    },
    isSortingActive() {
      return this.isTouchDragging || this.draggingIndex >= 0;
    },
    dragGhostStyle() {
      return {
        width: `${this.dragGhost.width}px`,
        transform: `translate3d(${this.dragGhost.x}px, ${this.dragGhost.y}px, 0)`,
      };
    },
    selectedLimit() {
      return this.activeTab === "nav" ? this.navShortcutLimit : MAX_KEYBOARD_TOOLS;
    },
    selectedLimitText() {
      return this.activeTab === "nav" ? String(this.navShortcutLimit) : "不限";
    },
    availableTools() {
      if (this.activeTab === "nav") {
        return this.allNavTools;
      }
      return this.keyboardFunctionTools;
    },
    keyboardFunctionTools() {
      return this.allNavTools;
    },
    keyboardQuickInputTools() {
      return [
        QUICK_INPUT_CREATOR_TOOL,
        ...this.quickInputDefinitions,
      ];
    },
  },
  onLoad(params = {}) {
    this.activeTab = params.tab === "keyboard" ? "keyboard" : "nav";
    this.updateStatusBarHeight();
    this.loadSettings();
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.updateStatusBarHeight);
      window.addEventListener("resize", this.updateStatusBarHeight);
    }
  },
  onResize() {
    this.updateStatusBarHeight();
  },
  onUnload() {
    this.clearTouchDragTimer();
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.updateStatusBarHeight);
    }
    this.unlockPageScroll();
  },
  beforeDestroy() {
    this.clearTouchDragTimer();
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.updateStatusBarHeight);
    }
    this.unlockPageScroll();
  },
  methods: {
    updateStatusBarHeight() {
      this.viewportWidth = getViewportWidth();
      try {
        const info =
          typeof uni !== "undefined" && typeof uni.getSystemInfoSync === "function"
            ? uni.getSystemInfoSync()
            : {};
        this.statusBarHeight = Number(info.statusBarHeight) || 0;
      } catch (error) {
        this.statusBarHeight = 0;
      }
    },
    loadSettings() {
      try {
        const raw = window.localStorage.getItem("writerSettings");
        this.writerSettings = normalizeWriterSettings(raw ? JSON.parse(raw) : null);
      } catch (error) {
        this.writerSettings = createDefaultWriterSettings();
      }
      this.persistSettings();
    },
    persistSettings() {
      this.writerSettings = normalizeWriterSettings(this.writerSettings);
      window.localStorage.setItem("writerSettings", JSON.stringify(this.writerSettings));
    },
    goBack() {
      uni.navigateBack({ delta: 1 });
    },
    getSelectableKey(tool) {
      if (!tool) return "";
      if (tool.isQuickInput) return `quickInput:${tool.id}`;
      return `tool:${tool.id}`;
    },
    getToolKey(tool) {
      return tool ? tool.itemKey || this.getSelectableKey(tool) : "";
    },
    getSelectedToolIndexByKey(key) {
      return this.selectedTools.findIndex((tool) => this.getToolKey(tool) === key);
    },
    isDraggingTool(tool, index) {
      if (!this.isSortingActive) return false;
      if (this.draggedItemKey) {
        return this.getToolKey(tool) === this.draggedItemKey;
      }
      return this.draggingIndex === index;
    },
    isToolSelected(tool) {
      if (!tool || tool.isQuickInputCreator) return false;
      if (this.activeTab === "nav") {
        return this.selectedNavToolIds.includes(tool.id);
      }
      const key = this.getSelectableKey(tool);
      return this.selectedKeyboardTools.some((item) => item.itemKey === key);
    },
    handleAvailableToolClick(tool) {
      if (!tool) return;
      if (this.suppressNextToolClick) {
        this.suppressNextToolClick = false;
        return;
      }
      if (tool.isQuickInputCreator) {
        this.openQuickInputDrawer();
        return;
      }
      if (this.isToolSelected(tool)) {
        return;
      }
      if (this.selectedTools.length >= this.selectedLimit) {
        uni.showToast({
          title: this.activeTab === "nav" ? "顶部导航最多添加4个" : "键盘工具已达上限",
          icon: "none",
          duration: 1600,
        });
        return;
      }
      if (this.activeTab === "nav") {
        this.writerSettings.navShortcutToolIds = [
          ...this.selectedNavToolIds,
          tool.id,
        ];
      } else {
        this.writerSettings.keyboardShortcutItems = [
          ...normalizeKeyboardShortcutItems(
            this.writerSettings.keyboardShortcutItems,
            this.writerSettings.quickInputs
          ),
          tool.isQuickInput
            ? { type: "quickInput", id: tool.id }
            : { type: "tool", id: tool.id },
        ];
      }
      this.persistSettings();
    },
    handleQuickInputLongPress(tool) {
      if (!tool || tool.isQuickInputCreator || !tool.isQuickInput) {
        return;
      }
      this.suppressNextToolClick = true;
      setTimeout(() => {
        this.suppressNextToolClick = false;
      }, 450);
      const showMenu = () => {
        if (typeof uni === "undefined" || typeof uni.showActionSheet !== "function") {
          this.openQuickInputDrawer(tool);
          return;
        }
        uni.showActionSheet({
          itemList: ["编辑", "删除"],
          success: (result) => {
            const tapIndex = Number(result && result.tapIndex);
            if (tapIndex === 0) {
              this.openQuickInputDrawer(tool);
            } else if (tapIndex === 1) {
              this.confirmDeleteQuickInput(tool);
            }
          },
        });
      };
      showMenu();
    },
    confirmDeleteQuickInput(tool) {
      if (!tool || !tool.id) return;
      if (typeof uni === "undefined" || typeof uni.showModal !== "function") {
        this.deleteQuickInput(tool.id);
        return;
      }
      uni.showModal({
        title: "删除快捷输入",
        content: `确认删除“${this.getToolLabel(tool)}”？`,
        confirmText: "删除",
        confirmColor: "#d93026",
        success: (result) => {
          if (result && result.confirm) {
            this.deleteQuickInput(tool.id);
          }
        },
      });
    },
    deleteQuickInput(inputId) {
      const id = String(inputId || "");
      if (!id) return;
      this.writerSettings.quickInputs = this.quickInputDefinitions
        .filter((item) => item.id !== id)
        .map(cloneQuickInput);
      this.writerSettings.keyboardShortcutItems = normalizeKeyboardShortcutItems(
        this.writerSettings.keyboardShortcutItems,
        this.writerSettings.quickInputs
      ).filter((item) => !(item.type === "quickInput" && item.id === id));
      if (this.editingQuickInputId === id) {
        this.resetQuickInputDraft();
      }
      this.persistSettings();
    },
    removeSelectedTool(index) {
      if (this.activeTab === "nav") {
        const nextIds = this.selectedNavToolIds.slice();
        nextIds.splice(index, 1);
        this.writerSettings.navShortcutToolIds = nextIds;
      } else {
        const nextItems = normalizeKeyboardShortcutItems(
          this.writerSettings.keyboardShortcutItems,
          this.writerSettings.quickInputs
        );
        nextItems.splice(index, 1);
        this.writerSettings.keyboardShortcutItems = nextItems;
      }
      this.persistSettings();
    },
    moveSelectedTool(fromIndex, toIndex, options = {}) {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= this.selectedTools.length ||
        toIndex >= this.selectedTools.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      if (this.activeTab === "nav") {
        const nextIds = this.selectedNavToolIds.slice();
        const [item] = nextIds.splice(fromIndex, 1);
        nextIds.splice(toIndex, 0, item);
        this.writerSettings.navShortcutToolIds = nextIds;
      } else {
        const nextItems = normalizeKeyboardShortcutItems(
          this.writerSettings.keyboardShortcutItems,
          this.writerSettings.quickInputs
        );
        const [item] = nextItems.splice(fromIndex, 1);
        nextItems.splice(toIndex, 0, item);
        this.writerSettings.keyboardShortcutItems = nextItems;
      }
      if (options.persist !== false) {
        this.persistSettings();
      }
    },
    startDrag(event, index) {
      this.clearTouchDragTimer();
      this.draggingIndex = index;
      this.draggedItemKey = this.getToolKey(this.selectedTools[index]);
      if (event && event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", this.draggedItemKey);
      }
    },
    overDrag(index) {
      if (this.draggingIndex < 0 || index === this.draggingIndex) return;
      this.moveSelectedTool(this.draggingIndex, index, { persist: false });
      this.draggingIndex = index;
    },
    dropDrag(index) {
      if (this.draggingIndex >= 0 && index !== this.draggingIndex) {
        this.moveSelectedTool(this.draggingIndex, index, { persist: false });
      }
      this.finishDrag();
    },
    finishDrag() {
      if (this.draggingIndex >= 0) {
        this.persistSettings();
      }
      this.draggingIndex = -1;
      this.draggedItemKey = "";
    },
    startTouchDrag(event, index) {
      const touch =
        event && event.touches && event.touches.length ? event.touches[0] : null;
      if (!touch) return;
      this.clearTouchDragTimer();
      this.dragTouchStart = {
        x: touch.clientX,
        y: touch.clientY,
        index,
      };
      this.draggedItemKey = this.getToolKey(this.selectedTools[index]);
      this.dragTouchTimer = setTimeout(() => {
        this.activateTouchDrag(index, this.dragTouchStart);
      }, 160);
    },
    moveTouchDrag(event) {
      const touch =
        event && event.touches && event.touches.length ? event.touches[0] : null;
      if (!touch || !this.dragTouchStart) return;

      if (!this.isTouchDragging) {
        const deltaX = touch.clientX - this.dragTouchStart.x;
        const deltaY = touch.clientY - this.dragTouchStart.y;
        if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 16) {
          this.clearTouchDragTimer();
        }
        return;
      }

      if (event && event.cancelable) {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }

      this.updateDragGhostPosition(touch);
      const fromIndex = this.getSelectedToolIndexByKey(this.draggedItemKey);
      const targetIndex = this.getTouchDragTargetIndex(touch, fromIndex);
      if (fromIndex >= 0 && targetIndex >= 0 && targetIndex !== fromIndex) {
        this.moveSelectedTool(fromIndex, targetIndex, { persist: false });
        this.draggingIndex = targetIndex;
      }
    },
    finishTouchDrag(event) {
      this.clearTouchDragTimer();
      if (this.isTouchDragging) {
        if (event && event.cancelable) {
          event.preventDefault();
        }
        this.persistSettings();
      }
      this.unlockPageScroll();
      this.draggingIndex = -1;
      this.draggedItemKey = "";
      this.dragTouchStart = null;
      this.dragTouchOffset = { x: 0, y: 0 };
      this.isTouchDragging = false;
      this.dragGhost = {
        active: false,
        x: 0,
        y: 0,
        width: 0,
        tool: null,
      };
    },
    clearTouchDragTimer() {
      if (this.dragTouchTimer) {
        clearTimeout(this.dragTouchTimer);
        this.dragTouchTimer = null;
      }
    },
    activateTouchDrag(index, startPoint) {
      const tool = this.selectedTools[index];
      const grid = this.$refs.selectedGrid;
      if (!tool || !grid || !startPoint) return;
      const items = Array.from(grid.querySelectorAll(".selectedToolItem"));
      const item = items[index];
      if (!item) return;
      const rect = item.getBoundingClientRect();
      this.dragTouchTimer = null;
      this.isTouchDragging = true;
      this.lockPageScroll();
      this.draggingIndex = index;
      this.draggedItemKey = this.getToolKey(tool);
      this.dragTouchOffset = {
        x: startPoint.x - rect.left,
        y: startPoint.y - rect.top,
      };
      this.dragGhost = {
        active: true,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        tool: { ...tool },
      };
      if (
        typeof uni !== "undefined" &&
        typeof uni.vibrateShort === "function"
      ) {
        try {
          uni.vibrateShort({ type: "light" });
        } catch (error) {
          try {
            uni.vibrateShort();
          } catch (innerError) {
            return;
          }
        }
      }
    },
    lockPageScroll() {
      if (typeof document === "undefined" || !document.body) {
        return;
      }
      if (this.bodyOverflowBeforeDrag === "") {
        this.bodyOverflowBeforeDrag = document.body.style.overflow || "";
      }
      document.body.style.overflow = "hidden";
    },
    unlockPageScroll() {
      if (typeof document === "undefined" || !document.body) {
        return;
      }
      document.body.style.overflow = this.bodyOverflowBeforeDrag || "";
      this.bodyOverflowBeforeDrag = "";
    },
    updateDragGhostPosition(touch) {
      this.dragGhost = {
        ...this.dragGhost,
        x: touch.clientX - this.dragTouchOffset.x,
        y: touch.clientY - this.dragTouchOffset.y,
      };
    },
    getTouchDragTargetIndex(touch, fromIndex) {
      const grid = this.$refs.selectedGrid;
      if (!grid || fromIndex < 0) return fromIndex;
      const items = Array.from(grid.querySelectorAll(".selectedToolItem"));
      let targetIndex = fromIndex;
      let minDistance = Number.POSITIVE_INFINITY;
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = centerX - touch.clientX;
        const deltaY = centerY - touch.clientY;
        const distance =
          deltaX * deltaX + deltaY * deltaY * 1.25;
        if (distance < minDistance) {
          minDistance = distance;
          targetIndex = index;
        }
      });
      return targetIndex;
    },
    resetCurrentTab() {
      if (this.activeTab === "nav") {
        this.writerSettings.navShortcutToolIds = DEFAULT_NAV_SHORTCUT_TOOL_IDS.slice();
      } else {
        this.writerSettings.keyboardShortcutItems = DEFAULT_KEYBOARD_SHORTCUT_ITEMS.slice();
      }
      this.persistSettings();
    },
    resetQuickInputDraft() {
      this.quickInputDraft = {
        type: "punctuation",
        label: "",
        value: "",
        isPair: false,
      };
      this.editingQuickInputId = "";
    },
    openQuickInputDrawer(item = null) {
      if (item && item.isQuickInput) {
        this.editingQuickInputId = item.id;
        this.quickInputDraft = {
          type: item.type === "word" ? "word" : "punctuation",
          label: item.label || "",
          value: item.value || "",
          isPair: item.type === "punctuation" && item.isPair === true,
        };
      } else {
        this.resetQuickInputDraft();
      }
      if (this.$refs.quickInputDrawer) {
        this.$refs.quickInputDrawer.open("bottom");
      }
    },
    closeQuickInputDrawer() {
      if (this.$refs.quickInputDrawer) {
        this.$refs.quickInputDrawer.close();
      }
    },
    saveQuickInput() {
      const value = String(this.quickInputDraft.value || "");
      if (!value) {
        uni.showToast({
          title: "请输入快捷内容",
          icon: "none",
          duration: 1600,
        });
        return;
      }
      const label = String(this.quickInputDraft.label || value).trim() || value;
      const currentItems = this.quickInputDefinitions.map(cloneQuickInput);
      const editingItem = currentItems.find((item) => item.id === this.editingQuickInputId);
      const nextItem = {
        id:
          this.editingQuickInputId ||
          `quick_input_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: this.quickInputDraft.type === "word" ? "word" : "punctuation",
        label: label.slice(0, 12),
        value,
        icon: (editingItem && editingItem.icon) || "",
        isPair:
          this.quickInputDraft.type === "punctuation" &&
          this.quickInputDraft.isPair === true,
      };
      const existingIndex = currentItems.findIndex((item) => item.id === nextItem.id);
      if (existingIndex >= 0) {
        currentItems.splice(existingIndex, 1, nextItem);
      } else {
        currentItems.push(nextItem);
      }
      this.writerSettings.quickInputs = currentItems;
      this.persistSettings();
      this.resetQuickInputDraft();
      this.closeQuickInputDrawer();
    },
    getQuickInputDisplayText(item) {
      const value = String((item && item.value) || "");
      if (value.trim()) return value;
      return String((item && item.label) || "");
    },
    getToolLabel(tool) {
      if (!tool) return "";
      if (tool.isQuickInput) {
        return String(tool.label || tool.value || "");
      }
      return tool.label;
    },
  },
};
</script>

<style scoped lang="less">
.toolbarSettingsPage {
  min-height: 100vh;
  color: #26313d;
  background: #f4f7fb;
}

.toolbarSettingsPage.sortingActive {
  touch-action: none;
}

button::after {
  display: none;
  content: none;
  border: 0;
}

button {
  margin: 0;
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  line-height: normal;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.pageHeader {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f4f7fb;
  border-bottom: 1rpx solid #dce3eb;
}

.navRow {
  display: grid;
  grid-template-columns: 96rpx minmax(0, 1fr) 96rpx;
  align-items: center;
  height: 100rpx;
}

.backButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 100rpx;
  font-size: 44rpx;
}

.pageTitle {
  overflow: hidden;
  font-size: 38rpx;
  font-weight: 700;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tabRow {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  height: 86rpx;
}

.tabButton {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 86rpx;
  font-size: 31rpx;
  color: #3b4652;
}

.tabButton.active {
  font-weight: 700;
}

.tabLabel {
  position: relative;
  z-index: 1;
}

.tabIndicator {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 72rpx;
  height: 7rpx;
  opacity: 0;
  border-radius: 999rpx;
  background: #2d83dd;
  transform: translateX(-50%) scaleX(0.7);
  transform-origin: center;
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.tabButton.active .tabIndicator {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}

.pageBody {
  height: calc(100vh - var(--settingsStatusBarHeight) - 186rpx);
  box-sizing: border-box;
}

.previewCard,
.selectedGrid,
.allToolsGrid {
  margin: 34rpx 32rpx 0;
  background: #ffffff;
  border-radius: 8rpx;
  box-shadow: 0 12rpx 30rpx rgba(45, 72, 103, 0.08);
}

.previewCard {
  padding: 24rpx;
}

.navPreviewBar {
  display: flex;
  align-items: center;
  height: 86rpx;
  gap: 12rpx;
}

.previewBack {
  flex: 0 0 52rpx;
  font-size: 42rpx;
  color: #c0c6ce;
}

.previewActions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1 auto;
  min-width: 0;
  gap: 10rpx;
}

.previewActionButton {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 58rpx;
  height: 58rpx;
  border-radius: 8rpx;
  background: #f4f5f7;
}

.previewIcon {
  font-size: 37rpx;
}

.previewImage {
  width: 38rpx;
  height: 38rpx;
  object-fit: contain;
}

.keyboardPreviewBar {
  display: flex;
  min-height: 76rpx;
  overflow-x: auto;
  gap: 8rpx;
  -webkit-overflow-scrolling: touch;
}

.keyboardPreviewButton {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 68rpx;
  max-width: 150rpx;
  height: 72rpx;
  padding: 0 14rpx;
  overflow: hidden;
  color: #26313d;
  font-size: 30rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.keyboardPreviewIcon,
.keyboardPreviewElementIcon {
  font-size: 38rpx;
}

.keyboardPreviewQuickText {
  display: block;
  max-width: 120rpx;
  overflow: hidden;
  font-size: 30rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.keyboardPreviewImage {
  width: 38rpx;
  height: 38rpx;
  object-fit: contain;
}

.emptyKeyboardPreview {
  display: flex;
  align-items: center;
  color: #9aa3ad;
  font-size: 28rpx;
}

.sectionMeta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32rpx 32rpx 16rpx;
  color: #6d7682;
  font-size: 28rpx;
}

.countText,
.restoreButton {
  color: #2d83dd;
  font-weight: 700;
}

.restoreButton {
  font-size: 28rpx;
}

.selectedGrid,
.allToolsGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28rpx 18rpx;
  min-height: 260rpx;
  padding: 34rpx 26rpx;
  overflow: visible;
  box-sizing: border-box;
}

.selectedGrid.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.emptySelectedText {
  color: #9aa3ad;
  font-size: 28rpx;
}

.selectedToolItem,
.allToolItem {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  overflow: visible;
}

.selectedToolItem {
  min-height: 158rpx;
  border-radius: 8rpx;
  cursor: grab;
  user-select: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.selectedGrid.sorting .selectedToolItem {
  transition: opacity 0.18s ease, transform 0.18s ease;
  touch-action: none;
}

.selectedToolItem.dragging {
  opacity: 0.26;
  transform: scale(0.92);
  pointer-events: none;
}

.selectedToolItem.dragging .removeButton {
  opacity: 0;
}

.selectedToolItem:active .toolIconBubble {
  transform: scale(0.96);
}

.removeButton,
.addBadge {
  position: absolute;
  right: calc(50% - 54rpx);
  top: -8rpx;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34rpx;
  height: 34rpx;
  border-radius: 999rpx;
  color: #ffffff;
  background: #4f5d6b;
  font-size: 24rpx;
  overflow: visible;
}

.addBadge {
  background: #2d83dd;
}

.allToolItem.added .addBadge {
  background: #94a1ae;
}

.allToolItem.disabled {
  opacity: 0.72;
}

.allToolItem.creator .toolIconBubble {
  color: #2d83dd;
  background: #eef6ff;
}

.allToolItem.creator .toolIcon {
  color: #2d83dd;
}

.toolIconBubble {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  border-radius: 999rpx;
  background: #f5f6f8;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.toolIcon {
  color: #26313d;
  font-size: 48rpx;
  line-height: 1;
}

.quickInputDisplayIcon {
  display: block;
  max-width: 82rpx;
  overflow: hidden;
  color: #26313d;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 104rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quickInputDisplayIcon.iconfont {
  font-size: 52rpx;
  font-weight: 400;
}

.toolImage {
  width: 50rpx;
  height: 50rpx;
  object-fit: contain;
}

.toolLabel {
  max-width: 160rpx;
  margin-top: 14rpx;
  overflow: hidden;
  color: #68727f;
  font-size: 28rpx;
  line-height: 34rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sectionTitle {
  margin: 42rpx 32rpx 16rpx;
  color: #606b78;
  font-size: 28rpx;
}

.allToolsGrid {
  margin-bottom: 50rpx;
}

.dragGhost {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  will-change: transform;
}

.dragGhost .toolIconBubble {
  background: #ffffff;
  box-shadow: 0 20rpx 48rpx rgba(29, 52, 77, 0.24);
  transform: scale(1.08);
}

.dragGhost .toolLabel {
  color: #26313d;
  font-weight: 700;
}

.quickInputDrawer {
  box-sizing: border-box;
  width: 100vw;
  padding: 26rpx 28rpx calc(32rpx + env(safe-area-inset-bottom));
  color: #26313d;
  background: #ffffff;
  border-top-left-radius: 8rpx;
  border-top-right-radius: 8rpx;
}

.drawerHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72rpx;
}

.drawerTitle {
  font-size: 34rpx;
  font-weight: 700;
}

.drawerClose {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  margin-left: auto;
  font-size: 32rpx;
}

.inputTypeSwitch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12rpx;
  margin: 22rpx 0 18rpx;
  padding: 6rpx;
  background: #f1f4f7;
  border-radius: 8rpx;
}

.inputTypeOption {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  color: #68727f;
  border-radius: 6rpx;
  font-size: 28rpx;
  line-height: normal;
  -webkit-tap-highlight-color: transparent;
}

.inputTypeOption.active {
  color: #26313d;
  background: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(45, 72, 103, 0.08);
}

.drawerInput {
  width: 100%;
  height: 76rpx;
  margin-top: 16rpx;
  padding: 0 20rpx;
  color: #26313d;
  background: #f8fafc;
  border: 1rpx solid #dce3eb;
  border-radius: 8rpx;
  box-sizing: border-box;
  font-size: 28rpx;
}

.drawerToggleRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72rpx;
  margin-top: 12rpx;
  color: #4f5b68;
  font-size: 28rpx;
}

.drawerSwitch {
  position: relative;
  width: 84rpx;
  height: 46rpx;
  border-radius: 999rpx;
  background: #d6dde5;
  transition: background 0.16s ease;
}

.drawerSwitch span {
  position: absolute;
  top: 5rpx;
  left: 5rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 999rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 8rpx rgba(37, 54, 71, 0.18);
  transition: transform 0.16s ease;
}

.drawerSwitch.active {
  background: #2d83dd;
}

.drawerSwitch.active span {
  transform: translateX(38rpx);
}

.drawerPrimaryButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 78rpx;
  margin-top: 24rpx;
  color: #ffffff;
  background: #2d83dd;
  border-radius: 8rpx;
  font-size: 30rpx;
  font-weight: 700;
  line-height: normal;
  -webkit-tap-highlight-color: transparent;
}
</style>
