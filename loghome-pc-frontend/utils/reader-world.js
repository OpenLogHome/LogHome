import { readingCommentId } from './reader-comment-links'
export function worldImage(value) {
  if (typeof value !== 'string') return ''
  if (/^\/(?!\/)/.test(value) && !/[\\\x00-\x1f]/.test(value)) return value
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '' } catch (_) { return '' }
}
const text = value => typeof value === 'string' || typeof value === 'number' ? String(value) : ''
export function worldVocabulary(article) {
  let raw = article && article.content
  try { if (typeof raw === 'string') raw = JSON.parse(raw) } catch (_) { raw = null }
  if (!raw || Array.isArray(raw) || typeof raw !== 'object') raw = {}
  return { pic: worldImage(raw.pic), desc: text(raw.desc),
    attributes: (Array.isArray(raw.attributes) ? raw.attributes : []).filter(item => item && typeof item === 'object').map(item => ({name:text(item.name), content:text(item.content)})),
    relations: (Array.isArray(raw.relations) ? raw.relations : []).filter(item => item && Number.isSafeInteger(Number(item.id)) && Number(item.id) > 0).map(item => ({id:Number(item.id), name:text(item.name), relation:text(item.relation)})) }
}
export function worldGraph(articles = []) {
  const ids = new Set(), nodes = []
  for (const article of articles) {
    const id = Number(article.article_id)
    if (!Number.isSafeInteger(id) || id <= 0 || ids.has(id)) continue
    ids.add(id); const content = worldVocabulary(article)
    nodes.push({id, title:text(article.title) || '未命名词条', ...content, loaded:Object.prototype.hasOwnProperty.call(article,'content')})
  }
  const keys = new Set(), links = [], degrees = new Map(nodes.map(node => [node.id,0]))
  for (const node of nodes) for (const relation of node.relations) {
    if (!ids.has(relation.id)) continue
    const key = JSON.stringify([node.id,relation.id,relation.relation])
    if (keys.has(key)) continue; keys.add(key)
    links.push({key, source:node.id, target:relation.id, label:relation.relation})
    degrees.set(node.id,degrees.get(node.id)+1); if (relation.id !== node.id) degrees.set(relation.id,degrees.get(relation.id)+1)
  }
  return {nodes:nodes.map(node=>({...node,degree:degrees.get(node.id)})),links}
}
export function filterWorldNodes(nodes, {search='',kind='all'} = {}) {
  const query = String(search).trim().toLocaleLowerCase()
  return nodes.filter(node => (kind === 'all' || kind === 'connected' && node.degree > 0 || kind === 'isolated' && node.loaded && node.degree === 0 || kind === 'pictured' && !!node.pic) && (!query || [node.title,node.desc,...node.attributes.flatMap(a=>[a.name,a.content])].join('\n').toLocaleLowerCase().includes(query)))
}
export async function loadWorldVocabularies(reader, id, catalog) {
  let details
  try { details = await reader.vocabularies(id) }
  catch (failure) {
    if (failure.status !== 404) throw failure
    // Older running backends lack the batch endpoint; bounded public requests keep SSR usable.
    details = []
    for (let offset = 0; offset < catalog.length; offset += 5) {
      const rows = await Promise.all(catalog.slice(offset,offset+5).map(async word => {
        const result = await reader.article(word.article_id)
        return result && result[0]
      }))
      details.push(...rows)
    }
  }
  if (!Array.isArray(details)) throw new Error('词条数据格式无效')
  return catalog.map(word => {
    const detail = details.find(row => row && Number(row.article_id) === Number(word.article_id) && Number(row.novel_id) === Number(id) && row.article_type === 'worldVocabulary' && Number(row.is_draft) !== 1)
    if (!detail || !Object.prototype.hasOwnProperty.call(detail,'content')) throw new Error('部分词条资料无法确认，请刷新重试')
    return {...word,content:detail.content}
  })
}
export async function loadPublicWorld({params,query={},$api,error,redirect}, relations = false) {
  const id = Number(params.id)
  if (!Number.isSafeInteger(id) || id <= 0) return error({statusCode:404,message:'世界设定不存在'})
  try {
    let rows = await $api.reader.world(id)
    if (!Array.isArray(rows) || !rows.length) rows = await $api.reader.world(id,true)
    const info = rows && rows[0]
    if (!info) return error({statusCode:404,message:'世界设定不存在'})
    const books = await $api.reader.book(info.novel_id), book = books && books[0]
    if (!book || book.novel_type !== 'world') return error({statusCode:404,message:'世界设定不存在或未公开'})
    const world = {...info,...book,novel_type:'world',user_name:book.author_name || info.user_name,author_id:book.author_id || book.auther_id || info.creator_id}
    if (Number(book.novel_id) !== id) {
      const anchor = readingCommentId(query)
      return redirect(301,`/world/${relations?'relations/':''}${book.novel_id}${anchor?`?preLoadCommentId=${anchor}`:''}`)
    }
    const [articles, works] = await Promise.all([$api.reader.chapters(book.novel_id),relations?Promise.resolve([]):$api.reader.worldWorks(info.world_id).then(items=>({items})).catch(()=>({items:[],error:'关联作品加载失败，请重试'}))])
    const catalog = (articles||[]).filter(a=>a.article_type==='worldVocabulary')
    const words = catalog.length ? await loadWorldVocabularies($api.reader,book.novel_id,catalog) : []
    return {world,worldOutlines:(articles||[]).filter(a=>a.article_type==='worldOutline'),worldVocabs:words,assoNovels:relations?[]:Array.isArray(works.items)?works.items:[],associatedError:relations?'':works.error||''}
  } catch(failure) { return error({statusCode:failure.status || failure.response?.status || 503,message:'世界设定暂时无法加载，请稍后重试'}) }
}
