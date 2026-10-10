const assert = require('node:assert/strict');
const { registerReaderExcerpts } = require('../bin/readerExcerpts');
function setup() {
  const routes = new Map(), calls = [], auth = () => {};
  let rows = [], failure = false;
  registerReaderExcerpts({ get(path,...handlers) { routes.set(path,handlers); }, post(path,...handlers) { routes.set(path,handlers); } }, { auth, query:async (sql,params) => { calls.push({sql,params}); if (failure) throw Error('isolated failure'); return sql.startsWith('INSERT') ? {insertId:1} : rows; } });
  const call = async (path,query={},body={},user=[{user_id:7}]) => { const res={status(code){this.code=code;return this},json(data){this.data=data;return this},end(data){this.data=data;return this}};await routes.get(path).at(-1)({query,body,user},res);return res; };
  return { routes,calls,auth,call,setRows:value=>rows=value,setFailure:value=>failure=value };
}
async function main() {
  const test = setup();
  for (const path of ['/get_my_article_cento','/get_my_novel_centos','/add_article_cento']) assert.equal(test.routes.get(path)[0],test.auth);
  assert.equal(test.routes.get('/get_hot_novel_centos').length,1);
  for (const [path,query] of [['/get_my_article_cento',{article_id:11,user_id:8}],['/get_my_novel_centos',{novel_id:1,user_id:8}],['/get_hot_novel_centos',{novel_id:1,limit:20}]]) {
    test.setRows([{article_id:11}]); assert.equal((await test.call(path,query)).data.length,1);
    const {sql,params}=test.calls.at(-1);
    for (const condition of ['a.deleted = 0','a.is_draft = 0','n.deleted = 0','n.is_personal = 0','n.is_banned = 0']) assert(sql.includes(condition));
    if (path!== '/get_hot_novel_centos') assert.equal(params[1],7);
  }
  const hot=test.calls.at(-1);assert(hot.sql.includes('GROUP BY cento_id'));assert.deepEqual(hot.params,[1,20]);
  console.log('PASS registered auth/server identity, shared public scope and aggregated comment query');

  const before=test.calls.length;
  for (const value of [0,-1,'1.5','1e2',['1'],{},'9007199254740992']) {
    assert.equal((await test.call('/get_hot_novel_centos',{novel_id:value})).code,400);
    assert.equal((await test.call('/get_my_article_cento',{article_id:value})).code,400);
    assert.equal((await test.call('/get_my_novel_centos',{novel_id:value})).code,400);
    assert.equal((await test.call('/add_article_cento',{}, {article_id:11,paragraph_id:value})).code,400);
  }
  assert.equal((await test.call('/get_hot_novel_centos',{novel_id:1,limit:51})).code,400);
  assert.equal((await test.call('/get_my_novel_centos',{novel_id:1},{},[])).code,401);
  assert.equal((await test.call('/add_article_cento',{},null)).code,400);
  assert.equal(test.calls.length,before);
  console.log('PASS malformed scope/limits/identity rejected before any SQL');

  test.setRows([{content:JSON.stringify({content:[{paragraph_id:'2',value:['actual',' paragraph']},{type:'image',img:'image'}]}),article_type:'richtext'}]);
  let res=await test.call('/add_article_cento',{}, {article_id:11,paragraph_id:2,user_id:8,paragraph:'forged'});
  assert.equal(res.data,'success');assert.deepEqual(test.calls.at(-1).params,[7,11,2,'actual paragraph']);
  test.setRows([]);const writes=test.calls.filter(call=>call.sql.startsWith('INSERT')).length;
  assert.equal((await test.call('/add_article_cento',{}, {article_id:11,paragraph_id:2})).code,404);
  for (const article of [{content:'one\ntwo',article_type:'text'},{content:'[]',article_type:'mangaPage'},{content:'   ',article_type:'text'}]) {
    test.setRows([article]);assert.equal((await test.call('/add_article_cento',{}, {article_id:11,paragraph_id:99})).code,404);
  }
  assert.equal(test.calls.filter(call=>call.sql.startsWith('INSERT')).length,writes);
  console.log('PASS highlights store only actual server paragraphs; unavailable/manga/missing/blank targets cannot write');

  test.setFailure(true);
  for (const [path,query,body] of [['/get_hot_novel_centos',{novel_id:1}],['/get_my_article_cento',{article_id:11}],['/get_my_novel_centos',{novel_id:1}],['/add_article_cento',{}, {article_id:11,paragraph_id:2}]]) assert.equal((await test.call(path,query,body)).code,503);
  test.setFailure(false);test.setRows([]);assert.deepEqual((await test.call('/get_hot_novel_centos',{novel_id:1})).data,[]);
  console.log('PASS service failures are retryable and actual empty lists retain the mobile array contract');
}
main().catch(error=>{console.error(error);process.exitCode=1});
