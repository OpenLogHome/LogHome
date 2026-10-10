<template>
  <div
    class="writer-workspace"
    :class="['theme-' + preferences.theme, { focused: focusMode }]"
  >
    <header class="workspace-header">
      <nuxt-link to="/write" class="workspace-back" aria-label="返回创作中心"
        ><i aria-hidden="true" class="el-icon-arrow-left"
      /></nuxt-link>
      <div class="workspace-identity">
        <strong>{{ novel.name || "写作工作台" }}</strong
        ><span
          >{{ typeLabel(novel.novel_type) }} · {{ articles.length }}
          {{ isManga ? "话" : "篇" }}</span
        >
      </div>
      <span
        class="save-indicator"
        :class="status"
        role="status"
        :title="stateDetail"
        >{{ stateLabels[status] || status }}</span
      >
      <div class="header-spacer" />
      <button
        v-if="article && !isManga"
        :disabled="!canEdit || saving"
        title="Ctrl / ⌘ S"
        @click="save(true)"
      >
        <i aria-hidden="true" class="el-icon-check" /> 保存
      </button>
      <button
        v-if="article && !isManga"
        :disabled="loadingArticle"
        @click="preview"
      >
        <i aria-hidden="true" class="el-icon-view" /> 预览
      </button>
      <button
        v-if="article && !isManga"
        :disabled="!canEdit || !access.can_publish_article"
        class="primary"
        @click="openPublish"
      >
        发布
      </button>
      <button
        :aria-pressed="String(focusMode)"
        title="专注模式，Esc 退出"
        @click="focusMode = !focusMode"
      >
        <i aria-hidden="true" class="el-icon-full-screen" />
        {{ focusMode ? "退出专注" : "专注" }}
      </button>
    </header>
    <div v-if="error" class="workspace-alert" role="alert">
      {{ error }}<button @click="loadWork">重试</button>
    </div>
    <div v-if="stateDetail" class="workspace-alert" role="alert">
      {{ stateDetail
      }}<button
        v-if="status === 'offline' || status === 'readonly'"
        @click="reopen"
      >
        重新连接
      </button>
    </div>
    <div class="workspace-body">
      <aside
        v-show="!focusMode"
        class="workspace-catalog"
        aria-label="章节目录"
      >
        <div class="catalog-heading">
          <strong>作品目录</strong
          ><button
            :disabled="!access.can_add_article || loadingArticle || sortSaving"
            title="新建章节"
            aria-label="新建章节"
            @click="createOpen = true"
          >
            <i aria-hidden="true" class="el-icon-plus" /></button
          ><button
            :disabled="sortSaving"
            aria-label="刷新目录"
            @click="refreshArticles"
          >
            <i aria-hidden="true" class="el-icon-refresh" />
          </button>
        </div>
        <div class="catalog-search">
          <i aria-hidden="true" class="el-icon-search" /><input
            v-model="query"
            aria-label="搜索章节"
            placeholder="搜索标题或正文"
            @input="searchContent"
          />
        </div>
        <div class="catalog-filters">
          <button
            v-for="item in filters"
            :key="item.key"
            :class="{ active: filter === item.key }"
            :aria-pressed="String(filter === item.key)"
            @click="filter = item.key"
          >
            {{ item.label }}
          </button>
        </div>
        <div v-if="loading" class="catalog-empty">正在加载目录…</div>
        <div v-else-if="!visibleArticles.length" class="catalog-empty">
          {{ query ? "没有匹配章节" : "还没有章节，点击 ＋ 开始创作" }}
        </div>
        <div
          v-if="sortSaving || catalogDrag"
          class="catalog-sort-status"
          role="status"
        >
          {{
            sortSaving ? "正在保存目录顺序…" : "拖至目标位置后松开 · Esc 取消"
          }}
        </div>
        <nav
          ref="catalogList"
          class="catalog-list"
          :class="{ 'is-dragging': catalogDrag }"
        >
          <div
            v-for="{ item, parent, count } in visibleCatalog"
            :key="item.article_id"
            class="catalog-item"
            :data-article-id="item.article_id"
            :class="{
              selected: article && article.article_id === item.article_id,
              volume: item.article_type === 'spliter',
              'in-volume': parent,
              'drag-source':
                catalogDrag && dragSourceIds.includes(item.article_id),
              'drop-before':
                catalogDrop &&
                catalogDrop.markerId === item.article_id &&
                catalogDrop.edge === 'before',
              'drop-after':
                catalogDrop &&
                catalogDrop.markerId === item.article_id &&
                catalogDrop.edge === 'after',
            }"
          >
            <button
              v-if="item.article_type === 'spliter'"
              class="catalog-fold"
              :aria-label="
                (volumeCollapsed(item.article_id) ? '展开 ' : '折叠 ') +
                item.title
              "
              :aria-expanded="String(!volumeCollapsed(item.article_id))"
              :disabled="catalogFiltered || sortSaving || Boolean(catalogDrag)"
              :title="
                catalogFiltered ? '搜索或筛选时自动展开分卷' : '折叠 / 展开分卷'
              "
              @click="toggleVolume(item.article_id)"
            >
              <i
                aria-hidden="true"
                :class="
                  volumeCollapsed(item.article_id)
                    ? 'el-icon-arrow-right'
                    : 'el-icon-arrow-down'
                "
              />
            </button>
            <button
              class="catalog-entry"
              :aria-current="
                article && article.article_id === item.article_id
                  ? 'page'
                  : null
              "
              :disabled="loadingArticle || saving"
              @click="openArticle(item)"
            >
              <span class="catalog-number">{{ item.article_chapter }}</span
              ><span class="catalog-item-main"
                ><strong>{{
                  (article && article.article_id === item.article_id
                    ? article.title
                    : item.writer_title || item.title) || "未命名"
                }}</strong
                ><small
                  >{{ articleLabel(item.article_type) }} ·
                  {{ Number(item.is_draft) === 1 ? "草稿" : "已发布"
                  }}<template v-if="item.active_lock_user_name">
                    · {{ item.active_lock_user_name }} 编辑中</template
                  ><template v-else>
                    ·
                    <template v-if="item.article_type === 'spliter'"
                      >{{ count }} 篇<span
                        v-if="
                          volumeContainsCurrent(item.article_id) &&
                          volumeCollapsed(item.article_id)
                        "
                      >
                        · 正在编辑</span
                      ></template
                    ><template v-else
                      >{{
                        (item.text_count || 0).toLocaleString()
                      }}
                      字</template
                    ></template
                  ></small
                ></span
              ><span
                v-if="
                  item.writer_content_hash &&
                  item.writer_content_hash !== item.content_hash
                "
                class="draft-dot"
                title="有未发布修改"
              />
            </button>
            <el-dropdown trigger="click" @command="catalogAction($event, item)"
              ><button
                class="catalog-menu"
                :class="{ draggable: catalogSortEnabled }"
                :aria-label="'管理 ' + item.title"
                :title="
                  catalogSortEnabled
                    ? '点击管理；按住拖动排序（Alt + 空格可用键盘排序）'
                    : '点击管理'
                "
                :disabled="sortSaving"
                @pointerdown="startCatalogDrag($event, item)"
                @click.capture="catalogHandleClick"
                @keydown="catalogHandleKey($event, item)"
              >
                <i aria-hidden="true" class="el-icon-more" /></button
              ><el-dropdown-menu
                slot="dropdown"
                :class="['writer-popover', 'theme-' + preferences.theme]"
                ><el-dropdown-item
                  v-if="item.article_type === 'spliter'"
                  command="rename"
                  :disabled="!access.can_sort_article"
                  >重命名分卷</el-dropdown-item
                ><el-dropdown-item
                  command="realtime"
                  :disabled="
                    !access.is_owner ||
                    isManga ||
                    !['text', 'richtext'].includes(item.article_type)
                  "
                  >{{
                    item.collaboration_mode === "realtime_crdt"
                      ? "关闭实时协作"
                      : "开启实时协作"
                  }}</el-dropdown-item
                ><el-dropdown-item
                  command="delete"
                  :disabled="!access.can_delete_article"
                  divided
                  >移到回收站</el-dropdown-item
                ></el-dropdown-menu
              ></el-dropdown
            >
          </div>
        </nav>
        <footer class="catalog-footer">
          <button @click="setTool('trash', $event)">
            <i aria-hidden="true" class="el-icon-delete" /> 回收站</button
          ><button @click="setTool('settings', $event)">
            <i aria-hidden="true" class="el-icon-setting" /> 作品设置
          </button>
        </footer>
        <div
          v-if="catalogDrag"
          class="catalog-drag-label"
          :style="{
            left: catalogDrag.x + 14 + 'px',
            top: catalogDrag.y + 14 + 'px',
          }"
          aria-hidden="true"
        >
          <i class="el-icon-rank" /> {{ catalogDrag.title
          }}<small v-if="dragSourceIds.length > 1"
            >含 {{ dragSourceIds.length - 1 }} 篇章节</small
          >
        </div>
        <span class="writer-sr-only" aria-live="polite">{{
          catalogAnnouncement
        }}</span>
      </aside>
      <main class="workspace-editor">
        <div v-if="loadingArticle" class="workspace-empty" role="status">
          <i aria-hidden="true" class="el-icon-loading" />
          <p>正在加载完整章节…</p>
        </div>
        <manga-editor
          v-else-if="article && isManga"
          ref="manga"
          :key="article.article_id"
          :article="article"
          :novel="novel"
          :access="access"
          :theme="preferences.theme"
          @refresh="refreshArticles"
        />
        <vocabulary-editor
          v-else-if="article && article.article_type === 'worldVocabulary'"
          :key="article.article_id"
          v-model="article.content"
          :title="article.title"
          :theme="preferences.theme"
          :disabled="!canEdit"
          :entries="vocabularyEntries"
          :article-id="article.article_id"
          @title="changeTitle"
          @error="error = $event"
        />
        <chapter-editor
          v-else-if="article && article.article_type !== 'spliter'"
          ref="editor"
          :key="article.article_id"
          v-model="article.content"
          :title="article.title"
          :disabled="!canEdit"
          :realtime="realtime"
          :preferences="preferences"
          @title="changeTitle"
          @transaction="writingTransaction"
          @selection="selection = $event"
        />
        <div v-else class="workspace-empty">
          <div class="workspace-empty-icon">
            <i aria-hidden="true" class="el-icon-edit-outline" />
          </div>
          <h1>{{ article ? "分卷目录" : "让故事从这里开始" }}</h1>
          <p>
            {{ article ? article.title : "从左侧选择章节，或创建新的章节。" }}
          </p>
          <button
            v-if="access.can_add_article"
            class="primary"
            @click="createOpen = true"
          >
            ＋ 新建{{ isManga ? "话数" : "章节" }}
          </button>
        </div>
        <footer class="editor-statusbar">
          <span
            >{{ article ? articleLabel(article.article_type) : "写作工作台"
            }}<template v-if="article">
              · {{ article.article_id }}</template
            ></span
          ><span v-if="realtime">{{ presence.length }} 人在线 · 实时协作</span
          ><span class="header-spacer" /><span>Ctrl / ⌘ S 保存</span
          ><button @click="setTool('appearance', $event)">
            {{ preferences.fontSize }}px ·
            {{ preferences.theme === "dark" ? "深色" : "浅色" }}
          </button>
        </footer>
      </main>
      <aside v-show="!focusMode && tool" class="workspace-tool-panel">
        <writer-ai
          v-if="
            tool === 'ai' &&
            article &&
            !isManga &&
            article.article_type !== 'worldVocabulary'
          "
          :key="article.article_id"
          :article="article"
          :theme="preferences.theme"
          :session-id="session ? session.sessionId : ''"
          :selection="selection"
          :can-edit="canEdit"
          @close="closeTool"
          @insert="insertAi"
          @replace="replaceAi"
          @image="insertAiImage"
        />
        <writer-panel
          v-else-if="tool === 'collaboration'"
          class="collaboration-panel"
          title="实时协作"
          :subtitle="
            realtime ? presence.length + ' 人在线 · 当前章节' : '共同编辑与讨论'
          "
          :scrollable="false"
          @close="closeTool"
        >
          <writer-empty-state
            v-if="!realtime"
            icon="el-icon-chat-dot-round"
            title="让作者一起创作"
            description="在当前章节的目录菜单中开启实时协作，即可同步正文、光标并在线讨论。"
          />
          <template v-else
            ><div class="presence-list">
              <div
                v-for="person in presence"
                :key="person.clientId"
                class="presence-item"
              >
                <span
                  :style="{
                    background: person.color || 'var(--writer-accent)',
                  }"
                />{{ person.name || "协作者" }}
              </div>
            </div>
            <div class="collaboration-messages">
              <writer-empty-state
                v-if="!chatMessages.length"
                icon="el-icon-chat-line-round"
                title="还没有讨论"
                description="发送第一条消息，与在线作者交流想法。"
              />
              <article
                v-for="(message, index) in chatMessages"
                :key="message.id || index"
              >
                <small>{{
                  message.user_name || message.name || message.user_id
                }}</small>
                <p>{{ message.content }}</p>
              </article>
            </div>
          </template>
          <form
            v-if="realtime"
            slot="footer"
            class="collaboration-composer"
            @submit.prevent="sendChat"
          >
            <textarea
              v-model="chatDraft"
              aria-label="协作聊天"
              placeholder="与在线作者讨论…"
              maxlength="2000"
              rows="3"
            /><button class="primary" :disabled="!chatDraft.trim()">
              发送
            </button>
          </form>
        </writer-panel>
        <writer-tools
          v-else-if="tool !== 'ai'"
          :key="tool"
          :tab="tool"
          :novel="novel"
          :article="article"
          :access="access"
          :can-edit="canEdit"
          :preferences="preferences"
          :skins="skins"
          :fonts="fonts"
          @restore="restore"
          @export="exportCurrent"
          @refresh="loadWork(false)"
          @preferences="setPreferences"
          @close="closeTool"
        />
        <writer-panel
          v-else
          title="笔泡 · 写作助手"
          subtitle="与你一起构思故事"
          @close="closeTool"
          ><writer-empty-state
            icon="el-icon-magic-stick"
            title="先选择一个文字章节"
            description="打开正文或大纲后，即可讨论情节、润色选段或续写故事。"
        /></writer-panel>
      </aside>
      <nav
        v-show="!focusMode"
        class="workspace-tool-rail"
        aria-label="写作工具"
      >
        <button
          v-for="item in tools"
          :key="item.key"
          :class="{ active: tool === item.key }"
          :title="item.label"
          :aria-label="item.label"
          :aria-pressed="String(tool === item.key)"
          @click="setTool(item.key, $event)"
        >
          <i aria-hidden="true" :class="item.icon" /><span>{{
            item.short
          }}</span>
        </button>
      </nav>
    </div>
    <el-dialog
      class="writer-dialog-wrapper"
      title="新建内容"
      :visible.sync="createOpen"
      width="480px"
      :custom-class="writerDialogClass"
      append-to-body
      ><form class="create-form" @submit.prevent="createArticle">
        <label
          >类型<select v-model="newType">
            <option v-if="!isManga" value="richtext">章节</option>
            <option v-if="!isManga" value="worldOutline">大纲</option>
            <option v-if="!isManga" value="worldVocabulary">世界词条</option>
            <option v-if="!isManga" value="spliter">分卷</option>
            <option v-if="isManga" value="mangaStrip">条漫</option>
            <option v-if="isManga" value="mangaPage">页漫</option>
          </select></label
        ><label
          >标题<input
            v-model="newTitle"
            required
            maxlength="100"
            autofocus /></label
        ><label
          >插入位置<select v-model="insertPosition">
            <option :value="articles.length + 1">目录末尾</option>
            <option
              v-for="item in articles"
              :key="item.article_id"
              :value="item.article_chapter"
            >
              在 {{ item.title }} 之前
            </option>
          </select></label
        ><button class="primary" :disabled="creating">创建草稿</button>
      </form></el-dialog
    >
    <el-dialog
      class="writer-dialog-wrapper"
      title="版本需要确认"
      :visible.sync="conflictOpen"
      :close-on-click-modal="false"
      :show-close="false"
      width="960px"
      top="6vh"
      :custom-class="writerDialogClass + ' writer-conflict-dialog'"
      append-to-body
      ><p class="conflict-intro">
        本机稿件与云端不同。请比较内容后选择要继续使用的版本；选择前可先导出备份。
      </p>
      <div class="conflict-comparison">
        <section>
          <h3>本机稿件</h3>
          <writer-version-preview :article="conflictLocal" label="本机稿件" />
        </section>
        <section>
          <h3>云端稿件</h3>
          <writer-version-preview :article="conflictRemote" label="云端稿件" />
        </section>
      </div>
      <span slot="footer" class="conflict-actions"
        ><el-button @click="exportConflict('local')">导出本机版本</el-button
        ><el-button @click="exportConflict('remote')">导出云端版本</el-button
        ><span class="conflict-action-spacer" />
        <el-button @click="chooseRemote">使用云端版本</el-button
        ><el-button
          type="primary"
          :disabled="!session || !session.writable"
          @click="chooseLocal"
          >继续编辑本机版本</el-button
        ></span
      ></el-dialog
    >
    <el-dialog
      :visible="Boolean(previewKey)"
      @close="previewKey = ''"
      width="92vw"
      top="4vh"
      custom-class="writer-reader-preview"
      append-to-body
      destroy-on-close
      ><reader-preview
        v-if="previewKey"
        :preview-key="previewKey"
        @close="previewKey = ''"
    /></el-dialog>
    <publish-panel
      v-if="publishOpen && article"
      :article="article"
      :novel="novel"
      :theme="preferences.theme"
      :can-publish="Boolean(access.can_publish_article)"
      :busy="saving"
      @close="publishOpen = false"
      @publish="publish"
      @correct="applyCorrections"
    />
  </div>
</template>
<script>
import {
  catalogGroups,
  catalogRows,
  moveCatalog,
} from "~/utils/writer/catalog";
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import ChapterEditor from "./ChapterEditor.vue";
import WriterPanel from "./WriterPanel.vue";
import WriterVersionPreview from "./WriterVersionPreview.vue";
import WriterEmptyState from "./WriterEmptyState.vue";
import VocabularyEditor from "./VocabularyEditor.vue";
import WriterTools from "./WriterTools.vue";
import WriterAi from "./WriterAi.vue";
import MangaEditor from "./MangaEditor.vue";
import PublishPanel from "./PublishPanel.vue";
import ReaderPreview from "~/components/read/ReaderPreview.vue";
import { storeReaderPreview } from "~/utils/reader-preview";
import {
  writerRequest,
  writerGet,
  writerPost,
  writerIdentity,
  collaborationRequest,
  downloadWriterFile,
} from "~/utils/writer/api";
import { validateWriterContent } from "~/utils/writer/validate";
import { ySyncPluginKey } from "y-prosemirror";
import { normalizeBackgroundSkin } from "~/utils/reader-backgrounds";
import { loadReaderFont } from "~/utils/reader-font-loader";
import fonts from "~/config/reader/fonts.json";
import { readerFonts } from "~/utils/reader-preferences";
import { WriterSession } from "~/utils/writer/session";
import { WriterRealtime } from "~/utils/writer/realtime";
import { writerSignature, writerTime } from "~/utils/writer/drafts";
import {
  createNovelWritingActivityReporter,
  countInsertedCharacters,
} from "~/utils/writer/activity";
import {
  legacyBlocksToDoc,
  parseLegacyContent,
} from "~/utils/writer/legacy-adapter";
const tools = [
  ["ai", "el-icon-magic-stick", "AI 助手", "助手"],
  ["history", "el-icon-time", "云端时间机器", "历史"],
  ["backups", "el-icon-folder-checked", "本机备份", "备份"],
  ["collaboration", "el-icon-chat-dot-round", "实时协作", "协作"],
  ["feedback", "el-icon-chat-line-square", "读者纠错", "反馈"],
  ["calendar", "el-icon-date", "写作日历", "日历"],
  ["statistics", "el-icon-data-analysis", "阅读统计", "数据"],
  ["schedule", "el-icon-alarm-clock", "定时发布", "定时"],
  ["indexing", "el-icon-connection", "作品索引", "索引"],
  ["collaborators", "el-icon-user", "协作者管理", "作者"],
  ["appearance", "el-icon-brush", "写作偏好", "偏好"],
].map(([key, icon, label, short]) => ({ key, icon, label, short }));
export default {
  mixins: [writerDialogTheme],
  name: "WriterWorkspace",
  components: {
    WriterPanel,
    WriterVersionPreview,
    WriterEmptyState,
    ChapterEditor,
    VocabularyEditor,
    WriterTools,
    WriterAi,
    MangaEditor,
    PublishPanel,
    ReaderPreview,
  },
  props: { workId: Number },
  data: () => ({
    novel: {},
    access: {},
    articles: [],
    collapsedVolumes: [],
    sortSaving: false,
    catalogDrag: null,
    catalogDrop: null,
    catalogAnnouncement: "",
    article: null,
    session: null,
    realtime: null,
    loading: true,
    loadingArticle: false,
    saving: false,
    error: "",
    status: "loading",
    stateDetail: "",
    tool: "",
    focusMode: false,
    query: "",
    filter: "all",
    searchRows: [],
    selection: { from: 0, to: 0, text: "" },
    skins: [],
    fonts,
    preferences: {
      theme: "light",
      fontSize: 18,
      lineHeight: 1.9,
      paperWidth: 820,
      fontFamily: "sans-serif",
      quickInputs: "　　|，|。|、|！|？|：|“”|《》",
    },
    createOpen: false,
    creating: false,
    newTitle: "",
    newType: "richtext",
    insertPosition: 1,
    conflictOpen: false,
    conflictLocal: {},
    conflictRemote: {},
    previewKey: "",
    publishOpen: false,
    presence: [],
    chatMessages: [],
    chatDraft: "",
    tools,
    stateLabels: {
      ready: "选择章节开始创作",
      loading: "加载中",
      connecting: "连接协作中",
      syncing: "同步中",
      synced: "已同步",
      pending: "本机已保存 · 待同步",
      saving: "保存中",
      readonly: "只读",
      offline: "离线 · 本机已保存",
      conflict: "版本冲突",
    },
    filters: [
      { key: "all", label: "全部" },
      { key: "draft", label: "草稿" },
      { key: "published", label: "已发布" },
    ],
  }),
  computed: {
    isManga() {
      return this.novel.novel_type === "manga";
    },
    canEdit() {
      return Boolean(
        this.article &&
          !this.loadingArticle &&
          !this.conflictOpen &&
          (this.article.current_access || this.access).can_edit_draft &&
          (this.realtime || (this.session && this.session.writable)) &&
          this.status !== "readonly"
      );
    },
    vocabularyEntries() {
      return this.articles.filter(
        (item) =>
          item.article_type === "worldVocabulary" &&
          (!this.article || item.article_id !== this.article.article_id)
      );
    },
    catalogFiltered() {
      return Boolean(this.query.trim() || this.filter !== "all");
    },
    catalogSortEnabled() {
      return Boolean(
        this.access.can_sort_article &&
          !this.catalogFiltered &&
          !this.sortSaving &&
          !this.loading &&
          !this.loadingArticle
      );
    },
    catalogGroups() {
      return catalogGroups(this.articles);
    },
    dragSourceIds() {
      if (!this.catalogDrag) return [];
      const group = this.catalogGroups.find(
        (group) => group.id === this.catalogDrag.id
      );
      return group ? [group.id, ...group.children] : [this.catalogDrag.id];
    },
    visibleCatalog() {
      const query = this.query.trim().toLowerCase();
      const matches = this.catalogFiltered
        ? new Set(
            this.articles
              .filter(
                (item) =>
                  (this.filter === "all" ||
                    Number(item.is_draft) ===
                      (this.filter === "draft" ? 1 : 0)) &&
                  (!query ||
                    `${item.title} ${item.writer_title || ""}`
                      .toLowerCase()
                      .includes(query) ||
                    this.searchRows.some(
                      (row) =>
                        row.article_id === item.article_id &&
                        String(
                          (row.latest_writer && row.latest_writer.content) ||
                            (row.published && row.published.content) ||
                            ""
                        )
                          .toLowerCase()
                          .includes(query)
                    ))
              )
              .map((item) => item.article_id)
          )
        : null;
      return catalogRows(this.articles, this.collapsedVolumes, matches);
    },
    visibleArticles() {
      return this.visibleCatalog.map((row) => row.item);
    },
  },
  watch: {
    "article.content"() {
      this.changed();
    },
    "article.title"() {
      this.changed();
    },
  },
  async mounted() {
    try {
      const value = JSON.parse(
        localStorage.getItem("loghome:writer:preferences") || "null"
      );
      if (value) this.preferences = { ...this.preferences, ...value };
    } catch (_) {}
    try {
      this.collapsedVolumes = JSON.parse(
        localStorage.getItem(this.catalogStorageKey()) || "[]"
      );
      if (!Array.isArray(this.collapsedVolumes)) this.collapsedVolumes = [];
    } catch (_) {
      this.collapsedVolumes = [];
    }
    this.loadAppearance();
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("beforeunload", this.beforeUnload);
    window.addEventListener("pagehide", this.pagehide);
    window.addEventListener("online", this.online);
    await this.loadWork();
    if (
      this.tools.some((item) => item.key === this.$route.query.tool) ||
      ["settings", "trash"].includes(this.$route.query.tool)
    )
      this.tool = this.$route.query.tool;
    const id = Number(this.$route.query.article);
    if (id) {
      const item = this.articles.find((item) => item.article_id === id);
      if (item) await this.openArticle(item);
    }
  },
  beforeDestroy() {
    this.cancelCatalogDrag();
    clearTimeout(this.saveTimer);
    clearTimeout(this.searchTimer);
    clearInterval(this.snapshotTimer);
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("beforeunload", this.beforeUnload);
    window.removeEventListener("pagehide", this.pagehide);
    window.removeEventListener("online", this.online);
    if (this.activity) this.activity.stop();
    if (this.session) this.session.close().catch(() => {});
    if (this.realtime) this.realtime.destroy();
  },
  methods: {
    catalogStorageKey() {
      return `loghome:writer:catalog:${writerIdentity().id}:${this.workId}`;
    },
    volumeCollapsed(id) {
      return !this.catalogFiltered && this.collapsedVolumes.includes(id);
    },
    volumeContainsCurrent(id) {
      const group = this.catalogGroups.find((group) => group.id === id);
      return Boolean(
        this.article &&
          group &&
          group.children.includes(this.article.article_id)
      );
    },
    toggleVolume(id) {
      this.collapsedVolumes = this.collapsedVolumes.includes(id)
        ? this.collapsedVolumes.filter((value) => value !== id)
        : [...this.collapsedVolumes, id];
      try {
        localStorage.setItem(
          this.catalogStorageKey(),
          JSON.stringify(this.collapsedVolumes)
        );
      } catch (_) {}
    },
    catalogHandleClick(event) {
      if (Date.now() < (this._catalogIgnoreClickUntil || 0)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    startCatalogDrag(event, item) {
      if (event.button !== 0 || !this.catalogSortEnabled) return;
      this.cancelCatalogDrag();
      this._catalogPointer = {
        id: item.article_id,
        title: item.writer_title || item.title,
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
        handle: event.currentTarget,
      };
      document.addEventListener("pointermove", this.moveCatalogPointer, {
        passive: false,
      });
      document.addEventListener("pointerup", this.finishCatalogPointer);
      document.addEventListener("pointercancel", this.cancelCatalogDrag);
      window.addEventListener("blur", this.cancelCatalogDrag);
    },
    moveCatalogPointer(event) {
      const pointer = this._catalogPointer;
      if (!pointer || event.pointerId !== pointer.pointerId) return;
      if (!this.catalogSortEnabled) {
        this.cancelCatalogDrag();
        return;
      }
      if (
        !this.catalogDrag &&
        Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 5
      )
        return;
      event.preventDefault();
      if (!this.catalogDrag) {
        // Pointer capture keeps the gesture alive while the list scrolls.
        try {
          pointer.handle.setPointerCapture(pointer.pointerId);
        } catch (_) {}
        this.catalogAnnouncement = `正在移动 ${pointer.title}，松开保存，Esc 取消`;
        this._catalogScrollTime = 0;
        this._catalogScrollFrame = requestAnimationFrame(
          this.scrollCatalogDrag
        );
      }
      this.catalogDrag = {
        ...pointer,
        handle: undefined,
        x: event.clientX,
        y: event.clientY,
      };
      this.updateCatalogDrop();
    },
    updateCatalogDrop() {
      if (!this.catalogDrag || this.catalogDrag.keyboard) return;
      const { x, y, id } = this.catalogDrag;
      const list = this.$refs.catalogList;
      const bounds = list.getBoundingClientRect();
      if (
        x < bounds.left ||
        x > bounds.right ||
        y < bounds.top ||
        y > bounds.bottom
      ) {
        this.catalogDrop = null;
        return;
      }
      const node = document.elementFromPoint(x, y);
      let row = node && node.closest(".catalog-item");
      if (!row || !list.contains(row)) {
        const rows = list.querySelectorAll(".catalog-item");
        if (!rows.length) {
          this.catalogDrop = null;
          return;
        }
        row =
          y > rows[rows.length - 1].getBoundingClientRect().bottom
            ? rows[rows.length - 1]
            : rows[0];
      }
      const rect = row.getBoundingClientRect();
      const result = moveCatalog(
        this.articles,
        id,
        Number(row.dataset.articleId),
        y < rect.top + rect.height / 2 ? "before" : "after"
      );
      this.setCatalogDrop(result);
    },
    setCatalogDrop(result) {
      if (result) {
        const parent = this.catalogGroups.find((group) =>
          group.children.includes(result.markerId)
        );
        if (parent && this.volumeCollapsed(parent.id))
          result.markerId = parent.id;
      }
      this.catalogDrop = result;
    },
    scrollCatalogDrag(time) {
      if (!this.catalogDrag || this.catalogDrag.keyboard) return;
      const list = this.$refs.catalogList;
      const bounds = list.getBoundingClientRect();
      const { x, y } = this.catalogDrag;
      if (
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        const delta =
          y < bounds.top + 44
            ? -Math.min(1, (bounds.top + 44 - y) / 44)
            : y > bounds.bottom - 44
            ? Math.min(1, (y - bounds.bottom + 44) / 44)
            : 0;
        list.scrollTop +=
          delta * Math.min(32, time - (this._catalogScrollTime || time)) * 0.5;
        this.updateCatalogDrop();
      }
      this._catalogScrollTime = time;
      this._catalogScrollFrame = requestAnimationFrame(this.scrollCatalogDrag);
    },
    finishCatalogPointer(event) {
      if (
        !this._catalogPointer ||
        event.pointerId !== this._catalogPointer.pointerId
      )
        return;
      if (this.catalogDrag) this.updateCatalogDrop();
      const result = this.catalogDrop;
      this.cancelCatalogDrag();
      if (result) this.saveCatalogOrder(result.rows);
    },
    cancelCatalogDrag() {
      if (this.catalogDrag) this._catalogIgnoreClickUntil = Date.now() + 400;
      const pointer = this._catalogPointer;
      if (pointer) {
        try {
          pointer.handle.releasePointerCapture(pointer.pointerId);
        } catch (_) {}
      }
      document.removeEventListener("pointermove", this.moveCatalogPointer);
      document.removeEventListener("pointerup", this.finishCatalogPointer);
      document.removeEventListener("pointercancel", this.cancelCatalogDrag);
      window.removeEventListener("blur", this.cancelCatalogDrag);
      cancelAnimationFrame(this._catalogScrollFrame);
      this._catalogPointer = null;
      this.catalogDrag = null;
      this.catalogDrop = null;
    },
    catalogHandleKey(event, item) {
      if (!event.altKey || event.code !== "Space" || !this.catalogSortEnabled)
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.cancelCatalogDrag();
      const rect = event.currentTarget.getBoundingClientRect();
      this.catalogDrag = {
        id: item.article_id,
        title: item.title,
        keyboard: true,
        x: rect.right,
        y: rect.top,
      };
      this._catalogKeyboardRows = this.articles;
      this.catalogAnnouncement = `正在移动 ${item.title}，方向键调整位置，Enter 保存，Esc 取消`;
    },
    catalogDragKey(event) {
      if (!this.catalogDrag) return false;
      if (event.key === "Escape") {
        event.preventDefault();
        this.cancelCatalogDrag();
        this.catalogAnnouncement = "已取消目录排序";
        return true;
      }
      if (!this.catalogDrag.keyboard) return false;
      if (!["ArrowUp", "ArrowDown", "Enter", " "].includes(event.key))
        return false;
      event.preventDefault();
      if (event.key === "Enter" || event.key === " ") {
        const result = this.catalogDrop;
        this.cancelCatalogDrag();
        if (result) this.saveCatalogOrder(result.rows);
        return true;
      }
      const rows = this._catalogKeyboardRows;
      const index = rows.findIndex(
        (row) => row.article_id === this.catalogDrag.id
      );
      const group = catalogGroups(rows).find(
        (value) => value.id === this.catalogDrag.id
      );
      const target =
        event.key === "ArrowUp" ? index - 1 : (group ? group.end : index) + 1;
      if (target < 0 || target >= rows.length) return true;
      const result = moveCatalog(
        rows,
        this.catalogDrag.id,
        rows[target].article_id,
        event.key === "ArrowUp" ? "before" : "after"
      );
      if (result) {
        this._catalogKeyboardRows = result.rows;
        this.setCatalogDrop(result);
        const marker = this.$refs.catalogList.querySelector(
          `[data-article-id="${this.catalogDrop.markerId}"]`
        );
        if (marker) marker.scrollIntoView({ block: "nearest" });
        this.catalogAnnouncement = `新位置：第 ${
          result.rows.findIndex(
            (row) => row.article_id === this.catalogDrag.id
          ) + 1
        } 项，Enter 保存`;
      }
      return true;
    },
    async saveCatalogOrder(rows) {
      if (
        !this.catalogSortEnabled ||
        rows.every(
          (row, index) => row.article_id === this.articles[index].article_id
        )
      )
        return;
      const ids = new Set(this.articles.map((row) => row.article_id));
      if (
        rows.length !== ids.size ||
        new Set(rows.map((row) => row.article_id)).size !== ids.size ||
        rows.some((row) => !ids.has(row.article_id))
      )
        return;
      const original = this.articles;
      this._catalogRevision = (this._catalogRevision || 0) + 1;
      this.sortSaving = true;
      this.articles = rows.map((row, index) => ({
        ...row,
        article_chapter: index + 1,
      }));
      try {
        await writerPost("resort_article", {
          sortlist: JSON.stringify(
            this.articles.map(({ article_id, article_chapter }) => ({
              article_id,
              article_chapter,
            }))
          ),
        });
        this.catalogAnnouncement = "目录顺序已保存";
        this.writerMessage("success", "目录顺序已保存");
      } catch (error) {
        this.articles = original;
        this.catalogAnnouncement = "排序保存失败，已恢复原顺序";
        this.writerMessage("error", `${error.message}，已恢复原顺序`);
      } finally {
        this.sortSaving = false;
      }
    },

    typeLabel(type) {
      return (
        {
          world: "世界设定",
          poetry: "诗歌",
          nonfiction: "非虚构",
          manga: "漫画",
        }[type] || "小说"
      );
    },
    articleLabel(type) {
      return (
        {
          richtext: "章节",
          text: "章节",
          worldOutline: "大纲",
          worldVocabulary: "词条",
          spliter: "分卷",
          mangaStrip: "条漫",
          mangaPage: "页漫",
        }[type] || "章节"
      );
    },
    async loadWork(initial = true) {
      if (initial) this.loading = true;
      this.error = "";
      try {
        const [novel, collaboration] = await Promise.all([
          writerGet(this.isManga ? "get_manga" : "get_novel_by_id", {
            id: this.workId,
          }),
          writerGet("get_novel_collaboration_info", { novel_id: this.workId }),
        ]);
        this.novel = {
          ...(Array.isArray(novel) ? novel[0] : novel),
          ...collaboration.novel,
        };
        this.access = collaboration.access || {};
        await this.refreshArticles();
        this.newType = this.isManga ? "mangaStrip" : "richtext";
        if (!this.article) this.status = "ready";
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async refreshArticles() {
      if (this.sortSaving) return;
      this.cancelCatalogDrag();
      const revision = (this._catalogRevision || 0) + 1;
      this._catalogRevision = revision;
      try {
        const rows = await writerGet("get_articles", { id: this.workId });
        if (revision !== this._catalogRevision || this.sortSaving) return;
        this.articles = rows.sort(
          (a, b) => a.article_chapter - b.article_chapter
        );
        this.insertPosition = this.articles.length + 1;
      } catch (error) {
        this.error = error.message;
      }
    },
    searchContent() {
      clearTimeout(this.searchTimer);
      if (!this.query.trim()) {
        this.searchRows = [];
        return;
      }
      this.searchTimer = setTimeout(async () => {
        try {
          this.searchRows = await writerGet("get_articles_search_snapshot", {
            id: this.workId,
          });
        } catch (error) {
          this.writerMessage("error", error.message);
        }
      }, 300);
    },
    async disposeChapter() {
      clearTimeout(this.saveTimer);
      clearInterval(this.snapshotTimer);
      if (this.activity) {
        await this.activity.stop();
        this.activity = null;
      }
      if (this.session) {
        await this.session.close();
        this.session = null;
      }
      if (this.realtime) {
        await this.realtime.destroy();
        this.realtime = null;
      }
      this.article = null;
      this.presence = [];
      this.chatMessages = [];
    },
    async leaveChapter() {
      if (this.$refs.manga && !(await this.$refs.manga.canLeave()))
        return false;
      if (
        this.realtime &&
        this.realtime.provider &&
        this.realtime.provider.hasUnsyncedChanges
      ) {
        await this.session.backup(true);
        try {
          await this.realtime.checkpoint();
        } catch (error) {
          try {
            await this.writerConfirm(
              "协作修改尚未获云端确认，本机备份已保留。离开后请重新连接此章节完成同步。继续？",
              "协作同步未完成"
            );
          } catch (_) {
            return false;
          }
        }
      }
      if (
        this.session &&
        !this.isManga &&
        !this.realtime &&
        this.session.writable &&
        writerSignature(this.article) !== this.session.baseline
      ) {
        try {
          await this.session.save(true);
        } catch (error) {
          try {
            await this.writerConfirm(
              "云端保存未完成，本机备份已保留。是否切换章节？",
              "保留本机稿件",
              { confirmButtonText: "保留并切换", cancelButtonText: "继续编辑" }
            );
          } catch (_) {
            return false;
          }
        }
      }
      await this.disposeChapter();
      return true;
    },
    async openArticle(item) {
      const group = this.catalogGroups.find((group) =>
        group.children.includes(item.article_id)
      );
      if (group && this.collapsedVolumes.includes(group.id))
        this.toggleVolume(group.id);
      if (this.loadingArticle || this.saving) return;
      if (this.article && this.article.article_id === item.article_id) return;
      if (!(await this.leaveChapter())) return;
      this.loadingArticle = true;
      this.stateDetail = "";
      this.status = "loading";
      try {
        if (this.isManga) {
          const data = await writerGet("get_article", { id: item.article_id });
          if (!data) throw new Error("话数加载失败");
          this.article = data;
          this.status = "synced";
          return;
        }
        if (item.article_type === "spliter") {
          this.article = { ...item };
          this.status = "synced";
          return;
        }
        const session = new WriterSession({
          onState: (state) => {
            this.status = state.status;
            this.stateDetail = state.detail;
          },
        });
        this.session = session;
        const result = await session.open(item.article_id);
        this.article = result.article;
        const collaboration = this.article.collaboration;
        if (collaboration && collaboration.mode === "realtime_crdt") {
          const realtime = new WriterRealtime(
            item.article_id,
            (state) => {
              this.status = state;
              this.stateDetail =
                state === "readonly" ? "协作权限失效，请重新连接。" : "";
            },
            (people) => {
              this.presence = people;
            },
            (event) => {
              if (event.type === "collaboration_chat_history")
                this.chatMessages = event.messages || [];
              if (event.type === "collaboration_chat_message")
                this.chatMessages.push(event.message || event);
            }
          );
          this.realtime = realtime;
          await realtime.open(collaboration);
          this.article.title = realtime.title.toString();
          this.titleObserver = () => {
            this.article.title = realtime.title.toString();
          };
          realtime.title.observe(this.titleObserver);
        } else if (result.local) {
          this.conflictLocal = result.local;
          this.conflictRemote = { ...this.article };
          this.conflictOpen = true;
        }
        this.activity = createNovelWritingActivityReporter(
          { $baseUrl: process.env.baseUrl },
          {
            getArticleId: () => this.article && this.article.article_id,
            getSessionId: () => session.sessionId,
            getUserId: () => writerIdentity().id,
            isEnabled: () => this.canEdit,
          }
        );
        this.activity.start();
        this.snapshotTimer = setInterval(() => {
          if (this.canEdit) this.save(true);
        }, 60000);
      } catch (error) {
        if (this.realtime) {
          await this.realtime.destroy();
          this.realtime = null;
        }
        this.status = "readonly";
        this.stateDetail = error.message;
      } finally {
        this.loadingArticle = false;
      }
    },
    changed() {
      if (this.loadingArticle || !this.session || !this.canEdit) return;
      this.session.article = this.article;
      this.session.backup().catch((error) => {
        this.stateDetail = `本机备份失败：${error.message}`;
      });
      if (!this.realtime) {
        if (writerSignature(this.article) === this.session.baseline) {
          this.status = "synced";
          return;
        }
        this.status = "pending";
      }
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => this.save(false), 2500);
    },
    changeTitle(value) {
      this.article.title = value;
      if (this.realtime) this.realtime.setTitle(value);
      if (this.activity) this.activity.markActive();
    },
    writingTransaction(transaction) {
      if (
        this.activity &&
        this.canEdit &&
        transaction.docChanged &&
        !transaction.getMeta(ySyncPluginKey)
      ) {
        this.activity.markActive();
        this.activity.recordWrittenCharacters(
          countInsertedCharacters(transaction)
        );
      }
    },
    async save(snapshot = false) {
      if (!this.session || this.loadingArticle || this.saving) return;
      this.saving = true;
      try {
        if (this.realtime) {
          await this.session.backup(snapshot);
          if (snapshot) await this.realtime.checkpoint();
        } else await this.session.save(snapshot);
      } catch (error) {
        if (error.remote) {
          this.conflictLocal = { ...this.article };
          this.conflictRemote = error.remote;
          this.conflictOpen = true;
        } else this.stateDetail = error.message;
      } finally {
        this.saving = false;
      }
    },
    async reopen() {
      if (!this.article) return;
      const item = { ...this.article };
      if (await this.leaveChapter()) await this.openArticle(item);
    },
    chooseRemote() {
      this.article = this.session.adoptRemote(this.conflictRemote);
      this.conflictOpen = false;
      this.stateDetail = "";
      this.session
        .backup()
        .catch((error) => this.writerMessage("error", error.message));
    },
    chooseLocal() {
      this.session.baseline = writerSignature(this.conflictRemote);
      this.article = {
        ...this.article,
        title: this.conflictLocal.title,
        content: this.conflictLocal.content,
      };
      this.session.article = this.article;
      this.conflictOpen = false;
      this.stateDetail = "";
      this.status = "pending";
      this.save(true);
    },
    exportConflict(source = "local") {
      const remote = source === "remote",
        article = remote ? this.conflictRemote : this.conflictLocal;
      downloadWriterFile(
        `${article.title || "章节"}-${remote ? "云端" : "本机"}版本.json`,
        JSON.stringify(article, null, 2)
      );
    },
    async createArticle() {
      if (this.creating) return;
      this.creating = true;
      try {
        const content =
          this.newType === "worldVocabulary"
            ? JSON.stringify({ desc: "", attributes: [], relations: [] })
            : this.newType.startsWith("manga")
            ? JSON.stringify({ version: 1, pages: [] })
            : "[]";
        const result = await writerPost("add_article", {
          id: this.workId,
          title: this.newTitle.trim(),
          article_type: this.newType,
          article_chapter: this.insertPosition,
          content,
          is_draft: 1,
        });
        this.createOpen = false;
        this.newTitle = "";
        await this.refreshArticles();
        const item = this.articles.find(
          (item) => item.article_id === result.insertId
        );
        if (item) await this.openArticle(item);
      } catch (error) {
        this.writerMessage("error", error.message);
      } finally {
        this.creating = false;
      }
    },
    async catalogAction(action, item) {
      if (this.sortSaving || this.catalogDrag) return;
      try {
        if (action === "rename" && item.article_type === "spliter") {
          const { value } = await this.writerPrompt("分卷名称", "重命名分卷", {
            inputValue: item.title,
            inputValidator: (value) =>
              Boolean(value && value.trim()) || "请输入名称",
          });
          await writerPost("modify_article", {
            article_id: item.article_id,
            title: value.trim(),
            content: item.content || "[]",
            is_draft: item.is_draft,
          });
          if (this.article && this.article.article_id === item.article_id)
            this.article.title = value.trim();
        } else if (action === "delete") {
          await this.writerConfirm(`将“${item.title}”移到回收站？`, "删除章节");
          if (
            this.article &&
            this.article.article_id === item.article_id &&
            !(await this.leaveChapter())
          )
            return;
          await writerPost("delete_article", { id: item.article_id });
        } else if (action === "realtime") {
          await this.writerConfirm(
            "切换协作模式会改变该章节的保存协议。请确保所有作者已保存并退出。",
            "切换实时协作"
          );
          if (
            this.article &&
            this.article.article_id === item.article_id &&
            !(await this.leaveChapter())
          )
            return;
          await collaborationRequest(item.article_id, "mode", {
            mode:
              item.collaboration_mode === "realtime_crdt"
                ? "legacy_lock"
                : "realtime_crdt",
          });
        } else return;
        await this.refreshArticles();
      } catch (error) {
        if (error instanceof Error) this.writerMessage("error", error.message);
      }
    },
    setTool(key, event) {
      if (event) this.toolTrigger = event.currentTarget;
      this.tool = this.tool === key ? "" : key;
    },
    closeTool() {
      this.tool = "";
      this.$nextTick(() => {
        if (this.toolTrigger && this.toolTrigger.isConnected)
          this.toolTrigger.focus();
      });
    },
    async loadAppearance() {
      try {
        const [items, response, serverFonts] = await Promise.all([
          writerRequest("/app/get_writer_background_skins"),
          writerRequest("/membership/subscription").catch(() => null),
          writerRequest("/app/get_reader_fonts").catch(() => null),
        ]);
        if (Array.isArray(serverFonts)) this.fonts = readerFonts(serverFonts);
        const membership = response && response.data;
        const tier =
          membership && membership.active && membership.subscription
            ? membership.subscription.membership_type
            : "";
        this.skins = (Array.isArray(items) ? items : [])
          .map((item) => normalizeBackgroundSkin(item))
          .filter(Boolean)
          .map((skin) => ({
            ...skin,
            is_locked:
              skin.required_membership === "super"
                ? tier !== "super"
                : skin.required_membership === "standard"
                ? !["standard", "super"].includes(tier)
                : skin.is_locked,
          }));
      } catch (_) {
        this.skins = [];
      }
      const skin = this.skins.find(
        (item) =>
          item.skin_key === this.preferences.backgroundSkinKey &&
          !item.is_locked
      );
      this.preferences = { ...this.preferences, backgroundSkin: skin || null };
      if (this.preferences.fontKey && this.fonts[this.preferences.fontKey])
        this.setPreferences(this.preferences);
    },
    async setPreferences(value) {
      const skin = this.skins.find(
        (item) => item.skin_key === value.backgroundSkinKey && !item.is_locked
      );
      this.preferences = { ...value, backgroundSkin: skin || null };
      if (value.fontKey && this.fonts[value.fontKey]) {
        try {
          const family = await loadReaderFont(
            value.fontKey,
            this.fonts[value.fontKey]
          );
          if (this.preferences.fontKey === value.fontKey)
            this.preferences = {
              ...this.preferences,
              fontFamily: family || "serif",
            };
        } catch (error) {
          this.writerMessage("error", error.message);
          this.preferences = {
            ...this.preferences,
            fontKey: "",
            fontFamily: "serif",
          };
        }
      }
      value = { ...this.preferences, backgroundSkin: null };
      try {
        localStorage.setItem(
          "loghome:writer:preferences",
          JSON.stringify(value)
        );
      } catch (_) {
        this.writerMessage("warning", "浏览器无法保存偏好，本次编辑仍可使用");
      }
    },
    preview() {
      if (!this.article) return;
      try {
        this.previewKey = storeReaderPreview({
          article: { ...this.article, novel_id: this.workId },
          novel: this.novel,
        });
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
    exportCurrent() {
      if (this.article)
        downloadWriterFile(
          `${this.article.title || "章节"}.json`,
          JSON.stringify({ novel: this.novel, article: this.article }, null, 2)
        );
    },
    async restore(item) {
      if (!this.canEdit) return;
      try {
        await this.writerConfirm(
          "恢复该版本到写作稿？当前稿件会先保存为本机备份。",
          "恢复版本"
        );
        validateWriterContent({ ...this.article, content: item.content });
        await this.session.backup(true);
        if (this.realtime) {
          await this.realtime.checkpoint();
          await collaborationRequest(this.article.article_id, "replace", {
            title: item.title,
            content: item.content,
          });
        } else {
          this.article.title = item.title;
          this.article.content = item.content;
          this.session.article = this.article;
          await this.session.save(true);
        }
        this.writerMessage("success", "已恢复到写作稿");
      } catch (error) {
        if (error instanceof Error) this.writerMessage("error", error.message);
      }
    },
    async openPublish() {
      clearTimeout(this.saveTimer);
      await this.save(true);
      if (
        this.status === "conflict" ||
        this.status === "offline" ||
        this.status === "readonly" ||
        this.stateDetail
      )
        return;
      this.publishOpen = true;
    },
    async publish(options) {
      if (this.saving) return;
      this.saving = true;
      try {
        const checkpoint = this.realtime
          ? await this.realtime.checkpoint()
          : null;
        if (!this.realtime) await this.session.save(true);
        await writerPost("modify_article", {
          article_id: this.article.article_id,
          title: this.article.title,
          content: this.article.content,
          is_draft: options.mode === "now" ? 0 : 1,
          schedule_time: options.mode === "schedule" ? options.time : null,
          clear_schedule: options.mode === "schedule" ? 0 : 1,
          edit_session_id: this.session.sessionId,
          collab_revision: checkpoint ? checkpoint.revision : undefined,
          writer_create_time: writerTime(),
        });
        this.publishOpen = false;
        this.writerMessage(
          "success",
          options.mode === "schedule"
            ? "已安排定时发布"
            : options.mode === "draft"
            ? "已退回草稿"
            : "已发布章节"
        );
        await this.refreshArticles();
        await this.loadWork(false);
      } catch (error) {
        this.writerMessage("error", error.message);
      } finally {
        this.saving = false;
      }
    },
    applyCorrections(content) {
      if (!this.canEdit) return;
      this.article.content = content;
      if (this.realtime && this.$refs.editor)
        this.$refs.editor.editor.commands.setContent(
          legacyBlocksToDoc(parseLegacyContent(content))
        );
    },
    insertAi(text) {
      if (this.$refs.editor && this.canEdit) this.$refs.editor.insert(text);
    },
    replaceAi(value) {
      try {
        if (this.$refs.editor && this.canEdit)
          this.$refs.editor.replaceSelection(value.text, value.selection);
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
    insertAiImage(url) {
      if (this.$refs.editor && this.canEdit) this.$refs.editor.insertImage(url);
    },
    sendChat() {
      try {
        this.realtime.chat(this.chatDraft);
        this.chatDraft = "";
      } catch (error) {
        this.writerMessage("error", error.message);
      }
    },
    keydown(event) {
      if (this.catalogDragKey(event)) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (this.$refs.manga) this.$refs.manga.save(true);
        else this.save(true);
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "f" &&
        this.$refs.editor
      ) {
        event.preventDefault();
        this.$refs.editor.findOpen = true;
      }
      if (event.key === "Escape") this.focusMode = false;
    },
    beforeUnload(event) {
      if (
        this.article &&
        ((this.session &&
          writerSignature(this.article) !== this.session.baseline) ||
          (this.realtime && this.realtime.provider.hasUnsyncedChanges))
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    },
    pagehide() {
      if (this.session) this.session.releaseOnUnload();
    },
    online() {
      if (this.session && this.session.writable) this.save(true);
    },
  },
};
</script>
<style src="~/assets/css/writer-workspace.css"></style>
