# 小程序后端统一管理

在本目录执行（Node.js ≥ 22.13，无需给管理器安装依赖）：

```sh
node start-all.js
```

脚本自动查找直属子目录中的 `package.json`，并行运行所有含 `scripts.start` 的小程序。目前启动原木保卫战（8787）和原木方块世界（8788）。管理器在前台运行，按 Ctrl+C 或发送 SIGTERM 会停止它管理的整组子进程，包括 npm、Node 服务和开发模式的 watch 进程。

各小程序的工作目录独立，生产模式读取各自的 `.env`；开发模式读取各自的 `.env.development`。应用配置优先于终端环境变量。父终端中的 `PORT`、`BASE_PATH`、`DATA_DIR` 不向子服务传递，防止服务共用端口或存档目录。

```sh
node start-all.js --dev       # 并行运行 npm run dev，包含构建与 Node watch
node start-all.js --build     # 生产模式启动前重新构建各小程序
```

生产模式下，若某个小程序有 build 脚本但没有 `dist/`，会自动先构建该小程序。原木保卫战首次使用需先在其目录执行 `npm ci` 安装现有构建依赖；管理器不自动下载依赖。构建失败只影响对应服务，其他服务继续启动。

管理器启动后，在另一个终端进入本目录执行：

```sh
node start-all.js status                 # 状态、PID、端口、健康情况、重启次数及错误
node start-all.js status --json          # JSON 状态
node start-all.js restart                # 重启全部后端
node start-all.js restart log-defence    # 重启一个后端并重新读取配置
node start-all.js stop log-miniminecraft # 停止指定后端，保持管理器运行
node start-all.js start log-miniminecraft # 启动已停止或失败的后端
node start-all.js stop                   # 停止全部后端并退出管理器
```

也可使用本目录的 `npm start`、`npm run dev`、`npm run status`、`npm run restart`、`npm run stop`。重复启动管理器会被拒绝，不会产生第二组服务。已被其他进程占用的端口会显示 `failed`，管理器不会终止那个进程。

服务异常退出时按 1、2、4、8、16 秒退避重启；60 秒内超过 5 次自动重启后标记为 `failed`。修复错误后执行 `restart` 可重置失败计数。健康检查每 5 秒执行一次，每次超时 2 秒；启动后 60 秒仍未就绪，或已就绪服务连续 3 次检查失败，会停止该服务的进程组并重启。健康检查只调用公开的只读接口，不兑换账号票据或操作存档。

状态快照保存于 `.runtime/status.json`，日志分别保存于 `.runtime/logs/<小程序ID>.log`。每份日志超过 10 MiB 后轮转为 `.log.1`，只保留一个历史文件。这些运行文件已加入 Git 忽略；快照可能来自上次运行，实时状态以 `status` 命令为准。控制通道仅监听本机回环地址，控制信息文件仅当前用户可读。

## 添加新的小程序

为新小程序创建直属目录及 `package.json`，提供 `scripts.start`。下次启动管理器时会自动发现。建议添加健康检查元数据，例如：

```json
{
  "scripts": {"start": "node --env-file-if-exists=.env server/index.cjs"},
  "miniapp": {"port": 8789, "basePath": "/my-miniapp", "healthPath": "/api/health"}
}
```

`PORT` 与 `BASE_PATH` 可被该小程序的环境文件覆盖。健康检查路径由实际 `BASE_PATH` 加上 `healthPath` 得到，成功响应应为 HTTP 2xx。未提供健康检查元数据时只维护进程状态，显示 `process-only`。开发模式还需提供 `scripts.dev`。

运行管理器测试：`npm test`。游戏各自的测试仍在各游戏目录执行。
