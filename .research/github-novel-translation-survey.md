# GitHub 长篇小说多语言翻译系统调研（LLM 驱动）

> 调研时间：2026-10-03。数据来源：GitHub Search/Repos API 快照 + 各项目 README 原文核实。
> star 数与更新日期为快照当日值。标注 ★ 者为本轮重点核对过 README 的项目。

## 0. 一句话结论

这个赛道**没有"一个成熟的通用工业级方案"**，但按用途分成三档，各自都有能用的东西：

| 档位 | 代表 | 适合谁 |
|---|---|---|
| A. 桌面 / 本地 GUI 精翻工具 | AiNiee、LinguaGacha、Glossarion、Transoria、ebook-GPT-translator、TranslateBooksWithLLMs | 个人译员、给自己翻译整本 EPUB |
| B. 服务端 / 平台化流水线 | noveltrans、docutranslate、inkos | 要做成产品/网站，需要 API、并发、多租户 |
| C. 长篇专用"叙事一致性"引擎（新，架构最对口） | FolioLoom、booktrans、ePubTsuyaku、Turjuman、bookllm | 关心跨章人名/术语/文风漂移，愿意读代码自研 |

另外两类配套件：**专用模型**（SakuraLLM 系列，仅日→中、非商用）、**评测基准**（LNTranslateBench、LiTransProQA）。

---

## 1. 长篇小说「专用」翻译系统（核心清单）

### 1.1 平台 / 服务端向

★ **YuBing-link/noveltrans** — 31★ · Java 21 + Spring Boot + React + Python FastAPI · MIT · 活跃
- 定位：网文翻译 SaaS 后端（多租户、Stripe 订阅、团队协作），**是清单里唯一按生产平台设计的**。
- 关键能力：多引擎编排（LLM + 本地 MTranServer，60 秒滚动窗口概率负载均衡 + 双向故障转移）；**RAG 翻译记忆**（Redis HNSW 向量检索，embedding 语义匹配复用历史译文，明确以省 token 为目标）；章节级流水线。
- 三端接入：React 控制台（类 DeepL 界面 + 章节实时预览）、Chrome MV3 插件（整页/阅读模式/划词）、REST API。
- 自述测试覆盖率 80.5%，有 CI。
- 评价：**如果目标是"给自己平台的小说做批量多语言翻译"，这是最接近可抄的架构参考**；但 star 少、单作者，不能直接依赖上游。

★ **xunbu/docutranslate** — 1.3k★ · Python · MPL-2.0 · 活跃
- 通用文档翻译框架，README 明确把"小说"列为场景并放了小说翻译截图；支持 pdf/docx/xlsx/md/txt/json/epub/srt/ass。
- 关键能力：**自动生成术语表**保证译名对齐；全异步 + 高并发；自定义 prompt；多 AI 平台；**局域网多用户 + Web UI + RESTful API + MCP 扩展**；<40MB 便携包；可 pip 安装当库用。
- 短板：PDF 先转 Markdown，版式会丢；长篇"叙事记忆"能力弱（靠术语表 + 上下文拼接）。

**Narcooo/inkos** — 10.1k★ · TypeScript · AGPL-3.0 · 活跃
- 本质是**小说创作 Agent**（长篇连载/剧本/互动影游），"多语言翻译"是其一条产品线，有 Studio/TUI/CLI 三种形态和网页版。
- 想同时要"写作 + 出海翻译"可看；纯翻译场景偏重。AGPL 对闭源集成不友好。

### 1.2 桌面 / 本地 GUI 精翻（成熟度最高的一档）

★ **NEKOparapa/AiNiee** — 6.3k★ · Python · AGPL-3.0 · 活跃
- 中文圈事实标准之一。一键翻译 EPUB/TXT 小说、游戏文本、字幕、文档。
- 长篇相关能力：**轻盈翻译格式 + 思维链翻译 + AI 术语表 + 上下文关联**；角色介绍/背景设定/翻译风格提示词；一键 AI 润色、一键提取术语。
- 生态：`ShadowLoveElysia/AiNiee-Next`（169★，工程化重构的 CLI 版，**明确面向长时间挂机、服务器部署、自动化工作流**——想服务端化可从它入手）；`xuanji86/ainiee-translate-skill`（31★，AGPL，用 Claude Code 当引擎的 Agent 原生版）。

★ **neavo/LinguaGacha** — 2.5k★ · Python(Electron) · 活跃
- 主打"开箱即用几乎零配置"：**16 种语言一键互译**（中/英/日/韩/俄/德/法/意…）。
- 流程即 `术语提取 → 全文翻译 → 自动审校`；内置 AGENT 模式对话驱动；`.md/.ass/.epub` 样式保留能力强。
- ⚠️ README 明确：**商用需先联系作者取得授权**；发布需注明使用了本项目。

★ **Shirochi-stack/Glossarion** — 118★ · Python/PySide6 · AGPL-3.0 · 非常活跃
- 清单里**多语言方向最完整**的：轻小说/网文/漫画/字幕/歌词/文档，**韩日中三语预置 profile**，40+ 提供商（含 Ollama 本地与任意 OpenAI 兼容端点）。
- 有 EPUB 重建、漫画 `.cbz` 翻译面板、`.sdlxliff` 翻译编辑工具；配完整 User Guide 文档。

★ **oodadoudou/Transoria** — 72★ · Python · 活跃 · macOS/Windows 桌面
- 翻译 + EPUB 编辑二合一。流程：术语提取 → 术语审查（出 XLSX）→ 翻译 → 校对 → 重建 EPUB。
- 值得抄的设计：**按源语言做质检**（低置信度、原文残留、术语异常、疑似重复、模型异常）+ 按条/批量筛选重译；多供应商线路分别设 RPM 上限、额度不足时其他线路接管未发出的分块、失败后可兜底模型补救；请求记录含 token/耗时/失败原因，**截断回复只补发缺失片段**。

★ **daanaagua/FolioLoom** — 202★ · TypeScript 内核 + Python 输入适配 · 活跃 · v1.8.0
- **对"长篇"理解最深的一个**，把长篇工程问题当一等公民：source ledger（哈希 + 位置映射，无损可追溯）、逻辑窗口串行/受控并发 + 断点续跑、实体别名与关系记录、**并行波次间冻结术语锚点抑制名字漂移**、书级风格约束 + 角色声线 + 衰减的局部状态、确定性校验 + 一次有界本地修复、SQLite 状态存储 + 审计报告、EPUB 原模板保真（脚注/反向链接/跨章链接/spine/nav 无效则拒绝导出）。
- 语言 profile：en/de/fr/es/ru/ja/ko；输入 TXT/MD/DOCX/EPUB；Electron 桌面端。
- 自述吞吐基准：100K 字符，德→英《变形记》10′55″、英《Children of Time》第一部 18′56″（v1.5.1 + deepseek-v4-flash，3 并发）。
- ⚠️ 现实约束：仅 Windows x64 便携包且未签名；桌面端**还没有逐段人工改写和批量 review**；语义审校由模型判定，不保证文学质量；单作者，star 少，README 极密集（自述成分需自行验证）。

★ **hydropix/TranslateBooksWithLLMs (TBL)** — 2.5k★ · Python · AGPL-3.0 · 活跃 · Win/macOS 包
- 定位最"傻瓜"的整本翻译：EPUB/SRT/DOCX/PDF/TXT，**无长度上限**，智能分块且段间保上下文；EPUB 样式结构原样还原；checkpoint 续翻。
- **风格预设可复用**（从样书抽取或手写，逐块注入统一语域/节奏/意象）；没有术语表和风格预设时可选 **Auto**，译前各多调一次模型自动派生。
- 附带 wiki 形式的**各目标语言模型质量基准**，选模型时很省事。

★ **jesselau76/ebook-GPT-translator** — 1.7k★ · Python · MIT · 活跃
- v2 已工程化：真正的 CLI + 包结构 + 单测 + CI；TXT/EPUB/DOCX/PDF（+MOBI）→ TXT/EPUB。
- 特色 provider：直接复用 **Codex CLI / Claude Code / Gemini CLI 的订阅登录**（不额外掏 API 钱），也支持 OpenAI/Azure/任意兼容端点/mock。
- **SQLite 可续跑缓存 + manifest**、可配 chunk/token 上限、术语表处理（含 XLSX）、GUI 可跑。
- MIT，是"想读代码学实现/二次开发"的最佳低成本起点。

★ **KazKozDev/book-translator（Tolmach）** — 110★ · Python · AGPL-3.0 · 活跃
- 本地优先（Ollama）整本 TXT/EPUB/PDF/DOCX 文学翻译；文档级术语表、**带护栏的 refine 精修**、逐段双语对照审阅。零依赖启动脚本（自动建 venv、检查模型）。

★ **Tritium0041/ePubTsuyaku** — 21★ · Python · MIT · 活跃
- 长篇 EPUB 流水线设计讲得最清楚，适合当"教科书"读：按 spine 顺序 → summary 阶段**串行**生成每章上下文（防章节乱序导致角色关系/设定漂移）→ 翻译阶段**冻结本章上下文后按批次并发** → 逐批结构化校对，低于阈值自动重翻 → 回写原 XHTML/目录/资源。
- 亮点：`--reference-epub` 用**已精翻的前作**抽取系列惯用译名与文风做软参考（系列作翻译刚需）；`progress.json` 断点续跑；`--provider mock` 离线联调；本地 Web UI。

★ **sukamenev/booktrans** — 43★ · Python · MIT · 活跃
- "一条命令译完整本书"：输入 epub/fb2/html/pdf/md/txt，输出 epub/fb2/html/md/txt/LaTeX/pdf；markup 检测 → 侦察（scout）→ 带上下文翻译 → 脚注 → 编辑 → 组装 → 校验，随时中断可续。
- 运行在 **Claude Code（默认）/ Codex / Gemini CLI(Antigravity) / OpenRouter / 自定义 CLI** 之上；`--bilingual` 直接产出双语书；`--jobs 5` 并发；可用 `instructions.md` 传译者指令。

**其他可参考的同型件**：`YANG-Haruka/LinguaHaru`(293★, GPL-3.0, Office/PDF/TXT 一键)、`abdallah-ali-abdallah/turjuman-book-translator`(182★, LangGraph 双模式：Deep 含术语统一+批判+修订 / Quick 省 token；4 种分块策略含保护代码块的 Smart Mode)、`jb41/translate-book`(88★, MIT)、`purecodework/bookllm`(45★, 术语抽取+审阅+润色流水线)、`chaosen315/AIwork4translator`(22★, 专攻专有名词一致性)、`Mubumbutu/Ebook-Subtitle-Translator`(15★, GPL-3.0)、`K-02-b/novelkit`(11★, **中文网文→地道英文工作台**：全局+作品双层术语库、RAG 消歧、AI 评审 + **回译校对**、逐段精修留痕)、`UrgenProchnoff/prozetta`(10★, 一致性术语表 + 自检质量环)、`luca-dalessandro/gemini-book-translator-2.0`(8★, 自动风格画像 + 上下文感知逐章翻译)、`arved/…` 类小工具一堆（见 `.research/round1.json`、`round2.json` 原始快照，共 215 条记录）。

---

## 2. 相关但**不是**小说专用（易混，注意别选错）

- **immersive-translate/immersive-translate** 19k★：浏览器扩展，网页/PDF/**EPUB**/TXT/字幕双语对照，接入多种 LLM。适合**人读**，不适合产出可发布的整本译文（无术语/角色记忆/审校闭环）。
- **yetone/openai-translator** 25k★：通用翻译工具，非长篇流水线。
- **HIllya51/LunaTranslator** 13.5k★：**视觉小说（Galgame）实时翻译器**，不是长篇小说批处理。
- **GalTransl/GalTransl** 2.3k★ · GPL-3.0：Galgame 内嵌汉化补丁流水线（GPT 字典管人设/人名、译前译后条件字典、缓存续翻、Tauri 桌面端、v8 加了 Agent 模式），也支持 srt/lrc/vtt/mtool json/t++ xlsx/**epub**。长篇小说可借它的"字典 + 提示工程"思路，但形态偏游戏。
- **gnehs/subtitle-translator-electron**(1.7k)、**rockbenben/subtitle-translator**(1.1k)、**llm-subtrans**、**Pandrator**(630)：字幕向。
- **arcusmaximus/VNTranslationTools**、**RenLocalizer**、**textractor-translator**：VN 脚本提取/注入向。
- **quantrancse/epub-translator**(301)：Google 翻译，非 LLM。

---

## 3. 专用模型（不是系统，但常被一起问）

- **SakuraLLM/SakuraLLM** 4.8k★ · GPL-3.0（代码）：**日→中** 轻小说/Galgame 领域翻译模型，7B/14B/32B（Qwen2.5 底模），6G 显存可跑 7B。⚠️ **模型权重 CC BY-NC-SA 4.0，禁止任何形式商用**；发布须标注机翻 + 版本。人称代词/上下文问题是其自述已知短板。
- **SakuraLLM/GalTransl-7B-v2 / Sakura-GalTransl-14B-v3**：视觉小说向，同上非商用。
- 结论：**只覆盖日→中单向**，多语言出海场景基本用不上；本地部署/低成本日译中场景很香。

## 4. 评测基准（选型/验收有用）

- **OpenSakura/LNTranslateBench**：轻小说翻译 LLM-as-a-Judge 基准框架。
- **NL2G/LiTransProQA** (CC0)：LLM 文学翻译质量评测指标（专业问答式）。
- **TranslateBooksWithLLMs wiki**：按目标语言横评模型，偏实用。

---

## 5. 选型建议

### 按需求直接选

| 需求 | 首选 | 备选 |
|---|---|---|
| 个人译整本 EPUB，最省事 | TBL(TranslateBooksWithLLMs) 或 LinguaGacha | ebook-GPT-translator（MIT、可用订阅登录） |
| 多语言方向要全（韩/日/中 ↔ 欧语） | Glossarion | FolioLoom、LinguaHaru |
| 跨章人名/术语/文风不漂移要求最高 | FolioLoom、Transoria | ePubTsuyaku（系列作继承前作译名） |
| 想读代码/二次开发 | jesselau76/ebook-GPT-translator（MIT）、ePubTsuyaku（MIT）、booktrans（MIT） | Turjuman（LangGraph） |
| 服务端/API/平台化 | docutranslate（库化 + REST + 并发） 或 AiNiee-Next（挂机/服务器） | **noveltrans（多租户 + RAG 翻译记忆，架构最对口）** |
| 已有 Claude/Codex/Gemini 订阅，不想付 API 费 | booktrans、ebook-GPT-translator | ainiee-translate-skill |
| 本地离线、不上传 | Tolmach(book-translator)、TBL + Ollama | 配 Sakura 模型（仅日→中，非商用） |

### 若目标是"平台级网文多语言出海"（本仓库 LogHome 场景）

不建议直接用桌面工具，可组一套自己的流水线，抄这三处：
1. **上下文与记忆**：ePubTsuyaku 的「summary 串行冻结 → 批次并发翻译 → 低分自动重翻」节奏；FolioLoom 的「并行波次冻结术语锚点 + 实体别名表 + 审计导出」；Tsukuyomi 的「术语/角色设定/记忆库 + 章节向量混合检索」（0.85 语义 + 0.15 关键词 RRF）与「初翻 → 润色去翻译腔 → 校对查漏译」三段任务分离。
2. **成本与吞吐**：noveltrans 的 RAG 翻译记忆（相似段落复用历史译文）+ 多线路 RPM 配额调度与额度耗尽时的线路接管（Transoria 的做法）；docutranslate 的全异步并发层。
3. **质检闭环**：Transoria 的确定性检查（原文残留/术语异常/疑似重复/低置信度）+ 只重译风险条目；Turjuman 的「术语统一 → 批判 → 修订」与回译校对（novelkit）；产出用 LNTranslateBench / LiTransProQA 抽样验收。

### 许可与合规红线

- **AGPL-3.0**（AiNiee、GalTransl、TBL、Glossarion、Tolmach、inkos、AiNiee-Next、FolioLoom 未标但多为 copyleft，需逐个确认）：做成网络服务需开源改动，商业闭源集成前先评估。相对宽松：**MIT**（ebook-GPT-translator、ePubTsuyaku、booktrans、noveltrans、jb41/translate-book、bookllm）、**MPL-2.0**（docutranslate）、**Apache-2.0**（Tsukuyomi）。
- **LinguaGacha 商用需授权**；**Sakura 系列模型禁止商用**。
- AI 译文发布惯例：**显眼位置标注"AI 机翻 + 模型版本"**，不要标"个人汉化/人工翻译"（GalTransl、SakuraLLM、LinguaGacha 都写进了 README）。
- 翻译整本受版权保护的小说本身是**权利行为**，平台化前必须确认授权链（本项目是社区平台，UGC 授权条款要覆盖 AI 派生翻译）。

### 成熟度的实话

- 这一票里**唯一"star 多 + 长期维护 + 面向长篇"同时满足的，基本只有 AiNiee / LinguaGacha / docutranslate / TBL**，而它们本质是"文档/字幕/游戏通用长文本翻译器 + 小说场景适配"。
- 真正把"长篇叙事一致性"当核心工程问题做的（FolioLoom、booktrans、ePubTsuyaku、prozetta、novelkit）**都在几十到两百 star、多为单作者、半年到一年历史**。可以用，但要有"读完源码、准备自己维护"的心理预期；生产集成时**把它们当参考实现 + 抽换 prompt 与流水线设计**，比当依赖更稳。
- 该领域没有权威 benchmark 与标准术语交换格式（除 `.sdlxliff`，只有 Glossarion 支持），术语表格式各家自定义（XLSX/JSON/YAML/CSV），跨工具迁移基本靠手写导入导出。

---

## 6. 原始数据

- `.research/round1.json`、`.research/round2.json`：GitHub Search API 原始记录（含 star/最近推送/许可证，共 215 条，含大量低 star 长尾项目）。
- `.research/ghsearch.py`：本轮检索脚本，可直接改关键词复跑。
- 检索维度：`novel translator llm` / `light novel translation llm` / `webnovel translator` / `小说 翻译 大模型` / `literature translator llm` / `epub translator llm` / `RAG translation novel` / `book translator epub ollama` / `literary translation agent glossary consistency` / `galgame 翻译 大模型` / topic:`novel-translation`、`book-translation`、`literary-translation`、`epub-translator` 等 30+ 组查询。
