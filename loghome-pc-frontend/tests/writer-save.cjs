// Slow-network regression: every service is mocked; no real work is changed.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
process.env.WRITER_TEST_URL = base;
const { api, reader, writers } = require("./writer-browser.cjs");
const { articleTextCount } = require("../../loghome-backend/bin/articleTextCount");
const hash = (content) => crypto.createHash("md5").update(content).digest("hex");
const uploads = [], catalogs = [];
let draftReads = 0, holdUpload, holdReport;
function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}
async function bounded(promise, label) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timed out: ${label}`)), 10000);
    })]);
  } finally { clearTimeout(timer); }
}
async function routeApi(route) {
  const request = route.request(), url = new URL(request.url());
  if (url.origin === new URL(base).origin || request.method() === "OPTIONS") return api(route);
  const name = url.pathname.split("/").pop();
  const reply = (data, status = 200) => route.fulfill({ status,
    contentType: "application/json", body: JSON.stringify(data),
    headers: { "access-control-allow-origin": "*" } });
  if (name === "get_article_writer") {
    draftReads++;
    const writer = writers.get(Number(url.searchParams.get("id")));
    return reply({ ...writer, content_hash: hash(writer.content), supports_conditional_save: true });
  }
  if (name === "get_articles") {
    catalogs.push(url.searchParams.get("catalog_only"));
    return reply([...reader.values()].filter((row) => row.novel_id === 7).map((row) => {
      const writer = writers.get(row.article_id);
      return { ...row, content: undefined, content_hash: hash(row.content),
        article_writer: { title: writer.title, content_hash: hash(writer.content),
          text_count: articleTextCount(writer.content, row.article_type) } };
    }));
  }
  if (name === "upload_article_writer") {
    const body = request.postDataJSON();
    uploads.push(body);
    const current = writers.get(body.article_id);
    if (body.base_writer.content_hash !== hash(current.content) || body.base_writer.title !== current.title)
      return reply({ code: "writer_revision_conflict", msg: "版本冲突" }, 409);
    if (holdUpload) {
      const hold = holdUpload;
      holdUpload = null;
      hold.entered.resolve();
      await hold.released.promise;
    }
    writers.set(body.article_id, { ...current, ...body });
    return reply({ writer_snapshot: { title: body.title, content_hash: hash(body.content) } });
  }
  if (name === "report_novel_writing_activity" && holdReport) {
    await holdReport.promise;
    return reply({ msg: "ok" });
  }
  return api(route);
}
async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => localStorage.setItem("token", JSON.stringify({ tk: "save-test", id: 99 })));
  await context.route("**/*", routeApi);
  const page = await context.newPage(), errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const row = (id) => page.locator(`.catalog-item[data-article-id="${id}"] .catalog-entry`);
  const synced = () => page.getByText("已同步", { exact: true }).waitFor();
  try {
    await page.goto(base + "/write/edit/7?article=11");
    await page.locator(".ProseMirror").waitFor();
    await synced();
    const initialReads = draftReads;
    assert.equal(catalogs[0], "1");
    const first = { entered: deferred(), released: deferred() };
    holdUpload = first;
    const editedAt = Date.now();
    await page.locator(".ProseMirror").fill("第一次修改");
    await bounded(first.entered.promise, "initial autosave request");
    assert.ok(Date.now() - editedAt < 2000, "autosave starts shortly after typing stops");
    await page.getByText("本机已保存 · 云端同步中", { exact: true }).waitFor();
    assert.equal(await row(10).isEnabled(), true);
    await page.locator(".ProseMirror").fill("上传期间继续输入的最新草稿");
    await page.waitForFunction((count) => document.querySelector('[data-article-id="11"] small')?.textContent.replace(/\s+/g, " ").includes(`${count} 字`), "上传期间继续输入的最新草稿".length);
    // Let the next debounce expire while the previous upload is still pending.
    await page.waitForTimeout(1100);
    first.released.resolve();
    await synced();
    assert.equal(uploads.length, 2);
    assert.equal(JSON.parse(writers.get(11).content)[0].value, "上传期间继续输入的最新草稿");
    assert.equal(draftReads, initialReads, "successful saves do not download the full draft again");
    await page.locator(".workspace-header").getByRole("button", { name: "保存", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector(".writer-workspace").__vue__.saving);
    assert.equal(uploads.length, 2, "unchanged snapshots do not write to the cloud");

    const next = { entered: deferred(), released: deferred() };
    holdUpload = next;
    holdReport = deferred();
    await page.locator(".chapter-title").fill("修订后的章节标题");
    await page.locator(".ProseMirror").fill("切换前的修改也要保存");
    await bounded(next.entered.promise, "chapter-switch autosave request");
    await row(10).click();
    next.released.resolve();
    await page.locator(".chapter-title").waitFor();
    await page.waitForFunction(() => document.querySelector(".chapter-title")?.value === "第一章 · 林间来信");
    await synced();
    assert.equal(JSON.parse(writers.get(11).content)[0].value, "切换前的修改也要保存");
    assert.equal(await row(11).locator("strong").innerText(), "修订后的章节标题");
    holdReport.resolve();
    assert.deepEqual(errors, []);
    console.log("PASS fast autosave, single-request uploads, slow-upload trailing edits, live catalog counts, enabled catalog, unchanged-save deduplication, safe chapter switching without waiting for activity reporting");
  } catch (error) {
    console.error({ uploads: uploads.length, draftReads, state: await page.locator(".save-indicator").textContent() });
    await page.screenshot({ path: "/tmp/loghome-writer-save-failure.png" });
    throw error;
  } finally {
    if (holdUpload) holdUpload.released.resolve();
    if (holdReport) holdReport.resolve();
    await browser.close();
  }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
