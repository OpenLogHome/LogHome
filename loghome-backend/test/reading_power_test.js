const assert = require('node:assert/strict');
const { createLogPowerReader } = require('../bin/readingLogPower');
const calls = []; let rows = [], fail = false;
const handler = createLogPowerReader({ query:async(sql,params)=>{calls.push({sql,params});if(fail)throw Error('database');return rows} });
async function invoke(id){const res={statusCode:200,status(code){this.statusCode=code;return this},json(data){this.data=data;return this}};await handler({query:{id}},res);return res}
async function main(){
 for(const id of ['invalid','1 OR 1=1',-1,0,1.5,Number.MAX_SAFE_INTEGER+1])assert.equal((await invoke(id)).statusCode,404);
 assert.equal(calls.length,0);assert.equal((await invoke(43)).statusCode,404);
 rows=[{novel_id:43,name:'Public',days_diff:-2,clicks:10,bookmarks:2,nices:3,comments:4,tips:5,score:700,ranked_score:680}];
 const result=await invoke('43');assert.equal(result.statusCode,200);assert.deepEqual(result.data,rows[0]);
 const {sql,params}=calls.at(-1);assert.deepEqual(params,[43]);assert.match(sql,/n.deleted = 0 AND n.is_personal = 0 AND n.is_banned = 0/);assert.match(sql,/deleted=0\) AS comments/);assert.match(sql,/SUM\(item_amount\*item_cost\)/);assert.match(sql,/DATEDIFF/);assert.match(sql,/ROUND\(/);assert.match(sql,/generated_at/);assert(!/UPDATE |INSERT |DELETE FROM/i.test(sql));
 console.log('PASS public parameterized single-query breakdown, canonical ranking formula, server date and no rank/snapshot writes');
 fail=true;assert.equal((await invoke(43)).statusCode,503);console.log('PASS missing/invalid work is HTTP 404 and database outage is HTTP 503');
}
main().catch(e=>{console.error(e);process.exitCode=1});
