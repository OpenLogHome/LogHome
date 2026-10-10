<template><el-dialog v-if="value" title="阅读预览" :visible="value" fullscreen append-to-body :show-close="false" custom-class="writer-reader-preview" @update:visible="$emit('input', $event)"><ReaderPreview v-if="previewKey" :key="previewKey" :preview-key="previewKey" @close="$emit('input', false)" /><div v-else class="preview-unavailable" role="alert"><h2>生成预览失败</h2><p>{{ error }}</p><button @click="$emit('input', false)">返回编辑器</button></div></el-dialog></template>
<script>
import ReaderPreview from './ReaderPreview.vue'
import { storeReaderPreview } from '~/utils/reader-preview'
export default {
  components:{ReaderPreview},props:{value:Boolean,article:Object,novel:Object},data:()=>({previewKey:'',error:'',ready:false}),
  mounted(){this.ready=true;if(this.value)this.open()},
  watch:{value(value){if(!value){this.previewKey='';this.error=''}else if(this.ready)this.open()}},
  methods:{open(){try{this.previewKey=storeReaderPreview({article:this.article,novel:this.novel});this.error=''}catch(error){this.previewKey='';this.error=error.message||'本机存储不可用，请稍后重试'}}}
}
</script>
<style>.writer-reader-preview>.el-dialog__header{display:none}.writer-reader-preview>.el-dialog__body{padding:0}.writer-reader-preview .preview-unavailable{padding:70px 25px;text-align:center}</style>
