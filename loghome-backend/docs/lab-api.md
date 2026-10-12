# 原木实验室配置

实验室入口由独立表 `lab_entries` 维护。`miniapps` 仍只管理小程序运行配置：名称、图标、调试/生产地址、最低客户端版本。注册小程序不会自动上架实验室。

## 初始化与迁移

在仓库根目录执行：

```sh
node loghome-backend/scripts/migrate-lab-entries.cjs
```

脚本创建 `lab_entries`，将已注册的原木保卫战和原木方块世界入口迁入。重复执行会保留所有已存在的运营配置，不重新启用停用的入口、不覆盖排序或文案。首次部署没有这些小程序时会跳过对应入口，注册后可在 manage 添加。

DDL 位于 `sql/lab_entries.sql`；应用使用的数据库账号需要相应建表权限，否则先手动执行 DDL。`miniapps` 必须先存在。接口初始化只创建空表，不自动添加默认入口，因此后台删除的入口不会因刷新页面重建。

## 接口

| 方法与路径 | 权限 | 用途 |
| --- | --- | --- |
| `GET /lab` | 公开 | 客户端展示列表，仅含启用的入口和启用的关联小程序，按排序值/入口 ID 升序 |
| `GET /lab/manage` | 原木管理员 | 查看全部入口及关联小程序状态 |
| `POST /lab/manage` | 原木管理员 | 添加入口 |
| `PUT /lab/manage/:id` | 原木管理员 | 修改入口、排序和状态，入口 ID 不可变 |
| `DELETE /lab/manage/:id` | 原木管理员 | 删除展示入口，保留小程序与游戏存档 |

响应列表使用 `{data: [...]}`。公开列表不包含小程序运行地址。启动时继续由通用容器查询 `/miniapps/:id?environment=...`，检查启用状态和客户端版本后再发放票据。

入口维护 payload：

```json
{
  "id": "log-miniminecraft",
  "miniappId": "log-miniminecraft",
  "name": "原木方块世界",
  "nameEn": "LogHome Block World",
  "icon": "https://storage.codesocean.top/image/179180557442611",
  "description": "探索与建造你的方块世界，进度随账号保存",
  "descriptionEn": "Explore and build your block world with account cloud saves",
  "enabled": true,
  "sortOrder": 10
}
```

关联 ID 必须是已注册小程序。英文文案可为空，客户端此时使用中文文案。图标只接受客户端 `/static/` 路径或 HTTP/HTTPS 地址。排序值越小越靠前。启用入口关联停用小程序时，后台仍能查看和编辑，客户端不会展示。

表通过外键保持关联一致。删除被引用的小程序会返回 `409`，请先在实验室管理中删除对应入口；单纯停用小程序则隐藏相关入口并保留配置。

## manage 与客户端

manage 侧栏“系统管理”下分别提供“小程序管理” `/miniapps` 和“原木实验室管理” `/lab`，两页提供相互跳转。实验室管理支持新增、编辑、删除、展示开关、排序、中英文文案及关联小程序选择。

原木保卫战和原木方块世界的图标已上传到图床，注册与迁移脚本从 `scripts/miniapp-icon-assets.json` 读取公网 HTTPS 地址，展示不依赖主客户端本地素材。新增入口也建议使用图床 HTTPS 地址。兼容的 `/static/` 图标预览仍使用 `VUE_APP_CLIENT_URL`，默认 `https://m.loghome.ink`。

重新部署图标时，在仓库根目录执行：

```sh
# 已上传的素材仅需验证公网文件并同步数据库，无须上传凭据。
node loghome-backend/scripts/deploy-miniapp-icons.cjs --apply
# 素材变化后设置 LOGHOME_IMAGE_API_KEY，再上传并同步。
node loghome-backend/scripts/deploy-miniapp-icons.cjs --upload --apply
```

脚本将方块 SVG 按像素网格转为 PNG，验证公网图片类型及 SHA-256 后，在一个事务中仅更新两款小程序及关联实验室入口的图标字段；原 URL 备份保存在 `_tmp/miniapp-icon-urls-backup-*.json`。省略 `--apply` 时不会修改数据库。

主客户端 `pages/apps/lab.vue` 每次进入页面从 `/lab` 加载。故障时展示重试状态，不使用旧的硬编码入口回退；空列表展示空状态。后台保存后重新进入实验室即可读取最新配置。

后端部署需包含 `routes/lab.js` 并重启后端；manage 和主客户端也需重新构建发布。开发模式后端若由 nodemon 启动会自动重载。
