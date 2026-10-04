<template>
  <view class="zoom-surface" :class="{ zoomed: zoom > 1 }" :style="surfaceStyle"
    @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @touchcancel="touchCancel" @click="mouseTap">
    <image v-if="src" class="zoom-image" :src="src" :mode="mode" :style="imageStyle"
      @load="$emit('load', $event)" @error="$emit('error', $event)" />
    <view v-else class="image-placeholder">{{ placeholder }}</view>
    <button v-manga-a11y v-if="zoom > 1" class="zoom-reset" type="button" :aria-label="'当前放大 ' + zoom.toFixed(1) + ' 倍，复位图片'" @touchstart.stop @touchend.stop @click.stop="reset">{{ zoom.toFixed(1) }}× · 复位</button>
  </view>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const point = (t) => ({ x: t.clientX === undefined ? t.pageX : t.clientX, y: t.clientY === undefined ? t.pageY : t.clientY });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export default {
  directives: { mangaA11y: MangaA11y },
  name: 'MangaZoomImage',
  props: {
    src: { type: String, default: '' }, mode: { type: String, default: 'aspectFit' },
    height: { type: Number, default: 0 }, resetKey: { type: [Number, String], default: 0 },
    placeholder: { type: String, default: '图片加载中' },
  },
  data() { return { zoom: 1, x: 0, y: 0, rect: null, gesture: null, moved: false, multiTouch: false, lastTouchAt: 0, lastTapAt: 0, tapTimer: null, gestureVersion: 0 }; },
  computed: {
    surfaceStyle() { return { height: this.height ? this.height + 'px' : '100%', touchAction: this.zoom > 1 ? 'none' : 'pan-y' }; },
    imageStyle() { return { transform: `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.zoom})` }; },
  },
  watch: { resetKey() { this.reset(); }, src() { this.reset(); } },
  beforeDestroy() { clearTimeout(this.tapTimer); this.$emit('interaction', false); },
  methods: {
    measure(callback) {
      // H5/WebView uses synchronous geometry so a pinch anchors at the fingers immediately.
      if (this.$el && this.$el.getBoundingClientRect) { this.rect = this.$el.getBoundingClientRect(); callback(); return; }
      uni.createSelectorQuery().in(this).select('.zoom-surface').boundingClientRect((rect) => { this.rect = rect; callback(); }).exec();
    },
    reset() { this.gestureVersion += 1; this.zoom = 1; this.x = 0; this.y = 0; this.gesture = null; this.$emit('interaction', false); },
    touchStart(e) {
      this.lastTouchAt = Date.now();
      const touches = Array.from(e.touches || []).map(point);
      if (!touches.length) return;
      if (touches.length > 1) { if (e.cancelable !== false && e.preventDefault) e.preventDefault(); if (e.stopPropagation) e.stopPropagation(); clearTimeout(this.tapTimer); this.multiTouch = true; this.$emit('interaction', true); }
      else { this.multiTouch = false; this.moved = false; }
      const version = ++this.gestureVersion;
      this.measure(() => {
        if (!this.rect || version !== this.gestureVersion) return;
        const center = touches.length > 1 ? { x: (touches[0].x + touches[1].x) / 2, y: (touches[0].y + touches[1].y) / 2 } : touches[0];
        this.gesture = { touches: touches.length, start: touches[0], zoom: this.zoom, x: this.x, y: this.y,
          distance: touches.length > 1 ? distance(touches[0], touches[1]) : 0,
          anchor: { x: (center.x - this.rect.left - this.x) / this.zoom, y: (center.y - this.rect.top - this.y) / this.zoom } };
      });
    },
    bound() {
      if (!this.rect) return;
      this.x = clamp(this.x, -this.rect.width * (this.zoom - 1), 0);
      this.y = clamp(this.y, -this.rect.height * (this.zoom - 1), 0);
    },
    touchMove(e) {
      const g = this.gesture, ts = Array.from(e.touches || []).map(point);
      if (!g || !ts.length) return;
      if (ts.length > 1 && g.touches > 1) {
        this.zoom = clamp(g.zoom * distance(ts[0], ts[1]) / Math.max(1, g.distance), 1, 4);
        const cx = (ts[0].x + ts[1].x) / 2 - this.rect.left, cy = (ts[0].y + ts[1].y) / 2 - this.rect.top;
        this.x = cx - g.anchor.x * this.zoom; this.y = cy - g.anchor.y * this.zoom;
        this.bound(); this.moved = true;
      } else if (ts.length === 1 && this.zoom > 1 && g.touches === 1) {
        this.x = g.x + ts[0].x - g.start.x; this.y = g.y + ts[0].y - g.start.y;
        this.bound(); this.moved = true;
      } else if (distance(ts[0], g.start) > 8) { this.moved = true; }
      if (this.zoom > 1 || ts.length > 1) { if (e.cancelable !== false && e.preventDefault) e.preventDefault(); if (e.stopPropagation) e.stopPropagation(); }
    },
    touchEnd(e) {
      this.lastTouchAt = Date.now();
      if (e.touches && e.touches.length) {
        const wasMulti = this.multiTouch;
        this.touchStart(e); this.multiTouch = wasMulti; this.moved = true; return;
      }
      const tap = !this.moved && !this.multiTouch;
      this.gestureVersion += 1; this.gesture = null; this.$emit('interaction', this.zoom > 1);
      if (tap) this.tap(e);
    },
    touchCancel() { this.gestureVersion += 1; this.gesture = null; this.moved = true; this.$emit('interaction', this.zoom > 1); },
    mouseTap(e) { if (Date.now() - this.lastTouchAt > 500) this.tap(e); },
    tap(e) {
      const now = Date.now();
      if (now - this.lastTapAt < 280) {
        clearTimeout(this.tapTimer); this.lastTapAt = 0;
        if (this.zoom > 1) this.reset();
        else this.measure(() => {
          if (!this.rect) return;
          const t = (e.changedTouches && e.changedTouches[0]) || e;
          const p = point(t); this.zoom = 2;
          this.x = -(Number.isFinite(p.x) ? p.x - this.rect.left : this.rect.width / 2);
          this.y = -(Number.isFinite(p.y) ? p.y - this.rect.top : this.rect.height / 2);
          this.bound(); this.$emit('interaction', true);
        });
      } else {
        this.lastTapAt = now;
        this.tapTimer = setTimeout(() => { if (this.zoom === 1) this.$emit('image-tap', e); }, 280);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.zoom-surface { position: relative; width: 100%; overflow: hidden; user-select: none; }
.zoom-image { display: block; width: 100%; height: 100%; transform-origin: 0 0; will-change: transform; }
.image-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 24rpx; background: #8080800c; }
.zoom-reset { position: absolute; top: 20rpx; right: 20rpx; z-index: 2; min-height: 72rpx; padding: 12rpx 22rpx; border: 0; border-radius: 40rpx; color: #fff; background: rgba(17,17,17,.8); font-size: 22rpx; }
.zoom-reset:focus-visible { outline: 3px solid #ffae77; outline-offset: 3px; }
</style>
