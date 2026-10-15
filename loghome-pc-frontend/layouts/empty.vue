<template>
  <div class="empty-layout">
    <GlobalThemeSwitch class="empty-theme-switch" />
    <MobileDownloadButton />
    <nuxt />
  </div>
</template>

<script>
import MobileDownloadButton from '~/components/MobileDownloadButton.vue'
import GlobalThemeSwitch from '~/components/GlobalThemeSwitch.vue'
export default { name: 'EmptyLayout', components: { MobileDownloadButton, GlobalThemeSwitch } }
</script>

<style scoped>
.empty-layout { padding-top:60px; }
.empty-theme-switch { position:fixed; top:12px; left:16px; z-index:1002; }
.empty-layout::before { content:''; position:fixed; inset:0 0 auto; height:60px; background:#faf8f3; border-bottom:1px solid #e3e4d9; z-index:1000; }
.empty-layout ::v-deep .writer-page,
.empty-layout ::v-deep .manga-reader { top:60px; }
</style>
