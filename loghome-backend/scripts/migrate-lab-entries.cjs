// Migrate the existing manually maintained lab cards once, without resetting edits.
const {query} = require('../sql');
const {createRegistry} = require('../bin/miniapps');
const {createLabRegistry} = require('../bin/lab');
const icons = require('./miniapp-icon-assets.json');
const defaults = [
  {id:'log-defence',miniappId:'log-defence',name:'原木保卫战',nameEn:'Log Defense',icon:icons['log-defence'].url,description:'经营你的原木村庄',descriptionEn:'Build up your log village',enabled:true,sortOrder:0},
  {id:'log-miniminecraft',miniappId:'log-miniminecraft',name:'原木方块世界',nameEn:'LogHome Block World',icon:icons['log-miniminecraft'].url,description:'探索与建造你的方块世界，进度随账号保存',descriptionEn:'Explore and build your block world with account cloud saves',enabled:true,sortOrder:10}
];
(async()=>{
  const miniapps = createRegistry(query), lab = createLabRegistry(query,miniapps);
  const registered = new Set((await miniapps.all(true)).map(app=>app.id));
  const existing = new Set((await lab.all(true)).map(entry=>entry.id));
  for(const entry of defaults) {
    if(existing.has(entry.id)){console.log(entry.id+': already configured');continue;}
    if(!registered.has(entry.miniappId)){console.log(entry.id+': skipped (miniapp not registered)');continue;}
    try { await lab.save(entry); console.log(entry.id+': migrated'); }
    catch(e) { if(e.status!==409)throw e; console.log(entry.id+': already configured'); }
  }
  process.exit(0);
})().catch(error=>{console.error('实验室迁移失败：',error.status?error.message:(error.code||'数据库操作失败'));process.exit(1);});
