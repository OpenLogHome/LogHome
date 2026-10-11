<template>
  <div class="miniapps-page">
    <div class="page-header">
      <div><h2>小程序管理</h2><p>提前注册小程序。客户端按 ID 获取名称、图标和对应环境的地址。</p></div>
      <el-button type="primary" @click="edit()">注册小程序</el-button>
    </div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon />
    <el-table :data="list" v-loading="loading" border>
      <el-table-column label="图标" width="90"><template slot-scope="s"><el-image :src="s.row.icon" fit="contain" class="app-icon"><i slot="error" class="el-icon-picture-outline" /></el-image></template></el-table-column>
      <el-table-column prop="id" label="小程序 ID" min-width="140" />
      <el-table-column prop="name" label="名称" min-width="130" />
      <el-table-column prop="debugUrl" label="调试地址" min-width="220" show-overflow-tooltip />
      <el-table-column prop="productionUrl" label="生产地址" min-width="220" show-overflow-tooltip />
      <el-table-column label="状态" width="80"><template slot-scope="s"><el-tag :type="s.row.enabled ? 'success' : 'info'">{{ s.row.enabled ? '启用' : '停用' }}</el-tag></template></el-table-column>
      <el-table-column prop="sortOrder" label="排序" width="70" />
      <el-table-column label="操作" width="140" fixed="right"><template slot-scope="s"><el-button type="text" @click="edit(s.row)">编辑</el-button><el-button type="text" class="danger" @click="remove(s.row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog :title="editing ? '编辑小程序' : '注册小程序'" :visible.sync="dialog" width="680px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="小程序 ID" prop="id"><el-input v-model="form.id" :disabled="editing" placeholder="如 log-defence，注册后不可更改" /></el-form-item>
        <el-form-item label="名称" prop="name"><el-input v-model="form.name" maxlength="80" /></el-form-item>
        <el-form-item label="图标地址" prop="icon"><el-input v-model="form.icon" placeholder="图标的 HTTP/HTTPS 地址或主应用 /static/ 路径" /><el-image v-if="form.icon" :src="form.icon" fit="contain" class="app-icon" /></el-form-item>
        <el-form-item label="调试地址" prop="debugUrl"><el-input v-model="form.debugUrl" placeholder="http://127.0.0.1:8787/log-defence/" /></el-form-item>
        <el-form-item label="生产地址" prop="productionUrl"><el-input v-model="form.productionUrl" placeholder="https://miniapps.loghome.ink/log-defence/" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.description" type="textarea" maxlength="500" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="-100000" :max="100000" :precision="0" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button @click="dialog=false" :disabled="saving">取消</el-button><el-button type="primary" @click="save" :loading="saving">保存</el-button></div>
    </el-dialog>
  </div>
</template>
<script>
const blank = () => ({id: '', name: '', icon: '', debugUrl: '', productionUrl: '', description: '', enabled: true, sortOrder: 0})
export default {
  data() {
    const required = message => [{required: true, message, trigger: 'blur'}]
    return {list: [], loading: false, error: '', dialog: false, editing: false, saving: false, form: blank(), rules: {
      id: required('请输入唯一小程序 ID'), name: required('请输入名称'), icon: required('请输入图标地址'), debugUrl: required('请输入调试地址'), productionUrl: required('请输入生产地址')
    }}
  },
  created() { this.load() },
  methods: {
    message(e) { return e.response && e.response.data.message || e.message || '操作失败' },
    async load() {
      this.loading = true; this.error = ''
      try { this.list = (await this.axios.get(this.$baseUrl + '/miniapps/manage')).data.data }
      catch (e) { this.error = this.message(e) }
      finally { this.loading = false }
    },
    edit(row) { this.editing = !!row; this.form = row ? {...row} : blank(); this.dialog = true; this.$nextTick(() => this.$refs.form.clearValidate()) },
    save() {
      this.$refs.form.validate(async valid => {
        if (!valid || this.saving) return
        this.saving = true
        try {
          const url = this.$baseUrl + '/miniapps/manage' + (this.editing ? '/' + encodeURIComponent(this.form.id) : '')
          await this.axios[this.editing ? 'put' : 'post'](url, this.form)
          this.dialog = false; this.$message.success('小程序已保存'); await this.load()
        } catch (e) { this.$message.error(this.message(e)) }
        finally { this.saving = false }
      })
    },
    async remove(row) {
      try { await this.$confirm('删除“' + row.name + '”的注册信息？客户端将无法再启动它。', '删除小程序', {type: 'warning'}); }
      catch { return }
      try { await this.axios.delete(this.$baseUrl + '/miniapps/manage/' + encodeURIComponent(row.id)); this.$message.success('已删除'); await this.load() }
      catch (e) { this.$message.error(this.message(e)) }
    }
  }
}
</script>
<style scoped>
.miniapps-page{padding:20px}.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.page-header h2{margin:0 0 8px}.page-header p{margin:0;color:#7b817b}.app-icon{width:44px;height:44px;margin-top:4px}.danger{color:#f56c6c}.el-alert{margin-bottom:16px}
</style>
