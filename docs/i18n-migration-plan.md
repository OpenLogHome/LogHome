# LogHome 三端国际化（i18n）迁移方案

> 范围：loghome-app-frontend（uni-app H5，主形态）、loghome-backend（Express）、loghome-android（WebView 壳）。
> 目标：zh-CN（默认 + 兜底）+ en（第一目标语言），架构可扩展至更多 locale。
> 依据：对三个仓库的只读全量调研（2026-08），关键数字均来自实测统计。

## 0. 现状结论（调研摘要）

| 端 | 事实 | 数字 |
|---|---|---|
| H5 前端 | 无任何 i18n 框架（无 vue-i18n）；axios 全局请求拦截器在 main.js:84-106（唯一天然 header 注入点）；后端 msg 透传展示于 42 个文件 | 需改约 190 个文件；去重词条约 2,600 条（约 5.3 万字符）；showToast/showModal 等调用点 860+；pages.json 中 115/122 个中文标题、tabBar 4 项中文；注释约 35% 不需处理 |
| 后端 | 无语言处理、无全局错误中间件；`res.json(status,{msg:'中文'})` 散落 817 个调用点；邮件走外部模板服务（email.codesocean.top templateId=3）、短信走腾讯云云端模板；站内通知 74 处 `sendMsg` 把中文原文直接写库 `user_message`；users 表无语言字段 | msg 含中文约 364 行；routes 含中文文件 20/24 |
| Android | WebView 壳（web.zip 可热更，95%+ 用户可见文案不在原生）；无任何 locale 逻辑；但 appcompat 1.7.0 已依赖、全部 Activity 继承 AppCompatActivity → 可直接用 API 24+ 的 per-app language；有现成 JS 注入管线（InjectedScriptBuilder，主题模式即走此通道） | 原生侧约 130 条：strings.xml 14 条 + Kotlin 硬编码约 96 行（13 个文件）+ 布局 24 处 |
| 跨端耦合 | 2 处「拿中文文本当逻辑判定」：`common/redstone-ui.js:11` 正则测「红石不足」、`pages/me.vue:286` indexOf('超级') 判会员等级；uview-ui/qiankun/wujie 为零引用死依赖 | 必须协议先行 |

## 1. 总体架构：一套语言协议

**语言模型**
- UI 语言随设置切换；**内容语言不随 UI 走**（小说正文、评论、TTS 中文语音模型、物流单状态原文等属于内容），此边界写入各端文档。
- 生效优先级：**账号设置（users.language） > 设备本地设置 > 系统语言 > zh-CN 兜底**。

**协议（三端一致，只增不改）**
1. 请求头 `X-Lang: zh-CN | en`，由前端唯一注入点 main.js axios 请求拦截器统一携带（与现有 appVersion/deviceFingerprint 同处）；浏览器直连后端的场景以标准 `Accept-Language` 兜底解析。
2. 本地持久化：localStorage key `loghome_language`（新约定，仿现有 `themeMode` 的 source-of-truth 模式）。
3. 原生 → H5：注入脚本暴露 `window.jsBridge.language`（InjectedScriptBuilder 新增，预热 WebView 与热更包自动覆盖）。
4. H5 → 原生：桥新增方法 `setAppLanguage(lang)`（dispatchBridgeCall 增加一个 case）。
5. 账号同步：后端新增 `GET/PUT /users/language`；登录态/profile 响应携带 `language`，登录用户覆盖本地值。
6. 错误响应新增 `code` 枚举字段（文案解耦的前置条件）。

## 2. loghome-app-frontend 方案（主战场）

### 2.1 框架接入（Phase 0）
- 引入 `vue-i18n@8`（Vue2 兼容；HBuilderX npm 方式）。
- `i18n/` 目录：`index.js` + `messages/zh-CN.json`、`messages/en.json`，按域分文件合并（common / nav / toasts / auth / me / community / writer / bookcase / store / payments / reader / settings / errors）。
- `utils/lang.js`：locale 归一化（`uni.getLocale()` 的 `zh-Hans/en`、`jsBridge.language`、`navigator.language` → `zh-CN/en`）；`setLocale(lang)` 统一执行：i18n.locale、moment.locale、`document.title`、tabBar 文案（`uni.setTabBarItem` ×4）、当前页标题（`uni.setNavigationBarTitle`）。

### 2.2 文案迁移（分批）
- 配套 `scripts/i18n-extract.js`：扫描 pages/components 中文、建议 key、输出 zh/en 覆盖率报告；剔除注释（约 35%）、`lib/utils.js` 简繁拼音表、`pca-code.json` 地址数据、vendored 组件（emoji-picker 等仅 3 处可见文案的顺手改）。
- key 命名 `域.页面.含义`；**先收敛通用词条**（确定/取消/加载中/提交失败/网络异常…），全局复用，避免 754 处 showToast 产生 754 个 key。
- 迁移顺序（每域一个 PR，配合语言开关灰度）：通用 toast/loading 收敛 → 登录注册 + 设置 + 我的 → 社区 → 写作域 → 书架/书库 → 商城/支付 → treePlant/essay/其他。
- pages.json：115 个中文标题 + 4 个 tabBar 优先试点 uni-app 内置 `%key%` 占位（项目根 `locale/` 目录，先拿 2 个页面验证 H5 端行为）；27 个 `navigationStyle: custom` 页标题在组件模板内，随 `$t` 一起迁移。**兜底方案**：若 `%key%` 受限，统一改为全局 mixin 在 onShow 里 `setNavigationBarTitle($t(...))`。
- element-ui：内置多语言组件仅约 8 处，`Vue.use(ElementUI, { i18n: (k,v) => i18n.t(k,v) })` 合并 element 语言包即可；uview/qiankun/wujie 死依赖不动。

### 2.3 与后端的衔接
- 后端 msg 透传处（130 行/42 文件）**不改**，后端按 X-Lang 返回后自动本地化。
- 两处逻辑判定必须在后端换文案**之前**改为协议驱动：
  - `common/redstone-ui.js:11` → `error.response.data.code === 'REDSTONE_INSUFFICIENT'`；
  - `pages/me.vue:286-288` → 使用 `membership.type` 字段而非中文等级名。
- 语言设置 UI：`pages/users/clientSet.vue` 新增「语言 / Language」项 → 写 `loghome_language` → `setLocale()` → `jsBridge.setAppLanguage(lang)` → 已登录则 `PUT /users/language`。

### 2.4 格式化层
- `main.js:230` 的中文 `timeConvert` → `utils/datetime.js`（Intl.RelativeTimeFormat + en/zh 表），moment 6 处调用跟随 `moment.locale`；
- 建立全局货币格式化（`{{x}}元`、提现、商城价格）：建议符号恒显 ¥、数字千分位跟随 locale（英文下 `¥1,200`），不做货币换算；
- `pca-code.json` 省市区数据英文化缓做（英文 UI 下地址保持中文，标记 TODO）。

## 3. loghome-backend 方案

### 3.1 语言解析（Phase 0，零依赖）
- `bin/lang.js`：`resolveLang(req)` = `X-Lang` > `Accept-Language`（只映射 zh-*/en，其余 zh-CN）> `req.user[0].language` > `zh-CN`；`t(req, key, params)` 做 `{{param}}` 插值；字典 `bin/locales/zh-CN.json`、`en.json`。
- 不引入全局中间件、不重构 817 个 `res.json` 调用点，按需逐路由替换——node14 + express4 老代码，最小侵入。

### 3.2 msg 目录化（与前端分域同步）
- 脚本扫描 `msg: '中文…'`（约 364 行）生成 key 清单 → 逐域替换为 `{ msg: t(req,'auth.code_sent'), code: 'CODE_SENT' }`。
- **zh-CN 字典值 = 原文**，en 缺失自动回退 zh → 中文用户零感知，可安全分批上线；en 词典由翻译填充。

### 3.3 站内通知：模板化 + 读时渲染
- `user_message` 加列 `message_key`、`message_params(JSON)`（sql/ 下按现有 execute_*.js 模式写迁移）；
- 新增 `sendMsgTpl(from, toId, key, params, router, type)`；74 处旧 `sendMsg` 分域改造；
- `/community/notifications/list` 按**接收者当前语言**渲染 key；无 key 的历史行原样显示（历史中文通知保持中文，不追溯）。

### 3.4 其他触达通道
- 邮件：外部邮件服务新增英文模板，调用处按收件人 lang 传 templateId（现硬编码 3）；
- 短信：腾讯云创建英文验证码模板，按用户语言选 TemplateId，默认中文；
- svg-captcha（字符码）、机审返回原因、物流第三方原文：只透传，不翻译；
- `bin/achievements.js` 展示标签 map（阅读时长/累计/本月…）挪入目录；成就名、FAQ、banner 等 DB 运营内容属数据层多语言，放 Phase 3。

### 3.5 账号语言
- 迁移：`ALTER TABLE users ADD COLUMN language VARCHAR(10) NULL`；
- `GET/PUT /users/language`（auth）；登录/profile 负载带 `language`。

## 4. loghome-android 方案

### 4.1 原生字符串资源化（最后做——必须跟 APK，而 H5 走热更）
- 14 条 strings.xml + 约 96 行 Kotlin 硬编码 + 24 处布局文案 → 全部资源化，新增 `values-en/`；
- 优先簇：原生听书播放器（NativeAudiobookPlayerView + 布局 + WebViewActivity 音色/倍速/睡眠定时对话框）、图片上传/裁剪/保存链路、热更新对话框、StoreLogisticsService 的**输出**文案；
- 注意：`StoreLogisticsService:57-59` 的中文正则是在解析外部快递接口返回的中文，**保留匹配逻辑，只本地化输出 message/state_text**；
- `SystemTtsEngine` 默认中文语音逻辑保留（内容语言 ≠ UI 语言）。

### 4.2 per-app language 与同步
- `AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(...))`（appcompat 1.7.0 对 API 24-32 提供兼容实现）；新增 `android:localeConfig` + `locales_config.xml`（API 33+ 系统"按应用语言"入口）与 appcompat `autoStoreLocales` metadata；
- 桥新增 `setAppLanguage`：持久化 SharedPreferences + 应用 locale + **清 NativeWebViewPool 预热池**（预热注入脚本必须重建，否则换语言后预热页带旧语言，验收项）；
- InjectedScriptBuilder 注入 `jsBridge.language`，早期脚本在 `loghome_language` 未设置时以原生生效语言播种 localStorage → 冷启动双端第一帧一致；
- 默认未设置时跟随系统（白名单 zh-CN/en）；唯一设置入口保持 H5 设置页（与主题 themeMode 同构：H5 为 source of truth）。

### 4.3 归属决策
- TTS 音色目录经 `getAvailableVoices` 回传 H5 展示：目录项加 `nameKey`，由 H5 本地化显示名（双端小改）；
- 品牌名「原木社区」（媒体通知 album、相册目录名）：建议**固定品牌不随语言变**；
- web.zip 的 `index.html` `<html lang="zh-CN">`/`<title>原木社区</title>` → 构建期/运行期动态化；
- `app_name` 增加 values-en（如 "LogHome"）。

## 5. 分阶段实施

**Phase 0 — 协议与骨架（三仓并行，约 1 周，零文案变更风险）**
- F：vue-i18n 接入、utils/lang.js、设置项 UI、空 en.json、axios 拦截器加 X-Lang；
- B：bin/lang.js + locales 骨架、users.language 列与 GET/PUT 接口、错误响应加 code、两处前端逻辑判定改协议；
- A：jsBridge.language 注入 + setAppLanguage + localeConfig（英文资源暂时只有 app_name）；
- 验收：三端语言切换贯通、冷启动一致、清池生效；所有界面此时仍全中文（en 未填）。

**Phase 1 — H5 核心域翻译（2–4 周，按域分批 PR）**
通用 → 登录/设置/我的 → 社区 → 写作 → 书架/书库 → 商城/支付 → 其余；每域合入即跑覆盖率脚本 + 伪 locale 冒烟。

**Phase 2 — 后端文案 + 通知 + Android（与 Phase 1 后段并行，约 2 周）**
msg 目录分域替换、通知模板化、邮件/短信英文模板、Android 约 130 条资源 + values-en 发版。

**Phase 3 — 运营内容与外延（另立项）**
FAQ/banner/成就名等 DB 内容多语言 + loghome-manage 后台双语录入；loghome-pc-frontend、loghome-flutter、loghome-ai-backend 复用同一 X-Lang/code 协议按需接入。

工作量量级：F 约 2,600 词条/190 文件；B 约 440 处；A 约 130 条 + 管线。建议 AI 辅助批量抽取，整体 1–2 人月量级，按域可并行。

## 6. 质量保障
- 脚本：zh/en key diff、CI 增量门禁（PR 新增行中模板/字符串禁止裸中文正则命中）；
- 伪本地化（pseudoloc 加长字符）一轮全端巡检，抓漏抽与布局截断；
- 术语表先行：原木社区 LogHome / 原木通行证 LogHome Pass / 红石 Redstone / 原木力 LogHome Power…（品牌词团队定稿后开工）；
- `fallbackLocale = zh-CN`，en 缺 key 永不白屏；
- 发布耦合：H5 文案走 hotUpdateAssets 热更、不等 APK；Android 资源必须发版——故 A 排最后，且协议字段只增不改。

## 7. 明确不做
UGC 内容翻译与检索、审核逻辑；历史中文通知追溯翻译；小程序端（manifest 有配置但 appid 为空，未实际投放）；pca-code 地址数据英文化；货币换算。

## 8. 风险与预案
| 风险 | 预案 |
|---|---|
| pages.json `%key%` 在 HBuilderX/H5 下受限 | 先 2 页试点；不行则全局 mixin onShow `setNavigationBarTitle($t(...))` |
| 后端先换文案导致两处中文判定挂掉 | 协议 code 先行于任何 en 上线（Phase 0 内完成） |
| 换语言后预热 WebView 带旧语言 | setAppLanguage 强制清池重建注入脚本，列为验收项 |
| 热更包与旧 APK 版本错配 | 语言协议字段只增不改；`loghome_language` 存于 WebView localStorage，热更替换 web/ 目录不影响 |
| 英文布局截断（按钮/导航） | 伪本地化巡检 + 关键页截图回归 |
| 翻译质量 | 术语表 + en 由 zh 回退、灰度按域开 |

## 附录：关键文件定位速查
| 改动点 | 位置 |
|---|---|
| H5 header 注入点 | `loghome-app-frontend/main.js:84-106`（axios 请求拦截器） |
| 相对时间中文实现 | `loghome-app-frontend/main.js:230-267`（timeConvert） |
| 设置页入口 | `loghome-app-frontend/pages/users/clientSet.vue` |
| 中文文本逻辑判定 ×2 | `common/redstone-ui.js:11`、`pages/me.vue:286-288` |
| 页面/标题清单 | `loghome-app-frontend/pages.json`（131 页、115 中文标题、4 tabBar） |
| 后端响应样例 | `routes/users.js:612-993` 等（res.json(status,{msg})） |
| 站内通知写库 | `bin/message.js`（sendMsg）；读取 `routes/community/notifications.js:11` |
| 邮件模板调用 | `routes/users.js:17-50`（templateId=3） |
| 短信模板 | `bin/tencent-sms.js` |
| 成就展示标签 | `bin/achievements.js:275-286` |
| 原生字符串现状 | `loghome-android/app/src/main/res/values/strings.xml`（14 条） |
| 原生硬编码集中区 | `WebViewActivity.kt:182/681-702/1533-1537/1825-1890`、`NativeAudiobookPlayerView.kt:78-140`、`StoreLogisticsService.kt:45-122`（输出部分） |
| 语言注入管线 | `loghome-android/app/src/main/java/.../web/InjectedScriptBuilder.kt:141-161` |
| 桥分发 | `WebViewActivity.kt:1147-1283`（dispatchBridgeCall） |
