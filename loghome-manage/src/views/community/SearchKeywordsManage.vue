<template>
  <div class="keywords-manage">
    <div class="page-header">
      <div>
        <h2>搜索关键词运营</h2>
        <p>维护搜索推荐词、分类和推荐状态，给社区搜索与发现提供运营支撑。</p>
      </div>
      <el-button type="primary" @click="openDialog()">新增关键词</el-button>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">生效关键词</div>
          <div class="stat-value">{{ stats.overall.total_keywords || 0 }}</div>
          <div class="stat-desc">当前已纳入搜索词库的关键词数量</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">累计搜索量</div>
          <div class="stat-value">{{ stats.overall.total_searches || 0 }}</div>
          <div class="stat-desc">用于判断热点和高频检索方向</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">推荐词数量</div>
          <div class="stat-value">{{ stats.overall.recommended_count || 0 }}</div>
          <div class="stat-desc">前台优先曝光的推荐词</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keywordFilter"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索关键词"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-select v-model="categoryFilter" class="filter-item" placeholder="分类">
          <el-option label="全部分类" value="all"></el-option>
          <el-option
            v-for="item in filterCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="recommendedFilter" clearable class="filter-item" placeholder="推荐状态">
          <el-option label="全部状态" value=""></el-option>
          <el-option label="推荐词" :value="1"></el-option>
          <el-option label="普通词" :value="0"></el-option>
        </el-select>
        <el-select v-model="sort" class="filter-item" placeholder="排序方式">
          <el-option label="按搜索量" value="count"></el-option>
          <el-option label="按最近搜索" value="recent"></el-option>
          <el-option label="按字母顺序" value="alpha"></el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <div class="category-tags" v-if="stats.categories.length">
        <span class="category-title">分类概览</span>
        <el-tag
          v-for="item in stats.categories"
          :key="item.category"
          effect="plain"
          class="category-tag"
        >
          {{ formatCategory(item.category) }} / {{ item.count }}词 / {{ item.total_searches }}次
        </el-tag>
      </div>
    </el-card>

    <el-table v-loading="loading" :data="list" border style="width: 100%">
      <el-table-column prop="keyword_id" label="ID" width="80" />
      <el-table-column prop="keyword" label="关键词" min-width="180" />
      <el-table-column prop="search_count" label="搜索量" width="120" />
      <el-table-column label="分类" width="140">
        <template slot-scope="scope">
          <el-tag effect="plain">{{ formatCategory(scope.row.category) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_recommended ? 'success' : 'info'">
            {{ scope.row.is_recommended ? '推荐词' : '普通词' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最近搜索" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.last_searched_at) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px" @close="resetForm">
      <el-form ref="keywordForm" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="form.keyword" maxlength="30" placeholder="请输入搜索关键词" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select
            v-model="form.category"
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in allCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="推荐词">
          <el-switch
            v-model="form.is_recommended"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
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

export default {
  name: 'SearchKeywordsManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '新增关键词',
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      keywordFilter: '',
      categoryFilter: 'all',
      recommendedFilter: '',
      sort: 'count',
      stats: {
        overall: {
          total_keywords: 0,
          total_searches: 0,
          recommended_count: 0
        },
        categories: []
      },
      form: {
        keyword_id: null,
        keyword: '',
        category: 'all',
        is_recommended: 1
      },
      baseCategories: [
        { value: 'all', label: '综合' },
        { value: 'post', label: '帖子' },
        { value: 'circle', label: '圈子' },
        { value: 'user', label: '用户' },
        { value: 'article', label: '文章' }
      ],
      rules: {
        keyword: [
          { required: true, message: '请输入关键词', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    filterCategoryOptions() {
      return this.allCategoryOptions.filter(item => item.value !== 'all')
    },
    allCategoryOptions() {
      const map = {}
      const result = []
      const pushOption = (value, label) => {
        if (!value || map[value]) {
          return
        }
        map[value] = true
        result.push({
          value: value,
          label: label || this.formatCategory(value)
        })
      }

      this.baseCategories.forEach(item => {
        pushOption(item.value, item.label)
      })
      this.stats.categories.forEach(item => {
        pushOption(item.category, this.formatCategory(item.category))
      })
      if (this.form.category) {
        pushOption(this.form.category, this.formatCategory(this.form.category))
      }

      return result
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.axios.get(this.$baseUrl + '/manage/community/search/keywords', {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keywordFilter,
          category: this.categoryFilter,
          is_recommended: this.recommendedFilter,
          sort: this.sort
        }
      }).then(response => {
        const data = response.data || {}
        this.list = data.list || []
        this.total = Number(data.total || 0)
        this.stats = data.stats || this.stats
      }).catch(error => {
        console.error('获取搜索关键词失败', error)
        this.$message.error(this.getErrorMessage(error, '获取搜索关键词失败'))
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    resetSearch() {
      this.keywordFilter = ''
      this.categoryFilter = 'all'
      this.recommendedFilter = ''
      this.sort = 'count'
      this.handleSearch()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchData()
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑关键词'
        this.form = {
          keyword_id: row.keyword_id,
          keyword: row.keyword,
          category: row.category || 'all',
          is_recommended: Number(row.is_recommended) ? 1 : 0
        }
      } else {
        this.dialogTitle = '新增关键词'
        this.form = {
          keyword_id: null,
          keyword: '',
          category: 'all',
          is_recommended: 1
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.keywordForm) {
          this.$refs.keywordForm.clearValidate()
        }
      })
    },
    resetForm() {
      if (this.$refs.keywordForm) {
        this.$refs.keywordForm.resetFields()
      }
    },
    submitForm() {
      this.$refs.keywordForm.validate(valid => {
        if (!valid) {
          return
        }

        this.submitLoading = true
        const payload = {
          keyword: this.form.keyword.trim(),
          category: this.form.category || 'all',
          is_recommended: this.form.is_recommended
        }

        let request
        if (this.form.keyword_id) {
          request = this.axios.put(
            this.$baseUrl + '/manage/community/search/keywords/' + this.form.keyword_id,
            payload
          )
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/community/search/keywords', payload)
        }

        request.then(() => {
          this.$message.success(this.form.keyword_id ? '关键词已更新' : '关键词已创建')
          this.dialogVisible = false
          this.fetchData()
        }).catch(error => {
          console.error('保存关键词失败', error)
          this.$message.error(this.getErrorMessage(error, '保存关键词失败'))
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
    handleDelete(row) {
      this.$confirm('删除后该关键词将不再参与运营推荐，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/community/search/keywords/' + row.keyword_id)
          .then(() => {
            this.$message.success('关键词已删除')
            if (this.list.length === 1 && this.currentPage > 1) {
              this.currentPage -= 1
            }
            this.fetchData()
          }).catch(error => {
            console.error('删除关键词失败', error)
            this.$message.error(this.getErrorMessage(error, '删除关键词失败'))
          })
      }).catch(() => {})
    },
    formatDate(value) {
      if (!value) {
        return '--'
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    formatCategory(value) {
      const map = {
        all: '综合',
        post: '帖子',
        circle: '圈子',
        user: '用户',
        article: '文章'
      }
      return map[value] || value || '未分类'
    },
    getErrorMessage(error, fallback) {
      if (error && error.response && error.response.data && error.response.data.msg) {
        return error.response.data.msg
      }
      return fallback
    }
  }
}
</script>

<style lang="scss" scoped>
.keywords-manage {
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
    color: #8c8c8c;
  }
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 16px;

  .stat-label {
    color: #8c8c8c;
    font-size: 14px;
  }

  .stat-value {
    margin-top: 10px;
    font-size: 30px;
    font-weight: 700;
    color: #6d4c41;
  }

  .stat-desc {
    margin-top: 8px;
    color: #999;
    font-size: 13px;
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
  width: 160px;
}

.keyword-input {
  width: 280px;
}

.category-tags {
  margin-top: 16px;
}

.category-title {
  margin-right: 12px;
  color: #606266;
}

.category-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.danger-text {
  color: #f56c6c;
}
</style>
