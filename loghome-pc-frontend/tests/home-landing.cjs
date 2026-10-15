// Run: node tests/home-landing.cjs. No network requests or backend writes.
const assert = require('node:assert/strict')
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm')
const babel = require('@babel/core'), compiler = require('vue-template-compiler/build.js')
const root = path.resolve(__dirname, '..'), cache = new Map()
function load(relative) {
  if (cache.has(relative)) return cache.get(relative)
  const code = babel.transformSync(fs.readFileSync(path.join(root, relative), 'utf8'), { configFile: false, babelrc: false, plugins: [require('@babel/plugin-transform-modules-commonjs')] }).code
  const exports = {}
  vm.runInNewContext(code, { exports, URL, process, console, require(name) { return load(path.posix.join(path.posix.dirname(relative), name) + '.js') } }, { filename: relative })
  cache.set(relative, exports)
  return exports
}
const landing = load('utils/home-landing.js'), discovery = load('utils/reading-discovery.js')
const book = (id, type = 'novel') => ({ novel_id: id, name: `作品${id}`, novel_type: type })
const reading = overrides => ({ getCollections: async () => [], getBooks: async () => [book(5)], getCollectionBooks: async () => [], ...overrides })
;(async () => {
  let chosen
  const curated = await landing.loadLandingWorks(reading({
    getCollections: async () => ['最近更新', '入站必读', '首页精选'].map((title, i) => ({ collection_title: title, isValid: 1, collection_id: i })),
    getCollectionBooks: async title => { chosen = title; return [book(1), book(1), book(2, 'manga'), book(3, 'world'), book(4), book(6)] }
  }))
  assert.equal(chosen, '首页精选')
  assert.equal(curated.collection, '首页精选')
  assert.equal(curated.works.map(w => w.novel_id).join(','), '1,2,3,4')
  assert.equal(discovery.workUrl(curated.works[1]), '/manga/2')
  assert.equal(discovery.workUrl(curated.works[2]), '/world/3')
  const fallback = await landing.loadLandingWorks(reading({ getCollections: async () => [{ collection_title: '入站必读', isValid: 1 }], getCollectionBooks: async () => { throw new Error('offline') } }))
  assert.equal(fallback.works[0].novel_id, 5)
  assert.equal(fallback.collection, '')
  assert.equal(fallback.error, false)
  const offline = await landing.loadLandingWorks(reading({ getCollections: async () => { throw new Error('offline') }, getBooks: async () => { throw new Error('offline') } }))
  assert.equal(offline.works.length, 0)
  assert.equal(offline.error, true)
  const empty = await landing.loadLandingWorks(reading({ getBooks: async () => [] }))
  assert.equal(empty.works.length, 0)
  assert.equal(empty.error, false)
  assert.equal(landing.publicWorks([book(1), { ...book(2), is_personal: '1' }, { ...book(3), deleted: 1 }, { ...book(4), is_banned: true }, book(0)]).length, 1)
  assert.equal(landing.landingPosts({ list: [{ post_id: 1, status: 1 }, { post_id: 1, status: 1 }, { post_id: 2, status: 0 }, { post_id: -1 }, { post_id: 3, status: '1' }] }).map(p => p.post_id).join(','), '1,3')
  assert.equal(landing.landingPosts(null).length, 0)
  assert.equal(landing.downloadInfo([{ version: '3.2', update_url: 'https://example.com/app.apk' }]).url, 'https://example.com/app.apk')
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', '//example.com/app.apk', 'https://user:secret@example.com/app.apk', 'broken']) assert.equal(landing.downloadInfo([{ update_url: url }]), null)
  assert.equal(landing.downloadInfo([]), null)
  assert.equal(landing.plainText('<p>林间&nbsp; 来信</p>'), '林间 来信')
  for (const file of ['pages/index.vue', 'pages/about/open-source.vue', 'layouts/default.vue']) {
    const parsed = compiler.parseComponent(fs.readFileSync(path.join(root, file), 'utf8'))
    assert.deepEqual(compiler.compile(parsed.template.content).errors, [], file)
    babel.transformSync(parsed.script.content, { configFile: false, babelrc: false })
  }
  console.log('Home landing: feeds, fallbacks, visibility, routes, download validation and Vue templates passed.')
})().catch(error => { console.error(error); process.exitCode = 1 })
