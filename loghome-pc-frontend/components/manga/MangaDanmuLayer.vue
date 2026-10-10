<template>
  <div class="danmu-layer" aria-label="本页弹幕">
    <span
      v-for="item in items"
      :key="item.key"
      class="danmu-item"
      :class="{ self: item.self, moderatable: item.moderatable, paused: item.key === hoverId || item.key === focusId }"
      :style="{ top: item.top + '%', animationDuration: item.duration + 's', animationDelay: item.delay + 's' }"
      @mouseenter="hoverId = item.key"
      @mouseleave="hoverId = null" @focusin="focusId=item.key" @focusout="focusId=null">
      {{ item.content }}
      <button v-if="item.moderatable" class="danmu-del" :aria-label="`删除弹幕：${item.content}`" @click.stop="$emit('remove', item.danmuId)">&times;</button>
    </span>
  </div>
</template>

<script>
// 漫画弹幕漂浮层：父组件通过 :key 在切页/重放时重建本组件以重启动画。
// 覆盖整个阅读区（absolute），pointer-events none 不拦截阅读操作；
// 桌面端 hover 暂停并显示删除按钮（作者可删本作品任意弹幕，用户可删自己的）。
const LANE_COUNT = 8

export default {
  name: 'MangaDanmuLayer',
  props: {
    danmus: { type: Array, default: () => [] },
    currentUserId: { type: [String, Number], default: null },
    workAuthorId: { type: [String, Number], default: null }
  },
  data() {
    return { hoverId: null, focusId:null }
  },
  computed: {
    items() {
      return this.danmus.map((danmu, index) => {
        const lane = index % LANE_COUNT
        const self = this.currentUserId != null && String(danmu.userId) === String(this.currentUserId)
        const moderatable = self || (this.currentUserId != null && this.workAuthorId != null && String(this.currentUserId) === String(this.workAuthorId))
        return {
          key: danmu.danmuId,
          danmuId: danmu.danmuId,
          content: danmu.content,
          self,
          moderatable,
          top: 4 + lane * (86 / (LANE_COUNT - 1)),
          duration: 10 + (Number(danmu.danmuId)%4),
          delay: Math.floor(index / LANE_COUNT) * 2.4 + (Number(danmu.danmuId)%8)*.1
        }
      })
    }
  }
}
</script>

<style scoped>
.danmu-layer { position: absolute; inset: 0; z-index: 30; overflow: hidden; pointer-events: none; }
.danmu-item { position: absolute; left: 100%; white-space: nowrap; padding: 2px 10px; border-radius: 6px; color: #fff; font-size: 16px; font-weight: 600; line-height: 1.5; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85), 0 0 5px rgba(0, 0, 0, 0.45); animation-name: danmu-roll; animation-timing-function: linear; animation-fill-mode: both; will-change: transform; }
.danmu-item.self { color: #5fc3f3; border: 1px solid rgba(95, 195, 243, 0.65); background: rgba(0, 0, 0, 0.3); }
.danmu-item.moderatable { pointer-events: auto; cursor: default; }
.danmu-item.paused { animation-play-state: paused; }
.danmu-del { opacity:0; margin-left: 8px; width: 18px; height: 18px; padding: 0; border: none; border-radius: 50%; background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 14px; line-height: 1; cursor: pointer; vertical-align: middle; }
.danmu-item:hover .danmu-del,.danmu-item:focus-within .danmu-del{opacity:1}.danmu-del:focus-visible{outline:2px solid #fff}.danmu-del:hover { background: #e0524d; }
@keyframes danmu-roll { from { transform: translateX(0); } to { transform: translateX(calc(-100vw - 100%)); } }
@media (prefers-reduced-motion: reduce) { .danmu-item { animation-duration: 0.01s !important; animation-delay: 0s !important; opacity: 0; } }
</style>
