<template>
  <main class="power-page">
    <nav aria-label="阅读导航"><nuxt-link to="/read">书库</nuxt-link><span>/</span><nuxt-link :to="workUrl(power)">{{ power.name }}</nuxt-link><span>/</span><span>原木力说明</span></nav>
    <header class="power-heading"><div><p>{{ power.name }}</p><h1><LogPowerWordmark /> · 分项说明</h1></div><nuxt-link to="/read/rank?board=logpower">查看原木力榜 →</nuxt-link></header>
    <section class="power-summary"><div><span>按当前数据计算</span><strong>{{ format(power.score) }}</strong></div><div><span>当前榜单分值</span><strong>{{ format(power.ranked_score) }}</strong></div><p>数据时间：{{ powerDate(power.generated_at) }}（北京时间）<br>榜单按批次更新，与当前数据计算结果可能略有差异。</p></section>
    <div class="power-grid">
      <section class="power-card"><h2>基础分计算</h2><table><thead><tr><th scope="col">互动</th><th scope="col">累计数据</th><th scope="col">权重</th><th scope="col">贡献分值</th></tr></thead><tbody><tr v-for="row in breakdown.rows" :key="row.key"><th scope="row">{{ row.label }}</th><td>{{ format(row.amount) }}</td><td>× {{ row.weight }}</td><td>{{ format(row.value) }}</td></tr></tbody><tfoot><tr><th colspan="3" scope="row">基础分总计</th><td>{{ format(breakdown.base) }}</td></tr></tfoot></table><p class="power-note">阅读、收藏、点赞和未删除的作品评论按服务端累计；打赏按礼物数量 × 单价累计，再乘权重。</p></section>
      <section class="power-card"><h2>更新频率修正</h2><dl><div><dt>最近更新</dt><dd>{{ powerDate(power.update_time) }}</dd></div><div><dt>与计算日期相差</dt><dd>{{ daysLabel }}</dd></div></dl><div class="factor"><div><span>修正系数 A</span><strong>{{ breakdown.factorA.toFixed(4) }}</strong></div><p>max(0.4, 1 + (相差天数 + 5) × 0.066)</p><small v-if="breakdown.factorA === .4">已达到下限 0.4</small></div><div class="factor"><div><span>修正系数 B</span><strong>{{ breakdown.factorB.toFixed(4) }}</strong></div><p>max(0.6, 1 + 相差天数 × 0.0035)</p><small v-if="breakdown.factorB === .6">已达到下限 0.6</small></div><p class="power-note">相差天数 = 更新日期 − 计算日期，按服务端北京时间的日期计算，更新越久，修正系数越低。</p></section>
    </div>
    <section class="power-final"><h2>最终计算</h2><p>{{ format(breakdown.base) }} × {{ breakdown.factorA.toFixed(4) }} × {{ breakdown.factorB.toFixed(4) }} ≈ <strong>{{ format(power.score) }}</strong></p><span>原木力反映作品阅读、互动及更新情况。</span><nuxt-link :to="workUrl(power)">返回作品详情 →</nuxt-link></section>
  </main>
</template>
<script>
import LogPowerWordmark from '~/components/LogPowerWordmark.vue'
import { normalizePower, powerBreakdown, powerDate } from '~/utils/reader-power'
import { workUrl } from '~/utils/reading-discovery'
import { readingHead } from '~/utils/reading-seo'
export default {
  components:{ LogPowerWordmark },
  async asyncData({params,$api,error}) {
    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id <= 0) return error({statusCode:404,message:'作品不存在'})
    try { return { power:normalizePower(await $api.reader.power(id),id) } }
    catch (failure) { return error({statusCode:failure.status===404?404:503,message:failure.status===404?'作品不存在或未公开':'原木力数据暂时不可用，请稍后重试'}) }
  },
  data:()=>({power:{}}),
  computed:{ breakdown(){return powerBreakdown(this.power)}, daysLabel(){const days=this.power.days_diff;return days===null?'暂无记录':days===0?'今天':`${Math.abs(days)} 天${days>0?'后':'前'}`} },
  head(){return readingHead({title:`${this.power.name} - 原木力说明 - 原木社区`,description:`查看《${this.power.name}》的阅读、收藏、评论、点赞与打赏贡献，以及更新时间修正公式。`,path:`/read/power/${this.power.novel_id}`,image:this.power.picUrl})},
  methods:{workUrl,powerDate,format(value){return Number(value||0).toLocaleString('zh-CN',{maximumFractionDigits:2})}}
}
</script>
<style scoped>
.power-page{max-width:1180px;margin:32px auto 80px;padding:0 24px;color:#514535}.power-page nav{display:flex;gap:12px;font-size:12px;margin-bottom:30px;color:#998d80}.power-page a{color:#80684e;text-decoration:none}.power-heading{display:flex;align-items:center;justify-content:space-between;gap:24px}.power-heading p{font-size:13px;color:#998d80;margin:0 0 10px}.power-heading h1{display:flex;align-items:center;gap:8px;font-size:26px;margin:0}.power-heading>a{font-size:13px}.power-summary{display:flex;align-items:center;gap:48px;margin:28px 0;padding:24px 28px;border:1px solid #e5ddcf;background:#fffdf9;border-radius:12px}.power-summary span{font-size:12px;color:#998d80}.power-summary strong{display:block;margin-top:8px;font-size:30px;font-variant-numeric:tabular-nums;color:#947358}.power-summary p{margin:0 0 0 auto;font-size:12px;line-height:1.9;color:#998d80}.power-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:24px}.power-card{background:#fff;border:1px solid #e5ddcf;border-radius:12px;padding:26px}.power-card h2,.power-final h2{font-size:17px;margin:0 0 24px}.power-card table{width:100%;border-collapse:collapse;font-size:13px}.power-card th{font-weight:500}.power-card th,.power-card td{padding:14px 6px;border-bottom:1px solid #eee8df;text-align:right;font-variant-numeric:tabular-nums}.power-card th:first-child{text-align:left}.power-card thead{font-size:12px;color:#998d80}.power-card tfoot{font-weight:600;color:#80684e}.power-note{font-size:12px;line-height:1.9;color:#998d80;margin:20px 0 0}.power-card dl{font-size:12px;margin:0 0 24px}.power-card dl>div{display:flex;justify-content:space-between;margin:12px 0;gap:20px}.power-card dd{margin:0;text-align:right}.factor{padding:14px 18px;background:#f7f5f0;border-radius:8px;margin:12px 0;font-size:13px}.factor>div{display:flex;justify-content:space-between}.factor p{font-size:12px;color:#998d80;margin:12px 0 0;line-height:1.7}.factor small{display:block;color:#947358;margin-top:8px}.power-final{margin-top:24px;border:1px solid #e5ddcf;border-radius:12px;padding:26px;background:#fffdf9}.power-final h2{margin-bottom:16px}.power-final p{font-size:20px;margin:0 0 16px;font-variant-numeric:tabular-nums}.power-final span,.power-final a{font-size:12px}.power-final span{color:#998d80}.power-final a{float:right}.power-page a:focus-visible{outline:2px solid #947358;outline-offset:4px}@media(max-width:900px){.power-grid{grid-template-columns:1fr}.power-summary{gap:24px;flex-wrap:wrap}.power-summary p{margin:0;flex-basis:100%}}@media(max-width:600px){.power-page{padding:0 14px;margin-top:24px}.power-heading{align-items:flex-start;flex-direction:column;gap:14px}.power-heading h1{font-size:22px}.power-card{padding:18px 14px}.power-summary{padding:20px}.power-summary strong{font-size:26px}.power-final p{font-size:16px;line-height:1.8}.power-final a{float:none;display:block;margin-top:14px}}
</style>
