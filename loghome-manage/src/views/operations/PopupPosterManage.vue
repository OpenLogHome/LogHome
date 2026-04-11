<template>
  <div class="popup-poster-page">
    <div class="page-header">
      <div>
        <h2>弹窗海报管理</h2>
        <p>配置业务端指定页面的弹窗海报，控制展示时段和点击跳转。</p>
      </div>
      <el-button type="primary" @click="openDialog()">新增弹窗海报</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索页面路径或跳转链接"
          @keyup.enter.native="fetchData"
        >
          <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="海报" width="150">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.image_url"
            style="width: 110px; height: 160px"
            fit="cover"
            :preview-src-list="[scope.row.image_url]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="page_url" label="展示页面" min-width="220" show-overflow-tooltip />
      <el-table-column prop="target_url" label="跳转链接" min-width="220" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.target_url || '无跳转' }}
        </template>
      </el-table-column>
      <el-table-column label="投放时间" min-width="320">
        <template slot-scope="scope">
          {{ formatDate(scope.row.start_time) }} 至 {{ formatDate(scope.row.end_time) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row)">{{ getStatusText(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="640px" @close="resetForm">
      <el-form ref="posterForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="展示页面" prop="page_url">
          <el-input
            v-model="form.page_url"
            placeholder="请输入前台页面路径，例如 / 或 /pages/community/frame/index"
          />
        </el-form-item>
        <el-form-item label="海报图片" prop="image_url">
          <image-upload-field
            v-model="form.image_url"
            button-text="上传弹窗海报"
            :preview-width="280"
            :preview-height="380"
            tip="建议上传竖版海报，方便移动端弹窗展示，大小不超过 5MB"
          />
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input
            v-model="form.target_url"
            placeholder="可选，点击海报后跳转；留空表示只展示不跳转"
          />
        </el-form-item>
        <el-form-item label="投放时间" prop="date_range">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            @change="handleDateRangeChange"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import ImageUploadField from '../../components/ImageUploadField.vue'

export default {
  name: 'PopupPosterManage',
  components: {
    ImageUploadField
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '新增弹窗海报',
      keyword: '',
      list: [],
      form: {
        id: null,
        page_url: '',
        image_url: '',
        target_url: '',
        start_time: '',
        end_time: ''
      },
      dateRange: [],
      rules: {
        page_url: [
          { required: true, message: '请输入展示页面路径', trigger: 'blur' }
        ],
        image_url: [
          { required: true, message: '请上传海报图片', trigger: 'change' }
        ],
        date_range: [
          {
            validator: (rule, value, callback) => {
              if (!this.form.start_time || !this.form.end_time) {
                callback(new Error('请选择投放时间'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/popup-posters', {
        params: {
          keyword: this.keyword
        }
      }).then(response => {
        this.list = response.data || []
      }).catch(error => {
        console.error('获取弹窗海报失败', error)
        this.$message.error('获取弹窗海报失败')
      }).finally(() => {
        this.loading = false
      })
    },
    resetSearch() {
      this.keyword = ''
      this.fetchData()
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑弹窗海报'
        this.form = {
          id: row.id,
          page_url: row.page_url || '',
          image_url: row.image_url || '',
          target_url: row.target_url || '',
          start_time: row.start_time || '',
          end_time: row.end_time || ''
        }
        this.dateRange = [this.form.start_time, this.form.end_time]
      } else {
        this.dialogTitle = '新增弹窗海报'
        this.form = {
          id: null,
          page_url: '',
          image_url: '',
          target_url: '',
          start_time: '',
          end_time: ''
        }
        this.dateRange = []
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.posterForm) {
          this.$refs.posterForm.clearValidate()
        }
      })
    },
    resetForm() {
      if (this.$refs.posterForm) {
        this.$refs.posterForm.resetFields()
      }
      this.dateRange = []
    },
    handleDateRangeChange(value) {
      if (value && value.length === 2) {
        this.form.start_time = value[0]
        this.form.end_time = value[1]
      } else {
        this.form.start_time = ''
        this.form.end_time = ''
      }
    },
    submitForm() {
      this.$refs.posterForm.validate(valid => {
        if (!valid) {
          return
        }

        this.submitLoading = true
        const payload = {
          page_url: this.form.page_url.trim(),
          image_url: this.form.image_url,
          target_url: (this.form.target_url || '').trim(),
          start_time: this.form.start_time,
          end_time: this.form.end_time
        }

        let request
        if (this.form.id) {
          request = this.axios.put(this.$baseUrl + '/manage/popup-posters/' + this.form.id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/popup-posters', payload)
        }

        request.then(() => {
          this.$message.success(this.form.id ? '弹窗海报已更新' : '弹窗海报已创建')
          this.dialogVisible = false
          this.fetchData()
        }).catch(error => {
          console.error('保存弹窗海报失败', error)
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
    handleDelete(row) {
      this.$confirm('删除后该弹窗海报将不再展示，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/popup-posters/' + row.id)
          .then(() => {
            this.$message.success('弹窗海报已删除')
            this.fetchData()
          }).catch(error => {
            console.error('删除弹窗海报失败', error)
            this.$message.error('删除弹窗海报失败')
          })
      }).catch(() => {})
    },
    formatDate(value) {
      if (!value) {
        return '--'
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    getStatusText(row) {
      const now = moment()
      if (moment(row.start_time).isAfter(now)) {
        return '未开始'
      }
      if (moment(row.end_time).isBefore(now)) {
        return '已过期'
      }
      return '生效中'
    },
    getStatusType(row) {
      const status = this.getStatusText(row)
      if (status === '生效中') {
        return 'success'
      }
      if (status === '未开始') {
        return 'warning'
      }
      return 'info'
    }
  }
}
</script>

<style scoped lang="scss">
.popup-poster-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0;
    color: #909399;
  }
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  width: 180px;
}

.keyword-input {
  width: 320px;
}

.danger-text {
  color: #f56c6c;
}
</style>
