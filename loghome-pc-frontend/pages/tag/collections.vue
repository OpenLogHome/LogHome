<template><WorkCollection :tag-id="tagId" /></template>
<script>
import WorkCollection from '~/components/read/WorkCollection.vue'
export default {
  components: { WorkCollection },
  computed: { tagId() { const id = Number(this.$route.query.tag_id); return Number.isSafeInteger(id) && id > 0 ? id : 3 } },
  watchQuery: ['tag_id', 'page']
}
</script>
