<template>
  <div class="lab-page">
    <div class="page-header">
      <div><h2>原木实验室管理</h2><p>维护客户端展示入口。小程序运行地址与版本要求在小程序管理中配置。</p></div>
      <div class="header-actions"><el-button @click="$router.push('/miniapps')">小程序管理</el-button><el-button type="primary" :disabled="!miniapps.length" @click="edit()">添加实验室入口</el-button></div>
    </div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon />
    <el-alert v-if="!loading && !error && !miniapps.length" title="请先在小程序管理中注册小程序，再添加实验室入口。" type="info" :closable="false" show-icon />
    <el-table :data="list" v-loading="loading" border empty-text="还没有实验室入口">
      <el-table-column label="图标" width="80"><template slot-scope="s"><el-image :src="iconPreview(s.row.icon)" fit="contain" class="app-icon"><i slot="error" class="el-icon-picture-outline" /></el-image></template></el-table-column>
      <el-table-column prop="id" label="入口 ID" min-width="150" />
      <el-table-column label="展示名称" min-width="150"><template slot-scope="s"><div>{{ s.row.name }}</div><small>{{ s.row.nameEn }}</small></template></el-table-column>
      <el-table-column prop="description" label="说明" min-width="210" show-overflow-tooltip />
      <el-table-column label="关联小程序" min-width="160"><template slot-scope="s"><div>{{ s.row.miniappName }}</div><small>{{ s.row.miniappId }}</small><el-tag v-if="!s.row.miniappEnabled" size="mini" type="warning">小程序已停用</el-tag></template></el-table-column>
      <el-table-column label="展示状态" width="105"><template slot-scope="s"><el-switch :value="s.row.enabled" :disabled="saving" @change="toggle(s.row, $event)" /><div class="state-label">{{ s.row.enabled ? '启用' : '隐藏' }}</div></template></el-table-column>
      <el-table-column prop="sortOrder" label="排序" width="80" sortable />
      <el-table-column label="操作" width="140" fixed="right"><template slot-scope="s"><el-button type="text" @click="edit(s.row)">编辑</el-button><el-button type="text" class="danger" @click="remove(s.row)">删除</el-button></template></el-table-column>
    </el-table>
    <div class="table-hint">排序值越小越靠前；入口和关联小程序均启用时才会在客户端显示。删除入口不会删除小程序或游戏存档。</div>
    <el-dialog :title="editing ? '编辑实验室入口' : '添加实验室入口'" :visible.sync="dialog" width="700px" :close-on-click-modal="false">
      <el-form ref="entryForm" :model="form" :rules="rules" label-width="115px">
        <el-form-item label="关联小程序" prop="miniappId"><el-select v-model="form.miniappId" filterable placeholder="选择已注册的小程序" class="full-width" @change="selectMiniapp"><el-option v-for="app in miniapps" :key="app.id" :value="app.id" :label="app.name + '（' + app.id + '）' + (app.enabled ? '' : ' · 已停用')" /></el-select></el-form-item>
        <el-form-item label="入口 ID" prop="id"><el-input v-model="form.id" :disabled="editing" placeholder="小写字母、数字或连字符，创建后不可更改" maxlength="64" /></el-form-item>
        <el-form-item label="展示名称" prop="name"><el-input v-model="form.name" maxlength="80" /></el-form-item>
        <el-form-item label="英文名称"><el-input v-model="form.nameEn" maxlength="80" placeholder="选填；为空时使用中文名称" /></el-form-item>
        <el-form-item label="图标地址" prop="icon"><el-input v-model="form.icon" placeholder="HTTP/HTTPS 地址或客户端 /static/ 路径" /><el-image v-if="form.icon" :src="iconPreview(form.icon)" fit="contain" class="app-icon" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.description" type="textarea" maxlength="500" show-word-limit /></el-form-item>
        <el-form-item label="英文说明"><el-input v-model="form.descriptionEn" type="textarea" maxlength="500" placeholder="选填；为空时使用中文说明" /></el-form-item>
        <el-form-item label="展示状态"><el-switch v-model="form.enabled" active-text="启用" inactive-text="隐藏" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="-100000" :max="100000" :precision="0" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button :disabled="saving" @click="dialog = false">取消</el-button><el-button type="primary" :loading="saving" @click="save">保存</el-button></div>
    </el-dialog>
  </div>
</template>
<script>
const blank = () => ({id: '', miniappId: '', name: '', nameEn: '', icon: '', description: '', descriptionEn: '', enabled: true, sortOrder: 0})
export default {
  name: 'LabManage',
  data() {
    const required = message => [{required: true, message, trigger: 'blur'}]
    return {list: [], miniapps: [], loading: false, saving: false, error: '', dialog: false, editing: false, form: blank(), rules: {
      id: required('请输入入口 ID'), miniappId: required('请选择关联小程序'), name: required('请输入展示名称'), icon: required('请输入图标地址')
    }}
  },
  created() { this.load() },
  methods: {
    message(e) { return e.response && e.response.data.message || e.message || '操作失败' },
    iconPreview(icon) { return icon && icon.startsWith('/static/') ? (process.env.VUE_APP_CLIENT_URL || 'https://m.loghome.ink').replace(/\/$/, '') + icon : icon },
    async load() {
      this.loading = true; this.error = ''
      try {
        const [entries, apps] = await Promise.all([this.axios.get(this.$baseUrl + '/lab/manage'), this.axios.get(this.$baseUrl + '/miniapps/manage')])
        this.list = entries.data.data; this.miniapps = apps.data.data
      } catch (e) { this.error = this.message(e) }
      finally { this.loading = false }
    },
    edit(row) { this.editing = !!row; this.form = row ? {...blank(), ...row} : blank(); this.dialog = true; this.$nextTick(() => this.$refs.entryForm.clearValidate()) },
    selectMiniapp(id) {
      if (this.editing) return
      const app = this.miniapps.find(app => app.id === id)
      if (!app) return
      if (!this.form.id) this.form.id = app.id
      if (!this.form.name) this.form.name = app.name
      if (!this.form.icon) this.form.icon = app.icon
      if (!this.form.description) this.form.description = app.description
    },
    save() {
      this.$refs.entryForm.validate(async valid => {
        if (!valid || this.saving) return
        this.saving = true
        try {
          await this.axios[this.editing ? 'put' : 'post'](this.$baseUrl + '/lab/manage' + (this.editing ? '/' + encodeURIComponent(this.form.id) : ''), this.form)
          this.dialog = false; this.$message.success('实验室入口已保存'); await this.load()
        } catch (e) { this.$message.error(this.message(e)) }
        finally { this.saving = false }
      })
    },
    async toggle(row, enabled) {
      this.saving = true
      try { await this.axios.put(this.$baseUrl + '/lab/manage/' + encodeURIComponent(row.id), {...row, enabled}); row.enabled = enabled; this.$message.success(enabled ? '入口已启用' : '入口已隐藏') }
      catch (e) { this.$message.error(this.message(e)) }
      finally { this.saving = false }
    },
    async remove(row) {
      try { await this.$confirm('删除“' + row.name + '”的实验室入口？小程序注册信息与游戏存档会保留。', '删除实验室入口', {type: 'warning'}) }
      catch { return }
      try { await this.axios.delete(this.$baseUrl + '/lab/manage/' + encodeURIComponent(row.id)); this.$message.success('已删除'); await this.load() }
      catch (e) { this.$message.error(this.message(e)) }
    }
  }
}
</script>
<style scoped>
.lab-page{padding:20px}.page-header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:20px}.page-header h2{margin:0 0 8px}.page-header p,.table-hint,small{color:#7b817b}.header-actions{display:flex;flex-shrink:0;gap:12px}.app-icon{width:44px;height:44px;margin-top:4px}.danger{color:#f56c6c}.el-alert{margin-bottom:16px}.table-hint{margin-top:16px;font-size:13px;line-height:1.6}.state-label{margin-top:6px;font-size:12px;color:#7b817b}.full-width{width:100%}small{display:block;line-height:1.7}@media(max-width:900px){.page-header{align-items:flex-start;flex-direction:column}}
</style>
