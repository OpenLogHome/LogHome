// Catalog interactions against mocked services; no real manuscript is modified.
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
process.env.WRITER_TEST_URL = base;
const { api, reader, writers, access } = require("./writer-browser.cjs");
const seed = { ...reader.get(11) };
reader.clear();
writers.clear();
const fixtures = [
  [10, "序言", "richtext"],
  [101, "第一卷 · 林间来信", "spliter"],
  [11, "第二章 · 远方的灯", "richtext"],
  [12, "第三章 · 归途", "richtext"],
  [102, "第二卷 · 群山", "spliter"],
  [103, "第四章 · 星光", "richtext"],
  [104, "第五章 · 清晨", "richtext"],
];
fixtures.forEach(([id, title, type], index) => {
  const item = {
    ...seed,
    article_id: id,
    article_chapter: index + 1,
    title,
    article_type: type,
    is_draft: id === 11 ? 1 : 0,
    content: type === "spliter" ? "[]" : seed.content,
  };
  reader.set(id, item);
  writers.set(id, { ...item, collaboration: { mode: "legacy_lock" } });
});
const writes = [];
let fail = false,
  holdRefresh = null;
async function routeApi(route) {
  const request = route.request(),
    url = new URL(request.url());
  if (url.pathname.endsWith("/get_articles") && holdRefresh) {
    const hold = holdRefresh;
    holdRefresh = null;
    const oldRows = [...reader.values()].map((row) => ({
      ...row,
      content: undefined,
      collaboration_mode: "legacy_lock",
    }));
    hold.entered();
    await hold.resumed;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(oldRows),
      headers: { "access-control-allow-origin": "*" },
    });
  }
  if (url.pathname.endsWith("/resort_article") && request.method() === "POST") {
    const body = request.postDataJSON();
    const rows = JSON.parse(body.sortlist);
    writes.push(rows);
    if (!fail)
      rows.forEach((row) => {
        Object.assign(reader.get(row.article_id), row);
        Object.assign(writers.get(row.article_id), row);
      });
    return route.fulfill({
      status: fail ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify({ msg: fail ? "模拟排序失败" : "success" }),
      headers: { "access-control-allow-origin": "*" },
    });
  }
  return api(route);
}
async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await context.addInitScript(() =>
    localStorage.setItem(
      "token",
      JSON.stringify({ tk: "catalog-fixture", id: 99 })
    )
  );
  await context.route("**/*", routeApi);
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const out = path.resolve(__dirname, "../../_tmp/writer-catalog");
  fs.mkdirSync(out, { recursive: true });
  const row = (id) => page.locator(`.catalog-item[data-article-id="${id}"]`);
  const ids = () =>
    page
      .locator(".catalog-item")
      .evaluateAll((rows) => rows.map((row) => Number(row.dataset.articleId)));
  async function saved(count) {
    await page.waitForFunction(
      (count) =>
        document.querySelectorAll(".writer-notice").length &&
        !document.querySelector(".catalog-sort-status"),
      count
    );
    assert.equal(writes.length, count);
  }
  async function drag(from, to, edge, release = true) {
    await row(from).hover();
    const handle = await row(from).locator(".catalog-menu").boundingBox();
    await page.mouse.move(
      handle.x + handle.width / 2,
      handle.y + handle.height / 2
    );
    await page.mouse.down();
    // Starting the gesture reveals a hint above the list; re-read destination geometry.
    await page.mouse.move(handle.x - 8, handle.y + handle.height / 2, {
      steps: 3,
    });
    await page.waitForSelector(".catalog-drag-label");
    const target = await row(to).boundingBox();
    await page.mouse.move(
      target.x + target.width / 2,
      target.y + (edge === "before" ? 5 : target.height - 5),
      { steps: 10 }
    );
    if (release) await page.mouse.up();
  }
  try {
    await page.goto(base + "/write/edit/7");
    await page.waitForSelector('.catalog-item[data-article-id="104"]');
    assert.deepEqual(
      await ids(),
      fixtures.map((item) => item[0])
    );
    await row(101).locator(".catalog-fold").click();
    assert.equal(await row(11).count(), 0);
    assert.equal(await row(12).count(), 0);
    assert.equal(await row(102).count(), 1);
    await page.screenshot({ path: path.join(out, "分卷折叠.png") });
    await page.locator('[aria-label="搜索章节"]').fill("远方");
    await page.waitForSelector('.catalog-item[data-article-id="11"]');
    assert.deepEqual(await ids(), [101, 11]);
    assert.equal(
      await row(101).locator(".catalog-fold").getAttribute("aria-expanded"),
      "true"
    );
    await page.locator('[aria-label="搜索章节"]').fill("");
    assert.equal(await row(11).count(), 0);
    await page.getByRole("button", { name: "草稿", exact: true }).click();
    assert.deepEqual(await ids(), [101, 11]);
    await page.getByRole("button", { name: "全部", exact: true }).click();
    await row(101).locator(".catalog-fold").click();
    await row(11).locator(".catalog-menu").click();
    assert.equal(await page.getByText("上移", { exact: true }).count(), 0);
    assert.equal(await page.getByText("下移", { exact: true }).count(), 0);
    await page
      .locator(".el-dropdown-menu:visible")
      .getByText("移到回收站", { exact: true })
      .waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await row(11).locator(".catalog-entry").click();
    await page.locator(".ProseMirror[contenteditable=true]").waitFor();
    await page.locator(".ProseMirror").press("End");
    await page.locator(".ProseMirror").pressSequentially("保留当前编辑内容");
    const proseBefore = await page.locator(".ProseMirror").innerText();
    await drag(11, 103, "after", false);
    assert.equal(
      await row(103).evaluate((row) => row.classList.contains("drop-after")),
      true
    );
    await page.screenshot({ path: path.join(out, "拖拽落点.png") });
    await page.mouse.up();
    await saved(1);
    assert.deepEqual(await ids(), [10, 101, 12, 102, 103, 11, 104]);
    assert.equal(await page.locator(".ProseMirror").innerText(), proseBefore);
    assert.equal(
      await row(11).locator(".catalog-entry").getAttribute("aria-current"),
      "page"
    );
    assert.deepEqual(
      writes[0].map((row) => row.article_chapter),
      [1, 2, 3, 4, 5, 6, 7]
    );
    // Moving a folded volume carries its hidden chapters to the next group boundary.
    await row(101).locator(".catalog-fold").click();
    await drag(101, 102, "after");
    await saved(2);
    assert.deepEqual(
      writes[1].map((row) => row.article_id),
      [10, 102, 103, 11, 104, 101, 12]
    );
    assert.equal(await row(12).count(), 0);
    fail = true;
    await drag(104, 103, "before");
    await saved(3);
    assert.deepEqual(await ids(), [10, 102, 103, 11, 104, 101]);
    await page.getByText(/模拟排序失败/).waitFor();
    fail = false;
    await drag(104, 103, "before", false);
    await page.keyboard.press("Escape");
    await page.mouse.up();
    assert.equal(writes.length, 3);
    await drag(104, 103, "before", false);
    await page.mouse.move(700, 500);
    await page.mouse.up();
    assert.equal(writes.length, 3);
    await row(104).locator(".catalog-menu").focus();
    await page.keyboard.press("Alt+Space");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");
    await saved(4);
    assert.deepEqual(
      writes[3].map((row) => row.article_id),
      [10, 102, 103, 104, 11, 101, 12]
    );
    await page.reload();
    await row(101).waitFor();
    assert.equal(await row(12).count(), 0);
    assert.deepEqual(await ids(), [10, 102, 103, 104, 11, 101]);
    // A refresh started before sorting must not restore its stale response later.
    let entered, release;
    const started = new Promise((resolve) => {
      entered = resolve;
    });
    const resumed = new Promise((resolve) => {
      release = resolve;
    });
    holdRefresh = { entered, resumed };
    await page.getByRole("button", { name: "刷新目录", exact: true }).click();
    await started;
    await drag(104, 103, "before");
    await saved(5);
    const oldResponse = page.waitForResponse((response) =>
      response.url().includes("/get_articles?")
    );
    release();
    await oldResponse;
    await page.waitForTimeout(100);
    assert.deepEqual(await ids(), [10, 102, 104, 103, 11, 101]);
    // Auto-scroll while holding the handle in a catalog longer than the viewport.
    for (let i = 0; i < 60; i++) {
      const item = {
        ...seed,
        article_id: 200 + i,
        article_chapter: 8 + i,
        title: `续章 ${i}`,
      };
      reader.set(item.article_id, item);
      writers.set(item.article_id, {
        ...item,
        collaboration: { mode: "legacy_lock" },
      });
    }
    await page.getByRole("button", { name: "刷新目录", exact: true }).click();
    await row(101).locator(".catalog-fold").click();
    await row(10).hover();
    const handle = await row(10).locator(".catalog-menu").boundingBox();
    await page.mouse.move(handle.x + 14, handle.y + 14);
    await page.mouse.down();
    await page.mouse.move(handle.x - 8, handle.y + 14);
    await page.waitForSelector(".catalog-drag-label");
    const list = await page.locator(".catalog-list").boundingBox();
    await page.mouse.move(list.x + list.width / 2, list.y + list.height - 8);
    await page.waitForFunction(
      () => document.querySelector(".catalog-list").scrollTop > 150
    );
    await page.keyboard.press("Escape");
    await page.mouse.up();
    assert.equal(writes.length, 5);
    await page.screenshot({ path: path.join(out, "长目录.png") });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollHeight > window.innerHeight
      ),
      false
    );
    access.can_sort_article = false;
    await page.reload();
    await row(10).waitFor();
    await row(10).hover();
    const deniedHandle = await row(10).locator(".catalog-menu").boundingBox();
    const deniedTarget = await row(102).boundingBox();
    await page.mouse.move(deniedHandle.x + 14, deniedHandle.y + 14);
    await page.mouse.down();
    await page.mouse.move(deniedTarget.x + 80, deniedTarget.y + 20, {
      steps: 8,
    });
    await page.mouse.up();
    assert.equal(writes.length, 5);
    assert.equal(await page.locator(".catalog-drag-label").count(), 0);
    assert.deepEqual(errors, []);
    console.log(
      "PASS catalog: fold/context/persistence, click menu, chapter + folded-volume drag, full-order save, failure rollback, cancel/outside, keyboard, auto-scroll, permission, stale refresh, preserved edited content"
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
