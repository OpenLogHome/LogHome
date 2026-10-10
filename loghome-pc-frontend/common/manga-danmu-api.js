import axios from 'axios'
import { readingToken } from '~/plugins/api/reading'
function session(){try{return JSON.parse(window.localStorage.getItem('token'))||{}}catch(_){return{}}}
const positive=value=>Number.isSafeInteger(Number(value))&&Number(value)>0
function headers(expected=readingToken()){if(!expected)throw Error('请先登录后再操作');if(expected!==readingToken())throw Error('账号已变化，请重新操作');return{'Content-Type':'application/json',Authorization:`Bearer ${expected}`}}
export function currentDanmuUserId(){const id=session().id;return positive(id)?Number(id):null}
export function getMangaDanmuErrorMessage(error,fallback='弹幕发送失败，请稍后重试'){const data=error?.response?.data;return data?.message||data?.msg||error?.message||fallback}
function model(item,novelId,articleId){if(!item||!positive(item.danmu_id)||!positive(item.user_id)||!Number.isSafeInteger(Number(item.page_idx))||Number(item.page_idx)<0||typeof item.content!=='string'||!item.content.trim()||item.novel_id!=null&&Number(item.novel_id)!==Number(novelId)||item.article_id!=null&&Number(item.article_id)!==Number(articleId))return null;return{danmuId:Number(item.danmu_id),userId:Number(item.user_id),pageIdx:Number(item.page_idx),content:item.content,time:item.danmu_time}}
export async function fetchMangaDanmus(baseUrl,novelId,articleId){const response=await axios.get(`${baseUrl}/community/manga_danmus`,{params:{id:novelId,articleId}});if(!Array.isArray(response.data))throw Error(response.data?.msg||'弹幕数据格式无效');return response.data.map(row=>model(row,novelId,articleId)).filter(Boolean)}
export async function sendMangaDanmu(baseUrl,{novelId,articleId,pageIdx,content},token=readingToken()){
 if(!positive(novelId)||!positive(articleId)||!Number.isSafeInteger(Number(pageIdx))||Number(pageIdx)<0||typeof content!=='string'||!content.trim()||content.trim().length>100)throw Error('弹幕内容或页码无效')
 const response=await axios.post(`${baseUrl}/community/manga_danmu`,{novel_id:novelId,article_id:articleId,page_idx:pageIdx,content:content.trim()},{headers:headers(token)}),row=model(response.data,novelId,articleId)
 if(!row||row.pageIdx!==Number(pageIdx))throw Error(response.data?.msg||'服务未确认弹幕，请刷新后核对');return row
}
export async function deleteMangaDanmu(baseUrl,danmuId,token=readingToken()) {if(!positive(danmuId))throw Error('弹幕不存在');const response=await axios.get(`${baseUrl}/community/delete_manga_danmu`,{params:{id:danmuId},headers:headers(token)});if(response.data?.msg!=='success')throw Error(response.data?.msg||'删除未成功');return response.data}
