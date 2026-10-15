export function mediaUrls(value) {
  try {
    const list = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(list)
      ? list.filter(
          (url) => typeof url === "string" && /^https?:\/\//i.test(url)
        )
      : [];
  } catch (_) {
    return [];
  }
}
export function normalizePost(post) {
  return {
    ...post,
    media_urls: mediaUrls(post.media_urls),
    like_count: Number(post.like_count) || 0,
    is_liked: Boolean(post.is_liked),
    likePending: false,
  };
}
export function messageTime(value) {
  if (!value) return 0;
  const text = String(value).replace(" ", "T");
  return Date.parse(/Z$|[+-]\d{2}:?\d{2}$/.test(text) ? text : `${text}Z`) || 0;
}
export function notificationGroups(
  messages,
  history = false,
  now = Date.now()
) {
  const groups = new Map();
  messages
    .filter((item) => {
      const archived =
        Number(item.is_read) === 2 ||
        (item.message_type === "notification" &&
          messageTime(item.time) < now - 14 * 86400000);
      return archived === history;
    })
    .forEach((item) => {
      const key = JSON.stringify([
        item.from_id,
        item.message_content,
        item.message_type,
        item.router,
      ]);
      if (!groups.has(key)) groups.set(key, { key, items: [] });
      groups.get(key).items.push(item);
    });
  return [...groups.values()]
    .map((group) => ({
      ...group,
      items: group.items.sort(
        (a, b) => messageTime(b.time) - messageTime(a.time)
      ),
    }))
    .sort(
      (a, b) => messageTime(b.items[0].time) - messageTime(a.items[0].time)
    );
}

export function postShareMessage(post, origin = "https://loghome.ink") {
  const content = String(post.content || "");
  return `来自原木社区的分享：${post.title || ""}\n${content.slice(0, 50)}${
    content.length > 50 ? "..." : ""
  }\n点击链接查看详情：${origin}/community/post/${post.post_id}`;
}
