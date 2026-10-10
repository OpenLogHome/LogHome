const { PUBLIC_NOVEL } = require('./readingVisibility');
const invalid=(message,status=400)=>Object.assign(new Error(message),{status});
async function createReadingTip(body,userId,withTransaction){
 const novelId=Number(body.novel_id),amount=Number(body.item_amount),name=typeof body.item_name==='string'?body.item_name.trim():'',message=typeof body.message==='string'?body.message.trim():'';
 if(!Number.isSafeInteger(Number(userId))||Number(userId)<=0||!Number.isSafeInteger(novelId)||novelId<=0||!Number.isSafeInteger(amount)||amount<1||amount>9999||!name||name.length>100||message.length>50)throw invalid('打赏参数无效');
 return withTransaction(async query=>{
  const books=await query(`SELECT n.* FROM novels n WHERE n.novel_id = ? AND ${PUBLIC_NOVEL}`,[novelId]);const book=books[0];if(!book||!Number.isSafeInteger(Number(book.author_id))||Number(book.author_id)<=0)throw invalid('作品不存在或不可打赏',404);if(Number(book.author_id)===Number(userId))throw invalid('不能给自己的作品打赏',403);
  const gifts=await query('SELECT * FROM tipping_list WHERE item_name = ? LIMIT 1',[name]);const gift=gifts[0];if(!gift)throw invalid('礼物已下架，请刷新列表',409);
  const unitCost=Number(gift.item_cost),resource=Number(gift.is_log_free)===1?'apple':'log',total=unitCost*amount;
  if(!Number.isSafeInteger(unitCost)||unitCost<=0||!Number.isSafeInteger(total))throw invalid('礼物价格无效',409);
  if(body.item_cost!==undefined&&Number(body.item_cost)!==unitCost||body.resource_name!==undefined&&body.resource_name!==resource)throw invalid('礼物价格或资源已变化，请刷新后确认',409);
  const accounts=[Number(userId),Number(book.author_id)].sort((a,b)=>a-b);
  for(const id of accounts)await query('INSERT IGNORE INTO user_bank(user_id) VALUES(?)',[id]);
  const balances=await query('SELECT user_id,log,apple,cropped_log FROM user_bank WHERE user_id IN (?,?) ORDER BY user_id FOR UPDATE',accounts),payer=balances.find(row=>Number(row.user_id)===Number(userId));
  if(!payer||!Number.isFinite(Number(payer[resource]))||Number(payer[resource])<total)throw invalid(`${resource==='apple'?'苹果':'原木'}余额不足`,402);
  const charged=await query(`UPDATE user_bank SET ${resource} = ${resource} - ? WHERE user_id = ? AND ${resource} >= ?`,[total,Number(userId),total]);if(charged.affectedRows!==1)throw invalid('余额不足，未完成打赏',402);
  const record=await query('INSERT INTO tipping(from_id,novel_id,item_name,item_amount,item_cost) VALUES(?,?,?,?,?)',[Number(userId),novelId,gift.item_name,amount,unitCost]);
  const income=resource==='log'?Math.floor(total/2):0;
  if(income)await query('UPDATE user_bank SET cropped_log = cropped_log + ? WHERE user_id = ?',[income,Number(book.author_id)]);
  if(message)await query('INSERT INTO novel_fans_messages (novel_id,user_id,message) VALUES(?,?,?) ON DUPLICATE KEY UPDATE message = ?',[novelId,Number(userId),message,message]);
  return{book,gift,amount,recordId:record.insertId,total,resource,authorIncome:income,balance:Number(payer[resource])-total};
 });
}
module.exports={createReadingTip};
