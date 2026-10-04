<template>
  <div class="products-manage">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新增商品</el-button>
      <el-button @click="pddVisible = true">从拼多多导入</el-button>
      <el-button @click="loadList">刷新</el-button>
    </div>
    <el-table :data="list" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="180"></el-table-column>
      <el-table-column prop="category" label="分类" width="110"></el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === 'physical' ? 'warning' : 'success'">
            {{ scope.row.type === 'physical' ? '实物' : '虚拟' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="120"><template slot-scope="scope">{{ scope.row.price }}{{ scope.row.has_variants ? ' 起' : '' }}</template></el-table-column>
      <el-table-column label="规格" width="80"><template slot-scope="scope">{{ (scope.row.variants || []).length || '单规格' }}</template></el-table-column>
      <el-table-column prop="stock" label="库存" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'on' ? 'success' : 'info'">
            {{ scope.row.status === 'on' ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="shipping_desc" label="发货时效" min-width="160"></el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="openEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handlePage"
        :current-page="page"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
      />
    </div>

    <pdd-import-dialog :visible.sync="pddVisible" @imported="loadList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="1240px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option label="虚拟" value="virtual" />
            <el-option label="实物" value="physical" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类"><el-input v-model="form.category" maxlength="80" placeholder="例如 Minecraft、写作" /></el-form-item>
        <template v-if="form.source && !form.variants.length">
          <el-form-item label="来源规格"><span>{{ form.source.sku_label }}（拼多多 {{ form.source.goods_id }}）</span></el-form-item>
          <el-form-item label="采购成本（元）">
            <el-input-number v-model="form.source.cost_cny" :min="0.01" :max="1000000" :precision="2" @change="markManualCost" />
            <el-button size="small" @click="recalculatePrice">按加价20%重新计算</el-button>
          </el-form-item>
        </template>
        <el-form-item label="价格（原木）" v-if="!form.variants.length">
          <el-input v-model.number="form.price" type="number" />
        </el-form-item>
        <el-form-item label="库存" v-if="!form.variants.length">
          <el-input v-model.number="form.stock" type="number" />
        </el-form-item>
        <el-form-item label="商品来源" v-if="form.source">
          <a :href="form.source.source_url" target="_blank" rel="noopener noreferrer">拼多多 {{ form.source.goods_id }}</a>
          <span v-if="form.source.mall_name"> · {{ form.source.mall_name }}</span>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-button size="small" @click="addVariant">新增规格</el-button>
          <el-table v-if="form.variants.length" :data="form.variants" border style="margin-top:12px">
            <el-table-column label="规格名称" min-width="200"><template slot-scope="scope"><el-input v-model="scope.row.label" maxlength="255" /></template></el-table-column>
            <el-table-column label="券前采购价（元）" width="140"><template slot-scope="scope">{{ scope.row.source ? scope.row.source.cost_cny : '—' }}</template></el-table-column>
            <el-table-column label="兑换价（原木）" width="160"><template slot-scope="scope"><el-input-number v-model="scope.row.price" :min="1" :max="99999999" :precision="0" controls-position="right" style="width:140px" /></template></el-table-column>
            <el-table-column label="库存" width="140"><template slot-scope="scope"><el-input-number v-model="scope.row.stock" :min="0" :max="2147483647" :precision="0" controls-position="right" style="width:120px" /></template></el-table-column>
            <el-table-column label="启用" width="70"><template slot-scope="scope"><el-switch v-model="scope.row.status" active-value="on" inactive-value="off" /></template></el-table-column>
            <el-table-column label="来源规格" width="150"><template slot-scope="scope">{{ scope.row.source ? scope.row.source.sku_id : '—' }}</template></el-table-column>
            <el-table-column label="操作" width="90"><template slot-scope="scope"><el-button size="mini" type="danger" @click="form.variants.splice(scope.$index, 1)">移除</el-button></template></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="封面图">
          <image-upload-field
            v-model="form.cover_url"
            button-text="点击上传封面"
            :preview-width="200"
            :preview-height="200"
            tip="只能上传图片文件，且不超过 5MB"
          />
        </el-form-item>
        <el-form-item label="发货时效">
          <el-input v-model="form.shipping_desc" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="上架" value="on" />
            <el-option label="下架" value="off" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" />
        </el-form-item>
        <el-form-item label="描述">
          <div id="editor-container"></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoading">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import E from 'wangeditor'
import ImageUploadField from '../../components/ImageUploadField.vue'
import PddImportDialog from './PddImportDialog.vue'

export default {
  name: 'ProductsManage',
  components: {
    ImageUploadField,
    PddImportDialog
  },
  data() {
    return {
      list: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      pddVisible: false,
      dialogTitle: '新增商品',
      submitLoading: false,
      editor: null,
      form: {
        id: null,
        title: '',
        type: 'virtual',
        price: 0,
        stock: 0,
        cover_url: '',
        shipping_desc: '',
        status: 'on',
        summary: '',
        description: '',
        category: '', source: null, media_urls: null, variants: []
      }
    }
  },
  mounted() {
    this.loadList()
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  },
  methods: {
    getToken() {
      let tk = JSON.parse(window.localStorage.getItem('token'))
      if (tk) tk = tk.tk
      return tk
    },
    initEditor() {
      this.$nextTick(() => {
        if (this.editor) {
          this.editor.destroy()
        }
        this.editor = new E('#editor-container')
        this.editor.config.menus = [
          'head',
          'bold',
          'fontSize',
          'italic',
          'underline',
          'strikeThrough',
          'foreColor',
          'backColor',
          'link',
          'list',
          'justify',
          'quote',
          'emoticon',
          'image',
          'table',
          'undo',
          'redo'
        ]
        this.editor.config.uploadFileName = 'img'
        this.editor.config.uploadImgServer = 'https://img.codesocean.top/upload/img'
        this.editor.config.uploadImgHooks = {
          customInsert: function (insertImg, result, editor) {
            console.log('富文本图片上传成功:', result)
            if (result && result.url) {
              insertImg(result.url)
            } else {
              console.error('富文本图片上传返回格式错误:', result)
            }
          }
        }
        this.editor.config.onchange = (html) => {
          this.form.description = html
        }
        this.editor.create()
        this.editor.txt.html(this.form.description || '')
      })
    },
    loadList() {
      this.loading = true
      axios.get(this.$baseUrl + '/manage/store/products', {
        params: { page: this.page, pageSize: this.pageSize },
        headers: { Authorization: this.getToken() }
      }).then(res => {
        if (res.data && res.data.code === 200) {
          this.list = res.data.data.list || []
          this.total = res.data.data.total || 0
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handlePage(p) {
      this.page = p
      this.loadList()
    },
    resetForm() {
      this.form = {
        id: null,
        title: '',
        type: 'virtual',
        price: 0,
        stock: 0,
        cover_url: '',
        shipping_desc: '',
        status: 'on',
        summary: '',
        description: '',
        category: '', source: null, media_urls: null, variants: []
      }
    },
    openCreate() {
      this.resetForm()
      this.dialogTitle = '新增商品'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
      })
    },
    addVariant() {
      this.form.variants.push({ label: '', price: Math.max(1, Number(this.form.price) || 1), stock: 0, status: 'on', source: null, cover_url: '' })
    },
    markManualCost() { if (this.form.source) this.form.source.price_type = 'manual' },
    recalculatePrice() {
      if (!this.form.source || !(this.form.source.cost_cny > 0)) return
      this.form.price = Math.ceil(Math.round(this.form.source.cost_cny * 100) * 120 / 100)
    },
    openEdit(row) {
      let source = null
      try { source = typeof row.source_metadata === 'string' ? JSON.parse(row.source_metadata) : row.source_metadata || null } catch (_) {}
      this.form = { ...row, source, variants: (row.variants || []).map(variant => {
        let source = null
        try { source = typeof variant.source_metadata === 'string' ? JSON.parse(variant.source_metadata) : variant.source_metadata || null } catch (_) {}
        return { ...variant, price: Number(variant.price), stock: Number(variant.stock), source }
      }) }
      this.dialogTitle = '编辑商品'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
      })
    },
    submit() {
      if (!this.form.title || !this.form.type || (!this.form.variants.length && !this.form.price)) {
        this.$message.error('请填写必填项：标题/类型/价格')
        return
      }
      if (this.form.variants.some(row => !row.label.trim() || !(row.price > 0) || !Number.isInteger(row.stock) || row.stock < 0)) { this.$message.error('请完善规格名称、价格和库存'); return }
      this.submitLoading = true
      const tk = this.getToken()
      const isEdit = !!this.form.id
      const url = isEdit
        ? (this.$baseUrl + '/manage/store/products/' + this.form.id)
        : (this.$baseUrl + '/manage/store/products')
      const method = isEdit ? 'put' : 'post'
      axios({
        url,
        method,
        data: this.form,
        headers: { Authorization: tk }
      }).then(res => {
        if (res.data && res.data.code === 200) {
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.loadList()
        } else {
          this.$message.error(res.data.msg || '保存失败')
        }
      }).catch(error => {
        this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败，请稍后重试')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    remove(row) {
      this.$confirm('确定下架该商品吗？下架后用户端将不可继续兑换。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(this.$baseUrl + '/manage/store/products/' + row.id, {
          headers: { Authorization: this.getToken() }
        }).then(() => {
          this.$message.success('已下架')
          this.loadList()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.products-manage {
  padding: 20px;
}
.toolbar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
.image-preview {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  padding: 5px;
  text-align: center;
}
.image-error {
  font-size: 30px;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.cover-upload {
  margin-top: 10px;
}
#editor-container {
  border: 1px solid #ccc;
}
</style>
