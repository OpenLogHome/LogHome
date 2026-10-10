<template>
  <writer-panel
    class="writer-ai"
    title="笔泡 · 写作助手"
    subtitle="与你一起构思、润色与续写"
    :scrollable="false"
    @close="$emit('close')"
  >
    <button slot="actions" :disabled="running" @click="clear">新对话</button>
    <div class="ai-options">
      <select v-model="thinking" aria-label="思考模式" :disabled="running">
        <option value="fast">快速思考</option>
        <option value="deep">深度思考</option></select
      ><label
        ><input
          v-model="generateImage"
          type="checkbox"
          :disabled="running"
        />辅助生图</label
      >
    </div>
    <div v-if="generateImage" class="ai-options">
      <input
        v-model="imageStyle"
        aria-label="图片风格"
        placeholder="图片风格，例如水彩"
      /><select v-model="imageRatio" aria-label="图片比例">
        <option>1:1</option>
        <option>16:9</option>
        <option>9:16</option>
      </select>
    </div>
    <p class="ai-note">
      回答会结合当前章节与作品索引。生成建议后可预览、插入或替换；请求按服务端规则消耗红石。
    </p>
    <div
      ref="messages"
      class="ai-messages"
      aria-live="polite"
      aria-relevant="additions"
    >
      <writer-empty-state
        v-if="!messages.length"
        icon="el-icon-magic-stick"
        title="从一个想法开始"
        description="告诉笔泡你想写什么，或选中正文后一起打磨。"
      >
        <button
          :disabled="running"
          @click="usePrompt('结合当前章节，续写接下来的情节。')"
        >
          续写情节
        </button>
        <button
          :disabled="running"
          @click="usePrompt('润色选中的文字，保留原意与叙事风格。')"
        >
          润色选段
        </button>
        <button
          :disabled="running"
          @click="usePrompt('梳理当前章节的人物动机与关系。')"
        >
          梳理人物
        </button>
      </writer-empty-state>
      <article
        v-for="message in messages"
        :key="message.id"
        :class="message.role"
      >
        <small>{{ message.role === "user" ? "你" : "笔泡" }}</small>
        <details v-if="message.reasoning">
          <summary>思考过程</summary>
          <p>{{ message.reasoning }}</p>
        </details>
        <p>{{ message.content || (running ? "正在思考…" : "暂无正文建议") }}</p>
        <div
          v-for="image in message.images || []"
          :key="image.url"
          class="ai-image"
        >
          <img :src="image.url" alt="笔泡生成的图片" /><button
            :disabled="!canEdit"
            @click="$emit('image', image.url)"
          >
            插入图片
          </button>
        </div>
        <div
          v-if="message.role === 'assistant' && message.content && !running"
          class="ai-actions"
        >
          <button :disabled="!canEdit" @click="previewText(message)">
            预览采用</button
          ><button @click="copy(message.content)">复制</button
          ><button :disabled="!canEdit" @click="smartApply(message)">
            智能应用
          </button>
        </div>
      </article>
    </div>
    <p v-if="error" class="ai-error" role="alert">
      {{ error }}<button v-if="task" @click="resume">继续接收</button>
    </p>
    <p v-if="status" role="status">{{ status }}</p>
    <form slot="footer" @submit.prevent="send">
      <small v-if="selection.text">已选择 {{ selection.text.length }} 字</small
      ><textarea
        ref="prompt"
        v-model="prompt"
        rows="4"
        aria-label="写作助手指令"
        placeholder="讨论情节、润色选段，或续写故事…"
        :disabled="running"
        @keydown.ctrl.enter.prevent="send"
        @keydown.meta.enter.prevent="send"
      />
      <div class="ai-composer-actions">
        <small>⌘ / Ctrl Enter 发送</small>
        <button v-if="running" type="button" @click="stop">停止接收</button
        ><button v-else class="primary" :disabled="!prompt.trim()">发送</button>
      </div>
    </form>
    <el-dialog
      class="writer-dialog-wrapper"
      title="采用 AI 建议"
      :visible.sync="previewOpen"
      width="720px"
      :custom-class="writerDialogClass"
      append-to-body
      ><p v-if="candidate.original">原文</p>
      <pre v-if="candidate.original" class="candidate-original">{{
        candidate.original
      }}</pre>
      <p>建议文本</p>
      <textarea
        v-model="candidate.text"
        rows="12"
        class="candidate-input"
      /><span slot="footer"
        ><el-button @click="previewOpen = false">取消</el-button
        ><el-button :disabled="!canEdit" @click="adopt(false)"
          >插入到光标</el-button
        ><el-button
          type="primary"
          :disabled="
            !canEdit || !candidate.selection || !candidate.selection.text
          "
          @click="adopt(true)"
          >替换选段</el-button
        ></span
      ></el-dialog
    >
  </writer-panel>
</template>
<script>
import WriterPanel from "./WriterPanel.vue";
import WriterEmptyState from "./WriterEmptyState.vue";
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import { mergeWriterStreamText } from "~/utils/writer/stream-text";
import {
  writerRequest,
  writerEndpoints,
  writerIdentity,
} from "~/utils/writer/api";
import { parseLegacyContent } from "~/utils/writer/legacy-adapter";
import { consumeWriterStream } from "~/utils/writer/ndjson";
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2)}`;
export default {
  mixins: [writerDialogTheme],
  components: { WriterPanel, WriterEmptyState },
  props: {
    theme: String,
    article: Object,
    sessionId: String,
    selection: Object,
    canEdit: Boolean,
  },
  data: () => ({
    messages: [],
    prompt: "",
    thinking: "fast",
    generateImage: false,
    imageStyle: "",
    imageRatio: "1:1",
    running: false,
    status: "",
    error: "",
    task: null,
    conversation: uid(),
    previewOpen: false,
    candidate: { text: "", original: "", selection: null },
  }),
  computed: {
    storageKey() {
      return `loghome:pc:writer-ai:${writerIdentity().id}:${
        this.article.article_id
      }`;
    },
    plainText() {
      return parseLegacyContent(this.article.content)
        .filter((p) => p.type === "text")
        .map((p) => p.value)
        .join("\n");
    },
  },
  mounted() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) || "null");
      if (saved) {
        this.messages = saved.messages || [];
        this.conversation = saved.conversation || uid();
        this.task = saved.task || null;
      }
    } catch (_) {}
  },
  beforeDestroy() {
    this.stop();
    this.persist();
  },
  methods: {
    usePrompt(value) {
      if (this.running) return;
      this.prompt = value;
      this.$nextTick(() => this.$refs.prompt && this.$refs.prompt.focus());
    },
    persist() {
      try {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify({
            messages: this.messages.slice(-40),
            conversation: this.conversation,
            task: this.task,
          })
        );
      } catch (_) {
        this.error = "对话本机保存失败，可复制保留当前建议";
      }
    },
    clear() {
      this.messages = [];
      this.task = null;
      this.conversation = uid();
      this.persist();
    },
    async send() {
      if (this.running || !this.prompt.trim()) return;
      try {
        await this.writerConfirm(
          "写作助手会按所选思考和生图模式消耗红石，继续？",
          "请求写作助手"
        );
      } catch (_) {
        return;
      }
      const prompt = this.prompt.trim(),
        id = uid(),
        question = { id: uid(), role: "user", content: prompt },
        answer = {
          id,
          role: "assistant",
          content: "",
          reasoning: "",
          images: [],
        };
      this.messages.push(question, answer);
      this.prompt = "";
      this.task = {
        messageId: id,
        taskId: `writer-ai:${this.article.article_id}:${this.conversation}:${id}`,
        lastEventId: 0,
        prompt,
        selection: { ...this.selection },
        status: "running",
        thinking: this.thinking,
        features: {
          image_generation: this.generateImage,
          image_generation_style: this.imageStyle,
          image_generation_aspect_ratio: this.imageRatio,
        },
      };
      this.persist();
      await this.resume();
    },
    payload() {
      const task = this.task;
      return {
        article_id: this.article.article_id,
        novel_id: this.article.novel_id,
        edit_session_id: this.sessionId,
        mode: "chat",
        thinking_mode: task.thinking || this.thinking,
        features: task.features || {
          image_generation: this.generateImage,
          image_generation_style: this.imageStyle,
          image_generation_aspect_ratio: this.imageRatio,
        },
        prompt: task.prompt,
        messages: this.messages
          .filter((m) => m.id !== task.messageId)
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content })),
        selection: task.selection,
        cursor_context: {
          cursor_position: task.selection.from,
          selected_text: task.selection.text,
        },
        current_chapter: {
          article_id: this.article.article_id,
          novel_id: this.article.novel_id,
          title: this.article.title,
          content: this.article.content,
          plain_text: this.plainText,
        },
        session_id: this.conversation,
        message_id: task.messageId,
        task_id: task.taskId,
        resume_from_event_id: task.lastEventId,
      };
    },
    async resume() {
      if (!this.task || this.running) return;
      this.running = true;
      this.error = "";
      this.controller = new AbortController();
      try {
        const response = await writerRequest(
          "/library/writer_novel_ai_assist_stream",
          {
            base: writerEndpoints().ai,
            method: "POST",
            raw: true,
            signal: this.controller.signal,
            body: this.payload(),
          }
        );
        await consumeWriterStream(response, (event) => this.event(event), {
          signal: this.controller.signal,
        });
        if (this.task) this.error = "连接已结束，任务尚未完成，可继续接收";
      } catch (error) {
        if (error.name !== "AbortError") this.error = error.message;
      } finally {
        this.running = false;
        this.status = "";
        this.persist();
      }
    },
    event(event) {
      if (!this.task) return;
      const message = this.messages.find((m) => m.id === this.task.messageId);
      if (!message) return;
      if (
        event.type === "task" &&
        event.created === true &&
        this.task.lastEventId > 0
      ) {
        message.content = "";
        message.reasoning = "";
        message.images = [];
        this.task.lastEventId = 0;
      }
      const id = Number(event.event_id || 0);
      if (id && id <= this.task.lastEventId) return;
      if (id) this.task.lastEventId = id;
      if (event.type === "task" && event.task_id)
        this.task.taskId = event.task_id;
      if (event.type === "delta")
        message.content = mergeWriterStreamText(
          message.content,
          event.content || event.text || ""
        );
      if (
        ["reasoning_delta", "thinking_delta", "reasoning"].includes(event.type)
      )
        message.reasoning = mergeWriterStreamText(
          message.reasoning,
          event.content || event.text || ""
        );
      if (["status", "process"].includes(event.type))
        this.status = event.message || event.text || "";
      if (event.type === "generated_image") {
        for (const image of event.images || [event.image])
          if (
            image &&
            image.url &&
            !message.images.some((i) => i.url === image.url)
          )
            message.images.push(image);
      }
      if (event.type === "error")
        throw new Error(event.message || "写作助手请求失败");
      if (event.type === "done") this.task = null;
      this.persist();
      this.$nextTick(() => {
        if (this.$refs.messages)
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
      });
    },
    stop() {
      if (this.controller) this.controller.abort();
      this.running = false;
      this.status = "";
    },
    generatedText(message) {
      const matches = [
        ...message.content.matchAll(/<draft>([\s\S]*?)<\/draft>/g),
      ];
      return matches.length
        ? matches.map((m) => m[1]).join("\n\n")
        : message.content;
    },
    previewText(message) {
      this.candidate = {
        text: this.generatedText(message),
        original: this.selection.text,
        selection: { ...this.selection },
      };
      this.previewOpen = true;
    },
    adopt(replace) {
      if (replace)
        this.$emit("replace", {
          text: this.candidate.text,
          selection: this.candidate.selection,
        });
      else this.$emit("insert", this.candidate.text);
      this.previewOpen = false;
    },
    async smartApply(message) {
      try {
        const editor =
          this.$parent.$refs.editor && this.$parent.$refs.editor.editor;
        if (!editor) return;
        const blocks = [];
        let offset = 0;
        editor.state.doc.descendants((node, pos) => {
          if (!node.isTextblock) return true;
          const text = node.textContent.trim();
          if (text)
            blocks.push({
              index: blocks.length + 1,
              from: pos,
              to: pos + node.nodeSize,
              char_start: offset,
              char_end: offset + node.textContent.length,
              text,
            });
          offset += node.textContent.length + 1;
          return false;
        });
        const baseline = editor.getJSON();
        const response = await writerRequest(
          "/library/writer_novel_ai_smart_replace",
          {
            base: writerEndpoints().ai,
            method: "POST",
            body: {
              article_id: this.article.article_id,
              novel_id: this.article.novel_id,
              edit_session_id: this.sessionId,
              draft_text: this.generatedText(message),
              question:
                this.messages.filter((m) => m.role === "user").slice(-1)[0]
                  ?.content || "",
              answer: message.content,
              messages: this.messages
                .slice(-12)
                .map((m) => ({ role: m.role, content: m.content })),
              cursor_context: { cursor_position: this.selection.from },
              current_chapter: {
                article_id: this.article.article_id,
                novel_id: this.article.novel_id,
                title: this.article.title,
                plain_text: this.plainText,
              },
              blocks,
            },
          }
        );
        if (JSON.stringify(baseline) !== JSON.stringify(editor.getJSON()))
          throw new Error("正文已经变化，请重新生成智能预览");
        const decision = response.data || {};
        if (decision.action === "insert") {
          this.candidate = {
            text: decision.replacement_text || this.generatedText(message),
            original: "",
            selection: null,
          };
          this.previewOpen = true;
          return;
        }
        const first = blocks.find(
            (p) => p.index === Number(decision.start_paragraph_index)
          ),
          last = blocks.find(
            (p) => p.index === Number(decision.end_paragraph_index)
          );
        if (!first || !last) throw new Error("无法定位替换范围");
        const from = first.from + 1,
          to = last.to - 1,
          text = editor.state.doc.textBetween(from, to, "\n");
        if (text.trim() !== String(decision.original_text || "").trim())
          throw new Error("智能建议与原文不匹配，请重新检查");
        this.candidate = {
          text: decision.replacement_text || this.generatedText(message),
          original: text,
          selection: { from, to, text },
        };
        this.previewOpen = true;
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
    async copy(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.writerMessage("success", "已复制");
      } catch (_) {
        this.writerMessage("error", "复制失败，请手动选择文本复制");
      }
    },
  },
};
</script>
<!-- Scope by workspace ancestry so Vue 2 slot roots receive the same styles. -->
<style>
.writer-workspace .writer-ai {
  min-height: 0;
}
.writer-workspace .writer-ai .ai-options {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.writer-workspace .writer-ai .ai-options label {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 12px;
}
.writer-workspace .writer-ai .ai-options input:not([type="checkbox"]) {
  min-width: 0;
  width: 100%;
}
.writer-workspace .writer-ai .ai-note {
  font-size: 12px;
  color: var(--writer-muted);
  line-height: 1.8;
  margin: 4px 0 14px;
}
.writer-workspace .writer-ai .ai-messages {
  flex: 1;
  overflow: auto;
  min-height: 0;
}
.writer-workspace .writer-ai .ai-messages article {
  padding: 14px 0;
  border-bottom: 1px solid var(--writer-border);
}
.writer-workspace .writer-ai .ai-messages p {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.8;
}
.writer-workspace .writer-ai .ai-messages small {
  color: var(--writer-muted);
}
.writer-workspace .writer-ai .ai-messages .user {
  background: var(--writer-sidebar);
  padding: 12px;
  border-radius: 4px;
  margin-top: 10px;
}
.writer-workspace .writer-ai .ai-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.writer-workspace .writer-ai .ai-error {
  color: var(--writer-danger);
  font-size: 12px;
}
.writer-workspace .writer-ai .ai-image img {
  max-width: 100%;
  border-radius: 4px;
}
.writer-workspace .writer-ai form {
  display: grid;
  gap: 8px;
  margin: 0;
}
.writer-workspace .writer-ai textarea {
  width: 100%;
}
.writer-workspace .writer-ai .ai-composer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 0;
}
</style>
<style scoped>
.candidate-input {
  width: 100%;
  font: 14px/1.8 var(--writer-ui-font);
  padding: 14px;
  border: 1px solid var(--writer-border);
  border-radius: 4px;
  resize: vertical;
}
.candidate-original {
  max-height: 180px;
  overflow: auto;
  white-space: pre-wrap;
  color: var(--writer-muted);
  background: var(--writer-sidebar);
  padding: 12px;
}
</style>
