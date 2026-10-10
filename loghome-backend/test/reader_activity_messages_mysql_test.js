// Opt-in: only a connection-local clone of user_message receives writes.
if(process.env.READING_MYSQL_TEMP_TEST!=='1'){console.log('SKIP MySQL temporary activity inbox check');process.exit(0)}
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{createRequire}=require('node:module');
const {registerReaderActivityMessages}=require('../bin/readerActivityMessages');
async function main(){
 const file=require.resolve('../sql'),module={exports:{}};
 vm.runInNewContext(fs.readFileSync(file,'utf8')+'\nmodule.exports.acquire=getConnection;module.exports.run=runQuery;module.exports.close=()=>new Promise(resolve=>pool.end(resolve));',{module,exports:module.exports,require:createRequire(file),process,console:{log(){}},__dirname:path.dirname(file)});
 const driver=module.exports,connection=await driver.acquire(),raw=(s,p)=>driver.run(connection,s,p);let fail=false,handler;
 const q=async(s,p)=>{const result=await raw(s.replace(/\buser_message\b/g,'tmp_lh_reader_activity_message'),p);if(fail&&s.startsWith('UPDATE'))throw Error('isolated failure');return result};
 const transaction=async work=>{await raw('START TRANSACTION');try{const result=await work(q);await raw('COMMIT');return result}catch(e){await raw('ROLLBACK');throw e}};
 registerReaderActivityMessages({get(_,...handlers){handler=handlers.at(-1)}},{auth:()=>{},withTransaction:transaction});
 const call=async(query={})=>{const res={status(code){this.code=code;return this},json(data){this.data=data;return this}};await handler({user:[{user_id:7}],query},res);return res};
 try{
  await raw('CREATE TEMPORARY TABLE tmp_lh_reader_activity_message LIKE user_message');
  for(let i=0;i<23;i++)await raw("INSERT INTO tmp_lh_reader_activity_message (from_id,to_id,message_type,message_content,is_read,time) VALUES (7,7,'activity','隔离测试通知',0,'2026-10-10 12:00:00')");
  await raw("INSERT INTO tmp_lh_reader_activity_message (from_id,to_id,message_type,message_content,is_read) VALUES (7,8,'activity','其他隔离账号',0),(7,7,'system','隔离系统消息',0)");
  let res=await call();assert.equal(res.code,undefined);assert.equal(res.data.total,23);assert.equal(res.data.messages.length,20);assert.equal(res.data.messages[0].message_id,23);assert.equal(Number((await raw('SELECT COUNT(*) AS n FROM tmp_lh_reader_activity_message WHERE is_read=1'))[0].n),20);
  console.log('PASS real MySQL activity COUNT/order/LIMIT/OFFSET/FOR UPDATE and exactly displayed rows marked read in a temporary table');
  fail=true;res=await call({page:'2'});assert.equal(res.code,503);assert.equal(Number((await raw('SELECT COUNT(*) AS n FROM tmp_lh_reader_activity_message WHERE is_read=1'))[0].n),20);fail=false;res=await call({page:'2'});assert.equal(res.data.messages.length,3);assert.equal(Number((await raw('SELECT COUNT(*) AS n FROM tmp_lh_reader_activity_message WHERE is_read=1'))[0].n),23);
  const other=await raw("SELECT is_read FROM tmp_lh_reader_activity_message WHERE to_id=8 OR message_type='system'");assert(other.every(r=>r.is_read===0));console.log('PASS real MySQL rollback/retry and isolation of another recipient plus unrelated system messages');
 }finally{try{await raw('DROP TEMPORARY TABLE IF EXISTS tmp_lh_reader_activity_message')}finally{connection.release();await driver.close()}}
}
main().catch(e=>{console.error('FAIL temporary-table activity check; no real account table was written');if(e.name==='AssertionError')console.error(e.message);process.exitCode=1});
