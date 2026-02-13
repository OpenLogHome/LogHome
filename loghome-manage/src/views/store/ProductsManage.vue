<template>
  <div class="products-manage">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新增商品</el-button>
      <el-button @click="loadList">刷新</el-button>
    </div>
    <el-table :data="list" border v-loading="loading">
      <el-table-column prop="product_id" label="ID" width="80"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === 'physical' ? 'warning' : 'success'">
            {{ scope.row.type === 'physical' ? '实物' : '虚拟' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
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
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="640px">
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
        <el-form-item label="价格">
          <el-input v-model.number="form.price" type="number" />
        </el-form-item>
        <el-form-item label="库存" v-if="form.type === 'physical'">
          <el-input v-model.number="form.stock" type="number" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.cover_url" />
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
          <el-input type="textarea" v-model="form.description" />
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

export default {
  name: 'ProductsManage',
  data() {
    return {
      list: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '新增商品',
      submitLoading: false,
      form: {
        product_id: null,
        title: '',
        type: 'virtual',
        price: 0,
        stock: 0,
        cover_url: '',
        shipping_desc: '',
        status: 'on',
        summary: '',
        description: ''
      }
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    getToken() {
      let tk = JSON.parse(window.localStorage.getItem('token'))
      if (tk) tk = tk.tk
      return tk
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
        product_id: null,
        title: '',
        type: 'virtual',
        price: 0,
        stock: 0,
        cover_url: '',
        shipping_desc: '',
        status: 'on',
        summary: '',
        description: ''
      }
    },
    openCreate() {
      this.resetForm()
      this.dialogTitle = '新增商品'
      this.dialogVisible = true
    },
    openEdit(row) {
      this.form = { ...row }
      this.dialogTitle = '编辑商品'
      this.dialogVisible = true
    },
    submit() {
      if (!this.form.title || !this.form.type || !this.form.price) {
        this.$message.error('请填写必填项：标题/类型/价格')
        return
      }
      this.submitLoading = true
      const tk = this.getToken()
      const isEdit = !!this.form.product_id
      const url = isEdit
        ? (this.$baseUrl + '/manage/store/products/' + this.form.product_id)
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
      }).finally(() => {
        this.submitLoading = false
      })
    },
    remove(row) {
      this.$confirm('确定删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(this.$baseUrl + '/manage/store/products/' + row.product_id, {
          headers: { Authorization: this.getToken() }
        }).then(() => {
          this.$message.success('已删除')
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
</style>
