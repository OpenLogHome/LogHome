const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const root = path.join(__dirname, '..')
function registry(env = {}, bridge, get = async () => {throw new Error('not registered')}) {
  const context = {process: {env}, window: {jsBridge: bridge}, axios: {get}}
  vm.createContext(context)
  const source = fs.readFileSync(path.join(root, 'common/miniapps.js'), 'utf8').replace(/import axios[^\n]+\n/, '').replace(/export /g, '')
  vm.runInContext(source, context)
  return context
}
test('H5 and Android choose environment independently of bundled H5 build type', () => {
  assert.equal(registry({NODE_ENV: 'development'}).getMiniappEnvironment(), 'debug')
  assert.equal(registry({NODE_ENV: 'production'}).getMiniappEnvironment(), 'production')
  assert.equal(registry({NODE_ENV: 'production'}, {inApp: true, isDebugBuild: true}).getMiniappEnvironment(), 'debug')
  assert.equal(registry({NODE_ENV: 'development'}, {inApp: true, isDebugBuild: false}).getMiniappEnvironment(), 'production')
  assert.equal(registry({VUE_APP_MINIAPP_ENV: 'debug'}, {inApp: true, isDebugBuild: false}).getMiniappEnvironment(), 'debug')
  assert.throws(() => registry({VUE_APP_MINIAPP_ENV: 'invalid'}).getMiniappEnvironment())
})
test('name, icon and environment address come from authoritative backend registration', async () => {
  let request
  const app = registry({NODE_ENV: 'development'}, undefined, async (url, options) => {
    request = {url, options}; return {data: {data: {id: 'log-defence', name: '后台新名称', icon: 'https://cdn.example/icon.png', url: 'http://192.168.1.8/game/'}}}
  })
  const result = await app.getMiniapp('log-defence', 'https://api.example')
  assert.equal(request.url, 'https://api.example/miniapps/log-defence')
  assert.equal(request.options.params.environment, 'debug')
  assert.equal(result.name, '后台新名称'); assert.equal(result.url, 'http://192.168.1.8/game/')
  assert.equal(result.icon, 'https://cdn.example/icon.png')
})
test('unknown IDs have no bundled fallback; arbitrary route URLs never fetch a ticket', async () => {
  const app = registry()
  for (const id of ['unknown', '__proto__', 'https://example.com/', undefined]) await assert.rejects(app.getMiniapp(id, 'https://api.example'))
})
test('catalog fetches server registrations and detects mismatched IDs', async () => {
  const app = registry({}, undefined, async () => ({data: {data: [{id: 'new-app', name: '新小程序'}]}}))
  assert.equal((await app.getMiniapps('https://api.example'))[0].id, 'new-app')
  await assert.rejects(app.getMiniapp('log-defence', 'https://api.example'))
})
test('lab manually maintains its entries independently of backend registrations', () => {
  const lab = fs.readFileSync(path.join(root, 'pages/apps/lab.vue'), 'utf8')
  assert.ok(lab.includes('url="./miniapp?id=log-defence"'))
  assert.ok(lab.includes("$t('me.service.labGame')"))
  assert.ok(lab.includes('static/icons/enderman.png'))
  assert.ok(!lab.includes('getMiniapps')); assert.ok(!lab.includes('暂无已注册'))
})
