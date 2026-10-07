# 头像挂件图床资源

25 个挂件原图（含 3 个 GIF）及 25 个 WebP 缩略图上传至项目现有 OceanStorage 容器。
公网地址和 SHA-256 保存在 `loghome-app-frontend/common/avatar-frame-assets.json`。
`UserAvatar.vue` 使用此清单兼容历史缓存中的 `/static/avatar-frames/` 地址。
数据库和初始化 SQL 均直接使用公网地址；本地原件保留用于重新上传和校验。

验证全部已上传素材（无上传、无数据库变更）：

```sh
node loghome-backend/scripts/upload-avatar-frames.js
```

上传新增或修改的文件，并在全部公网文件校验通过后更新数据库、初始化 SQL：

```sh
STORAGE_SERVICE_KEY=... node loghome-backend/scripts/upload-avatar-frames.js --upload --apply
```

服务密钥仅通过环境变量传入，不写入清单或日志。可用 `STORAGE_CONTAINER` 指定容器，默认沿用项目图片容器。
脚本保存上传结果以便断点重跑，每次从公开 GET 地址验证文件类型及完整字节哈希，全部通过后才事务更新目录。
只迁移清单中匹配的旧地址，不覆盖管理员另设的素材。更新前的数据库 URL 备份存放在 `_tmp/avatar-frame-urls-backup-*.json`。
在其他环境中迁移已有目录时，可使用 `--apply`，无需再次上传。新环境初始化已使用公网链接。
