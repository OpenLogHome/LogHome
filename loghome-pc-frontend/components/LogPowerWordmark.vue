<template>
  <span class="log-power-wordmark" :class="{ 'is-fallback': failed }" role="img" aria-label="原木力">
    <img v-if="!failed" src="/brand/log-power-wordmark.png" alt="" aria-hidden="true"
      @error="failed = true" />
    <span v-else>原木力</span>
  </span>
</template>

<script>
export default {
  name: 'LogPowerWordmark',
  data() {
    return { failed: false }
  }
}
</script>

<style scoped>
.log-power-wordmark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.8em;
  height: 1em;
  vertical-align: -0.16em;
  flex-shrink: 0;
  line-height: 1;
  letter-spacing: normal;
  position: relative;
  overflow: hidden;
}
.log-power-wordmark img {
  display: block;
  width: 100%;
  /* Center the visible strokes, excluding the PNG's transparent padding.
     Canvas: 2050 × 767; visible vertical center: 361.5px. */
  height: 142.2%;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-47.13%);
  object-fit: contain;
}
.log-power-wordmark.is-fallback {
  width: auto;
  height: auto;
  position: static;
  overflow: visible;
  vertical-align: baseline;
  line-height: inherit;
}
</style>
