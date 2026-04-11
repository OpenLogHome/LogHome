<template>
  <div class="page">
    <div class="toolbar">
      <el-input
        v-model="filters.keyword"
        placeholder="搜索勋章标题或 key"
        clearable
        size="small"
        class="toolbar-item keyword-input"
        @keyup.enter.native="loadAchievements"
      />
      <el-select
        v-model="filters.category"
        clearable
        size="small"
        placeholder="全部分类"
        class="toolbar-item"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-switch
        v-model="filters.includeDisabled"
        active-text="包含停用"
        inactive-text="仅启用"
      />
      <el-button type="primary" size="small" @click="loadAchievements">查询</el-button>
      <el-button size="small" @click="openCreateDialog">新建勋章</el-button>
    </div>

    <el-card shadow="never" class="main-card">
      <div slot="header" class="card-head">
        <span>勋章列表</span>
        <span class="card-head-hint">支持官方手动发放、每月限定和成长任务规则配置</span>
      </div>

      <el-table :data="achievements" stripe border v-loading="loading">
        <el-table-column prop="title" label="勋章名称" min-width="180" />
        <el-table-column prop="achievement_key" label="Key" min-width="180" />
        <el-table-column label="分类" width="120">
          <template slot-scope="scope">{{ formatCategory(scope.row.category) }}</template>
        </el-table-column>
        <el-table-column label="发放方式" width="120">
          <template slot-scope="scope">{{ formatGrantType(scope.row.grant_type) }}</template>
        </el-table-column>
        <el-table-column label="称号词条" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.title_term_text">
              {{ formatTitleTermType(scope.row.title_term_type) }} · {{ scope.row.title_term_text }}
            </span>
            <span v-else>未配置</span>
          </template>
        </el-table-column>
        <el-table-column label="周期" width="100">
          <template slot-scope="scope">{{ formatRepeatPolicy(scope.row.repeat_policy) }}</template>
        </el-table-column>
        <el-table-column prop="rule_count" label="条件数" width="90" />
        <el-table-column prop="grant_count" label="已授予" width="90" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_enabled ? 'success' : 'info'" size="mini">
              {{ scope.row.is_enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="openTestDialog(scope.row)">测试用户</el-button>
            <el-button type="text" size="mini" @click="openGrantDialog(scope.row)">手动发放</el-button>
            <el-button type="text" size="mini" @click="toggleAchievement(scope.row)">
              {{ scope.row.is_enabled ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never" class="logs-card">
      <div slot="header" class="card-head">
        <span>发放日志</span>
      </div>
      <el-table :data="logs" stripe border v-loading="logsLoading">
        <el-table-column prop="created_at" label="时间" width="180" />
        <el-table-column prop="achievement_title" label="勋章" min-width="160" />
        <el-table-column prop="user_name" label="用户" width="140" />
        <el-table-column prop="event_type" label="事件" width="120" />
        <el-table-column prop="grant_source" label="来源" width="120" />
        <el-table-column prop="reason" label="原因" min-width="220" />
      </el-table>
    </el-card>

    <el-dialog
      :title="form.achievement_id ? '编辑勋章' : '新建勋章'"
      :visible.sync="editDialogVisible"
      width="1000px"
      top="4vh"
    >
      <el-form :model="form" label-width="110px" size="small">
        <div class="form-grid">
          <el-form-item label="勋章名称">
            <el-input v-model="form.title" maxlength="64" />
          </el-form-item>
          <el-form-item label="勋章 Key">
            <el-input v-model="form.achievement_key" maxlength="64" placeholder="留空则自动生成" />
          </el-form-item>
          <el-form-item label="勋章分类">
            <el-select v-model="form.category">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="发放方式">
            <el-select v-model="form.grant_type">
              <el-option v-for="item in grantTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="重复策略">
            <el-select v-model="form.repeat_policy">
              <el-option v-for="item in repeatPolicyOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort_order" :min="0" :step="10" />
          </el-form-item>
          <el-form-item label="图标地址" class="span-2">
            <image-upload-field
              v-model="form.badge_image_url"
              button-text="上传勋章图标"
              :preview-width="120"
              :preview-height="120"
              tip="建议上传透明底 PNG 或清晰方形图标，大小不超过 5MB"
            />
          </el-form-item>
          <el-form-item label="有效开始">
            <el-date-picker
              v-model="form.valid_from"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="可选"
            />
          </el-form-item>
          <el-form-item label="有效结束">
            <el-date-picker
              v-model="form.valid_to"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="可选"
            />
          </el-form-item>
          <el-form-item label="勋章描述" class="span-2">
            <el-input v-model="form.description" type="textarea" :rows="3" maxlength="255" />
          </el-form-item>
          <el-form-item label="规则摘要" class="span-2">
            <el-input v-model="form.rule_summary" placeholder="可留空，后端会根据规则自动生成" />
          </el-form-item>
          <el-form-item label="词条类型">
            <el-select v-model="form.title_term_type" clearable placeholder="不授予称号词条">
              <el-option
                v-for="item in titleTermTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="词条内容">
            <el-input
              v-model="form.title_term_text"
              maxlength="64"
              placeholder="例如：勇闯天涯的 / 新人"
            />
          </el-form-item>
        </div>

        <div class="switch-row">
          <el-switch v-model="form.badge_shine" active-text="徽章高亮" />
          <el-switch v-model="form.is_selectable" active-text="允许展示" />
          <el-switch v-model="form.is_hidden" active-text="前台隐藏" />
          <el-switch v-model="form.is_enabled" active-text="启用" />
        </div>

        <div class="rules-head">
          <span>规则配置</span>
          <el-button size="mini" @click="addRuleGroup">新增规则组</el-button>
        </div>

        <div v-if="form.rule_groups.length === 0" class="rules-empty">
          手动发放勋章可以不配置规则；自动勋章请至少配置一组条件。
        </div>

        <div
          v-for="(group, groupIndex) in form.rule_groups"
          :key="group._key"
          class="rule-group"
        >
          <div class="rule-group-head">
            <el-input v-model="group.group_name" size="small" placeholder="规则组名称" class="group-name" />
            <span class="group-tip">组内条件为“且”，组与组之间为“或”</span>
            <el-button type="text" size="mini" @click="removeRuleGroup(groupIndex)">删除规则组</el-button>
          </div>

          <div
            v-for="(condition, conditionIndex) in group.conditions"
            :key="condition._key"
            class="rule-condition"
          >
            <el-select v-model="condition.metric_code" size="small" placeholder="指标">
              <el-option v-for="item in metricOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="condition.period_type" size="small" placeholder="统计周期">
              <el-option v-for="item in periodOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="condition.comparator" size="small" placeholder="比较符">
              <el-option v-for="item in comparatorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input-number v-model="condition.threshold_value" :min="0" :step="1" size="small" />
            <el-button type="text" size="mini" @click="removeCondition(groupIndex, conditionIndex)">删除</el-button>
          </div>

          <el-button size="mini" plain @click="addCondition(group)">新增条件</el-button>
        </div>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submitForm">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="测试勋章规则" :visible.sync="testDialogVisible" width="640px">
      <el-form :model="testForm" label-width="100px" size="small">
        <el-form-item label="勋章">
          <div>{{ testForm.title }}</div>
        </el-form-item>
        <el-form-item label="用户 ID">
          <el-input-number v-model="testForm.user_id" :min="1" />
        </el-form-item>
      </el-form>
      <div v-if="testResult" class="test-result">
        <div class="test-result-title">
          <el-tag :type="testResult.matched ? 'success' : 'warning'">
            {{ testResult.matched ? '命中规则' : '未命中规则' }}
          </el-tag>
        </div>
        <div
          v-for="group in testResult.group_results"
          :key="group.group_id"
          class="test-group"
        >
          <div class="test-group-name">{{ group.group_name || '规则组' }}</div>
          <div
            v-for="condition in group.conditions"
            :key="condition.condition_id"
            class="test-condition"
          >
            {{ formatMetric(condition.metric_code) }} / {{ formatPeriod(condition.period_type) }}:
            {{ condition.current_value }} {{ condition.comparator }} {{ condition.threshold_value }}
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="testDialogVisible = false">关闭</el-button>
        <el-button type="primary" :loading="testing" @click="submitTest">开始测试</el-button>
      </span>
    </el-dialog>

    <el-dialog title="手动发放勋章" :visible.sync="grantDialogVisible" width="520px">
      <el-form :model="grantForm" label-width="100px" size="small">
        <el-form-item label="勋章">
          <div>{{ grantForm.title }}</div>
        </el-form-item>
        <el-form-item label="用户 ID">
          <el-input-number v-model="grantForm.user_id" :min="1" />
        </el-form-item>
        <el-form-item label="发放原因">
          <el-input v-model="grantForm.reason" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="grantDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="granting" @click="submitGrant">确认发放</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageUploadField from '../../components/ImageUploadField.vue'

function createRuleCondition() {
  return {
    _key: `${Date.now()}-${Math.random()}`,
    metric_code: 'read_seconds',
    period_type: 'lifetime',
    comparator: '>=',
    threshold_value: 0,
  };
}

function createRuleGroup() {
  return {
    _key: `${Date.now()}-${Math.random()}`,
    group_name: '',
    conditions: [createRuleCondition()],
  };
}

function createDefaultForm() {
  return {
    achievement_id: 0,
    achievement_key: '',
    title: '',
    description: '',
    badge_image_url: '',
    badge_shine: false,
    category: 'official',
    grant_type: 'manual',
    repeat_policy: 'once',
    valid_from: '',
    valid_to: '',
    rule_summary: '',
    title_term_type: '',
    title_term_text: '',
    is_selectable: true,
    is_hidden: false,
    sort_order: 0,
    is_enabled: true,
    rule_groups: [],
  };
}

function padDateTimePart(value) {
  return String(value).padStart(2, '0');
}

function normalizeDateTimeValue(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed} 00:00:00`;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = padDateTimePart(date.getMonth() + 1);
  const d = padDateTimePart(date.getDate());
  const hh = padDateTimePart(date.getHours());
  const mm = padDateTimePart(date.getMinutes());
  const ss = padDateTimePart(date.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

function normalizeAchievementFormPayload(form) {
  return {
    ...form,
    valid_from: normalizeDateTimeValue(form.valid_from),
    valid_to: normalizeDateTimeValue(form.valid_to),
  };
}

export default {
  name: 'AchievementsManage',
  components: {
    ImageUploadField,
  },
  data() {
    return {
      loading: false,
      logsLoading: false,
      saving: false,
      testing: false,
      granting: false,
      editDialogVisible: false,
      testDialogVisible: false,
      grantDialogVisible: false,
      achievements: [],
      logs: [],
      filters: {
        keyword: '',
        category: '',
        includeDisabled: true,
      },
      form: createDefaultForm(),
      testForm: {
        achievement_id: 0,
        title: '',
        user_id: 1,
      },
      testResult: null,
      grantForm: {
        achievement_id: 0,
        title: '',
        user_id: 1,
        reason: '',
      },
      categoryOptions: [
        { label: '每月限定', value: 'monthly_limited' },
        { label: '官方发放', value: 'official' },
        { label: '成长任务', value: 'growth' },
      ],
      grantTypeOptions: [
        { label: '手动发放', value: 'manual' },
        { label: '规则自动发放', value: 'rule_auto' },
        { label: '规则审核发放', value: 'rule_review' },
      ],
      repeatPolicyOptions: [
        { label: '一次性', value: 'once' },
        { label: '按月', value: 'monthly' },
        { label: '按季度', value: 'quarterly' },
        { label: '按年', value: 'yearly' },
      ],
      titleTermTypeOptions: [
        { label: '形容词词条', value: 'adjective' },
        { label: '名词词条', value: 'noun' },
      ],
      metricOptions: [
        { label: '累计阅读时长（秒）', value: 'read_seconds' },
        { label: '累计写作时长（秒）', value: 'write_seconds' },
        { label: '累计发帖数', value: 'community_post_count' },
        { label: '累计评论数', value: 'comment_count' },
      ],
      periodOptions: [
        { label: '累计', value: 'lifetime' },
        { label: '本月', value: 'month' },
        { label: '本季度', value: 'quarter' },
        { label: '本年', value: 'year' },
      ],
      comparatorOptions: [
        { label: '>=', value: '>=' },
        { label: '>', value: '>' },
        { label: '=', value: '=' },
        { label: '<=', value: '<=' },
        { label: '<', value: '<' },
      ],
    };
  },
  methods: {
    createRuleCondition,
    createRuleGroup,
    createDefaultForm,
    async loadAchievements() {
      this.loading = true;
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/achievements/list', {
          params: {
            keyword: this.filters.keyword,
            categories: this.filters.category || '',
            include_disabled: this.filters.includeDisabled ? 1 : 0,
          },
        });
        this.achievements = (response.data && response.data.list) || [];
      } catch (e) {
        this.$message.error('勋章列表加载失败');
      } finally {
        this.loading = false;
      }
    },
    async loadLogs() {
      this.logsLoading = true;
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/achievements/logs', {
          params: { limit: 20 },
        });
        this.logs = response.data.list || [];
      } catch (e) {
        this.$message.error('发放日志加载失败');
      } finally {
        this.logsLoading = false;
      }
    },
    formatCategory(value) {
      return (this.categoryOptions.find(item => item.value === value) || {}).label || value;
    },
    formatGrantType(value) {
      return (this.grantTypeOptions.find(item => item.value === value) || {}).label || value;
    },
    formatRepeatPolicy(value) {
      return (this.repeatPolicyOptions.find(item => item.value === value) || {}).label || value;
    },
    formatTitleTermType(value) {
      return (this.titleTermTypeOptions.find(item => item.value === value) || {}).label || value;
    },
    formatMetric(value) {
      return (this.metricOptions.find(item => item.value === value) || {}).label || value;
    },
    formatPeriod(value) {
      return (this.periodOptions.find(item => item.value === value) || {}).label || value;
    },
    openCreateDialog() {
      this.form = this.createDefaultForm();
      this.editDialogVisible = true;
    },
    async openEditDialog(row) {
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/achievements/detail', {
          params: { achievement_id: row.achievement_id },
        });
        const detail = response.data.detail || this.createDefaultForm();
        detail.valid_from = normalizeDateTimeValue(detail.valid_from);
        detail.valid_to = normalizeDateTimeValue(detail.valid_to);
        detail.rule_groups = (detail.rule_groups || []).map(group => ({
          ...group,
          _key: `${Date.now()}-${Math.random()}`,
          conditions: (group.conditions || []).map(condition => ({
            ...condition,
            _key: `${Date.now()}-${Math.random()}`,
          })),
        }));
        this.form = Object.assign(this.createDefaultForm(), detail);
        this.editDialogVisible = true;
      } catch (e) {
        this.$message.error('勋章详情加载失败');
      }
    },
    addRuleGroup() {
      this.form.rule_groups.push(this.createRuleGroup());
    },
    removeRuleGroup(index) {
      this.form.rule_groups.splice(index, 1);
    },
    addCondition(group) {
      group.conditions.push(this.createRuleCondition());
    },
    removeCondition(groupIndex, conditionIndex) {
      this.form.rule_groups[groupIndex].conditions.splice(conditionIndex, 1);
    },
    async submitForm() {
      if (!this.form.title) {
        this.$message.warning('请填写勋章名称');
        return;
      }
      this.saving = true;
      try {
        const payload = normalizeAchievementFormPayload(this.form);
        await this.axios.post(this.$baseUrl + '/manage/achievements/save', payload);
        this.$message.success('保存成功');
        this.editDialogVisible = false;
        await this.loadAchievements();
      } catch (e) {
        this.$message.error((e.response && e.response.data && e.response.data.msg) || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    async toggleAchievement(row) {
      try {
        await this.axios.post(this.$baseUrl + '/manage/achievements/toggle', {
          achievement_id: row.achievement_id,
          is_enabled: row.is_enabled ? 0 : 1,
        });
        this.$message.success('状态更新成功');
        await this.loadAchievements();
      } catch (e) {
        this.$message.error('状态更新失败');
      }
    },
    openTestDialog(row) {
      this.testForm = {
        achievement_id: row.achievement_id,
        title: row.title,
        user_id: 1,
      };
      this.testResult = null;
      this.testDialogVisible = true;
    },
    async submitTest() {
      this.testing = true;
      try {
        const response = await this.axios.post(this.$baseUrl + '/manage/achievements/test-user', this.testForm);
        this.testResult = response.data.result || null;
      } catch (e) {
        this.$message.error('测试失败');
      } finally {
        this.testing = false;
      }
    },
    openGrantDialog(row) {
      this.grantForm = {
        achievement_id: row.achievement_id,
        title: row.title,
        user_id: 1,
        reason: '',
      };
      this.grantDialogVisible = true;
    },
    async submitGrant() {
      this.granting = true;
      try {
        await this.axios.post(this.$baseUrl + '/manage/achievements/grant', {
          achievement_id: this.grantForm.achievement_id,
          user_id: this.grantForm.user_id,
          reason: this.grantForm.reason,
        });
        this.$message.success('发放成功');
        this.grantDialogVisible = false;
        await Promise.all([this.loadAchievements(), this.loadLogs()]);
      } catch (e) {
        this.$message.error('发放失败');
      } finally {
        this.granting = false;
      }
    },
  },
  mounted() {
    this.loadAchievements();
    this.loadLogs();
  },
};
</script>

<style scoped lang="scss">
.page {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.toolbar-item {
  width: 160px;
}

.keyword-input {
  width: 280px;
}

.main-card,
.logs-card {
  margin-bottom: 16px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-head-hint {
  font-size: 12px;
  color: #909399;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 20px;
}

.span-2 {
  grid-column: 1 / -1;
}

.switch-row {
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
}

.rules-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
}

.rules-empty {
  padding: 14px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  color: #909399;
}

.rule-group {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.rule-group-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.group-name {
  width: 220px;
}

.group-tip {
  color: #909399;
  font-size: 12px;
}

.rule-condition {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.test-result {
  padding: 12px 0;
}

.test-result-title {
  margin-bottom: 10px;
}

.test-group {
  padding: 10px 12px;
  margin-bottom: 10px;
  background: #f7f9fc;
  border-radius: 6px;
}

.test-group-name {
  font-weight: 600;
  margin-bottom: 6px;
}

.test-condition {
  color: #606266;
  margin-bottom: 4px;
}
</style>
