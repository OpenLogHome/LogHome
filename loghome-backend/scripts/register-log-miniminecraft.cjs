// Explicit, idempotent registration; preserve existing operator configuration.
const {query} = require('../sql');
const {createRegistry} = require('../bin/miniapps');
const icons = require('./miniapp-icon-assets.json');
(async () => {
  const registry = createRegistry(query);
  const existing = (await registry.all(true)).find(app => app.id === 'log-miniminecraft');
  if (existing) {
    console.log(JSON.stringify({status: 'already-registered', app: existing}));
  } else {
    const app = await registry.save({
      id: 'log-miniminecraft',
      name: '原木方块世界',
      icon: icons['log-miniminecraft'].url,
      description: '探索与建造你的方块世界，存档、背包和模组进度与原木账号绑定。',
      debugUrl: process.env.LOG_MINIMINECRAFT_DEBUG_URL || 'http://127.0.0.1:8788/log-miniminecraft/',
      productionUrl: process.env.LOG_MINIMINECRAFT_PRODUCTION_URL || 'https://miniapps.loghome.ink/log-miniminecraft/',
      enabled: true,
      sortOrder: 10,
      minClientVersion: 0
    });
    console.log(JSON.stringify({status: 'registered', app}));
  }
  process.exit(0);
})().catch(error => {
  console.error('注册失败：', error.status ? error.message : (error.code || '数据库操作失败'));
  process.exit(1);
});
