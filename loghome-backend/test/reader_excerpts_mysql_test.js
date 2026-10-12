// Opt-in: all writes are confined to connection-local copies of four tables.
if (process.env.READING_MYSQL_TEMP_TEST !== '1') { console.log('SKIP MySQL temporary excerpt check'); process.exit(0); }
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{createRequire}=require('node:module');
const {registerReaderExcerpts}=require('../bin/readerExcerpts');
async function main() {
  const file=require.resolve('../sql'),moduleCopy={exports:{}};
  vm.runInNewContext(fs.readFileSync(file,'utf8')+'\nmodule.exports.acquire=getConnection;module.exports.run=runQuery;module.exports.close=()=>new Promise(resolve=>pool.end(resolve));',{module:moduleCopy,exports:moduleCopy.exports,require:createRequire(file),process,console:{log(){}},__dirname:path.dirname(file)});
  const driver=moduleCopy.exports,connection=await driver.acquire(),raw=(sql,params)=>driver.run(connection,sql,params),tables=['novels','articles','article_cento','novel_comments'];
  const originalMode=(await raw('SELECT @@SESSION.sql_mode AS mode'))[0].mode;
  const routes=new Map();let failInsert=false;
  const query=async(sql,params)=>{
    for(const table of tables)sql=sql.replace(new RegExp('\\b'+table+'\\b','g'),'tmp_lh_excerpt_'+table);
    if(failInsert && sql.startsWith('INSERT')) return raw(sql.replace('paragraph)', 'missing_test_column)'),params);
    return raw(sql,params);
  };
  registerReaderExcerpts({get(path,...handlers){routes.set(path,handlers.at(-1))},post(path,...handlers){routes.set(path,handlers.at(-1))}},{auth:()=>{},query});
  const call=async(path,query={},body={},userId=7)=>{const res={status(code){this.code=code;return this},json(data){this.data=data;return this},end(data){this.data=data;return this}};await routes.get(path)({query,body,user:[{user_id:userId}]},res);return res};
  try {
    // Legacy articles have a zero-date default. Allow only this connection to clone/seed it,
    // then restore the actual session mode before exercising every application query.
    await raw('SET SESSION sql_mode = ?', [originalMode.split(',').filter(mode=>!['NO_ZERO_DATE','NO_ZERO_IN_DATE'].includes(mode)).join(',')]);
    for(const table of tables)await raw('CREATE TEMPORARY TABLE tmp_lh_excerpt_'+table+' LIKE '+table);
    await raw("INSERT INTO tmp_lh_excerpt_novels (novel_id,name,content,author_id,is_personal,is_banned,deleted) VALUES (1,'public','isolated',7,0,0,0),(2,'private','isolated',7,1,0,0),(3,'banned','isolated',7,0,1,0),(4,'deleted','isolated',7,0,0,1)");
    for(const [id,novelId,draft,deleted,type,content] of [[11,1,0,0,'richtext','first\nsecond'],[12,1,1,0,'richtext','draft'],[13,1,0,1,'richtext','deleted'],[21,2,0,0,'richtext','private'],[31,3,0,0,'richtext','banned'],[41,4,0,0,'richtext','deleted'],[14,1,0,0,'mangaPage','[]'],[15,1,0,0,'richtext','   ']]) {
      await raw('INSERT INTO tmp_lh_excerpt_articles (article_id,novel_id,title,content,article_chapter,is_draft,deleted,article_type) VALUES (?,?,?, ?,1,?,?,?)',[id,novelId,'isolated',content,draft,deleted,type]);
    }
    for(const [id,userId,articleId,paragraphId,text,deleted] of [[1,7,11,1,'first',0],[2,8,11,1,'first',0],[3,7,11,2,'second',0],[4,7,12,1,'draft',0],[5,7,13,1,'deleted',0],[6,7,21,1,'private',0],[7,7,31,1,'banned',0],[8,7,41,1,'deleted',0],[9,7,11,1,'first',1],[10,8,11,2,'second',0]]) {
      await raw('INSERT INTO tmp_lh_excerpt_article_cento (article_cento_id,user_id,article_id,paragraph_id,paragraph,is_delete) VALUES (?,?,?,?,?,?)',[id,userId,articleId,paragraphId,text,deleted]);
    }
    for(const [centoId,deleted] of [[1,0],[1,0],[2,0],[1,1],[9,0],[3,0],[0,0],[6,0]])await raw("INSERT INTO tmp_lh_excerpt_novel_comments (user_id,novel_id,content,cento_id,deleted) VALUES (7,1,'isolated',?,?)",[centoId,deleted]);
    await raw('SET SESSION sql_mode = ?', [originalMode]);
    let response=await call('/get_hot_novel_centos',{novel_id:1,limit:20});assert.equal(response.code,undefined);assert.equal(response.data.length,2);
    assert.deepEqual(response.data.map(row=>[Number(row.paragraph_id),Number(row.highlight_count),Number(row.comment_count)]),[[1,2,3],[2,2,1]]);
    for(const novelId of [2,3,4])assert.deepEqual((await call('/get_hot_novel_centos',{novel_id:novelId})).data,[]);
    console.log('PASS real MySQL aggregation/ranking excludes deleted comments/highlights, drafts and private/banned/deleted works');

    response=await call('/get_my_novel_centos',{novel_id:1});assert.deepEqual(response.data.map(row=>row.article_cento_id),[1,3]);
    response=await call('/get_my_article_cento',{article_id:11}, {},8);assert.deepEqual(response.data.map(row=>row.article_cento_id),[2,10]);
    for(const articleId of [12,13,21,31,41])assert.deepEqual((await call('/get_my_article_cento',{article_id:articleId})).data,[]);
    assert.deepEqual((await call('/get_my_novel_centos',{novel_id:2})).data,[]);
    console.log('PASS actual SQL isolates excerpt owners and keeps both private fetch scopes behind public visibility');

    response=await call('/add_article_cento',{}, {article_id:11,paragraph_id:2,paragraph:'forged',user_id:8});assert.equal(response.data,'success');
    const inserted=(await raw('SELECT user_id,paragraph_id,paragraph FROM tmp_lh_excerpt_article_cento ORDER BY article_cento_id DESC LIMIT 1'))[0];assert.deepEqual([inserted.user_id,inserted.paragraph_id,inserted.paragraph],[7,2,'second']);
    const before=Number((await raw('SELECT COUNT(*) AS n FROM tmp_lh_excerpt_article_cento'))[0].n);
    for(const articleId of [12,13,21,31,41,14,15,999])assert.equal((await call('/add_article_cento',{}, {article_id:articleId,paragraph_id:1})).code,404);
    assert.equal((await call('/add_article_cento',{}, {article_id:11,paragraph_id:99})).code,404);
    assert.equal(Number((await raw('SELECT COUNT(*) AS n FROM tmp_lh_excerpt_article_cento'))[0].n),before);
    console.log('PASS real inserts use server text and authenticated identity; forbidden/manga/blank/missing targets never insert');

    failInsert=true;assert.equal((await call('/add_article_cento',{}, {article_id:11,paragraph_id:1})).code,503);assert.equal(Number((await raw('SELECT COUNT(*) AS n FROM tmp_lh_excerpt_article_cento'))[0].n),before);
    failInsert=false;assert.equal((await call('/add_article_cento',{}, {article_id:11,paragraph_id:1})).data,'success');
    console.log('PASS actual SQL insert failure has no partial write and a normal retry preserves the legacy success contract');
  } finally {
    try { await raw('SET SESSION sql_mode = ?', [originalMode]);for(const table of tables.slice().reverse())await raw('DROP TEMPORARY TABLE IF EXISTS tmp_lh_excerpt_'+table); }
    finally { connection.release();await driver.close(); }
  }
}
main().catch(error=>{console.error('FAIL isolated temporary-table excerpt check; no original table was written');if(error.name==='AssertionError')console.error(error.message);process.exitCode=1});
