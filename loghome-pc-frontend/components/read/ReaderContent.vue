<template>
  <div class="reader-content">
    <section v-if="article.article_type === 'worldVocabulary'" class="vocabulary-card">
      <img v-if="safeImage(vocabulary.pic)" :src="safeImage(vocabulary.pic)" :alt="article.title" class="vocabulary-image" @click="preview(safeImage(vocabulary.pic))">
      <dl v-if="vocabulary.attributes && vocabulary.attributes.length"><template v-for="(attribute, index) in vocabulary.attributes"><dt :key="`name-${index}`">{{ attribute.name }}</dt><dd :key="`value-${index}`">{{ attribute.content }}</dd></template></dl>
    </section>
    <template v-for="(paragraph, index) in paragraphs">
      <p v-if="paragraph.type === 'text'" :key="`text-${index}`" :id="`paragraph-${paragraph.id}`" class="article-paragraph" :class="{ 'reader-highlight': highlights.some(item => Number(item.paragraph_id) === paragraph.id), 'reader-speaking': Number(speakingId) === paragraph.id }" :data-paragraph-id="paragraph.id" :data-paragraph-text="encodeURIComponent(paragraph.value)" @contextmenu.prevent="menu($event)" @touchstart.passive="touchStart($event)" @touchend="cancelTouch" @touchmove="cancelTouch" @touchcancel="cancelTouch"><span class="paragraph-text" v-text="paragraph.value"></span><button v-if="counts[paragraph.id]" class="paragraph-comment-icon" @click.stop="$emit('comment', paragraph.id)" :aria-label="`查看本段 ${counts[paragraph.id]} 条评论`">▤ {{ counts[paragraph.id] }}</button></p>
      <figure v-else-if="paragraph.type === 'image' && safeImage(paragraph.img || paragraph.value)" :key="`image-${index}`" class="article-image"><img :src="safeImage(paragraph.img || paragraph.value)" alt="文章插图" loading="lazy" @load="$emit('layout')" @error="$emit('layout')" @click="preview(safeImage(paragraph.img || paragraph.value))"></figure>
    </template>
    <section v-if="vocabulary.relations && vocabulary.relations.length" class="vocabulary-relations"><h3>关联词条</h3><nuxt-link v-for="(relation, index) in vocabulary.relations" :key="index" :to="`/article/${Number(relation.id)}`">{{ relation.name }} <small>{{ relation.relation }}</small> →</nuxt-link></section>
  </div>
</template>
<script>
import { readerParagraphs } from '~/utils/reader-paragraphs'
export default {
  props: { article: { type: Object, required: true }, highlights: { type: Array, default: () => [] }, counts: { type: Object, default: () => ({}) }, speakingId: { type: [Number, String], default: 0 } },
  computed: {
    paragraphs() { return readerParagraphs(this.article.content, this.article.article_type) },
    vocabulary() { if (this.article.article_type !== 'worldVocabulary') return {}; try { const content = typeof this.article.content === 'string' ? JSON.parse(this.article.content) : this.article.content; return content && typeof content === 'object' ? content : {} } catch (_) { return {} } }
  },
  beforeDestroy() { this.cancelTouch() },
  methods: {
    safeImage(value) { return typeof value === 'string' && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : '' },
    preview(src) { if (this.$preview) this.$preview([src], 0) },
    menu(event) { this.cancelTouch(); this.$emit('paragraph-menu', { event, element: event.currentTarget }) },
    touchStart(event) { this.cancelTouch(); const element = event.currentTarget; this.touchTimer = setTimeout(() => { this.$emit('paragraph-menu', { event: { clientX: element.getBoundingClientRect().left, clientY: element.getBoundingClientRect().top }, element }) }, 500) },
    cancelTouch() { clearTimeout(this.touchTimer) }
  }
}
</script>
<style scoped>
.reader-highlight { text-decoration: underline; text-decoration-color: #b19158; text-underline-offset: 5px; }.reader-speaking { background: #e5ecd7; border-radius: 3px; }.paragraph-comment-icon { border: none; background: none; color: #ae987c; font-size: 11px; cursor: pointer; margin-left: 10px; vertical-align: middle; }.vocabulary-card { margin: 20px 0; }.vocabulary-image { max-width: 100%; max-height: 420px; object-fit: contain; display: block; margin: 0 auto 24px; cursor: zoom-in; }dl { display: grid; grid-template-columns: minmax(70px, 160px) minmax(0,1fr); gap: 12px; border: 1px solid #dfd5c9; border-radius: 8px; padding: 20px; font-size: .8em; }dt { font-weight: 600; }dd { white-space: pre-wrap; overflow-wrap: anywhere; }.vocabulary-relations { border-top: 1px solid #dfd5c9; padding-top: 20px; }.vocabulary-relations h3 { font-size: .85em; margin-bottom: 14px; }.vocabulary-relations a { display: inline-flex; gap: 10px; margin: 5px; padding: 7px 12px; border: 1px solid #dfd5c9; border-radius: 6px; font-size: .8em; color: inherit; text-decoration: none; }.vocabulary-relations small { opacity: .65; }button:focus-visible,a:focus-visible { outline: 2px solid #947358; }
</style>
