import Dexie from "dexie";
let database;
function db() {
  if (!database) {
    database = new Dexie("loghome-pc-writer");
    database.version(1).stores({
      drafts: "&key,account,articleId,novelId,updatedAt",
      history: "++id,account,articleId,novelId,updatedAt",
    });
  }
  return database;
}
export async function persistWriterDraft(
  account,
  article,
  baseline,
  snapshot = false
) {
  const value = {
    key: `${account}:${article.article_id}`,
    account,
    articleId: Number(article.article_id),
    novelId: Number(article.novel_id),
    title: article.title,
    content: article.content,
    article_type: article.article_type,
    baseline,
    updatedAt: Date.now(),
  };
  await db().drafts.put(value);
  if (snapshot) {
    const { key, ...record } = value;
    await db().history.add(record);
    const history = await db()
      .history.where({ account, articleId: value.articleId })
      .sortBy("updatedAt");
    await db().history.bulkDelete(
      history.slice(0, Math.max(0, history.length - 100)).map((item) => item.id)
    );
  }
  return value;
}
export const readWriterDraft = (account, articleId) =>
  db().drafts.get(`${account}:${articleId}`);
export const listWriterBackups = (account, articleId) =>
  db()
    .history.where({ account, articleId: Number(articleId) })
    .reverse()
    .sortBy("updatedAt");
export const writerSignature = (article) =>
  JSON.stringify([article.title || "", article.content || ""]);
export function writerTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return ["year", "month", "day", "hour", "minute", "second"]
    .map((key) => values[key])
    .join("");
}
