import { writerGet, writerPost, writerIdentity, writerRequest } from "./api";
import {
  persistWriterDraft,
  readWriterDraft,
  writerSignature,
  writerTime,
} from "./drafts";
import { validateWriterContent } from "./validate";

// One session per chapter. Never let a late response mutate another chapter.
export class WriterSession {
  constructor({
    onState = () => {},
    api = { get: writerGet, post: writerPost },
    drafts = { persist: persistWriterDraft, read: readWriterDraft },
    identity = writerIdentity(),
  } = {}) {
    this.api = api;
    this.drafts = drafts;
    this.identity = identity;
    this.onState = onState;
    this.sessionId = `pc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.article = null;
    this.baseline = "";
    this.writable = false;
    this.closed = false;
    this.saving = null;
  }
  state(status, detail = "") {
    if (!this.closed) this.onState({ status, detail });
  }
  async open(id) {
    const reader = await this.api.get("get_article", { id });
    if (!reader || Number(reader.article_id) !== Number(id))
      throw new Error("章节不存在或无权访问");
    let writer = await this.api.get("get_article_writer", { id });
    this.article = { ...reader, ...(writer || {}) };
    validateWriterContent(this.article);
    this.baseline = writerSignature(this.article);
    const access = this.article.current_access || {};
    const realtime =
      this.article.collaboration &&
      this.article.collaboration.mode === "realtime_crdt";
    if (access.can_edit_draft && !realtime) {
      try {
        await this.api.post("claim_article_edit_lock", {
          article_id: id,
          session_id: this.sessionId,
        });
        this.writable = true;
        if (!writer) {
          await this.api.post("sync_article_writer_from_reader", {
            article_id: id,
            edit_session_id: this.sessionId,
            create_time: writerTime(),
          });
          writer = await this.api.get("get_article_writer", { id });
          this.article = { ...this.article, ...writer };
          this.baseline = writerSignature(this.article);
        }
        this.heartbeat = setInterval(() => this.renew(), 20000);
      } catch (error) {
        this.state(
          "readonly",
          error.data && error.data.lock
            ? `${error.data.lock.name || "其他作者"} 正在编辑`
            : error.message
        );
        return { article: this.article, readonly: true, error };
      }
    }
    const local = await this.drafts.read(this.identity.id, id);
    this.state(realtime ? "connecting" : this.writable ? "synced" : "readonly");
    return {
      article: this.article,
      local: local && writerSignature(local) !== this.baseline ? local : null,
      readonly: !this.writable && !realtime,
    };
  }
  async renew() {
    if (this.closed || !this.writable) return;
    try {
      await this.api.post("heartbeat_article_edit_lock", {
        article_id: this.article.article_id,
        session_id: this.sessionId,
      });
    } catch (error) {
      this.writable = false;
      clearInterval(this.heartbeat);
      this.state(
        "readonly",
        `编辑锁失效：${error.message}。本机草稿已保留，请重新进入章节。`
      );
    }
  }
  async backup(snapshot = false) {
    if (this.article)
      return this.drafts.persist(
        this.identity.id,
        { ...this.article },
        this.baseline,
        snapshot
      );
  }
  async save(snapshot = false) {
    if (this.saving) {
      await this.saving;
      if (writerSignature(this.article) !== this.baseline)
        return this.save(snapshot);
      return;
    }
    await this.backup(snapshot);
    if (!this.writable || this.closed)
      throw new Error("当前章节不可写入云端，本机草稿已保留");
    const captured = { ...this.article },
      signature = writerSignature(captured);
    if (!snapshot && signature === this.baseline) {
      this.state("synced");
      return;
    }
    this.saving = this.upload(captured, signature, snapshot);
    try {
      return await this.saving;
    } finally {
      this.saving = null;
    }
  }
  async upload(captured, signature, snapshot) {
    this.state("saving");
    try {
      const remote = await this.api.get("get_article_writer", {
        id: captured.article_id,
      });
      if (remote && writerSignature(remote) !== this.baseline) {
        const error = new Error("云端内容已变化，请比较本机与云端版本后继续");
        error.remote = remote;
        throw error;
      }
      const result = await this.api.post("upload_article_writer", {
        article_id: captured.article_id,
        novel_id: captured.novel_id,
        title: captured.title,
        content: captured.content,
        create_time: writerTime(),
        is_fast_save: !snapshot,
        edit_session_id: this.sessionId,
      });
      this.baseline = signature;
      await this.backup(false);
      this.state(
        writerSignature(this.article) === signature ? "synced" : "pending"
      );
      return result;
    } catch (error) {
      this.state(error.remote ? "conflict" : "offline", error.message);
      throw error;
    }
  }
  adoptRemote(remote) {
    this.article = { ...this.article, ...remote };
    this.baseline = writerSignature(this.article);
    this.state("synced");
    return this.article;
  }
  async close() {
    clearInterval(this.heartbeat);
    await this.backup(false);
    if (this.saving) await this.saving.catch(() => {});
    this.closed = true;
    if (this.writable && this.article)
      await this.api
        .post("release_article_edit_lock", {
          article_id: this.article.article_id,
          session_id: this.sessionId,
        })
        .catch(() => {});
    this.writable = false;
  }
  releaseOnUnload() {
    if (this.writable && this.article)
      writerRequest("/essays/release_article_edit_lock", {
        method: "POST",
        keepalive: true,
        body: {
          article_id: this.article.article_id,
          session_id: this.sessionId,
        },
      }).catch(() => {});
  }
}
