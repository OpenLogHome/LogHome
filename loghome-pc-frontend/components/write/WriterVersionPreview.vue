<template>
  <section class="version-preview" :aria-label="label + '内容'">
    <header class="version-preview-heading">
      <h4>{{ article.title || "未命名章节" }}</h4>
      <div class="version-preview-meta" v-if="!preview.error">
        <span>{{ preview.textCount.toLocaleString("zh-CN") }} 字</span>
        <span v-if="preview.imageCount">{{ preview.imageCount }} 张图片</span>
        <span v-if="savedTime">{{ savedTime }}</span>
      </div>
    </header>
    <div class="version-preview-body" tabindex="0" :aria-label="label + '正文'">
      <p v-if="preview.error" class="version-preview-message" role="status">
        {{ preview.error }}
      </p>
      <template v-else>
        <template v-for="(block, index) in preview.blocks">
          <p
            v-if="block.type === 'text'"
            :key="'text-' + index"
            class="version-paragraph"
            v-text="block.value"
          />
          <figure v-else :key="'image-' + index" class="version-image">
            <img
              v-if="safeImage(block.img) && !failedImages[block.img]"
              :src="safeImage(block.img)"
              :alt="'稿件插图 ' + (index + 1)"
              loading="lazy"
              @error="$set(failedImages, block.img, true)"
            />
            <figcaption v-else>图片暂时无法显示</figcaption>
          </figure>
        </template>
        <template v-if="preview.vocabulary">
          <dl
            v-if="
              preview.vocabulary.attributes &&
              preview.vocabulary.attributes.length
            "
            class="version-attributes"
          >
            <template
              v-for="(attribute, index) in preview.vocabulary.attributes"
            >
              <dt :key="'name-' + index">{{ attribute.name || "属性" }}</dt>
              <dd :key="'value-' + index" v-text="attribute.content" />
            </template>
          </dl>
          <div
            v-if="
              preview.vocabulary.relations &&
              preview.vocabulary.relations.length
            "
            class="version-relations"
          >
            <h5>关联词条</h5>
            <p
              v-for="(relation, index) in preview.vocabulary.relations"
              :key="index"
            >
              {{ relation.name || "词条 " + relation.id
              }}<span>{{ relation.relation }}</span>
            </p>
          </div>
        </template>
        <p v-if="empty" class="version-preview-message">
          这个版本还没有正文内容
        </p>
      </template>
    </div>
  </section>
</template>
<script>
import {
  writerVersionPreview,
  versionImageSource,
} from "~/utils/writer/version-preview";
export default {
  props: {
    article: { type: Object, default: () => ({}) },
    label: { type: String, default: "稿件" },
  },
  data: () => ({ failedImages: {} }),
  computed: {
    preview() {
      return writerVersionPreview(this.article);
    },
    empty() {
      const vocabulary = this.preview.vocabulary || {};
      return (
        !this.preview.textCount &&
        !this.preview.imageCount &&
        !(vocabulary.attributes || []).length &&
        !(vocabulary.relations || []).length
      );
    },
    savedTime() {
      const value =
        this.article.updatedAt ||
        this.article.updated_at ||
        this.article.create_time;
      if (!value) return "";
      if (/^\d{14}$/.test(String(value))) {
        const s = String(value);
        return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)} ${s.slice(
          8,
          10
        )}:${s.slice(10, 12)}`;
      }
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? ""
        : date.toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
    },
  },
  watch: {
    article() {
      this.failedImages = {};
    },
  },
  methods: { safeImage: versionImageSource },
};
</script>
<style scoped>
.version-preview {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--writer-border);
  border-radius: 4px;
  overflow: hidden;
  background: var(--writer-panel);
}
.version-preview-heading {
  flex: none;
  padding: 16px 18px;
  border-bottom: 1px solid var(--writer-border);
  background: var(--writer-sidebar);
}
.version-preview-heading h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.version-preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--writer-muted);
  font-variant-numeric: tabular-nums;
}
.version-preview-body {
  flex: 1;
  min-height: 0;
  height: min(48vh, 420px);
  overflow: auto;
  overscroll-behavior: contain;
  padding: 20px 18px;
  scrollbar-width: thin;
  scrollbar-color: var(--writer-active) transparent;
}
.version-preview-body:focus-visible {
  outline: 2px solid var(--writer-focus);
  outline-offset: -2px;
}
.version-paragraph {
  margin: 0 0 14px;
  min-height: 1.9em;
  font: 14px/1.95 var(--writer-ui-font);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.version-paragraph:last-child {
  margin-bottom: 0;
}
.version-image {
  margin: 18px 0;
}
.version-image img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: 3px;
}
.version-image figcaption,
.version-preview-message {
  color: var(--writer-muted);
  font-size: 13px;
  line-height: 1.8;
}
.version-attributes {
  display: grid;
  grid-template-columns: minmax(60px, 1fr) minmax(0, 2fr);
  gap: 12px;
  border-top: 1px solid var(--writer-border);
  margin: 20px 0 0;
  padding-top: 16px;
  font-size: 13px;
}
.version-attributes dt {
  font-weight: 500;
}
.version-attributes dd {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.version-relations {
  border-top: 1px solid var(--writer-border);
  margin-top: 20px;
  padding-top: 16px;
}
.version-relations h5 {
  font-size: 13px;
  margin: 0 0 12px;
}
.version-relations p {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 8px 0;
}
.version-relations span {
  color: var(--writer-muted);
}
</style>
