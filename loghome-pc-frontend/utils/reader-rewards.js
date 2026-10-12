export const TREE_THEMES = [{ key:'oak_island',name:'橡木小岛' },{ key:'birch_blossom',name:'白桦花林' },{ key:'snow_spruce',name:'雪地云杉' },{ key:'sakura_grove',name:'樱花树林' },{ key:'savanna_acacia',name:'草原金合欢' },{ key:'swamp_redwood',name:'沼泽红杉' }]
const number = (value, label, minimum=0) => {
  if (value == null || value === '' || !Number.isFinite(Number(value)) || Number(value)<minimum) throw new Error(`${label}加载异常，请刷新重试。`)
  return Number(value)
}
const integer = (value,label,minimum=0) => { const n=number(value,label,minimum); if(!Number.isSafeInteger(n))throw new Error(`${label}加载异常，请刷新重试。`); return n }
export function rewardBalances(raw) { const row=Array.isArray(raw)?raw[0]:raw; if(!row)throw new Error('资源余额读取失败'); return {log:integer(row.log,'原木余额'),apple:integer(row.apple,'苹果余额')} }
function tasks(rows, exp=false) {
  if (!Array.isArray(rows)) throw new Error('任务列表读取失败')
  const codes=new Set()
  return rows.map(row=>{
    if(!row || !/^[a-zA-Z0-9_-]{1,80}$/.test(row.task_code) || codes.has(row.task_code))throw new Error('任务列表数据异常')
    codes.add(row.task_code)
    return {...row,task_name:String(row.task_name||'任务'),task_desc:String(row.task_desc||''),reward:integer(exp?row.exp_reward:row.growth_reward,'任务成长值'),base:row[exp?'base_exp_reward':'base_growth_reward']==null?null:number(row[exp?'base_exp_reward':'base_growth_reward'],'基础成长值'),multiplier:row.reward_multiplier==null?1:number(row.reward_multiplier,'成长值加成',1),completed:row.status==='completed',...(exp?{completed_times:integer(row.completed_times,'已结算次数'),daily_limit:integer(row.daily_limit,'每日上限',1),progress_text:String(row.progress_text||'')}: {})}
  })
}
export function rewardTree(raw) {
  if(!Array.isArray(raw) || raw.length>1)throw new Error('树场信息读取失败')
  const row=raw[0] || {plant_id:0,tree_status:'未种植',growth_val:0,max_growth:100,is_gotten:1,tasks:[],exp_tasks:[],exp_orbs:[]}
  if(!['未种植','种植','开花','结果'].includes(row.tree_status))throw new Error('树木状态异常')
  const active=row.tree_status!=='未种植',id=integer(row.plant_id,'树木编号',active?1:0),growth=number(row.growth_val,'成长值'),maximum=number(row.max_growth,'成熟成长值',1)
  if(active && Number(row.is_gotten)!==0)throw new Error('这棵树已收获，请刷新树场')
  const ids=new Set(), orbs=(row.exp_orbs||[]).map(orb=>{const id=integer(orb.orb_id,'经验球编号',1);if(ids.has(id))throw new Error('经验球列表异常');ids.add(id);return{...orb,orb_id:id,reward:integer(orb.reward,'经验球成长值',1)}})
  return {id,active,status:row.tree_status,growth,maximum,theme:TREE_THEMES.some(theme=>theme.key===row.treeType)?row.treeType:'oak_island',tasks:tasks(row.tasks||[]),expTasks:tasks(row.exp_tasks||[],true),orbs,benefits:{name:String(row.reward_benefits&&row.reward_benefits.membership_name||'普通用户'),multiplier:row.reward_benefits?number(row.reward_benefits.multiplier,'会员加成',1):1},expEnabled:row.exp_feature_enabled===true}
}
export function rewardTaskLink(task) {
  const source=String(task.source_code || task.task_code || '')
  if(/write|chapter/.test(source))return '/write'
  if(/community|post|reply/.test(source))return '/community'
  if(/email|profile|account/.test(source))return '/me/settings'
  return '/read'
}
export function harvestReceipt(raw,id) {
  if(!raw || raw.success!==true || Number(raw.plant_id)!==id)throw new Error('收获结果未能确认，请刷新树场核对状态。')
  const balances=rewardBalances(raw.balances)
  if(raw.replayed===true) return {replayed:true,balances,rewards:null}
  if(!raw.rewards)throw new Error('收获奖励未能确认，请刷新余额。')
  return {replayed:false,balances,rewards:{log:integer(raw.rewards.log,'收获原木'),apple:integer(raw.rewards.apple,'收获苹果')}}
}
export function collectionReceipt(raw) {
  if(!raw || raw.success!==true || !['种植','开花','结果'].includes(raw.tree_status))throw new Error('经验球收集结果未确认，请刷新状态。')
  return integer(raw.total_reward??raw.reward,'收集成长值')
}
