const test = require('node:test');
const assert = require('node:assert/strict');
const {createServer} = require('../server/index.cjs');
test('serves the complete app under a custom prefix and rejects missing/private paths', async t => {
  const server = createServer({basePath:'/tools/cover', parentOrigins:['https://m.loghome.ink']});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = p => fetch(base + p);
  const redirect = await fetch(base + '/tools/cover', {redirect:'manual'});
  assert.equal(redirect.status, 308);
  const home = await get('/tools/cover/');
  assert.match(await home.text(), /帖子封面生成器/);
  for (const file of ['bridge.js', 'app.js', 'loghome.css']) {
    const response = await get('/tools/cover/' + file);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), file.endsWith('.css') ? /text\/css/ : /javascript/);
  }
  assert.deepEqual(await (await get('/tools/cover/api/health')).json(), {ok:true, id:'log-post-cover'});
  assert.match(await (await get('/tools/cover/config.js')).text(), /https:\/\/m.loghome.ink/);
  for (const p of ['/other/', '/tools/cover/missing.js', '/tools/cover/.env', '/tools/cover/%2e%2e%2fpackage.json', '/tools/cover/%00']) {
    assert.equal((await get(p)).status, 404, p);
  }
  assert.equal((await get('/tools/cover/%GG')).status, 400);
  assert.equal((await fetch(base + '/tools/cover/', {method:'POST'})).status, 405);
});
