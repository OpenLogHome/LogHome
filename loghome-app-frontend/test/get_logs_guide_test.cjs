const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sfc = require('vue/compiler-sfc');
const root = path.resolve(__dirname, '..');
function load(file, globals) {
 const parsed = sfc.parse({source:fs.readFileSync(path.join(root,file),'utf8'),filename:file});
 const d = parsed.descriptor || parsed;
 const compiled = sfc.compileTemplate({source:d.template.content,filename:file});
 assert.deepEqual(compiled.errors,[]);
 const sandbox = {module:{exports:{}},darkModeMixin:{},axios:{},...globals};
 vm.runInNewContext(d.script.content.replace(/^\s*import .*$/gm,'').replace('export default','module.exports ='),sandbox);
 return sandbox.module.exports;
}
test('tip help opens the guide and refreshes balances when returning', () => {
 let navigation, refreshed = 0;
 const options = load('components/tipping/tippingBar.vue',{uni:{navigateTo(value){navigation=value;}}});
 const context = {...options.methods,refreshResources(){refreshed++;}};
 context.openLogGuide();
 assert.equal(navigation.url,'/pages/payments/get_logs');
 navigation.events['log-guide-return']();
 assert.equal(refreshed,1);
});
test('all three guide actions point to registered routes and the illustration exists', () => {
 const navigations=[];
 const options = load('pages/payments/get_logs.vue',{uni:{navigateTo(value){navigations.push(value.url);}}});
 const context = {...options.data(),...options.methods};
 assert.equal(context.channels.length,3);
 const config=fs.readFileSync(path.join(root,'pages.json'),'utf8');
 assert.match(config,/"path"\s*:\s*"pages\/payments\/get_logs"/);
 for (const channel of context.channels) {
  context.openChannel(channel);
  assert.ok(config.includes('"'+channel.url.slice(1)+'"'));
  assert.ok(fs.existsSync(path.join(root,channel.url.slice(1)+'.vue')));
 }
 assert.deepEqual(navigations,['/pages/treePlant/treeplant','/pages/payments/recharge','/pages/community/activityMessages']);
 assert.ok(fs.statSync(path.join(root,'static/images/get-logs-guide.png')).size>0);
});
test('leaving the guide notifies the original tip panel', () => {
 const events=[];
 const options=load('pages/payments/get_logs.vue',{uni:{}});
 options.onUnload.call({getOpenerEventChannel(){return {emit(event){events.push(event);}};}});
 assert.deepEqual(events,['log-guide-return']);
});
