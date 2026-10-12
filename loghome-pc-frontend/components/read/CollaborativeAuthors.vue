<template>
  <section v-if="authors.length > 1 || error" class="collaborative-authors">
    <h3>联合创作</h3>
    <p v-if="error">协作者暂时未能加载。<button @click="load">重试</button></p>
    <div class="authors"><nuxt-link v-for="author in authors" :key="author.user_id" :to="`/users/${author.user_id}`"><img :src="author.avatar_url || '/default-avatar.png'" alt=""><span>{{ author.name }}</span><small v-if="author.is_owner">所有者</small></nuxt-link></div>
  </section>
</template>
<script>
export default {
  props: { novelId: { type: [Number, String], required: true } },
  data: () => ({ authors: [], error: false, version: 0 }),
  async fetch() { await this.load() }, watch: { novelId() { this.authors = []; this.load() } },
  beforeDestroy() { this.version++ },
  methods: { async load() {
    const version = ++this.version; this.error = false
    try { const data = await this.$api.reader.authors(this.novelId); if (version === this.version) this.authors = data.authors || [] }
    catch (_) { if (version === this.version) this.error = true }
  } }
}
</script>
<style scoped>
.collaborative-authors { margin: 22px 0; padding: 18px 20px; border: 1px solid #eee7df; border-radius: 10px; background: #fff; }
h3 { font-size: 15px; color: #65513d; margin-bottom: 12px; }.authors { display: flex; flex-wrap: wrap; gap: 12px; }.authors a { display: flex; gap: 9px; align-items: center; text-decoration: none; color: #72604e; font-size: 13px; padding: 7px 12px; background: #faf7f1; border-radius: 6px; }.authors img { width: 29px; height: 29px; object-fit: cover; border-radius: 50%; }small { font-size: 10px; color: #ad8e62; }p { font-size: 12px; color: #999; }button { border: 0; background: none; color: #947358; cursor: pointer; }
</style>
