<template>
  <div class="site-settings-page">
    <div class="page-header">
      <div>
        <h2>站点设置</h2>
        <p>配置全站基础参数，保存后客户端刷新即生效。</p>
      </div>
      <el-button type="primary" :loading="saving" @click="save">保 存</el-button>
    </div>

    <el-card shadow="never" v-loading="loading">
      <el-form label-width="120px" style="max-width: 640px">
        <el-form-item label="哀悼模式">
          <el-switch v-model="form.mourn" active-text="开启" inactive-text="关闭" />
          <div class="form-tip">开启后全站页面变灰，用于重大事件哀悼日</div>
        </el-form-item>
        <el-form-item label="开屏页图片">
          <image-upload-field
            v-model="form.opening_page"
            button-text="上传开屏页"
            :preview-width="180"
            :preview-height="320"
            tip="客户端启动时展示的开屏图，选填"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import ImageUploadField from '../../components/ImageUploadField.vue'

export default {
  name: 'SiteSettingsManage',
  components: {
    ImageUploadField
  },
  data() {
    return {
      loading: false,
      saving: false,
      form: {
        mourn: false,
        opening_page: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/site-settings').then(response => {
        const data = response.data || {}
        this.form.mourn = data.mourn === 1
        this.form.opening_page = data.opening_page || ''
      }).catch(error => {
        console.error('获取站点设置失败', error)
        this.$message.error('获取站点设置失败')
      }).finally(() => {
        this.loading = false
      })
    },
    save() {
      this.saving = true
      this.axios.put(this.$baseUrl + '/manage/site-settings', {
        mourn: this.form.mourn ? 1 : 0,
        opening_page: this.form.opening_page
      }).then(() => {
        this.$message.success('站点设置已保存')
      }).catch(error => {
        console.error('保存站点设置失败', error)
        this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
      }).finally(() => {
        this.saving = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.site-settings-page {
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

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}
</style>
