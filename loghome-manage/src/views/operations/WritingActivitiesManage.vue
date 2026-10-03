<template>
  <div class="writing-activities-page">
    <div class="page-header">
      <div>
        <h2>写作活动管理</h2>
        <p>配置征文活动（活动新闻、报名字段）并查看用户报名信息。</p>
      </div>
      <el-button type="primary" @click="openDialog()">新增活动</el-button>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 活动列表 -->
      <el-tab-pane label="活动配置" name="activities">
        <el-table :data="activities" border v-loading="activitiesLoading" style="width: 100%">
          <el-table-column prop="tag_id" label="活动标签ID" width="110" />
          <el-table-column prop="activity_name" label="活动名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="activity_description" label="活动描述" min-width="220" show-overflow-tooltip />
          <el-table-column label="状态" width="90" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.is_active === 1 ? 'success' : 'info'" size="small">
                {{ scope.row.is_active === 1 ? '进行中' : '已结束' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column label="人气票数" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.popularity_votes || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="viewSubmissions(scope.row)">报名信息</el-button>
              <el-button v-if="scope.row.popularity_enabled === 1" type="text" size="small" @click="handleResetPopularity(scope.row)">重置人气票</el-button>
              <el-button type="text" size="small" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 报名信息 -->
      <el-tab-pane label="报名信息" name="submissions">
        <el-card shadow="never" class="filter-card">
          <div class="filter-row">
            <el-select v-model="submissionTagId" style="width: 260px" placeholder="选择活动" @change="fetchSubmissions">
              <el-option v-for="item in activities" :key="item.tag_id" :label="item.activity_name" :value="item.tag_id" />
            </el-select>
            <el-select v-model="submissionStatus" style="width: 140px" @change="fetchSubmissions">
              <el-option label="全部状态" value="" />
              <el-option label="待审核" :value="0" />
              <el-option label="已通过" :value="1" />
              <el-option label="已驳回" :value="2" />
            </el-select>
            <el-button type="primary" @click="fetchSubmissions">查询</el-button>
          </div>
        </el-card>
        <el-table :data="submissions" border v-loading="submissionsLoading" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="用户" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.user_name || scope.row.user_id }}
            </template>
          </el-table-column>
          <el-table-column prop="novel_name" label="参赛作品" min-width="160" show-overflow-tooltip />
          <el-table-column label="报名信息" min-width="260" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="json-text">{{ formatJson(scope.row.information_data) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90" align="center">
            <template slot-scope="scope">
              <el-tag :type="submissionStatusType(scope.row.status)" size="small">
                {{ submissionStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submit_time" label="提交时间" width="170">
            <template slot-scope="scope">
              {{ formatDate(scope.row.submit_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status !== 1" type="text" size="small" @click="updateSubmissionStatus(scope.row, 1)">通过</el-button>
              <el-button v-if="scope.row.status !== 2" type="text" size="small" class="danger-text" @click="updateSubmissionStatus(scope.row, 2)">驳回</el-button>
              <el-button v-if="scope.row.status !== 0" type="text" size="small" @click="updateSubmissionStatus(scope.row, 0)">待审</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 活动编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="720px" @close="resetForm">
      <el-form ref="activityForm" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="活动标签ID" prop="tag_id">
              <el-select v-model="form.tag_id" filterable placeholder="选择活动标签" style="width: 100%">
                <el-option
                  v-for="tag in activityTags"
                  :key="tag.tag_id"
                  :label="tag.tag_name + '（ID: ' + tag.tag_id + '）'"
                  :value="tag.tag_id"
                  :disabled="isTagTaken(tag.tag_id)"
                />
              </el-select>
              <div class="form-tip">仅可选择标签库中标记为「活动标签」的标签；已配置活动的标签不可再选</div>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="活动名称" prop="activity_name">
              <el-input v-model="form.activity_name" placeholder="例如：HayCraft2025中文短篇主题文会" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动描述">
          <el-input v-model="form.activity_description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="活动新闻">
          <div class="editor-list">
            <div v-for="(news, index) in form.news_list" :key="index" class="editor-card">
              <div class="editor-card-head">
                <el-input v-model="news.title" size="small" placeholder="公告标题（必填）" />
                <el-button type="text" size="small" class="danger-text" icon="el-icon-delete" @click="form.news_list.splice(index, 1)" />
              </div>
              <div class="editor-card-body">
                <el-input v-model="news.pc_link" size="small" placeholder="PC 链接（可选，https://...）" />
                <el-input v-model="news.mobile_link" size="small" placeholder="移动端链接（可选，/pages/...）" />
              </div>
            </div>
            <el-button type="text" icon="el-icon-plus" @click="addNewsRow">添加新闻</el-button>
          </div>
        </el-form-item>
        <el-form-item label="报名字段">
          <div class="editor-list">
            <div v-for="(field, index) in form.fields_list" :key="index" class="editor-card">
              <div class="editor-card-head">
                <el-input v-model="field.name" size="small" placeholder="字段名称（必填，如：邮箱）" />
                <el-switch v-model="field.required" active-text="必填" />
                <el-button type="text" size="small" class="danger-text" icon="el-icon-delete" @click="form.fields_list.splice(index, 1)" />
              </div>
              <div class="editor-card-body">
                <el-input v-model="field.placeholder" size="small" placeholder="输入提示（可选）" />
                <div class="editor-maxlen">
                  <span>最大长度</span>
                  <el-input-number v-model="field.maxLength" size="small" :min="1" :max="500" controls-position="right" />
                </div>
              </div>
            </div>
            <el-button type="text" icon="el-icon-plus" @click="addFieldRow">添加字段</el-button>
          </div>
        </el-form-item>
        <el-form-item label="限制完结后更新">
          <el-switch v-model="form.restrict_complete_update" active-text="启用" />
          <div v-if="form.restrict_complete_update" class="form-tip">作品完结后，活动期间将无法新增或编辑章节，也无法退回连载状态</div>
        </el-form-item>
        <el-form-item label="人气票">
          <el-switch v-model="form.popularity_enabled" active-text="启用" />
          <div v-if="form.popularity_enabled" class="popularity-config">
            <div class="popularity-row">
              <span>每人票数上限</span>
              <el-input-number v-model="form.popularity_quota" :min="1" :max="100" size="small" controls-position="right" />
            </div>
            <div class="popularity-row">
              <span>投票限制</span>
              <el-checkbox v-model="form.popularityRequireCompleted">仅允许为完结作品投票</el-checkbox>
            </div>
            <div class="form-tip">用户可在书籍详情页的“创作活动”板块为关联作品投票，票数投出后不可撤回</div>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.is_active" active-text="进行中" inactive-text="已结束" />
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
  name: 'WritingActivitiesManage',
  data() {
    return {
      activeTab: 'activities',
      // 活动
      activitiesLoading: false,
      activities: [],
      activityTags: [],
      dialogVisible: false,
      dialogTitle: '新增活动',
      submitLoading: false,
      form: {
        tag_id: null,
        activity_name: '',
        activity_description: '',
        news_list: [],
        fields_list: [],
        restrict_complete_update: false,
        popularity_enabled: false,
        popularity_quota: 2,
        popularityRequireCompleted: false,
        is_active: true
      },
      rules: {
        tag_id: [{ required: true, message: '请输入活动标签ID', trigger: 'change' }],
        activity_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      // 报名
      submissionsLoading: false,
      submissions: [],
      submissionTagId: '',
      submissionStatus: ''
    }
  },
  created() {
    this.fetchActivities()
    this.fetchActivityTags()
  },
  methods: {
    fetchActivityTags() {
      this.axios.get(this.$baseUrl + '/manage/tags', {
        params: { is_activity_tag: 1, is_deleted: 0 }
      }).then(response => {
        this.activityTags = response.data || []
      }).catch(error => {
        console.error('获取活动标签失败', error)
        this.$message.error('获取活动标签失败')
      })
    },
    isTagTaken(tagId) {
      return this.activities.some(a => a.tag_id === tagId) && tagId !== this.form.tag_id
    },
    fetchActivities() {
      this.activitiesLoading = true
      this.axios.get(this.$baseUrl + '/manage/writing-activities').then(response => {
        this.activities = response.data || []
      }).catch(error => {
        console.error('获取活动失败', error)
        this.$message.error('获取活动失败')
      }).finally(() => {
        this.activitiesLoading = false
      })
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑活动'
        const rules = this.parseJsonArray(row.popularity_rules)
        this.form = {
          tag_id: row.tag_id,
          activity_name: row.activity_name || '',
          activity_description: row.activity_description || '',
          news_list: this.parseNewsList(row.activity_news),
          fields_list: this.parseFieldsList(row.required_fields),
          restrict_complete_update: row.restrict_complete_update === 1,
          popularity_enabled: row.popularity_enabled === 1,
          popularity_quota: Number(row.popularity_quota) > 0 ? Number(row.popularity_quota) : 2,
          popularityRequireCompleted: rules.some(rule => rule && rule.type === 'require_completed' && (rule.value === true || rule.value === 1)),
          is_active: row.is_active === 1
        }
      } else {
        this.dialogTitle = '新增活动'
        this.form = {
          tag_id: null,
          activity_name: '',
          activity_description: '',
          news_list: [],
          fields_list: [],
          restrict_complete_update: false,
          popularity_enabled: false,
          popularity_quota: 2,
          popularityRequireCompleted: false,
          is_active: true
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.activityForm) {
          this.$refs.activityForm.clearValidate()
        }
      })
    },
    resetForm() {
      if (this.$refs.activityForm) {
        this.$refs.activityForm.resetFields()
      }
    },
    submitForm() {
      this.$refs.activityForm.validate(valid => {
        if (!valid) {
          return
        }
        const news = this.buildNewsPayload()
        const fields = this.buildFieldsPayload()
        if (news === null || fields === null) {
          return
        }
        this.submitLoading = true
        const payload = {
          tag_id: this.form.tag_id,
          activity_name: this.form.activity_name.trim(),
          activity_description: this.form.activity_description.trim(),
          activity_news: news.length ? JSON.stringify(news) : '',
          required_fields: fields.length ? JSON.stringify(fields) : '',
          restrict_complete_update: this.form.restrict_complete_update ? 1 : 0,
          popularity_enabled: this.form.popularity_enabled ? 1 : 0,
          popularity_quota: this.form.popularity_quota,
          popularity_rules: this.form.popularity_enabled && this.form.popularityRequireCompleted
            ? JSON.stringify([{ type: 'require_completed', value: true }])
            : '[]',
          is_active: this.form.is_active ? 1 : 0
        }
        let request
        if (this.form.tag_id && this.activities.some(a => a.tag_id === this.form.tag_id)) {
          request = this.axios.put(this.$baseUrl + '/manage/writing-activities/' + this.form.tag_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/writing-activities', payload)
        }
        request.then(() => {
          this.$message.success('活动已保存')
          this.dialogVisible = false
          this.fetchActivities()
        }).catch(error => {
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除活动「${row.activity_name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/writing-activities/' + row.tag_id)
          .then(() => {
            this.$message.success('已删除')
            this.fetchActivities()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    handleResetPopularity(row) {
      const count = Number(row.popularity_votes) || 0
      this.$confirm(`确定重置活动「${row.activity_name}」的全部人气票吗？当前共 ${count} 票，重置后不可恢复。`, '重置人气票', {
        confirmButtonText: '确认重置',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(this.$baseUrl + '/manage/writing-activities/' + row.tag_id + '/popularity/reset')
          .then(response => {
            const deleted = (response.data && response.data.deleted) || 0
            this.$message.success(`已重置，共清除 ${deleted} 票`)
            this.fetchActivities()
          }).catch(error => {
            this.$message.error((error.response && error.response.data && error.response.data.msg) || '重置失败')
          })
      }).catch(() => {})
    },
    viewSubmissions(row) {
      this.submissionTagId = row.tag_id
      this.activeTab = 'submissions'
      this.fetchSubmissions()
    },
    fetchSubmissions() {
      if (!this.submissionTagId) {
        return
      }
      this.submissionsLoading = true
      this.axios.get(this.$baseUrl + '/manage/writing-activities/submissions', {
        params: {
          tag_id: this.submissionTagId,
          status: this.submissionStatus
        }
      }).then(response => {
        this.submissions = response.data || []
      }).catch(error => {
        console.error('获取报名信息失败', error)
        this.$message.error('获取报名信息失败')
      }).finally(() => {
        this.submissionsLoading = false
      })
    },
    updateSubmissionStatus(row, status) {
      this.axios.put(this.$baseUrl + '/manage/writing-activities/submissions/' + row.id + '/status', { status })
        .then(() => {
          this.$message.success('状态已更新')
          this.fetchSubmissions()
        }).catch(error => {
          this.$message.error('操作失败')
        })
    },
    addNewsRow() {
      this.form.news_list.push({ title: '', pc_link: '', mobile_link: '' })
    },
    addFieldRow() {
      this.form.fields_list.push({ name: '', required: false, placeholder: '', maxLength: undefined })
    },
    parseJsonArray(value) {
      if (!value) {
        return []
      }
      if (Array.isArray(value)) {
        return value
      }
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        this.$message.warning('存在无法解析的历史 JSON 数据，已清空对应列表')
        return []
      }
    },
    parseNewsList(value) {
      return this.parseJsonArray(value).map(item => ({
        title: item.title || '',
        pc_link: item.pc_link || '',
        mobile_link: item.mobile_link || ''
      }))
    },
    parseFieldsList(value) {
      return this.parseJsonArray(value).map(item => ({
        name: item.name || '',
        required: item.required === true,
        placeholder: item.placeholder || '',
        maxLength: Number.isInteger(item.maxLength) ? item.maxLength : undefined
      }))
    },
    buildNewsPayload() {
      const result = []
      for (let i = 0; i < this.form.news_list.length; i++) {
        const news = this.form.news_list[i]
        const title = news.title.trim()
        if (!title) {
          this.$message.error(`第 ${i + 1} 条活动新闻缺少标题`)
          return null
        }
        const item = { title }
        if (news.pc_link.trim()) {
          item.pc_link = news.pc_link.trim()
        }
        if (news.mobile_link.trim()) {
          item.mobile_link = news.mobile_link.trim()
        }
        result.push(item)
      }
      return result
    },
    buildFieldsPayload() {
      const result = []
      const names = new Set()
      for (let i = 0; i < this.form.fields_list.length; i++) {
        const field = this.form.fields_list[i]
        const name = field.name.trim()
        if (!name) {
          this.$message.error(`第 ${i + 1} 个报名字段缺少名称`)
          return null
        }
        if (names.has(name)) {
          this.$message.error(`报名字段名称「${name}」重复`)
          return null
        }
        names.add(name)
        const item = { name, required: field.required === true }
        if (field.placeholder.trim()) {
          item.placeholder = field.placeholder.trim()
        }
        if (Number.isInteger(field.maxLength)) {
          item.maxLength = field.maxLength
        }
        result.push(item)
      }
      return result
    },
    formatJson(value) {
      if (!value) {
        return '--'
      }
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value
        return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join('；')
      } catch (e) {
        return value
      }
    },
    submissionStatusText(status) {
      return { 0: '待审核', 1: '已通过', 2: '已驳回' }[status] || status
    },
    submissionStatusType(status) {
      return { 0: 'warning', 1: 'success', 2: 'danger' }[status] || 'info'
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
.writing-activities-page {
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

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

.editor-list {
  .editor-card {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 8px 10px;
    margin-bottom: 10px;
    background: #fafafa;
  }

  .editor-card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    .el-input {
      flex: 1;
    }
  }

  .editor-card-body {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-input {
      flex: 1;
    }
  }

  .editor-maxlen {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;

    span {
      font-size: 12px;
      color: #909399;
      white-space: nowrap;
    }

    .el-input-number {
      width: 110px;
    }
  }
}

.popularity-config {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fafafa;
  padding: 10px 12px;
  margin-top: 8px;

  .popularity-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;

    > span {
      font-size: 13px;
      color: #606266;
      white-space: nowrap;
    }
  }

  .form-tip {
    margin-top: 2px;
  }
}

.json-text {
  font-size: 12px;
  word-break: break-all;
}

.danger-text {
  color: #f56c6c;
}
</style>
