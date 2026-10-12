<template><main class="world-relations" v-if="world"><header><nuxt-link :to="`/world/${world.novel_id}`">← 返回世界设定</nuxt-link><h1>{{ world.name }} · 词条关系网</h1><p>浏览世界中的人物、事物与联系，选择词条可以查看属性和完整正文。</p></header><WorldVocabularyBrowser :articles="worldVocabs" :novel-id="world.novel_id" network /></main></template>
<script>
import WorldVocabularyBrowser from '~/components/read/WorldVocabularyBrowser.vue'
import { loadPublicWorld } from '~/utils/reader-world'
import { readingHead,SITE_ORIGIN } from '~/utils/reading-seo'
export default {
 components:{WorldVocabularyBrowser},data:()=>({world:null,worldVocabs:[]}),async asyncData(context){return loadPublicWorld(context,true)},
 head(){const path=`/world/relations/${this.world?this.world.novel_id:this.$route.params.id}`;return readingHead({title:this.world?`${this.world.name} - 词条关系网 - 原木社区`:'词条关系网 - 原木社区',description:this.world&&this.world.content,path,schema:this.world?{'@context':'https://schema.org','@type':'ItemList',name:this.world.name+'词条关系',itemListElement:this.worldVocabs.map((word,index)=>({'@type':'ListItem',position:index+1,name:word.title,url:SITE_ORIGIN+`/article/${word.article_id}`}))}:undefined})}
}
</script>
<style scoped>.world-relations{max-width:1360px;box-sizing:border-box;margin:auto;padding:32px 40px 60px}.world-relations>header{margin-bottom:28px}.world-relations>header a{font-size:13px;color:#8d9d60;text-decoration:none}.world-relations h1{font-size:28px;font-weight:500;color:#776247;line-height:1.5;margin:18px 0 12px}.world-relations header p{font-size:13px;color:#a28e6f;line-height:1.8}@media(max-width:800px){.world-relations{padding:24px 20px}.world-relations h1{font-size:23px}}</style>
