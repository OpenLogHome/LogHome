<template>
  <view class="sort-list">
    <text class="sort-tip">拖动手柄调整顺序，也可聚焦手柄后按上下方向键。</text>
    <view v-for="(page, idx) in pages" :key="page.id" class="sort-row" :class="{ dragging: dragIndex === idx, target: targetIndex === idx && dragIndex !== idx }"
      :draggable="true" @dragstart="start(idx)" @dragover.prevent="targetIndex = idx" @drop.prevent="finish" @dragend="cancel">
      <image :src="page.thumb || page.url" mode="aspectFill" />
      <text class="sort-name">第 {{ idx + 1 }} 页</text>
      <button v-manga-a11y="disabled" class="sort-handle" type="button" :disabled="disabled" :aria-label="'移动第 ' + (idx + 1) + ' 页；按上下方向键调整顺序'" @keydown.up.prevent="moveByKeyboard(idx, -1)" @keydown.down.prevent="moveByKeyboard(idx, 1)" @touchstart.stop.prevent="touchStart(idx)" @touchmove.stop.prevent="touchMove" @touchend.stop.prevent="finish" @touchcancel="cancel"><manga-icon name="drag" /></button>
    </view>
  </view>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
import MangaIcon from '@/components/manga-icon.vue';
export default {
  directives: { mangaA11y: MangaA11y },
  components: { MangaIcon },
  props: { pages: { type: Array, default: () => [] }, disabled: Boolean },
  data() { return { dragIndex: -1, targetIndex: -1, rects: [] }; },
  methods: {
    start(idx) { if (this.disabled) return; this.dragIndex = idx; this.targetIndex = idx; },
    touchStart(idx) {
      this.start(idx);
      if (this.$el && this.$el.querySelectorAll) {
        this.rects = Array.from(this.$el.querySelectorAll('.sort-row')).map(el => el.getBoundingClientRect());
      } else uni.createSelectorQuery().in(this).selectAll('.sort-row').boundingClientRect(rects => { this.rects = rects || []; }).exec();
    },
    touchMove(e) {
      if (this.dragIndex < 0) return;
      const t = e.touches && e.touches[0]; if (!t) return;
      const y = t.clientY === undefined ? t.pageY : t.clientY;
      const idx = this.rects.findIndex(rect => y >= rect.top && y <= rect.bottom);
      if (idx >= 0) this.targetIndex = idx;
    },
    finish() {
      if (!this.disabled && this.dragIndex >= 0 && this.targetIndex >= 0 && this.dragIndex !== this.targetIndex) this.$emit('reorder', { from: this.dragIndex, to: this.targetIndex });
      this.cancel();
    },
    moveByKeyboard(index, direction) {
      const to = index + direction;
      if (!this.disabled && to >= 0 && to < this.pages.length) this.$emit('reorder', { from: index, to });
    },
    cancel() { this.dragIndex = -1; this.targetIndex = -1; },
  },
};
</script>
<style scoped lang="scss">
.sort-tip { display: block; color: var(--manga-muted); font-size: 22rpx; margin-bottom: 16rpx; }
.sort-row { display: flex; align-items: center; gap: 16rpx; min-height: 100rpx; padding: 12rpx; border: 2rpx solid transparent; border-bottom-color: var(--manga-line); border-radius: 12rpx; transition: background .18s ease, border-color .18s ease; }
.sort-row image { width: 72rpx; height: 90rpx; border-radius: 8rpx; }
.sort-name { flex: 1; padding: 0 12rpx; font-size: 26rpx; font-weight: 600; }
.sort-handle { display: grid; place-items: center; width: 88rpx; height: 88rpx; border: 0; border-radius: 12rpx; background: var(--manga-bg); color: var(--manga-muted); touch-action: none; font-size: 28rpx; cursor: grab; }
.sort-handle:focus-visible { outline: 3px solid var(--manga-accent); outline-offset: 2px; }
.dragging { opacity: .5; }.target { border-color: var(--manga-accent); background: var(--manga-tint); }
@media (prefers-reduced-motion: reduce) { .sort-row { transition: none; } }
</style>
