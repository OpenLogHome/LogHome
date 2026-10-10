<template><WorkCollection :title="title" /></template>
<script>
import WorkCollection from '~/components/read/WorkCollection.vue'
export default {
  components: { WorkCollection },
  computed: { title() { return String(this.$route.query.title || '人气最佳') } },
  middleware({ query, redirect }) {
    if (query.title === '原木力爆棚' || query.title === '最近更新') return redirect('/read/rank', { board: query.title === '原木力爆棚' ? 'logpower' : 'update', zone: 'all' })
  },
  watchQuery: ['title', 'page']
}
</script>
