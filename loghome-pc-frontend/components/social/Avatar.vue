<template>
  <span class="social-avatar" :style="{ width: `${size}px`, height: `${size}px` }"
    ><img
      class="avatar-face"
      :style="photoStyle"
      :src="failed ? '/default-avatar.png' : src || '/default-avatar.png'"
      :alt="alt"
      @error="failed = true" /><img
      v-if="frameUrl"
      class="avatar-frame"
      :src="frameUrl"
      alt=""
  /></span>
</template>
<script>
import assets from "~/config/avatar-frame-assets.json";
export default {
  props: {
    src: String,
    frame: Object,
    size: { type: Number, default: 44 },
    alt: { type: String, default: "" },
  },
  data: () => ({ failed: false }),
  watch: {
    src() {
      this.failed = false;
    },
  },
  computed: {
    frameUrl() {
      const value =
        this.frame &&
        (this.frame.thumbnail_url || this.frame.asset_url || this.frame.image_url);
      return (
        value &&
        (assets[value.split("?")[0]]
          ? assets[value.split("?")[0]].url
          : value.startsWith("/static/")
          ? value.replace("/static/", "/social/")
          : value)
      );
    },
    photoStyle() {
      if (!this.frame) return {};
      const scale = Math.max(
        0.35,
        Math.min(0.9, Number(this.frame.avatar_scale) || 0.58)
      );
      return {
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        left: `${50 + (Number(this.frame.offset_x) || 0)}%`,
        top: `${50 + (Number(this.frame.offset_y) || 0)}%`,
      };
    },
  },
};
</script>
<style scoped>
.social-avatar {
  display: inline-block;
  position: relative;
  flex-shrink: 0;
}
.avatar-face {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
</style>
