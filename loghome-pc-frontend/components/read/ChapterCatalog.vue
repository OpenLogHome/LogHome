<template>
  <section class="chapter-catalog">
    <header><label>查找章节 <input v-model="keyword" type="search" placeholder="章节名或章节号"></label><div><button @click="reversed = !reversed">{{ reversed ? '倒序 ↓' : '正序 ↑' }}</button><button v-if="currentChapter" @click="locate">定位续读</button><span>{{ readable.length }} 章</span></div></header>
    <p v-if="!readable.length" class="empty">暂无已发布章节</p>
    <p v-else-if="!groups.length" class="empty">没有匹配的章节</p>
    <section v-for="group in groups" :key="group.key" class="volume">
      <button class="volume-title" :aria-expanded="!collapsed[group.key]" @click="$set(collapsed, group.key, !collapsed[group.key])">{{ collapsed[group.key] ? '▸' : '▾' }} {{ group.title }} <small>{{ group.chapters.length }} 章</small></button>
      <div v-show="!collapsed[group.key]" class="chapter-grid"><nuxt-link v-for="chapter in group.chapters" :key="chapter.article_id" :ref="String(chapter.article_chapter) === String(currentChapter) ? 'current' : undefined" :to="`/article/${chapter.article_id}?start=1`" @click.native="$emit('navigate', chapter)" :class="{ current: String(chapter.article_chapter) === String(currentChapter) }"><span class="chapter-label">{{ chapter.article_chapter }} · {{ chapter.title }}</span><span class="chapter-detail"><time>{{ dateText(chapter.update_time) }}</time><small v-if="amounts[chapter.article_id]">{{ amounts[chapter.article_id] }} 条评论</small><small v-if="String(chapter.article_chapter) === String(currentChapter)">续读</small></span></nuxt-link></div>
    </section>
  </section>
</template>
<script>
import { dateText } from '~/utils/reading-discovery'
import { fetchMangaArticleCommentAmounts } from '~/common/manga-comment-api'
export default {
  props: { chapters: { type: Array, default: () => [] }, currentChapter: { type: [String, Number], default: 0 }, novelId: { type: [String, Number], required: true } },
  data: () => ({ keyword: '', reversed: false, collapsed: {}, amounts: {}, version: 0 }),
  computed: {
    readable() { return this.chapters.filter(chapter => chapter.article_type !== 'spliter') },
    groups() {
      const groups = []; let group = { key: 'main', title: '正文', chapters: [] }
      for (const chapter of this.chapters) {
        if (chapter.article_type === 'spliter') { if (group.chapters.length) groups.push(group); group = { key: String(chapter.article_id), title: chapter.title, chapters: [] } }
        else group.chapters.push(chapter)
      }
      if (group.chapters.length) groups.push(group)
      const needle = this.keyword.trim().toLowerCase()
      const filtered = groups.map(item => ({ ...item, chapters: item.chapters.filter(chapter => !needle || String(chapter.title || '').toLowerCase().includes(needle) || String(chapter.article_chapter).includes(needle)) })).filter(item => item.chapters.length)
      return this.reversed ? filtered.reverse().map(item => ({ ...item, chapters: item.chapters.slice().reverse() })) : filtered
    }
  },
  mounted() { this.loadAmounts() }, watch: { novelId() { this.amounts = {}; this.loadAmounts() } }, beforeDestroy() { this.version++ },
  methods: {
    dateText,
    async loadAmounts() { const version = ++this.version; try { const amounts = await fetchMangaArticleCommentAmounts(process.env.baseUrl, this.novelId); if (version === this.version) this.amounts = amounts } catch (_) {} },
    locate() { this.keyword = ''; this.collapsed = {}; this.$nextTick(() => { const ref = this.$refs.current; const item = Array.isArray(ref) ? ref[0] : ref; if (item && item.$el) item.$el.scrollIntoView({ block: 'center', behavior: 'smooth' }) }) }
  }
}
</script>
<style scoped>
header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; font-size: 13px; color: var(--reading-muted, #73716a); flex-wrap: wrap; }
header label, header div { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
input { font: inherit; color: var(--reading-ink, #302f2a); background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); padding: 10px 12px; border-radius: 6px; width: 220px; max-width: 100%; }
button { font: inherit; border: 1px solid var(--reading-line, #e4e3de); padding: 9px 12px; border-radius: 6px; background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); cursor: pointer; }
.volume { margin-bottom: 28px; }
.volume-title { border: none; background: var(--reading-hover, #f5f4f0); width: 100%; text-align: left; margin-bottom: 10px; font-size: 14px; font-weight: 600; padding: 14px 16px; }
.volume-title small { float: right; font-size: 12px; color: var(--reading-muted, #73716a); font-weight: 400; }
.chapter-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px 24px; }
.chapter-grid a { min-width: 0; padding: 14px 16px; color: var(--reading-ink, #302f2a); text-decoration: none; border-radius: 6px; transition: background .18s ease; }
.chapter-grid a:hover { background: var(--reading-hover, #f5f4f0); }
.chapter-grid a.current { background: var(--reading-tint, #eee7de); color: var(--reading-accent, #79573c); }
.chapter-label { font-size: 14px; line-height: 1.7; overflow-wrap: anywhere; }
.chapter-detail { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 7px; font-size: 12px; color: var(--reading-muted, #73716a); font-variant-numeric: tabular-nums; }
.chapter-detail small { font-size: 11px; }
.empty { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px; }
button:focus-visible,a:focus-visible,input:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px; }
@media(max-width:700px) { .chapter-grid { grid-template-columns: 1fr; } }
@media(prefers-reduced-motion:reduce) { .chapter-grid a { transition: none; } }
</style>
