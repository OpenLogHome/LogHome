# loghome-reader-ai-backend

把“问问原木娘”相关的 AI 问答和索引状态接口从原有综合后端中拆出来，单独部署到支持长连接的服务器上。

## 当前承接的接口

- `POST /library/reader_novel_ai_chat_stream`
- `POST /library/writer_text_correction`
- `GET /library/reader_novel_summary_index_status`
- `GET /healthz`

## 启动方式

```bash
npm install
npm run start
```

开发时可以直接用：

```bash
npm run dev
```

默认监听端口是 `9101`，可以通过 `PORT` 或 `READER_AI_PORT` 覆盖。

实时协作文档的 WebSocket 默认监听 `9102`。Hocuspocus 4 需要 Node.js 22 或更高版本；部署该服务时不要沿用云函数的 Node.js 20 运行时。

## 环境变量

参考 [.env.example](/F:/LogHome/loghome-reader-ai-backend/.env.example:1)。

当前 `config.js` 和 `SECRET.js` 的默认值已经按 `loghome-backend` 对齐，独立服务部署时如果不想继续复用这套默认值，再通过环境变量覆盖即可。

至少需要配置：

- `LOGHOME_DB_HOST`
- `LOGHOME_DB_PORT`
- `LOGHOME_DB_USER`
- `LOGHOME_DB_PASSWORD`
- `LOGHOME_DB_NAME`
- `UNIFIED_API_KEY`

可选但建议配置：

- `LOGHOME_MEMORY_DB`
- `READER_AI_ALLOWED_ORIGINS`
- `COLLABORATION_ENABLED`
- `COLLABORATION_ADDRESS`
- `COLLABORATION_PORT`
- `COLLABORATION_STORE_DEBOUNCE_MS`
- `COLLABORATION_STORE_MAX_DEBOUNCE_MS`
- `UNIFIED_API_BASE_URL`
- `CHAPTER_SUMMARY_MODEL`
- `IMAGE_UNDERSTANDING_MODEL`
- `READER_CHAT_MODEL`
- `LLM_CONTEXT_LIMIT_TOKENS`

## 部署建议

1. 把服务部署到专门的 Node.js 服务器上，建议用 `pm2` 或 `systemd` 常驻。
2. 反向代理层关闭响应缓冲，确保 NDJSON 流可以持续向前端推送。
3. 域名和证书就绪后，把前端的 `$readerAiBaseUrl` 指向这个新服务。
4. 如果要灰度切换，可以先用 `reader_ai_base_url_override` 本地存储覆盖前端地址做联调。
5. WebSocket 端口需要经过支持 Upgrade 的反向代理暴露为 `wss://`；同一个协作服务只能运行一个实例，除非后续再接入 Redis 广播层。

## 文本纠错

智能纠错按字数和段落数分批（默认每批不超过 2800 字 / 12 个切片），每次分析最多两批并行。超过 1400 字的段落按句末切片，保留边界重叠并将纠错位置映射回完整原文，不截断章节内容。默认关闭 DeepSeek / Qwen 的深度思考，限制输出为 4096 tokens；可通过 `.env.example` 中的 `WRITER_TEXT_CORRECTION_*` 环境变量调整。

120 秒超时按每个模型请求计算。超时、无效 JSON、输出截断或临时服务错误只重试失败批次，并尝试缩小批次；401 等不可重试错误不会反复调用。内部批次和重试共用一次红石扣费。流连接每 10 秒发送心跳，客户端离开页面时取消剩余模型请求。

NDJSON 在最终 `done` 前逐段发送 `paragraph_result`，`progress.analyzed` 仅统计已经得到有效结果的段落。前端遇到断流保留已收到的成功结果，未完成段落显示失败；“重试未完成”使用成功结果缓存。旧前端仍可读取最终 `done`，但断流保留和定向重试需要更新前端代码。

反向代理需关闭响应缓冲，并允许持续响应的长连接；心跳可防止空闲断开，不能绕过代理平台的请求总时长硬限制。

验证：`node --test test/writerTextCorrection.test.js`，以及在前端目录运行 `node --test test/writer_text_correction_stream_test.cjs`。测试使用模拟模型流，不访问真实模型或数据库。

## 实时协作

首次部署先执行数据库迁移：

```bash
npm run migrate:collaboration
```

文章默认仍使用旧编辑锁。主作者通过 `POST /collaboration/articles/:articleId/mode` 将 `mode` 设置为 `realtime_crdt` 后，该文章才会进入 Yjs 实时协作模式。实时内容会持续投影到原有 `articles_writer` JSON 格式，因此阅读器、评论锚点和已有历史接口可以继续工作。

## 代码来源

`bin/readerNovelAiChat.js`、`bin/readerNovelContextManager.js`、`bin/agentIndexing.js` 当前复用了主后端里已经跑通的实现，方便先完成服务拆分。后续如果你希望进一步解耦，可以再把公共查询逻辑和索引任务逻辑继续下沉成共享库。
