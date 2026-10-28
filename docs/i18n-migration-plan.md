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
FAQ/banner/成就名等 DB 内容多语言 + loghome-manage 后台双语录入；loghome-pc-frontend、loghome-android、loghome-ai-backend 复用同一 X-Lang/code 协议按需接入。

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

## 附录 B：P0（协议骨架）实施记录

P0 目标：三端语言协议接通，UI 全部保持中文（en 目录稀疏，后端 `t()` 缺失回退 zh，zh 用户零回归）。

### 后端 loghome-backend
- 新增 `bin/lang.js`：零依赖解析器，优先级 `X-Lang` header > `users.language` > `Accept-Language`(q 排序) > `zh-CN`；`t(req,key,params)` 支持 `{{param}}` 插值，缺失回退 zh。
- 新增 `bin/locales/{zh-CN,en}.json`：共用 key 骨架（`common.*`、`language.*`）。
- `routes/users.js`：新增 `GET/POST /users/language`（读写 `users.language`；`null`/空=跟随设备，非法值 400）。auth 中间件已 `SELECT *`，语言列随 `req.user` 可得。
- 新增 `sql/execute_users_language_column.js`（幂等 `ADD COLUMN language VARCHAR(10) NULL`）+ npm 脚本 `migrate:users-language`。
- 新增 `test/i18n_lang_test.js` + npm 脚本 `test:i18n-lang`，通过。
- ⚠️ 迁移需由你在目标库执行：`npm run migrate:users-language`（config.js 指向生产库，未代为运行）。

### 前端 loghome-app-frontend
- 引入 `vue-i18n@^8.28.2`（Vue 2.7，运行时冒烟通过）。
- 新增 `i18n/resolve.js`（纯解析：`normalizeLang/resolveEffectiveLanguage/getSavedLanguage/readStoredToken`，无循环依赖）、`i18n/index.js`（VueI18n 实例，`fallbackLocale:'zh-CN'`）、`i18n/messages/{zh-CN,en}.json`。
- 新增 `common/lang.js`：编排 locale 应用、tabBar 刷新、原生壳 `setAppLanguage` 通知、账号偏好 GET/POST 同步（账号优先覆盖本地；先落库再通知原生，避免原生重建打断请求）。
- `main.js`：axios 请求拦截器注入 `X-Lang`（单一注入点）；根实例挂载 `i18n`。
- `App.vue`：`onLaunch` 调 `initLanguage()`。
- `pages/users/clientSet.vue`：新增「语言 / Language」行 + `showActionSheet`（跟随系统/简体中文/English），回显当前偏好。
- `moment.locale` 随语言切换（现有 6 处 moment 用法均为数值比较+固定格式，locale 无关，安全）。

### 原生 loghome-android（compileDebugKotlin 通过）
- 新增 `i18n/AppLanguage.kt`：`normalize/systemLanguage/currentLanguage/save/clearSaved/applyToFramework`（`AppCompatDelegate.setApplicationLocales`，appcompat 1.7 覆盖 API 24+，33+ 联动系统设置）。
- `LogHomeApplication.onCreate`：Activity 创建前回放已存语言。
- `web/InjectedScriptBuilder.kt`：新增 `language`/`savedLanguage` 参数 → 注入 `window.jsBridge.language`，并在 H5 未落库时播种 `localStorage.loghome_language`。
- `WebViewActivity`：`rebuildInjectedScript` 传入语言；`dispatchBridgeCall` 新增 `setAppLanguage` 分支（存偏好 → `NativeWebViewPool.invalidate` 清预热池 → 重建注入脚本 → `applyToFramework`）。
- `assets/js/jsbridge.js`：新增 `language` 字段与 `setAppLanguage()`。
- `AndroidManifest.xml`：`android:localeConfig="@xml/locales_config"` + `AppLocalesMetadataHolderService`(autoStoreLocales)。新增 `res/xml/locales_config.xml`、`res/values-en/strings.xml`（14 条英译）。

### 已知遗留（非 P0 阻塞）
- `native*` 路由桥的 `withCurrentThemeBackground` 类比：预热池失效依赖既有 `NativeWebViewPool.invalidate`，冷启动首帧一致性由注入播种保证。
- 页面文案、后端各域 `msg`、站内通知/邮件/短信模板化、成就标签、`timeConvert` 相对时间均为 P1+。

## 附录 C：P1（文案迁移）实施记录 · 第一批

范围：通用词 + 登录注册域 + 设置域 +「我的」首批 + 页面标题 + 相对时间格式化 + 工具链。

### 架构约定（本批新增）
- **词条分域**：`i18n/messages/` 按域拆文件（core=common+nav、auth、settings、me、titles，zh/en 成对），`i18n/index.js` `mergeMessages()` 深合并；约定每文件顶层 key=域名，同语言零重复（脚本已验收）。
- **插值协议**：词条一律写 `{{var}}`（与后端 `bin/locales` 同构）；vue-i18n v8 运行时要单括号 `{name}`，由 `normalizeInterpolation()` 在合并时统一转换。**词条文本禁止裸花括号**（`check-sfc.js`/扫描脚本把守，孤立的 `{` 会被 v8 解析器当语法起始）。
- **页面标题**：`scripts/gen-title-map.js` 解析 pages.json → `i18n/title-map.js`（route→`titles.*`）+ `titles` 域词条；`mixins/localized-navigation.js` 页面 `onShow` 覆盖标题（`te()` 守卫），换语言即时生效；**115 路由、113 唯一标题已全部英译**（品牌词表：原木社区→LogHome、红石中心→RedStone Center、原木通行证→LogHome Pass 等）。
- **相对时间**：`common/datetime.js`：`relativeTime()` 接管 `main.js:timeConvert`（zh 输出与旧实现逐字一致）；`postTimeText()` 供时间线页复用（分钟→小时→天→`YYYY-MM-DD`，personalPage 已接入，社区批直接复用）。

### 批次内容（24 页迁移，$t 使用 8 → 349）
| 域 | 页面 | 新 key |
|---|---|---|
| common/nav | core 词典 | 25+4 |
| auth | login / login_page / _email / _mobile / external_login / forgottenPwd / register / changePwd | 93 |
| settings | clientSet(其余行) / storageManage / activateAccount×4 / change_user_info / donate / user_credit / top_pic_upload / avater_upload / pushSettings / autoSaveSettings | 104 |
| me(首批) | me.vue(会员卡/服务/安全提示) / personalPage / avatar_frames | ~60 |
| titles | 115 路由 | 113 |

- 三处行为等价改造（复验 diff 一致，zh 视觉零回归）：`avater_upload` 按钮文案兼状态机标记 → 数字状态码 + computed；`storageManage` data 列表 name/description → nameKey/descKey；`pushSettings` `bindingCode:'加载中...'` → `''`+模板占位、回调改箭头函数。
- 保留清单（验收规则）：注释、逻辑比较（`indexOf('超级')`、`treeState=='未种植'`、`msg=='登录成功'`）、URL 参数、法规备案号（苏ICP/皖公网）、QQ 昵称专名（苦力怕君/原木娘，检索用途）、语言行双语显示（「语言 / Language」，语言名用自称）。

### 验收工具与结果
- `npm run i18n:check-sfc`（SFC parse+script 语法+mustache 配对）、`i18n:extract`（覆盖率）、`i18n:titles`（标题映射+en 缺口报告）。
- 验收标准：zh 值与原文逐字节一致（对照备份/git HEAD）；en 无中文残留（专名除外）；域词典 key 双向零差集；页面 `$t` 引用全命中；五域合并双 locale 运行时冒烟+插值+回退 ✓；后端 `test:i18n-lang` ✓；`check-sfc` 24/24 ✓。
- 覆盖率基线 4333 → 3994 行（余量大头为有意保留的注释/逻辑/UGC 相邻内容）。

### 后续批次
- P1 二批：community/writer/bookcase/world/store 等域 + me 批二（achievements/badgeDetail 长描述，与后端 `bin/achievements.js` 标签一并对齐）。
- element-ui 内置文案 i18n（当前约 8 处用法，低优先）。
- 后端各域 `msg` 目录化、站内信/邮件/短信模板化（P2）。

### 生产库迁移记录
- ✅ 已执行 `npm run migrate:users-language`（`sql.ricepastem.cafe:20345/loghome`）：`users.language VARCHAR(10) NULL` 已添加，216 名存量用户全部 NULL（= 跟随设备，零影响）；脚本幂等复跑验证通过。
- 首跑遇生产库遗留列 `online_time TIMESTAMP DEFAULT '0000-00-00'` 触发严格模式整表校验失败；迁移脚本已加固为**会话级**摘除 `NO_ZERO_IN_DATE/NO_ZERO_DATE`（其余 sql_mode 保留、不改全局、不动任何既有列），后续环境可复用。

## 附录 D：P1 二批规划（移动端用户界面全量）

> 制定日期：2026-10-21。基线为 P0 + P1 一批已合入。本附录只规划 `loghome-app-frontend` 的剩余用户界面文案，不改变既有语言协议；后端/原生壳的配套仍在 P2。

### D.1 实测基线

| 指标 | 数值 | 说明 |
|---|---|---|
| 未迁移中文字面量 | 4,522 行 / 201 文件 | `npm run i18n:extract`，含注释外的数据/逻辑文案，属近似上界 |
| `$t()` 使用 | 392 处 / 29 文件 | P1 一批结束后 |
| 词条规模 | zh-CN 799 条 / en 792 条 | 6 个域文件：core、auth、settings、redstone、me、titles |
| 页面标题 | 125 路由，9 条 en 缺失 | `npm run i18n:titles` 实测 |
| 已覆盖域 | auth、settings、me 首批、users 大部分、redstone 部分 | 页面正文仍有零散残留 |
| 完全空白域 | writers、community、readers、store、membership、payments、treePlant、worlds、apps、static、manage | 以及大部分共享组件 |

按“剔除注释/style、剔除法律文本/管理页/AI 提示词后的唯一中文字符串”粗估，剩余可视 UI 文案约 **2,900 条唯一串**，去重并复用 `common` 后预计新增 **2,000 条左右 key**。其中 writers 约 790、readers 约 510、community 约 365、共享组件约 368、store/membership/payments 合计约 560、users 二批约 133。

### D.2 范围边界

**纳入**
- 普通用户可见的全部界面文案：按钮、标签、占位符、空态、表单校验、toast/modal、分享文案、权限提示、系统菜单、`aria-label`/`alt`/`title`。
- 相对时间、日期、数字/货币展示格式。
- 导航标题、tabBar、H5 `document.title`。
- 页面内由前端维护的枚举展示名（作品状态、圈子角色、订单状态等）；后端下发的状态码由前端映射。

**不纳入**
- UGC 内容：小说/章节正文、帖子/评论/私信、书名/章节名、用户名、圈子名、封面文字；内容语言不随 UI 语言变化。
- 法律文本：`pages/static/privacyAgreement.vue`、`contentAgreement.vue`；需法务确认，二批不机翻。
- 管理端：`pages/manage/*` 共 11 个路由，仅 `is_admin == 1` 可见；中文可接受，暂缓。
- AI 提示词/模型指令：`components/writer-ai/WriterAiAssistant.vue`、`pages/readers/askLogGirl.vue` 等脚本内的 prompt 常量；只迁移可见 UI，提示词英化需单独评测。
- 运营内容：FAQ、banner、公告、成就名/描述、历史站内信等 DB 内容（Phase 3）。
- 第三方/内置组件：`uni_modules/*`、quill、echarts、mescroll、z-paging、`pca-code` 地址数据。
- 未被路由引用的演示页：`pages/index/index.vue`。
- 原生 Android 字符串、后端邮件/短信模板（P2 另做）。

### D.3 批次拆分

| 批次 | 范围 | 新增词条（估） | 净工期 |
|---|---|---|---|
| 2A | 共享地基：common 收敛、共享原语、相对时间、标题补齐、审计工具 | 120–180 | 3–4 天 |
| 2B | 社区域 | 300–380 | 4–6 天 |
| 2C | 阅读 + 漫画（含书评、目录、排行、评论区） | 500–650 | 6–8 天 |
| 2D | 创作域（作品管理 + 编辑器，分两个 PR） | 600–750 | 8–10 天 |
| 2E | 商业化（通行证/红石 + 商城/支付，分两个 PR） | 400–500 | 5–7 天 |
| 2F | 外围与我的二批（创作首页/树场/世界/成就/书城/apps） | 300–400 | 4–6 天 |
| 2G | 暂缓项（管理端/法律文本/AI 提示词/运营内容） | — | 另立项 |

> 2B 与 2C 可按人力互换顺序；2D/2E 也可互换。建议先完成 2A + 2B 做一次端到端英文切片，校准术语和翻译质量后再放大。

#### 2A — 共享地基与共享原语

- `core`（`zh-CN.json`/`en.json`）扩充跨域通用词条，优先收敛现有重复串：
  - 动作：取消、删除、全部、结果、知道了、重新加载、返回、上一页、下一页、复制、分享、收藏、回复、发送、收起、展开、编辑、更多、查看全部、搜索。
  - 状态：没有更多、暂无内容、已删除、未知、公开、私密、已完结、审核中。
  - 错误：操作失败、加载失败、请先登录、参数错误、保存失败、上传失败、删除失败、网络错误。
  - 单位：部、章、字、人、天、小时、分钟；英文用 `$tc` 的 `|` 复数形式。
- 迁移共享原语：`emoji-picker`、`ge-popup`、`conflictDialog`、`xzj-readMore`、`uni-load-more`、`chunLei-modal`、`refresh`、`helang-moveVerify`、`c-ui`、`Xss-swiper`。
- 相对时间收敛：删除 `community/index`、`postDetail`、`circle`、`circleMembers`、`search`、`activityMessages`、`bookExcerpts`、`chapterEditorNew` 等页面内重复的 `formatTime`，统一走 `common/datetime.js` 的 `postTimeText`/`relativeTime`；zh 输出保持逐字一致，并补边界单测（<1 分钟、59 分钟、23 小时、29 天、30 天）。
- 标题补齐：为 `mangaInfo`、`mangaReader`、`mangaEditor`、`mangaSettings`、`rankBoard`、`miniapp`、`payments.get_logs`、`manage.community.index`、`manage.community.reports` 补 en；`i18n:titles` 必须报 0 缺失。
- H5 浏览器标题：在 `common/lang.js` 应用语言时同步 `document.title`（品牌 + 当前页标题）；`manifest.json` 的 `name`/`h5.title` 仍为品牌名，构建期不随语言变。
- 工具链：
  - 新增 `scripts/i18n-audit.js` + `npm run i18n:audit`：zh/en key 双向差集、en 中文残留（allowlist 例外）、插值变量一致性、裸花括号、同域重复、标题缺口、未引用 key（仅告警）。
  - 扩展 `i18n-extract.js`：支持按域汇总与 `--diff` 模式，用于 PR 增量门禁（新增行禁止裸中文，允许注释/白名单）。
  - 新增 `scripts/i18n-allowlist.json`：品牌/专名/QQ 昵称/法规编号等。
- 协议化前置（与后端协同）：
  - 4 处 `res.data.msg == "登录成功"` 改为 token/HTTP 状态判定。
  - 3 处 `indexOf('超级')` 判会员等级改为 `membership.type`/等级码。
  - `tree_status == '未种植'` 改为状态码：**2F 未执行**。后端仍存中文枚举（未种植/生长/开花/结果/收获），需后端加字段并迁移存量数据；前端暂保留字面量比较，详见 D.7 遗留。
  - `App.vue` 分享口令正则 `/【原木社区】([A-Z0-9]{8})，/` 改为语言无关的匹配（随 2B 落地）。

**验收**：`i18n:audit` 全绿；125 路由标题 0 缺失；相对时间单测通过；zh 视觉零回归；en 下共享组件与设置/我的页可正常切换。

#### 2B — 社区域

- 文件：`pages/community/` 下 index、postDetail、postEdit、postView、chat、circle、circleMembers、circles、createCircle、editCircle、search、friends、notifications、message、privateMessages、send_mail、read_mail、activityMessages、frame/*。
- 新词条文件：`zh-CN.community.json` / `en.community.json`，顶层 `community`。
- key 分组：`community.post.*`、`community.comment.*`、`community.circle.*`、`community.chat.*`、`community.message.*`、`community.search.*`、`community.activity.*`。
- 重点：帖子操作菜单、举报/拉黑、分享文案与口令解析、圈子角色（圈主/管理员/成员）、入圈/退圈确认、消息类型标签、空态与加载态。
- 时间线一律走 `postTimeText`；UGC 正文、评论、昵称、圈子名不翻译。
- 后端下发的系统消息/通知正文暂保持原样（P2 模板化后再按接收者语言渲染）。

**验收**：en 下走通“发帖 → 评论 → 回复 → 分享 → 入圈/退圈”主链路；分享口令在 zh/en 下都能复制和识别；布局无截断。

#### 2C — 阅读 + 漫画

- 文件：`pages/readers/` 下 bookInfo、bookComment、bookEnd、bookExcerpts、collections、tags、tagCollections、article、article_rich、newReader/article、askLogGirl、rankBoard、logPower、logPowerRank、novel_fans、mangaInfo、mangaReader、allArticles；组件 `bookMenu`、`mangaPage`、`manga-comment-item`、`manga-comment-composer`、`dl-review/item`、`ReaderBackgroundPicker`、`ReaderTypeSwitch`、`article_tools`、`audiobook-player`、`FansContributionBoard`。
- 新词条文件：`zh-CN.reader.json` / `en.reader.json`，以及 `zh-CN.manga.json` / `en.manga.json`。
- key 分组：`reader.book.*`、`reader.chapter.*`、`reader.comment.*`、`reader.rank.*`、`manga.info.*`、`manga.reader.*`、`manga.comment.*`。
- 重点：目录/上一章/下一章、字号/背景/夜间模式/翻页设置、书评与段评、排行榜、粉丝榜、空章/下架提示、漫画阅读器手势提示与无障碍标签。
- `askLogGirl` 只迁移聊天 UI；prompt 与模型指令不动。
- 内容边界：章节正文、书名、评论、粉丝昵称不翻译；匿名作者等前端默认展示文案要翻译。
- TTS 音色名由原生壳回传 `nameKey` 后再本地化（P2 原生依赖）。

**验收**：en 下打开一本真实书/一部漫画，完成阅读、评论、点赞、目录跳转；UGC 保持原文；阅读器工具栏与弹层不溢出。

#### 2D — 创作域（两个 PR）

**2D-1 作品管理**：`allArticles`、`workPublish`、`novelCollaborators`、`essaySet`、`changeEssayInfo`、`changeNovelTags`、`cover_upload`、`editNovelPics`、`essayCollaborationSettings`、`essayIndexing`、`articlesDustbin`、`sortArticles`、`scheduledTasks`、`localBackup`、`chapterTimeMachine`、`novel_statistics`、`articleFeedbacks`。

**2D-2 编辑器**：`chapterEditorNew`、`chapterEditor`、`chapterToolbarSettings`、`worldVocabularyEditor`、`mangaEditor`、`mangaSettings`；组件 `editor.vue`、`essay_toolBox`、`jin-edit`、`custom-list`、`writer_helper`、`writing-activity-calendar`、`book-detail-view`（创作首页复用）。

- 新词条文件：`zh-CN.writer.json` / `en.writer.json`；漫画部分复用 `manga` 域。
- key 分组：`writer.work.*`、`writer.chapter.*`、`writer.editor.*`、`writer.collab.*`、`writer.essay.*`、`writer.ai.*`（仅 UI）。
- 重点：编辑器工具栏/字号/弹层、保存/发布校验、分卷与排序、协作者邀请、草稿与回收站、定时任务、世界词汇表、漫画话数管理与作品设置。
- `popupMenu` 等 data 内菜单文案改为 key 数组或 computed，避免切换语言后残留旧文案。
- `WriterAiAssistant.vue` 只迁移可见 UI（会话菜单、思考过程、应用/复制/插入、空态等）；脚本内 prompt 常量加入 allowlist，不在本批翻译。
- 漫画编辑器若存在画在 canvas/图片里的中文，登记为美术资源待办，不用文本 key 硬解。

**验收**：en 下完成“新建作品 → 编辑章节 → 保存草稿 → 发布 → 协作者设置”主链路；编辑器中途切换语言不丢稿；工具栏、弹窗、校验提示无截断。

#### 2E — 商业化（两个 PR）

**2E-1 通行证/红石**：`membership/index`、`gift`、`redeem`、`rules`；`redstone/index` 残留；`membership-badge`。
**2E-2 商城/支付**：`store/index`、`detail`、`checkout`、`orders`、`logistics`、`address_list`、`address_form`；`payments/recharge`、`exchange`、`earnings`、`get_logs`、`gift_code`、`order_history`、`jump_to_pay`；`StoreVariantSheet`、`StoreVariantPicker`、`TaskRewardModal`。

- 新词条文件：`membership.json`、`store.json`、`payments.json`。
- 重点：套餐名/权益、连续包月/自动续费、赠送与兑换、商品规格、库存/售罄、地址表单、订单状态、物流、充值/提现/收益记录。
- 货币格式：符号恒为 `¥`，数字千分位跟随 locale，不做汇率换算；金额计算逻辑不动。
- `membership/rules` 属产品规则文案，可翻译，但需产品确认；法律协议仍不在此批。
- 订单/支付错误文案依赖后端 `X-Lang` + `code`，前端只做状态码到展示名的映射。

**验收**：en 下走通商品浏览 → 选规格 → 下单/结算 → 订单列表 → 物流/地址；金额与 zh 完全一致；通行证/红石页无溢出。

#### 2F — 外围与我的二批

- 创作首页与书架：`pages/essays.vue`、`pages/library.vue`、`bookcase/*`、`bookshelf-horizontal`、`book_in_case`、`home-rank-board`。
- 我的二批：`achievements`、`badgeDetail`、`me.vue` 残留；成就名/描述等后端内容仍走 P3，前端只迁移进度、获取状态、按钮、空态。
- 树场/世界：`pages/treePlant/*`、`components/plantTrees`、`pages/worlds/*`、`components/worldsPage`；`tree_status` 改状态码。
- apps/静态：`pages/apps/*`（FAQ 标题/正文为运营内容，不翻译）、`pages/static/grandUsers.vue`、`updateIntro.vue`（说明文案可译，更新日志内容可暂缓）。
- 其他小组件：`honor-badge`、`horizontal-tags`、`nothing` 等。
- 新词条文件：`tree.json`、`world.json`、`apps.json`；`me` 域扩展。

**验收**：en 下写作首页、树场、世界页、个人成就页可正常浏览；后端未翻译的成就名/活动名按 zh 回退显示，不出现裸 key。

#### 2G — 暂缓项

- `pages/manage/*`：管理员专属，等用户侧全量完成后再评估。
- 隐私政策/内容协议：建议“英文摘要 + 中文全文链接”或法务认证翻译，不做机翻。
- AI 提示词：与模型评测绑定，单独立项。
- DB 运营内容：FAQ、banner、公告、成就名/描述、历史通知。
- 原生 Android 字符串、后端邮件/短信模板：P2 另做。
- 图片内嵌中文（漫画编辑器、活动图等）：美术资源待办。

### D.4 跨批技术约定

1. **词条文件按域拆分**：每语言每域一个文件，顶层 key = 域名，互不重叠；`i18n/index.js` 的 `mergeMessages()` 负责合并。新增域文件时同步更新 import 列表。
2. **key 命名**：`域.页面.含义`，共享词条进 `common.action.*`/`common.state.*`/`common.error.*`/`common.unit.*`；禁止运行时拼接 key，动态菜单用显式映射表。
3. **插值**：词条统一写 `{{var}}`，由 `normalizeInterpolation()` 转 vue-i18n v8 的单括号；禁止裸花括号。
4. **复数**：英文用 `$tc(key, n, { n })` + `|` 形式；中文单形式。仅用于作品数、章节数、人数、天数等真实可数场景。
5. **响应式**：禁止 `data() { return { label: this.$t('...') } }`；改为 key 数组或 computed。tab 页常驻内存，切换语言后必须即时更新。
6. **共享词条优先**：同一条文案跨 3 个以上域出现才进 `common`；单域文案留在域文件，避免 `common` 膨胀。
7. **品牌与专名**：LogHome、Redstone、LogHome Pass、LogGirl、LogHome Power 等按既有术语表；不翻译用户名、法规编号、QQ 昵称、UGC 标题。
8. **时间/数字/货币**：统一走 `common/datetime.js` 和 `Intl.NumberFormat`；不引入新依赖。
9. **无障碍**：`aria-label`、`alt`、`title` 与可见文案同等对待；图像 alt 使用可翻译 key。
10. **中文逻辑判定**：新增代码禁止用中文文案做分支；既有 4 处登录判断、3 处会员等级、1 处树状态在对应批次改为协议/状态码。
11. **后端依赖**：前端英文 UI 完成后，toast/通知/订单等后端 msg 仍是中文，直到后端 P2 覆盖该域。en 公测门禁按域与后端对齐。
12. **新增页面**：任何新增 `pages.json` 中文标题必须同时跑 `i18n:titles` 并补 en，否则审计失败。

### D.5 质量门禁

每个批次合入前执行：

```bash
npm run i18n:audit            # key 差集/en 中文/插值/标题缺口
npm run i18n:extract          # 覆盖率前后对比
npm run i18n:check-sfc -- <本批 .vue 文件>
node --test test/i18n_*.cjs   # 词条结构与相对时间单测
```

- **zh 零回归**：zh 词条值必须与原文逐字节一致；改动前后截图对比。
- **en 无中文**：allowlist 之外的 en 值不得含中文；品牌/专名例外集中维护。
- **运行时**：设置页切换 zh/en/跟随系统，返回 tab 页检查标题、tabBar、动态标签、相对时间、空态；冷启动跟随系统；删除 en 某 key 验证回退 zh 不露 key。
- **布局**：375×812 与 414×896 截图；重点检查按钮、导航、底部操作栏、编辑器工具栏、商品规格弹层。
- **伪本地化**：每批至少对 3 个关键页做加长/变音巡检，抓硬编码与截断。
- **后端联调**：`curl -H 'X-Lang: en'` 验证该域接口 msg；未覆盖的接口记录为已知限制，不阻塞 UI 批次但阻塞 en 公测。
- **增量门禁**：`i18n-extract --diff` 对新增行中的裸中文报错（注释/白名单除外）；当前无 CI，先作为提交前手动检查。

### D.6 依赖与发布节奏

- **后端 P2 是 en 体验的硬依赖**：目前 `bin/locales` 仅 10 条骨架，`res.json` 中文 msg 约 364 行、站内通知 74 处 `sendMsg`、邮件/短信模板未英化。建议按前端批次同步推进：auth/common + community → reader → writer → store/payments → 通知/成就。
- **Android P2**：原生听书播放器、上传/裁剪、热更新弹窗、物流输出等约 130 条；H5 文案走热更可先发，原生壳文案随 APK。en 发布说明中注明差异。
- **en 发布策略**：先内部/管理员 → 小流量 beta → 公开；zh 保持默认。每个域在后端覆盖完成前不对外承诺“完整英文”。
- **监控**：开发环境打开 vue-i18n missing 告警；生产保持回退 zh，不白屏。发布清单加入 `i18n:audit`。

### D.7 2A–2F 实施记录（2026-10-21 起，2E/2F 于 2026-10-23 完成）

| 批次 | 状态 | 说明 |
|---|---|---|
| 2A | 完成（静态 + 单元） | 共享词条/原语、标题、H5 title、相对时间、协议化、审计工具 |
| 2B | 完成（词条 + 页面）；登录态 E2E 待测 | 19 个社区 SFC 已迁移，静态检查全绿；无可用测试账号，未走通登录后主链路 |
| 2C | 完成（词条 + 页面）；登录态 E2E 待测 | 阅读/漫画页面与共享组件迁移，新增 `reader` 393 条、`manga` 319 条；主题/榜单等动态枚举词条已覆盖 |
| 2D | 完成（词条 + 页面）；登录态 E2E 待测 | 作品管理 + 编辑器迁移，新增 `writer` 832 条；协作/工具栏/快捷输入/世界词典/漫画编辑均已接入 |
| 2E | 完成（词条 + 页面）；登录态 E2E 待测 | 通行证/红石 + 商城/支付迁移；新增 `membership` 239、`store` 232、`payments` 167，`redstone` 净增 67 |
| 2F | 完成（词条 + 页面）；登录态 E2E 待测 | 树场/世界/创作首页/书架/apps/我的二批；新增 `tree` 102、`world` 63、`library` 76、`apps` 101，`me` 净增 102 |

**2A 落地**
- `common` 域新增共享原语词条：`ge-popup` 的绑定微信/红包/版本更新弹窗、`Xss-swiper` 的“查看详情”；此前 `emoji-picker`、`conflictDialog`、`xzj-readMore`、`chunLei-modal`、`uni-load-more`、`helang-moveVerify` 已完成。
- `common/datetime.js` 统一 `relativeTime` / `recentTimeText` / `postTimeText`；新增 `test/datetime_test.mjs` 覆盖 `<1 分钟、59 分钟、23 小时、29 天、30 天`、周档开关及 en 输出。
- `common/nav-title.js` 同步 H5 `document.title`；`i18n:audit` 标题缺口为 0。
- 协议化：登录注册使用 `register_code`，邮箱绑定使用 `BIND_SUCCESS`/`EMAIL_TAKEN`/`CODE_INVALID`，会员展示按 `membership.type`/等级码，分享口令正则改为语言无关的 `/【[^】]+】([A-Z0-9]{8})[，,]/`。
- 后端配套：`loghome-backend/routes/users.js` 的注册/换绑响应新增 `code` 字段；**需与前端同批发布**，旧后端不会返回 `BIND_SUCCESS`。

**2B 落地**
- 新增 `i18n/messages/{zh-CN,en}.community.json`，顶层 `community`，329 条/语言；实际分组按页面命名（`postDetail`、`postEdit`、`index`、`circle`、`circleMembers`、`search`、`chat` 等），与 D.3 的 `post.*`/`comment.*` 草案不同，以落地文件为准。
- 覆盖 `pages/community/` 下 19 个 SFC；帖子操作、圈子角色/入圈退圈、消息中心、私信/站内信、搜索、好友、分享文案与分享口令全部走 key。
- 时间线统一走 `postTimeText`；`postDetail` 保留原“月/年”长区间行为（`{ long: true }`），zh 输出不变。
- UGC（帖子/评论/昵称/圈子名/章节正文）与后端下发的系统消息正文不翻译，en 下按 zh 原样展示。

**2C 落地**
- 新增 `i18n/messages/{zh-CN,en}.reader.json`（393 条/语言）与 `.manga.json`（319 条/语言）。`reader` 分组为 `book/article/ask/rank/power/articleList/shelf/tag`，`manga` 分组为 `info/reader/comment/editor/settings`。
- 覆盖 `pages/readers/` 下 19 个 SFC（含 `mangaInfo`/`mangaReader`）与 10 个共享组件：`article_tools`、`book-detail-view`、`bookMenu`、`custom-list` 及 `btn-list`、`dl-review/item`、`ReaderBackgroundPicker`、`ReaderTypeSwitch`、`audiobook-player`、`FansContributionBoard`。
- 动态枚举全部走 key：阅读主题 13 种（`reader.article.themes.*`）、榜单 4 块说明（`reader.rank.boardDesc.*`）、阅读背景类型/皮肤、书架与标签空态；阅读器字号/翻页模式/背景选择器与有声书入口均已接入。
- 漫画播放器、评论 composer/item、漫画编辑与设置复用 `manga` 域词条；评论正文、漫画文字、书名/章节名等 UGC 不翻译。
- 有声书缺章/不支持/打开失败三类异常改为明确提示 key，不再静默失败。

**2D 落地**
- 新增 `i18n/messages/{zh-CN,en}.writer.json`，832 条/语言；分组 `work/essay/collab/chapter/editor/world/helper/calendar/bookDetail`。
- 覆盖 `pages/writers/` 下 22 个 SFC（作品列表/统计/排序/回收站、章节编辑与工具栏、智能纠错与定时发布、协作设置、封面、标签、世界词典、本地备份、时间机器、漫画编辑/设置等）及 `editor.vue`、`jin-edit`、`essay_toolBox`、`writer_helper`、`writing-activity-calendar` 等共享组件。
- 世界词典 22 个属性、17 组属性值、写作日历与章节状态等前端枚举展示名全部走 `writer.world.attrs.*` / `writer.world.attrValues.*` / `writer.calendar.*`。
- 编辑器中 AI 提示词/模型指令、文章正文、章节内容、书名、标签名、角色名、词典词条内容保留原文（按 D.2 边界）。
- 遗留的非可视残留：编辑器 legacy 原生导航占位 `"发布 ": "publish"` 仍以中文作内部键；主题/工具/快捷输入的中文默认值是内部哨兵/回退，展示均经 key 映射；隐藏的内部 `Error` 文案与自动插入内容（如“微信号”）不面向用户。

**2E 落地**
- 新增 `i18n/messages/{zh-CN,en}.membership.json`（239 条/语言）、`.store.json`（232）、`.payments.json`（167）；`redstone` 在既有 20 条基础上净增 67 条（`redstone.page.*`、`redstone.cost.*`），共 87 条/语言。
- 通行证：`pages/membership/` 下 4 个页面（首页/赠送/兑换/规则）与 `membership-badge.vue` 全部接入；档位名、计费周期、升级/续费、兑换记录、赠送方案、规则章节走 `membership.*`，动态数组用 `*Key` 字段并在 computed/template 中取词，切换语言即时生效。
- 红石：`pages/redstone/index.vue` 与 `components/redstone-cost/RedstoneCost.vue` 接入；余额/不足/差额/兑换/开通通行证提示与明细流水走 key，余额文案支持 `{balance}` 插值。
- 商城：`pages/store/` 7 个页面与 `StoreVariantSheet`/`StoreVariantPicker`；分类/排序、规格选择、库存/售罄、结算、订单状态、物流、地址增删改查全部走 key；`value: '写作'` 为请求参数契约，保留中文。
- 支付：`pages/payments/` 7 个页面、`TaskRewardModal`、`tipping/tippingBar`；充值、原木获取、兑换、收益、礼品码、订单历史、跳转支付与打赏留言全部接入；订单状态以状态码映射展示，后端 `msg` 仍按原文兜底。
- 品牌词统一为 LogHome Pass / Super LogHome Pass / Redstone / Log；会员协议与法律文本（`rules.vue` 内服务条款）按 D.2 边界不翻译。

**2F 落地**
- 新增 `i18n/messages/{zh-CN,en}.tree.json`（102 条）、`.world.json`（63）、`.library.json`（76）、`.apps.json`（101）；`me` 域净增 102 条（成就/我的勋章 + 共享组件），累计 498 条/语言。
- 树场：`treeplant.vue`、`treeSceneSettings.vue`、`threeOakTree.vue` 接入；6 个树场主题统一映射 `tree.settings.themes.*`，成长值/经验球/每日与经验任务/串门偷取/收获弹窗/主题解锁提示全部走 key。`tree_status` 的比较值仍是后端中文枚举（见遗留）。
- 世界：`worldPage.vue`、`worldRelations.vue`、`worldsPage.vue` 接入；世界大纲/词条/关联作品/收藏/打赏/分享口令/粉丝榜/评论/关系图与创建世界弹窗全部走 key，分享文案保留 `{name}`、`{id}` 插值。
- 创作首页/书架：`essays.vue`、`library.vue`、`bookcase/index.vue`、`bookcase/manage.vue`、`bookshelf-horizontal.vue`、`book_in_case.vue`、`home-rank-board.vue` 接入；标签/空态/榜单区块/书架角标与更多入口走 key。
- 外围与我：`apps/` 9 个页面、`static/grandUsers`、`static/updateIntro`、`users/achievements`、`users/badgeDetail` 接入；`honor-badge`、`nothing`、`LogPowerWordmark` 共享组件接入 `common.badge.officialHonor`、`common.emptyState`、`common.brand.logPower`。
- 按边界保留：ICP/公网安备等备案信息、反馈页演示数据、后台 API 下发的作品/分类/成就标题与 `msg`、UGC 正文不翻译。

**验证（2A–2F 全量）**
- `npm run i18n:audit`：PASS，17 个域 zh/en 各 3922 条；未引用告警 328 条（动态拼接/历史词条）。
- `npm run test:i18n`：9/9 PASS（词典一致性、插值、en 中文残留、标题、相对时间边界）。
- `npm run i18n:check-sfc`：54 个改动 SFC（不含用户正在修改的 `pages/writers/allArticles.vue`）全部解析/语法/花括号检查通过；模板中仅剩旧批次有意的隐藏测量节点中文。
- 58 个改动 JS/Vue 文件逐条比对词典：所有字面量 `$t()` key 命中，0 真实缺失；动态前缀（树场主题 6 项、红石 AI 章节、会员 `*Key`、成就分类、商城/支付 `labelKey`）已单独核验。
- vue-i18n v8 渲染：zh/en 全部 3922 条逐 key 渲染通过；en 下无中文残留（`reader.book.realtimeRankSuffix` 的空 en 值为有意省略量词）。
- `npm run i18n:extract`：未迁移中文行 1222（2C/2D 后 2331，原始基线 4522），`$t()` 3927（2C/2D 后 2740，原始 392）。
- H5 冒烟：2A/2B 已验证 tabBar、登录页、浏览器标题与设置/我的页；2E/2F 尚未运行登录态走查与 en 截图回归。

**遗留**
- 需要隔离测试账号完成 2B–2F 端到端验收：2B 发帖/评论/入圈，2C 阅读器主题与背景切换、书架/书评/有声书，2D 章节编辑/发布/协作/封面，2E 通行证购买/赠送/兑换与商城下单/支付/物流，2F 树场主题/串门/偷取、世界创建/收藏/分享、成就与书架；同时做 zh/en 截图回归与 375/414 宽度截断检查。
- 后端协议化待做：树场 `tree_status`（未种植/生长/开花/结果/收获）、任务名 `签到`、收获提示 `/原木 × n/`、`/苹果 × n/`；成就标题/分类按中文关键词判定；后端下发的 toast、站内通知、订单/作品状态文案仍为中文。
- API 契约值保留中文：`collections.collection_title`（`最近更新`、`banner`、`原木力...`）、商城分类请求值 `写作`；en 下这些内容若来自后端仍显示中文。
- 当前 2E/2F 改动未提交，且与用户既有的 `pages/writers/allArticles.vue`、`loghome-backend/routes/essays.js` 及新增测试同工作区；提交时需按文件核对，避免混入用户改动。

### D.8 工期与下一步

- 净开发约 **7–9 周**（含每批截图回归）；AI 辅助充分、共享词条复用顺利时可压到 6 周。后端 P2 建议并行 2–3 周，en 公测以两边会合为准。
- 进度：2A–2F 全部完成（静态 + 单元验收），17 个域 zh/en 各 3922 条/语言；2E/2F 净增 1151 条（含 `common` 2 条），前端静态文案迁移已覆盖主线页面。剩余为登录态 E2E、截图回归与后端 P2 协议化。
- 提交状态：2A/2B 已提交（`06911e74`）；2C/2D 已提交（`7654be2d`）；2E/2F 与既有未提交 UI/后端改动位于同一工作区，尚未提交；提交时按文件核对，避免把用户的 `pages/writers/allArticles.vue`、`loghome-backend/routes/essays.js` 与新增测试混入批次提交。
- 下一步：用隔离测试账号完成 2B–2F 登录态走查与中英文截图回归；随后推进后端 P2（树场/成就/订单/支付状态码、系统消息本地化）与 en 公测前的法律文本、管理端范围确认。
- 待拍板：法律文本处理方式、管理端是否纳入、AI 提示词是否立项、翻译由谁终审、后端 P2 的排期优先级。
