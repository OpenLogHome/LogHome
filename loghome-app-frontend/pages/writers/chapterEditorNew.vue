<template>
  <div
    class="outer"
    :class="[
      writerSettings.theme,
      {
        headerDragging: isHeaderGestureActive,
        headerSettling: isHeaderSettling,
      },
    ]"
    :style="pageStyle"
    @click="closeCollaborationParticipantsTooltip"
    @touchstart="
      documentOnPress = true;
      clearEditorImagesEditButton();
    "
    @touchend="documentOnPress = false"
  >
    <div ref="editorHeader" class="editorHeader">
      <div
        class="customNavBar"
        :class="{
          collaborationTooltipOpen: collaborationParticipantsTooltipVisible,
        }"
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
          <div class="customNavTitle" :style="customNavTitleStyle">
            <div
              v-if="isRealtimeCollaboration && collaborationParticipants.length"
              class="collaborationPresence"
              @click.stop
            >
              <button
                type="button"
                class="collaborationAvatarStack"
                :class="{ active: collaborationParticipantsTooltipVisible }"
                :aria-expanded="String(collaborationParticipantsTooltipVisible)"
                :aria-label="`${collaborationParticipants.length} 位作者正在实时协作`"
                title="查看实时协作作者"
                @click.stop="toggleCollaborationParticipantsTooltip"
              >
                <span
                  v-for="(item, index) in collaborationAvatarStackItems"
                  :key="item.key"
                  class="collaborationAvatarStackItem"
                  :class="{
                    overflow: item.isOverflow,
                    unreadChat: item.hasUnreadChat,
                  }"
                  :style="{
                    marginLeft: index === 0 ? '0' : '-9px',
                    zIndex: item.hasUnreadChat ? 100 + index : index + 1,
                    borderColor: currentTheme.backColor,
                    backgroundColor: item.isOverflow
                      ? currentTheme.statusCapsuleBackground
                      : item.color,
                  }"
                >
                  <UserAvatar
                    v-if="!item.isOverflow"
                    class="collaborationAvatar"
                    :src="item.avatarUrl"
                  />
                  <span v-else class="collaborationAvatarOverflowText">
                    +{{ item.overflowCount }}
                  </span>
                </span>
              </button>

              <transition name="collaborationParticipantsTooltip">
                <div
                  v-if="collaborationParticipantsTooltipVisible"
                  class="collaborationParticipantsTooltip"
                  role="tooltip"
                  @click.stop
                >
                  <div class="collaborationParticipantsTooltipHeader">
                    <span>正在实时协作</span>
                    <span>{{ collaborationParticipants.length }} 人在线</span>
                  </div>
                  <div class="collaborationTooltipBody">
                    <section class="collaborationParticipantsPane">
                      <div class="collaborationPaneTitle">协作者</div>
                      <div class="collaborationParticipantsList">
                        <div
                          v-for="participant in collaborationParticipants"
                          :key="participant.key"
                          class="collaborationParticipantItem"
                        >
                          <div class="collaborationParticipantRow">
                            <span
                              class="collaborationParticipantAvatarWrap"
                              :class="{
                                unreadChat: hasRealtimeChatAvatarAlert(participant.userId),
                              }"
                              :style="{ borderColor: participant.color }"
                            >
                              <UserAvatar
                                class="collaborationParticipantAvatar"
                                :src="participant.avatarUrl"
                              />
                            </span>
                            <span class="collaborationParticipantIdentity">
                              <span class="collaborationParticipantName">
                                {{ participant.name }}
                              </span>
                              <span
                                v-if="participant.isCurrentUser"
                                class="collaborationParticipantSelf"
                              >你</span>
                            </span>
                            <button
                              v-if="participant.isCurrentUser"
                              type="button"
                              class="collaborationParticipantColorButton"
                              :class="{
                                active:
                                  collaborationColorPickerParticipantKey === participant.key,
                              }"
                              :style="{ backgroundColor: participant.color }"
                              aria-label="更改我的光标颜色"
                              title="更改我的光标颜色"
                              @click.stop="toggleCollaborationColorPicker(participant)"
                            ></button>
                            <button
                              v-else
                              type="button"
                              class="collaborationParticipantColorButton collaborationParticipantCursorButton"
                              :class="{ disabled: !participant.hasCursor }"
                              :style="{ backgroundColor: participant.color }"
                              :disabled="!participant.hasCursor"
                              :aria-label="participant.hasCursor ? `定位到 ${participant.name} 的光标` : `${participant.name} 当前没有可定位的光标`"
                              :title="participant.hasCursor ? '定位到协作者光标' : '协作者当前没有可定位的光标'"
                              @click.stop="locateRealtimeParticipantCursor(participant)"
                            ></button>
                          </div>
                          <transition name="collaborationColorPalette">
                            <div
                              v-if="collaborationColorPickerParticipantKey === participant.key"
                              class="collaborationColorPalette"
                            >
                              <div class="collaborationColorPaletteOptions">
                                <button
                                  v-for="colorOption in collaborationColorOptions"
                                  :key="colorOption"
                                  type="button"
                                  class="collaborationColorOption"
                                  :class="{ selected: participant.color === colorOption }"
                                  :style="{ backgroundColor: colorOption }"
                                  :aria-label="`选择颜色 ${colorOption}`"
                                  @click.stop="setCollaborationParticipantColor(
                                    participant,
                                    colorOption
                                  )"
                                >
                                  <i
                                    v-if="participant.color === colorOption"
                                    class="el-icon-check"
                                  ></i>
                                </button>
                              </div>
                              <div class="collaborationColorPaletteHint">
                                你的颜色会同步给所有在线作者
                              </div>
                            </div>
                          </transition>
                        </div>
                      </div>
                    </section>
                    <section class="collaborationChatPane">
                      <div class="collaborationPaneTitle collaborationChatTitle">
                        <span>群聊</span>
                        <span>{{ collaborationChatMessages.length }} 条</span>
                      </div>
                      <div
                        ref="collaborationChatMessages"
                        class="collaborationChatMessages"
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions"
                      >
                        <div
                          v-if="collaborationChatMessages.length === 0"
                          class="collaborationChatEmpty"
                        >
                          暂无消息，和协作者打个招呼吧
                        </div>
                        <div
                          v-for="message in collaborationChatMessages"
                          :key="message.id"
                          class="collaborationChatMessage"
                          :class="{
                            self: isCurrentRealtimeChatMessage(message),
                          }"
                        >
                          <div class="collaborationChatMessageMeta">
                            <span>{{ message.name }}</span>
                            <span>{{ formatRealtimeChatTime(message.sent_at) }}</span>
                          </div>
                          <div
                            class="collaborationChatBubble"
                            :style="{
                              borderColor: message.color,
                            }"
                          >{{ message.content }}</div>
                        </div>
                      </div>
                      <div class="collaborationChatComposer">
                        <textarea
                          v-model="collaborationChatDraft"
                          class="collaborationChatInput"
                          rows="2"
                          maxlength="300"
                          placeholder="发送消息…"
                          aria-label="实时协作群聊消息"
                          @keydown.enter.exact.prevent="sendRealtimeChatMessage"
                        ></textarea>
                        <button
                          type="button"
                          class="collaborationChatSendButton"
                          :disabled="!canSendRealtimeChatMessage()"
                          @click.stop="sendRealtimeChatMessage"
                        >发送</button>
                      </div>
                    </section>
                  </div>
                </div>
              </transition>
            </div>
          </div>
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
        <div
          v-for="capsule in visibleStatusCapsules"
          :key="capsule.id"
          class="statusCapsule"
          :class="capsule.className"
        >
          <template v-if="capsule.id === 'wordCount'">
            {{ textCount }}&nbsp;字 | {{ imageCount }}&nbsp;图
            <!-- <span class="editorRole" v-if="editorRoleText">{{ editorRoleText }}</span> -->
          </template>
          <template v-else-if="capsule.id === 'sync'">
            <complete-icon
              ref="completeIcon"
              class="statusCapsuleIcon syncStatusIcon"
            ></complete-icon>
            {{ saveNotifyText }}
          </template>
          <template v-else-if="capsule.id === 'writingSpeed'">
            <i class="el-icon-odometer statusCapsuleIcon"></i>
            {{ writingSpeed }}&nbsp;字/分钟
          </template>
        </div>
      </div>
    </div>

    <div
      ref="middleBar"
      class="middleBar"
      :class="{ findReplaceOpen: findReplaceVisible }"
      @touchstart="handleEditorAreaTouchStart"
      @touchmove.passive="handleEditorAreaTouchMove"
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
          @touchstart.stop="handleQuickInputToolbarTouchStart($event, item)"
          @touchmove.stop="handleQuickInputToolbarTouchMove($event)"
          @touchend.stop="handleQuickInputToolbarTouchEnd($event, item)"
          @touchcancel.stop="handleQuickInputToolbarTouchCancel"
          @mousedown.stop.prevent="handleQuickInputToolbarMouseDown($event, item)"
          @mouseup.stop="scheduleQuickInputToolbarPreviewHide()"
          @mouseleave="scheduleQuickInputToolbarPreviewHide()"
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
    <div
      ref="quickInputToolbarPreview"
      class="quickInputToolbarPreview"
      :class="[
        writerSettings.theme,
        {
          iconfont: quickInputPreviewIsIcon,
          quickInputToolbarPreviewVisible: quickInputPreviewVisible,
        },
      ]"
      :style="{
        left: `${quickInputPreviewLeft}px`,
        top: `${quickInputPreviewTop}px`,
      }"
      aria-hidden="true"
    >
      {{ quickInputPreviewText }}
    </div>

    <uni-popup ref="setPopup" type="bottom">
      <view class="settingBar">
        <div class="backgroundSettingRow">
          <div class="backgroundSettingLabel">背景</div>
          <ReaderBackgroundPicker
            class="backgroundPicker"
            :theme-options="writerThemeOptions"
            :skins="writerBackgroundSkins"
            :theme-key="writerSettings.theme"
            :skin-key="writerSettings.backgroundSkinKey || ''"
            @select-theme="changeTheme"
            @select-skin="changeBackgroundSkin"
            @select-locked-theme="handleLockedBackgroundOption"
            @select-locked-skin="handleLockedBackgroundOption"
          />
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

    <view
      v-if="findReplaceVisible"
      class="findReplacePanel"
      :class="writerSettings.theme"
      @touchstart.stop
      @touchend.stop
      @click.stop
    >
        <div class="findReplaceCompactRow">
          <div class="findReplaceField queryField">
            <i class="el-icon-search findReplaceFieldIcon"></i>
            <input
              ref="findReplaceQueryInput"
              v-model="findReplaceQuery"
              class="findReplaceInput"
              placeholder="查找"
              confirm-type="next"
              @input="handleFindReplaceQueryInput"
              @keyup.enter="findNextMatch"
            />
            <button
              v-if="findReplaceQuery"
              class="findReplaceClear"
              type="button"
              title="清空查找内容"
              @click="clearFindReplaceQuery"
            >
              <i class="el-icon-circle-close"></i>
            </button>
          </div>
          <span class="findReplaceMatchStatus">{{ findReplaceStatusText }}</span>
          <div class="findReplaceNavigation">
            <button
              class="findReplaceNavButton"
              type="button"
              title="上一个匹配项"
              :disabled="!findReplaceMatches.length"
              @click="findPreviousMatch"
            >
              <i class="el-icon-arrow-up"></i>
            </button>
            <button
              class="findReplaceNavButton"
              type="button"
              title="下一个匹配项"
              :disabled="!findReplaceMatches.length"
              @click="findNextMatch"
            >
              <i class="el-icon-arrow-down"></i>
            </button>
          </div>
          <button class="findReplaceClose" type="button" title="关闭" @click="closeFindReplace">
            <i class="el-icon-close"></i>
          </button>
        </div>
        <div class="findReplaceCompactRow">
          <div class="findReplaceField replaceField">
            <i class="el-icon-edit-outline findReplaceFieldIcon"></i>
            <input
              v-model="findReplaceValue"
              class="findReplaceInput"
              placeholder="替换为（可留空）"
              @keyup.enter="replaceCurrentMatch"
            />
          </div>
          <button
            class="findReplaceActionButton"
            type="button"
            :disabled="!findReplaceMatches.length"
            @click="replaceCurrentMatch"
          >
            替换当前
          </button>
          <button
            class="findReplaceActionButton primary"
            type="button"
            :disabled="!findReplaceMatches.length"
            @click="replaceAllMatches"
          >
            全部替换
          </button>
        </div>
    </view>

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
      v-if="editor && aiAssistanceEnabled"
      :editor="editor"
      :article="article"
      :chapter-id="chapterId"
      :edit-session-id="editSessionId"
      :theme="writerAiTheme"
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
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { TextStyle } from "@tiptap/extension-text-style";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import {
  relativePositionToAbsolutePosition,
  yCursorPluginKey,
  ySyncPluginKey,
} from "y-prosemirror";
import * as Y from "yjs";
import conflictDialog from "../../components/conflictDialog.vue";
import completeIcon from "../../components/completeIcon.vue";
import UserAvatar from "../../components/UserAvatar.vue";
import WriterAiAssistant from "../../components/writer-ai/WriterAiAssistant.vue";
import ReaderBackgroundPicker from "../../components/ReaderBackgroundPicker.vue";
import { getMembershipStatus } from "../../common/membership-api.js";
import { getColorMode, getProjectThemeMode, readPageTheme, rememberPageTheme } from "../../common/page-theme-memory.js";
import { buildReaderUrl, getReaderMode } from "../../common/reader-mode.js";
import { storeReaderPreview } from "../../common/reader-preview.js";
import { readerPreviewParentOrigin, sendReaderPreview } from "../../common/reader-preview-bridge.js";
import { getServerTime } from "../../lib/utils.js";
import { writerArticleDB } from "../../lib/db.js";
import { createTreeExpReporter } from "../../lib/treeExpReporter.js";
import {
  countInsertedCharacters,
  createNovelWritingActivityReporter,
} from "../../lib/writingActivityReporter.js";
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
const COLLABORATION_CURSOR_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const COLLABORATION_USER_COLORS = Object.freeze([
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#d97706",
  "#059669",
  "#0891b2",
]);
const COLLABORATION_CHAT_MESSAGE_MAX_LENGTH = 300;
const COLLABORATION_CHAT_HISTORY_LIMIT = 100;
const COLLABORATION_CHAT_AVATAR_PULSE_DURATION = 2800;

function getCollaborationUserColor(userId) {
  const normalizedId = Math.abs(Number(userId) || 0);
  return COLLABORATION_USER_COLORS[normalizedId % COLLABORATION_USER_COLORS.length];
}

function renderRealtimeCollaborationCursor(user = {}) {
  const color = COLLABORATION_CURSOR_COLOR_PATTERN.test(String(user.color || ""))
    ? String(user.color)
    : "#2563eb";
  const name = String(user.name || "协作者").trim() || "协作者";
  const caret = document.createElement("span");
  caret.className = "collaboration-cursor__caret";
  caret.setAttribute("data-collaborator", name);
  Object.assign(caret.style, {
    display: "inline-block",
    position: "relative",
    zIndex: "20",
    width: "0",
    height: "1.1em",
    boxSizing: "border-box",
    borderLeft: `2px solid ${color}`,
    marginLeft: "-1px",
    marginRight: "-1px",
    verticalAlign: "text-bottom",
    overflow: "visible",
    pointerEvents: "none",
  });

  const label = document.createElement("span");
  label.className = "collaboration-cursor__label";
  label.textContent = name;
  Object.assign(label.style, {
    display: "block",
    position: "absolute",
    zIndex: "21",
    left: "-2px",
    bottom: "calc(100% + 2px)",
    width: "max-content",
    maxWidth: "160px",
    padding: "2px 6px",
    boxSizing: "border-box",
    borderRadius: "5px 5px 5px 0",
    backgroundColor: color,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.16)",
    color: "#fff",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "1.2",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    userSelect: "none",
    pointerEvents: "none",
  });
  caret.appendChild(label);
  return caret;
}

const WRITER_SOLID_THEMES = Object.freeze([
  { key: "white", name: "蛙鸣白", required_membership: "none" },
  { key: "yellow", name: "原木黄", required_membership: "none" },
  { key: "green", name: "草原绿", required_membership: "none" },
  { key: "blue", name: "晴空蓝", required_membership: "none" },
  { key: "purple", name: "末地紫", required_membership: "none" },
  { key: "pink", name: "桃花粉", required_membership: "none" },
  { key: "black", name: "虚空黑", required_membership: "none" },
  { key: "wavechaser", name: "追波", required_membership: "standard" },
  { key: "powderblue", name: "粉蓝", required_membership: "standard" },
  { key: "qingyun", name: "青云", required_membership: "standard" },
  { key: "sunburst", name: "艳阳", required_membership: "standard" },
  { key: "thorncrown", name: "荆棘冠", required_membership: "standard" },
  { key: "chocolate", name: "巧克力", required_membership: "standard" },
]);
const CHAPTER_EDITOR_THEME_MEMORY_KEY = "pageThemeMemory:chapterEditorNew";

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

const FindReplaceHighlightPluginKey = new PluginKey("writerFindReplaceHighlight");

const FindReplaceHighlight = Extension.create({
  name: "writerFindReplaceHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: FindReplaceHighlightPluginKey,
        state: {
          init: () => null,
          apply(transaction, previousMatch) {
            const meta = transaction.getMeta(FindReplaceHighlightPluginKey);
            if (meta !== undefined) {
              const from = Number(meta && meta.from);
              const to = Number(meta && meta.to);
              return Number.isFinite(from) && Number.isFinite(to) && from < to
                ? { from, to }
                : null;
            }
            if (!previousMatch) {
              return null;
            }
            const from = transaction.mapping.map(previousMatch.from, 1);
            const to = transaction.mapping.map(previousMatch.to, -1);
            return from < to ? { from, to } : null;
          },
        },
        props: {
          decorations(state) {
            const match = FindReplaceHighlightPluginKey.getState(state);
            if (!match) {
              return null;
            }
            return DecorationSet.create(state.doc, [
              Decoration.inline(match.from, match.to, {
                class: "writer-find-replace-match",
                "data-find-replace-match": "true",
                style:
                  "background-color: rgba(248, 191, 62, 0.68) !important; box-shadow: inset 0 -2px 0 rgba(137, 87, 19, 0.88) !important; border-radius: 3px;",
              }),
            ]);
          },
        },
      }),
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

const ParagraphIdPluginKey = new PluginKey("writerRealtimeParagraphIds");

function createRealtimeParagraphIdExtension(allocateId, requestMoreIds) {
  return Extension.create({
    name: "writerRealtimeParagraphIds",
    priority: 1100,
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: ParagraphIdPluginKey,
          appendTransaction(transactions, oldState, newState) {
            const shouldInspect = transactions.some(
              (transaction) =>
                transaction.docChanged ||
                transaction.getMeta(ParagraphIdPluginKey)
            );
            if (!shouldInspect) return null;

            const usedIds = new Set();
            const repairs = [];
            newState.doc.descendants((node, pos) => {
              if (node.type.name !== "paragraph") return true;
              const id = Number(node.attrs && node.attrs.legacyId);
              if (Number.isInteger(id) && id > 0 && !usedIds.has(id)) {
                usedIds.add(id);
                return false;
              }

              const replacementId = allocateId(usedIds);
              if (!replacementId) {
                requestMoreIds();
                return false;
              }
              usedIds.add(replacementId);
              repairs.push({ pos, node, id: replacementId });
              return false;
            });

            if (!repairs.length) return null;
            const transaction = newState.tr;
            repairs.forEach(({ pos, node, id }) => {
              transaction.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                legacyId: id,
              });
            });
            transaction.setMeta(ParagraphIdPluginKey, "assigned");
            transaction.setMeta("addToHistory", false);
            return transaction;
          },
        }),
      ];
    },
  });
}

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
  findReplace: {
    id: "findReplace",
    action: "findReplace",
    label: "查找替换",
    iconClass: "el-icon-search",
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
  preview: {
    id: "preview",
    action: "preview",
    label: "阅读预览",
    iconClass: "el-icon-view",
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
    label: "快捷设置",
    iconClass: "el-icon-s-operation",
    alwaysVisible: true,
  },
};

const DEFAULT_NAV_TOOL_IDS = [
  "publish",
  "preview",
  "upload",
  "format",
  "findReplace",
  "undo",
  "redo",
  "writerAi",
  "settings",
  "shortcutSettings",
];

const DEFAULT_NAV_SHORTCUT_TOOL_IDS = [
  "publish",
  "undo",
  "redo",
  "format",
  "writerAi",
];
const DEFAULT_KEYBOARD_SHORTCUT_ITEMS = DEFAULT_QUICK_INPUTS.map((item) => ({
  type: "quickInput",
  id: item.id,
}));
const STATUS_CAPSULE_DEFINITIONS = {
  wordCount: { id: "wordCount", className: "textCount" },
  sync: { id: "sync", className: "saveNotify" },
  writingSpeed: { id: "writingSpeed", className: "writingSpeed" },
};
const DEFAULT_STATUS_CAPSULE_IDS = ["wordCount", "sync"];
const MAX_NAV_SHORTCUTS = DEFAULT_NAV_TOOL_IDS.length;
const NAV_LEFT_RESERVED_WIDTH = 44;
const NAV_TOOLBAR_TRIGGER_WIDTH = 48;
const NAV_SHORTCUT_BUTTON_WIDTH = 40;
const NAV_ACTION_SAFE_GAP = 8;
const COLLABORATION_PRESENCE_RESERVED_WIDTH = 64;
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

const WRITER_SETTINGS_VERSION = 26080101;
const DEFAULT_SETTINGS = {
  version: WRITER_SETTINGS_VERSION,
  showSymbols: true,
  font: "default",
  fontSize: 35,
  openTypeSet: false,
  showFab: false,
  theme: "yellow",
  backgroundSkinKey: "",
  codeMode: false,
  quickInputs: DEFAULT_QUICK_INPUTS,
  navToolIds: DEFAULT_NAV_TOOL_IDS,
  navShortcutToolIds: DEFAULT_NAV_SHORTCUT_TOOL_IDS,
  keyboardShortcutItems: DEFAULT_KEYBOARD_SHORTCUT_ITEMS,
  statusCapsuleIds: DEFAULT_STATUS_CAPSULE_IDS,
};

const DEFAULT_CONTENT = stringifyLegacyContent([{ type: "text", value: "" }]);
const INPUT_SYNC_DELAY_MS = 350;
const EDIT_LOCK_HEARTBEAT_MS = 30 * 1000;
const HEADER_GESTURE_MOVE_THRESHOLD_PX = 12;
const HEADER_DRAG_FOLLOW_TIME_MS = 24;
const HEADER_DRAG_OFFSET_EPSILON = 0.15;
const LOCK_RECONNECT_DELAYS_MS = [2000, 5000, 10000, 20000, 30000];
const DEFINITE_LOCK_CONFLICT_CODES = [
  "lock_taken",
  "lock_conflict",
  "edit_lock_taken",
  "article_edit_lock_taken",
];
const SAVE_NOTIFY_REFRESH_MS = 5 * 1000;
const WRITING_SPEED_REFRESH_MS = 1000;
const WRITING_SPEED_WINDOW_MS = 60 * 1000;
const WRITING_SPEED_MIN_ELAPSED_MS = 10 * 1000;
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

function calculateNavShortcutLimit(viewportWidth, reservedWidth = 0) {
  const width = Number(viewportWidth) || 375;
  const availableWidth =
    width -
    NAV_LEFT_RESERVED_WIDTH -
    NAV_TOOLBAR_TRIGGER_WIDTH -
    NAV_ACTION_SAFE_GAP -
    Math.max(0, Number(reservedWidth) || 0);
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

  return ["publish", ...ids.filter((id) => id !== "publish")];
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

function normalizeStatusCapsuleIds(rawIds) {
  const sourceIds = Array.isArray(rawIds)
    ? rawIds
    : DEFAULT_STATUS_CAPSULE_IDS;
  return sourceIds
    .map((id) => String(id || ""))
    .filter((id, index, ids) => {
      return STATUS_CAPSULE_DEFINITIONS[id] && ids.indexOf(id) === index;
    });
}

function createDefaultWriterSettings() {
  return {
    ...DEFAULT_SETTINGS,
    quickInputs: DEFAULT_QUICK_INPUTS.map(cloneQuickInput),
    navToolIds: DEFAULT_NAV_TOOL_IDS.slice(),
    navShortcutToolIds: DEFAULT_NAV_SHORTCUT_TOOL_IDS.slice(),
    keyboardShortcutItems: DEFAULT_KEYBOARD_SHORTCUT_ITEMS.slice(),
    statusCapsuleIds: DEFAULT_STATUS_CAPSULE_IDS.slice(),
  };
}

function normalizeWriterSettings(rawSettings) {
  const parsedSettings =
    rawSettings && typeof rawSettings === "object" ? rawSettings : {};
  const shouldAddDefaultPublishShortcut =
    Number(parsedSettings.version || 0) < WRITER_SETTINGS_VERSION &&
    Array.isArray(parsedSettings.navShortcutToolIds) &&
    !parsedSettings.navShortcutToolIds.includes("publish");
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
  if (shouldAddDefaultPublishShortcut) {
    mergedSettings.navShortcutToolIds.unshift("publish");
  }
  mergedSettings.keyboardShortcutItems = normalizeKeyboardShortcutItems(
    mergedSettings.keyboardShortcutItems,
    mergedSettings.quickInputs
  );
  mergedSettings.statusCapsuleIds = normalizeStatusCapsuleIds(
    mergedSettings.statusCapsuleIds
  );
  mergedSettings.backgroundSkinKey = String(
    mergedSettings.backgroundSkinKey || ""
  ).slice(0, 64);
  delete mergedSettings.hiddenNavToolIds;
  delete mergedSettings.keyboardToolIds;

  return mergedSettings;
}

export default {
  components: {
    EditorContent,
    conflictDialog,
    completeIcon,
    UserAvatar,
    WriterAiAssistant,
    ReaderBackgroundPicker,
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
      collaborationMode: "legacy_lock",
      collaborationRevision: 0,
      collaborationDocumentName: "",
      collaborationStatus: "disconnected",
      collaborationUnsyncedChanges: 0,
      collaborationProvider: null,
      collaborationPersistence: null,
      collaborationDocument: null,
      collaborationTitle: null,
      collaborationTitleObserver: null,
      collaborationTitleApplying: false,
      collaborationCurrentUser: null,
      collaborationParticipants: [],
      collaborationParticipantsSignature: "",
      collaborationPresenceSnapshotReady: false,
      collaborationPresenceUsersByKey: {},
      collaborationPresenceToastQueue: [],
      collaborationPresenceToastTimer: null,
      collaborationParticipantsTooltipVisible: false,
      collaborationColorPickerParticipantKey: "",
      collaborationColorOverrides: {},
      collaborationChatMessages: [],
      collaborationChatDraft: "",
      collaborationChatUnreadByUser: {},
      collaborationChatPulseByUser: {},
      collaborationChatPulseTimers: {},
      collaborationChatHistoryRequested: false,
      paragraphIdRanges: [],
      paragraphIdRangePromise: null,
      editSessionId: "",
      currentEditLock: null,
      lockState: "idle",
      lockHeartbeatTimer: null,
      lockReconnectTimer: null,
      lockReconnectAttempts: 0,
      lockReconnectInFlight: false,
      writeExpReporter: null,
      novelWritingActivityReporter: null,
      writingActivityLastTitleLength: 0,
      textCount: 0,
      imageCount: 0,
      writingSpeed: 0,
      writingSpeedEvents: [],
      writingSpeedStartedAt: 0,
      writingSpeedLastCharacterTotal: null,
      writingSpeedInterval: undefined,
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
        parentOrigin: "",
      },
      writerSettings: createDefaultWriterSettings(),
      writerBackgroundSkins: [],
      membershipTier: "",
      backgroundSkinsLoaded: false,
      fonts: JSON.parse(JSON.stringify(fontsConfig)),
      fontDownloadState: {},
      runtimeLoadedFonts: {},
      showFontsSelectDrawer: false,
      isAppEnv: false,
      isApplyingEditorDisplayFont: false,
      themes: {
        blue: {
          backColor: "#d9eef6",
          color: "#27566b",
          pageBackColor: "#f4fafc",
          statusCapsuleBackground: "rgba(244, 250, 252, 0.94)",
          statusCapsuleBorder: "rgba(39, 86, 107, 0.16)",
          statusCapsulePrimaryColor: "#356f88",
          statusCapsuleMutedColor: "#64808e",
          statusCapsuleRoleColor: "#356f88",
          statusCapsuleRoleBackground: "rgba(53, 111, 136, 0.1)",
        },
        yellow: {
          backColor: "#f5e7cc",
          color: "#5c4b3b",
          pageBackColor: "#fcf8ef",
          statusCapsuleBackground: "rgba(252, 248, 239, 0.94)",
          statusCapsuleBorder: "rgba(92, 75, 59, 0.14)",
          statusCapsulePrimaryColor: "#9b6e3b",
          statusCapsuleMutedColor: "#867565",
          statusCapsuleRoleColor: "#8a6034",
          statusCapsuleRoleBackground: "rgba(155, 110, 59, 0.11)",
        },
        green: {
          backColor: "#dcebdd",
          color: "#395744",
          pageBackColor: "#f5faf4",
          statusCapsuleBackground: "rgba(245, 250, 244, 0.94)",
          statusCapsuleBorder: "rgba(57, 87, 68, 0.16)",
          statusCapsulePrimaryColor: "#4f7c5b",
          statusCapsuleMutedColor: "#708572",
          statusCapsuleRoleColor: "#477553",
          statusCapsuleRoleBackground: "rgba(71, 117, 83, 0.1)",
        },
        purple: {
          backColor: "#eae1f0",
          color: "#57445f",
          pageBackColor: "#faf7fc",
          statusCapsuleBackground: "rgba(250, 247, 252, 0.94)",
          statusCapsuleBorder: "rgba(87, 68, 95, 0.16)",
          statusCapsulePrimaryColor: "#765983",
          statusCapsuleMutedColor: "#827387",
          statusCapsuleRoleColor: "#6c4f79",
          statusCapsuleRoleBackground: "rgba(108, 79, 121, 0.1)",
        },
        black: {
          backColor: "#2b3038",
          color: "#d9dee7",
          pageBackColor: "#22272e",
          statusCapsuleBackground: "rgba(49, 56, 65, 0.95)",
          statusCapsuleBorder: "rgba(217, 222, 231, 0.2)",
          statusCapsulePrimaryColor: "#e6cda6",
          statusCapsuleMutedColor: "#b5becb",
          statusCapsuleRoleColor: "#efd6ad",
          statusCapsuleRoleBackground: "rgba(239, 214, 173, 0.12)",
        },
        white: {
          backColor: "#f6f6f4",
          color: "#292927",
          pageBackColor: "#fefefc",
          statusCapsuleBackground: "rgba(254, 254, 252, 0.94)",
          statusCapsuleBorder: "rgba(41, 41, 39, 0.13)",
          statusCapsulePrimaryColor: "#3c3c39",
          statusCapsuleMutedColor: "#757571",
          statusCapsuleRoleColor: "#4d4d49",
          statusCapsuleRoleBackground: "rgba(41, 41, 39, 0.08)",
        },
        pink: {
          backColor: "#f2e5ea",
          color: "#664858",
          pageBackColor: "#fbf6f8",
          statusCapsuleBackground: "rgba(251, 246, 248, 0.94)",
          statusCapsuleBorder: "rgba(102, 72, 88, 0.16)",
          statusCapsulePrimaryColor: "#9d6578",
          statusCapsuleMutedColor: "#8a707b",
          statusCapsuleRoleColor: "#8a596b",
          statusCapsuleRoleBackground: "rgba(157, 101, 120, 0.1)",
        },
        wavechaser: {
          backColor: "#f277a5",
          color: "#32101f",
          pageBackColor: "#e84f89",
          statusCapsuleBackground: "rgba(248, 139, 177, 0.94)",
          statusCapsuleBorder: "rgba(50, 16, 31, 0.2)",
          statusCapsulePrimaryColor: "#651b38",
          statusCapsuleMutedColor: "#6b2844",
          statusCapsuleRoleColor: "#651b38",
          statusCapsuleRoleBackground: "rgba(50, 16, 31, 0.1)",
        },
        powderblue: {
          backColor: "#c8eeec",
          color: "#244244",
          pageBackColor: "#ace5e2",
          statusCapsuleBackground: "rgba(221, 247, 245, 0.94)",
          statusCapsuleBorder: "rgba(36, 66, 68, 0.17)",
          statusCapsulePrimaryColor: "#387a7b",
          statusCapsuleMutedColor: "#547477",
          statusCapsuleRoleColor: "#316b6c",
          statusCapsuleRoleBackground: "rgba(49, 107, 108, 0.1)",
        },
        qingyun: {
          backColor: "#3e4a4d",
          color: "#e7eeef",
          pageBackColor: "#313b3e",
          statusCapsuleBackground: "rgba(63, 75, 78, 0.95)",
          statusCapsuleBorder: "rgba(231, 238, 239, 0.2)",
          statusCapsulePrimaryColor: "#d8e7e8",
          statusCapsuleMutedColor: "#b7c6c8",
          statusCapsuleRoleColor: "#e5eeee",
          statusCapsuleRoleBackground: "rgba(231, 238, 239, 0.1)",
        },
        sunburst: {
          backColor: "#ffe16c",
          color: "#493900",
          pageBackColor: "#fcd23c",
          statusCapsuleBackground: "rgba(255, 229, 119, 0.95)",
          statusCapsuleBorder: "rgba(73, 57, 0, 0.18)",
          statusCapsulePrimaryColor: "#745700",
          statusCapsuleMutedColor: "#796a35",
          statusCapsuleRoleColor: "#674d00",
          statusCapsuleRoleBackground: "rgba(73, 57, 0, 0.1)",
        },
        thorncrown: {
          backColor: "#95302e",
          color: "#f6e8e5",
          pageBackColor: "#7d2120",
          statusCapsuleBackground: "rgba(139, 42, 40, 0.96)",
          statusCapsuleBorder: "rgba(246, 232, 229, 0.2)",
          statusCapsulePrimaryColor: "#ffe2d9",
          statusCapsuleMutedColor: "#e6bdb7",
          statusCapsuleRoleColor: "#ffe6df",
          statusCapsuleRoleBackground: "rgba(246, 232, 229, 0.11)",
        },
        chocolate: {
          backColor: "#510b0c",
          color: "#f4e7e1",
          pageBackColor: "#380001",
          statusCapsuleBackground: "rgba(78, 12, 13, 0.96)",
          statusCapsuleBorder: "rgba(244, 231, 225, 0.2)",
          statusCapsulePrimaryColor: "#f5d1bd",
          statusCapsuleMutedColor: "#d7b6a9",
          statusCapsuleRoleColor: "#f8d8c7",
          statusCapsuleRoleBackground: "rgba(244, 231, 225, 0.1)",
        },
        blockepoch: {
          backColor: "#cfd8af",
          color: "#273421",
          pageBackColor: "#dce3c2",
          statusCapsuleBackground: "rgba(226, 233, 202, 0.95)",
          statusCapsuleBorder: "rgba(39, 52, 33, 0.2)",
          statusCapsulePrimaryColor: "#4e7d3c",
          statusCapsuleMutedColor: "#58684d",
          statusCapsuleRoleColor: "#446d35",
          statusCapsuleRoleBackground: "rgba(78, 125, 60, 0.11)",
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
      isHeaderSettling: false,
      headerGestureStartY: 0,
      headerGestureLastY: 0,
      headerGestureMoved: false,
      headerGestureStartedFocused: false,
      headerGestureLastDeltaY: 0,
      appKeyboardVisible: null,
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
      quickInputTouchStartX: 0,
      quickInputTouchStartY: 0,
      quickInputTouchMoved: false,
      quickInputPreviewVisible: false,
      quickInputPreviewText: "",
      quickInputPreviewLeft: 0,
      quickInputPreviewTop: 0,
      quickInputPreviewIsIcon: false,
      quickInputPreviewHideTimer: undefined,
      findReplaceQuery: "",
      findReplaceValue: "",
      findReplaceMatches: [],
      findReplaceIndex: -1,
      findReplaceVisible: false,
    };
  },
  computed: {
    projectThemeMode() {
      return getProjectThemeMode(this.$store);
    },
    writerThemeOptions() {
      return WRITER_SOLID_THEMES.map((theme) => ({
        ...theme,
        backgroundColor: this.themes[theme.key].pageBackColor,
        is_locked: !this.canUseMembershipRequirement(
          theme.required_membership
        ),
      }));
    },
    currentTheme() {
      return this.themes[this.writerSettings.theme] || this.themes.yellow;
    },
    writerAiTheme() {
      const compatibleThemes = {
        pink: "purple",
        wavechaser: "purple",
        powderblue: "blue",
        qingyun: "black",
        sunburst: "yellow",
        thorncrown: "black",
        chocolate: "black",
        blockepoch: "green",
      };
      return compatibleThemes[this.writerSettings.theme] || this.writerSettings.theme;
    },
    currentBackgroundSkin() {
      const selectedKey = String(this.writerSettings.backgroundSkinKey || "");
      if (!selectedKey) {
        return null;
      }
      return (
        this.writerBackgroundSkins.find(
          (skin) => skin.skin_key === selectedKey && !skin.is_locked
        ) || null
      );
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
    isRealtimeCollaboration() {
      return this.collaborationMode === "realtime_crdt";
    },
    customNavTitleStyle() {
      const actionWidth =
        NAV_TOOLBAR_TRIGGER_WIDTH +
        this.navShortcutTools.length * NAV_SHORTCUT_BUTTON_WIDTH +
        NAV_ACTION_SAFE_GAP;
      return {
        right: `${actionWidth}px`,
      };
    },
    collaborationAvatarDisplayLimit() {
      const actionWidth =
        NAV_TOOLBAR_TRIGGER_WIDTH +
        this.navShortcutTools.length * NAV_SHORTCUT_BUTTON_WIDTH;
      const availableWidth = Math.max(
        28,
        Number(this.viewportWidth || 375) -
          NAV_LEFT_RESERVED_WIDTH -
          actionWidth -
          NAV_ACTION_SAFE_GAP * 2
      );
      const avatarSize = 28;
      const visibleStep = 19;
      return Math.max(
        1,
        Math.min(4, Math.floor((availableWidth - avatarSize) / visibleStep) + 1)
      );
    },
    collaborationAvatarStackItems() {
      const participants = this.collaborationParticipants;
      const limit = this.collaborationAvatarDisplayLimit;
      if (participants.length <= limit) {
        return participants.map((participant) => ({
          ...participant,
          isOverflow: false,
          hasUnreadChat: this.hasRealtimeChatAvatarAlert(participant.userId),
        }));
      }
      if (limit <= 1) {
        return [{
          ...participants[0],
          isOverflow: false,
          hasUnreadChat: this.hasRealtimeChatAvatarAlert(participants[0].userId),
        }];
      }
      const visibleParticipants = participants.slice(0, limit - 1).map(
        (participant) => ({
          ...participant,
          isOverflow: false,
          hasUnreadChat: this.hasRealtimeChatAvatarAlert(participant.userId),
        })
      );
      const hiddenParticipants = participants.slice(limit - 1);
      visibleParticipants.push({
        key: `overflow:${participants.length - visibleParticipants.length}`,
        isOverflow: true,
        overflowCount: participants.length - visibleParticipants.length,
        color: this.currentTheme.color,
        hasUnreadChat: hiddenParticipants.some((participant) =>
          this.hasRealtimeChatAvatarAlert(participant.userId)
        ),
      });
      return visibleParticipants;
    },
    collaborationColorOptions() {
      return COLLABORATION_USER_COLORS;
    },
    editorRoleText() {
      if (this.isRealtimeCollaboration) {
        return "实时协作";
      }
      if (this.editorAccess.access_role === "collaborator") {
        return "协作草稿";
      }
      return "";
    },
    visibleStatusCapsules() {
      return normalizeStatusCapsuleIds(this.writerSettings.statusCapsuleIds)
        .map((id) => STATUS_CAPSULE_DEFINITIONS[id])
        .filter(Boolean);
    },
    findReplaceStatusText() {
      if (!this.findReplaceQuery) {
        return "...";
      }
      if (!this.findReplaceMatches.length) {
        return "0/0";
      }
      return `${this.findReplaceIndex + 1} / ${this.findReplaceMatches.length}`;
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
        "--statusCapsuleCounterOffset": `${this.statusCapsuleCounterOffset}px`,
        "--statusCapsuleTopClearance": `${this.statusCapsuleTopClearance}px`,
        "--statusCapsuleBackground": this.currentTheme.statusCapsuleBackground,
        "--statusCapsuleBorder": this.currentTheme.statusCapsuleBorder,
        "--statusCapsulePrimaryColor": this.currentTheme.statusCapsulePrimaryColor,
        "--statusCapsuleMutedColor": this.currentTheme.statusCapsuleMutedColor,
        "--statusCapsuleRoleColor": this.currentTheme.statusCapsuleRoleColor,
        "--statusCapsuleRoleBackground": this.currentTheme.statusCapsuleRoleBackground,
        "--writerThemeBackColor": this.currentTheme.backColor,
        "--writerThemePageColor": this.currentTheme.pageBackColor,
        "--writerThemeTextColor": this.currentTheme.color,
        "--writerThemeBorderColor": this.currentTheme.statusCapsuleBorder,
        "--quickInputBottomInset":
          this.isAppEnv && this.appKeyboardVisible === true
            ? "0px"
            : "var(--loghome-safe-bottom, 0px)",
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
        .filter(item => item && (this.aiAssistanceEnabled || item.action !== 'writerAi'));
    },
    toolbarSettingsItems() {
      return normalizeNavToolIds(this.writerSettings.navToolIds)
        .filter(id => this.aiAssistanceEnabled || id !== 'writerAi').map((id) => ({
        ...TOOL_DEFINITIONS[id],
      }));
    },
    toolbarPanelTools() {
      return this.toolbarSettingsItems;
    },
    navShortcutLimit() {
      return calculateNavShortcutLimit(
        this.viewportWidth,
        this.isRealtimeCollaboration
          ? COLLABORATION_PRESENCE_RESERVED_WIDTH
          : 0
      );
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
    statusCapsuleCounterOffset() {
      return this.getStatusCapsuleCounterOffset(this.headerOffset);
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
      if (this.currentBackgroundSkin) {
        const skin = this.currentBackgroundSkin;
        const imageUrl = this.getSafeBackgroundImageUrl(skin.image_url);
        if (imageUrl) {
          const overlayColor = this.getBackgroundOverlayColor(skin.overlay_color);
          style.backgroundImage = `linear-gradient(${overlayColor}, ${overlayColor}), url("${imageUrl}")`;
          style.backgroundSize = ["obsidian_orbit", "ember_library"].includes(
            skin.skin_key
          )
            ? "100% 100%"
            : `${skin.background_size || "cover"}`;
          style.backgroundPosition = `${skin.background_position || "center"}`;
          style.backgroundRepeat = `${skin.background_repeat || "no-repeat"}`;
          style.backgroundAttachment = "fixed";
        }
      }
      if (this.currentFontFamilyStyleValue) {
        style.fontFamily = this.currentFontFamilyStyleValue;
        style["--editor-font-family"] = this.currentFontFamilyStyleValue;
      }
      return style;
    },
  },
  watch: {
    aiAssistanceEnabled(enabled) {
      if (!enabled) this.aiAssistantOpen = false;
    },
    projectThemeMode(newMode, oldMode) {
      if (newMode === oldMode) return;
      this.applyWriterThemeMode(newMode);
      this.persistWriterSettings();
      this.applyNavigationBarTheme();
    },
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
    writingSpeed() {
      this.$nextTick(() => {
        this.scheduleTitleCapsuleClearanceUpdate();
      });
    },
    "writerSettings.statusCapsuleIds": {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.scheduleTitleCapsuleClearanceUpdate();
        });
      },
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
    this.cancelHeaderOffsetFrame();
    this.cancelHeaderSettleFrame();
    await this.finalizeBeforeLeave();
    clearTimeout(this.inputSyncTimer);
    clearTimeout(this.titleSelectionCaptureTimer);
    clearTimeout(this.titleSelectionRestoreTimer);
    clearTimeout(this.quickInputInsertTimer);
    clearTimeout(this.quickInputPreviewHideTimer);
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
    clearInterval(this.imageEditInterval);
    this.stopSaveNotifyTimer();
    this.stopWritingSpeedTimer();
    this.clearEditorImagesEditButton();
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    window.removeEventListener("message", this.handleParentMessage);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.handlePageHide);
    window.removeEventListener("popstate", this.browserBack);
    window.removeEventListener("loghomeNativeBack", this.handleNativeBack);
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
      const keyboardVisible =
        typeof detail === "boolean"
          ? detail
          : detail && typeof detail.visible === "boolean"
            ? detail.visible
            : null;
      if (keyboardVisible === null) {
        return;
      }

      const wasKeyboardVisible = this.appKeyboardVisible;
      this.appKeyboardVisible = keyboardVisible;
      if (keyboardVisible || wasKeyboardVisible !== true) {
        return;
      }

      const activeElement =
        typeof document !== "undefined" ? document.activeElement : null;
      const titleElementActive = this.isTitleInputElement(activeElement);
      const bodyEditorActive = this.isBodyEditorFocused();

      if (titleElementActive) {
        this.blurTitleInput();
      } else if (bodyEditorActive) {
        this.blurBodyEditor();
      } else if (this.titleInputFocused) {
        this.blurTitleInput();
      } else if (this.editorBodyFocused) {
        this.blurBodyEditor();
      } else {
        this.titleInputFocused = false;
        this.editorBodyFocused = false;
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
          collaboration_mode: this.collaborationMode,
          collaboration_revision: this.collaborationRevision,
          saved_at: Date.now(),
        })
      );

      return true;
    },
    getTokenInfo() {
      const rawToken = window.localStorage.getItem("token");
      if (!rawToken) return null;
      try {
        const token = JSON.parse(rawToken);
        return typeof token === "string" ? { tk: token } : token || null;
      } catch (error) {
        return { tk: rawToken };
      }
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
      } else {
        try {
          const parsed = JSON.parse(raw);
          this.writerSettings = normalizeWriterSettings(parsed);
        } catch (error) {
          this.writerSettings = createDefaultWriterSettings();
        }
      }

      this.rememberCurrentWriterTheme();
      this.applyWriterThemeMode(this.projectThemeMode);
      this.persistWriterSettings();
    },
    getWriterThemeMode(themeKey) {
      const theme = this.themes[themeKey] || this.themes.yellow;
      return getColorMode(theme.pageBackColor || theme.backColor);
    },
    rememberCurrentWriterTheme() {
      if (!this.writerSettings || !this.writerSettings.theme) return;
      rememberPageTheme(
        CHAPTER_EDITOR_THEME_MEMORY_KEY,
        this.getWriterThemeMode(this.writerSettings.theme),
        this.writerSettings
      );
    },
    applyWriterThemeMode(mode) {
      const fallback = {
        theme: mode === "dark" ? "black" : "yellow",
        backgroundSkinKey: "",
      };
      const selection = readPageTheme(
        CHAPTER_EDITOR_THEME_MEMORY_KEY,
        mode,
        fallback
      );
      if (!selection || !this.themes[selection.theme]) return;
      this.writerSettings.theme = selection.theme;
      this.writerSettings.backgroundSkinKey = selection.backgroundSkinKey || "";
    },
    persistWriterSettings() {
      this.writerSettings = normalizeWriterSettings(this.writerSettings);
      window.localStorage.setItem(
        "writerSettings",
        JSON.stringify(this.writerSettings)
      );
      this.rememberCurrentWriterTheme();
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
          this.markWritingActivity();
          this.handleEditorActivationStart(event);
          return false;
        },
        mousemove: (view, event) => {
          this.handleEditorActivationMove(event);
          return false;
        },
        touchstart: (view, event) => {
          this.markWritingActivity();
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
        keydown: () => {
          this.markWritingActivity();
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
    normalizeWriterBackgroundSkin(item) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const skinKey = String(item.skin_key || "").trim();
      const skinName = String(item.skin_name || "").trim();
      const imageUrl = this.getSafeBackgroundImageUrl(item.image_url);
      if (!skinKey || !skinName || !imageUrl) {
        return null;
      }
      const requiredMembership = ["standard", "super"].includes(
        String(item.required_membership || "")
      )
        ? String(item.required_membership)
        : "none";

      return {
        skin_key: skinKey.slice(0, 64),
        skin_name: skinName.slice(0, 64),
        theme_key: this.getSkinThemeKey(item.theme_key),
        image_url: imageUrl,
        overlay_color: this.getBackgroundOverlayColor(item.overlay_color),
        background_size: this.getBackgroundStyleValue(
          item.background_size,
          ["cover", "contain", "auto"],
          "cover"
        ),
        background_position: this.getBackgroundStyleValue(
          item.background_position,
          ["center", "top", "bottom", "left", "right", "top center", "bottom center"],
          "center"
        ),
        background_repeat: this.getBackgroundStyleValue(
          item.background_repeat,
          ["no-repeat", "repeat", "repeat-x", "repeat-y"],
          "no-repeat"
        ),
        required_membership: requiredMembership,
        is_locked: !this.canUseMembershipRequirement(requiredMembership),
      };
    },
    getSkinThemeKey(value) {
      const themeKey = String(value || "").trim();
      return this.themes[themeKey] ? themeKey : "yellow";
    },
    getSafeBackgroundImageUrl(value) {
      const imageUrl = String(value || "").trim();
      if (!/^(https?:\/\/|\/static\/)/i.test(imageUrl)) {
        return "";
      }
      return imageUrl.replace(/["\\\\\n\r\f]/g, (character) => {
        return `\\${character.charCodeAt(0).toString(16)} `;
      });
    },
    getBackgroundStyleValue(value, allowedValues, fallback) {
      const normalized = String(value || "").trim().toLowerCase();
      return allowedValues.includes(normalized) ? normalized : fallback;
    },
    getBackgroundOverlayColor(value) {
      const color = String(value || "").trim();
      return /^(#[0-9a-f]{3,8}|rgba?\([\d\s,.%]+\))$/i.test(color)
        ? color
        : "rgba(255, 255, 255, 0.62)";
    },
    async loadWriterBackgroundSkins() {
      try {
        const membershipPromise = this.hasStoredToken()
          ? getMembershipStatus(this.$baseUrl).catch(() => null)
          : Promise.resolve(null);
        const [res, membershipStatus] = await Promise.all([
          axios.get(this.$baseUrl + "/app/get_writer_background_skins"),
          membershipPromise,
        ]);
        this.membershipTier =
          membershipStatus &&
          membershipStatus.active &&
          membershipStatus.subscription
            ? String(membershipStatus.subscription.membership_type || "")
            : "";

        const currentTheme = WRITER_SOLID_THEMES.find(
          (theme) => theme.key === this.writerSettings.theme
        );
        if (
          currentTheme &&
          !this.canUseMembershipRequirement(currentTheme.required_membership)
        ) {
          this.writerSettings.theme =
            this.projectThemeMode === "dark" ? "black" : "yellow";
          this.writerSettings.backgroundSkinKey = "";
          this.persistWriterSettings();
        }

        if (res.status === 200 && Array.isArray(res.data)) {
          this.writerBackgroundSkins = res.data
            .map((item) => this.normalizeWriterBackgroundSkin(item))
            .filter(Boolean);
          if (this.writerSettings.backgroundSkinKey) {
            if (this.currentBackgroundSkin) {
              this.changeBackgroundSkin(this.currentBackgroundSkin.skin_key);
            } else {
              this.changeBackgroundSkin("");
            }
          }
          return;
        }
      } catch (error) {
        console.warn("loadWriterBackgroundSkins failed", error);
        this.writerBackgroundSkins = [];
      } finally {
        this.backgroundSkinsLoaded = true;
      }
    },
    hasStoredToken() {
      try {
        const rawToken = window.localStorage.getItem("token");
        if (!rawToken) return false;
        let token = rawToken;
        try {
          token = JSON.parse(rawToken);
        } catch (error) {}
        return Boolean(
          token && (typeof token === "string" ? token : token.tk)
        );
      } catch (error) {
        return false;
      }
    },
    canUseMembershipRequirement(requiredMembership = "none") {
      const requirement = String(requiredMembership || "none");
      if (requirement === "none") return true;
      if (requirement === "standard") {
        return (
          this.membershipTier === "standard" || this.membershipTier === "super"
        );
      }
      return requirement === "super" && this.membershipTier === "super";
    },
    handleLockedBackgroundOption(option) {
      const superOnly = option && option.required_membership === "super";
      uni.showModal({
        title: superOnly ? "超级典藏背景" : "原木典藏背景",
        content: superOnly
          ? "这款背景仅限超级原木通行证用户使用。"
          : "这款背景仅限原木通行证或超级原木通行证用户使用。",
        cancelText: "暂不",
        confirmText: "查看通行证",
        success: ({ confirm }) => {
          if (confirm) uni.navigateTo({ url: "/pages/membership/index" });
        },
      });
    },
    changeBackgroundSkin(skinKey) {
      const selectedKey = String(skinKey || "");
      const skin = this.writerBackgroundSkins.find(
        (item) => item.skin_key === selectedKey
      );
      if (skin && skin.is_locked) {
        this.handleLockedBackgroundOption(skin);
        return;
      }
      this.writerSettings.backgroundSkinKey = skin ? skin.skin_key : "";
      if (skin) {
        this.writerSettings.theme = skin.theme_key;
      }
      this.persistWriterSettings();
      this.applyNavigationBarTheme();
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
      this.recordTitleWritingActivity(event);
      this.hasNewInput = true;
      this.lastInputTime = new Date();
      this.contentVersion += 1;
      if (!this.isRealtimeCollaboration) {
        this.markSyncPending();
      }
      this.recordWritingSpeedSample();
      this.scheduleTitleCapsuleClearanceUpdate();
      if (this.isRealtimeCollaboration) {
        this.applyLocalTitleToRealtimeDocument();
        return;
      }
      this.scheduleInputSync();
    },
    handleTitleInputFocus(event) {
      this.markWritingActivity();
      this.titleInputFocused = true;
      this.pendingTitleInsertion = false;
      this.restoreDefaultHeaderLayout();
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
    blurTitleInput() {
      const input = this.getTitleInputElement();
      if (input) {
        this.saveTitleInputSelection(input);
      }

      clearTimeout(this.titleSelectionCaptureTimer);
      this.titleSelectionCaptureTimer = undefined;
      clearTimeout(this.titleSelectionRestoreTimer);
      this.titleSelectionRestoreTimer = undefined;
      this.titleSelectionRestoreUntil = 0;

      if (input && typeof input.blur === "function") {
        input.blur();
      }

      this.titleInputFocused = false;
      this.pendingTitleInsertion = true;
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
      if (this.isRealtimeCollaboration) {
        return;
      }
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
      this.startWritingTimer();
      if (this.loadComplete) {
        if (!this.isRealtimeCollaboration) {
          this.startLocalSaveTimer();
          this.claimEditLock();
        }
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
        if (this.isRealtimeCollaboration) {
          if (this.collaborationProvider) {
            this.collaborationProvider.flushPendingUpdates();
          }
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
          !this.isRealtimeCollaboration &&
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
        if (this.isRealtimeCollaboration) {
          await this.destroyRealtimeCollaboration();
        } else {
          await this.releaseEditLock();
        }
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
      if (this.novelWritingActivityReporter) {
        this.novelWritingActivityReporter.markActive();
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
      if (!this.novelWritingActivityReporter) {
        this.novelWritingActivityReporter = createNovelWritingActivityReporter(
          this,
          {
            getArticleId: () => Number(this.chapterId || 0),
            getSessionId: () => String(this.editSessionId || ""),
            getUserId: () => Number(this.currentUserId || 0),
            activeWindowMs: 45000,
          }
        );
      }
      this.novelWritingActivityReporter.start();
    },
    async stopWritingTimer() {
      await Promise.all([
        this.writeExpReporter ? this.writeExpReporter.stop() : null,
        this.novelWritingActivityReporter
          ? this.novelWritingActivityReporter.stop()
          : null,
      ]);
    },
    resetWritingActivityCharacterTracking() {
      this.writingActivityLastTitleLength = String(
        (this.article && this.article.title) || ""
      ).length;
    },
    recordTitleWritingActivity(event) {
      const eventValue =
        event && event.target && event.target.value !== undefined
          ? event.target.value
          : this.article && this.article.title;
      const currentLength = String(eventValue || "").length;
      const previousLength = Number(this.writingActivityLastTitleLength || 0);
      this.writingActivityLastTitleLength = currentLength;
      const addedCharacters = Math.max(0, currentLength - previousLength);
      if (addedCharacters && this.novelWritingActivityReporter) {
        this.novelWritingActivityReporter.recordWrittenCharacters(
          addedCharacters
        );
      }
    },
    recordEditorWritingActivity(transaction) {
      const addedCharacters = countInsertedCharacters(transaction);
      if (addedCharacters && this.novelWritingActivityReporter) {
        this.novelWritingActivityReporter.recordWrittenCharacters(
          addedCharacters
        );
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
      if (event.source !== window.parent || !readerPreviewParentOrigin(event.origin)) return;
      if (
        event.data.type === "frame_confirmed" &&
        (event.data.target === "chapterEditorNew" ||
          event.data.target === "chapterEditor")
      ) {
        this.frameInfo.isEnabled = true;
        this.frameInfo.parentOrigin = event.origin;
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
    getWritingCharacterTotal() {
      return Math.max(0, Number(this.textCount || 0)) +
        String((this.article && this.article.title) || "").length;
    },
    resetWritingSpeedTracking() {
      this.writingSpeed = 0;
      this.writingSpeedEvents = [];
      this.writingSpeedStartedAt = 0;
      this.writingSpeedLastCharacterTotal = this.getWritingCharacterTotal();
    },
    recordWritingSpeedSample() {
      const currentTotal = this.getWritingCharacterTotal();
      const previousTotal = Number(this.writingSpeedLastCharacterTotal);
      this.writingSpeedLastCharacterTotal = currentTotal;
      if (!Number.isFinite(previousTotal)) {
        return;
      }

      const addedCharacters = Math.max(0, currentTotal - previousTotal);
      if (!addedCharacters) {
        this.refreshWritingSpeed();
        return;
      }

      const now = Date.now();
      if (!this.writingSpeedStartedAt) {
        this.writingSpeedStartedAt = now;
      }
      this.writingSpeedEvents.push({
        timestamp: now,
        count: addedCharacters,
      });
      this.refreshWritingSpeed(now);
    },
    refreshWritingSpeed(now = Date.now()) {
      const cutoff = now - WRITING_SPEED_WINDOW_MS;
      this.writingSpeedEvents = this.writingSpeedEvents.filter(
        (event) => event.timestamp >= cutoff
      );
      if (!this.writingSpeedEvents.length) {
        this.writingSpeed = 0;
        this.writingSpeedStartedAt = 0;
        return;
      }

      const addedCharacters = this.writingSpeedEvents.reduce(
        (total, event) => total + Number(event.count || 0),
        0
      );
      const measurementStart = Math.max(
        Number(this.writingSpeedStartedAt || now),
        cutoff
      );
      const elapsed = Math.min(
        WRITING_SPEED_WINDOW_MS,
        Math.max(WRITING_SPEED_MIN_ELAPSED_MS, now - measurementStart)
      );
      this.writingSpeed = Math.max(
        0,
        Math.round((addedCharacters * 60 * 1000) / elapsed)
      );
    },
    startWritingSpeedTimer() {
      this.stopWritingSpeedTimer();
      this.writingSpeedInterval = setInterval(() => {
        this.refreshWritingSpeed();
      }, WRITING_SPEED_REFRESH_MS);
    },
    stopWritingSpeedTimer() {
      clearInterval(this.writingSpeedInterval);
      this.writingSpeedInterval = undefined;
    },
    applyEditorFontSize(editorInstance = null) {
      const fontSize = this.fontSizeStyleValue;
      const fontFamily = this.currentFontFamilyStyleValue;
      if (!fontSize && !fontFamily) return;
      this.syncEditorRootAttributes(editorInstance);
      if (!this.isRealtimeCollaboration) {
        this.applyEditorDisplayFontMark(editorInstance);
      }

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
    getCollaborationHttpBaseUrl() {
      const override = window.localStorage.getItem("loghomeCollaborationHttpUrl");
      return String(override || this.$readerAiBaseUrl || "").replace(/\/+$/, "");
    },
    getCollaborationWebSocketUrl() {
      const override = window.localStorage.getItem("loghomeCollaborationWsUrl");
      if (override) return String(override).replace(/\/+$/, "");
      if (this.$collaborationWsUrl) {
        return String(this.$collaborationWsUrl).replace(/\/+$/, "");
      }
      return this.getCollaborationHttpBaseUrl()
        .replace(/^http:/, "ws:")
        .replace(/^https:/, "wss:")
        .replace(/:9101$/, ":9102");
    },
    getCollaborationHeaders() {
      return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getAuthToken(),
      };
    },
    getCollaborationColorStorageKey() {
      return `writerRealtimeColors:v1:${Number(this.currentUserId || 0)}:${Number(
        this.chapterId || 0
      )}`;
    },
    loadCollaborationColorPreferences() {
      this.collaborationColorOverrides = {};
      try {
        const rawValue = window.localStorage.getItem(
          this.getCollaborationColorStorageKey()
        );
        if (!rawValue) return;
        const parsed = JSON.parse(rawValue);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
        const colors = {};
        const currentUserId = String(Number(this.currentUserId || 0));
        const normalizedColor = String(parsed[currentUserId] || "");
        if (
          currentUserId !== "0" &&
          COLLABORATION_USER_COLORS.includes(normalizedColor)
        ) {
          colors[currentUserId] = normalizedColor;
        }
        this.collaborationColorOverrides = colors;
      } catch (error) {
        this.collaborationColorOverrides = {};
      }
    },
    persistCollaborationColorPreferences() {
      try {
        window.localStorage.setItem(
          this.getCollaborationColorStorageKey(),
          JSON.stringify(this.collaborationColorOverrides)
        );
      } catch (error) {}
    },
    getCollaborationColorOverride(userId) {
      const normalizedUserId = Number(userId || 0);
      if (
        !normalizedUserId ||
        normalizedUserId !== Number(this.currentUserId || 0)
      ) {
        return "";
      }
      const color = String(
        this.collaborationColorOverrides[String(normalizedUserId)] || ""
      );
      return COLLABORATION_USER_COLORS.includes(color) ? color : "";
    },
    getCollaborationDisplayColor(user = {}, fallbackId = 0) {
      const userId = Number(user.id || user.user_id || fallbackId || 0);
      const override = this.getCollaborationColorOverride(userId);
      if (override) return override;
      const awarenessColor = String(user.color || "");
      if (COLLABORATION_CURSOR_COLOR_PATTERN.test(awarenessColor)) {
        return awarenessColor;
      }
      return getCollaborationUserColor(userId || fallbackId);
    },
    refreshCollaborationCursorDecorations() {
      if (!this.editor || !this.editor.state || !this.editor.view) return;
      const transaction = this.editor.state.tr.setMeta(yCursorPluginKey, {
        awarenessUpdated: true,
      });
      this.editor.view.dispatch(transaction);
    },
    syncCurrentCollaborationColor(color) {
      const currentUser = {
        ...(this.collaborationCurrentUser || {}),
        id: Number(this.currentUserId || 0),
        color,
      };
      this.collaborationCurrentUser = currentUser;
      if (
        this.editor &&
        this.editor.commands &&
        typeof this.editor.commands.updateUser === "function"
      ) {
        this.editor.commands.updateUser(currentUser);
        return;
      }
      const awareness = this.collaborationProvider
        && this.collaborationProvider.awareness;
      if (awareness) {
        awareness.setLocalStateField("user", currentUser);
      }
    },
    toggleCollaborationColorPicker(participant) {
      if (!participant || participant.isCurrentUser !== true) return;
      this.collaborationColorPickerParticipantKey =
        this.collaborationColorPickerParticipantKey === participant.key
          ? ""
          : participant.key;
    },
    setCollaborationParticipantColor(participant, color) {
      const userId = Number(participant && participant.userId || 0);
      const normalizedColor = String(color || "");
      if (
        !userId ||
        participant.isCurrentUser !== true ||
        userId !== Number(this.currentUserId || 0) ||
        !COLLABORATION_USER_COLORS.includes(normalizedColor)
      ) {
        return;
      }
      this.$set(
        this.collaborationColorOverrides,
        String(userId),
        normalizedColor
      );
      this.persistCollaborationColorPreferences();
      this.syncCurrentCollaborationColor(normalizedColor);
      this.refreshRealtimeParticipants();
      this.refreshCollaborationCursorDecorations();
    },
    async loadCurrentCollaborationUser() {
      const fallback = {
        id: Number(this.currentUserId || 0),
        name: this.currentUserId ? `用户${this.currentUserId}` : "协作者",
        avatarUrl: "",
        color: this.getCollaborationDisplayColor({
          id: this.currentUserId,
          color: getCollaborationUserColor(this.currentUserId),
        }),
      };
      try {
        const response = await axios.get(`${this.$baseUrl}/users/userprofile`, {
          headers: this.getCollaborationHeaders(),
        });
        const profile = response.data && typeof response.data === "object"
          ? response.data
          : {};
        return {
          id: Number(profile.user_id || fallback.id),
          name: String(profile.name || fallback.name),
          avatarUrl: String(profile.avatar_url || ""),
          color: this.getCollaborationDisplayColor({
            id: profile.user_id || fallback.id,
            color: getCollaborationUserColor(profile.user_id || fallback.id),
          }),
        };
      } catch (error) {
        return fallback;
      }
    },
    getRealtimeAwarenessStates() {
      const awareness = this.collaborationProvider
        && this.collaborationProvider.awareness;
      if (!awareness || typeof awareness.getStates !== "function") {
        return [];
      }
      return Array.from(awareness.getStates().entries()).map(
        ([clientId, state]) => ({
          clientId,
          ...(state || {}),
        })
      );
    },
    normalizeRealtimeParticipant(state) {
      if (!state || typeof state !== "object") return null;
      const clientId = Number(state.clientId || 0);
      const awareness = this.collaborationProvider
        && this.collaborationProvider.awareness;
      const isLocalClient = Boolean(
        awareness && Number(awareness.clientID) === clientId
      );
      const rawUser = state.user && typeof state.user === "object"
        ? state.user
        : {};
      const rawUserId = Number(rawUser.id || rawUser.user_id || 0);
      const isCurrentUser = isLocalClient || Boolean(
        rawUserId && rawUserId === Number(this.currentUserId || 0)
      );
      const currentUser = isCurrentUser && this.collaborationCurrentUser
        ? this.collaborationCurrentUser
        : {};
      const userId = Number(rawUserId || currentUser.id || 0);
      if (!userId && !isCurrentUser) return null;

      const name = String(
        currentUser.name || rawUser.name || (userId ? `用户${userId}` : "协作者")
      ).trim() || "协作者";
      const avatarUrl = String(
        currentUser.avatarUrl ||
        rawUser.avatarUrl ||
        rawUser.avatar_url ||
        ""
      );
      const rawColor = String(currentUser.color || rawUser.color || "");
      const color = this.getCollaborationDisplayColor(
        {
          id: userId,
          color: rawColor,
        },
        clientId
      );
      const hasCursor = Boolean(
        state.cursor && state.cursor.anchor && state.cursor.head
      );

      return {
        key: userId ? `user:${userId}` : `client:${clientId}`,
        clientId,
        userId,
        name,
        avatarUrl,
        color,
        isCurrentUser,
        hasCursor,
      };
    },
    formatRealtimePresenceParticipantNames(participants) {
      const names = (Array.isArray(participants) ? participants : [])
        .map((participant) => String(participant.name || "协作者").trim())
        .filter(Boolean);
      if (names.length <= 2) return names.join("、");
      return `${names.slice(0, 2).join("、")}等${names.length}人`;
    },
    showNextRealtimePresenceToast() {
      if (
        this.collaborationPresenceToastTimer ||
        !this.collaborationPresenceToastQueue.length
      ) {
        return;
      }
      const title = this.collaborationPresenceToastQueue.shift();
      uni.showToast({
        title,
        icon: "none",
        duration: 2000,
      });
      this.collaborationPresenceToastTimer = setTimeout(() => {
        this.collaborationPresenceToastTimer = null;
        this.showNextRealtimePresenceToast();
      }, 2100);
    },
    enqueueRealtimePresenceToast(title) {
      if (!title) return;
      this.collaborationPresenceToastQueue.push(title);
      this.showNextRealtimePresenceToast();
    },
    resetRealtimePresenceNotifications() {
      if (this.collaborationPresenceToastTimer) {
        clearTimeout(this.collaborationPresenceToastTimer);
      }
      this.collaborationPresenceSnapshotReady = false;
      this.collaborationPresenceUsersByKey = {};
      this.collaborationPresenceToastQueue = [];
      this.collaborationPresenceToastTimer = null;
    },
    trackRealtimeParticipantChanges(participants) {
      const nextUsersByKey = {};
      participants.forEach((participant) => {
        if (!participant || !participant.key) return;
        nextUsersByKey[participant.key] = {
          key: participant.key,
          userId: participant.userId,
          name: participant.name,
          isCurrentUser: participant.isCurrentUser,
        };
      });

      if (!this.collaborationPresenceSnapshotReady) {
        this.collaborationPresenceUsersByKey = nextUsersByKey;
        this.collaborationPresenceSnapshotReady = true;
        return;
      }

      const previousUsersByKey = this.collaborationPresenceUsersByKey;
      const joinedParticipants = Object.keys(nextUsersByKey)
        .filter((key) => !previousUsersByKey[key])
        .map((key) => nextUsersByKey[key])
        .filter((participant) => !participant.isCurrentUser);
      const leftParticipants = Object.keys(previousUsersByKey)
        .filter((key) => !nextUsersByKey[key])
        .map((key) => previousUsersByKey[key])
        .filter((participant) => !participant.isCurrentUser);

      this.collaborationPresenceUsersByKey = nextUsersByKey;
      if (joinedParticipants.length) {
        this.enqueueRealtimePresenceToast(
          `${this.formatRealtimePresenceParticipantNames(joinedParticipants)}加入了实时协作`
        );
      }
      if (leftParticipants.length) {
        this.enqueueRealtimePresenceToast(
          `${this.formatRealtimePresenceParticipantNames(leftParticipants)}退出了实时协作`
        );
      }
    },
    updateRealtimeParticipants(states = null, options = {}) {
      if (
        !this.isRealtimeCollaboration ||
        this.collaborationStatus !== "connected"
      ) {
        this.collaborationParticipants = [];
        this.collaborationParticipantsSignature = "";
        this.collaborationParticipantsTooltipVisible = false;
        this.collaborationColorPickerParticipantKey = "";
        return;
      }

      const sourceStates = Array.isArray(states)
        ? states
        : this.getRealtimeAwarenessStates();
      const participantsByUser = new Map();
      sourceStates.forEach((state) => {
        const participant = this.normalizeRealtimeParticipant(state);
        if (!participant) return;
        const existing = participantsByUser.get(participant.key);
        if (
          !existing ||
          participant.isCurrentUser ||
          (!existing.hasCursor && participant.hasCursor)
        ) {
          participantsByUser.set(participant.key, participant);
        }
      });
      const participants = Array.from(participantsByUser.values()).sort(
        (left, right) => {
          if (left.isCurrentUser !== right.isCurrentUser) {
            return left.isCurrentUser ? -1 : 1;
          }
          return left.name.localeCompare(right.name, "zh-CN");
        }
      );
      if (options.notifyPresenceChanges) {
        this.trackRealtimeParticipantChanges(participants);
      }
      const signature = JSON.stringify(
        participants.map((participant) => [
          participant.key,
          participant.name,
          participant.avatarUrl,
          participant.color,
          participant.isCurrentUser,
          participant.hasCursor,
        ])
      );
      if (signature === this.collaborationParticipantsSignature) return;
      this.collaborationParticipantsSignature = signature;
      this.collaborationParticipants = participants;
      if (
        this.collaborationColorPickerParticipantKey &&
        !participants.some(
          (participant) =>
            participant.key === this.collaborationColorPickerParticipantKey
        )
      ) {
        this.collaborationColorPickerParticipantKey = "";
      }
      if (!participants.length) {
        this.collaborationParticipantsTooltipVisible = false;
      }
    },
    refreshRealtimeParticipants() {
      this.updateRealtimeParticipants(this.getRealtimeAwarenessStates());
    },
    normalizeRealtimeChatMessage(message) {
      if (!message || typeof message !== "object") return null;
      const id = String(message.id || "").trim();
      const userId = Number(message.user_id || 0);
      const content = String(message.content || "").trim();
      if (!id || !userId || !content) return null;
      return {
        id,
        user_id: userId,
        name: String(message.name || `用户${userId}`).trim() || `用户${userId}`,
        avatar_url: String(message.avatar_url || ""),
        color: this.getCollaborationDisplayColor({
          id: userId,
          color: message.color,
        }),
        content: content.slice(0, COLLABORATION_CHAT_MESSAGE_MAX_LENGTH),
        sent_at: String(message.sent_at || new Date().toISOString()),
      };
    },
    mergeRealtimeChatMessages(messages) {
      const messagesById = new Map(
        this.collaborationChatMessages.map((message) => [message.id, message])
      );
      (Array.isArray(messages) ? messages : []).forEach((message) => {
        const normalized = this.normalizeRealtimeChatMessage(message);
        if (normalized) messagesById.set(normalized.id, normalized);
      });
      this.collaborationChatMessages = Array.from(messagesById.values())
        .sort((left, right) => {
          const timeDifference =
            new Date(left.sent_at).getTime() - new Date(right.sent_at).getTime();
          return timeDifference || left.id.localeCompare(right.id);
        })
        .slice(-COLLABORATION_CHAT_HISTORY_LIMIT);
    },
    handleRealtimeChatPayload(payload) {
      let event = null;
      try {
        event = JSON.parse(String(payload || ""));
      } catch (error) {
        return;
      }
      if (!event || typeof event !== "object") return;

      if (event.type === "collaboration_chat_history") {
        this.mergeRealtimeChatMessages(event.messages);
        if (this.collaborationParticipantsTooltipVisible) {
          this.scrollRealtimeChatToBottom();
        }
        return;
      }
      if (event.type !== "collaboration_chat_message") return;

      const message = this.normalizeRealtimeChatMessage(event.message);
      if (!message) return;
      const isNewMessage = !this.collaborationChatMessages.some(
        (existing) => existing.id === message.id
      );
      this.mergeRealtimeChatMessages([message]);
      if (isNewMessage) {
        this.pulseRealtimeChatAvatar(message.user_id);
      }
      if (
        isNewMessage &&
        message.user_id !== Number(this.currentUserId || 0) &&
        !this.collaborationParticipantsTooltipVisible
      ) {
        this.$set(
          this.collaborationChatUnreadByUser,
          String(message.user_id),
          true
        );
      }
      if (this.collaborationParticipantsTooltipVisible) {
        this.scrollRealtimeChatToBottom();
      }
    },
    requestRealtimeChatHistory() {
      if (
        this.collaborationChatHistoryRequested ||
        !this.collaborationProvider ||
        !this.collaborationProvider.synced
      ) {
        return;
      }
      this.collaborationChatHistoryRequested = true;
      try {
        this.collaborationProvider.sendStateless(JSON.stringify({
          type: "collaboration_chat_history_request",
        }));
      } catch (error) {
        this.collaborationChatHistoryRequested = false;
      }
    },
    canSendRealtimeChatMessage() {
      const content = String(this.collaborationChatDraft || "").trim();
      return Boolean(
        content &&
        content.length <= COLLABORATION_CHAT_MESSAGE_MAX_LENGTH &&
        this.collaborationProvider &&
        this.collaborationProvider.synced
      );
    },
    sendRealtimeChatMessage() {
      if (!this.canSendRealtimeChatMessage()) return;
      const content = String(this.collaborationChatDraft || "").trim();
      try {
        this.collaborationProvider.sendStateless(JSON.stringify({
          type: "collaboration_chat_send",
          content,
        }));
        this.collaborationChatDraft = "";
      } catch (error) {}
    },
    isCurrentRealtimeChatMessage(message) {
      return Number(message && message.user_id || 0) ===
        Number(this.currentUserId || 0);
    },
    formatRealtimeChatTime(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
    hasRealtimeChatAvatarAlert(userId) {
      const key = String(Number(userId || 0));
      return Boolean(
        this.collaborationChatUnreadByUser[key] ||
        this.collaborationChatPulseByUser[key]
      );
    },
    pulseRealtimeChatAvatar(userId) {
      const key = String(Number(userId || 0));
      if (key === "0") return;
      if (this.collaborationChatPulseTimers[key]) {
        clearTimeout(this.collaborationChatPulseTimers[key]);
      }
      this.$set(this.collaborationChatPulseByUser, key, true);
      this.$set(
        this.collaborationChatPulseTimers,
        key,
        setTimeout(() => {
          this.$delete(this.collaborationChatPulseByUser, key);
          this.$delete(this.collaborationChatPulseTimers, key);
        }, COLLABORATION_CHAT_AVATAR_PULSE_DURATION)
      );
    },
    clearRealtimeChatUnread() {
      this.collaborationChatUnreadByUser = {};
    },
    clearRealtimeChatAvatarPulses() {
      Object.values(this.collaborationChatPulseTimers).forEach((timer) => {
        clearTimeout(timer);
      });
      this.collaborationChatPulseByUser = {};
      this.collaborationChatPulseTimers = {};
    },
    scrollRealtimeChatToBottom() {
      this.$nextTick(() => {
        const container = this.getDomRef("collaborationChatMessages");
        if (container) container.scrollTop = container.scrollHeight;
      });
    },
    getRealtimeParticipantCursorState(participant) {
      if (!participant || participant.isCurrentUser) return null;
      const participantUserId = Number(participant.userId || 0);
      const participantClientId = Number(participant.clientId || 0);
      return this.getRealtimeAwarenessStates().find((state) => {
        if (!state.cursor || !state.cursor.anchor || !state.cursor.head) {
          return false;
        }
        const rawUser = state.user && typeof state.user === "object"
          ? state.user
          : {};
        const stateUserId = Number(rawUser.id || rawUser.user_id || 0);
        return participantUserId
          ? stateUserId === participantUserId
          : Number(state.clientId || 0) === participantClientId;
      }) || null;
    },
    resolveRealtimeCursorPosition(cursorState) {
      if (!cursorState || !this.editor || !this.collaborationDocument) {
        return null;
      }
      const syncState = ySyncPluginKey.getState(this.editor.state);
      if (
        !syncState ||
        !syncState.type ||
        !syncState.binding ||
        !syncState.binding.mapping
      ) {
        return null;
      }

      try {
        return relativePositionToAbsolutePosition(
          this.collaborationDocument,
          syncState.type,
          Y.createRelativePositionFromJSON(cursorState.cursor.head),
          syncState.binding.mapping
        );
      } catch (error) {
        return null;
      }
    },
    scrollToRealtimeCursorPosition(position) {
      this.closeCollaborationParticipantsTooltip();
      this.$nextTick(() => {
        if (!this.editor || !this.editor.view || !this.editor.state) return;
        const maximum = Math.max(0, this.editor.state.doc.content.size);
        const safePosition = Math.min(maximum, Math.max(0, Number(position)));
        const container = this.getEditorScrollContainer();
        let cursorCoords = null;
        try {
          cursorCoords = this.editor.view.coordsAtPos(safePosition);
        } catch (error) {
          cursorCoords = null;
        }

        if (
          container &&
          cursorCoords &&
          typeof container.getBoundingClientRect === "function"
        ) {
          const visibleRange = this.getEditorVisibleVerticalRange(container);
          const visibleCenterY = (visibleRange.top + visibleRange.bottom) / 2;
          const cursorCenterY = (cursorCoords.top + cursorCoords.bottom) / 2;
          const maximumScrollTop = Math.max(
            0,
            container.scrollHeight - container.clientHeight
          );
          const nextScrollTop = Math.min(
            maximumScrollTop,
            Math.max(0, container.scrollTop + cursorCenterY - visibleCenterY)
          );
          if (typeof container.scrollTo === "function") {
            try {
              container.scrollTo({ top: nextScrollTop, behavior: "smooth" });
            } catch (error) {
              container.scrollTop = nextScrollTop;
            }
          } else {
            container.scrollTop = nextScrollTop;
          }
          return;
        }

        let scrollTarget = null;

        try {
          const domPosition = this.editor.view.domAtPos(safePosition);
          const domNode = domPosition && domPosition.node;
          const element = domNode
            ? domNode.nodeType === 1
              ? domNode
              : domNode.parentElement
            : null;
          scrollTarget = element && element.closest
            ? element.closest("p, img") || element
            : element;
        } catch (error) {
          scrollTarget = null;
        }

        if (scrollTarget && typeof scrollTarget.scrollIntoView === "function") {
          scrollTarget.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      });
    },
    locateRealtimeParticipantCursor(participant) {
      const cursorState = this.getRealtimeParticipantCursorState(participant);
      const position = this.resolveRealtimeCursorPosition(cursorState);
      if (!Number.isFinite(position)) return;
      this.scrollToRealtimeCursorPosition(position);
    },
    toggleCollaborationParticipantsTooltip() {
      if (!this.collaborationParticipants.length) return;
      const nextVisible = !this.collaborationParticipantsTooltipVisible;
      this.collaborationParticipantsTooltipVisible = nextVisible;
      if (nextVisible) {
        this.clearRealtimeChatUnread();
        this.clearRealtimeChatAvatarPulses();
        this.requestRealtimeChatHistory();
        this.scrollRealtimeChatToBottom();
      }
    },
    closeCollaborationParticipantsTooltip() {
      this.collaborationParticipantsTooltipVisible = false;
      this.collaborationColorPickerParticipantKey = "";
    },
    async getRealtimeCollaborationStatus() {
      const response = await axios.get(
        `${this.getCollaborationHttpBaseUrl()}/collaboration/articles/${this.chapterId}/status`,
        { headers: this.getCollaborationHeaders() }
      );
      return response.data && response.data.data ? response.data.data : null;
    },
    allocateRealtimeParagraphId(usedIds = new Set()) {
      while (this.paragraphIdRanges.length > 0) {
        const range = this.paragraphIdRanges[0];
        while (range.next <= range.end && usedIds.has(range.next)) {
          range.next += 1;
        }
        if (range.next <= range.end) {
          const id = range.next;
          range.next += 1;
          return id;
        }
        this.paragraphIdRanges.shift();
      }
      this.reserveRealtimeParagraphIds();
      return null;
    },
    async reserveRealtimeParagraphIds() {
      if (!this.isRealtimeCollaboration) return null;
      if (this.paragraphIdRangePromise) return this.paragraphIdRangePromise;

      this.paragraphIdRangePromise = axios
        .post(
          `${this.getCollaborationHttpBaseUrl()}/collaboration/articles/${this.chapterId}/paragraph-id-range`,
          { size: 256 },
          { headers: this.getCollaborationHeaders() }
        )
        .then((response) => {
          const range = response.data && response.data.data;
          if (range && Number(range.start) > 0 && Number(range.end) >= Number(range.start)) {
            this.paragraphIdRanges.push({
              next: Number(range.start),
              end: Number(range.end),
            });
            if (this.editor) {
              this.editor.view.dispatch(
                this.editor.state.tr.setMeta(ParagraphIdPluginKey, "range-ready")
              );
            }
          }
          return range || null;
        })
        .catch((error) => {
          console.warn("Failed to reserve realtime paragraph ids", error);
          return null;
        })
        .finally(() => {
          this.paragraphIdRangePromise = null;
        });
      return this.paragraphIdRangePromise;
    },
    applyRealtimeTitleFromDocument() {
      if (!this.collaborationTitle) return;
      const nextTitle = this.collaborationTitle.toString();
      if (nextTitle === this.article.title) return;
      this.collaborationTitleApplying = true;
      this.article.title = nextTitle;
      this.$nextTick(() => {
        this.collaborationTitleApplying = false;
        this.scheduleTitleCapsuleClearanceUpdate();
      });
    },
    applyLocalTitleToRealtimeDocument() {
      if (
        !this.collaborationTitle ||
        !this.collaborationDocument ||
        this.collaborationTitleApplying
      ) {
        return;
      }
      const current = this.collaborationTitle.toString();
      const next = String(this.article.title || "");
      if (current === next) return;

      let prefix = 0;
      while (
        prefix < current.length &&
        prefix < next.length &&
        current[prefix] === next[prefix]
      ) {
        prefix += 1;
      }
      let suffix = 0;
      while (
        suffix < current.length - prefix &&
        suffix < next.length - prefix &&
        current[current.length - 1 - suffix] === next[next.length - 1 - suffix]
      ) {
        suffix += 1;
      }

      this.collaborationDocument.transact(() => {
        const deleteLength = current.length - prefix - suffix;
        if (deleteLength > 0) this.collaborationTitle.delete(prefix, deleteLength);
        const inserted = next.slice(prefix, next.length - suffix);
        if (inserted) this.collaborationTitle.insert(prefix, inserted);
      }, "writer-title-input");
    },
    createRealtimeCollaborativeEditor() {
      if (this.editor) this.editor.destroy();
      const paragraphIds = createRealtimeParagraphIdExtension(
        (usedIds) => this.allocateRealtimeParagraphId(usedIds),
        () => this.reserveRealtimeParagraphIds()
      );

      this.editor = new Editor({
        extensions: [
          StarterKit.configure({
            history: false,
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
          Image.configure({ inline: false }),
          NewParagraphSpace,
          paragraphIds,
          FindReplaceHighlight,
          Collaboration.configure({
            document: this.collaborationDocument,
            field: "body",
          }),
          CollaborationCursor.configure({
            provider: this.collaborationProvider,
            user: this.collaborationCurrentUser || {
              id: Number(this.currentUserId || 0),
              name: "协作者",
              avatarUrl: "",
              color: getCollaborationUserColor(this.currentUserId),
            },
            render: (user) => renderRealtimeCollaborationCursor({
              ...user,
              color: this.getCollaborationDisplayColor(user),
            }),
            selectionRender: (user) => {
              const color = this.getCollaborationDisplayColor(user);
              return {
                class: "ProseMirror-yjs-selection collaboration-cursor__selection",
                style: `background-color: ${color}38`,
                "data-user-id": String(user.id || user.user_id || ""),
              };
            },
          }),
        ],
        editorProps: {
          attributes: this.getEditorRootAttributes(),
          handleDOMEvents: this.getEditorDomEventHandlers(),
        },
        onCreate: ({ editor }) => {
          const blocks = docToLegacyBlocks(editor.getJSON());
          this.article.content = stringifyLegacyContent(blocks);
          this.refreshCounts();
          this.$nextTick(() => this.applyEditorFontSize(editor));
        },
        onUpdate: ({ editor, transaction }) => {
          const blocks = docToLegacyBlocks(editor.getJSON());
          this.article.content = stringifyLegacyContent(blocks);
          const isRemoteUpdate = Boolean(transaction.getMeta("y-sync$"));
          if (!isRemoteUpdate) {
            this.hasNewInput = true;
            this.lastInputTime = new Date();
            this.contentVersion += 1;
            this.markWritingActivity();
            this.recordEditorWritingActivity(transaction);
            this.recordWritingSpeedSample();
          }
          this.refreshCounts();
        },
        onFocus: () => {
          this.handleEditorFocusChange(true);
          this.handleEditorActivationEnd();
        },
        onBlur: () => this.handleEditorFocusChange(false),
      });
    },
    async waitForRealtimeInitialSync(timeoutMs = 10000) {
      const provider = this.collaborationProvider;
      const persistence = this.collaborationPersistence;
      const startedAt = Date.now();

      while (
        provider === this.collaborationProvider &&
        persistence === this.collaborationPersistence &&
        (!provider.synced || provider.hasUnsyncedChanges || !persistence.synced)
      ) {
        if (this.collaborationStatus === "authentication_failed") {
          throw new Error("实时协作身份验证失败");
        }
        if (Date.now() - startedAt >= timeoutMs) {
          throw new Error("实时协作文档初始同步超时");
        }
        await new Promise((resolve) => setTimeout(resolve, 25));
      }

      if (
        provider !== this.collaborationProvider ||
        persistence !== this.collaborationPersistence
      ) {
        throw new Error("实时协作文档初始化已取消");
      }
    },
    async setupRealtimeCollaboration(collaborationState = {}) {
      await this.destroyRealtimeCollaboration();
      this.collaborationMode = "realtime_crdt";
      this.collaborationRevision = Number(collaborationState.revision || 0);
      this.collaborationDocumentName =
        collaborationState.document_name || `article:${this.chapterId}:v1`;
      this.collaborationStatus = "connecting";
      this.collaborationChatMessages = [];
      this.collaborationChatDraft = "";
      this.collaborationChatUnreadByUser = {};
      this.clearRealtimeChatAvatarPulses();
      this.collaborationChatHistoryRequested = false;
      this.paragraphIdRanges = [];

      const [, currentCollaborationUser] = await Promise.all([
        this.reserveRealtimeParagraphIds(),
        this.loadCurrentCollaborationUser(),
      ]);
      this.collaborationCurrentUser = currentCollaborationUser;
      const document = new Y.Doc();
      this.collaborationDocument = document;
      this.collaborationPersistence = new IndexeddbPersistence(
        `loghome-collaboration-${this.collaborationDocumentName}`,
        document
      );
      this.collaborationProvider = new HocuspocusProvider({
        url: this.getCollaborationWebSocketUrl(),
        name: this.collaborationDocumentName,
        document,
        token: this.getAuthToken(),
        onStatus: ({ status }) => {
          this.collaborationStatus = status;
          if (status !== "connected") {
            this.collaborationChatHistoryRequested = false;
            this.resetRealtimePresenceNotifications();
          }
          this.refreshRealtimeParticipants();
          this.refreshSaveNotifyText();
        },
        onSynced: ({ state }) => {
          if (state) {
            this.collaborationStatus = "connected";
            this.refreshRealtimeParticipants();
            this.updateSaveNotify(true);
            this.requestRealtimeChatHistory();
          }
        },
        onAwarenessChange: ({ states }) => {
          this.updateRealtimeParticipants(states, {
            notifyPresenceChanges: true,
          });
        },
        onStateless: ({ payload }) => {
          this.handleRealtimeChatPayload(payload);
        },
        onUnsyncedChanges: ({ number }) => {
          this.collaborationUnsyncedChanges = Number(number || 0);
          this.refreshSaveNotifyText();
        },
        onAuthenticationFailed: () => {
          this.collaborationStatus = "authentication_failed";
          this.updateRealtimeParticipants([]);
          this.refreshSaveNotifyText();
        },
      });

      // Do not mount ProseMirror against an empty Y.Doc. The paragraph-id
      // plugin would turn its required default paragraph into a real CRDT
      // change before the server document arrives, accumulating an empty
      // paragraph at either edge on every open.
      try {
        await this.waitForRealtimeInitialSync();
      } catch (error) {
        await this.destroyRealtimeCollaboration();
        throw error;
      }
      this.collaborationTitle = document.getText("title");
      this.collaborationTitleObserver = () => this.applyRealtimeTitleFromDocument();
      this.collaborationTitle.observe(this.collaborationTitleObserver);
      this.createRealtimeCollaborativeEditor();
      this.refreshRealtimeParticipants();
      this.requestRealtimeChatHistory();
      this.applyRealtimeTitleFromDocument();
    },
    async waitForRealtimeProviderSync(timeoutMs = 4000) {
      if (!this.collaborationProvider) return;
      this.collaborationProvider.flushPendingUpdates();
      const startedAt = Date.now();
      while (
        this.collaborationProvider.hasUnsyncedChanges &&
        Date.now() - startedAt < timeoutMs
      ) {
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      if (this.collaborationProvider.hasUnsyncedChanges) {
        throw new Error("实时协作文档尚未完成同步");
      }
    },
    async checkpointRealtimeArticle() {
      await this.waitForRealtimeProviderSync();
      const response = await axios.post(
        `${this.getCollaborationHttpBaseUrl()}/collaboration/articles/${this.chapterId}/checkpoint`,
        {},
        { headers: this.getCollaborationHeaders() }
      );
      const checkpoint = response.data && response.data.data;
      if (checkpoint) {
        this.collaborationRevision = Number(checkpoint.revision || 0);
        if (typeof checkpoint.title === "string") this.article.title = checkpoint.title;
        if (typeof checkpoint.content === "string") this.article.content = checkpoint.content;
        this.refreshCounts();
      }
      return checkpoint;
    },
    async destroyRealtimeCollaboration() {
      if (this.collaborationTitle && this.collaborationTitleObserver) {
        this.collaborationTitle.unobserve(this.collaborationTitleObserver);
      }
      this.collaborationTitleObserver = null;
      this.collaborationTitle = null;
      if (this.collaborationProvider) {
        this.collaborationProvider.flushPendingUpdates();
        this.collaborationProvider.destroy();
      }
      this.collaborationProvider = null;
      if (this.collaborationPersistence) {
        await this.collaborationPersistence.destroy();
      }
      this.collaborationPersistence = null;
      this.collaborationDocument = null;
      this.collaborationUnsyncedChanges = 0;
      this.collaborationCurrentUser = null;
      this.collaborationParticipants = [];
      this.collaborationParticipantsSignature = "";
      this.resetRealtimePresenceNotifications();
      this.collaborationParticipantsTooltipVisible = false;
      this.collaborationColorPickerParticipantKey = "";
      this.collaborationChatMessages = [];
      this.collaborationChatDraft = "";
      this.collaborationChatUnreadByUser = {};
      this.clearRealtimeChatAvatarPulses();
      this.collaborationChatHistoryRequested = false;
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
          FindReplaceHighlight,
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
        onUpdate: ({ editor, transaction }) => {
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
          this.recordEditorWritingActivity(transaction);
          this.refreshCounts();
          this.recordWritingSpeedSample();
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

        let collaborationState =
          res.data && res.data !== "no data" ? res.data.collaboration : null;
        if (!collaborationState || collaborationState.mode === "realtime_crdt") {
          try {
            collaborationState = await this.getRealtimeCollaborationStatus();
          } catch (error) {
            if (collaborationState && collaborationState.mode === "realtime_crdt") {
              throw error;
            }
          }
        }

        if (collaborationState && collaborationState.mode === "realtime_crdt") {
          this.article = this.buildArticle(
            hasCloudContent ? res.data : fallbackReaderArticle || {}
          );
          this.clearSyncState();
          await this.setupRealtimeCollaboration(collaborationState);
          this.refreshCounts();
          this.resetWritingSpeedTracking();
          this.resetWritingActivityCharacterTracking();
          this.loadComplete = true;
          uni.hideLoading();
          this.sendCurrentArticleInfo();
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
        this.resetWritingSpeedTracking();
        this.resetWritingActivityCharacterTracking();
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

      let realtimeCheckpoint = null;
      if (this.isRealtimeCollaboration) {
        try {
          realtimeCheckpoint = await this.checkpointRealtimeArticle();
        } catch (error) {
          uni.showToast({
            title: "实时协作内容尚未同步，请检查网络后重试",
            icon: "none",
            duration: 2500,
          });
          return;
        }
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

        if (this.isRealtimeCollaboration) {
          uni.showToast({
            title: "协作草稿已同步",
            icon: "none",
            duration: 2000,
          });
          setTimeout(() => uni.navigateBack({}), 800);
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
            collab_revision: realtimeCheckpoint
              ? realtimeCheckpoint.revision
              : undefined,
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
        .catch((error) => {
          const msg =
            error &&
            error.response &&
            error.response.data &&
            error.response.data.msg;
          uni.showToast({
            title: msg || "章节上传失败，请重试",
            icon: "none",
            duration: 2500,
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
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
      const touch = event && event.touches && event.touches[0];
      this.quickInputTouchStartX = touch ? touch.clientX : 0;
      this.quickInputTouchStartY = touch ? touch.clientY : 0;
      this.quickInputTouchMoved = false;
      this.showQuickInputToolbarPreview(event, item);
      this.debugTitleSelection("quick-toolbar-touchstart", {
        itemId: item && item.id,
        itemValue: item && item.value,
        isTitleTarget: this.isTitleInputInsertionTarget(),
      });
    },
    handleQuickInputToolbarTouchMove(event) {
      const touch = event && event.touches && event.touches[0];
      if (!touch) return;
      const deltaX = touch.clientX - this.quickInputTouchStartX;
      const deltaY = touch.clientY - this.quickInputTouchStartY;
      if (Math.hypot(deltaX, deltaY) > 14) {
        this.quickInputTouchMoved = true;
        this.hideQuickInputToolbarPreview();
      }
    },
    handleQuickInputToolbarTouchEnd(event, item) {
      if (this.quickInputTouchMoved) {
        this.hideQuickInputToolbarPreview();
        return;
      }
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      this.recordQuickInputTouchHandled(item);
      this.scheduleQuickInputToolbarPreviewHide(180);
      if (this.isTitleInputInsertionTarget()) {
        this.scheduleQuickInputInsertion(item);
        return;
      }
      this.insertQuickInput(item);
    },
    handleQuickInputToolbarTouchCancel() {
      this.quickInputTouchMoved = true;
      this.hideQuickInputToolbarPreview();
    },
    showQuickInputToolbarPreview(event, item) {
      clearTimeout(this.quickInputPreviewHideTimer);
      this.quickInputPreviewHideTimer = undefined;
      const target = event && event.currentTarget;
      const touch =
        (event && event.touches && event.touches[0]) ||
        (event && event.changedTouches && event.changedTouches[0]);
      const viewportWidth =
        (typeof window !== "undefined" && window.innerWidth) ||
        Number(this.viewportWidth) ||
        375;
      const rpxScale = viewportWidth / 750;
      let rawLeft = touch ? Number(touch.clientX) : Number(event && event.clientX);
      let targetTop = touch
        ? Number(touch.clientY) - 40 * rpxScale
        : Number(event && event.clientY) - 40 * rpxScale;
      if (target && typeof target.getBoundingClientRect === "function") {
        const targetRect = target.getBoundingClientRect();
        rawLeft = targetRect.left + targetRect.width / 2;
        targetTop = targetRect.top;
      }
      if (!Number.isFinite(rawLeft)) {
        rawLeft = viewportWidth / 2;
      }
      if (!Number.isFinite(targetTop)) {
        targetTop = 100;
      }
      this.quickInputPreviewLeft = Math.max(46, Math.min(viewportWidth - 46, rawLeft));
      this.quickInputPreviewTop = Math.max(8, targetTop - 82 * rpxScale);
      this.quickInputPreviewText = String(
        (item && (item.icon || item.iconText)) || this.getQuickInputDisplayText(item)
      );
      this.quickInputPreviewIsIcon = !!(item && (item.icon || item.iconText));
      this.quickInputPreviewVisible = true;
      const previewElement = this.$refs.quickInputToolbarPreview;
      if (previewElement && typeof document !== "undefined" && document.body) {
        if (previewElement.parentNode !== document.body) {
          document.body.appendChild(previewElement);
        }
        previewElement.textContent = this.quickInputPreviewText;
        previewElement.style.left = `${this.quickInputPreviewLeft}px`;
        previewElement.style.top = `${this.quickInputPreviewTop}px`;
        previewElement.style.backgroundColor = this.currentTheme.backColor;
        previewElement.style.color = this.currentTheme.color;
        previewElement.classList.toggle("iconfont", this.quickInputPreviewIsIcon);
        previewElement.classList.add("quickInputToolbarPreviewVisible");
      }
    },
    hideQuickInputToolbarPreview() {
      clearTimeout(this.quickInputPreviewHideTimer);
      this.quickInputPreviewHideTimer = undefined;
      this.quickInputPreviewVisible = false;
      const previewElement = this.$refs.quickInputToolbarPreview;
      if (previewElement) {
        previewElement.classList.remove("quickInputToolbarPreviewVisible");
      }
    },
    scheduleQuickInputToolbarPreviewHide(delay = 140) {
      clearTimeout(this.quickInputPreviewHideTimer);
      this.quickInputPreviewHideTimer = setTimeout(() => {
        this.quickInputPreviewHideTimer = undefined;
        this.quickInputPreviewVisible = false;
        const previewElement = this.$refs.quickInputToolbarPreview;
        if (previewElement) {
          previewElement.classList.remove("quickInputToolbarPreviewVisible");
        }
      }, delay);
    },
    handleQuickInputToolbarMouseDown(event, item) {
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
      this.debugTitleSelection("quick-toolbar-mousedown", {
        isTitleTarget: this.isTitleInputInsertionTarget(),
      });
      this.showQuickInputToolbarPreview(event, item);
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
      this.scheduleQuickInputToolbarPreviewHide();
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
      const theme = WRITER_SOLID_THEMES.find(
        (item) => item.key === themeName
      );
      if (!theme) return;
      if (!this.canUseMembershipRequirement(theme.required_membership)) {
        this.handleLockedBackgroundOption(theme);
        return;
      }
      this.writerSettings.theme = themeName;
      this.writerSettings.backgroundSkinKey = "";
      this.persistWriterSettings();
      this.applyNavigationBarTheme();
    },
    openWriterAiAssistant() {
      if (!this.aiAssistanceEnabled) return;
      this.closeFindReplace();
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
    handleNativeBack(event) {
      if (!this.aiAssistantOpen) {
        return;
      }
      event.preventDefault();
      window.history.go(-1);
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
      if (this.isRealtimeCollaboration) {
        if (this.collaborationStatus === "authentication_failed") {
          return "协作登录已失效";
        }
        if (this.collaborationUnsyncedChanges > 0) {
          return "正在实时同步";
        }
        if (this.collaborationStatus === "connected") {
          return "已实时同步";
        }
        return "离线编辑，等待重连";
      }
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
      const iconRef = Array.isArray(this.$refs.completeIcon)
        ? this.$refs.completeIcon[0]
        : this.$refs.completeIcon;
      if (playAnimation && iconRef && typeof iconRef.playAnimation === "function") {
        iconRef.playAnimation();
      }
    },
    getFindReplaceMatches(query = this.findReplaceQuery) {
      if (!this.editor) {
        return [];
      }

      const keyword = String(query || "");
      if (!keyword) {
        return [];
      }

      const matches = [];
      this.editor.state.doc.descendants((node, pos) => {
        if (!node.isText || !node.text) {
          return;
        }

        let searchStart = 0;
        while (searchStart < node.text.length) {
          const offset = node.text.indexOf(keyword, searchStart);
          if (offset === -1) {
            break;
          }
          matches.push({
            from: pos + offset,
            to: pos + offset + keyword.length,
          });
          searchStart = offset + keyword.length;
        }
      });
      return matches;
    },
    refreshFindReplaceMatches(preferredFrom = null) {
      const previousMatch = this.findReplaceMatches[this.findReplaceIndex];
      const matches = this.getFindReplaceMatches();
      this.findReplaceMatches = matches;

      if (!matches.length) {
        this.findReplaceIndex = -1;
        this.setFindReplaceHighlight(null);
        return;
      }

      let nextIndex = previousMatch
        ? matches.findIndex(
            (match) =>
              match.from === previousMatch.from && match.to === previousMatch.to
          )
        : -1;
      if (nextIndex === -1 && Number.isFinite(Number(preferredFrom))) {
        nextIndex = matches.findIndex(
          (match) => match.from >= Number(preferredFrom)
        );
      }
      this.findReplaceIndex = nextIndex === -1 ? 0 : nextIndex;
      this.selectFindReplaceMatch(matches[this.findReplaceIndex]);
    },
    setFindReplaceHighlight(match) {
      if (!this.editor || !this.editor.view) {
        return;
      }
      this.editor.view.dispatch(
        this.editor.state.tr.setMeta(
          FindReplaceHighlightPluginKey,
          match ? { from: match.from, to: match.to } : null
        )
      );
    },
    selectFindReplaceMatch(match) {
      if (!match || !this.editor) {
        return;
      }
      this.setFindReplaceHighlight(match);
      this.editor.commands.setTextSelection({ from: match.from, to: match.to });
      this.$nextTick(() => {
        if (!this.editor || !this.editor.view || !this.editor.view.domAtPos) {
          return;
        }
        const domPosition = this.editor.view.domAtPos(match.from);
        const domNode = domPosition && domPosition.node;
        const element = domNode
          ? domNode.nodeType === 1
            ? domNode
            : domNode.parentElement
          : null;
        const scrollTarget = element && element.closest
          ? element.closest("p") || element
          : element;
        if (scrollTarget && typeof scrollTarget.scrollIntoView === "function") {
          scrollTarget.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      });
    },
    openFindReplace() {
      if (!this.editor) {
        return;
      }
      const selection = this.editor.state.selection;
      const selectedText = selection.empty
        ? ""
        : this.editor.state.doc.textBetween(selection.from, selection.to, "");
      if (!this.findReplaceQuery && selectedText) {
        this.findReplaceQuery = selectedText;
      }
      this.refreshFindReplaceMatches();
      this.findReplaceVisible = true;
      this.$nextTick(() => {
        const input = this.getDomRef("findReplaceQueryInput");
        if (input && typeof input.focus === "function") {
          input.focus();
        }
      });
    },
    closeFindReplace() {
      this.setFindReplaceHighlight(null);
      this.findReplaceVisible = false;
    },
    handleFindReplaceQueryInput() {
      this.$nextTick(() => {
        this.refreshFindReplaceMatches();
      });
    },
    clearFindReplaceQuery() {
      this.findReplaceQuery = "";
      this.refreshFindReplaceMatches();
      this.$nextTick(() => {
        const input = this.getDomRef("findReplaceQueryInput");
        if (input && typeof input.focus === "function") {
          input.focus();
        }
      });
    },
    findPreviousMatch() {
      if (!this.findReplaceMatches.length) {
        return;
      }
      const length = this.findReplaceMatches.length;
      this.findReplaceIndex =
        (this.findReplaceIndex - 1 + length) % length;
      this.selectFindReplaceMatch(this.findReplaceMatches[this.findReplaceIndex]);
    },
    findNextMatch() {
      if (!this.findReplaceMatches.length) {
        return;
      }
      const length = this.findReplaceMatches.length;
      this.findReplaceIndex = (this.findReplaceIndex + 1) % length;
      this.selectFindReplaceMatch(this.findReplaceMatches[this.findReplaceIndex]);
    },
    replaceCurrentMatch() {
      const match = this.findReplaceMatches[this.findReplaceIndex];
      if (!match || !this.editor) {
        return;
      }
      const replacement = String(this.findReplaceValue || "");
      const keyword = String(this.findReplaceQuery || "");
      if (replacement === keyword) {
        uni.showToast({ title: "替换内容相同", icon: "none" });
        return;
      }

      this.editor.view.dispatch(
        this.editor.state.tr.insertText(replacement, match.from, match.to)
      );
      this.refreshFindReplaceMatches(match.from + Math.max(replacement.length, 1));
    },
    replaceAllMatches() {
      if (!this.editor || !this.findReplaceMatches.length) {
        return;
      }
      const keyword = String(this.findReplaceQuery || "");
      const replacement = String(this.findReplaceValue || "");
      if (replacement === keyword) {
        uni.showToast({ title: "替换内容相同", icon: "none" });
        return;
      }

      const matches = this.findReplaceMatches.slice();
      let transaction = this.editor.state.tr;
      for (let index = matches.length - 1; index >= 0; index -= 1) {
        const match = matches[index];
        transaction = transaction.insertText(replacement, match.from, match.to);
      }
      this.editor.view.dispatch(transaction);
      this.refreshFindReplaceMatches();
      uni.showToast({
        title: `已替换${matches.length}处`,
        icon: "none",
      });
    },
    openToolbarPopup() {
      this.closeFindReplace();
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
    async handlePublishAction() {
      if (!this.canPublishArticle) {
        this.save(1, "协作草稿已保存");
        return;
      }

      if (this.isRealtimeCollaboration) {
        try {
          await this.checkpointRealtimeArticle();
        } catch (error) {
          uni.showToast({
            title: "实时协作内容尚未同步，请稍后重试",
            icon: "none",
            duration: 2500,
          });
          return;
        }
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
    openReaderPreview() {
      if (!this.editor) {
        uni.showToast({
          title: "编辑器尚未准备好",
          icon: "none",
        });
        return;
      }

      const articleId = Number(this.article.article_id || this.chapterId || 0);
      const novelInfo = this.article.novel_info || {};
      const novelId = Number(novelInfo.novel_id || this.article.novel_id || 0);
      const content = stringifyLegacyContent(
        docToLegacyBlocks(this.editor.getJSON())
      );
      const previewArticle = {
        ...this.article,
        article_id: articleId,
        novel_id: novelId,
        title: String(this.article.title || "未命名章节"),
        article_type: this.article.article_type || "richtext",
        article_chapter: Number(this.article.article_chapter || 1),
        is_draft: 1,
        content,
      };
      const previewNovel = {
        ...novelInfo,
        novel_id: novelId,
        name: novelInfo.name || novelInfo.title || "作品预览",
      };

      try {
        if (this.frameInfo.isEnabled && sendReaderPreview(window.parent, window, this.frameInfo.parentOrigin, { article: previewArticle, novel: previewNovel })) {
          this.closeFindReplace();
          this.closeToolbarPopup();
          return;
        }
        const previewKey = storeReaderPreview({
          article: previewArticle,
          novel: previewNovel,
        });
        this.closeFindReplace();
        this.closeToolbarPopup();
        uni.navigateTo({
          url: buildReaderUrl(getReaderMode(), {
            articleId,
            novelId,
            previewKey,
          }),
        });
      } catch (error) {
        console.error("store reader preview failed", error);
        uni.showToast({
          title: "生成阅读预览失败",
          icon: "none",
        });
      }
    },
    getDomRef(name) {
      const ref = this.$refs ? this.$refs[name] : null;
      return Array.isArray(ref) ? ref[0] : ref;
    },
    getHeaderOffsetTransform(offset) {
      const normalizedOffset = this.clampHeaderOffset(offset);
      return `translate3d(0, -${normalizedOffset}px, 0)`;
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
    getStatusCapsuleCounterOffset(offset) {
      const normalizedOffset = this.clampHeaderOffset(offset);
      return Math.max(
        0,
        normalizedOffset - Number(this.navBarHeight || 0)
      );
    },
    setHeaderOffsetStyle(target, offset, includeLayout = false) {
      if (!target || !target.style) {
        return;
      }

      const normalizedOffset = this.normalizeHeaderOffsetForFocus(offset);
      const value = `${normalizedOffset}px`;
      target.style.setProperty("--headerVisualOffset", value);
      target.style.setProperty(
        "--statusCapsuleLift",
        `${this.getStatusCapsuleLift(normalizedOffset)}px`
      );
      target.style.setProperty(
        "--statusCapsuleCounterOffset",
        `${this.getStatusCapsuleCounterOffset(normalizedOffset)}px`
      );
      if (includeLayout) {
        target.style.setProperty("--headerLayoutOffset", value);
      }
    },
    applyHeaderVisualOffsetStyle(offset) {
      const normalizedOffset = this.normalizeHeaderOffsetForFocus(offset);
      const editorHeader = this.getDomRef("editorHeader");
      const middleBar = this.getDomRef("middleBar");
      const pageRoot = this.$el;

      if (editorHeader && editorHeader.style) {
        editorHeader.style.transform = this.getHeaderOffsetTransform(normalizedOffset);
        editorHeader.style.setProperty(
          "--statusCapsuleLift",
          `${this.getStatusCapsuleLift(normalizedOffset)}px`
        );
        editorHeader.style.setProperty(
          "--statusCapsuleCounterOffset",
          `${this.getStatusCapsuleCounterOffset(normalizedOffset)}px`
        );
      }

      if (middleBar && middleBar.style) {
        middleBar.style.transform = this.getHeaderOffsetTransform(normalizedOffset);
        middleBar.style.setProperty(
          "--statusCapsuleCounterOffset",
          `${this.getStatusCapsuleCounterOffset(normalizedOffset)}px`
        );
      }

      if ((!editorHeader || !middleBar) && pageRoot && pageRoot.style) {
        const value = `${normalizedOffset}px`;
        pageRoot.style.setProperty("--headerVisualOffset", value);
        pageRoot.style.setProperty(
          "--statusCapsuleLift",
          `${this.getStatusCapsuleLift(normalizedOffset)}px`
        );
        pageRoot.style.setProperty(
          "--statusCapsuleCounterOffset",
          `${this.getStatusCapsuleCounterOffset(normalizedOffset)}px`
        );
      }
      this._headerRenderedOffset = normalizedOffset;
      return normalizedOffset;
    },
    stageHeaderVisualOffsetStyle(offset) {
      this.cancelHeaderOffsetFrame();
      const normalizedOffset = this.normalizeHeaderOffsetForFocus(offset);
      const editorHeader = this.getDomRef("editorHeader");
      const middleBar = this.getDomRef("middleBar");

      // Preserve the exact dragged position while Vue removes headerDragging.
      // Layout height intentionally stays at the last committed endpoint.
      this.setHeaderOffsetStyle(editorHeader, normalizedOffset);
      this.setHeaderOffsetStyle(middleBar, normalizedOffset);
      this.clearHeaderDragInlineStyles();
      this._headerRenderedOffset = normalizedOffset;
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
      const normalizedOffset = this.normalizeHeaderOffsetForFocus(offset);
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
        pageRoot.style.setProperty(
          "--statusCapsuleCounterOffset",
          `${this.getStatusCapsuleCounterOffset(normalizedOffset)}px`
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
      this._headerOffsetFrameTime = 0;
    },
    cancelHeaderSettleFrame() {
      if (
        this._headerSettleRaf &&
        typeof window !== "undefined" &&
        typeof window.cancelAnimationFrame === "function"
      ) {
        window.cancelAnimationFrame(this._headerSettleRaf);
      }
      clearTimeout(this._headerSettleEffectTimer);
      this._headerSettleRaf = 0;
      this._headerSettleToken = Number(this._headerSettleToken || 0) + 1;
      this.isHeaderSettling = false;
    },
    scheduleHeaderOffsetStyle(offset) {
      this._pendingHeaderOffset = this.normalizeHeaderOffsetForFocus(offset);
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
      this._headerOffsetRaf = window.requestAnimationFrame((timestamp) => {
        this.runHeaderOffsetFrame(timestamp);
      });
    },
    runHeaderOffsetFrame(timestamp) {
      this._headerOffsetRaf = 0;
      const targetOffset = this.normalizeHeaderOffsetForFocus(
        this._pendingHeaderOffset
      );
      const currentOffset = this.normalizeHeaderOffsetForFocus(
        this._headerRenderedOffset === undefined
          ? this.headerOffset
          : this._headerRenderedOffset
      );
      const previousTimestamp = Number(this._headerOffsetFrameTime || 0);
      const frameDuration = previousTimestamp
        ? Math.min(50, Math.max(1, Number(timestamp || 0) - previousTimestamp))
        : 1000 / 60;
      this._headerOffsetFrameTime = Number(timestamp || 0);

      const followRatio = 1 - Math.exp(
        -frameDuration / HEADER_DRAG_FOLLOW_TIME_MS
      );
      let nextOffset =
        currentOffset + (targetOffset - currentOffset) * followRatio;
      if (Math.abs(targetOffset - nextOffset) <= HEADER_DRAG_OFFSET_EPSILON) {
        nextOffset = targetOffset;
      }
      this.applyHeaderVisualOffsetStyle(nextOffset);

      if (
        this.isHeaderGestureActive &&
        Math.abs(targetOffset - nextOffset) > HEADER_DRAG_OFFSET_EPSILON
      ) {
        this._headerOffsetRaf = window.requestAnimationFrame((nextTimestamp) => {
          this.runHeaderOffsetFrame(nextTimestamp);
        });
      } else {
        this._headerOffsetFrameTime = 0;
      }
    },
    commitHeaderOffset(offset) {
      this.cancelHeaderOffsetFrame();
      const normalizedOffset = this.applyCommittedHeaderOffsetStyle(offset);
      this.headerOffset = normalizedOffset;
      this._headerGestureVisualOffset = normalizedOffset;
      this._headerRenderedOffset = normalizedOffset;
      this._pendingHeaderOffset = normalizedOffset;
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
    isEditorInputFocused() {
      return !!(
        this.editorBodyFocused ||
        this.titleInputFocused ||
        this.isBodyEditorFocused()
      );
    },
    normalizeHeaderOffsetForFocus(value = this.headerOffset) {
      if (this.isEditorInputFocused()) {
        return 0;
      }
      return this.clampHeaderOffset(value);
    },
    restoreDefaultHeaderLayout() {
      this.cancelHeaderSettleFrame();
      this.isHeaderGestureActive = false;
      this.commitHeaderOffset(0);
    },
    getSettledHeaderOffset(offset = this.headerOffset) {
      const normalizedOffset = this.clampHeaderOffset(offset);
      const lastDeltaY = Number(this._headerGestureLastDeltaY || 0);
      const directionThreshold = 1;

      if (Math.abs(lastDeltaY) > directionThreshold) {
        return lastDeltaY < 0 ? this.maxHeaderOffset : 0;
      }

      return normalizedOffset >= this.maxHeaderOffset / 2
        ? this.maxHeaderOffset
        : 0;
    },
    settleHeaderLayoutAfterGesture(offset = this.headerOffset) {
      if (this.isEditorInputFocused()) {
        this.restoreDefaultHeaderLayout();
        return;
      }
      this.cancelHeaderSettleFrame();
      const settleToken = this._headerSettleToken;
      const currentOffset = this.stageHeaderVisualOffsetStyle(offset);
      const targetOffset = this.getSettledHeaderOffset(currentOffset);

      this.isHeaderGestureActive = false;
      if (targetOffset === currentOffset) {
        this.commitHeaderOffset(targetOffset);
        return;
      }
      this.isHeaderSettling = true;

      // Let Vue remove the drag-only `transition: none` class and paint the
      // current position before changing the endpoint.
      this.$nextTick(() => {
        if (settleToken !== this._headerSettleToken) {
          return;
        }
        if (
          typeof window === "undefined" ||
          typeof window.requestAnimationFrame !== "function"
        ) {
          this.commitHeaderOffset(targetOffset);
          return;
        }
        this._headerSettleRaf = window.requestAnimationFrame(() => {
          if (settleToken !== this._headerSettleToken) {
            return;
          }
          this._headerSettleRaf = window.requestAnimationFrame(() => {
            this._headerSettleRaf = 0;
            if (settleToken !== this._headerSettleToken) {
              return;
            }
            this.commitHeaderOffset(targetOffset);
            this._headerSettleEffectTimer = setTimeout(() => {
              if (settleToken === this._headerSettleToken) {
                this.isHeaderSettling = false;
              }
            }, 220);
          });
        });
      });
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
        // A tap that focuses the editor must no longer be treated as a
        // header-collapse gesture when the matching touchend arrives.
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
      this.cancelHeaderSettleFrame();
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
      this._pendingHeaderOffset = this.headerOffset;
      this._headerRenderedOffset = this.headerOffset;
      this._headerOffsetFrameTime = 0;
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
      if (
        Math.abs(clientY - Number(this._headerGestureStartY || clientY)) >
        HEADER_GESTURE_MOVE_THRESHOLD_PX
      ) {
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
        this.scheduleHeaderOffsetStyle(nextOffset);
        this._headerGestureLastDeltaY = deltaY;
      }
      this._headerGestureLastY = clientY;
    },
    handleEditorAreaTouchEnd() {
      if (!this.isHeaderGestureActive) {
        this.headerGestureStartedFocused = false;
        this._headerGestureLastDeltaY = 0;
        this._headerGestureMoved = false;
        return;
      }

      const shouldKeepCollapsed =
        this._headerGestureMoved && !this.headerGestureStartedFocused;
      const currentOffset = this.clampHeaderOffset(
        this._headerRenderedOffset === undefined
          ? this.headerOffset
          : this._headerRenderedOffset
      );
      if (this.isBodyEditorFocused()) {
        if (shouldKeepCollapsed) {
          this.blurBodyEditor();
          this.settleHeaderLayoutAfterGesture(currentOffset);
        } else {
          this.restoreDefaultHeaderLayout();
        }
      } else if (this._headerGestureMoved) {
        this.settleHeaderLayoutAfterGesture(currentOffset);
      } else {
        this.isHeaderGestureActive = false;
        this.commitHeaderOffset(currentOffset);
      }
      this.headerGestureStartedFocused = false;
      this._headerGestureLastDeltaY = 0;
      this._headerGestureMoved = false;
    },
    updateCustomNavigationMetrics() {
      let statusBarHeight = Number(
        typeof window !== "undefined" && window.jsBridge
          ? window.jsBridge.statusBarHeight
          : 0
      ) || 0;
      this.viewportWidth = getViewportWidth();
      try {
        if (!statusBarHeight && typeof uni !== "undefined" && typeof uni.getSystemInfoSync === "function") {
          const systemInfo = uni.getSystemInfoSync();
          statusBarHeight = Number(systemInfo.statusBarHeight) || 0;
        } else if (!statusBarHeight &&
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
        this.closeFindReplace();
        if (this.$refs.setPopup) {
          this.$refs.setPopup.open("bottom");
        }
        return;
      }

      if (action === "findReplace") {
        this.openFindReplace();
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
        return;
      }

      if (action === "preview") {
        this.openReaderPreview();
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
    this.loadCollaborationColorPreferences();
    this.editSessionId = this.generateEditSessionId();
    this.publishHandoffActive = false;
    this.leaveFinalized = false;
    this.initializeWriterSettings();
    this.resetWritingSpeedTracking();
    this.startWritingSpeedTimer();
    await Promise.all([
      this.initWriterFonts(),
      this.loadWriterBackgroundSkins(),
    ]);
    this.setupAppKeyboardListener();
    this.startSaveNotifyTimer();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.handlePageHide);
    window.addEventListener("pagehide", this.handlePageHide);
    window.removeEventListener("popstate", this.browserBack);
    window.addEventListener("popstate", this.browserBack);
    window.removeEventListener("loghomeNativeBack", this.handleNativeBack);
    window.addEventListener("loghomeNativeBack", this.handleNativeBack);
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
    this.stopWritingSpeedTimer();
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
    this.stopWritingSpeedTimer();
    await this.pauseForBackground();
  },
  async onShow() {
    this.syncAppEnvironment();
    this.setupAppKeyboardListener();
    this.initializeWriterSettings();
    if (this.backgroundSkinsLoaded) {
      await this.loadWriterBackgroundSkins();
    }
    this.startWritingSpeedTimer();
    if (this.shouldSuppressEditorSyncForCompletedPublish()) {
      return;
    }
    this.publishHandoffActive = false;
    this.startSaveNotifyTimer();
    this.startWritingTimer();
    if (this.isRealtimeCollaboration) {
      if (this.collaborationProvider) {
        this.collaborationProvider.connect();
      }
    } else {
      this.startLocalSaveTimer();
    }
    this.checkFrameEnvironment();
    if (this.loadComplete && !this.isRealtimeCollaboration) {
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
    transform: translate3d(0, calc(0px - var(--headerVisualOffset)), 0);
    transition: transform 0.18s ease-out;
    backface-visibility: hidden;
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

    &.collaborationTooltipOpen {
      z-index: 340;
    }
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
    z-index: 3;
    pointer-events: none;
  }

  .collaborationPresence {
    position: absolute;
    left: 4px;
    top: 0;
    display: flex;
    align-items: center;
    height: 44px;
    pointer-events: auto;
  }

  .collaborationAvatarStack {
    display: inline-flex;
    align-items: center;
    height: 36px;
    min-height: 0;
    margin: 0;
    padding: 0 4px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    box-sizing: border-box;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.16s ease;
    -webkit-tap-highlight-color: transparent;

    &::after {
      border: 0;
    }

    &.active,
    &:active {
      background-color: var(--statusCapsuleRoleBackground);
    }
  }

  .collaborationAvatarStackItem {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 28px;
    width: 28px;
    height: 28px;
    overflow: visible;
    border: 2px solid;
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);

    &.overflow {
      color: var(--statusCapsulePrimaryColor);
      backdrop-filter: blur(8px);
    }
  }

  .collaborationAvatar,
  .collaborationParticipantAvatar {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 50%;
  }

  .collaborationAvatarOverflowText {
    display: block;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  }

  .collaborationParticipantsTooltip {
    position: absolute;
    left: -40px;
    top: calc(100% + 6px);
    display: flex;
    flex-direction: column;
    width: calc(100vw - 16px);
    max-width: none;
    height: 50vh;
    max-height: 50vh;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--statusCapsuleBorder);
    border-radius: 12px;
    background: var(--statusCapsuleBackground);
    box-sizing: border-box;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
    color: var(--writerThemeTextColor);
    backdrop-filter: blur(14px);
    transform-origin: 40px 0;
  }

  .collaborationParticipantsTooltip::before {
    content: "";
    position: absolute;
    left: 34px;
    top: -6px;
    width: 10px;
    height: 10px;
    border-top: 1px solid var(--statusCapsuleBorder);
    border-left: 1px solid var(--statusCapsuleBorder);
    background: var(--statusCapsuleBackground);
    transform: rotate(45deg);
  }

  .collaborationParticipantsTooltipHeader {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex: 0 0 auto;
    padding: 10px 12px 8px;
    border-bottom: 1px solid var(--statusCapsuleBorder);
    font-size: 12px;
    font-weight: 600;

    span:last-child {
      color: var(--statusCapsuleMutedColor);
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  .collaborationTooltipBody {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
  }

  .collaborationParticipantsPane,
  .collaborationChatPane {
    display: flex;
    flex-direction: column;
    flex: 0 0 50%;
    width: 50%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
  }

  .collaborationParticipantsPane {
    border-right: 1px solid var(--statusCapsuleBorder);
  }

  .collaborationPaneTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 0 0 31px;
    min-height: 31px;
    padding: 0 10px;
    border-bottom: 1px solid var(--statusCapsuleBorder);
    box-sizing: border-box;
    color: var(--statusCapsuleMutedColor);
    font-size: 11px;
    font-weight: 600;
  }

  .collaborationChatTitle span:last-child {
    font-size: 10px;
    font-weight: 500;
  }

  .collaborationParticipantsList {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 4px 8px 8px;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }

  .collaborationParticipantItem {
    border-radius: 8px;
    transition: background-color 0.15s ease;
  }

  .collaborationParticipantRow {
    display: flex;
    align-items: center;
    min-width: 0;
    min-height: 38px;
    padding: 4px 2px;
    box-sizing: border-box;
  }

  .collaborationParticipantAvatarWrap {
    position: relative;
    display: block;
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    overflow: visible;
    border: 2px solid;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .collaborationParticipantIdentity {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    margin-left: 9px;
  }

  .collaborationParticipantName {
    overflow: hidden;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .collaborationParticipantSelf {
    flex: 0 0 auto;
    margin-left: 6px;
    padding: 1px 5px;
    border-radius: 999px;
    color: var(--statusCapsuleRoleColor);
    background: var(--statusCapsuleRoleBackground);
    font-size: 10px;
    line-height: 1.4;
  }

  .collaborationParticipantColorButton {
    position: relative;
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
    margin-left: auto;
    padding: 0;
    border: 3px solid var(--statusCapsuleBackground);
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: 0 0 0 1px var(--statusCapsuleBorder);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    -webkit-tap-highlight-color: transparent;

    &::after {
      border: 0;
    }

    &.active {
      transform: scale(1.12);
      box-shadow:
        0 0 0 1px var(--statusCapsuleBorder),
        0 0 0 4px var(--statusCapsuleRoleBackground);
    }
  }

  .collaborationParticipantCursorButton {
    &:active:not(:disabled) {
      transform: scale(0.9);
    }

    &.disabled,
    &:disabled {
      opacity: 0.42;
      cursor: default;
      filter: saturate(0.65);
    }
  }

  .collaborationAvatarStackItem.unreadChat,
  .collaborationParticipantAvatarWrap.unreadChat {
    &::after {
      content: "";
      position: absolute;
      z-index: 4;
      left: -5px;
      top: -5px;
      right: -5px;
      bottom: -5px;
      border: 3px solid #22c55e;
      border-radius: 50%;
      box-sizing: border-box;
      pointer-events: none;
      animation: collaborationUnreadAvatarPulse 0.9s ease-in-out infinite;
    }
  }

  .collaborationChatMessages {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 8px;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }

  .collaborationChatEmpty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    color: var(--statusCapsuleMutedColor);
    font-size: 11px;
    line-height: 1.5;
    text-align: center;
  }

  .collaborationChatMessage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 8px;

    &.self {
      align-items: flex-end;

      .collaborationChatMessageMeta {
        flex-direction: row-reverse;
      }

      .collaborationChatBubble {
        background: var(--statusCapsuleRoleBackground);
      }
    }
  }

  .collaborationChatMessageMeta {
    display: flex;
    align-items: center;
    gap: 5px;
    max-width: 90%;
    margin-bottom: 2px;
    color: var(--statusCapsuleMutedColor);
    font-size: 9px;
    line-height: 1.3;

    span:first-child {
      overflow: hidden;
      max-width: 80px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .collaborationChatBubble {
    max-width: 90%;
    padding: 5px 7px;
    border: 1px solid;
    border-radius: 8px;
    background: var(--statusCapsuleBackground);
    box-sizing: border-box;
    color: var(--writerThemeTextColor);
    font-size: 11px;
    line-height: 1.45;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .collaborationChatComposer {
    display: flex;
    align-items: flex-end;
    flex: 0 0 auto;
    gap: 5px;
    padding: 7px;
    border-top: 1px solid var(--statusCapsuleBorder);
    box-sizing: border-box;
  }

  .collaborationChatInput {
    display: block;
    flex: 1 1 auto;
    min-width: 0;
    height: 44px;
    min-height: 44px;
    max-height: 64px;
    padding: 6px 7px;
    border: 1px solid var(--statusCapsuleBorder);
    border-radius: 7px;
    outline: 0;
    background: var(--statusCapsuleRoleBackground);
    box-sizing: border-box;
    color: var(--writerThemeTextColor);
    font: inherit;
    font-size: 11px;
    line-height: 1.35;
    resize: none;
  }

  .collaborationChatSendButton {
    flex: 0 0 auto;
    min-width: 38px;
    min-height: 30px;
    margin: 0;
    padding: 0 7px;
    border: 0;
    border-radius: 7px;
    background: var(--statusCapsulePrimaryColor);
    color: var(--statusCapsuleBackground);
    font-size: 11px;
    font-weight: 600;
    line-height: 30px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &::after {
      border: 0;
    }

    &:disabled {
      opacity: 0.38;
      cursor: default;
    }
  }

  .collaborationColorPalette {
    width: calc(100% - 4px);
    margin: 0 2px 8px;
    padding: 8px 6px 9px;
    border-radius: 8px;
    background: var(--statusCapsuleRoleBackground);
    box-sizing: border-box;
    overflow: visible;
    transform-origin: top right;
  }

  .collaborationColorPaletteOptions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 0;
    width: 100%;
    white-space: nowrap;
  }

  .collaborationColorOption {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
    min-height: 0;
    margin: 0;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 50%;
    box-sizing: border-box;
    color: #fff;
    font-size: 10px;
    line-height: 1;
    cursor: pointer;
    justify-self: center;
    transition: transform 0.14s ease, box-shadow 0.14s ease;
    -webkit-tap-highlight-color: transparent;

    &::after {
      border: 0;
    }

    &.selected {
      border-color: rgba(255, 255, 255, 0.92);
      box-shadow: 0 0 0 2px var(--statusCapsulePrimaryColor);
      transform: scale(1.08);
    }
  }

  .collaborationColorPaletteHint {
    margin-top: 8px;
    color: var(--statusCapsuleMutedColor);
    font-size: 10px;
    line-height: 1.35;
    text-align: center;
  }

  .collaborationColorPalette-enter-active,
  .collaborationColorPalette-leave-active {
    transition: opacity 0.14s ease, transform 0.14s ease;
  }

  .collaborationColorPalette-enter,
  .collaborationColorPalette-leave-to {
    opacity: 0;
    transform: translateY(-3px) scaleY(0.92);
  }

  .collaborationParticipantsTooltip-enter-active,
  .collaborationParticipantsTooltip-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .collaborationParticipantsTooltip-enter,
  .collaborationParticipantsTooltip-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
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

  &.black .customNavShortcutImage,
  &.qingyun .customNavShortcutImage,
  &.thorncrown .customNavShortcutImage,
  &.chocolate .customNavShortcutImage {
    filter: brightness(0) invert(1);
    opacity: 0.9;
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
    transform: translate3d(0, var(--statusCapsuleCounterOffset), 0);
    transition: transform 0.18s ease-out;
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
      border: 1rpx solid var(--statusCapsuleBorder);
      border-radius: 999rpx;
      background-color: var(--statusCapsuleBackground);
      box-sizing: border-box;
      font-size: 24rpx;
      line-height: 1.35;
      white-space: nowrap;
      backdrop-filter: blur(8px);
      transition: background-color 0.5s, border-color 0.5s, color 0.5s;
    }

    .textCount {
      color: var(--statusCapsulePrimaryColor);
    }

    .saveNotify {
      color: var(--statusCapsuleMutedColor);
    }

    .writingSpeed {
      color: var(--statusCapsulePrimaryColor);
    }

    .statusCapsuleIcon {
      flex: 0 0 auto;
      margin-right: 7rpx;
      font-size: 25rpx;
    }

    .syncStatusIcon {
      display: inline-flex;
      transform: translateY(2rpx);
    }

    .editorRole {
      display: inline-flex;
      align-items: center;
      margin-left: 10rpx;
      padding: 2rpx 10rpx;
      border-radius: 999rpx;
      font-size: 22rpx;
      color: var(--statusCapsuleRoleColor);
      background-color: var(--statusCapsuleRoleBackground);
    }
  }

  .middleBar {
    position: relative;
    box-sizing: border-box;
    height: calc(100vh - var(--navBarHeight) - var(--statusBarHeight) + var(--headerLayoutOffset)) !important;
    margin-top: calc(var(--navBarHeight) + var(--statusBarHeight));
    overflow: hidden;
    transform: translate3d(0, calc(0px - var(--headerVisualOffset)), 0);
    transition: transform 0.18s ease-out;
    backface-visibility: hidden;
    contain: layout paint;
    will-change: transform;

    &.findReplaceOpen {
      height: calc(100vh - var(--navBarHeight) - var(--statusBarHeight) + var(--headerLayoutOffset) - 180rpx) !important;
    }

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
      padding: calc(var(--statusCapsuleCounterOffset) + var(--statusCapsuleTopClearance)) 30rpx 30rpx;
      width: calc(100vw);
      height: calc(100%);
      font-size: 35rpx;
      line-height: 1.7;
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
        line-height: 1.7;
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
        min-height: 1.7em;
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
      height: calc(100% - 80rpx - var(--quickInputBottomInset));
    }

    .quickInputToolBar {
      bottom: 0;
      height: calc(80rpx + var(--quickInputBottomInset));
      width: 100%;
      z-index: 100;
      border-top: #b4b4b4 1rpx solid;
      display: flex;
      align-items: stretch;
      justify-content: flex-start;
      box-sizing: border-box;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 8rpx var(--quickInputBottomInset);
      gap: 6rpx;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

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
        touch-action: pan-x;
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

      &.black .quickInputToolbarImage,
      &.qingyun .quickInputToolbarImage,
      &.thorncrown .quickInputToolbarImage,
      &.chocolate .quickInputToolbarImage {
        filter: brightness(0) invert(1);
        opacity: 0.9;
      }
    }

    @media screen and (max-width: 360px) {
      .quickInputToolBar {
        padding: 0 2rpx;
        gap: 4rpx;

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

  .quickInputToolbarPreview {
    position: fixed;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 76rpx;
    max-width: 128rpx;
    height: 92rpx;
    padding: 0 12rpx 10rpx;
    box-sizing: border-box;
    border: 1rpx solid rgba(0, 0, 0, 0.12);
    border-radius: 20rpx 20rpx 16rpx 16rpx;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
    font-size: 46rpx;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) translateY(10rpx) scale(0.82);
    transform-origin: 50% 100%;
    transition:
      opacity 80ms ease-out,
      transform 110ms ease-out,
      visibility 0s linear 110ms;
    will-change: opacity, transform;
  }

  .quickInputToolbarPreviewVisible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0) scale(1);
    transition:
      opacity 80ms ease-out,
      transform 110ms ease-out,
      visibility 0s;
  }

  .quickInputToolbarPreview::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -10rpx;
    width: 22rpx;
    height: 22rpx;
    background: inherit;
    border-right: 1rpx solid rgba(0, 0, 0, 0.1);
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
    transform: translateX(-50%) rotate(45deg);
  }

  &.headerDragging {
    .editorHeader,
    .middleBar,
    .topBar {
      transition: none;
    }
  }

  &.headerDragging,
  &.headerSettling {
    .topBar .statusCapsule {
      box-shadow: none;
      backdrop-filter: none;
    }

    .customNavBar {
      box-shadow: none;
    }
  }
}

.findReplacePanel {
  --findReplaceBackground: #fcf8ef;
  --findReplaceColor: #5c4b3b;
  --findReplaceBorder: rgba(92, 75, 59, 0.16);
  --findReplaceInputBackground: rgba(255, 255, 255, 0.56);
  --findReplacePrimaryBackground: #9b6e3b;
  --findReplacePrimaryColor: #ffffff;
  position: fixed;
  bottom: calc(16rpx + var(--loghome-safe-bottom, 0px));
  left: 20rpx;
  right: 20rpx;
  z-index: 340;
  box-sizing: border-box;
  width: auto;
  max-width: 720rpx;
  margin: 0 auto;
  padding: 12rpx 16rpx 14rpx;
  color: var(--findReplaceColor);
  background: var(--findReplaceBackground);
  border: 1rpx solid var(--findReplaceBorder);
  border-radius: 16rpx;
  box-shadow: 0 12rpx 30rpx rgba(55, 45, 34, 0.14);
  backdrop-filter: blur(10px);
}

.findReplacePanel.blue {
  --findReplaceBackground: #e7f4f8;
  --findReplaceColor: #27566b;
  --findReplaceBorder: rgba(39, 86, 107, 0.16);
  --findReplacePrimaryBackground: #4f7f94;
}

.findReplacePanel.green {
  --findReplaceBackground: #e8f2e7;
  --findReplaceColor: #395744;
  --findReplaceBorder: rgba(57, 87, 68, 0.16);
  --findReplacePrimaryBackground: #5d8666;
}

.findReplacePanel.purple {
  --findReplaceBackground: #f1eaf4;
  --findReplaceColor: #57445f;
  --findReplaceBorder: rgba(87, 68, 95, 0.16);
  --findReplacePrimaryBackground: #856793;
}

.findReplacePanel.black {
  --findReplaceBackground: #313841;
  --findReplaceColor: #d9dee7;
  --findReplaceBorder: rgba(217, 222, 231, 0.18);
  --findReplaceInputBackground: rgba(255, 255, 255, 0.08);
  --findReplacePrimaryBackground: #cda872;
  --findReplacePrimaryColor: #22272e;
  box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.28);
}

.findReplacePanel.white {
  --findReplaceBackground: #f7f7f4;
  --findReplaceColor: #292927;
  --findReplaceBorder: rgba(41, 41, 39, 0.14);
  --findReplacePrimaryBackground: #4f4f4b;
}

.findReplacePanel.pink,
.findReplacePanel.wavechaser {
  --findReplaceBackground: #f4e8ed;
  --findReplaceColor: #5d3042;
  --findReplaceBorder: rgba(93, 48, 66, 0.18);
  --findReplacePrimaryBackground: #9d4e6d;
}

.findReplacePanel.powderblue {
  --findReplaceBackground: #c8eeec;
  --findReplaceColor: #244244;
  --findReplaceBorder: rgba(36, 66, 68, 0.17);
  --findReplacePrimaryBackground: #387a7b;
}

.findReplacePanel.sunburst {
  --findReplaceBackground: #ffe16c;
  --findReplaceColor: #493900;
  --findReplaceBorder: rgba(73, 57, 0, 0.18);
  --findReplacePrimaryBackground: #745700;
}

.findReplacePanel.blockepoch {
  --findReplaceBackground: #cfd8af;
  --findReplaceColor: #273421;
  --findReplaceBorder: rgba(39, 52, 33, 0.2);
  --findReplacePrimaryBackground: #4e7d3c;
}

.findReplacePanel.qingyun,
.findReplacePanel.thorncrown,
.findReplacePanel.chocolate {
  --findReplaceBackground: #3e3536;
  --findReplaceColor: #f4e7e1;
  --findReplaceBorder: rgba(244, 231, 225, 0.2);
  --findReplaceInputBackground: rgba(255, 255, 255, 0.08);
  --findReplacePrimaryBackground: #d5a26a;
  --findReplacePrimaryColor: #321412;
  box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.28);
}

.findReplacePanel.qingyun {
  --findReplaceBackground: #3e4a4d;
  --findReplacePrimaryBackground: #86d2d1;
  --findReplacePrimaryColor: #243235;
}

.findReplacePanel.thorncrown {
  --findReplaceBackground: #95302e;
}

.findReplacePanel.chocolate {
  --findReplaceBackground: #510b0c;
}

.findReplaceHeader,
.findReplaceMatchRow,
.findReplaceActions {
  display: flex;
  align-items: center;
}

.findReplaceCompactRow {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.findReplaceCompactRow + .findReplaceCompactRow {
  margin-top: 8rpx;
}

.findReplaceCompactRow .findReplaceField {
  min-width: 0;
  margin-top: 0;
}

.findReplaceCompactRow .queryField,
.findReplaceCompactRow .replaceField {
  flex: 1 1 auto;
}

.findReplaceCompactRow .findReplaceMatchStatus {
  flex: 0 0 72rpx;
  font-size: 22rpx;
  text-align: center;
}

.findReplaceCompactRow .findReplaceNavigation {
  gap: 4rpx;
}

.findReplaceCompactRow .findReplaceNavButton {
  width: 46rpx;
  height: 60rpx;
  border-radius: 8rpx;
  font-size: 27rpx;
}

.findReplaceCompactRow .findReplaceClose {
  flex: 0 0 48rpx;
  width: 48rpx;
  height: 60rpx;
  font-size: 32rpx;
}

.findReplaceCompactRow .findReplaceActionButton {
  min-width: 108rpx;
}

.findReplaceHeader {
  justify-content: space-between;
  min-height: 52rpx;
  margin-bottom: 6rpx;
}

.findReplaceTitle {
  font-size: 34rpx;
  font-weight: bold;
  line-height: 1;
}

.findReplaceClose,
.findReplaceClear,
.findReplaceNavButton,
.findReplaceActionButton {
  margin: 0;
  padding: 0;
  color: inherit;
  border: 0;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.findReplaceClose::after,
.findReplaceClear::after,
.findReplaceNavButton::after,
.findReplaceActionButton::after {
  border: 0;
}

.findReplaceClose {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 52rpx;
  background: transparent;
  font-size: 38rpx;
}

.findReplaceField {
  display: flex;
  align-items: center;
  min-height: 60rpx;
  margin-top: 10rpx;
  padding: 0 18rpx;
  border: 1rpx solid var(--findReplaceBorder);
  border-radius: 12rpx;
  box-sizing: border-box;
  background: var(--findReplaceInputBackground);
}

.findReplaceFieldIcon {
  flex: 0 0 auto;
  margin-right: 14rpx;
  font-size: 31rpx;
}

.findReplaceInput {
  flex: 1 1 auto;
  min-width: 0;
  height: 58rpx;
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  outline: none;
  font-size: 29rpx;
  line-height: 58rpx;
}

.findReplaceInput::placeholder {
  color: currentColor;
  opacity: 0.52;
}

.findReplaceClear {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48rpx;
  width: 48rpx;
  height: 48rpx;
  background: transparent;
  font-size: 28rpx;
  opacity: 0.68;
}

.findReplaceMatchRow {
  justify-content: space-between;
  min-height: 48rpx;
  margin-top: 4rpx;
}

.findReplaceMatchStatus {
  min-width: 0;
  overflow: hidden;
  font-size: 24rpx;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.74;
}

.findReplaceNavigation {
  display: flex;
  flex: 0 0 auto;
  gap: 8rpx;
}

.findReplaceNavButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 44rpx;
  background: transparent;
  border: 1rpx solid var(--findReplaceBorder);
  border-radius: 10rpx;
  font-size: 30rpx;
}

.findReplaceActions {
  justify-content: flex-end;
  gap: 14rpx;
  margin-top: 14rpx;
}

.findReplaceActionButton {
  flex: 0 0 auto;
  min-width: 106rpx;
  height: 60rpx;
  padding: 0 16rpx;
  color: inherit;
  background: var(--findReplaceInputBackground);
  border: 1rpx solid var(--findReplaceBorder);
  border-radius: 12rpx;
  font-size: 28rpx;
  line-height: 58rpx;
}

.findReplaceActionButton.primary {
  color: var(--findReplacePrimaryColor);
  background: var(--findReplacePrimaryBackground);
  border-color: var(--findReplacePrimaryBackground);
}

.findReplaceNavButton:disabled,
.findReplaceActionButton:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.toolbarPanel {
  position: relative;
  box-sizing: border-box;
  width: 100vw;
  padding: 22rpx 24rpx calc(26rpx + var(--loghome-safe-bottom, 0px));
  color: #5c4b3b;
  background: #fcf8ef;
  border-top: 1rpx solid rgba(92, 75, 59, 0.12);
  border-top-left-radius: 8rpx;
  border-top-right-radius: 8rpx;
  box-shadow: 0 -14rpx 34rpx rgba(55, 45, 34, 0.12);
}

.toolbarPanel::before {
  content: "";
  position: absolute;
  top: 10rpx;
  left: 50%;
  width: 72rpx;
  height: 6rpx;
  border-radius: 999rpx;
  background: rgba(92, 75, 59, 0.22);
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
  border: 1rpx solid rgba(92, 75, 59, 0.12);
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

.toolbarPanel.black .toolbarGridImage,
.toolbarPanel.qingyun .toolbarGridImage,
.toolbarPanel.thorncrown .toolbarGridImage,
.toolbarPanel.chocolate .toolbarGridImage {
  filter: brightness(0) invert(1);
  opacity: 0.9;
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

  .backgroundSettingRow {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 24rpx;
    margin-top: 30rpx;

    .backgroundSettingLabel {
      flex: 0 0 auto;
      font-size: 30rpx;
    }

    .backgroundPicker {
      flex: 1 1 auto;
      min-width: 0;
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
  background-color: #d9eef6;
  color: #4f7f94;
  border: 2px #4f7f94 solid !important;
}

.button.yellow {
  background-color: #f5e7cc;
  color: #a57843;
  border: 2px #a57843 solid !important;
}

.button.green {
  background-color: #dcebdd;
  color: #5d8666;
  border: 2px #5d8666 solid !important;
}

.button.purple {
  background-color: #eae1f0;
  color: #856793;
  border: 2px #856793 solid !important;
}

.button.black {
  background-color: #2b3038;
  color: #c2cad5;
  border: 2px #c2cad5 solid !important;
}

.button.white {
  background-color: #f6f6f4;
  color: #4f4f4b;
  border: 2px #4f4f4b solid !important;
}

div.outer.blue {
  background-color: #f4fafc;
  color: #27566b;
}

div.outer.yellow {
  background-color: #fcf8ef;
  color: #5c4b3b;
}

div.outer.green {
  background-color: #f5faf4;
  color: #395744;
}

div.outer.purple {
  background-color: #faf7fc;
  color: #57445f;
}

div.outer.black {
  background-color: #22272e;
  color: #d9dee7;
}

div.outer.white {
  background-color: #fefefc;
  color: #292927;
}

div.outer.pink {
  background-color: #fbf6f8;
  color: #664858;
}

div.outer.wavechaser {
  background-color: #e84f89;
  color: #32101f;
}

div.outer.powderblue {
  background-color: #ace5e2;
  color: #244244;
}

div.outer.qingyun {
  background-color: #313b3e;
  color: #e7eeef;
}

div.outer.sunburst {
  background-color: #fcd23c;
  color: #493900;
}

div.outer.thorncrown {
  background-color: #7d2120;
  color: #f6e8e5;
}

div.outer.chocolate {
  background-color: #380001;
  color: #f4e7e1;
}

div.outer.blockepoch {
  background-color: #dce3c2;
  color: #273421;
}

.quickInputToolBar.blue,
.quickInputToolbarPreview.blue,
.toolbarPanel.blue {
  background-color: #e7f4f8;
  color: #27566b;
}

.quickInputToolBar.blue {
  border-top-color: rgba(39, 86, 107, 0.2);
}

.toolbarPanel.blue .toolbarGridItem {
  background: rgba(255, 255, 255, 0.58);
  border-color: rgba(39, 86, 107, 0.14);
}

.toolbarPanel.blue .toolbarGridItem:active {
  background: rgba(255, 255, 255, 0.82);
}

.quickInputToolBar.yellow,
.quickInputToolbarPreview.yellow,
.toolbarPanel.yellow {
  background-color: #f8eedb;
  color: #5c4b3b;
}

.quickInputToolBar.yellow {
  border-top-color: rgba(92, 75, 59, 0.18);
}

.quickInputToolBar.green,
.quickInputToolbarPreview.green,
.toolbarPanel.green {
  background-color: #e8f2e7;
  color: #395744;
}

.quickInputToolBar.green {
  border-top-color: rgba(57, 87, 68, 0.2);
}

.toolbarPanel.green .toolbarGridItem {
  background: rgba(255, 255, 255, 0.58);
  border-color: rgba(57, 87, 68, 0.14);
}

.toolbarPanel.green .toolbarGridItem:active {
  background: rgba(255, 255, 255, 0.82);
}

.quickInputToolBar.purple,
.quickInputToolbarPreview.purple,
.toolbarPanel.purple {
  background-color: #f1eaf4;
  color: #57445f;
}

.quickInputToolBar.purple {
  border-top-color: rgba(87, 68, 95, 0.2);
}

.toolbarPanel.purple .toolbarGridItem {
  background: rgba(255, 255, 255, 0.58);
  border-color: rgba(87, 68, 95, 0.14);
}

.toolbarPanel.purple .toolbarGridItem:active {
  background: rgba(255, 255, 255, 0.82);
}

.quickInputToolBar.black,
.quickInputToolbarPreview.black,
.toolbarPanel.black {
  background-color: #313841;
  color: #d9dee7;
}

.quickInputToolBar.black {
  border-top-color: rgba(217, 222, 231, 0.18);
}

.toolbarPanel.black {
  border-top-color: rgba(217, 222, 231, 0.18);
}

.toolbarPanel.black::before {
  background: rgba(217, 222, 231, 0.3);
}

.toolbarPanel.black .toolbarGridItem {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(217, 222, 231, 0.16);
}

.toolbarPanel.black .toolbarGridItem:active {
  background: rgba(255, 255, 255, 0.14);
}

.quickInputToolBar.white,
.quickInputToolbarPreview.white,
.toolbarPanel.white {
  background-color: #f7f7f4;
  color: #292927;
}

.quickInputToolBar.white {
  border-top-color: rgba(41, 41, 39, 0.16);
}

.toolbarPanel.white .toolbarGridItem {
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(41, 41, 39, 0.12);
}

.toolbarPanel.white .toolbarGridItem:active {
  background: #ffffff;
}

.quickInputToolBar.pink,
.quickInputToolbarPreview.pink,
.toolbarPanel.pink {
  background-color: #f4e8ed;
  color: #664858;
}

.quickInputToolBar.wavechaser,
.quickInputToolbarPreview.wavechaser,
.toolbarPanel.wavechaser {
  background-color: #f277a5;
  color: #32101f;
}

.quickInputToolBar.powderblue,
.quickInputToolbarPreview.powderblue,
.toolbarPanel.powderblue {
  background-color: #c8eeec;
  color: #244244;
}

.quickInputToolBar.qingyun,
.quickInputToolbarPreview.qingyun,
.toolbarPanel.qingyun {
  background-color: #3e4a4d;
  color: #e7eeef;
}

.quickInputToolBar.sunburst,
.quickInputToolbarPreview.sunburst,
.toolbarPanel.sunburst {
  background-color: #ffe16c;
  color: #493900;
}

.quickInputToolBar.thorncrown,
.quickInputToolbarPreview.thorncrown,
.toolbarPanel.thorncrown {
  background-color: #95302e;
  color: #f6e8e5;
}

.quickInputToolBar.chocolate,
.quickInputToolbarPreview.chocolate,
.toolbarPanel.chocolate {
  background-color: #510b0c;
  color: #f4e7e1;
}

.quickInputToolBar.blockepoch,
.quickInputToolbarPreview.blockepoch,
.toolbarPanel.blockepoch {
  background-color: #cfd8af;
  color: #273421;
}

.quickInputToolBar.pink,
.quickInputToolBar.wavechaser,
.quickInputToolBar.powderblue,
.quickInputToolBar.qingyun,
.quickInputToolBar.sunburst,
.quickInputToolBar.thorncrown,
.quickInputToolBar.chocolate,
.quickInputToolBar.blockepoch {
  border-top-color: var(--writerThemeBorderColor, rgba(41, 41, 39, 0.16));
}

.toolbarPanel.pink .toolbarGridItem,
.toolbarPanel.wavechaser .toolbarGridItem,
.toolbarPanel.powderblue .toolbarGridItem,
.toolbarPanel.sunburst .toolbarGridItem,
.toolbarPanel.blockepoch .toolbarGridItem {
  background: rgba(255, 255, 255, 0.42);
  border-color: rgba(41, 41, 39, 0.14);
}

.toolbarPanel.qingyun .toolbarGridItem,
.toolbarPanel.thorncrown .toolbarGridItem,
.toolbarPanel.chocolate .toolbarGridItem {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.17);
}

.toolbarPanel.qingyun::before,
.toolbarPanel.thorncrown::before,
.toolbarPanel.chocolate::before {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes collaborationUnreadAvatarPulse {
  0%,
  100% {
    border-color: rgba(34, 197, 94, 1);
    box-shadow:
      0 0 0 2px rgba(34, 197, 94, 0.42),
      0 0 12px rgba(34, 197, 94, 0.72);
    opacity: 1;
    transform: scale(1);
  }

  50% {
    border-color: rgba(34, 197, 94, 0);
    box-shadow:
      0 0 0 2px rgba(34, 197, 94, 0),
      0 0 12px rgba(34, 197, 94, 0);
    opacity: 0.08;
    transform: scale(1.08);
  }
}
</style>

<style lang="less">
html.loghome-keyboard-visible .outer {
  --quickInputBottomInset: 0px !important;
}

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

.outer .writer-find-replace-match {
  border-radius: 4rpx;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  background-color: rgba(235, 201, 107, 0.5);
  box-shadow: inset 0 -2rpx 0 rgba(139, 96, 28, 0.7);
}

.outer.blue .writer-find-replace-match {
  background-color: rgba(116, 190, 215, 0.42);
  box-shadow: inset 0 -2rpx 0 rgba(42, 112, 137, 0.76);
}

.outer.green .writer-find-replace-match {
  background-color: rgba(144, 198, 151, 0.46);
  box-shadow: inset 0 -2rpx 0 rgba(65, 112, 76, 0.76);
}

.outer.purple .writer-find-replace-match {
  background-color: rgba(198, 163, 210, 0.44);
  box-shadow: inset 0 -2rpx 0 rgba(108, 79, 121, 0.76);
}

.outer.black .writer-find-replace-match {
  background-color: rgba(205, 168, 114, 0.52);
  box-shadow: inset 0 -2rpx 0 rgba(255, 231, 187, 0.88);
}

.outer.white .writer-find-replace-match {
  background-color: rgba(235, 201, 107, 0.48);
  box-shadow: inset 0 -2rpx 0 rgba(120, 91, 40, 0.72);
}

body > .quickInputToolbarPreview {
  position: fixed !important;
  z-index: 2147483647 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  min-width: 76rpx;
  max-width: 128rpx;
  height: 92rpx;
  padding: 0 12rpx 10rpx;
  box-sizing: border-box;
  border: 1rpx solid rgba(0, 0, 0, 0.12);
  border-radius: 20rpx 20rpx 16rpx 16rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
  font-size: 46rpx;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(10rpx) scale(0.82);
  transform-origin: 50% 100%;
  transition:
    opacity 80ms ease-out,
    transform 110ms ease-out,
    visibility 0s linear 110ms;
  will-change: opacity, transform;
}

body > .quickInputToolbarPreview.quickInputToolbarPreviewVisible {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) translateY(0) scale(1) !important;
  transition:
    opacity 80ms ease-out,
    transform 110ms ease-out,
    visibility 0s !important;
}

body > .quickInputToolbarPreview::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -10rpx;
  width: 22rpx;
  height: 22rpx;
  background: inherit;
  border-right: 1rpx solid rgba(0, 0, 0, 0.1);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  transform: translateX(-50%) rotate(45deg);
}

.collaboration-cursor__caret {
  display: inline-block;
  position: relative;
  z-index: 6;
  width: 0;
  height: 1.1em;
  border-left: 2px solid;
  border-right: 0;
  margin-left: -1px;
  margin-right: -1px;
  vertical-align: text-bottom;
  overflow: visible;
  word-break: normal;
  pointer-events: none;
}

.collaboration-cursor__label {
  position: absolute;
  z-index: 7;
  left: -2px;
  top: -1.45em;
  padding: 2px 6px;
  border-radius: 5px 5px 5px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  user-select: none;
}
</style>
