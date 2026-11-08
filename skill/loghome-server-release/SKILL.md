---
name: loghome-server-release
description: 原木社区服务器发版：拉取最新 git 代码，依次检测 loghome-ai-backend、loghome-backend、loghome-pc-frontend、loghome-app-frontend、loghome-miniapps、loghome-manage 是否有更新，有更新则按各自部署方式构建并重启线上 pm2 服务。用于发版、上线、部署更新、重启线上服务，或排查线上版本落后于仓库。
---

# 原木社区服务器发版

本机（Windows，E:\LogHome\LogHome）就是线上服务器：六个模块均由 pm2 常驻，仅监听回环地址，经 frpmgr `yeziyun` frp 隧道 + 边缘 Caddy 暴露公网。发版 = git pull → 按模块检测更新 → 构建/重启有更新的模块 → 验证。

## 环境速查

- PATH 默认 node 是 nvm 链接的 v16.18.0，**不要 `nvm use` 全局切换**（会影响其他在跑服务）。按命令前置对应版本目录：
  - Node 22：`C:\Users\Administrator\AppData\Local\nvm\v22.12.0`（Git Bash：`/c/Users/Administrator/AppData/Local/nvm/v22.12.0`）
  - Node 16：`C:\Users\Administrator\AppData\Local\nvm\v16.18.0`
- pm2 在 PATH 上可用。pm2 restart 会保留各进程原有解释器，无需重设。
- Webpack 4 项目（pc-frontend、manage）在 Node 22 上构建必须 `NODE_OPTIONS=--openssl-legacy-provider`。
- GitHub 直连常被重置：先直连试一次，失败则读系统代理（注册表 `HKCU\...\Internet Settings` 的 ProxyServer，当前为 127.0.0.1:7897），用 `https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 git pull ...`。

| 模块 | pm2 进程名 | 本机地址 | 公网域名 |
| --- | --- | --- | --- |
| loghome-backend | loghome-backend | 127.0.0.1:9000 | api.loghome.ink |
| loghome-ai-backend | loghome-ai-backend | 127.0.0.1:9101（WS 9102） | 经主后端/Caddy 转发 |
| loghome-pc-frontend | loghome-pc-frontend | 127.0.0.1:9001 | loghome.ink |
| loghome-app-frontend | loghome-app-frontend | 127.0.0.1:9004 | m.loghome.ink |
| loghome-miniapps | loghome-miniapps | 127.0.0.1:8787–8790 | miniapps.loghome.ink |
| loghome-manage | loghome-manage | 127.0.0.1:9008 | manage.loghome.ink |

## 发版流程

1. **预检**：`git status` 确认工作区。有未提交修改时照常继续，但绝不 stash/丢弃/覆盖；若 pull 因本地修改与来向改动重叠而拒绝，停下询问用户。记录 `OLD_HEAD=$(git rev-parse HEAD)`。
2. **拉取**：`git pull --no-rebase origin main`（本仓库沿用 merge 风格；网络失败按上文走代理）。冲突时停止并报告，不要自行取舍。无任何新提交则直接报告"已是最新"。
3. **检测更新**：对六个模块逐一执行 `git diff --name-only OLD_HEAD HEAD -- <模块目录>/`，输出为空即无更新、跳过该模块。
4. **部署**：按下文各模块步骤处理有更新的模块，先后端（backend、ai-backend）后前端。每个模块部署完立即验证，失败则停止后续模块并报告。
5. **总验证与报告**：`pm2 list` 确认六个进程 online；按下文各模块验证命令检查；汇报拉取的提交范围、各模块"有更新已部署 / 无更新跳过 / 失败"及验证结果。未实际访问公网域名就不要声称公网验证通过。

## 各模块部署方式

### loghome-backend（Express + MySQL，Node 22）

入口 main.js，端口 9000，配置在 config.js / SECRET.js（git 忽略，勿动）。定时任务随进程内置启动。

```sh
cd loghome-backend
# 仅当 package.json 有变更时（用 Node22 的 npm）：
PATH="/c/Users/Administrator/AppData/Local/nvm/v22.12.0:$PATH" npm install
pm2 restart loghome-backend
```

若 diff 含新增 sql/ 建表脚本或迁移脚本变更，先向用户确认再执行对应 `npm run migrate:*`（`npm run` 可列出），不要擅自改线上数据库。
验证：`pm2 logs loghome-backend --lines 20 --nostream` 无报错；`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:9000/miniapps` 返回 200。

### loghome-ai-backend（Express + Hocuspocus 协作，Node 22）

入口 main.js，HTTP 9101、协作 WebSocket 9102，配置 .env / config.js / SECRET.js。协作服务只能单实例。

```sh
cd loghome-ai-backend
# 仅当 package.json 有变更时：
PATH="/c/Users/Administrator/AppData/Local/nvm/v22.12.0:$PATH" npm install
pm2 restart loghome-ai-backend
```

仅首次部署协作功能缺表时才需 `npm run migrate:collaboration`（另依赖主后端 sql/novel_reader_ai_settings.sql），日常发版不执行。
验证：`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:9101/` 非连接拒绝；`pm2 logs loghome-ai-backend --lines 20 --nostream` 无报错。

### loghome-pc-frontend（Nuxt 2 SSR，运行时 Node 16）

`.nuxt` 已 git 忽略，服务器本地构建后 pm2 跑 `nuxt start --port 9001 --hostname 127.0.0.1`。

```sh
cd loghome-pc-frontend
# 仅当 package.json 有变更时：
PATH="/c/Users/Administrator/AppData/Local/nvm/v22.12.0:$PATH" npm install
PATH="/c/Users/Administrator/AppData/Local/nvm/v22.12.0:$PATH" NODE_OPTIONS=--openssl-legacy-provider npm run build
pm2 restart loghome-pc-frontend
```

构建耗时数分钟，用后台执行或放宽超时。**构建失败则不 restart**（避免载入半成品产物），报告错误。
验证：`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:9001/` 返回 200。

### loghome-app-frontend（uni-app H5，纯静态）

pm2 跑 static-server.js（127.0.0.1:9004），按请求读盘 `unpackage/dist/build/web`，html 为 no-cache。该 dist **被 git 跟踪，远程提交直接携带构建产物**。

- 更新含 `unpackage/dist/build/web/` → pull 后即时生效，**无需构建、无需重启**。
- 仅源码变更而 dist 未更新 → 需 HBuilderX 发行 Web 重建该目录（CLI `publish web`，参照 skill/loghome-android-release/SKILL.md 的约束）；HBuilderX 不可用时报告用户，不得用开发模式编译或旧产物冒充。

验证：`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:9004/` 返回 200。

### loghome-miniapps（管理器 + 多个子服务，Node 22）

pm2 单进程 loghome-miniapps 跑 start-all.js 管理器，拉起各子项目（log-defence 8787、log-miniminecraft 8788、log-book-cover 8789、log-post-cover 8790、log-arena）。每次启动/重启子服务自动重新构建。管理命令必须用 Node 22 执行（PATH 默认 Node 16 不识别子服务的 --env-file-if-exists）：

```sh
cd loghome-miniapps
N22="/c/Users/Administrator/AppData/Local/nvm/v22.12.0/node.exe"
"$N22" start-all.js status                      # 查看各子服务状态
"$N22" start-all.js restart <变更的子项目ID>     # 自动重建并重启该子服务
```

按 diff 路径 `loghome-miniapps/<子项目ID>/` 确定变更子项目，逐个 restart；start-all.js、ecosystem.config.cjs 等共享文件变更则 `pm2 restart loghome-miniapps`（全量重建重启）。
已知存量问题（非发版引入，报告即可，勿顺手修改）：log-arena 构建失败，且与 log-book-cover 同声明端口 8789 互相冲突，两者长期 failed。
验证：`node -e "console.log(JSON.stringify(require('./.runtime/status.json').apps.map(a=>({id:a.id,state:a.state,health:a.health}))))"`，变更子服务应为 running/healthy。

### loghome-manage（Vue2 管理后台，构建后纯静态）

`npm run build` 产出 dist/，pm2 跑 static-server.js（127.0.0.1:9008）。ecosystem.config.js 与 static-server.js 目前是本地未跟踪文件，勿删；进程缺失时 `pm2 start ecosystem.config.js` 拉起。

```sh
cd loghome-manage
# 仅当 package.json 有变更时：
PATH="/c/Users/Administrator/AppData/Local/nvm/v22.12.0:$PATH" npm install
PATH="/c/Users/Administrator/AppData/Local/nvm/v22.12.0:$PATH" NODE_OPTIONS=--openssl-legacy-provider npm run build
pm2 restart loghome-manage
```

构建失败则不 restart。验证：`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:9008/` 返回 200。

## 关键约束

- 只 restart 有更新模块对应的 pm2 进程；本机还有大量无关服务（meowid、flyondeck、TTS 等），一律不动。
- 不修改 frp/Caddy 配置、不 `pm2 save`（除非本次确实变更了进程注册）、不 git push、不提交代码，除非用户明确要求。
- 不全局切换 Node 版本；安装/构建命令按上文前置对应版本目录。
- 任一模块部署失败：停止后续模块，保留现场与日志，报告失败原因；不要为消除报错而重启无关服务或删文件。
- 发版完成后如需公网抽查，可 curl 上表域名（本机经边缘回环可达），但要在报告中区分本机验证与公网验证。