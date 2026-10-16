# 帖子封面生成器

从 `小红书_6a903e52384ee4001594695c_20261012_185804_375349/app` 迁移的独立 H5 小程序，ID 为 `log-post-cover`。提供 1080 × 1440 画布、文字与 emoji、点击或划动文字高亮、字体选择、背景颜色与 10 种纹理、贴纸排布及 PNG 导出。

`vendor/` 保留原导出文件；构建脚本在明确边界适配名称、本地草稿和浏览器导出，不修改来源目录。没有第三方运行依赖，不需要安装依赖。

## 运行

需要 Node.js ≥ 22.13：

```sh
cd loghome-miniapps/log-post-cover
npm test
npm start
```

本地地址：`http://127.0.0.1:8790/log-post-cover/`。上级目录运行 `node start-all.js` 时会自动发现本应用，先构建再启动。已经运行的管理器需要重启以发现新目录。`npm run dev` 读取 `.env.development`，生产读取 `.env`，示例见 `.env.example`。

## 草稿与导出

草稿自动保存在当前浏览器的 localStorage（`loghome-post-cover-v1`），不上传服务器，不与原木账号同步。清除网站数据、切换设备、浏览器或服务来源后无法读取原草稿。字体使用设备已安装字体，实际字形随系统变化。

“保存图片”打开完整 PNG 预览，可下载、长按保存或截图；PNG 为 1080 × 1440 像素。内嵌 WebView 的下载和长按保存能力取决于宿主，始终可以截图。不依赖小红书 JSBridge。

支持 `loghome-miniapp` v1 的 `ready/init/loaded/environment/pause/back/close`。返回、关闭和进入后台前立即保存草稿；预览打开时返回先关闭预览。保存失败时向容器报告失败。可信父来源通过 `ALLOWED_PARENT_ORIGINS` 配置。此工具不使用账号 API，不兑换登录票据，直接在浏览器打开时移除票据 fragment。

## 注册与发布

在仓库根目录执行幂等脚本，注册小程序及原木实验室入口，保留已有后台配置：

```sh
node loghome-backend/scripts/register-log-post-cover.cjs
```

可用 `LOG_POST_COVER_DEBUG_URL`、`LOG_POST_COVER_PRODUCTION_URL` 指定首次注册地址。主应用入口为 `/pages/apps/miniapp?id=log-post-cover`，PC 入口为 `/community/miniapp/log-post-cover`，图标为主应用 `static/icons/post-cover.svg`。

生产默认地址：`https://miniapps.loghome.ink/log-post-cover/`。发布时部署本目录并配置保留路径的反向代理：

```nginx
location /log-post-cover/ {
    proxy_pass http://127.0.0.1:8790;
    proxy_set_header Host $host;
}
```

不要为此路径设置禁止容器嵌入的 `X-Frame-Options`。健康检查为 `/log-post-cover/api/health`；服务仅提供静态资源与只读健康接口，不存在的脚本返回 404。
