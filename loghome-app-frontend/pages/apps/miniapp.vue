<template>
 <view class="miniapp-shell" v-dark>
  <iframe v-if="frameUrl" v-show="!error" :key="frameKey" ref="miniappFrame" class="miniapp-frame" :src="frameUrl" :title="miniapp.name" referrerpolicy="no-referrer"></iframe>
  <view class="miniapp-capsule">
   <button class="capsule-button" aria-label="小程序菜单" @tap="showMenu"><view class="capsule-menu-icon" aria-hidden="true"><view class="capsule-dot"></view><view class="capsule-dot"></view><view class="capsule-dot"></view></view></button>
   <view class="capsule-divider"></view>
   <button class="capsule-button" aria-label="关闭小程序" @tap="requestClose('close')"><view class="capsule-close-icon" aria-hidden="true"></view></button>
  </view>
  <view v-if="loading || error" class="miniapp-status"><text>{{ error || ('正在连接' + miniapp.name + '…') }}</text><button v-if="error" @tap="reload">重新加载</button></view>
 </view>
</template>
<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'
import { getMiniapp } from '@/common/miniapps.js'
export default {
 mixins: [darkModeMixin],
 data() { return {miniapp:{name:'小程序',description:''},frameUrl:'',frameKey:0,loading:true,error:'',closeId:'',ready:false,closeAction:'exit'} },
 watch: {isDarkMode(){this.sendEnvironment()}, '$i18n.locale'(){this.sendEnvironment()}},
 async onLoad(options = {}) {
  let url
  try {this.miniapp=await getMiniapp(options.id,this.$baseUrl);if(this._unloaded)return;url=new URL(this.miniapp.url);if(!['https:','http:'].includes(url.protocol))throw new Error('地址必须使用 HTTPS 或 HTTP');this.frameUrl=url.href;this._origin=url.origin;}catch(e){this.error='小程序配置错误：'+(e.response?.data?.message||e.message);return;}
  this._message=e=>this.onMiniappMessage(e);window.addEventListener('message',this._message)
  this._back=e=>{e.preventDefault();this.requestClose('back')};window.addEventListener('loghomeNativeBack',this._back)
  this._visibility=()=>this.send(document.hidden?'pause':'resume');document.addEventListener('visibilitychange',this._visibility)
  this.startLoadingTimeout()
 },
 onShow(){this.send('resume');this.sendEnvironment()},
 onHide(){this.send('pause')},
 onUnload(){this._unloaded=true;window.removeEventListener('message',this._message);window.removeEventListener('loghomeNativeBack',this._back);document.removeEventListener('visibilitychange',this._visibility);clearTimeout(this._loadTimer);clearTimeout(this._closeTimer)},
 onBackPress(){if(this._exiting)return false;this.requestClose('back');return true},
 methods: {
  startLoadingTimeout(){clearTimeout(this._loadTimer);this._loadTimer=setTimeout(()=>{if(this.loading)this.error='小程序未能加载，请检查网络或服务。'},45000)},
  send(type,extra={}) {const frame=this.$refs.miniappFrame;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({namespace:'loghome-miniapp',version:1,type,...extra},this._origin)},
  environment(){const style=getComputedStyle(document.documentElement);return {theme:this.isDarkMode?'dark':'light',locale:this.$i18n.locale,safeArea:{top:parseFloat(style.getPropertyValue('--loghome-safe-top'))||parseFloat(style.getPropertyValue('--loghome-native-safe-top'))||0,bottom:parseFloat(style.getPropertyValue('--loghome-safe-bottom'))||0}}},
  sendEnvironment(){if(this.ready)this.send('environment',this.environment())},
  async onMiniappMessage(e){
   const frame=this.$refs.miniappFrame,m=e.data;if(!frame||e.source!==frame.contentWindow||e.origin!==this._origin||m?.namespace!=='loghome-miniapp'||m.version!==1)return
   if(m.type==='ready'){
    if(this._authenticating)return;this._authenticating=true;const key=this.frameKey
    try{const token=JSON.parse(window.localStorage.getItem('token')||'null');if(!token?.tk)throw new Error('请先登录原木账号');const res=await axios.get(this.$baseUrl+'/users/generate_cross_site_token',{headers:{Authorization:token.tk}});if(!res.data?.crossSiteToken)throw new Error('获取登录票据失败');if(key!==this.frameKey)return;this.ready=true;this.send('init',{crossSiteToken:res.data.crossSiteToken,...this.environment()});}
    catch(err){if(key===this.frameKey)this.error=err.message||'登录验证失败'}finally{this._authenticating=false}
   }
   if(m.type==='loaded'){this.loading=false;this.error='';clearTimeout(this._loadTimer)}
   if(m.type==='error'){this.loading=false;this.error=m.message||'小程序启动失败';clearTimeout(this._loadTimer)}
   if(m.requestId&&m.requestId===this.closeId){if(m.type==='close-ready'){clearTimeout(this._closeTimer);this.closeId='';if(this.closeAction==='reload')this.reload();else this.exitMiniapp()}else if(m.type==='back-result'){clearTimeout(this._closeTimer);this.closeId=''}else if(m.type==='close-failed'){clearTimeout(this._closeTimer);this.confirmForceClose()}}
  },
  exitMiniapp(){this._exiting=true;uni.navigateBack()},
  requestClose(type,action='exit'){if(this.closeId)return;this.closeAction=action;if(!this.ready||this.error){if(action==='reload')this.reload();else this.exitMiniapp();return;}this.closeId=Date.now()+':'+Math.random();this.send(type,{requestId:this.closeId});this._closeTimer=setTimeout(()=>this.confirmForceClose(),8000)},
  confirmForceClose(){uni.showModal({title:'存档尚未确认',content:'小程序未确认数据已保存。继续等待，或放弃本次未保存进度并退出？',confirmText:'退出',cancelText:'继续等待',success:res=>{this.closeId='';if(res.confirm)this.exitMiniapp();else{this.closeAction='exit';this.send('resume')}}})},
  reload(){this.closeAction='exit';this.ready=false;this.loading=true;this.error='';this.closeId='';this.frameKey++;this.startLoadingTimeout()},
  async openInBrowser(){try{const token=JSON.parse(window.localStorage.getItem('token')||'null');if(!token?.tk)throw new Error('请先登录');const res=await axios.get(this.$baseUrl+'/users/generate_cross_site_token',{headers:{Authorization:token.tk}});if(!res.data.crossSiteToken)throw new Error('获取登录票据失败');const url=new URL(this.frameUrl);url.hash=new URLSearchParams({ticket:res.data.crossSiteToken,theme:this.isDarkMode?'dark':'light',locale:this.$i18n.locale}).toString();if(window.jsBridge?.inApp)window.jsBridge.openInBrowser(url.href);else window.open(url.href,'_blank','noopener')}catch(e){uni.showToast({title:e.message,icon:'none'})}},
  showMenu(){uni.showActionSheet({itemList:['重新加载','关于'+this.miniapp.name,'在浏览器打开'],success:res=>{if(res.tapIndex===0){uni.showModal({title:'重新加载',content:'将保存当前数据后重新加载小程序。',success:r=>{if(r.confirm){this.requestClose('close','reload');}}})}if(res.tapIndex===1)uni.showModal({title:this.miniapp.name,content:this.miniapp.description,showCancel:false});if(res.tapIndex===2)this.openInBrowser()}})}
 }
}
</script>
<style scoped lang="scss">
.miniapp-shell{position:fixed;inset:0;overflow:hidden;background:#fcf4e1;&.dark-mode{background:#171e19}}
.miniapp-frame{position:absolute;inset:0;width:100%;height:100%;border:0}
.miniapp-capsule {
 position: absolute; z-index: 10;
 right: calc(12px + env(safe-area-inset-right, 0px));
 top: calc(10px + var(--loghome-native-safe-top, var(--loghome-safe-top, 0px)));
 display: flex; align-items: center; height: 44px;
 padding: 0 2px; box-sizing: border-box; border: 1px solid rgba(39,55,44,.14);
 border-radius: 24px; background: rgba(255,255,255,.94); color: #27372c;
 box-shadow: 0 2px 8px rgba(24,35,28,.08); backdrop-filter: blur(12px);
 .dark-mode & { background: rgba(35,45,38,.94); border-color: rgba(228,236,223,.2); color: #e4ecdf; }
}
.capsule-button {
 display: flex; align-items: center; justify-content: center; flex-shrink: 0;
 margin: 0; padding: 0; width: 46px; height: 42px; min-height: 0;
 line-height: 1; border: 0; border-radius: 22px; background: transparent; color: inherit;
 &::after { border: 0; }
 &:active { background: rgba(95,119,97,.12); }
 &:focus-visible { outline: 2px solid #709779; outline-offset: -3px; }
}
.capsule-menu-icon { display: flex; align-items: center; gap: 5px; .capsule-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; } }
.capsule-close-icon { display: flex; align-items: center; justify-content: center; width: 19px; height: 19px; box-sizing: border-box; border: 2px solid currentColor; border-radius: 50%; &::after { content: ''; width: 9px; height: 9px; border-radius: 50%; background: currentColor; } }
.capsule-divider { width: 1px; height: 18px; background: currentColor; opacity: .18; }
.miniapp-status{position:absolute;z-index:5;top:35%;left:10%;right:10%;padding:28rpx;border-radius:24rpx;text-align:center;background:#fff8e9;color:#59472e;button{margin-top:20rpx;font-size:26rpx}.dark-mode &{background:#28352b;color:#dce7d6}}
</style>
