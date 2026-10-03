# 拼多多商品导入

## 使用流程

管理系统「积分商城 → 商品管理 → 从拼多多导入」粘贴商品分享链接。未登录或会话失效时打开登录窗口：点击浏览器画面中的输入框，在上方输入手机号／验证码并点击「填入输入框」，再在画面中点击网站登录按钮。可以手动拖动滑块、滚动或刷新画面。登录成功后点击「确认登录并保存会话」，重新读取商品。

点击「一键导入全部规格」后，服务端重新读取商品并在一个事务中创建商品和全部规格。也可先「读取商品」预览规格和分类。每个规格的采购成本固定使用 **不含优惠券的拼单价**，兑换价为 **人民币采购成本 × 1.2 × 100**，向上取整为完整原木。原木和去皮原木按同一规则计价。

导入默认实物、下架、各规格库存 999；商品编辑页面可调整规格名称、兑换价、库存和启用状态。核对规格和发货说明后上架。价格未知或规格采集不完整时拒绝一键导入，避免漏掉规格。商品级保存平台、商品 ID、规范来源链接、商家和采集时间，各规格另存来源 SKU、券前拼单成本；来源商品／规格由唯一索引防止重复导入。

用户端详情和结算页面选择具体规格，服务端按该规格价格扣款并在事务中扣减对应库存；订单保存规格名称和采购来源快照，后续编辑不会改写历史订单。采购来源仅供管理员查看，不返回公共商品／订单接口。商品列表的价格为启用规格最低兑换价，库存为启用规格库存之和。旧版单规格商品沿用原价格和库存，不必重新创建。

## 部署

1. 在 `loghome-backend` 执行 `npm ci`，安装 Selenium JavaScript 驱动（4.18.1，兼容现有 Node 14 项目；建议运行在维护中的 Node 版本）。
2. 依次执行 `node scripts/add_store_product_import.js` 和 `node scripts/add_store_variants.js`，为现有 `store_products` 增加分类、来源元数据和唯一索引。脚本可重复执行；**必须先迁移再发布新后端**。初次建表脚本也已同步这些字段。
3. 配置下面的环境变量，或将同名字符串字段写入运行账号的 `~/.loghome/pdd-config.json`，然后重启后端。环境变量优先；可用 `PDD_CONFIG_FILE` 指定其他 JSON 文件。配置文件权限设为 0600，密钥不提交仓库。项目不自动加载 `.env`。
4. 为浏览器访问拼多多提供可用网络。默认无头 Chrome，管理员通过管理页中的实时截图完成登录，无需在服务器桌面操作。

| 环境变量 | 用途 |
| --- | --- |
| `PDD_SESSION_KEY` | 必填：32 字节随机密钥的 64 位十六进制字符串；例如通过 `openssl rand -hex 32` 生成。稳定保存，重启时复用，不提交到仓库。 |
| `PDD_SESSION_DIR` | 可选：会话文件目录，默认运行账号家目录下 `.loghome/pdd-sessions`。放在持久磁盘上，不作为静态目录、不提交仓库。 |
| `PDD_BROWSER` | `chrome`（默认）或 `edge`。 |
| `PDD_BROWSER_BINARY` | 可选：自定义 Chrome／Edge 可执行文件路径。 |
| `PDD_DRIVER_PATH` | 可选：匹配浏览器版本的 ChromeDriver／EdgeDriver 可执行文件路径。离线或自动下载失败时使用。 |
| `PDD_SELENIUM_URL` | 可选：私有 Selenium 服务地址，例如 `http://127.0.0.1:4444`；设置后使用远端浏览器。不要将 Selenium 端口暴露到公网。 |
| `PDD_HEADLESS` | 默认无头，设置 `false` 使用有界面的本机浏览器。 |

本机仅安装 Edge 时，设置 `PDD_BROWSER=edge`。匹配驱动可从 [Microsoft 官方下载页](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) 获取。旧版 Selenium Manager 的 Edge 下载地址可能不可用，此时显式设置 `PDD_DRIVER_PATH`。Chrome 配置见 [Selenium 文档](https://www.selenium.dev/documentation/webdriver/browsers/chrome/)。

同一后端进程每名管理员一个独立浏览器，最多同时 4 个，空闲 20 分钟自动关闭。所有操作受原有管理员鉴权保护；前端不传管理员 ID，后端从登录身份取得。登录窗口和采集共享同一浏览器，互斥操作，窗口未保存／关闭时拒绝启动采集。多实例部署应将 `/manage/store/pdd/*` 固定到同一实例；会话文件挂载持久存储并使用同一密钥。

## 会话保存

仅在个人中心能确认已登录后保存。Cookies 与 mobile.yangkeduo.com 的 localStorage 使用 AES-256-GCM 加密到管理员自己的文件，管理员 ID 作为附加认证数据，不能调换文件跨管理员恢复。目录／新文件权限为 0700／0600；Cookies、账号密码和完整网页状态不出现在 API 响应和日志中。截图仅用于该管理员的登录交互，接口设置 `Cache-Control: no-store`。

进程／浏览器重启后使用同一密钥恢复 Cookies 和 localStorage。网站拒绝过期会话时提示重新登录；密钥更换或文件损坏后也可以重新登录覆盖会话。无需复制管理员日常浏览器配置，也不保存密码或验证码。

## 采集边界

- 仅接受 `https://mobile.yangkeduo.com/goods1.html?ps=...` 及带数字 `goods_id` 的 goods／goods1／goods2 链接。校验目标站点和重定向，不提供任意 URL 抓取接口。
- 首选商品页内结构化状态，按链接中的商品 ID 匹配，避免误读推荐商品。支持常见 snake_case／camelCase 商品字段。
- 无结构化 SKU 时尝试打开规格选择器，依次选择组合并读取券前价；不会点击「确定」或提交订单。DOM 回退最多 40 种组合。页面结构无法解析时明确标记价格未知，管理员手动录入，绝不将未知价格当成 0。
- 结构化 snake_case 的 `group_price`／`normal_price` 按整数分转换；手机网页 camelCase 的 `groupPrice`／`normalPrice` 按人民币元解析（例如字符串 `"13.8"`）。券前拼单价与单买价分开保存，绝不使用 `skuPrice` 或 `priceDisplay` 中的券后价。已有规格但缺少采购价时仍尝试规格选择器补读，保留原来源 SKU ID。页面优惠券、账户优惠、运费和最终结算金额需要采购前复核。
- 商品主图与图库通过官方图片地址导入，未自动转存；图片链接失效／防盗链时可用现有上传组件替换。当前不提取精确来源库存，也不伪造库存。
- 分类根据关键词推荐 Minecraft／写作／其他，管理员可修改；不是完整的分类树或 AI 自动分类服务。
- 登录或风控要求人工验证时返回明确错误，通过截图窗口人工处理。账号不可登录或网站只允许 App 操作时，仍可手动新增商品。

## 验证

```sh
cd loghome-backend
node test/pdd_import_test.js
# 配置好本机 Chrome/Edge 与驱动后运行浏览器契约测试
npm run test:pdd-browser
npm run test:store-variants
```

测试覆盖链接限制、规格价格与缺货状态、汇率加价、空页面拒绝导入、重复来源标识、精确商品匹配、会话加密与管理员隔离。管理页生产构建使用项目现有构建方式；旧版 webpack 在新 Node 下需 `NODE_OPTIONS=--openssl-legacy-provider npm run build`。

真实登录测试需要管理员在新建的采集浏览器内完成一次登录。现有日常 Edge 登录状态不会自动迁入新浏览器。
