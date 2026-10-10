// Real Vue methods and API transport with isolated accounts; no backend mutations.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm')
const babel = require('@babel/core'), compiler = require('vue-template-compiler/build.js')
const root = path.resolve(__dirname, '..'), cache = new Map(), storage = new Map(), requests = []
let transport = async () => ({ data: [] })
function load(file) {
  if (cache.has(file)) return cache.get(file)
  let source = fs.readFileSync(path.join(root, file), 'utf8')
  if (file.endsWith('.json')) return JSON.parse(source)
  if (file.endsWith('.vue')) {
    const component = compiler.parseComponent(source)
    assert.deepEqual(compiler.compile(component.template.content).errors, [], file)
    source = component.script.content
  }
  const exports = {}
  vm.runInNewContext(babel.transformSync(source, { configFile: false, babelrc: false, plugins: [require('@babel/plugin-transform-modules-commonjs')] }).code, {
    exports, console, Date, URL, process: { env: { baseUrl: 'https://test.invalid' } }, URLSearchParams,
    localStorage: { getItem: key => storage.get(key) || null }, window: { addEventListener() {}, removeEventListener() {} },
    require(spec) {
      if (spec.endsWith('.vue')) return {}
      if (spec === 'axios') return { request: options => { requests.push(options); return transport(options) } }
      let target = spec.startsWith('~/') ? spec.slice(2) : path.posix.join(path.posix.dirname(file), spec)
      if (!/\.(js|json)$/.test(target)) target += '.js'
      return load(target)
    }
  }, { filename: file })
  cache.set(file, exports); return exports
}
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b }); return { promise, resolve, reject } }
const plain = value => JSON.parse(JSON.stringify(value))
const book = { novel_id: 7, name: '测试故事', novel_type: 'novel', is_complete: '0' }
const chapters = [{ article_id: 1, title: '第一章' }, { article_id: 2, article_type: 'spliter', title: '卷' }, { article_id: 3, title: '末章' }]
async function main() {
  const definition = load('pages/read/end/_id.vue').default
  const context = { params: { id: '7' }, $api: { reader: { book: async () => [book], chapters: async () => chapters }, reading: { getCollectionBooks: async () => [book, { novel_id: 8, name: '推荐漫画', novel_type: 'manga' }, { novel_id: 8 }, { novel_id: 9, novel_type: 'world' }] } }, error: x => ({ error: x }), redirect: x => ({ redirect: x }) }
  const result = await definition.asyncData(context)
  assert.equal(result.book.is_complete, false)
  assert.deepEqual(plain(result.chapters).map(x => x.article_id), [1,3])
  assert.deepEqual(plain(result.recommendations).map(x => x.novel_id), [8,9])
  context.$api.reading.getCollectionBooks = async () => { throw Error('outage') }
  assert.match((await definition.asyncData(context)).recommendationError, /失败/)
  context.$api.reader.book = async () => []
  assert.equal((await definition.asyncData(context)).error.statusCode,404)
  context.$api.reader.book = async () => { throw Error('outage') }
  assert.equal((await definition.asyncData(context)).error.statusCode,503)
  context.$api.reader.book = async () => [{ ...book, novel_type: 'manga' }]
  assert.equal((await definition.asyncData(context)).redirect,'/manga/7')
  context.params.id = 'invalid'; assert.equal((await definition.asyncData(context)).error.statusCode,404)
  console.log('PASS real server loader: numeric completion status, chapter separators, typed/deduplicated recommendations, secondary outage, 404/503 and non-novel routing')

  const routes = [], writes = [], messages = []
  let shelf = async () => []
  const page = { ...definition.data(), book, $api: { reading: { getShelf: () => shelf(), addFavorite: async id => writes.push(['add',id]), removeFavorite: async id => writes.push(['remove',id]) } }, $router: { push: route => routes.push(route) }, $route: { fullPath: '/read/end/7' }, $confirm: async () => {}, $message: { success: text => messages.push(text) } }
  for (const [key,method] of Object.entries(definition.methods)) page[key] = method.bind(page)
  await page.loadFavorite(); await page.toggleFavorite(); assert.equal(routes.at(-1).path,'/login'); assert.equal(writes.length,0)
  storage.set('token',JSON.stringify({ tk: 'account-a' })); await page.loadFavorite()
  await page.toggleFavorite(); assert.equal(page.favorite,true); assert.deepEqual(writes.at(-1),['add',7])
  page.$confirm = async () => { throw 'cancel' }; await page.toggleFavorite(); assert.equal(page.favorite,true); assert.equal(writes.length,1); assert.equal(page.favoriteBusy,false)
  page.$confirm = async () => {}; await page.toggleFavorite(); assert.equal(page.favorite,false); assert.deepEqual(writes.at(-1),['remove',7])
  page.$api.reading.addFavorite = async () => { throw Error('server rejected') }; await page.toggleFavorite(); assert.equal(page.favorite,false); assert.match(page.favoriteError,/rejected/)
  console.log('PASS guest login, actual favorite state, cancel-confirmation, removal and failure without optimistic success')

  const older = deferred(); shelf = () => older.promise
  const pending = page.loadFavorite()
  storage.set('token',JSON.stringify({ tk: 'account-b' })); shelf = async () => []; await page.loadFavorite()
  older.resolve([{ novel_id: 7 }]); await pending; assert.equal(page.favorite,false)
  shelf = async () => [{ novel_id: 7 }]; await page.loadFavorite()
  const confirm = deferred(); page.$confirm = () => confirm.promise
  const mutation = page.toggleFavorite(), before = writes.length
  storage.set('token',JSON.stringify({ tk: 'account-c' })); shelf = async () => []; await page.loadFavorite(); confirm.resolve(); await mutation
  assert.equal(writes.length,before); assert.equal(page.favorite,false); assert.equal(page.favoriteBusy,false)
  console.log('PASS late shelf responses and account changes during confirmation cannot expose or mutate the next account')

  const reading = load('plugins/api/reading.js').default
  transport = async () => { const failure = Error('denied'); failure.response = { status: 403, data: { message: '收藏被拒绝' } }; throw failure }
  await assert.rejects(reading.addFavorite(7), /收藏被拒绝/)
  assert.equal(requests.at(-1).headers.Authorization,'Bearer account-c')
  assert.deepEqual(JSON.parse(requests.at(-1).data),{ novel_id: 7 })
  storage.delete('token'); await assert.rejects(reading.addFavorite(7), /登录/)
  console.log('PASS authenticated favorite POST rejects HTTP failure and guest calls')

  const pager = load('components/read/ReaderPager.vue').default, events = [], state = { index: 3, total: 4, hasNext: false, canFinish: false, $emit: (...args) => events.push(args) }
  pager.methods.turn.call(state,1); assert.equal(events.length,0) // Draft preview stays inside its chapter.
  state.canFinish=true; pager.methods.turn.call(state,1); assert.deepEqual(events.at(-1),['finish'])
  state.navigationBlocked=true; const count=events.length; pager.methods.turn.call(state,1); assert.equal(events.length,count)
  const article = load('pages/article/_id.vue').default
  let saved=false, destination=''
  article.methods.finishReading.call({ canFinish:true, novel:book, saveReaderHistory(){saved=true}, $router:{push:path=>{destination=path}} })
  assert.equal(saved,true); assert.equal(destination,'/read/end/7')
  assert.equal(article.computed.hasNext.call({currentChapterIndex:-1,chapters}),false)
  console.log('PASS terminal page event, preview isolation, modal guard and chapter progress saved before completion navigation')

  const seo = load('utils/reading-seo.js'), head = definition.head.call({book})
  assert.equal(seo.publicReadingPath('/read/end/7'),true)
  assert.equal(head.meta.find(m=>m.name==='robots').content,'noindex,follow')
  assert.equal(head.link[0].href,'https://loghome.ink/read/end/7')
  console.log('PASS completion keeps public SSR routing and crawl links with deliberate noindex for the duplicate work summary')
  const loginReturn = load('utils/login-return.js').loginReturnPath
  assert.equal(loginReturn('/read/end/7#book-reviews'), '/read/end/7#book-reviews')
  for (const unsafe of ['https://evil.invalid', '//evil.invalid', '/\\evil.invalid', '/login', ['//evil.invalid']]) assert.equal(loginReturn(unsafe), '/')
  const login = load('pages/login.vue').default
  let returned = ''
  await login.methods.login.call({ email: 'fixture', pwd: 'fixture', $api: { users: { login: async () => {} } }, $route: { query: { redirect: '/read/end/7' } }, $router: { push: x => { returned=x } }, $message: { success() {}, error() { throw Error('unexpected login failure') } } })
  assert.equal(returned, '/read/end/7')
  console.log('PASS actual login returns to the calling reading route and rejects external/recursive destinations')
}
main().catch(error => { console.error(error); process.exitCode=1 })
