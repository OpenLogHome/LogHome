<template><main class="fixture"><h1>阅读预览隔离测试</h1><p>仅使用本地虚构草稿；不保存、发布或请求真实章节。</p><button @click="create">生成草稿预览</button><nuxt-link v-if="key" :to="`/read/preview/${key}`">打开独立预览页</nuxt-link><button v-if="key" @click="expire">使测试预览过期</button><iframe class="isolated-editor" srcdoc="<p>编辑器草稿仍保持打开</p>"></iframe><el-dialog v-if="opened" title="阅读预览" :visible="true" fullscreen append-to-body :show-close="false" custom-class="writer-reader-preview"><ReaderPreview ref="preview" :preview-key="key" @close="opened = false" /></el-dialog></main></template>
<script>
import ReaderPreview from '~/components/read/ReaderPreview.vue'
import { storeReaderPreview, PREVIEW_PREFIX } from '~/utils/reader-preview'
export default {
  components:{ReaderPreview},data(){return{key:'',opened:false}},
  methods:{
    create(){this.key=storeReaderPreview({novel:{novel_id:999001,name:'未发布的方块世界'},article:{article_id:999001,novel_id:999001,article_type:'richtext',title:'一段尚未保存的故事',content:Array.from({length:25},(_,index)=>({id:index+1,type:'text',value:`第${index+1}段：史蒂夫翻开了书，艾利克斯在桌旁写下一封信。林间的风轻轻吹过，他们决定把今天的见闻分享给远方的朋友。`}))}});this.opened=true},
    expire(){const record=JSON.parse(localStorage.getItem(PREVIEW_PREFIX+this.key));record.createdAt=Date.now()-25*60*60*1000;localStorage.setItem(PREVIEW_PREFIX+this.key,JSON.stringify(record));if(this.$refs.preview)this.$refs.preview.validate()}
  }
}
</script>
<style scoped>.fixture>h1,.fixture>p,.fixture>button,.fixture>a{margin:12px 20px;}</style>

<style>.writer-reader-preview>.el-dialog__header{display:none}.writer-reader-preview>.el-dialog__body{padding:0}</style>
