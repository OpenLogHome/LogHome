const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function api(data){const context={axios:{get:async url=>({data:{data}})}};vm.runInNewContext(fs.readFileSync(path.join(root,'common/lab.js'),'utf8').replace(/import axios[^\n]+\n/,'').replace(/export /g,''),context);return context;}
test('lab accepts only server-curated entries, including a deliberately empty catalog',async()=>{
 const entries=[{id:'entry',miniappId:'log-miniminecraft',name:'世界',icon:'/static/icons/mini-minecraft.svg'}];assert.equal((await api(entries).getLabEntries('http://backend'))[0].miniappId,'log-miniminecraft');assert.equal((await api([]).getLabEntries('http://backend')).length,0);
 for(const data of [null,{},[{id:'entry',miniappId:'../bad',name:'bad',icon:'x'}]])await assert.rejects(api(data).getLabEntries('http://backend'));
});
function page(fetcher){const source=fs.readFileSync(path.join(root,'pages/apps/lab.vue'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import[^\n]+\n/g,'').replace('export default','this.component =');const context={getLabEntries:fetcher,darkModeMixin:{}};vm.runInNewContext(source,context);return Object.assign(context.component.data(),context.component.methods,{$baseUrl:'http://backend',$i18n:{locale:'en'}});}
test('page uses English metadata with Chinese fallback, and clears stale cards on failed refresh',async()=>{
 const app=page(async()=>{throw Error('network')});app.entries=[{id:'old'}];assert.equal(app.entryName({name:'中文',nameEn:'English'}),'English');assert.equal(app.entryDescription({description:'中文说明',descriptionEn:''}),'中文说明');await app.loadEntries();assert.equal(app.entries.length,0);assert.equal(app.error,true);assert.equal(app.loading,false);
});
test('an older request cannot restore a card hidden by a later backend refresh',async()=>{
 const deferred=[];const app=page(()=>new Promise(resolve=>deferred.push(resolve)));const old=app.loadEntries(),latest=app.loadEntries();deferred[1]([]);await latest;deferred[0]([{id:'old'}]);await old;assert.equal(app.entries.length,0);
});
