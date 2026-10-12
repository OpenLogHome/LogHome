<template>
  <div
    class="reader-image"
    ref="surface"
    @wheel.prevent="onWheel"
    @mousedown="onMouseDown"
    @dblclick="toggleZoom">
    <img
      v-if="src"
      ref="image" class="zoom-img"
      :src="imageSource"
      :alt="alt"
      :style="imgStyle"
      draggable="false"
      @load="onLoad"
      @error="onError">
    <div v-if="!src" class="placeholder">图片资料不可用</div>
    <div v-else-if="failed" class="image-state" role="alert">图片加载失败 <button @click.stop="retry">重新加载</button></div>
    <div v-else-if="loading" class="image-state" role="status">图片加载中…</div>
    <button v-if="zoom > 1" class="reset-btn" @click.stop="reset">{{ zoom.toFixed(1) }}× · 复位</button>
  </div>
</template>

<script>
import { mangaPageSource } from '~/utils/manga-content'
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

export default {
  name: 'MangaReaderImage',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '漫画页面' },
    resetKey: { type: [Number, String], default: 0 }
  },
  data() {
    return { zoom: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false, loading: Boolean(this.src), failed: false, retries: 0 }
  },
  computed: {
    imageSource() { return mangaPageSource({ url: this.src }, 'original', this.retries) },
    imgStyle() {
      return { transform: `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.zoom})` }
    }
  },
  watch: {
    resetKey() { this.reset() },
    src() { this.reset(); this.retries = 0; this.failed = false; this.loading = Boolean(this.src) }
  },
  mounted() { window.addEventListener('resize',this.bound); const image = this.$refs.image; if (image && image.complete && image.naturalWidth) { this.loading = false; this.bound() } },
  beforeDestroy() {
    window.removeEventListener('resize',this.bound)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    this.$emit('interaction', false)
  },
  methods: {
    onLoad(e) {
      this.loading = false
      this.failed = false
      this.bound()
      this.$emit('load', { width: e.target.naturalWidth, height: e.target.naturalHeight })
    },
    onError() { this.loading = false; this.failed = true; this.$emit('error') },
    retry() { this.retries++; this.failed = false; this.loading = true; this.reset() },
    reset() {
      this.onMouseUp()
      this.zoom = 1
      this.x = 0
      this.y = 0
      this.$emit('interaction', false)
    },
    bound() {
      const el = this.$refs.surface
      if (!el) return
      const image=this.$refs.image
      const maxX=Math.max(0,((image?image.clientWidth:el.clientWidth)*this.zoom-el.clientWidth)/2),maxY=Math.max(0,((image?image.clientHeight:el.clientHeight)*this.zoom-el.clientHeight)/2)
      this.x=clamp(this.x,-maxX,maxX);this.y=clamp(this.y,-maxY,maxY)
    },
    onWheel(e) {
      const delta = e.deltaY > 0 ? -0.2 : 0.2
      const next = clamp(this.zoom + delta * this.zoom, 1, 5)
      if (next === this.zoom) return
      const rect=this.$refs.surface?.getBoundingClientRect(),px=rect&&Number.isFinite(e.clientX)?e.clientX-rect.left-rect.width/2:0,py=rect&&Number.isFinite(e.clientY)?e.clientY-rect.top-rect.height/2:0,ratio=next/this.zoom
      this.x=px-(px-this.x)*ratio;this.y=py-(py-this.y)*ratio;this.zoom=next
      if (this.zoom === 1) { this.x = 0; this.y = 0 }
      this.bound()
      this.$emit('interaction', this.zoom > 1)
    },
    toggleZoom() {
      if (this.zoom > 1) this.reset()
      else {
        this.zoom = 2
        this.bound()
        this.$emit('interaction', true)
      }
    },
    onMouseDown(e) {
      if (e.button !== 0 || this.zoom <= 1) return
      this.dragging = true
      this.moved = false
      this.startX = e.clientX
      this.startY = e.clientY
      this.originX = this.x
      this.originY = this.y
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
      e.preventDefault()
    },
    onMouseMove(e) {
      if (!this.dragging) return
      this.x = this.originX + (e.clientX - this.startX)
      this.y = this.originY + (e.clientY - this.startY)
      this.bound()
      if (Math.abs(e.clientX - this.startX) > 4 || Math.abs(e.clientY - this.startY) > 4) this.moved = true
    },
    onMouseUp() {
      this.dragging = false
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
    }
  }
}
</script>

<style scoped>
.reader-image { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; user-select: none; }
.zoom-img { max-width: 100%; max-height: 100%; object-fit: contain; transform-origin: center center; will-change: transform; cursor: grab; }
.reader-image:active .zoom-img { cursor: grabbing; }
.placeholder { color: #999; font-size: 14px; }
.image-state { position:absolute; padding:12px 16px; border-radius:8px; background:#ffffffed; color:#80684e; font-size:13px; }
.image-state button { margin-left:8px; border:0; background:transparent; color:inherit; text-decoration:underline; cursor:pointer; }
.reset-btn { position: absolute; top: 16px; right: 16px; z-index: 2; padding: 6px 14px; border: none; border-radius: 16px; background: rgba(17, 17, 17, 0.8); color: #fff; font-size: 13px; cursor: pointer; }
.reset-btn:hover { background: rgba(17, 17, 17, 0.95); }
</style>
