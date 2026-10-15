<template>
  <button
    class="social-medal"
    ref="medal"
    :class="{ locked, shiny, flipped }"
    :aria-label="flipped ? $t('查看勋章正面') : $t('翻转查看勋章背面')"
    @click="flipped = !flipped"
    @pointermove="tilt"
    @pointerleave="reset"
  >
    <span class="medal-rotation" ref="rotation"
      ><span class="medal-face medal-front"
        ><img :src="src" :alt="title" /><span
          v-if="shiny && !locked"
          class="medal-shine" /></span
      ><span class="medal-face medal-back"
        ><strong>{{ title }}</strong
        ><span>{{ locked ? $t("待解锁勋章") : $t("原木社区荣誉") }}</span></span
      ></span
    >
  </button>
</template>
<script>
export default {
  props: { src: String, title: String, locked: Boolean, shiny: Boolean },
  data: () => ({ flipped: false }),
  methods: {
    tilt(event) {
      if (
        event.pointerType === "touch" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const bounds = this.$refs.medal.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5,
        y = (event.clientY - bounds.top) / bounds.height - 0.5;
      this.$refs.rotation.style.setProperty("--tilt-x", `${-y * 18}deg`);
      this.$refs.rotation.style.setProperty("--tilt-y", `${x * 18}deg`);
    },
    reset() {
      this.$refs.rotation.style.setProperty("--tilt-x", "0deg");
      this.$refs.rotation.style.setProperty("--tilt-y", "0deg");
    },
  },
};
</script>
<style scoped>
.social-medal {
  background: none;
  border: 0;
  cursor: pointer;
  width: 180px;
  height: 180px;
  perspective: 700px;
  padding: 0;
  display: inline-block;
}
.medal-rotation {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 0.2s ease;
}
.flipped .medal-rotation {
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(calc(180deg + var(--tilt-y, 0deg)));
}
.medal-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
}
.medal-front img {
  width: 82%;
  height: 82%;
  object-fit: contain;
  image-rendering: pixelated;
}
.medal-back {
  transform: rotateY(180deg);
  background: var(--soft, #f2e9dd);
  border: 2px solid #b99863;
  color: var(--ink, #382d25);
  padding: 25px;
  flex-direction: column;
  gap: 16px;
}
.medal-back strong {
  font-size: 16px;
}
.medal-back > span {
  font-size: 11px;
  color: var(--muted, #82766c);
}
.locked img {
  filter: grayscale(1);
  opacity: 0.5;
}
.medal-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 25%, #fff9 50%, transparent 75%);
  transform: translateX(-140%);
  pointer-events: none;
}
.social-medal:hover .medal-shine {
  transform: translateX(140%);
  transition: transform 0.8s ease;
}
@media (prefers-reduced-motion: reduce) {
  .medal-rotation {
    transition: none;
  }
  .medal-shine {
    display: none;
  }
}
</style>
