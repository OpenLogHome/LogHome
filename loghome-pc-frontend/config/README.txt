PC 首页文案配置（人工核对入口）

home-copy.json        首页：首屏、阅读推荐、创作演示、社区、下载、开源共建、FAQ、收尾及 SEO。
site-copy.json        公共导航、搜索、账号菜单、页脚和提示语；修改会同时影响使用默认布局的其他页面。
open-source-copy.json 开源公开信：档案说明、历史正文、参与方式和 SEO。

修改方式
1. 只修改双引号内的文案值，保留字段名、逗号及 JSON 结构。双引号需要写成 \"。
2. 首页按页面顺序分组；FirstLine / SecondLine 为固定换行，titleHighlight 为首屏高亮文字。
3. {name}、{collection}、{version}、{count}、{year} 是动态占位符，可以移动位置，但请保留拼写。
4. steps、stages、ideas、questions 数组可增减；stages 至少保留一项。paths 中的 path 是跳转地址，请勿当作文案修改。
5. 公开信 paragraphs 每个内层数组是一段，按顺序拼接。拆分是为了保留原有加粗和链接；只改文字，不增删片段或段落。participation.items 同样只改文字。
6. 公开信为历史档案，原始日期、数据、许可证描述请结合档案说明核对；页脚备案信息请核实后修改。
7. community.showIdeas 控制社区空状态的示例话题；faq.enabled 控制 FAQ；ending.showDetails 控制底部说明和按钮（false 时显示两行告示牌）。false 为隐藏，true 为显示。download.caption 留空则不显示配图说明。
8. JSON 不支持 // 注释；调整意见请另行记录，不要直接写入配置。
9. 文案作为纯文本渲染，不支持 HTML。开发服务会自动更新；线上环境需要重新构建部署。

范围说明
真实作品名称、作者、简介、专题名、社区帖子、圈子、搜索结果、热门搜索和 Android 版本由后台接口提供。
这些业务内容不在此配置中；配置仅包含静态文案及接口内容缺失时的提示。
logo_new.png 内的品牌字样属于图片资产，装饰箭头、序号等仍由页面控制。
