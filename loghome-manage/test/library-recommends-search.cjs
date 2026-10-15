const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const compiler = require('vue-template-compiler')

const source = fs.readFileSync(path.resolve(__dirname, '../src/views/library/LibraryRecommendsManage.vue'), 'utf8')
const component = compiler.parseComponent(source)
const sandbox = { module: { exports: {} }, console: { error() {} } }
vm.runInNewContext(component.script.content.replace(/^import .*$/gm, '').replace('export default', 'module.exports =').replace('    ImageUploadField\n', ''), sandbox)
const page = sandbox.module.exports
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }
const result = (id, name = '我的世界') => ({ data: { data: [{ novel_id: id, name, author_name: '测试作者' }], pagination: { total: 1 } } })
function context(get) {
  const state = { ...page.data(), $baseUrl: '/api', axios: { get } }
  for (const [key, method] of Object.entries(page.methods)) state[key] = method.bind(state)
  state.openAddNovelDialog()
  return state
}

test('search renders the actual paginated API response and selects the returned novel', async () => {
  const calls = []
  const state = context(async (...args) => { calls.push(args); return result(119) })
  state.novelKeyword = ' 119 '
  await state.searchNovels()
  assert.equal(calls[0][0], '/api/manage/library/get_all_novels')
  assert.equal(calls[0][1].params.keyword, '119')
  assert.equal(state.novelSearchResults[0].novel_id, 119)
  assert.equal(state.novelSearchResults[0].author_name, '测试作者')
  state.handleNovelSelect(state.novelSearchResults[0])
  assert.equal(state.selectedNovel.novel_id, 119)
  assert.equal(state.novelSearchLoading, false)
  assert.equal(state.novelSearchError, '')
})

test('duplicate submits share one pending request and clearing invalidates the response and selection', async () => {
  const task = deferred(); let calls = 0
  const state = context(() => { calls++; return task.promise })
  state.novelKeyword = '我的世界'
  const pending = state.searchNovels()
  await state.searchNovels()
  assert.equal(calls, 1)
  assert.equal(state.novelSearchLoading, true)
  state.novelKeyword = ''
  state.resetNovelSearch()
  task.resolve(result(119))
  await pending
  assert.equal(state.novelSearchResults.length, 0)
  assert.equal(state.selectedNovel, null)
  assert.equal(state.novelSearchAttempted, false)
})

test('older responses cannot replace a newer search or leak across a reopened dialog', async () => {
  const first = deferred(), second = deferred(); let calls = 0
  const state = context(() => (++calls === 1 ? first.promise : second.promise))
  state.novelKeyword = '旧书'
  const oldRequest = state.searchNovels()
  state.novelKeyword = '新书'
  state.resetNovelSearch()
  const newRequest = state.searchNovels()
  second.resolve(result(680, '新书')); await newRequest
  first.resolve(result(119, '旧书')); await oldRequest
  assert.equal(state.novelSearchResults[0].novel_id, 680)
  const closed = deferred()
  state.axios.get = () => closed.promise
  const pending = state.searchNovels()
  state.addDialogVisible = false
  state.resetNovelSearch()
  state.openAddNovelDialog()
  closed.resolve(result(119)); await pending
  assert.equal(state.novelSearchResults.length, 0)
})

test('empty results, malformed responses and transport failures have distinct states and can retry', async () => {
  const state = context(async () => ({ data: { data: [], pagination: { total: 0 } } }))
  state.novelKeyword = '不存在的书'
  await state.searchNovels()
  assert.equal(state.novelSearchAttempted, true)
  assert.equal(state.novelSearchError, '')
  for (const get of [async () => ({ data: {} }), async () => { throw Error('offline') }]) {
    state.axios.get = get
    await state.searchNovels()
    assert.ok(state.novelSearchError)
    assert.equal(state.novelSearchLoading, false)
    assert.equal(state.selectedNovel, null)
  }
  state.axios.get = async () => result(119)
  await state.searchNovels()
  assert.equal(state.novelSearchError, '')
  assert.equal(state.novelSearchResults[0].novel_id, 119)
})

test('the search dialog template compiles', () => {
  assert.deepEqual(compiler.compile(component.template.content).errors, [])
})
