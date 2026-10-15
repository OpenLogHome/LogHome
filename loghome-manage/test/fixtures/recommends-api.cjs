// Local browser QA only: fake login and an in-memory book catalog, no database or live proxy.
// All business writes are rejected. The real read-only backend search handler is exercised.
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const books = [{ novel_id: 119, name: '我的世界', content: '搜索验收用书籍', author_name: '测试作者' }]
const source = fs.readFileSync(path.resolve(__dirname, '../../..', 'loghome-backend/routes/manage/library.js'), 'utf8')
const start = source.indexOf("router.get('/get_all_novels'")
const end = source.indexOf("router.get('/get_novel_articles'", start)
let searchHandler
vm.runInNewContext(source.slice(start, end), {
  auth() {}, console,
  router: { get(url, auth, handler) { searchHandler = handler } },
  query: async (sql, args) => {
    const keyword = args.find(value => typeof value === 'string' && value.startsWith('%'))
    const text = keyword ? keyword.slice(1, -1) : ''
    const rows = books.filter(book => !text || book.novel_id === args[0] || book.name.includes(text) || book.content.includes(text))
    return sql.startsWith('SELECT COUNT') ? [{ total: rows.length }] : rows.slice(args.at(-2), args.at(-2) + args.at(-1))
  }
})
http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Content-Type', 'application/json')
  if (req.method === 'OPTIONS') return res.end()
  const url = new URL(req.url, 'http://localhost')
  const send = body => res.end(JSON.stringify(body))
  if (req.method === 'POST' && url.pathname === '/users/login') return send({ token: { tk: 'manage-search-fixture-only' } })
  if (req.method !== 'GET') { res.statusCode = 405; return send({ msg: 'Business writes are disabled in browser QA' }) }
  if (url.pathname === '/users/userprofile') return send({ user_id: 900001, name: '搜索验收', avatar_url: '' })
  if (url.pathname === '/manage/library-recommends/titles') return send([{ title: '入站必读', cnt: 1 }])
  if (url.pathname === '/manage/library-recommends/collections') return send([])
  if (url.pathname === '/manage/library-recommends') return send([{ recommend_id: 1, novel_id: 119, novel_name: '我的世界', ranking: 0 }])
  if (url.pathname === '/manage/library/get_all_novels') {
    if (url.searchParams.get('keyword') === '接口失败') { res.statusCode = 503; return send({ msg: 'Synthetic failure' }) }
    return searchHandler({ query: Object.fromEntries(url.searchParams) }, { json: send })
  }
  send({})
}).listen(9115, '127.0.0.1', () => console.log('Read-only management search fixture at http://127.0.0.1:9115'))
