import { validateWriterContent } from "./validate";

// Read-only projection: previewing a saved version never normalizes or rewrites it.
export function writerVersionPreview(article = {}) {
  const result = {
    blocks: [],
    vocabulary: null,
    textCount: 0,
    imageCount: 0,
    error: "",
  };
  try {
    const content = validateWriterContent(article);
    if (article.article_type === "worldVocabulary") {
      const field = (value) =>
        typeof value === "string" || typeof value === "number"
          ? String(value)
          : "";
      const records = (values) =>
        (values || []).filter(
          (value) => value && typeof value === "object" && !Array.isArray(value)
        );
      result.vocabulary = {
        attributes: records(content.attributes).map((item) => ({
          name: field(item.name),
          content: field(item.content),
        })),
        relations: records(content.relations).map((item) => ({
          id: field(item.id),
          name: field(item.name),
          relation: field(item.relation),
        })),
      };
      result.blocks = [
        {
          type: "text",
          value: typeof content.desc === "string" ? content.desc : "",
        },
      ];
      if (typeof content.pic === "string" && content.pic)
        result.blocks.unshift({ type: "image", img: content.pic });
    } else result.blocks = content;
    for (const block of result.blocks) {
      if (block.type === "text")
        result.textCount += Array.from(block.value).length;
      else result.imageCount++;
    }
  } catch (_) {
    result.error = "这个版本暂时无法预览，请导出备份后检查内容。";
  }
  return result;
}

export function versionImageSource(value) {
  return typeof value === "string" &&
    (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value))
    ? value
    : "";
}
