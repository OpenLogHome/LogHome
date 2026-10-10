# 原生写作工作台的阅读预览接口

阅读迁移提供 `components/read/ReaderPreviewDialog.vue`，用于在不卸载编辑器的情况下预览当前未保存正文。原生写作工作台可直接接入：

```vue
<ReaderPreviewDialog v-model="previewOpen" :article="previewArticle" :novel="novel" />
```

```js
import ReaderPreviewDialog from '~/components/read/ReaderPreviewDialog.vue'
// 用户点击“阅读预览”时，将编辑器当前内容生成快照；不触发保存/发布。
this.previewArticle = {
  ...this.article,
  content: this.content, // 使用 docToLegacyBlocks/stringifyLegacyContent 的当前编辑器结果
  title: this.title,
  novel_id: Number(this.novel.novel_id),
  is_draft: 1
}
this.previewOpen = true
```

要求传入正整数 `article_id/novel_id`，章节类型为 richtext/text/worldOutline/worldVocabulary，且章节属于该作品。支持原有纯文本、段落数组与 JSON 包装内容。读入时制作独立快照，24 小时有效，按当前账号隔离；关闭弹层不销毁父编辑器。

组件提供翻页/滚动、完整阅读设置、独立草稿听书。它不调用公开章节加载、阅读统计、经验、评论、划线、反馈、AI 扣费或云进度接口；听书不用全局公开作品队列。字体/皮肤/会员信息是只读请求，外观偏好正常保存。

`storeReaderPreview({article,novel})` / `readReaderPreview(key)` 是底层本机存储接口；独立链接 `/read/preview/<key>` 可用于本机刷新恢复。SSR 仅输出加载外壳并标记 noindex，不输出未发布正文。

旧 iframe 写作页已被并行的原生 WriterWorkspace 迁移替换，旧入口不再由阅读任务覆盖。移动编辑器的帧通信适配仍保留：明确校验父窗口来源，将未保存正文发送到确认过的 PC origin；桌面接收方可使用 `trustedPreviewMessage`。原生工作台直接调用弹层即可，不需要帧通信。

验证：`node tests/reader-preview.cjs` 覆盖本机存储/有效期/账号、帧来源与作品、移动编辑器真实预览方法、原生弹层生命周期、草稿听书与无公开写入、noindex。`tests/fixtures/reader-preview.vue` 只作为临时隔离 Nuxt 测试路由加载，不进入生产路由。
