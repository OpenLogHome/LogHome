<template><ReaderPreview :key="$route.params.key" :preview-key="$route.params.key" @close="returnToEditor" /></template>
<script>
import ReaderPreview from '~/components/read/ReaderPreview.vue'
import { readingHead } from '~/utils/reading-seo'
export default {
  components: { ReaderPreview },
  head() { return readingHead({title:'本机阅读预览 - 原木社区',description:'本机草稿阅读预览',path:'/read/preview',noindex:true}) },
  methods: { returnToEditor() { this.$router.back() } }
}
</script>
