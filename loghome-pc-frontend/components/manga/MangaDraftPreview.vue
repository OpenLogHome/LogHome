<template><section class="manga-draft" :class="`draft-${background}`"><header><div><strong>{{ article.title || '漫画草稿' }}</strong><small>{{ novelName }} · 未保存草稿 · 不计阅读进度或经验</small></div><button @click="$emit('close')">返回编辑器</button></header><div class="draft-settings"><label>阅读方式 <select v-model="mode" @change="changeMode"><option value="strip">上下滚动</option><option value="paged">左右翻页</option></select></label><label>翻页方向 <select v-model="direction" @change="save"><option value="ltr">从左到右</option><option value="rtl">从右到左</option></select></label><label>背景 <select v-model="background" @change="save"><option value="white">白色</option><option value="warm">暖色</option><option value="black">黑色</option></select></label><label>图片清晰度 <select v-model="quality" @change="save"><option value="standard">流畅</option><option value="original">原图</option></select></label><span v-if="storageError" role="alert">偏好未能保存</span></div>
  <p v-if="!pages.length" class="empty">当前草稿尚无漫画页面。</p><template v-else><div v-if="mode==='strip'" ref="strip" class="draft-strip" @scroll.passive="scroll"><div v-for="(page,index) in pages" :key="index" class="draft-strip-page" :style="{aspectRatio:page.width&&page.height?`${page.width}/${page.height}`:undefined}"><img v-if="source(page)" :src="source(page)" :alt="`第 ${index+1} 页`" loading="lazy" @dblclick="openImage=index"/><p v-else>第 {{ index+1 }} 页图片资料不可用</p><button v-if="source(page)" :aria-label="`放大第 ${index+1} 页`" @click="openImage=index">放大</button></div></div><div v-else class="draft-paged"><button :disabled="direction==='rtl'?index>=pages.length-1:index===0" :aria-label="direction==='rtl'?'下一页':'上一页'" @click="step(-1)">‹</button><MangaReaderImage :key="index" :src="source(pages[index])" :alt="`第 ${index+1} 页`" @interaction="zoomed=$event"/><button :disabled="direction==='rtl'?index===0:index>=pages.length-1" :aria-label="direction==='rtl'?'上一页':'下一页'" @click="step(1)">›</button></div><footer><label>页码 <input v-model.number="pageNumber" type="number" min="1" :max="pages.length" @change="seek" @keydown.enter.prevent="seek" /></label><span>{{ index+1 }} / {{ pages.length }} 页</span><span>滚轮缩放，双击放大，拖动查看</span></footer></template>
  <el-dialog :visible="openImage!==null" title="漫画草稿 · 图片预览" width="94vw" top="3vh" append-to-body @update:visible="openImage=null"><div class="draft-image-dialog"><MangaReaderImage v-if="openImage!==null" :src="source(pages[openImage])" :alt="`第 ${openImage+1} 页`"/></div></el-dialog>
</section></template>
<script>
import MangaReaderImage from './MangaReaderImage.vue'
import {mangaPages,mangaPageSource,readMangaPreferences,saveMangaPreferences} from '~/utils/manga-content'
export default {
 components:{MangaReaderImage},props:{article:{type:Object,required:true},novelName:{type:String,default:'漫画'},initialPage:{type:Number,default:0}},data(){return{mode:this.article.article_type==='mangaPage'?'paged':'strip',direction:'ltr',background:'white',quality:'standard',index:Math.max(0,this.initialPage),pageNumber:Math.max(0,this.initialPage)+1,zoomed:false,openImage:null,storageError:false}},computed:{pages(){return mangaPages(this.article.content)}},
 mounted(){const p=readMangaPreferences(localStorage);if(p.mode)this.mode=p.mode;this.direction=p.direction;this.background=p.background;this.quality=p.quality;this.index=Math.min(this.index,Math.max(0,this.pages.length-1));this.pageNumber=this.index+1;window.addEventListener('keydown',this.key);if(this.mode==='strip')this.$nextTick(this.seek)},beforeDestroy(){window.removeEventListener('keydown',this.key)},
 methods: {
  scroll() {
   const strip = this.$refs.strip
   if (!strip || this.openImage !== null) return
   const focus = strip.scrollTop + strip.clientHeight * .4
   const rows = strip.querySelectorAll('.draft-strip-page')
   let index = 0
   for (let i = 0; i < rows.length; i++) {
    if (rows[i].offsetTop <= focus) index = i
    else break
   }
   this.index = index
   this.pageNumber = index + 1
  },
  source(page) { return mangaPageSource(page, this.quality) },
  save() {
   const old = readMangaPreferences(localStorage)
   this.storageError = !saveMangaPreferences(localStorage, {mode:this.mode, direction:this.direction, background:this.background, quality:this.quality, danmu:old.danmu})
  },
  changeMode() {
   this.save()
   this.zoomed = false
   if (this.mode === 'strip') this.$nextTick(this.seek)
  },
  seek() {
   this.index = Math.min(Math.max(0, Math.floor(Number(this.pageNumber) || 1) - 1), Math.max(0, this.pages.length - 1))
   this.pageNumber = this.index + 1
   const target = this.$refs.strip?.querySelectorAll('.draft-strip-page')[this.index]
   if (target) this.$refs.strip.scrollTop = target.offsetTop
  },
  step(delta) {
   const next = this.index + (this.direction === 'rtl' ? -delta : delta)
   if (next < 0 || next >= this.pages.length) return
   this.index = next
   this.pageNumber = next + 1
  },
  key(event) {
   if (this.mode !== 'paged' || this.zoomed || this.openImage !== null || event.ctrlKey || event.metaKey || event.altKey || ['INPUT','TEXTAREA','SELECT','BUTTON'].includes(event.target?.tagName) || event.target?.isContentEditable) return
   if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    this.step(event.key === 'ArrowRight' ? 1 : -1)
   }
  }
 }
}
</script>
<style scoped>.manga-draft{background:#fff;color:#765f48}.draft-warm{background:#f6efdf}.draft-black{background:#111315;color:#d7d1c9}.manga-draft header{display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid #e5ddcf}.manga-draft header>div{flex:1}.manga-draft strong{font-size:17px}.manga-draft small{display:block;font-size:11px;margin-top:8px;color:#a2937f}.manga-draft button{border:1px solid #ddd3c6;border-radius:6px;background:#fff;color:#80684e;cursor:pointer;padding:8px 14px;font:inherit;font-size:12px}.draft-settings{display:flex;gap:18px;flex-wrap:wrap;align-items:center;padding:15px 20px;font-size:12px}.draft-settings select,footer input{font:inherit;color:#80684e;border:1px solid #ddd3c6;border-radius:5px;background:#fff;padding:6px;margin-left:6px}footer input{width:60px}.draft-strip{height:65vh;overflow:auto;position:relative}.draft-strip-page{max-width:900px;margin:auto;position:relative}.draft-strip-page img{display:block;width:100%;height:auto}.draft-strip-page button{position:absolute;right:10px;top:10px;background:#fffe}.draft-paged{display:flex;height:65vh;min-height:300px}.draft-paged>button{border:0;background:transparent;font-size:36px;flex:none;width:55px}.manga-draft footer{display:flex;gap:24px;align-items:center;padding:16px 20px;font-size:12px}.manga-draft footer>span:last-child{margin-left:auto;color:#a2937f}.empty{text-align:center;padding:80px}.draft-image-dialog{height:76vh}.manga-draft button:disabled{opacity:.3;cursor:default}.manga-draft button:focus-visible{outline:2px solid #947358}@media(max-width:700px){.draft-settings{gap:10px}.manga-draft footer{flex-wrap:wrap;gap:12px}.manga-draft footer>span:last-child{margin-left:0}}
</style>
