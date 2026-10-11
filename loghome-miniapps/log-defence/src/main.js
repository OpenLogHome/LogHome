import Vue from 'vue/dist/vue.esm.js';
import VueI18n from 'vue-i18n';
import Game from './Game.vue';
import zh from './i18n/zh-CN.json';
import en from './i18n/en.json';
import {hydrate,snapshot} from './storage.js';
import './shell.css';
Vue.config.productionTip=false;
Vue.use(VueI18n);
function normalize(value){if(typeof value==='string')return value.replace(/\{\{(\w+)\}\}/g,'{$1}');if(value&&typeof value==='object')for(const k of Object.keys(value))value[k]=normalize(value[k]);return value;}
const i18n=new VueI18n({locale:'zh-CN',fallbackLocale:'zh-CN',messages:{'zh-CN':normalize(zh),en:normalize(en)}});
Vue.directive('dark',{bind(el,binding,vnode){el.classList.toggle('dark-mode',vnode.context.$root.dark);},componentUpdated(el,binding,vnode){el.classList.toggle('dark-mode',vnode.context.$root.dark);}});
Vue.component('picker',{props:['range'],render(h){return h('span',{class:'picker-adapter'},[this.$slots.default,h('select',{on:{change:e=>this.$emit('change',{detail:{value:e.target.value}})}},(this.range||[]).map((label,i)=>h('option',{domProps:{value:i}},String(label))))]);}});
let app,session,revision=0,pending=false,timer,running=null,stopped=false,initialized=false,parentOrigin=null;
const base=new URL('./',location.href);
const host=document.getElementById('status');
function status(message,error=false){host.textContent=message;host.hidden=!message;host.classList.toggle('error',error);}
function toast(title){const el=document.createElement('div');el.className='toast';el.textContent=title;document.body.append(el);setTimeout(()=>el.remove(),2500);}
window.uni={showToast:({title})=>toast(title),showModal(options){const value=options.editable?window.prompt(options.title+'\n'+(options.content||''),options.placeholderText||''):window.confirm(options.title+'\n'+(options.content||''));options.success?.({confirm:options.editable?value!==null:value,cancel:options.editable?value===null:!value,content:options.editable?(value||''):''});}};
async function api(route,options={}){const res=await fetch(new URL('api/'+route,base),{...options,headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{}),...options.headers}});const data=await res.json();if(!res.ok){const error=new Error(data.error||'请求失败');error.status=res.status;throw error;}return data;}
function queueSave(){if(stopped)return;pending=true;clearTimeout(timer);timer=setTimeout(()=>flush().catch(()=>{}),500);}
async function flush(){clearTimeout(timer);if(running){await running;if(!pending)return;}
 if(stopped)throw new Error('存档已停止，请重新打开游戏');if(!pending||!session)return;
 running=(async()=>{while(pending&&!stopped){pending=false;const state=snapshot();if(!state)continue;try{const saved=await api('save',{method:'PUT',body:JSON.stringify({revision,state})});revision=saved.revision;status('');}catch(e){pending=true;if(e.status===409||e.status===401){stopped=true;app?.$refs.game?.teardown();status(e.status===409?'进度已被另一窗口更新，请重新打开游戏。':'登录已过期，请从原木重新打开游戏。',true);}else{status('云存档未保存，请检查网络。可点击此提示重试。',true);}throw e;}}})();
 try{await running;}finally{running=null;}
}
host.addEventListener('click',()=>flush().catch(()=>{}));
function send(type,extra={}){if(window.parent!==window)window.parent.postMessage({namespace:'loghome-miniapp',version:1,type,...extra},parentOrigin&&parentOrigin!=='null'?parentOrigin:'*');}
function environment(data){if(!app)return;app.dark=data.theme==='dark';document.documentElement.classList.toggle('dark-mode',app.dark);i18n.locale=data.locale==='en'?'en':'zh-CN';for(const key of ['top','bottom'])document.documentElement.style.setProperty('--loghome-safe-'+key,Math.max(0,Number(data.safeArea?.[key])||0)+'px');}
async function init(data){if(initialized)return;initialized=true;status('正在验证原木账号…');try{session=await api('session',{method:'POST',body:JSON.stringify({crossSiteToken:data.crossSiteToken})});const save=await api('save');revision=save.revision;hydrate(save.state,session.user,queueSave);app=new Vue({i18n,data:{dark:false,allowDev:session.allowDev},render:h=>h(Game,{ref:'game'})}).$mount('#app');environment(data);status('');send('loaded');await flush();}catch(e){status('无法启动游戏：'+e.message+'。请从原木重新打开。',true);send('error',{message:e.message});}}
function closeModal(){const game=app?.$refs.game;if(!game)return false;const key=Object.keys(game.$data).reverse().find(k=>k.endsWith('Open')&&game[k]===true);if(key){game[key]=false;return true;}return false;}
(async()=>{try{const config=await api('config');window.addEventListener('message',async e=>{const m=e.data;if(e.source!==window.parent||!config.allowedParents.includes(e.origin)||m?.namespace!=='loghome-miniapp'||m.version!==1)return;if(parentOrigin&&e.origin!==parentOrigin)return;parentOrigin=e.origin;
 if(m.type==='init')return init(m);
 if(m.type==='environment')environment(m);
 if(m.type==='pause'){app?.$refs.game?.teardown();await flush().catch(()=>{});}
 if(m.type==='resume'&&!stopped)app?.$refs.game?.resumeGame();
 if(m.type==='close'||m.type==='back'){if(m.type==='back'&&closeModal())return send('back-result',{requestId:m.requestId,consumed:true});app?.$refs.game?.teardown();try{await flush();send('close-ready',{requestId:m.requestId});}catch{send('close-failed',{requestId:m.requestId});}}
 });const params=new URLSearchParams(location.hash.slice(1));const ticket=params.get('ticket');if(window.parent===window&&ticket){history.replaceState(null,'',location.pathname+location.search);await init({crossSiteToken:ticket,theme:params.get('theme'),locale:params.get('locale')});}else{status(window.parent===window?'请从原木社区 → 原木实验室打开游戏。':'正在连接原木社区…');send('ready');}}catch(e){status('游戏服务暂不可用：'+e.message,true);}})();
window.addEventListener('pagehide',()=>{app?.$refs.game?.teardown();flush().catch(()=>{});});
document.addEventListener('visibilitychange',()=>{if(document.hidden){app?.$refs.game?.teardown();flush().catch(()=>{});}else if(!stopped)app?.$refs.game?.resumeGame();});
