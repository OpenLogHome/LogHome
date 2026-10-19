const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/readers/bookInfo.vue'), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
function taskError(status, msg) {
  return Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status, data: { msg } },
  });
}
function fixture({ rewardError, likeError, liked = false } = {}) {
  const requests = [], toasts = [], rewards = [], navigation = [], clipboard = [], dialogs = [];
  let token = JSON.stringify({ id: 7, tk: 'test-token' });
  const axios = {
    async get(url) {
      requests.push(url);
      if (url.includes('/library/nice_novel?')) {
        if (likeError) throw likeError;
        liked = !liked;
        return { data: { msg: 'ok' } };
      }
      if (url.includes('/library/get_nices_by_id?')) return { data: [{ nices: liked ? 1 : 0 }] };
      if (url.includes('/library/get_nice_status?')) return { data: [{ nices: liked ? 1 : 0 }] };
      throw new Error('Unexpected GET: ' + url);
    },
    async post(url, body) {
      requests.push({ url, body });
      if (url.endsWith('/library/create_share_code')) return { data: { success: true, code: 'share-code', share_text: '分享口令' } };
      assert(url.endsWith('/treePlant/do_task'));
      if (rewardError) throw rewardError;
      return { data: { reward: 20, growth_val: 108, tree_status: '结果', task_icon: 'tree-icon' } };
    },
  };
  const module = { exports: {} };
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
  vm.runInNewContext(script, {
    module, axios, console,
    FansContributionBoard: {}, LogPowerWordmark: {}, nothing: {}, tippingBar: {},
    springBack: {}, countTo: {}, TaskRewardModal: {}, reportNovelPopup: {}, darkModeMixin: {},
    window: { localStorage: { getItem: () => token, removeItem: () => { token = null; } } },
    uni: {
      showToast: value => toasts.push(value), navigateTo: value => navigation.push(value),
      showModal: value => dialogs.push(value),
      setClipboardData: value => { clipboard.push(value.data); value.success(); },
    },
  });
  const component = module.exports;
  const context = {
    ...component.data(), ...component.methods, $baseUrl: '', uid: 645, niceStatus: liked,
    bookInfo: { name: '测试作品', author_name: '作者' },
    $bus: { $emit() {} }, $refs: { taskRewardModal: { show: value => rewards.push(value) } },
  };
  return { context, requests, toasts, rewards, navigation, clipboard, dialogs };
}

test('liking a book stays successful when the daily tree reward was already claimed', async () => {
  for (const message of ['任务已完成', 'Task already completed today']) {
    const f = fixture({ rewardError: taskError(409, message) });
    f.context.nice();
    await flush();
    assert.equal(f.context.niceStatus, true);
    assert.equal(f.context.nice_amount, 1);
    assert.equal(f.context.showNiubeeAnimation, true);
    assert.equal(f.rewards.length, 0);
    assert.equal(f.toasts.length, 0);
    assert.equal(f.navigation.length, 0);
    assert.equal(f.requests.filter(request => request.body?.task_code === 'daily_like_novel').length, 1);
  }
});

test('no active tree, unavailable tree service and network errors do not turn a successful like into an error', async () => {
  for (const rewardError of [taskError(404, '树木不存在或不属于当前账号'), taskError(503, '树场服务暂不可用'), new Error('Network Error')]) {
    const f = fixture({ rewardError });
    f.context.nice();
    await flush();
    assert.equal(f.context.niceStatus, true);
    assert.equal(f.context.nice_amount, 1);
    assert.equal(f.rewards.length, 0);
    assert.equal(f.toasts.length, 0);
  }
});

test('a newly granted tree reward still shows its actual amount and growth', async () => {
  const f = fixture();
  f.context.nice();
  await flush();
  assert.equal(f.context.niceStatus, true);
  assert.equal(f.rewards.length, 1);
  assert.equal(f.rewards[0].reward, 20);
  assert.equal(f.rewards[0].currentGrowth, 108);
  assert.equal(f.rewards[0].canHarvest, true);
  assert.equal(f.toasts.length, 0);
});

test('removing a like does not request a tree reward', async () => {
  const f = fixture({ liked: true });
  f.context.nice();
  await flush();
  assert.equal(f.context.niceStatus, false);
  assert.equal(f.context.nice_amount, 0);
  assert.equal(f.requests.filter(request => request.body).length, 0);
  assert.equal(f.rewards.length, 0);
});

test('authentication failure in the like operation still navigates to login', async () => {
  const f = fixture({ likeError: taskError(401, 'Unauthorized') });
  f.context.nice();
  await flush();
  assert.equal(f.context.niceStatus, false);
  assert.equal(f.navigation.length, 1);
  assert.match(f.navigation[0].url, /login/);
  assert.equal(f.requests.filter(request => request.body).length, 0);
});

test('a repeated daily sharing reward does not disrupt creating and copying the share code', async () => {
  const f = fixture({ rewardError: taskError(409, '任务已完成') });
  f.context.createShareCode();
  await flush();
  assert.equal(f.context.isCreatingShareCode, false);
  assert.deepEqual(f.clipboard, ['分享口令']);
  assert.equal(f.dialogs[0].title, '口令创建成功');
  assert.equal(f.toasts.length, 0);
  assert.equal(f.rewards.length, 0);
  assert.equal(f.requests.filter(request => request.body?.task_code === 'daily_share_work').length, 1);
});
