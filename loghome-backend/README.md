# loghome-backend

此为原木社区的后端技术代码仓库。

原木社区的后端采用Node.js技术，主要使用的库框架为Express，使用的数据库为MySQL。

想要在本地完成后端的运行，你需要完成以下几步：

## 部署数据库

从 `LogHome-TestDb` 仓库拉取最新的数据库，并在自己的MySQL8.0+数据库上完成部署。

## 创建并修改Config.js文件

在本项目下的 `config.js`文件（如果没有则手动创建）中作如下配置：

```javascript
module.exports={
    "developerMode": true, // 将此字段设为true
    "database":{ // 在此对象内完成数据库连接信息的配置
        host: 'localhost',
        user: 'loghome-testdb',
        password: 'loghome-testdb',
        database: 'loghome-testdb',
    }
}
```

## 创建并修改SECRET.js文件

在项目文件夹`bin`下的`SECRET.js`文件（如果没有则手动创建）中作如下配置：

```javascript
module.exports = {
	SECRET: '<jwt密钥>', //jwt密钥，用于加密用户密码信息，可自行随意设置
	TencentSecretId: '<腾讯云短信服务Id>', // **可选**，在developerMode为true的情况下，不会发送短信验证码。
	TencentSecretKey: '<腾讯云短信服务Key>' // 因此只有在修改短信验证码相关逻辑时才有必要设置此字段。
};
```

## 电子书导出

电子书导出由本服务直接生成 PDF / EPUB，前端入口为 `pages/writers/exportNovel.vue`。发布时需同时更新 APP 前端和后端，后端运行 `npm ci` 安装 PDFKit、yazl，并随代码发布 `assets/fonts/` 中的中文字体。无需旧的 `subtasks/novel-export-vip.html`、Python WebSocket 导出服务或数据库迁移。

- `GET /essays/export_novel?id=作品ID&export_type=published|draft&export_format=pdf|epub`：使用现有 Authorization 登录凭证，仅作品主作者可导出；默认返回文件附件。
- 加上 `download_mode=url` 返回 `{download_url, filename, expires_in}`。`download_url` 是相对于 API 域名的路径，可由手机系统浏览器下载，无需把登录凭证传给浏览器。
- 链接为随机凭证，仅有效 15 分钟。文件缓存在当前服务进程内，总上限 128 MiB；重启服务后需重新导出。多实例部署须将生成请求和下载请求路由至同一实例，或先将缓存替换为共享存储。
- 读者版本仅包含未删除的已发布章节；存稿版本优先使用实时协作云端投影，其次使用按更新时间选择的最新存稿，没有存稿时使用章节原文。尚未同步到云端的本地编辑不会被导出。
- 站内图片支持嵌入；其他外链图片或下载失败的图片保留为文字链接。不会因为一张图片不可用而中止整本书导出。

回归验证：`npm run test:ebook`；前端测试：在前端目录运行 `node --test test/ebook_export_test.cjs`。

## 定时任务

原先独立部署为腾讯云 SCF 定时触发云函数的 `timer_loghome_*` 项目，已全部移植到本项目的 `timers/` 目录，随 `main.js` 启动后由 node-schedule 在服务进程内统一调度（时区为 `Asia/Shanghai`）。

| 原 SCF 云函数 | 移植后模块 | 作用 | 默认周期 |
| --- | --- | --- | --- |
| timer_loghome_scheduled_publish | `timers/scheduledPublish.js` | 定时发布到点章节并通知收藏用户 | 每分钟 |
| timer_loghome_treeplant | `timers/treeplant.js` | 树场经验球过期清理与自动掉落 | 每 5 分钟 |
| timer_loghome_membership | `timers/membershipRenewal.js` | 原木通行证自动续费、红石发放与到期清理 | 每 10 分钟 |
| timer_loghome_homepage_update | `timers/homepageUpdate.js` | 首页「入站必读」「原木力飙升」榜单更新 | 每小时第 45 分钟 |
| timer_loghome_search_keywords | `timers/searchKeywords.js` | 搜索关键词推荐、清理与自动分类 | 每天 04:30 |

### 配置运行周期

所有 cron 运行周期统一在 `timers/config.js` 中配置（格式：`秒 分 时 日 月 星期`），每个任务可单独设置 `enabled` 开关：

```javascript
module.exports = {
	enabled: true, // 全局总开关
	jobs: {
		scheduledPublish: { enabled: true, cron: '0 * * * * *', description: '...' },
		// ...
	},
};
```

本地调试时若不希望定时任务执行（连接池指向的是配置中的数据库），可临时整体关闭：

```bash
TIMERS_ENABLED=false npm run dev
```

### 手动执行

每个任务也可脱离 cron 手动补跑一次（原 SCF 云函数的手动调用方式）：

```bash
npm run timer:run -- <任务名>   # 任务名即 timers/config.js 中 jobs 的键
```


