// Explicit, idempotent registration: preserve existing operator configuration.
const id = 'log-book-cover';
const legacyDescriptions = new Set([
  '使用模板、文字、图片和图层制作高清封面，支持 3:4 与 9:16 画布，作品保存在当前设备。',
  '使用模板、文字、图片和图层制作书籍封面，画布固定为 499 × 646 像素，作品保存在当前设备。'
]);
async function register(miniapps, lab, env = process.env) {
  const metadata = {
    id, name:'书籍封面生成器（高级版）', icon:'/static/icons/book-cover.svg',
    description:'使用模板、文字、图片和图层制作书籍封面，默认 998 × 1292 像素，支持自定义画布大小，作品保存在当前设备。',
    debugUrl:env.LOG_BOOK_COVER_DEBUG_URL || 'http://127.0.0.1:8789/log-book-cover/',
    productionUrl:env.LOG_BOOK_COVER_PRODUCTION_URL || 'https://miniapps.loghome.ink/log-book-cover/',
    enabled:true, sortOrder:20, minClientVersion:0
  };
  const existing = (await miniapps.all(true)).find(app => app.id === id);
  const app = legacyDescriptions.has(existing?.description)
    ? await miniapps.save({...existing,description:metadata.description},id)
    : existing || await miniapps.save(metadata);
  const entries = await lab.all(true);
  const existingEntry = entries.find(item => item.id === id);
  const entry = legacyDescriptions.has(existingEntry?.description)
    ? await lab.save({...existingEntry,description:metadata.description},id)
    : existingEntry || await lab.save({
    id, miniappId:id, name:metadata.name, nameEn:'Book Cover Generator (Advanced)', icon:metadata.icon,
    description:metadata.description, descriptionEn:'Design covers with templates, text, images and layers. Projects are saved on this device.',
    enabled:true, sortOrder:20
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
