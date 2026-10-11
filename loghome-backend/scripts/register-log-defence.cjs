// Explicit, idempotent registration; never replace an existing operator configuration.
const {query} = require('../sql');
const {createRegistry} = require('../bin/miniapps');
(async () => {
  const registry = createRegistry(query);
  const existing = (await registry.all(true)).find(app => app.id === 'log-defence');
  if (existing) {
    console.log(JSON.stringify({status: 'already-registered', app: existing}));
  } else {
    const app = await registry.save({
      id: 'log-defence', name: '原木保卫战', icon: '/static/icons/enderman.png',
      description: '建设基地、安排村民、抵御僵尸突袭，进度与原木账号绑定。',
      debugUrl: process.env.LOG_DEFENCE_DEBUG_URL || 'http://127.0.0.1:8787/log-defence/',
      productionUrl: process.env.LOG_DEFENCE_PRODUCTION_URL || 'https://miniapps.loghome.ink/log-defence/',
      enabled: true, sortOrder: 0
    });
    console.log(JSON.stringify({status: 'registered', app}));
  }
  process.exit(0);
})().catch(error => {
  console.error('注册失败：', error.status ? error.message : (error.code || '数据库操作失败'));
  process.exit(1);
});
