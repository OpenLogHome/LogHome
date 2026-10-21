<template>
  <div class="todo-board-page">
    <div class="stat-strip">
      <div class="stat-cell">
        <span class="stat-icon tone-todo"><pixel-icon name="clipboard" :size="18" /></span>
        <div class="stat-meta">
          <span class="stat-label">待办任务</span>
          <strong class="stat-value">{{ colTasks.todo.length }}</strong>
        </div>
      </div>
      <div class="stat-cell">
        <span class="stat-icon tone-doing"><pixel-icon name="hourglass" :size="18" /></span>
        <div class="stat-meta">
          <span class="stat-label">进行中</span>
          <strong class="stat-value">{{ colTasks.doing.length }}</strong>
        </div>
      </div>
      <div class="stat-cell">
        <span class="stat-icon tone-done"><pixel-icon name="check" :size="18" /></span>
        <div class="stat-meta">
          <span class="stat-label">已完成</span>
          <strong class="stat-value">{{ colTasks.done.length }}</strong>
        </div>
      </div>
      <div class="stat-cell">
        <span class="stat-icon tone-alert"><pixel-icon name="alert" :size="18" /></span>
        <div class="stat-meta">
          <span class="stat-label">已逾期</span>
          <strong class="stat-value" :class="{ danger: overdueCount > 0 }">{{ overdueCount }}</strong>
        </div>
      </div>
    </div>

    <div class="control-bar">
      <div class="filter-block">
        <span class="filter-label">项目</span>
        <div class="chips">
          <button
            v-for="p in projChips"
            :key="p.id || 'all'"
            type="button"
            class="chip"
            :class="{ active: p.id === projFilter }"
            @click="switchProj(p.id)"
          >
            <span v-if="p.id" class="proj-dot" :style="{ background: p.color }"></span>{{ p.name }}
          </button>
        </div>
      </div>

      <div class="filter-block">
        <span class="filter-label">负责人</span>
        <div class="chips">
          <span v-if="membersLoading" class="chip-loading">正在同步管理员…</span>
          <button v-else-if="!members.length" type="button" class="chip chip-retry" @click="loadBoard">
            成员加载失败，点击重试
          </button>
          <template v-else>
            <button
              type="button"
              class="chip"
              :class="{ active: filterMember === 0 }"
              @click="switchMember(0)"
            >全部</button>
            <button
              v-for="m in members"
              :key="m.id"
              type="button"
              class="chip member-chip"
              :class="{ active: m.id === filterMember }"
              @click="switchMember(m.id)"
            >
              <el-avatar
                :size="18"
                :src="m.avatar"
                :style="{ background: m.color }"
                class="chip-avatar"
              >{{ avatarText(m) }}</el-avatar>
              <span class="chip-name">{{ m.name }}</span>
            </button>
          </template>
        </div>
      </div>

      <div class="control-actions">
        <el-button class="ghost-btn" @click="openMembers">
          <pixel-icon name="users" :size="14" /><span>成员</span>
        </el-button>
        <el-button type="primary" @click="openNew('todo')">
          <pixel-icon name="plus" :size="13" /><span>新建任务</span>
        </el-button>
      </div>
    </div>

    <div v-if="projFilter" class="project-panel">
      <div class="panel-head">
        <div class="panel-title">
          <pixel-icon name="folder" :size="15" />
          <span>{{ projOf(projFilter).name }}</span>
          <span class="panel-sub">项目动态</span>
        </div>
        <button type="button" class="panel-close" title="收起项目动态" @click="projFilter = ''">
          <pixel-icon name="close" :size="12" />
        </button>
      </div>
      <div class="panel-grid">
        <section class="panel-col">
          <h4>项目评论</h4>
          <div v-if="!(projComments[projFilter] || []).length" class="empty-line">还没有项目评论</div>
          <div
            v-for="(c, i) in projComments[projFilter] || []"
            :key="projFilter + '-c-' + i"
            class="comment-item"
          >
            <el-avatar
              :size="24"
              :src="memberOf(c.who).avatar"
              :style="{ background: memberOf(c.who).color }"
            >{{ avatarText(memberOf(c.who)) }}</el-avatar>
            <div class="comment-body">
              <div class="comment-head">
                <span class="comment-who">{{ memberOf(c.who).name }}</span>
                <span class="comment-when">{{ c.when }}</span>
              </div>
              <div class="comment-text">{{ c.text }}</div>
            </div>
          </div>
          <div class="comment-input-row">
            <el-input
              v-model="projCommentInput"
              size="small"
              placeholder="写下项目评论…"
              @keyup.enter.native="addProjComment"
            />
            <el-button type="primary" size="small" :loading="projCommentSending" @click="addProjComment">发送</el-button>
          </div>
        </section>

        <section class="panel-col">
          <h4>项目文档 <span class="panel-count">{{ (projDocs[projFilter] || []).length }}</span></h4>
          <div v-if="!(projDocs[projFilter] || []).length" class="empty-line">暂无项目文档，上传第一个附件吧</div>
          <div
            v-for="(d, i) in projDocs[projFilter] || []"
            :key="d.id || i"
            class="doc-row"
          >
            <el-image
              v-if="d.isImage && d.inlineUrl"
              class="doc-thumb"
              :src="d.inlineUrl"
              :preview-src-list="[d.inlineUrl]"
              fit="cover"
            />
            <span v-else class="doc-icon"><pixel-icon :name="d.isImage ? 'image' : 'file'" :size="16" /></span>
            <div class="doc-main">
              <el-link
                v-if="d.url"
                class="doc-name"
                :href="d.url"
                target="_blank"
                :underline="false"
              >{{ d.name }}</el-link>
              <span v-else class="doc-name">{{ d.name }}</span>
              <span class="doc-meta">{{ d.size }} · {{ memberOf(d.who).name }} · {{ d.when }}</span>
            </div>
            <button type="button" class="icon-button" title="删除文档" @click="deleteDoc(i)">
              <pixel-icon name="trash" :size="14" />
            </button>
          </div>
          <div
            class="upload-zone project-zone"
            :class="{ dragging: dragTarget === 'project' }"
            @click="$refs.projectFile.click()"
            @dragover.prevent="dragTarget = 'project'"
            @dragleave="onZoneDragLeave($event, 'project')"
            @drop.prevent="onDropFiles($event, 'project')"
          >
            <pixel-icon name="upload" :size="20" />
            <div class="zone-main">点击或拖拽上传文档、图片</div>
            <div class="zone-hint">选中项目时，直接 Ctrl / ⌘ + V 也能粘贴附件</div>
          </div>
          <input ref="projectFile" type="file" multiple class="hidden-input" @change="onProjectFilePicked" />
          <div v-if="uploading && uploadTarget === 'project'" class="upload-status">
            <span class="upload-spinner"></span>{{ uploadProgress > 0 ? '上传中 ' + uploadProgress + '%' : '正在连接存储服务…' }}
          </div>
        </section>
      </div>
    </div>

    <div class="kanban" v-loading="boardLoading">
      <div
        v-for="col in columns"
        :key="col.key"
        class="column"
        :class="['col-' + col.key, { 'drag-over': dragOverCol === col.key }]"
        @dragover.prevent="dragOverCol = col.key"
        @dragleave="onColumnDragLeave(col.key, $event)"
        @drop.prevent="onDrop(col.key, $event)"
      >
        <div class="column-head">
          <span class="column-icon"><pixel-icon :name="col.icon" :size="15" /></span>
          <span class="column-name">{{ col.label }}</span>
          <span class="column-count">{{ colTasks[col.key].length }}</span>
          <button type="button" class="column-add" title="在此列新建任务" @click="openNew(col.key)">
            <pixel-icon name="plus" :size="11" />
          </button>
        </div>
        <div class="cards">
          <div v-if="!colTasks[col.key].length" class="empty-hint">
            <pixel-icon :name="col.icon" :size="22" />
            <span>{{ col.empty }}</span>
          </div>
          <div
            v-for="t in colTasks[col.key]"
            :key="t.id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart(t, $event)"
            @dragend="dragOverCol = ''"
            @click="openTask(t)"
          >
            <div class="card-top">
              <span
                class="proj-tag"
                :style="{ color: projOf(t.proj).color, background: projOf(t.proj).bg }"
              >{{ projOf(t.proj).name }}</span>
              <span class="priority" :class="t.priority">{{ priorityLabel(t.priority) }}</span>
            </div>
            <div class="card-title">{{ t.title }}</div>
            <div v-if="t.desc" class="card-desc">{{ t.desc }}</div>
            <div class="card-foot">
              <span class="assignee">
                <el-avatar
                  :size="20"
                  :src="memberOf(t.assignee).avatar"
                  :style="{ background: memberOf(t.assignee).color }"
                >{{ avatarText(memberOf(t.assignee)) }}</el-avatar>
                <span class="assignee-name">{{ memberOf(t.assignee).name }}</span>
              </span>
              <span class="card-meta">
                <span v-if="(t.attachments || []).length" class="meta-item" :title="t.attachments.map(a => a.name).join('\n')">
                  <pixel-icon name="paperclip" :size="11" />{{ t.attachments.length }}
                </span>
                <span v-if="t.comments.length" class="meta-item" title="评论数">
                  <pixel-icon name="comment" :size="11" />{{ t.comments.length }}
                </span>
                <span class="meta-item due" :class="{ overdue: isOverdue(t) }">
                  <pixel-icon name="calendar" :size="11" />{{ t.due || '无日期' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="任务详情" :visible.sync="taskDialogVisible" width="680px" top="5vh">
      <div class="field">
        <div class="field-label">任务标题</div>
        <el-input v-model="form.title" maxlength="60" show-word-limit placeholder="请填写任务标题" />
      </div>
      <div class="field">
        <div class="field-label">任务描述</div>
        <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="补充任务背景、验收标准…" />
      </div>
      <el-row :gutter="14">
        <el-col :span="12">
          <div class="field">
            <div class="field-label">负责人</div>
            <el-select v-model="form.assignee" style="width:100%" placeholder="请选择负责人">
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

      <div class="field">
        <div class="field-label">
          附件
          <span class="field-hint">图片可预览，支持 Ctrl / ⌘ + V 直接粘贴</span>
        </div>
        <div class="attachment-list">
          <div v-for="(a, i) in formAttachments" :key="a.key || a.id" class="attachment-item">
            <el-image
              v-if="a.isImage && a.inlineUrl"
              class="attachment-thumb"
              :src="a.inlineUrl"
              :preview-src-list="[a.inlineUrl]"
              fit="cover"
            />
            <span v-else class="attachment-file">
              <pixel-icon :name="a.isImage ? 'image' : 'file'" :size="16" />
            </span>
            <div class="attachment-meta">
              <el-link
                v-if="a.url"
                class="attachment-name"
                :href="a.url"
                target="_blank"
                :underline="false"
              >{{ a.name }}</el-link>
              <span v-else class="attachment-name">{{ a.name }}</span>
              <span class="attachment-size">{{ a.size }}</span>
            </div>
            <button type="button" class="icon-button" title="移除附件" @click="formAttachments.splice(i, 1)">
              <pixel-icon name="close" :size="11" />
            </button>
          </div>
        </div>
        <div
          class="upload-zone task-zone"
          :class="{ dragging: dragTarget === 'task' }"
          @click="$refs.taskFile.click()"
          @dragover.prevent="dragTarget = 'task'"
          @dragleave="onZoneDragLeave($event, 'task')"
          @drop.prevent="onDropFiles($event, 'task')"
        >
          <pixel-icon name="upload" :size="17" />
          <span class="zone-main">点击、拖拽或 Ctrl / ⌘ + V 上传附件 / 图片</span>
        </div>
        <input ref="taskFile" type="file" multiple class="hidden-input" @change="onTaskFilePicked" />
        <div v-if="uploading && uploadTarget === 'task'" class="upload-status">
          <span class="upload-spinner"></span>{{ uploadProgress > 0 ? '上传中 ' + uploadProgress + '%' : '正在连接存储服务…' }}
        </div>
      </div>

      <div v-if="editingId" class="comments-block">
        <div class="field-label">评论动态</div>
        <div v-if="!editingTask || !editingTask.comments.length" class="empty-line">暂无评论</div>
        <div v-else class="comment-scroll">
          <div v-for="(c, i) in editingTask.comments" :key="'tc-' + i" class="comment-item">
            <el-avatar
              :size="24"
              :src="memberOf(c.who).avatar"
              :style="{ background: memberOf(c.who).color }"
            >{{ avatarText(memberOf(c.who)) }}</el-avatar>
            <div class="comment-body">
              <div class="comment-head">
                <span class="comment-who">{{ memberOf(c.who).name }}</span>
                <span class="comment-when">{{ c.when }}</span>
              </div>
              <div class="comment-text">{{ c.text }}</div>
            </div>
          </div>
        </div>
        <div class="comment-input-row">
          <el-input
            v-model="commentInput"
            size="small"
            placeholder="写下评论…"
            @keyup.enter.native="addComment"
          />
          <el-button type="primary" size="small" :loading="commentSending" @click="addComment">发送</el-button>
        </div>
      </div>

      <span slot="footer">
        <el-button v-if="editingId" type="text" class="danger-link" @click="deleteTask">删除任务</el-button>
        <el-button @click="taskDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saving" @click="saveTask">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="看板成员" :visible.sync="memberDialogVisible" width="560px" top="8vh">
      <div class="member-intro">
        <pixel-icon name="users" :size="16" />
        <span>成员与系统管理员账号实时绑定。如需新增或移除，请前往
          <a class="text-link" href="javascript:void(0)" @click="goUserManage">用户管理</a>
          调整管理员身份。</span>
      </div>
      <div v-if="membersLoading" class="member-loading">正在同步管理员账号…</div>
      <div v-else-if="!members.length" class="empty-line">暂时没有可用的管理员账号</div>
      <div v-else class="member-list">
        <div v-for="m in members" :key="m.id" class="member-row">
          <el-avatar :size="34" :src="m.avatar" :style="{ background: m.color }">{{ avatarText(m) }}</el-avatar>
          <div class="member-info">
            <div class="member-name">
              {{ m.name }}
              <span v-if="m.id === currentUserId" class="member-me">我</span>
            </div>
            <div class="member-account">@{{ m.account || m.id }}</div>
          </div>
          <span v-if="!m.active" class="member-badge inactive">已停用</span>
          <span class="member-badge admin">管理员</span>
          <span class="member-tasks">{{ taskCountOf(m.id) }} 个任务</span>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="memberDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="goUserManage">前往用户管理</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PixelIcon from '../../components/PixelIcon.vue'

const STORAGE_SERVICE_KEY = '290ab192e78b099dbf443f4c3b9f069682ba6f85'
const STORAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload'
const STORAGE_RESOURCE_URL = 'https://storage.codesocean.top/api/resource'
const TODO_STORAGE_CONTAINER = '175221160113586'
const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024
// 存储服务在代理异常时会挂起请求，超过该时长无任何上传进展就主动中断，避免界面永久停在 0%。
const UPLOAD_STALL_TIMEOUT = 20000
const MEMBER_COLORS = ['#8d6e63', '#a1887f', '#795548', '#9c7a63', '#6d4c41', '#b08968']
const PRIORITY_LABELS = { high: '高', mid: '中', low: '低' }

export default {
  name: 'TodoBoard',
  components: { PixelIcon },
  data() {
    return {
      members: [],
      membersLoading: false,
      boardLoading: false,
      currentUser: null,
      projs: [],
      projFilter: '',
      filterMember: 0,
      tasks: [],
      columns: [
        { key: 'todo', label: '待办', icon: 'clipboard', empty: '暂无任务，拖拽卡片到这里' },
        { key: 'doing', label: '进行中', icon: 'hourglass', empty: '暂无进行中的任务' },
        { key: 'done', label: '已完成', icon: 'check', empty: '还没有完成的任务' }
      ],
      dragOverCol: '',
      dragTarget: '',
      taskDialogVisible: false,
      memberDialogVisible: false,
      editingId: null,
      saving: false,
      commentSending: false,
      projCommentSending: false,
      form: { title: '', desc: '', assignee: null, due: '', priority: 'mid', proj: null, col: 'todo' },
      formAttachments: [],
      commentInput: '',
      projCommentInput: '',
      uploading: false,
      uploadProgress: 0,
      uploadTarget: ''
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
      return this.visibleTasks.filter(t => t.col !== 'done' && t.due && t.due < this.today).length
    },
    editingTask() {
      return this.tasks.find(t => t.id === this.editingId) || null
    },
    currentUserId() {
      return this.currentUser && this.currentUser.user_id ? this.currentUser.user_id : null
    },
    projComments() {
      const map = {}
      this.projs.forEach(project => { map[project.id] = project.comments || [] })
      return map
    },
    projDocs() {
      const map = {}
      this.projs.forEach(project => { map[project.id] = project.attachments || [] })
      return map
    }
  },
  created() {
    this.loadBoard()
    this.loadProfile()
    document.addEventListener('paste', this.handleGlobalPaste)
  },
  beforeDestroy() {
    document.removeEventListener('paste', this.handleGlobalPaste)
  },
  methods: {
    async loadBoard() {
      this.boardLoading = true
      this.membersLoading = true
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/todo-board')
        const data = response.data || {}
        this.projs = (data.projects || []).map(project => ({
          id: project.id,
          name: project.name,
          color: project.color,
          bg: project.bg_color,
          comments: (project.comments || []).map(comment => this.mapComment(comment)),
          attachments: (project.attachments || []).map(attachment => this.mapAttachment(attachment))
        }))
        this.tasks = (data.tasks || []).map(task => ({
          id: task.id,
          col: task.status,
          proj: task.project_id,
          title: task.title,
          desc: task.description || '',
          assignee: task.assignee_id,
          due: task.due_date || '',
          priority: task.priority,
          comments: (task.comments || []).map(comment => this.mapComment(comment)),
          attachments: (task.attachments || []).map(attachment => this.mapAttachment(attachment))
        }))
        this.members = (data.members || []).map(member => ({
          id: member.id,
          name: member.name || member.account || '用户 ' + member.id,
          account: member.account || '',
          avatar: member.avatar_url || '',
          active: Boolean(member.active),
          color: this.colorFor(member.id)
        }))
        if (this.projFilter && !this.projs.some(project => project.id === this.projFilter)) {
          this.projFilter = ''
        }
        if (this.filterMember && !this.members.some(member => member.id === this.filterMember)) {
          this.filterMember = 0
        }
      } catch (error) {
        console.error('加载协作待办看板失败', error)
        this.$message.error(this.errorMessage(error, '看板加载失败，请稍后重试'))
      } finally {
        this.boardLoading = false
        this.membersLoading = false
      }
    },
    mapComment(comment) {
      return {
        id: comment.id,
        who: comment.author_id,
        when: this.formatWhen(comment.created_at),
        text: comment.content,
        system: Boolean(comment.is_system)
      }
    },
    mapAttachment(attachment) {
      return {
        id: attachment.id,
        key: 'att-' + attachment.id,
        resourceId: attachment.resource_id,
        name: attachment.name,
        size: this.formatSize(attachment.size_bytes),
        sizeBytes: attachment.size_bytes,
        isImage: Boolean(attachment.is_image),
        inlineUrl: attachment.inline_url,
        url: attachment.url,
        who: attachment.uploaded_by,
        when: this.formatWhen(attachment.created_at)
      }
    },
    formatWhen(value) {
      if (!value) return ''
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    },
    errorMessage(error, fallback) {
      return (error.response && error.response.data && error.response.data.msg) || fallback
    },
    loadProfile() {
      this.axios.get(this.$baseUrl + '/users/userprofile').then(response => {
        this.currentUser = response.data || null
      }).catch(error => {
        console.error('获取当前管理员信息失败', error)
      })
    },
    colorFor(id) {
      const value = Math.abs(Number(id) || 0)
      return MEMBER_COLORS[value % MEMBER_COLORS.length]
    },
    avatarText(member) {
      if (!member || !member.name) return '?'
      return member.name.slice(0, 1).toUpperCase()
    },
    memberOf(id) {
      if (id === null || id === undefined || id === 0) {
        return { id: 0, name: '未指派', avatar: '', color: '#c9b4a8' }
      }
      const found = this.members.find(m => m.id === id)
      if (found) return found
      if (this.currentUser && this.currentUser.user_id === id) {
        return {
          id,
          name: this.currentUser.name || this.currentUser.account || '我',
          avatar: this.currentUser.avatar_url || '',
          color: this.colorFor(id)
        }
      }
      return { id, name: '已删除', avatar: '', color: '#c9b4a8' }
    },
    projOf(id) {
      return this.projs.find(p => p.id === id) || { id: 0, name: '未分类', color: '#909399', bg: '#f4f4f5' }
    },
    taskCountOf(id) {
      return this.tasks.filter(t => t.assignee === id).length
    },
    priorityLabel(priority) {
      return PRIORITY_LABELS[priority] || '中'
    },
    isOverdue(task) {
      return task.col !== 'done' && !!task.due && task.due < this.today
    },
    switchProj(id) {
      if (!id) {
        this.projFilter = ''
        return
      }
      this.projFilter = this.projFilter === id ? '' : id
    },
    switchMember(id) {
      this.filterMember = this.filterMember === id ? 0 : id
    },
    onDragStart(task, event) {
      event.dataTransfer.setData('text/plain', String(task.id))
      event.dataTransfer.effectAllowed = 'move'
    },
    async onDrop(col, event) {
      this.dragOverCol = ''
      const id = Number(event.dataTransfer.getData('text/plain'))
      const task = this.tasks.find(t => t.id === id)
      if (!task || task.col === col) return
      const previousColumn = task.col
      task.col = col
      try {
        await this.axios.put(
          `${this.$baseUrl}/manage/todo-board/tasks/${task.id}`,
          this.taskPayload(task)
        )
        await this.loadBoard()
      } catch (error) {
        task.col = previousColumn
        this.$message.error(this.errorMessage(error, '任务状态更新失败'))
      }
    },
    onColumnDragLeave(colKey, event) {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        if (this.dragOverCol === colKey) this.dragOverCol = ''
      }
    },
    onZoneDragLeave(event, target) {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        if (this.dragTarget === target) this.dragTarget = ''
      }
    },
    openTask(task) {
      this.editingId = task.id
      this.form = {
        title: task.title,
        desc: task.desc,
        assignee: task.assignee,
        due: task.due,
        priority: task.priority,
        proj: task.proj,
        col: task.col
      }
      this.formAttachments = (task.attachments || []).slice()
      this.commentInput = ''
      this.taskDialogVisible = true
    },
    openNew(colKey) {
      this.editingId = null
      this.form = {
        title: '',
        desc: '',
        assignee: this.defaultAssignee(),
        due: '',
        priority: 'mid',
        proj: this.projFilter || (this.projs[0] ? this.projs[0].id : null),
        col: colKey || 'todo'
      }
      this.formAttachments = []
      this.commentInput = ''
      this.taskDialogVisible = true
    },
    defaultAssignee() {
      if (this.currentUserId && this.members.some(m => m.id === this.currentUserId)) {
        return this.currentUserId
      }
      return this.members.length ? this.members[0].id : null
    },
    attachmentPayload(list) {
      return (list || []).map(attachment => {
        if (typeof attachment.id === 'number') {
          return { id: attachment.id }
        }
        return {
          resource_id: attachment.resourceId,
          name: attachment.name,
          size: attachment.sizeBytes,
          is_image: attachment.isImage
        }
      })
    },
    taskPayload(task) {
      return {
        title: task.title,
        description: task.desc || '',
        status: task.col,
        priority: task.priority,
        project_id: task.proj,
        assignee_id: task.assignee,
        due_date: task.due || null,
        attachments: this.attachmentPayload(task.attachments)
      }
    },
    async saveTask() {
      if (!this.form.title.trim()) {
        this.$message.warning('请填写任务标题')
        return
      }
      if (!this.form.assignee) {
        this.$message.warning('请选择负责人')
        return
      }
      if (!this.form.proj) {
        this.$message.warning('请选择项目分类')
        return
      }
      const payload = {
        title: this.form.title.trim(),
        description: this.form.desc.trim(),
        status: this.form.col || 'todo',
        priority: this.form.priority,
        project_id: this.form.proj,
        assignee_id: this.form.assignee,
        due_date: this.form.due || null,
        attachments: this.attachmentPayload(this.formAttachments)
      }
      this.saving = true
      try {
        if (this.editingId) {
          await this.axios.put(
            `${this.$baseUrl}/manage/todo-board/tasks/${this.editingId}`,
            payload
          )
        } else {
          await this.axios.post(`${this.$baseUrl}/manage/todo-board/tasks`, payload)
        }
        this.taskDialogVisible = false
        await this.loadBoard()
        this.$message.success(this.editingId ? '任务已更新' : '任务已创建')
      } catch (error) {
        this.$message.error(this.errorMessage(error, '任务保存失败'))
      } finally {
        this.saving = false
      }
    },
    deleteTask() {
      this.$confirm('确认删除该任务？', '提示', { type: 'warning' }).then(async () => {
        try {
          await this.axios.delete(`${this.$baseUrl}/manage/todo-board/tasks/${this.editingId}`)
          this.taskDialogVisible = false
          await this.loadBoard()
          this.$message.success('任务已删除')
        } catch (error) {
          this.$message.error(this.errorMessage(error, '任务删除失败'))
        }
      }).catch(() => {})
    },
    async addComment() {
      const text = this.commentInput.trim()
      if (!text || !this.editingId) return
      this.commentSending = true
      try {
        await this.axios.post(
          `${this.$baseUrl}/manage/todo-board/tasks/${this.editingId}/comments`,
          { content: text }
        )
        this.commentInput = ''
        await this.loadBoard()
      } catch (error) {
        this.$message.error(this.errorMessage(error, '评论发送失败'))
      } finally {
        this.commentSending = false
      }
    },
    async addProjComment() {
      const text = this.projCommentInput.trim()
      if (!text || !this.projFilter) return
      const projectId = this.projFilter
      this.projCommentSending = true
      try {
        await this.axios.post(
          `${this.$baseUrl}/manage/todo-board/projects/${projectId}/comments`,
          { content: text }
        )
        this.projCommentInput = ''
        await this.loadBoard()
      } catch (error) {
        this.$message.error(this.errorMessage(error, '评论发送失败'))
      } finally {
        this.projCommentSending = false
      }
    },
    onTaskFilePicked(event) {
      this.handleFiles(event.target.files, 'task')
      event.target.value = ''
    },
    onProjectFilePicked(event) {
      this.handleFiles(event.target.files, 'project', { projectId: this.projFilter })
      event.target.value = ''
    },
    onDropFiles(event, target) {
      this.dragTarget = ''
      const projectId = this.projFilter
      this.handleFiles(event.dataTransfer.files, target, { projectId })
    },
    handleGlobalPaste(event) {
      const items = event.clipboardData && event.clipboardData.items
      if (!items) return
      const files = []
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile()
          if (file) files.push(file)
        }
      }
      if (!files.length) return
      if (this.taskDialogVisible) {
        event.preventDefault()
        this.handleFiles(files, 'task', { fromClipboard: true })
        return
      }
      if (!this.memberDialogVisible && this.projFilter) {
        event.preventDefault()
        this.handleFiles(files, 'project', { fromClipboard: true, projectId: this.projFilter })
        return
      }
      this.$message.info('打开任务详情或选中项目后，粘贴的图片/文件会作为附件上传')
    },
    async handleFiles(fileList, target, options = {}) {
      if (this.uploading) {
        this.$message.info('附件正在上传，请稍候')
        return
      }
      const files = Array.from(fileList || [])
      if (!files.length) return
      const projectId = options.projectId || this.projFilter
      if (target === 'project' && !projectId) {
        this.$message.warning('请先选择项目')
        return
      }
      const valid = []
      files.forEach(file => {
        if (file.size > MAX_ATTACHMENT_SIZE) {
          this.$message.warning(`「${file.name || '剪贴板文件'}」超过 50MB，已跳过`)
        } else {
          valid.push(file)
        }
      })
      if (!valid.length) return
      // 捕获当前附件数组，避免上传期间切换任务时把附件挂到别的任务上
      const taskAttachments = target === 'task' ? this.formAttachments : null
      let projectChanged = false
      this.uploading = true
      this.uploadTarget = target
      this.uploadProgress = 0
      try {
        for (let i = 0; i < valid.length; i += 1) {
          this.uploadProgress = Math.floor((i / valid.length) * 100)
          try {
            const record = await this.uploadOne(valid[i], Boolean(options.fromClipboard))
            if (taskAttachments) {
              taskAttachments.push(record)
            } else if (projectId) {
              await this.addProjectDoc(record, projectId)
              projectChanged = true
            }
          } catch (error) {
            console.error('附件上传失败', error)
            this.$message.error(this.uploadErrorMessage(error, valid[i]))
          }
        }
      } finally {
        this.uploading = false
        this.uploadTarget = ''
        this.uploadProgress = 0
      }
      if (projectChanged) {
        await this.loadBoard()
      }
    },
    uploadOne(file, fromClipboard) {
      const displayName = this.displayNameFor(file, fromClipboard)
      const formData = new FormData()
      formData.append('file', file, displayName)
      const source = this.axios.CancelToken.source()
      let stallTimer = null
      let stalled = false
      const settleStallTimer = () => {
        if (stallTimer) {
          clearTimeout(stallTimer)
          stallTimer = null
        }
      }
      const armStallTimer = () => {
        settleStallTimer()
        stallTimer = setTimeout(() => {
          stalled = true
          source.cancel('upload stalled')
        }, UPLOAD_STALL_TIMEOUT)
      }
      armStallTimer()
      return this.axios.post(`${STORAGE_UPLOAD_URL}?container=${TODO_STORAGE_CONTAINER}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ServiceKey: STORAGE_SERVICE_KEY
        },
        cancelToken: source.token,
        onUploadProgress: event => {
          armStallTimer()
          if (file.size > 0 && event.loaded) {
            this.uploadProgress = Math.min(99, Math.floor((event.loaded / file.size) * 100))
          }
        }
      }).then(
        response => {
          settleStallTimer()
          const resourceId = response.data && response.data.data && response.data.data.resource_id
          if (!resourceId) throw new Error('上传响应格式错误')
          const type = file.type || ''
          return {
            id: null,
            key: 'att-new-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            resourceId,
            name: displayName,
            size: this.formatSize(file.size),
            sizeBytes: file.size,
            isImage: /^image\//.test(type) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(displayName),
            inlineUrl: STORAGE_RESOURCE_URL + '/get/' + resourceId,
            url: STORAGE_RESOURCE_URL + '/download/' + resourceId
          }
        },
        error => {
          settleStallTimer()
          if (stalled) {
            const stallError = new Error('存储服务无响应')
            stallError.__stall = true
            throw stallError
          }
          throw error
        }
      )
    },
    uploadErrorMessage(error, file) {
      const name = (file && file.name) || '剪贴板文件'
      if (error && error.__stall) {
        return `「${name}」上传超时：存储服务长时间无响应，请检查网络或代理设置`
      }
      if (error && !error.response) {
        return `「${name}」上传失败：无法连接存储服务，请检查网络或代理设置`
      }
      return this.errorMessage(error, `「${name}」上传失败，请重试`)
    },
    async addProjectDoc(record, projectId) {
      await this.axios.post(
        `${this.$baseUrl}/manage/todo-board/projects/${projectId}/attachments`,
        {
          resource_id: record.resourceId,
          name: record.name,
          size: record.sizeBytes,
          is_image: record.isImage
        }
      )
    },
    displayNameFor(file, fromClipboard) {
      const rawName = file.name || ''
      if (fromClipboard && (!rawName || /^image\.(png|jpe?g|gif|webp|bmp)$/i.test(rawName))) {
        const type = file.type || 'image/png'
        const ext = (type.split('/')[1] || 'png').replace('jpeg', 'jpg').split('+')[0]
        const d = new Date()
        const pad = n => String(n).padStart(2, '0')
        return `粘贴图片-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.${ext}`
      }
      return rawName || '未命名附件'
    },
    formatSize(size) {
      if (!size) return '0 KB'
      const kb = size / 1024
      if (kb < 1024) return Math.max(1, Math.round(kb)) + ' KB'
      return (kb / 1024).toFixed(1) + ' MB'
    },
    deleteDoc(index) {
      const doc = (this.projDocs[this.projFilter] || [])[index]
      if (!doc || !doc.id) return
      this.$confirm(`确认删除文档「${doc.name}」？`, '提示', { type: 'warning' }).then(async () => {
        try {
          await this.axios.delete(
            `${this.$baseUrl}/manage/todo-board/attachments/${doc.id}`
          )
          await this.loadBoard()
          this.$message.success('文档已删除')
        } catch (error) {
          this.$message.error(this.errorMessage(error, '文档删除失败'))
        }
      }).catch(() => {})
    },
    openMembers() {
      this.memberDialogVisible = true
      if (!this.members.length && !this.boardLoading) this.loadBoard()
    },
    goUserManage() {
      this.memberDialogVisible = false
      this.$router.push('/UserManage')
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-board-page {
  min-height: 100%;
  padding: 20px 24px 36px;
  background: #f7f3f0;
}

::v-deep .el-button .pixel-icon {
  margin-right: 6px;
}

::v-deep .el-button--primary {
  background: #6d4c41;
  border-color: #6d4c41;

  &:hover,
  &:focus {
    background: #7d5a4c;
    border-color: #7d5a4c;
  }

  &.is-disabled,
  &.is-disabled:hover {
    background: #c9b4a8;
    border-color: #c9b4a8;
  }
}

::v-deep .el-dialog {
  border-radius: 14px;
  overflow: hidden;

  .el-dialog__header {
    padding: 18px 22px 12px;
    border-bottom: 1px dashed #f0e6df;
  }

  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: #3e2c23;
  }

  .el-dialog__body {
    padding: 18px 22px;
  }

  .el-dialog__footer {
    padding: 12px 22px 18px;
    border-top: 1px dashed #f0e6df;
  }
}

::v-deep .el-input__inner:focus,
::v-deep .el-textarea__inner:focus {
  border-color: #a1887f;
}

::v-deep .el-date-editor.el-input,
::v-deep .el-select {
  width: 100%;
}

.stat-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  background: #fff;
  border: 1px solid #ecdfd7;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(62, 44, 35, 0.05);
  overflow: hidden;
}

.stat-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  min-width: 0;

  & + & {
    border-left: 1px solid #f0e6df;
  }
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.tone-todo {
    background: #efe4dd;
    color: #795548;
  }

  &.tone-doing {
    background: #fdf0e2;
    color: #c07a2c;
  }

  &.tone-done {
    background: #eaf1e4;
    color: #5f7d47;
  }

  &.tone-alert {
    background: #fbe9e7;
    color: #b4493a;
  }
}

.stat-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  color: #9b8478;
  letter-spacing: 0.03em;
}

.stat-value {
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
  color: #3e2c23;

  &.danger {
    color: #b4493a;
  }
}

.control-bar {
  margin-top: 14px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #ecdfd7;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(62, 44, 35, 0.04);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
}

.filter-block {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

.filter-label {
  font-size: 12px;
  color: #9b8478;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 180px;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #f6efeb;
  color: #6b4f43;
  font: inherit;
  font-size: 12px;
  line-height: 1.4;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #efe3dc;
  }

  &.active {
    background: #6d4c41;
    color: #fff;
  }

  &.chip-retry {
    color: #b4493a;
    background: #fbe9e7;
  }
}

.chip-loading {
  font-size: 12px;
  color: #b09b8e;
}

.chip-avatar {
  flex-shrink: 0;

  ::v-deep img {
    display: block;
  }
}

.chip-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.proj-dot {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  flex-shrink: 0;
}

.chip.active .proj-dot {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
}

.control-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ghost-btn {
  color: #6d4c41;
  border-color: #d9c6ba;
  background: #fffdfb;

  &:hover,
  &:focus {
    color: #4a352b;
    border-color: #a1887f;
    background: #f7efea;
  }
}

.project-panel {
  margin-top: 14px;
  padding: 18px 20px;
  background: #fffdfb;
  border: 1px solid #ecdfd7;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(62, 44, 35, 0.04);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #4a352b;

  .pixel-icon {
    color: #8d6e63;
  }
}

.panel-sub {
  font-size: 11px;
  font-weight: 400;
  color: #b09b8e;
  padding: 1px 7px;
  border-radius: 6px;
  background: #f3ebe6;
}

.panel-close {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #b09b8e;
  cursor: pointer;

  &:hover {
    background: #f1e7e1;
    color: #6d4c41;
  }
}

.panel-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 28px;
}

.panel-col {
  min-width: 0;

  h4 {
    margin: 0 0 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #9b8478;
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.panel-count {
  font-size: 11px;
  font-weight: 400;
  padding: 0 6px;
  border-radius: 5px;
  background: #f1e7e1;
  color: #8d6e63;
}

.empty-line {
  font-size: 12px;
  color: #b09b8e;
  padding: 10px 0;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px dashed #f2e9e3;

  &:last-child {
    border-bottom: 0;
  }
}

.comment-body {
  min-width: 0;
  flex: 1;
}

.comment-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.comment-who {
  font-size: 12.5px;
  font-weight: 600;
  color: #4a352b;
}

.comment-when {
  font-size: 11px;
  color: #bcaaa4;
}

.comment-text {
  margin-top: 3px;
  font-size: 12.5px;
  line-height: 1.6;
  color: #6b4f43;
  word-break: break-word;
}

.comment-input-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.doc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px dashed #f2e9e3;
}

.doc-thumb {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid #efe4dd;
}

.doc-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f4ece7;
  color: #8d6e63;
  flex-shrink: 0;
}

.doc-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.doc-name {
  font-size: 12.5px;
  color: #4a352b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.el-link {
    display: block;

    &:hover {
      color: #8d6e63;
    }
  }
}

.doc-meta {
  font-size: 11px;
  color: #b09b8e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-button {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #b09b8e;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #fbe9e7;
    color: #b4493a;
  }
}

.upload-zone {
  margin-top: 10px;
  padding: 12px;
  border: 1.5px dashed #dcc9bd;
  border-radius: 10px;
  background: #fdfaf8;
  color: #a58c7d;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;

  &:hover,
  &.dragging {
    border-color: #8d6e63;
    background: #f7efea;
    color: #6d4c41;
  }

  .zone-main {
    font-size: 12px;
    margin-top: 4px;
  }

  .zone-hint {
    font-size: 11px;
    margin-top: 2px;
    color: #bcaaa4;
  }
}

.project-zone {
  padding: 14px;
}

.task-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;

  .zone-main {
    margin-top: 0;
  }
}

.hidden-input {
  display: none;
}

.upload-status {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #8d6e63;
}

.upload-spinner {
  width: 10px;
  height: 10px;
  border: 2px solid #e3d3c9;
  border-top-color: #8d6e63;
  border-radius: 50%;
  animation: todo-spin 0.8s linear infinite;
}

@keyframes todo-spin {
  to {
    transform: rotate(360deg);
  }
}

.kanban {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
  align-items: start;
}

.column {
  position: relative;
  padding: 10px;
  min-height: 460px;
  border: 1px solid #ebded6;
  border-radius: 14px;
  background: #f3ece7;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--accent);
  }

  &.col-todo {
    --accent: #a1887f;
  }

  &.col-doing {
    --accent: #e0a35c;
  }

  &.col-done {
    --accent: #8aa46b;
  }

  &.drag-over {
    background: #ede2db;

    .cards {
      outline: 1.5px dashed #b89c8d;
      outline-offset: 3px;
    }
  }
}

.column-head {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 6px 12px;
}

.column-icon {
  display: flex;
  align-items: center;
  color: #6d4c41;
}

.column-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #4a352b;
}

.column-count {
  padding: 0 7px;
  border-radius: 6px;
  background: #e6d8ce;
  color: #6b4f43;
  font-size: 11px;
  line-height: 18px;
}

.column-add {
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #9b8478;
  cursor: pointer;

  &:hover {
    background: #e9ddd5;
    color: #4a352b;
  }
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 80px;
  border-radius: 10px;
  transition: background 0.15s;
}

.task-card {
  padding: 12px 13px;
  border: 1px solid #efe5df;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(62, 44, 35, 0.06);
  cursor: grab;
  transition: box-shadow 0.16s, transform 0.16s, border-color 0.16s;

  &:hover {
    border-color: #e3d3c9;
    box-shadow: 0 8px 20px rgba(62, 44, 35, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.proj-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.priority {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 1px;
    background: currentColor;
  }

  &.high {
    background: #fbeae7;
    color: #b4493a;
  }

  &.mid {
    background: #fbf0dd;
    color: #ad7420;
  }

  &.low {
    background: #eef3e6;
    color: #5f7d47;
  }
}

.card-title {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.5;
  color: #3e2c23;
  word-break: break-word;
}

.card-desc {
  margin-top: 5px;
  font-size: 12px;
  line-height: 1.6;
  color: #9b8478;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-foot {
  margin-top: 10px;
  padding-top: 9px;
  border-top: 1px dashed #f0e7e1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 12px;
  color: #6b4f43;
}

.assignee-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  font-size: 11px;
  color: #a58c7d;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
}

.due.overdue {
  color: #b4493a;
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 22px 10px;
  border: 1.5px dashed #dbcfc7;
  border-radius: 10px;
  color: #b09b8e;
  font-size: 12px;
  text-align: center;

  .pixel-icon {
    color: #c9b4a8;
  }
}

.field {
  margin-bottom: 14px;
}

.field-label {
  margin-bottom: 6px;
  font-size: 12px;
  color: #9b8478;
  letter-spacing: 0.03em;
}

.field-hint {
  margin-left: 8px;
  font-size: 11px;
  color: #bcaaa4;
  letter-spacing: 0;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border: 1px solid #efe5df;
  border-radius: 9px;
  background: #fffdfb;
}

.attachment-thumb {
  width: 34px;
  height: 34px;
  border-radius: 7px;
  flex-shrink: 0;
  border: 1px solid #efe4dd;
}

.attachment-file {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: #f4ece7;
  color: #8d6e63;
  flex-shrink: 0;
}

.attachment-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.attachment-name {
  font-size: 12.5px;
  color: #4a352b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.el-link {
    display: block;
    align-self: flex-start;
    max-width: 100%;

    &:hover {
      color: #8d6e63;
    }
  }
}

.attachment-size {
  font-size: 11px;
  color: #b09b8e;
}

.comments-block {
  margin-top: 4px;
  padding-top: 14px;
  border-top: 1px dashed #efe4dc;
}

.comment-scroll {
  max-height: 230px;
  overflow-y: auto;
  padding-right: 4px;
}

.member-intro {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  margin-bottom: 12px;
  border: 1px solid #efe4dc;
  border-radius: 9px;
  background: #fdfaf8;
  font-size: 12px;
  line-height: 1.7;
  color: #8d6e63;

  .pixel-icon {
    margin-top: 2px;
    flex-shrink: 0;
  }
}

.text-link {
  color: #6d4c41;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.member-loading {
  padding: 18px 0;
  text-align: center;
  font-size: 12px;
  color: #b09b8e;
}

.member-list {
  max-height: 420px;
  overflow-y: auto;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 2px;
  border-bottom: 1px dashed #f2e9e3;

  &:last-child {
    border-bottom: 0;
  }
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #4a352b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-me {
  padding: 0 5px;
  border-radius: 5px;
  background: #efe4dd;
  color: #795548;
  font-size: 10px;
  font-weight: 400;
  line-height: 16px;
}

.member-account {
  font-size: 11px;
  color: #b09b8e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-badge {
  flex-shrink: 0;
  padding: 1px 7px;
  border-radius: 6px;
  font-size: 10.5px;

  &.admin {
    background: #efe4dd;
    color: #795548;
  }

  &.inactive {
    background: #fbe9e7;
    color: #b4493a;
  }
}

.member-tasks {
  flex-shrink: 0;
  font-size: 11px;
  color: #a58c7d;
  min-width: 52px;
  text-align: right;
}

.danger-link {
  color: #b4493a;
}

@media (max-width: 1180px) {
  .stat-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-cell:nth-child(3) {
    border-left: 0;
  }

  .stat-cell:nth-child(n + 3) {
    border-top: 1px solid #f0e6df;
  }
}

@media (max-width: 980px) {
  .kanban {
    grid-template-columns: 1fr;
  }

  .column {
    min-height: 260px;
  }

  .panel-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .control-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .todo-board-page {
    padding: 14px 12px 28px;
  }

  .stat-cell {
    padding: 12px 14px;
  }

  .control-bar {
    padding: 12px;
  }
}
</style>
