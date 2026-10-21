<template>
  <div class="todo-board-page">
    <div class="hero-card">
      <div class="hero-copy">
        <div class="subtitle">原木罗盘系统</div>
        <div class="title">协作待办看板</div>
        <div class="description">项目协同制作待办清单：拖拽卡片流转状态，按项目/负责人筛选，跟踪评论与文档。</div>
      </div>
      <div class="hero-side">
        <div class="hero-metric">
          <span>进行中任务</span>
          <strong>{{ colTasks.doing.length }}</strong>
        </div>
        <div class="hero-update">最近刷新：{{ lastUpdated }}</div>
      </div>
    </div>

    <div class="metric-row">
      <div class="metric-card">
        <div class="metric-label">待办任务</div>
        <div class="metric-value">{{ colTasks.todo.length }}</div>
        <div class="metric-desc">尚未开始处理的事项</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">进行中</div>
        <div class="metric-value">{{ colTasks.doing.length }}</div>
        <div class="metric-desc">正在推进的开发事项</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">已完成</div>
        <div class="metric-value">{{ colTasks.done.length }}</div>
        <div class="metric-desc">近期收口的任务</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">已逾期</div>
        <div class="metric-value overdue">{{ overdueCount }}</div>
        <div class="metric-desc">超过截止日期未完成</div>
      </div>
    </div>

    <div class="filters proj-filters">
      <span class="label">项目：</span>
      <button
        v-for="p in projChips"
        :key="p.id"
        class="chip"
        :class="{ active: p.id === projFilter }"
        @click="switchProj(p.id)"
      >{{ p.name }}</button>
    </div>

    <div class="toolbar">
      <div class="filters">
        <span class="label">负责人：</span>
        <button
          v-for="m in memberChips"
          :key="m.id"
          class="chip"
          :class="{ active: m.id === filterMember }"
          @click="switchMember(m.id)"
        >
          <span v-if="m.color" class="dot" :style="{ background: m.color }">{{ m.name.charAt(0) }}</span>{{ m.name }}
        </button>
      </div>
      <div class="toolbar-actions">
        <el-button plain size="medium" @click="openMembers">成员管理</el-button>
        <el-button type="primary" size="medium" @click="openNew">＋ 新建任务</el-button>
      </div>
    </div>

    <div v-if="projFilter" class="proj-panel">
      <h3>{{ projOf(projFilter).name }} · 项目动态</h3>
      <div class="proj-body">
        <div>
          <div class="proj-col-title">项目评论</div>
          <div v-if="!(projComments[projFilter] || []).length" class="empty-line">暂无项目评论</div>
          <div v-for="(c, i) in projComments[projFilter] || []" :key="projFilter + '-c-' + i" class="comment-item">
            <span class="avatar" :style="{ background: memberOf(c.who).color }">{{ memberOf(c.who).name.charAt(0) }}</span>
            <div>
              <div class="who">{{ memberOf(c.who).name }}<span class="when">{{ c.when }}</span></div>
              <div class="text">{{ c.text }}</div>
            </div>
          </div>
          <div class="comment-input-row">
            <el-input v-model="projCommentInput" size="small" placeholder="写下项目评论…" @keyup.enter.native="addProjComment" />
            <el-button type="primary" size="small" @click="addProjComment">发送</el-button>
          </div>
        </div>
        <div>
          <div class="proj-col-title">项目文档</div>
          <div v-if="!(projDocs[projFilter] || []).length" class="empty-line">暂无项目文档</div>
          <div v-for="(d, i) in projDocs[projFilter] || []" :key="projFilter + '-d-' + i" class="doc-row">
            <span>📄</span>
            <span class="doc-name" :title="d.name">{{ d.name }}</span>
            <span class="doc-meta">{{ d.size }} · {{ memberOf(d.who).name }} · {{ d.when }}</span>
            <el-button type="text" size="mini" class="doc-del" @click="deleteDoc(i)">删除</el-button>
          </div>
          <input ref="docFile" type="file" style="display:none" @change="uploadDoc" />
          <el-button plain size="small" class="upload-btn" @click="$refs.docFile.click()">＋ 上传文档</el-button>
        </div>
      </div>
    </div>

    <div class="kanban">
      <div
        v-for="col in columns"
        :key="col.key"
        class="column"
        :class="{ 'drag-over': dragOverCol === col.key }"
        @dragover.prevent="dragOverCol = col.key"
        @dragleave="dragOverCol === col.key && (dragOverCol = '')"
        @drop.prevent="onDrop(col.key, $event)"
      >
        <div class="column-head">
          <span class="name">{{ col.label }} <span class="count">{{ colTasks[col.key].length }}</span></span>
          <el-button type="text" icon="el-icon-plus" class="col-add" @click="openNew" />
        </div>
        <div class="cards">
          <div v-if="!colTasks[col.key].length" class="empty-hint">暂无任务，拖拽卡片到这里</div>
          <div
            v-for="t in colTasks[col.key]"
            :key="t.id"
            class="card"
            :class="'p-' + t.priority"
            draggable="true"
            @dragstart="onDragStart(t, $event)"
            @dragend="dragOverCol = ''"
            @click="openTask(t)"
          >
            <div class="card-title">{{ t.title }}</div>
            <div class="card-desc">{{ t.desc }}</div>
            <span class="tag" :class="t.priority">优先级 {{ { high: '高', mid: '中', low: '低' }[t.priority] }}</span>
            <span class="tag proj-tag" :style="{ color: projOf(t.proj).color, background: projOf(t.proj).bg }">{{ projOf(t.proj).name }}</span>
            <div class="card-foot">
              <span class="assignee">
                <span class="avatar" :style="{ background: memberOf(t.assignee).color }">{{ memberOf(t.assignee).name.charAt(0) }}</span>{{ memberOf(t.assignee).name }}
              </span>
              <span class="card-meta">
                <span v-if="t.comments.length">💬 {{ t.comments.length }}</span>
                <span class="due" :class="{ overdue: t.col !== 'done' && t.due && t.due < today }">📅 {{ t.due || '无日期' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="任务详情" :visible.sync="taskDialogVisible" width="560px" top="6vh">
      <div class="field">
        <div class="field-label">任务标题</div>
        <el-input v-model="form.title" placeholder="请填写任务标题" />
      </div>
      <div class="field">
        <div class="field-label">任务描述</div>
        <el-input v-model="form.desc" type="textarea" :rows="3" />
      </div>
      <el-row :gutter="14">
        <el-col :span="12">
          <div class="field">
            <div class="field-label">负责人</div>
            <el-select v-model="form.assignee" style="width:100%">
              <el-option v-for="m in members" :key="m.id" :label="m.name" :value="m.id" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="field">
            <div class="field-label">截止日期</div>
            <el-date-picker v-model="form.due" type="date" value-format="yyyy-MM-dd" style="width:100%" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="14">
        <el-col :span="12">
          <div class="field">
            <div class="field-label">优先级</div>
            <el-select v-model="form.priority" style="width:100%">
              <el-option label="高" value="high" />
              <el-option label="中" value="mid" />
              <el-option label="低" value="low" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="field">
            <div class="field-label">项目分类</div>
            <el-select v-model="form.proj" style="width:100%">
              <el-option v-for="p in projs" :key="p.id" :label="p.name" :value="p.id" />
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div v-if="editingId" class="field">
        <div class="field-label">评论动态</div>
        <div v-if="!editingTask || !editingTask.comments.length" class="empty-line">暂无评论</div>
        <div v-for="(c, i) in editingTask ? editingTask.comments : []" :key="'tc-' + i" class="comment-item">
          <span class="avatar" :style="{ background: memberOf(c.who).color }">{{ memberOf(c.who).name.charAt(0) }}</span>
          <div>
            <div class="who">{{ memberOf(c.who).name }}<span class="when">{{ c.when }}</span></div>
            <div class="text">{{ c.text }}</div>
          </div>
        </div>
        <div class="comment-input-row">
          <el-input v-model="commentInput" size="small" placeholder="写下评论…" @keyup.enter.native="addComment" />
          <el-button type="primary" size="small" @click="addComment">发送</el-button>
        </div>
      </div>
      <span slot="footer">
        <el-button v-if="editingId" type="text" class="del-link" @click="deleteTask">删除任务</el-button>
        <el-button @click="taskDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTask">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="负责人管理" :visible.sync="memberDialogVisible" width="480px" top="8vh">
      <div v-for="(m, i) in members" :key="m.id" class="member-row">
        <el-color-picker v-model="m.color" size="small" @change="refreshFilters" />
        <el-input v-model="m.name" size="small" maxlength="6" @change="refreshFilters" />
        <span class="task-count">{{ taskCountOf(m.id) }} 个任务</span>
        <el-button size="mini" type="text" class="del-link" @click="deleteMember(i)">删除</el-button>
      </div>
      <div class="member-row add-row">
        <el-color-picker v-model="newMember.color" size="small" />
        <el-input v-model="newMember.name" size="small" maxlength="6" placeholder="新成员名称" @keyup.enter.native="addMember" />
        <el-button type="primary" size="small" @click="addMember">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TodoBoard',
  data() {
    return {
      members: [
        { id: 13, name: 'CO', color: '#8d6e63' },
        { id: 2, name: '木头', color: '#6d4c41' },
        { id: 3, name: '松果', color: '#a1887f' },
        { id: 4, name: '树皮', color: '#5d4037' }
      ],
      projs: [
        { id: 'lab', name: '实验室', color: '#8d6e63', bg: '#f3edeb' },
        { id: 'backend', name: '后台', color: '#409eff', bg: '#ecf5ff' },
        { id: 'main', name: '主站', color: '#67c23a', bg: '#f0f9eb' },
        { id: 'other', name: '其他', color: '#909399', bg: '#f4f4f5' }
      ],
      projFilter: '',
      filterMember: 0,
      // 模拟数据：正式版来自 /todo 接口 + MySQL
      tasks: [
        { id: 1, col: 'todo', proj: 'lab', title: '原木竞技场：对战匹配规则设计', desc: '确定竞技场的进入条件、匹配机制与胜负结算奖励，输出设计文档。', assignee: 13, due: '2026-10-25', priority: 'high',
          comments: [{ who: 13, when: '2026-10-19 21:04', text: '先出初稿，下周和小木对齐。' }] },
        { id: 2, col: 'todo', proj: 'backend', title: '罗盘系统：协作待办接入后端', desc: '新增 routes/todo.js，建立 board/card/comment 三张表，JWT 鉴权。', assignee: 2, due: '2026-10-28', priority: 'mid', comments: [] },
        { id: 3, col: 'todo', proj: 'main', title: '社区敏感词库季度更新', desc: '整理近三个月新增违规样本，补充敏感词条目。', assignee: 3, due: '2026-10-22', priority: 'low', comments: [] },
        { id: 4, col: 'doing', proj: 'lab', title: '原木保卫战：村庄建造手感优化', desc: '拖拽放置的吸附范围和预览虚影跟随不流畅，需要调整插值参数。', assignee: 4, due: '2026-10-21', priority: 'high',
          comments: [
            { who: 4, when: '2026-10-18 15:30', text: '吸附阈值从 24px 调到 32px 后明显顺滑。' },
            { who: 13, when: '2026-10-19 09:12', text: '今天上线前记得回归测试移动端。' }
          ] },
        { id: 5, col: 'doing', proj: 'main', title: '入站必读书单洗牌逻辑修正', desc: '合并 PR#7 后确认 leaderboard 重建时书单随机化不再触发自动更新。', assignee: 13, due: '2026-10-20', priority: 'mid',
          comments: [{ who: 2, when: '2026-10-19 11:40', text: '本地已验证，等部署。' }] },
        { id: 6, col: 'doing', proj: 'backend', title: '图床 frp 链路巡检脚本', desc: '封面图 404 多为 frpc 掉线，写一个定时探活脚本自动告警。', assignee: 2, due: '2026-10-30', priority: 'low', comments: [] },
        { id: 7, col: 'done', proj: 'lab', title: '楼层切换按钮「地上」更名「上地」', desc: '原木保卫战文案修正，已随版本发布。', assignee: 3, due: '2026-10-15', priority: 'low',
          comments: [{ who: 3, when: '2026-10-15 18:02', text: '已上线。' }] },
        { id: 8, col: 'done', proj: 'backend', title: '管理端菜单搜索快捷键', desc: 'Ctrl+K 唤起菜单搜索，Enter 跳转。', assignee: 4, due: '2026-10-12', priority: 'mid', comments: [] }
      ],
      projComments: {
        lab: [{ who: 13, when: '2026-10-19 20:15', text: '竞技场本周出匹配规则初稿，保卫战手感优化并行推进。' }],
        backend: [{ who: 2, when: '2026-10-18 10:02', text: 'todo 三张表结构已定，等前端联调。' }],
        main: [],
        other: []
      },
      projDocs: {
        lab: [{ name: '原木竞技场-玩法设计草案.md', size: '18 KB', who: 13, when: '2026-10-19 20:20' }],
        backend: [{ name: 'todo-表结构设计.sql', size: '3 KB', who: 2, when: '2026-10-18 10:05' }],
        main: [],
        other: []
      },
      columns: [
        { key: 'todo', label: '📋 待办' },
        { key: 'doing', label: '🚧 进行中' },
        { key: 'done', label: '✅ 已完成' }
      ],
      dragOverCol: '',
      taskDialogVisible: false,
      memberDialogVisible: false,
      editingId: null,
      nextId: 9,
      form: { title: '', desc: '', assignee: 13, due: '', priority: 'mid', proj: 'other' },
      commentInput: '',
      projCommentInput: '',
      newMember: { name: '', color: '#795548' },
      lastUpdated: ''
    }
  },
  computed: {
    today() {
      const d = new Date()
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    },
    projChips() {
      return [{ id: '', name: '全部' }, ...this.projs]
    },
    memberChips() {
      return [{ id: 0, name: '全部', color: '' }, ...this.members]
    },
    visibleTasks() {
      return this.tasks.filter(t =>
        (!this.filterMember || t.assignee === this.filterMember) &&
        (!this.projFilter || t.proj === this.projFilter)
      )
    },
    colTasks() {
      const cols = { todo: [], doing: [], done: [] }
      this.visibleTasks.forEach(t => (cols[t.col] || cols.todo).push(t))
      return cols
    },
    overdueCount() {
      return this.tasks.filter(t => t.col !== 'done' && t.due && t.due < this.today).length
    },
    editingTask() {
      return this.tasks.find(t => t.id === this.editingId) || null
    }
  },
  mounted() {
    this.refreshTime()
  },
  methods: {
    memberOf(id) {
      return this.members.find(m => m.id === id) || { id, name: '已删除', color: '#bcaaa4' }
    },
    projOf(id) {
      return this.projs.find(p => p.id === id) || this.projs[3]
    },
    taskCountOf(id) {
      return this.tasks.filter(t => t.assignee === id).length
    },
    refreshTime() {
      this.lastUpdated = new Date().toLocaleString('zh-CN', { hour12: false })
    },
    switchProj(id) {
      this.projFilter = id
    },
    switchMember(id) {
      this.filterMember = id
    },
    refreshFilters() {
      // 名称/颜色行内修改后强制重渲染筛选行
      this.members = [...this.members]
    },
    onDragStart(task, event) {
      event.dataTransfer.setData('text/plain', String(task.id))
    },
    onDrop(col, event) {
      this.dragOverCol = ''
      const id = Number(event.dataTransfer.getData('text/plain'))
      const task = this.tasks.find(t => t.id === id)
      if (!task || task.col === col) return
      task.col = col
      if (col === 'done') {
        task.comments.push({
          who: 13,
          when: new Date().toLocaleString('zh-CN', { hour12: false }),
          text: '状态流转为已完成。'
        })
      }
      this.refreshTime()
    },
    openTask(task) {
      this.editingId = task.id
      this.form = {
        title: task.title,
        desc: task.desc,
        assignee: task.assignee,
        due: task.due,
        priority: task.priority,
        proj: task.proj
      }
      this.commentInput = ''
      this.taskDialogVisible = true
    },
    openNew() {
      this.editingId = null
      this.form = {
        title: '',
        desc: '',
        assignee: 13,
        due: '',
        priority: 'mid',
        proj: this.projFilter || 'other'
      }
      this.taskDialogVisible = true
    },
    saveTask() {
      if (!this.form.title.trim()) {
        this.$message.warning('请填写任务标题')
        return
      }
      const data = { ...this.form, title: this.form.title.trim() }
      if (this.editingId) {
        Object.assign(this.editingTask, data)
      } else {
        this.tasks.push({ id: this.nextId++, col: 'todo', comments: [], ...data })
      }
      this.taskDialogVisible = false
      this.refreshTime()
    },
    deleteTask() {
      this.$confirm('确认删除该任务？', '提示', { type: 'warning' }).then(() => {
        this.tasks = this.tasks.filter(t => t.id !== this.editingId)
        this.taskDialogVisible = false
      }).catch(() => {})
    },
    addComment() {
      const text = this.commentInput.trim()
      if (!text || !this.editingTask) return
      this.editingTask.comments.push({
        who: 13,
        when: new Date().toLocaleString('zh-CN', { hour12: false }),
        text
      })
      this.commentInput = ''
    },
    addProjComment() {
      const text = this.projCommentInput.trim()
      if (!text || !this.projFilter) return
      if (!this.projComments[this.projFilter]) this.$set(this.projComments, this.projFilter, [])
      this.projComments[this.projFilter].push({
        who: 13,
        when: new Date().toLocaleString('zh-CN', { hour12: false }),
        text
      })
      this.projCommentInput = ''
    },
    uploadDoc(event) {
      const file = event.target.files && event.target.files[0]
      if (!file || !this.projFilter) return
      const kb = file.size / 1024
      const size = kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(kb)) + ' KB'
      if (!this.projDocs[this.projFilter]) this.$set(this.projDocs, this.projFilter, [])
      this.projDocs[this.projFilter].push({
        name: file.name,
        size,
        who: 13,
        when: new Date().toLocaleString('zh-CN', { hour12: false })
      })
      event.target.value = ''
    },
    deleteDoc(index) {
      const doc = this.projDocs[this.projFilter][index]
      this.$confirm(`确认删除文档「${doc.name}」？`, '提示', { type: 'warning' }).then(() => {
        this.projDocs[this.projFilter].splice(index, 1)
      }).catch(() => {})
    },
    openMembers() {
      this.newMember = { name: '', color: '#795548' }
      this.memberDialogVisible = true
    },
    addMember() {
      const name = this.newMember.name.trim()
      if (!name) {
        this.$message.warning('请填写成员名称')
        return
      }
      const maxId = this.members.reduce((max, m) => Math.max(max, m.id), 0)
      this.members.push({ id: maxId + 1, name, color: this.newMember.color })
      this.newMember = { name: '', color: '#795548' }
    },
    deleteMember(index) {
      const m = this.members[index]
      const count = this.taskCountOf(m.id)
      if (count > 0) {
        this.$message.warning(`「${m.name}」名下还有 ${count} 个任务，请先把任务转移给其他负责人。`)
        return
      }
      this.$confirm(`确认删除成员「${m.name}」？`, '提示', { type: 'warning' }).then(() => {
        this.members.splice(index, 1)
        if (this.filterMember === m.id) this.filterMember = 0
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-board-page {
  padding: 24px;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 26px 32px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6d4c41 0%, #8d6e63 55%, #b08968 100%);
  color: #fff;
  margin-bottom: 20px;

  .subtitle {
    font-size: 15px;
    opacity: .9;
  }

  .title {
    margin-top: 10px;
    font-size: 30px;
    font-weight: 700;
  }

  .description {
    margin-top: 12px;
    max-width: 640px;
    line-height: 1.7;
    opacity: .95;
    font-size: 14px;
  }
}

.hero-side {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.hero-metric {
  text-align: right;

  span {
    display: block;
    font-size: 14px;
    opacity: .85;
  }

  strong {
    display: block;
    margin-top: 10px;
    font-size: 38px;
  }
}

.hero-update {
  font-size: 13px;
  opacity: .85;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 18px 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .06);

  .metric-label {
    color: #8c8c8c;
    font-size: 14px;
  }

  .metric-value {
    margin-top: 8px;
    font-size: 28px;
    font-weight: 700;
    color: #5d4037;

    &.overdue {
      color: #c0392b;
    }
  }

  .metric-desc {
    margin-top: 6px;
    line-height: 1.6;
    font-size: 13px;
    color: #999;
  }
}

.filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .label {
    font-size: 14px;
    color: #8c8c8c;
  }
}

.proj-filters {
  margin-bottom: 12px;
}

.chip {
  padding: 5px 14px;
  border-radius: 16px;
  font-size: 13px;
  border: 1px solid #d7ccc8;
  background: #fff;
  color: #5d4037;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 11px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: #f5efec;
  }

  &.active {
    background: #795548;
    border-color: #795548;
    color: #fff;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  .toolbar-actions {
    display: flex;
    gap: 10px;
  }
}

.proj-panel {
  border: 1px solid #e8ddd6;
  border-radius: 12px;
  background: #fffdfb;
  padding: 18px 20px;
  margin-bottom: 16px;

  h3 {
    margin: 0 0 14px;
    font-size: 16px;
    color: #5d4037;
  }
}

.proj-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.proj-col-title {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 8px;
  font-weight: 600;
}

.empty-line {
  font-size: 13px;
  color: #bcaaa4;
  padding: 8px 0;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f5efec;

  .who {
    font-size: 13px;
    font-weight: 600;
    color: #5d4037;
  }

  .when {
    font-size: 11px;
    color: #bcaaa4;
    margin-left: 8px;
    font-weight: 400;
  }

  .text {
    font-size: 13px;
    color: #5d4037;
    margin-top: 4px;
    line-height: 1.6;
  }
}

.comment-input-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.doc-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f5efec;
  font-size: 13px;

  .doc-name {
    color: #5d4037;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .doc-meta {
    color: #bcaaa4;
    font-size: 12px;
    white-space: nowrap;
  }

  .doc-del {
    color: #c0392b;
    padding: 0;
  }
}

.upload-btn {
  margin-top: 12px;
}

.kanban {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.column {
  background: #f5efec;
  border-radius: 12px;
  padding: 12px;
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

.column.drag-over .cards {
  outline: 2px dashed #a1887f;
  outline-offset: 4px;
  border-radius: 8px;
}

.column-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 12px;

  .name {
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .count {
    background: #d7ccc8;
    color: #5d4037;
    font-size: 12px;
    padding: 1px 9px;
    border-radius: 10px;
  }

  .col-add {
    color: #8d6e63;
    font-size: 18px;
    padding: 2px 6px;
  }
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 60px;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 14px 12px;
  box-shadow: 0 1px 3px rgba(62, 39, 35, .12);
  cursor: grab;
  transition: box-shadow .15s, transform .15s;
  border-left: 4px solid transparent;

  &:hover {
    box-shadow: 0 4px 12px rgba(62, 39, 35, .18);
    transform: translateY(-1px);
  }

  &.p-high { border-left-color: #c0392b; }
  &.p-mid { border-left-color: #e6a23c; }
  &.p-low { border-left-color: #90a955; }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: #3e2723;
    line-height: 1.5;
  }

  .card-desc {
    margin-top: 6px;
    font-size: 12px;
    color: #8c8c8c;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tag {
    display: inline-block;
    margin-top: 8px;
    padding: 1px 8px;
    border-radius: 4px;
    font-size: 11px;

    &.high { background: #fdecea; color: #c0392b; }
    &.mid { background: #fdf3e2; color: #b7791f; }
    &.low { background: #eef3e2; color: #5f7d2a; }

    &.proj-tag {
      margin-left: 6px;
    }
  }

  .card-foot {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #f1ece9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .assignee {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #6d4c41;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #a1887f;

    .due.overdue {
      color: #c0392b;
    }
  }
}

.avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.empty-hint {
  border: 2px dashed #d7ccc8;
  border-radius: 10px;
  padding: 18px 0;
  text-align: center;
  font-size: 12px;
  color: #bcaaa4;
}

.del-link {
  color: #c0392b;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f5efec;

  .el-input {
    flex: 1;
  }

  .task-count {
    font-size: 12px;
    color: #a1887f;
    white-space: nowrap;
  }

  &.add-row {
    border-bottom: none;
  }
}

@media (max-width: 1100px) {
  .metric-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .kanban {
    grid-template-columns: 1fr;
  }

  .hero-card {
    flex-direction: column;
    gap: 16px;
  }

  .hero-side {
    align-items: flex-start;
  }
}
</style>
