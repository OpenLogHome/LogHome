<template>
  <view class="danmu-layer" aria-hidden="true">
    <text v-for="item in items" :key="item.key" class="danmu-item" :class="{ self: item.self, moderatable: item.moderatable, paused: item.key === pressingId }"
      :style="{ top: item.top + '%', animationDuration: item.duration + 's', animationDelay: item.delay + 's' }"
      @touchstart="pressStart(item)" @touchend="pressEnd" @touchcancel="pressEnd"
      @mousedown="pressStart(item)" @mouseup="pressEnd" @mouseleave="pressEnd"
      @longpress="item.moderatable && $emit('remove', item.danmuId)">{{ item.content }}</text>
  </view>
</template>
<script>
// 漫画弹幕漂浮层：父组件通过 :key 在切页/重放时重建本组件以重启动画。
// 覆盖整个视口（fixed），pointer-events none 不拦截阅读手势；自己的弹幕可长按删除。
const LANE_COUNT = 8;

export default {
  name: 'MangaDanmuLayer',
  props: {
    danmus: { type: Array, default: () => [] },
    currentUserId: { type: [String, Number], default: null },
    workAuthorId: { type: [String, Number], default: null },
  },
  data() {
    return { pressingId: null };
  },
  methods: {
    pressStart(item) {
      if (item.moderatable) this.pressingId = item.key;
    },
    pressEnd() {
      this.pressingId = null;
    },
  },
  computed: {
    items() {
      // 同页弹幕按顺序轮流分配车道，并按波次拉开出发时间，减少同车道追尾
      return this.danmus.map((danmu, index) => {
        const lane = index % LANE_COUNT;
        const self = this.currentUserId != null && String(danmu.userId) === String(this.currentUserId);
        // 作者可删本作品内任意弹幕，发送者可删自己的
        const moderatable = self
          || (this.workAuthorId != null && String(danmu.userId) === String(this.workAuthorId));
        return {
          key: danmu.danmuId,
          danmuId: danmu.danmuId,
          content: danmu.content,
          self,
          moderatable,
          top: 4 + lane * (86 / (LANE_COUNT - 1)),
          duration: 9 + Math.random() * 4,
          delay: Math.floor(index / LANE_COUNT) * 2.4 + Math.random() * 0.8,
        };
      });
    },
  },
};
</script>
<style scoped>
.danmu-layer { position: fixed; inset: 0; z-index: 30; overflow: hidden; pointer-events: none; }
.danmu-item { position: absolute; left: 100%; white-space: nowrap; padding: 2rpx 14rpx; border-radius: 10rpx; color: #fff; font-size: 26rpx; font-weight: 600; line-height: 1.5; text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, .85), 0 0 5rpx rgba(0, 0, 0, .45); animation-name: danmu-roll; animation-timing-function: linear; animation-fill-mode: both; will-change: transform; }
.danmu-item.self { color: #5fc3f3; border: 2rpx solid rgba(95, 195, 243, .65); background: rgba(0, 0, 0, .3); }
.danmu-item.moderatable { pointer-events: auto; }
.danmu-item.paused { animation-play-state: paused; }
@keyframes danmu-roll { from { transform: translateX(0); } to { transform: translateX(calc(-100vw - 100%)); } }
@media (prefers-reduced-motion: reduce) { .danmu-item { animation-duration: 0.01s !important; animation-delay: 0s !important; opacity: 0; } }
</style>
