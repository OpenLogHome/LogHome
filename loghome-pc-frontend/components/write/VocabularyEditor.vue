<template>
  <div class="vocabulary-editor">
    <label
      >词条名称<input
        :value="title"
        :disabled="disabled"
        maxlength="100"
        @input="$emit('title', $event.target.value)"
    /></label>
    <label
      >简介<textarea
        v-model="model.desc"
        :disabled="disabled"
        rows="7"
        maxlength="50000"
        @input="changed"
      />
    </label>
    <label
      >图片地址<input
        v-model="model.pic"
        :disabled="disabled"
        placeholder="https://…"
        @input="changed"
    /></label>
    <button :disabled="disabled || uploading" @click="$refs.picture.click()">
      {{ uploading ? "正在上传…" : "上传词条图片" }}</button
    ><input
      ref="picture"
      type="file"
      accept="image/*"
      hidden
      @change="uploadPicture"
    />
    <img
      v-if="model.pic"
      :src="model.pic"
      alt="词条图片"
      class="vocabulary-picture"
    />
    <h3>
      属性 <button :disabled="disabled" @click="addAttribute">＋ 添加</button>
    </h3>
    <div
      v-for="(item, index) in model.attributes"
      :key="item.id"
      class="vocabulary-row"
    >
      <input
        v-model="item.name"
        aria-label="属性名称"
        :disabled="disabled"
        placeholder="属性名称"
        @input="changed"
      /><input
        v-model="item.content"
        aria-label="属性内容"
        :disabled="disabled"
        placeholder="属性内容"
        @input="changed"
      /><button
        :disabled="disabled"
        aria-label="删除属性"
        @click="
          model.attributes.splice(index, 1);
          changed();
        "
      >
        ×
      </button>
    </div>
    <h3>
      关系 <button :disabled="disabled" @click="addRelation">＋ 添加</button>
    </h3>
    <div
      v-for="(item, index) in model.relations"
      :key="index"
      class="vocabulary-row"
    >
      <select
        v-model="item.id"
        aria-label="关联词条"
        :disabled="disabled"
        @change="relationChanged(item)"
      >
        <option :value="null">选择词条</option>
        <option
          v-for="entry in entries"
          :key="entry.article_id"
          :value="entry.article_id"
        >
          {{ entry.title }}
        </option></select
      ><input
        v-model="item.relation"
        aria-label="词条关系"
        :disabled="disabled"
        placeholder="例如：盟友"
        @input="changed"
      /><button
        :disabled="disabled"
        aria-label="删除关系"
        @click="
          model.relations.splice(index, 1);
          changed();
        "
      >
        ×
      </button>
    </div>
    <section v-if="reverseRelations.length">
      <h3>反向关系建议</h3>
      <p v-for="item in reverseRelations" :key="item.article_id">
        {{ item.title }} 已将本词条关联为“{{ item.relation }}”<button
          :disabled="disabled"
          @click="addReverse(item)"
        >
          补充关系
        </button>
      </p>
    </section>
    <details>
      <summary>JSON 源码</summary>
      <textarea
        :value="value"
        :disabled="disabled"
        rows="12"
        aria-label="词条 JSON"
        @change="setJson($event.target.value)"
      />
    </details>
  </div>
</template>
<script>
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import { writerGet, writerRequest } from "~/utils/writer/api";
export default {
  mixins: [writerDialogTheme],
  props: {
    theme: String,
    value: String,
    title: String,
    disabled: Boolean,
    entries: Array,
    articleId: Number,
  },
  data: () => ({
    uploading: false,
    reverseCandidates: [],
    model: { desc: "", attributes: [], relations: [] },
  }),
  computed: {
    reverseRelations() {
      return this.reverseCandidates.filter(
        (item) =>
          !this.model.relations.some(
            (relation) => Number(relation.id) === Number(item.article_id)
          )
      );
    },
  },
  mounted() {
    this.loadReverseRelations();
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        try {
          const model = JSON.parse(value || "{}");
          if (!model || Array.isArray(model) || typeof model !== "object")
            throw new Error();
          this.model = {
            ...model,
            attributes: model.attributes || [],
            relations: model.relations || [],
          };
        } catch (_) {
          this.$emit("error", "词条格式无效，不能保存。请检查源数据。");
        }
      },
    },
  },
  methods: {
    async uploadPicture(event) {
      const file = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      this.uploading = true;
      try {
        const result = await writerRequest(
          "/essays/upload_manga_page?article_type=mangaPage",
          { method: "POST", body: file }
        );
        if (!result.url) throw new Error("服务未返回有效图片");
        this.$set(this.model, "pic", result.url);
        this.changed();
      } catch (error) {
        this.writerMessage("error", error.message);
      } finally {
        this.uploading = false;
      }
    },
    async loadReverseRelations() {
      const candidates = [];
      for (let i = 0; i < this.entries.length; i += 10) {
        const batch = await Promise.all(
          this.entries
            .slice(i, i + 10)
            .filter((item) => item.article_id !== this.articleId)
            .map(async (item) => {
              try {
                const article = await writerGet("get_article", {
                    id: item.article_id,
                  }),
                  content = JSON.parse(article.content),
                  relation = (content.relations || []).find(
                    (relation) => Number(relation.id) === this.articleId
                  );
                return relation
                  ? { ...item, relation: relation.relation }
                  : null;
              } catch (_) {
                return null;
              }
            })
        );
        if (this._isDestroyed) return;
        candidates.push(...batch.filter(Boolean));
      }
      this.reverseCandidates = candidates;
    },
    addReverse(item) {
      this.model.relations.push({
        id: item.article_id,
        name: item.title,
        relation: "",
      });
      this.changed();
    },
    changed() {
      this.$emit("input", JSON.stringify(this.model));
    },
    addAttribute() {
      this.model.attributes.push({
        id:
          Math.max(
            0,
            ...this.model.attributes.map((item) => Number(item.id) || 0)
          ) + 1,
        name: "",
        content: "",
      });
      this.changed();
    },
    addRelation() {
      this.model.relations.push({ id: null, name: "", relation: "" });
      this.changed();
    },
    relationChanged(item) {
      const entry = this.entries.find((entry) => entry.article_id === item.id);
      item.name = entry ? entry.title : "";
      this.changed();
    },
    setJson(value) {
      try {
        const item = JSON.parse(value);
        if (
          !item ||
          typeof item !== "object" ||
          Array.isArray(item) ||
          !Array.isArray(item.attributes) ||
          !Array.isArray(item.relations)
        )
          throw new Error();
        this.$emit("input", value);
      } catch (_) {
        this.writerMessage("error", "JSON 格式或属性、关系结构不正确");
      }
    },
  },
};
</script>
<style scoped>
.vocabulary-picture {
  display: block;
  max-width: 240px;
  max-height: 240px;
  margin: 16px 0;
  object-fit: contain;
}
.vocabulary-editor {
  overflow: auto;
  padding: 48px;
  max-width: 980px;
  width: 100%;
  margin: auto;
}
.vocabulary-editor label {
  display: grid;
  gap: 8px;
  margin: 0 0 20px;
  font-size: 13px;
}
.vocabulary-editor h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  padding-top: 20px;
  border-top: 1px solid var(--writer-border);
}
.vocabulary-row {
  display: grid;
  grid-template-columns: 1fr 1fr 32px;
  gap: 8px;
  margin: 8px 0;
}
.vocabulary-editor textarea {
  width: 100%;
}
.vocabulary-editor details {
  margin-top: 28px;
}
.vocabulary-editor summary {
  color: var(--writer-muted);
  cursor: pointer;
  padding: 8px 0;
}
@media (max-width: 1100px) {
  .vocabulary-editor {
    padding: 32px;
  }
}
</style>
