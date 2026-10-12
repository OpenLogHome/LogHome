<template>
  <div class="book-support">
    <div class="support-actions">
      <slot name="primary" />
      <button :disabled="loading || savingShelf" :class="{ active: favorite }" :aria-pressed="favorite" @click="toggleFavorite">
        {{ savingShelf ? '处理中…' : favorite ? '已收藏' : '收藏' }}
      </button>
      <button :disabled="loading || savingLike" :class="{ active: liked }" :aria-pressed="liked" @click="toggleLike">
        {{ savingLike ? '处理中…' : liked ? '已赞' : '点赞' }} · {{ likes }}
      </button>
      <ReaderTipDialog :book="book" @tipped="$emit('tipped', $event)" />
    </div>
    <div class="support-utilities">
      <BookTools :book="book" />
      <slot name="secondary" />
    </div>
    <p v-if="error" class="support-error" role="alert">
      {{ error }}
      <nuxt-link v-if="authExpired" :to="loginUrl">重新登录</nuxt-link>
      <button v-else :disabled="loading" @click="load">重试</button>
    </p>
    <div v-if="task" class="task-reward" role="status">
      <span>每日点赞任务已完成<span v-if="typeof task.reward === 'number'"> · 获得 {{ task.reward }} 点成长值</span></span>
      <nuxt-link v-if="task.tree_status === '结果'" :to="harvestLink">前往收获 →</nuxt-link>
      <button aria-label="关闭任务奖励提示" @click="task=null">×</button>
    </div>
  </div>
</template>
<script>
import BookTools from './BookTools.vue'
import ReaderTipDialog from './ReaderTipDialog.vue'
import { readingToken } from '~/plugins/api/reading'
import { loginReturnPath } from '~/utils/login-return'
export default {
 props:{book:{type:Object,required:true}},components:{BookTools,ReaderTipDialog},data:()=>({favorite:false,liked:false,likes:0,loading:false,savingShelf:false,savingLike:false,error:'',task:null,account:null,authExpired:false,version:0}),
 computed:{harvestLink(){return'/read/rewards'},loginUrl(){return{path:'/login',query:{redirect:loginReturnPath(this.$route.fullPath)}}}},watch:{'book.novel_id'(){this.reset();this.load()}},mounted(){this.account=readingToken();this.load();window.addEventListener('focus',this.checkAccount);window.addEventListener('storage',this.checkAccount);window.addEventListener('auth-state-changed',this.checkAccount)},beforeDestroy(){this.version++;window.removeEventListener('focus',this.checkAccount);window.removeEventListener('storage',this.checkAccount);window.removeEventListener('auth-state-changed',this.checkAccount)},
 methods:{current(version,token,id){return version===this.version&&token===readingToken()&&Number(id)===Number(this.book.novel_id)},reset(){this.version++;this.favorite=this.liked=false;this.likes=0;this.error='';this.authExpired=false;this.task=null;this.loading=this.savingLike=this.savingShelf=false},checkAccount(){const token=readingToken();if(token!==this.account){this.account=token;this.reset();this.$emit('account-change');this.load()}},requireLogin(){this.checkAccount();if(readingToken()&&!this.authExpired)return true;this.$router.push(this.loginUrl);return false},
 async load(){
  if(this.savingLike||this.savingShelf)return
  const version=++this.version,token=readingToken(),id=this.book.novel_id
  this.account=token;this.loading=true;this.error='';this.authExpired=false
  try{
   const[amount,shelf,status]=await Promise.allSettled([this.$api.reader.niceAmount(id),token?this.$api.reading.getShelf():Promise.resolve([]),token?this.$api.reader.niceStatus(id):Promise.resolve([])])
   if(!this.current(version,token,id))return
   if(amount.status==='fulfilled')this.likes=Math.max(0,Number(amount.value&&amount.value[0]&&amount.value[0].nices)||0)
   this.favorite=shelf.status==='fulfilled'&&Array.isArray(shelf.value)&&shelf.value.some(item=>Number(item.novel_id)===Number(id))
   this.liked=status.status==='fulfilled'&&Number(status.value&&status.value[0]&&status.value[0].nices)===1
   const failures=[amount,shelf,status].filter(result=>result.status==='rejected')
   const expired=failures.find(result=>this.unauthorized(result.reason))
   if(expired)this.supportFailure(expired.reason,'作品支持状态加载失败')
   else if(failures.length)this.error='部分作品支持状态未能加载，请重试。'
   this.$emit('liked',{liked:this.liked,count:this.likes})
  }catch(error){if(this.current(version,token,id))this.supportFailure(error,'作品支持状态加载失败')}
  finally{if(version===this.version)this.loading=false}
 },
 unauthorized(error){return[401,403].includes(error&&(error.status||(error.response&&error.response.status)))},
 supportFailure(error,fallback){if(this.unauthorized(error)){this.authExpired=true;this.favorite=this.liked=false;this.task=null;this.error='登录状态已过期，请重新登录后收藏或点赞。'}else this.error=error.message||fallback},
 async toggleFavorite(){if(!this.requireLogin()||this.loading||this.savingShelf)return;const version=this.version,token=readingToken(),id=this.book.novel_id,previous=this.favorite;if(previous){try{await this.$confirm('确定将这部作品移出书架？','取消收藏',{type:'warning'})}catch(_){return}if(!this.current(version,token,id))return}this.savingShelf=true;this.error='';try{await(previous?this.$api.reading.removeFavorite(id):this.$api.reading.addFavorite(id));if(!this.current(version,token,id))return;this.favorite=!previous;this.$message.success(previous?'已从书架移除':'已加入书架');this.$emit('changed')}catch(error){if(this.current(version,token,id))this.supportFailure(error,'收藏操作失败')}finally{if(version===this.version)this.savingShelf=false}},
 async toggleLike(){if(!this.requireLogin()||this.loading||this.savingLike)return;const version=this.version,token=readingToken(),id=this.book.novel_id,wasLiked=this.liked;this.savingLike=true;this.error='';try{await this.$api.reader.nice(id);if(!this.current(version,token,id))return;const[status,amount]=await Promise.all([this.$api.reader.niceStatus(id),this.$api.reader.niceAmount(id)]);if(!this.current(version,token,id))return;this.liked=Number(status&&status[0]&&status[0].nices)===1;this.likes=Math.max(0,Number(amount&&amount[0]&&amount[0].nices)||0);this.$emit('liked',{liked:this.liked,count:this.likes});if(!wasLiked&&this.liked){try{const task=await this.$api.reader.likeTask();if(this.current(version,token,id)){if(!task||task.msg!=='Task completed'||typeof task.reward!=='number'||!Number.isFinite(task.reward))throw new Error('Unconfirmed task result');this.task=task}}catch(error){if(this.current(version,token,id)&&!/already completed|已完成/i.test(error.message))this.error='点赞已成功，任务奖励暂未确认，可在任务页查看'}}}catch(error){if(this.current(version,token,id))this.supportFailure(error,'点赞操作失败')}finally{if(version===this.version)this.savingLike=false}}
 }
}
</script>
<style scoped>.book-support{margin-top:22px}.support-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.support-utilities{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:10px}.support-actions>button{padding:9px 16px;background:#fff;color:#947358;border:1px solid #e3d7c7;border-radius:6px;cursor:pointer;font:inherit;font-size:13px}.support-actions>button.active{background:#edf1e2;border-color:#d5dfc2;color:#7c9053}button:disabled{opacity:.5;cursor:default}.support-error{font-size:12px;line-height:1.8;color:#b4614e;margin-top:12px}.support-error a{color:inherit;margin-left:8px}.support-error button{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.task-reward{margin-top:14px;display:flex;gap:10px;align-items:center;background:#eff4e3;border:1px solid #dae5c8;border-radius:7px;padding:10px 14px;font-size:12px;color:#7d9150}.task-reward>a{margin-left:auto;color:inherit;text-decoration:none}.task-reward>button{border:0;background:none;color:#a1af7d;cursor:pointer;font-size:18px}button:focus-visible,a:focus-visible{outline:2px solid #809455;outline-offset:3px}</style>
