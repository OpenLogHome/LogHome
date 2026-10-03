<template>
  <div class="tree-config-page">
    <div class="page-header">
      <div>
        <h2>树场玩法配置</h2>
        <p>配置树场成长任务、经验球参数与经验任务。修改经验球参数后约 30 秒内对客户端生效。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 成长任务 -->
      <el-tab-pane label="成长任务" name="tasks">
        <div class="tab-toolbar">
          <el-button type="primary" @click="openTaskDialog()">新增成长任务</el-button>
        </div>
        <el-table :data="tasks" border v-loading="tasksLoading" style="width: 100%">
          <el-table-column prop="task_id" label="ID" width="70" />
          <el-table-column prop="task_code" label="任务编码" min-width="130" />
          <el-table-column prop="task_name" label="任务名称" min-width="130" />
          <el-table-column prop="task_desc" label="任务描述" min-width="200" show-overflow-tooltip />
          <el-table-column label="类型" width="90" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.task_type === 'daily' ? 'success' : 'warning'" size="small">
                {{ scope.row.task_type === 'daily' ? '每日' : '一次性' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="growth_reward" label="成长值" width="90" />
          <el-table-column label="图标" width="80">
            <template slot-scope="scope">
              <img v-if="scope.row.icon" :src="scope.row.icon" class="task-icon" />
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openTaskDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="small" class="danger-text" @click="handleDeleteTask(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 经验任务 -->
      <el-tab-pane label="经验任务" name="expTasks">
        <div class="tab-toolbar">
          <el-button type="primary" @click="openExpTaskDialog()">新增经验任务</el-button>
        </div>
        <el-table :data="expTasks" border v-loading="expTasksLoading" style="width: 100%">
          <el-table-column prop="task_id" label="ID" width="70" />
          <el-table-column prop="task_code" label="任务编码" min-width="120" />
          <el-table-column prop="task_name" label="任务名称" min-width="120" />
          <el-table-column prop="task_desc" label="任务描述" min-width="190" show-overflow-tooltip />
          <el-table-column prop="source_code" label="触发事件" min-width="120" />
          <el-table-column prop="required_value" label="目标值" width="80" />
          <el-table-column prop="daily_limit" label="每日次数" width="90" />
          <el-table-column prop="exp_reward" label="经验奖励" width="90" />
          <el-table-column prop="sort_order" label="排序" width="70" />
          <el-table-column label="启用" width="80" align="center">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.is_enabled === 1"
                @change="value => handleToggleExpTask(scope.row, value)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openExpTaskDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="small" class="danger-text" @click="handleDeleteExpTask(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 经验球参数 -->
      <el-tab-pane label="经验球参数" name="expSettings">
        <el-card shadow="never" v-loading="expSettingsLoading">
          <el-form label-width="230px" style="max-width: 720px">
            <el-form-item v-for="item in expSettings" :key="item.setting_key" :label="item.description || item.setting_key">
              <el-input :value="String(item.setting_value)" @input="value => handleSettingInput(item, value)" />
            </el-form-item>
          </el-form>
          <div class="settings-actions">
            <el-button type="primary" :loading="expSettingsSaving" @click="saveExpSettings">保存参数</el-button>
            <el-button @click="fetchExpSettings">还原</el-button>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 成长任务对话框 -->
    <el-dialog :title="taskDialogTitle" :visible.sync="taskDialogVisible" width="560px" @close="resetTaskForm">
      <el-form ref="taskForm" :model="taskForm" :rules="taskRules" label-width="100px">
        <el-form-item label="任务编码" prop="task_code">
          <el-input v-model="taskForm.task_code" placeholder="例如 daily_signin" />
        </el-form-item>
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="taskForm.task_name" placeholder="例如 每日签到" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="taskForm.task_desc" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="任务类型" prop="task_type">
          <el-select v-model="taskForm.task_type" style="width: 100%">
            <el-option label="每日任务" value="daily" />
            <el-option label="一次性任务" value="fixed" />
          </el-select>
        </el-form-item>
        <el-form-item label="成长值奖励" prop="growth_reward">
          <el-input-number v-model="taskForm.growth_reward" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="图标">
          <image-upload-field v-model="taskForm.icon" button-text="上传图标" :preview-width="48" :preview-height="48" tip="选填" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="taskSubmitLoading" @click="submitTaskForm">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 经验任务对话框 -->
    <el-dialog :title="expTaskDialogTitle" :visible.sync="expTaskDialogVisible" width="820px" @close="resetExpTaskForm">
      <el-form ref="expTaskForm" :model="expTaskForm" :rules="expTaskRules" label-width="110px">
        <el-form-item label="任务编码" prop="task_code">
          <el-input v-model="expTaskForm.task_code" placeholder="例如 exp_comm_post" />
        </el-form-item>
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="expTaskForm.task_name" placeholder="例如 社区发帖" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="expTaskForm.task_desc" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="触发事件" prop="source_code">
          <el-input v-model="expTaskForm.source_code" placeholder="例如 community_post / community_reply / read_seconds / write_seconds" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="目标值" prop="required_value">
              <el-input-number v-model="expTaskForm.required_value" :min="1" controls-position="right" style="width: 100%; min-width: 180px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="每日次数" prop="daily_limit">
              <el-input-number v-model="expTaskForm.daily_limit" :min="1" controls-position="right" style="width: 100%; min-width: 180px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经验奖励" prop="exp_reward">
              <el-input-number v-model="expTaskForm.exp_reward" :min="1" controls-position="right" style="width: 100%; min-width: 180px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序值">
              <el-input-number v-model="expTaskForm.sort_order" :min="0" controls-position="right" style="width: 100%; min-width: 180px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用">
              <el-switch v-model="expTaskForm.is_enabled" active-text="启用" inactive-text="停用" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图标">
          <image-upload-field v-model="expTaskForm.icon" button-text="上传图标" :preview-width="48" :preview-height="48" tip="选填" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="expTaskDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="expTaskSubmitLoading" @click="submitExpTaskForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageUploadField from '../../components/ImageUploadField.vue'

export default {
  name: 'TreeConfigManage',
  components: {
    ImageUploadField
  },
  data() {
    return {
      activeTab: 'tasks',
      // 成长任务
      tasksLoading: false,
      tasks: [],
      taskDialogVisible: false,
      taskDialogTitle: '新增成长任务',
      taskSubmitLoading: false,
      taskForm: {
        task_id: null,
        task_code: '',
        task_name: '',
        task_desc: '',
        task_type: 'daily',
        growth_reward: 10,
        icon: ''
      },
      taskRules: {
        task_code: [{ required: true, message: '请输入任务编码', trigger: 'blur' }],
        task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        growth_reward: [{ required: true, message: '请输入成长值奖励', trigger: 'change' }]
      },
      // 经验任务
      expTasksLoading: false,
      expTasks: [],
      expTaskDialogVisible: false,
      expTaskDialogTitle: '新增经验任务',
      expTaskSubmitLoading: false,
      expTaskForm: {
        task_id: null,
        task_code: '',
        task_name: '',
        task_desc: '',
        source_code: '',
        required_value: 1,
        daily_limit: 1,
        exp_reward: 1,
        icon: '',
        sort_order: 0,
        is_enabled: true
      },
      expTaskRules: {
        task_code: [{ required: true, message: '请输入任务编码', trigger: 'blur' }],
        task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        source_code: [{ required: true, message: '请输入触发事件编码', trigger: 'blur' }],
        required_value: [{ required: true, message: '请输入目标值', trigger: 'change' }],
        daily_limit: [{ required: true, message: '请输入每日次数', trigger: 'change' }],
        exp_reward: [{ required: true, message: '请输入经验奖励', trigger: 'change' }]
      },
      // 经验球参数
      expSettingsLoading: false,
      expSettingsSaving: false,
      expSettings: []
    }
  },
  created() {
    this.fetchTasks()
    this.fetchExpTasks()
    this.fetchExpSettings()
  },
  methods: {
    // ---------- 成长任务 ----------
    fetchTasks() {
      this.tasksLoading = true
      this.axios.get(this.$baseUrl + '/manage/tree-config/tasks').then(response => {
        this.tasks = response.data || []
      }).catch(error => {
        console.error('获取成长任务失败', error)
        this.$message.error('获取成长任务失败')
      }).finally(() => {
        this.tasksLoading = false
      })
    },
    openTaskDialog(row) {
      if (row) {
        this.taskDialogTitle = '编辑成长任务'
        this.taskForm = {
          task_id: row.task_id,
          task_code: row.task_code || '',
          task_name: row.task_name || '',
          task_desc: row.task_desc || '',
          task_type: row.task_type || 'daily',
          growth_reward: row.growth_reward || 0,
          icon: row.icon || ''
        }
      } else {
        this.taskDialogTitle = '新增成长任务'
        this.taskForm = {
          task_id: null,
          task_code: '',
          task_name: '',
          task_desc: '',
          task_type: 'daily',
          growth_reward: 10,
          icon: ''
        }
      }
      this.taskDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.taskForm) {
          this.$refs.taskForm.clearValidate()
        }
      })
    },
    resetTaskForm() {
      if (this.$refs.taskForm) {
        this.$refs.taskForm.resetFields()
      }
    },
    submitTaskForm() {
      this.$refs.taskForm.validate(valid => {
        if (!valid) {
          return
        }
        this.taskSubmitLoading = true
        const payload = {
          task_code: this.taskForm.task_code.trim(),
          task_name: this.taskForm.task_name.trim(),
          task_desc: this.taskForm.task_desc.trim(),
          task_type: this.taskForm.task_type,
          growth_reward: this.taskForm.growth_reward,
          icon: this.taskForm.icon
        }
        let request
        if (this.taskForm.task_id) {
          request = this.axios.put(this.$baseUrl + '/manage/tree-config/tasks/' + this.taskForm.task_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/tree-config/tasks', payload)
        }
        request.then(() => {
          this.$message.success(this.taskForm.task_id ? '任务已更新' : '任务已创建')
          this.taskDialogVisible = false
          this.fetchTasks()
        }).catch(error => {
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.taskSubmitLoading = false
        })
      })
    },
    handleDeleteTask(row) {
      this.$confirm(`确定删除任务「${row.task_name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/tree-config/tasks/' + row.task_id)
          .then(() => {
            this.$message.success('任务已删除')
            this.fetchTasks()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    // ---------- 经验任务 ----------
    fetchExpTasks() {
      this.expTasksLoading = true
      this.axios.get(this.$baseUrl + '/manage/tree-config/exp-tasks').then(response => {
        this.expTasks = response.data || []
      }).catch(error => {
        console.error('获取经验任务失败', error)
        this.$message.error('获取经验任务失败')
      }).finally(() => {
        this.expTasksLoading = false
      })
    },
    openExpTaskDialog(row) {
      if (row) {
        this.expTaskDialogTitle = '编辑经验任务'
        this.expTaskForm = {
          task_id: row.task_id,
          task_code: row.task_code || '',
          task_name: row.task_name || '',
          task_desc: row.task_desc || '',
          source_code: row.source_code || '',
          required_value: row.required_value || 1,
          daily_limit: row.daily_limit || 1,
          exp_reward: row.exp_reward || 1,
          icon: row.icon || '',
          sort_order: row.sort_order || 0,
          is_enabled: row.is_enabled === 1
        }
      } else {
        this.expTaskDialogTitle = '新增经验任务'
        this.expTaskForm = {
          task_id: null,
          task_code: '',
          task_name: '',
          task_desc: '',
          source_code: '',
          required_value: 1,
          daily_limit: 1,
          exp_reward: 1,
          icon: '',
          sort_order: 0,
          is_enabled: true
        }
      }
      this.expTaskDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.expTaskForm) {
          this.$refs.expTaskForm.clearValidate()
        }
      })
    },
    resetExpTaskForm() {
      if (this.$refs.expTaskForm) {
        this.$refs.expTaskForm.resetFields()
      }
    },
    submitExpTaskForm() {
      this.$refs.expTaskForm.validate(valid => {
        if (!valid) {
          return
        }
        this.expTaskSubmitLoading = true
        const payload = {
          task_code: this.expTaskForm.task_code.trim(),
          task_name: this.expTaskForm.task_name.trim(),
          task_desc: this.expTaskForm.task_desc.trim(),
          source_code: this.expTaskForm.source_code.trim(),
          required_value: this.expTaskForm.required_value,
          daily_limit: this.expTaskForm.daily_limit,
          exp_reward: this.expTaskForm.exp_reward,
          icon: this.expTaskForm.icon,
          sort_order: this.expTaskForm.sort_order,
          is_enabled: this.expTaskForm.is_enabled ? 1 : 0
        }
        let request
        if (this.expTaskForm.task_id) {
          request = this.axios.put(this.$baseUrl + '/manage/tree-config/exp-tasks/' + this.expTaskForm.task_id, payload)
        } else {
          request = this.axios.post(this.$baseUrl + '/manage/tree-config/exp-tasks', payload)
        }
        request.then(() => {
          this.$message.success(this.expTaskForm.task_id ? '任务已更新' : '任务已创建')
          this.expTaskDialogVisible = false
          this.fetchExpTasks()
        }).catch(error => {
          this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
        }).finally(() => {
          this.expTaskSubmitLoading = false
        })
      })
    },
    handleToggleExpTask(row, value) {
      const payload = {
        task_code: row.task_code,
        task_name: row.task_name,
        task_desc: row.task_desc || '',
        source_code: row.source_code,
        required_value: row.required_value,
        daily_limit: row.daily_limit,
        exp_reward: row.exp_reward,
        icon: row.icon || '',
        sort_order: row.sort_order,
        is_enabled: value ? 1 : 0
      }
      this.axios.put(this.$baseUrl + '/manage/tree-config/exp-tasks/' + row.task_id, payload)
        .then(() => {
          row.is_enabled = value ? 1 : 0
          this.$message.success(value ? '任务已启用' : '任务已停用')
        }).catch(error => {
          this.$message.error('操作失败')
          this.fetchExpTasks()
        })
    },
    handleDeleteExpTask(row) {
      this.$confirm(`确定删除经验任务「${row.task_name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.$baseUrl + '/manage/tree-config/exp-tasks/' + row.task_id)
          .then(() => {
            this.$message.success('任务已删除')
            this.fetchExpTasks()
          }).catch(error => {
            this.$message.error('删除失败')
          })
      }).catch(() => {})
    },
    // ---------- 经验球参数 ----------
    fetchExpSettings() {
      this.expSettingsLoading = true
      this.axios.get(this.$baseUrl + '/manage/tree-config/exp-settings').then(response => {
        this.expSettings = (response.data || []).map(item => ({ ...item }))
      }).catch(error => {
        console.error('获取经验球参数失败', error)
        this.$message.error('获取经验球参数失败')
      }).finally(() => {
        this.expSettingsLoading = false
      })
    },
    handleSettingInput(item, value) {
      item.setting_value = value
    },
    saveExpSettings() {
      this.expSettingsSaving = true
      this.axios.put(this.$baseUrl + '/manage/tree-config/exp-settings', {
        settings: this.expSettings
      }).then(() => {
        this.$message.success('参数已保存')
        this.fetchExpSettings()
      }).catch(error => {
        console.error('保存参数失败', error)
        this.$message.error((error.response && error.response.data && error.response.data.msg) || '保存失败')
      }).finally(() => {
        this.expSettingsSaving = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tree-config-page {
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

.tab-toolbar {
  margin-bottom: 20px;
}

.task-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.settings-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.danger-text {
  color: #f56c6c;
}
</style>
