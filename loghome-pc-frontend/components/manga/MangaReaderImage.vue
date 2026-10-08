<template>
  <div
    class="reader-image"
    ref="surface"
    @wheel.prevent="onWheel"
    @mousedown="onMouseDown"
    @dblclick="toggleZoom">
    <img
      v-if="src"
      class="zoom-img"
      :src="src"
      :style="imgStyle"
      draggable="false"
      @load="onLoad"
      @error="$emit('error')">
    <div v-else class="placeholder">图片加载中…</div>
    <button v-if="zoom > 1" class="reset-btn" @click.stop="reset">{{ zoom.toFixed(1) }}× · 复位</button>
  </div>
</template>

<script>
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

export default {
  name: 'MangaReaderImage',
  props: {
    src: { type: String, default: '' },
    resetKey: { type: [Number, String], default: 0 }
  },
  data() {
    return { zoom: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false }
  },
  computed: {
    imgStyle() {
      return { transform: `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.zoom})` }
    }
  },
  watch: {
    resetKey() { this.reset() },
    src() { this.reset() }
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    this.$emit('interaction', false)
  },
  methods: {
    onLoad(e) {
      this.$emit('load', { width: e.target.naturalWidth, height: e.target.naturalHeight })
    },
    reset() {
      this.zoom = 1
      this.x = 0
      this.y = 0
      this.$emit('interaction', false)
    },
    bound() {
      const el = this.$refs.surface
      if (!el) return
      const w = el.clientWidth
      const h = el.clientHeight
      this.x = clamp(this.x, -w * (this.zoom - 1) / 2, w * (this.zoom - 1) / 2)
      this.y = clamp(this.y, -h * (this.zoom - 1) / 2, h * (this.zoom - 1) / 2)
    },
    onWheel(e) {
      const delta = e.deltaY > 0 ? -0.2 : 0.2
      const next = clamp(this.zoom + delta * this.zoom, 1, 5)
      if (next === this.zoom) return
      this.zoom = next
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
      if (this.zoom <= 1) return
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
.reset-btn { position: absolute; top: 16px; right: 16px; z-index: 2; padding: 6px 14px; border: none; border-radius: 16px; background: rgba(17, 17, 17, 0.8); color: #fff; font-size: 13px; cursor: pointer; }
.reset-btn:hover { background: rgba(17, 17, 17, 0.95); }
</style>
