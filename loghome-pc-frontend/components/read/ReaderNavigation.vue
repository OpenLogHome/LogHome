<template>
  <el-drawer title="目录与进度" :visible="visible" @update:visible="$emit('update:visible', $event)" size="min(720px, 100%)" append-to-body>
    <div class="reader-navigation">
      <section class="chapter-seek"><h3>{{ current.title }}</h3><label>全书进度 <input aria-label="全书章节进度" type="range" min="0" :max="readable.length - 1" :value="target" @input="target = Number($event.target.value)" @change="$emit('jump', readable[target])"><output>{{ percentage }}%</output></label><p>第 {{ target + 1 }} / {{ readable.length }} 章 · {{ readable[target] && readable[target].title }}</p><button v-if="canUndo" @click="$emit('undo')">撤销上次章节跳转</button></section>
      <ChapterCatalog :chapters="chapters" :novel-id="novelId" :current-chapter="current.article_chapter" @navigate="$emit('catalog-navigate', $event)" />
    </div>
  </el-drawer>
</template>
<script>
import ChapterCatalog from './ChapterCatalog.vue'
export default {
  components: { ChapterCatalog },
  props: { visible: Boolean, chapters: { type: Array, required: true }, current: { type: Object, required: true }, novelId: [String,Number], canUndo: Boolean },
  data() { return { target: Math.max(0, this.chapters.filter(chapter => chapter.article_type !== 'spliter').findIndex(chapter => Number(chapter.article_id) === Number(this.current.article_id))) } },
  computed: { readable() { return this.chapters.filter(chapter => chapter.article_type !== 'spliter') }, percentage() { return this.readable.length ? ((this.target + 1) / this.readable.length * 100).toFixed(1) : '0' } }
}
</script>
<style scoped>
.reader-navigation { padding: 0 24px 28px; height: 100%; overflow-y: auto; }.chapter-seek { border: 1px solid #e3d9cd; background: #fbf8f2; border-radius: 8px; padding: 18px; margin-bottom: 24px; color: #705b45; }.chapter-seek h3 { font-size: 15px; margin-bottom: 14px; }.chapter-seek label { display: flex; align-items: center; gap: 12px; font-size: 13px; }.chapter-seek input { flex: 1; accent-color: #947358; min-width: 50px; }.chapter-seek p { font-size: 12px; margin: 14px 0 0; }button { background: #fff; color: #947358; border: 1px solid #d8cdbb; border-radius: 4px; padding: 7px 12px; margin-top: 14px; cursor: pointer; }button:focus-visible,input:focus-visible { outline: 2px solid #947358; }@media(max-width:700px) { .reader-navigation { padding: 0 14px 22px; } }
</style>
