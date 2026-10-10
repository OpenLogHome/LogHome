<template>
  <section class="book-excerpts">
    <header><h2>书摘</h2><div><button v-for="item in tabs" :key="item.key" :aria-pressed="tab === item.key" :class="{ active: tab === item.key }" @click="tab = item.key">{{ item.label }}</button><button :disabled="loading" @click="load">刷新</button></div></header>
    <p v-if="error" class="notice" role="alert">{{ error }} <nuxt-link v-if="!loggedIn && tab === 'my'" to="/login">登录</nuxt-link><button v-else @click="load">重试</button></p>
    <p v-if="!items.length" class="empty">{{ loading ? '正在加载书摘…' : tab === 'my' ? '阅读时右键段落，添加划线即可收藏为书摘。' : '暂无热门书摘。' }}</p>
    <div v-else class="excerpts-grid"><article v-for="(excerpt, index) in items" :key="excerpt.article_cento_id || `${excerpt.article_id}:${excerpt.paragraph_id}:${index}`">
      <nuxt-link :to="`/article/${excerpt.article_id}?paragraphId=${excerpt.paragraph_id}`"><blockquote>{{ excerpt.paragraph }}</blockquote><p>第 {{ excerpt.article_chapter }} 章 · {{ excerpt.title || excerpt.article_title }}</p></nuxt-link>
      <div class="excerpt-actions"><span v-if="tab === 'hot'">{{ excerpt.highlight_count || 0 }} 次划线 · {{ excerpt.comment_count || 0 }} 条段评</span><button v-if="tab === 'my'" :disabled="removing === excerpt.article_cento_id" @click="remove(excerpt)">移除划线</button></div>
    </article></div>
  </section>
</template>
<script>
import { readingToken } from '~/plugins/api/reading'
export default {
  props: { novelId: { type: [Number, String], required: true } },
  data: () => ({ tabs: [{ key: 'my', label: '我的书摘' }, { key: 'hot', label: '热门书摘' }], tab: 'hot', items: [], loading: false, error: '', loggedIn: false, removing: null, version: 0 }),
  async fetch() { await this.load() },
  mounted() { this.loggedIn = !!readingToken(); if (this.loggedIn) this.tab = 'my' },
  watch: { tab() { this.items = []; this.load() }, novelId() { this.items = []; this.load() } },
  beforeDestroy() { this.version++ },
  methods: {
    async load() {
      const version = ++this.version, token = readingToken(); this.loading = true; this.error = ''; this.loggedIn = !!token
      try {
        const items = await (this.tab === 'my' ? this.$api.reader.excerpts(this.novelId) : this.$api.reader.hotExcerpts(this.novelId))
        if (version === this.version && token === readingToken()) this.items = Array.isArray(items) ? items : []
      } catch (error) { if (version === this.version) this.error = error.message || '书摘加载失败。' }
      finally { if (version === this.version) this.loading = false }
    },
    async remove(excerpt) {
      if (this.removing) return
      try {
        await this.$confirm('移除这条划线书摘？', '移除书摘', { type: 'warning' })
        this.removing = excerpt.article_cento_id
        await this.$api.reader.unhighlight(excerpt.article_cento_id)
        await this.load(); this.$emit('changed')
      } catch (error) { if (error !== 'cancel' && error !== 'close') this.error = error.message || '移除失败，请重试。' }
      finally { this.removing = null }
    }
  }
}
</script>
<style scoped>
.book-excerpts { padding: 20px; background: #fff; border: 1px solid #ede6dd; border-radius: 10px; }header { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }h2 { color: #66513d; font-size: 17px; }header div { display: flex; gap: 7px; }button { padding: 6px 10px; border: 1px solid #e7ddd0; border-radius: 5px; background: none; color: #947358; cursor: pointer; font: inherit; font-size: 12px; }button.active { background: #947358; color: white; }button:disabled { opacity: .5; }.empty { padding: 30px 10px; text-align: center; color: #999; font-size: 13px; }.notice { color: #ab7654; font-size: 12px; margin-bottom: 12px; }.excerpts-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; }article { padding: 18px; background: #fcfaf7; border: 1px solid #ede6dd; border-radius: 8px; }a { color: inherit; text-decoration: none; }blockquote { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 14px; line-height: 1.9; color: #61513f; border-left: 3px solid #c7aa80; padding-left: 14px; }article p,.excerpt-actions { color: #a08d75; font-size: 11px; margin-top: 16px; }.excerpt-actions { display: flex; justify-content: flex-end; }button:focus-visible,a:focus-visible { outline: 2px solid #947358; outline-offset: 3px; }@media(max-width:700px){.excerpts-grid{grid-template-columns:1fr;}}
</style>
