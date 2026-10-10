<template>
  <writer-panel
    class="writer-tools"
    :title="labels[tab]"
    :subtitle="descriptions[tab]"
    :loading="loading"
    :error="error"
    :busy="busy"
    :refreshable="tab !== 'appearance'"
    @refresh="refresh"
    @close="$emit('close')"
  >
    <template v-if="tab === 'history' || tab === 'backups'">
      <button
        v-if="tab === 'backups' && article"
        class="secondary full-width"
        @click="$emit('export')"
      >
        <i aria-hidden="true" class="el-icon-download" /> 导出当前稿件
      </button>
      <writer-empty-state
        v-if="!article"
        icon="el-icon-document"
        title="先选择一个章节"
        description="选择章节后，即可查看它的历史版本与本机备份。"
      />
      <writer-empty-state
        v-else-if="!rows.length"
        icon="el-icon-time"
        :title="'暂无' + labels[tab]"
        description="开始创作并保存后，版本记录会出现在这里。"
      />
      <div v-else class="tool-list">
        <div class="tool-section-heading">
          <span>版本记录</span><small>{{ rows.length }} 个版本</small>
        </div>
        <article
          v-for="(item, index) in rows"
          :key="item.id || index"
          class="tool-card"
        >
          <strong>{{ item.title || "未命名章节" }}</strong>
          <small class="tool-meta"
            ><i aria-hidden="true" class="el-icon-time" />{{
              formatTime(item.updatedAt || item.updated_at || item.create_time)
            }}</small
          >
          <small class="tool-meta">{{ item.editor_name || "本机备份" }}</small>
          <div class="tool-actions">
            <button class="secondary" @click="preview(item)">查看版本</button
            ><button
              :disabled="!canEdit || busy"
              @click="$emit('restore', item)"
            >
              恢复</button
            ><button @click="exportVersion(item)">导出</button>
          </div>
        </article>
      </div>
    </template>
    <template v-if="tab === 'trash'">
      <writer-empty-state
        v-if="!rows.length"
        icon="el-icon-delete"
        title="回收站为空"
        description="移入回收站的章节可以在这里恢复。永久删除前请先确认备份。"
      />
      <div v-else class="tool-list">
        <article v-for="item in rows" :key="item.article_id" class="tool-card">
          <strong>{{ item.title }}</strong
          ><small>章节已移入回收站</small>
          <div class="tool-actions">
            <button
              class="secondary"
              :disabled="!access.can_delete_article || busy"
              @click="mutate('restore_deleted', { id: item.article_id })"
            >
              恢复</button
            ><button
              class="danger"
              :disabled="!access.can_delete_article || busy"
              @click="removeForever(item)"
            >
              永久删除
            </button>
          </div>
        </article>
      </div>
    </template>
    <template v-if="tab === 'schedule'">
      <writer-empty-state
        v-if="!rows.length"
        icon="el-icon-alarm-clock"
        title="没有待发布任务"
        description="在章节的发布窗口选择定时发布，即可安排下一次更新。"
      />
      <div v-else class="tool-list">
        <article v-for="item in rows" :key="item.task_id" class="tool-card">
          <div class="tool-card-heading">
            <strong>{{ item.article_title }}</strong
            ><span class="tool-badge warning">待发布</span>
          </div>
          <small class="tool-meta"
            ><i aria-hidden="true" class="el-icon-time" />{{
              formatTime(item.publish_time)
            }}
            · 北京时间</small
          ><button
            class="secondary"
            :disabled="!access.can_publish_article || busy"
            @click="cancelSchedule(item)"
          >
            取消定时发布
          </button>
        </article>
      </div>
    </template>
    <template v-if="tab === 'feedback'">
      <writer-empty-state
        v-if="!article"
        icon="el-icon-chat-line-square"
        title="选择章节查看反馈"
        description="读者提交的纠错建议会按章节显示在这里。"
      />
      <writer-empty-state
        v-else-if="!rows.length"
        icon="el-icon-chat-line-square"
        title="当前章节暂无纠错反馈"
        description="收到读者建议后，可以在这里查看原文并标记处理状态。"
      />
      <div v-else class="tool-list">
        <article v-for="item in rows" :key="item.feedback_id" class="tool-card">
          <div class="tool-card-heading">
            <strong>{{ item.username || "读者反馈" }}</strong
            ><span
              class="tool-badge"
              :class="Number(item.status) === 0 ? 'warning' : 'success'"
              >{{ Number(item.status) === 0 ? "待处理" : "已处理" }}</span
            >
          </div>
          <p>{{ item.content || item.feedback_content || item.description }}</p>
          <blockquote
            v-if="item.paragraph_text || item.original_text"
            class="feedback-quote"
          >
            {{ item.paragraph_text || item.original_text }}
          </blockquote>
          <button
            class="secondary"
            :disabled="!canEdit || busy"
            @click="
              mutate('update_feedback_status', {
                feedback_id: item.feedback_id,
                status: Number(item.status) === 0 ? 1 : 0,
              })
            "
          >
            {{ Number(item.status) === 0 ? "标记已处理" : "重新打开" }}
          </button>
        </article>
      </div>
    </template>
    <template v-if="tab === 'indexing'">
      <div class="index-overview">
        <div class="tool-section-heading">
          <strong>读者稿索引</strong
          ><small
            >{{ indexedCount }} / {{ indexablePublished.length }} 章</small
          >
        </div>
        <progress
          v-if="indexablePublished.length"
          :value="indexedCount"
          :max="indexablePublished.length"
          aria-label="读者稿索引进度"
        />
        <p class="tool-note">索引使写作助手能够检索作品的最新内容。</p>
        <div class="tool-task-state" role="status">
          <i
            aria-hidden="true"
            :class="
              data.status === 'indexing' ? 'el-icon-loading' : 'el-icon-info'
            "
          />
          <div>
            <strong>{{ indexStatusLabel }}</strong
            ><small v-if="indexStatusDetail">{{ indexStatusDetail }}</small>
          </div>
        </div>
        <button
          class="primary full-width"
          :disabled="busy"
          @click="
            mutate('request_novel_indexing', { novel_id: novel.novel_id })
          "
        >
          {{ busy ? "正在提交…" : "更新作品索引" }}
        </button>
      </div>
      <writer-empty-state
        v-if="!indexableRows.length"
        icon="el-icon-connection"
        title="还没有可索引的文字章节"
        description="创建并保存文字章节后，在这里检查索引状态。"
      />
      <div v-else class="tool-list">
        <div class="tool-section-heading">
          <span>章节状态</span><small>{{ indexableRows.length }} 章</small>
        </div>
        <article
          v-for="item in indexableRows"
          :key="item.article_id"
          class="tool-card"
        >
          <strong>{{ item.title }}</strong>
          <div class="index-status-row">
            <span>读者稿</span
            ><span
              class="tool-badge"
              :class="
                Number(item.is_draft) === 1
                  ? ''
                  : Number(item.index_is_current) === 1
                  ? 'success'
                  : 'warning'
              "
              >{{
                Number(item.is_draft) === 1
                  ? "未发布"
                  : Number(item.index_is_current) === 1
                  ? "已同步"
                  : "待更新"
              }}</span
            >
          </div>
          <div class="index-status-row">
            <span>写作稿</span
            ><span
              class="tool-badge"
              :class="
                Number(item.writer_index_is_current) === 1
                  ? 'success'
                  : 'warning'
              "
              >{{
                Number(item.writer_index_is_current) === 1 ? "已同步" : "待更新"
              }}</span
            >
          </div>
        </article>
      </div>
    </template>
    <template v-if="tab === 'statistics'">
      <writer-empty-state
        v-if="!rows.length"
        icon="el-icon-data-analysis"
        title="暂无阅读统计"
        description="作品产生阅读活动后，这里会显示阅读、收藏和互动数据。"
      />
      <template v-else
        ><div class="tool-metrics">
          <span v-for="metric in metrics" :key="metric.key"
            ><strong>{{ formatNumber(latest[metric.key]) }}</strong
            >{{ metric.label }}</span
          >
        </div>
        <div class="tool-section-heading">
          <span>统计明细</span><small>可横向滚动</small>
        </div>
        <div class="tool-table-scroll" tabindex="0" aria-label="阅读统计明细">
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th v-for="metric in metrics" :key="metric.key">
                  {{ metric.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in rows" :key="index">
                <td>
                  {{
                    item.date ||
                    item.statistic_date ||
                    item.stat_date ||
                    item.record_date ||
                    index + 1
                  }}
                </td>
                <td v-for="metric in metrics" :key="metric.key">
                  {{ formatNumber(item[metric.key]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div></template
      >
    </template>
    <template v-if="tab === 'calendar'">
      <div class="tool-metrics">
        <span
          ><strong>{{
            formatNumber(data.summary && data.summary.active_days)
          }}</strong
          >活跃天数</span
        ><span
          ><strong>{{
            formatNumber(data.summary && data.summary.current_streak)
          }}</strong
          >连续天数</span
        ><span
          ><strong>{{
            formatNumber(data.summary && data.summary.total_written_chars)
          }}</strong
          >新增字数</span
        >
      </div>
      <div class="tool-section-heading">
        <span>写作活动</span><small>北京时间</small>
      </div>
      <p class="tool-note calendar-range" v-if="data.from">
        {{ data.from }} — {{ data.to }}
      </p>
      <writer-empty-state
        v-if="!calendarDays.length"
        icon="el-icon-date"
        title="尚无写作活动"
        description="开始输入正文后，写作活动会自动记录在这里。"
      />
      <template v-else
        ><div class="writing-calendar" tabindex="0" aria-label="写作活动日历">
          <span
            v-for="day in calendarDays"
            :key="day.date"
            :class="'level-' + day.level"
            tabindex="0"
            :aria-label="calendarLabel(day)"
            :title="calendarLabel(day)"
            @focus="calendarDay = day"
            @mouseenter="calendarDay = day"
          />
        </div>
        <div class="calendar-legend">
          <small>少</small
          ><span
            v-for="level in 5"
            :key="level"
            :class="'level-' + (level - 1)"
          /><small>多</small>
        </div>
        <p class="calendar-detail">
          {{
            calendarDay
              ? calendarLabel(calendarDay)
              : "悬停或聚焦日期，查看当天的写作活动。"
          }}
        </p></template
      >
    </template>
    <template v-if="tab === 'collaborators'">
      <div class="owner-row">
        <span class="collaborator-avatar"
          ><i aria-hidden="true" class="el-icon-user"
        /></span>
        <div>
          <strong>{{
            (data.novel && data.novel.owner_name) || "作品作者"
          }}</strong
          ><small>主作者</small>
        </div>
      </div>
      <form
        v-if="access.can_manage_collaborators"
        class="tool-form tool-section"
        @submit.prevent="invite"
      >
        <h3>邀请作者</h3>
        <label
          >协作者用户 ID<input
            v-model="inviteUser"
            type="number"
            min="1"
            required
            placeholder="输入对方的用户 ID"
            :disabled="busy" /></label
        ><button class="secondary full-width" :disabled="busy || !inviteUser">
          {{ busy ? "正在发送…" : "发送邀请" }}
        </button>
      </form>
      <writer-empty-state
        v-if="!(data.collaborators || []).length"
        icon="el-icon-user"
        title="还没有协作者"
        description="邀请其他作者，共同编辑作品并按需分配权限。"
      />
      <div v-else class="tool-list">
        <div class="tool-section-heading">
          <span>协作者</span><small>{{ data.collaborators.length }} 人</small>
        </div>
        <article
          v-for="item in data.collaborators || []"
          :key="item.user_id"
          class="tool-card"
        >
          <div class="tool-card-heading">
            <strong>{{
              item.name || item.user_name || "作者 " + item.user_id
            }}</strong
            ><span
              class="tool-badge"
              :class="item.status === 'pending' ? 'warning' : ''"
              >{{ collaboratorStatus(item.status) }}</span
            >
          </div>
          <details
            v-if="access.can_manage_collaborators"
            class="permission-details"
          >
            <summary>编辑权限</summary>
            <div class="permission-list">
              <label v-for="permission in permissions" :key="permission.key"
                ><input
                  type="checkbox"
                  :checked="Boolean(Number(item[permission.key]))"
                  :disabled="busy"
                  @change="
                    setPermission(item, permission.key, $event.target.checked)
                  "
                />{{ permission.label }}</label
              >
            </div>
            <button
              class="danger"
              :disabled="busy"
              @click="removeCollaborator(item)"
            >
              移除协作者
            </button>
          </details>
          <div
            v-if="item.user_id === identity.id && item.status === 'pending'"
            class="tool-actions"
          >
            <button
              class="secondary"
              :disabled="busy"
              @click="
                mutate('accept_novel_collaborator_invite', {
                  novel_id: novel.novel_id,
                })
              "
            >
              接受邀请</button
            ><button
              :disabled="busy"
              @click="
                mutate('reject_novel_collaborator_invite', {
                  novel_id: novel.novel_id,
                })
              "
            >
              拒绝
            </button>
          </div>
        </article>
      </div>
      <button
        v-if="access.is_collaborator"
        class="danger"
        :disabled="busy"
        @click="quitCollaboration"
      >
        退出协作
      </button>
    </template>
    <template v-if="tab === 'settings'">
      <form class="tool-form tool-section" @submit.prevent="saveSettings">
        <h3>作品资料</h3>
        <label
          >作品名<input
            v-model="settings.name"
            :disabled="!access.is_owner || busy"
            required
            maxlength="60" /></label
        ><label
          >简介<textarea
            v-model="settings.content"
            :disabled="!access.is_owner || busy"
            rows="5"
          /></label
        ><button
          class="primary full-width"
          :disabled="!access.is_owner || busy || !settingsDirty"
        >
          {{ busy ? "正在保存…" : "保存资料" }}
        </button>
      </form>
      <section class="tool-section">
        <h3>访问与状态</h3>
        <label class="setting-row"
          ><span
            ><strong>作品公开</strong
            ><small>允许读者访问已发布章节</small></span
          ><input
            class="writer-switch"
            type="checkbox"
            :disabled="!access.is_owner || busy || settingPending"
            :checked="settingChecked('is_personal')"
            @change="setStatus('is_personal', $event)" /></label
        ><label class="setting-row"
          ><span
            ><strong>已经完结</strong><small>在作品页显示完结状态</small></span
          ><input
            class="writer-switch"
            type="checkbox"
            :disabled="!access.is_owner || busy || settingPending"
            :checked="settingChecked('is_complete')"
            @change="setStatus('is_complete', $event)" /></label
        ><label class="setting-row"
          ><span
            ><strong>读者 AI 助手</strong
            ><small>读者可围绕作品提问</small></span
          ><input
            class="writer-switch"
            type="checkbox"
            :disabled="!access.is_owner || busy || settingPending"
            :checked="settingChecked('disable_reader_ai')"
            @change="setStatus('disable_reader_ai', $event)"
        /></label>
      </section>
      <section class="tool-section">
        <h3>封面与标签</h3>
        <label
          class="cover-picker"
          :class="{ disabled: !access.is_owner || busy }"
          ><span>作品封面</span
          ><span class="cover-upload"
            ><i
              aria-hidden="true"
              class="el-icon-upload2"
            />选择图片更换封面</span
          ><input
            type="file"
            aria-label="更换作品封面"
            accept="image/*"
            :disabled="!access.is_owner || busy"
            @change="changeCover"
          /><small>选择图片后上传并更新封面</small></label
        >
        <div v-if="tags.length" class="tag-list">
          <span v-for="tag in tags" :key="tag.tag_id"
            >{{ tag.tag_name || tag.name
            }}<button
              v-if="access.is_owner"
              :disabled="busy"
              :aria-label="'删除标签 ' + (tag.tag_name || tag.name)"
              @click="deleteTag(tag)"
            >
              ×
            </button></span
          >
        </div>
        <form
          v-if="access.is_owner"
          class="tool-actions tag-form"
          @submit.prevent="addTag"
        >
          <input
            v-model="tagName"
            aria-label="新标签"
            placeholder="添加标签"
            maxlength="30"
            required
            :disabled="busy"
          /><button class="secondary" :disabled="busy || !tagName.trim()">
            添加
          </button>
        </form>
      </section>
      <section class="tool-section">
        <h3>备份与管理</h3>
        <button
          class="secondary full-width"
          :disabled="busy"
          @click="exportWork"
        >
          <i aria-hidden="true" class="el-icon-download" /> 导出整部作品
        </button>
        <p class="tool-note">包含作品资料、章节正文与写作稿。</p>
        <button
          v-if="access.is_owner"
          class="danger"
          :disabled="busy"
          @click="deleteWork"
        >
          删除作品
        </button>
      </section>
    </template>
    <template v-if="tab === 'appearance'">
      <section class="tool-section">
        <h3>阅读外观</h3>
        <label
          >主题<select
            :value="preferences.theme"
            @change="preference('theme', $event.target.value)"
          >
            <option value="light">浅色</option>
            <option value="sepia">纸张</option>
            <option value="dark">深色</option>
          </select></label
        ><label
          >字体<select
            :value="preferences.fontKey || preferences.fontFamily"
            @change="fontPreference($event.target.value)"
          >
            <option value="serif">宋体 / 衬线</option>
            <option value="sans-serif">系统无衬线</option>
            <option value="monospace">等宽</option>
            <option
              v-for="(font, key) in fonts"
              v-if="key !== 'default'"
              :key="key"
              :value="key"
            >
              {{ font.name }}（下载字体）
            </option>
          </select></label
        ><label
          >背景皮肤<select
            :value="preferences.backgroundSkinKey || ''"
            @change="preference('backgroundSkinKey', $event.target.value)"
          >
            <option value="">纯色背景</option>
            <option
              v-for="skin in skins"
              :key="skin.skin_key"
              :value="skin.skin_key"
              :disabled="skin.is_locked"
            >
              {{ skin.skin_name }}{{ skin.is_locked ? " · 需要通行证" : "" }}
            </option>
          </select></label
        >
      </section>
      <section class="tool-section">
        <h3>正文排版</h3>
        <label class="range-field"
          ><span
            >字号<output
              >{{ preferences.fontSize }}<small> px</small></output
            ></span
          ><input
            type="range"
            min="14"
            max="28"
            :value="preferences.fontSize"
            @input="
              preference('fontSize', Number($event.target.value))
            " /></label
        ><label class="range-field"
          ><span
            >行距<output
              >{{ preferences.lineHeight }}<small> 倍</small></output
            ></span
          ><input
            type="range"
            min="1.4"
            max="2.8"
            step="0.1"
            :value="preferences.lineHeight"
            @input="
              preference('lineHeight', Number($event.target.value))
            " /></label
        ><label class="range-field"
          ><span
            >正文宽度<output
              >{{ preferences.paperWidth }}<small> px</small></output
            ></span
          ><input
            type="range"
            min="600"
            max="1200"
            step="20"
            :value="preferences.paperWidth"
            @input="preference('paperWidth', Number($event.target.value))"
        /></label>
      </section>
      <section class="tool-section">
        <h3>快捷输入</h3>
        <label
          >常用符号<input
            :value="preferences.quickInputs"
            aria-label="自定义快捷输入"
            @change="
              preference('quickInputs', $event.target.value.slice(0, 200))
            "
        /></label>
        <p class="tool-note">用 | 分隔。成对引号与括号可包裹选中文字。</p>
        <div class="shortcut-list">
          <span>保存<kbd>⌘ / Ctrl S</kbd></span
          ><span>查找<kbd>⌘ / Ctrl F</kbd></span
          ><span>退出专注<kbd>Esc</kbd></span>
        </div>
      </section>
    </template>
    <el-dialog
      class="writer-dialog-wrapper"
      title="历史版本内容"
      :visible.sync="previewOpen"
      :custom-class="writerDialogClass"
      append-to-body
      width="760px"
      ><writer-version-preview :article="previewArticle" label="历史版本" />
    </el-dialog>
  </writer-panel>
</template>
<script>
import WriterPanel from "./WriterPanel.vue";
import WriterVersionPreview from "./WriterVersionPreview.vue";
import WriterEmptyState from "./WriterEmptyState.vue";
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import {
  writerGet,
  writerPost,
  writerRequest,
  writerIdentity,
  downloadWriterFile,
} from "~/utils/writer/api";
import { listWriterBackups } from "~/utils/writer/drafts";
export default {
  mixins: [writerDialogTheme],
  components: { WriterPanel, WriterEmptyState, WriterVersionPreview },
  props: {
    tab: String,
    novel: Object,
    article: Object,
    access: Object,
    preferences: Object,
    fonts: { type: Object, default: () => ({}) },
    skins: { type: Array, default: () => [] },
    canEdit: Boolean,
  },
  data: () => ({
    loadVersion: 0,
    loading: false,
    busy: false,
    settingPending: false,
    error: "",
    data: {},
    rows: [],
    indexRows: [],
    tags: [],
    tagName: "",
    inviteUser: "",
    settings: {},
    calendarDay: null,
    settingsInitialized: false,
    descriptions: {
      history: "记录每次保存，让修改可以回溯",
      backups: "保存在当前浏览器中的版本",
      trash: "恢复移除的章节，管理旧稿",
      schedule: "安排作品更新的时间",
      feedback: "查看并处理当前章节的读者建议",
      indexing: "同步作品内容，供助手检索",
      statistics: "了解作品的阅读与互动",
      calendar: "记录你的创作节奏",
      collaborators: "邀请作者并分配编辑权限",
      settings: "管理作品资料、访问与标签",
      appearance: "调整适合自己的写作环境",
    },
    previewOpen: false,
    previewItem: {},
    identity: writerIdentity(),
    labels: {
      history: "云端时间机器",
      backups: "本机备份",
      trash: "回收站",
      schedule: "定时发布",
      feedback: "读者纠错",
      indexing: "作品索引",
      statistics: "阅读统计",
      calendar: "写作日历",
      collaborators: "协作者",
      settings: "作品设置",
      appearance: "写作偏好",
    },
    metrics: [
      { key: "clicks", label: "阅读" },
      { key: "nices", label: "点赞" },
      { key: "likes", label: "收藏" },
      { key: "comments", label: "评论" },
      { key: "shares", label: "分享" },
      { key: "tippings", label: "打赏" },
    ],
    permissions: [
      { key: "can_edit_article", label: "编辑" },
      { key: "can_add_article", label: "新增" },
      { key: "can_delete_article", label: "删除" },
      { key: "can_sort_article", label: "排序" },
      { key: "can_publish_article", label: "发布" },
    ],
  }),
  computed: {
    latest() {
      return this.rows[this.rows.length - 1] || {};
    },
    previewArticle() {
      return {
        ...this.previewItem,
        article_type:
          this.previewItem.article_type ||
          (this.article && this.article.article_type),
      };
    },
    settingsDirty() {
      return (
        this.tab === "settings" &&
        (this.settings.name !== this.novel.name ||
          this.settings.content !== this.novel.content)
      );
    },
    indexableRows() {
      return this.indexRows.filter((item) =>
        ["text", "richtext"].includes(item.article_type)
      );
    },
    indexablePublished() {
      return this.indexableRows.filter((item) => Number(item.is_draft) !== 1);
    },
    indexedCount() {
      return this.indexablePublished.filter(
        (item) => Number(item.index_is_current) === 1
      ).length;
    },
    indexStatusLabel() {
      return (
        {
          queued: "排队中",
          pending: "排队中",
          indexing: "正在索引",
          completed: "索引已完成",
          failed: "索引未完成",
        }[this.data.status] || "暂无进行中的任务"
      );
    },
    indexStatusDetail() {
      const queue = this.data.queue || {};
      if (queue.current_article_title)
        return "当前章节：" + queue.current_article_title;
      if (Number(queue.total_chapters) > 0)
        return `本轮已处理 ${queue.completed_chapters || 0} / ${
          queue.total_chapters
        } 章`;
      if (Number(queue.pending_chapters) > 0)
        return `待处理 ${queue.pending_chapters} 章`;
      return "";
    },
    calendarDays() {
      if (!this.data.from || !this.data.to) return [];
      const days = new Map(
          (this.data.days || []).map((day) => [day.date, day])
        ),
        result = [];
      for (
        let date = new Date(this.data.from + "T00:00:00Z");
        date <= new Date(this.data.to + "T00:00:00Z");
        date.setUTCDate(date.getUTCDate() + 1)
      ) {
        const key = date.toISOString().slice(0, 10);
        result.push(
          days.get(key) || {
            date: key,
            level: 0,
            written_chars: 0,
            active_seconds: 0,
          }
        );
      }
      return result;
    },
  },
  watch: {
    tab: {
      immediate: true,
      handler() {
        this.load();
      },
    },
    novel(value, previous) {
      if (
        this.tab === "settings" &&
        previous &&
        this.settings.name === previous.name &&
        this.settings.content === previous.content
      ) {
        this.settings = { name: value.name, content: value.content };
      }
    },
    "article.article_id"() {
      this.load();
    },
  },
  beforeDestroy() {
    this.loadVersion++;
  },
  methods: {
    async refresh() {
      if (this.settingsDirty) {
        try {
          await this.writerConfirm(
            "重新加载会放弃尚未保存的作品资料，继续？",
            "重新加载资料"
          );
        } catch (_) {
          return;
        }
      }
      return this.load({ discardSettings: true });
    },
    formatNumber(value) {
      return Number(value || 0).toLocaleString("zh-CN");
    },
    calendarLabel(day) {
      return `${day.date} · ${day.written_chars || 0} 字 · ${Math.floor(
        (day.active_seconds || 0) / 60
      )} 分钟`;
    },
    collaboratorStatus(status) {
      return (
        {
          pending: "待接受",
          accepted: "协作中",
          active: "协作中",
          rejected: "已拒绝",
        }[status] || status
      );
    },
    async load({ discardSettings = false } = {}) {
      const version = ++this.loadVersion,
        tab = this.tab,
        articleId = this.article && this.article.article_id;
      this.loading = true;
      this.error = "";
      this.rows = [];
      this.data = {};
      this.indexRows = [];
      this.calendarDay = null;
      try {
        let data = {},
          indexRows = [],
          tags = [];
        if (tab === "history" && articleId)
          data = await writerGet("get_article_history", { id: articleId });
        if (tab === "backups" && articleId)
          data = await listWriterBackups(this.identity.id, articleId);
        if (tab === "trash")
          data = await writerGet("get_articles_deleted", {
            id: this.novel.novel_id,
          });
        if (tab === "schedule")
          data = (await writerGet("get_scheduled_tasks")).filter(
            (item) => Number(item.novel_id) === Number(this.novel.novel_id)
          );
        if (tab === "feedback" && articleId)
          data = await writerGet("get_article_feedbacks", { id: articleId });
        if (tab === "statistics")
          data = await writerRequest(
            `/articles/get_novel_specific_statistics?novel_id=${this.novel.novel_id}`
          );
        if (tab === "calendar")
          data = await writerGet("get_novel_writing_calendar", {
            novel_id: this.novel.novel_id,
          });
        if (tab === "collaborators")
          data = await writerGet("get_novel_collaboration_info", {
            novel_id: this.novel.novel_id,
          });
        if (tab === "indexing") {
          data = await writerGet("get_novel_indexing_status", {
            novel_id: this.novel.novel_id,
          });
          indexRows = await writerGet("get_articles", {
            id: this.novel.novel_id,
          });
        }
        if (tab === "settings") {
          tags = await writerRequest(
            `/library/get_novel_tags?novel_id=${this.novel.novel_id}`
          );
        }
        if (
          version !== this.loadVersion ||
          this.tab !== tab ||
          (this.article && this.article.article_id) !== articleId
        )
          return;
        this.indexRows = indexRows;
        if (tab === "settings") {
          if (
            discardSettings ||
            !this.settingsInitialized ||
            !this.settingsDirty
          ) {
            this.settings = {
              name: this.novel.name,
              content: this.novel.content,
            };
            this.settingsInitialized = true;
          }
          this.tags = tags;
        }
        if (Array.isArray(data)) this.rows = data;
        else this.data = data || {};
      } catch (error) {
        if (version === this.loadVersion) this.error = error.message;
      } finally {
        if (version === this.loadVersion) this.loading = false;
      }
    },
    formatTime(value) {
      if (/^\d{14}$/.test(String(value))) {
        const s = String(value);
        return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)} ${s.slice(
          8,
          10
        )}:${s.slice(10, 12)}`;
      }
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? String(value || "")
        : date.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    },
    async mutate(name, body) {
      if (this.busy) return;
      this.busy = true;
      try {
        await writerPost(name, body);
        this.writerMessage("success", "操作成功");
        await this.load();
        this.$emit("refresh");
      } catch (error) {
        this.writerMessage("error", error.message);
      } finally {
        this.busy = false;
      }
    },
    preview(item) {
      this.previewItem = item;
      this.previewOpen = true;
    },
    exportVersion(item) {
      downloadWriterFile(
        `${item.title || "章节"}-备份.json`,
        JSON.stringify(item, null, 2)
      );
    },
    async removeForever(item) {
      try {
        await this.writerConfirm(
          `永久删除“${item.title}”？此操作无法撤销。`,
          "永久删除",
          { type: "warning" }
        );
        await this.mutate("delete_forever", { id: item.article_id });
      } catch (_) {}
    },
    async cancelSchedule(item) {
      try {
        await this.writerConfirm(
          `取消“${item.article_title}”的定时发布？`,
          "取消任务"
        );
        await this.mutate("cancel_scheduled_task", { task_id: item.task_id });
      } catch (_) {}
    },
    invite() {
      return this.mutate("invite_novel_collaborator", {
        novel_id: this.novel.novel_id,
        user_id: Number(this.inviteUser),
      });
    },
    setPermission(item, key, value) {
      const body = { novel_id: this.novel.novel_id, user_id: item.user_id };
      this.permissions.forEach((p) => {
        body[p.key] = p.key === key ? Number(value) : Number(item[p.key]);
      });
      return this.mutate("update_novel_collaborator_permissions", body);
    },
    async removeCollaborator(item) {
      try {
        await this.writerConfirm(
          `移除协作者 ${item.name || item.user_id}？`,
          "移除协作者"
        );
        await this.mutate("remove_novel_collaborator", {
          novel_id: this.novel.novel_id,
          user_id: item.user_id,
        });
      } catch (_) {}
    },
    async quitCollaboration() {
      try {
        await this.writerConfirm("退出该作品协作？", "退出协作");
        await this.mutate("quit_novel_collaboration", {
          novel_id: this.novel.novel_id,
        });
        this.$router.push("/write");
      } catch (_) {}
    },
    saveSettings() {
      return this.mutate("modify_novel", {
        novel_id: this.novel.novel_id,
        ...this.settings,
      });
    },
    settingChecked(key) {
      if (key === "is_personal") return Number(this.novel[key]) === 0;
      if (key === "disable_reader_ai") return Number(this.novel[key]) !== 1;
      return Number(this.novel[key]) === 1;
    },
    async setStatus(key, event) {
      const checked = event.target.checked;
      // Native checkboxes toggle before change. Keep them controlled by saved data:
      // a cancelled confirmation does not change the Vue prop, so it cannot patch DOM.
      event.target.checked = this.settingChecked(key);
      if (this.busy || this.settingPending) return;
      const value = key === "is_complete" ? Number(checked) : Number(!checked);
      this.settingPending = true;
      try {
        if (key !== "disable_reader_ai") {
          await this.writerConfirm(
            key === "is_personal"
              ? value === 0
                ? "公开作品后，已发布章节将对读者可见。"
                : "将作品设为私密？"
              : "更新作品完结状态？",
            "作品状态"
          );
        }
        const endpoint = {
          is_personal: "set_novel_status",
          is_complete: "set_novel_update_status",
          disable_reader_ai: "set_novel_reader_ai_setting",
        }[key];
        await this.mutate(endpoint, {
          novel_id: this.novel.novel_id,
          [key]: value,
        });
      } catch (_) {
        // Cancel, close and Escape leave the saved state intact.
      } finally {
        this.settingPending = false;
      }
    },
    async changeCover(event) {
      const file = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () =>
        this.mutate("change_cover", {
          novel_id: this.novel.novel_id,
          img: reader.result,
        });
      reader.readAsDataURL(file);
    },
    async addTag() {
      try {
        await writerRequest(
          `/library/add_novel_tag?${new URLSearchParams({
            novel_id: this.novel.novel_id,
            tag_name: this.tagName,
          })}`
        );
        this.tagName = "";
        await this.load();
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
    async deleteTag(tag) {
      try {
        await writerRequest(
          `/library/delete_novel_tag?novel_id=${this.novel.novel_id}&tag_id=${tag.tag_id}`
        );
        await this.load();
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
    async exportWork() {
      try {
        const entries = await writerGet("get_articles", {
          id: this.novel.novel_id,
        });
        const articles = [];
        for (const item of entries) {
          const reader = await writerGet("get_article", {
            id: item.article_id,
          });
          const writer = item.article_type.startsWith("manga")
            ? null
            : await writerGet("get_article_writer", { id: item.article_id });
          articles.push({ ...reader, ...(writer || {}) });
        }
        downloadWriterFile(
          `${this.novel.name}-完整备份.json`,
          JSON.stringify({ version: 1, novel: this.novel, articles }, null, 2)
        );
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
    async deleteWork() {
      try {
        await this.writerConfirm(
          `删除作品“${this.novel.name}”？请先导出备份。`,
          "删除作品",
          { type: "warning" }
        );
        await writerPost("delete_novel", { id: this.novel.novel_id });
        this.$router.push("/write");
      } catch (error) {
        if (error instanceof Error) this.writerMessage("error", error.message);
      }
    },
    fontPreference(value) {
      this.$emit("preferences", {
        ...this.preferences,
        fontKey: this.fonts[value] ? value : "",
        fontFamily: this.fonts[value] ? "serif" : value,
      });
    },
    preference(key, value) {
      this.$emit("preferences", { ...this.preferences, [key]: value });
    },
  },
};
</script>
<!-- Scope by workspace ancestry so Vue 2 slot roots receive the same styles. -->
<style>
.writer-workspace .writer-tools {
  min-height: 0;
}
.writer-workspace .writer-tools p {
  line-height: 1.7;
  margin: 0;
  overflow-wrap: anywhere;
}
.writer-workspace .writer-tools .tool-note,
.writer-workspace .writer-tools small {
  color: var(--writer-muted);
  font-size: 12px;
  line-height: 1.7;
}
.writer-workspace .writer-tools .tool-section {
  display: grid;
  gap: 16px;
  padding: 0 0 20px;
  margin: 0 0 20px;
  border-bottom: 1px solid var(--writer-border);
}
.writer-workspace .writer-tools .tool-section:last-child {
  border: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}
.writer-workspace .writer-tools .tool-section h3 {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
.writer-workspace .writer-tools .tool-form,
.writer-workspace .writer-tools label {
  display: grid;
  gap: 8px;
}
.writer-workspace .writer-tools .tool-form {
  margin: 0 0 20px;
}
.writer-workspace .writer-tools .tool-form label {
  margin: 0;
}
.writer-workspace .writer-tools .tool-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--writer-muted);
}
.writer-workspace .writer-tools .tool-section-heading strong {
  color: var(--writer-text);
}
.writer-workspace .writer-tools .tool-callout {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: var(--writer-sidebar);
  border-radius: 4px;
  font-size: 12px;
  color: var(--writer-muted);
  margin-bottom: 16px !important;
}
.writer-workspace .writer-tools .tool-callout i {
  margin-top: 3px;
  flex: none;
}
.writer-workspace .writer-tools .tool-list {
  display: grid;
  gap: 0;
}
.writer-workspace .writer-tools .tool-card {
  display: grid;
  gap: 10px;
  padding: 16px 0;
  border-bottom: 1px solid var(--writer-border);
  min-width: 0;
}
.writer-workspace .writer-tools .tool-card:last-child {
  border-bottom: 0;
}
.writer-workspace .writer-tools .tool-card > strong {
  overflow-wrap: anywhere;
  font-weight: 600;
}
.writer-workspace .writer-tools .tool-card > button {
  justify-self: start;
}
.writer-workspace .writer-tools .tool-card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.writer-workspace .writer-tools .tool-card-heading strong {
  min-width: 0;
  overflow-wrap: anywhere;
}
.writer-workspace .writer-tools .tool-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.writer-workspace .writer-tools .tool-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.writer-workspace .writer-tools .tool-badge {
  flex: none;
  border-radius: 3px;
  font-size: 11px;
  padding: 2px 6px;
  white-space: nowrap;
  background: var(--writer-sidebar);
  color: var(--writer-muted);
}
.writer-workspace .writer-tools .tool-badge.success {
  background: var(--writer-success-bg);
  color: var(--writer-success);
}
.writer-workspace .writer-tools .tool-badge.warning {
  background: var(--writer-warning-bg);
  color: var(--writer-warning);
}
.writer-workspace .writer-tools .feedback-quote {
  margin: 0;
  padding: 12px;
  background: var(--writer-sidebar);
  color: var(--writer-muted);
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
}
.writer-workspace .writer-tools .tool-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px 12px;
  padding: 0 0 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--writer-border);
}
.writer-workspace .writer-tools .tool-metrics span {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: var(--writer-muted);
}
.writer-workspace .writer-tools .tool-metrics strong {
  font-size: 22px;
  font-weight: 600;
  color: var(--writer-text);
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.writer-workspace .writer-tools .tool-table-scroll {
  overflow-x: auto;
  max-width: 100%;
  padding-bottom: 4px;
}
.writer-workspace .writer-tools table {
  font-size: 12px;
  border-collapse: collapse;
  width: 100%;
  min-width: 500px;
  text-align: left;
}
.writer-workspace .writer-tools th,
.writer-workspace .writer-tools td {
  padding: 10px;
  border-bottom: 1px solid var(--writer-border);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.writer-workspace .writer-tools th {
  font-weight: 500;
  color: var(--writer-muted);
  background: var(--writer-sidebar);
}
.writer-workspace .writer-tools .calendar-range {
  margin-bottom: 12px !important;
}
.writer-workspace .writer-tools .writing-calendar {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  grid-auto-flow: column;
  grid-auto-columns: 12px;
  justify-content: start;
  gap: 4px;
  overflow-x: auto;
  max-width: 100%;
  padding: 2px 2px 8px;
}
.writer-workspace .writer-tools .writing-calendar span,
.writer-workspace .writer-tools .calendar-legend span {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: var(--writer-border);
}
.writer-workspace .writer-tools .writing-calendar .level-1,
.writer-workspace .writer-tools .calendar-legend .level-1 {
  background: var(--writer-calendar-1);
}
.writer-workspace .writer-tools .writing-calendar .level-2,
.writer-workspace .writer-tools .calendar-legend .level-2 {
  background: var(--writer-calendar-2);
}
.writer-workspace .writer-tools .writing-calendar .level-3,
.writer-workspace .writer-tools .calendar-legend .level-3 {
  background: var(--writer-calendar-3);
}
.writer-workspace .writer-tools .writing-calendar .level-4,
.writer-workspace .writer-tools .calendar-legend .level-4 {
  background: var(--writer-calendar-4);
}
.writer-workspace .writer-tools .calendar-legend {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  align-items: center;
  margin: 8px 0 16px;
}
.writer-workspace .writer-tools .calendar-detail {
  font-size: 12px;
  color: var(--writer-muted);
  min-height: 42px;
}
.writer-workspace .writer-tools .index-overview {
  display: grid;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--writer-border);
}
.writer-workspace .writer-tools .index-overview .tool-section-heading {
  margin: 0;
}
.writer-workspace .writer-tools .index-overview progress {
  width: 100%;
  height: 6px;
  accent-color: var(--writer-success);
}
.writer-workspace .writer-tools .index-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--writer-muted);
}
.writer-workspace .writer-tools .tool-task-state {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 12px;
  background: var(--writer-sidebar);
  border-radius: 4px;
  font-size: 12px;
}
.writer-workspace .writer-tools .tool-task-state i {
  margin-top: 3px;
}
.writer-workspace .writer-tools .tool-task-state div {
  display: grid;
  gap: 4px;
}
.writer-workspace .writer-tools .owner-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.writer-workspace .writer-tools .collaborator-avatar {
  width: 36px;
  height: 36px;
  border: 1px solid var(--writer-border);
  border-radius: 4px;
  display: grid;
  place-items: center;
  background: var(--writer-sidebar);
  font-size: 18px;
}
.writer-workspace .writer-tools .owner-row > div {
  display: grid;
  gap: 4px;
}
.writer-workspace .writer-tools .permission-details summary {
  font-size: 12px;
  color: var(--writer-muted);
  padding: 6px 0;
  cursor: pointer;
}
.writer-workspace .writer-tools .permission-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 8px 0;
}
.writer-workspace .writer-tools .permission-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  cursor: pointer;
}
.writer-workspace .writer-tools .setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
}
.writer-workspace .writer-tools .setting-row > span {
  display: grid;
  gap: 4px;
}
.writer-workspace .writer-tools .setting-row strong {
  font-weight: 500;
}
.writer-workspace .writer-tools .tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.writer-workspace .writer-tools .tag-list span {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  border-radius: 3px;
  background: var(--writer-sidebar);
  padding: 2px 6px;
}
.writer-workspace .writer-tools .tag-list button {
  width: 22px;
  height: 22px;
  min-height: 22px !important;
  padding: 0 !important;
}
.writer-workspace .writer-tools .tag-form {
  flex-wrap: nowrap;
}
.writer-workspace .writer-tools .tag-form input {
  width: 100%;
  min-width: 0;
}
.writer-workspace .writer-tools .cover-picker {
  position: relative;
}
.writer-workspace .writer-tools .cover-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  border: 1px solid var(--writer-border);
  border-radius: 4px;
  cursor: pointer;
}
.writer-workspace .writer-tools .cover-picker:hover .cover-upload {
  background: var(--writer-hover);
}
.writer-workspace .writer-tools .cover-picker:focus-within .cover-upload {
  outline: 2px solid var(--writer-focus);
  outline-offset: 2px;
}
.writer-workspace .writer-tools .cover-picker.disabled {
  opacity: 0.45;
}
.writer-workspace .writer-tools .cover-picker input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
}

.writer-workspace .writer-tools .range-field {
  display: grid;
  gap: 12px;
}
.writer-workspace .writer-tools .range-field > span {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.writer-workspace .writer-tools .range-field output {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
.writer-workspace .writer-tools .range-field output small {
  font-weight: 400;
}
.writer-workspace .writer-tools .range-field input {
  width: 100%;
  margin: 0;
}
.writer-workspace .writer-tools .shortcut-list {
  display: grid;
  gap: 10px;
  padding-top: 8px;
  font-size: 12px;
  color: var(--writer-muted);
}
.writer-workspace .writer-tools .shortcut-list > span {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.writer-workspace .writer-tools .shortcut-list kbd {
  font: 11px var(--writer-ui-font);
  border: 1px solid var(--writer-border);
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--writer-sidebar);
}
.writer-workspace .writer-tools .danger {
  color: var(--writer-danger) !important;
}
</style>
