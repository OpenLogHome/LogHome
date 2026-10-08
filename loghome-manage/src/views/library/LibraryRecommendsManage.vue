<template>
  <div class="library-recommends-page">
    <div class="page-header">
      <div>
        <h2>榜单推荐管理</h2>
        <p>维护书库推荐位（按榜单名分组的小说列表）与首页合集展示配置。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="推荐位" name="recommends">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-select v-model="selectedTitle" filterable allow-create default-first-option placeholder="选择或输入榜单名称" style="width: 260px" @change="fetchNovels">
              <el-option v-for="item in titles" :key="item.title" :label="`${item.title}（${item.cnt}）`" :value="item.title" />
            </el-select>
            <el-button type="primary" :disabled="!selectedTitle" @click="openAddNovelDialog">添加小说</el-button>
            <el-button @click="refreshTitles">刷新榜单列表</el-button>
          </div>
        </el-card>

        <el-table :data="novels" border v-loading="loading" style="width: 100%">
          <el-table-column prop="recommend_id" label="ID" width="80" />
          <el-table-column label="小说" min-width="220">
            <template slot-scope="scope">
              <el-link v-if="scope.row.novel_name" type="primary" :href="'#/novelsManage'" :underline="false">
                {{ scope.row.novel_name }}
              </el-link>
              <el-tag v-else type="danger" size="small">已删除</el-tag>
              <span class="novel-id-text">（ID: {{ scope.row.novel_id }}）</span>
            </template>
          </el-table-column>
          <el-table-column prop="router" label="自定义路由" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.router || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="ranking" label="排序值" width="100" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="danger-text" @click="handleRemoveNovel(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="首页合集" name="collections">
        <div class="tab-toolbar">
          <el-button type="primary" @click="openCollectionDialog()">新增合集</el-button>
        </div>
        <el-table :data="collections" border v-loading="collectionsLoading" style="width: 100%">
          <el-table-column prop="collection_id" label="ID" width="80" />
          <el-table-column label="图标" width="90">
            <template slot-scope="scope">
              <img v-if="scope.row.icon" :src="scope.row.icon" class="collection-icon" />
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="collection_title" label="合集名称" min-width="180" />
          <el-table-column label="类型" width="130">
            <template slot-scope="scope">
              {{ getTypeText(scope.row.collection_type) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90" align="center">
            <template slot-scope="scope">
              <el-tag :type="Number(scope.row.isValid) === 1 ? 'success' : 'info'" size="small">
                {{ Number(scope.row.isValid) === 1 ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openCollectionDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="small" class="danger-text" @click="handleDeleteCollection(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加小说对话框 -->
    <el-dialog title="添加小说到榜单" :visible.sync="addDialogVisible" width="640px">
      <el-form label-width="100px">
        <el-form-item label="榜单名称">
          <el-input :value="selectedTitle" disabled />
        </el-form-item>
        <el-form-item label="选择小说" required>
          <div class="novel-search-row">
            <el-input v-model="novelKeyword" placeholder="搜索小说名称" clearable @keyup.enter.native="searchNovels">
              <el-button slot="append" icon="el-icon-search" @click="searchNovels"></el-button>
            </el-input>
          </div>
          <el-table :data="novelSearchResults" border max-height="360" highlight-current-row @current-change="handleNovelSelect">
            <el-table-column prop="novel_id" label="ID" width="80" />
            <el-table-column prop="name" label="小说名" min-width="160" show-overflow-tooltip />
            <el-table-column prop="author_name" label="作者" min-width="100" show-overflow-tooltip />
          </el-table>
          <div class="form-tip">点击行选中，选中后自动填入</div>
        </el-form-item>
        <el-form-item v-if="selectedNovel" label="已选小说">
          <el-tag closable @close="selectedNovel = null">
            {{ selectedNovel.name }}（ID: {{ selectedNovel.novel_id }}）
          </el-tag>
        </el-form-item>
        <el-form-item label="自定义路由">
          <el-input v-model="addRouter" placeholder="选填，覆盖默认跳转" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" :disabled="!selectedNovel" @click="submitAddNovel">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 合集编辑对话框 -->
    <el-dialog :title="collectionDialogTitle" :visible.sync="collectionDialogVisible" width="560px" @close="resetCollectionForm">
      <el-form ref="collectionForm" :model="collectionForm" :rules="collectionRules" label-width="100px">
        <el-form-item label="合集名称" prop="collection_title">
          <el-input v-model="collectionForm.collection_title" placeholder="对应推荐位榜单名称，例如：原木力爆棚" />
        </el-form-item>
        <el-form-item label="展示类型" prop="collection_type">
          <el-select v-model="collectionForm.collection_type" style="width: 100%">
            <el-option label="滑动（slide）" value="slide" />
            <el-option label="卡片（cards）" value="cards" />
            <el-option label="密集卡片（dense_card）" value="dense_card" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标">
          <image-upload-field
            v-model="collectionForm.icon"
            button-text="上传图标"
            :preview-width="80"
            :preview-height="80"
            tip="选填"
          />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="collectionForm.isValid" active-text="启用" inactive-text="停用" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="collectionDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="collectionSubmitLoading" @click="submitCollectionForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageUploadField from '../../components/ImageUploadField.vue'

export default {
  name: 'LibraryRecommendsManage',
  components: {
    ImageUploadField
  },
  data() {
    return {
      activeTab: 'recommends',
      loading: false,
      collectionsLoading: false,
      titles: [],
      selectedTitle: '',
      novels: [],
      // 添加小说
      addDialogVisible: false,
      addLoading: false,
      novelKeyword: '',
      novelSearchResults: [],
      selectedNovel: null,
      addRouter: '',
      // 合集
      collections: [],
      collectionDialogVisible: false,
      collectionDialogTitle: '新增合集',
      collectionSubmitLoading: false,
      collectionForm: {
        collection_id: null,
        collection_title: '',
        collection_type: 'slide',
        icon: '',
        isValid: true
      },
      collectionRules: {
        collection_title: [
          { required: true, message: '请输入合集名称', trigger: 'blur' }
        ],
        collection_type: [
          { required: true, message: '请选择展示类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.refreshTitles()
    this.fetchCollections()
  },
  methods: {
    handleTabClick(tab) {
      if (tab.name === 'collections' && this.collections.length === 0) {
        this.fetchCollections()
      }
    },
    refreshTitles() {
      this.axios.get(this.$baseUrl + '/manage/library-recommends/titles').then(response => {
        this.titles = response.data || []
        if (!this.selectedTitle && this.titles.length > 0) {
          this.selectedTitle = this.titles[0].title
        }
        if (this.selectedTitle) {
          this.fetchNovels()
        }
      }).catch(error => {
        console.error('获取榜单列表失败', error)
        this.$message.error('获取榜单列表失败')
      })
    },
    fetchNovels() {
      if (!this.selectedTitle) {
        return
      }
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/library-recommends', {
        params: { title: this.selectedTitle }
      }).then(response => {
        this.novels = response.data || []
      }).catch(error => {
        console.error('获取榜单小说失败', error)
        this.$message.error('获取榜单小说失败')
      }).finally(() => {
        this.loading = false
      })
    },
    openAddNovelDialog() {
      this.novelKeyword = ''
      this.novelSearchResults = []
      this.selectedNovel = null
      this.addRouter = ''
      this.addDialogVisible = true
      this.searchNovels()
    },
    searchNovels() {
      if (!this.novelKeyword.trim()) {
        this.novelSearchResults = []
        return
      }
      this.axios.get(this.$baseUrl + '/manage/library/get_all_novels', {
        params: {
          keyword: this.novelKeyword.trim(),
          page: 1,
          pageSize: 10
        }
      }).then(response => {
        const data = response.data || {}
        this.novelSearchResults = data.list || data.results || []
      }).catch(error => {
        console.error('搜索小说失败', error)
        this.$message.error('搜索小说失败')
      })
    },
    handleNovelSelect(row) {
      this.selectedNovel = row
    },
    submitAddNovel() {
      if (!this.selectedNovel) {
        this.$message.warning('请先选择小说')
        return
      }
      this.addLoading = true
      this.axios.post(this.$baseUrl + '/manage/library-recommends', {
        title: this.selectedTitle,
        novel_id: this.selectedNovel.novel_id,
        router: this.addRouter
      }).then(() => {
        this.$message.success('已添加到榜单')
        this.addDialogVisible = false
        this.fetchNovels()
      }).catch(error => {
        this.$message.error((error.response && error.response.data && error.response.data.msg) || '添加失败')
      }).finally(() => {
        this.addLoading = false
      })
    },
    handleRemoveNovel(row) {
      this.$confirm(`确定将「${row.novel_name || row.novel_id}」移出榜单「${row.title}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/library-recommends/' + row.recommend_id)
          .then(() => {
            this.$message.success('已移除')
            this.fetchNovels()
          }).catch(error => {
            console.error('移除失败', error)
            this.$message.error('移除失败')
          })
      }).catch(() => {})
    },
    fetchCollections() {
      this.collectionsLoading = true
      this.axios.get(this.$baseUrl + '/manage/library-recommends/collections').then(response => {
        this.collections = response.data || []
      }).catch(error => {
        console.error('获取合集失败', error)
        this.$message.error('获取合集失败')
      }).finally(() => {
        this.collectionsLoading = false
      })
    },
    openCollectionDialog(row) {
      if (row) {
        this.collectionDialogTitle = '编辑合集'
        this.collectionForm = {
          collection_id: row.collection_id,
          collection_title: row.collection_title || '',
          collection_type: row.collection_type || 'slide',
          icon: row.icon || '',
          isValid: Number(row.isValid) === 1
        }
      } else {
        this.collectionDialogTitle = '新增合集'
        this.collectionForm = {
          collection_id: null,
          collection_title: '',
          collection_type: 'slide',
          icon: '',
          isValid: true
        }
      }
      this.collectionDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.collectionForm) {
          this.$refs.collectionForm.clearValidate()
        }
      })
    },
    resetCollectionForm() {
      if (this.$refs.collectionForm) {
        this.$refs.collectionForm.resetFields()
      }
    },
    submitCollectionForm() {
      this.$refs.collectionForm.validate(valid => {
        if (!valid) {
          return
        }
        this.collectionSubmitLoading = true
        const payload = {
          collection_title: this.collectionForm.collection_title.trim(),
          collection_type: this.collectionForm.collection_type,
          icon: this.collectionForm.icon || '',
          isValid: this.collectionForm.isValid ? 1 : 0
        }
        const original = this.collections.find(row => row.collection_id === this.collectionForm.collection_id)
        const originalTitle = original && original.collection_title
        let request
        if (this.collectionForm.collection_id) {
          request = this.axios.put(this.$baseUrl + '/manage/library-recommends/collections/' + this.collectionForm.collection_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/library-recommends/collections', payload)
        }
        request.then(() => {
          this.$message.success(this.collectionForm.collection_id ? '合集已更新' : '合集已创建')
          this.collectionDialogVisible = false
          if (this.selectedTitle === originalTitle) this.selectedTitle = payload.collection_title
          this.fetchCollections()
          this.refreshTitles()
        }).catch(error => {
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.collectionSubmitLoading = false
        })
      })
    },
    handleDeleteCollection(row) {
      this.$confirm(`确定删除合集「${row.collection_title}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/library-recommends/collections/' + row.collection_id)
          .then(() => {
            this.$message.success('合集已删除')
            this.fetchCollections()
          }).catch(error => {
            console.error('删除合集失败', error)
            this.$message.error('删除合集失败')
          })
      }).catch(() => {})
    },
    getTypeText(type) {
      const map = {
        slide: '滑动',
        cards: '卡片',
        dense_card: '密集卡片'
      }
      return map[type] || type || '--'
    }
  }
}
</script>

<style scoped lang="scss">
.library-recommends-page {
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

.tab-toolbar {
  margin-bottom: 20px;
}

.novel-id-text {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

.novel-search-row {
  margin-bottom: 12px;
}

.collection-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 6px;
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
