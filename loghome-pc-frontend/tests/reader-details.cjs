// Run: node tests/reader-details.cjs
// Exercise real Vue methods with delayed/failing API responses; no backend writes.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const babel = require('@babel/core')
const compiler = require('vue-template-compiler/build.js')
const root = path.resolve(__dirname, '..')
const modules = new Map(), storage = new Map()
const localStorage = { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)) }
let httpRequest, httpGet, httpPost
function load(relative) {
  if (modules.has(relative)) return modules.get(relative)
  let source = fs.readFileSync(path.join(root, relative), 'utf8')
  if (relative.endsWith('.vue')) {
    const parsed = compiler.parseComponent(source)
    assert.deepEqual(compiler.compile(parsed.template.content).errors, [], relative + ' template must compile')
    source = parsed.script.content
  }
  const code = babel.transformSync(source, { configFile: false, babelrc: false, plugins: [require('@babel/plugin-transform-modules-commonjs')] }).code
  const exports = {}, context = {
    exports, process: { server: false, client: true, env: { baseUrl: 'http://test.invalid' } },
    URLSearchParams, Date, console, setTimeout, clearTimeout, localStorage, window: { localStorage },
    require(specifier) {
      if (specifier.endsWith('.vue')) return {}
      if (specifier === 'axios') return { request: options => httpRequest(options), get: (...args) => httpGet(...args), post: (...args) => httpPost(...args) }
      const target = specifier.startsWith('~/') ? specifier.slice(2) : path.posix.join(path.posix.dirname(relative), specifier)
      return load(target.endsWith('.js') ? target : target + '.js')
    }
  }
  vm.runInNewContext(code, context, { filename: relative })
  modules.set(relative, exports)
  return exports
}
function instance(file, props, api) {
  const definition = load(file).default
  const ctx = { ...props, $route: { query: {} }, $api: { reading: api, reader: api }, $set: (obj, key, value) => { obj[key] = value }, $router: { replace() {} }, $refs: {}, $nextTick: callback => callback(), $emit() {}, $message: { info() {}, error() {}, success() {} }, $confirm: async () => {} }
  Object.assign(ctx, typeof definition.data === 'function' ? definition.data.call(ctx) : {})
  for (const [key, method] of Object.entries(definition.methods || {})) ctx[key] = method.bind(ctx)
  for (const [key, computed] of Object.entries(definition.computed || {})) Object.defineProperty(ctx, key, { get: () => computed.call(ctx) })
  return ctx
}
const book = id => ({ novel_id: id, name: `作品${id}`, novel_type: 'novel' })
const plain = value => JSON.parse(JSON.stringify(value))
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }
async function main() {
  const seo = load('utils/reading-seo.js')
  assert.equal(seo.canonicalReadingUrl('/read/rank', { board: 'logpower', zone: 'all', page: '02', utm_source: 'spam', batch_id: 'old' }), 'https://loghome.ink/read/rank?board=logpower&page=2')
  assert.equal(seo.canonicalReadingUrl('/article/4', { paragraphId: 55, previewKey: 'secret', page: 7, mode: 'text' }), 'https://loghome.ink/article/4')
  assert.equal(seo.readingPage('2.5'), 1); assert.equal(seo.readingPage('99999999'), 1)
  assert.equal(seo.publicReadingPath('/read'), true); assert.equal(seo.publicReadingPath('/read/bookcase'), false)
  assert.equal(seo.publicReadingPath('/manga/read/4'), true)
  console.log('PASS canonical normalization, public SSR route policy, private query exclusion')

  const frontend = load('utils/reader-paragraphs.js'), backend = require('../../loghome-backend/bin/readerParagraphs')
  const fixtures = [
    ['one\r\n\ntwo', 'text'],
    [JSON.stringify({ content: [{ paragraph_id: '9', value: ['first', 'second'] }, { value: 'fallback' }, { type: 'image', img: 'https://a.invalid/x' }] }), 'richtext'],
    [[{ id: 1, value: 'explicit' }, { value: 'generated' }], 'worldOutline'],
    [JSON.stringify({ desc: '词条说明', attributes: [], relations: [] }), 'worldVocabulary'],
    [JSON.stringify('plain\ntext'), 'text'], [null, 'richtext']
  ]
  for (const [raw, type] of fixtures) assert.deepEqual(plain(frontend.readerParagraphs(raw, type)), backend.readerParagraphs(raw, type))
  assert.deepEqual(plain(frontend.readerParagraphs(fixtures[2][0])).map(row => row.id), [1, 2])
  assert.equal(frontend.findReaderParagraph({ content: 'one\ntwo' }, 2).value, 'two')
  assert.equal(backend.findReaderParagraph({ article_type: 'mangaPage', content: '[]' }, 1), null)
  console.log('PASS matching server/client paragraph identities, legacy/wrapper/image/world content')

  let options
  httpRequest = async request => { options = request; return { data: [] } }
  storage.set('token', JSON.stringify({ tk: 'test-account' }))
  const reader = load('plugins/api/reader.js').default
  await reader.exp(60); assert.deepEqual(JSON.parse(options.data), { activity_type: 'read_seconds', seconds: 60 })
  await reader.feedback({ article_id: 3, paragraph_id: 2, feedback_content: 'typo' }); assert.equal(options.headers.Authorization, 'Bearer test-account')
  storage.delete('token'); assert.throws(() => reader.feedback({}), /登录/)
  console.log('PASS authenticated feedback and correct mobile reading-EXP activity contract')

  const catalog = instance('components/read/ChapterCatalog.vue', { chapters: [{ article_id: 1, article_chapter: 1, title: '序言' }, { article_id: 2, article_type: 'spliter', title: '第一卷' }, { article_id: 3, article_chapter: 3, title: '大海' }, { article_id: 4, article_chapter: 4, title: '高山' }], currentChapter: 3, novelId: 7 }, {})
  assert.equal(catalog.readable.length, 3); assert.equal(catalog.groups.length, 2)
  catalog.keyword = '高'; assert.equal(catalog.groups[0].chapters[0].article_id, 4)
  catalog.keyword = ''; catalog.reversed = true; assert.equal(catalog.groups[0].chapters[0].article_id, 4)
  console.log('PASS chapter grouping/search/reverse excludes non-readable volume separators')

  const first = deferred(), second = deferred(); let calls = 0
  httpGet = async (url, config) => {
    assert.equal(config.params.paragraphId, calls ? 2 : 1)
    return ++calls === 1 ? first.promise : second.promise
  }
  const comments = instance('components/manga/MangaCommentPanel.vue', { novelId: 7, articleId: 3, paragraphId: 1, paragraphText: '', anchorId: 0, scopeTitle: '', visible: true }, {})
  const old = comments.load(1); comments.paragraphId = 2; const latest = comments.load(1)
  second.resolve({ data: [{ essay_comment_id: 22, content: 'current', replies: [] }] }); await latest
  first.resolve({ data: [{ essay_comment_id: 11, content: 'stale', replies: [] }] }); await old
  assert.equal(comments.comments[0].commentId, 22)
  httpGet = async () => { throw Error('offline') }; await comments.load(2)
  assert.equal(comments.page, 1); assert.equal(comments.comments[0].commentId, 22); assert.match(comments.error, /offline/); assert.equal(comments.failedPage, 2)
  console.log('PASS paragraph comment scope race and failed-pagination retry preserves current comments')
  comments.loadedScope = comments.scopeKey()
  let draftCleared = 0, refreshed = 0
  comments.$refs.composer = { reset() { draftCleared++ } }
  comments.onOpen = async () => { refreshed++ }
  storage.set('token', JSON.stringify({ tk: 'new-account', id: 10 }))
  comments.checkAccount()
  assert.equal(draftCleared, 1); assert.equal(refreshed, 1); assert.equal(comments.comments.length, 0)
  console.log('PASS shared inline/drawer comments clear account-scoped content and the composer before reload')

  let payload
  storage.set('token', JSON.stringify({ tk: 'test-account', id: 9 }))
  httpPost = async (url, body) => { payload = body; return { data: { essay_comment_id: 99, replies: [] } } }
  await load('common/manga-comment-api.js').publishMangaComment('http://test.invalid', { novelId: 7, articleId: 3, paragraphId: 2, content: 'hello' })
  assert.equal(payload.paragraph_id, 2); assert.equal(payload.article_id, 3)
  await load('common/manga-comment-api.js').publishMangaComment('http://test.invalid', { novelId: 7, articleId: 3, content: 'chapter' }); assert.equal(payload.paragraph_id, -1)
  await load('common/manga-comment-api.js').publishMangaComment('http://test.invalid', { novelId: 7, content: 'book' }); assert.equal(payload.article_id, 0)
  console.log('PASS book/chapter/paragraph publication scopes share the mobile protocol')

  const fansOld = deferred(), fansNew = deferred(); calls = 0
  const fans = instance('components/NovelFansList.vue', { novelId: 7, limit: 1 }, { fans: () => ++calls === 1 ? fansOld.promise : fansNew.promise, profile: async () => ({ user_id: 9, name: 'current' }) })
  const oldFans = fans.getFansList(); fans.period = 'month'; const newFans = fans.getFansList()
  fansNew.resolve([{ user_id: 8, fans_value: 10 }, { user_id: 9, fans_value: 5, message: 'real message' }]); await newFans
  fansOld.resolve([{ user_id: 9, fans_value: 100 }]); await oldFans
  assert.equal(fans.myInfo.rank, '第 2 名'); assert.equal(fans.myInfo.fans_value, 5); assert.equal(fans.visibleFans.length, 1)
  fans.showAll = true; assert.equal(fans.visibleFans.length, 2); assert.equal(fans.visibleFans[1].message, 'real message')
  console.log('PASS monthly/total fans race, real messages, full-list rank despite compact display')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
