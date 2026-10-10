<template>
  <el-dialog
    class="writer-dialog-wrapper"
    title="检查与发布"
    :visible="true"
    :before-close="close"
    width="860px"
    top="6vh"
    :custom-class="writerDialogClass"
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="publish-layout">
      <section>
        <h3>{{ article.title }}</h3>
        <p>
          {{ count.textCount.toLocaleString() }} 字 ·
          {{ count.imageCount }} 张图片
        </p>
        <p v-if="Number(novel.is_personal) === 1" class="publish-note">
          当前作品为私密。章节发布后仍按作品访问权限开放，可在作品设置中公开。
        </p>
        <div
          v-if="article.article_type !== 'worldVocabulary'"
          class="publish-checks"
        >
          <el-button
            size="small"
            :loading="checking === 'standard'"
            :disabled="Boolean(checking)"
            @click="check(false)"
            >基础校对</el-button
          ><el-button
            size="small"
            :loading="checking === 'smart'"
            :disabled="Boolean(checking)"
            @click="check(true)"
            >智能校对</el-button
          >
        </div>
        <p v-if="error" role="alert">{{ error }}</p>
        <p v-if="result">
          检查完成：{{ issues.length }} 段建议<template
            v-if="result.errors && result.errors.length"
            >，{{ result.errors.length }} 段失败（可重试）</template
          >
        </p>
        <article
          v-for="(item, index) in issues"
          :key="item.paragraph_hash || index"
          class="correction-item"
        >
          <small>段落 {{ item.paragraph_index }}</small>
          <p class="original-text">{{ item.original_text }}</p>
          <p class="corrected-text">{{ item.corrected_text }}</p>
          <el-button size="mini" :disabled="busy" @click="apply(item)"
            >采用建议</el-button
          ><el-button size="mini" @click="ignore(item)">忽略</el-button>
        </article>
      </section>
      <aside>
        <label
          >发布方式<el-radio-group v-model="mode" :disabled="busy"
            ><el-radio label="now">立即发布</el-radio
            ><el-radio label="schedule">定时发布</el-radio
            ><el-radio label="draft">退回草稿</el-radio></el-radio-group
          ></label
        ><label v-if="mode === 'schedule'"
          >北京时间<input v-model="time" type="datetime-local"
        /></label>
        <p>
          保存写作稿不会自动更新读者稿。发布时会再次校验当前内容及协作版本。
        </p>
        <el-button
          type="primary"
          :loading="busy"
          :disabled="!canPublish || Boolean(checking) || !article.title.trim()"
          @click="submit"
          >{{
            mode === "now"
              ? "确认发布"
              : mode === "schedule"
              ? "设置定时发布"
              : "确认退回草稿"
          }}</el-button
        >
      </aside>
    </div>
  </el-dialog>
</template>
<script>
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import {
  writerPost,
  writerRequest,
  writerEndpoints,
  writerIdentity,
} from "~/utils/writer/api";
import {
  parseLegacyContent,
  countLegacyContent,
  stringifyLegacyContent,
} from "~/utils/writer/legacy-adapter";
import {
  buildCorrectionParagraphs,
  loadSmartCorrectionCache,
  persistSmartCorrectionCache,
  writeSmartParagraphResultsToCache,
  getCachedSmartParagraphResult,
} from "~/utils/writer/correction-cache";
import { readWriterCorrectionStream } from "~/utils/writer/correction-stream";
export default {
  mixins: [writerDialogTheme],
  props: {
    article: Object,
    novel: Object,
    canPublish: Boolean,
    busy: Boolean,
    theme: String,
  },
  data: () => ({
    mode: "now",
    time: "",
    checking: "",
    error: "",
    result: null,
    ignored: [],
  }),
  computed: {
    count() {
      return countLegacyContent(parseLegacyContent(this.article.content));
    },
    issues() {
      return (
        (this.result &&
          (this.result.corrections || this.result.paragraph_results)) ||
        []
      ).filter(
        (item) =>
          item.has_issue &&
          !item.error &&
          !this.ignored.includes(item.paragraph_hash)
      );
    },
  },
  beforeDestroy() {
    if (this.controller) this.controller.abort();
  },
  methods: {
    close() {
      if (this.busy) return;
      if (this.controller) this.controller.abort();
      this.$emit("close");
    },
    async check(smart) {
      this.error = "";
      this.checking = smart ? "smart" : "standard";
      this.ignored = [];
      try {
        if (!smart) {
          this.result = await writerPost("get_article_text_correction", {
            article_id: this.article.article_id,
            title: this.article.title,
            content: this.article.content,
            paragraphs: buildCorrectionParagraphs(this.article.content),
          });
          return;
        }
        await this.writerConfirm(
          "智能校对会按服务端规则消耗红石。继续检查当前章节？",
          "智能校对"
        );
        const paragraphs = buildCorrectionParagraphs(this.article.content),
          account = writerIdentity().id,
          cache = await loadSmartCorrectionCache(account);
        const cached = paragraphs
            .map((p) => getCachedSmartParagraphResult(cache, p))
            .filter(Boolean),
          missing = paragraphs.filter(
            (p) => !getCachedSmartParagraphResult(cache, p)
          );
        if (!missing.length) {
          this.result = {
            paragraph_results: cached,
            corrections: cached.filter((p) => p.has_issue),
            errors: [],
          };
          return;
        }
        this.controller = new AbortController();
        const response = await writerRequest(
          "/library/writer_text_correction",
          {
            base: writerEndpoints().ai,
            method: "POST",
            raw: true,
            signal: this.controller.signal,
            body: {
              article_id: this.article.article_id,
              novel_id: this.novel.novel_id,
              paragraphs: missing,
              request_id: `pc-correction-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,
            },
          }
        );
        let final = null;
        const result = await readWriterCorrectionStream(response, {
          paragraphs: missing,
          onEvent: (event) => {
            if (
              ["done", "complete", "completed", "result"].includes(event.type)
            ) {
              final = event.result || event.data || event;
              return final;
            }
          },
          buildFallbackResult: () => final,
        });
        const merged = [...cached, ...(result.paragraph_results || [])];
        this.result = {
          ...result,
          paragraph_results: merged,
          corrections: merged.filter((p) => p.has_issue && !p.error),
        };
        await persistSmartCorrectionCache(
          account,
          writeSmartParagraphResultsToCache(
            cache,
            result.paragraph_results || []
          )
        );
      } catch (error) {
        if (error instanceof Error) this.error = error.message;
      } finally {
        this.checking = "";
      }
    },
    ignore(item) {
      this.ignored.push(item.paragraph_hash);
    },
    apply(item) {
      const blocks = parseLegacyContent(this.article.content),
        paragraphs = buildCorrectionParagraphs(this.article.content),
        paragraph = paragraphs.find(
          (p) =>
            p.paragraph_index === item.paragraph_index &&
            p.text === item.original_text &&
            p.paragraph_hash === item.paragraph_hash
        );
      if (!paragraph) {
        this.writerMessage("warning", "正文已经变化，请重新校对");
        return;
      }
      const block = blocks.find(
        (block) =>
          block.type === "text" &&
          Number(block.id) === Number(paragraph.paragraph_id) &&
          block.value.trim() === item.original_text.trim()
      );
      if (!block) {
        this.writerMessage("warning", "无法定位原段落，请重新校对");
        return;
      }
      const indent = (block.value.match(/^\s*/) || [""])[0];
      block.value = indent + item.corrected_text.trimStart();
      this.$emit("correct", stringifyLegacyContent(blocks));
      this.ignore(item);
    },
    async submit() {
      if (
        this.mode === "schedule" &&
        (!this.time || new Date(this.time + "+08:00").getTime() <= Date.now())
      ) {
        this.writerMessage("warning", "请选择未来的北京时间");
        return;
      }
      if (this.mode === "draft") {
        try {
          await this.writerConfirm(
            "退回草稿将撤下读者正在阅读的章节，并取消定时发布。继续？",
            "退回草稿"
          );
        } catch (_) {
          return;
        }
      }
      this.$emit("publish", {
        mode: this.mode,
        time:
          this.mode === "schedule" ? this.time.replace("T", " ") + ":00" : null,
      });
    },
  },
};
</script>
<style scoped>
.publish-layout {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 28px;
  max-height: 70vh;
}
.publish-layout > section {
  overflow: auto;
  padding-right: 16px;
}
.publish-layout h3 {
  margin-top: 0;
}
.publish-layout aside {
  border-left: 1px solid var(--writer-border);
  padding-left: 24px;
  font-size: 13px;
  line-height: 1.8;
}
.publish-layout aside label {
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
}
.publish-layout .el-radio {
  display: block;
  margin: 0 0 18px;
}
.publish-note {
  background: var(--writer-warning-bg);
  padding: 12px;
  border-radius: 4px;
  color: var(--writer-warning);
}
.publish-checks {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}
.correction-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--writer-border);
}
.correction-item p {
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 1.8;
}
.original-text {
  color: var(--writer-danger);
  background: var(--writer-danger-bg);
  padding: 8px 12px;
  border-radius: 4px;
}
.corrected-text {
  color: var(--writer-success);
  background: var(--writer-success-bg);
  padding: 8px 12px;
  border-radius: 4px;
}
</style>
