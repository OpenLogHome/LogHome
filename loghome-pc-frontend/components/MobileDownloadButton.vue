<template>
  <nuxt-link to="/#home-download" class="mobile-download-button">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></svg>
    {{ $t(label) }}
  </nuxt-link>
</template>

<script>
import copy from '~/config/site-copy.json'
export default { computed: { label() { return copy.nav.mobileDownload } } }
</script>

<style scoped>
.mobile-download-button { position:fixed; top:9px; right:16px; z-index:1100; display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:42px; padding:0 16px; border:1px solid #79573c; border-radius:7px; background:#79573c; color:#fffdf7; font-size:14px; font-weight:600; line-height:1.5; text-decoration:none; box-sizing:border-box; white-space:nowrap; }
.mobile-download-button:hover { background:#65452e; }
.mobile-download-button:focus-visible { outline:2px solid #79573c; outline-offset:3px; }
@media(max-width:720px) { .mobile-download-button { right:12px; padding:0 12px; font-size:13px; } }
</style>
