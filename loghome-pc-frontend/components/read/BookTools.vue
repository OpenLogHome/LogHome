<template>
  <div class="book-tools">
    <button @click="openShare">分享作品</button><nuxt-link class="power-link" :to="`/read/power/${book.novel_id}`">原木力说明</nuxt-link><button @click="reportVisible = true">举报</button>
    <el-dialog title="分享作品" :visible.sync="shareVisible" width="min(520px, 94vw)" append-to-body>
      <p class="hint">分享链接可以直接用浏览器打开；口令也可在原木社区 APP 中识别，有效期为 30 天。</p><textarea readonly :value="shareText" rows="5" aria-label="分享内容"></textarea><p v-if="shareError" class="error" role="alert">{{ shareError }}</p><p v-if="rewardMessage" class="reward">{{ rewardMessage }} <nuxt-link to="/read/rewards">查看阅读奖励 →</nuxt-link></p>
      <span slot="footer"><el-button @click="copyShare">复制{{ code ? '口令与链接' : '链接' }}</el-button><el-button type="primary" :loading="creating" :disabled="!!code" @click="createCode">{{ code ? `口令 ${code}` : '生成分享口令' }}</el-button></span>
    </el-dialog>
    <el-dialog title="举报作品" :visible.sync="reportVisible" width="min(520px, 94vw)" append-to-body>
      <label class="field">举报原因 <el-select v-model="reason" placeholder="请选择原因"><el-option v-for="item in reasons" :key="item" :label="item" :value="item" /></el-select></label><label class="field">补充说明 <el-input v-model="detail" type="textarea" :rows="4" maxlength="200" show-word-limit placeholder="说明具体问题，便于核实处理" /></label><p v-if="reportError" class="error" role="alert">{{ reportError }}</p>
      <span slot="footer"><el-button @click="reportVisible = false">取消</el-button><el-button type="primary" :loading="reporting" :disabled="!reason || (reason === '其他' && !detail.trim())" @click="report">提交举报</el-button></span>
    </el-dialog>
  </div>
</template>
<script>
import { readingToken } from '~/plugins/api/reading'
import { SITE_ORIGIN } from '~/utils/reading-seo'
import { workUrl } from '~/utils/reading-discovery'
export default {
  props: { book: { type: Object, required: true } },
  data: () => ({ shareVisible: false, reportVisible: false, shareText: '', code: '', creating: false, reporting: false, reason: '', detail: '', reasons: ['违法违规', '色情低俗', '抄袭侵权', '人身攻击', '垃圾广告', '其他'], shareError: '', reportError: '', rewardMessage: '', version: 0, account: null }),
  watch: { 'book.novel_id'() { this.version++; this.shareVisible = false; this.reportVisible = false; this.code = ''; this.shareText = ''; this.reason = ''; this.detail = ''; this.creating = this.reporting = false; this.shareError = this.reportError = this.rewardMessage = '' } },
  mounted() { this.account = readingToken(); window.addEventListener('focus', this.checkAccount); window.addEventListener('storage', this.checkAccount) },
  beforeDestroy() { this.version++; window.removeEventListener('focus', this.checkAccount); window.removeEventListener('storage', this.checkAccount) },
  methods: {
    checkAccount() { if (this.account !== readingToken()) { this.account = readingToken(); this.version++; this.shareVisible = this.reportVisible = false; this.creating = this.reporting = false; this.code = this.shareText = this.detail = this.reason = this.shareError = this.reportError = this.rewardMessage = '' } },
    linkText() { return `我正在原木社区读《${this.book.name}》，你也一起来看看吧！\n${SITE_ORIGIN}${workUrl(this.book)}\n用浏览器打开链接，或复制口令打开原木社区 APP 即可查看。` },
    openShare() { this.checkAccount(); this.shareError = ''; this.shareText = this.code ? this.shareText : this.linkText(); this.shareVisible = true },
    async copyShare() {
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(this.shareText)
        else { const input = document.createElement('textarea'); input.value = this.shareText; input.style.position = 'fixed'; input.style.opacity = '0'; document.body.appendChild(input); input.select(); try { if (!document.execCommand('copy')) throw new Error('复制失败，请手动选择分享内容复制。') } finally { input.remove() } }
        this.$message.success('分享内容已复制')
      } catch (error) { this.shareError = error.message || '复制失败，请手动复制。'; return false }
      return true
    },
    async createCode() {
      this.checkAccount()
      if (this.creating || this.code) return
      const token = readingToken(); if (!token) { this.shareError = '登录后可以生成分享口令。'; return }
      const version = this.version; this.creating = true; this.shareError = ''; this.rewardMessage = ''
      try {
        const page = this.book.novel_type === 'manga' ? 'readers/mangaInfo' : 'readers/bookInfo'
        const response = await this.$api.reader.share({ share_type: 'book', share_content: `《${this.book.name}》- ${this.book.author_name || this.book.user_name || '佚名'}`, target_url: `/pages/${page}?id=${this.book.novel_id}`, share_message: this.linkText(), expires_hours: 24 * 30 })
        if (version !== this.version || token !== readingToken()) return
        if (!response.success || !response.code || !response.share_text) throw new Error(response.msg || '口令生成失败。')
        this.code = response.code; this.shareText = response.share_text
        if (await this.copyShare()) {
          if (version !== this.version || token !== readingToken()) return
          try { const task = await this.$api.reader.shareTask(); if (!task || task.msg !== 'Task completed' || typeof task.reward !== 'number' || !Number.isFinite(task.reward)) throw new Error('Unconfirmed task result'); if (version === this.version && token === readingToken()) this.rewardMessage = `每日分享任务已完成${typeof task.reward === 'number' ? `，获得 ${task.reward} 点成长值` : ''}。` }
          catch (error) { if (!/already completed|已完成/i.test(error.message) && version === this.version) this.rewardMessage = '口令已生成；分享任务奖励暂未领取，可在任务页查看。' }
        }
      } catch (error) { if (version === this.version && token === readingToken()) this.shareError = error.message }
      finally { if (version === this.version) this.creating = false }
    },
    async report() {
      this.checkAccount()
      if (this.reporting || !this.reason || (this.reason === '其他' && !this.detail.trim())) return
      const token = readingToken(); if (!token) { this.reportError = '请先登录后再举报。'; return }
      const version = this.version; this.reporting = true; this.reportError = ''
      try { await this.$api.reader.report({ novel_id: this.book.novel_id, reason: this.reason, detail: this.detail.trim() }); if (version === this.version && token === readingToken()) { this.$message.success('举报已提交'); this.reportVisible = false; this.detail = ''; this.reason = '' } }
      catch (error) { if (version === this.version && token === readingToken()) this.reportError = error.message }
      finally { if (version === this.version) this.reporting = false }
    }
  }
}
</script>
<style scoped>
.book-tools { display: inline-flex; gap: 8px; }button { background: #fff; color: #947358; border: 1px solid #e5d8c9; padding: 9px 16px; border-radius: 6px; cursor: pointer; font: inherit; font-size: 13px; }.hint { color: #998d80; font-size: 12px; line-height: 1.8; margin-bottom: 14px; }textarea { box-sizing: border-box; width: 100%; padding: 12px; font: inherit; line-height: 1.8; border: 1px solid #e5d8c9; border-radius: 6px; resize: vertical; }.field { display: grid; gap: 10px; margin-bottom: 20px; }.error { color: #c05243; margin-top: 12px; font-size: 13px; }.reward { color: #6b8651; margin-top: 12px; font-size: 13px; }
.book-tools{flex-wrap:wrap}.power-link{background:#fff;color:#947358;border:1px solid #e5d8c9;padding:9px 16px;border-radius:6px;font-size:13px;text-decoration:none;line-height:normal}.power-link:focus-visible{outline:2px solid #947358;outline-offset:2px}
</style>
