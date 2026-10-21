# 登录页「原木之门」实现复核 · 2026-10-21

final result: passed

## 参考与实现

- Source visual truth: `/Users/ricepastem/.codex/generated_images/01a15965-d847-7e32-9dce-87ace7262d7c/exec-412ebc66-1313-4cff-93b3-714f6925fe08.png`，853 × 1844 px。
- 用户最后修订：副标题为「一个属于 Minecraft 同好们的二创社区」，句末不加句号；主标题保持「方块跃然纸上，」「故事在此生长。」。
- Brand reference: `/var/folders/zw/_lr62b2s79g3m5ytxlznt01m0000gn/T/codex-clipboard-a478b769-b20d-4c93-b297-d9a7287b02a5.png`。直接保存原字标，以图像颜色滤镜和 screen 混合呈白色，保留橙色 app 图标。
- 页面: `pages/users/login.vue`；文案: `i18n/messages/{zh-CN,en}.auth.json`。
- 正式素材: `static/login/forest-bookshop.webp`（853 × 1844，约280 KiB），`static/login/pixel-login-button.webp`（2161 × 728，约375 KiB），`static/login/brand-wordmark.png`；源 PNG 同目录保留。使用内置 imagegen 编辑拆出背景和空白按钮，完整提示词见 `../output/login-redesign-qa/asset-prompts.txt`、`button-prompt.txt`。
- 本地预览: http://127.0.0.1:8922/preview；使用现有 UniApp 开发服务8080和独立测试代理，未提交真实账号或发送验证码。
- CSS viewport: 390 × 844；未勾选协议、中文、统一插画配色。另检查 320 × 680 深色环境和英文布局。
- Implementation screenshot: `../output/login-redesign-qa/login-mobile.png`（390 × 844）。
- 外层浏览器1280 × 720，iframe390 × 844，x=437.5；CUA输出1265 × 712。截图按实际缩放比例裁切并归一，分别记录外层scrollY=0和124；以顶部720 CSS px + 底部124 CSS px拼接。应用内部没有滚动或变更状态，截图没有用作页面素材。
- 全幅对照: `../output/login-redesign-qa/comparison-final.png`；局部对照: `focus-comparison-final.png`（字标、主标题、按钮、协议）。左参考、右实现。

## Findings 与比较历史

- 首轮 [P2，已修复] 主标题比参考约窄20px、低4px。将字号9.2vw调至9.9vw，标题容器top10.7%调至10.1%，行高1.25调至1.18。首轮证据 `comparison-first.png`，修复后 `comparison-final.png`。
- 无未解决 P0/P1/P2。构图、角色、书屋、可操作登录入口、文案与参考保持一致；指定副标题句末句号已去掉。
- [P3] 主标题末尾小芽装饰未单独拆出；正文使用系统中文粗体，按设备可有轻微字形差异。按钮信封使用项目 uni-icons，形状比视觉稿的像素信封平滑。这些不影响交互或主要视觉层级。

## 五项必要复核

- 字体：两行标题、增长绿色强调、较小浅绿副标题、深绿按钮文字，字标采用用户原图；未将界面文字烘焙进背景。窄屏中英文无裁切，协议可换行。
- 间距：390 × 844 中标题、角色、按钮与协议所占区域对齐参考；320 × 680 主要控件完整可见。极短屏使用min-height640px，允许滚动到操作区；安全区使用现有 --loghome-safe-* 变量。
- 颜色：标题米白、强调#8FDF70、森林深绿与书屋暖黄、下方#F8F8F8浅雾保持视觉稿。插画固定色调；不被系统深色模式改写。
- 图像：背景和按钮由选定稿经内置 imagegen 编辑得到，保留木牌上的原生绘字和角色；高质量WebP交付。截图本身有CUA缩放/压缩，未将其误判为生产素材清晰度问题。
- 文案：两行主标题和无句号副标题逐项核对；按钮「使用邮箱登录」，协议「我已阅读并同意《隐私政策》」。中英文新增key均可解析。

## 交互、可访问性与工程检查

- 未勾选点击登录：保持当前路由，出现原有同意提示及短时抖动。
- 隐私链接：进入原有 `pages/static/privacyAgreement`，可返回，不自动勾选协议。
- 勾选后点击：进入原有 `pages/users/login_page_email`，显示邮箱输入和下一步；未填写/提交邮箱。
- 键盘：协议空格切换，ARIA checkbox 0→1；登录按钮回车跳转成功。按钮/复选框有可访问角色与焦点样式。
- 返回：独立打开登录页时可返回 `pages/library`；保留原生桥接navigateBack判断。
- 装饰动画无JS循环，forest-glow轻微明暗呼吸；prefers-reduced-motion关闭，按下反馈为短时位移。页面销毁清理协议提示计时器。
- 模板编译、Sass编译、中英JSON解析、SFC检查、本次文件 `git diff --check` 通过。
- 已检查浏览器日志：开发代理存在原有WDS Host/Origin、SockJS版本不匹配及断连日志；没有观察到登录页渲染或路由交互异常。未声称控制台全无报错。
- 未在真实Android/iOS设备验证原生桥接返回与系统安全区，沿用原有桥接条件与安全区变量；这属于环境验证范围限制。

## Implementation Checklist

- [x] 原木娘森林书屋背景与独立按钮素材落盘。
- [x] 可编辑文案、原字标、原登录/隐私路由及勾选校验。
- [x] 窄屏、中英文、键盘、提示与导航检查。
- [x] 全幅与局部对照；修复主要字距/位置差异。

---

# 先前页面复核记录（保留）

# 移动端「我的」页面复核（横排与百分比修订）

final result: passed

## 当前验收范围

- 原顶部封面、资料与通行证继续保留。
- 白色卡片中四列等宽排列：名片、好友、消息、设置；图标在上，名称在下。
- 钱包内树场顶部显示成长百分比，百分号使用较小字号；移除树图标、红点与底部进度条，保留红色「可签到」。
- 收藏箱沿用现有 SVG 素材重新绘制，使用与其余服务图标相近的米白、浅棕像素配色和比例。

## 参考与证据

- Source visual truth：`/var/folders/zw/_lr62b2s79g3m5ytxlznt01m0000gn/T/codex-clipboard-0b9fae47-d282-4a6c-8f30-747b4548e694.png`，746 × 184 px，横排入口布局参考。
- 顶部保留依据：用户前次提供的 794 × 566 px 截图及 Git HEAD 原顶部模板与样式。
- 实现：`pages/me.vue`；素材：`static/icons/ender-chest.svg`。
- 浏览器：Codex 内置浏览器，现有 UniApp H5 开发构建，独立本地测试数据。
- 本地预览：`http://127.0.0.1:8916/preview?tier=super`。
- Implementation screenshot：`../output/me-redesign-qa/refined-light.png`，外层 811 × 984 px；应用区域 390 × 844 CSS px，裁出为 `refined-mobile.png`。
- Full-view comparison：`../output/me-redesign-qa/refined-comparison.png`。
- Focused comparison：`../output/me-redesign-qa/refined-focus-comparison.png`，横排入口和钱包百分比。
- 窄屏深色截图：`../output/me-redesign-qa/refined-narrow-dark.png`，应用区域 320 × 740 CSS px。
- 密度归一：来源等比缩到 390 px 宽，实现截图裁出 390 px 应用区域。来源只包含入口行，不用于对照顶部和其他分区。

## 视觉复核

- 字体：入口名称居中、统一字号；钱包数字为 37rpx，窄屏 33rpx，百分号 20rpx。84% 显示正确。
- 布局：四个入口单排等宽，没有旧副标题和箭头；钱包维持树场、余额、红石、提现顺序；窄屏无裁切。
- 颜色：保留现有产品色与亮暗模式；可签到沿用红色提示。
- 素材：收藏箱去除原绿色装饰，软化轮廓并增加米白高光、浅棕阴影，图形占位与其他像素素材接近；原 SVG 已通过 XML 校验。
- 文案：按请求依次显示名片、好友、消息、设置；保留产品原有翻译，不复制参考图的业务文案。

## 检查与复查

- 程序比对确认顶部模板未变；四个操作绑定顺序正确。
- Vue SFC、Vue 模板、Dart Sass 与 `git diff --check` 通过。
- 实际点击第三项「消息」，进入既有消息页面。
- 实际查看 390 × 844 亮色与 320 × 740 深色，百分号大小、红色签到与图标均正常。
- 图标首版占位偏小，已收紧 viewBox，并重新截图复查。
- 当前没有树场红点、进度条或原始进度分数显示；加载前百分比显示 `--`。
- 本轮未验证真实充值或提现操作；既有开发环境的 uniCloud／推送及代理热更新提示不在本次修改范围内。

## 实施清单

- [x] 原顶部保持
- [x] 横排顺序正确
- [x] 百分比与小号百分号
- [x] 移除树场进度条和红点
- [x] 红色签到提示保留
- [x] 收藏图标重绘与大小复查
- [x] 窄屏、深色及消息跳转复核

无未解决的 P0 / P1 / P2 问题。

## 入口名称字号统一复查

- 三组入口名称共用一条规则：24rpx、400 字重、1.5 行高；移除上方 26rpx 与窄屏服务区 23rpx 差异。
- 标题、余额和辅助提示继续保持各自信息层级。
- 已查看 390 × 844 浏览器渲染，SFC、SCSS 和差异检查通过。
- 最新截图：`../output/me-redesign-qa/typography-light.png`；局部：`typography-details.png`；来源与实现对照：`typography-comparison.png`。
- 来源为本次用户标红截图，仅针对文字一致性对照；图像按 390 px 宽归一。
- 本轮没有发现需继续修复的 P0 / P1 / P2 问题，final result: passed。

## 背景颜色修订

- 浅色页面背景变量改为 `#F8F8F8`；封面遮罩同步使用 RGB 248,248,248。
- 已在浏览器查看：`../output/me-redesign-qa/background-mobile.png`。截图压缩导致像素取样有轻微偏差，颜色以源码变量为准。
- `git diff --check` 通过；final result: passed。

## 树场文字遮罩与方块粒子

- 百分比增加由下向上的文字填充，颜色按用户后续要求统一为 `#8FDF70`。
- 增加五个绿色方块粒子，随填充边缘向上散射、淡出，位于文字后方。
- 0% 不创建粒子；减少动态效果偏好下保留静态进度。
- 0%、50%、91%、100% 状态已检查，浏览器确认动画运行与位移有效。
- 记录及截图位于 `../output/tree-progress-qa/`，final result: passed。
