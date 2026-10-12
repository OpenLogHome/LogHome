<template>
  <div class="voxel-world" role="img" aria-label="史蒂夫阅读、艾利克斯写作，两人在方块森林中交流的循环动画">
    <div ref="stage" class="world-canvas" @pointermove="movePointer" @pointerleave="resetPointer"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.destroyed = false
    this.frame = null
    this.elapsed = 0
    this.lastTime = 0
    this.pointer = { x: 0, y: 0 }
    this.inView = true
    this.contextLost = false
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.onMotionChange = () => {
      this.resetPointer()
      this.syncPlayback()
    }
    this.motionQuery.addEventListener('change', this.onMotionChange)
    document.addEventListener('visibilitychange', this.syncPlayback)
    if (window.IntersectionObserver) {
      this.visibilityObserver = new IntersectionObserver(entries => {
        this.inView = entries[0].isIntersecting
        this.syncPlayback()
      }, { threshold: 0.05 })
      this.visibilityObserver.observe(this.$el)
    }
    this.initialize()
  },
  beforeDestroy() {
    this.destroyed = true
    cancelAnimationFrame(this.frame)
    document.removeEventListener('visibilitychange', this.syncPlayback)
    this.motionQuery.removeEventListener('change', this.onMotionChange)
    if (this.visibilityObserver) this.visibilityObserver.disconnect()
    if (this.resizeObserver) this.resizeObserver.disconnect()
    window.removeEventListener('resize', this.resizeWorld)
    this.disposeWorld()
  },
  methods: {
    async initialize() {
      try {
        const { createHomeVoxelScene } = await import('~/utils/homeVoxelScene')
        if (this.destroyed) return
        this.world = createHomeVoxelScene(this.$refs.stage)
        this.world.canvas.addEventListener('webglcontextlost', this.onContextLost)
        this.world.canvas.addEventListener('webglcontextrestored', this.onContextRestored)
        if (window.ResizeObserver) {
          this.resizeObserver = new ResizeObserver(this.resizeWorld)
          this.resizeObserver.observe(this.$refs.stage)
        } else window.addEventListener('resize', this.resizeWorld)
        this.world.tick(0, this.elapsed, this.pointer)
        this.syncPlayback()
      } catch (error) {
        this.disposeWorld()
        // The illustration is decorative; the page remains usable without WebGL.
        if (process.env.NODE_ENV !== 'production') console.warn('首页 3D 场景加载失败', error)
      }
    },
    disposeWorld() {
      if (!this.world) return
      this.world.canvas.removeEventListener('webglcontextlost', this.onContextLost)
      this.world.canvas.removeEventListener('webglcontextrestored', this.onContextRestored)
      this.world.dispose()
      this.world = null
    },
    onContextLost(event) {
      event.preventDefault()
      this.contextLost = true
      this.syncPlayback()
    },
    onContextRestored() {
      this.contextLost = false
      this.resizeWorld()
      this.syncPlayback()
    },
    resizeWorld() {
      if (!this.world || this.contextLost) return
      this.world.resize()
      this.world.tick(0, this.elapsed, this.pointer)
    },
    syncPlayback() {
      cancelAnimationFrame(this.frame)
      this.frame = null
      this.lastTime = 0
      if (this.world && !this.contextLost && !this.motionQuery.matches && this.inView && !document.hidden && !this.destroyed) {
        this.frame = requestAnimationFrame(this.animate)
      }
    },
    animate(now) {
      const delta = this.lastTime ? Math.min((now - this.lastTime) / 1000, 0.05) : 0
      this.lastTime = now
      this.elapsed += delta
      this.world.tick(delta, this.elapsed, this.pointer)
      this.frame = requestAnimationFrame(this.animate)
    },
    movePointer(event) {
      if (this.motionQuery.matches || event.pointerType === 'touch') return
      const rect = this.$refs.stage.getBoundingClientRect()
      this.pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      this.pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    },
    resetPointer() { this.pointer = { x: 0, y: 0 } }
  }
}
</script>

<style scoped>
.voxel-world { position: relative; min-width: 0; height: 590px; }
.world-canvas { position: absolute; inset: 0; }
.world-canvas ::v-deep canvas { display: block; width: 100%; height: 100%; }
@media (max-width: 1050px) { .voxel-world { height: 540px; } }
@media (max-width: 720px) { .voxel-world { height: 500px; } }
@media (max-width: 420px) { .voxel-world { height: 410px; } }
</style>
