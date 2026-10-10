<template>
  <section class="reader-pager" :class="{ 'is-paged': paged }" :data-paragraph-anchor="position.paragraphId" :data-char-offset="position.charOffset" :data-page-index="index">
    <div ref="viewport" class="reader-viewport" tabindex="0" role="region" aria-label="章节正文" :style="viewportStyle" @touchstart.passive="touchStart" @touchend="touchEnd">
      <div ref="prose" class="article-content reader-prose" :style="proseStyle">
        <ReaderContent :article="article" :highlights="highlights" :counts="counts" :speaking-id="speakingId" @paragraph-menu="$emit('paragraph-menu', $event)" @comment="$emit('comment', $event)" @layout="scheduleLayout" />
      </div>
    </div>
    <nav v-if="paged" class="page-navigation" aria-label="正文翻页">
      <button :disabled="index <= 0 && !hasPrevious" @click="turn(-1)">← 上一页</button>
      <div class="page-progress"><span aria-live="polite">{{ index + 1 }} / {{ total }} 页</span><input aria-label="本章阅读进度" type="range" min="0" :max="total - 1" :value="index" @change="goPage(Number($event.target.value))"></div>
      <button :disabled="index >= total - 1 && !hasNext && !canFinish" @click="turn(1)">{{ index >= total - 1 && !hasNext && canFinish ? '已读至最后 →' : '下一页 →' }}</button>
    </nav>
    <p v-if="paged" class="page-hint">左右方向键 / Page Up、Page Down 翻页 · 共 {{ chapterPercent }}% 书籍进度</p>
  </section>
</template>
<script>
import ReaderContent from './ReaderContent.vue'
import { normalizeReaderPosition, pageCount, pageAtCoordinate } from '~/utils/reader-position'
export default {
  components: { ReaderContent },
  props: { article: { type: Object, required: true }, typography: { type: Object, required: true }, paged: Boolean, highlights: { type: Array, default: () => [] }, counts: { type: Object, default: () => ({}) }, speakingId: [String,Number], initialPosition: { type: Object, default: () => ({}) }, hasPrevious: Boolean, hasNext: Boolean, canFinish: Boolean, chapterPercent: [String,Number], navigationBlocked: Boolean },
  data() { return { index: 0, total: 1, height: 450, width: 860, gap: 40, position: normalizeReaderPosition(this.initialPosition), pendingPosition: null, generation: 0, mountedReady: false, layingOut: false } },
  computed: {
    viewportStyle() { return { maxWidth: this.typography.maxWidth, height: this.paged ? `${this.height}px` : 'auto', '--reader-page-height': `${this.height}px` } },
    proseStyle() {
      const { maxWidth, ...style } = this.typography
      return this.paged ? { ...style, height: `${this.height}px`, width: `${this.width}px`, columnWidth: `${this.width}px`, columnGap: `${this.gap}px`, transform: `translate3d(${-this.index * (this.width + this.gap)}px,0,0)` } : style
    }
  },
  mounted() {
    this.mountedReady = true; this.scheduleLayout(this.initialPosition)
    window.addEventListener('resize', this.onResize); window.addEventListener('scroll', this.onScroll, { passive: true }); window.addEventListener('keydown', this.onKey)
    if (document.fonts) document.fonts.addEventListener('loadingdone', this.onResize)
  },
  watch: {
    paged(value) {
      this.layingOut = true
      this.$nextTick(() => {
        // A scroll-mode paragraph may be far down the document. Bring the page
        // viewport back below the sticky toolbar before measuring its height.
        if (value && this.$refs.viewport.getBoundingClientRect().top < this.readingTop()) this.alignViewport()
        this.scheduleLayout()
      })
    },
    typography: { deep: true, handler() { this.scheduleLayout() } },
    counts: { deep: true, handler() { this.scheduleLayout() } },
    initialPosition: { deep: true, handler(value) { this.scheduleLayout(value) } },
    'article.article_id'() { this.index = 0; this.position = normalizeReaderPosition(this.initialPosition); this.scheduleLayout(this.initialPosition) }
  },
  beforeDestroy() {
    this.generation++; cancelAnimationFrame(this.layoutFrame); cancelAnimationFrame(this.scrollFrame)
    window.removeEventListener('resize', this.onResize); window.removeEventListener('scroll', this.onScroll); window.removeEventListener('keydown', this.onKey)
    if (document.fonts) document.fonts.removeEventListener('loadingdone', this.onResize)
  },
  methods: {
    onResize() { this.scheduleLayout() },
    scheduleLayout(wanted) {
      if (!this.mountedReady) return
      const position = wanted && typeof wanted === 'object' && !wanted.type ? normalizeReaderPosition(wanted) : { ...(this.pendingPosition || this.position) }
      // Font/height/count changes in the same hydration tick must not overwrite
      // an incoming resume anchor or the previous chapter's end-page request.
      this.pendingPosition = position
      this.layingOut = true
      const generation = ++this.generation
      cancelAnimationFrame(this.layoutFrame)
      this.$nextTick(() => {
        if (generation !== this.generation) return
        const viewport = this.$refs.viewport
        if (!viewport) return
        this.width = viewport.clientWidth
        const line = parseFloat(this.typography.fontSize) * Number(this.typography.lineHeight)
        const usable = Math.max(240, window.innerHeight - Math.max(100, viewport.getBoundingClientRect().top) - 100)
        this.height = Math.floor(Math.min(1000, usable) / line) * line
        this.$nextTick(() => {
          if (generation !== this.generation) return
          this.layoutFrame = requestAnimationFrame(() => {
            if (generation !== this.generation || !this.$refs.prose) return
            this.total = this.paged ? pageCount(this.$refs.prose.scrollWidth, this.width, this.gap) : 1
            this.restore(position)
          })
        })
      })
    },
    paragraph(id) { return this.$refs.prose && this.$refs.prose.querySelector(`[data-paragraph-id="${Number(id)}"]`) },
    characterPage(element, offset) {
      const text = element.querySelector('.paragraph-text')
      if (!text || !text.firstChild || !text.textContent.length) return this.elementPage(element)
      const start = Math.max(0, Math.min(text.textContent.length - 1, Number(offset) || 0))
      const range = document.createRange(); range.setStart(text.firstChild, start); range.setEnd(text.firstChild, start + 1)
      const rect = range.getBoundingClientRect()
      return pageAtCoordinate(rect.left, this.$refs.viewport.getBoundingClientRect().left, this.index, this.width, this.gap)
    },
    elementPage(element) {
      const rect = element.getClientRects()[0] || element.getBoundingClientRect()
      return pageAtCoordinate(rect.left, this.$refs.viewport.getBoundingClientRect().left, this.index, this.width, this.gap)
    },
    restore(position) {
      const generation = this.generation
      const normalized = normalizeReaderPosition(position), element = normalized.paragraphId ? this.paragraph(normalized.paragraphId) : null
      if (this.paged) {
        this.index = Math.max(0, Math.min(this.total - 1, element ? this.characterPage(element, normalized.charOffset) : normalized.pageIndex))
        this.$refs.viewport.scrollLeft = 0
        this.$nextTick(() => { if (generation !== this.generation) return; this.finishRestore(normalized, element) })
      } else {
        this.index = 0; this.total = 1
        this.$nextTick(() => {
          if (generation !== this.generation) return
          if (element) this.scrollToCharacter(element, normalized.charOffset)
          this.finishRestore(normalized, element)
        })
      }
    },
    finishRestore(position, element) {
      this.pendingPosition = null; this.layingOut = false
      if (!element) return this.capture()
      // Preserve the requested text anchor even when the containing page starts
      // earlier, so repeated width/font changes cannot drift backwards.
      const length = element.querySelector('.paragraph-text')?.textContent.length || 0
      this.position = { ...position, charOffset: Math.min(position.charOffset, Math.max(0, length - 1)), pageIndex: this.index }
      this.$emit('position', this.position)
    },
    scrollToCharacter(element, offset) {
      const text = element.querySelector('.paragraph-text')
      if (text && text.firstChild && text.textContent.length) {
        const start = Math.min(text.textContent.length - 1, Math.max(0, Number(offset) || 0)), range = document.createRange()
        range.setStart(text.firstChild,start); range.setEnd(text.firstChild,start + 1)
        window.scrollBy({ top: range.getBoundingClientRect().top - this.readingTop(), behavior: 'auto' })
      } else element.scrollIntoView({ block: 'start' })
    },
    readingTop() { return Math.max(110, (document.querySelector('.article-header')?.getBoundingClientRect().bottom || 100) + 15) },
    alignViewport() {
      const viewport = this.$refs.viewport
      if (viewport) window.scrollBy({ top: viewport.getBoundingClientRect().top - this.readingTop(), behavior: 'auto' })
    },
    capture() {
      if (!this.$refs.prose) return this.position
      const paragraphs = [...this.$refs.prose.querySelectorAll('[data-paragraph-id]')]
      const element = this.paged ? paragraphs.find(paragraph => {
        const text = paragraph.querySelector('.paragraph-text'), length = text && text.textContent.trimEnd().length
        return length && this.characterPage(paragraph, 0) <= this.index && this.characterPage(paragraph, length - 1) >= this.index
      }) : paragraphs.find(paragraph => paragraph.getBoundingClientRect().bottom > this.readingTop())
      if (!element) { this.position = { paragraphId: 0, charOffset: 0, pageIndex: this.index }; this.$emit('position', this.position); return this.position }
      const text = element.querySelector('.paragraph-text')
      let low = 0, high = text ? text.textContent.length : 0
      if (text && text.firstChild) {
        while (low < high) {
          const middle = Math.floor((low + high) / 2), range = document.createRange()
          range.setStart(text.firstChild,middle); range.setEnd(text.firstChild,Math.min(middle + 1,text.textContent.length))
          const rect = range.getBoundingClientRect()
          const before = this.paged ? this.characterPage(element,middle) < this.index : rect.bottom <= this.readingTop()
          if (before) low = middle + 1; else high = middle
        }
      }
      this.position = { paragraphId: Number(element.dataset.paragraphId), charOffset: low, pageIndex: this.index }
      this.$emit('position', this.position); return this.position
    },
    goPage(index) {
      this.index = Math.max(0, Math.min(this.total - 1, Number(index) || 0))
      this.$nextTick(() => { this.$refs.viewport.scrollLeft = 0; this.capture() })
    },
    turn(delta) {
      if (this.navigationBlocked) return
      const next = this.index + delta
      if (next < 0) { if (this.hasPrevious) this.$emit('boundary', 'prev'); return }
      if (next >= this.total) { if (this.hasNext) this.$emit('boundary', 'next'); else if (this.canFinish) this.$emit('finish'); return }
      this.goPage(next)
    },
    jump(id, offset = 0) { if (this.paged) this.alignViewport(); this.scheduleLayout({ paragraphId: Number(id), charOffset: offset }) },
    onScroll() { if (this.paged || this.layingOut) return; cancelAnimationFrame(this.scrollFrame); this.scrollFrame = requestAnimationFrame(() => this.capture()) },
    onKey(event) {
      if (!this.paged || this.navigationBlocked || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return
      if (event.target.closest('input,textarea,select,button,[contenteditable="true"],[role="dialog"]') || window.getSelection()?.toString()) return
      if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); this.turn(-1) }
      else if (['ArrowRight','PageDown',' '].includes(event.key)) { event.preventDefault(); this.turn(1) }
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); this.goPage(event.key === 'Home' ? 0 : this.total - 1) }
    },
    touchStart(event) { if (event.touches.length === 1) this.touchOrigin = { x: event.touches[0].clientX, y: event.touches[0].clientY } },
    touchEnd(event) {
      const origin = this.touchOrigin; this.touchOrigin = null
      if (!this.paged || !origin || event.changedTouches.length !== 1 || window.getSelection()?.toString()) return
      const delta = event.changedTouches[0].clientX - origin.x
      if (Math.abs(delta) > 50 && Math.abs(event.changedTouches[0].clientY - origin.y) < 50) this.turn(delta > 0 ? -1 : 1)
    }
  }
}
</script>
<style scoped>
.reader-viewport { width: calc(100% - 80px); margin: 0 auto; }.reader-prose { padding: 28px 0 45px !important; margin: 0 auto; overflow-wrap: anywhere; }.is-paged .reader-viewport { overflow: hidden; }.is-paged .reader-prose { padding: 0 !important; margin: 0; column-fill: auto; will-change: transform; }.reader-prose /deep/ .article-paragraph { orphans: 2; widows: 2; }.is-paged .reader-prose /deep/ .vocabulary-image { max-height: calc(var(--reader-page-height) * .5); }.is-paged .reader-prose /deep/ .article-image { margin: 0 0 12px !important; break-inside: avoid; display: flex; justify-content: center; }
.is-paged .reader-prose /deep/ .article-image img { max-height: calc(var(--reader-page-height) - 50px); max-width: 100% !important; object-fit: contain; display: block; margin: 0; }.page-navigation { display: flex; align-items: center; justify-content: center; gap: 24px; padding: 22px 20px 8px; }button { border: 1px solid #a7947b; border-radius: 5px; background: transparent; color: inherit; padding: 9px 18px; cursor: pointer; white-space: nowrap; }button:disabled { opacity: .4; cursor: default; }.page-progress { display: flex; gap: 10px; align-items: center; font-size: 12px; }.page-progress input { width: 160px; accent-color: #947358; }.page-hint { font-size: 11px; color: var(--reader-secondary); text-align: center; margin: 8px 15px 0; padding-bottom: 20px; }button:focus-visible,input:focus-visible { outline: 2px solid var(--reader-line); outline-offset: 2px; }@media(max-width:700px) { .reader-viewport { width: calc(100% - 40px); }.page-navigation { gap: 8px; padding: 16px 10px 8px; }.page-progress { flex-direction: column; gap: 5px; }.page-progress input { width: 100px; }button { padding: 8px; } }
</style>
