const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

test('player bridge distinguishes ordinary entry from intentional paragraph seek', async () => {
  const source = fs.readFileSync(path.join(root, 'components/audiobook-player.vue'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  const context = { window: {jsBridge: {openNativeAudiobookPlayer: async payload => calls.push(payload)}}, uni: {getStorageSync: () => ({tk: 'fixture'})} };
  const calls = [];
  vm.runInNewContext(source.replace('export default', 'this.component ='), context);
  const player = { ...context.component.methods, articleIds: [101], startArticleId: 101, articles: [] };
  await player.openNativePlayer();
  assert.equal(calls.at(-1).forceSeek, false);
  await player.openNativePlayer('7');
  assert.equal(calls.at(-1).forceSeek, true);
  assert.equal(calls.at(-1).startParagraphId, '7');
  await player.openNativePlayer('0', {forceSeek: false});
  assert.equal(calls.at(-1).forceSeek, false);
  assert.equal(calls.at(-1).startParagraphId, '0');
});

test('scroll reader visible paragraph initializes playback without forcing a restart on reopening', async () => {
  const source = fs.readFileSync(path.join(root, 'pages/readers/article_rich.vue'), 'utf8');
  const start = source.indexOf('async openNativeAudiobookPlayer(');
  const end = source.indexOf('\n\t\thandleAudiobookProgress(', start);
  const context = {};
  vm.runInNewContext(`this.methods = ({${source.slice(start, end)}});`, context);
  const calls = [];
  const page = {
    ...context.methods, article: {article_id: 101, novel_id: 1}, articles: [{article_id: 101}],
    isAudiobookArticle: () => true, loadAudiobookNovelInfo: async () => {}, getVisibleParagraphId: () => '0',
    listeningParagraphId: '7', $nextTick: async () => {},
    $refs: {audiobookPlayer: {openNativePlayer: async (...args) => calls.push(args)}}
  };
  await page.openNativeAudiobookPlayer();
  assert.equal(calls.at(-1)[0], '0');
  assert.equal(calls.at(-1)[1].forceSeek, false);
  assert.equal(page.listeningParagraphId, '7');
  await page.openNativeAudiobookPlayer('2');
  assert.equal(calls.at(-1)[1].forceSeek, true);
  assert.equal(page.listeningParagraphId, '2');
});
