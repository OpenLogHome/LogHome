# 原木保卫战独立 H5 小程序

完整游戏已从主应用迁到本目录。主应用通用小程序页面 `pages/apps/miniapp.vue?id=log-defence` 只负责全屏 iframe、右上角操作胶囊、登录票据和返回。无需迁移主应用的旧 localStorage 存档。未通过原木账号鉴权时不会启动游戏。

## 启动与部署

需要 Node.js 22 或更高版本。在本目录执行：

```sh
npm ci
npm test
npm run build
node --env-file=.env server/index.cjs
```

先复制 `.env.example` 为 `.env` 并修改配置；`.env` 不入库。默认服务监听 `127.0.0.1:8787`，访问 `/log-defence/`。服务器同时提供 `dist/` 前端和 `/log-defence/api/` 接口，不需要数据库。`LOGHOME_API_URL` 是可信原木后端，不能由请求端覆盖。

使用 HTTPS 反向代理到本服务。示例（同一进程同时处理游戏和 API）：

```nginx
location /log-defence/ {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    client_max_body_size 600k;
}
```

示例代理配置会覆盖 `X-Real-IP`，可使用 `.env.example` 中的 `TRUST_PROXY=1` 按真实来源限制登录频率；直接暴露 Node 服务时必须设置为 `0`，避免信任客户端伪造的头。

此路径需要允许来自原木容器的 iframe 嵌入，不要继承 `X-Frame-Options: DENY/SAMEORIGIN`。Android 容器从本地 file:// 加载时父来源为 `null`，需在真实安卓环境验证代理的 CSP/嵌入策略，不能仅放行线上 H5 域名。`ALLOWED_PARENT_ORIGINS` 是消息接收方的来源检查，不是 CORS 配置。游戏 API 与游戏页面同源，不开放跨域访问。

## 客户端调试与地址选择

先在原木社区管理后台 **系统管理 → 小程序管理** 注册游戏。填写：

| 字段 | 原木保卫战示例 |
| --- | --- |
| 小程序 ID | `log-defence`（注册后不可修改） |
| 名称 | 原木保卫战 |
| 图标 | `/static/icons/enderman.png` 或已上传图标的 HTTP/HTTPS 地址 |
| 调试地址 | `http://127.0.0.1:8787/log-defence/` |
| 生产地址 | `https://miniapps.loghome.ink/log-defence/`（待部署，须填写实际地址） |

主程序后台在 MySQL `miniapps` 表保存注册信息，游戏玩家存档仍由独立游戏服务器保存为 JSON。主后端首次调用注册表接口会创建空表，不自动注册游戏；数据库账号无建表权限时先执行 `loghome-backend/sql/miniapps.sql`。

实验室手动维护功能入口，不加载注册的小程序列表；后台注册与实验室列表独立。入口为 `/pages/apps/miniapp?id=log-defence`，通用页面仅按 ID 从主后端获取名字、图标和当前环境的地址，不接受任意 URL 获取账号票据。未注册、停用或查询失败时不创建 iframe，也不发放登录票据。游戏原来的 `logDefense` 路由已移除。

H5 开发构建、Android debug APK 使用后台的调试地址；Android release APK、H5 生产构建使用后台的生产地址。Android 注入的 `jsBridge.isDebugBuild` 决定 APK 环境，即使 APK 内置的是生产 H5 构建也能区分。旧客户端无该字段时按 H5 构建环境选择。可用 `VUE_APP_MINIAPP_ENV=debug` 或 `production` 显式覆盖环境判断，修改此构建变量后重新构建主应用。

名称、图标和两个环境地址均由后台管理，修改后重新打开小程序即可生效，不再使用 `VUE_APP_LOG_DEFENCE_DEBUG_URL` / `VUE_APP_LOG_DEFENCE_PRODUCTION_URL` / `VUE_APP_LOG_DEFENCE_URL` 或客户端静态注册表。

在本目录执行 `npm ci`、`npm run dev` 启动本地服务。首次构建后 Node 会监测服务代码变更；修改游戏前端后需要另行执行 `npm run build`。可通过不入库的 `.env.development` 配置调试服务；默认使用项目内 `data/players` 保存测试存档，不读取生产 `.env`，仍需真实原木账号鉴权。调试服务默认连接主程序本地后端 `http://127.0.0.1:9000`；主程序使用线上后端时在 `.env.development` 中设置 `LOGHOME_API_URL=https://api.loghome.ink`，票据签发和验证必须连接同一原木后端。

安卓真机通过 USB 调试时，执行：

```sh
adb reverse tcp:8787 tcp:8787
```

这样 debug APK 使用后台注册的 `127.0.0.1:8787` 可以访问开发电脑服务。也可以在 `.env.development` 中设置 `HOST=0.0.0.0`，并将后台注册的调试地址设为开发电脑的局域网 IP；真机和电脑需互通，开放对应端口。

本地调试默认允许父来源 `null`、`http://localhost:8080`、`http://127.0.0.1:8080`。主应用开发服务使用其他域名或端口时，设置调试服务的 `ALLOWED_PARENT_ORIGINS` 为实际来源；安卓本地资源容器保留 `null`。HTTPS 主应用页面嵌入调试服务时应使用 HTTPS 调试地址，避免浏览器混合内容限制。

## 原木账号鉴权

1. 主应用保留自己的登录 token，通过现有 `/users/generate_cross_site_token` 取得 15 秒跨站票据。
2. 游戏加载后发送 `ready`，容器才申请票据，通过限定目标 origin 的消息交给游戏；主登录 token 不传给游戏页面。
3. 游戏向本服务器 `POST api/session` 提交票据。服务器调用原木后端 `/users/token_by_cross_site` 兑换，再调用受鉴权保护的 `/users/userprofile` 验证真实账号。
4. 服务器根据验证结果签发随机游戏会话，12 小时有效；主登录 token 不写磁盘、不返回游戏页面。游戏会话只保留在当前页面内存。
5. 会话在游戏服务器内存中保存，服务器重启或会话过期后须从原木重新打开。游戏服务器拒绝进程内已兑换的票据。原木现有兑换接口自身不是单次消费接口，仍应在后续通用登录升级中改成真正的单次票据。

直接打开游戏地址只显示启动说明，不提供游客游戏。“在浏览器打开”由容器重新申请短期票据，通过 URL fragment 传递；游戏启动时立即清除 fragment 后兑换。票据不能用于长期分享。

## JSON 存档

`DATA_DIR` 下每个账号一个 `用户ID.json`，同时保留上一版 `.json.bak`。目录不在静态资源目录中。客户端无法指定玩家 ID；GET/PUT 的存档归属只取服务器会话中的已验证账号。

文件包含 `schemaVersion`、`userId`、`revision`、`updatedAt` 和 `state`（村庄与基地名称）。使用临时文件、fsync、原子 rename，以及单进程按账号串行锁；版本号不匹配返回 409，不静默覆盖另一窗口的进度。损坏文件返回错误而非重置新档。

前端只保留内存工作副本，在操作后合并上传、每 30 秒结算保存，关闭前等待保存确认。网络失败显示可点击重试提示；鉴权过期或存档冲突停止游戏定时器，要求重新打开。关闭未获得保存确认时容器会提示用户是否放弃未保存进度。系统直接杀死进程时仍可能丢失最近未上传的操作。

此版本仍由客户端计算游戏规则，服务器负责鉴权、账号隔离、存档结构校验与并发保护，不属于服务端权威数值系统。当前好友/玩家市场占位功能不因存档服务而变成联机功能。对接正式交易或主应用货币前需迁移相应规则到服务器。

只运行一个游戏服务写入进程；多个进程/容器共享 DATA_DIR 时进程内锁不够。备份整个 DATA_DIR，发布前备份，遇到损坏先停服务再人工恢复 `.bak`。生产环境默认隐藏开发工具；仅 `ALLOW_DEV_TOOLS=1` 且原木后端确认管理员时显示工具，此开关不代表服务端防作弊能力。

## 项目结构与验证

- `src/Game.vue`：当前完整游戏、定时器与普通浏览器生命周期适配。
- `src/game/`、`src/i18n/`、`public/`：游戏配置、翻译和像素素材。
- `src/main.js`：启动鉴权、容器协议、保存队列与版本冲突处理。
- `server/`：Node HTTP 服务、鉴权与 JSON 原子存档。
- `test/`：游戏功能回归、账号隔离、并发版本冲突、损坏文件保护和原木后端鉴权适配测试。

保留 Vue 2.7 与现有玩法兼容，构建不依赖主应用/HBuilderX。前端依赖只用于构建，生产 Node 服务本身不需要第三方服务器框架。此版本尚未对生产原木账号或真实安卓 APK 完成端到端验收。
