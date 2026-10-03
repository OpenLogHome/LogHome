# 章节实时协作实施说明

## 架构边界

- `loghome-app-frontend` 使用 Yjs、Tiptap Collaboration、Hocuspocus Provider 和 y-indexeddb。
- `loghome-ai-backend` 是唯一的长连接单实例，负责 WebSocket、鉴权、Yjs 状态持久化、旧 JSON 投影、检查点与历史恢复。
- `loghome-backend` 继续运行在云函数上，负责作品权限、发布和已有业务接口；实时文章发布时只接受带 `collab_revision` 的服务端投影。
- `articles_writer.content` 仍是原来的 `{type: "text", value, id}` / `{type: "image", img}` 数组字符串，不要求阅读端同步升级。

## 数据源与一致性

`article_collab_documents.ydoc_state` 是实时编辑源。协作服务在防抖存储时把 `body` 和 `title` 投影到一个可变的 `articles_writer` 行；显式发布检查点会额外创建不可变历史行。

段落 ID 由 `article_paragraph_id_sequences` 按文章分段预留。客户端创建或拆分段落时立即写入 `legacyId`，服务端投影只修复缺失或冲突 ID，并保留首个已有 ID，避免评论和读者锚点因整篇重编号失效。

文章的 `article_collaboration_modes.mode` 默认为 `legacy_lock`，可按文章灰度开启 `realtime_crdt`。旧模式的编辑锁、Dexie 草稿和上传协议保持不变；实时模式下旧上传接口返回 `409 realtime_collaboration_enabled`，防止旧客户端覆盖 CRDT 文档。

## 部署步骤

1. 使用 Node.js 22+ 部署 `loghome-ai-backend`，安装依赖。
2. 在该目录执行 `npm run migrate:collaboration`。
3. 开放内部端口 9101 和 9102，并由反向代理给 9102 提供 TLS WebSocket 地址。
4. 将前端 `$readerAiBaseUrl` 和 `$collaborationWsUrl` 指向部署地址。联调时可分别用 localStorage 的 `loghomeCollaborationHttpUrl`、`loghomeCollaborationWsUrl` 覆盖。
5. 由主作者调用模式接口开启单篇文章，先双人灰度，再扩大范围。

Nginx WebSocket 代理至少需要：

```nginx
location /writer-collaboration/ {
    proxy_pass http://127.0.0.1:9102/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 75s;
}
```

开启文章：

```http
POST /collaboration/articles/123/mode
Authorization: Bearer <token>
Content-Type: application/json

{"mode":"realtime_crdt"}
```

## 发布与恢复

编辑器进入发布页前先等待未确认更新归零并创建检查点。云函数的 `modify_article` 会校验 `collab_revision`，再从 `article_collab_documents.live_writer_id` 读取标题和正文，忽略客户端传来的正文；并发编辑导致 revision 改变时返回 409，要求重新检查后发布。

时间机器对实时文章调用协作服务的 `replace`，在当前 Y.Doc 上执行一次可广播事务；所有在线协作者会立即看到恢复结果。旧文章仍走原有强制上传路径。

## 当前运行约束

- 当前实现按单实例设计，不应直接启动多个协作进程。横向扩容前需要接入 Redis pub/sub、分布式文档路由或托管协作服务。
- 生产环境必须使用 `wss://`，并确保反向代理不缓存或截断 Upgrade 连接。
- 切换回旧模式前应先完成检查点，并确认没有仍在线的协作客户端。
