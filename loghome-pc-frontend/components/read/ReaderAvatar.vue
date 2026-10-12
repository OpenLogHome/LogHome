<template>
  <span class="reader-avatar" :class="{ framed: !!frameSource }">
    <span class="avatar-visual" :style="visualStyle">
      <img class="avatar-photo" :src="photoFailed || !src ? '/avatar-placeholder.svg' : src" :style="photoStyle" alt="" loading="lazy" @error="photoFailed = true">
      <img v-if="frameSource" class="avatar-frame" :src="frameSource" alt="" loading="lazy" @error="frameFailed = true">
    </span>
  </span>
</template>
<script>
import frameAssets from '~/config/reader/avatar-frame-assets.json'
const bounded = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback
export default {
  props: { src: { type: String, default: '' }, frame: { type: Object, default: null } },
  data: () => ({ photoFailed: false, frameFailed: false }),
  computed: {
    frameSource() {
      if (!this.frame || this.frameFailed) return ''
      let source = this.frame.thumbnail_url || this.frame.asset_url || ''
      if (typeof source !== 'string') return ''
      const legacy = frameAssets[source.split('?')[0]]
      if (legacy) source = legacy.url
      return /^https?:\/\//i.test(source) ? source : ''
    },
    visualStyle() { return { transform: `translate(-50%, -50%) scale(${this.frameSource ? 1.2 : 1})` } },
    photoStyle() {
      const scale = this.frameSource ? bounded(this.frame.avatar_scale, .58, .35, .9) : 1
      return { width: `${scale * 100}%`, height: `${scale * 100}%`, left: `${50 + (this.frameSource ? bounded(this.frame.offset_x, 0, -50, 50) : 0)}%`, top: `${50 + (this.frameSource ? bounded(this.frame.offset_y, 0, -50, 50) : 0)}%` }
    }
  },
  watch: { src() { this.photoFailed = false }, frame: { deep: true, handler() { this.frameFailed = false } } }
}
</script>
<style scoped>
.reader-avatar { position: relative; display: block; width: 40px; height: 40px; flex: none; overflow: visible; }
.avatar-visual { position: absolute; left: 50%; top: 50%; width: 100%; height: 100%; transform-origin: center; }
.avatar-photo { position: absolute; z-index: 1; display: block; border-radius: 50%; object-fit: cover; background: #eee; transform: translate(-50%, -50%); }
.avatar-frame { position: absolute; inset: 0; z-index: 2; display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
</style>
