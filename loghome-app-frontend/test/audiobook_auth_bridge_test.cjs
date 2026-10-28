const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

for (const shell of ['loghome-android/app/src/main/assets/js/jsbridge.js']) {
  test(`${shell}: uses the current login on every playlist entry`, async () => {
    const calls = [];
    let raw = JSON.stringify({ tk: 'login-A' });
    const window = {
      localStorage: { getItem: () => raw },
      flutter_inappwebview: { callHandler: (...args) => { calls.push(args); return Promise.resolve(true); } }
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../..', shell), 'utf8'), {
      window, console: { log() {} }
    });
    await window.jsBridge.replacePlaylist(['1'], '1');
    assert.equal(calls.at(-1)[3], 'login-A');
    raw = JSON.stringify({ type: 'string', data: JSON.stringify({ tk: 'login-B' }) });
    await window.jsBridge.replacePlaylist(['1'], '1');
    assert.equal(calls.at(-1)[3], 'login-B');
    if (window.jsBridge.openNativeAudiobookPlayer) {
      await window.jsBridge.openNativeAudiobookPlayer({ articleIds: ['1'], loginToken: 'stale' });
      assert.equal(calls.at(-1)[1].loginToken, 'login-B');
    }
    raw = null;
    await window.jsBridge.replacePlaylist(['1'], '1');
    assert.equal(calls.at(-1)[3], '');
  });
}
