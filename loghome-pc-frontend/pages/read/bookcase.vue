<template><ReadingShelf full /></template>
<script>
import ReadingShelf from '~/components/read/ReadingShelf.vue'
export default { components: { ReadingShelf }, head: () => ({ title: '我的书架 - 原木社区', meta: [{ hid: 'robots', name: 'robots', content: 'noindex,follow' }] }) }
</script>
