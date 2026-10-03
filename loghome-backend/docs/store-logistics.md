# 商城发货通知与物流

管理员确认商城订单发货后，订单状态与系统站内通知在同一数据库事务中写入。通知链接为 `store/logistics?order_id=<订单ID>`；重复提交相同发货信息不重复发消息。通知失败则回滚发货。物流查询不自动完成商城订单，用户仍自行确认收货。

## 查询链路（2026-10-01）

默认数据源为快递网公共 HTTPS 接口：

`https://www.kuaidi.com/index-ajaxselectcourierinfo-<运单号>-<公司编码>.html`

- H5、旧版 App 和不具备原生物流能力的平台：用户端调用 `GET /store/orders/:id/logistics`，原木后端向快递网查询。
- 新版 `loghome-android`：JS Bridge 明确提供 `nativeLogisticsAvailable: true` 与 `queryStoreLogistics` 时，先通过后端取得已校验订单归属的查询元数据，再由 Android 的 OkHttp 服务访问快递网。不会先触发服务器上游查询。
- 原生能力缺失、调用异常、12 秒超时、结果格式异常、要求核验或服务不可用时，回退到原木后端。原生和服务器都无法更新时，优先保留已取得的轨迹并注明上次成功时间。
- 查件入口只保留“在浏览器中查件”：H5 打开新的浏览器页面，Android 使用系统浏览器。不再提供内嵌网页或独立的极兔官方查询按钮。

当前公共接口不要求 API Key，但没有长期免费或无限请求的承诺；不能把公共接口视作正式企业 API 的无限额度。[快递网正式 API 的免费申请规则](https://www.kuaidi.com/applyapi.html)另有每日额度及友情链接要求。当前实测带 Origin 的 GET/OPTIONS 没有允许跨域的响应头，因此 H5 不能直接读取它。

## 接口与原生桥接

`GET /store/orders/:id/logistics`：登录鉴权和订单归属校验；返回 `order` 和 `logistics`，不返回收件手机号、用户 ID 或第三方原始响应。

`GET /store/orders/:id/logistics?query=metadata`：执行相同鉴权，仅返回订单和查询状态；可查询时额外返回 `native_query: { tracking_number, shipping_company_code }`。不访问快递网，不读取物流缓存。未发货、虚拟商品、不支持的公司及无效单号不产生查询参数。旧 JT 订单缺少公司编码时，仅在 JT 加 13 位数字的明确格式下推断极兔，不修改订单。

`window.jsBridge.queryStoreLogistics(native_query)`：Android 新桥接方法，只接受运单号与受支持的公司编码；固定 HTTPS 域名，不接受 URL、手机号、Cookie 或账户 token。结果与后端使用相同字段：`status`、`provider`、`state`、`state_text`、`events`、`checked_at`、`next_query_at`、`cached`、`stale`。上游异常和查无记录分别显示，不返回第三方 HTML 页面或内部错误详情。

## 缓存与状态

服务器按服务商、公司、单号保存数据库缓存，并在事务中加锁；同一运单共享缓存。改变运单信息时清除该订单旧缓存，避免读到旧运单。Android 按公司和单号在应用私有 SharedPreferences 中缓存，跨 WebView/进程重启复用，最多保留 100 个运单，并通过互斥锁避免重复并发查询。

成功、空记录及失败均缓存 30 分钟，用户刷新不绕过缓存。两种运行环境的缓存彼此独立；原生失败触发服务器回退时，服务器可能额外查询一次。轨迹按时间倒序显示；更新失败保留上次轨迹，以 `stale` 和 `last_success_at` 标识。

状态按快递网网页自身字典解释：3 在途、4 揽件、5 疑难、6 签收、7 退签、8 派件、9 退回。保留 `provider_state`，不把快递网状态码直接当作快递100状态码。

## 部署与验证

1. 既有部署已创建 `store_logistics_cache` 时无需新迁移；首次部署运行 `npm run migrate:store-logistics`。
2. 重启后端并发布新的 H5 构建，不需要配置快递100密钥。
3. 更新 Android APK 才会具有新的原生服务能力。仅热更新网页不能向旧 APK 添加原生方法；旧版会继续走后端。

- 后端：`npm run test:store-logistics`，模拟数据库和数据源，验证发货通知事务、查询接口鉴权、元数据不查上游、固定域名、脱敏、缓存、并发、运单变更和失败保留记录。
- 前端：`node test/store_logistics_client_test.cjs`、`node test/store_tracking_test.cjs`，验证 H5/新旧原生环境、能力检测、超时及失败回退、核验状态与备用入口。
- Android：`./gradlew :app:testDebugUnitTest :app:assembleDebug`；连接测试设备后可用 `./gradlew connectedDebugAndroidTest` 验证物流解析设备测试。

本次使用用户提供的极兔单号验证公共接口返回轨迹，但尚未用真实运单验证全部公司覆盖。正式上线应关注公共数据源可用性；页面展示的状态以服务商实际返回为准。
