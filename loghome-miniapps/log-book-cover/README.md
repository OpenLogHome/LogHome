# 书籍封面生成器（高级版）

从 `小红书_6a570695995a3800158998dc_20261012_185725_490147/app` 迁移的独立 H5 小程序，ID 为 `log-book-cover`。默认画布为 **998 × 1292 像素**，宽高均为旧版的 2 倍，保持 499:646 比例；支持自定义画布、内置模板、文字和照片、背景、图层、撤销重做及截图预览。

`vendor/` 保留原导出文件；`scripts/build.cjs` 在明确边界加入名称和保存钩子，输出 `dist/`，不修改来源目录。没有原始 Vue 工程；补丁边界变化时构建会失败。

## 书籍模板

默认选中“极简白”。`src/templates.cjs` 维护书籍模板，替换导出工具原有的社交海报模板；参考项目内 `loghome-scf-subtasks/loghome-cover-maker/cover-maker.html` 的 9 种经典风格：极简白、经典红、午夜蓝、日系轻、科技感、自然绿、夕阳变、悬疑黑和学术风。

另有 8 种艺术模板：山月留白、几何构成、蓝晒诗集、植物手记、色域回声、版画山海、梦境之门、星轨档案。书名、作者、副标题、边框与图形保留独立图层，艺术图版作为可移动或替换的图片层。图版为内置 SVG，不依赖外部图片服务；衬线字优先使用设备的宋体字体，实际字形随系统变化。选择卡、编辑画布和导出预览使用相同的实际尺寸。

新建时可输入宽高，编辑器底部“尺寸”可修改当前作品尺寸。每边支持 128–4096 的整数像素，提供“书籍默认 · 2×”恢复按钮。修改尺寸时内容等比缩放并居中，可撤销/重做；切换模板保留当前画布尺寸。不同宽高比可能出现留白，不拉伸文字和插画。

`src/book-format.cjs` 统一尺寸与坐标转换。旧 499 × 646、3:4、9:16 作品首次打开时等比适配默认尺寸；新文档带 `canvasVersion: 2`，保留自定义宽高，重新打开或保存不会被重置。文字、图层与照片引用保持，不自动套用新模板。

## 运行

Node.js ≥ 22.13，无第三方运行依赖，无需安装依赖或数据库。

```sh
cd loghome-miniapps/log-book-cover
npm test
npm start
```

本地地址：`http://127.0.0.1:8789/log-book-cover/`。也可在上级目录运行 `node start-all.js`，统一管理器自动发现本应用并先构建再启动。`npm run dev` 使用 `.env.development`；生产使用 `.env`，配置示例见 `.env.example`。调整前端后重新构建。

## 数据与容器

作品、导入的照片和缩略图保存在当前浏览器的 IndexedDB（`xhs-cover-helper`）中，不上传服务器，不与原木账号同步。同一浏览器来源的用户共用本地作品；清除网站数据、切换设备、浏览器或服务来源后无法读取原作品。导出沿用原工具的高清预览与系统截图裁剪流程。

支持 `loghome-miniapp` v1 的 `ready/init/loaded/environment/pause/back/close`。关闭或返回前等待实际 IndexedDB 保存，编辑器内返回先回作品列表；保存失败向容器报告失败。可信父来源通过 `ALLOWED_PARENT_ORIGINS` 配置，默认包含原木线上 H5、8080 调试来源和安卓的 `null` 来源。没有账号 API，不兑换容器发来的登录票据；浏览器打开时会从地址栏移除票据。

## 注册与发布

在仓库根目录执行下面的幂等脚本，为当前后端注册小程序及原木实验室入口（保留后台已有配置）：

```sh
node loghome-backend/scripts/register-log-book-cover.cjs
```

可用 `LOG_BOOK_COVER_DEBUG_URL`、`LOG_BOOK_COVER_PRODUCTION_URL` 指定首次注册的地址。主应用入口：`/pages/apps/miniapp?id=log-book-cover`。图标位于主应用 `static/icons/book-cover.svg`。

生产地址默认 `https://miniapps.loghome.ink/log-book-cover/`，需发布本目录并添加保留路径的反向代理：

```nginx
location /log-book-cover/ {
    proxy_pass http://127.0.0.1:8789;
    proxy_set_header Host $host;
}
```

不要为此路径设置禁止容器嵌入的 `X-Frame-Options`。健康检查为 `/log-book-cover/api/health`，服务只提供静态资源与只读健康接口；不存在的脚本返回 404。复制 `.env.example` 为 `.env` 后执行 `npm start`，或重启统一管理器以发现新目录。上线后检查首页、动态编辑模块和健康接口。
