<template>
  <div
    class="panel-resize-handle"
    :class="['resize-' + side, { dragging }]"
    role="separator"
    tabindex="0"
    aria-orientation="vertical"
    :aria-label="side === 'left' ? '调整目录面板宽度' : '调整工具面板宽度'"
    :aria-valuenow="Math.round(width)"
    :aria-valuemin="Math.round(min)"
    :aria-valuemax="Math.round(max)"
    title="拖动调整宽度，双击恢复默认"
    @pointerdown="start"
    @pointermove="move"
    @pointerup="finish"
    @pointercancel="cancel"
    @lostpointercapture="finish"
    @keydown="keydown"
    @dblclick="$emit('reset')"
  />
</template>
<script>
export default {
  props: { side: String, width: Number, min: Number, max: Number },
  data: () => ({ dragging: false }),
  beforeDestroy() {
    this.finish();
  },
  methods: {
    update(width) {
      this.$emit(
        "resize",
        Math.round(Math.max(this.min, Math.min(this.max, width)))
      );
    },
    start(event) {
      if (event.button !== 0) return;
      event.preventDefault();
      this._drag = {
        x: event.clientX,
        width: this.width,
        id: event.pointerId,
        target: event.currentTarget,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      this.dragging = true;
      window.addEventListener("keydown", this.cancelKey, true);
      this.$emit("dragging", true);
    },
    move(event) {
      if (!this._drag || event.pointerId !== this._drag.id) return;
      const direction = this.side === "left" ? 1 : -1;
      this.update(
        this._drag.width + direction * (event.clientX - this._drag.x)
      );
    },
    finish() {
      if (!this._drag) return;
      const { target, id } = this._drag;
      this._drag = null;
      this.dragging = false;
      if (target.hasPointerCapture(id)) target.releasePointerCapture(id);
      window.removeEventListener("keydown", this.cancelKey, true);
      this.$emit("dragging", false);
      this.$emit("commit");
    },
    cancel() {
      if (!this._drag) return;
      this.update(this._drag.width);
      this.finish();
    },
    cancelKey(event) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.cancel();
    },
    keydown(event) {
      const direction = this.side === "left" ? 1 : -1;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        this.update(
          this.width +
            direction *
              (event.key === "ArrowRight" ? 1 : -1) *
              (event.shiftKey ? 40 : 10)
        );
      } else if (event.key === "Home") this.update(this.min);
      else if (event.key === "End") this.update(this.max);
      else return;
      event.preventDefault();
      event.stopPropagation();
      this.$emit("commit");
    },
  },
};
</script>
