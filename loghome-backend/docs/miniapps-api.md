# 小程序注册管理

后台入口：系统管理 → 小程序管理（`loghome-manage` 的 `/miniapps`）。在主程序 MySQL 表 `miniapps` 保存定义；游戏数据仍由独立游戏服务存 JSON。首次使用会按 `sql/miniapps.sql` 创建空表，无建表权限时先执行该 SQL。不自动填充、发布或启用任何小程序。

管理接口均使用现有管理员 JWT 鉴权：

- `GET /miniapps/manage`：全部注册信息，包含停用项。
- `POST /miniapps/manage`：注册。
- `PUT /miniapps/manage/:id`：编辑，不允许更改 ID。
- `DELETE /miniapps/manage/:id`：删除定义。

注册/编辑 JSON 示例：

```json
{
  "id": "log-defence",
  "name": "原木保卫战",
  "icon": "https://storage.codesocean.top/image/179180557296520",
  "description": "与原木账号绑定的小游戏",
  "debugUrl": "http://127.0.0.1:8787/log-defence/",
  "productionUrl": "https://miniapps.loghome.ink/log-defence/",
  "minClientVersion": 0,
  "enabled": true,
  "sortOrder": 0
}
```

示例生产域名尚待部署，请填写实际地址。图标建议使用上传后的公网 HTTPS 地址；原木保卫战和原木方块世界的默认图标已部署到图床，地址维护在 `scripts/miniapp-icon-assets.json`。仍兼容 HTTP 地址或主应用 `/static/` 路径。地址不允许携带用户名、密码或 fragment。生产入口必须使用 HTTPS。当前后台填写图标 URL，不负责上传素材。

公开读取接口（仅元数据，不签发会话）：

- `GET /miniapps`：启用项的 `id/name/icon/description`，按排序值升序排列。
- `GET /miniapps/:id?environment=debug|production`：返回该环境的 `url` 和基本信息；缺省生产环境，不返回另一个环境的地址。未注册或停用返回 404。

响应为 `{ "data": ... }`，失败为 `{ "message": ... }`；注册成功 201，非法字段 400，重复 ID 409，非管理员拒绝访问管理接口。读取禁用 HTTP 缓存，注册信息改动在下一次读取生效。

原木实验室使用独立的 `lab_entries` 表和 `/lab` 接口维护展示入口，详见 [实验室配置](lab-api.md)。注册小程序不自动加入实验室；通用容器在用户点击后台配置的入口后按 ID 查询注册信息，成功后才创建 iframe。环境由 Android APK 构建类型 / H5 构建类型决定，仍支持 `VUE_APP_MINIAPP_ENV` 显式覆盖。客户端不再保存任何小程序定义或地址回退。查询失败时禁止启动，账号票据仍使用原有登录流程，只向后台返回的入口 origin 发放。

目前停用会阻止新的容器启动，不撤销已经签发的独立游戏会话。

可执行 `node scripts/register-log-defence.cjs` 显式注册原木保卫战。脚本可通过 `LOG_DEFENCE_DEBUG_URL` 和 `LOG_DEFENCE_PRODUCTION_URL` 指定地址；已有记录时保留后台配置，不重复插入或覆盖。


`minClientVersion` 定义最低本体内部版本号（非语义版本字符串），例如 `320`，范围 0–2147483647；`0` 表示不限制。管理后台可设置，详情接口会返回此字段。既有注册记录升级时补列，默认 0，已有地址、图标和启用状态保持不变。旧编辑请求省略该字段时保留既有门槛。

仅生产模式在创建 iframe 前检查：当前版本小于最低版本时拒绝启动，且不申请登录票据；当前版本等于或大于最低版本时放行。开发模式完全跳过检查。重新加载和通过容器菜单在浏览器打开时也检查。版本优先取 Android 原生 `jsBridge.clientVersionCode`（`BuildConfig.VERSION_CODE`），旧客户端兼容读取 `jsBridge.appVersion`；版本未知且配置了门槛时拒绝启动。H5 生产构建可设置 `VUE_APP_CLIENT_VERSION_CODE` 声明本体内部版本号，否则无法确认版本的纯浏览器访问只能打开门槛为 0 的小程序。

已有表会自动补 `min_client_version` 字段；数据库账号无 ALTER 权限时，需要管理员执行：

```sql
ALTER TABLE miniapps ADD COLUMN min_client_version INT UNSIGNED NOT NULL DEFAULT 0;
```
