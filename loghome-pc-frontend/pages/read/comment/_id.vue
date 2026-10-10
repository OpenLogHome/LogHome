<template><div class="comment-navigation">正在定位评论…</div></template>
<script>
import { fetchMangaCommentById } from '~/common/manga-comment-api'
import { readingCommentTarget } from '~/utils/reader-comment-links'
import { readingHead } from '~/utils/reading-seo'
export default {
  async asyncData({ params, query, $api, error, redirect }) {
    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id <= 0) return error({statusCode:404,message:'评论不存在'})
    try {
      const comment = await fetchMangaCommentById(process.env.baseUrl,id)
      if (!comment || (Number(query.novelId) > 0 && Number(query.novelId) !== Number(comment.novelId))) return error({statusCode:404,message:'评论不存在或不属于本作品'})
      const books = await $api.reader.book(comment.novelId), book = books && books[0]
      if (!book) return error({statusCode:404,message:'作品不存在或不可阅读'})
      return redirect(302,readingCommentTarget(comment,book,id))
    } catch(failure) { return error({statusCode:failure.status || failure.response?.status || 503,message:'暂时无法定位评论，请稍后重试'}) }
  },
  head() { return readingHead({title:'定位评论 - 原木社区',path:`/read/comment/${this.$route.params.id}`,noindex:true}) }
}
</script>
