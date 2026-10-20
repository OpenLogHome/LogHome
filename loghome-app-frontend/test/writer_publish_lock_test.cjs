const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const parser = require('@babel/parser');

const definitions = new Map();
function definition(page) {
  if (!definitions.has(page)) {
    const source = fs.readFileSync(path.join(__dirname, `../pages/writers/${page}.vue`), 'utf8');
    const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
    const component = parser.parse(script, { sourceType: 'module' }).program.body
      .find(node => node.type === 'ExportDefaultDeclaration').declaration;
    definitions.set(page, { script, component });
  }
  return definitions.get(page);
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const lock = (session_id = 'publish', user_id = 7) => ({ session_id, user_id, name: user_id === 7 ? '米糊' : '协作者' });
const conflict = current => ({ response: { status: 409, data: { msg: 'lock_not_found', lock: current } } });
const ok = () => ({ data: { lock: lock() } });

function fixture(page = 'workPublish', post = async () => ok()) {
  const { script, component } = definition(page);
  const dialogs = [], requests = [], navigations = [], invalidations = [];
  const intervals = new Map(), timeouts = new Map();
  let timerId = 0;
  const document = { visibilityState: 'visible' };
  const globals = {
    document, Promise,
    axios: { post: (...args) => { requests.push(args); return post(...args); } },
    uni: { showModal: options => dialogs.push(options), showToast() {}, navigateTo: options => navigations.push(options) },
    setInterval: callback => { intervals.set(++timerId, callback); return timerId; },
    clearInterval: id => intervals.delete(id),
    setTimeout: callback => { timeouts.set(++timerId, callback); return timerId; },
    clearTimeout: id => timeouts.delete(id),
    EDIT_LOCK_HEARTBEAT_MS: 30000, LOCK_RECONNECT_DELAYS_MS: [2000],
    DEFINITE_LOCK_CONFLICT_CODES: ['lock_taken'],
    createEmptyCorrectionResult: () => ({}),
    buildClientSyncTime: () => '20261019120000',
    markWriterSyncInvalidated: state => invalidations.push(state),
  };
  function evaluate(node) { return vm.runInNewContext(`({${script.slice(node.start, node.end)}})`, globals); }
  const methodsNode = component.properties.find(node => node.key.name === 'methods');
  const methods = vm.runInNewContext(`(${script.slice(methodsNode.value.start, methodsNode.value.end)})`, globals);
  const state = page === 'workPublish'
    ? evaluate(component.properties.find(node => node.key.name === 'data')).data()
    : {
      chapterId: 10, editSessionId: 'editor', currentUserId: 7, lockState: 'active',
      lockReconnectAttempts: 0, publishHandoffActive: false, leaveFinalized: false,
      canPublishArticle: true, loadComplete: true,
    };
  for (const [name, method] of Object.entries(methods)) state[name] = method.bind(state);
  Object.assign(state, {
    $baseUrl: 'https://test.invalid', articleId: 10, publishSessionId: 'publish', sourceSessionId: 'editor',
    getAuthToken: () => 'test-token', getCurrentUserId: () => 7,
    refreshSaveNotifyText() {}, hasPendingSync: () => false,
    shouldSuppressEditorSyncForCompletedPublish: () => false,
    persistPublishDraft: () => true, startLocalSaveTimer() {},
    loadMembershipStatus() {}, refreshNovelPublishState: async () => {},
  });
  const hooks = {};
  for (const name of ['onShow', 'onHide', 'onUnload', 'beforeDestroy']) {
    const node = component.properties.find(node => node.key.name === name);
    hooks[name] = evaluate(node)[name].bind(state);
  }
  return { state, hooks, dialogs, requests, navigations, invalidations, intervals, timeouts, document };
}

test('发布检查中原编辑器抢回会话或锁过期时，恢复续期并保留检查进度', async () => {
  for (const current of [null, lock('editor'), lock('publish')]) {
    const f = fixture('workPublish', async url => {
      if (url.endsWith('heartbeat_article_edit_lock')) throw conflict(current);
      return ok();
    });
    const result = { paragraph_results: [{ corrected_text: '检查已完成的段落' }] };
    Object.assign(f.state, { smartCorrectionLoading: true, smartCorrectionResult: result });
    await f.state.heartbeatEditLock();
    assert.equal(f.requests.length, 2);
    assert.match(f.requests[1][0], /claim_article_edit_lock$/);
    assert.equal(f.dialogs.length, 0);
    assert.equal(f.intervals.size, 1);
    assert.equal(f.state.smartCorrectionLoading, true);
    assert.equal(f.state.smartCorrectionResult, result);
  }
});

test('网络错误后仍会重试心跳，不把临时断线当作占用', async () => {
  let failure;
  const f = fixture('workPublish', async () => { if (failure) throw failure; return ok(); });
  await f.state.claimEditLock();
  for (failure of [new Error('offline'), { response: { status: 503 } }]) {
    await [...f.intervals.values()][0]();
    // The timer callback intentionally does not await the network request.
    await f.state.heartbeatEditLock();
    assert.equal(f.dialogs.length, 0);
    assert.equal(f.intervals.size, 1);
  }
  failure = null;
  assert.equal(await f.state.heartbeatEditLock(), true);
});

test('真正的协作者占用只提示一次，同账号其他页面接管也不会被强行抢回', async () => {
  for (const current of [lock('collaborator', 8), lock('another-tab')]) {
    const f = fixture('workPublish', async () => { throw conflict(current); });
    await Promise.all([f.state.heartbeatEditLock(), f.state.heartbeatEditLock()]);
    await f.state.heartbeatEditLock();
    assert.equal(f.requests.length, 1);
    assert.equal(f.dialogs.length, 1);
    assert.equal(f.intervals.size, 0);
    assert.equal(f.dialogs[0].title, current.user_id === 8 ? '章节已被占用' : '发布会话已失效');
    assert.equal(f.invalidations.length, current.user_id === 8 ? 0 : 1);
  }
});

test('恢复过程中被协作者占用时停止恢复并提示，不循环抢锁', async () => {
  const f = fixture('workPublish', async url => {
    throw conflict(url.endsWith('heartbeat_article_edit_lock') ? null : lock('other', 8));
  });
  await f.state.heartbeatEditLock();
  assert.equal(f.requests.length, 2);
  assert.equal(f.dialogs[0].title, '章节已被占用');
});

test('重复续期合并请求，隐藏页面后晚到的冲突不弹窗、不重新启动心跳', async () => {
  const pending = deferred();
  const f = fixture('workPublish', () => pending.promise);
  const first = f.state.heartbeatEditLock(), second = f.state.heartbeatEditLock();
  assert.equal(f.requests.length, 1);
  f.hooks.onHide();
  pending.reject(conflict(lock('other', 8)));
  await Promise.all([first, second]);
  assert.equal(f.dialogs.length, 0);
  assert.equal(f.intervals.size, 0);
});

test('重新显示时先续期；旧生命周期的失败不会干扰新请求', async () => {
  const pending = deferred();
  let calls = 0;
  const f = fixture('workPublish', () => ++calls === 1 ? pending.promise : Promise.resolve(ok()));
  Object.assign(f.state, { hasClaimedEditLock: true, collaborationModeResolved: true });
  const old = f.state.heartbeatEditLock();
  f.hooks.onHide();
  f.hooks.onShow();
  await f.state.heartbeatEditLock();
  pending.reject(conflict(lock('other', 8)));
  await old;
  assert.equal(f.requests.length, 2);
  assert(f.requests.every(request => request[0].endsWith('heartbeat_article_edit_lock')));
  assert.equal(f.dialogs.length, 0);
  assert.equal(f.intervals.size, 1);
});

test('退出页等待已发送的申请结束再释放，避免留下悬空占用', async () => {
  const pending = deferred();
  const f = fixture('workPublish', url => url.endsWith('claim_article_edit_lock') ? pending.promise : Promise.resolve(ok()));
  const claim = f.state.claimEditLock();
  const closing = f.hooks.onUnload();
  assert.equal(f.requests.length, 1);
  pending.resolve(ok());
  await Promise.all([claim, closing]);
  assert.equal(f.requests.length, 2);
  assert.match(f.requests[1][0], /release_article_edit_lock$/);
  assert.equal(f.intervals.size, 0);
});

test('初始化申请期间切走又返回，继续续期并完成初始化申请', async () => {
  const pending = deferred();
  let calls = 0;
  const f = fixture('workPublish', () => ++calls === 1 ? pending.promise : Promise.resolve(ok()));
  Object.assign(f.state, { pageInitializationInProgress: true, collaborationModeResolved: true });
  const claim = f.state.claimEditLock();
  f.hooks.onHide();
  f.hooks.onShow();
  pending.resolve(ok());
  assert.equal(await claim, true);
  assert.equal(f.requests.length, 2);
  assert.match(f.requests[1][0], /heartbeat_article_edit_lock$/);
  assert.equal(f.intervals.size, 1);
  assert.equal(f.dialogs.length, 0);
});

test('编辑器交接时立即停同步、心跳和重连，并等待旧申请结束后导航', async () => {
  const pending = deferred();
  const f = fixture('chapterEditorNew', () => pending.promise);
  f.state.startLockHeartbeat();
  f.state.scheduleLockReconnect();
  const claim = f.state.claimEditLock();
  const publishing = f.state.handlePublishAction();
  assert.equal(f.state.publishHandoffActive, true);
  assert.equal(f.intervals.size, 0);
  assert.equal(f.timeouts.size, 0);
  assert.equal(f.navigations.length, 0);
  f.state.handleVisibilityChange();
  f.state.markLockReconnecting(conflict(lock('publish')));
  await f.state.recoverEditLock();
  await f.state.heartbeatEditLock();
  assert.equal(f.requests.length, 1);
  pending.resolve(ok());
  await Promise.all([claim, publishing]);
  assert.equal(f.intervals.size, 0);
  assert.equal(f.navigations.length, 1);
  assert.match(f.navigations[0].url, /sourceSessionId=editor/);
});

test('交接后旧心跳/保存的失效回包不会触发重连，导航失败能恢复编辑器', async () => {
  const pending = deferred();
  const f = fixture('chapterEditorNew', () => pending.promise);
  const heartbeat = f.state.heartbeatEditLock();
  await f.state.handlePublishAction();
  pending.reject(conflict(lock('publish')));
  await heartbeat;
  assert.equal(f.state.handleStaleSessionError({}), 'handoff');
  assert.equal(f.state.lockState, 'active');
  assert.equal(f.timeouts.size, 0);
  assert.equal(f.dialogs.length, 0);
  let resumed = 0;
  f.state.claimEditLock = async () => { resumed += 1; };
  f.navigations[0].fail();
  assert.equal(f.state.publishHandoffActive, false);
  assert.equal(resumed, 1);
});

test('交接等待在途保存结束，旧保存的占用失败不弹窗也不触发重连', async () => {
  const pending = deferred();
  const f = fixture('chapterEditorNew', () => pending.promise);
  Object.assign(f.state, {
    article: { title: '测试', content: '[]', novel_id: 2, novel_info: {} },
    normalizeCurrentArticleContentForStorage() {},
  });
  const saving = f.state.uploadArticleWriter('20261019120000');
  f.state.syncTaskPromise = saving;
  const publishing = f.state.handlePublishAction();
  assert.equal(f.navigations.length, 0);
  pending.reject(conflict(lock('other', 8)));
  await Promise.all([saving, publishing]);
  assert.equal(f.dialogs.length, 0);
  assert.equal(f.timeouts.size, 0);
  assert.equal(f.navigations.length, 1);
});

test('发布检查中服务端切换实时协作时自动适配，不提示占用', async () => {
  const f = fixture('workPublish', async () => {
    throw { response: { status: 409, data: { code: 'realtime_collaboration_enabled', collaboration: { revision: 4 } } } };
  });
  await f.state.heartbeatEditLock();
  assert.equal(f.state.collaborationMode, 'realtime_crdt');
  assert.equal(f.state.collaborationRevision, 4);
  assert.equal(f.dialogs.length, 0);
  assert.equal(f.intervals.size, 0);
});
