// Run: node tests/reading-discovery.cjs
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
let httpRequest
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
    URLSearchParams, Date, console, setTimeout, clearTimeout, localStorage,
    require(specifier) {
      if (specifier.endsWith('.vue')) return {}
      if (specifier === 'axios') return { request: options => httpRequest(options) }
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
  const ctx = { ...props, $route: { query: {} }, $api: { reading: api }, $set: (obj, key, value) => { obj[key] = value }, $router: { replace() {} } }
  Object.assign(ctx, typeof definition.data === 'function' ? definition.data.call(ctx) : {})
  for (const [key, method] of Object.entries(definition.methods || {})) ctx[key] = method.bind(ctx)
  for (const [key, computed] of Object.entries(definition.computed || {})) Object.defineProperty(ctx, key, { get: () => computed.call(ctx) })
  return ctx
}
const book = id => ({ novel_id: id, name: `作品${id}`, novel_type: 'novel' })
const plain = value => JSON.parse(JSON.stringify(value))
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }
async function main() {
  const utils = load('utils/reading-discovery.js')
  assert.deepEqual(plain(utils.activeCollections([{ collection_id: 3, isValid: '1' }, { collection_id: 1, isValid: 1 }, { collection_id: 2, isValid: '0' }]).map(c => c.collection_id)), [1, 3])
  assert.equal(utils.normalizeWork({ ...book(1), is_complete: '0', is_haycraft: '0' }).is_complete, false)
  assert.equal(utils.workUrl({ novel_id: 6, novel_type: 'manga' }), '/manga/6')
  assert.equal(utils.workUrl({ novel_id: 7, novel_type: 'world' }), '/world/7')
  assert.equal(utils.discoveryLink('/pages/readers/rankBoard?board=new&zone=manga').href, '/read/rank?board=new&zone=manga')
  assert.equal(utils.discoveryLink('/pages/readers/mangaInfo?id=4&noneAnimation=1').href, '/manga/4')
  assert.equal(utils.discoveryLink('javascript:alert(1)'), null)
  const merged = utils.mergeShelf([{ ...book(1), is_complete: 1, novel_type: 'manga' }], [{ ...book(1), last_article_id: 5, last_article_chapter: 3 }, book(2)], [{ novel_id: 1, has_updates: true }])
  assert.equal(merged[0].is_complete, true); assert.equal(merged[0].novel_type, 'manga'); assert.equal(merged[0].last_article_id, 5)
  assert.equal(merged[1].historyIndex, 1)
  const combined = utils.mergeReadingHistory([{ ...book(1), last_article_id: 2, last_read_time: '2026-10-08' }], [{ ...book(1), last_article_id: 3, last_read_time: '2026-10-09' }])
  assert.equal(combined[0].last_article_id, 3)
  console.log('PASS configured collections, numeric flags, work links, mobile links, shelf metadata')

  let requested = [], fail = true
  const feed = instance('pages/read/index.vue', {}, { getBooks: async (page, amount) => {
    requested.push([page, amount]); if (fail) throw Error('offline')
    return [book(24), book(25)]
  } })
  feed.books = Array.from({ length: 24 }, (_, i) => book(i + 1)); feed.hasMore = true
  await feed.loadMore(); assert.equal(feed.page, 1); assert.equal(feed.books.length, 24)
  fail = false; await feed.retryFeed(); assert.equal(feed.page, 2); assert.equal(feed.books.length, 25); assert.equal(feed.hasMore, false)
  assert.deepEqual(requested, [[2, 24], [2, 24]])
  console.log('PASS feed paging, retry same page, duplicate removal, short-page completion')

  const first = deferred(), second = deferred(); let count = 0
  const rank = instance('components/read/RankPanel.vue', { full: true }, { getRank: () => ++count === 1 ? first.promise : second.promise })
  const old = rank.loadFirst(); rank.select('new', 'manga')
  second.resolve({ items: [book(2)], batch_id: 'latest', snapshot_date: '2026-10-09' }); await second.promise; await Promise.resolve()
  first.resolve({ items: [book(1)], batch_id: 'old' }); await old
  assert.equal(rank.items[0].novel_id, 2); assert.equal(rank.batchId, 'latest')
  requested = []
  rank.hasMore = true
  rank.$api.reading.getRank = async params => { requested.push(plain(params)); if (params.page === 2) throw Object.assign(Error('expired'), { status: 410 }); return { items: [book(3)], batch_id: 'renewed' } }
  await rank.loadMore()
  assert.equal(requested[0].batch_id, 'latest'); assert.equal(requested[1].page, 1)
  assert.equal(rank.page, 1); assert.equal(rank.batchId, 'renewed'); assert.equal(rank.loading, false)
  console.log('PASS stale rank response ignored, continuation batch preserved, 410 refresh')

  const oldCollection = deferred(), newCollection = deferred(); count = 0
  const collection = instance('components/read/WorkCollection.vue', { title: '旧专题', tagId: 0 }, { getCollectionBooks: () => ++count === 1 ? oldCollection.promise : newCollection.promise })
  const previous = collection.loadFirst(); collection.title = '新专题'; const latest = collection.loadFirst()
  newCollection.resolve([book(9)]); await latest; oldCollection.resolve([book(8)]); await previous
  assert.equal(collection.books[0].novel_id, 9)
  console.log('PASS changed collection cannot be overwritten by older response')

  const history = load('utils/reading-history.js')
  storage.set('loghomeReaderHistory', JSON.stringify([book(10)]))
  assert.equal(history.localReadingHistory().length, 1)
  storage.set('token', JSON.stringify({ tk: 'account-a' })); assert.equal(history.localReadingHistory().length, 0)
  history.recordLocalReading(book(11), { last_article_id: 101, last_article_chapter: 5 })
  assert.equal(history.localReadingHistory()[0].last_article_id, 101)
  storage.set('token', JSON.stringify({ tk: 'account-b' })); assert.equal(history.localReadingHistory().length, 0)
  assert.equal(history.localReadingProgress(11), null)
  history.recordLocalReading(book(12)); storage.set('token', JSON.stringify({ tk: 'account-a' }))
  assert.equal(history.localReadingHistory()[0].novel_id, 11)
  history.recordLocalReading(book(11)); assert.equal(history.localReadingHistory()[0].last_article_chapter, 5)
  console.log('PASS local history/progress account isolation and resume metadata retained')

  const shelfOld = deferred(), shelfNew = deferred(); let shelfRequests = 0
  const shelf = instance('components/read/ReadingShelf.vue', { full: true }, {
    getShelf: () => ++shelfRequests === 1 ? shelfOld.promise : shelfNew.promise,
    getHistory: async () => [], getUpdates: async () => ({ updates: [] })
  })
  const oldShelf = shelf.load(); storage.set('token', JSON.stringify({ tk: 'account-b' })); const newShelf = shelf.load()
  shelfNew.resolve([book(20)]); await newShelf; shelfOld.resolve([book(19)]); await oldShelf
  assert.ok(shelf.books.some(book => book.novel_id === 20 && book.inShelf)); assert.ok(!shelf.books.some(book => book.novel_id === 19))
  assert.equal(shelf.resumeUrl({ novel_id: 20, novel_type: 'manga', last_article_id: 400, last_page_idx: 7 }), '/manga/read/400?novelId=20&pageIdx=7')
  console.log('PASS stale account response ignored and manga resumes correct page')

  const card = instance('components/read/WorkCard.vue', { work: { ...book(1), badges: [{ code: 'expired', text: '旧', expires_at: '2020-01-01' }, { code: 'active', text: '新', expires_at: '2099-01-01' }] }, compact: true }, {})
  assert.deepEqual(plain(card.visibleBadges.map(b => b.code)), ['active'])
  console.log('PASS expired badges hidden')
  const api = load('plugins/api/reading.js')
  httpRequest = async options => { assert.equal(options.params.page, 2); assert.equal(options.timeout, 12000); return { data: [book(2)] } }
  assert.equal((await api.default.getBooks(2, 24))[0].novel_id, 2)
  httpRequest = async () => { throw { response: { status: 410, data: { msg: 'batch expired' } } } }
  await assert.rejects(api.default.getRank({}), error => error.status === 410)
  let saved
  httpRequest = async options => { saved = options; return { data: { msg: 'ok' } } }
  await api.default.saveProgress({ novel_id: 20, article_id: 400 })
  assert.equal(saved.method, 'POST'); assert.equal(saved.headers.Authorization, 'Bearer account-b')
  assert.deepEqual(JSON.parse(saved.data), { novel_id: 20, article_id: 400 })
  console.log('PASS strict API errors and authenticated progress payload')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
