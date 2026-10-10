const assert=require('node:assert/strict');
const {registerReaderActivityMessages}=require('../bin/readerActivityMessages');
const clone=x=>JSON.parse(JSON.stringify(x));
function setup(){
 const rows=Array.from({length:65},(_,i)=>({message_id:i+1,to_id:7,message_type:'activity',message_content:'通知 '+i,time:'2026-10-10T00:00:00Z',is_read:0,bg_url:'',router:'readers/bookInfo?id=43'}));
 rows.push({message_id:99,to_id:8,message_type:'activity',is_read:0},{message_id:100,to_id:7,message_type:'system',is_read:0});
 let handler,fail=false,transactions=0,depth=0;const auth=()=>{};
 const q=async(sql,p)=>{assert.equal(depth,1);if(sql.startsWith('SELECT COUNT'))return[{total:rows.filter(r=>r.to_id===p[0]&&r.message_type==='activity').length}];if(sql.startsWith('SELECT message_id')){assert(sql.includes('FOR UPDATE'));return clone(rows.filter(r=>r.to_id===p[0]&&r.message_type==='activity').sort((a,b)=>b.message_id-a.message_id).slice(p[2],p[2]+p[1]))}if(sql.startsWith('UPDATE')){assert(sql.includes("message_type = 'activity'"));rows.filter(r=>r.to_id===p[0]&&r.message_type==='activity'&&p.slice(1).includes(r.message_id)&&r.is_read===0).forEach(r=>r.is_read=1);if(fail)throw Error('isolated failure');return{affectedRows:p.length-1}}throw Error(sql)};
 registerReaderActivityMessages({get(path,...handlers){assert.equal(path,'/get_activity_messages');assert.equal(handlers[0],auth);handler=handlers.at(-1)}},{auth,withTransaction:async work=>{transactions++;const before=clone(rows);depth++;try{return await work(q)}catch(error){rows.splice(0,rows.length,...before);throw error}finally{depth--}}});
 const call=async(query={},user=[{user_id:7}])=>{const res={status(code){this.code=code;return this},json(data){this.data=data;return this}};await handler({query,user},res);return res};
 return{rows,call,setFailure:value=>fail=value,get transactions(){return transactions}};
}
async function main(){
 const s=setup();let res=await s.call({to_id:'8'});assert.equal(res.data.total,65);assert.equal(res.data.messages.length,20);assert.deepEqual(res.data.messages.map(r=>r.message_id),Array.from({length:20},(_,i)=>65-i));assert(s.rows.filter(r=>r.is_read===1).every(r=>r.to_id===7&&r.message_type==='activity'));assert.equal(s.rows.filter(r=>r.is_read===1).length,20);assert.equal(s.rows.find(r=>r.message_id===99).is_read,0);assert.equal(s.rows.find(r=>r.message_id===100).is_read,0);
 console.log('PASS registered auth, server identity, scoped activity pagination and only displayed messages become read');
 res=await s.call({page:'2',amount:'20'});assert.equal(res.data.messages[0].message_id,45);assert.equal(res.data.total,65);res=await s.call({page:'4'});assert.equal(res.data.messages.length,5);res=await s.call({page:'5'});assert.equal(res.data.messages.length,0);assert.equal(res.data.total,65);res=await s.call({},[{user_id:8}]);assert.equal(res.data.total,1);assert.equal(res.data.messages[0].message_id,99);
 console.log('PASS stable tied-date ID order, later/beyond-final pages and separate account result');
 const invalid=setup();for(const query of [{page:'0'},{page:'2.5'},{page:'1e2'},{page:['1']},{page:'10001'},{amount:'51'},{amount:'-1'},{amount:{id:20}}])assert.equal((await invalid.call(query)).code,400);assert.equal(invalid.transactions,0);assert.equal((await invalid.call({},[])).code,401);assert.equal((await invalid.call({},[{user_id:'bad'}])).code,401);assert.equal(invalid.transactions,0);
 console.log('PASS malformed/overflow pagination and absent identity rejected before SQL');
 const rollback=setup();rollback.setFailure(true);res=await rollback.call();assert.equal(res.code,503);assert.equal(rollback.rows.filter(r=>r.is_read===1).length,0);rollback.setFailure(false);res=await rollback.call();assert.equal(res.data.messages.length,20);assert.equal(rollback.rows.filter(r=>r.is_read===1).length,20);
 console.log('PASS read marking rolls back on failure and retry returns an actual successful page');
}
main().catch(e=>{console.error(e);process.exitCode=1});
