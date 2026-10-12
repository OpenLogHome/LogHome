// Public manga scope uses the same book/chapter visibility as SSR readers.
const express=require('express'),{query}=require('../sql.js'),auth=require('../bin/auth.js'),{PUBLIC_ARTICLE}=require('../bin/readingVisibility');
const router=express.Router(),positive=v=>Number.isSafeInteger(Number(v))&&Number(v)>0;
const failure=(message,status=400)=>Object.assign(Error(message),{status});
async function scope(novelId,articleId,pageIdx){
 if(!positive(novelId)||!positive(articleId))throw failure('漫画或话数不存在',404);
 const rows=await query(`SELECT a.article_id,a.content FROM articles a JOIN novels n ON n.novel_id=a.novel_id WHERE a.article_id=? AND a.novel_id=? AND n.novel_type='manga' AND a.article_type IN ('mangaPage','mangaStrip') AND ${PUBLIC_ARTICLE}`,[Number(articleId),Number(novelId)]);
 if(!rows.length)throw failure('漫画或话数不存在或未公开',404);
 let content=rows[0].content;try{if(typeof content==='string')content=JSON.parse(content)}catch(_){content=null}
 const count=content&&Array.isArray(content.pages)?content.pages.length:0;
 if(pageIdx!==undefined&&(!Number.isSafeInteger(Number(pageIdx))||Number(pageIdx)<0||Number(pageIdx)>=count))throw failure('弹幕页码无效');return count;
}
const respond=(res,error)=>res.status(error.status||503).json({msg:error.status?error.message:'弹幕服务暂时不可用'});
router.post('/manga_danmu',auth,async(req,res)=>{
 const content=typeof req.body.content==='string'?req.body.content.trim():'';
 if(!content||content.length>100)return res.status(400).json({msg:'弹幕须为 1–100 字'});
 try{
  await scope(req.body.novel_id,req.body.article_id,req.body.page_idx);
  if(req.body.page_idx===undefined)throw failure('弹幕页码无效');
  const user=req.user[0],result=await query('INSERT INTO manga_danmus(user_id,novel_id,article_id,page_idx,content) VALUES(?,?,?,?,?)',[Number(user.user_id),Number(req.body.novel_id),Number(req.body.article_id),Number(req.body.page_idx),content]);
  // No second read after commit: a lookup outage must not misreport an inserted danmu.
  res.json({danmu_id:result.insertId,user_id:Number(user.user_id),novel_id:Number(req.body.novel_id),article_id:Number(req.body.article_id),page_idx:Number(req.body.page_idx),content,danmu_time:new Date().toISOString()});
 }catch(error){respond(res,error)}
});
router.get('/manga_danmus',async(req,res)=>{
 try{
  const count=await scope(req.query.id,req.query.articleId,req.query.pageIdx),params=[Number(req.query.id),Number(req.query.articleId),count];let condition='d.novel_id=? AND d.article_id=? AND d.deleted=0 AND d.page_idx>=0 AND d.page_idx<?';
  if(req.query.pageIdx!==undefined){condition+=' AND d.page_idx=?';params.push(Number(req.query.pageIdx))}
  const rows=await query(`SELECT d.danmu_id,d.user_id,d.novel_id,d.article_id,d.page_idx,d.content,d.danmu_time,u.name FROM manga_danmus d JOIN users u ON u.user_id=d.user_id WHERE ${condition} ORDER BY d.danmu_id`,params);res.json(rows);
 }catch(error){respond(res,error)}
});
// Keep author/owner deletion available even after publication changes; soft deletion only.
router.get('/delete_manga_danmu',auth,async(req,res)=>{
 if(!positive(req.query.id))return res.status(404).json({msg:'弹幕不存在'});
 try{
  const rows=await query('SELECT d.user_id,n.author_id FROM manga_danmus d JOIN novels n ON n.novel_id=d.novel_id WHERE d.danmu_id=? AND d.deleted=0',[Number(req.query.id)]),row=rows[0],user=req.user[0];
  if(!row)return res.status(404).json({msg:'弹幕不存在'});
  if(![row.user_id,row.author_id].some(id=>Number(id)===Number(user.user_id)))return res.status(403).json({msg:'没有权限删除这条弹幕'});
  const result=await query('UPDATE manga_danmus SET deleted=1 WHERE danmu_id=? AND deleted=0',[Number(req.query.id)]);if(result.affectedRows!==1)return res.status(404).json({msg:'弹幕已删除'});res.json({msg:'success'});
 }catch(error){respond(res,error)}
});
module.exports=router;
