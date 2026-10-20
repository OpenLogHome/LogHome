// Use the backend's nested article_writer shape; every API is mocked.
const assert = require("node:assert/strict");
const crypto = require("node:crypto"),
  fs = require("node:fs"),
  path = require("node:path");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
process.env.WRITER_TEST_URL = base;
const { api, reader, writers } = require("./writer-browser.cjs");
const { articleTextCount } = require("../../loghome-backend/bin/articleTextCount");
const seed = reader.get(11);
for (const id of [13, 14]) {
  const article = {
    ...seed,
    article_id: id,
    article_chapter: id - 9,
    title: id === 13 ? "未修改的已发布章节" : "没有作者稿件的章节",
  };
  reader.set(id, article);
  if (id === 13)
    writers.set(id, { ...article, collaboration: { mode: "legacy_lock" } });
}
writers.get(11).content = JSON.stringify([
  { type: "text", value: "这是发布之后编辑的作者稿件。", id: 42 },
]);
reader.get(12).is_draft = 0;
writers.get(12).title = "人物 · 修改后的青禾";
// A published chapter whose latest author draft is empty must display zero.
reader.set(15, { ...seed, article_id: 15, article_chapter: 6, title: "清空后的草稿" });
writers.set(15, { ...reader.get(15), content: "[]" });
const hash = (value) =>
  crypto
    .createHash("md5")
    .update(value || "")
    .digest("hex");
let failPublish = false,
  holdPublish = null;
const publishes = [];
async function routeApi(route) {
  const request = route.request(),
    url = new URL(request.url()),
    name = url.pathname.split("/").pop();
  if (url.origin === new URL(base).origin || request.method() === "OPTIONS")
    return api(route);
  if (name === "get_articles") {
    const rows = [...reader.values()]
      .filter((row) => row.novel_id === 7)
      .map((row) => {
        const writer = writers.get(row.article_id);
        return {
          ...row,
          content: undefined,
          content_hash: hash(row.content),
          collaboration_mode: "legacy_lock",
          article_writer: writer
            ? {
                article_id: row.article_id,
                title: writer.title,
                content_hash: hash(writer.content),
                text_count: articleTextCount(writer.content, row.article_type),
                create_time: writer.create_time,
              }
            : undefined,
        };
      });
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(rows),
      headers: { "access-control-allow-origin": "*" },
    });
  }
  if (name === "modify_article" && request.method() === "POST") {
    const body = request.postDataJSON();
    publishes.push(body);
    if (failPublish)
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ msg: "模拟发布失败" }),
        headers: { "access-control-allow-origin": "*" },
      });
    if (holdPublish) {
      const hold = holdPublish;
      holdPublish = null;
      hold.entered();
      await hold.resumed;
    }
  }
  return api(route);
}
async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await context.addInitScript(() => {
    localStorage.setItem(
      "token",
      JSON.stringify({ tk: "modified-fixture", id: 99 })
    );
    localStorage.setItem(
      "loghome:writer:preferences",
      JSON.stringify({ theme: "dark" })
    );
  });
  await context.route("**/*", routeApi);
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const row = (id) => page.locator(`.catalog-item[data-article-id="${id}"]`);
  const badge = (id) => row(id).locator(".catalog-modified-badge");
  async function count(id, value) {
    await page.waitForFunction(({ id, value }) =>
      document.querySelector(`.catalog-item[data-article-id="${id}"] small`)?.textContent
        .replace(/\s+/g, " ").includes(`· ${value.toLocaleString()} 字`), { id, value });
  }
  const out = path.resolve(__dirname, "../../_tmp/writer-modified");
  fs.mkdirSync(out, { recursive: true });
  async function open(id) {
    await row(id).locator(".catalog-entry").click();
    await page.locator(".chapter-title").waitFor();
  }
  async function publish() {
    await page
      .locator(".workspace-header")
      .getByRole("button", { name: "发布", exact: true })
      .click();
    await page.getByRole("button", { name: "确认发布", exact: true }).click();
  }
  try {
    await page.goto(base + "/write/edit/7");
    await row(14).waitFor();
    await count(11, articleTextCount(writers.get(11).content, "richtext"));
    await count(15, 0);
    await count(14, seed.text_count); // No author draft: published fallback.
    assert.equal(await badge(11).count(), 1);
    assert.equal(await badge(12).count(), 1);
    assert.equal(await badge(10).count(), 0);
    assert.equal(await badge(13).count(), 0);
    assert.equal(await badge(14).count(), 0);
    assert.equal(
      await row(12).locator("strong").innerText(),
      "人物 · 修改后的青禾"
    );
    await page.screenshot({ path: path.join(out, "已发布有修改-深色.png") });
    await open(13);
    const title = await page.locator(".chapter-title").inputValue();
    await page.locator(".chapter-title").fill(title + "（修订）");
    await badge(13).waitFor();
    await page.locator(".chapter-title").fill(title);
    await badge(13).waitFor({ state: "detached" });
    await page.locator(".ProseMirror").press("End");
    await page.locator(".ProseMirror").pressSequentially("新增内容");
    const editedCount = articleTextCount(writers.get(13).content, "richtext") + 4;
    await count(13, editedCount);
    // Refreshing the list while editing must retain the current unsaved count.
    await page.getByRole("button", { name: "刷新目录", exact: true }).click();
    await count(13, editedCount);
    await badge(13).waitFor();
    await page
      .locator(".workspace-header")
      .getByRole("button", { name: "保存", exact: true })
      .click();
    await page.getByText("已同步", { exact: true }).waitFor();
    assert.equal(await badge(13).count(), 1);
    await open(11);
    await count(13, editedCount);
    assert.equal(await badge(13).count(), 1);
    await page.getByRole("button", { name: "刷新目录", exact: true }).click();
    await badge(13).waitFor();
    await count(13, editedCount);
    await open(13);
    failPublish = true;
    await publish();
    await page.getByText("模拟发布失败", { exact: true }).waitFor();
    assert.equal(await badge(13).count(), 1);
    failPublish = false;
    await page.getByRole("button", { name: "确认发布", exact: true }).click();
    await badge(13).waitFor({ state: "detached" });
    assert.equal(await badge(11).count(), 1);
    // A later edit made while publishing must compare against the captured published version.
    await page.locator(".chapter-title").fill(title + "先发布的标题");
    let entered, release;
    const started = new Promise((resolve) => {
      entered = resolve;
    });
    const resumed = new Promise((resolve) => {
      release = resolve;
    });
    holdPublish = { entered, resumed };
    await publish();
    await started;
    await page
      .getByRole("dialog")
      .filter({ hasText: "检查与发布" })
      .locator(".el-dialog__headerbtn")
      .click();
    await page.locator(".chapter-title").fill(title + "发布期间继续编辑");
    release();
    await page.getByText("已发布章节", { exact: true }).last().waitFor();
    await badge(13).waitFor();
    assert.equal(reader.get(13).title, title + "先发布的标题");
    await page.waitForFunction(
      () => !document.querySelector(".workspace-header .el-icon-loading")
    );
    await publish();
    await badge(13).waitFor({ state: "detached" });
    await page.reload();
    await row(14).waitFor();
    await count(13, editedCount);
    await count(15, 0);
    assert.equal(await badge(13).count(), 0);
    assert.equal(await badge(11).count(), 1);
    assert.equal(await badge(12).count(), 1);
    await page.setViewportSize({ width: 900, height: 600 });
    await page.screenshot({ path: path.join(out, "已发布有修改-窄窗口.png") });
    const geometry = await badge(11).evaluate((node) => {
      const row = node.closest(".catalog-item").getBoundingClientRect(),
        rect = node.getBoundingClientRect();
      return {
        inside: rect.left >= row.left && rect.right <= row.right,
        scroll: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.equal(geometry.inside, true);
    assert.equal(geometry.scroll, false);
    assert.deepEqual(errors, []);
    assert.equal(publishes.length, 4);
    console.log(
      "PASS modified badges + draft counts: nested API, unopened/empty drafts, published fallback, live edits, save/switch/refresh/reload, failed/successful publish, in-flight edit, dark + narrow layout"
    );
  } catch (error) {
    await page.screenshot({ path: path.join(out, "failure.png") });
    throw error;
  } finally {
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
