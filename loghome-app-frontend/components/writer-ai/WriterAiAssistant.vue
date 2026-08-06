<template>
  <view class="writer-ai-root" @touchstart.stop @touchend.stop>
    <view
      v-if="selectionAddButton.visible && !selectionAddButtonSuppressed"
      class="selection-add-button"
      :class="theme"
      :style="selectionAddButtonStyle"
      title="添加到对话"
      @mousedown.stop.prevent="noop"
      @touchstart.stop="noop"
      @click.stop="addSelectionToPrompt"
    >
      <view class="selection-add-icon">
        <i class="el-icon-chat-dot-square"></i>
        <text class="selection-add-plus">+</text>
      </view>
    </view>

    <template v-if="smartReplacePreview.visible">
      <view
        v-for="(rect, index) in smartReplacePreview.maskRects"
        :key="'smart-replace-mask-' + index"
        class="smart-replace-range-mask"
        :class="[theme, rect && rect.kind === 'insert' ? 'insert' : 'replace']"
        :style="getSmartReplaceMaskStyle(rect)"
      ></view>
    </template>

    <view
      v-if="smartReplacePreview.visible"
      ref="smartReplacePreview"
      class="smart-replace-preview"
      :class="[theme, smartReplacePreview.placement]"
      :style="smartReplacePreviewStyle"
      @mousedown.stop
      @touchstart.stop
      @click.stop
    >
      <view class="smart-replace-preview-head">
        <i class="el-icon-magic-stick"></i>
        <text>智能预览</text>
      </view>
      <scroll-view
        scroll-y
        class="smart-replace-result"
        :style="smartReplaceResultStyle"
      >
        <view
          v-for="(line, index) in smartReplacePreviewReplacementLines"
          :key="'new-' + index"
          class="replacement-line"
        >
          {{ line }}
        </view>
      </scroll-view>
      <view class="smart-replace-actions">
        <button
          class="mini-action-button"
          size="mini"
          @click="discardSmartReplacePreview"
        >
          取消
        </button>
        <button
          class="primary-button smart-replace-keep"
          size="mini"
          @click="keepSmartReplacePreview"
        >
          保留
        </button>
      </view>
    </view>

    <uni-popup ref="popup" type="bottom" @maskClick="handleMaskClick">
      <view ref="panel" class="writer-ai-panel" :class="[theme, { dragging: isDragging }]" :style="panelDynamicStyle" @click.stop>
        <view class="panel-handle-area" @touchstart="handlePanelDragStart" @touchmove="handlePanelDragMove" @touchend="handlePanelDragEnd" @touchcancel="handlePanelDragEnd">
          <view class="panel-handle"></view>
        </view>
        <view class="panel-head">
          <button
            class="panel-menu-button"
            size="mini"
            title="会话菜单"
            @click.stop="toggleConversationSidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <view class="panel-brand" title="笔泡">
            <img class="panel-brand-logo" src="../../static/bipao_ai.png" alt="笔泡" />
          </view>
          <view class="panel-close" @click="close">
            <uni-icons type="closeempty" size="20" :color="panelTextColor"></uni-icons>
          </view>
        </view>

        <view
          v-if="conversationSidebarVisible"
          class="conversation-sidebar-backdrop"
          @click.stop="hideConversationSidebar"
        ></view>
        <view
          class="conversation-sidebar"
          :class="{ visible: conversationSidebarVisible }"
          @click.stop
        >
          <button
            v-if="hasConversationContent"
            class="primary-button new-conversation-button"
            size="mini"
            :disabled="loading"
            @click="startNewConversation"
          >
            新建会话
          </button>
          <view class="conversation-sidebar-title">当前章节</view>
          <scroll-view scroll-y class="conversation-list">
            <view
              v-if="!conversationSessions.length"
              class="conversation-empty"
            >
              暂无历史会话
            </view>
            <view
              v-for="session in conversationSessions"
              :key="session.id"
              class="conversation-item"
              :class="{ active: session.id === currentConversationId }"
              @click="loadConversationSession(session.id)"
            >
              <view class="conversation-item-title">
                {{ getConversationSessionTitle(session) }}
              </view>
              <view class="conversation-item-meta">
                {{ formatConversationSessionTime(session.updated_at) }}
              </view>
            </view>
          </scroll-view>
        </view>

        <scroll-view
          scroll-y
          class="result-scroll chat-scroll"
          :scroll-top="resultScrollTop"
          :scroll-with-animation="false"
        >
          <view
            v-for="message in messages"
            :key="message.id"
            class="chat-row"
            :class="message.role"
          >
            <view class="chat-bubble">
              <block v-if="message.role === 'user'">
                <text v-if="message.content" class="chat-text">
                  {{ message.content }}
                </text>
                <view
                  class="inline-selection-blocks message-inline-blocks"
                  v-if="message.selectionBlocks && message.selectionBlocks.length"
                >
                  <view
                    v-for="(block, blockIndex) in message.selectionBlocks"
                    :key="message.id + '-selection-' + block.id"
                    class="selection-block-chip message-selection-chip"
                    @click.stop="showSelectionBlockTooltip(block, $event)"
                  >
                    <text class="selection-block-chip-text">
                      {{ getSelectionBlockLabel(block, blockIndex) }}
                    </text>
                  </view>
                </view>
              </block>
              <block v-else>
                <view
                  v-if="getAssistantReasoningDisplayContent(message)"
                  class="reasoning-block"
                  :class="{ collapsed: isAssistantReasoningCollapsed(message) }"
                >
                  <view
                    v-if="isAssistantReasoningCollapsible(message)"
                    class="reasoning-toggle"
                    @click.stop="toggleAssistantReasoning(message)"
                  >
                    <text class="reasoning-toggle-title">思考过程</text>
                    <i
                      class="reasoning-toggle-icon"
                      :class="isAssistantReasoningCollapsed(message) ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                    ></i>
                  </view>
                  <text
                    v-if="!isAssistantReasoningCollapsed(message)"
                    class="reasoning-text reasoning-inline"
                  >
                    {{ getAssistantReasoningDisplayContent(message) }}
                  </text>
                </view>
                <block
                  v-for="(segment, index) in getAssistantSegments(message)"
                  :key="message.id + '-segment-' + index"
                >
                  <view
                    v-if="segment.type === 'text'"
                    class="chat-text assistant-text markdown-body"
                    v-html="renderMarkdown(segment.content)"
                  ></view>
                  <view
                    v-else
                    class="draft-card"
                    :class="{ pending: segment.pending }"
                    >
                    <text class="draft-text">{{ segment.content }}</text>
                    <view class="draft-actions" v-if="!segment.pending">
                      <button
                        class="mini-action-button"
                        size="mini"
                        :loading="smartReplacingMessageId === message.id"
                        :disabled="!!smartReplacingMessageId"
                        @click="applyDraftText(segment.content, message)"
                      >
                        <i class="draft-action-icon el-icon-magic-stick"></i>
                        <text>应用</text>
                      </button>
                      <button
                        class="mini-action-button"
                        size="mini"
                        @click="copyDraftText(segment.content)"
                      >
                        <i class="draft-action-icon el-icon-document-copy"></i>
                        <text>复制</text>
                      </button>
                    </view>
                  </view>
                </block>
                <view
                  v-if="isAssistantImageGenerating(message)"
                  class="image-generation-status"
                >
                  <i class="draft-action-icon el-icon-loading"></i>
                  <text>{{ getAssistantImageStatus(message) }}</text>
                </view>
                <view
                  v-if="getAssistantGeneratedImages(message).length"
                  class="generated-image-list"
                >
                  <view
                    v-for="(image, imageIndex) in getAssistantGeneratedImages(message)"
                    :key="message.id + '-image-' + imageIndex + '-' + getGeneratedImageUrl(image)"
                    class="generated-image-card"
                  >
                    <image
                      class="generated-image-preview"
                      :src="getGeneratedImageUrl(image)"
                      mode="widthFix"
                    ></image>
                    <view class="generated-image-meta">
                      <text class="generated-image-title">
                        {{ getGeneratedImageTitle(image, imageIndex) }}
                      </text>
                    </view>
                    <view class="generated-image-actions">
                      <button
                        class="mini-action-button"
                        size="mini"
                        @click="insertGeneratedImageAtCursor(image)"
                      >
                        <i class="draft-action-icon el-icon-picture-outline"></i>
                        <text>插入</text>
                      </button>
                    </view>
                  </view>
                </view>
                <text
                  v-if="!message.content && !message.reasoningOutput && !getAssistantGeneratedImages(message).length && !isAssistantImageGenerating(message) && loading && activeAssistantMessageId === message.id"
                  class="chat-text assistant-text placeholder"
                >
                  正在思考...
                </text>
              </block>
            </view>
          </view>
          <view v-if="errorMessage" class="error-text">
            {{ errorMessage }}
          </view>
          <view v-if="!messages.length && !loading && !errorMessage" class="empty-text">
          </view>
          <view class="result-scroll-anchor"></view>
        </scroll-view>

        <view class="chat-input-wrap">
          <view class="chat-feature-bar">
            <button
              v-if="hasConversationContent"
              class="feature-tool-button"
              size="mini"
              :disabled="loading"
              @click="startNewConversation"
            >
              <i class="feature-tool-icon el-icon-plus"></i>
              <text>开启新会话</text>
            </button>
            <button
              class="feature-tool-button feature-toggle-button"
              :class="{ active: imageGenerationEnabled }"
              size="mini"
              :disabled="loading"
              @click="toggleImageGeneration"
            >
              <i class="feature-tool-icon el-icon-picture-outline"></i>
              <text>图片生成</text>
            </button>
            <button
              class="feature-tool-button feature-toggle-button"
              :class="{ active: thinkingMode === 'deep' }"
              size="mini"
              :disabled="loading"
              @click="toggleDeepThinking"
            >
              <svg class="feature-tool-icon feature-brain-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.5 4.5C7.6 4.5 6 6 6 7.9c-1.7.4-3 1.9-3 3.7 0 1.5.9 2.9 2.2 3.5-.1.3-.2.7-.2 1.1 0 1.9 1.6 3.4 3.5 3.4 1.4 0 2.6-.8 3.1-2 .2-.3.4-.7.4-1.1v-9c0-1.7-1.1-3-2.5-3z" />
                <path d="M14.5 4.5c1.9 0 3.5 1.5 3.5 3.4 1.7.4 3 1.9 3 3.7 0 1.5-.9 2.9-2.2 3.5.1.3.2.7.2 1.1 0 1.9-1.6 3.4-3.5 3.4-1.4 0-2.6-.8-3.1-2-.2-.3-.4-.7-.4-1.1v-9c0-1.7 1.1-3 2.5-3z" />
                <path d="M7 8.5c.8 0 1.5.5 1.9 1.1" />
                <path d="M5.2 15.1c.7-.5 1.5-.7 2.3-.5" />
                <path d="M17 8.5c-.8 0-1.5.5-1.9 1.1" />
                <path d="M18.8 15.1c-.7-.5-1.5-.7-2.3-.5" />
              </svg>
              <text>深度思考</text>
            </button>
          </view>
		  <RedstoneCost :cost="imageGenerationEnabled ? 5 : (thinkingMode === 'deep' ? 2 : 1)" />
          <view class="chat-compose-row">
            <view class="chat-editor-box">
              <view class="inline-selection-blocks" v-if="pendingSelectionBlocks.length">
                <view
                  v-for="(block, blockIndex) in pendingSelectionBlocks"
                  :key="block.id"
                  class="selection-block-chip"
                  @click.stop="showSelectionBlockTooltip(block, $event)"
                >
                  <text class="selection-block-chip-text">
                    {{ getSelectionBlockLabel(block, blockIndex) }}
                  </text>
                  <button
                    class="selection-block-remove"
                    size="mini"
                    @click.stop="removePendingSelectionBlock(block.id)"
                  >
                    <i class="el-icon-close"></i>
                  </button>
                </view>
              </view>
              <textarea
                ref="promptInput"
                v-model="prompt"
                class="prompt-input chat-textarea"
                :placeholder="currentPlaceholder"
                maxlength="-1"
                auto-height
                confirm-type="send"
                @confirm="submitChat"
              />
              <view class="chat-editor-actions">
                <view v-if="imageGenerationEnabled" class="chat-image-options">
                  <button
                    ref="imageStyleOptionButton"
                    class="image-option-button image-style-option-button"
                    size="mini"
                    :disabled="loading"
                    @click.stop="toggleImageOptionMenu('style', $event)"
                  >
                    <i class="image-option-icon el-icon-brush"></i>
                    <text>{{ selectedImageStyleLabel }}</text>
                    <i class="image-option-arrow el-icon-arrow-down"></i>
                  </button>
                  <button
                    ref="imageRatioOptionButton"
                    class="image-option-button image-ratio-option-button"
                    size="mini"
                    :disabled="loading"
                    @click.stop="toggleImageOptionMenu('ratio', $event)"
                  >
                    <i class="image-option-icon el-icon-crop"></i>
                    <text>{{ selectedImageAspectRatioLabel }}</text>
                    <i class="image-option-arrow el-icon-arrow-down"></i>
                  </button>
                </view>
                <button
                  v-if="loading"
                  class="ghost-button chat-send-button chat-stop-button"
                  size="mini"
                  @click="stopAssist"
                >
                  停止
                </button>
                <button
                  v-else
                  class="primary-button chat-send-button"
                  size="mini"
                  :disabled="!canRun"
                  @click="submitChat"
                >
                  发送
                </button>
              </view>
            </view>
          </view>
        </view>

        <view class="panel-note">
          AI 可能会犯错，请确认后再应用到草稿。
        </view>

        <view
          v-if="selectionBlockTooltip.visible"
          class="selection-block-tooltip"
          :class="theme"
          :style="selectionBlockTooltipStyle"
          @click.stop
        >
          <view class="selection-tooltip-head">
            <text>{{ selectionBlockTooltip.title }}</text>
            <button
              class="selection-tooltip-close"
              size="mini"
              @click="hideSelectionBlockTooltip"
            >
              <i class="el-icon-close"></i>
            </button>
          </view>
          <scroll-view scroll-y class="selection-tooltip-body">
            <text>{{ selectionBlockTooltip.text }}</text>
          </scroll-view>
        </view>
      </view>
    </uni-popup>

    <view
      v-if="imageOptionMenu.visible"
      class="image-option-menu-backdrop"
      @click.stop="closeImageOptionMenu"
    ></view>
    <view
      v-if="imageOptionMenu.visible"
      class="image-option-menu"
      :class="theme"
      :style="imageOptionMenuStyle"
      @click.stop
    >
      <button
        v-for="(option, optionIndex) in imageOptionMenuOptions"
        :key="imageOptionMenu.type + '-' + option.value + '-' + optionIndex"
        class="image-option-menu-item"
        :class="{ active: isImageOptionSelected(optionIndex) }"
        size="mini"
        @click.stop="selectImageOption(optionIndex)"
      >
        <i
          class="image-option-menu-check"
          :class="isImageOptionSelected(optionIndex) ? 'el-icon-check' : 'el-icon-minus'"
        ></i>
        <text>{{ option.label }}</text>
      </button>
    </view>
  </view>
</template>

<script>
import RedstoneCost from '@/components/redstone-cost/RedstoneCost.vue';
import { showInsufficientRedstoneOptions } from '@/common/redstone-ui.js';

const STREAM_ROUTE = "/library/writer_novel_ai_assist_stream";
const SMART_REPLACE_ROUTE = "/library/writer_novel_ai_smart_replace";
const MAX_CONTEXT_CHARS = 1400;
const MAX_SELECTION_BLOCKS = 8;
const MAX_SELECTION_BLOCK_CHARS = 4000;
const RESULT_SCROLL_BOTTOM = 10000000;
const RESULT_SCROLL_BOTTOM_ALT = RESULT_SCROLL_BOTTOM - 1;
const TYPEWRITER_INTERVAL_MS = 24;
const REASONING_TYPEWRITER_INTERVAL_MS = 18;
const MAX_CONVERSATION_SESSIONS = 30;
const CONVERSATION_PERSIST_DELAY_MS = 450;
const ASSIST_RECONNECT_DELAY_MS = 1600;
const MAX_ASSIST_RECONNECT_ATTEMPTS = 3;
const ASSIST_TASK_RESUME_WINDOW_MS = 30 * 60 * 1000;

function createTaskInstanceId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
const IMAGE_STYLE_OPTIONS = [
  { label: "风格", value: "" },
  { label: "写实", value: "写实细腻，电影感光影" },
  { label: "国风", value: "东方国风插画，雅致含蓄" },
  { label: "二次元", value: "精致二次元角色插画" },
  { label: "厚涂", value: "厚涂概念设定，质感丰富" },
  { label: "漫画", value: "漫画分镜感，线条清晰" },
  { label: "水彩", value: "水彩插画，柔和通透" },
  { label: "电影感", value: "电影剧照感，戏剧化构图" },
];
const IMAGE_ASPECT_RATIO_OPTIONS = [
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "3:2", value: "3:2" },
  { label: "2:3", value: "2:3" },
  { label: "3:4", value: "3:4" },
  { label: "9:16", value: "9:16" },
  { label: "21:9", value: "21:9" },
];

function getTypewriterStepSize(remaining) {
  const safeRemaining = Number(remaining || 0);
  if (safeRemaining <= 0) {
    return 0;
  }
  if (safeRemaining > 160) {
    return 8;
  }
  if (safeRemaining > 80) {
    return 6;
  }
  if (safeRemaining > 30) {
    return 4;
  }
  return 2;
}

function clampText(text, maxLength) {
  const source = String(text || "");
  if (source.length <= maxLength) {
    return source;
  }
  return source.slice(0, Math.max(0, maxLength - 3)) + "...";
}

function normalizeGeneratedText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(text) {
  return escapeHtml(text).replace(/`/g, "&#96;");
}

function isSafeLinkUrl(url) {
  const value = String(url || "").trim();
  return /^(https?:\/\/|mailto:|#|\/)/i.test(value);
}

function renderInlineMarkdown(text) {
  const codePlaceholders = [];
  let html = escapeHtml(text).replace(/`([^`]+)`/g, (match, code) => {
    const key = `@@CODE_${codePlaceholders.length}@@`;
    codePlaceholders.push(`<code>${code}</code>`);
    return key;
  });

  html = html
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, rawUrl) => {
      const url = String(rawUrl || "").trim();
      if (!isSafeLinkUrl(url)) {
        return label;
      }
      return `<a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");

  codePlaceholders.forEach((value, index) => {
    html = html.replace(`@@CODE_${index}@@`, value);
  });
  return html;
}

function renderMarkdown(text) {
  const source = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (!source.trim()) {
    return "";
  }

  const lines = source.split("\n");
  const blocks = [];
  let paragraph = [];
  let listItems = [];
  let orderedList = false;
  let quoteLines = [];
  let codeLines = [];
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    blocks.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!listItems.length) {
      return;
    }
    const tag = orderedList ? "ol" : "ul";
    blocks.push(`<${tag}>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${tag}>`);
    listItems = [];
  };
  const flushQuote = () => {
    if (!quoteLines.length) {
      return;
    }
    blocks.push(`<blockquote>${quoteLines.map((line) => `<p>${renderInlineMarkdown(line)}</p>`).join("")}</blockquote>`);
    quoteLines = [];
  };
  const flushCode = () => {
    blocks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines = [];
  };

  lines.forEach((line) => {
    if (/^\s*```/.test(line)) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        flushQuote();
        inCodeBlock = true;
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      return;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteLines.push(quoteMatch[1]);
      return;
    }

    const unorderedMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      flushQuote();
      const nextOrdered = !!orderedMatch;
      if (listItems.length && orderedList !== nextOrdered) {
        flushList();
      }
      orderedList = nextOrdered;
      listItems.push((orderedMatch || unorderedMatch)[1]);
      return;
    }

    flushList();
    flushQuote();
    paragraph.push(trimmed);
  });

  if (inCodeBlock) {
    flushCode();
  }
  flushParagraph();
  flushList();
  flushQuote();

  return blocks.join("");
}

function buildSelectionBlockText(text) {
  const normalized = normalizeGeneratedText(text);
  return normalized ? clampText(normalized, MAX_SELECTION_BLOCK_CHARS) : "";
}

function summarizeSelectionBlockText(text) {
  const source = normalizeGeneratedText(text).replace(/\s+/g, " ");
  if (source.length <= 6) {
    return source;
  }
  return `${source.slice(0, 3)}...${source.slice(-3)}`;
}

function normalizeSelectionBlocks(blocks) {
	if (!Array.isArray(blocks)) {
		return [];
	}
  return blocks
    .map((block, index) => {
      const text = normalizeGeneratedText(block && block.text);
      if (!text) {
        return null;
      }
      return {
        id: String(block.id || `selection-${index}`),
        text: clampText(text, MAX_SELECTION_BLOCK_CHARS),
        from: block.from === null || block.from === undefined ? null : Number(block.from),
        to: block.to === null || block.to === undefined ? null : Number(block.to),
        docSize: block.docSize === null || block.docSize === undefined ? null : Number(block.docSize),
      };
    })
		.filter(Boolean)
		.slice(0, MAX_SELECTION_BLOCKS);
}

function normalizeGeneratedImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }
  return images
    .map((image, index) => {
      const source = image && typeof image === "object" ? image : {};
      const url = String(source.url || source.src || source.image_url || "").trim();
      if (!url) {
        return null;
      }
      return {
        id: String(source.id || `generated-image-${index}`),
        url,
        prompt: String(source.prompt || ""),
        aspect_ratio: String(source.aspect_ratio || source.aspectRatio || ""),
        source: String(source.source || "minimax"),
      };
    })
    .filter(Boolean)
    .slice(0, 20);
}

function normalizeThinkingMode(value) {
  return String(value || "").trim() === "deep" ? "deep" : "fast";
}

function normalizePendingAssistTask(rawTask) {
  if (!rawTask || typeof rawTask !== "object") {
    return null;
  }
  const taskId = String(rawTask.taskId || rawTask.task_id || "").trim();
  const sessionId = String(rawTask.sessionId || rawTask.session_id || "").trim();
  const messageId = String(rawTask.messageId || rawTask.message_id || "").trim();
  if (!taskId || !messageId) {
    return null;
  }
  const lastEventId = Number(rawTask.lastEventId || rawTask.last_event_id || 0);
  const reconnectAttempts = Number(
    rawTask.reconnectAttempts || rawTask.reconnect_attempts || 0
  );
  const articleId = Number(rawTask.articleId || rawTask.article_id || 0);
  const rawStatus = String(rawTask.status || "running");
  return {
    taskId,
    sessionId,
    messageId,
    articleId: Number.isFinite(articleId) && articleId > 0 ? articleId : 0,
    thinkingMode: normalizeThinkingMode(rawTask.thinkingMode || rawTask.thinking_mode),
    lastEventId: Number.isFinite(lastEventId) && lastEventId > 0
      ? Math.floor(lastEventId)
      : 0,
    reconnectAttempts: Number.isFinite(reconnectAttempts) && reconnectAttempts > 0
      ? Math.floor(reconnectAttempts)
      : 0,
    status: rawStatus === "completed" || rawStatus === "error" ? rawStatus : "running",
    createdAt: Number(rawTask.createdAt || rawTask.created_at || Date.now()),
  };
}

function formatSelectionBlocksForPrompt(blocks) {
  const normalizedBlocks = normalizeSelectionBlocks(blocks);
  if (!normalizedBlocks.length) {
    return "";
  }
  const blockText = normalizedBlocks
    .map((block, index) => {
      return `【段落块 ${index + 1}】\n${block.text}\n【段落块 ${index + 1}结束】`;
    })
    .join("\n\n");
  return `作者添加到本轮对话的段落块：\n${blockText}`;
}

function mergeStreamingText(previousText, nextText) {
  const previous = String(previousText || "");
  const next = String(nextText || "");
  if (!next) {
    return {
      full: previous,
      delta: "",
    };
  }
  if (next.startsWith(previous)) {
    return {
      full: next,
      delta: next.slice(previous.length),
    };
  }
  if (previous.endsWith(next)) {
    return {
      full: previous,
      delta: "",
    };
  }
  const maxOverlap = Math.min(previous.length, next.length);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    if (previous.slice(previous.length - overlap) === next.slice(0, overlap)) {
      return {
        full: previous + next.slice(overlap),
        delta: next.slice(overlap),
      };
    }
  }
  return {
    full: previous + next,
    delta: next,
  };
}

function stripDraftTags(text) {
  return String(text || "").replace(/<\/?draft>/gi, "");
}

function parseDraftSegments(content) {
  const source = String(content || "");
  const segments = [];
  const draftPattern = /<draft>([\s\S]*?)<\/draft>/gi;
  let lastIndex = 0;
  let match;

  while ((match = draftPattern.exec(source))) {
    const before = stripDraftTags(source.slice(lastIndex, match.index)).trim();
    if (before) {
      segments.push({ type: "text", content: before });
    }
    const draftText = normalizeGeneratedText(match[1]);
    if (draftText) {
      segments.push({ type: "draft", content: draftText, pending: false });
    }
    lastIndex = match.index + match[0].length;
  }

  const tail = source.slice(lastIndex);
  const lowerTail = tail.toLowerCase();
  const openIndex = lowerTail.lastIndexOf("<draft>");
  if (openIndex !== -1 && lowerTail.indexOf("</draft>", openIndex) === -1) {
    const before = stripDraftTags(tail.slice(0, openIndex)).trim();
    if (before) {
      segments.push({ type: "text", content: before });
    }
    const pendingDraft = normalizeGeneratedText(tail.slice(openIndex + "<draft>".length));
    if (pendingDraft) {
      segments.push({ type: "draft", content: pendingDraft, pending: true });
    }
    return segments;
  }

  const remaining = stripDraftTags(tail).trim();
  if (remaining) {
    segments.push({ type: "text", content: remaining });
  }
  return segments;
}

export default {
  name: "WriterAiAssistant",
  components: { RedstoneCost },
  props: {
    editor: {
      type: Object,
      default: null,
    },
    article: {
      type: Object,
      default: () => ({}),
    },
    chapterId: {
      type: Number,
      default: 0,
    },
    editSessionId: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "yellow",
    },
  },
  data() {
    return {
      prompt: "",
      thinkingMode: "fast",
      imageGenerationEnabled: false,
      imageStyleIndex: 0,
      imageAspectRatioIndex: 0,
      output: "",
      reasoningOutput: "",
      messages: [],
      pendingSelectionBlocks: [],
      nextMessageId: 1,
      currentConversationId: "",
      conversationSessions: [],
      conversationSidebarVisible: false,
      conversationPersistTimer: null,
      activeAssistantMessageId: null,
      activeAssistTask: null,
      resumeTaskInProgress: false,
      assistReconnectTimer: null,
      loading: false,
      smartReplacingMessageId: null,
      statusText: "",
      errorMessage: "",
      processSteps: [],
      processExpanded: true,
      reasoningExpanded: true,
      resultScrollTop: 0,
      streamOutputChars: 0,
      selectionText: "",
      selectionSnapshot: null,
      cursorPosition: null,
      selectionAddButton: {
        visible: false,
        left: 0,
        top: 0,
      },
      selectionAddButtonSuppressed: false,
      selectionBlockTooltip: {
        visible: false,
        title: "",
        text: "",
        left: 0,
        top: 0,
        width: 0,
      },
      smartReplacePreview: {
        visible: false,
        action: "replace",
        decision: null,
        range: null,
        originalText: "",
        replacementText: "",
        left: 16,
        top: 120,
        width: 320,
        maxHeight: 320,
        resultMaxHeight: 220,
        placement: "below",
        arrowLeft: 28,
        maskRects: [],
      },
      imageOptionMenu: {
        visible: false,
        type: "",
        left: 0,
        top: 0,
        width: 160,
      },
      cursorContext: {
        before: "",
        after: "",
      },
      abortController: null,
      typewriterTimers: {},
      reasoningTypewriterTimers: {},
      isDragging: false,
      panelHeight: 0,
      panelHeightRatio: 0.6,
      screenHeight: 0,
      startY: 0,
      startHeight: 0,
    };
  },
  computed: {
    currentPlaceholder() {
      return "输入问题";
    },
    canRun() {
      return !!(
        String(this.prompt || "").trim() ||
        this.pendingSelectionBlocks.length
      );
    },
    hasConversationContent() {
      return (Array.isArray(this.messages) ? this.messages : []).some((message) => {
        return !!(
          message &&
          (
            String(message.content || "").trim() ||
            String(message.reasoningOutput || "").trim() ||
            (message.generatedImages && message.generatedImages.length) ||
            (message.selectionBlocks && message.selectionBlocks.length)
          )
        );
      });
    },
    imageStyleLabels() {
      return IMAGE_STYLE_OPTIONS.map((item) => item.label);
    },
    imageAspectRatioLabels() {
      return IMAGE_ASPECT_RATIO_OPTIONS.map((item) => item.label);
    },
    selectedImageStyleOption() {
      return IMAGE_STYLE_OPTIONS[this.imageStyleIndex] || IMAGE_STYLE_OPTIONS[0];
    },
    selectedImageAspectRatioOption() {
      return IMAGE_ASPECT_RATIO_OPTIONS[this.imageAspectRatioIndex] || IMAGE_ASPECT_RATIO_OPTIONS[0];
    },
    selectedImageStyleLabel() {
      return this.selectedImageStyleOption.label || "风格";
    },
    selectedImageAspectRatioLabel() {
      return this.selectedImageAspectRatioOption.label || "1:1";
    },
    imageOptionMenuOptions() {
      return this.imageOptionMenu.type === "ratio"
        ? IMAGE_ASPECT_RATIO_OPTIONS
        : IMAGE_STYLE_OPTIONS;
    },
    imageOptionMenuStyle() {
      return {
        left: `${this.imageOptionMenu.left || 0}px`,
        top: `${this.imageOptionMenu.top || 0}px`,
        width: `${this.imageOptionMenu.width || 160}px`,
      };
    },
    selectionAddButtonStyle() {
      return {
        left: `${this.selectionAddButton.left || 0}px`,
        top: `${this.selectionAddButton.top || 0}px`,
      };
    },
    heightLevels() {
      if (!this.screenHeight) return [0, 0, 0];
      return [this.screenHeight * 0.4, this.screenHeight * 0.6, this.screenHeight * 0.95];
    },
    panelDynamicStyle() {
      if (this.panelHeight > 0) {
        return { height: this.panelHeight + 'px', maxHeight: this.panelHeight + 'px' };
      }
      return {};
    },
    selectionBlockTooltipStyle() {
      return {
        left: `${this.selectionBlockTooltip.left || 0}px`,
        top: `${this.selectionBlockTooltip.top || 0}px`,
        width: this.selectionBlockTooltip.width
          ? `${this.selectionBlockTooltip.width}px`
          : undefined,
      };
    },
    smartReplacePreviewStyle() {
      return {
        left: `${this.smartReplacePreview.left || 16}px`,
        top: `${this.smartReplacePreview.top || 120}px`,
        width: `${this.smartReplacePreview.width || 320}px`,
        maxHeight: `${this.smartReplacePreview.maxHeight || 320}px`,
        "--smart-replace-arrow-left": `${this.smartReplacePreview.arrowLeft || 28}px`,
      };
    },
    smartReplaceResultStyle() {
      return {
        maxHeight: `${this.smartReplacePreview.resultMaxHeight || 220}px`,
      };
    },
    smartReplacePreviewReplacementLines() {
      return this.splitDiffLines(this.smartReplacePreview.replacementText);
    },
    canReplaceSelection() {
      return !!(
        this.output &&
        this.selectionSnapshot &&
        Number(this.selectionSnapshot.from) < Number(this.selectionSnapshot.to)
      );
    },
    panelTextColor() {
      return this.theme === "black" ? "#f2e8d8" : "#5a3921";
    },
  },
  watch: {
    editor(newEditor, oldEditor) {
      this.unbindEditorSelectionListener(oldEditor);
      this.$nextTick(() => {
        this.bindEditorSelectionListener();
      });
    },
    chapterId() {
      this.flushConversationPersist();
      this.resetConversationState({ keepSessionId: false });
      this.refreshConversationSessions();
    },
  },
  mounted() {
    this.bindEditorSelectionListener();
    this.refreshConversationSessions();
    this.resumeLatestPendingConversation();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.handleViewportResize);
      window.addEventListener("scroll", this.scheduleSelectionButtonUpdate, true);
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", this.handleViewportResize);
      }
    }
  },
  beforeDestroy() {
    this.flushConversationPersist();
    this.clearAssistReconnectTimer();
    this.abortRequest();
    this.stopAllTypewriters();
    this.stopAllReasoningTypewriters();
    this.unbindEditorSelectionListener();
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.handleViewportResize);
      window.removeEventListener("scroll", this.scheduleSelectionButtonUpdate, true);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", this.handleViewportResize);
      }
    }
    this.clearPanelViewportTimers();
    if (this._selectionButtonFrame) {
      cancelAnimationFrame(this._selectionButtonFrame);
      this._selectionButtonFrame = null;
    }
    if (this._resultScrollFrame && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(this._resultScrollFrame);
      this._resultScrollFrame = null;
    }
    if (this._resultScrollTimer) {
      clearTimeout(this._resultScrollTimer);
      this._resultScrollTimer = null;
    }
    this._resultScrollQueued = false;
    this.discardSmartReplacePreview();
  },
  methods: {
    noop() {},
    open() {
      this.selectionAddButtonSuppressed = true;
      this.hideSelectionAddButton();
      this.refreshConversationSessions();
      this.refreshSelectionInfo();
      this.updateSelectionAddButton();
      this.initPanelHeight();
      this.$refs.popup.open("bottom");
      this.schedulePanelViewportRefresh();
      this.resumePendingAssistIfNeeded();
    },
    initPanelHeight() {
      this.panelHeightRatio = 0.6;
      this.refreshPanelViewportHeight({ forceRatio: 0.6 });
    },
    handleViewportResize() {
      this.scheduleSelectionButtonUpdate();
      if (this.isPanelOpen()) {
        this.schedulePanelViewportRefresh();
      }
    },
    isPanelOpen() {
      const popup = this.$refs && this.$refs.popup;
      return !!(
        popup &&
        (popup.showPopup || popup.showTrans)
      );
    },
    getPanelViewportHeight() {
      let sysInfo = {};
      try {
        sysInfo = uni.getSystemInfoSync() || {};
      } catch (error) {
        sysInfo = {};
      }

      const heights = [];
      const windowHeight = Number(sysInfo.windowHeight || 0);
      if (windowHeight > 0) {
        heights.push(windowHeight);
      }

      if (typeof window !== "undefined") {
        const innerHeight = Number(window.innerHeight || 0);
        if (innerHeight > 0) {
          heights.push(innerHeight);
        }
        if (window.visualViewport) {
          const visualHeight = Number(window.visualViewport.height || 0);
          if (visualHeight > 0) {
            heights.push(visualHeight);
          }
        }
      }

      let viewportHeight = Math.max.apply(null, heights.length ? heights : [0]);
      const platform = String(sysInfo.platform || "").toLowerCase();

      if (platform === "android") {
        const screenHeight = Number(sysInfo.screenHeight || 0);
        const safeAreaHeight = sysInfo.safeArea ? Number(sysInfo.safeArea.height || 0) : 0;
        const statusBarHeight = Number(sysInfo.statusBarHeight || 0);
        const windowTop = Number(sysInfo.windowTop || 0);
        const fullHeightCandidates = [
          safeAreaHeight,
          screenHeight - windowTop,
          screenHeight - statusBarHeight,
        ].filter((height) => Number.isFinite(height) && height > 0);
        const fullHeight = Math.max.apply(null, fullHeightCandidates.length ? fullHeightCandidates : [0]);

        if (fullHeight > 0 && (!viewportHeight || fullHeight > viewportHeight * 1.2)) {
          viewportHeight = fullHeight;
        }
      }

      return Math.round(viewportHeight || 640);
    },
    refreshPanelViewportHeight(options = {}) {
      if (this.isDragging) return;

      const nextScreenHeight = this.getPanelViewportHeight();
      const previousScreenHeight = Number(this.screenHeight || 0);
      const previousPanelHeight = Number(this.panelHeight || 0);
      const forceRatio = Number(options.forceRatio);
      const nextRatio = Number.isFinite(forceRatio) && forceRatio > 0
        ? forceRatio
        : previousScreenHeight && previousPanelHeight
          ? previousPanelHeight / previousScreenHeight
          : this.panelHeightRatio || 0.6;

      this.screenHeight = nextScreenHeight;
      this.panelHeightRatio = Math.max(0.4, Math.min(nextRatio, 0.95));
      this.panelHeight = nextScreenHeight * this.panelHeightRatio;
    },
    schedulePanelViewportRefresh() {
      this.clearPanelViewportTimers();
      const delays = [0, 80, 260, 520];
      this._panelViewportTimers = delays.map((delay) => {
        return setTimeout(() => {
          this.refreshPanelViewportHeight();
        }, delay);
      });
    },
    clearPanelViewportTimers() {
      if (!this._panelViewportTimers) return;
      this._panelViewportTimers.forEach((timer) => clearTimeout(timer));
      this._panelViewportTimers = null;
    },
    handlePanelDragStart(e) {
      this.isDragging = true;
      this.startY = e.touches[0].clientY;
      this.startHeight = this.panelHeight;
    },
    handlePanelDragMove(e) {
      if (!this.isDragging) return;
      let deltaY = this.startY - e.touches[0].clientY;
      let newHeight = this.startHeight + deltaY;
      const minH = this.heightLevels[0];
      const maxH = this.heightLevels[2];
      if (newHeight < minH - 50) newHeight = minH - 50;
      if (newHeight > maxH + 50) newHeight = maxH + 50;
      this.panelHeight = newHeight;
      this.panelHeightRatio = this.screenHeight ? newHeight / this.screenHeight : this.panelHeightRatio;
    },
    handlePanelDragEnd() {
      const current = this.panelHeight;
      let closest = this.heightLevels[0];
      let minDiff = Math.abs(current - closest);
      this.heightLevels.forEach((level) => {
        const diff = Math.abs(current - level);
        if (diff < minDiff) {
          minDiff = diff;
          closest = level;
        }
      });
      this.panelHeight = closest;
      this.panelHeightRatio = this.screenHeight ? closest / this.screenHeight : 0.6;
      this.isDragging = false;
    },
    close() {
      this.flushConversationPersist();
      this.selectionAddButtonSuppressed = false;
      this.$refs.popup.close();
      this.scheduleSelectionButtonUpdate();
      this.$emit('close');
    },
    handleMaskClick() {
      this.flushConversationPersist();
      this.selectionAddButtonSuppressed = false;
      this.scheduleSelectionButtonUpdate();
      this.$emit('close');
    },
    splitDiffLines(text) {
      const normalized = normalizeGeneratedText(text);
      return normalized ? normalized.split("\n") : [""];
    },
    getCurrentUserId() {
      const token = this.getTokenInfo();
      return String(
        (token && (token.user_id || token.uid || token.id)) ||
          (this.article && this.article.author_id) ||
          0
      );
    },
    getConversationStorageKey() {
      return `writer_ai_conversations_${this.getCurrentUserId()}_${Number(
        this.chapterId || (this.article && this.article.article_id) || 0
      )}`;
    },
    generateConversationId() {
      return `bipao-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
    },
    readConversationSessions() {
      if (typeof window === "undefined" || !window.localStorage) {
        return [];
      }
      try {
        const raw = window.localStorage.getItem(this.getConversationStorageKey());
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.filter((item) => item && item.id) : [];
      } catch (error) {
        return [];
      }
    },
    writeConversationSessions(sessions) {
      if (typeof window === "undefined" || !window.localStorage) {
        return;
      }
      const normalizedSessions = Array.isArray(sessions) ? sessions : [];
      window.localStorage.setItem(
        this.getConversationStorageKey(),
        JSON.stringify(normalizedSessions.slice(0, MAX_CONVERSATION_SESSIONS))
      );
    },
    refreshConversationSessions() {
      this.conversationSessions = this.readConversationSessions().sort((a, b) => {
        return Number(b.updated_at || 0) - Number(a.updated_at || 0);
      });
    },
    resumeLatestPendingConversation() {
      if (this.messages.length || this.currentConversationId || this.loading) {
        return;
      }
      const now = Date.now();
      const pendingSession = this.readConversationSessions()
        .sort((a, b) => Number(b.updated_at || 0) - Number(a.updated_at || 0))
        .find((session) => {
          const task = normalizePendingAssistTask(session && session.pendingTask);
          return task
            && task.status === "running"
            && now - Number(task.createdAt || now) <= ASSIST_TASK_RESUME_WINDOW_MS;
        });
      if (pendingSession && pendingSession.id) {
        this.loadConversationSession(pendingSession.id);
      }
    },
    getConversationSessionTitle(session) {
      return String((session && session.title) || "").trim() || "未命名会话";
    },
    formatConversationSessionTime(timestamp) {
      const date = new Date(Number(timestamp || 0));
      if (!Number.isFinite(date.getTime())) {
        return "";
      }
      const pad = (value) => String(value).padStart(2, "0");
      return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
        date.getHours()
      )}:${pad(date.getMinutes())}`;
    },
    buildConversationTitle(messages = this.messages) {
      const firstUserMessage = (Array.isArray(messages) ? messages : []).find(
        (message) => message && message.role === "user"
      );
      const userContent = normalizeGeneratedText(
        firstUserMessage && firstUserMessage.content
      ).replace(/\s+/g, " ");
      if (userContent) {
        return clampText(userContent, 24);
      }

      const firstBlock =
        firstUserMessage &&
        Array.isArray(firstUserMessage.selectionBlocks) &&
        firstUserMessage.selectionBlocks[0];
      const blockText = normalizeGeneratedText(firstBlock && firstBlock.text).replace(
        /\s+/g,
        " "
      );
      if (blockText) {
        return clampText(blockText, 24);
      }

      return "新会话";
    },
    ensureCurrentConversationId() {
      if (!this.currentConversationId) {
        this.currentConversationId = this.generateConversationId();
      }
      return this.currentConversationId;
    },
    normalizeMessageForStorage(message) {
      return {
        id: Number(message && message.id) || Date.now(),
        role: message && message.role === "assistant" ? "assistant" : "user",
        content: String((message && message.content) || ""),
        displayContent: String(
          (message && (message.content || message.displayContent)) || ""
        ),
        reasoningOutput: String((message && message.reasoningOutput) || ""),
        displayReasoningOutput: String(
          (message && (message.reasoningOutput || message.displayReasoningOutput)) ||
            ""
        ),
        reasoningComplete: message && message.reasoningComplete !== undefined
          ? message.reasoningComplete === true
          : !!(message && message.content && message.reasoningOutput),
        reasoningCollapsed: message && message.reasoningCollapsed === true,
        imageGenerating: false,
        imageStatusText: "",
        generatedImages: normalizeGeneratedImages(message && message.generatedImages),
        selectionSnapshot: message && message.selectionSnapshot
          ? {
              from: Number(message.selectionSnapshot.from),
              to: Number(message.selectionSnapshot.to),
              text: String(message.selectionSnapshot.text || ""),
              docSize: Number(message.selectionSnapshot.docSize || 0),
            }
          : null,
        selectionBlocks: normalizeSelectionBlocks(message && message.selectionBlocks),
      };
    },
    hydrateStoredMessage(message) {
      const normalized = this.normalizeMessageForStorage(message);
      return {
        ...normalized,
        displayContent:
          normalized.role === "assistant"
            ? String(normalized.content || "")
            : String(normalized.content || ""),
        displayReasoningOutput: String(normalized.reasoningOutput || ""),
        generatedImages: normalizeGeneratedImages(normalized.generatedImages),
      };
    },
    buildConversationSessionRecord() {
      const messages = (Array.isArray(this.messages) ? this.messages : [])
        .map((message) => this.normalizeMessageForStorage(message))
        .filter((message) => {
          const isPendingAssistant = this.activeAssistTask
            && this.activeAssistTask.status === "running"
            && String(this.activeAssistTask.messageId) === String(message.id);
          return (
            isPendingAssistant ||
            message.content ||
            message.reasoningOutput ||
            (message.generatedImages && message.generatedImages.length) ||
            (message.selectionBlocks && message.selectionBlocks.length)
          );
        });
      if (!messages.length) {
        return null;
      }
      const now = Date.now();
      return {
        id: this.ensureCurrentConversationId(),
        article_id: Number(this.chapterId || (this.article && this.article.article_id) || 0),
        title: this.buildConversationTitle(messages),
        message_count: messages.length,
        updated_at: now,
        created_at: now,
        messages,
        pendingTask: this.activeAssistTask && this.activeAssistTask.status === "running"
          ? normalizePendingAssistTask(this.activeAssistTask)
          : null,
      };
    },
    persistCurrentConversation() {
      const record = this.buildConversationSessionRecord();
      if (!record) {
        return;
      }
      const sessions = this.readConversationSessions();
      const previous = sessions.find((session) => session.id === record.id);
      const nextRecord = {
        ...record,
        created_at: previous && previous.created_at ? previous.created_at : record.created_at,
      };
      const nextSessions = [
        nextRecord,
        ...sessions.filter((session) => session.id !== record.id),
      ].slice(0, MAX_CONVERSATION_SESSIONS);
      this.writeConversationSessions(nextSessions);
      this.conversationSessions = nextSessions;
    },
    scheduleConversationPersist() {
      if (!this.messages.length) {
        return;
      }
      clearTimeout(this.conversationPersistTimer);
      this.conversationPersistTimer = setTimeout(() => {
        this.conversationPersistTimer = null;
        this.persistCurrentConversation();
      }, CONVERSATION_PERSIST_DELAY_MS);
    },
    flushConversationPersist() {
      clearTimeout(this.conversationPersistTimer);
      this.conversationPersistTimer = null;
      this.persistCurrentConversation();
    },
    removeCurrentConversationRecord() {
      if (!this.currentConversationId) {
        return;
      }
      const sessions = this.readConversationSessions().filter((session) => {
        return session.id !== this.currentConversationId;
      });
      this.writeConversationSessions(sessions);
      this.conversationSessions = sessions;
    },
    resetConversationState(options = {}) {
      clearTimeout(this.conversationPersistTimer);
      this.conversationPersistTimer = null;
      this.messages = [];
      this.output = "";
      this.reasoningOutput = "";
      this.errorMessage = "";
      this.statusText = "";
      this.processSteps = [];
      this.activeAssistantMessageId = null;
      this.activeAssistTask = null;
      this.resumeTaskInProgress = false;
      this.nextMessageId = 1;
      this.resultScrollTop = 0;
      this.streamOutputChars = 0;
      this.clearAssistReconnectTimer();
      this.stopAllTypewriters();
      this.stopAllReasoningTypewriters();
      if (!options.keepSessionId) {
        this.currentConversationId = "";
      }
      this.queueResultAutoScroll();
    },
    toggleConversationSidebar() {
      this.refreshConversationSessions();
      this.conversationSidebarVisible = !this.conversationSidebarVisible;
    },
    hideConversationSidebar() {
      this.conversationSidebarVisible = false;
    },
    startNewConversation() {
      if (this.loading || this.hasRunningAssistTask()) {
        uni.showToast({
          title: "当前回复完成后再新建会话",
          icon: "none",
          duration: 1800,
        });
        return;
      }
      this.flushConversationPersist();
      this.resetConversationState({ keepSessionId: false });
      this.currentConversationId = this.generateConversationId();
      this.hideConversationSidebar();
    },
    loadConversationSession(sessionId) {
      if (this.loading || this.hasRunningAssistTask()) {
        uni.showToast({
          title: "当前回复完成后再切换会话",
          icon: "none",
          duration: 1800,
        });
        return;
      }
      const targetId = String(sessionId || "");
      if (!targetId) {
        return;
      }
      this.flushConversationPersist();
      const sessions = this.readConversationSessions();
      const session = sessions.find((item) => item.id === targetId);
      if (!session) {
        this.refreshConversationSessions();
        return;
      }
      this.resetConversationState({ keepSessionId: false });
      this.currentConversationId = session.id;
      this.messages = (Array.isArray(session.messages) ? session.messages : [])
        .map((message) => this.hydrateStoredMessage(message))
        .filter(Boolean);
      this.nextMessageId =
        this.messages.reduce((maxId, message) => {
          return Math.max(maxId, Number(message.id || 0));
        }, 0) + 1;
      const lastAssistant = [...this.messages]
        .reverse()
        .find((message) => message && message.role === "assistant");
      this.output = lastAssistant ? String(lastAssistant.content || "") : "";
      this.reasoningOutput = lastAssistant
        ? String(lastAssistant.reasoningOutput || "")
        : "";
      this.activeAssistTask = normalizePendingAssistTask(session.pendingTask);
      if (this.activeAssistTask && this.activeAssistTask.status === "running") {
        this.activeAssistantMessageId = Number(this.activeAssistTask.messageId);
        this.loading = true;
        this.statusText = "正在续接写作助手";
        this.startTypewriter(this.activeAssistantMessageId);
        this.startReasoningTypewriter(this.activeAssistantMessageId);
        this.$nextTick(() => {
          this.resumePendingAssistIfNeeded();
        });
      }
      this.hideConversationSidebar();
      this.queueResultAutoScroll();
    },
    setThinkingMode(nextMode) {
      if (this.loading) {
        return;
      }
      this.thinkingMode = nextMode === "deep" ? "deep" : "fast";
    },
    toggleDeepThinking() {
      this.setThinkingMode(this.thinkingMode === "deep" ? "fast" : "deep");
    },
    toggleImageGeneration() {
      if (this.loading) {
        return;
      }
      this.imageGenerationEnabled = !this.imageGenerationEnabled;
      if (!this.imageGenerationEnabled) {
        this.closeImageOptionMenu();
      }
    },
    normalizeImageOptionIndex(value, options) {
      const index = Number(value);
      return Number.isInteger(index) && index >= 0 && index < options.length
        ? index
        : 0;
    },
    closeImageOptionMenu() {
      this.imageOptionMenu = {
        ...this.imageOptionMenu,
        visible: false,
      };
    },
    getImageOptionTriggerRect(type, event) {
      const menuType = type === "ratio" ? "ratio" : "style";
      const eventTarget = event && (event.currentTarget || event.target);
      if (eventTarget && typeof eventTarget.getBoundingClientRect === "function") {
        const rect = eventTarget.getBoundingClientRect();
        if (rect && Number(rect.width || 0) > 0) {
          return Promise.resolve(rect);
        }
      }

      const refName = menuType === "ratio"
        ? "imageRatioOptionButton"
        : "imageStyleOptionButton";
      const refTarget = this.$refs && this.$refs[refName];
      const refElement = refTarget && (refTarget.$el || refTarget);
      if (refElement && typeof refElement.getBoundingClientRect === "function") {
        const rect = refElement.getBoundingClientRect();
        if (rect && Number(rect.width || 0) > 0) {
          return Promise.resolve(rect);
        }
      }

      if (typeof uni !== "undefined" && uni.createSelectorQuery) {
        const selector = menuType === "ratio"
          ? ".image-ratio-option-button"
          : ".image-style-option-button";
        return new Promise((resolve) => {
          try {
            uni
              .createSelectorQuery()
              .in(this)
              .select(selector)
              .boundingClientRect((rect) => {
                resolve(rect && Number(rect.width || 0) > 0 ? rect : null);
              })
              .exec();
          } catch (error) {
            resolve(null);
          }
        });
      }

      return Promise.resolve(null);
    },
    positionImageOptionMenu(type, rect) {
      const menuType = type === "ratio" ? "ratio" : "style";
      const options = menuType === "ratio"
        ? IMAGE_ASPECT_RATIO_OPTIONS
        : IMAGE_STYLE_OPTIONS;
      const viewportWidth = typeof window !== "undefined"
        ? Number(window.innerWidth || 360)
        : 360;
      const viewportHeight = typeof window !== "undefined"
        ? Number(window.innerHeight || 640)
        : 640;
      const width = menuType === "ratio" ? 150 : 210;
      const menuHeight = Math.min(300, options.length * 42 + 14);
      const safeRect = rect || {};
      const triggerLeft = Number.isFinite(Number(safeRect.left))
        ? Number(safeRect.left)
        : Math.max(8, viewportWidth - width - 16);
      const triggerTop = Number.isFinite(Number(safeRect.top))
        ? Number(safeRect.top)
        : Math.max(8, viewportHeight - menuHeight - 90);
      const triggerWidth = Number.isFinite(Number(safeRect.width))
        ? Number(safeRect.width)
        : width;
      const triggerBottom = Number.isFinite(Number(safeRect.bottom))
        ? Number(safeRect.bottom)
        : triggerTop;

      let left = triggerLeft + (triggerWidth / 2) - (width / 2);
      if (left + width > viewportWidth - 8) {
        left = viewportWidth - width - 8;
      }
      left = Math.max(8, left);

      let top = triggerTop - menuHeight - 6;
      if (top < 8) {
        top = triggerBottom + 6;
      }
      if (top + menuHeight > viewportHeight - 8) {
        top = Math.max(8, viewportHeight - menuHeight - 8);
      }

      this.imageOptionMenu = {
        visible: true,
        type: menuType,
        left,
        top,
        width,
      };
    },
    async toggleImageOptionMenu(type, event) {
      if (this.loading) {
        return;
      }
      const menuType = type === "ratio" ? "ratio" : "style";
      if (this.imageOptionMenu.visible && this.imageOptionMenu.type === menuType) {
        this.closeImageOptionMenu();
        return;
      }
      const rect = await this.getImageOptionTriggerRect(menuType, event);
      this.positionImageOptionMenu(menuType, rect);
    },
    isImageOptionSelected(index) {
      const selectedIndex = this.imageOptionMenu.type === "ratio"
        ? this.imageAspectRatioIndex
        : this.imageStyleIndex;
      return Number(index) === Number(selectedIndex);
    },
    selectImageOption(index) {
      if (this.imageOptionMenu.type === "ratio") {
        this.imageAspectRatioIndex = this.normalizeImageOptionIndex(
          index,
          IMAGE_ASPECT_RATIO_OPTIONS
        );
      } else {
        this.imageStyleIndex = this.normalizeImageOptionIndex(index, IMAGE_STYLE_OPTIONS);
      }
      this.closeImageOptionMenu();
    },
    getSelectedImageStyleValue() {
      const option = IMAGE_STYLE_OPTIONS[this.imageStyleIndex] || IMAGE_STYLE_OPTIONS[0];
      return String((option && option.value) || "");
    },
    getSelectedImageAspectRatioValue() {
      const option = IMAGE_ASPECT_RATIO_OPTIONS[this.imageAspectRatioIndex] || IMAGE_ASPECT_RATIO_OPTIONS[0];
      return String((option && option.value) || "1:1");
    },
    getTokenInfo() {
      try {
        let rawToken = null;
        if (typeof uni !== "undefined" && uni.getStorageSync) {
          rawToken = uni.getStorageSync("token");
        }
        if (!rawToken && typeof window !== "undefined" && window.localStorage) {
          rawToken = window.localStorage.getItem("token");
        }
        return typeof rawToken === "string"
          ? JSON.parse(rawToken || "null")
          : rawToken || null;
      } catch (error) {
        return null;
      }
    },
    getAuthToken() {
      const token = this.getTokenInfo();
      return token && token.tk ? String(token.tk).trim() : "";
    },
    getAuthHeaders() {
      const authToken = this.getAuthToken();
      return authToken ? { Authorization: "Bearer " + authToken } : {};
    },
    getAiBaseUrl() {
      let overrideBaseUrl = "";
      try {
        overrideBaseUrl =
          typeof uni !== "undefined" && uni.getStorageSync
            ? String(uni.getStorageSync("reader_ai_base_url_override") || "").trim()
            : "";
      } catch (error) {}
      return String(overrideBaseUrl || this.$readerAiBaseUrl || this.$baseUrl || "")
        .replace(/\/+$/, "");
    },
    refreshSelectionInfo() {
      if (!this.editor || !this.editor.state) {
        this.selectionText = "";
        this.selectionSnapshot = null;
        this.cursorPosition = null;
        this.hideSelectionBlockTooltip();
        this.selectionAddButton = {
          ...this.selectionAddButton,
          visible: false,
        };
        this.cursorContext = { before: "", after: "" };
        return;
      }

      const { selection, doc } = this.editor.state;
      const from = Number(selection.from || 0);
      const to = Number(selection.to || from);
      const docEnd = Number(doc.content.size || 0);
      const cursorPosition = Number.isFinite(from) ? from : null;
      const selectedText =
        to > from ? doc.textBetween(from, to, "\n").trim() : "";
      const before = doc.textBetween(
        Math.max(0, from - MAX_CONTEXT_CHARS),
        from,
        "\n"
      );
      const after = doc.textBetween(
        to,
        Math.min(docEnd, to + MAX_CONTEXT_CHARS),
        "\n"
      );

      this.selectionText = selectedText;
      this.cursorPosition = cursorPosition;
      this.selectionSnapshot =
        to > from
          ? {
              from,
              to,
              text: selectedText,
              docSize: docEnd,
            }
          : null;
      this.cursorContext = {
        before,
        after,
      };
    },
    bindEditorSelectionListener() {
      if (!this.editor || this._boundEditor === this.editor) {
        return;
      }

      this.unbindEditorSelectionListener();
      this._boundEditor = this.editor;
      this._selectionUpdateHandler = () => {
        this.refreshSelectionInfo();
        this.scheduleSelectionButtonUpdate();
      };

      if (typeof this.editor.on === "function") {
        this.editor.on("selectionUpdate", this._selectionUpdateHandler);
        this.editor.on("transaction", this._selectionUpdateHandler);
      }

      this.refreshSelectionInfo();
      this.scheduleSelectionButtonUpdate();
    },
    unbindEditorSelectionListener(editor = this._boundEditor) {
      if (editor && this._selectionUpdateHandler && typeof editor.off === "function") {
        editor.off("selectionUpdate", this._selectionUpdateHandler);
        editor.off("transaction", this._selectionUpdateHandler);
      }
      if (!editor || editor === this._boundEditor) {
        this._boundEditor = null;
        this._selectionUpdateHandler = null;
      }
    },
    scheduleSelectionButtonUpdate() {
      if (typeof requestAnimationFrame === "undefined") {
        this.updateSelectionAddButton();
        return;
      }
      if (this._selectionButtonFrame) {
        cancelAnimationFrame(this._selectionButtonFrame);
      }
      this._selectionButtonFrame = requestAnimationFrame(() => {
        this._selectionButtonFrame = null;
        this.updateSelectionAddButton();
      });
    },
    updateSelectionAddButton() {
      if (
        this.selectionAddButtonSuppressed ||
        this.isPanelOpen() ||
        !this.selectionText ||
        !this.selectionSnapshot ||
        !this.editor ||
        !this.editor.view ||
        typeof this.editor.view.coordsAtPos !== "function"
      ) {
        this.selectionAddButton = {
          ...this.selectionAddButton,
          visible: false,
        };
        return;
      }

      try {
        const docSize = this.editor.state && this.editor.state.doc
          ? Number(this.editor.state.doc.content.size || 0)
          : 0;
        const targetPosition = Math.max(
          0,
          Math.min(Number(this.selectionSnapshot.to || 0), docSize)
        );
        const coords = this.editor.view.coordsAtPos(targetPosition);
        const buttonSize = 38;
        const gap = 8;
        const viewportWidth =
          typeof window !== "undefined" ? Number(window.innerWidth || 0) : 0;
        const viewportHeight =
          typeof window !== "undefined" ? Number(window.innerHeight || 0) : 0;
        let left = Number(coords.right || coords.left || 0) + gap;
        let top = Number(coords.top || 0) - gap;

        if (viewportWidth && left + buttonSize > viewportWidth - gap) {
          left = Math.max(gap, Number(coords.left || 0) - buttonSize - gap);
        }
        if (viewportHeight) {
          top = Math.max(gap, Math.min(top, viewportHeight - buttonSize - gap));
        } else {
          top = Math.max(gap, top);
        }

        this.selectionAddButton = {
          visible: true,
          left,
          top,
        };
      } catch (error) {
        this.selectionAddButton = {
          ...this.selectionAddButton,
          visible: false,
        };
      }
    },
    hideSelectionAddButton(clearSelection = false) {
      this.selectionAddButton = {
        ...this.selectionAddButton,
        visible: false,
      };
      if (clearSelection) {
        this.selectionText = "";
        this.selectionSnapshot = null;
      }
    },
    addSelectionToPrompt() {
      this.refreshSelectionInfo();
      const selectedText = buildSelectionBlockText(this.selectionText);
      if (!selectedText) {
        uni.showToast({
          title: "请先选中段落",
          icon: "none",
          duration: 1600,
        });
        return;
      }

      const availableSlots = MAX_SELECTION_BLOCKS - this.pendingSelectionBlocks.length;
      if (availableSlots <= 0) {
        uni.showToast({
          title: "段落块已达上限",
          icon: "none",
          duration: 1600,
        });
        return;
      }

      const snapshot = this.selectionSnapshot || {};
      const now = Date.now();
      const nextBlock = {
        id: `selection-${now}-${this.pendingSelectionBlocks.length}`,
        text: selectedText,
        from: snapshot.from === undefined ? null : snapshot.from,
        to: snapshot.to === undefined ? null : snapshot.to,
        docSize: snapshot.docSize === undefined ? null : snapshot.docSize,
      };
      this.pendingSelectionBlocks = this.pendingSelectionBlocks.concat(nextBlock);
      this.selectionAddButtonSuppressed = true;
      this.hideSelectionAddButton(true);
      if (this.editor) {
        this.editor.commands.blur();
      }
      const wasOpen = this.isPanelOpen();
      if (wasOpen) {
        if (this.$refs.popup && typeof this.$refs.popup.open === "function") {
          this.$refs.popup.open("bottom");
        }
      } else {
        this.$emit("open");
        this.initPanelHeight();
        if (this.$refs.popup && typeof this.$refs.popup.open === "function") {
          this.$refs.popup.open("bottom");
        }
        this.schedulePanelViewportRefresh();
        this.resumePendingAssistIfNeeded();
      }
      uni.showToast({
        title: "已添加段落",
        icon: "none",
        duration: 1400,
      });
    },
    removePendingSelectionBlock(blockId) {
      this.pendingSelectionBlocks = this.pendingSelectionBlocks.filter((block) => {
        return block && block.id !== blockId;
      });
      this.hideSelectionBlockTooltip();
    },
    getSelectionBlockLabel(block, blockIndex = 0) {
      return `段落${Number(blockIndex || 0) + 1}：${summarizeSelectionBlockText(block && block.text)}`;
    },
    getElementRect(element) {
      const target = element && element.$el ? element.$el : element;
      if (target && typeof target.getBoundingClientRect === "function") {
        return target.getBoundingClientRect();
      }
      return null;
    },
    showSelectionBlockTooltip(block, event) {
      const text = normalizeGeneratedText(block && block.text);
      if (!text) {
        return;
      }
      const blockIndex = this.resolveSelectionBlockIndex(block);
      const viewportWidth =
        typeof window !== "undefined" ? Number(window.innerWidth || 0) : 0;
      const viewportHeight =
        typeof window !== "undefined" ? Number(window.innerHeight || 0) : 0;
      const panelRect = this.getElementRect(this.$refs.panel);
      const targetRect = this.getElementRect(
        event && (event.currentTarget || event.target)
      );
      const sourceEvent = event && (event.changedTouches && event.changedTouches[0]
        ? event.changedTouches[0]
        : event);
      const clientX = sourceEvent && Number.isFinite(Number(sourceEvent.clientX))
        ? Number(sourceEvent.clientX)
        : targetRect
          ? Math.round(targetRect.left + targetRect.width / 2)
          : Math.round((viewportWidth || 360) / 2);
      const clientY = sourceEvent && Number.isFinite(Number(sourceEvent.clientY))
        ? Number(sourceEvent.clientY)
        : targetRect
          ? Math.round(targetRect.bottom)
          : Math.round((viewportHeight || 640) / 2);
      const panelLeft = panelRect ? Number(panelRect.left || 0) : 0;
      const panelTop = panelRect ? Number(panelRect.top || 0) : 0;
      const panelWidth = panelRect
        ? Number(panelRect.width || 0)
        : (viewportWidth || 360);
      const panelHeight = panelRect
        ? Number(panelRect.height || 0)
        : (viewportHeight || 640);
      const tooltipWidth = Math.min(320, Math.max(240, panelWidth - 32));
      const tooltipHeight = 260;
      const maxLeft = Math.max(12, panelWidth - tooltipWidth - 12);
      const left = panelWidth
        ? Math.max(12, Math.min(clientX - panelLeft - tooltipWidth / 2, maxLeft))
        : 12;
      let top = panelHeight
        ? Math.max(12, Math.min(clientY - panelTop + 12, panelHeight - tooltipHeight - 12))
        : 80;
      if (
        targetRect &&
        panelHeight &&
        top + tooltipHeight > panelHeight - 12
      ) {
        top = Math.max(12, Number(targetRect.top || clientY) - panelTop - tooltipHeight - 12);
      }

      this.selectionBlockTooltip = {
        visible: true,
        title: `段落${blockIndex + 1}`,
        text,
        left,
        top,
        width: tooltipWidth,
      };
    },
    hideSelectionBlockTooltip() {
      this.selectionBlockTooltip = {
        ...this.selectionBlockTooltip,
        visible: false,
      };
    },
    resolveSelectionBlockIndex(targetBlock) {
      const id = targetBlock && targetBlock.id;
      const pendingIndex = this.pendingSelectionBlocks.findIndex((block) => {
        return block && block.id === id;
      });
      if (pendingIndex !== -1) {
        return pendingIndex;
      }
      for (const message of this.messages) {
        const blocks = Array.isArray(message && message.selectionBlocks)
          ? message.selectionBlocks
          : [];
        const messageIndex = blocks.findIndex((block) => block && block.id === id);
        if (messageIndex !== -1) {
          return messageIndex;
        }
      }
      return 0;
    },
    clonePendingSelectionBlocks() {
      return normalizeSelectionBlocks(this.pendingSelectionBlocks);
    },
    buildPromptWithSelectionBlocks(promptText = "", selectionBlocks = []) {
      const prompt = String(promptText || "").trim();
      const blockText = formatSelectionBlocksForPrompt(selectionBlocks);
      return [prompt, blockText].filter(Boolean).join("\n\n");
    },
    formatMessageForModel(message) {
      const content = String((message && message.content) || "").trim();
      const blockText = formatSelectionBlocksForPrompt(
        message && message.selectionBlocks
      );
      const imageText = normalizeGeneratedImages(message && message.generatedImages)
        .map((image, index) => {
          const prompt = normalizeGeneratedText(image.prompt);
          return `【已生成图片 ${index + 1}】${image.url}${prompt ? `\n提示词：${prompt}` : ""}`;
        })
        .join("\n\n");
      return [content, blockText, imageText].filter(Boolean).join("\n\n");
    },
    getEditorPlainText() {
      if (!this.editor || !this.editor.state || !this.editor.state.doc) {
        return "";
      }
      return this.editor.state.doc.textBetween(
        0,
        this.editor.state.doc.content.size,
        "\n"
      );
    },
    collectEditorReplaceBlocks() {
      if (!this.editor || !this.editor.state || !this.editor.state.doc) {
        return [];
      }
      const blocks = [];
      let charOffset = 0;
      this.editor.state.doc.descendants((node, position) => {
        if (!node || !node.isTextblock) {
          return true;
        }
        const rawText = String(node.textContent || "");
        const text = rawText.trim();
        const startOffset = charOffset;
        charOffset += rawText.length + 1;
        if (text) {
          blocks.push({
            index: blocks.length + 1,
            from: position,
            to: position + node.nodeSize,
            char_start: startOffset,
            char_end: startOffset + rawText.length,
            text,
          });
        }
        return false;
      });
      return blocks;
    },
    findUserMessageBefore(targetMessage) {
      const targetIndex = this.messages.findIndex((message) => {
        return message && targetMessage && message.id === targetMessage.id;
      });
      const endIndex = targetIndex === -1 ? this.messages.length : targetIndex;
      for (let index = endIndex - 1; index >= 0; index -= 1) {
        const message = this.messages[index];
        if (message && message.role === "user") {
          return message;
        }
      }
      return null;
    },
    buildSmartReplaceConversation(targetMessage) {
      const targetIndex = this.messages.findIndex((message) => {
        return message && targetMessage && message.id === targetMessage.id;
      });
      const visibleMessages = targetIndex === -1
        ? this.messages
        : this.messages.slice(0, targetIndex + 1);
      return visibleMessages
        .slice(-12)
        .map((message) => ({
          role: message && message.role === "assistant" ? "assistant" : "user",
          content: this.formatMessageForModel(message),
        }))
        .filter((message) => String(message.content || "").trim());
    },
    buildSmartReplacePayload(draftText, message) {
      const novelInfo = this.article && this.article.novel_info
        ? this.article.novel_info
        : {};
      const userMessage = this.findUserMessageBefore(message);
      return {
        article_id: Number(this.chapterId || this.article.article_id || 0),
        novel_id: Number(novelInfo.novel_id || this.article.novel_id || 0),
        edit_session_id: this.editSessionId,
        draft_text: normalizeGeneratedText(draftText),
        question: userMessage ? this.formatMessageForModel(userMessage) : "",
        answer: String((message && message.content) || ""),
        messages: this.buildSmartReplaceConversation(message),
        cursor_context: this.cursorContext,
        current_chapter: {
          article_id: Number(this.chapterId || this.article.article_id || 0),
          novel_id: Number(novelInfo.novel_id || this.article.novel_id || 0),
          title: String(this.article.title || ""),
          plain_text: this.getEditorPlainText(),
        },
        blocks: this.collectEditorReplaceBlocks(),
      };
    },
    buildConversationPayload(excludeMessageId = null) {
      const excludeIds = Array.isArray(excludeMessageId)
        ? excludeMessageId.map((id) => String(id))
        : (excludeMessageId === null || excludeMessageId === undefined
          ? []
          : [String(excludeMessageId)]);
      return (Array.isArray(this.messages) ? this.messages : [])
        .filter((message) => {
          return !message || !excludeIds.includes(String(message.id));
        })
        .slice(-12)
        .map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: this.formatMessageForModel(message),
        }))
        .filter((message) => String(message.content || "").trim());
    },
    buildRequestPayload(promptText = "", excludeMessageId = null) {
      const novelInfo = this.article && this.article.novel_info
        ? this.article.novel_info
        : {};
      const cursorPosition = Number.isFinite(Number(this.cursorPosition))
        ? Number(this.cursorPosition)
        : null;
      return {
        article_id: Number(this.chapterId || this.article.article_id || 0),
        novel_id: Number(novelInfo.novel_id || this.article.novel_id || 0),
        edit_session_id: this.editSessionId,
        mode: "chat",
        thinking_mode: this.thinkingMode === "deep" ? "deep" : "fast",
        features: {
          image_generation: this.imageGenerationEnabled === true,
          image_generation_style: this.imageGenerationEnabled
            ? this.getSelectedImageStyleValue()
            : "",
          image_generation_aspect_ratio: this.imageGenerationEnabled
            ? this.getSelectedImageAspectRatioValue()
            : "1:1",
        },
        prompt: String(promptText || this.prompt || "").trim(),
        messages: this.buildConversationPayload(excludeMessageId),
        selection: {
          text: "",
          from: cursorPosition,
          to: cursorPosition,
        },
        cursor_context: this.cursorContext,
        current_chapter: {
          article_id: Number(this.chapterId || this.article.article_id || 0),
          novel_id: Number(novelInfo.novel_id || this.article.novel_id || 0),
          title: String(this.article.title || ""),
          content: String(this.article.content || ""),
          plain_text: this.getEditorPlainText(),
        },
      };
    },
    buildAssistStreamPayload(messageId, options = {}) {
      const taskState = normalizePendingAssistTask(
        options.taskState || this.activeAssistTask || this.createActiveAssistTask(messageId)
      );
      const targetMessage = this.messages.find((message) => {
        return message && String(message.id) === String(messageId);
      });
      const userMessage = this.findUserMessageBefore(targetMessage);
      const promptText = options.promptText !== undefined
        ? options.promptText
        : (userMessage ? this.formatMessageForModel(userMessage) : "");
      const excludeIds = [
        messageId,
        userMessage && userMessage.id,
      ].filter((id) => id !== null && id !== undefined && id !== "");
      return {
        ...this.buildRequestPayload(promptText, excludeIds),
        session_id: this.ensureCurrentConversationId(),
        message_id: String(messageId),
        task_id: taskState ? taskState.taskId : this.buildAssistTaskId(messageId),
        resume_from_event_id: taskState && taskState.lastEventId
          ? taskState.lastEventId
          : 0,
      };
    },
    abortRequest() {
      if (this.abortController) {
        try {
          this.abortController.abort();
        } catch (error) {}
      }
      this.abortController = null;
    },
    stopAssist() {
      const messageId = this.activeAssistantMessageId
        || (this.activeAssistTask && this.activeAssistTask.messageId);
      if (!messageId) {
        return;
      }
      this.abortRequest();
      this.clearAssistReconnectTimer();
      this.resumeTaskInProgress = false;
      this.setActiveAssistantImageGenerationState(false);
      const target = this.messages.find((message) => {
        return message && String(message.id) === String(messageId);
      });
      if (
        target
        && target.role === "assistant"
        && !String(target.content || "").trim()
        && !String(target.reasoningOutput || "").trim()
        && !this.getAssistantGeneratedImages(target).length
      ) {
        target.content = "已停止生成";
      }
      this.appendProcessStep("stopped", "已停止生成");
      this.completeAssistTask(messageId, "stopped");
    },
    hasRunningAssistTask() {
      return !!(
        this.activeAssistTask &&
        this.activeAssistTask.status === "running"
      );
    },
    buildAssistTaskId(messageId) {
      return [
        "writer-ai",
        Number(this.chapterId || (this.article && this.article.article_id) || 0),
        this.ensureCurrentConversationId(),
        messageId,
        createTaskInstanceId(),
      ].join(":");
    },
    createActiveAssistTask(messageId) {
      return normalizePendingAssistTask({
        taskId: this.buildAssistTaskId(messageId),
        sessionId: this.ensureCurrentConversationId(),
        messageId,
        articleId: Number(this.chapterId || (this.article && this.article.article_id) || 0),
        thinkingMode: this.thinkingMode,
        status: "running",
        lastEventId: 0,
        reconnectAttempts: 0,
        createdAt: Date.now(),
      });
    },
    updateActiveAssistTask(patch = {}) {
      const nextTask = normalizePendingAssistTask({
        ...(this.activeAssistTask || {}),
        ...patch,
      });
      this.activeAssistTask = nextTask;
      this.scheduleConversationPersist();
      return nextTask;
    },
    clearActiveAssistTask() {
      this.activeAssistTask = null;
      this.clearAssistReconnectTimer();
      this.scheduleConversationPersist();
    },
    clearAssistReconnectTimer() {
      if (this.assistReconnectTimer) {
        clearTimeout(this.assistReconnectTimer);
        this.assistReconnectTimer = null;
      }
    },
    scheduleAssistReconnect() {
      if (!this.hasRunningAssistTask() || this.assistReconnectTimer) {
        return;
      }
      const task = this.activeAssistTask;
      const reconnectAttempts = Number(task && task.reconnectAttempts || 0);
      if (reconnectAttempts >= MAX_ASSIST_RECONNECT_ATTEMPTS) {
        const message = "写作助手连接多次中断，请重新发送本次问题";
        this.errorMessage = message;
        this.appendProcessStep("reconnect_failed", message);
        this.setActiveAssistantImageGenerationState(false);
        this.completeAssistTask(task && task.messageId, "error");
        return;
      }
      this.updateActiveAssistTask({
        reconnectAttempts: reconnectAttempts + 1,
      });
      this.loading = true;
      this.statusText = `连接中断，正在尝试续接（${reconnectAttempts + 1}/${MAX_ASSIST_RECONNECT_ATTEMPTS}）`;
      this.appendProcessStep("reconnect", this.statusText);
      this.assistReconnectTimer = setTimeout(() => {
        this.assistReconnectTimer = null;
        this.resumePendingAssistIfNeeded();
      }, ASSIST_RECONNECT_DELAY_MS);
      this.scheduleConversationPersist();
    },
    completeAssistTask(messageId, status = "completed") {
      this.clearAssistReconnectTimer();
      this.stopTypewriter(messageId);
      this.stopReasoningTypewriter(messageId);
      const target = this.messages.find((message) => {
        return message && String(message.id) === String(messageId);
      });
      if (target && target.role === "assistant") {
        target.displayContent = String(target.content || "");
        target.displayReasoningOutput = String(target.reasoningOutput || "");
        target.imageGenerating = false;
        target.imageStatusText = "";
        if (target.reasoningOutput) {
          this.setAssistantReasoningComplete(target.id, true);
        }
      }
      this.loading = false;
      this.statusText = "";
      this.activeAssistantMessageId = null;
      if (
        this.activeAssistTask &&
        String(this.activeAssistTask.messageId) === String(messageId)
      ) {
        this.activeAssistTask = null;
      }
      this.flushConversationPersist();
    },
    resetAssistantMessageForRestart(messageId) {
      const target = this.messages.find((message) => {
        return message && String(message.id) === String(messageId);
      });
      if (!target || target.role !== "assistant") {
        return;
      }
      target.content = "";
      target.displayContent = "";
      target.reasoningOutput = "";
      target.displayReasoningOutput = "";
      target.reasoningComplete = false;
      target.reasoningCollapsed = false;
      target.imageGenerating = false;
      target.imageStatusText = "";
      this.output = "";
      this.reasoningOutput = "";
      this.streamOutputChars = 0;
      this.errorMessage = "";
      this.stopTypewriter(messageId);
      this.stopReasoningTypewriter(messageId);
      this.scheduleConversationPersist();
    },
    appendProcessStep(stage, message) {
      const text = String(message || "").trim();
      if (!text) {
        return;
      }
      const last = this.processSteps[this.processSteps.length - 1];
      if (last && last.stage === stage && last.message === text) {
        return;
      }
      const nextSteps = this.processSteps.concat({
        id: Date.now() + "-" + this.processSteps.length,
        stage: stage || "status",
        message: text,
      });
      this.processSteps = nextSteps.slice(-50);
    },
    isImageGenerationStatusText(text) {
      const value = String(text || "");
      return !!value && /生成图片|图片生成|图片工具/.test(value) && !/失败|已生成/.test(value);
    },
    setAssistantImageGenerationState(messageId, generating, statusText = "") {
      const target = this.messages.find((message) => {
        return message && String(message.id) === String(messageId);
      });
      if (!target || target.role !== "assistant") {
        return;
      }
      const text = String(statusText || (generating ? "正在生成图片" : "")).trim();
      if (this.$set) {
        this.$set(target, "imageGenerating", generating === true);
        this.$set(target, "imageStatusText", text);
      } else {
        target.imageGenerating = generating === true;
        target.imageStatusText = text;
      }
      this.queueResultAutoScroll();
      this.scheduleConversationPersist();
    },
    setActiveAssistantImageGenerationState(generating, statusText = "") {
      if (!this.activeAssistantMessageId) {
        return;
      }
      this.setAssistantImageGenerationState(
        this.activeAssistantMessageId,
        generating,
        statusText
      );
    },
    queueResultAutoScroll() {
      if (this._resultScrollQueued) {
        return;
      }
      this._resultScrollQueued = true;
      this.$nextTick(() => {
        const scrollToBottom = () => {
          this._resultScrollQueued = false;
          this._resultScrollFrame = null;
          this._resultScrollTimer = null;
          this.autoExpandPanelForContent();
          this.resultScrollTop =
            this.resultScrollTop === RESULT_SCROLL_BOTTOM
              ? RESULT_SCROLL_BOTTOM_ALT
              : RESULT_SCROLL_BOTTOM;
        };

        if (typeof requestAnimationFrame === "function") {
          this._resultScrollFrame = requestAnimationFrame(scrollToBottom);
          return;
        }
        this._resultScrollTimer = setTimeout(scrollToBottom, 16);
      });
    },
    autoExpandPanelForContent() {
      if (!this.screenHeight || !this.panelHeight) return;

      const maxPanelHeight = this.screenHeight * 0.95;
      if (this.panelHeight >= maxPanelHeight) return;

      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.chat-scroll').scrollOffset();
        query.select('.chat-scroll').boundingClientRect();
        query.exec((res) => {
          if (!res || !res[0] || !res[1]) return;

          const scrollInfo = res[0];
          const rectInfo = res[1];
          const contentHeight = scrollInfo.scrollHeight || 0;
          const availableHeight = this.panelHeight - 180;

          if (contentHeight > availableHeight) {
            const newHeight = Math.min(contentHeight + 200, maxPanelHeight);
            if (newHeight > this.panelHeight) {
              this.panelHeight = newHeight;
              this.panelHeightRatio = this.screenHeight
                ? newHeight / this.screenHeight
                : this.panelHeightRatio;
            }
          }
        });
      });
    },
    getAssistantDisplayContent(message) {
      if (!message || message.role !== "assistant") {
        return String((message && message.content) || "");
      }
      if (typeof message.displayContent === "string") {
        return message.displayContent;
      }
      return String(message.content || "");
    },
    getAssistantReasoningDisplayContent(message) {
      if (!message || message.role !== "assistant") {
        return String((message && message.reasoningOutput) || "");
      }
      if (typeof message.displayReasoningOutput === "string") {
        return message.displayReasoningOutput;
      }
      return String(message.reasoningOutput || "");
    },
    isAssistantImageGenerating(message) {
      return !!(message && message.role === "assistant" && message.imageGenerating === true);
    },
    getAssistantImageStatus(message) {
      return String((message && message.imageStatusText) || "正在生成图片");
    },
    isAssistantReasoningCollapsible(message) {
      if (!message || message.role !== "assistant") {
        return false;
      }
      if (!this.getAssistantReasoningDisplayContent(message)) {
        return false;
      }
      if (message.reasoningComplete === true) {
        return true;
      }
      if (String(message.content || "").trim()) {
        return true;
      }
      return !(
        this.loading &&
        String(this.activeAssistantMessageId) === String(message.id)
      );
    },
    isAssistantReasoningCollapsed(message) {
      return this.isAssistantReasoningCollapsible(message)
        && message
        && message.reasoningCollapsed === true;
    },
    toggleAssistantReasoning(message) {
      if (!this.isAssistantReasoningCollapsible(message)) {
        return;
      }
      if (this.$set) {
        this.$set(message, "reasoningCollapsed", !message.reasoningCollapsed);
      } else {
        message.reasoningCollapsed = !message.reasoningCollapsed;
      }
      this.scheduleConversationPersist();
      this.queueResultAutoScroll();
    },
    setAssistantReasoningComplete(messageId, complete = true) {
      const target = this.messages.find((message) => {
        return message && String(message.id) === String(messageId);
      });
      if (!target || target.role !== "assistant") {
        return;
      }
      if (this.$set) {
        this.$set(target, "reasoningComplete", complete === true);
      } else {
        target.reasoningComplete = complete === true;
      }
    },
    stopTypewriter(messageId) {
      const timer = this.typewriterTimers && this.typewriterTimers[messageId];
      if (!timer) {
        return;
      }
      clearInterval(timer);
      if (this.$delete) {
        this.$delete(this.typewriterTimers, messageId);
      } else {
        delete this.typewriterTimers[messageId];
      }
    },
    stopAllTypewriters() {
      Object.keys(this.typewriterTimers || {}).forEach((messageId) => {
        this.stopTypewriter(messageId);
      });
    },
    startTypewriter(messageId) {
      const target = this.messages.find((message) => message && message.id === messageId);
      if (!target || target.role !== "assistant") {
        return;
      }
      if (typeof target.displayContent !== "string") {
        this.$set(target, "displayContent", String(target.displayContent || ""));
      }
      if (String(target.displayContent || "").length >= String(target.content || "").length) {
        target.displayContent = String(target.content || "");
        this.stopTypewriter(messageId);
        return;
      }
      if (this.typewriterTimers[messageId]) {
        return;
      }

      const timer = setInterval(() => {
        const currentTarget = this.messages.find((message) => {
          return message && message.id === messageId;
        });
        if (!currentTarget || currentTarget.role !== "assistant") {
          this.stopTypewriter(messageId);
          return;
        }

        const fullText = String(currentTarget.content || "");
        const displayText = String(currentTarget.displayContent || "");
        if (displayText.length >= fullText.length) {
          currentTarget.displayContent = fullText;
          this.stopTypewriter(messageId);
          return;
        }

        const step = getTypewriterStepSize(fullText.length - displayText.length);
        const nextDisplayText = fullText.slice(0, displayText.length + step);
        currentTarget.displayContent = nextDisplayText;
        this.queueResultAutoScroll();

        if (nextDisplayText.length >= fullText.length) {
          this.stopTypewriter(messageId);
        }
      }, TYPEWRITER_INTERVAL_MS);

      if (this.$set) {
        this.$set(this.typewriterTimers, messageId, timer);
      } else {
        this.typewriterTimers[messageId] = timer;
      }
    },
    stopReasoningTypewriter(messageId) {
      const timer = this.reasoningTypewriterTimers && this.reasoningTypewriterTimers[messageId];
      if (!timer) {
        return;
      }
      clearInterval(timer);
      if (this.$delete) {
        this.$delete(this.reasoningTypewriterTimers, messageId);
      } else {
        delete this.reasoningTypewriterTimers[messageId];
      }
    },
    stopAllReasoningTypewriters() {
      Object.keys(this.reasoningTypewriterTimers || {}).forEach((messageId) => {
        this.stopReasoningTypewriter(messageId);
      });
    },
    startReasoningTypewriter(messageId) {
      const target = this.messages.find((message) => message && message.id === messageId);
      if (!target || target.role !== "assistant") {
        return;
      }
      if (typeof target.displayReasoningOutput !== "string") {
        this.$set(target, "displayReasoningOutput", String(target.displayReasoningOutput || ""));
      }
      if (
        String(target.displayReasoningOutput || "").length >=
        String(target.reasoningOutput || "").length
      ) {
        target.displayReasoningOutput = String(target.reasoningOutput || "");
        this.stopReasoningTypewriter(messageId);
        return;
      }
      if (this.reasoningTypewriterTimers[messageId]) {
        return;
      }

      const timer = setInterval(() => {
        const currentTarget = this.messages.find((message) => {
          return message && message.id === messageId;
        });
        if (!currentTarget || currentTarget.role !== "assistant") {
          this.stopReasoningTypewriter(messageId);
          return;
        }

        const fullText = String(currentTarget.reasoningOutput || "");
        const displayText = String(currentTarget.displayReasoningOutput || "");
        if (displayText.length >= fullText.length) {
          currentTarget.displayReasoningOutput = fullText;
          this.stopReasoningTypewriter(messageId);
          return;
        }

        const step = getTypewriterStepSize(fullText.length - displayText.length);
        const nextDisplayText = fullText.slice(0, displayText.length + step);
        currentTarget.displayReasoningOutput = nextDisplayText;
        this.queueResultAutoScroll();

        if (nextDisplayText.length >= fullText.length) {
          this.stopReasoningTypewriter(messageId);
        }
      }, REASONING_TYPEWRITER_INTERVAL_MS);

      if (this.$set) {
        this.$set(this.reasoningTypewriterTimers, messageId, timer);
      } else {
        this.reasoningTypewriterTimers[messageId] = timer;
      }
    },
    cloneSelectionSnapshot() {
      if (!this.selectionSnapshot) {
        return null;
      }
      return {
        from: this.selectionSnapshot.from,
        to: this.selectionSnapshot.to,
        text: this.selectionSnapshot.text,
        docSize: this.selectionSnapshot.docSize,
      };
    },
    appendChatMessage(role, content, extra = {}) {
      const message = {
        id: this.nextMessageId++,
        role: role === "assistant" ? "assistant" : "user",
        content: String(content || ""),
        displayContent: role === "assistant" ? "" : String(content || ""),
        reasoningOutput: "",
        displayReasoningOutput: "",
        reasoningComplete: false,
        reasoningCollapsed: false,
        imageGenerating: false,
        imageStatusText: "",
        generatedImages: [],
        selectionSnapshot: null,
        selectionBlocks: [],
        ...extra,
      };
      if (message.role === "assistant" && typeof message.displayContent !== "string") {
        message.displayContent = "";
      }
      if (message.role === "assistant" && typeof message.displayReasoningOutput !== "string") {
        message.displayReasoningOutput = "";
      }
      this.messages.push(message);
      this.queueResultAutoScroll();
      this.scheduleConversationPersist();
      return message;
    },
    getActiveAssistantMessage() {
      return this.messages.find((message) => {
        return message && message.id === this.activeAssistantMessageId;
      }) || null;
    },
    clearConversation() {
      if (this.loading || this.hasRunningAssistTask()) {
        return;
      }
      this.removeCurrentConversationRecord();
      this.resetConversationState({ keepSessionId: false });
    },
    async runAssist() {
      return this.submitChat();
    },
    async submitChat() {
      if (this.hasRunningAssistTask()) {
        this.resumePendingAssistIfNeeded();
        return;
      }
      if (this.loading || !this.canRun) {
        if (!this.canRun) {
          uni.showToast({
            title: "请先输入问题或添加段落",
            icon: "none",
            duration: 1800,
          });
        }
        return;
      }

      this.refreshSelectionInfo();
      this.abortRequest();
      this.ensureCurrentConversationId();
      const promptText = String(this.prompt || "").trim();
      const selectionBlocks = this.clonePendingSelectionBlocks();
      const modelPrompt = this.buildPromptWithSelectionBlocks(
        promptText,
        selectionBlocks
      );
      const selectionSnapshot = this.cloneSelectionSnapshot();
      this.output = "";
      this.reasoningOutput = "";
      this.errorMessage = "";
      this.statusText = "正在连接写作助手";
      this.closeImageOptionMenu();
      this.processSteps = [];
      this.processExpanded = true;
      this.reasoningExpanded = true;
      this.resultScrollTop = 0;
      this.streamOutputChars = 0;
      this.appendProcessStep("client_start", "正在连接写作助手");
      const userMessage = this.appendChatMessage("user", promptText, {
        selectionBlocks,
      });
      this.prompt = "";
      this.pendingSelectionBlocks = [];
      this.hideSelectionBlockTooltip();
      const assistantMessage = this.appendChatMessage("assistant", "", {
        reasoningOutput: "",
        selectionSnapshot,
      });
      this.activeAssistantMessageId = assistantMessage.id;
      this.activeAssistTask = this.createActiveAssistTask(assistantMessage.id);
      this.loading = true;

      try {
        const requestPayload = this.buildAssistStreamPayload(assistantMessage.id, {
          taskState: this.activeAssistTask,
          promptText: modelPrompt,
        });
        await this.streamAssistRequest(assistantMessage.id, requestPayload);
        if (this.hasRunningAssistTask()) {
          this.scheduleAssistReconnect();
        }
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }
        if (this.hasRunningAssistTask() && !(error && error.statusCode >= 400 && error.statusCode < 500)) {
          this.scheduleAssistReconnect();
          return;
        }
		showInsufficientRedstoneOptions(error);
        this.errorMessage = error.message || "写作助手暂时没有响应";
        this.appendProcessStep("error", this.errorMessage);
        this.completeAssistTask(assistantMessage.id, "error");
        this.scheduleConversationPersist();
      } finally {
        this.loading = this.hasRunningAssistTask();
        if (!this.loading) {
          this.statusText = "";
          this.activeAssistantMessageId = null;
        }
        this.abortController = null;
        this.flushConversationPersist();
      }
    },
    async streamAssistRequest(messageId, requestPayload) {
      this.abortRequest();
      this.activeAssistantMessageId = Number(messageId);
      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      this.abortController = controller;

      const response = await fetch(this.getAiBaseUrl() + STREAM_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/x-ndjson",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(requestPayload),
        signal: controller ? controller.signal : undefined,
      });

      if (!response.ok) {
        let message = "写作助手请求失败";
		let code = "";
        try {
          const data = await response.json();
          message = data.msg || data.message || message;
		  code = data.code || "";
        } catch (error) {}
        const requestError = new Error(message);
        requestError.statusCode = response.status;
		requestError.code = code;
        throw requestError;
      }

      if (!response.body || !response.body.getReader) {
        const text = await response.text();
        this.processNdjsonBlock(text);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        buffer = this.consumeStreamBuffer(buffer);
      }

      buffer += decoder.decode();
      if (buffer.trim()) {
        this.processNdjsonBlock(buffer);
      }
    },
    async resumePendingAssistIfNeeded() {
      if (this.resumeTaskInProgress || this.abortController) {
        return;
      }
      const task = normalizePendingAssistTask(this.activeAssistTask);
      if (!task || task.status !== "running") {
        return;
      }
      const target = this.messages.find((message) => {
        return message && String(message.id) === String(task.messageId);
      });
      if (!target) {
        this.clearActiveAssistTask();
        this.loading = false;
        return;
      }

      this.resumeTaskInProgress = true;
      this.loading = true;
      this.activeAssistantMessageId = Number(task.messageId);
      this.statusText = "正在续接写作助手";
      this.startTypewriter(task.messageId);
      this.startReasoningTypewriter(task.messageId);
      try {
        const requestPayload = this.buildAssistStreamPayload(task.messageId, {
          taskState: task,
        });
        await this.streamAssistRequest(task.messageId, requestPayload);
        if (this.hasRunningAssistTask()) {
          this.scheduleAssistReconnect();
        }
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }
        if (this.hasRunningAssistTask() && !(error && error.statusCode >= 400 && error.statusCode < 500)) {
          this.scheduleAssistReconnect();
          return;
        }
		showInsufficientRedstoneOptions(error);
        this.errorMessage = error.message || "写作助手暂时没有响应";
        this.appendProcessStep("error", this.errorMessage);
        this.completeAssistTask(task.messageId, "error");
      } finally {
        this.resumeTaskInProgress = false;
        this.abortController = null;
        this.loading = this.hasRunningAssistTask();
        if (!this.loading) {
          this.statusText = "";
          this.activeAssistantMessageId = null;
        }
        this.flushConversationPersist();
      }
    },
    consumeStreamBuffer(buffer) {
      let working = String(buffer || "");
      let lineBreakIndex = working.indexOf("\n");
      while (lineBreakIndex !== -1) {
        const line = working.slice(0, lineBreakIndex).trim();
        working = working.slice(lineBreakIndex + 1);
        if (line) {
          this.handleStreamEvent(line);
        }
        lineBreakIndex = working.indexOf("\n");
      }
      return working;
    },
    processNdjsonBlock(text) {
      String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => this.handleStreamEvent(line));
    },
    handleStreamEvent(rawLine) {
      let event;
      try {
        event = JSON.parse(rawLine);
      } catch (error) {
        return;
      }

      if (!event || typeof event !== "object") {
        return;
      }

      if (event.type === "task") {
        const taskMessageId = event.message_id || this.activeAssistantMessageId;
        const shouldResetForRestart = event.created === true
          && this.activeAssistTask
          && String(this.activeAssistTask.messageId) === String(taskMessageId)
          && Number(this.activeAssistTask.lastEventId || 0) > 0;
        if (shouldResetForRestart) {
          this.resetAssistantMessageForRestart(taskMessageId);
        }
        this.updateActiveAssistTask({
          taskId: event.task_id || (this.activeAssistTask && this.activeAssistTask.taskId),
          sessionId: event.session_id || this.currentConversationId,
          messageId: taskMessageId,
          articleId: Number(event.article_id || this.chapterId || (this.article && this.article.article_id) || 0),
          thinkingMode: event.thinking_mode || this.thinkingMode,
          status: event.status || "running",
          lastEventId: shouldResetForRestart
            ? 0
            : ((this.activeAssistTask && this.activeAssistTask.lastEventId) || 0),
        });
        return;
      }

      if (
        this.activeAssistTask &&
        String(this.activeAssistTask.messageId) === String(event.message_id || this.activeAssistantMessageId)
      ) {
        const eventId = Number(event.event_id || 0);
        if (Number.isFinite(eventId) && eventId > 0) {
          this.updateActiveAssistTask({
            lastEventId: eventId,
          });
        }
      }

      if (event.type === "status") {
        this.statusText = event.message || event.text || "";
        this.appendProcessStep("status", this.statusText);
        if (this.isImageGenerationStatusText(this.statusText)) {
          this.setActiveAssistantImageGenerationState(true, this.statusText);
        }
        return;
      }
      if (event.type === "process") {
        this.appendProcessStep(event.stage || "process", event.message || event.text);
        if (event.stage === "image_generation_start") {
          this.setActiveAssistantImageGenerationState(
            true,
            event.message || event.text || "正在生成图片"
          );
        }
        if (
          event.stage === "image_generation_done" ||
          event.stage === "image_generation_failed"
        ) {
          this.setActiveAssistantImageGenerationState(false);
        }
        return;
      }
      if (
        event.type === "reasoning_delta" ||
        event.type === "thinking_delta" ||
        event.type === "reasoning"
      ) {
        const content = event.content || event.text || "";
        if (content) {
          const activeMessage = this.getActiveAssistantMessage();
          if (!this.reasoningOutput) {
            this.appendProcessStep("reasoning", "正在展示模型原始推理");
          }
          const previousReasoning = activeMessage
            ? activeMessage.reasoningOutput
            : this.reasoningOutput;
          const mergedReasoning = mergeStreamingText(previousReasoning, content);
          const nextReasoning = mergedReasoning.full;
          if (activeMessage) {
            this.setAssistantReasoningComplete(activeMessage.id, false);
            if (activeMessage.reasoningCollapsed) {
              this.$set
                ? this.$set(activeMessage, "reasoningCollapsed", false)
                : (activeMessage.reasoningCollapsed = false);
            }
            activeMessage.reasoningOutput = nextReasoning;
            if (mergedReasoning.delta) {
              this.startReasoningTypewriter(activeMessage.id);
            }
          }
          this.reasoningOutput = nextReasoning;
          this.updateActiveAssistTask({ reconnectAttempts: 0 });
          if (mergedReasoning.delta) {
            this.queueResultAutoScroll();
            this.scheduleConversationPersist();
          }
        }
        return;
      }
      if (event.type === "delta") {
        const content = event.content || event.text || "";
        if (content) {
          const activeMessage = this.getActiveAssistantMessage();
          if (!this.output) {
            this.appendProcessStep("answer", "正在接收正文建议");
          }
          const previousOutput = activeMessage
            ? activeMessage.content
            : this.output;
          const mergedOutput = mergeStreamingText(previousOutput, content);
          if (activeMessage) {
            if (activeMessage.reasoningOutput) {
              this.setAssistantReasoningComplete(activeMessage.id, true);
            }
            activeMessage.content = mergedOutput.full;
            this.output = activeMessage.content;
            this.startTypewriter(activeMessage.id);
          } else {
            this.output = mergedOutput.full;
          }
          this.updateActiveAssistTask({ reconnectAttempts: 0 });
          if (mergedOutput.delta) {
            this.streamOutputChars += mergedOutput.delta.length;
            this.queueResultAutoScroll();
            this.scheduleConversationPersist();
          }
        }
        return;
      }
      if (event.type === "generated_image") {
        const activeMessage = this.getActiveAssistantMessage();
        const incomingImages = normalizeGeneratedImages(
          event.images && event.images.length ? event.images : [event.image]
        );
        if (activeMessage && incomingImages.length) {
          const previousImages = normalizeGeneratedImages(activeMessage.generatedImages);
          const nextImages = previousImages.concat(
            incomingImages.filter((image) => {
              return !previousImages.some((previous) => previous.url === image.url);
            })
          );
          this.$set
            ? this.$set(activeMessage, "generatedImages", nextImages)
            : (activeMessage.generatedImages = nextImages);
          this.setAssistantImageGenerationState(activeMessage.id, false);
          this.appendProcessStep("image", "图片已生成");
          this.queueResultAutoScroll();
          this.scheduleConversationPersist();
        }
        return;
      }
      if (event.type === "error") {
        this.errorMessage = event.message || "写作助手暂时没有响应";
        this.appendProcessStep("error", this.errorMessage);
        this.queueResultAutoScroll();
        this.setActiveAssistantImageGenerationState(false);
        this.setAssistantReasoningComplete(
          event.message_id || this.activeAssistantMessageId,
          true
        );
        this.completeAssistTask(event.message_id || this.activeAssistantMessageId, "error");
        this.scheduleConversationPersist();
        return;
      }
      if (event.type === "done") {
        this.statusText = "";
        this.appendProcessStep("done", "生成完成");
        this.setActiveAssistantImageGenerationState(false);
        this.setAssistantReasoningComplete(
          event.message_id || this.activeAssistantMessageId,
          true
        );
        this.completeAssistTask(event.message_id || this.activeAssistantMessageId, "completed");
        this.scheduleConversationPersist();
      }
    },
    buildTiptapContent(text) {
      const normalized = normalizeGeneratedText(text);
      if (!normalized) {
        return "";
      }

      const paragraphs = normalized
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (paragraphs.length <= 1) {
        return normalized;
      }

      return paragraphs.map((line) => ({
        type: "paragraph",
        content: [
          {
            type: "text",
            text: line,
          },
        ],
      }));
    },
    buildTiptapParagraphContent(text) {
      const normalized = normalizeGeneratedText(text);
      if (!normalized) {
        return "";
      }
      return normalized
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({
          type: "paragraph",
          content: [
            {
              type: "text",
              text: line,
            },
          ],
        }));
    },
    getTiptapContentSize(content) {
      if (!this.editor || !this.editor.schema) {
        return 0;
      }
      const items = Array.isArray(content) ? content : [content];
      return items.reduce((total, item) => {
        if (!item) {
          return total;
        }
        try {
          const node =
            typeof item === "string"
              ? this.editor.schema.text(item)
              : this.editor.schema.nodeFromJSON(item);
          return total + Number((node && node.nodeSize) || 0);
        } catch (error) {
          return total;
        }
      }, 0);
    },
    getTransactionInsertedRange(transaction, targetRange) {
      if (
        !transaction ||
        !transaction.docChanged ||
        !transaction.mapping ||
        !Array.isArray(transaction.mapping.maps) ||
        !targetRange
      ) {
        return null;
      }

      const targetFrom = Number(targetRange.from);
      const targetTo = Number(targetRange.to);
      if (!Number.isFinite(targetFrom) || !Number.isFinite(targetTo)) {
        return null;
      }

      let insertedRange = null;
      transaction.mapping.maps.forEach((stepMap) => {
        if (
          insertedRange ||
          !stepMap ||
          typeof stepMap.forEach !== "function"
        ) {
          return;
        }

        stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
          if (insertedRange || newEnd <= newStart) {
            return;
          }

          const matchesTarget =
            oldStart === targetFrom ||
            (oldStart <= targetFrom && oldEnd >= targetTo);
          if (matchesTarget) {
            insertedRange = {
              from: newStart,
              to: newEnd,
            };
          }
        });
      });

      return insertedRange;
    },
    normalizeRangeCompareText(text) {
      return normalizeGeneratedText(text).replace(/\s+/g, "");
    },
    pickFirstFiniteNumber(values) {
      for (const value of values) {
        if (value === null || value === undefined || value === "") {
          continue;
        }
        const number = Number(value);
        if (Number.isFinite(number)) {
          return number;
        }
      }
      return null;
    },
    resolveSmartReplaceRange(decision) {
      if (!decision || typeof decision !== "object") {
        return null;
      }
      const blocks = this.collectEditorReplaceBlocks();
      const startIndex = Number(decision.start_paragraph_index);
      const endIndex = Number(decision.end_paragraph_index);
      if (!Number.isFinite(startIndex) || !Number.isFinite(endIndex)) {
        return null;
      }
      const low = Math.min(startIndex, endIndex);
      const high = Math.max(startIndex, endIndex);
      const selectedBlocks = blocks.filter((block) => {
        return block.index >= low && block.index <= high;
      });
      if (!selectedBlocks.length || selectedBlocks.length !== high - low + 1) {
        return null;
      }

      const originalText = normalizeGeneratedText(decision.original_text);
      const currentText = normalizeGeneratedText(
        selectedBlocks.map((block) => block.text).join("\n\n")
      );
      const shouldVerifyOriginal =
        originalText &&
        originalText.indexOf("...") === -1 &&
        originalText.length < 2000;
      if (
        shouldVerifyOriginal &&
        this.normalizeRangeCompareText(originalText) !==
          this.normalizeRangeCompareText(currentText)
      ) {
        const originalCompareText = this.normalizeRangeCompareText(originalText);
        const matchingBlocks = blocks.filter((block) => {
          return this.normalizeRangeCompareText(block.text) === originalCompareText;
        });
        if (matchingBlocks.length !== 1) {
          return null;
        }
        return {
          from: matchingBlocks[0].from,
          to: matchingBlocks[0].to,
        };
      }

      return {
        from: selectedBlocks[0].from,
        to: selectedBlocks[selectedBlocks.length - 1].to,
      };
    },
    resolveSmartInsertRange(decision, message = null) {
      if (!this.editor || !this.editor.state || !this.editor.state.doc) {
        return null;
      }
      const docSize = Number(this.editor.state.doc.content.size || 0);
      const clampPosition = (position) => {
        const numeric = Number(position);
        if (!Number.isFinite(numeric)) {
          return docSize;
        }
        return Math.min(Math.max(numeric, 0), docSize);
      };
      const blocks = this.collectEditorReplaceBlocks();
      const beforeIndex = this.pickFirstFiniteNumber([
        decision && decision.insert_before_paragraph_index,
        decision && decision.insertBeforeParagraphIndex,
        decision && decision.before_paragraph_index,
        decision && decision.beforeParagraphIndex,
      ]);
      if (Number.isFinite(beforeIndex)) {
        const target = blocks.find((block) => block.index === Math.floor(beforeIndex));
        if (target) {
          const position = clampPosition(target.from);
          return { from: position, to: position };
        }
        if (beforeIndex <= 1 && blocks.length) {
          const position = clampPosition(blocks[0].from);
          return { from: position, to: position };
        }
      }

      const afterIndex = this.pickFirstFiniteNumber([
        decision && decision.insert_after_paragraph_index,
        decision && decision.insertAfterParagraphIndex,
        decision && decision.after_paragraph_index,
        decision && decision.afterParagraphIndex,
      ]);
      if (Number.isFinite(afterIndex)) {
        const normalizedIndex = Math.floor(afterIndex);
        if (normalizedIndex <= 0 && blocks.length) {
          const position = clampPosition(blocks[0].from);
          return { from: position, to: position };
        }
        const target = blocks.find((block) => block.index === normalizedIndex);
        if (target) {
          const position = clampPosition(target.to);
          return { from: position, to: position };
        }
        if (blocks.length && normalizedIndex >= blocks[blocks.length - 1].index) {
          const position = clampPosition(blocks[blocks.length - 1].to);
          return { from: position, to: position };
        }
      }

      const fallback = this.resolveDraftInsertRange(message);
      if (fallback) {
        const position = clampPosition(fallback.from);
        return { from: position, to: position };
      }
      return { from: docSize, to: docSize };
    },
    getRangeText(range) {
      if (
        !range ||
        !this.editor ||
        !this.editor.state ||
        !this.editor.state.doc
      ) {
        return "";
      }
      const from = Number(range.from);
      const to = Number(range.to);
      if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
        return "";
      }
      return this.editor.state.doc.textBetween(from, to, "\n").trim();
    },
    getEditorContainerElement() {
      if (!this.editor || !this.editor.view || !this.editor.view.dom) {
        return null;
      }
      return this.editor.view.dom.closest(".textarea");
    },
    getSmartReplaceMaskStyle(rect) {
      return {
        left: `${Number(rect && rect.left) || 0}px`,
        top: `${Number(rect && rect.top) || 0}px`,
        width: `${Math.max(0, Number(rect && rect.width) || 0)}px`,
        height: `${Math.max(0, Number(rect && rect.height) || 0)}px`,
      };
    },
    getSmartReplacePreviewElement() {
      const preview = this.$refs.smartReplacePreview;
      if (!preview) {
        return null;
      }
      return preview.$el || preview;
    },
    getSmartReplaceBlocksInRange(range) {
      if (!range) {
        return [];
      }
      const from = Number(range.from);
      const to = Number(range.to);
      if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
        return [];
      }
      return this.collectEditorReplaceBlocks().filter((block) => {
        return Number(block.from) >= from && Number(block.to) <= to;
      });
    },
    getSmartReplaceBlockRect(block) {
      if (!this.editor || !this.editor.view || !block) {
        return null;
      }
      const from = Number(block.from);
      const to = Number(block.to);
      if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
        return null;
      }

      try {
        const dom = this.editor.view.nodeDOM(from);
        const element =
          dom && dom.nodeType === 1
            ? dom
            : dom && dom.parentElement
              ? dom.parentElement
              : null;
        if (element && typeof element.getBoundingClientRect === "function") {
          const rect = element.getBoundingClientRect();
          if (rect && (rect.width || rect.height)) {
            return rect;
          }
        }
      } catch (error) {}

      try {
        const start = this.editor.view.coordsAtPos(from);
        const end = this.editor.view.coordsAtPos(Math.max(from, to - 1));
        const left = Math.min(start.left, end.left);
        const right = Math.max(start.right || start.left, end.right || end.left);
        const top = Math.min(start.top, end.top);
        const bottom = Math.max(start.bottom || start.top, end.bottom || end.top);
        return {
          left,
          right,
          top,
          bottom,
          width: right - left,
          height: bottom - top,
        };
      } catch (error) {
        return null;
      }
    },
    getSmartReplaceRangeLayout(range) {
      const editorContainer = this.getEditorContainerElement();
      if (!editorContainer) {
        return {
          maskRects: [],
          targetRect: null,
        };
      }

      const containerRect = editorContainer.getBoundingClientRect();
      const from = Number(range && range.from);
      const to = Number(range && range.to);
      const isInsertPreview =
        this.smartReplacePreview.action === "insert" ||
        (Number.isFinite(from) && Number.isFinite(to) && from === to);
      const maskRects = [];

      if (isInsertPreview && this.editor && this.editor.view && range) {
        try {
          const docSize = Number(this.editor.state.doc.content.size || 0);
          const position = Math.min(Math.max(from, 0), docSize);
          const coords = this.editor.view.coordsAtPos(position);
          const markerWidth = 4;
          const left = Math.min(
            Math.max((coords.left || containerRect.left) - markerWidth / 2, containerRect.left + 4),
            containerRect.right - markerWidth - 4
          );
          const top = Math.max(containerRect.top + 1, (coords.top || containerRect.top) - 4);
          const bottom = Math.min(
            containerRect.bottom - 1,
            (coords.bottom || coords.top || containerRect.top + 28) + 4
          );
          maskRects.push({
            left,
            top,
            width: markerWidth,
            height: Math.max(28, bottom - top),
            kind: "insert",
          });
        } catch (error) {}
      } else {
        const blocks = this.getSmartReplaceBlocksInRange(range);
        const sourceBlocks = blocks.length
          ? blocks
          : [{ from: Number(range && range.from), to: Number(range && range.to) }];

        sourceBlocks.forEach((block) => {
          const rect = this.getSmartReplaceBlockRect(block);
          if (!rect) {
            return;
          }
          const left = Math.max(rect.left, containerRect.left + 1);
          const right = Math.min(rect.right, containerRect.right - 1);
          const top = Math.max(rect.top, containerRect.top + 1);
          const bottom = Math.min(rect.bottom, containerRect.bottom - 1);
          if (right - left <= 2 || bottom - top <= 2) {
            return;
          }
          maskRects.push({
            left,
            top,
            width: right - left,
            height: bottom - top,
            kind: "replace",
          });
        });

        if (!maskRects.length && this.editor && this.editor.view && range) {
          try {
            const coords = this.editor.view.coordsAtPos(Number(range.from));
            const left = containerRect.left + 12;
            const width = Math.max(120, containerRect.width - 24);
            const top = Math.max(containerRect.top + 1, coords.top - 10);
            const bottom = Math.min(containerRect.bottom - 1, coords.bottom + 10);
            maskRects.push({
              left,
              top,
              width,
              height: Math.max(32, bottom - top),
              kind: "replace",
            });
          } catch (error) {}
        }
      }

      if (isInsertPreview && !maskRects.length) {
        maskRects.push({
          left: Math.min(Math.max(containerRect.left + 16, containerRect.left + 4), containerRect.right - 8),
          top: containerRect.top + 12,
          width: 4,
          height: 32,
          kind: "insert",
        });
      }

      if (!maskRects.length) {
        return {
          maskRects,
          targetRect: null,
        };
      }

      const targetRect = maskRects.reduce((merged, rect) => {
        const right = rect.left + rect.width;
        const bottom = rect.top + rect.height;
        if (!merged) {
          return {
            left: rect.left,
            top: rect.top,
            right,
            bottom,
          };
        }
        return {
          left: Math.min(merged.left, rect.left),
          top: Math.min(merged.top, rect.top),
          right: Math.max(merged.right, right),
          bottom: Math.max(merged.bottom, bottom),
        };
      }, null);

      return {
        maskRects,
        targetRect: {
          ...targetRect,
          width: targetRect.right - targetRect.left,
          height: targetRect.bottom - targetRect.top,
        },
      };
    },
    scrollSmartReplaceRangeIntoView(range) {
      if (!this.editor || !this.editor.view || !range) {
        return;
      }
      const editorContainer = this.getEditorContainerElement();
      if (!editorContainer) {
        return;
      }
      try {
        const coords = this.editor.view.coordsAtPos(Number(range.from));
        const containerRect = editorContainer.getBoundingClientRect();
        const topPadding = 80;
        const bottomPadding = 240;
        if (coords.top < containerRect.top + topPadding) {
          editorContainer.scrollTop -= containerRect.top + topPadding - coords.top;
        } else if (coords.top > containerRect.bottom - bottomPadding) {
          editorContainer.scrollTop += coords.top - (containerRect.bottom - bottomPadding);
        }
      } catch (error) {}
    },
    updateSmartReplacePreviewPosition() {
      if (
        !this.smartReplacePreview.visible ||
        !this.editor ||
        !this.editor.view ||
        !this.smartReplacePreview.range
      ) {
        return;
      }
      const editorContainer = this.getEditorContainerElement();
      if (!editorContainer) {
        return;
      }
      try {
        const layout = this.getSmartReplaceRangeLayout(this.smartReplacePreview.range);
        if (!layout.targetRect) {
          return;
        }
        const containerRect = editorContainer.getBoundingClientRect();
        const viewportWidth =
          typeof window !== "undefined" ? Number(window.innerWidth || 0) : 0;
        const viewportHeight =
          typeof window !== "undefined" ? Number(window.innerHeight || 0) : 0;
        const clamp = (value, min, max) => {
          if (max < min) {
            return min;
          }
          return Math.max(min, Math.min(value, max));
        };
        const maxWidth = Math.max(
          180,
          Math.min(
            460,
            containerRect.width - 24,
            viewportWidth ? viewportWidth - 24 : containerRect.width - 24
          )
        );
        const width = maxWidth;
        const minLeft = Math.max(8, containerRect.left + 8);
        const maxLeft = viewportWidth
          ? Math.min(containerRect.right - width - 8, viewportWidth - width - 8)
          : containerRect.right - width - 8;
        const left = clamp(layout.targetRect.left, minLeft, maxLeft);
        const minTop = Math.max(8, containerRect.top + 8);
        const maxBottom = viewportHeight
          ? Math.min(containerRect.bottom - 8, viewportHeight - 8)
          : containerRect.bottom - 8;
        const previewElement = this.getSmartReplacePreviewElement();
        const renderedHeight =
          previewElement && typeof previewElement.getBoundingClientRect === "function"
            ? Number(previewElement.getBoundingClientRect().height || 0)
            : 0;
        const gap = 10;
        const aboveSpace = Math.max(0, layout.targetRect.top - minTop - gap);
        const belowSpace = Math.max(0, maxBottom - layout.targetRect.bottom - gap);
        const preferredHeight = Math.min(renderedHeight || 240, 360);
        const placement =
          belowSpace >= Math.min(preferredHeight, 180) || belowSpace >= aboveSpace
            ? "below"
            : "above";
        const availableSpace = placement === "below" ? belowSpace : aboveSpace;
        const fallbackSpace = Math.max(aboveSpace, belowSpace, 180);
        const maxHeight = Math.max(
          150,
          Math.min(360, availableSpace || fallbackSpace)
        );
        const previewHeight = Math.min(renderedHeight || maxHeight, maxHeight);
        const top = placement === "below"
          ? clamp(layout.targetRect.bottom + gap, minTop, maxBottom - previewHeight)
          : clamp(layout.targetRect.top - previewHeight - gap, minTop, maxBottom - previewHeight);
        const targetCenter = layout.targetRect.left + layout.targetRect.width / 2;
        const arrowLeft = clamp(targetCenter - left, 18, width - 18);
        this.smartReplacePreview = {
          ...this.smartReplacePreview,
          maskRects: layout.maskRects,
          left,
          top,
          width,
          maxHeight,
          resultMaxHeight: Math.max(84, maxHeight - 72),
          placement,
          arrowLeft,
        };
      } catch (error) {}
    },
    showSmartReplacePreview(decision, range, replacementText, options = {}) {
      const action = options.action || decision.action || "replace";
      const originalText = action === "replace"
        ? this.getRangeText(range) || decision.original_text || ""
        : "";
      this.smartReplacePreview = {
        visible: true,
        action,
        decision,
        range,
        originalText,
        replacementText,
        left: this.smartReplacePreview.left || 16,
        top: this.smartReplacePreview.top || 120,
        width: this.smartReplacePreview.width || 320,
        maxHeight: this.smartReplacePreview.maxHeight || 320,
        resultMaxHeight: this.smartReplacePreview.resultMaxHeight || 220,
        placement: this.smartReplacePreview.placement || "below",
        arrowLeft: this.smartReplacePreview.arrowLeft || 28,
        maskRects: [],
      };
      this.scrollSmartReplaceRangeIntoView(range);
      this.bindSmartReplacePreviewPositionListeners();
      this.$nextTick(() => {
        this.updateSmartReplacePreviewPosition();
      });
    },
    bindSmartReplacePreviewPositionListeners() {
      const editorContainer = this.getEditorContainerElement();
      if (
        this._smartReplacePreviewScrollElement &&
        this._smartReplacePreviewScrollElement !== editorContainer
      ) {
        this._smartReplacePreviewScrollElement.removeEventListener(
          "scroll",
          this.updateSmartReplacePreviewPosition
        );
        this._smartReplacePreviewScrollElement = null;
      }
      if (editorContainer && this._smartReplacePreviewScrollElement !== editorContainer) {
        editorContainer.addEventListener(
          "scroll",
          this.updateSmartReplacePreviewPosition,
          { passive: true }
        );
        this._smartReplacePreviewScrollElement = editorContainer;
      }
      if (typeof window !== "undefined" && !this._smartReplacePreviewWindowBound) {
        window.addEventListener("resize", this.updateSmartReplacePreviewPosition);
        window.addEventListener(
          "scroll",
          this.updateSmartReplacePreviewPosition,
          true
        );
        this._smartReplacePreviewWindowBound = true;
      }
    },
    unbindSmartReplacePreviewPositionListeners() {
      if (this._smartReplacePreviewScrollElement) {
        this._smartReplacePreviewScrollElement.removeEventListener(
          "scroll",
          this.updateSmartReplacePreviewPosition
        );
        this._smartReplacePreviewScrollElement = null;
      }
      if (typeof window !== "undefined" && this._smartReplacePreviewWindowBound) {
        window.removeEventListener("resize", this.updateSmartReplacePreviewPosition);
        window.removeEventListener(
          "scroll",
          this.updateSmartReplacePreviewPosition,
          true
        );
        this._smartReplacePreviewWindowBound = false;
      }
    },
    discardSmartReplacePreview() {
      this.unbindSmartReplacePreviewPositionListeners();
      this.smartReplacePreview = {
        ...this.smartReplacePreview,
        visible: false,
        action: "replace",
        decision: null,
        range: null,
        originalText: "",
        replacementText: "",
        maskRects: [],
      };
    },
    keepSmartReplacePreview() {
      if (!this.smartReplacePreview.visible || !this.smartReplacePreview.decision) {
        return;
      }
      const isInsertPreview = this.smartReplacePreview.action === "insert";
      let range = isInsertPreview
        ? this.smartReplacePreview.range
        : this.resolveSmartReplaceRange(this.smartReplacePreview.decision);
      if (isInsertPreview && range && this.editor && this.editor.state && this.editor.state.doc) {
        const docSize = Number(this.editor.state.doc.content.size || 0);
        const position = Math.min(Math.max(Number(range.from), 0), docSize);
        range = { from: position, to: position };
      }
      if (!range) {
        uni.showToast({
          title: isInsertPreview ? "插入位置已变化，请重新点击应用" : "正文已变化，请重新点击应用",
          icon: "none",
          duration: 2200,
        });
        this.discardSmartReplacePreview();
        return;
      }
      const docSize = Number(
        (this.editor &&
          this.editor.state &&
          this.editor.state.doc &&
          this.editor.state.doc.content &&
          this.editor.state.doc.content.size) ||
          0
      );
      const from = Math.min(Math.max(Number(range.from), 0), docSize);
      const to = Math.min(Math.max(Number(range.to), 0), docSize);
      if (!Number.isFinite(from) || !Number.isFinite(to)) {
        uni.showToast({
          title: isInsertPreview ? "插入位置已变化，请重新点击应用" : "正文已变化，请重新点击应用",
          icon: "none",
          duration: 2200,
        });
        this.discardSmartReplacePreview();
        return;
      }
      const appliedTargetRange = {
        from: Math.min(from, to),
        to: Math.max(from, to),
      };
      const content = this.buildTiptapParagraphContent(
        this.smartReplacePreview.replacementText
      );
      if (!content) {
        uni.showToast({
          title: "没有可应用的内容",
          icon: "none",
          duration: 1800,
        });
        return;
      }
      let appliedRange = null;
      const transactionHandler = ({ transaction }) => {
        if (appliedRange) {
          return;
        }
        appliedRange = this.getTransactionInsertedRange(
          transaction,
          appliedTargetRange
        );
      };
      if (typeof this.editor.on === "function") {
        this.editor.on("transaction", transactionHandler);
      }
      let isApplied = false;
      try {
        isApplied = this.editor
          .chain()
          .focus()
          .insertContentAt(appliedTargetRange, content)
          .run();
      } finally {
        if (typeof this.editor.off === "function") {
          this.editor.off("transaction", transactionHandler);
        }
      }
      if (!isApplied) {
        uni.showToast({
          title: "应用失败，请重试",
          icon: "none",
          duration: 1800,
        });
        return;
      }
      if (!appliedRange) {
        const insertedSize = this.getTiptapContentSize(content);
        if (insertedSize > 0) {
          appliedRange = {
            from: appliedTargetRange.from,
            to: appliedTargetRange.from + insertedSize,
          };
        }
      }
      const replacementText = this.smartReplacePreview.replacementText;
      this.discardSmartReplacePreview();
      this.$emit("smart-replace-kept", {
        action: isInsertPreview ? "insert" : "replace",
        range: appliedTargetRange,
        appliedRange,
        replacementText,
      });
    },
    getAssistantSegments(message) {
      return parseDraftSegments(this.getAssistantDisplayContent(message));
    },
    getAssistantGeneratedImages(message) {
      return normalizeGeneratedImages(message && message.generatedImages);
    },
    getGeneratedImageUrl(image) {
      return String((image && (image.url || image.src || image.image_url)) || "").trim();
    },
    getGeneratedImageTitle(image, index = 0) {
      const prompt = normalizeGeneratedText(image && image.prompt).replace(/\s+/g, " ");
      return prompt ? clampText(prompt, 28) : `生成图片 ${Number(index || 0) + 1}`;
    },
    insertGeneratedImageAtCursor(image) {
      const imageUrl = this.getGeneratedImageUrl(image);
      if (!this.editor || !imageUrl) {
        uni.showToast({
          title: "没有可插入的图片",
          icon: "none",
          duration: 1600,
        });
        return;
      }
      try {
        this.editor.chain().focus().setImage({ src: imageUrl }).run();
        uni.showToast({
          title: "图片已插入",
          icon: "none",
          duration: 1600,
        });
        this.$emit("generated-image-inserted", { url: imageUrl, image });
      } catch (error) {
        uni.showToast({
          title: "图片插入失败",
          icon: "none",
          duration: 1800,
        });
      }
    },
    renderMarkdown(content) {
      return renderMarkdown(content);
    },
    resolveDraftInsertRange(message) {
      if (!this.editor || !this.editor.state || !this.editor.state.doc) {
        return null;
      }
      const docSize = Number(this.editor.state.doc.content.size || 0);
      const snapshot = message && message.selectionSnapshot;
      if (snapshot && Number(snapshot.from) < Number(snapshot.to)) {
        const targetPosition = Math.min(Math.max(Number(snapshot.to), 0), docSize);
        return { from: targetPosition, to: targetPosition };
      }
      const { selection } = this.editor.state;
      const selectionTo = Number(selection && selection.to);
      const selectionFrom = Number(selection && selection.from);
      const targetPosition = Number.isFinite(selectionTo)
        ? selectionTo
        : (Number.isFinite(selectionFrom) ? selectionFrom : docSize);
      const safePosition = Math.min(Math.max(targetPosition, 0), docSize);
      return { from: safePosition, to: safePosition };
    },
    async applyDraftText(text, message) {
      if (!this.editor) {
        return;
      }
      const draftText = normalizeGeneratedText(text);
      if (!draftText) {
        uni.showToast({
          title: "没有可应用的内容",
          icon: "none",
          duration: 1600,
        });
        return;
      }
      if (this.smartReplacingMessageId) {
        return;
      }
      this.smartReplacingMessageId = message && message.id ? message.id : -1;
      uni.showToast({
        title: "正在生成智能预览",
        icon: "none",
        duration: 1400,
      });
      try {
        const response = await fetch(this.getAiBaseUrl() + SMART_REPLACE_ROUTE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...this.getAuthHeaders(),
          },
          body: JSON.stringify(this.buildSmartReplacePayload(draftText, message)),
        });
        const responseData = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(responseData.msg || responseData.message || "智能应用失败");
        }
        const decision = responseData.data || {};
        const replacementText = normalizeGeneratedText(decision.replacement_text) || draftText;
        if (!replacementText) {
          throw new Error("模型没有返回可应用正文");
        }
        const action = decision.action === "insert" ? "insert" : "replace";
        const range = action === "insert"
          ? this.resolveSmartInsertRange(decision, message)
          : this.resolveSmartReplaceRange(decision);
        if (!range) {
          throw new Error(action === "insert" ? "未能定位插入位置" : "正文已变化，请重新点击应用");
        }
        this.showSmartReplacePreview(decision, range, replacementText, { action });
        this.$nextTick(() => {
          this.updateSmartReplacePreviewPosition();
          this.close();
          setTimeout(() => {
            this.updateSmartReplacePreviewPosition();
          }, 260);
        });
        uni.showToast({
          title: "已生成智能预览",
          icon: "none",
          duration: 1600,
        });
      } catch (error) {
        uni.showToast({
          title: error.message || "智能应用失败",
          icon: "none",
          duration: 2200,
        });
      } finally {
        this.smartReplacingMessageId = null;
      }
    },
    copyDraftText(text) {
      const content = normalizeGeneratedText(text);
      if (!content) {
        uni.showToast({
          title: "没有可复制的内容",
          icon: "none",
          duration: 1600,
        });
        return;
      }
      if (typeof uni !== "undefined" && typeof uni.setClipboardData === "function") {
        uni.setClipboardData({
          data: content,
          success: () => {
            uni.showToast({ title: "已复制", icon: "none", duration: 1400 });
          },
          fail: () => {
            uni.showToast({ title: "复制失败", icon: "none", duration: 1600 });
          },
        });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(content)
          .then(() => {
            uni.showToast({ title: "已复制", icon: "none", duration: 1400 });
          })
          .catch(() => {
            uni.showToast({ title: "复制失败", icon: "none", duration: 1600 });
          });
      }
    },
    insertAtCursor() {
      if (!this.editor || !this.output) {
        return;
      }
      const content = this.buildTiptapContent(this.output);
      if (!content) {
        return;
      }
      this.editor.chain().focus().insertContent(content).run();
      uni.showToast({
        title: "已插入草稿",
        icon: "none",
        duration: 1600,
      });
    },
    replaceSelection() {
      if (!this.editor || !this.output || !this.selectionSnapshot) {
        return;
      }

      const { from, to, text } = this.selectionSnapshot;
      const currentSelectedText = this.editor.state.doc
        .textBetween(from, to, "\n")
        .trim();
      if (text && currentSelectedText && currentSelectedText !== text) {
        uni.showToast({
          title: "选区已变化，请重新生成",
          icon: "none",
          duration: 1800,
        });
        return;
      }

      const content = this.buildTiptapContent(this.output);
      if (!content) {
        return;
      }
      this.editor
        .chain()
        .focus()
        .insertContentAt({ from, to }, content)
        .run();
      this.selectionSnapshot = null;
      this.selectionText = "";
      uni.showToast({
        title: "已替换选区",
        icon: "none",
        duration: 1600,
      });
    },
    clearOutput() {
      this.output = "";
      this.reasoningOutput = "";
      this.errorMessage = "";
      this.statusText = "";
      this.processSteps = [];
      this.streamOutputChars = 0;
      this.stopAllTypewriters();
      this.stopAllReasoningTypewriters();
    },
  },
};
</script>

<style scoped lang="less">
.writer-ai-root {
  position: relative;
  z-index: 30000;
}

.writer-ai-root ::v-deep .uni-popup {
  z-index: 30000 !important;
}

.selection-add-button {
  position: fixed;
  width: 34px;
  height: 34px;
  z-index: 29990;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  border: 1px solid #4a3520;
  color: #3f2a18;
  background: #fffaf0;
  box-shadow: 3px 3px 0 rgba(74, 53, 32, 0.22);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.selection-add-icon {
  position: relative;
  width: 18px;
  height: 18px;
  line-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selection-add-icon i {
  display: block;
  width: 18px;
  height: 18px;
  font-size: 18px;
  line-height: 18px;
}

.selection-add-plus {
  position: absolute;
  right: 2px;
  bottom: 1px;
  width: 7px;
  height: 7px;
  color: #3f2a18;
  background: #fffaf0;
  font-size: 10px;
  font-weight: 900;
  line-height: 7px;
  text-align: center;
}

.selection-add-button.black {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.42);
}

.selection-add-button.black .selection-add-plus {
  color: #f2e8d8;
  background: #262a31;
}

.smart-replace-range-mask {
  position: fixed;
  z-index: 30005;
  pointer-events: none;
  box-sizing: border-box;
  border: 1px solid rgba(205, 57, 43, 0.62);
  background: rgba(205, 57, 43, 0.18);
  box-shadow: inset 0 0 0 2rpx rgba(205, 57, 43, 0.14);
}

.smart-replace-range-mask.black {
  border-color: rgba(255, 99, 87, 0.72);
  background: rgba(255, 99, 87, 0.24);
}

.smart-replace-range-mask.insert {
  border: none;
  border-radius: 999px;
  background: #cd392b;
  box-shadow: 0 0 0 6rpx rgba(205, 57, 43, 0.18);
}

.smart-replace-range-mask.black.insert {
  background: #ff6357;
  box-shadow: 0 0 0 6rpx rgba(255, 99, 87, 0.22);
}

.smart-replace-preview {
  position: fixed;
  z-index: 30010;
  max-width: calc(100vw - 24px);
  padding: 14rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  color: #3f2a18;
  background: #fffdf8;
  box-shadow: 6rpx 6rpx 0 rgba(74, 53, 32, 0.2);
}

.smart-replace-preview::before {
  content: "";
  position: absolute;
  left: var(--smart-replace-arrow-left, 28px);
  width: 10px;
  height: 10px;
  box-sizing: border-box;
  background: inherit;
  transform: translateX(-50%) rotate(45deg);
}

.smart-replace-preview.below::before {
  top: -6px;
  border-top: 1px solid currentColor;
  border-left: 1px solid currentColor;
}

.smart-replace-preview.above::before {
  bottom: -6px;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
}

.smart-replace-preview.black {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 6rpx 6rpx 0 rgba(0, 0, 0, 0.42);
}

.smart-replace-preview-head {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;
  font-size: 22rpx;
  line-height: 1.2;
  font-weight: 700;
}

.smart-replace-result {
  min-height: 72rpx;
  padding: 2rpx 2rpx 0;
  box-sizing: border-box;
  font-size: 26rpx;
  line-height: 1.65;
  word-break: break-word;
}

.replacement-line {
  white-space: pre-wrap;
}

.replacement-line + .replacement-line {
  margin-top: 8rpx;
}

.smart-replace-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10rpx;
  margin-top: 12rpx;
}

.smart-replace-keep {
  height: 52rpx;
  min-width: 92rpx;
  line-height: 50rpx;
  font-size: 22rpx;
}

@media screen and (max-width: 520px) {
  .smart-replace-result {
    font-size: 25rpx;
  }
}

.writer-ai-panel {
  position: relative;
  z-index: 30020;
  height: 60vh;
  max-height: 80vh;
  min-height: 0;
  padding: 16rpx 28rpx calc(22rpx + var(--loghome-safe-bottom, 0px));
  border-radius: 30rpx 30rpx 0 0;
  border-top: 2rpx solid #3f2a18;
  box-sizing: border-box;
  background: #fffaf0;
  color: #3f2a18;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8rpx 0 rgba(74, 53, 32, 0.1);
  transition: height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), max-height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.writer-ai-panel.dragging {
  transition: none;
}

.writer-ai-panel.black {
  border-top-color: #d8ccb9;
  background: #262a31;
  color: #f2e8d8;
  box-shadow: 0 -8rpx 0 rgba(0, 0, 0, 0.36);
}

.writer-ai-panel.black.dragging {
  transition: none;
}

.panel-handle-area {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18rpx 0 12rpx;
  cursor: grab;
  -webkit-user-select: none;
  user-select: none;
  touch-action: none;
}

.panel-handle-area:active {
  cursor: grabbing;
}

.panel-handle {
  width: 84rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background: #3f2a18;
}

.black .panel-handle {
  background: #d8ccb9;
}

.panel-head {
  flex: 0 0 auto;
  position: relative;
  z-index: 4;
  min-height: 66rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-menu-button {
  position: absolute;
  left: 0;
  top: 3rpx;
  width: 60rpx;
  height: 60rpx;
  margin: 0;
  padding: 0 !important;
  border-radius: 0;
  background: transparent;
  color: #3f2a18;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7rpx;
}

.panel-menu-button::after {
  border: none;
}

.panel-menu-button span {
  display: block;
  width: 27rpx;
  height: 3rpx;
  background: currentColor;
}

.black .panel-menu-button {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 3rpx 3rpx 0 rgba(0, 0, 0, 0.36);
}

.panel-brand {
  height: 62rpx;
  color: #5a3921;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black .panel-brand {
  color: #f2e8d8;
}

.panel-brand-logo {
  display: block;
  width: 148rpx;
  height: 62rpx;
  object-fit: contain;
  filter: brightness(0);
}

.black .panel-brand-logo {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.panel-subtitle {
  margin-top: 4rpx;
  font-size: 23rpx;
  color: #9c7b55;
}

.black .panel-subtitle {
  color: #c8b99e;
}

.panel-close {
  position: absolute;
  right: 0;
  top: 3rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
}

.black .panel-close {
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 3rpx 3rpx 0 rgba(0, 0, 0, 0.36);
}

.conversation-sidebar-backdrop {
  position: absolute;
  inset: 0;
  z-index: 8;
  background: rgba(63, 42, 24, 0.12);
}

.conversation-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 9;
  width: 520rpx;
  max-width: 74vw;
  padding: 96rpx 22rpx 24rpx;
  box-sizing: border-box;
  border-right: 2rpx solid #3f2a18;
  color: #3f2a18;
  background: #fffaf0;
  box-shadow: 10rpx 0 0 rgba(74, 53, 32, 0.12);
  transform: translateX(-104%);
  transition: transform 0.18s ease;
  display: flex;
  flex-direction: column;
}

.conversation-sidebar.visible {
  transform: translateX(0);
}

.black .conversation-sidebar {
  color: #f2e8d8;
  border-right-color: #d8ccb9;
  background: #262a31;
  box-shadow: 10rpx 0 0 rgba(0, 0, 0, 0.3);
}

.black .conversation-sidebar-backdrop {
  background: rgba(0, 0, 0, 0.22);
}

.new-conversation-button {
  flex: 0 0 auto;
  width: 100%;
}

.conversation-sidebar-title {
  flex: 0 0 auto;
  margin-top: 22rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid rgba(63, 42, 24, 0.22);
  font-size: 23rpx;
  font-weight: 800;
  color: #7a5a36;
}

.black .conversation-sidebar-title {
  border-bottom-color: rgba(216, 204, 185, 0.28);
  color: #c8b99e;
}

.conversation-list {
  flex: 1 1 0;
  height: 0;
  min-height: 0;
  margin-top: 10rpx;
}

.conversation-empty {
  padding: 22rpx 4rpx;
  font-size: 24rpx;
  color: #92704a;
}

.black .conversation-empty {
  color: #c8b99e;
}

.conversation-item {
  padding: 14rpx 12rpx;
  margin-bottom: 10rpx;
  border: 1rpx solid rgba(63, 42, 24, 0.24);
  box-sizing: border-box;
  background: rgba(255, 253, 248, 0.62);
}

.conversation-item.active {
  border-color: #3f2a18;
  background: #f5ead7;
  box-shadow: 3rpx 3rpx 0 rgba(74, 53, 32, 0.15);
}

.black .conversation-item {
  border-color: rgba(216, 204, 185, 0.32);
  background: rgba(255, 255, 255, 0.05);
}

.black .conversation-item.active {
  border-color: #d8ccb9;
  background: rgba(216, 204, 185, 0.14);
  box-shadow: 3rpx 3rpx 0 rgba(0, 0, 0, 0.32);
}

.conversation-item-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 1.35;
}

.conversation-item-meta {
  margin-top: 6rpx;
  font-size: 21rpx;
  color: #92704a;
}

.black .conversation-item-meta {
  color: #c8b99e;
}

.prompt-input {
  width: 100%;
  min-height: 86rpx;
  max-height: 180rpx;
  margin-top: 18rpx;
  padding: 16rpx 18rpx;
  box-sizing: border-box;
  border-radius: 0;
  font-size: 26rpx;
  line-height: 1.55;
  color: inherit;
  background: #fffdf8;
  box-shadow: inset 0 0 0 1rpx #3f2a18;
}

.black .prompt-input {
  background: #262a31;
  box-shadow: inset 0 0 0 1rpx #d8ccb9;
}

.ghost-button,
.primary-button {
  margin: 0;
  height: 60rpx;
  padding: 0 22rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  font-size: 24rpx;
  line-height: 58rpx;
}

.ghost-button {
  color: #3f2a18;
  background: #fffdf8;
  box-shadow: 3rpx 3rpx 0 rgba(74, 53, 32, 0.16);
}

.primary-button {
  color: #fffdf8;
  background: #3f2a18;
  box-shadow: 3rpx 3rpx 0 rgba(74, 53, 32, 0.22);
}

.black .ghost-button {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 3rpx 3rpx 0 rgba(0, 0, 0, 0.36);
}

.black .primary-button {
  color: #262a31;
  border-color: #d8ccb9;
  background: #d8ccb9;
  box-shadow: 3rpx 3rpx 0 rgba(0, 0, 0, 0.36);
}

.result-scroll {
  flex: 1 1 0;
  height: 0;
  min-height: 0;
  max-height: none;
  margin-top: 18rpx;
  padding: 2rpx 0;
  box-sizing: border-box;
  overflow: hidden;
}

.chat-scroll {
  padding: 6rpx 0 10rpx;
}

.result-scroll-anchor {
  height: 1rpx;
}

.chat-row {
  display: flex;
  margin: 12rpx 0;
}

.chat-row.user {
  justify-content: flex-end;
}

.chat-row.assistant {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 86%;
  min-width: 0;
  padding: 18rpx 20rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  background: #fffdf8;
  box-shadow: 4rpx 4rpx 0 rgba(74, 53, 32, 0.12);
}

.chat-row.user .chat-bubble {
  color: #3f2a18;
  background: #f5ead7;
  box-shadow: 4rpx 4rpx 0 rgba(74, 53, 32, 0.18);
}

.black .chat-bubble {
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 4rpx 4rpx 0 rgba(0, 0, 0, 0.36);
}

.black .chat-row.user .chat-bubble {
  color: #262a31;
  background: #d8ccb9;
}

.inline-selection-blocks {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8rpx;
  min-width: 0;
}

.message-inline-blocks {
  margin-top: 12rpx;
}

.selection-block-chip {
  display: flex;
  align-items: center;
  max-width: 100%;
  min-width: 0;
  height: 46rpx;
  padding: 0 12rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  color: #3f2a18;
  background: #fffaf0;
  box-shadow: none;
  cursor: pointer;
}

.message-selection-chip {
  color: #3f2a18;
  background: #fffdf8;
  box-shadow: none;
}

.black .selection-block-chip {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: none;
}

.selection-block-chip-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 22rpx;
  line-height: 46rpx;
}

.selection-block-remove {
  flex: 0 0 auto;
  width: 32rpx;
  height: 32rpx;
  margin: 0;
  margin-left: 6rpx;
  padding: 0 !important;
  border-radius: 0;
  border: 1px solid #3f2a18;
  line-height: 32rpx;
  color: #3f2a18;
  background: #fffdf8;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    font-size: 18rpx;
  }
}

.black .selection-block-remove {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
  display: flex;
}

.selection-block-tooltip {
  position: absolute;
  z-index: 30060;
  width: min(320px, calc(100% - 32px));
  max-height: 260px;
  padding: 14rpx 16rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  color: #3f2a18;
  background: #fffdf8;
  box-shadow: 6rpx 6rpx 0 rgba(74, 53, 32, 0.2);
}

.black .selection-block-tooltip {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 6rpx 6rpx 0 rgba(0, 0, 0, 0.42);
}

.selection-tooltip-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  font-size: 23rpx;
  font-weight: 800;
  color: #9a641e;
}

.black .selection-tooltip-head {
  color: #d8ccb9;
}

.selection-tooltip-close {
  flex: 0 0 auto;
  width: 42rpx;
  height: 42rpx;
  margin: 0;
  padding: 0 !important;
  border-radius: 0;
  border: 1px solid currentColor;
  line-height: 42rpx;
  color: inherit;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    font-size: 19rpx;
  }
}

.selection-tooltip-body {
  max-height: 206px;
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-text,
.draft-text {
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 26rpx;
  line-height: 1.7;
}

.markdown-body {
  white-space: normal;
}

.markdown-body ::v-deep p {
  margin: 0 0 14rpx;
  white-space: pre-wrap;
}

.markdown-body ::v-deep p:last-child,
.markdown-body ::v-deep ul:last-child,
.markdown-body ::v-deep ol:last-child,
.markdown-body ::v-deep blockquote:last-child,
.markdown-body ::v-deep pre:last-child {
  margin-bottom: 0;
}

.markdown-body ::v-deep h1,
.markdown-body ::v-deep h2,
.markdown-body ::v-deep h3,
.markdown-body ::v-deep h4 {
  margin: 18rpx 0 10rpx;
  font-weight: 800;
  line-height: 1.35;
}

.markdown-body ::v-deep h1 {
  font-size: 34rpx;
}

.markdown-body ::v-deep h2 {
  font-size: 31rpx;
}

.markdown-body ::v-deep h3 {
  font-size: 28rpx;
}

.markdown-body ::v-deep h4 {
  font-size: 26rpx;
}

.markdown-body ::v-deep ul,
.markdown-body ::v-deep ol {
  margin: 8rpx 0 16rpx;
  padding-left: 34rpx;
}

.markdown-body ::v-deep li {
  margin: 6rpx 0;
  line-height: 1.65;
}

.markdown-body ::v-deep blockquote {
  margin: 12rpx 0 16rpx;
  padding: 10rpx 16rpx;
  border-left: 6rpx solid #3f2a18;
  border-radius: 0;
  background: #f5ead7;
}

.black .markdown-body ::v-deep blockquote {
  border-left-color: #d8ccb9;
  background: rgba(255, 255, 255, 0.06);
}

.markdown-body ::v-deep code {
  padding: 2rpx 8rpx;
  border-radius: 0;
  border: 1px solid rgba(63, 42, 24, 0.35);
  font-size: 24rpx;
  background: #fffaf0;
}

.markdown-body ::v-deep pre {
  margin: 12rpx 0 16rpx;
  padding: 16rpx;
  border-radius: 0;
  border: 1px solid rgba(63, 42, 24, 0.45);
  overflow: auto;
  background: #fffaf0;
}

.markdown-body ::v-deep pre code {
  display: block;
  padding: 0;
  white-space: pre;
  background: transparent;
}

.markdown-body ::v-deep a {
  color: #8f5411;
  text-decoration: underline;
}

.black .markdown-body ::v-deep code,
.black .markdown-body ::v-deep pre {
  border-color: rgba(216, 204, 185, 0.45);
  background: rgba(255, 255, 255, 0.08);
}

.black .markdown-body ::v-deep a {
  color: #f0d7a8;
}

.assistant-text + .assistant-text,
.assistant-text + .draft-card,
.assistant-text + .image-generation-status,
.assistant-text + .generated-image-list,
.draft-card + .assistant-text,
.draft-card + .draft-card,
.draft-card + .image-generation-status,
.draft-card + .generated-image-list,
.image-generation-status + .assistant-text,
.image-generation-status + .draft-card,
.image-generation-status + .generated-image-list,
.generated-image-list + .assistant-text,
.generated-image-list + .draft-card {
  margin-top: 16rpx;
}

.placeholder {
  color: #9c7b55;
}

.draft-card {
  position: relative;
  overflow: hidden;
  padding: 18rpx 28rpx 24rpx 18rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  background: #fff4df;
  box-shadow: 4rpx 4rpx 0 rgba(74, 53, 32, 0.14);
}

.draft-card::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 36rpx;
  height: 36rpx;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(63, 42, 24, 0.18) 0%,
    rgba(63, 42, 24, 0.18) 48%,
    #3f2a18 49%,
    #3f2a18 52%,
    #fffdf8 53%,
    #fffdf8 100%
  );
  -webkit-clip-path: polygon(100% 0, 0 100%, 100% 100%);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

.black .draft-card {
  border-color: #d8ccb9;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 4rpx 4rpx 0 rgba(0, 0, 0, 0.36);
}

.black .draft-card::after {
  background: linear-gradient(
    135deg,
    rgba(216, 204, 185, 0.22) 0%,
    rgba(216, 204, 185, 0.22) 48%,
    #d8ccb9 49%,
    #d8ccb9 52%,
    #262a31 53%,
    #262a31 100%
  );
}

.draft-card.pending {
  opacity: 0.82;
}

.draft-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10rpx;
  margin-top: 16rpx;
}

.mini-action-button {
  margin: 0;
  height: 52rpx;
  padding: 0 18rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  font-size: 22rpx;
  line-height: 50rpx;
  color: #3f2a18;
  background: #fffdf8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7rpx;
}

.draft-action-icon {
  flex: 0 0 auto;
  font-size: 22rpx;
  line-height: 1;
}

.black .mini-action-button {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
}

.generated-image-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.generated-image-card {
  overflow: hidden;
  border: 1px solid #3f2a18;
  background: #fffdf8;
  box-shadow: 4rpx 4rpx 0 rgba(74, 53, 32, 0.12);
}

.black .generated-image-card {
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 4rpx 4rpx 0 rgba(0, 0, 0, 0.36);
}

.generated-image-preview {
  display: block;
  width: 100%;
  min-height: 180rpx;
  background: rgba(63, 42, 24, 0.08);
}

.black .generated-image-preview {
  background: rgba(255, 255, 255, 0.08);
}

.generated-image-meta {
  padding: 12rpx 14rpx 0;
}

.generated-image-title {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 22rpx;
  line-height: 1.45;
  color: #6f5230;
}

.black .generated-image-title {
  color: #dfd3c0;
}

.generated-image-actions {
  display: flex;
  justify-content: flex-end;
  padding: 12rpx 14rpx 14rpx;
}

.image-generation-status {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  min-height: 48rpx;
  padding: 0 16rpx;
  border: 1px solid rgba(63, 42, 24, 0.48);
  box-sizing: border-box;
  color: #6f5230;
  background: #fffaf0;
  font-size: 22rpx;
  line-height: 46rpx;
}

.black .image-generation-status {
  color: #dfd3c0;
  border-color: rgba(216, 204, 185, 0.52);
  background: rgba(255, 255, 255, 0.08);
}

.chat-input-wrap {
  flex: 0 0 auto;
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  position: relative;
  z-index: 2;
}

.chat-feature-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10rpx;
  min-width: 0;
}

.feature-tool-button {
  flex: 0 1 auto;
  min-width: 0;
  height: 52rpx;
  margin: 0;
  padding: 0 18rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  color: #3f2a18;
  background: #fffdf8;
  font-size: 22rpx;
  line-height: 50rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.feature-tool-icon {
  flex: 0 0 auto;
  font-size: 22rpx;
  line-height: 1;
}

.feature-brain-icon {
  width: 25rpx;
  height: 25rpx;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: translateY(-1rpx);
}

.feature-toggle-button.active {
  color: #fffdf8;
  background: #3f2a18;
}

.black .feature-tool-button {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
}

.black .feature-toggle-button.active {
  color: #262a31;
  background: #d8ccb9;
}

.chat-compose-row {
  display: flex;
  align-items: flex-end;
  gap: 12rpx;
  min-width: 0;
}

.chat-editor-box {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  min-height: 128rpx;
  max-height: 340rpx;
  padding: 12rpx 14rpx;
  box-sizing: border-box;
  border-radius: 0;
  border: 1px solid #3f2a18;
  background: #fffdf8;
  box-shadow: 4rpx 4rpx 0 rgba(74, 53, 32, 0.12);
  overflow: auto;
}

.black .chat-editor-box {
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 4rpx 4rpx 0 rgba(0, 0, 0, 0.36);
}

.chat-textarea {
  width: 100%;
  min-height: 104rpx;
  max-height: 214rpx;
  margin-top: 0;
  padding: 8rpx 4rpx 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.chat-editor-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10rpx;
  margin-top: 10rpx;
  min-width: 0;
}

.chat-image-options {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8rpx;
  min-width: 0;
}

.image-option-button {
  height: 50rpx;
  margin: 0;
  max-width: 176rpx;
  padding: 0 12rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  color: #3f2a18;
  background: #fffdf8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  font-size: 21rpx;
  line-height: 48rpx;
}

.black .image-option-button {
  color: #f2e8d8;
  border-color: #d8ccb9;
  background: #262a31;
}

.image-option-button text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-option-icon,
.image-option-arrow {
  flex: 0 0 auto;
  font-size: 20rpx;
  line-height: 1;
}

.image-option-menu-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 30070;
  background: transparent;
}

.image-option-menu {
  position: fixed;
  z-index: 30080;
  max-height: 300px;
  overflow: auto;
  padding: 6rpx;
  border: 1px solid #3f2a18;
  box-sizing: border-box;
  background: #fffdf8;
  box-shadow: 6rpx 6rpx 0 rgba(74, 53, 32, 0.16);
}

.image-option-menu.black {
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 6rpx 6rpx 0 rgba(0, 0, 0, 0.38);
}

.image-option-menu-item {
  width: 100%;
  height: 42px;
  margin: 0;
  padding: 0 12px;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: #3f2a18;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 42px;
  text-align: left;
}

.image-option-menu-item + .image-option-menu-item {
  border-top: 1px solid rgba(63, 42, 24, 0.16);
}

.image-option-menu-item.active {
  color: #fffdf8;
  background: #3f2a18;
}

.image-option-menu.black .image-option-menu-item {
  color: #f2e8d8;
}

.image-option-menu.black .image-option-menu-item + .image-option-menu-item {
  border-top-color: rgba(216, 204, 185, 0.22);
}

.image-option-menu.black .image-option-menu-item.active {
  color: #262a31;
  background: #d8ccb9;
}

.image-option-menu-check {
  flex: 0 0 auto;
  width: 14px;
  font-size: 13px;
  line-height: 1;
}

.image-option-menu-check.el-icon-minus {
  opacity: 0;
}

.image-option-menu-item text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-send-button {
  flex: 0 0 auto;
  min-width: 108rpx;
  height: 50rpx;
  padding: 0 20rpx;
  font-size: 22rpx;
  line-height: 48rpx;
}

.chat-stop-button {
  color: #8f2b20;
  border-color: #8f2b20;
  background: #fff7f3;
}

.black .chat-stop-button {
  color: #f1b8ac;
  border-color: #f1b8ac;
  background: #3a2725;
}

@media screen and (max-width: 360px) {
  .chat-editor-actions {
    flex-wrap: wrap;
  }

  .chat-send-button {
    margin-left: auto;
  }

  .chat-bubble {
    max-width: 92%;
  }
}

.process-card,
.reasoning-card {
  margin-bottom: 16rpx;
  padding: 18rpx 20rpx;
  border-radius: 0;
  border: 1px solid #3f2a18;
  background: #fffdf8;
  box-shadow: 4rpx 4rpx 0 rgba(74, 53, 32, 0.12);
}

.black .process-card,
.black .reasoning-card {
  border-color: #d8ccb9;
  background: #262a31;
  box-shadow: 4rpx 4rpx 0 rgba(0, 0, 0, 0.36);
}

.process-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.process-toggle {
  flex: 0 0 auto;
  font-size: 22rpx;
  color: #9c7b55;
}

.black .process-toggle {
  color: #c8b99e;
}

.process-list {
  margin-top: 14rpx;
}

.process-step {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 6rpx 0;
}

.process-dot {
  flex: 0 0 auto;
  width: 12rpx;
  height: 12rpx;
  margin-top: 12rpx;
  border-radius: 0;
  background: rgba(170, 112, 35, 0.38);
}

.process-dot.active {
  background: #3f2a18;
  box-shadow: none;
}

.process-message {
  flex: 1;
  min-width: 0;
  font-size: 23rpx;
  line-height: 1.55;
  color: #7e6647;
  word-break: break-word;
}

.black .process-message {
  color: #d5c6ae;
}

.reasoning-text {
  display: block;
  margin-top: 14rpx;
  max-height: 220rpx;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 23rpx;
  line-height: 1.65;
  color: #6f573c;
}

.black .reasoning-text {
  color: #d8ccb9;
}

.reasoning-block {
  margin-bottom: 18rpx;
}

.reasoning-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
  padding: 12rpx 14rpx;
  border-radius: 0;
  border: 1px solid rgba(63, 42, 24, 0.35);
  box-sizing: border-box;
  color: #6f573c;
  background: #fff4df;
  cursor: pointer;
}

.reasoning-toggle-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 23rpx;
  line-height: 1.35;
  font-weight: 800;
}

.reasoning-toggle-icon {
  flex: 0 0 auto;
  font-size: 22rpx;
}

.black .reasoning-toggle {
  color: #d8ccb9;
  border-color: rgba(216, 204, 185, 0.45);
  background: rgba(255, 255, 255, 0.05);
}

.chat-bubble .reasoning-inline {
  margin-top: 0;
  margin-bottom: 0;
  max-height: none;
  overflow: visible;
  padding: 16rpx 18rpx;
  border-radius: 0;
  border: 1px solid rgba(63, 42, 24, 0.35);
  background: #fff4df;
  box-shadow: none;
}

.reasoning-toggle + .reasoning-inline {
  margin-top: 10rpx;
}

.black .chat-bubble .reasoning-inline {
  border-color: rgba(216, 204, 185, 0.45);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.status-text,
.empty-text,
.error-text {
  padding: 28rpx 16rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #9c7b55;
}

.error-text {
  color: #c24a32;
}

.panel-note {
  flex: 0 0 auto;
  margin-top: 14rpx;
  font-size: 21rpx;
  line-height: 1.5;
  color: #a48966;
  text-align: center;
}

.black .panel-note {
  color: #bcae95;
}
</style>
