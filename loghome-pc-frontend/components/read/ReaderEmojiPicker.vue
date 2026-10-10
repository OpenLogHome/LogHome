<template>
  <div class="reader-emoji-picker">
    <button class="emoji-trigger" type="button" :disabled="disabled" @click="open"><SiteIcon name="smiley" /> <span>表情</span></button>
    <el-dialog title="表情与表情包" :visible.sync="visible" width="min(690px, 94vw)" append-to-body>
      <div class="emoji-tabs" role="tablist" aria-label="表情类型"><button v-for="item in tabs" :key="item.id" role="tab" :aria-selected="tab === item.id" :class="{active: tab === item.id}" @click="changeTab(item.id)">{{ item.label }}</button></div>
      <div v-if="tab === 'emoji'" class="emoji-grid"><button v-for="emoji in emojis" :key="emoji" :aria-label="`插入 ${emoji}`" @click="selectEmoji(emoji)">{{ emoji }}</button></div>
      <div v-else>
        <div class="sticker-toolbar"><div v-if="tab === 'sticker'" class="categories" aria-label="表情包分类"><button v-for="item in categories" :key="item.id" :aria-pressed="category === item.id" :class="{active: category === item.id}" @click="changeCategory(item.id)">{{ item.label }}</button></div><button class="upload-trigger" :disabled="!account" @click="openUpload">＋ 上传表情包</button></div>
        <p v-if="!account" class="empty">登录后可以选择和收藏表情包。</p>
        <p v-else-if="loading && !items.length" class="empty" role="status">正在加载表情包…</p>
        <p v-else-if="!items.length && !error" class="empty">{{ tab === 'favorite' ? '暂无收藏，可在表情包卡片上选择收藏。' : '这个分类还没有表情包。' }}</p>
        <p v-if="error" class="error" role="alert">{{ error }} <button @click="load(failedPage)">重试</button></p>
        <div class="sticker-grid">
          <article v-for="item in items" :key="item.sticker_id" class="sticker-card">
            <button class="sticker-image" :aria-label="`插入表情包 ${item.sticker_id}`" @click="selectSticker(item)"><img :src="item.url" alt="表情包" loading="lazy" /><span v-if="item.is_private" class="privacy-badge">私密</span></button>
            <div class="sticker-actions"><button :disabled="!!pending[item.sticker_id]" @click="favorite(item)">{{ item.is_favorite ? '已收藏' : '收藏' }}</button><button :disabled="!!pending[item.sticker_id]" @click="preview(item)">预览</button><el-dropdown v-if="isOwner(item)" trigger="click" @command="command($event,item)"><button class="manage" :disabled="!!pending[item.sticker_id]" :aria-label="`管理表情包 ${item.sticker_id}`">⋯</button><el-dropdown-menu slot="dropdown"><el-dropdown-item :command="'privacy'">{{ item.is_private ? '设为公开' : '设为私密' }}</el-dropdown-item><el-dropdown-item command="delete">删除表情包</el-dropdown-item></el-dropdown-menu></el-dropdown></div>
          </article>
        </div>
        <button v-if="page < pages && account" class="load-more" :disabled="loading" @click="load(page + 1)">{{ loading ? '加载中…' : '加载更多' }}</button>
      </div>
    </el-dialog>
    <el-dialog title="上传表情包" :visible.sync="uploadVisible" width="min(460px, 94vw)" append-to-body>
      <p class="hint">上传后可以在评论中使用。公开表情包会出现在其他读者的表情列表中。</p>
      <label class="upload-file"><input type="file" accept="image/*" :disabled="uploading || saving" @change="chooseFile" />{{ uploading ? '图片上传中…' : '选择图片' }}</label>
      <img v-if="uploadUrl" :src="uploadUrl" class="upload-preview" alt="待保存的表情包" />
      <label class="upload-privacy"><input v-model="isPrivate" type="checkbox" :disabled="saving" /> 仅自己可见</label><p v-if="uploadError" class="error" role="alert">{{ uploadError }}</p>
      <span slot="footer"><el-button :disabled="saving" @click="uploadVisible = false">取消</el-button><el-button type="primary" :loading="saving" :disabled="!uploadUrl || uploading" @click="saveUpload">保存表情包</el-button></span>
    </el-dialog>
  </div>
</template>
<script>
import SiteIcon from '~/components/ui/SiteIcon.vue'
import emojis from '~/config/reader/emojis.json'
import { readingToken } from '~/plugins/api/reading'
import { fetchReaderStickers, favoriteReaderSticker, privacyReaderSticker, deleteReaderSticker, createReaderSticker, stickerUserId } from '~/utils/reader-stickers'
import { uploadMangaCommentImage } from '~/common/manga-comment-api'
export default {
  components: { SiteIcon },
  props: { disabled: { type: Boolean, default: false } },
  data: () => ({ visible:false, tab:'emoji', category:'all', emojis, items:[], account:null, page:0, pages:1, failedPage:1, loading:false, error:'', version:0, pending:{}, uploadVisible:false, uploadUrl:'', uploadError:'', uploading:false, saving:false, isPrivate:false, uploadVersion:0,
    tabs:[{id:'emoji',label:'Emoji'},{id:'sticker',label:'表情包'},{id:'favorite',label:'收藏'}],categories:[{id:'all',label:'全部'},{id:'my',label:'我上传的'},{id:'public',label:'公开'},{id:'logwood',label:'原木娘专属'}] }),
  watch: {
    visible(value) { if (!value) this.close() },
    uploadVisible(value) { if (!value) this.resetUpload() }
  },
  mounted() { window.addEventListener('storage',this.checkAccount);window.addEventListener('focus',this.checkAccount) },
  beforeDestroy() { this.version++;this.uploadVersion++;window.removeEventListener('storage',this.checkAccount);window.removeEventListener('focus',this.checkAccount) },
  methods: {
    isOwner(item) { return item.user_id > 0 && item.user_id === stickerUserId() },
    checkAccount() { if (readingToken() !== this.account) { this.version++; this.account=readingToken();this.items=[];this.page=0;this.pages=1;this.loading=false;this.pending={};this.error='';this.uploadVisible=false;this.resetUpload(); if (this.visible && this.tab !== 'emoji' && this.account) this.load(1) } },
    open() { if (this.disabled) return;this.checkAccount();this.visible=true;if(this.tab!=='emoji'&&this.account)this.load(1) },
    close() { this.version++;this.loading=false;this.uploadVisible=false;this.resetUpload() },
    changeTab(tab) { this.tab=tab;this.version++;this.items=[];this.page=0;this.pages=1;this.error='';this.loading=false;if(tab!=='emoji'&&this.account)this.load(1) },
    changeCategory(category) { this.category=category;this.version++;this.items=[];this.page=0;this.pages=1;this.error='';this.loading=false;if(this.account)this.load(1) },
    async load(page=1) {
      this.checkAccount();if(!this.account||this.tab==='emoji'||this.loading)return
      const version=++this.version,token=this.account;this.loading=true;this.error='';this.failedPage=page
      try { const result=await fetchReaderStickers({favorites:this.tab==='favorite',category:this.category,page},token);if(version!==this.version||token!==readingToken())return
        const items=page===1?result.items:this.items.concat(result.items);this.items=items.filter((item,i)=>items.findIndex(row=>row.sticker_id===item.sticker_id)===i);this.page=page;this.pages=result.pages
      } catch(error) { if(version===this.version&&token===readingToken())this.error=error.message }
      finally { if(version===this.version)this.loading=false }
    },
    selectEmoji(content) { if(this.disabled)return;this.$emit('select',{type:'emoji',content});this.visible=false },
    selectSticker(item) { this.checkAccount();if(!this.account||this.disabled||!this.items.some(row=>row.sticker_id===item.sticker_id))return;this.$emit('select',{type:'sticker',content:item.url,sticker_id:item.sticker_id});this.visible=false },
    preview(item) { if(this.$preview)this.$preview([item.url],0) },
    async favorite(item) {
      this.checkAccount();if(!this.account||this.pending[item.sticker_id])return
      const token=this.account,version=this.version;this.$set(this.pending,item.sticker_id,true)
      try { await favoriteReaderSticker(item.sticker_id,!item.is_favorite,token);if(token!==readingToken()||version!==this.version)return;item.is_favorite=!item.is_favorite;if(this.tab==='favorite'&&!item.is_favorite)this.items=this.items.filter(row=>row.sticker_id!==item.sticker_id) }
      catch(error){if(token===readingToken()&&version===this.version)this.error=error.message}
      finally{if(token===this.account)this.$set(this.pending,item.sticker_id,false)}
    },
    async command(command,item) {
      this.checkAccount();if(!this.account||!this.isOwner(item)||this.pending[item.sticker_id])return
      const token=this.account,version=this.version
      const message=command==='delete'?'删除此表情包及其收藏记录？':item.is_private?'设为公开后，其他读者可以查看、收藏和使用这个表情包。':'设为私密后，仅你可以查看这个表情包。'
      try{await this.$confirm(message,'表情包管理',{type:'warning',confirmButtonText:'确定',cancelButtonText:'取消'})}catch(_){return}
      if(token!==readingToken()||version!==this.version)return
      this.$set(this.pending,item.sticker_id,true)
      try{if(command==='delete')await deleteReaderSticker(item.sticker_id,token);else await privacyReaderSticker(item.sticker_id,!item.is_private,token)
        if(token!==readingToken()||version!==this.version)return;this.$message.success(command==='delete'?'表情包已删除':'可见范围已更新');this.loading=false;await this.load(1)
      }catch(error){if(token===readingToken()&&version===this.version)this.error=error.message}
      finally{if(token===readingToken())this.$set(this.pending,item.sticker_id,false)}
    },
    resetUpload(){this.uploadVersion++;this.uploadUrl='';this.uploadError='';this.uploading=false;this.saving=false;this.isPrivate=false},
    openUpload(){this.checkAccount();if(!this.account)return;this.resetUpload();this.uploadVisible=true},
    async chooseFile(event){const file=(event.target.files||[])[0];event.target.value='';if(!file||this.uploading||this.saving)return
      this.checkAccount();if(!this.account)return;const token=this.account,version=++this.uploadVersion;this.uploading=true;this.uploadError='';this.uploadUrl=''
      try{if(!/^image\//.test(file.type)||file.size>10*1024*1024)throw new Error('请选择 10MB 以内的图片');const url=await uploadMangaCommentImage(file);if(version===this.uploadVersion&&token===readingToken())this.uploadUrl=url}
      catch(error){if(version===this.uploadVersion&&token===readingToken())this.uploadError=error.message}
      finally{if(version===this.uploadVersion)this.uploading=false}
    },
    async saveUpload(){this.checkAccount();if(!this.account||!this.uploadUrl||this.uploading||this.saving)return;const token=this.account,version=this.uploadVersion;this.saving=true;this.uploadError=''
      try{await createReaderSticker(this.uploadUrl,this.isPrivate,token);if(version!==this.uploadVersion||token!==readingToken())return;this.$message.success('表情包已保存');this.uploadVisible=false;if(this.tab!=='emoji')await this.load(1)}
      catch(error){if(version===this.uploadVersion&&token===readingToken())this.uploadError=error.message}
      finally{if(version===this.uploadVersion)this.saving=false}
    }
  }
}
</script>
<style scoped>
.reader-emoji-picker{display:inline-flex}.emoji-trigger{display:inline-flex;align-items:center;gap:5px;background:none;border:0;color:#947358;font:inherit;font-size:13px;cursor:pointer;padding:0}.emoji-trigger:disabled{opacity:.5;cursor:default}.emoji-tabs{display:flex;gap:8px;border-bottom:1px solid #e8e2d8;padding-bottom:12px;margin-bottom:16px}.emoji-tabs button,.categories button,.upload-trigger{font:inherit;font-size:13px;border:1px solid #e6ddcf;border-radius:6px;padding:7px 12px;background:#fff;color:#89775e;cursor:pointer}.emoji-tabs button.active,.categories button.active{background:#ecf0df;color:#7a8e50;border-color:#dbe4c6}.emoji-grid{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;max-height:420px;overflow:auto}.emoji-grid button{border:0;background:#faf8f3;padding:8px 0;border-radius:7px;font-size:25px;cursor:pointer}.emoji-grid button:hover{background:#eeeadf}.sticker-toolbar{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-bottom:18px}.categories{display:flex;gap:6px;flex-wrap:wrap}.categories button{font-size:12px;padding:6px 9px}.sticker-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;max-height:440px;overflow:auto;padding:1px}.sticker-card{min-width:0}.sticker-image{position:relative;display:block;width:100%;aspect-ratio:1;background:#faf8f4;border:1px solid #eee8df;border-radius:8px;padding:6px;cursor:pointer}.sticker-image img{width:100%;height:100%;object-fit:contain}.privacy-badge{position:absolute;right:4px;bottom:4px;background:#fff9;color:#9c8f7d;border-radius:3px;font-size:10px;padding:2px 4px}.sticker-actions{display:flex;gap:7px;align-items:center;justify-content:center;padding:6px 0}.sticker-actions button{padding:0;border:0;background:none;font-size:11px;color:#9c8566;cursor:pointer}.sticker-actions .manage{font-size:18px;line-height:12px}.empty{padding:40px 12px;text-align:center;color:#aa9c89;font-size:13px}.error{font-size:13px;line-height:1.8;color:#b45b48;margin:12px 0}.error button{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.load-more{display:block;margin:18px auto 0;background:none;border:0;color:#8f7657;cursor:pointer}.hint{font-size:13px;color:#9e8c75;line-height:1.8}.upload-file{display:inline-flex;position:relative;border:1px dashed #d6cab7;padding:16px 25px;cursor:pointer;margin:12px 0}.upload-file input{position:absolute;inset:0;width:100%;opacity:0;cursor:pointer}.upload-preview{display:block;max-width:180px;max-height:180px;object-fit:contain;margin-bottom:16px}.upload-privacy{display:flex;gap:6px;align-items:center;font-size:13px;color:#93816a;margin-top:10px}button:focus-visible{outline:2px solid #839455;outline-offset:3px}button:disabled{cursor:default;opacity:.5}@media(max-width:600px){.emoji-grid{grid-template-columns:repeat(7,minmax(0,1fr))}.sticker-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.sticker-actions{gap:10px}}
</style>
