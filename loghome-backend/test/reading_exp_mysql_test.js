// Opt-in integration check. Only connection-local TEMPORARY tables are written;
// every application query is redirected to those tables. No real accounts used.
if(process.env.READING_MYSQL_TEMP_TEST!=='1'){console.log('SKIP MySQL temporary-table check (set READING_MYSQL_TEMP_TEST=1)');process.exit(0)}
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{createRequire}=require('node:module');
const {createReaderTreeOperations}=require('../bin/readerTreeOperations');
async function main(){
 const sqlFile=require.resolve('../sql'),sqlModule={exports:{}};
 vm.runInNewContext(fs.readFileSync(sqlFile,'utf8')+'\nmodule.exports.testAcquire=getConnection;module.exports.testQuery=runQuery;module.exports.testClose=()=>new Promise(resolve=>pool.end(resolve));',{module:sqlModule,exports:sqlModule.exports,require:createRequire(sqlFile),process,console:{log(){}},__dirname:path.dirname(sqlFile)});
 const driver=sqlModule.exports,connection=await driver.testAcquire(),tables=['user_bank','treeplant','tree_exp_tasks','tree_exp_settings','user_tree_exp_task_daily','tree_exp_orbs','user_metric_daily','membership_subscriptions'];
 const raw=(sql,p)=>driver.testQuery(connection,sql,p),mapped=sql=>sql.replace(/\b(user_bank|treeplant|tree_exp_tasks|tree_exp_settings|user_tree_exp_task_daily|tree_exp_orbs|user_metric_daily|membership_subscriptions)\b/g,name=>'tmp_lh_read_'+name);
 const q=async(sql,p)=>{if(sql.includes('FROM achievement_definitions'))return[];return raw(mapped(sql),p)};
 const tx=async work=>{await raw('START TRANSACTION');try{const result=await work(q);await raw('COMMIT');return result}catch(error){await raw('ROLLBACK');throw error}};
 try{
  for(const name of tables)await raw('CREATE TEMPORARY TABLE tmp_lh_read_'+name+' LIKE '+name);
  await q('INSERT INTO user_bank (user_id) VALUES (?)',[7]);
  await q("INSERT INTO treeplant (treeType,user_id,tree_status,growth_val) VALUES ('oak_island',7,'开花',96)");
  const tree=(await q('SELECT * FROM treeplant WHERE user_id = ?',[7]))[0];
  await q("INSERT INTO tree_exp_tasks (task_code,task_name,source_code,required_value,daily_limit,exp_reward) VALUES ('exp_read_time','阅读累计','read_seconds',600,3,6)");
  const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  await q('INSERT INTO user_tree_exp_task_daily (user_id,task_code,date_key,progress_value,completed_times) VALUES (?,?,?,?,?)',[7,'exp_read_time',day,570,0]);
  const achievementModule={exports:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../bin/achievements'),'utf8'),{module:achievementModule,exports:achievementModule.exports,console:{log(){}},Date,Intl,require:()=>({query:q})});
  const routes=new Map(),router={get:(p,...h)=>routes.set('get '+p,h.at(-1)),post:(p,...h)=>routes.set('post '+p,h.at(-1))},module={exports:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../routes/treePlant'),'utf8'),{module,exports:module.exports,console:{log(){}},Date,Math,Intl,require(name){if(name==='express')return{Router:()=>router};if(name==='node:crypto')return require(name);if(name.endsWith('sql.js'))return{query:q,withTransaction:tx};if(name.includes('readerTreeOperations'))return{createReaderTreeOperations};if(name.includes('achievements'))return achievementModule.exports;return{}}});
  const report=async(id,seconds=30)=>{const response={status(code){this.code=code;return this},json(value){this.data=value;return this}};await routes.get('post /report_exp_activity')({user:[{user_id:7}],body:{activity_type:'read_seconds',seconds,client_request_id:id}},response);return response};
  let response=await report('read-mysql-isolated-first');assert.equal(response.code,undefined);assert.equal(response.data.total_reward,6);assert.equal(response.data.accepted_seconds,30);
  let progress=(await q('SELECT * FROM user_tree_exp_task_daily WHERE user_id=? AND task_code=?',[7,'exp_read_time']))[0];assert.equal(Number(progress.progress_value),600);assert.equal(progress.completed_times,1);assert.equal((await q('SELECT growth_val FROM treeplant WHERE plant_id=?',[tree.plant_id]))[0].growth_val,102);assert.equal(Number((await q('SELECT read_seconds FROM user_metric_daily WHERE user_id=?',[7]))[0].read_seconds),30);
  response=await report('read-mysql-isolated-first');assert.equal(response.data.replayed,true);assert.equal(response.data.total_reward,0);assert.equal((await report('read-mysql-isolated-first',31)).code,409);console.log('PASS real MySQL task/metric/growth/receipt SQL, DATE unique key, lost-response replay and changed-parameter rejection in temporary tables');
  // Inject failure after the real growth update: receipt insert must roll back
  // duration, task completion and metric changes on this same real connection.
  await q('UPDATE user_tree_exp_task_daily SET progress_value=1170 WHERE user_id=? AND task_code=?',[7,'exp_read_time']);
  const original=driver.testQuery;driver.testQuery=async(conn,sql,p)=>{if(sql.includes('INSERT INTO tmp_lh_read_user_tree_exp_task_daily')&&p&&String(p[1]).startsWith('__read_receipt_'))throw Error('isolated receipt failure');return original(conn,sql,p)};
  response=await report('read-mysql-isolated-rollback');assert.equal(response.code,503);driver.testQuery=original;
  progress=(await q('SELECT * FROM user_tree_exp_task_daily WHERE user_id=? AND task_code=?',[7,'exp_read_time']))[0];assert.equal(Number(progress.progress_value),1170);assert.equal(progress.completed_times,1);assert.equal((await q('SELECT growth_val FROM treeplant WHERE plant_id=?',[tree.plant_id]))[0].growth_val,102);assert.equal(Number((await q('SELECT read_seconds FROM user_metric_daily WHERE user_id=?',[7]))[0].read_seconds),30);assert.equal((await report('read-mysql-isolated-rollback')).data.total_reward,6);console.log('PASS real InnoDB rollback of all duration/metric/task/growth writes after receipt failure, then exactly one retry award');
  // The shared harvest SQL also stays inside temporary tables.
  const initialBank=(await q('SELECT log,apple FROM user_bank WHERE user_id=?',[7]))[0];const harvestRes={status(code){this.code=code;return this},json(value){this.data=value;return this}};await routes.get('post /reader_harvest')({user:[{user_id:7}],body:{plant_id:tree.plant_id},query:{}},harvestRes);assert.equal(harvestRes.data.success,true);assert.equal(harvestRes.data.rewards.log,5);const bank=(await q('SELECT log,apple FROM user_bank WHERE user_id=?',[7]))[0];assert.equal(Number(bank.log),Number(initialBank.log)+5);await routes.get('post /reader_harvest')({user:[{user_id:7}],body:{plant_id:tree.plant_id},query:{}},harvestRes);assert.equal(harvestRes.data.replayed,true);assert.equal(Number((await q('SELECT log FROM user_bank WHERE user_id=?',[7]))[0].log),Number(initialBank.log)+5);console.log('PASS real MySQL harvest locks/credit/replay against the same isolated temporary tree and bank');
 }finally{
  for(const name of tables.map(name=>'tmp_lh_read_'+name)){try{await raw('DROP TEMPORARY TABLE IF EXISTS '+name)}catch{}}
  connection.release();await driver.testClose();
 }
}
main().catch(error=>{console.error('FAIL MySQL temporary-table check; real account tables were not written');if(error.name==='AssertionError')console.error(error.message);process.exitCode=1});
