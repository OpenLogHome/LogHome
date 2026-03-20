<template>
  <div class="products-manage">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新增商品</el-button>
      <el-button @click="loadList">刷新</el-button>
    </div>
    <el-table :data="list" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
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
        <el-form-item label="价格">
          <el-input v-model.number="form.price" type="number" />
        </el-form-item>
        <el-form-item label="库存" v-if="form.type === 'physical'">
          <el-input v-model.number="form.stock" type="number" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.cover_url" placeholder="请输入图片URL" />
          <div class="image-preview" v-if="form.cover_url">
            <el-image :src="form.cover_url" style="max-width: 200px; max-height: 200px;" fit="contain">
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <el-upload
            class="cover-upload"
            action="http://img.codesocean.top/upload/img"
            :show-file-list="false"
            :headers="uploadHeaders"
            :on-success="handleCoverUploadSuccess"
            :on-error="handleCoverUploadError"
            :on-progress="handleCoverUploadProgress"
            :before-upload="beforeCoverUpload"
            :disabled="uploading"
            accept="image/*"
            name="img">
            <el-button size="small" type="primary" :loading="uploading">
              {{ uploading ? `上传中 ${uploadProgress}%` : '点击上传封面' }}
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
          </el-upload>
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
      editor: null,
      uploadHeaders: {
        apikey: 'iSnMUQ9OLZpCVY3p7E3T5b2YwC39TS'
      },
      uploadProgress: 0,
      uploading: false,
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
        description: ''
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
        this.editor.config.uploadImgServer = 'http://img.codesocean.top/upload/img'
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
    beforeCoverUpload(file) {
      const isImage = file.type.indexOf('image/') === 0
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!')
        return false
      }
      this.uploading = true
      this.uploadProgress = 0
      return true
    },
    handleCoverUploadProgress(event) {
      this.uploadProgress = Math.floor(event.percent)
    },
    handleCoverUploadSuccess(response) {
      console.log('封面上传成功:', response)
      this.uploading = false
      this.uploadProgress = 0
      if (response && response.url) {
        this.form.cover_url = response.url
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败，返回格式错误')
      }
    },
    handleCoverUploadError() {
      this.uploading = false
      this.uploadProgress = 0
      this.$message.error('上传失败，请重试')
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
        description: ''
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
    openEdit(row) {
      this.form = { ...row }
      this.dialogTitle = '编辑商品'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
      })
    },
    submit() {
      if (!this.form.title || !this.form.type || !this.form.price) {
        this.$message.error('请填写必填项：标题/类型/价格')
        return
      }
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
        axios.delete(this.$baseUrl + '/manage/store/products/' + row.id, {
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
