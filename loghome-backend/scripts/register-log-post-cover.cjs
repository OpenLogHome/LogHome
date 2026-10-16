// Explicit, idempotent registration: preserve existing operator configuration.
const id = 'log-post-cover';
async function register(miniapps, lab, env = process.env) {
  const metadata = {
    id, name:'帖子封面生成器', icon:'/static/icons/post-cover.svg',
    description:'制作 1080 × 1440 帖子封面，支持文字高亮、背景纹理和贴纸，草稿保存在当前设备，可导出 PNG 图片。',
    debugUrl:env.LOG_POST_COVER_DEBUG_URL || 'http://127.0.0.1:8790/log-post-cover/',
    productionUrl:env.LOG_POST_COVER_PRODUCTION_URL || 'https://miniapps.loghome.ink/log-post-cover/',
    enabled:true, sortOrder:30, minClientVersion:0
  };
  const existing = (await miniapps.all(true)).find(app => app.id === id);
  const app = existing || await miniapps.save(metadata);
  const existingEntry = (await lab.all(true)).find(item => item.id === id);
  const entry = existingEntry || await lab.save({
    id, miniappId:id, name:metadata.name, nameEn:'Post Cover Generator', icon:metadata.icon,
    description:metadata.description,
    descriptionEn:'Create post covers with highlighted text, background textures and stickers. Save drafts on this device and export PNG images.',
    enabled:true, sortOrder:30
  });
  return {status:existing ? 'already-registered' : 'registered', app, entry};
}
if (require.main === module) {
  const {query} = require('../sql');
  const {createRegistry} = require('../bin/miniapps');
  const {createLabRegistry} = require('../bin/lab');
  const miniapps = createRegistry(query);
  register(miniapps, createLabRegistry(query, miniapps)).then(result => {
    console.log(JSON.stringify(result)); process.exit(0);
  }).catch(error => {
    console.error('注册失败：', error.status ? error.message : (error.code || '数据库操作失败')); process.exit(1);
  });
}
module.exports = {register};
