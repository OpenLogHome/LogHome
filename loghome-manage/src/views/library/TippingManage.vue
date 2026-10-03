<template>
  <div class="tipping-page">
    <div class="page-header">
      <div>
        <h2>打赏与粉丝团管理</h2>
        <p>配置打赏档位、查看打赏记录与粉丝团留言。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 打赏档位 -->
      <el-tab-pane label="打赏档位" name="items">
        <div class="tab-toolbar">
          <el-button type="primary" @click="openItemDialog()">新增档位</el-button>
        </div>
        <el-table :data="items" border v-loading="itemsLoading" style="width: 100%">
          <el-table-column prop="sort_id" label="排序" width="80" />
          <el-table-column label="图标" width="90">
            <template slot-scope="scope">
              <img v-if="scope.row.img_url" :src="scope.row.img_url" class="item-icon" />
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="item_name" label="档位名称" min-width="150" />
          <el-table-column prop="item_cost" label="价格（原木）" width="130" />
          <el-table-column label="使用原木" width="110" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.is_log_free === 1 ? 'success' : 'info'" size="small">
                {{ scope.row.is_log_free === 1 ? '免费苹果' : '付费原木' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openItemDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="small" class="danger-text" @click="handleDeleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 打赏记录 -->
      <el-tab-pane label="打赏记录" name="records">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input v-model="recordKeyword" clearable class="keyword-input" placeholder="搜索用户或小说" @keyup.enter.native="fetchRecords">
              <el-button slot="append" icon="el-icon-search" @click="fetchRecords"></el-button>
            </el-input>
            <el-button type="primary" @click="fetchRecords">查询</el-button>
          </div>
        </el-card>
        <el-table :data="records" border v-loading="recordsLoading" style="width: 100%">
          <el-table-column prop="tipping_id" label="ID" width="80" />
          <el-table-column label="用户" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.from_name || scope.row.from_id }}
            </template>
          </el-table-column>
          <el-table-column prop="novel_name" label="小说" min-width="150" show-overflow-tooltip />
          <el-table-column prop="item_name" label="档位" min-width="120" />
          <el-table-column prop="item_amount" label="数量" width="80" />
          <el-table-column prop="item_cost" label="总价（原木）" width="120" />
          <el-table-column prop="tipping_time" label="时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.tipping_time) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 粉丝团留言 -->
      <el-tab-pane label="粉丝团留言" name="fanMessages">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-input v-model="fanKeyword" clearable class="keyword-input" placeholder="搜索用户或留言内容" @keyup.enter.native="fetchFanMessages">
              <el-button slot="append" icon="el-icon-search" @click="fetchFanMessages"></el-button>
            </el-input>
            <el-button type="primary" @click="fetchFanMessages">查询</el-button>
          </div>
        </el-card>
        <el-table :data="fanMessages" border v-loading="fanLoading" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="novel_name" label="小说" min-width="150" show-overflow-tooltip />
          <el-table-column label="用户" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.user_name || scope.row.user_id }}
            </template>
          </el-table-column>
          <el-table-column prop="message" label="留言" min-width="260" show-overflow-tooltip />
          <el-table-column prop="create_time" label="时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="danger-text" @click="handleDeleteFanMessage(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 打赏档位对话框 -->
    <el-dialog :title="itemDialogTitle" :visible.sync="itemDialogVisible" width="520px" @close="resetItemForm">
      <el-form ref="itemForm" :model="itemForm" :rules="itemRules" label-width="120px">
        <el-form-item label="档位名称" prop="item_name">
          <el-input v-model="itemForm.item_name" placeholder="例如：催更符" />
        </el-form-item>
        <el-form-item label="价格（原木）" prop="item_cost">
          <el-input-number v-model="itemForm.item_cost" :min="1" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="消耗类型">
          <el-radio-group v-model="itemForm.is_log_free">
            <el-radio :label="0">付费原木</el-radio>
            <el-radio :label="1">免费苹果</el-radio>
          </el-radio-group>
          <div class="form-tip">免费苹果不消耗用户原木余额</div>
        </el-form-item>
        <el-form-item label="图标" prop="img_url">
          <image-upload-field v-model="itemForm.img_url" button-text="上传图标" :preview-width="48" :preview-height="48" />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="itemForm.sort_id" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="itemDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="itemSubmitLoading" @click="submitItemForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import ImageUploadField from '../../components/ImageUploadField.vue'

export default {
  name: 'TippingManage',
  components: {
    ImageUploadField
  },
  data() {
    return {
      activeTab: 'items',
      // 档位
      itemsLoading: false,
      items: [],
      itemDialogVisible: false,
      itemDialogTitle: '新增档位',
      itemSubmitLoading: false,
      itemForm: {
        item_name: '',
        item_cost: 5,
        is_log_free: 0,
        img_url: '',
        sort_id: 0
      },
      itemRules: {
        item_name: [{ required: true, message: '请输入档位名称', trigger: 'blur' }],
        item_cost: [{ required: true, message: '请输入价格', trigger: 'change' }],
        img_url: [{ required: true, message: '请上传档位图标', trigger: 'change' }]
      },
      // 记录
      recordsLoading: false,
      records: [],
      recordKeyword: '',
      // 粉丝留言
      fanLoading: false,
      fanMessages: [],
      fanKeyword: ''
    }
  },
  created() {
    this.fetchItems()
    this.fetchRecords()
    this.fetchFanMessages()
  },
  methods: {
    fetchItems() {
      this.itemsLoading = true
      this.axios.get(this.$baseUrl + '/manage/tipping/items').then(response => {
        this.items = response.data || []
      }).catch(error => {
        console.error('获取打赏档位失败', error)
        this.$message.error('获取打赏档位失败')
      }).finally(() => {
        this.itemsLoading = false
      })
    },
    openItemDialog(row) {
      if (row) {
        this.itemDialogTitle = '编辑档位'
        this.itemForm = {
          original_name: row.item_name,
          item_name: row.item_name || '',
          item_cost: row.item_cost || 1,
          is_log_free: row.is_log_free === 1 ? 1 : 0,
          img_url: row.img_url || '',
          sort_id: row.sort_id || 0
        }
      } else {
        this.itemDialogTitle = '新增档位'
        this.itemForm = {
          original_name: '',
          item_name: '',
          item_cost: 5,
          is_log_free: 0,
          img_url: '',
          sort_id: this.items.length
        }
      }
      this.itemDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.itemForm) {
          this.$refs.itemForm.clearValidate()
        }
      })
    },
    resetItemForm() {
      if (this.$refs.itemForm) {
        this.$refs.itemForm.resetFields()
      }
    },
    submitItemForm() {
      this.$refs.itemForm.validate(valid => {
        if (!valid) {
          return
        }
        this.itemSubmitLoading = true
        const payload = {
          item_name: this.itemForm.item_name.trim(),
          item_cost: this.itemForm.item_cost,
          is_log_free: this.itemForm.is_log_free,
          img_url: this.itemForm.img_url,
          sort_id: this.itemForm.sort_id
        }
        const originalName = this.itemForm.original_name || ''
        let request
        if (originalName) {
          request = this.axios.put(this.$baseUrl + '/manage/tipping/items/' + encodeURIComponent(originalName), payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/tipping/items', payload)
        }
        request.then(() => {
          this.$message.success(originalName ? '档位已更新' : '档位已创建')
          this.itemDialogVisible = false
          this.fetchItems()
        }).catch(error => {
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.itemSubmitLoading = false
        })
      })
    },
    handleDeleteItem(row) {
      this.$confirm(`确定删除档位「${row.item_name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/tipping/items/' + encodeURIComponent(row.item_name))
          .then(() => {
            this.$message.success('已删除')
            this.fetchItems()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    fetchRecords() {
      this.recordsLoading = true
      this.axios.get(this.$baseUrl + '/manage/tipping/records', {
        params: { keyword: this.recordKeyword }
      }).then(response => {
        this.records = response.data || []
      }).catch(error => {
        console.error('获取打赏记录失败', error)
        this.$message.error('获取打赏记录失败')
      }).finally(() => {
        this.recordsLoading = false
      })
    },
    fetchFanMessages() {
      this.fanLoading = true
      this.axios.get(this.$baseUrl + '/manage/tipping/fan-messages', {
        params: { keyword: this.fanKeyword }
      }).then(response => {
        this.fanMessages = response.data || []
      }).catch(error => {
        console.error('获取粉丝留言失败', error)
        this.$message.error('获取粉丝留言失败')
      }).finally(() => {
        this.fanLoading = false
      })
    },
    handleDeleteFanMessage(row) {
      this.$confirm('确定删除该粉丝留言吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/tipping/fan-messages/' + row.id)
          .then(() => {
            this.$message.success('已删除')
            this.fetchFanMessages()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    formatDate(value) {
      if (!value) {
        return '--'
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped lang="scss">
.tipping-page {
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

.keyword-input {
  width: 280px;
}

.tab-toolbar {
  margin-bottom: 20px;
}

.item-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

.danger-text {
  color: #f56c6c;
}
</style>
