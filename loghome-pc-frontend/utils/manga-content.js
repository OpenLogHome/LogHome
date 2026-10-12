import { worldImage } from './reader-world'
export function mangaPages(content) {
  let parsed = content
  if (typeof content === 'string') { try { parsed = JSON.parse(content) } catch (_) { return [] } }
  if (!parsed || !Array.isArray(parsed.pages)) return []
  // Preserve page indices even when an asset is malformed: danmus/progress use these indices.
  return parsed.pages.map(value => {
    const page = value && typeof value === 'object' ? value : {url:value}
    const dimension = v => Number.isFinite(Number(v)) && Number(v)>0 ? Number(v) : 0
    return {...page,url:worldImage(page.url),readingUrl:worldImage(page.readingUrl || page.reader_url || page.reading_url),thumb:worldImage(page.thumb),width:dimension(page.width),height:dimension(page.height)}
  })
}
export function mangaPageSource(page, quality='standard', retry=0) {
  if (!page) return ''
  const source = quality==='original' ? page.url : page.readingUrl || page.url
  if (!source || !retry) return source || ''
  const url = new URL(source,'https://loghome.ink');url.searchParams.set('mret',String(retry))
  return source.startsWith('/') ? url.pathname+url.search+url.hash : url.href
}
export function readMangaPreferences(storage) {
  let value;try {value=JSON.parse(storage.getItem('MangaReaderSettings'))}catch(_){}
  value=value && typeof value==='object' ? value : {}
  return {mode:['strip','paged'].includes(value.mode)?value.mode:null,direction:value.direction==='rtl'?'rtl':'ltr',background:['white','warm','black'].includes(value.background)?value.background:'white',quality:value.quality==='original'?'original':'standard',danmu:value.danmu!==false}
}
export function saveMangaPreferences(storage,value) {try{storage.setItem('MangaReaderSettings',JSON.stringify(value));return true}catch(_){return false}}
export async function loadPublicManga({params,query={},$api,error,redirect}) {
  const id=Number(params.articleId)
  if (!Number.isSafeInteger(id)||id<=0) return error({statusCode:404,message:'章节不存在或不可阅读'})
  try {
    const response=await $api.reader.article(id),articleData=response&&response[0]
    if (!articleData||Number(articleData.article_id)!==id||Number(articleData.is_draft)===1) return error({statusCode:404,message:'章节不存在或不可阅读'})
    if (!['mangaPage','mangaStrip'].includes(articleData.article_type)) return redirect(`/article/${id}`)
    if (query.novelId && Number(query.novelId)!==Number(articleData.novel_id)) return error({statusCode:404,message:'话数不属于当前作品'})
    const [books,catalog]=await Promise.all([$api.reader.book(articleData.novel_id),$api.reader.chapters(articleData.novel_id)]),workInfo=books&&books[0]
    if (!workInfo||workInfo.novel_type!=='manga'||Number(workInfo.novel_id)!==Number(articleData.novel_id)) return error({statusCode:404,message:'漫画不存在或不可阅读'})
    const pages=mangaPages(articleData.content),articles=(catalog||[]).filter(a=>['mangaPage','mangaStrip'].includes(a.article_type)&&Number(a.is_draft)!==1),currentIdx=articles.findIndex(a=>Number(a.article_id)===id)
    if(currentIdx<0)return error({statusCode:404,message:'话数不在公开目录中'})
    return {articleId:id,articleData,novelId:articleData.novel_id,workInfo,novelName:workInfo.name,workAuthorId:workInfo.author_id||workInfo.auther_id,articles,currentIdx,pages,currentPage:query.edge==='end'?Math.max(0,pages.length-1):Math.min(Math.max(0,Math.floor(Number(query.pageIdx)||0)),Math.max(0,pages.length-1)),...(process.server?{mode:articleData.article_type==='mangaPage'?'paged':'strip'}:{}),loading:false,loadError:pages.length?'':'本话暂无可阅读页面',ssrReady:true}
  }catch(failure){return error({statusCode:failure.status||failure.response?.status||503,message:'漫画暂时无法加载，请稍后重试'})}
}
