<template><ReaderAiWorkspace :key="book.novel_id" :book="book" /></template>
<script>
import ReaderAiWorkspace from '~/components/read/ReaderAiWorkspace.vue'
import { readingHead } from '~/utils/reading-seo'
import { workUrl } from '~/utils/reading-discovery'
export default {
  components: { ReaderAiWorkspace },
  async asyncData({ params, $api, error, redirect }) {
    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id <= 0) return error({ statusCode: 404, message: '作品不存在' })
    try {
      const books = await $api.reader.book(id), book = books && books[0]
      if (!book) return error({ statusCode: 404, message: '作品不存在或不可阅读' })
      if (book.novel_type && book.novel_type !== 'novel') return redirect(workUrl(book))
      return { book }
    } catch (failure) { return error({ statusCode: failure.status || 503, message: failure.message || '作品加载失败，请稍后重试' }) }
  },
  head() { return readingHead({ title: `向原木娘提问 · ${this.book.name} - 原木社区`, description: `与原木娘一起阅读《${this.book.name}》。`, path: `/read/ask/${this.book.novel_id}`, noindex: true }) }
}
</script>
