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
