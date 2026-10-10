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
            :disabled="!access.can_add_article || loadingArticle"
            title="新建章节"
            aria-label="新建章节"
            @click="createOpen = true"
          >
            <i aria-hidden="true" class="el-icon-plus" /></button
          ><button aria-label="刷新目录" @click="refreshArticles">
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
        <nav class="catalog-list">
          <div
            v-for="item in visibleArticles"
            :key="item.article_id"
            class="catalog-item"
            :class="{
              selected: article && article.article_id === item.article_id,
              volume: item.article_type === 'spliter',
            }"
          >
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
                    · {{ (item.text_count || 0).toLocaleString() }} 字</template
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
              ><button class="catalog-menu" :aria-label="'管理 ' + item.title">
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
                  command="up"
                  :disabled="!access.can_sort_article"
                  >上移</el-dropdown-item
                ><el-dropdown-item
                  command="down"
                  :disabled="!access.can_sort_article"
                  >下移</el-dropdown-item
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
      width="760px"
      :custom-class="writerDialogClass"
      append-to-body
      ><p>本机稿件与云端不同。请先比较内容；所有版本均可导出。</p>
      <div class="conflict-comparison">
        <section>
          <h3>本机稿件</h3>
          <strong>{{ conflictLocal.title }}</strong>
          <pre>{{ conflictLocal.content }}</pre>
        </section>
        <section>
          <h3>云端稿件</h3>
          <strong>{{ conflictRemote.title }}</strong>
          <pre>{{ conflictRemote.content }}</pre>
        </section>
      </div>
      <span slot="footer"
        ><el-button @click="exportConflict">导出本机版本</el-button
        ><el-button @click="chooseRemote">使用云端版本</el-button
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
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import ChapterEditor from "./ChapterEditor.vue";
import WriterPanel from "./WriterPanel.vue";
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
    visibleArticles() {
      const query = this.query.trim().toLowerCase();
      return this.articles.filter(
        (item) =>
          (this.filter === "all" ||
            Number(item.is_draft) === (this.filter === "draft" ? 1 : 0)) &&
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
      );
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
      try {
        this.articles = await writerGet("get_articles", { id: this.workId });
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
    exportConflict() {
      downloadWriterFile(
        `${this.conflictLocal.title}-本机版本.json`,
        JSON.stringify(this.conflictLocal, null, 2)
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
        } else {
          const index = this.articles.findIndex(
              (row) => row.article_id === item.article_id
            ),
            target = index + (action === "up" ? -1 : 1);
          if (target < 0 || target >= this.articles.length) return;
          const rows = [...this.articles];
          [rows[index], rows[target]] = [rows[target], rows[index]];
          await writerPost("resort_article", {
            sortlist: JSON.stringify(
              rows.map((row, index) => ({
                article_id: row.article_id,
                article_chapter: index + 1,
              }))
            ),
          });
        }
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
