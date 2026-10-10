import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import {
  writerEndpoints,
  writerIdentity,
  writerRequest,
  collaborationRequest,
} from "./api";
import { ParagraphIdPluginKey } from "./extensions";
export class WriterRealtime {
  constructor(articleId, onState, onPresence, onChat) {
    this.articleId = articleId;
    this.onState = onState;
    this.onPresence = onPresence;
    this.onChat = onChat;
    const identity = writerIdentity();
    this.identity = identity;
    this.ranges = [];
    this.user = {
      id: identity.id,
      name: `作者 ${identity.id}`,
      color: ["#947358", "#3f8b7d", "#737ec0", "#ba6679"][identity.id % 4],
    };
    this.document = new Y.Doc();
    this.closed = false;
    this.connectionStatus = "disconnected";
    this.denied = false;
  }
  report(state) {
    if (!this.closed) this.onState(this.denied ? "readonly" : state);
  }
  async handleServerClose() {
    if (this.closed || this.denied || this.reconnecting || this.provider.synced)
      return;
    if (this.provider.configuration.websocketProvider.status !== "connected")
      return;
    this.report("offline");
    this.reconnecting = true;
    try {
      const status = await collaborationRequest(this.articleId, "status");
      if (this.closed) return;
      if (
        !status ||
        status.mode !== "realtime_crdt" ||
        status.can_edit === false
      ) {
        this.denied = true;
        this.report("readonly");
        return;
      }
      // Hocuspocus 4 sends a document CLOSE while retaining the transport.
      // Restart this dedicated socket so its authentication/sync handshake runs again.
      const socket = this.provider.configuration.websocketProvider;
      socket.disconnect();
      const started = Date.now();
      while (
        !this.closed &&
        socket.status === "connected" &&
        Date.now() - started < 3000
      )
        await new Promise((resolve) => setTimeout(resolve, 20));
      if (this.closed) return;
      if (socket.status === "connected") throw new Error("连接关闭超时");
      await socket.connect();
    } catch (_) {
      if (!this.closed)
        this.reconnectTimer = setTimeout(() => this.handleServerClose(), 2000);
    } finally {
      this.reconnecting = false;
    }
  }
  async open(status) {
    const name = status.document_name || `article:${this.articleId}:v1`;
    this.persistence = new IndexeddbPersistence(
      `loghome-pc-collaboration-${this.identity.id}-${name}`,
      this.document
    );
    await this.reserve();
    try {
      const profile = await writerRequest("/users/userprofile");
      this.user = {
        ...this.user,
        name: profile.name || this.user.name,
        avatarUrl: profile.avatar_url || "",
      };
    } catch (_) {}
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () =>
          reject(
            new Error("协作初次同步超时，请重试。未加载共享文档时不能编辑。")
          ),
        20000
      );
      this.provider = new HocuspocusProvider({
        url: writerEndpoints().ws,
        name,
        document: this.document,
        token: this.identity.token,
        onStatus: ({ status }) => {
          this.connectionStatus = status;
          this.report(status === "connected" ? "syncing" : "offline");
        },
        onClose: ({ event }) => {
          this.report("offline");
          if (event.reason)
            this.reconnectTimer = setTimeout(
              () => this.handleServerClose(),
              50
            );
        },
        onSynced: ({ state }) => {
          if (!state) this.report("offline");
          if (state && !this.denied) {
            clearTimeout(timer);
            this.report("synced");
            // A server CLOSE advances awareness clocks when removing peers.
            // Reannounce our user with a fresh clock after the new sync handshake.
            this.provider.setAwarenessField("user", this.user);
            this.provider.sendStateless(
              JSON.stringify({ type: "collaboration_chat_history_request" })
            );
            resolve();
          }
        },
        onUnsyncedChanges: ({ number }) =>
          this.report(
            this.connectionStatus !== "connected"
              ? "offline"
              : number
              ? "pending"
              : "synced"
          ),
        onAwarenessChange: ({ states }) =>
          this.onPresence(
            states.map((item) => ({
              clientId: item.clientId,
              ...(item.user || {}),
            }))
          ),
        onStateless: ({ payload }) => {
          try {
            const data = JSON.parse(payload);
            this.onChat(data);
          } catch (_) {}
        },
        onAuthenticationFailed: () => {
          this.denied = true;
          clearTimeout(timer);
          this.report("readonly");
          reject(new Error("协作鉴权失败，请检查权限或重新登录"));
        },
      });
    });
    this.title = this.document.getText("title");
  }
  setEditor(editor) {
    this.editor = editor;
  }
  async reserve() {
    if (this.reserving) return this.reserving;
    this.reserving = collaborationRequest(
      this.articleId,
      "paragraph-id-range",
      { size: 256 }
    )
      .then((range) => {
        if (!this.closed && range) {
          this.ranges.push({
            next: Number(range.start),
            end: Number(range.end),
          });
          if (this.editor && !this.editor.isDestroyed)
            this.editor.view.dispatch(
              this.editor.state.tr.setMeta(ParagraphIdPluginKey, "range-ready")
            );
        }
      })
      .finally(() => {
        this.reserving = null;
      });
    return this.reserving;
  }
  allocate(ids) {
    while (this.ranges.length) {
      const range = this.ranges[0];
      while (range.next <= range.end && ids.has(range.next)) range.next++;
      if (range.next <= range.end) return range.next++;
      this.ranges.shift();
    }
    this.reserve().catch(() => this.report("offline"));
    return null;
  }
  setTitle(value) {
    if (this.title.toString() !== value)
      this.document.transact(() => {
        this.title.delete(0, this.title.length);
        this.title.insert(0, value);
      });
  }
  async checkpoint() {
    if (
      !this.provider ||
      !this.provider.synced ||
      this.provider.configuration.websocketProvider.status !== "connected"
    )
      throw new Error("协作连接尚未同步，请等待连接恢复");
    this.provider.flushPendingUpdates();
    const start = Date.now();
    while (this.provider.hasUnsyncedChanges && Date.now() - start < 6000)
      await new Promise((resolve) => setTimeout(resolve, 50));
    if (this.provider.hasUnsyncedChanges)
      throw new Error("协作文档仍有未确认修改，暂时不能发布或恢复");
    return collaborationRequest(this.articleId, "checkpoint", {});
  }
  chat(content) {
    if (!this.provider.synced) throw new Error("请等待协作同步");
    this.provider.sendStateless(
      JSON.stringify({
        type: "collaboration_chat_send",
        content: content.slice(0, 2000),
      })
    );
  }
  async destroy() {
    this.closed = true;
    clearTimeout(this.reconnectTimer);
    if (this.provider) this.provider.destroy();
    if (this.persistence) await this.persistence.destroy();
    this.document.destroy();
  }
}
