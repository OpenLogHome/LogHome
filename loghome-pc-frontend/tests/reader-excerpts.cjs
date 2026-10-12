// Actual Vue lifecycle/methods with isolated delayed requests; no server writes.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm')
const babel = require('@babel/core'), compiler = require('vue-template-compiler/build.js')
const root = path.resolve(__dirname, '..'), cache = new Map(), records = new Map(), listeners = new Map()
const storage = { getItem: key => records.get(key) || null }
const account = token => token ? records.set('token', JSON.stringify({ tk: token })) : records.delete('token')
function load(file) {
  if (cache.has(file)) return cache.get(file)
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(path.join(root,file),'utf8'))
  let source = fs.readFileSync(path.join(root, file), 'utf8')
  if (file.endsWith('.vue')) { const parsed = compiler.parseComponent(source); assert.deepEqual(compiler.compile(parsed.template.content).errors, [], file); source = parsed.script.content }
  const exports = {}
  vm.runInNewContext(babel.transformSync(source, { configFile: false, babelrc: false, plugins: [require('@babel/plugin-transform-modules-commonjs')] }).code, {
    exports, process: { server: false, client: true, env: {} }, URL, URLSearchParams, console, localStorage: storage, sessionStorage: storage, setTimeout, clearTimeout,
    document: { addEventListener() {}, removeEventListener() {} },
    window: { addEventListener: (event, fn) => listeners.set(event, fn), removeEventListener: (event, fn) => { if (listeners.get(event) === fn) listeners.delete(event) } },
    require(specifier) { if (specifier === 'axios' || specifier.endsWith('.vue')) return {}; const target = specifier.startsWith('~/') ? specifier.slice(2) : path.posix.join(path.posix.dirname(file), specifier); return load(/\.(js|json)$/.test(target) ? target : target + '.js') }
  }, { filename: file })
  cache.set(file, exports); return exports
}
function instance(file, props) {
  const definition = load(file).default, ctx = { $route: { fullPath: '/novel/7?tab=excerpts' }, $confirm: async () => {}, $emit() {}, ...props }
  Object.assign(ctx, definition.data.call(ctx))
  for (const [name, fn] of Object.entries(definition.methods)) ctx[name] = fn.bind(ctx)
  for (const [name, fn] of Object.entries(definition.computed || {})) Object.defineProperty(ctx, name, { get: () => fn.call(ctx) })
  return ctx
}
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b }); return { resolve, reject, promise } }
const row = id => ({ article_cento_id: id, article_id: 11, paragraph_id: 2, paragraph: 'isolated excerpt' })
const plain = value => JSON.parse(JSON.stringify(value))
const flush = () => new Promise(setImmediate)
async function main() {
  account(null)
  const file = 'components/read/BookExcerpts.vue', definition = load(file).default
  let hotReads = 0, privateReads = 0
  const component = instance(file, { novelId: 7, $api: { reader: { hotExcerpts: async () => { hotReads++; return [row(1)] }, excerpts: async () => { privateReads++; return [row(2)] } } } })
  await definition.fetch.call(component); definition.mounted.call(component)
  assert.equal(hotReads, 1); assert.equal(privateReads, 0); assert.equal(component.items[0].article_cento_id, 1)
  assert.deepEqual([...listeners.keys()].sort(), ['auth-state-changed', 'focus', 'storage'])
  assert.equal(component.loginUrl.query.redirect, '/novel/7?tab=excerpts')
  console.log('PASS anonymous SSR excerpts survive mounting; account events and login return path registered')

  account('a'); component.checkAccount(); assert.equal(component.tab, 'my'); definition.watch.tab.call(component)
  await flush(); assert.equal(component.items[0].article_cento_id, 2)
  account(null); component.checkAccount(); assert.equal(component.items.length, 0); assert.equal(component.tab, 'hot')
  definition.watch.tab.call(component); await flush(); assert.equal(component.items[0].article_cento_id, 1)
  console.log('PASS login selects private excerpts; logout clears them before public reload')

  account('a'); component.accountToken = 'a'; component.tab = 'my'
  const old = deferred(); let reads = 0
  component.$api.reader.excerpts = () => ++reads === 1 ? old.promise : Promise.resolve([row(reads + 10)])
  const loading = component.load(); account('b'); component.checkAccount(); account('a'); component.checkAccount()
  await flush(); old.resolve([row(999)]); await loading
  assert.equal(component.items[0].article_cento_id, 13); assert.equal(component.loading, false)
  component.$api.reader.excerpts = async () => { throw Object.assign(Error('登录已过期'), { status: 401 }) }
  await component.load(); assert.equal(component.items.length, 0); assert.equal(component.authExpired, true)
  console.log('PASS A → B → A cannot restore old private response; expired authorization clears rows')

  component.$api.reader.excerpts = async () => ({ msg: 'unavailable' }); await component.load()
  assert.match(component.error, /暂不可用/)
  const stale = deferred(); component.$api.reader.excerpts = () => stale.promise
  const staleLoad = component.load(); component.$api.reader.excerpts = async () => []; component.novelId = 8; definition.watch.novelId.call(component)
  stale.reject(Error('old book error')); await staleLoad
  assert.equal(component.error, ''); assert.equal(component.items.length, 0)
  console.log('PASS malformed success is a retryable failure; old book errors cannot overwrite new scope')

  component.novelId = 7; component.tab = 'my'; component.accountToken = 'a'; component.resetScope()
  let writes = 0; component.$api.reader.unhighlight = async () => { writes++ }
  const confirm = deferred(); component.$confirm = () => confirm.promise
  const removing = component.remove(row(20)); assert.equal(component.removing, 20)
  const ignored = component.remove(row(21)); await ignored
  account('b'); component.checkAccount(); confirm.resolve(); await removing
  assert.equal(writes, 0); assert.equal(component.removing, null)
  console.log('PASS a single confirmation owns deletion; changing accounts before confirmation prevents writes')

  account('a'); component.accountToken = 'a'; component.resetScope(); component.$confirm = async () => {}
  const removal = deferred(); component.$api.reader.unhighlight = () => { writes++; return removal.promise }
  let emitted = 0; component.$emit = () => emitted++
  const waiting = component.remove(row(22)); await flush()
  account('b'); component.checkAccount(); component.removing = 23
  removal.reject(Error('previous user removal failed')); await waiting
  assert.equal(component.removing, 23); assert.equal(component.error, ''); assert.equal(emitted, 0)
  definition.beforeDestroy.call(component); assert.equal(listeners.size, 0); assert.equal(component.items.length, 0)
  console.log('PASS old deletion failures cannot clear a new operation or emit changes; teardown removes listeners')

  const manga = load('pages/manga/_id.vue').default, book = { novel_id: 7, novel_type: 'manga', auther_id: 9 }
  const works = [{ ...book }, { novel_id: 8, novel_type: 'manga', is_personal: 0 }, { novel_id: '8', novel_type: 'manga', is_personal: 0 }, { novel_id: 9, novel_type: 'manga', is_personal: 1 }, { novel_id: 10, novel_type: 'novel', is_personal: 0 }, null, { novel_id: -1, novel_type: 'manga', is_personal: 0 }]
  const context = { params: { id: 7 }, $api: { reader: { book: async () => [book], chapters: async () => [], authorWorks: async id => { assert.equal(id, 9); return works } }, novels: { getNovelTags: async () => [] } }, error: error => ({ error }), redirect: url => ({ url }) }
  const data = await manga.asyncData(context)
  assert.deepEqual(plain(data.authorWorks).map(item => item.novel_id), [8]); assert.equal(data.authorWorksError, false)
  context.$api.reader.authorWorks = async () => { throw Error('outage') }
  const failure = await manga.asyncData(context); assert.equal(failure.novel.novel_id, 7); assert.equal(failure.authorWorksError, true)
  const detail = instance('pages/manga/_id.vue', { novel: book, $api: context.$api })
  detail.authorWorks = data.authorWorks; await detail.loadAuthorWorks(); assert.equal(detail.authorWorks.length, 1); assert.equal(detail.authorWorksError, true)
  const late = deferred(); context.$api.reader.authorWorks = () => late.promise
  const pending = detail.loadAuthorWorks(); detail.novel = { ...book, novel_id: 99 }; late.resolve(works); await pending
  assert.equal(detail.authorWorks[0].novel_id, 8)
  console.log('PASS author manga SSR filters private/current/duplicate/invalid works; optional outage and late retry preserve scope')

  account('expired')
  const statusError = Object.assign(Error('raw unauthorized'), { response: { status: 401 } })
  let mutations = 0, loginTarget
  const support = instance('components/read/BookSupport.vue', { book: { novel_id: 7 }, $router: { push: target => { loginTarget = target } }, $api: { reader: { niceAmount: async () => [{ nices: 6 }], niceStatus: async () => { throw statusError }, nice: async () => { mutations++ } }, reading: { getShelf: async () => { throw statusError }, addFavorite: async () => { mutations++ } } } })
  await support.load(); assert.equal(support.likes, 6); assert.equal(support.favorite, false); assert.equal(support.liked, false); assert.equal(support.authExpired, true)
  assert.match(support.error, /重新登录/); assert.doesNotMatch(support.error, /raw unauthorized/)
  await support.toggleFavorite(); await support.toggleLike(); assert.equal(mutations, 0); assert.equal(loginTarget.path, '/login'); assert.equal(loginTarget.query.redirect, '/novel/7?tab=excerpts')
  const supportDefinition = load('components/read/BookSupport.vue').default
  supportDefinition.mounted.call(support); assert(listeners.has('auth-state-changed')); supportDefinition.beforeDestroy.call(support); assert.equal(listeners.size, 0)
  console.log('PASS expired support auth preserves public likes, clears private state and routes actions to login without writes')

  account(null)
  const navigation = []
  component.$emit = (...args) => navigation.push(args)
  component.navigateExcerpt({button:0},row(1));assert.equal(navigation.length,1);assert.equal(navigation[0][0],'navigate')
  for (const event of [{button:1},{button:2},{button:0,ctrlKey:true},{button:0,metaKey:true},{button:0,shiftKey:true},{button:0,altKey:true}]) component.navigateExcerpt(event,row(1))
  assert.equal(navigation.length,1)
  const article = instance('pages/article/_id.vue', {})
  article.clearSelection = () => { article.selectionMode = false }
  article.selectionMode = article.readerSettingsVisible = article.readerNavigationVisible = article.showCommentDrawer = true
  article.openReaderExcerpts();assert.equal(article.readerExcerptsVisible,true);assert.equal(article.readerSettingsVisible,false);assert.equal(article.readerNavigationVisible,false);assert.equal(article.showCommentDrawer,false);assert.equal(article.selectionMode,false)
  console.log('PASS inline excerpt navigation closes reader drawer only on normal clicks; opening drawer clears competing menus')

  account('a')
  const highlightReads = [], messages = []
  const reader = instance('pages/article/_id.vue', {
    article: { article_id: 11, article_type: 'richtext', content: '正文' }, novel: { novel_id: 7 },
    $route: { fullPath: '/article/11', query: {} }, $message: { info: msg => messages.push(msg), error: msg => messages.push(msg) },
    $api: { reader: { highlights: () => { const request = deferred(); highlightReads.push(request); return request.promise } } }
  })
  reader.clearSelection = () => { reader.selectedParagraph = null; reader.selectionMode = false }
  reader.recordRead = () => {}; reader.fetchParagraphCommentsCount = () => {}; reader.saveReaderHistory = () => {}
  const articleDefinition = load('pages/article/_id.vue').default
  articleDefinition.mounted.call(reader); assert.equal(highlightReads.length, 1)
  assert.equal(listeners.get('auth-state-changed'), reader.checkReaderProgressAccount)
  account('b'); listeners.get('auth-state-changed')(); assert.equal(reader.highlights.length, 0)
  account('a'); listeners.get('auth-state-changed')(); assert.equal(highlightReads.length, 3)
  highlightReads[2].resolve([row(30)]); await flush()
  highlightReads[0].resolve([row(999)]); highlightReads[1].reject(Error('old account failure')); await flush()
  assert.equal(reader.highlights[0].article_cento_id, 30); assert.equal(reader.highlightError, '')
  const outage = reader.loadHighlights(); highlightReads[3].reject(Error('network')); await outage
  assert.equal(reader.highlights[0].article_cento_id, 30); assert.match(reader.highlightError, /加载失败/)
  const expired = reader.loadHighlights(); highlightReads[4].reject(Object.assign(Error('raw unauthorized'), { status: 401 })); await expired
  assert.equal(reader.highlights.length, 0); assert.equal(reader.highlightAuthExpired, true); assert.match(reader.highlightError, /重新登录/)
  reader.selectedParagraph = { id: 2, text: '正文' }; await reader.toggleHighlight(); assert.equal(messages.length, 1)
  const recovered = reader.loadHighlights(); highlightReads[5].resolve([row(31)]); await recovered
  assert.equal(reader.highlightAuthExpired, false); assert.equal(reader.highlightError, '')
  account(null); listeners.get('auth-state-changed')(); assert.equal(reader.highlights.length, 0); assert.equal(reader.selectedParagraph, null)
  console.log('PASS actual article lifecycle clears highlights on logout; A → B → A, failed reads, auth expiry and retry preserve scope')

  account('a'); reader.checkReaderProgressAccount(); highlightReads[6].resolve([]); await flush()
  const oldWrite = deferred(); reader.$api.reader.highlight = () => oldWrite.promise
  reader.selectedParagraph = { id: 2, text: 'first selection' }; const writing = reader.toggleHighlight(); assert.equal(reader.highlightBusy, true)
  account('b'); reader.checkReaderProgressAccount(); highlightReads[7].resolve([]); await flush()
  account('a'); reader.checkReaderProgressAccount(); highlightReads[8].resolve([]); await flush()
  const newWrite = deferred(); reader.$api.reader.highlight = () => newWrite.promise
  const selected = { id: 3, text: 'second selection' }; reader.selectedParagraph = selected
  const newWriting = reader.toggleHighlight(); assert.equal(reader.highlightBusy, true)
  oldWrite.reject(Error('stale write error')); await writing
  assert.equal(reader.highlightBusy, true); assert.equal(reader.selectedParagraph, selected); assert.equal(messages.length, 1)
  reader.article = { ...reader.article, article_id: 12 }; reader.initializeReaderPosition()
  reader.selectedParagraph = { id: 4, text: 'new chapter selection' }; newWrite.resolve('success'); await newWriting
  assert.equal(reader.selectedParagraph.id, 4); assert.equal(highlightReads.length, 9); assert.equal(reader.highlightBusy, false)
  const destroyed = reader.loadHighlights(); articleDefinition.beforeDestroy.call(reader)
  highlightReads[9].resolve([row(888)]); await destroyed
  assert.equal(reader.highlights.length, 0); assert.equal(listeners.size, 0)
  console.log('PASS late highlight mutations cannot close new selections, clear new busy state or refresh another chapter; teardown rejects pending reads')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
