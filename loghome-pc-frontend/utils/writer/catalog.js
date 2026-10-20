import { countLegacyContent } from "./legacy-adapter";

// Volumes own the consecutive chapters up to the next volume heading.
export function catalogGroups(articles) {
  const groups = [];
  let group = null;
  articles.forEach((item, index) => {
    if (item.article_type === "spliter") {
      group = { id: item.article_id, start: index, end: index, children: [] };
      groups.push(group);
    } else if (group) {
      group.children.push(item.article_id);
      group.end = index;
    }
  });
  return groups;
}

export function catalogRows(articles, collapsed, matches = null) {
  const groups = catalogGroups(articles);
  const metadata = new Map();
  groups.forEach((group) => {
    metadata.set(group.id, { count: group.children.length, parent: null });
    group.children.forEach((id) => metadata.set(id, { parent: group.id }));
  });
  return articles
    .filter((item) => {
      const info = metadata.get(item.article_id) || {};
      if (matches) {
        const group = groups.find((value) => value.id === item.article_id);
        return (
          matches.has(item.article_id) ||
          Boolean(group && group.children.some((id) => matches.has(id)))
        );
      }
      return !info.parent || !collapsed.includes(info.parent);
    })
    .map((item) => ({ item, ...(metadata.get(item.article_id) || {}) }));
}

// Return a full permutation and the visible insertion boundary. Volume moves
// keep their children together, including chapters hidden by a folded heading.
export function moveCatalog(articles, sourceId, targetId, edge) {
  const from = articles.findIndex((item) => item.article_id === sourceId);
  const target = articles.findIndex((item) => item.article_id === targetId);
  if (from < 0 || target < 0 || !["before", "after"].includes(edge))
    return null;
  const groups = catalogGroups(articles);
  const sourceGroup = groups.find((group) => group.id === sourceId);
  const end = sourceGroup ? sourceGroup.end : from;
  if (target >= from && target <= end) return null;
  const targetGroup =
    sourceGroup &&
    groups.find((group) => target >= group.start && target <= group.end);
  const boundary = targetGroup
    ? edge === "before"
      ? targetGroup.start
      : targetGroup.end
    : target;
  const position = boundary + (edge === "after" ? 1 : 0);
  const moved = articles.slice(from, end + 1);
  const remaining = [...articles.slice(0, from), ...articles.slice(end + 1)];
  remaining.splice(
    position > end ? position - moved.length : position,
    0,
    ...moved
  );
  if (
    remaining.every(
      (item, index) => item.article_id === articles[index].article_id
    )
  )
    return null;
  return { rows: remaining, markerId: articles[boundary].article_id, edge };
}

// The list API nests writer metadata; older responses used the flat aliases.
export function normalizeCatalogArticle(item) {
  const writer = item.article_writer;
  if (!writer) return item;
  return {
    ...item,
    writer_title: writer.title,
    writer_content_hash: writer.content_hash,
    writer_text_count: writer.text_count,
  };
}

export function writerTextCount(article) {
  try {
    const content = typeof article.content === "string"
      ? JSON.parse(article.content) : article.content;
    if (article.article_type === "worldVocabulary")
      return content && typeof content.desc === "string" ? content.desc.length : null;
    if (!["richtext", "worldOutline"].includes(article.article_type) || !Array.isArray(content))
      return null;
    return countLegacyContent(content).textCount;
  } catch (_) {
    return null;
  }
}

export function catalogTextCount(item) {
  const count = item.local_writer_text_count ?? item.article_writer?.text_count ??
    item.writer_text_count ?? item.text_count ?? 0;
  return Number(count);
}

export function hasUnpublishedCatalogChanges(item) {
  if (Number(item.is_draft) !== 0 || item.article_type === "spliter")
    return false;
  if (typeof item.local_writer_modified === "boolean")
    return item.local_writer_modified;
  const writer = item.article_writer || {};
  const hash = writer.content_hash || item.writer_content_hash;
  const title = writer.title == null ? item.writer_title : writer.title;
  return Boolean(
    (hash && hash !== item.content_hash) ||
      (title != null && title !== item.title)
  );
}
