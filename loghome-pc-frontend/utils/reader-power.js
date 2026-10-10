export function normalizePower(source, id) {
  if (!source || Number(source.novel_id) !== Number(id) || !['novel','manga','world'].includes(source.novel_type)) throw new Error('原木力数据格式无效')
  const data = { ...source }
  for (const key of ['clicks','nices','bookmarks','comments','tips','score','ranked_score']) {
    if (source[key] === null || source[key] === '' || !Number.isFinite(Number(source[key])) || Number(source[key]) < 0) throw new Error('原木力数据格式无效')
    data[key] = Number(source[key])
  }
  data.novel_id = Number(id)
  data.days_diff = source.days_diff === null ? null : Number(source.days_diff)
  if (data.days_diff !== null && !Number.isSafeInteger(data.days_diff)) throw new Error('原木力日期格式无效')
  return data
}
export function powerBreakdown(data) {
  const rows = [
    { key:'clicks', label:'阅读', weight:8 },
    { key:'bookmarks', label:'收藏', weight:200 },
    { key:'comments', label:'评论', weight:20 },
    { key:'nices', label:'点赞', weight:12 },
    { key:'tips', label:'打赏及其他', weight:10 }
  ].map(row => ({ ...row, amount:data[row.key], value:data[row.key] * row.weight }))
  const factorA = data.days_diff === null ? .4 : Math.max(.4, 1 + (data.days_diff + 5) * .066)
  const factorB = data.days_diff === null ? .6 : Math.max(.6, 1 + data.days_diff * .0035)
  return { rows, base:rows.reduce((sum,row)=>sum+row.value,0), factorA, factorB }
}
export function powerDate(value) {
  const date = new Date(value)
  return value && Number.isFinite(date.getTime()) ? date.toLocaleString('zh-CN',{ timeZone:'Asia/Shanghai', hour12:false }) : '暂无记录'
}
