<template><ReaderActivityInbox /></template>
<script>
import ReaderActivityInbox from '~/components/read/ReaderActivityInbox.vue'
import { readingHead } from '~/utils/reading-seo'
export default {components:{ReaderActivityInbox},head:()=>readingHead({title:'活动消息 - 原木社区',description:'查看自己收到的社区活动通知与参与说明。',path:'/read/activities',noindex:true})}
</script>
