<template>
  <section class="manga-writer">
    <header>
      <div>
        <input
          v-model="title"
          aria-label="话数标题"
          maxlength="100"
          :disabled="disabled"
        /><small
          >{{ dirty ? "本机草稿已保存" : "已同步" }} ·
          {{ pages.length }} 页</small
        >
      </div>
      <select
        v-model="type"
        aria-label="漫画类型"
        :disabled="disabled || uploading"
      >
        <option value="mangaStrip">条漫 · 纵向滚动</option>
        <option value="mangaPage">页漫 · 翻页阅读</option></select
      ><button :disabled="!pages.length" @click="previewOpen = true">
        整话预览
      </button>
    </header>
    <p v-if="error" class="manga-error" role="alert">
      {{ error }}<button @click="exportDraft">导出本机稿件</button
      ><button v-if="conflict" @click="reload">重新加载云端</button>
    </p>
    <div class="manga-upload-toolbar">
      <button
        class="primary"
        :disabled="disabled"
        @click="
          replaceId = null;
          $refs.files.click();
        "
      >
        ＋ 添加页面</button
      ><span>按文件名排序上传，条漫长图自动分段</span
      ><button v-if="uploading" @click="cancelAll">取消未完成上传</button
      ><input
        ref="files"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        hidden
        @change="enqueue"
      />
    </div>
    <div v-if="queue.length" class="manga-queue">
      <article v-for="task in queue" :key="task.id">
        <span>{{ task.file.name }}</span
        ><small>{{
          task.status === "success"
            ? "上传完成"
            : task.status === "error"
            ? task.error
            : task.status === "cancelled"
            ? "已取消"
            : task.status === "uploading"
            ? "上传并生成阅读图…"
            : "等待上传"
        }}</small
        ><button v-if="task.status === 'error'" @click="retry(task)">
          重试</button
        ><button
          v-if="task.status === 'queued' || task.status === 'uploading'"
          @click="cancel(task)"
        >
          取消
        </button>
      </article>
    </div>
    <div class="manga-page-grid">
      <article
        v-for="(page, index) in pages"
        :key="page.id"
        draggable="true"
        @dragstart="dragIndex = index"
        @dragover.prevent
        @drop.prevent="move(dragIndex, index)"
      >
        <button
          class="manga-page-image"
          :aria-label="'预览第 ' + (index + 1) + ' 页'"
          @click="
            previewIndex = index;
            previewOpen = true;
          "
        >
          <img
            :src="page.thumb || page.url"
            :alt="'第 ' + (index + 1) + ' 页'"
          />
        </button>
        <footer>
          <strong>{{ index + 1 }}</strong
          ><button :disabled="disabled" @click="replacePage(page)">替换</button
          ><button
            :disabled="disabled || index === 0"
            aria-label="前移"
            @click="move(index, index - 1)"
          >
            ↑</button
          ><button
            :disabled="disabled || index === pages.length - 1"
            aria-label="后移"
            @click="move(index, index + 1)"
          >
            ↓</button
          ><button
            :disabled="disabled"
            aria-label="移除页面"
            @click="remove(index)"
          >
            ×
          </button>
        </footer>
      </article>
      <button
        class="manga-add-card"
        :disabled="disabled"
        @click="
          replaceId = null;
          $refs.files.click();
        "
      >
        <i aria-hidden="true" class="el-icon-plus" />添加页面
      </button>
    </div>
    <footer class="manga-writer-footer">
      <span>发布前至少需要一页；保存草稿会撤回已发布话数。</span
      ><button :disabled="disabled || uploading" @click="save(true)">
        保存草稿</button
      ><button
        class="primary"
        :disabled="disabled || uploading || !pages.length"
        @click="save(false)"
      >
        保存并发布
      </button>
    </footer>
    <el-dialog
      class="writer-dialog-wrapper"
      title="漫画预览"
      :visible.sync="previewOpen"
      width="88vw"
      top="4vh"
      :custom-class="writerDialogClass"
      append-to-body
      ><MangaDraftPreview
        v-if="previewOpen"
        :article="{ title, article_type: type, content: { pages } }"
        :novel-name="novel ? novel.name : '漫画'"
        :initial-page="previewIndex"
        @close="previewOpen = false"
    /></el-dialog>
  </section>
</template>
<script>
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import MangaDraftPreview from "~/components/manga/MangaDraftPreview.vue";
import {
  writerGet,
  writerPost,
  writerRequest,
  writerIdentity,
  downloadWriterFile,
} from "~/utils/writer/api";
import {
  persistWriterDraft,
  readWriterDraft,
  writerSignature,
} from "~/utils/writer/drafts";
export default {
  mixins: [writerDialogTheme],
  components: { MangaDraftPreview },
  props: { article: Object, novel: Object, access: Object, theme: String },
  data: () => ({
    title: "",
    type: "mangaStrip",
    pages: [],
    baseline: "",
    revision: "",
    saving: false,
    ready: false,
    queue: [],
    uploading: false,
    error: "",
    conflict: false,
    dragIndex: 0,
    replaceId: null,
    previewOpen: false,
    previewIndex: 0,
  }),
  computed: {
    snapshot() {
      return JSON.stringify({
        title: this.title,
        type: this.type,
        pages: this.pages,
      });
    },
    dirty() {
      return this.ready && this.snapshot !== this.baseline;
    },
    disabled() {
      return (
        !this.ready ||
        this.saving ||
        this.conflict ||
        !this.access.can_edit_draft ||
        !this.access.can_publish_article
      );
    },
  },
  watch: {
    snapshot() {
      if (this.ready) this.persist();
    },
  },
  async mounted() {
    this.initialize(this.article);
    const local = await readWriterDraft(
      writerIdentity().id,
      this.article.article_id
    );
    if (local && writerSignature(local) !== writerSignature(this.draft())) {
      try {
        await this.writerConfirm(
          "本机有不同的漫画草稿，是否恢复到编辑区？",
          "恢复本机草稿",
          {
            confirmButtonText: "恢复本机稿件",
            cancelButtonText: "使用云端版本",
          }
        );
        const parsed = JSON.parse(local.content);
        this.title = local.title;
        this.type = local.article_type;
        this.pages = parsed.pages;
        this.persist();
      } catch (_) {}
    }
    window.addEventListener("beforeunload", this.beforeUnload);
  },
  beforeDestroy() {
    this.cancelAll();
    window.removeEventListener("beforeunload", this.beforeUnload);
  },
  methods: {
    initialize(article) {
      try {
        const content =
          typeof article.content === "string"
            ? JSON.parse(article.content)
            : article.content;
        if (
          !article.manga_revision ||
          !content ||
          !Array.isArray(content.pages)
        )
          throw new Error("漫画数据无效，请重新加载");
        this.title = article.title;
        this.type = article.article_type;
        this.pages = content.pages.map((page, index) => ({
          ...page,
          id: page.id || `page-${Date.now()}-${index}`,
        }));
        this.revision = article.manga_revision;
        this.baseline = this.snapshot;
        this.ready = true;
        this.conflict = false;
      } catch (error) {
        this.error = error.message;
        this.ready = false;
      }
    },
    draft() {
      return {
        ...this.article,
        title: this.title,
        content: JSON.stringify({ pages: this.pages }),
        article_type: this.type,
      };
    },
    persist() {
      return persistWriterDraft(
        writerIdentity().id,
        this.draft(),
        this.baseline
      ).catch((error) => {
        this.error = `本机备份失败：${error.message}`;
      });
    },
    enqueue(event) {
      const files = [...event.target.files].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );
      event.target.value = "";
      for (const file of files.slice(0, this.replaceId ? 1 : 100))
        this.queue.push({
          id: `${Date.now()}_${Math.random()}`,
          file,
          status: "queued",
          replaceId: this.replaceId,
          error: "",
          controller: null,
        });
      this.replaceId = null;
      this.drain();
    },
    async drain() {
      if (this.uploading) return;
      this.uploading = true;
      try {
        for (const task of this.queue) {
          if (task.status !== "queued") continue;
          task.status = "uploading";
          task.controller = new AbortController();
          try {
            const result = await writerRequest(
              `/essays/upload_manga_page?article_type=${this.type}`,
              {
                method: "POST",
                body: task.file,
                signal: task.controller.signal,
              }
            );
            if (task.status === "cancelled") continue;
            const incoming = result.pages || (result.url ? [result] : []);
            if (
              !incoming.length ||
              incoming.some((page) => !/^https?:\/\//.test(page.url || ""))
            )
              throw new Error("服务未返回有效图片");
            if (
              this.pages.length + incoming.length - (task.replaceId ? 1 : 0) >
              300
            )
              throw new Error("分段后超过单话 300 页上限");
            let id = Math.max(
              0,
              ...this.pages.map((page) => Number(page.id) || 0)
            );
            const pages = incoming.map((page) => ({ ...page, id: ++id }));
            if (task.replaceId) {
              const index = this.pages.findIndex(
                (p) => p.id === task.replaceId
              );
              if (index < 0) throw new Error("待替换页面已删除");
              pages[0].id = task.replaceId;
              this.pages.splice(index, 1, ...pages);
            } else {
              const following = this.queue
                .slice(this.queue.indexOf(task) + 1)
                .find(
                  (item) =>
                    !item.replaceId &&
                    item.pageIds &&
                    item.pageIds.some((id) =>
                      this.pages.some((page) => page.id === id)
                    )
                );
              const at = following
                ? this.pages.findIndex((page) =>
                    following.pageIds.includes(page.id)
                  )
                : -1;
              if (at >= 0) this.pages.splice(at, 0, ...pages);
              else this.pages.push(...pages);
            }
            task.pageIds = pages.map((page) => page.id);
            task.status = "success";
            await this.persist();
          } catch (error) {
            if (task.status !== "cancelled") {
              task.status = "error";
              task.error = error.message;
            }
          } finally {
            task.controller = null;
          }
        }
      } finally {
        this.uploading = false;
      }
    },
    cancel(task) {
      if (task.status === "success") return;
      task.status = "cancelled";
      if (task.controller) task.controller.abort();
    },
    cancelAll() {
      this.queue.forEach((task) => this.cancel(task));
    },
    retry(task) {
      task.status = "queued";
      task.error = "";
      this.drain();
    },
    replacePage(page) {
      this.replaceId = page.id;
      this.$refs.files.click();
    },
    move(from, to) {
      if (
        this.disabled ||
        this.uploading ||
        from === to ||
        to < 0 ||
        to >= this.pages.length
      )
        return;
      const page = this.pages.splice(from, 1)[0];
      if (page) this.pages.splice(to, 0, page);
    },
    async remove(index) {
      try {
        await this.writerConfirm(`移除第 ${index + 1} 页？`, "移除页面");
        this.pages.splice(index, 1);
      } catch (_) {}
    },
    async save(draft) {
      if (this.disabled || this.uploading) return;
      if (!this.title.trim()) {
        this.writerMessage("warning", "请输入话数标题");
        return;
      }
      if (draft && Number(this.article.is_draft) === 0) {
        try {
          await this.writerConfirm(
            "保存为草稿会撤下已发布话数。继续？",
            "退回草稿"
          );
        } catch (_) {
          return;
        }
      }
      this.saving = true;
      this.error = "";
      try {
        await this.persist();
        await writerPost("modify_article", {
          article_id: this.article.article_id,
          title: this.title.trim(),
          content: { pages: this.pages },
          article_type: this.type,
          is_draft: draft ? 1 : 0,
          expected_manga_revision: this.revision,
        });
        const remote = await writerGet("get_article", {
          id: this.article.article_id,
        });
        this.initialize(remote);
        await this.persist();
        this.writerMessage("success", draft ? "已保存草稿" : "已发布话数");
        this.$emit("refresh");
      } catch (error) {
        this.error = error.message;
        if (error.status === 409) this.conflict = true;
      } finally {
        this.saving = false;
      }
    },
    async reload() {
      try {
        await this.writerConfirm(
          "云端版本将替换编辑区。本机草稿请先导出。",
          "重新加载"
        );
        await this.persist();
        this.initialize(
          await writerGet("get_article", { id: this.article.article_id })
        );
        this.error = "";
      } catch (error) {
        if (error instanceof Error) this.error = error.message;
      }
    },
    exportDraft() {
      downloadWriterFile(
        `${this.title || "漫画"}-本机稿件.json`,
        JSON.stringify(this.draft(), null, 2)
      );
    },
    async canLeave() {
      if (this.saving) {
        this.writerMessage("warning", "正在保存，请稍候");
        return false;
      }
      await this.persist();
      if (this.uploading || this.dirty) {
        try {
          await this.writerConfirm(
            "本机漫画草稿已保留，离开将取消未完成上传。继续？",
            "保留漫画草稿"
          );
          this.cancelAll();
        } catch (_) {
          return false;
        }
      }
      return true;
    },
    beforeUnload(event) {
      if (this.dirty || this.uploading || this.saving) {
        event.preventDefault();
        event.returnValue = "";
      }
    },
  },
};
</script>
<style scoped>
.manga-writer {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 24px 32px;
  font-size: 13px;
}
.manga-writer > header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}
.manga-writer > header > div {
  flex: 1;
  display: grid;
  gap: 8px;
}
.manga-writer > header input {
  font-size: 28px !important;
  font-weight: 700;
  border: 0 !important;
  background: transparent !important;
  padding-left: 0 !important;
  width: 100%;
}
.manga-writer small {
  color: var(--writer-muted);
}
.manga-upload-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 11px;
  color: var(--writer-muted);
}
.manga-page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 18px;
  margin: 24px 0;
  flex: 1;
}
.manga-page-grid article {
  border: 1px solid var(--writer-border);
  background: var(--writer-panel);
  border-radius: 4px;
  overflow: hidden;
  align-self: start;
}
.manga-page-image {
  width: 100%;
  height: 220px;
  display: block;
  padding: 0 !important;
}
.manga-page-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.manga-page-grid article footer {
  display: flex;
  align-items: center;
  padding: 8px 5px;
}
.manga-page-grid strong {
  flex: 1;
  font-size: 12px;
  padding-left: 4px;
}
.manga-page-grid footer button {
  padding: 4px !important;
  font-size: 11px !important;
}
.manga-add-card {
  border: 1px dashed var(--writer-border) !important;
  height: 266px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 16px;
}
.manga-add-card i {
  font-size: 28px;
}
.manga-writer-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  bottom: -24px;
  background: var(--writer-panel);
  border-top: 1px solid var(--writer-border);
  padding: 16px 0;
}
.manga-writer-footer span {
  flex: 1;
  color: var(--writer-muted);
  font-size: 11px;
}
.manga-queue {
  margin-top: 16px;
  border: 1px solid var(--writer-border);
  padding: 8px 12px;
  border-radius: 4px;
}
.manga-queue article {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}
.manga-queue article span {
  flex: 1;
}
.manga-error {
  color: var(--writer-danger);
}
.manga-strip-preview {
  max-height: 78vh;
  overflow: auto;
  max-width: 800px;
  margin: auto;
}
.manga-strip-preview img {
  display: block;
  width: 100%;
  height: auto;
}
.manga-book-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.manga-book-preview img {
  max-height: 74vh;
  max-width: 75%;
  object-fit: contain;
}
</style>
