<template><div class="reading-ranks-page"><RankPanel full /></div></template>
<script>
import RankPanel from '~/components/read/RankPanel.vue'
export default { components: { RankPanel }, watchQuery: ['board', 'zone', 'page'] }
</script>
