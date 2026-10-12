// A parse error must never turn an existing manuscript into an empty draft.
export function validateWriterContent(article) {
  let content = article.content;
  try {
    if (typeof content === "string") content = JSON.parse(content);
  } catch (_) {
    throw new Error(
      "正文 JSON 无法解析，已禁止编辑。请先导出原数据或恢复有效版本。"
    );
  }
  if (article.article_type === "worldVocabulary") {
    if (
      !content ||
      Array.isArray(content) ||
      typeof content !== "object" ||
      (content.attributes != null && !Array.isArray(content.attributes)) ||
      (content.relations != null && !Array.isArray(content.relations))
    )
      throw new Error("词条数据结构无效，已禁止编辑");
  } else if (
    !Array.isArray(content) ||
    !content.every(
      (block) =>
        block &&
        ((block.type === "text" && typeof block.value === "string") ||
          (block.type === "image" && typeof block.img === "string"))
    )
  )
    throw new Error("正文段落格式无效，已禁止编辑");
  return content;
}
