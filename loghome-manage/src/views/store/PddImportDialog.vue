<template>
  <el-dialog title="从拼多多导入商品" :visible="visible" width="800px" :before-close="close" @open="loadStatus" :close-on-click-modal="false">
    <el-alert title="一次导入全部规格，采购成本使用不含优惠券的拼单价，兑换价 = 采购成本 × 1.2 × 100。各规格默认库存 999，导入后可调整并上架。" type="info" :closable="false" />
    <div class="import-toolbar">
      <el-input v-model="url" placeholder="粘贴拼多多商品分享链接" :disabled="busy" />
      <el-button type="primary" @click="collect" :loading="busy" :disabled="loginVisible">读取商品</el-button>
    </div>
    <div class="session-toolbar">
      <el-tag :type="session.saved ? 'success' : 'info'">{{ session.saved ? '已保存登录会话' : '尚未保存登录会话' }}</el-tag>
      <el-button size="small" @click="startLogin" :disabled="busy">登录／更新拼多多会话</el-button>
    </div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <template v-if="product">
      <div class="product-preview">
        <img v-if="product.images.length" :src="product.images[0]" alt="商品封面" referrerpolicy="no-referrer" />
        <div><strong>{{ product.title }}</strong><p>商品 ID：{{ product.goods_id }}　{{ product.mall_name }}</p></div>
      </div>
      <el-form label-width="130px">
        <el-form-item label="商城分类"><el-input v-model="category" maxlength="80" placeholder="例如 Minecraft、写作" /></el-form-item>
      </el-form>
      <el-table :data="product.skus" border max-height="350">
        <el-table-column prop="label" label="规格" min-width="220" />
        <el-table-column label="券前拼单价（元）" width="150"><template slot-scope="scope">{{ scope.row.price || '未读取' }}</template></el-table-column>
        <el-table-column label="兑换价（原木）" width="150"><template slot-scope="scope">{{ scope.row.price ? exchange(scope.row.price) : '未读取' }}</template></el-table-column>
        <el-table-column label="来源状态" width="100"><template slot-scope="scope">{{ scope.row.available ? '可选' : '停售' }}</template></el-table-column>
      </el-table>
      <el-alert v-for="warning in product.warnings" :key="warning" :title="warning" type="warning" :closable="false" class="warning" />
    </template>
    <span slot="footer"><el-button @click="close">取消</el-button><el-button type="primary" :disabled="!canImport || busy || loginVisible" :loading="busy" @click="importAll">一键导入全部规格</el-button></span>

    <el-dialog title="拼多多登录" :visible.sync="loginVisible" width="620px" append-to-body :before-close="closeLogin" :close-on-click-modal="false" :close-on-press-escape="false">
      <p>点击下方浏览器画面操作，点击输入框后在这里输入手机号或验证码。验证码／滑块验证由你手动完成。登录成功后点击“确认登录并保存会话”。</p>
      <el-alert v-if="loginError" :title="loginError" type="error" :closable="false" />
      <div class="login-controls">
        <el-input v-model="loginText" placeholder="手机号或验证码" autocomplete="off" :disabled="loginBusy" @keyup.enter.native="sendText" />
        <el-button @click="sendText" :disabled="loginBusy || !loginText">填入输入框</el-button>
      </div>
      <div class="login-controls">
        <el-button size="small" @click="action({action:'refresh'})" :disabled="loginBusy">刷新画面</el-button>
        <el-button size="small" @click="action({action:'key',key:'Tab'})" :disabled="loginBusy">下一输入框</el-button>
        <el-button size="small" @click="action({action:'scroll',delta:500})" :disabled="loginBusy">向下滚动</el-button>
        <el-button size="small" @click="action({action:'scroll',delta:-500})" :disabled="loginBusy">向上滚动</el-button>
      </div>
      <div v-loading="loginBusy" class="browser-screen">
        <img v-if="screen.screenshot" :src="'data:image/png;base64,' + screen.screenshot" alt="拼多多登录浏览器" draggable="false" @mousedown.prevent="pointerStart" @mouseup.prevent="pointerEnd" />
      </div>
      <span slot="footer"><el-button @click="closeLogin" :disabled="loginBusy">关闭</el-button><el-button type="primary" @click="saveLogin" :loading="loginBusy">确认登录并保存会话</el-button></span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PddImportDialog',
  props: { visible: Boolean },
  data() {
    return { url: '', busy: false, error: '', session: {}, product: null, category: '', loginVisible: false, loginBusy: false, loginError: '', loginText: '', screen: {}, pointer: null }
  },
  computed: {
    canImport() { return !!this.url.trim() && (!this.product || (this.product.skus.length > 0 && this.product.skus.every(sku => sku.price > 0 && sku.price_type === 'group_before_coupon'))) }
  },
  methods: {
    async request(path, data) {
      const token = JSON.parse(window.localStorage.getItem('token') || 'null')
      try {
        const res = await axios({ url: this.$baseUrl + '/manage/store/pdd' + path, method: data === undefined ? 'get' : 'post', data, headers: { Authorization: token && token.tk }, timeout: 120000 })
        if (!res.data || res.data.code !== 200) throw new Error((res.data && (res.data.msg || res.data.message)) || '请求失败')
        return res.data.data
      } catch (error) {
        const response = error.response && error.response.data
        const failure = new Error((response && response.msg) || error.message || '采集请求失败')
        failure.code = response && response.error
        throw failure
      }
    },
    async loadStatus() {
      this.error = ''
      try { this.session = await this.request('/status') } catch (e) { this.error = e.message }
    },
    async collect() {
      if (!this.url.trim()) { this.error = '请先粘贴商品链接'; return }
      this.busy = true
      this.error = ''
      this.product = null
      try {
        this.product = await this.request('/collect', { url: this.url.trim() })
        this.category = this.product.category
      } catch (e) {
        this.error = e.message
        if (e.code === 'LOGIN_REQUIRED' || e.code === 'VERIFICATION_REQUIRED') await this.startLogin()
      } finally { this.busy = false }
    },
    exchange(cost) { return Math.ceil(Math.round(cost * 100) * 120 / 100) },
    async importAll() {
      if (!this.canImport) return
      this.busy = true
      this.error = ''
      try {
        const data = await this.request('/import', { url: this.url.trim(), category: this.category })
        this.$message.success('已导入 ' + data.variant_count + ' 个规格，默认库存各 999 件，请核对后上架')
        this.$emit('imported', data)
        this.$emit('update:visible', false)
        this.product = null
        this.url = ''
        this.category = ''
      } catch (e) {
        this.error = e.message
        if (e.code === 'LOGIN_REQUIRED' || e.code === 'VERIFICATION_REQUIRED') await this.startLogin()
      } finally { this.busy = false }
    },
    async startLogin() {
      this.loginVisible = true
      this.loginBusy = true
      this.loginError = ''
      this.loginText = ''
      this.screen = {}
      try { this.screen = await this.request('/login/start', {}) } catch (e) { this.loginError = e.message } finally { this.loginBusy = false }
    },
    async action(input) {
      if (this.loginBusy) return
      this.loginBusy = true
      this.loginError = ''
      try { this.screen = await this.request('/login/action', { ...input, frame: this.screen.frame }) } catch (e) { this.loginError = e.message } finally { this.loginBusy = false }
    },
    async sendText() {
      const text = this.loginText
      this.loginText = ''
      await this.action({ action: 'type', text })
    },
    point(event) {
      const rect = event.target.getBoundingClientRect()
      return { x: (event.clientX - rect.left) * this.screen.viewport.width / rect.width, y: (event.clientY - rect.top) * this.screen.viewport.height / rect.height }
    },
    pointerStart(event) { if (!this.loginBusy && this.screen.viewport) this.pointer = this.point(event) },
    pointerEnd(event) {
      if (!this.pointer || this.loginBusy) return
      const end = this.point(event)
      const start = this.pointer
      this.pointer = null
      if (Math.hypot(end.x - start.x, end.y - start.y) > 8) this.action({ action: 'drag', ...start, end_x: end.x, end_y: end.y })
      else this.action({ action: 'click', ...end })
    },
    async saveLogin() {
      this.loginBusy = true
      this.loginError = ''
      try {
        await this.request('/login/save', {})
        this.session = { saved: true }
        this.loginVisible = false
        this.screen = {}
        this.$message.success('已加密保存登录会话，可以重新读取商品')
      } catch (e) {
        this.loginError = e.message
        try { this.screen = await this.request('/login/action', { action: 'refresh' }) } catch (_) {}
      } finally { this.loginBusy = false }
    },
    async closeLogin() {
      if (this.loginBusy) return
      this.loginBusy = true
      try {
        await this.request('/login/close', {})
        this.loginVisible = false
        this.screen = {}
        this.loginText = ''
      } catch (e) { this.loginError = e.message } finally { this.loginBusy = false }
    },
    close() {
      if (this.busy || this.loginBusy || this.loginVisible) { this.$message.info('请先完成当前操作并关闭登录窗口'); return }
      this.$emit('update:visible', false)
    },

  }
}
</script>

<style scoped>
.import-toolbar, .session-toolbar, .login-controls { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
.product-preview { display: flex; gap: 16px; margin: 20px 0; }
.product-preview img { width: 100px; height: 100px; object-fit: contain; }
.warning { margin-top: 8px; }
.browser-screen { max-height: 65vh; overflow: auto; text-align: center; background: #f5f7fa; }
.browser-screen img { width: 480px; max-width: 100%; user-select: none; cursor: pointer; }
</style>
