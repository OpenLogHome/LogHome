<template>
  <div class="native-editor">
    <div class="editor-toolbar" aria-label="编辑工具">
      <button
        :disabled="disabled"
        title="撤销 Ctrl / ⌘ Z"
        @click="command('undo')"
      >
        <i aria-hidden="true" class="el-icon-refresh-left" /> 撤销
      </button>
      <button :disabled="disabled" title="重做" @click="command('redo')">
        <i aria-hidden="true" class="el-icon-refresh-right" />
      </button>
      <span class="toolbar-divider" />
      <button :disabled="disabled" @click="format">自动排版</button>
      <button :disabled="disabled" @click="$refs.image.click()">
        <i aria-hidden="true" class="el-icon-picture-outline" /> 图片
      </button>
      <button :aria-pressed="String(findOpen)" @click="findOpen = !findOpen">
        <i aria-hidden="true" class="el-icon-search" /> 查找替换
      </button>
      <button
        :disabled="Boolean(realtime)"
        :aria-pressed="String(sourceOpen)"
        @click="toggleSource"
      >
        {{ sourceOpen ? "返回正文" : "JSON 源码" }}
      </button>
      <span class="toolbar-spacer" /><span
        >{{ count.textCount.toLocaleString() }} 字 ·
        {{ count.imageCount }} 图</span
      >
      <input
        ref="image"
        type="file"
        accept="image/*"
        hidden
        @change="uploadImage"
      />
    </div>
    <div
      v-if="preferences.quickInputs"
      class="quick-input-bar"
      aria-label="快捷输入"
    >
      <button
        v-for="symbol in preferences.quickInputs.split('|').filter(Boolean)"
        :key="symbol"
        :disabled="disabled || sourceOpen"
        @click="quickInput(symbol)"
      >
        {{ symbol }}
      </button>
    </div>
    <div v-if="findOpen" class="find-bar">
      <input
        v-model="findText"
        aria-label="查找文本"
        placeholder="查找文本"
        @keydown.enter="findNext"
      /><button @click="findNext">下一个</button>
      <input
        v-model="replacement"
        aria-label="替换文本"
        placeholder="替换为"
      /><button :disabled="disabled" @click="replace(false)">替换</button
      ><button :disabled="disabled" @click="replace(true)">全部替换</button>
    </div>
    <div class="editor-scroll" :style="paperStyle">
      <article class="writer-paper">
        <input
          class="chapter-title"
          :value="title"
          :disabled="disabled"
          aria-label="章节标题"
          placeholder="输入章节标题"
          maxlength="100"
          @input="$emit('title', $event.target.value)"
        />
        <div v-if="sourceOpen" class="source-editor">
          <textarea
            v-model="sourceText"
            aria-label="章节 JSON 源码"
            rows="20"
            :disabled="disabled"
          /><button :disabled="disabled" @click="applySource">应用源码</button>
        </div>
        <editor-content v-show="!sourceOpen" v-if="editor" :editor="editor" />
      </article>
    </div>
  </div>
</template>
<script>
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import { createBackgroundSkinStyle } from "~/utils/reader-backgrounds";
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import {
  LegacyParagraph,
  createRealtimeParagraphIdExtension,
} from "~/utils/writer/extensions";
import {
  parseLegacyContent,
  legacyBlocksToDoc,
  docToLegacyBlocks,
  stringifyLegacyContent,
  countLegacyContent,
  formatLegacyBlocks,
} from "~/utils/writer/legacy-adapter";
import { writerRequest } from "~/utils/writer/api";
export default {
  mixins: [writerDialogTheme],
  components: { EditorContent },
  props: {
    value: String,
    title: String,
    disabled: Boolean,
    realtime: Object,
    preferences: Object,
  },
  data: () => ({
    editor: null,
    findOpen: false,
    findText: "",
    replacement: "",
    nextPosition: 0,
    sourceOpen: false,
    sourceText: "",
    count: { textCount: 0, imageCount: 0 },
  }),
  computed: {
    paperStyle() {
      return {
        ...createBackgroundSkinStyle(this.preferences.backgroundSkin),
        "--writer-font-size": `${this.preferences.fontSize}px`,
        "--writer-line-height": this.preferences.lineHeight,
        "--writer-font":
          this.preferences.fontFamily === "sans-serif"
            ? "var(--writer-ui-font)"
            : this.preferences.fontFamily,
        "--writer-paper-width": `${this.preferences.paperWidth}px`,
      };
    },
  },
  watch: {
    disabled(value) {
      if (this.editor) this.editor.setEditable(!value);
    },
    value(value) {
      if (
        this.editor &&
        !this.realtime &&
        stringifyLegacyContent(docToLegacyBlocks(this.editor.getJSON())) !==
          value
      )
        this.setContent(value);
    },
  },
  mounted() {
    const extensions = [
      StarterKit.configure({
        history: this.realtime ? false : undefined,
        paragraph: false,
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
      LegacyParagraph,
      TextStyle,
      Image.configure({ inline: false }),
    ];
    if (this.realtime)
      extensions.push(
        createRealtimeParagraphIdExtension(
          (ids) => this.realtime.allocate(ids),
          () => this.realtime.reserve()
        ),
        Collaboration.configure({
          document: this.realtime.document,
          field: "body",
        }),
        CollaborationCursor.configure({
          provider: this.realtime.provider,
          user: this.realtime.user,
        })
      );
    this.editor = new Editor({
      extensions,
      editable: !this.disabled,
      ...(this.realtime
        ? {}
        : { content: legacyBlocksToDoc(parseLegacyContent(this.value)) }),
      editorProps: {
        attributes: {
          "aria-label": "章节正文",
          role: "textbox",
          "aria-multiline": "true",
        },
      },
      onUpdate: () => this.changed(),
      onTransaction: ({ transaction }) => {
        if (transaction.docChanged) this.$emit("transaction", transaction);
      },
      onSelectionUpdate: ({ editor }) =>
        this.$emit("selection", {
          from: editor.state.selection.from,
          to: editor.state.selection.to,
          text: editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            "\n"
          ),
        }),
    });
    this.refreshCount();
    if (this.realtime) this.realtime.setEditor(this.editor);
  },
  beforeDestroy() {
    if (this.editor) this.editor.destroy();
  },
  methods: {
    quickInput(symbol) {
      if (this.disabled || !this.editor) return;
      const { from, to } = this.editor.state.selection;
      const paired = [
        "“”",
        "《》",
        "（）",
        "【】",
        "「」",
        "『』",
        "()",
        "[]",
        "{}",
      ].includes(symbol);
      const selected = paired
        ? this.editor.state.doc.textBetween(from, to, "\n")
        : "";
      this.editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: paired ? symbol[0] + selected + symbol[1] : symbol,
        })
        .run();
      if (paired)
        this.editor.commands.setTextSelection(
          selected
            ? { from: from + 1, to: from + 1 + selected.length }
            : from + 1
        );
    },
    toggleSource() {
      this.sourceOpen = !this.sourceOpen;
      this.sourceText = JSON.stringify(parseLegacyContent(this.value), null, 2);
    },
    applySource() {
      try {
        const blocks = JSON.parse(this.sourceText);
        if (
          !Array.isArray(blocks) ||
          !blocks.every(
            (block) =>
              block &&
              ((block.type === "text" && typeof block.value === "string") ||
                (block.type === "image" && /^https?:\/\//.test(block.img)))
          )
        )
          throw new Error();
        this.editor.commands.setContent(
          legacyBlocksToDoc(parseLegacyContent(blocks))
        );
        this.sourceOpen = false;
      } catch (_) {
        this.writerMessage("error", "源码必须是合法的文字／图片段落数组");
      }
    },
    refreshCount() {
      this.count = countLegacyContent(docToLegacyBlocks(this.editor.getJSON()));
    },
    changed() {
      this.refreshCount();
      this.$emit(
        "input",
        stringifyLegacyContent(docToLegacyBlocks(this.editor.getJSON()))
      );
    },
    setContent(content) {
      this.editor.commands.setContent(
        legacyBlocksToDoc(parseLegacyContent(content)),
        false
      );
      this.refreshCount();
    },
    command(name) {
      if (this.editor && !this.disabled)
        this.editor.chain().focus()[name]().run();
    },
    insert(text) {
      if (!this.disabled)
        this.editor
          .chain()
          .focus()
          .insertContent(
            text.split("\n").map((value) => ({
              type: "paragraph",
              content: value ? [{ type: "text", text: value }] : [],
            }))
          )
          .run();
    },
    insertImage(url) {
      if (!this.disabled)
        this.editor.chain().focus().setImage({ src: url }).run();
    },
    replaceSelection(text, selection) {
      if (
        this.disabled ||
        !selection ||
        this.editor.state.doc.textBetween(
          selection.from,
          selection.to,
          "\n"
        ) !== selection.text
      )
        throw new Error("选中内容已经变化，请重新选择");
      this.editor
        .chain()
        .focus()
        .insertContentAt(
          { from: selection.from, to: selection.to },
          { type: "text", text }
        )
        .run();
    },
    format() {
      const doc = legacyBlocksToDoc(
        formatLegacyBlocks(docToLegacyBlocks(this.editor.getJSON()))
      );
      this.editor.commands.setContent(doc);
    },
    findNext() {
      if (!this.findText || !this.editor) return;
      const matches = [];
      this.editor.state.doc.descendants((node, pos) => {
        if (!node.isText) return;
        let index = node.text.indexOf(this.findText);
        while (index !== -1) {
          matches.push({
            from: pos + index,
            to: pos + index + this.findText.length,
          });
          index = node.text.indexOf(
            this.findText,
            index + this.findText.length
          );
        }
      });
      const match =
        matches.find((item) => item.from >= this.nextPosition) || matches[0];
      if (!match) {
        this.writerMessage("info", "没有找到匹配文本");
        return;
      }
      this.nextPosition = match.to;
      this.editor
        .chain()
        .focus()
        .setTextSelection(match)
        .scrollIntoView()
        .run();
    },
    replace(all) {
      if (!this.findText || this.disabled) return;
      const tr = this.editor.state.tr,
        matches = [];
      this.editor.state.doc.descendants((node, pos) => {
        if (!node.isText) return;
        let index = node.text.indexOf(this.findText);
        while (index !== -1) {
          matches.push({
            from: pos + index,
            to: pos + index + this.findText.length,
          });
          index = node.text.indexOf(
            this.findText,
            index + this.findText.length
          );
        }
      });
      const chosen = all
        ? matches
        : matches
            .filter((item) => item.from === this.editor.state.selection.from)
            .slice(0, 1);
      chosen.reverse().forEach((item) => {
        if (this.replacement)
          tr.insertText(this.replacement, item.from, item.to);
        else tr.delete(item.from, item.to);
      });
      this.editor.view.dispatch(tr);
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      try {
        const result = await writerRequest(
          "/essays/upload_manga_page?article_type=mangaPage",
          { method: "POST", body: file }
        );
        this.insertImage(result.url);
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
  },
};
</script>
<style>
.native-editor {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}
.editor-toolbar,
.find-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-bottom: 1px solid var(--writer-border);
  background: var(--writer-panel);
  font-size: 12px;
  color: var(--writer-muted);
  flex-wrap: wrap;
}
.quick-input-bar {
  display: flex;
  gap: 2px;
  padding: 4px 20px;
  background: var(--writer-panel);
  border-bottom: 1px solid var(--writer-border);
  flex-wrap: wrap;
  font-size: 13px;
}
.quick-input-bar button {
  min-width: 28px;
}
.source-editor textarea {
  width: 100%;
  resize: vertical;
  min-height: 400px;
  font: 13px/1.7 monospace;
}
.source-editor button {
  margin-top: 12px;
  border: 1px solid var(--writer-border);
}
.toolbar-spacer {
  flex: 1;
}
.toolbar-divider {
  width: 1px;
  height: 18px;
  background: var(--writer-border);
  margin: 0 6px;
}
.editor-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 48px 40px;
}
.writer-paper {
  max-width: var(--writer-paper-width, 820px);
  margin: auto;
  padding: 16px 40px 64px;
  min-height: 100%;
  background: var(--writer-bg);
}
.chapter-title {
  display: block;
  width: 100%;
  background: transparent !important;
  border: 0 !important;
  font-size: 32px !important;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.025em;
  padding: 4px 0 16px !important;
  color: var(--writer-text);
  margin-bottom: 24px;
}
.native-editor .ProseMirror {
  outline: none;
  min-height: 400px;
  font: var(--writer-font-size, 18px) / var(--writer-line-height, 1.9)
    var(--writer-font, var(--writer-ui-font));
  color: var(--writer-text);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.native-editor .ProseMirror p {
  margin: 0 0 0.8em;
}
.native-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
}
.native-editor .ProseMirror-selectednode {
  outline: 2px solid var(--writer-focus);
}
.native-editor .collaboration-cursor__caret {
  border-left: 1px solid;
  border-right: 1px solid;
  position: relative;
  pointer-events: none;
}
.native-editor .collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font: 11px sans-serif;
  color: white;
  padding: 2px 5px;
  white-space: nowrap;
  border-radius: 3px;
}
.find-bar input {
  width: 150px;
}
@media (max-width: 1100px) {
  .editor-scroll {
    padding: 24px;
  }
  .writer-paper {
    padding: 16px 8px 48px;
  }
  .chapter-title {
    font-size: 28px !important;
  }
}
</style>
