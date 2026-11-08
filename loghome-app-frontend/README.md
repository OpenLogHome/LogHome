# loghome-app-frontend

此为原木社区的前端技术代码仓库。

原木社区的前端使用UniApp搭建，我们推荐使用DCloud提供的HBuilder运行此前端项目。

## 修改API的BaseURL

后端地址统一在 `main.js` 中选择，规则如下：

1. Android 原生客户端优先使用 `gradle.properties` 注入的 `backend_endpoint`；
2. 开发环境（HBuilderX 运行 / `NODE_ENV=development`）默认走本地后端（`http://127.0.0.1:9000`），生产构建默认走线上后端（`https://api.loghome.ink`）；
3. 需要在开发环境强行连远程后端（或任意自定义地址）时，用环境变量覆写即可，无需改代码：

```bash
# API 后端
VUE_APP_API_BASE_URL=https://api.loghome.ink
# 读者 AI 服务（可选）
VUE_APP_READER_AI_BASE_URL=https://ai.loghome.ink
# 协作编辑 WebSocket（可选）
VUE_APP_COLLABORATION_WS_URL=wss://ai.loghome.ink
```

在 Android 模拟器的浏览器里调试 H5 时，`127.0.0.1` 指向模拟器自身，可将 `VUE_APP_API_BASE_URL` 覆写为 `http://10.0.2.2:9000`。


