<template>
<section class="redstone-center" aria-labelledby="redstone-title">
  <header class="center-heading"><div><nuxt-link to="/read">{{ $t("← 返回书库") }}</nuxt-link><h1 id="redstone-title">{{ $t("红石中心") }}</h1><p>{{ $t("为阅读与创作补充一点灵感能量") }}</p></div><nuxt-link to="/me/settings">{{ $t("AI 辅助设置") }}</nuxt-link></header>
  <div v-if="!ready" class="center-gate">{{ $t("正在读取账户状态…") }}</div>
  <div v-else-if="disabled" class="center-gate"><h2>{{ $t("AI 辅助已关闭") }}</h2><p>{{ $t("开启 AI 辅助后，可以查看红石余额与兑换记录。") }}</p><nuxt-link to="/me/settings">{{ $t("前往设置") }}</nuxt-link></div>
  <div v-else-if="!token || authExpired" class="center-gate"><h2>{{ authExpired ? $t("登录已失效") : $t("登录后查看我的红石") }}</h2><p>{{ $t("红石用于原木娘助读、AI 创作等智能功能。") }}</p><nuxt-link :to="loginUrl">{{ $t("登录后继续") }}</nuxt-link></div>
  <template v-else>
    <div class="balance-overview"><div><span>{{ $t("我的红石") }}</span><strong>{{ account ? account.total.toLocaleString() : '—' }} <small>{{ $t("红石") }}</small></strong><p>{{ account ? $t("永久 ") + account.permanent.toLocaleString() + $t(" · 赠送 ") + account.expiring.toLocaleString() : $t("尚未取得余额") }}</p><p v-if="account && account.expiration">{{ $t("最近到期：{p0}（北京时间）", {p0: (date(account.expiration))}) }}</p></div><div class="logs-balance"><span>{{ $t("可用原木") }}</span><strong>{{ account ? account.log.toLocaleString() : '—' }}</strong><button :disabled="accountLoading || submitting" @click="loadAccount">{{ accountLoading ? $t("刷新中…") : $t("刷新余额") }}</button></div></div>
    <p v-if="accountError" class="error" role="alert">{{ accountError }}</p><p v-if="storageError" class="error" role="alert">{{ storageError }} <button @click="readPending">{{ $t("重新读取兑换记录") }}</button></p>
    <div class="center-grid">
      <section class="center-panel exchange-panel" aria-labelledby="exchange-title"><div class="panel-heading"><h2 id="exchange-title">{{ $t("兑换红石") }}</h2><span>{{ $t("10 原木 = 1 红石") }}</span></div><p class="quiet">{{ $t("兑换所得红石永久有效，兑换后不可撤销。") }}</p><label for="redstone-amount">{{ $t("兑换数量") }}</label><div class="amount-field"><input id="redstone-amount" :value="amount" inputmode="numeric" maxlength="6" autocomplete="off" :disabled="!!pending || submitting || confirming" placeholder="1–100000" @input="amount = $event.target.value.replace(/\D/g, '').slice(0, 6)" /><span>{{ $t("红石") }}</span></div><div class="quick-amounts"><button v-for="value in [10,50,100,300]" :key="value" :disabled="!!pending || submitting || confirming" :aria-pressed="Number(amount) === value" @click="amount=String(value)">{{ value }}</button></div><div class="cost-line"><span>{{ $t("需要支付") }}</span><strong>{{ $t("{p0} 原木", {p0: (cost.toLocaleString())}) }}</strong></div><p v-if="validAmount && account && cost > account.log && !pending" class="error">{{ $t("原木余额不足") }}</p><p v-if="pending" class="pending-note" role="status">{{ $t("上次 {p0} 红石兑换的结果尚待确认。重试会复用同一兑换编号，避免重复扣除原木。", {p0: (pending.amount)}) }}</p><button class="exchange-button" :disabled="submitting || confirming || !!storageError || (!pending && !canExchange)" @click="exchange">{{ submitting ? $t("兑换处理中…") : confirming ? $t("等待确认…") : pending ? $t("确认上次兑换结果") : $t("确认兑换") }}</button><p v-if="exchangeError" class="error" role="alert">{{ exchangeError }}</p><p v-if="notice" class="success" role="status">{{ notice }}</p></section>
      <section class="center-panel" aria-labelledby="grants-title"><h2 id="grants-title">{{ $t("每月赠送") }}</h2><p class="quiet">{{ account ? $t("赠送红石有效期为 ") + account.validity + $t(" 个月，使用时优先消耗临近到期的赠送红石。") : $t("取得账户信息后显示当前赠送标准。") }}</p><dl class="grant-list"><div><dt>{{ $t("普通用户") }}</dt><dd>{{ account ? account.ordinaryGrant : '—' }} <small>{{ $t("红石 / 月") }}</small></dd></div><div><dt>{{ $t("原木通行证") }}</dt><dd>{{ account ? account.standardGrant : '—' }} <small>{{ $t("红石 / 周期") }}</small></dd></div><div><dt>{{ $t("超级原木通行证") }}</dt><dd>{{ account ? account.superGrant : '—' }} <small>{{ $t("红石 / 周期") }}</small></dd></div></dl><p class="quiet">{{ $t("普通用户每月首次访问时到账；通行证月付开通或续费到账，年付按月到账。") }}</p><nuxt-link to="/membership">{{ $t("查看原木通行证 →") }}</nuxt-link><h3>{{ $t("红石可以做什么？") }}</h3><ul class="ai-uses"><li>{{ $t("原木娘助读：快速 1 红石，深入 2 红石") }}</li><li>{{ $t("AI 创作：普通 1 红石，深度思考 2 红石") }}</li><li>{{ $t("图像生成：5 红石；智能纠错普通用户 2 红石，通行证免费") }}</li></ul><p class="quiet">{{ $t("具体消耗以使用页面提示为准。") }}</p></section>
    </div>
    <section class="center-panel records-panel" aria-labelledby="records-title"><div class="panel-heading"><div><h2 id="records-title">{{ $t("红石流水") }}</h2><p class="quiet">{{ $t("赠送、兑换、到期与 AI 使用记录 · 时间均为北京时间") }}</p></div><button :disabled="historyLoading || submitting" @click="loadHistory(page)">{{ historyLoading ? $t("读取中…") : $t("刷新流水") }}</button></div><p v-if="historyError" class="error" role="alert">{{ historyError }} <button :disabled="historyLoading" @click="loadHistory(page)">{{ $t("重试") }}</button></p><div v-if="records.length" class="records-scroll"><table><thead><tr><th scope="col">{{ $t("时间") }}</th><th scope="col">{{ $t("项目") }}</th><th scope="col">{{ $t("原木支出") }}</th><th scope="col">{{ $t("红石变动") }}</th><th scope="col">{{ $t("有效期 / 剩余") }}</th></tr></thead><tbody><tr v-for="row in records" :key="row.transaction_id"><td>{{ date(row.created_at) }}</td><td>{{ title(row) }}</td><td>{{ row.log_cost ? row.log_cost.toLocaleString() : '—' }}</td><td class="record-amount" :class="{ spent: row.amount < 0 }">{{ row.amount > 0 ? '+' : '' }}{{ row.amount.toLocaleString() }}</td><td>{{ row.expires_at ? date(row.expires_at) + (row.remaining_amount != null ? $t(" · 剩余 ") + row.remaining_amount : '') : row.transaction_type === 'log_exchange' ? $t("永久有效") : '—' }}</td></tr></tbody></table></div><p v-else-if="!historyLoading && !historyError" class="quiet">{{ $t("暂无红石流水") }}</p><nav v-if="total > 20" class="history-pagination" :aria-label='$t("红石流水分页")'><button :disabled="page <= 1 || historyLoading || submitting" @click="loadHistory(page-1)">{{ $t("上一页") }}</button><span>{{ $t("第 {p0} / {p1} 页 · {p2} 条", {p0: (page), p1: (Math.ceil(total/20)), p2: (total)}) }}</span><button :disabled="page * 20 >= total || historyLoading || submitting" @click="loadHistory(page+1)">{{ $t("下一页") }}</button></nav></section>
  </template>
  <section class="center-panel declaration-panel"><h2>{{ declaration.title }}</h2><p class="quiet">{{ declaration.subtitle }}</p><p>{{ declaration.models }}</p><h3>{{ declaration.promiseTitle }}</h3><p>{{ declaration.promise }}</p><details><summary>{{ declaration.expand }}</summary><section v-for="(section, key) in declaration.sections" :key="key"><h3>{{ section.title }}</h3><p>{{ section.body }}</p></section><nuxt-link to="/me/settings">{{ declaration.settings }}</nuxt-link></details></section>
</section>
</template>

<script>
import { readingToken } from '~/plugins/api/reading'
import { readerAiDisabled, AI_PREFERENCE_EVENT } from '~/utils/reader-ai'
import { readingHead } from '~/utils/reading-seo'
import declaration from '~/assets/data/reader-redstone-declaration.json'
import { redstoneAccount, redstoneHistory, redstoneAmount, redstoneReceipt, redstoneRequestId, readPendingRedstone, savePendingRedstone, clearPendingRedstone, pendingKey, redstoneTitle, redstoneDate } from '~/utils/reader-redstone'
export default {
  data: () => ({ ready: false, disabled: false, token: null, authExpired: false, account: null, accountLoading: false, accountError: '', records: [], total: 0, page: 1, historyLoading: false, historyError: '', amount: '', pending: null, storageError: '', exchangeError: '', notice: '', submitting: false, confirming: false, epoch: 0, accountVersion: 0, historyVersion: 0, declaration: declaration.redstone.aiDeclaration }),
  computed: {
    validAmount() { return redstoneAmount(this.amount) }, cost() { return this.validAmount * 10 },
    canExchange() { return !!this.account && !this.accountLoading && !this.accountError && this.validAmount > 0 && this.cost <= this.account.log },
    loginUrl() { return { path: '/login', query: { redirect: '/read/redstone' } } },
    membershipUrl() { return `${process.env.mobileUrl}/#/pages/membership/index` }
  },
  mounted() { this.checkContext(); this.ready = true; window.addEventListener('focus', this.checkContext); window.addEventListener('storage', this.checkContext); window.addEventListener(AI_PREFERENCE_EVENT, this.checkContext) },
  beforeDestroy() { this.epoch++; window.removeEventListener('focus', this.checkContext); window.removeEventListener('storage', this.checkContext); window.removeEventListener(AI_PREFERENCE_EVENT, this.checkContext) },
  head() { return readingHead({ title: '红石中心 - 原木社区', description: '查看红石余额、兑换红石和查询 AI 功能消费记录。', path: '/read/redstone', noindex: true }) },
  methods: {
    title: redstoneTitle, date: redstoneDate,
    current(token, epoch) { return this.token === token && readingToken() === token && this.epoch === epoch && !readerAiDisabled() },
    checkContext(event) {
      const token = readingToken(), disabled = readerAiDisabled()
      if (this.ready && token === this.token && disabled === this.disabled) { if(event && event.key === pendingKey(token)) this.readPending(); return }
      this.epoch++; this.accountVersion++; this.historyVersion++
      Object.assign(this, { token, disabled, authExpired: false, account: null, accountLoading: false, accountError: '', records: [], total: 0, page: 1, historyLoading: false, historyError: '', amount: '', pending: null, storageError: '', exchangeError: '', notice: '', submitting: false, confirming: false })
      if (token && !disabled) { this.readPending(); this.loadAccount(); this.loadHistory(1) }
    },
    readPending() {
      this.checkContextIfChanged()
      if (!this.token || this.disabled || this.submitting) return
      try { this.pending = readPendingRedstone(localStorage, this.token); this.storageError = ''; if (this.pending) this.amount = String(this.pending.amount) } catch (error) { this.storageError = error.message || '兑换记录无法读取，请检查浏览器存储权限。' }
    },
    checkContextIfChanged() { if (readingToken() !== this.token || readerAiDisabled() !== this.disabled) this.checkContext() },
    expire(error) { if (error.status === 401 || error.status === 403) this.authExpired = true },
    async loadAccount() {
      this.checkContextIfChanged(); if (!this.token || this.disabled || this.submitting) return
      const token = this.token, epoch = this.epoch, version = ++this.accountVersion
      this.accountLoading = true; this.accountError = ''
      try { const value = redstoneAccount(await this.$api.reader.redstoneAccount()); if (!this.current(token,epoch) || version !== this.accountVersion) return; this.account = value }
      catch (error) { if (!this.current(token,epoch) || version !== this.accountVersion) return; this.account = null; this.accountError = error.message || '红石余额读取失败'; this.expire(error) }
      finally { if (this.current(token,epoch) && version === this.accountVersion) this.accountLoading = false }
    },
    async loadHistory(page = 1) {
      this.checkContextIfChanged(); if (!this.token || this.disabled || this.submitting || !Number.isSafeInteger(page) || page < 1) return
      const token = this.token, epoch = this.epoch, version = ++this.historyVersion
      this.historyLoading = true; this.historyError = ''
      try { const result = redstoneHistory(await this.$api.reader.redstoneTransactions(page),page); if (!this.current(token,epoch) || version !== this.historyVersion) return; this.records = result.list; this.total = result.total; this.page = page }
      catch (error) { if (!this.current(token,epoch) || version !== this.historyVersion) return; this.historyError = error.message || '红石流水读取失败'; this.expire(error) }
      finally { if (this.current(token,epoch) && version === this.historyVersion) this.historyLoading = false }
    },
    async exchange() {
      this.checkContextIfChanged()
      if (!this.token || this.disabled || this.authExpired || this.submitting || this.confirming || this.storageError || (!this.pending && !this.canExchange)) return
      const token = this.token, epoch = this.epoch, pending = this.pending || { id: redstoneRequestId(), amount: this.validAmount, uncertain: false }
      this.confirming = true; this.exchangeError = ''; this.notice = ''
      try {
        await this.$confirm(this.pending ? `核对上次 ${pending.amount} 红石兑换。系统将复用同一编号，已完成的兑换不会重复扣除原木。` : `将消耗 ${pending.amount*10} 原木，兑换 ${pending.amount} 红石。兑换所得红石永久有效，兑换后不可撤销。`, this.pending ? '确认上次兑换结果' : '确认兑换红石', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' })
        if (!this.current(token,epoch) || this.authExpired || (!this.pending && (!this.canExchange || this.validAmount !== pending.amount))) return
        try {
          const stored = readPendingRedstone(localStorage,token)
          if (stored && stored.id !== pending.id) { this.pending = stored; this.amount = String(stored.amount); this.exchangeError = '另一个页面有尚未确认的兑换，请先核对该兑换结果。'; return }
          savePendingRedstone(localStorage,token,pending)
        } catch (_) { this.storageError = '兑换记录无法保存或读取，请检查浏览器存储权限后重试。'; return }
        this.pending = pending; this.amount = String(pending.amount); this.submitting = true; this.accountVersion++; this.historyVersion++; this.accountLoading = false; this.historyLoading = false
        try {
          const receipt = redstoneReceipt(await this.$api.reader.exchangeRedstone(pending.amount,pending.id),pending)
          if (!this.current(token,epoch)) return
          try { clearPendingRedstone(localStorage,token); this.pending = null; this.amount = '' } catch (_) { this.pending = { ...pending, uncertain: true }; this.storageError = '兑换已确认，但兑换记录未能清除。再次核对会使用相同编号。' }
          this.notice = `${receipt.replayed ? '已确认上次兑换' : '兑换成功'}：${receipt.amount} 红石已到账。`
        } catch (error) {
          if (!this.current(token,epoch)) return
          this.exchangeError = error.message || '兑换结果尚未确认，请重试同一兑换。'; this.expire(error)
          if (!pending.uncertain && [400,409,422].includes(error.status)) {
            try { clearPendingRedstone(localStorage,token); this.pending = null } catch (_) { this.pending = { ...pending, uncertain: true }; this.storageError = '兑换记录无法清除，请检查浏览器存储权限。' }
          } else this.pending = { ...pending, uncertain: true }
        } finally {
          if (this.current(token,epoch)) { this.submitting = false; await this.loadAccount(); await this.loadHistory(1) }
        }
      } catch (error) { if (this.current(token,epoch) && error !== 'cancel' && error !== 'close') this.exchangeError = error.message || '确认操作未完成，请重试。' }
      finally { if (this.current(token,epoch)) this.confirming = false }
    }
  }
}
</script>

<style scoped>
.redstone-center{max-width:1180px;margin:0 auto;padding:112px 28px 72px;color:#493e36;font-size:14px}.center-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:30px}.center-heading h1{font-size:30px;margin:16px 0 8px}.center-heading p,.quiet{color:#928579;line-height:1.8}.center-heading a,a{color:#82654c}.center-gate{padding:36px;background:white;border:1px solid #e8e4de;border-radius:14px;margin-bottom:22px}.center-gate p{line-height:1.8}.balance-overview{display:flex;justify-content:space-between;gap:24px;border:1px solid #e9dacf;border-radius:14px;padding:30px 34px;background:linear-gradient(110deg,#fff9f3,#fff);margin-bottom:22px}.balance-overview span{color:#887369}.balance-overview strong{display:block;font-size:40px;color:#a75a47;margin-top:10px;font-variant-numeric:tabular-nums}.balance-overview small{font-size:14px;font-weight:400}.balance-overview p{font-size:13px;color:#887369;margin:12px 0 0}.logs-balance{text-align:right}.logs-balance strong{font-size:26px;color:#70604e}.logs-balance button{margin-top:16px}.center-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px}.center-panel{background:white;border:1px solid #e7e3dd;border-radius:14px;padding:26px;margin-bottom:22px;min-width:0}.center-panel h2{font-size:18px;margin:0 0 12px}.center-panel h3{font-size:15px;margin:24px 0 12px}.panel-heading{display:flex;justify-content:space-between;align-items:center;gap:14px}.panel-heading span{color:#9a8375;font-size:13px}.panel-heading h2{margin:0}.panel-heading p{margin-bottom:0}button{border:1px solid #ded7cf;border-radius:7px;background:#fff;color:#776149;padding:8px 13px;cursor:pointer;font:inherit}button:disabled{opacity:.5;cursor:default}button:focus-visible,input:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid #a56f54;outline-offset:3px}.exchange-panel label{display:block;font-size:13px;margin:22px 0 10px}.amount-field{display:flex;align-items:center;gap:12px;border:1px solid #dccdbf;border-radius:9px;padding:12px 16px}.amount-field input{width:100%;min-width:0;font:inherit;font-size:24px;border:0;background:transparent;color:#493e36}.amount-field span{white-space:nowrap;color:#928579}.quick-amounts{display:flex;gap:9px;margin:12px 0 24px}.quick-amounts button{flex:1}.quick-amounts button[aria-pressed=true]{color:#a75a47;border-color:#c58b76;background:#fff6f0}.cost-line{display:flex;justify-content:space-between;border-top:1px solid #eee8e2;padding-top:20px;margin-bottom:20px}.cost-line strong{font-size:20px;color:#957152}.exchange-button{width:100%;background:#aa6650;border-color:#aa6650;color:white;padding:13px}.grant-list{margin:20px 0}.grant-list>div{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #eee8e2}.grant-list dd{font-size:20px;font-weight:600;margin:0;color:#a75a47}.grant-list small{font-size:12px;font-weight:400;color:#928579}.ai-uses{padding-left:18px;line-height:2;color:#76675b}.error{color:#ac453b;font-size:13px;line-height:1.8}.success{color:#657948;line-height:1.8}.pending-note{padding:12px;background:#fff5e7;border-radius:7px;line-height:1.8;color:#907044}.records-scroll{overflow-x:auto;margin-top:22px}table{border-collapse:collapse;width:100%;font-size:13px;min-width:650px}th,td{text-align:left;padding:15px 12px;border-bottom:1px solid #ece7e1}th{font-size:12px;font-weight:400;color:#96877a}td:first-child{white-space:nowrap}.record-amount{font-variant-numeric:tabular-nums;font-weight:600;color:#647f49}.record-amount.spent{color:#af6452}.history-pagination{display:flex;justify-content:center;align-items:center;gap:16px;margin-top:22px;font-size:13px}.declaration-panel p{line-height:1.9}.declaration-panel summary{cursor:pointer;color:#82654c;margin-top:20px}.declaration-panel details section{border-top:1px solid #eee8e2;margin-top:22px}.center-gate h2{font-size:20px}@media(max-width:800px){.redstone-center{padding:100px 20px 50px}.center-grid{grid-template-columns:minmax(0,1fr)}.center-heading{align-items:flex-start}.balance-overview{padding:24px}.center-panel{padding:22px}}@media(max-width:450px){.redstone-center{padding-left:14px;padding-right:14px}.center-heading{flex-direction:column;gap:12px}.balance-overview{padding:20px;gap:14px}.balance-overview strong{font-size:30px}.logs-balance strong{font-size:22px}.panel-heading{align-items:flex-start;flex-wrap:wrap}.history-pagination{gap:10px}.history-pagination button{padding:8px}.grant-list small{font-size:11px}}
</style>
