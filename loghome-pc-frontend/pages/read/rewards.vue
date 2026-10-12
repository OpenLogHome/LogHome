<template><ReaderRewards /></template>
<script>
import ReaderRewards from '~/components/read/ReaderRewards.vue'
import { readingHead } from '~/utils/reading-seo'
export default { components:{ReaderRewards},head:()=>readingHead({title:'阅读奖励与树场 - 原木社区',description:'查看阅读任务、收集经验球、培育并收获自己的树木。',path:'/read/rewards',noindex:true}) }
</script>
